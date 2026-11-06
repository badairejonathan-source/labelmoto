'use strict';
/**
 * Label Moto V23.3 - coordinateur DEMO des index publics.
 * Utilise STRICTEMENT le meme document de verrou et le meme schema de journal
 * que src/lib/pro-index-coordination-v23.ts (routes rebuild/prune).
 * AUCUN chemin Cloud : les controles demo sont obligatoires avant toute transaction.
 * Les modifications non cooperantes restent un risque hors de ce perimetre.
 */
const crypto=require('node:crypto');
const v22=require('./pro-deletion-lock-v22.cjs');
const PROJECT='demo-labelmoto-suppression';
const INDEXES=['public/points.json','public/seo-pros.json'];
const LOCK_COLLECTION='index_write_locks_v23';
const LOCK_DOCUMENT='public-indexes';
const MAX_INDEX_BYTES=5*1024*1024;
const UNSAFE_WRITES=new Set(['delete','copy','move','rename','setMetadata','makePublic','createWriteStream']);
function stop(message){throw Error('STOP_V23 : '+message);}
function demoOnly(db,bucket,env){
  if(!env || env.NODE_ENV==='production' || env.LABELMOTO_DELETION_V11_MODE!=='DEMO_ONLY' ||
     env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8787' ||
     env.FIREBASE_STORAGE_EMULATOR_HOST!=='127.0.0.1:9197' ||
     env.FIREBASE_AUTH_EMULATOR_HOST!=='127.0.0.1:9099' ||
     env.GCLOUD_PROJECT!==PROJECT || env.GOOGLE_CLOUD_PROJECT!==PROJECT ||
     env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!==PROJECT || !!env.GOOGLE_APPLICATION_CREDENTIALS ||
     db?.projectId!==PROJECT || bucket?.name!==`${PROJECT}.firebasestorage.app`)
    stop('acces interdit hors emulateurs fictifs');
}
function lockRef(db){return db.collection(LOCK_COLLECTION).doc(LOCK_DOCUMENT);}
function isOwned(s,token,epoch){
  return s.exists && s.get('status')==='held' && s.get('token')===token && s.get('epoch')===epoch;
}
async function acquire(db,token,operation){
  const ref=lockRef(db);
  const epoch=await db.runTransaction(async tx=>{
    const s=await tx.get(ref);
    if(s.exists && s.get('status')!=='released')stop('index occupes ou verrou orphelin, examen manuel');
    const previous=s.exists?s.get('epoch'):0;
    if(!Number.isSafeInteger(previous)||previous<0||previous>=Number.MAX_SAFE_INTEGER)
      stop('epoch index invalide');
    const next=previous+1;
    const state={status:'held',epoch:next,token,operation,writeStarted:false,
      certifiedRGPD:false,startedAt:Date.now(),finishedAt:null};
    if(s.exists) {
      if(s.get('certifiedRGPD')!==false)stop('historique verrou invalide');
      tx.update(ref,state);
    } else tx.create(ref,state);
    return next;
  },{maxAttempts:5});
  return {ref,token,epoch};
}
async function assertHeld(state){
  const s=await state.ref.get();
  if(!isOwned(s,state.token,state.epoch))stop('verrou index perdu');
}
async function markWriteStarted(db,state){
  return db.runTransaction(async tx=>{
    const s=await tx.get(state.ref);
    if(!isOwned(s,state.token,state.epoch))stop('verrou perdu avant ecriture');
    if(s.get('writeStarted')===true)return;
    tx.update(state.ref,{writeStarted:true,writeStartedAt:Date.now()});
  },{maxAttempts:5});
}
async function finalize(db,state,failed){
  await db.runTransaction(async tx=>{
    const s=await tx.get(state.ref);
    if(!isOwned(s,state.token,state.epoch))stop('liberation index interdite');
    const wrote=s.get('writeStarted')===true;
    const status=failed&&wrote?'review_required':'released';
    tx.update(state.ref,{status,token:status==='released'?null:state.token,
      finishedAt:Date.now(),lastOutcome:failed?(wrote?'failed_after_write_started':'failed_before_write'):'completed',
      certifiedRGPD:false});
  },{maxAttempts:5});
}
/** Garde compatible avec IndexWriteCoordinator utilise par les deux vraies routes. */
async function withIndexLockDemo({db,bucket,env=process.env,operation,work,testAfterAcquire}){
  demoOnly(db,bucket,env);
  if(typeof work!=='function'||!['delete','rebuild'].includes(operation))stop('travail invalide');
  if(testAfterAcquire!==undefined && (env.NODE_ENV!=='test'||typeof testAfterAcquire!=='function'))
    stop('hook reserve aux tests');
  const state=await acquire(db,crypto.randomUUID(),operation);
  let writeStarted=false,verified=false,result,failure;
  const guard={
    assertHeld:()=>assertHeld(state),
    markWriteStarted:async()=>{
      // Toute ecriture d'index passe par un marqueur persistant AVANT .save().
      if(!writeStarted) {await markWriteStarted(db,state);writeStarted=true;}
      else await assertHeld(state);
    },
    markVerified:()=>{verified=true;},
  };
  try{
    await guard.assertHeld();
    if(testAfterAcquire)await testAfterAcquire();
    await guard.assertHeld();
    result=await work(guard);
    await guard.assertHeld();
    if(writeStarted&&!verified)stop('ecritures index non verifiees');
  }catch(e){failure=e;}
  try{await finalize(db,state,!!failure);}catch{stop('liberation impossible : examen manuel');}
  if(failure)throw failure;
  return result;
}
/**
 * Interception defensive des mutations des 2 index par V12 -> V21 -> V22.
 * Tous les autres objets (sauvegarde, photos interdites) sont transparents.
 * Des APIs mutantes autres que save() sont volontairement interdites.
 */
function indexGuardedBucket(bucket,guard){
  return new Proxy(bucket,{
    get(target,field){
      if(field==='file')return (pathname,...args)=>{
        const file=target.file(pathname,...args);
        if(!INDEXES.includes(pathname))return file;
        return new Proxy(file,{
          get(obj,method){
            if(method==='save')return async (...params)=>{
              await guard.markWriteStarted();
              await guard.assertHeld();
              return obj.save(...params);
            };
            if(UNSAFE_WRITES.has(method))return ()=>stop('mutation non autorisee sur index');
            const value=Reflect.get(obj,method,obj);
            return typeof value==='function'?value.bind(obj):value;
          },
        });
      };
      const value=Reflect.get(target,field,target);
      return typeof value==='function'?value.bind(target):value;
    },
  });
}
async function executeDemoV23({db,bucket,target,env=process.env,testAfterIndexAcquire,...rest}){
  demoOnly(db,bucket,env);
  if(!target||typeof target!=='object')stop('cible invalide');
  return withIndexLockDemo({db,bucket,env,operation:'delete',testAfterAcquire:testAfterIndexAcquire,
    work:async guard=>{
      const result=await v22.executeDemoV22({db,bucket:indexGuardedBucket(bucket,guard),target,env,...rest});
      if(result?.status!=='completed'||result?.postVerification!==true||result?.backupVerified!==true)
        stop('execution V22 non verifiee');
      // V21 a reverifie les 2 index apres les mutations.
      guard.markVerified();
      return result;
    }});
}
/** Reconstruction strictement fictive ; lit la source seulement apres verrou. */
async function rebuildIndexesDemo({db,bucket,env=process.env,generateIndexes,testAfterIndexAcquire}){
  demoOnly(db,bucket,env);
  if(env.NODE_ENV!=='test'||typeof generateIndexes!=='function')stop('reconstruction reservee au test demo');
  return withIndexLockDemo({db,bucket,env,operation:'rebuild',testAfterAcquire:testAfterIndexAcquire,
    work:async guard=>{
      const source=await generateIndexes();
      if(!source||typeof source!=='object'||Array.isArray(source))stop('reconstruction invalide');
      const before=[];
      for(const pathname of INDEXES){
        const file=bucket.file(pathname);
        const [m1]=await file.getMetadata();
        const [raw]=await file.download();
        const [m2]=await file.getMetadata();
        if(String(m1.generation)!==String(m2.generation))stop('index change pendant lecture');
        if(raw.length>MAX_INDEX_BYTES)stop('index trop volumineux');
        before.push({path:pathname,generation:String(m2.generation),file});
      }
      for(const pathname of INDEXES){
        if(!Array.isArray(source[pathname])||source[pathname].some(x=>!x||typeof x!=='object'||Array.isArray(x)))
          stop('index reconstruit invalide');
        if(Buffer.byteLength(JSON.stringify(source[pathname]))>MAX_INDEX_BYTES)stop('index trop volumineux');
      }
      await guard.markWriteStarted();
      for(const item of before){
        await guard.assertHeld();
        await item.file.save(JSON.stringify(source[item.path]),{
          contentType:'application/json',resumable:false,
          preconditionOpts:{ifGenerationMatch:item.generation},
          metadata:{cacheControl:'public, max-age=60'},
        });
      }
      for(const item of before){
        const [raw]=await item.file.download();
        if(crypto.createHash('sha256').update(raw).digest('hex')!==
           crypto.createHash('sha256').update(JSON.stringify(source[item.path])).digest('hex'))
          stop('index non verifie apres reconstruction');
      }
      await guard.assertHeld();
      guard.markVerified();
      return {updated:[...INDEXES],certifiedRGPD:false};
    }});
}
module.exports={executeDemoV23,withIndexLockDemo,rebuildIndexesDemo,demoOnly,lockRef,indexGuardedBucket};

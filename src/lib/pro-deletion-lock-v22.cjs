'use strict';
/**
 * Label Moto V22 — verrouillage atomique par fiche en ENVIRONNEMENT FICTIF seulement.
 * Ne contient AUCUN mecanisme de deploiement ni de bascule vers Firebase Cloud.
 * Pas de bail expirant ni reprise automatique d'un verrou orphelin : refuse par defaut.
 * IMPORTANT : ce verrou ne remplace pas un fencing token verifie a chaque ecriture.
 * Les controles de version documentaires/index restent dans les moteurs V12/V21.
 */
const crypto = require('node:crypto');
const v21 = require('./pro-deletion-safety-v21.cjs');
const v12 = require('./pro-deletion-demo-v12.cjs');
const PROJECT='demo-labelmoto-suppression';
const BUCKET=`${PROJECT}.firebasestorage.app`;
function stop(message){throw Error('STOP_V22 : '+message);}
function assertDemo({db,bucket,target,env}) {
  if(!env || env.NODE_ENV==='production' ||
     env.LABELMOTO_DELETION_V11_MODE!=='DEMO_ONLY' ||
     env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8787' ||
     env.FIREBASE_STORAGE_EMULATOR_HOST!=='127.0.0.1:9197' ||
     env.FIREBASE_AUTH_EMULATOR_HOST!=='127.0.0.1:9099' ||
     env.GCLOUD_PROJECT!==PROJECT || env.GOOGLE_CLOUD_PROJECT!==PROJECT ||
     env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!==PROJECT ||
     env.GOOGLE_APPLICATION_CREDENTIALS || bucket?.name!==BUCKET)
    stop('hors environnement demo');
  v12.validateEnv(env,db,bucket);
  return v12.validateTarget(target);
}
function refLock(db,target){
  return db.collection('demo_deletion_locks_v22').doc(`${target.collection}__${target.id}`);
}
/** Transaction atomique : a la fois deux appels ne peuvent jamais devenir proprietaires.
 * Un verrou HELD ne peut etre remplace, quelle que soit son anciennete.
 */
async function acquire(db,target,identity,token) {
  const ref=refLock(db,target);
  const epoch=await db.runTransaction(async tx=>{
    const prior=await tx.get(ref);
    if(prior.exists && prior.get('status')!=='released') stop('verrou actif ou orphelin : examen manuel');
    const current=prior.exists ? prior.get('epoch') : 0;
    if(!Number.isSafeInteger(current) || current<0 || current>=Number.MAX_SAFE_INTEGER)
      stop('compteur verrou invalide');
    const next=current+1;
    const data={target:identity,status:'held',ownerToken:token,epoch:next,
      acquiredAt:Date.now(),certifiedRGPD:false};
    if(prior.exists) {
      if(prior.get('target')!==identity || prior.get('certifiedRGPD')!==false)
        stop('historique du verrou incoherent');
      tx.update(ref,data);
    } else tx.create(ref,data);
    return next;
  },{maxAttempts:5});
  return {ref,epoch};
}
async function assertOwned(db,ref,identity,token,epoch){
  const s=await ref.get();
  if(!s.exists || s.get('target')!==identity || s.get('status')!=='held' ||
     s.get('ownerToken')!==token || s.get('epoch')!==epoch || s.get('certifiedRGPD')!==false)
    stop('verrou perdu ou modifie');
}
/** Conserve le document pour l'audit. Ne libere jamais le verrou d'un autre job. */
async function release(db,ref,identity,token,epoch,finishedStatus){
  return db.runTransaction(async tx=>{
    const s=await tx.get(ref);
    if(!s.exists || s.get('target')!==identity || s.get('status')!=='held' ||
       s.get('ownerToken')!==token || s.get('epoch')!==epoch)
      stop('liberation interdite : verrou modifie');
    tx.update(ref,{status:'released',ownerToken:null,finishedAt:Date.now(),
      lastOutcome:finishedStatus,certifiedRGPD:false});
  },{maxAttempts:5});
}
/** Exclusivement pour tests sur emulateurs. Aucune entree utilisateur ne peut fournir ce hook. */
async function executeDemoV22({db,bucket,target,env=process.env,
  injectFailureAfterMainBeforeJournal=false,injectFailureBeforeBackup=false,
  testAfterAcquire}) {
  const identity=assertDemo({db,bucket,target,env});
  if(testAfterAcquire!==undefined &&
      (env.NODE_ENV!=='test' || typeof testAfterAcquire!=='function'))
    stop('hook test interdit');
  const token=crypto.randomUUID();
  const {ref,epoch}=await acquire(db,target,identity,token);
  let outcome='failed';
  let result,executionError;
  try{
    await assertOwned(db,ref,identity,token,epoch);
    if(testAfterAcquire) await testAfterAcquire();
    await assertOwned(db,ref,identity,token,epoch);
    result=await v21.executeDemoV21({db,bucket,target,env,
      injectFailureAfterMainBeforeJournal,injectFailureBeforeBackup});
    await assertOwned(db,ref,identity,token,epoch);
    if(result.certifiedRGPD!==false || result.postVerification!==true ||
       result.backupVerified!==true || result.status!=='completed')
      stop('moteur V21 non verifie');
    outcome='completed';
  } catch(err) {executionError=err;}
  try {await release(db,ref,identity,token,epoch,outcome);}
  catch(lockError) {
    // Si echec de liberation, NE PAS pretendre avoir termine : examen manuel.
    stop('liberation verrou echouee : examen manuel ('+
      (executionError?'execution deja en echec':'execution terminee')+')');
  }
  if(executionError) throw executionError;
  return {status:result.status,alreadyCompleted:!!result.alreadyCompleted,
    postVerification:true,backupVerified:true,lockReleased:true,
    certifiedRGPD:false};
}
module.exports={executeDemoV22,assertDemo,refLock};

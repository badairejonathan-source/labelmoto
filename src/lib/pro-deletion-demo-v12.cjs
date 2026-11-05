'use strict';
/**
 * Label Moto V12 — moteur expérimental. STRICTEMENT émulateurs sur projet demo-.
 * Il NE FAUT PAS le déployer ni le brancher à une fiche réelle.
 * Les collections examinées sont un périmètre technique limité, pas un audit RGPD complet.
 */
const PROJECT = 'demo-labelmoto-suppression';
const STORAGE_BUCKET = `${PROJECT}.firebasestorage.app`;
const HOST_FIRESTORE = '127.0.0.1:8787';
const HOST_STORAGE = '127.0.0.1:9197';
const ALLOWED = new Set(['concessions','associations','relais','creators']);
const INDEXES = ['public/points.json','public/seo-pros.json'];
const MAX_MONTHS = 120;
const MAX_IMAGES = 100;
const MAX_FAVORITES = 500;
const SAFE = /^[A-Za-z0-9_.-]{1,150}$/;
// V16 : demandes de revendication / modification (garde, aucun effacement).
const claimGate = require('./pro-deletion-claims-v16.cjs');
// V17 : verifier les copies administratives avant toute suppression, y compris reprise.
const submissionGate = require('./pro-deletion-submissions-v17.cjs');
function stop(msg) { throw new Error('STOP_V12 : '+msg); }
function validateEnv(e, db, bucket) {
  if (e.FIRESTORE_EMULATOR_HOST !== HOST_FIRESTORE ||
      e.FIREBASE_STORAGE_EMULATOR_HOST !== HOST_STORAGE ||
      e.GCLOUD_PROJECT !== PROJECT || e.GOOGLE_CLOUD_PROJECT !== PROJECT ||
      e.GOOGLE_APPLICATION_CREDENTIALS || db.projectId !== PROJECT ||
      bucket.name !== STORAGE_BUCKET) stop('moteur uniquement autorise sur emulateurs demo');
  if (e.FIREBASE_CONFIG) {
    let config;
    try {config = JSON.parse(e.FIREBASE_CONFIG);} catch {stop('FIREBASE_CONFIG illisible');}
    if (!config || config.projectId !== PROJECT ||
        (config.storageBucket && ![STORAGE_BUCKET, `${PROJECT}.appspot.com`].includes(config.storageBucket)) ||
        (config.databaseURL && config.databaseURL !== `https://${PROJECT}.firebaseio.com`)) {
      stop('FIREBASE_CONFIG hors demo');
    }
  }
}
function validateTarget(t) {
  if (!t || !ALLOWED.has(t.collection) || !SAFE.test(t.id) ||
      t.id.includes('..') || !t.id.startsWith('demo-')) stop('cible non fictive ou invalide');
  return `${t.collection}/${t.id}`;
}
function identityDoc(snap,t,kind) {
  if (!snap.exists) return;
  const d = snap.data() || {};
  const key = validateTarget(t);
  const ok = kind === 'main' ? d.id === t.id && d.collection === t.collection :
    kind === 'monthly' ? d.proId === t.id && d.collection === t.collection :
    kind === 'cache' ? d.id === t.id && d.sourceCollection === t.collection :
    kind === 'history' ? d.listingKey === key :
    kind === 'favorite' ? d.type === 'professional' && d.targetId === t.id &&
       d.targetCollection === t.collection && snap.ref.path.endsWith(`/favorites/${t.collection}__${t.id}`) : false;
  if (!ok) stop(`appartenance non prouvee : ${kind}, ${snap.ref.path}`);
}
function stepDoc(kind, snap) {return {type:'doc',kind,path:snap.ref.path,version:snap.updateTime.toMillis()};}
function validateStoredPlan(plan,t) {
  if (!Array.isArray(plan) || plan.length>MAX_FAVORITES+MAX_MONTHS+MAX_IMAGES+100 || !plan.length) stop('journal invalide');
  const paths=new Set();
  for (const s of plan) {
    if (!s || typeof s.path!=='string' || paths.has(`${s.type}:${s.path}`)) stop('journal duplique ou invalide');
    paths.add(`${s.type}:${s.path}`);
    if (s.type==='doc') {
      if (!['main','monthly','cache','history','favorite'].includes(s.kind) ||
          !Number.isFinite(s.version)) stop('journal document invalide');
      if (s.kind==='main' && s.path !== validateTarget(t)) stop('journal cible principale incorrecte');
      if (s.kind==='monthly' && !new RegExp(`^pro_stats_monthly/\\d{4}-\\d{2}/pros/${t.collection}__${t.id}$`).test(s.path)) stop('journal mois incorrect');
      if (s.kind==='cache' && s.path!==`cache/map-live-${t.collection}-${t.id}`) stop('journal cache incorrect');
      if (s.kind==='history' && !/^listing_history\/[A-Za-z0-9_.-]+$/.test(s.path)) stop('journal historique incorrect');
      if (s.kind==='favorite' && !new RegExp(`^users/[A-Za-z0-9_.-]+/favorites/${t.collection}__${t.id}$`).test(s.path)) stop('journal favori incorrect');
    } else if (s.type==='image') {
      if (!s.path.startsWith(`pros/${t.collection}/${t.id}/`) || s.path.includes('..') || !/^\d+$/.test(s.generation)) stop('journal image incorrecte');
    } else if (s.type==='index') {
      if (!INDEXES.includes(s.path)) stop('journal index incorrect');
    } else stop('type de journal inconnu');
  }
  if (plan.filter(s=>s.type==='doc' && s.kind==='main').length!==1 ||
      plan.filter(s=>s.type==='index').length!==INDEXES.length) stop('plan incomplet');
  // Fiche principale toujours à la fin.
  if (plan[plan.length-1].kind!=='main') stop('fiche principale pas en dernier');
}
function owner(indexItem,kind) {
  if (kind==='seo') return indexItem.collection;
  switch(indexItem.a) {
    case 'service': case 'shopping': case 'both': case 'concession': return 'concessions';
    case 'association': return 'associations';
    case 'relais': return 'relais';
    case 'creator': return 'creators';
    default: return null;
  }
}
function filteredIndex(raw,t,kind) {
  if (!Array.isArray(raw) || raw.some(x=>!x || typeof x!=='object' || Array.isArray(x))) stop('format index inconnu');
  let removed=0;
  const next=raw.filter(x=>{
    if (x.id!==t.id) return true;
    const own=owner(x,kind);
    if (!own || !ALLOWED.has(own)) stop('index a appartenance ambigue');
    if (own!==t.collection) return true;
    removed++;return false;
  });
  if (removed>1) stop('index contient des doublons de cible');
  return {removed,next};
}
async function imageMetadata(file) {
  const [exists] = await file.exists();
  if (!exists) return null;
  const [m] = await file.getMetadata();
  return m;
}
function validateImage(meta,t,path) {
  const props=meta.metadata || {};
  if (props.ownerId !== t.id || props.ownerCollection !== t.collection || props.exclusive !== 'true')
    stop(`image non prouvee exclusive : ${path}`);
}
async function listMonths(db) {
  const refs=await db.collection('pro_stats_monthly').listDocuments();
  if (refs.length>MAX_MONTHS) stop('trop de mois: audit manuel requis');
  const names=refs.map(r=>r.id);
  if (names.some(m=>!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(m)) || new Set(names).size!==names.length) stop('mois inconnus');
  return names.sort();
}
/** Inventaire dérivé du serveur, jamais des listes months/images du navigateur. */
async function inventory(db,bucket,t, allowMissingMain=false) {
  const key=validateTarget(t);
  const main=await db.doc(key).get();
  if (!main.exists && !allowMissingMain) stop('fiche principale absente sans journal de reprise');
  identityDoc(main,t,'main');
  if ((await main.ref.listCollections()).length) stop('sous-collections directes a examiner');
  const months=await listMonths(db);
  const monthlySnaps=await Promise.all(months.map(m=>db.doc(`pro_stats_monthly/${m}/pros/${t.collection}__${t.id}`).get()));
  const cacheSnap=await db.doc(`cache/map-live-${t.collection}-${t.id}`).get();
  const [history, favorites, submissions, changes, imagesResult] = await Promise.all([
    db.collection('listing_history').where('listingKey','==',key).get(),
    db.collectionGroup('favorites').where('targetId','==',t.id).get(),
    db.collection('listing_submissions').where('publishedDocId','==',t.id).limit(submissionGate.MAX_CANDIDATES + 1).get(),
    db.collection('modification_requests').where('targetId','==',t.id).limit(claimGate.MAX_CANDIDATES + 1).get(),
    bucket.getFiles({prefix:`pros/${t.collection}/${t.id}/`}),
  ]);
  // Ne pas effacer des preuves ou copies administratives sans cadre légal documenté.
  // V16 : un dossier administratif lie/ambigu bloque, meme si la fiche a deja disparu.
  // Les dossiers d'une autre collection portant le meme ID restent intacts.
  claimGate.assertNoAssociatedRequests(changes,t);
  submissionGate.assertNoAssociatedSubmissions(submissions,t);
  if (favorites.size>MAX_FAVORITES) stop('trop de favoris associes: inventaire borne');
  if (!Array.isArray(imagesResult[0]) || imagesResult[0].length>MAX_IMAGES) stop('trop images ou inventaire Storage invalide');
  const plan=[];
  for (const path of INDEXES) {
    const file=bucket.file(path),meta=await imageMetadata(file);
    if (!meta) stop('index public manquant : '+path);
    const [buffer]=await file.download();
    filteredIndex(JSON.parse(buffer.toString('utf8')),t,path.endsWith('points.json')?'points':'seo');
    plan.push({type:'index',path});
  }
  for (const file of imagesResult[0]) {
    if (!file.name.startsWith(`pros/${t.collection}/${t.id}/`)) stop('fichier hors prefixe');
    const meta=await imageMetadata(file);
    if (!meta) continue;
    validateImage(meta,t,file.name);
    plan.push({type:'image',path:file.name,generation:String(meta.generation)});
  }
  for (const snap of monthlySnaps) {
    identityDoc(snap,t,'monthly');
    if(snap.exists)plan.push(stepDoc('monthly',snap));
  }
  identityDoc(cacheSnap,t,'cache');
  if(cacheSnap.exists)plan.push(stepDoc('cache',cacheSnap));
  for(const snap of history.docs) {
    identityDoc(snap,t,'history');
    plan.push(stepDoc('history',snap));
  }
  for(const snap of favorites.docs) {
    const d=snap.data()||{};
    if(d.targetCollection!==t.collection) continue;
    identityDoc(snap,t,'favorite');
    plan.push(stepDoc('favorite',snap));
  }
  if(main.exists) plan.push(stepDoc('main',main));
  return {plan,mainExists:main.exists};
}
function uniqueActions(a){return new Set(a.map(s=>`${s.type}:${s.path}`));}
async function assertNoNewActions(db,bucket,t,oldPlan) {
  const current=await inventory(db,bucket,t,true);
  const orig=uniqueActions(oldPlan);
  // Après démarrage, de nouveaux documents/images inconnus interdisent une fin silencieuse.
  for (const s of current.plan) if(!orig.has(`${s.type}:${s.path}`)) stop('nouvelle donnee associee detectee : '+s.path);
  return current;
}
async function applyStep(db,bucket,t,step) {
  if(step.type==='doc') {
    const snap=await db.doc(step.path).get();
    if(!snap.exists) return;
    identityDoc(snap,t,step.kind);
    if(snap.updateTime.toMillis()!==step.version) stop('document modifie depuis inventaire : '+step.path);
    if(step.kind==='main' && (await snap.ref.listCollections()).length) stop('nouvelles sous-collections');
    await snap.ref.delete({lastUpdateTime:snap.updateTime});
  } else if(step.type==='image') {
    const file=bucket.file(step.path),meta=await imageMetadata(file);
    if(!meta) return;
    validateImage(meta,t,step.path);
    if(String(meta.generation)!==step.generation) stop('image modifiee depuis inventaire');
    await file.delete({ifGenerationMatch:step.generation});
  } else if(step.type==='index') {
    const file=bucket.file(step.path),meta=await imageMetadata(file);
    if(!meta) stop('index disparu');
    const [buffer]=await file.download();
    const next=filteredIndex(JSON.parse(buffer.toString('utf8')),t,step.path.endsWith('points.json')?'points':'seo');
    if(next.removed) await file.save(JSON.stringify(next.next),{
      contentType:'application/json',preconditionOpts:{ifGenerationMatch:String(meta.generation)},
      metadata:{cacheControl:'public, max-age=60'},
    });
  }
}
/**
 * Simulation avec vrai SDK sur émulateur local.
 * Le journal persiste le plan ANTERIEUR aux premières suppressions : la reprise
 * n'a plus besoin de retrouver la fiche principale dans Firestore.
 */
async function executeDemoV12({db,bucket,target,env=process.env,injectFailureAfterMainBeforeJournal=false}) {
  validateEnv(env,db,bucket);
  const identity=validateTarget(target);
  const journalRef=db.collection('demo_deletion_jobs_v12').doc(`${target.collection}__${target.id}`);
  const snap=await journalRef.get();
  let plan,done;
  if(!snap.exists) {
    const inv=await inventory(db,bucket,target,false);
    plan=inv.plan;
    validateStoredPlan(plan,target);
    // create atomique : en cas de course, arrêt plutôt que lancer 2 jobs.
    await journalRef.create({target:identity,status:'running',plan,completed:[],startedAt:Date.now(),certifiedRGPD:false});
    done=new Set();
  } else {
    if(snap.get('target')!==identity) stop('journal rattache a une autre cible');
    plan=snap.get('plan');validateStoredPlan(plan,target);
    if(!Array.isArray(snap.get('completed')) ||
       snap.get('completed').some(x=>typeof x!=='string')) stop('jalons du journal invalides');
    done=new Set(snap.get('completed'));
    if(snap.get('status')==='completed') {
      const fresh=await assertNoNewActions(db,bucket,target,plan);
      if(fresh.plan.some(s=>s.type==='doc' || s.type==='image')) stop('journal complet mais residus presents');
      const presence=await db.doc(identity).get();
      if(presence.exists) stop('journal complet mais fiche presente');
      return {status:'completed',alreadyCompleted:true,certifiedRGPD:false};
    }
    if(!['partial','running'].includes(snap.get('status'))) stop('statut de reprise inconnu');
    await assertNoNewActions(db,bucket,target,plan);
  }
  try {
    for(const step of plan) {
      const key=`${step.type}:${step.path}`;
      if(done.has(key)) continue;
      await applyStep(db,bucket,target,step);
      if(step.kind==='main' && injectFailureAfterMainBeforeJournal) {
        throw Error('ECHEC_INJECTE_APRES_SUPPRESSION_FICHE_AVANT_JOURNAL');
      }
      done.add(key);
      await journalRef.update({status:'running',completed:[...done],updatedAt:Date.now()});
    }
    const remainder=await assertNoNewActions(db,bucket,target,plan);
    if(remainder.plan.some(s=>s.type==='doc' || s.type==='image') || remainder.mainExists)
      stop('verification finale : donnees residuelles');
    // Les index sont aussi vérifiés par l’inventaire mais contrôler l’absence réelle d’ID.
    for(const pathname of INDEXES) {
      const [buf]=await bucket.file(pathname).download();
      if(filteredIndex(JSON.parse(buf.toString('utf8')),target,pathname.endsWith('points.json')?'points':'seo').removed)
        stop('verification finale : entree index residuelle');
    }
    await journalRef.update({status:'completed',completed:[...done],finishedAt:Date.now(),certifiedRGPD:false});
    return {status:'completed',alreadyCompleted:false,operations:[...done],certifiedRGPD:false};
  } catch(err) {
    try {await journalRef.update({status:'partial',completed:[...done],lastError:String(err.message||err).slice(0,250)});} catch {}
    throw err;
  }
}
module.exports={validateEnv,validateTarget,filteredIndex,inventory,executeDemoV12};

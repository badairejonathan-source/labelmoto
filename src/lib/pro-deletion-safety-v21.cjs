'use strict';
/**
 * Label Moto V21 — sauvegarde + reprise et verification DEMO uniquement.
 * Ne prend aucune decision RGPD, ne doit jamais etre deploye ou utilise en Cloud.
 * Les photos/commentaires sont REPORTES et ne sont pas supprimes par ce wrapper.
 */
const crypto = require('node:crypto');
const engine = require('./pro-deletion-demo-v12.cjs');
const PROJECT = 'demo-labelmoto-suppression';
const BUCKET = `${PROJECT}.firebasestorage.app`;
const MAX_DOCS = 800;
const MAX_DOC_BYTES = 6 * 1024 * 1024;
const MAX_INDEX_BYTES = 5 * 1024 * 1024;
const MAX_BACKUP_BYTES = 17 * 1024 * 1024;
const MAX_DEPTH = 24;
const INDEX_PATHS = ['public/points.json', 'public/seo-pros.json'];
function stop(reason) { throw Error('STOP_V21 : ' + reason); }
function sha(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function stepKey(s) { return `${s.type}:${s.path}`; }
function stableJSON(value) {
  if(Array.isArray(value)) return '['+value.map(stableJSON).join(',')+']';
  if(value && typeof value==='object') return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stableJSON(value[k])).join(',')+'}';
  return JSON.stringify(value);
}
function planHash(plan) { return sha(Buffer.from(stableJSON(plan), 'utf8')); }
function assertDemo({db,bucket,target,env=process.env}) {
  if (!env || env.NODE_ENV === 'production' || env.LABELMOTO_DELETION_V11_MODE !== 'DEMO_ONLY' ||
      env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099' ||
      env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== PROJECT ||
      env.GOOGLE_APPLICATION_CREDENTIALS || bucket?.name !== BUCKET) stop('acces interdit hors demo');
  engine.validateEnv(env, db, bucket);
  return engine.validateTarget(target);
}
// Encode les types Firestore connus; tout type inattendu fait echouer la sauvegarde.
// Tags explicites sur chaque valeur : aucune collision avec les champs des utilisateurs.
function encode(v, depth=0) {
  if(depth > MAX_DEPTH) stop('document trop imbrique');
  if(v === null) return ['null'];
  if(typeof v === 'string') return ['str', v];
  if(typeof v === 'boolean') return ['bool', v];
  if(typeof v === 'number' && Number.isFinite(v)) return ['num', v];
  if(v === undefined) stop('champ undefined non sauvegardable');
  if(typeof v !== 'object') stop('type Firestore non pris en charge');
  if(Buffer.isBuffer(v) || v instanceof Uint8Array) return ['bytes', Buffer.from(v).toString('base64')];
  if(v instanceof Date) return ['date', v.toISOString()];
  if(Array.isArray(v)) return ['array', v.map(x=>encode(x,depth+1))];
  const kind = v.constructor?.name;
  if(kind === 'Timestamp' && Number.isInteger(v.seconds) && Number.isInteger(v.nanoseconds))
    return ['timestamp', v.seconds, v.nanoseconds];
  if(kind === 'GeoPoint' && typeof v.latitude === 'number' && typeof v.longitude === 'number')
    return ['geopoint', v.latitude, v.longitude];
  if(kind === 'DocumentReference' && typeof v.path === 'string')
    return ['reference', v.path];
  if(kind !== 'Object' && Object.getPrototypeOf(v) !== null) stop('objet Firestore de type inconnu');
  const items = Object.keys(v).sort().map(k=>[k,encode(v[k],depth+1)]);
  return ['map',items];
}
function assertPlan(plan,target) {
  if(!Array.isArray(plan) || plan.length === 0 || plan.length > MAX_DOCS+2) stop('plan invalide ou trop volumineux');
  if(plan.some(s=>s.type==='image')) stop('photos hors perimetre V21 : operation bloquee');
  if(plan.some(s=>s.type!=='doc' && s.type!=='index')) stop('operation inattendue');
  if(plan.filter(s=>s.kind==='main' && s.path===`${target.collection}/${target.id}`).length!==1) stop('fiche principale absente');
  if(plan.filter(s=>s.type==='index').length !== INDEX_PATHS.length) stop('index absents du plan');
  if(new Set(plan.map(stepKey)).size !== plan.length) stop('operations dupliquees');
}
function refs(db,target) {
  const id = `${target.collection}__${target.id}`;
  return {
    manifest: db.collection('demo_deletion_manifests_v21').doc(id),
    job: db.collection('demo_deletion_jobs_v12').doc(id),
    backupPath: `demo_deletion_backups_v21/${id}.json`,
  };
}
async function readBackup(bucket,path,expectedSha,expectedGeneration) {
  const file=bucket.file(path);
  const [meta]=await file.getMetadata();
  if(String(meta.generation)!==String(expectedGeneration)) stop('generation sauvegarde modifiee');
  const [data]=await file.download();
  if(data.length>MAX_BACKUP_BYTES || sha(data)!==expectedSha) stop('integrite sauvegarde invalide');
  let backup;
  try {backup=JSON.parse(data.toString('utf8'));} catch {stop('sauvegarde illisible');}
  if(backup.schema!=='labelmoto-demo-v21' || backup.certifiedRGPD!==false || !Array.isArray(backup.docs)) stop('format sauvegarde inconnu');
  return backup;
}
async function snapshot(db,bucket,target,plan) {
  const docs=[],indexes=[];
  let total=0;
  for(const step of plan) if(step.type==='doc') {
    const s=await db.doc(step.path).get();
    if(!s.exists || !s.updateTime || s.updateTime.toMillis()!==step.version) stop('document change avant sauvegarde');
    const encoded=encode(s.data());
    const item={path:step.path,version:step.version,data:encoded};
    total+=Buffer.byteLength(JSON.stringify(item));
    if(total>MAX_DOC_BYTES) stop('documents trop volumineux');
    docs.push(item);
  }
  for(const path of INDEX_PATHS) {
    const f=bucket.file(path);
    const [meta1]=await f.getMetadata();
    const [bytes]=await f.download();
    const [meta2]=await f.getMetadata();
    if(String(meta1.generation)!==String(meta2.generation)) stop('index modifie pendant la sauvegarde');
    if(bytes.length>MAX_INDEX_BYTES) stop('index trop volumineux');
    total+=bytes.length;
    if(total>MAX_BACKUP_BYTES) stop('sauvegarde trop volumineuse');
    indexes.push({path,generation:String(meta1.generation),sha256:sha(bytes),contentBase64:bytes.toString('base64')});
  }
  return {schema:'labelmoto-demo-v21',target:`${target.collection}/${target.id}`,
    plan,planSha256:planHash(plan),docs,indexes,certifiedRGPD:false};
}
async function assertPlanUnchanged(db,bucket,target,backup) {
  const inv=await engine.inventory(db,bucket,target,false);
  assertPlan(inv.plan,target);
  if(planHash(inv.plan)!==backup.planSha256) stop('inventaire change depuis sauvegarde');
  for(const x of backup.indexes) {
    const [meta]=await bucket.file(x.path).getMetadata();
    if(String(meta.generation)!==x.generation) stop('index change depuis sauvegarde');
  }
}
async function verifyAfter(db,bucket,target,backup) {
  const {job}=refs(db,target);
  const s=await job.get();
  if(!s.exists || s.get('status')!=='completed' || planHash(s.get('plan'))!==backup.planSha256)
    stop('journal incomplet ou plan different');
  const completed=s.get('completed');
  if(!Array.isArray(completed) || new Set(completed).size!==completed.length ||
      backup.plan.some(step=>!completed.includes(stepKey(step)))) stop('operations non journalisees');
  for(const doc of backup.docs) if((await db.doc(doc.path).get()).exists)
    stop('document residuel apres execution');
  for(const pathname of INDEX_PATHS) {
    const [content]=await bucket.file(pathname).download();
    let arr;
    try{arr=JSON.parse(content.toString('utf8'));}catch{stop('index final invalide');}
    if(engine.filteredIndex(arr,target,pathname.endsWith('points.json')?'points':'seo').removed)
      stop('index conserve une entree cible');
  }
  // Protection explicite : aucun statut RGPD-complet dans le journal.
  if(s.get('certifiedRGPD')!==false) stop('marquage RGPD incorrect');
  return {documentsVerifies:backup.docs.length,indexVerifies:INDEX_PATHS.length};
}
/**
 * Cette passerelle DEMO ajoute une sauvegarde immuable, une empreinte et une
 * verification du journal au moteur V12/V17. Aucun chemin d'activation Cloud.
 */
async function executeDemoV21({db,bucket,target,env=process.env,
  injectFailureAfterMainBeforeJournal=false,injectFailureBeforeBackup=false}) {
  const identity=assertDemo({db,bucket,target,env});
  const {manifest,job,backupPath}=refs(db,target);
  const existing=await manifest.get();
  const currentJob=await job.get();
  let backup,backupMeta;
  if(!existing.exists) {
    if(currentJob.exists) stop('journal anterieur sans sauvegarde V21 : examen manuel');
    const inv=await engine.inventory(db,bucket,target,false);
    assertPlan(inv.plan,target);
    backup=await snapshot(db,bucket,target,inv.plan);
    const raw=Buffer.from(JSON.stringify(backup));
    if(raw.length>MAX_BACKUP_BYTES) stop('archive trop volumineuse');
    if(injectFailureBeforeBackup) stop('panne de test avant sauvegarde');
    // 0 = creation seulement, jamais ecraser une sauvegarde existante.
    await bucket.file(backupPath).save(raw,{
      contentType:'application/json',resumable:false,
      preconditionOpts:{ifGenerationMatch:0},
      metadata:{metadata:{demoOnly:'true',ownerCollection:target.collection,ownerId:target.id}},
    });
    const [m]=await bucket.file(backupPath).getMetadata();
    backupMeta={sha256:sha(raw),generation:String(m.generation),path:backupPath};
    const written=await readBackup(bucket,backupPath,backupMeta.sha256,backupMeta.generation);
    if(written.planSha256!==backup.planSha256) stop('lecture sauvegarde incoherente');
    await manifest.create({target:identity,backup:backupMeta,planSha256:backup.planSha256,
      status:'prepared',createdAt:Date.now(),certifiedRGPD:false});
  } else {
    if(existing.get('target')!==identity || existing.get('certifiedRGPD')!==false) stop('manifest cible/status incorrect');
    backupMeta=existing.get('backup');
    if(!backupMeta || backupMeta.path!==backupPath || !/^[a-f0-9]{64}$/.test(backupMeta.sha256)) stop('reference backup incorrecte');
    backup=await readBackup(bucket,backupPath,backupMeta.sha256,backupMeta.generation);
    if(backup.target!==identity || backup.planSha256!==existing.get('planSha256') ||
       backup.planSha256!==planHash(backup.plan)) stop('manifest et plan de sauvegarde incoherents');
    if(backup.plan.some(s=>s.type==='image')) stop('images interdites au traitement V21');
    if(currentJob.exists && planHash(currentJob.get('plan'))!==backup.planSha256) stop('journal different de la sauvegarde');
  }
  if(!currentJob.exists) await assertPlanUnchanged(db,bucket,target,backup);
  let result;
  try {
    result=await engine.executeDemoV12({db,bucket,target,env,injectFailureAfterMainBeforeJournal});
    const verified=await verifyAfter(db,bucket,target,backup);
    await manifest.update({status:'completed',verifiedAt:Date.now(),verified,
      certifiedRGPD:false});
    return {status:result.status,alreadyCompleted:!!result.alreadyCompleted,
      backupVerified:true,postVerification:true,certifiedRGPD:false};
  } catch(err) {
    // Pas de donnee personnelle ni de stack trace dans le journal.
    try {await manifest.update({status:'needs_review',lastErrorCode:'V21_INTERRUPTED',updatedAt:Date.now()});}catch{}
    throw err;
  }
}
module.exports={executeDemoV21,encode,planHash,assertPlan};

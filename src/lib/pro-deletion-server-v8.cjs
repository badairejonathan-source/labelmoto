'use strict';
/**
 * LABEL MOTO V8 - EXECUTEUR REEL, MAIS STRICTEMENT EMULATEURS DEMO.
 * N'EST PAS branche au bouton d'administration ou aux routes Next.js.
 * Interdiction absolue d'utiliser un projet de production.
 * Le nettoyage n'est pas un certificat RGPD: copies, caches externes, sauvegardes
 * et fichiers non declares restent hors du perimetre.
 */
const PROJECT = 'demo-labelmoto-suppression';
const FIRESTORE_HOST = '127.0.0.1:8787';
const STORAGE_HOST = '127.0.0.1:9197';
const COLLECTIONS = new Set(['concessions', 'associations', 'relais', 'creators']);
const SAFE = /^[A-Za-z0-9_.-]{1,150}$/;
const INDEXES = ['public/points.json', 'public/seo-pros.json'];

function guard(env, db, bucket) {
  if (env.FIRESTORE_EMULATOR_HOST !== FIRESTORE_HOST ||
      env.FIREBASE_STORAGE_EMULATOR_HOST !== STORAGE_HOST ||
      env.GCLOUD_PROJECT !== PROJECT || env.GOOGLE_CLOUD_PROJECT !== PROJECT ||
      env.GOOGLE_APPLICATION_CREDENTIALS ||
      db.projectId !== PROJECT ||
      bucket.name !== `${PROJECT}.firebasestorage.app`) {
    throw Error('STOP_SECURITE: moteur V8 autorise uniquement sur emulateurs demo');
  }
  if (env.FIREBASE_CONFIG) {
    let c;
    try { c = JSON.parse(env.FIREBASE_CONFIG); } catch { throw Error('STOP_SECURITE: FIREBASE_CONFIG invalide'); }
    if (!c || c.projectId !== PROJECT ||
        (c.storageBucket && ![`${PROJECT}.firebasestorage.app`, `${PROJECT}.appspot.com`].includes(c.storageBucket)) ||
        (c.databaseURL && c.databaseURL !== `https://${PROJECT}.firebaseio.com`)) {
      throw Error('STOP_SECURITE: configuration Firebase differente du projet demo');
    }
  }
}
function targetKey(t) {
  if (!t || !COLLECTIONS.has(t.collection) || !SAFE.test(t.id) ||
      t.id.includes('..') || !t.id.startsWith('demo-')) {
    throw Error('STOP: cible fictive invalide');
  }
  return `${t.collection}/${t.id}`;
}
function ensureIdentity(snap, t, kind) {
  if (!snap.exists) return;
  const x = snap.data() || {};
  const ok = kind === 'main' ? x.id === t.id && x.collection === t.collection :
    kind === 'monthly' ? x.proId === t.id && x.collection === t.collection :
    kind === 'cache' ? x.id === t.id && x.sourceCollection === t.collection :
    kind === 'history' ? x.listingKey === targetKey(t) :
    kind === 'favorite' ? x.type === 'professional' && x.targetId === t.id && x.targetCollection === t.collection :
    false;
  if (!ok) throw Error(`STOP: appartenance non prouvee (${kind} : ${snap.ref.path})`);
}
function ownerOf(item, kind) {
  if (kind === 'seo') return item.collection;
  const a = item.a;
  if (['service', 'shopping', 'both', 'concession'].includes(a)) return 'concessions';
  if (a === 'association') return 'associations';
  if (a === 'relais') return 'relais';
  if (a === 'creator') return 'creators';
  return null;
}
function prune(raw, t, kind) {
  if (!Array.isArray(raw) || raw.some(x => !x || typeof x !== 'object' || Array.isArray(x))) {
    throw Error(`STOP: index ${kind} invalide`);
  }
  let removed = 0;
  const next = raw.filter(x => {
    if (x.id !== t.id) return true;
    const owner = ownerOf(x, kind);
    if (!owner || !COLLECTIONS.has(owner)) throw Error(`STOP: index ${kind} ambigu`);
    if (owner !== t.collection) return true;
    removed++;
    return false;
  });
  if (removed > 1) throw Error(`STOP: doublons dans index ${kind}`);
  return { next, removed, before: raw.length };
}
async function getObject(file) {
  const [exists] = await file.exists();
  if (!exists) return null;
  const [metadata] = await file.getMetadata();
  return { generation: Number(metadata.generation), metadata };
}
async function preflight(db, bucket, t, options) {
  const main = await db.doc(targetKey(t)).get();
  if (!main.exists) throw Error('STOP: fiche principale absente avant traitement');
  ensureIdentity(main, t, 'main');
  if ((await main.ref.listCollections()).length) throw Error('STOP: sous-collections non examinees');
  if (!Array.isArray(options.months) || options.months.length < 1 ||
      options.months.length > 36 || new Set(options.months).size !== options.months.length ||
      options.months.some(m => !/^\d{4}-(?:0[1-9]|1[0-2])$/.test(m))) {
    throw Error('STOP: calendrier mensuel non borne');
  }
  if (!Array.isArray(options.images) || options.images.length > 12 ||
      new Set(options.images).size !== options.images.length ||
      options.images.some(p => typeof p !== 'string' || !p.startsWith(`pros/${t.collection}/${t.id}/`) || p.includes('..'))) {
    throw Error('STOP: liste explicite des images invalide');
  }
  const monthly = options.months.map(month => db.doc(`pro_stats_monthly/${month}/pros/${t.collection}__${t.id}`));
  const cache = db.doc(`cache/map-live-${t.collection}-${t.id}`);
  const [monthlySnaps, cacheSnap, history, favs, submissions, changes] = await Promise.all([
    Promise.all(monthly.map(r => r.get())), cache.get(),
    db.collection('listing_history').where('listingKey', '==', targetKey(t)).get(),
    db.collectionGroup('favorites').where('targetId', '==', t.id).get(),
    db.collection('listing_submissions').where('publishedDocId', '==', t.id).get(),
    db.collection('modification_requests').where('targetId', '==', t.id).get(),
  ]);
  // Les soumissions/demandes peuvent etre des preuves a conserver: revue obligatoire.
  if (!submissions.empty || !changes.empty) throw Error('STOP: copies administratives a examiner (RGPD)');
  const docs = [];
  for (const snap of monthlySnaps) { ensureIdentity(snap, t, 'monthly'); if (snap.exists) docs.push({snap, kind:'monthly'}); }
  ensureIdentity(cacheSnap, t, 'cache');
  if (cacheSnap.exists) docs.push({snap:cacheSnap, kind:'cache'});
  for (const snap of history.docs) { ensureIdentity(snap,t,'history'); docs.push({snap,kind:'history'}); }
  for (const snap of favs.docs) {
    // Une meme valeur d'ID dans une autre collection est ignorée, pas effacée.
    const x = snap.data() || {};
    if (x.targetCollection !== t.collection) continue;
    if (!snap.ref.path.endsWith(`/favorites/${t.collection}__${t.id}`)) {
      throw Error('STOP: favori avec schema inattendu');
    }
    ensureIdentity(snap,t,'favorite');
    docs.push({snap,kind:'favorite'});
  }
  const images = [];
  for (const pathname of options.images) {
    const file = bucket.file(pathname);
    const obj = await getObject(file);
    if (!obj) continue;
    const m = obj.metadata.metadata || {};
    if (m.ownerId !== t.id || m.ownerCollection !== t.collection || m.exclusive !== 'true') {
      throw Error(`STOP: image non exclusive (${pathname})`);
    }
    images.push({file, pathname, generation: obj.generation});
  }
  const indexes = [];
  for (const pathname of INDEXES) {
    const file = bucket.file(pathname);
    const obj = await getObject(file);
    if (!obj) throw Error(`STOP: index public absent (${pathname})`);
    const [content] = await file.download();
    const raw = JSON.parse(content.toString('utf8'));
    const kind = pathname.endsWith('points.json') ? 'points' : 'seo';
    const p = prune(raw,t,kind);
    indexes.push({file, pathname, generation:obj.generation, ...p});
  }
  return { main, docs, images, indexes };
}

/**
 * Retour: 'completed' seulement pour ce PERIMETRE FICTIF, jamais certificat RGPD.
 * Une erreur interrompt le travail. En relançant, les étapes déjà absentes sont
 * ignorées ; les journaux servent à comprendre les erreurs, pas à autoriser la cible.
 */
async function executeDemoV8({db, bucket, target, months, images = [], injectFailureAfter = 0, env = process.env}) {
  guard(env,db,bucket);
  const identity = targetKey(target);
  const journalRef = db.collection('demo_deletion_jobs').doc(`${target.collection}__${target.id}`);
  const currentJob = await journalRef.get();
  if (currentJob.exists && currentJob.get('target') !== identity) throw Error('STOP: journal incoherent');
  if (currentJob.exists && currentJob.get('status') === 'completed') {
    const main = await db.doc(identity).get();
    if (main.exists) throw Error('STOP: journal complete avec fiche encore presente');
    return { status:'completed', alreadyCompleted:true, certifiedRGPD:false };
  }
  const plan = await preflight(db,bucket,target,{months,images});
  if (!currentJob.exists) {
    await journalRef.create({ target:identity, status:'running', completed:[], startedAt:Date.now(),
      scope:'demo_emulator_only', certifiedRGPD:false });
  }
  const completed = new Set(currentJob.exists ? (currentJob.get('completed') || []) : []);
  let performed = 0;
  const runStep = async (key, action) => {
    // Ne jamais traiter une etape déjà enregistrée sans vérifier la cible plus tard.
    if (completed.has(key)) return;
    await action();
    completed.add(key);
    await journalRef.update({ completed:[...completed], updatedAt:Date.now(), status:'running' });
    performed++;
    if (injectFailureAfter > 0 && performed >= injectFailureAfter) {
      throw Error('ECHEC_FICTIF_INJECTE_POUR_TEST_REPRISE');
    }
  };
  try {
    for (const i of plan.indexes) {
      await runStep(`index:${i.pathname}`, async () => {
        if (!i.removed) return;
        await i.file.save(JSON.stringify(i.next), {contentType:'application/json',
          preconditionOpts:{ifGenerationMatch:i.generation},
          metadata:{cacheControl:'public, max-age=60'}});
      });
    }
    for (const i of plan.images) {
      await runStep(`image:${i.pathname}`, async () => {
        await i.file.delete({ifGenerationMatch:i.generation});
      });
    }
    for (const item of plan.docs) {
      await runStep(`doc:${item.snap.ref.path}`, async () => {
        const fresh = await item.snap.ref.get();
        if (!fresh.exists) return;
        ensureIdentity(fresh,target,item.kind);
        await fresh.ref.delete({lastUpdateTime:fresh.updateTime});
      });
    }
    await runStep(`main:${identity}`, async () => {
      const fresh = await plan.main.ref.get();
      if (!fresh.exists) throw Error('STOP: fiche absente de maniere inattendue');
      ensureIdentity(fresh,target,'main');
      if ((await fresh.ref.listCollections()).length) throw Error('STOP: nouvelles sous-collections');
      await fresh.ref.delete({lastUpdateTime:fresh.updateTime});
    });
    const after = await db.doc(identity).get();
    if (after.exists) throw Error('STOP: fiche principale encore presente');
    await journalRef.update({status:'completed', completed:[...completed], finishedAt:Date.now()});
    return {status:'completed', alreadyCompleted:false, operations:[...completed], certifiedRGPD:false};
  } catch(err) {
    await journalRef.update({status:'partial', completed:[...completed], lastError:String(err.message||err).slice(0,300)});
    throw err;
  }
}
module.exports = { guard, targetKey, prune, preflight, executeDemoV8 };

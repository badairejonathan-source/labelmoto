/**
 * dump-prospection.js — LabelMoto
 * Usage : node dump-prospection.js
 *
 * Lecture seule : affiche tous les documents de la collection "prospection"
 * pour voir la structure exacte (notamment le champ "slug") avant d'écrire
 * le script de mise à jour depuis un export GSC frais.
 */
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

async function run() {
  const snap = await db.collection('prospection').orderBy('impressions', 'desc').get();
  console.log(`📊  ${snap.size} documents dans "prospection"\n`);
  snap.docs.forEach(d => {
    const data = d.data();
    console.log(`doc.id="${d.id}" | slug="${data.slug}" | nom="${data.nom}" | impressions=${data.impressions} | clics=${data.clics} | position=${data.position} | status=${data.status}`);
  });
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

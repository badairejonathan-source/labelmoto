/**
 * dump-article-motos-chinoises.js — LabelMoto
 * Usage : node dump-article-motos-chinoises.js
 *
 * Lecture seule : affiche l'intégralité du document Firestore
 * articles/motos-chinoises-france-2026 en JSON formaté, pour voir sa
 * structure exacte (sections, contenu par marque, champs image existants)
 * avant d'y intégrer les nouvelles images WebP.
 */
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

async function run() {
  const doc = await db.collection('articles').doc('motos-chinoises-france-2026').get();
  if (!doc.exists) {
    console.error('❌  Document introuvable.');
    process.exit(1);
  }
  const data = doc.data();
  console.log('═══ CHAMPS DE PREMIER NIVEAU ═══');
  console.log(Object.keys(data).join(', '));
  console.log('\n═══ DOCUMENT COMPLET ═══\n');
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

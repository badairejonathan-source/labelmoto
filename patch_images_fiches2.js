/**
 * patch_images_fiches2.js — LabelMoto
 * Correction des 3 fiches avec IDs incorrects
 * Usage : node patch_images_fiches2.js
 */

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});

const db = admin.firestore();

const IMAGE_MAP = {
  'bmw-g310r-2021-plus':           '/images/bmw-g310r-2017-plus.webp',
  'bmw-f750-gs-f850-gs-2018-plus': '/images/bmw-f750gs-f850gs-2018-plus.webp',
  'honda-cb750-hornet-2023-plus':  '/images/honda-cb1000-hornet-2023-plus.webp',
  'honda-cb1000-hornet-2025-plus': '/images/honda-cb1000-hornet-2023-plus.webp',
};

async function run() {
  for (const [docId, imageUrl] of Object.entries(IMAGE_MAP)) {
    const ref = db.collection('motorcycle_sheets').doc(docId);
    await ref.update({ imageUrl });
    console.log(`✅ ${docId} → ${imageUrl}`);
  }
  console.log('\n✅ 4 fiches corrigées');
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });

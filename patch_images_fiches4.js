/**
 * patch_images_fiches4.js — LabelMoto
 * Correction des 7 fiches avec IDs incorrects
 * Usage : node patch_images_fiches4.js
 */

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});

const db = admin.firestore();

const IMAGE_MAP = {
  // Benelli — IDs corrigés
  'benelli-leoncino125-2022-plus':       '/images/benelli-leoncino125-2021-plus.webp',
  'benelli-tnt125-2021-plus':            '/images/benelli-leoncino125-2021-plus.webp',
  // Leoncino 800 Trail n'existe pas en doc séparé — même fiche que leoncino800
  // Leoncino 500 Trail n'existe pas en doc séparé — même fiche que leoncino500
  // Yamaha — IDs corrigés
  'yamaha-xsr700-2021-plus':             '/images/yamaha-xsr700-2022-plus.webp',
  'yamaha-mt-07-2021-plus':              '/images/yamaha-mt07-2021-plus.webp',
  'yamaha-mt-03-2020-plus':              '/images/yamaha-mt03-2020-plus.webp',
  // Honda — ID corrigé
  'honda-cb650r-2020-plus':              '/images/honda-cb650r-2019-plus.webp',
};

async function run() {
  console.log(`\n🔄 Correction imageUrl pour ${Object.keys(IMAGE_MAP).length} fiches...\n`);
  let ok = 0, skip = 0;

  for (const [docId, imageUrl] of Object.entries(IMAGE_MAP)) {
    const ref = db.collection('motorcycle_sheets').doc(docId);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`⚠️  INTROUVABLE : ${docId}`);
      skip++;
      continue;
    }
    await ref.update({ imageUrl });
    console.log(`✅ ${docId} → ${imageUrl}`);
    ok++;
  }

  console.log(`\n✅ ${ok} mises à jour / ⚠️ ${skip} introuvables`);
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });

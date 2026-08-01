/**
 * patch_images_fiches.js — LabelMoto
 * Met à jour le champ imageUrl dans Firestore pour les fiches moto
 * qui ont une image WebP dans public/images/
 * Usage : node patch_images_fiches.js
 */

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});

const db = admin.firestore();

// Mapping doc Firestore → chemin image public
const IMAGE_MAP = {
  'honda-xl750-transalp-2023-plus':       '/images/honda-xl750-transalp-2023-plus.webp',
  'honda-cb1000-hornet-2023-plus':         '/images/honda-cb1000-hornet-2023-plus.webp',
  'honda-africa-twin-1100-2020-plus':      '/images/honda-africa-twin-1100-2020-plus.webp',
  'kawasaki-ninja1000sx-2020-plus':        '/images/kawasaki-ninja1000sx-2020-plus.webp',
  'suzuki-gsxs750-2017-plus':             '/images/suzuki-gsxs750-2017-plus.webp',
  'qjmotor-srt700sx-touring-2024-plus':    '/images/qjmotor-srt700sx-touring-2024-plus.webp',
  'qjmotor-srt900sx-touring-2025-plus':    '/images/qjmotor-srt900sx-touring-2025-plus.webp',
  'qjmotor-srk600rs-2025-plus':            '/images/qjmotor-srk600rs-2025-plus.webp',
  'bmw-g310r-2017-plus':                  '/images/bmw-g310r-2017-plus.webp',
  'bmw-f900r-2020-plus':                  '/images/bmw-f900r-2020-plus.webp',
  'bmw-f750gs-f850gs-2018-plus':          '/images/bmw-f750gs-f850gs-2018-plus.webp',
  'bmw-s1000r-2021-plus':                 '/images/bmw-s1000r-2021-plus.webp',
  'yamaha-tenere700-2019-plus':            '/images/yamaha-tenere700-2019-plus.webp',
  'yamaha-mt09-2021-plus':                '/images/yamaha-mt09-2021-plus.webp',
};

async function run() {
  console.log(`\n🔄 Mise à jour imageUrl pour ${Object.keys(IMAGE_MAP).length} fiches...\n`);

  let ok = 0;
  let err = 0;

  for (const [docId, imageUrl] of Object.entries(IMAGE_MAP)) {
    try {
      const ref = db.collection('motorcycle_sheets').doc(docId);
      const snap = await ref.get();
      if (!snap.exists) {
        console.log(`⚠️  INTROUVABLE : ${docId}`);
        err++;
        continue;
      }
      await ref.update({ imageUrl });
      console.log(`✅ ${docId} → ${imageUrl}`);
      ok++;
    } catch (e) {
      console.error(`❌ ERREUR ${docId} : ${e.message}`);
      err++;
    }
  }

  console.log(`\n✅ ${ok} fiches mises à jour / ❌ ${err} erreurs`);
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });

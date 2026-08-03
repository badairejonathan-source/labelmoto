/**
 * patch_images_fiches3.js — LabelMoto
 * Met à jour imageUrl dans Firestore pour les 20 nouvelles fiches
 * Usage : node patch_images_fiches3.js
 */

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});

const db = admin.firestore();

const IMAGE_MAP = {
  // Benelli
  'benelli-leoncino125-2021-plus':      '/images/benelli-leoncino125-2021-plus.webp',
  'benelli-imperiale400-2019-plus':     '/images/benelli-imperiale400-2019-plus.webp',
  'benelli-752s-2022-plus':             '/images/benelli-752s-2022-plus.webp',
  'benelli-502c-2021-plus':             '/images/benelli-502c-2021-plus.webp',
  'benelli-leoncino800-trail-2022-plus':'/images/benelli-leoncino800-trail-2022-plus.webp',
  'benelli-leoncino800-2022-plus':      '/images/benelli-leoncino800-2022-plus.webp',
  'benelli-leoncino500-trail-2019-plus':'/images/benelli-leoncino500-trail-2019-plus.webp',
  'benelli-leoncino500-2019-plus':      '/images/benelli-leoncino500-2019-plus.webp',
  // Yamaha
  'yamaha-yzf-r125-2019-plus':          '/images/yamaha-yzf-r125-2019-plus.webp',
  'yamaha-xsr700-2022-plus':            '/images/yamaha-xsr700-2022-plus.webp',
  'yamaha-tracer-7-2021-plus':          '/images/yamaha-tracer-7-2021-plus.webp',
  'yamaha-r7-2022-plus':                '/images/yamaha-r7-2022-plus.webp',
  'yamaha-mt07-2021-plus':              '/images/yamaha-mt07-2021-plus.webp',
  'yamaha-mt03-2020-plus':              '/images/yamaha-mt03-2020-plus.webp',
  // Honda
  'honda-cbr500r-2022-plus':            '/images/honda-cbr500r-2022-plus.webp',
  'honda-cb750-hornet-2023-plus':       '/images/honda-cb750-hornet-2023-plus.webp',
  'honda-cb650r-2019-plus':             '/images/honda-cb650r-2019-plus.webp',
  'honda-cb500f-2022-plus':             '/images/honda-cb500f-2022-plus.webp',
  // QJ Motor
  'qjmotor-srk800-2025-plus':           '/images/qjmotor-srk800-2025-plus.webp',
  'qjmotor-srk800rr-2024-plus':         '/images/qjmotor-srk800rr-2024-plus.webp',
};

async function run() {
  console.log(`\n🔄 Mise à jour imageUrl pour ${Object.keys(IMAGE_MAP).length} fiches...\n`);
  let ok = 0, skip = 0, err = 0;

  for (const [docId, imageUrl] of Object.entries(IMAGE_MAP)) {
    try {
      const ref = db.collection('motorcycle_sheets').doc(docId);
      const snap = await ref.get();
      if (!snap.exists) {
        console.log(`⚠️  INTROUVABLE : ${docId}`);
        skip++;
        continue;
      }
      await ref.update({ imageUrl });
      console.log(`✅ ${docId}`);
      ok++;
    } catch (e) {
      console.error(`❌ ERREUR ${docId} : ${e.message}`);
      err++;
    }
  }

  console.log(`\n✅ ${ok} mises à jour / ⚠️ ${skip} introuvables / ❌ ${err} erreurs`);
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

const TO_CHECK = [
  'yamaha-mt09-2021-plus',
  'yamaha-mt-09-2021-plus',
  'yamaha-tenere700-2019-plus',
  'yamaha-tenere-700-2019-plus',
  'honda-africa-twin-1100-2020-plus',
  'honda-xl1100-africa-twin-2020-plus',
  'honda-cb750-hornet-2023-plus',
  'kawasaki-z900rs-2018-plus',
  'kawasaki-z900-rs-2018-plus',
  'kawasaki-ninja-1000sx-2020-plus',
  'kawasaki-ninja1000sx-2020-plus',
  'suzuki-gsx-s750-2017-plus',
  'suzuki-gsxs750-2017-plus',
  'bmw-s1000r-2021-plus',
];

async function main() {
  console.log('=== Vérification des fiches existantes ===\n');
  for (const id of TO_CHECK) {
    const doc = await db.collection('motorcycle_sheets').doc(id).get();
    if (doc.exists) {
      const d = doc.data();
      console.log(`✅ EXISTE : ${id} → ${d.brand} ${d.model}`);
    }
  }
  console.log('\n✅ Vérification terminée');
}
main().catch(console.error).finally(() => process.exit());

const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  const doc = await db.collection('motorcycle_sheets').doc('honda-xl750-transalp-2023-plus').get();
  const d = doc.data();

  console.log('=== service_guide ===');
  console.log(JSON.stringify(d.service_guide, null, 2));

  console.log('\n=== technical_sheet (extrait) ===');
  const ts = JSON.stringify(d.technical_sheet, null, 2);
  console.log(ts.substring(0, 1000));
}

main().catch(console.error).finally(() => process.exit());

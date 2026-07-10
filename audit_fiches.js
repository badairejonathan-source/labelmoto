const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('motorcycle_sheets').get();
  console.log('Total fiches : ' + snap.docs.length);

  const cb125 = snap.docs.find(d => {
    const id = d.id.toLowerCase();
    return id.includes('cb125') || id.includes('cb-125');
  });

  if (cb125) {
    console.log('\n=== CB 125 R ===');
    console.log('ID : ' + cb125.id);
    console.log(JSON.stringify(cb125.data(), null, 2).substring(0, 4000));
  } else {
    console.log('\nCB 125 R non trouvee - IDs disponibles :');
    snap.docs.forEach(d => console.log(' ' + d.id));
  }
}

main().catch(console.error).finally(() => process.exit());

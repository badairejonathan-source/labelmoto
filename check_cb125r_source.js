const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  // 1. Lire le document CB125R complet pour voir l'intro exacte
  const doc = await db.collection('motorcycle_sheets').doc('honda-cb125r-2021-plus').get();
  const d = doc.data();

  console.log('=== INTRO COMPLÈTE ===');
  console.log(d.intro || (d.service_guide && d.service_guide.intro) || 'VIDE');

  console.log('\n=== SERVICE_SCHEDULE COMPLET ===');
  const schedule = d.service_schedule || [];
  schedule.forEach(s => console.log(s.km + 'km : ' + s.service_label));

  // 2. Lister toutes les collections disponibles
  console.log('\n=== COLLECTIONS DISPONIBLES ===');
  const collections = await db.listCollections();
  for (const col of collections) {
    const snap = await col.limit(1).get();
    console.log(col.id + ' (' + snap.size + ' doc échantillon)');
  }

  // 3. Chercher si une collection "fiches" ou "sheets" existe
  try {
    const fiches = await db.collection('fiches').limit(5).get();
    console.log('\n=== COLLECTION fiches ===');
    fiches.docs.forEach(d => console.log(d.id));
  } catch(e) {
    console.log('\nPas de collection "fiches"');
  }
}

main().catch(console.error).finally(() => process.exit());

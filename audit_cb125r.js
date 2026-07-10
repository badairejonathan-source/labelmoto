const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  // Lire la CB125R directement
  const cb125r = await db.collection('motorcycle_sheets').doc('honda-cb125r-2021-plus').get();

  if (cb125r.exists) {
    console.log('=== HONDA CB125R (fiche actuelle) ===');
    const d = cb125r.data();
    console.log('service_schedule :');
    (d.service_schedule || []).forEach(s => {
      console.log('  ' + s.km + 'km : ' + s.service_label + ' — ' + s.price_estimate);
    });
    console.log('\nlongevity_tips :');
    (d.longevity_tips || []).forEach(t => console.log('  - ' + t));
  } else {
    console.log('CB125R introuvable');
  }

  // Lister tous les IDs pour audit complet
  console.log('\n=== TOUS LES IDs DE FICHES ===');
  const snap = await db.collection('motorcycle_sheets').get();
  snap.docs.forEach(d => {
    const data = d.data();
    const intervals = (data.service_schedule || []).map(s => s.km + 'km').join(', ');
    console.log(d.id + ' -> ' + (intervals || '???'));
  });
}

main().catch(console.error).finally(() => process.exit());

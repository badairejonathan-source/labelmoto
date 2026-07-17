const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('motorcycle_sheets').get();

  console.log('=== RECHERCHE CB125R DANS TOUS LES DOCUMENTS ===\n');

  snap.docs.forEach(doc => {
    const d = doc.data();
    const text = JSON.stringify(d).toLowerCase();
    if (text.includes('cb125r') || text.includes('cb 125 r') || text.includes('cb125 r')) {
      const schedule = d.service_schedule || (d.service_guide && d.service_guide.service_schedule) || [];
      const intro = d.intro || (d.service_guide && d.service_guide.intro) || '';
      console.log('TROUVÉ ID :', doc.id);
      console.log('Slug :', d.slug);
      console.log('Display title :', d.display_title);
      console.log('Intro :', intro.substring(0, 150));
      console.log('Intervalles :', schedule.map(s => s.km + 'km').join(' / '));
      console.log('');
    }
  });

  // Aussi chercher par slug 4000
  console.log('\n=== DOCUMENTS AVEC INTERVALLE 4000km ===\n');
  snap.docs.forEach(doc => {
    const d = doc.data();
    const schedule = d.service_schedule || (d.service_guide && d.service_guide.service_schedule) || [];
    if (schedule.some(s => s.km === 4000)) {
      console.log('ID :', doc.id, '| Intervalles :', schedule.map(s => s.km + 'km').join(' / '));
    }
  });
}

main().catch(console.error).finally(() => process.exit());

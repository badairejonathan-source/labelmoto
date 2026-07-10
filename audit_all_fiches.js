const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('motorcycle_sheets').get();
  console.log('=== AUDIT COMPLET DES 43 FICHES ===\n');

  const results = [];

  for (const doc of snap.docs) {
    const d = doc.data();
    // Lire le service_schedule selon la structure (125cc vs grosse cylindrée)
    const schedule = d.service_schedule || (d.service_guide && d.service_guide.service_schedule) || [];
    const intervals = schedule.map(s => s.km);
    const firstInterval = intervals[1] || null; // Le 1er vrai entretien (hors rodage)

    results.push({
      id: doc.id,
      brand: d.brand,
      model: d.display_title || d.model,
      intervals: intervals.join(' / '),
      firstInterval,
      structure: d.service_schedule ? 'top-level' : (d.service_guide ? 'service_guide' : 'VIDE'),
    });
  }

  // Trier par marque puis modèle
  results.sort((a, b) => a.id.localeCompare(b.id));

  // Afficher
  results.forEach(r => {
    const flag = r.structure === 'VIDE' ? ' ⚠️  VIDE' : '';
    console.log(`[${r.brand}] ${r.model}`);
    console.log(`  Intervalles : ${r.intervals || 'AUCUN'}  (structure: ${r.structure})${flag}`);
    console.log('');
  });

  // Résumé
  const vides = results.filter(r => r.structure === 'VIDE');
  const topLevel = results.filter(r => r.structure === 'top-level');
  const nested = results.filter(r => r.structure === 'service_guide');
  console.log(`=== RÉSUMÉ ===`);
  console.log(`Top-level service_schedule : ${topLevel.length} fiches`);
  console.log(`Nested service_guide : ${nested.length} fiches`);
  console.log(`VIDES : ${vides.length} fiches`);
  if (vides.length > 0) {
    console.log('IDs vides :');
    vides.forEach(r => console.log('  - ' + r.id));
  }
}

main().catch(console.error).finally(() => process.exit());

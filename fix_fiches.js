const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  // 1. Inspecter la structure d'une fiche "???"
  const transalp = await db.collection('motorcycle_sheets').doc('honda-xl750-transalp-2023-plus').get();
  console.log('=== CHAMPS honda-xl750-transalp-2023-plus ===');
  console.log(Object.keys(transalp.data()).join(', '));
  const d = transalp.data();
  const schedule = d.service_schedule || d.revisions || d.maintenance || d.schedule;
  console.log('service_schedule:', JSON.stringify(schedule, null, 2));

  // 2. Corriger la CB125R — ajouter "jeu aux soupapes" à 24 000 km
  const ref = db.collection('motorcycle_sheets').doc('honda-cb125r-2021-plus');
  const cb125r = await ref.get();
  const data = cb125r.data();
  const newSchedule = data.service_schedule.map(s => {
    if (s.km === 24000) {
      return {
        ...s,
        service_label: 'Gros entretien + contrôle jeu aux soupapes + contrôle complet'
      };
    }
    return s;
  });
  await ref.update({ service_schedule: newSchedule });
  console.log('\n✅ CB125R corrigée — 24 000 km mis à jour avec jeu aux soupapes');
}

main().catch(console.error).finally(() => process.exit());

const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  const ref = db.collection('motorcycle_sheets').doc('honda-cb125r-2021-plus');
  const doc = await ref.get();
  const d = doc.data();

  // 1. Nouvelle intro avec la nuance 4000 vs 6000km
  const newIntro = "La Honda CB125R est une 125 néo-rétro à la finition premium, avec une partie-cycle digne d'une grosse cylindrée. Point d'attention budget : Honda préconisait initialement des vidanges tous les 4 000 km sur ses modèles 125 à moteur liquide, mais il est aujourd'hui communément admis et pratiqué d'effectuer la vidange tous les 6 000 km — intervalle plus répandu chez les propriétaires et ateliers indépendants, et suffisant avec une huile de qualité.";

  // 2. Mise à jour du service_schedule avec une note sur le 6000km
  const newSchedule = [
    {
      km: 1000,
      service_label: "Révision de rodage (vidange + contrôles)",
      price_estimate: "≈ 90 à 150 €"
    },
    {
      km: 6000,
      service_label: "Vidange + contrôles (Honda préconisait 4 000 km à l'origine — 6 000 km communément pratiqué)",
      price_estimate: "≈ 100 à 160 €"
    },
    {
      km: 12000,
      service_label: "Vidange + filtre à air + bougie + contrôles",
      price_estimate: "≈ 200 à 280 €"
    },
    {
      km: 24000,
      service_label: "Gros entretien + contrôle jeu aux soupapes + contrôle complet",
      price_estimate: "≈ 350 à 500 €"
    }
  ];

  // 3. Mise à jour des longevity_tips
  const newTips = [
    "Honda préconisait 4 000 km à l'origine pour la vidange — la pratique courante est 6 000 km avec une huile 10W40 JASO MA2 de qualité",
    "Vérifier régulièrement la fourche Showa pour tout suintement",
    "Graisser la chaîne après chaque pluie et tous les 500 km en usage intensif",
    "Ne pas négliger le remplacement de la bougie à 12 000 km",
    "Contrôle du jeu aux soupapes à 24 000 km — opération délicate à confier à un atelier Honda"
  ];

  await ref.update({
    intro: newIntro,
    service_schedule: newSchedule,
    longevity_tips: newTips,
    'timestamps.updated_at': '2026-07-11'
  });

  console.log('✅ Fiche CB125R mise à jour :');
  console.log('  - Intro : nuance 4 000 km Honda vs 6 000 km pratiqué');
  console.log('  - Schedule 6 000 km : note explicative ajoutée');
  console.log('  - Longevity tips : clarification vidange ajoutée');
  console.log('  - Jeu aux soupapes 24 000 km : confirmé');
}

main().catch(console.error).finally(() => process.exit());

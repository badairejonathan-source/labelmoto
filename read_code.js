const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

async function main() {
  // Lire tous les champs de la 450MT (ancienne qui fonctionne) en détail
  const snap = await db.collection('motorcycle_sheets').doc('cfmoto-450mt-2024-plus').get();
  const data = snap.data();
  
  // Afficher les champs simples (pas les objets imbriqués)
  console.log('=== CHAMPS SCALAIRES ancienne fiche ===');
  for (const [k, v] of Object.entries(data)) {
    if (typeof v !== 'object' || v === null) {
      console.log(`${k}: [${typeof v}] = ${JSON.stringify(v)}`);
    }
  }

  // Afficher le subcategory et featured en détail
  console.log('\n=== subcategory:', data.subcategory);
  console.log('=== featured:', data.featured);
  console.log('=== type:', data.type);
  console.log('=== model_order:', data.model_order);
  
  // Lister quelques autres fiches pour voir les subcategory utilisées
  console.log('\n=== subcategory de tous les modèles CFMOTO ===');
  const all = await db.collection('motorcycle_sheets')
    .where('brand', '==', 'CFMOTO')
    .get();
  all.forEach(doc => {
    const d = doc.data();
    console.log(`${doc.id}: subcategory="${d.subcategory}" | featured=${d.featured} | type="${d.type}"`);
  });
}

main().catch(console.error).finally(() => process.exit());

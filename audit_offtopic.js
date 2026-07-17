const admin = require('./node_modules/firebase-admin');
const fs = require('fs');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// Catégories clairement hors-sujet moto
const OFFTOPIC_CATEGORIES = [
  'Château',
  'Concessionnaire de bateaux',
  'Garage automobile',
  'Concessionnaire automobile',
  'Magasin de pièces de rechange automobiles',
  'Vendeur de voitures d\'occasion',
  'Siège social',
];

// Mots-clés dans le titre qui indiquent un hors-sujet évident
const OFFTOPIC_TITLE_KEYWORDS = [
  'land rover', 'peugeot automobiles', 'audi', 'mercedes', 'renault',
  'volkswagen', 'bmw automobiles', 'toyota', 'ford', 'opel',
  'cinema', 'cinéma', 'photo studio', 'audiovisuel',
  'sculpture', 'antique', 'immobili',
  'simplicicar', 'caravane', 'camping-car',
];

async function main() {
  const snap = await db.collection('concessions').get();
  const toDelete = [];
  const toReview = [];

  snap.docs.forEach(doc => {
    const d = doc.data();
    const cat = d.category || '';
    const title = (d.title || '').toLowerCase();

    // Vérifier catégorie hors-sujet
    const isOffTopicCat = OFFTOPIC_CATEGORIES.some(c =>
      cat.toLowerCase().includes(c.toLowerCase())
    );

    // Vérifier titre hors-sujet
    const isOffTopicTitle = OFFTOPIC_TITLE_KEYWORDS.some(k =>
      title.includes(k)
    );

    if (isOffTopicCat || isOffTopicTitle) {
      toDelete.push({
        id: doc.id,
        title: d.title?.substring(0, 60),
        category: cat.substring(0, 50),
        address: (d.address || '').substring(0, 50),
        reason: isOffTopicCat ? `catégorie: ${cat.substring(0, 40)}` : `titre: ${d.title?.substring(0, 40)}`,
      });
    }
  });

  console.log(`\n=== FICHES À SUPPRIMER : ${toDelete.length} ===\n`);
  toDelete.forEach((f, i) => {
    console.log(`${i+1}. [${f.reason}]`);
    console.log(`   ${f.title}`);
    console.log(`   ${f.address}`);
    console.log('');
  });

  // Sauvegarder la liste pour la suppression
  const ids = toDelete.map(f => f.id);
  fs.writeFileSync('./ids_to_delete.json', JSON.stringify(ids, null, 2));
  console.log(`✅ Liste sauvegardée dans ids_to_delete.json`);
  console.log(`\nVérifie cette liste, puis lance : node delete_offtopic.js`);
}

main().catch(console.error).finally(() => process.exit());

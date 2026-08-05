/**
 * check_casque_content.js — LabelMoto
 * Usage : node check_casque_content.js
 *
 * Lecture seule : liste les modeles presents dans les sections "cards"
 * des articles casques entree-de-gamme et milieu-de-gamme, pour diagnostiquer
 * les modeles manquants signales par l'utilisateur.
 */

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});

const db = admin.firestore();

const articleIds = [
  'meilleurs-casques-moto-entree-de-gamme-2026',
  'meilleurs-casques-moto-milieu-de-gamme-2026',
];

function extractCardTitles(sections) {
  const titles = [];
  (sections || []).forEach(s => {
    if (Array.isArray(s.cards)) {
      s.cards.forEach(c => titles.push(c.title || c.model || '(sans titre)'));
    }
    if (Array.isArray(s.subsections)) {
      s.subsections.forEach(sub => titles.push(sub.title || '(sans titre)'));
    }
  });
  return titles;
}

async function checkAll() {
  for (const id of articleIds) {
    console.log(`\n=== ${id} ===`);
    const doc = await db.collection('articles').doc(id).get();
    if (!doc.exists) {
      console.log('❌  Document introuvable.');
      continue;
    }
    const data = doc.data();
    const sections = data.sections || [];
    console.log(`Nombre de sections : ${sections.length}`);
    sections.forEach((s, i) => {
      const nbCards = Array.isArray(s.cards) ? s.cards.length : 0;
      const nbSub = Array.isArray(s.subsections) ? s.subsections.length : 0;
      console.log(`  [${i}] "${s.title || '(sans titre)'}" — cards: ${nbCards}, subsections: ${nbSub}`);
    });
    const titles = extractCardTitles(sections);
    console.log(`Modeles trouves (${titles.length}) :`);
    titles.forEach(t => console.log(`  - ${t}`));
  }
}

checkAll().then(() => process.exit(0)).catch(err => {
  console.error('❌  Erreur Firestore :', err.message);
  process.exit(1);
});

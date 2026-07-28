/**
 * check_fiches.js — LabelMoto diagnostic
 * Compare la structure d'une ancienne fiche (qui s'affiche) vs une nouvelle (qui ne s'affiche pas)
 * Usage : node check_fiches.js
 */

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

async function main() {
  // Ancienne fiche qui fonctionne
  const old = await db.collection('motorcycle_sheets').doc('cfmoto-450mt-2024-plus').get();
  // Nouvelle fiche qui ne s'affiche pas
  const newDoc = await db.collection('motorcycle_sheets').doc('cfmoto-450nk-2023-plus').get();

  const oldData = old.data();
  const newData = newDoc.data();

  console.log('\n=== CHAMPS ancienne fiche (450MT — fonctionne) ===');
  console.log(Object.keys(oldData).sort().join('\n'));

  console.log('\n=== CHAMPS nouvelle fiche (450NK — ne s\'affiche pas) ===');
  console.log(Object.keys(newData).sort().join('\n'));

  const missing = Object.keys(oldData).filter(k => !(k in newData));
  const extra   = Object.keys(newData).filter(k => !(k in oldData));

  console.log('\n=== CHAMPS présents dans ancienne mais ABSENTS dans nouvelle ===');
  console.log(missing.length ? missing.join('\n') : 'Aucun');

  console.log('\n=== CHAMPS présents dans nouvelle mais ABSENTS dans ancienne ===');
  console.log(extra.length ? extra.join('\n') : 'Aucun');

  console.log('\n=== VALEURS CLES (comparaison) ===');
  ['status', 'brand', 'brand_order', 'category', 'subcategory', 'id', 'slug'].forEach(k => {
    console.log(`${k}: ancien="${oldData[k]}" | nouveau="${newData[k]}"`);
  });
}

main().catch(console.error).finally(() => process.exit());

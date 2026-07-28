/**
 * debug_fiches.js — LabelMoto
 * Compare en détail les valeurs exactes de chaque champ
 * entre une ancienne fiche (OK) et une nouvelle (KO)
 */

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

async function main() {
  const old  = await db.collection('motorcycle_sheets').doc('cfmoto-450mt-2024-plus').get();
  const newD = await db.collection('motorcycle_sheets').doc('cfmoto-450nk-2023-plus').get();

  const o = old.data();
  const n = newD.data();

  // Affiche tous les champs avec leurs valeurs exactes (type + valeur)
  const allKeys = new Set([...Object.keys(o), ...Object.keys(n)]);
  
  console.log('\n=== COMPARAISON COMPLETE ===\n');
  console.log('Champ'.padEnd(20) + 'ANCIENNE (OK)'.padEnd(35) + 'NOUVELLE (KO)');
  console.log('-'.repeat(90));

  for (const k of [...allKeys].sort()) {
    const oldVal = o[k] !== undefined ? `[${typeof o[k]}] ${JSON.stringify(o[k]).slice(0,30)}` : '⛔ ABSENT';
    const newVal = n[k] !== undefined ? `[${typeof n[k]}] ${JSON.stringify(n[k]).slice(0,30)}` : '⛔ ABSENT';
    const diff = oldVal !== newVal ? ' <<<' : '';
    console.log(k.padEnd(20) + oldVal.padEnd(35) + newVal + diff);
  }
}

main().catch(console.error).finally(() => process.exit());

const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// Départements déjà couverts par une page ville
const dejaCouverts = ['75','13','69','31','06','44','34','67','33','59','35','51','83','38','21','49','30','63','76','80','57','29','37','87','66','14','54','42','64'];

async function main() {
  const cols = ['concessions', 'associations', 'relais'];
  const counts = {};
  for (const col of cols) {
    const snap = await db.collection(col).get();
    snap.docs.forEach(doc => {
      const dept = doc.data().departement;
      if (dept) counts[dept] = (counts[dept] || 0) + 1;
    });
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log('\n=== DÉPARTEMENTS NON COUVERTS (triés par nb de fiches) ===');
  sorted
    .filter(([d]) => !dejaCouverts.includes(d))
    .slice(0, 30)
    .forEach(([d, n]) => console.log(`  Dept ${d} : ${n} fiches`));
  console.log('\n=== DÉPARTEMENTS DÉJÀ COUVERTS (pour vérif) ===');
  sorted
    .filter(([d]) => dejaCouverts.includes(d))
    .forEach(([d, n]) => console.log(`  Dept ${d} : ${n} fiches`));
}
main().catch(console.error).finally(() => process.exit());

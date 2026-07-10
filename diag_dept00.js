const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function main() {
  const cols = ['concessions', 'associations', 'relais'];
  let total = 0;
  let avecCP = 0;
  let sansCP = 0;
  const exemples = [];

  for (const col of cols) {
    const snap = await db.collection(col).where('departement', '==', '00').limit(300).get();
    snap.docs.forEach(doc => {
      const d = doc.data();
      total++;
      const address = d.address || d.addresss || '';
      const cpMatch = address.match(/\b(\d{5})\b/);
      if (cpMatch) {
        avecCP++;
        if (exemples.length < 10) {
          exemples.push({ col, id: doc.id, address, cp: cpMatch[1] });
        }
      } else {
        sansCP++;
        if (exemples.length < 10 && !cpMatch) {
          exemples.push({ col, id: doc.id, address, cp: 'INTROUVABLE' });
        }
      }
    });
  }

  console.log(`\nTotal fiches dept 00 : ${total}`);
  console.log(`Avec code postal dans l'adresse : ${avecCP}`);
  console.log(`Sans code postal : ${sansCP}`);
  console.log('\n=== 10 exemples ===');
  exemples.forEach(e => console.log(`[${e.col}] CP: ${e.cp} | ${e.address}`));
}

main().catch(console.error).finally(() => process.exit());

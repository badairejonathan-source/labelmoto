const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

function detectPays(address) {
  if (!address) return 'Inconnu';
  const a = address.toLowerCase();
  if (a.includes('suisse') || a.includes('switzerland') || /\b\d{4}\b/.test(address) && (a.includes('genève') || a.includes('lausanne') || a.includes('zurich') || a.includes('berne') || a.includes('bâle') || a.includes('morges') || a.includes('develier') || a.includes('acacias'))) return 'Suisse';
  if (a.includes('belgique') || a.includes('belgium') || a.includes('belgië') || a.includes('liège') || a.includes('bruxelles') || a.includes('mouscron') || a.includes('tielt') || a.includes('namur') || a.includes('gent') || a.includes('bruges')) return 'Belgique';
  if (a.includes('andorre') || a.includes('andorra') || a.includes('ad2') || a.includes('ad1')) return 'Andorre';
  if (a.includes('luxembourg')) return 'Luxembourg';
  if (a.includes('nederland') || a.includes('pays-bas') || /\b\d{4}\s?[a-z]{2}\b/i.test(address)) return 'Pays-Bas';
  if (a.includes('espagne') || a.includes('españa') || a.includes('spain')) return 'Espagne';
  if (a.includes('italie') || a.includes('italia') || a.includes('italy')) return 'Italie';
  if (a.includes('allemagne') || a.includes('deutschland') || a.includes('germany')) return 'Allemagne';
  return 'Autre';
}

async function main() {
  const cols = ['concessions', 'associations', 'relais'];
  const counts = {};

  for (const col of cols) {
    const snap = await db.collection(col).where('departement', '==', '00').get();
    snap.docs.forEach(doc => {
      const address = doc.data().address || doc.data().addresss || '';
      const pays = detectPays(address);
      counts[pays] = (counts[pays] || 0) + 1;
    });
  }

  console.log('\n=== FICHES ÉTRANGÈRES PAR PAYS ===');
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([pays, n]) => console.log(`  ${pays} : ${n} fiches`));
}

main().catch(console.error).finally(() => process.exit());

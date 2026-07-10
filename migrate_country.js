const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

function detectCountry(address) {
  if (!address) return null;
  const a = address.toLowerCase();

  if (a.includes('suisse') || a.includes('switzerland') ||
      a.includes('genève') || a.includes('lausanne') || a.includes('zurich') ||
      a.includes('berne') || a.includes('bâle') || a.includes('morges') ||
      a.includes('develier') || a.includes('acacias') || a.includes('sion') ||
      a.includes('fribourg') || a.includes('neuchâtel') || a.includes('lugano')) {
    return 'CH';
  }
  if (a.includes('belgique') || a.includes('belgium') || a.includes('belgië') ||
      a.includes('liège') || a.includes('bruxelles') || a.includes('mouscron') ||
      a.includes('tielt') || a.includes('namur') || a.includes('gent') ||
      a.includes('bruges') || a.includes('anvers') || a.includes('charleroi') ||
      a.includes('mons') || a.includes('leuven') || a.includes('hasselt') ||
      a.includes('mechelen') || a.includes('wavre') || a.includes('tournai')) {
    return 'BE';
  }
  if (a.includes('luxembourg') && !a.includes('luxembourg-ville') === false) return 'LU';
  if (a.includes('luxembourg')) return 'LU';
  if (a.includes('andorre') || a.includes('andorra') || /\bad[12]\d{2}\b/i.test(address)) return 'AD';
  if (a.includes('nederland') || a.includes('pays-bas') || a.includes('netherlands') ||
      a.includes('amsterdam') || a.includes('rotterdam') || a.includes('warmenhuizen') ||
      a.includes('paterswolde') || /\b\d{4}\s?[a-z]{2}\b/i.test(address)) return 'NL';
  if (a.includes('espagne') || a.includes('españa') || a.includes('spain')) return 'ES';
  if (a.includes('italie') || a.includes('italia')) return 'IT';
  if (a.includes('allemagne') || a.includes('deutschland')) return 'DE';
  return null;
}

async function main() {
  const cols = ['concessions', 'associations', 'relais'];
  let updated = 0;
  let skipped = 0;

  for (const col of cols) {
    const snap = await db.collection(col).where('departement', '==', '00').get();
    const batches = [];
    let batch = db.batch();
    let count = 0;

    for (const docSnap of snap.docs) {
      const address = docSnap.data().address || docSnap.data().addresss || '';
      const country = detectCountry(address);
      if (country) {
        batch.update(docSnap.ref, { country });
        updated++;
        count++;
        if (count === 400) {
          batches.push(batch);
          batch = db.batch();
          count = 0;
        }
      } else {
        skipped++;
      }
    }
    if (count > 0) batches.push(batch);

    for (const b of batches) await b.commit();
    console.log(`✅ ${col} traité`);
  }

  console.log(`\n✅ Migration terminée : ${updated} documents mis à jour, ${skipped} ignorés`);
}

main().catch(console.error).finally(() => process.exit());

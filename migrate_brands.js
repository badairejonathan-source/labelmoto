const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// Règles de détection des marques (ordre important : les plus spécifiques en premier)
const BRAND_RULES = [
  { brand: 'Royal Enfield', patterns: ['royal enfield'] },
  { brand: 'Harley-Davidson', patterns: ['harley-davidson', 'harley davidson', 'harley'] },
  { brand: 'Can-Am', patterns: ['can-am', 'can am', 'canam'] },
  { brand: 'Honda', patterns: ['honda'] },
  { brand: 'Yamaha', patterns: ['yamaha'] },
  { brand: 'Kawasaki', patterns: ['kawasaki'] },
  { brand: 'Suzuki', patterns: ['suzuki'] },
  { brand: 'BMW', patterns: ['bmw motorrad', 'bmw moto', 'bmw motorad'] },
  { brand: 'Triumph', patterns: ['triumph'] },
  { brand: 'Ducati', patterns: ['ducati'] },
  { brand: 'KTM', patterns: ['ktm'] },
  { brand: 'Aprilia', patterns: ['aprilia'] },
  { brand: 'Piaggio', patterns: ['piaggio'] },
  { brand: 'Vespa', patterns: ['vespa'] },
  { brand: 'Kymco', patterns: ['kymco'] },
];

function detectBrands(title, category) {
  const text = ((title || '') + ' ' + (category || '')).toLowerCase();
  const found = [];
  for (const rule of BRAND_RULES) {
    if (rule.patterns.some(p => text.includes(p))) {
      found.push(rule.brand);
    }
  }
  return found;
}

async function main() {
  const snap = await db.collection('concessions').get();
  console.log(`Total concessions : ${snap.docs.length}`);

  let updated = 0;
  let withBrand = 0;
  let noBrand = 0;

  // Traitement par batches de 400
  const batchSize = 400;
  let batch = db.batch();
  let count = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const brands = detectBrands(data.title, data.category);

    if (brands.length > 0) {
      batch.update(docSnap.ref, { brands });
      withBrand++;
    } else {
      batch.update(docSnap.ref, { brands: [] });
      noBrand++;
    }

    count++;
    updated++;

    if (count === batchSize) {
      await batch.commit();
      batch = db.batch();
      count = 0;
      process.stdout.write('.');
    }
  }

  if (count > 0) await batch.commit();

  console.log(`\n\n✅ Migration terminée :`);
  console.log(`  ${updated} documents mis à jour`);
  console.log(`  ${withBrand} avec marque(s) détectée(s)`);
  console.log(`  ${noBrand} sans marque (ateliers multimarques, etc.)`);

  // Vérification rapide
  console.log('\n=== Vérification top marques ===');
  const BRANDS = ['Honda','Yamaha','Kawasaki','Suzuki','BMW','Harley-Davidson','Triumph','Kymco','Piaggio','Royal Enfield','Ducati','KTM','Aprilia','Vespa'];
  for (const b of BRANDS) {
    const s = await db.collection('concessions').where('brands', 'array-contains', b).get();
    console.log(`  ${b} : ${s.size} fiches`);
  }
}

main().catch(console.error).finally(() => process.exit());

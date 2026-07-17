const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

const BRAND_RULES = [
  // Spécifiques en premier (éviter les collisions)
  { brand: 'Royal Enfield', patterns: ['royal enfield'] },
  { brand: 'Harley-Davidson', patterns: ['harley-davidson', 'harley davidson', 'harley'] },
  { brand: 'Can-Am', patterns: ['can-am', 'can am', 'canam'] },
  { brand: 'CF Moto', patterns: ['cf moto', 'cfmoto', 'cf-moto'] },
  { brand: 'QJ Motor', patterns: ['qj motor', 'qjmotor', 'qj motors'] },
  { brand: 'Super Soco', patterns: ['super soco'] },
  { brand: 'MV Agusta', patterns: ['mv agusta', 'mvagusta'] },
  { brand: 'Moto Guzzi', patterns: ['moto guzzi', 'motoguzzi'] },
  { brand: 'Peugeot Motocycles', patterns: ['peugeot'] },
  // Japonaises
  { brand: 'Honda', patterns: ['honda'] },
  { brand: 'Yamaha', patterns: ['yamaha'] },
  { brand: 'Kawasaki', patterns: ['kawasaki'] },
  { brand: 'Suzuki', patterns: ['suzuki'] },
  // Premium/Européennes
  { brand: 'BMW', patterns: ['bmw motorrad', 'bmw moto', 'bmw motorad', 'bmw'] },
  { brand: 'Triumph', patterns: ['triumph'] },
  { brand: 'Ducati', patterns: ['ducati'] },
  { brand: 'KTM', patterns: ['ktm'] },
  { brand: 'Aprilia', patterns: ['aprilia'] },
  { brand: 'Vespa', patterns: ['vespa'] },
  { brand: 'Piaggio', patterns: ['piaggio'] },
  { brand: 'Kymco', patterns: ['kymco'] },
  { brand: 'Indian', patterns: ['indian motorcycle', 'indian moto', ' indian '] },
  // Chinoises
  { brand: 'Zontes', patterns: ['zontes'] },
  { brand: 'VOGE', patterns: ['voge'] },
  { brand: 'Kove', patterns: ['kove'] },
  { brand: 'Benelli', patterns: ['benelli'] },
  { brand: 'Mash', patterns: ['mash'] },
  { brand: 'SWM', patterns: ['swm'] },
  { brand: 'Brixton', patterns: ['brixton'] },
  { brand: 'Keeway', patterns: ['keeway'] },
  { brand: 'Orcal', patterns: ['orcal'] },
  // Trial/Enduro
  { brand: 'Husqvarna', patterns: ['husqvarna'] },
  { brand: 'GasGas', patterns: ['gasgas', 'gas gas'] },
  { brand: 'Beta', patterns: ['beta'] },
  { brand: 'Sherco', patterns: ['sherco'] },
  { brand: 'Fantic', patterns: ['fantic'] },
  { brand: 'Rieju', patterns: ['rieju'] },
  // Taïwanaises
  { brand: 'SYM', patterns: ['sym'] },
  // Électriques
  { brand: 'NIU', patterns: ['niu'] },
  { brand: 'Vmoto', patterns: ['vmoto'] },
  { brand: 'Silence', patterns: ['silence'] },
  { brand: 'Segway', patterns: ['segway'] },
  { brand: 'Zero Motorcycles', patterns: ['zero motorcycles', 'zero electric'] },
  // Autres
  { brand: 'Norton', patterns: ['norton'] },
];

function detectBrands(title, category) {
  const text = ((title || '') + ' ' + (category || '')).toLowerCase();
  const found = [];
  for (const rule of BRAND_RULES) {
    if (rule.patterns.some(p => text.includes(p))) {
      if (!found.includes(rule.brand)) found.push(rule.brand);
    }
  }
  return found;
}

async function main() {
  const snap = await db.collection('concessions').get();
  console.log(`Migration étendue sur ${snap.docs.length} concessions...`);

  let updated = 0;
  let withBrand = 0;
  let multiBrand = 0;

  const batchSize = 400;
  let batch = db.batch();
  let count = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const brands = detectBrands(data.title, data.category);
    batch.update(docSnap.ref, { brands });
    if (brands.length > 0) withBrand++;
    if (brands.length >= 2) multiBrand++;
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
  console.log(`  ${multiBrand} multimarques (2+ marques)`);

  // Vérification nouvelles marques
  console.log('\n=== Vérification nouvelles marques ===');
  const newBrands = ['CF Moto','Zontes','VOGE','QJ Motor','Kove','Peugeot Motocycles',
    'Moto Guzzi','Indian','Mash','Husqvarna','Benelli','Beta','Sherco','Fantic','Rieju'];
  for (const b of newBrands) {
    const s = await db.collection('concessions').where('brands', 'array-contains', b).get();
    console.log(`  ${b} : ${s.size} fiches`);
  }
}

main().catch(console.error).finally(() => process.exit());

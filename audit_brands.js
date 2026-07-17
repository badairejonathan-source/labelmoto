const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// Toutes les marques connues à détecter (élargies)
const ALL_BRANDS = [
  // Japonaises
  'Honda', 'Yamaha', 'Kawasaki', 'Suzuki',
  // Allemandes/Premium
  'BMW',
  // Américaines
  'Harley-Davidson', 'Indian', 'Can-Am',
  // Britanniques
  'Triumph', 'Norton',
  // Italiennes
  'Ducati', 'Aprilia', 'Vespa', 'Piaggio', 'Moto Guzzi', 'MV Agusta',
  // Autrichiennes
  'KTM', 'Husqvarna', 'GasGas',
  // Espagnoles
  'Rieju',
  // Taïwanaises
  'Kymco', 'SYM',
  // Chinoises et émergentes
  'CF Moto', 'CFMOTO',
  'Kove',
  'Zontes',
  'QJ Motor', 'QJMotor', 'QJ Motors',
  'VOGE',
  'Mash',
  'SWM',
  'Brixton',
  'Benelli',
  'Keeway',
  'Orcal',
  'Beta',
  'Sherco',
  'Fantic',
  'TM Racing',
  // Scooters électriques
  'NIU', 'Super Soco', 'Vmoto', 'Silence', 'Segway',
  // Autres
  'Royal Enfield', 'Bajaj', 'Hero', 'Jawa',
  'Daelim', 'Ideo',
  'Peugeot', 'Dafy',
  'Zero', 'Energica', 'Cake',
];

async function main() {
  const snap = await db.collection('concessions').get();
  console.log(`Analyse de ${snap.docs.length} concessions...\n`);

  const brandCounts = {};
  const multiBrandDocs = [];
  const unknownBrandSamples = [];

  snap.docs.forEach(doc => {
    const data = doc.data();
    const text = ((data.title || '') + ' ' + (data.category || '')).toLowerCase();
    const foundBrands = [];

    ALL_BRANDS.forEach(brand => {
      const pattern = brand.toLowerCase().replace(/[-\s]/g, '[\\s\\-]?');
      const regex = new RegExp('\\b' + pattern, 'i');
      if (regex.test(text)) {
        const normalized = brand === 'CFMOTO' ? 'CF Moto' :
                          brand === 'QJMotor' || brand === 'QJ Motors' ? 'QJ Motor' : brand;
        if (!foundBrands.includes(normalized)) {
          foundBrands.push(normalized);
          brandCounts[normalized] = (brandCounts[normalized] || 0) + 1;
        }
      }
    });

    if (foundBrands.length >= 2) {
      multiBrandDocs.push({
        id: doc.id,
        title: data.title,
        brands: foundBrands,
      });
    }

    if (foundBrands.length === 0 && data.title) {
      // Chercher d'éventuelles marques non listées
      unknownBrandSamples.push(data.title);
    }
  });

  // Résultats
  console.log('=== TOUTES LES MARQUES DÉTECTÉES ===\n');
  Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([brand, count]) => {
      const isNew = !['Honda','Yamaha','Kawasaki','Suzuki','BMW','Harley-Davidson',
        'Triumph','Kymco','Piaggio','Royal Enfield','Ducati','KTM','Aprilia','Vespa','Can-Am'].includes(brand);
      console.log(`${isNew ? '🆕 ' : '   '}${brand} : ${count} fiches`);
    });

  console.log(`\n=== CONCESSIONNAIRES MULTIMARQUES : ${multiBrandDocs.length} ===\n`);
  multiBrandDocs.slice(0, 20).forEach(d => {
    console.log(`[${d.brands.join(' + ')}] ${d.title}`);
  });

  console.log('\n=== 10 FICHES SANS MARQUE DÉTECTÉE (échantillon) ===\n');
  unknownBrandSamples.slice(0, 10).forEach(t => console.log(' -', t));
}

main().catch(console.error).finally(() => process.exit());

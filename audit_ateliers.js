const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

const BRANDS_TO_CHECK = [
  'Honda','Yamaha','Kawasaki','Suzuki','BMW','Triumph','Ducati','KTM',
  'Aprilia','Vespa','Piaggio','Kymco','Harley','Royal Enfield','Indian',
  'CF Moto','CFMOTO','Zontes','VOGE','QJ Motor','Kove','Benelli','Mash',
  'Husqvarna','Beta','Sherco','Rieju','Fantic','Moto Guzzi','Can-Am',
  'SYM','NIU','Vmoto','Zero','Silence','Segway','Super Soco',
];

async function main() {
  const snap = await db.collection('concessions')
    .where('brands', '==', [])
    .limit(2000)
    .get();

  console.log(`Fiches sans marque analysées : ${snap.docs.length}\n`);

  const brandInCategory = {};
  const samples = {};

  snap.docs.forEach(doc => {
    const d = doc.data();
    const category = (d.category || '').toLowerCase();
    const title = (d.title || '').toLowerCase();

    // Chercher les marques dans la category (pas le title, déjà fait)
    BRANDS_TO_CHECK.forEach(brand => {
      const pattern = brand.toLowerCase().replace(/[-\s]/g, '[\\s\\-]?');
      const regex = new RegExp(pattern, 'i');
      if (regex.test(category) && !regex.test(title)) {
        // Marque dans category mais PAS dans title → non détectée
        const key = brand === 'CFMOTO' ? 'CF Moto' : brand;
        brandInCategory[key] = (brandInCategory[key] || 0) + 1;
        if (!samples[key]) samples[key] = [];
        if (samples[key].length < 3) {
          samples[key].push({
            title: d.title?.substring(0, 50),
            category: d.category?.substring(0, 80),
          });
        }
      }
    });
  });

  console.log('=== MARQUES TROUVÉES DANS "category" (non détectées via le titre) ===\n');
  Object.entries(brandInCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([brand, count]) => {
      console.log(`${brand} : ${count} ateliers supplémentaires`);
      samples[brand]?.forEach(s => {
        console.log(`   → "${s.title}" | cat: "${s.category}"`);
      });
    });

  console.log('\n=== TOTAL FICHES SANS MARQUE ===');
  const total = await db.collection('concessions').where('brands', '==', []).get();
  console.log(`${total.size} fiches sans aucune marque détectée`);
}

main().catch(console.error).finally(() => process.exit());

const admin = require('./node_modules/firebase-admin');
const fs = require('fs');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

const TOP_FICHES = [
  { slug: 'rad-tournai', col: 'concessions', imp: 644, clics: 0, pos: 9.3 },
  { slug: 'kawasaki-saint-etienne-premiere-avenue', col: 'concessions', imp: 176, clics: 2, pos: 7.5 },
  { slug: 'royal-enfield-lille', col: 'concessions', imp: 117, clics: 0, pos: 9.9 },
  { slug: 'dafy-moto-saint-brice-sous-foret', col: 'concessions', imp: 104, clics: 0, pos: 10.7 },
  { slug: 'mobbie', col: 'concessions', imp: 101, clics: 0, pos: 9.0 },
  { slug: 'pro-scoot', col: 'concessions', imp: 100, clics: 0, pos: 9.5 },
  { slug: 'speedway-herblay', col: 'concessions', imp: 100, clics: 0, pos: 10.4 },
  { slug: 'dafy-moto-livry-gargan', col: 'concessions', imp: 90, clics: 0, pos: 5.8 },
  { slug: 'horizon-ride-bmw-motorrad-saint-maximin', col: 'concessions', imp: 84, clics: 0, pos: 8.0 },
  { slug: 'ride-avenue-frejus', col: 'concessions', imp: 81, clics: 0, pos: 9.4 },
  { slug: 'moto-repere-angers', col: 'concessions', imp: 78, clics: 0, pos: 8.5 },
  { slug: 'kd-quad-concessionnaire-can-am-cf-moto-kymco', col: 'concessions', imp: 77, clics: 0, pos: 7.5 },
  { slug: 'jm-motors-anglet', col: 'concessions', imp: 75, clics: 0, pos: 7.5 },
  { slug: 'bmw-helice-69-lyon-sud-motown', col: 'concessions', imp: 75, clics: 0, pos: 9.3 },
  { slug: 'holeshot-racing-concessionnaire-yamaha-motos-scooters-et-quads-ssv-saint-omer', col: 'concessions', imp: 72, clics: 0, pos: 7.4 },
  { slug: 'ducati-montpellier', col: 'concessions', imp: 71, clics: 0, pos: 9.4 },
  { slug: 'honda-grande-armee', col: 'concessions', imp: 68, clics: 0, pos: 8.4 },
  { slug: 'becane-n6', col: 'concessions', imp: 65, clics: 0, pos: 5.4 },
  { slug: 'yamaha-motor-france-paris-xv', col: 'concessions', imp: 62, clics: 0, pos: 8.7 },
  { slug: 'kove-moto-aubiere', col: 'concessions', imp: 58, clics: 0, pos: 9.0 },
  { slug: 'triumph-orleans', col: 'concessions', imp: 57, clics: 0, pos: 8.3 },
  { slug: 'moto-69-brignais', col: 'concessions', imp: 55, clics: 0, pos: 8.1 },
  { slug: 'honda-moto-quimper', col: 'concessions', imp: 53, clics: 0, pos: 9.5 },
  { slug: 'cf-moto-villefranche-sur-saone', col: 'concessions', imp: 52, clics: 0, pos: 8.8 },
  { slug: 'racing-concept-43', col: 'concessions', imp: 54, clics: 0, pos: 10.2 },
];

async function main() {
  console.log('RAPPORT PROSPECTION B2B LABELMOTO\n');
  const csvLines = ['Rang,Nom,Adresse,Telephone,Email,Impressions,Clics,Position'];

  for (let i = 0; i < TOP_FICHES.length; i++) {
    const { slug, col, imp, clics, pos } = TOP_FICHES[i];
    let data = null, docId = null;

    const snapSlug = await db.collection(col).where('slug', '==', slug).limit(1).get();
    if (!snapSlug.empty) { data = snapSlug.docs[0].data(); docId = snapSlug.docs[0].id; }
    else {
      const d = await db.collection(col).doc(slug).get();
      if (d.exists) { data = d.data(); docId = d.id; }
    }

    const nom = data?.title || slug;
    const tel = data?.phoneNumber || data?.pnoneNumber || '';
    const email = data?.email || '';
    const adresse = data?.address || '';

    console.log(`${i+1}. ${nom} | ${imp} imp | ${clics} clics | pos ${pos}`);
    console.log(`   Tel: ${tel || '-'} | Email: ${email || '-'}`);
    console.log(`   ${adresse}`);

    csvLines.push([i+1, `"${nom}"`, `"${adresse}"`, `"${tel}"`, `"${email}"`, imp, clics, pos].join(','));
  }

  fs.writeFileSync('./prospection_b2b_labelmoto.csv', csvLines.join('\n'));
  console.log('\nCSV sauvegarde : prospection_b2b_labelmoto.csv');
}

main().catch(console.error).finally(() => process.exit());

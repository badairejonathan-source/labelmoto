/**
 * check-quick-win-titles-v2.js — LabelMoto
 * Usage : node check-quick-win-titles-v2.js
 *
 * Même diagnostic que la v1, mais simule la logique CORRIGÉE (post-patch) :
 * regex 4-5 chiffres + troncature qui préserve toujours "LabelMoto".
 */
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

const SLUGS = [
  'rad-tournai',
  'ducati-la-rochelle',
  'cfmoto-binche',
  'dafy-moto-saint-brice-sous-foret',
  'motoemotion-luxembourg',
];

function simulateTitle(pro) {
  const addrParts = (pro.address || '').split(',').map(s => s.trim());
  const cpSegIdx = addrParts.findIndex(p => /\d{4,5}/.test(p));
  const ville = cpSegIdx !== -1
    ? addrParts[cpSegIdx].replace(/\d{4,5}\s*/, '').trim()
    : addrParts[addrParts.length - 1] || '';
  const shortName = (pro.title || '').split(/\s*[\-\/\|]\s*/)[0].trim();
  const villeInName = shortName.toLowerCase().includes((ville || '').toLowerCase());
  const typeLabel = pro.appSection === 'service' ? 'Atelier moto' : pro.appSection === 'association' ? 'Club moto' : 'Concessionnaire moto';
  const titleSuffix = ` — ${typeLabel} | LabelMoto`;
  const titleNamePart = `${shortName}${ville && !villeInName ? ' à ' + ville : ''}`;
  const maxNameLen = 65 - titleSuffix.length;
  const truncatedNamePart = titleNamePart.length > maxNameLen
    ? titleNamePart.slice(0, Math.max(0, maxNameLen - 1)).trim() + '…'
    : titleNamePart;
  const title = `${truncatedNamePart}${titleSuffix}`;
  return { ville, cpSegIdx, shortName, title };
}

async function run() {
  for (const slug of SLUGS) {
    console.log(`\n════════════════════════════════════`);
    console.log(`SLUG: ${slug}`);
    let data;
    const doc = await db.collection('concessions').doc(slug).get();
    if (doc.exists) {
      data = doc.data();
    } else {
      const q = await db.collection('concessions').where('slug', '==', slug).limit(1).get();
      if (q.empty) { console.log('❌  Introuvable.'); continue; }
      data = q.docs[0].data();
    }
    const sim = simulateTitle(data);
    console.log('ville extraite   :', JSON.stringify(sim.ville), sim.cpSegIdx === -1 ? '(fallback dernier segment)' : '');
    console.log('TITLE (nouveau)  :', JSON.stringify(sim.title), `(${sim.title.length} caractères)`);
  }
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });

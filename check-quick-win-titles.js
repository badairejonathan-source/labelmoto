/**
 * check-quick-win-titles.js — LabelMoto
 * Usage : node check-quick-win-titles.js
 *
 * Diagnostic en lecture seule : va chercher les documents Firestore des
 * concessions quick-win identifiées dans GSC, affiche leurs champs bruts
 * (title, address, appSection) et simule le calcul du title actuel pour
 * voir ce qui est réellement généré aujourd'hui.
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
  const cpSegIdx = addrParts.findIndex(p => /\d{5}/.test(p));
  const ville = cpSegIdx !== -1
    ? addrParts[cpSegIdx].replace(/\d{5}\s*/, '').trim()
    : addrParts[addrParts.length - 1] || '';
  const shortName = (pro.title || '').split(/\s*[\-\/\|]\s*/)[0].trim();
  const villeInName = shortName.toLowerCase().includes((ville || '').toLowerCase());
  const typeLabel = pro.appSection === 'service' ? 'Atelier moto' : pro.appSection === 'association' ? 'Club moto' : 'Concessionnaire moto';
  const title = `${shortName}${ville && !villeInName ? ' à ' + ville : ''} — ${typeLabel} | LabelMoto`.slice(0, 65);
  return { addrParts, cpSegIdx, ville, shortName, title };
}

async function run() {
  for (const slug of SLUGS) {
    console.log(`\n════════════════════════════════════`);
    console.log(`SLUG: ${slug}`);
    const doc = await db.collection('concessions').doc(slug).get();
    if (!doc.exists) {
      console.log('❌  Document introuvable avec cet ID exact. Recherche par slug...');
      const q = await db.collection('concessions').where('slug', '==', slug).limit(1).get();
      if (q.empty) {
        console.log('❌  Introuvable aussi par champ slug. À vérifier manuellement.');
        continue;
      }
      const d = q.docs[0];
      console.log(`✅  Trouvé via champ slug, doc.id réel = ${d.id}`);
      printDoc(d.data());
      continue;
    }
    printDoc(doc.data());
  }
  process.exit(0);
}

function printDoc(pro) {
  console.log('title (brut)     :', JSON.stringify(pro.title));
  console.log('address (brut)   :', JSON.stringify(pro.address));
  console.log('appSection       :', pro.appSection);
  const sim = simulateTitle(pro);
  console.log('→ ville extraite :', JSON.stringify(sim.ville), sim.cpSegIdx === -1 ? '(⚠️  AUCUN segment 5-chiffres trouvé, fallback dernier segment)' : '');
  console.log('→ shortName      :', JSON.stringify(sim.shortName));
  console.log('→ TITLE CALCULÉ  :', JSON.stringify(sim.title));
}

run().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});

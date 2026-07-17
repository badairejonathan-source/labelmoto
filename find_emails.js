const admin = require('./node_modules/firebase-admin');
const https = require('https');
const http = require('http');

admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

const SLUGS = [
  'kawasaki-saint-etienne-premiere-avenue',
  'royal-enfield-lille',
  'dafy-moto-saint-brice-sous-foret',
  'mobbie',
  'speedway-herblay',
  'dafy-moto-livry-gargan',
  'horizon-ride-bmw-motorrad-saint-maximin',
  'ride-avenue-frejus',
  'moto-repere-angers',
  'jm-motors-anglet',
  'bmw-helice-69-lyon-sud-motown',
  'holeshot-racing-concessionnaire-yamaha-motos-scooters-et-quads-ssv-saint-omer',
  'ducati-montpellier',
  'honda-grande-armee',
  'becane-n6',
  'yamaha-motor-france-paris-xv',
  'triumph-orleans',
];

function fetchPage(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { timeout: 5000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

function extractEmails(html) {
  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const found = html.match(regex) || [];
  // Filtrer les emails génériques/faux
  return [...new Set(found)].filter(e =>
    !e.includes('example') && !e.includes('sentry') &&
    !e.includes('wix') && !e.includes('google') &&
    !e.includes('schema') && !e.includes('.png') &&
    !e.includes('.jpg') && e.length < 60
  );
}

async function main() {
  console.log('=== RECHERCHE EMAILS CONCESSIONS ===\n');

  for (const slug of SLUGS) {
    // Lire depuis Firestore
    const doc = await db.collection('concessions').doc(slug).get();
    if (!doc.exists) {
      // Essai par slug
      const snap = await db.collection('concessions').where('slug', '==', slug).limit(1).get();
      if (snap.empty) { console.log(`❌ ${slug} — introuvable`); continue; }
    }

    const data = doc.exists ? doc.data() : (await db.collection('concessions').where('slug', '==', slug).limit(1).get()).docs[0]?.data();
    if (!data) continue;

    const nom = data.title || slug;
    const website = data.website || '';
    const emailExistant = data.email || '';

    if (emailExistant) {
      console.log(`✅ ${nom} — email existant : ${emailExistant}`);
      continue;
    }

    if (!website) {
      console.log(`⚠️  ${nom} — pas de website renseigné`);
      continue;
    }

    console.log(`🔍 ${nom} — ${website}`);

    // Essai page d'accueil
    let html = await fetchPage(website);
    let emails = extractEmails(html);

    // Essai page contact si rien trouvé
    if (!emails.length) {
      const contactUrl = website.replace(/\/$/, '') + '/contact';
      html = await fetchPage(contactUrl);
      emails = extractEmails(html);
    }

    if (emails.length) {
      console.log(`   📧 Emails trouvés : ${emails.join(', ')}`);
      // Sauvegarder le premier email dans Firestore
      const docRef = doc.exists ? doc.ref : (await db.collection('concessions').where('slug', '==', slug).limit(1).get()).docs[0]?.ref;
      if (docRef && emails[0]) {
        await docRef.update({ email: emails[0] });
        console.log(`   ✅ Sauvegardé dans Firestore : ${emails[0]}`);
      }
    } else {
      console.log(`   ❌ Aucun email trouvé sur le site`);
    }

    // Pause pour ne pas surcharger
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n✅ Recherche terminée');
}

main().catch(console.error).finally(() => process.exit());

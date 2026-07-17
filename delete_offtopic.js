const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// Catégories hors-sujet STRICTES (pas de moto dedans)
const OFFTOPIC_CATS_STRICT = [
  'vendeur de voitures d\'occasion',
  'concessionnaire de bateaux',
  'concessionnaire automobile',
  'garage automobile',
];

// Mots-clés STRICTS dans le titre (mots complets, pas sous-chaînes)
const OFFTOPIC_TITLE_WORDS = [
  'renault', 'peugeot automobile', 'toyota', 'ford', 'volkswagen',
  'opel', 'citroen', 'fiat auto', 'land rover', 'simplicicar',
  'immobilier', 'immo ', 'caravane', 'camping-car',
  'audiovisuel', 'cinéma équipement',
];

// Slugs SPÉCIFIQUES à supprimer manuellement (vérifiés dans l'audit)
const SPECIFIC_SLUGS_TO_DELETE = [
  'garage-saint-pierre-renault',        // Renault
  'ali-auto',                           // voitures occasion
  'atelier-nautique-de-kerollaire',     // bateaux
  'f2g-auto-moto',                      // voitures occasion
  'david-et-kim-blb-immobilier-les-essarts-le-roi', // immobilier
  'cama-renault',                       // Renault
  'bmw-motorrad',                       // siège social BMW (pas un dealer)
];

// Liste blanche : ne JAMAIS supprimer ces fiches même si catégorie/titre match
const WHITELIST_KEYWORDS = [
  'moto', 'scooter', 'deux-roue', '2 roue', '2roue', 'quad', 'mécanique',
  'kawasaki', 'honda', 'yamaha', 'suzuki', 'ducati', 'triumph', 'ktm',
  'harley', 'bmw motorrad', 'dafy', 'speedway',
];

function isWhitelisted(title, category) {
  const text = ((title || '') + ' ' + (category || '')).toLowerCase();
  return WHITELIST_KEYWORDS.some(k => text.includes(k));
}

function isOffTopic(title, category) {
  const titleLow = (title || '').toLowerCase();
  const catLow = (category || '').toLowerCase();

  // Vérifier catégorie stricte
  if (OFFTOPIC_CATS_STRICT.some(c => catLow.includes(c))) return true;

  // Vérifier mots-clés titre stricts (mots entiers)
  if (OFFTOPIC_TITLE_WORDS.some(w => titleLow.includes(w))) return true;

  return false;
}

async function main() {
  const snap = await db.collection('concessions').get();
  const toDelete = [];

  // Catégories/titres hors-sujet
  snap.docs.forEach(doc => {
    const d = doc.data();
    if (isOffTopic(d.title, d.category) && !isWhitelisted(d.title, d.category)) {
      toDelete.push(doc.id);
    }
  });

  // Slugs spécifiques
  SPECIFIC_SLUGS_TO_DELETE.forEach(slug => {
    if (!toDelete.includes(slug)) toDelete.push(slug);
  });

  // Affichage pour vérification
  console.log(`\n=== ${toDelete.length} fiches à supprimer ===\n`);

  let confirmed = 0;
  for (const id of toDelete) {
    const doc = await db.collection('concessions').doc(id).get();
    if (doc.exists) {
      const d = doc.data();
      console.log(`✓ [${id}]`);
      console.log(`  ${d.title} | ${(d.category || '').substring(0, 40)}`);
      confirmed++;
    } else {
      console.log(`? [${id}] introuvable par ID — essai par slug...`);
      const q = await db.collection('concessions').where('slug', '==', id).limit(1).get();
      if (!q.empty) {
        const d = q.docs[0].data();
        console.log(`  ${d.title} | ${(d.category || '').substring(0, 40)}`);
        toDelete[toDelete.indexOf(id)] = q.docs[0].id;
        confirmed++;
      }
    }
  }

  console.log(`\n${confirmed} fiches confirmées pour suppression.`);

  // Demander confirmation via argument --confirm
  if (process.argv.includes('--confirm')) {
    console.log('\n🗑️  Suppression en cours...');
    let deleted = 0;
    for (const id of toDelete) {
      try {
        await db.collection('concessions').doc(id).delete();
        deleted++;
        process.stdout.write('.');
      } catch(e) {}
    }
    console.log(`\n✅ ${deleted} fiches supprimées de Firestore`);
  } else {
    console.log('\n⚠️  Pour supprimer, relance avec : node delete_offtopic.js --confirm');
  }
}

main().catch(console.error).finally(() => process.exit());

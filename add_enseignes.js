const fs = require('fs');
const path = require('path');
const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// ─── 1. Migration Firestore : ajouter les enseignes dans brands[] ─────────────
const ENSEIGNE_RULES = [
  { brand: 'Dafy Moto', patterns: ['dafy'] },
  { brand: 'Speedway', patterns: ['speedway'] },
  { brand: "Doc'Biker", patterns: ["doc'biker", 'docbiker', 'doc biker'] },
  { brand: 'TeamAxe', patterns: ['teamaxe', 'team axe'] },
];

async function migrateEnseignes() {
  console.log('Migration enseignes dans Firestore...');
  const snap = await db.collection('concessions').get();
  let batch = db.batch();
  let count = 0;
  let updated = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const title = (data.title || '').toLowerCase();
    const currentBrands = data.brands || [];
    const newBrands = [...currentBrands];
    let changed = false;

    for (const rule of ENSEIGNE_RULES) {
      if (rule.patterns.some(p => title.includes(p)) && !newBrands.includes(rule.brand)) {
        newBrands.push(rule.brand);
        changed = true;
      }
    }

    if (changed) {
      batch.update(doc.ref, { brands: newBrands });
      updated++;
    }

    count++;
    if (count === 400) {
      await batch.commit();
      batch = db.batch();
      count = 0;
      process.stdout.write('.');
    }
  }
  if (count > 0) await batch.commit();

  console.log(`\n✅ ${updated} fiches enrichies avec enseigne`);

  // Vérification
  for (const rule of ENSEIGNE_RULES) {
    const s = await db.collection('concessions').where('brands', 'array-contains', rule.brand).get();
    console.log(`  ${rule.brand} : ${s.size} fiches`);
  }
}

// ─── 2. Ajouter les enseignes dans brands.ts ──────────────────────────────────
const newEnseignes = `
  {
    slug: 'dafy',
    name: 'Dafy Moto',
    displayName: 'Dafy Moto',
    firestoreValue: 'Dafy Moto',
    metaTitle: "Trouver un Dafy Moto en France : 158 magasins vérifiés | LabelMoto",
    metaDescription: "Trouvez le Dafy Moto le plus proche parmi 158 magasins référencés en France. Équipements moto, accessoires, pièces détachées et atelier — contacts et horaires sur LabelMoto.",
    h1: 'Magasins Dafy Moto en France',
    intro: [
      "Dafy Moto est la plus grande chaîne française de distribution d'équipements et d'accessoires moto avec plus de 150 magasins en France. Casques, blousons, gants, bottes, pneus et pièces détachées — Dafy propose une offre complète avec des prix compétitifs et un réseau national dense.",
      "LabelMoto recense tous les magasins Dafy Moto en France avec fiches vérifiées, horaires et coordonnées directes pour trouver le point de vente le plus proche.",
    ],
    faq: [
      { q: "Où trouver un Dafy Moto près de chez moi ?", a: "LabelMoto recense 158 magasins Dafy Moto en France. Utilisez la carte interactive pour trouver l'adresse et les horaires du magasin le plus proche de vous." },
      { q: "Dafy Moto propose-t-il des services d'atelier ?", a: "Certains magasins Dafy disposent d'un atelier pour l'entretien et la réparation de motos. Consultez la fiche du magasin le plus proche sur LabelMoto pour vérifier les services disponibles." },
      { q: "Peut-on essayer les équipements en magasin Dafy ?", a: "Oui, les magasins Dafy permettent l'essayage de casques, blousons et autres équipements. C'est l'un des avantages du réseau physique par rapport aux achats en ligne." },
    ],
  },
  {
    slug: 'speedway',
    name: 'Speedway',
    displayName: 'Speedway',
    firestoreValue: 'Speedway',
    metaTitle: "Trouver un Speedway en France : 21 magasins vérifiés | LabelMoto",
    metaDescription: "Trouvez le magasin Speedway le plus proche parmi 21 adresses référencées en France. Équipements moto, accessoires et atelier — contacts et horaires sur LabelMoto.",
    h1: 'Magasins Speedway en France',
    intro: [
      "Speedway est une chaîne française de distribution d'équipements moto présente dans toute la France avec plus de 20 magasins. Spécialisée dans les casques, équipements de protection et accessoires moto, Speedway propose des conseils personnalisés par des passionnés.",
      "LabelMoto recense tous les magasins Speedway en France avec fiches vérifiées, horaires et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un magasin Speedway près de chez moi ?", a: "LabelMoto recense 21 magasins Speedway en France. Utilisez la carte interactive pour trouver l'adresse et les horaires du magasin le plus proche." },
      { q: "Speedway est-il moins cher que Dafy Moto ?", a: "Les deux enseignes sont comparables en termes de prix et de gamme. Speedway est parfois perçu comme plus spécialisé dans l'équipement premium. Comparez les offres en magasin pour les grandes marques de casques et vêtements." },
      { q: "Speedway propose-t-il des services d'atelier ?", a: "Certains magasins Speedway disposent d'un atelier ou proposent des services comme le montage de pneus. Consultez la fiche du magasin le plus proche sur LabelMoto." },
    ],
  },
  {
    slug: 'docbiker',
    name: "Doc'Biker",
    displayName: "Doc'Biker",
    firestoreValue: "Doc'Biker",
    metaTitle: "Trouver un Doc'Biker en France : 15 magasins vérifiés | LabelMoto",
    metaDescription: "Trouvez le Doc'Biker le plus proche parmi 15 adresses référencées en France. Entretien moto, réparation, équipements — contacts et horaires sur LabelMoto.",
    h1: "Magasins Doc'Biker en France",
    intro: [
      "Doc'Biker est une chaîne française spécialisée dans l'entretien et la réparation de motos et scooters, présente avec plus de 15 centres en France. Révisions, diagnostics, pneus, chaînes et pièces détachées — Doc'Biker propose des services complets à prix transparents.",
      "LabelMoto recense tous les centres Doc'Biker en France avec fiches vérifiées, horaires et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un Doc'Biker près de chez moi ?", a: "LabelMoto recense 15 centres Doc'Biker en France, principalement en région parisienne et dans les grandes villes. Utilisez la carte interactive pour trouver le plus proche." },
      { q: "Doc'Biker assure-t-il les révisions sous garantie constructeur ?", a: "Doc'Biker est un atelier indépendant. Pour les motos sous garantie constructeur, vérifiez que l'entretien respecte les préconisations du carnet. En cas de doute, préférez un concessionnaire agréé de la marque." },
      { q: "Quel est le prix d'une révision chez Doc'Biker ?", a: "Doc'Biker est généralement positionné dans la moyenne du marché, parfois moins cher qu'une concession officielle. Les tarifs varient selon le modèle et le type d'intervention. Contactez le centre le plus proche pour un devis." },
    ],
  },
  {
    slug: 'teamaxe',
    name: 'TeamAxe',
    displayName: 'TeamAxe',
    firestoreValue: 'TeamAxe',
    metaTitle: "Trouver un TeamAxe en France : 8 magasins vérifiés | LabelMoto",
    metaDescription: "Trouvez le magasin TeamAxe le plus proche parmi 8 adresses référencées en France. Équipements moto premium, accessoires et casques — contacts et horaires sur LabelMoto.",
    h1: 'Magasins TeamAxe en France',
    intro: [
      "TeamAxe est une enseigne parisienne et nationale spécialisée dans les équipements moto premium, avec une présence forte sur l'avenue de la Grande Armée et plusieurs magasins en France. Casques haut de gamme, équipements de protection et accessoires — TeamAxe s'adresse aux motards exigeants.",
      "LabelMoto recense tous les magasins TeamAxe en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un magasin TeamAxe près de chez moi ?", a: "LabelMoto recense 8 magasins TeamAxe en France. Consultez la carte interactive pour trouver l'adresse et les horaires du magasin le plus proche." },
      { q: "TeamAxe est-il spécialisé dans les casques premium ?", a: "Oui, TeamAxe est reconnu pour son offre de casques premium (Shoei, Arai, AGV) et ses équipements de protection haut de gamme. Le conseil en magasin est particulièrement apprécié par les clients." },
      { q: "Peut-on trouver des pièces détachées chez TeamAxe ?", a: "TeamAxe est principalement spécialisé dans l'équipement du pilote (casques, vêtements, gants, bottes) plutôt que dans les pièces mécaniques. Pour les pièces détachées, orientez-vous vers Dafy Moto ou une concession de votre marque." },
    ],
  },`;

const brandsPath = path.join(process.cwd(), 'src/app/lib/brands.ts');
let brands = fs.readFileSync(brandsPath, 'utf8');

const oldClose = `];

export function getBrandBySlug`;
const newClose = `${newEnseignes}
];

export function getBrandBySlug`;

if (!brands.includes(oldClose)) {
  console.error('❌ Fermeture du tableau BRANDS introuvable');
  process.exit(1);
}
brands = brands.replace(oldClose, newClose);
fs.writeFileSync(brandsPath, brands, 'utf8');
console.log('✅ 4 enseignes ajoutées dans brands.ts (Dafy, Speedway, DocBiker, TeamAxe)');

migrateEnseignes().catch(console.error).finally(() => process.exit());

const fs = require('fs');
const path = require('path');
const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

// ─── 1. Migration Firestore ───────────────────────────────────────────────────
async function migrate() {
  console.log('Migration Moto Axxe + Cardy dans Firestore...');
  const snap = await db.collection('concessions').get();
  let batch = db.batch();
  let count = 0, updated = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const title = (data.title || '').toLowerCase();
    const currentBrands = data.brands || [];
    const newBrands = [...currentBrands];
    let changed = false;

    if (title.includes('axxe') && !newBrands.includes('Moto Axxe')) {
      newBrands.push('Moto Axxe');
      changed = true;
    }
    if (title.includes('cardy') && !newBrands.includes('Cardy')) {
      newBrands.push('Cardy');
      changed = true;
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

  // Vérification
  const axxeSnap = await db.collection('concessions').where('brands', 'array-contains', 'Moto Axxe').get();
  const cardySnap = await db.collection('concessions').where('brands', 'array-contains', 'Cardy').get();
  console.log(`\n✅ Moto Axxe : ${axxeSnap.size} fiches`);
  console.log(`✅ Cardy : ${cardySnap.size} fiches`);
}

// ─── 2. Ajouter dans brands.ts ────────────────────────────────────────────────
const newEntries = `
  {
    slug: 'moto-axxe',
    name: 'Moto Axxe',
    displayName: 'Moto Axxe',
    firestoreValue: 'Moto Axxe',
    metaTitle: "Trouver un Moto Axxe en France : 148 magasins vérifiés | LabelMoto",
    metaDescription: "Trouvez le magasin Moto Axxe le plus proche parmi 148 adresses référencées en France. Équipements moto, casques, pneus, atelier et concessions multimarques — contacts sur LabelMoto.",
    h1: 'Magasins Moto Axxe en France',
    intro: [
      "Moto Axxe est le deuxième réseau français de distribution d'équipements et de matériels moto avec plus de 100 magasins en France. Casques, blousons, gants, bottes, pneus et accessoires — mais aussi ateliers multimarques et concessions (CF Moto, Zontes, SYM) dans de nombreuses enseignes. Moto Axxe organise également les célèbres Moto Axxe Days, des journées circuit sur les plus grands tracés français.",
      "LabelMoto recense tous les magasins Moto Axxe en France avec fiches vérifiées, horaires et coordonnées directes pour trouver le point de vente le plus proche.",
    ],
    faq: [
      { q: "Où trouver un magasin Moto Axxe près de chez moi ?", a: "LabelMoto recense 148 magasins Moto Axxe en France, du réseau le plus dense après Dafy Moto. Utilisez la carte interactive pour trouver l'adresse et les horaires du magasin le plus proche." },
      { q: "Moto Axxe vend-il des motos neuves ?", a: "Oui, de nombreux magasins Moto Axxe sont également concessionnaires de marques comme CF Moto, Zontes ou SYM. Le réseau combine vente d'équipements et vente de motos selon les points de vente." },
      { q: "Moto Axxe propose-t-il des services d'atelier ?", a: "Oui, la plupart des magasins Moto Axxe disposent d'un atelier multimarques pour l'entretien et la réparation. Certains proposent également le montage de pneus en service express." },
    ],
  },
  {
    slug: 'cardy',
    name: 'Cardy',
    displayName: 'Cardy',
    firestoreValue: 'Cardy',
    metaTitle: "Trouver un Cardy en France : 10 magasins vérifiés | LabelMoto",
    metaDescription: "Trouvez le magasin Cardy le plus proche parmi 10 adresses référencées en France. Équipements moto premium, casques et accessoires — contacts et horaires sur LabelMoto.",
    h1: 'Magasins Cardy en France',
    intro: [
      "Cardy est une enseigne française spécialisée dans les équipements moto premium, présente dans une dizaine de magasins en France. Casques haut de gamme, équipements de protection, accessoires et pneumatiques — Cardy s'adresse aux motards exigeants qui cherchent un conseil expert en boutique.",
      "LabelMoto recense tous les magasins Cardy en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un magasin Cardy près de chez moi ?", a: "LabelMoto recense 10 magasins Cardy en France. Consultez la carte interactive pour trouver l'adresse et les horaires du magasin le plus proche." },
      { q: "Cardy est-il spécialisé dans les équipements premium ?", a: "Oui, Cardy est reconnu pour son offre d'équipements haut de gamme (Shoei, Arai, AGV, Alpinestars) et son conseil personnalisé par des passionnés de moto." },
      { q: "Peut-on essayer les équipements chez Cardy ?", a: "Oui, les magasins Cardy permettent l'essayage de casques et vêtements. Le conseil en boutique est l'un des points forts de l'enseigne." },
    ],
  },`;

const brandsPath = path.join(process.cwd(), 'src/app/lib/brands.ts');
let brands = fs.readFileSync(brandsPath, 'utf8');

const oldClose = `];

export function getBrandBySlug`;
const newClose = `${newEntries}
];

export function getBrandBySlug`;

if (!brands.includes(oldClose)) {
  console.error('❌ Fermeture du tableau BRANDS introuvable');
  process.exit(1);
}
brands = brands.replace(oldClose, newClose);
fs.writeFileSync(brandsPath, brands, 'utf8');
console.log('✅ Moto Axxe + Cardy ajoutés dans brands.ts');

migrate().catch(console.error).finally(() => process.exit());

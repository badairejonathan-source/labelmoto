/**
 * update-article-chinoises-images.js — LabelMoto
 * Usage : node update-article-chinoises-images.js
 *
 * Met à jour articles/motos-chinoises-france-2026 :
 *  - Remplace imageUrl (image de couverture) par la nouvelle image de groupe
 *  - Ajoute un champ "image" aux 8 sous-sections de la section
 *    "Les meilleures motos chinoises" (CFMoto 450MT, 675SR-R, 800MT,
 *    Voge DS625X, DS900X, Zontes 703F, QJ Motor SRT 450, Kove 800X)
 *
 * Lit d'abord le document, affiche un aperçu du changement, puis écrit.
 */
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

const BASE_URL = 'https://labelmoto.fr/images';

const COVER_IMAGE = `${BASE_URL}/motos-chinoises-hero-groupe.webp`;

// Mapping titre exact de sous-section -> nom de fichier image
const IMAGE_BY_TITLE = {
  'CFMoto 450MT': 'cfmoto-450mt-hero.webp',
  'CFMoto 675SR-R': 'cfmoto-675sr-r-hero.webp',
  'CFMoto 800MT': 'cfmoto-800mt-hero.webp',
  'Voge DS625X': 'voge-625dsx-hero.webp',
  'Voge DS900X': 'voge-900dsx-hero.webp',
  'Zontes 703F': 'zontes-703f-touring-hero.webp',
  'QJ Motor SRT 450': 'qjmotor-srt450-hero.webp',
  'Kove 800X': 'kove-800x-pro-hero.webp',
};

async function run() {
  const docRef = db.collection('articles').doc('motos-chinoises-france-2026');
  const doc = await docRef.get();
  if (!doc.exists) {
    console.error('❌  Document introuvable.');
    process.exit(1);
  }
  const data = doc.data();

  const sections = data.sections;
  const targetSectionIdx = sections.findIndex(s => s.title === 'Les meilleures motos chinoises');
  if (targetSectionIdx === -1) {
    console.error('❌  Section "Les meilleures motos chinoises" introuvable.');
    process.exit(1);
  }

  const subsections = sections[targetSectionIdx].subsections;
  let matched = 0;
  const unmatched = [];

  const updatedSubsections = subsections.map(sub => {
    const filename = IMAGE_BY_TITLE[sub.title];
    if (filename) {
      matched++;
      return { ...sub, image: `${BASE_URL}/${filename}` };
    }
    unmatched.push(sub.title);
    return sub;
  });

  sections[targetSectionIdx] = { ...sections[targetSectionIdx], subsections: updatedSubsections };

  console.log(`📸  Image de couverture : ${data.imageUrl} → ${COVER_IMAGE}`);
  console.log(`📸  ${matched}/8 sous-sections matchées avec une image :`);
  updatedSubsections.forEach(sub => {
    if (sub.image) console.log(`    ✅ ${sub.title} → ${sub.image}`);
  });
  if (unmatched.length > 0) {
    console.log(`⚠️   Sous-sections sans image (normal, hors des 8 ciblées) : ${unmatched.join(', ')}`);
  }

  await docRef.update({
    imageUrl: COVER_IMAGE,
    sections: sections,
  });

  console.log('\n✅  Document mis à jour avec succès.');
  process.exit(0);
}

run().catch(err => { console.error('Erreur:', err); process.exit(1); });

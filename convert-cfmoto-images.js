const sharp = require('sharp');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

const images = [
  { src: 'public/images/Entretien-CFMOTO450MT.png', dest: 'public/images/entretien-cfmoto-450mt.webp', docIds: ['cfmoto-450mt-2024-plus'] },
  { src: 'public/images/Entretien-CFMOTO450NK.png', dest: 'public/images/entretien-cfmoto-450nk.webp', docIds: ['cfmoto-450nk-2023-plus'] },
  { src: 'public/images/Entretien-CFMOTO450SR.png', dest: 'public/images/entretien-cfmoto-450sr.webp', docIds: ['cfmoto-450sr-2023-plus'] },
  { src: 'public/images/Entretien-CFMOTO650MT.png', dest: 'public/images/entretien-cfmoto-650mt.webp', docIds: [] },
  { src: 'public/images/Entretien-CFMOTO650NK.png', dest: 'public/images/entretien-cfmoto-650nk.webp', docIds: ['cfmoto-650mt-650nk-2020-plus'] },
  { src: 'public/images/Entretien-CFMOTO675SRR.png', dest: 'public/images/entretien-cfmoto-675srr.webp', docIds: ['cfmoto-675sr-r-2025-plus'] },
  { src: 'public/images/Entretien-CFMOTO700CLX.png', dest: 'public/images/entretien-cfmoto-700clx.webp', docIds: ['cfmoto-700clx-2021-plus'] },
  { src: 'public/images/Entretien-CFMOTO700MT.png', dest: 'public/images/entretien-cfmoto-700mt.webp', docIds: ['cfmoto-700mt-2023-plus'] },
  { src: 'public/images/Entretien-CFMOTO800MT.png', dest: 'public/images/entretien-cfmoto-800mt.webp', docIds: ['cfmoto-800mt-sport-explore-2023-plus', 'cfmoto-800mt-touring-2025-plus'] },
];

async function run() {
  for (const img of images) {
    if (!fs.existsSync(img.src)) { console.log('MANQUANT:', img.src); continue; }
    await sharp(img.src).webp({ quality: 85 }).toFile(img.dest);
    const before = Math.round(fs.statSync(img.src).size / 1024);
    const after = Math.round(fs.statSync(img.dest).size / 1024);
    console.log('OK:', path.basename(img.dest), before + 'kb ->', after + 'kb');
    for (const docId of img.docIds) {
      const imageUrl = '/images/' + path.basename(img.dest);
      await db.collection('motorcycle_sheets').doc(docId).update({ imageUrl });
      console.log('  Firestore:', docId, '->', imageUrl);
    }
  }
  // 800NK sans image dédiée -> 800MT
  await db.collection('motorcycle_sheets').doc('cfmoto-800nk-2024-plus').update({ imageUrl: '/images/entretien-cfmoto-450nk.webp' });
  console.log('  Firestore: cfmoto-800nk-2024-plus -> 450nk image (roadster)');
  // 300NK -> 450NK (même style roadster)
  await db.collection('motorcycle_sheets').doc('cfmoto-300nk-2020-plus').update({ imageUrl: '/images/entretien-cfmoto-450nk.webp' });
  console.log('  Firestore: cfmoto-300nk-2020-plus -> 450nk image');
  console.log('Termine.');
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });

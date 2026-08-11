/**
 * upload-images-chinoises.js — LabelMoto
 * Usage : node upload-images-chinoises.js
 *
 * Upload les 11 images WebP du dossier tmp-images-chinoises/ vers Firebase
 * Storage sous public/images/, les rend publiques, et applique un cache
 * long. Grâce au rewrite next.config.ts déjà en place, elles seront ensuite
 * accessibles directement via /images/{nom}.webp sur le site.
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const bucket = admin.storage().bucket('studio-4801889514-40ebd.firebasestorage.app');

const SOURCE_DIR = path.resolve(process.cwd(), 'tmp-images-chinoises');

const FILES = [
  'cfmoto-450mt-hero.webp',
  'cfmoto-675sr-r-hero.webp',
  'cfmoto-800mt-hero.webp',
  'kove-800x-pro-hero.webp',
  'motos-chinoises-hero-groupe.webp',
  'qjmotor-srt450-hero.webp',
  'voge-625dsx-hero.webp',
  'voge-900dsx-hero.webp',
  'zontes-350gk-hero.webp',
  'zontes-703f-touring-hero.webp',
  'zontes-703rr-hero.webp',
];

async function run() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌  Dossier introuvable : ${SOURCE_DIR}`);
    console.error('    Crée le dossier tmp-images-chinoises/ à la racine et glisse-y les 11 fichiers.');
    process.exit(1);
  }

  const missing = FILES.filter(f => !fs.existsSync(path.join(SOURCE_DIR, f)));
  if (missing.length > 0) {
    console.error('❌  Fichiers manquants dans tmp-images-chinoises/ :');
    missing.forEach(f => console.error(`    - ${f}`));
    process.exit(1);
  }

  console.log(`📄  ${FILES.length} fichiers trouvés, upload en cours...\n`);

  for (const file of FILES) {
    const localPath = path.join(SOURCE_DIR, file);
    const destPath = `public/images/${file}`;
    await bucket.upload(localPath, {
      destination: destPath,
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=86400',
      },
    });
    await bucket.file(destPath).makePublic();
    console.log(`✅  ${file} → gs://studio-4801889514-40ebd.firebasestorage.app/${destPath}`);
  }

  console.log('\n──────────────────────────────');
  console.log('✅  Terminé. Ces images sont maintenant accessibles via :');
  FILES.forEach(f => console.log(`    https://labelmoto.fr/images/${f}`));
  console.log('\n👉  Tu peux maintenant supprimer le dossier tmp-images-chinoises/ (les fichiers sont en sécurité sur Storage).');
}

run().catch(err => { console.error('Erreur:', err); process.exit(1); });

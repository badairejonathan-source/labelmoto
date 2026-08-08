/**
 * patch-storage-rewrites.js — LabelMoto
 * Usage : node patch-storage-rewrites.js
 *
 * Contournement du bug d'adaptateur Firebase App Hosting qui ne sert pas
 * fiablement certains fichiers de public/ (.webp, .geojson) une fois déployés,
 * alors qu'ils sont bien présents dans le repo (confirmé par diagnostic).
 *
 * Ajoute une section rewrites() à next.config.ts qui redirige TOUTES les
 * requêtes /images/:path* et /departements.geojson vers Firebase Storage,
 * de façon transparente — aucune référence dans le code n'a besoin de changer.
 *
 * PRÉREQUIS : avoir uploadé public/images/ et public/departements.geojson
 * vers gs://studio-4801889514-40ebd.firebasestorage.app/public/ AVANT de
 * déployer ce patch (sinon les images seront 404 des deux côtés).
 *
 * Fait une sauvegarde .bak avant toute modification.
 */
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(process.cwd(), 'next.config.ts');

if (!fs.existsSync(TARGET_FILE)) {
  console.error(`❌  Fichier introuvable : ${TARGET_FILE}`);
  process.exit(1);
}

let content = fs.readFileSync(TARGET_FILE, 'utf8');
const backupPath = TARGET_FILE + '.bak';
fs.writeFileSync(backupPath, content);
console.log(`💾  Sauvegarde créée : ${backupPath}`);

const ANCHOR = `  async headers() {`;
if (!content.includes(ANCHOR)) {
  console.error('❌  Ancre "async headers()" introuvable. Abandon (aucune modification écrite).');
  process.exit(1);
}

const STORAGE_BASE = 'https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public';

const REWRITES_BLOCK = `  // Contournement : l'adaptateur Firebase App Hosting ne sert pas fiablement
  // certains fichiers de public/ (.webp, .geojson) une fois déployés. On les
  // sert depuis Firebase Storage à la place, de façon transparente.
  async rewrites() {
    return [
      { source: '/images/:path*', destination: '${STORAGE_BASE}/images/:path*' },
      { source: '/departements.geojson', destination: '${STORAGE_BASE}/departements.geojson' },
    ];
  },
${ANCHOR}`;

content = content.replace(ANCHOR, REWRITES_BLOCK);
fs.writeFileSync(TARGET_FILE, content);

console.log('✅  Patch appliqué avec succès.');
console.log('👉  Vérifie avec :');
console.log('    grep -n "async rewrites" next.config.ts');
console.log('👉  Puis npm run build avant de push.');
console.log(`👉  En cas de problème, restaure avec : cp "${backupPath}" "${TARGET_FILE}"`);
console.log('\n⚠️   RAPPEL : assure-toi que gsutil cp -r public/images ... a bien été exécuté AVANT de déployer ce patch.');

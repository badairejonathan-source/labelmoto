/**
 * import_fiche.js — LabelMoto
 * Usage : node import_fiche.js <nom-du-fichier.json>
 * Exemple : node import_fiche.js cfmoto-450nk-2023-plus.json
 *
 * Dépose ce script UNE SEULE FOIS à la racine du projet.
 * Ensuite, pour chaque nouvelle fiche, dépose le JSON et lance la commande ci-dessus.
 */

const admin = require('firebase-admin');
const fs    = require('fs');
const path  = require('path');

// ── 1. Récupération du nom de fichier passé en argument ──────────────────────
const fileName = process.argv[2];

if (!fileName) {
  console.error('❌  Utilisation : node import_fiche.js <nom-du-fichier.json>');
  console.error('    Exemple     : node import_fiche.js cfmoto-450nk-2023-plus.json');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), fileName);

if (!fs.existsSync(filePath)) {
  console.error(`❌  Fichier introuvable : ${filePath}`);
  console.error('    Vérifie que le JSON est bien à la racine du projet.');
  process.exit(1);
}

// ── 2. Lecture et validation du JSON ────────────────────────────────────────
let data;
try {
  const raw = fs.readFileSync(filePath, 'utf8');
  data = JSON.parse(raw);
} catch (err) {
  console.error('❌  Erreur de lecture / parsing JSON :', err.message);
  process.exit(1);
}

if (!data.id) {
  console.error('❌  Le JSON ne contient pas de champ "id" — import annulé.');
  process.exit(1);
}

console.log(`📄  Fichier lu    : ${fileName}`);
console.log(`🔑  Document ID   : ${data.id}`);
console.log(`🏍️   Modèle        : ${data.brand} ${data.model}`);

// ── 3. Initialisation Firebase (applicationDefault = credentials Firebase Studio) ──
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});

const db = admin.firestore();

// ── 4. Import dans motorcycle_sheets ────────────────────────────────────────
async function importFiche() {
  try {
    const ref = db.collection('motorcycle_sheets').doc(data.id);
    await ref.set(data, { merge: true });
    console.log(`✅  Importé avec succès dans motorcycle_sheets/${data.id}`);
    console.log('🚀  Tu peux maintenant vérifier dans la console Firebase.');
  } catch (err) {
    console.error('❌  Erreur Firestore :', err.message);
    process.exit(1);
  }
}

importFiche();

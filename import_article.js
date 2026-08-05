/**
 * import_article.js — LabelMoto
 * Usage : node import_article.js <nom-du-fichier.json>
 * Exemple : node import_article.js motos-chinoises-france-2026.json
 *
 * Dépose ce script UNE SEULE FOIS à la racine du projet (comme import_fiche.js).
 * Le JSON doit contenir un champ "id" (utilisé comme ID du document et comme
 * slug de la page /info/[id]).
 */

const admin = require('firebase-admin');
const fs    = require('fs');
const path  = require('path');

// ── 1. Récupération du nom de fichier passé en argument ──────────────────────
const fileName = process.argv[2];

if (!fileName) {
  console.error('❌  Utilisation : node import_article.js <nom-du-fichier.json>');
  console.error('    Exemple     : node import_article.js motos-chinoises-france-2026.json');
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
console.log(`📰  Titre         : ${data.display_title || data.title}`);

// ── 3. Timestamps ───────────────────────────────────────────────────────
data.timestamps = {
  publishedAt: admin.firestore ? admin.firestore.Timestamp.now() : new Date(),
};
data.updatedAt = admin.firestore ? admin.firestore.Timestamp.now() : new Date();

// ── 4. Initialisation Firebase (applicationDefault = credentials Firebase Studio) ──
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});

const db = admin.firestore();

// Les Timestamps doivent être créés APRES initializeApp (admin.firestore.Timestamp
// n'existe qu'une fois l'app initialisée) — on les recalcule ici proprement.
data.timestamps = { publishedAt: admin.firestore.Timestamp.now() };
data.updatedAt = admin.firestore.Timestamp.now();

// ── 5. Import dans articles ─────────────────────────────────────────────────
async function importArticle() {
  try {
    const { id, ...articleData } = data;
    const ref = db.collection('articles').doc(id);
    await ref.set(articleData, { merge: true });
    console.log(`✅  Importé avec succès dans articles/${id}`);
    console.log(`🔗  Page publique : https://labelmoto.fr/info/${id}`);
    console.log('🚀  Tu peux maintenant vérifier dans la console Firebase.');
  } catch (err) {
    console.error('❌  Erreur Firestore :', err.message);
    process.exit(1);
  }
}

importArticle();

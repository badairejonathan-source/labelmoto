/**
 * fix_fiches.js — LabelMoto
 * Patch les nouvelles fiches avec les champs manquants
 * Usage : node fix_fiches.js
 */

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

// IDs des nouvelles fiches à corriger
const NEW_FICHES = [
  'cfmoto-450nk-2023-plus',
  'cfmoto-700clx-2021-plus',
  'cfmoto-650mt-650nk-2020-plus',
  'cfmoto-700mt-2023-plus',
  'cfmoto-300nk-2020-plus',
  'cfmoto-800mt-sport-explore-2023-plus',
];

// Champs à ajouter sur chaque fiche
// display_title = brand + model (comme les anciennes)
// type = "motorcycle_sheet" (standard)
// language = "fr"
// featured = false
// model_order = 0 (ordre neutre)
// search_tags = [] (à enrichir plus tard)
// brand_order corrigé à 7 pour CFMOTO

async function fixFiche(id) {
  const ref = db.collection('motorcycle_sheets').doc(id);
  const snap = await ref.get();

  if (!snap.exists) {
    console.log(`⚠️  ${id} — introuvable dans Firestore`);
    return;
  }

  const data = snap.data();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const patch = {
    display_title: `${data.brand} ${data.model}`,
    type: 'motorcycle_sheet',
    language: 'fr',
    featured: false,
    model_order: 0,
    search_tags: [
      data.brand,
      data.model,
      data.category,
      data.subcategory,
    ].filter(Boolean),
    year_range: data.technical_sheet?.years || '',
    brand_order: 7,           // CFMOTO = 7 (harmonisé avec les anciennes)
    timestamps: { createdAt: now, updatedAt: now },
    updatedAt: now,
  };

  await ref.set(patch, { merge: true });
  console.log(`✅  ${id} — patché (${patch.display_title})`);
}

async function main() {
  console.log(`🔧  Correction de ${NEW_FICHES.length} fiches...\n`);
  for (const id of NEW_FICHES) {
    await fixFiche(id);
  }
  console.log('\n🎉  Toutes les fiches ont été corrigées !');
}

main().catch(console.error).finally(() => process.exit());

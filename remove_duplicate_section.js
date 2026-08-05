/**
 * remove_duplicate_section.js — LabelMoto
 * Usage : node remove_duplicate_section.js
 *
 * Supprime la section "Comparez par budget" (ajoutée par erreur en double,
 * l'article contenait déjà des CTA équivalents) de
 * articles/meilleurs-casques-moto-2026.
 */

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});

const db = admin.firestore();

async function removeDuplicateSection() {
  const ref = db.collection('articles').doc('meilleurs-casques-moto-2026');
  const doc = await ref.get();

  if (!doc.exists) {
    console.error('❌  Document introuvable.');
    process.exit(1);
  }

  const data = doc.data();
  const sections = data.sections || [];
  const before = sections.length;

  const newSections = sections.filter(s => s.title !== 'Comparez par budget');

  if (newSections.length === before) {
    console.log('ℹ️  Section "Comparez par budget" introuvable — rien à faire.');
    process.exit(0);
  }

  await ref.update({ sections: newSections });
  console.log('✅  Section dupliquée supprimée avec succès.');
  console.log('🔗  Vérifie sur https://labelmoto.fr/info/meilleurs-casques-moto-2026');
}

removeDuplicateSection().then(() => process.exit(0)).catch(err => {
  console.error('❌  Erreur Firestore :', err.message);
  process.exit(1);
});

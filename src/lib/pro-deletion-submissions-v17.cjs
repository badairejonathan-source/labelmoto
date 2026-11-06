'use strict';
/**
 * Label Moto V17 : garde de securite en lecture seule pour les copies administratives.
 * Donnees du schema effectivement observe : listing_submissions.publishedDocId,
 * publishedCollection, status (dont 'published'). Aucun effacement ou anonymisation.
 * Les soumissions non encore associees par publishedDocId ne sont pas detectables par
 * cette requete : elles restent HORS COUVERTURE et imposent un traitement futur.
 * Utilisable uniquement dans le moteur DEMO V12, jamais en production.
 */
const MAX_CANDIDATES = 100;
const COLLECTIONS = new Set(['concessions', 'associations', 'relais', 'creators']);
const SAFE = /^[A-Za-z0-9_.-]{1,150}$/;
function stop(reason) { throw new Error('STOP_V17 : ' + reason); }
function validateTarget(t) {
  if (!t || !COLLECTIONS.has(t.collection) || typeof t.id !== 'string' ||
      !SAFE.test(t.id) || t.id.includes('..') || !t.id.startsWith('demo-')) {
    stop('cible fictive invalide');
  }
}
function classifySubmissionSnapshot(snapshot,t) {
  validateTarget(t);
  if (!snapshot || !Array.isArray(snapshot.docs)) stop('resultat soumission invalide');
  if (snapshot.docs.length > MAX_CANDIDATES) stop('nombre de soumissions trop eleve : examen manuel');
  const counts={associated:0,published:0,otherStatus:0,foreign:0,ambiguous:0};
  for (const doc of snapshot.docs) {
    if (!doc || typeof doc.data !== 'function') stop('document soumission invalide');
    const d=doc.data();
    if (!d || typeof d!=='object' || Array.isArray(d)) stop('contenu soumission invalide');
    if (d.publishedDocId!==t.id) stop('reponse Firestore incoherente');
    if (d.publishedCollection===t.collection) {
      counts.associated++;
      if (d.status==='published') counts.published++;
      else counts.otherStatus++;
    } else if (COLLECTIONS.has(d.publishedCollection)) {
      counts.foreign++; // meme ID, autre collection : aucune modification
    } else {
      counts.ambiguous++; // champ absent, vide ou inconnu : fail closed
    }
  }
  const decision=counts.ambiguous?'MANUAL_AMBIGUOUS':
    counts.associated?'MANUAL_REVIEW':'CLEAR';
  return {decision,counts,automaticDeletionAllowed:false,certifiedRGPD:false};
}
function assertNoAssociatedSubmissions(snapshot,t) {
  const summary=classifySubmissionSnapshot(snapshot,t);
  if (summary.decision!=='CLEAR') {
    // Aucun nom, email, SIRET ni contenu de soumission dans l'erreur.
    stop('soumission ou copie a examiner manuellement avant suppression');
  }
  return summary;
}
module.exports={MAX_CANDIDATES,validateTarget,classifySubmissionSnapshot,assertNoAssociatedSubmissions};

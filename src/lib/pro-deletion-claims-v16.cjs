'use strict';
/**
 * V16 - Controle strict, lecture seule, des revendications et demandes de modification.
 * Aucune suppression/anonymisation automatique de justificatifs tant que la politique
 * de conservation n'est pas definie. Utilisation DEMO V12 uniquement.
 *
 * La requete doit provenir du serveur : modification_requests.where('targetId','==',id)
 * .limit(MAX_CANDIDATES+1), sans identifiants ou listes envoyes par le navigateur.
 */
const MAX_CANDIDATES = 100;
const COLLECTIONS = new Set(['concessions','associations','relais','creators']);
const SAFE = /^[A-Za-z0-9_.-]{1,150}$/;
function stop(reason) { throw new Error('STOP_V16 : ' + reason); }
function validateTarget(target) {
  if (!target || !COLLECTIONS.has(target.collection) ||
      typeof target.id !== 'string' || !SAFE.test(target.id) ||
      target.id.includes('..') || !target.id.startsWith('demo-')) {
    stop('cible fictive invalide');
  }
}
function classifyRequestSnapshot(snapshot, target) {
  validateTarget(target);
  if (!snapshot || !Array.isArray(snapshot.docs)) stop('resultat Firestore invalide');
  if (snapshot.docs.length > MAX_CANDIDATES) stop('nombre de demandes trop eleve : audit manuel');
  const counts = {
    associated: 0,
    pending: 0,
    closedOrOther: 0,
    claim: 0,
    modificationOrOther: 0,
    ambiguous: 0,
    foreign: 0,
  };
  for (const item of snapshot.docs) {
    if (!item || typeof item.data !== 'function') stop('document de demande invalide');
    const d = item.data();
    if (!d || typeof d !== 'object' || Array.isArray(d)) stop('contenu de demande invalide');
    // Vérification de cohérence avec le where('targetId','==',id).
    if (d.targetId !== target.id) stop('resultat de requete incoherent');
    if (d.targetCollection !== target.collection) {
      if (COLLECTIONS.has(d.targetCollection)) {
        counts.foreign++;
        continue; // meme ID, autre collection : ne rien modifier
      }
      // Champ absent/inconnu : ne pas supposer que la demande appartient a un autre pro.
      counts.ambiguous++;
      continue;
    }
    counts.associated++;
    if (d.requestType === 'claim') counts.claim++;
    else counts.modificationOrOther++;
    if (d.status === 'pending') counts.pending++;
    else counts.closedOrOther++;
  }
  const decision = counts.ambiguous ? 'MANUAL_AMBIGUOUS' :
    counts.associated ? 'MANUAL_REVIEW' : 'CLEAR';
  return { decision, counts, automaticDeletionAllowed: false, certifiedRGPD: false };
}
function assertNoAssociatedRequests(snapshot, target) {
  const summary = classifyRequestSnapshot(snapshot, target);
  if (summary.decision !== 'CLEAR') {
    // Pas de PII, nom, email, numero de telephone, SIRET ou notes dans l'erreur.
    stop('revendication ou modification a examiner manuellement avant suppression');
  }
  return summary;
}
module.exports = { MAX_CANDIDATES, validateTarget, classifyRequestSnapshot, assertNoAssociatedRequests };

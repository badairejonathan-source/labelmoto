/**
 * Label Moto V4 — MOTEUR DE TEST LOCAL, exclusivement en mémoire.
 * Aucun Firebase SDK, appel réseau, Storage, API, fichier ou écriture de production.
 * L'API est volontairement limitée à FakeFirestoreV4 pour éviter une activation accidentelle.
 */
import type { DeletionDocument, DeletionPlan, PlannedDeletion, ProTarget } from './pro-deletion-plan-v3';

export type MockJournalV4 = {
  version: 4;
  target: string;
  fingerprint: string;
  completed: string[];
};
export type MockResultV4 = {
  status: 'blocked' | 'partial' | 'simulated';
  reason?: string;
  deleted: string[];
  alreadyAbsent: string[];
  journal: MockJournalV4;
  remaining: string[];
  firebaseReads: 0;
  firebaseWrites: 0;
  certifiedRGPD: false;
};

type SnapshotDoc = DeletionDocument;
const MAIN = 'fiche_principale';
const SAFE_PATH = /^[a-zA-Z0-9_.\/-]+$/;

export class FakeFirestoreV4 {
  private docs = new Map<string, Record<string, unknown>>();
  private failOnce = new Set<string>();

  constructor(initialDocs: SnapshotDoc[]) {
    for (const { path, data } of initialDocs) {
      if (!path || !SAFE_PATH.test(path) || this.docs.has(path)) throw new Error('STOP : chemin fictif invalide ou dupliqué');
      this.docs.set(path, structuredClone(data));
    }
  }
  get(path: string): Record<string, unknown> | undefined {
    const data = this.docs.get(path);
    return data === undefined ? undefined : structuredClone(data);
  }
  paths(): string[] { return Array.from(this.docs.keys()).sort(); }
  descendants(path: string): string[] { return this.paths().filter(p => p.startsWith(path + '/')); }
  injectFailureOnce(path: string): void { this.failOnce.add(path); }
  deleteExact(path: string): void {
    if (this.failOnce.delete(path)) throw new Error('Erreur injectée dans la simulation');
    this.docs.delete(path);
  }
}

function keyFor(target: ProTarget): string { return `${target.collection}/${target.id}`; }
function actionKey(action: PlannedDeletion): string { return `${action.mode}:${action.path}`; }
function proof(action: PlannedDeletion, target: ProTarget, data: Record<string, unknown>): boolean {
  const { path, source, mode } = action;
  const fullId = `${target.collection}__${target.id}`;
  if (source === 'statistique_mensuelle' && mode === 'delete') {
    const match = path.match(/^pro_stats_monthly\/\d{4}-(?:0[1-9]|1[0-2])\/pros\/([A-Za-z0-9_.-]+)$/);
    return match?.[1] === fullId && data.proId === target.id && data.collection === target.collection;
  }
  if (source === 'cache_live' && mode === 'delete') {
    return path === `cache/map-live-${target.collection}-${target.id}` &&
      data.id === target.id && data.sourceCollection === target.collection;
  }
  if (source === 'historique_fiche' && mode === 'delete') {
    return /^listing_history\/[A-Za-z0-9_.-]+$/.test(path) && data.listingKey === keyFor(target);
  }
  if (source === 'favori_professionnel' && mode === 'delete') {
    const segments = path.split('/');
    return segments.length === 4 && segments[0] === 'users' && segments[1].length > 0 &&
      segments[2] === 'favorites' && segments[3] === fullId &&
      data.type === 'professional' && data.targetId === target.id && data.targetCollection === target.collection;
  }
  if (source === MAIN && mode === 'recursive_delete') {
    return path === keyFor(target);
  }
  return false;
}

/**
 * Ne prend volontairement QUE le faux magasin en mémoire.
 * Le résultat ne peut PAS confirmer une suppression réelle ni la conformité RGPD.
 */
export function executeOfflineV4(
  plan: DeletionPlan,
  store: FakeFirestoreV4,
  journal?: MockJournalV4,
): MockResultV4 {
  const targetKey = keyFor(plan.target);
  const fingerprint = JSON.stringify({ target: plan.target, actions: plan.actions });
  const next: MockJournalV4 = journal
    ? { ...journal, completed: [...journal.completed] }
    : { version: 4, target: targetKey, fingerprint, completed: [] };
  if (next.version !== 4 || next.target !== targetKey || next.fingerprint !== fingerprint) {
    throw new Error('STOP : journal de reprise incompatible avec le plan');
  }
  const base = (status: MockResultV4['status'], reason: string | undefined, deleted: string[], alreadyAbsent: string[]): MockResultV4 => ({
    status, reason, deleted, alreadyAbsent, journal: next, remaining: store.paths(),
    firebaseReads: 0, firebaseWrites: 0, certifiedRGPD: false,
  });

  if (plan.mode !== 'simulation' || plan.toReview.length || plan.unchecked.length) {
    return base('blocked', 'Plan non intégralement vérifié : simulation refusée', [], []);
  }
  const keys = plan.actions.map(actionKey);
  if (new Set(keys).size !== keys.length || next.completed.some(k => !keys.includes(k))) {
    return base('blocked', 'Actions ou journal incohérents', [], []);
  }
  const mainActions = plan.actions.filter(a => a.source === MAIN);
  if (mainActions.length > 1 ||
      (mainActions.length === 1 && plan.actions[plan.actions.length - 1] !== mainActions[0])) {
    return base('blocked', 'La fiche principale doit être traitée en dernier', [], []);
  }

  // PRECONDITIONS : vérifier TOUS les documents avant la première mutation fictive.
  // Un document absent (déjà effacé) est sans danger pour une reprise idempotente.
  for (const action of plan.actions) {
    const existing = store.get(action.path);
    if (existing && !proof(action, plan.target, existing)) {
      return base('blocked', `Rattachement non prouvé : ${action.path}`, [], []);
    }
    if (action.source === MAIN && store.descendants(action.path).length > 0) {
      return base('blocked', 'Sous-collections présentes : examen préalable requis', [], []);
    }
  }

  const deleted: string[] = [];
  const alreadyAbsent: string[] = [];
  for (const action of plan.actions) {
    const key = actionKey(action);
    if (next.completed.includes(key)) continue;
    if (!store.get(action.path)) {
      alreadyAbsent.push(action.path);
      next.completed.push(key);
      continue;
    }
    try {
      store.deleteExact(action.path);
      deleted.push(action.path);
      next.completed.push(key);
    } catch (err) {
      return base('partial', `Echec simulé sur ${action.path} : ${String(err)}`, deleted, alreadyAbsent);
    }
  }
  return base('simulated', 'Simulation terminée ; Storage, indexes, caches et conservation RGPD non validés', deleted, alreadyAbsent);
}

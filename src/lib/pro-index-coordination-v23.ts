/**
 * Label Moto V23.2 — verrou EXCLUSIF et fail-closed des deux index publics.
 * Ce module ne déclenche aucune requête Firebase à l'import.
 * La configuration explicite LABELMOTO_INDEX_WRITES_V23=ENABLED est obligatoire.
 * Les deux routes d'écriture et, AVANT activation de la suppression réelle,
 * le moteur de suppression devront utiliser EXACTEMENT ce verrou Firestore.
 */
import { randomUUID } from 'node:crypto';
import type { Firestore, DocumentReference } from 'firebase-admin/firestore';

const COLLECTION = 'index_write_locks_v23';
const DOCUMENT = 'public-indexes';
const OPS = new Set(['rebuild', 'prune', 'delete']);

export type IndexWriteCoordinator = {
  assertHeld: () => Promise<void>;
  markWriteStarted: () => Promise<void>;
  markVerified: () => void;
};

type ActiveState = { ref: DocumentReference; token: string; epoch: number };

function ensureAllowed(operation: string) {
  if (process.env.LABELMOTO_INDEX_WRITES_V23 !== 'ENABLED') {
    throw new Error('V23_INDEX_WRITES_DISABLED');
  }
  if (!OPS.has(operation)) throw new Error('V23_INDEX_OPERATION_INVALID');
}

function owned(s: { exists: boolean; get(field: string): unknown }, token: string, epoch: number) {
  return s.exists && s.get('token') === token && s.get('epoch') === epoch && s.get('status') === 'held';
}

async function acquire(db: Firestore, operation: string): Promise<ActiveState> {
  const ref = db.collection(COLLECTION).doc(DOCUMENT);
  const token = randomUUID();
  const epoch = await db.runTransaction(async tx => {
    const s = await tx.get(ref);
    if (s.exists && s.get('status') !== 'released') {
      throw new Error('V23_INDEX_LOCK_BUSY_OR_REVIEW_REQUIRED');
    }
    const previous = s.exists ? s.get('epoch') : 0;
    if (!Number.isSafeInteger(previous) || previous < 0 || previous >= Number.MAX_SAFE_INTEGER) {
      throw new Error('V23_INDEX_LOCK_EPOCH_INVALID');
    }
    const next: number = previous + 1;
    const state = {
      status: 'held', epoch: next, token, operation,
      writeStarted: false, certifiedRGPD: false, startedAt: Date.now(),
      finishedAt: null,
    };
    if (s.exists) tx.update(ref, state);
    else tx.create(ref, state);
    return next;
  }, { maxAttempts: 5 });
  return { ref, token, epoch };
}

async function assertHeld(state: ActiveState) {
  const s = await state.ref.get();
  if (!owned(s, state.token, state.epoch)) throw new Error('V23_INDEX_LOCK_LOST');
}

async function finalize(db: Firestore, state: ActiveState, failed: boolean) {
  await db.runTransaction(async tx => {
    const s = await tx.get(state.ref);
    if (!owned(s, state.token, state.epoch)) throw new Error('V23_INDEX_LOCK_RELEASE_REFUSED');
    // L'état persistant fait foi, même si la réponse de markWriteStarted()
    // s'est perdue après commit : ne jamais libérer par erreur après écriture.
    const persistedStart = s.get('writeStarted') === true;
    const status = failed && persistedStart ? 'review_required' : 'released';
    const outcome = failed ? (persistedStart ? 'failed_after_write_started' : 'failed_before_write') : 'completed';
    tx.update(state.ref, {
      status, finishedAt: Date.now(), lastOutcome: outcome,
      // Les verrous de revue restent nominatifs pour une inspection manuelle.
      token: status === 'released' ? null : state.token,
      certifiedRGPD: false,
    });
  }, { maxAttempts: 5 });
}

/**
 * Toute lecture-source destinée à l'écriture doit se produire DANS work(),
 * APRES acquisition du verrou. Aucun bail/expiration, pas de récupération auto.
 * Les erreurs après markWriteStarted placent le verrou en review_required.
 */
export async function withSharedIndexLock<T>(
  db: Firestore,
  operation: 'rebuild' | 'prune' | 'delete',
  work: (guard: IndexWriteCoordinator) => Promise<T>,
): Promise<T> {
  ensureAllowed(operation);
  if (!db || typeof db.runTransaction !== 'function' || typeof work !== 'function') {
    throw new Error('V23_INDEX_ARGUMENT_INVALID');
  }
  const state = await acquire(db, operation);
  let writeStarted = false;
  let verified = false;
  const guard: IndexWriteCoordinator = {
    assertHeld: () => assertHeld(state),
    markWriteStarted: async () => {
      if (writeStarted) return assertHeld(state);
      await db.runTransaction(async tx => {
        const s = await tx.get(state.ref);
        if (!owned(s, state.token, state.epoch) || s.get('writeStarted') === true) {
          throw new Error('V23_INDEX_WRITE_MARK_REFUSED');
        }
        tx.update(state.ref, { writeStarted: true, writeStartedAt: Date.now() });
      }, { maxAttempts: 5 });
      writeStarted = true;
    },
    markVerified: () => { verified = true; },
  };
  let result: T | undefined;
  let failure: unknown;
  let failed = false;
  try {
    await guard.assertHeld();
    result = await work(guard);
    await guard.assertHeld();
    if (writeStarted && !verified) throw new Error('V23_INDEX_WRITES_NOT_VERIFIED');
  } catch (error) { failed = true; failure = error; }
  try {
    await finalize(db, state, failed);
  } catch {
    // Un verrou inconnu ne doit jamais être effacé automatiquement.
    throw new Error('V23_INDEX_LOCK_FINALIZATION_FAILED_MANUAL_REVIEW');
  }
  if (failed) throw failure;
  return result as T;
}

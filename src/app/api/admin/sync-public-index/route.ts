import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { getStorage } from 'firebase-admin/storage';
import { getAdminApp, getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { isServerAdmin } from '@/lib/server-admin-permissions';
import { withSharedIndexLock } from '@/lib/pro-index-coordination-v23';
import { preparePublicIndexUpsert, validIndexTarget } from '@/lib/pro-public-index-upsert';
import { verifyAnonymousIndexRead } from '@/lib/pro-public-index-verification';

export const runtime = 'nodejs';
const BUCKET = 'studio-4801889514-40ebd.firebasestorage.app';
const PATHS = ['public/points.json', 'public/seo-pros.json'] as const;
const MAX_BYTES = 9 * 1024 * 1024;
const noStore = { 'Cache-Control': 'no-store' };
const failure = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status, headers: noStore });
const digest = (buf: Buffer) => createHash('sha256').update(buf).digest('hex');

/**
 * Répare un seul listing depuis sa source Firestore, jamais depuis les champs du navigateur.
 * Les deux index sont protégés par le verrou V23 ; aucune requête massive Firestore.
 * Un échec post-écriture laisse le verrou en review_required et l'historique pending.
 */
export async function POST(request: NextRequest) {
  try {
    // Refus avant tout appel Firebase et avant toute lecture Storage.
    if (process.env.LABELMOTO_INDEX_WRITES_V23 !== 'ENABLED' ||
        process.env.LABELMOTO_INDEX_SYNC_UPSERT !== 'ENABLED') {
      return failure('Synchronisation ciblée désactivée ; historique conservé en attente', 503);
    }
    const header = request.headers.get('authorization');
    if (!header?.startsWith('Bearer ')) return failure('Authentification requise', 401);
    const body: unknown = await request.json().catch(() => null);
    const historyId = (body as Record<string, unknown> | null)?.historyId;
    if (typeof historyId !== 'string' || !/^[a-zA-Z0-9_.-]{1,200}$/.test(historyId))
      return failure('Identifiant historique invalide', 400);
    const caller = await getAdminAuth().verifyIdToken(header.slice(7).trim());
    const db = getAdminFirestore();
    if (!(await isServerAdmin(db, caller))) return failure('Droits administrateur requis', 403);
    const historyRef = db.collection('listing_history').doc(historyId);
    const bucket = getStorage(getAdminApp()).bucket(BUCKET);

    const result = await withSharedIndexLock(db, 'upsert', async guard => {
      const history = await historyRef.get();
      if (!history.exists || history.get('indexSyncStatus') !== 'pending') {
        throw Error('INDEX_SYNC_HISTORY_NOT_PENDING');
      }
      const target = validIndexTarget(history.get('targetCollection'), history.get('targetId'));
      if (!target) throw Error('INDEX_SYNC_HISTORY_TARGET_INVALID');
      const listingDoc = await db.collection(target.collection).doc(target.id).get();
      if (!listingDoc.exists) throw Error('INDEX_SYNC_LISTING_MISSING_REFUSED');
      const data = (listingDoc.data() || {}) as Record<string, unknown>;

      const original = [] as Array<{
        path: string; file: ReturnType<typeof bucket.file>; generation: number; bytes: Buffer;
      }>;
      for (const path of PATHS) {
        const file = bucket.file(path);
        const [before] = await file.getMetadata();
        const generation = Number(before.generation);
        if (!Number.isSafeInteger(generation) || generation <= 0) throw Error('INDEX_SYNC_GENERATION_INVALID');
        const [bytes] = await file.download();
        const [after] = await file.getMetadata();
        if (String(before.generation) !== String(after.generation) || bytes.length > MAX_BYTES)
          throw Error('INDEX_SYNC_CHANGED_DURING_READ');
        original.push({ path, file, generation, bytes });
      }
      const transformed = preparePublicIndexUpsert(
        JSON.parse(original[0].bytes.toString('utf8')) as unknown,
        JSON.parse(original[1].bytes.toString('utf8')) as unknown,
        target.collection, target.id, data,
      );
      const outputs = [Buffer.from(JSON.stringify(transformed.points)), Buffer.from(JSON.stringify(transformed.seo))];
      if (outputs.some(x => x.length > MAX_BYTES)) throw Error('INDEX_SYNC_OUTPUT_TOO_LARGE');

      // Sauvegardes privées, créées à partir des octets contrôlés.
      // Un original manquant, divergent ou déjà sauvegardé bloque l'opération.
      // Le marqueur persistant interdit toute nouvelle écriture si une étape échoue.
      await guard.markWriteStarted();
      for (let i = 0; i < original.length; i++) {
        await guard.assertHeld();
        const destination = bucket.file(`admin-index-sync-backups/${historyId}/${i === 0 ? 'points' : 'seo-pros'}.json`);
        await destination.save(original[i].bytes, {
          contentType: 'application/json', resumable: false,
          preconditionOpts: { ifGenerationMatch: 0 }, // création uniquement, jamais d'écrasement
          metadata: { metadata: {
            sourcePath: original[i].path,
            sourceGeneration: String(original[i].generation),
            sourceSha256: digest(original[i].bytes),
            plannedSha256: digest(outputs[i]),
          } },
        });
        await destination.makePrivate();
        const [savedBackup] = await destination.download();
        if (digest(savedBackup) !== digest(original[i].bytes)) {
          throw Error('INDEX_SYNC_BACKUP_VERIFY_FAILED');
        }
      }
      // Pas de restauration automatique : les deux index ne constituent pas une
      // transaction Storage. Un échec laisse le verrou review_required jusqu'à
      // inspection ciblée et réparation manuelle à partir des deux sauvegardes.
      for (let i = 0; i < original.length; i++) {
        await guard.assertHeld();
        await original[i].file.save(outputs[i], {
          contentType: 'application/json', resumable: false,
          metadata: { cacheControl: 'public, max-age=60' },
          preconditionOpts: { ifGenerationMatch: original[i].generation },
        });
        await original[i].file.makePublic();
      }
      // Double contrôle : octets via Storage authentifié ET lecture HTTP anonyme
      // de la génération réellement écrite. Un 403 ou un contenu périmé bloque
      // la validation de l'historique et conserve le verrou en revue manuelle.
      for (let i = 0; i < original.length; i++) {
        await guard.assertHeld();
        const [metadata] = await original[i].file.getMetadata();
        const publishedGeneration = String(metadata.generation ?? '');
        if (!/^[1-9][0-9]*$/.test(publishedGeneration) ||
            publishedGeneration === String(original[i].generation)) {
          throw Error('INDEX_SYNC_PUBLISHED_GENERATION_INVALID');
        }
        const [actual] = await original[i].file.download();
        if (digest(actual) !== digest(outputs[i])) throw Error('INDEX_SYNC_VERIFY_FAILED');
        await verifyAnonymousIndexRead({
          bucket: BUCKET,
          path: original[i].path,
          generation: publishedGeneration,
          expected: outputs[i],
        });
      }
      await guard.assertHeld();
      await historyRef.update({
        indexSyncStatus: 'synced', indexSyncedAt: Date.now(),
        indexSyncPoints: transformed.pointPresent,
        indexSyncPreviousGenerations: original.map(x => String(x.generation)),
      });
      guard.markVerified();
      return { target: `${target.collection}/${target.id}`, indexedOnMap: transformed.pointPresent };
    });
    return NextResponse.json({ ok: true, ...result }, { headers: noStore });
  } catch (error) {
    console.error('[INDEX SYNC] Mise en attente pour examen manuel', error);
    return failure('Synchronisation non certifiée : vérifier le verrou V23 et les sauvegardes avant toute nouvelle tentative', 409);
  }
}

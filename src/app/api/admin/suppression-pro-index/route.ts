import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { createHash } from 'node:crypto';
import { withSharedIndexLock, type IndexWriteCoordinator } from '@/lib/pro-index-coordination-v23';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { PRO_COLLECTIONS, pruneIndex, type ProfessionalCollection } from '@/lib/pro-index-prune';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_UIDS = [
  "A36FqeWBHjQBLKQMaMSiFVBzGV22",
  "A366V1X8Hqf1pA63nU3N8B7l8fD3",
  "f7xVfH8R8mS5v8H7N3nU3N8B7l8f"
];

const ADMIN_EMAILS = [
  "badjoe950@hotmail.com"
];
const BUCKET = 'studio-4801889514-40ebd.firebasestorage.app';
const FILES = ['public/points.json', 'public/seo-pros.json'] as const;
const ID_PATTERN = /^[a-zA-Z0-9_.-]{1,200}$/;
const noStore = { 'Cache-Control': 'no-store' };
const errorResponse = (msg: string, status: number) => NextResponse.json({ ok: false, error: msg }, { status, headers: noStore });

export async function POST(request: NextRequest) {
  // Fonction experimentale : aucune lecture ou suppression en production.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { ok: false, error: 'Suppression administrative non disponible en production' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return errorResponse('Authentification requise', 401);
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(auth.slice(7).trim(), true);
  } catch {
    return errorResponse('Session invalide ou expirée', 401);
  }
  const db = getAdminFirestore();
  const email = typeof decoded.email === 'string' ? decoded.email.trim().toLowerCase() : '';
  const isMaster = decoded.email_verified === true && (
    ADMIN_UIDS.includes(decoded.uid) || (email.length > 0 && ADMIN_EMAILS.includes(email))
  );
  if (!isMaster) {
    const user = await db.collection('users').doc(decoded.uid).get();
    if (!user.exists || user.get('role') !== 'admin') return errorResponse('Droits administrateur requis', 403);
  }

  let input: Record<string, unknown>;
  try { input = (await request.json()) as Record<string, unknown>; } catch { return errorResponse('JSON invalide', 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return errorResponse('Requête invalide', 400);
  const action = input.action;
  if (action !== 'preview' && action !== 'apply') return errorResponse('Action non autorisée', 400);
  const collection = typeof input.collection === 'string' ? input.collection : '';
  const id = typeof input.id === 'string' ? input.id : '';
  if (!PRO_COLLECTIONS.includes(collection as ProfessionalCollection) || !ID_PATTERN.test(id)) {
    return errorResponse('Identifiant de fiche invalide', 400);
  }
  // Kill switch : désactivé tant que le propriétaire n'a pas validé les essais isolés.
  if (action === 'apply' && process.env.ENABLE_PRO_INDEX_PURGE !== 'true') {
    return errorResponse('Écriture désactivée : correctif encore en validation', 403);
  }
  if (action === 'apply' && input.confirm !== `SUPPRIMER_INDEX:${collection}/${id}`) {
    return errorResponse('Confirmation explicite manquante', 400);
  }
  // La prévisualisation reste en lecture seule. Toute écriture, elle, prend le
  // même verrou que la reconstruction AVANT de relire la fiche et les index.
  if (action === 'apply' && process.env.LABELMOTO_INDEX_WRITES_V23 !== 'ENABLED') {
    return errorResponse('Coordination V23.2 des index non activée', 503);
  }
  const run = async (lock?: IndexWriteCoordinator) => {
    const listing = await db.collection(collection).doc(id).get();
    if (listing.exists) return errorResponse('STOP : fiche encore présente dans Firestore', 409);
    const bucket = admin.storage().bucket(BUCKET);
    const patches = [];
    for (const filename of FILES) {
      const file = bucket.file(filename);
      const [metadataBefore] = await file.getMetadata();
      const [buffer] = await file.download();
      const [metadataAfter] = await file.getMetadata();
      if (String(metadataBefore.generation) !== String(metadataAfter.generation)) {
        throw new Error('Conflit de génération pendant la lecture de l’index');
      }
      const raw: unknown = JSON.parse(buffer.toString('utf8'));
      const kind = filename.includes('points.json') ? 'points' as const : 'seo' as const;
      const patch = pruneIndex(kind, raw, collection as ProfessionalCollection, id);
      patches.push({ filename, kind, file, generation: Number(metadataAfter.generation), patch });
    }
    const summary = patches.map(p => ({ fichier: p.filename, retirees: p.patch.removed, avant: p.patch.before, apres: p.patch.after }));
    if (action === 'preview') {
      return NextResponse.json({ ok: true, mode: 'lecture_seule', ficheAbsente: true, index: summary, ecritures: 0, cout: 'Lectures Firestore + opérations Storage éventuellement facturables' }, { headers: noStore });
    }
    if (!lock) throw new Error('Verrou obligatoire pour appliquer une correction');
    const modified = patches.filter(p => p.patch.removed > 0);
    if (modified.length) {
      await lock.markWriteStarted();
      for (const p of modified) {
        await lock.assertHeld();
        await p.file.save(JSON.stringify(p.patch.entries), {
          contentType: 'application/json', resumable: false,
          metadata: { cacheControl: p.kind === 'points' ? 'public, max-age=60' : 'public, max-age=3600, stale-while-revalidate=86400' },
          preconditionOpts: { ifGenerationMatch: p.generation },
        });
      }
      // Seul un état vérifié des DEUX fichiers permet de libérer le verrou.
      for (const p of patches) {
        const [raw] = await p.file.download();
        const actual = createHash('sha256').update(raw).digest('hex');
        const expected = createHash('sha256').update(JSON.stringify(p.patch.entries)).digest('hex');
        if (actual !== expected) throw new Error('Vérification des index échouée : examen manuel obligatoire');
      }
      await lock.assertHeld();
      lock.markVerified();
    }
    return NextResponse.json({ ok: true, mode: 'indexes_actualises', index: summary, fichiersModifies: modified.map(p => p.filename), autresDonneesNonNettoyees: true, cachesDistantsAExpirer: true }, { headers: noStore });
  };

  try {
    if (action === 'apply') return await withSharedIndexLock(db, 'prune', run);
    return await run();
  } catch (cause) {
    console.error('[SUPPRESSION PRO INDEX] opération interrompue', cause);
    // Si une écriture avait commencé, le verrou V23.2 reste en review_required.
    return errorResponse('STOP : index non confirmés ; vérifier le verrou et les index avant toute nouvelle tentative', 409);
  }

}

import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store, max-age=0' };
const error = (message: string, status: number) => NextResponse.json({ ok: false, error: message }, { status, headers });
const collections = new Set(['concessions', 'associations', 'relais', 'creators']);
const validId = (value: string) => /^[a-zA-Z0-9_.-]{1,200}$/.test(value) && value !== '.' && value !== '..';

/** Read-only diagnosis. No scans, no writes, no retry, no media downloads. */
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization') || '';
  if (!token.startsWith('Bearer ')) return error('Authentification requise', 401);
  let uid: string;
  try {
    uid = (await getAdminAuth().verifyIdToken(token.slice(7).trim(), true)).uid;
  } catch {
    return error('Session invalide', 401);
  }
  const collection = req.nextUrl.searchParams.get('collection') || '';
  const id = req.nextUrl.searchParams.get('id') || '';
  if (!collections.has(collection) || !validId(id)) return error('Cible invalide', 400);
  try {
    const db = getAdminFirestore();
    const user = await db.collection('users').doc(uid).get();
    if (!user.exists || user.get('role') !== 'admin') return error('Droits administrateur requis', 403);
    const key = `${collection}__${id}`;
    // Exactly three targeted document reads after the admin-role read.
    const [history, backup, sharedLock] = await Promise.all([
      db.collection('admin_public_withdrawal_history').doc(key).get(),
      db.collection('admin_public_withdrawal_backups').doc(key).get(),
      db.collection('index_write_locks_v23').doc('public-indexes').get(),
    ]);
    const historyStatus = history.exists && typeof history.get('status') === 'string'
      ? history.get('status') as string : null;
    const backupStatus = backup.exists && typeof backup.get('status') === 'string'
      ? backup.get('status') as string : null;
    const lockStatus = sharedLock.exists && typeof sharedLock.get('status') === 'string'
      ? sharedLock.get('status') as string : null;
    const finished = historyStatus === 'sources_removed_to_verify' && backupStatus === 'public_source_removed';
    const state = finished ? 'sources_removed_to_verify'
      : (!history.exists && !backup.exists ? 'no_record' : 'manual_review');
    return NextResponse.json({
      ok: true, target: { collection, id }, state,
      history: { exists: history.exists, status: historyStatus },
      backup: { exists: backup.exists, status: backupStatus },
      sharedIndexLock: { exists: sharedLock.exists, status: lockStatus, scope: 'global_not_target_specific' },
      automaticRetryAllowed: false,
      note: 'Diagnostic partiel : aucun contrôle Google/CDN et aucune vérification exhaustive des médias. Le verrou est partagé et peut concerner un autre professionnel.',
    }, { headers });
  } catch {
    return error('Diagnostic indisponible ; aucune modification effectuée', 503);
  }
}

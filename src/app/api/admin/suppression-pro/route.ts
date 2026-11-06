import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp, getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { runDemoDeletionV11 } from '@/lib/pro-deletion-demo-bridge-v11';
import { assessProDeletionReadiness } from '@/lib/pro-deletion-readiness-v7';
import { buildProDeletionCoverageV19 } from '@/lib/pro-deletion-coverage-v19';

export const runtime = 'nodejs';
const ADMIN_UIDS = [
  "A36FqeWBHjQBLKQMaMSiFVBzGV22",
  "A366V1X8Hqf1pA63nU3N8B7l8fD3",
  "f7xVfH8R8mS5v8H7N3nU3N8B7l8f"
];

const ADMIN_EMAILS = [
  "badjoe950@hotmail.com"
];
// Appliquer: exclusivement en émulateur fictif; jamais sur les données réelles.
const COLLECTIONS = new Set(['concessions', 'associations', 'relais', 'creators']);
const SAFE_ID = /^[a-zA-Z0-9_\-.]{1,200}$/;
// Verrou dur : aucun projet réel, aucune production, aucune exécution hors émulateurs.
const DEMO_PROJECT = 'demo-labelmoto-suppression';
function isDemoDeletionEnvironment() {
  const e = process.env;
  return e.NODE_ENV !== 'production' &&
    e.LABELMOTO_DELETION_V11_MODE === 'DEMO_ONLY' &&
    e.GCLOUD_PROJECT === DEMO_PROJECT &&
    e.GOOGLE_CLOUD_PROJECT === DEMO_PROJECT &&
    e.NEXT_PUBLIC_FIREBASE_PROJECT_ID === DEMO_PROJECT &&
    e.FIRESTORE_EMULATOR_HOST === '127.0.0.1:8787' &&
    e.FIREBASE_STORAGE_EMULATOR_HOST === '127.0.0.1:9197' &&
    e.FIREBASE_AUTH_EMULATOR_HOST === '127.0.0.1:9099' &&
    !e.GOOGLE_APPLICATION_CREDENTIALS;
}


function bad(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  // Fonction experimentale : aucune lecture ou suppression en production.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { ok: false, error: 'Suppression administrative non disponible en production' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }
  const header = req.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return bad('Authentification requise', 401);

  // Le refus de production précède même l'initialisation des clients Firebase.
  let body: unknown;
  try { body = await req.json(); } catch { return bad('Corps JSON invalide', 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return bad('Paramètres manquants', 400);
  const input = body as Record<string, unknown>;
  if (input.action === 'apply' && !isDemoDeletionEnvironment()) {
    return bad('Suppression réelle interdite. Démonstration locale uniquement.', 403);
  }
  if (input.action !== 'preview' && input.action !== 'apply') {
    return bad('Action non autorisée.', 403);
  }
  // Vérifier le projet Firebase AVANT toute vérification de jeton sur une action apply.
  if (input.action === 'apply' && getAdminApp().options.projectId !== DEMO_PROJECT) {
    return bad('Application Firebase hors projet fictif.', 403);
  }
  let caller;
  try {
    caller = await getAdminAuth().verifyIdToken(header.slice(7).trim(), true);
  } catch {
    return bad('Session invalide ou révoquée', 401);
  }

  // Autorisation serveur identique aux autres API administrateur.
  const db = getAdminFirestore();
  const tokenEmail = typeof caller.email === 'string'
    ? caller.email.trim().toLowerCase() : '';

  const isMasterAdmin = caller.email_verified === true &&
    (ADMIN_UIDS.includes(caller.uid) ||
     (tokenEmail.length > 0 && ADMIN_EMAILS.includes(tokenEmail)));

  if (!isMasterAdmin) {
    const userSnap = await db.collection('users').doc(caller.uid).get();
    if (!userSnap.exists || userSnap.data()?.role !== 'admin') {
      return bad('Droits administrateur requis', 403);
    }
  }

  const collection = typeof input.collection === 'string' ? input.collection : '';
  const id = typeof input.id === 'string' ? input.id : '';
  if (!COLLECTIONS.has(collection) || !SAFE_ID.test(id) || id.includes('..')) return bad('Cible invalide', 400);

  // L'action apply est une démonstration verrouillée et non le vrai bouton Supprimer.
  if (input.action === 'apply') {
    if (!id.startsWith('demo-')) return bad('Seules les fiches fictives sont autorisées', 403);
    const confirmation = `SUPPRIMER:${collection}/${id}`;
    if (input.confirmation !== confirmation) return bad('Confirmation explicite requise', 403);
    const app = getAdminApp();
    if (app.options.projectId !== DEMO_PROJECT ||
        (getAdminFirestore() as unknown as { projectId?: string }).projectId !== DEMO_PROJECT) {
      return bad('Environnement Firebase non conforme à la démonstration', 403);
    }
    try {
      const bucket = getStorage(app).bucket(`${DEMO_PROJECT}.firebasestorage.app`);
      const result = await runDemoDeletionV11({
        db: getAdminFirestore(), bucket, collection, id,
        months: input.months, images: input.images, env: process.env,
      });
      return NextResponse.json({
        ok: true, mode: 'demo_emulateurs_uniquement', status: result.status,
        certifiedRGPD: false, suppressionsProductionAutorisees: false,
      }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (e) {
      console.error('[SUPPRESSION PRO][DEMO]', e);
      return bad('Test de suppression fictive interrompu : voir le journal local.', 409);
    }
  }

  try {
    const listingRef = db.collection(collection).doc(id);
    const listing = await listingRef.get();
    const data = listing.data() || {};
    const monthRefs = await db.collection('pro_stats_monthly').listDocuments();
    const monthDocs = await Promise.all(monthRefs.map(ref => ref.collection('pros').doc(`${collection}__${id}`).get()));
    const monthly = monthDocs.filter(snap => snap.exists);
    const unsafeMonthly = monthly.filter(snap => {
      const x = snap.data() || {};
      return x.collection !== collection || x.proId !== id;
    });

    const [cache, history, published, changes, imageRequests, subcollections] = await Promise.all([
      db.collection('cache').doc(`map-live-${collection}-${id}`).get(),
      db.collection('listing_history').where('listingKey', '==', `${collection}/${id}`).get(),
      db.collection('listing_submissions').where('publishedDocId', '==', id).get(),
      db.collection('modification_requests').where('targetId', '==', id).get(),
      (typeof data.slug === 'string' && data.slug)
        ? db.collection('image_requests').where('concessionSlug', '==', data.slug).get()
        : Promise.resolve(null),
      listingRef.listCollections(),
    ]);

    const submissions = published.docs.filter(s => s.get('publishedCollection') === collection);
    const requests = changes.docs.filter(s => s.get('targetCollection') === collection);
    // Aucun appel Firestore supplémentaire : simple synthèse des contrôles déjà réalisés.
    const counts: Record<string, number | null> = {
      fichePrincipale: Number(listing.exists),
      statistiquesMensuelles: monthly.length,
      statistiquesAmbigues: unsafeMonthly.length,
      cacheLive: Number(cache.exists),
      historique: history.size,
      soumissionsAvecCopies: submissions.length,
      demandesModification: requests.length,
      demandesImagesLieesAuSlug: imageRequests?.size ?? null,
      sousCollectionsDirectes: subcollections.length,
    };
    const nonCouverts = [
      'Storage : fichiers partagés ou noms opaques',
      'Favoris de comptes utilisateurs',
      'Prospection et copies non indexées par ID',
      'Cache public points.json et seo-pros.json (reconstruction obligatoire)',
      'Sitemap, caches CDN, sauvegardes et Google',
      'Politique de conservation des demandes administratives',
    ];
    // En mode pré-audit, aucun contenu personnel n'est renvoyé (comptes, messages, photos).
    return NextResponse.json({
      ok: true,
      mode: 'lecture_seule',
      cible: { collection, id, title: String(data.title || '') },
      counts,
      nonCouverts,
      readiness: assessProDeletionReadiness(counts, nonCouverts),
      couvertureV19: buildProDeletionCoverageV19(counts),
      suppressionsAutorisees: false,
      message: 'Pré-audit uniquement. Aucune donnée modifiée.',
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[SUPPRESSION PRO][PREVIEW]', e);
    return bad('Pré-audit impossible : vérifier les autorisations ou les index Firestore.', 500);
  }
}

/**
 * Label Moto V23 : raccordement DEMO uniquement de l'API V11.1 au coordinateur index V23, verrou V22 et garde V21.
 * Les listes `months` et `images` eventuellement envoyees par le navigateur
 * sont ignorees. L'inventaire est etabli par V12 dans les emulateurs.
 * Aucun mode Cloud ou production ne peut activer cette passerelle.
 */
import type { Firestore } from 'firebase-admin/firestore';
import type { getStorage } from 'firebase-admin/storage';
type Bucket = ReturnType<ReturnType<typeof getStorage>['bucket']>;

type Params = {
  db: Firestore;
  bucket: Bucket;
  collection: string;
  id: string;
  // Conserves pour compatibilite avec le contrat API V11.1 ; toujours ignores.
  months: unknown;
  images: unknown;
  env: NodeJS.ProcessEnv;
};

const DEMO_PROJECT = 'demo-labelmoto-suppression';
const DEMO_BUCKET = `${DEMO_PROJECT}.firebasestorage.app`;
const ALLOWED = new Set(['concessions', 'associations', 'relais', 'creators']);

export async function runDemoDeletionV11(params: Params): Promise<{status: string}> {
  if (!params || !ALLOWED.has(params.collection) ||
      !/^[a-zA-Z0-9_.-]{1,150}$/.test(params.id) ||
      !params.id.startsWith('demo-') || params.id.includes('..')) {
    throw new Error('STOP_V13 : identifiant fictif obligatoire');
  }
  const e = params.env;
  if (!e || e.NODE_ENV === 'production' ||
      e.LABELMOTO_DELETION_V11_MODE !== 'DEMO_ONLY' ||
      e.GCLOUD_PROJECT !== DEMO_PROJECT ||
      e.GOOGLE_CLOUD_PROJECT !== DEMO_PROJECT ||
      e.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== DEMO_PROJECT ||
      e.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8787' ||
      e.FIREBASE_STORAGE_EMULATOR_HOST !== '127.0.0.1:9197' ||
      e.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099' ||
      e.GOOGLE_APPLICATION_CREDENTIALS ||
      params.bucket?.name !== DEMO_BUCKET) {
    throw new Error('STOP_V13 : environnement hors emulateurs fictifs');
  }

  // Pas de lecture des listes params.months / params.images : elles ne sont PAS fiables.
  // Chargement differe ; verrou global des index V23, verrou par fiche V22, sauvegarde V21, puis controle V12.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const engine = require('./pro-deletion-index-v23.cjs') as {
    executeDemoV23: (opts: {
      db: Firestore;
      bucket: Bucket;
      target: { collection: string; id: string };
      env: NodeJS.ProcessEnv;
    }) => Promise<{status: string}>;
  };
  const result = await engine.executeDemoV23({
    db: params.db,
    bucket: params.bucket,
    target: {collection: params.collection, id: params.id},
    env: e,
  });
  return {status: result.status};
}

/**
 * Label Moto — V3 : planificateur de suppression PURE (aucun SDK Firebase).
 * L'analyse se fait exclusivement sur un ensemble de documents DEJA lus.
 * Ne fait ni lecture, ni écriture, ni suppression réseau.
 */
export type ProCollection = 'concessions' | 'associations' | 'relais' | 'creators';
export type ProTarget = { collection: ProCollection; id: string };
export type DeletionDocument = { path: string; data: Record<string, unknown> };
export type ReviewItem = { path: string; reason: string };
export type PlannedDeletion = { path: string; source: string; mode: 'delete' | 'recursive_delete' };
export type CoverageArea = 'monthly' | 'cache' | 'history' | 'submissions' | 'claims' | 'favorites' | 'images' | 'storage' | 'indexes' | 'subcollections';
export type Snapshot = {
  documents: DeletionDocument[];
  // Couverture déclarée par l'auditeur seulement après vérification réelle.
  checkedAreas: Partial<Record<CoverageArea, boolean>>;
};
export type DeletionPlan = {
  target: ProTarget;
  actions: PlannedDeletion[];
  toReview: ReviewItem[];
  unchecked: CoverageArea[];
  indexesToRefresh: readonly ['public/points.json', 'public/seo-pros.json'];
  canCertifyComplete: false;
  mode: 'simulation';
};

const COLLECTIONS: readonly string[] = ['concessions', 'associations', 'relais', 'creators'];
const IDENTIFIER = /^[A-Za-z0-9_.-]{1,200}$/;
const ALL_AREAS: CoverageArea[] = [
  'monthly', 'cache', 'history', 'submissions', 'claims', 'favorites', 'images', 'storage', 'indexes', 'subcollections',
];

export function assertProTarget(target: ProTarget): void {
  if (!target || !COLLECTIONS.includes(target.collection) || !IDENTIFIER.test(target.id)) {
    throw new Error('STOP : collection ou identifiant professionnel invalide');
  }
  if (target.id === '.' || target.id === '..' || target.id.includes('..')) {
    throw new Error('STOP : identifiant professionnel ambigu');
  }
}

function isStringEqual(value: unknown, expected: string): boolean {
  return typeof value === 'string' && value === expected;
}

function isMonthlyDoc(path: string, target: ProTarget): boolean {
  const prefix = /^pro_stats_monthly\/(\d{4}-(?:0[1-9]|1[0-2]))\/pros\/([A-Za-z0-9_.-]+)$/;
  const match = path.match(prefix);
  return !!match && match[2] === `${target.collection}__${target.id}`;
}

function isExactFavorite(path: string, target: ProTarget): boolean {
  const parts = path.split('/');
  return parts.length === 4 && parts[0] === 'users' && parts[1].length > 0 &&
    parts[2] === 'favorites' && parts[3] === `${target.collection}__${target.id}`;
}

function isInListingSubcollection(path: string, target: ProTarget): boolean {
  return path.startsWith(`${target.collection}/${target.id}/`);
}

/**
 * Fail-closed : seuls les documents avec une preuve structurelle ET une concordance
 * des champs sont éligibles à un futur effacement. Le reste reste en revue.
 * L'ordre des actions est déterministe ; fiche principale en dernier.
 */
export function buildProDeletionPlan(target: ProTarget, snapshot: Snapshot): DeletionPlan {
  assertProTarget(target);
  if (!snapshot || !Array.isArray(snapshot.documents) || !snapshot.checkedAreas) {
    throw new Error('STOP : instantané de contrôle invalide');
  }

  const actions: PlannedDeletion[] = [];
  const toReview: ReviewItem[] = [];
  const seen = new Set<string>();
  const mainPath = `${target.collection}/${target.id}`;
  const key = mainPath;
  let main: DeletionDocument | null = null;
  let childrenSeen = false;

  for (const item of snapshot.documents) {
    if (!item || typeof item.path !== 'string' || !item.path || !item.data ||
        typeof item.data !== 'object' || Array.isArray(item.data)) {
      throw new Error('STOP : document de contrôle mal formé');
    }
    if (seen.has(item.path)) throw new Error(`STOP : chemin en double : ${item.path}`);
    seen.add(item.path);
    const { path, data } = item;

    if (path === mainPath) { main = item; continue; }

    if (isInListingSubcollection(path, target)) {
      childrenSeen = true;
      // On ne supprime jamais un parent sans examiner ses sous-collections.
      toReview.push({ path, reason: 'Sous-collection : vérifier les documents enfants avant suppression récursive' });
      continue;
    }
    if (isMonthlyDoc(path, target)) {
      if (isStringEqual(data.collection, target.collection) && isStringEqual(data.proId, target.id)) {
        actions.push({ path, source: 'statistique_mensuelle', mode: 'delete' });
      } else {
        toReview.push({ path, reason: 'Statistique : collection/proId différents ; ne pas effacer' });
      }
      continue;
    }
    if (path === `cache/map-live-${target.collection}-${target.id}`) {
      if (isStringEqual(data.sourceCollection, target.collection) && isStringEqual(data.id, target.id)) {
        actions.push({ path, source: 'cache_live', mode: 'delete' });
      } else {
        toReview.push({ path, reason: 'Cache live : identité non concordante' });
      }
      continue;
    }
    if (path.startsWith('listing_history/')) {
      if (isStringEqual(data.listingKey, key)) {
        actions.push({ path, source: 'historique_fiche', mode: 'delete' });
      } else {
        toReview.push({ path, reason: 'Historique : rattachement non prouvé' });
      }
      continue;
    }
    if (isExactFavorite(path, target)) {
      if (isStringEqual(data.type, 'professional') &&
          isStringEqual(data.targetCollection, target.collection) &&
          isStringEqual(data.targetId, target.id)) {
        actions.push({ path, source: 'favori_professionnel', mode: 'delete' });
      } else {
        toReview.push({ path, reason: 'Favori : cible non concordante' });
      }
      continue;
    }
    if (path.startsWith('listing_submissions/')) {
      toReview.push({ path, reason: isStringEqual(data.publishedDocId, target.id) &&
        isStringEqual(data.publishedCollection, target.collection)
        ? 'Soumission liée : décider du sort des copies et preuves administratives'
        : 'Soumission : correspondance exacte non démontrée' });
      continue;
    }
    if (path.startsWith('modification_requests/')) {
      toReview.push({ path, reason: isStringEqual(data.targetId, target.id) &&
        isStringEqual(data.targetCollection, target.collection)
        ? 'Revendication/modification liée : données personnelles, durée de conservation à décider'
        : 'Demande : correspondance exacte non démontrée' });
      continue;
    }
    if (path.startsWith('image_requests/') || path.startsWith('storage/')) {
      toReview.push({ path, reason: 'Image/fichier : appartenance exclusive non démontrée' });
      continue;
    }
    // Tout autre document est signalé ; pas de suppression sur une simple ressemblance de nom.
    toReview.push({ path, reason: 'Type de document inconnu : vérification manuelle obligatoire' });
  }
  if (main && childrenSeen) {
    toReview.push({ path: mainPath, reason: 'Suppression récursive en attente de vérification des sous-collections' });
  } else if (main) {
    // Le contrôleur devra avoir réellement audité les sous-collections avant application.
    if (ALL_AREAS.every(area => snapshot.checkedAreas[area] === true) && toReview.length === 0) {
      actions.push({ path: mainPath, source: 'fiche_principale', mode: 'recursive_delete' });
    } else {
      toReview.push({ path: mainPath, reason: 'Vérifications préalables insuffisantes pour supprimer la fiche principale' });
    }
  }
  const unchecked = ALL_AREAS.filter(area => snapshot.checkedAreas[area] !== true);
  return {
    target,
    actions,
    toReview,
    unchecked,
    indexesToRefresh: ['public/points.json', 'public/seo-pros.json'],
    canCertifyComplete: false,
    mode: 'simulation',
  };
}

/** Simulation locale, sans SDK ni adapter Firebase. */
export function simulateProDeletion(plan: DeletionPlan, existingPaths: readonly string[]) {
  const before = [...existingPaths];
  const remaining = new Set(before);
  const simulatedDeleted: string[] = [];
  for (const action of plan.actions) {
    for (const path of [...remaining]) {
      if (path === action.path || (action.mode === 'recursive_delete' && path.startsWith(action.path + '/'))) {
        simulatedDeleted.push(path);
        remaining.delete(path);
      }
    }
  }
  return { deleted: simulatedDeleted.sort(), remaining: [...remaining].sort(), writes: 0, firestoreCalls: 0 };
}

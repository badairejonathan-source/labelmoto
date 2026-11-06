/**
 * V20 — lecture stricte du pré-audit V19 pour l'interface administrateur.
 * Module pur, sans SDK Firebase. NE confère jamais une autorisation de suppression.
 */
export type DeletionDecisionV20 = 'DEMO_CIBLEE' | 'PRESERVER' | 'EXAMEN_MANUEL' | 'NON_INVENTORIE' | 'REPORTE';
export type DeletionScopeV20 = Readonly<{
  source: string;
  decision: DeletionDecisionV20;
  precision: string;
}>;
export type ProDeletionReviewV20 = Readonly<{
  counts: Readonly<Record<string, number | null>>;
  issues: readonly string[];
  coverage: Readonly<{
    mode: 'LECTURE_SEULE_PARTIELLE';
    inventaireExhaustif: false;
    suppressionAutorisee: false;
    certifieRGPD: false;
    perimetres: readonly DeletionScopeV20[];
    avertissements: readonly string[];
    regle: string;
  }>;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
const VALID_DECISIONS: readonly string[] = ['DEMO_CIBLEE', 'PRESERVER', 'EXAMEN_MANUEL', 'NON_INVENTORIE', 'REPORTE'];

/** Refuse toute réponse dont le serveur n'affirme pas explicitement les blocages V19. */
export function parseProDeletionReviewV20(payload: unknown, collection: string, id: string): ProDeletionReviewV20 {
  if (!isRecord(payload) || payload.ok !== true || payload.mode !== 'lecture_seule' ||
      payload.suppressionsAutorisees !== false || !isRecord(payload.cible) ||
      payload.cible.collection !== collection || payload.cible.id !== id ||
      !isRecord(payload.counts) || !isRecord(payload.readiness) ||
      payload.readiness.canDelete !== false || !Array.isArray(payload.readiness.issues) ||
      !isRecord(payload.couvertureV19)) {
    throw new Error('Pré-audit incompatible ou incomplet : aucune suppression autorisée.');
  }
  const coverage = payload.couvertureV19;
  if (coverage.version !== 'V19' || coverage.mode !== 'LECTURE_SEULE_PARTIELLE' ||
      coverage.suppressionAutorisee !== false || coverage.certifieRGPD !== false ||
      coverage.inventaireExhaustif !== false || !Array.isArray(coverage.perimetres) ||
      !Array.isArray(coverage.avertissements) || typeof coverage.regle !== 'string') {
    throw new Error('Bilan de couverture absent ou invalide : aucune suppression autorisée.');
  }
  const counts: Record<string, number | null> = {};
  const entries = Object.entries(payload.counts);
  if (entries.length > 40) throw new Error('Pré-audit : trop de champs reçus.');
  for (const [key, value] of entries) {
    if (!/^\w{1,70}$/.test(key) ||
        !(value === null || (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0))) {
      throw new Error('Pré-audit : compte non valide.');
    }
    counts[key] = value as number | null;
  }
  if (coverage.perimetres.length > 35 || coverage.avertissements.length > 25 ||
      payload.readiness.issues.length > 100) {
    throw new Error('Pré-audit : taille de réponse inattendue.');
  }
  const scopes: DeletionScopeV20[] = [];
  for (const item of coverage.perimetres) {
    if (!isRecord(item) || typeof item.source !== 'string' || item.source.length > 120 ||
        typeof item.precision !== 'string' || item.precision.length > 700 ||
        typeof item.decision !== 'string' || !VALID_DECISIONS.includes(item.decision)) {
      throw new Error('Pré-audit : périmètre invalide.');
    }
    scopes.push({source: item.source, decision: item.decision as DeletionDecisionV20, precision: item.precision});
  }
  const issues = payload.readiness.issues;
  const warnings = coverage.avertissements;
  if (!issues.every((i: unknown) => typeof i === 'string' && i.length <= 700) ||
      !warnings.every((i: unknown) => typeof i === 'string' && i.length <= 700)) {
    throw new Error('Pré-audit : texte inattendu.');
  }
  return {
    counts,
    issues: [...issues] as string[],
    coverage: {
      mode: 'LECTURE_SEULE_PARTIELLE', inventaireExhaustif: false,
      suppressionAutorisee: false, certifieRGPD: false,
      perimetres: scopes,
      avertissements: [...warnings] as string[],
      regle: coverage.regle,
    },
  };
}

export function getProDeletionConfirmationV20(collection: string, id: string): string {
  return `EXAMINER ${collection}/${id}`;
}

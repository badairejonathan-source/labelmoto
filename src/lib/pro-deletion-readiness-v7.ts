/**
 * Label Moto V7 — synthèse PURE du pré-audit (aucun SDK Firebase).
 * Ne certifie jamais une suppression complète ; n'autorise aucune écriture.
 */
export type ProDeletionReadiness = {
  canDelete: false;
  status: 'bloque';
  issues: string[];
  verifiedAssociations: number;
  mode: 'lecture_seule';
};

export function assessProDeletionReadiness(
  counts: Record<string, number | null>,
  nonCouverts: readonly string[],
): ProDeletionReadiness {
  const issues: string[] = [];
  let verifiedAssociations = 0;
  for (const [field, count] of Object.entries(counts)) {
    if (count === null || !Number.isInteger(count) || count < 0) {
      issues.push(`Zone non vérifiée : ${field}`);
    } else if (field !== 'fichePrincipale' && count > 0) {
      verifiedAssociations += count;
      issues.push(`Données associées à traiter : ${field} (${count})`);
    }
  }
  for (const description of nonCouverts) {
    issues.push(`Hors périmètre du pré-audit : ${description}`);
  }
  // Blocage sans exception : aucun moteur de nettoyage RGPD réel n'est activé en V7.
  if (issues.length === 0) issues.push('Suppression réelle non autorisée : vérification complète manquante');
  return { canDelete: false, status: 'bloque', issues, verifiedAssociations, mode: 'lecture_seule' };
}

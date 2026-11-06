/**
 * Label Moto V19 — Etat de couverture, purement informatif et sans accès Firebase.
 * Ne confère JAMAIS le droit de supprimer. Le pré-audit de la route existante
 * est PARTIEL : les zéros affichés ne prouvent pas l'absence de données.
 * Sources de cette politique : rapports locaux V15 et V18 (novembre 2026).
 * Images / commentaires explicitement reportés à la demande du propriétaire.
 */
export type ProDeletionPreviewCountsV19 = Record<string, number | null>;

type State = 'DEMO_CIBLEE' | 'PRESERVER' | 'EXAMEN_MANUEL' | 'NON_INVENTORIE' | 'REPORTE';
export type ProDeletionScopeV19 = Readonly<{
  source: string;
  decision: State;
  precision: string;
}>;

const SCOPES: readonly ProDeletionScopeV19[] = Object.freeze([
  {
    source: 'pro_stats_monthly', decision: 'DEMO_CIBLEE',
    precision: 'Compteurs individuels : nettoyage cible teste uniquement en emulateurs. Schema reel a confirmer.',
  },
  {
    source: 'stats_daily', decision: 'PRESERVER',
    precision: 'Compteurs partages : ne jamais supprimer le document global pour une seule fiche.',
  },
  {
    source: 'monthly_reports', decision: 'PRESERVER',
    precision: 'Rapports agreges : ne jamais supprimer le document partage pour une seule fiche.',
  },
  {
    source: 'modification_requests', decision: 'EXAMEN_MANUEL',
    precision: 'Revendications et demandes : garde V16 en demonstration, aucun effacement automatique.',
  },
  {
    source: 'listing_submissions', decision: 'EXAMEN_MANUEL',
    precision: 'Copies administratives : garde V17 en demonstration, aucune purge automatique.',
  },
  {
    source: 'support_messages/contact_messages', decision: 'NON_INVENTORIE',
    precision: 'Texte libre et identifiant utilisateur : aucune liaison exclusive a la fiche etablie.',
  },
  {
    source: 'prospection', decision: 'NON_INVENTORIE',
    precision: 'Notes et statut administratifs : aucune liaison exclusive a la fiche etablie.',
  },
  {
    source: 'images', decision: 'REPORTE',
    precision: 'Traitement des images reporte ; nettoyage complet non garanti.',
  },
  {
    source: 'commentaires/sous-collections', decision: 'REPORTE',
    precision: 'Traitement reporte ; les sous-collections restent un motif de blocage.',
  },
]);

function indicator(counts: ProDeletionPreviewCountsV19, key: string): 'SIGNALE' | 'NON_SIGNALE_PAR_CE_CONTROLE' | 'NON_EVALUE' {
  const value = counts[key];
  if (value === null || value === undefined) return 'NON_EVALUE';
  if (!Number.isSafeInteger(value) || value < 0) return 'NON_EVALUE';
  return value > 0 ? 'SIGNALE' : 'NON_SIGNALE_PAR_CE_CONTROLE';
}

export function buildProDeletionCoverageV19(counts: ProDeletionPreviewCountsV19) {
  const observations = {
    statistiquesAmbigues: indicator(counts, 'statistiquesAmbigues'),
    demandesModification: indicator(counts, 'demandesModification'),
    soumissionsAvecCopies: indicator(counts, 'soumissionsAvecCopies'),
    sousCollectionsDirectes: indicator(counts, 'sousCollectionsDirectes'),
    demandesImagesLieesAuSlug: indicator(counts, 'demandesImagesLieesAuSlug'),
  };
  return {
    version: 'V19',
    mode: 'LECTURE_SEULE_PARTIELLE',
    suppressionAutorisee: false as const,
    certifieRGPD: false as const,
    inventaireExhaustif: false as const,
    scanGlobalEffectue: false as const,
    regle: 'Une absence de resultat dans ce pre-audit ne prouve pas une absence de donnees.',
    observations,
    perimetres: SCOPES,
    avertissements: [
      'Revendications et soumissions : controles par identifiant incomplets pour les documents historiques.',
      'Support et prospection : pas de correspondance fiable par nom, email ou texte libre.',
      'Les aggregats partages doivent rester intacts.',
      'Photos et commentaires volontairement non traites : RGPD complet impossible a certifier.',
      'Sauvegardes, sitemap, caches externes et conservation des pieces administratives non finalises.',
    ],
  };
}

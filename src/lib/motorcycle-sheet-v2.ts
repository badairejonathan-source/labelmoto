/**
 * Structure LabelMoto V2 pour les fiches moto enrichies.
 *
 * IMPORTANT :
 * - Tous les champs V2 sont optionnels afin de préserver les anciennes fiches.
 * - layout_version === 2 active le nouveau rendu.
 * - Une estimation ne doit jamais être présentée comme une donnée constructeur.
 */

export type MotorcycleDataConfidence =
  | 'official_fr'
  | 'official_eu'
  | 'official_other_market'
  | 'technical_documentation'
  | 'multiple_sources'
  | 'observed'
  | 'estimate'
  | 'to_confirm';

export interface MotorcycleSourceReference {
  label: string;
  type: MotorcycleDataConfidence;
  market?: string;
  model_year?: string;
  url?: string;
  note?: string;
}

export interface MotorcycleQuickFact {
  label: string;
  value: string;
}

export interface MotorcycleQuickMaintenance {
  label: string;
  value: string;
  confidence?: MotorcycleDataConfidence;
}

export interface MotorcycleServiceOperation {
  label: string;
  source_type?: MotorcycleDataConfidence;
}

export interface MotorcycleServiceScheduleV2 {
  km: number;
  months?: number;
  title: string;

  /**
   * Exemple :
   * "≈ 120 à 210 €"
   *
   * Ne jamais utiliser cette propriété pour un tarif constructeur
   * sauf si celui-ci publie réellement un tarif national.
   */
  price_estimate?: string;

  price_type?: 'official' | 'observed' | 'estimate' | 'mixed';

  operations: MotorcycleServiceOperation[];

  note?: string;
}

export interface MotorcycleMaintenanceRow {
  label: string;
  value: string;
  confidence?: MotorcycleDataConfidence;
}

export interface MotorcycleMaintenanceDetail {
  id: string;
  title: string;
  summary: string;
  rows: MotorcycleMaintenanceRow[];
  note?: string;
}

export interface MotorcycleConsumableV2 {
  part: string;

  specification?: string;

  reference_oem?: string;

  replacement_interval?: string;

  average_lifetime?: string;

  observed_price?: string;

  source_type?: MotorcycleDataConfidence;

  note?: string;
}

export interface MotorcycleKnownIssueV2 {
  title: string;

  description: string;

  type:
    | 'manufacturer_monitoring'
    | 'owner_feedback'
    | 'documented_issue'
    | 'recall'
    | 'usage_limitation';

  confidence: MotorcycleDataConfidence;

  source_note?: string;
}

export interface MotorcycleMaintenanceBudgetCardV2 {
  label: string;
  value: string;
  note?: string;
}

export interface MotorcycleMaintenanceBudgetV2 {
  title?: string;
  cards: MotorcycleMaintenanceBudgetCardV2[];
  note?: string;
}

export interface MotorcycleWarrantyV2 {
  duration: string;

  coverage?: string;

  maintenance_requirement?: string;

  claim_requirement?: string;

  original_parts_note?: string;

  invoice_advice?: string;

  legal_warranty_note?: string;

  market?: string;

  source_label?: string;
}

export interface MotorcycleDataQuality {
  market: string;

  model_year: string;

  manufacturer_fr_verified?: boolean;

  european_manual_verified?: boolean;

  technical_documentation_verified?: boolean;

  consumables_verified?: boolean;

  recall_checked?: boolean;

  pricing_type?: 'official' | 'observed' | 'estimate' | 'mixed';

  last_verified: string;

  sources?: MotorcycleSourceReference[];
}

export interface MotorcycleVerdictV2 {
  score?: number;

  title: string;

  text: string;

  strengths?: string[];

  weaknesses?: string[];
}

export interface MotorcycleEquivalentV2 {
  id?: string;

  name: string;

  reason?: string;
}

export interface MotorcycleSheetV2 {
  layout_version: 2;

  /**
   * Petit texte affiché dans le Hero.
   */
  hero_subtitle?: string;

  /**
   * Informations visibles immédiatement sous le Hero.
   */
  quick_facts?: MotorcycleQuickFact[];

  /**
   * Bloc "Entretien en bref".
   */
  quick_maintenance?: MotorcycleQuickMaintenance[];

  /**
   * Calendrier détaillé V2.
   */
  service_schedule_v2?: MotorcycleServiceScheduleV2[];

  /**
   * Entretien détaillé :
   * huile, filtre air, bougies, soupapes, pneus, chaîne, etc.
   */
  maintenance_details?: MotorcycleMaintenanceDetail[];

  /**
   * Références de pièces / consommables uniquement lorsqu'elles
   * apportent une information supplémentaire à maintenance_details.
   *
   * Ne pas répéter ici :
   * - huile
   * - filtres
   * - bougies
   * - pneus
   * - chaîne
   *
   * s'ils sont déjà complètement décrits dans maintenance_details.
   *
   * Exemples pertinents :
   * - référence OEM vérifiée
   * - alternative compatible vérifiée
   * - prix observé
   * - kit chaîne
   * - plaquettes
   * - batterie
   */

  consumables_v2?: MotorcycleConsumableV2[];

  /**
   * Fiabilité et points à surveiller.
   */
  known_issues_v2?: MotorcycleKnownIssueV2[];

  /**
   * Budget entretien.
   */
  budget?: MotorcycleMaintenanceBudgetV2;

  /**
   * Conditions de garantie spécifiques au modèle/marché.
   */
  warranty?: MotorcycleWarrantyV2;

  /**
   * Verdict éditorial LabelMoto.
   */
  verdict?: MotorcycleVerdictV2;

  /**
   * Traçabilité des informations.
   */
  data_quality?: MotorcycleDataQuality;

  /**
   * Modèles comparables avec justification.
   */
  equivalents_v2?: MotorcycleEquivalentV2[];
}

/**
 * Retourne la configuration V2 d'une fiche lorsqu'elle existe.
 *
 * On accepte :
 *
 * service_guide.layout_version
 *
 * ou, par sécurité pendant la migration :
 *
 * fiche.layout_version
 */
export function getMotorcycleSheetV2(
  fiche: any
): MotorcycleSheetV2 | null {

  if (!fiche || typeof fiche !== 'object') {
    return null;
  }

  const sg = fiche.service_guide || {};

  const version = Number(
    sg.layout_version ??
    fiche.layout_version ??
    1
  );

  if (version !== 2) {
    return null;
  }

  return {
    layout_version: 2,

    hero_subtitle:
      sg.hero_subtitle ??
      fiche.hero_subtitle,

    quick_facts:
      sg.quick_facts ??
      fiche.quick_facts ??
      [],

    quick_maintenance:
      sg.quick_maintenance ??
      fiche.quick_maintenance ??
      [],

    service_schedule_v2:
      sg.service_schedule_v2 ??
      fiche.service_schedule_v2 ??
      [],

    maintenance_details:
      sg.maintenance_details ??
      fiche.maintenance_details ??
      [],

    consumables_v2:
      sg.consumables_v2 ??
      fiche.consumables_v2 ??
      [],

    known_issues_v2:
      sg.known_issues_v2 ??
      fiche.known_issues_v2 ??
      [],

    budget:
      sg.budget ??
      fiche.budget,

    warranty:
      sg.warranty ??
      fiche.warranty,

    verdict:
      sg.verdict ??
      fiche.verdict,

    data_quality:
      sg.data_quality ??
      fiche.data_quality,

    equivalents_v2:
      sg.equivalents_v2 ??
      fiche.equivalents_v2 ??
      [],
  };
}

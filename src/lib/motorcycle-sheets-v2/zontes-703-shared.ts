/**
 * Données de recherche mutualisées pour la famille ZONTES 703.
 *
 * IMPORTANT :
 * - Ce fichier n'est pas une fiche affichée directement.
 * - Les valeurs communes peuvent être réutilisées par RR / T / F.
 * - Les exceptions par modèle doivent rester prioritaires.
 * - Une donnée marquée "verification_required" ne doit jamais être
 *   publiée automatiquement dans une fiche.
 *
 * Dernière vérification : 29/09/2026.
 */
export const zontes703SharedResearch = {
  verified_at: "29/09/2026",

  family: "ZONTES 703",

  common_engine_service: {
    engine_family: "Trois cylindres 699 cm³",
    engine_oil: "SAE 10W-50 · API SN ou supérieur",
    oil_with_filter_l: 3.4,
    oil_without_filter_l: 3.0,

    oil_filter_oem: "1050875-004000",

    spark_plug: "BN8RTIP-8",
    spark_plug_oem: "1051161-016000",
    spark_plug_quantity: 3,
    spark_plug_gap_mm: "0,7–0,9",

    spark_plug_distribution_note:
      "Référence OEM constructeur : BN8RTIP-8 / 1051161-016000, 3 unités. La pièce est commercialisée en Europe notamment sous marque Torch mais reste peu diffusée dans les grands catalogues français.",

    rr_aftermarket_spark_plugs:
      "Pour la 703 RR, Louis et BST Moto référencent NGK CPR8EA-9 et CPR8EAIX-9. Les conserver comme alternatives aftermarket à confirmer au VIN / manuel, jamais comme référence OEM Zontes.",

    brake_fluid: "DOT 4",
    brake_fluid_capacity_l: 0.22,

    coolant_total_l: 1.9,
    coolant_type:
      "À base d’éthylène glycol · compatible radiateurs aluminium",

    coolant_oem: "1051954-016000",

    drain_bolt_oem: "1251112-035094",
    drain_seal_oem: "1244100-063000",

    drain_seal:
      "φ14×φ23×2"
  },

  common_service_intervals: {
    coolant:
      "Tous les 3 ans ou 30 000 km sur documentation 703 récente",

    brake_fluid:
      "Tous les 2 ans",

    spark_plugs:
      "Inspection à 10 000 km · remplacement à 20 000 km",

    valve_clearance:
      "Contrôle / réglage à 40 000 km",

    chain_care:
      "Nettoyage / lubrification tous les 500 à 1 000 km"
  },

  model_specific: {
    rr: {
      model: "703 RR / 703 RR Brembo",

      first_service:
        "500 km",

      regular_service:
        "5 000 km ou 15 mois après la première maintenance",

      air_filter_oem:
        "1226800-163000",

      air_filter_interval:
        "Inspection à 5 000 km · remplacement à 10 000 km",

      chain:
        "525 / 114 maillons",

      chain_oem:
        "1080200-158000",

      chain_slack_mm:
        "20–30",

      brake_versions: {
        standard:
          "J.Juan",

        brembo:
          "Brembo"
      }
    },

    t: {
      model: "703 T",

      air_filter_oem:
        "1226800-163000",

      technical_manual: {
        oil_with_filter_l: 3.4,
        oil_without_filter_l: 3.0,
        spark_plug: "BN8RTIP-8",
        brake_fluid: "DOT 4 · 0,22 L",
        coolant_total_l: 1.9,
        chain_manual:
          "525 / 114 maillons · jeu 20–30 mm"
      },

      chain_parts_catalog: {
        specification:
          "525 / 120 maillons",
        oem:
          "1080200-123000"
      },

      chain_conflict:
        "Le manuel technique 2026 indique 525/114 alors que le catalogue de pièces 703 T 2026 référence une chaîne 525/120. Résoudre avec la version France / VIN avant publication.",

      service_schedule:
        "Manuel ZT703-T Euro V+ 11/05/2026 p. 30 : première huile + filtre à 1 000 km ; huile à 5/10/15/20 000 km ; filtre à huile à 10/20 000 km ; air inspection 5/15 et remplacement 10/20 ; bougies contrôle 10 et remplacement 20 ; soupapes 40 000 km."
    },

    f: {
      model:
        "703 F · Adventure / Trail Adventure / Touring / Touring Adventure",

      france_first_service:
        "1 000 km",

      france_regular_service:
        "Tous les 5 000 km ou annuelle",

      air_filter_oem:
        "1226800-162000",

      chain:
        "525 / 126 maillons",

      chain_open_oem:
        "1080200-112000",

      chain_closed_oem:
        "1080200-120000",

      chain_slack_mm:
        "35–45",

      important:
        "Ne jamais reprendre la chaîne ou le jeu de chaîne de la RR sur une 703 F."
    }
  },

  observed_parts_prices_europe: {
    oil_10w50_4l:
      "≈56–62 €",

    oil_filter_oem:
      "≈13 €",

    rr_t_air_filter_oem:
      "≈19,54 €",

    brake_fluid_dot4_500ml:
      "≈9 €",

    coolant_1l:
      "≈7–13 €",

    rr_chain_525_114_aftermarket:
      "≈89–114 € selon gamme",

    rr_chain_oem_france:
      "≈294,73 €"
  },

  rr_service_cost_evidence: {
    first_500km_owner_observed:
      "≈140 € · Espagne · retour propriétaire 2026",

    service_5000km_owner_observed:
      "≈116 € au total · 71 € atelier + ≈45 € huile apportée · Espagne 2026",

    international_complexity_reference: {
      source:
        "Importadora Imoto · barème ZT703-F / ZT703RR",

      values:
        "1 000 : 146 990 CLP · 5 000 : 146 990 · 10 000 : 239 990 · 15 000 : 156 990 · 20 000 : 344 990 CLP",

      use:
        "Uniquement comme rapport de complexité entre révisions, jamais comme prix France ni comme conversion monétaire."
    }
  },

  notes_for_future_sheets: [
    "Ne pas réutiliser automatiquement l’échéance initiale RR 500 km sur la 703 F : Zontes France indique 1 000 km pour la F.",
    "La 703 RR et la 703 T utilisent le filtre à air 1226800-163000 dans le catalogue actuel ; la 703 F utilise 1226800-162000.",
    "RR : chaîne 525/114 et jeu 20–30 mm.",
    "F : chaîne 525/126 et jeu 35–45 mm.",
    "T : conflit 114 maillons dans le manuel / 120 maillons dans le catalogue de pièces 2026 ; vérifier la version France avant publication.",
    "Les trois modèles utilisent trois bougies BN8RTIP-8 et le filtre à huile 1050875-004000.",
    "Conserver séparément les éléments de freinage RR J.Juan et RR Brembo."
  ],

  sources: [
    "https://www.zontes.com/EN/AboutUs/Download.aspx",
    "https://www.zontes.fr/entretien/",
    "https://forozontes.com/index.php?topic=6405.0",
    "https://www.imoto.cl/valores_de_mantenciones",
    "https://www.eurobikes.fr/zontes",
    "https://www.bimotoshop.it/en/products/filtro-olio-zontes-703f-703-rr-2025",
    "https://www.pieces-zontes.fr/boutique/Roue-AR",
    "https://www.idealo.fr/prix/5030925/motul-7100-4t-10w-50-4l.html",
    "https://www.norauto.fr/p/liquide-de-frein-dot-4-brembo-500-ml-57041.html",
    "https://www.idealo.fr/prix/4890916/motul-motocool-expert-1-l.html"
  ]
} as const;

import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
import { zontes703SharedResearch } from '@/lib/motorcycle-sheets-v2/zontes-703-shared';

const sharedEngine = zontes703SharedResearch.common_engine_service;
const sharedF = zontes703SharedResearch.model_specific.f;

/**
 * ZONTES 703 F · France
 *
 * Une seule famille V2 :
 * - 703 F Adventure
 * - 703 F Trail Adventure
 * - 703 F Touring
 * - 703 F Touring Adventure
 *
 * Les caractéristiques communes restent au niveau famille.
 * Seules les différences prouvées sont portées par les variantes.
 *
 * Vérification éditoriale : 01/10/2026.
 */

export const zontes703fDisplayData = {
  modelName: 'ZONTES 703 F',
  model: '703 F',
  year: '2025+',
  category: 'Trail aventure',

  introduction:
    'La Zontes 703 F existe en quatre versions, mais le choix se fait surtout entre deux parties-cycle. Adventure et Trail Adventure roulent en 21 / 18 pouces ; Touring et Touring Adventure passent en 19 / 17. Toutes partagent le trois-cylindres de 699 cm³, 95 ch et 76 Nm. Trail Adventure et Touring Adventure ajoutent de série les crash-bars, les feux additionnels et les supports de valises.',

  engine: {
    type:
      '3 cylindres en ligne, 4 temps, refroidissement liquide',
    displacement:
      '699 cm³',
    power:
      '95 ch / 70 kW à 10 000 tr/min',
    torque:
      '76 Nm à 7 500 tr/min',
    bridage:
      'Permis A / A2 avec bridage homologué',
    alimentation:
      'Injection électronique',
  },

  cycleParts: {
    frame:
      'Cadre périmétrique en alliage d’aluminium',
    frontBrake:
      'Double disques J.Juan',
    rearBrake:
      'Disque J.Juan',
    frontSuspension:
      'Marzocchi réglable',
    rearSuspension:
      'Marzocchi réglable',
    frontTire:
      'Selon variante : 90/90 R21 ou 120/70 R19 · Michelin Anakee Adventure',
    rearTire:
      'Selon variante : 150/70 R18 ou 170/60 R17 · Michelin Anakee Adventure',
  },

  dimensions: {
    wetWeight:
      '236 kg en ordre de marche',
    seatHeight:
      '845 mm',
    tank:
      '22 L',
  },

  faq: [
    {
      question:
        'Quelle différence entre les quatre Zontes 703 F ?',
      answer:
        'Adventure et Trail Adventure utilisent des roues 21 / 18 pouces et un empattement de 1 565 mm. Touring et Touring Adventure passent en 19 / 17 pouces avec un empattement de 1 550 mm. Trail Adventure et Touring Adventure ajoutent de série les crash-bars, les feux additionnels et les supports de valises.',
    },
    {
      question:
        'Quand faire la première révision de la Zontes 703 F ?',
      answer:
        'Zontes France indique une première révision à 1 000 km, puis une révision tous les 5 000 km ou annuellement.',
    },
    {
      question:
        'Quelle huile utiliser sur la Zontes 703 F ?',
      answer:
        'La documentation constructeur de la famille 703 indique une huile SAE 10W-50 répondant au minimum à API SN, avec environ 3,4 L lors d’une vidange avec remplacement du filtre.',
    },
    {
      question:
        'Quelles sont les références du filtre à huile et du filtre à air ?',
      answer:
        'Le filtre à huile de la famille 703 est référencé 1050875-004000. La 703 F utilise spécifiquement le filtre à air 1226800-162000 ; il ne faut pas reprendre la référence RR / T.',
    },
    {
      question:
        'Quelle chaîne équipe la Zontes 703 F ?',
      answer:
        'La documentation ZT703-F indique une chaîne 525 de 126 maillons avec un jeu de 35 à 45 mm. Cette configuration est différente de celle de la 703 RR.',
    },
    {
      question:
        'La Zontes 703 F est-elle compatible avec le permis A2 ?',
      answer:
        'Oui. Zontes France annonce les quatre variantes 703 F comme éligibles au permis A et au permis A2 avec bridage homologué.',
    },
  ],

  longevityTips: [
    'Après une sortie sous la pluie, un lavage appuyé ou plusieurs kilomètres de chemins, ne rangez pas simplement la moto : contrôlez la transmission une fois sèche, nettoyez et lubrifiez la chaîne si nécessaire et vérifiez que son jeu reste dans la plage prévue.',
    'Si la moto roule régulièrement dans la poussière, le filtre à air mérite une inspection plus rapprochée que sur une utilisation routière. C’est un contrôle simple qui évite de laisser la saleté s’installer jusqu’à la prochaine révision.',
    'Après un passage sur piste caillouteuse ou un choc marqué, prenez quelques minutes pour contrôler les jantes à rayons, les pneus et la pression avant de reprendre un long trajet. Une perte lente ou une déformation légère se repère plus facilement à l’arrêt qu’une fois lancé sur route.',
    'Précisez toujours la variante exacte avant de commander pneus ou éléments de partie-cycle : Adventure / Trail Adventure sont en 21 / 18, Touring / Touring Adventure en 19 / 17.',
    'Avant un long voyage, faites contrôler les consommables d’usure séparément du calendrier constructeur. Pneus, plaquettes et transmission ne sont pas inclus dans le budget des révisions et leur remplacement dépend beaucoup de l’usage.',
  ],

  conclusion:
    'La 703 F se choisit d’abord par ses roues : 21 / 18 pour garder davantage de polyvalence sur les chemins, 19 / 17 pour privilégier la route. Trail Adventure et Touring Adventure ajoutent surtout l’équipement de voyage sans changer la base mécanique. L’entretien est bien documenté mais les passages tous les 5 000 km restent fréquents ; sur une occasion, un historique complet vaut donc davantage qu’un faible kilométrage sans factures.',
};

const zontes703fCommonVariant = {
  license_fr:
    'A_BRIDABLE_A2' as const,

  license_fr_source:
    'https://www.zontes.fr/moto-permis-a2/',

  license_fr_verified_at:
    '2026-10-01',

  license_bridging:
    'Permis A / A2 avec bridage homologué 35 kW',

  engine_type:
    '3 cylindres en ligne, 4 temps, refroidissement liquide',

  displacement_cc:
    699,

  power:
    '95 ch (70 kW) à 10 000 tr/min',

  torque:
    '76 Nm à 7 500 tr/min',

  fuel_system:
    'Injection électronique',

  weight_tpf_kg:
    236,

  seat_height_mm:
    845,

  ground_clearance_mm:
    205,

  tank_l:
    22,

  cycle_parts: {
    frame:
      'Cadre périmétrique en alliage d’aluminium',

    front_brake:
      'Double disques J.Juan',

    rear_brake:
      'Disque J.Juan',

    front_suspension:
      'Marzocchi réglable',

    rear_suspension:
      'Marzocchi réglable',
  },
};

export const zontes703fVariants = [
  {
    ...zontes703fCommonVariant,

    label:
      '703 F Adventure',

    source_url:
      'https://www.zontes.fr/moto-700cc/703-f-adventure/',

    length_mm:
      2305,

    width_mm:
      960,

    height_mm:
      1525,

    wheelbase_mm:
      1565,

    wheel_setup:
      '21 pouces avant / 18 pouces arrière',

    cycle_parts: {
      ...zontes703fCommonVariant.cycle_parts,

      front_tire:
        '90/90 R21 · Michelin Anakee Adventure',

      rear_tire:
        '150/70 R18 · Michelin Anakee Adventure',

      wheels:
        'Jantes à rayons Tubeless · 21 / 18 pouces',
    },

    riding_aids:
      'ABS, contrôle de traction, TPMS',

    equipment_note:
      'Sabot moteur, protège-mains, poignées chauffantes, béquille centrale, shifter up, TFT 6,75 pouces et bulle électrique. Crash-bars et supports de valises disponibles en accessoires.',
  },

  {
    ...zontes703fCommonVariant,

    label:
      '703 F Trail Adventure',

    source_url:
      'https://www.zontes.fr/moto-700cc/703-f-trail-adventure/',

    length_mm:
      2305,

    width_mm:
      960,

    height_mm:
      1525,

    wheelbase_mm:
      1565,

    wheel_setup:
      '21 pouces avant / 18 pouces arrière',

    cycle_parts: {
      ...zontes703fCommonVariant.cycle_parts,

      front_tire:
        '90/90 R21 · Michelin Anakee Adventure',

      rear_tire:
        '150/70 R18 · Michelin Anakee Adventure',

      wheels:
        'Jantes à rayons Tubeless · 21 / 18 pouces',
    },

    riding_aids:
      'ABS, contrôle de traction, TPMS',

    equipment_note:
      'Base technique Adventure 21 / 18 pouces avec crash-bars, feux additionnels et supports de valises montés de série.',
  },

  {
    ...zontes703fCommonVariant,

    label:
      '703 F Touring',

    source_url:
      'https://www.zontes.fr/moto-700cc/703-f-touring/',

    length_mm:
      2265,

    width_mm:
      960,

    height_mm:
      1510,

    wheelbase_mm:
      1550,

    wheel_setup:
      '19 pouces avant / 17 pouces arrière',

    cycle_parts: {
      ...zontes703fCommonVariant.cycle_parts,

      front_tire:
        '120/70 R19 · Michelin Anakee Adventure',

      rear_tire:
        '170/60 R17 · Michelin Anakee Adventure',

      wheels:
        'Jantes à rayons Tubeless · 19 / 17 pouces',
    },

    riding_aids:
      'ABS arrière déconnectable, contrôle de traction, TPMS',

    equipment_note:
      'Configuration routière 19 / 17 pouces. Sabot moteur, protège-mains, poignées chauffantes, béquille centrale, shifter up, TFT 6,75 pouces et bulle électrique. Crash-bars et supports de valises restent en accessoires.',
  },

  {
    ...zontes703fCommonVariant,

    label:
      '703 F Touring Adventure',

    source_url:
      'https://www.zontes.fr/moto-700cc/703-f-touring-adventure/',

    length_mm:
      2265,

    width_mm:
      960,

    height_mm:
      1510,

    wheelbase_mm:
      1550,

    wheel_setup:
      '19 pouces avant / 17 pouces arrière',

    cycle_parts: {
      ...zontes703fCommonVariant.cycle_parts,

      front_tire:
        '120/70 R19 · Michelin Anakee Adventure',

      rear_tire:
        '170/60 R17 · Michelin Anakee Adventure',

      wheels:
        'Jantes à rayons Tubeless · 19 / 17 pouces',
    },

    riding_aids:
      'ABS arrière déconnectable, contrôle de traction, TPMS',

    equipment_note:
      'Base technique Touring 19 / 17 pouces avec crash-bars, feux additionnels et supports de valises montés de série.',
  },
];

export const zontes703fV2: MotorcycleSheetV2 = {
  layout_version:
    2,

  display_title:
    'ZONTES 703 F',

  intro:
    zontes703fDisplayData.introduction,

  license_fr:
    'A_BRIDABLE_A2',

  license_fr_source:
    'https://www.zontes.fr/moto-permis-a2/',

  license_fr_verified_at:
    '2026-10-01',

  variants:
    zontes703fVariants,

  faq:
    zontes703fDisplayData.faq,

  longevity_tips: [
    'Après une sortie sous la pluie, un lavage appuyé ou plusieurs kilomètres de chemins, ne rangez pas simplement la moto : contrôlez la transmission une fois sèche, nettoyez et lubrifiez la chaîne si nécessaire et vérifiez que son jeu reste dans la plage prévue.',
    'Si la moto roule régulièrement dans la poussière, le filtre à air mérite une inspection plus rapprochée que sur une utilisation routière. C’est un contrôle simple qui évite de laisser la saleté s’installer jusqu’à la prochaine révision.',
    'Après un passage sur piste caillouteuse ou un choc marqué, prenez quelques minutes pour contrôler les jantes à rayons, les pneus et la pression avant de reprendre un long trajet. Une perte lente ou une déformation légère se repère plus facilement à l’arrêt qu’une fois lancé sur route.',
    'Précisez toujours la variante exacte avant de commander pneus ou éléments de partie-cycle : Adventure / Trail Adventure sont en 21 / 18, Touring / Touring Adventure en 19 / 17.',
    'Avant un long voyage, faites contrôler les consommables d’usure séparément du calendrier constructeur. Pneus, plaquettes et transmission ne sont pas inclus dans le budget des révisions et leur remplacement dépend beaucoup de l’usage.',
  ],

  conclusion:
    zontes703fDisplayData.conclusion,

  hero_subtitle:
    'La Zontes 703 F décline le même trois-cylindres de 699 cm³ en quatre versions, avec roues 21 / 18 ou 19 / 17 et une première révision à 1 000 km.',

  quick_facts: [
    {
      label:
        'MOTEUR',
      value:
        '699 cm³ · 3 cylindres',
    },
    {
      label:
        'PUISSANCE',
      value:
        '95 ch · 70 kW',
    },
    {
      label:
        'COUPLE',
      value:
        '76 Nm',
    },
    {
      label:
        'POIDS',
      value:
        '236 kg',
    },
    {
      label:
        'RÉSERVOIR',
      value:
        '22 L',
    },
  ],

  service_schedule_v2: [
    {
      km:
        1000,

      title:
        'Première révision',

      price_estimate:
        '≈188 €',

      price_type:
        'observed',

      operations: [
        {
          label:
            'Remplacement de l’huile moteur',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement du filtre à huile',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Contrôles de rodage, freinage, transmission et fixations',
          source_type:
            'technical_documentation',
        },
      ],

      note:
        'Échéance France confirmée par Zontes. Tarif de 188 € observé en mai 2026 sur une 703 F Touring dans un atelier français ; il ne constitue pas un tarif national Zontes.',
    },

    {
      km:
        5000,

      title:
        'Entretien périodique',

      price_estimate:
        '≈180–200 €',

      price_type:
        'estimate',

      operations: [
        {
          label:
            'Remplacement de l’huile moteur',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Inspection du filtre à air',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Contrôles périodiques et transmission',
          source_type:
            'technical_documentation',
        },
      ],

      note:
        'Estimation LabelMoto. Le niveau de complexité est rapproché de l’échéance 1 000 km à partir du barème distributeur ZT703-F / ZT703RR ; aucun tarif France national n’est publié.',
    },

    {
      km:
        10000,

      title:
        'Révision avec filtres',

      price_estimate:
        '≈295–325 €',

      price_type:
        'estimate',

      operations: [
        {
          label:
            'Remplacement de l’huile moteur',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement du filtre à huile',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement du filtre à air',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Contrôles périodiques',
          source_type:
            'technical_documentation',
        },
      ],

      note:
        'Estimation LabelMoto construite à partir du contenu du manuel et du rapport de complexité entre les révisions 1 000 et 10 000 km du barème distributeur ZT703-F / ZT703RR.',
    },

    {
      km:
        15000,

      title:
        'Entretien périodique',

      price_estimate:
        '≈190–210 €',

      price_type:
        'estimate',

      operations: [
        {
          label:
            'Remplacement de l’huile moteur',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Inspection du filtre à air',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Inspection des bougies',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Contrôles périodiques',
          source_type:
            'technical_documentation',
        },
      ],

      note:
        'Estimation LabelMoto. La table constructeur 2026 place l’inspection des bougies à cette échéance.',
    },

    {
      km:
        20000,

      title:
        'Révision renforcée',

      price_estimate:
        '≈425–455 €',

      price_type:
        'estimate',

      operations: [
        {
          label:
            'Remplacement de l’huile moteur',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement du filtre à huile',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement du filtre à air',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement des trois bougies',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Contrôles périodiques',
          source_type:
            'technical_documentation',
        },
      ],

      note:
        'Estimation LabelMoto fondée sur les opérations du manuel 703 F et le rapport de complexité du barème distributeur ZT703-F / ZT703RR. Ce n’est pas un tarif Zontes France.',
    },

    {
      km:
        25000,

      title:
        'Entretien périodique',

      price_estimate:
        '≈180–200 €',

      price_type:
        'estimate',

      operations: [
        {
          label:
            'Remplacement de l’huile moteur',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Contrôles périodiques et transmission',
          source_type:
            'technical_documentation',
        },
      ],

      note:
        'Échéance estimée à partir du cycle de 5 000 km. À confirmer sur le carnet d’entretien correspondant au millésime et au VIN.',
    },

    {
      km:
        30000,

      title:
        'Révision 30 000 km',

      price_estimate:
        '≈330–420 €',

      price_type:
        'estimate',

      operations: [
        {
          label:
            'Remplacement de l’huile moteur',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement du filtre à huile',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement du filtre à air',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement du liquide de refroidissement si échéance kilométrique / temps atteinte',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Remplacement de l’élément d’usure du bras oscillant mentionné par la table 2026',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Contrôles périodiques',
          source_type:
            'technical_documentation',
        },
      ],

      note:
        'Estimation LabelMoto plus large à cette échéance : la table 2026 ajoute notamment le liquide de refroidissement et un élément d’usure du bras oscillant. Aucun forfait national Zontes France spécifique aux 30 000 km n’a été identifié.',
    },

    {
      km:
        35000,

      title:
        'Entretien périodique',

      price_estimate:
        '≈180–200 €',

      price_type:
        'estimate',

      operations: [
        {
          label:
            'Remplacement de l’huile moteur',
          source_type:
            'technical_documentation',
        },
        {
          label:
            'Contrôles périodiques',
          source_type:
            'technical_documentation',
        },
      ],

      note:
        'Échéance estimée après 30 000 km à partir du même cycle de 5 000 km. À confirmer sur le carnet d’entretien correspondant au millésime et au VIN.',
    },


  ],

  maintenance_details: [
    {
      id:
        'huile',

      title:
        'Huile moteur & filtre',

      summary:
        'SAE 10W-50 · 3,4 L avec filtre · OEM 1050875-004000',

      rows: [
        {
          label:
            'Viscosité',
          value:
            sharedEngine.engine_oil,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Capacité avec filtre',
          value:
            sharedEngine.oil_with_filter_l + ' L',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Capacité sans filtre',
          value:
            sharedEngine.oil_without_filter_l + ' L',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Filtre à huile OEM',
          value:
            sharedEngine.oil_filter_oem,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Vidange',
          value:
            '1 000 km puis tous les 5 000 km',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Filtre à huile',
          value:
            '1 000 · 10 000 · 20 000 · 30 000 km',
          confidence:
            'technical_documentation',
        },
      ],

      note:
        'La périodicité 703 F est spécifique : ne pas reprendre la première échéance de 500 km de la 703 RR.',
    },

    {
      id:
        'air',

      title:
        'Filtre à air',

      summary:
        'OEM 1226800-162000 · contrôle 5 000 / 15 000 · remplacement 10 000 / 20 000 km',

      rows: [
        {
          label:
            'Référence OEM 703 F',
          value:
            sharedF.air_filter_oem,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Inspection',
          value:
            '5 000 puis 15 000 km sur la table 2026',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Remplacement',
          value:
            '10 000 puis 20 000 km ; cycle à poursuivre selon le manuel',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Usage poussiéreux',
          value:
            'Contrôle et remplacement à rapprocher selon les conditions',
          confidence:
            'technical_documentation',
        },
      ],

      note:
        'La référence 1226800-162000 est propre à la 703 F dans la recherche famille actuelle. Les RR / T utilisent une autre référence.',
    },

    {
      id:
        'bougies',

      title:
        'Bougies',

      summary:
        '3 × BN8RTIP-8 · OEM 1051161-016000 · 0,7–0,9 mm',

      rows: [
        {
          label:
            'Type',
          value:
            sharedEngine.spark_plug,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Référence OEM',
          value:
            sharedEngine.spark_plug_oem,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Quantité',
          value:
            String(sharedEngine.spark_plug_quantity),
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Écartement',
          value:
            sharedEngine.spark_plug_gap_mm + ' mm',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Couple de serrage',
          value:
            '13 Nm',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Table 2026',
          value:
            'Inspection 15 000 km · remplacement 20 000 km',
          confidence:
            'technical_documentation',
        },
      ],

      note:
        'La table ZT703-F 2026 est retenue en priorité pour cette fiche ; elle ne doit pas être remplacée par une périodicité issue d’un autre modèle 703.',
    },

    {
      id:
        'soupapes',

      title:
        'Jeu aux soupapes',

      summary:
        'Contrôle / réglage à 40 000 km',

      rows: [
        {
          label:
            'Admission à froid',
          value:
            '0,10–0,22 mm',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Échappement à froid',
          value:
            '0,20–0,33 mm',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Échéance',
          value:
            '40 000 km',
          confidence:
            'technical_documentation',
        },
      ],
    },

    {
      id:
        'refroidissement',

      title:
        'Liquide de refroidissement',

      summary:
        '1,9 L · éthylène glycol · 3 ans ou 30 000 km',

      rows: [
        {
          label:
            'Capacité totale',
          value:
            sharedEngine.coolant_total_l + ' L',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Type',
          value:
            sharedEngine.coolant_type,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Référence OEM',
          value:
            sharedEngine.coolant_oem,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Remplacement',
          value:
            'Tous les 3 ans ou 30 000 km',
          confidence:
            'technical_documentation',
        },
      ],
    },

    {
      id:
        'freinage',

      title:
        'Freinage & liquide de frein',

      summary:
        'J.Juan · DOT 4 · remplacement liquide tous les 2 ans',

      rows: [
        {
          label:
            'Liquide',
          value:
            sharedEngine.brake_fluid,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Capacité documentée',
          value:
            sharedEngine.brake_fluid_capacity_l + ' L',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Remplacement',
          value:
            'Tous les 2 ans',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Avant',
          value:
            'Double disques J.Juan',
          confidence:
            'official_fr',
        },
        {
          label:
            'Arrière',
          value:
            'Disque J.Juan',
          confidence:
            'official_fr',
        },
      ],
    },

    {
      id:
        'chaine',

      title:
        'Chaîne & transmission',

      summary:
        '525 · 126 maillons · jeu 35–45 mm',

      rows: [
        {
          label:
            'Chaîne',
          value:
            sharedF.chain,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Référence OEM ouverte',
          value:
            sharedF.chain_open_oem,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Référence OEM fermée',
          value:
            sharedF.chain_closed_oem,
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Jeu',
          value:
            sharedF.chain_slack_mm + ' mm',
          confidence:
            'technical_documentation',
        },
        {
          label:
            'Nettoyage / lubrification',
          value:
            'Environ tous les 500 à 1 000 km et plus souvent après pluie, lavage ou poussière',
          confidence:
            'technical_documentation',
        },
      ],

      note:
        sharedF.important,
    },

    {
      id:
        'variantes',

      title:
        'Roues & géométrie selon variante',

      summary:
        'Adventure 21 / 18 · Touring 19 / 17',

      rows: [
        {
          label:
            'Adventure / Trail Adventure',
          value:
            '90/90 R21 + 150/70 R18 · empattement 1 565 mm · 2 305 × 960 × 1 525 mm',
          confidence:
            'official_fr',
        },
        {
          label:
            'Touring / Touring Adventure',
          value:
            '120/70 R19 + 170/60 R17 · empattement 1 550 mm · 2 265 × 960 × 1 510 mm',
          confidence:
            'official_fr',
        },
        {
          label:
            'Pneumatiques France',
          value:
            'Michelin Anakee Adventure · jantes à rayons Tubeless',
          confidence:
            'official_fr',
        },
        {
          label:
            'Commun aux quatre',
          value:
            '236 kg · selle 845 mm · garde au sol 205 mm · réservoir 22 L',
          confidence:
            'official_fr',
        },
      ],
    },
  ],

  consumables_v2: [
    {
      part:
        'Huile moteur',

      specification:
        sharedEngine.engine_oil + ' · ' +
        sharedEngine.oil_with_filter_l +
        ' L avec filtre / ' +
        sharedEngine.oil_without_filter_l +
        ' L sans filtre',

      replacement_interval:
        '1 000 km puis tous les 5 000 km',

      observed_price:
        '≈56–62 € / 4 L',

      source_type:
        'observed',

      note:
        'Prix produit observé en Europe ; ce n’est pas un tarif d’entretien constructeur.',
    },

    {
      part:
        'Filtre à huile',

      specification:
        'OEM Zontes ' + sharedEngine.oil_filter_oem,

      reference_oem:
        sharedEngine.oil_filter_oem,

      replacement_interval:
        '1 000 · 10 000 · 20 000 · 30 000 km',

      observed_price:
        '≈13 €',

      source_type:
        'observed',
    },

    {
      part:
        'Filtre à air',

      specification:
        'OEM Zontes 703 F ' + sharedF.air_filter_oem,

      reference_oem:
        sharedF.air_filter_oem,

      replacement_interval:
        'Contrôle 5 000 / 15 000 · remplacement 10 000 / 20 000 km',

      observed_price:
        'Prix France à confirmer',

      source_type:
        'technical_documentation',

      note:
        'Aucun prix France suffisamment documenté n’est transposé depuis la référence RR / T.',
    },

    {
      part:
        'Bougies',

      specification:
        '3 × ' + sharedEngine.spark_plug +
        ' · OEM ' + sharedEngine.spark_plug_oem,

      reference_oem:
        sharedEngine.spark_plug_oem,

      replacement_interval:
        'Inspection 15 000 km · remplacement 20 000 km sur table 2026',

      observed_price:
        'Prix France à confirmer',

      source_type:
        'technical_documentation',
    },

    {
      part:
        'Liquide de frein',

      specification:
        sharedEngine.brake_fluid +
        ' · capacité documentée ' +
        sharedEngine.brake_fluid_capacity_l +
        ' L',

      replacement_interval:
        'Tous les 2 ans',

      observed_price:
        '≈9 € / 500 ml',

      source_type:
        'observed',
    },

    {
      part:
        'Liquide de refroidissement',

      specification:
        sharedEngine.coolant_type +
        ' · OEM ' +
        sharedEngine.coolant_oem +
        ' · ' +
        sharedEngine.coolant_total_l +
        ' L',

      reference_oem:
        sharedEngine.coolant_oem,

      replacement_interval:
        'Tous les 3 ans ou 30 000 km',

      observed_price:
        '≈7–13 € / L',

      source_type:
        'observed',
    },

    {
      part:
        'Chaîne secondaire',

      specification:
        sharedF.chain +
        ' · OEM ouverte ' +
        sharedF.chain_open_oem +
        ' · OEM fermée ' +
        sharedF.chain_closed_oem,

      reference_oem:
        sharedF.chain_open_oem,

      replacement_interval:
        'Selon usure · jeu constructeur 35–45 mm',

      observed_price:
        'Prix France à confirmer',

      source_type:
        'technical_documentation',

      note:
        'Ne pas reprendre les tarifs ou références de chaîne 114 maillons de la 703 RR.',
    },
  ],

  budget: {
    title:
      'Budget d’entretien jusqu’à 30 000 km',

    summary: {
      horizon_km:
        30000,

      total_cost:
        '≈1 788–1 998 €',

      cost_per_km:
        '≈0,060–0,067 €/km',

      interval_rule:
        '1 000 km puis tous les 5 000 km / 1 an',

      note:
        'Enveloppe des révisions programmées jusqu’à 30 000 km. Le coût des 1 000 km provient d’un tarif réellement observé en France ; les échéances suivantes sont des estimations LabelMoto fondées sur les opérations prévues par le constructeur. Pneus, plaquettes, kit chaîne, batterie et autres pièces remplacées selon leur usure ne sont pas compris.',
    },

    note:
      'Cette enveloppe couvre l’entretien programmé, pas tout le coût d’usage. Gardez une marge séparée pour les pneus, les plaquettes, la transmission finale et la batterie : selon le type de parcours et le rythme, ces postes peuvent peser davantage qu’une révision intermédiaire.',
  },

  warranty: {
    duration:
      '3 ans pièces · 2 ans main-d’œuvre',

    coverage:
      'Garantie annoncée sur les pages modèles 703 F du réseau Zontes France, sous réserve des conditions contractuelles.',

    maintenance_requirement:
      'Respecter le plan d’entretien correspondant au véhicule et faire renseigner le carnet après les visites.',

    claim_requirement:
      'Pour une prise en charge, se rapprocher du réseau Zontes France avec les justificatifs d’entretien demandés.',

    legal_warranty_note:
      'La garantie commerciale constructeur ne remplace pas les garanties légales françaises applicables.',

    market:
      'France',

    source_label:
      'Zontes France · pages 703 F / entretien / garantie',
  },

  known_issues_v2: [
    {
      title:
        'Identifier précisément la variante',

      description:
        'Adventure et Trail Adventure utilisent la partie-cycle 21 / 18 pouces ; Touring et Touring Adventure utilisent 19 / 17 pouces avec une géométrie différente. Les pièces et pneumatiques doivent être commandés pour la variante exacte.',

      type:
        'manufacturer_monitoring',

      confidence:
        'official_fr',
    },

    {
      title:
        'Historique des révisions 5 000 km',

      description:
        'Zontes France prévoit 1 000 km puis tous les 5 000 km ou annuellement. Sur une moto d’occasion, vérifier le carnet et les factures plutôt que de se limiter au kilométrage total.',

      type:
        'manufacturer_monitoring',

      confidence:
        'official_fr',
    },

    {
      title:
        'Transmission spécifique 703 F',

      description:
        'La 703 F utilise une chaîne 525 de 126 maillons et un jeu de 35 à 45 mm. Les valeurs de la 703 RR ne doivent pas être transposées.',

      type:
        'manufacturer_monitoring',

      confidence:
        'technical_documentation',
    },

    {
      title:
        'Occasion proche de 30 000 km : contrôler la facture',

      description:
        'Sur une moto qui approche ou dépasse 30 000 km, demandez la facture détaillée de cette révision. La table ZT703-F 2026 mentionne notamment le liquide de refroidissement ainsi qu’un « rear fork wear block ». La traduction française étant ambiguë, vérifiez sur la facture ou auprès du réseau quelle pièce a réellement été contrôlée ou remplacée avant d’en commander une.',

      type:
        'manufacturer_monitoring',

      confidence:
        'technical_documentation',
    },

    {
      title:
        'Usage poussiéreux',

      description:
        'Sur chemins ou en environnement poussiéreux, la filtration d’air et la transmission demandent des contrôles plus rapprochés que le cycle routier normal.',

      type:
        'usage_limitation',

      confidence:
        'technical_documentation',
    },
  ],

  verdict: {
    title:
      'Deux trains roulants, une même base mécanique',

    text:
      'Le vrai choix se fait entre les roues 21 / 18 des Adventure et les 19 / 17 des Touring. Trail Adventure et Touring Adventure ajoutent surtout l’équipement de voyage sans changer la base mécanique. Quelle que soit la version, les 236 kg en ordre de marche et la selle à 845 mm méritent un essai à basse vitesse avant achat ; le choix du niveau d’équipement vient ensuite.',

    strengths: [
      '95 ch et 76 Nm, avec bridage A2 homologué disponible',
      '21 / 18 pouces pour Adventure, 19 / 17 pouces pour Touring',
      'Réservoir de 22 L sur les quatre variantes',
      'Suspensions Marzocchi réglables et roues à rayons Tubeless',
      'Poignées chauffantes, béquille centrale, bulle électrique et TPMS de série',
    ],

    weaknesses: [
      '236 kg en ordre de marche sur les quatre variantes',
      'Hauteur de selle de 845 mm à prendre en compte selon le gabarit du pilote',
      'Shifter limité à la montée sur la configuration France publiée',
      'Cycle de révision tous les 5 000 km',
      'Budget des grosses révisions moins prévisible faute de forfaits nationaux publiés',
    ],
  },

  data_quality: {
    market:
      'France + documentation constructeur internationale',

    model_year:
      '2025+ · documentation ZT703-F 2024 / 2026',

    manufacturer_fr_verified:
      true,

    european_manual_verified:
      false,

    technical_documentation_verified:
      true,

    consumables_verified:
      false,

    recall_checked:
      false,

    pricing_type:
      'estimate',

    last_verified:
      '01/10/2026',

    sources: [
      {
        label:
          'Zontes France · 703 F Adventure',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.zontes.fr/moto-700cc/703-f-adventure/',

        note:
          '95 ch, 76 Nm, 236 kg, 845 mm, 22 L, géométrie 21 / 18, J.Juan, Marzocchi, équipements, A / A2 et garantie.',
      },

      {
        label:
          'Zontes France · 703 F Trail Adventure',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.zontes.fr/moto-700cc/703-f-trail-adventure/',

        note:
          'Configuration 21 / 18 de l’Adventure avec crash-bars, feux additionnels et supports de valises montés de série.',
      },

      {
        label:
          'Zontes France · 703 F Touring',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.zontes.fr/moto-700cc/703-f-touring/',

        note:
          'Configuration 19 / 17, dimensions 2 265 × 960 × 1 510 mm, empattement 1 550 mm, ABS arrière déconnectable, caractéristiques France.',
      },

      {
        label:
          'Zontes France · 703 F Touring Adventure',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.zontes.fr/moto-700cc/703-f-touring-adventure/',

        note:
          'Base Touring 19 / 17 avec crash-bars, feux additionnels et supports de valises de série.',
      },

      {
        label:
          'Zontes France · conseils d’entretien',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.zontes.fr/entretien/',

        note:
          '703 F : première révision à 1 000 km puis tous les 5 000 km ou annuellement.',
      },

      {
        label:
          'Zontes · ZT703-F Maintenance Manual (2024 & 2026 model)',

        type:
          'technical_documentation',

        market:
          'Constructeur',

        model_year:
          '2024 / 2026',

        url:
          'https://www.zontes.com/GM/EN/Server/DownLoad.aspx?UrlVl=Inf',

        note:
          'Source prioritaire pour le calendrier détaillé, huile, filtres, bougies, soupapes, fluides et opérations 30 000 km.',
      },

      {
        label:
          'Zontes · catalogue pièces 703 F',

        type:
          'technical_documentation',

        market:
          'Constructeur',

        model_year:
          '2026',

        url:
          'https://www.zontes.com/EN/Products/Part9Bom.aspx',

        note:
          'Références de consommables et pièces d’entretien ZT703-F. Le catalogue précise que les données commerciales Chine doivent être rapprochées de l’agent local.',
      },

      {
        label:
          'Zontes France · permis A2',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.zontes.fr/moto-permis-a2/',

        note:
          'Gamme 700 compatible A2 avec kit de bridage homologué constructeur via le réseau.',
      },

      {
        label:
          'Retour propriétaire France · première révision 703 F Touring',

        type:
          'observed',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://magasin.tel/f/quad-moto-cycle-richwiller-9382133/',

        note:
          'Facture rapportée à 188 € pour la révision des 1 000 km en mai 2026, réglage léger de chaîne inclus. Utilisée uniquement comme observation tarifaire ponctuelle.',
      },

      {
        label:
          'Importadora Imoto · barème entretien ZT703-F / ZT703RR',

        type:
          'official_other_market',

        market:
          'Chili',

        model_year:
          '2026',

        url:
          'https://www.imoto.cl/valores_de_mantenciones',

        note:
          'Utilisé uniquement pour le rapport relatif de complexité entre les échéances 1 000 / 5 000 / 10 000 / 15 000 / 20 000 km. Aucune conversion du prix chilien en tarif France.',
      },
    ],
  },

  equivalents_v2: [
    {
      id:
        'cfmoto-800mt-x-2025-plus',

      name:
        'CFMOTO 800MT-X',

      reason:
        'Trail aventure de cylindrée voisine avec orientation voyage et tout-terrain.',
    },

    {
      id:
        'kove-800x-pro-2024-plus',

      name:
        'KOVE 800X Pro',

      reason:
        'Trail aventure intermédiaire avec roues 21 / 18 et usage mixte route / piste.',
    },

    {
      id:
        'voge-ds900x-2025-plus',

      name:
        'VOGE DS900X',

      reason:
        'Trail routier / aventure très équipé positionné sur un usage polyvalent comparable.',
    },
  ],
};

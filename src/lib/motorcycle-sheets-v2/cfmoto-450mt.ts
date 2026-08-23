import type {
  MotorcycleSheetV2,
} from '@/lib/motorcycle-sheet-v2';

export const cfmoto450mtDisplayData = {
  modelName: 'CFMOTO 450MT',
  brand: 'CFMOTO',
  year: '2024+',
  category: 'Trail',

  introduction:
    "La CFMOTO 450MT est un trail A2 léger orienté route et chemins. CFMOTO France prévoit une première révision à 1 000 km puis un entretien tous les 5 000 km ou annuellement. Le manuel européen apporte des précisions complémentaires pour l'huile, les filtres, les bougies, les pneumatiques et les principaux contrôles techniques.",

  imageUrl:
    '/images/entretien-cfmoto-450mt.webp',

  hasVariants: false,
  variants: [],

  engine: {
    bridage:
      'A2 native · aucun bridage nécessaire',

    type:
      'Bicylindre en ligne, 4 temps, refroidissement liquide, DOHC, vilebrequin calé à 270°',

    displacement:
      '449,5 cm³',

    power:
      '42 ch (31 kW) à 8 500 tr/min',

    torque:
      '44 Nm à 6 250 tr/min',

    alimentation:
      'Injection électronique · accélérateur mécanique',
  },

  cycleParts: {
    frame:
      'Cadre tubulaire acier haute résistance',

    frontBrake:
      'Simple disque Ø 320 mm · ABS Bosch',

    rearBrake:
      'Simple disque Ø 240 mm · ABS déconnectable',

    frontSuspension:
      'Fourche KYB Ø 41 mm réglable compression / détente · débattement 200 mm',

    rearSuspension:
      'Amortisseur KYB réglable précharge / détente · débattement 200 mm',

    frontTire:
      '90/90 R21',

    rearTire:
      '140/70 R18 · 140/80 R18 également homologué en France',
  },

  dimensions: {
    wetWeight:
      '175 kg',

    seatHeight:
      '820 mm',

    tank:
      '17,5 L',
  },

  serviceSchedule: [],
  consumables: [],
  maintenanceCost: null,
  knownIssues: [],

  longevityTips: [
    "Respecter le calendrier d'entretien correspondant au millésime exact de la moto.",
    "Contrôler et lubrifier plus fréquemment la chaîne après roulage sous la pluie, dans la boue ou la poussière.",
    "Nettoyer le filtre à air plus fréquemment lors d'un usage régulier hors bitume.",
    "Contrôler les pressions à froid et adapter la surveillance des pneus à l'usage route / tout-terrain.",
    "Conserver le carnet d'entretien et toutes les factures de maintenance.",
  ],

  conclusion:
    "La 450MT propose un ensemble particulièrement cohérent pour un trail A2 : moteur souple, poids contenu, grandes roues et suspensions adaptées aux chemins. Son entretien est relativement fréquent avec une échéance France tous les 5 000 km, ce qui doit être intégré au budget d'utilisation.",

  faq: [
    {
      question:
        'Quand faire les révisions de la CFMOTO 450MT ?',

      answer:
        "CFMOTO France indique une première révision à 1 000 km puis une révision tous les 5 000 km ou annuellement pour la gamme 450. Le carnet correspondant au millésime exact de votre moto reste la référence pour la garantie.",
    },

    {
      question:
        'Quelle huile moteur utiliser sur la CFMOTO 450MT ?',

      answer:
        "Le manuel européen recommande une huile SAE 10W-40, API SJ ou supérieure, avec JASO MA2 comme choix privilégié.",
    },

    {
      question:
        "Quelle quantité d'huile faut-il avec le filtre ?",

      answer:
        "Le manuel européen indique 2,5 litres lors du remplacement de l'huile moteur et du filtre.",
    },

    {
      question:
        'Quand contrôler le jeu aux soupapes ?',

      answer:
        "Le manuel d'entretien européen de la 450MT prévoit un contrôle du jeu aux soupapes à 40 000 km.",
    },

    {
      question:
        'Quelle pression mettre dans les pneus ?',

      answer:
        "Le manuel européen indique 225 kPa, soit 2,25 bar à froid, à l'avant comme à l'arrière.",
    },

    {
      question:
        'La CFMOTO 450MT est-elle compatible permis A2 ?',

      answer:
        "Oui. La 450MT est commercialisée en France comme une moto A2 native et ne nécessite pas de bridage.",
    },

    {
      question:
        'Quelle est la garantie de la CFMOTO 450MT en France ?',

      answer:
        "CFMOTO France affiche actuellement une garantie commerciale de 2 ans pièces et main-d'œuvre pour la 450MT. Le constructeur demande que l'entretien soit réalisé dans le réseau CFMOTO France et consigné dans le carnet d'entretien.",
    },

    {
      question:
        'Pourquoi trouve-t-on parfois 185 kg pour la 450MT sur internet ?',

      answer:
        "Les caractéristiques diffèrent selon les marchés et les versions. La fiche CFMOTO France actuellement publiée indique 175 kg. LabelMoto privilégie la donnée du marché français et signale les différences lorsqu'elles sont documentées.",
    },
  ],
};

export const cfmoto450mtV2: MotorcycleSheetV2 = {
  layout_version: 2,

  hero_subtitle:
    "Le guide LabelMoto pour comprendre les révisions, les consommables, les données techniques et les coûts d'entretien de la CFMOTO 450MT.",

  quick_facts: [
    {
      label: 'PUISSANCE',
      value: '42 ch',
    },
    {
      label: 'COUPLE',
      value: '44 Nm',
    },
    {
      label: 'POIDS FRANCE',
      value: '175 kg',
    },
    {
      label: 'SELLE',
      value: '820 mm',
    },
    {
      label: 'RÉSERVOIR',
      value: '17,5 L',
    },
    {
      label: 'PERMIS',
      value: 'A2 native',
    },
  ],

  quick_maintenance: [
    {
      label: '1ère révision',
      value: '1 000 km',
      confidence: 'official_fr',
    },
    {
      label: 'Révisions France',
      value: 'Tous les 5 000 km / 1 an',
      confidence: 'official_fr',
    },
    {
      label: 'Huile moteur',
      value: 'SAE 10W-40 · JASO MA2',
      confidence: 'official_eu',
    },
    {
      label: 'Huile avec filtre',
      value: '2,5 L',
      confidence: 'official_eu',
    },
    {
      label: 'Bougies',
      value: 'BN8RTI',
      confidence: 'official_eu',
    },
    {
      label: 'Soupapes',
      value: 'Contrôle à 40 000 km',
      confidence: 'official_eu',
    },
  ],

  service_schedule_v2: [
    {
      km: 1000,
      title: 'Révision de rodage',
      price_estimate: 'Tarif à confirmer',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Révision initiale selon carnet constructeur',
          source_type: 'official_fr',
        },
        {
          label:
            'Contrôle général des niveaux, serrages et organes de sécurité',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôle transmission, freinage et pneumatiques',
          source_type: 'official_eu',
        },
      ],

      note:
        "CFMOTO France impose une première échéance à 1 000 km sur la gamme 450.",
    },

    {
      km: 5000,
      title: 'Entretien périodique',
      price_estimate: '≈ 120 à 210 €',
      price_type: 'mixed',

      operations: [
        {
          label:
            'Huile moteur + filtre à huile',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôle / entretien du filtre à air',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôle bougies et organes moteur prévus au tableau',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôle chaîne, freins, pneus, niveaux et sécurité',
          source_type: 'official_eu',
        },
      ],

      note:
        "Fourchette de prix issue des données marché LabelMoto, pas d'un tarif national CFMOTO.",
    },

    {
      km: 10000,
      title: 'Entretien périodique renforcé',
      price_estimate: '≈ 170 à 290 €',
      price_type: 'mixed',

      operations: [
        {
          label:
            'Huile moteur + filtre à huile',
          source_type: 'official_eu',
        },
        {
          label:
            'Bougies : remplacement selon le plan européen',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles périodiques moteur et partie-cycle',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 15000,
      title: 'Entretien périodique',
      price_estimate: 'Tarif à confirmer',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Échéance périodique 5 000 km selon le plan France',
          source_type: 'official_fr',
        },
        {
          label:
            'Opérations à appliquer selon le carnet du millésime',
          source_type: 'official_fr',
        },
      ],
    },

    {
      km: 20000,
      title: 'Révision approfondie',
      price_estimate: '≈ 250 à 430 €',
      price_type: 'mixed',

      operations: [
        {
          label:
            'Huile moteur + filtre',
          source_type: 'official_eu',
        },
        {
          label:
            'Filtre à air : remplacement selon le plan européen',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles complets moteur et partie-cycle',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 25000,
      title: 'Entretien périodique',
      price_estimate: 'Tarif à confirmer',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Échéance périodique 5 000 km selon le plan France',
          source_type: 'official_fr',
        },
      ],
    },

    {
      km: 30000,
      title: 'Révision périodique',
      price_estimate: '≈ 250 à 430 €',
      price_type: 'mixed',

      operations: [
        {
          label:
            'Entretien selon calendrier constructeur',
          source_type: 'official_fr',
        },
        {
          label:
            'Contrôles moteur, transmission, freinage et partie-cycle',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 35000,
      title: 'Entretien périodique',
      price_estimate: 'Tarif à confirmer',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Échéance périodique 5 000 km selon le plan France',
          source_type: 'official_fr',
        },
      ],
    },

    {
      km: 40000,
      title: 'Révision majeure',
      price_estimate: '≈ 250 à 430 € + opérations éventuelles',
      price_type: 'mixed',

      operations: [
        {
          label:
            'Contrôle / réglage du jeu aux soupapes',
          source_type: 'official_eu',
        },
        {
          label:
            'Entretien moteur selon calendrier',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôle approfondi de la partie-cycle',
          source_type: 'official_eu',
        },
      ],
    },
  ],

  budget: {
    title:
      "Repères de coût d'entretien",

    cards: [
      {
        label:
          'Révision courante 5 000 km',

        value:
          '≈ 120–210 €',

        note:
          'Estimation / tarifs observés',
      },

      {
        label:
          'Révision 10 000 km',

        value:
          '≈ 170–290 €',

        note:
          'Selon atelier et opérations',
      },

      {
        label:
          'Révision approfondie',

        value:
          '≈ 250–430 €',

        note:
          'Hors pièces d’usure supplémentaires',
      },
    ],

    note:
      "Ces montants sont des fourchettes LabelMoto issues de données observées et estimées. Ils ne constituent pas un barème CFMOTO France. Les intervalles pour lesquels nous ne disposons pas encore d'un échantillon suffisant restent indiqués « tarif à confirmer ».",
  },

  maintenance_details: [
    {
      id: 'huile',
      title: 'Huile moteur & filtre',
      summary:
        'SAE 10W-40 · 2,5 L avec filtre',

      rows: [
        {
          label: 'Viscosité',
          value: 'SAE 10W-40',
          confidence: 'official_eu',
        },
        {
          label: 'Norme API',
          value: 'API SJ ou supérieure',
          confidence: 'official_eu',
        },
        {
          label: 'Norme moto',
          value: 'JASO MA2 privilégiée',
          confidence: 'official_eu',
        },
        {
          label: 'Quantité avec filtre',
          value: '2,5 L',
          confidence: 'official_eu',
        },
        {
          label: 'Référence filtre OEM',
          value: '0HTV-070200-7000-10',
          confidence: 'multiple_sources',
        },
        {
          label: 'Révisions France',
          value: '5 000 km ou annuelle',
          confidence: 'official_fr',
        },
      ],

      note:
        "Le manuel européen donne des prescriptions techniques détaillées tandis que CFMOTO France fixe le rythme de révision pour le marché français. Pour la garantie, le carnet lié au véhicule reste prioritaire.",
    },

    {
      id: 'filtre-air',
      title: 'Filtre à air',
      summary:
        'Surveillance renforcée en usage poussiéreux',

      rows: [
        {
          label: 'Référence OEM',
          value: '0SQV-112000-1000',
          confidence: 'multiple_sources',
        },
        {
          label: 'Contrôle / nettoyage',
          value: 'Selon tableau constructeur, plus fréquent en usage sévère',
          confidence: 'official_eu',
        },
        {
          label: 'Remplacement périodique',
          value: '20 000 km / 24 mois selon manuel EU 2024',
          confidence: 'official_eu',
        },
      ],

      note:
        "Un trail utilisé régulièrement sur piste ou en environnement poussiéreux doit faire l'objet d'une surveillance du filtre plus fréquente que le calendrier normal.",
    },

    {
      id: 'bougies',
      title: 'Bougies',
      summary:
        'TORCH BN8RTI · 2 bougies',

      rows: [
        {
          label: 'Référence',
          value: 'BN8RTI',
          confidence: 'official_eu',
        },
        {
          label: 'Quantité',
          value: '2',
          confidence: 'technical_documentation',
        },
        {
          label: 'Écartement',
          value: '0,8 à 1,0 mm',
          confidence: 'official_other_market',
        },
        {
          label: 'Couple de serrage',
          value: '12 à 15 Nm',
          confidence: 'official_other_market',
        },
        {
          label: 'Remplacement',
          value: '10 000 km selon le plan EU vérifié',
          confidence: 'official_eu',
        },
      ],
    },

    {
      id: 'soupapes',
      title: 'Jeu aux soupapes',
      summary:
        'Contrôle à 40 000 km',

      rows: [
        {
          label: 'Échéance',
          value: '40 000 km',
          confidence: 'official_eu',
        },
        {
          label: 'Intervention',
          value: 'Contrôle et réglage si nécessaire',
          confidence: 'official_eu',
        },
        {
          label: 'Réalisation',
          value: 'Atelier recommandé',
          confidence: 'technical_documentation',
        },
      ],
    },

    {
      id: 'refroidissement',
      title: 'Liquide de refroidissement',
      summary:
        'Contrôle régulier · remplacement périodique',

      rows: [
        {
          label: 'Technologie',
          value: 'Liquide compatible avec les spécifications CFMOTO',
          confidence: 'official_eu',
        },
        {
          label: 'Capacité circuit',
          value: '≈ 1,30 L + vase ≈ 0,24 L',
          confidence: 'official_eu',
        },
        {
          label: 'Remplacement',
          value: 'Selon échéance du manuel correspondant au millésime',
          confidence: 'official_eu',
        },
      ],

      note:
        "Ne pas mélanger des liquides de refroidissement de technologies incompatibles. Vérifier le manuel exact du millésime avant remplacement.",
    },

    {
      id: 'pneus',
      title: 'Pneus & pressions',
      summary:
        '2,25 bar AV · 2,25 bar AR à froid',

      rows: [
        {
          label: 'Pneu avant',
          value: '90/90-21 M/C 54H',
          confidence: 'official_eu',
        },
        {
          label: 'Pneu arrière',
          value: '140/70 R18 M/C 67H',
          confidence: 'official_eu',
        },
        {
          label: 'Alternative homologuée France',
          value: '140/80 R18',
          confidence: 'official_fr',
        },
        {
          label: 'Pression avant à froid',
          value: '225 kPa · 2,25 bar',
          confidence: 'official_eu',
        },
        {
          label: 'Pression arrière à froid',
          value: '225 kPa · 2,25 bar',
          confidence: 'official_eu',
        },
      ],
    },

    {
      id: 'chaine',
      title: 'Chaîne & transmission',
      summary:
        'Jeu 30–40 mm · surveillance régulière',

      rows: [
        {
          label: 'Jeu de chaîne',
          value: '30 à 40 mm',
          confidence: 'official_eu',
        },
        {
          label: 'Contrôle',
          value: 'Plusieurs positions de roue, moto au point mort',
          confidence: 'official_eu',
        },
        {
          label: 'Écrou axe arrière',
          value: '105 à 110 Nm',
          confidence: 'technical_documentation',
        },
        {
          label: 'Usure chaîne',
          value: 'Contrôle d’allongement selon procédure constructeur',
          confidence: 'official_eu',
        },
      ],

      note:
        "Après pluie, boue, poussière ou franchissement, contrôler plus fréquemment l'état, la tension et la lubrification de la transmission.",
    },
  ],

  /*
   * Volontairement vide :
   * huile, filtres, bougies et pneumatiques sont déjà détaillés
   * dans maintenance_details.
   *
   * Cette section ne sera utilisée que lorsqu'elle apporte
   * une information supplémentaire : référence de pièce,
   * prix observé, kit chaîne, plaquettes, batterie, etc.
   */
  consumables_v2: [],

  known_issues_v2: [
    {
      title:
        'Entretien relativement rapproché',

      description:
        "CFMOTO France prévoit une échéance tous les 5 000 km ou annuelle après la révision des 1 000 km. Ce rythme doit être intégré au coût d'utilisation, notamment pour les gros rouleurs.",

      type:
        'usage_limitation',

      confidence:
        'official_fr',

      source_note:
        'CFMOTO France · conseils d’entretien 2026',
    },

    {
      title:
        'Surveillance accrue en usage tout-terrain',

      description:
        "La chaîne, le filtre à air, les pneus et les organes de partie-cycle nécessitent une surveillance plus fréquente lorsque la moto roule régulièrement dans la poussière, la boue ou sous la pluie.",

      type:
        'manufacturer_monitoring',

      confidence:
        'official_eu',

      source_note:
        'Manuel utilisateur européen 450MT',
    },

    {
      title:
        'Recul long terme encore plus récent que les références historiques du segment',

      description:
        "La 450MT est commercialisée depuis 2024. Des exemplaires à très fort kilométrage sont déjà documentés, mais cela ne suffit pas à transformer un cas individuel en statistique générale de fiabilité. LabelMoto séparera donc les retours propriétaires des défauts officiellement documentés.",

      type:
        'usage_limitation',

      confidence:
        'multiple_sources',
    },
  ],

  warranty: {
    duration:
      '2 ans',

    coverage:
      "pièces & main-d'œuvre",

    market:
      'France',

    maintenance_requirement:
      "Pour bénéficier de la garantie commerciale constructeur, CFMOTO France indique que la moto doit être entretenue dans le réseau CFMOTO France et que chaque intervention doit être consignée dans le carnet d'entretien.",

    claim_requirement:
      "Le traitement d'une demande de garantie passe exclusivement par un concessionnaire du réseau CFMOTO France.",

    original_parts_note:
      "CFMOTO met en avant l'utilisation des pièces et procédures adaptées dans son réseau. Conserver les références des pièces utilisées est recommandé, mais l'utilisation de pièces d'origine hors réseau ne remplace pas à elle seule l'exigence d'entretien dans le réseau pour la garantie commerciale CFMOTO France.",

    invoice_advice:
      "Conservez systématiquement le carnet d'entretien complété ainsi que toutes les factures de révision, de pièces et de réparation.",

    legal_warranty_note:
      "La garantie commerciale du constructeur est distincte des garanties légales applicables.",

    source_label:
      'CFMOTO France · Garantie moto · vérifié le 23/08/2026',
  },

  equivalents_v2: [
    {
      name:
        'Honda NX500',

      reason:
        'Plus routière · réseau très dense',
    },

    {
      name:
        'Royal Enfield Himalayan 450',

      reason:
        'Trail aventure accessible · philosophie proche',
    },

    {
      name:
        'Voge 525DSX',

      reason:
        'Alternative équipée et polyvalente',
    },

    {
      name:
        'Kove 450 Rally',

      reason:
        'Plus spécialisée tout-terrain',
    },
  ],

  verdict: {
    score:
      8.5,

    title:
      'Une vraie petite aventurière A2',

    text:
      "La CFMOTO 450MT combine un moteur accessible, un poids contenu pour la catégorie, des roues de 21 et 18 pouces et des suspensions longue course. Elle constitue une proposition très cohérente pour un motard A2 qui veut alterner route et chemins. Son principal compromis côté possession est un calendrier d'entretien relativement rapproché à 5 000 km sur le marché français.",

    strengths: [
      'Polyvalence',
      'A2 native',
      'Poids France 175 kg',
      'Roues 21 / 18',
      'Suspensions KYB',
    ],

    weaknesses: [
      'Révisions tous les 5 000 km',
      'Recul long terme encore récent',
    ],
  },

  data_quality: {
    market:
      'France / Europe',

    model_year:
      '2024–2026',

    manufacturer_fr_verified:
      true,

    european_manual_verified:
      true,

    technical_documentation_verified:
      true,

    consumables_verified:
      true,

    recall_checked:
      false,

    pricing_type:
      'mixed',

    last_verified:
      '23/08/2026',

    sources: [
      {
        label:
          'CFMOTO France · fiche modèle 450MT',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.cf-moto.fr/moto/modeles/450mt/',

        note:
          'Source prioritaire pour les caractéristiques actuellement commercialisées en France.',
      },

      {
        label:
          "CFMOTO France · conseils d'entretien",

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.cf-moto.fr/moto/conseils-entretien/',

        note:
          'Confirme 1 000 km puis tous les 5 000 km ou annuellement pour la gamme 450.',
      },

      {
        label:
          'CFMOTO France · garantie moto',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.cf-moto.fr/moto/garantie/',

        note:
          "Confirme la garantie 2 ans de la 450MT et les conditions liées au réseau.",
      },

      {
        label:
          'CFMOTO 450MT · Owner’s Manual EU 2024',

        type:
          'official_eu',

        market:
          'Europe',

        model_year:
          '2024',

        url:
          'https://cfmoto.se/wp-content/uploads/2025/01/450MT-CF400-8-8F6AQV-380101-6201-12-EU23C-OM-20240313.pdf',

        note:
          "Source technique pour huile, quantités, pneumatiques et entretien détaillé.",
      },

      {
        label:
          'Catalogues pièces CFMOTO · CF400-8',

        type:
          'multiple_sources',

        market:
          'International',

        model_year:
          '2024–2026',

        note:
          "Utilisés pour recouper les références OEM de filtre à huile et filtre à air.",
      },
    ],
  },
};

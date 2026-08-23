import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
export const cfmoto450srDisplayData = {
  modelName: 'CFMOTO 450SR',
  model: 'CFMOTO 450SR',
  year: '2023+',
  category: 'Sportive A2',
  imageUrl: '/images/entretien-cfmoto-450sr.webp',

  introduction:
    "La CFMOTO 450SR est une sportive A2 légère à bicylindre parallèle. Pour la France, CFMOTO prévoit une première révision à 1 000 km puis un entretien tous les 5 000 km ou annuellement. Sa mécanique demande un suivi relativement régulier, notamment de l'huile, de la transmission secondaire et des consommables en conduite sportive.",

  engine: {
    type:
      'Bicylindre en ligne, 4 temps, refroidissement liquide, DOHC, vilebrequin calé à 270°',

    displacement:
      '449,5 cm³',

    power:
      '47,5 ch (35 kW) à 10 000 tr/min',

    torque:
      '39 Nm à 7 600 tr/min',

    bridage:
      'A2 native · aucun bridage nécessaire',

    alimentation:
      'Injection électronique · accélérateur mécanique',
  },

  cycleParts: {
    frame:
      'Cadre tubulaire acier',

    frontBrake:
      'Simple disque Ø 320 mm · étrier Brembo 4 pistons · ABS',

    rearBrake:
      'Simple disque Ø 220 mm · étrier 1 piston · ABS',

    frontSuspension:
      'Fourche inversée Ø 37 mm',

    rearSuspension:
      'Mono-amortisseur',

    frontTire:
      '110/70 R17',

    rearTire:
      '150/60 R17',
  },

  dimensions: {
    wetWeight: '179 kg',
    seatHeight: '785 mm',
    tank: '14 L',
  },

  faq: [
    {
      question:
        'Quand faire les révisions de la CFMOTO 450SR ?',

      answer:
        "CFMOTO France prévoit une première révision à 1 000 km puis une révision tous les 5 000 km ou annuellement, selon la première échéance atteinte.",
    },

    {
      question:
        'Quelle huile moteur utiliser sur la CFMOTO 450SR ?',

      answer:
        "Le manuel utilisateur européen indique une huile SAE 10W-40 répondant au minimum à API SJ et à la norme JASO MA2.",
    },

    {
      question:
        "Quelle quantité d'huile faut-il pour la 450SR ?",

      answer:
        "Le manuel utilisateur européen 2024 indique 2,5 L lors d'un remplacement avec filtre. Une table de maintenance CFMOTO Italie mentionne 2,3 L : le manuel correspondant au millésime et au VIN de la moto reste donc prioritaire.",
    },

    {
      question:
        'Quelle bougie utilise la CFMOTO 450SR ?',

      answer:
        "La documentation CFMOTO indique une TORCH BN8RTI, avec un écartement de 0,8 à 1,0 mm.",
    },

    {
      question:
        'Quand contrôler le jeu aux soupapes ?',

      answer:
        "La table de maintenance CFMOTO prévoit un contrôle à 40 000 km. Les valeurs à froid documentées sont de 0,10 à 0,15 mm à l'admission et de 0,25 à 0,31 mm à l'échappement.",
    },

    {
      question:
        'La CFMOTO 450SR est-elle compatible avec le permis A2 ?',

      answer:
        "Oui. La version commercialisée actuellement en France développe 35 kW et est proposée comme modèle A2 sans bridage nécessaire.",
    },

    {
      question:
        'Existe-t-il un rappel concernant la CFMOTO 450SR ?',

      answer:
        "Oui. CFMOTO Europe a publié en 2024 un rappel concernant le support du module T-Box sur les 450SR et 450SR S. Il est recommandé de faire vérifier le VIN auprès du réseau CFMOTO afin de confirmer si la campagne a été réalisée.",
    },

    {
      question:
        'Quelle pression de pneus utiliser ?',

      answer:
        "Le manuel 450SR indique à froid 225 kPa (2,25 bar) à l'avant et 245 kPa (2,45 bar) à l'arrière.",
    },
  ],

  longevityTips: [
    "Respecter la première révision à 1 000 km puis l'échéance France tous les 5 000 km ou annuellement.",
    "Contrôler régulièrement le niveau d'huile, particulièrement après une utilisation sportive prolongée.",
    "Contrôler et lubrifier régulièrement la chaîne ; la documentation prévoit un contrôle/lubrification tous les 1 000 km.",
    "Contrôler plus fréquemment pneus, freins et transmission lors d'une utilisation sportive ou intensive.",
    "Réduire les intervalles de maintenance en cas d'usage sévère conformément aux recommandations du manuel.",
    "Faire vérifier auprès d'un concessionnaire que la campagne T-Box 2024 a bien été réalisée lorsque le VIN est concerné.",
  ],

  conclusion:
    "La 450SR combine une vraie architecture de sportive, une puissance adaptée au permis A2 et des coûts d'entretien encore contenus. Son calendrier tous les 5 000 km est plus rapproché que celui de certaines concurrentes japonaises, mais les opérations restent conventionnelles. Un suivi sérieux de l'huile, de la transmission, des freins et des échéances constructeur est essentiel pour préserver son agrément.",
};


export const cfmoto450srV2: MotorcycleSheetV2 = {
  layout_version: 2,

  hero_subtitle:
    "Le guide LabelMoto de la CFMOTO 450SR : révisions, huile, filtres, bougies, soupapes, transmission, coûts et rappel constructeur.",


  quick_facts: [
    {
      label: 'PUISSANCE',
      value: '47,5 ch',
    },
    {
      label: 'COUPLE',
      value: '39 Nm',
    },
    {
      label: 'POIDS',
      value: '179 kg',
    },
    {
      label: 'SELLE',
      value: '785 mm',
    },
    {
      label: 'RÉSERVOIR',
      value: '14 L',
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
      label: 'Huile',
      value: 'SAE 10W-40 · JASO MA2',
      confidence: 'official_eu',
    },
    {
      label: 'Quantité avec filtre',
      value: '2,5 L · manuel EU 2024',
      confidence: 'official_eu',
    },
    {
      label: 'Bougie',
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
            'Huile moteur et filtre selon plan de maintenance',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles généraux, serrages, niveaux et transmission',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 5000,
      title: 'Entretien périodique',
      price_estimate: '≈ 120–210 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Révision périodique prévue par CFMOTO France',
          source_type: 'official_fr',
        },
        {
          label:
            'Huile moteur et filtre',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles généraux et filtre à air',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 10000,
      title: 'Entretien renforcé',
      price_estimate: '≈ 170–290 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Huile moteur et filtre',
          source_type: 'official_eu',
        },
        {
          label:
            'Bougie selon tableau de maintenance',
          source_type: 'official_eu',
        },
        {
          label:
            'Filtre à air selon état / échéance',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles freinage, cycle et transmission',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 15000,
      title: 'Entretien périodique',
      price_estimate: '≈ 120–210 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Échéance périodique 5 000 km',
          source_type: 'official_fr',
        },
      ],
    },

    {
      km: 20000,
      title: 'Grande révision',
      price_estimate: '≈ 250–430 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Entretien moteur et consommables selon tableau',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles complets partie-cycle et freinage',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 25000,
      title: 'Entretien périodique',
      price_estimate: '≈ 120–210 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Échéance périodique 5 000 km',
          source_type: 'official_fr',
        },
      ],
    },

    {
      km: 30000,
      title: 'Entretien majeur',
      price_estimate: '≈ 250–430 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Entretien moteur et contrôles selon tableau constructeur',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 35000,
      title: 'Entretien périodique',
      price_estimate: '≈ 120–210 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Échéance périodique 5 000 km',
          source_type: 'official_fr',
        },
      ],

      note:
        "Le liquide de refroidissement et le liquide de frein suivent également une échéance calendaire de 2 ans. Leur remplacement peut donc s'ajouter à cette révision selon l'âge de la moto.",
    },

    {
      km: 40000,
      title: 'Contrôle majeur',
      price_estimate:
        '≈ 250–430 € + réglage soupapes si nécessaire',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Contrôle du jeu aux soupapes',
          source_type: 'official_eu',
        },
        {
          label:
            'Entretien moteur complet selon tableau constructeur',
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
          'Révision périodique 5 000 km',
        value:
          '≈ 120–210 €',
        note:
          'Estimation LabelMoto / tarifs observés',
      },
      {
        label:
          'Révision 10 000 km',
        value:
          '≈ 170–290 €',
        note:
          'Estimation LabelMoto',
      },
      {
        label:
          'Grande révision',
        value:
          '≈ 250–430 €',
        note:
          'Hors opération supplémentaire importante',
      },
    ],
  },


  maintenance_details: [
    {
      id: 'huile',
      title: 'Huile moteur & filtre',
      summary:
        'SAE 10W-40 · JASO MA2 · 2,5 L avec filtre',

      rows: [
        {
          label: 'Viscosité',
          value: 'SAE 10W-40',
          confidence: 'official_eu',
        },
        {
          label: 'Norme',
          value: 'API SJ ou supérieur · JASO MA2',
          confidence: 'official_eu',
        },
        {
          label: 'Quantité avec filtre',
          value: '2,5 L · manuel utilisateur EU 2024',
          confidence: 'official_eu',
        },
        {
          label: 'Filtre à huile OEM',
          value: '0700-070200',
          confidence: 'technical_documentation',
        },
        {
          label: 'Bouchon de vidange',
          value: '25 Nm',
          confidence: 'official_other_market',
        },
      ],

      note:
        "Une table de maintenance CFMOTO Italie indique 2,3 L alors que le manuel utilisateur européen 2024 indique 2,5 L avec filtre. Le manuel correspondant au millésime exact et au VIN reste prioritaire.",
    },

    {
      id: 'air',
      title: 'Filtre à air',
      summary:
        'Contrôle périodique · remplacement selon tableau / état',

      rows: [
        {
          label: 'Référence OEM',
          value: '0SQV-112000-1000',
          confidence: 'technical_documentation',
        },
        {
          label: 'Inspection',
          value:
            'Selon tableau périodique, plus fréquemment en environnement poussiéreux',
          confidence: 'official_eu',
        },
        {
          label: 'Usage sévère',
          value:
            'Remplacement plus fréquent sur routes poussiéreuses',
          confidence: 'official_eu',
        },
      ],
    },

    {
      id: 'bougie',
      title: 'Bougie',
      summary:
        'BN8RTI · 0,8–1,0 mm · 12–15 Nm',

      rows: [
        {
          label: 'Type',
          value: 'TORCH BN8RTI',
          confidence: 'official_eu',
        },
        {
          label: 'Écartement',
          value: '0,8 à 1,0 mm',
          confidence: 'official_eu',
        },
        {
          label: 'Couple',
          value: '12 à 15 Nm',
          confidence: 'official_eu',
        },
        {
          label: 'Échéance',
          value: 'Selon tableau constructeur',
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
          label: 'Admission à froid',
          value: '0,10 à 0,15 mm',
          confidence: 'official_eu',
        },
        {
          label: 'Échappement à froid',
          value: '0,25 à 0,31 mm',
          confidence: 'official_eu',
        },
        {
          label: 'Intervention',
          value:
            'Contrôle et réglage si nécessaire',
          confidence: 'official_eu',
        },
      ],

      note:
        "Cette intervention demande l'accès à la distribution et doit être réalisée selon la procédure atelier.",
    },

    {
      id: 'refroidissement',
      title: 'Liquide de refroidissement',
      summary:
        'Liquide organique · remplacement tous les 2 ans',

      rows: [
        {
          label: 'Type',
          value: 'Liquide de refroidissement organique',
          confidence: 'official_eu',
        },
        {
          label: 'Capacité documentée',
          value:
            '1 100 mL + environ 90 à 150 mL de vase',
          confidence: 'official_eu',
        },
        {
          label: 'Remplacement',
          value: 'Tous les 2 ans',
          confidence: 'official_eu',
        },
      ],
    },

    {
      id: 'freinage',
      title: 'Freinage & liquide de frein',
      summary:
        'DOT 4 · remplacement tous les 2 ans',

      rows: [
        {
          label: 'Liquide',
          value: 'DOT 4',
          confidence: 'official_eu',
        },
        {
          label: 'Remplacement',
          value: 'Tous les 2 ans',
          confidence: 'official_eu',
        },
        {
          label: 'Avant',
          value:
            'Disque 320 mm · Brembo 4 pistons',
          confidence: 'official_fr',
        },
        {
          label: 'Arrière',
          value:
            'Disque 220 mm · 1 piston',
          confidence: 'official_fr',
        },
      ],

      note:
        "En conduite sportive, l'usure des plaquettes et la température du liquide peuvent augmenter fortement.",
    },

    {
      id: 'pneus',
      title: 'Pneus & pressions',
      summary:
        '110/70 R17 · 150/60 R17',

      rows: [
        {
          label: 'Avant',
          value: '110/70 R17',
          confidence: 'official_fr',
        },
        {
          label: 'Arrière',
          value: '150/60 R17',
          confidence: 'official_fr',
        },
        {
          label: 'Pression avant à froid',
          value: '225 kPa · 2,25 bar',
          confidence: 'official_eu',
        },
        {
          label: 'Pression arrière à froid',
          value: '245 kPa · 2,45 bar',
          confidence: 'official_eu',
        },
      ],
    },

    {
      id: 'chaine',
      title: 'Chaîne & transmission',
      summary:
        'Contrôle et lubrification tous les 1 000 km',

      rows: [
        {
          label: 'Contrôle / lubrification',
          value: 'Tous les 1 000 km',
          confidence: 'official_eu',
        },
        {
          label: 'Après pluie / lavage',
          value:
            'Contrôler et lubrifier plus fréquemment',
          confidence: 'official_eu',
        },
        {
          label: 'Usage sportif',
          value:
            'Surveillance renforcée de la tension et de l’usure',
          confidence: 'multiple_sources',
        },
      ],

      note:
        "La tension exacte doit être contrôlée selon le manuel correspondant au millésime ; elle n'est volontairement pas renseignée ici tant que la valeur européenne applicable n'est pas recoupée avec suffisamment de certitude.",
    },
  ],


  consumables_v2: [],


  known_issues_v2: [
    {
      title:
        'Rappel constructeur T-Box 2024',

      description:
        "CFMOTO Europe a publié un rappel concernant les 450SR et 450SR S : la bague en caoutchouc du support T-Box peut se détériorer sous l'effet des vibrations et permettre au module de se déplacer, avec un risque de gêne de la direction. La campagne prévoit la pose ou la modification du support. Faire vérifier le VIN dans le réseau CFMOTO.",

      type:
        'recall',

      confidence:
        'official_eu',
    },

    {
      title:
        'Entretien tous les 5 000 km',

      description:
        "CFMOTO France prévoit une révision tous les 5 000 km ou annuellement après celle des 1 000 km. C'est un intervalle relativement rapproché qu'il faut intégrer au coût d'usage.",

      type:
        'manufacturer_monitoring',

      confidence:
        'official_fr',
    },

    {
      title:
        'Consommables sollicités en conduite sportive',

      description:
        "La géométrie sportive et l'utilisation dynamique peuvent accélérer l'usure des pneus, plaquettes et transmission. Il s'agit avant tout d'un effet d'usage et non d'un défaut mécanique identifié.",

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
      "CFMOTO France demande que l'entretien soit effectué dans le réseau agréé et que le carnet soit renseigné après chaque passage.",

    legal_warranty_note:
      "La garantie commerciale constructeur est distincte des garanties légales. Les conditions du carnet de garantie remis avec la moto restent prioritaires.",
  },


  equivalents_v2: [
    {
      name: 'Kawasaki Ninja 500',
      reason:
        'Sportive A2 polyvalente · réseau très dense',
    },
    {
      name: 'Honda CBR500R',
      reason:
        'Plus routière · réputation éprouvée',
    },
    {
      name: 'Aprilia RS 457',
      reason:
        'Sportive A2 moderne · philosophie proche',
    },
    {
      name: 'Yamaha R7',
      reason:
        'Plus puissante et plus radicale',
    },
  ],


  verdict: {
    score: 8.4,

    title:
      'Une vraie sportive A2 bien équipée',

    text:
      "La 450SR offre une présentation valorisante, un bicylindre agréable et un équipement convaincant pour une sportive A2. Son entretien tous les 5 000 km demande davantage de passages en atelier que certaines concurrentes, mais les opérations restent classiques. La campagne T-Box doit simplement être vérifiée sur les exemplaires concernés.",

    strengths: [
      'A2 native',
      'Moteur bicylindre 270°',
      'Freinage Brembo avant',
      'Équipement complet',
      'Coûts des révisions courantes encore raisonnables',
    ],

    weaknesses: [
      'Révisions tous les 5 000 km',
      'Rappel T-Box à vérifier selon VIN',
      "Moins de recul à très fort kilométrage que certaines références japonaises",
    ],
  },


  data_quality: {
    market:
      'France / Europe',

    model_year:
      '2023–2026',

    manufacturer_fr_verified:
      true,

    european_manual_verified:
      true,

    technical_documentation_verified:
      true,

    consumables_verified:
      true,

    recall_checked:
      true,


    last_verified:
      '23/08/2026',

    sources: [
      {
        label:
          'CFMOTO France · 450SR',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.cf-moto.fr/moto/modeles/450sr/',

        note:
          'Caractéristiques techniques, A2, prix et garantie.',
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
          '1 000 km puis tous les 5 000 km ou annuellement.',
      },

      {
        label:
          'CFMOTO 450SR Owner’s Manual 2024',

        type:
          'official_eu',

        market:
          'Europe',

        model_year:
          '2024',

        url:
          'https://cfmoto.se/wp-content/uploads/2024/05/CFMOTO-450SR-2024.pdf',

        note:
          'Huile, bougie, pressions, refroidissement et procédures utilisateur.',
      },

      {
        label:
          'CFMOTO Italy · table de maintenance 450SR',

        type:
          'official_eu',

        market:
          'Europe',

        model_year:
          '2025',

        url:
          'https://cfmotoitaly.it/wp-content/uploads/Tavola-di-manutenzione-CFMOTO-450SR_2300504.pdf',

        note:
          'Table détaillée : soupapes, fluides, chaîne et échéances.',
      },

      {
        label:
          'CFMOTO Europe · rappel 450SR / 450SR S T-Box',

        type:
          'official_eu',

        market:
          'Tous marchés',

        model_year:
          '2024',

        url:
          'https://cfmoto-motorcycle.eu/en/service/recall',

        note:
          'Rappel T-Box déclaré valable pour tous les marchés.',
      },

      {
        label:
          'CFMOTO 450SR · catalogue pièces CF400-6',

        type:
          'technical_documentation',

        market:
          'International',

        model_year:
          '2024',

        note:
          "Références filtre à huile et filtre à air.",
      },

      {
        label:
          'CSV LabelMoto · CFMOTO 450SR',

        type:
          'estimate',

        market:
          'Europe',

        model_year:
          '2025',

        note:
          "Utilisé uniquement comme point de départ pour les estimations de coûts. La colonne fiabilité du CSV mesure la confiance de la donnée et non la fiabilité mécanique de la moto.",
      },
    ],
  },
};
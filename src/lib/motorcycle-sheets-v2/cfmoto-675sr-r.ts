import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const cfmoto675srrDisplayData = {
  modelName: 'CFMOTO 675SR-R',
  model: 'CFMOTO 675SR-R',
  year: '2025+',
  category: 'Sportive A2 / A',
  imageUrl: '/images/entretien-cfmoto-675sr-r.webp',

  introduction:
    "La CFMOTO 675SR-R est une sportive trois cylindres de 674 cm³ développant 89 ch en version libre. Pour la France, elle est également proposée en version A2 bridée à 35 kW / 47,5 ch. CFMOTO France prévoit une première révision à 1 000 km puis un entretien tous les 5 000 km ou annuellement. Son utilisation sportive impose une attention particulière à l'huile, aux freins, aux pneumatiques et à la transmission.",

  engine: {
    type:
      '3 cylindres en ligne, 4 temps, refroidissement liquide, DOHC',

    displacement:
      '674 cm³',

    power:
      '89 ch (66 kW) à 11 000 tr/min',

    torque:
      '70 Nm à 8 250 tr/min',

    bridage:
      'Permis A2 : version bridée 35 kW / 47,5 ch · version A : 89 ch',

    alimentation:
      'Injection électronique · accélérateur mécanique',
  },

  cycleParts: {
    frame:
      'Cadre tubulaire en acier',

    frontBrake:
      'Double disque Ø 300 mm · étriers J.Juan 4 pistons · ABS',

    rearBrake:
      'Simple disque Ø 240 mm · étrier J.Juan 1 piston · ABS',

    frontSuspension:
      'Fourche inversée KYB Ø 41 mm réglable',

    rearSuspension:
      'Mono-amortisseur KYB réglable',

    frontTire:
      '120/70 ZR17',

    rearTire:
      '180/55 ZR17',
  },

  dimensions: {
    wetWeight: '195 kg',
    seatHeight: '810 mm',
    tank: '15 L',
  },

  faq: [
    {
      question:
        'Quand faire les révisions de la CFMOTO 675SR-R ?',

      answer:
        "CFMOTO France prévoit une première révision à 1 000 km puis une révision tous les 5 000 km ou annuellement, selon la première échéance atteinte.",
    },

    {
      question:
        'Quelle huile moteur utiliser sur la CFMOTO 675SR-R ?',

      answer:
        "Le manuel utilisateur européen indique une huile SAE 10W-40 répondant à API SN ou supérieur, avec JASO MA2 comme spécification recommandée.",
    },

    {
      question:
        "Quelle quantité d'huile faut-il pour la 675SR-R ?",

      answer:
        "Le manuel utilisateur européen indique 3,1 L lors du remplacement de l'huile avec le filtre.",
    },

    {
      question:
        'Quelle bougie utilise la CFMOTO 675SR-R ?',

      answer:
        "Le manuel européen indique une TORCH BN8RTI avec un écartement de 0,8 à 1,0 mm et un couple de serrage de 12 à 15 Nm.",
    },

    {
      question:
        'Quand contrôler le jeu aux soupapes ?',

      answer:
        "La documentation européenne prévoit le contrôle du jeu aux soupapes à 40 000 km. Les valeurs à froid documentées sont de 0,10 à 0,15 mm à l'admission et de 0,25 à 0,31 mm à l'échappement.",
    },

    {
      question:
        'La CFMOTO 675SR-R est-elle compatible avec le permis A2 ?',

      answer:
        "Oui. La 675SR-R est proposée en France en version bridée à 35 kW / 47,5 ch pour le permis A2 et en version pleine puissance de 89 ch pour le permis A. Le passage d'une configuration à l'autre doit être réalisé dans le réseau CFMOTO.",
    },

    {
      question:
        'Quelle pression de pneus utiliser sur la 675SR-R ?',

      answer:
        "Le manuel européen indique, pneus froids, 230 kPa (2,3 bar) à l'avant et 260 kPa (2,6 bar) à l'arrière.",
    },

    {
      question:
        'Quelle tension de chaîne faut-il sur la 675SR-R ?',

      answer:
        "Le manuel utilisateur européen indique une flèche de chaîne standard comprise entre 30 et 40 mm.",
    },
  ],

  longevityTips: [
    "Respecter la première révision à 1 000 km puis l'échéance France tous les 5 000 km ou annuellement.",
    "Contrôler régulièrement le niveau d'huile ; le manuel prévoit son remplacement tous les 5 000 km ou 6 mois après le rodage.",
    "Contrôler et lubrifier la chaîne au minimum tous les 1 000 km et après roulage sous la pluie ou lavage.",
    "Respecter une flèche de chaîne de 30 à 40 mm conformément au manuel européen.",
    "Contrôler fréquemment les pneus et le freinage lorsque la moto est utilisée de manière sportive.",
    "Réduire les intervalles de maintenance de 50 % lorsque les conditions d'utilisation sévère définies dans le manuel sont réunies.",
  ],

  conclusion:
    "La 675SR-R associe un trois cylindres performant, un châssis sportif et un équipement complet à une disponibilité en permis A2. Son calendrier de révision tous les 5 000 km reste relativement rapproché. Comme sur toute sportive récente, un suivi rigoureux de l'huile, de la transmission, des pneus et du freinage est particulièrement important, tandis que le recul à très fort kilométrage reste encore limité.",
};


export const cfmoto675srrV2: MotorcycleSheetV2 = {
  layout_version: 2,

  hero_subtitle:
    "Le guide LabelMoto de la CFMOTO 675SR-R : révisions, huile, filtres, bougies, soupapes, transmission, coûts et données constructeur.",


  quick_facts: [
    {
      label: 'PUISSANCE',
      value: '89 ch',
    },
    {
      label: 'COUPLE',
      value: '70 Nm',
    },
    {
      label: 'POIDS',
      value: '195 kg',
    },
    {
      label: 'SELLE',
      value: '810 mm',
    },
    {
      label: 'RÉSERVOIR',
      value: '15 L',
    },
    {
      label: 'PERMIS',
      value: 'A2 bridée / A',
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
      value: 'SAE 10W-40 · API SN+ · JASO MA2',
      confidence: 'official_eu',
    },
    {
      label: 'Quantité avec filtre',
      value: '3,1 L',
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
            'Révision initiale selon le programme constructeur',
          source_type: 'official_fr',
        },
        {
          label:
            'Remplacement huile moteur et filtre',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles généraux, serrages, niveaux, freinage et transmission',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 5000,
      title: 'Entretien périodique',
      price_estimate: '≈ 160–280 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Révision périodique prévue par CFMOTO France',
          source_type: 'official_fr',
        },
        {
          label:
            'Remplacement de l’huile moteur',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôle / nettoyage du filtre à air',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles généraux, transmission et niveaux',
          source_type: 'official_eu',
        },
      ],

      note:
        "Le manuel propriétaire EU 2024 associe huile et filtre tous les 5 000 km, tandis que la table de maintenance CFMOTO Italie 2025 prévoit le filtre à huile à 10 000 km après le premier remplacement. Le programme correspondant au VIN et au millésime reste prioritaire.",
    },

    {
      km: 10000,
      title: 'Entretien renforcé',
      price_estimate: '≈ 220–360 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Huile moteur et filtre selon tableau applicable',
          source_type: 'official_eu',
        },
        {
          label:
            'Filtre à air selon échéance du programme applicable',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles freinage, partie-cycle et transmission',
          source_type: 'official_eu',
        },
      ],

      note:
        "Les documentations européennes disponibles présentent des différences d'échéance pour le filtre à air et la bougie. Ces opérations doivent être confirmées avec le programme correspondant au millésime et au VIN.",
    },

    {
      km: 15000,
      title: 'Entretien périodique',
      price_estimate: '≈ 160–280 €',
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
      price_estimate: '≈ 320–520 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Entretien moteur et consommables selon tableau constructeur',
          source_type: 'official_eu',
        },
        {
          label:
            'Contrôles complets de la partie-cycle et du freinage',
          source_type: 'official_eu',
        },
      ],
    },

    {
      km: 25000,
      title: 'Entretien périodique',
      price_estimate: '≈ 160–280 €',
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
      price_estimate: '≈ 320–520 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Entretien moteur et contrôles selon tableau constructeur',
          source_type: 'official_eu',
        },
        {
          label:
            'Bougies selon la table de maintenance européenne applicable',
          source_type: 'official_eu',
        },
      ],

      note:
        "La table CFMOTO Italie 2025 indique un remplacement des bougies tous les 30 000 km, alors que le manuel propriétaire EU 2024 indique 10 000 km. Vérifier le programme correspondant au VIN.",
    },

    {
      km: 35000,
      title: 'Entretien périodique',
      price_estimate: '≈ 160–280 €',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Échéance périodique 5 000 km',
          source_type: 'official_fr',
        },
        {
          label:
            'Liquide de refroidissement selon échéance kilométrique ou calendaire',
          source_type: 'official_eu',
        },
      ],

      note:
        "Le manuel européen prévoit le remplacement du liquide de refroidissement à 35 000 km ou 24 mois, selon la première échéance atteinte.",
    },

    {
      km: 40000,
      title: 'Contrôle majeur',
      price_estimate:
        '≈ 320–520 € + réglage soupapes si nécessaire',
      price_type: 'estimate',

      operations: [
        {
          label:
            'Contrôle et réglage éventuel du jeu aux soupapes',
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
          '≈ 160–280 €',
        note:
          'Estimation LabelMoto',
      },
      {
        label:
          'Révision 10 000 km',
        value:
          '≈ 220–360 €',
        note:
          'Estimation LabelMoto',
      },
      {
        label:
          'Grande révision',
        value:
          '≈ 320–520 €',
        note:
          'Estimation LabelMoto · hors opération supplémentaire importante',
      },
    ],
  },


  maintenance_details: [
    {
      id: 'huile',
      title: 'Huile moteur & filtre',
      summary:
        'SAE 10W-40 · API SN+ · JASO MA2 · 3,1 L avec filtre',

      rows: [
        {
          label: 'Viscosité',
          value: 'SAE 10W-40',
          confidence: 'official_eu',
        },
        {
          label: 'Norme',
          value: 'API SN ou supérieur · JASO MA2 recommandé',
          confidence: 'official_eu',
        },
        {
          label: 'Quantité avec filtre',
          value: '3,1 L',
          confidence: 'official_eu',
        },
        {
          label: 'Filtre à huile OEM',
          value: '0700-070200-10001',
          confidence: 'technical_documentation',
        },
        {
          label: 'Bouchon de vidange',
          value: '25 Nm',
          confidence: 'official_eu',
        },
        {
          label: 'Huile moteur',
          value: 'Remplacement tous les 5 000 km ou 6 mois après rodage',
          confidence: 'official_eu',
        },
        {
          label: 'Filtre à huile',
          value:
            'Périodicité à confirmer selon millésime : manuel EU 2024 = 5 000 km · table Italie 2025 = 10 000 km après rodage',
          confidence: 'official_eu',
        },
      ],

      note:
        "CFMOTO France fixe les visites générales à 5 000 km ou annuellement. Le manuel européen ajoute une échéance de 6 mois pour l'huile. Les tableaux européens disponibles ne concordent pas totalement sur la périodicité du filtre à huile ; le carnet applicable au VIN reste prioritaire.",
    },

    {
      id: 'air',
      title: 'Filtre à air',
      summary:
        'Contrôle / nettoyage tous les 5 000 km · remplacement selon tableau applicable',

      rows: [
        {
          label: 'Référence OEM',
          value: '0HTV-112000-7000',
          confidence: 'technical_documentation',
        },
        {
          label: 'Contrôle / nettoyage',
          value: 'Tous les 5 000 km',
          confidence: 'official_eu',
        },
        {
          label: 'Remplacement',
          value:
            '10 000 km selon table Italie 2025 · 20 000 km / 24 mois dans le manuel EU 2024',
          confidence: 'official_eu',
        },
        {
          label: 'Usage poussiéreux',
          value:
            'Entretien plus fréquent',
          confidence: 'official_eu',
        },
      ],

      note:
        "Les deux documentations européennes disponibles ne donnent pas la même échéance de remplacement. Pour une commande de pièce ou une intervention, vérifier le VIN et le programme d'entretien correspondant au millésime.",
    },

    {
      id: 'bougie',
      title: 'Bougies',
      summary:
        'TORCH BN8RTI · 0,8–1,0 mm · 12–15 Nm',

      rows: [
        {
          label: 'Type',
          value: 'TORCH BN8RTI',
          confidence: 'official_eu',
        },
        {
          label: 'Quantité',
          value: '3',
          confidence: 'technical_documentation',
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
          label: 'Remplacement',
          value:
            '30 000 km selon table Italie 2025 · manuel EU 2024 : 10 000 km',
          confidence: 'official_eu',
        },
      ],

      note:
        "Une différence importante existe entre le manuel propriétaire européen 2024 et la table de maintenance CFMOTO Italie révisée en 2025. Ne pas généraliser une échéance sans vérifier le carnet correspondant au VIN.",
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
        "Le contrôle et le réglage du jeu aux soupapes nécessitent l'accès à la distribution et doivent être réalisés selon la procédure technique CFMOTO.",
    },

    {
      id: 'refroidissement',
      title: 'Liquide de refroidissement',
      summary:
        'OAT / Si-OAT compatible · 35 000 km ou 24 mois',

      rows: [
        {
          label: 'Technologie',
          value:
            'OAT · compatible Si-OAT / G30 / G40 / G12++ selon manuel',
          confidence: 'official_eu',
        },
        {
          label: 'Capacité',
          value:
            '1,7 L dans le circuit + 284 ± 20 mL dans le réservoir (≈ 1,98 L au total)',
          confidence: 'official_eu',
        },
        {
          label: 'Remplacement',
          value: '35 000 km ou 24 mois',
          confidence: 'official_eu',
        },
        {
          label: 'Mélange',
          value:
            'Ne pas mélanger des liquides incompatibles',
          confidence: 'official_eu',
        },
      ],
    },

    {
      id: 'freinage',
      title: 'Freinage & liquide de frein',
      summary:
        'DOT 4 · liquide tous les 2 ans',

      rows: [
        {
          label: 'Liquide',
          value: 'DOT 4',
          confidence: 'official_eu',
        },
        {
          label: 'Remplacement liquide',
          value: 'Tous les 24 mois',
          confidence: 'official_eu',
        },
        {
          label: 'Contrôle système',
          value: '10 000 km / 12 mois',
          confidence: 'official_eu',
        },
        {
          label: 'Limite disque avant',
          value: '4 mm',
          confidence: 'official_eu',
        },
        {
          label: 'Limite disque arrière',
          value: '4 mm',
          confidence: 'official_eu',
        },
        {
          label: 'Épaisseur minimale plaquettes',
          value: '1 mm',
          confidence: 'official_eu',
        },
        {
          label: 'Avant',
          value:
            'Double disque Ø 300 mm · J.Juan 4 pistons',
          confidence: 'official_fr',
        },
        {
          label: 'Arrière',
          value:
            'Disque Ø 240 mm · J.Juan 1 piston',
          confidence: 'official_fr',
        },
      ],

      note:
        "Une utilisation intensive ou sur circuit peut augmenter fortement la température du système et l'usure des plaquettes.",
    },

    {
      id: 'pneus',
      title: 'Pneus & pressions',
      summary:
        '120/70 ZR17 · 180/55 ZR17',

      rows: [
        {
          label: 'Avant',
          value: '120/70 ZR17 M/C 58W',
          confidence: 'official_eu',
        },
        {
          label: 'Arrière',
          value: '180/55 ZR17 M/C 73W',
          confidence: 'official_eu',
        },
        {
          label: 'Pression avant à froid',
          value: '230 kPa · 2,3 bar',
          confidence: 'official_eu',
        },
        {
          label: 'Pression arrière à froid',
          value: '260 kPa · 2,6 bar',
          confidence: 'official_eu',
        },
      ],
    },

    {
      id: 'chaine',
      title: 'Chaîne & transmission',
      summary:
        '30–40 mm · contrôle / lubrification tous les 1 000 km',

      rows: [
        {
          label: 'Flèche standard',
          value: '30 à 40 mm',
          confidence: 'official_eu',
        },
        {
          label: 'Contrôle / lubrification',
          value: 'Tous les 1 000 km',
          confidence: 'official_eu',
        },
        {
          label: 'Avant chaque trajet',
          value:
            'Contrôle visuel de l’état et de la tension recommandé',
          confidence: 'official_eu',
        },
        {
          label: 'Écrou axe arrière',
          value: '90 Nm',
          confidence: 'official_eu',
        },
        {
          label: "Limite d'allongement",
          value:
            '320,7 mm maximum sur 20 maillons sous une charge de 10 kg',
          confidence: 'official_eu',
        },
      ],

      note:
        "Contrôler et lubrifier plus fréquemment après pluie, lavage ou utilisation dans des conditions sévères.",
    },
  ],


  consumables_v2: [],


  known_issues_v2: [
    {
      title:
        'Révisions tous les 5 000 km',

      description:
        "CFMOTO France prévoit une révision tous les 5 000 km ou annuellement après celle des 1 000 km. Cet intervalle relativement rapproché doit être intégré au budget d'utilisation.",

      type:
        'manufacturer_monitoring',

      confidence:
        'official_fr',
    },

    {
      title:
        'Maintenance renforcée en usage sévère',

      description:
        "Le manuel prévoit de réduire de 50 % certains intervalles lorsque la moto est utilisée dans des conditions sévères, notamment conduite très intensive, poussière, humidité importante ou autres conditions définies par le constructeur.",

      type:
        'usage_limitation',

      confidence:
        'official_eu',
    },

    {
      title:
        "Échéances européennes à vérifier selon le millésime",

      description:
        "Le manuel propriétaire EU 2024 et la table de maintenance CFMOTO Italie révisée en 2025 diffèrent sur certaines échéances de filtre à huile, filtre à air et bougies. Le carnet correspondant au VIN doit rester la référence lors d'une intervention.",

      type:
        'manufacturer_monitoring',

      confidence:
        'official_eu',
    },
  ],


  warranty: {
    duration:
      '2 ans',

    coverage:
      "CFMOTO France annonce 2 ans pièces & main-d'œuvre",

    market:
      'France',

    maintenance_requirement:
      "CFMOTO France demande que les révisions soient réalisées dans le réseau agréé et que le carnet d'entretien soit renseigné après chaque passage.",

    legal_warranty_note:
      "CFMOTO France affiche 2 ans pièces et main-d'œuvre pour la 675SR-R. Les mentions légales générales de la page garantie indiquent cependant une prise en charge de la main-d'œuvre durant la première année uniquement. Le carnet ou contrat de garantie remis avec la moto reste donc la référence contractuelle.",
  },


  equivalents_v2: [
    {
      name: 'Yamaha R7',
      reason:
        'Sportive A2 / A · bicylindre · approche plus radicale',
    },
    {
      name: 'Suzuki GSX-8R',
      reason:
        'Sportive routière A2 / A · polyvalence supérieure',
    },
    {
      name: 'Triumph Daytona 660',
      reason:
        'Trois cylindres · philosophie moteur très proche',
    },
    {
      name: 'Honda CBR650R',
      reason:
        'Sportive quatre cylindres · A2 possible · réseau très dense',
    },
  ],


  verdict: {
    score: 8.7,

    title:
      'Une sportive trois cylindres très ambitieuse',

    text:
      "La 675SR-R apporte un moteur trois cylindres original, 89 ch en version A et une dotation sérieuse pour son positionnement. La possibilité de bridage A2 élargit fortement son public. Son entretien tous les 5 000 km est plus rapproché que celui de certaines concurrentes et la jeunesse du modèle limite encore le recul à très fort kilométrage, mais la documentation technique disponible est déjà particulièrement complète.",

    strengths: [
      'Moteur trois cylindres 674 cm³',
      '89 ch en version pleine puissance',
      'Version A2 35 kW disponible',
      'Suspensions KYB réglables',
      'Double disque avant J.Juan',
      'Shifter et contrôle de traction de série',
      'Documentation d’entretien détaillée',
    ],

    weaknesses: [
      'Révisions tous les 5 000 km',
      'Bridage nécessaire pour le permis A2',
      'Certaines échéances diffèrent entre documentations européennes',
      'Recul encore limité à très fort kilométrage',
    ],
  },


  data_quality: {
    market:
      'France / Europe',

    model_year:
      '2025–2026',

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

    last_verified:
      '24/08/2026',

    sources: [
      {
        label:
          'CFMOTO France · 675SR-R',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.cf-moto.fr/moto/modeles/675sr-r/',

        note:
          'Caractéristiques France actuelles, puissance, couple, poids, partie-cycle et compatibilité A2/A.',
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
          'Première révision à 1 000 km puis tous les 5 000 km ou annuellement pour la gamme 675.',
      },

      {
        label:
          'CFMOTO France · garantie',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          '2026',

        url:
          'https://www.cf-moto.fr/moto/garantie/',

        note:
          "675SR-R : garantie annoncée 2 ans pièces et main-d'œuvre.",
      },

      {
        label:
          "CFMOTO 675SR-R Owner's Manual EU247",

        type:
          'official_eu',

        market:
          'Europe',

        model_year:
          '2024',

        url:
          'https://cf-moto.pt/manuais-proprietario/motociclos/OM_675SR-R%20CF650-10-10H%286GUV-380101-5901-12%20EU247%29OM-20241112.pdf',

        note:
          'Huile, capacité, bougies, calendrier, refroidissement, freinage, pneus, chaîne et couples utilisateur.',
      },

      {
        label:
          'CFMOTO Italy · table de maintenance 675SR-R',

        type:
          'official_eu',

        market:
          'Europe',

        model_year:
          '2025',

        url:
          'https://cfmotoitaly.it/wp-content/uploads/Tav-man-CFMOTO-675SR-R_250529-REV.pdf',

        note:
          "Table révisée utilisée pour recouper huile, filtres, bougies, soupapes, fluides et transmission. Les différences avec le manuel EU 2024 sont explicitement conservées.",
      },

      {
        label:
          'CFMOTO France · présentation 675SR-R 2024',

        type:
          'official_fr',

        market:
          'France',

        model_year:
          'pré-série 2024',

        url:
          'https://www.cf-moto.fr/moto/nouvelle-cfmoto-675sr-r/',

        note:
          "Source historique : annonçait 68 Nm et 189 kg avec réserve de modification avant commercialisation. Les valeurs France actuelles 70 Nm / 195 kg sont prioritaires.",
      },

      {
        label:
          'CFMOTO 675SR-R · catalogue pièces',

        type:
          'technical_documentation',

        market:
          'International',

        model_year:
          '2025',

        url:
          'https://www.cfmotomalaysia.com.my/Source/Spare_Part/parts_catalog/675SR-R%20%28U10092025%29%20NP.pdf',

        note:
          "Utilisé pour recouper certaines références OEM. Toujours vérifier la référence avec le VIN avant commande.",
      },

      {
        label:
          'CSV LabelMoto · CFMOTO 675SR-R',

        type:
          'estimate',

        market:
          'Europe',

        model_year:
          '2025',

        note:
          "Utilisé uniquement comme base pour les estimations de coûts. Le niveau de fiabilité du CSV mesure la confiance de la donnée, pas la fiabilité mécanique de la moto.",
      },
    ],
  },
};
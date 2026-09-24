import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const kove800xDisplayData = {
  "modelName": "KOVE 800X Pro / GT / Rally",
  "model": "KOVE 800X",
  "year": "2024+ / variantes 2026",
  "category": "Trail A",
  "introduction": "La KOVE 800X existe en trois versions construites autour du même bicylindre de 799 cm³. La Pro recherche la polyvalence, la GT privilégie le voyage et le confort, tandis que la Rally pousse beaucoup plus loin l’usage hors route.",
  "engine": {
    "type": "Bicylindre 799 cm³, 4 temps, refroidissement liquide",
    "displacement": "799 cm³",
    "power": "69,5 kW / 95 ch à 9 000 tr/min",
    "torque": "79 Nm à 7 500 tr/min"
  },
  "dimensions": {
    "note": "La Pro affiche 190 kg et une selle à 875 mm. La GT passe à 195 kg avec une selle à 826 mm. La Rally descend à 176 kg avec une selle à 895 mm."
  },
  "faq": [
    {
      "question": "Quelle différence entre la KOVE 800X Pro, la GT et la Rally ?",
      "answer": "La Pro est la plus polyvalente. La GT privilégie le confort et le voyage avec une selle plus basse et un réservoir de 22 L. La Rally est plus légère, plus haute et davantage orientée vers le hors route."
    },
    {
      "question": "Quand faut-il réviser une KOVE 800X ?",
      "answer": "Le planning KOVE 2026 prévoit une première révision à 1 000 km puis des échéances à 6 000, 11 000, 16 000 et 21 000 km. Le carnet correspondant à la moto reste prioritaire."
    },
    {
      "question": "Quelle quantité d’huile faut-il prévoir ?",
      "answer": "La documentation disponible pour la 800X Pro indique environ 3,0 L avec remplacement du filtre. Le niveau final doit toujours être contrôlé selon le manuel."
    },
    {
      "question": "Pourquoi trouve-t-on 19 L et 20 L pour le réservoir de la Pro ?",
      "answer": "La page KOVE France actuelle affiche 20 L tandis qu’une fiche technique indique 19 L. LabelMoto conserve 20 L pour l’affichage France actuel et signale cette différence dans les sources."
    }
  ],
  "conclusion": "La Pro constitue le choix le plus polyvalent. La GT convient davantage au voyage et aux longues distances. La Rally s’adresse aux motards qui privilégient un poids contenu, de grands débattements de suspension et le roulage hors route."
};

export const kove800xVariants = [
  {
    "label": "800X Pro 2026",
    "engine_type": "Bicylindre 799 cm³, 4T, refroidissement liquide",
    "displacement_cc": 799,
    "power": "69,5 kW / ~95 ch à 9 000 tr/min",
    "torque": "79 Nm à 7 500 tr/min",
    "license_bridging": "Permis A",
    "weight_tpf_kg": 190,
    "seat_height_mm": 875,
    "ground_clearance_mm": 275,
    "tank_l": 20,
    "quick_facts": [
      { "label": "PUISSANCE", "value": "95 ch" },
      { "label": "COUPLE", "value": "79 Nm" },
      { "label": "CYLINDR\u00c9E", "value": "799 cm\u00b3" },
      { "label": "SELLE", "value": "875 mm" },
      { "label": "R\u00c9SERVOIR", "value": "20 L" },
      { "label": "PERMIS", "value": "A" }
    ],
    // LABELMOTO_KOVE_800X_PRO_CYCLE_PARTS
    "cycle_parts": {
      "front_suspension": "KYB, débattement 240 mm",
      "rear_suspension": "KYB, débattement 240 mm",
      "front_brake": "Double disque 310 mm TAISKO, étriers 4 pistons",
      "rear_brake": "Disque 220 mm",
      "front_tire": "90/90 R21",
      "rear_tire": "150/70 R18"
    },
    "front_suspension": "KYB, débattement 240 mm",
    "rear_suspension": "KYB, débattement 240 mm",
    "brakes": "Double disque 310 mm TAISKO 4 pistons AV · 220 mm AR",
    "equipment_note": "4 modes de conduite, ABS déconnectable, pneus Pirelli Scorpion Rally STR. Réservoir : 20 L sur la page France ; la fiche PDF technique consultée indique 19 L. Prix France vérifié : 8 999 €."
  },
  {
    "label": "800X GT",
    "engine_type": "Bicylindre 799 cm³, 4T, refroidissement liquide",
    "displacement_cc": 799,
    "power": "69,5 kW / 95 ch",
    "torque": "79 Nm à 7 500 tr/min",
    "license_bridging": "Permis A",
    "weight_tpf_kg": 195,
    "seat_height_mm": 826,
    "ground_clearance_mm": 230,
    "tank_l": 22,
    "quick_facts": [
      { "label": "PUISSANCE", "value": "95 ch" },
      { "label": "COUPLE", "value": "79 Nm" },
      { "label": "CYLINDR\u00c9E", "value": "799 cm\u00b3" },
      { "label": "SELLE", "value": "826 mm" },
      { "label": "R\u00c9SERVOIR", "value": "22 L" },
      { "label": "PERMIS", "value": "A" }
    ],
    "cycle_parts": {
      "front_suspension": "Fourche invers\u00e9e KYB \u00d843 mm, r\u00e9glable en pr\u00e9charge, d\u00e9tente et compression \u00b7 d\u00e9battement 210 mm",
      "rear_suspension": "Mono-amortisseur KYB r\u00e9glable \u00b7 d\u00e9battement 210 mm",
      "front_brake": "Double disque flottant \u00b7 \u00e9triers TAISKO 2 pistons \u00b7 ABS Bosch MSC",
      "rear_brake": "Disque simple \u00b7 \u00e9trier TAISKO 1 piston",
      "front_tire": "110/80 R19",
      "rear_tire": "150/70 R17"
    },
    "front_suspension": "KYB, débattement 210 mm",
    "rear_suspension": "KYB, débattement 210 mm",
    "brakes": "ABS Bosch Cornering",
    "equipment_note": "Quickshifter up/down, régulateur, poignées et selle chauffantes. Prix France vérifié : 8 799 €."
  },
  {
    "label": "800X Rally",
    "engine_type": "Bicylindre 799 cm³, 4T, refroidissement liquide",
    "displacement_cc": 799,
    "power": "69,5 kW / 95 ch",
    "torque": "79 Nm à 7 500 tr/min",
    "license_bridging": "Permis A",
    "weight_tpf_kg": 176,
    "seat_height_mm": 895,
    "ground_clearance_mm": 293,
    "tank_l": 19,
    "quick_facts": [
      { "label": "PUISSANCE", "value": "95 ch" },
      { "label": "COUPLE", "value": "79 Nm" },
      { "label": "CYLINDR\u00c9E", "value": "799 cm\u00b3" },
      { "label": "SELLE", "value": "895 mm" },
      { "label": "R\u00c9SERVOIR", "value": "19 L" },
      { "label": "PERMIS", "value": "A" }
    ],
    "cycle_parts": {
      "front_suspension": "Fourche invers\u00e9e \u00d849 mm double chambre, enti\u00e8rement r\u00e9glable \u00b7 d\u00e9battement 270 mm",
      "rear_suspension": "Amortisseur r\u00e9glable \u00b7 d\u00e9battement 240 mm",
      "front_brake": "Disque avant 310 mm TAISKO \u00b7 \u00e9trier 2 pistons",
      "rear_brake": "Disque arri\u00e8re \u00b7 \u00e9trier 1 piston",
      "front_tire": "90/90 R21",
      "rear_tire": "140/80 R18"
    },
    "euro_standard": "Euro 5+",
    "equipment_note": "Version la plus orientée tout-terrain. Prix France vérifié : 10 499 €."
  }
];

export const kove800xV2: MotorcycleSheetV2 & {
  intro: string;
  conclusion: string;
  longevity_tips: string[];
  faq: { question: string; answer: string }[];
} = {
  "layout_version": 2,
  "hero_subtitle": "KOVE 800X Pro, GT et Rally : caractéristiques, entretien, consommables, budget et conseils pratiques.",
  "intro": "Trois versions, un même bicylindre de 799 cm³ et trois usages très différents. La Pro vise la polyvalence, la GT le voyage et la Rally le hors route.",
  "conclusion": "La Pro constitue le choix le plus polyvalent. La GT convient davantage au voyage grâce à son ergonomie plus accessible et son réservoir de 22 L. La Rally est la plus légère et la plus spécialisée pour le hors route. Le choix dépend donc surtout de l’usage et de l’ergonomie recherchés.",
  "longevity_tips": [
    "Respecter les échéances correspondant au millésime et au VIN de la moto.",
    "Contrôler le niveau d’huile après chaque intervention et utiliser la viscosité prévue par la documentation.",
    "Inspecter plus souvent le filtre à air lors d’un usage poussiéreux ou hors route.",
    "Contrôler régulièrement la chaîne, les pneus, les rayons et les fixations après un usage sur piste ou terrain accidenté."
  ],
  "faq": [
    {
      "question": "Quelle différence entre la Pro, la GT et la Rally ?",
      "answer": "La Pro est la plus polyvalente. La GT privilégie le voyage avec une selle plus basse et un réservoir de 22 L. La Rally est plus légère, plus haute et davantage orientée vers le hors route."
    },
    {
      "question": "Quand faut-il réviser une KOVE 800X ?",
      "answer": "Le planning KOVE 2026 prévoit une première révision à 1 000 km puis des échéances à 6 000, 11 000, 16 000 et 21 000 km. Le carnet de la moto reste prioritaire."
    },
    {
      "question": "Quelle quantité d’huile faut-il prévoir ?",
      "answer": "La documentation disponible pour la 800X Pro indique environ 3,0 L avec remplacement du filtre. Le niveau final doit être contrôlé selon le manuel."
    },
    {
      "question": "Pourquoi le réservoir de la Pro est-il annoncé à 19 ou 20 L ?",
      "answer": "La page KOVE France actuelle annonce 20 L tandis qu’une fiche technique indique 19 L. LabelMoto conserve 20 L pour l’affichage France actuel et signale cette différence dans les sources."
    },
    {
      "question": "Que faut-il conserver pour la garantie ?",
      "answer": "Il est conseillé de conserver le carnet, les factures et tous les justificatifs d’entretien. Les conditions remises avec la moto et la législation applicable au moment de l’achat font foi."
    }
  ],
  "quick_facts": [
    { "label": "PUISSANCE", "value": "95 ch" },
    { "label": "COUPLE", "value": "79 Nm" },
    { "label": "CYLINDR\u00c9E", "value": "799 cm\u00b3" },
    { "label": "SELLE", "value": "875 mm" },
    { "label": "R\u00c9SERVOIR", "value": "20 L" },
    { "label": "PERMIS", "value": "A" }
  ],
  "quick_maintenance": [
    {
      "label": "Révisions",
      "value": "1 000 puis 6 000 / 11 000 / 16 000 / 21 000 km",
      "confidence": "official_other_market"
    },
    {
      "label": "Huile + filtre",
      "value": "À chaque échéance du planning 2026",
      "confidence": "official_other_market"
    },
    {
      "label": "Huile avec filtre",
      "value": "≈ 3,0 L sur manuel 800X Pro",
      "confidence": "technical_documentation"
    },
    {
      "label": "Liquide de refroidissement",
      "value": "24 mois",
      "confidence": "official_other_market"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Première révision / fin de rodage",
      "price_estimate": "≈149 à 239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection filtre à air ; remplacement selon état / tableau constructeur",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle transmission finale, freinage, pneumatiques et fixations",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning KOVE Service Schedule 2026 publié par le constructeur."
    },
    {
      "km": 6000,
      "title": "Révision périodique",
      "price_estimate": "≈149 à 239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection filtre à air ; remplacement selon état / tableau constructeur",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle transmission finale, freinage, pneumatiques et fixations",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning KOVE Service Schedule 2026 publié par le constructeur."
    },
    {
      "km": 11000,
      "title": "Révision périodique",
      "price_estimate": "≈149 à 239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection filtre à air ; remplacement selon état / tableau constructeur",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle transmission finale, freinage, pneumatiques et fixations",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning KOVE Service Schedule 2026 publié par le constructeur."
    },
    {
      "km": 16000,
      "title": "Révision périodique",
      "price_estimate": "≈149 à 239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection filtre à air ; remplacement selon état / tableau constructeur",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle transmission finale, freinage, pneumatiques et fixations",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning KOVE Service Schedule 2026 publié par le constructeur."
    },
    {
      "km": 21000,
      "title": "Révision majeure",
      "price_estimate": "≈169 à 239 € + opérations additionnelles",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection filtre à air ; remplacement selon état / tableau constructeur",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle transmission finale, freinage, pneumatiques et fixations",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle du jeu aux soupapes à l’échéance majeure",
          "source_type": "official_other_market"
        },
        {
          "label": "Entretien majeur du filtre à air selon tableau constructeur",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning KOVE Service Schedule 2026 publié par le constructeur."
    },
    {
      "km": 26000,
      "title": "Révision périodique",
      "price_estimate": "≈149 à 239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection filtre à air ; remplacement selon état / tableau constructeur",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle transmission finale, freinage, pneumatiques et fixations",
          "source_type": "official_other_market"
        }
      ],
      "note": "Reprise du cycle constructeur à partir de 26 000 km."
    },
    {
      "km": 31000,
      "title": "Révision périodique",
      "price_estimate": "≈149 à 239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection filtre à air ; remplacement selon état / tableau constructeur",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle transmission finale, freinage, pneumatiques et fixations",
          "source_type": "official_other_market"
        }
      ],
      "note": "Suite du cycle constructeur après la reprise à 26 000 km."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "Huile SAE 10W-50 API SN. Environ 3,0 L avec remplacement du filtre.",
      "rows": [
        {
          "label": "Viscosité",
          "value": "SAE 10W-50",
          "confidence": "multiple_sources"
        },
        {
          "label": "Qualité",
          "value": "API SN selon la documentation 800X consultée",
          "confidence": "multiple_sources"
        },
        {
          "label": "Quantité",
          "value": "Environ 3,0 L avec filtre",
          "confidence": "technical_documentation"
        }
      ],
      "note": "Toujours terminer par un contrôle du niveau selon la procédure du manuel correspondant à la moto."
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Inspection selon le planning KOVE. Contrôle plus fréquent en usage poussiéreux.",
      "rows": [
        {
          "label": "Entretien",
          "value": "Inspection et remplacement selon l’état et le planning constructeur",
          "confidence": "official_other_market"
        }
      ],
      "note": "En usage hors route ou poussiéreux, contrôler le filtre beaucoup plus souvent."
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "NGK LMAR9AI-10 avec un écartement documenté de 0,9 à 1,0 mm.",
      "rows": [
        {
          "label": "Référence",
          "value": "NGK LMAR9AI-10",
          "confidence": "multiple_sources"
        },
        {
          "label": "Écartement",
          "value": "0,9 à 1,0 mm",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "Contrôle prévu à l’échéance majeure de 21 000 km.",
      "rows": [
        {
          "label": "Contrôle",
          "value": "À 21 000 km selon le planning 2026",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Remplacement tous les 24 mois.",
      "rows": [
        {
          "label": "Périodicité",
          "value": "24 mois",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide",
      "summary": "Contrôle du freinage à chaque entretien et remplacement du liquide tous les 2 ans.",
      "rows": [
        {
          "label": "Liquide de frein",
          "value": "Remplacement tous les 2 ans",
          "confidence": "official_other_market"
        },
        {
          "label": "Plaquettes et disques",
          "value": "Contrôle d’usure à chaque entretien",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "Les dimensions changent selon la version.",
      "rows": [
        {
          "label": "Pro",
          "value": "90/90 R21 avant et 150/70 R18 arrière",
          "confidence": "official_fr"
        },
        {
          "label": "GT",
          "value": "110/80 R19 avant et 150/70 R17 arrière",
          "confidence": "official_fr"
        },
        {
          "label": "Rally",
          "value": "90/90 R21 avant et 140/80 R18 arrière",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Contrôle fréquent de la tension, de l’état et de la lubrification.",
      "rows": [
        {
          "label": "Chaîne",
          "value": "Contrôler la tension, l’usure et la lubrification selon le manuel",
          "confidence": "technical_documentation"
        }
      ],
      "note": "Après la pluie, un lavage ou un roulage hors route, une inspection supplémentaire est recommandée."
    }
  ],
  "known_issues_v2": [
    {
      "title": "Capacité du réservoir de la Pro",
      "description": "La page KOVE France affiche 20 L tandis qu’une fiche technique indique 19 L.",
      "type": "usage_limitation",
      "confidence": "multiple_sources",
      "source_note": "KOVE France 800X Pro 2026 et documentation technique"
    },
    {
      "title": "Ergonomie très différente selon la version",
      "description": "La selle passe de 826 mm sur la GT à 875 mm sur la Pro et 895 mm sur la Rally. Un essai est conseillé si la hauteur de selle est un critère important.",
      "type": "usage_limitation",
      "confidence": "official_fr",
      "source_note": "KOVE France"
    },
    {
      "title": "Planning correspondant au VIN",
      "description": "Le planning 2026 sert de référence générale. Le carnet et les informations correspondant au VIN restent prioritaires si une différence apparaît.",
      "type": "manufacturer_monitoring",
      "confidence": "official_other_market",
      "source_note": "KOVE Service Schedule 2026"
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur & filtre",
      "specification": "SAE 10W-50 · filtre Hiflofiltro HF650",
      "replacement_interval": "Selon le planning d’entretien",
      "observed_price": "64,30 € / 4 L · filtre 7,90 €",
      "source_type": "observed",
      "note": "Prix observés en France pour un bidon Motul 7100 10W-50 de 4 L et un filtre HF650 compatible."
    },
    {
      "part": "Filtre à air",
      "specification": "Filtre KOVE Euro 5 / Euro 5+",
      "replacement_interval": "Selon état et planning",
      "observed_price": "20,00 €",
      "source_type": "observed",
      "note": "Prix observé chez un revendeur KOVE. Vérifier la compatibilité exacte avec la version et le millésime avant commande."
    },
    {
      "part": "Bougies",
      "specification": "2 × NGK LMAR9AI-10",
      "replacement_interval": "Selon le planning constructeur",
      "observed_price": "79,90 € les 2",
      "source_type": "observed",
      "note": "Calculé à partir d’un prix observé de 39,95 € par bougie et d’une quantité de deux."
    },
    {
      "part": "Jeu aux soupapes",
      "specification": "Contrôle à l’échéance majeure",
      "replacement_interval": "21 000 km selon le planning 2026",
      "observed_price": "Sur devis",
      "source_type": "observed",
      "note": "Le coût dépend du temps de main-d’œuvre et d’un éventuel réglage. Aucun tarif national KOVE n’est publié."
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Liquide moto prêt à l’emploi",
      "replacement_interval": "24 mois",
      "observed_price": "7,99 à 19,76 € / L",
      "source_type": "observed",
      "note": "Fourchette observée en France pour des liquides de refroidissement moto prêts à l’emploi."
    },
    {
      "part": "Freinage & liquide",
      "specification": "Plaquettes selon version",
      "replacement_interval": "Selon usure · liquide tous les 2 ans",
      "observed_price": "31,08 à 53,88 € le jeu",
      "source_type": "observed",
      "note": "Fourchette observée pour des jeux de plaquettes compatibles 800X Pro et Rally. La GT doit être vérifiée séparément avant commande."
    },
    {
      "part": "Pneus & roues",
      "specification": "Pirelli Scorpion Rally STR, repère Pro / GT",
      "replacement_interval": "Selon usure et usage",
      "observed_price": "236,35 à 245,90 € le train",
      "source_type": "observed",
      "note": "Repère hors montage calculé avec les dimensions Pro et GT aux prix Dafy observés. La Rally utilise une monte différente et doit être chiffrée séparément."
    },
    {
      "part": "Chaîne & transmission",
      "specification": "Kit chaîne DID 520VX3, repère 800X Pro",
      "replacement_interval": "Selon usure et entretien",
      "observed_price": "171,12 €",
      "source_type": "observed",
      "note": "Prix public TTC observé pour un kit chaîne compatible 800X Pro."
    }
  ],
  "budget": {
    "title": "Budget entretien jusqu’à 31 000 km",
    "cards": [
      {
        "label": "Budget de base jusqu’à 31 000 km",
        "value": "environ 1 530 €",
        "note": "Estimation LabelMoto fondée sur sept passages jusqu’à 31 000 km, six forfaits courants à 149 €, un forfait complet à 239 €, environ 21 L d’huile et sept filtres à huile aux tarifs observés."
      },
      {
        "label": "Révisions jusqu’à 31 000 km",
        "value": "7 passages",
        "note": "1 000, 6 000, 11 000, 16 000, 21 000, 26 000 et 31 000 km."
      },
      {
        "label": "Forfait courant observé",
        "value": "149 €",
        "note": "Tarif atelier deux roues observé. Les consommables sont facturés en supplément."
      },
      {
        "label": "Forfait complet observé",
        "value": "239 €",
        "note": "Tarif atelier observé pour un forfait plus complet. Les consommables restent facturés en supplément."
      },
      {
        "label": "Usure non comprise",
        "value": "Selon usage",
        "note": "Pneus, kit chaîne, plaquettes, filtre à air et pièces d’usure ne sont pas inclus dans les 1 530 €."
      }
    ],
    "note": "Ce montant est une estimation documentée, pas un barème KOVE France. Il sert à donner un ordre de grandeur du coût de base jusqu’à 31 000 km."
  },
  "warranty": {
    "duration": "2 ans",
    "coverage": "La documentation KOVE France de la 800X Pro et de la 800X Rally indique une garantie de 2 ans. Le contrat KOVE France couvre les défauts de matériaux ou de construction reconnus, sous réserve des exclusions prévues.",
    "maintenance_requirement": "Respecter le plan d’entretien applicable à la moto et conserver le carnet, les factures et les justificatifs des opérations réalisées.",
    "claim_requirement": "En cas de demande de garantie, s’adresser à un concessionnaire officiel KOVE France avec les documents nécessaires.",
    "invoice_advice": "La garantie débute à la date d’immatriculation ou, si la moto n’est pas immatriculée, à la date de vente à l’utilisateur.",
    "legal_warranty_note": "Les garanties légales françaises restent distinctes des conditions commerciales. Le contrat remis avec la moto et la législation applicable au moment de l’achat font foi.",
    "market": "France",
    "source_label": "KOVE France : fiches 800X et contrat de garantie"
  },
  "verdict": {
    "title": "Notre avis",
    "text": "La 800X possède une base moteur commune mais trois personnalités très différentes. La Pro est la plus facile à envisager pour un usage mixte. La GT privilégie le confort, l’autonomie et le voyage. La Rally est nettement plus spécialisée pour le hors route grâce à son poids plus faible, sa garde au sol et ses suspensions à grand débattement.",
    "strengths": [
      "Moteur de 95 ch sur les trois versions",
      "Pro réellement polyvalente",
      "GT adaptée au voyage",
      "Rally légère et très orientée hors route",
      "Parties cycles adaptées à chaque usage"
    ],
    "weaknesses": [
      "Selle haute sur la Pro et surtout sur la Rally",
      "Capacité du réservoir Pro différente selon les documents",
      "Budget de la grosse révision à demander sur devis"
    ]
  },
  "data_quality": {
    "market": "France",
    "model_year": "2024+ / variantes France 2026",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": false,
    "pricing_type": "mixed",
    "last_verified": "24/09/2026",
    "sources": [
      {
        "label": "KOVE France : fiche 800X Pro",
        "type": "official_fr",
        "market": "France",
        "model_year": "2025+",
        "url": "https://kovemotor.fr/wp-content/uploads/2025/04/GUIADEPRODUCTOREDUCIDA800XFR1739537277.pdf",
        "note": "Fiche France utilisée pour la garantie annoncée à 2 ans."
      },
      {
        "label": "KOVE France : fiche 800X Rally",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://kovemotor.fr/wp-content/uploads/2025/07/GUIADEPRODUCTOREDUCIDA800XRALLYFR.pdf",
        "note": "Fiche France utilisée pour la garantie annoncée à 2 ans."
      },
      {
        "label": "KOVE France : contrat de garantie",
        "type": "official_fr",
        "market": "France",
        "model_year": "2025+",
        "url": "https://kovemotor.fr/wp-content/uploads/2025/04/KOVE-MOTO-conditions-garantie-france.pdf",
        "note": "Conditions de couverture, point de départ et procédure de prise en charge."
      },
      {
        "label": "KOVE : planning entretien 2026",
        "type": "official_other_market",
        "market": "International",
        "model_year": "2026",
        "url": "https://www.kovemoto.com/wp-content/uploads/2026/06/Service-schedule.pdf",
        "note": "Échéances utilisées pour le calendrier d’entretien."
      },
      {
        "label": "Vulka Motor : tarifs atelier",
        "type": "observed",
        "market": "France",
        "model_year": "24/09/2026",
        "url": "https://vulkamotor.fr/atelier/tarifs/",
        "note": "Forfaits observés à 149 €, 169 € et 239 €, consommables en supplément."
      },
      {
        "label": "La Bécanerie : Motul 7100 10W-50 4 L",
        "type": "observed",
        "market": "France",
        "model_year": "24/09/2026",
        "url": "https://www.la-becanerie.com/huile-moteur-4t-motul-7100-10w50-4l.html",
        "note": "Prix observé : 64,30 €."
      },
      {
        "label": "La Bécanerie : Hiflofiltro HF650",
        "type": "observed",
        "market": "France",
        "model_year": "24/09/2026",
        "url": "https://www.la-becanerie.com/filtre-a-huile-hiflofiltro-hf650.html",
        "note": "Prix observé : 7,90 €."
      },
      {
        "label": "KTMRaw : compatibilité HF650 KOVE 800X",
        "type": "observed",
        "market": "Europe",
        "model_year": "2026",
        "url": "https://www.ktmraw.com/fr/filtre-a-huile/1020076-filtre-a-huile-hiflofiltro-hf650-800x.html",
        "note": "Compatibilité catalogue indiquée pour 800X Pro, GT et Rally 2026."
      },
      {
        "label": "Moto And Co : NGK LMAR9AI-10",
        "type": "observed",
        "market": "France",
        "model_year": "24/09/2026",
        "url": "https://www.motoandco.fr/bougie/bougie-ngk-laser-iridium-lmar9ai-10-10464.html",
        "note": "Prix observé : 39,95 €. Compatibilité catalogue KOVE 800X Pro et Rally 2025-2026, quantité 2."
      },
      {
        "label": "Moraco : pièces KOVE 800X Pro",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.moraco.fr/vehicle/?previous_category_id=388&vehicle=U6%40726",
        "note": "Prix publics observés pour kit chaîne et plaquettes de la 800X Pro 2026."
      },
      {
        "label": "Moraco : pièces KOVE 800X Rally",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.moraco.fr/vehicle/?previous_category_id=314&vehicle=U6%40660",
        "note": "Prix publics observés pour plaquettes de la 800X Rally 2026."
      }
,
      {
        "label": "KOVE Racing : entretien et consommables KOVE",
        "type": "observed",
        "market": "France",
        "model_year": "24/09/2026",
        "url": "https://kove-racing.com/accessoires-et-pieces/entretien-consommables-moto-kove/",
        "note": "Filtre à air KOVE Euro 5 / Euro 5+ observé à 20,00 €."
      },
      {
        "label": "Dafy Moto : liquide de refroidissement moto",
        "type": "observed",
        "market": "France",
        "model_year": "24/09/2026",
        "url": "https://www.dafy-moto.com/entretien-outillage/huile-lubrifiant/liquide-de-refroidissement.html",
        "note": "Prix observés de 7,99 € à 19,76 € le litre pour plusieurs liquides moto prêts à l’emploi."
      },
      {
        "label": "Dafy Moto : Pirelli Scorpion Rally STR",
        "type": "observed",
        "market": "France",
        "model_year": "24/09/2026",
        "url": "https://www.dafy-moto.com/pneu-scorpion-rally-str-pirelli.html",
        "note": "Prix observés utilisés pour le repère de train de pneus Pro et GT, hors montage."
      }
    ]
  },
  "equivalents_v2": [
    {
      "id": "cfmoto-800mt-sport-explore-2023-plus",
      "name": "CFMOTO 800MT Sport / Explore",
      "reason": "Trail bicylindre 800 cm³ avec versions routières/voyage."
    },
    {
      "id": "voge-ds800x-rally-2025-plus",
      "name": "VOGE DS800X Rally",
      "reason": "Trail 800 orienté off-road."
    },
    {
      "name": "Yamaha Ténéré 700",
      "reason": "Référence du trail mid-size orienté piste."
    }
  ]
};

import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const kove450RallyDisplayData = {
  "modelName": "KOVE 450 Rally",
  "model": "KOVE 450 Rally",
  "year": "2024+",
  "category": "Trail / Rally",
  "introduction": "La KOVE 450 Rally Standard est la version homologuée route de la famille 450 Rally. Son entretien est particulièrement rapproché, avec un calendrier kilométrique spécifique et des contrôles supplémentaires en usage rallye ou désert.",
  "engine": {
    "type": "Monocylindre 4 temps, DOHC, refroidissement liquide",
    "displacement": "449 cm³",
    "power": "31 kW / 42 ch à 8 500 tr/min",
    "torque": "≈ 35 Nm selon la génération existante"
  },
  "cycleParts": {
    "note": "La version Standard France existe en configuration haute ou basse. Pour l’entretien, le carnet correspondant au VIN et au millésime reste prioritaire."
  },
  "dimensions": {
    "note": "La capacité du réservoir, la hauteur de selle et le poids peuvent varier selon la génération et la configuration ; vérifier les caractéristiques correspondant au millésime et à la moto."
  },
  "faq": [
    {
      "question": "Quel est le planning KOVE 2026 de la 450 Rally Standard ?",
      "answer": "500, 2 500, 4 500, 6 500 et 8 500 km, puis répétition du cycle à partir de 10 500 km."
    },
    {
      "question": "Pourquoi trouve-t-on aussi 1 000 / 3 000 / 5 000 / 7 000 / 9 000 km ?",
      "answer": "Un ancien manuel France documente 1 000 / 3 000 / 5 000 / 7 000 / 9 000 km. Le planning constructeur 2026 documenté pour la génération actuelle indique 500 / 2 500 / 4 500 / 6 500 / 8 500 km, puis répétition du cycle. Le carnet correspondant au VIN et au millésime reste prioritaire."
    },
    {
      "question": "Quelles opérations sont renforcées en rallye / désert ?",
      "answer": "Le planning KOVE 2026 indique notamment filtre à air quotidien, contrôle des soupapes toutes les 30 h, embrayage toutes les 20 h et huile de suspension toutes les 20 h en usage rallye/désert."
    }
  ],
  "longevityTips": [
    "Respecter la première révision à 500 km puis le cycle très rapproché prévu par le planning constructeur.",
    "En terrain poussiéreux ou désertique, contrôler et nettoyer le filtre à air quotidiennement.",
    "Nettoyer, contrôler et lubrifier la chaîne après les sorties poussiéreuses, boueuses ou après un lavage.",
    "Surveiller le niveau d’huile entre deux échéances, particulièrement lors d’un usage prolongé à régime soutenu.",
    "En usage rallye ou désert, suivre aussi les échéances en heures prévues pour les soupapes, l’embrayage et la suspension."
  ],
  "conclusion": "Sur une 450 Rally d’occasion, le kilométrage seul ne suffit pas. Vérifiez le millésime et le planning réellement applicable, puis demandez l’historique d’utilisation tout-terrain. Pour une moto ayant roulé en rallye ou dans le désert, contrôlez particulièrement la traçabilité du filtre à air, des soupapes, de l’embrayage et de la suspension : un faible kilométrage ne compense pas un entretien en heures absent."
};

export const kove450RallyV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "license_fr": "A2",
  "license_fr_source": "https://kove-racing.com/produit/450-rally-standard/",
  "license_fr_verified_at": "2026-09-30",
  "faq": kove450RallyDisplayData.faq,
  "longevity_tips": kove450RallyDisplayData.longevityTips,
  "conclusion": kove450RallyDisplayData.conclusion,
  "hero_subtitle": "Guide KOVE 450 Rally Standard : planning 2026 très rapproché, entretien rallye/désert, huile 10W-40 et coûts d’usage.",
  "quick_facts": [
    {
      "label": "CYLINDRÉE",
      "value": "449 cm³"
    },
    {
      "label": "PUISSANCE",
      "value": "42 ch / 31 kW"
    },
    {
      "label": "USAGE",
      "value": "Rally / trail"
    },
    {
      "label": "ENTRETIEN",
      "value": "500 km puis tous les 2 000 km"
    }
  ],
  "quick_maintenance": [
    {
      "label": "Planning 2026 Standard",
      "value": "500 / 2 500 / 4 500 / 6 500 / 8 500 km",
      "confidence": "official_other_market"
    },
    {
      "label": "Huile moteur",
      "value": "SAE 10W-40 · API SN · 1,6 L avec filtre",
      "confidence": "multiple_sources"
    },
    {
      "label": "Bougie",
      "value": "CR8E · écartement 0,7–0,8 mm",
      "confidence": "technical_documentation"
    },
    {
      "label": "Usage rallye / désert",
      "value": "Air quotidien · soupapes 30 h · embrayage 20 h · suspension 20 h",
      "confidence": "official_other_market"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 500,
      "title": "Première révision",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 2500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 4500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 6500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 8500,
      "title": "Révision majeure",
      "price_estimate": "≈299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle du jeu aux soupapes",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 10500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 12500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 14500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 16500,
      "title": "Révision majeure",
      "price_estimate": "≈299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle du jeu aux soupapes",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 18500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 20500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 22500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 24500,
      "title": "Révision majeure",
      "price_estimate": "≈299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle du jeu aux soupapes",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 26500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 28500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 30500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 32500,
      "title": "Révision majeure",
      "price_estimate": "≈299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle du jeu aux soupapes",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 34500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 36500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Standard. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-40 · API SN · 1,6 L avec filtre · 1,8 L moteur sec",
      "rows": [
        {
          "label": "Spécification",
          "value": "SAE 10W-40 · API SN",
          "confidence": "multiple_sources"
        },
        {
          "label": "Avec filtre",
          "value": "1,6 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Après démontage moteur",
          "value": "1,8 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Huile moteur",
          "value": "Remplacement à 500 / 2 500 / 4 500 / 6 500 / 8 500 km",
          "confidence": "official_other_market"
        },
        {
          "label": "Filtre à huile",
          "value": "Remplacement à 500 / 4 500 / 8 500 km ; inspection/remplacement aux autres échéances",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "I/R selon planning · entretien quotidien en rallye / désert",
      "rows": [
        {
          "label": "Usage normal",
          "value": "Inspection / nettoyage / remplacement selon chaque échéance du planning 2026",
          "confidence": "official_other_market"
        },
        {
          "label": "Rallye / désert",
          "value": "Nettoyage ou remplacement quotidien",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "NGK CR8E · écartement 0,7–0,8 mm",
      "rows": [
        {
          "label": "Référence",
          "value": "NGK CR8E",
          "confidence": "technical_documentation"
        },
        {
          "label": "Écartement",
          "value": "0,7–0,8 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Contrôle",
          "value": "Inspection aux échéances prévues par le planning KOVE",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "ADM 0,10 mm · ÉCH 0,15 mm · 30 h en rallye/désert",
      "rows": [
        {
          "label": "Admission à froid",
          "value": "0,10 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Échappement à froid",
          "value": "0,15 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Usage Standard",
          "value": "Contrôle à l’échéance majeure du cycle 2026",
          "confidence": "official_other_market"
        },
        {
          "label": "Rallye / désert",
          "value": "Contrôle et réglage toutes les 30 h",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Capacité radiateur 1,2 L · contrôle périodique · remplacement à 24 mois",
      "rows": [
        {
          "label": "Capacité radiateur",
          "value": "1,2 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Contrôle",
          "value": "Inspection à chaque échéance du planning",
          "confidence": "official_other_market"
        },
        {
          "label": "Remplacement",
          "value": "24 mois",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide",
      "summary": "DOT 4 · contrôle des plaquettes · remplacement à 12 mois",
      "rows": [
        {
          "label": "Liquide",
          "value": "DOT 4 ou équivalent",
          "confidence": "technical_documentation"
        },
        {
          "label": "Plaquettes",
          "value": "Inspection de l’usure aux échéances du plan",
          "confidence": "official_other_market"
        },
        {
          "label": "Remplacement liquide",
          "value": "12 mois selon planning KOVE 2026",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "90/90-21 · 140/80-18",
      "rows": [
        {
          "label": "Avant",
          "value": "90/90-21",
          "confidence": "technical_documentation"
        },
        {
          "label": "Arrière",
          "value": "140/80-18",
          "confidence": "technical_documentation"
        },
        {
          "label": "Pression standard — version à chambres",
          "value": "230 kPa avant · 250 kPa arrière sur manuel propriétaire",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Flèche 30–55 mm · nettoyage et lubrification réguliers",
      "rows": [
        {
          "label": "Flèche de chaîne",
          "value": "30–55 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Entretien",
          "value": "Inspecter, nettoyer et lubrifier régulièrement ; fréquence accrue en conditions sévères",
          "confidence": "technical_documentation"
        },
        {
          "label": "Lubrifiant",
          "value": "Lubrifiant pour chaîne à joints ou huile d’engrenages SAE 80/90",
          "confidence": "technical_documentation"
        },
        {
          "label": "Embrayage — rallye / désert",
          "value": "Contrôle toutes les 20 h",
          "confidence": "official_other_market"
        }
      ],
      "note": "Le planning KOVE 2026 prévoit également le remplacement de l’huile de suspension toutes les 20 h en usage rallye/désert."
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-40 · API SN · environ 1,6 L avec filtre fin",
      "replacement_interval": "À chaque échéance du planning applicable",
      "observed_price": "≈12–14 € / L",
      "source_type": "observed",
      "note": "Fourchette construite à partir du Bardahl XTC-M 10W-40 vendu dans le réseau KOVE : 13,95 € en 1 L et 46 € en 4 L. Le manuel 450 Rally documente environ 1,6 L avec remplacement du filtre fin."
    },
    {
      "part": "Filtre à air",
      "specification": "Filtre d’origine KOVE Euro 5 / Euro 5+",
      "replacement_interval": "Selon planning · contrôle quotidien en environnement désertique",
      "observed_price": "≈20 €",
      "source_type": "observed",
      "note": "Filtre à air d’origine annoncé compatible KOVE 450 Rally Standard, Euro 5 et Euro 5+."
    },
    {
      "part": "Bougie",
      "specification": "NGK CR8E · écartement 0,7–0,8 mm",
      "replacement_interval": "Inspection selon planning constructeur",
      "observed_price": "≈13 € / unité",
      "source_type": "observed",
      "note": "La référence CR8E est documentée dans le manuel 450 Rally. Prix de bougie observé dans le catalogue entretien KOVE France."
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Liquide moto prêt à l’emploi compatible alliages légers",
      "replacement_interval": "Selon échéance constructeur et conditions d’utilisation",
      "observed_price": "≈12–14 € / L",
      "source_type": "observed",
      "note": "Fourchette resserrée à partir de produits moto prêts à l’emploi observés en France, notamment Ipone Radiator Liquid et Motul Motocool Expert."
    },
    {
      "part": "Liquide de frein",
      "specification": "DOT 4",
      "replacement_interval": "12 mois selon documentation disponible",
      "observed_price": "≈17 € / 450 ml",
      "source_type": "observed",
      "note": "Prix observé dans le réseau KOVE France pour le Bardahl XBF DOT 4 en 450 ml."
    },
    {
      "part": "Pneus & roues",
      "specification": "90/90-21 avant · 140/80-18 arrière",
      "replacement_interval": "Selon usure et type de terrain",
      "observed_price": "≈130 € le train Michelin Tracker",
      "source_type": "observed",
      "note": "Repère hors montage calculé sur les deux dimensions exactes : Michelin Tracker 90/90-21 et 140/80-18."
    },
    {
      "part": "Chaîne & transmission",
      "specification": "D.I.D 520VX3 X-RING · 116 maillons",
      "replacement_interval": "Selon usure · contrôle et lubrification fréquents",
      "observed_price": "≈102 € la chaîne",
      "source_type": "observed",
      "note": "Chaîne D.I.D 520VX3 116 maillons annoncée compatible KOVE 450 Rally. Un kit chaîne AFAM complet est également observé autour de 176–178 € et est conservé dans les sources pour une exploitation future."
    }
  ],
  "budget": {
    "title": "Budget entretien autour de 30 000 km",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈3 480–4 780 €",
      "cost_per_km": "≈0,116–0,159 €/km",
      "interval_rule": "500 km puis tous les 2 000 km · échéance 30 500 km incluse",
      "note": "Estimation LabelMoto des forfaits atelier observés appliqués au cycle KOVE 2026 Standard jusqu’à la première échéance immédiatement suivante après 30 000 km. Le calcul comprend 16 passages, dont les révisions majeures de 8 500, 16 500 et 24 500 km. Consommables, pièces d’usure et opérations additionnelles restent exclus."
    },
    "cards": [
      {
        "label": "Révisions incluses",
        "value": "16 passages",
        "note": "500 km puis 2 500 à 30 500 km par pas de 2 000 km."
      },
      {
        "label": "Forfait courant observé",
        "value": "199–299 €",
        "note": "Repère atelier français observé pour la 450 Rally ; consommables en supplément."
      },
      {
        "label": "Révisions majeures",
        "value": "3 passages",
        "note": "8 500, 16 500 et 24 500 km dans l’horizon retenu ; repère atelier observé autour de 299 € avant pièces additionnelles."
      },
      {
        "label": "Usage rallye / désert",
        "value": "Suivi en heures",
        "note": "Les échéances en heures pour soupapes, embrayage et suspension peuvent augmenter le coût réel indépendamment du kilométrage."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. La 450 Rally est particulièrement sensible au type d’usage : route, voyage, tout-terrain ou rallye ne génèrent pas le même coût réel."
  },
  "warranty": {
    "duration": "2 ans",
    "coverage": "Défauts de matériau ou de fabrication acceptés dans les conditions KOVE France, sous réserve des exclusions contractuelles. Garantie constructeur sans limitation de kilométrage, sauf stipulation contraire.",
    "maintenance_requirement": "Respecter le plan d'entretien applicable au modèle, au millésime et au VIN, et conserver les justificatifs d'entretien.",
    "claim_requirement": "Pour une demande de prise en charge, se rapprocher d'un revendeur / réparateur agréé KOVE France avec les justificatifs demandés.",
    "legal_warranty_note": "Les CGV KOVE Moto France distinguent la garantie constructeur de 2 ans des garanties légales françaises. Les exclusions et la procédure de prise en charge restent celles du contrat remis avec la moto.",
    "market": "France",
    "source_label": "KOVE Moto France · CGV / garantie constructeur"
  },
  "known_issues_v2": [
    {
      "title": "Calendrier différent selon la génération",
      "description": "Un ancien manuel France utilise 1 000 / 3 000 / 5 000 / 7 000 / 9 000 km, tandis que le planning KOVE 2026 utilise 500 / 2 500 / 4 500 / 6 500 / 8 500 km puis répète le cycle. Le carnet correspondant au VIN et au millésime reste prioritaire.",
      "type": "manufacturer_monitoring",
      "confidence": "technical_documentation"
    },
    {
      "title": "Usage rallye / désert suivi aussi en heures",
      "description": "En usage rallye ou désert, la documentation prévoit des contrôles plus rapprochés, notamment soupapes à 30 h, embrayage à 20 h et huile de suspension à 20 h.",
      "type": "usage_limitation",
      "confidence": "official_other_market"
    },
    {
      "title": "Filtration d’air en environnement poussiéreux",
      "description": "Le filtre à air nécessite un contrôle et un nettoyage très fréquents en environnement poussiéreux, jusqu’à un suivi quotidien en usage désertique.",
      "type": "usage_limitation",
      "confidence": "technical_documentation"
    }
  ],
  "verdict": {
    "title": "Un entretien très rapproché à intégrer dès l’achat",
    "text": "La 450 Rally Standard se distingue surtout par la fréquence de son entretien. Le planning 2026 prévoit une première échéance à 500 km puis un passage tous les 2 000 km. En usage rallye ou désert, les contrôles en heures deviennent aussi importants que le kilométrage. La filtration, l’huile, la transmission et les organes soumis au tout-terrain ont donc un impact direct sur le coût d’usage.",
    "strengths": [
      "Planning constructeur 2026 clairement documenté",
      "Intervalles spécifiques rallye / désert documentés",
      "Plusieurs consommables disponibles directement dans le réseau KOVE"
    ],
    "weaknesses": [
      "Passages en atelier très fréquents",
      "Suivi supplémentaire en heures en usage intensif",
      "Ancien calendrier encore présent dans certains documents"
    ]
  },
  "data_quality": {
    "market": "France / international",
    "model_year": "2024+ / planning 2026 Standard",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": false,
    "recall_checked": false,
    "pricing_type": "observed",
    "last_verified": "26/09/2026",
    "sources": [
    {
        "label": "KOVE Moto France · garantie constructeur / CGV",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://kove-racing.com/conditions-generales-de-ventes/",
        "note": "Garantie constructeur de deux ans à compter du début de garantie, sans limitation de kilométrage, sauf stipulation contraire. La garantie légale de conformité française reste distincte."
      },
    {
        "label": "KOVE · Service schedule 2026",
        "type": "official_other_market",
        "market": "International",
        "model_year": "2026",
        "url": "https://www.kovemoto.com/wp-content/uploads/2026/06/Service-schedule.pdf",
        "note": "Planning constructeur commun de maintenance ; le carnet correspondant au VIN reste prioritaire."
      },
    {
        "label": "KOVE · Service",
        "type": "official_other_market",
        "market": "International",
        "model_year": "2026",
        "url": "https://www.kovemoto.com/service",
        "note": "Portail constructeur : planning, politiques de garantie et manuels par modèle."
      },
    {
        "label": "KOVE France · conditions de garantie",
        "type": "official_fr",
        "market": "France",
        "model_year": "2025+",
        "url": "https://kovemotor.fr/wp-content/uploads/2025/04/KOVE-MOTO-conditions-garantie-france.pdf",
        "note": "Conditions contractuelles France ; le document remis avec la moto fait foi pour les exclusions et la procédure de prise en charge."
      },
    {
        "label": "Vulka Motor · tarifs atelier KOVE",
        "type": "observed",
        "market": "France",
        "model_year": "23/09/2026",
        "url": "https://vulkamotor.fr/atelier/tarifs/",
        "note": "Prix atelier observés ; ne constitue pas un barème constructeur national."
      },
    {
        "label": "Ancien manuel France KOVE 450 Rally",
        "type": "technical_documentation",
        "market": "France",
        "model_year": "génération antérieure",
        "url": "https://www.kovemoto.com/service",
        "note": "Cadence 1 000 / 3 000 / 5 000 / 7 000 / 9 000 km, différente du planning KOVE 2026."
      },
    {
        "label": "KOVE · paramètres techniques 450 Rally",
        "type": "technical_documentation",
        "market": "International",
        "model_year": "2024+",
        "url": "https://www.kovemoto.com/uploadfile/202308/f222fe653105aef.pdf",
        "note": "CR8E, écartement 0,7–0,8 mm, soupapes 0,10 / 0,15 mm, pneus."
      },
    {
        "label": "Manuel propriétaire KOVE 450 Rally",
        "type": "technical_documentation",
        "market": "International",
        "model_year": "2024+",
        "url": "https://device.report/m/81101e317ddf83c534e3e9a0839be988da51d697dccc0f31a9596686ac4257a6",
        "note": "1,6 L avec filtre, 1,8 L moteur réassemblé, chaîne et procédures utilisateur."
      },
    {
        "label": "KOVE 450 Rally · manuel maintenance",
        "type": "technical_documentation",
        "market": "International",
        "model_year": "2024+",
        "url": "https://www.manualslib.com/manual/3344810/Kove-450-Rally.html",
        "note": "Capacité refroidissement 1,2 L, DOT 4, pressions et données atelier."
      },
    {
        "label": "Manuel utilisateur 450 Rally FR",
        "type": "technical_documentation",
        "market": "France / Europe",
        "model_year": "génération documentée",
        "url": "https://fr.scribd.com/document/856929107/450-Rally-Instruction-Manual-en-fr-pdf-1",
        "note": "SAE 10W-40 API SN, DOT 4, pneus, chaîne 30–55 mm et procédures d’entretien."
      },
    {
      "label": "KOVE Moto France · 450 Rally Standard",
      "type": "official_fr",
      "market": "France",
      "model_year": "2026",
      "url": "https://kove-racing.com/produit/450-rally-standard/",
      "note": "Appellation France actuelle : 450 Rally Standard. La documentation internationale et certains filtres de compatibilité utilisent encore l’appellation Regular pour cette même famille. Caractéristiques France : 449 cm³, 31 kW / 42 ch, 35 Nm et pneus 90/90-21 / 140/80-18."
    },
    {
      "label": "KOVE France · entretien & consommables KOVE 450",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://kove-racing.com/accessoires-et-pieces/entretien-consommables-moto-kove/",
      "note": "Prix observés pour huile 10W-40, bougie, filtre à air, DOT 4, chaîne et kit chaîne."
    },
    {
      "label": "KOVE France · filtre à air 450 Rally Euro 5 / Euro 5+",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://kove-racing.com/produit/filtre-a-air-euro-5/",
      "note": "Filtre d’origine compatible 450 Rally Standard, prix observé 20 € TTC."
    },
    {
      "label": "KOVE France · chaîne DID 520VX3 116 maillons",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://kove-racing.com/produit/chaine-de-transmission-d-i-d-520vx3-x-ring-118-maillons/",
      "note": "D.I.D 520VX3 X-RING 116 maillons compatible 450 Rally, prix observé 102 € TTC. La terminaison historique de l’URL mentionne 118 maillons mais la fiche produit actuelle affiche 116."
    },
    {
      "label": "1001Pneus · Michelin Tracker",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://www.1001pneus.fr/pneus-moto/marques-pneus-moto/m2-michelin/tracker",
      "note": "90/90-21 à 55,90 € et 140/80-18 à 74,10 €, soit environ 130 € le train hors montage."
    },
    {
      "label": "Dafy · liquides de refroidissement moto",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://www.dafy-moto.com/entretien-outillage/huile-lubrifiant/liquide-de-refroidissement.html",
      "note": "Ipone Radiator Liquid observé à 12,51 €/L et Motul Motocool Expert à 14,36 €/L ; fourchette LabelMoto retenue ≈12–14 €/L."
    }
  ]
  },
  "equivalents_v2": [
    {
      "name": "CFMOTO 450MT",
      "reason": "Trail A2 450 cm³, beaucoup plus routier."
    },
    {
      "name": "Honda CRF300 Rally",
      "reason": "Rally/trail léger, moins puissant mais réseau et recul supérieurs."
    }
  ]
};

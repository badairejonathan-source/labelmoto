import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const cfmoto450nkDisplayData = {
  "modelName": "CFMOTO 450 NK",
  "model": "CFMOTO 450 NK",
  "year": "2023+",
  "category": "Roadster A2",
  "introduction": "La CFMOTO 450NK est un roadster A2 de 449 cm³, 47,5 ch et 39 Nm. CFMOTO France prévoit 1 000 km puis tous les 5 000 km ou 1 an. La base d’entretien documentée utilise 2,5 L de 10W-40 JASO MA2, deux BN8RTI et un contrôle des soupapes à 40 000 km.",
  "engine": {
    "type": "Bicylindre 4T, liquide, DOHC, calage 270°",
    "displacement": "449 cm³",
    "power": "47,5 ch (35 kW) à 10 000 tr/min",
    "torque": "39 Nm à 7 600 tr/min",
    "bridage": "A2 natif",
    "alimentation": "Injection"
  },
  "cycleParts": {
    "frontTire": "110/70 R17",
    "rearTire": "150/60 R17",
    "frontBrake": "Ø320 mm",
    "rearBrake": "Ø220 mm"
  },
  "dimensions": {
    "wetWeight": "165 kg",
    "seatHeight": "795 mm",
    "tank": "14 L"
  },
  "faq": [
    {
      "question": "Quand réviser ?",
      "answer": "1 000 km puis tous les 5 000 km ou 1 an."
    },
    {
      "question": "Quand contrôler les soupapes ?",
      "answer": "40 000 km selon la table européenne."
    }
  ],
  "longevityTips": [
    "5 000 km / 1 an.",
    "Chaîne 1 000 km.",
    "Filtre à air plus fréquent en poussière."
  ],
  "conclusion": "Plan d'entretien bien documenté ; le principal coût vient de la fréquence 5 000 km."
};

export const cfmoto450nkV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto CFMOTO 450 NK : 5 000 km, 2,5 L, BN8RTI, soupapes 40 000 km et consommables.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "47,5 ch"
    },
    {
      "label": "COUPLE",
      "value": "39 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "449 cm³"
    },
    {
      "label": "SELLE",
      "value": "795 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "14 L"
    },
    {
      "label": "PERMIS",
      "value": "A2"
    }
  ],
  "quick_maintenance": [
    {
      "label": "1ère révision",
      "value": "1 000 km",
      "confidence": "official_fr"
    },
    {
      "label": "Révisions",
      "value": "5 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "10W-40 · JASO MA2",
      "confidence": "official_eu"
    },
    {
      "label": "Quantité",
      "value": "2,5 L",
      "confidence": "official_eu"
    },
    {
      "label": "Bougie",
      "value": "BN8RTI",
      "confidence": "official_eu"
    },
    {
      "label": "Soupapes",
      "value": "40 000 km",
      "confidence": "official_eu"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Révision de rodage",
      "price_estimate": "≈130–200 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles généraux de rodage",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 5000,
      "months": 12,
      "title": "Entretien périodique",
      "price_estimate": "≈130–200 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 10000,
      "title": "Entretien renforcé",
      "price_estimate": "≈220–350 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air et bougies selon table",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 15000,
      "title": "Entretien périodique",
      "price_estimate": "≈130–200 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 20000,
      "title": "Entretien renforcé",
      "price_estimate": "≈220–350 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Répéter le cycle renforcé",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 25000,
      "title": "Entretien périodique",
      "price_estimate": "≈130–200 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 30000,
      "title": "Entretien renforcé",
      "price_estimate": "≈220–350 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Répéter le cycle renforcé",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 35000,
      "title": "Entretien périodique",
      "price_estimate": "≈130–200 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 40000,
      "title": "Révision majeure",
      "price_estimate": "≈420–750 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Contrôle du jeu aux soupapes",
          "source_type": "official_eu"
        },
        {
          "label": "Entretien périodique complet",
          "source_type": "official_eu"
        }
      ]
    }
  ],
  "budget": {
    "title": "Repères de coût d'entretien",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈1 180–1 850 €",
      "cost_per_km": "≈0,039–0,062 €/km",
      "interval_rule": "1 000 km puis tous les 5 000 km / 1 an",
      "note": "Calcul LabelMoto basé sur l’addition des fourchettes des révisions programmées jusqu’à 30 000 km. Pneus, kit chaîne, plaquettes, batterie et autres consommables d’usure sont exclus du total principal afin de conserver une comparaison cohérente entre motos."
    },
    "cards": [
      {
        "label": "Kit chaîne",
        "value": "≈100–150 € pièces · ≈160–220 € monté",
        "note": "Fourchette LabelMoto issue de pièces compatibles et montage observés."
      },
      {
        "label": "Train de pneus",
        "value": "≈275 € pièces · ≈310–345 € monté",
        "note": "Repère observé en dimensions 110/70 R17 et 150/60 R17."
      },
      {
        "label": "Plaquettes",
        "value": "≈45–50 € le jeu",
        "note": "Repère pièces adaptables ; référence à vérifier selon essieu."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. Les tarifs atelier varient selon la région, la main-d’œuvre et les opérations réellement nécessaires."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "10W-40 · JASO MA2 · 2,5 L",
      "rows": [
        {
          "label": "Viscosité",
          "value": "10W-40",
          "confidence": "official_eu"
        },
        {
          "label": "Norme",
          "value": "API SJ+ · JASO MA2",
          "confidence": "official_eu"
        },
        {
          "label": "Quantité",
          "value": "2,5 L",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "1 000 puis 5 000 km / 1 an",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Inspection 5 000 · remplacement 10 000 km",
      "rows": [
        {
          "label": "Inspection",
          "value": "5 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "10 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Poussière",
          "value": "Plus fréquent",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "bougie",
      "title": "Bougie(s)",
      "summary": "BN8RTI · 10 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "BN8RTI",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "10 000 km",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "40 000 km · 0,10–0,15 / 0,25–0,31 mm",
      "rows": [
        {
          "label": "Échéance",
          "value": "40 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Admission",
          "value": "0,10–0,15 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Échappement",
          "value": "0,25–0,31 mm",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Liquide organique · 2 ans",
      "rows": [
        {
          "label": "Remplacement",
          "value": "2 ans",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide de frein",
      "summary": "DOT 4 · 2 ans",
      "rows": [
        {
          "label": "Liquide",
          "value": "DOT 4",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "2 ans",
          "confidence": "official_eu"
        },
        {
          "label": "Avant",
          "value": "Ø320 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "Ø220 mm",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "110/70 R17 · 150/60 R17",
      "rows": [
        {
          "label": "Avant",
          "value": "110/70 R17",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "150/60 R17",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Contrôle / lubrification 1 000 km",
      "rows": [
        {
          "label": "Contrôle / lubrification",
          "value": "1 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Après pluie / lavage",
          "value": "Plus fréquent",
          "confidence": "official_eu"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "10W-40 · JASO MA2 · 2,5 L",
      "replacement_interval": "5 000 km / 1 an",
      "observed_price": "≈30–40 € pour 2,5 L",
      "source_type": "observed"
    },
    {
      "part": "Filtre à huile",
      "replacement_interval": "Avec l’huile",
      "observed_price": "≈8–15 €",
      "source_type": "observed"
    },
    {
      "part": "Filtre à air",
      "replacement_interval": "10 000 km",
      "observed_price": "≈9–14 €",
      "source_type": "observed"
    },
    {
      "part": "Bougies",
      "specification": "2 × BN8RTI",
      "replacement_interval": "Selon table applicable",
      "observed_price": "≈32–48 € les 2",
      "source_type": "observed"
    },
    {
      "part": "Liquide de refroidissement",
      "replacement_interval": "2 ans",
      "observed_price": "≈14–26 € / 2 L",
      "source_type": "observed"
    },
    {
      "part": "Liquide de frein",
      "specification": "DOT 4",
      "replacement_interval": "2 ans",
      "observed_price": "≈8–15 €",
      "source_type": "observed"
    },
    {
      "part": "Kit chaîne",
      "replacement_interval": "Selon usure",
      "observed_price": "≈100–150 € pièces · ≈160–220 € monté",
      "source_type": "estimate"
    },
    {
      "part": "Batterie AGM",
      "replacement_interval": "Selon état",
      "observed_price": "≈60–90 €",
      "source_type": "estimate"
    }
  ],
  "known_issues_v2": [
    {
      "title": "Révisions 5 000 km",
      "description": "Intervalle à intégrer au coût d'usage.",
      "type": "manufacturer_monitoring",
      "confidence": "official_fr"
    }
  ],
  "warranty": {
    "duration": "2 ans",
    "coverage": "2 ans pièces et main-d’œuvre",
    "market": "France",
    "maintenance_requirement": "Entretien selon le programme CFMOTO France dans le réseau agréé et carnet renseigné après chaque passage.",
    "legal_warranty_note": "Le contrat et le carnet remis avec la moto restent prioritaires."
  },
  "equivalents_v2": [
    {
      "name": "Honda CB500 Hornet",
      "reason": "A2 polyvalent"
    },
    {
      "name": "Kawasaki Ninja/Z500",
      "reason": "Même segment A2"
    }
  ],
  "verdict": {
    "title": "Plan moteur très lisible",
    "text": "CFMOTO 450 NK bénéficie de données de maintenance précises ; les tarifs atelier restent séparés des prix pièces.",
    "strengths": [
      "Soupapes 40 000 km",
      "A2",
      "Documentation solide"
    ],
    "weaknesses": [
      "Révisions 5 000 km"
    ]
  },
  "data_quality": {
    "market": "France / Europe",
    "model_year": "2024–2026",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": false,
    "pricing_type": "mixed",
    "last_verified": "18/09/2026",
    "sources": [
      {
        "label": "CFMOTO France · 450NK",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/modeles/450nk/",
        "note": "449 cm³, 47,5 ch, 39 Nm, 165 kg, 795 mm, 14 L et partie-cycle France actuelle."
      },
      {
        "label": "CFMOTO France · conseils d'entretien",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/conseils-entretien/",
        "note": "Priorité pour le calendrier France."
      },
      {
        "label": "CFMOTO France · garantie",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/garantie/",
        "note": "Le contrat remis avec la moto reste prioritaire."
      },
      {
        "label": "CFMOTO Europe · manuel/table CFMOTO 450 NK",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2024–2026",
        "note": "2,5 L, BN8RTI, air 10k, soupapes 40k."
      },
      {
        "label": "Only-CFMOTO · prix consommables observés",
        "type": "observed",
        "market": "France",
        "model_year": "07/09/2026",
        "url": "https://only-cfmoto.com/",
        "note": "Prix variables, non tarif constructeur."
      }
    ]
  }
};

import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

/** READY V2 LabelMoto · vérifié le 21/09/2026 · sources France priorisées. */
export const voge900dsxDisplayData = {
  "modelName": "Voge DS900X",
  "model": "Voge DS900X",
  "year": "2025+ Euro 5+",
  "category": "Trail A2 / A",
  "introduction": "Maxi-trail 895 cm³ Euro 5+ de 94 ch sur la page France actuelle. Le manuel France fixe 1 000 km puis 10 000 km/1 an, huile 5W-40 SN+ en remplissage standard de 3,0 L et soupapes à 40 000 km.",
  "engine": {
    "type": "Bicylindre parallèle 270°, liquide, DOHC, 8 soupapes",
    "displacement": "895 cm³",
    "power": "70 kW / 94 ch",
    "torque": "94 Nm (page France actuelle)",
    "bridage": "Version A2 35 kW disponible",
    "alimentation": "Injection EFI"
  },
  "cycleParts": {
    "frontTire": "90/90-21",
    "rearTire": "150/70 R17",
    "frontBrake": "Double disque Ø305 mm",
    "rearBrake": "Disque Ø265 mm"
  },
  "dimensions": {
    "wetWeight": "215 kg en ordre de marche sans essence · page VOGE France actuelle",
    "seatHeight": "825 mm",
    "tank": "17 L"
  },
  "faq": [
    {
      "question": "Quand réviser ?",
      "answer": "1 000 km, puis tous les 10 000 km ou selon le terme annuel atteint en premier."
    },
    {
      "question": "Quelle huile ?",
      "answer": "Le manuel France indique 5W-40, niveau SN ou supérieur, avec 3,0 L en remplissage standard ; 2,8 L sans remplacement du filtre secondaire et 3,2 L pour un entretien moteur complet."
    },
    {
      "question": "Quand faire les soupapes ?",
      "answer": "40 000 km ; jeux 0,11–0,20 mm à l'admission et 0,26–0,35 mm à l'échappement."
    },
    {
      "question": "Quelle bougie ?",
      "answer": "LMAR9J-9E, deux unités, référence OEM 270960098-0001."
    }
  ],
  "longevityTips": [
    "Ne pas remplacer la préconisation 5W-40 du manuel par la viscosité d'un kit commercial sans justification.",
    "Contrôler la chaîne à chaque échéance et après roulage poussiéreux ou humide.",
    "Respecter les échéances de fluides même avec un faible kilométrage."
  ],
  "conclusion": "La DS900X bénéficie du plus long intervalle des quatre fiches : 10 000 km. Les opérations majeures à 20/30/40 000 km et les consommables OEM sont désormais documentés."
};

export const voge900dsxV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto Voge DS900X Euro 5+ : 10 000 km, 5W-40 SN+, 3,0 L, LMAR9J-9E, soupapes 40 000 km et budget 30 000 km.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "94 ch"
    },
    {
      "label": "COUPLE",
      "value": "94 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "895 cm³"
    },
    {
      "label": "SELLE",
      "value": "825 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "17 L"
    },
    {
      "label": "PERMIS",
      "value": "A2 / A"
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
      "value": "10 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "5W-40 SN+ · 3,0 L",
      "confidence": "official_fr"
    },
    {
      "label": "Bougies",
      "value": "2 × LMAR9J-9E · 20 000 km",
      "confidence": "official_fr"
    },
    {
      "label": "Soupapes",
      "value": "40 000 km",
      "confidence": "official_fr"
    },
    {
      "label": "Refroidissement",
      "value": "2,0 L · glycol -45 °C",
      "confidence": "official_fr"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "months": 6,
      "title": "Première révision",
      "price_estimate": "≈130–220 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôles après rodage",
          "source_type": "observed"
        }
      ]
    },
    {
      "km": 10000,
      "months": 12,
      "title": "Entretien",
      "price_estimate": "≈300–430 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôles freins, chaîne, roues et pneus",
          "source_type": "official_fr"
        },
        {
          "label": "Filtre à air inclus dans le forfait atelier ; manuel France le programme à partir de 20 000 km",
          "source_type": "multiple_sources"
        }
      ]
    },
    {
      "km": 20000,
      "months": 24,
      "title": "Révision complète",
      "price_estimate": "≈580–800 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Filtre à air + bougies + filtre à carburant",
          "source_type": "official_fr"
        },
        {
          "label": "Guide chaîne, suspensions, roulements",
          "source_type": "observed"
        }
      ]
    },
    {
      "km": 30000,
      "months": 36,
      "title": "Entretien + liquides",
      "price_estimate": "≈400–560 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Entretien périodique",
          "source_type": "official_fr"
        },
        {
          "label": "Liquide de frein",
          "source_type": "official_fr"
        },
        {
          "label": "Liquide de refroidissement",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 40000,
      "months": 48,
      "title": "Grande révision",
      "price_estimate": "≈780–1 050 € · soupapes incluses selon besoin",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle 20 000 km complet",
          "source_type": "official_fr"
        },
        {
          "label": "Jeu aux soupapes",
          "source_type": "official_fr"
        },
        {
          "label": "Lubrification roulements colonne de direction",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 50000,
      "months": 60,
      "title": "Entretien",
      "price_estimate": "≈300–430 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Filtre à air selon plan / forfait atelier",
          "source_type": "multiple_sources"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 60000,
      "months": 72,
      "title": "Révision complète",
      "price_estimate": "≈580–800 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Filtre à air + bougies + filtre à carburant",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôles majeurs",
          "source_type": "official_fr"
        }
      ]
    }
  ],
  "budget": {
    "title": "Budget entretien atelier · 30 000 km / 3 ans",
    "cards": [
      {
        "label": "Budget estimé 30 000 km",
        "value": "≈1 450–1 900 €"
      },
      {
        "label": "Moyenne annuelle estimée",
        "value": "≈480–635 € / an"
      },
      {
        "label": "Coût entretien calculé",
        "value": "≈4,8–6,4 c€/km"
      },
      {
        "label": "Hors usure",
        "value": "Pneus, kit chaîne, batterie"
      }
    ],
    "note": "Fourchette LabelMoto construite à partir des forfaits atelier observés en septembre 2026. Les tarifs réels varient selon atelier, région et opérations supplémentaires."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "5W-40 SN+ · 3,0 L standard",
      "rows": [
        {
          "label": "Spécification",
          "value": "5W-40 · API SN ou supérieure",
          "confidence": "official_fr"
        },
        {
          "label": "Remplissage standard",
          "value": "3,0 L",
          "confidence": "official_fr"
        },
        {
          "label": "Sans filtre secondaire",
          "value": "2,8 L",
          "confidence": "official_fr"
        },
        {
          "label": "Entretien moteur complet",
          "value": "3,2 L",
          "confidence": "official_fr"
        },
        {
          "label": "Échéance",
          "value": "1 000 puis 10 000 km / 1 an",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "OEM 180100181-0001 · manuel à partir de 20 000 km",
      "rows": [
        {
          "label": "Manuel France",
          "value": "20 000 / 30 000 / 40 000 / 50 000 / 60 000 km",
          "confidence": "official_fr"
        },
        {
          "label": "Forfait atelier observé",
          "value": "Remplacement inclus dès 10 000 km",
          "confidence": "observed"
        },
        {
          "label": "Référence OEM",
          "value": "180100181-0001",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "bougie",
      "title": "Bougies",
      "summary": "2 × LMAR9J-9E · 20 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "LMAR9J-9E",
          "confidence": "official_fr"
        },
        {
          "label": "Écartement",
          "value": "0,8–0,9 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Référence OEM",
          "value": "270960098-0001",
          "confidence": "technical_documentation"
        },
        {
          "label": "Remplacement",
          "value": "20 000 / 40 000 / 60 000 km",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "40 000 km · 0,11–0,20 / 0,26–0,35 mm",
      "rows": [
        {
          "label": "Admission",
          "value": "0,11–0,20 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Échappement",
          "value": "0,26–0,35 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Contrôle / réglage",
          "value": "40 000 km",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "2,0 L · glycol -45 °C · 2 ans",
      "rows": [
        {
          "label": "Spécification",
          "value": "Glycol, point de congélation -45 °C",
          "confidence": "official_fr"
        },
        {
          "label": "Capacité",
          "value": "2,0 L",
          "confidence": "official_fr"
        },
        {
          "label": "Remplacement manuel",
          "value": "2 ans ; tableau à 30 000 km",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide de frein",
      "summary": "Double Ø305 / Ø265 mm",
      "rows": [
        {
          "label": "Avant",
          "value": "Double disque Ø305 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "Disque Ø265 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Liquide de frein",
          "value": "Remplacement au passage 30 000 km dans le tableau ; échéance temporelle à respecter",
          "confidence": "official_fr"
        },
        {
          "label": "Durites",
          "value": "4 ans",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "90/90-21 · 150/70 R17",
      "rows": [
        {
          "label": "Avant",
          "value": "90/90-21 M/C 54V",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "150/70 R17 M/C 69V",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "525UXI · 122 maillons",
      "rows": [
        {
          "label": "Chaîne",
          "value": "525UXI · 122 maillons",
          "confidence": "official_fr"
        },
        {
          "label": "Entretien",
          "value": "Contrôler / lubrifier / régler selon chaque échéance du tableau",
          "confidence": "official_fr"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Filtre à huile",
      "specification": "OEM DS900X / SR4",
      "reference_oem": "150350061-0001",
      "replacement_interval": "À chaque vidange",
      "observed_price": "16,36 € TTC",
      "source_type": "observed"
    },
    {
      "part": "Filtre à air",
      "specification": "OEM DS800 Rally / DS900",
      "reference_oem": "180100181-0001",
      "replacement_interval": "Selon manuel / forfait atelier",
      "observed_price": "3,47 € TTC",
      "source_type": "observed"
    },
    {
      "part": "Bougies",
      "specification": "LMAR9J-9E · quantité 2",
      "reference_oem": "270960098-0001",
      "replacement_interval": "20 000 km",
      "observed_price": "25,13 € TTC / pièce",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes avant",
      "specification": "1 jeu par étrier · quantité 2",
      "reference_oem": "291710107-0001",
      "replacement_interval": "Selon usure",
      "observed_price": "109,40 € TTC / jeu",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes arrière",
      "specification": "Jeu arrière",
      "reference_oem": "292020056-0001",
      "replacement_interval": "Selon usure",
      "observed_price": "102,47 € TTC",
      "source_type": "observed"
    }
  ],
  "known_issues_v2": [
    {
      "title": "Couple France actuel vs manuel",
      "description": "La page VOGE France Euro 5+ actuelle affiche 94 Nm, tandis que le manuel utilisateur consulté indique 95 Nm. La fiche d'affichage retient 94 Nm pour le marché France actuel et conserve le manuel pour les données d'entretien.",
      "type": "manufacturer_monitoring",
      "confidence": "multiple_sources"
    },
    {
      "title": "Filtre à air : manuel et forfait atelier différents",
      "description": "Le tableau du manuel programme le remplacement à partir de 20 000 km, alors que le forfait du concessionnaire officiel inclut un filtre neuf dès 10 000 km. Les deux pratiques sont affichées séparément.",
      "type": "manufacturer_monitoring",
      "confidence": "multiple_sources"
    },
    {
      "title": "Poids page France vs manuel",
      "description": "La page VOGE France Euro 5+ actuelle affiche 215 kg en ordre de marche sans essence, tandis que le manuel utilisateur indique 238 kg sous l'intitulé poids à vide. La fiche d'affichage retient la page France actuelle et garde le manuel pour l'entretien.",
      "type": "manufacturer_monitoring",
      "confidence": "multiple_sources"
    }
  ],
  "warranty": {
    "duration": "3 ans pièces et main-d’œuvre selon la politique VOGE France observée ; plafond 80 000 km indiqué par le concessionnaire officiel consulté",
    "market": "France",
    "maintenance_requirement": "Respecter le plan constructeur 1 000 km puis 10 000 km/temps et conserver les justificatifs.",
    "claim_requirement": "Conditions contractuelles et carnet du véhicule prioritaires.",
    "source_label": "VOGE France + concessionnaire officiel VOGE"
  },
  "equivalents_v2": [
    {
      "name": "BMW F 900 GS",
      "reason": "Trail 900 cm³ orienté voyage/tout-chemin"
    },
    {
      "name": "Triumph Tiger 900",
      "reason": "Trail 900 cm³ polyvalent"
    }
  ],
  "verdict": {
    "title": "Intervalle 10 000 km et opérations lourdes bien espacées",
    "text": "La DS900X est la plus espacée des quatre VOGE étudiées. Le budget 30 000 km est directement reproductible à partir des forfaits atelier publiés.",
    "strengths": [
      "10 000 km / 1 an",
      "Jeux soupapes documentés",
      "Budget 30 000 km reproductible"
    ],
    "weaknesses": [
      "Écarts mineurs entre page produit, manuel et forfait atelier à conserver visibles"
    ]
  },
  "data_quality": {
    "market": "France",
    "model_year": "2025–2026 Euro 5+",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": false,
    "pricing_type": "mixed",
    "last_verified": "22/09/2026",
    "sources": [
      {
        "label": "VOGE France · DS900X Euro 5+",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/product/ds900x-e5plus/",
        "note": "Caractéristiques France actuelles : 895 cm³, 94 ch, 94 Nm, A2 disponible."
      },
      {
        "label": "VOGE France · manuel utilisateur DS900X",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/manuel-voge-ds900x/",
        "note": "Calendrier 1k/10k, huile 5W-40 SN+, jeux soupapes, pneus, chaîne et fluides."
      },
      {
        "label": "La Maison du Scooter · forfait VOGE 900 DSX",
        "type": "observed",
        "market": "France",
        "url": "https://lamaisonduscooter.fr/forfaits/forfait-revision-voge-900-800-dsx/",
        "note": "Tarifs atelier et opérations détaillées ; concessionnaire officiel, pas tarif national."
      },
      {
        "label": "La Maison du Scooter · coût d'entretien VOGE",
        "type": "observed",
        "market": "France",
        "url": "https://lamaisonduscooter.fr/cout-entretien-voge-par-an/",
        "note": "Total 30 000 km publié : ≈1 450–1 900 €."
      },
      {
        "label": "AZ Motors · consommables DS900X",
        "type": "technical_documentation",
        "market": "France",
        "url": "https://www.azmotors.fr/PIECES_VOGE/MOTO_TRAIL_900/vue-eclate-DS_900_X_E5_2025/1_CONSOMMABLES_REVISION.html",
        "note": "Références OEM, quantités et prix TTC observés."
      },
      {
        "label": "AZ Motors · bougie DS900X",
        "type": "technical_documentation",
        "market": "France",
        "url": "https://www.azmotors.fr/PIECES_VOGE/HUILE_VOGE/article-270960098-0001.html",
        "note": "LMAR9J-9E réf. 270960098-0001, prix observé."
      }
    ]
  }
};

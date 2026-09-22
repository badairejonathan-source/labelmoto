import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

/** READY V2 LabelMoto · vérifié le 21/09/2026 · sources France priorisées. */
export const vogeDs800xRallyDisplayData = {
  "modelName": "Voge DS800X Rally",
  "model": "Voge DS800X Rally",
  "year": "2025+",
  "category": "Trail adventure A",
  "introduction": "Trail rally bicylindre 798 cm³ de 95 ch. Le manuel France fixe 1 000 km puis 6 000 km/1 an, 10W-40 SL+ et 3,0 L en remplissage standard, soupapes à 36 000 km et refroidissement 1,75 L.",
  "engine": {
    "type": "Bicylindre parallèle 270°, liquide, DOHC, 8 soupapes",
    "displacement": "798 cm³",
    "power": "70 kW / 95 ch",
    "torque": "81 Nm",
    "bridage": "Permis A",
    "alimentation": "Injection Bosch EFI"
  },
  "cycleParts": {
    "frontTire": "90/90-21",
    "rearTire": "150/70 R18",
    "frontBrake": "Double disque Ø310 mm, étriers Nissin radiaux 4 pistons",
    "rearBrake": "Disque Ø240 mm"
  },
  "dimensions": {
    "wetWeight": "213 kg en ordre de marche sans essence selon VOGE France",
    "seatHeight": "850 mm",
    "tank": "24 L"
  },
  "faq": [
    {
      "question": "Quand réviser ?",
      "answer": "Première visite à 1 000 km, puis tous les 6 000 km ou selon le terme annuel atteint en premier."
    },
    {
      "question": "Quelle huile ?",
      "answer": "10W-40, niveau SL ou supérieur ; 3,0 L en remplissage standard. Le manuel indique 2,8 L sans remplacement du filtre secondaire et 3,2 L lors d'un entretien moteur complet."
    },
    {
      "question": "Quand faire les soupapes ?",
      "answer": "36 000 km selon le tableau France ; jeux 0,15–0,20 mm à l'admission et 0,20–0,25 mm à l'échappement."
    },
    {
      "question": "Quelle bougie ?",
      "answer": "LMAR8J-9E, référence OEM 270960066-0001."
    }
  ],
  "longevityTips": [
    "Nettoyer/contrôler plus souvent le filtre à air en usage tout-terrain.",
    "Surveiller et graisser la chaîne après pluie, boue ou poussière.",
    "Respecter le remplacement de l'huile de fourche prévu à 24 000 km."
  ],
  "conclusion": "Le manuel France et les microfiches permettent de documenter précisément le cycle 6 000 km, les fluides, les références OEM et les opérations majeures."
};

export const vogeDS800XRallyV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto Voge DS800X Rally : 6 000 km, 3,0 L de 10W-40, LMAR8J-9E, soupapes 36 000 km et budget 30 000 km.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "95 ch"
    },
    {
      "label": "COUPLE",
      "value": "81 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "798 cm³"
    },
    {
      "label": "SELLE",
      "value": "850 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "24 L"
    },
    {
      "label": "PERMIS",
      "value": "A"
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
      "value": "6 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "10W-40 SL+ · 3,0 L",
      "confidence": "official_fr"
    },
    {
      "label": "Filtre à air",
      "value": "12 000 km",
      "confidence": "official_fr"
    },
    {
      "label": "Bougie",
      "value": "LMAR8J-9E · 18 000 km",
      "confidence": "official_fr"
    },
    {
      "label": "Soupapes",
      "value": "36 000 km",
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
      "km": 6000,
      "months": 12,
      "title": "Vidange",
      "price_estimate": "≈120–220 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Chaîne, freins, pneus, niveaux",
          "source_type": "observed"
        }
      ]
    },
    {
      "km": 12000,
      "months": 24,
      "title": "Entretien",
      "price_estimate": "≈320–470 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Vidange + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Filtre à air",
          "source_type": "official_fr"
        },
        {
          "label": "Roulements de roue / embrayage / admission",
          "source_type": "observed"
        }
      ]
    },
    {
      "km": 18000,
      "months": 36,
      "title": "Entretien renforcé",
      "price_estimate": "≈280–420 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Vidange + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Bougie LMAR8J-9E",
          "source_type": "official_fr"
        },
        {
          "label": "Suspensions avant et arrière",
          "source_type": "observed"
        }
      ]
    },
    {
      "km": 24000,
      "months": 48,
      "title": "Révision complète",
      "price_estimate": "≈420–620 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Vidange + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Filtre à air",
          "source_type": "official_fr"
        },
        {
          "label": "Huile de suspension avant",
          "source_type": "official_fr"
        },
        {
          "label": "Lubrification roulements colonne de direction",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 30000,
      "months": 60,
      "title": "Vidange",
      "price_estimate": "≈120–220 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôles périodiques",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 36000,
      "months": 72,
      "title": "Grande révision",
      "price_estimate": "≈700–950 € · soupapes incluses selon besoin",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle 24 000 km + bougie",
          "source_type": "official_fr"
        },
        {
          "label": "Liquide de frein + liquide de refroidissement",
          "source_type": "official_fr"
        },
        {
          "label": "Jeu aux soupapes",
          "source_type": "official_fr"
        },
        {
          "label": "Durites radiateur / joints toriques",
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
        "value": "≈1 500–2 000 €"
      },
      {
        "label": "Moyenne annuelle estimée",
        "value": "≈500–670 € / an"
      },
      {
        "label": "Coût entretien calculé",
        "value": "≈5,0–6,7 c€/km"
      },
      {
        "label": "Hors usure",
        "value": "Pneus, kit chaîne, batterie"
      }
    ],
    "note": "Fourchette LabelMoto construite à partir de la grille atelier observée en septembre 2026. Une ancienne grille reste visible dans certains caches : les montants sont donc volontairement affichés en fourchettes, pas comme tarifs nationaux VOGE."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "10W-40 SL+ · 3,0 L standard",
      "rows": [
        {
          "label": "Spécification",
          "value": "10W-40 · API SL ou supérieure",
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
          "value": "1 000 puis 6 000 km / 1 an",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "12 000 km · OEM 180100181-0001",
      "rows": [
        {
          "label": "Remplacement",
          "value": "12 000 / 24 000 / 36 000 km",
          "confidence": "official_fr"
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
      "title": "Bougie",
      "summary": "LMAR8J-9E · 18 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "LMAR8J-9E",
          "confidence": "official_fr"
        },
        {
          "label": "Écartement",
          "value": "0,8–0,9 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Référence OEM",
          "value": "270960066-0001",
          "confidence": "technical_documentation"
        },
        {
          "label": "Remplacement",
          "value": "18 000 / 36 000 km",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "36 000 km · 0,15–0,20 / 0,20–0,25 mm",
      "rows": [
        {
          "label": "Admission",
          "value": "0,15–0,20 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Échappement",
          "value": "0,20–0,25 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Contrôle / réglage",
          "value": "36 000 km",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "1,75 L · glycol -45 °C · 2 ans",
      "rows": [
        {
          "label": "Spécification",
          "value": "Glycol, point de congélation -45 °C",
          "confidence": "official_fr"
        },
        {
          "label": "Capacité",
          "value": "1,75 L",
          "confidence": "official_fr"
        },
        {
          "label": "Remplacement",
          "value": "2 ans ; tableau kilométrique à 36 000 km",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide de frein",
      "summary": "Double Ø310 / Ø240 mm · liquide à 36 000 km",
      "rows": [
        {
          "label": "Avant",
          "value": "Double disque Ø310 mm · Nissin radial 4 pistons",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "Disque Ø240 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Liquide de frein",
          "value": "Remplacement 36 000 km selon tableau",
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
      "summary": "90/90-21 · 150/70 R18",
      "rows": [
        {
          "label": "Avant",
          "value": "90/90-21",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "150/70 R18",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "525SX2 · 122 maillons",
      "rows": [
        {
          "label": "Chaîne",
          "value": "525SX2 · 122 maillons",
          "confidence": "official_fr"
        },
        {
          "label": "Entretien",
          "value": "Contrôler / lubrifier / régler à chaque échéance",
          "confidence": "official_fr"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Filtre à huile",
      "specification": "OEM VOGE 500/525/625/800",
      "reference_oem": "150350015-0001",
      "replacement_interval": "À chaque vidange",
      "observed_price": "15,18 € TTC",
      "source_type": "observed"
    },
    {
      "part": "Filtre à air",
      "specification": "OEM DS800 Rally / DS900",
      "reference_oem": "180100181-0001",
      "replacement_interval": "12 000 km",
      "observed_price": "3,47 € TTC",
      "source_type": "observed"
    },
    {
      "part": "Bougie",
      "specification": "LMAR8J-9E",
      "reference_oem": "270960066-0001",
      "replacement_interval": "18 000 km",
      "observed_price": "17,42 € TTC",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes avant",
      "specification": "1 jeu par étrier · quantité 2",
      "reference_oem": "291710120-0001",
      "replacement_interval": "Selon usure",
      "observed_price": "112,67 € TTC / jeu",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes arrière",
      "specification": "Jeu arrière",
      "reference_oem": "292400052-0001",
      "replacement_interval": "Selon usure",
      "observed_price": "97,18 € TTC",
      "source_type": "observed"
    }
  ],
  "known_issues_v2": [
    {
      "title": "Ancienne grille tarifaire encore présente dans certains caches",
      "description": "La page détaillée atelier a été vue avec une ancienne série de forfaits, tandis que la grille générale et le récapitulatif septembre 2026 affichent 159/389/339/499/669 € et un total 30 000 km de 1 704 €. La fiche retient les sources les plus récentes et date explicitement ces prix.",
      "type": "manufacturer_monitoring",
      "confidence": "multiple_sources"
    }
  ],
  "warranty": {
    "duration": "3 ans pièces et main-d’œuvre selon VOGE France ; plafond 80 000 km indiqué par le concessionnaire officiel consulté",
    "market": "France",
    "maintenance_requirement": "Respecter le calendrier 1 000 km puis 6 000 km/temps et faire consigner les passages.",
    "claim_requirement": "Conditions contractuelles et carnet du véhicule prioritaires.",
    "source_label": "VOGE France + concessionnaire officiel VOGE"
  },
  "equivalents_v2": [
    {
      "name": "Yamaha Ténéré 700",
      "reason": "Trail adventure 21/18 pouces"
    },
    {
      "name": "CFMOTO 800MT-X",
      "reason": "Trail adventure bicylindre de cylindrée proche"
    }
  ],
  "verdict": {
    "title": "Plan 6 000 km très lisible",
    "text": "La DS800X Rally possède désormais une fiche exploitable : calendrier exact, jeux soupapes, fluides, références OEM, opérations atelier et budget 30 000 km sont sourcés.",
    "strengths": [
      "Manuel France récent",
      "Soupapes et fluides chiffrés",
      "Références OEM détaillées"
    ],
    "weaknesses": [
      "Révisions plus rapprochées que la DS900X",
      "Tarifs atelier à dater car la grille a changé récemment"
    ]
  },
  "data_quality": {
    "market": "France",
    "model_year": "2025–2026",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": false,
    "pricing_type": "mixed",
    "last_verified": "22/09/2026",
    "sources": [
      {
        "label": "VOGE France · DS800X Rally",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/product/ds800xrally/",
        "note": "Caractéristiques France actuelles : 798 cm³, 95 ch, 81 Nm, 850 mm, 24 L, pneus 21/18."
      },
      {
        "label": "VOGE France · manuel utilisateur DS800X Rally",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/manuel-ds800x-fr_/",
        "note": "Calendrier 1k/6k, huile, capacités, bougie, jeux soupapes, refroidissement et chaîne."
      },
      {
        "label": "VOGE France · présentation DS800 Rally",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/voge-ds800-rally-2/",
        "note": "Garantie 3 ans PMO et positionnement modèle."
      },
      {
        "label": "La Maison du Scooter · grille forfaits VOGE",
        "type": "observed",
        "market": "France",
        "url": "https://lamaisonduscooter.fr/forfaits/",
        "note": "Grille atelier actuelle de septembre 2026 ; concessionnaire officiel, pas tarif national."
      },
      {
        "label": "La Maison du Scooter · coût d'entretien VOGE",
        "type": "observed",
        "market": "France",
        "url": "https://lamaisonduscooter.fr/cout-entretien-voge-par-an/",
        "note": "Total 30 000 km publié : ≈1 500–2 000 €."
      },
      {
        "label": "AZ Motors · microfiches DS800 Rally",
        "type": "technical_documentation",
        "market": "France",
        "url": "https://www.azmotors.fr/PIECES_VOGE/800_RALLY/vue-eclate-800DS-RALLY-EURO5/FREINS.html",
        "note": "Plaquettes OEM et prix observés ; autres microfiches utilisées pour filtres et bougie."
      }
    ]
  }
};

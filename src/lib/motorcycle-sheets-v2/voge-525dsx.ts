import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

/** READY V2 LabelMoto · vérifié le 21/09/2026 · sources France priorisées. */
export const voge525dsxDisplayData = {
  "modelName": "Voge 525 DSX",
  "model": "Voge 525 DSX",
  "year": "2023+",
  "category": "Trail A2",
  "introduction": "Trail bicylindre 494 cm³. Le manuel France fixe 1 000 km puis 5 000 km/1 an, huile 10W-40, remplissage 2,5 L, soupapes à 10 000 km et pneus 19/17 pouces.",
  "engine": {
    "type": "Bicylindre en ligne, liquide, DOHC, 8 soupapes",
    "displacement": "494 cm³",
    "power": "35 kW / 47,6 ch",
    "torque": "50,5 Nm",
    "bridage": "A2 natif",
    "alimentation": "Injection EFI"
  },
  "cycleParts": {
    "frontTire": "110/80 R19",
    "rearTire": "150/70 R17",
    "frontBrake": "Double disque Ø298 mm",
    "rearBrake": "Disque Ø240 mm"
  },
  "dimensions": {
    "wetWeight": "196 kg selon manuel",
    "seatHeight": "810 / 830 mm selon configuration",
    "tank": "17,6 L selon manuel"
  },
  "faq": [
    {
      "question": "Quand faire les révisions ?",
      "answer": "1 000 km, puis tous les 5 000 km ou selon l'échéance annuelle prévue par le manuel."
    },
    {
      "question": "Quelle huile et quelle quantité ?",
      "answer": "10W-40 ; le manuel indique 10W/40-SJ ou supérieur pour le remplissage, 2,5 L."
    },
    {
      "question": "Quand contrôler les soupapes ?",
      "answer": "Le tableau France les prévoit à 10 000, 20 000 et 30 000 km."
    },
    {
      "question": "Quelle bougie ?",
      "answer": "La microfiche OEM donne CPR8EA-9 réf. 270960060-0001. Le manuel France imprime RCP8EA-9 : LabelMoto conserve cette divergence dans la fiche."
    }
  ],
  "longevityTips": [
    "Respecter l'échéance annuelle même si 5 000 km ne sont pas atteints.",
    "Raccourcir l'entretien du filtre à air et de la chaîne en usage poussiéreux.",
    "Contrôler tension et lubrification de chaîne à chaque passage atelier."
  ],
  "conclusion": "Calendrier France, jeux aux soupapes, fluides, références OEM et budget atelier 30 000 km sont documentés ; la seule divergence éditoriale conservée concerne l'ordre des lettres de la référence de bougie dans le manuel."
};

export const voge525dsxV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto Voge 525 DSX : révisions 5 000 km, 2,5 L de 10W-40, soupapes 10 000 km, références OEM et budget 30 000 km.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "47,6 ch"
    },
    {
      "label": "COUPLE",
      "value": "50,5 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "494 cm³"
    },
    {
      "label": "SELLE",
      "value": "810 / 830 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "17,6 L"
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
      "value": "10W-40 · 2,5 L",
      "confidence": "official_fr"
    },
    {
      "label": "Filtre à air",
      "value": "10 000 km",
      "confidence": "official_fr"
    },
    {
      "label": "Bougies",
      "value": "10 000 km",
      "confidence": "official_fr"
    },
    {
      "label": "Soupapes",
      "value": "10 000 km",
      "confidence": "official_fr"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Première révision",
      "price_estimate": "≈150–240 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôles après rodage : serrages, freins, chaîne, niveaux",
          "source_type": "observed"
        }
      ]
    },
    {
      "km": 5000,
      "months": 12,
      "title": "Vidange périodique",
      "price_estimate": "≈120–210 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Freins, chaîne, roues, pneus, serrages",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 10000,
      "months": 24,
      "title": "Entretien",
      "price_estimate": "≈280–420 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Filtre à air + filtre à carburant + bougies",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôle/réglage du jeu aux soupapes prévu par le manuel",
          "source_type": "official_fr"
        },
        {
          "label": "Suspensions, roulements, admission d'air",
          "source_type": "observed"
        }
      ]
    },
    {
      "km": 15000,
      "months": 36,
      "title": "Vidange intermédiaire",
      "price_estimate": "≈120–210 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôles généraux",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 20000,
      "months": 48,
      "title": "Grande révision",
      "price_estimate": "≈690–1 000 € · soupapes incluses selon besoin",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle 10 000 km complet",
          "source_type": "official_fr"
        },
        {
          "label": "Liquide de frein + liquide de refroidissement",
          "source_type": "official_fr"
        },
        {
          "label": "Lubrification roulements de colonne",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôle/réglage soupapes",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 25000,
      "months": 60,
      "title": "Vidange intermédiaire",
      "price_estimate": "≈120–210 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôles généraux",
          "source_type": "official_fr"
        }
      ]
    },
    {
      "km": 30000,
      "months": 72,
      "title": "Entretien",
      "price_estimate": "≈280–420 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile + filtre",
          "source_type": "official_fr"
        },
        {
          "label": "Filtre à air + filtre à carburant + bougies",
          "source_type": "official_fr"
        },
        {
          "label": "Contrôle/réglage du jeu aux soupapes prévu par le manuel",
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
        "value": "≈1 900–2 400 €"
      },
      {
        "label": "Moyenne annuelle estimée",
        "value": "≈630–800 € / an"
      },
      {
        "label": "Coût entretien calculé",
        "value": "≈6,3–8,0 c€/km"
      },
      {
        "label": "Hors usure",
        "value": "Pneus, kit chaîne, batterie, plaquettes"
      }
    ],
    "note": "Fourchette LabelMoto construite à partir des forfaits observés en septembre 2026 chez un concessionnaire officiel VOGE. Elle n'est pas un tarif national et varie selon atelier, région et opérations supplémentaires."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "10W-40 · SJ+ · 2,5 L",
      "rows": [
        {
          "label": "Viscosité",
          "value": "10W-40",
          "confidence": "official_fr"
        },
        {
          "label": "Spécification remplissage",
          "value": "SJ ou supérieure",
          "confidence": "official_fr"
        },
        {
          "label": "Volume de remplissage",
          "value": "2,5 L",
          "confidence": "official_fr"
        },
        {
          "label": "Remplacement",
          "value": "1 000 puis 5 000 km / 1 an",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Remplacement 10 000 km",
      "rows": [
        {
          "label": "Échéance",
          "value": "10 000 / 20 000 / 30 000 km",
          "confidence": "official_fr"
        },
        {
          "label": "Référence OEM observée",
          "value": "180100157-0001",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "bougie",
      "title": "Bougies",
      "summary": "2 × CPR8EA-9 OEM · 10 000 km",
      "rows": [
        {
          "label": "Échéance",
          "value": "10 000 / 20 000 / 30 000 km",
          "confidence": "official_fr"
        },
        {
          "label": "Référence OEM",
          "value": "270960060-0001 · CPR8EA-9",
          "confidence": "technical_documentation"
        },
        {
          "label": "Manuel France",
          "value": "RCP8EA-9 · écartement 0,8–0,9 mm",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "10 000 km · adm. 0,16±0,03 · éch. 0,27±0,03 mm",
      "rows": [
        {
          "label": "Admission",
          "value": "0,16 ± 0,03 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Échappement",
          "value": "0,27 ± 0,03 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Contrôle / réglage",
          "value": "10 000 / 20 000 / 30 000 km",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "1,5 L · remplacement 20 000 km selon tableau",
      "rows": [
        {
          "label": "Capacité",
          "value": "1,5 L",
          "confidence": "official_fr"
        },
        {
          "label": "Échéance kilométrique",
          "value": "20 000 km",
          "confidence": "official_fr"
        },
        {
          "label": "Durites radiateur / joints",
          "value": "3 ans",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide de frein",
      "summary": "Double Ø298 / Ø240 mm · liquide à 20 000 km",
      "rows": [
        {
          "label": "Avant",
          "value": "Double disque Ø298 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "Disque Ø240 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Liquide de frein",
          "value": "Remplacement 20 000 km selon tableau",
          "confidence": "official_fr"
        },
        {
          "label": "Durites de frein",
          "value": "4 ans",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "110/80 R19 · 150/70 R17",
      "rows": [
        {
          "label": "Avant",
          "value": "110/80 R19",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "150/70 R17",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "520UX · 118 maillons",
      "rows": [
        {
          "label": "Chaîne",
          "value": "520UX · 118 maillons",
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
      "specification": "OEM VOGE famille 500/525/625",
      "reference_oem": "150350015-0001",
      "replacement_interval": "À chaque vidange",
      "observed_price": "≈15–20 €",
      "source_type": "observed"
    },
    {
      "part": "Filtre à air",
      "specification": "OEM VOGE 500/525",
      "reference_oem": "180100157-0001",
      "replacement_interval": "10 000 km",
      "observed_price": "≈25–35 €",
      "source_type": "observed"
    },
    {
      "part": "Bougies",
      "specification": "CPR8EA-9 · quantité 2",
      "reference_oem": "270960060-0001",
      "replacement_interval": "10 000 km",
      "observed_price": "≈25–35 € / pièce",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes avant",
      "specification": "1 jeu par étrier · quantité 2",
      "reference_oem": "291710093-0001",
      "replacement_interval": "Selon usure",
      "observed_price": "≈70–85 € / jeu",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes arrière",
      "specification": "Jeu arrière",
      "reference_oem": "292400025-0001",
      "replacement_interval": "Selon usure",
      "observed_price": "≈60–75 €",
      "source_type": "observed"
    }
  ],
  "known_issues_v2": [
    {
      "title": "Référence de bougie divergente dans les sources",
      "description": "Le manuel France imprime RCP8EA-9, tandis que la microfiche OEM catalogue la pièce 270960060-0001 comme CPR8EA-9 pour 500/525/625. La référence de pièce OEM est affichée comme consommable et la divergence reste explicitement signalée.",
      "type": "manufacturer_monitoring",
      "confidence": "multiple_sources"
    }
  ],
  "warranty": {
    "duration": "3 ans pièces et main-d’œuvre selon VOGE France ; plafond 80 000 km indiqué par le concessionnaire officiel consulté",
    "market": "France",
    "maintenance_requirement": "Respecter le plan constructeur et le premier des termes kilométrage/temps atteint.",
    "claim_requirement": "Carnet et justificatifs d'entretien à conserver ; conditions contractuelles du véhicule prioritaires.",
    "source_label": "VOGE France + concessionnaire officiel VOGE"
  },
  "equivalents_v2": [
    {
      "name": "CFMOTO 450MT",
      "reason": "Trail A2 bicylindre de cylindrée intermédiaire"
    },
    {
      "name": "Honda NX500",
      "reason": "Trail A2 bicylindre routier/polyvalent"
    }
  ],
  "verdict": {
    "title": "Entretien fréquent mais très documenté",
    "text": "La DS525X suit un rythme de 5 000 km avec plusieurs opérations lourdes à 20 000 km. Les données France sont suffisamment précises pour une fiche V2 exploitable.",
    "strengths": [
      "Manuel France détaillé",
      "Références OEM disponibles",
      "Budget atelier 30 000 km publié"
    ],
    "weaknesses": [
      "Intervalle 5 000 km",
      "Divergence de libellé sur la bougie entre manuel et microfiche"
    ]
  },
  "data_quality": {
    "market": "France",
    "model_year": "2023–2025",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": false,
    "pricing_type": "mixed",
    "last_verified": "22/09/2026",
    "sources": [
      {
        "label": "VOGE France · manuel utilisateur DS525X",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/manuel-voge-525dsx/",
        "note": "Calendrier, huile, capacités, pneus, freins, chaîne et jeux aux soupapes."
      },
      {
        "label": "VOGE France · présentation 525 DSX",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/nouveau-525dsx-bienvenue-dans-le-monde-de-ladventure/",
        "note": "Garantie 3 ans PMO et contexte modèle."
      },
      {
        "label": "La Maison du Scooter · forfaits VOGE 525/625",
        "type": "observed",
        "market": "France",
        "url": "https://lamaisonduscooter.fr/forfaits/forfait-revision-voge-625/",
        "note": "Tarifs atelier France observés ; concessionnaire officiel, pas tarif national."
      },
      {
        "label": "La Maison du Scooter · coût d'entretien VOGE",
        "type": "observed",
        "market": "France",
        "url": "https://lamaisonduscooter.fr/cout-entretien-voge-par-an/",
        "note": "Total 30 000 km publié en septembre 2026."
      },
      {
        "label": "AZ Motors · microfiches VOGE",
        "type": "technical_documentation",
        "market": "France",
        "url": "https://www.azmotors.fr/",
        "note": "Références OEM et prix TTC observés des consommables."
      }
    ]
  }
};

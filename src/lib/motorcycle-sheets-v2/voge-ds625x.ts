import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

/** READY V2 LabelMoto · vérifié le 21/09/2026 · sources France priorisées. */
export const vogeDs625xDisplayData = {
  "modelName": "Voge DS625X",
  "model": "Voge DS625X",
  "year": "2025+",
  "category": "Trail A2 / A",
  "introduction": "Trail bicylindre 581 cm³ Euro 5+. Le manuel France impose 1 000 km puis 5 000 km/1 an. La procédure de vidange indique 3,0 L de 10W-40 SJ+ ; le tableau des paramètres mentionne parallèlement 2,5 L, divergence conservée explicitement.",
  "engine": {
    "type": "Bicylindre en ligne 270°, liquide, DOHC, 8 soupapes",
    "displacement": "581 cm³",
    "power": "47 kW / 63 ch",
    "torque": "57 Nm",
    "bridage": "Version A2 35 kW disponible",
    "alimentation": "Injection EFI"
  },
  "cycleParts": {
    "frontTire": "110/80-19",
    "rearTire": "150/70-17",
    "frontBrake": "Double disque Ø298 mm Nissin",
    "rearBrake": "Disque Ø240 mm Nissin"
  },
  "dimensions": {
    "wetWeight": "191 kg à sec · page VOGE France actuelle",
    "seatHeight": "835 mm",
    "tank": "17,6 L"
  },
  "faq": [
    {
      "question": "Quand réviser ?",
      "answer": "1 000 km, puis tous les 5 000 km ou selon l'échéance annuelle du tableau France."
    },
    {
      "question": "Combien d'huile à la vidange ?",
      "answer": "La procédure de remplissage du manuel indique 3,0 L de 10W-40 SJ ou supérieur. La table des paramètres mentionne 2,5 L ; la procédure de vidange est donc citée séparément et le niveau final doit toujours être contrôlé sur la moto."
    },
    {
      "question": "Quelle bougie ?",
      "answer": "CPR8EA-9, deux unités, référence OEM 270960060-0001."
    },
    {
      "question": "Quand contrôler les soupapes ?",
      "answer": "10 000, 20 000 et 30 000 km selon le tableau France."
    }
  ],
  "longevityTips": [
    "Contrôler le niveau final après remplissage en raison de la divergence 2,5/3,0 L du manuel.",
    "Respecter le premier terme atteint entre kilométrage et temps.",
    "Rapprocher filtre à air et entretien de chaîne en poussière."
  ],
  "conclusion": "Le plan France, les jeux aux soupapes, les références OEM et le budget atelier sont verrouillés ; la divergence interne du manuel sur la capacité d'huile reste visible au lieu d'être masquée."
};

export const vogeDs625xV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto Voge DS625X : 5 000 km, 10W-40, remplissage 3,0 L, CPR8EA-9, soupapes 10 000 km et budget 30 000 km.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "63 ch"
    },
    {
      "label": "COUPLE",
      "value": "57 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "581 cm³"
    },
    {
      "label": "SELLE",
      "value": "835 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "17,6 L"
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
      "value": "5 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "10W-40 SJ+ · remplissage 3,0 L",
      "confidence": "official_fr"
    },
    {
      "label": "Bougies",
      "value": "2 × CPR8EA-9",
      "confidence": "official_fr"
    },
    {
      "label": "Soupapes adm.",
      "value": "0,10–0,15 mm",
      "confidence": "official_fr"
    },
    {
      "label": "Soupapes éch.",
      "value": "0,15–0,20 mm",
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
      "summary": "10W-40 SJ+ · 3,0 L dans la procédure de remplissage",
      "rows": [
        {
          "label": "Viscosité / norme",
          "value": "10W-40 · SJ ou supérieure",
          "confidence": "official_fr"
        },
        {
          "label": "Procédure de remplissage",
          "value": "3,0 L",
          "confidence": "official_fr"
        },
        {
          "label": "Table des paramètres",
          "value": "2,5 L (10W-40 SG)",
          "confidence": "official_fr"
        },
        {
          "label": "Règle LabelMoto",
          "value": "Afficher les deux valeurs ; procédure de vidange priorisée, niveau final à contrôler",
          "confidence": "multiple_sources"
        },
        {
          "label": "Échéance",
          "value": "1 000 puis 5 000 km / 1 an",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "10 000 km · OEM 180100157-0001",
      "rows": [
        {
          "label": "Remplacement",
          "value": "10 000 / 20 000 / 30 000 km",
          "confidence": "official_fr"
        },
        {
          "label": "Référence OEM",
          "value": "180100157-0001",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "bougie",
      "title": "Bougies",
      "summary": "2 × CPR8EA-9 · 10 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "CPR8EA-9",
          "confidence": "official_fr"
        },
        {
          "label": "Écartement",
          "value": "0,8–1,0 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Référence OEM",
          "value": "270960060-0001",
          "confidence": "technical_documentation"
        },
        {
          "label": "Remplacement",
          "value": "10 000 / 20 000 / 30 000 km",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "10 000 km · 0,10–0,15 / 0,15–0,20 mm",
      "rows": [
        {
          "label": "Admission",
          "value": "0,10–0,15 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Échappement",
          "value": "0,15–0,20 mm",
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
      "summary": "2,0 L · remplacement 20 000 km selon tableau",
      "rows": [
        {
          "label": "Capacité",
          "value": "2,0 L",
          "confidence": "official_fr"
        },
        {
          "label": "Échéance kilométrique",
          "value": "20 000 km",
          "confidence": "official_fr"
        },
        {
          "label": "Durites / joints",
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
          "label": "Durites",
          "value": "4 ans",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "110/80-19 · 150/70-17",
      "rows": [
        {
          "label": "Avant",
          "value": "110/80-19",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "150/70-17",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "520S · 114 maillons",
      "rows": [
        {
          "label": "Chaîne",
          "value": "520S · 114 maillons",
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
      "specification": "OEM VOGE",
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
    },
    {
      "part": "Kit révision observé",
      "specification": "Filtres + huile Motul 7100 10W-40 (3 L)",
      "reference_oem": "VO-625-COMPL-7100MH",
      "replacement_interval": "Selon entretien",
      "observed_price": "≈135–155 €",
      "source_type": "observed"
    }
  ],
  "known_issues_v2": [
    {
      "title": "Deux capacités d'huile dans le même manuel",
      "description": "Le tableau des paramètres indique 2,5 L, tandis que la procédure de remplissage après vidange indique 3,0 L. La fiche ne fusionne pas ces valeurs : elle affiche 3,0 L comme volume de la procédure et conserve la valeur 2,5 L comme divergence documentaire.",
      "type": "manufacturer_monitoring",
      "confidence": "official_fr"
    },
    {
      "title": "Poids page France vs manuel",
      "description": "La page VOGE France actuelle annonce 191 kg à sec, tandis que le manuel DS625X indique 206 kg sous l'intitulé poids à vide. L'affichage retient la page France actuelle et conserve le manuel pour les données d'entretien.",
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
      "name": "CFMOTO 700MT",
      "reason": "Trail bicylindre A2/A de cylindrée proche"
    },
    {
      "name": "Suzuki V-Strom 650",
      "reason": "Trail routier bicylindre polyvalent"
    }
  ],
  "verdict": {
    "title": "Plan simple, documentation technique dense",
    "text": "La DS625X reprend un rythme 5 000 km mais apporte un manuel France très exploitable. Le seul point à traiter avec prudence est la double valeur de capacité d'huile.",
    "strengths": [
      "Manuel France complet",
      "Jeux soupapes chiffrés",
      "Références OEM et budget atelier"
    ],
    "weaknesses": [
      "Divergence 2,5/3,0 L dans le manuel",
      "Révisions tous les 5 000 km"
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
        "label": "VOGE France · DS625X",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/product/ds625x/",
        "note": "Caractéristiques France actuelles : 581 cm³, 63 ch, 57 Nm, A/A2."
      },
      {
        "label": "VOGE France · manuel utilisateur DS625X",
        "type": "official_fr",
        "market": "France",
        "url": "https://vogefrance.fr/manuel-vogeds625x-fr/",
        "note": "Calendrier, huile, soupapes, pneus, chaîne, fluides."
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
        "label": "AZ Motors · microfiche DS625X",
        "type": "technical_documentation",
        "market": "France",
        "url": "https://www.azmotors.fr/PIECES_VOGE/TRAIL_650/vue-eclate-VOGE_DS625X_E5/1.CONSOMMABLES_ENTRETIEN.html",
        "note": "Références OEM et prix TTC observés."
      }
    ]
  }
};

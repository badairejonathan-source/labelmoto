import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const cfmoto800mtxDisplayData = {
  "modelName": "CFMOTO 800MT-X",
  "model": "CFMOTO 800MT-X",
  "year": "2025+",
  "category": "Trail aventure A2 / A",
  "introduction": "La CFMOTO 800MT-X est la déclinaison la plus orientée tout-terrain de la famille 800MT. La version France actuelle associe le bicylindre 799 cm³ à 91 ch et 87 Nm, des roues à rayons 21/18 pouces, 230 mm de débattement, 240 mm de garde au sol et un réservoir bas de 22,5 L.",
  "engine": {
    "type": "Bicylindre en ligne, 4 temps, refroidissement liquide, DOHC",
    "displacement": "799 cm³",
    "power": "91 ch (67 kW) à 8 500 tr/min",
    "torque": "87 Nm à 6 750 tr/min",
    "bridage": "Permis A2 en version bridée / permis A en version full",
    "alimentation": "Injection EFI · accélérateur électronique"
  },
  "cycleParts": {
    "frame": "Cadre acier chromoly · sous-châssis treillis · bras oscillant aluminium",
    "frontSuspension": "Fourche inversée · 230 mm · entièrement réglable",
    "rearSuspension": "Mono-amortisseur · 230 mm · entièrement réglable",
    "frontBrake": "Double disque J.Juan Ø320 mm · ABS d'angle",
    "rearBrake": "Simple disque J.Juan Ø260 mm · ABS arrière déconnectable",
    "frontTire": "90/90 R21",
    "rearTire": "150/70 R18"
  },
  "dimensions": {
    "wetWeight": "220 kg",
    "seatHeight": "870 mm",
    "tank": "22,5 L",
    "groundClearance": "240 mm",
    "wheelbase": "1 530 mm"
  },
  "faq": [
    {
      "question": "La CFMOTO 800MT-X est-elle compatible A2 ?",
      "answer": "Oui. CFMOTO France la propose en version A2 bridée et en version A full de 91 ch."
    },
    {
      "question": "Quelle est la différence principale avec la 800MT Explore ?",
      "answer": "La 800MT-X est davantage orientée tout-terrain : roues 21/18 au lieu de 19/17, 240 mm de garde au sol, suspensions de 230 mm, réservoir 22,5 L et couple porté à 87 Nm."
    },
    {
      "question": "Quand faire la révision ?",
      "answer": "Première révision à 1 000 km, puis CFMOTO France indique 15 000 km ou 1 an pour la gamme 800 cc. Le manuel 800MT-X confirme l'huile et le filtre à 15 000 km / 12 mois."
    },
    {
      "question": "Quelle huile et quelle quantité ?",
      "answer": "Le manuel constructeur documente SAE 10W-50, API SJ ou supérieur, JASO MA2, avec 2,8 L lors d'un remplacement d'huile et de filtre."
    },
    {
      "question": "Quand contrôler les soupapes ?",
      "answer": "Le manuel constructeur prévoit un contrôle à 30 000 km, avec réglage si nécessaire."
    }
  ],
  "longevityTips": [
    "Respecter la première révision à 1 000 km puis les échéances de 15 000 km / 1 an.",
    "Réduire les intervalles d'entretien de 50 % en usage sévère lorsque le manuel le demande.",
    "Lubrifier la chaîne tous les 1 000 km et après roulage sous la pluie.",
    "Contrôler plus fréquemment le filtre à air en usage poussiéreux ou hors route.",
    "Toujours vérifier le carnet correspondant au VIN avant une intervention."
  ],
  "conclusion": "La 800MT-X se distingue nettement des 800MT Sport / Explore par sa partie-cycle 21/18, ses grands débattements et son réservoir de 22,5 L. Sa maintenance moteur reste bien documentée par le manuel constructeur, avec un cycle principal de 15 000 km / 1 an et un contrôle des soupapes à 30 000 km."
};

export const cfmoto800mtxV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto CFMOTO 800MT-X : trail aventure 799 cm³, 91 ch, 87 Nm, roues 21/18, réservoir 22,5 L et entretien constructeur.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "91 ch"
    },
    {
      "label": "COUPLE",
      "value": "87 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "799 cm³"
    },
    {
      "label": "SELLE",
      "value": "870 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "22,5 L"
    },
    {
      "label": "PERMIS",
      "value": "A2 bridée / A"
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
      "value": "15 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "SAE 10W-50 · 2,8 L avec filtre",
      "confidence": "official_other_market"
    },
    {
      "label": "Filtre à air",
      "value": "15 000 km / 1 an",
      "confidence": "official_other_market"
    },
    {
      "label": "Bougies",
      "value": "NGK LMAR9AI-10 · 30 000 km",
      "confidence": "official_other_market"
    },
    {
      "label": "Soupapes",
      "value": "Contrôle à 30 000 km",
      "confidence": "official_other_market"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Révision de rodage",
      "price_estimate": "≈150–240 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle des crépines et niveaux",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle chaîne, freins, roues et serrages",
          "source_type": "official_other_market"
        }
      ],
      "note": "Fourchette LabelMoto pièces et main-d’œuvre. Le tarif réel dépend du concessionnaire."
    },
    {
      "km": 15000,
      "months": 12,
      "title": "Entretien périodique",
      "price_estimate": "≈220–340 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement du filtre à air",
          "source_type": "official_other_market"
        },
        {
          "label": "Nettoyage de la crépine",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle embrayage et refroidissement",
          "source_type": "official_other_market"
        },
        {
          "label": "Nettoyage / contrôle du corps de papillon",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle chaîne, pneus, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Échéance principale CFMOTO : 15 000 km ou 12 mois."
    },
    {
      "km": 30000,
      "title": "Grande révision",
      "price_estimate": "≈540–900 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Toutes les opérations de la révision 15 000 km",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement des 2 bougies NGK LMAR9AI-10",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle du jeu aux soupapes",
          "source_type": "official_other_market"
        },
        {
          "label": "Réglage du jeu aux soupapes si nécessaire",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle renforcé du cadre et de la partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "La fourchette haute correspond notamment au cas où un réglage des soupapes est nécessaire."
    },
    {
      "km": 45000,
      "months": 12,
      "title": "Entretien périodique",
      "price_estimate": "≈220–340 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle périodique 15 000 km",
          "source_type": "official_fr"
        },
        {
          "label": "Huile, filtre à huile et filtre à air",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôles chaîne, freins, pneus et partie-cycle",
          "source_type": "official_other_market"
        }
      ]
    },
    {
      "km": 60000,
      "title": "Révision majeure",
      "price_estimate": "≈540–900 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle complet de la révision 30 000 km",
          "source_type": "official_other_market"
        },
        {
          "label": "Bougies",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle du jeu aux soupapes",
          "source_type": "official_other_market"
        },
        {
          "label": "Réglage si nécessaire",
          "source_type": "official_other_market"
        }
      ],
      "note": "Cycle 30 000 km répété. Vérifier les échéances temporelles des liquides selon l’âge de la moto."
    }
  ],
  "budget": {
    "title": "Repères de coût d'entretien",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈910–1 480 €",
      "cost_per_km": "≈0,030–0,049 €/km",
      "interval_rule": "1 000 km puis 15 000 km / 1 an",
      "note": "Calcul LabelMoto basé sur l’addition des fourchettes des révisions programmées jusqu’à 30 000 km. Pneus, kit chaîne, plaquettes, batterie et autres consommables d’usure sont exclus du total principal afin de conserver une comparaison cohérente entre motos."
    },
    "cards": [
      {
        "label": "Filtre à huile OEM famille 800",
        "value": "12,90 €",
        "note": "Prix observé ; référence OEM 61338015200 à vérifier au VIN."
      },
      {
        "label": "Filtre à air 800MT-X",
        "value": "≈18,55–32 €",
        "note": "Prix observé ; référence OEM 0PWV-112000-1200 à vérifier au VIN."
      },
      {
        "label": "Huile 10W-50",
        "value": "≈42–75 €",
        "note": "Budget pièces estimé pour la quantité nécessaire à la vidange."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. Les tarifs atelier varient selon la région, la main-d’œuvre et les opérations réellement nécessaires."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "10W-50 · API SJ ou supérieur · JASO MA2 · 2,8 L avec filtre",
      "rows": [
        {
          "label": "Viscosité",
          "value": "SAE 10W-50",
          "confidence": "official_other_market"
        },
        {
          "label": "Normes",
          "value": "API SJ ou supérieur · JASO MA2",
          "confidence": "official_other_market"
        },
        {
          "label": "Quantité avec filtre",
          "value": "2,8 L",
          "confidence": "official_other_market"
        },
        {
          "label": "Périodicité",
          "value": "1 000 km puis 15 000 km / 12 mois",
          "confidence": "official_other_market"
        },
        {
          "label": "Bouchon de vidange",
          "value": "20 Nm",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "15 000 km / 12 mois",
      "rows": [
        {
          "label": "Référence OEM",
          "value": "0PWV-112000-1200",
          "confidence": "observed"
        },
        {
          "label": "Remplacement",
          "value": "15 000 km / 12 mois",
          "confidence": "official_other_market"
        },
        {
          "label": "Usage poussiéreux / tout-terrain",
          "value": "Contrôler et remplacer plus fréquemment",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "bougie",
      "title": "Bougies",
      "summary": "2 × NGK LMAR9AI-10 · 30 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "NGK LMAR9AI-10",
          "confidence": "official_other_market"
        },
        {
          "label": "Quantité",
          "value": "2",
          "confidence": "official_other_market"
        },
        {
          "label": "Écartement",
          "value": "1,0 mm",
          "confidence": "official_other_market"
        },
        {
          "label": "Couple de serrage",
          "value": "10 Nm",
          "confidence": "official_other_market"
        },
        {
          "label": "Remplacement",
          "value": "30 000 km",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "Contrôle tous les 30 000 km",
      "rows": [
        {
          "label": "Échéance",
          "value": "30 000 km",
          "confidence": "official_other_market"
        },
        {
          "label": "Réglage",
          "value": "Selon mesure au contrôle",
          "confidence": "official_other_market"
        }
      ],
      "note": "Les valeurs de jeu exactes ne sont pas publiées dans les sources retenues : ne pas les inventer."
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Remplacement tous les 48 mois",
      "rows": [
        {
          "label": "Contrôle",
          "value": "15 000 km / 12 mois",
          "confidence": "official_other_market"
        },
        {
          "label": "Remplacement",
          "value": "48 mois",
          "confidence": "official_other_market"
        },
        {
          "label": "Circuit",
          "value": "≈1,60 L + vase ≈0,24 L",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage",
      "summary": "Double disque Ø320 mm AV · Ø260 mm AR · liquide 24 mois",
      "rows": [
        {
          "label": "Avant",
          "value": "Double disque J.Juan Ø320 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "Simple disque J.Juan Ø260 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Liquide de frein",
          "value": "DOT 4 · remplacement tous les 24 mois",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "90/90 R21 · 150/70 R18",
      "rows": [
        {
          "label": "Avant",
          "value": "90/90 R21",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "150/70 R18",
          "confidence": "official_fr"
        },
        {
          "label": "Roues",
          "value": "21 / 18 pouces à rayons",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Lubrification tous les 1 000 km",
      "rows": [
        {
          "label": "Lubrification",
          "value": "Tous les 1 000 km et après pluie",
          "confidence": "official_other_market"
        },
        {
          "label": "Contrôle tension",
          "value": "Régulier · rapprocher en usage tout-terrain",
          "confidence": "official_other_market"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-50 · API SJ+ · JASO MA2 · 2,8 L nécessaires avec filtre",
      "replacement_interval": "1 000 km puis 15 000 km / 12 mois",
      "observed_price": "≈42–75 € pour la quantité nécessaire",
      "source_type": "observed"
    },
    {
      "part": "Filtre à huile OEM",
      "specification": "CFMOTO 61338015200",
      "reference_oem": "61338015200",
      "replacement_interval": "Avec la vidange",
      "observed_price": "12,90 €",
      "source_type": "observed"
    },
    {
      "part": "Kit service huile",
      "specification": "Kit entretien famille CFMOTO 800 compatible 800MT-X",
      "replacement_interval": "Selon révision",
      "observed_price": "≈65,50 €",
      "source_type": "observed"
    },
    {
      "part": "Filtre à air OEM",
      "specification": "CFMOTO 0PWV-112000-1200",
      "reference_oem": "0PWV-112000-1200",
      "replacement_interval": "15 000 km / 12 mois",
      "observed_price": "≈18,55–32 €",
      "source_type": "observed"
    },
    {
      "part": "Bougies NGK",
      "specification": "2 × LMAR9AI-10",
      "replacement_interval": "30 000 km",
      "observed_price": "≈52–76 € la paire",
      "source_type": "observed"
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Liquide prêt à l’emploi compatible aluminium",
      "replacement_interval": "48 mois",
      "observed_price": "≈14–25 € pour environ 2 L",
      "source_type": "observed"
    },
    {
      "part": "Liquide de frein DOT 4",
      "specification": "DOT 4",
      "replacement_interval": "24 mois",
      "observed_price": "≈8–15 € / 500 ml",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes avant OEM",
      "specification": "CFMOTO · deux jeux nécessaires pour le double disque",
      "replacement_interval": "Selon usure",
      "observed_price": "≈75,32 € les deux jeux",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes arrière",
      "specification": "Origine ou équivalent compatible 800MT-X",
      "replacement_interval": "Selon usure",
      "observed_price": "≈25–52 €",
      "source_type": "observed"
    },
    {
      "part": "Kit chaîne complet",
      "specification": "520 · kit compatible 800MT-X · vérifier millésime/VIN",
      "replacement_interval": "Selon usure et entretien",
      "observed_price": "≈150 € pièces · ≈195–220 € monté",
      "source_type": "observed"
    },
    {
      "part": "Train de pneus",
      "specification": "90/90 R21 + 150/70 R18 · trail / aventure",
      "replacement_interval": "Selon usure et utilisation",
      "observed_price": "≈260 € pièces · ≈315–370 € monté",
      "source_type": "observed"
    }
  ],
  "known_issues_v2": [
    {
      "title": "Échéance annuelle à respecter",
      "description": "Pour la gamme CFMOTO 800, le programme France prévoit une première révision à 1 000 km puis des révisions à 15 000, 30 000, 45 000 km, etc., ou annuellement si le kilométrage n’est pas atteint.",
      "type": "manufacturer_monitoring",
      "confidence": "official_fr"
    },
    {
      "title": "Usage tout-terrain : contrôles réguliers indispensables",
      "description": "La 800MT-X est spécifiquement orientée vers l’aventure et l’usage off-road. Entre les révisions, surveiller régulièrement la tension de chaîne, l’usure des plaquettes, les pneumatiques et les niveaux, conformément aux contrôles courants recommandés par CFMOTO France.",
      "type": "usage_limitation",
      "confidence": "official_fr"
    }
  ],

  "warranty": {
    "duration": "5 ans / 60 000 km pour les 800MT-X éligibles immatriculées en 2026",
    "coverage": "Années 1–2 : pièces détachées et main-d’œuvre. Années 3–5 : pièces limitées aux composants mécaniques moteur lubrifiés par l’huile, à la boîte de vitesses et au cadre.",
    "maintenance_requirement": "Entretien conforme au programme CFMOTO dans le réseau CFMOTO France / GD France et carnet d’entretien renseigné.",
    "market": "France",
    "source_label": "CFMOTO France · garantie moto 2026"
  },
  "verdict": {
    "title": "La déclinaison 800MT la plus orientée tout-terrain",
    "text": "La 800MT-X conserve le bicylindre 799 cm³ de la famille mais adopte une partie-cycle nettement plus orientée piste : roues 21/18, 230 mm de débattement, 240 mm de garde au sol et réservoir 22,5 L. L'entretien moteur principal reste calé sur 15 000 km / 1 an selon la documentation constructeur retenue.",
    "strengths": [
      "Roues 21/18 pouces et suspensions entièrement réglables",
      "87 Nm à 6 750 tr/min",
      "Réservoir 22,5 L positionné bas",
      "Quickshifter, régulateur, ABS d'angle, TPMS et amortisseur de direction",
      "Disponible en permis A2 et A"
    ],
    "weaknesses": [
      "Selle haute de 870 mm",
      "Poids annoncé France de 220 kg",
      "Usage sévère nécessitant des contrôles plus rapprochés"
    ]
  },
  "data_quality": {
    "market": "France / documentation constructeur internationale",
    "model_year": "2025+ · caractéristiques France actuelles vérifiées en 2026",
    "manufacturer_fr_verified": true,
    "european_manual_verified": false,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": false,
    "pricing_type": "mixed",
    "last_verified": "24/09/2026",
    "sources": [
      {
        "label": "CFMOTO France · 800MT-X",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/modeles/800mt-x/",
        "note": "Spécifications France actuelles : moteur, couple, poids, selle, réservoir, partie-cycle, équipements et A2/A."
      },
      {
        "label": "CFMOTO France · conseils d'entretien",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/conseils-entretien/",
        "note": "Gamme 800 cc : 1 000 km puis 15 000 / 30 000 / 45 000 km ou annuellement."
      },
      {
        "label": "CFMOTO · manuel utilisateur 800MT-X CF800-11 / CF800-11A",
        "type": "official_other_market",
        "market": "Constructeur international",
        "model_year": "2026",
        "url": "https://cfimages.cfmoto.com/cfmoto/800_MT_X_CF_800_11_11_A_6_WWV_380101_8000_11_CN_249_20260310_d146c3982b.pdf",
        "note": "Huile 10W-50, 2,8 L, bougies, périodicités, refroidissement, freinage et chaîne."
      },
      {
        "label": "CFMOTO France · garantie moto",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/garantie/",
        "note": "Conditions de garantie jusqu'à 5 ans et entretien réseau."
      },
      {
        "label": "Only CFMOTO · filtre à huile 800MT-X",
        "type": "observed",
        "market": "France",
        "model_year": "24/09/2026",
        "url": "https://only-cfmoto.com/pieces-detachees-cf-moto/213-filtre-a-huile-seul-pour-cf-moto-800-mt-nk-mt-x-3000100087151.html",
        "note": "Référence OEM 61338015200 et prix observé 12,90 €."
      }
    ]
  },
  "equivalents_v2": [
    {
      "id": "cfmoto-800mt-sport-explore-2023-plus",
      "name": "CFMOTO 800 MT",
      "reason": "Même famille moteur, orientation davantage routière / voyage"
    },
    {
      "id": "voge-ds800x-rally-2025-plus",
      "name": "VOGE DS800X Rally",
      "reason": "Trail 21/18 orienté aventure de cylindrée proche"
    },
    {
      "id": "kove-800x-pro-2024-plus",
      "name": "KOVE 800X Pro",
      "reason": "Trail 799 cm³ léger et orienté piste"
    },
    {
      "id": "honda-xl750-transalp-2023-plus",
      "name": "Honda XL750 Transalp",
      "reason": "Trail polyvalent de cylindrée proche"
    }
  ]
};

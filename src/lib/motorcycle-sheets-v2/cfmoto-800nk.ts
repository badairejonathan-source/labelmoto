import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const cfmoto800nkDisplayData = {
  "modelName": "CFMOTO 800NK",
  "model": "CFMOTO 800NK",
  "year": "2024+ · Sport / Advanced 2024 / Advanced TC",
  "category": "Roadster A2 / A",
  "introduction": "La fiche LabelMoto 800NK couvre plusieurs versions et homologations. La base commune reste le bicylindre 799 cm³, 95 ch en France, disponible en A2 35 kW. Les documents européens 2023–2024 et les pages CFMOTO France 2026 ne donnent pas toujours les mêmes régimes de puissance/couple : la V2 conserve donc les variantes au lieu de mélanger leurs chiffres. Pour l'entretien, le manuel 800NK 2024 est prioritaire : huile et filtre 15 000 km / 12 mois, filtre à air 15 000 km / 12 mois, bougies et soupapes 30 000 km.",
  "engine": {
    "type": "Bicylindre en ligne 4T · liquide · DOHC · calage 285°",
    "displacement": "799 cm³",
    "power": "95 ch (70 kW) France · A2 35 kW",
    "torque": "79–81 Nm selon version / homologation",
    "bridage": "A2 35 kW / A selon homologation",
    "alimentation": "Injection EFI · accélérateur électronique"
  },
  "cycleParts": {
    "frontTire": "120/70 R17 sur documentation France / manuel 2024",
    "rearTire": "180/55 R17",
    "frontBrake": "Double disque J.Juan Ø320 mm",
    "rearBrake": "Simple disque J.Juan Ø260 mm"
  },
  "dimensions": {
    "wetWeight": "186–189 kg selon version",
    "seatHeight": "795–800 mm selon génération · selle haute 820 mm",
    "tank": "15 L"
  },
  "faq": [
    {
      "question": "Quel est l’intervalle de révision de la CFMOTO 800NK ?",
      "answer": "CFMOTO France classe la gamme 800 cc à 1 000 km puis 15 000, 30 000, 45 000 km, ou une révision annuelle."
    },
    {
      "question": "Quelle quantité d’huile moteur faut-il ?",
      "answer": "Le manuel 800NK 2024 indique 2,8 L lors du remplacement de l’huile et du filtre."
    },
    {
      "question": "Quelle huile moteur utiliser ?",
      "answer": "Le manuel 800NK 2024 indique SAE 10W-50 et JASO T903 MA2, avec API SJ ou supérieure."
    },
    {
      "question": "Quand remplacer le filtre à air ?",
      "answer": "Pour la fiche 2024+, le manuel 800NK 2024 est prioritaire : 15 000 km ou 12 mois, à la première échéance atteinte. Les intervalles sont réduits de 50 % en usage sévère."
    },
    {
      "question": "Quand remplacer les bougies ?",
      "answer": "Les bougies NGK LMAR9AI-10 sont prévues à 30 000 km. Le jeu documenté est de 0,9 à 1,0 mm et le couple de serrage de 10 Nm."
    },
    {
      "question": "Quand contrôler le jeu aux soupapes ?",
      "answer": "Le contrôle est prévu à 30 000 km. La documentation Europe indique 0,10–0,15 mm à l’admission et 0,15–0,20 mm à l’échappement."
    },
    {
      "question": "Quand changer le liquide de frein ?",
      "answer": "Le manuel 800NK indique un remplacement tous les 24 mois."
    },
    {
      "question": "Quand changer le liquide de refroidissement ?",
      "answer": "Le manuel 800NK prévoit un contrôle périodique et un remplacement à 48 mois. La capacité documentée est 1 300 mL + 180 mL."
    },
    {
      "question": "Quelle tension de chaîne respecter ?",
      "answer": "Le manuel indique 30 à 40 mm, mesurés moto sur béquille latérale et boîte au point mort. L’écrou d’axe arrière est donné à 90 Nm."
    },
    {
      "question": "La CFMOTO 800NK est-elle garantie 5 ans en France ?",
      "answer": "Pour les modèles éligibles immatriculés en 2026, CFMOTO France liste les 800NK Sport, Advanced 2024 et Advanced TC à 5 ans sous conditions. Le contrat et le carnet remis avec la moto restent prioritaires."
    }
  ],
  "longevityTips": [
    "Respecter 1 000 km puis le cycle France de 15 000 km / 1 an.",
    "Sur la fiche 2024+, retenir le filtre à air à 15 000 km / 12 mois selon le manuel 2024.",
    "Ne pas repousser les bougies et le contrôle des soupapes au-delà de 30 000 km.",
    "Maintenir la chaîne entre 30 et 40 mm de flèche et la contrôler régulièrement.",
    "Identifier la version et le millésime avant d’utiliser un régime de puissance/couple ou une référence de pièce."
  ],
  "conclusion": "La 800NK combine un cycle principal espacé de 15 000 km / 1 an avec une grande échéance à 30 000 km pour les bougies et les soupapes. Le point essentiel de cette V2 est de séparer les variantes : les premières homologations européennes et les versions France actuelles n’emploient pas exactement les mêmes chiffres de puissance, couple, selle et masse."
};

export const cfmoto800nkVariants = [
  {
    "label": "800NK Advanced (2024)",
    "license_bridging": "A2 / A selon homologation",
    "engine_type": "Bicylindre en ligne 4T · liquide · DOHC · calage 285°",
    "displacement_cc": 799,
    "power": "95 ch / 70 kW",
    "torque": "79–81 Nm selon homologation/documentation",
    "fuel_system": "Injection EFI · accélérateur électronique",
    "weight_tpf_kg": 189,
    "seat_height_mm": "795–800 mm selon documentation",
    "tank_l": 15,
    "cycle_parts": {
      "front_tire": "120/70 R17 sur manuel 2024",
      "rear_tire": "180/55 R17"
    },
    "note": "Version historique 2024 : ne pas fusionner les régimes moteur avec les pages France 2026."
  },
  {
    "label": "800NK Sport (2026+)",
    "license_bridging": "A2 35 kW / A",
    "engine_type": "Bicylindre en ligne 4T · liquide · DOHC · calage 285°",
    "displacement_cc": 799,
    "power": "95 ch (70 kW) à 9 000 tr/min",
    "torque": "81 Nm à 7 000 tr/min",
    "fuel_system": "Injection EFI · accélérateur électronique",
    "weight_tpf_kg": 186,
    "seat_height_mm": 800,
    "tank_l": 15,
    "cycle_parts": {
      "front_tire": "120/70 R17",
      "rear_tire": "180/55 R17"
    }
  },
  {
    "label": "800NK Advanced TC (2026+)",
    "license_bridging": "A2 35 kW / A",
    "engine_type": "Bicylindre en ligne 4T · liquide · DOHC · calage 285°",
    "displacement_cc": 799,
    "power": "95 ch (70 kW) à 9 000 tr/min",
    "torque": "81 Nm à 7 000 tr/min",
    "fuel_system": "Injection EFI · accélérateur électronique",
    "weight_tpf_kg": 189,
    "seat_height_mm": 800,
    "tank_l": 15,
    "cycle_parts": {
      "front_tire": "120/70 R17",
      "rear_tire": "180/55 R17"
    }
  }
];

export const cfmoto800nkV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto CFMOTO 800NK : variantes séparées · 15 000 km / 1 an · 2,8 L · filtre air 15k · bougies et soupapes 30k.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "95 ch"
    },
    {
      "label": "COUPLE",
      "value": "79–81 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "799 cm³"
    },
    {
      "label": "SELLE",
      "value": "795–800 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "15 L"
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
      "value": "15 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "10W-50 JASO MA2 · 2,8 L avec filtre",
      "confidence": "official_eu"
    },
    {
      "label": "Filtre air",
      "value": "15 000 km / 12 mois",
      "confidence": "official_eu"
    },
    {
      "label": "Bougies",
      "value": "NGK LMAR9AI-10 · 30 000 km",
      "confidence": "official_eu"
    },
    {
      "label": "Soupapes",
      "value": "30 000 km",
      "confidence": "official_eu"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Rodage",
      "price_estimate": "≈150–220 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles de rodage : serrages, niveaux, freins, chaîne, roues",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 15000,
      "months": 12,
      "title": "Périodique",
      "price_estimate": "≈250–350 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Crépine d’huile : nettoyage",
          "source_type": "official_eu"
        },
        {
          "label": "Embrayage, ralenti, gaz, refroidissement : contrôles",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 30000,
      "title": "Grande révision",
      "price_estimate": "≈450–600 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle 15 000 km : huile, filtre huile, filtre air et contrôles",
          "source_type": "official_eu"
        },
        {
          "label": "Bougies NGK LMAR9AI-10 : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Jeu aux soupapes : contrôle / réglage si nécessaire",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 45000,
      "title": "Périodique",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles du cycle 15 000 km",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 60000,
      "title": "Majeure",
      "operations": [
        {
          "label": "Répéter le cycle 30 000 km",
          "source_type": "official_eu"
        },
        {
          "label": "Bougies : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Jeu aux soupapes : contrôle",
          "source_type": "official_eu"
        },
        {
          "label": "Liquides frein 24 mois / refroidissement 48 mois selon échéance",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 75000,
      "title": "Périodique",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles du cycle 15 000 km",
          "source_type": "official_eu"
        }
      ]
    }
  ],
  "budget": {
    "title": "Repères de coût d'entretien",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈850–1 170 €",
      "cost_per_km": "≈0,028–0,039 €/km",
      "interval_rule": "1 000 km puis 15 000 km / 1 an",
      "note": "Calcul LabelMoto basé sur l’addition des fourchettes des révisions programmées jusqu’à 30 000 km. Pneus, kit chaîne, plaquettes, batterie et autres consommables d’usure sont exclus du total principal afin de conserver une comparaison cohérente entre motos."
    },
    "cards": [
      {
        "label": "Chaîne adaptable",
        "value": "≈110,40 €",
        "note": "DID 520VX3 116 maillons observée compatible Advanced TC 2023–2024."
      },
      {
        "label": "Plaquettes avant / arrière",
        "value": "≈37,66 € / ≈45,71 €",
        "note": "Prix origine observés ; référence exacte selon version et millésime."
      },
      {
        "label": "Filtre à air",
        "value": "≈25,64 €",
        "note": "Prix observé pour 800NK ; référence OEM à vérifier au VIN."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. Les tarifs atelier varient selon la région, la main-d’œuvre et les opérations réellement nécessaires."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "10W-50 · JASO MA2 · 2,8 L",
      "rows": [
        {
          "label": "Quantité avec filtre",
          "value": "2,8 L",
          "confidence": "official_eu"
        },
        {
          "label": "Viscosité",
          "value": "SAE 10W-50",
          "confidence": "official_eu"
        },
        {
          "label": "Norme",
          "value": "API SJ ou supérieure · JASO T903 MA2",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "15 000 km / 12 mois après la révision de rodage",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "15 000 km / 12 mois pour la fiche 2024+",
      "rows": [
        {
          "label": "Remplacement",
          "value": "15 000 km / 12 mois",
          "confidence": "official_eu"
        },
        {
          "label": "Usage sévère",
          "value": "Réduire l’intervalle de 50 %",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "NGK LMAR9AI-10 · 30 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "NGK LMAR9AI-10",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "30 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Écartement",
          "value": "0,9–1,0 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Couple de serrage",
          "value": "10 Nm",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "30 000 km · 0,10–0,15 / 0,15–0,20 mm",
      "rows": [
        {
          "label": "Échéance",
          "value": "30 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Admission",
          "value": "0,10–0,15 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Échappement",
          "value": "0,15–0,20 mm",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "1 300 mL + 180 mL · remplacement 48 mois",
      "rows": [
        {
          "label": "Capacité",
          "value": "1 300 mL + 180 mL",
          "confidence": "official_eu"
        },
        {
          "label": "Contrôle",
          "value": "15 000 km / 12 mois",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "48 mois",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide",
      "summary": "J.Juan 320 / 260 mm · DOT 4 ou DOT 5.1 · 24 mois",
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
          "label": "Liquide",
          "value": "DOT 4 ou DOT 5.1 · monte usine documentée DOT 5.1",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "24 mois",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "120/70 R17 · 180/55 R17",
      "rows": [
        {
          "label": "Avant",
          "value": "120/70 R17",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "180/55 R17",
          "confidence": "official_fr"
        },
        {
          "label": "Attention anciennes docs",
          "value": "Certaines pages européennes anciennes indiquent 120/60 R17 : vérifier le millésime/VIN avant commande.",
          "confidence": "multiple_sources"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "30–40 mm · contrôle/lubrification réguliers",
      "rows": [
        {
          "label": "Flèche standard",
          "value": "30–40 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Contrôle / lubrification",
          "value": "Tous les 1 000 km et après conditions sévères",
          "confidence": "official_eu"
        },
        {
          "label": "Limite sur 20 maillons",
          "value": "320,7 mm sous charge de contrôle",
          "confidence": "official_eu"
        },
        {
          "label": "Écrou d’axe arrière",
          "value": "90 Nm",
          "confidence": "official_eu"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-50 · API SJ+ · JASO MA2",
      "replacement_interval": "15 000 km / 12 mois · 2,8 L avec filtre",
      "observed_price": "≈25 €/L observé",
      "source_type": "observed"
    },
    {
      "part": "Filtre à huile OEM",
      "specification": "CFMOTO 61338015200",
      "reference_oem": "61338015200",
      "replacement_interval": "Avec l’huile",
      "observed_price": "12,90 €",
      "source_type": "observed",
      "note": "Référence et compatibilité 800NK / Sport / Advanced confirmées sur Only-CFMOTO."
    },
    {
      "part": "Filtre à air 800NK",
      "specification": "CFMOTO 800NK · référence exacte à vérifier au VIN",
      "replacement_interval": "15 000 km / 12 mois",
      "observed_price": "25,64 €",
      "source_type": "observed",
      "note": "Pièce 800NK et prix observés en France ; verrouiller la référence OEM exacte avant commande."
    },
    {
      "part": "Chaîne adaptable",
      "specification": "DID 520VX3 · 116 maillons",
      "replacement_interval": "Selon usure · flèche 30–40 mm",
      "observed_price": "110,40 €",
      "source_type": "observed",
      "note": "Prix/compatibilité observés Cardy pour 800NK Advanced TC 2023–2024."
    },
    {
      "part": "Plaquettes avant",
      "specification": "Référence origine / adaptable selon étrier J.Juan",
      "replacement_interval": "Selon usure",
      "observed_price": "37,66 € origine observé",
      "source_type": "observed",
      "note": "Vérifier la référence exacte selon version et millésime."
    },
    {
      "part": "Plaquettes arrière",
      "specification": "Référence origine / adaptable selon étrier J.Juan",
      "replacement_interval": "Selon usure",
      "observed_price": "45,71 € origine observé",
      "source_type": "observed",
      "note": "Vérifier la référence exacte selon version et millésime."
    },
    {
      "part": "Filtre à huile adaptable",
      "specification": "MIW KT8008",
      "replacement_interval": "Avec l’huile",
      "observed_price": "10,80 €",
      "source_type": "observed",
      "note": "Prix/compatibilité observés Cardy pour 800NK Advanced TC 2023–2024."
    }
  ],
  "known_issues_v2": [
    {
      "title": "Variantes / homologations à ne pas mélanger",
      "description": "Les premières documentations Europe et les pages France actuelles diffèrent sur les régimes de puissance/couple, la selle et certaines dimensions de pneu. La V2 sépare donc Advanced 2024, Sport actuel et Advanced TC.",
      "type": "manufacturer_monitoring",
      "confidence": "multiple_sources"
    },
    {
      "title": "Filtre à air : priorité au manuel 2024 pour la fiche 2024+",
      "description": "Le manuel 800NK 2024 donne 15 000 km / 12 mois. Cette valeur remplace l’ancienne valeur LabelMoto de 30 000 km pour la fiche 2024+.",
      "type": "manufacturer_monitoring",
      "confidence": "official_eu"
    },
    {
      "title": "Rappels officiels Europe",
      "description": "La page officielle CFMOTO Europe consultée ne liste pas de campagne 800NK. Un contrôle par VIN auprès du réseau reste recommandé.",
      "type": "manufacturer_monitoring",
      "confidence": "official_eu"
    }
  ],
  "warranty": {
    "duration": "5 ans pour 800NK Sport, 800NK Advanced 2024 et 800NK Advanced TC éligibles selon les conditions France applicables",
    "market": "France",
    "maintenance_requirement": "Entretien obligatoire dans le réseau CFMOTO / GD France pour l’extension concernée, avec carnet et justificatifs.",
    "claim_requirement": "Pour les immatriculations 2026, les années 3 à 5 couvrent les pièces moteur/boîte/cadre selon conditions, dans la limite de 60 000 km sur 5 ans. Le contrat remis avec la moto prévaut.",
    "source_label": "CFMOTO France · garantie moto 2026"
  },
  "equivalents_v2": [
    {
      "name": "KTM 790",
      "reason": "Architecture moteur proche"
    },
    {
      "name": "Honda XL750 / CB750",
      "reason": "Alternative moderne"
    }
  ],
  "verdict": {
    "title": "Un cycle 15 000 km solide, avec variantes enfin séparées",
    "text": "La 800NK profite d’un entretien principal tous les 15 000 km / 1 an. Pour la fiche 2024+, le manuel 2024 place aussi le filtre à air à 15 000 km / 12 mois, tandis que bougies et soupapes sont à 30 000 km. La difficulté n’est pas le calendrier : ce sont les différences d’homologation entre Advanced 2024, Sport et Advanced TC, désormais affichées au lieu d’être mélangées.",
    "strengths": [
      "Révision principale 15 000 km / 1 an",
      "2,8 L et 10W-50 clairement documentés",
      "Bougies et soupapes à 30 000 km",
      "Garantie France 5 ans sur les variantes 800NK éligibles"
    ],
    "weaknesses": [
      "Valeurs techniques variant selon homologation / millésime",
      "Référence OEM exacte du filtre à air à contrôler au VIN"
    ]
  },
  "data_quality": {
    "market": "France / Europe",
    "model_year": "2024+",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": true,
    "pricing_type": "mixed",
    "last_verified": "18/09/2026",
    "sources": [
      {
        "label": "CFMOTO France · 800NK Sport",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/modeles/800nk-sport/",
        "note": "95 ch / 70 kW à 9 000 tr/min, 81 Nm à 7 000 tr/min, 186 kg, 800 mm, 15 L, 120/70 R17 et 180/55 R17."
      },
      {
        "label": "CFMOTO France · 800NK Advanced TC",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/modeles/800nk-advanced/",
        "note": "95 ch / 70 kW à 9 000 tr/min, 81 Nm à 7 000 tr/min, 189 kg, 800 mm, 15 L, équipements Advanced TC."
      },
      {
        "label": "CFMOTO France · gamme moto",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/gamme-moto/",
        "note": "Confirme la présence commerciale de la 800NK Advanced 2024 dans la gamme France 2026."
      },
      {
        "label": "CFMOTO France · conseils d’entretien",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/conseils-entretien/",
        "note": "Gamme 800 cc : 1 000, 15 000, 30 000, 45 000 km ou annuel."
      },
      {
        "label": "CFMOTO · manuel 800NK 2024",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2024",
        "url": "https://a.storyblok.com/f/176629/x/e6527d1f34/800nk-2024-en.pdf",
        "note": "Priorité fiche 2024+ : huile/filtre 15k/12m, air 15k/12m, bougies 30k, soupapes 30k, 2,8 L, 10W-50, liquide frein 24m, refroidissement 48m, chaîne 30–40 mm."
      },
      {
        "label": "CFMOTO Europe · lancement 800NK Sport / Advanced",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2023",
        "url": "https://www.cfmoto.com/content/cfmoto/global/media-center/news/news/cfmoto-shows-intention-and-ambition-for-the-european-motorcycle-.html",
        "note": "Documente les premières homologations Europe : 70 kW / 95 ch à 9 250 tr/min et 79 Nm à 8 000 tr/min, avec 186/189 kg selon version."
      },
      {
        "label": "CFMOTO France · garantie moto",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/garantie/",
        "note": "800NK Sport, Advanced 2024 et Advanced TC listées à 5 ans pour modèles éligibles immatriculés en 2026, sous conditions."
      },
      {
        "label": "CFMOTO Europe · rappels",
        "type": "official_eu",
        "market": "Europe",
        "url": "https://cfmoto-motorcycle.eu/en/service/recall",
        "note": "Aucune campagne 800NK listée lors de la vérification."
      },
      {
        "label": "Only-CFMOTO · pièces 800NK",
        "type": "observed",
        "market": "France",
        "model_year": "10/09/2026",
        "url": "https://only-cfmoto.com/10-roadsters-nk-cfmoto-accessoires",
        "note": "Prix observés : filtre air 25,64 €, filtre huile OEM 61338015200 à 12,90 €, huile 10W-50 autour de 25 €/L."
      },
      {
        "label": "Cardy · 800NK Advanced TC",
        "type": "observed",
        "market": "France",
        "model_year": "2023–2024",
        "url": "https://www.cardy.fr/fiche-technique-CFMOTO-800-NK-ADVANCED-TC-ABS-E5-10261.html",
        "note": "Prix/compatibilités observés : MIW KT8008, chaîne DID 520VX3 116 maillons, plaquettes SBS."
      }
    ]
  }
};

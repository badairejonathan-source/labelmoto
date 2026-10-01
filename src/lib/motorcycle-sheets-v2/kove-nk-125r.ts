import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const koveNk125rDisplayData = {
  "modelName": "KOVE NK 125R",
  "model": "KOVE NK 125R",
  "year": "2026+",
  "category": "Roadster A1",
  "introduction": "Roadster 125 cm³ de la gamme France, annoncé à 14 ch / 10,2 kW, 135 kg en ordre de marche, selle 820 mm et réservoir 13 L. Le guide V2 remplace l’ancien calendrier incomplet par le planning KOVE 2026.",
  "engine": {
    "type": "Monocylindre 4 temps, DOHC, 4 soupapes, refroidissement liquide",
    "displacement": "124,8 / 125 cm³",
    "power": "14 ch (10,2 kW)",
    "torque": "10,8 Nm à 8 500 tr/min (manuel KY125R)",
    "transmission": "6 rapports, chaîne"
  },
  "cycleParts": {
    "frontSuspension": "Fourche inversée Ø41 mm",
    "rearSuspension": "Mono-amortisseur réglable en précharge sur monobras",
    "frontTire": "110/70 R17",
    "rearTire": "140/60 R17 (manuel KY125R ; corrige l’ancienne fiche 140/70-17)",
    "brakes": "Disques avant/arrière avec ABS double canal"
  },
  "dimensions": {
    "wetWeight": "135 kg en ordre de marche",
    "seatHeight": "820 mm",
    "tank": "13 L",
    "wheelbase": "1 370 mm"
  },
  "faq": [
    {
      "question": "Quand réviser la KOVE NK 125R ?",
      "answer": "Le planning KOVE 2026 prévoit 1 000, 6 000, 11 000, 16 000 et 21 000 km, puis répétition du cycle à partir de 26 000 km. Le carnet du VIN reste prioritaire."
    },
    {
      "question": "Quelle huile utiliser ?",
      "answer": "Le manuel KY125R indique une huile moto 10W-40 répondant au minimum à API SL. La quantité documentée est de 1,1 L pour une vidange simple et 1,3 L après intervention incluant la crépine / remise à sec."
    },
    {
      "question": "Quelle bougie utilise la NK 125R ?",
      "answer": "Le manuel KY125R indique une CR9E avec un écartement de 0,6 à 0,8 mm."
    },
    {
      "question": "Quels pneus sont documentés ?",
      "answer": "Le manuel KY125R indique 110/70 R17 à l’avant et 140/60 R17 à l’arrière."
    }
  ],
  "longevityTips": [
    "Respecter la première révision à 1 000 km puis le cycle de 5 000 km prévu par le planning KOVE.",
    "Contrôler régulièrement le niveau d’huile et utiliser une 10W-40 conforme aux spécifications du manuel.",
    "Surveiller, nettoyer et lubrifier régulièrement la transmission secondaire.",
    "Contrôler plus fréquemment le filtre à air et les pneumatiques en usage urbain intensif ou poussiéreux."
  ],
  "conclusion": "Sur une NK 125R d’occasion, demandez en priorité la preuve de la révision majeure de 21 000 km. Avec seulement 1,1 à 1,3 L d’huile documentés selon l’intervention, un niveau trop bas représente rapidement une part importante de la lubrification disponible : contrôlez-le avant un long trajet ou une utilisation soutenue. Si la révision des 21 000 km n’est pas justifiée, intégrez-la immédiatement au budget d’achat."
};

export const koveNk125rV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "license_fr": "A1",
  "license_fr_source": "https://kovemotor.fr/modele/kove-naked-nk-125r/",
  "license_fr_verified_at": "2026-09-30",
  "faq": koveNk125rDisplayData.faq,
  "longevity_tips": koveNk125rDisplayData.longevityTips,
  "conclusion": koveNk125rDisplayData.conclusion,
  "hero_subtitle": "Guide KOVE NK 125R : calendrier 2026, huile, crépine, bougie, soupapes, liquides, transmission et coûts atelier observés.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "14 ch / 10,2 kW"
    },
    {
      "label": "CYLINDRÉE",
      "value": "125 cm³"
    },
    {
      "label": "POIDS",
      "value": "135 kg ordre de marche"
    },
    {
      "label": "SELLE",
      "value": "820 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "13 L"
    }
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
      "label": "Liquide de frein",
      "value": "Remplacement annuel selon tableau",
      "confidence": "official_other_market"
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
      "price_estimate": "≈149–239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur · contrôle/nettoyage de la crépine selon intervention",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 6000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur · contrôle/nettoyage de la crépine selon intervention",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 11000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur · contrôle/nettoyage de la crépine selon intervention",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 16000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur · contrôle/nettoyage de la crépine selon intervention",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 21000,
      "title": "Révision majeure",
      "price_estimate": "≈169–239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur · contrôle/nettoyage de la crépine selon intervention",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 26000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur · contrôle/nettoyage de la crépine selon intervention",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 31000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur · contrôle/nettoyage de la crépine selon intervention",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 36000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur · contrôle/nettoyage de la crépine selon intervention",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & crépine",
      "summary": "SAE 10W-40 · API SL ou supérieur · 1,1 L vidange simple · 1,3 L après intervention sur crépine / remise à sec",
      "rows": [
        {
          "label": "Spécification",
          "value": "SAE 10W-40 · API SL ou supérieur",
          "confidence": "technical_documentation"
        },
        {
          "label": "Quantité",
          "value": "1,1 L vidange simple · 1,3 L après intervention crépine / remise à sec",
          "confidence": "technical_documentation"
        }
      ],
      "note": "Le niveau et la procédure du manuel du millésime/VIN restent prioritaires."
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Inspection / remplacement selon planning 2026",
      "rows": [
        {
          "label": "Périodicité",
          "value": "Inspection / remplacement selon planning 2026",
          "confidence": "official_other_market"
        }
      ],
      "note": "Raccourcir fortement l’intervalle en environnement poussiéreux / tout-terrain."
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "CR9E · écartement 0,6–0,8 mm",
      "rows": [
        {
          "label": "Référence / spécification",
          "value": "CR9E · écartement 0,6–0,8 mm",
          "confidence": "technical_documentation"
        }
      ],
      "note": "Aucune référence OEM ne doit être ajoutée sans catalogue pièces vérifié."
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "Contrôle à l’échéance majeure de 21 000 km",
      "rows": [
        {
          "label": "Contrôle",
          "value": "Contrôle à l’échéance majeure de 21 000 km",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Remplacement à 24 mois",
      "rows": [
        {
          "label": "Périodicité",
          "value": "Remplacement à 24 mois",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide",
      "summary": "Remplacement du liquide selon échéance annuelle / tableau constructeur",
      "rows": [
        {
          "label": "Liquide / périodicité",
          "value": "Remplacement du liquide selon échéance annuelle / tableau constructeur",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "Dimensions vérifiées dans la documentation disponible",
      "rows": [
        {
          "label": "Avant",
          "value": "110/70 R17",
          "confidence": "technical_documentation"
        },
        {
          "label": "Arrière",
          "value": "140/60 R17",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Contrôle régulier, tension et lubrification selon manuel",
      "rows": [
        {
          "label": "Chaîne",
          "value": "Contrôle régulier, tension et lubrification selon manuel",
          "confidence": "technical_documentation"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-40 · API SL ou supérieur",
      "replacement_interval": "À chaque échéance du planning KOVE",
      "observed_price": "≈12–17 € / L",
      "source_type": "observed",
      "note": "Fourchette resserrée observée en Europe sur des huiles moto 10W-40 conformes au minimum à API SL. Le manuel KY125R documente environ 1,1 L pour une vidange simple et 1,3 L après nettoyage/remplacement de la crépine ou remise à sec."
    },
    {
      "part": "Bougie",
      "specification": "NGK CR9E · écartement 0,6–0,8 mm",
      "replacement_interval": "Selon planning constructeur et état",
      "observed_price": "≈10–14 € / unité",
      "source_type": "observed",
      "note": "Référence CR9E documentée pour la NK 125R. Fourchette construite à partir de plusieurs prix observés, hors promotions exceptionnellement basses."
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Liquide moto compatible circuit aluminium",
      "replacement_interval": "24 mois selon planning KOVE",
      "observed_price": "≈11–12 € / L",
      "source_type": "observed",
      "note": "Repère de marché observé sur des liquides moto prêts à l’emploi."
    },
    {
      "part": "Liquide de frein",
      "specification": "DOT 4",
      "replacement_interval": "Selon planning constructeur",
      "observed_price": "≈8–12 € / 500 ml",
      "source_type": "observed",
      "note": "DOT 4 référencé pour la NK 125R dans le catalogue véhicule Louis. Fourchette observée sur plusieurs liquides DOT 4."
    },
    {
      "part": "Pneus & roues",
      "specification": "110/70 R17 avant · 140/60 R17 arrière",
      "replacement_interval": "Selon usure",
      "observed_price": "≈160–195 € le train",
      "source_type": "observed",
      "note": "Repère européen pour un train routier aux dimensions exactes d’origine. Montage et valves non compris."
    }
  ],
  "budget": {
    "title": "Budget entretien autour de 30 000 km",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈1 060–1 670 €",
      "cost_per_km": "≈0,035–0,056 €/km",
      "interval_rule": "1 000 km puis tous les 5 000 km · échéance 31 000 km incluse",
      "note": "Estimation LabelMoto des seuls forfaits atelier observés jusqu’à la révision de 31 000 km, première échéance immédiatement suivante après 30 000 km. Les consommables, pièces d’usure et opérations additionnelles restent exclus."
    },
    "cards": [
      {
        "label": "Révisions incluses",
        "value": "7 passages",
        "note": "1 000, 6 000, 11 000, 16 000, 21 000, 26 000 et 31 000 km."
      },
      {
        "label": "Forfait courant observé",
        "value": "149–239 €",
        "note": "Repère atelier français observé ; consommables en supplément."
      },
      {
        "label": "Révision majeure",
        "value": "169–239 €",
        "note": "Repère atelier observé à l’échéance de 21 000 km ; pièces et opérations additionnelles possibles."
      },
      {
        "label": "Consommables non compris",
        "value": "Selon besoin",
        "note": "Huile, filtres, bougie, pneus, transmission et autres pièces ne sont pas intégrés au total principal."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. Le tarif réel dépend de l’atelier, de la région et des opérations effectivement réalisées."
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
      "title": "Historique des révisions",
      "description": "Vérifier que la première révision puis les échéances de 5 000 km ont été suivies et documentées.",
      "type": "manufacturer_monitoring",
      "confidence": "official_other_market"
    },
    {
      "title": "Révision majeure à 21 000 km",
      "description": "Cette échéance doit être anticipée car elle comporte davantage de contrôles que les révisions périodiques courantes.",
      "type": "usage_limitation",
      "confidence": "official_other_market"
    }
  ],
  "verdict": {
    "title": "Un entretien régulier à intégrer au coût d’usage",
    "text": "La NK 125R suit un calendrier rapproché mais lisible : 1 000 km puis un cycle de 5 000 km. Pour conserver une moto saine, le plus important est la régularité des vidanges, le suivi de la transmission et l’anticipation de l’échéance majeure de 21 000 km.",
    "strengths": [
      "Planning constructeur 2026 clairement cadencé",
      "Huile, bougie et dimensions de pneus documentées",
      "Coûts atelier observés disponibles comme repères"
    ],
    "weaknesses": [
      "Passages en atelier relativement fréquents",
      "Révision majeure à 21 000 km",
      "Prix des consommables variables selon fournisseur"
    ]
  },
  "data_quality": {
    "market": "France",
    "model_year": "2026+",
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
        "label": "KOVE France · NK 125R",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://kovemotor.fr/modele/kove-naked-nk-125r/",
        "note": "Prix et caractéristiques France."
      },
    {
        "label": "KOVE · manuel KY125R",
        "type": "technical_documentation",
        "market": "Europe / international",
        "model_year": "2025–2026",
        "url": "https://www.kovemoto.com/uploadfile/202509/d546b37790c1407.pdf",
        "note": "Huile, bougie, pneumatiques et caractéristiques moteur."
      },
    {
      "label": "Louis · KOVE NK 125R",
      "type": "observed",
      "market": "Europe",
      "model_year": "2025-2026",
      "url": "https://www.louis.eu/fr/bike-database/kove-nk-125r/konk125r-25/5994",
      "note": "Affectation véhicule NK 125R : NGK CR9E / CR9EIX, DOT 4, liquides de frein et de refroidissement avec prix observés."
    },
    {
      "label": "MTP-Racing · KOVE NK125R KY125R",
      "type": "observed",
      "market": "Europe",
      "model_year": "2025",
      "url": "https://mtp-racing.de/Kove-NK125R-KY125R-2025-10-2kW_2",
      "note": "NGK CR9E affectée à la NK125R, prix observé autour de 10 €."
    },
    {
      "label": "Idealo / marché Europe · huile moto 10W-40 API SL",
      "type": "observed",
      "market": "Europe",
      "model_year": "2026",
      "url": "https://www.idealo.fr/prix/3474475/motul-5100-4t-10w-40.html",
      "note": "Prix observés pour huiles moto 10W-40 satisfaisant API SL ; utilisée pour construire une fourchette courte."
    },
    {
      "label": "GripMoto · pneus 110/70 R17 + 140/60 R17",
      "type": "observed",
      "market": "Europe",
      "model_year": "2026",
      "url": "https://www.gripmoto.it/moto-e-scooter/estate/eurogrip/accoppiata/70_3mcy81177scr32/70_3mcy81467scr32/trailhound_scr.html",
      "note": "Exemple de train Eurogrip dans les dimensions exactes de la NK 125R ; utilisé avec d’autres observations européennes pour le repère de prix."
    }
  ]
  },
  "equivalents_v2": [
    {
      "id": "cfmoto-125nk-2026-plus",
      "name": "CFMOTO 125NK",
      "reason": "Roadster 125 A1 actuel."
    },
    {
      "name": "Yamaha MT-125",
      "reason": "Roadster 125 A1 de référence à comparer selon prix et réseau."
    }
  ]
};

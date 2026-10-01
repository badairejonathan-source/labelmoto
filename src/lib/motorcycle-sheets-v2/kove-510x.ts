import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const kove510xDisplayData = {
  "modelName": "KOVE 510X",
  "model": "KOVE 510X",
  "year": "2025+",
  "category": "Trail A2",
  "introduction": "Trail A2 498,4 cm³. KOVE France affiche 178 kg à vide, selle 841 mm et réservoir 20 L. La page France présente une divergence de puissance : 32 kW dans le texte technique et 35 kW dans le résumé ; la fiche conserve les deux valeurs au lieu d’en choisir une arbitrairement.",
  "engine": {
    "type": "Monocylindre 4 temps, DOHC, refroidissement liquide",
    "displacement": "498,4 cm³",
    "power": "32 kW dans le texte technique France · 35 kW dans le résumé France",
    "torque": "45 Nm à 7 000 tr/min selon fiche existante",
    "license": "A2"
  },
  "cycleParts": {
    "frontSuspension": "Fourche KYB réglable",
    "rearSuspension": "Monoamortisseur KYB réglable",
    "frontTire": "110/80 R19",
    "rearTire": "150/70 R17"
  },
  "dimensions": {
    "dryWeight": "178 kg à vide",
    "seatHeight": "841 mm",
    "tank": "20 L",
    "groundClearance": "211 mm"
  },
  "faq": [
    {
      "question": "Quand réviser la KOVE 510X ?",
      "answer": "Le planning KOVE 2026 prévoit 1 000, 7 000, 13 000, 19 000 et 25 000 km, puis répétition à partir de 31 000 km."
    },
    {
      "question": "Pourquoi certains anciens documents donnent-ils 4 000 / 8 000 / 12 000 km ?",
      "answer": "Un manuel KY510X plus ancien affiche une autre table. LabelMoto retient le planning global KOVE 2026 pour la génération actuelle tout en conservant le conflit dans data_quality."
    },
    {
      "question": "Quelle quantité d’huile ?",
      "answer": "Le manuel KY510X documente 2,8 L sans filtre, 3,0 L avec filtre et 3,2 L après démontage / remise à sec."
    },
    {
      "question": "Quelle est la puissance exacte en France ?",
      "answer": "La page KOVE France n’est pas cohérente : 32 kW dans le texte technique, 35 kW dans le résumé. La fiche ne masque pas cette divergence."
    },
    {
      "question": "Quelle bougie utilise la KOVE 510X ?",
      "answer": "La documentation technique KOVE du KY510X indique une CR8EI avec un écartement de 0,6 à 0,8 mm."
    }
  ],
  "longevityTips": [
    "Respecter la première révision à 1 000 km puis le cycle de 6 000 km du planning KOVE 2026.",
    "Contrôler régulièrement le niveau d’huile et respecter les quantités prévues selon le type d’intervention.",
    "Nettoyer et lubrifier régulièrement la chaîne, surtout après pluie, lavage ou utilisation sur route sale.",
    "Surveiller filtre à air, pneus et freinage plus fréquemment en usage chargé, poussiéreux ou soutenu."
  ],
  "conclusion": "Avant d’acheter une 510X d’occasion ou de commander ses pièces, relevez le VIN et le millésime : plusieurs calendriers KOVE circulent selon la génération. Sur une moto approchant 25 000 à 31 000 km, demandez la facture de la révision majeure des 25 000 km et vérifiez que l’historique correspond au bon planning. Une absence de preuve à cette échéance représente un coût à prévoir, pas un simple détail administratif."
};

export const kove510xV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "faq": kove510xDisplayData.faq,
  "longevity_tips": kove510xDisplayData.longevityTips,
  "conclusion": kove510xDisplayData.conclusion,
  "hero_subtitle": "Guide KOVE 510X : 1 000 km puis tous les 6 000 km · huile 3,0 L avec filtre · divergence de puissance France documentée.",
  "quick_facts": [
    {
      "label": "CYLINDRÉE",
      "value": "498,4 cm³"
    },
    {
      "label": "PERMIS",
      "value": "A2"
    },
    {
      "label": "POIDS",
      "value": "178 kg à vide"
    },
    {
      "label": "SELLE",
      "value": "841 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "20 L"
    }
  ],
  "quick_maintenance": [
    {
      "label": "Révisions",
      "value": "1 000 puis 7 000 / 13 000 / 19 000 / 25 000 km",
      "confidence": "official_other_market"
    },
    {
      "label": "Huile + filtre",
      "value": "SAE 10W-40 · API SN · 3,0 L avec filtre",
      "confidence": "multiple_sources"
    },
    {
      "label": "Bougie",
      "value": "CR8EI · écartement 0,6–0,8 mm",
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
      "price_estimate": "≈149–239 €",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 31 000 km sur la base de l’échéance 7 000 km."
    },
    {
      "km": 7000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 31 000 km sur la base de l’échéance 7 000 km."
    },
    {
      "km": 13000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 31 000 km sur la base de l’échéance 7 000 km."
    },
    {
      "km": 19000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 31 000 km sur la base de l’échéance 7 000 km."
    },
    {
      "km": 25000,
      "title": "Révision majeure",
      "price_estimate": "≈169–239 €",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 31 000 km sur la base de l’échéance 7 000 km."
    },
    {
      "km": 31000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 31 000 km sur la base de l’échéance 7 000 km."
    },
    {
      "km": 37000,
      "title": "Révision périodique",
      "price_estimate": "≈149–239 €",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 31 000 km sur la base de l’échéance 7 000 km."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-40 · API SN · 2,8 L sans filtre · 3,0 L avec filtre · 3,2 L moteur sec",
      "rows": [
        {
          "label": "Spécification",
          "value": "SAE 10W-40 · API SN",
          "confidence": "multiple_sources"
        },
        {
          "label": "Quantités",
          "value": "2,8 L sans filtre · 3,0 L avec filtre · 3,2 L après remise à sec",
          "confidence": "technical_documentation"
        },
        {
          "label": "Remplacement",
          "value": "Huile et filtre à chaque échéance du planning 2026",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Inspection / nettoyage aux révisions · remplacement majeur",
      "rows": [
        {
          "label": "Plan 2026",
          "value": "Inspection / nettoyage aux échéances ; remplacement à l’échéance majeure et selon état",
          "confidence": "official_other_market"
        },
        {
          "label": "Poussière / boue",
          "value": "Nettoyage quotidien en environnement très poussiéreux ou boueux",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "CR8EI · écartement 0,6–0,8 mm",
      "rows": [
        {
          "label": "Référence",
          "value": "CR8EI",
          "confidence": "technical_documentation"
        },
        {
          "label": "Écartement",
          "value": "0,6–0,8 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Entretien",
          "value": "Inspection aux échéances prévues par le planning KOVE",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "ADM 0,10–0,15 mm · ÉCH 0,15–0,20 mm · contrôle majeur",
      "rows": [
        {
          "label": "Admission",
          "value": "0,10–0,15 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Échappement",
          "value": "0,15–0,20 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Contrôle",
          "value": "À l’échéance majeure du cycle 2026",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Contrôle périodique · remplacement à 24 mois",
      "rows": [
        {
          "label": "Contrôle",
          "value": "Inspection à chaque échéance du plan",
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
      "summary": "DOT 4 · contrôle périodique · remplacement annuel",
      "rows": [
        {
          "label": "Liquide",
          "value": "DOT 4",
          "confidence": "observed"
        },
        {
          "label": "Système",
          "value": "Contrôle aux échéances du planning KOVE",
          "confidence": "official_other_market"
        },
        {
          "label": "Remplacement",
          "value": "12 mois selon planning constructeur",
          "confidence": "official_other_market"
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
          "confidence": "technical_documentation"
        },
        {
          "label": "Arrière",
          "value": "150/70 R17",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Inspection et lubrification selon le planning constructeur",
      "rows": [
        {
          "label": "Chaîne",
          "value": "Inspection et lubrification aux échéances du plan ; fréquence accrue en usage salissant",
          "confidence": "official_other_market"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur & filtre",
      "specification": "SAE 10W-40 · environ 3,0 L avec filtre",
      "replacement_interval": "À chaque échéance du planning KOVE 2026",
      "observed_price": "≈40–52 € le pack 4 L + filtre",
      "source_type": "observed",
      "note": "Fourchette issue de packs vidange 10W-40 avec filtre sélectionné pour la KOVE 510X 2025. Le bidon de 4 L couvre la quantité documentée de 3,0 L avec filtre."
    },
    {
      "part": "Filtre à air",
      "specification": "DNA R-DA5E23-01 · compatible KOVE 510X 2025-2026",
      "replacement_interval": "Inspection / remplacement selon planning et état",
      "observed_price": "≈88–98 €",
      "source_type": "observed",
      "note": "Référence adaptable DNA, pas une référence OEM KOVE. Prix promotionnel et prix catalogue observés chez WRS. Référence conservée pour la future base Consommables."
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Liquide moto compatible circuit aluminium",
      "replacement_interval": "24 mois selon planning KOVE",
      "observed_price": "≈12–13 € / L",
      "source_type": "observed",
      "note": "Repère de marché observé dans le catalogue véhicule KOVE 510X."
    },
    {
      "part": "Liquide de frein",
      "specification": "DOT 4",
      "replacement_interval": "Selon planning constructeur",
      "observed_price": "≈8–12 € / 500 ml",
      "source_type": "observed",
      "note": "Fourchette resserrée observée sur plusieurs liquides DOT 4."
    },
    {
      "part": "Pneus & roues",
      "specification": "110/80 R19 avant · 150/70 R17 arrière",
      "replacement_interval": "Selon usure",
      "observed_price": "≈280–285 € le train Road 6",
      "source_type": "observed",
      "note": "Repère premium route construit sur les prix observés du Michelin Road 6 dans les deux dimensions exactes. Montage et valves non compris."
    }
  ],
  "budget": {
    "title": "Budget entretien autour de 30 000 km",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈910–1 430 €",
      "cost_per_km": "≈0,030–0,048 €/km",
      "interval_rule": "1 000 km puis tous les 6 000 km · échéance 31 000 km incluse",
      "note": "Estimation LabelMoto des seuls forfaits atelier observés jusqu’à la révision de 31 000 km, première échéance immédiatement suivante après 30 000 km. Les consommables, pièces d’usure et opérations additionnelles restent exclus."
    },
    "cards": [
      {
        "label": "Révisions incluses",
        "value": "6 passages",
        "note": "1 000, 7 000, 13 000, 19 000, 25 000 et 31 000 km."
      },
      {
        "label": "Forfait courant observé",
        "value": "149–239 €",
        "note": "Repère atelier français observé ; consommables en supplément."
      },
      {
        "label": "Révision majeure",
        "value": "169–239 €",
        "note": "Repère atelier observé à 25 000 km ; pièces et opérations additionnelles possibles."
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
      "title": "Calendrier selon le millésime",
      "description": "Des documents KY510X plus anciens utilisent une cadence différente. Pour une intervention, le carnet correspondant au VIN et au millésime doit rester prioritaire.",
      "type": "manufacturer_monitoring",
      "confidence": "official_other_market"
    },
    {
      "title": "Puissance annoncée en France",
      "description": "La documentation France consultée présente des valeurs divergentes. Vérifier les données d’homologation correspondant précisément à la moto.",
      "type": "manufacturer_monitoring",
      "confidence": "official_fr"
    },
    {
      "title": "Révision majeure à 25 000 km",
      "description": "Cette échéance comporte davantage d’opérations qu’une révision périodique courante et doit être anticipée dans le budget.",
      "type": "usage_limitation",
      "confidence": "official_other_market"
    }
  ],
  "verdict": {
    "title": "Un cycle de 6 000 km à suivre selon le millésime",
    "text": "La 510X demande une attention particulière au calendrier applicable à son millésime. Pour la génération documentée par le planning KOVE 2026, la première révision arrive à 1 000 km puis les échéances progressent par pas de 6 000 km, avec une révision majeure à 25 000 km.",
    "strengths": [
      "Cycle 2026 clairement défini",
      "Quantités d’huile documentées",
      "Bougie et principaux contrôles techniques documentés"
    ],
    "weaknesses": [
      "Anciens calendriers différents encore en circulation",
      "Révision majeure à 25 000 km",
      "Certaines références de consommables restent à vérifier avant commande"
    ]
  },
  "data_quality": {
    "market": "France",
    "model_year": "2025+ / planning 2026",
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
        "label": "KOVE France · 510X",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://kovemotor.fr/modele/510x/",
        "note": "Page France : 498,4 cm³, A2, 178 kg à vide, 841 mm, 20 L et divergence 32 / 35 kW."
      },
    {
        "label": "Manuel KY510X",
        "type": "technical_documentation",
        "market": "Europe / international",
        "model_year": "génération antérieure",
        "url": "https://www.manualslib.com/manual/4082659/Kove-Ky510x.html",
        "note": "Huile / liquides et ancien calendrier ; à ne pas confondre avec le planning 2026."
      },
    {
        "label": "KOVE · paramètres techniques 510X",
        "type": "technical_documentation",
        "market": "International",
        "model_year": "2025+",
        "url": "https://www.kovemoto.com/uploadfile/202509/be3e9e5bf236996.pdf",
        "note": "CR8EI, écartement 0,6–0,8 mm, soupapes 0,10–0,15 / 0,15–0,20 mm et pneus 110/80R19–150/70R17."
      },
    {
        "label": "Louis Europe · 510X 2026+",
        "type": "observed",
        "market": "Europe",
        "model_year": "2026+",
        "url": "https://www.louis.eu/en/bike-database/kove-510x/ko510x-26/5983",
        "note": "SAE 10W-40, API SN, DOT 4 et repères de prix européens."
      },
    {
      "label": "Tech2Roo · packs vidange KOVE 510X",
      "type": "observed",
      "market": "France",
      "model_year": "2025",
      "url": "https://www.tech2roo.com/parts/pieces-moto/kove/510x/2025/1404-packs-vidange-moto",
      "note": "Packs 10W-40 de 4 L avec filtre sélectionné selon la moto ; prix observés utilisés pour la fourchette vidange."
    },
    {
      "label": "WRS · filtre à air DNA KOVE 510X",
      "type": "observed",
      "market": "Europe",
      "model_year": "2025-2026",
      "url": "https://www.wrs.it/fr/28033355-510-x",
      "note": "Filtre à air DNA R-DA5E23-01 annoncé compatible KOVE 510X 2025-2026 ; prix observé et référence adaptable conservée pour la future base Consommables."
    },
    {
      "label": "Louis · KOVE 510X",
      "type": "observed",
      "market": "Europe",
      "model_year": "2024-2026",
      "url": "https://www.louis.eu/fr/bike-database/kove-510x/ko510x-24/5982",
      "note": "Catalogue véhicule utilisé pour les repères de liquide de frein et liquide de refroidissement. La bougie n’est pas tarifée dans LabelMoto tant que la divergence CR8EI / CR8E / CR8EIX n’est pas résolue."
    },
    {
      "label": "Oponeo · Michelin Road 6 110/80 R19 + 150/70 R17",
      "type": "observed",
      "market": "France",
      "model_year": "2026",
      "url": "https://www.oponeo.fr/pneu-moto-modele/michelin-road-6",
      "note": "Prix observés pour les deux dimensions d’origine de la 510X ; utilisés comme repère premium route, hors montage."
    }
  ]
  },
  "equivalents_v2": [
    {
      "id": "cfmoto-450mt-2024-plus",
      "name": "CFMOTO 450MT",
      "reason": "Trail A2 moderne de cylindrée proche."
    },
    {
      "id": "voge-ds525x-2024-plus",
      "name": "VOGE DS525X",
      "reason": "Trail A2 500 cm³ déjà documenté sur LabelMoto."
    }
  ]
};

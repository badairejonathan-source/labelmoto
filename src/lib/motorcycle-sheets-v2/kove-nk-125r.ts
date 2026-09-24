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
  "conclusion": "La migration V2 corrige surtout la périodicité d’entretien et la dimension arrière documentée par le manuel, tout en conservant l’ID existant et les données France utiles."
};

export const koveNk125rV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide KOVE NK 125R : calendrier 2026, huile, filtre, bougie, soupapes, liquides, transmission et coûts atelier observés.",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 6000,
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 11000,
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 16000,
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    },
    {
      "km": 21000,
      "title": "Révision majeure",
      "price_estimate": "≈169–239 € + opérations additionnelles",
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
      "note": "Planning KOVE Service Schedule 2026. Le cycle recommence à 26 000 km sur la base de l’échéance 6 000 km."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-40 · API SL ou supérieur · 1,1 L vidange simple · 1,3 L après intervention crépine / remise à sec",
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
  "consumables_v2": [],
  "budget": {
    "title": "Repères de budget entretien — France / Europe",
    "cards": [
      {
        "label": "Forfait atelier KOVE observé",
        "value": "149 €",
        "note": "Forfait deux-roues de base affiché par un atelier KOVE français ; consommables en supplément."
      },
      {
        "label": "Forfait plus complet observé",
        "value": "169 à 239 €",
        "note": "Tarifs atelier français observés selon contenu de l’intervention ; consommables / pièces additionnelles possibles."
      },
      {
        "label": "Statut prix",
        "value": "Observé — non constructeur",
        "note": "Ces montants ne sont ni un barème national KOVE ni un devis spécifique au modèle."
      }
    ],
    "note": "Toujours demander un devis : temps de main-d’œuvre, consommables, réglage des soupapes, pneus, transmission et opérations additionnelles font varier la facture."
  },
  "warranty": {
    "duration": "2 ans à compter du début de garantie, sans limitation de kilométrage (garantie constructeur KOVE France, sauf stipulation contraire).",
    "coverage": "Défauts de matériau ou de fabrication acceptés dans les conditions KOVE France, sous réserve des exclusions contractuelles.",
    "maintenance_requirement": "Respecter le plan d'entretien applicable au modèle, au millésime et au VIN, et conserver les justificatifs d'entretien.",
    "claim_requirement": "Pour une demande de prise en charge, se rapprocher d'un revendeur / réparateur agréé KOVE France avec les justificatifs demandés.",
    "legal_warranty_note": "Les CGV KOVE Moto France distinguent la garantie constructeur de 2 ans des garanties légales françaises. Les exclusions et la procédure de prise en charge restent celles du contrat remis avec la moto.",
    "market": "France",
    "source_label": "KOVE Moto France · CGV / garantie constructeur"
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
    "last_verified": "23/09/2026",
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

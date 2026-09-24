import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const kove450RallyDisplayData = {
  "modelName": "KOVE 450 Rally",
  "model": "KOVE 450 Rally",
  "year": "2024+",
  "category": "Trail / Rally",
  "introduction": "La fiche existante couvre une génération 450 Rally 449 cm³ / 42 ch avec configurations rally déjà enregistrées. Le V2 ne remplace pas ces données historiques par une autre version : il documente séparément le planning KOVE 2026 de la '450 Rally Regular' et conserve le conflit avec l’ancien manuel France.",
  "engine": {
    "type": "Monocylindre 4 temps, DOHC, refroidissement liquide",
    "displacement": "449 cm³",
    "power": "≈ 42 ch / 31 kW selon la fiche existante France / Europe",
    "torque": "≈ 35 Nm selon la génération existante"
  },
  "cycleParts": {
    "note": "Conserver les variantes et composants déjà présents dans le document Firestore ; ne pas homogénéiser avec une 450 Rally 2026 d’un autre marché sans preuve France."
  },
  "dimensions": {
    "note": "La capacité de réservoir, la hauteur de selle et le poids varient selon génération / configuration. La fiche existante conserve ses variantes historiques."
  },
  "faq": [
    {
      "question": "Quel est le planning KOVE 2026 de la 450 Rally Regular ?",
      "answer": "500, 2 500, 4 500, 6 500 et 8 500 km, puis répétition du cycle à partir de 10 500 km."
    },
    {
      "question": "Pourquoi trouve-t-on aussi 1 000 / 3 000 / 5 000 / 7 000 / 9 000 km ?",
      "answer": "Un ancien manuel France de la 450 Rally documente 1 000 / 3 000 / 5 000 / 7 000 / 9 000 km. La fiche LabelMoto applique comme planning courant la table KOVE 2026 (500 / 2 500 / 4 500 / 6 500 / 8 500 km) et conserve l’ancienne cadence comme donnée historique de génération."
    },
    {
      "question": "Quelles opérations sont renforcées en rallye / désert ?",
      "answer": "Le planning KOVE 2026 indique notamment filtre à air quotidien, contrôle des soupapes toutes les 30 h, embrayage toutes les 20 h et huile de suspension toutes les 20 h en usage rallye/désert."
    }
  ],
  "conclusion": "Le V2 corrige l’ancien calendrier générique sans effacer les variantes historiques de la fiche Firestore."
};

export const kove450RallyV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide KOVE 450 Rally : planning 2026 très rapproché, opérations rally/désert et conflit de génération documenté.",
  "quick_facts": [
    {
      "label": "CYLINDRÉE",
      "value": "449 cm³"
    },
    {
      "label": "PUISSANCE",
      "value": "≈ 42 ch selon génération existante"
    },
    {
      "label": "USAGE",
      "value": "Rally / trail engagé"
    },
    {
      "label": "POINT CLÉ",
      "value": "500 / 2 500 / 4 500 / 6 500 / 8 500 km (planning 2026)"
    }
  ],
  "quick_maintenance": [
    {
      "label": "Planning 2026 Regular",
      "value": "500 / 2 500 / 4 500 / 6 500 / 8 500 km",
      "confidence": "official_other_market"
    },
    {
      "label": "Huile moteur",
      "value": "SAE 10W-40 · API SN · 1,6 L avec filtre",
      "confidence": "multiple_sources"
    },
    {
      "label": "Bougie",
      "value": "CR8E · écartement 0,7–0,8 mm",
      "confidence": "technical_documentation"
    },
    {
      "label": "Usage rallye / désert",
      "value": "Air quotidien · soupapes 30 h · embrayage 20 h · suspension 20 h",
      "confidence": "official_other_market"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 500,
      "title": "Première révision",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Regular. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 2500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Regular. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 4500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Regular. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 6500,
      "title": "Révision rally périodique",
      "price_estimate": "≈199–299 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection / remplacement du filtre à huile selon état",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Regular. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    },
    {
      "km": 8500,
      "title": "Révision majeure",
      "price_estimate": "≈299 € + opérations additionnelles",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur",
          "source_type": "official_other_market"
        },
        {
          "label": "Remplacement filtre à huile",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle filtre à air, transmission, freinage et partie-cycle",
          "source_type": "official_other_market"
        },
        {
          "label": "Contrôle du jeu aux soupapes",
          "source_type": "official_other_market"
        }
      ],
      "note": "Planning constructeur KOVE 2026 — 450 Rally Regular. Le cycle recommence à 10 500 km à partir de la logique 2 500 km."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-40 · API SN · 1,6 L avec filtre · 1,8 L moteur sec",
      "rows": [
        {
          "label": "Spécification",
          "value": "SAE 10W-40 · API SN",
          "confidence": "multiple_sources"
        },
        {
          "label": "Avec filtre",
          "value": "1,6 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Après démontage moteur",
          "value": "1,8 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Huile moteur",
          "value": "Remplacement à 500 / 2 500 / 4 500 / 6 500 / 8 500 km",
          "confidence": "official_other_market"
        },
        {
          "label": "Filtre à huile",
          "value": "Remplacement à 500 / 4 500 / 8 500 km ; inspection/remplacement aux autres échéances",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "I/R selon planning · entretien quotidien en rallye / désert",
      "rows": [
        {
          "label": "Usage normal",
          "value": "Inspection / nettoyage / remplacement selon chaque échéance du planning 2026",
          "confidence": "official_other_market"
        },
        {
          "label": "Rallye / désert",
          "value": "Nettoyage ou remplacement quotidien",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "NGK CR8E · écartement 0,7–0,8 mm",
      "rows": [
        {
          "label": "Référence",
          "value": "NGK CR8E",
          "confidence": "technical_documentation"
        },
        {
          "label": "Écartement",
          "value": "0,7–0,8 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Contrôle",
          "value": "Inspection aux échéances prévues par le planning KOVE",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "ADM 0,10 mm · ÉCH 0,15 mm · 30 h en rallye/désert",
      "rows": [
        {
          "label": "Admission à froid",
          "value": "0,10 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Échappement à froid",
          "value": "0,15 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Usage Regular",
          "value": "Contrôle à l’échéance majeure du cycle 2026",
          "confidence": "official_other_market"
        },
        {
          "label": "Rallye / désert",
          "value": "Contrôle et réglage toutes les 30 h",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Capacité radiateur 1,2 L · contrôle périodique · remplacement à 24 mois",
      "rows": [
        {
          "label": "Capacité radiateur",
          "value": "1,2 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Contrôle",
          "value": "Inspection à chaque échéance du planning",
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
      "summary": "DOT 4 · contrôle des plaquettes · remplacement à 12 mois",
      "rows": [
        {
          "label": "Liquide",
          "value": "DOT 4 ou équivalent",
          "confidence": "technical_documentation"
        },
        {
          "label": "Plaquettes",
          "value": "Inspection de l’usure aux échéances du plan",
          "confidence": "official_other_market"
        },
        {
          "label": "Remplacement liquide",
          "value": "12 mois selon planning KOVE 2026",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "90/90-21 · 140/80-18",
      "rows": [
        {
          "label": "Avant",
          "value": "90/90-21",
          "confidence": "technical_documentation"
        },
        {
          "label": "Arrière",
          "value": "140/80-18",
          "confidence": "technical_documentation"
        },
        {
          "label": "Pression standard — version à chambres",
          "value": "230 kPa avant · 250 kPa arrière sur manuel propriétaire",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Flèche 30–55 mm · nettoyage et lubrification réguliers",
      "rows": [
        {
          "label": "Flèche de chaîne",
          "value": "30–55 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Entretien",
          "value": "Inspecter, nettoyer et lubrifier régulièrement ; fréquence accrue en conditions sévères",
          "confidence": "technical_documentation"
        },
        {
          "label": "Lubrifiant",
          "value": "Lubrifiant pour chaîne à joints ou huile d’engrenages SAE 80/90",
          "confidence": "technical_documentation"
        },
        {
          "label": "Embrayage — rallye / désert",
          "value": "Contrôle toutes les 20 h",
          "confidence": "official_other_market"
        }
      ],
      "note": "Le planning KOVE 2026 prévoit également le remplacement de l’huile de suspension toutes les 20 h en usage rallye/désert."
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-40 · API SN",
      "replacement_interval": "À chaque échéance du planning 2026",
      "source_type": "multiple_sources",
      "note": "1,6 L avec filtre."
    },
    {
      "part": "Bougie",
      "specification": "NGK CR8E · 0,7–0,8 mm",
      "replacement_interval": "Inspection selon planning KOVE",
      "source_type": "technical_documentation"
    },
    {
      "part": "Liquide de frein",
      "specification": "DOT 4",
      "replacement_interval": "12 mois",
      "source_type": "technical_documentation"
    }
  ],
  "budget": {
    "title": "Repères de budget entretien — 450 Rally",
    "cards": [
      {
        "label": "Forfait 450 Rally observé",
        "value": "199 €",
        "note": "Forfait spécifique 450 Rally affiché par un atelier KOVE français ; consommables en supplément."
      },
      {
        "label": "Forfait grande intervention observé",
        "value": "299 €",
        "note": "Forfait atelier affiché avec opérations élargies ; consommables / pièces en supplément."
      },
      {
        "label": "Statut prix",
        "value": "Observé — non constructeur",
        "note": "Le kilométrage du forfait atelier ne doit pas être confondu avec le planning KOVE 2026."
      }
    ],
    "note": "Le planning constructeur 2026 de la 450 Rally Regular est plus rapproché que les intitulés kilométriques du forfait atelier observé ; le devis réel dépend du type d’usage."
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
    "market": "France / international",
    "model_year": "2024+ / planning 2026 Regular",
    "manufacturer_fr_verified": false,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
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
        "label": "Backup Firestore LabelMoto · KOVE 450 Rally",
        "type": "technical_documentation",
        "market": "France",
        "model_year": "2024+",
        "note": "Conserver les variantes et données historiques utiles du document existant ; ne pas écraser par une autre configuration."
      },
      {
        "label": "Ancien manuel France KOVE 450 Rally",
        "type": "technical_documentation",
        "market": "France",
        "model_year": "génération antérieure",
        "url": "https://www.kovemoto.com/service",
        "note": "Cadence 1 000 / 3 000 / 5 000 / 7 000 / 9 000 km, différente du planning KOVE 2026."
      },
      {
        "label": "KOVE · paramètres techniques 450 Rally",
        "type": "technical_documentation",
        "market": "International",
        "model_year": "2024+",
        "url": "https://www.kovemoto.com/uploadfile/202308/f222fe653105aef.pdf",
        "note": "CR8E, écartement 0,7–0,8 mm, soupapes 0,10 / 0,15 mm, pneus."
      },
      {
        "label": "Manuel propriétaire KOVE 450 Rally",
        "type": "technical_documentation",
        "market": "International",
        "model_year": "2024+",
        "url": "https://device.report/m/81101e317ddf83c534e3e9a0839be988da51d697dccc0f31a9596686ac4257a6",
        "note": "1,6 L avec filtre, 1,8 L moteur réassemblé, chaîne et procédures utilisateur."
      },
      {
        "label": "KOVE 450 Rally · manuel maintenance",
        "type": "technical_documentation",
        "market": "International",
        "model_year": "2024+",
        "url": "https://www.manualslib.com/manual/3344810/Kove-450-Rally.html",
        "note": "Capacité refroidissement 1,2 L, DOT 4, pressions et données atelier."
      },
      {
        "label": "Manuel utilisateur 450 Rally FR",
        "type": "technical_documentation",
        "market": "France / Europe",
        "model_year": "génération documentée",
        "url": "https://fr.scribd.com/document/856929107/450-Rally-Instruction-Manual-en-fr-pdf-1",
        "note": "SAE 10W-40 API SN, DOT 4, pneus, chaîne 30–55 mm et procédures d’entretien."
      }
    ]
  },
  "equivalents_v2": [
    {
      "name": "CFMOTO 450MT",
      "reason": "Trail A2 450 cm³, beaucoup plus routier."
    },
    {
      "name": "Honda CRF300 Rally",
      "reason": "Rally/trail léger, moins puissant mais réseau et recul supérieurs."
    }
  ]
};

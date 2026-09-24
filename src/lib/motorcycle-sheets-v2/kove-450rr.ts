import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const kove450rrDisplayData = {
  "modelName": "KOVE 450RR",
  "model": "KOVE 450RR",
  "year": "2026+",
  "category": "Sportive A",
  "introduction": "Nouvelle sportive quatre cylindres 443 cm³ Euro 5+, annoncée à 49 kW à 13 250 tr/min et 38 Nm à 11 000 tr/min. KOVE annonce 165 kg en ordre de marche, 15 L, selle 785 mm, KYB réglable, TCS, quickshifter, Ram Air et freinage TAISKO.",
  "engine": {
    "type": "4 cylindres en ligne, 4 temps, refroidissement liquide, DOHC 16 soupapes",
    "displacement": "443 cm³",
    "power": "49 kW / 66,6 ch à 13 250 tr/min (jusqu’à env. 70 ch annoncés avec Ram Air à haute vitesse)",
    "torque": "38 Nm à 11 000 tr/min",
    "boreStroke": "59 × 40,5 mm",
    "compression": "12,9:1",
    "transmission": "6 rapports, embrayage multidisque anti-dribble"
  },
  "cycleParts": {
    "frontSuspension": "KYB Ø41 mm inversée entièrement réglable",
    "rearSuspension": "KYB entièrement réglable",
    "frontTire": "120/70 ZR17",
    "rearTire": "160/60 ZR17",
    "frontBrake": "Double disque / étriers TAISKO 4 pistons + ABS",
    "rearBrake": "Disque 220 mm / étrier 1 piston + ABS"
  },
  "dimensions": {
    "wetWeight": "165 kg en ordre de marche",
    "seatHeight": "785 mm (plage ergonomique annoncée jusqu’à 795 mm)",
    "tank": "15 L",
    "groundClearance": "118 mm",
    "wheelbase": "1 385 mm"
  },
  "faq": [
    {
      "question": "Quand réviser la KOVE 450RR ?",
      "answer": "Le planning KOVE 2026 prévoit 1 000, 6 000, 11 000, 16 000 et 21 000 km, puis répétition du cycle à partir de 26 000 km."
    },
    {
      "question": "La 450RR est-elle A2 ?",
      "answer": "La version actuelle vérifiée est annoncée à 49 kW ; aucune homologation A2 France n’est intégrée à cette fiche sans source KOVE France spécifique."
    },
    {
      "question": "Quelle huile et quelles bougies utilise la 450RR ?",
      "answer": "La documentation KOVE actuelle indique une huile SAE 10W-40, API SL ou supérieur, JASO T903:2023 MA, avec 2,6 L lors du remplacement avec filtre. La fiche technique constructeur 450RR indique des bougies LMARAI-10 avec un écartement de 0,9 à 1,0 mm."
    }
  ],
  "longevityTips": [
    "Respecter la première révision à 1 000 km puis le cycle d’entretien prévu pour la 450RR.",
    "Contrôler régulièrement le niveau d’huile et utiliser une 10W-40 conforme aux spécifications prévues pour le moteur.",
    "Nettoyer, lubrifier et contrôler la tension de chaîne entre deux révisions, notamment après pluie, lavage ou conduite soutenue.",
    "Contrôler plus fréquemment le filtre à air si la moto roule régulièrement dans un environnement poussiéreux.",
    "Anticiper l’échéance majeure de 21 000 km et surveiller pneus et freinage plus régulièrement en conduite sportive."
  ],
  "conclusion": "Sur la 450RR, le suivi du moteur et des consommables mérite une attention régulière. Respectez le cycle d’entretien, surveillez le niveau d’huile et contrôlez chaîne, pneus et freinage entre deux passages en atelier. L’échéance majeure de 21 000 km mérite d’être anticipée car elle comprend notamment le contrôle du jeu aux soupapes."
};

export const kove450rrV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide KOVE 450RR 2026 : calendrier constructeur, huile 10W-40, bougies LMARAI-10, soupapes, liquides, pneus, chaîne et budget atelier.",
  "quick_facts": [
    { "label": "PUISSANCE", "value": "66,6 ch" },
    { "label": "COUPLE", "value": "38 Nm" },
    { "label": "CYLINDRÉE", "value": "443 cm³" },
    { "label": "SELLE", "value": "785 à 795 mm" },
    { "label": "RÉSERVOIR", "value": "15 L" },
    { "label": "PERMIS", "value": "A" }
  ],
  "quick_maintenance": [
    {
      "label": "Révisions",
      "value": "1 000 puis 6 000 / 11 000 / 16 000 / 21 000 km",
      "confidence": "official_other_market"
    },
    {
      "label": "Huile + filtre",
      "value": "10W-40 API SL+ JASO MA · 2,6 L · remplacement à chaque échéance",
      "confidence": "official_other_market"
    },
    {
      "label": "Bougies",
      "value": "LMARAI-10 · écartement 0,9 à 1,0 mm",
      "confidence": "technical_documentation"
    },
    {
      "label": "Soupapes",
      "value": "Contrôle à 21 000 km · 0,09 à 0,12 mm",
      "confidence": "technical_documentation"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Première révision / fin de rodage",
      "price_estimate": "≈149 €",
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
      "note": "Planning KOVE Service Schedule 2026. À partir de 26 000 km, le cycle reprend sur la base de l’échéance 6 000 km."
    },
    {
      "km": 6000,
      "title": "Révision périodique",
      "price_estimate": "≈169 €",
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
      "note": "Planning KOVE Service Schedule 2026. À partir de 26 000 km, le cycle reprend sur la base de l’échéance 6 000 km."
    },
    {
      "km": 11000,
      "title": "Révision périodique",
      "price_estimate": "≈169 €",
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
      "note": "Planning KOVE Service Schedule 2026. À partir de 26 000 km, le cycle reprend sur la base de l’échéance 6 000 km."
    },
    {
      "km": 16000,
      "title": "Révision périodique",
      "price_estimate": "≈169 €",
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
      "note": "Planning KOVE Service Schedule 2026. À partir de 26 000 km, le cycle reprend sur la base de l’échéance 6 000 km."
    },
    {
      "km": 21000,
      "title": "Révision majeure",
      "price_estimate": "≈239 €",
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
      "note": "Planning KOVE Service Schedule 2026. À partir de 26 000 km, le cycle reprend sur la base de l’échéance 6 000 km."
    },
{
      "km": 26000,
      "title": "Révision périodique",
      "price_estimate": "≈169 €",
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
      "note": "Planning KOVE Service Schedule 2026. À partir de 26 000 km, le cycle reprend sur la base de l’échéance 6 000 km."
    },
{
      "km": 31000,
      "title": "Révision périodique",
      "price_estimate": "≈169 €",
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
      "note": "Planning KOVE Service Schedule 2026. À partir de 26 000 km, le cycle reprend sur la base de l’échéance 6 000 km."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-40 · API SL+ · JASO MA · 2,6 L avec filtre",
      "rows": [
        {
          "label": "Spécification",
          "value": "SAE 10W-40 · API SL ou supérieur · JASO T903:2023 MA",
          "confidence": "official_other_market"
        },
        {
          "label": "Quantité avec filtre",
          "value": "2,6 L",
          "confidence": "official_other_market"
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
      "summary": "Inspection / nettoyage à chaque échéance · remplacement majeur",
      "rows": [
        {
          "label": "Plan 2026",
          "value": "Inspection / nettoyage aux révisions ; remplacement à l’échéance majeure et selon état",
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
      "summary": "LMARAI-10 · écartement 0,9 à 1,0 mm",
      "rows": [
        {
          "label": "Référence",
          "value": "LMARAI-10",
          "confidence": "technical_documentation"
        },
        {
          "label": "Écartement",
          "value": "0,9 à 1,0 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Entretien",
          "value": "Inspection aux échéances prévues par le tableau constructeur",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "0,09 à 0,12 mm · contrôle à 21 000 km",
      "rows": [
        {
          "label": "Admission",
          "value": "0,09 à 0,12 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Échappement",
          "value": "0,09 à 0,12 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Contrôle",
          "value": "À l’échéance majeure de 21 000 km du cycle 2026",
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
      "summary": "Contrôle du système · liquide remplacé tous les 12 mois",
      "rows": [
        {
          "label": "Système de freinage",
          "value": "Contrôle aux échéances du plan constructeur",
          "confidence": "official_other_market"
        },
        {
          "label": "Liquide de frein",
          "value": "Remplacement tous les 12 mois",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "120/70 ZR17 · 160/60 ZR17",
      "rows": [
        {
          "label": "Avant",
          "value": "120/70 ZR17",
          "confidence": "technical_documentation"
        },
        {
          "label": "Arrière",
          "value": "160/60 ZR17",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Inspection et lubrification régulières",
      "rows": [
        {
          "label": "Chaîne",
          "value": "Inspection et lubrification aux échéances du tableau constructeur",
          "confidence": "official_other_market"
        },
        {
          "label": "Usage poussiéreux",
          "value": "Nettoyage plus fréquent lorsque les conditions salissent fortement la transmission",
          "confidence": "official_other_market"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur & filtre",
      "specification": "SAE 10W-40 · API SL ou supérieur · JASO MA · environ 2,6 L avec filtre",
      "replacement_interval": "À chaque échéance du planning KOVE",
      "observed_price": "≈67,49 € / 4 L · filtre en supplément",
      "source_type": "observed"
    },
    {
      "part": "Filtre à air",
      "specification": "Sprint Filter SM261S compatible KOVE 450RR",
      "replacement_interval": "Inspection / nettoyage selon planning et remplacement selon état",
      "observed_price": "≈82,55 à 100,80 €",
      "source_type": "observed"
    },
    {
      "part": "Bougies",
      "specification": "LMARAI-10 · écartement 0,9 à 1,0 mm",
      "replacement_interval": "Selon planning constructeur",
      "observed_price": "Sur devis réseau KOVE · 4 unités",
      "source_type": "observed"
    },
    {
      "part": "Jeu aux soupapes",
      "specification": "0,09 à 0,12 mm",
      "replacement_interval": "Contrôle à l’échéance majeure de 21 000 km",
      "observed_price": "Sur devis atelier",
      "source_type": "observed"
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Liquide moto compatible aluminium",
      "replacement_interval": "24 mois",
      "observed_price": "≈12,74 € / L",
      "source_type": "observed"
    },
    {
      "part": "Freinage & liquide",
      "specification": "Liquide de frein selon préconisation constructeur",
      "replacement_interval": "Contrôle régulier · remplacement selon planning",
      "observed_price": "≈7,49 à 20,99 € le liquide · plaquettes sur devis",
      "source_type": "observed"
    },
    {
      "part": "Pneus & roues",
      "specification": "120/70 ZR17 avant · 160/60 ZR17 arrière",
      "replacement_interval": "Selon usure",
      "observed_price": "≈191,50 € le train",
      "source_type": "observed",
      "note": "Exemple de prix observé pour un train Metzeler aux dimensions correspondantes ; montage non compris."
    },
    {
      "part": "Chaîne & transmission",
      "specification": "Transmission secondaire selon démultiplication du modèle",
      "replacement_interval": "Inspection, tension et lubrification régulières",
      "observed_price": "Sur devis selon kit",
      "source_type": "observed"
    }
  ],
  "budget": {
    "title": "Repères de coût d'entretien",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈1 450–1 650 €",
      "cost_per_km": "≈0,048–0,055 €/km",
      "interval_rule": "1 000 km puis tous les 5 000 km",
      "note": "Calcul LabelMoto basé sur l’addition des révisions programmées jusqu’à 30 000 km et des consommables courants documentés. La révision de 31 000 km reste visible dans le calendrier mais n’entre pas dans ce total. Pneus, kit chaîne, plaquettes, batterie et autres pièces d’usure sont exclus du total principal afin de conserver une comparaison cohérente entre motos."
    },
    "cards": [
      {
        "label": "Huile moteur 10W-40",
        "value": "≈67,49 € / 4 L",
        "note": "Repère observé ; environ 2,6 L documentés avec filtre."
      },
      {
        "label": "Filtre à air Sprint Filter",
        "value": "≈82,55–100,80 €",
        "note": "Repère observé pour le SM261S compatible KOVE 450RR."
      },
      {
        "label": "Train de pneus",
        "value": "≈191,50 €",
        "note": "Repère observé pour 120/70 ZR17 + 160/60 ZR17 ; montage non compris."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. Les tarifs atelier varient selon la région, la main-d’œuvre et les opérations réellement nécessaires."
  },
  "known_issues_v2": [
    {
      "title": "Révision majeure à 21 000 km",
      "description": "Le planning d’entretien prévoit à cette échéance un contrôle du jeu aux soupapes. Cette intervention est plus importante qu’une révision périodique courante et mérite d’être anticipée.",
      "type": "manufacturer_monitoring",
      "confidence": "official_other_market"
    },
    {
      "title": "Niveau d’huile et entretien régulier",
      "description": "Le quatre-cylindres doit conserver un niveau d’huile correct entre les révisions. Un contrôle périodique du niveau reste recommandé, particulièrement en utilisation soutenue.",
      "type": "manufacturer_monitoring",
      "confidence": "official_other_market"
    },
    {
      "title": "Pneus, freinage et transmission",
      "description": "En conduite dynamique, surveillez l’état des pneus, des plaquettes et de la chaîne entre deux passages en atelier.",
      "type": "usage_limitation",
      "confidence": "multiple_sources"
    }
  ],

  "warranty": {
    "duration": "2 ans à compter du début de garantie, sans limitation de kilométrage (garantie constructeur KOVE France, sauf stipulation contraire).",
    "coverage": "Défauts de matériau ou de fabrication acceptés dans les conditions KOVE France, sous réserve des exclusions contractuelles.",
    "maintenance_requirement": "Respecter le plan d'entretien applicable au modèle, au millésime et au VIN, et conserver les justificatifs d'entretien.",
    "claim_requirement": "Pour une demande de prise en charge, se rapprocher d'un revendeur / réparateur agréé KOVE France avec les justificatifs demandés.",
    "legal_warranty_note": "Les CGV KOVE Moto France distinguent la garantie constructeur de 2 ans des garanties légales françaises. Les exclusions et la procédure de prise en charge restent celles du contrat remis avec la moto.",
    "market": "France",
    "source_label": "KOVE Moto France · CGV / garantie constructeur"
  },
  "verdict": {
    "title": "Notre avis",
    "text": "La KOVE 450RR se distingue par son quatre cylindres de 443 cm³ et son format compact. Avec 66,6 ch annoncés et un poids contenu, elle vise une conduite sportive sans basculer dans le gabarit d’une grosse supersport. Son intérêt principal vient de son moteur, de sa partie cycle et de son positionnement très spécifique dans cette cylindrée.",
    "strengths": [
      "Moteur quatre cylindres de 443 cm³",
      "Puissance de 66,6 ch",
      "Poids contenu",
      "Pneus 17 pouces de format sportif",
      "Fourche KYB de 41 mm"
    ],
    "weaknesses": [
      "Position de conduite plus exigeante qu’un roadster",
      "Données huile et bougies encore à verrouiller pour le millésime 2026",
      "Prix des pièces variables selon fournisseur"
    ]
  },

  "data_quality": {
    "market": "France / Europe",
    "model_year": "2026+",
    "manufacturer_fr_verified": false,
    "european_manual_verified": false,
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
      "label": "KOVE Global / FR locale · 450RR",
      "type": "official_other_market",
      "market": "Europe / international",
      "model_year": "2026",
      "url": "https://fr.kovemoto.com/kove-450rr",
      "note": "443 cm³, 49 kW, 38 Nm, 165 kg, 15 L, châssis, pneus et freinage."
    },
    {
      "label": "KOVE Global · 450RR",
      "type": "official_other_market",
      "market": "International",
      "model_year": "2026",
      "url": "https://www.kovemoto.com/kove-450rr?c=show&id=73",
      "note": "Spécifications détaillées actuelles."
    },
    {
      "label": "KOVE · actualité lancement 450RR Italie",
      "type": "official_other_market",
      "market": "Italie / Europe",
      "model_year": "08/09/2026",
      "url": "https://it.kovemoto.com/kove-450rr-la-nuova-supersportiva-che-ridefinisce-il-segmento-delle-medie-cilindrate",
      "note": "Version 2026 ; 49 kW, Ram Air, équipements et prix Italie. Ne pas transposer le prix en France."
    },
    {
      "label": "KOVE Colombia · lubrification 450RR",
      "type": "official_other_market",
      "market": "Colombie",
      "model_year": "2026+",
      "url": "https://kovemotocolombia.co/es/modelos/450-rr",
      "note": "10W-40, API SL+, JASO MA, 2,6 L avec filtre."
    },
    {
      "label": "KOVE · paramètres techniques 450RR",
      "type": "technical_documentation",
      "market": "International",
      "model_year": "2026",
      "url": "https://www.kovemoto.com/uploadfile/202509/5b3e37b0d285fa9.pdf",
      "note": "Bougies LMARAI-10, écartement 0,9 à 1,0 mm, soupapes 0,09 à 0,12 mm, pneus."
    },
    {
      "label": "KOVE · maintenance 800X / 450RR / 125R",
      "type": "official_other_market",
      "market": "International",
      "model_year": "2024+",
      "url": "https://www.kovemoto.com/uploadfile/202401/802109f0157a56a.pdf",
      "note": "Opérations huile, filtre, air, bougies, soupapes, freinage, refroidissement et chaîne."
    },
    {
      "label": "Vulka Motor · tarifs atelier 2 roues",
      "type": "observed",
      "market": "France",
      "model_year": "2026",
      "url": "https://vulkamotor.fr/atelier/tarifs/",
      "note": "Forfaits observés : 149 €, 169 € et 239 € selon le niveau d’intervention ; consommables facturés en supplément."
    },
    {
      "label": "Louis Moto · KOVE 350RR · consommables 10W-40 et fluides",
      "type": "observed",
      "market": "France",
      "model_year": "2026",
      "url": "https://www.louis-moto.fr/fr/bike-database/kove-350rr/ko350rr-25/6015",
      "note": "Prix observés pour huile 10W-40, liquide de frein et consommables génériques."
    },
    {
      "label": "Mistral Moto · Sprint Filter SM261S KOVE 450RR",
      "type": "observed",
      "market": "France",
      "model_year": "2026",
      "url": "https://www.mistralmoto.fr/boutique/filtre-a-air-sprintfilter-p08-kove-450-rr/",
      "note": "Filtre à air SM261S compatible KOVE 450RR, prix observé en France."
    },
    {
      "label": "Evo-X Racing · Sprint Filter SM261S KOVE 450RR",
      "type": "observed",
      "market": "France",
      "model_year": "2026",
      "url": "https://www.evo-xracing.com/fr/filtres-permanents/20176-filtre-a-air-haute-performance-p08-kove-3666348570734.html",
      "note": "Second prix observé pour le filtre SM261S."
    },
    {
      "label": "Flament Moto · train Metzeler 120/70 ZR17 + 160/60 ZR17",
      "type": "observed",
      "market": "France",
      "model_year": "2026",
      "url": "https://flament-moto.fr/product/train-de-pneus-metzeler-m5-interact-120-70-17-160-60-17/",
      "note": "Prix observé pour un train aux dimensions de la 450RR."
    }
  ]
  },
  "equivalents_v2": [
    {
      "name": "Kawasaki Ninja ZX-4RR",
      "reason": "Sportive quatre cylindres compacte à haut régime."
    },
    {
      "name": "Honda CBR500R",
      "reason": "Sportive routière de cylindrée proche, philosophie différente."
    }
  ]
};

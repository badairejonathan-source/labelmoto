import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const kove350rrDisplayData = {
  "modelName": "KOVE 350RR",
  "model": "KOVE 350RR",
  "year": "2026+",
  "category": "Sportive A2",
  "introduction": "Sportive bicylindre 344 cm³ homologuée A2, annoncée en France à 35 kW / 47 ch, 164 kg en ordre de marche, selle 790 mm et réservoir 15 L. Le manuel spécifique 350RR 2025 documente le rodage de 1 000 km, l’entretien du filtre à air papier, du refroidissement, du freinage et de la chaîne ; le plan officiel KOVE Colombia fournit une table 350RR complète, adaptée aux conditions locales, de 1 000 à 30 000 km.",
  "engine": {
    "type": "Bicylindre en ligne, 4 temps, refroidissement liquide, DOHC",
    "displacement": "344 cm³",
    "power": "35 kW / 47 ch à 11 500 tr/min",
    "torque": "32,2 Nm à 9 000 tr/min",
    "boreStroke": "69 × 46 mm",
    "compression": "12,5:1"
  },
  "cycleParts": {
    "frontTire": "110/70 R17",
    "rearTire": "150/60 R17"
  },
  "dimensions": {
    "wetWeight": "164 kg en ordre de marche",
    "seatHeight": "790 mm",
    "tank": "15 L",
    "groundClearance": "135 mm sur documentation internationale ; la page France affiche 340 mm, valeur incohérente conservée comme anomalie documentaire."
  },
  "faq": [
    {
      "question": "La KOVE 350RR est-elle A2 ?",
      "answer": "Oui. KOVE France l’annonce à 35 kW / 47 ch, dans la catégorie A2."
    },
    {
      "question": "Quel calendrier d’entretien est documenté pour la KOVE 350RR ?",
      "answer": "Le plan officiel KOVE Colombia dédié à la 350RR prévoit 1 000 km / 1 mois, puis 3 000 / 4 mois, 6 000 / 8 mois, 9 000 / 12 mois, 12 000 / 16 mois, 15 000 / 20 mois, 18 000 / 24 mois, 21 000 / 27 mois, 24 000 / 30 mois, 27 000 / 33 mois et 30 000 / 36 mois. Cette table est explicitement adaptée aux conditions colombiennes et est donc classée comme source officielle autre marché."
    },
    {
      "question": "Quelle huile moteur utiliser ?",
      "answer": "La documentation technique publiée par l’importateur officiel KOVE Colombia indique SAE 10W-40, API SN, JASO T903:2023 MA, avec 2,4 L lors du remplacement avec filtre."
    },
    {
      "question": "Quel est le jeu aux soupapes ?",
      "answer": "Pour le moteur Z269MP, la documentation technique KOVE donne 0,10 à 0,16 mm à l’admission et 0,16 à 0,22 mm à l’échappement, à froid."
    }
  ],
  "longevityTips": [
    "Respecter la première révision à 1 000 km puis les échéances prévues par le plan d’entretien correspondant au millésime de la moto.",
    "Contrôler régulièrement le niveau d’huile et utiliser une huile conforme aux spécifications du moteur.",
    "Nettoyer, lubrifier et contrôler la tension de chaîne entre deux révisions, particulièrement après pluie ou lavage.",
    "Contrôler plus souvent le filtre à air lorsque la moto roule dans un environnement poussiéreux.",
    "Surveiller régulièrement pneus, plaquettes et niveaux sans attendre systématiquement la prochaine révision."
  ],
  "conclusion": "La 350RR demande surtout de la régularité dans son entretien. Respectez les échéances du carnet, surveillez le niveau d’huile et gardez la chaîne correctement tendue et lubrifiée. Sur une moto d’occasion, vérifiez en priorité que les révisions successives sont bien tracées et que pneus, plaquettes et transmission ne présentent pas d’usure anormale."
};

export const kove350rrV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide KOVE 350RR : calendrier documenté, huile, filtre à air, soupapes, liquides, pneus, chaîne et budget atelier.",
  "quick_facts": [
    { "label": "PUISSANCE", "value": "47 ch" },
    { "label": "COUPLE", "value": "32,2 Nm à 9 000 tr/min" },
    { "label": "CYLINDRÉE", "value": "344 cm³" },
    { "label": "SELLE", "value": "790 mm" },
    { "label": "RÉSERVOIR", "value": "15 L" },
    { "label": "PERMIS", "value": "A2" }
  ],
  "quick_maintenance": [
    {
      "label": "Plan officiel spécifique",
      "value": "1 000 puis 3 000 / 6 000 / 9 000 km… jusqu’à 30 000 km",
      "confidence": "official_other_market"
    },
    {
      "label": "Huile moteur",
      "value": "SAE 10W-40 · API SN · JASO MA · 2,4 L avec filtre",
      "confidence": "official_other_market"
    },
    {
      "label": "Soupapes à froid",
      "value": "ADM 0,10 à 0,16 mm · ÉCH 0,16 à 0,22 mm",
      "confidence": "multiple_sources"
    },
    {
      "label": "Freinage",
      "value": "Liquide DOT 4",
      "confidence": "multiple_sources"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "months": 1,
      "title": "Première révision / fin de rodage",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 3000,
      "months": 4,
      "title": "Révision programmée",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 6000,
      "months": 8,
      "title": "Révision programmée",
      "price_estimate": "≈169 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 9000,
      "months": 12,
      "title": "Révision programmée",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 12000,
      "months": 16,
      "title": "Révision programmée",
      "price_estimate": "≈169 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 15000,
      "months": 20,
      "title": "Révision programmée",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 18000,
      "months": 24,
      "title": "Révision programmée",
      "price_estimate": "≈169 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 21000,
      "months": 27,
      "title": "Révision programmée",
      "price_estimate": "≈239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 24000,
      "months": 30,
      "title": "Révision programmée",
      "price_estimate": "≈169 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 27000,
      "months": 33,
      "title": "Révision programmée",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    },
    {
      "km": 30000,
      "months": 36,
      "title": "Révision programmée",
      "price_estimate": "≈239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Entretien selon le plan d’entretien KOVE 350RR utilisé pour cette fiche",
          "source_type": "official_other_market"
        },
        {
          "label": "Inspection générale : freinage, pneumatiques, transmission et niveaux",
          "source_type": "official_other_market"
        }
      ],
      "note": "Plan d’entretien KOVE 350RR utilisé comme base LabelMoto. Le carnet d’entretien correspondant au millésime et au VIN reste prioritaire."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-40 · API SN · JASO MA · 2,4 L avec filtre",
      "rows": [
        {
          "label": "Spécification",
          "value": "SAE 10W-40 · API SN · JASO T903:2023 MA",
          "confidence": "official_other_market"
        },
        {
          "label": "Quantité avec filtre",
          "value": "2,4 L",
          "confidence": "official_other_market"
        },
        {
          "label": "Quantité sans filtre",
          "value": "2,2 L",
          "confidence": "observed"
        }
      ],
      "note": "La quantité avec filtre est publiée par l’importateur officiel KOVE Colombia ; la capacité sans filtre est recoupée sur la base technique Louis du modèle européen."
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Élément papier · entretien en centre KOVE",
      "rows": [
        {
          "label": "Type",
          "value": "Élément filtrant papier",
          "confidence": "technical_documentation"
        },
        {
          "label": "Entretien",
          "value": "Nettoyage ou remplacement par un centre KOVEMOTO selon le plan du modèle",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "2 bougies · entretien selon le plan KOVE",
      "rows": [
        {
          "label": "Configuration",
          "value": "2 bougies pour le bicylindre Z269MP",
          "confidence": "technical_documentation"
        },
        {
          "label": "Entretien",
          "value": "Inspection / remplacement selon la table officielle 350RR",
          "confidence": "official_other_market"
        }
      ],
      "note": "La fiche ne publie pas de référence commerciale de bougie tant qu’aucune référence propre à la 350RR n’est donnée dans une source constructeur exploitable."
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "ADM 0,10 à 0,16 mm · ÉCH 0,16 à 0,22 mm à froid",
      "rows": [
        {
          "label": "Admission à froid",
          "value": "0,10 à 0,16 mm",
          "confidence": "multiple_sources"
        },
        {
          "label": "Échappement à froid",
          "value": "0,16 à 0,22 mm",
          "confidence": "multiple_sources"
        }
      ],
      "note": "Valeurs recoupées entre la documentation KOVE du moteur Z269MP et la base technique Louis du modèle européen."
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Contrôle à froid · remplacement en centre KOVE",
      "rows": [
        {
          "label": "Contrôle",
          "value": "Niveau contrôlé moteur froid entre repères mini et maxi",
          "confidence": "technical_documentation"
        },
        {
          "label": "Remplacement",
          "value": "Opération prévue en atelier KOVEMOTO selon le programme du modèle",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide",
      "summary": "DOT 4 · contrôle des niveaux et de l’usure",
      "rows": [
        {
          "label": "Liquide de frein",
          "value": "DOT 4",
          "confidence": "observed"
        },
        {
          "label": "Contrôle",
          "value": "Niveau des réservoirs et usure des plaquettes à inspecter régulièrement",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "110/70 R17 · 150/60 R17 · 2,3 / 2,5 bar",
      "rows": [
        {
          "label": "Avant",
          "value": "110/70 R17 · 2,3 bar",
          "confidence": "multiple_sources"
        },
        {
          "label": "Arrière",
          "value": "150/60 R17 · 2,5 bar",
          "confidence": "multiple_sources"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Inspection, nettoyage et lubrification réguliers",
      "rows": [
        {
          "label": "Entretien",
          "value": "Inspecter régulièrement la flèche, nettoyer et lubrifier chaîne et pignons",
          "confidence": "technical_documentation"
        },
        {
          "label": "Usage sévère",
          "value": "Inspection plus fréquente sur route dégradée, à haute vitesse ou en usage soutenu",
          "confidence": "technical_documentation"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur & filtre",
      "specification": "SAE 10W-40 · API SN · environ 2,4 L avec filtre",
      "replacement_interval": "Selon le plan d’entretien applicable à la moto",
      "observed_price": "≈67,49 € / 4 L · filtre en supplément",
      "source_type": "observed",
      "note": "Prix observé en France pour une huile 10W-40 premium. Le filtre dépend de la référence exacte du modèle."
    },
    {
      "part": "Filtre à air",
      "specification": "Filtre compatible KOVE 350RR",
      "replacement_interval": "Inspection selon planning et remplacement selon état",
      "observed_price": "Sur devis réseau KOVE",
      "source_type": "observed"
    },
    {
      "part": "Bougies",
      "specification": "Référence selon millésime / VIN",
      "replacement_interval": "Selon le plan d’entretien applicable",
      "observed_price": "Sur devis réseau KOVE",
      "source_type": "observed"
    },
    {
      "part": "Jeu aux soupapes",
      "specification": "Admission 0,10 à 0,16 mm · échappement 0,16 à 0,22 mm",
      "replacement_interval": "Contrôle selon le plan constructeur",
      "observed_price": "Sur devis atelier",
      "source_type": "observed"
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Liquide moto compatible aluminium",
      "replacement_interval": "Selon échéance constructeur",
      "observed_price": "≈12,74 € / L",
      "source_type": "observed"
    },
    {
      "part": "Freinage & liquide",
      "specification": "DOT 4",
      "replacement_interval": "Selon échéance constructeur et état des plaquettes",
      "observed_price": "≈7,49 à 20,99 € le liquide · plaquettes sur devis",
      "source_type": "observed"
    },
    {
      "part": "Pneus & roues",
      "specification": "110/70 R17 avant · 150/60 R17 arrière",
      "replacement_interval": "Selon usure",
      "observed_price": "≈165,33 à 299,18 € le train",
      "source_type": "observed",
      "note": "Prix observés sur des trains aux dimensions correspondantes ; montage non compris."
    },
    {
      "part": "Chaîne & transmission",
      "specification": "Kit chaîne selon démultiplication et millésime",
      "replacement_interval": "Contrôle, tension et lubrification réguliers",
      "observed_price": "Sur devis selon kit",
      "source_type": "observed"
    }
  ],
  "budget": {
    "title": "Repères de coût d'entretien",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈2 400–2 700 €",
      "cost_per_km": "≈0,080–0,090 €/km",
      "interval_rule": "1 000 km puis tous les 3 000 km",
      "note": "Calcul LabelMoto basé sur l’addition des révisions programmées jusqu’à 30 000 km et des consommables courants documentés. Pneus, kit chaîne, plaquettes, batterie et autres pièces d’usure sont exclus du total principal afin de conserver une comparaison cohérente entre motos."
    },
    "cards": [
      {
        "label": "Huile moteur 10W-40",
        "value": "≈67,49 € / 4 L",
        "note": "Repère observé ; environ 2,4 L documentés avec filtre."
      },
      {
        "label": "Liquide de refroidissement",
        "value": "≈12,74 € / L",
        "note": "Repère observé pour un liquide moto compatible aluminium."
      },
      {
        "label": "Train de pneus",
        "value": "≈165–299 €",
        "note": "Repère observé pour 110/70 R17 + 150/60 R17 ; montage non compris."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. Les tarifs atelier varient selon la région, la main-d’œuvre et les opérations réellement nécessaires."
  },
  "known_issues_v2": [
    {
      "title": "Historique des révisions",
      "description": "Le calendrier d’entretien de la 350RR comporte des échéances rapprochées. Sur une moto d’occasion, vérifiez que les interventions sont bien tracées dans le carnet et les factures.",
      "type": "manufacturer_monitoring",
      "confidence": "official_other_market"
    },
    {
      "title": "Filtre à air en environnement poussiéreux",
      "description": "Un usage fréquent sur des routes poussiéreuses justifie un contrôle plus rapproché du filtre à air afin d’éviter de rouler avec un élément fortement chargé.",
      "type": "usage_limitation",
      "confidence": "official_other_market"
    },
    {
      "title": "Transmission et consommables",
      "description": "Contrôlez régulièrement la chaîne, les plaquettes et les pneumatiques entre deux révisions, surtout en utilisation soutenue.",
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
    "text": "La KOVE 350RR propose une sportive légère, accessible et compatible A2. Son bicylindre de 344 cm³ vise davantage l’efficacité sur route et l’apprentissage que la recherche de puissance pure. Sa selle basse et son poids contenu la rendent facile à prendre en main.",
    "strengths": [
      "Format léger et accessible",
      "Compatible permis A2",
      "Selle basse de 790 mm",
      "Réservoir de 15 L",
      "Entretien détaillé déjà documenté"
    ],
    "weaknesses": [
      "Calendrier d’entretien rapproché dans le module actuel",
      "Prix des pièces variables selon fournisseur"
    ]
  },

  "data_quality": {
    "market": "France",
    "model_year": "2026+",
    "manufacturer_fr_verified": true,
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
      "label": "KOVE France · 350RR",
      "type": "official_fr",
      "market": "France",
      "model_year": "2026",
      "url": "https://kovemotor.fr/modele/350rr/",
      "note": "344 cm³, 35 kW / 47 ch, 164 kg, 790 mm, 15 L, prix France."
    },
    {
      "label": "KOVE Global · 350RR",
      "type": "official_other_market",
      "market": "International",
      "model_year": "2026",
      "url": "https://www.kovemoto.com/kove-350rr?c=show&id=118",
      "note": "Caractéristiques techniques ; garde au sol 135 mm."
    },
    {
      "label": "Manuel 350RR 2025",
      "type": "technical_documentation",
      "market": "International",
      "model_year": "2025",
      "url": "https://www.manualslib.com/manual/4502946/Kove-350rr-2025.html",
      "note": "Manuel spécifique 350RR : rodage 1 000 km et tableau d’entretien constructeur. Les échéances chiffrées publiées dans cette fiche proviennent de la table officielle KOVE Colombia, explicitement identifiée comme adaptée à ce marché."
    },
    {
      "label": "Louis · données entretien 350RR",
      "type": "observed",
      "market": "Europe",
      "model_year": "2026",
      "url": "https://www.louis-moto.fr/fr/bike-database/kove-350rr/350rr/5369",
      "note": "Base technique européenne utilisée en recoupement pour huile, jeux aux soupapes, DOT 4 et pressions de pneus ; valeurs cohérentes avec la documentation KOVE disponible."
    },
    {
      "label": "KOVE Colombia · manuel maintenance 350RR",
      "type": "official_other_market",
      "market": "Colombie",
      "model_year": "2026+",
      "url": "https://kovemotocolombia.co/es/posventa/manuales",
      "note": "Table officielle 350RR ; intervalles adaptés aux conditions colombiennes."
    },
    {
      "label": "KOVE Colombia · lubrification 350RR",
      "type": "official_other_market",
      "market": "Colombie",
      "model_year": "2026+",
      "url": "https://kovemotocolombia.co/es/por-que-kove/motul",
      "note": "SAE 10W-40, API SN, JASO MA, 2,4 L avec filtre."
    },
    {
      "label": "Louis Europe · 350RR 2025+",
      "type": "observed",
      "market": "Europe",
      "model_year": "2025+",
      "url": "https://www.louis-moto.com/en/bike-database/kove-350rr/ko350rr-25/6015",
      "note": "2,2 L sans filtre, DOT 4, pressions pneus et jeux aux soupapes."
    },
    {
      "label": "KOVE · paramètres moteur Z269MP",
      "type": "official_other_market",
      "market": "International",
      "model_year": "2025+",
      "url": "https://www.kovemoto.com/uploadfile/202509/db81297c2bb3a57.pdf",
      "note": "Moteur Z269MP : valeurs de jeu aux soupapes et spécifications moteur de la famille 350."
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
      "label": "RAW Motorsports · train Kenda 110/70 R17 + 150/60 R17",
      "type": "observed",
      "market": "France",
      "model_year": "2026",
      "url": "https://www.gasgasraw.com/fr/pneumatiques-et-mousses/1187178-train-de-pneus-kenda-km1-110-70-r-17-150-60-r-17.html",
      "note": "Prix observé pour un train correspondant aux dimensions utilisées sur la 350RR."
    },
    {
      "label": "Tonnycat · train Continental 110/70 ZR17 + 150/60 ZR17",
      "type": "observed",
      "market": "France",
      "model_year": "2026",
      "url": "https://www.tonnycat.com/train-de-pneus-sport-touring-continental-contimotion-110-70-zr-17-150-60-zr-17-3065238.html",
      "note": "Second repère de prix pour un train correspondant aux dimensions utilisées sur la 350RR."
    }
  ]
  },
  "equivalents_v2": [
    {
      "name": "Kawasaki Ninja 500",
      "reason": "Sportive A2 bicylindre de cylindrée proche."
    },
    {
      "id": "cfmoto-450sr-2023-plus",
      "name": "CFMOTO 450SR",
      "reason": "Sportive A2 bicylindre déjà documentée sur LabelMoto."
    }
  ]
};

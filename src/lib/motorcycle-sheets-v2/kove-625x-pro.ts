import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const kove625xProDisplayData = {
  "modelName": "KOVE 625X Pro",
  "model": "KOVE 625X Pro",
  "year": "2026+",
  "category": "Trail A / A2",
  "introduction": "Trail bicylindre 581 cm³ calé à 270°, annoncé en France à 46 kW / 62,5 ch à 7 750 tr/min et 56,5 Nm à 6 250 tr/min. Il est annoncé bridable A2, avec réservoir 21 L, selle 820 mm, 200 kg à vide et 221 kg en ordre de marche.",
  "engine": {
    "type": "Bicylindre en ligne 581 cm³, calage 270°, DOHC 8 soupapes, refroidissement liquide",
    "displacement": "581 cm³",
    "power": "46 kW / 62,5 ch à 7 750 tr/min — France",
    "torque": "56,5 Nm à 6 250 tr/min — France",
    "license": "A / A2, bridage 35 kW annoncé en France"
  },
  "cycleParts": {
    "frontSuspension": "KYB Ø43 mm, débattement 185 mm",
    "rearSuspension": "KYB, débattement 230 mm",
    "frontTire": "110/80 R19",
    "rearTire": "150/70 R17"
  },
  "dimensions": {
    "dryWeight": "200 kg à vide",
    "wetWeight": "221 kg en ordre de marche",
    "seatHeight": "820 mm",
    "tank": "21 L"
  },
  "faq": [
    {
      "question": "Quel est l’intervalle d’huile de la 625X Pro ?",
      "answer": "Le manuel KY600GY / 625X Pro indique une première intervention à 1 000 km puis un remplacement de l’huile tous les 5 000 km."
    },
    {
      "question": "Quelles sont les grandes échéances du tableau ?",
      "answer": "Le manuel prévoit la première révision à 1 000 km, puis l’huile et le filtre tous les 5 000 km. Le tableau principal comporte les contrôles à 10 000 / 20 000 / 30 000 / 40 000 km et recommence ensuite à partir du cycle 10 000 km."
    },
    {
      "question": "Quelle huile et quelle quantité ?",
      "answer": "Le manuel indique SAE 10W-40, API SN ou supérieur : 2,8 L sans filtre, 3,0 L avec filtre et 3,4 L après démontage complet du moteur."
    },
    {
      "question": "Quelle bougie ?",
      "answer": "Le manuel 625X Pro indique NGK CPR8EA-9, écartement 0,8 à 1,0 mm."
    }
  ],
  "longevityTips": [
    "Respecter la vidange et le remplacement du filtre à huile tous les 5 000 km après la première révision.",
    "Contrôler et lubrifier la chaîne tous les 1 000 km, et plus souvent après pluie, lavage ou utilisation sur piste.",
    "En environnement poussiéreux, inspecter le filtre à air plus souvent que le cycle normal de 10 000 km.",
    "Ne pas repousser le contrôle du jeu aux soupapes prévu à 20 000 km puis 40 000 km.",
    "Remplacer les liquides de frein et de refroidissement tous les deux ans selon la documentation constructeur."
  ],
  "conclusion": "Sur une 625X Pro d’occasion, vérifiez surtout la continuité des vidanges tous les 5 000 km et la preuve de la révision des 20 000 km lorsque la moto l’a atteinte. Cette échéance comprend le contrôle du jeu aux soupapes : en l’absence de facture ou de carnet renseigné, prévoyez cette intervention dans le budget d’achat."
};

export const kove625xProV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "license_fr": "A_BRIDABLE_A2",
  "license_fr_source": "https://kovemotor.fr/modele/625x-pro/",
  "license_fr_verified_at": "2026-09-30",
  "faq": kove625xProDisplayData.faq,
  "longevity_tips": kove625xProDisplayData.longevityTips,
  "conclusion": kove625xProDisplayData.conclusion,
  "hero_subtitle": "Guide KOVE 625X Pro : révision initiale 1 000 km, vidange tous les 5 000 km, contrôles principaux tous les 10 000 km, CPR8EA-9 et jeux aux soupapes chiffrés.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "46 kW / 62,5 ch"
    },
    {
      "label": "COUPLE FRANCE",
      "value": "56,5 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "581 cm³"
    },
    {
      "label": "POIDS",
      "value": "221 kg"
    },
    {
      "label": "RÉSERVOIR",
      "value": "21 L"
    }
  ,
    {"label":"HAUTEUR DE SELLE","value":"820 mm"}
  ],
  "quick_maintenance": [
    {
      "label": "Révisions / vidange",
      "value": "1 000 km puis huile + filtre tous les 5 000 km",
      "confidence": "technical_documentation"
    },
    {
      "label": "Contrôles principaux",
      "value": "10 000 / 20 000 / 30 000 / 40 000 km",
      "confidence": "technical_documentation"
    },
    {
      "label": "Jeu aux soupapes",
      "value": "Adm. 0,10–0,15 mm · Éch. 0,15–0,20 mm",
      "confidence": "technical_documentation"
    },
    {
      "label": "Liquides",
      "value": "Frein DOT 4 · frein et refroidissement : remplacement 2 ans",
      "confidence": "technical_documentation"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Première révision",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        }
      ],
      "note": "Première échéance constructeur KY600GY."
    },
    {
      "km": 5000,
      "title": "Révision périodique",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        }
      ],
      "note": "Huile et filtre : remplacement tous les 5 000 km après la première révision."
    },
    {
      "km": 10000,
      "title": "Révision principale",
      "price_estimate": "≈169 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        },
        {
          "label": "Opérations du tableau principal constructeur à cette échéance",
          "source_type": "technical_documentation"
        }
      ],
      "note": "Cycle principal constructeur 10 000 km."
    },
    {
      "km": 15000,
      "title": "Révision périodique",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        }
      ],
      "note": "Huile et filtre : échéance intermédiaire 5 000 km."
    },
    {
      "km": 20000,
      "title": "Révision majeure",
      "price_estimate": "≈239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        },
        {
          "label": "Opérations du tableau principal constructeur à cette échéance",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle / réglage du jeu aux soupapes",
          "source_type": "technical_documentation"
        }
      ],
      "note": "Le tableau constructeur prévoit le contrôle/réglage des soupapes à 20 000 km."
    },
    {
      "km": 25000,
      "title": "Révision périodique",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        }
      ],
      "note": "Huile et filtre : échéance intermédiaire 5 000 km."
    },
    {
      "km": 30000,
      "title": "Révision principale",
      "price_estimate": "≈169 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        },
        {
          "label": "Opérations du tableau principal constructeur à cette échéance",
          "source_type": "technical_documentation"
        }
      ],
      "note": "Cycle principal constructeur 10 000 km."
    },
    {
      "km": 35000,
      "title": "Révision périodique",
      "price_estimate": "≈149 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        }
      ],
      "note": "Huile et filtre : échéance intermédiaire 5 000 km."
    },
    {
      "km": 40000,
      "title": "Révision majeure",
      "price_estimate": "≈239 €",
      "price_type": "observed",
      "operations": [
        {
          "label": "Remplacement huile moteur + filtre à huile",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle transmission, freinage, pneumatiques et fixations",
          "source_type": "technical_documentation"
        },
        {
          "label": "Opérations du tableau principal constructeur à cette échéance",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle / réglage du jeu aux soupapes",
          "source_type": "technical_documentation"
        }
      ],
      "note": "À partir de 40 000 km, le manuel indique de répéter les opérations selon le cycle démarrant à 10 000 km."
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-40 · API SN+ · 3,0 L avec filtre",
      "rows": [
        {
          "label": "Spécification",
          "value": "SAE 10W-40 · API SN ou supérieur",
          "confidence": "technical_documentation"
        },
        {
          "label": "Sans remplacement filtre",
          "value": "2,8 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Avec remplacement filtre",
          "value": "3,0 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Après démontage moteur",
          "value": "3,4 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Remplacement",
          "value": "1 000 km puis tous les 5 000 km avec le filtre",
          "confidence": "technical_documentation"
        }
      ],
      "note": "Le manuel KY600GY donne 2,8 L sans filtre, 3,0 L avec filtre et 3,4 L après démontage complet."
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Remplacement au cycle 10 000 km / annuel · plus fréquent en poussière",
      "rows": [
        {
          "label": "Table constructeur",
          "value": "Remplacement au cycle principal et contrôle renforcé en environnement poussiéreux",
          "confidence": "technical_documentation"
        }
      ],
      "note": "Raccourcir fortement l’intervalle en environnement poussiéreux / tout-terrain."
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "NGK CPR8EA-9 · écartement 0,8–1,0 mm",
      "rows": [
        {
          "label": "Référence",
          "value": "NGK CPR8EA-9",
          "confidence": "technical_documentation"
        },
        {
          "label": "Écartement",
          "value": "0,8–1,0 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Entretien",
          "value": "Inspection / remplacement selon le tableau constructeur",
          "confidence": "technical_documentation"
        }
      ],
      "note": "Aucune référence OEM ne doit être ajoutée sans catalogue pièces vérifié."
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "20 000 / 40 000 km · Adm. 0,10–0,15 · Éch. 0,15–0,20 mm",
      "rows": [
        {
          "label": "Échéances",
          "value": "Contrôle / réglage à 20 000 et 40 000 km selon tableau constructeur",
          "confidence": "technical_documentation"
        },
        {
          "label": "Admission",
          "value": "0,10–0,15 mm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Échappement",
          "value": "0,15–0,20 mm",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Remplacement tous les 2 ans",
      "rows": [
        {
          "label": "Périodicité",
          "value": "Remplacement tous les 2 ans",
          "confidence": "official_other_market"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide",
      "summary": "DOT 4 · remplacement tous les 2 ans",
      "rows": [
        {
          "label": "Liquide / périodicité",
          "value": "DOT 4 · remplacement tous les 2 ans",
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
      "summary": "Inspection / réglage tous les 1 000 km et après lavage/pluie selon manuel",
      "rows": [
        {
          "label": "Chaîne",
          "value": "Inspection / réglage tous les 1 000 km et après lavage/pluie selon manuel",
          "confidence": "technical_documentation"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-40 · API SN ou supérieur · 3,0 L avec filtre",
      "replacement_interval": "Tous les 5 000 km après la première révision",
      "observed_price": "≈12–14 € / L",
      "source_type": "observed",
      "note": "Fourchette resserrée à partir de l’huile 10W-40 vendue dans le réseau KOVE France. Le prix concerne l’huile uniquement : aucune référence de filtre à huile 625X Pro suffisamment verrouillée n’est ajoutée ici."
    },
    {
      "part": "Filtre à air",
      "specification": "DNA R-DA5E23-01 · cross-référence OEM annoncée 320301-R100-000",
      "replacement_interval": "Cycle 10 000 km / annuel · plus fréquent en poussière",
      "observed_price": "≈90–115 €",
      "source_type": "observed",
      "note": "Filtre aftermarket DNA annoncé compatible KOVE 625X et 625X Pro 2025–2026. La référence OEM indiquée est une cross-référence publiée par DNA, pas une validation OEM KOVE indépendante."
    },
    {
      "part": "Bougie",
      "specification": "NGK CPR8EA-9 · écartement 0,8–1,0 mm",
      "replacement_interval": "Selon tableau constructeur",
      "observed_price": "≈14–16 € / unité",
      "source_type": "observed",
      "note": "Référence issue du manuel KY600GY / 625X Pro. Fourchette resserrée à partir de prix français observés pour la CPR8EA-9."
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Liquide moto prêt à l’emploi compatible alliages légers",
      "replacement_interval": "Tous les 2 ans",
      "observed_price": "≈12–14 € / L",
      "source_type": "observed",
      "note": "Repère de marché français sur Ipone Radiator Liquid et Motul Motocool Expert en conditionnement 1 L."
    },
    {
      "part": "Liquide de frein",
      "specification": "DOT 4",
      "replacement_interval": "Tous les 2 ans",
      "observed_price": "≈17 € / 450 ml",
      "source_type": "observed",
      "note": "Prix observé dans le réseau KOVE France pour le Bardahl XBF DOT 4 en 450 ml."
    },
    {
      "part": "Pneus & roues",
      "specification": "110/80 R19 avant · 150/70 R17 arrière · repère Pirelli Scorpion Rally STR",
      "replacement_interval": "Selon usure",
      "observed_price": "≈235–285 € le train",
      "source_type": "observed",
      "note": "Dimensions exactes de la 625X Pro. Fourchette hors montage construite à partir de prix européens observés sur le Pirelli Scorpion Rally STR dans les deux dimensions."
    }
  ],
  "budget": {
    "title": "Budget entretien autour de 30 000 km",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈1 100–1 300 €",
      "cost_per_km": "≈0,037–0,043 €/km",
      "interval_rule": "1 000 km puis huile + filtre tous les 5 000 km · échéance 30 000 km incluse",
      "note": "Estimation LabelMoto construite à partir des forfaits atelier observés : 149 € pour le cycle 5 000 km, 169 € pour le forfait 10 000 km et 239 € pour l’intervention complète. Le total théorique des sept passages jusqu’à 30 000 km est de 1 173 € avant consommables ; l’affichage est volontairement arrondi."
    },
    "cards": [
      {
        "label": "Révisions incluses",
        "value": "7 passages",
        "note": "1 000, 5 000, 10 000, 15 000, 20 000, 25 000 et 30 000 km."
      },
      {
        "label": "Entretien 5 000 km",
        "value": "≈149 €",
        "note": "Repère atelier observé pour huile, filtre et contrôles courants ; consommables facturés en supplément."
      },
      {
        "label": "Entretien 10 000 km",
        "value": "≈169 €",
        "note": "Repère atelier observé avec contrôle du filtre à air et opérations complémentaires."
      },
      {
        "label": "Échéance majeure",
        "value": "≈239 €",
        "note": "Repère atelier complet utilisé pour l’échéance des 20 000 km ; consommables et pièces restent en supplément."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. Les pneus, la transmission, les pièces d’usure et un éventuel réglage mécanique supplémentaire peuvent augmenter le coût réel."
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
      "title": "Révision des 20 000 km",
      "description": "Le manuel prévoit à 20 000 km le contrôle du jeu aux soupapes en plus des opérations courantes. Sur une moto ayant atteint cette échéance, demandez une facture ou un carnet renseigné.",
      "type": "manufacturer_monitoring",
      "confidence": "technical_documentation"
    },
    {
      "title": "Historique des vidanges",
      "description": "Après la première révision, l’huile et le filtre sont prévus tous les 5 000 km. Un historique irrégulier doit être pris en compte avant l’achat.",
      "type": "manufacturer_monitoring",
      "confidence": "technical_documentation"
    },
    {
      "title": "Filtre à air et transmission en usage poussiéreux",
      "description": "En usage sur piste ou en environnement poussiéreux, contrôlez plus fréquemment le filtre à air et la transmission que les intervalles routiers normaux.",
      "type": "usage_limitation",
      "confidence": "technical_documentation"
    }
  ],
  "verdict": {
    "title": "Un cycle clair, mais des vidanges assez rapprochées",
    "text": "La 625X Pro dispose d’un planning facile à suivre : huile et filtre tous les 5 000 km, contrôles principaux tous les 10 000 km et jeu aux soupapes à 20 000 km. Le principal point à anticiper est donc la fréquence des passages d’entretien plutôt qu’une opération technique inhabituelle.",
    "strengths": [
      "Calendrier spécifique KY600GY bien documenté",
      "Quantités d’huile et référence de bougie documentées",
      "Échéances soupapes clairement identifiées"
    ],
    "weaknesses": [
      "Vidange et filtre tous les 5 000 km",
      "Révision des 20 000 km à anticiper",
      "Références commerciales de certaines pièces encore incomplètes"
    ]
  },
  "data_quality": {
    "market": "France + manuel international/européen",
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
        "label": "KOVE France · 625X Pro",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://kovemotor.fr/modele/625x-pro/",
        "note": "581 cm³, 46 kW, 56,5 Nm, A/A2, 221 kg, 21 L, 820 mm et prix France."
      },
    {
        "label": "KOVE · manuel 625X Pro KY600GY",
        "type": "technical_documentation",
        "market": "Europe / international",
        "model_year": "2025–2026",
        "url": "https://www.kovemoto.com/uploadfile/202602/2094f7d8a22026c.pdf",
        "note": "Table d’entretien constructeur : première révision 1 000 km, huile/filtre tous les 5 000 km, cycle principal 10 000 / 20 000 / 30 000 / 40 000 km, soupapes à 20 000 / 40 000 km."
      },
    {
        "label": "KOVE Service · planning global 2026",
        "type": "official_other_market",
        "market": "International",
        "model_year": "2026",
        "url": "https://www.kovemoto.com/wp-content/uploads/2026/06/Service-schedule.pdf",
        "note": "Le PDF global consulté ne doit pas être utilisé pour déduire une cadence 625X Pro absente : priorité au manuel spécifique."
      },
    {
      "label": "KOVE France · huiles & lubrifiants",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://kove-racing.com/accessoires-et-pieces/entretien-consommables-moto-kove/huiles-lubrifiants-moto-kove/",
      "note": "Huile Bardahl XTC-M 10W-40 observée à 13,95 €/L et 46 € les 4 L ; DOT 4 Bardahl XBF observé à 17 € les 450 ml."
    },
    {
      "label": "DNA Filters · KOVE 625X / 625X Pro",
      "type": "observed",
      "market": "Europe / international",
      "model_year": "2025–2026",
      "url": "https://www.e-dnafilters.com/en/product/motorcycle-air-filters/kove/dna-4647/kov-625x/kove-625x-series-25-26-dna-air-filter-r-da5e23-01",
      "note": "Filtre DNA R-DA5E23-01 compatible 625X et 625X Pro 2025–2026 ; cross-référence OEM annoncée 320301-R100-000 ; prix observé 115,50 €."
    },
    {
      "label": "WRS · filtre DNA R-DA5E23-01",
      "type": "observed",
      "market": "Europe",
      "model_year": "26/09/2026",
      "url": "https://www.wrs.it/en/air-filters/494679-dna-cotton-air-filter-kove-510x-maverick-2025-2026.html",
      "note": "Même référence DNA R-DA5E23-01 et cross-référence 320301-R100-000 ; prix observé 87,84 €."
    },
    {
      "label": "Dafy Moto · NGK CPR8EA-9",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://www.dafy-moto.com/bougie-cpr8ea-9-ngk.html",
      "note": "Bougie NGK CPR8EA-9 observée à 15,27 € l’unité."
    },
    {
      "label": "Norauto · NGK CPR8EA-9",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://www.norauto.fr/p/1-bougie-d-allumage-ngk-cpr8ea-9-751810.html",
      "note": "Bougie NGK CPR8EA-9 observée à 13,99 € l’unité."
    },
    {
      "label": "Dafy Moto · liquides de refroidissement",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://www.dafy-moto.com/entretien-outillage/huile-lubrifiant/liquide-de-refroidissement.html",
      "note": "Ipone Radiator Liquid observé à 12,51 €/L et Motul Motocool Expert à 14,36 €/L."
    },
    {
      "label": "Idealo · Pirelli Scorpion Rally STR",
      "type": "observed",
      "market": "France",
      "model_year": "26/09/2026",
      "url": "https://www.idealo.fr/liste/123353171/pneu-pirelli-scorpion-rally-str.html",
      "note": "Prix observés à partir de 108,12 € en 110/80 R19 et 124,99 € en 150/70 R17."
    },
    {
      "label": "MotorcycleTires EU · train Pirelli Scorpion Rally STR",
      "type": "observed",
      "market": "Europe",
      "model_year": "26/09/2026",
      "url": "https://www.motorcycletires-eu.com/en/pirelli-scorpion-rally-str/30221.htm",
      "note": "Train 110/80 R19 + 150/70 R17 observé à 285,75 €."
    }
  ]
  },
  "equivalents_v2": [
    {
      "id": "voge-ds625x-2025-plus",
      "name": "VOGE DS625X",
      "reason": "Trail bicylindre A2/A de cylindrée et prix proches."
    },
    {
      "name": "CFMOTO 700MT ADV",
      "reason": "Trail bicylindre A2/A de gamme voisine."
    }
  ]
};

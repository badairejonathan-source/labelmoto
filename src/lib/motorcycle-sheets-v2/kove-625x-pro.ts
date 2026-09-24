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
  "conclusion": "Candidat basé sur le manuel constructeur KY600GY et les données France 2026 : vidange tous les 5 000 km après la première révision, contrôles principaux tous les 10 000 km et soupapes à 20 000 / 40 000 km."
};

export const kove625xProV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide KOVE 625X Pro : révision initiale 1 000 km, vidange tous les 5 000 km, contrôles principaux tous les 10 000 km, CPR8EA-9 et jeux aux soupapes chiffrés.",
  "quick_facts": [
    {
      "label": "PUISSANCE FRANCE",
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
      "value": "221 kg ordre de marche"
    },
    {
      "label": "RÉSERVOIR",
      "value": "21 L"
    }
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
      "price_estimate": "≈149–239 €",
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
      "price_estimate": "≈149–239 €",
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
      "price_estimate": "≈149–239 €",
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
      "price_estimate": "≈149–239 €",
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
      "price_estimate": "≈169–239 € + opérations additionnelles",
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
    "market": "France + manuel international/européen",
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

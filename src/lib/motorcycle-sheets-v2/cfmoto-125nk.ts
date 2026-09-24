import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const cfmoto125nkDisplayData = {
  "modelName": "CFMOTO 125NK",
  "model": "CFMOTO 125NK",
  "year": "2026+",
  "category": "Roadster 125 · A1",
  "introduction": "La CFMOTO 125NK France 2026 développe 14,4 ch (10,6 kW) à 10 500 tr/min et 11 Nm à 8 500 tr/min. Le calendrier France est spécifique aux 125 cc : contrôle à 500 km, révision à 1 500 km puis tous les 5 000 km ou 1 an. Le manuel 125NK confirme ces deux étapes de rodage et documente ensuite l’huile 10W-40 JASO MA2, 1,1 L avec filtre, le filtre à air à 10 000 km, la bougie PMR9B et le contrôle des soupapes à 20 000 km.",
  "engine": {
    "type": "Monocylindre 4T · liquide · DOHC · 4 soupapes",
    "displacement": "124 cm³",
    "power": "14,4 ch (10,6 kW) à 10 500 tr/min",
    "torque": "11 Nm à 8 500 tr/min",
    "bridage": "A1 natif · permis B + formation 7 h sous conditions",
    "alimentation": "Injection électronique · accélérateur mécanique",
    "compression": "12:1",
    "boreStroke": "58 × 47 mm",
    "battery": "12 V / 7 Ah"
  },
  "cycleParts": {
    "frontTire": "110/70 R17",
    "rearTire": "140/60 R17",
    "frontBrake": "Simple disque Ø242 mm · étrier 4 pistons · ABS (France 2026)",
    "rearBrake": "Simple disque Ø220 mm · 1 piston · ABS",
    "frontSuspension": "Fourche inversée Ø37 mm réglable · France 2026 · débattement 119 mm sur fiche technique Europe",
    "rearSuspension": "Amortisseur central · mono-amortisseur réglable sur fiche technique Europe"
  },
  "dimensions": {
    "wetWeight": "142 kg",
    "seatHeight": "780 mm",
    "tank": "12,5 L"
  },
  "faq": [
    {
      "question": "Quand faire les premières révisions de la CFMOTO 125NK ?",
      "answer": "CFMOTO France indique un contrôle à 500 km, une révision à 1 500 km, puis tous les 5 000 km ou 1 an. Le manuel 125NK confirme deux étapes de rodage à 500 et 1 500 km."
    },
    {
      "question": "Quelle huile moteur utiliser ?",
      "answer": "Le manuel 125NK recommande SAE 10W-40, API SF ou supérieure et JASO MA2."
    },
    {
      "question": "Quelle quantité d’huile faut-il ?",
      "answer": "1,1 L lors d’un remplacement d’huile avec filtre."
    },
    {
      "question": "Quand remplacer le filtre à air ?",
      "answer": "La table d’entretien 125NK prévoit une inspection régulière et un remplacement à 10 000 km. En usage poussiéreux, l’entretien doit être rapproché."
    },
    {
      "question": "Quelle bougie utilise la 125NK ?",
      "answer": "NGK PMR9B, écartement 0,6–0,7 mm et couple de serrage 12–14 Nm. La table prévoit son remplacement à 20 000 km."
    },
    {
      "question": "Quand contrôler le jeu aux soupapes ?",
      "answer": "La table d’entretien prévoit un contrôle tous les 20 000 km. Les valeurs de jeu ne sont pas données dans le manuel utilisateur consulté : elles restent à vérifier dans la documentation atelier du VIN."
    },
    {
      "question": "Quand remplacer le liquide de refroidissement ?",
      "answer": "Tous les 2 ans. La capacité documentée est 900 mL dans le circuit plus 140 mL dans le vase."
    },
    {
      "question": "Quand remplacer le liquide de frein ?",
      "answer": "Tous les 2 ans. Le manuel indique DOT 3 ou DOT 4 selon le marquage du réservoir."
    },
    {
      "question": "Quelle fourche équipe la 125NK ?",
      "answer": "CFMOTO France indique une fourche inversée Ø37 mm réglable. La fiche technique européenne CFMOTO documente 119 mm de débattement avant et un mono-amortisseur arrière réglable. Les réglages exacts restent à lire dans le manuel correspondant au marché/VIN."
    },
    {
      "question": "Quelle tension de chaîne respecter ?",
      "answer": "Le manuel donne 20–30 mm. Il demande également un contrôle et une lubrification tous les 1 000 km, avec écrou d’axe arrière à 105–110 Nm."
    },
    {
      "question": "Quelle garantie pour la CFMOTO 125NK en France ?",
      "answer": "CFMOTO France affiche 2 ans pièces et main-d’œuvre dans le réseau pour la 125NK. Le contrat remis avec la moto reste la référence."
    },
    {
      "question": "Pourquoi certaines anciennes fiches indiquent-elles un disque avant de 292 mm ?",
      "answer": "Des documents Europe et de lancement 2025 indiquent 292 mm, mais les pages CFMOTO France actuellement dédiées au modèle 2026 affichent 242 mm avec étrier 4 pistons. Pour cette fiche 2026+, LabelMoto retient la spécification France actuelle et signale l’écart documentaire."
    }
  ],
  "longevityTips": [
    "Respecter les deux étapes de rodage à 500 puis 1 500 km.",
    "Après rodage, ne pas dépasser 5 000 km ou 1 an entre les entretiens France.",
    "Remplacer le filtre à air à 10 000 km, plus tôt en environnement poussiéreux.",
    "Prévoir bougie et contrôle des soupapes à 20 000 km.",
    "Maintenir la chaîne à 20–30 mm et la contrôler/lubrifier tous les 1 000 km."
  ],
  "conclusion": "La 125NK demande surtout de respecter ses deux premières échéances rapprochées, puis un cycle simple de 5 000 km / 1 an. Le manuel spécifique au modèle permet maintenant de lever l’ancien doute France/Europe sur le rodage. La principale divergence documentaire restante concerne le diamètre du disque avant : 242 mm sur les pages France 2026 contre 292 mm sur certains documents antérieurs."
};

export const cfmoto125nkV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto CFMOTO 125NK 2026+ : 500 / 1 500 km, puis 5 000 km / 1 an · 1,1 L · PMR9B · soupapes 20k.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "14,4 ch"
    },
    {
      "label": "COUPLE",
      "value": "11 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "124 cm³"
    },
    {
      "label": "SELLE",
      "value": "780 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "12,5 L"
    },
    {
      "label": "PERMIS",
      "value": "A1"
    }
  ],
  "quick_maintenance": [
    {
      "label": "Contrôle initial",
      "value": "500 km",
      "confidence": "official_fr"
    },
    {
      "label": "1ère révision",
      "value": "1 500 km",
      "confidence": "official_fr"
    },
    {
      "label": "Révisions",
      "value": "5 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "10W-40 JASO MA2 · 1,1 L avec filtre",
      "confidence": "official_eu"
    },
    {
      "label": "Filtre air",
      "value": "10 000 km",
      "confidence": "official_eu"
    },
    {
      "label": "Bougie / soupapes",
      "value": "20 000 km",
      "confidence": "official_eu"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 500,
      "title": "Première étape de rodage",
      "price_estimate": "≈120–170 € · estimation LabelMoto",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles généraux, niveaux, freins, chaîne et serrages",
          "source_type": "official_eu"
        }
      ],
      "note": "Fourchette LabelMoto appuyée sur les tarifs atelier officiels CFMOTO Lituanie (≈123–133 € TTC pour un entretien standard) ; elle n’est pas un tarif national CFMOTO France."
    },
    {
      "km": 1500,
      "title": "Deuxième étape de rodage",
      "price_estimate": "≈120–170 € · estimation LabelMoto",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles de rodage selon carnet du VIN",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 5000,
      "months": 12,
      "title": "Entretien périodique",
      "price_estimate": "≈120–170 € · estimation LabelMoto",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : inspection",
          "source_type": "official_eu"
        },
        {
          "label": "Freins, pneus, chaîne, accélérateur : contrôles",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 10000,
      "title": "Entretien renforcé",
      "price_estimate": "≈140–210 € · estimation LabelMoto",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle périodique huile / filtre et contrôles",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre carburant : remplacement",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 15000,
      "title": "Entretien périodique",
      "price_estimate": "≈120–170 € · estimation LabelMoto",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre et contrôles du cycle 5 000 km",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 20000,
      "months": 24,
      "title": "Grande révision",
      "price_estimate": "≈220–330 € · estimation LabelMoto",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle 10 000 km : huile, filtres et contrôles",
          "source_type": "official_eu"
        },
        {
          "label": "Bougie NGK PMR9B : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Jeu aux soupapes : contrôle",
          "source_type": "official_eu"
        },
        {
          "label": "Liquides frein/refroidissement selon échéance 24 mois",
          "source_type": "official_eu"
        }
      ],
      "note": "La fourchette augmente pour intégrer le contrôle des soupapes et les opérations dues au cycle 20 000 km ; un réglage éventuel peut augmenter la facture."
    },
    {
      "km": 25000,
      "title": "Entretien périodique",
      "price_estimate": "≈120–170 € · estimation LabelMoto",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre et contrôles du cycle 5 000 km",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 30000,
      "title": "Entretien renforcé",
      "price_estimate": "≈140–210 € · estimation LabelMoto",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : cycle 10 000 km",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles généraux et transmission",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 40000,
      "title": "Révision majeure",
      "operations": [
        {
          "label": "Répéter le cycle 20 000 km",
          "source_type": "official_eu"
        },
        {
          "label": "Bougie et soupapes",
          "source_type": "official_eu"
        },
        {
          "label": "Liquides selon échéance temporelle",
          "source_type": "official_eu"
        }
      ]
    }
  ],
  "budget": {
    "title": "Repères de coût d’entretien",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈1 100–1 600 €",
      "cost_per_km": "≈0,037–0,053 €/km",
      "interval_rule": "500 km, 1 500 km puis tous les 5 000 km / 1 an",
      "note": "Calcul LabelMoto basé sur les huit échéances programmées jusqu’à 30 000 km. Les fourchettes atelier s’appuient sur des tarifs officiels CFMOTO européens (Lituanie : 123–133 € TTC pour un service standard selon millésime) et sur des prix de pièces observés en France. Elles ne constituent pas un tarif national CFMOTO France. Pneus, kit chaîne, plaquettes, batterie et usure imprévisible sont exclus du total principal."
    },
    "cards": [
      {
        "label": "Service standard",
        "value": "≈120–170 €",
        "note": "Repère LabelMoto pour rodage et cycle 5 000 km ; le tableau CFMOTO Lituanie fournit un point d’ancrage officiel de 123–133 € TTC."
      },
      {
        "label": "Révision 20 000 km",
        "value": "≈220–330 €",
        "note": "Bougie PMR9B, filtre à air, contrôle des soupapes et fluides selon âge."
      },
      {
        "label": "Kit vidange France",
        "value": "62,90 € observé",
        "note": "ReviMoto : 2 L d’huile + filtre OEM + joint ; 1,1 L nécessaires avec filtre."
      },
      {
        "label": "Bougie NGK PMR9B",
        "value": "27,90 € observé"
      },
      {
        "label": "Filtre à air OEM",
        "value": "13,18 € observé"
      }
    ],
    "note": "Estimations indicatives et non contractuelles. La main-d’œuvre française peut être supérieure au repère européen ; demander un devis au concessionnaire."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "10W-40 · JASO MA2 · 1,1 L",
      "rows": [
        {
          "label": "Viscosité",
          "value": "SAE 10W-40",
          "confidence": "official_eu"
        },
        {
          "label": "Norme",
          "value": "API SF ou supérieure · JASO MA2",
          "confidence": "official_eu"
        },
        {
          "label": "Quantité avec filtre",
          "value": "1,1 L",
          "confidence": "official_eu"
        },
        {
          "label": "Bouchon de vidange",
          "value": "24–26 Nm",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Inspection 5 000 · remplacement 10 000 km",
      "rows": [
        {
          "label": "Inspection",
          "value": "À chaque cycle 5 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "10 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Usage poussiéreux",
          "value": "Entretien plus fréquent",
          "confidence": "official_eu"
        },
        {
          "label": "Référence OEM",
          "value": "0UIV-110000-1000-25",
          "confidence": "observed"
        }
      ]
    },
    {
      "id": "bougie",
      "title": "Bougie",
      "summary": "NGK PMR9B · remplacement 20 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "NGK PMR9B",
          "confidence": "official_eu"
        },
        {
          "label": "Écartement",
          "value": "0,6–0,7 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Couple",
          "value": "12–14 Nm",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "20 000 km",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "Contrôle 20 000 km",
      "rows": [
        {
          "label": "Échéance",
          "value": "20 000 km",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "900 + 140 mL · 24 mois",
      "rows": [
        {
          "label": "Circuit",
          "value": "900 mL",
          "confidence": "official_eu"
        },
        {
          "label": "Vase",
          "value": "140 mL",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "24 mois",
          "confidence": "official_eu"
        },
        {
          "label": "Type",
          "value": "Liquide organique recommandé CFMOTO",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide",
      "summary": "France 2026 : 242 / 220 mm · liquide 24 mois",
      "rows": [
        {
          "label": "Avant France 2026",
          "value": "Simple disque Ø242 mm · étrier 4 pistons",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "Simple disque Ø220 mm · 1 piston",
          "confidence": "official_fr"
        },
        {
          "label": "Liquide",
          "value": "DOT 3 ou DOT 4 selon marquage réservoir",
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
      "id": "suspensions",
      "title": "Suspensions / fourche",
      "summary": "Fourche inversée Ø37 mm · débattement EU 119 mm · mono-amortisseur arrière",
      "rows": [
        {
          "label": "Fourche avant France",
          "value": "Fourche inversée Ø37 mm réglable",
          "confidence": "official_fr"
        },
        {
          "label": "Débattement avant Europe",
          "value": "119 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Amortisseur arrière",
          "value": "Mono-amortisseur réglable sur fiche technique Europe · amortisseur central sur fiche France",
          "confidence": "multiple_sources"
        },
        {
          "label": "Contrôle",
          "value": "Rechercher fuite, jeu ou fonctionnement anormal à chaque entretien périodique",
          "confidence": "official_eu"
        }
      ],
      "note": "CFMOTO France confirme le diamètre et le caractère réglable de la fourche ; le manuel du VIN reste prioritaire pour le réglage exact."
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "110/70 R17 · 140/60 R17",
      "rows": [
        {
          "label": "Avant",
          "value": "110/70 R17",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "140/60 R17",
          "confidence": "official_fr"
        },
        {
          "label": "Pression repère EU",
          "value": "2,25 bar avant / arrière",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "20–30 mm · contrôle/lubrification 1 000 km",
      "rows": [
        {
          "label": "Flèche",
          "value": "20–30 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Contrôle / lubrification",
          "value": "Tous les 1 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Axe arrière",
          "value": "105–110 Nm",
          "confidence": "official_eu"
        },
        {
          "label": "Limite 20 maillons",
          "value": "256,5 mm sous charge de 10 kg",
          "confidence": "official_eu"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-40 · API SF+ · JASO MA2",
      "replacement_interval": "Cycle France 5 000 km / 1 an après rodage · 1,1 L avec filtre",
      "observed_price": "≈25 €/L observé",
      "source_type": "observed"
    },
    {
      "part": "Filtre à air OEM",
      "specification": "CFMOTO 0UIV-110000-1000-25",
      "reference_oem": "0UIV-110000-1000-25",
      "replacement_interval": "10 000 km · plus fréquent en poussière",
      "observed_price": "13,18 €",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes avant OEM",
      "specification": "SH-6KIV-0812A0",
      "reference_oem": "SH-6KIV-0812A0",
      "replacement_interval": "Selon usure",
      "observed_price": "36,62 €",
      "source_type": "observed"
    },
    {
      "part": "Plaquettes arrière OEM",
      "specification": "CFMOTO 125NK · référence exacte à vérifier avant commande",
      "replacement_interval": "Selon usure",
      "observed_price": "30,79 €",
      "source_type": "observed"
    }
  ],
  "known_issues_v2": [
    {
      "title": "Disque avant : divergence documentaire",
      "description": "Les pages CFMOTO France actuellement dédiées à la 125NK 2026 indiquent Ø242 mm et étrier 4 pistons. Plusieurs documents Europe / lancement 2025 indiquent Ø292 mm. Pour la fiche 2026+, LabelMoto retient la donnée France actuelle et conserve cette divergence dans les sources.",
      "type": "manufacturer_monitoring",
      "confidence": "multiple_sources"
    },
    {
      "title": "Rappels officiels Europe",
      "description": "Aucune campagne 125NK n’est listée sur la page officielle CFMOTO Europe consultée. Un contrôle par VIN auprès du réseau reste recommandé.",
      "type": "manufacturer_monitoring",
      "confidence": "official_eu"
    }
  ],
  "warranty": {
    "duration": "2 ans pièces et main-d’œuvre",
    "market": "France",
    "maintenance_requirement": "Entretien selon le programme CFMOTO France et le carnet correspondant au VIN.",
    "claim_requirement": "Le contrat de garantie remis avec la moto et les justificatifs d’entretien prévalent.",
    "source_label": "CFMOTO France · 125NK / garantie moto"
  },
  "equivalents_v2": [
    {
      "name": "Yamaha MT-125",
      "reason": "Roadster 125 premium"
    },
    {
      "name": "Honda CB125R",
      "reason": "Roadster 125 polyvalent"
    }
  ],
  "verdict": {
    "title": "Deux étapes de rodage, puis un cycle simple de 5 000 km",
    "text": "La 125NK demande un suivi rapproché au départ avec 500 puis 1 500 km. Ensuite, le programme France revient sur un rythme de 5 000 km / 1 an. Le manuel spécifique au modèle permet maintenant de verrouiller 1,1 L de 10W-40, le filtre à air à 10 000 km, la PMR9B et les soupapes à 20 000 km.",
    "strengths": [
      "Calendrier France désormais confirmé par le manuel 125NK",
      "Huile 10W-40 et capacité 1,1 L clairement documentées",
      "Filtre à air OEM identifié",
      "Garantie France clairement affichée à 2 ans"
    ],
    "weaknesses": [
      "Premières échéances rapprochées à 500 et 1 500 km",
      "Valeurs exactes du jeu aux soupapes non publiées dans le manuel utilisateur",
      "Diamètre du disque avant contradictoire entre France 2026 et certaines documentations antérieures"
    ]
  },
  "data_quality": {
    "market": "France / Europe",
    "model_year": "2026+",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": true,
    "pricing_type": "mixed",
    "last_verified": "18/09/2026",
    "sources": [
      {
        "label": "CFMOTO Lituanie · tarifs entretien 125NK / 250NK / 300NK",
        "type": "official_eu",
        "market": "Lituanie / Europe",
        "model_year": "2025",
        "url": "https://cfmoto.lt/wp-content/uploads/Tech-prieziuros-intervalai-ir-kainos_125NK-250NK-300NK-2025-09-05.pdf",
        "note": "Repère tarifaire officiel européen : 133 € TTC pour un entretien standard (huile, filtre, consommables, 100 € de main-d’œuvre). Les intervalles lituaniens ne remplacent pas le calendrier France."
      },
      {
        "label": "ReviMoto France · kit vidange 125NK",
        "type": "observed",
        "market": "France",
        "model_year": "2025–2026",
        "url": "https://www.revimoto.fr/products/kit-vidange-entretien-cfmoto-125-nk-2025-2026",
        "note": "62,90 € observés pour 2 L d’huile + filtre OEM + joint ; bougie PMR9B 27,90 €."
      },
      {
        "label": "CFMOTO France · 125NK",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/modeles/125nk/",
        "note": "14,4 ch / 10,6 kW à 10 500 tr/min, 11 Nm, 780 mm, 142 kg, 12,5 L, pneus, freinage France actuel et garantie 2 ans."
      },
      {
        "label": "CFMOTO France · page 125NK roadster",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/roadster/125nk/",
        "note": "Deuxième page officielle France confirmant 14,4 ch et disque avant 242 mm."
      },
      {
        "label": "CFMOTO France · conseils d’entretien",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/conseils-entretien/",
        "note": "125 cc : 500 km, 1 500 km puis tous les 5 000 km ou annuel."
      },
      {
        "label": "CFMOTO Suisse · fiche technique 125NK Euro 5+",
        "type": "official_eu",
        "market": "Suisse / Europe",
        "model_year": "2025–2026",
        "url": "https://www.cfmotoschweiz.ch/wp-content/uploads/2025/06/125NK_EN.pdf",
        "note": "Ø37 mm USD, débattement avant 119 mm, mono-amortisseur réglable, batterie 12 V / 7 Ah, PMR9B, compression 12:1, pneus 110/70 R17 et 140/60 R17, pression 2,25 / 2,25 bar. Cette fiche Europe diffère de la France sur selle/masse/disque avant."
      },
      {
        "label": "CFMOTO · manuel utilisateur 125NK EU",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2025–2026",
        "url": "https://cfmotoitaly.it/wp-content/uploads/CFMOTO-125NK-Owner-manual-IT.pdf",
        "note": "Rodage 500 / 1 500 km, 10W-40, 1,1 L, PMR9B, air 10k, soupapes 20k, fluides 24 mois, chaîne 20–30 mm."
      },
      {
        "label": "CFMOTO Portugal · manuel 125NK",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2025",
        "url": "https://cf-moto.pt/manuais-proprietario/motociclos/OM_125NK%20CF125-11-11H%EF%BC%886KIV-380101-2000-12%20EU249%EF%BC%89OM-20241029.pdf",
        "note": "Confirme 1,1 L d’huile et 900 + 140 mL de liquide de refroidissement."
      },
      {
        "label": "CFMOTO France · garantie moto",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/garantie/",
        "note": "125NK : 2 ans pièces et main-d’œuvre."
      },
      {
        "label": "CFMOTO Europe · rappels",
        "type": "official_eu",
        "market": "Europe",
        "url": "https://cfmoto-motorcycle.eu/en/service/recall",
        "note": "Aucune campagne 125NK listée lors de la vérification."
      },
      {
        "label": "Only-CFMOTO · filtre à air 125NK",
        "type": "observed",
        "market": "France",
        "model_year": "10/09/2026",
        "url": "https://only-cfmoto.com/filtre-a-air/589-filtre-a-air-125-nk-3000136375437.html",
        "note": "OEM 0UIV-110000-1000-25 · 13,18 € observé."
      },
      {
        "label": "Only-CFMOTO · pièces freinage 125NK",
        "type": "observed",
        "market": "France",
        "model_year": "10/09/2026",
        "url": "https://only-cfmoto.com/10-roadsters-nk-cfmoto-accessoires",
        "note": "Prix observés : plaquettes avant 36,62 €, arrière 30,79 €, disque avant 49,01 €, arrière 27,91 €."
      }
    ]
  }
};

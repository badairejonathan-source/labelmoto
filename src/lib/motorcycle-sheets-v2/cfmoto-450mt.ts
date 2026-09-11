import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

/** CFMOTO 450 MT · V2 LabelMoto · audit France/Europe + tarification 07/09/2026. */
export const cfmoto450mtDisplayData = {
  "modelName": "CFMOTO 450 MT",
  "brand": "CFMOTO",
  "year": "2024+",
  "category": "Trail A2",
  "introduction": "CFMOTO 450 MT : trail A2 de 449,5 cm³, 42 ch et 44 Nm. En France, la révision est prévue à 1 000 km puis tous les 5 000 km ou 1 an. Huile 10W-40 JASO MA2 (2,5 L avec filtre), filtre à air et bougies à 10 000 km selon la documentation européenne, jeu aux soupapes à 40 000 km.",
  "imageUrl": "/images/entretien-cfmoto-450mt.webp",
  "hasVariants": false,
  "variants": [],
  "engine": {
    "bridage": "A2 natif",
    "type": "Bicylindre en ligne 4T, liquide, DOHC, calage 270°",
    "displacement": "449,5 cm³",
    "power": "42 ch (31 kW) à 8 500 tr/min",
    "torque": "44 Nm à 6 250 tr/min",
    "alimentation": "Injection électronique"
  },
  "cycleParts": {
    "frame": "Cadre tubulaire acier haute résistance",
    "frontBrake": "Simple disque Ø320 mm",
    "rearBrake": "Simple disque Ø240 mm",
    "frontSuspension": "Fourche KYB Ø 41 mm réglable compression / détente · débattement 200 mm",
    "rearSuspension": "Amortisseur KYB réglable précharge / détente · débattement 200 mm",
    "frontTire": "90/90 R21",
    "rearTire": "140/70 R18 (140/80 R18 également homologué)"
  },
  "dimensions": {
    "wetWeight": "175 kg",
    "seatHeight": "820 mm",
    "tank": "17,5 L"
  },
  "serviceSchedule": [],
  "consumables": [],
  "maintenanceCost": null,
  "knownIssues": [],
  "longevityTips": [
    "Respecter l’échéance France de 5 000 km / 1 an.",
    "Contrôler et lubrifier la chaîne régulièrement, plus souvent après pluie, lavage ou tout-terrain.",
    "Rapprocher l’entretien du filtre à air en environnement poussiéreux.",
    "Conserver les factures et les opérations consignées au carnet pour le suivi et la garantie."
  ],
  "conclusion": "La 450MT partage une base moteur bien documentée avec la famille 450, mais son usage trail impose une vigilance particulière sur la chaîne, le filtre à air et les pneus. Les coûts ci-dessous distinguent les prix de pièces observés des estimations d’atelier LabelMoto.",
  "faq": [
    {
      "question": "Quand réviser la CFMOTO 450 MT ?",
      "answer": "En France : première révision à 1 000 km, puis tous les 5 000 km ou tous les ans."
    },
    {
      "question": "Quelle huile moteur utiliser sur la CFMOTO 450 MT ?",
      "answer": "SAE 10W-40, API SJ ou supérieur, avec JASO MA2 privilégiée. La capacité annoncée avec remplacement du filtre est de 2,5 L."
    },
    {
      "question": "Quand remplacer le filtre à air et les bougies ?",
      "answer": "La documentation européenne utilisée par LabelMoto retient un remplacement à 10 000 km, à rapprocher en usage poussiéreux ou tout-terrain."
    },
    {
      "question": "Quel est le type de bougie ?",
      "answer": "Deux bougies BN8RTI sont indiquées par la documentation et le catalogue de pièces de la famille 450MT."
    },
    {
      "question": "Quand contrôler le jeu aux soupapes ?",
      "answer": "À 40 000 km selon la table européenne retenue. Les jeux documentés sont 0,10–0,15 mm à l’admission et 0,25–0,31 mm à l’échappement."
    },
    {
      "question": "Quelle est la capacité de liquide de refroidissement ?",
      "answer": "La documentation technique indique environ 1,3 L dans le circuit et 0,24 L dans le vase, soit environ 1,54 L au total."
    },
    {
      "question": "La CFMOTO 450 MT est-elle compatible permis A2 ?",
      "answer": "Oui. La 450MT est proposée en France comme modèle A2, avec 42 ch."
    },
    {
      "question": "Quel est le poids de la CFMOTO 450 MT ?",
      "answer": "CFMOTO France annonce actuellement 175 kg pour la 450MT."
    },
    {
      "question": "Quelle est la garantie de la CFMOTO 450 MT en France ?",
      "answer": "CFMOTO France affiche 2 ans pièces et main-d’œuvre pour la 450MT 2026. Les mentions légales de la page comportent toutefois une formulation différente sur la main-d’œuvre : le contrat et le carnet remis avec la moto doivent donc rester la référence."
    },
    {
      "question": "Combien coûte une révision de CFMOTO 450 MT ?",
      "answer": "LabelMoto retient environ 130–210 € pour une révision périodique simple, 220–360 € lorsque filtre à air et bougies sont ajoutés, et environ 450–750 € pour la grosse échéance avec contrôle des soupapes. Ce sont des fourchettes atelier indicatives, pas un tarif national CFMOTO."
    }
  ],
  "model": "CFMOTO 450 MT"
};

export const cfmoto450mtV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto CFMOTO 450 MT : révisions tous les 5 000 km, 2,5 L de 10W-40, deux BN8RTI, soupapes à 40 000 km et coûts d’entretien chiffrés.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "42 ch"
    },
    {
      "label": "COUPLE",
      "value": "44 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "449,5 cm³"
    },
    {
      "label": "SELLE",
      "value": "820 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "17,5 L"
    },
    {
      "label": "PERMIS",
      "value": "A2"
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
      "value": "5 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "10W-40 · API SJ+ · JASO MA2",
      "confidence": "official_eu"
    },
    {
      "label": "Quantité",
      "value": "2,5 L avec filtre",
      "confidence": "official_eu"
    },
    {
      "label": "Bougies",
      "value": "2 × BN8RTI",
      "confidence": "technical_documentation"
    },
    {
      "label": "Soupapes",
      "value": "40 000 km",
      "confidence": "official_eu"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Rodage",
      "price_estimate": "≈130–200 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles généraux et serrages",
          "source_type": "official_eu"
        },
        {
          "label": "Chaîne / freins / pneus",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 5000,
      "title": "Périodique",
      "price_estimate": "≈130–210 €",
      "price_type": "estimate",
      "months": 12,
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle filtre à air",
          "source_type": "official_eu"
        },
        {
          "label": "Freins / pneus / chaîne / niveaux",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 10000,
      "title": "Renforcé",
      "price_estimate": "≈220–360 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air",
          "source_type": "official_eu"
        },
        {
          "label": "2 bougies",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôles généraux",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 15000,
      "title": "Périodique",
      "price_estimate": "≈130–210 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Freins / pneus / chaîne / niveaux",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 20000,
      "title": "Renforcé",
      "price_estimate": "≈220–360 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air",
          "source_type": "official_eu"
        },
        {
          "label": "2 bougies",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôles généraux",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 25000,
      "title": "Périodique",
      "price_estimate": "≈130–210 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Freins / pneus / chaîne / niveaux",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 30000,
      "title": "Renforcé",
      "price_estimate": "≈220–360 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air",
          "source_type": "official_eu"
        },
        {
          "label": "2 bougies",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôles généraux",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 35000,
      "title": "Périodique",
      "price_estimate": "≈130–210 € · liquide si échéance temps",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Freins / pneus / chaîne / niveaux",
          "source_type": "official_eu"
        },
        {
          "label": "Liquide de refroidissement si échéance 2 ans",
          "source_type": "official_eu"
        }
      ],
      "note": "Le liquide de refroidissement est une échéance temporelle ; son remplacement ne dépend pas strictement du kilométrage."
    },
    {
      "km": 40000,
      "title": "Majeure",
      "price_estimate": "≈450–750 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air",
          "source_type": "official_eu"
        },
        {
          "label": "2 bougies",
          "source_type": "technical_documentation"
        },
        {
          "label": "Contrôle / réglage du jeu aux soupapes",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles généraux",
          "source_type": "official_eu"
        }
      ]
    }
  ],
  "budget": {
    "title": "Repères de coût d’entretien",
    "cards": [
      {
        "label": "Révision simple",
        "value": "≈130–210 €"
      },
      {
        "label": "Révision 10 000 km",
        "value": "≈220–360 €"
      },
      {
        "label": "Révision 40 000 km",
        "value": "≈450–750 €"
      },
      {
        "label": "Kit chaîne monté",
        "value": "≈195–225 €"
      },
      {
        "label": "Train pneus monté",
        "value": "≈240–320 €"
      },
      {
        "label": "Batterie",
        "value": "≈85–140 €"
      }
    ],
    "note": "Fourchettes LabelMoto construites à partir des pièces observées en France/Europe et de tarifs publics d’ateliers français. Elles ne constituent pas un tarif national CFMOTO."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "10W-40 · JASO MA2 · 2,5 L avec filtre",
      "rows": [
        {
          "label": "Viscosité",
          "value": "10W-40",
          "confidence": "official_eu"
        },
        {
          "label": "Norme",
          "value": "API SJ ou supérieur · JASO MA2 privilégiée",
          "confidence": "official_eu"
        },
        {
          "label": "Quantité",
          "value": "2,5 L avec filtre",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "1 000 km puis 5 000 km / 1 an",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "filtre-air",
      "title": "Filtre à air",
      "summary": "Surveillance renforcée en usage poussiéreux",
      "rows": [
        {
          "label": "Référence OEM",
          "value": "0SQV-112000-1000",
          "confidence": "multiple_sources"
        },
        {
          "label": "Contrôle / nettoyage",
          "value": "Selon tableau constructeur, plus fréquent en usage sévère",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement périodique",
          "value": "20 000 km / 24 mois selon manuel EU 2024",
          "confidence": "official_eu"
        }
      ],
      "note": "Un trail utilisé régulièrement sur piste ou en environnement poussiéreux doit faire l'objet d'une surveillance du filtre plus fréquente que le calendrier normal."
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "TORCH BN8RTI · 2 bougies",
      "rows": [
        {
          "label": "Référence",
          "value": "BN8RTI",
          "confidence": "official_eu"
        },
        {
          "label": "Quantité",
          "value": "2",
          "confidence": "technical_documentation"
        },
        {
          "label": "Écartement",
          "value": "0,8 à 1,0 mm",
          "confidence": "official_other_market"
        },
        {
          "label": "Couple de serrage",
          "value": "12 à 15 Nm",
          "confidence": "official_other_market"
        },
        {
          "label": "Remplacement",
          "value": "10 000 km selon le plan EU vérifié",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "40 000 km · 0,10–0,15 / 0,25–0,31 mm",
      "rows": [
        {
          "label": "Échéance",
          "value": "40 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Admission",
          "value": "0,10–0,15 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Échappement",
          "value": "0,25–0,31 mm",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Antigel longue durée · environ 1,54 L · 2 ans",
      "rows": [
        {
          "label": "Remplacement",
          "value": "2 ans",
          "confidence": "official_eu"
        },
        {
          "label": "Circuit",
          "value": "≈1,30 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Vase d’expansion",
          "value": "≈0,24 L",
          "confidence": "technical_documentation"
        },
        {
          "label": "Total indicatif",
          "value": "≈1,54 L",
          "confidence": "technical_documentation"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide de frein",
      "summary": "DOT 4 · 2 ans · Ø320 / Ø240 mm",
      "rows": [
        {
          "label": "Liquide",
          "value": "DOT 4",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "2 ans",
          "confidence": "official_eu"
        },
        {
          "label": "Avant",
          "value": "Simple disque Ø320 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "Simple disque Ø240 mm",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "pneus",
      "title": "Pneus & roues",
      "summary": "90/90 R21 · 140/70 R18",
      "rows": [
        {
          "label": "Avant",
          "value": "90/90 R21",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "140/70 R18",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière également homologué",
          "value": "140/80 R18",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Jeu 30–40 mm · surveillance régulière",
      "rows": [
        {
          "label": "Jeu de chaîne",
          "value": "30 à 40 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Contrôle de tension",
          "value": "Tous les 1 000 km et dans plusieurs positions de roue",
          "confidence": "official_eu"
        },
        {
          "label": "Lubrification",
          "value": "Environ tous les 600 km et immédiatement après roulage sous la pluie",
          "confidence": "official_eu"
        },
        {
          "label": "Méthode",
          "value": "Moto au point mort, sur béquille latérale",
          "confidence": "official_eu"
        },
        {
          "label": "Écrou axe arrière",
          "value": "105 à 110 Nm",
          "confidence": "technical_documentation"
        },
        {
          "label": "Contrôle d’usure",
          "value": "Mesure sur 20 maillons avec charge de 10 kg",
          "confidence": "official_eu"
        },
        {
          "label": "Limite d’allongement",
          "value": "320,7 mm sur 20 maillons",
          "confidence": "official_eu"
        }
      ],
      "note": "Après pluie, boue, poussière ou franchissement, contrôler plus fréquemment l'état, la tension et la lubrification de la transmission."
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "Inspection 5 000 · remplacement 10 000 km",
      "rows": [
        {
          "label": "Inspection",
          "value": "5 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "10 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Usage poussiéreux / off-road",
          "value": "Rapprocher les contrôles",
          "confidence": "official_eu"
        },
        {
          "label": "Référence observée",
          "value": "0SQV-112000-1000",
          "confidence": "observed"
        }
      ]
    },
    {
      "id": "bougie",
      "title": "Bougies",
      "summary": "2 × BN8RTI · 10 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "BN8RTI",
          "confidence": "official_eu"
        },
        {
          "label": "Quantité",
          "value": "2",
          "confidence": "technical_documentation"
        },
        {
          "label": "Écartement",
          "value": "0,8–1,0 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Couple de serrage",
          "value": "12–15 Nm",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "10 000 km",
          "confidence": "official_eu"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "10W-40 · API SJ+ · JASO MA2",
      "replacement_interval": "5 000 km / 1 an",
      "observed_price": "≈30–40 € les 2,5 L",
      "source_type": "observed",
      "note": "Repère marché français pour une huile moto 10W-40 JASO MA2 ; le prix dépend du conditionnement et de la marque."
    },
    {
      "part": "Filtre huile",
      "specification": "OEM CFMOTO 0HTV-070200-7000-10",
      "replacement_interval": "Avec la vidange",
      "observed_price": "≈9–10 €",
      "source_type": "observed"
    },
    {
      "part": "Filtre air",
      "specification": "OEM CFMOTO 0SQV-112000-1000",
      "replacement_interval": "10 000 km · plus fréquent en poussière",
      "observed_price": "≈13 €",
      "source_type": "observed"
    },
    {
      "part": "Bougies",
      "specification": "2 × BN8RTI",
      "replacement_interval": "10 000 km",
      "observed_price": "≈35–45 € les 2",
      "source_type": "observed",
      "note": "Fourchette de marché basée sur kits / références compatibles observés ; vérifier la référence exacte au VIN avant achat."
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Antigel moto longue durée · env. 1,54 L",
      "replacement_interval": "2 ans",
      "observed_price": "≈14–26 € les 2 L",
      "source_type": "observed"
    },
    {
      "part": "Frein - liquide DOT 4",
      "specification": "DOT 4",
      "replacement_interval": "2 ans",
      "observed_price": "≈8–15 € le flacon",
      "source_type": "observed"
    },
    {
      "part": "Frein - purge ABS",
      "specification": "Purge circuit avant + arrière avec ABS",
      "replacement_interval": "Selon échéance liquide / intervention",
      "observed_price": "≈55–90 € en atelier",
      "source_type": "observed"
    },
    {
      "part": "Frein - plaquettes route",
      "specification": "Brembo compatibles 450MT",
      "replacement_interval": "Selon usure",
      "observed_price": "≈31–36 € le jeu · ≈67 € AV+AR",
      "source_type": "observed"
    },
    {
      "part": "Pneus trail 21/18",
      "specification": "90/90 R21 · 140/70 R18 (ou 140/80 R18 homologué)",
      "replacement_interval": "Selon gomme et usage",
      "observed_price": "≈200–280 € le train · ≈240–320 € monté",
      "source_type": "observed",
      "note": "Repère de marché pour pneus trail homologués ; prix très variable selon profil route/off-road."
    },
    {
      "part": "Chaîne - kit complet",
      "specification": "Kit chaîne 520 compatible 450MT",
      "replacement_interval": "Selon usure / entretien",
      "observed_price": "≈135–165 € le kit · ≈195–225 € monté",
      "source_type": "observed"
    },
    {
      "part": "Batterie",
      "specification": "Format YTZ14S / équivalent compatible",
      "replacement_interval": "Selon état · souvent 3–5 ans",
      "observed_price": "≈85–140 € AGM/SLA",
      "source_type": "observed"
    }
  ],
  "known_issues_v2": [
    {
      "title": "Entretien relativement rapproché",
      "description": "CFMOTO France prévoit une échéance tous les 5 000 km ou annuelle après la révision des 1 000 km. Ce rythme doit être intégré au coût d'utilisation, notamment pour les gros rouleurs.",
      "type": "usage_limitation",
      "confidence": "official_fr",
      "source_note": "CFMOTO France · conseils d’entretien 2026"
    },
    {
      "title": "Surveillance accrue en usage tout-terrain",
      "description": "La chaîne, le filtre à air, les pneus et les organes de partie-cycle nécessitent une surveillance plus fréquente lorsque la moto roule régulièrement dans la poussière, la boue ou sous la pluie.",
      "type": "manufacturer_monitoring",
      "confidence": "official_eu",
      "source_note": "Manuel utilisateur européen 450MT"
    },
    {
      "title": "Recul long terme encore plus récent que les références historiques du segment",
      "description": "La 450MT est commercialisée depuis 2024. Des exemplaires à très fort kilométrage sont déjà documentés, mais cela ne suffit pas à transformer un cas individuel en statistique générale de fiabilité. LabelMoto séparera donc les retours propriétaires des défauts officiellement documentés.",
      "type": "usage_limitation",
      "confidence": "multiple_sources"
    }
  ],
  "warranty": {
    "duration": "2 ans pièces et main-d’œuvre affichés pour la 450MT en France",
    "market": "France",
    "maintenance_requirement": "Respecter le plan d’entretien applicable et faire consigner les interventions dans le carnet. CFMOTO France conditionne la garantie commerciale au suivi dans son réseau.",
    "claim_requirement": "La page France affiche 2 ans pièces et main-d’œuvre pour la 450MT, mais ses mentions légales comportent aussi une formulation indiquant la prise en charge de la main-d’œuvre durant la première année uniquement. Le contrat et le carnet remis avec la moto prévalent.",
    "source_label": "CFMOTO France · garantie 2026"
  },
  "equivalents_v2": [
    {
      "name": "Honda NX500",
      "reason": "Trail A2 routier polyvalent"
    },
    {
      "name": "Royal Enfield Himalayan 450",
      "reason": "Trail A2 léger orienté voyage"
    },
    {
      "name": "KTM 390 Adventure",
      "reason": "Trail A2 léger et dynamique"
    }
  ],
  "verdict": {
    "title": "Un trail A2 dont le coût d’entretien reste lisible",
    "text": "La 450MT profite d’une base moteur bien documentée : 5 000 km / 1 an en France, 2,5 L d’huile, filtre à air et bougies à 10 000 km, soupapes à 40 000 km. Les consommables trail (pneus 21/18, chaîne et usage poussiéreux) peuvent en revanche faire varier nettement le budget réel.",
    "strengths": [
      "Mécanique de la famille 450 bien documentée",
      "Jeu aux soupapes seulement à 40 000 km",
      "Pièces d’entretien courantes disponibles et tarifées"
    ],
    "weaknesses": [
      "Révision tous les 5 000 km en France",
      "Pneus et transmission sensibles au type d’usage"
    ]
  },
  "data_quality": {
    "market": "France / Europe",
    "model_year": "2024–2026",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": false,
    "pricing_type": "mixed",
    "last_verified": "07/09/2026",
    "sources": [
      {
        "label": "CFMOTO France · 450MT",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/modeles/450mt/",
        "note": "449,5 cm³, 42 ch, 44 Nm, 175 kg, selle 820 mm, réservoir 17,5 L, freins Ø320/240 et pneus homologués."
      },
      {
        "label": "CFMOTO France · conseils d’entretien",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/conseils-entretien/",
        "note": "Gamme 450 : 1 000 km puis tous les 5 000 km ou annuellement."
      },
      {
        "label": "CFMOTO France · garantie",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/garantie/",
        "note": "450MT : 2 ans affichés ; conserver la réserve liée aux mentions légales et au contrat remis au client."
      },
      {
        "label": "CFMOTO 450MT · Owner’s Manual Europe",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2024",
        "url": "https://cfmoto.se/wp-content/uploads/2025/01/450MT-CF400-8-8F6AQV-380101-6201-12-EU23C-OM-20240313.pdf",
        "note": "Huile 10W-40 JASO MA2, 2,5 L avec filtre, BN8RTI, entretien air et soupapes."
      },
      {
        "label": "CFMOTO 450MT · documentation technique / parts",
        "type": "technical_documentation",
        "market": "International",
        "model_year": "2024–2026",
        "note": "Deux bougies BN8RTI et données techniques de refroidissement / soupapes."
      },
      {
        "label": "Only-CFMOTO · pièces 450MT",
        "type": "observed",
        "market": "France",
        "model_year": "07/09/2026",
        "url": "https://only-cfmoto.com/14-accessoires-cfmoto-450-mt",
        "note": "Filtre huile 9,49 €, filtre air 13,18 €, huile 10W-40 observée. Prix variables et non contractuels."
      },
      {
        "label": "3AS Racing · consommables 450MT",
        "type": "observed",
        "market": "France",
        "model_year": "07/09/2026",
        "url": "https://www.3as-racing.com/parts/moto/cfmoto/450-mt-2024.html",
        "note": "Kit chaîne, plaquettes, batteries et autres compatibles observés."
      },
      {
        "label": "Idealo France · repères huile / pneus",
        "type": "observed",
        "market": "France",
        "model_year": "07/09/2026",
        "url": "https://www.idealo.fr/",
        "note": "Repères de marché utilisés uniquement pour construire des fourchettes."
      },
      {
        "label": "Le Thothelier / GMH Performance · tarifs publics atelier",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "note": "Taux horaires et forfaits publics utilisés pour dimensionner les fourchettes LabelMoto."
      }
    ]
  }
};

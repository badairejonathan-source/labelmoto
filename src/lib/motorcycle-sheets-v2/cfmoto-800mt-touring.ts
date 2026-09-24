import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

export const cfmoto800mtTouringDisplayData = {
  "modelName": "CFMOTO 800MT Touring",
  "model": "CFMOTO 800MT Touring",
  "year": "2025+",
  "category": "Trail routier A2 / A",
  "introduction": "La CFMOTO 800MT Touring utilise le bicylindre 799 cm³ de 91 ch (67 kW) et 75 Nm. En France, la gamme 800 suit 1 000 km puis 15 000 km ou 1 an. Le manuel FR 800MT 2024 précise 2,8 L d’huile avec filtre, filtre à air à 15 000 km / 12 mois, bougies LMAR9AI-10 et jeu aux soupapes à 30 000 km, liquide de frein à 24 mois et liquide de refroidissement à 48 mois.",
  "engine": {
    "type": "Bicylindre en ligne 4T, liquide, DOHC",
    "displacement": "799 cm³",
    "power": "91 ch (67 kW) à 9 250 tr/min · A2 35 kW",
    "torque": "75 Nm à 8 000 tr/min",
    "bridage": "A2 35 kW / A 67 kW selon homologation",
    "alimentation": "Injection EFI · accélérateur électronique"
  },
  "cycleParts": {
    "frontTire": "110/80 R19",
    "rearTire": "150/70 R17",
    "frontBrake": "Double disque J.Juan Ø320 mm",
    "rearBrake": "Simple disque J.Juan Ø260 mm"
  },
  "dimensions": {
    "wetWeight": "231 kg",
    "seatHeight": "825 mm · selle haute 855 mm en option",
    "tank": "19 L"
  },
  "faq": [
    {
      "question": "Quel est l’intervalle de révision ?",
      "answer": "CFMOTO France indique 1 000 km puis 15 000, 30 000, 45 000 km, ou une révision annuelle pour la gamme 800 cc."
    },
    {
      "question": "Quelle quantité d’huile moteur faut-il ?",
      "answer": "Le manuel FR 800MT 2024 indique 2,8 L lors d’une vidange avec remplacement du filtre."
    },
    {
      "question": "Quelle huile moteur utiliser ?",
      "answer": "Le manuel recommande SAE 10W-50 dans la plupart des conditions, API SJ ou supérieure et JASO T903 MA2."
    },
    {
      "question": "Quand remplacer le filtre à air ?",
      "answer": "15 000 km ou 12 mois, à la première échéance atteinte. En usage intensif, le manuel demande de réduire les intervalles de 50 %."
    },
    {
      "question": "Quand remplacer les bougies ?",
      "answer": "Les deux bougies NGK LMAR9AI-10 sont à remplacer à 30 000 km."
    },
    {
      "question": "Quand contrôler le jeu aux soupapes ?",
      "answer": "Le contrôle du jeu aux soupapes est prévu à 30 000 km."
    },
    {
      "question": "Quand remplacer le liquide de frein ?",
      "answer": "Le manuel FR indique un remplacement tous les 24 mois."
    },
    {
      "question": "Quand remplacer le liquide de refroidissement ?",
      "answer": "Le manuel FR indique un remplacement tous les 48 mois, avec contrôle intermédiaire."
    },
    {
      "question": "À quelle fréquence contrôler la chaîne ?",
      "answer": "Le manuel indique un contrôle de tension tous les 1 000 km et un contrôle après roulage sous la pluie pour la lubrification."
    },
    {
      "question": "La 800MT Touring bénéficie-t-elle de 5 ans de garantie ?",
      "answer": "CFMOTO France documente une garantie pouvant aller à 5 ans sur les 800MT Touring éligibles. Le contrat et les conditions applicables à la date d’immatriculation restent prioritaires."
    }
  ],
  "longevityTips": [
    "Respecter 1 000 km puis 15 000 km / 1 an, à la première échéance.",
    "Remplacer le filtre à air à 15 000 km / 12 mois, et rapprocher en usage intensif.",
    "Ne pas repousser bougies et contrôle des soupapes au-delà du cycle 30 000 km.",
    "Contrôler la tension de chaîne tous les 1 000 km et après conditions sévères.",
    "Conserver factures et carnet tamponné pour la garantie."
  ],
  "conclusion": "La 800MT Touring profite d’intervalles espacés, mais son filtre à air fait bien partie du cycle 15 000 km / 12 mois. La grande échéance reste 30 000 km avec bougies et contrôle des soupapes, complétée par les échéances temporelles des liquides."
};

export const cfmoto800mtTouringV2: MotorcycleSheetV2 = {
  "layout_version": 2,
  "hero_subtitle": "Guide LabelMoto CFMOTO 800MT Touring : 15 000 km / 1 an · 2,8 L · filtre à air 15k · bougies et soupapes 30k.",
  "quick_facts": [
    {
      "label": "PUISSANCE",
      "value": "91 ch"
    },
    {
      "label": "COUPLE",
      "value": "75 Nm"
    },
    {
      "label": "CYLINDRÉE",
      "value": "799 cm³"
    },
    {
      "label": "SELLE",
      "value": "825 mm"
    },
    {
      "label": "RÉSERVOIR",
      "value": "19 L"
    },
    {
      "label": "PERMIS",
      "value": "A2 / A"
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
      "value": "15 000 km / 1 an",
      "confidence": "official_fr"
    },
    {
      "label": "Huile",
      "value": "10W-50 JASO MA2 · 2,8 L avec filtre",
      "confidence": "official_eu"
    },
    {
      "label": "Filtre air",
      "value": "15 000 km / 12 mois",
      "confidence": "official_eu"
    },
    {
      "label": "Bougies",
      "value": "NGK LMAR9AI-10 · 30 000 km",
      "confidence": "official_eu"
    },
    {
      "label": "Soupapes",
      "value": "30 000 km",
      "confidence": "official_eu"
    }
  ],
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Rodage",
      "price_estimate": "≈150–220 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles de rodage : serrages, niveaux, freins, chaîne, roues",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 15000,
      "months": 12,
      "title": "Périodique",
      "price_estimate": "≈250–350 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Crépine : nettoyage · embrayage / ralenti / gaz : contrôles",
          "source_type": "official_eu"
        },
        {
          "label": "Liquide de refroidissement : contrôle",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 30000,
      "title": "Grande révision",
      "price_estimate": "≈450–600 €",
      "price_type": "estimate",
      "operations": [
        {
          "label": "Cycle 15 000 km : huile, filtre huile, filtre air et contrôles",
          "source_type": "official_eu"
        },
        {
          "label": "2 bougies NGK LMAR9AI-10 : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Jeu aux soupapes : contrôle",
          "source_type": "official_eu"
        },
        {
          "label": "Cadre et éléments à échéance 30 000 km : contrôle",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 45000,
      "title": "Périodique",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles du cycle 15 000 km",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 60000,
      "title": "Majeure",
      "operations": [
        {
          "label": "Répéter le cycle 30 000 km",
          "source_type": "official_eu"
        },
        {
          "label": "Bougies : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Jeu aux soupapes : contrôle",
          "source_type": "official_eu"
        },
        {
          "label": "Liquide de frein 24 mois / refroidissement 48 mois selon échéance",
          "source_type": "official_eu"
        }
      ]
    },
    {
      "km": 75000,
      "title": "Périodique",
      "operations": [
        {
          "label": "Huile moteur + filtre",
          "source_type": "official_eu"
        },
        {
          "label": "Filtre à air : remplacement",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles du cycle 15 000 km",
          "source_type": "official_eu"
        }
      ]
    }
  ],
  "budget": {
    "title": "Repères de coût d'entretien",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "≈850–1 170 €",
      "cost_per_km": "≈0,028–0,039 €/km",
      "interval_rule": "1 000 km puis 15 000 km / 1 an",
      "note": "Calcul LabelMoto basé sur l’addition des fourchettes des révisions programmées jusqu’à 30 000 km. Pneus, kit chaîne, plaquettes, batterie et autres consommables d’usure sont exclus du total principal afin de conserver une comparaison cohérente entre motos."
    },
    "cards": [
      {
        "label": "Chaîne adaptable",
        "value": "≈116,40 €",
        "note": "DID 520VX3 122 maillons observée pour 800MT Touring 2022–2024 ; vérifier millésime."
      },
      {
        "label": "Plaquettes adaptables",
        "value": "≈40,20–62,30 €",
        "note": "Prix observés selon référence et essieu."
      },
      {
        "label": "Bougies NGK x2",
        "value": "≈55,80–93,20 €",
        "note": "Deux LMAR9AI-10, prix observés selon tarif club/public."
      }
    ],
    "note": "Estimations indicatives et non contractuelles. Les tarifs atelier varient selon la région, la main-d’œuvre et les opérations réellement nécessaires."
  },
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "10W-50 · JASO MA2 · 2,8 L",
      "rows": [
        {
          "label": "Quantité avec filtre",
          "value": "2,8 L",
          "confidence": "official_eu"
        },
        {
          "label": "Viscosité recommandée",
          "value": "SAE 10W-50",
          "confidence": "official_eu"
        },
        {
          "label": "Norme",
          "value": "API SJ ou supérieure · JASO T903 MA2",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "15 000 km / 12 mois après la révision des 1 000 km",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "air",
      "title": "Filtre à air",
      "summary": "15 000 km / 12 mois",
      "rows": [
        {
          "label": "Remplacement",
          "value": "15 000 km / 12 mois",
          "confidence": "official_eu"
        },
        {
          "label": "Usage intensif",
          "value": "Réduire l’intervalle de 50 %",
          "confidence": "official_eu"
        },
        {
          "label": "Référence OEM famille 800MT",
          "value": "0PW0-111100",
          "confidence": "multiple_sources"
        }
      ]
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "NGK LMAR9AI-10 · 30 000 km",
      "rows": [
        {
          "label": "Type",
          "value": "NGK LMAR9AI-10 · 2 unités",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "30 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Jeu",
          "value": "0,9–1,0 mm",
          "confidence": "official_eu"
        },
        {
          "label": "Couple de serrage",
          "value": "10 Nm",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "Contrôle 30 000 km",
      "rows": [
        {
          "label": "Échéance",
          "value": "30 000 km",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Contrôle périodique · remplacement 48 mois",
      "rows": [
        {
          "label": "Contrôle",
          "value": "15 000 km / 12 mois selon la table moteur",
          "confidence": "official_eu"
        },
        {
          "label": "Remplacement",
          "value": "48 mois",
          "confidence": "official_eu"
        }
      ]
    },
    {
      "id": "freinage",
      "title": "Freinage & liquide",
      "summary": "J.Juan 320 / 260 mm · liquide 24 mois",
      "rows": [
        {
          "label": "Avant",
          "value": "Double disque J.Juan Ø320 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "Simple disque J.Juan Ø260 mm",
          "confidence": "official_fr"
        },
        {
          "label": "Liquide de frein",
          "value": "Remplacement tous les 24 mois",
          "confidence": "official_eu"
        },
        {
          "label": "Spécification",
          "value": "DOT 4 ou DOT 5.1 selon manuel",
          "confidence": "official_eu"
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
          "confidence": "official_fr"
        },
        {
          "label": "Arrière",
          "value": "150/70 R17",
          "confidence": "official_fr"
        },
        {
          "label": "Montage Touring",
          "value": "Jantes à rayons croisés tubeless",
          "confidence": "official_fr"
        }
      ]
    },
    {
      "id": "chaine",
      "title": "Chaîne & transmission",
      "summary": "Tension tous les 1 000 km",
      "rows": [
        {
          "label": "Tension",
          "value": "Contrôle tous les 1 000 km",
          "confidence": "official_eu"
        },
        {
          "label": "Lubrification",
          "value": "Contrôler après roulage sous la pluie et selon conditions d’usage",
          "confidence": "official_eu"
        },
        {
          "label": "Usure chaîne / couronne / pignon",
          "value": "Contrôle 10 000 km / 12 mois",
          "confidence": "official_eu"
        }
      ]
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-50 · API SJ+ · JASO MA2",
      "replacement_interval": "15 000 km / 12 mois · 2,8 L avec filtre",
      "observed_price": "Prix variable selon marque",
      "source_type": "official_eu"
    },
    {
      "part": "Filtre à huile OEM",
      "specification": "CFMOTO 61338015200",
      "reference_oem": "61338015200",
      "replacement_interval": "Avec l’huile",
      "observed_price": "12,90 €",
      "source_type": "observed",
      "note": "Prix observé Only-CFMOTO ; compatibilité 800MT Touring explicitement listée."
    },
    {
      "part": "Filtre à air adaptable",
      "specification": "MIW CFMOTO 800 MT · équivalent OEM famille 0PW0-111100",
      "replacement_interval": "15 000 km / 12 mois",
      "observed_price": "50,40 €",
      "source_type": "observed",
      "note": "Prix observé Cardy pour 800MT Touring 2022–2024 ; vérifier millésime/VIN avant commande."
    },
    {
      "part": "Bougies",
      "specification": "NGK LMAR9AI-10 · 2 unités",
      "replacement_interval": "30 000 km",
      "observed_price": "27,90 € club / 46,60 € public par unité",
      "source_type": "observed",
      "note": "Prix Cardy observé ; type et intervalle confirmés par le manuel FR."
    },
    {
      "part": "Chaîne adaptable",
      "specification": "DID 520VX3 · 122 maillons",
      "replacement_interval": "Selon usure · tension contrôlée tous les 1 000 km",
      "observed_price": "116,40 €",
      "source_type": "observed",
      "note": "Prix et compatibilité Cardy 800MT Touring 2022–2024."
    },
    {
      "part": "Plaquettes frein adaptables",
      "specification": "Référence selon essieu · TECNIUM / SBS listés pour 800MT Touring",
      "replacement_interval": "Selon usure",
      "observed_price": "≈40,20–62,30 € selon référence observée",
      "source_type": "observed",
      "note": "Ne pas choisir la référence sans vérifier avant/arrière et millésime."
    },
    {
      "part": "Filtre à huile adaptable",
      "specification": "MIW KT8008",
      "replacement_interval": "Avec l’huile",
      "observed_price": "10,80 €",
      "source_type": "observed",
      "note": "Prix Cardy observé pour 800MT Touring 2022–2024."
    }
  ],
  "known_issues_v2": [
    {
      "title": "Filtre à air : intervalle corrigé",
      "description": "Le manuel FR 800MT 2024 donne 15 000 km / 12 mois. Ne pas conserver l’ancienne valeur LabelMoto de 30 000 km.",
      "type": "manufacturer_monitoring",
      "confidence": "official_eu"
    },
    {
      "title": "Rappels officiels Europe",
      "description": "Aucune campagne 800MT n’apparaît sur la page officielle CFMOTO Europe consultée lors de cette vérification. Un contrôle par VIN auprès du réseau reste recommandé.",
      "type": "manufacturer_monitoring",
      "confidence": "official_eu"
    }
  ],
  "warranty": {
    "duration": "À vérifier selon date de première immatriculation et contrat",
    "market": "France",
    "maintenance_requirement": "Respecter le carnet correspondant au VIN et conserver les justificatifs d’entretien.",
    "claim_requirement": "La 800MT Touring n’apparaît pas dans le tableau actuel des modèles bénéficiant de l’extension 5 ans pour les immatriculations 2026. Le contrat remis avec la moto prévaut.",
    "source_label": "CFMOTO France · garantie moto"
  },
  "equivalents_v2": [
    {
      "name": "KTM 790",
      "reason": "Architecture moteur proche"
    },
    {
      "name": "Honda XL750 / CB750",
      "reason": "Alternative moderne"
    }
  ],
  "verdict": {
    "title": "15 000 km entre les révisions, mais filtre à air à chaque cycle",
    "text": "La 800MT Touring profite d’un cycle France espacé de 15 000 km / 1 an. Le point à corriger par rapport à l’ancienne fiche est le filtre à air : il est prévu à 15 000 km / 12 mois, tandis que les bougies et le contrôle des soupapes restent à 30 000 km.",
    "strengths": [
      "Révision principale espacée à 15 000 km / 1 an",
      "2,8 L et 10W-50 clairement documentés",
      "Bougies et soupapes à 30 000 km",
      "Garantie France pouvant aller à 5 ans selon conditions"
    ],
    "weaknesses": [
      "Filtre à air à chaque cycle 15 000 km / 12 mois",
      "Quelques références de consommables restent à verrouiller au VIN"
    ]
  },
  "data_quality": {
    "market": "France / Europe",
    "model_year": "2025+ dans LabelMoto · base Touring 800MT documentée 2022–2025",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": true,
    "recall_checked": true,
    "pricing_type": "mixed",
    "last_verified": "18/09/2026",
    "sources": [
      {
        "label": "CFMOTO France · 800MT Touring (archive modèles vendus)",
        "type": "official_fr",
        "market": "France",
        "url": "https://www.cf-moto.fr/moto/modeles-vendus/800mt-touring/",
        "note": "91 ch / 67 kW, 75 Nm, 825 mm, 231 kg, 19 L, freins et pneus."
      },
      {
        "label": "CFMOTO France · conseils d’entretien",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/conseils-entretien/",
        "note": "Gamme 800 cc : 1 000, 15 000, 30 000, 45 000 km ou annuel."
      },
      {
        "label": "CFMOTO · manuel FR 800MT 2024",
        "type": "official_eu",
        "market": "France / Europe",
        "model_year": "2024",
        "url": "https://a.storyblok.com/f/176629/x/7a4cb0a2db/800mt-2024-fr.pdf",
        "note": "2,8 L, 10W-50, air 15k/12m, LMAR9AI-10 30k, soupapes 30k, frein 24m, refroidissement 48m."
      },
      {
        "label": "CFMOTO France · garantie moto",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cf-moto.fr/moto/garantie/",
        "note": "La 800MT Touring n’est pas listée dans le tableau actuel des modèles à garantie étendue 5 ans pour les immatriculations 2026 ; contrat initial prioritaire."
      },
      {
        "label": "CFMOTO Europe · rappels",
        "type": "official_eu",
        "market": "Europe",
        "url": "https://cfmoto-motorcycle.eu/en/service/recall",
        "note": "Aucune campagne 800MT listée lors de la vérification."
      },
      {
        "label": "Only-CFMOTO · filtre à huile OEM 61338015200",
        "type": "observed",
        "market": "France",
        "url": "https://only-cfmoto.com/pieces-detachees-cf-moto/213-filtre-a-huile-seul-pour-cf-moto-800-mt-nk-mt-x-3000100087151.html",
        "note": "12,90 € observé ; Touring explicitement compatible."
      },
      {
        "label": "Cardy · 800 MT Touring ABS E5",
        "type": "observed",
        "market": "France",
        "model_year": "2022–2024",
        "url": "https://www.cardy.fr/fiche-technique-CFMOTO-800-MT-TOURING-ABS-E5-6952.html",
        "note": "Prix observés filtre air, filtre huile, bougies, chaîne et freinage adaptable."
      },
      {
        "label": "Référence filtre à air famille 800MT",
        "type": "observed",
        "market": "Europe",
        "model_year": "2022–2025",
        "url": "https://www.unobike.com/fr/filtre-a-air-sportif-sprint-filter-p08-pm228s-pour-bike-69838.html",
        "note": "Équivalence OEM 0PW0-111100 et compatibilité Touring listée."
      }
    ]
  }
};

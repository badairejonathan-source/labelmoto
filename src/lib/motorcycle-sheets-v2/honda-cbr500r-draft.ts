import type { MotorcycleSheetV2 } from "../motorcycle-sheet-v2";

/**
 * BROUILLON DE RECHERCHE - NE PAS ACTIVER.
 * Les calendriers, budgets et references OEM restent a documenter.
 */
export const hondaCbr500rDraftV2: MotorcycleSheetV2 = {
  known_issues_v2: [
  {
    "title": "Carénage et traces de chute",
    "description": "Examinez les fixations des flancs, les leviers, les embouts de guidon et les butées de direction. Un carénage remplacé peut masquer une chute : contrôlez l'alignement de la fourche, les jantes et les deux disques avant. Demandez les factures des réparations.",
    "type": "usage_limitation",
    "confidence": "technical_documentation"
  },
  {
    "title": "Entretien : ne pas négliger les 24 000 km",
    "description": "La grande révision comprend notamment les bougies, le filtre à air et le contrôle du jeu aux soupapes. Une simple facture de vidange ne prouve pas que ces opérations ont été effectuées. Vérifiez l'historique, le kilométrage et les justificatifs.",
    "type": "usage_limitation",
    "confidence": "official_eu"
  },
  {
    "title": "Essai des commandes et de l'embrayage",
    "description": "Sur la version standard, vérifiez la souplesse du levier d'embrayage, le point de patinage et le passage des six rapports. Sur l'E-Clutch, testez aussi les démarrages, les arrêts et les changements de vitesse avec l'assistance active, puis avec la commande manuelle. Toute anomalie doit être examinée avant l'achat.",
    "type": "usage_limitation",
    "confidence": "official_fr"
  },
  {
    "title": "Position de conduite : essayer avant de choisir",
    "description": "La CBR500R est plus accueillante qu'une supersport radicale, mais l'appui sur les poignets et les manoeuvres lentes ne conviennent pas à tout le monde. Testez-la sur un trajet réaliste et comparez-la à la CB500 Hornet si vous roulez surtout en ville.",
    "type": "usage_limitation",
    "confidence": "observed"
  }
],
  "layout_version": 2,
  "display_title": "Honda CBR500R",
  "hero_subtitle": "Sportive A2 de 471 cm? - 2026 standard et E-Clutch",
  "variants": [
    {
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Entretien des 1 000 km - CBR500R 2026 standard",
      "operations": [
        {
          "label": "Vidange moteur",
          "source_type": "official_eu"
        },
        {
          "label": "Remplacement du filtre ? huile",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles de première révision selon Honda",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "140 € - 220 €",
      "price_type": "estimate"
    },
    {
      "km": 12000,
      "title": "Entretien des 12 000 km - CBR500R 2026 standard",
      "operations": [
        {
          "label": "Vidange moteur",
          "source_type": "official_eu"
        },
        {
          "label": "Inspection des commandes et du freinage",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle des pneus, de la chaîne et des organes de sécurité",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "200 € - 310 €",
      "price_type": "estimate"
    },
    {
      "km": 24000,
      "title": "Entretien des 24 000 km - CBR500R 2026 standard",
      "operations": [
        {
          "label": "Vidange moteur et filtre ? huile",
          "source_type": "official_eu"
        },
        {
          "label": "Remplacement filtre à air et bougies",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle du jeu aux soupapes et des organes de sécurité",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "450 € - 680 €",
      "price_type": "estimate"
    },
    {
      "km": 36000,
      "title": "Entretien des 36 000 km - CBR500R 2026 standard",
      "operations": [
        {
          "label": "Vidange moteur",
          "source_type": "official_eu"
        },
        {
          "label": "Inspection des commandes, freins et suspensions",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle des pneus, de la chaîne et des organes de sécurité",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "200 € - 310 €",
      "price_type": "estimate"
    },
    {
      "km": 48000,
      "title": "Entretien des 48 000 km - CBR500R 2026 standard",
      "operations": [
        {
          "label": "Vidange moteur et filtre ? huile",
          "source_type": "official_eu"
        },
        {
          "label": "Remplacement filtre à air et bougies",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle du jeu aux soupapes et des organes de sécurité",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "450 € - 680 €",
      "price_type": "estimate"
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-30 ; vidange 2,5 L ou 2,7 L avec filtre",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Norme",
          "value": "SAE 10W-30, JASO MA, API SJ ou supérieur selon exclusions Honda"
        },
        {
          "label": "Vidange simple",
          "value": "2,5 L"
        },
        {
          "label": "Vidange avec filtre",
          "value": "2,7 L"
        },
        {
          "label": "Après démontage moteur",
          "value": "3,2 L ; ce n'est pas une quantité de vidange"
        },
        {
          "label": "Filtre ? huile",
          "value": "Référence OEM 2026 à confirmer par VIN"
        },
        {
          "label": "Vidange moteur",
          "value": "1 000 km, puis tous les 12 000 km"
        },
        {
          "label": "Filtre ? huile",
          "value": "1 000, 24 000 et 48 000 km"
        }
      ],
      "note": "Respectez les spécifications Honda. Les 3,2 L correspondent à la capacité après démontage, pas à une vidange courante."
    },
    {
      "id": "filtre-air",
      "title": "Filtre ? air",
      "summary": "Remplacement à 24 000 et 48 000 km",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Opération",
          "value": "Remplacement de l'élément filtrant"
        },
        {
          "label": "Périodicité",
          "value": "24 000 et 48 000 km"
        },
        {
          "label": "Conditions sévères",
          "value": "Entretien plus fréquent en milieu poussiéreux ou humide"
        },
        {
          "label": "Référence OEM",
          "value": "Compatibilité 2026 européenne à confirmer par VIN"
        }
      ],
      "note": "En environnement poussiéreux, rapprochez les contrôles. Référence de pièce à confirmer pour le VIN."
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "NGK CPR8EA-9 ; 2 bougies ; 0,8–0,9 mm",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Référence",
          "value": "NGK CPR8EA-9"
        },
        {
          "label": "Quantit?",
          "value": "2 bougies"
        },
        {
          "label": "Écartement",
          "value": "0,8 à 0,9 mm"
        },
        {
          "label": "Remplacement",
          "value": "24 000 et 48 000 km"
        }
      ],
      "note": "Remplacer les deux bougies selon le programme Honda 2026."
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "Contrôle à 24 000 et 48 000 km",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Distribution",
          "value": "Double ACT, 8 soupapes"
        },
        {
          "label": "Contrôle",
          "value": "24 000 et 48 000 km"
        },
        {
          "label": "Réglage",
          "value": "Uniquement si nécessaire après mesure"
        },
        {
          "label": "Valeurs de jeu",
          "value": "? relever dans le manuel d'atelier Honda"
        }
      ],
      "note": "Un contrôle ne signifie pas qu'un réglage sera systématiquement nécessaire."
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Pro Honda HP Coolant ; circuit de 1,32 L",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Liquide prescrit",
          "value": "Pro Honda HP Coolant"
        },
        {
          "label": "Capacité totale du circuit",
          "value": "1,32 L"
        },
        {
          "label": "Remplacement",
          "value": "Tous les 3 ans"
        },
        {
          "label": "Contrôles",
          "value": "Niveau à froid, durites, radiateur et fuites"
        }
      ],
      "note": "Contrôlez le niveau moteur froid. Ne retirez jamais le bouchon du radiateur à chaud."
    },
    {
      "id": "freins",
      "title": "Freinage & liquide de frein",
      "summary": "Deux disques avant 296 mm ; arrière 240 mm ; DOT 4",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Frein avant",
          "value": "Deux disques de 296 mm, étriers radiaux quatre pistons"
        },
        {
          "label": "Frein arrière",
          "value": "Un disque de 240 mm, étrier simple piston"
        },
        {
          "label": "ABS",
          "value": "Double canal"
        },
        {
          "label": "Liquide",
          "value": "Honda DOT 4"
        },
        {
          "label": "Remplacement liquide",
          "value": "Tous les 2 ans"
        },
        {
          "label": "Plaquettes",
          "value": "Selon usure ; références OEM à confirmer"
        }
      ],
      "note": "Les plaquettes s'usent selon l'utilisation. Confirmez les références de montage par VIN."
    },
    {
      "id": "pneus",
      "title": "Pneus & pressions",
      "summary": "Avant 120/70ZR17 ; arrière 160/60ZR17",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Avant",
          "value": "120/70ZR17M/C (58W)"
        },
        {
          "label": "Arrière",
          "value": "160/60ZR17M/C (69W)"
        },
        {
          "label": "Pression avant à froid",
          "value": "2,5 bar"
        },
        {
          "label": "Pression arrière à froid",
          "value": "2,9 bar"
        },
        {
          "label": "Remplacement",
          "value": "Selon usure et état"
        }
      ],
      "note": "Respectez les dimensions et indices prescrits ; mesurez les pressions à froid."
    },
    {
      "id": "transmission",
      "title": "Chaîne & transmission",
      "summary": "Chaîne 520, 112 maillons ; transmission 15/41",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Boîte",
          "value": "6 rapports"
        },
        {
          "label": "Chaîne",
          "value": "DID520VF ou RK520ELO, 112 maillons"
        },
        {
          "label": "Pignon / couronne",
          "value": "15 / 41 dents"
        },
        {
          "label": "Jeu de chaîne",
          "value": "25 à 35 mm"
        },
        {
          "label": "Entretien",
          "value": "Contrôle et lubrification tous les 1 000 km"
        },
        {
          "label": "Kit chaîne complet",
          "value": "Référence OEM exacte à confirmer par VIN"
        }
      ],
      "note": "Lubrifiez la chaîne après la pluie et contrôlez son jeu. Kit complet à identifier par VIN."
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-30 ; JASO MA ; API SJ ou supérieur selon exclusions Honda. Vidange simple 2,5 L ; avec filtre 2,7 L.",
      "replacement_interval": "1 000 km, puis tous les 12 000 km ou selon limite annuelle",
      "note": "Kit vidange Revimoto annoncé à 44,90 € TTC avec 3 L d'huile, filtre adaptable et joint ; hors pose. Ce n'est pas le prix de l'huile seule.",
      "source_type": "official_eu",
      "observed_price": "22,90 EUR TTC / litre - Motul E-TEC 10W-30, prix vendeur indicatif"
    },
    {
      "part": "Filtre ? huile",
      "specification": "Filtre Honda : référence OEM européenne 2026 à confirmer par VIN",
      "replacement_interval": "1 000, 24 000 et 48 000 km",
      "note": "Prix observé sur un catalogue vendeur ; référence OEM européenne 2026 à confirmer.",
      "source_type": "official_eu",
      "observed_price": "16,86 EUR TTC / unite - tarif catalogue vendeur Honda"
    },
    {
      "part": "Filtre ? air",
      "specification": "élément de filtre à air : référence OEM 2026 à confirmer par VIN",
      "replacement_interval": "24 000 et 48 000 km",
      "note": "Tarif vendeur indicatif ; affectation OEM 2026 et E-Clutch à confirmer.",
      "source_type": "official_eu",
      "observed_price": "49,90 EUR TTC / unite - tarif catalogue vendeur Honda"
    },
    {
      "part": "Bougies",
      "specification": "NGK CPR8EA-9 ; 2 unités ; Écartement 0,8 à 0,9 mm",
      "replacement_interval": "24 000 et 48 000 km",
      "note": "Deux bougies NGK CPR8EA-9 nécessaires ; prix affiché à l'unité.",
      "source_type": "official_eu",
      "observed_price": "17,09 EUR TTC / unite - NGK CPR8EA-9 ; 2 unites necessaires"
    },
    {
      "part": "Pneumatiques",
      "specification": "Avant 120/70ZR17M/C (58W) ; arrière 160/60ZR17M/C (69W) ; pressions 2,5 / 2,9 bar à froid",
      "replacement_interval": "Selon usure et état",
      "note": "Michelin Road 6, prix Allopneus relevés le 09/10/2026 : 273 € TTC le train, hors montage et équilibrage.",
      "source_type": "official_eu",
      "observed_price": "Michelin Road 6 : avant 129,00 EUR TTC ; arriere 144,00 EUR TTC ; train 273,00 EUR TTC, hors montage et equilibrage"
    },
    {
      "part": "Kit chaine",
      "specification": "Chaîne DID520VF ou RK520ELO ; 112 maillons ; pignon 15 dents et couronne 41 dents ; jeu 25 à 35 mm",
      "replacement_interval": "Selon usure ; inspection et lubrification tous les 1 000 km",
      "note": "Tarif vendeur hors pose. Démultiplication Honda 15/41 ; référence du kit à confirmer par VIN.",
      "source_type": "official_eu",
      "observed_price": "148,90 EUR TTC / kit chaine Honda 520, 15/41, hors pose"
    },
    {
      "part": "Liquide de frein",
      "specification": "Honda DOT 4 Brake Fluid",
      "replacement_interval": "Tous les 2 ans",
      "note": "Prix d'un bidon de 500 ml, pas d'une purge en atelier.",
      "source_type": "official_eu",
      "observed_price": "13,90 EUR TTC / bidon 500 ml Honda DOT 4, hors pose"
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Pro Honda HP Coolant ; capacité du circuit 1,32 L",
      "replacement_interval": "Tous les 3 ans",
      "note": "Prix observé pour un bidon de 1 L ; ne pas le confondre avec le coût de remplacement du circuit.",
      "source_type": "official_eu",
      "observed_price": "13,41 EUR TTC / bidon 1 L Motul Motocool Factory Line -35 ; prix promotionnel de reference, a revalider chez le vendeur"
    },
    {
      "part": "Plaquettes avant",
      "specification": "Honda 06455-MKP-DN1 ; 2 jeux pour 2 etriers ; reference relevee sur eclate OEM 2026 nord-americain. Compatibilite France et E-Clutch a confirmer par VIN.",
      "replacement_interval": "Selon usure",
      "note": "Deux jeux pour les deux étriers avant ; prix hors pose. Affectation OEM européenne à confirmer.",
      "source_type": "official_other_market",
      "observed_price": "56,90 EUR TTC / jeu ; 2 jeux soit 113,80 EUR TTC, hors pose"
    },
    {
      "part": "Plaquettes arriere",
      "specification": "Honda 06435-MGZ-J02 ; 1 jeu ; reference relevee sur eclate OEM 2026 nord-americain. Compatibilite France et E-Clutch a confirmer par VIN.",
      "replacement_interval": "Selon usure",
      "note": "Un jeu arrière, hors pose. Affectation OEM européenne à confirmer.",
      "source_type": "official_other_market",
      "observed_price": "57,90 EUR TTC / jeu, hors pose"
    }
  ],
  "warranty": {
    "duration": "Jusqu'à 6 ans pour une Honda neuve éligible immatriculée en France à partir du 01/04/2025",
    "coverage": "Programme Honda France sous conditions contractuelles ; vérifier la durée, les exclusions et les exigences d'entretien applicables.",
    "maintenance_requirement": "Respecter les conditions de garantie Honda France et conserver les justificatifs d'entretien.",
    "claim_requirement": "Vérifier l'éligibilité et les conditions en vigueur auprès du réseau Honda avec le VIN.",
    "market": "France, selon éligibilité",
    "source_label": "Honda France - garantie jusqu'? 6 ans, sous conditions"
  },
  "budget": {
    "title": "Budget entretien sur 30 000 km - CBR500R 2026 standard",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "790 € - 1 210 €",
      "cost_per_km": "0,026 - 0,040 €/km",
      "interval_rule": "Somme des révisions estimées à 1 000, 12 000 et 24 000 km, fournitures et main-d’œuvre incluses.",
      "note": "Estimations editoriales, sans devis concessionnaire Honda France. Hors pneus, plaquettes, kit chaine, reparations et operations calendaires additionnelles."
    },
    "note": "Estimation editoriale construite à partir des cycles Honda et de tarifs de fournitures observes. Aucun forfait officiel Honda 2026 confirme."
  },
  "label": "CBR500R 2026 standard",
  "quick_facts": [
    {
      "label": "Modèle",
      "value": "CBR500R 2026 standard"
    },
    {
      "label": "Cylindrée",
      "value": "471 cm³"
    },
    {
      "label": "Puissance",
      "value": "35 kW (47,5 ch)"
    },
    {
      "label": "Poids tous pleins faits",
      "value": "191 kg"
    },
    {
      "label": "Hauteur de selle",
      "value": "789 mm"
    },
    {
      "label": "Réservoir",
      "value": "17,1 L"
    },
    {
      "label": "Transmission",
      "value": "6 rapports"
    },
    {
      "label": "Permis",
      "value": "A2, sans bridage"
    }
  ],
  "verdict": {
    "title": "CBR500R : le plaisir d'une sportive sans les contraintes d'une supersport",
    "text": "La CBR500R a le physique d'une sportive, mais son caractère est bien plus conciliant que ne le suggère son carénage. Avec 35 kW, son bicylindre de 471 cm3 reste facile à doser, particulièrement en sortie de virage ou dans une circulation irrégulière. Elle n'impressionne pas par une accélération brutale : elle met plutôt en confiance et encourage à travailler ses trajectoires.\n\nC'est sur route qu'elle convainc le plus. Le carénage apporte une protection appréciable, la position de conduite reste supportable au quotidien et le double disque avant offre un freinage progressif. En contrepartie, ses 191 kg se ressentent dans certaines manoeuvres à basse vitesse et les reprises restent celles d'une A2 de 47,5 ch. Elle ne remplacera pas une supersport pour qui recherche des performances de circuit.\n\nLa CBR500R s'adresse donc au motard qui veut une vraie silhouette de sportive sans renoncer aux trajets quotidiens, aux balades et à une prise en main accessible. Son principal atout n'est pas la puissance : c'est l'équilibre entre plaisir et facilité.",
    "strengths": [
      "Véritable carénage utile sur les trajets rapides",
      "Moteur A2 souple sans bridage",
      "Ergonomie moins contraignante qu'une supersport radicale"
    ],
    "weaknesses": [
      "Poids sensible pour une sportive de cette cylindrée",
      "Relances moins démonstratives que ne le suggère son apparence",
      "Moins protectrice et moins pratique qu'un véritable trail routier"
    ]
  },
  "conclusion": "Notre choix va à la CBR500R standard pour un jeune permis A2 qui aime changer lui-même les rapports et roule principalement sur route. Elle conserve l'essentiel de l'expérience sportive, sans le poids ni le coût supplémentaires de l'E-Clutch.\n\nAvant d'acheter, essayez-la sur votre parcours habituel : une position agréable pendant vingt minutes ne l'est pas forcément après une heure. Sur une occasion, regardez particulièrement les fixations du carénage, l'alignement de la direction, l'état des deux freins avant et les factures de la grande révision des 24 000 km.\n\nPour les pneus, un train de Michelin Road 6 est un choix cohérent si vous roulez souvent, y compris sous la pluie. Un pneumatique plus sportif n'a d'intérêt que si votre pratique le justifie.",
  "longevity_tips": [
    "Respecter le programme d'entretien du manuel Honda CBR500RA/RAC 2026 ; ne pas déduire les échéances d'un autre millésime.",
    "Surveiller régulièrement la tension, la lubrification et l'usure de la chaîne, particulièrement après les trajets sous la pluie.",
    "Contrôler les deux freins avant, les pneus et l'état des joints de fourche : le carénage peut masquer certaines traces de chute.",
    "Nettoyer et inspecter les fixations du carénage, les écopes et les supports après une intervention ou une petite chute.",
    "Veiller au bon réglage du câble d'embrayage et à la qualité du passage des rapports, sans confondre une commande dure avec une caractéristique normale."
  ],
  "faq": [
    {
      "question": "La CBR500R 2026 est-elle compatible avec le permis A2 €",
      "answer": "Oui. Ses 35 kW correspondent à la limite A2 et aucun bridage de puissance n'est nécessaire."
    },
    {
      "question": "Est-ce une sportive adaptée aux trajets quotidiens ?",
      "answer": "Oui, sa position de conduite reste relativement mesurée et son carénage améliore la protection au vent. Il faut néanmoins essayer le confort de selle et l'appui sur les poignets."
    },
    {
      "question": "La CBR500R standard possède-t-elle l'E-Clutch ?",
      "answer": "Non. La version standard utilise un embrayage commandé manuellement. Une variante E-Clutch existe dans la gamme 2026."
    }
  ],
  "data_quality": {
    "market": "France ; manuel 2026 européen",
    "model_year": "2026",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": false,
    "recall_checked": false,
    "pricing_type": "to_confirm",
    "last_verified": "2026-10-09",
    "sources": [
      {
        "label": "Honda France - CBR500R caractéristiques 2026",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://moto.honda.fr/motorcycles/range/super-sport/cbr500r/specifications-and-price.html",
        "note": "Poids, hauteur de selle, puissance, transmission et équipements."
      },
      {
        "label": "Honda - dossier de presse CBR500R 2026",
        "type": "official_fr",
        "market": "Europe",
        "model_year": "2026",
        "url": "https://hondanews.eu/fr/fr/motorcycles/media/pressreleases/555232/dossier-de-presse-honda-cbr500r-2026",
        "note": "Attention : poids et selle différents de la fiche commerciale Honda France."
      },
      {
        "label": "Auto Trader - essai CBR500R E-Clutch 2026",
        "type": "observed",
        "market": "Royaume-Uni",
        "model_year": "2026",
        "url": "https://www.autotrader.co.uk/bikes/content/honda-cbr500r-review-2026",
        "note": "Évaluation éditoriale de l'ergonomie, de la polyvalence et de l'E-Clutch."
      },
      {
        "label": "Honda - Programme entretien CBR500RA/RAC 2026",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2026",
        "url": "https://webom.hondamotopub.com/webom/HMEE/MLR263/html/GMT004001.html",
        "note": "Calendrier européen officiel, versions standard et E-Clutch."
      },
      {
        "label": "Honda - Spécifications CBR500RA/RAC 2026",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2026",
        "url": "https://webom.hondamotopub.com/webom/HMEE/MLR263/html/GSP002001.html",
        "note": "Fluides, quantités, bougies, pneus et transmission."
      },
      {
        "label": "Revimoto - Kit vidange CBR500R 2013-2026",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.revimoto.fr/products/kit-vidange-entretien-honda-cbr-500-r-2013-2026",
        "note": "44,90 EUR TTC observes le 09/10/2026 : kit 3 L huile Motul, filtre adaptable HF204 et joint. Prix du kit entier, hors pose. Compatibilite declaree par vendeur."
      },
      {
        "label": "Honda Parts - Filtre a air OEM 17211-MKP-J00",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2024",
        "url": "https://www.honda-parts.eu/eu/motorcycle/parts/air-filter/air-filter-17211-mkp-j00",
        "note": "Affectation constructeur documentee jusqu'en 2024 ; version francaise 2026 E-Clutch encore a verifier."
      },
      {
        "label": "Pieces Honda Moto - pack revision CBR500R, tarifs des fournitures",
        "type": "observed",
        "market": "France",
        "model_year": "2024",
        "url": "https://www.pieces-honda-moto.com/pieces-detachees/151643-pack-revision-48-000-km-pour-honda-cbr500r-annee-2024-pack-cbr500rar-48000km.html",
        "note": "Tarifs observes : huile 22,90 EUR/L, filtre huile 16,86 EUR, filtre air 49,90 EUR, bougies 17,09 EUR/unite. Prix vendeur du pack 2024, pas prix garantis pour 2026."
      },
      {
        "label": "CB500Shop - pack entretien 24000/48000 CBR500R",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cb500shop.com/fr/cb500f/cb500f-2019-2021/entretien/vidange-moteur/1062-pack-entretien-2400048000km-2019.html",
        "note": "Affectation commerciale annoncant la compatibilite avec CBR500R 2026 avec et sans E-Clutch. A recouper avec la nomenclature OEM."
      },
      {
        "label": "Honda OEM - CBR500R 2026 - etriers avant",
        "type": "official_other_market",
        "market": "Amerique du Nord",
        "model_year": "2026",
        "url": "https://www.revzilla.com/oem/honda/2026-honda-cbr500r-abs/front-brake-caliper?submodel=cbr500ra9ac",
        "note": "Reference 06455-MKP-DN1, quantite 2. Affectation europeenne et E-Clutch a confirmer."
      },
      {
        "label": "Honda OEM - CBR500R 2026 - etrier arriere",
        "type": "official_other_market",
        "market": "Amerique du Nord",
        "model_year": "2026",
        "url": "https://www.revzilla.com/oem/honda/2026-honda-cbr500r-abs/rear-brake-caliper?submodel=cbr500ra7ac",
        "note": "Reference 06435-MGZ-J02, quantite 1. Affectation europeenne et E-Clutch a confirmer."
      },
      {
        "label": "CB500Shop - Freinage CBR500R 2024-2026",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cb500shop.com/fr/259-cbr500r/cbr500r-2024-2026/entretien/freinage",
        "note": "Prix commerciaux : plaquettes avant 56,90 EUR/jeu, arriere 57,90 EUR/jeu et DOT4 13,90 EUR/500ml."
      },
      {
        "label": "CB500Shop - Kit chaine Honda CBR500R 2024-2026",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cb500shop.com/fr/262-cbr500r/cbr500r-2024-2026/entretien/kit-chaine",
        "note": "Kit chaine d'origine 520, 15/41, 148,90 EUR TTC hors pose. Confirmation de numero OEM par VIN toujours requise."
      },
      {
        "label": "Michelin - Pneus compatibles CBR500R 2026",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.michelin.fr/motorbike/browse-tyres/by-vehicle/honda/cbr500r/2026/470/120---70-ZR-17-%2858W%29-F-TL_160---60-ZR-17-%2869W%29-R-TL",
        "note": "Michelin Road 6 et Power 6 proposes aux dimensions 120/70ZR17 (58W) et 160/60ZR17 (69W). Aucun prix deduit."
      },
      {
        "label": "Allopneus - Recherche pneus avant Honda CBR500R",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.allopneus.com/liste/pneu-moto?d1=120&d2=70&d3=17&d4=58&d5=W&vehicleBrandSearch=honda&vehicleRange=cbr500r",
        "note": "Capture utilisateur du 09/10/2026 : Michelin Road 6 avant, 120/70 ZR17 58W, 129,00 EUR TTC hors pose."
      },
      {
        "label": "Allopneus - Recherche pneus arriere Honda CBR500R",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.allopneus.com/liste/pneu-moto?d1=160&d2=60&d3=17&d4=69&d5=W&vehicleBrandSearch=honda&vehicleRange=cbr500r",
        "note": "Capture utilisateur du 09/10/2026 : Michelin Road 6 arriere, 160/60 ZR17 69W, 144,00 EUR TTC hors pose."
      }
    ]
  }
},
    {
  "service_schedule_v2": [
    {
      "km": 1000,
      "title": "Entretien des 1 000 km - CBR500R 2026 E-Clutch",
      "operations": [
        {
          "label": "Vidange moteur",
          "source_type": "official_eu"
        },
        {
          "label": "Remplacement du filtre ? huile",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôles de première révision selon Honda",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "140 € - 220 €",
      "price_type": "estimate"
    },
    {
      "km": 12000,
      "title": "Entretien des 12 000 km - CBR500R 2026 E-Clutch",
      "operations": [
        {
          "label": "Vidange moteur",
          "source_type": "official_eu"
        },
        {
          "label": "Inspection des commandes et du freinage",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle des pneus, de la chaîne et des organes de sécurité",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "200 € - 310 €",
      "price_type": "estimate"
    },
    {
      "km": 24000,
      "title": "Entretien des 24 000 km - CBR500R 2026 E-Clutch",
      "operations": [
        {
          "label": "Vidange moteur et filtre ? huile",
          "source_type": "official_eu"
        },
        {
          "label": "Remplacement filtre à air et bougies",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle du jeu aux soupapes et des organes de sécurité",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "450 € - 680 €",
      "price_type": "estimate"
    },
    {
      "km": 36000,
      "title": "Entretien des 36 000 km - CBR500R 2026 E-Clutch",
      "operations": [
        {
          "label": "Vidange moteur",
          "source_type": "official_eu"
        },
        {
          "label": "Inspection des commandes, freins et suspensions",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle des pneus, de la chaîne et des organes de sécurité",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "200 € - 310 €",
      "price_type": "estimate"
    },
    {
      "km": 48000,
      "title": "Entretien des 48 000 km - CBR500R 2026 E-Clutch",
      "operations": [
        {
          "label": "Vidange moteur et filtre ? huile",
          "source_type": "official_eu"
        },
        {
          "label": "Remplacement filtre à air et bougies",
          "source_type": "official_eu"
        },
        {
          "label": "Contrôle du jeu aux soupapes et des organes de sécurité",
          "source_type": "official_eu"
        }
      ],
      "note": "Programme Honda 2026 CBR500RA/RAC, versions européennes. Vérifier aussi les opérations calendaires, les inspections supplémentaires et les conditions d'utilisation. Fourchette editoriale Label Moto, pieces et main-d'oeuvre estimees ; pas un devis Honda France.",
      "price_estimate": "450 € - 680 €",
      "price_type": "estimate"
    }
  ],
  "maintenance_details": [
    {
      "id": "huile",
      "title": "Huile moteur & filtre",
      "summary": "SAE 10W-30 ; vidange 2,5 L ou 2,7 L avec filtre",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Norme",
          "value": "SAE 10W-30, JASO MA, API SJ ou supérieur selon exclusions Honda"
        },
        {
          "label": "Vidange simple",
          "value": "2,5 L"
        },
        {
          "label": "Vidange avec filtre",
          "value": "2,7 L"
        },
        {
          "label": "Après démontage moteur",
          "value": "3,2 L ; ce n'est pas une quantité de vidange"
        },
        {
          "label": "Filtre ? huile",
          "value": "Référence OEM 2026 à confirmer par VIN"
        },
        {
          "label": "Vidange moteur",
          "value": "1 000 km, puis tous les 12 000 km"
        },
        {
          "label": "Filtre ? huile",
          "value": "1 000, 24 000 et 48 000 km"
        }
      ],
      "note": "Respectez les spécifications Honda. Les 3,2 L correspondent à la capacité après démontage, pas à une vidange courante."
    },
    {
      "id": "filtre-air",
      "title": "Filtre ? air",
      "summary": "Remplacement à 24 000 et 48 000 km",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Opération",
          "value": "Remplacement de l'élément filtrant"
        },
        {
          "label": "Périodicité",
          "value": "24 000 et 48 000 km"
        },
        {
          "label": "Conditions sévères",
          "value": "Entretien plus fréquent en milieu poussiéreux ou humide"
        },
        {
          "label": "Référence OEM",
          "value": "Compatibilité 2026 européenne à confirmer par VIN"
        }
      ],
      "note": "En environnement poussiéreux, rapprochez les contrôles. Référence de pièce à confirmer pour le VIN."
    },
    {
      "id": "bougies",
      "title": "Bougies",
      "summary": "NGK CPR8EA-9 ; 2 bougies ; 0,8–0,9 mm",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Référence",
          "value": "NGK CPR8EA-9"
        },
        {
          "label": "Quantit?",
          "value": "2 bougies"
        },
        {
          "label": "Écartement",
          "value": "0,8 à 0,9 mm"
        },
        {
          "label": "Remplacement",
          "value": "24 000 et 48 000 km"
        }
      ],
      "note": "Remplacer les deux bougies selon le programme Honda 2026."
    },
    {
      "id": "soupapes",
      "title": "Jeu aux soupapes",
      "summary": "Contrôle à 24 000 et 48 000 km",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Distribution",
          "value": "Double ACT, 8 soupapes"
        },
        {
          "label": "Contrôle",
          "value": "24 000 et 48 000 km"
        },
        {
          "label": "Réglage",
          "value": "Uniquement si nécessaire après mesure"
        },
        {
          "label": "Valeurs de jeu",
          "value": "? relever dans le manuel d'atelier Honda"
        }
      ],
      "note": "Un contrôle ne signifie pas qu'un réglage sera systématiquement nécessaire."
    },
    {
      "id": "refroidissement",
      "title": "Liquide de refroidissement",
      "summary": "Pro Honda HP Coolant ; circuit de 1,32 L",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Liquide prescrit",
          "value": "Pro Honda HP Coolant"
        },
        {
          "label": "Capacité totale du circuit",
          "value": "1,32 L"
        },
        {
          "label": "Remplacement",
          "value": "Tous les 3 ans"
        },
        {
          "label": "Contrôles",
          "value": "Niveau à froid, durites, radiateur et fuites"
        }
      ],
      "note": "Contrôlez le niveau moteur froid. Ne retirez jamais le bouchon du radiateur à chaud."
    },
    {
      "id": "freins",
      "title": "Freinage & liquide de frein",
      "summary": "Deux disques avant 296 mm ; arrière 240 mm ; DOT 4",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Frein avant",
          "value": "Deux disques de 296 mm, étriers radiaux quatre pistons"
        },
        {
          "label": "Frein arrière",
          "value": "Un disque de 240 mm, étrier simple piston"
        },
        {
          "label": "ABS",
          "value": "Double canal"
        },
        {
          "label": "Liquide",
          "value": "Honda DOT 4"
        },
        {
          "label": "Remplacement liquide",
          "value": "Tous les 2 ans"
        },
        {
          "label": "Plaquettes",
          "value": "Selon usure ; références OEM à confirmer"
        }
      ],
      "note": "Les plaquettes s'usent selon l'utilisation. Confirmez les références de montage par VIN."
    },
    {
      "id": "pneus",
      "title": "Pneus & pressions",
      "summary": "Avant 120/70ZR17 ; arrière 160/60ZR17",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Avant",
          "value": "120/70ZR17M/C (58W)"
        },
        {
          "label": "Arrière",
          "value": "160/60ZR17M/C (69W)"
        },
        {
          "label": "Pression avant à froid",
          "value": "2,5 bar"
        },
        {
          "label": "Pression arrière à froid",
          "value": "2,9 bar"
        },
        {
          "label": "Remplacement",
          "value": "Selon usure et état"
        }
      ],
      "note": "Respectez les dimensions et indices prescrits ; mesurez les pressions à froid."
    },
    {
      "id": "transmission",
      "title": "Chaîne & transmission",
      "summary": "Chaîne 520, 112 maillons ; transmission 15/41 ; E-Clutch",
      "rows": [
        {
          "label": "Moto",
          "value": "CBR500R 2026, standard et E-Clutch"
        },
        {
          "label": "Boîte",
          "value": "6 rapports"
        },
        {
          "label": "Chaîne",
          "value": "DID520VF ou RK520ELO, 112 maillons"
        },
        {
          "label": "Pignon / couronne",
          "value": "15 / 41 dents"
        },
        {
          "label": "Jeu de chaîne",
          "value": "25 à 35 mm"
        },
        {
          "label": "Entretien",
          "value": "Contrôle et lubrification tous les 1 000 km"
        },
        {
          "label": "Kit chaîne complet",
          "value": "Référence OEM exacte à confirmer par VIN"
        },
        {
          "label": "E-Clutch",
          "value": "Commande électronique de l'embrayage ; sélecteur et levier manuel conservés. Respecter les consignes du manuel 2026."
        }
      ],
      "note": "Lubrifiez la chaîne après la pluie et contrôlez son jeu. Kit complet à identifier par VIN."
    }
  ],
  "consumables_v2": [
    {
      "part": "Huile moteur",
      "specification": "SAE 10W-30 ; JASO MA ; API SJ ou supérieur selon exclusions Honda. Vidange simple 2,5 L ; avec filtre 2,7 L.",
      "replacement_interval": "1 000 km, puis tous les 12 000 km ou selon limite annuelle",
      "note": "Kit vidange Revimoto annoncé à 44,90 € TTC avec 3 L d'huile, filtre adaptable et joint ; hors pose. Ce n'est pas le prix de l'huile seule.",
      "source_type": "official_eu",
      "observed_price": "22,90 EUR TTC / litre - Motul E-TEC 10W-30, prix vendeur indicatif"
    },
    {
      "part": "Filtre ? huile",
      "specification": "Filtre Honda : référence OEM européenne 2026 à confirmer par VIN",
      "replacement_interval": "1 000, 24 000 et 48 000 km",
      "note": "Prix observé sur un catalogue vendeur ; référence OEM européenne 2026 à confirmer.",
      "source_type": "official_eu",
      "observed_price": "16,86 EUR TTC / unite - tarif catalogue vendeur Honda"
    },
    {
      "part": "Filtre ? air",
      "specification": "élément de filtre à air : référence OEM 2026 à confirmer par VIN",
      "replacement_interval": "24 000 et 48 000 km",
      "note": "Tarif vendeur indicatif ; affectation OEM 2026 et E-Clutch à confirmer.",
      "source_type": "official_eu",
      "observed_price": "49,90 EUR TTC / unite - tarif catalogue vendeur Honda"
    },
    {
      "part": "Bougies",
      "specification": "NGK CPR8EA-9 ; 2 unités ; Écartement 0,8 à 0,9 mm",
      "replacement_interval": "24 000 et 48 000 km",
      "note": "Deux bougies NGK CPR8EA-9 nécessaires ; prix affiché à l'unité.",
      "source_type": "official_eu",
      "observed_price": "17,09 EUR TTC / unite - NGK CPR8EA-9 ; 2 unites necessaires"
    },
    {
      "part": "Pneumatiques",
      "specification": "Avant 120/70ZR17M/C (58W) ; arrière 160/60ZR17M/C (69W) ; pressions 2,5 / 2,9 bar à froid",
      "replacement_interval": "Selon usure et état",
      "note": "Michelin Road 6, prix Allopneus relevés le 09/10/2026 : 273 € TTC le train, hors montage et équilibrage.",
      "source_type": "official_eu",
      "observed_price": "Michelin Road 6 : avant 129,00 EUR TTC ; arriere 144,00 EUR TTC ; train 273,00 EUR TTC, hors montage et equilibrage"
    },
    {
      "part": "Kit chaine",
      "specification": "Chaîne DID520VF ou RK520ELO ; 112 maillons ; pignon 15 dents et couronne 41 dents ; jeu 25 à 35 mm",
      "replacement_interval": "Selon usure ; inspection et lubrification tous les 1 000 km",
      "note": "Tarif vendeur hors pose. Démultiplication Honda 15/41 ; référence du kit à confirmer par VIN.",
      "source_type": "official_eu",
      "observed_price": "148,90 EUR TTC / kit chaine Honda 520, 15/41, hors pose"
    },
    {
      "part": "Liquide de frein",
      "specification": "Honda DOT 4 Brake Fluid",
      "replacement_interval": "Tous les 2 ans",
      "note": "Prix d'un bidon de 500 ml, pas d'une purge en atelier.",
      "source_type": "official_eu",
      "observed_price": "13,90 EUR TTC / bidon 500 ml Honda DOT 4, hors pose"
    },
    {
      "part": "Liquide de refroidissement",
      "specification": "Pro Honda HP Coolant ; capacité du circuit 1,32 L",
      "replacement_interval": "Tous les 3 ans",
      "note": "Prix observé pour un bidon de 1 L ; ne pas le confondre avec le coût de remplacement du circuit.",
      "source_type": "official_eu",
      "observed_price": "13,41 EUR TTC / bidon 1 L Motul Motocool Factory Line -35 ; prix promotionnel de reference, a revalider chez le vendeur"
    },
    {
      "part": "Plaquettes avant",
      "specification": "Honda 06455-MKP-DN1 ; 2 jeux pour 2 etriers ; reference relevee sur eclate OEM 2026 nord-americain. Compatibilite France et E-Clutch a confirmer par VIN.",
      "replacement_interval": "Selon usure",
      "note": "Deux jeux pour les deux étriers avant ; prix hors pose. Affectation OEM européenne à confirmer.",
      "source_type": "official_other_market",
      "observed_price": "56,90 EUR TTC / jeu ; 2 jeux soit 113,80 EUR TTC, hors pose"
    },
    {
      "part": "Plaquettes arriere",
      "specification": "Honda 06435-MGZ-J02 ; 1 jeu ; reference relevee sur eclate OEM 2026 nord-americain. Compatibilite France et E-Clutch a confirmer par VIN.",
      "replacement_interval": "Selon usure",
      "note": "Un jeu arrière, hors pose. Affectation OEM européenne à confirmer.",
      "source_type": "official_other_market",
      "observed_price": "57,90 EUR TTC / jeu, hors pose"
    }
  ],
  "warranty": {
    "duration": "Jusqu'à 6 ans pour une Honda neuve éligible immatriculée en France à partir du 01/04/2025",
    "coverage": "Programme Honda France sous conditions contractuelles ; vérifier la durée, les exclusions et les exigences d'entretien applicables.",
    "maintenance_requirement": "Respecter les conditions de garantie Honda France et conserver les justificatifs d'entretien.",
    "claim_requirement": "Vérifier l'éligibilité et les conditions en vigueur auprès du réseau Honda avec le VIN.",
    "market": "France, selon éligibilité",
    "source_label": "Honda France - garantie jusqu'? 6 ans, sous conditions"
  },
  "budget": {
    "title": "Budget entretien sur 30 000 km - CBR500R 2026 E-Clutch",
    "summary": {
      "horizon_km": 30000,
      "total_cost": "790 € - 1 210 €",
      "cost_per_km": "0,026 - 0,040 €/km",
      "interval_rule": "Somme des révisions estimées à 1 000, 12 000 et 24 000 km, fournitures et main-d’œuvre incluses.",
      "note": "Estimations editoriales, sans devis concessionnaire Honda France. Hors pneus, plaquettes, kit chaine, reparations et operations calendaires additionnelles."
    },
    "note": "Estimation editoriale alignee sur les operations d'entretien de la version standard. Aucun surcout E-Clutch documente dans les tarifs disponibles. Tarifs reels a confirmer aupres du concessionnaire Honda."
  },
  "label": "CBR500R 2026 E-Clutch",
  "quick_facts": [
    {
      "label": "Modèle",
      "value": "CBR500R 2026 E-Clutch"
    },
    {
      "label": "Cylindrée",
      "value": "471 cm³"
    },
    {
      "label": "Puissance",
      "value": "35 kW (47,5 ch)"
    },
    {
      "label": "Poids tous pleins faits",
      "value": "194 kg"
    },
    {
      "label": "Hauteur de selle",
      "value": "789 mm"
    },
    {
      "label": "Réservoir",
      "value": "17,1 L"
    },
    {
      "label": "Transmission",
      "value": "6 rapports + E-Clutch"
    },
    {
      "label": "Permis",
      "value": "A2, sans bridage"
    }
  ],
  "verdict": {
    "title": "CBR500R E-Clutch : une sportive A2 plus facile au quotidien",
    "text": "La CBR500R E-Clutch garde les qualités de la version classique : un moteur A2 progressif, un carénage utile et une position moins exigeante que celle d'une supersport. Sa différence se ressent surtout aux intersections, dans les embouteillages et lors des relances. Le système commande l'embrayage à votre place, mais vous continuez à choisir les rapports avec le sélecteur.\n\nCette assistance peut apporter un vrai confort en ville. Elle évite de solliciter sans cesse le levier gauche et facilite les démarrages, sans priver le pilote de la possibilité d'utiliser l'embrayage manuellement. En revanche, elle ne transforme pas la CBR500R en moto automatique et ne lui apporte aucune puissance supplémentaire.\n\nAvec 194 kg annoncés par Honda France, cette version ajoute quelques kilos à une moto déjà plutôt consistante pour sa cylindrée. Le système étant récent sur cette gamme, il manque aussi du recul pour juger son vieillissement sur de forts kilométrages. Son intérêt dépend donc moins de votre niveau de conduite que de vos trajets et de votre envie de simplifier les changements de rapport.",
    "strengths": [
      "Démarrages et changements de rapport facilités en circulation",
      "Boîte mécanique et embrayage manuel toujours disponibles",
      "Protection et polyvalence conservées"
    ],
    "weaknesses": [
      "Poids supplémentaire par rapport à la version classique",
      "Système électronique ? contrôler avant achat",
      "Aucun gain de puissance face à la standard"
    ]
  },
  "conclusion": "Nous recommandons la CBR500R E-Clutch surtout à ceux qui alternent ville et balades et veulent conserver le plaisir d'une boîte mécanique sans actionner constamment le levier d'embrayage. Sur un trajet avec beaucoup d'arrêts, son avantage est concret. Pour un usage essentiellement routier, la version standard reste parfaitement pertinente.\n\nNotre conseil est d'essayer les deux motos à la suite. Testez les manoeuvres lentes, les démarrages en côte, les montées et descentes de rapports et le retour à la commande manuelle. C'est la meilleure façon de savoir si l'assistance vous apporte réellement quelque chose.\n\nSur une occasion E-Clutch, ne vous contentez pas d'un essai de quelques minutes : vérifiez l'absence d'alerte au tableau de bord et le fonctionnement régulier du système à froid comme à chaud. En cas de comportement anormal, faites contrôler la moto par Honda avant l'achat.",
  "longevity_tips": [
    "Respecter le programme d'entretien du manuel Honda CBR500RA/RAC 2026 ; ne pas déduire les échéances d'un autre millésime.",
    "Surveiller régulièrement la tension, la lubrification et l'usure de la chaîne, particulièrement après les trajets sous la pluie.",
    "Contrôler les deux freins avant, les pneus et l'état des joints de fourche : le carénage peut masquer certaines traces de chute.",
    "Nettoyer et inspecter les fixations du carénage, les écopes et les supports après une intervention ou une petite chute.",
    "Respecter les consignes Honda propres ? l'E-Clutch et faire examiner tout comportement inhabituel du système avant qu'il ne s'aggrave."
  ],
  "faq": [
    {
      "question": "La CBR500R 2026 est-elle compatible avec le permis A2 €",
      "answer": "Oui. Ses 35 kW correspondent à la limite A2 et aucun bridage de puissance n'est nécessaire."
    },
    {
      "question": "Est-ce une sportive adaptée aux trajets quotidiens ?",
      "answer": "Oui, sa position de conduite reste relativement mesurée et son carénage améliore la protection au vent. Il faut néanmoins essayer le confort de selle et l'appui sur les poignets."
    },
    {
      "question": "L'E-Clutch remplace-t-il la boîte de vitesses ?",
      "answer": "Non. La moto conserve une boîte mécanique à six rapports et un sélecteur. Le système automatise la commande de l'embrayage lorsque le pilote le souhaite."
    }
  ],
  "data_quality": {
    "market": "France ; manuel 2026 européen",
    "model_year": "2026",
    "manufacturer_fr_verified": true,
    "european_manual_verified": true,
    "technical_documentation_verified": true,
    "consumables_verified": false,
    "recall_checked": false,
    "pricing_type": "to_confirm",
    "last_verified": "2026-10-09",
    "sources": [
      {
        "label": "Honda France - CBR500R caractéristiques 2026",
        "type": "official_fr",
        "market": "France",
        "model_year": "2026",
        "url": "https://moto.honda.fr/motorcycles/range/super-sport/cbr500r/specifications-and-price.html",
        "note": "Poids, hauteur de selle, puissance, transmission et équipements."
      },
      {
        "label": "Honda - dossier de presse CBR500R 2026",
        "type": "official_fr",
        "market": "Europe",
        "model_year": "2026",
        "url": "https://hondanews.eu/fr/fr/motorcycles/media/pressreleases/555232/dossier-de-presse-honda-cbr500r-2026",
        "note": "Attention : poids et selle différents de la fiche commerciale Honda France."
      },
      {
        "label": "Auto Trader - essai CBR500R E-Clutch 2026",
        "type": "observed",
        "market": "Royaume-Uni",
        "model_year": "2026",
        "url": "https://www.autotrader.co.uk/bikes/content/honda-cbr500r-review-2026",
        "note": "Évaluation éditoriale de l'ergonomie, de la polyvalence et de l'E-Clutch."
      },
      {
        "label": "Honda - Programme entretien CBR500RA/RAC 2026",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2026",
        "url": "https://webom.hondamotopub.com/webom/HMEE/MLR263/html/GMT004001.html",
        "note": "Calendrier européen officiel, versions standard et E-Clutch."
      },
      {
        "label": "Honda - Spécifications CBR500RA/RAC 2026",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2026",
        "url": "https://webom.hondamotopub.com/webom/HMEE/MLR263/html/GSP002001.html",
        "note": "Fluides, quantités, bougies, pneus et transmission."
      },
      {
        "label": "Revimoto - Kit vidange CBR500R 2013-2026",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.revimoto.fr/products/kit-vidange-entretien-honda-cbr-500-r-2013-2026",
        "note": "44,90 EUR TTC observes le 09/10/2026 : kit 3 L huile Motul, filtre adaptable HF204 et joint. Prix du kit entier, hors pose. Compatibilite declaree par vendeur."
      },
      {
        "label": "Honda Parts - Filtre a air OEM 17211-MKP-J00",
        "type": "official_eu",
        "market": "Europe",
        "model_year": "2024",
        "url": "https://www.honda-parts.eu/eu/motorcycle/parts/air-filter/air-filter-17211-mkp-j00",
        "note": "Affectation constructeur documentee jusqu'en 2024 ; version francaise 2026 E-Clutch encore a verifier."
      },
      {
        "label": "Pieces Honda Moto - pack revision CBR500R, tarifs des fournitures",
        "type": "observed",
        "market": "France",
        "model_year": "2024",
        "url": "https://www.pieces-honda-moto.com/pieces-detachees/151643-pack-revision-48-000-km-pour-honda-cbr500r-annee-2024-pack-cbr500rar-48000km.html",
        "note": "Tarifs observes : huile 22,90 EUR/L, filtre huile 16,86 EUR, filtre air 49,90 EUR, bougies 17,09 EUR/unite. Prix vendeur du pack 2024, pas prix garantis pour 2026."
      },
      {
        "label": "CB500Shop - pack entretien 24000/48000 CBR500R",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cb500shop.com/fr/cb500f/cb500f-2019-2021/entretien/vidange-moteur/1062-pack-entretien-2400048000km-2019.html",
        "note": "Affectation commerciale annoncant la compatibilite avec CBR500R 2026 avec et sans E-Clutch. A recouper avec la nomenclature OEM."
      },
      {
        "label": "Honda OEM - CBR500R 2026 - etriers avant",
        "type": "official_other_market",
        "market": "Amerique du Nord",
        "model_year": "2026",
        "url": "https://www.revzilla.com/oem/honda/2026-honda-cbr500r-abs/front-brake-caliper?submodel=cbr500ra9ac",
        "note": "Reference 06455-MKP-DN1, quantite 2. Affectation europeenne et E-Clutch a confirmer."
      },
      {
        "label": "Honda OEM - CBR500R 2026 - etrier arriere",
        "type": "official_other_market",
        "market": "Amerique du Nord",
        "model_year": "2026",
        "url": "https://www.revzilla.com/oem/honda/2026-honda-cbr500r-abs/rear-brake-caliper?submodel=cbr500ra7ac",
        "note": "Reference 06435-MGZ-J02, quantite 1. Affectation europeenne et E-Clutch a confirmer."
      },
      {
        "label": "CB500Shop - Freinage CBR500R 2024-2026",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cb500shop.com/fr/259-cbr500r/cbr500r-2024-2026/entretien/freinage",
        "note": "Prix commerciaux : plaquettes avant 56,90 EUR/jeu, arriere 57,90 EUR/jeu et DOT4 13,90 EUR/500ml."
      },
      {
        "label": "CB500Shop - Kit chaine Honda CBR500R 2024-2026",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.cb500shop.com/fr/262-cbr500r/cbr500r-2024-2026/entretien/kit-chaine",
        "note": "Kit chaine d'origine 520, 15/41, 148,90 EUR TTC hors pose. Confirmation de numero OEM par VIN toujours requise."
      },
      {
        "label": "Michelin - Pneus compatibles CBR500R 2026",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.michelin.fr/motorbike/browse-tyres/by-vehicle/honda/cbr500r/2026/470/120---70-ZR-17-%2858W%29-F-TL_160---60-ZR-17-%2869W%29-R-TL",
        "note": "Michelin Road 6 et Power 6 proposes aux dimensions 120/70ZR17 (58W) et 160/60ZR17 (69W). Aucun prix deduit."
      },
      {
        "label": "Allopneus - Recherche pneus avant Honda CBR500R",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.allopneus.com/liste/pneu-moto?d1=120&d2=70&d3=17&d4=58&d5=W&vehicleBrandSearch=honda&vehicleRange=cbr500r",
        "note": "Capture utilisateur du 09/10/2026 : Michelin Road 6 avant, 120/70 ZR17 58W, 129,00 EUR TTC hors pose."
      },
      {
        "label": "Allopneus - Recherche pneus arriere Honda CBR500R",
        "type": "observed",
        "market": "France",
        "model_year": "2026",
        "url": "https://www.allopneus.com/liste/pneu-moto?d1=160&d2=60&d3=17&d4=69&d5=W&vehicleBrandSearch=honda&vehicleRange=cbr500r",
        "note": "Capture utilisateur du 09/10/2026 : Michelin Road 6 arriere, 160/60 ZR17 69W, 144,00 EUR TTC hors pose."
      }
    ]
  }
}
  ]
};

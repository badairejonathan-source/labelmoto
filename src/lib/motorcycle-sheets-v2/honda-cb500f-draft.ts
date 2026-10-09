import type { MotorcycleSheetV2 } from "@/lib/motorcycle-sheet-v2";

/**
 * BROUILLON LOCAL - HONDA CB500F 2022
 * Ne pas importer dans registry.ts avant validation.
 * Ne couvre pas automatiquement la CB500 Hornet 2024+.
 * References et operations a verifier avant publication.
 */
export const hondaCb500fDraftV2: MotorcycleSheetV2 = {
  known_issues_v2: [
  {
    "title": "Revision des 24 000 km : la facture qui compte",
    "description": "Sur ce bicylindre Honda, l'echeance des 24 000 km comporte notamment le controle du jeu aux soupapes. Avant d'acheter une moto ayant atteint ce kilometrage, demandez la facture detaillee : une simple vidange ne suffit pas a demontrer que la grande revision a ete effectuee. Si la preuve manque, demandez un devis Honda et integrez-le dans votre negociation.",
    "type": "usage_limitation",
    "confidence": "official_eu"
  },
  {
    "title": "Train avant 2022 et 2024 : inspecter une partie-cycle evoluee",
    "description": "La CB500F 2022 et la Hornet 2024 utilisent une fourche inversee Showa SFF-BP et deux disques de frein avant de 296 mm. Controlez l'absence de fuite aux joints de fourche, l'etat des tubes, des disques et des plaquettes des deux etriers. Des pieces usees ou endommagees peuvent transformer une moto attractive a l'achat en operation couteuse. Ce sont des controles d'occasion, pas des pannes recurrentes etablies.",
    "type": "usage_limitation",
    "confidence": "technical_documentation"
  },
  {
    "title": "Distinguer la vraie Hornet 2024 de l'ancienne CB500F",
    "description": "La Hornet 2024 ajoute notamment un TFT de 5 pouces, RoadSync et le controle de traction HSTC. Verifiez sur place l'affichage, le fonctionnement des commandes et l'absence de voyants d'anomalie. Sur une CB500F 2022, ne cherchez pas ces equipements : concentrez l'essai sur le comportement routier et l'etat mecanique. L'equipement supplementaire ne remplace jamais un bon historique d'entretien.",
    "type": "usage_limitation",
    "confidence": "official_fr"
  },
  {
    "title": "Prix reel de l'occasion : regarder au-dela du kilometrage",
    "description": "Un train de pneus, deux jeux de plaquettes avant et un kit chaine peuvent representer plusieurs centaines d'euros de fournitures, hors montage. Comparez l'etat de ces pieces aux prix des consommables de la fiche. Faites verifier les campagnes de rappel via le VIN par Honda et examinez les factures, les traces de chute et les modifications non d'origine. Le bon achat est celui dont le cout de remise en etat est connu.",
    "type": "usage_limitation",
    "confidence": "technical_documentation"
  }
],
  layout_version: 2,
  hero_subtitle: "Honda CB500F 2022 - brouillon entretien V2",
  data_quality: {
  "market": "Europe - France a confirmer",
  "model_year": "2022",
  "manufacturer_fr_verified": false,
  "european_manual_verified": true,
  "technical_documentation_verified": false,
  "consumables_verified": false,
  "recall_checked": false,
  "pricing_type": "estimate",
  "last_verified": "2026-10-08",
  "sources": [
    {
      "label": "Honda CB500F Owner's Manual 2022",
      "type": "official_eu",
      "market": "Europe",
      "model_year": "2022",
      "url": "https://2rom-prd-data.hondamotopub.com/om/HMEE/CB500F/2022/CB500F_32MKPA200_0.pdf",
      "note": "Manuel constructeur pour la generation 2022. Les correspondances 2024+ ne sont pas etablies."
    }
  ]
},
  budget: {
  "title": "Budget entretien - estimation a confirmer",
  "note": "Les tarifs de la fiche historique Label Moto ne sont pas encore verifies. Aucun cout chiffre n'est valide dans ce brouillon."
},
  faq: [
  {
    "question": "Quand faut-il effectuer les révisions de la Honda CB500F 2022 ?",
    "answer": "Le manuel européen Honda prévoit une première intervention à 1 000 km, puis des échéances à 12 000, 24 000, 36 000 et 48 000 km. Plusieurs opérations ont aussi une limite calendaire. Le programme complet du manuel reste la référence."
  },
  {
    "question": "Quelle huile moteur utiliser et en quelle quantité ?",
    "answer": "Pour la CB500F 2022, Honda indique une huile SAE 10W-30 conforme aux spécifications du manuel. La quantité est de 2,5 litres après vidange seule et de 2,7 litres lorsque le filtre à huile est remplacé. Les 3,2 litres correspondent à une capacité après démontage."
  },
  {
    "question": "Combien coûte une révision de Honda CB500F ?",
    "answer": "Le tarif dépend du kilométrage, des opérations effectivement réalisées, du concessionnaire et des tarifs locaux. Les anciens montants de Label Moto sont des estimations non encore vérifiées. Demandez un devis détaillé pour la révision concernée."
  },
  {
    "question": "La Honda CB500F 2022 est-elle fiable ?",
    "answer": "La CB500F utilise un bicylindre de 471 cm3 reconnu pour sa polyvalence. Toutefois, aucune durée de vie précise ni absence garantie de panne ne peut être affirmée. L'historique d'entretien et l'état du véhicule restent essentiels, particulièrement à l'achat d'occasion."
  }
],
  longevity_tips: [
  "Respecter le programme d'entretien Honda CB500F 2022 et les échéances calendaires indiquées dans le manuel.",
  "Utiliser une huile SAE 10W-30 répondant aux exigences Honda ; prévoir 2,7 litres lors d'une vidange avec remplacement du filtre.",
  "Inspecter et entretenir la chaîne au minimum tous les 1 000 km et davantage selon les conditions d'utilisation.",
  "Contrôler régulièrement les pneumatiques, les freins, la tension de chaîne et les niveaux de fluides.",
  "Conserver les factures, le carnet d'entretien et les justificatifs des opérations effectuées."
],
  quick_facts: [
  {
    "label": "Modèle",
    "value": "Honda CB500F 2022"
  },
  {
    "label": "Cylindrée",
    "value": "471 cm³"
  },
  {
    "label": "Puissance",
    "value": "35 kW (47,6 ch)"
  },
  {
    "label": "Permis",
    "value": "A2, sans bridage"
  },
  {
    "label": "Poids tous pleins faits",
    "value": "189 kg"
  },
  {
    "label": "Hauteur de selle",
    "value": "785 mm"
  },
  {
    "label": "Réservoir",
    "value": "17,1 L"
  },
  {
    "label": "Norme",
    "value": "Euro 5"
  }
],
  quick_maintenance: [
  {
    "label": "Vidange moteur",
    "value": "12 000 km ou selon la limite calendaire du manuel 2022"
  },
  {
    "label": "Huile moteur",
    "value": "SAE 10W-30, JASO MA"
  },
  {
    "label": "Huile avec filtre",
    "value": "2,7 L"
  },
  {
    "label": "Liquide de frein",
    "value": "DOT 4, remplacement tous les 2 ans"
  },
  {
    "label": "Liquide de refroidissement",
    "value": "Remplacement tous les 3 ans"
  }
],
  maintenance_details: [
  {
    "id": "moteur",
    "title": "Moteur et lubrification",
    "summary": "Honda CB500F 2022 uniquement",
    "rows": [
      {
        "label": "Architecture",
        "value": "Bicylindre en ligne, 471 cm³"
      },
      {
        "label": "Huile",
        "value": "SAE 10W-30, JASO MA"
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
        "label": "Capacité après démontage",
        "value": "3,2 L"
      },
      {
        "label": "Bougie",
        "value": "NGK CPR8EA-9"
      }
    ]
  },
  {
    "id": "partie-cycle",
    "title": "Partie-cycle et transmission",
    "summary": "Caractéristiques de la CB500F 2022",
    "rows": [
      {
        "label": "Cadre",
        "value": "Type diamant, acier"
      },
      {
        "label": "Pneu avant",
        "value": "120/70ZR17M/C (58W)"
      },
      {
        "label": "Pneu arrière",
        "value": "160/60ZR17M/C (69W)"
      },
      {
        "label": "Chaîne",
        "value": "520, 112 maillons"
      },
      {
        "label": "Pignon / couronne",
        "value": "15 / 41 dents"
      },
      {
        "label": "Flèche de chaîne",
        "value": "25 à 35 mm"
      }
    ]
  }
],
  warranty: {
  "duration": "Jusqu'à 5 ans pour une moto neuve éligible au dispositif Honda France de 2022",
  "coverage": "2 ans de garantie constructeur suivis de 3 ans de garantie Honda France, sous conditions.",
  "maintenance_requirement": "Respect du programme d'entretien constructeur et des conditions du carnet de garantie.",
  "claim_requirement": "Vérifier la date de première immatriculation, l'historique d'entretien et l'éligibilité du véhicule.",
  "legal_warranty_note": "Dispositif historique applicable aux motos éligibles ; ne préjuge pas de la garantie encore active sur une occasion.",
  "market": "France",
  "source_label": "Honda France - Garantie 5 ans (dispositif historique)"
},
  verdict: {
  "title": "Honda CB500F 2022 : un roadster A2 polyvalent",
  "text": "La CB500F 2022 privilégie une conduite accessible, un moteur progressif et une position naturelle. Elle convient particulièrement aux trajets quotidiens et à la progression en permis A2. Ce jugement est éditorial, fondé sur les caractéristiques et les essais ; il ne constitue pas une notation statistique de fiabilité.",
  "strengths": [
    "Puissance adaptée au permis A2 sans bridage",
    "Position de conduite polyvalente",
    "Partie-cycle revue sur le millésime 2022"
  ],
  "weaknesses": [
    "Puissance limitée pour les pilotes recherchant davantage de performances",
    "Équipement de bord relativement simple pour sa catégorie"
  ]
},
  variants: [
    {
      conclusion: "Notre choix pour une premiere A2 d'occasion est une CB500F 2022 bien suivie plutot qu'une Hornet plus recente mais mal entretenue. La fourche Showa et le double disque avant lui donnent deja une partie-cycle serieuse ; vous ne perdez donc pas l'essentiel de la qualite routiere en renoncant au TFT ou au controle de traction de 2024. En revanche, ne payez pas une prime pour le seul logo Honda : a partir de 24 000 km, exigez la preuve de la revision majeure, puis examinez pneus, freins et transmission. Si l'usage est surtout urbain, periurbain et sur routes secondaires, c'est une proposition coherente. Si vous roulez souvent en duo charge ou sur autoroute, essayez-la suffisamment longtemps avant de vous decider.",
      label: "CB500F 2022",
      quick_facts: [
      {
    "label": "Modèle",
    "value": "Honda CB500F 2022"
  },
      {
    "label": "Cylindrée",
    "value": "471 cm³"
  },
      {
    "label": "Puissance",
    "value": "35 kW (47,6 ch)"
  },
      {
    "label": "Poids tous pleins faits",
    "value": "189 kg"
  },
      {
    "label": "Hauteur de selle",
    "value": "785 mm"
  },
      {
    "label": "Réservoir",
    "value": "17,1 L"
  },
      {
    "label": "Norme",
    "value": "Euro 5"
  },
      {
    "label": "Permis",
    "value": "A2, sans bridage"
  }
    ],
      service_schedule_v2: [
  {
    "km": 1000,
    "title": "Entretien des 1 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      }
    ],
        price_estimate: "130 € - 210 €",
        price_type: "estimate",
  },
  {
    "km": 12000,
    "title": "Entretien des 12 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      },
      {
        "label": "Controles periodiques"
      }
    ],
        price_estimate: "190 € - 300 €",
        price_type: "estimate",
  },
  {
    "km": 24000,
    "title": "Entretien des 24 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      },
      {
        "label": "Remplacement filtre huile"
      },
      {
        "label": "Remplacement filtre air"
      },
      {
        "label": "Remplacement bougies"
      },
      {
        "label": "Controle jeu aux soupapes"
      },
      {
        "label": "Controles periodiques"
      }
    ],
        price_estimate: "430 € - 650 €",
        price_type: "estimate",
  },
  {
    "km": 36000,
    "title": "Entretien des 36 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      },
      {
        "label": "Controles periodiques"
      }
    ],
        price_estimate: "190 € - 300 €",
        price_type: "estimate",
  },
  {
    "km": 48000,
    "title": "Entretien des 48 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      },
      {
        "label": "Remplacement filtre huile"
      },
      {
        "label": "Remplacement filtre air"
      },
      {
        "label": "Remplacement bougies"
      },
      {
        "label": "Controle jeu aux soupapes"
      },
      {
        "label": "Controles periodiques"
      }
    ],
        price_estimate: "430 € - 650 €",
        price_type: "estimate",
  }
],
      consumables_v2: [
  {
    "part": "Huile moteur",
    "specification": "SAE 10W-30, JASO MA, API SJ ou superieur selon restrictions du manuel",
    "replacement_interval": "12 000 km ou 12 mois",
    "note": "CB500F 2022 : 2,7 L avec remplacement du filtre. Verification par millesime requise.",
        observed_price: "22,90 EUR/ litre",
  },
  {
    "part": "Filtre a huile",
    "specification": "Honda 15410-MFJ-D02",
    "reference_oem": "15410-MFJ-D02",
    "replacement_interval": "Selon programme d'entretien Honda CB500F 2022",
    "note": "Verifier les eventuelles references de remplacement constructeur.",
        observed_price: "16,86 EUR / unite",
  },
  {
    "part": "Filtre a air",
    "specification": "Honda 17211-MKP-J00",
    "reference_oem": "17211-MKP-J00",
    "replacement_interval": "Selon programme d'entretien Honda CB500F 2022",
    "note": "Reference a ne pas generaliser aux autres generations.",
        observed_price: "49,90 EUR / unite",
  },
  {
    "part": "Bougies",
    "specification": "NGK CPR8EA-9",
    "replacement_interval": "Selon programme d'entretien Honda CB500F 2022",
    "note": "Reference NGK, et non reference OEM Honda.",
        observed_price: "17,09 EUR / unite",
  },
  {
      replacement_interval: "Selon usure et etat des pneus",
    "part": "Pneumatiques",
    "specification": "Avant 120/70ZR17M/C (58W) ; arriere 160/60ZR17M/C (69W)",
    "note": "Verifier indices, homologation et monte conforme au manuel.",
        observed_price: "Michelin Road 6 : avant 129,00 EUR ; arriere 159,90 EUR (hors montage)",
        price_source_url: "https://www.allopneus.com/produit/pneu-moto/michelin/sport-route/road-6/120-70r17-58-w/0005944314",
  },
  {
      replacement_interval: "Selon usure ; controle et lubrification tous les 1 000 km",
    "part": "Kit chaine",
    "specification": "520, 112 maillons, pignon 15 dents, couronne 41 dents",
    "note": "Reference commerciale du kit complet non verifiee.",
      observed_price: "265,90 EUR / kit TTC (hors montage)",
      price_source_url: "https://www.cb500shop.com/en/cb500x/cb500x-2022-2023/honda-parts/688-original-chain-kit-for-honda-2022.html",
      price_note: "Kit Honda 06406-MKP-DN0, montage CB500F 2022 confirme. Verifier la disponibilite et la longueur de chaine avant commande.",
  },
  {
    "part": "Liquide de frein",
    "specification": "DOT 4",
    "replacement_interval": "Tous les 2 ans",
      observed_price: "11,44 EUR / 500 ml TTC (Motul DOT 4 LV)",
      price_source_url: "https://gmoto.fr/motul-dot4-lv-liquide-de-frein-500ml%2C650965.html",
      price_note: "Exemple de produit DOT 4 disponible dans le commerce, hors livraison et main-d'oeuvre ; non OEM Honda.",
  },
  {
      observed_price: "13,41 EUR TTC / 1 L (Motul Motocool Factory Line -35, ref. 111034 ; alternative compatible selon distributeur, prix promotionnel observe, hors main-d'oeuvre)",
    "part": "Liquide de refroidissement",
    "specification": "Pro Honda HP Coolant",
    "replacement_interval": "Tous les 3 ans",
    "note": "Capacite totale du circuit : 1.32 L."
  }
,
    {
  "part": "Plaquettes avant",
  "specification": "Honda 06455-MKP-DN1 ; 2 jeux pour les 2 etriers avant",
  "reference_oem": "06455-MKP-DN1",
  "replacement_interval": "Selon usure, controle au programme constructeur",
  "observed_price": "58,20 EUR / jeu ; 116,40 EUR les 2 jeux (hors montage)",
  "source_type": "official_fr",
  "note": "Prix releve sur catalogue Honda CB500FAN 2022. Deux jeux avant. Prix et disponibilite a recontroler.",
  "price_source_url": "https://www.pieces-honda-moto.com/cb500f-GRAND-PRIX-RED-R380-2022/cb500fan/371275-etrier-de-frein-avant-cb500fan-p/"
}
,
    {
  "part": "Plaquettes arriere",
  "specification": "Honda 06435-MGZ-J02 ; 1 jeu arriere",
  "reference_oem": "06435-MGZ-J02",
  "replacement_interval": "Selon usure",
  "observed_price": "87,49 EUR / jeu TTC (catalogue Honda Irlande)",
  "source_type": "official_eu",
  "note": "Montage confirme pour CB500FAN 2022. Tarif catalogue Irlande, non tarif France ; hors montage.",
  "price_source_url": "https://www.bike-parts-honda.ie/honda-motorcycle/500-MOTO/CB/2022/CB500FAN/Frame/REAR-BRAKE-CALIPER/104103/F_17/2/42995"
}
],
      warranty: {
  "duration": "Jusqu'à 5 ans pour une moto neuve éligible au dispositif Honda France de 2022",
  "coverage": "2 ans de garantie constructeur suivis de 3 ans de garantie Honda France, sous conditions.",
  "maintenance_requirement": "Respect du programme d'entretien constructeur et des conditions du carnet de garantie.",
  "claim_requirement": "Vérifier la date de première immatriculation, l'historique d'entretien et l'éligibilité du véhicule.",
  "legal_warranty_note": "Dispositif historique applicable aux motos éligibles ; ne préjuge pas de la garantie encore active sur une occasion.",
  "market": "France",
  "source_label": "Honda France - Garantie 5 ans (dispositif historique)"
},
      verdict: {
  "title": "Honda CB500F 2022 : une A2 plus aboutie qu'une simple moto d'ecole",
  "text": "La CB500F 2022 merite mieux que sa reputation de roadster raisonnable. Honda a serieusement fait evoluer son train avant : fourche inversee Showa SFF-BP de 41 mm, double disque de 296 mm, nouvelles jantes et bras oscillant revu. Sur route, le resultat est une moto accessible sans etre approximative, qui permet d'apprendre les trajectoires et de profiter des virages bien apres l'obtention du permis. Le bicylindre de 471 cm3 est souple et exploitable, avec les 35 kW autorises en A2 sans bridage. Sa limite n'est pas un manque de competence, mais son temperament : il faut accepter de jouer de la boite pour relancer franchement, et l'absence de protection aerodynamique fatigue davantage sur autoroute. Pour les trajets quotidiens et les petites routes, l'equilibre est convaincant ; pour le grand tourisme rapide ou les fortes accelerations, il existe des motos plus adaptees.",
  "strengths": [
    "Partie-cycle et freinage nettement ameliores en 2022",
    "Moteur de 35 kW exploitable sans bridage A2",
    "Agilite et comportement rassurants sur route"
  ],
  "weaknesses": [
    "Protection au vent limitee pour les longs trajets rapides",
    "Relances sportives exigeant de retrograder",
    "Instrumentation moins moderne que la Hornet 2024"
  ]
},
      faq: [
  {
    "question": "Quand faut-il effectuer les révisions de la Honda CB500F 2022 ?",
    "answer": "Le manuel européen Honda prévoit une première intervention à 1 000 km, puis des échéances à 12 000, 24 000, 36 000 et 48 000 km. Plusieurs opérations ont aussi une limite calendaire. Le programme complet du manuel reste la référence."
  },
  {
    "question": "Quelle huile moteur utiliser et en quelle quantité ?",
    "answer": "Pour la CB500F 2022, Honda indique une huile SAE 10W-30 conforme aux spécifications du manuel. La quantité est de 2,5 litres après vidange seule et de 2,7 litres lorsque le filtre à huile est remplacé. Les 3,2 litres correspondent à une capacité après démontage."
  },
  {
    "question": "Combien coûte une révision de Honda CB500F ?",
    "answer": "Le tarif dépend du kilométrage, des opérations effectivement réalisées, du concessionnaire et des tarifs locaux. Les anciens montants de Label Moto sont des estimations non encore vérifiées. Demandez un devis détaillé pour la révision concernée."
  },
  {
    "question": "La Honda CB500F 2022 est-elle fiable ?",
    "answer": "La CB500F utilise un bicylindre de 471 cm3 reconnu pour sa polyvalence. Toutefois, aucune durée de vie précise ni absence garantie de panne ne peut être affirmée. L'historique d'entretien et l'état du véhicule restent essentiels, particulièrement à l'achat d'occasion."
  }
],
      longevity_tips: [
  "Respecter le programme d'entretien Honda CB500F 2022 et les échéances calendaires indiquées dans le manuel.",
  "Utiliser une huile SAE 10W-30 répondant aux exigences Honda ; prévoir 2,7 litres lors d'une vidange avec remplacement du filtre.",
  "Inspecter et entretenir la chaîne au minimum tous les 1 000 km et davantage selon les conditions d'utilisation.",
  "Contrôler régulièrement les pneumatiques, les freins, la tension de chaîne et les niveaux de fluides.",
  "Conserver les factures, le carnet d'entretien et les justificatifs des opérations effectuées."
],
      data_quality: {
  "market": "Europe - France a confirmer",
  "model_year": "2022",
  "manufacturer_fr_verified": false,
  "european_manual_verified": true,
  "technical_documentation_verified": false,
  "consumables_verified": false,
  "recall_checked": false,
  "pricing_type": "estimate",
  "last_verified": "2026-10-08",
  "sources": [
    {
      "label": "Honda CB500F Owner's Manual 2022",
      "type": "official_eu",
      "market": "Europe",
      "model_year": "2022",
      "url": "https://2rom-prd-data.hondamotopub.com/om/HMEE/CB500F/2022/CB500F_32MKPA200_0.pdf",
      "note": "Manuel constructeur pour la generation 2022. Les correspondances 2024+ ne sont pas etablies."
    }
  ]
},
      budget: {
  "title": "Budget entretien a 30 000 km - CB500F 2022",
  "summary": {
    "horizon_km": 30000,
    "total_cost": "750 € - 1 160 €",
    "cost_per_km": "0,025 - 0,039 €/km",
    "interval_rule": "Revisions des 1 000, 12 000 et 24 000 km, pieces et main-d'oeuvre incluses dans les estimations.",
    "note": "Estimation editoriale Label Moto, non devis constructeur. Hors pneus, plaquettes, kit chaine, reparations et interventions calendaires supplementaires."
  },
  "note": "Fourchettes indicatives non confirmees par devis d'ateliers francais. A actualiser avant publication."
},
      maintenance_details: [
  {
    "id": "huile",
    "title": "Huile moteur & filtre",
    "summary": "SAE 10W-30 ; 2,7 L avec filtre",
    "rows": [
      {
        "label": "Moto",
        "value": "Honda CB500F 2022"
      },
      {
        "label": "Huile moteur",
        "value": "SAE 10W-30 ; JASO MA"
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
        "label": "Filtre a huile",
        "value": "Honda 15410-MFJ-D02",
        "confidence": "to_confirm"
      },
      {
        "label": "Entretien",
        "value": "Selon programme Honda 2022"
      }
    ],
    "note": "Prix d'huile indique au litre ; une vidange complete implique plusieurs litres et la main-d'oeuvre."
  },
  {
    "id": "air",
    "title": "Filtre a air",
    "summary": "Controle periodique ; remplacement selon programme constructeur",
    "rows": [
      {
        "label": "Reference candidate",
        "value": "Honda 17211-MKP-J00",
        "confidence": "to_confirm"
      },
      {
        "label": "Entretien",
        "value": "Remplacement a 24 000 et 48 000 km selon dossier manuel"
      },
      {
        "label": "Conditions difficiles",
        "value": "Controle plus frequent en milieu humide ou poussiereux"
      }
    ],
    "note": "Reference de piece a reconfirmer pour la variante francaise."
  },
  {
    "id": "bougie",
    "title": "Bougies",
    "summary": "NGK CPR8EA-9 ; ecartement selon manuel",
    "rows": [
      {
        "label": "Reference",
        "value": "NGK CPR8EA-9"
      },
      {
        "label": "Quantite",
        "value": "2 bougies"
      },
      {
        "label": "Ecartement",
        "value": "0,8 a 0,9 mm"
      },
      {
        "label": "Entretien",
        "value": "Selon programme constructeur, controle/remplacement a verifier par operation"
      }
    ]
  },
  {
    "id": "soupapes",
    "title": "Jeu aux soupapes",
    "summary": "Controle a 24 000 et 48 000 km",
    "rows": [
      {
        "label": "Operation",
        "value": "Controle du jeu aux soupapes"
      },
      {
        "label": "Echeances",
        "value": "24 000 et 48 000 km"
      },
      {
        "label": "Tarif",
        "value": "Inclus dans l'estimation de grosse revision, sans prix isole valide"
      }
    ],
    "note": "Les valeurs et procedures de reglage doivent etre consultees dans la documentation atelier Honda."
  },
  {
    "id": "refroidissement",
    "title": "Liquide de refroidissement",
    "summary": "Liquide compatible Honda ; remplacement tous les 3 ans",
    "rows": [
      {
        "label": "Produit",
        "value": "Pro Honda HP Coolant"
      },
      {
        "label": "Capacite circuit",
        "value": "1,32 L"
      },
      {
        "label": "Periodicite",
        "value": "Tous les 3 ans"
      }
    ],
    "note": "Ne pas assimiler la capacite totale du circuit a la quantite obligatoirement vendue."
  },
  {
    "id": "freinage",
    "title": "Freinage & liquide de frein",
    "summary": "DOT 4 ; liquide tous les 2 ans ; plaquettes selon usure",
    "rows": [
      {
        "label": "Liquide",
        "value": "DOT 4"
      },
      {
        "label": "Remplacement liquide",
        "value": "Tous les 2 ans"
      },
      {
        "label": "Plaquettes",
        "value": "Controle de l'usure et des disques"
      },
      {
        "label": "References OEM",
        "value": "References exactes avant et arriere a confirmer",
        "confidence": "to_confirm"
      }
    ],
    "note": "Les prix des plaquettes doivent correspondre au nombre exact de jeux necessaires, hors montage."
  },
  {
    "id": "pneus",
    "title": "Pneus & pressions",
    "summary": "120/70 ZR17 avant ; 160/60 ZR17 arriere",
    "rows": [
      {
        "label": "Pneu avant",
        "value": "120/70 ZR17 avant"
      },
      {
        "label": "Pneu arriere",
        "value": "160/60 ZR17 arriere"
      },
      {
        "label": "Pression avant a froid",
        "value": "2,5 bar"
      },
      {
        "label": "Pression arriere a froid",
        "value": "2,9 bar"
      },
      {
        "label": "Tarif commercial",
        "value": "Michelin Road 6 : 129 EUR avant ; 159,90 EUR arriere"
      }
    ],
    "note": "Les prix concernent un exemple de train Michelin Road 6, hors montage, a revalider avant publication."
  },
  {
    "id": "chaine",
    "title": "Chaine & transmission",
    "summary": "Inspection et lubrification tous les 1 000 km",
    "rows": [
      {
        "label": "Transmission",
        "value": "520, 112 maillons ; 15 / 41 dents"
      },
      {
        "label": "Fleche de chaine",
        "value": "25 a 35 mm"
      },
      {
        "label": "Entretien",
        "value": "Tous les 1 000 km ; adapter selon utilisation"
      },
      {
        "label": "Kit complet",
        "value": "Reference OEM complete a confirmer",
        "confidence": "to_confirm"
      }
    ],
    "note": "Le prix du kit de transmission complet et son montage restent a documenter pour chaque generation."
  }
]
    },
    {
      conclusion: "Nous recommandons la CB500 Hornet 2024 si vous recherchez un roadster A2 a conserver, avec une interface moderne et un controle de traction, plutot qu'une simple moto de transition avant le permis A. Mais n'achetez pas le nom Hornet en imaginant les accelerations d'une CB750 : la puissance reste de 35 kW. Avant de signer, comparez une CB500F 2022 equivalente en kilometrage et historique ; si la difference de prix est importante, le TFT et le HSTC ne suffisent pas a eux seuls a compenser une moto moins bien entretenue. Sur l'exemplaire choisi, faites un essai assez long pour juger confort, reprises et exposition au vent, puis controlez le programme d'entretien, les pneus, les freins et les aides electroniques.",
      label: "CB500 Hornet 2024",
      quick_facts: [
      {
    "label": "Modèle",
    "value": "Honda CB500 Hornet 2024"
  },
      {
    "label": "Cylindrée",
    "value": "471 cm³"
  },
      {
    "label": "Puissance",
    "value": "35 kW (47,6 ch)"
  },
      {
    "label": "Poids tous pleins faits",
    "value": "188 kg"
  },
      {
    "label": "Hauteur de selle",
    "value": "785 mm"
  },
      {
    "label": "Réservoir",
    "value": "17,1 L"
  },
      {
    "label": "Norme",
    "value": "Euro 5"
  },
      {
    "label": "Permis",
    "value": "A2, sans bridage"
  }
    ],
      service_schedule_v2: [
  {
    "km": 1000,
    "title": "Entretien des 1000 km - CB500 Hornet 2024",
    "operations": [
      {
        "label": "Remplacement huile moteur",
        "source_type": "official_eu"
      },
      {
        "label": "Remplacement filtre huile",
        "source_type": "official_eu"
      },
      {
        "label": "Diagnostic Honda",
        "source_type": "official_eu"
      }
    ],
    "note": "Manuel Honda 32MLRA00, CB500FA 2024. Consulter le programme complet et les limites calendaires.",
        price_estimate: "140 € - 220 €",
        price_type: "estimate",
  },
  {
    "km": 12000,
    "title": "Entretien des 12000 km - CB500 Hornet 2024",
    "operations": [
      {
        "label": "Remplacement huile moteur",
        "source_type": "official_eu"
      },
      {
        "label": "Controles periodiques",
        "source_type": "official_eu"
      }
    ],
    "note": "Manuel Honda 32MLRA00, CB500FA 2024. Consulter le programme complet et les limites calendaires.",
        price_estimate: "200 € - 310 €",
        price_type: "estimate",
  },
  {
    "km": 24000,
    "title": "Entretien des 24000 km - CB500 Hornet 2024",
    "operations": [
      {
        "label": "Remplacement huile moteur",
        "source_type": "official_eu"
      },
      {
        "label": "Remplacement filtre huile",
        "source_type": "official_eu"
      },
      {
        "label": "Remplacement filtre air",
        "source_type": "official_eu"
      },
      {
        "label": "Remplacement bougies",
        "source_type": "official_eu"
      },
      {
        "label": "Controle jeu aux soupapes",
        "source_type": "official_eu"
      },
      {
        "label": "Controles periodiques",
        "source_type": "official_eu"
      }
    ],
    "note": "Manuel Honda 32MLRA00, CB500FA 2024. Consulter le programme complet et les limites calendaires.",
        price_estimate: "450 € - 680 €",
        price_type: "estimate",
  },
  {
    "km": 36000,
    "title": "Entretien des 36000 km - CB500 Hornet 2024",
    "operations": [
      {
        "label": "Remplacement huile moteur",
        "source_type": "official_eu"
      },
      {
        "label": "Controles periodiques",
        "source_type": "official_eu"
      }
    ],
    "note": "Manuel Honda 32MLRA00, CB500FA 2024. Consulter le programme complet et les limites calendaires.",
        price_estimate: "200 € - 310 €",
        price_type: "estimate",
  },
  {
    "km": 48000,
    "title": "Entretien des 48000 km - CB500 Hornet 2024",
    "operations": [
      {
        "label": "Remplacement huile moteur",
        "source_type": "official_eu"
      },
      {
        "label": "Remplacement filtre huile",
        "source_type": "official_eu"
      },
      {
        "label": "Remplacement filtre air",
        "source_type": "official_eu"
      },
      {
        "label": "Remplacement bougies",
        "source_type": "official_eu"
      },
      {
        "label": "Controle jeu aux soupapes",
        "source_type": "official_eu"
      },
      {
        "label": "Controles periodiques",
        "source_type": "official_eu"
      }
    ],
    "note": "Manuel Honda 32MLRA00, CB500FA 2024. Consulter le programme complet et les limites calendaires.",
        price_estimate: "450 € - 680 €",
        price_type: "estimate",
  }
],
      consumables_v2: [
  {
    "part": "Huile moteur",
    "specification": "SAE 10W-30, JASO MA ; 2,7 L avec filtre",
    "replacement_interval": "Selon programme Honda 2024",
    "source_type": "official_eu",
    "note": "Manuel 32MLRA00. Respecter aussi les exigences API et les exclusions constructeur.",
        observed_price: "22,90 EUR/ litre",
  },
  {
      replacement_interval: "Remplacement aux 1 000, 24 000 et 48 000 km selon programme 2024",
    "part": "Filtre a huile",
    "specification": "Honda 15410-MFJ-D02",
    "reference_oem": "15410-MFJ-D02",
    "source_type": "to_confirm",
    "note": "Compatibilite exacte de la variante francaise et substitutions constructeur a confirmer.",
        observed_price: "16,86 EUR / unite",
  },
  {
      replacement_interval: "Remplacement aux 24 000 et 48 000 km selon programme 2024",
    "part": "Filtre a air",
    "specification": "Honda 17211-MKP-J00",
    "reference_oem": "17211-MKP-J00",
    "source_type": "to_confirm",
    "note": "Compatibilite exacte de la variante francaise et substitutions constructeur a confirmer.",
        observed_price: "49,90 EUR / unite",
  },
  {
      replacement_interval: "Remplacement aux 24 000 et 48 000 km selon programme 2024",
    "part": "Bougies",
    "specification": "NGK CPR8EA-9",
    "source_type": "official_eu",
    "note": "Reference NGK, pas un numero OEM Honda.",
        observed_price: "17,09 EUR / unite",
  },
  {
      replacement_interval: "Selon usure ; controle periodique",
    "part": "Plaquettes avant",
    "specification": "Honda 06455-MKP-DN1 ; reference confirmee pour CB500 Hornet 2024 CB500FAR",
    "source_type": "to_confirm",
    "note": "Compatibilite exacte de la variante francaise et substitutions constructeur a confirmer.",
      observed_price: "58,20 EUR / jeu ; 116,40 EUR les 2 jeux (hors montage)",
      price_source_url: "https://www.pieces-honda-moto.com/cb500f-GRAND-PRIX-RED-R380-2022/cb500fan/371275-etrier-de-frein-avant-cb500fan-p/",
      price_note: "Prix releve pour cette reference Honda dans le catalogue 2022 ; reference retrouvee en 2024. Confirmer le tarif 2024 avant publication.",
  },
  {
      replacement_interval: "Selon usure ; controle periodique",
    "part": "Plaquettes arriere",
    "specification": "Reference candidate Honda 06435-MGZ-J02",
    "source_type": "to_confirm",
    "note": "Compatibilite exacte de la variante francaise et substitutions constructeur a confirmer.",
      observed_price: "87,49 EUR / jeu TTC (catalogue Honda Irlande)",
      price_source_url: "https://www.bike-parts-honda.ie/honda-motorcycle/500-MOTO/CB/2024/CB500FAR/Frame/REAR-BRAKE-CALIPER/109265/F17/2/51410",
      price_note: "Montage Honda CB500FAR 2024 confirme. Prix catalogue Irlande, non devis France.",
  },
  {
      replacement_interval: "Selon usure ; controle et lubrification tous les 1 000 km",
    "part": "Kit chaine",
    "specification": "Kit Honda 06406-MLR-D00 ; reference confirmee pour CB500 Hornet 2024 CB500FAR ; chaine 520, 112 maillons, transmission 15/41",
    "source_type": "to_confirm",
    "note": "Reference de kit complet non validee pour toutes les variantes France.",
      observed_price: "147,80 EUR / kit (hors montage)",
      price_source_url: "https://www.pieces-honda-moto.com/hornet-500-GRAND-PRIX-RED-R380-2024/cb500far/491267-bras-oscillant/",
      price_note: "Prix de vente releve pour CB500FAR 2024. Recontrole necessaire avant publication.",
  },
  {
    "part": "Liquide de frein",
    "specification": "DOT 4",
    "replacement_interval": "Tous les 2 ans",
    "source_type": "official_eu",
      observed_price: "11,44 EUR / 500 ml TTC (Motul DOT 4 LV)",
      price_source_url: "https://gmoto.fr/motul-dot4-lv-liquide-de-frein-500ml%2C650965.html",
      price_note: "Exemple de produit DOT 4 disponible dans le commerce, hors livraison et main-d'oeuvre ; non OEM Honda.",
  },
  {
      observed_price: "13,41 EUR TTC / 1 L (Motul Motocool Factory Line -35, ref. 111034 ; alternative compatible selon distributeur, prix promotionnel observe, hors main-d'oeuvre)",
    "part": "Liquide de refroidissement",
    "specification": "Pro Honda HP Coolant",
    "replacement_interval": "Tous les 3 ans",
    "source_type": "official_eu"
  },
  {
      replacement_interval: "Selon usure et etat des pneus",
    "part": "Pneumatiques",
    "specification": "Avant 120/70 ZR17 ; arriere 160/60 ZR17",
    "source_type": "official_eu",
    "note": "Respecter les indices de charge et de vitesse du manuel.",
        observed_price: "Michelin Road 6 : avant 129,00 EUR ; arriere 159,90 EUR (hors montage)",
        price_source_url: "https://www.allopneus.com/produit/pneu-moto/michelin/sport-route/road-6/120-70r17-58-w/0005944314",
  }
],
      warranty: {
  "duration": "Jusqu'a 5 ans pour une Honda neuve eligible au dispositif Honda France 2024",
  "market": "France - selon eligibilite du vehicule",
  "coverage": "Dispositif historique : 2 ans de garantie constructeur suivis de 3 ans de garantie Honda France, sous conditions. La couverture depend notamment de la commercialisation et de l'immatriculation du vehicule dans le reseau concerne. Elle ne se renouvelle pas automatiquement lors d'un achat d'occasion.",
  "maintenance_requirement": "Respecter le programme Honda et conserver les justificatifs d'entretien et les documents contractuels.",
  "claim_requirement": "Verifier la date de premiere immatriculation, le carnet de garantie et l'eligibilite effective aupres de Honda avec le VIN.",
  "source_label": "Honda France - Garantie 5 ans historique (vehicules eligible 2024)"
},
      verdict: {
  "title": "Honda CB500 Hornet 2024 : une CB500 plus moderne, pas une mini-CB750",
  "text": "La CB500 Hornet 2024 change de style et gagne surtout en sophistication. Son nouveau TFT de 5 pouces, la connectivite RoadSync, le HSTC et la cartographie moteur revue apportent une experience plus actuelle au quotidien. Honda conserve pourtant l'essentiel de la recette CB500 : un bicylindre de 471 cm3 limite a 35 kW, une fourche Showa SFF-BP et deux disques avant. Le comportement reste donc celui d'un roadster A2 equilibre, pas celui d'une grosse Hornet reduite. Le controle de traction apporte un complement electronique utile, mais ne transforme ni l'adhesion des pneus ni les performances moteur. Ce millesime nous parait particulierement pertinent pour qui souhaite garder plusieurs annees une A2 bien equipee. En revanche, l'ecart de prix avec une CB500F 2022 doit se justifier par son etat, son historique et les equipements que vous utiliserez reellement.",
  "strengths": [
    "TFT 5 pouces et RoadSync mieux adaptes aux usages quotidiens",
    "HSTC de serie et cartographie moteur revue",
    "Partie-cycle Showa et double freinage avant conserves"
  ],
  "weaknesses": [
    "Toujours 35 kW : pas de bond de performances",
    "Protection au vent limitee comme sur tout roadster nu",
    "Surcout eventuel par rapport a une CB500F 2022 a justifier"
  ]
},
      faq: [
  {
    "question": "Quel permis faut-il pour la CB500 Hornet 2024 ?",
    "answer": "La puissance annoncee de 35 kW permet son utilisation avec le permis A2 sans bridage de puissance."
  },
  {
    "question": "Quand entretenir la CB500 Hornet 2024 ?",
    "answer": "Le manuel Honda 32MLRA00 presente des echeances a 1 000, 12 000, 24 000, 36 000 et 48 000 km, ainsi que des operations soumises a une limite calendaire."
  },
  {
    "question": "Quel budget d'entretien prevoir jusqu'a 30 000 km ?",
    "answer": "Les prix des revisions et consommables restent a documenter. Le budget devra distinguer les interventions programmees et les pieces d'usure."
  }
],
      longevity_tips: [
  "Respecter le programme du manuel Honda 32MLRA00 propre au modele CB500FA 2024.",
  "Entretenir la chaine tous les 1 000 km et plus souvent si les conditions le necessitent.",
  "Controler regulierement pneus, freins, niveaux et tension de chaine.",
  "Conserver les factures et justificatifs d'entretien."
],
      data_quality: {
  "market": "Europe - France a confirmer",
  "model_year": "2024",
  "last_verified": "2026-10-08",
  "european_manual_verified": true,
  "manufacturer_fr_verified": false,
  "consumables_verified": false,
  "recall_checked": false,
  "pricing_type": "to_confirm",
  "sources": [
    {
      "label": "Honda CB500FA/XA_CBR500RA Owner's Manual - 32MLRA00",
      "type": "official_eu",
      "market": "Europe",
      "model_year": "2024",
      "url": "https://www.hondamotopub.com/om/HMEE/CB500FA/2024",
      "note": "Manuel fourni pour cette migration. Compatibilites OEM pour les versions francaises encore a confirmer."
    }
  ]
},
      budget: {
  "title": "Budget entretien a 30 000 km - CB500 Hornet 2024",
  "summary": {
    "horizon_km": 30000,
    "total_cost": "790 € - 1 210 €",
    "cost_per_km": "0,026 - 0,040 €/km",
    "interval_rule": "Revisions des 1 000, 12 000 et 24 000 km, pieces et main-d'oeuvre incluses dans les estimations.",
    "note": "Estimation editoriale Label Moto, non devis constructeur. Hors pneus, plaquettes, kit chaine, reparations et interventions calendaires supplementaires."
  },
  "note": "Fourchettes indicatives non confirmees par devis d'ateliers francais. A actualiser avant publication."
},
      maintenance_details: [
  {
    "id": "huile",
    "title": "Huile moteur & filtre",
    "summary": "SAE 10W-30 ; 2.7 L avec filtre",
    "rows": [
      {
        "label": "Moto",
        "value": "Honda CB500 Hornet 2024"
      },
      {
        "label": "Huile moteur",
        "value": "SAE 10W-30 ; JASO MA"
      },
      {
        "label": "Vidange simple",
        "value": "2,5 L"
      },
      {
        "label": "Vidange avec filtre",
        "value": "2.7 L"
      },
      {
        "label": "Filtre a huile",
        "value": "Honda 15410-MFJ-D02",
        "confidence": "to_confirm"
      },
      {
        "label": "Entretien",
        "value": "Selon programme Honda 2024"
      }
    ],
    "note": "Prix d'huile indique au litre ; une vidange complete implique plusieurs litres et la main-d'oeuvre."
  },
  {
    "id": "air",
    "title": "Filtre a air",
    "summary": "Controle periodique ; remplacement selon programme constructeur",
    "rows": [
      {
        "label": "Reference candidate",
        "value": "Honda 17211-MKP-J00",
        "confidence": "to_confirm"
      },
      {
        "label": "Entretien",
        "value": "Remplacement a 24 000 et 48 000 km selon dossier manuel"
      },
      {
        "label": "Conditions difficiles",
        "value": "Controle plus frequent en milieu humide ou poussiereux"
      }
    ],
    "note": "Reference de piece a reconfirmer pour la variante francaise."
  },
  {
    "id": "bougie",
    "title": "Bougies",
    "summary": "NGK CPR8EA-9 ; ecartement selon manuel",
    "rows": [
      {
        "label": "Reference",
        "value": "NGK CPR8EA-9"
      },
      {
        "label": "Quantite",
        "value": "2 bougies"
      },
      {
        "label": "Ecartement",
        "value": "0,8 a 0,9 mm"
      },
      {
        "label": "Entretien",
        "value": "Selon programme constructeur, controle/remplacement a verifier par operation"
      }
    ]
  },
  {
    "id": "soupapes",
    "title": "Jeu aux soupapes",
    "summary": "Controle a 24 000 et 48 000 km",
    "rows": [
      {
        "label": "Operation",
        "value": "Controle du jeu aux soupapes"
      },
      {
        "label": "Echeances",
        "value": "24 000 et 48 000 km"
      },
      {
        "label": "Tarif",
        "value": "Inclus dans l'estimation de grosse revision, sans prix isole valide"
      }
    ],
    "note": "Les valeurs et procedures de reglage doivent etre consultees dans la documentation atelier Honda."
  },
  {
    "id": "refroidissement",
    "title": "Liquide de refroidissement",
    "summary": "Liquide compatible Honda ; remplacement tous les 3 ans",
    "rows": [
      {
        "label": "Produit",
        "value": "Pro Honda HP Coolant"
      },
      {
        "label": "Capacite circuit",
        "value": "1,32 L"
      },
      {
        "label": "Periodicite",
        "value": "Tous les 3 ans"
      }
    ],
    "note": "Ne pas assimiler la capacite totale du circuit a la quantite obligatoirement vendue."
  },
  {
    "id": "freinage",
    "title": "Freinage & liquide de frein",
    "summary": "DOT 4 ; liquide tous les 2 ans ; plaquettes selon usure",
    "rows": [
      {
        "label": "Liquide",
        "value": "DOT 4"
      },
      {
        "label": "Remplacement liquide",
        "value": "Tous les 2 ans"
      },
      {
        "label": "Plaquettes",
        "value": "Controle de l'usure et des disques"
      },
      {
        "label": "References OEM",
        "value": "Avant 06455-MKP-DN1 ; arriere 06435-MGZ-J02 (candidates)",
        "confidence": "to_confirm"
      }
    ],
    "note": "Les prix des plaquettes doivent correspondre au nombre exact de jeux necessaires, hors montage."
  },
  {
    "id": "pneus",
    "title": "Pneus & pressions",
    "summary": "120/70 ZR17 avant ; 160/60 ZR17 arriere",
    "rows": [
      {
        "label": "Pneu avant",
        "value": "120/70 ZR17 avant"
      },
      {
        "label": "Pneu arriere",
        "value": "160/60 ZR17 arriere"
      },
      {
        "label": "Pression avant a froid",
        "value": "2,5 bar"
      },
      {
        "label": "Pression arriere a froid",
        "value": "2,9 bar"
      },
      {
        "label": "Tarif commercial",
        "value": "Michelin Road 6 : 129 EUR avant ; 159,90 EUR arriere"
      }
    ],
    "note": "Les prix concernent un exemple de train Michelin Road 6, hors montage, a revalider avant publication."
  },
  {
    "id": "chaine",
    "title": "Chaine & transmission",
    "summary": "Inspection et lubrification tous les 1 000 km",
    "rows": [
      {
        "label": "Transmission",
        "value": "DID520VF ou RK520ELO ; 112 maillons ; 15 / 41 dents"
      },
      {
        "label": "Fleche de chaine",
        "value": "25 a 35 mm"
      },
      {
        "label": "Entretien",
        "value": "Tous les 1 000 km ; adapter selon utilisation"
      },
      {
        "label": "Kit complet",
        "value": "Honda 06406-MLR-D00, reference candidate",
        "confidence": "to_confirm"
      }
    ],
    "note": "Le prix du kit de transmission complet et son montage restent a documenter pour chaque generation."
  }
]
    }
  ],
  service_schedule_v2: [
  {
    "km": 1000,
    "title": "Entretien des 1 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      }
    ]
  },
  {
    "km": 12000,
    "title": "Entretien des 12 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      },
      {
        "label": "Controles periodiques"
      }
    ]
  },
  {
    "km": 24000,
    "title": "Entretien des 24 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      },
      {
        "label": "Remplacement filtre huile"
      },
      {
        "label": "Remplacement filtre air"
      },
      {
        "label": "Remplacement bougies"
      },
      {
        "label": "Controle jeu aux soupapes"
      },
      {
        "label": "Controles periodiques"
      }
    ]
  },
  {
    "km": 36000,
    "title": "Entretien des 36 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      },
      {
        "label": "Controles periodiques"
      }
    ]
  },
  {
    "km": 48000,
    "title": "Entretien des 48 000 km",
    "operations": [
      {
        "label": "Remplacement huile moteur"
      },
      {
        "label": "Remplacement filtre huile"
      },
      {
        "label": "Remplacement filtre air"
      },
      {
        "label": "Remplacement bougies"
      },
      {
        "label": "Controle jeu aux soupapes"
      },
      {
        "label": "Controles periodiques"
      }
    ]
  }
],
  consumables_v2: [
  {
    "part": "Huile moteur",
    "specification": "SAE 10W-30, JASO MA, API SJ ou superieur selon restrictions du manuel",
    "replacement_interval": "12 000 km ou 12 mois",
    "note": "CB500F 2022 : 2,7 L avec remplacement du filtre. Verification par millesime requise."
  },
  {
    "part": "Filtre a huile",
    "specification": "Honda 15410-MFJ-D02",
    "reference_oem": "15410-MFJ-D02",
    "replacement_interval": "Selon programme d'entretien Honda CB500F 2022",
    "note": "Verifier les eventuelles references de remplacement constructeur."
  },
  {
    "part": "Filtre a air",
    "specification": "Honda 17211-MKP-J00",
    "reference_oem": "17211-MKP-J00",
    "replacement_interval": "Selon programme d'entretien Honda CB500F 2022",
    "note": "Reference a ne pas generaliser aux autres generations."
  },
  {
    "part": "Bougies",
    "specification": "NGK CPR8EA-9",
    "replacement_interval": "Selon programme d'entretien Honda CB500F 2022",
    "note": "Reference NGK, et non reference OEM Honda."
  },
  {
    "part": "Pneumatiques",
    "specification": "Avant 120/70ZR17M/C (58W) ; arriere 160/60ZR17M/C (69W)",
    "note": "Verifier indices, homologation et monte conforme au manuel."
  },
  {
    "part": "Kit chaine",
    "specification": "520, 112 maillons, pignon 15 dents, couronne 41 dents",
    "note": "Reference commerciale du kit complet non verifiee."
  },
  {
    "part": "Liquide de frein",
    "specification": "DOT 4",
    "replacement_interval": "Tous les 2 ans"
  },
  {
    "part": "Liquide de refroidissement",
    "specification": "Pro Honda HP Coolant",
    "replacement_interval": "Tous les 3 ans",
    "note": "Capacite totale du circuit : 1.32 L."
  }
],
};

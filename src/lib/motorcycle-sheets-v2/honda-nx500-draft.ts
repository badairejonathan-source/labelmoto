import type { MotorcycleSheetV2 } from "../motorcycle-sheet-v2";
/** NX500 2026 - BROUILLON NON PUBLIE. */
export const hondaNx500DraftV2: MotorcycleSheetV2 = {
  "known_issues_v2": [
    {
      "title": "Roues et suspensions",
      "description": "Inspecter les jantes, la fourche, les pneus et les traces de chocs, notamment apr?s un usage sur chemins.",
      "type": "usage_limitation",
      "confidence": "technical_documentation"
    },
    {
      "title": "Hauteur de selle",
      "description": "Essayer la selle de 830 mm avec son ?quipement et, si besoin, avec les bagages.",
      "type": "usage_limitation",
      "confidence": "official_fr"
    },
    {
      "title": "Historique d'entretien",
      "description": "Contr?ler les factures et le programme de maintenance applicable au mill?sime 2026.",
      "type": "usage_limitation",
      "confidence": "observed"
    }
  ],
  "layout_version": 2,
  "license_fr": "A2",
  "license_fr_source": "https://moto.honda.fr/motorcycles/range/adventure/nx500/specifications-and-price.html",
  "license_fr_verified_at": "2026-10-13",
  "display_title": "Honda NX500",
  "hero_subtitle": "Trail routier A2 471 cm³ - Standard et E-Clutch 2026",
  "variants": [
    {
      "service_schedule_v2": [
        {
          "km": 1000,
          "title": "Entretien des 1000 km - NX500 2026 Standard",
          "operations": [
            {
              "label": "Vidange moteur",
              "source_type": "observed"
            },
            {
              "label": "Remplacement du filtre à huile",
              "source_type": "observed"
            },
            {
              "label": "Contrôles de première révision selon Honda",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "130 € - 190 €",
          "price_type": "estimate"
        },
        {
          "km": 12000,
          "title": "Entretien des 12000 km - NX500 2026 Standard",
          "operations": [
            {
              "label": "Vidange moteur",
              "source_type": "observed"
            },
            {
              "label": "Inspection des commandes et du freinage",
              "source_type": "observed"
            },
            {
              "label": "Contrôle des pneus, de la chaîne et des organes de sécurité",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "200 € - 270 €",
          "price_type": "estimate"
        },
        {
          "km": 24000,
          "title": "Entretien des 24000 km - NX500 2026 Standard",
          "operations": [
            {
              "label": "Vidange moteur et filtre à huile",
              "source_type": "observed"
            },
            {
              "label": "Remplacement filtre à air et bougies",
              "source_type": "observed"
            },
            {
              "label": "Contrôle du jeu aux soupapes et des organes de sécurité",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "430 € - 510 €",
          "price_type": "estimate"
        },
        {
          "km": 36000,
          "title": "Entretien des 36000 km - NX500 2026 Standard",
          "operations": [
            {
              "label": "Vidange moteur",
              "source_type": "observed"
            },
            {
              "label": "Inspection des commandes, freins et suspensions",
              "source_type": "observed"
            },
            {
              "label": "Contrôle des pneus, de la chaîne et des organes de sécurité",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "200 € - 270 €",
          "price_type": "estimate"
        },
        {
          "km": 48000,
          "title": "Entretien des 48000 km - NX500 2026 Standard",
          "operations": [
            {
              "label": "Vidange moteur et filtre à huile",
              "source_type": "observed"
            },
            {
              "label": "Remplacement filtre à air et bougies",
              "source_type": "observed"
            },
            {
              "label": "Contrôle du jeu aux soupapes et des organes de sécurité",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "510 € - 590 €",
          "price_type": "estimate"
        }
      ],
      "maintenance_details": [
        {
          "id": "huile",
          "title": "Huile moteur & filtre",
          "summary": "SAE 10W-30 · JASO MA · 2,4 L après vidange · 2,6 L avec filtre · 3,1 L après démontage",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Norme",
              "value": "SAE 10W-30 · API SJ ou supérieur, hors Energy/Resource Conserving · JASO T 903 MA"
            },
            {
              "label": "Filtre à huile",
              "value": "Honda 15410-MFJ-D02 (cartouche) · 15010-MKR-305 (jeu de filtre) · catalogue NX500 2026"
            },
            {
              "label": "Vidange moteur",
              "value": "1 000 km, puis tous les 12 000 km"
            },
            {
              "label": "Filtre à huile",
              "value": "1 000, 24 000 et 48 000 km"
            },
            {
              "label": "Quantités d’huile",
              "value": "2,4 L après vidange · 2,6 L après vidange + filtre · 3,1 L après démontage moteur",
              "confidence": "official_eu"
            }
          ],
          "note": "Valeurs Honda Europe 2026 CB500XA/XAC. Les 3,1 L correspondent au remplissage après démontage moteur, pas à une vidange courante."
        },
        {
          "id": "air",
          "title": "Filtre à air",
          "summary": "Remplacement à 24 000 et 48 000 km · entretien plus fréquent en conditions humides ou poussiéreuses",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
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
              "value": "Honda 17211-MKP-J00 · compatibilité NX500 2026 Standard et E-Clutch vérifiée"
            }
          ],
          "note": "Périodicité confirmée par le manuel Honda Europe 2026. Référence OEM 17211-MKP-J00 vérifiée pour les NX500 2026 Standard et E-Clutch dans un catalogue de concessionnaire Honda."
        },
        {
          "id": "bougies",
          "title": "Bougies",
          "summary": "NGK CPR8EA-9 · 2 bougies · 0,8–0,9 mm · remplacement à 24 000 et 48 000 km",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Référence",
              "value": "Honda 31916-KRM-841 · NGK CPR8EA-9"
            },
            {
              "label": "Quantité",
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
          "note": "Référence CPR8EA-9, écartement 0,8–0,9 mm et périodicité confirmés par le manuel Honda Europe 2026."
        },
        {
          "id": "soupapes",
          "title": "Jeu aux soupapes",
          "summary": "Contrôle à 24 000 et 48 000 km",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
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
          "summary": "Pro Honda HP Coolant · capacité 1,32 L · remplacement tous les 3 ans",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Liquide prescrit",
              "value": "Pro Honda HP Coolant"
            },
            {
              "label": "Remplacement",
              "value": "Tous les 3 ans"
            },
            {
              "label": "Contrôles",
              "value": "Niveau à froid, durites, radiateur et fuites"
            },
            {
              "label": "Capacité du circuit",
              "value": "1,32 L",
              "confidence": "official_eu"
            }
          ],
          "note": "Liquide, capacité de 1,32 L et échéance de 3 ans confirmés par le manuel Honda Europe 2026."
        },
        {
          "id": "freins",
          "title": "Freinage & liquide de frein",
          "summary": "Double disque avant 296 mm ; arriere 240 mm ; DOT 4",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
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
              "value": "Avant Honda 06455-MKP-DQ1 · 2 jeux nécessaires ; arrière Honda 06435-MGZ-J02"
            }
          ],
          "note": "Références OEM vérifiées pour la NX500 2026 : 06455-MKP-DQ1 à l’avant (deux jeux pour les deux étriers) et 06435-MGZ-J02 à l’arrière."
        },
        {
          "id": "pneus",
          "title": "Pneus & pressions",
          "summary": "110/80 R19 avant · 160/60 R17 arrière · 2,0 / 2,5 bar à froid",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Avant",
              "value": "Dunlop 110/80 R19 59H · Honda 44711-MKP-J82"
            },
            {
              "label": "Arrière",
              "value": "Dunlop 160/60 R17 69H · Honda 42711-MKP-J82"
            },
            {
              "label": "Pression avant à froid",
              "value": "2,0 bar · 200 kPa · 29 psi"
            },
            {
              "label": "Pression arrière à froid",
              "value": "2,5 bar · 250 kPa · 36 psi"
            },
            {
              "label": "Remplacement",
              "value": "Selon usure et état"
            }
          ],
          "note": "Dimensions et pressions confirmées par Honda Europe 2026. Les références 44711-MKP-J82 avant et 42711-MKP-J82 arrière correspondent à la monte Dunlop répertoriée au catalogue de pièces 2026 ; un pneu de remplacement homologué peut être différent."
        },
        {
          "id": "transmission",
          "title": "Chaîne & transmission",
          "summary": "DID520VF ou RK520ELO · 112 maillons · 15/41 · jeu 30–40 mm",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Boîte",
              "value": "6 rapports"
            },
            {
              "label": "Chaîne",
              "value": "DID520VF ou RK520ELO · 112 maillons"
            },
            {
              "label": "Pignon / couronne",
              "value": "15 dents / 41 dents"
            },
            {
              "label": "Jeu de chaîne",
              "value": "30 à 40 mm"
            },
            {
              "label": "Entretien",
              "value": "Contrôle et lubrification tous les 1 000 km"
            },
            {
              "label": "Kit chaîne complet",
              "value": "Honda 06406-MLR-D00 · compatibilité NX500 2026 Standard et E-Clutch vérifiée"
            }
          ],
          "note": "Chaîne, 112 maillons, démultiplication 15/41 et jeu 30–40 mm confirmés par le manuel Honda Europe 2026. Kit complet Honda 06406-MLR-D00 vérifié pour les versions Standard et E-Clutch 2026 chez un concessionnaire Honda."
        }
      ],
      "consumables_v2": [
        {
          "part": "Huile moteur",
          "specification": "SAE 10W-30 · API SJ ou supérieur · JASO MA · 2,4 L vidange · 2,6 L avec filtre · 3,1 L après démontage",
          "replacement_interval": "1 000 km, puis tous les 12 000 km ou selon limite annuelle",
          "note": "Spécification et quantités confirmées par le manuel Honda Europe 2026. Le prix affiché reste une observation vendeur.",
          "source_type": "official_eu",
          "observed_price": "22,90 € TTC / litre Motul E-TEC 10W-30 ; pack NX500 3 L + filtre + joint : 59,90 € TTC, hors pose"
        },
        {
          "part": "Filtre à huile",
          "specification": "Cartouche Honda 15410-MFJ-D02 · jeu de filtre 15010-MKR-305 · affectation NX500 2026",
          "reference_oem": "15410-MFJ-D02 · 15010-MKR-305",
          "replacement_interval": "1 000, 24 000 et 48 000 km",
          "note": "Références présentes dans la vue éclatée NX500 2026 : 15410-MFJ-D02 pour la cartouche et 15010-MKR-305 pour le jeu de filtre.",
          "source_type": "observed",
          "observed_price": "16,86 € TTC / unité, catalogue Honda, hors pose"
        },
        {
          "part": "Filtre à air",
          "specification": "Filtre à air Honda d’origine 17211-MKP-J00 · NX500 2026 Standard et E-Clutch",
          "reference_oem": "17211-MKP-J00",
          "replacement_interval": "24 000 et 48 000 km · plus fréquent en conditions humides ou poussiéreuses",
          "note": "Compatibilité 2026 avec et sans E-Clutch vérifiée dans le catalogue d’un concessionnaire Honda ; périodicité issue du manuel Europe 2026.",
          "source_type": "observed",
          "observed_price": "48,90 € TTC / filtre dans le pack NX500 ; tarif indicatif hors pose"
        },
        {
          "part": "Bougies",
          "specification": "Honda 31916-KRM-841 · NGK CPR8EA-9 · 2 unités · écartement 0,8 à 0,9 mm",
          "reference_oem": "31916-KRM-841",
          "replacement_interval": "24 000 et 48 000 km",
          "note": "Référence Honda 31916-KRM-841 et compatibilité NX500 2026 vérifiées chez un concessionnaire Honda ; type CPR8EA-9 confirmé par le manuel Europe 2026.",
          "source_type": "observed",
          "observed_price": "16,90 € TTC / bougie ; deux unités soit 33,80 € TTC, hors pose"
        },
        {
          "part": "Pneumatiques",
          "specification": "Monte OEM catalogue 2026 : Dunlop 110/80 R19 59H avant · Dunlop 160/60 R17 69H arrière · 2,0 / 2,5 bar à froid",
          "reference_oem": "44711-MKP-J82 (avant) · 42711-MKP-J82 (arrière)",
          "replacement_interval": "Selon usure et état",
          "note": "Références de monte OEM 2026 : 44711-MKP-J82 avant et 42711-MKP-J82 arrière. Le prix Michelin affiché reste une observation de remplacement compatible et non le tarif de la monte OEM.",
          "source_type": "observed",
          "observed_price": "Michelin Anakee Adventure avant 110/80 R19 59V : 145,00 € TTC, hors pose ; arrière à chiffrer"
        },
        {
          "part": "Kit chaine",
          "specification": "Kit Honda 06406-MLR-D00 · chaîne DID520VF ou RK520ELO · 112 maillons · pignon 15 dents · couronne 41 dents · jeu 30–40 mm",
          "reference_oem": "06406-MLR-D00",
          "replacement_interval": "Selon usure ; inspection et lubrification tous les 1 000 km",
          "note": "Kit OEM 06406-MLR-D00 annoncé compatible NX500 2026 Standard et E-Clutch par un concessionnaire Honda ; caractéristiques de transmission confirmées par le manuel Europe 2026.",
          "source_type": "observed",
          "observed_price": "148,90 € TTC / kit, hors pose"
        },
        {
          "part": "Liquide de frein",
          "specification": "Liquide de frein DOT 4 conforme aux prescriptions Honda.",
          "replacement_interval": "Tous les 2 ans",
          "note": "Prix d'un bidon, non d'une purge en atelier ; remplacement selon le calendrier constructeur.",
          "source_type": "official_eu",
          "observed_price": "13,90 € TTC / bidon 500 ml, prix indicatif du brouillon Honda ; hors pose"
        },
        {
          "part": "Liquide de refroidissement",
          "specification": "Pro Honda HP Coolant · capacité du circuit 1,32 L",
          "replacement_interval": "Tous les 3 ans",
          "note": "Liquide Pro Honda HP Coolant et capacité de 1,32 L confirmés par le manuel Honda Europe 2026. Prix affiché : observation vendeur hors pose.",
          "source_type": "official_eu",
          "observed_price": "13,41 € TTC / bidon 1 L, exemple de tarif indicatif ; hors pose"
        },
        {
          "part": "Plaquettes avant",
          "specification": "Plaquettes avant Honda 06455-MKP-DQ1 · deux jeux nécessaires pour les deux étriers avant",
          "reference_oem": "06455-MKP-DQ1",
          "replacement_interval": "Selon usure",
          "note": "Référence OEM et compatibilité NX500 2026 Standard/E-Clutch vérifiées chez un concessionnaire Honda. Prix affiché par jeu ; deux jeux sont nécessaires à l’avant.",
          "source_type": "observed",
          "observed_price": "56,90 € TTC / jeu avant chez NX500Shop ; 2 jeux nécessaires, soit 113,80 € TTC hors pose"
        },
        {
          "part": "Plaquettes arriere",
          "specification": "Plaquettes arrière Honda 06435-MGZ-J02 · un jeu arrière",
          "reference_oem": "06435-MGZ-J02",
          "replacement_interval": "Selon usure",
          "note": "Référence OEM et compatibilité NX500 2026 Standard/E-Clutch vérifiées chez un concessionnaire Honda.",
          "source_type": "observed",
          "observed_price": "57,90 € TTC / jeu arrière, hors pose"
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
        "title": "Budget entretien estime sur 30 000 km - NX500 2026 Standard",
        "summary": {
          "horizon_km": 30000,
          "total_cost": "760 € - 970 €",
          "cost_per_km": "0,025 - 0,032 €/km",
          "interval_rule": "Estimation cumulee des revisions a 1 000, 12 000 et 24 000 km ; aucun forfait Honda officiel.",
          "note": "Estimation editoriale Label Moto issue de la fiche NX500 V1, hors pneus, chaine, plaquettes, reparations et entretiens calendaires."
        },
        "note": "Fourchette indicative de 760 à 970 €, sans devis concessionnaire. Un supplément E-Clutch n'est pas chiffré sans tarif documenté."
      },
      "label": "NX500 2026 Standard",
      "license_fr": "A2",
      "license_fr_source": "https://moto.honda.fr/motorcycles/range/adventure/nx500/specifications-and-price.html",
      "license_fr_verified_at": "2026-10-13",
      "quick_facts": [
        {
          "label": "CYLINDRÉE",
          "value": "471 cm³"
        },
        {
          "label": "PUISSANCE",
          "value": "35 kW (47,5 ch)"
        },
        {
          "label": "COUPLE",
          "value": "43 Nm à 6 500 tr/min"
        },
        {
          "label": "POIDS TOUS PLEINS FAITS",
          "value": "196 kg"
        },
        {
          "label": "HAUTEUR DE SELLE",
          "value": "830 mm"
        },
        {
          "label": "RÉSERVOIR",
          "value": "17,5 L"
        },
        {
          "label": "PERMIS",
          "value": "A2, sans bridage"
        }
      ],
      "verdict": {
        "title": "NX500 : une vraie voyageuse A2, sans chercher la surenchère",
        "text": "La NX500 a un talent qui ne se voit pas sur une fiche technique : elle met rapidement son pilote à l'aise. Le guidon large, la position droite et la direction naturelle rendent les demi-tours, les trajets urbains et les routes sinueuses moins intimidants. Son bicylindre de 471 cm3 délivre sa puissance sans brutalité. Il ne donne pas de grands coups de pied à l'accélération, mais il permet de garder un rythme agréable sans surveiller chaque mouvement de la poignée.\n\nC'est sur les petites routes que la formule prend tout son sens. La roue avant de 19 pouces et les suspensions encaissent correctement les revêtements imparfaits, tandis que la moto reste précise dans les virages. Pour voyager, la position de conduite et la consommation contenue jouent en sa faveur. Sur de longues portions d'autoroute, il faut en revanche accepter des reprises mesurées, une protection aérodynamique variable selon le gabarit et quelques vibrations quand le moteur tourne haut. La selle mérite aussi un essai prolongé.\n\nMalgré son allure de trail, la NX500 reste avant tout routière. Une piste sèche ou un chemin de gravier ne lui font pas peur si l'on roule raisonnablement. La boue, les grosses pierres et les descentes techniques sont une autre affaire : jantes en alliage, pneus routiers et ABS non déconnectable imposent de connaître ses limites. C'est une excellente moto pour partir loin en empruntant parfois les chemins, pas une enduro déguisée.",
        "strengths": [
          "Prise en main rassurante, y compris pour un premier trail",
          "Comportement prévisible et plaisant sur petites routes",
          "Position droite et consommation favorable aux voyages",
          "Polyvalence sur routes dégradées et pistes faciles"
        ],
        "weaknesses": [
          "Reprises limitées à pleine charge et sur autoroute",
          "Bulle et confort de selle à essayer sur un long trajet",
          "ABS non déconnectable et équipement peu adapté au vrai tout-terrain",
          "Hauteur de selle de 830 mm et poids à apprécier en manoeuvre"
        ]
      },
      "conclusion": "La NX500 Standard est notre choix pour le motard A2 qui veut une moto à garder longtemps : domicile-travail la semaine, départementales le week-end et voyage avec bagages pendant les vacances. Elle n'a pas besoin d'une puissance spectaculaire pour remplir ce programme. Sa qualité première est d'être facile à comprendre et agréable à utiliser.\n\nAvant d'acheter, essayez-la à basse vitesse puis sur une voie rapide. Vérifiez votre appui au sol avec vos bottes, la protection de la bulle et le confort après une bonne demi-heure. Sur une occasion, inspectez les jantes, le bas moteur, les protections, les fixations et les factures d'entretien. Si vous passez presque tout votre temps sur l'asphalte, elle a beaucoup de sens ; si votre priorité est de franchir des obstacles hors route, cherchez un trail plus spécialisé.",
      "longevity_tips": [
        "Conserver les factures et respecter le calendrier Honda correspondant au millésime et au VIN.",
        "Nettoyer et lubrifier la chaîne après la pluie et les sorties poussiéreuses ; mesurer son jeu selon le manuel.",
        "Surveiller les joints de fourche, la direction et les jantes après un choc sur une route dégradée.",
        "Adapter les pressions et la précharge arrière à la charge selon les préconisations Honda.",
        "Après un chemin, contrôler les pneus, les disques, les repose-pieds et les éventuelles traces sous le moteur.",
        "Ne pas confondre capacité à circuler sur piste facile et aptitude au franchissement technique."
      ],
      "faq": [
        {
          "question": "La NX500 est-elle une bonne première moto A2 ?",
          "answer": "Oui, notamment grâce à son moteur progressif et sa direction rassurante. Ses 830 mm de selle exigent toutefois un essai si vous êtes peu à l'aise à l'arrêt."
        },
        {
          "question": "Peut-on voyager sur autoroute avec la NX500 ?",
          "answer": "Oui. Elle tient le rythme d'un trajet routier, mais les reprises avec bagages ou passager restent celles d'un bicylindre A2. Essayez la protection de la bulle et la selle avant un long voyage."
        },
        {
          "question": "La NX500 peut-elle rouler sur les chemins ?",
          "answer": "Oui sur des chemins faciles et secs, avec une conduite adaptée. Elle est moins indiquée en terrain boueux ou cassant : ses roues en alliage et son ABS non déconnectable limitent les ambitions hors bitume."
        },
        {
          "question": "La NX500 remplace-t-elle la CB500X ?",
          "answer": "Oui, la NX500 reprend la vocation de trail routier de la CB500X avec plusieurs évolutions. Les pièces, équipements et programmes d'entretien ne doivent pas être supposés identiques d'un millésime à l'autre."
        },
        {
          "question": "Quel intérêt conserve la version Standard ?",
          "answer": "Elle convient à ceux qui apprécient une commande d'embrayage classique et ne ressentent pas le besoin de l'assistance E-Clutch, tout en profitant des qualités routières de la NX500."
        }
      ],
      "data_quality": {
        "market": "France",
        "model_year": "2026",
        "manufacturer_fr_verified": true,
        "european_manual_verified": true,
        "technical_documentation_verified": true,
        "consumables_verified": true,
        "recall_checked": true,
        "pricing_type": "to_confirm",
        "last_verified": "2026-10-13",
        "sources": [
          {
            "label": "Honda France - NX500 2026",
            "type": "official_fr",
            "market": "France",
            "model_year": "2026",
            "url": "https://moto.honda.fr/motorcycles/range/adventure/nx500/specifications-and-price.html",
            "note": "Dimensions, pneus, poids et puissance."
          },
          {
            "label": "Caradisiac - essai NX500 sur route 2024",
            "type": "observed",
            "market": "France",
            "model_year": "2024",
            "url": "https://www.caradisiac.com/honda-nx500-2024-sur-la-route-rassurante-207579.htm",
            "note": "Ergonomie, moteur, confort, freinage et limites sur chemin."
          },
          {
            "label": "1000PS - essai NX500 2024",
            "type": "observed",
            "market": "Europe",
            "model_year": "2024",
            "url": "https://www.1000ps.com/fr-fr/article/3011791/test-de-la-honda-nx500-2024",
            "note": "Usage urbain, conduite sur routes sinueuses et voyage."
          },
          {
            "label": "RevZilla - essai NX500 2025",
            "type": "observed",
            "market": "Amerique du Nord",
            "model_year": "2025",
            "url": "https://www.revzilla.com/common-tread/2025-honda-nx500-first-ride-review",
            "note": "Confort de selle, tourisme et usage mixte route/piste facile."
          },
          {
            "label": "Moto1Pro - essai NX500 E-Clutch 2026",
            "type": "observed",
            "market": "Espagne",
            "model_year": "2026",
            "url": "https://www.moto1pro.com/pruebas-motos/honda-nx-500-2026-e-clutch-la-trail-para-carnet-a2-mas-facil",
            "note": "Essai de la commande E-Clutch, ergonomie et limites hors route."
          },
          {
            "label": "MCNews - essai NX500 E-Clutch 2026",
            "type": "observed",
            "market": "Australie",
            "model_year": "2026",
            "url": "https://www.mcnews.com.au/2026-honda-nx500-e-clutch-review/",
            "note": "Retour de prise en main de la variante E-Clutch."
          },
          {
            "label": "Honda NX500 2026 - eclate filtre a huile",
            "type": "official_fr",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.pieces-honda-moto.com/nx500-MAT-GUNPOWDER-BLACK-METALLIC-NH436-2026/cb500xact/543743-carter-d-huile-pompe-a-huile/",
            "note": "References 15410-MFJ-D02 et 15010-MKR-305 ; tarif catalogue."
          },
          {
            "label": "NX500Shop - pack vidange NX500",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/huile-et-vidange/43-pack-vidange-nx500-packvidange3l.html",
            "note": "Pack compatible Standard et E-Clutch 2026 ; 3 L d'huile fournis, prix hors pose."
          },
          {
            "label": "NX500Shop - pack entretien 24000 et 48000 km",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/huile-et-vidange/261-pack-entretien-2400048000km-nx500-pack-cb500xar-48000km.html",
            "note": "Bougies CPR8EA-9, filtre a air, filtre a huile et fournitures ; tarifs vendeur."
          },
          {
            "label": "NX500Shop - kit chaine Honda",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/pieces-detachees-d-origine-honda/133-kit-chaine-honda-06406-mlr-d00.html",
            "note": "06406-MLR-D00, compatible avec les deux variantes 2026."
          },
          {
            "label": "NX500Shop - plaquettes arriere Honda",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/pieces-detachees-d-origine-honda/143-plaquettes-arrieres-honda-06435-mgz-j02.html",
            "note": "06435-MGZ-J02, compatible avec les deux variantes 2026."
          },
          {
            "label": "Honda NX500 - filtre a air origine 2024",
            "type": "observed",
            "market": "France",
            "model_year": "2024",
            "url": "https://www.pieces-honda-moto.com/nx500-GRAND-PRIX-RED-R380-2024/cb500xar/492235-filtre-a-air/",
            "note": "17211-MKP-J00 constate en 2024 ; confirmation OEM 2026 par VIN recommandee."
          },
          {
            "label": "NX500Shop - pneu avant Michelin Anakee Adventure",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/entretien/248-michelin-anakee-adventure-11080-r19-59v-634007799901.html",
            "note": "110/80 R19 59V, prix de vente indicatif ; pas une preuve de monte d'origine."
          },
          {
            "label": "Honda Europe - manuel propriétaire CB500XA/XAC 2026",
            "type": "official_eu",
            "market": "Europe / type ED",
            "model_year": "2026",
            "url": "https://2rom-prd-data.hondamotopub.com/om/HMEE/CB500FA/2026/32MLRA101_eng_web.pdf",
            "note": "Programme d’entretien Europe, huile, bougies, refroidissement, pneus et transmission."
          },
          {
            "label": "Catalogue pièces Honda 2026 - filtre à huile NX500",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.pieces-honda-moto.com/nx500-GRAPHITE-BLACK-NHB01-2026/cb500xact/543873-carter-d-huile-pompe-a-huile/",
            "note": "Vue éclatée NX500 2026 : 15010-MKR-305 (jeu de filtre) et 15410-MFJ-D02 (cartouche)."
          },
          {
            "label": "Concessionnaire Honda - filtre à air NX500 2026",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/en/original-honda-spare-parts/145-honda-air-filter-17211-mkp-j00.html",
            "note": "17211-MKP-J00 annoncé compatible NX500 2026 avec et sans E-Clutch."
          },
          {
            "label": "Concessionnaire Honda - bougie NX500 2026",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/entretien/262-bougie-honda-cpr8ea-9-31916-krm-841.html",
            "note": "31916-KRM-841 / NGK CPR8EA-9, deux unités, compatibilité 2026 Standard et E-Clutch."
          },
          {
            "label": "Concessionnaire Honda - plaquettes avant NX500 2026",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/en/original-honda-spare-parts/144-front-brake-pads-honda-06455-mkp-dq1.html",
            "note": "06455-MKP-DQ1, deux jeux nécessaires pour les deux étriers avant, compatibilité 2026."
          },
          {
            "label": "Catalogue pièces Honda 2026 - roue avant NX500",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.pieces-honda-moto.com/nx500-GRAPHITE-BLACK-NHB01-2026/cb500xat/544087-roue-avant/",
            "note": "Pneu avant Dunlop 110/80 R19 59H, référence Honda 44711-MKP-J82."
          },
          {
            "label": "Catalogue pièces Honda 2026 - roue arrière NX500",
            "type": "observed",
            "market": "Europe",
            "model_year": "2026",
            "url": "https://www.hondamoto.parts/nx500-PEARL-HORIZON-WHITE-NHB61-2026/cb500xact/671544-rear-wheel/",
            "note": "Pneu arrière Dunlop 160/60 R17 69H, référence Honda 42711-MKP-J82."
          }
        ,
          {
            "label": "Honda Genuine Service Manual 61MLR00 - CBR500R / CB500F / NX500 2024-2026",
            "type": "technical_documentation",
            "market": "Documentation atelier Honda - anglais",
            "model_year": "2024-2026",
            "url": "https://www.helminc.com/helm/product2.asp?Category=1&Make=AHC&Model=CBHR&Sku=61MLR00&Style=helm&Year=2026&class_2=AHC&dt=Shop%2FService+Information&from=result&itemtype=N&md=CB500+HORNET&mk=Honda+Powersports&module=&yr=2026",
            "note": "Manuel atelier Honda authentique référencé 61MLR00. La fiche éditeur couvre explicitement la NX500 2024, 2025 et 2026. Utilisé comme preuve d’existence et de couverture de la documentation technique ; les données réglementaires France restent sourcées séparément."
          },
          {
            "label": "Honda France - campagnes de rappel moto",
            "type": "official_fr",
            "market": "France",
            "model_year": "2026",
            "url": "https://moto.honda.fr/motorcycles/owners/apres-vente/campagnes-de-rappel.html",
            "note": "Contrôle éditorial effectué le 2026-10-13. Honda France précise que la vérification d’une campagne en attente se fait par VIN ; un contrôle modèle ne remplace donc pas la vérification du véhicule individuel."
          },
          {
            "label": "RappelConso - rappels Honda",
            "type": "official_fr",
            "market": "France",
            "model_year": "2026",
            "url": "https://rappel.conso.gouv.fr/categorie/0/1/honda",
            "note": "Base publique française consultée le 2026-10-13 : aucune entrée NX500 identifiée dans les rappels Honda consultables. Cette absence publique n’exclut pas une campagne liée à un VIN précis."
          }
        ]
      }
    },
    {
      "service_schedule_v2": [
        {
          "km": 1000,
          "title": "Entretien des 1000 km - NX500 2026 E-Clutch",
          "operations": [
            {
              "label": "Vidange moteur",
              "source_type": "observed"
            },
            {
              "label": "Remplacement du filtre à huile",
              "source_type": "observed"
            },
            {
              "label": "Contrôles de première révision selon Honda",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "130 € - 190 €",
          "price_type": "estimate"
        },
        {
          "km": 12000,
          "title": "Entretien des 12000 km - NX500 2026 E-Clutch",
          "operations": [
            {
              "label": "Vidange moteur",
              "source_type": "observed"
            },
            {
              "label": "Inspection des commandes et du freinage",
              "source_type": "observed"
            },
            {
              "label": "Contrôle des pneus, de la chaîne et des organes de sécurité",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "200 € - 270 €",
          "price_type": "estimate"
        },
        {
          "km": 24000,
          "title": "Entretien des 24000 km - NX500 2026 E-Clutch",
          "operations": [
            {
              "label": "Vidange moteur et filtre à huile",
              "source_type": "observed"
            },
            {
              "label": "Remplacement filtre à air et bougies",
              "source_type": "observed"
            },
            {
              "label": "Contrôle du jeu aux soupapes et des organes de sécurité",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "430 € - 510 €",
          "price_type": "estimate"
        },
        {
          "km": 36000,
          "title": "Entretien des 36000 km - NX500 2026 E-Clutch",
          "operations": [
            {
              "label": "Vidange moteur",
              "source_type": "observed"
            },
            {
              "label": "Inspection des commandes, freins et suspensions",
              "source_type": "observed"
            },
            {
              "label": "Contrôle des pneus, de la chaîne et des organes de sécurité",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "200 € - 270 €",
          "price_type": "estimate"
        },
        {
          "km": 48000,
          "title": "Entretien des 48000 km - NX500 2026 E-Clutch",
          "operations": [
            {
              "label": "Vidange moteur et filtre à huile",
              "source_type": "observed"
            },
            {
              "label": "Remplacement filtre à air et bougies",
              "source_type": "observed"
            },
            {
              "label": "Contrôle du jeu aux soupapes et des organes de sécurité",
              "source_type": "observed"
            }
          ],
          "note": "Jalon d’entretien confirmé par le manuel propriétaire Honda Europe 2026 CB500XA/XAC. Les prix affichés restent des estimations LabelMoto et non des forfaits Honda.",
          "price_estimate": "510 € - 590 €",
          "price_type": "estimate"
        }
      ],
      "maintenance_details": [
        {
          "id": "huile",
          "title": "Huile moteur & filtre",
          "summary": "SAE 10W-30 · JASO MA · 2,4 L après vidange · 2,6 L avec filtre · 3,1 L après démontage",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Norme",
              "value": "SAE 10W-30 · API SJ ou supérieur, hors Energy/Resource Conserving · JASO T 903 MA"
            },
            {
              "label": "Filtre à huile",
              "value": "Honda 15410-MFJ-D02 (cartouche) · 15010-MKR-305 (jeu de filtre) · catalogue NX500 2026"
            },
            {
              "label": "Vidange moteur",
              "value": "1 000 km, puis tous les 12 000 km"
            },
            {
              "label": "Filtre à huile",
              "value": "1 000, 24 000 et 48 000 km"
            },
            {
              "label": "Quantités d’huile",
              "value": "2,4 L après vidange · 2,6 L après vidange + filtre · 3,1 L après démontage moteur",
              "confidence": "official_eu"
            }
          ],
          "note": "Valeurs Honda Europe 2026 CB500XA/XAC. Les 3,1 L correspondent au remplissage après démontage moteur, pas à une vidange courante."
        },
        {
          "id": "air",
          "title": "Filtre à air",
          "summary": "Remplacement à 24 000 et 48 000 km · entretien plus fréquent en conditions humides ou poussiéreuses",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
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
              "value": "Honda 17211-MKP-J00 · compatibilité NX500 2026 Standard et E-Clutch vérifiée"
            }
          ],
          "note": "Périodicité confirmée par le manuel Honda Europe 2026. Référence OEM 17211-MKP-J00 vérifiée pour les NX500 2026 Standard et E-Clutch dans un catalogue de concessionnaire Honda."
        },
        {
          "id": "bougies",
          "title": "Bougies",
          "summary": "NGK CPR8EA-9 · 2 bougies · 0,8–0,9 mm · remplacement à 24 000 et 48 000 km",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Référence",
              "value": "Honda 31916-KRM-841 · NGK CPR8EA-9"
            },
            {
              "label": "Quantité",
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
          "note": "Référence CPR8EA-9, écartement 0,8–0,9 mm et périodicité confirmés par le manuel Honda Europe 2026."
        },
        {
          "id": "soupapes",
          "title": "Jeu aux soupapes",
          "summary": "Contrôle à 24 000 et 48 000 km",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
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
          "summary": "Pro Honda HP Coolant · capacité 1,32 L · remplacement tous les 3 ans",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Liquide prescrit",
              "value": "Pro Honda HP Coolant"
            },
            {
              "label": "Remplacement",
              "value": "Tous les 3 ans"
            },
            {
              "label": "Contrôles",
              "value": "Niveau à froid, durites, radiateur et fuites"
            },
            {
              "label": "Capacité du circuit",
              "value": "1,32 L",
              "confidence": "official_eu"
            }
          ],
          "note": "Liquide, capacité de 1,32 L et échéance de 3 ans confirmés par le manuel Honda Europe 2026."
        },
        {
          "id": "freins",
          "title": "Freinage & liquide de frein",
          "summary": "Double disque avant 296 mm ; arriere 240 mm ; DOT 4",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
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
              "value": "Avant Honda 06455-MKP-DQ1 · 2 jeux nécessaires ; arrière Honda 06435-MGZ-J02"
            }
          ],
          "note": "Références OEM vérifiées pour la NX500 2026 : 06455-MKP-DQ1 à l’avant (deux jeux pour les deux étriers) et 06435-MGZ-J02 à l’arrière."
        },
        {
          "id": "pneus",
          "title": "Pneus & pressions",
          "summary": "110/80 R19 avant · 160/60 R17 arrière · 2,0 / 2,5 bar à froid",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Avant",
              "value": "Dunlop 110/80 R19 59H · Honda 44711-MKP-J82"
            },
            {
              "label": "Arrière",
              "value": "Dunlop 160/60 R17 69H · Honda 42711-MKP-J82"
            },
            {
              "label": "Pression avant à froid",
              "value": "2,0 bar · 200 kPa · 29 psi"
            },
            {
              "label": "Pression arrière à froid",
              "value": "2,5 bar · 250 kPa · 36 psi"
            },
            {
              "label": "Remplacement",
              "value": "Selon usure et état"
            }
          ],
          "note": "Dimensions et pressions confirmées par Honda Europe 2026. Les références 44711-MKP-J82 avant et 42711-MKP-J82 arrière correspondent à la monte Dunlop répertoriée au catalogue de pièces 2026 ; un pneu de remplacement homologué peut être différent."
        },
        {
          "id": "transmission",
          "title": "Chaîne & transmission",
          "summary": "DID520VF ou RK520ELO · 112 maillons · 15/41 · jeu 30–40 mm",
          "rows": [
            {
              "label": "Moto",
              "value": "NX500 2026 Standard et E-Clutch"
            },
            {
              "label": "Boîte",
              "value": "6 rapports"
            },
            {
              "label": "Chaîne",
              "value": "DID520VF ou RK520ELO · 112 maillons"
            },
            {
              "label": "Pignon / couronne",
              "value": "15 dents / 41 dents"
            },
            {
              "label": "Jeu de chaîne",
              "value": "30 à 40 mm"
            },
            {
              "label": "Entretien",
              "value": "Contrôle et lubrification tous les 1 000 km"
            },
            {
              "label": "Kit chaîne complet",
              "value": "Honda 06406-MLR-D00 · compatibilité NX500 2026 Standard et E-Clutch vérifiée"
            },
            {
              "label": "E-Clutch",
              "value": "Commande électronique de l'embrayage ; sélecteur et levier manuel conservés. Respecter les consignes du manuel 2026."
            }
          ],
          "note": "Chaîne, 112 maillons, démultiplication 15/41 et jeu 30–40 mm confirmés par le manuel Honda Europe 2026. Kit complet Honda 06406-MLR-D00 vérifié pour les versions Standard et E-Clutch 2026 chez un concessionnaire Honda."
        }
      ],
      "consumables_v2": [
        {
          "part": "Huile moteur",
          "specification": "SAE 10W-30 · API SJ ou supérieur · JASO MA · 2,4 L vidange · 2,6 L avec filtre · 3,1 L après démontage",
          "replacement_interval": "1 000 km, puis tous les 12 000 km ou selon limite annuelle",
          "note": "Spécification et quantités confirmées par le manuel Honda Europe 2026. Le prix affiché reste une observation vendeur.",
          "source_type": "official_eu",
          "observed_price": "22,90 € TTC / litre Motul E-TEC 10W-30 ; pack NX500 3 L + filtre + joint : 59,90 € TTC, hors pose"
        },
        {
          "part": "Filtre à huile",
          "specification": "Cartouche Honda 15410-MFJ-D02 · jeu de filtre 15010-MKR-305 · affectation NX500 2026",
          "reference_oem": "15410-MFJ-D02 · 15010-MKR-305",
          "replacement_interval": "1 000, 24 000 et 48 000 km",
          "note": "Références présentes dans la vue éclatée NX500 2026 : 15410-MFJ-D02 pour la cartouche et 15010-MKR-305 pour le jeu de filtre.",
          "source_type": "observed",
          "observed_price": "16,86 € TTC / unité, catalogue Honda, hors pose"
        },
        {
          "part": "Filtre à air",
          "specification": "Filtre à air Honda d’origine 17211-MKP-J00 · NX500 2026 Standard et E-Clutch",
          "reference_oem": "17211-MKP-J00",
          "replacement_interval": "24 000 et 48 000 km · plus fréquent en conditions humides ou poussiéreuses",
          "note": "Compatibilité 2026 avec et sans E-Clutch vérifiée dans le catalogue d’un concessionnaire Honda ; périodicité issue du manuel Europe 2026.",
          "source_type": "observed",
          "observed_price": "48,90 € TTC / filtre dans le pack NX500 ; tarif indicatif hors pose"
        },
        {
          "part": "Bougies",
          "specification": "Honda 31916-KRM-841 · NGK CPR8EA-9 · 2 unités · écartement 0,8 à 0,9 mm",
          "reference_oem": "31916-KRM-841",
          "replacement_interval": "24 000 et 48 000 km",
          "note": "Référence Honda 31916-KRM-841 et compatibilité NX500 2026 vérifiées chez un concessionnaire Honda ; type CPR8EA-9 confirmé par le manuel Europe 2026.",
          "source_type": "observed",
          "observed_price": "16,90 € TTC / bougie ; deux unités soit 33,80 € TTC, hors pose"
        },
        {
          "part": "Pneumatiques",
          "specification": "Monte OEM catalogue 2026 : Dunlop 110/80 R19 59H avant · Dunlop 160/60 R17 69H arrière · 2,0 / 2,5 bar à froid",
          "reference_oem": "44711-MKP-J82 (avant) · 42711-MKP-J82 (arrière)",
          "replacement_interval": "Selon usure et état",
          "note": "Références de monte OEM 2026 : 44711-MKP-J82 avant et 42711-MKP-J82 arrière. Le prix Michelin affiché reste une observation de remplacement compatible et non le tarif de la monte OEM.",
          "source_type": "observed",
          "observed_price": "Michelin Anakee Adventure avant 110/80 R19 59V : 145,00 € TTC, hors pose ; arrière à chiffrer"
        },
        {
          "part": "Kit chaine",
          "specification": "Kit Honda 06406-MLR-D00 · chaîne DID520VF ou RK520ELO · 112 maillons · pignon 15 dents · couronne 41 dents · jeu 30–40 mm",
          "reference_oem": "06406-MLR-D00",
          "replacement_interval": "Selon usure ; inspection et lubrification tous les 1 000 km",
          "note": "Kit OEM 06406-MLR-D00 annoncé compatible NX500 2026 Standard et E-Clutch par un concessionnaire Honda ; caractéristiques de transmission confirmées par le manuel Europe 2026.",
          "source_type": "observed",
          "observed_price": "148,90 € TTC / kit, hors pose"
        },
        {
          "part": "Liquide de frein",
          "specification": "Liquide de frein DOT 4 conforme aux prescriptions Honda.",
          "replacement_interval": "Tous les 2 ans",
          "note": "Prix d'un bidon, non d'une purge en atelier ; remplacement selon le calendrier constructeur.",
          "source_type": "official_eu",
          "observed_price": "13,90 € TTC / bidon 500 ml, prix indicatif du brouillon Honda ; hors pose"
        },
        {
          "part": "Liquide de refroidissement",
          "specification": "Pro Honda HP Coolant · capacité du circuit 1,32 L",
          "replacement_interval": "Tous les 3 ans",
          "note": "Liquide Pro Honda HP Coolant et capacité de 1,32 L confirmés par le manuel Honda Europe 2026. Prix affiché : observation vendeur hors pose.",
          "source_type": "official_eu",
          "observed_price": "13,41 € TTC / bidon 1 L, exemple de tarif indicatif ; hors pose"
        },
        {
          "part": "Plaquettes avant",
          "specification": "Plaquettes avant Honda 06455-MKP-DQ1 · deux jeux nécessaires pour les deux étriers avant",
          "reference_oem": "06455-MKP-DQ1",
          "replacement_interval": "Selon usure",
          "note": "Référence OEM et compatibilité NX500 2026 Standard/E-Clutch vérifiées chez un concessionnaire Honda. Prix affiché par jeu ; deux jeux sont nécessaires à l’avant.",
          "source_type": "observed",
          "observed_price": "56,90 € TTC / jeu avant chez NX500Shop ; 2 jeux nécessaires, soit 113,80 € TTC hors pose"
        },
        {
          "part": "Plaquettes arriere",
          "specification": "Plaquettes arrière Honda 06435-MGZ-J02 · un jeu arrière",
          "reference_oem": "06435-MGZ-J02",
          "replacement_interval": "Selon usure",
          "note": "Référence OEM et compatibilité NX500 2026 Standard/E-Clutch vérifiées chez un concessionnaire Honda.",
          "source_type": "observed",
          "observed_price": "57,90 € TTC / jeu arrière, hors pose"
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
        "title": "Budget entretien estime sur 30 000 km - NX500 2026 E-Clutch",
        "summary": {
          "horizon_km": 30000,
          "total_cost": "760 € - 970 €",
          "cost_per_km": "0,025 - 0,032 €/km",
          "interval_rule": "Estimation cumulee des revisions a 1 000, 12 000 et 24 000 km ; aucun forfait Honda officiel.",
          "note": "Estimation editoriale Label Moto issue de la fiche NX500 V1, hors pneus, chaine, plaquettes, reparations et entretiens calendaires."
        },
        "note": "Fourchette indicative de 760 à 970 €, sans devis concessionnaire. Un supplément E-Clutch n'est pas chiffré sans tarif documenté."
      },
      "label": "NX500 2026 E-Clutch",
      "license_fr": "A2",
      "license_fr_source": "https://moto.honda.fr/motorcycles/range/adventure/nx500/specifications-and-price.html",
      "license_fr_verified_at": "2026-10-13",
      "quick_facts": [
        {
          "label": "CYLINDRÉE",
          "value": "471 cm³"
        },
        {
          "label": "PUISSANCE",
          "value": "35 kW (47,5 ch)"
        },
        {
          "label": "COUPLE",
          "value": "43 Nm à 6 500 tr/min"
        },
        {
          "label": "POIDS TOUS PLEINS FAITS",
          "value": "199 kg"
        },
        {
          "label": "HAUTEUR DE SELLE",
          "value": "830 mm"
        },
        {
          "label": "RÉSERVOIR",
          "value": "17,5 L"
        },
        {
          "label": "PERMIS",
          "value": "A2, sans bridage"
        }
      ],
      "verdict": {
        "title": "NX500 E-Clutch : moins de contraintes, sans perdre la conduite d'une moto",
        "text": "La NX500 E-Clutch conserve le caractère rassurant du trail Honda, mais change nettement la vie à basse vitesse. Au feu rouge, dans une file de voitures ou lorsqu'on multiplie les arrêts, l'embrayage électronique gère le débrayage et la reprise. Le pilote continue à choisir ses rapports au pied, mais n'a plus besoin de solliciter constamment la main gauche. Sur un trajet quotidien chargé en circulation, cette différence se ressent davantage qu'une fiche de performances ne peut le montrer.\n\nCe qui rend le système intéressant, c'est qu'il ne supprime pas la conduite traditionnelle. Le levier d'embrayage reste disponible et l'on peut garder ses habitudes lorsque l'on en a envie. Sur route, la NX500 conserve sa direction neutre, sa position confortable et son bicylindre de 35 kW. L'E-Clutch ne lui ajoute pas de chevaux et ne transforme pas ses reprises en duo. Ses 199 kg demandent toujours de l'attention lorsque l'on manoeuvre moteur coupé.\n\nSur les pistes faciles, éviter de caler au mauvais moment peut aussi rassurer. Il ne faut toutefois pas y voir une transformation de la NX500 en trail d'enduro : les jantes, les pneus orientés route et l'ABS non déconnectable restent les mêmes limites. L'E-Clutch est donc surtout une aide à la fluidité et au confort de conduite. Pour celui qui roule souvent en ville, son intérêt est tangible ; pour un usage dominé par les balades tranquilles, la Standard suffit déjà largement.",
        "strengths": [
          "Démarrages et arrêts simplifiés en circulation",
          "Passage des vitesses au pied et levier d'embrayage conservé",
          "Agrément du moteur et polyvalence routière inchangés",
          "Moins de risque de caler dans certaines manoeuvres lentes"
        ],
        "weaknesses": [
          "Surpoids de 3 kg par rapport à la Standard",
          "Aucun gain de puissance ni de capacité tout-terrain",
          "Système supplémentaire à découvrir et à faire contrôler selon Honda",
          "ABS non déconnectable et équipement d'origine plutôt routier"
        ]
      },
      "conclusion": "Nous privilégierions la NX500 E-Clutch pour un utilisateur qui traverse souvent la ville, alterne bouchons et petites routes ou souhaite une transition plus douce vers la moto à boîte manuelle. L'assistance fait vraiment sens lorsqu'on sollicite l'embrayage plusieurs dizaines de fois par trajet. Elle n'est pas indispensable pour profiter du moteur Honda ou partir en voyage.\n\nL'essai doit porter sur le système lui-même : démarrage en côte, circulation lente, changement de rapport en accélération et retour à la commande manuelle. Il faut aussi tester les manoeuvres à l'arrêt et la hauteur de selle, car l'E-Clutch ne fait pas disparaître les 199 kg. Choisissez cette version pour la facilité qu'elle apporte à votre quotidien, pas parce qu'elle promettrait une meilleure moto sur tous les terrains.",
      "longevity_tips": [
        "Respecter le calendrier Honda NX500 E-Clutch 2026 et conserver les factures des contrôles prévus.",
        "Lire les consignes Honda d'utilisation de l'E-Clutch avant les premières sorties et en cas de message au tableau de bord.",
        "Contrôler régulièrement la chaîne, les pneus, les freins et l'état des joints de fourche.",
        "Ne pas forcer les commandes si le système E-Clutch signale une anomalie ; consulter un atelier Honda.",
        "Après un chemin, inspecter les jantes, les pneus et les parties exposées sous la moto.",
        "Ajuster la précharge et les pressions selon la charge et les instructions du manuel."
      ],
      "faq": [
        {
          "question": "La NX500 E-Clutch est-elle une moto automatique ?",
          "answer": "Non. Les six rapports se sélectionnent toujours au pied. L'E-Clutch prend en charge l'embrayage dans de nombreuses situations ; le levier manuel reste présent."
        },
        {
          "question": "Peut-on utiliser l'embrayage normalement ?",
          "answer": "Oui. Le système préserve la possibilité d'utiliser le levier traditionnel. Il faut se familiariser avec les modes et consignes du manuel Honda."
        },
        {
          "question": "L'E-Clutch apporte-t-il plus de puissance ?",
          "answer": "Non. La NX500 Standard et l'E-Clutch développent toutes deux 35 kW, dans la limite du permis A2."
        },
        {
          "question": "Quelle est la différence de poids ?",
          "answer": "La fiche retient 196 kg tous pleins faits pour la Standard et 199 kg pour l'E-Clutch, soit 3 kg d'écart."
        },
        {
          "question": "L'E-Clutch est-il utile pour un jeune permis ?",
          "answer": "Il peut faciliter les démarrages et diminuer la fatigue dans les embouteillages. Il ne remplace pas l'apprentissage du freinage, de l'équilibre et du choix des rapports."
        },
        {
          "question": "La NX500 E-Clutch est-elle adaptée aux pistes ?",
          "answer": "Elle convient aux chemins faciles avec des précautions, mais garde les limites routières de la NX500 : pneus, jantes en alliage et ABS non déconnectable."
        }
      ],
      "data_quality": {
        "market": "France",
        "model_year": "2026",
        "manufacturer_fr_verified": true,
        "european_manual_verified": true,
        "technical_documentation_verified": true,
        "consumables_verified": true,
        "recall_checked": true,
        "pricing_type": "to_confirm",
        "last_verified": "2026-10-13",
        "sources": [
          {
            "label": "Honda France - NX500 2026",
            "type": "official_fr",
            "market": "France",
            "model_year": "2026",
            "url": "https://moto.honda.fr/motorcycles/range/adventure/nx500/specifications-and-price.html",
            "note": "Dimensions, pneus, poids et puissance."
          },
          {
            "label": "Caradisiac - essai NX500 sur route 2024",
            "type": "observed",
            "market": "France",
            "model_year": "2024",
            "url": "https://www.caradisiac.com/honda-nx500-2024-sur-la-route-rassurante-207579.htm",
            "note": "Ergonomie, moteur, confort, freinage et limites sur chemin."
          },
          {
            "label": "1000PS - essai NX500 2024",
            "type": "observed",
            "market": "Europe",
            "model_year": "2024",
            "url": "https://www.1000ps.com/fr-fr/article/3011791/test-de-la-honda-nx500-2024",
            "note": "Usage urbain, conduite sur routes sinueuses et voyage."
          },
          {
            "label": "RevZilla - essai NX500 2025",
            "type": "observed",
            "market": "Amerique du Nord",
            "model_year": "2025",
            "url": "https://www.revzilla.com/common-tread/2025-honda-nx500-first-ride-review",
            "note": "Confort de selle, tourisme et usage mixte route/piste facile."
          },
          {
            "label": "Moto1Pro - essai NX500 E-Clutch 2026",
            "type": "observed",
            "market": "Espagne",
            "model_year": "2026",
            "url": "https://www.moto1pro.com/pruebas-motos/honda-nx-500-2026-e-clutch-la-trail-para-carnet-a2-mas-facil",
            "note": "Essai de la commande E-Clutch, ergonomie et limites hors route."
          },
          {
            "label": "MCNews - essai NX500 E-Clutch 2026",
            "type": "observed",
            "market": "Australie",
            "model_year": "2026",
            "url": "https://www.mcnews.com.au/2026-honda-nx500-e-clutch-review/",
            "note": "Retour de prise en main de la variante E-Clutch."
          },
          {
            "label": "Honda NX500 2026 - eclate filtre a huile",
            "type": "official_fr",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.pieces-honda-moto.com/nx500-MAT-GUNPOWDER-BLACK-METALLIC-NH436-2026/cb500xact/543743-carter-d-huile-pompe-a-huile/",
            "note": "References 15410-MFJ-D02 et 15010-MKR-305 ; tarif catalogue."
          },
          {
            "label": "NX500Shop - pack vidange NX500",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/huile-et-vidange/43-pack-vidange-nx500-packvidange3l.html",
            "note": "Pack compatible Standard et E-Clutch 2026 ; 3 L d'huile fournis, prix hors pose."
          },
          {
            "label": "NX500Shop - pack entretien 24000 et 48000 km",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/huile-et-vidange/261-pack-entretien-2400048000km-nx500-pack-cb500xar-48000km.html",
            "note": "Bougies CPR8EA-9, filtre a air, filtre a huile et fournitures ; tarifs vendeur."
          },
          {
            "label": "NX500Shop - kit chaine Honda",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/pieces-detachees-d-origine-honda/133-kit-chaine-honda-06406-mlr-d00.html",
            "note": "06406-MLR-D00, compatible avec les deux variantes 2026."
          },
          {
            "label": "NX500Shop - plaquettes arriere Honda",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/pieces-detachees-d-origine-honda/143-plaquettes-arrieres-honda-06435-mgz-j02.html",
            "note": "06435-MGZ-J02, compatible avec les deux variantes 2026."
          },
          {
            "label": "Honda NX500 - filtre a air origine 2024",
            "type": "observed",
            "market": "France",
            "model_year": "2024",
            "url": "https://www.pieces-honda-moto.com/nx500-GRAND-PRIX-RED-R380-2024/cb500xar/492235-filtre-a-air/",
            "note": "17211-MKP-J00 constate en 2024 ; confirmation OEM 2026 par VIN recommandee."
          },
          {
            "label": "NX500Shop - pneu avant Michelin Anakee Adventure",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/entretien/248-michelin-anakee-adventure-11080-r19-59v-634007799901.html",
            "note": "110/80 R19 59V, prix de vente indicatif ; pas une preuve de monte d'origine."
          },
          {
            "label": "Honda Europe - manuel propriétaire CB500XA/XAC 2026",
            "type": "official_eu",
            "market": "Europe / type ED",
            "model_year": "2026",
            "url": "https://2rom-prd-data.hondamotopub.com/om/HMEE/CB500FA/2026/32MLRA101_eng_web.pdf",
            "note": "Programme d’entretien Europe, huile, bougies, refroidissement, pneus et transmission."
          },
          {
            "label": "Catalogue pièces Honda 2026 - filtre à huile NX500",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.pieces-honda-moto.com/nx500-GRAPHITE-BLACK-NHB01-2026/cb500xact/543873-carter-d-huile-pompe-a-huile/",
            "note": "Vue éclatée NX500 2026 : 15010-MKR-305 (jeu de filtre) et 15410-MFJ-D02 (cartouche)."
          },
          {
            "label": "Concessionnaire Honda - filtre à air NX500 2026",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/en/original-honda-spare-parts/145-honda-air-filter-17211-mkp-j00.html",
            "note": "17211-MKP-J00 annoncé compatible NX500 2026 avec et sans E-Clutch."
          },
          {
            "label": "Concessionnaire Honda - bougie NX500 2026",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/fr/entretien/262-bougie-honda-cpr8ea-9-31916-krm-841.html",
            "note": "31916-KRM-841 / NGK CPR8EA-9, deux unités, compatibilité 2026 Standard et E-Clutch."
          },
          {
            "label": "Concessionnaire Honda - plaquettes avant NX500 2026",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.nx500shop.com/en/original-honda-spare-parts/144-front-brake-pads-honda-06455-mkp-dq1.html",
            "note": "06455-MKP-DQ1, deux jeux nécessaires pour les deux étriers avant, compatibilité 2026."
          },
          {
            "label": "Catalogue pièces Honda 2026 - roue avant NX500",
            "type": "observed",
            "market": "France",
            "model_year": "2026",
            "url": "https://www.pieces-honda-moto.com/nx500-GRAPHITE-BLACK-NHB01-2026/cb500xat/544087-roue-avant/",
            "note": "Pneu avant Dunlop 110/80 R19 59H, référence Honda 44711-MKP-J82."
          },
          {
            "label": "Catalogue pièces Honda 2026 - roue arrière NX500",
            "type": "observed",
            "market": "Europe",
            "model_year": "2026",
            "url": "https://www.hondamoto.parts/nx500-PEARL-HORIZON-WHITE-NHB61-2026/cb500xact/671544-rear-wheel/",
            "note": "Pneu arrière Dunlop 160/60 R17 69H, référence Honda 42711-MKP-J82."
          }
        ,
          {
            "label": "Honda Genuine Service Manual 61MLR00 - CBR500R / CB500F / NX500 2024-2026",
            "type": "technical_documentation",
            "market": "Documentation atelier Honda - anglais",
            "model_year": "2024-2026",
            "url": "https://www.helminc.com/helm/product2.asp?Category=1&Make=AHC&Model=CBHR&Sku=61MLR00&Style=helm&Year=2026&class_2=AHC&dt=Shop%2FService+Information&from=result&itemtype=N&md=CB500+HORNET&mk=Honda+Powersports&module=&yr=2026",
            "note": "Manuel atelier Honda authentique référencé 61MLR00. La fiche éditeur couvre explicitement la NX500 2024, 2025 et 2026. Utilisé comme preuve d’existence et de couverture de la documentation technique ; les données réglementaires France restent sourcées séparément."
          },
          {
            "label": "Honda France - campagnes de rappel moto",
            "type": "official_fr",
            "market": "France",
            "model_year": "2026",
            "url": "https://moto.honda.fr/motorcycles/owners/apres-vente/campagnes-de-rappel.html",
            "note": "Contrôle éditorial effectué le 2026-10-13. Honda France précise que la vérification d’une campagne en attente se fait par VIN ; un contrôle modèle ne remplace donc pas la vérification du véhicule individuel."
          },
          {
            "label": "RappelConso - rappels Honda",
            "type": "official_fr",
            "market": "France",
            "model_year": "2026",
            "url": "https://rappel.conso.gouv.fr/categorie/0/1/honda",
            "note": "Base publique française consultée le 2026-10-13 : aucune entrée NX500 identifiée dans les rappels Honda consultables. Cette absence publique n’exclut pas une campagne liée à un VIN précis."
          }
        ]
      }
    }
  ]
};

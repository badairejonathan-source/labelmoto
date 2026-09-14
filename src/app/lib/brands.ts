export interface BrandData {
  slug: string;
  name: string;
  displayName: string;
  firestoreValue: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  aboutTitle?: string;
  highlights?: {
    label: string;
    value: string;
    description: string;
  }[];
  accordions?: {
    id: string;
    title: string;
    content: string;
  }[];
  faq: { q: string; a: string }[];
}

export const BRANDS: BrandData[] = [
  {
    slug: 'suzuki',
    name: 'Suzuki',
    displayName: 'Suzuki',
    firestoreValue: 'Suzuki',
    metaTitle: "Concessionnaire Suzuki en France : 276 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Suzuki en France parmi 276 adresses vérifiées. SV650, GSX-S750, V-Strom, Katana — concessions officielles avec horaires et contacts sur LabelMoto.",
    h1: 'Concessionnaires Suzuki en France',
    aboutTitle: "À propos de Suzuki",
    intro: [
      "Suzuki naît à Hamamatsu en 1909 comme fabricant de métiers à tisser avant d’entrer dans le deux-roues motorisé avec le Power Free de 1952. La marque conserve une base technique forte au Japon : le Hamamatsu Plant produit aujourd’hui des motos et des moteurs de moto et abrite également un centre technique. Suzuki s’appuie parallèlement sur une production internationale selon les marchés et les cylindrées."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Japon · 1909 / moto 1952",
        "description": "Suzuki est fondée à Hamamatsu en 1909 et lance le Power Free en 1952."
      },
      {
        "label": "Fondateur",
        "value": "Michio Suzuki",
        "description": "Michio Suzuki fonde Suzuki Loom Works avant la diversification vers la mobilité."
      },
      {
        "label": "Site moto",
        "value": "Hamamatsu Plant",
        "description": "Le site produit actuellement des motos et des moteurs de moto."
      },
      {
        "label": "Production 2024",
        "value": "≈ 80 000 motos à Hamamatsu",
        "description": "Suzuki indique environ 80 000 motos produites sur le site au cours de l’exercice 2024."
      }
    ],
    accordions: [
      {
        "id": "histoire-suzuki",
        "title": "Histoire de Suzuki",
        "content": "Michio Suzuki fonde Suzuki Loom Works à Hamamatsu en 1909. Après plusieurs décennies dans le textile, Suzuki entre dans la motorisation avec le Power Free de 36 cm³ en 1952. L’entreprise devient Suzuki Motor Co., Ltd. en 1954 puis développe rapidement des motos complètes."
      },
      {
        "id": "hamamatsu-production",
        "title": "Hamamatsu, production et développement",
        "content": "Le Hamamatsu Plant produit actuellement des motos et des moteurs de moto. Suzuki indique une production d’environ 80 000 motos sur l’exercice 2024 et la présence, au sud du site, d’un centre technique dédié aux essais et au développement des motos. Des modèles majeurs destinés à l’export y sont assemblés."
      },
      {
        "id": "moteurs-identite-suzuki",
        "title": "Moteurs et identité technique",
        "content": "Suzuki développe historiquement ses propres moteurs et a construit son image autour de solutions mécaniques efficaces, du deux-temps aux quatre-temps modernes. La production reste toutefois internationale : le pays d’assemblage peut changer selon la cylindrée, le marché et le modèle."
      },
      {
        "id": "entretien-suzuki",
        "title": "Révisions et entretien",
        "content": "Une GSX-8S, une V-Strom, une Hayabusa ou un scooter Suzuki ont des calendriers différents. La réputation de robustesse ne remplace pas la documentation constructeur : intervalles, références et coûts doivent être rattachés au modèle et au millésime."
      },
      {
        "id": "faq-suzuki",
        "title": "FAQ Suzuki",
        "content": "Suzuki est une marque japonaise née à Hamamatsu. Son activité moto débute en 1952 avec le Power Free. Le site de Hamamatsu fabrique toujours des motos et moteurs, mais toutes les Suzuki ne sont pas produites au Japon : l’origine dépend de la gamme et du marché."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Suzuki ?",
        "a": "Suzuki naît à Hamamatsu en 1909 comme fabricant de métiers à tisser avant d’entrer dans le deux-roues motorisé avec le Power Free de 1952. La marque conserve une base technique forte au Japon : le Hamamatsu Plant produit aujourd’hui des motos et des moteurs de moto et abrite également un centre technique."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Suzuki ?",
        "a": "Le Hamamatsu Plant produit actuellement des motos et des moteurs de moto. Suzuki indique une production d’environ 80 000 motos sur l’exercice 2024 et la présence, au sud du site, d’un centre technique dédié aux essais et au développement des motos."
      },
      {
        "q": "Comment aborder l’entretien d’une Suzuki ?",
        "a": "Une GSX-8S, une V-Strom, une Hayabusa ou un scooter Suzuki ont des calendriers différents. La réputation de robustesse ne remplace pas la documentation constructeur : intervalles, références et coûts doivent être rattachés au modèle et au millésime."
      },
      {
        "q": "Quels sont les points clés à retenir sur Suzuki ?",
        "a": "Suzuki est une marque japonaise née à Hamamatsu. Son activité moto débute en 1952 avec le Power Free. Le site de Hamamatsu fabrique toujours des motos et moteurs, mais toutes les Suzuki ne sont pas produites au Japon : l’origine dépend de la gamme et du marché."
      }
    ],
  },
  {
    slug: 'yamaha',
    name: 'Yamaha',
    displayName: 'Yamaha',
    firestoreValue: 'Yamaha',
    metaTitle: "Concessionnaire Yamaha en France : 248 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Yamaha en France parmi 248 adresses vérifiées. MT-07, MT-09, R1, Tracer, TMAX — concessions officielles avec horaires et contacts sur LabelMoto.",
    h1: 'Concessionnaires Yamaha en France',
    aboutTitle: "À propos de Yamaha",
    intro: [
      "Yamaha Motor Co., Ltd. est fondée le 1er juillet 1955 après la séparation de l’activité moto de Nippon Gakki, aujourd’hui Yamaha Corporation. Genichi Kawakami en devient le premier président et la YA-1 est la première moto de la nouvelle entreprise. Yamaha Motor dispose aujourd’hui d’un réseau industriel mondial, tandis qu’au Japon la production moto a été progressivement consolidée autour de l’Iwata Main Factory. La compétition reste un axe historique fort de la marque."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Japon · 1955",
        "description": "Yamaha Motor est fondée le 1er juillet 1955."
      },
      {
        "label": "Fondateur",
        "value": "Genichi Kawakami",
        "description": "Kawakami dirige le lancement de l’activité moto et devient le premier président de Yamaha Motor."
      },
      {
        "label": "Première moto",
        "value": "YA-1 · 1955",
        "description": "La YA-1 est la première moto Yamaha et remporte des succès en compétition dès sa première année."
      },
      {
        "label": "Base japonaise",
        "value": "Iwata · Shizuoka",
        "description": "Yamaha a consolidé une part importante de ses opérations de production moto autour de l’Iwata Main Factory."
      }
    ],
    accordions: [
      {
        "id": "histoire-yamaha",
        "title": "Histoire de Yamaha Motor",
        "content": "Yamaha Motor naît en 1955 de la séparation de l’activité moto de Nippon Gakki. Genichi Kawakami est le premier président de la nouvelle société et la YA-1 devient son premier modèle. La compétition accompagne immédiatement le lancement de la marque, qui remporte des courses japonaises dès 1955."
      },
      {
        "id": "iwata-production-yamaha",
        "title": "Iwata et production mondiale",
        "content": "Au Japon, Yamaha a regroupé progressivement des opérations de production moto autour de l’Iwata Main Factory. En 2011, les lignes moteurs et véhicules complets y ont été consolidées, puis une nouvelle phase de regroupement des rôles de production autour d’Iwata a été annoncée en 2021 avec achèvement prévu en 2024. Yamaha reste parallèlement un constructeur mondial avec de nombreux sites hors du Japon."
      },
      {
        "id": "moteurs-course-yamaha",
        "title": "Moteurs, design et compétition",
        "content": "La compétence moteur est centrale dans l’histoire de Yamaha Motor. La marque développe une large variété de motorisations et utilise depuis ses débuts la compétition comme terrain d’expérience et de communication. Yamaha célébrait en 2025 les 70 ans de sa fondation et de ses activités sportives."
      },
      {
        "id": "entretien-yamaha",
        "title": "Révisions et entretien",
        "content": "Un MT-125, un Ténéré 700, un Tracer, un XMAX ou une YZF-R1 ne partagent pas les mêmes exigences. Les intervalles et pièces doivent être vérifiés sur la documentation du modèle, du marché et du millésime concernés."
      },
      {
        "id": "faq-yamaha",
        "title": "FAQ Yamaha",
        "content": "Yamaha Motor est une entreprise japonaise distincte de Yamaha Corporation depuis 1955, même si les deux partagent l’héritage de Nippon Gakki et le symbole des diapasons. La YA-1 est sa première moto. Yamaha produit aujourd’hui dans plusieurs pays : l’origine d’un modèle doit être vérifiée individuellement."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Yamaha ?",
        "a": "Yamaha Motor Co., Ltd. est fondée le 1er juillet 1955 après la séparation de l’activité moto de Nippon Gakki, aujourd’hui Yamaha Corporation. Genichi Kawakami en devient le premier président et la YA-1 est la première moto de la nouvelle entreprise."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Yamaha ?",
        "a": "Au Japon, Yamaha a regroupé progressivement des opérations de production moto autour de l’Iwata Main Factory. En 2011, les lignes moteurs et véhicules complets y ont été consolidées, puis une nouvelle phase de regroupement des rôles de production autour d’Iwata a été annoncée en 2021 avec achèvement prévu en 2024."
      },
      {
        "q": "Comment aborder l’entretien d’une Yamaha ?",
        "a": "Un MT-125, un Ténéré 700, un Tracer, un XMAX ou une YZF-R1 ne partagent pas les mêmes exigences. Les intervalles et pièces doivent être vérifiés sur la documentation du modèle, du marché et du millésime concernés."
      },
      {
        "q": "Quels sont les points clés à retenir sur Yamaha ?",
        "a": "Yamaha Motor est une entreprise japonaise distincte de Yamaha Corporation depuis 1955, même si les deux partagent l’héritage de Nippon Gakki et le symbole des diapasons. La YA-1 est sa première moto. Yamaha produit aujourd’hui dans plusieurs pays : l’origine d’un modèle doit être vérifiée individuellement."
      }
    ],
  },
  {
    slug: 'honda',
    name: 'Honda',
    displayName: 'Honda',
    firestoreValue: 'Honda',
    metaTitle: "Concessionnaire Honda en France : 235 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Honda en France parmi 235 adresses vérifiées. CB500, CB650R, Africa Twin, CB1000R — concessions officielles avec horaires et contacts sur LabelMoto.",
    h1: 'Concessionnaires Honda en France',
    aboutTitle: "À propos de Honda",
    intro: [
      "Honda Motor Co., Ltd. est fondée à Hamamatsu en 1948 après les premiers travaux de Soichiro Honda sur des moteurs auxiliaires pour bicyclettes. La marque devient ensuite le leader mondial du deux-roues par le volume. En mai 2025, Honda a franchi le cap de 500 millions de motos produites cumulativement. Son activité repose sur une ingénierie interne forte et un réseau industriel mondial capable de produire plus de 20 millions de motos par an dans 23 pays et territoires."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Japon · 1948",
        "description": "Honda Motor Co., Ltd. est fondée à Hamamatsu le 24 septembre 1948."
      },
      {
        "label": "Figures fondatrices",
        "value": "Soichiro Honda · Takeo Fujisawa",
        "description": "Leur complémentarité technique et commerciale structure les débuts de Honda."
      },
      {
        "label": "Jalon mondial",
        "value": "500 millions · 2025",
        "description": "Honda a atteint 500 millions de motos produites cumulativement en mai 2025."
      },
      {
        "label": "Réseau industriel",
        "value": "37 sites · 23 pays/territoires",
        "description": "Honda annonce une capacité mondiale supérieure à 20 millions de motos par an."
      }
    ],
    accordions: [
      {
        "id": "histoire-honda",
        "title": "Histoire de Honda",
        "content": "Soichiro Honda crée le Honda Technical Research Institute en 1946. Le moteur A-Type est lancé en 1947, puis Honda Motor Co., Ltd. est fondée en septembre 1948. En 1949, la Dream D-Type devient la première moto complète développée par Honda, marquant le passage du moteur auxiliaire au constructeur de motos à part entière."
      },
      {
        "id": "production-mondiale-honda",
        "title": "Production mondiale",
        "content": "Honda applique depuis longtemps une logique de production locale au plus près des marchés. En 2025, le groupe indiquait disposer de 37 entités de production moto dans 23 pays et territoires, avec une capacité annuelle supérieure à 20 millions d’unités. Le lieu de fabrication varie donc selon le modèle et le marché."
      },
      {
        "id": "moteurs-rd-honda",
        "title": "Moteurs, R&D et identité technique",
        "content": "La conception moteur fait partie du cœur historique de Honda. Le groupe développe une très grande variété de motorisations et de plateformes, tout en répartissant leur industrialisation dans son réseau mondial. La marque associe ainsi ingénierie interne, production à grande échelle et adaptation locale."
      },
      {
        "id": "entretien-honda",
        "title": "Révisions et entretien",
        "content": "Une CB125F, une Forza, une NC750X, une Africa Twin ou une Gold Wing ne partagent ni les mêmes opérations ni les mêmes coûts. La réputation de fiabilité de Honda ne remplace pas la documentation du modèle : intervalle, année, marché et référence moteur doivent être vérifiés avant toute publication d’entretien."
      },
      {
        "id": "faq-honda",
        "title": "FAQ Honda",
        "content": "Honda est une marque japonaise fondée en 1948. Elle a franchi le cap de 500 millions de motos produites en 2025 et représente environ 40 % des ventes mondiales de motos sur l’exercice FY2025 selon son briefing officiel. Toutes les Honda ne sont pas fabriquées au Japon : la production est répartie dans un réseau mondial."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Honda ?",
        "a": "Honda Motor Co., Ltd. est fondée à Hamamatsu en 1948 après les premiers travaux de Soichiro Honda sur des moteurs auxiliaires pour bicyclettes. La marque devient ensuite le leader mondial du deux-roues par le volume."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Honda ?",
        "a": "Honda applique depuis longtemps une logique de production locale au plus près des marchés. En 2025, le groupe indiquait disposer de 37 entités de production moto dans 23 pays et territoires, avec une capacité annuelle supérieure à 20 millions d’unités."
      },
      {
        "q": "Comment aborder l’entretien d’une Honda ?",
        "a": "Une CB125F, une Forza, une NC750X, une Africa Twin ou une Gold Wing ne partagent ni les mêmes opérations ni les mêmes coûts. La réputation de fiabilité de Honda ne remplace pas la documentation du modèle : intervalle, année, marché et référence moteur doivent être vérifiés avant toute publication d’entretien."
      },
      {
        "q": "Quels sont les points clés à retenir sur Honda ?",
        "a": "Honda est une marque japonaise fondée en 1948. Elle a franchi le cap de 500 millions de motos produites en 2025 et représente environ 40 % des ventes mondiales de motos sur l’exercice FY2025 selon son briefing officiel. Toutes les Honda ne sont pas fabriquées au Japon : la production est répartie dans un réseau mondial."
      }
    ],
  },
  {
    slug: 'kawasaki',
    name: 'Kawasaki',
    displayName: 'Kawasaki',
    firestoreValue: 'Kawasaki',
    metaTitle: "Concessionnaire Kawasaki en France : 127 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Kawasaki en France parmi 127 adresses vérifiées. Z650, Z900, Ninja 400, Versys, Z125 — concessions officielles avec horaires et contacts sur LabelMoto.",
    h1: 'Concessionnaires Kawasaki en France',
    aboutTitle: "À propos de Kawasaki",
    intro: [
      "Kawasaki est une marque japonaise issue du groupe industriel Kawasaki Heavy Industries. La production de ses premiers moteurs de moto débute en 1953 en s’appuyant sur des compétences acquises dans le développement de moteurs d’avion. Aujourd’hui, Kawasaki Motors, Ltd. a son siège et son site principal à Akashi, où sont fabriqués notamment des motos et des moteurs. L’histoire de la marque inclut également l’héritage de Meguro, important dans le développement des grosses cylindrées japonaises."
    ],
    highlights: [
      {
        "label": "Origine moto",
        "value": "Japon · 1953",
        "description": "Kawasaki commence à produire ses premiers moteurs de moto en 1953."
      },
      {
        "label": "Cœur industriel",
        "value": "Akashi · Hyogo",
        "description": "Kawasaki Motors a son siège et son Head Works à Akashi."
      },
      {
        "label": "Héritage",
        "value": "Aircraft + Meguro",
        "description": "L’aéronautique et l’héritage Meguro ont contribué à l’identité technique de la marque."
      },
      {
        "label": "Familles emblématiques",
        "value": "Z · Ninja · H2",
        "description": "Kawasaki associe fortement son image aux moteurs performants et aux modèles sportifs."
      }
    ],
    accordions: [
      {
        "id": "histoire-kawasaki",
        "title": "Histoire de Kawasaki moto",
        "content": "Kawasaki Heavy Industries commence à produire des moteurs de moto en 1953 en utilisant le savoir-faire issu des moteurs d’avion. La marque développe ensuite des modèles devenus emblématiques, des Mach et Z aux Ninja puis aux machines suralimentées H2."
      },
      {
        "id": "akashi-meguro",
        "title": "Akashi et l’héritage Meguro",
        "content": "Akashi est le centre industriel majeur de Kawasaki Motors : le site produit des motos, des moteurs et d’autres véhicules powersports. Meguro, constructeur japonais historique, est également intégré à l’histoire Kawasaki et contribue au développement de la lignée W et au savoir-faire de la marque sur les grosses cylindrées."
      },
      {
        "id": "moteurs-performance-kawasaki",
        "title": "Moteurs et culture performance",
        "content": "Kawasaki développe historiquement ses propres moteurs et relie fortement son image à la performance mécanique. Les familles Z, Ninja et H2 illustrent cette continuité, avec des architectures et niveaux de technologie très différents selon les générations."
      },
      {
        "id": "entretien-kawasaki",
        "title": "Révisions et entretien",
        "content": "Une Ninja 400/500, une Z650, une Versys, une Z900 ou une ZX-10R ne se traitent pas comme une seule famille. Les périodicités, jeux aux soupapes, consommables et coûts doivent être documentés sur le manuel correspondant au modèle et au millésime."
      },
      {
        "id": "faq-kawasaki",
        "title": "FAQ Kawasaki",
        "content": "Kawasaki est une marque japonaise issue de Kawasaki Heavy Industries. Sa branche moto exploite un héritage industriel et aéronautique, avec Akashi comme site central. Toutes les Kawasaki ne sont pas nécessairement assemblées au Japon : le réseau industriel de la marque est international et l’origine doit être vérifiée modèle par modèle."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Kawasaki ?",
        "a": "Kawasaki est une marque japonaise issue du groupe industriel Kawasaki Heavy Industries. La production de ses premiers moteurs de moto débute en 1953 en s’appuyant sur des compétences acquises dans le développement de moteurs d’avion."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Kawasaki ?",
        "a": "Kawasaki développe historiquement ses propres moteurs et relie fortement son image à la performance mécanique. Les familles Z, Ninja et H2 illustrent cette continuité, avec des architectures et niveaux de technologie très différents selon les générations."
      },
      {
        "q": "Comment aborder l’entretien d’une Kawasaki ?",
        "a": "Une Ninja 400/500, une Z650, une Versys, une Z900 ou une ZX-10R ne se traitent pas comme une seule famille. Les périodicités, jeux aux soupapes, consommables et coûts doivent être documentés sur le manuel correspondant au modèle et au millésime."
      },
      {
        "q": "Quels sont les points clés à retenir sur Kawasaki ?",
        "a": "Kawasaki est une marque japonaise issue de Kawasaki Heavy Industries. Sa branche moto exploite un héritage industriel et aéronautique, avec Akashi comme site central. Toutes les Kawasaki ne sont pas nécessairement assemblées au Japon : le réseau industriel de la marque est international et l’origine doit être vérifiée modèle par modèle."
      }
    ],
  },
  {
    slug: 'harley-davidson',
    name: 'Harley-Davidson',
    displayName: 'Harley-Davidson',
    firestoreValue: 'Harley-Davidson',
    metaTitle: "Concessionnaire Harley-Davidson en France : 128 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Harley-Davidson en France parmi 128 adresses vérifiées. Sportster, Softail, Touring, Pan America — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Harley-Davidson en France',
    intro: [
      "Harley-Davidson, symbole du custom et du cruiser américain, dispose d'un réseau solide en France avec plus de 125 concessions agréées. Des Sportster aux Road Glide en passant par les Softail et le trail Pan America, H-D propose une gamme large pour les amateurs de la marque.",
      "LabelMoto recense tous les concessionnaires Harley-Davidson en France avec fiches vérifiées, avis et coordonnées directes pour trouver votre dealer H-D.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Harley-Davidson près de chez moi ?", a: "LabelMoto recense 128 concessionnaires Harley-Davidson en France. Utilisez la carte interactive pour trouver l'adresse la plus proche et voir les horaires." },
      { q: "Quel est le prix d'entretien d'une Harley-Davidson ?", a: "L'entretien d'une Harley-Davidson est plus élevé que la moyenne : comptez 400 à 700 € pour une révision complète en concession officielle. Les intervals sont de 8 000 km (5 000 miles) ou 1 an." },
      { q: "Harley-Davidson propose-t-il des motos en permis A2 ?", a: "Oui, la Nightster 975 et la Sportster S peuvent être bridées pour le permis A2. La Pan America 1250 Special est bridable également." },
    ],
  },
  {
    slug: 'bmw',
    name: 'BMW Motorrad',
    displayName: 'BMW Motorrad',
    firestoreValue: 'BMW',
    metaTitle: "Concessionnaire BMW Motorrad en France : 109 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire BMW Motorrad en France parmi 109 adresses vérifiées. GS, R1250, S1000RR, F900R, G310R — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires BMW Motorrad en France',
    aboutTitle: "À propos de BMW Motorrad",
    intro: [
      "BMW Motorrad est la branche moto du BMW Group. Son histoire de constructeur commence en 1923 avec la R 32, qui installe deux signatures durables : le moteur boxer et la transmission par arbre. Berlin-Spandau est aujourd’hui le site industriel de référence de la marque et a célébré sa quatre-millionième moto en avril 2026. BMW Motorrad reste cependant un constructeur mondial : selon les familles, la production ou certains composants peuvent aussi provenir de partenaires et de sites hors d’Allemagne."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Allemagne · 1923",
        "description": "La R 32 présentée en 1923 marque le début de BMW comme constructeur de motos."
      },
      {
        "label": "Site de référence",
        "value": "Berlin-Spandau",
        "description": "Le site berlinois produit des motos BMW depuis 1969."
      },
      {
        "label": "Signature",
        "value": "Boxer + cardan",
        "description": "Le boxer et la transmission par arbre sont des marqueurs historiques de BMW Motorrad."
      },
      {
        "label": "Jalon industriel",
        "value": "4 000 000 à Berlin · 2026",
        "description": "BMW a célébré la quatre-millionième moto produite à Berlin en avril 2026."
      }
    ],
    accordions: [
      {
        "id": "histoire-bmw-motorrad",
        "title": "Histoire de BMW Motorrad",
        "content": "La BMW R 32 est dévoilée en 1923 avec un bicylindre boxer et une transmission par arbre. Conçue sous la responsabilité de Max Friz, elle établit une architecture devenue emblématique. BMW Motorrad a depuis développé une gamme beaucoup plus large, du monocylindre aux quatre et six cylindres, en conservant le boxer comme l’un de ses principaux symboles."
      },
      {
        "id": "berlin-spandau",
        "title": "Berlin-Spandau, cœur industriel",
        "content": "BMW fabrique des motos à Berlin-Spandau depuis 1969. Le site reste la grande référence industrielle de BMW Motorrad et a franchi en avril 2026 le cap des quatre millions de motos produites. Il concentre une part importante de la production des modèles premium destinés aux marchés mondiaux."
      },
      {
        "id": "production-et-moteurs",
        "title": "Conception BMW et production internationale",
        "content": "L’ingénierie BMW Motorrad s’inscrit dans l’écosystème technique du BMW Group, mais toutes les motos et tous les composants ne sont pas fabriqués en Allemagne. Certaines petites cylindrées ou familles de moteurs sont industrialisées avec des partenaires et des sites internationaux. Le pays de fabrication doit donc être vérifié sur le modèle et le millésime concernés."
      },
      {
        "id": "entretien-bmw",
        "title": "Révisions et entretien",
        "content": "Une G 310, une F 900, une R 1300 GS, une S 1000 RR ou une R 18 ont des architectures et des besoins très différents. Les périodicités, opérations et coûts ne doivent jamais être généralisés à toute la marque : les données du manuel et du réseau correspondant au modèle exact restent la référence."
      },
      {
        "id": "faq-bmw",
        "title": "FAQ BMW Motorrad",
        "content": "BMW Motorrad est une marque allemande dont la première moto est la R 32 de 1923. Berlin-Spandau est son site industriel majeur, mais toute la gamme n’y est pas produite. Le boxer et le cardan restent des signatures historiques, sans résumer à eux seuls toutes les architectures proposées par BMW Motorrad."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de BMW Motorrad ?",
        "a": "BMW Motorrad est la branche moto du BMW Group. Son histoire de constructeur commence en 1923 avec la R 32, qui installe deux signatures durables : le moteur boxer et la transmission par arbre."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de BMW Motorrad ?",
        "a": "BMW fabrique des motos à Berlin-Spandau depuis 1969. Le site reste la grande référence industrielle de BMW Motorrad et a franchi en avril 2026 le cap des quatre millions de motos produites."
      },
      {
        "q": "Comment aborder l’entretien d’une BMW Motorrad ?",
        "a": "Une G 310, une F 900, une R 1300 GS, une S 1000 RR ou une R 18 ont des architectures et des besoins très différents. Les périodicités, opérations et coûts ne doivent jamais être généralisés à toute la marque : les données du manuel et du réseau correspondant au modèle exact restent la référence."
      },
      {
        "q": "Quels sont les points clés à retenir sur BMW Motorrad ?",
        "a": "BMW Motorrad est une marque allemande dont la première moto est la R 32 de 1923. Berlin-Spandau est son site industriel majeur, mais toute la gamme n’y est pas produite. Le boxer et le cardan restent des signatures historiques, sans résumer à eux seuls toutes les architectures proposées par BMW Motorrad."
      }
    ],
  },
  {
    slug: 'triumph',
    name: 'Triumph',
    displayName: 'Triumph',
    firestoreValue: 'Triumph',
    metaTitle: "Concessionnaire Triumph en France : 93 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Triumph en France parmi 93 adresses vérifiées. Bonneville, Tiger, Trident, Street Triple, Speed Twin — concessions officielles sur LabelMoto.",
    h1: 'Concessionnaires Triumph en France',
    aboutTitle: "À propos de Triumph",
    intro: [
      "Triumph est une marque britannique dont l’histoire moto commence en 1902 après des débuts dans le cycle à Coventry en 1887. La Triumph moderne renaît en 1990 avec une nouvelle gamme développée à Hinckley sous l’impulsion de John Bloor. Aujourd’hui encore, Triumph indique que le design, la construction des prototypes et l’ingénierie commencent à Hinckley, tandis que la fabrication est répartie dans un réseau international comprenant le Royaume-Uni, la Thaïlande et le Brésil."
    ],
    highlights: [
      {
        "label": "Origine moto",
        "value": "Royaume-Uni · 1902",
        "description": "La première Triumph motorisée est produite en 1902 après les débuts de l’entreprise dans le cycle."
      },
      {
        "label": "Renaissance moderne",
        "value": "Hinckley · 1990",
        "description": "La marque moderne renaît avec une nouvelle gamme présentée en 1990."
      },
      {
        "label": "Conception",
        "value": "Hinckley",
        "description": "Triumph indique que design, prototypes et ingénierie débutent à Hinckley."
      },
      {
        "label": "Propriété",
        "value": "Bloor Holdings",
        "description": "Triumph Motorcycles Limited est une société privée détenue par Bloor Holdings, propriété de John Bloor."
      }
    ],
    accordions: [
      {
        "id": "histoire-triumph",
        "title": "Histoire de Triumph",
        "content": "L’entreprise est fondée dans le cycle à Coventry en 1887 par Siegfried Bettmann et produit sa première moto en 1902. Après la disparition de l’ancienne structure industrielle, John Bloor relance Triumph : une nouvelle gamme est présentée en 1990 et la marque moderne s’organise autour de Hinckley."
      },
      {
        "id": "hinckley-production",
        "title": "Hinckley et production mondiale",
        "content": "Hinckley reste le cœur de la conception Triumph. La FAQ officielle actuelle indique que chaque moto commence sa vie à Hinckley, où se déroulent le design, la construction des prototypes et l’ingénierie. Triumph exploite parallèlement un réseau mondial de fabrication avec des sites au Royaume-Uni, en Thaïlande et au Brésil."
      },
      {
        "id": "moteurs-triumph",
        "title": "Moteurs et identité technique",
        "content": "Triumph a construit une forte identité autour de ses trois-cylindres et de ses bicylindres Modern Classic, tout en ajoutant de nouvelles familles monocylindres. L’ingénierie est pilotée par Triumph, mais l’industrialisation et le site d’assemblage peuvent varier selon la plateforme."
      },
      {
        "id": "entretien-triumph",
        "title": "Révisions et entretien",
        "content": "Une Speed 400, une Street Triple, une Tiger 900, une Bonneville ou une Rocket 3 n’ont pas les mêmes opérations ni les mêmes budgets. Les périodicités doivent être vérifiées sur la documentation du modèle et de l’année concernés."
      },
      {
        "id": "faq-triumph",
        "title": "FAQ Triumph",
        "content": "Triumph est une marque britannique dont l’histoire moto commence en 1902. La marque moderne est centrée sur Hinckley depuis 1990. Les Triumph ne sont pas toutes fabriquées au Royaume-Uni : la production est internationale, tandis que la conception et l’ingénierie restent fortement ancrées à Hinckley."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Triumph ?",
        "a": "Triumph est une marque britannique dont l’histoire moto commence en 1902 après des débuts dans le cycle à Coventry en 1887. La Triumph moderne renaît en 1990 avec une nouvelle gamme développée à Hinckley sous l’impulsion de John Bloor."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Triumph ?",
        "a": "Hinckley reste le cœur de la conception Triumph. La FAQ officielle actuelle indique que chaque moto commence sa vie à Hinckley, où se déroulent le design, la construction des prototypes et l’ingénierie."
      },
      {
        "q": "Comment aborder l’entretien d’une Triumph ?",
        "a": "Une Speed 400, une Street Triple, une Tiger 900, une Bonneville ou une Rocket 3 n’ont pas les mêmes opérations ni les mêmes budgets. Les périodicités doivent être vérifiées sur la documentation du modèle et de l’année concernés."
      },
      {
        "q": "Quels sont les points clés à retenir sur Triumph ?",
        "a": "Triumph est une marque britannique dont l’histoire moto commence en 1902. La marque moderne est centrée sur Hinckley depuis 1990. Les Triumph ne sont pas toutes fabriquées au Royaume-Uni : la production est internationale, tandis que la conception et l’ingénierie restent fortement ancrées à Hinckley."
      }
    ],
  },
  {
    slug: 'kymco',
    name: 'Kymco',
    displayName: 'Kymco',
    firestoreValue: 'Kymco',
    metaTitle: "Concessionnaire Kymco en France : 87 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Kymco en France parmi 87 adresses vérifiées. Downtown, AK550, Like, People — scooters et motos Kymco avec contacts directs sur LabelMoto.",
    h1: 'Concessionnaires Kymco en France',
    intro: [
      "Kymco, marque taïwanaise reconnue pour son rapport qualité-prix, dispose d'un réseau de plus de 85 concessionnaires en France. Spécialisé dans les scooters (AK550, Downtown, Like) et les motos 125cc, Kymco propose des solutions fiables et économiques.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Kymco en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Kymco près de chez moi ?", a: "LabelMoto recense 87 points de vente Kymco en France. Utilisez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Les scooters Kymco sont-ils fiables ?", a: "Oui, Kymco est réputé pour la fiabilité de ses scooters. L'AK550 et le Downtown 350 sont parmi les modèles les mieux notés en termes de fiabilité sur le long terme." },
      { q: "Quel est le prix d'entretien d'un Kymco ?", a: "L'entretien d'un scooter Kymco est économique : comptez 100 à 200 € pour une révision standard. C'est l'un des avantages majeurs de la marque par rapport aux scooters premium japonais." },
    ],
  },
  {
    slug: 'ducati',
    name: 'Ducati',
    displayName: 'Ducati',
    firestoreValue: 'Ducati',
    metaTitle: "Concessionnaire Ducati en France : 60 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Ducati en France parmi 60 adresses vérifiées. Panigale, Monster, Multistrada, Scrambler, Diavel — concessions officielles sur LabelMoto.",
    h1: 'Concessionnaires Ducati en France',
    intro: [
      "Ducati est une marque italienne née à Bologne en 1926. Après des débuts dans la radio et l’électronique, l’entreprise se tourne vers le deux-roues après la Seconde Guerre mondiale. Borgo Panigale reste aujourd’hui le cœur historique, industriel et culturel de Ducati. Depuis 2012, la marque appartient au groupe Volkswagen via Audi et célèbre son centenaire en 2026."
    ],
    faq: [
      {
        "q": "Ducati est-elle une marque italienne ?",
        "a": "Oui. Ducati est née à Bologne en 1926 et son siège historique reste à Borgo Panigale."
      },
      {
        "q": "À quel groupe appartient Ducati ?",
        "a": "Ducati appartient au groupe Volkswagen depuis 2012 et est contrôlée par Audi."
      },
      {
        "q": "Toutes les Ducati utilisent-elles une distribution desmodromique ?",
        "a": "Non. Le Desmo reste emblématique de la marque, mais certaines motorisations récentes utilisent d’autres solutions de distribution."
      }
    ],
    aboutTitle: "À propos de Ducati",
    highlights: [
      {
        "label": "Origine",
        "value": "Italie · Bologne · 1926",
        "description": "Ducati est fondée à Bologne le 4 juillet 1926."
      },
      {
        "label": "Cœur historique",
        "value": "Borgo Panigale",
        "description": "Le site de Bologne concentre siège, production, R&D, musée et culture de marque."
      },
      {
        "label": "Groupe",
        "value": "Audi · Volkswagen Group",
        "description": "Ducati rejoint le groupe Volkswagen en 2012 sous le contrôle d’Audi."
      },
      {
        "label": "Jalon",
        "value": "100 ans · 2026",
        "description": "Ducati célèbre son centenaire en 2026."
      }
    ],
    accordions: [
      {
        "id": "histoire-ducati",
        "title": "Histoire de Ducati",
        "content": "Ducati est fondée en 1926 par la famille Ducati à Bologne. L’entreprise fabrique d’abord des composants radio avant de se tourner vers le deux-roues après la Seconde Guerre mondiale. Le Cucciolo contribue à cette reconversion et ouvre la voie à une longue histoire de motos sportives et de compétition."
      },
      {
        "id": "borgo-panigale",
        "title": "Borgo Panigale, le cœur de Ducati",
        "content": "Le site de Borgo Panigale, à Bologne, est lié à Ducati depuis les années 1930. Il reste le siège de la marque et un centre majeur de production, de développement, de patrimoine et d’accueil des passionnés avec le musée Ducati."
      },
      {
        "id": "groupe-ducati",
        "title": "Ducati au sein du groupe Audi-Volkswagen",
        "content": "Ducati a rejoint le groupe Volkswagen en 2012 via Lamborghini et Audi. La marque conserve son identité italienne, sa direction industrielle propre et son ancrage historique à Bologne."
      },
      {
        "id": "moteurs-ducati",
        "title": "Desmo, V4 et nouvelles générations de moteurs",
        "content": "La distribution desmodromique reste l’une des signatures historiques de Ducati, mais elle n’équipe plus toutes les motorisations actuelles. La gamme associe aujourd’hui plusieurs architectures, dont des V2 et V4, avec des choix techniques différents selon les modèles."
      },
      {
        "id": "production-ducati",
        "title": "Production en Italie et à l’international",
        "content": "Borgo Panigale demeure le site de référence de Ducati. La marque dispose également d’activités industrielles hors d’Italie pour certains marchés, notamment en Asie. Le lieu d’assemblage peut donc varier selon le modèle et sa destination."
      }
    ],
  },
  {
    slug: 'royal-enfield',
    name: 'Royal Enfield',
    displayName: 'Royal Enfield',
    firestoreValue: 'Royal Enfield',
    metaTitle: "Concessionnaire Royal Enfield en France : 61 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Royal Enfield en France parmi 61 adresses vérifiées. Classic 350, Meteor, Himalayan, Hunter 350 — concessions officielles sur LabelMoto.",
    h1: 'Concessionnaires Royal Enfield en France',
    intro: [
      "Royal Enfield possède des racines britanniques remontant à 1901, mais son développement moderne est profondément lié à l’Inde. La marque appartient aujourd’hui à Eicher Motors et produit l’essentiel de ses motos dans le Tamil Nadu, autour de Chennai. Son expansion internationale s’appuie également sur des centres techniques et plusieurs unités d’assemblage hors d’Inde."
    ],
    faq: [
      {
        "q": "Royal Enfield est-elle britannique ou indienne ?",
        "a": "La marque est d’origine britannique, mais son activité industrielle moderne, sa maison mère et l’essentiel de sa production sont aujourd’hui en Inde."
      },
      {
        "q": "À quel groupe appartient Royal Enfield ?",
        "a": "Royal Enfield appartient à Eicher Motors Limited."
      },
      {
        "q": "Où sont fabriquées les Royal Enfield ?",
        "a": "La production principale se situe dans le Tamil Nadu, en Inde, avec également des opérations d’assemblage dans plusieurs pays."
      }
    ],
    aboutTitle: "À propos de Royal Enfield",
    highlights: [
      {
        "label": "Origines",
        "value": "Royaume-Uni · 1901",
        "description": "La première moto Royal Enfield est produite au début du XXe siècle."
      },
      {
        "label": "Maison mère",
        "value": "Eicher Motors Limited",
        "description": "Royal Enfield est aujourd’hui intégrée au groupe indien Eicher Motors."
      },
      {
        "label": "Production",
        "value": "Tamil Nadu · Inde",
        "description": "Les principaux sites industriels sont situés autour de Chennai."
      },
      {
        "label": "R&D",
        "value": "Chennai · Bruntingthorpe",
        "description": "La marque dispose de centres techniques en Inde et au Royaume-Uni."
      }
    ],
    accordions: [
      {
        "id": "histoire-royal-enfield",
        "title": "Histoire de Royal Enfield",
        "content": "Royal Enfield construit sa première moto au Royaume-Uni en 1901. À partir des années 1950, la production de la Bullet se développe en Inde avec Madras Motors. Lorsque l’activité britannique cesse, la branche indienne assure la continuité de la marque et devient le centre de son développement mondial."
      },
      {
        "id": "eicher-royal-enfield",
        "title": "Royal Enfield et Eicher Motors",
        "content": "Royal Enfield fait aujourd’hui partie d’Eicher Motors Limited. Le groupe accompagne son développement industriel, commercial et international tout en conservant l’identité spécifique de la marque moto."
      },
      {
        "id": "usines-royal-enfield",
        "title": "Production dans le Tamil Nadu",
        "content": "La production principale est concentrée dans le Tamil Nadu, autour de Chennai, avec plusieurs sites industriels dédiés aux différentes familles de motos. Cette base accompagne la forte croissance internationale de Royal Enfield."
      },
      {
        "id": "rd-royal-enfield",
        "title": "Développement en Inde et au Royaume-Uni",
        "content": "Royal Enfield dispose de centres techniques à Chennai et à Bruntingthorpe. Ils participent au développement des nouvelles plateformes, des moteurs et des véhicules destinés aux différents marchés."
      },
      {
        "id": "international-royal-enfield",
        "title": "Une marque devenue mondiale",
        "content": "Royal Enfield assemble également certaines motos dans plusieurs pays afin de servir localement différents marchés. Cette organisation internationale complète la production indienne sans remettre en cause le rôle central du Tamil Nadu."
      }
    ],
  },
  {
    slug: 'piaggio',
    name: 'Piaggio',
    displayName: 'Piaggio',
    firestoreValue: 'Piaggio',
    metaTitle: "Concessionnaire Piaggio en France : 62 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Piaggio en France parmi 62 adresses vérifiées. MP3, Beverly, Liberty, Medley — scooters Piaggio avec contacts directs sur LabelMoto.",
    h1: 'Concessionnaires Piaggio en France',
    intro: [
      "Piaggio, groupe italien qui détient également Vespa, Aprilia et Moto Guzzi, dispose d'un réseau de plus de 60 concessionnaires en France. Spécialisé dans les scooters urbains (MP3, Beverly, Liberty, Medley), Piaggio propose des solutions fiables pour la mobilité quotidienne.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Piaggio en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Piaggio près de chez moi ?", a: "LabelMoto recense 62 concessions Piaggio en France. Utilisez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Le Piaggio MP3 est-il accessible avec le permis B ?", a: "Oui, le Piaggio MP3 (3 roues) peut être conduit avec le permis B voiture sous certaines conditions de cylindrée. Renseignez-vous auprès de votre concessionnaire pour les versions éligibles." },
      { q: "Quel est le prix d'entretien d'un Piaggio ?", a: "L'entretien d'un scooter Piaggio est abordable : comptez 150 à 280 € pour une révision standard selon le modèle et le kilométrage." },
    ],
  },
  {
    slug: 'ktm',
    name: 'KTM',
    displayName: 'KTM',
    firestoreValue: 'KTM',
    metaTitle: "Concessionnaire KTM en France : 54 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire KTM en France parmi 54 adresses vérifiées. Duke 125, 390, 790, Adventure, RC — concessions officielles avec contacts directs sur LabelMoto.",
    h1: 'Concessionnaires KTM en France',
    aboutTitle: "À propos de KTM",
    intro: [
      "KTM est une marque autrichienne née à Mattighofen, dont la production de motos en série commence en 1953. Son identité reste profondément liée à la compétition et à la philosophie « Ready to Race ». Depuis la restructuration de 2025, KTM AG est détenue à 100 % par Bajaj Mobility AG, elle-même contrôlée à environ 74,9 % par une filiale de Bajaj Auto. La production est internationale : l’Autriche reste le cœur de la marque, tandis que certaines petites cylindrées sont produites en Inde et les KTM 790 Duke/Adventure en Chine dans le cadre du partenariat avec CFMOTO."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Autriche · 1953",
        "description": "La production en série des motos KTM démarre à Mattighofen en 1953."
      },
      {
        "label": "Cœur de marque",
        "value": "Mattighofen",
        "description": "KTM conserve en Autriche son ancrage historique, technique et industriel."
      },
      {
        "label": "Groupe actuel",
        "value": "Bajaj Mobility AG",
        "description": "KTM AG est détenue à 100 % par Bajaj Mobility AG, sous contrôle du groupe Bajaj Auto."
      },
      {
        "label": "Production mondiale",
        "value": "Autriche · Inde · Chine",
        "description": "Le lieu de fabrication varie selon la plateforme et le modèle."
      }
    ],
    accordions: [
      {
        "id": "histoire-ktm",
        "title": "Histoire de KTM",
        "content": "KTM trouve son origine dans l’atelier ouvert par Hans Trunkenpolz à Mattighofen dans les années 1930. La production en série de motos commence en 1953. La marque se construit ensuite autour du tout-terrain, de la compétition et d’une philosophie produit centrée sur la légèreté et la performance."
      },
      {
        "id": "groupe-ktm-2026",
        "title": "KTM après la restructuration de 2025",
        "content": "La structure actionnariale a profondément changé. Bajaj Auto a pris le contrôle du groupe fin 2025. En 2026, Bajaj Mobility AG est la holding de KTM AG ; elle détient KTM AG à 100 % et est elle-même contrôlée à environ 74,9 % par Bajaj Auto International Holdings AG, filiale indirecte de Bajaj Auto. Les marques KTM, Husqvarna et GASGAS restent réunies dans ce groupe."
      },
      {
        "id": "production-ktm",
        "title": "Production : Autriche, Inde et Chine",
        "content": "L’Autriche reste le cœur industriel de KTM, dont la production a été relancée à plein régime en 2025. Bajaj produit de nombreuses petites cylindrées KTM et Husqvarna à Chakan en Inde. KTM indique par ailleurs que le partenariat avec CFMOTO supervise la production mondiale en Chine des 790 Duke et 790 Adventure."
      },
      {
        "id": "entretien-ktm",
        "title": "Révisions et entretien",
        "content": "Une 125 Duke, une 390 Adventure, une 690, une 890/990 ou une EXC ne partagent pas les mêmes contraintes. Les modèles offroad et sportifs sont particulièrement sensibles à l’usage réel. Les intervalles et coûts doivent donc être documentés au niveau du modèle et du millésime."
      },
      {
        "id": "faq-ktm",
        "title": "FAQ KTM",
        "content": "KTM reste une marque autrichienne par son origine et son ancrage à Mattighofen, mais son groupe est aujourd’hui sous contrôle Bajaj Auto. Toutes les KTM ne sont pas fabriquées en Autriche : certaines familles sont produites en Inde et en Chine. Le lieu réel de fabrication doit être vérifié pour le modèle concerné."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de KTM ?",
        "a": "KTM est une marque autrichienne née à Mattighofen, dont la production de motos en série commence en 1953. Son identité reste profondément liée à la compétition et à la philosophie « Ready to Race »."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de KTM ?",
        "a": "La structure actionnariale a profondément changé. Bajaj Auto a pris le contrôle du groupe fin 2025."
      },
      {
        "q": "Comment aborder l’entretien d’une KTM ?",
        "a": "Une 125 Duke, une 390 Adventure, une 690, une 890/990 ou une EXC ne partagent pas les mêmes contraintes. Les modèles offroad et sportifs sont particulièrement sensibles à l’usage réel."
      },
      {
        "q": "Quels sont les points clés à retenir sur KTM ?",
        "a": "KTM reste une marque autrichienne par son origine et son ancrage à Mattighofen, mais son groupe est aujourd’hui sous contrôle Bajaj Auto. Toutes les KTM ne sont pas fabriquées en Autriche : certaines familles sont produites en Inde et en Chine. Le lieu réel de fabrication doit être vérifié pour le modèle concerné."
      }
    ],
  },
  {
    slug: 'aprilia',
    name: 'Aprilia',
    displayName: 'Aprilia',
    firestoreValue: 'Aprilia',
    metaTitle: "Concessionnaire Aprilia en France : 52 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Aprilia en France parmi 52 adresses vérifiées. RS 125, Tuono, RSV4, Shiver, SR GT — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Aprilia en France',
    intro: [
      "Aprilia, marque italienne membre du groupe Piaggio, dispose d'un réseau de plus de 50 concessions agréées en France. Des RS 125 sportives aux RSV4 supersportives en passant par les Tuono roadsters et les SR GT scooters, Aprilia est la marque des passionnés de sportives italiennes.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Aprilia en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Aprilia près de chez moi ?", a: "LabelMoto recense 52 concessions Aprilia en France. Utilisez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Quel est le prix d'entretien d'une Aprilia RS 125 ?", a: "Une révision Aprilia RS 125 coûte environ 200 à 300 € en concession officielle. Les intervalles sont de 5 000 km." },
      { q: "Aprilia propose-t-elle des motos en permis A2 ?", a: "Oui, la RS 125 est idéale pour le permis A1. La Tuono 660 et la RS 660 sont bridables en A2 — des motos particulièrement sportives pour jeunes permis exigeants." },
    ],
  },
  {
    slug: 'vespa',
    name: 'Vespa',
    displayName: 'Vespa',
    firestoreValue: 'Vespa',
    metaTitle: "Concessionnaire Vespa en France : 50 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Vespa en France parmi 50 adresses vérifiées. GTS, GTV, Primavera, Sprint, Elettrica — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Vespa en France',
    intro: [
      "Vespa, l'icône italienne du scooter depuis 1946, dispose d'un réseau de plus de 50 concessionnaires agréés en France. Des Primavera 125 aux GTS 300 en passant par la Vespa Elettrica, la marque Piaggio incarne l'élégance italienne accessible et durable.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Vespa en France avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Vespa près de chez moi ?", a: "LabelMoto recense 50 concessions Vespa en France. Utilisez la carte interactive pour trouver l'adresse la plus proche avec les horaires." },
      { q: "Quel est le prix d'entretien d'une Vespa ?", a: "Une révision Vespa Primavera 125 coûte environ 150 à 250 € en concession officielle. La GTS 300 est un peu plus chère à entretenir, autour de 200 à 350 €." },
      { q: "La Vespa Elettrica est-elle disponible en France ?", a: "Oui, la Vespa Elettrica est disponible dans les concessions agréées en France. Elle est éligible aux aides à l'achat de véhicules électriques. Renseignez-vous auprès de votre concessionnaire." },
    ],
  },

  {
    slug: 'cf-moto',
    name: 'CF Moto',
    displayName: 'CFMOTO',
    firestoreValue: 'CF Moto',
    metaTitle: "Concessionnaires CFMOTO en France : adresses et contacts | LabelMoto",
    metaDescription: "Trouvez un concessionnaire CFMOTO en France avec LabelMoto. Découvrez les professionnels référencés, l’histoire de CFMOTO, ses moteurs et son partenariat industriel avec KTM.",
    h1: 'Concessionnaires CFMOTO en France',
    aboutTitle: "À propos de CFMOTO",
    intro: [
      "Fondée en 1989 et basée à Hangzhou, CFMOTO est un constructeur chinois intégré de motos et de véhicules powersports. L’entreprise développe des moteurs, des véhicules complets et des composants, avec une activité R&D internationale. Sa coopération stratégique avec KTM a débuté en 2011 puis s’est structurée autour d’une coentreprise industrielle en Chine. Cette relation concerne certaines productions et plateformes, mais elle ne signifie pas que toute la gamme CFMOTO utilise des moteurs KTM."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Chine · 1989",
        "description": "CFMOTO est fondée en 1989 et a son siège à Hangzhou."
      },
      {
        "label": "Base industrielle",
        "value": "Hangzhou",
        "description": "Le groupe y concentre une part importante de sa production et de sa R&D."
      },
      {
        "label": "Positionnement",
        "value": "Moto & powersports",
        "description": "CFMOTO développe motos, véhicules tout-terrain, solutions électriques et composants."
      },
      {
        "label": "Partenariat majeur",
        "value": "KTM · depuis 2011",
        "description": "La coopération CFMOTO-KTM couvre des activités commerciales, industrielles et de production ciblées."
      }
    ],
    accordions: [
      {
        "id": "histoire-cfmoto",
        "title": "Histoire de CFMOTO",
        "content": "CFMOTO est créée en 1989 en Chine et construit progressivement son savoir-faire autour des moteurs, des composants puis des véhicules complets. La marque se développe ensuite à l’international sur les motos et les véhicules tout-terrain, avec Hangzhou comme base principale."
      },
      {
        "id": "industrie-rd-cfmoto",
        "title": "Industrie, R&D et intégration",
        "content": "CFMOTO se présente comme un constructeur intégré assurant la R&D, la production et la distribution de motos, véhicules tout-terrain et composants. Ses communications récentes mettent en avant plusieurs centres d’innovation et un développement technique de plus en plus international."
      },
      {
        "id": "partenariat-ktm",
        "title": "Le partenariat CFMOTO-KTM",
        "content": "La coopération stratégique avec KTM remonte à 2011. Une coentreprise industrielle a ensuite été mise en place en Chine. KTM indique aujourd’hui que son partenariat avec CFMOTO supervise notamment la production mondiale en Chine des KTM 790 Duke et 790 Adventure. Pour les CFMOTO utilisant des technologies apparentées à l’univers KTM, la filiation exacte doit être décrite modèle par modèle."
      },
      {
        "id": "entretien-cfmoto",
        "title": "Révisions et entretien",
        "content": "Les besoins d’une 450MT, d’une 700MT, d’une 800MT, d’une 800NK ou d’une autre CFMOTO diffèrent fortement. L’origine d’une plateforme ne suffit pas à déduire les intervalles ou les pièces : manuel utilisateur, documentation atelier et millésime exact doivent rester prioritaires."
      },
      {
        "id": "faq-cfmoto",
        "title": "FAQ CFMOTO",
        "content": "CFMOTO est un constructeur chinois fondé en 1989. La marque développe ses propres familles de moteurs et travaille aussi avec des partenaires technologiques. Son lien avec KTM est réel et structuré, mais toutes les CFMOTO ne sont pas équipées d’un moteur KTM. L’origine exacte d’une mécanique doit être vérifiée pour le modèle concerné."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de CFMOTO ?",
        "a": "Fondée en 1989 et basée à Hangzhou, CFMOTO est un constructeur chinois intégré de motos et de véhicules powersports. L’entreprise développe des moteurs, des véhicules complets et des composants, avec une activité R&D internationale."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de CFMOTO ?",
        "a": "CFMOTO se présente comme un constructeur intégré assurant la R&D, la production et la distribution de motos, véhicules tout-terrain et composants. Ses communications récentes mettent en avant plusieurs centres d’innovation et un développement technique de plus en plus international."
      },
      {
        "q": "Comment aborder l’entretien d’une CFMOTO ?",
        "a": "Les besoins d’une 450MT, d’une 700MT, d’une 800MT, d’une 800NK ou d’une autre CFMOTO diffèrent fortement. L’origine d’une plateforme ne suffit pas à déduire les intervalles ou les pièces : manuel utilisateur, documentation atelier et millésime exact doivent rester prioritaires."
      },
      {
        "q": "Quels sont les points clés à retenir sur CFMOTO ?",
        "a": "CFMOTO est un constructeur chinois fondé en 1989. La marque développe ses propres familles de moteurs et travaille aussi avec des partenaires technologiques. Son lien avec KTM est réel et structuré, mais toutes les CFMOTO ne sont pas équipées d’un moteur KTM. L’origine exacte d’une mécanique doit être vérifiée pour le modèle concerné."
      }
    ],
  },
  {
    slug: 'peugeot-motocycles',
    name: 'Peugeot Motocycles',
    displayName: 'Peugeot Motocycles',
    firestoreValue: 'Peugeot Motocycles',
    metaTitle: "Concessionnaire Peugeot Motocycles en France : 81 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Peugeot Motocycles en France parmi 81 adresses vérifiées. Django, Kisbee, Tweet, Metropolis — scooters Peugeot avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Peugeot Motocycles en France',
    intro: [
      "Peugeot Motocycles est l'un des plus anciens fabricants de deux-roues au monde et dispose d'un réseau solide de plus de 80 concessionnaires en France. Spécialisé dans les scooters (Django, Kisbee, Tweet, Metropolis), Peugeot propose des véhicules urbains accessibles et bien entretenus par un réseau national dense.",
      "LabelMoto recense tous les concessionnaires Peugeot Motocycles en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Peugeot Motocycles près de chez moi ?", a: "LabelMoto recense 81 concessions Peugeot Motocycles en France. Utilisez la carte interactive pour trouver l'adresse la plus proche avec les horaires." },
      { q: "Les scooters Peugeot Motocycles sont-ils fiables ?", a: "Oui, les scooters Peugeot sont reconnus pour leur fiabilité et leur robustesse. Le Django et le Metropolis sont particulièrement bien notés. Le réseau SAV national est un vrai avantage." },
      { q: "Quel est le prix d'entretien d'un scooter Peugeot ?", a: "L'entretien d'un scooter Peugeot est dans la moyenne du marché : comptez 150 à 250 € pour une révision standard en concession agréée." },
    ],
  },
  {
    slug: 'moto-guzzi',
    name: 'Moto Guzzi',
    displayName: 'Moto Guzzi',
    firestoreValue: 'Moto Guzzi',
    metaTitle: "Concessionnaire Moto Guzzi en France : 31 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Moto Guzzi en France parmi 31 adresses vérifiées. V7, V9, V100 Mandello, Stelvio — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Moto Guzzi en France',
    intro: [
      "Moto Guzzi est une marque italienne fondée en 1921 et intimement liée à Mandello del Lario, sur les rives du lac de Côme. La marque a construit une forte identité autour de son bicylindre en V transversal et d’un héritage mêlant route, voyage et compétition. Après plusieurs changements de propriétaire, Moto Guzzi rejoint le groupe Piaggio en 2004. Son site historique de Mandello a fait l’objet d’une profonde modernisation inaugurée en 2026."
    ],
    faq: [
      {
        "q": "Moto Guzzi est-elle une marque italienne ?",
        "a": "Oui. Moto Guzzi est née en Italie en 1921 et reste historiquement implantée à Mandello del Lario."
      },
      {
        "q": "À quel groupe appartient Moto Guzzi ?",
        "a": "Moto Guzzi appartient au Piaggio Group depuis 2004."
      },
      {
        "q": "Quelle est la particularité mécanique la plus connue de Moto Guzzi ?",
        "a": "La marque est particulièrement associée à son bicylindre en V transversal à 90°, utilisé sur de nombreuses générations de motos."
      }
    ],
    aboutTitle: "À propos de Moto Guzzi",
    highlights: [
      {
        "label": "Origine",
        "value": "Italie · 1921",
        "description": "Moto Guzzi est fondée en 1921 par Emanuele Vittorio Parodi, Giorgio Parodi et Carlo Guzzi."
      },
      {
        "label": "Maison historique",
        "value": "Mandello del Lario",
        "description": "Le site de Mandello est associé à la marque depuis ses débuts."
      },
      {
        "label": "Signature mécanique",
        "value": "V-twin transversal",
        "description": "Le bicylindre en V transversal est devenu l’une des signatures de Moto Guzzi."
      },
      {
        "label": "Groupe",
        "value": "Piaggio Group · depuis 2004",
        "description": "Moto Guzzi fait partie du groupe Piaggio depuis 2004."
      }
    ],
    accordions: [
      {
        "id": "histoire-guzzi",
        "title": "Histoire de Moto Guzzi",
        "content": "Moto Guzzi est fondée en 1921 par Emanuele Vittorio Parodi, Giorgio Parodi et Carlo Guzzi. La marque s’installe à Mandello del Lario et développe rapidement une identité technique forte, soutenue par de nombreux succès sportifs au cours de la première moitié du XXe siècle."
      },
      {
        "id": "groupe-guzzi",
        "title": "De Moto Guzzi à Piaggio",
        "content": "L’histoire de Moto Guzzi passe par plusieurs propriétaires et structures industrielles. Après la période De Tomaso puis son intégration à Aprilia, la marque rejoint le groupe Piaggio en 2004, où elle évolue aujourd’hui aux côtés d’Aprilia, Vespa et Piaggio."
      },
      {
        "id": "v-twin-guzzi",
        "title": "Le V-twin transversal",
        "content": "Le bicylindre en V transversal à 90° apparaît dans les années 1960 et devient l’une des architectures les plus emblématiques de Moto Guzzi. Cette configuration équipe encore plusieurs familles modernes et participe fortement à l’identité visuelle et mécanique de la marque."
      },
      {
        "id": "mandello-guzzi",
        "title": "Mandello del Lario : usine, musée et patrimoine",
        "content": "Mandello del Lario reste le cœur de Moto Guzzi. Le site historique a été profondément rénové et accueille à la fois les activités industrielles, le musée et des espaces destinés au public et aux passionnés."
      },
      {
        "id": "competition-guzzi",
        "title": "Une longue histoire en compétition",
        "content": "Moto Guzzi possède un important palmarès sportif construit avant son retrait officiel des Grands Prix à la fin des années 1950. Cet héritage reste un élément central de l’histoire et de l’image de la marque."
      }
    ],
  },
  {
    slug: 'indian',
    name: 'Indian Motorcycle',
    displayName: 'Indian Motorcycle',
    firestoreValue: 'Indian',
    metaTitle: "Concessionnaire Indian Motorcycle en France : 33 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Indian Motorcycle en France parmi 33 adresses vérifiées. Scout, Chief, Challenger, FTR — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Indian Motorcycle en France',
    intro: [
      "Indian Motorcycle est une marque américaine fondée en 1901 à Springfield, dans le Massachusetts, par George Hendee et Oscar Hedstrom. Après plusieurs décennies mouvementées, la marque moderne est relancée sous Polaris à partir de 2011. Depuis février 2026, Indian Motorcycle fonctionne comme une société autonome contrôlée majoritairement par Carolwood LP, tandis que Polaris conserve une participation minoritaire."
    ],
    faq: [
      {
        "q": "À qui appartient Indian Motorcycle aujourd’hui ?",
        "a": "Depuis février 2026, Indian Motorcycle est une société autonome contrôlée majoritairement par Carolwood LP. Polaris conserve une participation minoritaire."
      },
      {
        "q": "Où sont conçues et fabriquées les Indian ?",
        "a": "La marque s’appuie sur plusieurs sites aux États-Unis ainsi que sur un centre de design et de technologie en Suisse."
      },
      {
        "q": "Quels moteurs équipent les Indian actuelles ?",
        "a": "Les principales familles sont Thunderstroke, PowerPlus et SpeedPlus, selon les modèles et les générations."
      }
    ],
    aboutTitle: "À propos de Indian Motorcycle",
    highlights: [
      {
        "label": "Origine",
        "value": "États-Unis · 1901",
        "description": "Indian Motorcycle naît à Springfield, Massachusetts."
      },
      {
        "label": "Relance moderne",
        "value": "Polaris · 2011",
        "description": "Polaris relance durablement la marque au début des années 2010."
      },
      {
        "label": "Depuis 2026",
        "value": "Société autonome",
        "description": "Carolwood LP détient la participation majoritaire, Polaris restant actionnaire minoritaire."
      },
      {
        "label": "Familles moteur",
        "value": "Thunderstroke · PowerPlus · SpeedPlus",
        "description": "Plusieurs architectures équipent les gammes Indian actuelles."
      }
    ],
    accordions: [
      {
        "id": "histoire-indian",
        "title": "Histoire d’Indian Motorcycle",
        "content": "George Hendee et Oscar Hedstrom lancent Indian Motorcycle à Springfield au début du XXe siècle. Les Scout et Chief deviennent rapidement des modèles emblématiques. L’entreprise historique cesse son activité en 1953, avant plusieurs tentatives de renaissance et une relance durable sous Polaris à partir de 2011."
      },
      {
        "id": "carolwood-indian",
        "title": "Indian Motorcycle depuis 2026",
        "content": "En février 2026, Indian Motorcycle devient une société autonome avec Carolwood LP comme actionnaire majoritaire. Polaris conserve une participation minoritaire après avoir piloté la relance moderne de la marque pendant plus d’une décennie."
      },
      {
        "id": "sites-indian",
        "title": "Sites industriels et développement",
        "content": "Indian s’appuie notamment sur les installations de Spirit Lake dans l’Iowa, de Monticello dans le Minnesota et sur un centre de design et de technologie à Burgdorf, en Suisse. La conception et la production sont donc réparties entre plusieurs sites."
      },
      {
        "id": "moteurs-indian",
        "title": "Thunderstroke, PowerPlus et SpeedPlus",
        "content": "La gamme actuelle utilise plusieurs familles de moteurs. Le Thunderstroke équipe notamment les cruisers traditionnels, le PowerPlus les modèles les plus performants et le SpeedPlus certaines générations récentes de Scout. Les caractéristiques varient selon la famille et le modèle."
      }
    ],
  },
  {
    slug: 'zontes',
    name: 'Zontes',
    displayName: 'Zontes',
    firestoreValue: 'Zontes',
    metaTitle: "Concessionnaire Zontes en France : 46 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Zontes en France parmi 46 adresses vérifiées. 125G, 350T, 350ADV, 350R — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Zontes en France',
    aboutTitle: "À propos de Zontes",
    intro: [
      "Zontes est l’une des marques de Guangdong Tayo Motorcycle Technology, entreprise chinoise fondée en 2003. Tayo met en avant un haut niveau d’intégration industrielle, l’usinage de précision, la fabrication de composants et un portefeuille important de brevets. La montée en gamme récente de Zontes est illustrée par la famille 703 et son moteur trois-cylindres de 699 cm³, présenté par Zontes France comme développé intégralement en interne."
    ],
    highlights: [
      {
        "label": "Origine industrielle",
        "value": "Chine · 2003",
        "description": "Guangdong Tayo Motorcycle Technology est fondée en 2003."
      },
      {
        "label": "Groupe",
        "value": "Tayo Motorcycle",
        "description": "Zontes est l’une des marques de Guangdong Tayo Motorcycle Technology."
      },
      {
        "label": "Innovation",
        "value": "413 brevets indiqués",
        "description": "Le profil officiel mentionne 256 brevets de design, 121 modèles d’utilité et 36 brevets d’invention."
      },
      {
        "label": "Montée en gamme",
        "value": "3 cylindres · 699 cm³",
        "description": "Le moteur de la famille 703 est présenté par Zontes France comme conçu intégralement en interne."
      }
    ],
    accordions: [
      {
        "id": "histoire-zontes",
        "title": "Histoire de Zontes",
        "content": "Zontes est une marque de Guangdong Tayo Motorcycle Technology, société fondée en 2003. Le groupe se positionne sur les motos de moyenne et grosse cylindrée avec une stratégie centrée sur l’innovation, la fabrication intégrée et le développement international."
      },
      {
        "id": "tayo-integration-zontes",
        "title": "Tayo, intégration industrielle et brevets",
        "content": "Le profil officiel de Tayo indique un site de 600 mu, environ 3 600 salariés et un portefeuille de 256 brevets de design, 121 modèles d’utilité et 36 brevets d’invention. Ces données appuient l’image d’un constructeur fortement orienté industrialisation et développement interne, sans pour autant signifier que chaque composant de chaque moto est fabriqué en interne."
      },
      {
        "id": "moteur-703-zontes",
        "title": "Le moteur trois-cylindres 703",
        "content": "La famille 703 marque une étape importante dans la montée en cylindrée de Zontes. Zontes France présente le moteur trois-cylindres de 699 cm³ comme développé intégralement en interne. Cette affirmation est solide pour cette famille précise, mais ne doit pas être extrapolée à l’origine de chaque moteur ou composant de toute la gamme."
      },
      {
        "id": "entretien-zontes",
        "title": "Révisions et entretien",
        "content": "Une 125, une 350/368 et une 703 n’ont pas la même mécanique ni le même calendrier. Les intervalles, références de consommables et coûts doivent être établis sur la documentation du modèle et du millésime concernés."
      },
      {
        "id": "faq-zontes",
        "title": "FAQ Zontes",
        "content": "Zontes est une marque chinoise de Guangdong Tayo Motorcycle Technology. Tayo est fondée en 2003 et revendique un important portefeuille de brevets. La marque développe certaines motorisations en interne, dont le trois-cylindres 699 cm³ de la famille 703. Il ne faut toutefois pas conclure que tous les composants de toute la gamme sont fabriqués par Tayo sans vérification modèle par modèle."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Zontes ?",
        "a": "Zontes est l’une des marques de Guangdong Tayo Motorcycle Technology, entreprise chinoise fondée en 2003. Tayo met en avant un haut niveau d’intégration industrielle, l’usinage de précision, la fabrication de composants et un portefeuille important de brevets."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Zontes ?",
        "a": "Le profil officiel de Tayo indique un site de 600 mu, environ 3 600 salariés et un portefeuille de 256 brevets de design, 121 modèles d’utilité et 36 brevets d’invention. Ces données appuient l’image d’un constructeur fortement orienté industrialisation et développement interne, sans pour autant signifier que chaque composant de chaque moto est fabriqué en interne."
      },
      {
        "q": "Comment aborder l’entretien d’une Zontes ?",
        "a": "Une 125, une 350/368 et une 703 n’ont pas la même mécanique ni le même calendrier. Les intervalles, références de consommables et coûts doivent être établis sur la documentation du modèle et du millésime concernés."
      },
      {
        "q": "Quels sont les points clés à retenir sur Zontes ?",
        "a": "Zontes est une marque chinoise de Guangdong Tayo Motorcycle Technology. Tayo est fondée en 2003 et revendique un important portefeuille de brevets. La marque développe certaines motorisations en interne, dont le trois-cylindres 699 cm³ de la famille 703. Il ne faut toutefois pas conclure que tous les composants de toute la gamme sont fabriqués par Tayo sans vérification modèle par modèle."
      }
    ],
  },
  {
    slug: 'voge',
    name: 'VOGE',
    displayName: 'VOGE',
    firestoreValue: 'VOGE',
    metaTitle: "Concessionnaires VOGE en France : adresses et contacts | LabelMoto",
    metaDescription: "Trouvez un concessionnaire VOGE en France avec LabelMoto. Découvrez les professionnels référencés, l’histoire de Voge, son lien avec Loncin et ses principales technologies.",
    h1: 'Concessionnaires VOGE en France',
    aboutTitle: 'À propos de Voge',
    intro: [
      "Voge est la marque premium du groupe chinois Loncin, lancée en 2018 pour proposer des motos plus ambitieuses en matière de design, d’équipement et de technologie.",
      "La marque s’appuie sur l’expérience industrielle d’un grand motoriste chinois, connu notamment pour sa coopération avec BMW depuis 2005 sur plusieurs moteurs et projets de production. Certaines Voge, comme la 900DS, attirent particulièrement l’attention pour leur proximité technique avec des plateformes issues de l’écosystème Loncin-BMW. Sur cette page, retrouvez les concessionnaires Voge en France ainsi que des repères utiles sur la marque, ses modèles et ses motorisations.",
    ],
    highlights: [
      {
        label: "Groupe",
        value: "Loncin Motor",
        description: "Voge est la marque haut de gamme du groupe industriel chinois Loncin.",
      },
      {
        label: "Lancement",
        value: "2018",
        description: "La marque Voge a été officiellement lancée en septembre 2018.",
      },
      {
        label: "Positionnement",
        value: "Premium / export",
        description: "Voge vise le segment moyen et haut de gamme, avec une orientation claire vers les marchés internationaux.",
      },
      {
        label: "Lien technique",
        value: "Écosystème Loncin-BMW",
        description: "Loncin coopère avec BMW depuis 2005 sur plusieurs projets moteur et industriels.",
      },
    ],
    accordions: [
      {
        id: "histoire-voge",
        title: "Histoire de Voge",
        content: "Voge est née en 2018 comme marque premium de Loncin Motor Co., Ltd. Son lancement répond à une stratégie claire : faire monter en gamme l’expertise industrielle du groupe et proposer des motos capables de mieux rivaliser avec les constructeurs internationaux sur les marchés export. Contrairement à une jeune marque sans base industrielle, Voge s’appuie sur l’héritage d’un groupe déjà fortement implanté dans la fabrication de motos, de moteurs et de composants mécaniques.",
      },
      {
        id: "conception-usine-fabrication",
        title: "Conception, usine et fabrication",
        content: "Voge repose sur les capacités industrielles de Loncin, groupe basé à Chongqing. Cette base donne à la marque un profil différent de nombreuses autres marques chinoises récentes : elle bénéficie d’une expérience de production de masse, d’un savoir-faire moteur ancien et de processus industriels développés pour des projets à standard élevé. Cette origine explique en partie la perception plus mature de certaines Voge en matière de finition, d’équipement et de cohérence technique.",
      },
      {
        id: "moteurs-plateformes-partagees",
        title: "Moteurs et plateformes partagées",
        content: "Le sujet le plus important concernant Voge est son lien industriel avec BMW via Loncin. Loncin coopère avec BMW depuis 2005, d’abord sur des moteurs 650 cm3, puis sur des projets bicylindres de plus forte cylindrée et des scooters. Cela ne signifie pas que toute la gamme Voge utilise des moteurs BMW, mais certaines motos Voge reposent sur des bases techniques issues de l’écosystème Loncin-BMW. Le cas le plus connu est la Voge 900DS, souvent présentée comme utilisant la base bicylindre parallèle de 895 cm3 fournie par Loncin à BMW pour la famille F 900.",
      },
      {
        id: "entretien-voge",
        title: "Ce qu’il faut savoir pour l’entretien",
        content: "L’entretien d’une Voge dépend avant tout de la cylindrée, du type de moteur et du niveau d’équipement de la moto. La gamme couvre des usages variés, du trail au scooter GT, avec des mécaniques qui n’ont pas toutes le même niveau de complexité ni la même origine technique. Les intervalles de révision, les consommables et les principales opérations d’entretien peuvent donc varier sensiblement d’un modèle à l’autre. Il est recommandé de consulter le programme d’entretien spécifique à sa Voge et de respecter les préconisations du constructeur.",
      },
    ],
    faq: [
      {
        q: "Voge est-elle une marque chinoise ?",
        a: "Oui, Voge est une marque chinoise appartenant au groupe Loncin.",
      },
      {
        q: "Qui fabrique les motos Voge ?",
        a: "Les motos Voge sont produites dans l’écosystème industriel de Loncin.",
      },
      {
        q: "Voge a-t-elle un lien avec BMW ?",
        a: "Oui, via la coopération historique entre Loncin et BMW sur plusieurs projets moteur et industriels.",
      },
      {
        q: "Toutes les Voge ont-elles un moteur BMW ?",
        a: "Non. Il faut distinguer partenariat industriel, base technique partagée et moteur strictement identique.",
      },
    ],
  },
  {
    slug: 'mash',
    name: 'Mash',
    displayName: 'Mash',
    firestoreValue: 'Mash',
    metaTitle: "Concessionnaire Mash en France : 34 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Mash en France parmi 34 adresses vérifiées. Five, X-Ride, Fifty, Dirtmax — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Mash en France',
    intro: [
      "Mash est une marque française distribuant des motos d'inspiration rétro produites en Chine, présente dans plus de 30 points de vente en France. Ses modèles 125cc (Five, X-Ride, Scrambler) séduisent par leur style vintage accessible et leur prix d'appel très bas, parfaits pour les débutants et les budgets limités.",
      "LabelMoto recense tous les concessionnaires et distributeurs Mash en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Mash près de chez moi ?", a: "LabelMoto recense 34 points de vente Mash en France. Mash est souvent vendu chez des concessionnaires multimarques ou des spécialistes 125cc. Consultez la carte interactive." },
      { q: "Mash est-elle une bonne marque pour débuter ?", a: "Mash propose des 125cc à des prix très accessibles (2 000 à 3 500 €), idéaux pour un premier deux-roues. La qualité s'est améliorée mais reste inférieure aux marques japonaises. Le style rétro est un vrai atout esthétique." },
      { q: "Quel est le prix d'entretien d'une Mash ?", a: "L'entretien d'une Mash 125 est économique : 100 à 180 € pour une révision standard. Les pièces sont faciles à trouver et peu chères." },
    ],
  },
  {
    slug: 'husqvarna',
    name: 'Husqvarna',
    displayName: 'Husqvarna Motorcycles',
    firestoreValue: 'Husqvarna',
    metaTitle: "Concessionnaire Husqvarna en France : 23 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Husqvarna en France parmi 23 adresses vérifiées. Svartpilen, Vitpilen, Norden 901 — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Husqvarna Motorcycles en France',
    aboutTitle: "À propos de Husqvarna",
    intro: [
      "Husqvarna est une marque d’origine suédoise dont la production moto débute en 1903. Son identité s’est construite autour du motocross, de l’enduro et des machines légères. Après plusieurs changements de propriétaire, Husqvarna Motorcycles rejoint le groupe KTM en 2013. Le groupe est aujourd’hui intégré à Bajaj Mobility AG, tandis que la marque conserve une identité propre et partage une partie importante de son environnement technique et industriel avec KTM."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Suède · 1903",
        "description": "Husqvarna produit sa première moto en 1903 à Huskvarna."
      },
      {
        "label": "Héritage",
        "value": "Motocross · Enduro",
        "description": "Le tout-terrain constitue l’un des piliers historiques de la marque."
      },
      {
        "label": "Intégration moderne",
        "value": "KTM Group · depuis 2013",
        "description": "Husqvarna Motorcycles rejoint l’écosystème KTM en 2013."
      },
      {
        "label": "Groupe actuel",
        "value": "Bajaj Mobility AG",
        "description": "La communication officielle Husqvarna présente aujourd’hui l’ancien groupe PIERER Mobility sous le nom Bajaj Mobility AG."
      }
    ],
    accordions: [
      {
        "id": "histoire-husqvarna",
        "title": "Histoire de Husqvarna",
        "content": "Les origines industrielles de Husqvarna remontent à 1689 en Suède, mais l’aventure moto commence en 1903 avec une bicyclette motorisée. La marque développe ensuite une réputation internationale en tout-terrain, notamment en motocross et enduro."
      },
      {
        "id": "transitions-husqvarna",
        "title": "Des origines suédoises à l’organisation actuelle",
        "content": "Husqvarna Motorcycles passe notamment sous contrôle BMW en 2007 avant d’être acquise par le groupe KTM en 2013. La marque officielle indique aujourd’hui que ce groupe est connu sous le nom de Bajaj Mobility AG. L’héritage reste suédois, alors que l’organisation moderne est intégrée à un groupe industriel autrichien sous contrôle Bajaj."
      },
      {
        "id": "plateformes-ktm-husqvarna",
        "title": "Plateformes et moteurs partagés avec KTM",
        "content": "De nombreuses Husqvarna modernes utilisent des bases mécaniques, composants et plateformes proches de KTM. Cela ne signifie pas que chaque modèle est strictement identique : géométrie, réglages, électronique, équipement et positionnement peuvent différer. Les correspondances doivent être vérifiées modèle par modèle."
      },
      {
        "id": "entretien-husqvarna",
        "title": "Révisions et entretien",
        "content": "Une TE ou FE d’enduro, une Norden 901, une Vitpilen, une Svartpilen ou une 701 Supermoto n’ont pas les mêmes contraintes. L’usage offroad peut aussi modifier fortement la fréquence de contrôle. Les données de maintenance doivent donc être rattachées au modèle, au millésime et à l’usage réel."
      },
      {
        "id": "faq-husqvarna",
        "title": "FAQ Husqvarna",
        "content": "Husqvarna est historiquement une marque suédoise et produit des motos depuis 1903. Son organisation moderne est intégrée au groupe KTM, aujourd’hui sous Bajaj Mobility AG. De nombreux modèles partagent des technologies avec KTM, mais il faut vérifier la plateforme et la version avant de conclure à une équivalence technique complète."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Husqvarna Motorcycles ?",
        "a": "Husqvarna est une marque d’origine suédoise dont la production moto débute en 1903. Son identité s’est construite autour du motocross, de l’enduro et des machines légères."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Husqvarna Motorcycles ?",
        "a": "De nombreuses Husqvarna modernes utilisent des bases mécaniques, composants et plateformes proches de KTM. Cela ne signifie pas que chaque modèle est strictement identique : géométrie, réglages, électronique, équipement et positionnement peuvent différer."
      },
      {
        "q": "Comment aborder l’entretien d’une Husqvarna Motorcycles ?",
        "a": "Une TE ou FE d’enduro, une Norden 901, une Vitpilen, une Svartpilen ou une 701 Supermoto n’ont pas les mêmes contraintes. L’usage offroad peut aussi modifier fortement la fréquence de contrôle."
      },
      {
        "q": "Quels sont les points clés à retenir sur Husqvarna Motorcycles ?",
        "a": "Husqvarna est historiquement une marque suédoise et produit des motos depuis 1903. Son organisation moderne est intégrée au groupe KTM, aujourd’hui sous Bajaj Mobility AG. De nombreux modèles partagent des technologies avec KTM, mais il faut vérifier la plateforme et la version avant de conclure à une équivalence technique complète."
      }
    ],
  },
  {
    slug: 'qj-motor',
    name: 'QJ Motor',
    displayName: 'QJ Motor',
    firestoreValue: 'QJ Motor',
    metaTitle: "Concessionnaire QJ Motor en France : 27 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire QJ Motor en France parmi 27 adresses vérifiées. SRK 400, SRK 600, SRT 800, SRS 400 — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires QJ Motor en France',
    aboutTitle: "À propos de QJMotor",
    intro: [
      "QJMotor est la marque internationale de Qianjiang Motorcycle, entreprise chinoise fondée en 1985 à Wenling, dans le Zhejiang. Qianjiang acquiert Benelli en 2005 puis rejoint l’écosystème Geely en 2016, avant le lancement de la marque QJMOTOR en 2020. Le groupe dispose d’une importante capacité de production de motos et de moteurs et développe plusieurs architectures mécaniques. Une coopération stratégique avec Harley-Davidson est annoncée en 2019."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Chine · 1985",
        "description": "Qianjiang Motorcycle trouve son origine à Wenling, dans le Zhejiang."
      },
      {
        "label": "Groupe",
        "value": "Geely · depuis 2016",
        "description": "Geely devient le principal actionnaire de Qianjiang en 2016."
      },
      {
        "label": "Marque liée",
        "value": "Benelli · depuis 2005",
        "description": "Qianjiang acquiert Benelli en 2005."
      },
      {
        "label": "Gamme moteur",
        "value": "50 à 1200 cm³",
        "description": "QJMotor annonce des motorisations couvrant un large éventail de cylindrées et d’architectures."
      }
    ],
    accordions: [
      {
        "id": "histoire-qjmotor",
        "title": "Histoire de QJMotor",
        "content": "L’entreprise Qianjiang naît en 1985 à Wenling. Elle est introduite en Bourse de Shenzhen en 1999, acquiert Benelli en 2005, rejoint l’écosystème Geely en 2016 puis lance QJMOTOR en 2020 comme marque internationale à vocation plus haut de gamme."
      },
      {
        "id": "qianjiang-geely-benelli",
        "title": "Qianjiang, Geely et Benelli",
        "content": "QJMotor, Qianjiang, Geely et Benelli ne sont pas des synonymes. Qianjiang est l’entité industrielle moto, QJMotor est la marque internationale, Benelli est une marque italienne détenue par Qianjiang et Geely est le groupe de contrôle. Cette organisation explique l’existence de ressources et de plateformes communes au sein du groupe."
      },
      {
        "id": "industrie-partenariats-qj",
        "title": "Industrie, moteurs et partenariats",
        "content": "QJMotor développe plusieurs familles de moteurs et s’appuie sur une importante base industrielle. En 2019, Qianjiang a annoncé une coopération stratégique avec Harley-Davidson pour développer de nouveaux produits. Cela ne signifie pas que toute la gamme QJMotor partage des moteurs Harley-Davidson ou Benelli : le lien doit être démontré modèle par modèle."
      },
      {
        "id": "entretien-qjmotor",
        "title": "Révisions et entretien",
        "content": "Une SRK, une SRV, une SRT ou une sportive multicylindre n’ont pas les mêmes besoins. Les éventuelles parentés avec Benelli ou d’autres projets du groupe ne suffisent pas à déduire une compatibilité de pièce. Manuel, code moteur, référence de pièce et millésime doivent être vérifiés."
      },
      {
        "id": "faq-qjmotor",
        "title": "FAQ QJMotor",
        "content": "QJMotor est une marque chinoise issue de Qianjiang Motorcycle. Qianjiang appartient à l’écosystème Geely et détient Benelli depuis 2005. QJMotor développe et produit de nombreux moteurs, mais les correspondances avec Benelli, Harley-Davidson ou d’autres partenaires ne doivent jamais être généralisées à toute la gamme."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de QJ Motor ?",
        "a": "QJMotor est la marque internationale de Qianjiang Motorcycle, entreprise chinoise fondée en 1985 à Wenling, dans le Zhejiang. Qianjiang acquiert Benelli en 2005 puis rejoint l’écosystème Geely en 2016, avant le lancement de la marque QJMOTOR en 2020."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de QJ Motor ?",
        "a": "QJMotor développe plusieurs familles de moteurs et s’appuie sur une importante base industrielle. En 2019, Qianjiang a annoncé une coopération stratégique avec Harley-Davidson pour développer de nouveaux produits."
      },
      {
        "q": "Comment aborder l’entretien d’une QJ Motor ?",
        "a": "Une SRK, une SRV, une SRT ou une sportive multicylindre n’ont pas les mêmes besoins. Les éventuelles parentés avec Benelli ou d’autres projets du groupe ne suffisent pas à déduire une compatibilité de pièce."
      },
      {
        "q": "Quels sont les points clés à retenir sur QJ Motor ?",
        "a": "QJMotor est une marque chinoise issue de Qianjiang Motorcycle. Qianjiang appartient à l’écosystème Geely et détient Benelli depuis 2005. QJMotor développe et produit de nombreux moteurs, mais les correspondances avec Benelli, Harley-Davidson ou d’autres partenaires ne doivent jamais être généralisées à toute la gamme."
      }
    ],
  },
  {
    slug: 'benelli',
    name: 'Benelli',
    displayName: 'Benelli',
    firestoreValue: 'Benelli',
    metaTitle: "Concessionnaire Benelli en France : 20 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Benelli en France parmi 20 adresses vérifiées. TRK 502, Leoncino, 752S, TNT 600 — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Benelli en France',
    aboutTitle: "À propos de Benelli",
    intro: [
      "Benelli est une marque moto italienne née à Pesaro en 1911. Son histoire associe compétition, mécanique et design italien. Depuis 2005, la marque s’appuie sur l’écosystème industriel de Qianjiang : les sources officielles Benelli attribuent à Qianjiang la production et à Keeway un rôle dans la nouvelle administration, le design et le marketing, tandis que Pesaro reste un centre important pour le style et la R&D. Qianjiang a rejoint l’écosystème Geely en 2016. La Benelli contemporaine combine donc un héritage italien fort avec une base industrielle chinoise."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Italie · 1911",
        "description": "Benelli est née à Pesaro et fait partie des marques moto italiennes historiques."
      },
      {
        "label": "Centre italien",
        "value": "Pesaro",
        "description": "Le Centro Stile et la R&D Benelli restent ancrés à Pesaro."
      },
      {
        "label": "Base industrielle",
        "value": "Qianjiang",
        "description": "Depuis 2005, la production moderne de Benelli s’appuie sur le groupe Qianjiang."
      },
      {
        "label": "Groupe élargi",
        "value": "Geely · depuis 2016",
        "description": "Qianjiang a rejoint Geely Holding en 2016, sans faire de Geely le fabricant direct des motos Benelli."
      }
    ],
    accordions: [
      {
        "id": "histoire-benelli",
        "title": "Histoire de Benelli",
        "content": "Benelli naît à Pesaro en 1911 autour de la famille Benelli. L’atelier commence par la réparation et les pièces, construit son premier moteur en 1919 puis sa première véritable moto en 1921. La compétition et l’innovation mécanique installent ensuite durablement le nom Benelli dans l’histoire du motocyclisme italien."
      },
      {
        "id": "pesaro-style-rd",
        "title": "Pesaro, style et développement",
        "content": "Le siège historique de Pesaro conserve un rôle réel dans la définition des produits. Le Centro Stile Benelli, créé en 2015, et les équipes R&D de Pesaro sont mis en avant par la marque pour le design et le développement de plusieurs modèles. Cela ne signifie pas que toutes les pièces ou toute l’ingénierie sont exclusivement italiennes."
      },
      {
        "id": "qianjiang-production",
        "title": "Qianjiang, Keeway et fabrication moderne",
        "content": "En 2005, Benelli est reprise dans l’écosystème Qianjiang/Keeway. Benelli indique que Qianjiang a pris en charge la production, tandis que Keeway a conduit la nouvelle administration, le design et le marketing depuis Pesaro. La production moderne s’appuie largement sur les capacités industrielles de Qianjiang en Chine."
      },
      {
        "id": "moteurs-plateformes-benelli",
        "title": "Moteurs et plateformes partagées",
        "content": "Plusieurs Benelli contemporaines utilisent des moteurs ou plateformes développés au sein de l’écosystème Qianjiang, parfois proches de modèles QJMotor. Il faut toutefois distinguer plateforme commune, moteur apparenté, réglages spécifiques et pièces réellement interchangeables : ces équivalences doivent être vérifiées modèle par modèle."
      },
      {
        "id": "entretien-faq-benelli",
        "title": "Entretien et FAQ Benelli",
        "content": "Les intervalles et consommables varient fortement entre une BN 125, une Leoncino, une TRK 502, une TRK 702 ou une TRK 800. Benelli reste une marque italienne par son histoire et son identité, mais sa production actuelle repose largement sur Qianjiang en Chine. Le design et une partie du développement restent liés à Pesaro. Les correspondances de moteurs ou de pièces avec QJMotor doivent toujours être vérifiées sur la version et le millésime concernés."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Benelli ?",
        "a": "Benelli est une marque moto italienne née à Pesaro en 1911. Son histoire associe compétition, mécanique et design italien."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Benelli ?",
        "a": "Le siège historique de Pesaro conserve un rôle réel dans la définition des produits. Le Centro Stile Benelli, créé en 2015, et les équipes R&D de Pesaro sont mis en avant par la marque pour le design et le développement de plusieurs modèles."
      },
      {
        "q": "Comment aborder l’entretien d’une Benelli ?",
        "a": "Les intervalles et consommables varient fortement entre une BN 125, une Leoncino, une TRK 502, une TRK 702 ou une TRK 800. Benelli reste une marque italienne par son histoire et son identité, mais sa production actuelle repose largement sur Qianjiang en Chine."
      },
      {
        "q": "Quels sont les points clés à retenir sur Benelli ?",
        "a": "Les intervalles et consommables varient fortement entre une BN 125, une Leoncino, une TRK 502, une TRK 702 ou une TRK 800. Benelli reste une marque italienne par son histoire et son identité, mais sa production actuelle repose largement sur Qianjiang en Chine. Le design et une partie du développement restent liés à Pesaro. Les correspondances de moteurs ou de pièces avec QJMotor doivent toujours être vérifiées sur la version et le millésime concernés."
      }
    ],
  },
  {
    slug: 'rieju',
    name: 'Rieju',
    displayName: 'Rieju',
    firestoreValue: 'Rieju',
    metaTitle: "Concessionnaire Rieju en France : 28 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Rieju en France parmi 28 adresses vérifiées. MR 300, MR Racing, RS3, Mrt — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Rieju en France',
    intro: [
      "Rieju est une marque espagnole spécialisée dans les motos tout-terrain et trial, présente dans plus de 25 concessionnaires en France. Ses modèles MR, MRT et RS3 sont particulièrement appréciés des pratiquants d'enduro et de trial, avec des motorisations TPI issues de la technologie KTM.",
      "LabelMoto recense tous les concessionnaires Rieju en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Rieju près de chez moi ?", a: "LabelMoto recense 28 points de vente Rieju en France, souvent chez des spécialistes tout-terrain. Consultez la carte interactive pour trouver le plus proche." },
      { q: "Rieju est-elle une bonne marque pour l'enduro ?", a: "Oui, Rieju est reconnue dans le milieu enduro pour la qualité de ses motos MR 300 et MRT. L'utilisation de moteurs TPI (transfert port injection) issus de KTM est un gage de qualité technique." },
      { q: "Quelle Rieju choisir pour débuter l'enduro ?", a: "La Rieju MRT 50 et MRT 125 sont idéales pour débuter l'enduro. La MR 300 Pro est la référence pour les pilotes confirmés cherchant un 2-temps moderne et compétitif." },
    ],
  },
  {
    slug: 'sherco',
    name: 'Sherco',
    displayName: 'Sherco',
    firestoreValue: 'Sherco',
    metaTitle: "Concessionnaire Sherco en France : 27 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Sherco en France parmi 27 adresses vérifiées. SEF, SEF-R, ST Trial, SE Enduro — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Sherco en France',
    intro: [
      "Sherco est une marque française spécialisée dans l'enduro et le trial, présente dans plus de 25 concessionnaires agréés en France. Marque nationale, Sherco est particulièrement bien distribuée en France avec ses modèles SEF (enduro 4T), SE (enduro 2T) et ST (trial) qui rivalisent avec les meilleures marques espagnoles.",
      "LabelMoto recense tous les concessionnaires Sherco en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Sherco près de chez moi ?", a: "LabelMoto recense 27 points de vente Sherco en France. Consultez la carte interactive pour trouver un spécialiste Sherco près de chez vous." },
      { q: "Sherco est-elle une bonne marque d'enduro ?", a: "Oui, Sherco est une marque française reconnue internationalement en enduro et trial. Ses modèles SEF et ST sont utilisés par des pilotes professionnels dans les championnats mondiaux." },
      { q: "Quel entretien pour une Sherco enduro ?", a: "Les motos d'enduro demandent un entretien plus fréquent que les motos de route : vidange tous les 15-20 heures de roulage, filtre à air après chaque sortie. Comptez 200 à 400 € par révision chez un concessionnaire agréé." },
    ],
  },
  {
    slug: 'fantic',
    name: 'Fantic',
    displayName: 'Fantic',
    firestoreValue: 'Fantic',
    metaTitle: "Concessionnaire Fantic en France : 24 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Fantic en France parmi 24 adresses vérifiées. Caballero, XEF, XEF-R, Issimo — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Fantic en France',
    intro: [
      "Fantic est une marque italienne en pleine renaissance, présente dans plus de 20 concessionnaires agréés en France. Connue pour ses Caballero scrambler-rétro et ses motos d'enduro XEF, Fantic mise sur le style italien et la performance pour conquérir le marché européen.",
      "LabelMoto recense tous les concessionnaires Fantic en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Fantic près de chez moi ?", a: "LabelMoto recense 24 points de vente Fantic en France. Fantic est souvent distribué chez des concessionnaires multimarques. Consultez la carte interactive." },
      { q: "La Fantic Caballero est-elle adaptée à la ville ?", a: "Oui, les Caballero 125cc sont parfaites pour un usage urbain avec un style scrambler très tendance. Les versions 250 et 500cc conviennent pour les trajets mixtes ville-route." },
      { q: "Fantic propose-t-elle des motos électriques ?", a: "Oui, Fantic développe l'Issimo, un vélo électrique à assistance, et explore l'électrique pour ses motos d'enduro. La marque est engagée dans la transition vers l'électrique." },
    ],
  },
  {
    slug: 'beta',
    name: 'Beta',
    displayName: 'Beta',
    firestoreValue: 'Beta',
    metaTitle: "Concessionnaire Beta en France : 20 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Beta en France parmi 20 adresses vérifiées. RR Enduro, Xtrainer, RR Trial, Evo Trial — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Beta en France',
    intro: [
      "Beta est une marque italienne fondée en 1904, spécialisée dans le trial et l'enduro, avec une vingtaine de concessionnaires agréés en France. Ses motos RR Enduro et Evo Trial sont reconnues pour leur qualité et leurs performances dans les disciplines tout-terrain.",
      "LabelMoto recense tous les concessionnaires Beta en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Beta près de chez moi ?", a: "LabelMoto recense 20 points de vente Beta en France. Beta est souvent distribué chez des spécialistes tout-terrain. Consultez la carte interactive pour trouver le plus proche." },
      { q: "Beta est-elle une bonne marque de trial ?", a: "Oui, Beta est l'une des références mondiales du trial avec son modèle Evo, utilisé par des champions internationaux. La marque est également reconnue en enduro avec sa gamme RR." },
      { q: "Quel est le prix d'une Beta Evo Trial ?", a: "Les Beta Evo Trial sont vendues entre 6 000 et 9 000 € selon la cylindrée (125 à 300cc). C'est un tarif comparable aux marques espagnoles comme Montesa ou Gas Gas." },
    ],
  },
  {
    slug: 'kove',
    name: 'Kove',
    displayName: 'Kove',
    firestoreValue: 'Kove',
    metaTitle: "Concessionnaire Kove en France : 18 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire Kove en France parmi 18 adresses vérifiées. 450 Rally, 800X, 500X — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires Kove en France',
    aboutTitle: "À propos de Kove",
    intro: [
      "Kove est une marque chinoise fondée en 2017 à Chongqing. Elle se présente comme une entreprise technologique intégrant la R&D, la fabrication et la vente de motos de moyenne et grosse cylindrée ainsi que de composants clés. La compétition fait partie de son identité : en 2025, Beñat Fernandez a remporté le Championnat du monde FIM Supersport 300 sur Kove, offrant au constructeur chinois son premier titre mondial dans la catégorie. Pour les moteurs, les affirmations d’origine doivent rester vérifiées modèle par modèle."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "Chine · 2017",
        "description": "Kove est fondée en 2017 à Chongqing."
      },
      {
        "label": "Positionnement",
        "value": "Performance · Rallye · ADV",
        "description": "La marque concentre son image sur les motos sportives, rallye et adventure."
      },
      {
        "label": "R&D",
        "value": "100+ brevets accordés",
        "description": "Kove annonce plus de 100 brevets accordés sur le groupe motopropulseur, le châssis et d’autres systèmes."
      },
      {
        "label": "Compétition",
        "value": "Champion WorldSSP300 · 2025",
        "description": "Beñat Fernandez a offert à Kove son premier titre mondial WorldSSP300 en 2025."
      }
    ],
    accordions: [
      {
        "id": "histoire-kove",
        "title": "Histoire de Kove",
        "content": "Kove est créée à Chongqing en 2017 avec un positionnement directement orienté performance, rallye, adventure et sport. La marque se développe rapidement à l’international en s’appuyant sur une forte présence en compétition et sur un discours d’intégration technique."
      },
      {
        "id": "rd-fabrication-kove",
        "title": "R&D et fabrication",
        "content": "Kove se présente comme une entreprise intégrant recherche, développement, fabrication et vente. Sa communication actuelle met en avant un système technique complet allant du groupe motopropulseur au châssis et à la fabrication intelligente, ainsi qu’un portefeuille de plus de 100 brevets accordés."
      },
      {
        "id": "competition-moteurs-kove",
        "title": "Compétition et moteurs : ce qui est vérifié",
        "content": "Le Dakar et la compétition de vitesse sont des vitrines majeures pour Kove. En 2025, la marque a remporté son premier titre mondial WorldSSP300. En revanche, l’origine exacte des moteurs de série doit être traitée avec prudence : les générations, partenaires industriels et niveaux de développement peuvent varier selon les modèles. Il est préférable de documenter le code moteur et l’année plutôt que d’affirmer qu’une mécanique est entièrement maison ou issue d’un fournisseur externe sans preuve directe."
      },
      {
        "id": "entretien-kove",
        "title": "Révisions et entretien",
        "content": "Une 450 Rally, une 800X ou une sportive Kove n’ont pas les mêmes contraintes. L’usage rallye ou offroad peut accélérer l’usure et modifier les contrôles à effectuer. Les données d’entretien doivent venir du manuel correspondant au modèle, à la version et au marché."
      },
      {
        "id": "faq-kove",
        "title": "FAQ Kove",
        "content": "Kove est une marque chinoise fondée à Chongqing en 2017. Elle met en avant une intégration importante de la R&D et de la fabrication. Son engagement en compétition est avéré, avec un titre mondial WorldSSP300 en 2025. L’origine des moteurs doit toutefois être vérifiée au cas par cas, en particulier sur les modèles ayant connu plusieurs générations techniques."
      }
    ],
    faq: [
      {
        "q": "Quelle est l’origine de Kove ?",
        "a": "Kove est une marque chinoise fondée en 2017 à Chongqing. Elle se présente comme une entreprise technologique intégrant la R&D, la fabrication et la vente de motos de moyenne et grosse cylindrée ainsi que de composants clés."
      },
      {
        "q": "Que faut-il savoir sur la conception et la fabrication de Kove ?",
        "a": "Kove se présente comme une entreprise intégrant recherche, développement, fabrication et vente. Sa communication actuelle met en avant un système technique complet allant du groupe motopropulseur au châssis et à la fabrication intelligente, ainsi qu’un portefeuille de plus de 100 brevets accordés."
      },
      {
        "q": "Comment aborder l’entretien d’une Kove ?",
        "a": "Une 450 Rally, une 800X ou une sportive Kove n’ont pas les mêmes contraintes. L’usage rallye ou offroad peut accélérer l’usure et modifier les contrôles à effectuer."
      },
      {
        "q": "Quels sont les points clés à retenir sur Kove ?",
        "a": "Kove est une marque chinoise fondée à Chongqing en 2017. Elle met en avant une intégration importante de la R&D et de la fabrication. Son engagement en compétition est avéré, avec un titre mondial WorldSSP300 en 2025. L’origine des moteurs doit toutefois être vérifiée au cas par cas, en particulier sur les modèles ayant connu plusieurs générations techniques."
      }
    ],
  },

  {
    slug: 'dafy',
    name: 'Dafy Moto',
    displayName: 'Dafy Moto',
    firestoreValue: 'Dafy Moto',
    metaTitle: "Dafy Moto en France : magasins, ateliers et équipements | LabelMoto",
    metaDescription: "Trouvez les magasins et ateliers Dafy Moto référencés en France et découvrez l’histoire du réseau, ses services et ses principales activités.",
    h1: 'Magasins Dafy Moto en France',
    intro: [
      "Dafy est un réseau français spécialisé dans l’équipement du motard, les accessoires, les pièces et l’entretien moto. Créée à Clermont-Ferrand en 1974, l’enseigne s’est développée dans toute la France avec des magasins, des ateliers et une activité e-commerce. Le réseau regroupe notamment les formats Dafy Moto, Dafy Scoot et Dafy Speed."
    ],
    faq: [
      {
        "q": "Dafy est-il un réseau français ?",
        "a": "Oui. Dafy a été créé à Clermont-Ferrand en 1974 et s’est développé en France autour de l’équipement, des accessoires et de l’entretien moto."
      },
      {
        "q": "Que trouve-t-on dans un magasin Dafy ?",
        "a": "On y trouve principalement des casques, vêtements, protections, accessoires, pièces, pneumatiques et consommables pour moto et scooter."
      },
      {
        "q": "Les magasins Dafy proposent-ils un atelier ?",
        "a": "De nombreux points de vente disposent d’un atelier, mais les prestations proposées dépendent du magasin."
      }
    ],
    aboutTitle: "À propos de Dafy",
    highlights: [
      {
        "label": "Origine",
        "value": "France · 1974",
        "description": "Dafy est créé à Clermont-Ferrand en 1974."
      },
      {
        "label": "Réseau",
        "value": "Plus de 180 magasins et ateliers",
        "description": "L’enseigne dispose d’un maillage national associant vente et entretien."
      },
      {
        "label": "Activité",
        "value": "Équipement · Accessoires · Pièces",
        "description": "Dafy couvre l’essentiel des besoins du motard et de son deux-roues."
      },
      {
        "label": "Services",
        "value": "Magasins · Ateliers · E-commerce",
        "description": "Le réseau combine conseil en magasin, entretien et vente en ligne."
      }
    ],
    accordions: [
      {
        "id": "histoire-dafy",
        "title": "Histoire de Dafy",
        "content": "Dafy naît à Clermont-Ferrand en 1974. L’enseigne se développe progressivement autour de l’équipement du motard, des accessoires et des pièces, puis étend son réseau à l’échelle nationale. Cette implantation physique est aujourd’hui complétée par les ateliers et la vente en ligne."
      },
      {
        "id": "reseau-dafy",
        "title": "Un réseau national de magasins et d’ateliers",
        "content": "Dafy s’appuie sur plus de 180 magasins et ateliers en France. Selon les points de vente, les motards peuvent y trouver équipements, accessoires, pièces détachées, pneumatiques et prestations d’entretien."
      },
      {
        "id": "formats-dafy",
        "title": "Dafy Moto, Dafy Scoot et Dafy Speed",
        "content": "Le réseau se décline en plusieurs formats. Dafy Moto constitue l’enseigne principale, Dafy Scoot est orienté vers les usages scooter et urbains, tandis que Dafy Speed a été conçu pour renforcer la proximité dans les petites villes de moins de 20 000 habitants."
      },
      {
        "id": "marques-dafy",
        "title": "Équipements et marques du réseau",
        "content": "Dafy distribue de nombreuses marques d’équipement et d’accessoires moto et développe également des marques propres. L’offre couvre notamment les casques, vêtements, protections, bagagerie, pièces, consommables et pneumatiques."
      },
      {
        "id": "atelier-dafy",
        "title": "Entretien et services atelier",
        "content": "Une partie du réseau Dafy dispose d’ateliers capables d’assurer des opérations d’entretien courant, le montage de pneus, le remplacement de consommables et diverses interventions mécaniques. Les prestations proposées peuvent varier d’un magasin à l’autre."
      }
    ],
  },
  {
    slug: 'speedway',
    name: 'Speedway',
    displayName: 'Speedway',
    firestoreValue: 'Speedway',
    metaTitle: "Speedway en France : magasins et équipements moto | LabelMoto",
    metaDescription: "Trouvez les magasins Speedway référencés en France et découvrez l’histoire de l’enseigne, son réseau et son offre d’équipements et accessoires moto.",
    h1: 'Magasins Speedway en France',
    intro: [
      "Speedway est une enseigne française spécialisée dans l’équipement du motard et les accessoires pour moto et scooter. Le premier magasin ouvre à Marseille en 1979, avant le développement progressif d’un réseau national. L’enseigne compte aujourd’hui 22 magasins en France et complète son implantation physique par Speedway.fr, son activité de vente en ligne."
    ],
    faq: [
      {
        "q": "Speedway est-il un réseau français ?",
        "a": "Oui. Le premier magasin Speedway a ouvert à Marseille en 1979. L’enseigne s’est ensuite développée dans plusieurs régions et compte aujourd’hui 22 magasins en France."
      },
      {
        "q": "Que vend Speedway ?",
        "a": "Speedway est spécialisé dans l’équipement du motard et les accessoires pour moto et scooter : casques, vêtements, protections, bagagerie, pièces, pneumatiques et différents équipements pour le deux-roues."
      },
      {
        "q": "Peut-on acheter en ligne chez Speedway ?",
        "a": "Oui. Le projet e-commerce Speedway.fr a été lancé en 2007 et complète aujourd’hui le réseau de magasins physiques."
      }
    ],
    aboutTitle: "À propos de Speedway",
    highlights: [
      {
        "label": "Origine",
        "value": "Marseille · 1979",
        "description": "Le premier magasin Speedway est ouvert à Marseille par Jacques Marques."
      },
      {
        "label": "Réseau",
        "value": "22 magasins en France",
        "description": "Speedway dispose d’un réseau de magasins spécialisés répartis sur le territoire français."
      },
      {
        "label": "E-commerce",
        "value": "Speedway.fr · depuis 2007",
        "description": "Le projet e-commerce complète le réseau physique avec une offre accessible en ligne."
      },
      {
        "label": "Spécialité",
        "value": "Équipement & accessoires moto",
        "description": "Casques, vêtements, protections, bagagerie, pièces, pneumatiques et accessoires."
      }
    ],
    accordions: [
      {
        "id": "histoire-speedway",
        "title": "Histoire de Speedway",
        "content": "Speedway trouve ses origines à Marseille, où Jacques Marques ouvre le premier magasin en 1979. En 1988, Jean-Jacques et Maurice Coq reprennent l’activité. À partir de 1991, le réseau commence à s’étendre avec de nouveaux points de vente et poursuit ensuite son développement dans plusieurs grandes villes françaises."
      },
      {
        "id": "reseau-speedway",
        "title": "Le réseau de magasins Speedway",
        "content": "Speedway compte aujourd’hui 22 magasins en France. Le réseau associe des points de vente physiques spécialisés dans l’équipement moto et scooter à une activité en ligne, avec des implantations dans plusieurs grandes agglomérations françaises."
      },
      {
        "id": "equipements-speedway",
        "title": "Équipements et accessoires moto",
        "content": "L’enseigne distribue de nombreuses marques de casques, vêtements, gants, bottes et protections. Son catalogue comprend également de la bagagerie, des pièces détachées, des pneumatiques, des produits d’entretien et différents accessoires pour moto et scooter."
      },
      {
        "id": "services-speedway",
        "title": "Magasins et vente en ligne",
        "content": "Les magasins Speedway permettent de découvrir et d’essayer les équipements tout en bénéficiant de conseils. Speedway.fr complète cette présence physique avec la vente en ligne et différents services de livraison ou de retrait selon les produits et les points de vente."
      }
    ],
  },
  {
    slug: 'docbiker',
    name: "Doc'Biker",
    displayName: "Doc'Biker",
    firestoreValue: "Doc'Biker",
    metaTitle: "Doc'Biker : centres d’entretien moto et scooter | LabelMoto",
    metaDescription: "Trouvez les centres Doc'Biker référencés et découvrez leurs services d’entretien et de réparation multi-marques pour motos et scooters.",
    h1: "Centres Doc'Biker en France",
    intro: [
      "Doc’Biker est une enseigne française spécialisée depuis 1997 dans l’entretien et la réparation des deux et trois-roues. Son concept repose sur une prise en charge multi-marques, des forfaits d’entretien et des interventions rapides, avec un accueil sans rendez-vous mis en avant par le réseau. Les centres interviennent sur les motos et scooters thermiques comme électriques."
    ],
    faq: [
      {
        "q": "Depuis quand Doc’Biker existe-t-il ?",
        "a": "Doc’Biker est spécialisé dans l’entretien et la réparation des deux-roues depuis 1997."
      },
      {
        "q": "Quels services propose Doc’Biker ?",
        "a": "Les centres proposent notamment révisions, pneumatiques, freinage, transmission, suspensions, diagnostic, électricité et différentes opérations de réparation et d’entretien."
      },
      {
        "q": "Faut-il prendre rendez-vous chez Doc’Biker ?",
        "a": "Doc’Biker met en avant la prise en charge sans rendez-vous pour de nombreuses interventions. Pour une opération particulière ou plus longue, il reste utile de contacter le centre concerné avant de se déplacer."
      },
      {
        "q": "Doc’Biker entretient-il les motos encore sous garantie constructeur ?",
        "a": "Oui. Doc’Biker indique effectuer les révisions dans le respect des préconisations constructeur, avec des pièces d’origine ou équivalentes et une traçabilité des interventions."
      }
    ],
    aboutTitle: "À propos de Doc’Biker",
    highlights: [
      {
        "label": "Expérience",
        "value": "Depuis 1997",
        "description": "Doc’Biker est spécialisé dans l’entretien des deux-roues depuis plus de vingt-cinq ans."
      },
      {
        "label": "Spécialité",
        "value": "Entretien multi-marques",
        "description": "Motos, scooters et trois-roues sont pris en charge pour de nombreuses opérations d’entretien et de réparation."
      },
      {
        "label": "Accueil",
        "value": "Sans rendez-vous",
        "description": "La prise en charge rapide sans rendez-vous fait partie du positionnement historique de l’enseigne."
      },
      {
        "label": "Motorisations",
        "value": "Thermique & électrique",
        "description": "Les équipes interviennent sur les deux-roues thermiques comme électriques."
      }
    ],
    accordions: [
      {
        "id": "histoire-docbiker",
        "title": "Doc’Biker depuis 1997",
        "content": "Doc’Biker développe depuis 1997 un concept consacré à l’entretien et à la réparation des motos et scooters. L’enseigne s’est notamment fait connaître par une approche multi-marques, des forfaits d’entretien clairement identifiés et une prise en charge rapide des deux-roues."
      },
      {
        "id": "reseau-docbiker",
        "title": "Un réseau de centres d’entretien",
        "content": "Le site officiel Doc’Biker référence plusieurs centres à Paris ainsi qu’un centre à Roquebrune-sur-Argens. Les prestations et disponibilités peuvent varier selon le centre."
      },
      {
        "id": "services-docbiker",
        "title": "Entretien, réparation et diagnostic",
        "content": "Les centres Doc’Biker prennent en charge de nombreuses opérations : révisions, pneumatiques, freinage, kit chaîne ou courroie, suspensions, échappement, direction, électricité, électronique, diagnostic et différentes réparations."
      },
      {
        "id": "rendez-vous-docbiker",
        "title": "Une prise en charge rapide sans rendez-vous",
        "content": "Doc’Biker met en avant l’entretien sans rendez-vous comme l’un de ses principaux services. Cette organisation vise à permettre la prise en charge rapide des besoins courants, sous réserve de la disponibilité du centre et de la nature de l’intervention."
      },
      {
        "id": "garantie-docbiker",
        "title": "Entretien et garantie constructeur",
        "content": "Doc’Biker indique respecter les préconisations des constructeurs lors des révisions et utiliser des pièces d’origine ou de qualité équivalente. Les interventions sont documentées afin d’assurer leur traçabilité."
      }
    ],
  },
  {
    slug: 'teamaxe',
    name: 'TeamAxe',
    displayName: 'TEAMAXE',
    firestoreValue: 'TeamAxe',
    metaTitle: "TEAMAXE en France : magasins et équipements moto | LabelMoto",
    metaDescription: "Trouvez les magasins TEAMAXE référencés en France et découvrez le réseau, ses casques, vêtements, protections et accessoires moto et scooter.",
    h1: 'Magasins TEAMAXE en France',
    intro: [
      "TEAMAXE est un réseau spécialisé dans l’équipement du motard et du scootériste. L’enseigne associe des magasins physiques et une activité e-commerce avec une offre couvrant notamment les casques, blousons, gants, chaussures, protections et accessoires pour moto et scooter. Le réseau compte actuellement 10 magasins en France et en Andorre."
    ],
    faq: [
      {
        "q": "TEAMAXE est-il un réseau de magasins moto ?",
        "a": "Oui. TEAMAXE est un réseau spécialisé dans l’équipement moto et scooter, avec des magasins physiques et une activité e-commerce."
      },
      {
        "q": "Que trouve-t-on chez TEAMAXE ?",
        "a": "TEAMAXE propose notamment des casques, blousons, pantalons, gants, chaussures, protections, bagagerie, antivols, intercoms et différents accessoires pour moto et scooter."
      },
      {
        "q": "Combien de magasins TEAMAXE existe-t-il ?",
        "a": "TEAMAXE annonce actuellement 10 magasins répartis entre la France et la Principauté d’Andorre."
      },
      {
        "q": "TEAMAXE vend-il aussi ses produits en ligne ?",
        "a": "Oui. L’enseigne dispose d’un site e-commerce qui complète son réseau de magasins physiques."
      }
    ],
    aboutTitle: "À propos de TEAMAXE",
    highlights: [
      {
        "label": "Activité",
        "value": "Équipement moto & scooter",
        "description": "Casques, vêtements, gants, chaussures, protections, bagagerie et accessoires."
      },
      {
        "label": "Réseau",
        "value": "10 magasins",
        "description": "Le réseau TEAMAXE est implanté en France et en Andorre."
      },
      {
        "label": "Implantation",
        "value": "France & Andorre",
        "description": "TEAMAXE dispose de magasins dans plusieurs villes françaises ainsi qu’en Principauté d’Andorre."
      },
      {
        "label": "Canaux",
        "value": "Magasins & e-commerce",
        "description": "Le réseau associe conseil en point de vente et catalogue accessible en ligne."
      }
    ],
    accordions: [
      {
        "id": "histoire-teamaxe",
        "title": "L’histoire de TEAMAXE",
        "content": "TEAMAXE s’est développé autour d’un concept consacré à l’équipement du motard et du scootériste. Le réseau met en avant le conseil en magasin, la possibilité d’essayer les équipements et une sélection couvrant différents usages, du quotidien au touring en passant par une pratique plus sportive."
      },
      {
        "id": "reseau-teamaxe",
        "title": "Le réseau de magasins TEAMAXE",
        "content": "TEAMAXE annonce actuellement 10 magasins en France et en Andorre. En France, l’enseigne est notamment implantée en région parisienne, à Toulouse et à Mérignac. Le réseau est complété par plusieurs magasins en Principauté d’Andorre."
      },
      {
        "id": "equipements-teamaxe",
        "title": "Équipements et accessoires moto",
        "content": "L’offre TEAMAXE couvre les principaux besoins du motard : casques, blousons, pantalons, gants, chaussures, bottes, protections, bagagerie, antivols, produits d’entretien, intercoms, GPS et différents accessoires pour moto et scooter."
      },
      {
        "id": "services-teamaxe",
        "title": "Conseil en magasin et vente en ligne",
        "content": "Les magasins TEAMAXE permettent d’essayer les équipements et de bénéficier de conseils adaptés à sa pratique. Le site e-commerce complète cette présence physique avec la commande en ligne et différents services de livraison ou de retrait."
      }
    ],
  },

  {
    slug: 'moto-axxe',
    name: 'Moto Axxe',
    displayName: 'Moto Axxe',
    firestoreValue: 'Moto Axxe',
    metaTitle: "Trouver un Moto Axxe en France : 148 magasins vérifiés | LabelMoto",
    metaDescription: "Trouvez le magasin Moto Axxe le plus proche parmi 148 adresses référencées en France. Équipements moto, casques, pneus, atelier et concessions multimarques — contacts sur LabelMoto.",
    h1: 'Magasins Moto Axxe en France',
    intro: [
      "Moto Axxe est le deuxième réseau français de distribution d'équipements et de matériels moto avec plus de 100 magasins en France. Casques, blousons, gants, bottes, pneus et accessoires — mais aussi ateliers multimarques et concessions (CF Moto, Zontes, SYM) dans de nombreuses enseignes. Moto Axxe organise également les célèbres Moto Axxe Days, des journées circuit sur les plus grands tracés français.",
      "LabelMoto recense tous les magasins Moto Axxe en France avec fiches vérifiées, horaires et coordonnées directes pour trouver le point de vente le plus proche.",
    ],
    faq: [
      { q: "Où trouver un magasin Moto Axxe près de chez moi ?", a: "LabelMoto recense 148 magasins Moto Axxe en France, du réseau le plus dense après Dafy Moto. Utilisez la carte interactive pour trouver l'adresse et les horaires du magasin le plus proche." },
      { q: "Moto Axxe vend-il des motos neuves ?", a: "Oui, de nombreux magasins Moto Axxe sont également concessionnaires de marques comme CF Moto, Zontes ou SYM. Le réseau combine vente d'équipements et vente de motos selon les points de vente." },
      { q: "Moto Axxe propose-t-il des services d'atelier ?", a: "Oui, la plupart des magasins Moto Axxe disposent d'un atelier multimarques pour l'entretien et la réparation. Certains proposent également le montage de pneus en service express." },
    ],
  },
  {
    slug: 'cardy',
    name: 'Cardy',
    displayName: 'Cardy',
    firestoreValue: 'Cardy',
    metaTitle: "Cardy en France : magasins et équipements moto | LabelMoto",
    metaDescription: "Trouvez les magasins Cardy référencés en France et découvrez l’histoire de l’enseigne, ses 17 points de vente, ses équipements et ses services moto.",
    h1: 'Magasins Cardy en France',
    intro: [
      "Cardy est une enseigne française créée en 1979 par Lucien Poiatti. D’abord consacrée aux accessoires automobiles, elle ouvre des corners moto dans ses magasins en 1985 avant d’inaugurer, en 1987 dans le 19e arrondissement de Paris, son premier magasin entièrement dédié à la moto. Cardy compte aujourd’hui 17 points de vente et propose équipements du motard, accessoires, pièces, pneumatiques et différents services selon les magasins."
    ],
    faq: [
      {
        "q": "Cardy est-il un réseau français ?",
        "a": "Oui. Cardy est une enseigne française créée en 1979 par Lucien Poiatti."
      },
      {
        "q": "Combien de points de vente Cardy compte-t-il ?",
        "a": "Cardy annonce actuellement 17 points de vente dans son réseau."
      },
      {
        "q": "Que trouve-t-on chez Cardy ?",
        "a": "Cardy propose notamment des casques, vêtements et protections pour le motard, ainsi que des accessoires, pièces, pneumatiques, consommables et produits destinés à la moto et au scooter."
      },
      {
        "q": "Les magasins Cardy disposent-ils d’un atelier ?",
        "a": "Certains magasins Cardy disposent d’un Atelier Service Rapide, notamment pour des prestations liées aux pneumatiques et à l’entretien courant. Ce service n’est pas disponible dans tous les points de vente."
      }
    ],
    aboutTitle: "À propos de Cardy",
    highlights: [
      {
        "label": "Origine",
        "value": "France · 1979",
        "description": "Lucien Poiatti crée Cardy en 1979 dans le secteur de l’accessoire automobile."
      },
      {
        "label": "Virage moto",
        "value": "1985 · 1987",
        "description": "Cardy ouvre des corners moto en 1985, puis son premier magasin 100 % moto à Paris en 1987."
      },
      {
        "label": "Réseau",
        "value": "17 points de vente",
        "description": "Cardy dispose aujourd’hui d’un réseau de 17 points de vente."
      },
      {
        "label": "Activité",
        "value": "Équipement · Pièces · Services",
        "description": "L’offre couvre l’équipement du motard, les accessoires, les pièces, les pneumatiques et différents services selon les magasins."
      }
    ],
    accordions: [
      {
        "id": "histoire-cardy",
        "title": "Histoire de Cardy",
        "content": "Lucien Poiatti crée Cardy en 1979 afin de distribuer des accessoires automobiles. Passionné d’enduro, il introduit en 1985 des corners consacrés à la moto dans les trois magasins de l’enseigne. En 1987, Cardy ouvre dans le 19e arrondissement de Paris son premier magasin entièrement consacré à la moto, avant de poursuivre son développement sur le marché français."
      },
      {
        "id": "reseau-cardy",
        "title": "Le réseau Cardy",
        "content": "Cardy annonce actuellement 17 points de vente. Le réseau s’adresse à des profils variés de motards, du scooter aux grosses cylindrées en passant par la route, le cross et l’enduro, et complète ses magasins physiques par son activité de vente en ligne."
      },
      {
        "id": "equipements-cardy",
        "title": "Équipements, pièces et accessoires",
        "content": "Cardy commercialise notamment des casques, blousons, gants, chaussures, protections et autres équipements du motard, ainsi qu’une large gamme d’accessoires, pièces, pneumatiques, consommables et produits pour moto et scooter."
      },
      {
        "id": "services-cardy",
        "title": "Services et atelier selon les magasins",
        "content": "Certains magasins Cardy disposent d’un Atelier Service Rapide et proposent des prestations telles que le montage de pneumatiques ou différentes opérations d’entretien. Tous les points de vente ne disposent pas d’un atelier : les services doivent donc être vérifiés sur la fiche du magasin concerné."
      }
    ],
  },
  {
    slug: "maxxess",
    name: "Maxxess",
    displayName: "Maxxess",
    firestoreValue: "Maxxess",
    metaTitle: "Maxxess en France : magasins et équipements moto | LabelMoto",
    metaDescription: "Trouvez les magasins Maxxess référencés en France et découvrez le réseau, ses équipements, accessoires et services pour motards et deux-roues.",
    h1: "Magasins Maxxess en France",
    aboutTitle: "À propos de Maxxess",
    intro: [
      "Maxxess est un réseau français spécialisé dans l’équipement du motard, les accessoires moto et les services liés au deux-roues. Le premier centre Maxxess ouvre en 2000 et le réseau compte aujourd’hui 40 magasins. Son offre couvre notamment les casques, vêtements, protections, bagagerie, pièces, pneumatiques, consommables et différents services d’entretien."
    ],
    highlights: [
      {
        "label": "Origine",
        "value": "France · 2000",
        "description": "Le premier centre Maxxess ouvre en 2000."
      },
      {
        "label": "Réseau",
        "value": "40 magasins",
        "description": "Maxxess dispose aujourd’hui d’un réseau de 40 magasins spécialisés."
      },
      {
        "label": "Activité",
        "value": "Équipement & accessoires moto",
        "description": "Casques, vêtements, protections, bagagerie, pièces, pneumatiques et consommables."
      },
      {
        "label": "Services",
        "value": "Conseil & entretien",
        "description": "Le réseau propose différents services pour le motard et son deux-roues selon les magasins."
      }
    ],
    accordions: [
      {
        "id": "histoire-maxxess",
        "title": "Histoire de Maxxess",
        "content": "Le premier centre Maxxess ouvre en 2000. Le réseau se développe ensuite en France autour d’un concept de magasin spécialisé dans l’équipement du motard, l’accessoire moto et l’entretien du deux-roues."
      },
      {
        "id": "reseau-maxxess",
        "title": "Un réseau national de magasins",
        "content": "Maxxess annonce actuellement 40 magasins. Le réseau est implanté dans de nombreuses régions et s’adresse aux usages route, urbain, tout-terrain et scooter, avec une offre destinée à la fois au pilote et à son deux-roues."
      },
      {
        "id": "equipements-maxxess",
        "title": "Équipements, pièces et accessoires",
        "content": "Les magasins Maxxess proposent notamment casques, blousons, pantalons, gants, chaussures, protections, bagagerie, accessoires high-tech, pièces, produits d’entretien, consommables et pneumatiques. Le réseau distribue de nombreuses grandes marques de l’univers moto."
      },
      {
        "id": "services-maxxess",
        "title": "Services et entretien en magasin",
        "content": "Maxxess met en avant plusieurs services selon les magasins, notamment la station rapide atelier, le montage ou l’entretien, le retrait de commandes et le conseil en magasin. Les prestations et leurs tarifs peuvent varier selon le point de vente."
      }
    ],
    faq: [
      {
        "q": "Depuis quand Maxxess existe-t-il ?",
        "a": "Le premier centre Maxxess a ouvert en 2000."
      },
      {
        "q": "Combien de magasins Maxxess compte-t-il ?",
        "a": "Maxxess annonce actuellement un réseau de 40 magasins."
      },
      {
        "q": "Que vend Maxxess ?",
        "a": "Maxxess est spécialisé dans l’équipement du motard et de la moto : casques, vêtements, protections, bagagerie, accessoires, pièces, pneumatiques et consommables."
      },
      {
        "q": "Les magasins Maxxess disposent-ils d’un atelier ?",
        "a": "Le réseau propose des services d’atelier et d’entretien dans de nombreux magasins. Les prestations et tarifs peuvent varier selon le point de vente."
      }
    ],
  },
];

export function getBrandBySlug(slug: string): BrandData | undefined {
  return BRANDS.find(b => b.slug === slug);
}

export function getAllBrandSlugs(): string[] {
  return BRANDS.map(b => b.slug);
}

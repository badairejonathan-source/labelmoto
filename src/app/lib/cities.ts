export interface CityData {
  slug: string;
  name: string;
  departement: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  faq: { q: string; a: string }[];
  searchTerms: string[];
}
export const CITIES: CityData[] = [
  {
    slug: 'paris', name: 'Paris', departement: '75', region: 'Île-de-France',
    metaTitle: "Garage moto Paris : 250+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Paris parmi 252 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Paris : trouvez le bon pro en un clic',
    intro: [
      "Paris concentre plus de 300 000 deux-roues motorisés, ce qui en fait la ville la plus dense de France pour les motards. Trouver un garage moto fiable à Paris devrait être simple — en réalité, entre les ateliers surchargés, les délais interminables et les tarifs opaques, beaucoup de motards parisiens perdent un temps précieux.",
      "LabelMoto recense les meilleurs garages moto et concessionnaires de Paris, vérifiés et notés par la communauté. Que vous cherchiez un mécanicien rapide dans le 11e, une concession Honda ou Yamaha, ou un atelier custom — les bonnes adresses sont ici, avec horaires réels et contacts directs.",
    ],
    faq: [
      { q: 'Combien coûte une révision moto à Paris ?', a: "Entre 80 et 150 € pour une révision simple (vidange, filtres), jusqu'à 450 € pour une révision complète. Les concessions officielles pratiquent généralement des tarifs 15 à 30 % plus élevés que les garages indépendants." },
      { q: 'Comment trouver un garage moto ouvert le samedi à Paris ?', a: 'Utilisez le filtre "Ouvert le samedi" sur LabelMoto pour afficher uniquement les garages disponibles le week-end. Les grandes concessions officielles sont généralement ouvertes le samedi en journée.' },
      { q: 'Quelle est la différence entre un garage moto et un concessionnaire à Paris ?', a: "Un concessionnaire est agréé par une marque et vend du neuf avec SAV officiel. Un garage indépendant entretient toutes marques, souvent à des tarifs plus compétitifs." },
    ],
    searchTerms: ['mécanicien moto Paris','réparation moto Paris','concessionnaire Honda Paris','concessionnaire Yamaha Paris','entretien moto Paris pas cher','garage moto Paris ouvert samedi'],
  },
  {
    slug: 'marseille', name: 'Marseille', departement: '13', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Marseille : 160+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Marseille parmi 164 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Marseille : les pros sélectionnés par LabelMoto',
    intro: [
      "Marseille et sa métropole sont parmi les zones les plus actives de France pour les deux-roues. Le relief accidenté, le soleil quasi-permanent et la densité urbaine en font une ville idéale pour la moto — et un marché très fourni en ateliers et concessions.",
      "LabelMoto recense les garages moto et concessionnaires de Marseille vérifiés par notre équipe, avec les horaires réels, les marques distribuées et les avis de la communauté motarde locale.",
    ],
    faq: [
      { q: 'Quels quartiers ont le plus de garages moto à Marseille ?', a: "Les zones les mieux desservies sont le centre-ville (1er–3e), La Valentine (11e–12e) et le secteur nord autour de Saint-Antoine." },
      { q: 'Y a-t-il des concessionnaires moto officiels à Marseille ?', a: "Oui, Marseille dispose de concessions pour Honda, Yamaha, Kawasaki, BMW Motorrad, Ducati et Aprilia. Retrouvez la liste complète sur LabelMoto." },
      { q: 'Combien coûte une révision moto à Marseille ?', a: "Les tarifs sont légèrement inférieurs à Paris : comptez 70 à 130 € pour une révision simple, 200 à 400 € pour une révision complète." },
    ],
    searchTerms: ['mécanicien moto Marseille','réparation moto 13','concessionnaire moto Marseille','garage moto Marseille pas cher','atelier moto Marseille','entretien deux-roues Marseille'],
  },
  {
    slug: 'lyon', name: 'Lyon', departement: '69', region: 'Auvergne-Rhône-Alpes',
    metaTitle: "Garage moto Lyon : 140+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Lyon parmi 140 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Lyon : les meilleurs pros de la métropole',
    intro: [
      "Lyon est l'une des villes les plus motos de France : sa situation au carrefour des routes vers les Alpes et la Méditerranée, combinée à une communauté de motards très active, en fait un marché riche en professionnels de qualité.",
      "LabelMoto centralise les garages moto et concessionnaires de Lyon avec des fiches vérifiées et des avis de motards lyonnais. Que vous prépariez une sortie dans le Beaujolais ou que vous cherchiez un mécanicien pour votre quotidienne, trouvez le bon interlocuteur en quelques secondes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le centre de Lyon ?', a: "Le 7e arrondissement (Guillotière) et le secteur Part-Dieu concentrent plusieurs ateliers et concessions accessibles depuis le centre." },
      { q: 'Y a-t-il des spécialistes moto vintage ou custom à Lyon ?', a: "Oui, Lyon dispose d'ateliers spécialisés en préparation custom et en mécanique vintage. Filtrez par catégorie sur LabelMoto." },
      { q: 'Quel est le délai moyen pour une révision moto à Lyon ?', a: "En dehors des périodes de pointe, la plupart des garages lyonnais prennent votre moto sous 1 à 2 semaines. En saison haute, prévoyez 3 à 4 semaines pour les concessions officielles." },
    ],
    searchTerms: ['mécanicien moto Lyon','concessionnaire moto Lyon','réparation moto Lyon','atelier moto Villeurbanne','garage moto Vénissieux','entretien moto métropole lyonnaise'],
  },
  {
    slug: 'toulouse', name: 'Toulouse', departement: '31', region: 'Occitanie',
    metaTitle: "Garage moto Toulouse : 120+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Toulouse parmi 129 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Toulouse : trouvez votre pro en Occitanie',
    intro: [
      "Toulouse, ville étudiante et dynamique, est aussi une ville de motards. Avec les Pyrénées à portée et les routes de Gascogne, la communauté moto toulousaine est dense et exigeante en matière de qualité de service.",
      "LabelMoto vous présente une sélection vérifiée des garages moto et concessionnaires toulousains, avec horaires réels, marques traitées et avis de la communauté.",
    ],
    faq: [
      { q: 'Où trouver un concessionnaire moto à Toulouse ?', a: "Les concessions officielles sont principalement dans les zones commerciales périphériques (Blagnac, Colomiers, Labège). LabelMoto les liste toutes avec leurs marques distribuées." },
      { q: "Peut-on trouver des motos d'occasion chez les professionnels toulousains ?", a: "Oui, la plupart des concessionnaires toulousains proposent un parc VO certifié. Certains garages indépendants sont aussi spécialisés dans la vente VO." },
      { q: 'Y a-t-il des concessions BMW ou Ducati à Toulouse ?', a: "Toulouse dispose de concessions agréées pour les marques premium. Filtrez par marque sur LabelMoto pour les identifier." },
    ],
    searchTerms: ['mécanicien moto Toulouse','concessionnaire moto 31','réparation moto Toulouse','garage moto Blagnac','atelier moto Colomiers','entretien moto Toulouse'],
  },
  {
    slug: 'nice', name: 'Nice', departement: '06', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Nice : 160+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Nice parmi 165 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: "Garages moto et concessionnaires à Nice et sur la Côte d'Azur",
    intro: [
      "Nice et la Côte d'Azur offrent un cadre exceptionnel : routes en corniche, arrière-pays montagneux, climat favorable presque toute l'année. La saison moto est particulièrement longue, ce qui implique une forte demande sur les garages locaux.",
      "LabelMoto référence les garages moto et concessionnaires de Nice et de l'agglomération azuréenne avec des horaires à jour et les avis de la communauté locale.",
    ],
    faq: [
      { q: 'Les garages moto de Nice sont-ils ouverts en été ?', a: "La plupart restent ouverts mais les délais s'allongent fortement en juillet-août. Prévoyez votre révision avant la saison ou contactez le garage via LabelMoto." },
      { q: 'Y a-t-il des concessionnaires moto à Nice hors du centre-ville ?', a: "Oui, plusieurs professionnels sont implantés en périphérie (Carros, La Trinité, Saint-Laurent-du-Var) avec des tarifs souvent plus compétitifs." },
      { q: 'Peut-on louer une moto à Nice via LabelMoto ?', a: "LabelMoto recense les loueurs de motos présents sur la Côte d'Azur. Filtrez par type de service pour les trouver." },
    ],
    searchTerms: ["mécanicien moto Nice","concessionnaire moto Côte d'Azur","garage moto Nice","réparation moto 06","atelier moto Antibes","entretien moto Cannes"],
  },
  {
    slug: 'nantes', name: 'Nantes', departement: '44', region: 'Pays de la Loire',
    metaTitle: "Garage moto Nantes : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Nantes parmi 91 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Nantes : les pros de la Loire-Atlantique',
    intro: [
      "Nantes est une ville où la moto prend de plus en plus de place pour les trajets domicile-travail. La communauté motarde nantaise est active, avec des clubs nombreux et de belles routes à portée.",
      "LabelMoto recense les professionnels moto de Nantes et de la métropole avec leurs spécialités, horaires et avis de la communauté.",
    ],
    faq: [
      { q: 'Où se trouvent les concessions moto à Nantes ?', a: "Les principales concessions sont dans les zones commerciales périphériques : Saint-Herblain à l'ouest, Rezé au sud, Carquefou à l'est." },
      { q: 'Y a-t-il des garages moto spécialisés scooter à Nantes ?', a: "Oui, plusieurs ateliers nantais sont spécialisés dans l'entretien et la réparation de scooters urbains. Filtrez par catégorie sur LabelMoto." },
      { q: "Quel budget prévoir pour l'entretien moto à Nantes ?", a: "Dans la moyenne nationale : 80 à 140 € pour une révision simple, 250 à 420 € pour une révision complète." },
    ],
    searchTerms: ['mécanicien moto Nantes','concessionnaire moto 44','garage moto Nantes','réparation moto Saint-Herblain','atelier moto Loire-Atlantique','entretien moto Nantes'],
  },
  {
    slug: 'montpellier', name: 'Montpellier', departement: '34', region: 'Occitanie',
    metaTitle: "Garage moto Montpellier : 120+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Montpellier parmi 124 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: "Garages moto et concessionnaires à Montpellier : les pros de l'Hérault",
    intro: [
      "Montpellier et son agglomération sont très favorables à la moto : le climat méditerranéen permet de rouler presque toute l'année, et les routes de l'arrière-pays héraultais offrent des itinéraires exceptionnels.",
      "LabelMoto liste les professionnels moto vérifiés de Montpellier avec leurs horaires et les retours de la communauté motarde locale.",
    ],
    faq: [
      { q: 'Y a-t-il des concessionnaires moto officiels à Montpellier ?', a: "Oui, Montpellier dispose de concessions pour Honda, Yamaha, Kawasaki, BMW et Ducati. Retrouvez-les sur LabelMoto avec coordonnées et avis." },
      { q: 'Peut-on faire réviser sa moto rapidement à Montpellier ?', a: "En dehors des pics de printemps, les délais sont raisonnables (1 à 2 semaines). En saison, contactez le garage à l'avance." },
      { q: 'Y a-t-il des garages moto près du centre de Montpellier ?', a: "Quelques ateliers sont accessibles en centre-ville. La majorité des concessions est en zones commerciales. LabelMoto affiche les plus proches de votre position." },
    ],
    searchTerms: ['mécanicien moto Montpellier','concessionnaire moto 34','garage moto Hérault','réparation moto Montpellier','atelier moto Lattes','entretien moto Occitanie'],
  },
  {
    slug: 'strasbourg', name: 'Strasbourg', departement: '67', region: 'Grand Est',
    metaTitle: "Garage moto Strasbourg : 70+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Strasbourg parmi 78 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: "Garages moto et concessionnaires à Strasbourg : les pros d'Alsace",
    intro: [
      "Strasbourg et l'Alsace sont une destination moto de premier ordre : les routes des Vosges, la Route des Crêtes et la proximité de l'Allemagne et de la Suisse en font un territoire exceptionnel.",
      "LabelMoto liste les professionnels moto de Strasbourg avec leurs spécialités et les avis de la communauté motarde alsacienne.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto officielles à Strasbourg ?', a: "Oui, Strasbourg dispose de concessions pour les marques japonaises, BMW Motorrad et plusieurs marques italiennes." },
      { q: 'Quelle est la meilleure saison pour faire réviser sa moto à Strasbourg ?', a: "L'hiver (novembre à mars) est idéal : délais plus courts. Évitez le printemps où tous les motards relancent leur moto en même temps." },
      { q: 'Les garages moto de Strasbourg parlent-ils allemand ?', a: "Nombreux professionnels alsaciens sont bilingues, ce qui facilite les échanges pour les motards transfrontaliers." },
    ],
    searchTerms: ['mécanicien moto Strasbourg','concessionnaire moto Alsace','garage moto 67','réparation moto Strasbourg','atelier moto Illkirch','BMW moto Strasbourg'],
  },
  {
    slug: 'bordeaux', name: 'Bordeaux', departement: '33', region: 'Nouvelle-Aquitaine',
    metaTitle: "Garage moto Bordeaux : 130+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Bordeaux parmi 137 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Bordeaux : les pros de la Gironde',
    intro: [
      "Bordeaux et sa métropole offrent aux motards un terrain de jeu exceptionnel : les Landes, le bassin d'Arcachon, les routes du vignoble bordelais et les Pyrénées à quelques heures.",
      "LabelMoto propose une sélection vérifiée des garages moto et concessionnaires de Bordeaux et de sa métropole avec les avis de la communauté.",
    ],
    faq: [
      { q: 'Où sont les concessions moto à Bordeaux ?', a: "Les principales concessions sont dans les zones commerciales (Mérignac, Lormont, Bègles). LabelMoto vous les géolocalise toutes." },
      { q: 'Y a-t-il des garages moto spécialisés enduro à Bordeaux ?', a: "La région girondine compte quelques ateliers spécialisés en moto tout-terrain. Filtrez par spécialité sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Bordeaux ?", a: "Dans la moyenne nationale : 80 à 140 € pour une révision simple, 250 à 400 € pour une révision complète." },
    ],
    searchTerms: ['mécanicien moto Bordeaux','concessionnaire moto 33','garage moto Gironde','réparation moto Bordeaux','atelier moto Mérignac','entretien moto Nouvelle-Aquitaine'],
  },
  {
    slug: 'lille', name: 'Lille', departement: '59', region: 'Hauts-de-France',
    metaTitle: "Garage moto Lille : 130+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Lille parmi 132 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Lille : les pros du Nord',
    intro: [
      "Lille et sa métropole transfrontalière constituent un carrefour moto majeur : la proximité avec la Belgique, les Ardennes et la côte de la Manche offre de nombreuses possibilités de balade.",
      "LabelMoto recense les garages moto et concessionnaires de Lille et de l'agglomération avec des fiches vérifiées et les avis de la communauté locale.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto officielles à Lille ?', a: "Oui, la métropole lilloise dispose de concessions pour les grandes marques, souvent en périphérie (Lesquin, Villeneuve-d'Ascq, Roncq)." },
      { q: 'Les garages moto du Nord sont-ils moins chers ?', a: "Les tarifs dans le Nord sont souvent légèrement inférieurs à la moyenne nationale, notamment chez les indépendants." },
      { q: "Y a-t-il des ateliers spécialisés moto d'occasion à Lille ?", a: "Plusieurs professionnels lillois proposent de la vente et de l'entretien de motos d'occasion. Filtrez par spécialité sur LabelMoto." },
    ],
    searchTerms: ["mécanicien moto Lille","concessionnaire moto 59","garage moto Nord","réparation moto Lille","atelier moto Villeneuve-d'Ascq","entretien moto métropole lilloise"],
  },
  {
    slug: 'annecy', name: 'Annecy', departement: '74', region: 'Auvergne-Rhône-Alpes',
    metaTitle: "Garage moto Annecy (74) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Annecy parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 74. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Annecy : les pros de votre région',
    intro: [
      "Annecy et la Haute-Savoie offrent aux motards des routes d'exception : le col de la Colombière, le col des Aravis, le col du Grand-Colombier et les rives du lac d'Annecy figurent parmi les plus beaux itinéraires des Alpes.",
      "LabelMoto recense les garages moto et concessionnaires d'Annecy et de Haute-Savoie avec fiches vérifiées, avis et coordonnées directes pour les motards alpins.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Annecy ?', a: "Annecy et la Haute-Savoie disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes moto trail à Annecy ?', a: "Oui, plusieurs ateliers annéciens sont spécialisés en trail et enduro, adaptés aux cols alpins. Filtrez sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Annecy ?", a: "À Annecy, comptez 80 à 140 € pour une révision simple, 280 à 450 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Annecy","concessionnaire moto 74","garage moto Haute-Savoie","réparation moto Annecy","atelier moto col Aravis","entretien moto Alpes"],
  },
  {
    slug: 'cannes', name: 'Cannes', departement: '06', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Cannes (06) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Cannes parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 06. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Cannes : les pros de votre région',
    intro: [
      "Cannes et les Alpes-Maritimes sont un terrain de jeu idéal pour les motards : l'Esterel, les gorges du Verdon, le col de Turini et les routes de l'arrière-pays niçois sont accessibles depuis la Côte d'Azur.",
      "LabelMoto recense les garages moto et concessionnaires de Cannes et des Alpes-Maritimes avec fiches vérifiées, avis et coordonnées directes pour les motards azuréens.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Cannes ?', a: "Cannes et les Alpes-Maritimes disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes moto sport à Cannes ?', a: "Oui, la région Côte d'Azur compte plusieurs spécialistes sport moto et trail. Consultez LabelMoto pour les coordonnées." },
      { q: "Quel est le prix d'une révision moto à Cannes ?", a: "À Cannes, comptez 90 à 140 € pour une révision simple, 280 à 460 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Cannes","concessionnaire moto 06","garage moto Alpes-Maritimes","réparation moto Cannes","atelier moto Côte d'Azur","entretien moto Esterel"],
  },
  {
    slug: 'ajaccio', name: 'Ajaccio', departement: '2A', region: 'Corse',
    metaTitle: "Garage moto Ajaccio (2A) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Ajaccio parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 2A. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Ajaccio : les pros de votre région',
    intro: [
      "Ajaccio et la Corse-du-Sud sont une destination moto à part entière : les routes corses, entre col de Bavella, Calanques de Piana et D84, figurent parmi les plus spectaculaires d'Europe.",
      "LabelMoto recense les garages moto et concessionnaires d'Ajaccio et de Corse-du-Sud avec fiches vérifiées, avis et coordonnées directes pour les motards insulaires.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Ajaccio ?', a: "Ajaccio et la Corse-du-Sud disposent de professionnels moto référencés sur LabelMoto. Retrouvez-les avec leurs horaires et avis." },
      { q: 'Peut-on louer une moto à Ajaccio ?', a: "Oui, plusieurs professionnels proposent la location de motos à Ajaccio pour découvrir les routes corses. Consultez LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Ajaccio ?", a: "À Ajaccio, comptez 90 à 150 € pour une révision simple, 290 à 470 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Ajaccio","concessionnaire moto Corse","garage moto 2A","réparation moto Ajaccio","atelier moto Corse du Sud","entretien moto Corse"],
  },
  {
    slug: 'merignac', name: 'Mérignac', departement: '33', region: 'Nouvelle-Aquitaine',
    metaTitle: "Garage moto Mérignac (33) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Mérignac parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 33. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Mérignac : les pros de votre région',
    intro: [
      "Mérignac, première commune de la métropole bordelaise, concentre de nombreux professionnels moto desservant l'ensemble de l'agglomération. Les Landes et le Médoc offrent de belles routes pour les sorties girondines.",
      "LabelMoto recense les garages moto et concessionnaires de Mérignac et de la métropole de Bordeaux avec fiches vérifiées, avis et coordonnées directes pour les motards girondins.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Mérignac ?', a: "Mérignac dispose de nombreux ateliers et concessions desservant la métropole bordelaise. Retrouvez-les sur LabelMoto." },
      { q: 'Mérignac ou Bordeaux pour mon entretien moto ?', a: "Mérignac regroupe de nombreuses concessions multimarques avec parking facile. Bordeaux centre a des ateliers spécialisés. Les deux sont sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Mérignac ?", a: "À Mérignac, comptez 75 à 130 € pour une révision simple, 250 à 410 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Mérignac","concessionnaire moto 33","garage moto Bordeaux métropole","réparation moto Mérignac","atelier moto Gironde","entretien moto Mérignac"],
  },
  {
    slug: 'venissieux', name: 'Vénissieux', departement: '69', region: 'Auvergne-Rhône-Alpes',
    metaTitle: "Garage moto Vénissieux (69) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Vénissieux parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 69. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Vénissieux : les pros de votre région',
    intro: [
      "Vénissieux, dans la métropole lyonnaise, regroupe plusieurs professionnels moto accessibles depuis toute l'agglomération. La région Rhône-Alpes offre des routes variées vers les Alpes et le Massif Central.",
      "LabelMoto recense les garages moto et concessionnaires de Vénissieux et du Grand Lyon avec fiches vérifiées, avis et coordonnées directes pour les motards lyonnais.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Vénissieux ?', a: "Vénissieux dispose de plusieurs professionnels moto desservant la métropole lyonnaise. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions moto à Vénissieux ?', a: "Oui, Vénissieux compte plusieurs concessions multimarques. Retrouvez-les avec leurs marques et coordonnées sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Vénissieux ?", a: "À Vénissieux, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Vénissieux","concessionnaire moto 69","garage moto Grand Lyon","réparation moto Vénissieux","atelier moto Rhône","entretien moto métropole lyonnaise"],
  },
  {
    slug: 'ales', name: 'Alès', departement: '30', region: 'Occitanie',
    metaTitle: "Garage moto Alès (30) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Alès parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 30. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Alès : les pros de votre région',
    intro: [
      "Alès, aux portes des Cévennes, est un point de départ idéal pour les motards : le mont Aigoual, les gorges du Gardon, le col de la Lusette et les routes cévenoles figurent parmi les plus beaux itinéraires du sud de la France.",
      "LabelMoto recense les garages moto et concessionnaires d'Alès et du Gard avec fiches vérifiées, avis et coordonnées directes pour les motards cévenols.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Alès ?', a: "Alès et le Gard disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes trail et enduro à Alès ?', a: "Oui, la région alésienne compte des spécialistes trail et enduro adaptés aux routes cévenoles. Filtrez sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Alès ?", a: "À Alès, comptez 75 à 125 € pour une révision simple, 240 à 400 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Alès","concessionnaire moto 30","garage moto Gard","réparation moto Alès","atelier moto Cévennes","entretien moto Occitanie"],
  },
  {
    slug: 'montauban', name: 'Montauban', departement: '82', region: 'Occitanie',
    metaTitle: "Garage moto Montauban (82) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Montauban parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 82. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Montauban : les pros de votre région',
    intro: [
      "Montauban et le Tarn-et-Garonne offrent aux motards un accès rapide aux Pyrénées, à la vallée de la Dordogne et aux Causses. La ville est un carrefour stratégique entre Toulouse et l'Aquitaine.",
      "LabelMoto recense les garages moto et concessionnaires de Montauban et du Tarn-et-Garonne avec fiches vérifiées, avis et coordonnées directes pour les motards tarn-et-garonnais.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Montauban ?', a: "Montauban et le Tarn-et-Garonne disposent de plusieurs ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions multimarques à Montauban ?', a: "Oui, Montauban compte des concessions multimarques couvrant les principales marques japonaises et européennes. Consultez LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Montauban ?", a: "À Montauban, comptez 75 à 120 € pour une révision simple, 240 à 390 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Montauban","concessionnaire moto 82","garage moto Tarn-et-Garonne","réparation moto Montauban","atelier moto 82000","entretien moto Occitanie Nord"],
  },
  {
    slug: 'poitiers', name: 'Poitiers', departement: '86', region: 'Nouvelle-Aquitaine',
    metaTitle: "Garage moto Poitiers (86) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Poitiers parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 86. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Poitiers : les pros de votre région',
    intro: [
      "Poitiers et la Vienne offrent aux motards des routes tranquilles entre bocage poitevin, Marais Poitevin et vallée de la Vienne. La ville est également un point de passage sur la route des vacances vers le Sud-Ouest.",
      "LabelMoto recense les garages moto et concessionnaires de Poitiers et de la Vienne avec fiches vérifiées, avis et coordonnées directes pour les motards poitevins.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Poitiers ?', a: "Poitiers et la Vienne disposent de plusieurs ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Poitiers ?', a: "Oui, Poitiers compte des concessions représentant les principales marques. Retrouvez-les avec leurs coordonnées sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Poitiers ?", a: "À Poitiers, comptez 75 à 120 € pour une révision simple, 240 à 390 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Poitiers","concessionnaire moto 86","garage moto Vienne","réparation moto Poitiers","atelier moto 86000","entretien moto Nouvelle-Aquitaine"],
  },
  {
    slug: 'beziers', name: 'Béziers', departement: '34', region: 'Occitanie',
    metaTitle: "Garage moto Béziers (34) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Béziers parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 34. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Béziers : les pros de votre région',
    intro: [
      "Béziers et l'Hérault offrent aux motards l'accès aux Pyrénées, au Massif Central et aux routes de l'arrière-pays languedocien. Le cirque de Navacelles, le col de Peyrepertuse et les gorges de l'Hérault sont à portée.",
      "LabelMoto recense les garages moto et concessionnaires de Béziers et de l'Hérault avec fiches vérifiées, avis et coordonnées directes pour les motards languedociens.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Béziers ?', a: "Béziers et l'Hérault disposent de plusieurs ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes moto à Béziers ?', a: "Oui, Béziers compte des ateliers et concessions couvrant les principales marques. Consultez LabelMoto pour les coordonnées." },
      { q: "Quel est le prix d'une révision moto à Béziers ?", a: "À Béziers, comptez 75 à 120 € pour une révision simple, 240 à 390 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Béziers","concessionnaire moto 34","garage moto Hérault","réparation moto Béziers","atelier moto 34500","entretien moto Occitanie"],
  },
  {
    slug: 'frejus', name: 'Fréjus', departement: '83', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Fréjus (83) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Fréjus parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 83. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Fréjus : les pros de votre région',
    intro: [
      "Fréjus et le Var sont au coeur d'une région moto exceptionnelle : l'Esterel, le massif des Maures, les gorges du Verdon et le col du Canadel offrent des itinéraires parmi les plus beaux de France.",
      "LabelMoto recense les garages moto et concessionnaires de Fréjus et du Var avec fiches vérifiées, avis et coordonnées directes pour les motards varois.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Fréjus ?', a: "Fréjus et le Var disposent de plusieurs ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes trail à Fréjus ?', a: "Oui, la région varoise compte des spécialistes trail et sportive. Filtrez sur LabelMoto pour trouver le bon atelier." },
      { q: "Quel est le prix d'une révision moto à Fréjus ?", a: "À Fréjus, comptez 85 à 135 € pour une révision simple, 270 à 440 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Fréjus","concessionnaire moto 83","garage moto Var","réparation moto Fréjus","atelier moto Esterel","entretien moto Côte d'Azur"],
  },
  {
    slug: 'valenciennes', name: 'Valenciennes', departement: '59', region: 'Hauts-de-France',
    metaTitle: "Garage moto Valenciennes (59) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Valenciennes parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 59. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Valenciennes : les pros de votre région',
    intro: [
      "Valenciennes et le Nord offrent aux motards un accès rapide aux routes de l'Avesnois, de la Belgique et des Ardennes. La ville est un pôle industriel reconverti avec une offre moto complète.",
      "LabelMoto recense les garages moto et concessionnaires de Valenciennes et du Nord avec fiches vérifiées, avis et coordonnées directes pour les motards nordistes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Valenciennes ?', a: "Valenciennes et le Nord disposent de plusieurs ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions multimarques à Valenciennes ?', a: "Oui, Valenciennes compte des concessions couvrant les principales marques. Consultez LabelMoto pour les coordonnées." },
      { q: "Quel est le prix d'une révision moto à Valenciennes ?", a: "À Valenciennes, comptez 75 à 120 € pour une révision simple, 240 à 390 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Valenciennes","concessionnaire moto 59","garage moto Nord","réparation moto Valenciennes","atelier moto 59300","entretien moto Hauts-de-France"],
  },
  {
    slug: 'narbonne', name: 'Narbonne', departement: '11', region: 'Occitanie',
    metaTitle: "Garage moto Narbonne (11) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Narbonne parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 11. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Narbonne : les pros de votre région',
    intro: [
      "Narbonne et l'Aude offrent aux motards l'accès aux Pyrénées, aux Corbières et au Pays Cathare. Les routes de l'arrière-pays audois, entre abbayes et châteaux cathares, sont parmi les plus belles du Sud.",
      "LabelMoto recense les garages moto et concessionnaires de Narbonne et de l'Aude avec fiches vérifiées, avis et coordonnées directes pour les motards audois.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Narbonne ?', a: "Narbonne et l'Aude disposent de plusieurs ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes moto à Narbonne ?', a: "Oui, Narbonne compte des ateliers couvrant les principales marques. Consultez LabelMoto pour les coordonnées directes." },
      { q: "Quel est le prix d'une révision moto à Narbonne ?", a: "À Narbonne, comptez 75 à 120 € pour une révision simple, 240 à 390 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Narbonne","concessionnaire moto 11","garage moto Aude","réparation moto Narbonne","atelier moto Corbières","entretien moto Pays Cathare"],
  },
  {
    slug: 'calais', name: 'Calais', departement: '62', region: 'Hauts-de-France',
    metaTitle: "Garage moto Calais (62) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Calais parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 62. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Calais : les pros de votre région',
    intro: [
      "Calais et le Pas-de-Calais sont un point de passage stratégique pour les motards qui traversent la Manche. La ville offre également accès aux routes de la Côte d'Opale et des Flandres.",
      "LabelMoto recense les garages moto et concessionnaires de Calais et du Pas-de-Calais avec fiches vérifiées, avis et coordonnées directes pour les motards du Nord.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Calais ?', a: "Calais et le Pas-de-Calais disposent de plusieurs ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des garages moto ouverts le week-end à Calais ?', a: "Certains ateliers calaisiens sont ouverts le samedi. Consultez les horaires sur chaque fiche LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Calais ?", a: "À Calais, comptez 75 à 120 € pour une révision simple, 240 à 380 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Calais","concessionnaire moto 62","garage moto Pas-de-Calais","réparation moto Calais","atelier moto Côte d'Opale","entretien moto Nord-Pas-de-Calais"],
  },
  {
    slug: 'bastia', name: 'Bastia', departement: '20', region: 'Corse',
    metaTitle: "Garage moto Bastia (20) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Bastia parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 20. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Bastia : les pros de votre région',
    intro: [
      "Bastia et la Haute-Corse sont une destination moto incontournable : le Cap Corse, les gorges de la Restonica, le Castagniccia et la route des cols offrent des panoramas exceptionnels pour les motards.",
      "LabelMoto recense les garages moto et concessionnaires de Bastia et de Haute-Corse avec fiches vérifiées, avis et coordonnées directes pour les motards corses.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Bastia ?', a: "Bastia et la Haute-Corse disposent de professionnels moto référencés sur LabelMoto. Retrouvez-les avec leurs horaires." },
      { q: 'Peut-on louer une moto à Bastia ?', a: "Oui, plusieurs professionnels proposent la location de motos à Bastia pour explorer la Corse. Consultez LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Bastia ?", a: "À Bastia, comptez 90 à 150 € pour une révision simple, 290 à 470 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Bastia","concessionnaire moto Haute-Corse","garage moto 2B","réparation moto Bastia","atelier moto Cap Corse","entretien moto Corse"],
  },
  {
    slug: 'albi', name: 'Albi', departement: '81', region: 'Occitanie',
    metaTitle: "Garage moto Albi (81) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Albi parmi les professionnels vérifiés : concessions, ateliers et réparateurs dans le département 81. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Albi : les pros de votre région',
    intro: [
      "Albi et le Tarn offrent aux motards des routes variées entre Montagne Noire, Sidobre et Gorges du Tarn. La ville rose du Tarn est un point de départ idéal pour les cols du Massif Central.",
      "LabelMoto recense les garages moto et concessionnaires d'Albi et du Tarn avec fiches vérifiées, avis et coordonnées directes pour les motards tarnais.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Albi ?', a: "Albi et le Tarn disposent de plusieurs ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes trail à Albi ?', a: "Oui, la région albigeoise compte des spécialistes trail adaptés aux routes du Massif Central. Filtrez sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Albi ?", a: "À Albi, comptez 75 à 120 € pour une révision simple, 240 à 390 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Albi","concessionnaire moto 81","garage moto Tarn","réparation moto Albi","atelier moto 81000","entretien moto Occitanie"],
  },
];
export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find(c => c.slug === slug);
}
export function getAllCitySlugs(): string[] {
  return CITIES.map(c => c.slug);
}

// ── 20 villes supplémentaires ─────────────────────────────────────────────

CITIES.push(
  {
    slug: 'rennes', name: 'Rennes', departement: '35', region: 'Bretagne',
    metaTitle: "Garage moto Rennes : 70+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Rennes parmi 73 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Rennes : les pros de Bretagne',
    intro: [
      "Rennes et la métropole bretonne offrent aux motards un terrain de jeu varié : côtes sauvages, forêts de Brocéliande, routes sinueuses du Morbihan à portée. La communauté motarde rennaise est active et bien organisée.",
      "LabelMoto recense les garages moto et concessionnaires de Rennes avec des fiches vérifiées, des horaires à jour et les avis de la communauté bretonne.",
    ],
    faq: [
      { q: 'Où trouver un concessionnaire moto à Rennes ?', a: "Les principales concessions sont implantées en périphérie de Rennes, notamment dans les zones de Cesson-Sévigné et Saint-Grégoire. LabelMoto vous les affiche toutes sur carte." },
      { q: 'Y a-t-il des garages moto spécialisés à Rennes ?', a: "Oui, Rennes dispose d'ateliers spécialisés en entretien toutes marques et en préparation. Filtrez par catégorie sur LabelMoto pour les identifier." },
      { q: 'Quel est le délai pour une révision moto à Rennes ?', a: "En dehors du printemps, comptez 1 à 2 semaines. En avril-mai, les délais s'allongent : contactez le garage à l'avance via LabelMoto." },
    ],
    searchTerms: ['mécanicien moto Rennes','concessionnaire moto 35','garage moto Bretagne','réparation moto Rennes','atelier moto Cesson','entretien moto Ille-et-Vilaine'],
  },
  {
    slug: 'reims', name: 'Reims', departement: '51', region: 'Grand Est',
    metaTitle: "Garage moto Reims : 30+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Reims parmi 39 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Reims : les pros de la Marne',
    intro: [
      "Reims et sa région offrent aux motards des routes champêtres remarquables : la Route du Champagne, les forêts ardennaises et les plaines de la Marne. Une ville carrefour entre Paris, Bruxelles et Strasbourg.",
      "LabelMoto liste les garages moto et concessionnaires de Reims vérifiés par notre équipe, avec coordonnées, horaires et avis de la communauté.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto officielles à Reims ?', a: "Oui, Reims dispose de concessions pour les principales marques japonaises et européennes. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Où faire réviser sa moto rapidement à Reims ?', a: "Plusieurs garages indépendants rémois proposent des créneaux sous 1 semaine hors saison. Consultez les disponibilités directement via LabelMoto." },
      { q: 'Y a-t-il des garages moto ouverts le samedi à Reims ?', a: "Oui, certains ateliers et concessions de Reims sont ouverts le samedi matin. Filtrez par horaires sur LabelMoto pour les identifier." },
    ],
    searchTerms: ['mécanicien moto Reims','concessionnaire moto 51','garage moto Marne','réparation moto Reims','atelier moto Grand Est','entretien moto Reims'],
  },
  {
    slug: 'toulon', name: 'Toulon', departement: '83', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Toulon : 140+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Toulon parmi 148 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Toulon : les pros du Var',
    intro: [
      "Toulon et le département du Var sont un paradis pour les motards : le littoral méditerranéen, le Massif des Maures, le Verdon et les gorges du Var offrent des routes parmi les plus belles de France.",
      "LabelMoto référence les garages moto et concessionnaires de Toulon et de l'agglomération varoise avec des fiches vérifiées et les avis de la communauté motarde locale.",
    ],
    faq: [
      { q: 'Y a-t-il des concessionnaires moto officiels à Toulon ?', a: "Oui, Toulon et sa périphérie disposent de concessions pour les grandes marques. Retrouvez-les toutes sur LabelMoto avec leurs coordonnées." },
      { q: 'Les garages moto du Var sont-ils ouverts en été ?', a: "La plupart restent ouverts mais les délais s'allongent en juillet-août. Prenez rendez-vous à l'avance via LabelMoto." },
      { q: 'Y a-t-il des spécialistes moto roadster ou custom à Toulon ?', a: "Oui, le Var compte plusieurs ateliers spécialisés en préparation et en custom. Filtrez par spécialité sur LabelMoto." },
    ],
    searchTerms: ['mécanicien moto Toulon','concessionnaire moto 83','garage moto Var','réparation moto Toulon','atelier moto Hyères','entretien moto Var'],
  },
  {
    slug: 'grenoble', name: 'Grenoble', departement: '38', region: 'Auvergne-Rhône-Alpes',
    metaTitle: "Garage moto Grenoble : 40+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Grenoble parmi 47 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Grenoble : les pros de l\'Isère',
    intro: [
      "Grenoble est une capitale européenne de la moto de montagne : entourée par les Alpes, le Vercors et la Chartreuse, elle offre aux motards des routes techniques et des paysages exceptionnels à moins de 30 minutes du centre.",
      "LabelMoto recense les garages moto et concessionnaires grenoblois avec des fiches vérifiées et les avis de la communauté motarde alpine.",
    ],
    faq: [
      { q: 'Y a-t-il des spécialistes moto trail ou enduro à Grenoble ?', a: "Oui, la région grenobloise compte plusieurs ateliers spécialisés en motos trail et tout-terrain, adaptés à la pratique alpine. Filtrez par spécialité sur LabelMoto." },
      { q: 'Où trouver un concessionnaire moto à Grenoble ?', a: "Les concessions sont principalement situées en périphérie (Échirolles, Meylan, Crolles). LabelMoto vous les géolocalise toutes." },
      { q: 'Quelle est la saison moto à Grenoble ?', a: "En vallée, on roule de mars à novembre. En altitude, certains cols ferment en hiver. Les garages grenoblois connaissent bien ces spécificités — demandez conseil via LabelMoto." },
    ],
    searchTerms: ['mécanicien moto Grenoble','concessionnaire moto 38','garage moto Isère','réparation moto Grenoble','atelier moto Échirolles','entretien moto Alpes'],
  },
  {
    slug: 'dijon', name: 'Dijon', departement: '21', region: 'Bourgogne-Franche-Comté',
    metaTitle: "Garage moto Dijon : 50+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Dijon parmi 51 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Dijon : les pros de Bourgogne',
    intro: [
      "Dijon et la Bourgogne offrent aux motards des routes mythiques : la Route des Grands Crus, les routes sinueuses du Morvan et la proximité du Jura font de la région un terrain de jeu idéal.",
      "LabelMoto recense les garages moto et concessionnaires dijonnais avec des fiches vérifiées, des horaires à jour et les avis de la communauté motarde bourguignonne.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto officielles à Dijon ?', a: "Oui, Dijon dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées et avis." },
      { q: 'Où faire entretenir sa moto pas cher à Dijon ?', a: "Les garages indépendants dijonnais pratiquent des tarifs compétitifs. Comparez les avis sur LabelMoto pour trouver le meilleur rapport qualité-prix." },
      { q: 'Y a-t-il des garages moto spécialisés vintage à Dijon ?', a: "La région compte quelques passionnés de moto ancienne et vintage. Filtrez par spécialité sur LabelMoto pour les identifier." },
    ],
    searchTerms: ['mécanicien moto Dijon','concessionnaire moto 21','garage moto Bourgogne','réparation moto Dijon','atelier moto Côte-d\'Or','entretien moto Dijon'],
  },
  {
    slug: 'angers', name: 'Angers', departement: '49', region: 'Pays de la Loire',
    metaTitle: "Garage moto Angers : 20+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Angers parmi 28 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Angers : les pros du Maine-et-Loire',
    intro: [
      "Angers et la vallée de la Loire offrent aux motards un cadre exceptionnel : les châteaux de la Loire, le bocage vendéen et les coteaux du Layon composent des itinéraires variés et accessibles toute la saison.",
      "LabelMoto liste les garages moto et concessionnaires d'Angers avec des fiches vérifiées et les avis de la communauté motarde ligérienne.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Angers ?', a: "Les professionnels moto angevins sont répartis entre le centre-ville et les zones périphériques. LabelMoto vous affiche les plus proches de votre position." },
      { q: 'Y a-t-il des concessions moto officielles à Angers ?', a: "Oui, Angers dispose de concessions pour les grandes marques japonaises et européennes. Retrouvez-les sur LabelMoto." },
      { q: 'Quel budget pour une révision moto à Angers ?', a: "Dans la moyenne régionale : 80 à 130 € pour une révision simple, 250 à 400 € pour une révision complète." },
    ],
    searchTerms: ['mécanicien moto Angers','concessionnaire moto 49','garage moto Maine-et-Loire','réparation moto Angers','atelier moto Pays de la Loire','entretien moto Angers'],
  },
  {
    slug: 'nimes', name: 'Nîmes', departement: '30', region: 'Occitanie',
    metaTitle: "Garage moto Nîmes : 80+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Nîmes parmi 85 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Nîmes : les pros du Gard',
    intro: [
      "Nîmes et le département du Gard sont très favorables à la moto : le climat méditerranéen, les Cévennes à portée, les Gorges du Gardon et la Camargue offrent des itinéraires remarquables.",
      "LabelMoto recense les garages moto et concessionnaires de Nîmes avec des fiches vérifiées et les avis de la communauté motarde gardoise.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Nîmes ?', a: "Oui, Nîmes dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées et horaires." },
      { q: 'Peut-on faire réviser sa moto rapidement à Nîmes ?', a: "En dehors de la haute saison estivale, les délais sont raisonnables. Contactez le garage via LabelMoto pour vérifier les disponibilités." },
      { q: 'Y a-t-il des garages moto spécialisés trail à Nîmes ?', a: "Oui, la proximité des Cévennes attire des spécialistes trail et enduro. Filtrez par spécialité sur LabelMoto." },
    ],
    searchTerms: ['mécanicien moto Nîmes','concessionnaire moto 30','garage moto Gard','réparation moto Nîmes','atelier moto Occitanie','entretien moto Cévennes'],
  },
  {
    slug: 'aix-en-provence', name: 'Aix-en-Provence', departement: '13', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Aix-en-Provence : 160+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Aix-en-Provence parmi 164 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Aix-en-Provence : les pros de Provence',
    intro: [
      "Aix-en-Provence est une ville à taille humaine avec une forte culture moto : la Sainte-Victoire, le Luberon, les Alpilles et le Verdon sont accessibles en moins d'une heure. Le climat provençal permet de rouler presque toute l'année.",
      "LabelMoto liste les garages moto et concessionnaires d'Aix-en-Provence avec des fiches vérifiées et les avis de la communauté motarde provençale.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Aix-en-Provence ?', a: "Les professionnels moto sont implantés dans les zones commerciales périphériques et en centre-ville élargi. LabelMoto vous les géolocalise tous." },
      { q: 'Y a-t-il des concessions moto officielles à Aix-en-Provence ?', a: "Oui, Aix-en-Provence et sa périphérie disposent de concessions pour les grandes marques. Certaines sont partagées avec Marseille toute proche." },
      { q: 'Quel est le prix d\'une révision moto à Aix-en-Provence ?', a: "Dans la moyenne provençale : 80 à 150 € pour une révision simple, 250 à 420 € pour une révision complète selon le modèle." },
    ],
    searchTerms: ["mécanicien moto Aix-en-Provence","concessionnaire moto Aix","garage moto 13","réparation moto Aix-en-Provence","atelier moto Bouches-du-Rhône","entretien moto Provence"],
  },
  {
    slug: 'clermont-ferrand', name: 'Clermont-Ferrand', departement: '63', region: 'Auvergne-Rhône-Alpes',
    metaTitle: "Garage moto Clermont-Ferrand : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Clermont-Ferrand parmi 93 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Clermont-Ferrand : les pros d\'Auvergne',
    intro: [
      "Clermont-Ferrand est entourée de volcans et de routes mythiques : la Chaîne des Puys, le Puy de Dôme, les gorges de la Sioule et les plateaux du Cantal en font une base idéale pour les motards qui aiment les grands espaces.",
      "LabelMoto recense les garages moto et concessionnaires clermontois avec des fiches vérifiées et les avis de la communauté motarde auvergnate.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Clermont-Ferrand ?', a: "Oui, Clermont-Ferrand dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées." },
      { q: 'Y a-t-il des spécialistes trail ou aventure à Clermont-Ferrand ?', a: "Oui, la région auvergnate attire les amateurs de trail et de grandes randonnées. Plusieurs ateliers sont spécialisés dans ce type de machines. Filtrez sur LabelMoto." },
      { q: 'Quelle est la saison moto à Clermont-Ferrand ?', a: "On roule généralement de mars à novembre en vallée. En altitude (volcans, Cantal), la saison est plus courte. Les pros locaux connaissent bien ces spécificités." },
    ],
    searchTerms: ["mécanicien moto Clermont-Ferrand","concessionnaire moto 63","garage moto Auvergne","réparation moto Clermont","atelier moto Puy-de-Dôme","entretien moto Auvergne"],
  },
  {
    slug: 'rouen', name: 'Rouen', departement: '76', region: 'Normandie',
    metaTitle: "Garage moto Rouen : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Rouen parmi 96 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Rouen : les pros de Normandie',
    intro: [
      "Rouen et la Normandie sont une région moto incontournable : les falaises d'Étretat, la côte normande, le bocage et les routes de la Vallée de la Seine offrent des itinéraires variés et souvent peu fréquentés.",
      "LabelMoto liste les garages moto et concessionnaires de Rouen et de la Seine-Maritime avec des fiches vérifiées et les avis de la communauté motarde normande.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto officielles à Rouen ?', a: "Oui, Rouen dispose de concessions pour les principales marques, principalement en périphérie de la ville. Retrouvez-les sur LabelMoto." },
      { q: 'Peut-on faire réviser sa moto rapidement à Rouen ?', a: "En dehors du printemps, les délais sont raisonnables dans la plupart des ateliers rouennais. Contactez-les directement via LabelMoto." },
      { q: 'Y a-t-il des garages moto spécialisés à Rouen ?', a: "Oui, Rouen compte plusieurs ateliers spécialisés par marque ou par type de moto. Filtrez par catégorie sur LabelMoto pour les identifier." },
    ],
    searchTerms: ["mécanicien moto Rouen","concessionnaire moto 76","garage moto Normandie","réparation moto Rouen","atelier moto Seine-Maritime","entretien moto Normandie"],
  },
  {
    slug: 'amiens', name: 'Amiens', departement: '80', region: 'Hauts-de-France',
    metaTitle: "Garage moto Amiens : 30+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Amiens parmi 34 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Amiens : les pros de la Somme',
    intro: [
      "Amiens et la Somme offrent aux motards des routes tranquilles et des paysages typiques du nord de la France : baie de Somme, forêt de Crécy, chemins des Flandres. Une région idéale pour les randonnées moto.",
      "LabelMoto recense les garages moto et concessionnaires amiénois avec des fiches vérifiées et les avis de la communauté motarde picarde.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Amiens ?', a: "Oui, Amiens dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées et horaires." },
      { q: 'Où faire entretenir sa moto à Amiens ?', a: "Plusieurs garages indépendants amiénois proposent un entretien toutes marques à des tarifs compétitifs. Comparez les avis sur LabelMoto." },
      { q: 'Y a-t-il des garages moto ouverts le samedi à Amiens ?', a: "Certains ateliers et concessions sont ouverts le samedi matin. Vérifiez les horaires sur les fiches LabelMoto." },
    ],
    searchTerms: ["mécanicien moto Amiens","concessionnaire moto 80","garage moto Somme","réparation moto Amiens","atelier moto Hauts-de-France","entretien moto Picardie"],
  },
  {
    slug: 'metz', name: 'Metz', departement: '57', region: 'Grand Est',
    metaTitle: "Garage moto Metz : 70+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Metz parmi 71 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Metz : les pros de Moselle',
    intro: [
      "Metz et la Moselle sont un carrefour moto en plein cœur de l'Europe : la proximité du Luxembourg, de l'Allemagne et de la Belgique ouvre des possibilités de balade transfrontalières uniques.",
      "LabelMoto liste les garages moto et concessionnaires de Metz avec des fiches vérifiées et les avis de la communauté motarde mosellane.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto officielles à Metz ?', a: "Oui, Metz dispose de concessions pour les principales marques. Certains professionnels couvrent aussi le Luxembourg et la région frontalière." },
      { q: 'Les garages moto de Metz parlent-ils d\'autres langues ?', a: "Certains professionnels mosellans sont trilingues (français, allemand, luxembourgeois) pour servir la clientèle transfrontalière." },
      { q: 'Où faire réviser sa moto à Metz ?', a: "Les ateliers sont répartis entre le centre-ville et les zones périphériques. LabelMoto vous affiche les plus proches avec leurs disponibilités." },
    ],
    searchTerms: ["mécanicien moto Metz","concessionnaire moto 57","garage moto Moselle","réparation moto Metz","atelier moto Grand Est","entretien moto Lorraine"],
  },
  {
    slug: 'brest', name: 'Brest', departement: '29', region: 'Bretagne',
    metaTitle: "Garage moto Brest : 40+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Brest parmi 49 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Brest : les pros du Finistère',
    intro: [
      "Brest et le Finistère sont au bout du monde et c'est exactement ce que recherchent les motards : des routes côtières spectaculaires, la presqu'île de Crozon, les monts d'Arrée et les caps bretons offrent des itinéraires inoubliables.",
      "LabelMoto recense les garages moto et concessionnaires de Brest et du Finistère avec des fiches vérifiées et les avis de la communauté motarde bretonne.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Brest ?', a: "Oui, Brest dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées et horaires." },
      { q: 'Peut-on rouler en moto toute l\'année à Brest ?', a: "Le climat breton est doux mais humide. Certains motards roulent toute l'année avec les bons équipements. Les garages brestois connaissent bien les spécificités de ce climat." },
      { q: 'Y a-t-il des spécialistes moto trail à Brest ?', a: "Oui, le Finistère attire les amateurs de trail et d'aventure. Filtrez par spécialité sur LabelMoto pour trouver les ateliers adaptés." },
    ],
    searchTerms: ["mécanicien moto Brest","concessionnaire moto 29","garage moto Finistère","réparation moto Brest","atelier moto Bretagne","entretien moto Brest"],
  },
  {
    slug: 'tours', name: 'Tours', departement: '37', region: 'Centre-Val de Loire',
    metaTitle: "Garage moto Tours : 30+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Tours parmi 31 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Tours : les pros d\'Indre-et-Loire',
    intro: [
      "Tours et la Touraine offrent aux motards un cadre exceptionnel : les châteaux de la Loire, les vignobles de Vouvray et de Chinon, et les routes forestières de la Sologne composent des itinéraires d'une grande beauté.",
      "LabelMoto liste les garages moto et concessionnaires de Tours avec des fiches vérifiées et les avis de la communauté motarde tourangelle.",
    ],
    faq: [
      { q: 'Où trouver un concessionnaire moto à Tours ?', a: "Les principales concessions sont implantées en périphérie de Tours (Joué-lès-Tours, Saint-Cyr-sur-Loire). LabelMoto vous les géolocalise toutes." },
      { q: 'Y a-t-il des garages moto spécialisés à Tours ?', a: "Oui, Tours dispose de plusieurs ateliers spécialisés par marque ou par type de moto. Filtrez par catégorie sur LabelMoto." },
      { q: 'Quel est le prix d\'une révision moto à Tours ?', a: "Dans la moyenne nationale : 80 à 140 € pour une révision simple, 250 à 400 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Tours","concessionnaire moto 37","garage moto Indre-et-Loire","réparation moto Tours","atelier moto Centre-Val de Loire","entretien moto Touraine"],
  },
  {
    slug: 'limoges', name: 'Limoges', departement: '87', region: 'Nouvelle-Aquitaine',
    metaTitle: "Garage moto Limoges : 40+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Limoges parmi 47 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Limoges : les pros de Haute-Vienne',
    intro: [
      "Limoges et le Limousin sont une région moto attachante : les plateaux du Massif Central, les gorges de la Vézère et les routes tranquilles du Périgord vert attirent les motards qui aiment les grands espaces préservés.",
      "LabelMoto recense les garages moto et concessionnaires de Limoges avec des fiches vérifiées et les avis de la communauté motarde limousine.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Limoges ?', a: "Oui, Limoges dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées et avis." },
      { q: 'Peut-on faire réviser sa moto rapidement à Limoges ?', a: "Les délais sont généralement courts à Limoges, hors saison comme en saison, grâce à une demande plus modérée qu'en grande métropole." },
      { q: 'Y a-t-il des garages moto spécialisés trail à Limoges ?', a: "Oui, la proximité du Massif Central attire des spécialistes trail et enduro. Filtrez par spécialité sur LabelMoto." },
    ],
    searchTerms: ["mécanicien moto Limoges","concessionnaire moto 87","garage moto Haute-Vienne","réparation moto Limoges","atelier moto Limousin","entretien moto Limoges"],
  },
  {
    slug: 'perpignan', name: 'Perpignan', departement: '66', region: 'Occitanie',
    metaTitle: "Garage moto Perpignan : 50+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Perpignan parmi 54 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Perpignan : les pros des Pyrénées-Orientales',
    intro: [
      "Perpignan et les Pyrénées-Orientales offrent aux motards un cadre exceptionnel : la mer Méditerranée, les Pyrénées catalanes, la Cerdagne et la Côte Vermeille composent des itinéraires variés dans un climat ensoleillé.",
      "LabelMoto liste les garages moto et concessionnaires de Perpignan avec des fiches vérifiées et les avis de la communauté motarde catalane.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Perpignan ?', a: "Oui, Perpignan dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées." },
      { q: 'Y a-t-il des spécialistes moto Pyrénées à Perpignan ?', a: "Oui, certains ateliers perpignanais sont spécialisés en motos trail adaptées à la pratique pyrénéenne. Filtrez sur LabelMoto." },
      { q: 'Les garages moto de Perpignan sont-ils ouverts en été ?', a: "Oui, la saison est longue dans le 66. La plupart des professionnels restent ouverts en été, parfois avec des horaires aménagés." },
    ],
    searchTerms: ["mécanicien moto Perpignan","concessionnaire moto 66","garage moto Pyrénées-Orientales","réparation moto Perpignan","atelier moto Catalogne","entretien moto Perpignan"],
  },
  {
    slug: 'caen', name: 'Caen', departement: '14', region: 'Normandie',
    metaTitle: "Garage moto Caen : 40+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Caen parmi 47 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Caen : les pros du Calvados',
    intro: [
      "Caen et le Calvados sont une destination moto attachante : les plages du Débarquement, le bocage normand, les routes de la côte fleurie et les circuits mythiques (circuit de Carole...) attirent de nombreux passionnés.",
      "LabelMoto recense les garages moto et concessionnaires de Caen avec des fiches vérifiées et les avis de la communauté motarde caennaise.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Caen ?', a: "Oui, Caen dispose de concessions pour les principales marques, principalement en périphérie de la ville. Retrouvez-les sur LabelMoto." },
      { q: 'Peut-on rouler en moto toute l\'année à Caen ?', a: "Le climat normand est doux mais humide. Certains motards caennais roulent toute l'année. Les garages locaux proposent des équipements adaptés à ce climat." },
      { q: 'Y a-t-il des garages moto ouverts le week-end à Caen ?', a: "Certains ateliers et concessions de Caen sont ouverts le samedi. Vérifiez les horaires sur les fiches LabelMoto." },
    ],
    searchTerms: ["mécanicien moto Caen","concessionnaire moto 14","garage moto Calvados","réparation moto Caen","atelier moto Normandie","entretien moto Caen"],
  },
  {
    slug: 'nancy', name: 'Nancy', departement: '54', region: 'Grand Est',
    metaTitle: "Garage moto Nancy : 30+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Nancy parmi 38 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Nancy : les pros de Meurthe-et-Moselle',
    intro: [
      "Nancy et la Lorraine offrent aux motards des routes verdoyantes et des paysages préservés : les Vosges à l'est, la Moselle sinueuse, les forêts lorraines et la proximité de l'Alsace composent des itinéraires de qualité.",
      "LabelMoto liste les garages moto et concessionnaires de Nancy avec des fiches vérifiées et les avis de la communauté motarde lorraine.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto officielles à Nancy ?', a: "Oui, Nancy dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées et avis." },
      { q: 'Où faire réviser sa moto rapidement à Nancy ?', a: "Plusieurs garages indépendants nancéiens proposent des créneaux rapides hors saison. Contactez-les via LabelMoto." },
      { q: 'Y a-t-il des spécialistes moto vintage à Nancy ?', a: "La région lorraine compte quelques passionnés de motos anciennes et classiques. Filtrez par spécialité sur LabelMoto." },
    ],
    searchTerms: ["mécanicien moto Nancy","concessionnaire moto 54","garage moto Meurthe-et-Moselle","réparation moto Nancy","atelier moto Lorraine","entretien moto Nancy"],
  },
  {
    slug: 'saint-etienne', name: 'Saint-Étienne', departement: '42', region: 'Auvergne-Rhône-Alpes',
    metaTitle: "Garage moto Saint-Étienne : 50+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Saint-Étienne parmi 51 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Saint-Étienne : les pros de la Loire',
    intro: [
      "Saint-Étienne et la Loire sont bien placées pour les motards : le Pilat, les Gorges de la Loire, les routes du Forez et la proximité de Lyon offrent des itinéraires variés entre plaine et montagne.",
      "LabelMoto recense les garages moto et concessionnaires stéphanois avec des fiches vérifiées et les avis de la communauté motarde ligérienne.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Saint-Étienne ?', a: "Oui, Saint-Étienne dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées et horaires." },
      { q: 'Y a-t-il des spécialistes moto trail à Saint-Étienne ?', a: "Oui, la proximité du Pilat et des Gorges de la Loire attire des spécialistes trail. Filtrez par spécialité sur LabelMoto." },
      { q: 'Quel est le prix d\'une révision moto à Saint-Étienne ?', a: "Dans la moyenne régionale : 80 à 130 € pour une révision simple, 250 à 400 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Saint-Étienne","concessionnaire moto 42","garage moto Loire","réparation moto Saint-Étienne","atelier moto Pilat","entretien moto Stéphanois"],
  },
  {
    slug: 'pau', name: 'Pau', departement: '64', region: 'Nouvelle-Aquitaine',
    metaTitle: "Garage moto Pau : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Pau parmi 92 professionnels vérifiés : concessions, ateliers et réparateurs. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Pau : les pros des Pyrénées-Atlantiques',
    intro: [
      "Pau est la porte d'entrée des Pyrénées pour les motards : le col du Tourmalet, l'Aubisque, l'Osquich et les routes basques et béarnaises sont accessibles en moins d'une heure. C'est l'une des plus belles régions moto de France.",
      "LabelMoto recense les garages moto et concessionnaires de Pau et des Pyrénées-Atlantiques avec des fiches vérifiées et les avis de la communauté motarde béarnaise.",
    ],
    faq: [
      { q: 'Y a-t-il des concessions moto à Pau ?', a: "Oui, Pau dispose de concessions pour les principales marques. Retrouvez-les sur LabelMoto avec leurs coordonnées et avis." },
      { q: 'Y a-t-il des spécialistes moto Pyrénées à Pau ?', a: "Oui, plusieurs ateliers palois sont spécialisés en motos trail et aventure adaptées aux cols pyrénéens. Filtrez sur LabelMoto." },
      { q: 'Quelle est la saison pour les cols à moto depuis Pau ?', a: "Les grands cols (Tourmalet, Aubisque) sont généralement ouverts de juin à octobre. Les garages locaux connaissent bien les conditions et peuvent vous conseiller sur la préparation de votre moto." },
    ],
    searchTerms: ["mécanicien moto Pau","concessionnaire moto 64","garage moto Pyrénées-Atlantiques","réparation moto Pau","atelier moto Béarn","entretien moto Pyrénées"],
  },

  // === ÎLE-DE-FRANCE ===
  {
    slug: 'nanterre', name: 'Nanterre', departement: '92', region: 'Île-de-France',
    metaTitle: "Garage moto Hauts-de-Seine (92) : 100+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans les Hauts-de-Seine parmi 109 professionnels vérifiés : concessions, ateliers et réparateurs à Nanterre, Boulogne-Billancourt, Levallois. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires dans les Hauts-de-Seine (92)',
    intro: [
      "Les Hauts-de-Seine comptent parmi les départements les mieux équipés en professionnels moto d'Île-de-France : concessions et ateliers à Nanterre, Boulogne-Billancourt, Levallois-Perret, Neuilly-sur-Seine et Issy-les-Moulineaux.",
      "LabelMoto recense tous les garages moto et concessionnaires du 92 avec fiches vérifiées, avis communauté et coordonnées directes pour les motards franciliens.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le 92 ?', a: "Les Hauts-de-Seine disposent de nombreux ateliers et concessions à Nanterre, Boulogne-Billancourt et Levallois. Retrouvez-les tous sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Boulogne-Billancourt ?', a: "Oui, Boulogne-Billancourt et ses environs dans le 92 disposent de plusieurs concessions multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto dans le 92 ?", a: "Dans les Hauts-de-Seine, comptez 100 à 150 € pour une révision simple, 300 à 500 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Nanterre","concessionnaire moto 92","garage moto Hauts-de-Seine","réparation moto Boulogne-Billancourt","atelier moto Levallois","entretien moto 92"],
  },
  {
    slug: 'versailles', name: 'Versailles', departement: '78', region: 'Île-de-France',
    metaTitle: "Garage moto Versailles (78) : 100+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans les Yvelines parmi 105 professionnels vérifiés : concessions, ateliers et réparateurs à Versailles, Saint-Germain-en-Laye, Poissy. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires dans les Yvelines (78)',
    intro: [
      "Les Yvelines offrent aux motards un accès rapide à la forêt de Rambouillet, aux routes de la Beauce et au vexin normand. Le département compte plus d'une centaine de professionnels moto à Versailles, Saint-Germain-en-Laye, Poissy et Mantes-la-Jolie.",
      "LabelMoto recense les garages moto et concessionnaires du 78 avec fiches vérifiées, avis et coordonnées pour les motards yvelinois.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans les Yvelines ?', a: "Les Yvelines disposent de nombreux ateliers et concessions à Versailles, Saint-Germain-en-Laye et Poissy. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions moto à Versailles ?', a: "Oui, Versailles et ses environs dans le 78 disposent de concessions multimarques. Consultez LabelMoto pour les adresses complètes et avis." },
      { q: "Quel est le prix d'une révision moto dans le 78 ?", a: "Dans les Yvelines, comptez 90 à 140 € pour une révision simple, 280 à 450 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Versailles","concessionnaire moto 78","garage moto Yvelines","réparation moto Saint-Germain-en-Laye","atelier moto Poissy","entretien moto 78"],
  },
  {
    slug: 'creteil', name: 'Créteil', departement: '94', region: 'Île-de-France',
    metaTitle: "Garage moto Val-de-Marne (94) : 90+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans le Val-de-Marne parmi 94 professionnels vérifiés : concessions, ateliers et réparateurs à Créteil, Vincennes, Vitry-sur-Seine. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires dans le Val-de-Marne (94)',
    intro: [
      "Le Val-de-Marne regroupe de nombreux professionnels moto entre Créteil, Vincennes, Vitry-sur-Seine et Ivry-sur-Seine, avec un accès rapide aux routes du Brie et de la forêt de Sénart.",
      "LabelMoto recense les garages moto et concessionnaires du 94 avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le 94 ?', a: "Le Val-de-Marne dispose de nombreux ateliers et concessions à Créteil, Vincennes et Vitry. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Créteil ?', a: "Oui, Créteil et ses environs dans le 94 disposent de concessions multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto dans le 94 ?", a: "Dans le Val-de-Marne, comptez 100 à 150 € pour une révision simple, 300 à 480 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Créteil","concessionnaire moto 94","garage moto Val-de-Marne","réparation moto Vincennes","atelier moto Vitry","entretien moto 94"],
  },
  {
    slug: 'saint-denis', name: 'Saint-Denis', departement: '93', region: 'Île-de-France',
    metaTitle: "Garage moto Seine-Saint-Denis (93) : 80+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Seine-Saint-Denis parmi 85 professionnels vérifiés : concessions, ateliers et réparateurs à Saint-Denis, Montreuil, Bobigny. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Seine-Saint-Denis (93)',
    intro: [
      "La Seine-Saint-Denis concentre de nombreux professionnels moto à Saint-Denis, Montreuil, Bobigny et Aubervilliers, avec un accès rapide aux autoroutes du nord et de l'est de l'Île-de-France.",
      "LabelMoto recense les garages moto et concessionnaires du 93 avec fiches vérifiées, avis et coordonnées directes pour les motards de Seine-Saint-Denis.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le 93 ?', a: "La Seine-Saint-Denis dispose de nombreux ateliers et concessions à Saint-Denis, Montreuil et Bobigny. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Saint-Denis ?', a: "Oui, Saint-Denis et ses environs dans le 93 disposent de concessions multimarques. Consultez LabelMoto pour les adresses complètes." },
      { q: "Quel est le prix d'une révision moto dans le 93 ?", a: "En Seine-Saint-Denis, comptez 90 à 140 € pour une révision simple, 280 à 450 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Saint-Denis","concessionnaire moto 93","garage moto Seine-Saint-Denis","réparation moto Montreuil","atelier moto Bobigny","entretien moto 93"],
  },
  {
    slug: 'melun', name: 'Melun', departement: '77', region: 'Île-de-France',
    metaTitle: "Garage moto Seine-et-Marne (77) : 80+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Seine-et-Marne parmi 82 professionnels vérifiés : concessions, ateliers et réparateurs à Melun, Meaux, Fontainebleau. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Seine-et-Marne (77)',
    intro: [
      "La Seine-et-Marne est le plus grand département d'Île-de-France et offre aux motards des routes variées : forêt de Fontainebleau, plaine de Brie, vallées de la Marne et du Loing. Les professionnels moto sont répartis à Melun, Meaux, Fontainebleau et Provins.",
      "LabelMoto recense les garages moto et concessionnaires du 77 avec fiches vérifiées, avis et coordonnées directes pour les motards seine-et-marnais.",
    ],
    faq: [
      { q: 'Où trouver un garage moto en Seine-et-Marne ?', a: "La Seine-et-Marne dispose de nombreux ateliers et concessions à Melun, Meaux et Fontainebleau. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions moto à Melun ?', a: "Oui, Melun et ses environs dans le 77 disposent de concessions multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto en Seine-et-Marne ?", a: "En Seine-et-Marne, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Melun","concessionnaire moto 77","garage moto Seine-et-Marne","réparation moto Meaux","atelier moto Fontainebleau","entretien moto 77"],
  },
  {
    slug: 'evry', name: 'Évry', departement: '91', region: 'Île-de-France',
    metaTitle: "Garage moto Essonne (91) : 80+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Essonne parmi 82 professionnels vérifiés : concessions, ateliers et réparateurs à Évry, Corbeil-Essonnes, Massy. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Essonne (91)',
    intro: [
      "L'Essonne offre aux motards un accès direct à la forêt de Fontainebleau, aux routes de la Beauce et aux circuits moto du sud francilien. Les professionnels sont répartis à Évry, Corbeil-Essonnes, Massy et Palaiseau.",
      "LabelMoto recense les garages moto et concessionnaires du 91 avec fiches vérifiées, avis communauté et coordonnées directes pour les motards essonniens.",
    ],
    faq: [
      { q: 'Où trouver un garage moto en Essonne ?', a: "L'Essonne dispose de nombreux ateliers et concessions à Évry, Corbeil et Massy. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Évry ?', a: "Oui, Évry et ses environs dans le 91 disposent de concessions multimarques. Consultez LabelMoto pour les adresses complètes et avis." },
      { q: "Quel est le prix d'une révision moto en Essonne ?", a: "En Essonne, comptez 90 à 140 € pour une révision simple, 280 à 450 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Évry","concessionnaire moto 91","garage moto Essonne","réparation moto Corbeil-Essonnes","atelier moto Massy","entretien moto 91"],
  },
  {
    slug: 'cergy', name: 'Cergy', departement: '95', region: 'Île-de-France',
    metaTitle: "Garage moto Val-d'Oise (95) : 70+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans le Val-d'Oise parmi 75 professionnels vérifiés : concessions, ateliers et réparateurs à Cergy, Argenteuil, Sarcelles. Avis et contacts sur LabelMoto.",
    h1: "Garages moto et concessionnaires dans le Val-d'Oise (95)",
    intro: [
      "Le Val-d'Oise offre aux motards un accès rapide au Vexin français, aux routes de Picardie et aux forêts du nord de l'Île-de-France. Les professionnels moto sont répartis à Cergy, Argenteuil, Sarcelles et Pontoise.",
      "LabelMoto recense les garages moto et concessionnaires du 95 avec fiches vérifiées, avis et coordonnées directes pour les motards valdoisiens.",
    ],
    faq: [
      { q: "Où trouver un garage moto dans le Val-d'Oise ?", a: "Le Val-d'Oise dispose de nombreux ateliers et concessions à Cergy, Argenteuil et Sarcelles. Retrouvez-les sur LabelMoto avec leurs horaires." },
      { q: 'Y a-t-il des concessions moto à Cergy ?', a: "Oui, Cergy et ses environs dans le 95 disposent de concessions multimarques. Consultez LabelMoto pour les adresses complètes et avis." },
      { q: "Quel est le prix d'une révision moto dans le Val-d'Oise ?", a: "Dans le Val-d'Oise, comptez 90 à 140 € pour une révision simple, 280 à 440 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Cergy","concessionnaire moto 95","garage moto Val-d'Oise","réparation moto Argenteuil","atelier moto Sarcelles","entretien moto 95"],
  },
  // === GRANDES VILLES HORS IDF ===
  {
    slug: 'calais', name: 'Calais', departement: '62', region: 'Hauts-de-France',
    metaTitle: "Garage moto Pas-de-Calais (62) : 110+ concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto dans le Pas-de-Calais parmi 118 professionnels vérifiés : concessions, ateliers et réparateurs à Calais, Arras, Lens, Boulogne-sur-Mer. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires dans le Pas-de-Calais (62)',
    intro: [
      "Le Pas-de-Calais est un département traversé par de nombreuses routes et autoroutes qui en font un point de passage incontournable pour les motards du nord de la France et les traversées vers l'Angleterre. Les professionnels moto sont présents à Calais, Arras, Lens et Boulogne-sur-Mer.",
      "LabelMoto recense les garages moto et concessionnaires du 62 avec fiches vérifiées, avis et coordonnées directes pour les motards du Pas-de-Calais.",
    ],
    faq: [
      { q: 'Où trouver un garage moto dans le Pas-de-Calais ?', a: "Le Pas-de-Calais dispose de nombreux ateliers et concessions à Calais, Arras et Lens. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des garages moto à Calais ?', a: "Oui, Calais et ses environs dans le 62 disposent de concessions et ateliers multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto dans le 62 ?", a: "Dans le Pas-de-Calais, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Calais","concessionnaire moto 62","garage moto Pas-de-Calais","réparation moto Arras","atelier moto Lens","entretien moto Boulogne-sur-Mer"],
  },
  {
    slug: 'annecy', name: 'Annecy', departement: '74', region: 'Auvergne-Rhône-Alpes',
    metaTitle: "Garage moto Annecy (74) : 100+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Annecy parmi 100 professionnels vérifiés : concessions, ateliers et réparateurs en Haute-Savoie. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Annecy : les pros de Haute-Savoie',
    intro: [
      "Annecy et la Haute-Savoie sont un paradis pour les motards : cols alpins (Aravis, Colombière, Grand-Bornand), routes du lac d'Annecy, accès au Mont-Blanc et aux stations de haute montagne font de cette région l'une des plus prisées de France à moto.",
      "LabelMoto recense les garages moto et concessionnaires d'Annecy et de Haute-Savoie avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Annecy ?', a: "Annecy et la Haute-Savoie disposent de nombreux ateliers et concessions spécialisés montagne. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes moto alpine à Annecy ?', a: "Oui, plusieurs ateliers annéciens sont spécialisés en motos trail et adventure adaptées aux cols alpins. Filtrez sur LabelMoto par spécialité." },
      { q: "Quel est le prix d'une révision moto à Annecy ?", a: "À Annecy, comptez 90 à 140 € pour une révision simple, 280 à 450 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Annecy","concessionnaire moto 74","garage moto Haute-Savoie","réparation moto Annecy","atelier moto alpin","entretien moto Lac d'Annecy"],
  },
  {
    slug: 'la-rochelle', name: 'La Rochelle', departement: '17', region: 'Nouvelle-Aquitaine',
    metaTitle: "Garage moto La Rochelle (17) : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à La Rochelle parmi 94 professionnels vérifiés : concessions, ateliers et réparateurs en Charente-Maritime. Avis, horaires et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à La Rochelle : les pros de Charente-Maritime',
    intro: [
      "La Rochelle et la Charente-Maritime offrent aux motards des routes côtières exceptionnelles : île de Ré, île d'Oléron, Marais Poitevin et littoral atlantique pour des balades à moto entre mer et marais.",
      "LabelMoto recense les garages moto et concessionnaires de La Rochelle et de Charente-Maritime avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à La Rochelle ?', a: "La Rochelle et la Charente-Maritime disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: "Y a-t-il des garages moto près de l'île de Ré ?", a: "Oui, plusieurs garages proches de La Rochelle assurent l'entretien pour les motards qui souhaitent explorer l'île de Ré et le littoral charentais." },
      { q: "Quel est le prix d'une révision moto à La Rochelle ?", a: "À La Rochelle, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto La Rochelle","concessionnaire moto 17","garage moto Charente-Maritime","réparation moto La Rochelle","atelier moto Rochefort","entretien moto île de Ré"],
  },
  {
    slug: 'lorient', name: 'Lorient', departement: '56', region: 'Bretagne',
    metaTitle: "Garage moto Lorient (56) : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Lorient parmi 91 professionnels vérifiés : concessions, ateliers et réparateurs dans le Morbihan. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Lorient : les pros du Morbihan',
    intro: [
      "Lorient et le Morbihan offrent aux motards bretons des routes côtières magnifiques entre la presqu'île de Quiberon, Carnac, Vannes et la côte sauvage. Le département est l'un des plus actifs de Bretagne côté moto.",
      "LabelMoto recense les garages moto et concessionnaires de Lorient et du Morbihan avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Lorient ?', a: "Lorient et le Morbihan disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Vannes ?', a: "Oui, Vannes et ses environs dans le 56 disposent de concessions multimarques. Consultez LabelMoto pour les adresses et avis." },
      { q: "Quel est le prix d'une révision moto dans le Morbihan ?", a: "Dans le Morbihan, comptez 80 à 130 € pour une révision simple, 260 à 400 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Lorient","concessionnaire moto 56","garage moto Morbihan","réparation moto Lorient","atelier moto Vannes","entretien moto Bretagne sud"],
  },
  {
    slug: 'avignon', name: 'Avignon', departement: '84', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Avignon (84) : 90+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Avignon parmi 91 professionnels vérifiés : concessions, ateliers et réparateurs dans le Vaucluse. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Avignon : les pros du Vaucluse',
    intro: [
      "Avignon et le Vaucluse sont au cœur d'une région moto exceptionnelle : le Luberon, le Ventoux, les Alpilles et les Gorges du Verdon sont accessibles en moins d'une heure pour des balades inoubliables.",
      "LabelMoto recense les garages moto et concessionnaires d'Avignon et du Vaucluse avec fiches vérifiées, avis communauté et coordonnées directes pour les motards provençaux.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Avignon ?', a: "Avignon et le Vaucluse disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des spécialistes moto trail à Avignon ?', a: "Oui, plusieurs ateliers avignonnais sont spécialisés en motos trail adaptées au Luberon et au Ventoux. Filtrez sur LabelMoto." },
      { q: "Quel est le prix d'une révision moto à Avignon ?", a: "À Avignon, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Avignon","concessionnaire moto 84","garage moto Vaucluse","réparation moto Avignon","atelier moto Luberon","entretien moto Ventoux"],
  },
  {
    slug: 'orange', name: 'Orange', departement: '84', region: "Provence-Alpes-Côte d'Azur",
    metaTitle: "Garage moto Orange (84) : concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Orange parmi les professionnels vérifiés : concessions Yamaha, Honda, Harley-Davidson, Kymco et ateliers dans le Vaucluse. Avis, horaires et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Orange : les pros du Vaucluse Nord',
    intro: [
      "Orange, au nord du Vaucluse, est une ville moto bien pourvue : Harley-Davidson, Honda, Yamaha, Kymco, CF Moto et Touratech y sont représentés. La ville est un point de départ idéal pour les routes du Mont Ventoux, des Dentelles de Montmirail et des Gorges de l'Ardèche.",
      "LabelMoto recense les garages moto et concessionnaires d'Orange et du nord Vaucluse avec fiches vérifiées, avis communauté et coordonnées directes pour les motards de la région.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Orange ?', a: "Orange dispose de 9 professionnels moto référencés sur LabelMoto : concessions multimarques, ateliers et spécialistes. Retrouvez-les avec leurs horaires et avis." },
      { q: 'Quelles marques moto sont représentées à Orange ?', a: "À Orange, vous trouverez des concessions Harley-Davidson, Honda, Yamaha, Kymco, CF Moto, Zontes et un équipementier Touratech. Consultez LabelMoto pour les coordonnées." },
      { q: "Quel est le prix d'une révision moto à Orange ?", a: "À Orange, comptez 80 à 130 € pour une révision simple, 260 à 420 € pour une révision complète selon la marque et l'atelier." },
    ],
    searchTerms: ["mécanicien moto Orange","concessionnaire moto 84100","garage moto Vaucluse Nord","Harley Davidson Orange","Honda moto Orange","Yamaha Orange moto"],
  },
  {
    slug: 'le-mans', name: 'Le Mans', departement: '72', region: 'Pays de la Loire',
    metaTitle: "Garage moto Le Mans (72) : 70+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto au Mans parmi 72 professionnels vérifiés : concessions, ateliers et réparateurs en Sarthe. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires au Mans : les pros de la Sarthe',
    intro: [
      "Le Mans est la capitale mondiale du sport automobile et moto — les 24 Heures Moto font chaque année rayonner la ville. La Sarthe offre également de belles routes entre forêt de Bercé, vallée du Loir et Perche pour les balades en deux-roues.",
      "LabelMoto recense les garages moto et concessionnaires du Mans et de la Sarthe avec fiches vérifiées, avis et coordonnées directes pour les motards manceaux.",
    ],
    faq: [
      { q: 'Où trouver un garage moto au Mans ?', a: "Le Mans et la Sarthe disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto spécialisées au Mans ?', a: "Oui, Le Mans dispose de concessions multimarques et de spécialistes sport moto, en lien avec la tradition des 24 Heures. Consultez LabelMoto." },
      { q: "Quel est le prix d'une révision moto au Mans ?", a: "Au Mans, comptez 80 à 130 € pour une révision simple, 250 à 400 € pour une révision complète selon la marque." },
    ],
    searchTerms: ["mécanicien moto Le Mans","concessionnaire moto 72","garage moto Sarthe","réparation moto Le Mans","atelier moto 24h Moto","entretien moto Manceau"],
  },
  {
    slug: 'orleans', name: 'Orléans', departement: '45', region: 'Centre-Val de Loire',
    metaTitle: "Garage moto Orléans (45) : 60+ concessions et ateliers vérifiés | LabelMoto",
    metaDescription: "Trouvez votre garage moto à Orléans parmi 66 professionnels vérifiés : concessions, ateliers et réparateurs dans le Loiret. Avis, horaires et contacts directs sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à Orléans : les pros du Loiret',
    intro: [
      "Orléans et le Loiret sont au cœur du Val de Loire, région classée au patrimoine mondial de l'UNESCO. Les motards y trouvent de magnifiques routes entre châteaux de la Loire, forêt d'Orléans et Sologne.",
      "LabelMoto recense les garages moto et concessionnaires d'Orléans et du Loiret avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: 'Où trouver un garage moto à Orléans ?', a: "Orléans et le Loiret disposent de nombreux ateliers et concessions. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: 'Y a-t-il des concessions moto à Orléans ?', a: "Oui, Orléans dispose de concessions pour les principales marques. Consultez LabelMoto pour les adresses complètes et avis." },
      { q: "Quel est le prix d'une révision moto à Orléans ?", a: "À Orléans, comptez 80 à 130 € pour une révision simple, 250 à 400 € pour une révision complète." },
    ],
    searchTerms: ["mécanicien moto Orléans","concessionnaire moto 45","garage moto Loiret","réparation moto Orléans","atelier moto Val de Loire","entretien moto 45"],
  },
);

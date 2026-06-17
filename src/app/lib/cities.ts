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
    metaTitle: 'Garages moto Paris — Trouvez le meilleur atelier | LabelMoto',
    metaDescription: "Trouvez un garage moto ou concessionnaire de confiance à Paris. Avis vérifiés, horaires, contacts directs. LabelMoto — l'annuaire des motards parisiens.",
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
    metaTitle: 'Garages moto Marseille — Ateliers et concessionnaires | LabelMoto',
    metaDescription: "Trouvez le meilleur garage moto ou concessionnaire à Marseille. Avis vérifiés, contacts directs, horaires à jour. LabelMoto, l'annuaire moto de confiance.",
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
    metaTitle: 'Garages moto Lyon — Ateliers et concessionnaires | LabelMoto',
    metaDescription: "Trouvez un garage moto fiable à Lyon. Concessionnaires, ateliers indépendants, avis vérifiés et horaires. LabelMoto, l'annuaire des motards lyonnais.",
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
    metaTitle: 'Garages moto Toulouse — Ateliers et concessionnaires | LabelMoto',
    metaDescription: "Garage moto et concessionnaire à Toulouse : trouvez le bon professionnel avec LabelMoto. Avis, horaires, contacts vérifiés pour les motards toulousains.",
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
    metaTitle: "Garages moto Nice — Ateliers et concessionnaires Côte d'Azur | LabelMoto",
    metaDescription: "Garage moto et concessionnaire à Nice et sur la Côte d'Azur. Avis vérifiés, horaires, contacts directs. LabelMoto, l'annuaire moto de référence.",
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
    metaTitle: 'Garages moto Nantes — Ateliers et concessionnaires | LabelMoto',
    metaDescription: "Garage moto et concessionnaire à Nantes. Trouvez le bon professionnel avec LabelMoto : avis vérifiés, horaires réels, contacts directs.",
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
    metaTitle: 'Garages moto Montpellier — Ateliers et concessionnaires | LabelMoto',
    metaDescription: "Garage moto et concessionnaire à Montpellier. Avis, horaires, contacts directs. LabelMoto, l'annuaire moto de référence en Occitanie.",
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
    metaTitle: 'Garages moto Strasbourg — Ateliers et concessionnaires | LabelMoto',
    metaDescription: "Garage moto et concessionnaire à Strasbourg. Avis vérifiés, horaires, contacts. LabelMoto, l'annuaire moto de référence en Alsace.",
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
    metaTitle: 'Garages moto Bordeaux — Ateliers et concessionnaires | LabelMoto',
    metaDescription: "Garage moto et concessionnaire à Bordeaux. Trouvez le bon pro avec LabelMoto : avis vérifiés, horaires à jour, contacts directs.",
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
    metaTitle: 'Garages moto Lille — Ateliers et concessionnaires | LabelMoto',
    metaDescription: "Garage moto et concessionnaire à Lille. Avis vérifiés, horaires, contacts. LabelMoto, l'annuaire moto de référence dans les Hauts-de-France.",
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
];
export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find(c => c.slug === slug);
}
export function getAllCitySlugs(): string[] {
  return CITIES.map(c => c.slug);
}

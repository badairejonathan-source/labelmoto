export interface CountryData {
  slug: string;
  name: string;
  code: string;
  filterType?: 'country' | 'departement';
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  faq: { q: string; a: string }[];
}

export const COUNTRIES: CountryData[] = [
  {
    slug: 'belgique',
    name: 'Belgique',
    code: 'BE',
    metaTitle: "Garage moto Belgique : 110+ concessions et ateliers référencés | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Belgique parmi 110 professionnels référencés : concessions, ateliers et réparateurs à Bruxelles, Liège, Namur, Gand. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Belgique',
    intro: [
      "La Belgique est un pays de motards passionnés, avec des routes variées entre Ardennes, Côte belge et Campine flamande. De Bruxelles à Liège en passant par Namur, Gand et Bruges, LabelMoto recense les professionnels moto belges pour les motards francophones.",
      "Que vous soyez motard français traversant la frontière ou belge cherchant un atelier de confiance, retrouvez toutes les adresses vérifiées sur la carte interactive LabelMoto.",
    ],
    faq: [
      { q: "Où trouver un garage moto en Belgique ?", a: "LabelMoto recense plus de 110 professionnels moto en Belgique, des concessions multimarques aux ateliers spécialisés à Bruxelles, Liège, Namur et Gand. Consultez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Y a-t-il des concessions moto à Bruxelles ?", a: "Oui, Bruxelles et ses environs disposent de plusieurs concessions multimarques et ateliers spécialisés. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: "Les motos françaises peuvent-elles circuler librement en Belgique ?", a: "Oui, les motos immatriculées en France circulent librement en Belgique dans le cadre de l'espace Schengen. Aucune formalité particulière pour un séjour touristique." },
    ],
  },
  {
    slug: 'suisse',
    name: 'Suisse',
    code: 'CH',
    metaTitle: "Garage moto Suisse : 118 concessions et ateliers référencés | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Suisse parmi 118 professionnels référencés : concessions, ateliers et réparateurs à Genève, Lausanne, Berne, Zurich. Avis et contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Suisse',
    intro: [
      "La Suisse est un paradis pour les motards : cols alpins mythiques (Grand-Saint-Bernard, Furka, Susten, Grimsel), routes du lac Léman et des Grisons offrent des paysages à couper le souffle. Les professionnels moto sont présents à Genève, Lausanne, Berne, Zurich et Bâle.",
      "LabelMoto recense les garages moto et concessionnaires de Suisse romande et alémanique avec fiches vérifiées, avis et coordonnées directes pour les motards francophones.",
    ],
    faq: [
      { q: "Où trouver un garage moto en Suisse ?", a: "LabelMoto recense plus de 118 professionnels moto en Suisse, des concessions multimarques aux ateliers spécialisés à Genève, Lausanne, Berne et Zurich. Consultez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Y a-t-il des concessions moto à Genève ?", a: "Oui, Genève et ses environs disposent de nombreuses concessions multimarques et ateliers spécialisés. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: "Faut-il une vignette pour rouler à moto en Suisse ?", a: "Oui, la vignette autoroutière suisse (40 CHF) est obligatoire pour emprunter les autoroutes. Les routes nationales et cantonales sont libres d'accès. Pensez à l'acheter avant de passer la frontière." },
    ],
  },

  {
    slug: 'reunion',
    name: 'La Réunion',
    code: '974',
    filterType: 'departement',
    metaTitle: "Garage moto La Réunion (974) : 85 concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto à La Réunion parmi 85 professionnels référencés : concessions, ateliers et réparateurs à Saint-Denis, Saint-Paul, Saint-Pierre. Contacts et avis sur LabelMoto.",
    h1: 'Garages moto et concessionnaires à La Réunion',
    intro: [
      "La Réunion est un terrain de jeu exceptionnel pour les motards : routes de montagne du Piton de la Fournaise, cirques de Cilaos et Mafate, côte sauvage et littoral tropical font de l'île un paradis à deux roues. Les professionnels moto sont présents à Saint-Denis, Saint-Paul, Saint-Pierre et Saint-André.",
      "LabelMoto recense les garages moto et concessionnaires de La Réunion avec fiches vérifiées, avis et coordonnées directes pour les motards réunionnais.",
    ],
    faq: [
      { q: "Où trouver un garage moto à La Réunion ?", a: "LabelMoto recense 85 professionnels moto à La Réunion, des concessions multimarques aux ateliers spécialisés à Saint-Denis, Saint-Paul et Saint-Pierre. Consultez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Y a-t-il des concessions moto à Saint-Denis ?", a: "Oui, Saint-Denis et ses environs disposent de concessions multimarques et d'ateliers spécialisés. Retrouvez-les sur LabelMoto avec leurs horaires et avis." },
      { q: "Quels sont les meilleurs itinéraires moto à La Réunion ?", a: "La route du Piton de la Fournaise, la RN2 côte Est et les routes des cirques (Cilaos, Salazie) sont les incontournables. Les garages locaux peuvent vous conseiller sur la préparation de votre moto pour les cols d'altitude." },
    ],
  },
  {
    slug: 'guadeloupe',
    name: 'Guadeloupe',
    code: '971',
    filterType: 'departement',
    metaTitle: "Garage moto Guadeloupe (971) : concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Guadeloupe parmi les professionnels référencés : concessions, ateliers et réparateurs à Pointe-à-Pitre, Basse-Terre, Abymes. Contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Guadeloupe',
    intro: [
      "La Guadeloupe offre aux motards des routes variées entre Basse-Terre et Grande-Terre : forêt tropicale, côtes sauvages et routes de montagne autour du volcan de la Soufrière. Les professionnels moto sont présents à Pointe-à-Pitre, Basse-Terre et Les Abymes.",
      "LabelMoto recense les garages moto et concessionnaires de Guadeloupe avec fiches vérifiées et coordonnées directes pour les motards guadeloupéens.",
    ],
    faq: [
      { q: "Où trouver un garage moto en Guadeloupe ?", a: "LabelMoto recense les professionnels moto en Guadeloupe, à Pointe-à-Pitre, Basse-Terre et Les Abymes. Consultez la carte interactive pour trouver le garage le plus proche." },
      { q: "Y a-t-il des concessions moto à Pointe-à-Pitre ?", a: "Oui, Pointe-à-Pitre et ses environs disposent de concessions et ateliers moto. Retrouvez-les sur LabelMoto avec leurs coordonnées et avis." },
      { q: "Peut-on louer une moto en Guadeloupe ?", a: "Oui, plusieurs professionnels référencés sur LabelMoto proposent des services de location de motos et scooters pour explorer l'île à votre rythme." },
    ],
  },
  {
    slug: 'martinique',
    name: 'Martinique',
    code: '972',
    filterType: 'departement',
    metaTitle: "Garage moto Martinique (972) : concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Martinique parmi les professionnels référencés : concessions, ateliers et réparateurs à Fort-de-France, Le Lamentin. Contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Martinique',
    intro: [
      "La Martinique est une île idéale pour les motards : routes côtières entre les communes, montagne Pelée au nord, presqu'île des Salines au sud. Les professionnels moto sont principalement présents à Fort-de-France et Le Lamentin.",
      "LabelMoto recense les garages moto et concessionnaires de Martinique avec fiches vérifiées et coordonnées directes pour les motards martiniquais.",
    ],
    faq: [
      { q: "Où trouver un garage moto en Martinique ?", a: "LabelMoto recense les professionnels moto en Martinique, principalement à Fort-de-France et Le Lamentin. Consultez la carte interactive pour trouver le garage le plus proche." },
      { q: "Y a-t-il des concessions moto à Fort-de-France ?", a: "Oui, Fort-de-France dispose de concessions et ateliers moto multimarques. Retrouvez-les sur LabelMoto avec leurs coordonnées et horaires." },
      { q: "Quelle cylindrée choisir pour rouler en Martinique ?", a: "Les scooters 125cc sont très populaires pour la ville. Pour explorer l'île et ses routes de montagne, une moto de 250cc ou plus est recommandée." },
    ],
  },
  {
    slug: 'guyane',
    name: 'Guyane',
    code: '973',
    filterType: 'departement',
    metaTitle: "Garage moto Guyane (973) : concessions et ateliers | LabelMoto",
    metaDescription: "Trouvez votre garage moto en Guyane parmi les professionnels référencés : concessions, ateliers et réparateurs à Cayenne, Saint-Laurent-du-Maroni. Contacts sur LabelMoto.",
    h1: 'Garages moto et concessionnaires en Guyane',
    intro: [
      "La Guyane offre un cadre unique pour les motards : routes tropicales, frontières avec le Suriname et le Brésil, et accès au littoral atlantique. Les professionnels moto sont présents principalement à Cayenne et Saint-Laurent-du-Maroni.",
      "LabelMoto recense les garages moto et concessionnaires de Guyane avec fiches vérifiées et coordonnées directes pour les motards guyanais.",
    ],
    faq: [
      { q: "Où trouver un garage moto en Guyane ?", a: "LabelMoto recense les professionnels moto en Guyane, principalement à Cayenne. Consultez la carte interactive pour trouver le garage le plus proche de votre position." },
      { q: "Y a-t-il des concessions moto à Cayenne ?", a: "Oui, Cayenne dispose de concessions et ateliers moto. Retrouvez-les sur LabelMoto avec leurs coordonnées et horaires d'ouverture." },
      { q: "Quelles précautions prendre pour rouler à moto en Guyane ?", a: "La chaleur tropicale et les routes parfois dégradées nécessitent une moto bien entretenue. Privilégiez les révisions régulières et vérifiez vos pneus avant chaque sortie." },
    ],
  },
];

export function getCountryBySlug(slug: string): CountryData | undefined {
  return COUNTRIES.find(c => c.slug === slug);
}

export function getAllCountrySlugs(): string[] {
  return COUNTRIES.map(c => c.slug);
}

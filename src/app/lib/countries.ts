export interface CountryData {
  slug: string;
  name: string;
  code: string;
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
];

export function getCountryBySlug(slug: string): CountryData | undefined {
  return COUNTRIES.find(c => c.slug === slug);
}

export function getAllCountrySlugs(): string[] {
  return COUNTRIES.map(c => c.slug);
}

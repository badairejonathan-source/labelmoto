export interface BrandData {
  slug: string;
  name: string;
  displayName: string;
  firestoreValue: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
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
    intro: [
      "Suzuki est l'une des marques moto les plus implantées en France avec plus de 270 points de vente et d'entretien. Des roadsters GSX-S aux trails V-Strom en passant par le légendaire SV650, le réseau Suzuki couvre tout le territoire.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Suzuki en France avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Suzuki près de chez moi ?", a: "LabelMoto recense 276 points de vente et d'entretien Suzuki en France. Utilisez la carte interactive ou la recherche par ville pour trouver l'adresse la plus proche." },
      { q: "Quel est le prix d'une révision Suzuki SV650 ?", a: "Une révision SV650 coûte environ 200 à 350 € en concession officielle selon le kilométrage. Les intervalles Suzuki sont généralement de 6 000 km." },
      { q: "Les motos Suzuki sont-elles fiables ?", a: "Oui, Suzuki est réputé pour la fiabilité de ses modèles. Le SV650 et le V-Strom 650 figurent régulièrement parmi les motos les plus fiables de leur catégorie." },
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
    intro: [
      "Yamaha dispose d'un des réseaux les plus denses en France avec plus de 240 concessions et ateliers agréés. Des motos MT au TMAX en passant par les R-series, les YZF et les trails Ténéré, Yamaha propose une gamme complète pour tous les styles de pilotage.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Yamaha en France avec fiches vérifiées, avis et coordonnées directes pour trouver le pro Yamaha le plus proche.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Yamaha près de chez moi ?", a: "LabelMoto recense 248 points de vente et d'entretien Yamaha en France. Utilisez la carte interactive pour trouver l'adresse la plus proche de vous." },
      { q: "Quel est le prix d'une révision Yamaha MT-07 ?", a: "Une révision MT-07 coûte environ 250 à 400 € en concession officielle. Les intervalles Yamaha sont de 10 000 km pour ce modèle." },
      { q: "Quelle Yamaha choisir en permis A2 ?", a: "La MT-03, la YZF-R3 et la XSR300 sont les modèles Yamaha les plus populaires en A2. La MT-125 est idéale pour le permis A1. Consultez les fiches techniques sur LabelMoto pour comparer les coûts d'entretien." },
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
    intro: [
      "Honda est la marque moto numéro un mondiale et dispose d'un réseau solide en France avec plus de 230 concessions et ateliers agréés. Des scooters SH aux trails Africa Twin en passant par les CB, les CBR et les NC, Honda couvre tous les usages.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Honda en France avec fiches vérifiées, avis communauté et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Honda près de chez moi ?", a: "LabelMoto recense 235 points de vente et d'entretien Honda en France. Utilisez la carte interactive pour trouver l'adresse la plus proche de vous." },
      { q: "Quel est le prix d'une révision Honda CB500 ?", a: "Une révision Honda CB500 coûte environ 200 à 350 € en concession officielle. Les intervalles Honda sont généralement de 12 000 km pour ce modèle." },
      { q: "Honda propose-t-il des motos en permis A2 ?", a: "Oui, Honda dispose d'une gamme A2 complète : CB500F, CB500X, CBR500R, CB125R et CB125F. Toutes sont bridables à 35 kW pour le permis A2." },
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
    intro: [
      "Kawasaki et son identité verte emblématique sont présents en France avec plus de 125 concessionnaires et ateliers agréés. Des Z125 aux H2R en passant par les Ninja, les Z et les Versys, la gamme Kawasaki couvre du 125cc à la supermoto.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Kawasaki en France avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Kawasaki près de chez moi ?", a: "LabelMoto recense 127 points de vente et d'entretien Kawasaki en France. Utilisez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Quel est le prix d'une révision Kawasaki Z650 ?", a: "Une révision Z650 coûte environ 200 à 350 € en concession officielle. Les intervalles Kawasaki sont généralement de 12 000 km." },
      { q: "Quelle Kawasaki choisir en permis A2 ?", a: "La Ninja 500 SE, la Z500 et la Z650 (bridée) sont les modèles Kawasaki les plus recommandés en A2. La Z125 est parfaite pour le permis A1." },
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
    intro: [
      "BMW Motorrad est la référence premium du marché moto en France avec plus de 100 concessions agréées. Des routières GS aux sportives S1000RR en passant par les roadsters R et les F, BMW Motorrad propose une gamme haut de gamme couvrant tous les styles.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés BMW Motorrad en France avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire BMW Motorrad près de chez moi ?", a: "LabelMoto recense 109 concessions BMW Motorrad en France. Utilisez la carte interactive pour trouver l'adresse et les horaires du concessionnaire le plus proche." },
      { q: "Quel est le prix d'entretien d'une BMW GS ?", a: "L'entretien d'une BMW R1250GS coûte environ 400 à 600 € pour une révision standard. Les intervalles BMW sont de 10 000 km. Un grand entretien (40 000 km) peut atteindre 1 500 €." },
      { q: "BMW propose-t-il des motos en permis A2 ?", a: "Oui, la BMW G310R et la F900R (bridée) sont homologuées A2. La G310GS est également disponible en version bridée pour les jeunes permis." },
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
    intro: [
      "Triumph, marque britannique légendaire fondée en 1902, dispose d'un réseau solide en France avec plus de 90 concessions agréées. Des roadsters Trident et Street Triple aux trails Tiger en passant par les Bonneville néo-classiques, Triumph séduit par son caractère unique.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Triumph en France avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Triumph près de chez moi ?", a: "LabelMoto recense 93 concessions Triumph en France. Utilisez la carte interactive pour trouver l'adresse la plus proche avec les horaires et contacts." },
      { q: "Quel est le prix d'entretien d'un Triumph Trident 660 ?", a: "Une révision Trident 660 coûte environ 280 à 420 € en concession officielle. Les intervalles Triumph sont de 16 000 km — parmi les plus longs du marché." },
      { q: "Triumph propose-t-il des motos en permis A2 ?", a: "Oui, la Trident 660 est bridable à 35 kW pour le permis A2, tout en conservant ses performances une fois le permis A obtenu. C'est l'une des meilleures motos A2 du marché." },
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
      "Ducati, icône italienne de la moto sportive et du design, dispose d'un réseau de plus de 60 concessions agréées en France. Des Panigale supersportives aux Scrambler néo-rétro en passant par les Monster et les Multistrada adventure, Ducati incarne l'excellence italienne.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Ducati en France avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Ducati près de chez moi ?", a: "LabelMoto recense 60 concessions Ducati en France. Utilisez la carte interactive pour trouver l'adresse la plus proche avec les horaires et contacts." },
      { q: "Quel est le prix d'entretien d'une Ducati ?", a: "L'entretien d'une Ducati est plus élevé que la moyenne : comptez 500 à 900 € pour une révision complète incluant la courroie de distribution. Les courroies doivent être changées tous les 2 ans ou 15 000 km selon les modèles." },
      { q: "Ducati propose-t-il des motos en permis A2 ?", a: "Oui, le Ducati Scrambler et le Monster 937 sont bridables pour le permis A2. Le Scrambler est particulièrement recommandé pour sa facilité de prise en main." },
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
      "Royal Enfield, la plus ancienne marque moto encore en production, connaît une croissance remarquable en France avec plus de 60 concessions agréées. Le Classic 350, le Meteor, le Himalayan et le Hunter 350 séduisent par leur style néo-rétro, leur accessibilité et leur polyvalence.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés Royal Enfield en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Royal Enfield près de chez moi ?", a: "LabelMoto recense 61 concessions Royal Enfield en France. Utilisez la carte interactive pour trouver l'adresse la plus proche." },
      { q: "Royal Enfield est-elle une marque fiable ?", a: "Les modèles récents (2020+) sont nettement plus fiables que les anciennes générations. Le Classic 350 et le Meteor bénéficient d'une motorisation moderne bien rodée. Les retours utilisateurs en France sont très positifs." },
      { q: "Royal Enfield propose-t-elle des motos en permis A2 ?", a: "Oui, le Hunter 350 et le Meteor 350 sont homologués A2 de série. Ils constituent deux des meilleures options néo-rétro du marché pour les permis A2." },
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
    intro: [
      "KTM, la marque autrichienne au casque orange, dispose d'un réseau de plus de 50 concessions agréées en France. Des Duke 125 aux Adventure 1290 en passant par les RC sportives et les Enduro, KTM propose des motos sportives et techniquement avancées pour les pilotes exigeants.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés KTM en France avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire KTM près de chez moi ?", a: "LabelMoto recense 54 concessions KTM en France. Utilisez la carte interactive pour trouver l'adresse la plus proche avec les horaires et contacts." },
      { q: "Quel est le prix d'entretien d'une KTM Duke ?", a: "Une révision KTM 125 Duke coûte environ 200 à 320 € en concession officielle. Les intervalles KTM sont de 5 000 km, soit plus fréquents que la moyenne — à anticiper dans le budget." },
      { q: "KTM propose-t-elle des motos en permis A2 ?", a: "Oui, la KTM 390 Duke, la 390 Adventure et la RC390 sont parfaitement adaptées au permis A2. La Duke 125 est idéale pour le permis A1." },
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
];

export function getBrandBySlug(slug: string): BrandData | undefined {
  return BRANDS.find(b => b.slug === slug);
}

export function getAllBrandSlugs(): string[] {
  return BRANDS.map(b => b.slug);
}

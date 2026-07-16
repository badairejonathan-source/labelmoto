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

  {
    slug: 'cf-moto',
    name: 'CF Moto',
    displayName: 'CF Moto',
    firestoreValue: 'CF Moto',
    metaTitle: "Concessionnaire CF Moto en France : 82 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire CF Moto en France parmi 82 adresses vérifiées. 450MT, 800MT, 450SR, 700CL-X — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires CF Moto en France',
    intro: [
      "CF Moto est la marque chinoise qui monte le plus vite en France avec plus de 80 concessionnaires agréés. Ses modèles trail (450MT, 800MT Touring) et sport (450SR, 675SR-R) offrent un rapport qualité-prix imbattable face aux marques japonaises. La marque est déjà présente dans de nombreux concessionnaires multimarques.",
      "LabelMoto recense tous les concessionnaires et ateliers agréés CF Moto en France avec fiches vérifiées, avis et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire CF Moto près de chez moi ?", a: "LabelMoto recense 82 points de vente CF Moto en France. CF Moto est souvent vendu chez des concessionnaires multimarques à côté de KTM, Kawasaki ou Husqvarna. Utilisez la carte interactive pour trouver le plus proche." },
      { q: "CF Moto est-elle une marque fiable ?", a: "Les modèles récents (2022+) de CF Moto ont considérablement progressé en qualité. La 450MT et la 800MT Touring reçoivent des retours très positifs. Le réseau de concessionnaires s'étoffe chaque année pour assurer le SAV." },
      { q: "Quel est le prix d'entretien d'une CF Moto ?", a: "L'entretien d'une CF Moto est moins cher que les marques japonaises équivalentes : comptez 150 à 280 € pour une révision standard. C'est l'un des principaux arguments de la marque." },
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
      "Moto Guzzi, fondée en 1921 et membre du groupe Piaggio, est l'une des marques les plus emblématiques de la moto italienne. Son moteur bicylindre en V transversal est unique au monde. En France, plus de 30 concessionnaires agréés proposent les V7, V9, V100 Mandello et Stelvio.",
      "LabelMoto recense tous les concessionnaires Moto Guzzi en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Moto Guzzi près de chez moi ?", a: "LabelMoto recense 31 concessions Moto Guzzi en France. Le réseau est moins dense que les grandes marques japonaises mais couvre bien le territoire. Utilisez la carte interactive." },
      { q: "Moto Guzzi est-elle une marque fiable ?", a: "Les modèles récents de Moto Guzzi sont bien plus fiables que les anciennes générations. Le V7 et le V100 Mandello reçoivent d'excellents retours. L'entretien est cependant plus cher qu'une japonaise." },
      { q: "Quel est le prix d'entretien d'une Moto Guzzi ?", a: "Comptez 350 à 600 € pour une révision complète en concession Moto Guzzi. Les intervalles sont de 10 000 km. La courroie trapézoïdale de transmission finale ne nécessite pas d'entretien — un avantage concret." },
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
      "Indian Motorcycle, la plus ancienne marque moto américaine encore en production, dispose d'un réseau de plus de 30 concessionnaires agréés en France. Ses cruisers (Scout, Chief, Pursuit) et sa sportive FTR séduisent les amateurs de motos américaines premium cherchant une alternative à Harley-Davidson.",
      "LabelMoto recense tous les concessionnaires Indian Motorcycle en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Indian Motorcycle près de chez moi ?", a: "LabelMoto recense 33 concessions Indian Motorcycle en France. Utilisez la carte interactive pour trouver l'adresse la plus proche avec les horaires." },
      { q: "Indian Motorcycle est-elle une bonne alternative à Harley-Davidson ?", a: "Indian propose souvent plus de technologie moderne (TFT, aides à la conduite) pour un prix équivalent à Harley. La qualité de finition est très appréciée. Le réseau SAV est moins dense mais croît rapidement en France." },
      { q: "Quel est le prix d'entretien d'une Indian ?", a: "Comptez 400 à 700 € pour une révision complète en concession Indian. Les intervalles sont de 8 000 km. L'entretien est dans la même gamme que Harley-Davidson." },
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
    intro: [
      "Zontes est une marque chinoise qui monte rapidement sur le marché français avec plus de 40 concessionnaires agréés. Ses roadsters 125 et 350cc proposent un design moderne et une finition soignée à des prix très compétitifs, séduisant particulièrement les jeunes motards en permis A1 et A2.",
      "LabelMoto recense tous les concessionnaires et distributeurs Zontes en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Zontes près de chez moi ?", a: "LabelMoto recense 46 points de vente Zontes en France. Zontes est souvent vendu chez des concessionnaires multimarques. Utilisez la carte interactive pour trouver le plus proche." },
      { q: "Zontes est-elle une marque fiable ?", a: "Zontes a progressé en qualité sur ses derniers modèles. Les 350cc reçoivent des retours positifs en termes de finition et de motorisation. Le réseau SAV se développe mais reste moins dense que les grandes marques." },
      { q: "Quelle Zontes choisir en permis A1 ou A2 ?", a: "La Zontes 125G et 125 ZT sont bien adaptées au permis A1. Pour le permis A2, la 350T et la 350ADV offrent un bon rapport prestations/prix dans la catégorie adventure/roadster." },
    ],
  },
  {
    slug: 'voge',
    name: 'VOGE',
    displayName: 'VOGE',
    firestoreValue: 'VOGE',
    metaTitle: "Concessionnaire VOGE en France : 40 adresses vérifiées | LabelMoto",
    metaDescription: "Trouvez votre concessionnaire VOGE en France parmi 40 adresses vérifiées. DS900X, 525DSX, 300RR — concessions officielles avec contacts sur LabelMoto.",
    h1: 'Concessionnaires VOGE en France',
    intro: [
      "VOGE est une marque chinoise liée à Loncin (partenaire de BMW) qui progresse rapidement en France avec plus de 40 distributeurs agréés. Ses modèles adventure (DS900X, 525DSX) et sport (300RR) proposent une technologie moderne à des tarifs très compétitifs, s'imposant comme une alternative sérieuse aux marques établies.",
      "LabelMoto recense tous les concessionnaires et distributeurs VOGE en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire VOGE près de chez moi ?", a: "LabelMoto recense 40 points de vente VOGE en France. VOGE est généralement vendu chez des concessionnaires multimarques. Consultez la carte interactive pour trouver le plus proche." },
      { q: "VOGE est-elle une marque sérieuse ?", a: "Oui, VOGE appartient à Loncin qui est partenaire de BMW sur certains projets. Les modèles adventure comme le DS900X reçoivent de bons retours pour leur rapport qualité-prix et leur équipement de série généreux." },
      { q: "Quel est le prix d'entretien d'une VOGE ?", a: "L'entretien d'une VOGE est très économique comparé aux marques européennes équivalentes. Comptez 150 à 280 € pour une révision standard. C'est l'un des principaux atouts de la marque." },
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
    intro: [
      "Husqvarna Motorcycles, marque suédoise appartenant au groupe KTM (Pierer Mobility), dispose d'une vingtaine de concessionnaires agréés en France. Ses roadsters au design scandinave épuré (Svartpilen, Vitpilen) et son adventure Norden 901 séduisent une clientèle urbaine et lifestyle exigeante.",
      "LabelMoto recense tous les concessionnaires Husqvarna Motorcycles en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Husqvarna Motorcycles près de chez moi ?", a: "LabelMoto recense 23 concessions Husqvarna en France. Husqvarna est souvent vendu chez les mêmes concessionnaires que KTM. Utilisez la carte interactive pour trouver le plus proche." },
      { q: "Quelle est la différence entre KTM et Husqvarna ?", a: "Husqvarna et KTM partagent la même plateforme technique mais diffèrent par le design et le positionnement. Husqvarna vise un style plus urbain et scandinave, KTM reste plus sportif et agressif. Les moteurs sont souvent identiques." },
      { q: "Quel est le prix d'entretien d'une Husqvarna Svartpilen ?", a: "Les intervalles Husqvarna sont de 7 500 km, soit proches de KTM. Comptez 250 à 400 € pour une révision en concession officielle." },
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
    intro: [
      "QJ Motor est la marque premium du groupe Qianjiang (propriétaire de Benelli) et monte rapidement en France avec plus de 25 concessionnaires agréés. Ses roadsters et trails (SRK 400, SRK 600, SRT 800, SRS 400) proposent une technologie moderne à des prix agressifs, concurrençant directement les 400 à 650cc japonais.",
      "LabelMoto recense tous les concessionnaires QJ Motor en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire QJ Motor près de chez moi ?", a: "LabelMoto recense 27 points de vente QJ Motor en France. QJ Motor est souvent distribué chez des concessionnaires multimarques. Consultez la carte interactive pour trouver le plus proche." },
      { q: "QJ Motor est-elle une marque sérieuse ?", a: "QJ Motor appartient au groupe Qianjiang qui possède Benelli depuis 2005 et a noué des partenariats avec des constructeurs européens. Les modèles SRK et SRT reçoivent des retours positifs pour leur équipement et leur rapport qualité-prix." },
      { q: "Quelle QJ Motor choisir en permis A2 ?", a: "La SRK 400 et la SRS 400 sont parfaitement adaptées au permis A2, avec des prestations comparables aux 400cc japonais pour un prix nettement inférieur. La SRT 800 (bridée) convient aussi aux permis A2 avancés." },
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
    intro: [
      "Benelli, marque italienne fondée en 1911 et aujourd'hui appartenant au groupe Qianjiang, dispose d'une vingtaine de distributeurs agréés en France. Ses modèles TRK 502 (trail), Leoncino (scrambler) et 752S (roadster) proposent un style italien à des prix très accessibles.",
      "LabelMoto recense tous les concessionnaires et distributeurs Benelli en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Benelli près de chez moi ?", a: "LabelMoto recense 20 points de vente Benelli en France. Benelli est souvent distribué chez des concessionnaires multimarques. Consultez la carte interactive." },
      { q: "Benelli est-elle une marque fiable ?", a: "Les modèles récents (2020+) de Benelli ont progressé en fiabilité. Le TRK 502 est le modèle le plus vendu et le mieux noté. L'entretien reste moins cher que les marques européennes équivalentes." },
      { q: "Quel est le prix d'entretien d'une Benelli TRK 502 ?", a: "Comptez 200 à 350 € pour une révision Benelli TRK 502 en concession officielle. Les intervalles sont de 6 000 km." },
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
    intro: [
      "Kove est une marque chinoise créée en partenariat avec KTM, présente dans une vingtaine de concessionnaires en France. Ses modèles adventure et enduro (450 Rally, 800X, 500X) utilisent des technologies directement issues du savoir-faire KTM, offrant des performances élevées à des prix très compétitifs.",
      "LabelMoto recense tous les concessionnaires et distributeurs Kove en France avec fiches vérifiées et coordonnées directes.",
    ],
    faq: [
      { q: "Où trouver un concessionnaire Kove près de chez moi ?", a: "LabelMoto recense 18 points de vente Kove en France. Kove est souvent distribué chez des concessionnaires multimarques spécialisés trail. Consultez la carte interactive." },
      { q: "Kove est-elle vraiment liée à KTM ?", a: "Kove a été fondée avec des ingénieurs issus de KTM et utilise certaines technologies communes. La 450 Rally utilise une motorisation proche de la KTM 450 Rally. C'est une garantie de sérieux technique pour une marque émergente." },
      { q: "Quel est le rapport qualité-prix d'une Kove ?", a: "Excellent. La Kove 450 Rally est proposée à environ 7 000-8 000 €, soit bien moins qu'une KTM 450 Rally équivalente. Les propriétaires soulignent la qualité des composants et les performances en trail." },
    ],
  },
];

export function getBrandBySlug(slug: string): BrandData | undefined {
  return BRANDS.find(b => b.slug === slug);
}

export function getAllBrandSlugs(): string[] {
  return BRANDS.map(b => b.slug);
}

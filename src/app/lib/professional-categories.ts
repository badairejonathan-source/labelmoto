export interface ProfessionalCategoryData {
  slug: ProfessionalCategorySlug;
  label: string;
  singular: string;
  shortLabel: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  mapSearch: string;
}

export interface ProfessionalCategorySource {
  title?: unknown;
  category?: unknown;
  appSection?: unknown;
  collection?: unknown;
  creatorType?: unknown;
  activite?: unknown;
  specialties?: unknown;
}

export const PROFESSIONAL_CATEGORIES = [
  {
    slug: 'concessionnaires-revendeurs',
    label: 'Concessionnaires & revendeurs',
    singular: 'Concessionnaire / revendeur',
    shortLabel: 'Concessions',
    h1: 'Concessionnaires et revendeurs moto en France',
    metaTitle:
      'Concessionnaires et revendeurs moto en France | LabelMoto',
    metaDescription:
      'Trouvez un concessionnaire ou revendeur moto en France : motos neuves et d’occasion, scooters, distributeurs et magasins spécialisés référencés sur LabelMoto.',
    intro:
      'Retrouvez les concessionnaires, revendeurs et magasins moto référencés par LabelMoto partout en France.',
    mapSearch: 'concessionnaire moto',
  },
  {
    slug: 'ateliers-mecaniciens',
    label: 'Ateliers & mécaniciens',
    singular: 'Atelier / mécanicien',
    shortLabel: 'Ateliers',
    h1: 'Ateliers et mécaniciens moto en France',
    metaTitle:
      'Ateliers et mécaniciens moto en France | LabelMoto',
    metaDescription:
      'Trouvez un atelier ou mécanicien moto en France pour l’entretien, la réparation, le diagnostic et la mécanique de votre moto.',
    intro:
      'Découvrez les ateliers, garages et mécaniciens spécialisés dans l’entretien et la réparation moto.',
    mapSearch: 'atelier moto',
  },
  {
    slug: 'equipement-accessoires',
    label: 'Équipement & accessoires',
    singular: 'Équipementier / accessoiriste',
    shortLabel: 'Équipement',
    h1: 'Équipementiers et accessoiristes moto en France',
    metaTitle:
      'Équipementiers et accessoiristes moto en France | LabelMoto',
    metaDescription:
      'Trouvez des magasins d’équipement, accessoires, pièces, pneus et équipements pour motards partout en France.',
    intro:
      'Retrouvez les professionnels des pièces, accessoires et équipements pour la moto et le motard.',
    mapSearch: 'équipement moto',
  },
  {
    slug: 'location-moto',
    label: 'Location moto',
    singular: 'Loueur moto',
    shortLabel: 'Location',
    h1: 'Location de motos et scooters en France',
    metaTitle:
      'Location moto et scooter en France | LabelMoto',
    metaDescription:
      'Trouvez une agence de location de motos ou scooters en France grâce à l’annuaire LabelMoto.',
    intro:
      'Trouvez les professionnels proposant des motos ou scooters à la location en France.',
    mapSearch: 'location moto',
  },
  {
    slug: 'transport-moto',
    label: 'Transport moto',
    singular: 'Transporteur moto',
    shortLabel: 'Transport',
    h1: 'Transporteurs moto en France',
    metaTitle:
      'Transporteurs moto en France | LabelMoto',
    metaDescription:
      'Trouvez un transporteur spécialisé dans le transport, le convoyage ou le stockage de motos en France.',
    intro:
      'Retrouvez les professionnels spécialisés dans le transport, le convoyage et le stockage de motos.',
    mapSearch: 'transporteur moto',
  },
  {
    slug: 'preparateurs-moto',
    label: 'Préparateurs moto',
    singular: 'Préparateur moto',
    shortLabel: 'Préparateurs',
    h1: 'Préparateurs moto en France',
    metaTitle:
      'Préparateurs moto en France | LabelMoto',
    metaDescription:
      'Découvrez les préparateurs moto, ateliers custom et spécialistes de la personnalisation moto en France.',
    intro:
      'Découvrez les préparateurs et ateliers spécialisés dans la transformation et la personnalisation de motos.',
    mapSearch: 'préparateur moto',
  },
  {
    slug: 'peintres-carrossiers',
    label: 'Peintres & carrossiers moto',
    singular: 'Peintre / carrossier moto',
    shortLabel: 'Peinture',
    h1: 'Peintres et carrossiers moto en France',
    metaTitle:
      'Peintres et carrossiers moto en France | LabelMoto',
    metaDescription:
      'Trouvez un peintre, carrossier ou spécialiste de l’aérographie moto en France.',
    intro:
      'Retrouvez les peintres, carrossiers et spécialistes des finitions et décors moto.',
    mapSearch: 'peintre moto',
  },
  {
    slug: 'selliers-moto',
    label: 'Selliers moto',
    singular: 'Sellier moto',
    shortLabel: 'Selliers',
    h1: 'Selliers moto en France',
    metaTitle:
      'Selliers moto en France | LabelMoto',
    metaDescription:
      'Trouvez un sellier moto en France pour refaire, modifier ou personnaliser votre selle.',
    intro:
      'Retrouvez les artisans selliers spécialisés dans les selles et habillages pour motos.',
    mapSearch: 'sellier moto',
  },
  {
    slug: 'photographes-videastes',
    label: 'Photographes & vidéastes moto',
    singular: 'Photographe / vidéaste moto',
    shortLabel: 'Photo & vidéo',
    h1: 'Photographes et vidéastes moto en France',
    metaTitle:
      'Photographes et vidéastes moto en France | LabelMoto',
    metaDescription:
      'Découvrez les photographes et vidéastes spécialisés dans la moto, les événements, shootings et contenus professionnels.',
    intro:
      'Découvrez les photographes et vidéastes qui mettent en image la moto, les pilotes, les événements et les professionnels.',
    mapSearch: 'photographe moto',
  },
  {
    slug: 'formation-moto-ecoles',
    label: 'Formation & moto-écoles',
    singular: 'Formateur / moto-école',
    shortLabel: 'Formation',
    h1: 'Moto-écoles et formations moto en France',
    metaTitle:
      'Moto-écoles et formations moto en France | LabelMoto',
    metaDescription:
      'Trouvez une moto-école, une école de pilotage ou un professionnel de la formation moto en France.',
    intro:
      'Retrouvez les moto-écoles, écoles de pilotage et organismes proposant des formations liées à la moto.',
    mapSearch: 'moto-école',
  },
] as const;

export type ProfessionalCategorySlug =
  (typeof PROFESSIONAL_CATEGORIES)[number]['slug'];

const CATEGORY_BY_SLUG =
  new Map<ProfessionalCategorySlug, ProfessionalCategoryData>(
    PROFESSIONAL_CATEGORIES.map(category => [
      category.slug,
      category,
    ])
  );

export function getProfessionalCategoryBySlug(
  slug: string
): ProfessionalCategoryData | undefined {
  return CATEGORY_BY_SLUG.get(
    slug as ProfessionalCategorySlug
  );
}

export function getAllProfessionalCategorySlugs():
  ProfessionalCategorySlug[] {
  return PROFESSIONAL_CATEGORIES.map(
    category => category.slug
  );
}

export function normalizeProfessionalText(
  value: unknown
): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' et ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sourceCorpus(
  source: ProfessionalCategorySource
): string {
  const specialties =
    Array.isArray(source.specialties)
      ? source.specialties.join(' ')
      : source.specialties;

  return normalizeProfessionalText([
    source.title,
    source.category,
    source.creatorType,
    source.activite,
    specialties,
  ].filter(Boolean).join(' '));
}

function includesAny(
  corpus: string,
  terms: readonly string[]
): boolean {
  return terms.some(term => {
    const normalized =
      normalizeProfessionalText(term);

    return (
      normalized.length > 0 &&
      corpus.includes(normalized)
    );
  });
}

function isExcludedUniverse(
  source: ProfessionalCategorySource
): boolean {
  const section =
    normalizeProfessionalText(
      source.appSection
    );

  const collection =
    normalizeProfessionalText(
      source.collection
    );

  return (
    section === 'association' ||
    section === 'relais' ||
    collection === 'associations' ||
    collection === 'relais'
  );
}

function isClearlyAutomotiveOnly(
  corpus: string
): boolean {
  const hasAutomotive =
    includesAny(corpus, [
      'automobile',
      'voiture',
      'voitures',
      'auto',
      'bateau',
      'bateaux',
    ]);

  const hasMoto =
    includesAny(corpus, [
      'moto',
      'motos',
      'motocycle',
      'motorcycle',
      'scooter',
      'scooters',
      'cyclomoteur',
      '2 roues',
      'deux roues',
      'motard',
      'quad',
    ]);

  return (
    hasAutomotive &&
    !hasMoto
  );
}

function pushIf(
  result: ProfessionalCategorySlug[],
  condition: boolean,
  slug: ProfessionalCategorySlug
): void {
  if (
    condition &&
    !result.includes(slug)
  ) {
    result.push(slug);
  }
}

export function classifyProfessionalCategories(
  source: ProfessionalCategorySource
): ProfessionalCategorySlug[] {
  if (
    isExcludedUniverse(source)
  ) {
    return [];
  }

  const corpus =
    sourceCorpus(source);

  if (!corpus) {
    return [];
  }

  const result:
    ProfessionalCategorySlug[] = [];

  const automotiveOnly =
    isClearlyAutomotiveOnly(
      corpus
    );

  /*
   * Métiers spécialisés.
   * Ils sont testés avant les catégories générales.
   */

  pushIf(
    result,
    includesAny(corpus, [
      'location de motos',
      'location moto',
      'location de scooters',
      'location scooter',
      'louer une moto',
      'loueur moto',
      'location motorcycle',
    ]),
    'location-moto'
  );

  pushIf(
    result,
    (
      includesAny(corpus, [
        'transport moto',
        'transport de moto',
        'transport de motos',
        'transport et stockage moto',
        'transporteur moto',
        'convoyage moto',
        'convoyeur moto',
        'stockage moto',
        'livraison moto',
      ]) ||
      (
        includesAny(corpus, [
          'transport',
          'convoyage',
          'stockage',
        ]) &&
        includesAny(corpus, [
          'moto',
          'motos',
          'motocycle',
          'motorcycle',
          'scooter',
        ])
      )
    ),
    'transport-moto'
  );

  pushIf(
    result,
    includesAny(corpus, [
      'preparateur',
      'preparation moto',
      'preparation motos',
      'prepa moto',
      'prepa',
      'custom moto',
      'customisation moto',
      'kustom',
      'tuning moto',
      'transformation moto',
    ]),
    'preparateurs-moto'
  );

  pushIf(
    result,
    includesAny(corpus, [
      'peintre moto',
      'peinture moto',
      'peintures moto',
      'carrosserie moto',
      'carrosserie motos',
      'carrossier moto',
      'aerographie moto',
      'aerographe moto',
    ]),
    'peintres-carrossiers'
  );

  pushIf(
    result,
    includesAny(corpus, [
      'sellerie moto',
      'sellerie motos',
      'sellier moto',
      'sellier motos',
      'sellerie bourrellerie',
      'bourrellerie',
      'selle sur mesure',
      'selles sur mesure',
    ]),
    'selliers-moto'
  );

  pushIf(
    result,
    includesAny(corpus, [
      'photographe moto',
      'photographie moto',
      'photographie',
      'photographe',
      'videaste moto',
      'videaste',
      'videographie',
      'video moto',
      'photo moto',
      'photo evenementiel',
      'photo evenementielle',
    ]),
    'photographes-videastes'
  );

  pushIf(
    result,
    (
      includesAny(corpus, [
        'moto ecole',
        'moto ecoles',
        'ecole de pilotage',
        'ecole moto',
        'formation moto',
        'formateur moto',
        'permis moto',
      ]) ||
      (
        includesAny(corpus, [
          'formation',
          'formateur',
          'ecole de conduite',
          'auto ecole',
        ]) &&
        includesAny(corpus, [
          'moto',
          'motocycle',
          'motorcycle',
          '2 roues',
          'deux roues',
          'permis a',
        ])
      )
    ),
    'formation-moto-ecoles'
  );

  /*
   * Équipement / accessoires.
   * Les libellés tronqués de points.json sont
   * volontairement pris en charge.
   */

  const equipmentMatch =
    includesAny(corpus, [
      'magasin de pieces et d accessoires pour',
      'pieces moto',
      'piece moto',
      'accessoires moto',
      'accessoire moto',
      'accessoiriste',
      'equipement moto',
      'equipements moto',
      'equipement du motard',
      'equipements du motard',
      'equipementier',
      'magasin de pneus',
      'pneus moto',
      'pneumatiques moto',
      'batteries moto',
      'casques moto',
      'vetements moto',
    ]);

  pushIf(
    result,
    equipmentMatch &&
      !result.includes(
        'selliers-moto'
      ),
    'equipement-accessoires'
  );

  /*
   * Ateliers / mécaniciens.
   */

  const explicitWorkshop =
    includesAny(corpus, [
      'atelier de reparation pour motos',
      'atelier de reparation de motos',
      'atelier de reparation de scooters',
      'garage moto',
      'garage motos',
      'mecanicien moto',
      'mecanique moto',
      'entretien moto',
      'entretien motos',
      'reparation moto',
      'reparation motos',
      'service moto',
    ]);

  const genericWorkshopWithMotoContext =
    (
      includesAny(corpus, [
        'atelier',
        'garage',
        'mecanicien',
        'mecanique',
        'reparation',
        'entretien',
      ]) &&
      includesAny(corpus, [
        'moto',
        'motos',
        'scooter',
        'scooters',
        'motocycle',
        'motorcycle',
        '2 roues',
        'deux roues',
      ])
    );

  pushIf(
    result,
    !automotiveOnly &&
      (
        explicitWorkshop ||
        genericWorkshopWithMotoContext
      ),
    'ateliers-mecaniciens'
  );

  /*
   * Concessionnaires / revendeurs.
   */

  const dealershipMatch =
    includesAny(corpus, [
      'concessionnaire de motos',
      'concessionnaire moto',
      'concessionnaire de scooters',
      'concessionnaire scooter',
      'concessionnaire motos d occasion',
      'concessionnaire de motos d occasion',
      'concessionnaire',
      'magasin de motos',
      'magasin moto',
      'magasin de scooters',
      'revendeur moto',
      'revendeur motos',
      'distributeur de motos',
      'distributeur motos',
      'showroom moto',
    ]);

  pushIf(
    result,
    dealershipMatch &&
      !automotiveOnly &&
      !equipmentMatch,
    'concessionnaires-revendeurs'
  );

  return result;
}

export function professionalMatchesCategory(
  source: ProfessionalCategorySource,
  slug: ProfessionalCategorySlug
): boolean {
  return classifyProfessionalCategories(
    source
  ).includes(slug);
}

const PRIMARY_CATEGORY_PRIORITY:
  readonly ProfessionalCategorySlug[] = [
    'photographes-videastes',
    'selliers-moto',
    'peintres-carrossiers',
    'preparateurs-moto',
    'transport-moto',
    'location-moto',
    'formation-moto-ecoles',
    'equipement-accessoires',
    'ateliers-mecaniciens',
    'concessionnaires-revendeurs',
  ];

export function getPrimaryProfessionalCategory(
  source: ProfessionalCategorySource
): ProfessionalCategorySlug | null {
  const categories =
    classifyProfessionalCategories(
      source
    );

  return (
    PRIMARY_CATEGORY_PRIORITY.find(
      slug =>
        categories.includes(slug)
    ) ||
    null
  );
}

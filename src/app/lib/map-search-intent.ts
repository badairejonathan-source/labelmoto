export type MapSearchFilterId =
  | 'concessionnaires-revendeurs'
  | 'ateliers-mecaniciens'
  | 'association'
  | 'relais'
  | 'equipement-accessoires'
  | 'location-moto'
  | 'transport-moto'
  | 'preparateurs-moto'
  | 'peintres-carrossiers'
  | 'selliers-moto'
  | 'photographes-videastes'
  | 'formation-moto-ecoles';

type MapProfessionDefinition = {
  filter: MapSearchFilterId;
  terms: readonly string[];
};

const MAP_PROFESSION_DEFINITIONS:
  readonly MapProfessionDefinition[] = [
    {
      filter: 'concessionnaires-revendeurs',
      terms: [
        'concessionnaire',
        'concessionnaires',
        'concession',
        'concessions',
        'revendeur',
        'revendeurs',
        'vente moto',
      ],
    },
    {
      filter: 'ateliers-mecaniciens',
      terms: [
        'mecanicien',
        'mecaniciens',
        'mecano',
        'mecanos',
        'garagiste',
        'garagistes',
        'garage',
        'garages',
        'atelier',
        'ateliers',
        'reparateur',
        'reparateurs',
        'reparation moto',
        'entretien moto',
        'revision moto',
      ],
    },
    {
      filter: 'association',
      terms: [
        'association',
        'associations',
        'club moto',
        'clubs moto',
        'moto club',
        'moto clubs',
      ],
    },
    {
      filter: 'relais',
      terms: [
        'relais motard',
        'relais motards',
        'relais moto',
        'relais',
      ],
    },
    {
      filter: 'equipement-accessoires',
      terms: [
        'equipementier',
        'equipementiers',
        'equipement',
        'equipements',
        'accessoiriste',
        'accessoiristes',
        'accessoire',
        'accessoires',
      ],
    },
    {
      filter: 'location-moto',
      terms: [
        'location de moto',
        'location moto',
        'louer une moto',
        'louer moto',
        'loueur',
        'loueurs',
        'location',
      ],
    },
    {
      filter: 'transport-moto',
      terms: [
        'transport de moto',
        'transport moto',
        'transporteur',
        'transporteurs',
        'transport',
      ],
    },
    {
      filter: 'preparateurs-moto',
      terms: [
        'preparation moto',
        'preparateur',
        'preparateurs',
        'customisation moto',
        'customiseur',
        'customiseurs',
      ],
    },
    {
      filter: 'peintres-carrossiers',
      terms: [
        'peinture moto',
        'peintre',
        'peintres',
        'carrossier',
        'carrossiers',
        'carrosserie',
        'aerographe',
        'aerographes',
        'aerographie',
      ],
    },
    {
      filter: 'selliers-moto',
      terms: [
        'sellerie moto',
        'sellier',
        'selliers',
        'sellerie',
      ],
    },
    {
      filter: 'photographes-videastes',
      terms: [
        'photographe',
        'photographes',
        'photo moto',
        'videaste',
        'videastes',
        'video moto',
      ],
    },
    {
      filter: 'formation-moto-ecoles',
      terms: [
        'moto ecole',
        'moto ecoles',
        'ecole de pilotage',
        'formation moto',
        'formation',
        'formations',
        'formateur',
        'formateurs',
        'stage de conduite',
        'stage conduite',
        'stage de pilotage',
        'stage pilotage',
        'stage moto',
      ],
    },
  ];

const MAP_SEARCH_FILTER_IDS =
  new Set<MapSearchFilterId>(
    MAP_PROFESSION_DEFINITIONS.map(
      definition => definition.filter
    )
  );

const LEGACY_FILTER_IDS:
  Record<string, MapSearchFilterId> = {
    shopping: 'concessionnaires-revendeurs',
    service: 'ateliers-mecaniciens',
    creator: 'photographes-videastes',
  };

function normalizeIntentText(
  value: string
): string {
  return String(value || '')
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      ' '
    )
    .replace(
      /\s+/g,
      ' '
    )
    .trim();
}

function escapeRegExp(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}

function termRegExp(
  term: string
): RegExp {
  const normalizedTerm =
    normalizeIntentText(term);

  const pattern =
    normalizedTerm
      .split(' ')
      .filter(Boolean)
      .map(escapeRegExp)
      .join('\\s+');

  return new RegExp(
    `(?:^|\\s)${pattern}(?=\\s|$)`,
    'g'
  );
}

function normalizePreferredFilter(
  value?: string | null
): MapSearchFilterId | null {
  const raw =
    String(value || '').trim();

  if (!raw) {
    return null;
  }

  const normalized =
    LEGACY_FILTER_IDS[raw] ||
    raw;

  return MAP_SEARCH_FILTER_IDS.has(
    normalized as MapSearchFilterId
  )
    ? normalized as MapSearchFilterId
    : null;
}

function detectProfessionDefinition(
  normalizedValue: string
): MapProfessionDefinition | null {
  if (!normalizedValue) {
    return null;
  }

  for (
    const definition
    of MAP_PROFESSION_DEFINITIONS
  ) {
    const matches =
      definition.terms.some(
        term =>
          termRegExp(term).test(
            normalizedValue
          )
      );

    if (matches) {
      return definition;
    }
  }

  return null;
}

export function resolveMapProfessionSearch(
  value: string,
  preferredFilter?: string | null
): {
  filter: MapSearchFilterId | null;
  query: string;
} {
  const normalizedValue =
    normalizeIntentText(value);

  const preferred =
    normalizePreferredFilter(
      preferredFilter
    );

  const detected =
    detectProfessionDefinition(
      normalizedValue
    );

  const filter =
    preferred ||
    detected?.filter ||
    null;

  if (!filter) {
    return {
      filter: null,
      query: String(value || '').trim(),
    };
  }

  const definition =
    MAP_PROFESSION_DEFINITIONS.find(
      candidate =>
        candidate.filter === filter
    );

  let query =
    normalizedValue;

  if (definition) {
    const terms =
      [...definition.terms]
        .sort(
          (a, b) =>
            normalizeIntentText(b).length -
            normalizeIntentText(a).length
        );

    for (const term of terms) {
      query = query.replace(
        termRegExp(term),
        ' '
      );
    }
  }

  query = query
    .replace(
      /\b(?:moto|motos|motard|motards)\b/g,
      ' '
    )
    .replace(
      /\s+/g,
      ' '
    )
    .trim();

  return {
    filter,
    query,
  };
}

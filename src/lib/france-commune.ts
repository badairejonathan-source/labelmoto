export type FrenchCommuneSuccess = {
  ok: true;
  name: string;
  code: string;
  departmentCode: string;
  lat: number;
  lng: number;
};

export type FrenchCommuneFailure = {
  ok: false;
  reason:
    | 'not_found'
    | 'department_mismatch'
    | 'service_unavailable';
};

export type FrenchCommuneResult =
  | FrenchCommuneSuccess
  | FrenchCommuneFailure;

type ApiCommune = {
  nom?: unknown;
  code?: unknown;
  codeDepartement?: unknown;
  centre?: {
    type?: unknown;
    coordinates?: unknown;
  };
};

function normalizeCommuneName(
  value: string
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .replace(
      /['’]/g,
      ' '
    )
    .replace(
      /-/g,
      ' '
    )
    .replace(
      /\bst\b/g,
      'saint'
    )
    .replace(
      /\bste\b/g,
      'sainte'
    )
    .replace(
      /[^a-z0-9 ]+/g,
      ' '
    )
    .replace(
      /\s+/g,
      ' '
    )
    .trim();
}

export async function resolveFrenchCommune(
  city: string,
  departmentCode: string
): Promise<FrenchCommuneResult> {
  const requestedCity =
    city.trim();

  const requestedDepartment =
    departmentCode
      .trim()
      .toUpperCase();

  if (
    !requestedCity ||
    !requestedDepartment
  ) {
    return {
      ok: false,
      reason: 'not_found',
    };
  }

  const params =
    new URLSearchParams({
      nom: requestedCity,
      fields:
        'nom,code,codeDepartement,centre',
      format: 'json',
    });

  try {
    const response =
      await fetch(
        'https://geo.api.gouv.fr/communes?' +
          params.toString(),
        {
          cache: 'no-store',
          headers: {
            Accept:
              'application/json',
          },
        }
      );

    if (!response.ok) {
      return {
        ok: false,
        reason:
          'service_unavailable',
      };
    }

    const json =
      await response.json();

    if (!Array.isArray(json)) {
      return {
        ok: false,
        reason:
          'service_unavailable',
      };
    }

    const normalizedRequested =
      normalizeCommuneName(
        requestedCity
      );

    const exactNameMatches =
      (json as ApiCommune[])
        .filter(item => {
          const name =
            typeof item.nom ===
            'string'
              ? item.nom
              : '';

          return (
            normalizeCommuneName(
              name
            ) ===
            normalizedRequested
          );
        });

    if (
      exactNameMatches.length === 0
    ) {
      return {
        ok: false,
        reason: 'not_found',
      };
    }

    const departmentMatch =
      exactNameMatches.find(
        item =>
          String(
            item.codeDepartement ||
              ''
          )
            .trim()
            .toUpperCase() ===
          requestedDepartment
      );

    if (!departmentMatch) {
      return {
        ok: false,
        reason:
          'department_mismatch',
      };
    }

    const coordinates =
      departmentMatch
        .centre
        ?.coordinates;

    if (
      !Array.isArray(
        coordinates
      ) ||
      coordinates.length < 2
    ) {
      return {
        ok: false,
        reason:
          'service_unavailable',
      };
    }

    const lng =
      Number(
        coordinates[0]
      );

    const lat =
      Number(
        coordinates[1]
      );

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return {
        ok: false,
        reason:
          'service_unavailable',
      };
    }

    return {
      ok: true,
      name:
        String(
          departmentMatch.nom
        ),
      code:
        String(
          departmentMatch.code ||
            ''
        ),
      departmentCode:
        String(
          departmentMatch
            .codeDepartement
        ),
      lat,
      lng,
    };
  }
  catch {
    return {
      ok: false,
      reason:
        'service_unavailable',
    };
  }
}

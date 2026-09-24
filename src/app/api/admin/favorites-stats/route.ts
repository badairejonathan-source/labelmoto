import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  getAdminAuth,
  getAdminFirestore,
} from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_UIDS = [
  'A36FqeWBHjQBLKQMaMSiFVBzGV22',
  'A366V1X8Hqf1pA63nU3N8B7l8fD3',
  'f7xVfH8R8mS5v8H7N3nU3N8B7l8f',
];

const ADMIN_EMAILS = [
  'badjoe950@hotmail.com',
];

type FavoriteType =
  | 'motorcycle'
  | 'professional'
  | 'article';

interface Aggregate {
  type: FavoriteType;
  targetCollection: string;
  targetId: string;
  count: number;
  lastAddedAt: number;
}

function toMillis(
  value: unknown
): number {
  if (!value) {
    return 0;
  }

  const timestamp = value as {
    toMillis?: () => number;
    seconds?: number;
  };

  if (
    typeof timestamp.toMillis ===
    'function'
  ) {
    return timestamp.toMillis();
  }

  if (
    typeof timestamp.seconds ===
    'number'
  ) {
    return (
      timestamp.seconds *
      1000
    );
  }

  return 0;
}

function resolveIdentity(
  id: string,
  data: Record<string, unknown>
) {
  let targetCollection =
    typeof data.targetCollection ===
      'string'
      ? data.targetCollection.trim()
      : '';

  let targetId =
    typeof data.targetId ===
      'string'
      ? data.targetId.trim()
      : '';

  if (
    (!targetCollection ||
      !targetId) &&
    id.includes('__')
  ) {
    const separator =
      id.indexOf('__');

    if (!targetCollection) {
      targetCollection =
        id.slice(
          0,
          separator
        );
    }

    if (!targetId) {
      targetId =
        id.slice(
          separator + 2
        );
    }
  }

  return {
    targetCollection,
    targetId,
  };
}

function resolveType(
  rawType: unknown,
  targetCollection: string
): FavoriteType | null {
  const type =
    typeof rawType === 'string'
      ? rawType.toLowerCase()
      : '';

  if (
    type === 'motorcycle' ||
    targetCollection ===
      'motorcycle_sheets'
  ) {
    return 'motorcycle';
  }

  if (
    type === 'article' ||
    targetCollection ===
      'articles'
  ) {
    return 'article';
  }

  if (
    type === 'professional' ||
    type === 'pro' ||
    [
      'concessions',
      'associations',
      'relais',
      'creators',
    ].includes(
      targetCollection
    )
  ) {
    return 'professional';
  }

  return null;
}

function extractTitle(
  data: Record<string, unknown>,
  fallback: string
): string {
  const identity =
    data.identity &&
    typeof data.identity ===
      'object'
      ? data.identity as
          Record<string, unknown>
      : {};

  const candidates = [
    data.title,
    data.display_title,
    data.modelName,
    data.name,
    data.businessName,
    data.displayName,
    identity.modelName,
    identity.name,
  ];

  for (const value of candidates) {
    if (
      typeof value === 'string' &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return fallback;
}

function publicHref(
  type: FavoriteType,
  collectionName: string,
  id: string
): string {
  const safeId =
    encodeURIComponent(id);

  if (type === 'motorcycle') {
    return (
      '/fiches/' +
      safeId
    );
  }

  if (type === 'article') {
    return (
      '/info/' +
      safeId
    );
  }

  if (
    collectionName ===
    'creators'
  ) {
    return (
      '/creators/' +
      safeId
    );
  }

  if (
    collectionName ===
      'associations' ||
    collectionName ===
      'relais'
  ) {
    return (
      '/map?selectedId=' +
      safeId
    );
  }

  return (
    '/concessions/' +
    safeId
  );
}

export async function GET(
  request: NextRequest
) {
  try {
    /*
     * Vérification admin AVANT la lecture
     * collectionGroup des favoris.
     */
    const authorization =
      request.headers.get(
        'authorization'
      );

    if (
      !authorization ||
      !authorization.startsWith(
        'Bearer '
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Authentification requise.',
        },
        {
          status: 401,
        }
      );
    }

    const idToken =
      authorization
        .slice(
          'Bearer '.length
        )
        .trim();

    if (!idToken) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Token Firebase manquant.',
        },
        {
          status: 401,
        }
      );
    }

    let decodedToken;

    try {
      decodedToken =
        await getAdminAuth()
          .verifyIdToken(
            idToken
          );
    }
    catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Token Firebase invalide.',
        },
        {
          status: 401,
        }
      );
    }

    const db =
      getAdminFirestore();

    const email =
      typeof decodedToken.email ===
        'string'
        ? decodedToken.email
            .toLowerCase()
        : '';

    const isMasterAdmin =
      decodedToken.email_verified ===
        true &&
      (
        ADMIN_UIDS.includes(
          decodedToken.uid
        ) ||
        ADMIN_EMAILS.includes(
          email
        )
      );

    if (!isMasterAdmin) {
      const userSnapshot =
        await db
          .collection(
            'users'
          )
          .doc(
            decodedToken.uid
          )
          .get();

      if (
        !userSnapshot.exists ||
        userSnapshot.data()?.role !==
          'admin'
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Droits administrateur requis.',
          },
          {
            status: 403,
          }
        );
      }
    }

    const favoritesSnapshot =
      await db
        .collectionGroup(
          'favorites'
        )
        .get();

    const grouped =
      new Map<
        string,
        Aggregate
      >();

    for (
      const favoriteDocument
      of favoritesSnapshot.docs
    ) {
      const data =
        favoriteDocument.data() as
          Record<string, unknown>;

      const identity =
        resolveIdentity(
          favoriteDocument.id,
          data
        );

      if (
        !identity.targetCollection ||
        !identity.targetId
      ) {
        continue;
      }

      const type =
        resolveType(
          data.type,
          identity.targetCollection
        );

      if (!type) {
        continue;
      }

      const key =
        type +
        '|' +
        identity.targetCollection +
        '|' +
        identity.targetId;

      const addedAt =
        toMillis(
          data.addedAt
        );

      const previous =
        grouped.get(
          key
        );

      if (previous) {
        previous.count += 1;

        previous.lastAddedAt =
          Math.max(
            previous.lastAddedAt,
            addedAt
          );

        continue;
      }

      grouped.set(
        key,
        {
          type,
          targetCollection:
            identity.targetCollection,
          targetId:
            identity.targetId,
          count: 1,
          lastAddedAt:
            addedAt,
        }
      );
    }

    const aggregates =
      Array.from(
        grouped.values()
      );

    const items = [];

    /*
     * Résolution du nom uniquement pour
     * les contenus réellement favoris.
     */
    for (
      const aggregate
      of aggregates
    ) {
      let title =
        aggregate.targetId;

      try {
        const targetSnapshot =
          await db
            .collection(
              aggregate.targetCollection
            )
            .doc(
              aggregate.targetId
            )
            .get();

        if (
          targetSnapshot.exists
        ) {
          title =
            extractTitle(
              targetSnapshot.data() as
                Record<string, unknown>,
              aggregate.targetId
            );
        }
      }
      catch {
        /*
         * Le compteur reste valide même
         * si le document cible a disparu.
         */
      }

      items.push({
        type:
          aggregate.type,

        targetCollection:
          aggregate.targetCollection,

        targetId:
          aggregate.targetId,

        title,

        count:
          aggregate.count,

        lastAddedAt:
          aggregate.lastAddedAt
            ? new Date(
                aggregate.lastAddedAt
              ).toISOString()
            : null,

        href:
          publicHref(
            aggregate.type,
            aggregate.targetCollection,
            aggregate.targetId
          ),
      });
    }

    items.sort(
      (
        a,
        b
      ) =>
        b.count -
        a.count
    );

    const totals = {
      total: 0,
      motorcycles: 0,
      professionals: 0,
      articles: 0,
      uniqueContents:
        items.length,
    };

    for (
      const item
      of items
    ) {
      totals.total +=
        item.count;

      if (
        item.type ===
        'motorcycle'
      ) {
        totals.motorcycles +=
          item.count;
      }

      if (
        item.type ===
        'professional'
      ) {
        totals.professionals +=
          item.count;
      }

      if (
        item.type ===
        'article'
      ) {
        totals.articles +=
          item.count;
      }
    }

    return NextResponse.json(
      {
        ok: true,
        totals,
        items,
      },
      {
        headers: {
          'Cache-Control':
            'private, no-store, max-age=0',
        },
      }
    );
  }
  catch (error) {
    console.error(
      '[ADMIN FAVORITES]',
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          'Impossible de charger les statistiques de favoris.',
      },
      {
        status: 500,
      }
    );
  }
}
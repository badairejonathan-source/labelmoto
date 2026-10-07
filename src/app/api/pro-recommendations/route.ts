import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

import {
  getAdminAuth,
  getAdminFirestore,
} from '@/lib/firebase-admin';
import {
  isAllowedProCollection,
  type ProCollection,
} from '@/lib/pro-claim-utils';

export const runtime = 'nodejs';

const RECOMMENDATIONS_COLLECTION =
  'professional_recommendations';

type RecommendationRelation = {
  sourceCollection: ProCollection;
  sourceId: string;
  targetCollection: ProCollection;
  targetId: string;
  createdByUid: string;
  createdAt?: unknown;
};

function stringValue(value: unknown) {
  return typeof value === 'string'
    ? value.trim()
    : '';
}

function listingKey(
  collectionName: ProCollection,
  id: string
) {
  return `${collectionName}/${id}`;
}

function relationId(
  sourceCollection: ProCollection,
  sourceId: string,
  targetCollection: ProCollection,
  targetId: string
) {
  return createHash('sha256')
    .update(
      [
        sourceCollection,
        sourceId,
        targetCollection,
        targetId,
      ].join('\u0000')
    )
    .digest('hex');
}

function getBearerToken(
  request: NextRequest
) {
  const authorization =
    request.headers.get('authorization');

  if (
    !authorization ||
    !authorization.startsWith('Bearer ')
  ) {
    return '';
  }

  return authorization
    .slice('Bearer '.length)
    .trim();
}

async function verifyUser(
  request: NextRequest
) {
  const idToken =
    getBearerToken(request);

  if (!idToken) {
    throw new Error(
      'AUTH_REQUIRED'
    );
  }

  const decoded =
    await getAdminAuth().verifyIdToken(
      idToken
    );

  if (
    decoded.email_verified !== true
  ) {
    throw new Error(
      'EMAIL_NOT_VERIFIED'
    );
  }

  return decoded;
}

function authErrorResponse(
  error: unknown
) {
  const message =
    error instanceof Error
      ? error.message
      : '';

  if (
    message === 'AUTH_REQUIRED'
  ) {
    return NextResponse.json(
      {
        error:
          'Authentification requise.',
      },
      { status: 401 }
    );
  }

  if (
    message === 'EMAIL_NOT_VERIFIED'
  ) {
    return NextResponse.json(
      {
        error:
          'Validez votre adresse e-mail avant de gérer les recommandations.',
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      error:
        'Session invalide ou expirée.',
    },
    { status: 401 }
  );
}

function toIsoDate(
  value: any
): string | null {
  if (!value) return null;

  if (
    typeof value?.toDate ===
    'function'
  ) {
    return value
      .toDate()
      .toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed =
    new Date(value);

  return Number.isNaN(
    parsed.getTime()
  )
    ? null
    : parsed.toISOString();
}

function publicHref(
  collectionName: ProCollection,
  id: string,
  data: Record<string, any>
) {
  const routeId =
    stringValue(data.slug) || id;

  if (
    collectionName === 'creators'
  ) {
    return `/creators/${routeId}`;
  }

  if (
    collectionName ===
    'associations'
  ) {
    return `/associations/${routeId}`;
  }

  if (
    collectionName === 'relais'
  ) {
    return `/relais/${routeId}`;
  }

  return `/concessions/${routeId}`;
}

function publicListing(
  collectionName: ProCollection,
  id: string,
  data: Record<string, any>
) {
  return {
    collection: collectionName,
    id,
    title:
      stringValue(data.title) ||
      stringValue(data.displayName) ||
      id,
    slug:
      stringValue(data.slug) ||
      undefined,
    category:
      stringValue(data.category) ||
      undefined,
    address:
      stringValue(data.address) ||
      undefined,
    imageUrl:
      stringValue(
        data.imageUrl ||
        data.imgUrl
      ) || undefined,
    href:
      publicHref(
        collectionName,
        id,
        data
      ),
  };
}

async function readListing(
  collectionName: ProCollection,
  id: string
) {
  const snapshot =
    await getAdminFirestore()
      .collection(collectionName)
      .doc(id)
      .get();

  if (!snapshot.exists) {
    return null;
  }

  return {
    snapshot,
    data:
      snapshot.data() || {},
  };
}

function parseRelation(
  data: Record<string, any>
): RecommendationRelation | null {
  const sourceCollection =
    stringValue(
      data.sourceCollection
    );
  const sourceId =
    stringValue(data.sourceId);
  const targetCollection =
    stringValue(
      data.targetCollection
    );
  const targetId =
    stringValue(data.targetId);

  if (
    !isAllowedProCollection(
      sourceCollection
    ) ||
    !isAllowedProCollection(
      targetCollection
    ) ||
    !sourceId ||
    !targetId
  ) {
    return null;
  }

  return {
    sourceCollection,
    sourceId,
    targetCollection,
    targetId,
    createdByUid:
      stringValue(
        data.createdByUid
      ),
    createdAt:
      data.createdAt,
  };
}

async function enrichRelation(
  relationIdValue: string,
  relation: RecommendationRelation
) {
  const [
    source,
    target,
  ] = await Promise.all([
    readListing(
      relation.sourceCollection,
      relation.sourceId
    ),
    readListing(
      relation.targetCollection,
      relation.targetId
    ),
  ]);

  if (!source || !target) {
    return null;
  }

  return {
    relationId:
      relationIdValue,
    createdAt:
      toIsoDate(
        relation.createdAt
      ),
    sourceCollection:
      relation.sourceCollection,
    sourceId:
      relation.sourceId,
    targetCollection:
      relation.targetCollection,
    targetId:
      relation.targetId,
    source:
      publicListing(
        relation.sourceCollection,
        relation.sourceId,
        source.data
      ),
    target:
      publicListing(
        relation.targetCollection,
        relation.targetId,
        target.data
      ),
  };
}

function newestFirst(
  a: any,
  b: any
) {
  const aTime =
    a?.createdAt
      ? new Date(
          a.createdAt
        ).getTime()
      : 0;

  const bTime =
    b?.createdAt
      ? new Date(
          b.createdAt
        ).getTime()
      : 0;

  return bTime - aTime;
}

export async function GET(
  request: NextRequest
) {
  const sourceCollection =
    stringValue(
      request.nextUrl.searchParams.get(
        'sourceCollection'
      )
    );

  const sourceId =
    stringValue(
      request.nextUrl.searchParams.get(
        'sourceId'
      )
    );

  if (
    !isAllowedProCollection(
      sourceCollection
    ) ||
    !sourceId
  ) {
    return NextResponse.json(
      {
        error:
          'Fiche professionnelle invalide.',
      },
      { status: 400 }
    );
  }

  const db =
    getAdminFirestore();

  const ownerMode =
    request.nextUrl.searchParams.get(
      'owner'
    ) === '1';

  if (ownerMode) {
    let decoded;

    try {
      decoded =
        await verifyUser(request);
    }
    catch (error) {
      return authErrorResponse(
        error
      );
    }

    const ownedListing =
      await readListing(
        sourceCollection,
        sourceId
      );

    if (!ownedListing) {
      return NextResponse.json(
        {
          error:
            'Fiche introuvable.',
        },
        { status: 404 }
      );
    }

    if (
      ownedListing.data.ownerUid !==
      decoded.uid
    ) {
      return NextResponse.json(
        {
          error:
            'Vous ne gérez pas cette fiche.',
        },
        { status: 403 }
      );
    }

    const [
      outgoingSnapshot,
      incomingSnapshot,
    ] = await Promise.all([
      db
        .collection(
          RECOMMENDATIONS_COLLECTION
        )
        .where(
          'sourceKey',
          '==',
          listingKey(
            sourceCollection,
            sourceId
          )
        )
        .get(),
      db
        .collection(
          RECOMMENDATIONS_COLLECTION
        )
        .where(
          'targetKey',
          '==',
          listingKey(
            sourceCollection,
            sourceId
          )
        )
        .get(),
    ]);

    const outgoing =
      (
        await Promise.all(
          outgoingSnapshot.docs.map(
            async item => {
              const relation =
                parseRelation(
                  item.data()
                );

              return relation
                ? enrichRelation(
                    item.id,
                    relation
                  )
                : null;
            }
          )
        )
      )
        .filter(Boolean)
        .sort(newestFirst);

    const incoming =
      (
        await Promise.all(
          incomingSnapshot.docs.map(
            async item => {
              const relation =
                parseRelation(
                  item.data()
                );

              return relation
                ? enrichRelation(
                    item.id,
                    relation
                  )
                : null;
            }
          )
        )
      )
        .filter(Boolean)
        .sort(newestFirst);

    return NextResponse.json({
      outgoing,
      incoming,
    });
  }

  const snapshot =
    await db
      .collection(
        RECOMMENDATIONS_COLLECTION
      )
      .where(
        'sourceKey',
        '==',
        listingKey(
          sourceCollection,
          sourceId
        )
      )
      .get();

  const enriched =
    (
      await Promise.all(
        snapshot.docs.map(
          async item => {
            const relation =
              parseRelation(
                item.data()
              );

            return relation
              ? enrichRelation(
                  item.id,
                  relation
                )
              : null;
          }
        )
      )
    )
      .filter(Boolean)
      .sort(newestFirst);

  const recommendations =
    enriched.map(
      (item: any) => ({
        relationId:
          item.relationId,
        targetCollection:
          item.targetCollection,
        targetId:
          item.targetId,
        title:
          item.target.title,
        slug:
          item.target.slug,
        category:
          item.target.category,
        address:
          item.target.address,
        imageUrl:
          item.target.imageUrl,
        href:
          item.target.href,
      })
    );

  return NextResponse.json({
    recommendations,
  });
}

export async function POST(
  request: NextRequest
) {
  let decoded;

  try {
    decoded =
      await verifyUser(request);
  }
  catch (error) {
    return authErrorResponse(error);
  }

  let body: any;

  try {
    body =
      await request.json();
  }
  catch {
    return NextResponse.json(
      {
        error:
          'Requête invalide.',
      },
      { status: 400 }
    );
  }

  const sourceCollection =
    stringValue(
      body?.sourceCollection
    );
  const sourceId =
    stringValue(body?.sourceId);
  const targetCollection =
    stringValue(
      body?.targetCollection
    );
  const targetId =
    stringValue(body?.targetId);

  if (
    !isAllowedProCollection(
      sourceCollection
    ) ||
    !isAllowedProCollection(
      targetCollection
    ) ||
    !sourceId ||
    !targetId
  ) {
    return NextResponse.json(
      {
        error:
          'Recommandation invalide.',
      },
      { status: 400 }
    );
  }

  if (
    sourceCollection ===
      targetCollection &&
    sourceId === targetId
  ) {
    return NextResponse.json(
      {
        error:
          'Une fiche ne peut pas se recommander elle-même.',
      },
      { status: 400 }
    );
  }

  const [
    source,
    target,
  ] = await Promise.all([
    readListing(
      sourceCollection,
      sourceId
    ),
    readListing(
      targetCollection,
      targetId
    ),
  ]);

  if (!source || !target) {
    return NextResponse.json(
      {
        error:
          'Une des fiches professionnelles est introuvable.',
      },
      { status: 404 }
    );
  }

  if (
    source.data.ownerUid !==
    decoded.uid
  ) {
    return NextResponse.json(
      {
        error:
          'Vous ne gérez pas la fiche qui émet cette recommandation.',
      },
      { status: 403 }
    );
  }

  const id =
    relationId(
      sourceCollection,
      sourceId,
      targetCollection,
      targetId
    );

  const db =
    getAdminFirestore();

  const relationRef =
    db
      .collection(
        RECOMMENDATIONS_COLLECTION
      )
      .doc(id);

  let created = false;

  await db.runTransaction(
    async transaction => {
      const existing =
        await transaction.get(
          relationRef
        );

      if (existing.exists) {
        return;
      }

      transaction.create(
        relationRef,
        {
          sourceCollection,
          sourceId,
          sourceKey:
            listingKey(
              sourceCollection,
              sourceId
            ),
          targetCollection,
          targetId,
          targetKey:
            listingKey(
              targetCollection,
              targetId
            ),
          createdByUid:
            decoded.uid,
          createdAt:
            new Date(),
        }
      );

      created = true;
    }
  );

  return NextResponse.json({
    success: true,
    created,
    relationId: id,
  });
}

export async function DELETE(
  request: NextRequest
) {
  let decoded;

  try {
    decoded =
      await verifyUser(request);
  }
  catch (error) {
    return authErrorResponse(error);
  }

  let body: any;

  try {
    body =
      await request.json();
  }
  catch {
    return NextResponse.json(
      {
        error:
          'Requête invalide.',
      },
      { status: 400 }
    );
  }

  const id =
    stringValue(
      body?.relationId
    );

  if (!id) {
    return NextResponse.json(
      {
        error:
          'Recommandation invalide.',
      },
      { status: 400 }
    );
  }

  const db =
    getAdminFirestore();

  const relationRef =
    db
      .collection(
        RECOMMENDATIONS_COLLECTION
      )
      .doc(id);

  const relationSnapshot =
    await relationRef.get();

  if (!relationSnapshot.exists) {
    return NextResponse.json({
      success: true,
      alreadyDeleted: true,
    });
  }

  const relation =
    parseRelation(
      relationSnapshot.data() || {}
    );

  if (!relation) {
    return NextResponse.json(
      {
        error:
          'Recommandation corrompue.',
      },
      { status: 409 }
    );
  }

  const [
    source,
    target,
  ] = await Promise.all([
    readListing(
      relation.sourceCollection,
      relation.sourceId
    ),
    readListing(
      relation.targetCollection,
      relation.targetId
    ),
  ]);

  const isSourceOwner =
    source?.data.ownerUid ===
    decoded.uid;

  const isTargetOwner =
    target?.data.ownerUid ===
    decoded.uid;

  if (
    !isSourceOwner &&
    !isTargetOwner
  ) {
    return NextResponse.json(
      {
        error:
          'Vous n’êtes pas autorisé à supprimer cette recommandation.',
      },
      { status: 403 }
    );
  }

  await relationRef.delete();

  return NextResponse.json({
    success: true,
  });
}

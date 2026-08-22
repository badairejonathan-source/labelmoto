import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import {
  getAdminAuth,
  getAdminFirestore,
} from '@/lib/firebase-admin';

const ADMIN_UIDS = [
  "A36FqeWBHjQBLKQMaMSiFVBzGV22",
  "A366V1X8Hqf1pA63nU3N8B7l8fD3",
  "f7xVfH8R8mS5v8H7N3nU3N8B7l8f"
];

const ADMIN_EMAILS = [
  "badjoe950@hotmail.com"
];


function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function POST(request: NextRequest) {
  try {
    /*
     * IMPORTANT :
     * aucune lecture massive Firestore ne doit avoir lieu
     * avant la validation de l'identité et des droits admin.
     */
    const authorization =
      request.headers.get('authorization');

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Authentification requise.',
        },
        {
          status: 401,
        }
      );
    }

    const idToken =
      authorization.slice('Bearer '.length).trim();

    if (!idToken) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Token Firebase manquant.',
        },
        {
          status: 401,
        }
      );
    }

    let decodedToken;

    try {
      decodedToken =
        await getAdminAuth().verifyIdToken(idToken);
    } catch (error) {
      console.warn(
        '[REBUILD CACHE] Token Firebase invalide.'
      );

      return NextResponse.json(
        {
          ok: false,
          error: 'Session invalide ou expirée.',
        },
        {
          status: 401,
        }
      );
    }

    const db = getAdminFirestore();

    const tokenEmail = decodedToken.email || '';

    /*
     * Même logique que le provider :
     * - Master Admin reconnu par UID/email + email vérifié
     * - sinon rôle admin réellement stocké dans users/{uid}
     */
    const isMasterAdmin =
      decodedToken.email_verified === true &&
      (
        ADMIN_UIDS.includes(decodedToken.uid) ||
        (
          tokenEmail &&
          ADMIN_EMAILS.includes(tokenEmail)
        )
      );

    if (!isMasterAdmin) {
      const callerDoc = await db
        .collection('users')
        .doc(decodedToken.uid)
        .get();

      const callerData = callerDoc.data();

      if (
        !callerDoc.exists ||
        callerData?.role !== 'admin'
      ) {
        console.warn(
          '[REBUILD CACHE] Accès refusé :',
          decodedToken.uid
        );

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

    console.log(
      '[REBUILD CACHE] Autorisé :',
      decodedToken.uid
    );

    const cols = [
      { id: 'concessions', section: 'shopping', cat: 'concession' },
      { id: 'associations', section: 'association', cat: 'association' },
      { id: 'relais', section: 'relais', cat: 'relais' },
      { id: 'creators', section: 'creator', cat: 'concession' },
    ] as const;

    const points: any[] = [];
    const seoPros: any[] = [];

    const seenMapIds = new Set<string>();

    for (const col of cols) {
      const snap = await db.collection(col.id).get();

      snap.docs.forEach(d => {
        const data = d.data();
        const brands = Array.isArray(data.brands)
          ? data.brands
          : [];

        const lat = numberOrNull(
          data.latitude ?? data.position?.[0]
        );

        const lng = numberOrNull(
          data.longitude ?? data.position?.[1]
        );

        const updatedSource =
          data.updatedAt ||
          data.publishedAt ||
          data.timestamp;

        seoPros.push({
          id: d.id,
          collection: col.id,
          title: data.title || d.id,
          slug: data.slug || d.id,
          address: data.address || '',
          category: data.category || col.cat,
          phoneNumber: data.phoneNumber || undefined,
          website: data.website || undefined,
          rating: numberOrNull(data.rating),
          reviewCount: numberOrNull(data.reviewCount),
          brands,
          departement: data.departement || '',
          country: data.country || '',
          appSection: data.appSection || col.section,
          latitude: lat,
          longitude: lng,
          isMultibrand:
            data.isMultibrand === true || brands.length >= 2,
          updatedAt:
            updatedSource?.toDate
              ? updatedSource.toDate().toISOString()
              : null,
        });

        // L'index carte ne contient que les fiches géolocalisables.
        if (lat === null || lng === null) return;
        if (seenMapIds.has(d.id)) return;

        seenMapIds.add(d.id);

        const obj: any = {
          id: d.id,
          lat: parseFloat(lat.toFixed(5)),
          lng: parseFloat(lng.toFixed(5)),
          t: data.title || d.id,
          s: data.slug || d.id,
          a: data.appSection || col.section,
          c: (data.category || col.cat || '').slice(0, 40),
        };

        if (data.rating) obj.r = data.rating;

        if (data.imageUrl || data.imgUrl) {
          obj.i = data.imageUrl || data.imgUrl;
        }

        if (data.address) {
          obj.addr = data.address
            .replace(/\r\n/g, ' ')
            .replace(/\n/g, ' ')
            .slice(0, 60);
        }

        if (brands.length) obj.b = brands;
        if (data.departement) obj.d = data.departement;

        points.push(obj);
      });
    }

    const bucket = admin
      .storage()
      .bucket(
        'studio-4801889514-40ebd.firebasestorage.app'
      );

    const pointsFile = bucket.file('public/points.json');
    const seoFile = bucket.file('public/seo-pros.json');

    await Promise.all([
      pointsFile.save(JSON.stringify(points), {
        contentType: 'application/json',
        metadata: {
          cacheControl: 'public, max-age=60',
        },
      }),

      seoFile.save(JSON.stringify(seoPros), {
        contentType: 'application/json',
        metadata: {
          cacheControl:
            'public, max-age=3600, stale-while-revalidate=86400',
        },
      }),
    ]);

    await Promise.all([
      pointsFile.makePublic(),
      seoFile.makePublic(),
    ]);

    const pointsUrl =
      'https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public/points.json';

    const seoUrl =
      'https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public/seo-pros.json';

    await db.collection('cache').doc('map_points').set({
      updatedAt:
        admin.firestore.FieldValue.serverTimestamp(),
      count: points.length,
      seoCount: seoPros.length,
      url: pointsUrl,
      seoUrl,
    });

    return NextResponse.json({
      ok: true,
      count: points.length,
      seoCount: seoPros.length,
      url: pointsUrl,
      seoUrl,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message,
      },
      {
        status: 500,
      }
    );
  }
}

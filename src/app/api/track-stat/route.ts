import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

const VALID_COLLECTIONS = new Set([
  'concessions',
  'associations',
  'relais',
  'creators',
]);

const VALID_FIELDS = new Set([
  'stats_tel',
  'stats_web',
  'stats_vues',
  'stats_instagram',
  'stats_facebook',
  'stats_itineraire',
]);

function initAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  return admin.firestore();
}

function getParisDateKey(): string {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year =
    parts.find(part => part.type === 'year')?.value;

  const month =
    parts.find(part => part.type === 'month')?.value;

  const day =
    parts.find(part => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return new Date().toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const collectionName =
      typeof body.collection === 'string'
        ? body.collection
        : '';

    const id =
      typeof body.id === 'string'
        ? body.id
        : '';

    const field =
      typeof body.field === 'string'
        ? body.field
        : '';
    const title =
      typeof body.title === 'string'
        ? body.title.trim().slice(0, 180)
        : '';

    const departement =
      typeof body.departement === 'string' ||
      typeof body.departement === 'number'
        ? String(body.departement).trim().slice(0, 8)
        : '';

    if (
      !collectionName ||
      !id ||
      !field ||
      !VALID_COLLECTIONS.has(collectionName) ||
      !VALID_FIELDS.has(field)
    ) {
      return NextResponse.json(
        { ok: false },
        { status: 400 }
      );
    }

    const db = initAdmin();

    const professionalRef =
      db.collection(collectionName).doc(id);

    /*
     * Vérifier explicitement la cible avant le batch.
     *
     * Sans cela, batch.update() ferait échouer toutes
     * les statistiques avec une erreur Firestore générique
     * si collection/id ne correspond pas à une fiche réelle.
     */
    const professionalSnapshot =
      await professionalRef.get();

    if (!professionalSnapshot.exists) {
      console.warn(
        '[TRACK-STAT] Professionnel introuvable',
        {
          collection:
            collectionName,

          id,

          field,
        }
      );

      return NextResponse.json(
        {
          ok:
            false,

          error:
            'professional_not_found',
        },
        {
          status:
            404,
        }
      );
    }

    const professionalData =
      professionalSnapshot.data() ||
      {};

    const resolvedTitle =
      (
        title ||
        String(
          professionalData.title ||
          professionalData.displayName ||
          ''
        )
      )
        .trim()
        .slice(
          0,
          180
        );

    const resolvedDepartement =
      (
        departement ||
        String(
          professionalData.departement ||
          ''
        )
      )
        .trim()
        .slice(
          0,
          8
        );

    const dayKey =
      getParisDateKey();

    const dailyRef =
      db.collection('stats_daily').doc(dayKey);
    const monthKey =
      dayKey.slice(0, 7);

    const monthlyProRef =
      db
        .collection('pro_stats_monthly')
        .doc(monthKey)
        .collection('pros')
        .doc(`${collectionName}__${id}`);
    const monthlyReportRef =
      db
        .collection('monthly_reports')
        .doc(monthKey);

    const increment =
      admin.firestore.FieldValue.increment(1);

    const batch =
      db.batch();

    batch.update(
      professionalRef,
      {
        [field]: increment,
      }
    );

    batch.set(
      dailyRef,
      {
        date: dayKey,
        [field]: increment,
        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    batch.set(
      monthlyProRef,
      {
        collection: collectionName,
        proId: id,
        ...(resolvedTitle
          ? {
              title:
                resolvedTitle,
            }
          : {}),
        ...(resolvedDepartement
          ? {
              departement:
                resolvedDepartement,
            }
          : {}),
        [field]: increment,
        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      }
    );
    batch.set(
      monthlyReportRef,
      {
        month: monthKey,
        [field]: increment,
        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      }
    );
    await batch.commit();

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      '[TRACK-STAT]',
      error
    );

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

function initializeFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } catch (error) {
      console.error("❌ Erreur initialisation Firebase Admin:", error);
      return null;
    }
  }
  return admin.firestore();
}

const postalCodeRegex = /\b(\d{5})\b/;

function getDepartmentCode(address: string): string | null {
  const match = address.match(postalCodeRegex);
  if (match && match[1]) {
    const postalCode = match[1];
    if (postalCode.startsWith('200') || postalCode.startsWith('201')) return '2A';
    else if (parseInt(postalCode) >= 20200 && parseInt(postalCode) <= 20620) return '2B';
    else if (postalCode.startsWith('971')) return '971';
    else if (postalCode.startsWith('972')) return '972';
    else if (postalCode.startsWith('973')) return '973';
    else if (postalCode.startsWith('974')) return '974';
    else if (postalCode.startsWith('976')) return '976';
    else if (parseInt(postalCode.substring(0, 2)) >= 1 &&
             parseInt(postalCode.substring(0, 2)) <= 95) {
      return postalCode.substring(0, 2);
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('x-cron-secret');

  if (!cronSecret || authHeader !== cronSecret) {
    console.error("🚫 Accès non autorisé.");
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = initializeFirebaseAdmin();
  if (!db) {
    return new NextResponse(JSON.stringify({ error: 'Firestore initialization failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const collectionsToProcess = ['concessions', 'associations', 'relais'];
  const departementsAggregation: {
    [key: string]: {
      total: number;
      concessions: number;
      associations: number;
      relais: number;
    }
  } = {};

  try {

    for (const collectionName of collectionsToProcess) {
      const snapshot = await db.collection(collectionName).get();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const address = data.address;
        const departmentCode = address ? getDepartmentCode(address) : null;

        if (departmentCode) {
          if (!departementsAggregation[departmentCode]) {
            departementsAggregation[departmentCode] = {
              total: 0,
              concessions: 0,
              associations: 0,
              relais: 0
            };
          }
          departementsAggregation[departmentCode].total++;
          if (collectionName === 'concessions') {
            departementsAggregation[departmentCode].concessions++;
          } else if (collectionName === 'associations') {
            departementsAggregation[departmentCode].associations++;
          } else if (collectionName === 'relais') {
            departementsAggregation[departmentCode].relais++;
          }
        }
      });
    }

    const cacheDocRef = db.collection('cache').doc('departements_count');
    await cacheDocRef.set({
      counts: departementsAggregation,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return NextResponse.json(
      { message: 'Departements count updated successfully.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Erreur:", error);
    return NextResponse.json(
      { error: 'Failed to update', details: error.message },
      { status: 500 }
    );
  }
}
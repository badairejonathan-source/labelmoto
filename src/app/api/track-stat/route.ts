import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

function initAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
  return admin.firestore();
}

export async function POST(req: NextRequest) {
  try {
    const { collection, id, field } = await req.json();
    if (!collection || !id || !field) return NextResponse.json({ ok: false }, { status: 400 });
    const validFields = ['stats_tel', 'stats_web', 'stats_vues', 'stats_instagram', 'stats_facebook', 'stats_itineraire'];
    if (!validFields.includes(field)) return NextResponse.json({ ok: false }, { status: 400 });
    const db = initAdmin();
    await db.collection(collection).doc(id).update({ [field]: admin.firestore.FieldValue.increment(1) });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

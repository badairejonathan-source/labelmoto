import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function initAdmin() {
  if (getApps().length > 0) return;
  initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')) });
}

export async function POST(req: NextRequest) {
  try {
    const { collection, id, field } = await req.json();
    if (!collection || !id || !field) return NextResponse.json({ ok: false }, { status: 400 });
    const validFields = ['stats_tel', 'stats_web', 'stats_vues'];
    if (!validFields.includes(field)) return NextResponse.json({ ok: false }, { status: 400 });
    initAdmin();
    const db = getFirestore();
    await db.collection(collection).doc(id).update({ [field]: FieldValue.increment(1) });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

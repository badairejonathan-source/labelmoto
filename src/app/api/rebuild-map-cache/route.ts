import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

function initAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
  return admin.firestore();
}

export async function POST() {
  try {
    const db = initAdmin();
    const cols = [
      { id: 'concessions', section: 'shopping', cat: 'concession' },
      { id: 'associations', section: 'association', cat: 'association' },
      { id: 'relais', section: 'relais', cat: 'relais' },
      { id: 'creators', section: 'creator', cat: 'concession' },
    ];
    const points: any[] = [];
    const seenIds = new Set<string>();

    for (const col of cols) {
      const snap = await db.collection(col.id).get();
      snap.docs.forEach(d => {
        if (seenIds.has(d.id)) return;
        const data = d.data();
        const lat = data.latitude || data.position?.[0];
        const lng = data.longitude || data.position?.[1];
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;
        seenIds.add(d.id);
        const obj: any = {
          id: d.id,
          lat: parseFloat(parseFloat(lat).toFixed(6)),
          lng: parseFloat(parseFloat(lng).toFixed(6)),
          t: data.title || d.id,
          s: data.slug || d.id,
          a: data.appSection || col.section,
          c: data.category || col.cat,
        };
        if (data.rating) obj.r = data.rating;
        if (data.imageUrl || data.imgUrl) obj.i = data.imageUrl || data.imgUrl;
        if (data.address) obj.addr = data.address;
        if (data.brands?.length) obj.b = data.brands;
        if (data.departement) obj.d = data.departement;
        points.push(obj);
      });
    }

    // Écrire dans Firestore cache
    await db.collection('cache').doc('map_points').set({
      points: JSON.stringify(points),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      count: points.length,
    });

    return NextResponse.json({ ok: true, count: points.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

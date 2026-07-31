import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

function initAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
}

export async function POST() {
  try {
    initAdmin();
    const db = admin.firestore();
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
          lat: parseFloat(parseFloat(lat).toFixed(5)),
          lng: parseFloat(parseFloat(lng).toFixed(5)),
          t: data.title || d.id,
          s: data.slug || d.id,
          a: data.appSection || col.section,
          c: (data.category || col.cat || "").slice(0,40),
        };
        if (data.rating) obj.r = data.rating;
        if (data.imageUrl || data.imgUrl) obj.i = data.imageUrl || data.imgUrl;
        if (data.address) obj.addr = data.address.replace(/\r\n/g," ").replace(/\n/g," ").slice(0,60);
        if (data.brands?.length) obj.b = data.brands;
        if (data.departement) obj.d = data.departement;
        points.push(obj);
      });
    }
    // Écrire dans Firebase Storage
    const bucket = admin.storage().bucket('studio-4801889514-40ebd.firebasestorage.app');
    const file = bucket.file('public/points.json');
    await file.save(JSON.stringify(points), {
      contentType: 'application/json',
      metadata: { cacheControl: 'public, max-age=60' },
    });
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public/points.json`;
    // Mettre à jour les métadonnées dans Firestore
    await db.collection('cache').doc('map_points').set({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      count: points.length,
      url: publicUrl,
    });
    return NextResponse.json({ ok: true, count: points.length, url: publicUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

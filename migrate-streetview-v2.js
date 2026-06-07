const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const https = require('https');

const GOOGLE_API_KEY = 'AIzaSyChntOKF8lDFcGrMbONQG3Ja0Q6i9rIulE';
const COLLECTIONS = ['concessions', 'associations', 'relais'];
const BATCH_SIZE = 10;
const DELAY_MS = 200;

const serviceAccount = require('./studio-4801889514-40ebd-fbb711e97a97.json');
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve({}); } });
    }).on('error', reject);
  });
}

function calcHeading(fromLat, fromLng, toLat, toLng) {
  const dLng = (toLng - fromLng) * Math.PI / 180;
  const lat1 = fromLat * Math.PI / 180;
  const lat2 = toLat * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

async function getPanorama(lat, lng) {
  const url = 'https://maps.googleapis.com/maps/api/streetview/metadata?location=' + lat + ',' + lng + '&radius=100&source=outdoor&key=' + GOOGLE_API_KEY;
  try {
    const d = await httpGet(url);
    if (d.status === 'OK' && d.pano_id) {
      return { panoId: d.pano_id, panoLat: d.location.lat, panoLng: d.location.lng };
    }
    return null;
  } catch(e) { return null; }
}

function buildUrl(panoId, heading) {
  return 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=' + panoId + '&cb_client=maps_sv.tactile&w=600&h=400&yaw=' + Math.round(heading) + '&pitch=0&thumbfov=90';
}

async function main() {
  console.log('Migration Street View V2 - avec orientation facade');
  let updated = 0, skipped = 0, nopano = 0;
  for (const col of COLLECTIONS) {
    console.log('Collection: ' + col);
    const snap = await db.collection(col).get();
    console.log(snap.docs.length + ' fiches');
    for (let i = 0; i < snap.docs.length; i += BATCH_SIZE) {
      const batch = snap.docs.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async doc => {
        const d = doc.data();
        if (!d.latitude || !d.longitude) { skipped++; return; }
        const pano = await getPanorama(d.latitude, d.longitude);
        if (!pano) { nopano++; return; }
        const heading = calcHeading(pano.panoLat, pano.panoLng, d.latitude, d.longitude);
        const newUrl = buildUrl(pano.panoId, heading);
        await db.collection(col).doc(doc.id).update({ imgUrl: newUrl });
        updated++;
        console.log('OK: ' + (d.title || doc.id) + ' (heading: ' + Math.round(heading) + ')');
      }));
      await sleep(DELAY_MS);
      process.stdout.write('\r' + Math.min(i+BATCH_SIZE, snap.docs.length) + '/' + snap.docs.length);
    }
    console.log('');
  }
  console.log('Mises a jour: ' + updated);
  console.log('Sans panorama: ' + nopano);
  console.log('Ignorees: ' + skipped);
}

main().catch(console.error);

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const https = require('https');

const GOOGLE_API_KEY = 'AIzaSyChntOKF8lDFcGrMbONQG3Ja0Q6i9rIulE';
const COLLECTIONS = ['concessions', 'associations', 'relais'];
const BATCH_SIZE = 10;
const DELAY_MS = 200;

const serviceAccount = require('./studio-4801889514-40ebd-188fb1d78d49.json');
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

async function getPanoId(lat, lng) {
  const url = 'https://maps.googleapis.com/maps/api/streetview/metadata?location=' + lat + ',' + lng + '&radius=50&key=' + GOOGLE_API_KEY;
  try { const d = await httpGet(url); return d.status === 'OK' ? d.pano_id : null; }
  catch(e) { return null; }
}

function buildUrl(panoId) {
  return 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=' + panoId + '&cb_client=maps_sv.tactile&w=600&h=400&yaw=0&pitch=0&thumbfov=100';
}

async function main() {
  console.log('Migration Street View Label Moto');
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
        const img = d.imgUrl || d.imageUrl || '';
        if (img.includes('streetviewpixels')) { skipped++; return; }
        const panoId = await getPanoId(d.latitude, d.longitude);
        if (!panoId) { nopano++; return; }
        await db.collection(col).doc(doc.id).update({ imgUrl: buildUrl(panoId) });
        updated++;
        console.log('OK: ' + (d.title || doc.id));
      }));
      await sleep(DELAY_MS);
    }
    console.log('');
  }
  console.log('Mises a jour: ' + updated);
  console.log('Sans panorama: ' + nopano);
  console.log('Ignorees: ' + skipped);
}

main().catch(console.error);

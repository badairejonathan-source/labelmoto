/**
 * @fileOverview Script CLI de géocodage rétroactif des fiches sans coordonnées.
 * Récupère lat/lng via l'URL Google Maps (si présente) sinon via Nominatim (adresse).
 * Utilise le Firebase Admin SDK. Idempotent : ne touche qu'aux fiches sans coordonnées valides.
 *
 * Usage :
 *   npm run geocode:dry    (dry run, n'écrit rien)
 *   npm run geocode:apply  (applique les mises à jour)
 */
import * as admin from 'firebase-admin';
import 'dotenv/config';
import { encodeGeohash } from '../lib/geohash';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-4801889514-40ebd";

if (!admin.apps.length) {
  admin.initializeApp({ projectId });
}
const db = admin.firestore();

const COLLECTIONS = ['concessions', 'associations', 'relais', 'creators'];
const NOMINATIM_DELAY_MS = 1100; // respect politique Nominatim : 1 req/s max
const USER_AGENT = 'LabelMoto-Geocoder/1.0 (contact@labelmoto.fr)';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Vérifie si une fiche a déjà des coordonnées valides
function hasValidCoords(data: any): boolean {
  const lat = typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude);
  const lng = typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0);
}

// Extrait lat/lng d'une URL Google Maps longue (formats @lat,lng ou !3dlat!4dlng ou q=lat,lng)
function extractCoordsFromUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  // Format @48.8566,2.3522
  let m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  // Format !3d48.8566!4d2.3522
  m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  // Format ?q=48.8566,2.3522 ou &query=48.8566,2.3522
  m = url.match(/[?&](?:q|query|ll|sll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  return null;
}

// Résout un lien court Google (share.google, g.page, maps.app.goo.gl) en suivant la redirection
async function resolveShortUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': USER_AGENT } });
    return res.url || null;
  } catch (e: any) {
    console.warn(`   ⚠️ Résolution URL échouée: ${e.message}`);
    return null;
  }
}

// Tente d'obtenir les coords depuis une URL Google (directe ou via résolution lien court)
async function coordsFromGoogleUrl(url: string): Promise<{ lat: number; lng: number } | null> {
  if (!url || !url.trim()) return null;
  // 1. Extraction directe
  const direct = extractCoordsFromUrl(url);
  if (direct) return direct;
  // 2. Si lien court, on résout puis on ré-extrait
  const isShort = /share\.google|g\.page|maps\.app\.goo\.gl|goo\.gl\/maps/.test(url);
  if (isShort) {
    const resolved = await resolveShortUrl(url);
    if (resolved) return extractCoordsFromUrl(resolved);
  }
  return null;
}

// Géocode une adresse texte via Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address || !address.trim()) return null;
  const q = encodeURIComponent(address.trim());
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=fr&q=${q}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    const json: any = await res.json();
    if (Array.isArray(json) && json.length > 0) {
      const lat = parseFloat(json[0].lat);
      const lng = parseFloat(json[0].lon);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
  } catch (e: any) {
    console.warn(`   ⚠️ Nominatim échoué: ${e.message}`);
  }
  return null;
}

async function run() {
  const isApply = process.argv.includes('--apply');
  const startedAt = new Date();
  console.log(`\n🚀 [GEOCODE] Démarrage (${isApply ? 'MODE APPLY' : 'DRY RUN'})\n`);

  const report = { analyzed: 0, alreadyOk: 0, fixedViaUrl: 0, fixedViaAddress: 0, failed: 0, errors: 0, details: [] as any[] };

  try {
    for (const colName of COLLECTIONS) {
      const snap = await db.collection(colName).get();
      console.log(`📂 Collection ${colName} : ${snap.size} fiches`);

      for (const doc of snap.docs) {
        const data = doc.data();
        report.analyzed++;

        if (hasValidCoords(data)) { report.alreadyOk++; continue; }

        const title = data.title || doc.id;
        let coords: { lat: number; lng: number } | null = null;
        let method = '';

        // 1. Essai via placeUrl (coords directes !3d!4d) puis googleMapsUrl
        const googleUrl = data.placeUrl || data.googleMapsUrl;
        if (googleUrl) {
          coords = await coordsFromGoogleUrl(googleUrl);
          if (coords) method = data.placeUrl ? 'place_url' : 'google_url';
        }

        // 2. Sinon, géocodage de l'adresse
        if (!coords && data.address) {
          await sleep(NOMINATIM_DELAY_MS);
          coords = await geocodeAddress(data.address);
          if (coords) method = 'nominatim';
        }

        if (!coords) {
          console.log(`   ❌ ÉCHEC : ${title} (ni URL ni adresse exploitable)`);
          report.failed++;
          report.details.push({ collection: colName, id: doc.id, title, status: 'failed' });
          continue;
        }

        const geohash = encodeGeohash(coords.lat, coords.lng, 9);

        if (method === 'google_url') report.fixedViaUrl++; else report.fixedViaAddress++;

        if (isApply) {
          try {
            await db.collection(colName).doc(doc.id).update({
              latitude: coords.lat,
              longitude: coords.lng,
              geohash,
              geocodedAt: admin.firestore.FieldValue.serverTimestamp(),
              geocodeSource: method,
            });
            console.log(`   ✅ ${title} → ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} [${method}]`);
            report.details.push({ collection: colName, id: doc.id, title, status: 'fixed', method, ...coords });
          } catch (err: any) {
            console.error(`   ❌ Erreur écriture ${title}: ${err.message}`);
            report.errors++;
          }
        } else {
          console.log(`   [DRY] ${title} → ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} [${method}]`);
          report.details.push({ collection: colName, id: doc.id, title, status: 'to_fix', method, ...coords });
        }
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`🏁 RÉSUMÉ (${isApply ? 'APPLY' : 'DRY RUN'})`);
    console.log("=".repeat(50));
    console.log(`Total analysées       : ${report.analyzed}`);
    console.log(`Déjà géolocalisées    : ${report.alreadyOk}`);
    console.log(`Corrigées via URL     : ${report.fixedViaUrl}`);
    console.log(`Corrigées via adresse : ${report.fixedViaAddress}`);
    console.log(`Échecs (à voir)       : ${report.failed}`);
    console.log(`Erreurs écriture      : ${report.errors}`);
    console.log("=".repeat(50) + "\n");

    if (isApply) {
      await db.collection('migration_runs').add({
        startedAt: admin.firestore.Timestamp.fromDate(startedAt),
        finishedAt: admin.firestore.Timestamp.now(),
        startedBy: 'cli_admin',
        status: report.errors > 0 ? 'completed_with_errors' : 'success',
        analyzedCount: report.analyzed,
        fixedViaUrlCount: report.fixedViaUrl,
        fixedViaAddressCount: report.fixedViaAddress,
        failedCount: report.failed,
        errorCount: report.errors,
        command: 'npm run geocode:apply',
      });
    }
  } catch (err) {
    console.error("\n❌ Erreur critique:", err);
    process.exit(1);
  }
}

run();

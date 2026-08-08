/**
 * patch-garages-moto-radius.js — LabelMoto
 * Usage : node patch-garages-moto-radius.js
 *
 * Patch NON DESTRUCTIF de src/app/garages-moto/[ville]/page.tsx :
 *  - Ajoute de nouvelles fonctions (filtrage par rayon géographique via points.json
 *    + cities-coords.json) SANS toucher aux fonctions existantes.
 *  - Ne change que 2 lignes d'appel pour utiliser les nouvelles fonctions.
 *  - L'ancien code (getProCountForCity, getProsForCity par département) reste
 *    intact, juste inutilisé — filet de sécurité en cas de souci.
 *
 * Fait une sauvegarde .bak avant toute modification.
 */
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(process.cwd(), 'src/app/garages-moto/[ville]/page.tsx');

if (!fs.existsSync(TARGET_FILE)) {
  console.error(`❌  Fichier introuvable : ${TARGET_FILE}`);
  process.exit(1);
}

let content = fs.readFileSync(TARGET_FILE, 'utf8');
const backupPath = TARGET_FILE + '.bak';
fs.writeFileSync(backupPath, content);
console.log(`💾  Sauvegarde créée : ${backupPath}`);

// ── 1. Ajout des imports fs/path après l'import firebase-admin ──────────────
const IMPORT_ANCHOR = `import { getAdminFirestore } from '@/lib/firebase-admin';`;
if (!content.includes(IMPORT_ANCHOR)) {
  console.error('❌  Ancre d\'import introuvable. Fichier peut-être déjà modifié ou différent. Abandon.');
  process.exit(1);
}
const NEW_IMPORTS = `${IMPORT_ANCHOR}
import fsNode from 'fs';
import pathNode from 'path';`;
content = content.replace(IMPORT_ANCHOR, NEW_IMPORTS);

// ── 2. Insertion des nouvelles fonctions juste avant generateMetadata ───────
const METADATA_ANCHOR = `export async function generateMetadata({ params }: PageProps): Promise<Metadata> {`;
if (!content.includes(METADATA_ANCHOR)) {
  console.error('❌  Ancre generateMetadata introuvable. Abandon (aucune modification écrite).');
  process.exit(1);
}

const NEW_FUNCTIONS = `// ── Filtrage géographique par rayon (nouveau, remplace le filtrage par département) ──
interface GeoPoint {
  id: string; lat: number; lng: number; t: string; s: string;
  a: string; c: string; r?: string; d?: string;
}
let _cachedPoints: GeoPoint[] | null = null;
let _cachedCoords: Record<string, { lat: number; lng: number }> | null = null;

function loadPointsData(): GeoPoint[] {
  if (!_cachedPoints) {
    const filePath = pathNode.join(process.cwd(), 'public', 'points.json');
    _cachedPoints = JSON.parse(fsNode.readFileSync(filePath, 'utf8'));
  }
  return _cachedPoints!;
}
function loadCityCoordsData(): Record<string, { lat: number; lng: number }> {
  if (!_cachedCoords) {
    const filePath = pathNode.join(process.cwd(), 'src/app/lib/cities-coords.json');
    _cachedCoords = JSON.parse(fsNode.readFileSync(filePath, 'utf8'));
  }
  return _cachedCoords!;
}
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const RADIUS_KM_DEFAULT = 25;
const RADIUS_KM_FALLBACK = 50;
const MIN_RESULTS_BEFORE_FALLBACK = 5;

function getPointsNearCity(city: { slug: string; departement: string }): GeoPoint[] {
  const coordsMap = loadCityCoordsData();
  const cityCoord = coordsMap[city.slug];
  const points = loadPointsData();
  if (!cityCoord) {
    // Filet de sécurité : comportement historique par département si coordonnée manquante
    return points.filter(p => p.d === city.departement);
  }
  let radius = RADIUS_KM_DEFAULT;
  let nearby = points.filter(p => haversineKm(cityCoord.lat, cityCoord.lng, p.lat, p.lng) <= radius);
  if (nearby.length < MIN_RESULTS_BEFORE_FALLBACK) {
    radius = RADIUS_KM_FALLBACK;
    nearby = points.filter(p => haversineKm(cityCoord.lat, cityCoord.lng, p.lat, p.lng) <= radius);
  }
  return nearby.sort((a, b) =>
    haversineKm(cityCoord.lat, cityCoord.lng, a.lat, a.lng) -
    haversineKm(cityCoord.lat, cityCoord.lng, b.lat, b.lng)
  );
}

function collectionForPoint(p: GeoPoint): 'concessions' | 'associations' | 'relais' | 'creators' {
  if (p.a === 'association') return 'associations';
  if (p.a === 'relais') return 'relais';
  if (p.a === 'creator') return 'creators';
  return 'concessions';
}

async function getProsForCityNearby(city: NonNullable<ReturnType<typeof getCityBySlug>>): Promise<Pro[]> {
  try {
    const nearby = getPointsNearCity(city);
    if (nearby.length === 0) return [];

    const db = getAdminFirestore();
    const byCollection: Record<string, string[]> = {};
    for (const p of nearby) {
      const col = collectionForPoint(p);
      if (!byCollection[col]) byCollection[col] = [];
      byCollection[col].push(p.id);
    }

    const docRefs = Object.entries(byCollection).flatMap(([col, ids]) =>
      ids.map(id => db.collection(col).doc(id))
    );
    if (docRefs.length === 0) return [];
    const snaps = await db.getAll(...docRefs);

    const all: Pro[] = [];
    snaps.forEach(doc => {
      if (!doc.exists) return;
      const d = doc.data()!;
      all.push({
        id: doc.id,
        title: d.title || '',
        address: d.address || '',
        category: d.category || '',
        phoneNumber: d.phoneNumber || undefined,
        website: d.website || undefined,
        rating: parseRating(d.rating),
        reviewCount: parseReviewCount(d.reviewCount),
        slug: d.slug || doc.id,
        docId: doc.id,
        collection: doc.ref.parent.id,
      });
    });

    const orderIndex = new Map(nearby.map((p, i) => [p.id, i]));
    return all.sort((a, b) => (orderIndex.get(a.docId) ?? 999) - (orderIndex.get(b.docId) ?? 999));
  } catch (err) {
    console.error(\`[garages-moto] ville=\${city.slug}:\`, err);
    return [];
  }
}

`;

content = content.replace(METADATA_ANCHOR, NEW_FUNCTIONS + METADATA_ANCHOR);

// ── 3. Basculer generateMetadata sur le nouveau comptage par rayon ──────────
const OLD_COUNT_LINE = `const count = await getProCountForCity(city.departement);`;
const NEW_COUNT_LINE = `const count = getPointsNearCity(city).length;`;
if (!content.includes(OLD_COUNT_LINE)) {
  console.error('❌  Ligne de comptage introuvable. Abandon (aucune modification écrite).');
  process.exit(1);
}
content = content.replace(OLD_COUNT_LINE, NEW_COUNT_LINE);

// ── 4. Basculer le composant principal sur la nouvelle liste par rayon ──────
const OLD_PROS_LINE = `const pros = await getProsForCity(city.departement);`;
const NEW_PROS_LINE = `const pros = await getProsForCityNearby(city);`;
if (!content.includes(OLD_PROS_LINE)) {
  console.error('❌  Ligne d\'appel getProsForCity introuvable. Abandon (aucune modification écrite).');
  process.exit(1);
}
content = content.replace(OLD_PROS_LINE, NEW_PROS_LINE);

// ── Écriture finale ───────────────────────────────────────────────────────
fs.writeFileSync(TARGET_FILE, content);
console.log('✅  Patch appliqué avec succès.');
console.log('👉  Vérifie avec :');
console.log('    grep -n "getProsForCityNearby\\|getPointsNearCity\\|RADIUS_KM_DEFAULT" "src/app/garages-moto/[ville]/page.tsx"');
console.log('👉  Puis lance TypeScript check ou npm run build pour valider avant de push.');
console.log(`👉  En cas de problème, restaure avec : cp "${backupPath}" "${TARGET_FILE}"`);

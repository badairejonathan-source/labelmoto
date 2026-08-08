/**
 * validate-cities-coords.js — LabelMoto
 * Usage : node validate-cities-coords.js
 *
 * Vérifie chaque coordonnée de src/app/lib/cities-coords.json en la comparant
 * au centre géographique des concessions connues (public/points.json) pour le
 * même département. Si l'écart dépasse 150km, la ville est signalée comme suspecte.
 *
 * Ne modifie AUCUN fichier — lecture seule, affiche juste un rapport.
 */
const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.resolve(process.cwd(), 'src/app/lib/cities.ts');
const COORDS_FILE = path.resolve(process.cwd(), 'src/app/lib/cities-coords.json');
const POINTS_FILE = path.resolve(process.cwd(), 'public/points.json');

for (const f of [CITIES_FILE, COORDS_FILE, POINTS_FILE]) {
  if (!fs.existsSync(f)) {
    console.error(`❌  Fichier introuvable : ${f}`);
    process.exit(1);
  }
}

// Extraction slug/name/departement depuis cities.ts (même regex que geocode-cities.js)
const raw = fs.readFileSync(CITIES_FILE, 'utf8');
const cityRegex = /slug:\s*'([^']+)',\s*name:\s*'([^']+)',\s*departement:\s*'([^']+)'/g;
const cities = [];
let match;
while ((match = cityRegex.exec(raw)) !== null) {
  cities.push({ slug: match[1], name: match[2], departement: match[3] });
}

const coords = JSON.parse(fs.readFileSync(COORDS_FILE, 'utf8'));
const points = JSON.parse(fs.readFileSync(POINTS_FILE, 'utf8'));

// Centre géographique (moyenne simple) des points connus par département
const deptCentroids = {};
for (const p of points) {
  if (!p.d || typeof p.lat !== 'number' || typeof p.lng !== 'number') continue;
  if (!deptCentroids[p.d]) deptCentroids[p.d] = { sumLat: 0, sumLng: 0, count: 0 };
  deptCentroids[p.d].sumLat += p.lat;
  deptCentroids[p.d].sumLng += p.lng;
  deptCentroids[p.d].count += 1;
}
for (const d in deptCentroids) {
  deptCentroids[d].lat = deptCentroids[d].sumLat / deptCentroids[d].count;
  deptCentroids[d].lng = deptCentroids[d].sumLng / deptCentroids[d].count;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const THRESHOLD_KM = 150;
const suspects = [];
const noCentroid = [];
const missingCoords = [];

for (const city of cities) {
  const c = coords[city.slug];
  if (!c) {
    missingCoords.push(city.name);
    continue;
  }
  const centroid = deptCentroids[city.departement];
  if (!centroid) {
    noCentroid.push(`${city.name} (dept ${city.departement} — aucune concession connue dans ce département)`);
    continue;
  }
  const dist = haversineKm(c.lat, c.lng, centroid.lat, centroid.lng);
  if (dist > THRESHOLD_KM) {
    suspects.push({ name: city.name, slug: city.slug, departement: city.departement, dist: Math.round(dist), coords: c });
  }
}

console.log(`📊  ${cities.length} villes analysées\n`);

console.log(`❌  Coordonnées manquantes (${missingCoords.length}) :`);
missingCoords.forEach(n => console.log(`    - ${n}`));

console.log(`\n⚠️   Départements sans concession de référence (${noCentroid.length}) — normal pour dept hors France :`);
noCentroid.forEach(n => console.log(`    - ${n}`));

console.log(`\n🚨  SUSPECTES — écart > ${THRESHOLD_KM}km avec le centre du département (${suspects.length}) :`);
suspects
  .sort((a, b) => b.dist - a.dist)
  .forEach(s => console.log(`    - ${s.name} (${s.slug}, dept ${s.departement}) : ${s.dist}km d'écart → lat=${s.coords.lat}, lng=${s.coords.lng}`));

console.log('\n──────────────────────────────');
console.log(`Résumé : ${suspects.length} suspectes / ${missingCoords.length} manquantes / ${noCentroid.length} sans référence sur ${cities.length} villes.`);
console.log('Corrige ces cas à la main (coordonnées connues) avant l\'étape suivante.');

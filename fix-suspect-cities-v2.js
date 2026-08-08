/**
 * fix-suspect-cities-v2.js — LabelMoto
 * Usage : node fix-suspect-cities-v2.js
 *
 * Version corrigée : la regex accepte maintenant region: '...' OU region: "...".
 * Ne re-fait QUE le re-géocodage des 7 homonymes français (les coordonnées
 * manuelles hors France ont déjà été appliquées par le script précédent).
 */
const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.resolve(process.cwd(), 'src/app/lib/cities.ts');
const COORDS_FILE = path.resolve(process.cwd(), 'src/app/lib/cities-coords.json');

if (!fs.existsSync(CITIES_FILE) || !fs.existsSync(COORDS_FILE)) {
  console.error('❌  Fichiers introuvables (cities.ts ou cities-coords.json).');
  process.exit(1);
}

const raw = fs.readFileSync(CITIES_FILE, 'utf8');
// Regex tolérante : region entre guillemets simples OU doubles
const cityRegex = /slug:\s*'([^']+)',\s*name:\s*'([^']+)',\s*departement:\s*'([^']+)',\s*region:\s*["']([^"']+)["']/g;
const citiesBySlug = {};
let match;
while ((match = cityRegex.exec(raw)) !== null) {
  citiesBySlug[match[1]] = { name: match[2], departement: match[3], region: match[4] };
}

console.log(`📍  ${Object.keys(citiesBySlug).length} villes extraites (vérification du parsing)`);

const coords = JSON.parse(fs.readFileSync(COORDS_FILE, 'utf8'));

const SLUGS_TO_REGEOCODE = [
  'castres', 'lons', 'saint-pierre-du-mont', 'chatillon',
  'la-garde', 'le-pontet', 'montreuil',
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LabelMoto/1.0 (contact via labelmoto.fr)' },
    });
    const data = await res.json();
    if (data && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch (err) {
    console.error(`  ⚠️  Erreur réseau :`, err.message);
    return null;
  }
}

async function run() {
  console.log('\n── Re-géocodage avec précision région (homonymes français) ──');
  for (const slug of SLUGS_TO_REGEOCODE) {
    const city = citiesBySlug[slug];
    if (!city) {
      console.log(`⚠️   ${slug} : toujours introuvable dans cities.ts, ignoré.`);
      continue;
    }
    const query = `${city.name}, ${city.region}, France`;
    const result = await geocode(query);
    if (result) {
      coords[slug] = result;
      console.log(`✅  ${city.name} (${city.region}) → ${result.lat}, ${result.lng}`);
    } else {
      console.log(`❌  ${city.name} : échec du re-géocodage, coordonnée existante conservée.`);
    }
    await sleep(1100);
  }

  fs.writeFileSync(COORDS_FILE, JSON.stringify(coords, null, 2));
  console.log('\n──────────────────────────────');
  console.log(`📄  Fichier mis à jour : ${COORDS_FILE}`);
  console.log('👉  Relance node validate-cities-coords.js pour confirmer que tout est propre.');
}

run();

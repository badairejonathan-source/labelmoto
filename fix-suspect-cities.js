/**
 * fix-suspect-cities.js — LabelMoto
 * Usage : node fix-suspect-cities.js
 *
 * Corrige UNIQUEMENT les entrées de cities-coords.json identifiées comme
 * suspectes par validate-cities-coords.js :
 *  - Homonymes français mal géocodés → re-géocodage avec "{name}, {region}, France"
 *  - Villes hors France → coordonnées connues, saisies à la main
 *
 * Ne touche à aucune autre entrée du fichier.
 */
const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.resolve(process.cwd(), 'src/app/lib/cities.ts');
const COORDS_FILE = path.resolve(process.cwd(), 'src/app/lib/cities-coords.json');

if (!fs.existsSync(CITIES_FILE) || !fs.existsSync(COORDS_FILE)) {
  console.error('❌  Fichiers introuvables (cities.ts ou cities-coords.json).');
  process.exit(1);
}

// Extraction slug/name/departement/region depuis cities.ts
const raw = fs.readFileSync(CITIES_FILE, 'utf8');
const cityRegex = /slug:\s*'([^']+)',\s*name:\s*'([^']+)',\s*departement:\s*'([^']+)',\s*region:\s*'([^']+)'/g;
const citiesBySlug = {};
let match;
while ((match = cityRegex.exec(raw)) !== null) {
  citiesBySlug[match[1]] = { name: match[2], departement: match[3], region: match[4] };
}

const coords = JSON.parse(fs.readFileSync(COORDS_FILE, 'utf8'));

// Slugs à re-géocoder avec précision région (homonymes français mal résolus)
const SLUGS_TO_REGEOCODE = [
  'castres', 'lons', 'saint-pierre-du-mont', 'chatillon',
  'la-garde', 'le-pontet', 'montreuil',
];

// Coordonnées connues pour les villes hors France (saisies manuellement)
const MANUAL_COORDS = {
  '1205-geneve': { lat: 46.2043907, lng: 6.1431577 },       // Genève, Suisse
  'bilbao': { lat: 43.2630126, lng: -2.9349852 },            // Bilbao, Espagne
  'santander': { lat: 43.4622612, lng: -3.8099385 },         // Santander, Espagne
  'donostia-san-sebastian': { lat: 43.3183627, lng: -1.9812441 }, // Saint-Sébastien, Espagne
  'vitoria-gasteiz': { lat: 42.8465621, lng: -2.6723374 },   // Vitoria-Gasteiz, Espagne
};

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
  console.log('── Coordonnées manuelles (villes hors France) ──');
  for (const [slug, c] of Object.entries(MANUAL_COORDS)) {
    coords[slug] = c;
    console.log(`✅  ${slug} → ${c.lat}, ${c.lng} (manuel)`);
  }

  console.log('\n── Re-géocodage avec précision région (homonymes français) ──');
  for (const slug of SLUGS_TO_REGEOCODE) {
    const city = citiesBySlug[slug];
    if (!city) {
      console.log(`⚠️   ${slug} : introuvable dans cities.ts, ignoré.`);
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

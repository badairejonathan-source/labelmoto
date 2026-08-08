/**
 * geocode-cities.js — LabelMoto
 * Usage : node geocode-cities.js
 *
 * Lit src/app/lib/cities.ts (en texte, pas d'import TS), extrait slug/name/departement
 * pour chaque ville, géocode via Nominatim (OpenStreetMap), et écrit le résultat dans
 * src/app/lib/cities-coords.json sous la forme { [slug]: { lat, lng } }.
 *
 * Ne modifie AUCUN fichier existant — génère un nouveau fichier séparé.
 * Respecte la politique d'usage Nominatim (1 requête/seconde max).
 */
const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.resolve(process.cwd(), 'src/app/lib/cities.ts');
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/app/lib/cities-coords.json');

if (!fs.existsSync(CITIES_FILE)) {
  console.error(`❌  Fichier introuvable : ${CITIES_FILE}`);
  process.exit(1);
}

const raw = fs.readFileSync(CITIES_FILE, 'utf8');

// Extraction par regex : slug: 'xxx', name: 'xxx', departement: 'xxx'
const cityRegex = /slug:\s*'([^']+)',\s*name:\s*'([^']+)',\s*departement:\s*'([^']+)'/g;
const cities = [];
let match;
while ((match = cityRegex.exec(raw)) !== null) {
  cities.push({ slug: match[1], name: match[2], departement: match[3] });
}

console.log(`📍  ${cities.length} villes extraites de cities.ts`);
if (cities.length === 0) {
  console.error('❌  Aucune ville trouvée — vérifie le format du fichier source.');
  process.exit(1);
}

// Charger un éventuel fichier existant pour reprendre en cas d'interruption
let results = {};
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    results = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    console.log(`♻️   Reprise : ${Object.keys(results).length} villes déjà géocodées`);
  } catch {
    results = {};
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function geocodeCity(city) {
  const query = encodeURIComponent(`${city.name}, France`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=fr`;
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
    console.error(`  ⚠️  Erreur réseau pour ${city.name}:`, err.message);
    return null;
  }
}

async function run() {
  const failed = [];
  let count = 0;

  for (const city of cities) {
    count++;
    if (results[city.slug]) {
      continue; // déjà géocodé lors d'une exécution précédente
    }

    const coords = await geocodeCity(city);
    if (coords) {
      results[city.slug] = coords;
      console.log(`✅  [${count}/${cities.length}] ${city.name} → ${coords.lat}, ${coords.lng}`);
    } else {
      failed.push(city.name);
      console.log(`❌  [${count}/${cities.length}] ${city.name} → échec`);
    }

    // Sauvegarde incrémentale tous les 10 (au cas où le script serait interrompu)
    if (count % 10 === 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    }

    await sleep(1100); // politique Nominatim : 1 req/sec max
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

  console.log('\n──────────────────────────────');
  console.log(`✅  Terminé : ${Object.keys(results).length}/${cities.length} villes géocodées`);
  if (failed.length > 0) {
    console.log(`⚠️   Échecs (${failed.length}) :`, failed.join(', '));
    console.log('    → Ces villes garderont le comportement actuel (comptage département) en fallback.');
  }
  console.log(`📄  Résultat écrit dans : ${OUTPUT_FILE}`);
}

run();

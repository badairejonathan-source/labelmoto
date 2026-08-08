/**
 * fix-la-garde.js — LabelMoto
 * Usage : node fix-la-garde.js
 *
 * Correctif ponctuel : re-géocode uniquement "La Garde" (Var, 83) avec le nom
 * de région complet, car le script précédent avait tronqué "Provence-Alpes-
 * Côte d'Azur" à cause de l'apostrophe dans la regex.
 */
const fs = require('fs');
const path = require('path');

const COORDS_FILE = path.resolve(process.cwd(), 'src/app/lib/cities-coords.json');
const coords = JSON.parse(fs.readFileSync(COORDS_FILE, 'utf8'));

async function run() {
  const query = "La Garde, Var, Provence-Alpes-Côte d'Azur, France";
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LabelMoto/1.0 (contact via labelmoto.fr)' },
  });
  const data = await res.json();
  if (data && data[0]) {
    const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    coords['la-garde'] = result;
    fs.writeFileSync(COORDS_FILE, JSON.stringify(coords, null, 2));
    console.log(`✅  La Garde (Var) → ${result.lat}, ${result.lng}`);
    console.log(`📄  Fichier mis à jour : ${COORDS_FILE}`);
  } else {
    console.log('❌  Échec du géocodage, aucune modification.');
  }
}

run();

const fs = require('fs');
const path = 'src/app/api/track-stat/route.ts';
let content = fs.readFileSync(path, 'utf8');

const oldLine = "const validFields = ['stats_tel', 'stats_web', 'stats_vues'];";
const newLine = "const validFields = ['stats_tel', 'stats_web', 'stats_vues', 'stats_instagram', 'stats_facebook', 'stats_itineraire'];";

if (!content.includes(oldLine)) {
  console.log('ERREUR: ligne originale introuvable, aucune modification faite.');
  process.exit(1);
}

content = content.replace(oldLine, newLine);
fs.writeFileSync(path, content, 'utf8');
console.log('OK: validFields mis à jour.');

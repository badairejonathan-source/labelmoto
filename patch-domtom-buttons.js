/**
 * patch-domtom-buttons.js — LabelMoto
 * Usage : node patch-domtom-buttons.js
 *
 * Patch NON DESTRUCTIF de src/app/map/page.tsx :
 * Les boutons DOM-TOM (La Réunion / Martinique / Guadeloupe) mettaient à jour
 * mapCenter et mapZoom, mais pas selectionSource — or l'effet qui déplace
 * réellement la carte Leaflet (dans map-component.tsx) exige que
 * selectionSource soit non-null pour s'exécuter. Résultat : le clic ne faisait
 * rien visuellement. On ajoute setSelectionSource('external'), le même motif
 * déjà utilisé ailleurs dans ce fichier pour un centrage programmatique.
 *
 * Fait une sauvegarde .bak avant toute modification.
 */
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(process.cwd(), 'src/app/map/page.tsx');

if (!fs.existsSync(TARGET_FILE)) {
  console.error(`❌  Fichier introuvable : ${TARGET_FILE}`);
  process.exit(1);
}

let content = fs.readFileSync(TARGET_FILE, 'utf8');
const backupPath = TARGET_FILE + '.bak';
fs.writeFileSync(backupPath, content);
console.log(`💾  Sauvegarde créée : ${backupPath}`);

const OLD_HANDLER = `onClick={() => { setMapCenter(t.center); setMapZoom(t.zoom); }}`;
if (!content.includes(OLD_HANDLER)) {
  console.error('❌  Ancre introuvable (fichier peut-être différent). Abandon, aucune écriture.');
  process.exit(1);
}
const NEW_HANDLER = `onClick={() => { setMapCenter(t.center); setMapZoom(t.zoom); setSelectionSource('external'); }}`;
content = content.replace(OLD_HANDLER, NEW_HANDLER);

fs.writeFileSync(TARGET_FILE, content);
console.log('✅  Patch appliqué avec succès.');
console.log('👉  Vérifie avec :');
console.log('    grep -n "setSelectionSource(\'external\')" src/app/map/page.tsx');
console.log('👉  Puis npm run build avant de push.');
console.log(`👉  En cas de problème, restaure avec : cp "${backupPath}" "${TARGET_FILE}"`);

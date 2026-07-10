const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'src/app/map.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Supprimer le filtre CSS OSM (plus nécessaire avec CartoDB Positron)
const oldFilter = `.leaflet-container .leaflet-tile-pane {
  filter: saturate(0.7) brightness(1.06) contrast(0.95);
}`;
const newFilter = `.leaflet-container .leaflet-tile-pane {
  /* CartoDB Positron — aucun filtre nécessaire */
}`;

if (!css.includes(oldFilter)) {
  console.error('❌ Filtre CSS tuiles introuvable');
  process.exit(1);
}
css = css.replace(oldFilter, newFilter);

// 2. Labels département plus discrets
const oldLabel = `.dept-label span {
  font-size: 12px;
  font-weight: 900;
  color: #fff;
  background-color: rgba(30, 30, 30, 0.72);
  padding: 3px 7px;
  border-radius: 5px;
  display: inline-block;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  letter-spacing: 0.02em;`;

const newLabel = `.dept-label span {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  background-color: rgba(30, 30, 30, 0.50);
  padding: 2px 5px;
  border-radius: 4px;
  display: inline-block;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  letter-spacing: 0.02em;`;

if (!css.includes(oldLabel)) {
  console.error('❌ Style dept-label introuvable');
  process.exit(1);
}
css = css.replace(oldLabel, newLabel);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ map.css — filtre OSM supprimé + labels département réduits');

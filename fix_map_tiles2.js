const fs = require('fs');
const path = require('path');

// ─── 1. Attribution dans map-component.tsx ────────────────────────────────────
const compPath = path.join(process.cwd(), 'src/components/app/map-component.tsx');
let comp = fs.readFileSync(compPath, 'utf8');

const oldAttr = `      attribution: '&copy; OpenStreetMap France',`;
const newAttr = `      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',`;

if (!comp.includes(oldAttr)) {
  console.error('❌ Attribution introuvable dans map-component.tsx');
  process.exit(1);
}
comp = comp.replace(oldAttr, newAttr);
fs.writeFileSync(compPath, comp, 'utf8');
console.log('✅ Attribution CartoDB mise à jour');

// ─── 2. Preconnects dans map/layout.tsx ───────────────────────────────────────
const layoutPath = path.join(process.cwd(), 'src/app/map/layout.tsx');
let layout = fs.readFileSync(layoutPath, 'utf8');

// Afficher le contenu actuel pour diagnostic
const lines = layout.split('\n');
const preconnectLines = lines.filter((l, i) => l.includes('preconnect') || l.includes('dns-prefetch'));
console.log('Preconnects actuels dans layout.tsx :');
preconnectLines.forEach(l => console.log(' ', l.trim()));

// Remplacer les preconnects OSM par CartoDB
const oldOSM1 = `<link rel="preconnect" href="https://a.tile.openstreetmap.fr" />`;
const oldOSM2 = `<link rel="preconnect" href="https://b.tile.openstreetmap.fr" />`;
const oldOSM3 = `<link rel="preconnect" href="https://c.tile.openstreetmap.fr" />`;
const oldOSM4 = `<link rel="dns-prefetch" href="https://tile.openstreetmap.fr" />`;

layout = layout
  .replace(oldOSM1, `<link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />`)
  .replace(oldOSM2, `<link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="anonymous" />`)
  .replace(oldOSM3, `<link rel="preconnect" href="https://c.basemaps.cartocdn.com" crossOrigin="anonymous" />`)
  .replace(oldOSM4, `<link rel="preconnect" href="https://d.basemaps.cartocdn.com" crossOrigin="anonymous" />`);

fs.writeFileSync(layoutPath, layout, 'utf8');
console.log('✅ Preconnects CartoDB mis à jour dans map/layout.tsx');

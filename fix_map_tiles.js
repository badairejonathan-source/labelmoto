const fs = require('fs');
const path = require('path');

// ─── map-component.tsx ────────────────────────────────────────────────────────
const compPath = path.join(process.cwd(), 'src/components/app/map-component.tsx');
let comp = fs.readFileSync(compPath, 'utf8');

// 1. Nouvelle palette bleu-ardoise sobre (Option A - CartoDB Positron)
const oldColors = `const getColor = (count: number): string => {
  return count > 500 ? '#800026' :
         count > 200 ? '#BD0026' :
         count > 100 ? '#E31A1C' :
         count > 50  ? '#FC4E2A' :
         count > 20  ? '#FD8D3C' :
         count > 10  ? '#FEB24C' :
         count > 5   ? '#FED976' :
         '#FFEDA0';
};`;

const newColors = `const getColor = (count: number): string => {
  return count > 200 ? '#1e3a5f' :
         count > 100 ? '#2d5f8f' :
         count > 50  ? '#4a82b5' :
         count > 20  ? '#7aaed4' :
         count > 10  ? '#aacde8' :
         count > 5   ? '#d0e7f5' :
                       '#eef6fb';
};`;

if (!comp.includes(oldColors)) {
  console.error('❌ Palette de couleurs introuvable');
  process.exit(1);
}
comp = comp.replace(oldColors, newColors);

// 2. Tuiles CartoDB Positron
const oldTile = `L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {`;
const newTile = `L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {`;
if (!comp.includes(oldTile)) {
  console.error('❌ URL tuile OSM introuvable');
  process.exit(1);
}
comp = comp.replace(oldTile, newTile);

// 3. Attribution CARTO + subdomains
const oldAttr = `attribution: '© OpenStreetMap contributors'`;
if (comp.includes(oldAttr)) {
  comp = comp.replace(oldAttr, `attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: 'abcd'`);
} else {
  // Chercher une autre forme d'attribution
  const altAttr = `attribution: "&copy; OpenStreetMap contributors"`;
  if (comp.includes(altAttr)) {
    comp = comp.replace(altAttr, `attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: 'abcd'`);
  } else {
    console.warn('⚠️  Attribution non trouvée — à vérifier manuellement');
  }
}

// 4. Réduire fillOpacity (0.65 → 0.38)
comp = comp.replace('fillOpacity: 0.65', 'fillOpacity: 0.38');
comp = comp.replace('fillOpacity: 0.85', 'fillOpacity: 0.6');

fs.writeFileSync(compPath, comp, 'utf8');
console.log('✅ map-component.tsx — tuiles CartoDB + palette bleue + opacité réduite');

// ─── map/layout.tsx — Mettre à jour les preconnects ───────────────────────────
const layoutPath = path.join(process.cwd(), 'src/app/map/layout.tsx');
let layout = fs.readFileSync(layoutPath, 'utf8');

const oldPreconnects = `      <link rel="preconnect" href="https://a.tile.openstreetmap.fr" />
      <link rel="preconnect" href="https://b.tile.openstreetmap.fr" />
      <link rel="preconnect" href="https://c.tile.openstreetmap.fr" />
      <link rel="dns-prefetch" href="https://tile.openstreetmap.fr" />`;

const newPreconnects = `      <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://c.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://d.basemaps.cartocdn.com" crossOrigin="anonymous" />`;

if (layout.includes(oldPreconnects)) {
  layout = layout.replace(oldPreconnects, newPreconnects);
  fs.writeFileSync(layoutPath, layout, 'utf8');
  console.log('✅ map/layout.tsx — preconnects mis à jour vers CartoDB');
} else {
  console.warn('⚠️  Preconnects OSM non trouvés dans layout.tsx — à vérifier manuellement');
}

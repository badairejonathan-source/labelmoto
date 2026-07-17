const fs = require('fs');
const path = require('path');

// ─── 1. Root layout — remplacer les preconnects inutiles ──────────────────────
const rootPath = path.join(process.cwd(), 'src/app/layout.tsx');
let root = fs.readFileSync(rootPath, 'utf8');

// Supprimer les preconnects Google Fonts (inutiles avec next/font)
// et Unsplash (non critique), remplacer par Firebase app
const oldPreconnects = `        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />`;

const newPreconnects = `        <link rel="preconnect" href="https://studio-4801889514-40ebd.firebaseapp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />`;

if (!root.includes(oldPreconnects)) {
  console.error('❌ Preconnects root layout introuvables');
  process.exit(1);
}
root = root.replace(oldPreconnects, newPreconnects);
fs.writeFileSync(rootPath, root, 'utf8');
console.log('✅ Root layout — preconnects réduits à 2 (Firebase app + Firestore)');

// ─── 2. Map layout — réduire à 2 preconnects CartoDB ──────────────────────────
const mapLayoutPath = path.join(process.cwd(), 'src/app/map/layout.tsx');
let mapLayout = fs.readFileSync(mapLayoutPath, 'utf8');

const oldCartoDB = `      <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://c.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://d.basemaps.cartocdn.com" crossOrigin="anonymous" />`;

const newCartoDB = `      <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://d.basemaps.cartocdn.com" crossOrigin="anonymous" />`;

if (!mapLayout.includes(oldCartoDB)) {
  console.error('❌ Preconnects CartoDB introuvables dans map/layout.tsx');
  process.exit(1);
}
mapLayout = mapLayout.replace(oldCartoDB, newCartoDB);
fs.writeFileSync(mapLayoutPath, mapLayout, 'utf8');
console.log('✅ Map layout — CartoDB réduit à 2 preconnects (a + d)');

console.log('\nTotal preconnects sur /map : 4 (Firebase + Firestore + CartoDB a + CartoDB d) ✅');

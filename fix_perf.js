
const fs = require('fs');
const path = require('path');

// ─── 1. Remplacer article-scooter-125.png → .webp dans les 3 fichiers ─────────
const files = [
  'src/components/app/article-client.tsx',
  'src/components/app/homepage-deferred.tsx',
  'src/app/info/page.tsx',
];

files.forEach(f => {
  const filePath = path.join(process.cwd(), f);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('article-scooter-125.png')) {
    content = content.replaceAll('article-scooter-125.png', 'article-scooter-125.webp');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ PNG → WebP : ' + f);
  }
});

// ─── 2. Ajouter préconnexions Firebase Storage dans layout.tsx ────────────────
const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
let layout = fs.readFileSync(layoutPath, 'utf8');

const oldPreconnect = `        <link rel="preconnect" href="https://studio-4801889514-40ebd.firebaseapp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />`;

const newPreconnect = `        <link rel="preconnect" href="https://studio-4801889514-40ebd.firebaseapp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://studio-4801889514-40ebd.firebasestorage.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />`;

if (!layout.includes('firebasestorage.app') && layout.includes(oldPreconnect)) {
  layout = layout.replace(oldPreconnect, newPreconnect);
  fs.writeFileSync(layoutPath, layout, 'utf8');
  console.log('✅ Préconnexions Firebase Storage ajoutées dans layout.tsx');
}

console.log('\n✅ Optimisations performance terminées');

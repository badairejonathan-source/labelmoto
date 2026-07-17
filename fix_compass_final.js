const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// L'ombre du tiroir remonte 50px -> zone visuelle commence à 190px du bas
// bottom-56 = 224px = 34px au-dessus de l'ombre -> clairement visible
let found = false;

const candidates = [
  `isMobile ? "bottom-40" : "bottom-10"`,
  `isMobile ? "bottom-44" : "bottom-10"`,
  `isMobile ? "bottom-52" : "bottom-10"`,
];

for (const old of candidates) {
  if (page.includes(old)) {
    page = page.replace(old, `isMobile ? "bottom-56" : "bottom-10"`);
    found = true;
    console.log(`✅ Bouton boussole remonté à bottom-56 (depuis ${old.split('"')[1]})`);
    break;
  }
}

if (!found) {
  // Chercher la ligne exacte dans le fichier pour diagnostic
  const lines = page.split('\n');
  const compassLines = lines.filter(l => l.includes('Compass') || (l.includes('bottom-') && l.includes('isMobile')));
  console.error('❌ Position boussole introuvable. Lignes proches :');
  compassLines.forEach(l => console.log(' ', l.trim()));
  process.exit(1);
}

fs.writeFileSync(pagePath, page, 'utf8');
console.log('Calcul : tiroir 140px + ombre 50px = zone visuelle à 190px. bottom-56 = 224px = 34px de marge ✅');

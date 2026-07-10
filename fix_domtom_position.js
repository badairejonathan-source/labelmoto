const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Repositionne le bouton DOM-TOM : top-24 sur desktop (correct),
// top-56 (224px) sur mobile pour passer sous le bouton loupe (~207px)
const oldCode = `<div className="absolute top-24 right-6 z-[1400]">`;
const newCode = `<div className={cn("absolute right-6 z-[1400]", isMobile ? "top-56" : "top-24")}>`;

if (!content.includes(oldCode)) {
  console.error('❌ Bloc cible introuvable — vérifier que le fichier n\'a pas changé');
  process.exit(1);
}

content = content.replace(oldCode, newCode);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Bouton DOM-TOM repositionné : top-56 sur mobile, top-24 sur desktop');

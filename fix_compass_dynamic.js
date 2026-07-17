const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// 1. Remplacer le className avec bottom fixe par un style dynamique
const oldBtn = `        className={cn("absolute right-6 z-[500] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all", isMobile ? "bottom-56" : "bottom-10")}
        onClick={() => setIsLocating(true)}`;

const newBtn = `        className={cn("absolute right-6 z-[500] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center")}
        style={{
          bottom: isMobile
            ? drawerHeight === 'full'
              ? 'calc(85vh + 20px)'
              : drawerHeight === 'half'
              ? 'calc(50vh + 20px)'
              : '210px'
            : '40px',
          transition: 'bottom 0.5s ease-out',
        }}
        onClick={() => setIsLocating(true)}`;

if (!page.includes(oldBtn)) {
  console.error('❌ Bouton boussole introuvable — vérifier le bottom actuel dans page.tsx');
  // Diagnostic
  const lines = page.split('\n');
  const idx = lines.findIndex(l => l.includes('setIsLocating(true)') && lines[lines.indexOf(l)-1]?.includes('Compass'));
  if (idx > -1) {
    console.log('Lignes trouvées autour du bouton :');
    lines.slice(Math.max(0, idx-3), idx+3).forEach((l, i) => console.log(idx-3+i, ':', l));
  }
  process.exit(1);
}

page = page.replace(oldBtn, newBtn);
fs.writeFileSync(pagePath, page, 'utf8');
console.log('✅ Bouton boussole dynamique : suit le tiroir avec transition 0.5s');
console.log('  collapsed → 210px');
console.log('  half      → calc(50vh + 20px)');
console.log('  full      → calc(85vh + 20px)');

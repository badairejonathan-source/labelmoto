const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// Remplacer le bouton boussole : absolute → fixed + type="button" + aria-label
const oldBtn = `      <button
        className={cn("absolute right-6 z-[1300] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center")}
        style={{
          bottom: width === undefined
            ? '210px'  // valeur sûre pendant l'hydration
            : isMobile
            ? drawerHeight === 'full'
              ? 'calc(85vh + 20px)'
              : drawerHeight === 'half'
              ? 'calc(50vh + 20px)'
              : '210px'
            : '40px',
          transition: 'bottom 0.5s ease-out',
        }}
        onClick={() => setIsLocating(true)}
      >
        <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
      </button>`;

const newBtn = `      <button
        type="button"
        aria-label="Me localiser sur la carte"
        className={cn("fixed right-6 z-[1300] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center")}
        style={{
          bottom: width === undefined
            ? '210px'
            : isMobile
            ? drawerHeight === 'full'
              ? 'calc(85vh + 20px)'
              : drawerHeight === 'half'
              ? 'calc(50vh + 20px)'
              : '210px'
            : '40px',
          transition: 'bottom 0.5s ease-out',
        }}
        onClick={() => setIsLocating(true)}
      >
        <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
      </button>`;

if (!page.includes(oldBtn)) {
  console.error('❌ Bouton boussole introuvable');
  process.exit(1);
}

page = page.replace(oldBtn, newBtn);
fs.writeFileSync(pagePath, page, 'utf8');
console.log('✅ Bouton boussole : absolute → fixed + type="button" + aria-label');
console.log('   Le bouton est maintenant dans le root stacking context');
console.log('   Plus aucun risque de z-index ou overflow-hidden qui bloque les clics');

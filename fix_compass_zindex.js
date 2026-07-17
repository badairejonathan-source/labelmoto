const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// Fix 1 : z-[500] → z-[1300] pour être au-dessus du drawer (z-[1100])
const oldClass = `className={cn("absolute right-6 z-[500] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center")}`;
const newClass = `className={cn("absolute right-6 z-[1300] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center")}`;

if (!page.includes(oldClass)) {
  console.error('❌ className bouton boussole introuvable');
  process.exit(1);
}
page = page.replace(oldClass, newClass);
console.log('✅ z-index corrigé : z-[500] → z-[1300]');

// Fix 2 : position par défaut quand isMobile non encore déterminé
// isMobile = false quand width === undefined (SSR/hydration)
// On utilise width !== undefined pour distinguer "pas encore chargé" de "desktop"
const oldBottom = `          bottom: isMobile
            ? drawerHeight === 'full'
              ? 'calc(85vh + 20px)'
              : drawerHeight === 'half'
              ? 'calc(50vh + 20px)'
              : '210px'
            : '40px',`;

const newBottom = `          bottom: width === undefined
            ? '210px'  // valeur sûre pendant l'hydration
            : isMobile
            ? drawerHeight === 'full'
              ? 'calc(85vh + 20px)'
              : drawerHeight === 'half'
              ? 'calc(50vh + 20px)'
              : '210px'
            : '40px',`;

if (!page.includes(oldBottom)) {
  console.error('❌ Style bottom introuvable');
  process.exit(1);
}
page = page.replace(oldBottom, newBottom);
console.log('✅ Position par défaut corrigée pendant hydration');

fs.writeFileSync(pagePath, page, 'utf8');
console.log('\n✅ Bouton boussole corrigé — clics fonctionnels');

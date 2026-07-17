const fs = require('fs');
const path = require('path');

// ─── 1. map/page.tsx — remplacer grid par scroll horizontal ──────────────────
const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

const oldGrid = `          <div className="grid grid-cols-4 items-start justify-between gap-1 relative z-10">
            {filters.map(f => <div key={f.id} className="col-span-1 flex justify-center">{renderFilter(f)}</div>)}
          </div>`;

const newGrid = `          <div className="flex overflow-x-auto gap-4 px-2 pb-1 relative z-10 filter-scroll">
            {filters.map(f => <div key={f.id} className="flex-shrink-0">{renderFilter(f)}</div>)}
          </div>`;

if (!page.includes(oldGrid)) {
  console.error('❌ Grille filtres introuvable dans page.tsx');
  process.exit(1);
}
page = page.replace(oldGrid, newGrid);
fs.writeFileSync(pagePath, page, 'utf8');
console.log('✅ Filtres mobiles en scroll horizontal');

// ─── 2. map.css — masquer la scrollbar tout en gardant le scroll ──────────────
const cssPath = path.join(process.cwd(), 'src/app/map.css');
let css = fs.readFileSync(cssPath, 'utf8');

const scrollbarCSS = `
/* Scroll horizontal filtres — scrollbar masquée */
.filter-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.filter-scroll::-webkit-scrollbar {
  display: none;
}
`;

if (!css.includes('.filter-scroll')) {
  css += scrollbarCSS;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✅ CSS scrollbar masquée ajoutée dans map.css');
} else {
  console.log('ℹ️  CSS filter-scroll déjà présente');
}

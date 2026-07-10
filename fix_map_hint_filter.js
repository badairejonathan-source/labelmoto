const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// ─── 1. Lire le paramètre ?filter= depuis l'URL (venant de la homepage) ───────
const oldActiveFilters = `  const [activeFilters, setActiveFilters] = useState<string[]>([]);`;
const newActiveFilters = `  const filterParam = searchParams.get('filter');
  const [activeFilters, setActiveFilters] = useState<string[]>(filterParam ? [filterParam] : []);`;

if (!page.includes(oldActiveFilters)) {
  console.error('❌ useState activeFilters introuvable');
  process.exit(1);
}
page = page.replace(oldActiveFilters, newActiveFilters);
console.log('✅ Lecture du paramètre ?filter= ajoutée');

// ─── 2. Supprimer le hint flottant au centre de la carte ──────────────────────
const oldHint = `      {activeFilters.length === 0 && !isLoadingPoints && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[1200] pointer-events-none"
          style={{ bottom: isMobile ? '190px' : '70px' }}
        >
          <div className="bg-white/95 backdrop-blur-sm border-2 border-brand/30 rounded-2xl px-4 py-3 shadow-xl flex flex-col items-center gap-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-brand">Sélectionnez un filtre</p>
            <p className="text-[10px] text-muted-foreground font-medium">pour afficher les professionnels</p>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="mt-0.5">
              <path d="M7 8L0 0h14L7 8z" fill="#ea580c" fillOpacity="0.6"/>
            </svg>
          </div>
        </div>
      )}`;

if (!page.includes(oldHint)) {
  console.error('❌ Hint flottant introuvable');
  process.exit(1);
}
page = page.replace(oldHint, '');
console.log('✅ Hint flottant supprimé du centre de la carte');

// ─── 3. Ajouter le hint discret DANS le tiroir mobile ─────────────────────────
// Juste avant la grille des filtres dans le mobile drawer
const oldGrid = `          <div className="grid grid-cols-4 items-start justify-between gap-1 relative z-10">`;
const newGrid = `          {activeFilters.length === 0 && (
            <p className="text-[10px] font-black uppercase tracking-widest text-brand/70 text-center w-full mb-2 animate-pulse">
              ↓ Choisissez un type de professionnel
            </p>
          )}
          <div className="grid grid-cols-4 items-start justify-between gap-1 relative z-10">`;

if (!page.includes(oldGrid)) {
  console.error('❌ Grille filtres mobile introuvable');
  process.exit(1);
}
page = page.replace(oldGrid, newGrid);
console.log('✅ Hint discret ajouté dans le tiroir mobile');

fs.writeFileSync(pagePath, page, 'utf8');
console.log('\n✅ map/page.tsx mis à jour');

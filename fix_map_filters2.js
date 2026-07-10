const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// 1. Vider les filtres par défaut
const oldFilters = `const [activeFilters, setActiveFilters] = useState<string[]>(['shopping', 'service', 'association', 'relais', 'creator']);`;
const newFilters = `const [activeFilters, setActiveFilters] = useState<string[]>([]);`;

if (page.includes(oldFilters)) {
  page = page.replace(oldFilters, newFilters);
  console.log('✅ Filtres vidés par défaut');
} else {
  console.log('ℹ️  Filtres déjà vides');
}

// 2. Ajouter le hint avant le bouton boussole
const oldBtn = `      <button
        className={cn("absolute right-6 z-[500] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all", isMobile ? "bottom-44" : "bottom-10")}
        onClick={() => setIsLocating(true)}
      >
        <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
      </button>`;

const newBtn = `      {activeFilters.length === 0 && !isLoadingPoints && (
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
      )}
      <button
        className={cn("absolute right-6 z-[500] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all", isMobile ? "bottom-44" : "bottom-10")}
        onClick={() => setIsLocating(true)}
      >
        <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
      </button>`;

if (!page.includes(oldBtn)) {
  console.error('❌ Bouton boussole introuvable — vérifier les espaces dans page.tsx');
  process.exit(1);
}
page = page.replace(oldBtn, newBtn);
console.log('✅ Hint filtre ajouté');

fs.writeFileSync(pagePath, page, 'utf8');
console.log('✅ map/page.tsx mis à jour');

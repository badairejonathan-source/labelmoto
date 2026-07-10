const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// 1. Vider les filtres par défaut
const oldFilters = `const [activeFilters, setActiveFilters] = useState<string[]>(['shopping', 'service', 'association', 'relais', 'creator']);`;
const newFilters = `const [activeFilters, setActiveFilters] = useState<string[]>([]);`;

if (!page.includes(oldFilters)) {
  console.error('❌ useState activeFilters introuvable');
  process.exit(1);
}
page = page.replace(oldFilters, newFilters);

// 2. Ajouter le hint "aucun filtre sélectionné" dans la zone carte
// On cherche la div qui contient le MapComponent pour y ajouter le hint
const oldMapZone = `          isLocating={isLocating}`;
const newMapZone = `          isLocating={isLocating}`;

// Le hint sera ajouté juste avant le bouton boussole
// On cherche le bouton boussole (Compass) pour insérer le hint avant
const oldCompassBtn = `        <button
          ref={locateButtonRef}`;

const newCompassBtn = `        {activeFilters.length === 0 && !isLoadingPoints && (
          <div className="absolute left-1/2 -translate-x-1/2 z-[1200] pointer-events-none"
            style={{ bottom: isMobile ? '200px' : '80px' }}>
            <div className="bg-white/95 backdrop-blur-sm border-2 border-brand/30 rounded-2xl px-4 py-3 shadow-xl flex flex-col items-center gap-1 animate-bounce-subtle">
              <p className="text-[11px] font-black uppercase tracking-widest text-brand">Sélectionnez un filtre</p>
              <p className="text-[10px] text-muted-foreground font-medium">pour afficher les professionnels</p>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="mt-0.5">
                <path d="M8 10L0 0h16L8 10z" fill="#ea580c" fillOpacity="0.7"/>
              </svg>
            </div>
          </div>
        )}
        <button
          ref={locateButtonRef}`;

if (!page.includes(oldCompassBtn)) {
  console.error('❌ Bouton boussole introuvable pour insérer le hint');
  process.exit(1);
}
page = page.replace(oldCompassBtn, newCompassBtn);

fs.writeFileSync(pagePath, page, 'utf8');
console.log('✅ map/page.tsx — filtres vides par défaut + hint ajouté');

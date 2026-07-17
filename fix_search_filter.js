const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// Remplacer handleSuggestionSelect pour activer le filtre automatiquement
const oldHandler = `  const handleSuggestionSelect = (lat, lng, bbox, dealerId) => {
    if (bbox) {
      setBboxToFit(null);
      setTimeout(() => setBboxToFit(bbox), 10);
      setDeptToFit(null);
    } else if (dealerId) {
      handleMarkerClick(dealerId);
    } else {
      setMapCenter([lat, lng]);
      setSelectionSource("external");
    }
  };`;

const newHandler = `  const handleSuggestionSelect = (lat, lng, bbox, dealerId) => {
    if (bbox) {
      setBboxToFit(null);
      setTimeout(() => setBboxToFit(bbox), 10);
      setDeptToFit(null);
    } else if (dealerId) {
      // Activer automatiquement le filtre correspondant au pro sélectionné
      const point = points.find(p => p.id === dealerId);
      if (point) {
        const section = point.appSection === 'both' ? 'shopping' : point.appSection;
        if (section) {
          setActiveFilters(prev =>
            prev.includes(section) ? prev : [...prev, section]
          );
        }
      }
      handleMarkerClick(dealerId);
    } else {
      setMapCenter([lat, lng]);
      setSelectionSource("external");
    }
  };`;

if (!page.includes(oldHandler)) {
  console.error('❌ handleSuggestionSelect introuvable');
  process.exit(1);
}

page = page.replace(oldHandler, newHandler);
fs.writeFileSync(pagePath, page, 'utf8');
console.log('✅ handleSuggestionSelect mis à jour');
console.log('   → Sélection d\'une suggestion : filtre activé automatiquement');
console.log('   → Le marqueur et la fiche apparaissent immédiatement');

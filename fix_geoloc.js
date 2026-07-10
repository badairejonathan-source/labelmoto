const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/components/app/map-component.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldCode = `  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLocating) return;
    map.once('locationfound', (e) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
      onLocateEnd();
    });
    map.locate({ setView: true, maxZoom: 14 });
  }, [isLocating]);`;

const newCode = `  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLocating) return;

    const handleLocationFound = (e: L.LocationEvent) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
      onLocateEnd();
    };

    const handleLocationError = () => {
      console.warn('Géolocalisation refusée ou indisponible');
      onLocateEnd();
    };

    map.once('locationfound', handleLocationFound);
    map.once('locationerror', handleLocationError);
    map.locate({ setView: true, maxZoom: 14 });

    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
    };
  }, [isLocating]);`;

if (!content.includes(oldCode)) {
  console.error('❌ Bloc cible introuvable — vérifier que le fichier n\'a pas changé');
  process.exit(1);
}

content = content.replace(oldCode, newCode);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Géolocalisation corrigée : locationerror handler ajouté + cleanup');

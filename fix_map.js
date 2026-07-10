const fs = require('fs');
let c = fs.readFileSync('src/app/map/page.tsx', 'utf8');

const old = `      if (allPoints.length > 0) {
        setPoints(allPoints);
        setCachedPoints(allPoints);
      }
      if (!silent) setIsLoadingPoints(false);
    };
    fetchAll();`;

const neu = `      if (allPoints.length > 0) {
        setPoints(allPoints);
        setCachedPoints(allPoints);
      }
      if (!silent) {
        setIsLoadingPoints(false);
        setTimeout(() => fetchFromFirestore(true), 100);
      }
    };
    fetchAll();`;

if (!c.includes(old)) {
  console.log('ERREUR: pattern non trouve');
} else {
  c = c.replace(old, neu);
  fs.writeFileSync('src/app/map/page.tsx', c);
  console.log('OK');
}

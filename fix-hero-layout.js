const fs = require('fs');
const path = 'src/components/app/fiche-client.tsx';
let f = fs.readFileSync(path, 'utf8');

// 1. Changer justify-end en justify-between pour répartir haut/bas
f = f.replace(
  'min-h-[420px] flex flex-col justify-end">',
  'min-h-[400px] md:min-h-[520px] flex flex-col justify-between">'
);

// 2. Image : réduire l'opacité à 75% pour mieux voir la moto
f = f.replace(
  'fill className="object-cover opacity-60"',
  'fill className="object-cover opacity-75"'
);

// 3. Le bloc z-10 : enlever mb-10 du flex, garder le titre en haut compact
f = f.replace(
  '<div className="relative z-10 p-8 md:p-12 w-full">',
  '<div className="relative z-10 w-full">'
);

// 4. Flex direction : titre en haut, stats en bas — changer le gap et l'alignement
f = f.replace(
  '<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">',
  '<div className="flex flex-col p-6 md:p-8 gap-2">'
);

fs.writeFileSync(path, f);
console.log('OK étape 1');

const fs = require('fs');
const p = 'src/components/app/header.tsx';
let c = fs.readFileSync(p, 'utf8');
const o = 'return (\n    <div className="w-full flex flex-col gap-6 md:gap-8 pt-4">';
const n = 'return (\n    <div className="w-full flex flex-col gap-6 md:gap-8 pt-4 pb-6 bg-brand">';
if (!c.includes(o)) { console.log('ERREUR: introuvable'); process.exit(1); }
c = c.replace(o, n);
fs.writeFileSync(p, c, 'utf8');
console.log('OK 3/4');

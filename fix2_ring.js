const fs = require('fs');
const p = 'src/components/app/header.tsx';
let c = fs.readFileSync(p, 'utf8');
const o = 'className="absolute top-1/2 right-1 -translate-y-1/2 bg-brand rounded-full h-[70px] w-[70px] shadow-lg hover:scale-105 active:scale-95 transition-all"';
const n = 'className="absolute top-1/2 right-1 -translate-y-1/2 bg-brand rounded-full h-[70px] w-[70px] shadow-lg hover:scale-105 active:scale-95 transition-all ring-4 ring-white"';
if (!c.includes(o)) { console.log('ERREUR: introuvable'); process.exit(1); }
c = c.replace(o, n);
fs.writeFileSync(p, c, 'utf8');
console.log('OK 2/4');

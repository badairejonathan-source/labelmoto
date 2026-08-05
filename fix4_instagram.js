const fs = require('fs');
const p = 'src/components/app/header.tsx';
let c = fs.readFileSync(p, 'utf8');
const o = '<div className="shrink-0 flex items-center"><UserMenuLazy /></div>';
const n = '<div className="shrink-0 flex items-center gap-3">\n          <a\n            href="https://www.instagram.com/labelmoto.fr/"\n            target="_blank"\n            rel="noopener noreferrer"\n            aria-label="Instagram LabelMoto"\n            className="hidden sm:flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/95 shadow-xl border-2 border-white text-brand hover:scale-105 active:scale-95 transition-all"\n          >\n            <Instagram className="h-5 w-5 md:h-6 md:w-6" />\n          </a>\n          <UserMenuLazy />\n        </div>';
if (!c.includes(o)) { console.log('ERREUR: introuvable'); process.exit(1); }
c = c.replace(o, n);
fs.writeFileSync(p, c, 'utf8');
console.log('OK 4/4');

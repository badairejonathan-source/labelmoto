const fs = require('fs');
const p = 'src/components/app/header.tsx';
let c = fs.readFileSync(p, 'utf8');
const o = "import { Search, User as UserIcon, Menu, MapPin, Store, X, Bike, Wrench, Users, Utensils, Building2 } from 'lucide-react';";
const n = "import { Search, User as UserIcon, Menu, MapPin, Store, X, Bike, Wrench, Users, Utensils, Building2, Instagram } from 'lucide-react';";
if (!c.includes(o)) { console.log('ERREUR: introuvable'); process.exit(1); }
c = c.replace(o, n);
fs.writeFileSync(p, c, 'utf8');
console.log('OK 1/4');

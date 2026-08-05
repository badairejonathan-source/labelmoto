const fs = require('fs');
const path = 'src/components/app/header.tsx';
let content = fs.readFileSync(path, 'utf8');
let changesMade = 0;

// 1. Import de l'icône Instagram
const oldImport = "import { Search, User as UserIcon, Menu, MapPin, Store, X, Bike, Wrench, Users, Utensils, Building2 } from 'lucide-react';";
const newImport = "import { Search, User as UserIcon, Menu, MapPin, Store, X, Bike, Wrench, Users, Utensils, Building2, Instagram } from 'lucide-react';";
if (content.includes(oldImport)) {
  content = content.replace(oldImport, newImport);
  changesMade++;
} else {
  console.log('ATTENTION: import lucide-react introuvable tel quel.');
}

// 2. Anneau blanc sur le bouton recherche
const oldSearchBtn = 'className="absolute top-1/2 right-1 -translate-y-1/2 bg-brand rounded-full h-[70px] w-[70px] shadow-lg hover:scale-105 active:scale-95 transition-all"';
const newSearchBtn = 'className="absolute top-1/2 right-1 -translate-y-1/2 bg-brand rounded-full h-[70px] w-[70px] shadow-lg hover:scale-105 active:scale-95 transition-all ring-4 ring-white"';
if (content.includes(oldSearchBtn)) {
  content = content.replace(oldSearchBtn, newSearchBtn);
  changesMade++;
} else {
  console.log('ATTENTION: bouton recherche introuvable tel quel.');
}

// 3. Fond orange sur le conteneur global du header
const oldWrapper = 'return (\n    <div className="w-full flex flex-col gap-6 md:gap-8 pt-4">';
const newWrapper = 'return (\n    <div className="w-full flex flex-col gap-6 md:gap-8 pt-4 pb-6 bg-brand">';
if (content.includes(oldWrapper)) {
  content = content.replace(oldWrapper, newWrapper);
  changesMade++;
} else {
  console.log('ATTENTION: wrapper principal introuvable tel quel.');
}

// 4. Ajout du bouton Instagram à côté du menu utilisateur
const oldUserBlock = '<div className="shrink-0 flex items-center"><UserMenuLazy /></div>';
const newUserBlock = `<div className="shrink-0 flex items-center gap-3">
          
            href="https://www.instagram.com/labelmoto.fr/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram LabelMoto"
            className="hidden sm:flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/95 shadow-xl border-2 border-white text-brand hover:scale-105 active:scale-95 transition-all"
          >
            <Instagram className="h-5 w-5 md:h-6 md:w-6" />
          </a>
          <UserMenuLazy />
        </div>`;
if (content.includes(oldUserBlock)) {
  content = content.replace(oldUserBlock, newUserBlock);
  changesMade++;
} else {
  console.log('ATTENTION: bloc UserMenuLazy introuvable tel quel.');
}

if (changesMade === 4) {
  fs.writeFileSync(path, content, 'utf8');
  console.log('OK: 4/4 modifications appliquées avec succès.');
} else {
  console.log(`ERREUR: seulement ${changesMade}/4 modifications appliquées. Fichier NON sauvegardé — vérifie les messages ATTENTION ci-dessus.`);
}

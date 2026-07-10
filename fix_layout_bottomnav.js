const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/layout.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ajouter l'import du composant après les imports existants
const oldImport = `import Script from "next/script";`;
const newImport = `import Script from "next/script";
import MobileBottomNav from "@/components/app/mobile-bottom-nav";`;

if (!content.includes(oldImport)) {
  console.error('❌ Import Script introuvable');
  process.exit(1);
}
content = content.replace(oldImport, newImport);

// 2. Ajouter pb-16 md:pb-0 au body pour ne pas masquer le contenu sous la barre
const oldBody = `<body className={cn("bg-background font-sans antialiased", inter.className)}>`;
const newBody = `<body className={cn("bg-background font-sans antialiased pb-16 md:pb-0", inter.className)}>`;

if (!content.includes(oldBody)) {
  console.error('❌ Classe body introuvable');
  process.exit(1);
}
content = content.replace(oldBody, newBody);

// 3. Ajouter le composant juste avant </FirebaseClientProvider>
const oldProvider = `          <Toaster />
        </FirebaseClientProvider>`;
const newProvider = `          <Toaster />
          <MobileBottomNav />
        </FirebaseClientProvider>`;

if (!content.includes(oldProvider)) {
  console.error('❌ Bloc FirebaseClientProvider introuvable');
  process.exit(1);
}
content = content.replace(oldProvider, newProvider);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ MobileBottomNav intégré dans layout.tsx');

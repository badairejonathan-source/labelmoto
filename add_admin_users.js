const fs = require('fs');
const path = require('path');

// ─── 1. Règle Firestore pour users (lecture admin) ────────────────────────────
const rulesPath = path.join(process.cwd(), 'firestore.rules');
let rules = fs.readFileSync(rulesPath, 'utf8');

if (!rules.includes('match /users/')) {
  const oldProspection = `    // Prospection B2B — lecture/écriture admin uniquement
    match /prospection/{id} { allow read, write: if isAdmin(); }`;
  const newProspection = `    // Prospection B2B — lecture/écriture admin uniquement
    match /prospection/{id} { allow read, write: if isAdmin(); }
    // Comptes utilisateurs — admin peut tout lire/écrire
    match /users/{id} { allow read, write: if isAdmin(); }`;
  if (rules.includes(oldProspection)) {
    rules = rules.replace(oldProspection, newProspection);
    fs.writeFileSync(rulesPath, rules, 'utf8');
    console.log('✅ Règle users ajoutée dans firestore.rules');
  }
} else {
  console.log('ℹ️  Règle users déjà présente');
}

// ─── 2. Ajouter onglet Comptes dans admin/page.tsx ────────────────────────────
const pagePath = path.join(process.cwd(), 'src/app/admin/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// Import
if (!page.includes('AdminUsers')) {
  page = page.replace(
    `import AdminStats from '@/components/app/admin-stats';`,
    `import AdminStats from '@/components/app/admin-stats';
import AdminUsers from '@/components/app/admin-users';`
  );
  console.log('✅ Import AdminUsers ajouté');
}

// TabsTrigger
if (!page.includes('value="users"')) {
  page = page.replace(
    `<TabsTrigger value="images" className="rounded-full font-black uppercase text-[10px] tracking-widest">🖼️ Images</TabsTrigger>`,
    `<TabsTrigger value="images" className="rounded-full font-black uppercase text-[10px] tracking-widest">🖼️ Images</TabsTrigger>
            <TabsTrigger value="users" className="rounded-full font-black uppercase text-[10px] tracking-widest">👥 Comptes</TabsTrigger>`
  );
  console.log('✅ TabsTrigger Comptes ajouté');
}

// TabsContent
if (!page.includes('<AdminUsers')) {
  page = page.replace(
    `          <TabsContent value="images">
            <AdminImageRequests />
          </TabsContent>`,
    `          <TabsContent value="images">
            <AdminImageRequests />
          </TabsContent>
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>`
  );
  console.log('✅ TabsContent Comptes ajouté');
}

fs.writeFileSync(pagePath, page, 'utf8');
console.log('\n✅ Onglet Comptes intégré dans l\'admin');

const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/admin/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// 1. Ajouter l'import du composant
const oldImport = `import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/client';`;
const newImport = `import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/client';
import AdminProspection from '@/components/app/admin-prospection';`;

if (!page.includes(oldImport)) {
  console.error('❌ Import firebase client introuvable');
  process.exit(1);
}
page = page.replace(oldImport, newImport);
console.log('✅ Import AdminProspection ajouté');

// 2. Ajouter le TabsTrigger après Migration
const oldTrigger = `            <TabsTrigger value="migration" className="rounded-full font-black uppercase text-[10px] tracking-widest gap-2"><Database className="h-3 w-3" /> Migration</TabsTrigger>`;
const newTrigger = `            <TabsTrigger value="migration" className="rounded-full font-black uppercase text-[10px] tracking-widest gap-2"><Database className="h-3 w-3" /> Migration</TabsTrigger>
            <TabsTrigger value="prospection" className="rounded-full font-black uppercase text-[10px] tracking-widest">📊 Prospection</TabsTrigger>`;

if (!page.includes(oldTrigger)) {
  console.error('❌ TabsTrigger Migration introuvable');
  process.exit(1);
}
page = page.replace(oldTrigger, newTrigger);
console.log('✅ TabsTrigger Prospection ajouté');

// 3. Ajouter le TabsContent avant la fermeture de </Tabs>
const oldClose = `        </Tabs>`;
const newClose = `          <TabsContent value="prospection">
            <AdminProspection />
          </TabsContent>
        </Tabs>`;

// Remplacer seulement la dernière occurrence
const lastIdx = page.lastIndexOf(oldClose);
if (lastIdx === -1) {
  console.error('❌ Fermeture </Tabs> introuvable');
  process.exit(1);
}
page = page.slice(0, lastIdx) + newClose + page.slice(lastIdx + oldClose.length);
console.log('✅ TabsContent Prospection ajouté');

fs.writeFileSync(pagePath, page, 'utf8');
console.log('\n✅ Onglet Prospection intégré dans admin/page.tsx');

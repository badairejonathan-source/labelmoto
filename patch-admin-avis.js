/**
 * patch-admin-avis.js — LabelMoto
 * Usage : node patch-admin-avis.js
 *
 * Patch NON DESTRUCTIF de src/app/admin/page.tsx :
 *  - Ajoute l'import addDocumentNonBlocking (manquant)
 *  - Ajoute deux handlers : handleApproveComment / handleRejectComment
 *  - Remplace le placeholder statique de l'onglet AVIS par la vraie liste
 *    (distingue concessions vs fiches moto via targetType, boutons Valider/Rejeter)
 *
 * "Valider" copie l'avis vers la sous-collection publique adéquate
 * (concessions/{id}/comments ou motorcycle_sheets/{id}/comments) puis supprime
 * le document de pending_comments. "Rejeter" supprime simplement.
 *
 * Fait une sauvegarde .bak avant toute modification.
 */
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(process.cwd(), 'src/app/admin/page.tsx');

if (!fs.existsSync(TARGET_FILE)) {
  console.error(`❌  Fichier introuvable : ${TARGET_FILE}`);
  process.exit(1);
}

let content = fs.readFileSync(TARGET_FILE, 'utf8');
const backupPath = TARGET_FILE + '.bak';
fs.writeFileSync(backupPath, content);
console.log(`💾  Sauvegarde créée : ${backupPath}`);

// ── 1. Ajout de l'import addDocumentNonBlocking ──────────────────────────────
const IMPORT_ANCHOR = `import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/client';`;
if (!content.includes(IMPORT_ANCHOR)) {
  console.error('❌  Ancre d\'import introuvable. Fichier peut-être différent. Abandon.');
  process.exit(1);
}
const NEW_IMPORT = `import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/client';`;
content = content.replace(IMPORT_ANCHOR, NEW_IMPORT);

// ── 2. Ajout des handlers juste après la déclaration de pendingComments ─────
const HOOK_ANCHOR = `const { data: pendingComments } = useCollection(commentsQuery);`;
if (!content.includes(HOOK_ANCHOR)) {
  console.error('❌  Ancre pendingComments introuvable. Abandon (aucune modification écrite).');
  process.exit(1);
}

const NEW_HANDLERS = `${HOOK_ANCHOR}

  const handleApproveComment = async (c: any) => {
    if (!firestore) return;
    const targetPath = c.targetType === 'motorcycle_sheet'
      ? ['motorcycle_sheets', c.dealershipId, 'comments']
      : ['concessions', c.dealershipId, 'comments'];
    try {
      addDocumentNonBlocking(collection(firestore, ...targetPath), {
        userId: c.userId,
        userName: c.userName,
        rating: c.rating,
        content: c.content,
        date: c.date,
      });
      deleteDocumentNonBlocking(doc(firestore, 'pending_comments', c.id));
      toast({ title: 'Avis publié', description: \`L'avis de \${c.userName} est maintenant visible.\` });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de publier l'avis." });
    }
  };

  const handleRejectComment = (c: any) => {
    if (!firestore) return;
    deleteDocumentNonBlocking(doc(firestore, 'pending_comments', c.id));
    toast({ title: 'Avis rejeté', description: \`L'avis de \${c.userName} a été supprimé.\` });
  };`;

content = content.replace(HOOK_ANCHOR, NEW_HANDLERS);

// ── 3. Remplacement du placeholder de l'onglet AVIS par la vraie liste ──────
const COMMENTS_TAB_REGEX = /<TabsContent value="comments">[\s\S]*?<\/TabsContent>/;
if (!COMMENTS_TAB_REGEX.test(content)) {
  console.error('❌  Bloc TabsContent "comments" introuvable. Abandon (aucune modification écrite).');
  process.exit(1);
}

const NEW_COMMENTS_TAB = `<TabsContent value="comments">
             <Card className="shadow-lg rounded-3xl bg-white border-none overflow-hidden">
               <CardContent className="p-0">
                 <ScrollArea className="h-[600px]">
                   {(pendingComments || []).length === 0 ? (
                     <div className="text-center py-20">
                        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <p className="font-black uppercase text-muted-foreground tracking-widest text-xs">Aucun avis en attente de modération.</p>
                     </div>
                   ) : (
                     (pendingComments || []).map((c: any) => (
                       <div key={c.id} className="p-6 border-b last:border-0 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <p className="font-black text-base uppercase tracking-tight">{c.userName}</p>
                              <Badge variant="outline" className="text-[8px] font-black uppercase">{c.targetType === 'motorcycle_sheet' ? 'Fiche moto' : 'Concession'}</Badge>
                              <Badge variant="outline" className="text-[8px] font-black uppercase">★ {c.rating}</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold">{c.dealershipName}</p>
                            <p className="text-xs text-foreground/80 mt-2 line-clamp-2">{c.content}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                             <Button variant="outline" size="sm" className="rounded-full text-[10px] font-black uppercase" onClick={() => handleRejectComment(c)}>Rejeter</Button>
                             <Button size="sm" className="rounded-full text-[10px] font-black uppercase bg-brand hover:bg-brand/90" onClick={() => handleApproveComment(c)}>Valider</Button>
                          </div>
                       </div>
                     ))
                   )}
                 </ScrollArea>
               </CardContent>
             </Card>
          </TabsContent>`;

content = content.replace(COMMENTS_TAB_REGEX, NEW_COMMENTS_TAB);

// ── Écriture finale ───────────────────────────────────────────────────────
fs.writeFileSync(TARGET_FILE, content);
console.log('✅  Patch appliqué avec succès.');
console.log('👉  Vérifie avec :');
console.log('    grep -n "handleApproveComment\\|handleRejectComment\\|addDocumentNonBlocking" src/app/admin/page.tsx');
console.log('👉  Puis lance npm run build pour valider avant de push (avec le patch garages-moto déjà en place).');
console.log(`👉  En cas de problème, restaure avec : cp "${backupPath}" "${TARGET_FILE}"`);

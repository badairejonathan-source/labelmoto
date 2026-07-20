const fs = require('fs');
const path = require('path');

const lmPath = path.join(process.cwd(), 'src/components/app/listings-manager.tsx');
let lm = fs.readFileSync(lmPath, 'utf8');

const oldSave = `            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1 rounded-xl font-black uppercase text-xs tracking-widest h-11">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Enregistrer</>}
              </Button>
            </div>`;

const newSave = `            {/* Upload photo admin */}
            <div className="border-t pt-3 mt-4 space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">📸 Photo de l'établissement</label>
              <p className="text-[10px] text-muted-foreground">La photo sera validée avant publication.</p>
              <ImageUploadRequest
                concessionSlug={editing.id}
                concessionTitle={editing.title}
                onSuccess={() => toast({ title: '✅ Photo soumise pour validation' })}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1 rounded-xl font-black uppercase text-xs tracking-widest h-11">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Enregistrer</>}
              </Button>
            </div>`;

if (lm.includes(oldSave)) {
  lm = lm.replace(oldSave, newSave);
  fs.writeFileSync(lmPath, lm, 'utf8');
  console.log('✅ Upload image ajouté dans le panel admin (avant bouton Enregistrer)');
} else {
  console.error('❌ Ancre introuvable');
}

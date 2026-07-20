const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/pro/revendiquer/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldSubmitBtn = `            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full rounded-xl font-black uppercase text-xs tracking-widest h-12 mt-4">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Envoyer ma demande de modification</>}
            </Button>`;

const newSubmitBtn = `            {/* Upload photo */}
            <div className="border-t pt-4 space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1 block">
                📸 Photo de l'établissement (optionnel)
              </Label>
              <p className="text-[10px] text-muted-foreground ml-1">La photo sera validée par notre équipe avant publication.</p>
              <ImageUploadRequest
                concessionSlug={selected.id}
                concessionTitle={selected.title}
                onSuccess={(url) => console.log('Photo soumise:', url)}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full rounded-xl font-black uppercase text-xs tracking-widest h-12 mt-4">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Envoyer ma demande de modification</>}
            </Button>`;

if (content.includes(oldSubmitBtn)) {
  content = content.replace(oldSubmitBtn, newSubmitBtn);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Upload image ajouté dans /pro/revendiquer');
} else {
  console.error('❌ Bouton submit introuvable');
}

// ─── Admin panel : ajouter upload image dans listings-manager ────────────────
const lmPath = path.join(process.cwd(), 'src/components/app/listings-manager.tsx');
let lm = fs.readFileSync(lmPath, 'utf8');

// Vérifier si ImageUploadRequest est déjà importé
if (!lm.includes('ImageUploadRequest')) {
  const oldImport = `import { Loader2, Search, Edit, Trash2, MapPin, MapPinOff, X, Save, RefreshCw } from 'lucide-react';`;
  const newImport = `import { Loader2, Search, Edit, Trash2, MapPin, MapPinOff, X, Save, RefreshCw } from 'lucide-react';
import ImageUploadRequest from '@/components/app/image-upload-request';`;
  if (lm.includes(oldImport)) {
    lm = lm.replace(oldImport, newImport);
    console.log('✅ Import ImageUploadRequest ajouté dans listings-manager.tsx');
  }
}

// Ajouter upload avant le bouton Enregistrer dans l'admin
const oldSaveSection = `      {editing && (`;
const saveBtn = `              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}`;

// Chercher l'endroit avant le bouton save pour ajouter l'upload
if (!lm.includes('ImageUploadRequest concessionSlug') && lm.includes(saveBtn)) {
  lm = lm.replace(saveBtn,
    `<span className="sr-only">Enregistrer</span>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}`
  );
  // Trouver l'espace avant le bouton save (le div qui le contient)
  const saveBtnContainer = `              <div className="flex gap-2 pt-2">`;
  const newSaveBtnContainer = `              {/* Upload image admin */}
              <div className="border-t pt-3 mb-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">📸 Photo établissement</label>
                <ImageUploadRequest
                  concessionSlug={editing.id}
                  concessionTitle={editing.title}
                  onSuccess={(url) => { setEditing({ ...editing }); toast({ title: '✅ Photo soumise pour validation' }); }}
                />
              </div>
              <div className="flex gap-2 pt-2">`;
  if (lm.includes(saveBtnContainer)) {
    lm = lm.replace(saveBtnContainer, newSaveBtnContainer);
    console.log('✅ Upload image ajouté dans admin listings-manager');
  } else {
    console.warn('⚠️  Conteneur bouton save introuvable dans listings-manager');
  }
}

fs.writeFileSync(lmPath, lm, 'utf8');
console.log('\n✅ Upload image intégré dans les deux formulaires');

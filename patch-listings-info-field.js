/**
 * patch-listings-info-field.js — LabelMoto
 * Usage : node patch-listings-info-field.js
 *
 * Patch NON DESTRUCTIF de src/components/app/listings-manager.tsx :
 *  1. Ajoute l'import Textarea
 *  2. Ajoute "info: string" à l'interface ListingItem
 *  3. Ajoute la lecture de data.info dans le mapping Firestore → ListingItem
 *  4. Ajoute l'écriture de info dans handleSave
 *  5. Ajoute le champ Textarea "À propos" dans le formulaire, après "Site web"
 *
 * Fait une sauvegarde .bak avant toute modification.
 */
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(process.cwd(), 'src/components/app/listings-manager.tsx');

if (!fs.existsSync(TARGET_FILE)) {
  console.error(`❌  Fichier introuvable : ${TARGET_FILE}`);
  process.exit(1);
}

let content = fs.readFileSync(TARGET_FILE, 'utf8');
const backupPath = TARGET_FILE + '.bak';
fs.writeFileSync(backupPath, content);
console.log(`💾  Sauvegarde créée : ${backupPath}`);

function applyReplace(label, oldStr, newStr) {
  if (!content.includes(oldStr)) {
    console.error(`❌  [${label}] Ancre introuvable. Abandon (aucune modification écrite).`);
    process.exit(1);
  }
  content = content.replace(oldStr, newStr);
  console.log(`✅  [${label}] appliqué.`);
}

// ── 1. Import Textarea ───────────────────────────────────────────────────
applyReplace(
  'import Textarea',
  `import { Label } from '@/components/ui/label';`,
  `import { Label } from '@/components/ui/label';\nimport { Textarea } from '@/components/ui/textarea';`
);

// ── 2. Interface ListingItem ─────────────────────────────────────────────
applyReplace(
  'interface ListingItem',
  `  brands: string[];\n}`,
  `  brands: string[];\n  info: string;\n}`
);

// ── 3. Mapping Firestore → ListingItem ───────────────────────────────────
applyReplace(
  'mapping data.info',
  `            brands: Array.isArray(data.brands) ? data.brands : [],\n          });`,
  `            brands: Array.isArray(data.brands) ? data.brands : [],\n            info: data.info || '',\n          });`
);

// ── 4. handleSave : écrire le champ info ─────────────────────────────────
applyReplace(
  'handleSave info',
  `        brands: editing.brands,\n        isMultibrand: editing.brands.length >= 2,`,
  `        brands: editing.brands,\n        info: editing.info,\n        isMultibrand: editing.brands.length >= 2,`
);

// ── 5. Champ Textarea dans le formulaire (après "Site web") ─────────────
const SITE_WEB_ANCHOR = `<div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Site web</Label><Input value={editing.website} onChange={e => setEditing({ ...editing, website: e.target.value })} className="font-bold rounded-xl border-2" /></div>`;
const NEW_TEXTAREA_FIELD = `${SITE_WEB_ANCHOR}
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">À propos</Label><Textarea value={editing.info} onChange={e => setEditing({ ...editing, info: e.target.value })} rows={4} placeholder="Description de l'établissement, visible sur la fiche publique et utilisée pour le référencement." className="font-bold rounded-xl border-2 text-sm" /></div>`;
applyReplace('Textarea À propos dans le JSX', SITE_WEB_ANCHOR, NEW_TEXTAREA_FIELD);

// ── Écriture finale ───────────────────────────────────────────────────────
fs.writeFileSync(TARGET_FILE, content);
console.log('\n✅  Patch appliqué avec succès (5/5 étapes).');
console.log('👉  Vérifie avec :');
console.log('    grep -n "Textarea\\|info:" src/components/app/listings-manager.tsx');
console.log('👉  Puis npm run build avant de push.');
console.log(`👉  En cas de problème, restaure avec : cp "${backupPath}" "${TARGET_FILE}"`);

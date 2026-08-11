/**
 * patch-article-section-image.js — LabelMoto
 * Usage : node patch-article-section-image.js
 *
 * Patch NON DESTRUCTIF de src/components/app/article-client.tsx :
 * renderSection ne gérait aucun champ image (contrairement à renderCards qui
 * gère déjà card.image). On ajoute le même principe : si section.image est
 * présent, on l'affiche juste après le titre, avant le texte — utile pour les
 * subsections (ex: chaque modèle de moto dans l'article motos chinoises).
 *
 * Fait une sauvegarde .bak avant toute modification.
 */
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(process.cwd(), 'src/components/app/article-client.tsx');

if (!fs.existsSync(TARGET_FILE)) {
  console.error(`❌  Fichier introuvable : ${TARGET_FILE}`);
  process.exit(1);
}

let content = fs.readFileSync(TARGET_FILE, 'utf8');
const backupPath = TARGET_FILE + '.bak';
fs.writeFileSync(backupPath, content);
console.log(`💾  Sauvegarde créée : ${backupPath}`);

const ANCHOR = `        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}`;

if (!content.includes(ANCHOR)) {
  console.error('❌  Ancre introuvable (fichier peut-être différent). Abandon, aucune écriture.');
  process.exit(1);
}

const NEW_BLOCK = `${ANCHOR}
        {section.image && (
          <div className="relative w-full overflow-hidden rounded-[2rem] mb-6 bg-[#f8f7f5] shadow-md" style={{ aspectRatio: '4/3' }}>
            <img src={section.image} alt={section.title || ''} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}`;

content = content.replace(ANCHOR, NEW_BLOCK);
fs.writeFileSync(TARGET_FILE, content);

console.log('✅  Patch appliqué avec succès.');
console.log('👉  Vérifie avec :');
console.log('    grep -n "section.image" src/components/app/article-client.tsx');
console.log('👉  Puis npm run build avant de push.');
console.log(`👉  En cas de problème, restaure avec : cp "${backupPath}" "${TARGET_FILE}"`);

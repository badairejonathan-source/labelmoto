/**
 * patch-concession-title.js — LabelMoto
 * Usage : node patch-concession-title.js
 *
 * Patch NON DESTRUCTIF de src/app/concessions/[id]/page.tsx :
 *  - Regex postal étendue à 4-5 chiffres (couvre Belgique/Luxembourg en plus
 *    de la France), au lieu de \d{5} qui ratait tout ce qui n'est pas français.
 *  - Troncature du title réécrite pour ne JAMAIS couper le suffixe
 *    " — {typeLabel} | LabelMoto" en plein milieu — c'est le nom+ville qui
 *    est raccourci si besoin, jamais la marque.
 *
 * Fait une sauvegarde .bak avant toute modification.
 */
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(process.cwd(), 'src/app/concessions/[id]/page.tsx');

if (!fs.existsSync(TARGET_FILE)) {
  console.error(`❌  Fichier introuvable : ${TARGET_FILE}`);
  process.exit(1);
}

let content = fs.readFileSync(TARGET_FILE, 'utf8');
const backupPath = TARGET_FILE + '.bak';
fs.writeFileSync(backupPath, content);
console.log(`💾  Sauvegarde créée : ${backupPath}`);

// ── Bloc original à remplacer (extraction ville + construction title) ───────
const OLD_BLOCK = `  const addrParts = (pro.address || '').split(',').map((s: string) => s.trim());
  const cpSegIdx = addrParts.findIndex((p: string) => /\\d{5}/.test(p));
  const ville = cpSegIdx !== -1
    ? addrParts[cpSegIdx].replace(/\\d{5}\\s*/, '').trim()
    : addrParts[addrParts.length - 1] || '';

  // Meta title propre : extraire le nom court avant le premier tiret/pipe
  const shortName = pro.title.split(/\\s*[\\-\\/\\|]\\s*/)[0].trim();
  const villeInName = shortName.toLowerCase().includes((ville || '').toLowerCase());
  const typeLabel = pro.appSection === 'service' ? 'Atelier moto' : pro.appSection === 'association' ? 'Club moto' : 'Concessionnaire moto';
  const title = \`\${shortName}\${ville && !villeInName ? ' à ' + ville : ''} — \${typeLabel} | LabelMoto\`.slice(0, 65);`;

if (!content.includes(OLD_BLOCK)) {
  console.error('❌  Bloc original introuvable tel quel (fichier peut-être déjà modifié). Abandon, aucune écriture.');
  process.exit(1);
}

const NEW_BLOCK = `  const addrParts = (pro.address || '').split(',').map((s: string) => s.trim());
  // Regex étendue à 4-5 chiffres : couvre les codes postaux français (5) ET
  // belges/luxembourgeois (4), qui étaient auparavant ignorés et tombaient
  // sur un fallback affichant le pays au lieu de la ville (ex: "à Belgique").
  const cpSegIdx = addrParts.findIndex((p: string) => /\\d{4,5}/.test(p));
  const ville = cpSegIdx !== -1
    ? addrParts[cpSegIdx].replace(/\\d{4,5}\\s*/, '').trim()
    : addrParts[addrParts.length - 1] || '';

  // Meta title propre : extraire le nom court avant le premier tiret/pipe
  const shortName = pro.title.split(/\\s*[\\-\\/\\|]\\s*/)[0].trim();
  const villeInName = shortName.toLowerCase().includes((ville || '').toLowerCase());
  const typeLabel = pro.appSection === 'service' ? 'Atelier moto' : pro.appSection === 'association' ? 'Club moto' : 'Concessionnaire moto';
  // Troncature intelligente : le suffixe "— {typeLabel} | LabelMoto" est TOUJOURS
  // préservé intact. C'est le nom+ville qui est raccourci si le total dépasse
  // 65 caractères, jamais le nom de marque (évite un title visiblement coupé).
  const titleSuffix = \` — \${typeLabel} | LabelMoto\`;
  const titleNamePart = \`\${shortName}\${ville && !villeInName ? ' à ' + ville : ''}\`;
  const maxNameLen = 65 - titleSuffix.length;
  const truncatedNamePart = titleNamePart.length > maxNameLen
    ? titleNamePart.slice(0, Math.max(0, maxNameLen - 1)).trim() + '…'
    : titleNamePart;
  const title = \`\${truncatedNamePart}\${titleSuffix}\`;`;

content = content.replace(OLD_BLOCK, NEW_BLOCK);
fs.writeFileSync(TARGET_FILE, content);

console.log('✅  Patch appliqué avec succès.');
console.log('👉  Vérifie avec :');
console.log('    grep -n "maxNameLen\\|d{4,5}" "src/app/concessions/[id]/page.tsx"');
console.log('👉  Puis relance node check-quick-win-titles.js pour confirmer les nouveaux titles calculés.');
console.log(`👉  En cas de problème, restaure avec : cp "${backupPath}" "${TARGET_FILE}"`);

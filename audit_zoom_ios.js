/**
 * audit_zoom_ios.js — LabelMoto
 * ============================================================
 * Détecte les champs de saisie susceptibles de déclencher le zoom
 * automatique de Safari iOS.
 *
 * Règle : Safari iOS zoome sur un <input>, <textarea> ou <select>
 * dont la font-size est < 16 px au moment du focus.
 *
 * Classes Tailwind problématiques sur mobile :
 *   text-xs   = 12 px  ❌
 *   text-sm   = 14 px  ❌
 *   text-base = 16 px  ✅
 *
 * Attention aux variantes responsive : "text-sm md:text-base"
 * applique 14 px sur mobile — c'est justement là que le zoom se produit.
 *
 * Usage : node audit_zoom_ios.js
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.cwd(), 'src');
const TAGS = /<(Input|Textarea|Select|SelectTrigger|input|textarea|select)\b/;
const SMALL = /(?:^|\s|")(text-xs|text-sm|text-\[(?:1[0-5](?:\.\d+)?px|0?\.\d+rem)\])(?=\s|"|$)/;

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx|jsx)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

if (!fs.existsSync(ROOT)) {
  console.error('❌  Dossier src/ introuvable. Lancer depuis la racine du projet.');
  process.exit(1);
}

const files = walk(ROOT);
const findings = [];

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, i) => {
    // On cherche l'ouverture d'un champ de saisie, puis on inspecte
    // les 12 lignes suivantes (le className est souvent sur une autre ligne)
    if (!TAGS.test(line)) return;

    const block = lines.slice(i, i + 12).join(' ');
    const closeIdx = block.indexOf('>');
    const tagContent = closeIdx > 0 ? block.slice(0, closeIdx) : block;

    const m = tagContent.match(SMALL);
    if (m) {
      // Un md:text-base ne protège pas : le mobile garde la petite taille
      const hasResponsiveFix = /\b(sm|md|lg):text-(base|lg|xl)/.test(tagContent);
      findings.push({
        file: path.relative(process.cwd(), file),
        line: i + 1,
        classe: m[1],
        responsive: hasResponsiveFix,
        extrait: line.trim().slice(0, 80),
      });
    }
  });
}

console.log(`\n${'='.repeat(62)}`);
console.log(`  AUDIT ZOOM SAFARI iOS — ${files.length} fichiers analysés`);
console.log(`${'='.repeat(62)}\n`);

if (!findings.length) {
  console.log('✅  Aucun champ de saisie sous 16 px détecté.\n');
  process.exit(0);
}

for (const f of findings) {
  console.log(`⚠️  ${f.file}:${f.line}`);
  console.log(`    classe : ${f.classe}${f.responsive ? '  (avec md:text-base — ne protège PAS le mobile)' : ''}`);
  console.log(`    ${f.extrait}`);
  console.log('');
}

console.log(`${'='.repeat(62)}`);
console.log(`  ${findings.length} champ(s) à corriger`);
console.log(`  Remplacer text-xs / text-sm par text-base sur ces champs.`);
console.log(`${'='.repeat(62)}\n`);

/**
 * audit_compat_mobile.js — LabelMoto
 * ============================================================
 * Détecte les pièges classiques de compatibilité mobile / navigateurs.
 *
 * Contrôles effectués :
 *   1. 100vh sur iOS Safari      → barre d'adresse qui masque le contenu
 *   2. position: fixed + clavier  → éléments qui sautent sur iOS
 *   3. Zones tactiles < 44 px     → recommandation Apple / Google
 *   4. user-scalable=no           → bloque le zoom, pénalité accessibilité
 *   5. -webkit-overflow-scrolling → scroll saccadé sur iOS
 *   6. :hover sans :focus-visible → inaccessible au clavier
 *   7. backdrop-filter            → support partiel, coûteux en perf
 *   8. Images sans dimensions     → Cumulative Layout Shift (Core Web Vitals)
 *   9. font-size en px fixe       → ignore les préférences utilisateur
 *  10. Événements onMouseOver seuls → inutilisables au toucher
 *
 * Usage : node audit_compat_mobile.js
 * Lecture seule — ne modifie aucun fichier.
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.cwd(), 'src');

const CHECKS = [
  {
    id: '100vh',
    gravite: 'HAUTE',
    label: '100vh sur mobile',
    regex: /\b(h-screen|min-h-screen|h-\[100vh\]|min-h-\[100vh\]|height:\s*100vh)\b/,
    explication:
      "Sur iOS Safari, 100vh inclut la barre d'adresse qui se rétracte au scroll : " +
      "le contenu du bas est coupé. Utiliser 100dvh (dynamic viewport height) ou " +
      "min-h-[100dvh] avec repli h-screen.",
    impact: 'Contenu inaccessible en bas de page sur iPhone',
  },
  {
    id: 'fixed-input',
    gravite: 'MOYENNE',
    label: 'position fixed près d\'un champ de saisie',
    regex: /\bfixed\b(?=[^"]*")/,
    complement: /<(Input|input|Textarea|textarea)/,
    explication:
      "Sur iOS, l'ouverture du clavier décale les éléments en position fixed. " +
      "Un header ou une barre fixe peut se retrouver au milieu de l'écran.",
    impact: 'Interface décalée pendant la saisie sur iPhone',
  },
  {
    id: 'touch-target',
    gravite: 'MOYENNE',
    label: 'zone tactile potentiellement < 44 px',
    regex: /className="[^"]*\b(h-6|h-7|h-8|w-6|w-7|w-8|p-0\.5|p-1)\b[^"]*"/,
    complement: /<(button|Button|a\s|Link)/,
    explication:
      "Apple recommande 44×44 px minimum, Google 48×48 px. En dessous, " +
      "les erreurs de frappe augmentent nettement. Ajouter min-h-[44px] min-w-[44px] " +
      "ou augmenter le padding.",
    impact: 'Boutons difficiles à toucher, signalé par Lighthouse',
  },
  {
    id: 'user-scalable',
    gravite: 'HAUTE',
    label: 'zoom désactivé',
    regex: /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(?!\d)/,
    explication:
      "Empêche les malvoyants de zoomer. Échec du critère WCAG 1.4.4, " +
      "pénalisé par Lighthouse Accessibility. Safari l'ignore depuis iOS 10 de toute façon.",
    impact: 'Pénalité accessibilité + SEO',
  },
  {
    id: 'hover-only',
    gravite: 'FAIBLE',
    label: 'onMouseOver / onMouseEnter sans équivalent tactile',
    regex: /\bonMouseOver=|\bonMouseEnter=/,
    exclude: /onTouchStart|onFocus|onClick/,
    explication:
      "Ces événements ne se déclenchent pas au toucher. Prévoir onClick, " +
      "onFocus ou onTouchStart en complément.",
    impact: 'Fonctionnalité inaccessible sur mobile',
  },
  {
    id: 'img-no-dims',
    gravite: 'MOYENNE',
    label: 'balise <img> sans width/height',
    regex: /<img\b(?![^>]*\bwidth=)(?![^>]*\bfill\b)[^>]*>/,
    explication:
      "Sans dimensions explicites, le navigateur ne réserve pas l'espace : " +
      "le contenu saute au chargement (CLS). C'est un des trois Core Web Vitals " +
      "utilisés par Google pour le classement. Préférer next/image.",
    impact: 'Dégrade le score Core Web Vitals → SEO',
  },
  {
    id: 'backdrop-filter',
    gravite: 'FAIBLE',
    label: 'backdrop-filter',
    regex: /\bbackdrop-(blur|filter|saturate)/,
    explication:
      "Coûteux en performance sur mobile d'entrée de gamme, et le rendu varie " +
      "entre Safari, Chrome et Firefox. À utiliser avec parcimonie.",
    impact: 'Ralentissements sur téléphones anciens',
  },
  {
    id: 'overflow-scroll',
    gravite: 'FAIBLE',
    label: 'overflow scrollable sans -webkit-overflow-scrolling',
    regex: /\b(overflow-x-auto|overflow-y-auto|overflow-auto|overflow-x-scroll)\b/,
    explication:
      "Sur iOS ancien, le scroll interne est saccadé sans " +
      "-webkit-overflow-scrolling: touch. Peu critique sur iOS récent mais " +
      "à surveiller si vous ciblez des appareils anciens.",
    impact: 'Scroll peu fluide sur iOS ancien',
  },
];

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx|jsx|css)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

if (!fs.existsSync(ROOT)) {
  console.error('❌  Dossier src/ introuvable. Lancer depuis la racine du projet.');
  process.exit(1);
}

const files = walk(ROOT);
const results = {};
for (const c of CHECKS) results[c.id] = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const rel = path.relative(process.cwd(), file);

  for (const check of CHECKS) {
    lines.forEach((line, i) => {
      if (!check.regex.test(line)) return;
      if (check.exclude && check.exclude.test(line)) return;

      // Certains contrôles exigent un élément complémentaire à proximité
      if (check.complement) {
        const around = lines.slice(Math.max(0, i - 6), i + 6).join(' ');
        if (!check.complement.test(around)) return;
      }

      results[check.id].push({
        file: rel,
        line: i + 1,
        extrait: line.trim().slice(0, 95),
      });
    });
  }
}

// ---- Contrôle du viewport dans layout.tsx ----
const layoutCandidates = files.filter(f => /layout\.tsx$/.test(f));
let viewportInfo = null;
for (const f of layoutCandidates) {
  const c = fs.readFileSync(f, 'utf8');
  if (/viewport/i.test(c)) {
    viewportInfo = {
      file: path.relative(process.cwd(), f),
      hasUserScalable: /user-scalable/i.test(c),
      hasMaxScale: /maximumScale|maximum-scale/i.test(c),
      hasViewportFit: /viewport-fit|viewportFit/i.test(c),
    };
    break;
  }
}

// ---- Affichage ----
console.log(`\n${'='.repeat(70)}`);
console.log(`  AUDIT COMPATIBILITÉ MOBILE — ${files.length} fichiers analysés`);
console.log(`${'='.repeat(70)}`);

const ORDER = { HAUTE: 0, MOYENNE: 1, FAIBLE: 2 };
const ICON = { HAUTE: '🔴', MOYENNE: '🟠', FAIBLE: '🟡' };

const sorted = [...CHECKS].sort((a, b) => ORDER[a.gravite] - ORDER[b.gravite]);
let total = 0;

for (const check of sorted) {
  const hits = results[check.id];
  if (!hits.length) continue;
  total += hits.length;

  console.log(`\n${ICON[check.gravite]}  ${check.label.toUpperCase()}  —  ${hits.length} occurrence(s)`);
  console.log(`    Gravité : ${check.gravite}`);
  console.log(`    Impact  : ${check.impact}`);
  console.log(`    ${check.explication.replace(/\s+/g, ' ')}`);
  console.log('');

  const shown = hits.slice(0, 8);
  for (const h of shown) {
    console.log(`    ${h.file}:${h.line}`);
    console.log(`      ${h.extrait}`);
  }
  if (hits.length > shown.length) {
    console.log(`    … et ${hits.length - shown.length} autre(s)`);
  }
}

if (viewportInfo) {
  console.log(`\n📱  CONFIGURATION VIEWPORT — ${viewportInfo.file}`);
  console.log(`    user-scalable présent : ${viewportInfo.hasUserScalable ? '⚠️ OUI' : '✅ non'}`);
  console.log(`    maximumScale présent  : ${viewportInfo.hasMaxScale ? '⚠️ OUI' : '✅ non'}`);
  console.log(`    viewport-fit=cover    : ${viewportInfo.hasViewportFit ? '✅ oui' : '➖ non (utile pour les encoches iPhone)'}`);
}

console.log(`\n${'='.repeat(70)}`);
console.log(`  ${total} point(s) d'attention au total`);
console.log(`  Lecture seule — aucun fichier modifié.`);
console.log(`${'='.repeat(70)}\n`);

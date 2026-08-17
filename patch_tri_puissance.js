/**
 * patch_tri_puissance.js — LabelMoto
 * ============================================================
 * Modifie getFiches() dans src/app/entretien/[marque]/page.tsx
 * pour trier les motos par puissance croissante (de la plus petite
 * à la plus grande) au lieu de l'ordre alphabétique.
 *
 * La puissance est lue dans cet ordre de priorité :
 *   1. technical_sheet.max_power_hp   (nombre, le plus fiable)
 *   2. technical_sheet.max_power_kw   (converti en ch : × 1,36)
 *   3. technical_sheet.power          (extraction depuis le texte)
 *
 * Les fiches sans puissance exploitable sont placées en fin de
 * liste, triées alphabétiquement entre elles.
 *
 * Usage : node patch_tri_puissance.js
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const FILE = path.resolve(process.cwd(), 'src/app/entretien/[marque]/page.tsx');

if (!fs.existsSync(FILE)) {
  console.error('❌  Fichier introuvable :', FILE);
  process.exit(1);
}

let content = fs.readFileSync(FILE, 'utf8');

// Sauvegarde
const backup = FILE + '.bak';
fs.writeFileSync(backup, content, 'utf8');
console.log('💾  Sauvegarde :', backup);

if (content.includes('extractHp')) {
  console.log('ℹ️  Patch déjà appliqué — aucune modification.');
  process.exit(0);
}

// Ancre : la fonction getFiches complète
const ANCHOR = /async function getFiches\(brandFirestoreValue: string\) \{[\s\S]*?\n\}/;

if (!ANCHOR.test(content)) {
  console.error("❌  Fonction getFiches introuvable. Fichier peut-être déjà modifié.");
  console.error('    Aucune modification effectuée. Sauvegarde conservée.');
  process.exit(1);
}

const REPLACEMENT = `/**
 * Extrait la puissance en chevaux depuis une fiche.
 * Retourne null si aucune valeur exploitable n'est trouvée.
 */
function extractHp(ts: any): number | null {
  if (!ts) return null;

  // 1. Champ numérique direct
  if (typeof ts.max_power_hp === 'number' && ts.max_power_hp > 0) {
    return ts.max_power_hp;
  }

  // 2. Conversion depuis les kW
  if (typeof ts.max_power_kw === 'number' && ts.max_power_kw > 0) {
    return ts.max_power_kw * 1.36;
  }

  // 3. Extraction depuis le texte, ex. "54,0 kW (73,4 ch) à 8 750 tr/min"
  //    ou "Puissance bridée : 35 kW (47,5 ch) / non bridée : 70 kW (95 ch)"
  //    On retient la valeur la plus élevée (version pleine puissance).
  const txt = typeof ts.power === 'string' ? ts.power : '';
  if (txt) {
    const hpMatches = [...txt.matchAll(/(\\d+[,.]?\\d*)\\s*ch/gi)];
    if (hpMatches.length) {
      const values = hpMatches.map(m => parseFloat(m[1].replace(',', '.')));
      const max = Math.max(...values);
      if (!isNaN(max) && max > 0) return max;
    }
    const kwMatches = [...txt.matchAll(/(\\d+[,.]?\\d*)\\s*kW/gi)];
    if (kwMatches.length) {
      const values = kwMatches.map(m => parseFloat(m[1].replace(',', '.')));
      const max = Math.max(...values);
      if (!isNaN(max) && max > 0) return max * 1.36;
    }
  }

  return null;
}

async function getFiches(brandFirestoreValue: string) {
  try {
    const db = getAdminFirestore();
    const snap = await db.collection('motorcycle_sheets')
      .where('brand', '==', brandFirestoreValue)
      .get();

    return snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        label: d.display_title || d.model || doc.id,
        category: d.category || '',
        hp: extractHp(d.technical_sheet),
      };
    }).sort((a, b) => {
      // Puissance croissante ; les fiches sans puissance passent en dernier
      if (a.hp !== null && b.hp !== null) {
        if (a.hp !== b.hp) return a.hp - b.hp;
        return a.label.localeCompare(b.label, 'fr');
      }
      if (a.hp !== null) return -1;
      if (b.hp !== null) return 1;
      return a.label.localeCompare(b.label, 'fr');
    });
  } catch (err) {
    console.error('[entretien/marque]', err);
    return [];
  }
}`;

content = content.replace(ANCHOR, REPLACEMENT);
fs.writeFileSync(FILE, content, 'utf8');

console.log('✅  getFiches() remplacée — tri par puissance croissante.');
console.log('📄  Fichier modifié :', FILE);
console.log('');
console.log('📋  Ordre de lecture de la puissance :');
console.log('    1. technical_sheet.max_power_hp');
console.log('    2. technical_sheet.max_power_kw × 1,36');
console.log('    3. extraction depuis technical_sheet.power');
console.log('');
console.log('⚠️  Un rebuild est nécessaire (page SSG).');
console.log('    En cas de problème, restaurer avec :');
console.log('    Move-Item -Force "src\\\\app\\\\entretien\\\\[marque]\\\\page.tsx.bak" "src\\\\app\\\\entretien\\\\[marque]\\\\page.tsx"');

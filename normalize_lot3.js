/**
 * normalize_lot3.js — LabelMoto
 * Normalise les 15 fiches du lot 3 (Honda, Kawasaki, Suzuki, BMW).
 *
 * Corrections :
 *  1. Suppression de `timestamps` (objet Firestore → erreur React #31)
 *  2. featured → true
 *  3. variants → [] si absent
 *  4. subcategory "a" → "a-permis-a"
 *  5. Extraction des valeurs numériques puissance / couple depuis le texte
 *  6. Suppression des clés null résiduelles
 *
 * La BMW G310R est volontairement laissée dans son format d'origine
 * (structure enrichie différente, déjà gérée par les fallbacks du composant),
 * seuls featured et variants y sont ajoutés.
 *
 * Usage : placer les 15 .json à la racine puis  node normalize_lot3.js
 */

const fs = require('fs');
const path = require('path');

const BRAND_ORDER = {
  'Honda': 1, 'Yamaha': 2, 'Kawasaki': 3, 'Suzuki': 4, 'BMW': 5,
  'Triumph': 6, 'CFMOTO': 7, 'KOVE': 8, 'VOGE': 9, 'QJ Motor': 10,
  'Benelli': 11, 'Husqvarna': 12, 'ZONTES': 13, 'Orcal': 14,
  'Mash': 15, 'KTM': 16, 'Aprilia': 17,
};

// Fiche au format enrichi différent — traitement allégé
const LEGACY_FORMAT = new Set(['bmw-g310r-2021-plus']);

const FILES = [
  'bmw-f900r-2020-plus.json',
  'honda-cb1000-hornet-2025-plus.json',
  'honda-msx125-grom-2021-plus.json',
  'kawasaki-versys-650-2022-plus.json',
  'kawasaki-z650-2020-plus.json',
  'kawasaki-z900-2020-plus.json',
  'kawasaki-z125-2019-plus.json',
  'suzuki-v-strom-650-2017-plus.json',
  'suzuki-gsx-8r-2024-plus.json',
  'bmw-g310r-2021-plus.json',
  'suzuki-gsx-8s-2023-plus.json',
  'suzuki-sv650-2016-plus.json',
  'kawasaki-kle-500-2026-plus.json',
  'honda-cb650r-2020-plus.json',
  'honda-nx500-2024-plus.json',
];

/** Extrait kW et ch. Retient la valeur la plus élevée (version non bridée). */
function extractPower(str) {
  if (!str || typeof str !== 'string') return null;
  const kwMatches = [...str.matchAll(/(\d+[,.]?\d*)\s*kW/gi)];
  const hpMatches = [...str.matchAll(/(\d+[,.]?\d*)\s*ch/gi)];
  if (!kwMatches.length) return null;
  const toNum = (s) => parseFloat(s.replace(',', '.'));
  return {
    kw: Math.max(...kwMatches.map(m => toNum(m[1]))),
    hp: hpMatches.length ? Math.max(...hpMatches.map(m => toNum(m[1]))) : null,
  };
}

/** Extrait le couple en Nm et son régime. */
function extractTorque(str) {
  if (!str || typeof str !== 'string') return null;
  const nm = str.match(/(\d+[,.]?\d*)\s*N\.?m/i);
  const rpm = str.match(/(\d[\d\s]*)\s*tr\/min/i);
  if (!nm) return null;
  return {
    nm: parseFloat(nm[1].replace(',', '.')),
    rpm: rpm ? parseInt(rpm[1].replace(/\s/g, ''), 10) : null,
  };
}

let ok = 0, err = 0;
const report = [];

for (const file of FILES) {
  const filePath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    report.push(`❌ MANQUANT : ${file}`);
    err++;
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    report.push(`❌ JSON INVALIDE : ${file} — ${e.message}`);
    err++;
    continue;
  }

  const changes = [];
  const isLegacy = LEGACY_FORMAT.has(data.id);

  // 1. Suppression de timestamps
  if (data.timestamps) {
    delete data.timestamps;
    changes.push('timestamps supprimé');
  }

  // 2. featured → true
  if (data.featured !== true) {
    data.featured = true;
    changes.push('featured=true');
  }

  // 3. variants → array
  if (!Array.isArray(data.variants)) {
    data.variants = [];
    changes.push('variants→[]');
  }

  // 4. brand_order (vérification, normalement déjà corrects)
  const correctOrder = BRAND_ORDER[data.brand];
  if (correctOrder && data.brand_order !== correctOrder) {
    changes.push(`brand_order ${data.brand_order}→${correctOrder}`);
    data.brand_order = correctOrder;
  }

  // 5. subcategory "a" → "a-permis-a" (plus explicite)
  if (data.subcategory === 'a') {
    data.subcategory = 'a-permis-a';
    changes.push('subcategory "a"→"a-permis-a"');
  }

  // 6. Type
  if (data.type !== 'motorcycle_service_sheet') {
    data.type = 'motorcycle_service_sheet';
    changes.push('type corrigé');
  }

  // 7. Extraction puissance / couple (format standard uniquement)
  const ts = data.technical_sheet || {};
  if (!isLegacy) {
    if (!ts.max_power_kw) {
      const p = extractPower(ts.power);
      if (p) {
        ts.max_power_kw = p.kw;
        if (p.hp) ts.max_power_hp = p.hp;
        changes.push(`puissance extraite (${p.kw} kW / ${p.hp} ch)`);
      }
    }
    if (!ts.max_torque_nm) {
      const t = extractTorque(ts.torque);
      if (t) {
        ts.max_torque_nm = t.nm;
        if (t.rpm) ts.max_torque_rpm = t.rpm;
        changes.push(`couple extrait (${t.nm} Nm)`);
      }
    }
  } else {
    changes.push('format enrichi conservé');
  }

  // 8. Suppression des clés null résiduelles
  for (const key of Object.keys(ts)) {
    if (ts[key] === null) delete ts[key];
  }
  data.technical_sheet = ts;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  report.push(`✅ ${file}\n     ${changes.length ? changes.join(' | ') : 'aucun changement'}`);
  ok++;
}

console.log('\n=== NORMALISATION LOT 3 ===\n');
report.forEach(r => console.log(r));
console.log(`\n✅ ${ok} fichiers normalisés / ❌ ${err} erreurs`);
console.log('\nℹ️  La BMW G310R conserve son format enrichi (service_schedule');
console.log('   avec operations[] et consumables détaillés). Le composant');
console.log('   fiche-client.tsx gère déjà ce format via ses fallbacks.\n');

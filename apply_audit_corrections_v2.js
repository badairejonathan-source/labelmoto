/**
 * apply_audit_corrections_v2.js — LabelMoto
 * ============================================================
 * Corrections issues du document officiel Kawasaki
 * « Forfait de maintenance 2025-2026 » + intervalles CFMOTO France.
 *
 * Usage :
 *   node apply_audit_corrections_v2.js --dry-run   → simulation
 *   node apply_audit_corrections_v2.js             → application réelle
 *
 * Corrige :
 *  1. Jeu aux soupapes Kawasaki : 24 000 km → 42 000 km (9 fiches)
 *  2. Tarifs officiels Kawasaki par classe de cylindrée
 *  3. CFMOTO 300NK : intervalle aligné sur le réseau France (5 000 km)
 * ============================================================
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const BACKUP_DIR = path.resolve(process.cwd(), 'backup-audit-v2');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

// ============================================================
// Note commune reprise dans toutes les fiches Kawasaki
// ============================================================
const NOTE_KAWA = (classe) =>
  `Tarifs officiels Kawasaki France (forfait de maintenance 2025-2026, valable du 01/01/2025 au 31/12/2026), classe ${classe}. ` +
  `Prix maximum conseillés incluant pièces d'origine, fluides et main-d'œuvre. ` +
  `Important : les forfaits 12 000, 24 000 et 36 000 km sont indiqués sans contrôle ni réglage du jeu aux soupapes — ` +
  `si l'intervention est nécessaire à cet intervalle, les deux forfaits se cumulent. ` +
  `Respecter le plan de maintenance constructeur donne droit au programme Assistance Plus offert. ` +
  `Un atelier indépendant facture généralement 20 à 30 % de moins.`;

// ============================================================
// CORRECTIONS
// ============================================================

const CORRECTIONS = {

  // ================= 125 cm³ =================
  'kawasaki-z125-2019-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "140 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "310 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, bougie", price_estimate: "340 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "340 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes (réglage si nécessaire)", price_estimate: "170 € (contrôle) / 250 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "310 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "340 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km.",
      total_60000km: "≈ 1 950 € en concession (≈ 1 400 € chez un indépendant)",
      cost_per_km: "≈ 0,032 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('125 cm³') + " Maintenance annuelle si le kilométrage n'est pas atteint : 140 € (1re année), 240 € (2e), 225 € (3e). Forfaits complémentaires : liquide de refroidissement 50 €, liquide hydraulique 60 €, plaquettes avant 90 €, plaquettes arrière 80 €.",
    },
  },

  // ================= 400 à 650 cm³ =================
  'kawasaki-ninja-500-se-2024-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "170 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "380 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, bougies", price_estimate: "560 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "475 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes (réglage si nécessaire)", price_estimate: "290 € (contrôle) / 380 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "380 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "560 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km.",
      total_60000km: "≈ 2 800 € en concession (≈ 2 000 € chez un indépendant)",
      cost_per_km: "≈ 0,047 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('400 à 650 cm³') + " Maintenance annuelle : 170 € (1re année), 300 € (2e), 305 € (3e). Forfaits complémentaires : liquide de refroidissement 60 €, liquide hydraulique 60 €, plaquettes avant 185 €, plaquettes arrière 95 €.",
    },
  },

  'kawasaki-z650-2020-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "170 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "380 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, bougies", price_estimate: "560 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "475 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes (réglage si nécessaire)", price_estimate: "290 € (contrôle) / 380 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "380 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "560 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km.",
      total_60000km: "≈ 2 800 € en concession (≈ 2 000 € chez un indépendant)",
      cost_per_km: "≈ 0,047 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('400 à 650 cm³') + " Maintenance annuelle : 170 € (1re année), 300 € (2e), 305 € (3e). Forfaits complémentaires : liquide de refroidissement 60 €, liquide hydraulique 60 €, plaquettes avant 185 €, plaquettes arrière 95 €.",
    },
    'service_guide.known_issues': [
      "Suspension d'origine un peu ferme sur mauvais revêtements",
      "Selle passager peu accueillante sur longue distance",
      "Le forfait des 24 000 km (560 €) est le plus lourd du cycle : à anticiper dans le budget",
    ],
  },

  'kawasaki-versys-650-2022-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "170 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "380 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, bougies", price_estimate: "560 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "475 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes (réglage si nécessaire)", price_estimate: "290 € (contrôle) / 380 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "380 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "560 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km.",
      total_60000km: "≈ 2 800 € en concession (≈ 2 000 € chez un indépendant)",
      cost_per_km: "≈ 0,047 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('400 à 650 cm³') + " Maintenance annuelle : 170 € (1re année), 300 € (2e), 305 € (3e). Forfaits complémentaires : liquide de refroidissement 60 €, liquide hydraulique 60 €, plaquettes avant 185 €, plaquettes arrière 95 €.",
    },
  },

  'kawasaki-er6n-2012-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "170 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "380 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, bougies", price_estimate: "560 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "475 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes (réglage si nécessaire)", price_estimate: "290 € (contrôle) / 380 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "380 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "560 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km.",
      total_60000km: "≈ 2 800 € en concession (≈ 2 000 € chez un indépendant)",
      cost_per_km: "≈ 0,047 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('400 à 650 cm³') + " Attention : le forfait de maintenance Kawasaki s'applique aux motos de route à partir de 2007, l'ER-6n y est donc éligible. Les pièces restent courantes et économiques sur ce modèle très répandu.",
    },
  },

  'kawasaki-kle-500-2026-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "170 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "380 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, bougies", price_estimate: "560 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "475 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes (réglage si nécessaire)", price_estimate: "290 € (contrôle) / 380 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "380 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "560 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km.",
      total_60000km: "≈ 2 800 € en concession (≈ 2 000 € chez un indépendant)",
      cost_per_km: "≈ 0,047 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('400 à 650 cm³') + " Maintenance annuelle : 170 € (1re année), 300 € (2e), 305 € (3e).",
    },
  },

  // ================= 900 à 1000 cm³ =================
  'kawasaki-z900-2020-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "210 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "470 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, 4 bougies", price_estimate: "640 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "590 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes 16 soupapes (réglage si nécessaire)", price_estimate: "410 € (contrôle) / 520 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "470 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "640 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km — et non 24 000 km comme sur beaucoup de 4-cylindres concurrents.",
      total_60000km: "≈ 3 430 € en concession (≈ 2 400 € chez un indépendant)",
      cost_per_km: "≈ 0,057 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('900 à 1000 cm³') + " Maintenance annuelle : 210 € (1re année), 335 € (2e), 375 € (3e). Forfaits complémentaires : liquide de refroidissement 90 €, liquide hydraulique 60 €, plaquettes avant 200 €, plaquettes arrière 110 €. Nettoyage et synchronisation de la rampe d'injection ETV : 230 €.",
    },
  },

  'kawasaki-z900rs-2018-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "210 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "470 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, 4 bougies", price_estimate: "640 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "590 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes 16 soupapes (réglage si nécessaire)", price_estimate: "410 € (contrôle) / 520 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "470 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "640 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km.",
      total_60000km: "≈ 3 430 € en concession (≈ 2 400 € chez un indépendant)",
      cost_per_km: "≈ 0,057 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('900 à 1000 cm³') + " Maintenance annuelle : 210 € (1re année), 335 € (2e), 375 € (3e). Forfaits complémentaires : liquide de refroidissement 90 €, liquide hydraulique 60 €, plaquettes avant 200 €, plaquettes arrière 110 €.",
    },
  },

  'kawasaki-ninja1000sx-2020-plus': {
    'service_guide.service_schedule': [
      { km: 1000,  service_label: "Révision de rodage (forfait Kawasaki)", price_estimate: "210 €" },
      { km: 12000, service_label: "Révision périodique : vidange, filtre à huile, contrôles", price_estimate: "470 €" },
      { km: 24000, service_label: "Révision périodique + filtre à air, 4 bougies", price_estimate: "640 €" },
      { km: 36000, service_label: "Révision périodique", price_estimate: "590 €" },
      { km: 42000, service_label: "Contrôle du jeu aux soupapes 16 soupapes (réglage si nécessaire)", price_estimate: "410 € (contrôle) / 520 € (réglage)" },
      { km: 48000, service_label: "Révision périodique", price_estimate: "470 €" },
      { km: 60000, service_label: "Révision périodique", price_estimate: "640 €" },
    ],
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 12 000 km ou tous les ans, premier des termes échus. Contrôle du jeu aux soupapes à 42 000 km.",
      total_60000km: "≈ 3 430 € en concession (≈ 2 400 € chez un indépendant)",
      cost_per_km: "≈ 0,057 €/km (révisions seules, hors pneus et chaîne)",
      note: NOTE_KAWA('900 à 1000 cm³') + " Maintenance annuelle : 210 € (1re année), 335 € (2e), 375 € (3e). Nettoyage et synchronisation de la rampe d'injection ETV : 230 €.",
    },
  },

  // ================= CFMOTO 300NK : réseau France =================
  'cfmoto-300nk-2020-plus': {
    'service_guide.maintenance_cost_summary': {
      interval_rule: "1 000 km puis tous les 5 000 km ou annuelle (intervalles CFMOTO France, gamme 125 à 700 cc).",
      total_60000km: "Données indisponibles",
      cost_per_km: "Non communiqué",
      note: "Intervalles officiels du réseau CFMOTO France : première révision à 1 000 km, puis tous les 5 000 km ou une fois par an. Le carnet d'entretien doit être tamponné obligatoirement après chaque passage en atelier agréé — c'est une condition de la garantie. Se munir de la carte grise et du carnet lors de chaque révision.",
    },
  },

};

// ============================================================
// EXÉCUTION
// ============================================================

function getDeep(obj, dottedPath) {
  return dottedPath.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function short(v) {
  if (v === undefined) return '(absent)';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return s.length > 100 ? s.slice(0, 97) + '…' : s;
}

async function run() {
  const ids = Object.keys(CORRECTIONS);
  console.log(`\n${'='.repeat(66)}`);
  console.log(`  CORRECTIONS V2 — Forfaits Kawasaki officiels + CFMOTO`);
  console.log(`  ${ids.length} fiches · Mode : ${DRY_RUN ? 'SIMULATION' : 'APPLICATION RÉELLE'}`);
  console.log(`${'='.repeat(66)}\n`);

  if (!DRY_RUN && !fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  let ok = 0, missing = 0, fields = 0;

  for (const docId of ids) {
    const ref = db.collection('motorcycle_sheets').doc(docId);
    const snap = await ref.get();

    if (!snap.exists) {
      console.log(`⚠️  INTROUVABLE : ${docId}\n`);
      missing++;
      continue;
    }

    const data = snap.data();

    if (!DRY_RUN) {
      fs.writeFileSync(
        path.join(BACKUP_DIR, `${docId}.json`),
        JSON.stringify(data, null, 2),
        'utf8'
      );
    }

    const updates = CORRECTIONS[docId];
    console.log(`📄 ${docId}`);

    const payload = {};
    for (const [p, newVal] of Object.entries(updates)) {
      const oldVal = getDeep(data, p);
      console.log(`   ${p}`);
      console.log(`      avant : ${short(oldVal)}`);
      console.log(`      après : ${short(newVal)}`);
      payload[p] = newVal;
      fields++;
    }

    if (!DRY_RUN) {
      await ref.update(payload);
      console.log(`   ✅ appliqué\n`);
    } else {
      console.log(`   (simulation)\n`);
    }
    ok++;
  }

  console.log(`${'='.repeat(66)}`);
  console.log(`  ${ok} fiches · ${fields} champs · ${missing} introuvables`);
  if (!DRY_RUN) console.log(`  Backups : ${BACKUP_DIR}`);
  else console.log(`  Aucune écriture — relancer sans --dry-run pour appliquer`);
  console.log(`${'='.repeat(66)}\n`);

  process.exit(0);
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });

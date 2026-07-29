/**
 * migrate_fiches.js — LabelMoto
 * Adapte les nouvelles fiches au format attendu par fiche-client.tsx
 */

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

const NEW_FICHES = [
  'cfmoto-450nk-2023-plus',
  'cfmoto-700clx-2021-plus',
  'cfmoto-650mt-650nk-2020-plus',
  'cfmoto-700mt-2023-plus',
  'cfmoto-300nk-2020-plus',
  'cfmoto-800mt-sport-explore-2023-plus',
];

function adaptVariants(variantsObj, ts) {
  if (!variantsObj || Array.isArray(variantsObj)) return [];
  return Object.values(variantsObj).map(v => ({
    label: v.label || '',
    license_bridging: v.permitted_a2 ? 'A2 (bridable)' : 'A',
    engine_type: ts.engine_type || '',
    displacement_cc: ts.displacement_cc || '',
    power: v.max_power_hp ? `${v.max_power_hp} ch / ${v.max_power_kw} kW` : (ts.max_power_hp ? `${ts.max_power_hp} ch` : 'N/A'),
    torque: v.max_torque_nm ? `${v.max_torque_nm} Nm` : (ts.max_torque_nm ? `${ts.max_torque_nm} Nm` : 'N/A'),
    fuel_system: ts.throttle || 'Injection électronique',
    weight_tpf_kg: v.kerb_weight_kg || ts.kerb_weight_kg || '',
    seat_height_mm: v.seat_height_mm || ts.seat_height_mm || '',
    tank_l: v.fuel_tank_liters || ts.fuel_tank_liters || '',
    cycle_parts: {
      frame: ts.frame || '',
      front_suspension: v.front_suspension || ts.front_suspension || '',
      rear_suspension: v.rear_suspension || ts.rear_suspension || '',
      front_brake: v.front_brake || ts.front_brake || '',
      rear_brake: v.rear_brake || ts.rear_brake || '',
      front_tire: v.front_tire || ts.front_tire || '',
      rear_tire: v.rear_tire || ts.rear_tire || '',
    }
  }));
}

function adaptTechnicalSheet(ts) {
  return {
    ...ts,
    // Champs attendus par le composant
    power: ts.max_power_hp ? `${ts.max_power_hp} ch / ${ts.max_power_kw} kW` : 'N/A',
    torque: ts.max_torque_nm ? `${ts.max_torque_nm} Nm @ ${ts.max_torque_rpm} tr/min` : 'N/A',
    fuel_system: ts.throttle || 'Injection électronique',
    weight_tpf_kg: ts.kerb_weight_kg || '',
    tank_l: ts.fuel_tank_liters || '',
    license_bridging: ts.permitted_a2 ? 'A2 (bridable)' : 'A',
    cycle_parts: {
      frame: ts.frame || '',
      front_suspension: ts.front_suspension || '',
      rear_suspension: ts.rear_suspension || '',
      front_brake: ts.front_brake || '',
      rear_brake: ts.rear_brake || '',
      front_tire: ts.front_tire || '',
      rear_tire: ts.rear_tire || '',
    }
  };
}

function adaptKnownIssues(issues) {
  if (!issues || !Array.isArray(issues)) return [];
  return issues.map(issue => {
    if (typeof issue === 'string') return issue;
    // Convertir objet en string lisible
    return `${issue.issue || ''} — ${issue.description || ''} ${issue.remedy ? '→ ' + issue.remedy : ''}`.trim();
  });
}

async function migrateFiche(id) {
  const ref = db.collection('motorcycle_sheets').doc(id);
  const snap = await ref.get();
  if (!snap.exists) { console.log(`⚠️  ${id} introuvable`); return; }

  const data = snap.data();
  const ts = data.technical_sheet || {};
  const sg = data.service_guide || {};
  const variantsObj = data.variants || null;

  // Construire les variants en array
  const variantsArray = variantsObj ? adaptVariants(variantsObj, ts) : [];

  // known_issues en array de strings
  const knownIssuesStr = adaptKnownIssues(sg.known_issues || []);

  const patch = {
    // Variants : objet → array
    variants: variantsArray,

    // technical_sheet enrichi avec les champs attendus
    technical_sheet: adaptTechnicalSheet(ts),

    // Remonter known_issues et longevity_tips au niveau service_guide
    // en format string pour le composant
    service_guide: {
      ...sg,
      known_issues: knownIssuesStr,
      longevity_tips: sg.longevity_tips || [],
    },

    // Supprimer timestamps objet Firestore qui plante React
    timestamps: admin.firestore.FieldValue.delete(),

    // year_range simplifié
    year_range: ts.years ? ts.years.split(' ')[0].replace('présent', '+') : data.year_range || '',
  };

  await ref.set(patch, { merge: true });
  console.log(`✅  ${id} migré (${variantsArray.length} variants, ${knownIssuesStr.length} issues)`);
}

async function main() {
  console.log('🔧  Migration des fiches...\n');
  for (const id of NEW_FICHES) {
    await migrateFiche(id);
  }
  console.log('\n🎉  Migration terminée !');
}

main().catch(console.error).finally(() => process.exit());

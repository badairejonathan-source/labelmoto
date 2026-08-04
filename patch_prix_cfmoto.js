/**
 * patch_prix_cfmoto.js — LabelMoto
 * Met à jour les price_estimate dans service_guide.service_schedule
 * pour les fiches CFMOTO, basé sur le tableau fourni.
 * Usage : node patch_prix_cfmoto.js
 */

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

const PATCHES = {

  // 300NK
  'cfmoto-300nk-2020-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "90 – 140 €" },
    { km: 5000,  service_label: "Révision standard",     price_estimate: "110 – 170 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "110 – 170 €" },
    { km: 15000, service_label: "Révision majeure",      price_estimate: "140 – 220 €" },
    { km: 20000, service_label: "Révision standard",     price_estimate: "110 – 170 €" },
    { km: 30000, service_label: "Révision majeure",      price_estimate: "140 – 220 €" },
    { km: 40000, service_label: "Révision standard",     price_estimate: "110 – 170 €" },
    { km: 48000, service_label: "Révision majeure",      price_estimate: "140 – 220 €" },
  ],

  // 450MT
  'cfmoto-450mt-2024-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "110 – 180 €" },
    { km: 5000,  service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 15000, service_label: "Révision majeure",      price_estimate: "180 – 320 €" },
    { km: 20000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 25000, service_label: "Révision majeure",      price_estimate: "180 – 320 €" },
    { km: 30000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 40000, service_label: "Révision majeure",      price_estimate: "180 – 320 €" },
    { km: 48000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
  ],

  // 450NK
  'cfmoto-450nk-2023-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "110 – 180 €" },
    { km: 5000,  service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 15000, service_label: "Révision majeure",      price_estimate: "180 – 300 €" },
    { km: 20000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 25000, service_label: "Révision majeure",      price_estimate: "180 – 300 €" },
    { km: 30000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 40000, service_label: "Révision majeure",      price_estimate: "180 – 300 €" },
    { km: 48000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
  ],

  // 450SR
  'cfmoto-450sr-2023-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "110 – 180 €" },
    { km: 5000,  service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 15000, service_label: "Révision majeure",      price_estimate: "180 – 300 €" },
    { km: 20000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 30000, service_label: "Révision majeure",      price_estimate: "180 – 300 €" },
    { km: 40000, service_label: "Révision standard",     price_estimate: "140 – 220 €" },
    { km: 48000, service_label: "Révision majeure",      price_estimate: "180 – 300 €" },
  ],

  // 650MT / 650NK
  'cfmoto-650mt-650nk-2020-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "130 – 200 €" },
    { km: 5000,  service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 15000, service_label: "Révision majeure",      price_estimate: "220 – 360 €" },
    { km: 20000, service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 30000, service_label: "Révision majeure",      price_estimate: "220 – 360 €" },
    { km: 40000, service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 48000, service_label: "Révision majeure",      price_estimate: "220 – 360 €" },
  ],

  // 675SR-R
  'cfmoto-675sr-r-2025-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "130 – 200 €" },
    { km: 6000,  service_label: "Révision standard",     price_estimate: "170 – 280 €" },
    { km: 12000, service_label: "Révision standard",     price_estimate: "170 – 280 €" },
    { km: 18000, service_label: "Révision majeure",      price_estimate: "230 – 380 €" },
    { km: 24000, service_label: "Révision standard",     price_estimate: "170 – 280 €" },
    { km: 30000, service_label: "Révision majeure",      price_estimate: "230 – 380 €" },
    { km: 36000, service_label: "Révision standard",     price_estimate: "170 – 280 €" },
    { km: 48000, service_label: "Révision majeure",      price_estimate: "230 – 380 €" },
  ],

  // 700CL-X
  'cfmoto-700clx-2021-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "130 – 210 €" },
    { km: 5000,  service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 15000, service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 20000, service_label: "Révision majeure",      price_estimate: "220 – 360 €" },
    { km: 25000, service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 30000, service_label: "Révision majeure",      price_estimate: "220 – 360 €" },
    { km: 40000, service_label: "Révision standard",     price_estimate: "160 – 260 €" },
    { km: 48000, service_label: "Révision majeure",      price_estimate: "220 – 360 €" },
  ],

  // 700MT
  'cfmoto-700mt-2023-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "140 – 220 €" },
    { km: 5000,  service_label: "Révision standard",     price_estimate: "170 – 280 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "170 – 280 €" },
    { km: 15000, service_label: "Révision majeure",      price_estimate: "230 – 380 €" },
    { km: 20000, service_label: "Révision standard",     price_estimate: "170 – 280 €" },
    { km: 30000, service_label: "Révision majeure",      price_estimate: "230 – 380 €" },
    { km: 40000, service_label: "Révision standard",     price_estimate: "170 – 280 €" },
    { km: 48000, service_label: "Révision majeure",      price_estimate: "230 – 380 €" },
  ],

  // 800MT Sport/Explore
  'cfmoto-800mt-sport-explore-2023-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "150 – 240 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
    { km: 20000, service_label: "Révision majeure",      price_estimate: "250 – 420 €" },
    { km: 30000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
    { km: 40000, service_label: "Révision majeure",      price_estimate: "250 – 420 €" },
    { km: 48000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
  ],

  // 800MT Touring
  'cfmoto-800mt-touring-2025-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "160 – 240 €" },
    { km: 10000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
    { km: 20000, service_label: "Révision majeure",      price_estimate: "270 – 450 €" },
    { km: 30000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
    { km: 40000, service_label: "Révision majeure",      price_estimate: "270 – 450 €" },
    { km: 48000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
  ],

  // 800NK
  'cfmoto-800nk-2024-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",   price_estimate: "150 – 230 €" },
    { km: 6000,  service_label: "Révision standard",     price_estimate: "180 – 300 €" },
    { km: 12000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
    { km: 18000, service_label: "Révision majeure",      price_estimate: "250 – 420 €" },
    { km: 24000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
    { km: 30000, service_label: "Révision majeure",      price_estimate: "250 – 420 €" },
    { km: 36000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
    { km: 42000, service_label: "Révision majeure",      price_estimate: "250 – 420 €" },
    { km: 48000, service_label: "Révision standard",     price_estimate: "180 – 300 €" },
  ],
};

async function run() {
  console.log(`\n🔄 Patch prix révisions CFMOTO — ${Object.keys(PATCHES).length} fiches...\n`);
  let ok = 0, skip = 0;

  for (const [docId, schedule] of Object.entries(PATCHES)) {
    const ref = db.collection('motorcycle_sheets').doc(docId);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`⚠️  INTROUVABLE : ${docId}`);
      skip++;
      continue;
    }
    const data = snap.data();
    const serviceGuide = data.service_guide || {};
    serviceGuide.service_schedule = schedule;
    await ref.update({ service_guide: serviceGuide });
    console.log(`✅ ${docId} — ${schedule.length} entrées`);
    ok++;
  }

  console.log(`\n✅ ${ok} fiches mises à jour / ⚠️ ${skip} introuvables`);
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });

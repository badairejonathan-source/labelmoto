/**
 * patch_prix_benelli.js — LabelMoto
 * Met à jour les price_estimate dans service_guide.service_schedule
 * pour les fiches Benelli, basé sur le tableau fourni.
 * Usage : node patch_prix_benelli.js
 */

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

// Mapping docId → nouveau service_schedule avec price_estimate
const PATCHES = {

  // TNT 125 / BN 125
  'benelli-tnt125-2021-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "90 – 150 €" },
    { km: 4000,  service_label: "Révision basique",           price_estimate: "100 – 160 €" },
    { km: 7000,  service_label: "Révision générale",          price_estimate: "130 – 220 €" },
    { km: 10000, service_label: "Révision standard",          price_estimate: "100 – 170 €" },
    { km: 13000, service_label: "Révision suivante",          price_estimate: "130 – 220 €" },
    { km: 16000, service_label: "Révision standard",          price_estimate: "100 – 170 €" },
    { km: 19000, service_label: "Révision suivante",          price_estimate: "130 – 220 €" },
    { km: 22000, service_label: "Révision standard",          price_estimate: "100 – 170 €" },
    { km: 25000, service_label: "Révision suivante",          price_estimate: "130 – 220 €" },
    { km: 28000, service_label: "Révision standard",          price_estimate: "100 – 170 €" },
    { km: 40000, service_label: "Révision générale majeure",  price_estimate: "130 – 220 €" },
  ],

  // Leoncino 125 (même moteur que TNT 125)
  'benelli-leoncino125-2022-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "90 – 150 €" },
    { km: 4000,  service_label: "Révision basique",           price_estimate: "100 – 160 €" },
    { km: 7000,  service_label: "Révision générale",          price_estimate: "130 – 220 €" },
    { km: 10000, service_label: "Révision standard",          price_estimate: "100 – 170 €" },
    { km: 20000, service_label: "Révision générale",          price_estimate: "130 – 220 €" },
    { km: 40000, service_label: "Révision majeure",           price_estimate: "130 – 220 €" },
  ],

  // Leoncino 500 / Trail
  'benelli-leoncino500-2019-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "120 – 180 €" },
    { km: 6000,  service_label: "Révision standard",          price_estimate: "150 – 230 €" },
    { km: 12000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
    { km: 18000, service_label: "Révision majeure",           price_estimate: "250 – 400 €" },
    { km: 24000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
    { km: 30000, service_label: "Révision majeure",           price_estimate: "250 – 400 €" },
    { km: 36000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
    { km: 42000, service_label: "Révision majeure",           price_estimate: "250 – 400 €" },
    { km: 48000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
  ],

  // TRK 502 / X
  'benelli-trk502-502x-2019-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "110 – 180 €" },
    { km: 6000,  service_label: "Révision standard",          price_estimate: "140 – 220 €" },
    { km: 12000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
    { km: 18000, service_label: "Révision majeure",           price_estimate: "250 – 400 €" },
    { km: 24000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
    { km: 30000, service_label: "Révision majeure",           price_estimate: "250 – 400 €" },
    { km: 36000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
    { km: 42000, service_label: "Révision majeure",           price_estimate: "250 – 400 €" },
    { km: 48000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
  ],

  // TRK 702 / X
  'benelli-trk702-702x-2023-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "150 – 230 €" },
    { km: 7000,  service_label: "Révision basique",           price_estimate: "170 – 290 €" },
    { km: 13000, service_label: "Révision générale",          price_estimate: "320 – 530 €" },
    { km: 19000, service_label: "Révision suivante",          price_estimate: "170 – 290 €" },
    { km: 25000, service_label: "Révision suivante",          price_estimate: "320 – 530 €" },
    { km: 31000, service_label: "Révision suivante",          price_estimate: "170 – 290 €" },
    { km: 37000, service_label: "Révision suivante",          price_estimate: "320 – 530 €" },
    { km: 43000, service_label: "Révision suivante",          price_estimate: "170 – 290 €" },
  ],

  // 502C
  'benelli-502c-2021-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "120 – 190 €" },
    { km: 6000,  service_label: "Révision standard",          price_estimate: "150 – 230 €" },
    { km: 12000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
    { km: 18000, service_label: "Révision majeure",           price_estimate: "250 – 400 €" },
    { km: 24000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
    { km: 30000, service_label: "Révision majeure",           price_estimate: "250 – 400 €" },
    { km: 36000, service_label: "Révision standard",          price_estimate: "170 – 280 €" },
  ],

  // 752S
  'benelli-752s-2022-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "150 – 230 €" },
    { km: 6000,  service_label: "Révision standard",          price_estimate: "180 – 280 €" },
    { km: 12000, service_label: "Révision standard",          price_estimate: "200 – 320 €" },
    { km: 18000, service_label: "Révision majeure",           price_estimate: "320 – 500 €" },
    { km: 24000, service_label: "Révision standard",          price_estimate: "200 – 320 €" },
    { km: 30000, service_label: "Révision majeure",           price_estimate: "320 – 500 €" },
    { km: 36000, service_label: "Révision standard",          price_estimate: "200 – 320 €" },
  ],

  // Leoncino 800 / Trail
  'benelli-leoncino800-2022-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "150 – 230 €" },
    { km: 6000,  service_label: "Révision standard",          price_estimate: "180 – 280 €" },
    { km: 12000, service_label: "Révision standard",          price_estimate: "200 – 320 €" },
    { km: 18000, service_label: "Révision majeure",           price_estimate: "320 – 500 €" },
    { km: 24000, service_label: "Révision standard",          price_estimate: "200 – 320 €" },
    { km: 30000, service_label: "Révision majeure",           price_estimate: "320 – 500 €" },
    { km: 36000, service_label: "Révision standard",          price_estimate: "200 – 320 €" },
  ],

  // Imperiale 400
  'benelli-imperiale400-2019-plus': [
    { km: 1000,  service_label: "Révision 1 (rodage)",        price_estimate: "90 – 150 €" },
    { km: 5000,  service_label: "Révision standard",          price_estimate: "100 – 160 €" },
    { km: 10000, service_label: "Révision standard",          price_estimate: "100 – 170 €" },
    { km: 15000, service_label: "Révision générale",          price_estimate: "130 – 220 €" },
    { km: 20000, service_label: "Révision majeure",           price_estimate: "200 – 350 €" },
  ],
};

async function run() {
  console.log(`\n🔄 Patch prix révisions Benelli — ${Object.keys(PATCHES).length} fiches...\n`);
  let ok = 0, skip = 0;

  for (const [docId, schedule] of Object.entries(PATCHES)) {
    const ref = db.collection('motorcycle_sheets').doc(docId);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`⚠️  INTROUVABLE : ${docId}`);
      skip++;
      continue;
    }
    // On met à jour service_guide.service_schedule
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

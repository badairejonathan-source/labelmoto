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

async function main() {
  console.log('🔧  Correction du champ type...\n');
  for (const id of NEW_FICHES) {
    const ref = db.collection('motorcycle_sheets').doc(id);
    await ref.set({ type: 'motorcycle_service_sheet' }, { merge: true });
    console.log(`✅  ${id}`);
  }
  console.log('\n🎉  Correction terminée !');
}

main().catch(console.error).finally(() => process.exit());

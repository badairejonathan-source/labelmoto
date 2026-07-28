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
  console.log('🔧  Passage à featured: true...\n');
  for (const id of NEW_FICHES) {
    await db.collection('motorcycle_sheets').doc(id).set({ featured: true }, { merge: true });
    console.log(`✅  ${id}`);
  }
  console.log('\n🎉  Done !');
}

main().catch(console.error).finally(() => process.exit());

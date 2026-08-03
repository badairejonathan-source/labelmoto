const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'studio-4801889514-40ebd',
});
const db = admin.firestore();

const SEARCH = ['leoncino', 'xsr', 'mt07', 'mt-07', 'mt03', 'mt-03', 'cb650', 'benelli-tnt'];

async function main() {
  const snap = await db.collection('motorcycle_sheets').get();
  const ids = snap.docs.map(d => d.id);
  for (const term of SEARCH) {
    const matches = ids.filter(id => id.includes(term));
    console.log(`\n[${term}] :`, matches.length ? matches : 'RIEN');
  }
  process.exit(0);
}
main().catch(console.error);

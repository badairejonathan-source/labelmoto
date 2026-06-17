const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'studio-4801889514-40ebd',
  });
}
const db = admin.firestore();
function extractDepartement(address) {
  if (!address || typeof address !== 'string') return null;
  const match = address.match(/\b(\d{5})\b/);
  if (!match) return null;
  const cp = match[1];
  if (['971','972','973','974','976'].includes(cp.substring(0,3))) return cp.substring(0,3);
  if (cp.startsWith('200') || cp.startsWith('201')) return '2A';
  if (['202','203','204','205'].some(p => cp.startsWith(p))) return '2B';
  return cp.substring(0,2);
}
async function migrateCollection(name) {
  console.log('\n📦 ' + name);
  const snap = await db.collection(name).get();
  if (snap.empty) { console.log('   (vide)'); return { updated:0, skipped:0, missing:0 }; }
  console.log('   ' + snap.size + ' documents');
  let updated = 0, skipped = 0, missing = 0;
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += 400) {
    const batch = db.batch();
    for (const doc of docs.slice(i, i + 400)) {
      const d = doc.data();
      if (d.departement && typeof d.departement === 'string' && d.departement !== '00') { skipped++; continue; }
      const dept = extractDepartement(d.address);
      batch.update(doc.ref, { departement: dept || '00' });
      dept ? updated++ : missing++;
    }
    await batch.commit();
    process.stdout.write('   lot ' + (Math.ceil((i+1)/400)) + '/' + Math.ceil(docs.length/400) + ' commité\r');
  }
  console.log('   OK: ' + updated + ' mis à jour | ' + skipped + ' déjà OK | ' + missing + ' sans CP');
  return { updated, skipped, missing };
}
async function main() {
  console.log('🚀 Migration departement — LabelMoto');
  const cols = ['concessions','associations','relais','creators'];
  let total = { updated:0, skipped:0, missing:0 };
  for (const c of cols) {
    const r = await migrateCollection(c);
    total.updated += r.updated; total.skipped += r.skipped; total.missing += r.missing;
  }
  console.log('\n--- Résultat final ---');
  console.log('Mis à jour  : ' + total.updated);
  console.log('Déjà OK     : ' + total.skipped);
  console.log('Sans CP     : ' + total.missing);
  process.exit(0);
}
main().catch(e => { console.error('Erreur:', e.message); process.exit(1); });

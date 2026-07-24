const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

function extractVille(address) {
  const parts = (address || '').split(',').map(s => s.trim());
  const cpIdx = parts.findIndex(p => /\d{5}/.test(p));
  if (cpIdx !== -1) {
    const match = parts[cpIdx].match(/\d{5}\s*(.*)/);
    return match ? match[1].trim() : (parts[cpIdx + 1] || '');
  }
  return parts[parts.length - 2] || '';
}

function buildDescription(data) {
  const shortName = (data.title || '').split(/\s*[-\/|]\s*/)[0].trim() || data.title;
  const ville = extractVille(data.address);
  const brands = (data.brands || []).filter(Boolean).slice(0, 4);
  const cat = data.category || 'professionnel moto';
  const hasPhone = !!data.phoneNumber;
  const hasWeb = !!data.website;

  let desc = '';

  if (brands.length >= 2) {
    desc = `${shortName}${ville ? ' à ' + ville : ''} — concessionnaire ${brands.slice(0, 3).join(', ')}${brands.length > 3 ? ' et plus' : ''}. `;
  } else if (brands.length === 1) {
    desc = `${shortName}${ville ? ' à ' + ville : ''} — concessionnaire ${brands[0]}. `;
  } else {
    desc = `${shortName}${ville ? ' à ' + ville : ''} — ${cat.toLowerCase()}. `;
  }

  if (hasPhone && hasWeb) {
    desc += `Horaires, avis clients, téléphone et accès au site officiel sur LabelMoto.`;
  } else if (hasPhone) {
    desc += `Horaires d'ouverture, avis clients et contact direct sur LabelMoto.`;
  } else {
    desc += `Horaires, adresse et avis clients sur LabelMoto.`;
  }

  return desc.slice(0, 155);
}

async function run() {
  const snap = await db.collection('concessions').get();
  let updated = 0, skipped = 0;
  const batches = [];
  let batch = db.batch();
  let batchCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const info = data.info || '';
    const isGeneric = info.length < 20
      || info.includes('sur LabelMoto')
      || info.includes('professionnel moto')
      || info.includes('Retrouvez motos');

    if (isGeneric) {
      const newDesc = buildDescription(data);
      batch.update(doc.ref, { info: newDesc });
      batchCount++;
      updated++;

      if (batchCount === 400) {
        batches.push(batch);
        batch = db.batch();
        batchCount = 0;
      }
    } else {
      skipped++;
    }
  }

  if (batchCount > 0) batches.push(batch);

  console.log(`A mettre a jour: ${updated}, A garder: ${skipped}`);
  console.log(`Batches: ${batches.length}`);

  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    console.log(`Batch ${i + 1}/${batches.length} commite`);
  }

  console.log('Termine.');
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });

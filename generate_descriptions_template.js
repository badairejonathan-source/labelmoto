const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

function extractCity(address) {
  const match = (address || '').match(/\d{5}\s*([\w\s\-']+)/);
  return match ? match[1].trim() : '';
}

function generateDescription(data) {
  const city = extractCity(data.address || '');
  const name = (data.title || '').split(/\s*[-\/|]\s*/)[0].trim();
  const brands = (data.brands || []).filter(b =>
    !['Dafy Moto','Moto Axxe','Speedway',"Doc'Biker",'TeamAxe','Cardy'].includes(b)
  );
  const brandStr = brands.length ? brands.slice(0, 3).join(', ') : '';
  const cityStr = city ? ` à ${city}` : '';
  const section = data.appSection;

  if (section === 'association') {
    return `${name} est une association moto${cityStr} qui rassemble les passionnés de deux-roues de la région. Sorties, événements et convivialité sont au cœur de leurs activités. Rejoignez une communauté de motards partageant la même passion.`;
  }

  if (section === 'relais') {
    return `${name}${cityStr} est un point relais moto référencé sur LabelMoto. Retrouvez toutes les informations pratiques : adresse, horaires et contact direct pour planifier votre itinéraire.`;
  }

  if (section === 'service' || (data.category || '').toLowerCase().includes('atelier') || (data.category || '').toLowerCase().includes('réparat')) {
    return `${name} est votre atelier moto${cityStr}. Entretien, révision et réparation pour toutes marques de motos et scooters. Notre équipe de techniciens qualifiés prend soin de votre deux-roues avec rigueur et professionnalisme. Devis gratuit sur rendez-vous.`;
  }

  // Concessionnaire
  if (brandStr) {
    return `${name} est votre concessionnaire${cityStr}, spécialisé dans la distribution de motos ${brandStr}. Retrouvez notre gamme de motos neuves et occasions, ainsi qu'une large sélection d'équipements et d'accessoires. Notre atelier assure l'entretien et la réparation de vos deux-roues.`;
  }

  return `${name} est un professionnel moto${cityStr} référencé sur LabelMoto. Retrouvez motos, scooters, équipements et accessoires. Notre équipe vous accompagne dans tous vos projets moto avec expertise et passion.`;
}

async function main() {
  console.log('Chargement des fiches...');
  const cols = ['concessions', 'associations', 'relais'];
  let total = 0, updated = 0;

  for (const col of cols) {
    const snap = await db.collection(col).get();
    let batch = db.batch();
    let batchCount = 0;

    for (const doc of snap.docs) {
      const data = doc.data();
      if (data.info || data.description) continue; // Déjà une description

      const desc = generateDescription({ ...data, appSection: data.appSection || (col === 'associations' ? 'association' : col === 'relais' ? 'relais' : 'shopping') });
      batch.update(doc.ref, { info: desc });
      batchCount++;
      updated++;

      if (batchCount === 400) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
        process.stdout.write('.');
      }
    }

    if (batchCount > 0) await batch.commit();
    total += snap.size;
    console.log(`\n${col}: ${snap.docs.filter(d => !d.data().info && !d.data().description).length} fiches traitées`);
  }

  console.log(`\n✅ ${updated} descriptions générées sur ${total} fiches total`);
}

main().catch(console.error).finally(() => process.exit());

const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

const LEADS = [
  { slug: 'kawasaki-saint-etienne-premiere-avenue', nom: 'Kawasaki Saint-Étienne', tel: '+33 4 77 47 28 28', email: 'contact@kawasakisaintetienne.fr', impressions: 176, clics: 2, position: 7.5, pays: 'FR' },
  { slug: 'royal-enfield-lille', nom: 'Royal Enfield Lille', tel: '+33 3 74 95 83 20', email: '', impressions: 117, clics: 0, position: 9.9, pays: 'FR' },
  { slug: 'dafy-moto-saint-brice-sous-foret', nom: 'DAFY MOTO Saint-Brice-sous-Forêt', tel: '+33 1 39 35 75 26', email: '', impressions: 104, clics: 0, position: 10.7, pays: 'FR' },
  { slug: 'mobbie', nom: 'Mobbie', tel: '+33 2 31 35 48 55', email: '', impressions: 101, clics: 0, position: 9.0, pays: 'FR' },
  { slug: 'speedway-herblay', nom: 'SPEEDWAY Herblay', tel: '01 34 32 06 09', email: 'boutiqueherblay@speedway.fr', impressions: 100, clics: 0, position: 10.4, pays: 'FR' },
  { slug: 'dafy-moto-livry-gargan', nom: 'DAFY MOTO Livry-Gargan', tel: '01 80 89 22 83', email: '', impressions: 90, clics: 0, position: 5.8, pays: 'FR' },
  { slug: 'horizon-ride-bmw-motorrad-saint-maximin', nom: 'Horizon Ride BMW Motorrad Saint-Maximin', tel: '+33 3 44 25 09 55', email: 'contact@horizonride.fr', impressions: 84, clics: 0, position: 8.0, pays: 'FR' },
  { slug: 'ride-avenue-frejus', nom: 'RIDE AVENUE Fréjus', tel: '+33 4 94 51 47 13', email: '', impressions: 81, clics: 0, position: 9.4, pays: 'FR' },
  { slug: 'moto-repere-angers', nom: 'Moto Repère Angers', tel: '+33 2 41 69 15 28', email: '', impressions: 78, clics: 0, position: 8.5, pays: 'FR' },
  { slug: 'kd-quad-concessionnaire-can-am-cf-moto-kymco', nom: 'KD QUAD Manage', tel: '+32 64 70 09 70', email: '', impressions: 77, clics: 0, position: 7.5, pays: 'BE' },
  { slug: 'jm-motors-anglet', nom: 'JM Motors Anglet', tel: '+33 6 61 64 19 75', email: 'contact@jmmotors.fr', impressions: 75, clics: 0, position: 7.5, pays: 'FR' },
  { slug: 'bmw-helice-69-lyon-sud-motown', nom: 'BMW Hélice 69 Lyon-Sud', tel: '+33 4 78 95 21 87', email: 'contact@bmw-motorrad-helicemotos.com', impressions: 75, clics: 0, position: 9.3, pays: 'FR' },
  { slug: 'holeshot-racing-concessionnaire-yamaha-motos-scooters-et-quads-ssv-saint-omer', nom: 'Holeshot Racing Yamaha Saint-Omer', tel: '03 21 12 70 79', email: 'contact.yamaha62500@gmail.com', impressions: 72, clics: 0, position: 7.4, pays: 'FR' },
  { slug: 'ducati-montpellier', nom: 'DUCATI Montpellier', tel: '+33 4 11 95 12 80', email: 'contact@ducati-store-montpellier.com', impressions: 71, clics: 0, position: 9.4, pays: 'FR' },
  { slug: 'becane-n6', nom: 'BECANE N6', tel: '+33 6 64 53 79 73', email: '', impressions: 65, clics: 0, position: 5.4, pays: 'FR' },
  { slug: 'triumph-orleans', nom: 'Triumph Orléans', tel: '+33 2 38 64 94 23', email: 'contact@triumph-orleans.fr', impressions: 57, clics: 0, position: 8.3, pays: 'FR' },
  { slug: 'rad-tournai', nom: 'RAD Tournai', tel: '+32 69 60 89 02', email: '', impressions: 644, clics: 0, position: 9.3, pays: 'BE' },
];

async function main() {
  const batch = db.batch();

  for (const lead of LEADS) {
    const ref = db.collection('prospection').doc(lead.slug);
    const existing = await ref.get();

    if (!existing.exists) {
      batch.set(ref, {
        ...lead,
        status: 'a_contacter',
        notes: '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Ajouté : ${lead.nom}`);
    } else {
      // Mettre à jour uniquement les métriques GSC, pas le statut/notes
      batch.update(ref, {
        impressions: lead.impressions,
        clics: lead.clics,
        position: lead.position,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`🔄 Mis à jour : ${lead.nom}`);
    }
  }

  await batch.commit();
  console.log(`\n✅ ${LEADS.length} leads initialisés dans Firestore collection 'prospection'`);
}

main().catch(console.error).finally(() => process.exit());

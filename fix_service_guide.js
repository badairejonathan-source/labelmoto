const fs = require('fs');
const path = require('path');

const dataFolder = path.join(__dirname, 'data');
const files = fs.readdirSync(dataFolder).filter(f => f.endsWith('.json'));

const serviceGuideFields = [
  'intro', 'conclusion', 'service_schedule', 'consumables',
  'known_issues', 'longevity_tips', 'faq',
  'garage_cta_title', 'garage_cta_text', 'garage_cta_button',
  'compare_cta_text', 'compare_cta_button',
  'concession_cta_title', 'concession_cta_text', 'concession_cta_button'
];

let fixed = 0;

for (const file of files) {
  const filePath = path.join(dataFolder, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.log(`❌ JSON invalide : ${file} — ${e.message}`);
    continue;
  }

  // Si service_guide existe déjà et est complet, on skip
  if (data.service_guide && data.service_guide.service_schedule) {
    console.log(`⏭️  Déjà correct : ${file}`);
    continue;
  }

  // Construire service_guide depuis les champs racine
  const service_guide = {};
  for (const field of serviceGuideFields) {
    if (data[field] !== undefined) {
      service_guide[field] = data[field];
      delete data[field];
    }
  }

  // Fusionner avec service_guide existant si partiel
  if (data.service_guide) {
    data.service_guide = { ...data.service_guide, ...service_guide };
  } else {
    data.service_guide = service_guide;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Corrigé : ${file}`);
  fixed++;
}

console.log(`\n🏁 ${fixed} fichier(s) corrigé(s) sur ${files.length}`);

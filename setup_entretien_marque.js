const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/app/entretien/[marque]');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log('✅ Dossier src/app/entretien/[marque]/ créé');
} else {
  console.log('ℹ️  Dossier déjà existant');
}
console.log('Dépose maintenant entretien-marque-page.tsx → src/app/entretien/[marque]/page.tsx');

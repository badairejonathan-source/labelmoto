const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/app/garage-moto');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log('✅ Dossier src/app/garage-moto/ créé');
} else {
  console.log('ℹ️  Dossier déjà existant');
}
console.log('✅ Prêt — dépose maintenant garage-moto-page.tsx dans src/app/garage-moto/ en le renommant page.tsx');

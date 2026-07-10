const fs = require('fs');
const path = require('path');

// 1. Ajouter country?: string dans types.ts
const typesPath = path.join(process.cwd(), 'src/lib/types.ts');
let types = fs.readFileSync(typesPath, 'utf8');

const oldType = `  isClaimed?: boolean;`;
const newType = `  isClaimed?: boolean;
  country?: string;`;

if (!types.includes(oldType)) {
  console.error('❌ Champ isClaimed introuvable dans types.ts');
  process.exit(1);
}
if (types.includes('country?: string')) {
  console.log('ℹ️  country déjà présent dans types.ts');
} else {
  types = types.replace(oldType, newType);
  fs.writeFileSync(typesPath, types, 'utf8');
  console.log('✅ country?: string ajouté dans types.ts');
}

// 2. Créer le dossier src/app/lib/ si nécessaire (déjà existant)
// 3. Créer le dossier src/app/pros-moto/[pays]/
const dir = path.join(process.cwd(), 'src/app/pros-moto/[pays]');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log('✅ Dossier src/app/pros-moto/[pays]/ créé');
} else {
  console.log('ℹ️  Dossier déjà existant');
}

console.log('\n✅ Tout est prêt — dépose maintenant :');
console.log('  • countries.ts → src/app/lib/countries.ts');
console.log('  • pays-page.tsx → src/app/pros-moto/[pays]/page.tsx');

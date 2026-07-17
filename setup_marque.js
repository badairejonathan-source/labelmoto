const fs = require('fs');
const path = require('path');

// 1. Créer le dossier src/app/marque/[marque]/
const dir = path.join(process.cwd(), 'src/app/marque/[marque]');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log('✅ Dossier src/app/marque/[marque]/ créé');
} else {
  console.log('ℹ️  Dossier déjà existant');
}

// 2. Ajouter brands?: string[] dans types.ts
const typesPath = path.join(process.cwd(), 'src/lib/types.ts');
let types = fs.readFileSync(typesPath, 'utf8');
if (!types.includes('brands?')) {
  const oldField = '  country?: string;';
  const newField = '  country?: string;\n  brands?: string[];';
  if (types.includes(oldField)) {
    types = types.replace(oldField, newField);
    fs.writeFileSync(typesPath, types, 'utf8');
    console.log('✅ brands?: string[] ajouté dans types.ts');
  }
} else {
  console.log('ℹ️  brands déjà dans types.ts');
}

console.log('\n✅ Prêt — dépose maintenant :');
console.log('  • brands.ts → src/app/lib/brands.ts');
console.log('  • marque-page.tsx → src/app/marque/[marque]/page.tsx');

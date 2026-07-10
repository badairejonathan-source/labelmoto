const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/lib/cities.ts');
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = `      { q: 'Y a-t-il des garages moto près de l'île de Ré ?', a: "Oui, plusieurs garages proches de La Rochelle assurent l'entretien pour les motards qui souhaitent explorer l'île de Ré et le littoral charentais." },`;

const newStr = `      { q: "Y a-t-il des garages moto près de l'île de Ré ?", a: "Oui, plusieurs garages proches de La Rochelle assurent l'entretien pour les motards qui souhaitent explorer l'île de Ré et le littoral charentais." },`;

if (!content.includes(oldStr)) {
  console.error('❌ Ligne introuvable');
  process.exit(1);
}

content = content.replace(oldStr, newStr);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Apostrophe corrigée dans la FAQ La Rochelle');

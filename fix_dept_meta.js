const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/garages-moto/departement/[dept]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ajouter la fonction getCountForDepartment juste avant getProsForDepartment
const oldFn = `async function getProsForDepartment(code: string): Promise<Pro[]> {`;
const newFn = `async function getCountForDepartment(code: string): Promise<number> {
  try {
    const db = getAdminFirestore();
    const cols = ['concessions', 'associations', 'relais'] as const;
    let total = 0;
    for (const col of cols) {
      const snap = await db.collection(col).where('departement', '==', code).count().get();
      total += snap.data().count;
    }
    return total;
  } catch {
    return 0;
  }
}

async function getProsForDepartment(code: string): Promise<Pro[]> {`;

if (!content.includes(oldFn)) {
  console.error('❌ Fonction getProsForDepartment introuvable');
  process.exit(1);
}
content = content.replace(oldFn, newFn);

// 2. Modifier generateMetadata pour injecter le count dans title et description
const oldMeta = `  const title = \`Garage moto \${department.name} (\${department.code}) — Concessions & ateliers | LabelMoto\`;
  const description = \`Trouvez votre garage moto dans le \${department.name} (\${department.code}) : concessions, ateliers et réparateurs référencés par LabelMoto. Avis, horaires et contacts directs.\`;`;

const newMeta = `  const count = await getCountForDepartment(department.code);
  const countLabel = count > 0 ? \`\${count} adresses\` : 'nos adresses';
  const title = \`Garages moto \${department.name} (\${department.code}) : \${countLabel} vérifiées | LabelMoto\`;
  const description = \`Trouvez votre garage moto dans le \${department.name} (\${department.code}) parmi \${count > 0 ? count + ' professionnels référencés' : 'nos professionnels'} : concessions, ateliers et relais motards. Avis, horaires et contacts sur LabelMoto.\`;`;

if (!content.includes(oldMeta)) {
  console.error('❌ Bloc title/description introuvable dans generateMetadata');
  process.exit(1);
}
content = content.replace(oldMeta, newMeta);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Pages département — titles dynamiques avec count injectés');

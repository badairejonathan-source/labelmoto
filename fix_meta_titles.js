const fs = require('fs');
const path = require('path');

// ─── 1. Améliorer generateMetadata dans page.tsx ──────────────────────────────
const pagePath = path.join(process.cwd(), 'src/app/concessions/[id]/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

const oldTitle = `  const brandsStr = pro.brands?.length ? ' — ' + pro.brands.join(', ') : '';
  const title = \`\${pro.title}\${ville ? ' à ' + ville : ''}\${brandsStr} — Avis, horaires & contact | LabelMoto\`;
  const description = \`\${pro.title}\${ville ? ' à ' + ville : ''} : avis, horaires d'ouverture, téléphone et adresse. Contactez ce professionnel moto direc
tement sur LabelMoto, l'annuaire moto de référence.\`;`;

// Si le pattern exact n'est pas trouvé, chercher par parties
const hasBrandsStr = page.includes("const brandsStr = pro.brands?.length ? ' — '");
const hasTitleLine = page.includes("Avis, horaires & contact | LabelMoto");

if (hasBrandsStr && hasTitleLine) {
  // Remplacer le bloc title
  const brandsIdx = page.indexOf("  const brandsStr = pro.brands?.length");
  const afterDesc = page.indexOf("  return {", brandsIdx);
  const oldBlock = page.slice(brandsIdx, afterDesc);
  
  const newBlock = `  // Meta title propre : extraire le nom court avant le premier tiret/pipe
  const shortName = pro.title.split(/\\s*[\\-\\/\\|]\\s*/)[0].trim();
  const villeInName = shortName.toLowerCase().includes((ville || '').toLowerCase());
  const typeLabel = pro.appSection === 'service' ? 'Atelier moto' : pro.appSection === 'association' ? 'Club moto' : 'Concessionnaire moto';
  const title = \`\${shortName}\${ville && !villeInName ? ' à ' + ville : ''} — \${typeLabel} | LabelMoto\`.slice(0, 65);
  const description = pro.info
    ? pro.info.slice(0, 155) + (pro.info.length > 155 ? '...' : '')
    : \`\${shortName}\${ville ? ' à ' + ville : ''} : horaires, téléphone et adresse. Concessionnaire moto référencé sur LabelMoto.\`;

  `;
  
  page = page.slice(0, brandsIdx) + newBlock + page.slice(afterDesc);
  fs.writeFileSync(pagePath, page, 'utf8');
  console.log('✅ generateMetadata amélioré — titles propres < 65 chars');
} else {
  console.warn('⚠️  Pattern title introuvable — vérification manuelle');
}

// ─── 2. Ajouter description à Dafy Moto Sarreguemines ────────────────────────
const admin = require('./node_modules/firebase-admin');
admin.initializeApp({ projectId: 'studio-4801889514-40ebd' });
const db = admin.firestore();

async function updateFiches() {
  // Dafy Moto Sarreguemines
  const dafySnap = await db.collection('concessions')
    .where('slug', '==', 'dafy-moto-sarreguemines-concessionnaire-cfmoto-zontes-goes-rieju-sherco-imf')
    .limit(1).get();
  
  if (!dafySnap.empty) {
    await dafySnap.docs[0].ref.update({
      info: `Dafy Moto Sarreguemines est votre spécialiste moto dans l'agglomération de Sarreguemines (Moselle). Concessionnaire officiel CF Moto, Zontes, Rieju et Sherco, notre magasin propose également une large gamme d'équipements et d'accessoires moto (casques, blousons, protections). Atelier multimarques sur place pour l'entretien et la réparation de toutes vos motos.`
    });
    console.log('✅ Description ajoutée à Dafy Moto Sarreguemines');
  }
}

updateFiches().catch(console.error).finally(() => process.exit());

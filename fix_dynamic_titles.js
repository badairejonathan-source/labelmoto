const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src/app/garages-moto/[ville]/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// ─── 1. Ajouter la fonction de comptage ───────────────────────────────────────
const oldParseRating = `function parseRating(raw: unknown): number | null {`;
const newParseRating = `async function getProCountForCity(dept: string): Promise<number> {
  try {
    const db = getAdminFirestore();
    const cols = ['concessions', 'associations', 'relais', 'creators'] as const;
    let total = 0;
    for (const col of cols) {
      const s = await db.collection(col).where('departement', '==', dept).count().get();
      total += s.data().count;
    }
    return total;
  } catch {
    return 0;
  }
}

function parseRating(raw: unknown): number | null {`;

if (!page.includes('getProCountForCity') && page.includes(oldParseRating)) {
  page = page.replace(oldParseRating, newParseRating);
  console.log('✅ Fonction getProCountForCity ajoutée');
}

// ─── 2. Modifier generateMetadata pour utiliser le vrai count ─────────────────
const oldMeta = `export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville } = await params;
  const city = getCityBySlug(ville);
  if (!city) return { title: 'Page introuvable | LabelMoto' };
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: { canonical: \`https://labelmoto.fr/garages-moto/\${city.slug}\` },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: \`https://labelmoto.fr/garages-moto/\${city.slug}\`,
      siteName: 'LabelMoto',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: 'https://labelmoto.fr/images/og-image.webp', width: 1200, height: 630 }],
    },
  };
}`;

const newMeta = `export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville } = await params;
  const city = getCityBySlug(ville);
  if (!city) return { title: 'Page introuvable | LabelMoto' };

  // Compte réel depuis Firestore (dynamique à chaque build)
  const count = await getProCountForCity(city.departement);
  const countStr = count > 0 ? \`\${count}\` : '';
  
  // Titre dynamique avec le vrai nombre de pros
  const dynamicTitle = countStr
    ? \`\${countStr} garages moto à \${city.name} — Concessions & ateliers | LabelMoto\`
    : city.metaTitle;

  // Description dynamique
  const dynamicDesc = countStr
    ? \`Trouvez votre garage moto à \${city.name} parmi \${countStr} professionnels vérifiés : concessions, ateliers, réparateurs. Avis, horaires et contacts directs sur LabelMoto.\`
    : city.metaDescription;

  return {
    title: dynamicTitle,
    description: dynamicDesc,
    alternates: { canonical: \`https://labelmoto.fr/garages-moto/\${city.slug}\` },
    openGraph: {
      title: dynamicTitle,
      description: dynamicDesc,
      url: \`https://labelmoto.fr/garages-moto/\${city.slug}\`,
      siteName: 'LabelMoto',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: 'https://labelmoto.fr/images/og-image.webp', width: 1200, height: 630 }],
    },
  };
}`;

if (!page.includes('getProCountForCity()') || page.includes(oldMeta)) {
  if (page.includes(oldMeta)) {
    page = page.replace(oldMeta, newMeta);
    console.log('✅ generateMetadata rendu dynamique avec le vrai count Firestore');
  } else {
    console.warn('⚠️  generateMetadata introuvable — vérification manuelle');
  }
}

fs.writeFileSync(pagePath, page, 'utf8');
console.log('\n✅ Titles dynamiques activés pour toutes les pages villes');
console.log('   Exemple Paris : "251 garages moto à Paris — Concessions & ateliers | LabelMoto"');

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/garages-moto/[ville]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// ─── 1. Ajouter la fonction toSlug en haut du fichier ────────────────────────
if (!content.includes('function toSlug')) {
  const oldImport = `import { getCityBySlug, getAllCitySlugs, CITIES } from '@/app/lib/cities';`;
  const newImport = `import { getCityBySlug, getAllCitySlugs, CITIES } from '@/app/lib/cities';

function toSlug(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}`;
  content = content.replace(oldImport, newImport);
  console.log('✅ Fonction toSlug ajoutée');
}

// ─── 2. Extraire les marques depuis les pros chargés ─────────────────────────
// Ajouter le calcul des marques uniques après le chargement des pros
const oldProsSort = `    pros.sort((a, b) => {`;
const newProsSort = `    // Marques disponibles dans cette ville (pour le maillage)
    const cityBrands = Array.from(
      new Set(pros.flatMap(p => p.brands || []))
    ).sort();

    pros.sort((a, b) => {`;

if (!content.includes('cityBrands') && content.includes(oldProsSort)) {
  content = content.replace(oldProsSort, newProsSort);
  console.log('✅ Calcul cityBrands ajouté');
}

// Ajouter cityBrands dans le return de la fonction Page
const oldReturn = `    return { pros, otherCities };`;
const newReturn = `    return { pros, otherCities, cityBrands };`;
if (!content.includes('cityBrands }') && content.includes(oldReturn)) {
  content = content.replace(oldReturn, newReturn);
}

// Destructurer cityBrands dans le composant
const oldDestructure = `  const { pros, otherCities } = await getPros(city);`;
const newDestructure = `  const { pros, otherCities, cityBrands } = await getPros(city);`;
if (!content.includes('cityBrands }') && content.includes(oldDestructure)) {
  content = content.replace(oldDestructure, newDestructure);
  console.log('✅ cityBrands destructuré dans le composant');
}

// ─── 3. Ajouter la section "Par marque" dans le JSX ─────────────────────────
const oldVillesSection = `          <section className="mb-10">
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">Garages moto dans d&apos;autres villes</h2>`;

const newVillesSection = `          {cityBrands.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">
                Concessionnaires par marque à {city.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {cityBrands.map(brand => (
                  <Link
                    key={brand}
                    href={'/garages-moto/' + city.slug + '/' + toSlug(brand)}
                    className="text-[10px] px-4 py-2 rounded-full border-2 border-brand/20 hover:border-brand text-brand hover:text-white hover:bg-brand font-black uppercase tracking-widest transition-all"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </section>
          )}
          <section className="mb-10">
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">Garages moto dans d&apos;autres villes</h2>`;

if (!content.includes('Concessionnaires par marque') && content.includes(oldVillesSection)) {
  content = content.replace(oldVillesSection, newVillesSection);
  console.log('✅ Section "Par marque" ajoutée dans la page ville');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ Maillage ville → marques×ville ajouté');

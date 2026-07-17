const fs = require('fs');
const path = require('path');

// ─── 1. Pages villes : ajouter section "Par marque" ───────────────────────────
const villePath = path.join(process.cwd(), 'src/app/garages-moto/[ville]/page.tsx');
let ville = fs.readFileSync(villePath, 'utf8');

// Insérer avant "Garages moto dans d'autres villes"
const oldOtherCities = `          <section className="mb-10">
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">Garages moto dans d&apos;autres villes</h2>`;

const newOtherCities = `          <section className="mb-10">
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">Trouver un garage par marque à {city.name}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {(['honda','yamaha','kawasaki','suzuki','bmw','triumph','ducati','harley-davidson','royal-enfield','ktm','cf-moto','zontes','voge','piaggio','vespa'] as const).map(slug => (
                <Link key={slug} href={\`/marque/\${slug}\`} className="text-[10px] px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:border-brand hover:text-brand font-black uppercase tracking-widest transition-all">
                  {slug.replace(/-/g,' ')}
                </Link>
              ))}
            </div>
            <Link href="/marque/multimarque" className="text-[10px] text-brand font-black uppercase tracking-widest hover:underline">
              → Voir tous les concessionnaires multimarques
            </Link>
          </section>
          <section className="mb-10">
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">Garages moto dans d&apos;autres villes</h2>`;

if (!ville.includes(oldOtherCities)) {
  console.error('❌ Section "autres villes" introuvable dans ville/page.tsx');
  process.exit(1);
}
ville = ville.replace(oldOtherCities, newOtherCities);
fs.writeFileSync(villePath, ville, 'utf8');
console.log('✅ Pages villes — section marques ajoutée');

// ─── 2. Pages marques : ajouter section "Par ville" ───────────────────────────
const marquePath = path.join(process.cwd(), 'src/app/marque/[marque]/page.tsx');
let marque = fs.readFileSync(marquePath, 'utf8');

// Vérifier si CITIES est déjà importé
if (!marque.includes("from '@/app/lib/cities'")) {
  const oldImport = `import { getBrandBySlug, getAllBrandSlugs } from '@/app/lib/brands';`;
  const newImport = `import { getBrandBySlug, getAllBrandSlugs } from '@/app/lib/brands';
import { CITIES } from '@/app/lib/cities';`;
  if (marque.includes(oldImport)) {
    marque = marque.replace(oldImport, newImport);
    console.log('✅ Import CITIES ajouté dans marque/page.tsx');
  }
}

// Insérer section villes avant "Autres marques"
const oldOtherBrands = `        {/* Autres marques */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Autres marques</h2>`;

const newOtherBrands = `        {/* Top villes */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4">Trouver un concessionnaire {brand.displayName} par ville</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.slice(0, 20).map(city => (
              <Link key={city.slug} href={\`/garages-moto/\${city.slug}\`} className="px-3 py-1.5 bg-muted/30 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors">
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Autres marques */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Autres marques</h2>`;

if (!marque.includes(oldOtherBrands)) {
  console.error('❌ Section "Autres marques" introuvable dans marque/page.tsx');
  process.exit(1);
}
marque = marque.replace(oldOtherBrands, newOtherBrands);
fs.writeFileSync(marquePath, marque, 'utf8');
console.log('✅ Pages marques — section villes ajoutée');

// ─── 3. Pages entretien/marque : ajouter liens villes ─────────────────────────
const entretienPath = path.join(process.cwd(), 'src/app/entretien/[marque]/page.tsx');
let entretien = fs.readFileSync(entretienPath, 'utf8');

// Ajouter import CITIES si absent
if (!entretien.includes("from '@/app/lib/cities'")) {
  const oldImp = `import { getAdminFirestore } from '@/lib/firebase-admin';`;
  entretien = entretien.replace(oldImp, `import { getAdminFirestore } from '@/lib/firebase-admin';
import { CITIES } from '@/app/lib/cities';`);
}

// Insérer section villes dans la page entretien avant la FAQ
const oldFaqSection = `        {/* FAQ */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">
            Questions fréquentes — entretien {meta.name}`;

const newFaqSection = `        {/* Villes */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4">Trouver un concessionnaire {meta.name} par ville</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.slice(0, 16).map(city => (
              <Link key={city.slug} href={\`/garages-moto/\${city.slug}\`} className="px-3 py-1.5 bg-muted/30 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors">
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">
            Questions fréquentes — entretien {meta.name}`;

if (!entretien.includes(oldFaqSection)) {
  console.warn('⚠️  Section FAQ introuvable dans entretien/[marque]/page.tsx — skip');
} else {
  entretien = entretien.replace(oldFaqSection, newFaqSection);
  fs.writeFileSync(entretienPath, entretien, 'utf8');
  console.log('✅ Pages entretien/marque — section villes ajoutée');
}

console.log('\n✅ Maillage interne complet — lance npm run build');

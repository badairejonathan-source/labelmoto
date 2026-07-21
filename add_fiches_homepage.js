const fs = require('fs');
const path = require('path');

const deferredPath = path.join(process.cwd(), 'src/components/app/homepage-deferred.tsx');
let content = fs.readFileSync(deferredPath, 'utf8');

// Section fiches moto à insérer
const fichesMotoSection = `
      {/* Section Fiches Techniques Moto */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Fiches techniques moto</h2>
            <p className="text-muted-foreground text-sm font-medium mt-1">Entretien, révisions et vidanges — guides par modèle</p>
          </div>
          <Link href="/entretien" className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline shrink-0">
            Voir les 43 fiches →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { brand: 'Honda', model: 'XL750 Transalp', slug: 'honda-xl750-transalp-2023-plus', emoji: '🏍️' },
            { brand: 'Yamaha', model: 'MT-07', slug: 'yamaha-mt-07-2021-plus', emoji: '🏍️' },
            { brand: 'Kawasaki', model: 'Z900', slug: 'kawasaki-z900-2020-plus', emoji: '🏍️' },
            { brand: 'CFMOTO', model: '450MT', slug: 'cfmoto-450mt-2024-plus', emoji: '🏍️' },
            { brand: 'Suzuki', model: 'GSX-8S', slug: 'suzuki-gsx-8s-2023-plus', emoji: '🏍️' },
            { brand: 'BMW', model: 'R1250 GS', slug: 'bmw-r1250-gs-r1300-gs-2019-plus', emoji: '🏍️' },
            { brand: 'KTM', model: '125 Duke', slug: 'ktm-125-duke-2024-plus', emoji: '🏍️' },
            { brand: 'Triumph', model: 'Trident 660', slug: 'triumph-trident-660-2021-plus', emoji: '🏍️' },
            { brand: 'Honda', model: 'CB750 Hornet', slug: 'honda-cb750-hornet-2023-plus', emoji: '🏍️' },
          ].map(fiche => (
            <Link
              key={fiche.slug}
              href={'/fiches/' + fiche.slug}
              className="group flex flex-col p-4 bg-white rounded-2xl border-2 border-border/50 hover:border-brand shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">{fiche.brand}</span>
              <span className="font-black text-sm uppercase tracking-tight group-hover:text-brand transition-colors leading-tight">{fiche.model}</span>
              <span className="text-[10px] text-muted-foreground font-medium mt-2">Entretien & révisions →</span>
            </Link>
          ))}
        </div>
      </section>`;

// Trouver l'ancre : section "Pourquoi choisir" ou début du return
// Chercher le début du contenu principal dans le return
const anchor1 = `      {/* Section Pourquoi`;
const anchor2 = `      <section className="py-8 md:py-12">`;
const anchor3 = `        <div className="space-y-24`;
const anchor4 = `      <div className="space-y-16`;

let inserted = false;

// Essayer plusieurs ancres possibles
for (const anchor of [anchor1, anchor2, anchor3, anchor4]) {
  if (content.includes(anchor) && !inserted) {
    content = content.replace(anchor, fichesMotoSection + '\n' + anchor);
    inserted = true;
    console.log('✅ Section fiches moto insérée avant:', anchor.slice(0, 50));
    break;
  }
}

if (!inserted) {
  // Chercher le return du composant
  const returnIdx = content.lastIndexOf('  return (');
  if (returnIdx !== -1) {
    // Trouver la première div après le return
    const afterReturn = content.indexOf('<div', returnIdx);
    if (afterReturn !== -1) {
      const afterDiv = content.indexOf('>', afterReturn) + 1;
      content = content.slice(0, afterDiv) + fichesMotoSection + content.slice(afterDiv);
      inserted = true;
      console.log('✅ Section fiches moto insérée après le return');
    }
  }
}

if (!inserted) {
  console.error('❌ Impossible de trouver un point d\'insertion');
  process.exit(1);
}

fs.writeFileSync(deferredPath, content, 'utf8');
console.log('✅ Section "Fiches techniques moto" ajoutée sur la homepage');

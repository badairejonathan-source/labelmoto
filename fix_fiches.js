const fs = require('fs');

const filePath = './src/components/app/homepage-deferred.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const newSection = `      {/* Section Fiches Techniques Moto */}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { brand: 'Honda', model: 'XL750 Transalp', slug: 'honda-xl750-transalp-2023-plus', desc: 'Vidange, chaîne, freins — tout le programme' },
            { brand: 'Yamaha', model: 'MT-07', slug: 'yamaha-mt-07-2021-plus', desc: "Révisions à 10 000 km, coûts réels, points clés" },
            { brand: 'CFMOTO', model: '450MT', slug: 'cfmoto-450mt-2024-plus', desc: 'Entretien du bestseller chinois en France' },
          ].map(fiche => (
            <Link
              key={fiche.slug}
              href={"/" + "fiches/" + fiche.slug}
              className="group flex flex-col gap-2 p-5 bg-white rounded-2xl border-2 border-border/50 hover:border-brand shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-brand">{fiche.brand}</span>
              <span className="font-black text-base uppercase tracking-tight group-hover:text-brand transition-colors leading-tight">{fiche.model}</span>
              <span className="text-xs text-muted-foreground font-medium leading-snug">{fiche.desc}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand mt-1 flex items-center gap-1">
                Voir la fiche <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>`;

// Remplace tout ce qui est entre les marqueurs de la section fiches
const start = content.indexOf('      {/* Section Fiches Techniques Moto */}');
const end = content.indexOf('      </section>', start) + '      </section>'.length;

if (start === -1) {
  console.error('ERREUR : marqueur section fiches non trouvé');
  process.exit(1);
}

const updated = content.slice(0, start) + newSection + content.slice(end);
fs.writeFileSync(filePath, updated, 'utf8');
console.log('OK : section fiches réduite à 3 cartes');

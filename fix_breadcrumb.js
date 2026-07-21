const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/components/app/dealership-detail-client.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remplacer le breadcrumb actuel (CARTE) par un lien vers la ville
const oldBreadcrumb = `        <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8">
          <Link href="/" className="hover:text-brand flex items-center gap-1"><Home className="h-3 w-3" /> ACCUEIL</Link>
          <ChevronRight className="h-2 w-2" /><Link href="/map" className="hover:text-brand">CARTE</Link>
          <ChevronRight className="h-2 w-2" /><span className="text-foreground">{pro.title}</span>
        </nav>`;

const newBreadcrumb = `        {/* Breadcrumb : Accueil → Ville → Fiche */}
        {(() => {
          // Extraire la ville depuis l'adresse (après le code postal)
          const addrParts = (pro.address || '').split(',').map((s: string) => s.trim());
          const cpIdx = addrParts.findIndex((p: string) => /\\d{5}/.test(p));
          const cityRaw = cpIdx !== -1
            ? (addrParts[cpIdx].match(/\\d{5}\\s*(.*)/)?.[1] || addrParts[cpIdx + 1] || '')
            : addrParts[addrParts.length - 2] || '';
          const citySlug = cityRaw.toLowerCase()
            .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return (
            <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8 flex-wrap">
              <Link href="/" className="hover:text-brand flex items-center gap-1"><Home className="h-3 w-3" /> ACCUEIL</Link>
              {cityRaw && citySlug && (
                <>
                  <ChevronRight className="h-2 w-2" />
                  <Link href={'/garages-moto/' + citySlug} className="hover:text-brand">{cityRaw}</Link>
                </>
              )}
              <ChevronRight className="h-2 w-2" />
              <span className="text-foreground truncate max-w-[200px]">{pro.title}</span>
            </nav>
          );
        })()}`;

if (content.includes(oldBreadcrumb)) {
  content = content.replace(oldBreadcrumb, newBreadcrumb);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Breadcrumb mis à jour : Accueil → Ville → Fiche');
} else {
  console.error('❌ Breadcrumb introuvable');
}

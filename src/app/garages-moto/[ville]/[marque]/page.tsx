import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadSeoPros } from '@/lib/seo-pros';

interface PageProps {
  params: Promise<{ ville: string; marque: string }>;
}

// Normaliser un texte en slug
function toSlug(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Extraire la ville depuis une adresse
function extractCity(address: string): { name: string; slug: string } {
  const cpMatch = address.match(/\d{5}\s*([\w\s\-']+)/);
  const raw = cpMatch ? cpMatch[1].trim() : '';
  return { name: raw, slug: toSlug(raw) };
}

// Convertir un slug de marque en nom affiché
const BRAND_SLUGS: Record<string, string> = {
  'honda': 'Honda', 'yamaha': 'Yamaha', 'kawasaki': 'Kawasaki',
  'suzuki': 'Suzuki', 'bmw': 'BMW', 'harley-davidson': 'Harley-Davidson',
  'triumph': 'Triumph', 'ducati': 'Ducati', 'royal-enfield': 'Royal Enfield',
  'ktm': 'KTM', 'aprilia': 'Aprilia', 'vespa': 'Vespa', 'piaggio': 'Piaggio',
  'kymco': 'Kymco', 'indian': 'Indian', 'cf-moto': 'CF Moto',
  'zontes': 'Zontes', 'voge': 'VOGE', 'qj-motor': 'QJ Motor', 'kove': 'Kove',
  'benelli': 'Benelli', 'mash': 'Mash', 'husqvarna': 'Husqvarna', 'beta': 'Beta',
  'sherco': 'Sherco', 'fantic': 'Fantic', 'rieju': 'Rieju', 'moto-guzzi': 'Moto Guzzi',
  'sym': 'SYM', 'can-am': 'Can-Am', 'peugeot-motocycles': 'Peugeot Motocycles',
  'moto-axxe': 'Moto Axxe', 'dafy-moto': 'Dafy Moto', 'speedway': 'Speedway',
  'docbiker': "Doc'Biker", 'teamaxe': 'TeamAxe', 'cardy': 'Cardy',
};

export async function generateStaticParams() {
  const pros = await loadSeoPros();
  const combos = new Set<string>();

  pros
    .filter(pro => pro.collection === 'concessions')
    .forEach(pro => {
      const city = extractCity(pro.address || '');

      if (!city.slug || !pro.brands.length) return;

      pro.brands.forEach(brand => {
        combos.add(
          city.slug + '|' + toSlug(brand)
        );
      });
    });

  return Array.from(combos).map(key => {
    const [ville, marque] = key.split('|');
    return { ville, marque };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville, marque } = await params;
  const brandName = BRAND_SLUGS[marque] || marque.charAt(0).toUpperCase() + marque.slice(1);
  const villeDisplay = ville.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `Concessionnaire ${brandName} à ${villeDisplay} — adresses vérifiées | LabelMoto`,
    description: `Trouvez un concessionnaire ${brandName} à ${villeDisplay} : horaires, contacts et services vérifiés sur LabelMoto, l'annuaire national des professionnels moto.`,
    alternates: { canonical: `https://labelmoto.fr/garages-moto/${ville}/${marque}` },
    openGraph: {
      title: `Concessionnaire ${brandName} à ${villeDisplay} | LabelMoto`,
      url: `https://labelmoto.fr/garages-moto/${ville}/${marque}`,
      siteName: 'LabelMoto', locale: 'fr_FR', type: 'website',
      images: [{ url: 'https://labelmoto.fr/images/og-image.webp', width: 1200, height: 630 }],
    },
  };
}

export default async function MarqueVillePage({ params }: PageProps) {
  const { ville, marque } = await params;
  const brandName = BRAND_SLUGS[marque];
  if (!brandName) notFound();

  const villeDisplay = ville
    .split('-')
    .map(
      (w: string) =>
        w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(' ');

  const allPros = await loadSeoPros();

  const pros = allPros.filter(pro => {
    if (pro.collection !== 'concessions') return false;
    if (!pro.brands.includes(brandName)) return false;

    const city = extractCity(pro.address || '');

    return city.slug === ville;
  });

  if (pros.length === 0) notFound();

  return (
    <main className="container mx-auto px-4 py-12 pt-28 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground mb-8">
        <Link href="/" className="hover:text-brand">Accueil</Link>
        <span>›</span>
        <Link href={`/garages-moto/${ville}`} className="hover:text-brand">{villeDisplay}</Link>
        <span>›</span>
        <span className="text-foreground">{brandName}</span>
      </nav>

      {/* H1 */}
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
        {brandName} à {villeDisplay}
      </h1>
      <p className="text-muted-foreground mb-8 font-medium">
        {pros.length} concessionnaire{pros.length > 1 ? 's' : ''} {brandName} trouvé{pros.length > 1 ? 's' : ''} à {villeDisplay} — contacts, horaires et infos vérifiés.
      </p>

      {/* Liste des pros */}
      <div className="space-y-4 mb-12">
        {pros.map((pro: any) => (
          <Link key={pro.id} href={`/concessions/${pro.slug || pro.id}`}
            className="block bg-white rounded-2xl border-2 hover:border-brand p-6 transition-all group shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-black text-lg uppercase tracking-tight group-hover:text-brand transition-colors">
                  {pro.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{pro.address}</p>
                {pro.phoneNumber && (
                  <p className="text-sm font-bold text-brand mt-2">📞 {pro.phoneNumber}</p>
                )}
                {pro.brands?.length > 1 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {pro.brands.map((b: string) => (
                      <span key={b} className="text-[9px] font-black uppercase bg-muted px-2 py-0.5 rounded-full">{b}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-brand font-black text-xl opacity-0 group-hover:opacity-100 transition-opacity shrink-0">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Maillage interne */}
      <div className="grid md:grid-cols-2 gap-4 p-6 bg-muted/30 rounded-2xl border">
        <div>
          <h3 className="font-black uppercase text-xs tracking-widest mb-3 text-muted-foreground">Toutes les marques à {villeDisplay}</h3>
          <Link href={`/garages-moto/${ville}`} className="text-brand font-black text-sm hover:underline">
            → Voir tous les pros moto à {villeDisplay}
          </Link>
        </div>
        <div>
          <h3 className="font-black uppercase text-xs tracking-widest mb-3 text-muted-foreground">Tous les {brandName} en France</h3>
          <Link href={`/marque/${marque}`} className="text-brand font-black text-sm hover:underline">
            → Voir tous les concessionnaires {brandName}
          </Link>
        </div>
      </div>
    </main>
  );
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCountryBySlug, getAllCountrySlugs } from '@/app/lib/countries';
import { loadSeoPros } from '@/lib/seo-pros';

interface Pro {
  id: string;
  title: string;
  address: string;
  category: string;
  phoneNumber?: string;
  website?: string;
  rating: number | null;
  reviewCount: number | null;
  slug: string;
  docId: string;
  collection: string;
}

interface PageProps {
  params: Promise<{ pays: string }>;
}

export async function generateStaticParams() {
  return getAllCountrySlugs().map(slug => ({ pays: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pays } = await params;
  const country = getCountryBySlug(pays);
  if (!country) return { title: 'Page introuvable | LabelMoto' };
  return {
    title: country.metaTitle,
    description: country.metaDescription,
    alternates: { canonical: `https://labelmoto.fr/pros-moto/${country.slug}` },
    openGraph: {
      title: country.metaTitle,
      description: country.metaDescription,
      url: `https://labelmoto.fr/pros-moto/${country.slug}`,
      siteName: 'LabelMoto',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: 'https://labelmoto.fr/images/og-image.webp', width: 1200, height: 630 }],
    },
  };
}

function parseRating(raw: unknown): number | null {
  if (!raw || raw === '') return null;
  const n = parseFloat(String(raw));
  return isNaN(n) ? null : n;
}

async function getProsForCountry(
  country: { code: string; filterType?: string }
): Promise<Pro[]> {
  const allPros = await loadSeoPros();

  return allPros
    .filter(pro => {
      if (
        !['concessions', 'associations', 'relais'].includes(
          pro.collection
        )
      ) {
        return false;
      }

      if (country.filterType === 'departement') {
        return pro.departement === country.code;
      }

      return pro.country === country.code;
    })
    .slice(0, 900)
    .map(pro => ({
      id: pro.id,
      title: pro.title,
      address: pro.address,
      category: pro.category,
      phoneNumber: pro.phoneNumber,
      website: pro.website,
      rating: pro.rating,
      reviewCount: pro.reviewCount,
      slug: pro.slug,
      docId: pro.id,
      collection: pro.collection,
    }))
    .sort((a, b) => {
      if (a.rating !== null && b.rating !== null) {
        return b.rating - a.rating;
      }

      if (a.rating !== null) return -1;
      if (b.rating !== null) return 1;

      return a.title.localeCompare(b.title, 'fr');
    });
}

function ProCard({ pro }: { pro: Pro }) {
  const href = `/${pro.collection}/${pro.docId}`;
  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3 p-4 md:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={href} className="font-black text-foreground hover:text-brand transition-colors line-clamp-1 text-sm uppercase tracking-tight">
            {pro.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{pro.address}</p>
        </div>
        {pro.rating && (
          <div className="shrink-0 flex items-center gap-1 bg-brand/10 px-2 py-1 rounded-full">
            <span className="text-xs font-black text-brand">{pro.rating.toFixed(1)}</span>
            <span className="text-brand text-xs">★</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {pro.category && (
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-muted/40 px-2 py-1 rounded-full">
            {pro.category}
          </span>
        )}
        {pro.phoneNumber && (
          <a href={`tel:${pro.phoneNumber}`} className="text-[9px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2 py-1 rounded-full hover:bg-brand/20 transition-colors">
            📞 Appeler
          </a>
        )}
        {pro.website && (
          <a href={pro.website} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2 py-1 rounded-full hover:bg-brand/20 transition-colors">
            🌐 Site web
          </a>
        )}
      </div>
    </div>
  );
}

export default async function PaysPage({ params }: PageProps) {
  const { pays } = await params;
  const country = getCountryBySlug(pays);
  if (!country) notFound();

  const pros = await getProsForCountry(country);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: country.h1,
    description: country.metaDescription,
    numberOfItems: pros.length,
    itemListElement: pros.slice(0, 10).map((pro, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: pro.title,
        address: pro.address,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand">Accueil</Link>
          <span>›</span>
          <Link href="/map" className="hover:text-brand">Carte</Link>
          <span>›</span>
          <span className="text-foreground">{country.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
            {country.h1}
          </h1>
          <p className="text-brand font-black text-lg">{pros.length} professionnels référencés</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border mb-8 space-y-3">
          {country.intro.map((p, i) => (
            <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </div>

        {/* Liste des pros */}
        {pros.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {pros.map(pro => <ProCard key={pro.id} pro={pro} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-black text-lg">Aucun professionnel trouvé</p>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Questions fréquentes</h2>
          <div className="space-y-6">
            {country.faq.map((item, i) => (
              <div key={i}>
                <h3 className="font-black text-sm uppercase tracking-tight mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA retour carte */}
        <div className="mt-8 text-center">
          <Link href="/map" className="inline-flex items-center gap-2 bg-brand text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded-full hover:bg-brand/90 transition-colors">
            Voir sur la carte interactive
          </Link>
        </div>
      </div>
    </div>
  );
}

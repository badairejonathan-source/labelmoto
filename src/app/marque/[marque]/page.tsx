import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBrandBySlug, getAllBrandSlugs } from '@/app/lib/brands';
import { getAdminFirestore } from '@/lib/firebase-admin';

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
  departement?: string;
}

interface PageProps {
  params: Promise<{ marque: string }>;
}

export async function generateStaticParams() {
  return getAllBrandSlugs().map(slug => ({ marque: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) return { title: 'Page introuvable | LabelMoto' };
  return {
    title: brand.metaTitle,
    description: brand.metaDescription,
    alternates: { canonical: `https://labelmoto.fr/marque/${brand.slug}` },
    openGraph: {
      title: brand.metaTitle,
      description: brand.metaDescription,
      url: `https://labelmoto.fr/marque/${brand.slug}`,
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

async function getProsForBrand(brandValue: string): Promise<Pro[]> {
  try {
    const db = getAdminFirestore();
    const snap = await db.collection('concessions')
      .where('brands', 'array-contains', brandValue)
      .limit(500)
      .get();

    return snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || '',
        address: d.address || '',
        category: d.category || '',
        phoneNumber: d.phoneNumber || undefined,
        website: d.website || undefined,
        rating: parseRating(d.rating),
        reviewCount: d.reviewCount ? Number(d.reviewCount) : null,
        slug: d.slug || doc.id,
        docId: doc.id,
        departement: d.departement || '',
      };
    }).sort((a, b) => {
      if (a.rating !== null && b.rating !== null) return b.rating - a.rating;
      if (a.rating !== null) return -1;
      if (b.rating !== null) return 1;
      return a.title.localeCompare(b.title, 'fr');
    });
  } catch (err) {
    console.error(`[marque] brand=${brandValue}:`, err);
    return [];
  }
}

function ProCard({ pro }: { pro: Pro }) {
  const href = `/concessions/${pro.docId}`;
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
        <Link href={href} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand bg-muted/30 px-2 py-1 rounded-full transition-colors">
          Voir la fiche →
        </Link>
      </div>
    </div>
  );
}

export default async function MarquePage({ params }: PageProps) {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) notFound();

  const pros = await getProsForBrand(brand.firestoreValue);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: brand.h1,
        description: brand.metaDescription,
        url: `https://labelmoto.fr/marque/${brand.slug}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: brand.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand/5 to-brand/10 border-b">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <nav className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-brand">Accueil</Link>
            <span>›</span>
            <Link href="/map" className="hover:text-brand">Carte</Link>
            <span>›</span>
            <span className="text-foreground">{brand.displayName}</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
            {brand.h1}
          </h1>
          <p className="text-brand font-black text-lg">{pros.length} professionnels référencés</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Intro */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border space-y-3">
          {brand.intro.map((p, i) => (
            <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </div>

        {/* Liste */}
        {pros.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pros.map(pro => <ProCard key={pro.id} pro={pro} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-black text-lg">Aucun professionnel trouvé</p>
          </div>
        )}

        {/* CTA carte */}
        <div className="text-center">
          <Link
            href={`/map?search=${brand.name}`}
            className="inline-flex items-center gap-2 bg-brand text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded-full hover:bg-brand/90 transition-colors"
          >
            Voir sur la carte interactive
          </Link>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Questions fréquentes — {brand.displayName}</h2>
          <div className="space-y-6">
            {brand.faq.map((item, i) => (
              <div key={i}>
                <h3 className="font-black text-sm uppercase tracking-tight mb-2 text-brand">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Autres marques */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Autres marques</h2>
          <div className="flex flex-wrap gap-2">
            {getAllBrandSlugs().filter(s => s !== brand.slug).map(s => {
              const b = require('@/app/lib/brands').getBrandBySlug(s);
              return b ? (
                <Link key={s} href={`/marque/${s}`} className="px-3 py-1.5 bg-muted/30 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors">
                  {b.displayName}
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug, getAllCitySlugs, CITIES } from '@/app/lib/cities';
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
}

interface PageProps {
  params: Promise<{ ville: string }>;
}

export async function generateStaticParams() {
  return getAllCitySlugs().map(slug => ({ ville: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville } = await params;
  const city = getCityBySlug(ville);
  if (!city) return { title: 'Page introuvable | LabelMoto' };
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: { canonical: `https://labelmoto.fr/garages-moto/${city.slug}` },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: `https://labelmoto.fr/garages-moto/${city.slug}`,
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

function parseReviewCount(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = Number(raw);
  return isNaN(n) ? null : n;
}

async function getProsForCity(departement: string): Promise<Pro[]> {
  try {
    const db = getAdminFirestore();
    const cols = ['concessions', 'associations', 'relais'] as const;
    const all: Pro[] = [];
    for (const col of cols) {
      const snap = await db.collection(col).where('departement', '==', departement).limit(60).get();
      snap.docs.forEach(doc => {
        const d = doc.data();
        all.push({
          id: doc.id,
          title: d.title || '',
          address: d.address || '',
          category: d.category || '',
          phoneNumber: d.phoneNumber || undefined,
          website: d.website || undefined,
          rating: parseRating(d.rating),
          reviewCount: parseReviewCount(d.reviewCount),
          slug: d.slug || doc.id,
        });
      });
    }
    return all.sort((a, b) => {
      if (a.rating !== null && b.rating !== null) return b.rating - a.rating;
      if (a.rating !== null) return -1;
      if (b.rating !== null) return 1;
      return a.title.localeCompare(b.title, 'fr');
    });
  } catch (err) {
    console.error(`[garages-moto] dept=${departement}:`, err);
    return [];
  }
}

function ProCard({ pro }: { pro: Pro }) {
  return (
    <div className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow bg-card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={`/pro/${pro.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 text-sm">
            {pro.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{pro.category}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{pro.address}</p>
        </div>
        {pro.rating !== null && (
          <div className="text-right shrink-0">
            <p className="text-sm font-medium text-foreground">★ {pro.rating.toFixed(1)}</p>
            {pro.reviewCount !== null && <p className="text-xs text-muted-foreground">{pro.reviewCount} avis</p>}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/pro/${pro.slug}`} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Voir la fiche
        </Link>
        {pro.phoneNumber && (
          <a href={`tel:${pro.phoneNumber}`} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
            Appeler
          </a>
        )}
        {pro.website && (
          <a href={pro.website} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
            Site web ↗
          </a>
        )}
      </div>
    </div>
  );
}

function JsonLd({ city }: { city: NonNullable<ReturnType<typeof getCityBySlug>> }) {
  const faq = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: city.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const page = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: `Garages moto et concessionnaires à ${city.name}`,
    description: city.metaDescription,
    url: `https://labelmoto.fr/garages-moto/${city.slug}`,
    provider: { '@type': 'Organization', name: 'LabelMoto', url: 'https://labelmoto.fr' },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }} />
    </>
  );
}

export default async function GaragesMotoParsVille({ params }: PageProps) {
  const { ville } = await params;
  const city = getCityBySlug(ville);
  if (!city) notFound();
  const pros = await getProsForCity(city.departement);
  const otherCities = CITIES.filter(c => c.slug !== ville).slice(0, 9);

  return (
    <>
      <JsonLd city={city} />
      <main className="max-w-5xl mx-auto px-4 py-8">

        <nav aria-label="Fil d'ariane" className="text-xs text-muted-foreground mb-6">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-foreground transition-colors">Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/map" className="hover:text-foreground transition-colors">Trouver un pro</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-foreground font-medium">Garages moto {city.name}</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">{city.h1}</h1>
          <div className="text-muted-foreground leading-relaxed space-y-3 text-sm md:text-base">
            {city.intro.map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
            {pros.length > 0 ? `${pros.length} professionnels référencés` : 'Référencement en cours'}
          </span>
          <span className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground">{city.region}</span>
          <Link href={`/map?dept=${city.departement}`} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Voir sur la carte →
          </Link>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {pros.length > 0 ? `Garages moto et concessionnaires à ${city.name}` : `Pros moto à ${city.name}`}
          </h2>
          {pros.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {pros.map(pro => <ProCard key={pro.id} pro={pro} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground text-sm mb-2">Vous êtes un professionnel moto à {city.name} ?</p>
              <p className="text-muted-foreground text-xs mb-5">Rejoignez LabelMoto gratuitement et soyez visible auprès des motards de votre région.</p>
              <Link href="/pro/register" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm">
                Créer ma fiche — 100% gratuit
              </Link>
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-3">Recherches liées à {city.name}</h2>
          <div className="flex flex-wrap gap-2">
            {city.searchTerms.map(term => (
              <span key={term} className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground">{term}</span>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-5">Questions fréquentes — garages moto à {city.name}</h2>
          <div className="space-y-5">
            {city.faq.map(({ q, a }, i) => (
              <div key={i} className="border-b border-border pb-5 last:border-0">
                <h3 className="font-medium text-foreground mb-2 text-sm md:text-base">{q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-3">Garages moto dans d&apos;autres villes</h2>
          <div className="flex flex-wrap gap-2">
            {otherCities.map(c => (
              <Link key={c.slug} href={`/garages-moto/${c.slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        <div className="rounded-xl bg-muted p-6 text-center">
          <h2 className="font-semibold text-foreground mb-2 text-base">Professionnel moto à {city.name} ?</h2>
          <p className="text-sm text-muted-foreground mb-4">Rejoignez LabelMoto gratuitement et soyez trouvé par les motards de votre région.</p>
          <Link href="/pro/register" className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm">
            Créer ma fiche — 100% gratuit
          </Link>
        </div>

      </main>
    </>
  );
}

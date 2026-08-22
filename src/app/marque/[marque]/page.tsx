import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBrandBySlug, getAllBrandSlugs } from '@/app/lib/brands';
import { CITIES } from '@/app/lib/cities';
import { getDepartmentByCode } from '@/app/lib/departments';
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

async function getProsForBrand(
  brandValue: string
): Promise<Pro[]> {
  const allPros = await loadSeoPros();

  return allPros
    .filter(
      pro =>
        pro.collection === 'concessions' &&
        pro.brands.includes(brandValue)
    )
    .slice(0, 500)
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
      departement: pro.departement,
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

interface DepartmentGroup {
  code: string;
  name: string;
  pros: Pro[];
}

function getDepartmentSortValue(code: string): number {
  const normalized = code.trim().toUpperCase();

  if (normalized === '2A') return 20.1;
  if (normalized === '2B') return 20.2;

  const numeric = Number.parseInt(normalized, 10);
  return Number.isFinite(numeric) ? numeric : 9999;
}

function getDepartmentAnchor(code: string): string {
  return `departement-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
}

function groupProsByDepartment(pros: Pro[]): DepartmentGroup[] {
  const grouped = new Map<string, Pro[]>();

  for (const pro of pros) {
    const code = pro.departement?.trim().toUpperCase() || 'NC';

    if (!grouped.has(code)) {
      grouped.set(code, []);
    }

    grouped.get(code)!.push(pro);
  }

  return Array.from(grouped.entries())
    .map(([code, departmentPros]) => {
      const department =
        code !== 'NC' ? getDepartmentByCode(code) : undefined;

      return {
        code,
        name:
          code === '00'
            ? 'Pays frontaliers'
            : code === '20'
              ? 'Corse'
              : code === 'NC'
                ? 'Département non renseigné'
                : department?.name || `Département ${code}`,
        pros: departmentPros,
      };
    })
    .sort((a, b) => {
      if (a.code === 'NC') return 1;
      if (b.code === 'NC') return -1;

      const diff =
        getDepartmentSortValue(a.code) -
        getDepartmentSortValue(b.code);

      if (diff !== 0) return diff;

      return a.name.localeCompare(b.name, 'fr');
    });
}

function ProCard({ pro }: { pro: Pro }) {
  const href = `/concessions/${pro.slug || pro.docId}`;
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
  const departmentGroups = groupProsByDepartment(pros);

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
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          {brand.aboutTitle && (
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
              {brand.aboutTitle}
            </h2>
          )}

          <div className="space-y-3">
            {brand.intro.map((p, i) => (
              <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed">{p}</p>
            ))}
          </div>

          {brand.highlights && brand.highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
              {brand.highlights.map((item) => (
                <div
                  key={item.label}
                  className="bg-gradient-to-br from-brand/5 to-brand/10 rounded-2xl border border-brand/20 p-4"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="text-lg font-black text-brand mb-2">{item.value}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Liste par département */}
        {pros.length > 0 ? (
          <div className="space-y-10">

            {/* Sommaire départements */}
            <div
              id="sommaire-departements"
              className="scroll-mt-24 bg-white rounded-3xl border shadow-sm p-5 md:p-6"
            >
              <details open>
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">
                      Accès rapide
                    </p>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">
                      Trouver par département
                    </h2>
                  </div>

                  <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-black text-brand">
                    {departmentGroups.length}
                  </span>
                </summary>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-5">
                  {departmentGroups.map(group => (
                    <a
                      key={group.code}
                      href={`#${getDepartmentAnchor(group.code)}`}
                      className="group rounded-xl border border-border/70 bg-muted/20 px-3 py-2.5 hover:border-brand hover:bg-brand/5 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0 text-xs font-black text-brand">
                          {group.code === 'NC' ? '—' : group.code}
                        </span>

                        <span className="truncate text-[11px] font-bold text-foreground group-hover:text-brand">
                          {group.name}
                        </span>
                      </div>

                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                        {group.pros.length} pro{group.pros.length > 1 ? 's' : ''}
                      </p>
                    </a>
                  ))}
                </div>
              </details>
            </div>

            {/* Départements */}
            {departmentGroups.map(group => (
              <section
                key={group.code}
                id={getDepartmentAnchor(group.code)}
                className="scroll-mt-24"
              >
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border/70 pb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="inline-flex min-w-12 items-center justify-center rounded-xl bg-brand px-3 py-2 text-xs font-black text-white shadow-sm">
                      {group.code === 'NC' ? '—' : group.code}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
                        {group.name}
                      </h2>

                      <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {group.pros.length} professionnel{group.pros.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <a
                    href="#sommaire-departements"
                    className="shrink-0 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand hover:underline"
                  >
                    ↑ Sommaire
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.pros.map(pro => (
                    <ProCard key={pro.id} pro={pro} />
                  ))}
                </div>
              </section>
            ))}
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

        {/* Contenu éditorial marque */}
        {brand.accordions && brand.accordions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-5">
              En savoir plus sur {brand.displayName}
            </h2>

            <div className="divide-y divide-border">
              {brand.accordions.map((item) => (
                <details key={item.id} className="group py-4">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-black text-sm md:text-base uppercase tracking-tight text-foreground">
                    <span>{item.title}</span>
                    <span
                      aria-hidden="true"
                      className="text-brand text-xl leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>

                  <p className="mt-4 pr-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

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

        {/* Top villes */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4">Trouver un concessionnaire {brand.displayName} par ville</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.slice(0, 20).map(city => (
              <Link key={city.slug} href={`/garages-moto/${city.slug}`} className="px-3 py-1.5 bg-muted/30 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors">
                {city.name}
              </Link>
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

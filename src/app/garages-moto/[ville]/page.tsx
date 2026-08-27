import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug, getAllCitySlugs, CITIES } from '@/app/lib/cities';

function toSlug(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
import { loadSeoPros } from '@/lib/seo-pros';
import fsNode from 'fs';
import pathNode from 'path';

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
  brands?: string[];
}

interface PageProps {
  params: Promise<{ ville: string }>;
}

export async function generateStaticParams() {
  return getAllCitySlugs().map(slug => ({ ville: slug }));
}

// ── Filtrage géographique par rayon (nouveau, remplace le filtrage par département) ──
interface GeoPoint {
  id: string; lat: number; lng: number; t: string; s: string;
  a: string; c: string; r?: string; d?: string;
}
let _cachedPoints: GeoPoint[] | null = null;
let _cachedCoords: Record<string, { lat: number; lng: number }> | null = null;

function loadPointsData(): GeoPoint[] {
  if (!_cachedPoints) {
    const filePath = pathNode.join(process.cwd(), 'public', 'points.json');
    _cachedPoints = JSON.parse(fsNode.readFileSync(filePath, 'utf8'));
  }
  return _cachedPoints!;
}
function loadCityCoordsData(): Record<string, { lat: number; lng: number }> {
  if (!_cachedCoords) {
    const filePath = pathNode.join(process.cwd(), 'src/app/lib/cities-coords.json');
    _cachedCoords = JSON.parse(fsNode.readFileSync(filePath, 'utf8'));
  }
  return _cachedCoords!;
}
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const RADIUS_KM_DEFAULT = 25;
const RADIUS_KM_FALLBACK = 50;
const MIN_RESULTS_BEFORE_FALLBACK = 5;

function getPointsNearCity(city: { slug: string; departement: string }): GeoPoint[] {
  const coordsMap = loadCityCoordsData();
  const cityCoord = coordsMap[city.slug];
  const points = loadPointsData();
  if (!cityCoord) {
    // Filet de sécurité : comportement historique par département si coordonnée manquante
    return points.filter(p => p.d === city.departement);
  }
  let radius = RADIUS_KM_DEFAULT;
  let nearby = points.filter(p => haversineKm(cityCoord.lat, cityCoord.lng, p.lat, p.lng) <= radius);
  if (nearby.length < MIN_RESULTS_BEFORE_FALLBACK) {
    radius = RADIUS_KM_FALLBACK;
    nearby = points.filter(p => haversineKm(cityCoord.lat, cityCoord.lng, p.lat, p.lng) <= radius);
  }
  return nearby.sort((a, b) =>
    haversineKm(cityCoord.lat, cityCoord.lng, a.lat, a.lng) -
    haversineKm(cityCoord.lat, cityCoord.lng, b.lat, b.lng)
  );
}

function collectionForPoint(p: GeoPoint): 'concessions' | 'associations' | 'relais' | 'creators' {
  if (p.a === 'association') return 'associations';
  if (p.a === 'relais') return 'relais';
  if (p.a === 'creator') return 'creators';
  return 'concessions';
}

async function getProsForCityNearby(
  city: NonNullable<ReturnType<typeof getCityBySlug>>
): Promise<Pro[]> {
  try {
    const nearby = getPointsNearCity(city);

    if (nearby.length === 0) return [];

    const allPros = await loadSeoPros();

    const byKey = new Map(
      allPros.map(pro => [
        pro.collection + '/' + pro.id,
        pro,
      ])
    );

    return nearby
      .map(point => {
        const collection = collectionForPoint(point);

        const pro = byKey.get(
          collection + '/' + point.id
        );

        if (!pro) return null;

        return {
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
          brands: pro.brands,
        } as Pro;
      })
      .filter((pro): pro is Pro => pro !== null);
  } catch (err) {
    console.error(
      `[garages-moto] ville=${city.slug}:`,
      err
    );

    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville } = await params;
  const city = getCityBySlug(ville);
  if (!city) return { title: 'Page introuvable | LabelMoto' };

  // Compte réel depuis Firestore (dynamique à chaque build)
  const count = getPointsNearCity(city).length;
  const countStr = count > 0 ? `${count}` : '';
  
  // Titre dynamique avec le vrai nombre de pros
  const dynamicTitle = countStr
    ? `${countStr} garages moto à ${city.name} — Concessions & ateliers | LabelMoto`
    : city.metaTitle;

  // Description dynamique
  const dynamicDesc = countStr
    ? `Trouvez votre garage moto à ${city.name} parmi ${countStr} professionnels vérifiés : concessions, ateliers, réparateurs. Avis, horaires et contacts directs sur LabelMoto.`
    : city.metaDescription;

  return {
    title: { absolute: dynamicTitle },
    description: dynamicDesc,
    alternates: { canonical: `https://labelmoto.fr/garages-moto/${city.slug}` },
    openGraph: {
      title: dynamicTitle,
      description: dynamicDesc,
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

function ProCard({ pro }: { pro: Pro }) {
  const href = pro.collection === "creators" ? `/creators/${pro.slug || pro.docId}` : `/concessions/${pro.slug || pro.docId}`;
  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3 p-4 md:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={href} className="font-black text-foreground hover:text-brand transition-colors line-clamp-1 text-sm uppercase tracking-tight">
            {pro.title}
          </Link>
          <p className="text-[10px] font-bold text-brand uppercase tracking-widest mt-0.5">{pro.category}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-medium">{pro.address}</p>
        </div>
        {pro.rating !== null && (
          <div className="text-right shrink-0 bg-brand/10 rounded-xl px-2 py-1">
            <p className="text-sm font-black text-brand">★ {pro.rating.toFixed(1)}</p>
            {pro.reviewCount !== null && (
              <p className="text-[10px] text-muted-foreground font-bold">{pro.reviewCount} avis</p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={href} className="text-[10px] px-4 py-2 rounded-full bg-brand hover:bg-brand/90 text-white font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-md">
          Voir la fiche
        </Link>
        {pro.phoneNumber && (
          <a href={`tel:${pro.phoneNumber}`} className="text-[10px] px-4 py-2 rounded-full border-2 border-brand/20 hover:border-brand text-brand font-black uppercase tracking-widest transition-all hover:scale-105">
            Appeler
          </a>
        )}
        {pro.website && (
          <a href={pro.website} target="_blank" rel="noopener noreferrer" className="text-[10px] px-4 py-2 rounded-full border-2 border-border hover:border-brand/30 text-muted-foreground hover:text-brand font-black uppercase tracking-widest transition-all">
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
  const pros = await getProsForCityNearby(city);
  const otherCities = CITIES.filter(c => c.slug !== ville).slice(0, 9);
  const cityBrands = Array.from(new Set(pros.flatMap(p => (p as any).brands || []))).sort() as string[];
  const cityCoordForMap = loadCityCoordsData()[city.slug] || null;

  return (
    <>
      <JsonLd city={city} />
      <main className="py-4 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          <nav aria-label="Fil d'ariane" className="text-[10px] text-muted-foreground mb-6 font-bold uppercase tracking-widest">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li><Link href="/" className="hover:text-brand transition-colors">Accueil</Link></li>
              <li aria-hidden="true" className="text-brand">›</li>
              <li><Link href="/map" className="hover:text-brand transition-colors">Trouver un pro</Link></li>
              <li aria-hidden="true" className="text-brand">›</li>
              <li className="text-brand">Garages moto {city.name}</li>
            </ol>
          </nav>

          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-brand/5 to-brand/10 border border-brand/20 overflow-hidden shadow-sm mb-8 p-8 md:p-12">
            <div className="relative z-10">
              <div className="inline-block bg-brand/15 border border-brand/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-brand font-black text-[10px] uppercase tracking-[0.3em]">{city.region}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tighter leading-[1.1] mb-4">
                {city.h1}
              </h1>
              <div className="space-y-3 text-muted-foreground text-sm md:text-base font-medium leading-relaxed max-w-3xl mb-8">
                {city.intro.map((para, i) => <p key={i}>{para}</p>)}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-white rounded-2xl px-5 py-3 border border-brand/20 shadow-sm">
                  <p className="text-brand font-black text-lg">{pros.length > 0 ? pros.length : '—'}</p>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">pros référencés</p>
                </div>
                <Link
                  href={`/map?search=${encodeURIComponent(city.name)}${cityCoordForMap ? `&lat=${cityCoordForMap.lat}&lng=${cityCoordForMap.lng}&zoom=12` : ''}`}
                  className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white font-black uppercase text-xs px-8 py-4 rounded-full shadow-2xl border-4 border-brand/30 whitespace-nowrap transition-all hover:scale-105 active:scale-95 tracking-widest"
                >
                  🗺️ Voir sur la carte interactive
                </Link>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tighter mb-6">
              {pros.length > 0 ? `Garages moto et concessionnaires à ${city.name}` : `Pros moto à ${city.name}`}
            </h2>
            {pros.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {pros.map(pro => <ProCard key={pro.id} pro={pro} />)}
              </div>
            ) : (
              <div className="rounded-[2rem] border-2 border-dashed border-brand/30 bg-brand/5 p-10 text-center">
                <p className="text-foreground font-black uppercase tracking-tight mb-2">Vous êtes un professionnel moto à {city.name} ?</p>
                <p className="text-muted-foreground text-sm font-medium mb-6">Rejoignez LabelMoto gratuitement et soyez visible auprès des motards de votre région.</p>
                <Link href="/pro/register" className="inline-block px-8 py-4 rounded-full bg-brand text-white hover:bg-brand/90 transition-all hover:scale-105 font-black uppercase text-xs tracking-widest shadow-xl">
                  Créer ma fiche — 100% gratuit
                </Link>
              </div>
            )}
          </section>

          {pros.length > 6 && (
            <div className="rounded-[2rem] bg-muted/50 border border-border/50 p-6 md:p-8 text-center mb-10 shadow-sm">
              <p className="font-black text-foreground uppercase tracking-tighter text-lg mb-2">Vous ne trouvez pas ce que vous cherchez ?</p>
              <p className="text-muted-foreground text-sm font-medium mb-5">La carte interactive affiche tous les pros avec filtres par marque, type et distance.</p>
              <Link href={`/map?search=${encodeURIComponent(city.name)}${cityCoordForMap ? `&lat=${cityCoordForMap.lat}&lng=${cityCoordForMap.lng}&zoom=12` : ''}`} className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white font-black uppercase text-xs px-8 py-4 rounded-full shadow-xl tracking-widest transition-all hover:scale-105 active:scale-95">
                🗺️ Ouvrir la carte interactive
              </Link>
            </div>
          )}

          <section className="mb-10">
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">Recherches liées à {city.name}</h2>
            <div className="flex flex-wrap gap-2">
              {city.searchTerms.map(term => (
                <span key={term} className="text-[10px] px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground font-bold uppercase tracking-widest hover:border-brand/30 hover:text-brand transition-colors cursor-default">
                  {term}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tighter mb-6">Questions fréquentes — garages moto à {city.name}</h2>
            <div className="space-y-4">
              {city.faq.map(({ q, a }, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border/50 shadow-sm p-5 md:p-6">
                  <h3 className="font-black text-foreground mb-2 text-sm md:text-base uppercase tracking-tight">{q}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">Trouver un garage par marque à {city.name}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {(['honda','yamaha','kawasaki','suzuki','bmw','triumph','ducati','harley-davidson','royal-enfield','ktm','cf-moto','zontes','voge','piaggio','vespa'] as const).map(slug => (
                <Link key={slug} href={`/marque/${slug}`} className="text-[10px] px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:border-brand hover:text-brand font-black uppercase tracking-widest transition-all">
                  {slug.replace(/-/g,' ')}
                </Link>
              ))}
            </div>
            <Link href="/marque/multimarque" className="text-[10px] text-brand font-black uppercase tracking-widest hover:underline">
              → Voir tous les concessionnaires multimarques
            </Link>
          </section>
          {cityBrands.length > 0 && (
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
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-3">Garages moto dans d&apos;autres villes</h2>
            <div className="flex flex-wrap gap-2">
              {otherCities.map(c => (
                <Link key={c.slug} href={`/garages-moto/${c.slug}`} className="text-[10px] px-4 py-2 rounded-full border-2 border-border/50 hover:border-brand text-muted-foreground hover:text-brand font-black uppercase tracking-widest transition-all hover:scale-105">
                  {c.name}
                </Link>
              ))}
            </div>
          </section>

          <div className="rounded-[2.5rem] bg-white border-2 border-brand/20 shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <div className="inline-block bg-brand/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-brand font-black text-[10px] uppercase tracking-[0.3em]">Espace Pro</span>
              </div>
              <h2 className="font-black text-foreground text-2xl md:text-3xl uppercase tracking-tighter mb-3">Professionnel moto à {city.name} ?</h2>
              <p className="text-muted-foreground font-bold text-sm mb-6 max-w-md mx-auto">Rejoignez LabelMoto gratuitement et soyez trouvé par les motards de votre région.</p>
              <Link href="/pro/register" className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white font-black uppercase text-xs px-10 py-5 rounded-full shadow-2xl tracking-widest transition-all hover:scale-105 active:scale-95 border-4 border-brand/20">
                🔘 Créer ma fiche — 100% gratuit
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

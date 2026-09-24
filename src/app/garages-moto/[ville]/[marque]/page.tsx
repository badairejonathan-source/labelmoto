import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug } from '@/app/lib/cities';
import { getAllBrandSlugs, getBrandBySlug } from '@/app/lib/brands';
import { professionalMatchesCategory } from '@/app/lib/professional-categories';
import fsNode from 'fs';
import pathNode from 'path';
import { loadSeoPros, type SeoPro } from '@/lib/seo-pros';

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

type GarageCity =
  NonNullable<ReturnType<typeof getCityBySlug>>;

interface GeoPoint {
  id: string;
  lat: number;
  lng: number;
  t: string;
  s: string;
  a: string;
  c: string;
  r?: string;
  d?: string;
  b?: string[];
}

let _cachedPoints: GeoPoint[] | null = null;

let _cachedCoords:
  Record<
    string,
    { lat: number; lng: number }
  > | null = null;

function loadPointsData(): GeoPoint[] {
  if (!_cachedPoints) {
    const filePath =
      pathNode.join(
        process.cwd(),
        'public',
        'points.json'
      );

    _cachedPoints =
      JSON.parse(
        fsNode.readFileSync(
          filePath,
          'utf8'
        )
      );
  }

  return _cachedPoints!;
}

function loadCityCoordsData():
  Record<
    string,
    { lat: number; lng: number }
  > {
  if (!_cachedCoords) {
    const filePath =
      pathNode.join(
        process.cwd(),
        'src',
        'app',
        'lib',
        'cities-coords.json'
      );

    _cachedCoords =
      JSON.parse(
        fsNode.readFileSync(
          filePath,
          'utf8'
        )
      );
  }

  return _cachedCoords!;
}

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;

  const dLat =
    (lat2 - lat1) *
    Math.PI /
    180;

  const dLng =
    (lng2 - lng1) *
    Math.PI /
    180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

const RADIUS_KM_DEFAULT = 25;
const RADIUS_KM_FALLBACK = 50;
const MIN_RESULTS_BEFORE_FALLBACK = 5;

function normalizeParisSeoText(
  value: unknown
): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function isParisGarageSeoPoint(
  p: GeoPoint
): boolean {
  const source = {
    title: p.t,
    category: p.c,
    appSection: p.a,
    collection: 'concessions' as const,
  };

  if (
    professionalMatchesCategory(
      source,
      'ateliers-mecaniciens'
    ) ||
    professionalMatchesCategory(
      source,
      'concessionnaires-revendeurs'
    )
  ) {
    return true;
  }

  const category =
    normalizeParisSeoText(p.c);

  const title =
    normalizeParisSeoText(p.t);

  const brands =
    Array.isArray(p.b)
      ? p.b.filter(Boolean)
      : [];

  if (
    category === 'concession' &&
    (
      brands.length > 0 ||
      /(moto|scoot|2 roues|deux roues)/.test(title)
    )
  ) {
    return true;
  }

  if (
    category === 'magasin' &&
    /(moto|scoot)/.test(title)
  ) {
    return true;
  }

  if (
    category ===
      'atelier de mecanique automobile' &&
    brands.length > 0 &&
    /(moto|scoot|harley|workshop|2 roues|deux roues)/.test(title)
  ) {
    return true;
  }

  return false;
}

function getPointsNearCity(
  city: GarageCity
): GeoPoint[] {
  const coordsMap =
    loadCityCoordsData();

  const cityCoord =
    coordsMap[city.slug];

  const points =
    loadPointsData();

  /*
   * Paris garde exactement le perimetre SEO
   * valide aujourd'hui : departement 75 +
   * garages / ateliers / concessions pertinents.
   */
  if (city.slug === 'paris') {
    const parisPoints =
      points.filter(
        p =>
          p.d === city.departement &&
          isParisGarageSeoPoint(p)
      );

    if (!cityCoord) {
      return parisPoints;
    }

    return parisPoints.sort(
      (a, b) =>
        haversineKm(
          cityCoord.lat,
          cityCoord.lng,
          a.lat,
          a.lng
        ) -
        haversineKm(
          cityCoord.lat,
          cityCoord.lng,
          b.lat,
          b.lng
        )
    );
  }

  /*
   * Comportement historique de secours :
   * si la ville n'a pas de coordonnees,
   * garder le departement.
   */
  if (!cityCoord) {
    return points.filter(
      p =>
        p.d === city.departement
    );
  }

  let radius =
    RADIUS_KM_DEFAULT;

  let nearby =
    points.filter(
      p =>
        haversineKm(
          cityCoord.lat,
          cityCoord.lng,
          p.lat,
          p.lng
        ) <= radius
    );

  if (
    nearby.length <
    MIN_RESULTS_BEFORE_FALLBACK
  ) {
    radius =
      RADIUS_KM_FALLBACK;

    nearby =
      points.filter(
        p =>
          haversineKm(
            cityCoord.lat,
            cityCoord.lng,
            p.lat,
            p.lng
          ) <= radius
      );
  }

  return nearby.sort(
    (a, b) =>
      haversineKm(
        cityCoord.lat,
        cityCoord.lng,
        a.lat,
        a.lng
      ) -
      haversineKm(
        cityCoord.lat,
        cityCoord.lng,
        b.lat,
        b.lng
      )
  );
}

function collectionForPoint(
  p: GeoPoint
): SeoPro['collection'] {
  if (p.a === 'association') {
    return 'associations';
  }

  if (p.a === 'relais') {
    return 'relais';
  }

  if (p.a === 'creator') {
    return 'creators';
  }

  return 'concessions';
}

async function getCityScopedPros(
  ville: string
): Promise<SeoPro[]> {
  const allPros =
    await loadSeoPros();

  const city =
    getCityBySlug(ville);

  /*
   * Important :
   * les anciennes pages ville+marque de communes
   * qui n'ont pas de page ville dediee continuent
   * de fonctionner avec leur logique historique.
   */
  if (!city) {
    return allPros.filter(
      pro =>
        pro.collection === 'concessions' &&
        extractCity(
          pro.address || ''
        ).slug === ville
    );
  }

  const nearby =
    getPointsNearCity(city);

  if (nearby.length === 0) {
    return [];
  }

  const byKey =
    new Map(
      allPros.map(
        pro => [
          pro.collection +
            '/' +
            pro.id,
          pro,
        ]
      )
    );

  return nearby
    .map(
      point =>
        byKey.get(
          collectionForPoint(point) +
            '/' +
            point.id
        )
    )
    .filter(
      (pro): pro is SeoPro =>
        Boolean(pro)
    );
}

function resolveBrandName(
  pros: SeoPro[],
  brandSlug: string
): string | null {
  for (const pro of pros) {
    if (
      pro.collection !==
      'concessions'
    ) {
      continue;
    }

    const match =
      pro.brands.find(
        brand =>
          toSlug(brand) ===
          brandSlug
      );

    if (match) {
      return match;
    }
  }

  return (
    BRAND_SLUGS[brandSlug] ||
    null
  );
}

function resolveNationalBrandSlug(
  brandName: string,
  requestedSlug: string
): string | null {
  const direct =
    getBrandBySlug(
      requestedSlug
    );

  if (direct) {
    return direct.slug;
  }

  const target =
    toSlug(brandName);

  for (
    const slug
    of getAllBrandSlugs()
  ) {
    const brand =
      getBrandBySlug(slug);

    if (!brand) {
      continue;
    }

    const values = [
      brand.slug,
      brand.name,
      brand.displayName,
      brand.firestoreValue,
    ];

    if (
      values.some(
        value =>
          value &&
          toSlug(
            String(value)
          ) === target
      )
    ) {
      return brand.slug;
    }
  }

  return null;
}


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

  const city = getCityBySlug(ville);

  const scopedPros =
    await getCityScopedPros(ville);

  const brandName =
    resolveBrandName(
      scopedPros,
      marque
    );

  if (!brandName) notFound();

  const canonicalBrandSlug =
    toSlug(brandName);

  const nationalBrandSlug =
    resolveNationalBrandSlug(
      brandName,
      marque
    );

  const villeDisplay =
    city?.name ||
    ville
      .split('-')
      .map(
        (w: string) =>
          w.charAt(0).toUpperCase() +
          w.slice(1)
      )
      .join(' ');

  const pros =
    scopedPros.filter(pro => {
      if (
        pro.collection !==
        'concessions'
      ) {
        return false;
      }

      return pro.brands.some(
        brand =>
          toSlug(brand) ===
          canonicalBrandSlug
      );
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
          <Link href={nationalBrandSlug ? `/marque/${nationalBrandSlug}` : `/map?search=${encodeURIComponent(brandName)}`} className="text-brand font-black text-sm hover:underline">
            → Voir tous les concessionnaires {brandName}
          </Link>
        </div>
      </div>
    </main>
  );
}

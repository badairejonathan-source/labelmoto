import { loadPublicMapPoints } from '@/lib/public-map-points';

export interface PublicSeoPro {
  id: string;
  collection: 'concessions' | 'associations' | 'relais' | 'creators';
  title: string;
  slug: string;
  address: string;
  category: string;
  phoneNumber?: string;
  website?: string;
  rating: number | null;
  reviewCount: number | null;
  brands: string[];
  departement: string;
  country: string;
  appSection: string;
  latitude: number | null;
  longitude: number | null;
  isMultibrand: boolean;
}

const PUBLIC_SEO_PROS_URL =
  'https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public/seo-pros.json';

let publicSeoProsPromise: Promise<PublicSeoPro[]> | null = null;

function collectionFromSection(
  section: string
): PublicSeoPro['collection'] {
  if (section === 'association') return 'associations';
  if (section === 'relais') return 'relais';
  if (section === 'creator') return 'creators';

  return 'concessions';
}

async function fetchSeoPros(): Promise<PublicSeoPro[]> {
  const response = await fetch(PUBLIC_SEO_PROS_URL, {
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(
      `seo-pros.json HTTP ${response.status}`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Format seo-pros.json invalide');
  }

  return data.map((p: any) => ({
    id: String(p.id || ''),
    collection: String(
      p.collection ||
        collectionFromSection(String(p.appSection || 'shopping'))
    ) as PublicSeoPro['collection'],
    title: String(p.title || p.id || ''),
    slug: String(p.slug || p.id || ''),
    address: String(p.address || ''),
    category: String(p.category || ''),
    phoneNumber: p.phoneNumber || undefined,
    website: p.website || undefined,
    rating:
      p.rating === null ||
      p.rating === undefined ||
      p.rating === ''
        ? null
        : Number(p.rating),
    reviewCount:
      p.reviewCount === null ||
      p.reviewCount === undefined ||
      p.reviewCount === ''
        ? null
        : Number(p.reviewCount),
    brands: Array.isArray(p.brands) ? p.brands : [],
    departement: String(p.departement || ''),
    country: String(p.country || ''),
    appSection: String(p.appSection || 'shopping'),
    latitude:
      p.latitude === null ||
      p.latitude === undefined ||
      p.latitude === ''
        ? null
        : Number.isFinite(Number(p.latitude))
          ? Number(p.latitude)
          : null,
    longitude:
      p.longitude === null ||
      p.longitude === undefined ||
      p.longitude === ''
        ? null
        : Number.isFinite(Number(p.longitude))
          ? Number(p.longitude)
          : null,
    isMultibrand:
      p.isMultibrand === true ||
      (Array.isArray(p.brands) && p.brands.length >= 2),
  }));
}

async function fallbackFromMapPoints(): Promise<PublicSeoPro[]> {
  const points = await loadPublicMapPoints();

  return points.map(point => ({
    id: point.id,
    collection: collectionFromSection(point.appSection),
    title: point.title,
    slug: point.slug,
    address: point.address,
    category: point.category,
    rating:
      point.rating === null
        ? null
        : Number(point.rating),
    reviewCount: null,
    brands: point.brands,
    departement: '',
    country: '',
    appSection: point.appSection,
    latitude: point.latitude,
    longitude: point.longitude,
    isMultibrand: point.brands.length >= 2,
  }));
}

export function loadPublicSeoPros(): Promise<PublicSeoPro[]> {
  if (!publicSeoProsPromise) {
    publicSeoProsPromise = fetchSeoPros()
      .catch(() => fallbackFromMapPoints())
      .then(pros =>
        pros
          .filter(pro => pro.id && pro.collection)
          .sort((a, b) =>
            a.title.localeCompare(b.title, 'fr')
          )
      )
      .catch(error => {
        publicSeoProsPromise = null;
        throw error;
      });
  }

  return publicSeoProsPromise;
}

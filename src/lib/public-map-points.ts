export interface PublicMapPoint {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  slug: string;
  appSection: string;
  category: string;
  rating: number | null;
  imgUrl: string | null;
  address: string;
  locationMode?: 'physical' | 'city';
  departement?: string;
  brands: string[];
}

const PUBLIC_POINTS_URL =
  '/points.json';

const PUBLIC_POINTS_REMOTE_URL =
  'https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public/points.json';

let publicMapPointsPromise: Promise<PublicMapPoint[]> | null = null;
let publicMapPointsExpiresAt = 0;
const PUBLIC_INDEX_TTL_MS = 30_000;

async function fetchPointsJson(url: string): Promise<any[]> {
  const response = await fetch(url, { cache: url === PUBLIC_POINTS_REMOTE_URL ? 'no-cache' : 'force-cache' });

  if (!response.ok) {
    throw new Error(`points.json HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Format points.json invalide');
  }

  return data;
}

export function loadPublicMapPoints(): Promise<PublicMapPoint[]> {
  if (!publicMapPointsPromise || Date.now() >= publicMapPointsExpiresAt) {
    publicMapPointsExpiresAt = Date.now() + PUBLIC_INDEX_TTL_MS;
    publicMapPointsPromise = fetchPointsJson(PUBLIC_POINTS_REMOTE_URL)
      .catch(error => {
        // Une copie locale figee peut contenir une fiche retiree.
        // On garde le mode hors-ligne UNIQUEMENT en developpement.
        if (process.env.NODE_ENV !== 'production') return fetchPointsJson(PUBLIC_POINTS_URL);
        throw error;
      })
      .then(data =>
        data
          .map((p: any): PublicMapPoint => ({
            id: String(p.id || ''),
            latitude: Number(p.lat),
            longitude: Number(p.lng),
            title: String(p.t || p.id || ''),
            slug: String(p.s || p.id || ''),
            appSection: String(p.a || 'shopping'),
            category: String(p.c || 'concession'),
            rating: p.r ?? null,
            imgUrl: p.i || null,
            address: String(p.addr || ''),
            locationMode: p.lm === 'city' ? 'city' : (p.lm === 'physical' ? 'physical' : undefined),
            departement: String(p.d || ''),
            brands: Array.isArray(p.b) ? p.b : [],
          }))
          .filter(
            (p: PublicMapPoint) =>
              p.id &&
              Number.isFinite(p.latitude) &&
              Number.isFinite(p.longitude)
          )
      )
      .catch(error => {
        publicMapPointsPromise = null;
        publicMapPointsExpiresAt = 0;
        throw error;
      });
  }

  return publicMapPointsPromise;
}

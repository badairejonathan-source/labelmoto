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
  brands: string[];
}

const PUBLIC_POINTS_URL =
  'https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public/points.json';

let publicMapPointsPromise: Promise<PublicMapPoint[]> | null = null;

async function fetchPointsJson(url: string): Promise<any[]> {
  const response = await fetch(url, { cache: 'force-cache' });

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
  if (!publicMapPointsPromise) {
    publicMapPointsPromise = fetchPointsJson(PUBLIC_POINTS_URL)
      .catch(() => fetchPointsJson('/points.json'))
      .then(data =>
        data
          .map((p: any) => ({
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
        throw error;
      });
  }

  return publicMapPointsPromise;
}

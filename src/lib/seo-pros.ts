import fs from 'fs';
import path from 'path';
import { getAdminFirestore } from '@/lib/firebase-admin';

export interface SeoPro {
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
  updatedAt?: string | null;
}

const SEO_PROS_URL =
  'https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public/seo-pros.json';

let seoProsPromise: Promise<SeoPro[]> | null = null;

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function collectionFromSection(
  section: string
): SeoPro['collection'] {
  if (section === 'association') return 'associations';
  if (section === 'relais') return 'relais';
  if (section === 'creator') return 'creators';
  return 'concessions';
}

async function fetchSeoPros(): Promise<SeoPro[]> {
  const response = await fetch(SEO_PROS_URL, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`seo-pros.json HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Format seo-pros.json invalide');
  }

  return data as SeoPro[];
}

async function loadFromFirestore(): Promise<SeoPro[]> {
  const db = getAdminFirestore();

  const collections = [
    'concessions',
    'associations',
    'relais',
    'creators',
  ] as const;

  const snapshots = await Promise.all(
    collections.map(collectionName =>
      db.collection(collectionName).get()
    )
  );

  const result: SeoPro[] = [];

  snapshots.forEach((snapshot, index) => {
    const collectionName = collections[index];

    snapshot.docs.forEach(doc => {
      const d = doc.data();
      const lat = numberOrNull(d.latitude ?? d.position?.[0]);
      const lng = numberOrNull(d.longitude ?? d.position?.[1]);
      const brands = Array.isArray(d.brands) ? d.brands : [];

      result.push({
        id: doc.id,
        collection: collectionName,
        title: d.title || doc.id,
        slug: d.slug || doc.id,
        address: d.address || '',
        category: d.category || '',
        phoneNumber: d.phoneNumber || undefined,
        website: d.website || undefined,
        rating: numberOrNull(d.rating),
        reviewCount: numberOrNull(d.reviewCount),
        brands,
        departement: d.departement || '',
        country: d.country || '',
        appSection:
          d.appSection ||
          (collectionName === 'associations'
            ? 'association'
            : collectionName === 'relais'
              ? 'relais'
              : collectionName === 'creators'
                ? 'creator'
                : 'shopping'),
        latitude: lat,
        longitude: lng,
        isMultibrand:
          d.isMultibrand === true || brands.length >= 2,
        updatedAt:
          d.updatedAt?.toDate?.().toISOString?.() ||
          d.publishedAt?.toDate?.().toISOString?.() ||
          d.timestamp?.toDate?.().toISOString?.() ||
          null,
      });
    });
  });

  return result;
}

function loadFromLocalPoints(): SeoPro[] {
  const file = path.join(process.cwd(), 'public', 'points.json');

  if (!fs.existsSync(file)) return [];

  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (!Array.isArray(raw)) return [];

  return raw.map((p: any) => {
    const brands = Array.isArray(p.b) ? p.b : [];
    const appSection = String(p.a || 'shopping');

    return {
      id: String(p.id || ''),
      collection: collectionFromSection(appSection),
      title: String(p.t || p.id || ''),
      slug: String(p.s || p.id || ''),
      address: String(p.addr || ''),
      category: String(p.c || ''),
      rating: numberOrNull(p.r),
      reviewCount: null,
      brands,
      departement: String(p.d || ''),
      country: '',
      appSection,
      latitude: numberOrNull(p.lat),
      longitude: numberOrNull(p.lng),
      isMultibrand: brands.length >= 2,
    };
  });
}

export async function loadSeoPros(): Promise<SeoPro[]> {
  if (!seoProsPromise) {
    seoProsPromise = fetchSeoPros().catch(async remoteError => {
      // En développement on évite volontairement un scan Firestore
      // simplement pour afficher une page SEO locale.
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '[SEO] index distant indisponible, fallback points.json local'
        );

        return loadFromLocalPoints();
      }

      // Premier déploiement : seo-pros.json peut ne pas encore exister.
      // Un seul chargement Firestore par processus permet de construire
      // les pages, puis le prochain rebuild produira l'index permanent.
      try {
        console.warn(
          '[SEO] index distant indisponible, fallback Firestore:',
          remoteError
        );

        return await loadFromFirestore();
      } catch (firestoreError) {
        console.error(
          '[SEO] fallback Firestore impossible:',
          firestoreError
        );

        return loadFromLocalPoints();
      }
    });
  }

  return seoProsPromise;
}

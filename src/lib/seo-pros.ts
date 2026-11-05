import fs from 'fs';
import path from 'path';
import { getStorage } from 'firebase-admin/storage';
import { getAdminApp } from '@/lib/firebase-admin';

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

let metierSeoProsPromise: Promise<SeoPro[]> | null = null;
let metierSeoProsExpiresAt = 0;

const METIER_SEO_PROS_CACHE_MS = 60_000;

const SEO_PROS_BUCKET =
  'studio-4801889514-40ebd.firebasestorage.app';

const SEO_PROS_OBJECT =
  'public/seo-pros.json';

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

async function fetchSeoPros(fresh: boolean): Promise<SeoPro[]> {
  const response = await fetch(SEO_PROS_URL, fresh
    ? { cache: 'no-store' }
    : { next: { revalidate: 30 } });

  if (!response.ok) {
    throw new Error(`seo-pros.json HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Format seo-pros.json invalide');
  }

  return data as SeoPro[];
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

async function loadMetierSeoProsFromStorage(): Promise<SeoPro[]> {
  const bucket =
    getStorage(
      getAdminApp()
    ).bucket(
      SEO_PROS_BUCKET
    );

  const [buffer] =
    await bucket
      .file(
        SEO_PROS_OBJECT
      )
      .download();

  const data =
    JSON.parse(
      buffer.toString(
        'utf8'
      )
    );

  if (!Array.isArray(data)) {
    throw new Error(
      'Format seo-pros.json invalide'
    );
  }

  return data as SeoPro[];
}

export async function loadMetierSeoPros(): Promise<SeoPro[]> {
  const now =
    Date.now();

  if (
    !metierSeoProsPromise ||
    now >= metierSeoProsExpiresAt
  ) {
    metierSeoProsExpiresAt =
      now +
      METIER_SEO_PROS_CACHE_MS;

    metierSeoProsPromise =
      loadMetierSeoProsFromStorage()
        .catch(storageError => {
          // Production: ne jamais lancer un scan massif Firestore ou lire
          // l'index local potentiellement obsolete apres un retrait.
          if (process.env.NODE_ENV === 'production') {
            console.error('[METIERS] index indisponible : affichage interrompu');
            throw storageError;
          }
          return loadFromLocalPoints();
        })
        .catch(error => {
          metierSeoProsPromise =
            null;

          metierSeoProsExpiresAt =
            0;

          throw error;
        });
  }

  return metierSeoProsPromise;
}

/** Lecture fraiche pour sitemap apres retrait, cache court ailleurs. */
export async function loadSeoPros(options: { fresh?: boolean } = {}): Promise<SeoPro[]> {
  try {
    return await fetchSeoPros(options.fresh === true);
  } catch (remoteError) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[SEO] index distant indisponible, fallback local developpement');
      return loadFromLocalPoints();
    }
    // Un fallback local peut ressusciter une fiche effacee.
    // Refuser l'affichage plutot que servir un index obsolete.
    console.error('[SEO] index distant indisponible : refus du fallback obsolete');
    throw remoteError;
  }
}

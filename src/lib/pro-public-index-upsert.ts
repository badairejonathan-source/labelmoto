/** Transformation pure des index publics. Aucune connexion Firebase. */
export type IndexCollection = 'concessions' | 'associations' | 'relais' | 'creators';
export type IndexEntry = Record<string, unknown> & { id: string };

const COLLECTIONS = new Set<IndexCollection>(['concessions', 'associations', 'relais', 'creators']);
const LIMIT = 20000;

export function validIndexTarget(collection: unknown, id: unknown):
  { collection: IndexCollection; id: string } | null {
  if (typeof collection !== 'string' || !COLLECTIONS.has(collection as IndexCollection)) return null;
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_.-]{1,200}$/.test(id)) return null;
  return { collection: collection as IndexCollection, id };
}

function asEntries(value: unknown, kind: string): IndexEntry[] {
  if (!Array.isArray(value) || value.length > LIMIT) throw Error(`INDEX_${kind}_FORMAT_OR_LIMIT`);
  if (value.some(x => !x || typeof x !== 'object' || Array.isArray(x) ||
      typeof x.id !== 'string' || !/^[a-zA-Z0-9_.-]{1,200}$/.test(x.id))) {
    throw Error(`INDEX_${kind}_INVALID_ENTRY`);
  }
  return value as IndexEntry[];
}

const finite = (value: unknown): number | null => {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

function section(collection: IndexCollection): string {
  return { concessions: 'shopping', associations: 'association', relais: 'relais', creators: 'creator' }[collection];
}

export function preparePublicIndexUpsert(
  pointsInput: unknown, seoInput: unknown, collection: IndexCollection, id: string,
  data: Record<string, unknown>,
): { points: IndexEntry[]; seo: IndexEntry[]; pointPresent: boolean } {
  const points = asEntries(pointsInput, 'POINTS');
  const seo = asEntries(seoInput, 'SEO');
  const target = validIndexTarget(collection, id);
  if (!target) throw Error('INDEX_TARGET_INVALID');
  const existingSeoSameId = seo.filter(x => x.id === id);
  if (existingSeoSameId.some(x => x.collection !== collection)) throw Error('INDEX_ID_SHARED_WITH_OTHER_COLLECTION');
  if (existingSeoSameId.length > 1 || points.filter(x => x.id === id).length > 1) {
    throw Error('INDEX_DUPLICATE_ID_MANUAL_REVIEW');
  }
  if (points.some(x => x.id === id && typeof x.collection === 'string' && x.collection !== collection)) {
    throw Error('INDEX_POINT_COLLISION_MANUAL_REVIEW');
  }

  const title = String(data.title || id);
  const slug = String(data.slug || id);
  const address = String(data.address || '');
  const category = String(data.category || '');
  const appSection = String(data.appSection || section(collection));
  const brands = Array.isArray(data.brands) ? data.brands.filter(x => typeof x === 'string') : [];
  const lat = finite(data.latitude ?? (Array.isArray(data.position) ? data.position[0] : null));
  const lng = finite(data.longitude ?? (Array.isArray(data.position) ? data.position[1] : null));
  const previousSeo = existingSeoSameId[0];
  const updatedSeo: IndexEntry = {
    ...(previousSeo || {}), id, collection, title, slug, address, category,
    phoneNumber: data.phoneNumber || undefined, website: data.website || undefined,
    rating: finite(data.rating), reviewCount: finite(data.reviewCount), brands,
    departement: String(data.departement || ''), country: String(data.country || ''),
    appSection, latitude: lat, longitude: lng,
    isMultibrand: data.isMultibrand === true || brands.length >= 2,
    updatedAt: new Date().toISOString(),
  };
  const updatedPoints = points.filter(x => x.id !== id);
  if (lat !== null && lng !== null) {
    const p: IndexEntry = {
      id, lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)),
      t: title, s: slug, a: appSection, c: category.slice(0, 40),
      addr: address.replace(/\r?\n/g, ' ').slice(0, 60),
    };
    if (finite(data.rating) !== null) p.r = finite(data.rating);
    if (data.imageUrl || data.imgUrl) p.i = data.imageUrl || data.imgUrl;
    if (brands.length) p.b = brands;
    if (data.departement) p.d = data.departement;
    if (data.locationMode === 'city' || data.locationMode === 'physical') p.lm = data.locationMode;
    updatedPoints.push(p);
  }
  const updatedSeoList = seo.filter(x => !(x.id === id && x.collection === collection));
  updatedSeoList.push(updatedSeo);
  // Invariants : ne modifier aucune entrée différente de la cible.
  if (updatedPoints.length !== points.length - points.filter(x => x.id === id).length + (lat !== null && lng !== null ? 1 : 0))
    throw Error('INDEX_POINTS_COUNT_INVALID');
  if (updatedSeoList.length !== seo.length - existingSeoSameId.length + 1)
    throw Error('INDEX_SEO_COUNT_INVALID');
  return { points: updatedPoints, seo: updatedSeoList, pointPresent: lat !== null && lng !== null };
}

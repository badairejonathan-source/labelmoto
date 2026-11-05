/**
 * Transformation pure des index publics Label Moto.
 * Aucune lecture réseau ni écriture. Fail-closed en cas d'ID non désambiguïsé.
 */
export type ProfessionalCollection = 'concessions' | 'associations' | 'relais' | 'creators';
export type JsonItem = Record<string, unknown>;

export const PRO_COLLECTIONS: readonly ProfessionalCollection[] = ['concessions', 'associations', 'relais', 'creators'];

function isRecord(x: unknown): x is JsonItem {
  return !!x && typeof x === 'object' && !Array.isArray(x);
}

function inferCollection(section: unknown): ProfessionalCollection | null {
  if (section === 'association') return 'associations';
  if (section === 'relais') return 'relais';
  if (section === 'creator') return 'creators';
  if (section === 'shopping' || section === 'service' || section === 'both' || section === 'concession') return 'concessions';
  return null;
}

export function pruneIndex(
  kind: 'points' | 'seo',
  source: unknown,
  collection: ProfessionalCollection,
  id: string,
) {
  if (!Array.isArray(source) || source.some(p => !isRecord(p))) {
    throw new Error(`STOP : format ${kind}.json inattendu`);
  }
  const entries = source as JsonItem[];
  let removed = 0;
  const kept = entries.filter((item) => {
    if (item.id !== id) return true;
    const explicit = kind === 'seo' ? item.collection : undefined;
    // Le code actuel reconstruit points.json avec `a` et seo-pros.json avec `collection`.
    const owner = typeof explicit === 'string' && explicit.length > 0
      ? (PRO_COLLECTIONS.includes(explicit as ProfessionalCollection) ? explicit : null)
      : inferCollection(kind === 'points' ? item.a : item.appSection);
    if (!owner) {
      throw new Error(`STOP : ID ${id} présent, mais catégorie ambiguë dans ${kind}.json`);
    }
    if (owner !== collection) return true;
    removed += 1;
    return false;
  });
  return { entries: kept, removed, before: entries.length, after: kept.length };
}

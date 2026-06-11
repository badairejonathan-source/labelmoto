/**
 * @fileOverview Utilitaire léger pour la gestion des Geohashes (Standard Base32).
 * Permet de convertir des coordonnées en hash et de calculer les couvertures de zones.
 */

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

/**
 * Encode des coordonnées en Geohash.
 */
export function encodeGeohash(lat: number, lng: number, precision: number = 9): string {
  let minLat = -90, maxLat = 90;
  let minLng = -180, maxLng = 180;
  let geohash = '';
  let bit = 0;
  let ch = 0;
  let isEven = true;

  while (geohash.length < precision) {
    if (isEven) {
      const mid = (minLng + maxLng) / 2;
      if (lng > mid) {
        ch |= (1 << (4 - bit));
        minLng = mid;
      } else {
        maxLng = mid;
      }
    } else {
      const mid = (minLat + maxLat) / 2;
      if (lat > mid) {
        ch |= (1 << (4 - bit));
        minLat = mid;
      } else {
        maxLat = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}

/**
 * Calcule les Geohashes nécessaires pour couvrir un rectangle (viewport).
 */
export function getGeohashCells(south: number, west: number, north: number, east: number, precision: number = 4): string[] {
  const hashes = new Set<string>();
  const step = precision === 4 ? 0.15 : 0.04;

  for (let lat = south - step/2; lat <= north + step; lat += step) {
    for (let lng = west - step/2; lng <= east + step; lng += step) {
      const safeLat = Math.min(89.9, Math.max(-89.9, lat));
      const safeLng = Math.min(179.9, Math.max(-179.9, lng));
      hashes.add(encodeGeohash(safeLat, safeLng, precision));
    }
  }
  
  return Array.from(hashes);
}

/**
 * Extrait et valide des coordonnées numériques de manière ultra-robuste.
 * Gère les types string, number, les virgules, les tableaux et les objets imbriqués.
 */
export function extractValidCoordinates(data: any): { lat: number; lng: number } | null {
  if (!data) return null;

  // 1. Recherche exhaustive des champs potentiels
  let rawLat: any = 
    data.latitude ?? 
    data.lat ?? 
    data.lat_deg ??
    data.location?.lat ?? 
    data.location?.latitude ??
    data.coords?.latitude ??
    data.pos?.lat ?? 
    (Array.isArray(data.position) ? data.position[0] : null) ??
    (Array.isArray(data.coordinates) ? data.coordinates[1] : null); // Note: GeoJSON est [lng, lat]

  let rawLng: any = 
    data.longitude ?? 
    data.lng ?? 
    data.lon ??
    data.long ??
    data.lng_deg ??
    data.location?.lng ?? 
    data.location?.longitude ??
    data.coords?.longitude ??
    data.pos?.lng ?? 
    (Array.isArray(data.position) ? data.position[1] : null) ??
    (Array.isArray(data.coordinates) ? data.coordinates[0] : null);

  // 2. Fonction de parsing robuste (gère les virgules et espaces)
  const parse = (v: any): number => {
    if (v === undefined || v === null || v === "") return NaN;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
        // Remplacer virgule par point et supprimer espaces
        return parseFloat(v.replace(',', '.').replace(/\s/g, ''));
    }
    return NaN;
  };

  const lat = parse(rawLat);
  const lng = parse(rawLng);

  // 3. Validation géographique stricte
  if (!isNaN(lat) && !isNaN(lng)) {
    // Exclure (0,0) souvent erroné
    if (lat === 0 && lng === 0) return null;
    
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  return null;
}

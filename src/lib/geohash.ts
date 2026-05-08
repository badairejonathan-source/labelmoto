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
 * @param south Latitude sud
 * @param west Longitude ouest
 * @param north Latitude nord
 * @param east Longitude est
 * @param precision Longueur du hash (4 = ~20km, 5 = ~5km)
 */
export function getGeohashCells(south: number, west: number, north: number, east: number, precision: number = 4): string[] {
  const hashes = new Set<string>();
  
  // Échantillonnage adapté à la précision demandée
  // Précision 4 (~20km) : pas de 0.15 degré
  // Précision 5 (~5km) : pas de 0.04 degré
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
 * Extrait et valide des coordonnées numériques depuis un objet de données hétérogène.
 * Gère les types string, number, les virgules et les objets imbriqués.
 */
export function extractValidCoordinates(data: any): { lat: number; lng: number } | null {
  if (!data) return null;

  let lat: number | null = null;
  let lng: number | null = null;

  const rawLat = data.latitude ?? data.lat ?? data.location?.lat;
  const rawLng = data.longitude ?? data.lng ?? data.location?.lng;

  if (rawLat !== undefined && rawLat !== null) {
    lat = typeof rawLat === 'number' ? rawLat : parseFloat(String(rawLat).replace(',', '.'));
  }
  if (rawLng !== undefined && rawLng !== null) {
    lng = typeof rawLng === 'number' ? rawLng : parseFloat(String(rawLng).replace(',', '.'));
  }

  if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
    // Vérification des bornes géographiques valides
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  return null;
}
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
 * @param bounds Bounds de la carte (Leaflet)
 * @param precision Longueur du hash (4 = ~20km, 5 = ~5km)
 */
export function getGeohashCells(south: number, west: number, north: number, east: number, precision: number = 4): string[] {
  const hashes = new Set<string>();
  // On échantillonne la zone pour trouver les prefixes uniques
  // Pour la précision 4, un pas de 0.2 degré est suffisant pour ne rater aucune cellule
  const step = precision === 4 ? 0.2 : 0.05;

  for (let lat = south; lat <= north + step; lat += step) {
    for (let lng = west; lng <= east + step; lng += step) {
      hashes.add(encodeGeohash(Math.min(90, Math.max(-90, lat)), Math.min(180, Math.max(-180, lng)), precision));
    }
  }
  return Array.from(hashes);
}

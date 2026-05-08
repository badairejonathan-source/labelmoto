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
  
  // Le pas (step) doit être plus petit que la taille de la cellule pour ne rien rater.
  // Précision 4 (20km) -> pas de 0.15 deg (~16km)
  // Précision 5 (5km) -> pas de 0.04 deg (~4.4km)
  const step = precision === 4 ? 0.15 : 0.04;

  // On boucle avec une marge de sécurité pour inclure les bords
  for (let lat = south - step/2; lat <= north + step; lat += step) {
    for (let lng = west - step/2; lng <= east + step; lng += step) {
      const safeLat = Math.min(89.9, Math.max(-89.9, lat));
      const safeLng = Math.min(179.9, Math.max(-179.9, lng));
      hashes.add(encodeGeohash(safeLat, safeLng, precision));
    }
  }
  
  return Array.from(hashes);
}

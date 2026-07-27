import { NextRequest, NextResponse } from 'next/server';

// Forcer Node.js runtime pour accès aux modules https/http natifs
export const runtime = 'nodejs';
import * as https from 'https';
import * as http from 'http';

// Suivre une redirection HTTP avec les bons headers
async function followRedirect(url: string): Promise<string> {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        resolve(res.headers.location);
      } else {
        resolve(url);
      }
      res.resume();
    });
    req.on('error', () => resolve(url));
    req.setTimeout(5000, () => { req.destroy(); resolve(url); });
  });
}

// Extraire les infos d'une URL Google Maps
function extractFromGoogleMapsUrl(url: string): {
  query?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
} {
  try {
    // Extraire le nom du lieu depuis /maps/place/NAME/@lat,lng
    const placeMatch = url.match(/\/maps\/place\/([^/@?]+)/);
    const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    const query = placeMatch
      ? decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      : undefined;

    const lat = coordsMatch ? parseFloat(coordsMatch[1]) : undefined;
    const lng = coordsMatch ? parseFloat(coordsMatch[2]) : undefined;

    return { query, lat, lng };
  } catch {
    return {};
  }
}

// Formater les horaires Google en jours de la semaine
function formatHoraires(periods: any[]): Record<string, string> {
  const days: Record<number, string> = {
    0: 'dimanche', 1: 'lundi', 2: 'mardi', 3: 'mercredi',
    4: 'jeudi', 5: 'vendredi', 6: 'samedi'
  };
  const result: Record<string, string> = {};
  if (!periods || !periods.length) return result;

  for (const period of periods) {
    const dayName = days[period.open?.day];
    if (!dayName) continue;
    if (!period.close) { result[dayName] = '00:00-23:59'; continue; }
    const fmt = (t: string) => `${t.slice(0, 2)}:${t.slice(2)}`;
    const slot = `${fmt(period.open.time)}-${fmt(period.close.time)}`;
    result[dayName] = result[dayName] ? `${result[dayName]}, ${slot}` : slot;
  }

  // Marquer les jours sans horaire comme Fermé
  [0,1,2,3,4,5,6].forEach(d => {
    if (!result[days[d]]) result[days[d]] = 'Fermé';
  });

  return result;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Clé API Google non configurée.' }, { status: 500 });
  }

  let { url } = await req.json();
  if (!url?.trim()) {
    return NextResponse.json({ error: 'URL manquante.' }, { status: 400 });
  }

  url = url.trim();

  // Suivre la redirection pour les URLs courtes
  if (url.includes('goo.gl') || url.includes('maps.app')) {
    const redirected = await followRedirect(url);
    if (redirected !== url) url = redirected;
  }

  const { query, lat, lng, placeId: extractedPlaceId } = extractFromGoogleMapsUrl(url);

  if (!query && !extractedPlaceId) {
    return NextResponse.json({
      error: 'Impossible d\'extraire les informations de cette URL. Essayez de copier l\'URL depuis la barre d\'adresse de votre navigateur sur Google Maps.'
    }, { status: 400 });
  }

  // Utiliser placeId extrait de l'URL ou recherche textuelle
  let placeId = extractedPlaceId;
  if (!placeId) {
    const locationBias = (lat && lng) ? `&locationbias=circle:500@${lat},${lng}` : '';
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query!)}&inputtype=textquery&fields=place_id,name,formatted_address&language=fr${locationBias}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    if (searchData.status !== 'OK' || !searchData.candidates?.length) {
      return NextResponse.json({ error: `Lieu introuvable. (${searchData.status})` }, { status: 404 });
    }
    placeId = searchData.candidates[0].place_id;
  }

  // Récupérer les détails complets
  const fields = 'name,formatted_address,formatted_phone_number,website,opening_hours,geometry,rating,user_ratings_total,types';
  const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=fr&key=${apiKey}`;

  const detailRes = await fetch(detailUrl);
  const detailData = await detailRes.json();
  const place = detailData.result;

  if (!place) {
    return NextResponse.json({ error: 'Détails introuvables pour ce lieu.' }, { status: 404 });
  }

  const horaires = formatHoraires(place.opening_hours?.periods || []);

  return NextResponse.json({
    title: place.name || '',
    address: place.formatted_address || '',
    phoneNumber: (place.formatted_phone_number || '').replace(/\s/g, ' '),
    website: place.website || '',
    latitude: place.geometry?.location?.lat || null,
    longitude: place.geometry?.location?.lng || null,
    rating: place.rating || null,
    reviewCount: place.user_ratings_total || null,
    placeId,
    ...horaires,
  });
}

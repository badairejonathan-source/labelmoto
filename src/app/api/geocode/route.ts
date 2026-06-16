import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT = 'LabelMoto-Geocoder/1.0 (contact@labelmoto.fr)';

// Extrait lat/lng d'une URL Google Maps (formats @lat,lng, !3d!4d, q=lat,lng)
function extractCoordsFromUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  let m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  m = url.match(/[?&](?:q|query|ll|sll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  return null;
}

async function resolveShortUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': USER_AGENT } });
    return res.url || null;
  } catch {
    return null;
  }
}

async function coordsFromGoogleUrl(url: string): Promise<{ lat: number; lng: number } | null> {
  if (!url || !url.trim()) return null;
  const direct = extractCoordsFromUrl(url);
  if (direct) return direct;
  const isShort = /share\.google|g\.page|maps\.app\.goo\.gl|goo\.gl\/maps/.test(url);
  if (isShort) {
    const resolved = await resolveShortUrl(url);
    if (resolved) return extractCoordsFromUrl(resolved);
  }
  return null;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address || !address.trim()) return null;
  const q = encodeURIComponent(address.trim());
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    const json: any = await res.json();
    if (Array.isArray(json) && json.length > 0) {
      const lat = parseFloat(json[0].lat);
      const lng = parseFloat(json[0].lon);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
  } catch {}
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, placeUrl, googleMapsUrl } = body || {};

    let coords: { lat: number; lng: number } | null = null;
    let source = '';

    // 1. placeUrl (coords directes) puis googleMapsUrl
    const googleUrl = placeUrl || googleMapsUrl;
    if (googleUrl) {
      coords = await coordsFromGoogleUrl(googleUrl);
      if (coords) source = placeUrl ? 'place_url' : 'google_url';
    }

    // 2. Adresse via Nominatim
    if (!coords && address) {
      coords = await geocodeAddress(address);
      if (coords) source = 'nominatim';
    }

    if (!coords) {
      return NextResponse.json({ success: false, error: 'no_coords_found' }, { status: 200 });
    }

    return NextResponse.json({ success: true, lat: coords.lat, lng: coords.lng, source }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

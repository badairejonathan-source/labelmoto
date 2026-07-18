import { NextRequest, NextResponse } from 'next/server';

// Extraire le Place ID ou le nom depuis une URL Google Maps
function extractFromGoogleMapsUrl(url: string): { placeId?: string; query?: string } {
  try {
    // Format: /maps/place/Nom+du+lieu/... ou ?cid=...
    const cid = url.match(/[?&]cid=(\d+)/)?.[1];
    if (cid) return { placeId: `${cid}` };

    // Format: /maps/place/NAME/@lat,lng
    const placeMatch = url.match(/\/maps\/place\/([^/@]+)/);
    if (placeMatch) {
      const name = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return { query: name };
    }

    // Format: maps.app.goo.gl ou goo.gl (short URLs - on utilise le texte)
    return { query: url };
  } catch {
    return { query: url };
  }
}

// Formater les horaires Google en format LabelMoto (lundi, mardi, etc.)
function formatHoraires(periods: any[]): Record<string, string> {
  const days: Record<number, string> = {
    0: 'dimanche', 1: 'lundi', 2: 'mardi', 3: 'mercredi',
    4: 'jeudi', 5: 'vendredi', 6: 'samedi'
  };
  const result: Record<string, string> = {};

  if (!periods) return result;

  for (const period of periods) {
    const dayName = days[period.open?.day];
    if (!dayName) continue;

    if (!period.close) {
      result[dayName] = '00:00-23:59'; // 24h
      continue;
    }

    const openTime = period.open.time;
    const closeTime = period.close.time;
    const formatTime = (t: string) => `${t.slice(0, 2)}:${t.slice(2)}`;

    result[dayName] = result[dayName]
      ? `${result[dayName]}, ${formatTime(openTime)}-${formatTime(closeTime)}`
      : `${formatTime(openTime)}-${formatTime(closeTime)}`;
  }

  // Jours fermés
  Object.values(days).forEach(day => {
    if (!result[day]) result[day] = 'Fermé';
  });

  return result;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 });
  }

  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: 'URL manquante' }, { status: 400 });
  }

  const { placeId, query } = extractFromGoogleMapsUrl(url);
  let finalPlaceId = placeId;

  // Si pas de place ID, chercher par texte
  if (!finalPlaceId && query) {
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${apiKey}`
    );
    const searchData = await searchRes.json();
    finalPlaceId = searchData.candidates?.[0]?.place_id;
  }

  if (!finalPlaceId) {
    return NextResponse.json({ error: 'Lieu introuvable. Essayez avec un lien Google Maps direct.' }, { status: 404 });
  }

  // Récupérer les détails du lieu
  const fields = 'name,formatted_address,formatted_phone_number,website,opening_hours,geometry,rating,user_ratings_total,types,business_status';
  const detailRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${finalPlaceId}&fields=${fields}&language=fr&key=${apiKey}`
  );
  const detailData = await detailRes.json();
  const place = detailData.result;

  if (!place) {
    return NextResponse.json({ error: 'Données introuvables pour ce lieu.' }, { status: 404 });
  }

  const horaires = formatHoraires(place.opening_hours?.periods || []);

  return NextResponse.json({
    title: place.name || '',
    address: place.formatted_address || '',
    phoneNumber: place.formatted_phone_number || '',
    website: place.website || '',
    latitude: place.geometry?.location?.lat || null,
    longitude: place.geometry?.location?.lng || null,
    rating: place.rating || null,
    reviewCount: place.user_ratings_total || null,
    placeId: finalPlaceId,
    ...horaires,
  });
}

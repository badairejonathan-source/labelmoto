import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  const allowedDomains = [
    'lh3.googleusercontent.com',
    'lh4.googleusercontent.com',
    'lh5.googleusercontent.com',
    'lh6.googleusercontent.com',
    'streetviewpixels-pa.googleapis.com',
    'maps.googleapis.com',
  ];

  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  const isAllowed = allowedDomains.some(d => urlObj.hostname.includes(d));
  if (!isAllowed) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  // Largeur cible configurable via ?w=400 (défaut 480px, max 800px pour éviter les abus)
  const widthParam = request.nextUrl.searchParams.get('w');
  const targetWidth = Math.min(parseInt(widthParam || '480', 10) || 480, 800);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LabelMoto/1.0)',
        'Referer': 'https://www.google.com/',
      },
    });

    if (!response.ok) {
      return new NextResponse('Image fetch failed', { status: response.status });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Redimensionnement + compression WebP via sharp
    const optimized = await sharp(buffer)
      .resize(targetWidth, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 78 })
      .toBuffer();

    return new NextResponse(optimized, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[image-proxy] error:', err);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
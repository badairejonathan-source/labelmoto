import { NextRequest, NextResponse } from 'next/server';

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

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
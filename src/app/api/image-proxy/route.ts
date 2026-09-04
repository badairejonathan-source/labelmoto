import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const ALLOWED_DOMAINS = [
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  'streetviewpixels-pa.googleapis.com',
  'maps.googleapis.com',
];

const FETCH_TIMEOUT_MS = 4500;
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 250;

const successHeaders = {
  'Content-Type': 'image/webp',
  'Cache-Control':
    'public, max-age=604800, stale-while-revalidate=2592000',
  'Access-Control-Allow-Origin': '*',
};

const fallbackHeaders = {
  'Cache-Control':
    'public, max-age=300, stale-while-revalidate=3600',
  'Access-Control-Allow-Origin': '*',
  'X-LabelMoto-Image-Fallback': '1',
};

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function isAllowedHostname(
  hostname: string
) {
  const normalizedHostname =
    hostname.toLowerCase();

  return ALLOWED_DOMAINS.some(
    domain =>
      normalizedHostname === domain ||
      normalizedHostname.endsWith(
        `.${domain}`
      )
  );
}

function emptyImageResponse() {
  return new NextResponse(
    null,
    {
      status: 204,
      headers: fallbackHeaders,
    }
  );
}

async function fetchUpstreamImage(
  url: string
): Promise<Response | null> {
  let lastResponse:
    Response |
    null =
    null;

  let lastError:
    unknown =
    null;

  for (
    let attempt = 0;
    attempt < MAX_ATTEMPTS;
    attempt++
  ) {
    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => {
          controller.abort();
        },
        FETCH_TIMEOUT_MS
      );

    try {
      const response =
        await fetch(
          url,
          {
            headers: {
              'Accept':
                'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',

              'User-Agent':
                'Mozilla/5.0 (compatible; LabelMoto/1.0)',

              'Referer':
                'https://www.google.com/',
            },

            signal:
              controller.signal,

            cache:
              'no-store',
          }
        );

      lastResponse =
        response;

      if (
        response.ok
      ) {
        return response;
      }

      const retryableStatus =
        response.status === 429 ||
        response.status >= 500;

      if (
        !retryableStatus
      ) {
        return response;
      }
    }
    catch (error) {
      lastError =
        error;
    }
    finally {
      clearTimeout(
        timeout
      );
    }

    if (
      attempt <
      MAX_ATTEMPTS - 1
    ) {
      await sleep(
        RETRY_DELAY_MS
      );
    }
  }

  if (
    lastResponse
  ) {
    return lastResponse;
  }

  if (
    lastError
  ) {
    throw lastError;
  }

  return null;
}

export async function GET(
  request: NextRequest
) {
  const url =
    request.nextUrl.searchParams.get(
      'url'
    );

  if (!url) {
    return new NextResponse(
      'Missing url parameter',
      {
        status: 400,
      }
    );
  }

  let urlObj:
    URL;

  try {
    urlObj =
      new URL(
        url
      );
  }
  catch {
    return new NextResponse(
      'Invalid URL',
      {
        status: 400,
      }
    );
  }

  if (
    urlObj.protocol !==
    'https:'
  ) {
    return new NextResponse(
      'Invalid protocol',
      {
        status: 400,
      }
    );
  }

  if (
    !isAllowedHostname(
      urlObj.hostname
    )
  ) {
    return new NextResponse(
      'Domain not allowed',
      {
        status: 403,
      }
    );
  }

  const widthParam =
    request.nextUrl.searchParams.get(
      'w'
    );

  const parsedWidth =
    Number.parseInt(
      widthParam || '480',
      10
    );

  const targetWidth =
    Math.max(
      120,
      Math.min(
        Number.isFinite(
          parsedWidth
        )
          ? parsedWidth
          : 480,
        800
      )
    );

  try {
    const response =
      await fetchUpstreamImage(
        url
      );

    if (
      !response ||
      !response.ok
    ) {
      if (
        process.env.NODE_ENV !==
        'production'
      ) {
        console.warn(
          '[image-proxy] upstream unavailable:',
          response?.status ?? 'network-error',
          urlObj.hostname
        );
      }

      return emptyImageResponse();
    }

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    if (
      !contentType
        .toLowerCase()
        .startsWith(
          'image/'
        )
    ) {
      if (
        process.env.NODE_ENV !==
        'production'
      ) {
        console.warn(
          '[image-proxy] invalid content-type:',
          contentType,
          urlObj.hostname
        );
      }

      return emptyImageResponse();
    }

    const arrayBuffer =
      await response.arrayBuffer();

    if (
      arrayBuffer.byteLength === 0
    ) {
      return emptyImageResponse();
    }

    const optimized =
      await sharp(
        Buffer.from(
          arrayBuffer
        )
      )
        .resize(
          targetWidth,
          null,
          {
            withoutEnlargement: true,
            fit: 'inside',
          }
        )
        .webp({
          quality: 78,
        })
        .toBuffer();

    return new NextResponse(
      optimized,
      {
        status: 200,
        headers: successHeaders,
      }
    );
  }
  catch (error) {
    if (
      process.env.NODE_ENV !==
      'production'
    ) {
      console.warn(
        '[image-proxy] upstream fetch failed:',
        error instanceof Error
          ? error.message
          : String(error)
      );
    }

    /*
     * Une image distante indisponible ne doit jamais
     * bloquer la fiche ou polluer l'interface avec
     * une erreur HTTP 500.
     */
    return emptyImageResponse();
  }
}
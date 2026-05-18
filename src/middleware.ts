import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de redirection globale pour Label Moto.
 * Objectif : Forcer la version https://labelmoto.fr/ comme unique point d'entrée.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // 1. Redirection WWW vers non-WWW (ex: www.labelmoto.fr -> labelmoto.fr)
  if (host?.startsWith('www.')) {
    const newHost = host.replace(/^www\./, '');
    return NextResponse.redirect(`https://${newHost}${pathname}${search}`, 301);
  }

  // 2. Force HTTPS en production (si ce n'est pas déjà géré par l'infrastructure)
  // On ignore localhost et les environnements de preview cloud
  if (
    process.env.NODE_ENV === 'production' && 
    protocol === 'http' && 
    !host?.includes('localhost') && 
    !host?.includes('cloudworkstations.dev')
  ) {
    return NextResponse.redirect(`https://labelmoto.fr${pathname}${search}`, 301);
  }

  return NextResponse.next();
}

// On applique le middleware sur toutes les routes sauf les fichiers statiques et l'API
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};

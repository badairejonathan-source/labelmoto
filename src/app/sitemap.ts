import { MetadataRoute } from 'next'

// On utilise un sitemap statique pour les routes principales pour éviter le crash Firebase sur le serveur
// tout en respectant la directive 'use client' imposée sur les fichiers Firebase.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://labelmoto.fr'

  const routes = [
    '',
    '/about',
    '/contact',
    '/legal',
    '/pro',
    '/map',
    '/entretien',
    '/info',
    '/selection',
    '/terms',
    '/privacy',
    '/accessibility',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes;
}

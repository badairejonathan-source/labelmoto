import { MetadataRoute } from 'next'
import { getAdminFirestore } from '@/lib/firebase-admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://labelmoto.fr'
  const db = getAdminFirestore();

  let concessionUrls: MetadataRoute.Sitemap = []
  let articleUrls: MetadataRoute.Sitemap = []
  let motoUrls: MetadataRoute.Sitemap = []

  try {
    if (process.env.NODE_ENV !== 'production') throw new Error('Skip in dev');
    // 1. Récupération Concessions via Admin SDK
    const concessionsSnap = await db.collection('concessions').limit(5000).get();
    concessionUrls = concessionsSnap.docs.map((doc) => {
      const data = doc.data();
      const slugOrId = data.slug || doc.id;
      return {
        url: `${baseUrl}/concessions/${slugOrId}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    })

    // 2. Récupération Articles
    const articlesSnap = await db.collection('articles').get();
    articleUrls = articlesSnap.docs.map((doc) => ({
      url: `${baseUrl}/info/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // 3. Récupération Motorcycle Sheets
    const motoSnap = await db.collection('motorcycle_sheets').get();
    motoUrls = motoSnap.docs.map((doc) => ({
      url: `${baseUrl}/fiches/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error("Erreur lors de la génération de la sitemap Firebase Admin:", error)
  }

  // Pages statiques de base
  const staticPages: MetadataRoute.Sitemap = [
    '', '/about', '/contact', '/legal', '/map', 
    '/entretien', '/info', '/selection', '/terms', '/privacy', '/accessibility'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticPages, ...concessionUrls, ...articleUrls, ...motoUrls]
}
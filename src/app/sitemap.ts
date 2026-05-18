// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase' 
import { collection, getDocs } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://labelmoto.fr'

  let concessionUrls: MetadataRoute.Sitemap = []
  let articleUrls: MetadataRoute.Sitemap = []
  let motoUrls: MetadataRoute.Sitemap = []

  try {
    // 1. Récupération Concessions (Pages dédiées crawlables)
    const concessionsSnap = await getDocs(collection(db, 'concessions'))
    concessionUrls = concessionsSnap.docs.map((doc) => ({
      url: `${baseUrl}/concessions/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 2. Récupération Articles (Conseils)
    const articlesSnap = await getDocs(collection(db, 'articles'))
    articleUrls = articlesSnap.docs.map((doc) => ({
      url: `${baseUrl}/info/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // 3. Récupération Motorcycle Sheets (Fiches Techniques)
    const motoSnap = await getDocs(collection(db, 'motorcycle_sheets'))
    motoUrls = motoSnap.docs.map((doc) => ({
      url: `${baseUrl}/fiches/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error("Erreur lors de la génération de la sitemap Firestore:", error)
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

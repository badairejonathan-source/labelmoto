// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase' 
import { collection, getDocs } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://labelmoto.fr'

  // On prépare les tableaux vides
  let concessionUrls: any[] = []
  let articleUrls: any[] = []
  let motoUrls: any[] = []

  try {
    // 1. Récupération Concessions
    const concessionsSnap = await getDocs(collection(db, 'concessions'))
    concessionUrls = concessionsSnap.docs.map((doc) => ({
      url: `${baseUrl}/fiches/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // 2. Récupération Articles
    const articlesSnap = await getDocs(collection(db, 'articles'))
    articleUrls = articlesSnap.docs.map((doc) => ({
      url: `${baseUrl}/articles/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    // 3. Récupération Motorcycle Sheets (Entretien)
    const motoSnap = await getDocs(collection(db, 'motorcycle_sheets'))
    motoUrls = motoSnap.docs.map((doc) => ({
      url: `${baseUrl}/entretien/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch (error) {
    console.error("Erreur lors de la génération de la sitemap Firestore:", error)
  }

  // Pages statiques de base
  const staticPages = [
    '', '/about', '/contact', '/legal', '/pro', '/map', 
    '/entretien', '/info', '/selection', '/terms', '/privacy', '/accessibility'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticPages, ...concessionUrls, ...articleUrls, ...motoUrls]
}
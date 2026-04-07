// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase' 
import { collection, getDocs } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://labelmoto.fr'

  // 1. On récupère les 3 collections Firestore en parallèle pour aller plus vite
  const [concessionsSnap, articlesSnap, motoSheetsSnap] = await Promise.all([
    getDocs(collection(db, 'concessions')),
    getDocs(collection(db, 'articles')),
    getDocs(collection(db, 'motorcycle_sheets')) // Ton nom exact de collection
  ])

  // 2. Génération des URLs dynamiques
  
  // Concessions -> Dossier /fiches
  const concessionUrls = concessionsSnap.docs.map((doc) => ({
    url: `${baseUrl}/fiches/${doc.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Articles -> Dossier /articles
  const articleUrls = articlesSnap.docs.map((doc) => ({
    url: `${baseUrl}/articles/${doc.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Fiches Moto -> Dossier /entretien
  const motoUrls = motoSheetsSnap.docs.map((doc) => ({
    url: `${baseUrl}/entretien/${doc.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // 3. Fusion avec tes pages statiques (issues de ton dossier /app)
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/legal`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/pro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...concessionUrls,
    ...articleUrls,
    ...motoUrls,
  ]
}

import { MetadataRoute } from 'next'
import { initializeFirebase } from '@/firebase' 
import { collection, getDocs } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://labelmoto.fr'
  const { firestore } = initializeFirebase();

  const [concessionsSnap, articlesSnap, motoSheetsSnap] = await Promise.all([
    getDocs(collection(firestore, 'concessions')),
    getDocs(collection(firestore, 'articles')),
    getDocs(collection(firestore, 'motorcycle_sheets'))
  ])

  const concessionUrls = concessionsSnap.docs.map((doc) => ({
    url: `${baseUrl}/fiches/${doc.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const articleUrls = articlesSnap.docs.map((doc) => ({
    url: `${baseUrl}/info/${doc.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const motoUrls = motoSheetsSnap.docs.map((doc) => ({
    url: `${baseUrl}/fiches/${doc.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

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

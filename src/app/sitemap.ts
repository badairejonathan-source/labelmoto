export const revalidate = 86400;

import { MetadataRoute } from 'next';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { getAllCitySlugs } from '@/app/lib/cities';
import { getAllDepartmentSlugs } from '@/app/lib/departments';
import { loadSeoPros } from '@/lib/seo-pros';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://labelmoto.fr';

  const seoPros = await loadSeoPros();

  const concessionUrls: MetadataRoute.Sitemap = seoPros
    .filter(pro => pro.collection === 'concessions')
    .map(pro => ({
      url: `${baseUrl}/concessions/${pro.slug || pro.id}`,
      lastModified: pro.updatedAt
        ? new Date(pro.updatedAt)
        : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  let articleUrls: MetadataRoute.Sitemap = [];
  let motoUrls: MetadataRoute.Sitemap = [];

  // Ces deux collections sont petites.
  // Sans force-dynamic, elles ne sont relues qu'à la
  // revalidation du sitemap, pas à chaque requête crawler.
  try {
    if (process.env.NODE_ENV === 'production') {
      const db = getAdminFirestore();

      const [articlesSnap, motoSnap] = await Promise.all([
        db.collection('articles').get(),
        db.collection('motorcycle_sheets').get(),
      ]);

      articleUrls = articlesSnap.docs.map(doc => ({
        url: `${baseUrl}/info/${doc.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));

      motoUrls = motoSnap.docs.map(doc => ({
        url: `${baseUrl}/fiches/${doc.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error(
      'Erreur génération sitemap articles/fiches:',
      error
    );
  }

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/legal',
    '/map',
    '/entretien',
    '/info',
    '/selection',
    '/terms',
    '/privacy',
    '/accessibility',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const cityUrls: MetadataRoute.Sitemap =
    getAllCitySlugs().map(slug => ({
      url: `${baseUrl}/garages-moto/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const deptUrls: MetadataRoute.Sitemap =
    getAllDepartmentSlugs().map(slug => ({
      url:
        `${baseUrl}/garages-moto/departement/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...cityUrls,
    ...deptUrls,
    ...concessionUrls,
    ...articleUrls,
    ...motoUrls,
  ];
}

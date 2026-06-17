import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';
import { getAdminFirestore } from '@/lib/firebase-admin';

async function getArticleSeo(id: string) {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection('articles').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return {
      title: data?.seo?.meta_title || data?.display_title || data?.title || null,
      description: data?.seo?.meta_description || null,
      keywords: data?.seo?.keywords || [],
      image: data?.image || data?.cover_image || null,
      publishedAt: data?.timestamps?.publishedAt || data?.updatedAt || null,
      updatedAt: data?.updatedAt || null,
      category: data?.category || 'Conseils moto',
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const seo = await getArticleSeo(id);

  const title = seo?.title
    ? `${seo.title} | Label Moto`
    : `${id.replace(/-/g, ' ').charAt(0).toUpperCase() + id.replace(/-/g, ' ').slice(1)} | Label Moto`;

  const description = seo?.description
    || `Découvrez notre guide pratique sur ${id.replace(/-/g, ' ')}. Conseils d'experts pour tous les motards.`;

  const image = seo?.image || 'https://labelmoto.fr/images/og-image.webp';

  return {
    title,
    description,
    keywords: seo?.keywords?.join(', ') || 'moto, conseil moto, guide moto, entretien moto',
    alternates: {
      canonical: `https://labelmoto.fr/info/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://labelmoto.fr/info/${id}`,
      siteName: 'LabelMoto',
      locale: 'fr_FR',
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seo = await getArticleSeo(id);

  const title = seo?.title || id.replace(/-/g, ' ');
  const description = seo?.description || '';
  const image = seo?.image || 'https://labelmoto.fr/images/og-image.webp';
  const url = `https://labelmoto.fr/info/${id}`;

  // Conversion timestamp Firestore → ISO string
  function toIso(ts: any): string | null {
    if (!ts) return null;
    if (typeof ts.toDate === 'function') return ts.toDate().toISOString();
    if (typeof ts === 'string') return ts;
    return null;
  }

  const publishedIso = toIso(seo?.publishedAt) || new Date().toISOString();
  const updatedIso = toIso(seo?.updatedAt) || publishedIso;

  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    url,
    datePublished: publishedIso,
    dateModified: updatedIso,
    author: {
      '@type': 'Organization',
      name: 'Label Moto',
      url: 'https://labelmoto.fr',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Label Moto',
      url: 'https://labelmoto.fr',
      logo: {
        '@type': 'ImageObject',
        url: 'https://labelmoto.fr/images/logo-moto.webp',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: seo?.keywords?.join(', ') || '',
    articleSection: seo?.category || 'Conseils moto',
    inLanguage: 'fr-FR',
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://labelmoto.fr' },
      { '@type': 'ListItem', position: 2, name: 'Guides & Conseils', item: 'https://labelmoto.fr/info' },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ArticleClient id={id} />
    </>
  );
}

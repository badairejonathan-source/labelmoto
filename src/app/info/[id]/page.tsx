import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';
import localArticles from '@/app/data/articles.json';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = (localArticles as any[]).find(a => a.id === id || a.slug === id);
  
  if (!article) {
    return {
      title: "Article non trouvé | Label Moto",
      description: "L'article demandé n'existe pas ou a été déplacé."
    };
  }

  const title = article.display_title || article.title;
  const description = article.seo?.meta_description || article.description || `Découvrez notre guide complet : ${title}. Conseils et astuces pour tous les motards sur Label Moto.`;
  const imageUrl = article.imageUrl || "/images/logo-moto.png?v=6";

  return {
    title: `${title} - Conseils & Guide Moto`,
    description: description,
    alternates: {
      canonical: `/info/${id}`,
    },
    openGraph: {
      title: `${title} | Label Moto`,
      description: description,
      url: `https://labelmoto.fr/info/${id}`,
      images: [{ url: imageUrl, alt: title }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = (localArticles as any[]).find(a => a.id === id || a.slug === id);

  if (!article) return <ArticleClient id={id} />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.display_title || article.title,
    "description": article.description || article.seo?.meta_description,
    "image": article.imageUrl || "https://labelmoto.fr/images/logo-moto.png",
    "author": {
      "@type": "Organization",
      "name": "Label Moto"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Label Moto",
      "logo": {
        "@type": "ImageObject",
        "url": "https://labelmoto.fr/images/logo-moto.png"
      }
    },
    "datePublished": "2024-01-01",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://labelmoto.fr/info/${id}`
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://labelmoto.fr" },
      { "@type": "ListItem", "position": 2, "name": "Conseils", "item": "https://labelmoto.fr/info" },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://labelmoto.fr/info/${id}` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ArticleClient id={id} />
    </>
  );
}

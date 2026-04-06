
import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';
import localArticles from '@/app/data/articles.json';

// Cette fonction s'exécute sur le SERVEUR pour générer le SEO avant l'affichage
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // On récupère l'article pour extraire ses infos SEO
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
    title: title,
    description: description,
    openGraph: {
      title: `${title} | Label Moto`,
      description: description,
      url: `https://labelmoto.fr/info/${id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    }
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleClient id={id} />;
}

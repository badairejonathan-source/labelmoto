import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // On génère des métadonnées intelligentes basées sur le slug pour le SEO
  // car on ne peut pas appeler initializeFirebase() (module client) depuis le serveur.
  const title = id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${title} | Label Moto`,
    description: `Découvrez notre guide complet : ${title}. Conseils vérifiés, astuces et expertise pour tous les motards.`,
    openGraph: {
      title: title,
      description: `Guide pratique Label Moto : ${title}`,
      url: `https://labelmoto.fr/info/${id}`,
      images: [{ url: "/images/logo-moto.png?v=6", alt: title }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleClient id={id} />;
}

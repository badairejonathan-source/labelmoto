
import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const title = id.replace(/-/g, ' ').toUpperCase();

  return {
    title: `${title} - Conseils & Guide Moto | Label Moto`,
    description: `Découvrez notre guide complet sur ${title}. Conseils vérifiés et astuces pour tous les motards.`,
    alternates: {
      canonical: `/info/${id}`,
    },
    openGraph: {
      title: `${title} | Label Moto`,
      description: `Guide expert sur ${title}.`,
      url: `https://labelmoto.fr/info/${id}`,
      images: [{ url: "/images/logo-moto.png?v=6", alt: title }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleClient id={id} />;
}

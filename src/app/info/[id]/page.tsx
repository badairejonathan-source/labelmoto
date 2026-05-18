import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Génération de titres SEO percutants basés sur le slug
  const rawTitle = id.replace(/-/g, ' ');
  const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  // Personnalisation des descriptions selon l'intention
  let description = `Découvrez notre guide complet : ${title}. Conseils vérifiés, astuces et expertise Label Moto pour tous les motards.`;
  
  if (id.includes('assurance')) {
    description = `Comment bien choisir son assurance moto en 2026 ? Garanties, formules et pièges à éviter : notre guide complet pour faire le bon choix.`;
  } else if (id.includes('occasion')) {
    description = `Achat d'une moto d'occasion : découvrez les points de contrôle indispensables, les documents à vérifier et nos conseils pour bien négocier.`;
  } else if (id.includes('budget')) {
    description = `Quel est le coût réel d'une moto par mois ? Assurance, essence, entretien et imprévus : nous décryptons le budget d'un motard.`;
  }

  return {
    title: `${title} : guide pratique et conseils experts`,
    description: description,
    openGraph: {
      title: `${title} | Label Moto`,
      description: description,
      url: `https://labelmoto.fr/info/${id}`,
      images: [{ url: "/images/logo-moto.webp", alt: title }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleClient id={id} />;
}

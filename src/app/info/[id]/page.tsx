
import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Génération de titres SEO percutants basés sur le slug
  const rawTitle = id.replace(/-/g, ' ');
  const baseTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  let title = `${baseTitle} | Label Moto`;
  let description = `Découvrez notre guide complet : ${baseTitle}. Conseils vérifiés, astuces et expertise Label Moto pour tous les motards.`;
  
  if (id.includes('assurance')) {
    title = "Assurance moto : bien choisir sa formule en 2026";
    description = "Comment bien choisir son assurance moto en 2026 ? Garanties, formules et pièges à éviter : notre guide complet pour faire le bon choix.";
  } else if (id.includes('occasion')) {
    title = "Achat moto d'occasion : le guide pour éviter les pièges";
    description = "Achat d'une moto d'occasion : découvrez les points de contrôle indispensables, les documents à vérifier et nos conseils pour bien négocier.";
  } else if (id.includes('budget')) {
    title = "Quel est le coût réel d'une moto par mois ?";
    description = "Assurance, essence, entretien et imprévus : nous décryptons le budget d'un motard pour vous aider à mieux gérer vos dépenses mensuelles.";
  } else if (id.includes('taille')) {
    title = "Quelle moto choisir selon sa taille ? Guide gabarit";
    description = "Hauteur de selle et ergonomie : trouvez la moto adaptée à votre morphologie (petit ou grand) grâce à notre guide complet par gabarit.";
  } else if (id.includes('permis-a2')) {
    title = "Quelle moto A2 choisir pour débuter ? Conseils et modèles";
    description = "Trouvez la moto idéale pour débuter le permis A2 selon votre usage et votre budget. Sélection des meilleurs modèles et conseils experts.";
  }

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `/info/${id}`,
    },
    openGraph: {
      title: title,
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

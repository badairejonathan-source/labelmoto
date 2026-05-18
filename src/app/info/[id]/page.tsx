import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const rawTitle = id.replace(/-/g, ' ');
  const baseTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  let title = `${baseTitle} | Conseils Moto`;
  let description = `Découvrez notre guide pratique : ${baseTitle}. Conseils d'experts, astuces et points de vigilance pour tous les motards.`;
  
  if (id.includes('assurance')) {
    title = "Quelle assurance moto choisir ? Comparatif et conseils 2026";
    description = "Comment bien assurer sa moto ? Garanties, formules et erreurs à éviter : notre guide pour trouver la meilleure protection au meilleur prix.";
  } else if (id.includes('occasion')) {
    title = "Achat d'une moto d'occasion : les points à vérifier";
    description = "Vous achetez une moto d'occasion ? Voici les points de contrôle indispensables, les documents à exiger et nos conseils pour bien négocier.";
  } else if (id.includes('budget')) {
    title = "Quel est le budget réel d'une moto par mois ?";
    description = "Assurance, essence, entretien et imprévus : nous décryptons le coût de revient d'une moto pour vous aider à mieux gérer vos dépenses.";
  } else if (id.includes('taille')) {
    title = "Quelle moto pour ma taille ? Guide de la hauteur de selle";
    description = "Trouvez la moto adaptée à votre morphologie. Notre guide complet sur la hauteur de selle et l'ergonomie pour petits et grands gabarits.";
  } else if (id.includes('permis-a2')) {
    title = "Quelle moto A2 choisir pour débuter ? Notre sélection";
    description = "Trouvez la première moto idéale selon votre usage et votre budget. Sélection des meilleurs modèles A2 et conseils pour bien démarrer.";
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

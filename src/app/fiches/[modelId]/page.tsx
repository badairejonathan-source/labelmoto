
import { Metadata } from 'next';
import FicheClient from '@/components/app/fiche-client';
import localFiches from '@/app/data/fiches-techniques.json';

// Cette fonction s'exécute sur le SERVEUR pour générer le SEO
export async function generateMetadata({ params }: { params: Promise<{ modelId: string }> }): Promise<Metadata> {
  const { modelId } = await params;
  
  // On récupère la fiche pour extraire ses infos SEO
  const fiche = (localFiches as any[]).find(f => f.id === modelId);
  
  if (!fiche) {
    return {
      title: "Fiche technique non trouvée | Label Moto",
      description: "La fiche technique demandée n'est pas encore disponible."
    };
  }

  const title = fiche.display_title || fiche.model;
  const description = `Fiche technique complète ${title} : moteur, dimensions, partie cycle et guide d'entretien officiel. Découvrez tout sur la ${title} sur Label Moto.`;
  const imageUrl = fiche.imageUrl || "/images/logo-moto.png?v=6";

  return {
    title: `Fiche technique ${title}`,
    description: description,
    openGraph: {
      title: `Fiche technique ${title} | Label Moto`,
      description: description,
      url: `https://labelmoto.fr/fiches/${modelId}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Fiche technique ${title}`,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Fiche technique ${title}`,
      description: description,
      images: [imageUrl],
    }
  };
}

export default async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  return <FicheClient modelId={modelId} />;
}

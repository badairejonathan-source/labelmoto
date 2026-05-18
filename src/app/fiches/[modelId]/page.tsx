import { Metadata } from 'next';
import FicheClient from '@/components/app/fiche-client';

/**
 * Nettoie le modelId pour l'affichage naturel (Marque Modèle Année)
 */
function formatModelTitle(id: string): string {
  return id
    .replace(/-/g, ' ')
    .replace(/\b(plus)\b/gi, '') 
    .trim()
    .toUpperCase();
}

export async function generateMetadata({ params }: { params: Promise<{ modelId: string }> }): Promise<Metadata> {
  const { modelId } = await params;
  const cleanTitle = formatModelTitle(modelId);

  return {
    title: `${cleanTitle} : fiche technique et performances`,
    description: `Découvrez les caractéristiques techniques de la ${cleanTitle} : moteur, puissance, hauteur de selle et poids. Toutes les données indispensables pour bien choisir.`,
    alternates: {
      canonical: `/fiches/${modelId}`,
    },
    openGraph: {
      title: `${cleanTitle} | Fiche Technique Label Moto`,
      description: `Tout savoir sur la ${cleanTitle} : moteur, performances et dimensions.`,
      images: ["/images/logo-moto.webp"],
    }
  };
}

export default async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  return <FicheClient modelId={modelId} />;
}

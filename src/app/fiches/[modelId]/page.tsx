
import { Metadata } from 'next';
import FicheClient from '@/components/app/fiche-client';

export async function generateMetadata({ params }: { params: Promise<{ modelId: string }> }): Promise<Metadata> {
  const { modelId } = await params;
  const title = modelId.replace(/-/g, ' ').toUpperCase();

  return {
    title: `Fiche Technique ${title} - Entretien & Révisions | Label Moto`,
    description: `Spécifications techniques, guide d'entretien et prix des révisions pour ${title}. Données issues de Firestore.`,
    alternates: {
      canonical: `/fiches/${modelId}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  return <FicheClient modelId={modelId} />;
}

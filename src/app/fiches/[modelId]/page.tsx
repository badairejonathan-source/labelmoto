import { Metadata } from 'next';
import FicheClient from '@/components/app/fiche-client';

/**
 * Nettoie le modelId pour l'affichage SEO
 */
function formatModelTitle(id: string): string {
  return id
    .replace(/-/g, ' ')
    .replace(/\b(plus|2021|2022|2023|2024)\b/gi, '') // Retire les termes techniques de fin si nécessaire
    .trim()
    .toUpperCase();
}

export async function generateMetadata({ params }: { params: Promise<{ modelId: string }> }): Promise<Metadata> {
  const { modelId } = await params;
  const cleanTitle = formatModelTitle(modelId);

  return {
    title: `${cleanTitle} : fiche technique complète, poids et puissance`,
    description: `Consultez les caractéristiques techniques détaillées de la ${cleanTitle} : moteur, puissance, hauteur de selle, poids TPF et capacités.`,
    alternates: {
      canonical: `/fiches/${modelId}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  return <FicheClient modelId={modelId} />;
}

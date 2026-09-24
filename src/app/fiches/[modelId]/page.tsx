import { Metadata } from 'next';
import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { getAdminFirestore } from '@/lib/firebase-admin';
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

const getFicheMetadata = cache(async (modelId: string) => {
  try {
    const db = getAdminFirestore();
    // Cherche d'abord par id exact
    const docById = await db.collection('motorcycle_sheets').doc(modelId).get();
    if (docById.exists) {
      const data = docById.data();

      return data?.status === 'published'
        ? data
        : null;
    }
    // Sinon cherche par slug
    const snap = await db.collection('motorcycle_sheets')
      .where('slug', '==', modelId)
      .get();

    const publishedDoc =
      snap.docs.find(
        doc =>
          doc.data()?.status === 'published'
      );

    if (publishedDoc) {
      return publishedDoc.data();
    }
  } catch (e) {
    console.error('getFicheMetadata error:', e);
  }
  return null;
});

export async function generateMetadata({ params }: { params: Promise<{ modelId: string }> }): Promise<Metadata> {
  const { modelId } = await params;
  const data = await getFicheMetadata(modelId);

  if (!data) {
    return {
      title: 'Page introuvable | LabelMoto',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Si la fiche Firestore existe et a des champs SEO, on les utilise
  const title = data?.seo?.meta_title
    || `${formatModelTitle(modelId)} : fiche technique et guide entretien | LabelMoto`;

  const description = data?.seo?.meta_description
    || `Découvrez la fiche technique et le guide d'entretien de la ${formatModelTitle(modelId)} : intervalles de révision, coûts, problèmes connus et conseils de longévité.`;

  const keywords = data?.seo?.keywords?.join(', ')
    || `${formatModelTitle(modelId)}, fiche technique moto, entretien moto, révision moto`;

  const canonicalUrl = `https://labelmoto.fr/fiches/${data?.slug || modelId}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'LabelMoto',
      locale: 'fr_FR',
      type: 'article',
      images: [
        {
          url: 'https://labelmoto.fr/images/og-image.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://labelmoto.fr/images/og-image.webp'],
    },
  };
}

type PageProps = {
  params: Promise<{ modelId: string }>;
  searchParams: Promise<{
    from?: string | string[];
  }>;
};

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  const { modelId } = await params;
  const query = await searchParams;

  if (modelId === 'cfmoto-800mt-touring-2025-plus') {
    permanentRedirect(
      '/fiches/cfmoto-800mt-sport-explore-2023-plus'
    );
  }

  // Les anciennes URLs ?from= ont désormais une URL canonique unique.
  // Les nouveaux liens internes n'utilisent plus ce paramètre.
  if (query.from !== undefined) {
    permanentRedirect(`/fiches/${modelId}`);
  }

  const ficheData = await getFicheMetadata(modelId);

  if (!ficheData) {
    notFound();
  }

  const initialFiche = ficheData
    ? JSON.parse(JSON.stringify(ficheData))
    : null;

  return <FicheClient modelId={modelId} initialFiche={initialFiche} />;
}
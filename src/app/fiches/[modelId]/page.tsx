import { Metadata } from 'next';
import FicheClient from '@/components/app/fiche-client';
import localFiches from '@/app/data/fiches-techniques.json';

export async function generateMetadata({ params }: { params: Promise<{ modelId: string }> }): Promise<Metadata> {
  const { modelId } = await params;
  const fiche = (localFiches as any[]).find(f => f.id === modelId);
  
  if (!fiche) {
    return {
      title: "Fiche technique non trouvée | Label Moto",
      description: "La fiche technique demandée n'est pas encore disponible."
    };
  }

  const title = `Fiche technique ${fiche.display_title || fiche.model} (${fiche.year_range})`;
  const description = `Caractéristiques techniques complètes, entretien et prix révisions pour ${fiche.display_title || fiche.model}. Tout savoir sur votre moto avec Label Moto.`;
  const imageUrl = fiche.imageUrl || "/images/logo-moto.png?v=6";

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `/fiches/${modelId}`,
    },
    openGraph: {
      title: `${title} | Label Moto`,
      description: description,
      url: `https://labelmoto.fr/fiches/${modelId}`,
      images: [{ url: imageUrl, alt: title }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const fiche = (localFiches as any[]).find(f => f.id === modelId);

  const jsonLd = fiche ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": fiche.display_title || fiche.model,
    "description": `Fiche technique et guide d'entretien pour ${fiche.display_title || fiche.model}`,
    "image": fiche.imageUrl || "https://labelmoto.fr/images/logo-moto.png",
    "brand": {
      "@type": "Brand",
      "name": fiche.brand
    },
    "offers": {
      "@type": "AggregateOffer",
      "offerCount": "1",
      "lowPrice": "0",
      "priceCurrency": "EUR"
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <FicheClient modelId={modelId} />
    </>
  );
}
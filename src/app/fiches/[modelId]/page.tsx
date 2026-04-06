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

  const modelName = fiche.display_title || fiche.model;
  const title = `Fiche Technique ${modelName} (${fiche.year_range}) - Entretien & A2`;
  const description = `Spécifications techniques, guide d'entretien et prix des révisions pour ${modelName}. Tout savoir sur votre ${fiche.brand} avec Label Moto.`;
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

  if (!fiche) return <FicheClient modelId={modelId} />;

  // JSON-LD pour le produit (la moto)
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": fiche.display_title || fiche.model,
    "description": `Fiche technique et guide d'entretien pour ${fiche.display_title || fiche.model}`,
    "image": fiche.imageUrl || "https://labelmoto.fr/images/logo-moto.png",
    "brand": { "@type": "Brand", "name": fiche.brand },
    "offers": {
      "@type": "AggregateOffer",
      "offerCount": "1",
      "lowPrice": "0",
      "priceCurrency": "EUR"
    }
  };

  // JSON-LD pour les questions fréquentes (Entretien)
  const faqLd = fiche.service_guide?.faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": fiche.service_guide.faq.map((f: any) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <FicheClient modelId={modelId} />
    </>
  );
}

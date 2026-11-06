import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CataloguePreview from "@/app/dev/consommables-preview/page";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Consommables moto : pièces et entretien | LabelMoto",
  robots: { index: false, follow: false },
};

type Params = {
  brand?: string | string[];
  category?: string | string[];
  moto?: string | string[];
  page?: string | string[];
};

// Catalogue documentaire : prix indicatifs et compatibilites a verifier.
export default function ConsommablesPage({ searchParams }: { searchParams: Promise<Params> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  return <CataloguePreview searchParams={searchParams} />;
}

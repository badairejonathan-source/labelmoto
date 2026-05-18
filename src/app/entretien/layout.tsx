import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Entretien moto : révisions, prix et carnets par modèle",
  description: "Anticipez vos frais d'entretien. Accédez aux programmes de révision détaillés et aux estimations de budget pour votre moto.",
  alternates: {
    canonical: '/entretien',
  },
};

export default function EntretienLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

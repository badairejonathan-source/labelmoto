
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Entretien moto : révisions, périodicités et budgets par modèle",
  description: "Anticipez vos dépenses : accédez gratuitement aux programmes d'entretien officiels et aux estimations de budget de révision pour votre moto.",
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

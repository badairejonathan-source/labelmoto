import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "La Sélection Label Moto : nos critères de confiance",
  description: "Comment choisissons-nous les meilleurs professionnels ? Découvrez nos critères de sélection pour rouler en toute sérénité.",
  alternates: {
    canonical: '/selection',
  },
};

export default function SelectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

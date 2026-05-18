
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "La Sélection Label Moto : nos critères de confiance",
  description: "Comment nous choisissons les meilleurs pros ? Découvrez nos critères d'attribution du badge 'Sélection Label Moto' pour rouler en toute sérénité.",
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

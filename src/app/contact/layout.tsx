import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Label Moto : une question ou une suggestion ?",
  description: "Besoin d'aide ou envie de nous faire part d'une suggestion ? L'équipe Label Moto est à votre écoute pour vous accompagner dans votre vie de motard.",
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

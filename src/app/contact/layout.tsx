
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Label Moto : une question ou une suggestion ?",
  description: "Une question sur un établissement ou une suggestion pour le site ? L'équipe Label Moto est à votre écoute pour vous aider dans votre vie de motard.",
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

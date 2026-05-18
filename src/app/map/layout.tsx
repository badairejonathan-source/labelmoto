
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Carte interactive des concessions et ateliers moto en France",
  description: "Explorez la carte Label Moto pour localiser les meilleures concessions, ateliers et relais motards partout en France. Recherche par ville, département et marque.",
  alternates: {
    canonical: '/map',
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

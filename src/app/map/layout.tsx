import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Carte des concessions et ateliers moto en France",
  description: "Localisez les meilleurs garages, concessionnaires et relais motards sur notre carte interactive. Recherche par ville, marque et département.",
  alternates: {
    canonical: '/map',
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="preconnect"
        href="https://tiles.stadiamaps.com"
        crossOrigin="anonymous"
      />

      {children}
    </>
  );
}
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
      <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://d.basemaps.cartocdn.com" crossOrigin="anonymous" />

      <link
        rel="preload"
        as="image"
        href="https://c.basemaps.cartocdn.com/light_all/6/32/22.png"
        media="(max-resolution: 1.5dppx)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="https://c.basemaps.cartocdn.com/light_all/6/32/22@2x.png"
        media="(min-resolution: 1.51dppx)"
        fetchPriority="high"
      />

      {children}
    </>
  );
}

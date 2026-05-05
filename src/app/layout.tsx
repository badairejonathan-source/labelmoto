import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/app/footer";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import CookieConsent from "@/components/app/cookie-consent";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: 'swap',
});

// Métadonnées globales du site
export const metadata: Metadata = {
  metadataBase: new URL('https://labelmoto.fr'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Label Moto - L'annuaire intelligent des motards (Concessions & Ateliers)",
    template: "%s | Label Moto"
  },
  description: "Trouvez les meilleures concessions et ateliers moto en France. Guides d'entretien, fiches techniques gratuites et conseils pour motards débutants et expérimentés.",
  keywords: ["moto", "concessionnaire moto", "atelier moto", "entretien moto", "fiche technique moto", "permis A2", "révision moto prix"],
  authors: [{ name: "L'équipe Label Moto" }],
  creator: "Label Moto",
  publisher: "Label Moto",
  icons: {
    icon: [
      { url: '/images/favicon.ico' }, // Chemin corrigé d'après votre capture
      { url: '/images/favicon.webp', type: 'image/webp' },
    ],
    apple: [
      { url: '/images/logo-moto.webp' }, // Utilisation du logo comme icône Apple par défaut
    ],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://labelmoto.fr",
    siteName: "Label Moto",
    title: "Label Moto - L'annuaire intelligent des motards",
    description: "Le compagnon de route indispensable pour tout motard en France. Trouver un pro n'a jamais été aussi simple.",
    images: [
      {
        url: "/images/logo-moto.webp",
        width: 1200,
        height: 630,
        alt: "Label Moto - Annuaire et Conseils Moto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Label Moto - L'annuaire intelligent des motards",
    description: "Trouvez votre concession et entretenez votre moto en toute confiance.",
    images: ["/images/logo-moto.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
        />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" 
        />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" 
        />
      </head>
      <body className={cn("bg-background font-sans antialiased", inter.className)}>
        <FirebaseClientProvider>
          {children}
          <CookieConsent />
          <Footer />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

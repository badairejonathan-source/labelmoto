import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/app/footer";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import CookieConsent from "@/components/app/cookie-consent";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL('https://labelmoto.fr'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "LabelMoto.fr - L'annuaire intelligent des motards",
    template: "%s | Label Moto"
  },
  description: "Trouvez les meilleures concessions et ateliers moto en France. Conseils A2, guides d'entretien, fiches techniques et carte interactive pour tous les motards en Île-de-France et partout ailleurs.",
  keywords: ["moto", "concessionnaire moto Paris", "atelier moto Île-de-France", "entretien moto", "permis A2", "fiche technique moto", "assurance moto"],
  authors: [{ name: "L'équipe Label Moto" }],
  creator: "Label Moto",
  publisher: "Label Moto",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://labelmoto.fr",
    siteName: "Label Moto",
    title: "Label Moto - L'annuaire intelligent des motards",
    description: "Le compagnon de route indispensable pour tout motard en France. Guides d'achat A2 et fiches techniques gratuites.",
    images: [
      {
        url: "/images/logo-moto.png?v=6",
        width: 1200,
        height: 630,
        alt: "Label Moto Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Label Moto - L'annuaire intelligent des motards",
    description: "Le compagnon de route indispensable pour tout motard en France.",
    images: ["/images/logo-moto.png?v=6"],
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
    <html lang="fr" suppressHydrationWarning>
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
      <body className={cn("bg-background font-sans antialiased", inter.variable)}>
        <FirebaseClientProvider>
          {children}
          <CookieConsent />
          <Footer />
          <Toaster />
        </FirebaseClientProvider>
        
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
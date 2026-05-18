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
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://labelmoto.fr'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Label Moto : l'annuaire intelligent des motards en France",
    template: "%s | Label Moto"
  },
  description: "Le compagnon de route indispensable : trouvez une concession de confiance, un atelier expert ou un relais motard. Accédez gratuitement aux guides d'entretien et conseils d'achat.",
  keywords: ["moto", "concessionnaire moto", "atelier moto", "entretien moto", "fiche technique moto", "permis A2", "révision moto prix", "relais motard", "association moto"],
  authors: [{ name: "L'équipe Label Moto" }],
  creator: "Label Moto",
  publisher: "Label Moto",
  icons: {
    icon: [
      { url: '/images/favicon.ico' },
      { url: '/images/favicon.webp', type: 'image/webp' },
    ],
    apple: [
      { url: '/images/favicon.webp' }, 
    ],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://labelmoto.fr",
    siteName: "Label Moto",
    title: "Label Moto : l'annuaire intelligent des motards",
    description: "Trouvez un pro de confiance et entretenez votre moto facilement partout en France.",
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
    title: "Label Moto : concessions et ateliers moto en France",
    description: "Trouvez votre concession et gérez l'entretien de votre moto en toute confiance.",
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
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
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

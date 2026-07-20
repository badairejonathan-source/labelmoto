import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/app/footer";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import CookieConsent from "@/components/app/cookie-consent";
import Script from "next/script";
import MobileBottomNav from "@/components/app/mobile-bottom-nav";

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
  keywords: ["annuaire moto", "concessionnaire moto france", "atelier moto", "entretien moto", "guide achat moto", "relais motard", "plateforme motards"],
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
    title: "Label Moto : l'annuaire national des motards",
    description: "Trouvez un pro de confiance et gérez l'entretien de votre moto facilement partout en France.",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Label Moto - L'annuaire national des professionnels moto en France",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Label Moto : l'annuaire de référence pour les motards",
    description: "L'annuaire national complet : entretien, conseils et professionnels de confiance.",
    images: ["/images/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "XV9Fx-6qPKbJu7rNyK4ej94XOKoALC3v-oAhYtQT-C4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://labelmoto.fr/#organization",
        "name": "Label Moto",
        "url": "https://labelmoto.fr",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://labelmoto.fr/#logo",
          "url": "https://labelmoto.fr/images/logo-moto.webp",
          "contentUrl": "https://labelmoto.fr/images/logo-moto.webp",
          "width": "520",
          "height": "166",
          "caption": "Label Moto"
        },
        "image": { "@id": "https://labelmoto.fr/#logo" },
        "description": "Annuaire national indépendant référençant les concessions, ateliers et relais motards en France. Plateforme de ressources et guides d'entretien pour motards.",
        "sameAs": [
          "https://www.instagram.com/labelmoto.fr/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://labelmoto.fr/#website",
        "url": "https://labelmoto.fr",
        "name": "Label Moto",
        "publisher": { "@id": "https://labelmoto.fr/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://labelmoto.fr/map?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://studio-4801889514-40ebd.firebaseapp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://studio-4801889514-40ebd.firebasestorage.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn("bg-background font-sans antialiased pb-16 md:pb-0", inter.className)}>
        <FirebaseClientProvider>
          {children}
          <CookieConsent />
          <Footer />
          <Toaster />
          <MobileBottomNav />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

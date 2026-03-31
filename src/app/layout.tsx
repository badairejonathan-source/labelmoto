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
  title: "LabelMoto.fr - Tout l'univers moto en quelques clics !",
  description: "Trouvez les meilleures concessions et ateliers moto en France. Plateforme d'information gratuite pour motards : guides d'entretien, conseils pratiques et carte interactive pour motards A2 et confirmés.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" }
    ],
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

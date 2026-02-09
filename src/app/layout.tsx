import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/app/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MotoTrust",
  description: "Trouvez les meilleures concessions et garages moto en France.",
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
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

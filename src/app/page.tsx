'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, Navigation, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import initialDealerships from '@/data/dealerships.json';
import type { Dealership } from '@/lib/types';

const MotoTrustLogo = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4"/>
    <path d="M50 50 L 50 15" stroke="hsl(var(--accent))" strokeWidth="5" strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(135deg)' }}/>
    <text x="50" y="70" textAnchor="middle" fontWeight="bold" fontSize="12" fill="currentColor" fontFamily="sans-serif">120</text>
    <text x="50" y="82" textAnchor="middle" fontWeight="normal" fontSize="8" fill="currentColor" fontFamily="sans-serif">km/h</text>
    <circle cx="50" cy="50" r="4" fill="hsl(var(--accent))"/>
  </svg>
);

// Importation dynamique du composant de la carte
const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-200"><p>Chargement de la carte...</p></div>
});


export default function Home() {
  const [dealerships, setDealerships] = useState<Dealership[]>(
    initialDealerships.map(d => ({...d, position: [d.latitude, d.longitude]} as Dealership))
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const newDealerships: Omit<Dealership, 'position'>[] = JSON.parse(content);
          if (Array.isArray(newDealerships)) {
            setDealerships(newDealerships.map(d => ({...d, position: [d.latitude, d.longitude]})).filter(d => d.position && !isNaN(d.position[0]) && !isNaN(d.position[1])) as Dealership[]);
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const requiredHeaders = ['title', 'address', 'latitude', 'longitude'];
          if(!requiredHeaders.every(h => header.includes(h))) {
            alert('Le fichier CSV doit contenir les colonnes : ' + requiredHeaders.join(', '));
            return;
          }

          const newDealerships: Dealership[] = lines.slice(1).map((line, index) => {
            const data = line.split(',');
            const dealer: any = { id: `csv-${index}` };
            header.forEach((key, i) => {
                const value = data[i]?.trim().replace(/"/g, '');
                if (key !== 'latitude' && key !== 'longitude') {
                    dealer[key] = value;
                }
            });

            const latIndex = header.indexOf('latitude');
            const lonIndex = header.indexOf('longitude');
            if(latIndex > -1 && lonIndex > -1) {
              const lat = parseFloat(data[latIndex]);
              const lon = parseFloat(data[lonIndex]);

              if (!isNaN(lat) && !isNaN(lon)) {
                dealer.position = [lat, lon] as [number, number];
                dealer.latitude = lat;
                dealer.longitude = lon;
              }
            }

            return dealer as Dealership;
          }).filter(d => d.position && !isNaN(d.position[0]) && !isNaN(d.position[1]));
          
          setDealerships(newDealerships);
        } else {
            alert("Format de fichier non supporté. Veuillez utiliser un fichier .json ou .csv");
        }
      } catch (error) {
        console.error("Erreur lors du traitement du fichier:", error);
        alert("Erreur lors de la lecture du fichier.");
      }
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Map Area */}
      <div className="absolute inset-0">
        <MapComponent dealerships={dealerships} />
      </div>

      {/* Header / Search bar */}
      <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <MotoTrustLogo />
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Rechercher une concession, une ville..."
                className="pl-10 h-12 text-base bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-accent"
              />
            </div>
             <Button size="icon" className="h-12 w-12 flex-shrink-0 bg-accent hover:bg-accent/90">
              <Navigation className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="outline" onClick={triggerFileUpload} className="h-12 w-12 flex-shrink-0">
              <Upload className="h-5 w-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".csv, .json"
            />
          </div>
        </div>
      </header>

       {/* Footer */}
      <footer className="absolute bottom-4 left-4 z-10">
        <p className="text-xs text-gray-500 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded">
          MotoTrust © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

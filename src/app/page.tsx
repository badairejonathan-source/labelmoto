'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Search, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import initialDealerships from '@/data/dealerships.json';
import data34 from '@/data/34json.json';
import data78 from '@/data/78csvjson.json';
import data92 from '@/data/92 Phantom_json.json';
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
  const allDealerships = [
    ...initialDealerships,
    ...data34,
    ...data78,
    ...data92,
  ] as any[];
  
  const dealerships: Dealership[] = allDealerships.map((d, index) => ({
    id: d.id || `${index}`,
    placeUrl: d.placeUrl,
    title: d.title,
    address: d.address,
    website: d.website,
    phoneNum: d.phoneNumber || d.phoneNum,
    imgUrl: d.imgUrl,
    mardi: d.mardi,
    mercredi: d.mercredi,
    jeudi: d.jeudi,
    vendredi: d.vendredi,
    samedi: d.samedi,
    dimanche: d.dimanche,
    lundi: d.lundi,
    latitude: typeof d.latitude === 'string' ? parseFloat(d.latitude.replace(',', '.')) : d.latitude,
    longitude: typeof d.longitude === 'string' ? parseFloat(d.longitude.replace(',', '.')) : d.longitude,
  })).filter(d => d.title && !isNaN(d.latitude) && !isNaN(d.longitude));


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

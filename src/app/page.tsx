'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Search, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';

import initialDealerships from '@/data/dealerships.json';
import data34 from '@/data/34json.json';
import data78 from '@/data/78csvjson.json';
import data92 from '@/data/92 Phantom_json.json';
import type { Dealership } from '@/lib/types';

const MotoTrustLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M68.3333 43.3333C68.3333 38.2166 65.2333 33.6833 60.55 31.35L50 25L39.45 31.35C34.7667 33.6833 31.6667 38.2166 31.6667 43.3333V60.8333C31.6667 63.3833 32.7333 65.75 34.5333 67.2833L50 80L65.4667 67.2833C67.2667 65.75 68.3333 63.3833 68.3333 60.8333V43.3333Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
    <path d="M50 54.1667C52.2962 54.1667 54.1667 52.2962 54.1667 50C54.1667 47.7038 52.2962 45.8333 50 45.8333C47.7038 45.8333 45.8333 47.7038 45.8333 50C45.8333 52.2962 47.7038 54.1667 50 54.1667Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
  </svg>
);

const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-200"><p>Chargement de la carte...</p></div>
});


export default function Home() {
  const allDealershipsRaw = [
    ...initialDealerships,
    ...data34,
    ...data78,
    ...data92,
  ] as any[];

  // Deduplicate dealerships based on placeUrl
  const uniqueDealershipsRaw = Array.from(new Map(allDealershipsRaw.map(d => [d.placeUrl, d])).values());

  const dealerships: Dealership[] = uniqueDealershipsRaw.map((d, index) => ({
    id: d.placeUrl || `${d.title}-${index}`,
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
    rating: d.rating,
    category: d.category,
  })).filter(d => d.title && d.placeUrl && d.latitude != null && d.longitude != null && !isNaN(d.latitude) && !isNaN(d.longitude));


  return (
    <div className="h-screen w-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-[30%] h-screen flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MotoTrustLogo />
            <h1 className="text-xl font-bold text-primary dark:text-primary-foreground">MotoTrust</h1>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="search"
              placeholder="Rechercher une concession..."
              className="pl-10 h-11 text-base bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-accent"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4 flex flex-col items-center">
            {dealerships.map(dealer => (
              <DealershipCard key={dealer.id} dealership={dealer} />
            ))}
          </div>
        </ScrollArea>
        <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <MotoTrustLogo />
          <p className="text-xs text-center text-gray-500">
            MotoTrust © {new Date().getFullYear()}
          </p>
        </footer>
      </aside>

      {/* Map Area */}
      <main className="w-[70%] h-screen relative">
        <MapComponent dealerships={dealerships} />
         <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-end">
            <Button size="icon" className="h-12 w-12 flex-shrink-0 bg-accent hover:bg-accent/90 shadow-lg">
              <Navigation className="h-5 w-5" />
            </Button>
        </header>
      </main>
    </div>
  );
}

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ListFilter } from 'lucide-react';


import initialDealerships from '@/data/dealerships.json';
import data34 from '@/data/34json.json';
import data78 from '@/data/78csvjson.json';
import data92 from '@/data/92 Phantom_json.json';
import type { Dealership } from '@/lib/types';

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

  const resultCount = dealerships.length;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-[30%] h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Button variant="default" className="rounded-full">Tout voir</Button>
            <Button variant="outline" className="rounded-full">Concessionnaires</Button>
            <Button variant="outline" className="rounded-full">Réparateurs</Button>
          </div>
          <div className="flex items-center justify-between mt-4">
             <span className="text-sm text-muted-foreground">{resultCount} RÉSULTATS</span>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">Toutes marques <ListFilter className="ml-2 h-4 w-4"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>BMW</DropdownMenuItem>
                  <DropdownMenuItem>Yamaha</DropdownMenuItem>
                  <DropdownMenuItem>Honda</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" className="rounded-full">Note</Button>
              <Button variant="outline" className="rounded-full">Avis</Button>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {dealerships.map(dealer => (
              <DealershipCard key={dealer.id} dealership={dealer} />
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Map Area */}
      <main className="w-[70%] h-full relative">
        <MapComponent dealerships={dealerships} />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Espace publicitaire monétisable</p>
          </div>
        </div>
      </main>
    </div>
  );
}

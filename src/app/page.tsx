'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ListFilter } from 'lucide-react';

import initialDealerships from '@/data/dealerships.json';
import data34 from '@/data/34json.json';
import data78 from '@/data/78csvjson.json';
import data92 from '@/data/92 Phantom_json.json';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';

const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-200"><p>Chargement de la carte...</p></div>
});

const allDealershipsRaw = [
  ...initialDealerships,
  ...data34,
  ...data78,
  ...data92,
] as any[];

// Deduplicate and clean data once
const uniqueDealershipsRaw = Array.from(new Map(allDealershipsRaw.map(d => [d.placeUrl, d])).values());

const allDealerships: Dealership[] = uniqueDealershipsRaw.map((d, index) => ({
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


const getBrands = (dealerships: Dealership[]) => {
  const brandSet = new Set<string>();
  const brandKeywords = ['BMW', 'Ducati', 'Yamaha', 'Kawasaki', 'KTM', 'Husqvarna', 'Honda', 'Suzuki', 'Triumph', 'Harley-Davidson', 'Indian', 'Peugeot', 'Voge', 'Sym', 'ZERO', 'Aprilia', 'Gilera', 'Kymco', 'Askoll', 'Royal Enfield', 'Mash', 'Gasgas', 'Hytrack', 'Segway', 'Moto Guzzi'];
  
  dealerships.forEach(d => {
    brandKeywords.forEach(brand => {
      if (d.title.toLowerCase().includes(brand.toLowerCase())) {
        brandSet.add(brand);
      }
    });
  });

  return Array.from(brandSet).sort();
}

export default function Home() {
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout voir');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  const availableBrands = useMemo(() => getBrands(allDealerships), []);

  useEffect(() => {
    if (!searchQuery && selectedCategory === 'Tout voir' && selectedBrands.length === 0) {
      setFilteredDealerships([]);
      return;
    }

    let dealerships = allDealerships;

    // Filter by category
    if (selectedCategory === 'Concessionnaires') {
      dealerships = dealerships.filter(d => (d.category && d.category.toLowerCase().includes('concession')) || d.title.toLowerCase().includes('concession'));
    } else if (selectedCategory === 'Réparateurs') {
      dealerships = dealerships.filter(d => (d.category && (d.category.toLowerCase().includes('reparateur') || d.category.toLowerCase().includes('garage') || d.category.toLowerCase().includes('atelier'))) || d.title.toLowerCase().includes('reparateur') || d.title.toLowerCase().includes('garage'));
    }
    
    // Filter by search query (name, city, department)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      dealerships = dealerships.filter(d => 
        d.title.toLowerCase().includes(lowerCaseQuery) ||
        (d.address && d.address.toLowerCase().includes(lowerCaseQuery))
      );
    }
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      dealerships = dealerships.filter(d =>
        selectedBrands.some(brand => d.title.toLowerCase().includes(brand.toLowerCase()))
      );
    }

    setFilteredDealerships(dealerships);

  }, [searchQuery, selectedCategory, selectedBrands]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="flex flex-col h-screen">
       <Header onSearch={setSearchQuery} />
       <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[30%] h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Button variant={selectedCategory === 'Tout voir' ? 'default' : 'outline'} className="rounded-full" onClick={() => setSelectedCategory('Tout voir')}>Tout voir</Button>
              <Button variant={selectedCategory === 'Concessionnaires' ? 'default' : 'outline'} className="rounded-full" onClick={() => setSelectedCategory('Concessionnaires')}>Concessionnaires</Button>
              <Button variant={selectedCategory === 'Réparateurs' ? 'default' : 'outline'} className="rounded-full" onClick={() => setSelectedCategory('Réparateurs')}>Réparateurs</Button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">{filteredDealerships.length} RÉSULTATS</span>
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                      {selectedBrands.length > 0 ? `${selectedBrands.length} marque(s)` : 'Toutes marques'}
                      <ListFilter className="ml-2 h-4 w-4"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Marques</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableBrands.map(brand => (
                      <DropdownMenuCheckboxItem
                        key={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => handleBrandChange(brand)}
                      >
                        {brand}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="rounded-full">Note</Button>
                <Button variant="outline" className="rounded-full">Avis</Button>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {filteredDealerships.map(dealer => (
                <DealershipCard key={dealer.id} dealership={dealer} />
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Map Area */}
        <main className="w-[70%] h-full relative">
          <MapComponent dealerships={filteredDealerships} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Espace publicitaire monétisable</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

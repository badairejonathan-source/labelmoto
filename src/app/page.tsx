
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import locations from '@/data/locations.json';
import { List, Map as MapIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

import initialDealerships from '@/data/dealerships.json';
import data34 from '@/data/34json.json';
import data78 from '@/data/78csvjson.json';
import data92 from '@/data/92 Phantom_json.json';
import data77 from '@/data/77json.json';
import data91 from '@/data/91json.json';
import data94 from '@/data/94son.json';
import data95 from '@/data/95json.json';
import data93 from '@/data/93json.json';

const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-200"><p>Chargement de la carte...</p></div>
});

const allDealershipsRaw = [
  ...initialDealerships,
  ...data34,
  ...data78,
  ...data92,
  ...data77,
  ...data91,
  ...data94,
  ...data93,
  ...data95,
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
})).filter(d => d.title && typeof d.title === 'string' && d.address && typeof d.address === 'string' && d.placeUrl && d.latitude != null && d.longitude != null && !isNaN(d.latitude) && !isNaN(d.longitude));

const getBrands = (dealerships: Dealership[]) => {
  const brandSet = new Set<string>();
  const brandKeywords = [
    'Aprilia', 'Askoll', 'Benelli', 'BMW', 'Can-Am', 'CFMoto', 'Ducati', 'GasGas', 'Gilera', 
    'Harley-Davidson', 'Honda', 'Husqvarna', 'Hyosung', 'Hytrack', 'Indian', 
    'Kawasaki', 'KTM', 'Kymco', 'Mash', 'Moto Guzzi', 'MV Agusta', 'Neco', 'Orcal', 
    'Peugeot', 'Piaggio', 'Royal Enfield', 'Segway', 'Sherco', 'Suzuki', 'Sym', 
    'Triumph', 'Vespa', 'Voge', 'Yamaha', 'YCF', 'ZERO'
  ];
  
  dealerships.forEach(d => {
    if (d.title && typeof d.title === 'string') {
        brandKeywords.forEach(brand => {
            if (d.title.toLowerCase().includes(brand.toLowerCase())) {
                brandSet.add(brand);
            }
        });
    }
  });

  return Array.from(brandSet).sort();
}

export default function Home() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout voir');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  
  const availableBrands = useMemo(() => getBrands(allDealerships), []);

  const handleDepartmentChange = useCallback((department: string) => {
    setSelectedDepartment(department);
    setSelectedCity('');
    if (department && (locations as any)[department]) {
      setMapCenter((locations as any)[department].center as [number, number]);
      setMapZoom(9);
    } else {
      setMapCenter([46.603354, 1.888334]);
      setMapZoom(6);
    }
  }, []);

  const handleCityChange = useCallback((city: string) => {
      setSelectedCity(city);
  }, []);

  const handleBrandChange = useCallback((brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  }, []);

  useEffect(() => {
    let dealerships = allDealerships;

    // Filter by category
    if (selectedCategory === 'Concessionnaires') {
      dealerships = dealerships.filter(d => (d.category && d.category.toLowerCase().includes('concession')) || (d.title && typeof d.title === 'string' && d.title.toLowerCase().includes('concession')));
    } else if (selectedCategory === 'Réparateurs') {
      dealerships = dealerships.filter(d => (d.category && (d.category.toLowerCase().includes('reparateur') || d.category.toLowerCase().includes('garage') || d.category.toLowerCase().includes('atelier'))) || (d.title && typeof d.title === 'string' && (d.title.toLowerCase().includes('reparateur') || d.title.toLowerCase().includes('garage'))));
    }
    
    // Filter by location
    if (selectedCity) {
      const lowerCaseCity = selectedCity.toLowerCase();
      dealerships = dealerships.filter(d => 
        d.address && typeof d.address === 'string' && d.address.toLowerCase().includes(lowerCaseCity)
      );
    } else if (selectedDepartment) {
        // A rough way to filter by department number in address
        const depCode = selectedDepartment.split(' ')[0];
        dealerships = dealerships.filter(d => 
          d.address && typeof d.address === 'string' && d.address.includes(` ${depCode}`)
        );
    } else {
        if (selectedCategory === 'Tout voir' && selectedBrands.length === 0) {
            setFilteredDealerships([]);
            return;
        }
    }
    
    if (selectedBrands.length > 0) {
      dealerships = dealerships.filter(d =>
        d.title && typeof d.title === 'string' && selectedBrands.some(brand => d.title.toLowerCase().includes(brand.toLowerCase()))
      );
    }

    setFilteredDealerships(dealerships);

  }, [selectedDepartment, selectedCity, selectedCategory, selectedBrands]);

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onDepartmentChange={handleDepartmentChange} 
        onCityChange={handleCityChange}
        availableBrands={availableBrands}
        selectedBrands={selectedBrands}
        onBrandChange={handleBrandChange}
      />
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'list' && (
          <aside className="w-full h-full bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDealerships.map((dealer, index) => (
                <React.Fragment key={dealer.id}>
                  <DealershipCard dealership={dealer} />
                  {index === 2 && <AdCard />}
                </React.Fragment>
              ))}
            </div>
          </aside>
        )}
        <div className="flex-1 relative">
          <MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} />
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md">
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')} className="rounded-full">
              <List className="mr-2 h-4 w-4" />
              Liste
            </Button>
            <Button variant={viewMode === 'map' ? 'default' : 'ghost'} onClick={() => setViewMode('map')} className="rounded-full">
              <MapIcon className="mr-2 h-4 w-4" />
              Carte
            </Button>
          </div>
          {viewMode === 'map' && (
            <aside className="w-full md:w-[35%] lg:w-[30%] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 absolute left-0 top-0 bottom-0 z-10 overflow-y-auto">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {filteredDealerships.map((dealer, index) => (
                    <React.Fragment key={dealer.id}>
                      <DealershipCard dealership={dealer} />
                      {index === 2 && <AdCard />}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

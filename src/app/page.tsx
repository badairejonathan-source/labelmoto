
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import data77 from '@/data/77json.json';
import data91 from '@/data/91json.json';
import data94 from '@/data/94son.json';
import data95 from '@/data/95json.json';
import data93 from '@/data/93json.json';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import locations from '@/data/locations.json';


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
    'Yamaha', 'Honda', 'Kawasaki', 'Suzuki', 'BMW', 'Triumph', 'Ducati', 'Aprilia', 'KTM', 
    'Benelli', 'Royal Enfield', 'Piaggio', 'Vespa', 'Peugeot', 'Harley-Davidson',
    'Moto Guzzi', 'Husqvarna', 'GasGas', 'Indian', 'MV Agusta', 'Sym', 'Kymco', 'Voge', 
    'Mash', 'Orcal', 'CFMoto', 'Segway', 'Askoll', 'Gilera', 'ZERO'
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


  useEffect(() => {
    if (!selectedDepartment && !selectedCity && selectedCategory === 'Tout voir' && selectedBrands.length === 0) {
      setFilteredDealerships([]);
      return;
    }

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
          d.address && typeof d.address === 'string' && d.address.includes(depCode)
        );
    }
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      dealerships = dealerships.filter(d =>
        d.title && typeof d.title === 'string' && selectedBrands.some(brand => d.title!.toLowerCase().includes(brand.toLowerCase()))
      );
    }

    setFilteredDealerships(dealerships);

  }, [selectedDepartment, selectedCity, selectedCategory, selectedBrands]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="flex flex-col h-screen">
       <Header onDepartmentChange={handleDepartmentChange} onCityChange={handleCityChange} />
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
                    <ScrollArea className="h-72">
                      {availableBrands.map(brand => (
                        <DropdownMenuCheckboxItem
                          key={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => handleBrandChange(brand)}
                        >
                          {brand}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </ScrollArea>
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
          <MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} />
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

    

    
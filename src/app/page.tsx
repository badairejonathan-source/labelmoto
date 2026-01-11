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
import { List, Map as MapIcon, ArrowLeft, SlidersHorizontal, ListFilter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
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
import useWindowSize from '@/hooks/use-window-size';


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
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>(allDealerships);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout voir');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const availableBrands = useMemo(() => getBrands(allDealerships), []);

  useEffect(() => {
    if(isMobile) {
      setViewMode('map');
    } else {
      setViewMode('list');
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && filteredDealerships.length > 0 && !isFilterSheetOpen) {
      setIsMobileSheetOpen(true);
    } else {
      setIsMobileSheetOpen(false);
    }
  }, [isMobile, filteredDealerships, isFilterSheetOpen]);

  const [cities, setCities] = useState<string[]>([]);
  const departments = Object.keys(locations);

  const handleDepartmentChange = useCallback((department: string) => {
    setSelectedDepartment(department);
    setSelectedCity('');
    if (department && (locations as any)[department]) {
      const locationData = (locations as any)[department];
      setCities(locationData.cities || []);
      if(locationData.center) {
        setMapCenter(locationData.center as [number, number]);
        setMapZoom(9);
      }
    } else {
      setCities([]);
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

    if (selectedCategory === 'Tout voir' && selectedBrands.length === 0 && !selectedCity && !selectedDepartment) {
        setFilteredDealerships(allDealerships);
        return;
    }

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
    }
    
    if (selectedBrands.length > 0) {
      dealerships = dealerships.filter(d =>
        d.title && typeof d.title === 'string' && selectedBrands.some(brand => d.title.toLowerCase().includes(brand.toLowerCase()))
      );
    }

    // Sort by rating
    const sortedDealerships = dealerships.sort((a, b) => {
        const ratingA = a.rating ? parseFloat(String(a.rating).replace(',', '.')) : 0;
        const ratingB = b.rating ? parseFloat(String(b.rating).replace(',', '.')) : 0;
        return (isNaN(ratingB) ? 0 : ratingB) - (isNaN(ratingA) ? 0 : ratingA);
    });

    setFilteredDealerships(sortedDealerships);
    setSelectedDealershipId(null);

  }, [selectedDepartment, selectedCity, selectedCategory, selectedBrands]);

  const dealershipsToDisplay = useMemo(() => {
    if (selectedDealershipId && viewMode === 'map') {
      const selected = allDealerships.find(d => d.id === selectedDealershipId);
      return selected ? [selected] : [];
    }
    return filteredDealerships;
  }, [selectedDealershipId, filteredDealerships, viewMode]);
  
  const handleCardClick = (id: string) => {
      setSelectedDealershipId(prevId => prevId === id ? null : id);
  }
  
  const handleCloseExpandedCard = () => {
    setSelectedDealershipId(null);
  }

  const renderViewToggle = () => (
    <div className="fixed bottom-6 right-6 z-[1001] flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg">
      <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')} className="rounded-full px-4 py-2">
        <List className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">Liste</span>
      </Button>
      <Button variant={viewMode === 'map' ? 'default' : 'ghost'} onClick={() => setViewMode('map')} className="rounded-full px-4 py-2">
        <MapIcon className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">Carte</span>
      </Button>
    </div>
  );
  
  const renderFilters = (isMobileView = false) => {
    const commonClasses = "flex flex-col space-y-2";
    const desktopClasses = "md:flex-row md:flex-1 md:max-w-xl md:mx-4 md:space-y-0 md:space-x-2";
    
    return (
      <div className={cn(commonClasses, !isMobileView && desktopClasses)}>
        <Select onValueChange={handleDepartmentChange} value={selectedDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un département" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
              {departments.map(dep => (
                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <Select onValueChange={handleCityChange} value={selectedCity} disabled={!selectedDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une ville" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0 justify-between">
              {selectedBrands.length > 0 ? `${selectedBrands.length} marque(s)` : 'Toutes marques'}
              <ListFilter className="ml-2 h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header>
        {!isMobile && renderFilters()}
      </Header>
       <div className="flex-1 overflow-hidden md:p-4 md:pt-0 relative">
        {isMobile ? (
           <div className="h-full relative">
            <div className="absolute top-4 right-4 z-[1000]">
                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="default" size="icon" className="rounded-full shadow-lg">
                      <SlidersHorizontal className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="py-4 space-y-4 flex flex-col flex-1">
                      <div className="flex-1 space-y-4">
                        {renderFilters(true)}
                      </div>
                      <Button onClick={() => setIsFilterSheetOpen(false)} className="w-full">Valider</Button>
                    </div>
                  </SheetContent>
                </Sheet>
            </div>
            
            <MapComponent 
              dealerships={filteredDealerships} 
              center={mapCenter} 
              zoom={mapZoom} 
              hoveredDealershipId={hoveredDealershipId}
              onMarkerClick={(id) => setSelectedDealershipId(id)}
              onMarkerMouseOver={(id) => setHoveredDealershipId(id)}
              onMarkerMouseOut={() => setHoveredDealershipId(null)}
            />

            {filteredDealerships.length > 0 && (
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetContent side="bottom" className="h-[40vh]" showOverlay={false} closeButton={false}>
                  <SheetHeader className="p-4 pt-2 text-center">
                  <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto mb-2" />
                  <SheetTitle className="sr-only">Résultats</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full pb-4">
                  <div className="p-4 space-y-4">
                    {dealershipsToDisplay.map((dealer, index) => (
                      <React.Fragment key={dealer.id}>
                        <div 
                          onClick={() => handleCardClick(dealer.id)}
                          onMouseEnter={() => setHoveredDealershipId(dealer.id)}
                          onMouseLeave={() => setHoveredDealershipId(null)}
                        >
                          <DealershipCard 
                            dealership={dealer} 
                            isExpanded={selectedDealershipId === dealer.id}
                            onClose={handleCloseExpandedCard}
                          />
                        </div>
                        {(index + 1) % 4 === 0 && !selectedDealershipId && <AdCard />}
                      </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            )}

           </div>
        ) : (
          <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-4">
            {viewMode === 'list' ? (
              <>
                 <aside className="hidden xl:block xl:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg"></aside>
                 <div className="col-span-12 xl:col-span-8 h-full">
                  <ScrollArea className="h-full">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dealershipsToDisplay.map((dealer, index) => (
                        <React.Fragment key={dealer.id}>
                           <div
                              className={selectedDealershipId === dealer.id ? 'md:col-span-2 lg:col-span-3' : ''}
                           >
                            <DealershipCard 
                              dealership={dealer} 
                              isExpanded={selectedDealershipId === dealer.id}
                              onClose={handleCloseExpandedCard}
                              onClick={() => handleCardClick(dealer.id)}
                            />
                          </div>
                          {(index + 1) % 6 === 0 && !selectedDealershipId && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <AdCard />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                      {filteredDealerships.length > 0 && filteredDealerships.length < 4 && !selectedDealershipId && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <AdCard />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                 </div>
                <aside className="hidden xl:block xl:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg"></aside>
              </>
            ) : (
             <>
              <aside className="hidden xl:block xl:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg"></aside>
              <div className="col-span-12 md:col-span-4 h-full bg-white dark:bg-gray-800 flex flex-col rounded-lg overflow-hidden">
              {selectedDealershipId && (
                  <Button
                    variant="ghost"
                    onClick={handleCloseExpandedCard}
                    className="flex items-center justify-start p-4 text-sm font-medium"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la liste
                  </Button>
                )}
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-2">
                      {dealershipsToDisplay.map((dealer, index) => (
                        <React.Fragment key={dealer.id}>
                          <div 
                            onClick={() => handleCardClick(dealer.id)}
                            onMouseEnter={() => setHoveredDealershipId(dealer.id)}
                            onMouseLeave={() => setHoveredDealershipId(null)}
                          >
                            <DealershipCard 
                                dealership={dealer} 
                                isExpanded={selectedDealershipId === dealer.id}
                                onClose={handleCloseExpandedCard}
                            />
                          </div>
                          {(index + 1) % 6 === 0 && <AdCard />}
                        </React.Fragment>
                      ))}
                    </div>
                </ScrollArea>
              </div>
              <div className="col-span-12 md:col-span-4 relative rounded-lg overflow-hidden">
                <MapComponent 
                  dealerships={filteredDealerships} 
                  center={mapCenter} 
                  zoom={mapZoom} 
                  hoveredDealershipId={hoveredDealershipId}
                  onMarkerClick={(id) => setSelectedDealershipId(id)}
                  onMarkerMouseOver={(id) => setHoveredDealershipId(id)}
                  onMarkerMouseOut={() => setHoveredDealershipId(null)}
                />
              </div>
              <aside className="hidden xl:block xl:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg"></aside>
            </>
            )}
          </div>
        )}
      </div>
      {!isMobile && renderViewToggle()}
    </div>
  );
}

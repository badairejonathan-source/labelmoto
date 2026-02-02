
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import locations from '@/data/locations.json';
import { SlidersHorizontal, ListFilter, List, Map as MapIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { cn } from "@/lib/utils";
import useWindowSize from '@/hooks/use-window-size';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from "firebase/firestore";

const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-200"><p>Chargement de la carte...</p></div>
});

const brandKeywords = [
    'Aprilia', 'Benelli', 'BMW', 'Can-Am', 'CFMOTO', 'Daelim', 'Ducati', 'Fantic', 'GasGas', 'Harley-Davidson', 
    'Honda', 'Husqvarna', 'Hyosung', 'Indian', 'Kawasaki', 'Keeway', 'KTM', 'Kymco', 'Mash', 'Moto Guzzi', 
    'MV Agusta', 'Orcal', 'Peugeot', 'Piaggio', 'Royal Enfield', 'Suzuki', 'SWM', 'Sym', 'Triumph', 'Vespa', 
    'Yamaha', 'Zontes'
];

const getBrands = (dealerships: Dealership[]) => {
  const brandSet = new Set<string>();
  
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

  const [allDealerships, setAllDealerships] = useState<Dealership[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [nearbyDealerships, setNearbyDealerships] = useState<Dealership[]>([]);
  
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [desktopView, setDesktopView] = useState<'split' | 'list'>('split');
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const concessionsRef = collection(db, 'concessions');

    const unsubscribe = onSnapshot(concessionsRef, (querySnapshot) => {
        const dealershipMap = new Map<string, Dealership>();

        querySnapshot.docs.forEach((doc) => {
          const dealer = doc.data();
          const uniqueKey = doc.id;

          if (dealer && dealer.placeUrl && dealer.title && dealer.latitude && dealer.longitude) {
            if (!dealershipMap.has(uniqueKey)) {
              const lat = parseFloat(String(dealer.latitude).replace(',', '.'));
              const lng = parseFloat(String(dealer.longitude).replace(',', '.'));

              if (!isNaN(lat) && !isNaN(lng)) {
                const dealerWithId: Dealership = {
                  ...(dealer as any),
                  id: uniqueKey,
                  latitude: lat,
                  longitude: lng,
                };
                dealershipMap.set(uniqueKey, dealerWithId);
              }
            }
          }
        });
        
        const uniqueDealerships = Array.from(dealershipMap.values());
        setAllDealerships(uniqueDealerships);
    }, (error) => {
        console.error("Firebase read failed: " + error.message);
        setAllDealerships([]);
    });

    return () => unsubscribe();
  }, []);

  const availableBrands = useMemo(() => getBrands(allDealerships), [allDealerships]);
  const hasActiveFilters = (selectedDepartment !== '' && selectedDepartment !== 'all') || selectedCity !== '' || selectedBrands.length > 0;

  useEffect(() => {
    let dealerships = allDealerships;

    if (hasActiveFilters) {
        if (selectedDepartment && selectedDepartment !== 'all') {
            const depCode = selectedDepartment.split(' ')[0];
            const postalCodeRegex = new RegExp(`\\b${depCode}\\d{3}\\b`);
            dealerships = dealerships.filter(d =>
                d.address && typeof d.address === 'string' && postalCodeRegex.test(d.address)
            );
        }
        
        if (selectedCity) {
            const lowerCaseCity = selectedCity.toLowerCase();
            dealerships = dealerships.filter(d =>
                d.address && typeof d.address === 'string' && d.address.toLowerCase().includes(lowerCaseCity)
            );
        }
        
        if (selectedBrands.length > 0) {
            const brandLower = selectedBrands.map(b => b.toLowerCase());
            dealerships = dealerships.filter(d => 
                d.title && typeof d.title === 'string' && brandLower.some(brand => d.title.toLowerCase().includes(brand))
            );
        }
    }
    
    setFilteredDealerships(dealerships);

  }, [selectedDepartment, selectedCity, selectedBrands, allDealerships, hasActiveFilters]);

  const cities = useMemo(() => {
    if (selectedDepartment && selectedDepartment !== 'all' && (locations as any)[selectedDepartment]) {
      return (locations as any)[selectedDepartment].cities || [];
    }
    return [];
  }, [selectedDepartment]);

  const [departments, setDepartments] = useState<string[]>([]);
  useEffect(() => {
    setDepartments(Object.keys(locations));
  }, []);

  const handleDepartmentChange = useCallback((department: string) => {
    if(!userHasInteracted) setUserHasInteracted(true);
    setSelectedDepartment(department);
    setSelectedCity('');
    if (department && department !== 'all') {
      const depData = (locations as any)[department];
      if (depData && depData.center) {
        setMapCenter(depData.center as [number, number]);
        setMapZoom(9);
      }
    } else if (department === 'all') {
      setMapCenter([46.603354, 1.888334]);
      setMapZoom(6);
    }
  }, [userHasInteracted]);

  const handleCityChange = useCallback((city: string) => {
      if(!userHasInteracted) setUserHasInteracted(true);
      const cityValue = city === 'all-cities' ? '' : city;
      setSelectedCity(cityValue);
  }, [userHasInteracted]);

  const handleBrandChange = useCallback((brand: string) => {
    if(!userHasInteracted) setUserHasInteracted(true);
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  }, [userHasInteracted]);

  const handleNearbyChange = useCallback((dealerships: Dealership[]) => {
      setNearbyDealerships(dealerships);
  }, []);

  const handleMapZoom = useCallback(() => {
    if(!userHasInteracted) setUserHasInteracted(true);
  }, [userHasInteracted]);
  
  const dealershipsToDisplay = useMemo(() => {
    if (!userHasInteracted) {
        return [];
    }

    if (!isMobile || (isMobile && isMobileSheetOpen)) {
        if (hasActiveFilters) {
            return filteredDealerships;
        }
        return nearbyDealerships;
    }

    return [];
  }, [isMobile, isMobileSheetOpen, nearbyDealerships, filteredDealerships, userHasInteracted, hasActiveFilters]);
  
  const handleCardClick = useCallback((dealership: Dealership) => {
    if (!userHasInteracted) setUserHasInteracted(true);
    
    if (dealership && dealership.latitude && dealership.longitude) {
      setMapCenter([dealership.latitude, dealership.longitude]);
      setMapZoom(14);
    }
    
    if (isMobile) {
      setIsMobileSheetOpen(true);
    }
  }, [isMobile, userHasInteracted]);
  
  const handleMarkerClick = useCallback((id: string) => {
    if (!userHasInteracted) setUserHasInteracted(true);
    const selectedDealership = allDealerships.find(d => d.id === id);
    if (selectedDealership && selectedDealership.latitude && selectedDealership.longitude) {
      setMapCenter([selectedDealership.latitude, selectedDealership.longitude]);
      setMapZoom(14);
    }
    if (isMobile) {
      setIsMobileSheetOpen(true);
    }
  }, [allDealerships, isMobile, userHasInteracted]);

  const handleMarkerMouseOver = useCallback((id: string) => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
    }
    setHoveredDealershipId(id);
  }, []);

  const handleMouseOut = useCallback(() => {
      hoverTimeoutRef.current = setTimeout(() => {
          setHoveredDealershipId(null);
      }, 100);
  }, []);

  const renderFilters = (isMobileView = false) => {
    const commonClasses = "flex flex-col space-y-2";
    const desktopClasses = "md:flex-row md:flex-1 md:max-w-xl md:mx-4 md:space-y-0 md:space-x-2";
    
    return (
      <div className={cn(commonClasses, !isMobileView && desktopClasses)}>
        <Select onValueChange={handleDepartmentChange} value={selectedDepartment}>
          <SelectTrigger variant="filter">
            <span className="mr-2">Departements:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
              <SelectItem value="all">France entière</SelectItem>
              {departments.map(dep => (
                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <Select onValueChange={handleCityChange} value={selectedCity || 'all-cities'} disabled={!selectedDepartment || selectedDepartment === 'all'}>
          <SelectTrigger variant="filter">
            <SelectValue placeholder="Choisir une ville" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
               <SelectItem value="all-cities">Toutes les villes</SelectItem>
              {cities.map((city:any) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="filter" className="shrink-0 justify-between">
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
  };
  
  const adFrequency = dealershipsToDisplay.length < 5 ? 3 : 5;

  const listContent = (
      <ScrollArea className="flex-grow h-0">
          <div className={cn(
            "p-4",
            desktopView === 'list' ? "grid md:grid-cols-2 gap-4" : "space-y-2"
          )}>
            {dealershipsToDisplay.map((dealer, index) => (
              <div 
                key={dealer.id}
                onMouseEnter={() => handleMarkerMouseOver(dealer.id)}
                onMouseLeave={handleMouseOut}
              >
                <DealershipCard 
                    dealership={dealer} 
                    onClick={() => handleCardClick(dealer)}
                />
              </div>
            ))}
            {dealershipsToDisplay.length > 0 && (index + 1) % adFrequency === 0 && (
              <div className={cn(desktopView === 'list' && 'md:col-span-2')}>
                <AdCard />
              </div>
            )}
            {dealershipsToDisplay.length > 0 && dealershipsToDisplay.length < 3 && (
              <div className={cn(desktopView === 'list' && 'md:col-span-2')}>
                <AdCard />
              </div>
            )}
              {dealershipsToDisplay.length === 0 &&
              (userHasInteracted ? (
                <div className={cn("text-center text-muted-foreground pt-20", desktopView === 'list' && 'md:col-span-2')}>
                  <p>Aucun résultat trouvé.</p>
                  <p className="text-sm">Essayez d'ajuster vos filtres.</p>
                </div>
              ) : (
                <div className={cn("h-[60vh] flex items-center justify-center", desktopView === 'list' && 'md:col-span-2')}>
                  <div className="w-full">
                      <AdCard />
                  </div>
                </div>
              ))}
          </div>
      </ScrollArea>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header>
        {!isMobile && renderFilters()}
      </Header>
       <div className="flex-1 overflow-hidden flex flex-row">
        {isMobile ? (
           <div className="h-full relative flex-1">
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
                    <div className="py-4 space-y-4">
                      {renderFilters(true)}
                    </div>
                     <Button onClick={() => setIsFilterSheetOpen(false)} className="mt-auto">Valider</Button>
                  </SheetContent>
                </Sheet>
            </div>
            
            <MapComponent 
              dealerships={hasActiveFilters ? filteredDealerships : allDealerships}
              center={mapCenter} 
              zoom={mapZoom} 
              hoveredDealershipId={hoveredDealershipId}
              onMarkerClick={handleMarkerClick}
              onMarkerMouseOver={handleMarkerMouseOver}
              onMarkerMouseOut={handleMouseOut}
              isMobile={isMobile}
              onNearbyChange={handleNearbyChange}
              onMapZoom={handleMapZoom}
            />

            {isMobileSheetOpen && (
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen} >
               <SheetContent
                 side="bottom"
                 className="flex flex-col transition-all duration-300 p-0 h-[50vh]"
                 closeButton={false}
                 showOverlay={false}
                 onInteractOutside={(e) => {
                   if (e.target instanceof HTMLElement && e.target.closest('.leaflet-container')) {
                     e.preventDefault();
                   }
                 }}
               >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Résultats</SheetTitle>
                  </SheetHeader>
                 <div className="py-2 text-center flex-shrink-0">
                    <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto" />
                  </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-2 space-y-4 pb-6">
                    {dealershipsToDisplay.map((dealer) => (
                      <div
                        key={dealer.id}
                        onMouseEnter={() => handleMarkerMouseOver(dealer.id)}
                        onMouseLeave={handleMouseOut}
                      >
                        <DealershipCard 
                          dealership={dealer} 
                          onClick={() => handleCardClick(dealer)}
                        />
                      </div>
                    ))}
                     {dealershipsToDisplay.length === 0 && (
                        <div className="text-center text-muted-foreground pt-10">
                            <p>Aucun résultat trouvé.</p>
                            {userHasInteracted && <p className="text-sm">Essayez d'ajuster vos filtres.</p>}
                        </div>
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            )}

           </div>
        ) : (
          <div className="flex flex-1 relative">
            {desktopView === 'split' ? (
              <>
                <aside className="w-2/5 max-w-[400px] flex-shrink-0 h-full flex flex-col bg-background shadow-lg border-r border-border z-10">
                  {listContent}
                </aside>
                <main className="flex-1 overflow-hidden h-full relative">
                    <MapComponent 
                      dealerships={hasActiveFilters ? filteredDealerships : allDealerships}
                      center={mapCenter} 
                      zoom={mapZoom} 
                      hoveredDealershipId={hoveredDealershipId}
                      onMarkerClick={handleMarkerClick}
                      onMarkerMouseOver={handleMarkerMouseOver}
                      onMarkerMouseOut={handleMouseOut}
                      isMobile={isMobile}
                      onNearbyChange={handleNearbyChange}
                      onMapZoom={handleMapZoom}
                    />
                </main>
              </>
            ) : (
              <aside className="w-full h-full flex flex-col bg-background">
                {listContent}
              </aside>
            )}
             {!isMobile && (
              <div className="absolute bottom-5 right-5 z-[1000] flex space-x-1 bg-card p-1 rounded-full shadow-lg border">
                <Button
                  onClick={() => setDesktopView('list')}
                  variant={desktopView === 'list' ? 'default' : 'ghost'}
                  className="rounded-full gap-2"
                >
                  <List className="h-4 w-4" />
                  Liste
                </Button>
                <Button
                  onClick={() => setDesktopView('split')}
                  variant={desktopView === 'split' ? 'default' : 'ghost'}
                  className="rounded-full gap-2"
                >
                  <MapIcon className="h-4 w-4" />
                  Carte
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

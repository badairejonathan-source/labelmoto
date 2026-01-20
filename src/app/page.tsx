
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
import useWindowSize from '@/hooks/use-window-size';
import { db } from '@/lib/firebase';
import { ref, onValue } from "firebase/database";

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

  const [viewMode, setViewMode] = useState<'list' | 'map'>(isMobile ? 'map' : 'map');
  const [allDealerships, setAllDealerships] = useState<Dealership[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  useEffect(() => {
    const concessionsRef = ref(db, '/');
    const unsubscribe = onValue(concessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dealershipMap = new Map<string, Dealership>();
        const featureIdRegex = /\/g\/([a-zA-Z0-9_-]+)/;
        
        Object.values(data).forEach((deptData: any) => {
          if (deptData && typeof deptData === 'object') {
            Object.values(deptData).forEach((dealer: any) => {
              if (dealer && dealer.placeUrl) {
                const match = dealer.placeUrl.match(featureIdRegex);
                const uniqueKey = match ? match[1] : dealer.placeUrl;
                
                // Use the uniqueKey for the map to deduplicate, and as the item's ID
                const dealerWithId: Dealership = { ...dealer, id: uniqueKey };
                dealershipMap.set(uniqueKey, dealerWithId);
              }
            });
          }
        });
        
        const uniqueDealerships = Array.from(dealershipMap.values());
        
        setAllDealerships(uniqueDealerships);
      }
    });

    return () => unsubscribe();
  }, []);

  const availableBrands = useMemo(() => getBrands(allDealerships), [allDealerships]);
  const hasActiveFilters = (selectedDepartment !== '' && selectedDepartment !== 'all') || selectedCity !== '' || selectedBrands.length > 0;

  useEffect(() => {
    if (hasActiveFilters) {
        let dealerships = allDealerships;

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
                d.title && brandLower.some(brand => d.title.toLowerCase().includes(brand))
            );
        }
        
        setFilteredDealerships(dealerships);
    } else {
        setFilteredDealerships([]);
    }
    
    if(!hasActiveFilters && !isMobile){
        setSelectedDealershipId(null);
    }

  }, [selectedDepartment, selectedCity, selectedBrands, allDealerships, isMobile, hasActiveFilters]);

  const cities = useMemo(() => {
    if (selectedDepartment && selectedDepartment !== 'all' && (locations as any)[selectedDepartment]) {
      return (locations as any)[selectedDepartment].cities || [];
    }
    return [];
  }, [selectedDepartment]);
  const departments = Object.keys(locations);

  const handleDepartmentChange = useCallback((department: string) => {
    setSelectedDepartment(department);
    setSelectedCity('');
    if (isMobile && department && department !== 'all') {
      const depData = (locations as any)[department];
      if (depData && depData.center) {
        setMapCenter(depData.center as [number, number]);
        setMapZoom(9);
      }
    } else if (department === 'all') {
      setMapCenter([46.603354, 1.888334]);
      setMapZoom(6);
    }
  }, [isMobile]);

  const handleCityChange = useCallback((city: string) => {
      const cityValue = city === 'all-cities' ? '' : city;
      setSelectedCity(cityValue);
  }, []);

  const handleBrandChange = useCallback((brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  }, []);

  const hoveredDealership = useMemo(() => {
    if (!hoveredDealershipId) return null;
    return allDealerships.find(d => d.id === hoveredDealershipId);
  }, [hoveredDealershipId, allDealerships]);

  const dealershipsToDisplay = useMemo(() => {
    if (selectedDealershipId && (viewMode === 'map' || isMobile)) {
      const selected = allDealerships.find(d => d.id === selectedDealershipId);
      return selected ? [selected] : [];
    }
    return filteredDealerships;
  }, [selectedDealershipId, filteredDealerships, viewMode, allDealerships, isMobile]);
  
  const handleCardClick = useCallback((id: string) => {
    const newSelectedId = selectedDealershipId === id ? null : id;
    setSelectedDealershipId(newSelectedId);

    if (newSelectedId) {
      const selectedDealership = allDealerships.find(d => d.id === newSelectedId);
      if (selectedDealership && selectedDealership.latitude && selectedDealership.longitude) {
        setMapCenter([selectedDealership.latitude, selectedDealership.longitude]);
        setMapZoom(14);
      }
      if (isMobile) {
        setIsMobileSheetOpen(true);
        setIsSheetExpanded(false);
      }
    } else {
        if(isMobile) {
            setIsMobileSheetOpen(false);
        }
    }
  }, [selectedDealershipId, allDealerships, isMobile]);
  
  const handleMarkerClick = useCallback((id: string) => {
    setSelectedDealershipId(id);
    const selectedDealership = allDealerships.find(d => d.id === id);
    if (selectedDealership && selectedDealership.latitude && selectedDealership.longitude) {
      setMapCenter([selectedDealership.latitude, selectedDealership.longitude]);
      setMapZoom(14);
    }
    if (isMobile) {
      setIsMobileSheetOpen(true);
      setIsSheetExpanded(false);
    }
  }, [allDealerships, isMobile]);

  const handleMarkerMouseOver = useCallback((id: string) => {
    setHoveredDealershipId(id);
  }, []);

  const handleMarkerMouseOut = useCallback(() => {
    setHoveredDealershipId(null);
  }, []);

  const handleCloseExpandedCard = () => {
    setSelectedDealershipId(null);
     if (isMobile) {
      setIsMobileSheetOpen(false);
    }
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
  
  return (
    <div className="flex flex-col h-screen">
      <Header>
        {!isMobile && renderFilters()}
      </Header>
       <div className="flex-1 overflow-hidden flex">
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
            
            {hoveredDealership && !isMobileSheetOpen && (
              <div
                className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-sm"
                onMouseEnter={() => handleMarkerMouseOver(hoveredDealership.id)}
                onMouseLeave={handleMarkerMouseOut}
              >
                <DealershipCard
                  dealership={hoveredDealership}
                  view="compact"
                  className="shadow-2xl"
                  onClick={() => handleCardClick(hoveredDealership.id)}
                />
              </div>
            )}
            
            <MapComponent 
              dealerships={filteredDealerships}
              center={mapCenter} 
              zoom={mapZoom} 
              hoveredDealershipId={hoveredDealershipId}
              onMarkerClick={handleMarkerClick}
              onMarkerMouseOver={handleMarkerMouseOver}
              onMarkerMouseOut={handleMarkerMouseOut}
              isMobile={isMobile}
            />

            {isMobileSheetOpen && (
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen} >
               <SheetContent
                 side="bottom"
                 className={cn("flex flex-col transition-all duration-300 p-0", isSheetExpanded ? 'h-[90vh]' : 'h-[50vh]')}
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
                 <div
                    className="py-2 text-center flex-shrink-0 cursor-pointer"
                    onClick={() => setIsSheetExpanded(!isSheetExpanded)}
                  >
                    <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto" />
                  </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-2 space-y-4 pb-6">
                    {dealershipsToDisplay.map((dealer, index) => (
                      <React.Fragment key={dealer.id}>
                        <div 
                          onClick={() => handleCardClick(dealer.id)}
                          onMouseEnter={() => handleMarkerMouseOver(dealer.id)}
                          onMouseLeave={handleMarkerMouseOut}
                        >
                          <DealershipCard 
                            dealership={dealer} 
                            isExpanded={selectedDealershipId === dealer.id}
                            onClose={handleCloseExpandedCard}
                            view="list"
                          />
                        </div>
                        {(index + 1) % 4 === 0 && !selectedDealershipId && <AdCard />}
                      </React.Fragment>
                    ))}
                     {dealershipsToDisplay.length === 0 && hasActiveFilters && (
                        <div className="text-center text-muted-foreground pt-10">
                            <p>Aucun résultat trouvé.</p>
                            <p className="text-sm">Essayez d'ajuster vos filtres.</p>
                        </div>
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            )}

           </div>
        ) : (
          <>
            {viewMode === 'map' ? (
             <div className="grid grid-cols-12 flex-1 overflow-hidden">
                <div className="col-span-4 h-full flex flex-col">
                    {selectedDealershipId && (
                      <Button
                        variant="ghost"
                        onClick={handleCloseExpandedCard}
                        className="flex items-center justify-start p-4 text-sm font-medium shrink-0"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à la liste
                      </Button>
                    )}
                    <ScrollArea className="flex-grow h-0">
                        <div className="p-4 space-y-2">
                          {dealershipsToDisplay.map((dealer, index) => (
                            <React.Fragment key={dealer.id}>
                              <div 
                                onClick={() => handleCardClick(dealer.id)}
                                onMouseEnter={() => handleMarkerMouseOver(dealer.id)}
                                onMouseLeave={handleMarkerMouseOut}
                              >
                                <DealershipCard 
                                    dealership={dealer} 
                                    isExpanded={selectedDealershipId === dealer.id}
                                    onClose={handleCloseExpandedCard}
                                    view="compact"
                                />
                              </div>
                              {(index + 1) % 6 === 0 && !selectedDealershipId && <AdCard />}
                            </React.Fragment>
                          ))}
                           {dealershipsToDisplay.length === 0 && hasActiveFilters && (
                                <div className="text-center text-muted-foreground pt-20">
                                    <p>Aucun résultat trouvé.</p>
                                    <p className="text-sm">Essayez d'ajuster vos filtres.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
                <div className="col-span-8 rounded-lg overflow-hidden h-full relative">
                    {hoveredDealership && (
                      <div
                        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4"
                        onMouseEnter={() => handleMarkerMouseOver(hoveredDealership.id)}
                        onMouseLeave={handleMarkerMouseOut}
                      >
                        <DealershipCard
                          dealership={hoveredDealership}
                          view="compact"
                          className="shadow-2xl"
                          onClick={() => handleCardClick(hoveredDealership.id)}
                        />
                      </div>
                    )}
                    <MapComponent 
                      dealerships={filteredDealerships}
                      center={mapCenter} 
                      zoom={mapZoom} 
                      hoveredDealershipId={hoveredDealershipId}
                      onMarkerClick={handleMarkerClick}
                      onMarkerMouseOver={handleMarkerMouseOver}
                      onMarkerMouseOut={handleMarkerMouseOut}
                      isMobile={isMobile}
                    />
                </div>
              </div>
            ) : (
                <div className="h-full flex flex-col overflow-hidden flex-1">
                    <ScrollArea className="flex-grow">
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dealershipsToDisplay.map((dealer, index) => (
                            <React.Fragment key={dealer.id}>
                                <DealershipCard 
                                    dealership={dealer} 
                                    isExpanded={selectedDealershipId === dealer.id}
                                    onClose={handleCloseExpandedCard}
                                    onClick={() => handleCardClick(dealer.id)}
                                    view={selectedDealershipId === dealer.id ? 'expanded' : 'list'}
                                    className={selectedDealershipId === dealer.id ? 'sm:col-span-2 lg:col-span-3' : ''}
                                />
                                {(index + 1) % 6 === 0 && !selectedDealershipId && (
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <AdCard />
                                </div>
                                )}
                            </React.Fragment>
                            ))}
                            {dealershipsToDisplay.length > 0 && dealershipsToDisplay.length < 4 && !selectedDealershipId && (
                            <div className="sm:col-span-2 lg:col-span-3">
                                <AdCard />
                            </div>
                            )}
                             {dealershipsToDisplay.length === 0 && hasActiveFilters && (
                                <div className="text-center text-muted-foreground pt-20 col-span-full">
                                    <p>Aucun résultat trouvé.</p>
                                    <p className="text-sm">Essayez d'ajuster vos filtres.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}
          </>
        )}
      </div>
      {!isMobile && renderViewToggle()}
    </div>
  );
}

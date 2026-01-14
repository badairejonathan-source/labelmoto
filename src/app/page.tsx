
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

  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [allDealerships, setAllDealerships] = useState<Dealership[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout voir');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    const concessionsRef = ref(db);
    const unsubscribe = onValue(concessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const firebaseDealerships: Dealership[] = [];
        // Loop through all departments in the data (e.g., '30', '95')
        Object.values(data).forEach((deptData: any) => {
            if(typeof deptData === 'object' && deptData !== null) {
                // Loop through all dealerships within a department
                Object.values(deptData).forEach((dealer: any) => {
                    if(dealer && dealer.id) {
                        firebaseDealerships.push(dealer as Dealership);
                    }
                })
            }
        });
        
        const uniqueDealerships = firebaseDealerships.reduce((acc: Dealership[], current) => {
            if (!acc.find(item => item.id === current.id)) {
                acc.push(current);
            }
            return acc;
        }, []);
        
        setAllDealerships(uniqueDealerships);
      }
    });

    return () => unsubscribe();
  }, []);

  const availableBrands = useMemo(() => getBrands(allDealerships), [allDealerships]);
  
  const hasActiveFilters = useMemo(() => {
    return selectedDepartment !== 'all' || selectedCity !== '' || selectedCategory !== 'Tout voir' || selectedBrands.length > 0;
  }, [selectedDepartment, selectedCity, selectedCategory, selectedBrands]);
  
  const brandHighlightIds = useMemo(() => {
    const ids = new Set<string>();
    if (selectedBrands.length > 0) {
      const brandLower = selectedBrands.map(b => b.toLowerCase());
      allDealerships.forEach(d => {
        if (d.title && brandLower.some(brand => d.title.toLowerCase().includes(brand))) {
          ids.add(d.id);
        }
      });
    }
    return ids;
  }, [selectedBrands, allDealerships]);


  useEffect(() => {
    let dealerships = allDealerships;

    if (selectedDepartment && selectedDepartment !== 'all') {
        const depCode = selectedDepartment.split(' ')[0];
        dealerships = dealerships.filter(d =>
            d.address && typeof d.address === 'string' && d.address.includes(depCode)
        );
    }
    
    if (selectedCity) {
        const lowerCaseCity = selectedCity.toLowerCase();
        dealerships = dealerships.filter(d =>
            d.address && typeof d.address === 'string' && d.address.toLowerCase().includes(lowerCaseCity)
        );
    }

    if (selectedCategory === 'Concessionnaires') {
        dealerships = dealerships.filter(d => (d.category && d.category.toLowerCase().includes('concession')) || (d.title && typeof d.title === 'string' && d.title.toLowerCase().includes('concession')));
    } else if (selectedCategory === 'Réparateurs') {
        dealerships = dealerships.filter(d => (d.category && (d.category.toLowerCase().includes('reparateur') || d.category.toLowerCase().includes('garage') || d.category.toLowerCase().includes('atelier'))) || (d.title && typeof d.title === 'string' && (d.title.toLowerCase().includes('reparateur') || d.title.toLowerCase().includes('garage'))));
    }


    const sortedDealerships = [...dealerships].sort((a, b) => {
        const aIsBrand = brandHighlightIds.has(a.id);
        const bIsBrand = brandHighlightIds.has(b.id);
        
        if (aIsBrand && !bIsBrand) return -1;
        if (!aIsBrand && bIsBrand) return 1;

        const ratingA = a.rating ? parseFloat(String(a.rating).replace(',', '.')) : 0;
        const ratingB = b.rating ? parseFloat(String(b.rating).replace(',', '.')) : 0;
        return (isNaN(ratingB) ? 0 : ratingB) - (isNaN(ratingA) ? 0 : ratingA);
    });

    setFilteredDealerships(sortedDealerships);
    
    const shouldOpenSheet = selectedDepartment !== 'all' || selectedCity !== '';

    if (isMobile) {
      if(shouldOpenSheet && !isFilterSheetOpen) {
          setIsMobileSheetOpen(true);
      } else if (!shouldOpenSheet) {
          setIsMobileSheetOpen(false);
      }
    }
    
    if(selectedDepartment === 'all' && !selectedCity){
        setSelectedDealershipId(null);
    }

  }, [selectedDepartment, selectedCity, selectedCategory, isMobile, isFilterSheetOpen, selectedBrands, brandHighlightIds, allDealerships]);

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
    if (department && department !== 'all' && (locations as any)[department]) {
      const locationData = (locations as any)[department];
      if(locationData.center) {
        setMapCenter(locationData.center as [number, number]);
        setMapZoom(9);
      }
    } else {
      setMapCenter([46.603354, 1.888334]);
      setMapZoom(6);
    }
  }, []);

  const handleCityChange = useCallback((city: string) => {
      setSelectedCity(city);
      if(city){
        const depData = (locations as any)[selectedDepartment];
        if(depData && depData.cityCoords && depData.cityCoords[city]){
           setMapCenter(depData.cityCoords[city] as [number, number]);
           setMapZoom(12);
        }
      }
  }, [selectedDepartment]);

  const handleBrandChange = useCallback((brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  }, []);

  const dealershipsToDisplay = useMemo(() => {
    if (selectedDealershipId && (viewMode === 'map' || isMobile)) {
      const selected = allDealerships.find(d => d.id === selectedDealershipId);
      return selected ? [selected] : [];
    }
    // If there are active filters, show filtered results. Otherwise, show all.
    return hasActiveFilters ? filteredDealerships : allDealerships;
  }, [selectedDealershipId, filteredDealerships, viewMode, allDealerships, isMobile, hasActiveFilters]);
  
  const handleCardClick = (id: string) => {
      setSelectedDealershipId(prevId => prevId === id ? null : id);
      if (isMobile) {
        setIsMobileSheetOpen(true);
      }
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
          <SelectTrigger variant="filter">
            <SelectValue placeholder="Choisir un département" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
              <SelectItem value="all">Tout voir</SelectItem>
              {departments.map(dep => (
                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
        <Select onValueChange={handleCityChange} value={selectedCity} disabled={!selectedDepartment || selectedDepartment === 'all'}>
          <SelectTrigger variant="filter">
            <SelectValue placeholder="Choisir une ville" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
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
  }

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
            
            <MapComponent 
              dealerships={allDealerships} 
              center={mapCenter} 
              zoom={mapZoom} 
              hoveredDealershipId={hoveredDealershipId}
              brandHighlightIds={brandHighlightIds}
              onMarkerClick={(id) => handleCardClick(id)}
              onMarkerMouseOver={(id) => setHoveredDealershipId(id)}
              onMarkerMouseOut={() => setHoveredDealershipId(null)}
            />

            {(isMobileSheetOpen || hasActiveFilters ) && (
            <Sheet open={isMobileSheetOpen || hasActiveFilters} onOpenChange={setIsMobileSheetOpen} >
               <SheetContent 
                 side="bottom" 
                 className="h-[40vh]" 
                 showOverlay={false} 
                 onInteractOutside={(e) => {
                   if (e.target instanceof HTMLElement && e.target.closest('.leaflet-container')) {
                     e.preventDefault();
                   }
                 }}
               >
                 <SheetHeader className="p-4 pt-2 text-center">
                   <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto mb-2" />
                   <SheetTitle>Résultats</SheetTitle>
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
          <>
            {viewMode === 'list' ? (
                <div className="h-full flex flex-col overflow-hidden flex-1">
                    <ScrollArea className="flex-grow">
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {dealershipsToDisplay.map((dealer, index) => (
                            <React.Fragment key={dealer.id}>
                                <div
                                    onClick={() => handleCardClick(dealer.id)}
                                    className={selectedDealershipId === dealer.id ? 'md:col-span-2 lg:col-span-3 xl:col-span-4' : ''}
                                >
                                <DealershipCard 
                                    dealership={dealer} 
                                    isExpanded={selectedDealershipId === dealer.id}
                                    onClose={handleCloseExpandedCard}
                                />
                                </div>
                                {(index + 1) % 6 === 0 && !selectedDealershipId && (
                                <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
                                    <AdCard />
                                </div>
                                )}
                            </React.Fragment>
                            ))}
                            {filteredDealerships.length > 0 && filteredDealerships.length < 4 && !selectedDealershipId && (
                            <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
                                <AdCard />
                            </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            ) : (
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
                <div className="col-span-8 rounded-lg overflow-hidden h-full">
                    <MapComponent 
                      dealerships={allDealerships} 
                      center={mapCenter} 
                      zoom={mapZoom} 
                      hoveredDealershipId={hoveredDealershipId}
                      brandHighlightIds={brandHighlightIds}
                      onMarkerClick={(id) => setSelectedDealershipId(id)}
                      onMarkerMouseOver={(id) => setHoveredDealershipId(id)}
                      onMarkerMouseOut={() => setHoveredDealershipId(null)}
                    />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {!isMobile && renderViewToggle()}
    </div>
  );
}

    
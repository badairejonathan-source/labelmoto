'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/ui/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import locations from '@/data/locations.json';
import { ListFilter, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from "firebase/firestore";

const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => (<div className="w-full h-full flex items-center justify-center bg-gray-200"><p>Chargement de la carte...</p></div>)
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
  const [allDealerships, setAllDealerships] = useState<Dealership[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(null);
  const [nearbyDealerships, setNearbyDealerships] = useState<Dealership[]>([]);
  
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;
  const [isListSheetOpen, setIsListSheetOpen] = useState(false);

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
        if (!userHasInteracted) {
          setNearbyDealerships(uniqueDealerships);
        }
    }, (error) => {
        console.error("Firebase read failed: " + error.message);
        setAllDealerships([]);
    });

    return () => unsubscribe();
  }, [userHasInteracted]);

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
      if (!userHasInteracted) setUserHasInteracted(true);
      setNearbyDealerships(dealerships);
  }, [userHasInteracted]);

  const handleMapZoom = useCallback(() => {
    if(!userHasInteracted) setUserHasInteracted(true);
  }, [userHasInteracted]);
  
  const dealershipsToDisplay = useMemo(() => {
    if (hasActiveFilters) {
        return filteredDealerships;
    }
    return nearbyDealerships;
  }, [nearbyDealerships, filteredDealerships, hasActiveFilters]);
  
  const handleCardClick = useCallback((dealership: Dealership) => {
    const isDeselecting = selectedDealershipId === dealership.id;
    setSelectedDealershipId(isDeselecting ? null : dealership.id);
    
    if (!isDeselecting && dealership.latitude && dealership.longitude) {
      setMapCenter([dealership.latitude, dealership.longitude]);
      setMapZoom(14);
    }

    if (isMobile) {
      // If we are selecting a dealership (not deselecting), close the sheet to see the map
      if (!isDeselecting) {
        setIsListSheetOpen(false);
      }
    }
  }, [isMobile, selectedDealershipId]);
  
  const handleMarkerClick = useCallback((id: string) => {
    const isDeselecting = selectedDealershipId === id;
    setSelectedDealershipId(isDeselecting ? null : id);
    
    if (!isDeselecting) {
        const selectedDealership = allDealerships.find(d => d.id === id);
        if (selectedDealership && selectedDealership.latitude && selectedDealership.longitude) {
            setMapCenter([selectedDealership.latitude, selectedDealership.longitude]);
            setMapZoom(14);
        }
        if (isMobile) {
          setIsListSheetOpen(true);
        }
    }
  }, [allDealerships, selectedDealershipId, isMobile]);

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

  const renderFilters = () => {
    return (
      <div className="flex flex-col space-y-2 md:flex-row md:flex-1 md:max-w-xl md:mx-4 md:space-y-0 md:space-x-2">
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
  
  const adFrequency = 3;

  const listContent = (
    <ScrollArea className="flex-grow h-0">
      <div className="p-4 px-2 w-full space-y-4">
        {dealershipsToDisplay.flatMap((dealer, index) => {
          const card = (
            <div
              key={dealer.id}
              onMouseEnter={() => handleMarkerMouseOver(dealer.id)}
              onMouseLeave={handleMouseOut}
            >
              <DealershipCard
                dealership={dealer}
                onClick={() => handleCardClick(dealer)}
                isExpanded={dealer.id === selectedDealershipId}
                className={cn(
                  dealer.id === hoveredDealershipId ? "shadow-lg" : "",
                  dealer.id === selectedDealershipId ? "ring-2 ring-accent" : ""
                )}
              />
            </div>
          );

          const ad = (index + 1) % adFrequency === 0 ? (
            <div key={`ad-${index}`}>
              <AdCard />
            </div>
          ) : null;

          return [card, ad];
        }).filter(Boolean)}

        {dealershipsToDisplay.length > 0 && dealershipsToDisplay.length < 3 && (
          <div>
            <AdCard />
          </div>
        )}
        {dealershipsToDisplay.length === 0 &&
          (userHasInteracted ? (
            <div className="text-center text-muted-foreground pt-20">
              <p>Aucun résultat trouvé.</p>
              <p className="text-sm">Essayez d'ajuster vos filtres.</p>
            </div>
          ) : (
             <div className="h-[60vh] flex items-center justify-center p-4">
              <div className="w-full">
                <AdCard />
              </div>
            </div>
          ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex flex-col h-[100svh] w-full overflow-hidden bg-background">
      <Header>
        {renderFilters()}
      </Header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Colonne de gauche (Desktop) */}
        <aside className="w-[35%] flex-shrink-0 h-full flex-col bg-background border-r border-border z-10 shadow-md hidden md:flex">
          {listContent}
        </aside>

        {/* Contenu principal (Carte + Sheet Mobile) */}
        <main className="h-full flex-1 relative bg-gray-100">
          <MapComponent 
            dealerships={hasActiveFilters ? filteredDealerships : allDealerships}
            center={mapCenter} 
            zoom={mapZoom} 
            hoveredDealershipId={hoveredDealershipId}
            selectedDealershipId={selectedDealershipId}
            onMarkerClick={handleMarkerClick}
            onMarkerMouseOver={handleMarkerMouseOver}
            onMarkerMouseOut={handleMouseOut}
            isMobile={isMobile}
            onNearbyChange={handleNearbyChange}
            onMapZoom={handleMapZoom}
          />
          
          {/* Bouton et Sheet pour mobile */}
          <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
            <Sheet open={isListSheetOpen} onOpenChange={setIsListSheetOpen}>
              <SheetTrigger asChild>
                <Button className="shadow-lg">
                  <List className="mr-2 h-4 w-4" />
                  Voir la liste
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80svh] flex flex-col p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Concessions à proximité</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                  {listContent}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </main>
      </div>
    </div>
  );
}

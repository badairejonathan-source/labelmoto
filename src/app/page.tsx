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
import { ListFilter, List, Crosshair, Loader2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';

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

const getDistanceSq = (center: [number, number], dealer: Dealership) => {
    if (dealer.latitude == null || dealer.longitude == null) return Infinity;
    const dx = center[1] - dealer.longitude;
    const dy = center[0] - dealer.latitude;
    return dx * dx + dy * dy;
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  
  const hoverInTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverOutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const closeCardTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;
  const [isListSheetOpen, setIsListSheetOpen] = useState(false);
  
  const [departments] = useState<string[]>(Object.keys(locations));

  useEffect(() => {
    const concessionsRef = collection(db, 'concessions');

    const unsubscribe = onSnapshot(concessionsRef, (querySnapshot) => {
        const dealershipMap = new Map<string, Dealership>();

        querySnapshot.docs.forEach((doc) => {
          const dealer = doc.data();
          const uniqueKey = doc.id;

          if (dealer && dealer.title && dealer.latitude && dealer.longitude) {
            const lat = parseFloat(String(dealer.latitude).replace(',', '.'));
            const lng = parseFloat(String(dealer.longitude).replace(',', '.'));

            if (!isNaN(lat) && !isNaN(lng)) {
              if (!dealershipMap.has(uniqueKey)) {
                const dealerWithId: Dealership = {
                  id: uniqueKey,
                  placeUrl: dealer.placeUrl || '',
                  title: dealer.title,
                  address: dealer.address || '',
                  website: dealer.website || '',
                  phoneNumber: dealer.phoneNumber || '',
                  imgUrl: dealer.imgUrl || '',
                  mardi: dealer.mardi || 'Non renseigné',
                  mercredi: dealer.mercredi || 'Non renseigné',
                  jeudi: dealer.jeudi || 'Non renseigné',
                  vendredi: dealer.vendredi || 'Non renseigné',
                  samedi: dealer.samedi || 'Non renseigné',
                  dimanche: dealer.dimanche || 'Non renseigné',
                  lundi: dealer.lundi || 'Non renseigné',
                  latitude: lat,
                  longitude: lng,
                  rating: dealer.rating || undefined,
                };
                dealershipMap.set(uniqueKey, dealerWithId);
              }
            }
          }
        });
        
        const uniqueDealerships = Array.from(dealershipMap.values());
        setAllDealerships(uniqueDealerships);
        setIsLoading(false);
    }, (error) => {
        console.error("Firebase read failed: " + error.message);
        setAllDealerships([]);
        setIsLoading(false);
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

  const handleDepartmentChange = useCallback((department: string) => {
    if (!userHasInteracted) setUserHasInteracted(true);
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
    if (!userHasInteracted) setUserHasInteracted(true);
      const cityValue = city === 'all-cities' ? '' : city;
      setSelectedCity(cityValue);
  }, [userHasInteracted]);

  const handleBrandChange = useCallback((brand: string) => {
    if (!userHasInteracted) setUserHasInteracted(true);
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  }, [userHasInteracted]);

  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number) => {
    if (!userHasInteracted) setUserHasInteracted(true);
    setMapCenter(currentCenter => {
        const isSameCenter = Math.abs(newCenter[0] - currentCenter[0]) < 1e-6 && Math.abs(newCenter[1] - currentCenter[1]) < 1e-6;
        if (isSameCenter) {
            return currentCenter;
        }
        return newCenter;
    });
    setMapZoom(currentZoom => {
        const isSameZoom = newZoom === currentZoom;
        if (isSameZoom) {
            return currentZoom;
        }
        return newZoom;
    });
  }, [userHasInteracted]);
  
  const dealershipsToDisplay = useMemo(() => {
    const sourceDealerships = hasActiveFilters ? filteredDealerships : allDealerships;

    if (!userHasInteracted && !selectedDealershipId) {
      return [];
    }

    if (selectedDealershipId) {
      const selected = sourceDealerships.find(d => d.id === selectedDealershipId);
      if (selected && selected.latitude && selected.longitude) {
        const others = sourceDealerships.filter(d => d.id !== selectedDealershipId);
        others.sort((a, b) => getDistanceSq([selected.latitude!, selected.longitude!], a) - getDistanceSq([selected.latitude!, selected.longitude!], b));
        return [selected, ...others].slice(0, 50);
      }
    }
    
    const sortedByMapCenter = [...sourceDealerships].sort((a, b) => {
      return getDistanceSq(mapCenter, a) - getDistanceSq(mapCenter, b);
    });

    return sortedByMapCenter.slice(0, 50);
  }, [hasActiveFilters, filteredDealerships, allDealerships, mapCenter, userHasInteracted, selectedDealershipId]);
  
  const handleCardClick = useCallback((dealership: Dealership) => {
    const isDeselecting = selectedDealershipId === dealership.id;
    setSelectedDealershipId(isDeselecting ? null : dealership.id);
    
    if (!isDeselecting) {
      if (dealership.latitude && dealership.longitude) {
        setMapCenter([dealership.latitude, dealership.longitude]);
        setMapZoom(14);
      }
      
      const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
          viewport.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [selectedDealershipId]);
  
  const handleMarkerClick = useCallback((id: string) => {
    const isDeselecting = selectedDealershipId === id;
    setSelectedDealershipId(isDeselecting ? null : id);
    
    if (!isDeselecting) {
        const selectedDealership = allDealerships.find(d => d.id === id);
        if (selectedDealership && selectedDealership.latitude && selectedDealership.longitude) {
            // Pas de zoom
        }
        if (isMobile) {
          setIsListSheetOpen(true);
        }
         const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
  }, [allDealerships, selectedDealershipId, isMobile]);

  const handleMarkerMouseOver = useCallback((id: string) => {
    if (hoverOutTimeoutRef.current) {
      clearTimeout(hoverOutTimeoutRef.current);
      hoverOutTimeoutRef.current = null;
    }
    if (hoverInTimeoutRef.current) {
      clearTimeout(hoverInTimeoutRef.current);
    }
    hoverInTimeoutRef.current = setTimeout(() => {
      setHoveredDealershipId(id);
    }, 500);
  }, []);

  const handleMouseOut = useCallback(() => {
    if (hoverInTimeoutRef.current) {
      clearTimeout(hoverInTimeoutRef.current);
      hoverInTimeoutRef.current = null;
    }
    hoverOutTimeoutRef.current = setTimeout(() => {
      setHoveredDealershipId(null);
    }, 100);
  }, []);

  const handleCardMouseEnter = useCallback((id: string) => {
    if (closeCardTimeoutRef.current) {
        clearTimeout(closeCardTimeoutRef.current);
        closeCardTimeoutRef.current = null;
    }
    handleMarkerMouseOver(id);
  }, [handleMarkerMouseOver]);

  const handleCardMouseLeave = useCallback((id: string) => {
    if (id === selectedDealershipId) {
        closeCardTimeoutRef.current = setTimeout(() => {
            setSelectedDealershipId(null);
        }, 1000);
    }
    handleMouseOut();
  }, [selectedDealershipId, handleMouseOut]);

  const handleLocationError = useCallback((error: any) => {
    let message = 'Impossible de déterminer votre position.';
    if (error.code === 1) { // PERMISSION_DENIED
        message = "Vous avez refusé l'accès à la géolocalisation.";
    } else if (error.code === 2) { // POSITION_UNAVAILABLE
        message = "Votre position n'est pas disponible pour le moment.";
    }
    toast({
        variant: "destructive",
        title: "Erreur de géolocalisation",
        description: message,
    });
  }, [toast]);

  const renderFilters = () => {
    return (
      <div className="flex flex-col space-y-2 md:flex-row md:flex-1 md:max-w-xl md:mx-4 md:space-y-0 md:space-x-2">
        <Select onValueChange={handleDepartmentChange} value={selectedDepartment}>
          <SelectTrigger variant="filter">
            <span className="mr-2">Départements:</span>
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
    <ScrollArea ref={scrollAreaRef} className="flex-grow h-0">
      <div className="p-5 w-full space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground pt-20">
            <p>Chargement des concessions...</p>
          </div>
        ) : (
          <>
            {dealershipsToDisplay.flatMap((dealer, index) => {
              const card = (
                <div
                  key={dealer.id}
                  onMouseEnter={() => handleCardMouseEnter(dealer.id)}
                  onMouseLeave={() => handleCardMouseLeave(dealer.id)}
                >
                  <DealershipCard
                    dealership={dealer}
                    onClick={() => handleCardClick(dealer)}
                    isExpanded={dealer.id === selectedDealershipId}
                    className={cn(
                      "w-full max-w-64 mx-auto",
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
              (hasActiveFilters || userHasInteracted ? (
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
          </>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex flex-col h-[100svh] w-full overflow-hidden bg-background">
      <Header>
        {renderFilters()}
      </Header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="w-[35%] flex-shrink-0 h-full flex-col bg-background border-r border-border z-10 shadow-md hidden md:flex">
          {listContent}
        </aside>

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
            onMapChange={handleMapChange}
            isLocating={isLocating}
            onLocateEnd={() => setIsLocating(false)}
            onLocationError={handleLocationError}
          />

          <div className="absolute top-4 right-4 z-[1000]">
              <Button
                  size="icon"
                  className="rounded-full bg-background/80 text-foreground/80 hover:bg-background/100 hover:text-foreground border border-border backdrop-blur-sm shadow-lg"
                  onClick={() => setIsLocating(true)}
                  disabled={isLocating}
                  title="Me géolocaliser"
              >
                  {isLocating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crosshair className="h-5 w-5" />}
              </Button>
          </div>
          
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-[1000] pointer-events-none">
            {!isListSheetOpen ? (
                <div className="w-full flex justify-center p-4 pointer-events-auto">
                    <Button className="shadow-lg" onClick={() => setIsListSheetOpen(true)}>
                      <List className="mr-2 h-4 w-4" />
                      Voir la liste
                    </Button>
                </div>
            ) : (
                <div className="mx-2 mb-2 bg-background rounded-xl shadow-lg flex flex-col max-h-[60svh] pointer-events-auto">
                    <div className="p-3 py-2 border-b flex justify-between items-center">
                        <div className="w-8"></div> {/* Spacer */}
                        <h2 className="font-semibold text-center text-muted-foreground">Concessions à proximité</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsListSheetOpen(false)} className="h-8 w-8 shrink-0">
                            <X className="h-5 w-5 text-muted-foreground"/>
                        </Button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {listContent}
                    </div>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

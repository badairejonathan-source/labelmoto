'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/ui/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import { List, Crosshair, Loader2, X } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';
import type { LatLngBounds } from 'leaflet';
import { useSearchParams } from 'next/navigation';

const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => (<div className="w-full h-full flex items-center justify-center bg-gray-200"><p>Chargement de la carte...</p></div>)
});

const getDistanceSq = (center: [number, number], dealer: Dealership) => {
    if (dealer.latitude == null || dealer.longitude == null) return Infinity;
    const dx = center[1] - dealer.longitude;
    const dy = center[0] - dealer.latitude;
    return dx * dx + dy * dy;
};

function MapPageComponent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  const searchParam = searchParams.get('search');
  
  const [allDealerships, setAllDealerships] = useState<Dealership[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchParam || '');
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(null);
  const [firstClickId, setFirstClickId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  
  const [activeFilter, setActiveFilter] = useState<'shopping' | 'service' | null>(() => {
    if (filterParam === 'service') return 'service';
    if (filterParam === 'shopping') return 'shopping';
    return null;
  });

  const hoverInTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverOutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;
  
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
                  category: dealer.category || undefined,
                  appSection: dealer.appSection || 'both',
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

  const placeholderText = useMemo(() => {
    if (activeFilter === 'service') {
      return "reparation , entretient, depannage, pièces détachées";
    }
    if (activeFilter === 'shopping') {
      return "Achat, vente, accessoires par départements";
    }
    return "Rechercher par nom, ville, code postal...";
  }, [activeFilter]);

  const isSearching = submittedSearchTerm.trim() !== '' || activeFilter !== null;

  useEffect(() => {
    let results = allDealerships;

    // 1. Filter by active category
    if (activeFilter) {
      results = results.filter(d => {
        if (activeFilter === 'shopping') {
          return d.appSection === 'shopping' || d.appSection === 'both';
        }
        if (activeFilter === 'service') {
          return d.appSection === 'service' || d.appSection === 'both';
        }
        return true;
      });
    }

    // 2. Filter by search term
    if (submittedSearchTerm.trim() !== '') {
        const lowerCaseSearch = submittedSearchTerm.toLowerCase();
        results = results.filter(d => 
            (d.title?.toLowerCase().includes(lowerCaseSearch)) ||
            (d.address?.toLowerCase().includes(lowerCaseSearch))
        );
    }
    
    setFilteredDealerships(results);

    if (results.length > 0 && submittedSearchTerm.trim() !== '') {
        const firstResult = results[0];
        if(firstResult.latitude && firstResult.longitude){
            setMapCenter([firstResult.latitude, firstResult.longitude]);
            setMapZoom(12);
        }
    }
  }, [submittedSearchTerm, allDealerships, activeFilter]);

  const handleSearchTermChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    if (newTerm.trim() === '') {
      setSubmittedSearchTerm('');
    }
  };

  const handleSearch = () => {
    setSubmittedSearchTerm(searchTerm);
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    setActiveFilter(current => current === filter ? null : filter);
  };
  
  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: LatLngBounds) => {
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
    setMapBounds(bounds);
  }, []);
  
  const dealershipsToDisplay = useMemo(() => {
    const sortedByMapCenter = [...filteredDealerships].sort((a, b) => {
      if (a.id === selectedDealershipId) return -1;
      if (b.id === selectedDealershipId) return 1;
      return getDistanceSq(mapCenter, a) - getDistanceSq(mapCenter, b);
    });

    return sortedByMapCenter.slice(0, 50);
  }, [filteredDealerships, mapCenter, selectedDealershipId]);

  const handleCardClick = useCallback((dealership: Dealership) => {
    const isDeselecting = selectedDealershipId === dealership.id;
    setSelectedDealershipId(isDeselecting ? null : dealership.id);
  }, [selectedDealershipId]);
  
  const handleMarkerClick = useCallback((id: string) => {
    if (isMobile) {
        if (firstClickId === id) {
            // Second click on the same marker
            setSelectedDealershipId(id);
            setFirstClickId(null);
        } else {
            // First click on a marker
            setFirstClickId(id);
            setSelectedDealershipId(null); // Ensure no card is expanded in the list yet
        }
    } else { // Desktop behavior
        const isDeselecting = selectedDealershipId === id;
        setSelectedDealershipId(isDeselecting ? null : id);
        
        if (!isDeselecting) {
            const selectedDealership = allDealerships.find(d => d.id === id);
            if (selectedDealership && selectedDealership.latitude && selectedDealership.longitude) {
                // Pas de zoom
            }
        }
    }
  }, [allDealerships, isMobile, firstClickId, selectedDealershipId]);

  useEffect(() => {
    if (!selectedDealershipId) return;

    const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    const targetCard = cardRefs.current.get(selectedDealershipId);

    if (!targetCard || !scrollViewport) return;
    
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                setSelectedDealershipId(null);
                observer.disconnect();
            }
        },
        { 
            root: scrollViewport,
            threshold: 0
        }
    );

    observer.observe(targetCard);
    
    return () => {
        observer.disconnect();
    };
  }, [selectedDealershipId]);

  const handleMarkerMouseOver = useCallback((id: string) => {
    if (hoverOutTimeoutRef.current) {
      clearTimeout(hoverOutTimeoutRef.current);
      hoverOutTimeoutRef.current = null;
    }
    hoverInTimeoutRef.current = setTimeout(() => {
        if (firstClickId !== id) {
            setHoveredDealershipId(id);
        }
    }, 100);
  }, [firstClickId]);

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
    handleMarkerMouseOver(id);
  }, [handleMarkerMouseOver]);

  const handleCardMouseLeave = useCallback(() => {
    handleMouseOut();
  }, [handleMouseOut]);

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

  const handleMapClick = useCallback(() => {
    setFirstClickId(null);
  }, []);

  const adFrequency = 5;

  const listContent = (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="p-4 space-y-4">
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
                  ref={node => {
                    if (cardRefs.current) {
                      if (node) cardRefs.current.set(dealer.id, node);
                      else cardRefs.current.delete(dealer.id);
                    }
                  }}
                  onMouseEnter={() => handleCardMouseEnter(dealer.id)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <DealershipCard
                    dealership={dealer}
                    onClick={() => handleCardClick(dealer)}
                    isExpanded={dealer.id === selectedDealershipId}
                    className={cn(
                      "w-full",
                      dealer.id === hoveredDealershipId && !isMobile ? "shadow-lg" : "",
                      dealer.id === selectedDealershipId ? "ring-2 ring-accent" : ""
                    )}
                  />
                </div>
              );

              const ad = (index > 0 && (index + 1) % adFrequency === 0) ? (
                <div key={`ad-${index}`} className="my-4">
                  <AdCard />
                </div>
              ) : null;

              return [card, ad];
            }).filter(Boolean)}

            {dealershipsToDisplay.length === 0 && (
                <div className="text-center text-muted-foreground pt-20">
                  <p>Aucun résultat trouvé.</p>
                  <p className="text-sm">Essayez d'ajuster vos filtres ou de vous déplacer sur la carte.</p>
                </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex flex-col h-[100svh] w-full overflow-hidden bg-background">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        onSearch={handleSearch}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        placeholderText={placeholderText}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="w-full md:w-[900px] flex-shrink-0 h-full flex-col bg-background border-r border-border z-10 shadow-md hidden md:flex">
          {listContent}
        </aside>

        <main className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-y-auto md:h-full md:overflow-hidden md:flex md:flex-col md:relative">
           <div className="w-full h-full">
              <MapComponent 
                dealerships={filteredDealerships}
                center={mapCenter} 
                zoom={mapZoom} 
                hoveredDealershipId={hoveredDealershipId}
                selectedDealershipId={selectedDealershipId}
                firstClickId={firstClickId}
                onMarkerClick={handleMarkerClick}
                onMarkerMouseOver={handleMarkerMouseOver}
                onMarkerMouseOut={handleMouseOut}
                isMobile={isMobile}
                onMapChange={handleMapChange}
                onMapClick={handleMapClick}
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
            </div>
          
          <div className="md:hidden h-full flex flex-col">
            <div className="relative h-[35vh] flex-shrink-0">
               <MapComponent 
                dealerships={filteredDealerships}
                center={mapCenter} 
                zoom={mapZoom} 
                hoveredDealershipId={hoveredDealershipId}
                selectedDealershipId={selectedDealershipId}
                firstClickId={firstClickId}
                onMarkerClick={handleMarkerClick}
                onMarkerMouseOver={handleMarkerMouseOver}
                onMarkerMouseOut={handleMouseOut}
                isMobile={isMobile}
                onMapChange={handleMapChange}
                onMapClick={handleMapClick}
                isLocating={isLocating}
                onLocateEnd={() => setIsLocating(false)}
                onLocationError={handleLocationError}
              />
               <div className="absolute top-2 right-2 z-[1000]">
                  <Button
                      size="icon"
                      className="rounded-full bg-background/80 text-foreground/80 hover:bg-background/100 hover:text-foreground border border-border backdrop-blur-sm shadow-lg h-9 w-9"
                      onClick={() => setIsLocating(true)}
                      disabled={isLocating}
                      title="Me géolocaliser"
                  >
                      {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
                  </Button>
              </div>
            </div>
             <div className="flex-grow overflow-y-auto">
              {listContent}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[100svh] w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <MapPageComponent />
    </Suspense>
  );
}

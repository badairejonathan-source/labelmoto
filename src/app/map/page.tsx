'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/ui/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import { Crosshair, Loader2 } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';
import type { LatLngBounds } from 'leaflet';
import { useSearchParams, useRouter } from 'next/navigation';

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
  const router = useRouter();
  const filterParam = searchParams.get('filter');
  const searchParam = searchParams.get('search');
  
  const [allDealerships, setAllDealerships] = useState<Dealership[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchParam || '');
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
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
      return "Réparation , entretien, depannage, pièces détachées";
    }
    if (activeFilter === 'shopping') {
      return "Achat, vente, accessoires par départements";
    }
    return "Rechercher par nom, ville, code postal...";
  }, [activeFilter]);

  useEffect(() => {
    let results = allDealerships;

    if (activeFilter) {
      results = results.filter(d => {
        if (activeFilter === 'shopping') return d.appSection === 'shopping' || d.appSection === 'both';
        if (activeFilter === 'service') return d.appSection === 'service' || d.appSection === 'both';
        return true;
      });
    }

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
    if (newTerm.trim() === '') setSubmittedSearchTerm('');
  };

  const handleSearch = () => {
    setSubmittedSearchTerm(searchTerm);
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    const newFilter = activeFilter === filter ? null : filter;
    setActiveFilter(newFilter);

    // Update URL without reloading page
    const params = new URLSearchParams(window.location.search);
    if (newFilter) {
      params.set('filter', newFilter);
    } else {
      params.delete('filter');
    }
    router.push(`${window.location.pathname}?${params.toString()}`);
  };
  
  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: LatLngBounds) => {
    const centerChanged = Math.abs(mapCenter[0] - newCenter[0]) > 0.00001 || Math.abs(mapCenter[1] - newCenter[1]) > 0.00001;
    const zoomChanged = mapZoom !== newZoom;
    
    if (centerChanged || zoomChanged) {
        setMapCenter(newCenter);
        setMapZoom(newZoom);
    }
  }, [mapCenter, mapZoom]);
  
  const dealershipsToDisplay = useMemo(() => {
    return [...filteredDealerships].sort((a, b) => {
      if (a.id === selectedDealershipId) return -1;
      if (b.id === selectedDealershipId) return 1;
      return getDistanceSq(mapCenter, a) - getDistanceSq(mapCenter, b);
    }).slice(0, 50);
  }, [filteredDealerships, mapCenter, selectedDealershipId]);

  const handleCardClick = useCallback((dealership: Dealership) => {
    setSelectedDealershipId(dealership.id);
    if (dealership.latitude && dealership.longitude) {
      setMapCenter([dealership.latitude, dealership.longitude]);
      setMapZoom(14);
    }
  }, []);
  
  const handleMarkerClick = useCallback((id: string) => {
    setSelectedDealershipId(currentId => currentId === id ? null : id);
    setFirstClickId(id); // Keep track of marker clicks for popups
  }, []);

  useEffect(() => {
    if (!selectedDealershipId) return;
    const targetCard = cardRefs.current.get(selectedDealershipId);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedDealershipId]);

  const handleMarkerMouseOver = useCallback((id: string) => {
    if (hoverOutTimeoutRef.current) clearTimeout(hoverOutTimeoutRef.current);
    hoverInTimeoutRef.current = setTimeout(() => setHoveredDealershipId(id), 100);
  }, []);

  const handleMouseOut = useCallback(() => {
    if (hoverInTimeoutRef.current) clearTimeout(hoverInTimeoutRef.current);
    hoverOutTimeoutRef.current = setTimeout(() => setHoveredDealershipId(null), 100);
  }, []);

  const handleLocationError = useCallback((error: any) => {
    toast({
        variant: "destructive",
        title: "Erreur de géolocalisation",
        description: "Impossible de déterminer votre position.",
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
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2">Chargement des concessions...</p>
          </div>
        ) : (
          <>
            {dealershipsToDisplay.flatMap((dealer, index) => {
              const card = (
                <div
                  key={dealer.id}
                  ref={node => cardRefs.current.set(dealer.id, node)}
                  onMouseEnter={() => handleMarkerMouseOver(dealer.id)}
                  onMouseLeave={handleMouseOut}
                >
                  <DealershipCard
                    dealership={dealer}
                    onClick={() => handleCardClick(dealer)}
                    className={cn(
                      dealer.id === selectedDealershipId && "ring-2 ring-accent",
                      dealer.id === hoveredDealershipId && "shadow-lg" 
                    )}
                  />
                </div>
              );

              const ad = (index > 0 && (index + 1) % adFrequency === 0) ? (
                <div key={`ad-${index}`} className="my-4"><AdCard /></div>
              ) : null;

              return [card, ad];
            }).filter(Boolean)}

            {dealershipsToDisplay.length === 0 && (
                <div className="text-center text-muted-foreground pt-20">
                  <p>Aucun résultat trouvé.</p>
                  <p className="text-sm">Essayez d'ajuster vos filtres.</p>
                </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
  
  if (width === undefined) {
    return (
      <div className="flex h-[100svh] w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
        {isMobile ? (
          // Mobile Layout
          <div className="w-full h-full flex flex-col">
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
                onMapChange={handleMapChange}
                onMapClick={handleMapClick}
                isLocating={isLocating}
                onLocateEnd={() => setIsLocating(false)}
                onLocationError={handleLocationError}
              />
              <div className="absolute top-2 right-2 z-[1000]">
                <Button size="icon" className="rounded-full shadow-lg h-9 w-9" onClick={() => setIsLocating(true)} disabled={isLocating} title="Me géolocaliser">
                  {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">{listContent}</div>
          </div>
        ) : (
          // Desktop Layout
          <>
            <aside className="w-2/3 flex-shrink-0 h-full flex flex-col bg-background border-r border-border z-10 shadow-md">
              {listContent}
            </aside>
            <main className="flex-1 bg-gray-100 dark:bg-gray-900 h-full relative">
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
                onMapChange={handleMapChange}
                onMapClick={handleMapClick}
                isLocating={isLocating}
                onLocateEnd={() => setIsLocating(false)}
                onLocationError={handleLocationError}
              />
              <div className="absolute top-4 right-4 z-[1000]">
                <Button size="icon" className="rounded-full shadow-lg" onClick={() => setIsLocating(true)} disabled={isLocating} title="Me géolocaliser">
                  {isLocating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crosshair className="h-5 w-5" />}
                </Button>
              </div>
            </main>
          </>
        )}
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

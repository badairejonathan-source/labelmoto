
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import { Crosshair, Loader2, Star, ChevronUp, ChevronDown } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, FirestoreError } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';
import type { LatLngBounds } from 'leaflet';
import { useSearchParams, useRouter } from 'next/navigation';
import articlesData from '@/app/data/articles.json';

const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => (<div className="w-full h-full flex items-center justify-center bg-muted/20"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>)
});

const getDistanceSq = (center: [number, number], dealer: Dealership) => {
    if (dealer.latitude == null || dealer.longitude == null) return Infinity;
    const dx = center[1] - dealer.longitude;
    const dy = center[0] - dealer.latitude;
    return dx * dx + dy * dy;
};

const RatingFilter = ({
    value,
    onChange,
    className,
}: {
    value: number;
    onChange: (value: number) => void;
    className?: string;
}) => {
    const ratings = [4, 3, 2, 1];
    const handleRatingClick = (rating: number) => {
        onChange(value === rating ? 0 : rating);
    };

    return (
        <div className={cn("p-2 bg-background sticky top-0 z-10", className)}>
            <div className="flex items-center justify-center space-x-2">
                <span className="text-xs font-bold text-muted-foreground mr-2 hidden md:inline uppercase tracking-wider">Note :</span>
                <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onChange(0)} 
                    className={cn(
                        "rounded-full px-4 text-xs font-bold h-8 transition-all duration-200",
                        value === 0 
                            ? "bg-brand text-brand-foreground shadow-[0_0_12px_rgba(250,126,20,0.4)] ring-1 ring-brand" 
                            : "hover:bg-muted"
                    )}
                >
                    TOUS
                </Button>
                {ratings.map((rating) => (
                    <Button 
                        key={rating} 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleRatingClick(rating)} 
                        className={cn(
                            "flex gap-1 rounded-full px-3 text-xs font-bold h-8 transition-all duration-200",
                            value === rating 
                                ? "bg-brand text-brand-foreground shadow-[0_0_12px_rgba(250,126,20,0.5)] ring-1 ring-brand ring-offset-1" 
                                : "hover:bg-muted"
                        )}
                    >
                        <span>{rating}</span>
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="hidden sm:inline-block">+</span>
                    </Button>
                ))}
            </div>
        </div>
    );
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
  const [mapBoundsStr, setMapBoundsStr] = useState<string | null>(null);
  
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const { firestore } = useFirebase();
  
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'expanded'>('half');
  const [isExpanding, setIsExpanding] = useState(true);
  const touchStartY = useRef<number>(0);

  const [activeFilter, setActiveFilter] = useState<'shopping' | 'service' | null>(() => {
    if (filterParam === 'service') return 'service';
    if (filterParam === 'shopping') return 'shopping';
    return null;
  });

  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const { width } = useWindowSize();
  const isMobile = (width || 1024) < 768;
  
  useEffect(() => {
    if (!firestore) return;
    const dealershipsRef = collection(firestore, 'concessions');

    const unsubscribe = onSnapshot(dealershipsRef, (querySnapshot) => {
        const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            latitude: doc.data().latitude ? parseFloat(String(doc.data().latitude).replace(',', '.')) : undefined,
            longitude: doc.data().longitude ? parseFloat(String(doc.data().longitude).replace(',', '.')) : undefined,
        } as Dealership));
        setAllDealerships(results);
        setIsLoading(false);
    }, (error: FirestoreError) => {
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données." });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, toast]);

  useEffect(() => {
    let results = allDealerships;
    if (activeFilter) {
      results = results.filter(d => activeFilter === 'shopping' ? (d.appSection === 'shopping' || d.appSection === 'both') : (d.appSection === 'service' || d.appSection === 'both'));
    }
    if (submittedSearchTerm.trim() !== '') {
        const lower = submittedSearchTerm.toLowerCase();
        results = results.filter(d => d.title?.toLowerCase().includes(lower) || d.address?.toLowerCase().includes(lower) || d.brands?.some(b => b.toLowerCase().includes(lower)));
    }
    if (ratingFilter > 0) {
        results = results.filter(d => {
            const r = d.rating ? parseFloat(String(d.rating).replace(',', '.')) : 0;
            return !isNaN(r) && r >= ratingFilter;
        });
    }
    setFilteredDealerships(results);
  }, [submittedSearchTerm, allDealerships, activeFilter, ratingFilter]);

  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: LatLngBounds) => {
    const bStr = bounds.toBBoxString();
    setMapBoundsStr(current => current !== bStr ? bStr : current);
    setMapCenter(current => (Math.abs(current[0] - newCenter[0]) > 0.0001 || Math.abs(current[1] - newCenter[1]) > 0.0001) ? newCenter : current);
    setMapZoom(current => current !== newZoom ? newZoom : current);
  }, []);
  
  const dealershipsToDisplay = useMemo(() => {
    let results = filteredDealerships;
    if (mapBoundsStr) {
        const [minLng, minLat, maxLng, maxLat] = mapBoundsStr.split(',').map(Number);
        results = results.filter(d => d.latitude != null && d.longitude != null && d.latitude >= minLat && d.latitude <= maxLat && d.longitude >= minLng && d.longitude <= maxLng);
    }
    return [...results].sort((a, b) => getDistanceSq(mapCenter, a) - getDistanceSq(mapCenter, b)).slice(0, 25);
  }, [filteredDealerships, mapBoundsStr, mapCenter]);

  const handleCardClick = useCallback((dealership: Dealership) => {
    setSelectedDealershipId(dealership.id);
    if (dealership.latitude && dealership.longitude) {
      setMapCenter([dealership.latitude, dealership.longitude]);
      setMapZoom(14);
      if (isMobile) setDrawerHeight('half');
    }
  }, [isMobile]);
  
  const handleMarkerClick = useCallback((id: string) => {
    setSelectedDealershipId(current => current === id ? null : id);
    if (isMobile && id) setDrawerHeight('half');
  }, [isMobile]);

  useEffect(() => {
    if (selectedDealershipId) {
      const card = cardRefs.current.get(selectedDealershipId);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedDealershipId]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setDrawerHeight(c => c === 'collapsed' ? 'half' : 'expanded');
        setIsExpanding(true);
      } else {
        setDrawerHeight(c => c === 'expanded' ? 'half' : 'collapsed');
        setIsExpanding(false);
      }
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (drawerHeight === 'collapsed') {
      setDrawerHeight('half');
      setIsExpanding(true);
    } else if (drawerHeight === 'expanded') {
      setDrawerHeight('half');
      setIsExpanding(false);
    } else {
      if (isExpanding) {
        setDrawerHeight('expanded');
      } else {
        setDrawerHeight('collapsed');
      }
    }
  };

  const listContent = (
    <div className="space-y-4 pb-20">
      {isLoading ? (
        <div className="text-center text-muted-foreground pt-10"><Loader2 className="mx-auto h-8 w-8 animate-spin text-brand" /><p className="mt-2">Chargement...</p></div>
      ) : (
        <>
          {dealershipsToDisplay.map((dealer, index) => {
            const adIndex = Math.floor((index + 1) / 3) - 1;
            const article = articlesData[adIndex % articlesData.length];

            return (
              <React.Fragment key={dealer.id}>
                <div 
                  ref={node => cardRefs.current.set(dealer.id, node)} 
                  onMouseEnter={() => setHoveredDealershipId(dealer.id)} 
                  onMouseLeave={() => setHoveredDealershipId(null)}
                  className="w-full"
                >
                  <DealershipCard 
                    dealership={dealer} 
                    onClick={() => handleCardClick(dealer)} 
                    className={cn(dealer.id === selectedDealershipId && "ring-2 ring-brand", dealer.id === hoveredDealershipId && "shadow-lg")} 
                  />
                </div>
                {(index + 1) % 3 === 0 && article && (
                  <div className="py-2 w-full">
                    <AdCard article={article} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          
          {dealershipsToDisplay.length > 0 && dealershipsToDisplay.length < 3 && articlesData[0] && (
            <div className="py-2 w-full">
              <AdCard article={articlesData[0]} />
            </div>
          )}

          {dealershipsToDisplay.length === 0 && <div className="text-center text-muted-foreground py-10 px-4"><p>Aucun établissement visible dans cette zone. Explorez la carte pour trouver des résultats.</p></div>}
        </>
      )}
    </div>
  );

  if (width === undefined) return <div className="flex h-[100svh] w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="flex flex-col w-full bg-background h-screen overflow-hidden">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => setSubmittedSearchTerm(searchTerm)} activeFilter={activeFilter} onFilterChange={setActiveFilter} placeholderText="Recherche par nom, ville, departement" />
      
      <div className="flex-1 flex overflow-hidden relative">
        {!isMobile && (
          <>
            <aside className="w-3/4 flex flex-col bg-background border-r z-10 shadow-md h-full">
              <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                <RatingFilter value={ratingFilter} onChange={setRatingFilter} className="border-none p-0 flex-1" />
              </div>
              <div className="flex-1 overflow-y-auto pr-3">
                <div className="py-4 pl-4 space-y-4">{listContent}</div>
              </div>
            </aside>
            <main className="w-1/4 relative bg-muted/10">
              <MapComponent 
                dealerships={filteredDealerships} 
                center={mapCenter} 
                zoom={mapZoom} 
                hoveredDealershipId={hoveredDealershipId} 
                selectedDealershipId={selectedDealershipId} 
                onMarkerClick={handleMarkerClick} 
                onMarkerMouseOver={setHoveredDealershipId} 
                onMarkerMouseOut={() => setHoveredDealershipId(null)} 
                onMapChange={handleMapChange} 
                onMapClick={() => {}} 
                isLocating={isLocating} 
                onLocateEnd={() => setIsLocating(false)} 
                onLocationError={() => toast({ variant: "destructive", title: "Géolocalisation impossible" })} 
              />
              <div className="absolute top-4 right-4 z-[1000] p-1 overflow-visible">
                <Button size="icon" className="rounded-full shadow-lg h-10 w-10 bg-brand text-brand-foreground p-0" onClick={() => setIsLocating(true)} disabled={isLocating}><Crosshair className="h-5 w-5" /></Button>
              </div>
            </main>
          </>
        )}

        {isMobile && (
          <>
            <main className="absolute inset-0 z-0 h-full w-full">
              <MapComponent 
                dealerships={filteredDealerships} 
                center={mapCenter} 
                zoom={mapZoom} 
                hoveredDealershipId={hoveredDealershipId} 
                selectedDealershipId={selectedDealershipId} 
                onMarkerClick={handleMarkerClick} 
                onMarkerMouseOver={setHoveredDealershipId} 
                onMarkerMouseOut={() => setHoveredDealershipId(null)} 
                onMapChange={handleMapChange} 
                onMapClick={() => {
                  setDrawerHeight('collapsed');
                  setIsExpanding(true);
                }} 
                isLocating={isLocating} 
                onLocateEnd={() => setIsLocating(false)} 
                onLocationError={() => toast({ variant: "destructive", title: "Géolocalisation impossible" })} 
              />
              <div className="absolute top-2 right-2 z-[1000] p-1 overflow-visible">
                <Button size="icon" className="rounded-full shadow-lg h-10 w-10 bg-brand text-brand-foreground p-0" onClick={() => setIsLocating(true)} disabled={isLocating}><Crosshair className="h-5 w-5" /></Button>
              </div>
            </main>
            <div className={cn(
              "fixed left-0 right-0 bg-background rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-50 transition-all duration-300 ease-in-out border-t",
              drawerHeight === 'collapsed' ? 'bottom-0 h-[80px]' : drawerHeight === 'half' ? 'bottom-0 h-[50vh]' : 'bottom-0 h-[95vh]'
            )}>
              <div className="relative w-full flex flex-col items-center pt-2 pb-1 cursor-grab touch-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div 
                  className="w-12 h-1.5 bg-muted rounded-full" 
                  onClick={() => {
                    const next = drawerHeight === 'collapsed' ? 'half' : drawerHeight === 'half' ? 'expanded' : 'half';
                    setDrawerHeight(next);
                    if (next === 'expanded') setIsExpanding(true);
                    if (next === 'collapsed') setIsExpanding(true);
                  }}
                />
              </div>
              <div className="px-4 h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b pb-1">
                  <RatingFilter value={ratingFilter} onChange={setRatingFilter} className="border-none px-0 flex-1" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full shrink-0" 
                    onClick={handleChevronClick}
                  >
                    {(drawerHeight === 'collapsed' || (drawerHeight === 'half' && isExpanding)) ? (
                      <ChevronUp className="h-7 w-7 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-7 w-7 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto mt-2">{listContent}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><MapPageComponent /></Suspense>;
}

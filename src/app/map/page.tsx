
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/ui/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import { Crosshair, Loader2, Star } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, FirestoreError } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';
import type { LatLngBounds } from 'leaflet';
import { useSearchParams, useRouter } from 'next/navigation';
import { FirestorePermissionError } from '@/firebase/errors';
import brandLogos from '@/data/brand-logos';

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

const RatingFilter = ({
    value,
    onChange,
}: {
    value: number;
    onChange: (value: number) => void;
}) => {
    const ratings = [4, 3, 2, 1];
    const handleRatingClick = (rating: number) => {
        onChange(value === rating ? 0 : rating);
    };

    return (
        <div className="p-2 px-4 border-b bg-background sticky top-0 z-10">
            <div className="flex items-center justify-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground mr-2 hidden md:inline">Noté:</span>
                
                <Button
                    size="sm"
                    variant={value === 0 ? 'secondary' : 'ghost'}
                    onClick={() => onChange(0)}
                    className="rounded-full px-4"
                >
                    Tous
                </Button>
                
                {ratings.map((rating) => (
                    <Button
                        key={rating}
                        size="sm"
                        variant={value === rating ? 'secondary' : 'ghost'}
                        onClick={() => handleRatingClick(rating)}
                        className="flex gap-1.5 rounded-full px-3"
                    >
                        <span>{rating}</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="hidden sm:inline-block">& plus</span>
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
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(null);
  const [firstClickId, setFirstClickId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const { firestore } = useFirebase();
  
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
  const isMobile = (width || 1024) < 768;

  const [panelHeight, setPanelHeight] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);
  
  useEffect(() => {
    if (!firestore) return;
    const dealershipsRef = collection(firestore, 'concessions');

    const unsubscribe = onSnapshot(dealershipsRef, (querySnapshot) => {
        const dealershipMap = new Map<string, Dealership>();

        querySnapshot.docs.forEach((doc) => {
          const dealer = doc.data();
          const uniqueKey = doc.id;

          if (dealer && dealer.title) {
            const lat = dealer.latitude ? parseFloat(String(dealer.latitude).replace(',', '.')) : NaN;
            const lng = dealer.longitude ? parseFloat(String(dealer.longitude).replace(',', '.')) : NaN;

            if (!dealershipMap.has(uniqueKey)) {
              const dealerWithId: Dealership = {
                id: uniqueKey,
                placeUrl: dealer.placeUrl || '',
                title: dealer.title,
                address: dealer.address || '',
                website: dealer.website || '',
                phoneNumber: dealer.phoneNumber || '',
                email: dealer.email || '',
                imgUrl: dealer.imgUrl || '',
                mardi: dealer.mardi || 'Non renseigné',
                mercredi: dealer.mercredi || 'Non renseigné',
                jeudi: dealer.jeudi || 'Non renseigné',
                vendredi: dealer.vendredi || 'Non renseigné',
                samedi: dealer.samedi || 'Non renseigné',
                dimanche: dealer.dimanche || 'Non renseigné',
                lundi: dealer.lundi || 'Non renseigné',
                latitude: !isNaN(lat) ? lat : undefined,
                longitude: !isNaN(lng) ? lng : undefined,
                rating: dealer.rating || undefined,
                category: dealer.category || undefined,
                appSection: dealer.appSection || 'both',
                brands: dealer.brands || [],
              };
              dealershipMap.set(uniqueKey, dealerWithId);
            }
          }
        });
        
        const uniqueDealerships = Array.from(dealershipMap.values());
        setAllDealerships(uniqueDealerships);
        setIsLoading(false);
    }, (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: 'concessions'
        });
        console.error(contextualError);
        
        toast({
            variant: "destructive",
            title: "Erreur de chargement",
            description: "Impossible de récupérer les fiches. Vérifiez les règles de sécurité.",
        });

        setAllDealerships([]);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, toast]);

  const placeholderText = useMemo(() => {
    if (activeFilter === 'service') {
      return "Réparation, entretien, dépannage...";
    }
    if (activeFilter === 'shopping') {
      return "Achat, vente, accessoires...";
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
        const isDeptCode = /^\d{2,3}$/.test(lowerCaseSearch) || /^2[ab]$/i.test(lowerCaseSearch);

        if (isDeptCode) {
            let deptCode = lowerCaseSearch;
            if (deptCode === '2a' || deptCode === '2b') deptCode = '20';
            results = results.filter(d => d.address?.match(/\b(\d{5})\b/)?.[1].startsWith(deptCode));
        } else {
            results = results.filter(d => 
                (d.title?.toLowerCase().includes(lowerCaseSearch)) ||
                (d.address?.toLowerCase().includes(lowerCaseSearch)) ||
                (d.brands?.some(brand => brand.toLowerCase().includes(lowerCaseSearch)))
            );
        }
    }

    if (ratingFilter > 0) {
        results = results.filter(d => {
            const ratingValue = d.rating ? parseFloat(String(d.rating).replace(',', '.')) : 0;
            return !isNaN(ratingValue) && ratingValue >= ratingFilter;
        });
    }
    
    setFilteredDealerships(results);

    if (results.length > 0 && submittedSearchTerm.trim() !== '') {
        const firstResult = results[0];
        if(firstResult.latitude && firstResult.longitude){
            setMapCenter([firstResult.latitude, firstResult.longitude]);
            setMapZoom(12);
        }
    }
  }, [submittedSearchTerm, allDealerships, activeFilter, ratingFilter]);

  const handleSearchTermChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    if (newTerm.trim() === '') setSubmittedSearchTerm('');
  };

  const handleSearch = () => {
    setSubmittedSearchTerm(searchTerm);
  };

  const handleFilterChange = (filter: 'shopping' | 'service' | null) => {
    let newFilter: 'shopping' | 'service' | null;
    if (filter === null) {
        newFilter = null;
    } else {
        newFilter = activeFilter === filter ? null : filter;
    }
    setActiveFilter(newFilter);

    const params = new URLSearchParams(window.location.search);
    if (newFilter) params.set('filter', newFilter);
    else params.delete('filter');
    router.push(`${window.location.pathname}?${params.toString()}`);
  };
  
  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: LatLngBounds) => {
    setMapCenter((currentCenter) => {
      const centerChanged = Math.abs(currentCenter[0] - newCenter[0]) > 0.00001 || Math.abs(currentCenter[1] - newCenter[1]) > 0.00001;
      return centerChanged ? newCenter : currentCenter;
    });
    setMapZoom((currentZoom) => currentZoom !== newZoom ? newZoom : currentZoom);
  }, []);
  
  const dealershipsToDisplay = useMemo(() => {
    const lowerCaseSearch = submittedSearchTerm.toLowerCase();
    const allBrands = Object.keys(brandLogos).map(b => b.toLowerCase());
    const isBrandSearch = allBrands.includes(lowerCaseSearch);

    return [...filteredDealerships].sort((a, b) => {
      if (a.id === selectedDealershipId) return -1;
      if (b.id === selectedDealershipId) return 1;
      if (isBrandSearch) {
        const aIsPrimary = a.brands?.[0]?.toLowerCase() === lowerCaseSearch;
        const bIsPrimary = b.brands?.[0]?.toLowerCase() === lowerCaseSearch;
        if (aIsPrimary && !bIsPrimary) return -1;
        if (!aIsPrimary && bIsPrimary) return 1;
      }
      return getDistanceSq(mapCenter, a) - getDistanceSq(mapCenter, b);
    }).slice(0, 50);
  }, [filteredDealerships, mapCenter, selectedDealershipId, submittedSearchTerm]);

  const handleCardClick = useCallback((dealership: Dealership) => {
    setSelectedDealershipId(dealership.id);
    if (dealership.latitude && dealership.longitude) {
      setMapCenter([dealership.latitude, dealership.longitude]);
      setMapZoom(14);
    }
  }, []);
  
  const handleMarkerClick = useCallback((id: string) => {
    setSelectedDealershipId(currentId => currentId === id ? null : id);
    setFirstClickId(id);
  }, []);

  useEffect(() => {
    if (!selectedDealershipId) return;
    const targetCard = cardRefs.current.get(selectedDealershipId);
    if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedDealershipId]);

  const handleMarkerMouseOver = useCallback((id: string) => {
    if (hoverOutTimeoutRef.current) clearTimeout(hoverOutTimeoutRef.current);
    hoverInTimeoutRef.current = setTimeout(() => setHoveredDealershipId(id), 500);
  }, []);

  const handleMouseOut = useCallback(() => {
    if (hoverInTimeoutRef.current) clearTimeout(hoverInTimeoutRef.current);
    hoverOutTimeoutRef.current = setTimeout(() => setHoveredDealershipId(null), 100);
  }, []);

  const handleLocationError = useCallback(() => {
    toast({ variant: "destructive", title: "Géolocalisation impossible", description: "Vérifiez vos permissions." });
  }, [toast]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startHeight.current = panelHeight;
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = startY.current - y;
    setPanelHeight(Math.max(window.innerHeight * 0.2, Math.min(startHeight.current + deltaY, window.innerHeight * 0.85)));
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
      window.addEventListener('touchend', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
    };
  }, [isDragging, handleDragMove]);

  useEffect(() => {
    if (width && width < 768) setPanelHeight(window.innerHeight * 0.77);
  }, [width]);

  const listContent = (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground pt-20">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand" />
            <p className="mt-2">Chargement...</p>
          </div>
        ) : (
          <>
            {dealershipsToDisplay.flatMap((dealer, index) => {
              const card = (
                <div key={dealer.id} ref={node => cardRefs.current.set(dealer.id, node)} onMouseEnter={() => handleMarkerMouseOver(dealer.id)} onMouseLeave={handleMouseOut}>
                  <DealershipCard dealership={dealer} onClick={() => handleCardClick(dealer)} className={cn(dealer.id === selectedDealershipId && "ring-2 ring-brand", dealer.id === hoveredDealershipId && "shadow-lg")} />
                </div>
              );
              const ad = (index > 0 && (index + 1) % 5 === 0) ? <div key={`ad-${index}`} className="my-4"><AdCard /></div> : null;
              return [card, ad];
            })}
            {dealershipsToDisplay.length === 0 && <div className="text-center text-muted-foreground pt-20"><p>Aucun résultat.</p></div>}
          </>
        )}
      </div>
    </ScrollArea>
  );

  if (width === undefined) return <div className="flex h-[100svh] w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="flex flex-col h-[100svh] w-full overflow-hidden bg-background">
      <Header searchTerm={searchTerm} onSearchTermChange={handleSearchTermChange} onSearch={handleSearch} activeFilter={activeFilter} onFilterChange={handleFilterChange} placeholderText={placeholderText} />
      <div className="flex-1 flex overflow-hidden relative">
        {isMobile ? (
          <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col">
            <div className="absolute inset-0 z-0 h-full w-full">
              <MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} hoveredDealershipId={hoveredDealershipId} selectedDealershipId={selectedDealershipId} firstClickId={firstClickId} onMarkerClick={handleMarkerClick} onMarkerMouseOver={handleMarkerMouseOver} onMarkerMouseOut={handleMouseOut} onMapChange={handleMapChange} onMapClick={() => setFirstClickId(null)} isLocating={isLocating} onLocateEnd={() => setIsLocating(false)} onLocationError={handleLocationError} />
              <div className="absolute top-2 right-2 z-[1000]">
                <Button size="icon" className="rounded-full shadow-lg h-9 w-9 bg-brand text-brand-foreground" onClick={() => setIsLocating(true)} disabled={isLocating}><Crosshair className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl shadow-[0_-4px_16px_rgba(0,0,0,0.15)] flex flex-col z-[1001]" style={{ height: `${panelHeight}px` }}>
              <div ref={dragHandleRef} onMouseDown={handleDragStart} onTouchStart={handleDragStart} className="w-full h-5 flex items-center justify-center cursor-row-resize flex-shrink-0 touch-none"><div className="w-10 h-1 bg-border rounded-full" /></div>
              <div className="flex-grow flex flex-col min-h-0"><RatingFilter value={ratingFilter} onChange={setRatingFilter} />{listContent}</div>
            </div>
          </div>
        ) : (
          <>
            <aside className="w-2/3 flex-shrink-0 h-full flex flex-col bg-background border-r z-10 shadow-md"><RatingFilter value={ratingFilter} onChange={setRatingFilter} />{listContent}</aside>
            <main className="flex-1 bg-gray-100 h-full relative">
              <MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} hoveredDealershipId={hoveredDealershipId} selectedDealershipId={selectedDealershipId} firstClickId={firstClickId} onMarkerClick={handleMarkerClick} onMarkerMouseOver={handleMarkerMouseOver} onMarkerMouseOut={handleMouseOut} onMapChange={handleMapChange} onMapClick={() => setFirstClickId(null)} isLocating={isLocating} onLocateEnd={() => setIsLocating(false)} onLocationError={handleLocationError} />
              <div className="absolute top-4 right-4 z-[1000]"><Button size="icon" className="rounded-full shadow-lg bg-brand text-brand-foreground" onClick={() => setIsLocating(true)} disabled={isLocating}><Crosshair className="h-5 w-5" /></Button></div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return <Suspense fallback={<div className="flex h-[100svh] w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><MapPageComponent /></Suspense>;
}

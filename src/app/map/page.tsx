'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/ui/ad-card';
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
        <div className={cn("p-2 px-4 border-b bg-background sticky top-0 z-10", className)}>
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
                        <Star className="w-4 h-4 text-brand fill-brand" />
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
  const [mapBoundsStr, setMapBoundsStr] = useState<string | null>(null);
  
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(null);
  const [firstClickId, setFirstClickId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const { firestore } = useFirebase();
  
  // Mobile Drawer State
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'expanded'>('half');
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
        toast({
            variant: "destructive",
            title: "Erreur de chargement",
            description: "Impossible de récupérer les fiches.",
        });
        setAllDealerships([]);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, toast]);

  const placeholderText = useMemo(() => {
    if (activeFilter === 'service') return "Réparation, entretien, dépannage...";
    if (activeFilter === 'shopping') return "Achat, vente, accessoires...";
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
            (d.address?.toLowerCase().includes(lowerCaseSearch)) ||
            (d.brands?.some(brand => brand.toLowerCase().includes(lowerCaseSearch)))
        );
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
    if (filter === null) newFilter = null;
    else newFilter = activeFilter === filter ? null : filter;
    setActiveFilter(newFilter);

    const params = new URLSearchParams(window.location.search);
    if (newFilter) params.set('filter', newFilter);
    else params.delete('filter');
    router.push(`${window.location.pathname}?${params.toString()}`);
  };
  
  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: LatLngBounds) => {
    if (!bounds) return;
    const boundsStr = bounds.toBBoxString();
    setMapBoundsStr(current => current !== boundsStr ? boundsStr : current);
    
    setMapCenter((currentCenter) => {
      const centerChanged = Math.abs(currentCenter[0] - newCenter[0]) > 0.00001 || Math.abs(currentCenter[1] - newCenter[1]) > 0.00001;
      return centerChanged ? newCenter : currentCenter;
    });
    setMapZoom((currentZoom) => currentZoom !== newZoom ? newZoom : currentZoom);
  }, []);
  
  const dealershipsToDisplay = useMemo(() => {
    let visibleResults = filteredDealerships;

    if (mapBoundsStr) {
        const parts = mapBoundsStr.split(',').map(Number);
        const minLng = parts[0], minLat = parts[1], maxLng = parts[2], maxLat = parts[3];
        
        visibleResults = visibleResults.filter(d => {
            if (d.latitude == null || d.longitude == null) return false;
            return d.latitude >= minLat && d.latitude <= maxLat && d.longitude >= minLng && d.longitude <= maxLng;
        });
    }

    const lowerCaseSearch = submittedSearchTerm.toLowerCase();
    const allBrands = Object.keys(brandLogos).map(b => b.toLowerCase());
    const isBrandSearch = allBrands.includes(lowerCaseSearch);

    return [...visibleResults].sort((a, b) => {
      if (a.id === selectedDealershipId) return -1;
      if (b.id === selectedDealershipId) return 1;
      if (isBrandSearch) {
        const aIsPrimary = a.brands?.[0]?.toLowerCase() === lowerCaseSearch;
        const bIsPrimary = b.brands?.[0]?.toLowerCase() === lowerCaseSearch;
        if (aIsPrimary && !bIsPrimary) return -1;
        if (!aIsPrimary && bIsPrimary) return 1;
      }
      return getDistanceSq(mapCenter, a) - getDistanceSq(mapCenter, b);
    }).slice(0, 25);
  }, [filteredDealerships, mapBoundsStr, mapCenter, selectedDealershipId, submittedSearchTerm]);

  const handleCardClick = useCallback((dealership: Dealership) => {
    setSelectedDealershipId(dealership.id);
    if (dealership.latitude && dealership.longitude) {
      setMapCenter([dealership.latitude, dealership.longitude]);
      setMapZoom(14);
      if (isMobile) setDrawerHeight('half');
    }
  }, [isMobile]);
  
  const handleMarkerClick = useCallback((id: string) => {
    setSelectedDealershipId(currentId => currentId === id ? null : id);
    setFirstClickId(id);
    if (isMobile && id) setDrawerHeight('half');
  }, [isMobile]);

  useEffect(() => {
    if (!selectedDealershipId) return;
    const targetCard = cardRefs.current.get(selectedDealershipId);
    if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [selectedDealershipId]);

  const handleMarkerMouseOver = useCallback((id: string) => {
    setHoveredDealershipId(id);
  }, []);

  const handleMouseOut = useCallback(() => {
    setHoveredDealershipId(null);
  }, []);

  const handleMapClick = useCallback(() => {
    setFirstClickId(null);
    if (isMobile) setDrawerHeight('collapsed');
  }, [isMobile]);

  const handleLocationError = useCallback(() => {
    toast({ variant: "destructive", title: "Géolocalisation impossible", description: "Vérifiez vos permissions." });
  }, [toast]);

  // Bottom Sheet Swipe Logic
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY; // Positive = swipe up

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiping UP
        setDrawerHeight(current => current === 'collapsed' ? 'half' : 'expanded');
      } else {
        // Swiping DOWN
        setDrawerHeight(current => current === 'expanded' ? 'half' : 'collapsed');
      }
    }
  };

  const listContent = (
    <div className="space-y-4 pb-20">
      {isLoading ? (
        <div className="text-center text-muted-foreground pt-10">
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
          {dealershipsToDisplay.length === 0 && <div className="text-center text-muted-foreground py-10"><p>Déplacez la carte pour voir les concessions de cette zone.</p></div>}
        </>
      )}
    </div>
  );

  if (width === undefined) return <div className="flex h-[100svh] w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="flex flex-col w-full bg-background h-[100svh] overflow-hidden">
      <Header searchTerm={searchTerm} onSearchTermChange={handleSearchTermChange} onSearch={handleSearch} activeFilter={activeFilter} onFilterChange={handleFilterChange} placeholderText={placeholderText} />
      
      <div className="flex-1 relative overflow-hidden">
        {/* Map is always background on Mobile, sidebar on Desktop */}
        <main className={cn("absolute inset-0 z-0", !isMobile && "relative left-1/3 w-2/3 h-full")}>
          <MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} hoveredDealershipId={hoveredDealershipId} selectedDealershipId={selectedDealershipId} firstClickId={firstClickId} onMarkerClick={handleMarkerClick} onMarkerMouseOver={handleMarkerMouseOver} onMarkerMouseOut={handleMouseOut} onMapChange={handleMapChange} onMapClick={handleMapClick} isLocating={isLocating} onLocateEnd={() => setIsLocating(false)} onLocationError={handleLocationError} />
          <div className={cn("absolute z-[1000]", isMobile ? "top-2 right-2" : "top-4 right-4")}>
            <Button size="icon" className="rounded-full shadow-lg h-10 w-10 bg-brand text-brand-foreground" onClick={() => setIsLocating(true)} disabled={isLocating}><Crosshair className="h-5 w-5" /></Button>
          </div>
        </main>

        {isMobile ? (
          /* Mobile Bottom Sheet */
          <div 
            className={cn(
              "fixed left-0 right-0 bg-background rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-50 transition-all duration-300 ease-in-out border-t",
              drawerHeight === 'collapsed' ? 'bottom-0 h-[80px]' : drawerHeight === 'half' ? 'bottom-0 h-[45vh]' : 'bottom-0 h-[85vh]'
            )}
          >
            {/* Handle / Peek Bar */}
            <div 
              className="w-full flex flex-col items-center pt-2 pb-4 cursor-grab active:cursor-grabbing touch-none"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onClick={() => setDrawerHeight(drawerHeight === 'expanded' ? 'half' : drawerHeight === 'half' ? 'expanded' : 'half')}
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mb-2" />
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                {dealershipsToDisplay.length} résultat{dealershipsToDisplay.length > 1 ? 's' : ''} visible{dealershipsToDisplay.length > 1 ? 's' : ''}
                {drawerHeight === 'expanded' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </div>
            </div>

            <div className="px-4 h-full flex flex-col">
              <RatingFilter value={ratingFilter} onChange={setRatingFilter} className="border-none px-0" />
              <ScrollArea className="flex-1">
                {listContent}
              </ScrollArea>
            </div>
          </div>
        ) : (
          /* Desktop Sidebar */
          <aside className="absolute left-0 top-0 w-1/3 h-full flex flex-col bg-background border-r z-10 shadow-md">
            <div className="p-4 border-b bg-muted/30">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {dealershipsToDisplay.length} résultat{dealershipsToDisplay.length > 1 ? 's' : ''} dans cette zone
                </span>
            </div>
            <RatingFilter value={ratingFilter} onChange={setRatingFilter} />
            <ScrollArea className="h-full">
              <div className="p-4">
                {listContent}
              </div>
            </ScrollArea>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return <Suspense fallback={<div className="flex h-[100svh] w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><MapPageComponent /></Suspense>;
}

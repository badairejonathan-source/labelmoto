
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import { Crosshair, Loader2, Star, ChevronUp, ChevronDown, MapPin, AlertCircle } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { useFirebase } from '@/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';
import type { LatLngBounds } from 'leaflet';
import { useSearchParams, useRouter } from 'next/navigation';
import articlesData from '@/app/data/articles.json';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
        <div className={cn("p-1 bg-background sticky top-0 z-10", className)}>
            <div className="flex items-center justify-center space-x-1.5">
                <span className="text-[10px] font-bold text-muted-foreground mr-1 hidden md:inline uppercase tracking-wider">Note :</span>
                <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onChange(0)} 
                    className={cn(
                        "rounded-full px-3 text-[10px] font-bold h-7 transition-all duration-200",
                        value === 0 
                            ? "bg-brand text-brand-foreground shadow-sm ring-1 ring-brand" 
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
                            "flex gap-1 rounded-full px-2.5 text-[10px] font-bold h-7 transition-all duration-200",
                            value === rating 
                                ? "bg-brand text-brand-foreground shadow-sm ring-1 ring-brand" 
                                : "hover:bg-muted"
                        )}
                    >
                        <span>{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
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
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const zoomParam = searchParams.get('zoom');
  const selectedIdParam = searchParams.get('selectedId');
  
  const [allDealerships, setAllDealerships] = useState<Dealership[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [searchStatus, setSearchStatus] = useState<'exact' | 'fallback_brand' | 'fallback_nearby' | 'none'>('none');
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchParam || '');
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(6);
  const [mapBoundsStr, setMapBoundsStr] = useState<string | null>(null);
  
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(selectedIdParam || null);
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
    if (latParam && lngParam) {
        setMapCenter([parseFloat(latParam), parseFloat(lngParam)]);
        setMapZoom(zoomParam ? parseInt(zoomParam) : 12);
    } else if (!searchParam) {
        setMapCenter([46.603354, 1.888334]);
        setMapZoom(6);
    }

    if (selectedIdParam) {
        setSelectedDealershipId(selectedIdParam);
    } else {
        setSelectedDealershipId(null);
    }

    if (searchParam) {
        setSearchTerm(searchParam);
        setSubmittedSearchTerm(searchParam);
    } else {
        setSearchTerm('');
        setSubmittedSearchTerm('');
    }
  }, [latParam, lngParam, zoomParam, selectedIdParam, searchParam]);

  useEffect(() => {
    if (!firestore) return;
    const dealershipsRef = collection(firestore, 'concessions');

    const unsubscribe = onSnapshot(dealershipsRef, 
      (querySnapshot) => {
        const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            latitude: doc.data().latitude ? parseFloat(String(doc.data().latitude).replace(',', '.')) : undefined,
            longitude: doc.data().longitude ? parseFloat(String(doc.data().longitude).replace(',', '.')) : undefined,
        } as Dealership));
        setAllDealerships(results);
        setIsLoading(false);
      }, 
      async (error) => {
        const permissionError = new FirestorePermissionError({
          path: dealershipsRef.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore]);

  useEffect(() => {
    let results = allDealerships;
    let status: 'exact' | 'fallback_brand' | 'fallback_nearby' | 'none' = 'exact';

    if (activeFilter) {
      results = results.filter(d => activeFilter === 'shopping' ? (d.appSection === 'shopping' || d.appSection === 'both') : (d.appSection === 'service' || d.appSection === 'both'));
    }

    if (submittedSearchTerm.trim() !== '') {
        const lower = submittedSearchTerm.toLowerCase().trim();
        const normalizedSearch = lower.replace(/[\s-]/g, '');
        
        // Exact dealer match by name
        const exactDealerMatch = allDealerships.find(d => d.title?.toLowerCase().trim() === lower);
        
        if (exactDealerMatch) {
            if (exactDealerMatch.latitude && exactDealerMatch.longitude) {
                setMapCenter([exactDealerMatch.latitude, exactDealerMatch.longitude]);
                setMapZoom(14);
                setSelectedDealershipId(exactDealerMatch.id);
            }
            results = [exactDealerMatch];
        } else {
            // Brand & Location Detection
            let detectedBrand = '';
            let detectedLoc = null;
            const brandsList = Object.keys(brandLogos);
            const sortedBrands = [...brandsList].sort((a, b) => b.length - a.length);

            for (const brand of sortedBrands) {
                const normalizedBrand = brand.toLowerCase().replace(/[\s-]/g, '');
                if (normalizedSearch.includes(normalizedBrand)) {
                    detectedBrand = brand;
                    break;
                }
            }

            const normalizedBrandName = detectedBrand ? detectedBrand.toLowerCase().replace(/[\s-]/g, '') : '';
            const searchRemainder = detectedBrand ? normalizedSearch.replace(normalizedBrandName, "").trim() : normalizedSearch;

            if (searchRemainder.length > 0) {
                for (const [dept, info] of Object.entries(locationsData)) {
                    const normalizedDept = dept.toLowerCase().replace(/[\s-]/g, '');
                    if (normalizedDept.includes(searchRemainder) || info.cities.some(c => c.toLowerCase().replace(/[\s-]/g, '').includes(searchRemainder))) {
                        detectedLoc = info;
                        break;
                    }
                }
            }

            // FILTERING LOGIC
            if (detectedBrand && detectedLoc) {
                const brandMatches = allDealerships.filter(d => {
                    const normalizedBrandRef = detectedBrand.toLowerCase().replace(/[\s-]/g, '');
                    return (Array.isArray(d.brands) && d.brands.some(b => String(b).toLowerCase().replace(/[\s-]/g, '').includes(normalizedBrandRef))) ||
                    d.title?.toLowerCase().replace(/[\s-]/g, '').includes(normalizedBrandRef);
                });

                if (brandMatches.length > 0) {
                    // Find brand matches near location
                    const nearbyBrandMatches = brandMatches.filter(d => getDistanceSq(detectedLoc.center, d) < 0.8);

                    if (nearbyBrandMatches.length > 0) {
                        setMapCenter([detectedLoc.center[0], detectedLoc.center[1]]);
                        setMapZoom(9);
                        results = brandMatches;
                    } else {
                        // NO BRAND IN THIS LOCATION -> FALLBACK TO NEAREST BRAND
                        status = 'fallback_brand';
                        let nearest = brandMatches[0];
                        let minDistanceSq = getDistanceSq(detectedLoc.center, nearest);

                        brandMatches.forEach(d => {
                            const dist = getDistanceSq(detectedLoc.center, d);
                            if (dist < minDistanceSq) {
                                minDistanceSq = dist;
                                nearest = d;
                            }
                        });

                        // Focus view on both (point médian)
                        if (nearest.latitude && nearest.longitude) {
                            const midLat = (detectedLoc.center[0] + nearest.latitude) / 2;
                            const midLng = (detectedLoc.center[1] + nearest.longitude) / 2;
                            setMapCenter([midLat, midLng]);
                            setMapZoom(8);
                        } else {
                            setMapCenter([detectedLoc.center[0], detectedLoc.center[1]]);
                            setMapZoom(8);
                        }
                        results = brandMatches;
                    }
                } else {
                    // BRAND DOES NOT EXIST AT ALL -> Show nearby anything
                    status = 'fallback_nearby';
                    setMapCenter([detectedLoc.center[0], detectedLoc.center[1]]);
                    setMapZoom(10);
                    results = allDealerships; 
                }
            } else {
                // Location only or Brand only
                let foundLocation = false;
                Object.entries(locationsData).forEach(([dept, info]) => {
                    const normalizedDept = dept.toLowerCase().replace(/[\s-]/g, '');
                    if (normalizedDept === normalizedSearch || info.cities.some(c => c.toLowerCase().replace(/[\s-]/g, '') === normalizedSearch)) {
                        if (!foundLocation) {
                            setMapCenter([info.center[0], info.center[1]]);
                            setMapZoom(10);
                            foundLocation = true;
                        }
                    }
                });

                if (!foundLocation) {
                    if (detectedBrand) {
                        const normalizedBrandRef = detectedBrand.toLowerCase().replace(/[\s-]/g, '');
                        results = results.filter(d => 
                            (Array.isArray(d.brands) && d.brands.some(b => String(b).toLowerCase().replace(/[\s-]/g, '').includes(normalizedBrandRef))) ||
                            d.title?.toLowerCase().replace(/[\s-]/g, '').includes(normalizedBrandRef)
                        );
                        if (results.length === 0) {
                            status = 'fallback_nearby';
                            results = allDealerships;
                        }
                    } else {
                        results = results.filter(d => 
                            d.title?.toLowerCase().includes(lower) || 
                            d.address?.toLowerCase().includes(lower) || 
                            (Array.isArray(d.brands) && d.brands.some(b => String(b).toLowerCase().includes(lower)))
                        );
                        if (results.length === 0) {
                            status = 'fallback_nearby';
                            results = allDealerships;
                        }
                    }
                }
            }
        }
    } else {
        status = 'none';
    }

    if (ratingFilter > 0) {
        results = results.filter(d => {
            const r = d.rating ? parseFloat(String(d.rating).replace(',', '.')) : 0;
            return !isNaN(r) && r >= ratingFilter;
        });
    }
    
    setSearchStatus(status);
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
    // Si une recherche est en cours, on ne restreint pas aux limites de la carte pour permettre de voir les suggestions de proximité
    if (mapBoundsStr && submittedSearchTerm.trim() === '') {
        const [minLng, minLat, maxLng, maxLat] = mapBoundsStr.split(',').map(Number);
        results = results.filter(d => d.latitude != null && d.longitude != null && d.latitude >= minLat && d.latitude <= maxLat && d.longitude >= minLng && d.longitude <= maxLng);
    }
    return [...results].sort((a, b) => getDistanceSq(mapCenter, a) - getDistanceSq(mapCenter, b)).slice(0, 30);
  }, [filteredDealerships, mapBoundsStr, mapCenter, submittedSearchTerm]);

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

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSubmittedSearchTerm('');
      setMapCenter([46.603354, 1.888334]);
      setMapZoom(6);
      setSelectedDealershipId(null);
      setSearchStatus('none');
      router.push('/map', { scroll: false });
    }
  }, [router]);

  const listContent = (
    <div className="space-y-3 pb-20">
      {isLoading ? (
        <div className="text-center text-muted-foreground pt-10"><Loader2 className="mx-auto h-8 w-8 animate-spin text-brand" /><p className="mt-2">Chargement...</p></div>
      ) : (
        <>
          {searchStatus === 'fallback_brand' && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4 rounded-r-lg">
                <div className="flex items-center gap-2 text-orange-800 font-bold text-sm mb-1 uppercase tracking-tight">
                    <AlertCircle className="h-4 w-4" />
                    Aucun résultat direct
                </div>
                <p className="text-xs text-orange-700">La marque n'est pas présente dans cette zone. Voici les professionnels les plus proches.</p>
            </div>
          )}
          
          {searchStatus === 'fallback_nearby' && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-1 uppercase tracking-tight">
                    <MapPin className="h-4 w-4" />
                    Pas de correspondance exacte
                </div>
                <p className="text-xs text-blue-700">Aucun garage ne correspond à votre recherche. Voici les professionnels à proximité.</p>
            </div>
          )}

          {dealershipsToDisplay.map((dealer, index) => {
            const adIndex = Math.floor((index + 1) / 4) - 1;
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
                    className={cn(dealer.id === selectedDealershipId && "ring-2 ring-brand", dealer.id === hoveredDealershipId && "shadow-md")} 
                  />
                </div>
                {(index + 1) % 4 === 0 && article && (
                  <div className="py-1 w-full">
                    <AdCard article={article} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          
          {dealershipsToDisplay.length > 0 && dealershipsToDisplay.length < 4 && articlesData[0] && (
            <div className="py-1 w-full">
              <AdCard article={articlesData[0]} />
            </div>
          )}

          {dealershipsToDisplay.length === 0 && (
            <div className="text-center text-muted-foreground py-10 px-4">
                <p className="font-bold text-foreground">Aucun établissement trouvé.</p>
                <p className="text-sm mt-2">Explorez la carte ou modifiez vos filtres pour voir plus de résultats.</p>
                <Button variant="outline" className="mt-4 rounded-full" onClick={() => handleSearchTermChange('')}>
                    Réinitialiser la recherche
                </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (width === undefined) return <div className="flex h-[100svh] w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="flex flex-col w-full bg-background h-screen overflow-hidden">
      <Header searchTerm={searchTerm} onSearchTermChange={handleSearchTermChange} onSearch={() => setSubmittedSearchTerm(searchTerm)} activeFilter={activeFilter} onFilterChange={setActiveFilter} placeholderText="Recherche par nom, ville, departement" />
      
      <div className="flex-1 flex overflow-hidden relative">
        {!isMobile && (
          <>
            <aside className="w-3/4 flex flex-col bg-background border-r z-10 shadow-md h-full">
              <div className="p-3 border-b bg-muted/20 flex justify-between items-center">
                <RatingFilter value={ratingFilter} onChange={setRatingFilter} className="border-none p-0 flex-1" />
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="py-3 pl-3 space-y-3">{listContent}</div>
              </div>
            </aside>
            <main className="w-1/4 relative bg-muted/5">
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
              <div className="absolute top-3 right-3 z-[1000] p-1 overflow-visible">
                <Button size="icon" className="rounded-full shadow-lg h-9 w-9 bg-brand text-brand-foreground p-0" onClick={() => setIsLocating(true)} disabled={isLocating}><Crosshair className="h-4.5 w-4.5" /></Button>
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
                <Button size="icon" className="rounded-full shadow-lg h-9 w-9 bg-brand text-brand-foreground p-0" onClick={() => setIsLocating(true)} disabled={isLocating}><Crosshair className="h-4.5 w-4.5" /></Button>
              </div>
            </main>
            <div className={cn(
              "fixed left-0 right-0 bg-background rounded-t-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.1)] z-50 transition-all duration-300 ease-in-out border-t",
              drawerHeight === 'collapsed' ? 'bottom-0 h-[70px]' : drawerHeight === 'half' ? 'bottom-0 h-[50vh]' : 'bottom-0 h-[95vh]'
            )}>
              <div className="relative w-full flex flex-col items-center pt-2 pb-1 cursor-grab touch-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div 
                  className="w-10 h-1 bg-muted rounded-full" 
                  onClick={() => {
                    const next = drawerHeight === 'collapsed' ? 'half' : drawerHeight === 'half' ? 'expanded' : 'half';
                    setDrawerHeight(next);
                    if (next === 'expanded') setIsExpanding(true);
                    if (next === 'collapsed') setIsExpanding(true);
                  }}
                />
              </div>
              <div className="px-3 h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b pb-1">
                  <RatingFilter value={ratingFilter} onChange={setRatingFilter} className="border-none px-0 flex-1" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full shrink-0" 
                    onClick={handleChevronClick}
                  >
                    {(drawerHeight === 'collapsed' || (drawerHeight === 'half' && isExpanding)) ? (
                      <ChevronUp className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-muted-foreground" />
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

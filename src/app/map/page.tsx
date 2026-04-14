
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import { Crosshair, Loader2, Star, ChevronUp, ChevronDown, Sparkles, FileText, MapPin } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { useFirebase } from '@/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import type { LatLngBounds } from 'leaflet';
import { useSearchParams, useRouter } from 'next/navigation';
import LocationPrompt from '@/components/app/location-prompt';
import { Skeleton } from '@/components/ui/skeleton';

const ads = [
  { id: 'achat-moto-occasion-guide-complet-pour-eviter-les-pieges', title: 'Achat moto d’occasion : le guide pour éviter les pièges', description: 'Apprenez à inspecter une moto, vérifier les documents et négocier.', imageUrl: '/images/evitelespieges.webp' },
  { id: 'combien-coute-vraiment-une-moto-par-mois', title: 'Combien coûte vraiment une moto par mois ?', description: 'Le budget réel d’un motard débutant : assurance, essence, entretien.', imageUrl: '/images/motard-budget-reel.png' },
  { id: 'meilleure-moto-a2-quelle-moto-choisir-pour-debuter', title: 'Achat moto A2 : le guide des meilleures motos', description: 'Trouvez la moto idéale pour débuter selon votre gabarit et votre budget.', imageUrl: '/images/achat-occasion.webp' },
  { id: 'entretien-moto-intervalles-prix-conseils-par-modele', title: 'Guide d\'entretien & révisions', description: 'Tous les intervalles et prix estimés pour votre modèle de moto.', imageUrl: '/images/motard-entretien-page.webp' },
];

const MapComponent = dynamic(
  () => import('@/components/app/map-component').then((mod) => mod.default), 
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    )
  }
);

const getDistanceSq = (anchor: [number, number], dealer: Dealership) => {
    if (dealer.latitude == null || dealer.longitude == null || isNaN(dealer.latitude) || isNaN(dealer.longitude)) return Infinity;
    const dx = anchor[1] - dealer.longitude;
    const dy = anchor[0] - dealer.latitude;
    return dx * dx + dy * dy;
};

const getCityCoordinates = async (postalCode: string): Promise<[number, number] | null> => {
  try {
    const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=centre`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.length > 0) {
      const { coordinates } = data[0].centre;
      return [coordinates[1], coordinates[0]];
    }
    return null;
  } catch (error) { return null; }
};

const getCityCoordinatesByName = async (cityName: string): Promise<[number, number] | null> => {
  try {
    const response = await fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(cityName)}&fields=centre&boost=population&limit=1`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.length > 0) {
      const { coordinates } = data[0].centre;
      return [coordinates[1], coordinates[0]];
    }
    return null;
  } catch (error) { return null; }
};

const RatingFilter = ({ value, onChange, className }: { value: number; onChange: (value: number) => void; className?: string; }) => {
    const ratings = [4, 3, 2, 1];
    return (
        <div className={cn("p-1 bg-background sticky top-0 z-10", className)}>
            <div className="flex items-center justify-center space-x-1.5">
                <span className="text-[10px] font-bold text-muted-foreground mr-1 hidden md:inline uppercase tracking-wider">Note :</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onChange(0)} 
                  className={cn("rounded-full px-3 text-[10px] font-bold h-7 transition-all duration-200", value === 0 ? "bg-brand text-brand-foreground shadow-sm" : "hover:bg-muted")}
                >
                  TOUS
                </Button>
                {ratings.map((rating) => (
                    <Button 
                      key={rating} 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onChange(value === rating ? 0 : rating)} 
                      className={cn("flex gap-1 rounded-full px-2.5 text-[10px] font-bold h-7 transition-all duration-200", value === rating ? "bg-brand text-brand-foreground shadow-sm" : "hover:bg-muted")}
                    >
                        <span>{rating}</span><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
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
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchParam || '');
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [sortingAnchor, setSortingAnchor] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom, setMapZoom] = useState(5.5);
  const [mapBoundsStr, setMapBoundsStr] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(selectedIdParam || null);
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLoadingLocating] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const { firestore } = useFirebase();
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half'>('half');
  const touchStartY = useRef<number>(0);
  const [activeFilter, setActiveFilter] = useState<'shopping' | 'service' | null>(() => {
    if (filterParam === 'service') return 'service';
    if (filterParam === 'shopping') return 'shopping';
    return null;
  });

  const { width, height } = useWindowSize();
  const isMobile = (width || 1024) < 768;

  const bottomPadding = useMemo(() => { 
    if (!isMobile || !height) return 0; 
    return drawerHeight === 'half' ? height / 2 : 70; 
  }, [isMobile, height, drawerHeight]);
  
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (latParam && lngParam) {
        const pos: [number, number] = [parseFloat(latParam), parseFloat(lngParam)];
        setMapCenter(pos); setSortingAnchor(pos); setMapZoom(zoomParam ? parseInt(zoomParam) : 12);
    }
    if (selectedIdParam) setSelectedDealershipId(selectedIdParam);
    if (searchParam) { setSearchTerm(searchParam); setSubmittedSearchTerm(searchParam); }
  }, [latParam, lngParam, zoomParam, selectedIdParam, searchParam]);

  useEffect(() => {
    if (!firestore || !mounted) return;
    setIsLoading(true);
    const dealershipsRef = collection(firestore, 'concessions');
    return onSnapshot(dealershipsRef, (snapshot) => {
        const results = snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data(),
            latitude: doc.data().latitude ? parseFloat(String(doc.data().latitude).replace(',', '.')) : undefined,
            longitude: doc.data().longitude ? parseFloat(String(doc.data().longitude).replace(',', '.')) : undefined,
        } as Dealership));
        setAllDealerships(results); setIsLoading(false);
    }, () => setIsLoading(false));
  }, [firestore, mounted]);

  useEffect(() => {
    const processSearch = async () => {
        let results = [...allDealerships];
        if (activeFilter) { results = results.filter(d => activeFilter === 'shopping' ? (d.appSection === 'shopping' || d.appSection === 'both') : (d.appSection === 'service' || d.appSection === 'both')); }
        if (submittedSearchTerm.trim() !== '') {
            const lower = submittedSearchTerm.toLowerCase().trim();
            const normalizedTerm = lowerTerm.replace(/[\s-]/g, ''); // Fix: lowerTerm should be lower
            const finalLower = lower.replace(/[\s-]/g, '');
            if (/^\d{5}$/.test(finalLower)) {
                const coords = await getCityCoordinates(finalLower);
                if (coords) { setMapCenter(coords); setSortingAnchor(coords); setMapZoom(13); results = results.filter(d => d.address?.includes(finalLower)); }
            } else {
                const cityCoords = await getCityCoordinatesByName(lower);
                if (cityCoords) { setMapCenter(cityCoords); setSortingAnchor(cityCoords); setMapZoom(12); }
                else results = results.filter(d => d.title?.toLowerCase().includes(lower) || d.address?.toLowerCase().includes(lower));
            }
        }
        if (ratingFilter > 0) results = results.filter(d => (parseFloat(String(d.rating).replace(',', '.')) || 0) >= ratingFilter);
        setFilteredDealerships(results);
    };
    processSearch();
  }, [submittedSearchTerm, allDealerships, activeFilter, ratingFilter]);

  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: LatLngBounds) => { 
    setMapBoundsStr(bounds.toBBoxString()); setMapCenter(newCenter); setMapZoom(newZoom); 
    if (selectionSource !== 'card') { setSortingAnchor(newCenter); } 
  }, [selectionSource]);
  
  const dealershipsToDisplay = useMemo(() => {
    // Si le zoom est faible (ouverture) et qu'aucune recherche n'est en cours
    // On n'affiche aucune fiche de concession
    if (mapZoom < 8 && submittedSearchTerm.trim() === '') {
        return [];
    }

    let results = [...filteredDealerships];
    if (mapBoundsStr) { 
        const [minLng, minLat, maxLng, maxLat] = mapBoundsStr.split(',').map(Number); 
        results = results.filter(d => d.latitude && d.longitude && d.latitude >= minLat && d.latitude <= maxLat && d.longitude >= minLng && d.longitude <= maxLng); 
    }
    return results.sort((a, b) => getDistanceSq(sortingAnchor, a) - getDistanceSq(sortingAnchor, b)).slice(0, 20);
  }, [filteredDealerships, mapBoundsStr, sortingAnchor, mapZoom, submittedSearchTerm]);

  const handleCardClick = useCallback((dealership: Dealership) => { 
    setSelectedDealershipId(dealership.id); setSelectionSource('card'); 
    if (dealership.latitude && dealership.longitude) { 
      setMapCenter([dealership.latitude, dealership.longitude]); setMapZoom(14); 
      if (isMobile) setDrawerHeight('half'); 
    } 
  }, [isMobile]);

  const handleMarkerClick = useCallback((id: string) => { 
    setSelectedDealershipId(id); setSelectionSource('marker');
    const dealer = allDealerships.find(d => d.id === id); 
    if (dealer && dealer.latitude && dealer.longitude) { setMapCenter([dealer.latitude, dealer.longitude]); setSortingAnchor([dealer.latitude, dealer.longitude]); setMapZoom(14); } 
    if (isMobile) setDrawerHeight('half'); 
  }, [isMobile, allDealerships]);

  const handleUserMapInteraction = useCallback(() => { 
    if (isMobile) setDrawerHeight('collapsed'); 
    setSelectionSource(null);
  }, [isMobile]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => { 
    const diff = touchStartY.current - e.changedTouches[0].clientY; 
    if (Math.abs(diff) > 50) setDrawerHeight(diff > 0 ? 'half' : 'collapsed'); 
  };

  const listContent = (
    <div className="space-y-3 pb-20">
      {isLoading ? (
        <div className="space-y-4 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-xl animate-pulse bg-card">
                    <Skeleton className="h-24 w-24 rounded-lg shrink-0" /><div className="flex-1 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-10 w-full rounded-full" /></div>
                </div>
            ))}
        </div>
      ) : (
        <>
            {/* Affichage des articles par défaut (zoom faible et pas de recherche) */}
            {dealershipsToDisplay.length === 0 && submittedSearchTerm === '' && mapZoom < 8 && (
                <div className="space-y-4 pt-2">
                    <div className="bg-brand/5 border-2 border-brand/20 p-6 rounded-[2rem] shadow-sm mb-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-brand animate-pulse" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Guides & Conseils</h3>
                        </div>
                        <div className="space-y-4">
                            {ads.map((ad, idx) => (
                                <AdCard key={ad.id} article={ad} isPublicity={idx === 0} />
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-8 border-2 border-dashed rounded-[2.5rem] text-center bg-muted/5">
                        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-snug">
                            Plus de 3000 établissements référencés.<br/>
                            <span className="text-brand">Zoomez sur la carte pour les afficher.</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Liste des concessions (apparaît après zoom) */}
            {dealershipsToDisplay.map((dealer, index) => (
                <React.Fragment key={dealer.id}>
                    <div onMouseEnter={() => setHoveredDealershipId(dealer.id)} onMouseLeave={() => setHoveredDealershipId(null)}>
                        <DealershipCard dealership={dealer} onClick={() => handleCardClick(dealer)} className={cn(dealer.id === selectedDealershipId && "ring-2 ring-brand")} />
                    </div>
                    {(index + 1) % 4 === 0 && (<div className="my-3"><AdCard article={ads[Math.floor(index / 4) % ads.length]} /></div>)}
                </React.Fragment>
            ))}

            {/* Cas où aucun résultat n'est trouvé après zoom ou recherche */}
            {dealershipsToDisplay.length === 0 && (submittedSearchTerm !== '' || mapZoom >= 8) && !isLoading && (
                <div className="text-center py-20 opacity-50">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="font-black uppercase tracking-widest text-xs">Aucun établissement dans cette zone</p>
                </div>
            )}
        </>
      )}
    </div>
  );

  if (!mounted || width === undefined) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-background">
      <Header 
        searchTerm={searchTerm} 
        onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} 
        onSearch={() => { setSubmittedSearchTerm(searchTerm); }} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      <div className="flex-1 flex overflow-hidden relative">
        {!isMobile ? (
          <>
            <aside className="w-[70%] flex flex-col border-r h-full bg-muted/5">
                <RatingFilter value={ratingFilter} onChange={setRatingFilter} />
                <div className="flex-1 overflow-y-auto p-3">{listContent}</div>
            </aside>
            <main className="flex-1 relative">
              <LocationPrompt onLocate={() => setIsLoadingLocating(true)} />
              <MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} hoveredDealershipId={hoveredDealershipId} selectedDealershipId={selectedDealershipId} onMarkerClick={handleMarkerClick} onMarkerMouseOver={setHoveredDealershipId} onMarkerMouseOut={() => setHoveredDealershipId(null)} onMapChange={handleMapChange} onMapClick={handleUserMapInteraction} onUserInteraction={handleUserMapInteraction} isLocating={isLocating} onLocateEnd={() => setIsLoadingLocating(false)} onLocationFound={(coords) => { setMapCenter(coords); setSortingAnchor(coords); setMapZoom(14); }} />
              <Button size="icon" className="absolute top-3 right-3 z-[1000] rounded-full bg-brand text-white shadow-xl" onClick={() => setIsLoadingLocating(true)} aria-label="Me localiser"><Crosshair className="h-4 w-4" /></Button>
            </main>
          </>
        ) : (
          <>
            <main className="absolute inset-x-0 top-0 h-[calc(100%-115px)] w-full">
              <LocationPrompt onLocate={() => setIsLoadingLocating(true)} />
              <MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} hoveredDealershipId={hoveredDealershipId} selectedDealershipId={selectedDealershipId} onMarkerClick={handleMarkerClick} onMarkerMouseOver={setHoveredDealershipId} onMarkerMouseOut={() => setHoveredDealershipId(null)} onMapChange={handleMapChange} onMapClick={handleUserMapInteraction} onUserInteraction={handleUserMapInteraction} bottomPadding={bottomPadding} isLocating={isLocating} onLocateEnd={() => setIsLoadingLocating(false)} onLocationFound={(coords) => { setMapCenter(coords); setSortingAnchor(coords); setMapZoom(14); }} />
              <Button size="icon" className="absolute top-2 right-2 z-[1000] rounded-full bg-brand text-white shadow-xl" onClick={() => setIsLoadingLocating(true)} aria-label="Me localiser"><Crosshair className="h-4 w-4" /></Button>
            </main>
            <div className={cn("fixed left-0 right-0 bg-background rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-[1200] transition-all duration-500 ease-out border-t", drawerHeight === 'collapsed' ? 'bottom-0 h-[70px]' : 'bottom-0 h-[50vh]')}>
              <div className="relative w-full flex flex-col items-center pt-3 pb-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div className="w-12 h-1.5 bg-muted rounded-full mb-2" />
              </div>
              <div className="px-3 h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b pb-2">
                  <RatingFilter value={ratingFilter} onChange={setRatingFilter} className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => setDrawerHeight(drawerHeight === 'collapsed' ? 'half' : 'collapsed')}>
                    {drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto mt-3">{listContent}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MapPage() { 
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}>
      <MapPageComponent />
    </Suspense>
  ); 
}

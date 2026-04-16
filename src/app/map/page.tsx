
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { Dealership } from '@/lib/types';
import Header from '@/components/app/header';
import { Compass, Loader2, Star, ChevronUp, ChevronDown, Sparkles, FileText, MapPin, X } from 'lucide-react';
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
  const { firestore } = useFirebase();
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('half');
  const [showDesktopPanel, setShowDesktopPanel] = useState(true);
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
    if (drawerHeight === 'full') return height - 160;
    return drawerHeight === 'half' ? height / 2 : 70; 
  }, [isMobile, height, drawerHeight]);
  
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (latParam && lngParam) {
        const pos: [number, number] = [parseFloat(latParam), parseFloat(lngParam)];
        setMapCenter(pos); setSortingAnchor(pos); setMapZoom(zoomParam ? parseInt(zoomParam) : 12);
    }
    if (selectedIdParam) {
      setSelectedDealershipId(selectedIdParam);
      setShowDesktopPanel(true);
    }
    if (searchParam) { 
      setSearchTerm(searchParam); 
      setSubmittedSearchTerm(searchParam); 
      setShowDesktopPanel(true);
    }
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
            const finalLower = lower.replace(/[\s-]/g, '');
            if (/^\d{5}$/.test(finalLower)) {
                const coords = await getCityCoordinates(finalLower);
                if (coords) { setMapCenter(coords); setSortingAnchor(coords); setMapZoom(13); results = results.filter(d => d.address?.includes(finalLower)); }
            } else {
                const cityCoords = await getCityCoordinatesByName(lower);
                if (cityCoords) { setMapCenter(cityCoords); setSortingAnchor(cityCoords); setMapZoom(12); }
                else results = results.filter(d => d.title?.toLowerCase().includes(lower) || d.address?.toLowerCase().includes(lower));
            }
            setShowDesktopPanel(true);
        }
        setFilteredDealerships(results);
    };
    processSearch();
  }, [submittedSearchTerm, allDealerships, activeFilter]);

  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: LatLngBounds) => { 
    setMapBoundsStr(bounds.toBBoxString()); setMapCenter(newCenter); setMapZoom(newZoom); 
    if (selectionSource !== 'card') { setSortingAnchor(newCenter); } 
  }, [selectionSource]);
  
  const dealershipsToDisplay = useMemo(() => {
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
      setShowDesktopPanel(true);
    } 
  }, [isMobile]);

  const handleMarkerClick = useCallback((id: string) => { 
    setSelectedDealershipId(id); setSelectionSource('marker');
    const dealer = allDealerships.find(d => d.id === id); 
    if (dealer && dealer.latitude && dealer.longitude) { setMapCenter([dealer.latitude, dealer.longitude]); setSortingAnchor([dealer.latitude, dealer.longitude]); setMapZoom(14); } 
    if (isMobile) setDrawerHeight('half'); 
    setShowDesktopPanel(true);
  }, [isMobile, allDealerships]);

  const handleUserMapInteraction = useCallback(() => { 
    if (isMobile) setDrawerHeight('collapsed'); 
    setSelectionSource(null);
  }, [isMobile]);

  const onTouchStart = (e: React.TouchEvent) => { 
    touchStartY.current = e.touches[0].clientY; 
    // Empêche la propagation à la carte
    e.stopPropagation();
  };

  const onTouchEnd = (e: React.TouchEvent) => { 
    // Empêche la propagation à la carte
    e.stopPropagation();
    const diff = touchStartY.current - e.changedTouches[0].clientY; 
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Balayage vers le haut
        setDrawerHeight(prev => prev === 'collapsed' ? 'half' : 'full');
      } else {
        // Balayage vers le bas
        setDrawerHeight(prev => prev === 'full' ? 'half' : 'collapsed');
      }
    }
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

            {dealershipsToDisplay.map((dealer, index) => (
                <React.Fragment key={dealer.id}>
                    <div onMouseEnter={() => setHoveredDealershipId(dealer.id)} onMouseLeave={() => setHoveredDealershipId(null)}>
                        <DealershipCard dealership={dealer} onClick={() => handleCardClick(dealer)} className={cn(dealer.id === selectedDealershipId && "ring-2 ring-brand")} />
                    </div>
                    {(index + 1) % 4 === 0 && (<div className="my-3"><AdCard article={ads[Math.floor(index / 4) % ads.length]} /></div>)}
                </React.Fragment>
            ))}

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
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 1. Carte Interactive en Arrière-plan Total (z-0) */}
      <div className="absolute inset-0 z-0">
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
          onMapClick={handleUserMapInteraction} 
          onUserInteraction={handleUserMapInteraction} 
          bottomPadding={bottomPadding} 
          isLocating={isLocating} 
          onLocateEnd={() => setIsLoadingLocating(false)} 
          onLocationFound={(coords) => { setMapCenter(coords); setSortingAnchor(coords); setMapZoom(14); }} 
        />
      </div>

      {/* 2. Header Flottant (Conteneur sans z-index forcé pour laisser les enfants respirer) */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <div className="pointer-events-auto relative">
          <Header 
            searchTerm={searchTerm} 
            onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} 
            onSearch={() => { setSubmittedSearchTerm(searchTerm); }} 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
          
          {/* 3. Bouton Me Localiser - Aligné avec les filtres sur la droite de l'écran */}
          <div className="absolute -bottom-8 md:-bottom-10 right-6 z-[1250] flex flex-col items-center gap-2">
            <LocationPrompt onLocate={() => setIsLoadingLocating(true)} />
            <Button 
              size="icon" 
              className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-brand text-white shadow-2xl border-4 border-white transition-transform hover:scale-110 active:scale-95" 
              onClick={() => setIsLoadingLocating(true)} 
              aria-label="Me localiser"
            >
              <Compass className="h-8 w-8 md:h-10 md:w-10" />
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Listing des Etablissements (Panneau flottant ou Tiroir mobile) */}
      {!isMobile ? (
        <aside className={cn("absolute top-[220px] left-6 bottom-6 w-[450px] z-[1000] flex flex-col bg-background/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden animate-in slide-in-from-left duration-500", !showDesktopPanel && "hidden")}>
            <div className="flex justify-end p-4 border-b border-border/50">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={() => setShowDesktopPanel(false)}>
                <X className="h-6 w-6 text-muted-foreground" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {listContent}
            </div>
        </aside>
      ) : (
        <div 
          className={cn(
            "fixed left-0 right-0 bg-background rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out border-t", 
            drawerHeight === 'collapsed' ? 'bottom-0 h-[70px] z-[1100]' : 
            drawerHeight === 'half' ? 'bottom-0 h-[50vh] z-[1100]' : 
            'bottom-0 h-[calc(100vh-160px)] z-[1300]'
          )}
          onTouchStart={onTouchStart} 
          onTouchEnd={onTouchEnd}
          onTouchMove={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="relative w-full flex flex-col items-center pt-3 pb-1 cursor-grab">
            <div className="w-12 h-1.5 bg-muted rounded-full mb-2" />
          </div>
          <div className="px-3 h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-end border-b pb-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (drawerHeight === 'half') setDrawerHeight('collapsed');
                  else setDrawerHeight('half');
                }}
              >
                {drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : (drawerHeight === 'full' ? <ChevronDown className="h-6 w-6" /> : <X className="h-6 w-6 text-muted-foreground" />)}
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto mt-3">{listContent}</div>
          </div>
        </div>
      )}
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

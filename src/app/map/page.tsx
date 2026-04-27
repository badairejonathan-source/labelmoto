
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { Dealership } from '@/lib/types';
import Header, { UserMenu } from '@/components/app/header';
import { Compass, Loader2, Star, ChevronUp, ChevronDown, Sparkles, FileText, MapPin, X, Home, Bike, Wrench } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { useFirebase } from '@/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import type { LatLngBounds } from 'leaflet';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';

const brandsList = Object.keys(brandLogos);

const ads = [
  { id: 'achat-moto-occasion-guide-complet-pour-eviter-les-pieges', title: 'Achat moto d’occasion : le guide pour éviter les pièges', description: 'Apprenez à inspecter une moto, vérifier les documents et négocier.', imageUrl: '/images/evitelespieges.webp' },
  { id: 'combien-coute-vraiment-une-moto-par-mois', title: 'Combien coûte vraiment une moto par mois ?', description: 'Le budget réel d’un motard débutant : assurance, essence, entretien.', imageUrl: '/images/motard-budget-reel.webp' },
  { id: 'meilleure-moto-a2-quelle-moto-choisir-pour-debuter', title: 'Achat moto A2 : le guide des meilleures motos', description: 'Trouvez la moto idéale pour débuter selon votre gabarit et votre budget.', imageUrl: '/images/achat-occasion.webp' },
  { id: 'assurance-moto-bien-choisir-sa-formule-selon-votre-profil', title: 'Assurance moto : bien choisir sa formule', description: 'Le guide complet des formules 2026 pour motards.', imageUrl: '/images/motard-article-assurance20262.webp' },
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
      // API returns [lng, lat], Leaflet needs [lat, lng]
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
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(6.2);
  
  const [sortingAnchor, setSortingAnchor] = useState<[number, number]>([46.5, 2.2]);
  
  const [mapBoundsStr, setMapBoundsStr] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(selectedIdParam || null);
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>(null);
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
  const isMobile = (width || 1024) < 1024;

  const bottomPadding = useMemo(() => { 
    if (!isMobile || !height) return 0; 
    if (drawerHeight === 'full') return height - 160;
    return drawerHeight === 'half' ? height / 2 : 110; 
  }, [isMobile, height, drawerHeight]);

  const leftPadding = useMemo(() => {
    if (isMobile) return 0;
    return showDesktopPanel ? 520 : 0;
  }, [isMobile, showDesktopPanel]);
  
  useEffect(() => { 
    setMounted(true); 
    const timer = setTimeout(() => setShowMap(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (latParam && lngParam) {
        const pos: [number, number] = [parseFloat(latParam), parseFloat(lngParam)];
        setMapCenter(pos); setSortingAnchor(pos); setMapZoom(zoomParam ? parseInt(zoomParam) : 12);
        setSelectionSource('external');
    }
    if (selectedIdParam) {
      setSelectedDealershipId(selectedIdParam);
      setShowDesktopPanel(true);
      setSelectionSource('external');
    }
    if (searchParam) { 
      setSearchTerm(searchParam); 
      setSubmittedSearchTerm(searchParam); 
      setShowDesktopPanel(true);
      setSelectionSource('external');
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
        
        // 1. Filtrage Global (Catégorie)
        if (activeFilter) { 
            results = results.filter(d => activeFilter === 'shopping' ? (d.appSection === 'shopping' || d.appSection === 'both') : (d.appSection === 'service' || d.appSection === 'both')); 
        }

        let term = submittedSearchTerm.trim().toLowerCase();

        // --- REGLE PARIS ARRONDISSEMENTS ---
        const parisArrMatch = term.match(/paris\s*(\d{1,2})/i);
        if (parisArrMatch) {
            const arrNum = parseInt(parisArrMatch[1]);
            if (arrNum >= 1 && arrNum <= 20) {
                term = `750${arrNum.toString().padStart(2, '0')}`;
            }
        }

        if (term !== '') {
            const words = term.split(/\s+/);
            let brandFilter: string | null = null;
            let deptFilter: string | null = null;
            let zipFilter: string | null = null;
            let otherTerms: string[] = [];

            // Analyse sémantique de la requête
            for (const word of words) {
                if (/^\d{5}$/.test(word)) {
                    zipFilter = word;
                } else if (/^(\d{1,2}|2[ab])$/i.test(word)) {
                    deptFilter = word.padStart(2, '0').toUpperCase();
                } else {
                    const matchedBrand = brandsList.find(b => 
                        b.toLowerCase() === word || 
                        b.toLowerCase().includes(word)
                    );
                    if (matchedBrand) brandFilter = matchedBrand;
                    else otherTerms.push(word);
                }
            }

            // --- Actions de Positionnement Carte ---
            let coordsFound = false;

            if (zipFilter) {
                const coords = await getCityCoordinates(zipFilter);
                if (coords) {
                    setMapCenter(coords); setSortingAnchor(coords); setMapZoom(13); setSelectionSource('external');
                    coordsFound = true;
                }
            } else if (deptFilter) {
                const deptKey = Object.keys(locationsData).find(k => k.startsWith(deptFilter!));
                if (deptKey) {
                    const info = (locationsData as any)[deptKey];
                    setMapCenter(info.center); setSortingAnchor(info.center); setMapZoom(9); setSelectionSource('external');
                    coordsFound = true;
                }
            } else if (otherTerms.length > 0) {
                const cityCoords = await getCityCoordinatesByName(otherTerms.join(' '));
                if (cityCoords) {
                    setMapCenter(cityCoords); setSortingAnchor(cityCoords); setMapZoom(12); setSelectionSource('external');
                    coordsFound = true;
                }
            }

            // --- Filtrage des Résultats ---
            if (brandFilter) {
                const lowerBrand = brandFilter.toLowerCase();
                results = results.filter(d => {
                    const dealerBrands = Array.isArray(d.brands) ? d.brands.map(b => b.toLowerCase()) : [];
                    const title = (d.title || '').toLowerCase();
                    return dealerBrands.includes(lowerBrand) || title.includes(lowerBrand);
                });
            }

            // REQUÊTE UTILISATEUR : Filtrage strict par département pour éviter les numéros de rue
            if (zipFilter) {
                results = results.filter(d => d.address?.includes(zipFilter!));
            } else if (deptFilter) {
                results = results.filter(d => {
                    const address = d.address || '';
                    const zipMatch = address.match(/\b\d{5}\b/);
                    // On ne valide que si le code postal (5 chiffres) commence par le numéro de département
                    return zipMatch ? zipMatch[0].startsWith(deptFilter!) : false;
                });
            }

            if (otherTerms.length > 0 && !coordsFound) {
                const residual = otherTerms.join(' ');
                results = results.filter(d => 
                    (d.title || '').toLowerCase().includes(residual) || 
                    (d.address || '').toLowerCase().includes(residual)
                );
            }
            
            setShowDesktopPanel(true);
        }
        setFilteredDealerships(results);
    };
    processSearch();
  }, [submittedSearchTerm, allDealerships, activeFilter]);

  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: L.LatLngBounds) => { 
    setMapBoundsStr(bounds.toBBoxString()); 
    if (selectionSource === null) {
      setSortingAnchor(newCenter);
      setMapZoom(newZoom);
    }
  }, [selectionSource]);
  
  const dealershipsToDisplay = useMemo(() => {
    // Règle de priorité utilisateur : 
    // On affiche toujours ce qui est dans les bounds actuels si l'utilisateur navigue (Zoom >= 8 ou recherche active)
    if (mapZoom < 8 && submittedSearchTerm.trim() === '') {
        return [];
    }

    let results = [...filteredDealerships];
    if (mapBoundsStr) { 
        const [minLng, minLat, maxLng, maxLat] = mapBoundsStr.split(',').map(Number); 
        results = results.filter(d => d.latitude && d.longitude && d.latitude >= minLat && d.latitude <= maxLat && d.longitude >= minLng && d.longitude <= maxLat); 
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

  const onTouchStart = useCallback((e: React.TouchEvent) => { 
    touchStartY.current = e.touches[0].clientY; 
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => { 
    const diff = touchStartY.current - e.changedTouches[0].clientY; 
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setDrawerHeight(prev => prev === 'collapsed' ? 'half' : 'full');
      } else {
        setDrawerHeight(prev => prev === 'full' ? 'half' : 'collapsed');
      }
    }
  }, []);

  const listContent = (
    <div className="space-y-3 pb-20 min-h-0 custom-scrollbar">
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
      <div className="absolute inset-0 z-0">
        {showMap ? (
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
            leftPadding={leftPadding}
            isLocating={isLocating} 
            onLocateEnd={() => setIsLoadingLocating(false)} 
            onLocationFound={(coords) => { setMapCenter(coords); setSortingAnchor(coords); setMapZoom(14); setSelectionSource('external'); }} 
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/10">
                <Loader2 className="h-10 w-10 animate-spin text-brand/20" />
            </div>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 pointer-events-none z-[1200]">
        <div className="pointer-events-none relative h-screen">
          <div className="pointer-events-auto w-full">
            <Header 
                searchTerm={searchTerm} 
                onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} 
                onSearch={() => { setSubmittedSearchTerm(searchTerm); setSelectionSource('external'); }} 
                activeFilter={activeFilter} 
                onFilterChange={setActiveFilter} 
            />
          </div>
          
          <div 
            className="absolute right-6 z-[1250] flex flex-col items-center gap-2 pointer-events-auto transition-all duration-500 ease-out"
            style={{ 
              bottom: isMobile 
                ? `${bottomPadding + 20}px` 
                : '40px' 
            }}
          >
            <button 
              className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-brand hover:text-white" 
              onClick={() => setIsLoadingLocating(true)} 
              aria-label="Me localiser"
            >
              <Compass className="h-7 w-7 md:h-8 md:w-8" />
            </button>
          </div>
        </div>
      </div>

      {!isMobile && (
        <aside className={cn(
            "z-[1500] flex flex-col bg-background/95 backdrop-blur-xl border border-white/20 overflow-hidden transition-all duration-700 ease-in-out shadow-[0_20px_50px_rgba(0,0,0,0.3)] absolute top-6 left-6 w-[520px] rounded-[2.5rem]",
            showDesktopPanel 
              ? "bottom-6" 
              : "h-auto"
        )}
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="relative px-6 pt-6 pb-6 border-b border-border/50 bg-white/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex items-center justify-between gap-3 w-full mb-6">
                    <div className="w-44"><LabelMotoLogo /></div>
                    <div className="flex-1 bg-white border border-gray-100 rounded-full py-2 px-3 text-center shadow-sm">
                        <p className="text-[10px] font-black uppercase leading-tight text-foreground">Trouver une concession ?</p>
                        <p className="text-xs font-black italic text-brand leading-none tracking-tighter">FINI LA GALÈRE.</p>
                    </div>
                    <UserMenu />
                </div>

                <div className="flex items-center justify-center gap-6 w-full relative z-20">
                    <button 
                        onClick={() => setActiveFilter('shopping')}
                        className={cn(
                            "h-20 w-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[4px] group",
                            activeFilter === 'shopping' 
                            ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                            : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10"
                        )}
                    >
                        <Bike className={cn("h-7 w-7 transition-colors", activeFilter === 'shopping' ? "text-white" : "text-brand group-hover:text-white")} />
                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none mt-1 transition-colors">Concession</span>
                    </button>
                    <button 
                        onClick={() => setActiveFilter(null)}
                        className={cn(
                            "h-20 w-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[4px] group",
                            activeFilter === null 
                            ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                            : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10"
                        )}
                    >
                        <Home className={cn("h-7 w-7 transition-colors", activeFilter === null ? "text-white" : "text-brand group-hover:text-white")} />
                        <span className="text-[11px] font-black uppercase tracking-widest mt-1 transition-colors">Tout</span>
                    </button>
                    <button 
                        onClick={() => setActiveFilter('service')}
                        className={cn(
                            "h-20 w-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[4px] group",
                            activeFilter === 'service' 
                            ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                            : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10"
                        )}
                    >
                        <Wrench className={cn("h-7 w-7 transition-colors", activeFilter === 'service' ? "text-white" : "text-brand group-hover:text-white")} />
                        <span className="text-[11px] font-black uppercase tracking-widest mt-1 transition-colors">Atelier</span>
                    </button>
                </div>
                
                <button 
                  className="absolute top-2 right-2 rounded-full h-8 w-8 hover:bg-muted z-30 flex items-center justify-center" 
                  onClick={() => setShowDesktopPanel(!showDesktopPanel)}
                >
                    {showDesktopPanel ? (
                      <X className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-brand animate-bounce" />
                    )}
                </button>
            </div>
            <div className={cn(
                "flex-1 overflow-y-auto p-4 custom-scrollbar relative z-0 transition-opacity duration-300 min-h-0",
                !showDesktopPanel ? "hidden" : "opacity-100"
            )}>
                {listContent}
            </div>
        </aside>
      )}

      {isMobile && (
        <div 
          className={cn(
            "fixed left-0 right-0 bg-background rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out border-t flex flex-col", 
            drawerHeight === 'collapsed' ? 'bottom-0 h-[110px] z-[1100]' : 
            drawerHeight === 'half' ? 'bottom-0 h-[50vh] z-[1100]' : 
            'bottom-0 h-[calc(100vh-160px)] z-[1300]'
          )}
          onPointerDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div 
            onTouchStart={onTouchStart} 
            onTouchEnd={onTouchEnd}
            className="cursor-grab active:cursor-grabbing pointer-events-auto shrink-0 bg-white rounded-t-[2.5rem]"
          >
            <div className="relative w-full flex flex-col items-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-muted rounded-full mb-2" />
            </div>

            <div className="px-5 pt-2 pb-8 border-b border-border/50">
              <div className="relative flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <button 
                      onClick={(e) => { e.stopPropagation(); setActiveFilter('shopping'); }}
                      className={cn(
                          "h-[62px] w-[62px] rounded-full flex flex-col items-center justify-center shadow-sm transition-all border-2",
                          activeFilter === 'shopping' 
                            ? "bg-brand text-white border-white scale-105" 
                            : "bg-white text-muted-foreground border-transparent"
                      )}
                  >
                      <Bike className="h-5 w-5" />
                      <span className="text-[7px] font-black uppercase mt-0.5">Concession</span>
                  </button>
                  <button 
                      onClick={(e) => { e.stopPropagation(); setActiveFilter(null); }}
                      className={cn(
                          "h-[62px] w-[62px] rounded-full flex flex-col items-center justify-center shadow-sm transition-all border-2",
                          activeFilter === null 
                            ? "bg-brand text-white border-white scale-105" 
                            : "bg-white text-muted-foreground border-transparent"
                      )}
                  >
                      <Home className="h-5 w-5" />
                      <span className="text-[7px] font-black uppercase mt-0.5">Tout</span>
                  </button>
                  <button 
                      onClick={(e) => { e.stopPropagation(); setActiveFilter('service'); }}
                      className={cn(
                          "h-[62px] w-[62px] rounded-full flex flex-col items-center justify-center shadow-sm transition-all border-2",
                          activeFilter === 'service' 
                            ? "bg-brand text-white border-white scale-105" 
                            : "bg-white text-muted-foreground border-transparent"
                      )}
                  >
                      <Wrench className="h-5 w-5" />
                      <span className="text-[7px] font-black uppercase mt-0.5">Atelier</span>
                  </button>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <button 
                    className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-muted" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (drawerHeight !== 'collapsed') setDrawerHeight('collapsed');
                      else setDrawerHeight('half');
                    }}
                  >
                    {drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : (drawerHeight === 'full' ? <ChevronDown className="h-6 w-6" /> : <X className="h-6 w-6 text-muted-foreground" />)}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto mt-3 px-3 min-h-0 custom-scrollbar">
            {listContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MapPage() { 
  return (
    <Suspense fallback={<div className="flex h-screen w-full flex-col items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}>
      <MapPageComponent />
    </Suspense>
  ); 
}

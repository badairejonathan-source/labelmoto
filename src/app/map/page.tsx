'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCard from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { Dealership } from '@/lib/types';
import Header, { UserMenu } from '@/components/app/header';
import { Compass, Loader2, Star, ChevronUp, ChevronDown, Sparkles, FileText, MapPin, X, Home, Bike, Wrench, Users, Flag } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { useFirebase } from '@/firebase';
import { collection, getDocs } from "firebase/firestore";
import type { LatLngBounds } from 'leaflet';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';
import { toast } from '@/hooks/use-toast';

const brandsList = Object.keys(brandLogos);

const CIRCUIT_BUGATTI: Dealership = {
  id: 'circuit-bugatti-le-mans',
  placeUrl: 'https://maps.app.goo.gl/nuDwNWpyQLEp7boF8',
  title: 'Circuit Bugatti - Le Mans',
  address: 'Place Luigi Chinetti, 72000 Le Mans, France',
  website: 'https://www.lemans.org/',
  phoneNumber: '02 43 40 24 24',
  email: 'pole@lemans.org',
  imgUrl: '/images/apercucartezoom.webp',
  mardi: '09:00 - 18:00',
  mercredi: '09:00 - 18:00',
  jeudi: '09:00 - 18:00',
  vendredi: '09:00 - 18:00',
  samedi: '09:00 - 18:00',
  dimanche: '09:00 - 18:00',
  lundi: '09:00 - 18:00',
  latitude: 47.9546,
  longitude: 0.2078,
  rating: '5.0',
  category: 'Circuit',
  appSection: 'both',
  brands: ['Événements Sportifs'],
};

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
  const touchStartY = useRef<number>(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<'shopping' | 'service' | 'association' | null>(() => {
    if (filterParam === 'service') return 'service';
    if (filterParam === 'shopping') return 'shopping';
    if (filterParam === 'association') return 'association';
    return null;
  });

  const { width, height } = useWindowSize();
  const isMobile = mounted && width !== undefined && width < 1024;

  const leftPadding = isMobile ? 0 : 540;
  const bottomPadding = isMobile ? (drawerHeight === 'full' ? (height || 800) - 160 : (drawerHeight === 'half' ? (height || 800) / 2 : 110)) : 0;
  
  useEffect(() => { 
    setMounted(true); 
    const timer = setTimeout(() => setShowMap(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedDealershipId && listContainerRef.current) {
      listContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedDealershipId]);

  useEffect(() => {
    if (latParam && lngParam) {
        const pos: [number, number] = [parseFloat(latParam), parseFloat(lngParam)];
        setMapCenter(pos); setSortingAnchor(pos); setMapZoom(zoomParam ? parseInt(zoomParam) : 12);
        setSelectionSource('external');
    }
    if (selectedIdParam) {
      setSelectedDealershipId(selectedIdParam);
      setSelectionSource('external');
    }
    if (searchParam) { 
      setSearchTerm(searchParam); 
      setSubmittedSearchTerm(searchParam); 
      setSelectionSource('external');
    }
  }, [latParam, lngParam, zoomParam, selectedIdParam, searchParam]);

  // OPTIMISATION: Passage de onSnapshot à getDocs pour économiser le quota
  useEffect(() => {
    if (!firestore || !mounted) return;
    setIsLoading(true);
    
    const fetchData = async () => {
      try {
        const collectionsList = ['concessions', 'associations'];
        const resultsMap: Record<string, Dealership[]> = {};

        for (const colName of collectionsList) {
          const snapshot = await getDocs(collection(firestore, colName));
          resultsMap[colName] = snapshot.docs.map(doc => ({
            id: doc.id,
            firestoreCollection: colName,
            ...doc.data(),
            latitude: doc.data().latitude ? parseFloat(String(doc.data().latitude).replace(',', '.')) : undefined,
            longitude: doc.data().longitude ? parseFloat(String(doc.data().longitude).replace(',', '.')) : undefined,
          } as Dealership));
        }

        const merged = [CIRCUIT_BUGATTI, ...Object.values(resultsMap).flat()];
        setAllDealerships(merged);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des points:", err);
        if (err.code === 'resource-exhausted') {
          toast({
            variant: "destructive",
            title: "Quota Firestore dépassé",
            description: "La plateforme a atteint sa limite quotidienne gratuite. Les données seront de nouveau disponibles demain.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [firestore, mounted]);

  useEffect(() => {
    const processSearch = async () => {
        let results = [...allDealerships];
        let term = submittedSearchTerm.trim().toLowerCase();

        const assoKeywords = ["association", "associations", "asso"];
        const foundAssoKeyword = assoKeywords.find(k => term.includes(k));
        
        if (foundAssoKeyword) {
            if (activeFilter !== 'association') {
                setActiveFilter('association');
            }
            term = term.replace(foundAssoKeyword, '').trim();
        }

        const currentFilter = foundAssoKeyword ? 'association' : activeFilter;
        
        if (currentFilter) { 
            results = results.filter(d => {
                if (currentFilter === 'shopping') return d.appSection === 'shopping' || d.appSection === 'both';
                if (currentFilter === 'service') return d.appSection === 'service' || d.appSection === 'both';
                if (currentFilter === 'association') return d.appSection === 'association' || d.category === 'Association motarde';
                return true;
            });
        }
        
        const parisArrMatch = term.match(/paris\s*(\d{1,2})/i);
        if (parisArrMatch) {
            const arrNum = parseInt(parisArrMatch[1]);
            if (arrNum >= 1 && arrNum <= 20) term = `750${arrNum.toString().padStart(2, '0')}`;
        }

        if (term !== '') {
            const words = term.split(/\s+/);
            let brandFilter: string | null = null;
            let deptFilter: string | null = null;
            let zipFilter: string | null = null;
            let otherTerms: string[] = [];

            for (const word of words) {
                if (/^\d{5}$/.test(word)) zipFilter = word;
                else if (/^(\d{1,2}|2[ab])$/i.test(word)) deptFilter = word.padStart(2, '0').toUpperCase();
                else {
                    const matchedBrand = brandsList.find(b => b.toLowerCase() === word || b.toLowerCase().includes(word));
                    if (matchedBrand) brandFilter = matchedBrand;
                    else otherTerms.push(word);
                }
            }

            if (zipFilter) {
                const coords = await getCityCoordinates(zipFilter);
                if (coords) { setMapCenter(coords); setSortingAnchor(coords); setMapZoom(12); setSelectionSource('external'); }
            } else if (deptFilter) {
                const deptKey = Object.keys(locationsData).find(k => k.startsWith(deptFilter!));
                if (deptKey) {
                    const info = (locationsData as any)[deptKey];
                    setMapCenter(info.center); setSortingAnchor(info.center); setMapZoom(9); setSelectionSource('external');
                }
            } else if (otherTerms.length > 0) {
                const cityCoords = await getCityCoordinatesByName(otherTerms.join(' '));
                if (cityCoords) { setMapCenter(cityCoords); setSortingAnchor(cityCoords); setMapZoom(12); setSelectionSource('external'); }
            }

            if (brandFilter) {
                const lowerBrand = brandFilter.toLowerCase();
                results = results.filter(d => {
                    const dealerBrands = Array.isArray(d.brands) ? d.brands.map(b => b.toLowerCase()) : [];
                    return dealerBrands.includes(lowerBrand) || (d.title || '').toLowerCase().includes(lowerBrand);
                });
            }

            if (zipFilter) results = results.filter(d => d.address?.includes(zipFilter!));
            else if (deptFilter) results = results.filter(d => {
                const zipMatch = (d.address || '').match(/\b\d{5}\b/);
                return zipMatch ? zipMatch[0].startsWith(deptFilter!) : false;
            });

            if (otherTerms.length > 0) {
                const residual = otherTerms.join(' ');
                results = results.filter(d => (d.title || '').toLowerCase().includes(residual) || (d.address || '').toLowerCase().includes(residual));
            }
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
    if (mapZoom < 8 && submittedSearchTerm.trim() === '') return [];
    let results = [...filteredDealerships];
    if (mapBoundsStr) { 
        const [minLng, minLat, maxLng, maxLat] = mapBoundsStr.split(',').map(Number); 
        results = results.filter(d => d.latitude && d.longitude && d.latitude >= minLat && d.latitude <= maxLat && d.longitude >= minLng && d.longitude <= maxLat); 
    }
    
    results.sort((a, b) => getDistanceSq(sortingAnchor, a) - getDistanceSq(sortingAnchor, b));

    if (selectedDealershipId) {
      const selectedIndex = results.findIndex(d => d.id === selectedDealershipId);
      if (selectedIndex > 0) {
        const [selectedItem] = results.splice(selectedIndex, 1);
        results.unshift(selectedItem);
      }
    }

    return results.slice(0, 20);
  }, [filteredDealerships, mapBoundsStr, sortingAnchor, mapZoom, submittedSearchTerm, selectedDealershipId]);

  const handleCardClick = useCallback((dealership: Dealership) => { 
    setSelectedDealershipId(dealership.id); setSelectionSource('card'); 
    if (dealership.latitude && dealership.longitude) { 
      setMapCenter([dealership.latitude, dealership.longitude]); setMapZoom(12); 
      if (isMobile) setDrawerHeight('half'); 
    } 
  }, [isMobile]);

  const handleMarkerClick = useCallback((id: string) => { 
    setSelectedDealershipId(id); setSelectionSource('marker');
    const dealer = allDealerships.find(d => d.id === id); 
    if (dealer && dealer.latitude && dealer.longitude) { setMapCenter([dealer.latitude, dealer.longitude]); setSortingAnchor([dealer.latitude, dealer.longitude]); setMapZoom(12); } 
    if (isMobile) setDrawerHeight('half'); 
  }, [isMobile, allDealerships]);

  const handleUserMapInteraction = useCallback(() => { 
    if (isMobile) setDrawerHeight('collapsed'); 
    setSelectionSource(null);
  }, [isMobile]);

  const listContent = (
    <div className="space-y-3 pb-20 custom-scrollbar">
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
                        <div className="flex items-center gap-2 mb-4"><Sparkles className="h-5 w-5 text-brand animate-pulse" /><h3 className="text-sm font-black uppercase tracking-widest text-foreground">Guides & Conseils</h3></div>
                        <div className="space-y-4">{ads.map((ad, idx) => <AdCard key={ad.id} article={ad} isPublicity={idx === 0} />)}</div>
                    </div>
                    <div className="p-8 border-2 border-dashed rounded-[2.5rem] text-center bg-muted/5"><FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" /><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-snug">Plus de 3000 établissements référencés.<br/><span className="text-brand">Zoomez sur la carte pour les afficher.</span></p></div>
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
                <div className="text-center py-20 opacity-50"><MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" /><p className="font-black uppercase tracking-widest text-xs">Aucun établissement dans cette zone</p></div>
            )}
        </>
      )}
    </div>
  );

  if (!mounted || width === undefined) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background flex flex-col md:flex-row">
      
      <div className="absolute inset-0 z-0 h-full w-full">
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
            leftPadding={isMobile ? 0 : leftPadding} 
            isLocating={isLocating} 
            onLocateEnd={() => setIsLoadingLocating(false)} 
            onLocationFound={(coords) => { setMapCenter(coords); setSortingAnchor(coords); setMapZoom(12); setSelectionSource('external'); }} 
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/10"><Loader2 className="h-10 w-10 animate-spin text-brand/20" /></div>
        )}
      </div>

      {!isMobile && (
        <aside className="absolute top-6 left-6 bottom-6 w-[520px] flex flex-col bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[100] border border-white/40 overflow-hidden">
            <div className="p-8 pb-4 shrink-0">
                <div className="flex items-center justify-between gap-4 w-full mb-8">
                    <div className="w-40"><LabelMotoLogo noBubble /></div>
                    <div className="flex flex-col items-center justify-center text-center px-2">
                        <p className="text-[10px] font-black uppercase tracking-tight text-foreground leading-none">
                            TROUVER UNE CONCESSION ?
                        </p>
                        <p className="text-[12px] font-black italic text-brand mt-1 leading-none tracking-tighter">
                            FINI LA GALÈRE.
                        </p>
                    </div>
                    <UserMenu />
                </div>

                <div className="flex items-center justify-center gap-4 w-full py-4 mb-6">
                    <button onClick={() => setActiveFilter('shopping')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'shopping' ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}>
                        <Bike className={cn("h-6 w-6", activeFilter === 'shopping' ? "text-white" : "text-brand")} />
                        <span className="text-[8px] font-black uppercase mt-0.5">Concession</span>
                    </button>
                    <button onClick={() => setActiveFilter(null)} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === null ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}>
                        <Home className={cn("h-6 w-6", activeFilter === null ? "text-white" : "text-brand")} />
                        <span className="text-[8px] font-black uppercase mt-0.5">Tout</span>
                    </button>
                    <button onClick={() => setActiveFilter('service')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'service' ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}>
                        <Wrench className={cn("h-6 w-6", activeFilter === 'service' ? "text-white" : "text-brand")} />
                        <span className="text-[8px] font-black uppercase mt-0.5">Atelier</span>
                    </button>
                    <button onClick={() => setActiveFilter('association')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'association' ? "bg-indigo-600 text-white border-white scale-110 shadow-indigo-600/40" : "bg-white text-muted-foreground border-transparent hover:border-indigo-600/20 hover:scale-105")}>
                        <Users className={cn("h-6 w-6", activeFilter === 'association' ? "text-white" : "text-indigo-600")} />
                        <span className="text-[8px] font-black uppercase mt-0.5 text-center leading-tight">Asso moto</span>
                    </button>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent mb-4" />
            </div>
            <div ref={listContainerRef} className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                {listContent}
            </div>
        </aside>
      )}

      {!isMobile && (
        <div className="absolute top-8 right-8 left-[580px] z-[100] flex justify-end pointer-events-none">
            <div className="w-full max-w-2xl pointer-events-auto">
                <Header 
                    searchTerm={searchTerm} 
                    onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} 
                    onSearch={() => { setSubmittedSearchTerm(searchTerm); setSelectionSource('external'); }} 
                    activeFilter={activeFilter} 
                    onFilterChange={setActiveFilter} 
                    variant="map"
                    hideUserMenu={true}
                />
            </div>
        </div>
      )}

      {isMobile && (
        <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
          <div className="pointer-events-auto">
            <Header 
                searchTerm={searchTerm} 
                onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} 
                onSearch={() => { setSubmittedSearchTerm(searchTerm); setSelectionSource('external'); }} 
                activeFilter={activeFilter} 
                onFilterChange={setActiveFilter} 
            />
          </div>
        </div>
      )}

      <button 
        className="absolute right-6 bottom-32 md:bottom-10 z-[500] h-12 w-12 md:h-14 md:w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-brand hover:text-white" 
        onClick={() => setIsLoadingLocating(true)} 
        aria-label="Me localiser"
      >
        <Compass className="h-7 w-7 md:h-8 md:w-8" />
      </button>

      {isMobile && (
        <div className={cn("fixed left-0 right-0 bg-background rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out border-t flex flex-col z-[1100]", drawerHeight === 'collapsed' ? 'bottom-0 h-[110px]' : drawerHeight === 'half' ? 'bottom-0 h-[50vh]' : 'bottom-0 h-[calc(100vh-160px)]')}>
          <div 
            onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }} 
            onTouchEnd={(e) => { const diff = touchStartY.current - e.changedTouches[0].clientY; if (Math.abs(diff) > 40) setDrawerHeight(diff > 0 ? (drawerHeight === 'collapsed' ? 'half' : 'full') : (drawerHeight === 'full' ? 'half' : 'collapsed')); }}
            className="cursor-grab active:cursor-grabbing bg-white rounded-t-[2.5rem] shrink-0"
          >
            <div className="relative w-full flex flex-col items-center pt-3 pb-1"><div className="w-12 h-1.5 bg-muted rounded-full mb-2" /></div>
            <div className="px-5 pt-2 pb-6 border-b border-border/50">
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setActiveFilter('shopping')} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2", activeFilter === 'shopping' ? "bg-brand text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Bike className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5">Concession</span></button>
                <button onClick={() => setActiveFilter(null)} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2", activeFilter === null ? "bg-brand text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Home className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5">Tout</span></button>
                <button onClick={() => setActiveFilter('service')} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2", activeFilter === 'service' ? "bg-brand text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Wrench className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5">Atelier</span></button>
                <button onClick={() => setActiveFilter('association')} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2", activeFilter === 'association' ? "bg-indigo-600 text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Users className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5 text-center leading-none">Asso</span></button>
                <button className="ml-1 rounded-full h-10 w-10 flex items-center justify-center hover:bg-muted" onClick={() => setDrawerHeight(drawerHeight === 'collapsed' ? 'half' : 'collapsed')}>{drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}</button>
              </div>
            </div>
          </div>
          <div ref={listContainerRef} className="flex-1 overflow-y-auto px-3 custom-scrollbar">{listContent}</div>
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

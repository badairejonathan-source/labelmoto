
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
import { collection, onSnapshot } from "firebase/firestore";
import type { LatLngBounds } from 'leaflet';
import { useSearchParams, useRouter } from 'next/navigation';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';

const brandsList = Object.keys(brandLogos);

const ads = [
  { id: '5', title: 'Achat moto d’occasion : le guide pour éviter les pièges', description: 'Apprenez à inspecter une moto, vérifier les documents et négocier.', imageUrl: '/images/evitelespieges.jpg' },
  { id: '4', title: 'Combien coûte vraiment une moto par mois ?', description: 'Le budget réel d’un motard débutant : assurance, essence, entretien.', imageUrl: 'https://images.unsplash.com/photo-1572452571879-3d67d5b2a39f?q=80&w=1080' },
  { id: '6', title: 'Achat moto A2 : le guide des meilleures motos', description: 'Trouvez la moto idéale pour débuter selon votre gabarit et votre budget.', imageUrl: '/images/achat-occasion.jpg' },
  { id: 'entretien-moto-intervalles-prix-conseils-par-modele', title: 'Guide d\'entretien & révisions', description: 'Tous les intervalles et prix estimés pour votre modèle de moto.', imageUrl: 'https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop' },
];

const MapComponent = dynamic(() => import('@/components/app/map-component'), { 
  ssr: false,
  loading: () => (<div className="w-full h-full flex items-center justify-center bg-muted/20"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>)
});

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
                <Button size="sm" variant="ghost" onClick={() => onChange(0)} className={cn("rounded-full px-3 text-[10px] font-bold h-7 transition-all duration-200", value === 0 ? "bg-brand text-brand-foreground shadow-sm" : "hover:bg-muted")}>TOUS</Button>
                {ratings.map((rating) => (
                    <Button key={rating} size="sm" variant="ghost" onClick={() => onChange(value === rating ? 0 : rating)} className={cn("flex gap-1 rounded-full px-2.5 text-[10px] font-bold h-7 transition-all duration-200", value === rating ? "bg-brand text-brand-foreground shadow-sm" : "hover:bg-muted")}>
                        <span>{rating}</span><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="hidden sm:inline-block">+</span>
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
  const [mapZoom, setMapZoom] = useState(6);
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

  const listContainerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const isMobile = (width || 1024) < 768;

  const hasInitializedMap = useRef(false);

  const bottomPadding = useMemo(() => {
    if (!isMobile || !height) return 0;
    return drawerHeight === 'half' ? height / 2 : 70;
  }, [isMobile, height, drawerHeight]);

  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => {
    if (latParam && lngParam) {
        const pos: [number, number] = [parseFloat(latParam), parseFloat(lngParam)];
        setMapCenter(pos);
        setSortingAnchor(pos);
        setMapZoom(zoomParam ? parseInt(zoomParam) : 12);
        hasInitializedMap.current = true;
    } else if (!hasInitializedMap.current && !searchParam) {
        setMapCenter([46.603354, 1.888334]);
        setSortingAnchor([46.603354, 1.888334]);
        setMapZoom(6);
        hasInitializedMap.current = true;
    }
    if (selectedIdParam) setSelectedDealershipId(selectedIdParam);
    if (searchParam) {
        setSearchTerm(searchParam);
        setSubmittedSearchTerm(searchParam);
        hasInitializedMap.current = true;
    }
  }, [latParam, lngParam, zoomParam, selectedIdParam, searchParam]);

  useEffect(() => {
    if (!firestore || !mounted) return;
    const dealershipsRef = collection(firestore, 'concessions');
    return onSnapshot(dealershipsRef, (snapshot) => {
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            latitude: doc.data().latitude ? parseFloat(String(doc.data().latitude).replace(',', '.')) : undefined,
            longitude: doc.data().longitude ? parseFloat(String(doc.data().longitude).replace(',', '.')) : undefined,
        } as Dealership));
        setAllDealerships(results);
        setIsLoading(false);
    }, () => setIsLoading(false));
  }, [firestore, mounted]);

  useEffect(() => {
    const processSearch = async () => {
        let results = [...allDealerships];
        if (activeFilter) {
            results = results.filter(d => activeFilter === 'shopping' ? (d.appSection === 'shopping' || d.appSection === 'both') : (d.appSection === 'service' || d.appSection === 'both'));
        }
        if (submittedSearchTerm.trim() !== '') {
            const lower = submittedSearchTerm.toLowerCase().trim();
            const normalizedSearch = lower.replace(/[\s-]/g, '');
            if (/^\d{2}$/.test(normalizedSearch)) {
                const deptKey = Object.keys(locationsData).find(k => k.startsWith(normalizedSearch));
                if (deptKey) { 
                    const center = (locationsData as any)[deptKey].center;
                    setMapCenter(center); 
                    setSortingAnchor(center);
                    setMapZoom(9); 
                }
                results = results.filter(d => d.address?.match(/\b\d{5}\b/)?.[0].startsWith(normalizedSearch));
            } else if (/^\d{5}$/.test(normalizedSearch)) {
                const coords = await getCityCoordinates(normalizedSearch);
                if (coords) { 
                    setMapCenter(coords); 
                    setSortingAnchor(coords);
                    setMapZoom(13); 
                    results = results.filter(d => d.address?.includes(normalizedSearch)); 
                }
            } else {
                let detectedBrand = '';
                const sortedBrands = [...brandsList].sort((a, b) => b.length - a.length);
                for (const brand of sortedBrands) {
                    const normalizedBrand = brand.toLowerCase().replace(/[\s-]/g, '');
                    if (normalizedSearch.includes(normalizedBrand)) { detectedBrand = brand; break; }
                }
                if (detectedBrand) {
                    results = results.filter(d => d.brands?.some(b => String(b).toLowerCase().includes(detectedBrand.toLowerCase())) || d.title?.toLowerCase().includes(detectedBrand.toLowerCase()));
                } else {
                    const cityCoords = await getCityCoordinatesByName(lower);
                    if (cityCoords) { 
                        setMapCenter(cityCoords); 
                        setSortingAnchor(cityCoords);
                        setMapZoom(12); 
                        results = results.filter(d => d.address?.toLowerCase().includes(lower)); 
                    }
                    else results = results.filter(d => d.title?.toLowerCase().includes(lower) || d.address?.toLowerCase().includes(lower));
                }
            }
        }
        if (ratingFilter > 0) results = results.filter(d => (parseFloat(String(d.rating).replace(',', '.')) || 0) >= ratingFilter);
        setFilteredDealerships(results);
    };
    processSearch();
}, [submittedSearchTerm, allDealerships, activeFilter, ratingFilter]);

  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: LatLngBounds) => {
    setMapBoundsStr(bounds.toBBoxString());
    setMapCenter(newCenter);
    setMapZoom(newZoom);
    
    // Si l'utilisateur déplace la carte manuellement (pas de source de sélection active),
    // on met à jour l'ancre de tri pour que la liste s'actualise.
    if (!selectionSource) {
        setSortingAnchor(newCenter);
    }
  }, [selectionSource]);
  
  const dealershipsToDisplay = useMemo(() => {
    let results = [...filteredDealerships];
    if (mapBoundsStr) {
        const [minLng, minLat, maxLng, maxLat] = mapBoundsStr.split(',').map(Number);
        results = results.filter(d => d.latitude && d.longitude && d.latitude >= minLat && d.latitude <= maxLat && d.longitude >= minLng && d.longitude <= maxLng);
    }

    // Si on a cliqué sur un marqueur, on force l'élément sélectionné en haut et on trie le reste par rapport à lui
    if (selectionSource === 'marker' && selectedDealershipId) {
        const selected = results.find(d => d.id === selectedDealershipId);
        if (selected && selected.latitude && selected.longitude) {
            const others = results.filter(d => d.id !== selectedDealershipId);
            others.sort((a, b) => getDistanceSq(sortingAnchor, a) - getDistanceSq(sortingAnchor, b));
            return [selected, ...others].slice(0, 30);
        }
    }

    // Tri par rapport à l'ancre (centre de la dernière vue manuelle ou recherche)
    // Cela permet au clic sur une fiche de ne pas changer l'ordre (car l'ancre ne change pas)
    return results.sort((a, b) => getDistanceSq(sortingAnchor, a) - getDistanceSq(sortingAnchor, b)).slice(0, 30);
  }, [filteredDealerships, mapBoundsStr, sortingAnchor, selectionSource, selectedDealershipId]);

  const handleCardClick = useCallback((dealership: Dealership) => {
    setSelectedDealershipId(dealership.id);
    setSelectionSource('card'); // On enregistre que le clic vient de la liste
    if (dealership.latitude && dealership.longitude) {
      setMapCenter([dealership.latitude, dealership.longitude]);
      // On ne met PAS à jour sortingAnchor ici pour garder l'ordre actuel de la liste
      setMapZoom(14);
      if (isMobile) setDrawerHeight('half');
    }
  }, [isMobile]);
  
  const handleMarkerClick = useCallback((id: string) => {
    setSelectedDealershipId(id);
    setSelectionSource('marker'); // On enregistre que le clic vient de la carte
    const dealer = allDealerships.find(d => d.id === id);
    if (dealer && dealer.latitude && dealer.longitude) {
        const pos: [number, number] = [dealer.latitude, dealer.longitude];
        setMapCenter(pos);
        setSortingAnchor(pos); // Pour un marqueur, il devient la nouvelle ancre de proximité
        setMapZoom(14);
    }
    if (isMobile) setDrawerHeight('half');
  }, [isMobile, allDealerships]);

  const handleUserMapInteraction = useCallback(() => {
    if (isMobile) {
      setDrawerHeight('collapsed');
    }
    setSelectionSource(null); // On reset la source lors d'une interaction manuelle
  }, [isMobile]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) setDrawerHeight(diff > 0 ? 'half' : 'collapsed');
  };

  const listContent = (
    <div className="space-y-3 pb-20">
      {isLoading ? (<div className="text-center pt-10"><Loader2 className="mx-auto h-8 w-8 animate-spin text-brand" /></div>) : (
        <>
          {dealershipsToDisplay.map((dealer, index) => (
            <React.Fragment key={dealer.id}>
              <div onMouseEnter={() => setHoveredDealershipId(dealer.id)} onMouseLeave={() => setHoveredDealershipId(null)}>
                <DealershipCard dealership={dealer} onClick={() => handleCardClick(dealer)} className={cn(dealer.id === selectedDealershipId && "ring-2 ring-brand")} />
              </div>
              {(index + 1) % 4 === 0 && (
                <div className="my-3">
                  <AdCard article={ads[Math.floor(index / 4) % ads.length]} />
                </div>
              )}
            </React.Fragment>
          ))}
          {dealershipsToDisplay.length === 0 && <div className="text-center py-10 text-muted-foreground"><p className="font-bold uppercase text-[10px]">Aucun établissement visible ici.</p></div>}
        </>
      )}
    </div>
  );

  if (!mounted || width === undefined) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-background">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => setSubmittedSearchTerm(searchTerm)} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <div className="flex-1 flex overflow-hidden relative">
        {!isMobile ? (
          <>
            <aside className="w-3/4 flex flex-col border-r h-full bg-muted/5"><RatingFilter value={ratingFilter} onChange={setRatingFilter} /><div className="flex-1 overflow-y-auto p-3" ref={listContainerRef}>{listContent}</div></aside>
            <main className="w-1/4 relative"><MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} hoveredDealershipId={hoveredDealershipId} selectedDealershipId={selectedDealershipId} onMarkerClick={handleMarkerClick} onMarkerMouseOver={setHoveredDealershipId} onMarkerMouseOut={() => setHoveredDealershipId(null)} onMapChange={handleMapChange} onMapClick={handleUserMapInteraction} onUserInteraction={handleUserMapInteraction} isLocating={isLocating} onLocateEnd={() => setIsLoadingLocating(false)} /><Button size="icon" className="absolute top-3 right-3 z-[1000] rounded-full bg-brand text-white shadow-xl" onClick={() => setIsLoadingLocating(true)}><Crosshair className="h-4 w-4" /></Button></main>
          </>
        ) : (
          <>
            <main className="absolute inset-0 h-full w-full"><MapComponent dealerships={filteredDealerships} center={mapCenter} zoom={mapZoom} hoveredDealershipId={hoveredDealershipId} selectedDealershipId={selectedDealershipId} onMarkerClick={handleMarkerClick} onMarkerMouseOver={setHoveredDealershipId} onMarkerMouseOut={() => setHoveredDealershipId(null)} onMapChange={handleMapChange} onMapClick={handleUserMapInteraction} onUserInteraction={handleUserMapInteraction} bottomPadding={bottomPadding} isLocating={isLocating} onLocateEnd={() => setIsLoadingLocating(false)} /><Button size="icon" className="absolute top-2 right-2 z-[1000] rounded-full bg-brand text-white shadow-xl" onClick={() => setIsLoadingLocating(true)}><Crosshair className="h-4 w-4" /></Button></main>
            <div className={cn("fixed left-0 right-0 bg-background rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-50 transition-all duration-500 ease-out border-t", drawerHeight === 'collapsed' ? 'bottom-0 h-[70px]' : 'bottom-0 h-[50vh]')}>
              <div className="relative w-full flex flex-col items-center pt-3 pb-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}><div className="w-12 h-1.5 bg-muted rounded-full mb-2" /></div>
              <div className="px-3 h-full flex flex-col overflow-hidden"><div className="flex items-center justify-between border-b pb-2"><RatingFilter value={ratingFilter} onChange={setRatingFilter} className="flex-1" /><Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground" onClick={() => setDrawerHeight(drawerHeight === 'collapsed' ? 'half' : 'collapsed')}>{drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}</Button></div><div className="flex-1 overflow-y-auto mt-3" ref={listContainerRef}>{listContent}</div></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><MapPageComponent /></Suspense>;
}

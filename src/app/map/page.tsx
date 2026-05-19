'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCardItem from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { MapPoint, Dealership } from '@/lib/types';
import Header, { UserMenu } from '@/components/app/header';
import { Compass, Loader2, ChevronUp, ChevronDown, Sparkles, MapPin, Home, Bike, Wrench, Users, Utensils, ArrowLeft, Phone, Globe, Clock, ExternalLink } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn, levenshteinDistance } from "@/lib/utils";
import { useFirebase } from '@/firebase';
import { collection, getDocs, query, limit, where, orderBy, startAt, endAt, doc } from "firebase/firestore";
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import locationsData from '@/data/locations.json';
import { extractValidCoordinates, getGeohashCells } from '@/lib/geohash';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useMemoFirebase } from '@/firebase/provider';

const CIRCUIT_BUGATTI: MapPoint = {
  id: 'circuit-bugatti-le-mans',
  title: 'Circuit Bugatti - Le Mans',
  latitude: 47.9546,
  longitude: 0.2078,
  category: 'Circuit',
  appSection: 'both',
  slug: 'circuit-bugatti-le-mans'
};

const ZOOM_THRESHOLD = 8.0; 
const OVERVIEW_LIMIT = 6000; 

const MOTORCYCLE_BRANDS = [
  'honda', 'yamaha', 'bmw', 'kawasaki', 'suzuki', 'ducati', 'ktm', 'triumph', 
  'harley-davidson', 'harley', 'royal enfield', 'cfmoto', 'piaggio', 'peugeot', 
  'aprilia', 'moto guzzi', 'indian', 'husqvarna', 'benelli', 'mash', 'voge'
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

// Composant interne pour l'affichage détaillé dans la barre latérale
const SidebarDetailView = ({ dealershipId, point, onBack }: { dealershipId: string, point?: MapPoint, onBack: () => void }) => {
  const { firestore } = useFirebase();
  const colName = point?.appSection === 'association' ? 'associations' : (point?.appSection === 'relais' ? 'relais' : 'concessions');
  const docRef = useMemoFirebase(() => doc(firestore, colName, dealershipId), [firestore, colName, dealershipId]);
  const { data: pro, isLoading } = useDoc<Dealership>(docRef);

  if (isLoading) return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={onBack} className="p-0 font-black uppercase text-[10px] tracking-widest mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );

  if (!pro) return (
    <div className="p-6 text-center">
      <p className="font-black uppercase tracking-tighter mb-4">Établissement non trouvé</p>
      <Button onClick={onBack} className="bg-brand">Retour aux résultats</Button>
    </div>
  );

  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`;

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-white">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md p-4 border-b flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="font-black uppercase text-[10px] tracking-widest"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
        <Link href={`/concessions/${pro.slug || pro.id}`} className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline flex items-center gap-1.5">
          Page SEO <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="relative aspect-video w-full shrink-0">
        <Image 
          src={pro.imageUrl || pro.imgUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"} 
          alt={pro.title} 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 right-4">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">{pro.title}</h2>
          <p className="text-white/80 font-black italic text-xs md:text-sm uppercase tracking-widest">{pro.category || 'Expert moto'}</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 gap-3">
          {pro.phoneNumber && (
            <Button asChild className="h-14 rounded-xl bg-brand/5 border-2 border-brand/10 hover:bg-brand/10 text-brand shadow-none transition-all">
              <a href={`tel:${pro.phoneNumber}`} className="flex flex-col items-center justify-center gap-1">
                <Phone className="h-4 w-4" />
                <span className="text-[8px] font-black uppercase tracking-widest">Appeler</span>
              </a>
            </Button>
          )}
          {pro.website && (
            <Button asChild className="h-14 rounded-xl bg-brand/5 border-2 border-brand/10 hover:bg-brand/10 text-brand shadow-none transition-all">
              <a href={pro.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1">
                <Globe className="h-4 w-4" />
                <span className="text-[8px] font-black uppercase tracking-widest">Site Web</span>
              </a>
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-2xl border-2 border-dashed">
            <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-black text-sm uppercase tracking-tight leading-tight">{pro.address}</p>
              <Button asChild variant="link" className="p-0 h-auto text-brand font-black uppercase text-[9px] h-auto"><a href={navigationUrl} target="_blank" rel="noopener noreferrer">🔘 Itinéraire Google Maps</a></Button>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-muted/50 p-4 border-b flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            <span className="text-[10px] font-black uppercase tracking-widest">Horaires d'ouverture</span>
          </div>
          <div className="p-4 space-y-2">
            {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(day => (
              <div key={day} className="flex justify-between items-center text-xs font-bold border-b border-dashed border-muted last:border-0 pb-1.5 pt-1.5">
                <span className="capitalize text-muted-foreground">{day}</span>
                <span className="text-foreground font-black">{pro[day] || 'Fermé'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 mt-auto">
        <p className="text-[10px] text-muted-foreground font-bold italic text-center">Données certifiées Label Moto © {new Date().getFullYear()}</p>
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

  const [allPoints, setAllPoints] = useState<MapPoint[]>([CIRCUIT_BUGATTI]);
  const [filteredPoints, setFilteredPoints] = useState<MapPoint[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchParam || '');
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(6.2);
  const [targetBounds, setTargetBounds] = useState<any | null>(null);
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>('external');
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLoadingLocating] = useState(false);
  
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(selectedIdParam || null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const { firestore } = useFirebase();
  const [mounted, setMounted] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('half');
  const listContainerRef = useRef<HTMLDivElement>(null);

  const masterPointsMap = useRef<Map<string, MapPoint>>(new Map());

  const [activeFilter, setActiveFilter] = useState<'shopping' | 'service' | 'association' | 'relais' | null>(() => {
    if (filterParam === 'service') return 'service';
    if (filterParam === 'shopping') return 'shopping';
    if (filterParam === 'association') return 'association';
    if (filterParam === 'relais') return 'relais';
    return null;
  });

  const { width, height } = useWindowSize();
  const isMobile = mounted && width !== undefined && width < 1024;

  const leftPadding = isMobile ? 0 : 544;
  const bottomPadding = isMobile ? (drawerHeight === 'full' ? (height || 800) - 160 : (drawerHeight === 'half' ? (height || 800) / 2 : 110)) : 0;
  
  useEffect(() => { setMounted(true); }, []);

  // Logique de filtrage unifiée
  useEffect(() => {
    let base = Array.from(masterPointsMap.current.values());
    
    // Règle métier : TOUT = Concession + Atelier
    if (activeFilter === null) {
      base = base.filter(p => p.appSection === 'shopping' || p.appSection === 'service' || p.appSection === 'both');
    } else if (activeFilter === 'shopping') {
      base = base.filter(p => p.appSection === 'shopping' || p.appSection === 'both');
    } else if (activeFilter === 'service') {
      base = base.filter(p => p.appSection === 'service' || p.appSection === 'both');
    } else {
      base = base.filter(p => p.appSection === activeFilter);
    }

    if (submittedSearchTerm) {
      const lower = submittedSearchTerm.toLowerCase();
      base = base.filter(p => p.title.toLowerCase().includes(lower) || (p as any).brands?.some((b:string) => b.toLowerCase().includes(lower)));
    }

    setFilteredPoints(base);
  }, [allPoints, activeFilter, submittedSearchTerm]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!firestore) return;
      setIsLoading(true);
      try {
        // Chargement simultané pour réactivité immédiate
        const collections = ['concessions', 'associations', 'relais'];
        const snapshots = await Promise.all(collections.map(c => getDocs(query(collection(firestore, c), limit(2000)))));
        
        snapshots.forEach((snap, idx) => {
          snap.docs.forEach(doc => {
            const data = doc.data();
            const coords = extractValidCoordinates(data);
            if (!coords) return;
            const p: MapPoint = {
              id: doc.id,
              title: data.title || data.name || doc.id.replace(/-/g, ' ').toUpperCase(),
              latitude: coords.lat,
              longitude: coords.lng,
              category: data.category || (idx === 1 ? 'association' : (idx === 2 ? 'relais' : 'concession')),
              appSection: data.appSection || (idx === 1 ? 'association' : (idx === 2 ? 'relais' : (data.category?.includes('concession') ? 'both' : 'service'))),
              slug: data.slug || doc.id,
              imgUrl: data.imageUrl || data.imgUrl || ""
            };
            masterPointsMap.current.set(p.id, p);
          });
        });
        setAllPoints(Array.from(masterPointsMap.current.values()));
      } catch (e) {} finally { setIsLoading(false); }
    };
    fetchAll();
  }, [firestore]);

  const handleMarkerClick = useCallback((id: string) => { 
    setSelectedDealershipId(id); 
    setSelectionSource('marker');
    const point = masterPointsMap.current.get(id); 
    if (point) { 
      setMapCenter([point.latitude, point.longitude]); 
      setMapZoom(14); 
    } 
    if (isMobile) setDrawerHeight('half'); 
  }, [isMobile]);

  const handleOpenDetails = useCallback((id: string) => {
    setSelectedDealershipId(id);
    setIsDetailViewOpen(true);
    if (isMobile) setDrawerHeight('full');
  }, [isMobile]);

  const listContent = (
    <div className="space-y-3 pb-20">
      {isLoading ? (
        <div className="space-y-4 pt-4">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-32 w-full rounded-2xl" />))}</div>
      ) : (
        filteredPoints.map((point) => (
          <DealershipCardItem 
            key={point.id} 
            point={point} 
            isSelected={point.id === selectedDealershipId} 
            onClick={() => handleMarkerClick(point.id)} 
            onOpenDetails={handleOpenDetails}
            className={cn(point.id === selectedDealershipId && "ring-2 ring-brand shadow-lg")} 
          />
        ))
      )}
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <MapComponent 
          points={filteredPoints} 
          center={mapCenter} 
          zoom={mapZoom} 
          targetBounds={targetBounds} 
          selectionSource={selectionSource}
          selectedId={selectedDealershipId} 
          onMarkerClick={handleMarkerClick} 
          onMapChange={(c, z) => { setMapCenter(c); setMapZoom(z); setSelectionSource(null); }} 
          onMapClick={() => { if (isMobile) setDrawerHeight('collapsed'); setSelectedDealershipId(null); setIsDetailViewOpen(false); }} 
          bottomPadding={bottomPadding} 
          leftPadding={leftPadding} 
          isLocating={isLocating} 
          onLocateEnd={() => setIsLoadingLocating(false)} 
          onLocationFound={(c) => { setMapCenter(c); setMapZoom(14); setSelectionSource('external'); }} 
        />
      </div>

      {/* Barre latérale dynamique */}
      {!isMobile && (
        <aside className="absolute top-6 left-6 bottom-6 w-[520px] flex flex-col bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[100] border border-white/40 overflow-hidden transition-all duration-300">
            {isDetailViewOpen && selectedDealershipId ? (
              <SidebarDetailView 
                dealershipId={selectedDealershipId} 
                point={masterPointsMap.current.get(selectedDealershipId)}
                onBack={() => setIsDetailViewOpen(false)} 
              />
            ) : (
              <>
                <div className="p-8 pb-4 shrink-0">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="w-40"><LabelMotoLogo noBubble /></div>
                        <UserMenu />
                    </div>
                    <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => setSubmittedSearchTerm(searchTerm)} activeFilter={activeFilter} onFilterChange={setActiveFilter} variant="map" hideUserMenu />
                </div>
                <div ref={listContainerRef} className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">{listContent}</div>
              </>
            )}
        </aside>
      )}

      {/* Version Mobile avec Drawer */}
      {isMobile && (
        <div className={cn("fixed left-0 right-0 bg-background rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out z-[1100]", drawerHeight === 'collapsed' ? 'bottom-0 h-[110px]' : drawerHeight === 'half' ? 'bottom-0 h-[50vh]' : 'bottom-0 h-[calc(100vh-160px)]')}>
           <div className="absolute top-0 left-0 right-0 h-14 cursor-pointer flex items-center justify-center" onClick={() => setDrawerHeight(drawerHeight === 'collapsed' ? 'half' : (drawerHeight === 'half' ? 'full' : 'half'))}>
              <div className="w-12 h-1.5 bg-muted rounded-full" />
           </div>
           <div className="pt-10 h-full overflow-hidden flex flex-col">
              {isDetailViewOpen && selectedDealershipId ? (
                <SidebarDetailView 
                  dealershipId={selectedDealershipId} 
                  point={masterPointsMap.current.get(selectedDealershipId)}
                  onBack={() => { setIsDetailViewOpen(false); setDrawerHeight('half'); }} 
                />
              ) : (
                <div className="px-4 flex-1 overflow-y-auto">{listContent}</div>
              )}
           </div>
        </div>
      )}

      <button className="absolute right-6 bottom-32 md:bottom-10 z-[500] h-12 w-12 md:h-14 md:w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95" onClick={() => setIsLoadingLocating(true)}><Compass className="h-7 w-7" /></button>
    </div>
  );
}

export default function MapPage() { 
  return <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><MapPageComponent /></Suspense>;
}
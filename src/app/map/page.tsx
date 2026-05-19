
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import DealershipCardItem from '@/components/app/dealership-card';
import type { MapPoint, Dealership } from '@/lib/types';
import Header, { UserMenu } from '@/components/app/header';
import { Compass, Loader2, MapPin, Home, Bike, Wrench, Users, Utensils, ArrowLeft, Phone, Globe, Clock, ExternalLink, Navigation, ChevronRight } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { extractValidCoordinates } from "@/lib/geohash";
import { useFirebase } from '@/firebase';
import { collection, getDocs, query, limit, doc } from "firebase/firestore";
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
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

/**
 * Vue détaillée complète (Panneau latéral)
 * S'affiche uniquement quand l'utilisateur clique sur "Détails"
 */
const SidebarDetailView = ({ dealershipId, point, onBack }: { dealershipId: string, point?: MapPoint, onBack: () => void }) => {
  const { firestore } = useFirebase();
  const colName = point?.appSection === 'association' ? 'associations' : (point?.appSection === 'relais' ? 'relais' : 'concessions');
  const docRef = useMemoFirebase(() => doc(firestore, colName, dealershipId), [firestore, colName, dealershipId]);
  const { data: pro, isLoading } = useDoc<Dealership>(docRef);

  if (isLoading) return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );

  if (!pro) return null;

  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand mb-6 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Retour à la liste
      </button>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-6 shadow-lg border-2 border-white">
        {pro.imageUrl || pro.imgUrl ? (
           <Image src={pro.imageUrl || pro.imgUrl || ""} alt={pro.title} fill className="object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center opacity-10">
              <MapPin className="h-12 w-12" />
           </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">{pro.title}</h3>
          <p className="text-xs font-black uppercase text-brand italic">{pro.category || 'Expert moto'}</p>
        </div>

        <div className="bg-muted/30 p-4 rounded-2xl border-2 border-dashed flex items-start gap-3">
          <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <p className="text-sm font-bold leading-snug">{pro.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
           {pro.phoneNumber && (
             <Button asChild variant="outline" className="h-12 rounded-xl font-black uppercase text-[9px] border-2">
               <a href={`tel:${pro.phoneNumber}`}><Phone className="mr-2 h-3.5 w-3.5" /> Appeler</a>
             </Button>
           )}
           {pro.website && (
             <Button asChild variant="outline" className="h-12 rounded-xl font-black uppercase text-[9px] border-2">
               <a href={pro.website} target="_blank" rel="noopener noreferrer"><Globe className="mr-2 h-3.5 w-3.5" /> Site Web</a>
             </Button>
           )}
        </div>

        <Button asChild className="w-full bg-brand hover:bg-brand/90 text-white rounded-full font-black uppercase text-xs h-14 shadow-xl transition-all hover:scale-[1.02] active:scale-95">
          <a href={navigationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Navigation className="h-4 w-4 fill-white" />
            Calculer l'itinéraire
          </a>
        </Button>

        <div className="pt-4 border-t border-dashed">
           <Link href={`/concessions/${pro.slug || pro.id}`} className="block text-center p-4 bg-muted/20 rounded-xl hover:bg-brand/5 group transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand">Ouvrir la page SEO complète</span>
              <ChevronRight className="inline-block h-3 w-3 ml-2 text-muted-foreground group-hover:text-brand" />
           </Link>
        </div>
      </div>
    </div>
  );
};

function MapPageComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const filterParam = searchParams.get('filter');
  const searchParam = searchParams.get('search');
  const selectedIdParam = searchParams.get('selectedId');

  const [allPoints, setAllPoints] = useState<MapPoint[]>([CIRCUIT_BUGATTI]);
  const [filteredPoints, setFilteredPoints] = useState<MapPoint[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchParam || '');
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(6.2);
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

  // Règle métier de filtrage centralisée (Source de Vérité)
  useEffect(() => {
    let base = Array.from(masterPointsMap.current.values());
    
    // Filtrage strict par catégorie
    if (activeFilter === null) {
      // "Tout" = Concession (shopping) + Atelier (service) + Both
      base = base.filter(p => p.appSection === 'shopping' || p.appSection === 'service' || p.appSection === 'both');
    } else if (activeFilter === 'shopping') {
      base = base.filter(p => p.appSection === 'shopping' || p.appSection === 'both');
    } else if (activeFilter === 'service') {
      base = base.filter(p => p.appSection === 'service' || p.appSection === 'both');
    } else {
      // Asso ou Relais exclusifs
      base = base.filter(p => p.appSection === activeFilter);
    }

    // Filtrage par recherche
    if (submittedSearchTerm) {
      const lower = submittedSearchTerm.toLowerCase();
      base = base.filter(p => p.title.toLowerCase().includes(lower) || (p as any).brands?.some((b:string) => b.toLowerCase().includes(lower)));
    }

    setFilteredPoints(base);

    // Sécurité : fermer la fiche si l'élément n'est plus dans le filtre
    if (selectedDealershipId) {
      const stillVisible = base.some(p => p.id === selectedDealershipId);
      if (!stillVisible) {
        setIsDetailViewOpen(false);
        setSelectedDealershipId(null);
      }
    }
  }, [allPoints, activeFilter, submittedSearchTerm, selectedDealershipId]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!firestore) return;
      setIsLoading(true);
      try {
        const collections = ['concessions', 'associations', 'relais'];
        const snapshots = await Promise.all(collections.map(c => getDocs(query(collection(firestore, c), limit(3000)))));
        
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
              imgUrl: data.imageUrl || data.imgUrl || "",
              rating: data.rating
            };
            masterPointsMap.current.set(p.id, p);
          });
        });
        setAllPoints(Array.from(masterPointsMap.current.values()));
      } catch (e) {} finally { setIsLoading(false); }
    };
    fetchAll();
  }, [firestore]);

  // Clic sur marqueur : sélectionne en liste mais n'ouvre pas la fiche complète
  const handleMarkerClick = useCallback((id: string) => { 
    setSelectedDealershipId(id); 
    setSelectionSource('marker');
    
    const point = masterPointsMap.current.get(id); 
    if (point) { 
      setMapCenter([point.latitude, point.longitude]); 
      setMapZoom(14); 
    } 

    // Scroll automatique vers la carte sélectionnée dans la liste
    const element = document.getElementById(`card-${id}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Action volontaire : clic sur "Détails"
  const handleOpenDetails = useCallback((id: string) => {
    setSelectedDealershipId(id);
    setIsDetailViewOpen(true);
    if (isMobile) setDrawerHeight('full');
    
    const point = masterPointsMap.current.get(id); 
    if (point) {
      setMapCenter([point.latitude, point.longitude]);
      setMapZoom(14);
      setSelectionSource('card');
    }
  }, [isMobile]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* CARTE EN ARRIERE-PLAN */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          points={filteredPoints} 
          center={mapCenter} 
          zoom={mapZoom} 
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

      {/* RECHERCHE FLOTTANTE */}
      <div className="absolute top-6 right-6 left-6 md:left-auto md:w-full md:max-w-2xl z-[1500] pointer-events-none">
        <div className="pointer-events-auto">
          <Header 
            searchTerm={searchTerm} 
            onSearchTermChange={setSearchTerm} 
            onSearch={() => setSubmittedSearchTerm(searchTerm)} 
            placeholderText="Recherche par département, ville, marque, nom..."
            variant="map"
            hideUserMenu
          />
        </div>
      </div>

      {/* DASHBOARD LATERAL (PC) */}
      {!isMobile && (
        <aside className="absolute top-6 left-6 bottom-6 w-[520px] flex flex-col bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.2)] z-[1000] border border-white/40 overflow-hidden transition-all duration-300">
            <div className="p-10 pb-6 shrink-0">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="w-40"><LabelMotoLogo noBubble /></div>
                    <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-50 text-center flex-1 max-w-[200px]">
                        <p className="text-[8px] font-black uppercase tracking-wider text-foreground leading-tight">TROUVER UN PRO ?</p>
                        <p className="text-[10px] font-black italic text-brand leading-none">C'EST ICI.</p>
                    </div>
                    <UserMenu />
                </div>

                {/* Filtres de catégories */}
                <div className="space-y-8 mt-10">
                    <div className="text-center space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Pros & Services</p>
                        <div className="flex justify-center gap-6">
                            {[
                                { id: 'shopping', label: 'Concess', icon: Bike },
                                { id: null, label: 'Tout', icon: Home },
                                { id: 'service', label: 'Atelier', icon: Wrench }
                            ].map((tab) => (
                                <button 
                                    key={String(tab.id)} 
                                    onClick={() => setActiveFilter(tab.id as any)}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className={cn(
                                        "h-16 w-16 rounded-full flex items-center justify-center transition-all border-4 shadow-lg group-hover:scale-105 active:scale-95",
                                        activeFilter === tab.id 
                                            ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                                            : "bg-white text-brand border-transparent hover:border-brand/20"
                                    )}>
                                        <tab.icon className="h-7 w-7" />
                                    </div>
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", activeFilter === tab.id ? "text-brand" : "text-muted-foreground")}>
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Communauté</p>
                        <div className="flex justify-center gap-10">
                            {[
                                { id: 'association', label: 'Asso', icon: Users, color: 'indigo-600' },
                                { id: 'relais', label: 'Relais', icon: Utensils, color: 'amber-600' }
                            ].map((tab) => (
                                <button 
                                    key={tab.id} 
                                    onClick={() => setActiveFilter(tab.id as any)}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className={cn(
                                        "h-14 w-14 rounded-full flex items-center justify-center transition-all border-4 shadow-md group-hover:scale-105 active:scale-95",
                                        activeFilter === tab.id 
                                            ? `bg-${tab.color} text-white border-white scale-110 z-10 shadow-${tab.color}/40` 
                                            : `bg-white text-${tab.color} border-transparent hover:border-${tab.color}/20`
                                    )}>
                                        <tab.icon className="h-6 w-6" />
                                    </div>
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", activeFilter === tab.id ? `text-${tab.color}` : "text-muted-foreground")}>
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* LISTE OU DETAIL */}
            <div ref={listContainerRef} className="flex-1 overflow-y-auto p-10 pt-4 custom-scrollbar">
                {isDetailViewOpen && selectedDealershipId ? (
                   <SidebarDetailView 
                        dealershipId={selectedDealershipId} 
                        point={masterPointsMap.current.get(selectedDealershipId)}
                        onBack={() => { setIsDetailViewOpen(false); }}
                   />
                ) : (
                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)
                        ) : filteredPoints.length > 0 ? (
                            filteredPoints.map((point) => (
                                <DealershipCardItem 
                                    key={point.id} 
                                    point={point} 
                                    isSelected={point.id === selectedDealershipId} 
                                    onClick={() => setSelectedDealershipId(point.id)} 
                                    onOpenDetails={handleOpenDetails}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground font-black uppercase text-xs">Aucun pro dans cette zone.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
      )}

      {/* DRAWER MOBILE */}
      {isMobile && (
        <div className={cn("fixed left-0 right-0 bg-background rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out z-[1100]", drawerHeight === 'collapsed' ? 'bottom-0 h-[110px]' : drawerHeight === 'half' ? 'bottom-0 h-[50vh]' : 'bottom-0 h-[calc(100vh-160px)]')}>
           <div className="absolute top-0 left-0 right-0 h-14 cursor-pointer flex items-center justify-center" onClick={() => setDrawerHeight(drawerHeight === 'collapsed' ? 'half' : (drawerHeight === 'half' ? 'full' : 'half'))}>
              <div className="w-12 h-1.5 bg-muted rounded-full" />
           </div>
           <div className="pt-2 h-full overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                {isDetailViewOpen && selectedDealershipId ? (
                   <SidebarDetailView 
                    dealershipId={selectedDealershipId} 
                    point={masterPointsMap.current.get(selectedDealershipId)}
                    onBack={() => { setIsDetailViewOpen(false); setDrawerHeight('half'); }} 
                  />
                ) : (
                  <div className="space-y-3">
                     {filteredPoints.map((point) => (
                        <DealershipCardItem 
                            key={point.id} 
                            point={point} 
                            isSelected={point.id === selectedDealershipId} 
                            onClick={() => setSelectedDealershipId(point.id)} 
                            onOpenDetails={handleOpenDetails}
                        />
                      ))}
                  </div>
                )}
              </div>
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

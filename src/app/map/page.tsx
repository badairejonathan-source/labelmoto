
'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import DealershipCardItem from '@/components/app/dealership-card';
import type { MapPoint, Dealership } from '@/lib/types';
import Header, { UserMenu } from '@/components/app/header';
import { Compass, Loader2, MapPin, Bike, Wrench, Users, Utensils, ArrowLeft, Phone, Globe, ChevronRight, Clock } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { extractValidCoordinates } from "@/lib/geohash";
import { useFirebase, useMemoFirebase, useDoc } from '@/firebase';
import { collection, getDocs, query, limit, doc } from "firebase/firestore";
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';

const brandsList = Object.keys(brandLogos);

const MapComponent = dynamic(
  () => import('@/components/app/map-component').then((mod) => mod.default), 
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div> }
);

const SidebarDetailView = ({ dealershipId, point, onBack }: { dealershipId: string, point?: MapPoint, onBack: () => void }) => {
  const { firestore } = useFirebase();
  const col = point?.appSection === 'association' ? 'associations' : (point?.appSection === 'relais' ? 'relais' : 'concessions');
  const docRef = useMemoFirebase(() => doc(firestore, col, dealershipId), [firestore, col, dealershipId]);
  const { data: pro, isLoading } = useDoc<Dealership>(docRef);

  if (isLoading) return <div className="p-8 space-y-6"><Skeleton className="h-48 w-full rounded-3xl" /><Skeleton className="h-8 w-3/4" /></div>;
  if (!pro) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </button>

      <div className="space-y-8">
        <div className="bg-brand/5 p-6 rounded-3xl border border-brand/10">
          <div className="flex items-center gap-2 mb-4 text-brand">
            <Clock className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Horaires d'ouverture</span>
          </div>
          <div className="grid gap-2">
            {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(day => (
              <div key={day} className="flex justify-between items-center text-[10px] font-bold">
                <span className="capitalize text-muted-foreground">{day}</span>
                <span className="text-foreground uppercase font-black">{pro[day] || 'Fermé'}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{pro.title}</h3>
          <p className="text-sm font-black uppercase text-brand italic">{pro.category || 'Expert moto'}</p>
        </div>

        <div className="bg-muted/30 p-5 rounded-3xl border-2 border-dashed flex items-start gap-3">
          <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <p className="text-sm font-bold leading-snug">{pro.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
           {pro.phoneNumber && <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[10px] border-2"><a href={`tel:${pro.phoneNumber}`}><Phone className="mr-2 h-4 w-4" /> Appeler</a></Button>}
           {pro.website && <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[10px] border-2"><a href={pro.website} target="_blank" rel="noreferrer"><Globe className="mr-2 h-4 w-4" /> Site Web</a></Button>}
        </div>

        <Button asChild className="w-full bg-brand hover:bg-brand/90 text-white rounded-full font-black uppercase text-xs h-16 shadow-xl shadow-brand/20 transition-all hover:scale-[1.02]">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`} target="_blank" rel="noreferrer">Calculer l'itinéraire</a>
        </Button>

        <div className="pt-6 border-t border-dashed">
           <Link href={`/concessions/${pro.slug || pro.id}`} className="block text-center p-4 bg-muted/20 rounded-2xl hover:bg-brand/5 group transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand">Ouvrir la fiche complète</span>
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
  const { width } = useWindowSize();
  const { firestore } = useFirebase();

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeFilters, setActiveFilters] = useState<string[]>(['shopping', 'service', 'association', 'relais']);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('selectedId'));
  const [isDetailView, setIsDetailView] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(6);
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('half');
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>('external');
  const [isLocating, setIsLocating] = useState(false);

  const isMobile = width !== undefined && width < 1024;
  const bottomPadding = isMobile ? (drawerHeight === 'full' ? 600 : (drawerHeight === 'half' ? 300 : 160)) : 0;
  const leftPadding = !isMobile ? 544 : 0;

  useEffect(() => {
    const fetchAll = async () => {
      if (!firestore) return;
      const collections = ['concessions', 'associations', 'relais'];
      // Limite augmentée à 10k par collection pour assurer la visibilité totale
      const snaps = await Promise.all(collections.map(c => getDocs(query(collection(firestore, c), limit(10000)))));
      const allPoints: MapPoint[] = [];
      const seenIds = new Set<string>();

      snaps.forEach((snap, idx) => {
        snap.docs.forEach(doc => {
          if (seenIds.has(doc.id)) return;
          seenIds.add(doc.id);
          const data = doc.data();
          const coords = extractValidCoordinates(data);
          if (!coords) return;
          allPoints.push({
            id: doc.id,
            latitude: coords.lat,
            longitude: coords.lng,
            category: data.category || (idx === 1 ? 'association' : (idx === 2 ? 'relais' : 'concession')),
            appSection: data.appSection || (idx === 1 ? 'association' : (idx === 2 ? 'relais' : 'shopping')),
            title: data.title || doc.id,
            slug: data.slug,
            rating: data.rating,
            imgUrl: data.imageUrl || data.imgUrl,
            address: data.address || ""
          } as MapPoint);
        });
      });
      setPoints(allPoints);
    };
    fetchAll();
  }, [firestore]);

  const searchIntent = useMemo(() => {
    if (!searchTerm) return null;
    const lower = searchTerm.toLowerCase().trim();
    
    // Détection de la marque
    const brand = brandsList.find(b => lower.includes(b.toLowerCase()));
    
    // Nettoyage pour la zone geo
    let geoQuery = lower;
    if (brand) geoQuery = lower.replace(brand.toLowerCase(), '').trim();

    let geo = { type: 'text', value: geoQuery, coords: null as [number, number] | null, zoom: 12 };

    // Priorité 1 : Département (2 chiffres)
    const deptMatch = geoQuery.match(/\b(\d{2})\b/);
    if (deptMatch) {
        const deptCode = deptMatch[1];
        const deptKey = Object.keys(locationsData).find(k => k.startsWith(deptCode));
        if (deptKey) {
            const loc = (locationsData as any)[deptKey];
            geo = { type: 'dept', value: deptCode, coords: loc.center, zoom: 9 };
        }
    } 
    // Priorité 2 : Code Postal (5 chiffres)
    else if (geoQuery.match(/\b(\d{5})\b/)) {
        const cp = geoQuery.match(/\b(\d{5})\b/)?.[0];
        const deptCode = cp?.substring(0, 2);
        const deptKey = Object.keys(locationsData).find(k => k.startsWith(deptCode || ''));
        if (deptKey) {
            const loc = (locationsData as any)[deptKey];
            geo = { type: 'cp', value: cp || '', coords: loc.center, zoom: 13 };
        }
    } 
    // Priorité 3 : Noms de villes
    else {
        for (const [dept, info] of Object.entries(locationsData)) {
            const city = info.cities.find(c => geoQuery.includes(c.toLowerCase()) || c.toLowerCase().includes(geoQuery));
            if (city) { geo = { type: 'city', value: city, coords: info.center, zoom: 13 }; break; }
        }
    }
    return { brand, geo, original: lower };
  }, [searchTerm]);

  const filteredPoints = useMemo(() => {
    return points.filter(p => {
        const section = p.appSection === 'both' ? 'shopping' : p.appSection;
        if (!activeFilters.includes(section)) return false;
        if (!searchIntent) return true;
        
        const { brand, geo, original } = searchIntent;
        const titleLower = p.title.toLowerCase();
        const addressLower = (p as any).address?.toLowerCase() || "";
        
        // Filtre Marque
        const matchesBrand = !brand || titleLower.includes(brand.toLowerCase());
        
        // Filtre Geo
        let matchesGeo = true;
        if (geo.type === 'dept') {
            // Uniquement si le département est présent dans le CP de l'adresse
            matchesGeo = addressLower.includes(geo.value);
        } else if (geo.type === 'cp') {
            matchesGeo = addressLower.includes(geo.value);
        } else if (geo.type === 'city') {
            matchesGeo = addressLower.includes(geo.value.toLowerCase());
        } else if (geo.type === 'text') {
            if (geo.value) {
                matchesGeo = titleLower.includes(geo.value) || addressLower.includes(geo.value);
            }
        }
        
        return matchesBrand && matchesGeo;
    });
  }, [points, searchIntent, activeFilters]);

  // Liste triée par proximité au centre
  const listPoints = useMemo(() => {
    return [...filteredPoints]
      .sort((a, b) => {
        if (a.id === selectedId) return -1;
        if (b.id === selectedId) return 1;
        const distA = Math.pow(a.latitude - mapCenter[0], 2) + Math.pow(a.longitude - mapCenter[1], 2);
        const distB = Math.pow(b.latitude - mapCenter[0], 2) + Math.pow(b.longitude - mapCenter[1], 2);
        return distA - distB;
      })
      .slice(0, 25);
  }, [filteredPoints, mapCenter, selectedId]);

  // Labels avec thining (anti-collision)
  const labelPoints = useMemo(() => {
    if (mapZoom < 13) return [];
    const gridSize = mapZoom >= 15 ? 0.005 : 0.015;
    const grid: Record<string, boolean> = {};
    const result: MapPoint[] = [];

    const sortedForLabels = [...filteredPoints].sort((a, b) => {
        if (a.id === selectedId) return -1;
        if (b.id === selectedId) return 1;
        return 0;
    });

    sortedForLabels.forEach(p => {
        const gridX = Math.floor(p.latitude / gridSize);
        const gridY = Math.floor(p.longitude / gridSize);
        const key = `${gridX},${gridY}`;
        if (!grid[key] || p.id === selectedId) {
            grid[key] = true;
            result.push(p);
        }
    });
    return result;
  }, [filteredPoints, mapZoom, selectedId]);

  useEffect(() => {
    if (searchIntent?.geo.coords && selectionSource === 'external') {
        setMapCenter(searchIntent.geo.coords);
        setMapZoom(searchIntent.geo.zoom);
    }
  }, [searchIntent, selectionSource]);

  const handleFilterToggle = (f: string) => {
    setActiveFilters(prev => {
        const newFilters = prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f];
        if (selectedId) {
            const point = points.find(p => p.id === selectedId);
            const section = point?.appSection === 'both' ? 'shopping' : point?.appSection;
            if (section && !newFilters.includes(section)) { setSelectedId(null); setIsDetailView(false); }
        }
        return newFilters;
    });
  };

  const handleMarkerClick = (id: string) => {
    const p = points.find(x => x.id === id);
    if (p) {
        setMapCenter([p.latitude, p.longitude]);
        setSelectionSource('marker');
    }
    setSelectedId(id);
    if (isMobile) setDrawerHeight('half');
  };

  // Fonction de réduction du menu mobile lors de l'interaction manuelle sur la carte
  const handleUserInteraction = () => { 
    if (isMobile) {
      setDrawerHeight('collapsed'); 
    }
  };

  const FilterButtons = ({ mobile = false }) => {
    const filters = [
        { id: 'shopping', label: 'CONCESS', icon: Bike },
        { id: 'service', label: 'ATELIER', icon: Wrench },
        { id: 'association', label: 'ASSO', icon: Users },
        { id: 'relais', label: 'RELAIS', icon: Utensils }
    ];
    const renderFilter = (f: typeof filters[0]) => {
        const isActive = activeFilters.includes(f.id);
        return (
            <button key={f.id} onClick={() => handleFilterToggle(f.id)} className="flex flex-col items-center gap-2 group shrink-0">
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all border-2 shadow-sm", isActive ? "bg-brand text-white border-white scale-110 shadow-lg" : "bg-white text-muted-foreground border-transparent hover:border-brand/20")}><f.icon className="h-6 w-6" /></div>
                <span className={cn("text-[9px] font-black uppercase tracking-tight leading-none text-center", isActive ? "text-foreground" : "text-muted-foreground")}>{f.label}</span>
            </button>
        );
    };
    if (mobile) {
        return (
            <div className="relative w-full bg-white rounded-t-[28px] min-h-[140px] pt-14 pb-4 px-2 overflow-visible">
                <div className="absolute -top-[40px] left-1/2 -translate-x-1/2 w-[80px] h-[80px] bg-white rounded-full z-[1050]" />
                <div className="absolute -top-[141px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] z-[1500] pointer-events-none"><Image src="/images/logomoto2.webp" alt="Label Moto" width={300} height={300} className="w-full h-full object-contain" priority /></div>
                <div className="grid grid-cols-5 items-start justify-between gap-1 relative z-10">
                    <div className="col-span-1 flex justify-center">{renderFilter(filters[0])}</div>
                    <div className="col-span-1 flex justify-center">{renderFilter(filters[1])}</div>
                    <div className="col-span-1 h-12" />
                    <div className="col-span-1 flex justify-center">{renderFilter(filters[2])}</div>
                    <div className="col-span-1 flex justify-center">{renderFilter(filters[3])}</div>
                </div>
            </div>
        );
    }
    return (<div className="flex items-center justify-center gap-8"><div className="flex gap-4">{filters.map(renderFilter)}</div></div>);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <MapComponent 
            points={filteredPoints} labelPoints={labelPoints} center={mapCenter} zoom={mapZoom} selectedId={selectedId} selectionSource={selectionSource}
            onMarkerClick={handleMarkerClick} onMapClick={() => { setSelectedId(null); setIsDetailView(false); }}
            onMapChange={(c, z) => { setMapCenter(c); setMapZoom(z); setSelectionSource(null); }}
            onUserInteraction={handleUserInteraction} bottomPadding={bottomPadding} leftPadding={leftPadding}
            isLocating={isLocating} onLocateEnd={() => setIsLocating(false)} onLocationFound={(c) => { setMapCenter(c); setSelectionSource('external'); }}
        />
      </div>

      <div className={cn("absolute top-6 z-[1500] pointer-events-none", isMobile ? "left-6 right-6" : "right-6 w-[400px]")}>
        <div className="pointer-events-auto">
            <Header 
                searchOnly={!isMobile}
                searchTerm={searchTerm} 
                onSearchTermChange={(val: string) => {
                    setSearchTerm(val);
                    setSelectionSource('external');
                    if (!val) { setMapZoom(6); setMapCenter([46.5, 2.2]); }
                }} 
                onSearch={() => setSelectionSource('external')} 
            />
        </div>
      </div>

      {!isMobile && (
        <aside className="absolute top-6 left-6 bottom-6 w-[520px] bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl z-[1000] border border-white/40 flex flex-col overflow-hidden">
            <div className="px-10 py-8 shrink-0 flex items-center justify-between border-b border-muted/30">
                <Link href="/" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
                    <Image src="/images/logo-moto.webp" alt="Logo" width={140} height={45} className="w-auto h-10 object-contain" />
                </Link>
                <div className="flex-1 text-center px-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-foreground leading-tight">TROUVER UNE CONCESSION ?</p>
                    <p className="text-[11px] font-black italic text-brand leading-none">FINI LA GALÈRE.</p>
                </div>
                <div className="shrink-0">
                    <UserMenu />
                </div>
            </div>

            <div className="px-10 py-8 pb-6 shrink-0 space-y-6">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">À proximité de la zone</p>
                    <FilterButtons />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 pt-4 custom-scrollbar">
                {isDetailView && selectedId ? (
                    <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => setIsDetailView(false)} />
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2 mb-4"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{listPoints.length} Résultats pertinents ici</span></div>
                        {listPoints.map(p => (
                            <DealershipCardItem key={p.id} point={p} isSelected={p.id === selectedId} onClick={() => handleMarkerClick(p.id)} onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); }} />
                        ))}
                        {filteredPoints.length === 0 && (
                            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed"><p className="font-black uppercase tracking-tight text-muted-foreground">Aucun résultat</p></div>
                        )}
                    </div>
                )}
            </div>
        </aside>
      )}

      {isMobile && (
        <div className={cn("fixed left-0 right-0 bg-white rounded-t-[28px] shadow-[0_-15px_50px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out z-[1100]", drawerHeight === 'collapsed' ? 'bottom-0 h-[140px]' : (drawerHeight === 'half' ? 'bottom-0 h-[50vh]' : 'bottom-0 h-[85vh]'))}>
            <div className="h-full flex flex-col">
                <div className="shrink-0 overflow-visible"><FilterButtons mobile /></div>
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {isDetailView && selectedId ? (
                        <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => { setIsDetailView(false); setDrawerHeight('half'); }} />
                    ) : (
                        <div className="space-y-4">
                            {listPoints.map(p => (
                                <DealershipCardItem key={p.id} point={p} isSelected={p.id === selectedId} onClick={() => handleMarkerClick(p.id)} onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); setDrawerHeight('full'); }} />
                            ))}
                             {filteredPoints.length === 0 && (<div className="text-center py-10 opacity-50"><p className="font-black uppercase text-xs">Aucun résultat</p></div>)}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <button className={cn("absolute right-6 z-[500] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all", isMobile ? "bottom-44" : "bottom-10")} onClick={() => setIsLocating(true)}>
        <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
      </button>
    </div>
  );
}

export default function MapPage() { 
    return <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand" /></div>}><MapPageComponent /></Suspense>; 
}

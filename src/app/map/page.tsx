'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCardItem from '@/components/app/dealership-card';
import type { MapPoint, Dealership } from '@/lib/types';
import Header, { UserMenu } from '@/components/app/header';
import LabelMotoLogo from '@/components/app/logo';
import { Compass, Loader2, MapPin, Bike, Wrench, Users, Utensils, ArrowLeft, Phone, Globe, ChevronRight, Clock, ChevronUp, ChevronDown, MessageSquare, Map as MapIcon } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn, normalizeText, getItemDepartment } from "@/lib/utils";
import { extractValidCoordinates } from "@/lib/geohash";
import { useFirebase, useMemoFirebase, useDoc } from '@/firebase/client';
import { initializeFirebaseClient } from '@/firebase/config-client';
import { collection, getDocs, query, limit, doc, getDoc, getFirestore } from "firebase/firestore";
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';

const MOTORCYCLE_BRANDS = [
  "Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "BMW Motorrad",
  "Ducati", "Triumph", "Harley-Davidson", "KTM", "Aprilia",
  "Moto Guzzi", "Royal Enfield", "Indian", "Piaggio", "Vespa", "Can-Am", "CFMoto"
];

const MapComponent = dynamic(
  () => import('@/components/app/map-component').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div> }
);

const SidebarDetailView = ({ dealershipId, point, onBack }: { dealershipId: string, point?: MapPoint, onBack: () => void }) => {
  const { firestore } = useFirebase();
  const col = point?.appSection === 'association' ? 'associations' : (point?.appSection === 'relais' ? 'relais' : 'concessions');

  const docRef = useMemoFirebase(() => {
    if (!firestore || !dealershipId) return null;
    return doc(firestore, col, dealershipId);
  }, [firestore, col, dealershipId]);

  const { data: pro, isLoading } = useDoc<Dealership>(docRef);

  if (isLoading) return <div className="p-8 space-y-6"><Skeleton className="h-48 w-full rounded-3xl" /><Skeleton className="h-8 w-3/4" /></div>;
  if (!pro) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </button>
      <div className="space-y-8">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{pro.title}</h3>
          <p className="text-sm font-black uppercase text-brand italic">{pro.category || 'Expert moto'}</p>
        </div>
        <div className="bg-muted/30 p-5 rounded-3xl border-2 border-dashed">
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
              <p className="text-sm font-bold leading-snug">{pro.address}</p>
            </div>
            <Button asChild variant="link" className="p-0 h-auto text-brand font-black uppercase text-[10px] flex items-center gap-2 ml-8 justify-start">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`} target="_blank" rel="noreferrer">
                <MapIcon className="h-3.5 w-3.5" /> Calculer l'itinéraire
              </a>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {pro.phoneNumber && (
            <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[8px] md:text-[9px] border-2 px-1">
              <a href={`tel:${pro.phoneNumber}`}><Phone className="mr-1 h-3 w-3 md:h-4 w-4" /> Appeler</a>
            </Button>
          )}
          {pro.website && (
            <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[8px] md:text-[9px] border-2 px-1">
              <a href={pro.website} target="_blank" rel="noopener noreferrer"><Globe className="mr-1 h-3 w-3 md:h-4 w-4" /> Site</a>
            </Button>
          )}
          <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[8px] md:text-[9px] border-2 px-1">
            <Link href={`/concessions/${pro.slug || pro.id}#reviews`}>
              <MessageSquare className="mr-1 h-3 w-3 md:h-4 w-4" /> Avis
            </Link>
          </Button>
        </div>
        <div className="bg-brand/5 p-6 rounded-3xl border border-brand/10">
          <div className="flex items-center gap-2 mb-4 text-brand">
            <Clock className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Horaires d'ouverture</span>
          </div>
          <div className="grid gap-2">
            {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(day => (
              <div key={day} className="flex justify-between items-center text-[10px] font-bold">
                <span className="capitalize text-muted-foreground">{day}</span>
                <span className="text-foreground uppercase font-black">{(pro as any)[day] || 'Fermé'}</span>
              </div>
            ))}
          </div>
        </div>
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
  const { width } = useWindowSize();
  const { firestore } = useFirebase();

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [deptCounts, setDeptCounts] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeFilters, setActiveFilters] = useState<string[]>(['shopping', 'service', 'association', 'relais']);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('selectedId'));
  const [isDetailView, setIsDetailView] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(6);
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('half');
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>('external');
  const [isLocating, setIsLocating] = useState(false);
  const [mapBounds, setMapBounds] = useState<any>(null);

  const isMobile = width !== undefined && width < 1024;
  const bottomPadding = isMobile ? (drawerHeight === 'full' ? 600 : (drawerHeight === 'half' ? 300 : 160)) : 0;
  const leftPadding = !isMobile ? 544 : 0;

  // Chargement des points
  useEffect(() => {
    const fetchAll = async () => {
      if (!firestore) return;
      const collections = ['concessions', 'associations', 'relais'];
      const allPoints: MapPoint[] = [];
      const seenIds = new Set<string>();
      let totalConcessions = 0;
      let totalAssociations = 0;
      let totalRelais = 0;
      let totalRejectedCoords = 0;

      for (let i = 0; i < collections.length; i++) {
        const colName = collections[i];
        try {
          const snap = await getDocs(query(collection(firestore, colName), limit(10000)));
          if (colName === 'concessions') totalConcessions = snap.size;
          if (colName === 'associations') totalAssociations = snap.size;
          if (colName === 'relais') totalRelais = snap.size;

          snap.docs.forEach(d => {
            if (seenIds.has(d.id)) return;
            const data = d.data();
            const coords = extractValidCoordinates(data);
            if (!coords) { totalRejectedCoords++; return; }
            seenIds.add(d.id);
            allPoints.push({
              id: d.id,
              latitude: coords.lat,
              longitude: coords.lng,
              category: data.category || (i === 1 ? 'association' : (i === 2 ? 'relais' : 'concession')),
              appSection: data.appSection || (i === 1 ? 'association' : (i === 2 ? 'relais' : 'shopping')),
              title: data.title || d.id,
              slug: data.slug,
              rating: data.rating,
              imgUrl: data.imageUrl || data.imgUrl,
              address: data.address || "",
              brands: data.brands || []
            } as MapPoint);
          });
        } catch (e) {
          console.warn(`[MAP] Échec du chargement de la collection ${colName}:`, e);
        }
      }

      console.log(`[MAP_DEBUG_1] Total concessions récupérées: ${totalConcessions}`);
      console.log(`[MAP_DEBUG_2] Total associations récupérées: ${totalAssociations}`);
      console.log(`[MAP_DEBUG_3] Total relais récupérés: ${totalRelais}`);
      console.log(`[MAP_DEBUG_4] Total docs rejetés (coordonnées invalides): ${totalRejectedCoords}`);
      console.log(`[MAP_DEBUG_6] Total markers finaux envoyés: ${allPoints.length}`);
      setPoints(allPoints);
    };
    fetchAll();
  }, [firestore]);

  // Chargement du cache départements
  useEffect(() => {
    const { firebaseApp } = initializeFirebaseClient();
    if (!firebaseApp) return;
    const db = getFirestore(firebaseApp);
    getDoc(doc(db, 'cache', 'departements_count'))
      .then(snap => {
        if (snap.exists()) {
          setDeptCounts(snap.data().counts);
          console.log('✅ Cache départements chargé');
        } else {
          console.log('ℹ️ Pas de cache départements — lancez la Cloud Function une première fois');
        }
      })
      .catch(e => console.warn('Cache départements non disponible:', e));
  }, []);

  const searchIntent = useMemo(() => {
    if (!searchTerm) return null;
    const lowerQuery = normalizeText(searchTerm);
    const tokens = lowerQuery.split(" ");
    let brand: string | null = null;
    let dept: string | null = null;
    let postalCode: string | null = null;
    let city: string | null = null;

    const cpMatch = lowerQuery.match(/\b\d{5}\b/);
    if (cpMatch) postalCode = cpMatch[0];

    const deptRegex = /^(0[1-9]|[1-8]\d|9[0-5]|2[AB]|97[1-46])$/;
    for (const token of tokens) {
      if (deptRegex.test(token.toUpperCase()) && token.length <= 3) { dept = token.toUpperCase(); break; }
    }

    brand = MOTORCYCLE_BRANDS.find(b => lowerQuery.includes(normalizeText(b))) || null;

    let cityTokens = tokens.filter(t =>
      t !== postalCode && t !== dept && (!brand || !normalizeText(brand).includes(t))
    );
    if (cityTokens.length > 0) city = cityTokens.join(" ");

    let targetGeo: { coords: [number, number], zoom: number } | null = null;
    if (postalCode) {
      const deptCode = postalCode.substring(0, 2);
      const loc = Object.entries(locationsData).find(([k]) => k.startsWith(deptCode));
      if (loc) targetGeo = { coords: (loc[1] as any).center, zoom: 12 };
    } else if (dept) {
      const loc = Object.entries(locationsData).find(([k]) => k.startsWith(dept));
      if (loc) targetGeo = { coords: (loc[1] as any).center, zoom: 9 };
    } else if (city) {
      for (const [, info] of Object.entries(locationsData)) {
        const foundCity = (info as any).cities.find((c: string) => normalizeText(c) === city || city?.includes(normalizeText(c)));
        if (foundCity) { targetGeo = { coords: (info as any).center, zoom: 12 }; break; }
      }
    }

    return { brand, dept, postalCode, city, targetGeo, original: lowerQuery };
  }, [searchTerm]);

  const filteredPoints = useMemo(() => {
    return points.filter(p => {
      const section = p.appSection === 'both' ? 'shopping' : p.appSection;
      if (!activeFilters.includes(section)) return false;
      if (!searchIntent) return true;

      const { brand, dept, postalCode, targetGeo } = searchIntent;
      const pDept = getItemDepartment(p);
      const pBrands = (p.brands || []).map((b: string) => normalizeText(b));
      const pTitle = normalizeText(p.title);

      if (brand) {
        const normBrand = normalizeText(brand);
        if (!pTitle.includes(normBrand) && !pBrands.some((b: string) => b.includes(normBrand))) return false;
      }
      if (dept && pDept !== dept) return false;

      if (targetGeo && mapBounds && mapZoom >= 10 && (postalCode || searchIntent.city)) {
        const isInViewport = p.latitude >= mapBounds.getSouth() && p.latitude <= mapBounds.getNorth() &&
                             p.longitude >= mapBounds.getWest() && p.longitude <= mapBounds.getEast();
        if (!isInViewport) return false;
      }
      return true;
    });
  }, [points, searchIntent, activeFilters, mapBounds, mapZoom]);

  const listPoints = useMemo(() => {
    return [...filteredPoints]
      .sort((a, b) => {
        if (a.id === selectedId) return -1;
        if (b.id === selectedId) return 1;
        const distA = Math.pow(a.latitude - mapCenter[0], 2) + Math.pow(a.longitude - mapCenter[1], 2);
        const distB = Math.pow(b.latitude - mapCenter[0], 2) + Math.pow(b.longitude - mapCenter[1], 2);
        return distA - distB;
      })
      .slice(0, 50);
  }, [filteredPoints, mapCenter, selectedId]);

  const labelPoints = useMemo(() => {
    if (mapZoom < 13) return [];
    const gridStep = mapZoom < 14 ? 0.012 : (mapZoom < 15 ? 0.006 : 0.002);
    const seen = new Set<string>();
    const results: MapPoint[] = [];

    const selected = filteredPoints.find(p => p.id === selectedId);
    if (selected) {
      seen.add(`${Math.floor(selected.latitude / gridStep)},${Math.floor(selected.longitude / gridStep)}`);
      results.push(selected);
    }
    filteredPoints.forEach(p => {
      if (p.id === selectedId) return;
      const key = `${Math.floor(p.latitude / gridStep)},${Math.floor(p.longitude / gridStep)}`;
      if (!seen.has(key)) { seen.add(key); results.push(p); }
    });
    return results;
  }, [filteredPoints, mapZoom, selectedId]);

  useEffect(() => {
    if (searchIntent && searchIntent.targetGeo && selectionSource === 'external') {
      setMapCenter(searchIntent.targetGeo.coords);
      setMapZoom(searchIntent.targetGeo.zoom);
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
    if (p) { setMapCenter([p.latitude, p.longitude]); setSelectionSource('marker'); }
    setSelectedId(id);
    if (isMobile) setDrawerHeight('half');
  };

  const handleUserInteraction = () => {
    if (isMobile) setDrawerHeight('collapsed');
  };

  const FilterButtons = ({ mobile = false }) => {
    const filters = [
      { id: 'shopping', label: 'CONCESS', icon: Bike },
      { id: 'service', label: 'ATELIER', icon: Wrench },
      { id: 'association', label: 'ASSO', icon: Users },
      { id: 'relais', label: 'RELAIS', icon: Utensils }
    ];

    const toggleDrawer = () => {
      setDrawerHeight(prev => prev === 'collapsed' ? 'half' : (prev === 'full' ? 'half' : 'collapsed'));
    };

    const renderFilter = (f: typeof filters[0]) => {
      const isActive = activeFilters.includes(f.id);
      return (
        <button key={f.id} onClick={() => handleFilterToggle(f.id)} className="flex flex-col items-center gap-2 group shrink-0">
          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all border-2 shadow-sm", isActive ? "bg-brand text-white border-white scale-110 shadow-lg" : "bg-white text-muted-foreground border-transparent hover:border-brand/20")}>
            <f.icon className="h-6 w-6" />
          </div>
          <span className={cn("text-[9px] font-black uppercase tracking-tight leading-none text-center", isActive ? "text-foreground" : "text-muted-foreground")}>{f.label}</span>
        </button>
      );
    };

    if (mobile) {
      return (
        <div className="relative w-full bg-white rounded-t-[28px] min-h-[140px] pt-14 pb-4 px-2 overflow-visible">
          <button onClick={toggleDrawer} className="absolute top-4 right-6 z-[1600] p-2 bg-muted/20 hover:bg-muted/40 rounded-full text-brand transition-all active:scale-90">
            {drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </button>
          <div className="grid grid-cols-4 items-start justify-between gap-1 relative z-10">
            {filters.map(f => <div key={f.id} className="col-span-1 flex justify-center">{renderFilter(f)}</div>)}
          </div>
        </div>
      );
    }
    return <div className="flex items-center justify-center gap-8"><div className="flex gap-4">{filters.map(renderFilter)}</div></div>;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <MapComponent
          points={filteredPoints}
          labelPoints={labelPoints}
          center={mapCenter}
          zoom={mapZoom}
          selectedId={selectedId}
          selectionSource={selectionSource}
          onMarkerClick={handleMarkerClick}
          onMapClick={() => { setSelectedId(null); setIsDetailView(false); }}
          onMapChange={(c, z, b) => { setMapCenter(c); setMapZoom(z); setMapBounds(b); setSelectionSource(null); }}
          onUserInteraction={handleUserInteraction}
          bottomPadding={bottomPadding}
          leftPadding={leftPadding}
          isLocating={isLocating}
          onLocateEnd={() => setIsLocating(false)}
          onLocationFound={(c) => { setMapCenter(c); setSelectionSource('external'); }}
          deptCounts={deptCounts}
        />
      </div>

      <div className={cn("absolute top-6 z-[1500] pointer-events-none", isMobile ? "left-6 right-6" : "right-6 w-[400px]")}>
        <div className="pointer-events-auto">
          <Header
            searchOnly={!isMobile}
            searchTerm={searchTerm}
            onSearchTermChange={(val: string) => { setSearchTerm(val); setSelectionSource('external'); }}
            onSearch={() => setSelectionSource('external')}
          />
        </div>
      </div>

      {!isMobile && (
        <aside className="absolute top-6 left-6 bottom-6 w-[520px] bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl z-[1000] border border-white/40 flex flex-col overflow-hidden">
          <div className="px-10 py-8 shrink-0 flex items-center justify-between border-b border-muted/30">
            <div className="shrink-0">
              <LabelMotoLogo noBubble className="w-32 md:w-40 px-0 shadow-none border-none bg-transparent" />
            </div>
            <div className="flex-1 text-center px-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-foreground leading-tight">TROUVER UNE CONCESSION ?</p>
              <p className="text-[11px] font-black italic text-brand leading-none">FINI LA GALÈRE.</p>
            </div>
            <div className="shrink-0"><UserMenu /></div>
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
                <div className="flex items-center justify-between px-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{filteredPoints.length} Résultats trouvés</span>
                </div>
                {listPoints.map(p => (
                  <DealershipCardItem key={p.id} point={p} isSelected={p.id === selectedId} onClick={() => handleMarkerClick(p.id)} onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); }} />
                ))}
                {filteredPoints.length === 0 && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                    <p className="font-black uppercase tracking-tight text-muted-foreground">Aucun résultat</p>
                  </div>
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
                  {filteredPoints.length === 0 && (
                    <div className="text-center py-10 opacity-50"><p className="font-black uppercase text-xs">Aucun résultat</p></div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        className={cn("absolute right-6 z-[500] h-14 w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all", isMobile ? "bottom-44" : "bottom-10")}
        onClick={() => setIsLocating(true)}
      >
        <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
      </button>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand" /></div>}>
      <MapPageComponent />
    </Suspense>
  );
}
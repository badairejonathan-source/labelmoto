'use client';

import React, { useState, useEffect, useMemo, Suspense, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCardItem from '@/components/app/dealership-card';
import type { MapPoint, Dealership } from '@/lib/types';
import Header, { UserMenu } from '@/components/app/header';
import LabelMotoLogo from '@/components/app/logo';
import { Compass, Loader2, MapPin, Bike, Wrench, Users, Utensils, ArrowLeft, Phone, Globe, ChevronRight, Clock, ChevronUp, ChevronDown, MessageSquare, Map as MapIcon, Camera } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn, normalizeText, getItemDepartment } from "@/lib/utils";
import { extractValidCoordinates } from "@/lib/geohash";
import { useFirebase, useMemoFirebase, useDoc } from '@/firebase/client';
import { initializeFirebaseClient } from '@/firebase/config-client';
import { collection, getDocs, query, limit, doc, getDoc, getFirestore } from "firebase/firestore";
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import locationsData from '@/data/locations.json';

const MOTORCYCLE_BRANDS = [
  "Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "BMW Motorrad",
  "Ducati", "Triumph", "Harley-Davidson", "KTM", "Aprilia",
  "Moto Guzzi", "Royal Enfield", "Indian", "Piaggio", "Vespa", "Can-Am", "CFMoto"
];

// ============================================================
// IndexedDB Cache
// ============================================================
const IDB_NAME = 'LabelMotoDB';
const IDB_VERSION = 10; // Bump version to force clear old/incomplete cache
const IDB_STORE = 'points';
const IDB_KEY = 'all_points';
const CACHE_TTL = 30 * 60 * 1000;

async function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (db.objectStoreNames.contains(IDB_STORE)) db.deleteObjectStore(IDB_STORE);
      db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
  });
}

async function getCachedPoints(): Promise<MapPoint[] | null> {
  if (typeof window === 'undefined') return null;
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = (e) => {
        const result = (e.target as IDBRequest).result;
        if (result && result.timestamp && Date.now() - result.timestamp < CACHE_TTL) resolve(result.points);
        else resolve(null);
      };
      req.onerror = () => resolve(null);
    });
  } catch { return null; }
}

async function setCachedPoints(points: MapPoint[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await openIDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put({ points, timestamp: Date.now() }, IDB_KEY);
  } catch {}
}

const MapComponent = dynamic(
  () => import('@/components/app/map-component').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div> }
);

const SidebarDetailView = ({ dealershipId, point, onBack }: { dealershipId: string, point?: MapPoint, onBack: () => void }) => {
  const { firestore } = useFirebase();
  const col = point?.appSection === 'association' ? 'associations' : (point?.appSection === 'relais' ? 'relais' : (point?.appSection === 'creator' ? 'creators' : 'concessions'));
  const docRef = useMemoFirebase(() => (firestore && dealershipId) ? doc(firestore, col, dealershipId) : null, [firestore, col, dealershipId]);
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
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
              <p className="text-sm font-bold leading-snug">{pro.address}</p>
            </div>
            <Button asChild variant="link" className="p-0 h-auto text-brand font-black uppercase text-[10px] ml-8 justify-start">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`} target="_blank" rel="noreferrer">Calculer l'itinéraire</a>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {pro.phoneNumber && (
            <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[9px] border-2">
              <a href={`tel:${pro.phoneNumber}`}><Phone className="mr-1 h-4 w-4" /> Appeler</a>
            </Button>
          )}
          {pro.website && (
            <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[9px] border-2">
              <a href={pro.website} target="_blank" rel="noopener noreferrer"><Globe className="mr-1 h-4 w-4" /> Site</a>
            </Button>
          )}
          <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[9px] border-2">
            <Link href={`/concessions/${pro.slug || pro.id}#reviews`}><MessageSquare className="mr-1 h-4 w-4" /> Avis</Link>
          </Button>
        </div>
        <div className="pt-6 border-t border-dashed">
          <Link href={`/concessions/${pro.slug || pro.id}`} className="block text-center p-4 bg-muted/20 rounded-2xl hover:bg-brand/5 group transition-colors">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand">Fiche complète</span>
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

  const listScrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);
  const [deptCounts, setDeptCounts] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeFilters, setActiveFilters] = useState<string[]>(['shopping', 'service', 'association', 'relais', 'creator']);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('selectedId'));
  const [isDetailView, setIsDetailView] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(6);
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('half');
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>(searchParams.get('selectedId') ? 'external' : null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapBounds, setMapBounds] = useState<any>(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!firestore) return;
      const cached = await getCachedPoints();
      if (cached) {
        setPoints(cached);
        setIsLoadingPoints(false);
        fetchFromFirestore(true);
        return;
      }
      setIsLoadingPoints(true);
      fetchFromFirestore(false);
    };

    const fetchFromFirestore = async (silent: boolean) => {
      if (!firestore) return;
      const collections = ['concessions', 'associations', 'relais', 'creators'];
      const allPoints: MapPoint[] = [];
      const seenIds = new Set<string>();
      
      let debug = { concessions: 0, associations: 0, relais: 0, creators: 0, rejectedCoords: 0, rejectedType: 0 };

      for (const colName of collections) {
        try {
          const snap = await getDocs(query(collection(firestore, colName), limit(15000)));
          if (colName === 'concessions') debug.concessions = snap.size;
          if (colName === 'associations') debug.associations = snap.size;
          if (colName === 'relais') debug.relais = snap.size;
          if (colName === 'creators') debug.creators = snap.size;

          snap.docs.forEach(d => {
            if (seenIds.has(d.id)) return;
            const data = d.data();
            const coords = extractValidCoordinates(data);
            
            if (!coords) { debug.rejectedCoords++; return; }

            const appSection = data.appSection || (colName === 'associations' ? 'association' : (colName === 'relais' ? 'relais' : (colName === 'creators' ? 'creator' : 'shopping')));
            
            seenIds.add(d.id);
            allPoints.push({
              id: d.id,
              latitude: coords.lat,
              longitude: coords.lng,
              category: data.category || appSection,
              appSection: appSection,
              title: data.title || d.id,
              slug: data.slug,
              rating: data.rating,
              imgUrl: data.imageUrl || data.imgUrl,
              address: data.address || "",
              brands: data.brands || []
            } as MapPoint);
          });
        } catch (e) { console.warn(`Erreur ${colName}:`, e); }
      }

      console.log(`[MAP_DEBUG_1] Concessions: ${debug.concessions}`);
      console.log(`[MAP_DEBUG_2] Associations: ${debug.associations}`);
      console.log(`[MAP_DEBUG_3] Relais: ${debug.relais}`);
      console.log(`[MAP_DEBUG_4] Rejetés (Coords): ${debug.rejectedCoords}`);
      console.log(`[MAP_DEBUG_5] Rejetés (Type): ${debug.rejectedType}`);
      console.log(`[MAP_DEBUG_6] TOTAL MARKERS: ${allPoints.length}`);

      setPoints(allPoints);
      setCachedPoints(allPoints);
      if (!silent) setIsLoadingPoints(false);
    };

    fetchAll();
  }, [firestore]);

  useEffect(() => {
    const { firebaseApp } = initializeFirebaseClient();
    if (!firebaseApp) return;
    getDoc(doc(getFirestore(firebaseApp), 'cache', 'departements_count')).then(snap => {
      if (snap.exists()) setDeptCounts(snap.data().counts);
    });
  }, []);

  const searchIntent = useMemo(() => {
    if (!searchTerm) return null;
    const lower = normalizeText(searchTerm);
    const brand = MOTORCYCLE_BRANDS.find(b => lower.includes(normalizeText(b))) || null;
    const deptMatch = lower.match(/\b(0[1-9]|[1-8]\d|9[0-5]|2[AB]|97[1-46])\b/);
    const dept = deptMatch ? deptMatch[0].toUpperCase() : null;
    return { brand, dept, original: lower };
  }, [searchTerm]);

  const filteredPoints = useMemo(() => {
    return points.filter(p => {
      const section = p.appSection === 'both' ? 'shopping' : p.appSection;
      if (!activeFilters.includes(section)) return false;
      if (!searchIntent) return true;
      const { brand, dept } = searchIntent;
      if (brand && !normalizeText(p.title).includes(normalizeText(brand)) && !(p.brands || []).some((b: string) => normalizeText(b).includes(normalizeText(brand)))) return false;
      if (dept && getItemDepartment(p) !== dept) return false;
      return true;
    });
  }, [points, searchIntent, activeFilters]);

  const listPoints = useMemo(() => {
    return [...filteredPoints].sort((a, b) => {
        if (a.id === selectedId) return -1;
        if (b.id === selectedId) return 1;
        const distA = Math.pow(a.latitude - mapCenter[0], 2) + Math.pow(a.longitude - mapCenter[1], 2);
        const distB = Math.pow(b.latitude - mapCenter[0], 2) + Math.pow(b.longitude - mapCenter[1], 2);
        return distA - distB;
      }).slice(0, 50);
  }, [filteredPoints, mapCenter, selectedId]);

  const handleMarkerClick = useCallback((id: string) => {
    const p = points.find(x => x.id === id);
    if (p) {
      setMapCenter([p.latitude, p.longitude]);
      setSelectionSource('marker');
      setMapZoom(prev => Math.max(prev, 12));
    }
    setSelectedId(id);
    if (width && width < 1024) setDrawerHeight('half');
  }, [points, width]);

  const FilterButtons = ({ mobile = false }) => {
    const filters = [
      { id: 'shopping', label: 'CONCESS', icon: Bike },
      { id: 'service', label: 'ATELIER', icon: Wrench },
      { id: 'association', label: 'ASSO', icon: Users },
      { id: 'relais', label: 'RELAIS', icon: Utensils }
    ];

    const renderFilter = (f: any) => {
      const isActive = activeFilters.includes(f.id);
      return (
        <button key={f.id} onClick={() => setActiveFilters(prev => prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id])} className="flex flex-col items-center gap-2 group shrink-0">
          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all border-2", isActive ? "bg-brand text-white border-white scale-110 shadow-lg" : "bg-white text-muted-foreground border-transparent")}>
            <f.icon className="h-6 w-6" />
          </div>
          <span className={cn("text-[9px] font-black uppercase", isActive ? "text-foreground" : "text-muted-foreground")}>{f.label}</span>
        </button>
      );
    };

    if (mobile) return <div className="grid grid-cols-4 items-start pt-14 pb-4 px-2">{filters.map(f => <div key={f.id} className="flex justify-center">{renderFilter(f)}</div>)}</div>;
    return <div className="flex gap-4">{filters.map(renderFilter)}</div>;
  };

  const isMobile = width !== undefined && width < 1024;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <MapComponent
        points={filteredPoints}
        center={mapCenter}
        zoom={mapZoom}
        selectedId={selectedId}
        selectionSource={selectionSource}
        onMarkerClick={handleMarkerClick}
        onMapClick={() => { setSelectedId(null); setIsDetailView(false); }}
        onMapChange={(c, z) => { setMapCenter(c); setMapZoom(z); setSelectionSource(null); }}
        isLocating={isLocating}
        onLocateEnd={() => setIsLocating(false)}
        onLocationFound={(c) => { setMapCenter(c); setSelectionSource('external'); }}
        deptCounts={deptCounts}
      />

      <div className={cn("absolute top-6 z-[1500] pointer-events-none", isMobile ? "left-6 right-6" : "right-6 w-[400px]")}>
        <div className="pointer-events-auto">
          <Header searchOnly={!isMobile} searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => setSelectionSource('external')} />
        </div>
      </div>

      {!isMobile && (
        <aside className="absolute top-6 left-6 bottom-6 w-[520px] bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl z-[1000] border border-white/40 flex flex-col overflow-hidden">
          <div className="px-10 py-8 shrink-0 flex items-center justify-between border-b border-muted/30">
            <LabelMotoLogo noBubble className="w-32 md:w-40 px-0 shadow-none border-none bg-transparent" />
            <UserMenu />
          </div>
          <div className="px-10 py-8 shrink-0"><FilterButtons /></div>
          <div ref={listScrollRef} className="flex-1 overflow-y-auto p-10 pt-4 custom-scrollbar">
            {isDetailView && selectedId ? (
              <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => setIsDetailView(false)} />
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">{isLoadingPoints ? 'Chargement...' : `${filteredPoints.length} Résultats`}</p>
                {listPoints.map(p => (
                  <div key={p.id} ref={el => { cardRefs.current[p.id] = el; }}>
                    <DealershipCardItem point={p} isSelected={p.id === selectedId} onClick={() => handleMarkerClick(p.id)} onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      {isMobile && (
        <div className={cn("fixed left-0 right-0 bg-white rounded-t-[28px] shadow-2xl transition-all duration-500 z-[1100]", drawerHeight === 'collapsed' ? 'bottom-0 h-[140px]' : (drawerHeight === 'half' ? 'bottom-0 h-[50vh]' : 'bottom-0 h-[85vh]'))}>
          <button onClick={() => setDrawerHeight(prev => prev === 'collapsed' ? 'half' : (prev === 'full' ? 'half' : 'collapsed'))} className="absolute top-4 right-6 p-2 bg-muted/20 rounded-full text-brand">
            {drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </button>
          <FilterButtons mobile />
          <div ref={listScrollRef} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {isDetailView && selectedId ? (
              <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => { setIsDetailView(false); setDrawerHeight('half'); }} />
            ) : (
              <div className="space-y-4">
                {listPoints.map(p => (
                   <div key={p.id} ref={el => { cardRefs.current[p.id] = el; }}>
                    <DealershipCardItem point={p} isSelected={p.id === selectedId} onClick={() => handleMarkerClick(p.id)} onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); setDrawerHeight('full'); }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button className={cn("absolute right-6 z-[500] h-14 w-14 rounded-full bg-white text-brand shadow-2xl flex items-center justify-center transition-all", isMobile ? "bottom-44" : "bottom-10")} onClick={() => setIsLocating(true)}>
        <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
      </button>
    </div>
  );
}

export default function MapPage() {
  return <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand" /></div>}><MapPageComponent /></Suspense>;
}

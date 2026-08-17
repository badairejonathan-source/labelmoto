'use client';

import React, { useState, useEffect, useMemo, Suspense, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import DealershipCardItem from '@/components/app/dealership-card';
import type { MapPoint, Dealership } from '@/lib/types';
import Header from '@/components/app/header';
const UserMenu = dynamic(() => import('@/components/app/user-menu'), {
  ssr: false,
  loading: () => <div className="h-[73px] w-[73px] md:h-[83px] md:w-[83px] rounded-full bg-white/50 border-2 border-white shadow-xl" />
});
import LabelMotoLogo from '@/components/app/logo';
import { Compass, Loader2, MapPin, Bike, Wrench, Users, Utensils, ArrowLeft, Phone, Globe, ChevronRight, Clock, ChevronUp, ChevronDown, MessageSquare, Map as MapIcon, Camera } from 'lucide-react';
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
  const col = point?.appSection === 'association' ? 'associations' : (point?.appSection === 'relais' ? 'relais' : (point?.appSection === 'creator' ? 'creators' : 'concessions'));

  const docRef = useMemoFirebase(() => {
    if (!firestore || !dealershipId) return null;
    return doc(firestore, col, dealershipId);
  }, [firestore, col, dealershipId]);

  const { data: pro, isLoading } = useDoc<Dealership>(docRef);

  if (isLoading) return <div className="p-8 space-y-6"><Skeleton className="h-48 w-full rounded-3xl" /><Skeleton className="h-8 w-3/4" /></div>;
  if (!pro) return null;

  if (point?.appSection === 'creator') {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {(pro as any).photoUrl ? (
              <img src={(pro as any).photoUrl} alt={pro.title} className="w-16 h-16 rounded-full object-cover border-4 border-brand" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center border-4 border-brand">
                <span className="text-2xl font-black text-brand">{pro.title?.[0]?.toUpperCase()}</span>
              </div>
            )}
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">{pro.title}</h3>
              <p className="text-sm font-black uppercase text-brand italic">{(pro as any).activite || pro.category}</p>
            </div>
          </div>
          {(pro as any).description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{(pro as any).description}</p>
          )}
          <div className="space-y-3">
            {(pro as any).instagram && (
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-2xl">
                <Camera className="h-4 w-4 text-brand shrink-0" />
                <a href={`https://instagram.com/${(pro as any).instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="font-bold text-brand text-sm hover:underline">{(pro as any).instagram}</a>
              </div>
            )}
            {(pro as any).ville && (
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-2xl">
                <MapPin className="h-4 w-4 text-brand shrink-0" />
                <span className="font-bold text-sm">{(pro as any).ville}</span>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-dashed">
            <Link href={`/creators/${pro.slug || pro.id}`} className="block text-center p-4 bg-muted/20 rounded-2xl hover:bg-brand/5 group transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand">Voir le profil complet</span>
              <ChevronRight className="inline-block h-3 w-3 ml-2 text-muted-foreground group-hover:text-brand" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-muted/30 p-5 rounded-3xl border-2 border-dashed hover:border-brand hover:bg-brand/5 transition-all group"
        >
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div className="min-w-0">
              <p className="text-sm font-bold leading-snug">{pro.address}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand mt-1">📍 Obtenir l'itinéraire →</p>
            </div>
          </div>
        </a>
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
        {/* Horaires */}
        {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].some(d => (pro as any)[d]) && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-brand" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Horaires</span>
            </div>
            <div className="space-y-1.5">
              {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(day => (
                <div key={day} className="flex justify-between items-center text-xs border-b border-dashed border-muted pb-1 last:border-0">
                  <span className="capitalize text-muted-foreground font-bold">{day}</span>
                  <span className="font-black text-foreground">{(pro as any)[day] || 'Fermé'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Lien fiche complète */}
        <Link href={`/concessions/${pro.slug || pro.id}`} className="block text-center p-3 bg-brand/5 rounded-2xl hover:bg-brand/10 transition-colors border border-brand/20">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand">Voir la fiche complète →</span>
        </Link>
      </div>
    </div>
  );
};

function MapPageComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { width } = useWindowSize();
  const { firestore } = useFirebase();

  const listScrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const loadedDepts = useRef<Set<string>>(new Set());
  const boundsTimerRef = useRef(null as any);
  const mapZoomRef = useRef(6);

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const [deptCounts, setDeptCounts] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const filterParam = searchParams.get('filter');
  const [activeFilters, setActiveFilters] = useState<string[]>(filterParam ? filterParam.split(',').filter(Boolean) : []);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('selectedId'));
  const [isDetailView, setIsDetailView] = useState(false);
  const initLat = parseFloat(searchParams.get('lat') || '');
  const initLng = parseFloat(searchParams.get('lng') || '');
  const initZoom = parseInt(searchParams.get('zoom') || '');
  const hasInitCoords = !isNaN(initLat) && !isNaN(initLng);
  const [mapCenter, setMapCenter] = useState<[number, number]>(hasInitCoords ? [initLat, initLng] : [46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(hasInitCoords ? (isNaN(initZoom) ? 12 : initZoom) : 6);
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('collapsed');
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>(searchParams.get('selectedId') ? 'external' : null);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [deptToFit, setDeptToFit] = useState<string | null>(null);
  const [bboxToFit, setBboxToFit] = useState<[number, number, number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState(false);
  const handleLocate = () => {
    if (!navigator.geolocation) { setLocateError(true); setTimeout(() => setLocateError(false), 3000); return; }
    setIsLocating(true); setLocateError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setMapCenter([pos.coords.latitude, pos.coords.longitude]); setMapZoom(14); setIsLocating(false); },
      () => { setIsLocating(false); setLocateError(true); setTimeout(() => setLocateError(false), 3000); },
      { timeout: 8000, maximumAge: 30000 }
    );
  };

  // Synchroniser le ref avec l'état
  useEffect(() => { mapZoomRef.current = mapZoom; }, [mapZoom]);
  // Sync état -> URL (permet au bouton retour de restaurer l'état)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (activeFilters.length > 0 && activeFilters.length < 5) params.set('filter', activeFilters.join(','));
    if (selectedId) params.set('selectedId', selectedId);
    if (mapCenter[0] !== 46.5 || mapCenter[1] !== 2.2) {
      params.set('lat', mapCenter[0].toFixed(4));
      params.set('lng', mapCenter[1].toFixed(4));
    }
    if (mapZoom !== 6) params.set('zoom', mapZoom.toString());
    const newUrl = params.toString() ? '/map?' + params.toString() : '/map';
    router.replace(newUrl, { scroll: false });
  }, [searchTerm, activeFilters, selectedId, mapCenter, mapZoom]);


  const isMobile = width !== undefined && width < 1024;
  const bottomPadding = isMobile ? (drawerHeight === 'full' ? 500 : (drawerHeight === 'half' ? 350 : 140)) : 0;
  const leftPadding = !isMobile ? 544 : 0;

  // CHARGEMENT STATIQUE DEPUIS points.json
  useEffect(() => {
    setIsLoadingPoints(true);
    setTimeout(() => {
    fetch('https://storage.googleapis.com/studio-4801889514-40ebd.firebasestorage.app/public/points.json')
      .catch(() => fetch('/points.json'))
      .then(r => r.json())
      .then((data: any[]) => {
        const mapped: MapPoint[] = data.map(p => ({
          id: p.id,
          latitude: p.lat,
          longitude: p.lng,
          title: p.t,
          slug: p.s,
          appSection: p.a,
          category: p.c || 'concession',
          rating: p.r || null,
          imgUrl: p.i || null,
          address: p.addr || '',
          brands: p.b || [],
        } as MapPoint));
        setPoints(mapped);
        setIsLoadingPoints(false);
      })
      .catch(e => {
        console.error('[MAP] Erreur chargement points.json:', e);
        setIsLoadingPoints(false);
      });
    }, 200);
  }, []);

    // Chargement du cache départements
  useEffect(() => {
    const { firebaseApp } = initializeFirebaseClient();
    if (!firebaseApp) return;
    const db = getFirestore(firebaseApp);
    getDoc(doc(db, 'cache', 'departements_count'))
      .then(snap => { if (snap.exists()) setDeptCounts(snap.data().counts); })
      .catch(() => {});
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

    let cityTokens = tokens.filter(t => t !== postalCode && t !== dept && (!brand || !normalizeText(brand).includes(t)));
    if (cityTokens.length > 0) city = cityTokens.join(" ");

    let targetGeo: { coords: [number, number], zoom: number } | null = null;
    if (postalCode) {
      const deptCode = postalCode.substring(0, 2);
      const loc = Object.entries(locationsData).find(([k]) => k.startsWith(deptCode));
      if (loc) targetGeo = { coords: (loc[1] as any).center, zoom: 12 };
    } else if (!dept && city) {
      for (const [, info] of Object.entries(locationsData)) {
        const foundCity = (info as any).cities.find((c: string) => normalizeText(c) === city || city?.includes(normalizeText(c)));
        if (foundCity) { targetGeo = { coords: (info as any).center, zoom: 11 }; break; }
      }
    } else if (dept && city) {
      const loc = Object.entries(locationsData).find(([k]) => k.startsWith(dept));
      if (loc) targetGeo = { coords: (loc[1] as any).center, zoom: 11 };
    }

    return { brand, dept, postalCode, city, targetGeo };
  }, [searchTerm]);

  // Si on arrive via une fiche (selectedId) sans filtre choisi, activer le filtre de sa collection
  useEffect(() => {
    if (activeFilters.length > 0) return;
    if (!selectedId || points.length === 0) return;
    const target = points.find(p => p.id === selectedId);
    if (!target) return;
    const section = target.appSection === 'both' ? 'shopping' : target.appSection;
    if (section) setActiveFilters([section]);
  }, [selectedId, points, activeFilters.length]);

  const filteredPoints = useMemo(() => {
    return points.filter(p => {
      if (p.appSection === 'both') {
        if (!activeFilters.includes('shopping') && !activeFilters.includes('service')) return false;
      } else {
        if (!activeFilters.includes(p.appSection)) return false;
      }
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

      if (targetGeo && mapBounds && mapZoom >= 11 && (postalCode || searchIntent.city)) {
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
      .slice(0, 60);
  }, [filteredPoints, mapCenter, selectedId]);

  const labelPoints = useMemo(() => {
    if (mapZoom < 13) return [];
    const gridStep = mapZoom < 14 ? 0.012 : 0.006;
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

  const handleMarkerClick = useCallback((id: string) => {
    const p = points.find(x => x.id === id);
    if (p) {
      setMapCenter([p.latitude, p.longitude]);
      setSelectionSource('marker');
      setMapZoom(prev => Math.max(prev, 12));
      // Mise à jour immédiate des bounds pour éviter le filtrage des marqueurs
      const delta = 0.05;
      setMapBounds({
        getSouth: () => p.latitude - delta,
        getNorth: () => p.latitude + delta,
        getWest: () => p.longitude - delta,
        getEast: () => p.longitude + delta,
      });
    }
    setSelectedId(id);
    setIsDetailView(false);
    if (isMobile) setDrawerHeight('half');
  }, [points, isMobile]);

  const FilterButtons = ({ mobile = false }) => {
    const filters = [
      { id: 'shopping', label: 'CONCESS', icon: Bike },
      { id: 'service', label: 'ATELIER', icon: Wrench },
      { id: 'association', label: 'ASSO', icon: Users },
      { id: 'relais', label: 'RELAIS', icon: Utensils },
      { id: 'creator', label: 'CRÉATEURS', icon: Camera }
    ];

    const renderFilter = (f: typeof filters[0]) => {
      const isActive = activeFilters.includes(f.id);
      return (
        <button key={f.id} onClick={() => setActiveFilters(prev => prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id])} className="flex flex-col items-center gap-2 group shrink-0">
          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all border-2 shadow-sm", isActive ? "bg-brand text-white border-white scale-110 shadow-lg" : "bg-white text-muted-foreground border-transparent hover:border-brand/20")}>
            <f.icon className="h-6 w-6" />
          </div>
          <span className={cn("text-[9px] font-black uppercase tracking-tight leading-none text-center", isActive ? "text-foreground" : "text-muted-foreground")}>{f.label}</span>
        </button>
      );
    };

    if (mobile) {
      return (
        <div className="relative w-full bg-white rounded-t-[28px] min-h-[116px] pt-8 pb-1 px-2 overflow-visible">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {activeFilters.length === 0 ? 'Choisir un filtre' : 'Categories actives'}
            </p>
          <button onClick={() => setDrawerHeight(prev => prev === 'collapsed' ? 'half' : (prev === 'full' ? 'half' : 'collapsed'))} className="absolute top-4 right-6 z-[1600] p-2 bg-muted/20 hover:bg-muted/40 rounded-full text-brand transition-all">
            {drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </button>
          <div className="flex overflow-x-auto gap-4 px-2 pb-1 filter-scroll">
            {filters.map(f => <div key={f.id} className="flex-shrink-0">{renderFilter(f)}</div>)}
          </div>
        </div>
      );
    }
    return <div className="flex items-center justify-center gap-8"><div className="flex gap-4">{filters.map(renderFilter)}</div></div>;
  };

  return (
    <div className="relative w-full h-screen [height:100dvh] overflow-hidden bg-background">
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
          bottomPadding={bottomPadding}
          leftPadding={leftPadding}
          deptCounts={deptCounts}
          deptToFit={deptToFit}
          bboxToFit={bboxToFit}
          isMobile={isMobile}
        />
      </div>

      <div className={cn("absolute top-6 z-[1500]", isMobile ? "left-6 right-6" : "right-6 w-[400px]")}>
        <Header
          searchOnly={!isMobile}
          searchTerm={searchTerm}
          onSearchTermChange={(val: string) => { setSearchTerm(val); }}
          onSearch={() => setSelectionSource('external')}
          onSuggestionSelect={(lat, lng, bbox, dealerId) => {
            if (bbox) { setBboxToFit(bbox); setDeptToFit(null); }
            else if (dealerId) handleMarkerClick(dealerId);
            else { setMapCenter([lat, lng]); setSelectionSource('external'); }
          }}
        />
        {isMobile && (
          <div className="flex justify-end mt-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Iles DOM-TOM"
                  className="h-12 w-12 rounded-full bg-white/95 shadow-md border border-border flex flex-col items-center justify-center leading-none text-[9px] font-black uppercase tracking-tight text-muted-foreground active:scale-95 transition-all"
                >
                  <span>DOM</span>
                  <span>TOM</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[1600]">
                {[
                  { label: 'La Reunion', center: [-21.1, 55.5] as [number, number], zoom: 10 },
                  { label: 'Martinique', center: [14.6, -61.0] as [number, number], zoom: 10 },
                  { label: 'Guadeloupe', center: [16.2, -61.5] as [number, number], zoom: 10 },
                ].map(t => (
                  <DropdownMenuItem key={t.label} onClick={() => { setMapCenter(t.center); setMapZoom(t.zoom); setSelectionSource('external'); }}>
                    {t.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {!isMobile && (
        <aside className="absolute top-6 left-6 bottom-6 w-[520px] bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl z-[1000] border border-white/40 flex flex-col overflow-hidden">
          <div className="px-10 py-8 shrink-0 flex items-center justify-between border-b border-muted/30">
            <div className="shrink-0"><LabelMotoLogo noBubble className="w-32 md:w-40 px-0 shadow-none border-none bg-transparent" /></div>
            <div className="shrink-0"><UserMenu /></div>
          </div>
          <div className="px-10 py-8 pb-6 shrink-0 space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Catégories actives</p>
            <FilterButtons />
          </div>
          <div ref={listScrollRef} className="flex-1 overflow-y-auto p-10 pt-4 custom-scrollbar">
            {isDetailView && selectedId ? (
              <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => setIsDetailView(false)} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {isLoadingPoints ? "Chargement national..." : `${filteredPoints.length} Résultats trouvés`}
                  </span>
                </div>
                {listPoints.map(p => (
                  <div key={p.id} ref={el => { cardRefs.current[p.id] = el; }}>
                    <DealershipCardItem
                      point={p}
                      isSelected={p.id === selectedId}
                      onClick={() => handleMarkerClick(p.id)}
                      onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      {isMobile && (
        <div className={cn("fixed left-0 right-0 bg-white rounded-t-[28px] shadow-2xl transition-all duration-500 ease-out z-[1100]", drawerHeight === 'collapsed' ? 'bottom-0 h-[116px]' : (drawerHeight === 'half' ? 'bottom-0 h-[65vh]' : 'bottom-0 h-[85vh]'))}>
          <div className="h-full flex flex-col">
            <div className="shrink-0"><FilterButtons mobile /></div>
            <div ref={listScrollRef} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {isDetailView && selectedId ? (
                <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => { setIsDetailView(false); setDrawerHeight('half'); }} />
              ) : (
                <div className="space-y-4">
                  {listPoints.map(p => (
                    <div key={p.id} ref={el => { cardRefs.current[p.id] = el; }}>
                      <DealershipCardItem
                        point={p}
                        isSelected={p.id === selectedId}
                        onClick={() => handleMarkerClick(p.id)}
                        onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); setDrawerHeight('full'); }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Bouton boussole */}
      <button
        type="button"
        onClick={handleLocate}
        aria-label="Me localiser"
        className="fixed right-4 z-[1200] h-12 w-12 rounded-full bg-white shadow-xl border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ bottom: isMobile ? (drawerHeight === 'collapsed' ? '156px' : drawerHeight === 'half' ? 'calc(65vh + 12px)' : 'calc(85vh + 12px)') : '24px' }}
      >
        {isLocating ? <Loader2 className="h-5 w-5 text-brand animate-spin" /> : locateError ? <span className="text-red-500 font-black text-sm">X</span> : <Compass className="h-5 w-5 text-brand" />}
      </button>
      {!isMobile && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1200] flex gap-2">
          {[
            { label: "La Reunion", center: [-21.1, 55.5] as [number, number], zoom: 10 },
            { label: "Martinique", center: [14.6, -61.0] as [number, number], zoom: 10 },
            { label: "Guadeloupe", center: [16.2, -61.5] as [number, number], zoom: 10 },
          ].map(t => (
            <button key={t.label} type="button"
              onClick={() => { setMapCenter(t.center); setMapZoom(t.zoom); setSelectionSource('external'); }}
              className="px-3 py-2 rounded-full bg-white/95 shadow-md border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand hover:border-brand transition-all min-h-[36px]"
            >{t.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="h-screen [height:100dvh] w-full flex items-center justify-center bg-background"><Loader2 className="h-10 w-10 animate-spin text-brand" /></div>}>
      <MapPageComponent />
    </Suspense>
  );
}


'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import DealershipCardItem from '@/components/app/dealership-card';
import AdCard from '@/components/app/ad-card';
import type { MapPoint, Dealership } from '@/lib/types';
import Header, { UserMenu } from '@/components/app/header';
import { Compass, Loader2, ChevronUp, ChevronDown, Sparkles, FileText, MapPin, Home, Bike, Wrench, Users, Utensils } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from "@/lib/utils";
import { useFirebase } from '@/firebase';
import { collection, getDocs, query, limit, where, orderBy, startAt, endAt } from "firebase/firestore";
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import locationsData from '@/data/locations.json';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import { getGeohashCells, extractValidCoordinates } from '@/lib/geohash';

const CIRCUIT_BUGATTI: MapPoint = {
  id: 'circuit-bugatti-le-mans',
  title: 'Circuit Bugatti - Le Mans',
  latitude: 47.9546,
  longitude: 0.2078,
  category: 'Circuit',
  appSection: 'both',
};

const ZOOM_THRESHOLD = 8.0; 
const MAX_ACTIVE_CELLS = 150; 
const OVERVIEW_LIMIT = 6000; 

const MOTORCYCLE_BRANDS = [
  'honda', 'yamaha', 'bmw', 'kawasaki', 'suzuki', 'ducati', 'ktm', 'triumph', 
  'harley-davidson', 'harley', 'royal enfield', 'cfmoto', 'piaggio', 'peugeot', 
  'aprilia', 'moto guzzi', 'indian', 'husqvarna', 'benelli', 'mash', 'voge'
];

const cityCoordsCache: Record<string, [number, number]> = {};

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

const getDistanceSq = (anchor: [number, number], point: MapPoint) => {
    if (point.latitude == null || point.longitude == null) return Infinity;
    const dx = anchor[1] - point.longitude;
    const dy = anchor[0] - point.latitude;
    return dx * dx + dy * dy;
};

const getCityCoordinates = async (postalCode: string, signal?: AbortSignal): Promise<[number, number] | null> => {
  if (cityCoordsCache[postalCode]) return cityCoordsCache[postalCode];
  
  try {
    const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=centre`, { signal });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.length > 0) {
      const { coordinates } = data[0].centre;
      const coords: [number, number] = [coordinates[1], coordinates[0]];
      cityCoordsCache[postalCode] = coords;
      return coords;
    }
    return null;
  } catch (error: any) { 
    if (error.name === 'AbortError') return null;
    return null; 
  }
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
  const [sortingAnchor, setSortingAnchor] = useState<[number, number]>([46.5, 2.2]);
  const [mapBoundsStr, setMapBoundsStr] = useState<string | null>(null);
  const [isMapMoving, setIsMapMoving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [hoveredDealershipId, setHoveredDealershipId] = useState<string | null>(null);
  const [selectedDealershipId, setSelectedDealershipId] = useState<string | null>(selectedIdParam || null);
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLoadingLocating] = useState(false);
  
  const [detailCache, setDetailCache] = useState<Record<string, Dealership>>({});
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('half');
  const touchStartY = useRef<number>(0);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const mapUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  const fetchCounter = useRef(0);
  const currentVisibleHashes = useRef<Set<string>>(new Set());

  const masterPointsMap = useRef<Map<string, MapPoint>>(new Map());
  const overviewIds = useRef<Set<string>>(new Set());
  const loadedCells = useRef<Map<string, Set<string>>>(new Map()); 

  const [activeFilter, setActiveFilter] = useState<'shopping' | 'service' | 'association' | 'relais' | null>(() => {
    if (filterParam === 'service') return 'service';
    if (filterParam === 'shopping') return 'shopping';
    if (filterParam === 'association') return 'association';
    if (filterParam === 'relais') return 'relais';
    return null;
  });

  const { width, height } = useWindowSize();
  const isMobile = mounted && width !== undefined && width < 1024;

  // Calcul du padding pour le centrage intelligent (Sidebar = 520px + margin left = 24px)
  const leftPadding = isMobile ? 0 : 544;
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
        setMapCenter(pos); 
        setSortingAnchor(pos); 
        setMapZoom(prev => Math.max(prev, 13));
        setTargetBounds(null);
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

  const processSnapshot = useCallback((snapshot: any, colName: string, defaultAppSection: string) => {
    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      const coords = extractValidCoordinates(data);
      if (!coords) return null;

      const title = data.title || data.name || data.displayName || data.label || doc.id.replace(/-/g, ' ').toUpperCase();

      return {
        id: doc.id,
        title: title,
        latitude: coords.lat,
        longitude: coords.lng,
        category: data.category || (colName === 'associations' ? 'association' : (colName === 'relais' ? 'relais' : 'concession')),
        appSection: data.appSection || (defaultAppSection as any),
        imgUrl: data.imgUrl || data.imageUrl || data.photoUrl || "",
        rating: data.rating,
        geohash: data.geohash,
        brands: Array.isArray(data.brands) ? data.brands : (data.primaryBrand ? [data.primaryBrand] : [])
      };
    }).filter(Boolean) as MapPoint[];
  }, []);

  const pruneMemory = useCallback(() => {
    if (loadedCells.current.size <= MAX_ACTIVE_CELLS) return;
    const [centerLat, centerLng] = mapCenter;
    
    const cellEntries = Array.from(loadedCells.current.entries());
    const cellDistances = cellEntries.map(([hash, pointIds]) => {
      if (currentVisibleHashes.current.has(hash)) return { hash, distSq: -1 };
      
      let cellLat = centerLat, cellLng = centerLng;
      const firstId = Array.from(pointIds)[0];
      const p = masterPointsMap.current.get(firstId);
      if (p) { cellLat = p.latitude; cellLng = p.longitude; }
      
      const distSq = Math.pow(cellLat - centerLat, 2) + Math.pow(cellLng - centerLng, 2);
      return { hash, distSq };
    });

    cellDistances.sort((a, b) => b.distSq - a.distSq);
    
    const cellsToDrop = cellDistances
      .filter(c => c.distSq !== -1)
      .slice(0, Math.max(0, loadedCells.current.size - MAX_ACTIVE_CELLS));

    if (cellsToDrop.length > 0) {
      cellsToDrop.forEach(({ hash }) => {
        const pointIds = loadedCells.current.get(hash);
        if (pointIds) {
          pointIds.forEach(id => {
            if (!overviewIds.current.has(id)) {
              masterPointsMap.current.delete(id);
            }
          });
        }
        loadedCells.current.delete(hash);
      });
      setAllPoints(Array.from(masterPointsMap.current.values()));
    }
  }, [mapCenter]);

  useEffect(() => {
    const fetchInitialSample = async () => {
      if (!firestore || !mounted) return;
      setIsLoading(true);
      try {
        const colRef = collection(firestore, 'concessions');
        const snapshot = await getDocs(query(colRef, limit(OVERVIEW_LIMIT)));
        const points = processSnapshot(snapshot, 'concessions', 'both');
        
        points.forEach((p: MapPoint) => {
          masterPointsMap.current.set(p.id, p);
          overviewIds.current.add(p.id);
        });
        
        setAllPoints(Array.from(masterPointsMap.current.values()));
      } catch (err) { 
        console.error("Erreur de chargement initial:", err); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchInitialSample();
  }, [firestore, mounted, processSnapshot]);

  const fetchPointsInViewport = useCallback(async (bounds: L.LatLngBounds, currentZoom: number) => {
    if (!firestore || currentZoom < ZOOM_THRESHOLD) return;
    
    const precision = currentZoom >= 12 ? 5 : 4;
    const south = bounds.getSouth(), north = bounds.getNorth(), west = bounds.getWest(), east = bounds.getEast();
    const targetHashes = getGeohashCells(south, west, north, east, precision);
    
    currentVisibleHashes.current = new Set(targetHashes.map(h => `${precision}:${h}`));
    
    const missingHashes = targetHashes.filter(h => !loadedCells.current.has(`${precision}:${h}`));
    if (missingHashes.length === 0) return;

    const hashesToQuery = missingHashes.slice(0, 16);
    const requestId = ++fetchCounter.current;
    
    setIsLoading(true);
    try {
      const colRef = collection(firestore, 'concessions');
      const promises = hashesToQuery.map(hash => {
        return getDocs(query(colRef, orderBy('geohash'), startAt(hash), endAt(hash + '\uf8ff'), limit(200)));
      });
      
      const snapshots = await Promise.all(promises);
      if (requestId !== fetchCounter.current) return;

      let addedCount = 0;
      snapshots.forEach((snap, i) => {
        const hash = hashesToQuery[i];
        const points = processSnapshot(snap, 'concessions', 'both');
        const cellPointIds = new Set<string>();
        
        points.forEach((p: MapPoint) => {
             if (!masterPointsMap.current.has(p.id)) { 
               masterPointsMap.current.set(p.id, p); 
               addedCount++; 
             }
             cellPointIds.add(p.id);
        });
        loadedCells.current.set(`${precision}:${hash}`, cellPointIds);
      });

      if (addedCount > 0) {
        setAllPoints(Array.from(masterPointsMap.current.values()));
        pruneMemory();
      }
    } catch (err) { 
      console.error("Erreur GeoQuery:", err); 
    } finally { 
      if (requestId === fetchCounter.current) setIsLoading(false); 
    }
  }, [firestore, processSnapshot, pruneMemory]);

  const fetchSecondaryData = useCallback(async (colName: string, appSection: string) => {
    const bandId = colName === 'relais' ? 'meta:relais' : 'meta:associations';
    if (!firestore || loadedCells.current.has(bandId)) return;
    
    try {
      const colRef = collection(firestore, colName);
      const snapshot = await getDocs(query(colRef, limit(OVERVIEW_LIMIT)));
      const points = processSnapshot(snapshot, colName, appSection);
      
      points.forEach((p: MapPoint) => { 
        if (!masterPointsMap.current.has(p.id)) { 
          masterPointsMap.current.set(p.id, p); 
          overviewIds.current.add(p.id); 
        } 
      });
      
      setAllPoints(Array.from(masterPointsMap.current.values()));
      loadedCells.current.set(bandId, new Set(points.map((p: any) => p.id)));
    } catch (e) {}
  }, [firestore, processSnapshot]);

  useEffect(() => {
    if (!mounted) return;
    const lowerSearch = submittedSearchTerm.toLowerCase();
    if (activeFilter === 'association' || lowerSearch.includes('asso')) fetchSecondaryData('associations', 'association');
    if (activeFilter === 'relais' || lowerSearch.includes('relais')) fetchSecondaryData('relais', 'relais');
  }, [mounted, activeFilter, submittedSearchTerm, fetchSecondaryData]);

  useEffect(() => {
    const controller = new AbortController();
    
    const processSearch = async () => {
        let term = submittedSearchTerm.trim().toLowerCase();
        
        let results = [...allPoints];
        
        let detectedBrand: string | null = null;
        for (const brand of MOTORCYCLE_BRANDS) {
            if (term.includes(brand)) {
                detectedBrand = brand;
                term = term.replace(brand, '').trim();
                break;
            }
        }

        if (activeFilter === 'association') {
            results = results.filter(p => p.appSection === 'association');
        } else if (activeFilter === 'relais') {
            results = results.filter(p => p.appSection === 'relais');
        } else if (activeFilter === 'shopping') {
            results = results.filter(p => p.appSection === 'shopping' || p.appSection === 'both');
        } else if (activeFilter === 'service') {
            results = results.filter(p => p.appSection === 'service' || p.appSection === 'both');
        } else {
            results = results.filter(p => p.appSection === 'shopping' || p.appSection === 'service' || p.appSection === 'both');
        }

        if (detectedBrand) {
            results = results.filter(p => {
                const brands = (p as any).brands || [];
                return brands.some((b: string) => b.toLowerCase().includes(detectedBrand!)) || 
                       p.title.toLowerCase().includes(detectedBrand!);
            });
        }

        if (term === '') {
            setFilteredPoints(results);
            return;
        }
        
        let zipFound: string | null = null, deptFound: string | null = null, cityFound: string | null = null;
        
        const parisArrMatch = term.match(/paris\s*(\d{1,2})/i);
        if (parisArrMatch) {
            zipFound = `750${parisArrMatch[1].padStart(2, '0')}`;
        } else {
            const words = term.split(/\s+/).filter(w => w.length > 0);
            for (const word of words) {
                if (/^\d{5}$/.test(word)) zipFound = word;
                else if (/^(\d{1,2}|2[ab])$/i.test(word) && word.length <= 2) deptFound = word.padStart(2, '0').toUpperCase();
            }
            if (!zipFound && !deptFound) cityFound = term;
        }
        
        if (zipFound) {
            const coords = await getCityCoordinates(zipFound, controller.signal);
            if (coords && !controller.signal.aborted) { 
              setMapCenter(coords); 
              setSortingAnchor(coords); 
              
              if (zipFound.startsWith('750')) {
                setTargetBounds([
                  [coords[0] - 0.015, coords[1] - 0.02],
                  [coords[0] + 0.015, coords[1] + 0.02]
                ]);
              } else {
                setMapZoom(13); 
                setTargetBounds(null);
              }
              setSelectionSource('external'); 
            }
        } else if (deptFound) {
            const deptKey = Object.keys(locationsData).find(k => k.startsWith(deptFound!));
            if (deptKey) { 
              const info = (locationsData as any)[deptKey]; 
              setMapCenter(info.center); 
              setSortingAnchor(info.center); 
              setMapZoom(9); 
              setTargetBounds(null);
              setSelectionSource('external'); 
            }
        } else if (cityFound) {
            const cityMatch = results.find(d => (d.title || '').toLowerCase().includes(cityFound!));
            if (cityMatch) {
                setMapCenter([cityMatch.latitude, cityMatch.longitude]);
                setSortingAnchor([cityMatch.latitude, cityMatch.longitude]);
                setMapZoom(12);
                setTargetBounds(null);
                setSelectionSource('external');
            }
        }
        
        if (!controller.signal.aborted) setFilteredPoints(results);
    };

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => { processSearch(); }, 300);

    return () => { 
        controller.abort(); 
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [submittedSearchTerm, allPoints, activeFilter]);

  const pointsInViewport = useMemo(() => {
    let results = [...filteredPoints];
    if (mapBoundsStr) { 
        const [minLng, minLat, maxLng, maxLat] = mapBoundsStr.split(',').map(Number); 
        results = results.filter(d => d.latitude >= minLat && d.latitude <= maxLat && d.longitude >= minLng && d.longitude <= maxLng); 
    }
    return results;
  }, [filteredPoints, mapBoundsStr]);

  const pointsToDisplay = useMemo(() => {
    if (isMapMoving) return [];
    let results = [...pointsInViewport];
    results.sort((a, b) => getDistanceSq(sortingAnchor, a) - getDistanceSq(sortingAnchor, b));
    return results.slice(0, 100); 
  }, [pointsInViewport, sortingAnchor, isMapMoving]);

  const handleCardClick = useCallback((id: string, lat?: number, lng?: number) => { 
    setSelectedDealershipId(id); 
    setSelectionSource('card'); 
    if (lat && lng) { 
      setMapCenter([lat, lng]); 
      setMapZoom(prev => Math.max(prev, 13)); 
      setTargetBounds(null); 
      if (isMobile) setDrawerHeight('half'); 
    } 
  }, [isMobile]);

  const handleMarkerClick = useCallback((id: string) => { 
    setSelectedDealershipId(id); 
    setSelectionSource('marker');
    const point = masterPointsMap.current.get(id); 
    if (point) { 
      setMapCenter([point.latitude, point.longitude]); 
      setSortingAnchor([point.latitude, point.longitude]); 
      setMapZoom(prev => Math.max(prev, 13)); 
      setTargetBounds(null); 
    } 
    if (isMobile) setDrawerHeight('half'); 
  }, [isMobile]);

  const handleUserMapInteraction = useCallback(() => { 
    if (isMobile) setDrawerHeight('collapsed'); 
    setSelectionSource(null); 
  }, [isMobile]);
  
  const onDetailLoaded = useCallback((data: Dealership) => { 
    if (!data.id) return; 
    setDetailCache(prev => ({ ...prev, [data.id]: data })); 
  }, []);

  const handleMapChange = useCallback((newCenter: [number, number], newZoom: number, bounds: L.LatLngBounds) => { 
    setMapZoom(newZoom); 
    setMapCenter(newCenter); 
    setIsMapMoving(false);
    if (mapUpdateTimerRef.current) clearTimeout(mapUpdateTimerRef.current);
    mapUpdateTimerRef.current = setTimeout(() => {
        setMapBoundsStr(bounds.toBBoxString()); 
        if (selectionSource === null) setSortingAnchor(newCenter);
        if (newZoom >= ZOOM_THRESHOLD) fetchPointsInViewport(bounds, newZoom);
    }, 300);
  }, [selectionSource, fetchPointsInViewport]);

  const handleLocateEnd = useCallback(() => setIsLoadingLocating(false), []);
  const handleLocationFound = useCallback((coords: [number, number]) => { 
    setMapCenter(coords); 
    setSortingAnchor(coords); 
    setMapZoom(prev => Math.max(prev, 13)); 
    setTargetBounds(null);
    setSelectionSource('external'); 
  }, []);

  const listContent = (
    <div className="space-y-3 pb-20 custom-scrollbar">
      {isLoading && pointsToDisplay.length === 0 ? (
        <div className="space-y-4 pt-4">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="flex gap-4 p-4 border rounded-xl animate-pulse bg-card"><Skeleton className="h-24 w-24 rounded-lg shrink-0" /><div className="flex-1 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-10 w-full rounded-full" /></div></div>))}</div>
      ) : (
        <>
            {(pointsToDisplay.length === 0 && !isMapMoving) && submittedSearchTerm === '' && mapZoom < ZOOM_THRESHOLD && (
                <div className="space-y-4 pt-2">
                    <div className="bg-brand/5 border-2 border-brand/20 p-6 rounded-[2rem] shadow-sm mb-4">
                        <div className="flex items-center gap-2 mb-4"><Sparkles className="h-5 w-5 text-brand animate-pulse" /><h3 className="text-sm font-black uppercase tracking-widest text-foreground">Guides & Conseils</h3></div>
                        <div className="space-y-4">{ads.map((ad, idx) => <AdCard key={ad.id} article={ad} isPublicity={idx === 0} />)}</div>
                    </div>
                </div>
            )}
            {isMapMoving && (
              <div className="text-center py-20 animate-pulse">
                <Loader2 className="h-10 w-10 mx-auto mb-4 text-brand animate-spin" /><p className="font-black uppercase tracking-widest text-[9px] text-muted-foreground">Exploration...</p>
              </div>
            )}
            {!isMapMoving && pointsToDisplay.map((point, index) => (
                <div key={point.id} onMouseEnter={() => setHoveredDealershipId(point.id)} onMouseLeave={() => setHoveredDealershipId(null)}>
                    <DealershipCardItem point={point} isSelected={point.id === selectedDealershipId} onClick={() => handleCardClick(point.id, point.latitude, point.longitude)} className={cn(point.id === selectedDealershipId && "ring-2 ring-brand")} cachedData={detailCache[point.id]} onDataLoaded={onDetailLoaded} />
                    {(index + 1) % 8 === 0 && (<div className="my-3"><AdCard article={ads[Math.floor(index / 8) % ads.length]} /></div>)}
                </div>
            ))}
            {pointsToDisplay.length === 0 && !isMapMoving && (submittedSearchTerm !== '' || mapZoom >= ZOOM_THRESHOLD) && !isLoading && (
                <div className="text-center py-20 opacity-50"><MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" /><p className="font-black uppercase tracking-widest text-xs">Aucun établissement dans cette zone</p></div>
            )}
        </>
      )}
    </div>
  );

  if (!mounted || width === undefined) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background flex flex-col md:row">
      <div className="absolute inset-0 z-0 h-full w-full">
        {showMap ? (
            <MapComponent 
              points={filteredPoints} 
              center={mapCenter} 
              zoom={mapZoom} 
              targetBounds={targetBounds} 
              hoveredId={hoveredDealershipId} 
              selectedId={selectedDealershipId} 
              onMarkerClick={handleMarkerClick} 
              onMarkerMouseOver={setHoveredDealershipId} 
              onMarkerMouseOut={() => setHoveredDealershipId(null)} 
              onMapChange={handleMapChange} 
              onMapClick={handleUserMapInteraction} 
              onUserInteraction={() => { handleUserMapInteraction(); setIsMapMoving(true); }} 
              bottomPadding={bottomPadding} 
              leftPadding={leftPadding} 
              isLocating={isLocating} 
              onLocateEnd={handleLocateEnd} 
              onLocationFound={handleLocationFound} 
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
                    <div className="flex flex-col items-center justify-center text-center px-2"><p className="text-[10px] font-black uppercase tracking-tight text-foreground leading-none">TROUVER UNE CONCESSION ?</p><p className="text-[12px] font-black italic text-brand mt-1 leading-none tracking-tighter">FINI LA GALÈRE.</p></div>
                    <UserMenu />
                </div>
                <div className="space-y-6 mb-6">
                    <div className="flex flex-col items-center"><p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Pros & Services</p><div className="flex items-center justify-center gap-3"><button onClick={() => setActiveFilter('shopping')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'shopping' ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}><Bike className={cn("h-6 w-6", activeFilter === 'shopping' ? "text-white" : "text-brand")} /><span className="text-[8px] font-black uppercase mt-0.5">Vente</span></button><button onClick={() => setActiveFilter(null)} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === null ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}><Home className={cn("h-6 w-6", activeFilter === null ? "text-white" : "text-brand")} /><span className="text-[8px] font-black uppercase mt-0.5">Tout</span></button><button onClick={() => setActiveFilter('service')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'service' ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}><Wrench className={cn("h-6 w-6", activeFilter === 'service' ? "text-white" : "text-brand")} /><span className="text-[8px) font-black uppercase mt-0.5">Atelier</span></button></div></div>
                    <div className="flex flex-col items-center"><p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Communauté</p><div className="flex items-center justify-center gap-6"><button onClick={() => setActiveFilter('association')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'association' ? "bg-indigo-600 text-white border-white scale-110 shadow-indigo-600/40" : "bg-white text-muted-foreground border-transparent hover:border-indigo-600/20 hover:scale-105")}><Users className={cn("h-6 w-6", activeFilter === 'association' ? "text-white" : "text-indigo-600")} /><span className="text-[8px] font-black uppercase mt-0.5 text-center leading-tight">Asso</span></button><button onClick={() => setActiveFilter('relais')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'relais' ? "bg-amber-600 text-white border-white scale-110 shadow-amber-600/40" : "bg-white text-muted-foreground border-transparent hover:border-amber-600/20 hover:scale-105")}><Utensils className={cn("h-6 w-6", activeFilter === 'relais' ? "text-white" : "text-amber-600")} /><span className="text-[8px] font-black uppercase mt-0.5 text-center leading-tight">Relais</span></button></div></div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent mb-4" />
            </div>
            <div ref={listContainerRef} className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">{listContent}</div>
        </aside>
      )}
      {!isMobile && (
        <div className="absolute top-8 right-8 left-[580px] z-[100] flex justify-end pointer-events-none">
            <div className="w-full max-w-2xl pointer-events-auto"><Header searchTerm={searchTerm} onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} onSearch={() => { setSubmittedSearchTerm(searchTerm); setSelectionSource('external'); }} activeFilter={activeFilter} onFilterChange={setActiveFilter} variant="map" hideUserMenu={true} /></div>
        </div>
      )}
      {isMobile && (
        <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none"><div className="pointer-events-auto"><Header searchTerm={searchTerm} onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} onSearch={() => { setSubmittedSearchTerm(searchTerm); setSelectionSource('external'); }} activeFilter={activeFilter} onFilterChange={setActiveFilter} /></div></div>
      )}
      <button className="absolute right-6 bottom-32 md:bottom-10 z-[500] h-12 w-12 md:h-14 md:w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-brand hover:text-white" onClick={() => setIsLoadingLocating(true)} aria-label="Me localiser"><Compass className="h-7 w-7 md:h-8 md:w-8" /></button>
      {isMobile && (
        <div className={cn("fixed left-0 right-0 bg-background rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out border-t flex flex-col z-[1100]", drawerHeight === 'collapsed' ? 'bottom-0 h-[110px]' : drawerHeight === 'half' ? 'bottom-0 h-[50vh]' : 'bottom-0 h-[calc(100vh-160px)]')}>
          <div onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }} onTouchEnd={(e) => { const diff = touchStartY.current - e.changedTouches[0].clientY; if (Math.abs(diff) > 40) setDrawerHeight(diff > 0 ? (drawerHeight === 'collapsed' ? 'half' : 'full') : (drawerHeight === 'full' ? 'half' : 'collapsed')); }} className="cursor-grab active:cursor-grabbing bg-white rounded-t-[2.5rem] shrink-0">
            <div className="relative w-full flex flex-col items-center pt-3 pb-1"><div className="w-12 h-1.5 bg-muted rounded-full mb-2" /></div>
            <div className="px-5 pt-2 pb-6 border-b border-border/50">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveFilter('shopping')} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2 shrink-0", activeFilter === 'shopping' ? "bg-brand text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Bike className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5">Vente</span></button>
                    <button onClick={() => setActiveFilter(null)} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2 shrink-0", activeFilter === null ? "bg-brand text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Home className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5">Tout</span></button>
                    <button onClick={() => setActiveFilter('service')} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2 shrink-0", activeFilter === 'service' ? "bg-brand text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Wrench className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5">Atelier</span></button>
                    <div className="w-px h-8 bg-border/50 shrink-0 mx-1" />
                    <button onClick={() => setActiveFilter('association')} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2 shrink-0", activeFilter === 'association' ? "bg-indigo-600 text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Users className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5 text-center leading-none">Asso</span></button>
                    <button onClick={() => setActiveFilter('relais')} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2 shrink-0", activeFilter === 'relais' ? "bg-amber-600 text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Utensils className="h-5 w-5" /><span className="text-[7px) font-black uppercase mt-0.5 text-center leading-none">Relais</span></button>
                    <button className="ml-1 rounded-full h-10 w-10 flex items-center justify-center hover:bg-muted shrink-0" onClick={() => setDrawerHeight(drawerHeight === 'collapsed' ? 'half' : 'collapsed')}>{drawerHeight === 'collapsed' ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}</button>
                </div>
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

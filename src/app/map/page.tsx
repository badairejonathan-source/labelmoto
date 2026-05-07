
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

const CIRCUIT_BUGATTI: MapPoint = {
  id: 'circuit-bugatti-le-mans',
  title: 'Circuit Bugatti - Le Mans',
  latitude: 47.9546,
  longitude: 0.2078,
  category: 'Circuit',
  appSection: 'both',
};

const ZOOM_THRESHOLD = 8.5;
const MAX_POINTS_IN_MEMORY = 5000;

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
  try {
    const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=centre`, { signal });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.length > 0) {
      const { coordinates } = data[0].centre;
      return [coordinates[1], coordinates[0]];
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

  // Tracking des zones géographiques chargées (latitudes)
  const fetchedLatBands = useRef<Set<number>>(new Set());
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
        setMapCenter(pos); 
        setSortingAnchor(pos); 
        if (mapZoom < 12) setMapZoom(12);
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

  const processSnapshot = useCallback((snapshot: any, colName: string, appSection: string) => {
    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      const title = data.title || data.name || data.displayName || data.label || doc.id.replace(/-/g, ' ').toUpperCase();
      
      let lat = 0;
      let lng = 0;
      try {
        if (data.latitude !== undefined) lat = parseFloat(String(data.latitude).replace(',', '.'));
        else if (data.lat !== undefined) lat = parseFloat(String(data.lat).replace(',', '.'));
        else if (data.location?.lat !== undefined) lat = parseFloat(String(data.location.lat).replace(',', '.'));
        else if (data.position?.latitude !== undefined) lat = parseFloat(String(data.position.latitude).replace(',', '.'));
        else if (data.position && Array.isArray(data.position)) { lat = data.position[0]; lng = data.position[1]; }
        
        if (lng === 0) {
            if (data.longitude !== undefined) lng = parseFloat(String(data.longitude).replace(',', '.'));
            else if (data.lng !== undefined) lng = parseFloat(String(data.lng).replace(',', '.'));
            else if (data.location?.lng !== undefined) lng = parseFloat(String(data.location.lng).replace(',', '.'));
            else if (data.position?.longitude !== undefined) lng = parseFloat(String(data.position.longitude).replace(',', '.'));
        }
      } catch (e) {}

      let previewImg = "";
      const imgKeys = ['imgUrl', 'imageUrl', 'photoUrl', 'img_url', 'image_url', 'photo_url'];
      for(const k of imgKeys) { 
        if(data[k] && typeof data[k] === 'string' && data[k].startsWith('http')) { 
          previewImg = data[k]; 
          break; 
        } 
      }
      if (!previewImg && data.details && typeof data.details === 'object') {
        for(const k of imgKeys) {
            if (data.details[k] && typeof data.details[k] === 'string') {
                previewImg = data.details[k];
                break;
            }
        }
      }

      return {
        id: doc.id,
        title: title,
        latitude: lat,
        longitude: lng,
        category: data.category || (colName === 'associations' ? 'association' : (colName === 'relais' ? 'relais' : 'concession')),
        appSection: appSection as any,
        imgUrl: previewImg,
        rating: data.rating
      };
    }).filter((p: any) => p.latitude !== 0 && !isNaN(p.latitude));
  }, []);

  /**
   * Nettoyage de la mémoire si trop de points sont chargés
   */
  const pruneMemory = useCallback(() => {
    if (masterPointsMap.current.size > MAX_POINTS_IN_MEMORY) {
      const center = mapCenter;
      const sortedPoints = Array.from(masterPointsMap.current.values())
        .map(p => ({ id: p.id, dist: getDistanceSq(center, p) }))
        .sort((a, b) => b.dist - a.dist);
      
      const toRemove = sortedPoints.slice(0, 1000);
      toRemove.forEach(p => masterPointsMap.current.delete(p.id));
      
      // On réinitialise les bandes de latitude pour forcer le rechargement si on y retourne
      fetchedLatBands.current.clear();
      setAllPoints(Array.from(masterPointsMap.current.values()));
    }
  }, [mapCenter]);

  /**
   * Chargement initial minimal (Vue France)
   * On réduit à 300 points pour une réactivité maximale au démarrage.
   */
  useEffect(() => {
    const fetchInitialSample = async () => {
      if (!firestore || !mounted) return;
      setIsLoading(true);
      try {
        const colRef = collection(firestore, 'concessions');
        const snapshot = await getDocs(query(colRef, limit(300)));
        const points = processSnapshot(snapshot, 'concessions', 'both');
        
        points.forEach((p: MapPoint) => masterPointsMap.current.set(p.id, p));
        setAllPoints(Array.from(masterPointsMap.current.values()));
      } catch (err: any) {
        console.error("Initial sample fetch error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialSample();
  }, [firestore, mounted, processSnapshot]);

  /**
   * Chargement par Viewport (Grille de latitude)
   */
  const fetchPointsInViewport = useCallback(async (bounds: L.LatLngBounds) => {
    if (!firestore) return;
    
    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();

    // Découpage en bandes de 0.5 degré
    const latStart = Math.floor(south * 2) / 2;
    const latEnd = Math.ceil(north * 2) / 2;

    const newBands: number[] = [];
    for (let l = latStart; l <= latEnd; l += 0.5) {
      if (!fetchedLatBands.current.has(l)) {
        newBands.push(l);
      }
    }

    if (newBands.length === 0) return;

    setIsLoading(true);
    try {
      const colRef = collection(firestore, 'concessions');
      const promises = newBands.map(band => {
        fetchedLatBands.current.add(band);
        return getDocs(query(
          colRef, 
          orderBy('latitude'), 
          startAt(band), 
          endAt(band + 0.5),
          limit(1000)
        ));
      });

      const snapshots = await Promise.all(promises);
      let addedCount = 0;

      snapshots.forEach(snap => {
        const points = processSnapshot(snap, 'concessions', 'both');
        points.forEach((p: MapPoint) => {
          // Filtrage longitude client-side car Firestore limite à une seule plage
          if (p.longitude >= west - 0.5 && p.longitude <= east + 0.5) {
             if (!masterPointsMap.current.has(p.id)) {
                masterPointsMap.current.set(p.id, p);
                addedCount++;
             }
          }
        });
      });

      if (addedCount > 0) {
        setAllPoints(Array.from(masterPointsMap.current.values()));
        pruneMemory();
      }
    } catch (err: any) {
      console.error("Geofenced fetch error", err);
    } finally {
      setIsLoading(false);
    }
  }, [firestore, processSnapshot, pruneMemory]);

  /**
   * Chargement des collections secondaires (Associations/Relais)
   */
  const fetchSecondaryData = useCallback(async (colName: string, appSection: string) => {
    const bandId = -999 + (colName === 'relais' ? 1 : 0);
    if (!firestore || fetchedLatBands.current.has(bandId)) return;
    
    try {
      const colRef = collection(firestore, colName);
      const snapshot = await getDocs(query(colRef, limit(2000)));
      const points = processSnapshot(snapshot, colName, appSection);
      
      points.forEach((p: MapPoint) => masterPointsMap.current.set(p.id, p));
      setAllPoints(Array.from(masterPointsMap.current.values()));
      fetchedLatBands.current.add(bandId);
    } catch (e) {}
  }, [firestore, processSnapshot]);

  useEffect(() => {
    if (!mounted) return;
    const lowerSearch = submittedSearchTerm.toLowerCase();
    if (activeFilter === 'association' || lowerSearch.includes('association') || lowerSearch.includes('asso')) {
        fetchSecondaryData('associations', 'association');
    }
    if (activeFilter === 'relais' || lowerSearch.includes('relais') || lowerSearch.includes('hotel') || lowerSearch.includes('bar')) {
        fetchSecondaryData('relais', 'relais');
    }
  }, [mounted, activeFilter, submittedSearchTerm, fetchSecondaryData]);

  /**
   * Logique de recherche (Paris, Dépt, CP)
   */
  useEffect(() => {
    const controller = new AbortController();
    const processSearch = async () => {
        let term = submittedSearchTerm.trim().toLowerCase();
        if (term === '') {
            if (activeFilter === null) {
              setFilteredPoints(allPoints.filter(p => p.appSection === 'shopping' || p.appSection === 'service' || p.appSection === 'both'));
            } else {
              setFilteredPoints(allPoints.filter(p => p.appSection === activeFilter));
            }
            return;
        }

        let results = [...allPoints];
        const assoKeywords = ["association", "associations", "asso"];
        const foundAssoKeyword = assoKeywords.find(k => term.includes(k));
        if (foundAssoKeyword) {
            if (activeFilter !== 'association') setActiveFilter('association');
            term = term.replace(foundAssoKeyword, '').trim();
        }
        
        const currentFilter = foundAssoKeyword ? 'association' : activeFilter;
        if (currentFilter) { 
            results = results.filter(d => {
                if (currentFilter === 'shopping') return d.appSection === 'shopping' || d.appSection === 'both';
                if (currentFilter === 'service') return d.appSection === 'service' || d.appSection === 'both';
                if (currentFilter === 'association') return d.appSection === 'association';
                if (currentFilter === 'relais') return d.appSection === 'relais';
                return true;
            });
        } else {
            results = results.filter(d => d.appSection === 'shopping' || d.appSection === 'service' || d.appSection === 'both');
        }

        let zipFound: string | null = null;
        let deptFound: string | null = null;
        let otherText: string[] = [];

        const parisMatch = term.match(/paris\s*(\d{1,2})/i);
        if (parisMatch) {
            const num = parseInt(parisMatch[1]);
            if (num >= 1 && num <= 20) {
                zipFound = `750${num.toString().padStart(2, '0')}`;
                term = term.replace(parisMatch[0], '').trim();
            }
        }

        const words = term.split(/\s+/).filter(w => w.length > 0);
        for (const word of words) {
            if (/^\d{5}$/.test(word)) zipFound = word;
            else if (/^(\d{1,2}|2[ab])$/i.test(word) && word.length <= 2) deptFound = word.padStart(2, '0').toUpperCase();
            else otherText.push(word);
        }

        if (zipFound) {
            const coords = await getCityCoordinates(zipFound, controller.signal);
            if (coords && !controller.signal.aborted) {
                setMapCenter(coords); setSortingAnchor(coords); if (mapZoom < 12) setMapZoom(12); setSelectionSource('external');
            }
        } else if (deptFound) {
            const deptKey = Object.keys(locationsData).find(k => k.startsWith(deptFound!));
            if (deptKey) {
                const info = (locationsData as any)[deptKey];
                setMapCenter(info.center); setSortingAnchor(info.center); setMapZoom(9); setSelectionSource('external');
            }
        }

        if (otherText.length > 0) {
            const filterStr = otherText.join(' ');
            results = results.filter(d => (d.title || '').toLowerCase().includes(filterStr));
        }

        if (!controller.signal.aborted) setFilteredPoints(results);
    };

    const timer = setTimeout(() => { processSearch(); }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [submittedSearchTerm, allPoints, activeFilter, mapZoom]);

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
    if (mapZoom < ZOOM_THRESHOLD && submittedSearchTerm === '') return [];
    let results = [...pointsInViewport];
    results.sort((a, b) => getDistanceSq(sortingAnchor, a) - getDistanceSq(sortingAnchor, b));
    return results.slice(0, 40);
  }, [pointsInViewport, sortingAnchor, mapZoom, submittedSearchTerm, isMapMoving]);

  const handleCardClick = useCallback((id: string, lat?: number, lng?: number) => { 
    setSelectedDealershipId(id); 
    setSelectionSource('card'); 
    if (lat && lng) { 
      setMapCenter([lat, lng]); 
      if (mapZoom < 12) setMapZoom(12); 
      if (isMobile) setDrawerHeight('half'); 
    } 
  }, [isMobile, mapZoom]);

  const handleMarkerClick = useCallback((id: string) => { 
    setSelectedDealershipId(id); 
    setSelectionSource('marker');
    const point = masterPointsMap.current.get(id); 
    if (point) { 
      setMapCenter([point.latitude, point.longitude]); 
      setSortingAnchor([point.latitude, point.longitude]); 
      if (mapZoom < 12) setMapZoom(12); 
    } 
    if (isMobile) setDrawerHeight('half'); 
  }, [isMobile, mapZoom]);

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
        const distSq = getDistanceSq(sortingAnchor, { latitude: newCenter[0], longitude: newCenter[1] } as any);
        if (selectionSource === null && distSq > 0.01) {
          setSortingAnchor(newCenter);
        }
        if (newZoom >= ZOOM_THRESHOLD) {
          fetchPointsInViewport(bounds);
        }
    }, 300);
  }, [selectionSource, sortingAnchor, fetchPointsInViewport]);

  const handleLocateEnd = useCallback(() => setIsLoadingLocating(false), []);
  const handleLocationFound = useCallback((coords: [number, number]) => { 
    setMapCenter(coords); 
    setSortingAnchor(coords); 
    setMapZoom(12); 
    setSelectionSource('external'); 
  }, []);

  const listContent = (
    <div className="space-y-3 pb-20 custom-scrollbar">
      {isLoading && pointsToDisplay.length === 0 ? (
        <div className="space-y-4 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-xl animate-pulse bg-card">
                    <Skeleton className="h-24 w-24 rounded-lg shrink-0" /><div className="flex-1 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-10 w-full rounded-full" /></div>
                </div>
            ))}
        </div>
      ) : (
        <>
            {(pointsToDisplay.length === 0 && !isMapMoving) && submittedSearchTerm === '' && mapZoom < ZOOM_THRESHOLD && (
                <div className="space-y-4 pt-2">
                    <div className="bg-brand/5 border-2 border-brand/20 p-6 rounded-[2rem] shadow-sm mb-4">
                        <div className="flex items-center gap-2 mb-4"><Sparkles className="h-5 w-5 text-brand animate-pulse" /><h3 className="text-sm font-black uppercase tracking-widest text-foreground">Guides & Conseils</h3></div>
                        <div className="space-y-4">{ads.map((ad, idx) => <AdCard key={ad.id} article={ad} isPublicity={idx === 0} />)}</div>
                    </div>
                    <div className="p-8 border-2 border-dashed rounded-[2.5rem] text-center bg-muted/5"><FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" /><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-snug">Plus de 3000 établissements référencés.<br/><span className="text-brand">Zoomez sur la carte pour les afficher.</span></p></div>
                </div>
            )}
            {isMapMoving && (
              <div className="text-center py-20 animate-pulse">
                <Loader2 className="h-10 w-10 mx-auto mb-4 text-brand animate-spin" /><p className="font-black uppercase tracking-widest text-[9px] text-muted-foreground">Mise à jour de la zone...</p>
              </div>
            )}
            {!isMapMoving && pointsToDisplay.map((point, index) => (
                <React.Fragment key={point.id}>
                    <div onMouseEnter={() => setHoveredDealershipId(point.id)} onMouseLeave={() => setHoveredDealershipId(null)}>
                        <DealershipCardItem 
                          point={point} 
                          isSelected={point.id === selectedDealershipId}
                          onClick={() => handleCardClick(point.id, point.latitude, point.longitude)} 
                          className={cn(point.id === selectedDealershipId && "ring-2 ring-brand")} 
                          cachedData={detailCache[point.id]}
                          onDataLoaded={onDetailLoaded}
                        />
                    </div>
                    {(index + 1) % 5 === 0 && (<div className="my-3"><AdCard article={ads[Math.floor(index / 5) % ads.length]} /></div>)}
                </React.Fragment>
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
              hoveredId={hoveredDealershipId} 
              selectedId={selectedDealershipId} 
              onMarkerClick={handleMarkerClick} 
              onMarkerMouseOver={setHoveredDealershipId} 
              onMarkerMouseOut={() => setHoveredDealershipId(null)} 
              onMapChange={handleMapChange} 
              onMapClick={handleUserMapInteraction} 
              onUserInteraction={() => { handleUserMapInteraction(); setIsMapMoving(true); }} 
              bottomPadding={bottomPadding} 
              leftPadding={isMobile ? 0 : leftPadding} 
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
                    <div className="flex flex-col items-center justify-center text-center px-2">
                        <p className="text-[10px] font-black uppercase tracking-tight text-foreground leading-none">TROUVER UNE CONCESSION ?</p>
                        <p className="text-[12px] font-black italic text-brand mt-1 leading-none tracking-tighter">FINI LA GALÈRE.</p>
                    </div>
                    <UserMenu />
                </div>
                
                <div className="space-y-6 mb-6">
                    <div className="flex flex-col items-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Pros & Services</p>
                        <div className="flex items-center justify-center gap-3">
                            <button onClick={() => setActiveFilter('shopping')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'shopping' ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}>
                                <Bike className={cn("h-6 w-6", activeFilter === 'shopping' ? "text-white" : "text-brand")} /><span className="text-[8px] font-black uppercase mt-0.5">Vente</span>
                            </button>
                            <button onClick={() => setActiveFilter(null)} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === null ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}>
                                <Home className={cn("h-6 w-6", activeFilter === null ? "text-white" : "text-brand")} /><span className="text-[8px] font-black uppercase mt-0.5">Tout</span>
                            </button>
                            <button onClick={() => setActiveFilter('service')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'service' ? "bg-brand text-white border-white scale-110 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/20 hover:scale-105")}>
                                <Wrench className={cn("h-6 w-6", activeFilter === 'service' ? "text-white" : "text-brand")} /><span className="text-[8px] font-black uppercase mt-0.5">Atelier</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Communauté</p>
                        <div className="flex items-center justify-center gap-6">
                            <button onClick={() => setActiveFilter('association')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'association' ? "bg-indigo-600 text-white border-white scale-110 shadow-indigo-600/40" : "bg-white text-muted-foreground border-transparent hover:border-indigo-600/20 hover:scale-105")}>
                                <Users className={cn("h-6 w-6", activeFilter === 'association' ? "text-white" : "text-indigo-600")} /><span className="text-[8px] font-black uppercase mt-0.5 text-center leading-tight">Asso</span>
                            </button>
                            <button onClick={() => setActiveFilter('relais')} className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-[3px]", activeFilter === 'relais' ? "bg-amber-600 text-white border-white scale-110 shadow-amber-600/40" : "bg-white text-muted-foreground border-transparent hover:border-amber-600/20 hover:scale-105")}>
                                <Utensils className={cn("h-6 w-6", activeFilter === 'relais' ? "text-white" : "text-amber-600")} /><span className="text-[8px] font-black uppercase mt-0.5 text-center leading-tight">Relais</span>
                            </button>
                        </div>
                    </div>
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
                <Header searchTerm={searchTerm} onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} onSearch={() => { setSubmittedSearchTerm(searchTerm); setSelectionSource('external'); }} activeFilter={activeFilter} onFilterChange={setActiveFilter} variant="map" hideUserMenu={true} />
            </div>
        </div>
      )}

      {isMobile && (
        <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
          <div className="pointer-events-auto">
            <Header searchTerm={searchTerm} onSearchTermChange={(val) => { setSearchTerm(val); if (val.trim() === '') setSubmittedSearchTerm(''); }} onSearch={() => { setSubmittedSearchTerm(searchTerm); setSelectionSource('external'); }} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </div>
        </div>
      )}

      <button className="absolute right-6 bottom-32 md:bottom-10 z-[500] h-12 w-12 md:h-14 md:w-14 rounded-full bg-white text-brand shadow-2xl border-4 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-brand hover:text-white" onClick={() => setIsLoadingLocating(true)} aria-label="Me localiser">
        <Compass className="h-7 w-7 md:h-8 md:w-8" />
      </button>

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
                    <button onClick={() => setActiveFilter('relais')} className={cn("h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-sm border-2 shrink-0", activeFilter === 'relais' ? "bg-amber-600 text-white border-white" : "bg-white text-muted-foreground border-transparent")}><Utensils className="h-5 w-5" /><span className="text-[7px] font-black uppercase mt-0.5 text-center leading-none">Relais</span></button>
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

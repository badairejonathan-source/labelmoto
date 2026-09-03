'use client';
import { DEPARTMENTS } from '@/app/lib/departments';

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
import { Compass, Search, Crosshair, Loader2, MapPin, Bike, Wrench, Users, Utensils, ArrowLeft, Phone, Globe, ChevronRight, Clock, ChevronUp, ChevronDown, MessageSquare, Map as MapIcon, Camera, Menu } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn, normalizeText, getItemDepartment } from "@/lib/utils";
import { loadPublicMapPoints } from '@/lib/public-map-points';
import { extractValidCoordinates } from "@/lib/geohash";
import { useFirebase, useMemoFirebase, useDoc } from '@/firebase/client';
import { initializeFirebaseClient } from '@/firebase/config-client';
import { collection, getDocs, query, limit, doc, getDoc, getFirestore } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';

const MOTORCYCLE_BRANDS = [
  "Suzuki", "Yamaha", "Honda", "BMW Motorrad", "BMW", "Kawasaki",
  "Harley-Davidson", "Triumph", "Kymco", "CF Moto", "Peugeot Motocycles",
  "Piaggio", "Royal Enfield", "Ducati", "KTM", "Aprilia", "Vespa",
  "Indian", "Moto Guzzi", "SYM", "Can-Am", "MV Agusta", "Norton",
  "Zontes", "VOGE", "Mash", "QJ Motor", "Benelli", "Kove", "Orcal",
  "SWM", "Brixton", "Keeway", "Rieju", "Sherco", "Fantic", "Husqvarna",
  "GasGas", "Beta", "Segway", "Vmoto", "NIU", "Super Soco", "Silence",
  "Zero Motorcycles", "Dafy Moto", "Moto Axxe", "Speedway", "Doc'Biker",
  "Cardy", "TeamAxe",
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

function compactGeographyValue(
  value: string
) {
  return normalizeText(
    value
  ).replace(
    /[^a-z0-9]/g,
    ''
  );
}

function geographyQueryWithoutBrand(
  value: string
) {
  let compactQuery =
    compactGeographyValue(
      value
    );

  if (!compactQuery) {
    return '';
  }

  const brand =
    MOTORCYCLE_BRANDS.find(
      candidate => {
        const compactBrand =
          compactGeographyValue(
            candidate
          );

        return (
          compactBrand.length >= 3 &&
          compactQuery.includes(
            compactBrand
          )
        );
      }
    );

  if (brand) {
    const compactBrand =
      compactGeographyValue(
        brand
      );

    compactQuery =
      compactQuery.replace(
        compactBrand,
        ''
      );
  }

  return compactQuery;
}

function resolveCityNameFromQuery(
  value: string
): string | null {
  const geographyQuery =
    geographyQueryWithoutBrand(
      value
    );

  if (!geographyQuery) {
    return null;
  }

  for (
    const info
    of Object.values(
      locationsData
    )
  ) {
    const cities =
      Array.isArray(
        (info as any)?.cities
      )
        ? (info as any).cities
        : [];

    for (const city of cities) {
      if (
        compactGeographyValue(
          String(city)
        ) === geographyQuery
      ) {
        return String(
          city
        );
      }
    }
  }

  return null;
}

function compactDepartmentValue(
  value: string
) {
  return normalizeText(
    value
  ).replace(
    /[^a-z0-9]/g,
    ''
  );
}

function resolveDepartmentCodeFromQuery(
  value: string
): string | null {
  let query =
    compactDepartmentValue(
      value
    );

  if (!query) {
    return null;
  }

  // ===============================================
  // RETIRER UNE EVENTUELLE MARQUE
  //
  // Honda Gironde -> Gironde
  // BMW Yvelines   -> Yvelines
  // ===============================================

  for (
    const brand
    of MOTORCYCLE_BRANDS
  ) {
    const compactBrand =
      compactDepartmentValue(
        brand
      );

    if (
      compactBrand.length >= 3 &&
      query.includes(
        compactBrand
      )
    ) {
      query =
        query.replace(
          compactBrand,
          ''
        );

      break;
    }
  }

  if (!query) {
    return null;
  }

  // ===============================================
  // DEPARTEMENT EN CHIFFRES
  // ===============================================

  const upper =
    query.toUpperCase();

  const codeRegex =
    /^(0[1-9]|[1-8]\d|9[0-5]|2A|2B|97[1-46])$/;

  if (
    codeRegex.test(
      upper
    )
  ) {
    return upper;
  }

  // ===============================================
  // EVITER LA CONFUSION VILLE / DEPARTEMENT
  //
  // "Paris" reste une ville.
  // ===============================================

  const isExactCity =
    Object.values(
      locationsData
    ).some(
      (info: any) =>
        Array.isArray(
          info?.cities
        ) &&
        info.cities.some(
          (city: string) =>
            compactDepartmentValue(
              city
            ) ===
            query
        )
    );

  if (isExactCity) {
    return null;
  }

  // ===============================================
  // DEPARTEMENT EN TOUTES LETTRES
  //
  // Gironde          -> 33
  // Yvelines         -> 78
  // Dordogne         -> 24
  // Loire-Atlantique -> 44
  // Val-d'Oise       -> 95
  // Guadeloupe       -> 971
  //
  // Accepte aussi le slug :
  // bouches-du-rhone, val-d-oise...
  // ===============================================

  const department =
    DEPARTMENTS.find(
      item =>
        compactDepartmentValue(
          item.name
        ) ===
          query ||
        compactDepartmentValue(
          item.slug
        ) ===
          query
    );

  return (
    department?.code
      ?.toUpperCase() ||
    null
  );
}
function isMunicipalArrondissementQuery(
  value: string
) {
  const normalized =
    normalizeText(
      value
    );

  const textMatch =
    normalized.match(
      /\b(paris|lyon|marseille)\s+\d{1,2}\s*(?:er|e|eme|ieme)?(?:\s+arrondissement)?\b/
    ) ||
    normalized.match(
      /\b\d{1,2}\s*(?:er|e|eme|ieme)?(?:\s+arrondissement)?\s+(?:de\s+)?(paris|lyon|marseille)\b/
    );

  if (textMatch) {
    return true;
  }

  const postalCode =
    normalized.match(
      /\b\d{5}\b/
    )?.[0];

  if (!postalCode) {
    return false;
  }

  const number =
    Number(
      postalCode.slice(2)
    );

  return (
    (
      postalCode.startsWith('75') &&
      number >= 1 &&
      number <= 20
    ) ||
    (
      postalCode.startsWith('69') &&
      number >= 1 &&
      number <= 9
    ) ||
    (
      postalCode.startsWith('13') &&
      number >= 1 &&
      number <= 16
    )
  );
}
function MapPageComponent() {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [desktopWhat, setDesktopWhat] = useState('');
  const [desktopWhere, setDesktopWhere] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(6);
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('collapsed');
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>(null);
  const [hasAppliedInitialUrl, setHasAppliedInitialUrl] = useState(false);
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

  // Lire l'URL après hydratation afin de conserver les deep links
  // sans forcer toute la page /map en rendu client uniquement.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const initialSearch = params.get('search') || '';
    const initialFilter = params.get('filter') || '';
    const initialSelectedId = params.get('selectedId');

    const initialLat = parseFloat(params.get('lat') || '');
    const initialLng = parseFloat(params.get('lng') || '');
    const initialZoom = parseInt(params.get('zoom') || '');

    setSearchTerm(
      initialSearch
    );

    setAppliedSearchTerm(
      initialSearch
    );

    setActiveFilters(
      initialFilter
        ? initialFilter.split(',').filter(Boolean)
        : []
    );

    setSelectedId(initialSelectedId);

    if (
      Number.isFinite(initialLat) &&
      Number.isFinite(initialLng)
    ) {
      setMapCenter([initialLat, initialLng]);
      setMapZoom(
        Number.isFinite(initialZoom)
          ? initialZoom
          : 12
      );
    }

    setSelectionSource(
      initialSelectedId
        ? 'external'
        : null
    );

    setHasAppliedInitialUrl(true);
  }, []);

  // Synchroniser le ref avec l'état
  useEffect(() => { mapZoomRef.current = mapZoom; }, [mapZoom]);
  // Synchronisation légère état -> URL.
  // L'History API conserve une URL partageable sans provoquer
  // de navigation Next.js ni de nouvelle requête GET /map.
  useEffect(() => {
    if (!hasAppliedInitialUrl) return;

    const params = new URLSearchParams();

    if (appliedSearchTerm) params.set('search', appliedSearchTerm);

    if (activeFilters.length > 0 && activeFilters.length < 5) {
      params.set('filter', activeFilters.join(','));
    }

    if (selectedId) params.set('selectedId', selectedId);

    if (mapCenter[0] !== 46.5 || mapCenter[1] !== 2.2) {
      params.set('lat', mapCenter[0].toFixed(4));
      params.set('lng', mapCenter[1].toFixed(4));
    }

    if (mapZoom !== 6) {
      params.set('zoom', mapZoom.toString());
    }

    const newUrl = params.toString()
      ? '/map?' + params.toString()
      : '/map';

    const currentUrl =
      window.location.pathname + window.location.search;

    if (currentUrl !== newUrl) {
      window.history.replaceState(
        window.history.state,
        '',
        newUrl
      );
    }
  }, [hasAppliedInitialUrl, appliedSearchTerm, activeFilters, selectedId, mapCenter, mapZoom]);


  const isViewportReady = width !== undefined;
  const isMobile = isViewportReady && width < 1024;
  const bottomPadding = isViewportReady && isMobile ? (drawerHeight === 'full' ? 500 : (drawerHeight === 'half' ? 350 : 156)) : 0;
  const leftPadding = 0;

  // L'index national fait plusieurs Mo : inutile de le charger
  // pour la vue nationale tant qu'aucun professionnel n'est demandé.
  const shouldLoadPoints =
    activeFilters.length > 0 ||
    Boolean(selectedId) ||
    appliedSearchTerm.trim().length > 0;

  // Index public partagé : aucun scan Firestore pour les marqueurs.
  useEffect(() => {
    if (!shouldLoadPoints || points.length > 0) return;

    let cancelled = false;

    setIsLoadingPoints(true);

    loadPublicMapPoints()
      .then(mapped => {
        if (cancelled) return;
        setPoints(mapped as MapPoint[]);
        setIsLoadingPoints(false);
      })
      .catch(error => {
        if (cancelled) return;
        console.error('[MAP] Erreur chargement points.json:', error);
        setIsLoadingPoints(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shouldLoadPoints, points.length]);

    // Chargement du cache départements
  useEffect(() => {
    const { firebaseApp } = initializeFirebaseClient();
    if (!firebaseApp) return;
    const db = getFirestore(firebaseApp);
    getDoc(doc(db, 'cache', 'departements_count'))
      .then(snap => { if (snap.exists()) setDeptCounts(snap.data().counts); })
      .catch(() => {});
  }, []);

  const [
    selectedAreaFeature,
    setSelectedAreaFeature,
  ] = useState<any | null>(null);

  function isPointInsideRing(
    lng: number,
    lat: number,
    ring: number[][]
  ) {
    let inside = false;

    for (
      let i = 0, j = ring.length - 1;
      i < ring.length;
      j = i++
    ) {
      const xi = ring[i][0];
      const yi = ring[i][1];

      const xj = ring[j][0];
      const yj = ring[j][1];

      const intersects =
        (
          (yi > lat) !==
          (yj > lat)
        ) &&
        (
          lng <
          (
            (xj - xi) *
            (lat - yi)
          ) /
          (
            (yj - yi) ||
            Number.EPSILON
          ) +
          xi
        );

      if (intersects) {
        inside = !inside;
      }
    }

    return inside;
  }

  function isPointInsidePolygon(
    lng: number,
    lat: number,
    polygon: number[][][]
  ) {
    if (
      !polygon.length ||
      !isPointInsideRing(
        lng,
        lat,
        polygon[0]
      )
    ) {
      return false;
    }

    // Les anneaux suivants sont d'eventuels trous.
    for (
      let i = 1;
      i < polygon.length;
      i++
    ) {
      if (
        isPointInsideRing(
          lng,
          lat,
          polygon[i]
        )
      ) {
        return false;
      }
    }

    return true;
  }

  function isPointInsideGeoFeature(
    lng: number,
    lat: number,
    feature: any
  ) {
    if (
      !Number.isFinite(lng) ||
      !Number.isFinite(lat)
    ) {
      return false;
    }

    const geometry =
      feature?.geometry;

    if (!geometry) {
      return false;
    }

    if (
      geometry.type === 'Polygon'
    ) {
      return isPointInsidePolygon(
        lng,
        lat,
        geometry.coordinates
      );
    }

    if (
      geometry.type === 'MultiPolygon'
    ) {
      return geometry.coordinates.some(
        (polygon: number[][][]) =>
          isPointInsidePolygon(
            lng,
            lat,
            polygon
          )
      );
    }

    return false;
  }
  const searchIntent = useMemo(() => {
    if (!appliedSearchTerm) return null;

    const lowerQuery =
      normalizeText(appliedSearchTerm);

    const tokens =
      lowerQuery
        .split(/\s+/)
        .filter(Boolean);

    let brand: string | null = null;
    let dept: string | null = null;
    let postalCode: string | null = null;
    let postalDept: string | null = null;
    let city: string | null = null;
    let cityMatched = false;

    // ===============================================
    // CODE POSTAL
    // ===============================================

    const cpMatch =
      lowerQuery.match(
        /\b\d{5}\b/
      );

    if (cpMatch) {
      postalCode =
        cpMatch[0];

      postalDept =
        postalCode.startsWith('97')
          ? postalCode.substring(0, 3)
          : postalCode.substring(0, 2);
    }

    // ===============================================
    // ARRONDISSEMENT
    //
    // La détection est faite AVANT celle du département.
    // ===============================================

    const cityFirstArrondissement =
      lowerQuery.match(
        /\b(paris|lyon|marseille)\s+(\d{1,2})\s*(?:er|e|eme)?(?:\s+arrondissement)?\b/
      );

    const numberFirstArrondissement =
      lowerQuery.match(
        /\b(\d{1,2})\s*(?:er|e|eme)?(?:\s+arrondissement)?\s+(?:de\s+)?(paris|lyon|marseille)\b/
      );

    let arrondissement:
      {
        city: string;
        number: number;
        postalCode: string;
        dept: string;
      } | null = null;

    let arrondissementCity:
      string | null = null;

    let arrondissementNumber:
      number | null = null;

    if (cityFirstArrondissement) {
      arrondissementCity =
        cityFirstArrondissement[1];

      arrondissementNumber =
        Number(
          cityFirstArrondissement[2]
        );
    }
    else if (numberFirstArrondissement) {
      arrondissementCity =
        numberFirstArrondissement[2];

      arrondissementNumber =
        Number(
          numberFirstArrondissement[1]
        );
    }

    const arrondissementConfig:
      Record<
        string,
        {
          max: number;
          dept: string;
          prefix: string;
        }
      > = {
        paris: {
          max: 20,
          dept: '75',
          prefix: '75',
        },
        lyon: {
          max: 9,
          dept: '69',
          prefix: '69',
        },
        marseille: {
          max: 16,
          dept: '13',
          prefix: '13',
        },
      };

    if (
      arrondissementCity &&
      arrondissementNumber
    ) {
      const config =
        arrondissementConfig[
          arrondissementCity
        ];

      if (
        config &&
        arrondissementNumber >= 1 &&
        arrondissementNumber <= config.max
      ) {
        arrondissement = {
          city:
            arrondissementCity,

          number:
            arrondissementNumber,

          dept:
            config.dept,

          postalCode:
            `${
              config.prefix
            }${
              String(
                arrondissementNumber
              ).padStart(3, '0')
            }`,
        };
      }
    }

    // ===============================================
    // DEPARTEMENT
    //
    // Paris 13 -> le token 13 est ignoré ici.
    // "13" seul reste bien Bouches-du-Rhône.
    // ===============================================

    const deptRegex =
      /^(0[1-9]|[1-8]\d|9[0-5]|2[AB]|97[1-46])$/;

    for (const token of tokens) {
      const upperToken =
        token.toUpperCase();

      const isArrondissementNumber =
        Boolean(
          arrondissement &&
          token ===
            String(
              arrondissement.number
            )
        );

      if (isArrondissementNumber) {
        continue;
      }

      if (
        deptRegex.test(
          upperToken
        ) &&
        token.length <= 3
      ) {
        dept =
          upperToken;

        break;
      }
    }

    // ===============================================
    // DEPARTEMENT EN CHIFFRES OU EN LETTRES
    //
    // 33 = Gironde
    // 78 = Yvelines
    // 24 = Dordogne
    // ===============================================

    const resolvedDepartmentCode =
      !arrondissement &&
      !postalCode
        ? resolveDepartmentCodeFromQuery(
            appliedSearchTerm
          )
        : null;

    if (
      !dept &&
      resolvedDepartmentCode
    ) {
      dept =
        resolvedDepartmentCode;
    }

    const resolvedCityName =
      !dept &&
      !arrondissement &&
      !postalCode
        ? resolveCityNameFromQuery(
            appliedSearchTerm
          )
        : null;
    // ===============================================
    // MARQUE
    //
    // Permet notamment :
    // CF Moto = CFMOTO
    // ===============================================

    const compactQuery =
      lowerQuery.replace(
        /[^a-z0-9]/g,
        ''
      );

    brand =
      MOTORCYCLE_BRANDS.find(
        candidate => {
          const normalizedCandidate =
            normalizeText(
              candidate
            );

          const compactCandidate =
            normalizedCandidate.replace(
              /[^a-z0-9]/g,
              ''
            );

          return (
            lowerQuery.includes(
              normalizedCandidate
            ) ||
            (
              compactCandidate.length >= 3 &&
              compactQuery.includes(
                compactCandidate
              )
            )
          );
        }
      ) || null;

    const compactBrand =
      brand
        ? normalizeText(
            brand
          ).replace(
            /[^a-z0-9]/g,
            ''
          )
        : '';

    const genericMotoTokens =
      new Set([
        'moto',
        'motos',
        'motard',
        'motards',
      ]);

    // ===============================================
    // VILLE
    // ===============================================

    if (arrondissement) {
      city =
        arrondissement.city;

      cityMatched =
        true;
    }
    else if (dept) {
      city =
        null;

      cityMatched =
        false;
    }
    else if (resolvedCityName) {
      city =
        normalizeText(
          resolvedCityName
        );

      cityMatched =
        true;
    }
    else {
      const cityTokens =
        tokens.filter(
          token => {
            const compactToken =
              token.replace(
                /[^a-z0-9]/g,
                ''
              );

            if (
              postalCode &&
              token === postalCode
            ) {
              return false;
            }

            if (
              dept &&
              token.toUpperCase() === dept
            ) {
              return false;
            }

            if (
              brand &&
              compactToken &&
              compactBrand.includes(
                compactToken
              )
            ) {
              return false;
            }

            if (
              genericMotoTokens.has(
                token
              )
            ) {
              return false;
            }

            return true;
          }
        );

      if (cityTokens.length > 0) {
        city =
          cityTokens.join(' ');
      }
    }

    // ===============================================
    // GEO DE SECOURS
    //
    // Sur la homepage les lat/lng exacts sont déjà fournis.
    // Ce bloc sert surtout pour les deep links /map.
    // ===============================================

    let targetGeo:
      {
        coords: [number, number];
        zoom: number;
      } | null = null;

    if (arrondissement) {
      const loc =
        Object.entries(
          locationsData
        ).find(
          ([key]) =>
            key.startsWith(
              arrondissement.dept
            )
        );

      if (loc) {
        targetGeo = {
          coords:
            (loc[1] as any).center,
          zoom: 13,
        };
      }
    }
    else if (postalCode) {
      const departmentCode =
        postalDept ||
        postalCode.substring(0, 2);

      const loc =
        Object.entries(
          locationsData
        ).find(
          ([key]) =>
            key.startsWith(
              departmentCode
            )
        );

      if (loc) {
        targetGeo = {
          coords:
            (loc[1] as any).center,
          zoom: 12,
        };
      }
    }
    else if (city) {
      // IMPORTANT :
      // locationsData.info.center correspond au département.
      //
      // Le centre exact d'une ville est obtenu au moment
      // de la validation via l'API Adresse.
    }
    if (
      !targetGeo &&
      dept
    ) {
      const loc =
        Object.entries(
          locationsData
        ).find(
          ([key]) =>
            key.startsWith(
              dept
            )
        );

      if (loc) {
        targetGeo = {
          coords:
            (loc[1] as any).center,
          zoom: 9,
        };
      }
    }

    // ===============================================
    // TEXTE LIBRE
    // ===============================================

    const freeTextTokens =
      !brand &&
      !dept &&
      !postalCode &&
      !cityMatched &&
      !arrondissement
        ? tokens.filter(
            token =>
              !genericMotoTokens.has(
                token
              )
          )
        : [];

    return {
      brand,
      dept,
      postalCode,
      postalDept,
      city,
      cityMatched,
      arrondissement,
      targetGeo,
      freeTextTokens,
    };
  }, [appliedSearchTerm]);
  const selectedAreaMeta =
    useMemo(() => {
      const current =
        searchIntent?.arrondissement;

      let city:
        'paris' |
        'lyon' |
        'marseille' |
        null = null;

      let number:
        number | null = null;

      if (current) {
        const normalizedCity =
          normalizeText(
            current.city
          );

        if (
          normalizedCity === 'paris' ||
          normalizedCity === 'lyon' ||
          normalizedCity === 'marseille'
        ) {
          city =
            normalizedCity as
              'paris' |
              'lyon' |
              'marseille';

          number =
            Number(
              current.number
            );
        }
      }

      // Un code postal d'arrondissement doit produire
      // exactement le meme polygone.
      if (
        !city &&
        searchIntent?.postalCode
      ) {
        const cp =
          searchIntent.postalCode;

        const areaNumber =
          Number(
            cp.slice(2)
          );

        if (
          cp.startsWith('75') &&
          areaNumber >= 1 &&
          areaNumber <= 20
        ) {
          city = 'paris';
          number = areaNumber;
        }
        else if (
          cp.startsWith('69') &&
          areaNumber >= 1 &&
          areaNumber <= 9
        ) {
          city = 'lyon';
          number = areaNumber;
        }
        else if (
          cp.startsWith('13') &&
          areaNumber >= 1 &&
          areaNumber <= 16
        ) {
          city = 'marseille';
          number = areaNumber;
        }
      }

      if (
        !city ||
        !number
      ) {
        return null;
      }

      if (city === 'paris') {
        return {
          city,
          number,
          code:
            `751${
              String(number).padStart(
                2,
                '0'
              )
            }`,
          file:
            '/arrondissements/paris.geojson',
        };
      }

      if (city === 'lyon') {
        return {
          city,
          number,
          code:
            `6938${number}`,
          file:
            '/arrondissements/lyon.geojson',
        };
      }

      return {
        city,
        number,
        code:
          `132${
            String(number).padStart(
              2,
              '0'
            )
          }`,
        file:
          '/arrondissements/marseille.geojson',
      };
    }, [
      searchIntent,
    ]);

  // Charger la limite administrative sélectionnée :
  // arrondissement OU département.
  useEffect(() => {
    let cancelled = false;

    const loadBoundary =
      async () => {
        let file:
          string | null = null;

        let code:
          string | null = null;

        if (selectedAreaMeta) {
          file =
            selectedAreaMeta.file;

          code =
            selectedAreaMeta.code;
        }
        else if (
          searchIntent?.dept
        ) {
          file =
            '/departements.geojson';

          code =
            searchIntent.dept;
        }

        if (
          !file ||
          !code
        ) {
          setSelectedAreaFeature(
            null
          );

          return;
        }

        try {
          const response =
            await fetch(
              file
            );

          if (!response.ok) {
            throw new Error(
              `GeoJSON ${response.status}`
            );
          }

          const data =
            await response.json();

          if (cancelled) {
            return;
          }

          const normalizedCode =
            String(
              code
            ).toUpperCase();

          const feature =
            data?.features?.find(
              (candidate: any) =>
                String(
                  candidate?.properties?.code ||
                  ''
                ).toUpperCase() ===
                normalizedCode
            );

          setSelectedAreaFeature(
            feature ||
            null
          );
        }
        catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            'Erreur chargement limite administrative:',
            error
          );

          setSelectedAreaFeature(
            null
          );
        }
      };

    void loadBoundary();

    return () => {
      cancelled = true;
    };
  }, [
    selectedAreaMeta,
    searchIntent?.dept,
  ]);
  // Centrer automatiquement une recherche géographique
  // lorsqu'aucune coordonnée explicite n'est déjà dans l'URL.
  useEffect(() => {
    if (!hasAppliedInitialUrl) return;
    if (!searchIntent?.targetGeo) return;

    const params =
      new URLSearchParams(
        window.location.search
      );

    if (
      params.has('lat') &&
      params.has('lng')
    ) {
      return;
    }

    setMapCenter(
      searchIntent.targetGeo.coords
    );

    setMapZoom(
      searchIntent.targetGeo.zoom
    );

    setSelectionSource(
      'external'
    );
  }, [
    hasAppliedInitialUrl,
    searchIntent,
  ]);

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
      const hasCategoryFilters =
        activeFilters.length > 0;

      // ===============================================
      // CATEGORIE
      // ===============================================

      if (hasCategoryFilters) {
        if (p.appSection === 'both') {
          if (
            !activeFilters.includes('shopping') &&
            !activeFilters.includes('service')
          ) {
            return false;
          }
        }
        else if (
          !activeFilters.includes(
            p.appSection
          )
        ) {
          return false;
        }
      }

      if (!searchIntent) {
        return hasCategoryFilters;
      }

      const {
        brand,
        dept,
        postalCode,
        postalDept,
        cityMatched,
        freeTextTokens,
      } = searchIntent;

      const pDept =
        getItemDepartment(p);

      const pBrands =
        (
          (p as any).brands ||
          []
        ).map(
          (value: string) =>
            normalizeText(value)
        );

      const pTitle =
        normalizeText(
          p.title || ''
        );

      const pCategory =
        normalizeText(
          (p as any).category || ''
        );

      const pAddress =
        normalizeText(
          (p as any).address ||
          (p as any).addr ||
          ''
        );

      // ===============================================
      // MARQUE
      // ===============================================

      if (brand) {
        const compactBrand =
          normalizeText(
            brand
          ).replace(
            /[^a-z0-9]/g,
            ''
          );

        const compactTitle =
          pTitle.replace(
            /[^a-z0-9]/g,
            ''
          );

        const compactPointBrands =
          pBrands.map(
            value =>
              value.replace(
                /[^a-z0-9]/g,
                ''
              )
          );

        const brandMatches =
          compactTitle.includes(
            compactBrand
          ) ||
          compactPointBrands.some(
            pointBrand =>
              pointBrand.includes(
                compactBrand
              ) ||
              compactBrand.includes(
                pointBrand
              )
          );

        if (!brandMatches) {
          return false;
        }
      }

      // ===============================================
      // ARRONDISSEMENT EXACT
      //
      // Le contour administratif devient la
      // source de verite.
      //
      // Aucun viewport approximatif.
      // Aucun simple test de code postal.
      // ===============================================

      if (selectedAreaMeta) {
        if (!selectedAreaFeature) {
          return false;
        }

        if (
          !isPointInsideGeoFeature(
            Number(
              p.longitude
            ),
            Number(
              p.latitude
            ),
            selectedAreaFeature
          )
        ) {
          return false;
        }
      }
      else {
        // =============================================
        // DEPARTEMENT CLASSIQUE
        // =============================================

        if (
          dept &&
          pDept !== dept
        ) {
          return false;
        }

        // =============================================
        // CODE POSTAL CLASSIQUE
        // hors arrondissement
        // =============================================

        if (
          postalDept &&
          pDept !== postalDept
        ) {
          return false;
        }

        // =============================================
        // VILLE / CODE POSTAL :
        // logique viewport existante conservee.
        // =============================================

        if (
          mapBounds &&
          mapZoom >= 11 &&
          (
            postalCode ||
            cityMatched
          )
        ) {
          const isInViewport =
            p.latitude >=
              mapBounds.getSouth() &&
            p.latitude <=
              mapBounds.getNorth() &&
            p.longitude >=
              mapBounds.getWest() &&
            p.longitude <=
              mapBounds.getEast();

          if (!isInViewport) {
            return false;
          }
        }
      }

      // ===============================================
      // TEXTE LIBRE
      // ===============================================

      if (
        freeTextTokens.length > 0
      ) {
        const haystack =
          [
            pTitle,
            pCategory,
            pAddress,
            ...pBrands,
          ].join(' ');

        const matchesFreeText =
          freeTextTokens.every(
            token =>
              haystack.includes(
                token
              )
          );

        if (!matchesFreeText) {
          return false;
        }
      }

      return true;
    });
  }, [
    points,
    searchIntent,
    selectedAreaMeta,
    selectedAreaFeature,
    activeFilters,
    mapBounds,
    mapZoom,
  ]);
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

  // Quand une fiche est sélectionnée, elle remonte en tête de liste
  // (cf. tri dans listPoints). On fait suivre le conteneur scrollable
  // pour que l'utilisateur voie effectivement la fiche sélectionnée.
  useEffect(() => {
    if (!selectedId) return;
    if (isDetailView) return;
    const el = listScrollRef.current;
    if (!el) return;
    // Léger délai : laisse le temps au tri et au rendu de s'appliquer
    const t = setTimeout(() => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(t);
  }, [selectedId, isDetailView]);

  // La métropole s'étend environ de -5° à 10° de longitude et 41° à 51° de latitude.
  // Au-delà, on considère que l'utilisateur regarde un DOM-TOM et on lui propose
  // un retour rapide plutôt qu'un long déplacement manuel de la carte.
  const isViewingOverseas = useMemo(() => {
    const [lat, lng] = mapCenter;
    return lng < -10 || lng > 20 || lat < 38 || lat > 54;
  }, [mapCenter]);

  const labelPoints = useMemo(() => {
    // ---------------------------------------------------------
    // NOMS DES PROFESSIONNELS SELON LE ZOOM
    //
    // Plus on zoome, plus le nombre de noms augmente.
    // Les points visibles et proches du centre sont prioritaires.
    // ---------------------------------------------------------

    if (mapZoom < 13) {
      return [];
    }

    const gridStep =
      mapZoom < 14
        ? 0.018
        : mapZoom < 15
          ? 0.0075
          : mapZoom < 16
            ? 0.003
            : mapZoom < 17
              ? 0.0012
              : 0.0005;

    const maxLabels =
      mapZoom < 14
        ? 4
        : mapZoom < 15
          ? 7
          : mapZoom < 16
            ? 12
            : mapZoom < 17
              ? 20
              : 32;

    const seen =
      new Set<string>();

    const results: MapPoint[] =
      [];

    // ---------------------------------------------------------
    // PROFESSIONNEL SELECTIONNE
    // Toujours prioritaire.
    // ---------------------------------------------------------

    const selected =
      filteredPoints.find(
        point =>
          point.id === selectedId
      );

    if (selected) {
      const selectedKey =
        `${Math.floor(
          selected.latitude /
            gridStep
        )},${Math.floor(
          selected.longitude /
            gridStep
        )}`;

      seen.add(
        selectedKey
      );

      results.push(
        selected
      );
    }

    // ---------------------------------------------------------
    // UNIQUEMENT LES POINTS DANS LE VIEWPORT
    // ---------------------------------------------------------

    const candidates =
      filteredPoints
        .filter(point => {
          if (
            point.id ===
            selectedId
          ) {
            return false;
          }

          if (!mapBounds) {
            return true;
          }

          return (
            point.latitude >=
              mapBounds.getSouth() &&
            point.latitude <=
              mapBounds.getNorth() &&
            point.longitude >=
              mapBounds.getWest() &&
            point.longitude <=
              mapBounds.getEast()
          );
        })

        // -----------------------------------------------------
        // PRIORITE AUX POINTS LES PLUS PROCHES DU CENTRE
        // -----------------------------------------------------

        .sort((a, b) => {
          const distanceA =
            Math.pow(
              a.latitude -
                mapCenter[0],
              2
            ) +
            Math.pow(
              a.longitude -
                mapCenter[1],
              2
            );

          const distanceB =
            Math.pow(
              b.latitude -
                mapCenter[0],
              2
            ) +
            Math.pow(
              b.longitude -
                mapCenter[1],
              2
            );

          return (
            distanceA -
            distanceB
          );
        });

    // ---------------------------------------------------------
    // GRILLE ANTI-SATURATION
    // ---------------------------------------------------------

    for (
      const point of candidates
    ) {
      if (
        results.length >=
        maxLabels
      ) {
        break;
      }

      const key =
        `${Math.floor(
          point.latitude /
            gridStep
        )},${Math.floor(
          point.longitude /
            gridStep
        )}`;

      if (
        seen.has(
          key
        )
      ) {
        continue;
      }

      seen.add(
        key
      );

      results.push(
        point
      );
    }

    return results;
  }, [
    filteredPoints,
    mapZoom,
    selectedId,
    mapCenter,
    mapBounds,
  ]);
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
        <div
          className={cn(
            "relative w-full bg-white rounded-t-[28px] px-2 overflow-visible transition-all duration-300",
            activeFilters.length === 0
              ? "min-h-[132px] pt-5 pb-1"
              : "min-h-[96px] pt-3 pb-0"
          )}
        >
          <div className="text-center px-12 mb-2">
            <p
              className={cn(
                "inline-flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                activeFilters.length === 0
                  ? "bg-brand text-white rounded-full px-4 py-2 shadow-md animate-bounce motion-reduce:animate-none"
                  : "text-muted-foreground"
              )}
              style={
                activeFilters.length === 0
                  ? {
                      animationDuration: '550ms',
                      animationIterationCount: 1,
                    }
                  : undefined
              }
            >
              {activeFilters.length === 0 ? (searchTerm.trim() ? 'Recherche active' : 'Choisir un filtre') : 'Catégories actives'}
            </p>

            {activeFilters.length === 0 && (
              <p className="mt-1.5 text-[10px] font-bold leading-tight text-muted-foreground">
                Choisissez une catégorie pour afficher les pros
              </p>
            )}
          </div>

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

  async function handleDirectMapSearch(
    queryOverride?: string
  ) {
    const rawQuery =
      (
        queryOverride ??
        searchTerm
      ).trim();

    if (!rawQuery) {
      setSearchTerm('');
      setAppliedSearchTerm('');
      setSelectedId(null);
      setIsDetailView(false);
      setBboxToFit(null);
      setDeptToFit(null);
      setSelectedAreaFeature(null);
      return;
    }

    setSearchTerm(
      rawQuery
    );

    setAppliedSearchTerm(
      rawQuery
    );

    setSelectedId(
      null
    );

    setIsDetailView(
      false
    );

    setBboxToFit(
      null
    );

    setDeptToFit(
      null
    );

    setSelectedAreaFeature(
      null
    );

    setSelectionSource(
      'external'
    );

    // ===============================================
    // DEPARTEMENT
    //
    // Exactement le même chemin :
    //
    // 33
    // Gironde
    // Honda 33
    // Honda Gironde
    // ===============================================

    const departmentCode =
      resolveDepartmentCodeFromQuery(
        rawQuery
      );

    if (departmentCode) {
      setDeptToFit(
        departmentCode
      );

      return;
    }

    // ===============================================
    // ARRONDISSEMENT
    //
    // Le polygone officiel prend ensuite le relais.
    // ===============================================

    if (
      isMunicipalArrondissementQuery(
        rawQuery
      )
    ) {
      return;
    }

    const normalizedQuery =
      normalizeText(
        rawQuery
      );

    const postalCode =
      normalizedQuery.match(
        /\b\d{5}\b/
      )?.[0] ||
      null;

    // ===============================================
    // CODES POSTAUX GENERIQUES DES GRANDES VILLES
    //
    // 75000 -> Paris
    // 69000 -> Lyon
    // 13000 -> Marseille
    //
    // Les codes d'arrondissements restent gérés
    // séparément :
    // 75001-75020
    // 69001-69009
    // 13001-13016
    // ===============================================

    const genericPostalCity =
      postalCode === '75000'
        ? 'Paris'
        : postalCode === '69000'
          ? 'Lyon'
          : postalCode === '13000'
            ? 'Marseille'
            : null;

    if (genericPostalCity) {
      try {
        const params =
          new URLSearchParams();

        params.set(
          'q',
          genericPostalCity
        );

        params.set(
          'limit',
          '1'
        );

        params.set(
          'autocomplete',
          '0'
        );

        params.set(
          'type',
          'municipality'
        );

        const response =
          await fetch(
            `https://data.geopf.fr/geocodage/search?${params.toString()}`
          );

        if (!response.ok) {
          console.warn(
            'Geocodage ville generique impossible :',
            genericPostalCity
          );

          return;
        }

        const data =
          await response.json();

        const coordinates =
          data?.features?.[0]
            ?.geometry
            ?.coordinates;

        if (
          !Array.isArray(
            coordinates
          ) ||
          coordinates.length < 2
        ) {
          console.warn(
            'Coordonnees ville generique introuvables :',
            genericPostalCity
          );

          return;
        }

        const lng =
          Number(
            coordinates[0]
          );

        const lat =
          Number(
            coordinates[1]
          );

        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng)
        ) {
          return;
        }

        setMapCenter([
          lat,
          lng,
        ]);

        // Même niveau que la recherche par nom de ville.
        setMapZoom(
          12
        );

        setSelectionSource(
          'external'
        );
      }
      catch (error) {
        console.error(
          'Erreur geocodage ville generique :',
          error
        );
      }

      return;
    }
    // ===============================================
    // VILLE
    // ===============================================

    const cityName =
      resolveCityNameFromQuery(
        rawQuery
      );

    const compactQuery =
      compactGeographyValue(
        rawQuery
      );

    const detectedBrand =
      MOTORCYCLE_BRANDS.find(
        candidate => {
          const compactBrand =
            compactGeographyValue(
              candidate
            );

          return (
            compactBrand.length >= 3 &&
            compactQuery.includes(
              compactBrand
            )
          );
        }
      ) || null;

    let locationQuery:
      string | null = null;

    if (postalCode) {
      locationQuery =
        postalCode;
    }
    else if (cityName) {
      locationQuery =
        cityName;
    }
    else if (!detectedBrand) {
      // Ville qui ne serait pas encore présente
      // dans notre index local.
      locationQuery =
        rawQuery;
    }

    // Recherche uniquement par marque :
    // aucun déplacement de carte.
    if (!locationQuery) {
      return;
    }

    try {
      const params =
        new URLSearchParams();

      params.set(
        'q',
        locationQuery
      );

      params.set(
        'limit',
        '1'
      );

      params.set(
        'autocomplete',
        '0'
      );

      if (!postalCode) {
        params.set(
          'type',
          'municipality'
        );
      }

      const response =
        await fetch(
          `https://data.geopf.fr/geocodage/search?${params.toString()}`
        );

      if (!response.ok) {
        console.warn(
          'Geocodage impossible :',
          locationQuery
        );

        return;
      }

      const data =
        await response.json();

      const feature =
        data?.features?.[0];

      const coordinates =
        feature?.geometry?.coordinates;

      if (
        !Array.isArray(
          coordinates
        ) ||
        coordinates.length < 2
      ) {
        console.warn(
          'Coordonnees introuvables :',
          locationQuery
        );

        return;
      }

      const lng =
        Number(
          coordinates[0]
        );

      const lat =
        Number(
          coordinates[1]
        );

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      setMapCenter([
        lat,
        lng,
      ]);

      setMapZoom(
        postalCode
          ? 13
          : 12
      );

      setSelectionSource(
        'external'
      );
    }
    catch (error) {
      console.error(
        'Erreur geocodage recherche :',
        error
      );
    }
  }
  return (
    <div className="relative w-full h-screen [height:100dvh] overflow-hidden bg-[#f7f7f5]">
      {isViewportReady && !isMobile && (
        <header className="absolute inset-x-0 top-0 z-[1600] h-[80px] border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
          <div className="flex h-full items-center px-8">
            <div className="flex w-[410px] shrink-0 items-center">
              <LabelMotoLogo
                noBubble
                className="w-[150px] border-none bg-transparent px-0 shadow-none"
              />
            </div>

            <nav className="flex h-full items-center gap-9 text-[14px] font-bold text-foreground">
              <a
                href="/map"
                className="flex h-full items-center border-b-[3px] border-brand text-brand"
              >
                Carte
              </a>

              <a
                href="/entretien"
                className="flex h-full items-center border-b-[3px] border-transparent transition-colors hover:text-brand"
              >
                Entretien
              </a>

              <a
                href="/info"
                className="flex h-full items-center border-b-[3px] border-transparent transition-colors hover:text-brand"
              >
                Guides & conseils
              </a>

              <a
                href="/"
                className="flex h-full items-center border-b-[3px] border-transparent transition-colors hover:text-brand"
              >
                Fiches moto
              </a>
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/login"
                className="text-[12px] font-semibold text-foreground transition-colors hover:text-brand"
              >
                Connexion
              </Link>

              <Link
                href="/account"
                aria-label="Menu"
                className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] bg-white shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                <Menu className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>
      )}

      <div
        className={cn(
          "absolute z-0",
          !isViewportReady || isMobile
            ? "inset-0"
            : "left-[608px] right-6 top-[104px] bottom-[214px] overflow-hidden rounded-[28px] border border-black/[0.06] bg-[#f1f2f2] shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
        )}
      >
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
          selectedAreaFeature={selectedAreaFeature}
          isMobile={isMobile}
        />
      </div>

      <div
        className={cn(
          "absolute z-[1500]",
          !isViewportReady
            ? "left-6 right-6 top-6 lg:left-auto lg:right-6 lg:w-[400px]"
            : isMobile
              ? "left-6 right-6 top-6"
              : "hidden"
        )}
      >
        <Header
          searchOnly={!isViewportReady || !isMobile}
          searchTerm={searchTerm}
          onSearchTermChange={(val: string) => {
            if (val !== searchTerm) {
              setSelectedId(null);
              setIsDetailView(false);
              setSelectionSource(null);
            }

            setSearchTerm(
              val
            );

            if (!val.trim()) {
              setAppliedSearchTerm('');
            }
          }}
          onSearch={handleDirectMapSearch}
          onSuggestionSelect={(
            lat: number,
            lng: number,
            bbox?: [number, number, number, number],
            dealerId?: string
          ) => {
            if (bbox) { setBboxToFit(bbox); setDeptToFit(null); }
            else if (dealerId) handleMarkerClick(dealerId);
            else { setMapCenter([lat, lng]); setSelectionSource('external'); }
          }}
        />

      </div>

      {isViewportReady && !isMobile && (
        <form
          data-map-home-search
          onSubmit={(event) => {
            event.preventDefault();

            const combinedSearch = [
              desktopWhat.trim(),
              desktopWhere.trim(),
            ]
              .filter(Boolean)
              .join(' ');

            setSelectedId(null);
            setIsDetailView(false);
            setSelectionSource(null);

            if (!combinedSearch) {
              setAppliedSearchTerm('');
              return;
            }

            handleDirectMapSearch(
              combinedSearch
            );
          }}
          className="absolute left-6 top-[104px] z-[1500] w-[560px] rounded-[1.65rem] border border-black/[0.035] bg-white/[0.97] p-3 shadow-[0_18px_48px_rgba(0,0,0,0.09)]"
        >
          <label
            className="flex min-h-[55px] items-center gap-3 rounded-[1rem] border border-border/75 bg-white px-4"
          >
            <Search
              className="h-[18px] w-[18px] shrink-0 text-brand"
            />

            <input
              value={desktopWhat}
              onChange={(event) => {
                const value =
                  event.target.value;

                setDesktopWhat(
                  value
                );

                setSelectedId(null);
                setIsDetailView(false);
                setSelectionSource(null);

                if (
                  !value.trim() &&
                  !desktopWhere.trim()
                ) {
                  setAppliedSearchTerm('');
                }
              }}
              placeholder="Que recherchez-vous ?"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground md:text-[13px] md:font-bold"
            />
          </label>

          <label
            className="mt-2 flex min-h-[55px] items-center gap-3 rounded-[1rem] border border-border/75 bg-white px-4"
          >
            <MapPin
              className="h-[18px] w-[18px] shrink-0 text-brand"
            />

            <input
              value={desktopWhere}
              onChange={(event) => {
                const value =
                  event.target.value;

                setDesktopWhere(
                  value
                );

                setSelectedId(null);
                setIsDetailView(false);
                setSelectionSource(null);

                if (
                  !value.trim() &&
                  !searchTerm.trim()
                ) {
                  setAppliedSearchTerm('');
                }
              }}
              placeholder="Où ? Ville ou code postal"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground md:text-[13px] md:font-bold"
            />

            <button
              type="button"
              onClick={handleLocate}
              aria-label="Utiliser ma position"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand/5"
            >
              {isLocating ? (
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />
              ) : (
                <Crosshair
                  className="h-4 w-4"
                />
              )}
            </button>
          </label>

          <button
            type="submit"
            className="mt-2 min-h-[50px] w-full rounded-[0.95rem] bg-brand text-[15px] font-semibold text-white shadow-lg transition-all hover:bg-brand/90 active:scale-[0.99] md:text-[13px] md:font-black"
          >
            Rechercher
          </button>
        </form>
      )}
      {isViewportReady && !isMobile && (
        <aside className="absolute left-6 top-[310px] bottom-6 z-[1000] flex w-[560px] flex-col overflow-hidden bg-transparent">
          <div className="hidden">
            <div className="shrink-0"><LabelMotoLogo noBubble className="w-32 md:w-40 px-0 shadow-none border-none bg-transparent" /></div>
            <div className="shrink-0"><UserMenu /></div>
          </div>
          <div className="mb-3 shrink-0 space-y-3 rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-[0_6px_24px_rgba(0,0,0,0.045)]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">Explorer par catégorie</p>
            <FilterButtons />
          </div>
          <div ref={listScrollRef} className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {isDetailView && selectedId ? (
              <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => setIsDetailView(false)} />
            ) : (
              <div className="space-y-4">
                {activeFilters.length === 0 && !searchTerm.trim() && !isLoadingPoints && (
                  <div className="rounded-3xl border-2 border-dashed border-brand/40 bg-brand/5 px-6 py-5 mb-4">
                    <p className="text-sm font-black uppercase tracking-wide text-brand mb-1">
                      Choisissez un filtre
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sélectionnez au moins une catégorie ci-dessus pour faire apparaître
                      les professionnels sur la carte.
                    </p>
                  </div>
                )}
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

      {isViewportReady && isMobile && (
        <div className={cn("fixed left-0 right-0 bg-white rounded-t-[28px] shadow-2xl transition-all duration-500 ease-out z-[1100]", drawerHeight === 'collapsed'
            ? 'bottom-0 h-[132px]'
            : drawerHeight === 'half'
              ? 'bottom-0 h-[65vh]'
              : 'top-[220px] bottom-0 h-auto')}>
          <div className="h-full flex flex-col">
            <div className="shrink-0"><FilterButtons mobile /></div>
            <div
              ref={listScrollRef}
              className={cn(
                "flex-1 overflow-y-auto custom-scrollbar",
                isDetailView
                  ? "px-5 pt-2 pb-5"
                  : "px-4 pt-1 pb-4"
              )}
            >
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
      {/* Contrôle DOM/TOM mobile — fixe sur la carte et masqué naturellement par le drawer */}
      {!isMobile && (
        <div
          data-map-ad-space
          className="
            absolute
            bottom-6
            left-[608px]
            right-6
            z-[1000]
            flex
            h-[166px]
            items-center
            justify-center
            overflow-hidden
            rounded-[26px]
            border
            border-dashed
            border-black/10
            bg-white/70
          "
        >
          <div className="text-center">
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.28em]
                text-muted-foreground
              "
            >
              Espace publicitaire
            </p>

            <p
              className="
                mt-2
                text-[12px]
                font-medium
                text-muted-foreground/60
              "
            >
              Emplacement réservé
            </p>
          </div>
        </div>
      )}
      {isViewportReady && isMobile && (
        <div
          className="fixed left-4 z-[1000]"
          style={{ bottom: '148px' }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Iles DOM-TOM"
                className="h-12 w-12 rounded-full bg-white/95 shadow-xl border-2 border-white flex flex-col items-center justify-center leading-none text-[9px] font-black uppercase tracking-tight text-muted-foreground active:scale-95 transition-all"
              >
                <span>DOM</span>
                <span>TOM</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              side="top"
              className="z-[1600]"
            >
              {[
                { label: 'La Reunion', center: [-21.1, 55.5] as [number, number], zoom: 10 },
                { label: 'Martinique', center: [14.6, -61.0] as [number, number], zoom: 10 },
                { label: 'Guadeloupe', center: [16.2, -61.5] as [number, number], zoom: 10 },
              ].map(t => (
                <DropdownMenuItem
                  key={t.label}
                  onClick={() => {
                    setMapCenter(t.center);
                    setMapZoom(t.zoom);
                    setSelectionSource('external');
                  }}
                >
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Bouton boussole */}
      {isViewportReady && (
        <button
          type="button"
          onClick={handleLocate}
          aria-label="Me localiser"
          className={cn(
            isMobile
              ? "fixed right-4 h-12 w-12 rounded-full bg-white shadow-xl border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-[1000]"
              : "absolute right-10 bottom-[230px] z-[1200] flex h-10 w-10 items-center justify-center rounded-[14px] border border-black/[0.06] bg-white/95 shadow-lg transition-all hover:scale-105 active:scale-95"
          )}
          style={isMobile ? { bottom: '148px' } : undefined}
        >
          {isLocating ? <Loader2 className="h-5 w-5 text-brand animate-spin" /> : locateError ? <span className="text-red-500 font-black text-sm">X</span> : <Compass className="h-5 w-5 text-brand" />}
        </button>
      )}
      {isViewportReady && !isMobile && isViewingOverseas && (
        <button
          type="button"
          onClick={() => { setMapCenter([46.6, 2.4]); setMapZoom(6); setSelectionSource('external'); }}
          className="absolute bottom-[274px] left-[624px] z-[1200] rounded-[12px] bg-brand px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.07em] text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          ← Retour France métropolitaine
        </button>
      )}
      {isViewportReady && !isMobile && (
        <div className="absolute bottom-[230px] left-[624px] z-[1200] flex gap-2">
          {[
            { label: "La Reunion", center: [-21.1, 55.5] as [number, number], zoom: 10 },
            { label: "Martinique", center: [14.6, -61.0] as [number, number], zoom: 10 },
            { label: "Guadeloupe", center: [16.2, -61.5] as [number, number], zoom: 10 },
          ].map(t => (
            <button key={t.label} type="button"
              onClick={() => { setMapCenter(t.center); setMapZoom(t.zoom); setSelectionSource('external'); }}
              className="min-h-[34px] rounded-[12px] border border-black/[0.07] bg-white/95 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.07em] text-muted-foreground shadow-md transition-all hover:border-brand/40 hover:text-brand hover:shadow-lg active:scale-95"
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

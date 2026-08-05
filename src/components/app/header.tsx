'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User as UserIcon, Menu, MapPin, Store, X, Bike, Wrench, Users, Utensils, Building2, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from './logo';
import { useFirebase } from '@/firebase/client';
const UserMenuLazy = dynamic(() => import('@/components/app/user-menu'), { 
  ssr: false,
  loading: () => <div className="h-[73px] w-[73px] md:h-[83px] md:w-[83px] rounded-full bg-white/50 border-2 border-white shadow-xl" />
});
import { useRouter, usePathname } from 'next/navigation';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { extractValidCoordinates } from '@/lib/geohash';

const brandsList = Object.keys(brandLogos);
let globalDealersCache: any[] | null = null;

function normalizeStr(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').trim();
}

function similarityScore(query: string, target: string): number {
  const q = normalizeStr(query);
  const t = normalizeStr(target);
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70;
  const tokens = q.split(/\s+/);
  const matched = tokens.filter(tok => tok.length > 1 && t.includes(tok));
  if (matched.length === tokens.length) return 60;
  if (matched.length > 0) return 40;
  return 0;
}

interface Suggestion {
  type: 'dept' | 'city' | 'cp' | 'brand' | 'dealer' | 'arrondissement' | 'filter';
  filterValue?: string;
  label: string;
  subLabel?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  bbox?: [number, number, number, number]; // [west, south, east, north]
  id?: string;
  appSection?: string;
  score?: number;
}



const QuickFilters = () => {
  const router = useRouter();
  const filters = [
    { id: 'shopping', label: 'Concess', icon: Bike, color: 'text-brand' },
    { id: 'service', label: 'Atelier', icon: Wrench, color: 'text-brand' },
    { id: 'association', label: 'Asso', icon: Users, color: 'text-indigo-600' },
    { id: 'relais', label: 'Relais', icon: Utensils, color: 'text-amber-600' },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6">
      {filters.map((f) => (
        <button key={f.id} onClick={() => router.push(`/map?filter=${f.id}`)} className="flex flex-col items-center gap-2 group">
          <div className="h-[70px] w-[70px] rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-brand/20">
            <f.icon className={cn("h-8 w-8", f.color)} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tight text-muted-foreground group-hover:text-brand">{f.label}</span>
        </button>
      ))}
    </div>
  );
};

const SuggestionIcon = ({ type }: { type: string }) => {
  if (type === 'dealer') return <Store className="w-4 h-4" />;
  if (type === 'brand') return <Bike className="w-4 h-4" />;
  if (type === 'arrondissement') return <Building2 className="w-4 h-4" />;
  return <MapPin className="w-4 h-4" />;
};

// Génère une bbox approximative autour d'un point selon le type
function generateBbox(lat: number, lng: number, type: string): [number, number, number, number] {
  const delta = type === 'dept' ? 0.5 : type === 'city' ? 0.05 : 0.02;
  return [lng - delta, lat - delta, lng + delta, lat + delta];
}

const Header: React.FC<any> = ({
  searchTerm, onSearchTermChange, onSearch,
  onSuggestionSelect,
  placeholderText = "Recherche par département, ville, marque...",
  searchOnly = false
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { firestore } = useFirebase();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDealers, setAllDealers] = useState<any[]>(globalDealersCache || []);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const geoDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchDealers = async () => {
      if (!firestore || globalDealersCache || !isFocused) return;
      try {
        const collections = ['concessions', 'associations', 'relais', 'creators'];
        const dealers: any[] = [];
        const seenIds = new Set<string>();
        for (const colName of collections) {
          try {
            const snapshot = await getDocs(query(collection(firestore, colName), limit(8000)));
            snapshot.docs.forEach(d => {
              if (seenIds.has(d.id)) return;
              const data = d.data();
              const coords = extractValidCoordinates(data);
              if (!coords) return;
              seenIds.add(d.id);
              const appSect = colName === 'associations' ? 'association' : colName === 'relais' ? 'relais' : colName === 'creators' ? 'creator' : (data.appSection || 'shopping');
              dealers.push({
                type: 'dealer', label: data.title || d.id,
                subLabel: data.address, lat: coords.lat, lng: coords.lng,
                id: d.id, zoom: 15, appSection: appSect,
              });
            });
          } catch (e) {}
        }
        globalDealersCache = dealers;
        setAllDealers(dealers);
      } catch (e) {}
    };
    fetchDealers();
  }, [firestore, isFocused]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false); setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const generateSuggestions = useCallback(async (term: string) => {
    if (term.trim().length < 2) { setSuggestions([]); return; }

    const raw = term.trim();
    const normalized = normalizeStr(raw);
    const results: Suggestion[] = [];
    const seen = new Set<string>();

    const addIfNew = (s: Suggestion) => {
      const key = `${s.type}:${normalizeStr(s.label)}`;
      if (!seen.has(key)) { seen.add(key); results.push(s); }
    };

    // 1. Code postal exact
    if (/^\d{5}$/.test(raw)) {
      const arrMap: Record<string, { city: string; lat: number; lng: number; bbox: [number,number,number,number] }> = {
        '75001': { city: 'Paris 1er', lat: 48.8603, lng: 2.3477, bbox: [2.339,48.855,2.357,48.866] },
        '75002': { city: 'Paris 2e', lat: 48.8670, lng: 2.3490, bbox: [2.341,48.862,2.357,48.872] },
        '75003': { city: 'Paris 3e', lat: 48.8638, lng: 2.3609, bbox: [2.352,48.858,2.370,48.869] },
        '75004': { city: 'Paris 4e', lat: 48.8533, lng: 2.3522, bbox: [2.344,48.847,2.361,48.859] },
        '75005': { city: 'Paris 5e', lat: 48.8462, lng: 2.3508, bbox: [2.341,48.840,2.361,48.852] },
        '75006': { city: 'Paris 6e', lat: 48.8497, lng: 2.3322, bbox: [2.322,48.844,2.343,48.856] },
        '75007': { city: 'Paris 7e', lat: 48.8566, lng: 2.3094, bbox: [2.295,48.850,2.325,48.864] },
        '75008': { city: 'Paris 8e', lat: 48.8745, lng: 2.3079, bbox: [2.296,48.867,2.321,48.882] },
        '75009': { city: 'Paris 9e', lat: 48.8763, lng: 2.3387, bbox: [2.328,48.870,2.349,48.883] },
        '75010': { city: 'Paris 10e', lat: 48.8763, lng: 2.3600, bbox: [2.349,48.868,2.372,48.884] },
        '75011': { city: 'Paris 11e', lat: 48.8590, lng: 2.3789, bbox: [2.364,48.852,2.394,48.866] },
        '75012': { city: 'Paris 12e', lat: 48.8450, lng: 2.3897, bbox: [2.369,48.832,2.412,48.858] },
        '75013': { city: 'Paris 13e', lat: 48.8314, lng: 2.3642, bbox: [2.344,48.817,2.385,48.846] },
        '75014': { city: 'Paris 14e', lat: 48.8298, lng: 2.3254, bbox: [2.311,48.820,2.340,48.840] },
        '75015': { city: 'Paris 15e', lat: 48.8413, lng: 2.2932, bbox: [2.277,48.825,2.311,48.858] },
        '75016': { city: 'Paris 16e', lat: 48.8631, lng: 2.2754, bbox: [2.249,48.845,2.304,48.882] },
        '75017': { city: 'Paris 17e', lat: 48.8876, lng: 2.3150, bbox: [2.296,48.879,2.334,48.896] },
        '75018': { city: 'Paris 18e', lat: 48.8926, lng: 2.3444, bbox: [2.326,48.882,2.367,48.904] },
        '75019': { city: 'Paris 19e', lat: 48.8831, lng: 2.3788, bbox: [2.362,48.873,2.399,48.897] },
        '75020': { city: 'Paris 20e', lat: 48.8655, lng: 2.3976, bbox: [2.382,48.857,2.414,48.875] },
      };
      if (arrMap[raw]) {
        const a = arrMap[raw];
        addIfNew({ type: 'arrondissement', label: a.city, subLabel: `Code postal ${raw}`, lat: a.lat, lng: a.lng, zoom: 14, bbox: a.bbox });
      }
      const deptCode = raw.startsWith('97') ? raw.substring(0, 3) : raw.substring(0, 2).padStart(2, '0');
      const loc = Object.entries(locationsData).find(([k]) => k.startsWith(deptCode));
      if (loc) {
        addIfNew({ type: 'cp', label: raw, subLabel: `Code postal — ${loc[0].split(' - ')[1] || ''}`, lat: (loc[1] as any).center[0], lng: (loc[1] as any).center[1], zoom: 13, bbox: generateBbox((loc[1] as any).center[0], (loc[1] as any).center[1], 'city') });
      }
    }

    // 2. Code département
    const isDeptCode = /^(0[1-9]|[1-8]\d|9[0-5]|2[aAbB]|97[1-6])$/.test(raw);
    if (isDeptCode) {
      const deptKey = raw.toUpperCase().padStart(2, '0');
      Object.entries(locationsData).forEach(([dept, info]) => {
        const code = dept.split(' - ')[0];
        if (code.toUpperCase() === deptKey || code.toUpperCase() === raw.toUpperCase()) {
          addIfNew({ type: 'dept', label: dept.split(' - ')[1], subLabel: `Département ${code}`, lat: (info as any).center[0], lng: (info as any).center[1], zoom: 9, score: 100 });
        }
      });
    }

    // 3. Marques
    brandsList.forEach(brand => {
      const score = similarityScore(normalized, brand);
      if (score >= 40) addIfNew({ type: 'brand', label: brand, subLabel: 'Marque Moto', score });
    });

    // 4. Départements et villes locales
    Object.entries(locationsData).forEach(([dept, info]) => {
      const deptName = dept.split(' - ')[1] || dept;
      const deptCode = dept.split(' - ')[0];
      const score = similarityScore(normalized, deptName);
      if (score >= 50) {
        addIfNew({ type: 'dept', label: deptName, subLabel: `Département ${deptCode}`, lat: (info as any).center[0], lng: (info as any).center[1], zoom: 9, score });
      }
      (info as any).cities?.forEach((city: string) => {
        const cityScore = similarityScore(normalized, city);
        if (cityScore >= 50) {
          addIfNew({ type: 'city', label: city, subLabel: deptName, lat: (info as any).center[0], lng: (info as any).center[1], zoom: 12, score: cityScore, bbox: generateBbox((info as any).center[0], (info as any).center[1], 'city') });
        }
      });
    });

    // 5. Établissements
    allDealers.forEach(d => {
      const score = similarityScore(normalized, d.label);
      if (score >= 50) addIfNew({ ...d, score });
    });

    results.sort((a, b) => (b.score || 0) - (a.score || 0));
    setSuggestions(results.slice(0, 10));

    // 6. API géocodage pour villes manquantes
    const cityResults = results.filter(r => r.type === 'city' || r.type === 'dept');
    if (cityResults.length < 3 && normalized.length >= 3 && !/^\d+$/.test(raw)) {
      if (geoDebounceRef.current) clearTimeout(geoDebounceRef.current);
      geoDebounceRef.current = setTimeout(async () => {
        try {
          setIsLoadingGeo(true);
          const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(raw)}&type=municipality&limit=5&autocomplete=1`);
          if (!res.ok) return;
          const data = await res.json();
          const geoResults: Suggestion[] = [];
          data.features?.forEach((f: any) => {
            const city = f.properties.city || f.properties.label;
            const deptName = f.properties.context?.split(',')[1]?.trim() || '';
            const [lng, lat] = f.geometry.coordinates;
            // Construire une bbox approximative autour du point
            const delta = 0.04;
            const bbox: [number, number, number, number] = [lng - delta, lat - delta, lng + delta, lat + delta];
            const key = `city:${normalizeStr(city)}`;
            if (!seen.has(key)) {
              seen.add(key);
              geoResults.push({ type: 'city', label: city, subLabel: deptName, lat, lng, zoom: 13, bbox, score: 80 });
            }
          });
          if (geoResults.length > 0) {
            setSuggestions(prev => {
              const combined = [...geoResults, ...prev];
              const dedup = combined.filter((s, i, arr) =>
                arr.findIndex(x => normalizeStr(x.label) === normalizeStr(s.label)) === i
              );
              return dedup.slice(0, 10);
            });
          }
        } catch (e) {
        } finally {
          setIsLoadingGeo(false);
        }
      }, 300);
    }
  }, [allDealers]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => generateSuggestions(searchTerm), 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchTerm, generateSuggestions]);

  const handleSuggestionClick = (s: Suggestion) => {
    const isGeo = s.type === "city" || s.type === "dept" || s.type === "cp" || s.type === "arrondissement";
    if (isGeo) {
      onSearchTermChange("");
    } else {
      onSearchTermChange(s.label);
    }
    setShowSuggestions(false);
    setSelectedIndex(-1);

    if (window.location.pathname !== '/map') {
      const queryParams = new URLSearchParams();
      if (s.lat && s.lng) { queryParams.set('lat', s.lat.toString()); queryParams.set('lng', s.lng.toString()); }
      if (s.zoom) queryParams.set('zoom', s.zoom.toString());
      if (s.id) queryParams.set('selectedId', s.id);
      if (s.appSection && s.appSection !== 'both') queryParams.set('filter', s.appSection);
      queryParams.set('search', s.label);
      router.push(`/map?${queryParams.toString()}`);
    } else {
      // Sur la page /map — déclencher fitBounds via onSuggestionSelect
      if (onSuggestionSelect && s.lat && s.lng) {
        setTimeout(() => onSuggestionSelect(s.lat!, s.lng!, s.bbox, s.id, s.appSection), 10);
      } else {
        setTimeout(() => onSearch(), 10);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') { onSearch(); setShowSuggestions(false); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(prev => Math.max(prev - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) handleSuggestionClick(suggestions[selectedIndex]);
      else { onSearch(); setShowSuggestions(false); }
    }
    else if (e.key === 'Escape') { setShowSuggestions(false); setSelectedIndex(-1); }
  };

  const clearSearch = () => {
    onSearchTermChange(''); setSuggestions([]); setShowSuggestions(false); setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const searchInput = (
    <div className="w-full relative" ref={suggestionsRef}>
      <div className="relative group">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholderText}
          className="pr-20 md:pr-24 rounded-full shadow-2xl bg-white/95 focus:bg-white border-none px-6 md:px-10 h-12 md:h-14 font-bold text-sm md:text-base transition-all"
          value={searchTerm}
          onChange={(e) => { onSearchTermChange(e.target.value); setShowSuggestions(true); setSelectedIndex(-1); }}
          onFocus={() => { setShowSuggestions(true); setIsFocused(true); }}
          onKeyDown={handleKeyDown}
          autoComplete="off" autoCorrect="off" spellCheck={false}
        />
        {searchTerm && (
          <button onClick={clearSearch} className="absolute right-20 md:right-24 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-brand transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          className="absolute top-1/2 right-1 -translate-y-1/2 bg-brand rounded-full h-[70px] w-[70px] shadow-lg hover:scale-105 active:scale-95 transition-all ring-4 ring-white"
          onClick={() => { onSearch(); setShowSuggestions(false); }}
        >
          <Search className="h-8 w-8" />
        </Button>
      </div>

      {showSuggestions && (suggestions.length > 0 || isLoadingGeo) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl z-[1600] max-h-[60vh] overflow-y-auto py-3 border-2 border-white">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              className={cn("w-full flex items-center gap-4 px-6 py-4 text-left group transition-colors", idx === selectedIndex ? "bg-brand/10" : "hover:bg-muted")}
              onClick={() => handleSuggestionClick(s)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className={cn("shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors", idx === selectedIndex ? "bg-brand text-white" : "bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white")}>
                <SuggestionIcon type={s.type} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-foreground truncate uppercase">{s.label}</span>
                {s.subLabel && <span className="text-[9px] text-muted-foreground truncate uppercase font-bold">{s.subLabel}</span>}
              </div>
              {s.type === 'brand' && <span className="ml-auto text-[8px] font-black uppercase text-brand/50 shrink-0">Marque</span>}
            </button>
          ))}
          {isLoadingGeo && (
            <div className="px-6 py-3 flex items-center gap-3 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
              <span className="text-[10px] font-bold uppercase">Recherche en cours...</span>
            </div>
          )}
          {searchTerm.trim().length >= 2 && (
            <div className="px-4 pt-2 pb-1 border-t border-border/50 mt-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-2">Filtrer par type</p>
              <div className="flex flex-wrap gap-2 px-2 pb-1">
                {[
                  { label: "Tous", filter: "", icon: "📍" },
                  { label: "Garage & Atelier", filter: "service", icon: "🔧" },
                  { label: "Concession", filter: "shopping", icon: "🏍️" },
                  { label: "Relais motards", filter: "relais", icon: "⛽" },
                ].map(f => (
                  <button
                    key={f.filter}
                    onClick={() => {
                      setShowSuggestions(false);
                      const params = new URLSearchParams();
                      if (searchTerm.trim()) params.set('search', searchTerm.trim());
                      if (f.filter) params.set('filter', f.filter);
                      router.push("/map?" + params.toString());
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-border hover:border-brand hover:text-brand hover:bg-brand/5 text-xs font-black uppercase tracking-widest text-foreground transition-all bg-white min-h-[44px]"
                  >
                    <span>{f.icon}</span>{f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (searchOnly) return searchInput;

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8 pt-4 pb-6 bg-brand">
      <div className="flex items-center justify-between gap-4 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="shrink-0"><LabelMotoLogo className="h-auto w-[164px] sm:w-[200px] md:w-[255px]" /></div>
        <div className="flex-1 flex justify-center px-4">
          <div className="hidden md:block bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border-2 border-white px-6 py-2.5 md:px-8 md:py-4 text-center max-w-[200px] md:max-w-sm">
            <p className="text-[7px] md:text-[11px] font-black uppercase tracking-widest text-foreground leading-tight">TROUVER UNE CONCESSION ?</p>
            <p className="text-[9px] md:text-sm font-black italic text-brand leading-none">FINI LA GALÈRE.</p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <a
            href="https://www.instagram.com/labelmoto.fr/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram LabelMoto"
            className="hidden sm:flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/95 shadow-xl border-2 border-white text-brand hover:scale-105 active:scale-95 transition-all"
          >
            <Instagram className="h-5 w-5 md:h-6 md:w-6" />
          </a>
          <UserMenuLazy />
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto relative flex items-center gap-8 px-4 md:px-0">
        {pathname !== "/" && <div className="flex-1">{searchInput}</div>}

      </div>

    </div>
  );
};

export default Header;
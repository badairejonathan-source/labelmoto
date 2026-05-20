
'use client';

import React, { useState, useEffect, useRef, useDeferredValue } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, User as UserIcon, Home, Bike, Wrench, Menu, MapPin, Store, X, Utensils, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from './logo';
import { cn, levenshteinDistance } from '@/lib/utils';
import { useUser, useAuth, useFirestore, useMemoFirebase, useDoc, useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';
import { collection, query, getDocs, limit, doc } from 'firebase/firestore';
import useWindowSize from '@/hooks/use-window-size';

const brandsList = Object.keys(brandLogos);
let globalDealersCache: Suggestion[] | null = null;

// Coordonnées précises pour les arrondissements de Paris, Marseille et Lyon
const ArrondissementCoords: Record<string, [number, number]> = {
  // Paris
  "75001": [48.8625, 2.3364], "75002": [48.8669, 2.3426], "75003": [48.8637, 2.3595], "75004": [48.8543, 2.3576],
  "75005": [48.8448, 2.3471], "75006": [48.8493, 2.3300], "75007": [48.8561, 2.3126], "75008": [48.8727, 2.3126],
  "75009": [48.8771, 2.3374], "75010": [48.8761, 2.3607], "75011": [48.8596, 2.3762], "75012": [48.8408, 2.4047],
  "75013": [48.8322, 2.3550], "75014": [48.8331, 2.3237], "75015": [48.8412, 2.2985], "75016": [48.8603, 2.2619],
  "75017": [48.8835, 2.3067], "75018": [48.8913, 2.3444], "75019": [48.8817, 2.3822], "75020": [48.8646, 2.3983],
  // Marseille
  "13001": [43.2995, 5.3814], "13002": [43.3039, 5.3672], "13003": [43.3102, 5.3831], "13004": [43.3045, 5.4019],
  "13005": [43.2941, 5.4001], "13006": [43.2863, 5.3821], "13007": [43.2847, 5.3582], "13008": [43.2591, 5.3812],
  "13009": [43.2391, 5.4221], "13010": [43.2771, 5.4111], "13011": [43.2891, 5.4671], "13012": [43.3011, 5.4321],
  "13013": [43.3321, 5.4211], "13014": [43.3441, 5.3851], "13015": [43.3711, 5.3551], "13016": [43.3591, 5.3211],
  // Lyon
  "69001": [45.7686, 4.8323], "69002": [45.7533, 4.8291], "69003": [45.7591, 4.8532], "69004": [45.7771, 4.8271],
  "69005": [45.7581, 4.8111], "69006": [45.7721, 4.8491], "69007": [45.7391, 4.8411], "69008": [45.7341, 4.8691],
  "69009": [45.7821, 4.8021]
};

interface Suggestion {
    type: 'city' | 'dept' | 'dealer' | 'brand-only';
    label: string;
    subLabel?: string;
    lat?: number;
    lng?: number;
    zoom?: number;
    id?: string;
    brand?: string;
    score?: number;
}

interface HeaderProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    onSearch: () => void;
    className?: string;
    activeFilters?: string[];
    onFilterToggle?: (filter: string | null) => void;
    placeholderText?: string;
    variant?: 'default' | 'map';
    hideUserMenu?: boolean;
}

export const UserMenu = () => {
  const { user, isUserLoading, activateAuth } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const pathname = usePathname();
  const { width } = useWindowSize();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMapPage = pathname === '/map';
  const isMobile = mounted && width !== undefined && width < 1024;
  const showGuides = isMobile || isMapPage;

  const stdRef = useMemoFirebase(() => user ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdRef);
  const proRef = useMemoFirebase(() => user ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proRef);

  const activeProfile = proProfile || stdProfile;
  const pseudo = activeProfile?.pseudo || activeProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || '';
  const initial = pseudo?.[0]?.toUpperCase() || '?';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const handleOpenMenu = () => {
    activateAuth();
  };

  if (!mounted) return null;

  const trigger = (
    <Button 
      variant="ghost" 
      aria-label="Menu utilisateur"
      onClick={handleOpenMenu}
      className="relative h-[56px] w-[56px] md:h-[62px] md:w-[62px] rounded-full p-0 flex items-center justify-center focus-visible:ring-0 shadow-xl border-2 border-white bg-white hover:border-brand/20 transition-all hover:scale-105 active:scale-95 z-[150]"
    >
      <div className="relative h-full w-full flex items-center justify-center pointer-events-none">
        {user ? (
          <Avatar className="h-[44px] w-[44px] md:h-[50px] md:w-[50px] border-2 border-brand" aria-hidden="true">
            <AvatarImage src={user.photoURL || undefined} alt="" />
            <AvatarFallback className="bg-brand text-brand-foreground text-xs font-black">
              {initial}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-[44px] w-[44px] md:h-[50px] md:w-[50px] rounded-full flex items-center justify-center p-1" aria-hidden="true">
            {isUserLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-brand" />
            ) : (
              <Image 
                src="/images/icon-moncompte.webp" 
                alt="" 
                width={80} 
                height={80} 
                className="h-full w-full object-contain" 
                decoding="async"
              />
            )}
          </div>
        )}
        
        <div className="absolute -bottom-0.5 -right-0.5 md:bottom-0.5 md:right-0.5 bg-brand text-white rounded-full p-0.5 md:p-1 border-2 border-white shadow-md z-20">
          <Menu className="h-2 w-2 md:h-3 w-3" />
        </div>
      </div>
      <span className="sr-only">Menu utilisateur</span>
    </Button>
  );

  return (
    <DropdownMenu onOpenChange={(open) => open && handleOpenMenu()}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 z-[3000] p-4 rounded-[2rem] border-2 shadow-2xl" align="end" forceMount>
        {showGuides && (
          <>
            <div className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground text-center mb-4 pt-2">G U I D E</p>
                <div className="border-2 border-dashed border-gray-100 rounded-[2rem] p-6 flex justify-around items-center bg-gray-50/50">
                    <Link href="/entretien" className="flex flex-col items-center gap-3 group" aria-label="Consulter le guide entretien">
                        <div className="h-14 w-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-transparent group-hover:bg-brand group-hover:border-white transition-all transform group-active:scale-95">
                            <Image 
                                src="/images/icon-entretienrevision.webp" 
                                alt="" 
                                width={44} 
                                height={44} 
                                className="h-11 w-11 object-contain group-hover:brightness-0 group-hover:invert" 
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-brand">Entretien</span>
                    </Link>
                    <Link href="/info" className="flex flex-col items-center gap-3 group" aria-label="Consulter les conseils">
                        <div className="h-14 w-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-transparent group-hover:bg-brand group-hover:border-white transition-all transform group-active:scale-95">
                            <Image 
                                src="/images/icon-conseils.webp" 
                                alt="" 
                                width={44} 
                                height={44} 
                                className="h-11 w-11 object-contain group-hover:brightness-0 group-hover:invert" 
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-brand">Conseils</span>
                    </Link>
                </div>
            </div>
            <DropdownMenuSeparator className="mb-4 bg-muted/50" />
          </>
        )}

        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-black px-2 mb-2">Utilisateur</DropdownMenuLabel>
        {user ? (
          <>
            <div className="px-2 py-1.5 mb-2">
                <p className="text-base font-black text-brand leading-none truncate mb-1">{pseudo}</p>
                <p className="text-[10px] font-bold text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-muted/50" />
            <DropdownMenuItem asChild className="cursor-pointer text-brand focus:text-brand font-bold py-3">
              <Link href="/account">
                <UserIcon className="mr-3 h-5 w-5" />
                <span className="text-sm uppercase font-black tracking-widest">Mon Profil / Compte</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-muted/50" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:text-destructive py-3">
              <span className="text-sm uppercase font-black tracking-widest pl-8">Déconnexion</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild className="cursor-pointer font-bold text-brand py-3">
            <Link href="/login" className="flex items-center">
              <UserIcon className="mr-3 h-5 w-5" />
              <span className="text-sm uppercase font-black tracking-widest">Connexion / Inscription</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC<HeaderProps> = ({ 
    searchTerm, 
    onSearchTermChange, 
    onSearch, 
    className, 
    activeFilters = [], 
    onFilterToggle, 
    placeholderText = "Recherche par departement, ville, marque, nom...",
    variant = 'default',
    hideUserMenu = false
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { firestore } = useFirebase();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDealers, setAllDealers] = useState<Suggestion[]>(globalDealersCache || []);
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDealers = async () => {
        if (!firestore || globalDealersCache || !isFocused) return;
        setIsDataLoading(true);
        const concessionsRef = collection(firestore, 'concessions');
        try {
            const q = query(concessionsRef, limit(3000));
            const snapshot = await getDocs(q);
            const dealers: Suggestion[] = snapshot.docs.map(doc => {
                const data = doc.data();
                const title = data.title || data.name || data.displayName || data.label || doc.id.replace(/-/g, ' ').toUpperCase();
                return {
                    type: 'dealer',
                    label: title,
                    subLabel: data.address || '',
                    lat: data.latitude || (data.location?.lat),
                    lng: data.longitude || (data.location?.lng),
                    zoom: 14,
                    id: doc.id
                };
            });
            globalDealersCache = dealers;
            setAllDealers(dealers);
        } catch (e: any) {} finally {
            setIsDataLoading(false);
        }
    };
    if (mounted && isFocused) fetchDealers();
  }, [firestore, mounted, isFocused]);

  useEffect(() => {
    if (deferredSearchTerm.trim().length < 1) {
        setSuggestions([]);
        return;
    }

    let lowerTerm = deferredSearchTerm.toLowerCase().trim();
    const results: Suggestion[] = [];
    
    // Reconnaissance des arrondissements lors de la saisie
    if (/^\d{5}$/.test(lowerTerm)) {
        const coords = ArrondissementCoords[lowerTerm];
        if (coords) {
            results.push({
                type: 'city',
                label: `Code Postal ${lowerTerm}`,
                subLabel: lowerTerm.startsWith('75') ? 'Paris' : (lowerTerm.startsWith('13') ? 'Marseille' : 'Lyon'),
                lat: coords[0],
                lng: coords[1],
                zoom: 14,
                score: 2000
            });
        }
    }

    Object.entries(locationsData).forEach(([dept, info]) => {
        if (dept.toLowerCase().includes(lowerTerm)) {
            results.push({ type: 'dept', label: dept, lat: info.center[0], lng: info.center[1], zoom: 9, score: 900 });
        }
        info.cities.forEach(city => {
            if (city.toLowerCase().includes(lowerTerm)) {
                results.push({ type: 'city', label: city, subLabel: dept.split(' - ')[0], lat: info.center[0], lng: info.center[1], zoom: 12, score: 650 });
            }
        });
    });

    brandsList.forEach(brand => {
        if (brand.toLowerCase().includes(lowerTerm)) {
            results.push({ type: 'brand-only', label: brand, subLabel: "Voir les concessionnaires", brand: brand, score: 1100 });
        }
    });

    allDealers.forEach(d => {
        if (d.label.toLowerCase().includes(lowerTerm)) {
            results.push({ ...d, score: 800 });
        }
    });

    const finalSuggestions = results
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .filter((v, i, a) => a.findIndex(t => t.label === v.label && t.type === v.type) === i);
    
    setSuggestions(finalSuggestions.slice(0, 15));
  }, [deferredSearchTerm, allDealers]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSearchTermChange(suggestion.label);
    setShowSuggestions(false);
    setIsFocused(false);
    
    const queryParams = new URLSearchParams();
    if (suggestion.lat && suggestion.lng) {
        queryParams.set('lat', suggestion.lat.toString());
        queryParams.set('lng', suggestion.lng.toString());
        if (suggestion.zoom) queryParams.set('zoom', suggestion.zoom.toString());
    }
    if (suggestion.id) queryParams.set('selectedId', suggestion.id);
    queryParams.set('search', suggestion.label);
    if (activeFilters.length > 0) queryParams.set('filters', activeFilters.join(','));
    router.push(`/map?${queryParams.toString()}`);
  };

  const handleSearchInternal = () => {
    const term = searchTerm.trim();
    if (term === '') {
        onSearch();
        return;
    }

    const lower = term.toLowerCase();
    
    // Logique "Enter" sans suggestion : Détection de pattern
    // 1. Département (2 chiffres)
    if (/^\d{2}$/.test(lower)) {
        const deptEntry = Object.entries(locationsData).find(([k]) => k.startsWith(lower));
        if (deptEntry) {
            handleSuggestionClick({
                type: 'dept',
                label: deptEntry[0],
                lat: deptEntry[1].center[0],
                lng: deptEntry[1].center[1],
                zoom: 9
            });
            return;
        }
    }

    // 2. Arrondissement Zip (750xx, 130xx, 690xx)
    if (/^(750|130|690)\d{2}$/.test(lower)) {
        const coords = ArrondissementCoords[lower];
        if (coords) {
            handleSuggestionClick({
                type: 'city',
                label: lower,
                lat: coords[0],
                lng: coords[1],
                zoom: 13
            });
            return;
        }
    }

  // 3. Ville dans la base
    for (const [dept, info] of Object.entries(locationsData)) {
        const city = info.cities.find(c => c.toLowerCase() === lower);
        if (city) {
            handleSuggestionClick({
                type: 'city',
                label: city,
                lat: info.center[0],
                lng: info.center[1],
                zoom: 12
            });
            return;
        }
    }

    onSearch();
    setShowSuggestions(false);
  };

  const handleTabClick = (filter: string | null) => {
    if (onFilterToggle) onFilterToggle(filter);
    else router.push(`/map${filter ? `?filter=${filter}` : ''}`);
  };

  const handleClearSearch = () => {
    onSearchTermChange('');
    setShowSuggestions(false);
    setTimeout(() => {
        onSearch(); // Reset view
    }, 10);
  };

  if (variant === 'map') {
    return (
      <div className="relative w-full" ref={suggestionsRef}>
        <div className="relative group">
            <Input 
                type="text" 
                placeholder={placeholderText} 
                className="pr-16 md:pr-24 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.1)] bg-white/95 focus:bg-white border-none px-6 md:px-8 h-12 md:h-14 font-black text-sm md:text-base transition-all"
                value={searchTerm} 
                onChange={(e) => { onSearchTermChange(e.target.value); setShowSuggestions(true); }} 
                onFocus={() => { setShowSuggestions(true); setIsFocused(true); }} 
                onKeyDown={(e) => e.key === 'Enter' && handleSearchInternal()} 
                autoComplete="off" 
            />
            {searchTerm && (
                <button 
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-14 md:right-20 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-brand transition-colors z-[30]"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
            <Button 
                type="button" 
                size="icon" 
                className="absolute top-1/2 -right-1 -translate-y-1/2 bg-brand rounded-full h-[54px] w-[54px] md:h-[62px] md:w-[62px] shadow-lg hover:scale-105 active:scale-95 transition-all z-[20]" 
                onClick={handleSearchInternal}
            >
                <Search className="h-6 w-6 md:h-7 md:w-7" />
            </Button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-background border rounded-[2rem] shadow-2xl z-[1600] max-h-[50vh] overflow-y-auto py-3">
            {suggestions.map((s, idx) => (
                <button key={idx} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted text-left group" onClick={() => handleSuggestionClick(s)}>
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                    {s.type === 'dealer' || s.type === 'brand-only' ? <Store className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-foreground truncate uppercase">{s.label}</span>
                    {s.subLabel && <span className="text-[10px] text-muted-foreground truncate uppercase font-black">{s.subLabel}</span>}
                </div>
                </button>
            ))}
            </div>
        )}
      </div>
    );
  }

  return (
    <header className={cn("bg-transparent py-4 px-4 border-none relative pb-4 md:pb-0", className)}>
      <div className="container mx-auto max-w-screen-2xl flex flex-col gap-6 md:gap-4">
        <div className="flex flex-row items-center justify-between gap-2 w-full">
            <div className="shrink-0 relative z-[150]"><LabelMotoLogo className="w-[170px] sm:w-52 md:w-[360px] py-1" /></div>
            <div className="flex flex-1 justify-center px-1 relative z-10 min-w-0">
                <div className="bg-white px-2 py-1.5 md:px-8 md:py-4 rounded-full shadow-lg border border-gray-100 text-center w-full max-w-xs flex flex-col justify-center items-center">
                    <p className="text-[8px] sm:text-xs font-black uppercase tracking-wider text-foreground leading-tight">TROUVER UNE CONCESSION ?</p>
                    <p className="text-[10px] sm:text-lg font-black italic text-brand leading-none">FINI LA GALÈRE.</p>
                </div>
            </div>
            <div className="shrink-0 relative z-[150]">{!hideUserMenu && <UserMenu />}</div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-screen-xl mx-auto relative z-20">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                <div className="w-full max-w-2xl">
                    <div className="relative" ref={suggestionsRef}>
                        <Input 
                            type="text" 
                            placeholder={placeholderText} 
                            className="pr-24 md:pr-[160px] rounded-full shadow-2xl bg-white/95 focus:bg-white border-2 border-transparent focus:border-brand/30 px-6 md:px-8 h-12 md:h-14 font-black transition-all"
                            value={searchTerm} 
                            onChange={(e) => { onSearchTermChange(e.target.value); setShowSuggestions(true); }} 
                            onFocus={() => { setShowSuggestions(true); setIsFocused(true); }} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchInternal()} 
                            autoComplete="off" 
                        />
                        {searchTerm && (
                            <button 
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-14 md:right-[110px] top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-brand transition-colors z-[30]"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        )}
                        <Button 
                            type="button" 
                            size="icon" 
                            className="absolute top-1/2 -right-0.5 md:right.5 -translate-y-1/2 bg-brand rounded-full h-[54px] w-[54px] md:h-[70px] md:w-[70px] shadow-lg z-[20]" 
                            onClick={handleSearchInternal}
                        >
                            <Search className="h-7 w-7" />
                        </Button>
                        
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-background border rounded-[2rem] shadow-2xl z-[1600] max-h-[50vh] overflow-y-auto py-3">
                            {suggestions.map((s, idx) => (
                                <button key={idx} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted text-left group" onClick={() => handleSuggestionClick(s)}>
                                <div className="shrink-0 w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                    {s.type === 'dealer' || s.type === 'brand-only' ? <Store className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-black text-foreground truncate uppercase">{s.label}</span>
                                    {s.subLabel && <span className="text-[10px] text-muted-foreground truncate uppercase font-black">{s.subLabel}</span>}
                                </div>
                                </button>
                            ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="hidden md:flex relative border-2 border-dashed border-gray-200 rounded-[2.5rem] p-4 gap-6 items-center bg-white/40 backdrop-blur-md shadow-inner md:ml-36">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Guide</span>
                    {[{ href: '/entretien', img: '/images/icon-entretienrevision.webp', label: 'Entretien' }, { href: '/info', img: '/images/icon-conseils.webp', label: 'Conseils' }].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                            <Button asChild variant="ghost" size="icon" className="h-[62px] w-[62px] rounded-full bg-white shadow-xl border-2 border-white hover:bg-brand hover:border-white transition-all hover:scale-110 group p-0 flex items-center justify-center">
                                <Link href={item.href} className="flex items-center justify-center h-full w-full">
                                    <Image src={item.img} alt="" width={44} height={44} className="h-11 w-11 object-contain group-hover:brightness-0 group-hover:invert" />
                                </Link>
                            </Button>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-8 relative z-50 -mb-16 md:-mb-10">
                <div className="flex items-center gap-3 md:gap-4 bg-white/50 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/50">
                    <Button variant="ghost" onClick={() => handleTabClick('shopping')} className={cn("h-[64px] w-[64px] md:h-[72px] md:w-[72px] p-0 rounded-full flex flex-col items-center justify-center transition-all group border-4", activeFilters.includes('shopping') ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/30")}>
                        <Bike className={cn("h-6 w-6 transition-colors", activeFilters.includes('shopping') ? "text-white" : "text-brand")} />
                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none mt-1">Concess</span>
                    </Button>
                    <Button variant="ghost" onClick={() => handleTabClick('service')} className={cn("h-[64px] w-[64px] md:h-[72px] md:w-[72px] p-0 rounded-full flex flex-col items-center justify-center transition-all group border-4", activeFilters.includes('service') ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" : "bg-white text-muted-foreground border-transparent hover:border-brand/30")}>
                        <Wrench className={cn("h-6 w-6 transition-colors", activeFilters.includes('service') ? "text-white" : "text-brand")} />
                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none mt-1">Atelier</span>
                    </Button>
                </div>
                <div className="hidden md:block w-px h-12 bg-border/50" />
                <div className="flex items-center gap-3 md:gap-4 bg-white/50 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/50">
                    <Button variant="ghost" onClick={() => handleTabClick('association')} className={cn("h-[64px] w-[64px] md:h-[72px] md:w-[72px] p-0 rounded-full flex flex-col items-center justify-center transition-all group border-4", activeFilters.includes('association') ? "bg-indigo-600 text-white border-white scale-110 z-10 shadow-indigo-600/40" : "bg-white text-muted-foreground border-transparent hover:border-indigo-600/30")}>
                        <Users className={cn("h-6 w-6 transition-colors", activeFilters.includes('association') ? "text-white" : "text-indigo-600")} />
                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none mt-1">Asso</span>
                    </Button>
                    <Button variant="ghost" onClick={() => handleTabClick('relais')} className={cn("h-[64px] w-[64px] md:h-[72px] md:w-[72px] p-0 rounded-full flex flex-col items-center justify-center transition-all group border-4", activeFilters.includes('relais') ? "bg-amber-600 text-white border-white scale-110 z-10 shadow-amber-600/40" : "bg-white text-muted-foreground border-transparent hover:border-amber-600/30")}>
                        <Utensils className={cn("h-6 w-6 transition-colors", activeFilters.includes('relais') ? "text-white" : "text-amber-600")} />
                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none mt-1">Relais</span>
                    </Button>
                </div>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

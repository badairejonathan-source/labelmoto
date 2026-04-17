'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, User as UserIcon, Home, Bike, Wrench, Menu, MapPin, Store, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from './logo';
import { cn, levenshteinDistance } from '@/lib/utils';
import { useUser, useAuth, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
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

const brandsList = Object.keys(brandLogos);

interface HeaderProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    onSearch: () => void;
    className?: string;
    activeFilter?: 'shopping' | 'service' | null;
    onFilterChange?: (filter: 'shopping' | 'service' | null) => void;
    placeholderText?: string;
}

interface Suggestion {
    type: 'city' | 'dept' | 'dealer' | 'brand-location' | 'brand-only';
    label: string;
    subLabel?: string;
    lat?: number;
    lng?: number;
    zoom?: number;
    id?: string;
    brand?: string;
    score?: number;
}

const UserMenu = () => {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || isUserLoading) {
    return (
      <div className="h-16 w-16 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  const trigger = (
    <Button 
      variant="ghost" 
      aria-label="Menu utilisateur"
      className="relative h-16 w-16 md:h-20 md:w-20 rounded-full p-0 flex items-center justify-center focus-visible:ring-0 shadow-xl border-2 border-white bg-white hover:border-brand/20 transition-all hover:scale-105 active:scale-95"
    >
      <div className="relative">
        {user ? (
          <Avatar className="h-13 w-13 md:h-16 md:w-16 border-2 border-brand" aria-hidden="true">
            <AvatarImage src={user.photoURL || undefined} alt="" />
            <AvatarFallback className="bg-brand text-brand-foreground text-sm font-black">
              {initial}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-13 w-13 md:h-16 md:w-16 rounded-full flex items-center justify-center p-1" aria-hidden="true">
            <Image src="/images/icon-moncompte.webp" alt="" width={64} height={64} className="h-full w-full object-contain" />
          </div>
        )}
        
        <div className="absolute -bottom-1 -right-1 bg-brand text-white rounded-full p-1.5 border-2 border-white shadow-md z-20">
          <Menu className="h-3.5 w-3.5 md:h-4.5 md:w-4.5" />
        </div>
      </div>
      <span className="sr-only">Menu utilisateur</span>
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 z-[3000]" align="end" forceMount>
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Utilisateur</DropdownMenuLabel>
        {user ? (
          <>
            <div className="px-2 py-1.5">
                <p className="text-sm font-black text-brand leading-none truncate mb-1">{pseudo}</p>
                <p className="text-[10px] font-bold text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer text-brand focus:text-brand font-bold py-2">
              <Link href="/account">
                <UserIcon className="mr-2 h-4 w-4" />
                <span className="text-sm">Gérer mon compte</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:text-destructive py-2">
              <span className="text-sm">Déconnexion</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild className="cursor-pointer font-bold text-brand py-2">
            <Link href="/login">
              <UserIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">Connexion / Inscription</span>
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
    activeFilter = null, 
    onFilterChange, 
    placeholderText = "Recherche par departement, ville, marque, nom..." 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [prediction, setPrediction] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDealers, setAllDealers] = useState<Suggestion[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const isMapPage = pathname === '/map';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDealers = async () => {
        if (!firestore) return;
        try {
            const q = query(collection(firestore, 'concessions'), limit(3000));
            const snapshot = await getDocs(q);
            const dealers: Suggestion[] = snapshot.docs.map(doc => ({
                type: 'dealer',
                label: doc.data().title || '',
                subLabel: doc.data().address || '',
                lat: doc.data().latitude ? parseFloat(String(doc.data().latitude).replace(',', '.')) : undefined,
                lng: doc.data().longitude ? parseFloat(String(doc.data().longitude).replace(',', '.')) : undefined,
                zoom: 14,
                id: doc.id,
                brand: Array.isArray(doc.data().brands) ? doc.data().brands[0] : undefined
            }));
            setAllDealers(dealers);
        } catch (e) {
            console.error("Erreur suggestions dealers:", e);
        }
    };
    if (mounted) fetchDealers();
  }, [firestore, mounted]);

  useEffect(() => {
    if (searchTerm.trim().length < 1) {
        setSuggestions([]);
        setPrediction('');
        return;
    }

    const lowerTerm = searchTerm.toLowerCase().trim();
    const normalizedTerm = lowerTerm.replace(/[\s-]/g, '');
    const results: Suggestion[] = [];

    const matchingCities: { name: string; dept: string; lat: number; lng: number }[] = [];
    Object.entries(locationsData).forEach(([dept, info]) => {
        const normalizedDept = dept.toLowerCase().replace(/[\s-]/g, '');
        if (normalizedDept.includes(normalizedTerm)) {
            results.push({ type: 'dept', label: dept, lat: info.center[0], lng: info.center[1], zoom: 9, score: 700 });
        }
        info.cities.forEach(city => {
            const normalizedCity = city.toLowerCase().replace(/[\s-]/g, '');
            if (normalizedCity.includes(normalizedTerm)) {
                matchingCities.push({ name: city, dept: dept.split(' - ')[0], lat: info.center[0], lng: info.center[1] });
                results.push({ type: 'city', label: city, subLabel: dept.split(' - ')[0], lat: info.center[0], lng: info.center[1], zoom: 12, score: 650 });
            }
        });
    });

    allDealers.forEach(d => {
        const title = d.label.toLowerCase();
        const address = d.subLabel?.toLowerCase() || '';
        const normalizedTitle = title.replace(/[\s-]/g, '');
        let score = 0;
        const isNumeric = /^\d{5}$/.test(lowerTerm);
        if (isNumeric && lowerTerm.length >= 2) {
            const zipMatch = address.match(/\b\d{5}\b/);
            if (zipMatch && zipMatch[0].startsWith(lowerTerm)) score = 1300;
        }
        if (normalizedTitle === normalizedTerm) score = Math.max(score, 1200);
        const belongsToMatchingCity = matchingCities.some(city => address.includes(city.name.toLowerCase()));
        if (belongsToMatchingCity) score = Math.max(score, 1150);
        if (address.includes(lowerTerm)) score = Math.max(score, 1100);
        if (lowerTerm.length > 3) {
            const dist = levenshteinDistance(normalizedTerm, normalizedTitle);
            if (dist === 1) score = Math.max(score, 1050);
        }
        if (normalizedTitle.startsWith(normalizedTerm)) score = Math.max(score, 1000);
        if (score > 0) results.push({ ...d, score });
    });

    const sortedBrands = [...brandsList].sort((a, b) => b.length - a.length);
    let bestBrandMatch: string | null = null;
    sortedBrands.forEach(brand => {
        const normalizedBrand = brand.toLowerCase().replace(/[\s-]/g, '');
        if (normalizedBrand === normalizedTerm) {
            results.push({ type: 'brand-only', label: brand, subLabel: "Voir les concessionnaires", brand: brand, score: 1150 });
            bestBrandMatch = brand;
        } else if (normalizedBrand.startsWith(normalizedTerm)) {
            results.push({ type: 'brand-only', label: brand, subLabel: "Voir les concessionnaires", brand: brand, score: 900 });
            if (!bestBrandMatch) bestBrandMatch = brand;
        }
    });

    const finalSuggestions = results
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .filter((v, i, a) => a.findIndex(t => t.label === v.label && t.type === v.type) === i);
    
    setSuggestions(finalSuggestions.slice(0, 30));
    if (bestBrandMatch && bestBrandMatch.toLowerCase().replace(/[\s-]/g, '').startsWith(normalizedTerm)) {
        setPrediction(searchTerm + bestBrandMatch.substring(searchTerm.length));
    } else {
        setPrediction('');
    }
  }, [searchTerm, allDealers]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    let searchTermToUse = suggestion.label;
    if (suggestion.type === 'brand-only') searchTermToUse = suggestion.brand || suggestion.label;
    onSearchTermChange(searchTermToUse);
    setShowSuggestions(false);
    setIsFocused(false);
    setPrediction('');
    const queryParams = new URLSearchParams();
    if (suggestion.lat && suggestion.lng) {
        queryParams.set('lat', suggestion.lat.toString());
        queryParams.set('lng', suggestion.lng.toString());
        if (suggestion.zoom) queryParams.set('zoom', suggestion.zoom.toString());
    }
    if (suggestion.id) queryParams.set('selectedId', suggestion.id);
    queryParams.set('search', searchTermToUse);
    if (activeFilter) queryParams.set('filter', activeFilter);
    router.push(`/map?${queryParams.toString()}`);
  };

  const executeSearch = () => {
    onSearch();
    setShowSuggestions(false);
    setIsFocused(false);
    setPrediction('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && prediction && prediction !== searchTerm) {
        e.preventDefault();
        onSearchTermChange(prediction);
        setPrediction('');
    } else if (e.key === 'Enter') executeSearch();
  };

  const handleTabClick = (filter: 'shopping' | 'service' | null) => {
    if (onFilterChange) onFilterChange(filter);
    else router.push(`/map${filter ? `?filter=${filter}` : ''}`);
  };

  const searchInput = (
    <div className="relative flex-1" ref={suggestionsRef}>
      {prediction && searchTerm && (
        <div className="absolute inset-0 px-6 py-2 flex items-center pointer-events-none overflow-hidden whitespace-pre">
            <span className="text-base text-transparent select-none">{searchTerm}</span>
            <span className="text-base text-muted-foreground/40 select-none">{prediction.substring(searchTerm.length)}</span>
        </div>
      )}
      <Input 
        type="search" 
        placeholder={placeholderText} 
        className={cn(
            "pr-32 rounded-full shadow-2xl bg-white/95 focus:bg-white border-2 border-transparent focus:border-brand/30 px-6 relative z-10 font-bold transition-all",
            isMapPage ? "h-14 md:h-16 text-sm md:text-lg" : "h-14 md:h-20 text-sm md:text-xl"
        )}
        value={searchTerm} 
        onChange={(e) => { onSearchTermChange(e.target.value); setShowSuggestions(true); }} 
        onFocus={() => { setShowSuggestions(true); setIsFocused(true); }} 
        onKeyDown={handleKeyDown} 
        autoComplete="off" 
      />
      {searchTerm && (<button onClick={() => { onSearchTermChange(''); setPrediction(''); }} className="absolute top-1/2 right-20 -translate-y-1/2 p-2 text-muted-foreground hover:text-brand z-20 transition-colors" type="button"><X className="h-5 w-5" /></button>)}
      <Button type="submit" size="icon" className={cn("absolute top-1/2 right-2 -translate-y-1/2 bg-brand rounded-full z-20 shadow-lg", isMapPage ? "h-12 w-12 md:h-14 md:w-14" : "h-12 w-12 md:h-16 md:w-16")} onClick={executeSearch}><Search className="h-6 w-6 md:h-8 md:w-8" /></Button>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-2xl shadow-2xl z-[1600] max-h-[65vh] overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((s, idx) => (
            <button key={`${s.type}-${idx}`} className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-muted text-left group" onClick={() => handleSuggestionClick(s)}>
              <div className="shrink-0 w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                {s.type === 'dealer' || s.type === 'brand-only' ? <Store className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              </div>
              <div className="flex flex-col min-0">
                <span className="text-base font-bold text-foreground truncate">{s.label}</span>
                {s.subLabel && <span className="text-[10px] text-muted-foreground truncate uppercase font-black tracking-widest">{s.subLabel}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (!mounted) return null;

  return (
    <header className={cn("bg-transparent py-3 px-4 border-none relative pb-12 md:pb-16", className)}>
      <div className="container mx-auto max-w-7xl flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between gap-2 md:gap-6">
          <div className="shrink-0">
            <Link 
                href="/" 
                className={cn(
                    "block transition-all",
                    isMapPage 
                      ? "bg-white/95 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg border border-white/50 hover:bg-white" 
                      : "py-2"
                )}
            >
                <div className="w-32 xs:w-40 md:w-52">
                    <LabelMotoLogo />
                </div>
            </Link>
          </div>
          
          {isMapPage ? (
            <div className="hidden md:flex flex-1 items-center justify-center min-w-0 max-w-3xl">
               {searchInput}
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="bg-white px-10 py-5 rounded-[1.5rem] shadow-2xl border border-gray-100 text-center transform -translate-y-2">
                    <p className="text-xl font-black uppercase tracking-tight text-foreground leading-none">
                        Trouver une concession, un atelier ?
                    </p>
                    <p className="text-2xl font-black italic text-brand mt-1 leading-none">
                        FINI LA GALÈRE.
                    </p>
                </div>
            </div>
          )}

          <div className="flex items-center justify-end shrink-0">
            <UserMenu />
          </div>
        </div>

        {!isMapPage && (
            <div className="hidden md:flex flex-col items-center gap-10 w-full max-w-6xl mx-auto mt-4">
                <div className="flex items-center gap-8 w-full">
                    <div className="flex-1">
                        {searchInput}
                    </div>
                    <div className="relative border-2 border-dashed border-gray-200 rounded-[2.5rem] p-5 flex gap-8 items-center bg-white/30 backdrop-blur-sm">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Guide</span>
                        <div className="flex flex-col items-center gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-white shadow-xl border-4 border-white hover:border-brand/20 transition-all hover:scale-105">
                                <Link href="/entretien" className="flex items-center justify-center">
                                    <Image src="/images/icon-entretienrevision.webp" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
                                    <span className="sr-only">Entretien</span>
                                </Link>
                            </Button>
                            <span className="text-[10px] font-black uppercase tracking-widest">Entretien</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-white shadow-xl border-4 border-white hover:border-brand/20 transition-all hover:scale-105">
                                <Link href="/info" className="flex items-center justify-center">
                                    <Image src="/images/icon-conseils.webp" alt="" width={40} height={40} className="h-9 w-9 object-contain" />
                                    <span className="sr-only">Conseils</span>
                                </Link>
                            </Button>
                            <span className="text-[10px] font-black uppercase tracking-widest">Conseils</span>
                        </div>
                    </div>
                </div>
                <nav className="flex items-center justify-center gap-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => handleTabClick(null)} 
                        className={cn(
                            "h-24 w-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all border-4",
                            activeFilter === null 
                              ? "bg-brand text-white border-white scale-110 z-10" 
                              : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10"
                        )}
                    >
                        <Home className={cn("h-7 w-7", activeFilter === null ? "text-white" : "text-brand")} />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">Tout</span>
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => handleTabClick('shopping')} 
                        className={cn(
                            "h-24 w-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all border-4",
                            activeFilter === 'shopping' 
                              ? "bg-brand text-white border-white scale-110 z-10" 
                              : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10"
                        )}
                    >
                        <Bike className={cn("h-7 w-7", activeFilter === 'shopping' ? "text-white" : "text-brand")} />
                        <span className="text-[9px] font-black uppercase tracking-tighter leading-none mt-1">Concession</span>
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => handleTabClick('service')} 
                        className={cn(
                            "h-24 w-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all border-4",
                            activeFilter === 'service' 
                              ? "bg-brand text-white border-white scale-110 z-10" 
                              : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10"
                        )}
                    >
                        <Wrench className={cn("h-7 w-7", activeFilter === 'service' ? "text-white" : "text-brand")} />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">Atelier</span>
                    </Button>
                </nav>
            </div>
        )}

        <div className={cn("md:hidden flex flex-col items-center gap-3 w-full relative transition-all duration-300", (isFocused || showSuggestions) && "z-[1500]")}>
            <div className="flex items-center gap-2 sm:gap-4 w-full max-w-5xl mx-auto">
                {searchInput}
            </div>
        </div>

        <nav className={cn(
            "md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 z-[1200] w-full max-w-lg px-4",
            !isMapPage && "hidden"
        )}>
            <Button 
              variant="ghost" 
              onClick={() => handleTabClick(null)} 
              className={cn(
                "h-16 w-16 rounded-full flex flex-col items-center justify-center gap-0.5 shadow-2xl transition-all border-4",
                activeFilter === null 
                  ? 'bg-brand text-white border-white scale-110 z-10' 
                  : 'bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10'
              )}
            >
              <Home className={cn("h-5 w-5", activeFilter === null ? "text-white" : "text-brand")} />
              <span className="text-[8px] font-black uppercase tracking-widest">Tout</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleTabClick('shopping')} 
              className={cn(
                "h-16 w-16 rounded-full flex flex-col items-center justify-center gap-0.5 shadow-2xl transition-all border-4",
                activeFilter === 'shopping' 
                  ? 'bg-brand text-white border-white scale-110 z-10' 
                  : 'bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10'
              )}
            >
              <Bike className={cn("h-5 w-5", activeFilter === 'shopping' ? "text-white" : "text-brand")} />
              <span className="text-[7px] font-black uppercase tracking-tighter leading-none">Concession</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleTabClick('service')} 
              className={cn(
                "h-16 w-16 rounded-full flex flex-col items-center justify-center gap-0.5 shadow-2xl transition-all border-4",
                activeFilter === 'service' 
                  ? 'bg-brand text-white border-white scale-110 z-10' 
                  : 'bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white shadow-brand/10'
              )}
            >
              <Wrench className={cn("h-5 w-5", activeFilter === 'service' ? "text-white" : "text-brand")} />
              <span className="text-[8px] font-black uppercase tracking-widest">Atelier</span>
            </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

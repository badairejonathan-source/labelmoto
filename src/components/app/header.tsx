
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
    variant?: 'default' | 'floating';
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
      <div className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  const trigger = (
    <Button 
      variant="ghost" 
      aria-label="Menu utilisateur"
      className="relative h-14 w-14 md:h-16 md:w-16 rounded-full p-0 flex items-center justify-center focus-visible:ring-0 shadow-xl border-2 border-white bg-white hover:border-brand/20 transition-all hover:scale-105 active:scale-95"
    >
      <div className="relative">
        {user ? (
          <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-brand" aria-hidden="true">
            <AvatarImage src={user.photoURL || undefined} alt="" />
            <AvatarFallback className="bg-brand text-brand-foreground text-xs md:text-sm font-black">
              {initial}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center p-1" aria-hidden="true">
            <Image src="/images/icon-moncompte.webp" alt="" width={80} height={80} className="h-full w-full object-contain" />
          </div>
        )}
        
        <div className="absolute -bottom-1 -right-1 bg-brand text-white rounded-full p-1 border-2 border-white shadow-md z-20">
          <Menu className="h-3 w-3 md:h-4 md:w-4" />
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
      <DropdownMenuContent className="w-80 z-[3000] p-4 rounded-[2rem] border-2 shadow-2xl" align="end" forceMount>
        <div className="md:hidden mb-6">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground text-center mb-4 pt-2">G U I D E</p>
            <div className="border-2 border-dashed border-gray-100 rounded-[2rem] p-6 flex justify-around items-center bg-gray-50/50">
                <Link href="/entretien" className="flex flex-col items-center gap-3 group">
                    <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-transparent group-hover:bg-brand group-hover:border-white transition-all transform group-active:scale-95">
                        <Image src="/images/icon-entretienrevision.webp" alt="" width={44} height={44} className="object-contain group-hover:brightness-0 group-hover:invert" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-brand">Entretien</span>
                </Link>
                <Link href="/info" className="flex flex-col items-center gap-3 group">
                    <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-transparent group-hover:bg-brand group-hover:border-white transition-all transform group-active:scale-95">
                        <Image src="/images/icon-conseils.webp" alt="" width={42} height={42} className="object-contain group-hover:brightness-0 group-hover:invert" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-brand">Conseils</span>
                </Link>
            </div>
        </div>

        <DropdownMenuSeparator className="md:hidden mb-4 bg-muted/50" />

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
                <span className="text-sm uppercase font-black tracking-widest">Gérer mon compte</span>
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
    activeFilter = null, 
    onFilterChange, 
    placeholderText = "Recherche par departement, ville, marque, nom...",
    variant = 'default'
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
        <div className="absolute inset-0 px-4 md:px-8 py-2 flex items-center pointer-events-none overflow-hidden whitespace-pre">
            <span className="text-sm md:text-lg text-transparent select-none">{searchTerm}</span>
            <span className="text-sm md:text-lg text-muted-foreground/40 select-none">{prediction.substring(searchTerm.length)}</span>
        </div>
      )}
      <Input 
        type="search" 
        placeholder={placeholderText} 
        className={cn(
            "pr-20 md:pr-28 rounded-full shadow-2xl bg-white/95 focus:bg-white border-2 border-transparent focus:border-brand/30 px-6 md:px-10 relative z-10 font-black transition-all",
            isMapPage ? "h-14 md:h-16 text-xs md:text-base" : "h-16 md:h-20 text-xs md:text-lg"
        )}
        value={searchTerm} 
        onChange={(e) => { onSearchTermChange(e.target.value); setShowSuggestions(true); }} 
        onFocus={() => { setShowSuggestions(true); setIsFocused(true); }} 
        onKeyDown={handleKeyDown} 
        autoComplete="off" 
      />
      {searchTerm && (<button onClick={() => { onSearchTermChange(''); setPrediction(''); }} className="absolute top-1/2 right-14 md:right-24 -translate-y-1/2 p-2 text-muted-foreground hover:text-brand z-20 transition-colors" type="button"><X className="h-5 w-5 md:h-6 md:w-6" /></button>)}
      <Button type="submit" size="icon" className={cn("absolute top-1/2 -right-2 md:right-2 -translate-y-1/2 bg-brand rounded-full z-20 shadow-lg", isMapPage ? "h-14 w-14 md:h-16 md:w-16" : "h-14 w-14 md:h-24 md:w-24")} onClick={executeSearch}><Search className="h-8 w-8 md:h-10 md:w-10" /></Button>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-background border rounded-[2.5rem] shadow-2xl z-[1600] max-h-[65vh] overflow-y-auto py-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((s, idx) => (
            <button key={`${s.type}-${idx}`} className="w-full flex items-center gap-4 px-8 py-5 hover:bg-muted text-left group transition-all" onClick={() => handleSuggestionClick(s)}>
              <div className="shrink-0 w-11 h-11 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                {s.type === 'dealer' || s.type === 'brand-only' ? <Store className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
              </div>
              <div className="flex flex-col min-0">
                <span className="text-lg font-black text-foreground truncate uppercase tracking-tight">{s.label}</span>
                {s.subLabel && <span className="text-[11px] text-muted-foreground truncate uppercase font-black tracking-[0.2em]">{s.subLabel}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (!mounted) return null;

  if (variant === 'floating') {
    return (
        <div className={cn("flex items-center gap-4 pointer-events-auto", className)}>
            <div className="w-[450px] md:w-[650px]">
                {searchInput}
            </div>
            <UserMenu />
        </div>
    );
  }

  return (
    <header className={cn("bg-transparent py-4 px-4 border-none relative", isMapPage ? "pb-0 md:pb-0" : "pb-4 md:pb-0", className)}>
      <div className="container mx-auto max-w-screen-2xl flex flex-col gap-4 md:gap-6">
        <div className="flex flex-row items-center justify-between gap-4 md:gap-8">
          <div className="shrink-0">
            <Link 
                href="/" 
                className={cn(
                    "block transition-all",
                    isMapPage 
                      ? "bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-white/50 hover:bg-white" 
                      : "py-2"
                )}
            >
                <div className="w-32 xs:w-56 md:w-[310px]">
                    <LabelMotoLogo />
                </div>
            </Link>
          </div>
          
          <div className="flex-1 flex justify-center px-2">
              <div className="bg-white px-4 py-3 md:px-12 md:py-7 rounded-full md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 text-center transform hover:scale-[1.02] transition-transform">
                  <p className="text-[8px] md:text-2xl font-black uppercase tracking-tight text-foreground leading-none">
                      {isMapPage ? "Trouver une concession ?" : "Trouver une concession, un atelier ?"}
                  </p>
                  <p className="text-[10px] md:text-4xl font-black italic text-brand mt-0.5 md:mt-2 leading-none tracking-tighter">
                      FINI LA GALÈRE.
                  </p>
              </div>
          </div>

          <div className="flex items-center justify-end shrink-0">
            <UserMenu />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:gap-4 w-full max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
                <div className="flex-1 w-full">
                    {searchInput}
                </div>
                {!isMapPage && (
                    <div className="hidden md:flex relative border-2 border-dashed border-gray-200 rounded-3xl p-5 gap-10 items-center bg-white/40 backdrop-blur-md shadow-inner">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Guide</span>
                        <div className="flex flex-col items-center gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-white shadow-2xl border-2 border-white hover:bg-brand hover:border-white transition-all hover:scale-110 active:scale-95 group">
                                <Link href="/entretien" className="flex items-center justify-center">
                                    <Image src="/images/icon-entretienrevision.webp" alt="" width={40} height={40} className="h-10 w-10 object-contain group-hover:brightness-0 group-hover:invert" />
                                    <span className="sr-only">Entretien</span>
                                </Link>
                            </Button>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">Entretien</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-white shadow-2xl border-2 border-white hover:bg-brand hover:border-white transition-all hover:scale-110 active:scale-95 group">
                                <Link href="/info" className="flex items-center justify-center">
                                    <Image src="/images/icon-conseils.webp" alt="" width={40} height={40} className="h-10 w-10 object-contain group-hover:brightness-0 group-hover:invert" />
                                    <span className="sr-only">Conseils</span>
                                </Link>
                            </Button>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">Conseils</span>
                        </div>
                    </div>
                )}
            </div>
            
            <nav className={cn(
              "flex items-center justify-center gap-3 md:gap-2 relative z-50",
              isMapPage ? "md:hidden" : "-mb-16 md:-mb-24"
            )}>
                <Button 
                    variant="ghost" 
                    onClick={() => handleTabClick('shopping')} 
                    className={cn(
                        "h-20 w-20 md:h-24 md:w-24 rounded-full flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all group border-[6px]",
                        activeFilter === 'shopping' 
                          ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                          : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white"
                    )}
                >
                    <Bike className={cn("h-6 w-6 md:h-8 md:w-8 transition-colors", activeFilter === 'shopping' ? "text-white" : "text-brand group-hover:text-white")} />
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter leading-none mt-1 md:mt-2 transition-colors">Concession</span>
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => handleTabClick(null)} 
                    className={cn(
                        "h-20 w-20 md:h-24 md:w-24 rounded-full flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all group border-[6px]",
                        activeFilter === null 
                          ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                          : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white"
                    )}
                >
                    <Home className={cn("h-6 w-6 md:h-8 md:w-8 transition-colors", activeFilter === null ? "text-white" : "text-brand group-hover:text-white")} />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1 md:mt-2 transition-colors">Tout</span>
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => handleTabClick('service')} 
                    className={cn(
                        "h-20 w-20 md:h-24 md:w-24 rounded-full flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all group border-[6px]",
                        activeFilter === 'service' 
                          ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                          : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white"
                    )}
                >
                    <Wrench className={cn("h-6 w-6 md:h-8 md:w-8 transition-colors", activeFilter === 'service' ? "text-white" : "text-brand group-hover:text-white")} />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1 md:mt-2 transition-colors">Atelier</span>
                </Button>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

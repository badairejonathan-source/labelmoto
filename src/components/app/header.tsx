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
import useWindowSize from '@/hooks/use-window-size';

const brandsList = Object.keys(brandLogos);
let globalDealersCache: Suggestion[] | null = null;

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
    onSearchTermChange: (value: string) => void;
    onSearch: () => void;
    className?: string;
    activeFilter?: 'shopping' | 'service' | 'association' | null;
    onFilterChange?: (filter: 'shopping' | 'service' | 'association' | null) => void;
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
      className="relative h-[62px] w-[62px] md:h-[70px] md:w-[70px] rounded-full p-0 flex items-center justify-center focus-visible:ring-0 shadow-xl border-2 border-white bg-white hover:border-brand/20 transition-all hover:scale-105 active:scale-95 z-[150]"
    >
      <div className="relative h-full w-full flex items-center justify-center pointer-events-none">
        {user ? (
          <Avatar className="h-[48px] w-[48px] md:h-[54px] md:w-[54px] border-2 border-brand" aria-hidden="true">
            <AvatarImage src={user.photoURL || undefined} alt="" />
            <AvatarFallback className="bg-brand text-brand-foreground text-xs font-black">
              {initial}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-[48px] w-[48px] md:h-[54px] md:w-[54px] rounded-full flex items-center justify-center p-1" aria-hidden="true">
            {isUserLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-brand" />
            ) : (
              <Image src="/images/icon-moncompte.webp" alt="" width={80} height={80} className="h-full w-full object-contain" />
            )}
          </div>
        )}
        
        <div className="absolute -bottom-0.5 -right-0.5 md:bottom-0.5 md:right-0.5 bg-brand text-white rounded-full p-0.5 md:p-1 border-2 border-white shadow-md z-20">
          <Menu className="h-2 w-2 md:h-4 md:w-4" />
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
                            <Image src="/images/icon-entretienrevision.webp" alt="" width={44} height={44} className="h-11 w-11 object-contain group-hover:brightness-0 group-hover:invert" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-brand">Entretien</span>
                    </Link>
                    <Link href="/info" className="flex flex-col items-center gap-3 group" aria-label="Consulter les conseils">
                        <div className="h-14 w-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-transparent group-hover:bg-brand group-hover:border-white transition-all transform group-active:scale-95">
                            <Image src="/images/icon-conseils.webp" alt="" width={44} height={44} className="h-11 w-11 object-contain group-hover:brightness-0 group-hover:invert" />
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
    activeFilter = null, 
    onFilterChange, 
    placeholderText = "Recherche par departement, ville, marque, nom...",
    variant = 'default',
    hideUserMenu = false
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  const { width } = useWindowSize();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [prediction, setPrediction] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDealers, setAllDealers] = useState<Suggestion[]>(globalDealersCache || []);
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const isMapPage = pathname === '/map';
  const isMobile = mounted && width !== undefined && width < 1024;
  const isCompactPage = pathname === '/info' || pathname.startsWith('/info/') || pathname === '/entretien' || pathname.startsWith('/fiches/');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDealers = async () => {
        if (!firestore || globalDealersCache || !isFocused) return;
        setIsDataLoading(true);
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
            globalDealersCache = dealers;
            setAllDealers(dealers);
        } catch (e) {
            console.error("Erreur suggestions dealers:", e);
        } finally {
            setIsDataLoading(false);
        }
    };
    if (mounted && isFocused) fetchDealers();
  }, [firestore, mounted, isFocused]);

  useEffect(() => {
    if (searchTerm.trim().length < 1) {
        setSuggestions([]);
        setPrediction('');
        return;
    }

    let lowerTerm = searchTerm.toLowerCase().trim();
    const assoKeywords = ["association", "associations", "asso"];
    const foundAssoKeyword = assoKeywords.find(k => lowerTerm.includes(k));
    let searchPart = lowerTerm;
    if (foundAssoKeyword) {
        searchPart = lowerTerm.replace(foundAssoKeyword, '').trim();
    }

    const parisArrMatch = searchPart.match(/paris\s*(\d{1,2})/i);
    const results: Suggestion[] = [];
    
    if (parisArrMatch) {
        const arrNum = parseInt(parisArrMatch[1]);
        if (arrNum >= 1 && arrNum <= 20) {
            const cp = `750${arrNum.toString().padStart(2, '0')}`;
            results.push({
                type: 'city',
                label: foundAssoKeyword ? `Associations : Paris ${arrNum}${arrNum === 1 ? 'er' : 'ème'}` : `Paris ${arrNum}${arrNum === 1 ? 'er' : 'ème'}`,
                subLabel: cp,
                score: 2000
            });
            searchPart = cp;
        }
    }

    const normalizedTerm = searchPart.replace(/[\s-]/g, '');

    Object.entries(locationsData).forEach(([dept, info]) => {
        const deptNum = dept.split(' - ')[0];
        const normalizedDept = dept.toLowerCase().replace(/[\s-]/g, '');
        if (deptNum.startsWith(normalizedTerm) || normalizedDept.includes(normalizedTerm)) {
            results.push({ 
                type: 'dept', 
                label: foundAssoKeyword ? `Associations : ${dept}` : dept, 
                lat: info.center[0], 
                lng: info.center[1], 
                zoom: 9, 
                score: 900 
            });
        }
        
        info.cities.forEach(city => {
            const normalizedCity = city.toLowerCase().replace(/[\s-]/g, '');
            if (normalizedCity.includes(normalizedTerm)) {
                results.push({ 
                    type: 'city', 
                    label: foundAssoKeyword ? `Associations à ${city}` : city, 
                    subLabel: dept.split(' - ')[0], 
                    lat: info.center[0], 
                    lng: info.center[1], 
                    zoom: 12, 
                    score: 650 
                });
            }
        });
    });

    if (!foundAssoKeyword) {
        brandsList.forEach(brand => {
            const normalizedBrand = brand.toLowerCase().replace(/[\s-]/g, '');
            if (normalizedBrand.includes(normalizedTerm)) {
                results.push({ type: 'brand-only', label: brand, subLabel: "Voir les concessionnaires", brand: brand, score: 1100 });
            }
        });
    }

    allDealers.forEach(d => {
        const title = d.label.toLowerCase();
        const address = d.subLabel?.toLowerCase() || '';
        const normalizedTitle = title.replace(/[\s-]/g, '');
        let score = 0;
        
        const isNumeric = /^\d+$/.test(searchPart);
        if (isNumeric && searchPart.length === 5 && address.includes(searchPart)) score = 1300;
        
        if (normalizedTitle === normalizedTerm) score = Math.max(score, 1200);
        
        const isShortNumber = /^\d{1,2}$/.test(searchPart);
        if (address.includes(searchPart)) {
            if (isShortNumber) {
                const zipMatch = address.match(/\b\d{5}\b/);
                if (zipMatch && zipMatch[0].startsWith(searchPart.padStart(2, '0'))) {
                    score = Math.max(score, 1100);
                }
            } else {
                score = Math.max(score, 1100);
            }
        }
        
        if (searchPart.length > 3) {
            const dist = levenshteinDistance(normalizedTerm, normalizedTitle);
            if (dist === 1) score = Math.max(score, 1050);
        }
        if (normalizedTitle.startsWith(normalizedTerm)) score = Math.max(score, 1000);
        if (score > 0) results.push({ ...d, score });
    });

    const finalSuggestions = results
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .filter((v, i, a) => a.findIndex(t => t.label === v.label && t.type === v.type) === i);
    
    setSuggestions(finalSuggestions.slice(0, 30));
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

  const handleTabClick = (filter: 'shopping' | 'service' | 'association' | null) => {
    if (onFilterChange) onFilterChange(filter);
    else router.push(`/map${filter ? `?filter=${filter}` : ''}`);
  };

  const searchInput = (
    <div className="relative flex-1" ref={suggestionsRef}>
      <Input 
        type="search" 
        placeholder={placeholderText} 
        aria-label={placeholderText}
        className={cn(
            "pr-24 md:pr-32 rounded-full shadow-2xl bg-white/95 focus:bg-white border-2 border-transparent focus:border-brand/30 px-6 md:px-8 relative z-10 font-black transition-all",
            isMapPage ? "h-11 md:h-14 text-xs md:text-base" : "h-12 md:h-14 text-xs md:text-base",
            !isMapPage && "md:pr-[110px]"
        )}
        value={searchTerm} 
        onChange={(e) => { onSearchTermChange(e.target.value); setShowSuggestions(true); }} 
        onFocus={() => { setShowSuggestions(true); setIsFocused(true); }} 
        onKeyDown={handleKeyDown} 
        autoComplete="off" 
      />
      
      {isDataLoading && (
        <div className="absolute top-1/2 right-24 md:right-32 -translate-y-1/2 z-20">
            <Loader2 className="h-4 w-4 animate-spin text-brand/40" />
        </div>
      )}

      {searchTerm && !isDataLoading && (<button onClick={() => { onSearchTermChange(''); setPrediction(''); }} className="absolute top-1/2 right-16 md:right-24 -translate-y-1/2 p-2 text-muted-foreground z-20 transition-colors" type="button" aria-label="Effacer la recherche"><X className="h-4 w-4" /></button>)}
      <Button 
        type="submit" 
        size="icon" 
        aria-label="Lancer la recherche"
        className={cn(
            "absolute top-1/2 -right-0.5 md:right-0.5 -translate-y-1/2 bg-brand rounded-full z-20 shadow-lg transition-transform", 
            isMapPage 
              ? "h-[48px] w-[48px] md:h-[70px] md:w-[70px]" 
              : "h-[54px] w-[54px] md:h-[70px] md:w-[70px]"
        )} 
        onClick={executeSearch}
      >
        <Search className={cn(
            isMapPage 
              ? "h-6 w-6 md:h-7 md:w-7" 
              : "h-7 w-7 md:h-7 md:w-7"
        )} />
      </Button>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-background border rounded-[2rem] shadow-2xl z-[1600] max-h-[60vh] overflow-y-auto py-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((s, idx) => (
            <button key={`${s.type}-${idx}`} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted text-left group transition-all" onClick={() => handleSuggestionClick(s)} aria-label={`Suggestion : ${s.label} ${s.subLabel || ''}`}>
              <div className="shrink-0 w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                {s.type === 'dealer' || s.type === 'brand-only' ? <Store className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-foreground truncate uppercase tracking-tight">{s.label}</span>
                {s.subLabel && <span className="text-[10px] text-muted-foreground truncate uppercase font-black tracking-[0.2em]">{s.subLabel}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className={cn("bg-transparent py-4 px-4 border-none relative", isMapPage ? "pb-0 md:pb-0" : "pb-4 md:pb-0", className)}>
      <div className="container mx-auto max-w-screen-2xl flex flex-col gap-6 md:gap-4">
        {(!isMapPage || isMobile) && (
          <div className="flex flex-row items-center justify-between gap-2 md:gap-6 w-full">
            <div className="shrink-0 relative z-[150]">
              <LabelMotoLogo 
                  className={cn(
                      "transition-all w-[170px] sm:w-52 md:w-[360px] py-1"
                  )}
              />
            </div>
            
            <div className="flex flex-1 justify-center px-1 md:px-4 relative z-10 min-w-0">
                <div className="bg-white px-2 py-1.5 md:px-8 md:py-4 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-gray-100 text-center transform hover:scale-[1.02] transition-transform w-full max-w-xs md:max-w-md lg:max-w-none overflow-hidden flex flex-col justify-center items-center">
                    <p className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base font-black uppercase tracking-wider text-foreground leading-tight">
                        TROUVER UNE CONCESSION ?
                    </p>
                    <p className="text-[10px] xs:text-[12px] sm:text-sm md:text-lg lg:text-xl font-black italic text-brand mt-0.5 md:mt-1 leading-none tracking-tighter">
                        FINI LA GALÈRE.
                    </p>
                </div>
            </div>

            <div className="shrink-0 relative z-[150]">
              {!hideUserMenu && <UserMenu />}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 md:gap-4 w-full max-w-screen-xl mx-auto relative z-20">
            <div className={cn("flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full justify-center", isMapPage && "md:justify-end md:pr-8")}>
                <div className="w-full max-w-2xl">
                    {searchInput}
                </div>
                {!isMapPage && (
                    <div className="hidden md:flex relative border-2 border-dashed border-gray-200 rounded-[2.5rem] p-4 gap-6 items-center bg-white/40 backdrop-blur-md shadow-inner md:ml-36">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Guide</span>
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <Button asChild variant="ghost" size="icon" className="h-[62px] w-[62px] aspect-square rounded-full bg-white shadow-xl border-2 border-white hover:bg-brand hover:border-white transition-all hover:scale-110 active:scale-95 group p-0 flex items-center justify-center">
                                <Link href="/entretien" className="flex items-center justify-center h-full w-full" aria-label="Fiches entretien">
                                    <Image src="/images/icon-entretienrevision.webp" alt="" width={44} height={44} className="h-11 w-11 object-contain group-hover:brightness-0 group-hover:invert pointer-events-none" />
                                    <span className="sr-only">Entretien</span>
                                </Link>
                            </Button>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Entretien</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <Button asChild variant="ghost" size="icon" className="h-[62px] w-[62px] aspect-square rounded-full bg-white shadow-xl border-2 border-white hover:bg-brand hover:border-white transition-all hover:scale-110 active:scale-95 group p-0 flex items-center justify-center">
                                <Link href="/info" className="flex items-center justify-center h-full w-full" aria-label="Conseils pratiques">
                                    <Image src="/images/icon-conseils.webp" alt="" width={44} height={44} className="h-11 w-11 object-contain group-hover:brightness-0 group-hover:invert pointer-events-none" />
                                    <span className="sr-only">Conseils</span>
                                </Link>
                            </Button>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Conseils</span>
                        </div>
                    </div>
                )}
            </div>
            
            <nav className={cn(
              "flex items-center justify-center gap-6 md:gap-6 relative z-50",
              isMapPage ? "hidden" : (isCompactPage ? "-mb-24 md:-mb-20" : "-mb-16 md:-mb-10")
            )}>
                <Button 
                    variant="ghost" 
                    onClick={() => handleTabClick('shopping')} 
                    aria-label="Filtrer par concessions"
                    className={cn(
                        "h-[72px] w-[72px] md:h-[80px] md:w-[80px] p-0 rounded-full flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all group border-[5px]",
                        activeFilter === 'shopping' 
                          ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                          : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white"
                    )}
                >
                    <Bike className={cn("h-7 w-7 transition-colors", activeFilter === 'shopping' ? "text-white" : "text-brand group-hover:text-white")} />
                    <span className="text-[10px] font-black uppercase tracking-tighter leading-none mt-1 transition-colors">Concession</span>
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => handleTabClick(null)} 
                    aria-label="Afficher tout"
                    className={cn(
                        "h-[72px] w-[72px] md:h-[80px] md:w-[80px] p-0 rounded-full flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all group border-[5px]",
                        activeFilter === null 
                          ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                          : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white"
                    )}
                >
                    <Home className={cn("h-7 w-7 transition-colors", activeFilter === null ? "text-white" : "text-brand group-hover:text-white")} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] mt-1 transition-colors">Tout</span>
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => handleTabClick('service')} 
                    aria-label="Filtrer par ateliers"
                    className={cn(
                        "h-[72px] w-[72px] md:h-[80px] md:w-[80px] p-0 rounded-full flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all group border-[5px]",
                        activeFilter === 'service' 
                          ? "bg-brand text-white border-white scale-110 z-10 shadow-brand/40" 
                          : "bg-white text-muted-foreground border-transparent hover:bg-brand hover:text-white hover:border-white"
                    )}
                >
                    <Wrench className={cn("h-7 w-7 transition-colors", activeFilter === 'service' ? "text-white" : "text-brand group-hover:text-white")} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] mt-1 transition-colors">Atelier</span>
                </Button>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
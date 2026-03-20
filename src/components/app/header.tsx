'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, User as UserIcon, Home, Bike, Wrench, Menu, MapPin, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
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
}

const UserMenu = () => {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  // Fetch user profile to get the chosen pseudo
  const stdRef = useMemoFirebase(() => user ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdRef);

  const proRef = useMemoFirebase(() => user ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proRef);

  const activeProfile = proProfile || stdProfile;
  const pseudo = activeProfile?.pseudo || user?.displayName || user?.email?.split('@')[0] || '';
  const initial = pseudo?.[0]?.toUpperCase() || '?';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  if (isUserLoading) {
    return (
      <div className="h-10 w-10 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  const trigger = (
    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 flex items-center justify-center focus-visible:ring-0">
      <div className="relative">
        {user ? (
          <Avatar className="h-9 w-9 border-2 border-brand">
            <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
            <AvatarFallback className="bg-brand text-brand-foreground text-xs font-black">
              {initial}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-9 w-9 rounded-full flex items-center justify-center p-1">
            <Image src="/images/icon-moncompte.png" alt="Mon compte" width={36} height={36} className="h-9 w-9 object-contain" />
          </div>
        )}
        <div className="md:hidden absolute -bottom-1 -right-1 bg-brand text-white rounded-full p-0.5 border-2 border-white shadow-sm flex items-center justify-center">
          <Menu className="h-2 w-2" strokeWidth={3} />
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
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="md:hidden">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Navigation</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href="/entretien" className="flex items-center gap-3 py-2 cursor-pointer">
                    <div className="w-6 flex justify-center">
                        <Image src="/images/icon-entretienrevision.png" alt="" width={24} height={24} className="object-contain" />
                    </div>
                    <span className="font-bold text-sm">Entretien & Révisions</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/info" className="flex items-center gap-3 py-2 cursor-pointer">
                    <div className="w-6 flex justify-center">
                        <Image src="/images/icon-conseils.png" alt="" width={22} height={22} className="object-contain" />
                    </div>
                    <span className="font-bold text-sm">Conseils pratiques</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
        </div>

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
    placeholderText = "Trouver une concession, une ville, une marque..." 
}) => {
  const router = useRouter();
  const firestore = useFirestore();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [prediction, setPrediction] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDealers, setAllDealers] = useState<Suggestion[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDealers = async () => {
        if (!firestore) return;
        try {
            const q = query(collection(firestore, 'concessions'), limit(200));
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
            console.error("Erreur chargement suggestions dealers:", e);
        }
    };
    fetchDealers();
  }, [firestore]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        setPrediction('');
        return;
    }

    const lowerTerm = searchTerm.toLowerCase().trim();
    const normalizedTerm = lowerTerm.replace(/[\s-]/g, '');
    
    const isStrictBrand = brandsList.some(b => {
        const normalizedBrand = b.toLowerCase().replace(/[\s-]/g, '');
        return normalizedBrand === normalizedTerm;
    });

    const results: Suggestion[] = [];

    const sortedBrands = [...brandsList].sort((a, b) => b.length - a.length);
    let bestBrandMatch: string | null = null;

    sortedBrands.forEach(brand => {
        const normalizedBrand = brand.toLowerCase().replace(/[\s-]/g, '');
        if (normalizedBrand.startsWith(normalizedTerm)) {
            if (!bestBrandMatch) bestBrandMatch = brand;
            results.push({
                type: 'brand-only',
                label: brand,
                subLabel: "Filtrer par cette marque",
                brand: brand
            });
        }
    });

    if (bestBrandMatch) {
        const normalizedBrandMatch = bestBrandMatch.toLowerCase().replace(/[\s-]/g, '');
        const searchWithoutBrand = normalizedTerm.replace(normalizedBrandMatch, "").trim();
        
        if (searchWithoutBrand.length > 0) {
            for (const [dept, info] of Object.entries(locationsData)) {
                const normalizedDept = dept.toLowerCase().replace(/[\s-]/g, '');
                if (normalizedDept.includes(searchWithoutBrand)) {
                    results.unshift({
                        type: 'brand-location',
                        label: `${bestBrandMatch} à ${dept}`,
                        subLabel: `Voir les pros ${bestBrandMatch} dans cette zone`,
                        lat: info.center[0],
                        lng: info.center[1],
                        zoom: 9,
                        brand: bestBrandMatch
                    });
                    break;
                }
            }
        }
    }

    Object.entries(locationsData).forEach(([dept, info]) => {
        const normalizedDept = dept.toLowerCase().replace(/[\s-]/g, '');
        if (normalizedDept.includes(normalizedTerm)) {
            results.push({
                type: 'dept',
                label: dept,
                lat: info.center[0],
                lng: info.center[1],
                zoom: 9
            });
        }
        info.cities.forEach(city => {
            const normalizedCity = city.toLowerCase().replace(/[\s-]/g, '');
            if (normalizedCity.includes(normalizedTerm)) {
                results.push({
                    type: 'city',
                    label: city,
                    subLabel: dept.split(' - ')[0],
                    lat: info.center[0],
                    lng: info.center[1],
                    zoom: 10
                });
            }
        });
    });

    const filteredDealers = allDealers.filter(d => {
        const normalizedLabel = d.label.toLowerCase().replace(/[\s-]/g, '');
        const normalizedSubLabel = d.subLabel?.toLowerCase().replace(/[\s-]/g, '') || '';
        return normalizedLabel.includes(normalizedTerm) || normalizedSubLabel.includes(normalizedTerm);
    });
    results.push(...filteredDealers);

    const uniqueResults = results.filter((v, i, a) => a.findIndex(t => t.label === v.label && t.type === v.type) === i);
    setSuggestions(uniqueResults.slice(0, 8));

    if (bestBrandMatch && bestBrandMatch.toLowerCase().replace(/[\s-]/g, '').startsWith(normalizedTerm)) {
        const brandMatch = bestBrandMatch;
        const matchLabel = brandMatch;
        if (matchLabel.toLowerCase().replace(/[\s-]/g, '').startsWith(normalizedTerm)) {
            setPrediction(searchTerm + matchLabel.substring(searchTerm.length));
        } else {
            setPrediction('');
        }
    } else {
        setPrediction('');
    }

    if (isStrictBrand) {
        setSuggestions([]);
    }

  }, [searchTerm, allDealers]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    let searchTermToUse = suggestion.label;
    if (suggestion.type === 'brand-location') {
        searchTermToUse = `${suggestion.brand} ${searchTerm.split(' ').pop()}`;
    } else if (suggestion.type === 'brand-only') {
        searchTermToUse = suggestion.brand || suggestion.label;
    }
    
    onSearchTermChange(searchTermToUse);
    setShowSuggestions(false);
    setPrediction('');
    
    const queryParams = new URLSearchParams();
    if (suggestion.lat && suggestion.lng) {
        queryParams.set('lat', suggestion.lat.toString());
        queryParams.set('lng', suggestion.lng.toString());
        if (suggestion.zoom) {
            queryParams.set('zoom', suggestion.zoom.toString());
        }
    }
    if (suggestion.id) {
        queryParams.set('selectedId', suggestion.id);
    }
    queryParams.set('search', searchTermToUse);
    if (activeFilter) queryParams.set('filter', activeFilter);

    router.push(`/map?${queryParams.toString()}`);
  };

  const executeSearch = () => {
    if (prediction && prediction !== searchTerm) {
        onSearchTermChange(prediction);
        setPrediction('');
        setTimeout(() => onSearch(), 10);
    } else if (suggestions.length > 0) {
        const firstBrandOnly = suggestions.find(s => s.type === 'brand-only');
        if (firstBrandOnly) {
            handleSuggestionClick(firstBrandOnly);
        } else {
            handleSuggestionClick(suggestions[0]);
        }
    } else {
        onSearch();
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && prediction && prediction !== searchTerm) {
        e.preventDefault();
        onSearchTermChange(prediction);
        setPrediction('');
    } else if (e.key === 'Enter') {
        executeSearch();
    }
  };

  const handleTabClick = (filter: 'shopping' | 'service' | null) => {
    if (onFilterChange) {
      onFilterChange(filter);
    } else {
      const query = filter ? `?filter=${filter}` : '';
      router.push(`/map${query}`);
    }
  };

  return (
    <header className={cn("bg-card py-3 px-4 border-b border-border z-40 relative", className)}>
      <div className="container mx-auto max-width-7xl flex flex-col gap-3">
        <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_2fr_1fr] items-center gap-y-2">
          <div className="w-40 md:w-56 shrink-0 lg:justify-self-start">
            <Link href="/">
              <LabelMotoLogo />
            </Link>
          </div>
          
          <div className="col-span-2 lg:col-span-1 flex items-center justify-center px-4 order-3 lg:order-none relative overflow-hidden rounded-xl py-2">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <Image 
                    src="/images/apercucarte.png" 
                    alt="" 
                    fill 
                    className="object-cover grayscale"
                />
            </div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground text-center leading-tight relative z-10">
              <span className="block lg:inline">Trouver une concession, un atelier ou un réparateur ?</span>{" "}
              <span className="text-brand italic block lg:inline">Fini la galère.</span>
            </p>
          </div>

          <div className="flex items-center gap-2 justify-end lg:justify-self-end lg:order-none">
            <UserMenu />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-2 sm:gap-4 w-full max-w-5xl mx-auto">
                <div className="hidden md:block w-24 shrink-0" aria-hidden="true" />

                <div className="relative flex-1 max-w-2xl mx-auto" ref={suggestionsRef}>
                  {prediction && searchTerm && (
                    <div className="absolute inset-0 px-4 py-2 flex items-center pointer-events-none overflow-hidden whitespace-pre">
                        <span className="text-sm text-transparent select-none">{searchTerm}</span>
                        <span className="text-sm text-muted-foreground/40 select-none">
                            {prediction.substring(searchTerm.length)}
                        </span>
                    </div>
                  )}
                  <Input
                    type="search"
                    placeholder={placeholderText}
                    className="pr-10 h-10 text-sm rounded-full shadow-sm bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 border-none relative z-10"
                    value={searchTerm}
                    onChange={(e) => {
                        onSearchTermChange(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                  />
                  <Button 
                      type="submit" 
                      size="icon" 
                      className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 bg-brand hover:bg-brand/90 text-brand-foreground rounded-full shadow z-20"
                      onClick={executeSearch}
                  >
                    <Search className="h-4 w-4" />
                  </Button>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {suggestions.map((s, idx) => (
                            <button
                                key={`${s.type}-${idx}`}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors group"
                                onClick={() => handleSuggestionClick(s)}
                            >
                                <div className="shrink-0 w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                    {s.type === 'dealer' || s.type === 'brand-location' || s.type === 'brand-only' ? <Store className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-foreground truncate">{s.label}</span>
                                    {s.subLabel && <span className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight">{s.subLabel}</span>}
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Search className="w-3 h-3 text-muted-foreground" />
                                </div>
                            </button>
                        ))}
                    </div>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-2 shrink-0 w-24 justify-end">
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-brand h-10 w-10">
                                    <Link href="/entretien">
                                        <Image src="/images/icon-entretienrevision.png" alt="Entretien" width={32} height={32} className="h-8 w-8 object-contain" />
                                        <span className="sr-only">Entretien & Révisions</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom"><p>Entretien & Révisions</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                     <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-brand h-10 w-10">
                                    <Link href="/info">
                                        <Image src="/images/icon-conseils.png" alt="Conseils" width={28} height={28} className="h-7 w-7 object-contain" />
                                        <span className="sr-only">Conseils pratiques</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom"><p>Conseils pratiques</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <nav className="flex items-center justify-center gap-6 sm:gap-10 mt-1">
                <Button
                    variant="ghost"
                    onClick={() => handleTabClick(null)}
                    className={cn(
                      "relative px-3 py-1.5 h-auto flex items-center gap-2 text-sm font-bold transition-all rounded-lg hover:bg-brand/10",
                      activeFilter === null ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Home className="h-5 w-5" />
                    <span>Tout</span>
                  </Button>
                <Button
                    variant="ghost"
                    onClick={() => handleTabClick('shopping')}
                    className={cn(
                      "relative px-3 py-1.5 h-auto flex items-center gap-2 text-sm font-bold transition-all rounded-lg hover:bg-brand/10",
                      activeFilter === 'shopping' ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Bike className="h-5 w-5" />
                    <span>Concession</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleTabClick('service')}
                    className={cn(
                      "relative px-3 py-1.5 h-auto flex items-center gap-2 text-sm font-bold transition-all rounded-lg hover:bg-brand/10",
                      activeFilter === 'service' ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Wrench className="h-5 w-5" />
                    <span>Atelier</span>
                  </Button>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

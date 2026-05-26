'use client';

import React, { useState, useEffect, useRef, useDeferredValue } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User as UserIcon, Menu, MapPin, Store, X, Bike, Wrench, Users, Utensils, FileText, LogOut, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from './logo';
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
import { cn } from '@/lib/utils';

const brandsList = Object.keys(brandLogos);
let globalDealersCache: any[] | null = null;

export const UserMenu = () => {
  const { user, profile, activateAuth } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const activeProfile = profile;
  const pseudo = activeProfile?.displayName || activeProfile?.pseudo || user?.email?.split('@')[0] || '';
  const initial = pseudo?.[0]?.toUpperCase() || '?';
  const isAdmin = activeProfile?.role === 'admin';

  if (!mounted) return null;

  return (
    <DropdownMenu onOpenChange={(open) => open && activateAuth()}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-[73px] w-[73px] md:h-[83px] md:w-[83px] rounded-full p-0 flex items-center justify-center shadow-xl border-2 border-white bg-white hover:bg-white transition-all hover:scale-105 active:scale-95"
        >
          {user ? (
            <Avatar className="h-[57px] w-[57px] md:h-[65px] md:w-[65px] border-2 border-brand">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback className="bg-brand text-white text-xs font-black">{initial}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-[57px] w-[57px] md:h-[65px] md:w-[65px] rounded-full flex items-center justify-center p-1">
              <Image src="/images/icon-moncompte.webp" alt="" width={80} height={80} className="h-full w-full object-contain" />
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 bg-brand text-white rounded-full p-0.5 border-2 border-white">
            <Menu className="h-3 w-3 md:h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 z-[3000] p-6 rounded-[2.5rem] border-2 shadow-2xl" align="end">
        <DropdownMenuLabel className="text-[9px] uppercase font-black text-muted-foreground px-2 mb-4 tracking-[0.2em]">Les Guides Moto</DropdownMenuLabel>
        
        <div className="grid grid-cols-2 gap-4 px-2 mb-6">
          <DropdownMenuItem asChild className="p-0 bg-transparent focus:bg-transparent focus:text-inherit cursor-pointer">
            <Link href="/entretien" className="flex flex-col items-center gap-2 group/nav">
              <div className="h-16 w-16 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center transition-all group-hover/nav:scale-110 group-hover/nav:border-brand/20 p-2.5">
                 <Image src="/images/icon-entretienrevision.webp" alt="Entretien" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover/nav:text-brand text-center">Entretien</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 bg-transparent focus:bg-transparent focus:text-inherit cursor-pointer">
            <Link href="/info" className="flex flex-col items-center gap-2 group/nav">
              <div className="h-16 w-16 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center transition-all group-hover/nav:scale-110 group-hover/nav:border-brand/20 p-2.5">
                 <Image src="/images/icon-conseils.webp" alt="Conseils" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover/nav:text-brand text-center">Conseils</span>
            </Link>
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator className="mx-2 mb-6 border-muted/50" />
        
        <DropdownMenuLabel className="text-[9px] uppercase font-black text-muted-foreground px-2 mb-2 tracking-[0.2em]">Votre Compte</DropdownMenuLabel>
        {user ? (
          <>
            <div className="px-2 mb-3"><p className="text-xs font-black text-brand truncate">{pseudo}</p></div>
            
            {isAdmin && (
              <DropdownMenuItem asChild className="cursor-pointer font-black uppercase text-[10px] tracking-widest text-brand hover:bg-brand/5 rounded-xl mb-1 border border-brand/20">
                <Link href="/admin" className="flex items-center w-full">
                  <ShieldAlert className="mr-3 h-4 w-4" /> Espace Admin
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild className="cursor-pointer font-bold rounded-xl mb-1 focus:bg-brand/5 focus:text-brand">
              <Link href="/account" className="flex items-center w-full">
                <UserIcon className="mr-3 h-4 w-4" /> Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut(auth)} className="cursor-pointer font-black uppercase text-[9px] tracking-widest text-destructive hover:bg-destructive/5 rounded-xl px-2 py-3 mt-2">
              <LogOut className="mr-3 h-4 w-4" /> Déconnexion
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild className="cursor-pointer font-black uppercase text-[10px] tracking-widest text-brand hover:bg-brand/5 rounded-xl px-4 py-4 mt-2 border-2 border-brand/10 border-dashed text-center">
            <Link href="/login" className="w-full">Se connecter</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavigationIcons = () => {
  return (
    <div className="hidden lg:flex items-center gap-8 ml-32">
      <Link href="/entretien" className="flex flex-col items-center gap-1 group">
        <div className="h-[73px] w-[73px] rounded-full bg-white shadow-xl border-2 border-white flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-brand/20 p-2.5">
           <Image src="/images/icon-entretienrevision.webp" alt="Entretien" width={48} height={48} className="w-full h-full object-contain" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand">Entretien</span>
      </Link>
      <Link href="/info" className="flex flex-col items-center gap-1 group">
        <div className="h-[73px] w-[73px] rounded-full bg-white shadow-xl border-2 border-white flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-brand/20 p-2.5">
           <Image src="/images/icon-conseils.webp" alt="Conseils" width={48} height={48} className="w-full h-full object-contain" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand">Conseils</span>
      </Link>
    </div>
  );
};

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
        <button 
          key={f.id} 
          onClick={() => router.push(`/map?filter=${f.id}`)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="h-[70px] w-[70px] rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-brand/20">
            <f.icon className={cn("h-8 w-8", f.color)} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tight text-muted-foreground group-hover:text-brand">{f.label}</span>
        </button>
      ))}
    </div>
  );
};

const Header: React.FC<any> = ({ 
    searchTerm, 
    onSearchTermChange, 
    onSearch, 
    placeholderText = "Recherche par département, ville, marque...",
    searchOnly = false
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { firestore } = useFirebase();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDealers, setAllDealers] = useState<any[]>(globalDealersCache || []);
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    const fetchDealers = async () => {
        if (!firestore || globalDealersCache || !isFocused) return;
        try {
            const snapshot = await getDocs(query(collection(firestore, 'concessions'), limit(2000)));
            const dealers = snapshot.docs.map(doc => ({
                type: 'dealer',
                label: doc.data().title || doc.id,
                subLabel: doc.data().address,
                lat: doc.data().latitude,
                lng: doc.data().longitude,
                id: doc.id
            }));
            globalDealersCache = dealers;
            setAllDealers(dealers);
        } catch (e) {}
    };
    fetchDealers();
  }, [firestore, isFocused]);

  useEffect(() => {
    if (deferredSearchTerm.trim().length < 1) { setSuggestions([]); return; }
    const lower = deferredSearchTerm.toLowerCase().trim();
    const results: any[] = [];

    // Priorité 1 : Département (2 chiffres)
    if (lower.match(/^\d{2}$/)) {
        Object.entries(locationsData).forEach(([dept, info]) => {
            if (dept.startsWith(lower)) {
                results.push({ type: 'dept', label: dept, subLabel: "Département", lat: info.center[0], lng: info.center[1], zoom: 9 });
            }
        });
    }

    // Priorité 2 : Code Postal (5 chiffres)
    if (lower.match(/^\d{5}$/)) {
        const deptCode = lower.substring(0, 2);
        Object.entries(locationsData).forEach(([dept, info]) => {
            if (dept.startsWith(deptCode)) {
                results.push({ type: 'cp', label: lower, subLabel: `Zone ${dept.split(' - ')[1]}`, lat: info.center[0], lng: info.center[1], zoom: 12 });
            }
        });
    }

    // Priorité 3 : Marques
    brandsList.forEach(brand => {
        if (brand.toLowerCase().includes(lower)) {
            results.push({ type: 'brand', label: brand, subLabel: "Marque Moto" });
        }
    });

    // Priorité 4 : Villes & Départements (Texte)
    Object.entries(locationsData).forEach(([dept, info]) => {
        if (dept.toLowerCase().includes(lower) && !results.some(r => r.label === dept)) {
            results.push({ type: 'dept', label: dept, subLabel: "Département", lat: info.center[0], lng: info.center[1], zoom: 9 });
        }
        info.cities.forEach(city => {
            if (city.toLowerCase().includes(lower)) {
                results.push({ type: 'city', label: city, subLabel: dept.split(' - ')[1], lat: info.center[0], lng: info.center[1], zoom: 12 });
            }
        });
    });

    // Priorité 5 : Établissements
    allDealers.forEach(d => {
        if (d.label.toLowerCase().includes(lower)) {
            results.push(d);
        }
    });

    setSuggestions(results.slice(0, 10));
  }, [deferredSearchTerm, allDealers]);

  const handleSuggestionClick = (s: any) => {
    onSearchTermChange(s.label);
    setShowSuggestions(false);
    
    if (window.location.pathname !== '/map') {
        const queryParams = new URLSearchParams();
        if (s.lat && s.lng) {
            queryParams.set('lat', s.lat.toString());
            queryParams.set('lng', s.lng.toString());
            if (s.zoom) queryParams.set('zoom', s.zoom.toString());
        }
        if (s.id) queryParams.set('selectedId', s.id);
        queryParams.set('search', s.label);
        router.push(`/map?${queryParams.toString()}`);
    } else {
        setTimeout(() => onSearch(), 10);
    }
  };

  const clearSearch = () => {
    onSearchTermChange('');
    setShowSuggestions(false);
    if (window.location.pathname === '/map') {
        router.replace('/map');
    }
  };

  const searchInput = (
    <div className="w-full relative" ref={suggestionsRef}>
        <div className="relative group">
            <Input 
                type="text" 
                placeholder={placeholderText} 
                className="pr-20 md:pr-24 rounded-full shadow-2xl bg-white/95 focus:bg-white border-none px-6 md:px-10 h-12 md:h-14 font-bold text-sm md:text-base transition-all"
                value={searchTerm} 
                onChange={(e) => { onSearchTermChange(e.target.value); setShowSuggestions(true); }}
                onFocus={() => { setShowSuggestions(true); setIsFocused(true); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearch();
                    setShowSuggestions(false);
                  }
                }}
                autoComplete="off"
            />
            {searchTerm && (
                <button onClick={clearSearch} className="absolute right-20 md:right-24 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-brand">
                    <X className="h-4 w-4" />
                </button>
            )}
            <Button 
                className="absolute top-1/2 right-1 -translate-y-1/2 bg-brand rounded-full h-[70px] w-[70px] shadow-lg hover:scale-105 active:scale-95 transition-all" 
                onClick={() => { onSearch(); setShowSuggestions(false); }}
            >
                <Search className="h-8 w-8" />
            </Button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl z-[1600] max-h-[50vh] overflow-y-auto py-3 border-2 border-white">
                {suggestions.map((s, idx) => (
                    <button key={idx} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted text-left group" onClick={() => handleSuggestionClick(s)}>
                        <div className="shrink-0 w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                            {s.type === 'dealer' ? <Store className="w-4 h-4" /> : s.type === 'brand' ? <Bike className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black text-foreground truncate uppercase">{s.label}</span>
                            {s.subLabel && <span className="text-[9px] text-muted-foreground truncate uppercase font-bold">{s.subLabel}</span>}
                        </div>
                    </button>
                ))}
            </div>
        )}
    </div>
  );

  if (searchOnly) {
    return searchInput;
  }

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
        <div className="flex items-center justify-between gap-4 w-full">
            <div className="shrink-0">
                <LabelMotoLogo className="h-auto w-[234px] sm:w-[286px] md:w-[364px]" />
            </div>
            
            <div className="flex-1 flex justify-center px-4">
                <div className="hidden md:block bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border-2 border-white px-6 py-2.5 md:px-8 md:py-4 text-center max-w-[200px] md:max-w-sm">
                    <p className="text-[7px] md:text-[11px] font-black uppercase tracking-widest text-foreground leading-tight">TROUVER UNE CONCESSION ?</p>
                    <p className="text-[9px] md:text-sm font-black italic text-brand leading-none">FINI LA GALÈRE.</p>
                </div>
            </div>

            <div className="shrink-0 flex items-center">
                <UserMenu />
            </div>
        </div>

        <div className="w-full max-w-6xl mx-auto relative flex items-center gap-8">
            <div className="flex-1">
                {searchInput}
            </div>
            <NavigationIcons />
        </div>
        
        {pathname !== '/map' && (
            <div className="w-full max-w-3xl mx-auto relative">
                 <QuickFilters />
            </div>
        )}
    </div>
  );
};

export default Header;
'use client';

import React, { useState, useEffect, useRef, useDeferredValue } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User as UserIcon, Menu, MapPin, Store, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from './logo';
import { useUser, useAuth, useFirestore, useMemoFirebase, useDoc, useFirebase } from '@/firebase';
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
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';
import { collection, query, getDocs, limit, doc } from 'firebase/firestore';

const brandsList = Object.keys(brandLogos);
let globalDealersCache: any[] | null = null;

export const UserMenu = () => {
  const { user, isUserLoading, activateAuth } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const stdRef = useMemoFirebase(() => user ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdRef);
  const proRef = useMemoFirebase(() => user ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proRef);

  const activeProfile = proProfile || stdProfile;
  const pseudo = activeProfile?.pseudo || user?.email?.split('@')[0] || '';
  const initial = pseudo?.[0]?.toUpperCase() || '?';

  if (!mounted) return null;

  return (
    <DropdownMenu onOpenChange={(open) => open && activateAuth()}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-[56px] w-[56px] md:h-[64px] md:w-[64px] rounded-full p-0 flex items-center justify-center shadow-xl border-2 border-white bg-white hover:bg-white transition-all hover:scale-105 active:scale-95"
        >
          {user ? (
            <Avatar className="h-[44px] w-[44px] md:h-[50px] md:w-[50px] border-2 border-brand">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback className="bg-brand text-white text-xs font-black">{initial}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-[44px] w-[44px] md:h-[50px] md:w-[50px] rounded-full flex items-center justify-center p-1">
              <Image src="/images/icon-moncompte.webp" alt="" width={80} height={80} className="h-full w-full object-contain" />
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 bg-brand text-white rounded-full p-0.5 border-2 border-white">
            <Menu className="h-2 w-2 md:h-3 w-3" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 z-[3000] p-4 rounded-[2rem] border-2 shadow-2xl" align="end">
        <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-2">Mon Compte</DropdownMenuLabel>
        {user ? (
          <>
            <div className="px-2 py-2 mb-2"><p className="text-sm font-black text-brand truncate">{pseudo}</p></div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer font-bold"><Link href="/account"><UserIcon className="mr-2 h-4 w-4" /> Profil</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut(auth)} className="cursor-pointer text-destructive">Déconnexion</DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild className="cursor-pointer font-bold text-brand"><Link href="/login">Se connecter</Link></DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC<any> = ({ 
    searchTerm, 
    onSearchTermChange, 
    onSearch, 
    placeholderText = "Recherche par departement, ville, marque, nom...",
}) => {
  const router = useRouter();
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
    Object.entries(locationsData).forEach(([dept, info]) => {
        if (dept.toLowerCase().includes(lower)) results.push({ type: 'dept', label: dept, lat: info.center[0], lng: info.center[1], zoom: 9 });
        info.cities.forEach(city => { if (city.toLowerCase().includes(lower)) results.push({ type: 'city', label: city, subLabel: dept, lat: info.center[0], lng: info.center[1], zoom: 12 }); });
    });
    brandsList.forEach(brand => { if (brand.toLowerCase().includes(lower)) results.push({ type: 'brand', label: brand, subLabel: "Marque moto" }); });
    allDealers.forEach(d => { if (d.label.toLowerCase().includes(lower)) results.push(d); });
    setSuggestions(results.slice(0, 10));
  }, [deferredSearchTerm, allDealers]);

  const handleSuggestionClick = (s: any) => {
    onSearchTermChange(s.label);
    setShowSuggestions(false);
    const queryParams = new URLSearchParams();
    if (s.lat && s.lng) {
        queryParams.set('lat', s.lat.toString());
        queryParams.set('lng', s.lng.toString());
        if (s.zoom) queryParams.set('zoom', s.zoom.toString());
    }
    if (s.id) queryParams.set('selectedId', s.id);
    queryParams.set('search', s.label);
    router.push(`/map?${queryParams.toString()}`);
  };

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
        {/* ROW 1: BUBBLES */}
        <div className="flex items-center justify-between gap-2 w-full">
            <div className="shrink-0">
                <LabelMotoLogo className="h-auto w-[180px] sm:w-[220px] md:w-[280px]" />
            </div>
            
            <div className="flex-1 flex justify-center px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border-2 border-white px-6 py-2.5 md:px-8 md:py-4 text-center max-w-[200px] md:max-w-sm">
                    <p className="text-[7px] md:text-[11px] font-black uppercase tracking-widest text-foreground leading-tight">TROUVER UNE CONCESSION ?</p>
                    <p className="text-[9px] md:text-sm font-black italic text-brand leading-none">FINI LA GALÈRE.</p>
                </div>
            </div>

            <div className="shrink-0">
                <UserMenu />
            </div>
        </div>

        {/* ROW 2: SEARCH BAR */}
        <div className="w-full max-w-3xl mx-auto relative" ref={suggestionsRef}>
            <div className="relative group">
                <Input 
                    type="text" 
                    placeholder={placeholderText} 
                    className="pr-16 md:pr-20 rounded-full shadow-2xl bg-white/95 focus:bg-white border-none px-6 md:px-10 h-12 md:h-14 font-bold text-sm md:text-base transition-all"
                    value={searchTerm} 
                    onChange={(e) => { onSearchTermChange(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => { setShowSuggestions(true); setIsFocused(true); }}
                    onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    autoComplete="off"
                />
                {searchTerm && (
                    <button onClick={() => onSearchTermChange('')} className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-brand">
                        <X className="h-4 w-4" />
                    </button>
                )}
                <Button 
                    className="absolute top-1/2 right-1 -translate-y-1/2 bg-brand rounded-full h-[44px] w-[44px] md:h-[52px] md:w-[52px] shadow-lg hover:scale-105 active:scale-95 transition-all" 
                    onClick={onSearch}
                >
                    <Search className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl z-[1600] max-h-[50vh] overflow-y-auto py-3 border-2 border-white">
                    {suggestions.map((s, idx) => (
                        <button key={idx} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted text-left group" onClick={() => handleSuggestionClick(s)}>
                            <div className="shrink-0 w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                {s.type === 'dealer' ? <Store className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
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
    </div>
  );
};

export default Header;
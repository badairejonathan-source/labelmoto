'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, User as UserIcon, Home, Bike, Wrench, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    onSearch: () => void;
    className?: string;
    activeFilter?: 'shopping' | 'service' | null;
    onFilterChange?: (filter: 'shopping' | 'service' | null) => void;
    placeholderText?: string;
}

const UserMenu = () => {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

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
            <AvatarFallback className="bg-brand text-brand-foreground text-xs">{user.email?.[0].toUpperCase()}</AvatarFallback>
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
                <p className="text-xs font-medium leading-none truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer text-brand focus:text-brand font-bold py-2">
              <Link href="/account">
                <UserIcon className="mr-2 h-3.5 w-3.5" />
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
              <UserIcon className="mr-2 h-3.5 w-3.5" />
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
    placeholderText = "Recherche par nom, ville, departement" 
}) => {
  const router = useRouter();

  const handleTabClick = (filter: 'shopping' | 'service' | null) => {
    if (onFilterChange) {
      onFilterChange(filter);
    } else {
      const query = filter ? `?filter=${filter}` : '';
      router.push(`/map${query}`);
    }
  };

  return (
    <header className={cn("bg-card py-2 px-4 border-b border-border z-40 relative", className)}>
      <div className="container mx-auto max-w-7xl flex flex-col gap-2">
        <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_2fr_1fr] items-center gap-y-2">
          <div className="w-40 md:w-56 shrink-0 lg:justify-self-start">
            <Link href="/">
              <LabelMotoLogo />
            </Link>
          </div>
          
          <div className="col-span-2 lg:col-span-1 flex items-center justify-center px-4 order-3 lg:order-none">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-foreground text-center leading-tight">
              <span className="block lg:inline">Trouver une concession, un atelier ou un réparateur ?</span>{" "}
              <span className="text-brand italic block lg:inline">Fini la galère.</span>
            </p>
          </div>

          <div className="flex items-center gap-2 justify-end lg:justify-self-end lg:order-none">
            <UserMenu />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1 w-full">
            <div className="flex items-center gap-2 sm:gap-4 w-full max-w-5xl mx-auto">
                <div className="hidden md:block w-24 shrink-0" aria-hidden="true" />

                <div className="relative flex-1 max-w-2xl mx-auto">
                  <Input
                    type="search"
                    placeholder={placeholderText}
                    className="pr-10 h-9 text-xs rounded-full shadow-sm bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 border-none"
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearch();
                        }
                    }}
                  />
                  <Button 
                      type="submit" 
                      size="icon" 
                      className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 bg-brand hover:bg-brand/90 text-brand-foreground rounded-full shadow"
                      onClick={onSearch}
                  >
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="hidden md:flex items-center gap-1 shrink-0 w-24 justify-end">
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

            <nav className="flex items-center justify-center gap-4 sm:gap-8 mt-1">
                <Button
                    variant="ghost"
                    onClick={() => handleTabClick(null)}
                    className={cn(
                      "relative px-2 py-1 h-auto flex items-center gap-1.5 text-xs font-bold transition-all rounded-lg hover:bg-brand/10",
                      activeFilter === null ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Home className="h-4 w-4" />
                    <span>Tout</span>
                  </Button>
                <Button
                    variant="ghost"
                    onClick={() => handleTabClick('shopping')}
                    className={cn(
                      "relative px-2 py-1 h-auto flex items-center gap-1.5 text-xs font-bold transition-all rounded-lg hover:bg-brand/10",
                      activeFilter === 'shopping' ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Bike className="h-4 w-4" />
                    <span>Concession</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleTabClick('service')}
                    className={cn(
                      "relative px-2 py-1 h-auto flex items-center gap-1.5 text-xs font-bold transition-all rounded-lg hover:bg-brand/10",
                      activeFilter === 'service' ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Wrench className="h-4 w-4" />
                    <span>Atelier</span>
                  </Button>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
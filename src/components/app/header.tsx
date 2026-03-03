'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, LogOut, Loader2, User as UserIcon, Home, Bike, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
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
    activeFilter: 'shopping' | 'service' | null;
    onFilterChange: (filter: 'shopping' | 'service' | null) => void;
    placeholderText: string;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchTermChange, onSearch, className, activeFilter, onFilterChange, placeholderText }) => {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <header className={cn("bg-card p-2 text-foreground border-b border-border z-40", className)}>
      <div className="container mx-auto flex flex-col gap-1.5">
        <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_2fr_1fr] items-center gap-y-3">
          <div className="w-48 md:w-64 shrink-0 lg:justify-self-start">
            <Link href="/">
              <LabelMotoLogo />
            </Link>
          </div>
          
          <div className="col-span-2 lg:col-span-1 flex items-center justify-center px-4 order-3 lg:order-none">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground text-center leading-[1.1]">
              <span className="block lg:inline">Trouver une concession, un atelier ou un réparateur ?</span>{" "}
              <span className="text-brand italic block lg:inline">Fini la galère.</span>
            </p>
          </div>

          <div className="flex items-center gap-2 justify-end lg:justify-self-end lg:order-none">
            {isUserLoading ? (
              <Button size="icon" variant="ghost" className="rounded-full h-16 w-16">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
              </Button>
            ) : !user ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" className="rounded-full h-16 w-16 p-0">
                      <Link href="/login">
                        <div className="h-14 w-14 rounded-full flex items-center justify-center p-1">
                          <Image src="/images/icon-moncompte.png" alt="Mon compte" width={48} height={48} className="h-12 w-12 object-contain" />
                        </div>
                        <span className="sr-only">Mon compte</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Mon compte</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-16 w-16 rounded-full p-0">
                    <Avatar className="h-14 w-14 border-2 border-brand">
                      <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
                      <AvatarFallback className="bg-brand text-brand-foreground text-xl">{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Connecté en tant que</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer text-brand focus:text-brand">
                    <Link href="/account">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Gérer mon compte</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:text-brand">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1 mt-2 w-full">
            <div className="flex items-center gap-2 sm:gap-4 w-full max-w-7xl mx-auto px-4">
                <div className="relative flex-1 max-w-3xl">
                  <Input
                    type="search"
                    placeholder={placeholderText}
                    className="pr-12 h-10 text-sm rounded-full shadow-sm bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900"
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
                      className="absolute top-1/2 right-1.5 -translate-y-1/2 h-7 w-7 bg-brand hover:bg-brand/90 text-brand-foreground rounded-full shadow"
                      onClick={onSearch}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-brand h-16 w-16">
                                    <Link href="/entretien">
                                        <Image src="/images/icon-entretienrevision.png" alt="Entretien" width={62} height={62} className="h-[62px] w-[62px] object-contain" />
                                        <span className="sr-only">Entretien & Révisions</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Entretien & Révisions</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                     <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-brand h-16 w-16">
                                    <Link href="/info">
                                        <Image src="/images/icon-conseils.png" alt="Conseils" width={50} height={50} className="h-[50px] w-[50px] object-contain" />
                                        <span className="sr-only">Conseils pratiques</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Conseils pratiques</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <nav className="flex items-center justify-center gap-4 sm:gap-6 mt-2">
                <Button
                    variant="ghost"
                    onClick={() => onFilterChange(null)}
                    className={cn(
                      "relative px-3 py-1 h-auto flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-lg font-medium transition-all rounded-xl hover:bg-brand hover:text-brand-foreground",
                      activeFilter === null ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Home className="h-5 w-5 sm:h-6 w-6" />
                    <span>Tout</span>
                  </Button>
                <Button
                    variant="ghost"
                    onClick={() => onFilterChange('shopping')}
                    className={cn(
                      "relative px-3 py-1 h-auto flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-lg font-medium transition-all rounded-xl hover:bg-brand hover:text-brand-foreground",
                      activeFilter === 'shopping' ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Bike className="h-5 w-5 sm:h-6 w-6" />
                    <span>Concession</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onFilterChange('service')}
                    className={cn(
                      "relative px-3 py-1 h-auto flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-lg font-medium transition-all rounded-xl hover:bg-brand hover:text-brand-foreground",
                      activeFilter === 'service' ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    <Wrench className="h-5 w-5 sm:h-6 w-6" />
                    <span>Atelier</span>
                  </Button>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

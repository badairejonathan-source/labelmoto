
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bike, Wrench, FileText, Menu, Search, LogOut, Loader2, User as UserIcon, BookOpenCheck } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface HeaderProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    onSearch: () => void;
    className?: string;
    activeFilter: 'shopping' | 'service' | null;
    onFilterChange: (filter: 'shopping' | 'service') => void;
    placeholderText: string;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchTermChange, onSearch, className, activeFilter, onFilterChange, placeholderText }) => {
  const pathname = usePathname();
  const isInfoActive = pathname.startsWith('/info');
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  }

  const UserMenu = () => {
    if (isUserLoading) {
      return <Button size="icon" variant="ghost" className="rounded-full h-10 w-10"><Loader2 className="h-5 w-5 animate-spin" /></Button>
    }
    if (!user) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" className="rounded-full h-10 w-10 p-0">
                <Link href="/login">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center p-1">
                    <Image key="force-reload-2" src="/images/icon-moncompte.png" alt="Mon compte" width={32} height={32} className="h-8 w-8 object-contain" />
                  </div>
                  <span className="sr-only">Mon compte</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mon compte</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
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
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/account">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Gérer mon compte</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }


  return (
    <header className={cn("bg-card p-2 text-foreground border-b border-border z-40", className)}>
      <div className="container mx-auto flex flex-col gap-1.5">
        <div className="flex items-center justify-between md:grid md:grid-cols-3">
          <div className="w-36 md:w-44 shrink-0 md:justify-self-start">
            <Link href="/">
              <LabelMotoLogo />
            </Link>
          </div>
          
          {/* Integrated Slogan in the middle row on Desktop */}
          <div className="hidden lg:flex items-center justify-center px-4">
            <p className="text-sm xl:text-base font-medium text-foreground text-center">
              Trouver une concession, un atelier ou un réparateur ? <span className="text-accent font-bold italic ml-1">Fini la galère.</span>
            </p>
          </div>

          <div className="flex items-center gap-2 justify-end md:justify-self-end">
            <Button
              variant="ghost"
              onClick={() => onFilterChange('shopping')}
              className={cn(
                "relative p-1 h-auto flex flex-col items-center gap-0.5 text-xs font-medium md:hidden",
                activeFilter === 'shopping' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Bike className="h-5 w-5" />
              <span>Concession</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => onFilterChange('service')}
              className={cn(
                "relative p-1 h-auto flex flex-col items-center gap-0.5 text-xs font-medium md:hidden",
                activeFilter === 'service' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Wrench className="h-5 w-5" />
              <span>Atelier</span>
            </Button>
            <div className="hidden md:flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Link href="/entretien">
                                    <BookOpenCheck className="h-6 w-6" />
                                    <span className="sr-only">Entretien & Révisions</span>
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Entretien & Révisions</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Link href="/info">
                                    <FileText className="h-6 w-6" />
                                    <span className="sr-only">Conseils pratiques</span>
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Conseils pratiques</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <UserMenu />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
            <nav className="hidden md:flex items-center justify-center gap-8">
                <Button
                    variant="ghost"
                    onClick={() => onFilterChange('shopping')}
                    className={cn(
                      "relative p-1 h-auto flex items-center gap-2 text-lg font-medium",
                      activeFilter === 'shopping' ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    <Bike className="h-6 w-6" />
                    <span>Concession</span>
                    {activeFilter === 'shopping' && <span className="absolute -bottom-1 h-1 w-full bg-brand rounded-full"></span>}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onFilterChange('service')}
                    className={cn(
                      "relative p-1 h-auto flex items-center gap-2 text-lg font-medium",
                      activeFilter === 'service' ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    <Wrench className="h-6 w-6" />
                    <span>Atelier</span>
                    {activeFilter === 'service' && <span className="absolute -bottom-1 h-1 w-full bg-brand rounded-full"></span>}
                  </Button>
            </nav>

            <div className="relative w-full max-lg mx-auto">
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
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 h-7 w-7 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full shadow"
                  onClick={onSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

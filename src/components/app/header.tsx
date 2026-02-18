
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bike, Wrench, FileText, Menu, Search, LogOut, Loader2 } from 'lucide-react';
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
      return <Button size="icon" variant="ghost" className="rounded-full h-12 w-12"><Loader2 className="h-6 w-6 animate-spin" /></Button>
    }
    if (!user) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" className="rounded-full h-12 w-12 p-0">
                <Link href="/login">
                  <Image src="/images/icon-moncompte.png" alt="Mon compte" width={48} height={48} className="h-12 w-12" />
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
           <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Mon Compte</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }


  return (
    <header className={cn("bg-card p-4 text-foreground border-b border-border z-40", className)}>
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-40 md:w-52 shrink-0">
            <Link href="/">
              <LabelMotoLogo />
            </Link>
          </div>
          
          {/* Mobile Nav */}
          <nav className="flex md:hidden items-start justify-center gap-2 flex-grow">
            <Button
              variant="ghost"
              onClick={() => onFilterChange('shopping')}
              className={cn(
                "relative p-1 h-auto flex flex-col items-center gap-1 text-xs font-semibold",
                activeFilter === 'shopping' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Bike className="h-6 w-6" />
              <span>Concession</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => onFilterChange('service')}
              className={cn(
                "relative p-1 h-auto flex flex-col items-center gap-1 text-xs font-semibold",
                activeFilter === 'service' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Wrench className="h-6 w-6" />
              <span>Atelier</span>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "relative p-1 h-auto flex flex-col items-center gap-1 text-xs font-semibold",
                isInfoActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Link href="/info">
                <FileText className="h-6 w-6" />
                <span>Conseils pratiques</span>
              </Link>
            </Button>
          </nav>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-grow">
            <Button
              variant="ghost"
              onClick={() => onFilterChange('shopping')}
              className={cn(
                "relative p-1 h-auto flex flex-col items-center gap-1 text-sm font-semibold",
                activeFilter === 'shopping' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Bike className="h-6 w-6" />
              <span>Concession</span>
              {activeFilter === 'shopping' && <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-brand rounded-full"></span>}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onFilterChange('service')}
              className={cn(
                "relative p-1 h-auto flex flex-col items-center gap-1 text-sm font-semibold",
                activeFilter === 'service' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Wrench className="h-6 w-6" />
              <span>Atelier</span>
               {activeFilter === 'service' && <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-brand rounded-full"></span>}
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "relative p-1 h-auto flex flex-col items-center gap-1 text-sm font-semibold",
                isInfoActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Link href="/info">
                <FileText className="h-6 w-6" />
                <span>Conseils pratiques</span>
                {isInfoActive && <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-brand rounded-full"></span>}
              </Link>
            </Button>
          </nav>
          
          <div className="flex items-center justify-end w-auto md:w-52">
            <UserMenu />
          </div>
        </div>
        
        <div className="relative w-full max-w-lg mx-auto">
          <Input
            type="search"
            placeholder={placeholderText}
            className="pr-14 h-12 text-base rounded-full shadow-sm bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900"
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
              className="absolute top-1/2 right-2 -translate-y-1/2 h-9 w-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full shadow"
              onClick={onSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

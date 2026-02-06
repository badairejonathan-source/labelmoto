
'use client';

import React from 'react';
import { Bike, Wrench, FileText, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MotoTrustLogo from './logo';
import { cn } from '@/lib/utils';

interface HeaderProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    onSearch: () => void;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchTermChange, onSearch, className }) => {
  return (
    <header className={cn("bg-card p-4 text-foreground border-b border-border z-40", className)}>
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-32 md:w-40 shrink-0">
            <MotoTrustLogo />
          </div>
          
          <nav className="hidden md:flex items-center justify-center gap-8 flex-grow">
            <Button variant="ghost" className="relative p-2 h-auto text-primary">
              <Bike className="h-7 w-7" />
              <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-primary rounded-full"></span>
            </Button>
            <Button variant="ghost" className="p-2 h-auto text-muted-foreground hover:text-primary">
              <Wrench className="h-7 w-7" />
            </Button>
            <Button variant="ghost" className="p-2 h-auto text-muted-foreground hover:text-primary">
              <FileText className="h-7 w-7" />
            </Button>
          </nav>
          
          <div className="flex items-center justify-end w-32 md:w-40">
            <Button size="icon" variant="ghost">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        <div className="relative w-full max-w-lg mx-auto">
          <Input
            type="search"
            placeholder="Achat, vente, accessoires par départements"
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
              className="absolute top-1/2 right-2 -translate-y-1/2 h-9 w-9 bg-red-500 hover:bg-red-600 text-white rounded-full shadow"
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

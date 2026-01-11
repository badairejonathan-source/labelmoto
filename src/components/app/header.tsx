
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, ListFilter, SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import locations from '@/data/locations.json';
import MotoTrustLogo from './logo';
import useWindowSize from '@/hooks/use-window-size';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

interface HeaderProps {
  
}

const Header: React.FC<HeaderProps> = () => {
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  return (
    <header className="flex items-center justify-between p-2 md:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <MotoTrustLogo />
      </div>
      
      {!isMobile && (
        <div className="flex flex-1 max-w-xl mx-4 space-x-2">
           <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un département" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-72">
                  {Object.keys(locations).map(dep => (
                    <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une ville" />
              </SelectTrigger>
              <SelectContent>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 justify-between">
                  Toutes marques
                  <ListFilter className="ml-2 h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Marques</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-72">
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Button size="icon" variant="outline">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

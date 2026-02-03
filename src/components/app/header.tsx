
'use client';

import React from 'react';
import { User, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotoTrustLogo from './logo';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Cette interface corrige l'erreur rouge "implicitly has an any type"
interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  return (
    <header className={cn(
      "bg-road p-2 md:p-4 text-primary-foreground border-b border-gray-200 dark:border-gray-700 z-[2000]"
    )}>
      <div className="relative z-10 flex items-center justify-between">
        
        {/* LOGO : On force sa taille ici (w-32 = mobile, w-48 = pc) */}
        <div className="flex items-center text-primary-foreground">
             <div className="w-32 md:w-48">
                <MotoTrustLogo />
             </div>
        </div>
        
        {/* Les éléments enfants (Barre de recherche, etc.) - Desktop */}
        {!isMobile && children}
        
        {/* Boutons Utilisateur & Filtres Mobile */}
        <div className="flex items-center space-x-2">
          {isMobile && (
            <Sheet modal={false}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-transparent hover:bg-primary/80 text-primary-foreground border-primary-foreground/50">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90vw] max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>
                    Ajustez les filtres pour affiner votre recherche de motos.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  {children}
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Button size="icon" variant="outline" className="bg-transparent hover:bg-primary/80 text-primary-foreground border-primary-foreground/50">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

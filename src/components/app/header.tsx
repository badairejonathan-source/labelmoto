'use client';

import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotoTrustLogo from './logo';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';

interface HeaderProps {
  children?: React.ReactNode;
}

function Header({ children }): React.JSX.Element {
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  return (
    <header className={cn(
      "bg-road p-2 md:p-4 text-primary-foreground border-b border-gray-200 dark:border-gray-700 z-30"
    )}>
      <div className="relative z-10 flex items-center justify-between">

        {/* C'est ICI qu'on place le logo, à l'intérieur du return */}
        <div className="flex items-center text-primary-foreground">
          <div className="w-32 md:w-48"> {/* Le code pour contrôler la taille */}
            <MotoTrustLogo />
          </div>
        </div>

        {children}

        <div className="flex items-center space-x-2">
          <Button size="icon" variant="outline" className="bg-transparent hover:bg-primary/80 text-primary-foreground border-primary-foreground/50">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;

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

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  return (
    <header className={cn("flex items-center justify-between p-2 md:p-4 bg-primary text-primary-foreground border-b border-gray-200 dark:border-gray-700",
      "text-sidebar-foreground",
    )}>
      <div className="flex items-center">
        <MotoTrustLogo className="[&>path]:stroke-primary-foreground"/>
      </div>
      
      {children}
      
      <div className="flex items-center space-x-2">
        <Button size="icon" variant="outline" className="bg-primary hover:bg-primary/80 text-primary-foreground border-primary-foreground/50">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

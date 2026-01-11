
'use client';

import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotoTrustLogo from './logo';
import useWindowSize from '@/hooks/use-window-size';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  return (
    <header className="flex items-center justify-between p-2 md:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <MotoTrustLogo />
      </div>
      
      {children}
      
      <div className="flex items-center space-x-2">
        <Button size="icon" variant="outline">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

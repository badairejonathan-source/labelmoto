'use client';

import React from 'react';
import { Search, User, List, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MotoTrustLogo = () => (
  <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5C9.72 5 1.5 12.3333 1.5 21.6667C1.5 31 9.72 38.3333 20 38.3333C30.28 38.3333 38.5 31 38.5 21.6667V11.6667" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 25.8333C22.2962 25.8333 24.1667 23.9628 24.1667 21.6667C24.1667 19.3705 22.2962 17.5 20 17.5C17.7038 17.5 15.8333 19.3705 15.8333 21.6667C15.8333 23.9628 17.7038 25.8333 20 25.8333Z" stroke="#F97316" strokeWidth="3"/>
    <text x="48" y="22" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="bold" fill="#0A0A0A">MOTO</text>
    <text x="95" y="22" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="bold" fill="#F97316">TRUST</text>
    <text x="48" y="35" fontFamily="Inter, sans-serif" fontSize="8" fill="#6B7280">TROUVE TA CONCESS</text>
  </svg>
);

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <MotoTrustLogo />
      </div>
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Rechercher un nom, une ville, un département..."
            className="pl-10 w-full"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline">
          <List className="mr-2 h-4 w-4" />
          Liste
        </Button>
        <Button variant="default">
          <Map className="mr-2 h-4 w-4" />
          Carte
        </Button>
        <Button size="icon" variant="outline">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

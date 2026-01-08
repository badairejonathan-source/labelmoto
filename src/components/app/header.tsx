
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, ListFilter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import locations from '@/data/locations.json';

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
  onDepartmentChange: (department: string) => void;
  onCityChange: (city: string) => void;
  availableBrands: string[];
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onDepartmentChange, onCityChange, availableBrands, selectedBrands, onBrandChange }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');

  const departments = Object.keys(locations);

  useEffect(() => {
    if (selectedDepartment) {
      setCities((locations as any)[selectedDepartment]?.cities || []);
      setSelectedCity(''); // Reset city when department changes
      onCityChange('');
    } else {
      setCities([]);
    }
    onDepartmentChange(selectedDepartment);
  }, [selectedDepartment, onDepartmentChange, onCityChange]);

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
  };
  
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    onCityChange(value);
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <MotoTrustLogo />
      </div>
      <div className="flex-1 max-w-xl mx-4 flex space-x-2">
        <Select onValueChange={handleDepartmentChange} value={selectedDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un département" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(dep => (
              <SelectItem key={dep} value={dep}>{dep}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleCityChange} value={selectedCity} disabled={!selectedDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une ville" />
          </SelectTrigger>
          <SelectContent>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              {selectedBrands.length > 0 ? `${selectedBrands.length} marque(s)` : 'Toutes marques'}
              <ListFilter className="ml-2 h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Marques</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
              {availableBrands.map(brand => (
                <DropdownMenuCheckboxItem
                  key={brand}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => onBrandChange(brand)}
                >
                  {brand}
                </DropdownMenuCheckboxItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-2">
        <Button size="icon" variant="outline">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

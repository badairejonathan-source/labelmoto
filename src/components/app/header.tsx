
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, ListFilter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import locations from '@/data/locations.json';
import MotoTrustLogo from './logo';


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

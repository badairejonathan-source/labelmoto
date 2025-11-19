'use client';

import { useState } from 'react';
import { Menu, DraftingCompass, Search, X } from 'lucide-react';
import { MOCK_ADVICE_POSTS, BRANDS, SERVICES } from '@/lib/constants';
import type { Brand, Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdSpace } from '@/components/app/ad-space';
import { AdviceList } from '@/components/app/advice-list';
import { MotoTrustLogo } from '@/components/app/icons';
import { Locator } from '@/components/app/locator';

type View = 'LOCATOR' | 'ADVICE';
type Filters = {
  brand: Brand | 'ALL';
  service: Service | 'ALL';
};

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('LOCATOR');
  const [filters, setFilters] = useState<Filters>({ brand: 'ALL', service: 'ALL' });

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <header className="flex items-center justify-between p-4 border-b shrink-0 z-20 bg-background/80 backdrop-blur-sm">
        <MotoTrustLogo />
        <nav className="hidden md:flex items-center gap-2">
          <Button variant={currentView === 'LOCATOR' ? 'secondary' : 'ghost'} onClick={() => setCurrentView('LOCATOR')}>
            <Search className="mr-2 h-4 w-4" /> Concessions
          </Button>
          <Button variant={currentView === 'ADVICE' ? 'secondary' : 'ghost'} onClick={() => setCurrentView('ADVICE')}>
            <DraftingCompass className="mr-2 h-4 w-4" /> Conseils
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline">Espace Pro</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Button variant={currentView === 'LOCATOR' ? 'secondary' : 'ghost'} onClick={() => { setCurrentView('LOCATOR'); }}>
                  <Search className="mr-2 h-4 w-4" /> Concessions
                </Button>
                <Button variant={currentView === 'ADVICE' ? 'secondary' : 'ghost'} onClick={() => { setCurrentView('ADVICE'); }}>
                  <DraftingCompass className="mr-2 h-4 w-4" /> Conseils
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Filter Bar */}
      {currentView === 'LOCATOR' && (
        <div className="p-2 border-b flex flex-col md:flex-row gap-2 items-center z-10 bg-background/80 backdrop-blur-sm">
          <p className="font-semibold text-sm hidden md:block">Filtres:</p>
          <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
             <Select
              value={filters.brand}
              onValueChange={(value: Brand | 'ALL') => setFilters(prev => ({ ...prev, brand: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Marque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toutes les marques</SelectItem>
                {BRANDS.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.service}
              onValueChange={(value: Service | 'ALL') => setFilters(prev => ({ ...prev, service: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les services</SelectItem>
                {SERVICES.map(service => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" onClick={() => setFilters({ brand: 'ALL', service: 'ALL' })} className="hidden md:flex">
            <X className="mr-2 h-4 w-4" /> Effacer
          </Button>
        </div>
      )}

      {currentView === 'LOCATOR' ? <Locator filters={filters} /> : <AdviceList posts={MOCK_ADVICE_POSTS} />}
      {currentView === 'ADVICE' && <AdSpace type="banner" />}
    </div>
  );
}

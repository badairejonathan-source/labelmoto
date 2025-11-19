'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Menu, Star, DraftingCompass, Wrench, Bike, MapPin, Phone, Clock, Warehouse, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_DEALERSHIPS, MOCK_ADVICE_POSTS, BRANDS, SERVICES } from '@/lib/constants';
import type { Brand, Service, Dealership } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

import { AdSpace } from '@/components/app/ad-space';
import { AdviceList } from '@/components/app/advice-list';
import { DealershipCard } from '@/components/app/dealership-card';
import { StickyCTA } from '@/components/app/sticky-cta';
import { MotoTrustLogo } from '@/components/app/icons';

const MapComponent = dynamic(() => import('@/components/app/map-component'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <Bike className="h-16 w-16 animate-pulse text-primary/50" />
    </div>
  ),
});

type View = 'LOCATOR' | 'ADVICE';
type Filters = {
  brand: Brand | 'ALL';
  service: Service | 'ALL';
};

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('LOCATOR');
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_DEALERSHIPS[0]?.id || null);
  const [filters, setFilters] = useState<Filters>({ brand: 'ALL', service: 'ALL' });
  const [isMobileListOpen, setMobileListOpen] = useState(false);
  const isMobile = useIsMobile();

  const filteredDealerships = useMemo(() => {
    return MOCK_DEALERSHIPS.filter(dealer => {
      const brandMatch = filters.brand === 'ALL' || dealer.brand === filters.brand;
      const serviceMatch = filters.service === 'ALL' || dealer.services.includes(filters.service);
      return brandMatch && serviceMatch;
    });
  }, [filters]);

  const selectedDealership = useMemo(() => {
    return MOCK_DEALERSHIPS.find(d => d.id === selectedId);
  }, [selectedId]);

  const handleSelectDealership = (id: string) => {
    setSelectedId(id);
    if (isMobile) {
      setMobileListOpen(false);
    }
  };

  const LocatorView = () => (
    <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
      {/* Desktop Sidebar / Mobile Hidden List */}
      <aside className="hidden md:flex md:w-1/3 md:max-w-md flex-col border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Concessions</h2>
          <p className="text-sm text-muted-foreground">{filteredDealerships.length} résultats</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {filteredDealerships.slice(0, 1).map((dealer) => (
              <DealershipCard
                key={dealer.id}
                dealership={dealer}
                isSelected={selectedId === dealer.id}
                onClick={() => handleSelectDealership(dealer.id)}
              />
            ))}
            {filteredDealerships.length > 0 && <AdSpace type="in-list" />}
            {filteredDealerships.slice(1).map((dealer) => (
              <DealershipCard
                key={dealer.id}
                dealership={dealer}
                isSelected={selectedId === dealer.id}
                onClick={() => handleSelectDealership(dealer.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Map Area */}
      <main className="flex-1 relative">
        <MapComponent
          dealerships={filteredDealerships}
          selectedId={selectedId}
          onMarkerClick={handleSelectDealership}
        />
      </main>

      {/* Mobile Drawer */}
      {isMobile && (
        <Sheet open={isMobileListOpen} onOpenChange={setMobileListOpen}>
          <SheetTrigger asChild>
            <Button
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 shadow-lg rounded-full"
              size="lg"
            >
              {isMobileListOpen ? <ChevronDown /> : <ChevronUp />}
              {isMobileListOpen ? 'Cacher la liste' : 'Voir la liste'}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Concessions ({filteredDealerships.length})</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {filteredDealerships.slice(0, 1).map((dealer) => (
                  <DealershipCard
                    key={dealer.id}
                    dealership={dealer}
                    isSelected={selectedId === dealer.id}
                    onClick={() => handleSelectDealership(dealer.id)}
                  />
                ))}
                {filteredDealerships.length > 0 && <AdSpace type="in-list" />}
                {filteredDealerships.slice(1).map((dealer) => (
                  <DealershipCard
                    key={dealer.id}
                    dealership={dealer}
                    isSelected={selectedId === dealer.id}
                    onClick={() => handleSelectDealership(dealer.id)}
                  />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="p-4 border-t">
              <Button onClick={() => setMobileListOpen(false)} className="w-full">
                Fermer
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
      <StickyCTA />
    </div>
  );

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

      {currentView === 'LOCATOR' ? <LocatorView /> : <AdviceList posts={MOCK_ADVICE_POSTS} />}
      {currentView === 'ADVICE' && <AdSpace type="banner" />}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Bike, ChevronDown, ChevronUp } from 'lucide-react';
import { type Dealership, Brand, Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdSpace } from '@/components/app/ad-space';
import { DealershipCard } from '@/components/app/dealership-card';
import { StickyCTA } from '@/components/app/sticky-cta';
import { MOCK_DEALERSHIPS } from '@/lib/constants';

const MapComponent = dynamic(() => import('@/components/app/map-component'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <Bike className="h-16 w-16 animate-pulse text-primary/50" />
    </div>
  ),
});

interface LocatorProps {
  filters: {
    brand: Brand | 'ALL';
    service: Service | 'ALL';
  };
}

export function Locator({ filters }: LocatorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_DEALERSHIPS[0]?.id || null);
  const [isMobileListOpen, setMobileListOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const filteredDealerships = useMemo(() => {
    return MOCK_DEALERSHIPS.filter(dealer => {
      const brandMatch = filters.brand === 'ALL' || dealer.brand === filters.brand;
      const serviceMatch = filters.service === 'ALL' || dealer.services.includes(filters.service);
      return brandMatch && serviceMatch;
    });
  }, [filters]);

  const handleSelectDealership = (id: string) => {
    setSelectedId(id);
    if (isMobile) {
      setMobileListOpen(false);
    }
  };

  return (
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
}

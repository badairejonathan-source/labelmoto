
'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Map as MapIcon, List, ChevronDown, Zap, ArrowRight } from 'lucide-react';
import { MOCK_DEALERSHIPS } from '@/lib/constants';
import { Brand, Service, Dealership } from '@/lib/types';
import { DealershipCard } from './dealership-card';
import { AdSpace } from './ad-space';

const MapComponent = dynamic(() => import('@/components/app/map-component'), {
  ssr: false,
});

type FilterState = { brand: Brand | 'ALL'; service: Service | 'ALL'; };

const StickyCTA = () => (
    <div className="p-2 border-t border-gray-200 bg-white z-20 shrink-0">
      <div className="relative overflow-hidden rounded-lg bg-gray-900 p-2.5 flex items-center justify-between shadow-md cursor-pointer group hover:bg-gray-800 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-1.5 rounded text-white shrink-0">
            <Zap size={16} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-white leading-none">Assurance Moto</h3>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 group-hover:text-gray-300">Devis gratuit en 2 min</span>
          </div>
        </div>
        <button className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded shadow-sm flex items-center gap-1 group-hover:scale-105 transition-transform whitespace-nowrap">Simuler <ArrowRight size={12} /></button>
      </div>
    </div>
);

const FilterSection = ({ filters, setFilters, isMobile = false }: { filters: FilterState, setFilters: React.Dispatch<React.SetStateAction<FilterState>>, isMobile?: boolean }) => (
    <div className={`${isMobile ? 'grid grid-cols-2 gap-3 p-3 bg-white border-b border-gray-100' : 'flex flex-col gap-3 p-4 border-b border-gray-200 bg-gray-50'}`}>
       <div className="relative">
          <select className="w-full bg-white text-gray-700 font-medium text-sm pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:border-red-600 outline-none" value={filters.brand} onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value as Brand | 'ALL' }))}>
            <option value="ALL">Toutes Marques</option>{Object.values(Brand).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
       </div>
       <div className="relative">
          <select className="w-full bg-white text-gray-700 font-medium text-sm pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:border-red-600 outline-none" value={filters.service} onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value as Service | 'ALL' }))}>
            <option value="ALL">Tous Services</option>{Object.values(Service).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
       </div>
    </div>
  );

export function Locator() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isMobileListOpen, setIsMobileListOpen] = useState(true);
    const [filters, setFilters] = useState<FilterState>({ brand: 'ALL', service: 'ALL' });

    const filteredDealerships = useMemo(() => {
        return MOCK_DEALERSHIPS.filter(dealer => {
          const brandMatch = filters.brand === 'ALL' || dealer.brand === filters.brand;
          const serviceMatch = filters.service === 'ALL' || dealer.services.includes(filters.service as Service);
          return brandMatch && serviceMatch;
        });
      }, [filters]);

    const handleSelect = (id: string) => { setSelectedId(id); if (window.innerWidth < 768) { setIsMobileListOpen(true); }};
  
    return (
        <div className="flex-1 flex relative overflow-hidden">
            <div className="hidden md:flex md:w-1/3 lg:w-1/4 flex-col bg-white border-r border-gray-200 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] h-full">
              <FilterSection filters={filters} setFilters={setFilters} />
              <div className="p-4 border-b border-gray-100 text-gray-500 text-sm font-medium flex justify-between items-center bg-white shrink-0"><span>{filteredDealerships.length} concession(s)</span><span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Résultats</span></div>
              <div className="overflow-y-auto flex-1 no-scrollbar">
                <div className="p-4 border-b border-gray-100 bg-yellow-50">
                   <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Sponsorisé</span><span className="text-[10px] text-yellow-600 bg-yellow-100 px-1 rounded">Ad</span></div>
                   <div className="font-bold text-gray-900">Assurance Moto Pro</div><div className="text-xs text-gray-600 mt-1 mb-2">Économisez jusqu'à 40% sur votre assurance.</div>
                   <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs font-bold py-2 rounded transition-colors">Voir l'offre</button>
                </div>
                {filteredDealerships.map(dealer => (<DealershipCard key={dealer.id} data={dealer} isSelected={selectedId === dealer.id} onClick={() => handleSelect(dealer.id)}/>))}
                {filteredDealerships.length === 0 && (<div className="p-8 text-center text-gray-400">Aucun résultat.</div>)}
                <div className="p-4"><AdSpace format="rectangle" className="rounded-lg" label="Partenaire Local" /></div>
              </div>
              <StickyCTA />
            </div>

            <div className="flex-1 relative h-full w-full bg-gray-100">
              <MapComponent dealerships={filteredDealerships} selectedId={selectedId} onSelect={handleSelect} />
              <button onClick={() => setIsMobileListOpen(!isMobileListOpen)} className="md:hidden absolute top-4 right-4 z-[400] bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all">{isMobileListOpen ? <MapIcon size={24} /> : <List size={24} />}</button>
            </div>

            <div className={`md:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out z-[500] flex flex-col rounded-t-2xl ${isMobileListOpen ? 'translate-y-0 h-[80%]' : 'translate-y-[calc(100%-0px)] h-0'}`}>
               <div className="w-full flex justify-center p-3 cursor-pointer bg-white rounded-t-2xl border-b border-gray-100 shrink-0" onClick={() => setIsMobileListOpen(!isMobileListOpen)}><div className="w-12 h-1.5 bg-gray-300 rounded-full"></div></div>
               <FilterSection filters={filters} setFilters={setFilters} isMobile={true} />
               <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0"><span className="text-sm text-gray-700 font-bold">{filteredDealerships.length} résultats</span><button onClick={() => setIsMobileListOpen(false)} className="text-red-600 text-sm font-medium">Masquer</button></div>
               <div className="overflow-y-auto flex-1 bg-gray-50">
                <div className="mx-4 mt-4 mb-2"><AdSpace format="banner" className="h-16 rounded" label="Sponsor Mobile" /></div>
                {filteredDealerships.map(dealer => (<DealershipCard key={dealer.id} data={dealer} isSelected={selectedId === dealer.id} onClick={() => handleSelect(dealer.id)}/>))}
                <div className="h-4"></div>
               </div>
               <StickyCTA />
            </div>
        </div>
    );
}

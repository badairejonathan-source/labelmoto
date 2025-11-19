
'use client';

import React from 'react';
import { AdviceList } from '@/components/app/advice-list';
import { AdSpace } from '@/components/app/ad-space';
import { MotoTrustLogo } from '@/components/app/icons';
import { Locator } from '@/components/app/locator';
import { MOCK_ADVICE_POSTS } from '@/lib/constants';
import { BookOpen, Layout, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/app/map-component'), {
  ssr: false,
});

type ViewMode = 'LOCATOR' | 'ADVICE';

const Home: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<ViewMode>('LOCATOR');

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 overflow-hidden font-sans">
      <header className="bg-white border-b border-gray-200 z-30 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div onClick={() => setCurrentView('LOCATOR')}>
              <MotoTrustLogo />
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
               <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 self-start md:self-auto order-2 md:order-1">
                  <button onClick={() => setCurrentView('LOCATOR')} className={cn('flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all', currentView === 'LOCATOR' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}><Layout size={16} />Concessions</button>
                  <button onClick={() => setCurrentView('ADVICE')} className={cn('flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all', currentView === 'ADVICE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}><BookOpen size={16} />Conseils</button>
               </div>
               <button className="hidden lg:flex order-1 md:order-2 items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm border border-gray-800"><Briefcase size={16} /><span>Espace Pro</span></button>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border-b border-gray-200 py-2"><div className="max-w-7xl mx-auto px-4"><AdSpace className="h-16 w-full rounded" label="Publicité Top Page" /></div></div>
      </header>

      <main className="flex-1 flex relative overflow-hidden">
        <div style={{ display: currentView === 'ADVICE' ? 'block' : 'none' }} className="w-full h-full">
          <AdviceList articles={MOCK_ADVICE_POSTS} />
        </div>
        <div style={{ display: currentView === 'LOCATOR' ? 'flex' : 'none' }} className="w-full h-full">
          <Locator />
        </div>
      </main>
    </div>
  );
};
export default Home;

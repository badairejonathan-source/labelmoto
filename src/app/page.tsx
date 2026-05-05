'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import Header from '@/components/app/header';
import placeholderData from '@/app/lib/placeholder-images.json';
import { useRouter } from 'next/navigation';

// Chargement dynamique des sections sous la ligne de flottaison
// ssr: true permet de conserver le SEO tout en séparant le JS du bundle initial
const HomepageDeferred = dynamic(() => import('@/components/app/homepage-deferred'), {
    loading: () => <div className="min-h-screen animate-pulse bg-muted/10 rounded-[2.5rem] mt-16" />,
    ssr: true
});

export default function LandingPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const { hero } = placeholderData.landingPage;

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
        } else {
            router.push('/map');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header 
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearch={handleSearch}
                placeholderText="Recherche par departement, ville, marque, nom..."
            />
            <main className="py-4 md:py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* Hero Section - Gardée dans le bundle principal car c'est le LCP */}
                <div className="relative mb-24 md:mb-48 overflow-visible">
                    <div className="absolute inset-0 rounded-[2.5rem] border-2 border-brand bg-black overflow-hidden shadow-2xl z-0">
                         <Image 
                            src="/images/motardnuitlandinfpage1.webp" 
                            alt="Label Moto Hero" 
                            fill 
                            className="object-cover opacity-40" 
                            priority 
                            fetchPriority="high"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1280px"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white p-6 md:p-12 pt-16 md:pt-20 min-h-[320px] md:min-h-[480px]">
                        <div className="md:w-1/2 text-center md:text-left relative z-20">
                            <h1 className="text-xl md:text-5xl font-extrabold tracking-tight mb-4 md:mb-6 uppercase leading-[1.1]" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                                Du A2 au motard expérimenté : trouvez les professionnels les plus proches en quelques clics
                            </h1>
                            <p className="text-[10px] md:text-lg max-w-lg mx-auto md:mx-0 mb-4 text-gray-200 font-medium leading-relaxed" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                Fini les dizaines d'onglets ouverts. Label Moto regroupe tout l’univers deux-roues au même endroit pour vous laisser plus de temps sur la route.
                            </p>
                        </div>
                         <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10">
                             <div className="relative transform translate-y-12 md:translate-y-20 md:translate-x-12 lg:translate-x-16 group">
                                <Link href="/map" className="block transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative w-44 h-44 md:w-[330px] md:h-[330px]">
                                        <Image 
                                            src={hero.mapPreview.src} 
                                            alt="Aperçu de la carte" 
                                            fill 
                                            className="rounded-2xl border-4 border-white shadow-2xl object-cover" 
                                            sizes="(max-width: 768px) 176px, 330px" 
                                        />
                                    </div>
                                </Link>
                                <div className="absolute -left-6 md:-left-24 top-1/2 -translate-y-1/2 z-50">
                                    <Link href="/map">
                                        <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-[8px] md:text-base px-5 md:px-8 py-3 md:py-6 rounded-full shadow-2xl border-2 md:border-4 border-white whitespace-nowrap transition-transform hover:scale-110 tracking-widest">
                                            Explorer la carte
                                        </Button>
                                    </Link>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Toutes les sections suivantes sont chargées dans un bundle séparé */}
                <HomepageDeferred />
              </div>
            </main>
        </div>
    );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import HeroSearch from '@/components/app/hero-search';
import placeholderData from '@/app/lib/placeholder-images.json';
import { Skeleton } from '@/components/ui/skeleton';

const HomepageSkeleton = () => (
    <div className="space-y-24 mt-16 md:mt-32">
        <div className="bg-muted/10 rounded-[2.5rem] h-[300px] animate-pulse" />
        <div className="space-y-8">
            <Skeleton className="h-10 w-48 rounded-lg ml-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Skeleton className="aspect-video rounded-[2.5rem]" />
                <Skeleton className="aspect-video rounded-[2.5rem]" />
                <Skeleton className="aspect-video rounded-[2.5rem]" />
            </div>
        </div>
        <div className="bg-muted/10 rounded-[2.5rem] h-[500px] animate-pulse" />
    </div>
);

const HomepageDeferred = dynamic(() => import('@/components/app/homepage-deferred'), {
    loading: () => <HomepageSkeleton />,
    ssr: true
});

export default function LandingPage() {
    const { hero } = placeholderData.landingPage;

    return (
        <div className="min-h-screen bg-background">
            <HeroSearch />

            {/* Filigrane Logo */}
            <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                <Image
                    src="/images/logo-moto.webp"
                    alt=""
                    width={600}
                    height={192}
                    className="opacity-[0.03] rotate-[-15deg]"
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <main className="py-4 md:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="relative mb-24 md:mb-48 overflow-visible min-h-[320px] md:min-h-[480px]">
                    <div className="absolute inset-0 rounded-[2.5rem] border-2 border-brand bg-black overflow-hidden shadow-2xl z-0">
                         <Image
                            src="/images/motardnuitlandinfpage1.webp"
                            alt="Label Moto : plateforme nationale de recherche de concessions et ateliers moto en France"
                            fill
                            className="object-cover opacity-40"
                            priority
                            fetchPriority="high"
                            decoding="async"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1280px"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white p-6 md:p-12 pt-16 md:pt-20">
                        <div className="md:w-1/2 text-center md:text-left relative z-20">
                            <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-3 md:mb-4 uppercase leading-[1.1]" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                                L&apos;annuaire national des professionnels moto
                            </h1>
                            {/* Sous-titre avec chiffres clés */}
                            <p className="text-white/80 text-sm md:text-lg font-bold mb-4 md:mb-6" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                5 400+ professionnels vérifiés &bull; 96 départements &bull; Gratuit
                            </p>
                            {/* CTA principal unique */}
                            <Link href="/map" className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 text-white font-black uppercase text-sm px-8 py-4 rounded-full shadow-2xl tracking-widest transition-all hover:scale-105 active:scale-95 border-2 border-white/20 w-full sm:w-auto">
                                🔍 Trouver un garage près de moi
                            </Link>
                            <p className="text-[11px] md:text-lg max-w-lg mx-auto md:mx-0 mb-4 text-gray-200 font-medium leading-relaxed" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                Label Moto centralise les meilleures concessions, ateliers et relais motards de France. Trouvez un expert de confiance et gérez votre budget entretien gratuitement.
                            </p>
                        </div>
                         <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10">
                             <div className="relative transform translate-y-12 md:translate-y-20 md:translate-x-12 lg:translate-x-16 group">
                                <Link href="/map" className="block transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative w-[226px] h-[226px] md:w-[380px] md:h-[380px]">
                                        <Image
                                            src={hero.mapPreview.src}
                                            alt="Carte de France interactive des professionnels moto"
                                            fill
                                            className="rounded-2xl border-4 border-white shadow-2xl object-cover"
                                            sizes="(max-width: 768px) 226px, 380px"
                                            decoding="async"
                                        />
                                    </div>
                                </Link>
                                <div className="absolute -left-6 md:-left-24 top-1/2 -translate-y-1/2 z-50">
                                    <Link href="/map">
                                        <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-[8px] md:text-base px-5 md:px-8 py-3 md:py-6 rounded-full shadow-2xl border-2 md:border-4 border-white whitespace-nowrap transition-transform hover:scale-110 tracking-widest">
                                            explorer la carte
                                        </Button>
                                    </Link>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <HomepageDeferred />
              </div>
            </main>
        </div>
    );
}

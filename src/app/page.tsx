import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import HeroSearch from '@/components/app/hero-search';
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
                <div className="relative mb-8 md:mb-16 rounded-[2.5rem] border-2 border-brand bg-black overflow-hidden shadow-2xl min-h-[280px] md:min-h-[360px]">
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
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-white p-6 md:p-12">
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-3 uppercase leading-[1.1]" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                                L&apos;annuaire national des professionnels moto
                            </h1>
                            <p className="text-white/80 text-sm md:text-base font-bold mb-5" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                5 400+ professionnels vérifiés &bull; 96 départements &bull; Gratuit
                            </p>
                            {/* CTA visible uniquement sur desktop */}
                            <div className="hidden md:block">
                                <Link href="/map" className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 text-white font-black uppercase text-sm px-8 py-4 rounded-full shadow-2xl tracking-widest transition-all hover:scale-105 active:scale-95 border-2 border-white/20">
                                    🔍 Trouver un garage près de moi
                                </Link>
                            </div>
                        </div>
                        {/* Aperçu carte desktop */}
                        <div className="shrink-0 hidden md:block">
                            <Link href="/map" className="block hover:scale-105 transition-transform duration-300">
                                <div className="relative w-[280px] h-[200px]">
                                    <Image
                                        src="/images/map-preview-hero.webp"
                                        alt="Carte de France interactive des professionnels moto"
                                        fill
                                        className="rounded-2xl border-4 border-white shadow-2xl object-cover object-top"
                                        sizes="280px"
                                        decoding="async"
                                    />
                                </div>
                            </Link>
                        </div>
                        {/* Aperçu carte mobile — carré bords orange, CTA Trouver qui chevauche en bas */}
                        <div className="relative w-full md:hidden mt-2 pb-6">
                            <div className="relative w-full aspect-square max-w-[260px] mx-auto">
                                <Image
                                    src="/images/map-preview-hero.webp"
                                    alt="Carte de France interactive des professionnels moto"
                                    fill
                                    className="rounded-[1.5rem] border-4 border-brand shadow-2xl object-cover object-top"
                                    sizes="260px"
                                    decoding="async"
                                />
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 w-full px-4">
                                <Link href="/map" className="flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 text-white font-black uppercase text-sm px-6 py-4 rounded-full shadow-2xl tracking-widest border-2 border-white w-full transition-all hover:scale-105 active:scale-95">
                                    🔍 Trouver un garage près de moi
                                </Link>
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

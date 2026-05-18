'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, MapPin, Search } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

  return (
    <div className="min-h-screen relative bg-background">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        onFilterChange={handleFilterChange}
        placeholderText="Recherche..."
      />
      
      {/* Filigrane Logo */}
      <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
        <Image src="/images/logo-moto.webp" alt="" width={600} height={192} className="opacity-[0.03] rotate-[-15deg]" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-4xl mx-auto pt-24">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 font-black uppercase text-[10px] tracking-widest transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <div className="space-y-12">
            <section className="space-y-6">
                <h1 className="text-4xl md:text-7xl font-black text-foreground uppercase tracking-tighter leading-[0.9] mb-4">
                  Label Moto : la plateforme nationale de référence
                </h1>
                <p className="text-xl md:text-2xl font-bold text-brand italic border-l-4 border-brand pl-6 py-2">
                  Simplifier la vie des motards en centralisant les meilleurs services de France.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-brand">
                        <Search className="h-6 w-6" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Notre Identité</h2>
                    </div>
                    <p className="text-lg font-medium leading-relaxed">
                        Label Moto n'est pas un garage, ni une marque de moto. Nous sommes un **annuaire numérique indépendant** et une plateforme de ressources dédiée à la communauté motarde en France.
                    </p>
                    <p className="text-lg font-medium leading-relaxed">
                        Notre mission est de supprimer les barrières entre les motards et les bons professionnels. Que vous cherchiez votre prochaine machine, un atelier pour une révision ou un hôtel labellisé "relais motard", nous centralisons tout sur une carte interactive unique.
                    </p>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-brand">
                        <ShieldCheck className="h-6 w-6" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Notre Engagement</h2>
                    </div>
                    <p className="text-lg font-medium leading-relaxed">
                        Nous luttons contre les informations obsolètes et les annuaires pollués par la publicité. Sur Label Moto, les données sont vérifiées, les fiches sont propres et les avis sont réels.
                    </p>
                    <p className="text-lg font-medium leading-relaxed">
                        En tant que plateforme à but non lucratif, notre seule priorité est la pertinence de l'information pour le pilote.
                    </p>
                </section>
            </div>

            <section className="bg-muted/30 p-8 md:p-12 rounded-[3rem] border-2 border-dashed border-muted-foreground/10 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <MapPin className="h-8 w-8 text-brand" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Un rayonnement National</h2>
                </div>
                <p className="text-lg font-medium leading-relaxed">
                    De Lille à Marseille, de Brest à Strasbourg, Label Moto couvre l'intégralité du territoire français. Nous référençons plus de 3000 établissements, incluant les plus grandes marques (Yamaha, Honda, BMW, Kawasaki...) mais aussi les préparateurs indépendants et les associations de passionnés.
                </p>
                <div className="pt-6">
                    <Link href="/map" className="bg-brand text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-transform inline-block">
                        Explorer la carte de France
                    </Link>
                </div>
            </section>

            <div className="flex items-center pt-8 border-t border-dashed">
                <p className="font-black text-2xl uppercase tracking-tighter italic">L'équipe Label Moto</p>
                <Image src="/images/Stamp-LM.webp" alt="" width={100} height={100} className="opacity-40 -ml-4 -rotate-12" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

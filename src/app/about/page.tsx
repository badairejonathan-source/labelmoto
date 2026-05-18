'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

/**
 * Metadata est exportée ici pour Next.js (Server Component wrapper par défaut)
 */
export const metadata = {
  title: "À propos de Label Moto : notre mission et notre histoire",
  description: "Découvrez le projet Label Moto : une plateforme à but non lucratif créée par des passionnés pour aider les motards à trouver les meilleurs experts partout en France.",
};

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
    <div className="min-h-screen relative">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        onFilterChange={handleFilterChange}
        placeholderText="Recherche par departement, ville, marque, nom..."
      />
      
      {/* Filigrane Logo */}
      <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
        <Image src="/images/logo-moto.webp" alt="" width={600} height={192} className="opacity-[0.03] rotate-[-15deg]" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-4xl mx-auto pt-24">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-none mb-8">À propos de Label Moto</h1>
            
            <h2 className="text-2xl font-black uppercase tracking-tighter text-brand mt-8">Notre Mission</h2>
            <p className="text-lg font-medium">Chez Label Moto, notre mission est simple : simplifier la vie des motards. Nous savons que trouver une concession de confiance, un atelier compétent ou des conseils fiables peut être un parcours du combattant. C'est pourquoi nous avons créé une plateforme unique qui rassemble tout ce dont vous avez besoin pour vivre votre passion à fond, sans les tracas.</p>
            <p className="text-lg font-medium">Nous nous engageons à fournir des informations transparentes, à jour et vérifiées pour vous aider à prendre les meilleures décisions, que vous cherchiez à acheter votre prochaine moto, à l'entretenir ou simplement à trouver l'inspiration pour votre prochain road-trip.</p>

            <h2 className="text-2xl font-black uppercase tracking-tighter text-brand mt-8">Notre Histoire</h2>
            <p className="text-lg font-medium">Label Moto est né de la frustration de passionnés de deux-roues, fatigués de passer des heures à chercher des informations éparpillées sur le web. L'idée était de créer un annuaire intelligent et une communauté où chaque motard, du débutant au plus expérimenté, pourrait trouver sa route... et sa concession.</p>
            <p className="text-lg font-medium">Aujourd'hui, nous sommes fiers de connecter des milliers de motards avec les meilleurs professionnels de France, et de proposer des articles et des guides pour nourrir votre passion au quotidien.</p>

            <h2 className="text-2xl font-black uppercase tracking-tighter text-brand mt-8">Notre Vision</h2>
            <p className="text-lg font-medium">Nous rêvons d'un monde où chaque motard a un accès facile et fiable à des services de qualité. Nous continuons d'innover pour améliorer notre plateforme, en nous basant sur les retours de notre communauté. Notre objectif est de devenir le compagnon de route digital indispensable pour tous les amoureux de la moto en France.</p>
            <p className="text-lg font-medium">Rejoignez-nous dans cette aventure et contribuez à bâtir la plateforme de référence pour tous les passionnés de deux-roues.</p>
            <div className="flex items-center mt-12 pt-8 border-t border-dashed">
                <p className="font-black text-2xl uppercase tracking-tighter italic">L'équipe Label Moto</p>
                <Image src="/images/Stamp-LM.webp" alt="" width={100} height={100} className="opacity-40 -ml-4 -rotate-12" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

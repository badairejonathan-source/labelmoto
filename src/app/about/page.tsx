
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        onFilterChange={handleFilterChange}
        placeholderText="Rechercher par nom, ville..."
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <Image
              src="/logo-moto.png?v=4"
              alt="Label Moto Watermark"
              width={600}
              height={192}
              className="opacity-5 rotate-[-15deg]"
            />
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <h1 className="text-4xl font-bold text-foreground">À propos de Label Moto</h1>
            
            <h2 className="text-2xl font-bold text-foreground mt-8">Notre Mission</h2>
            <p>Chez Label Moto, notre mission est simple : simplifier la vie des motards. Nous savons que trouver une concession de confiance, un atelier compétent ou des conseils fiables peut être un parcours du combattant. C'est pourquoi nous avons créé une plateforme unique qui rassemble tout ce dont vous avez besoin pour vivre votre passion à fond, sans les tracas.</p>
            <p>Nous nous engageons à fournir des informations transparentes, à jour et vérifiées pour vous aider à prendre les meilleures décisions, que vous cherchiez à acheter votre prochaine moto, à l'entretenir ou simplement à trouver l'inspiration pour votre prochain road-trip.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">Notre Histoire</h2>
            <p>Label Moto est né de la frustration de passionnés de deux-roues, fatigués de passer des heures à chercher des informations éparpillées sur le web. L'idée était de créer un annuaire intelligent et une communauté où chaque motard, du débutant au plus expérimenté, pourrait trouver sa route... et sa concession.</p>
            <p>Aujourd'hui, nous sommes fiers de connecter des milliers de motards avec les meilleurs professionnels de France, et de proposer des articles et des guides pour nourrir votre passion au quotidien.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">Notre Vision</h2>
            <p>Nous rêvons d'un monde où chaque motard a un accès facile et fiable à des services de qualité. Nous continuons d'innover pour améliorer notre plateforme, en nous basant sur les retours de notre communauté. Notre objectif est de devenir le compagnon de route digital indispensable pour tous les amoureux de la moto en France.</p>
            <p>Rejoignez-nous dans cette aventure et contribuez à bâtir la plateforme de référence pour tous les passionnés de deux-roues.</p>
            <p className="font-semibold text-foreground">L'équipe Label Moto</p>
          </div>
        </div>
      </main>
    </div>
  );
}

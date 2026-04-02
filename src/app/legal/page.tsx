'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
import Image from 'next/image';

export default function LegalPage() {
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
    <div className="min-h-screen bg-background relative">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        onFilterChange={handleFilterChange}
        placeholderText="Recherche par departement , ville , marque, nom ... "
      />
      
      {/* Filigrane Logo */}
      <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/logo-moto.png?v=6"
          alt="Label Moto Watermark"
          width={600}
          height={192}
          className="opacity-[0.03] rotate-[-15deg]"
        />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand mb-12 text-xs font-black uppercase tracking-widest transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-brand/10 p-3 rounded-2xl">
                    <Scale className="h-8 w-8 text-brand" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Mentions Légales</h1>
            </div>
            
            <div className="space-y-10 text-foreground font-medium leading-relaxed">
                <section>
                    <div className="bg-brand/5 border-l-4 border-brand p-4 mb-6 rounded-r-lg">
                        <p className="text-sm font-bold italic">
                            Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (L.C.E.N.), il est porté à la connaissance des utilisateurs du site Label Moto les présentes mentions légales.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4 flex items-center gap-2">
                        1. Présentation du site
                    </h2>
                    <p>Le site <strong>Label Moto</strong> est une plateforme d'information et de mise en relation à <strong>but non lucratif</strong>. Son objectif est de recenser les professionnels du deux-roues en France pour faciliter les recherches de la communauté motarde.</p>
                    <p className="mt-2">À ce jour, le site ne génère aucun revenu, ne vend aucun produit et ne propose aucun service payant. Il s'agit d'un projet communautaire porté par des passionnés.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4">
                        2. Éditeur du site
                    </h2>
                    <p>Le site Label Moto est édité à titre personnel par :</p>
                    <ul className="mt-4 space-y-2 font-bold">
                        <li><strong>Responsable de publication :</strong> L'équipe Label Moto</li>
                        <li><strong>Contact :</strong> <a href="mailto:contact@labelmoto.fr" className="text-brand underline underline-offset-4">contact@labelmoto.fr</a></li>
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground italic">En vertu de l'article 6 de la LCEN, l'éditeur a choisi de conserver son anonymat pour ce projet non lucratif. Les coordonnées de l'éditeur ont été transmises à l'hébergeur du site, qui est tenu au secret professionnel.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4">
                        3. Hébergement
                    </h2>
                    <p>Le site est hébergé par :</p>
                    <ul className="mt-4 space-y-2 font-bold">
                        <li><strong>Hébergeur :</strong> Google Cloud Platform (Firebase App Hosting)</li>
                        <li><strong>Adresse :</strong> 8 rue de Londres, 75009 Paris, France</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4">
                        4. Propriété intellectuelle
                    </h2>
                    <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.</p>
                    <p className="mt-4">Les marques citées (Yamaha, Honda, BMW, etc.) ainsi que leurs logos sont la propriété exclusive de leurs détenteurs respectifs et ne sont utilisés ici qu'à des fins d'identification des établissements et des modèles de moto.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4">
                        5. Responsabilité
                    </h2>
                    <p>Les sources des informations diffusées sur le site Label Moto sont réputées fiables mais le site ne garantit pas qu’il soit exempt de défauts, d’erreurs ou d’omissions. L'utilisation des informations et contenus disponibles sur l'ensemble du site ne saurait en aucun cas engager la responsabilité de l'éditeur.</p>
                </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

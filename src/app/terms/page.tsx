
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function TermsPage() {
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
              src="/images/logo-moto.png?v=2"
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
            <h1 className="text-4xl font-bold text-foreground">Conditions d'utilisation</h1>
            <p>En vigueur au {new Date().toLocaleDateString('fr-FR')}</p>
            
            <h2 className="text-2xl font-bold text-foreground mt-8">1. Objet</h2>
            <p>Les présentes conditions générales d'utilisation (dites « CGU ») ont pour objet l'encadrement juridique des modalités de mise à disposition du site et des services par Label Moto et de définir les conditions d’accès et d’utilisation des services par « l'Utilisateur ».</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">2. Accès au site</h2>
            <p>Le site est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet. Tous les frais supportés par l'Utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">3. Responsabilité</h2>
            <p>Les sources des informations diffusées sur le site Label Moto sont réputées fiables mais le site ne garantit pas qu’il soit exempt de défauts, d’erreurs ou d’omissions. L'Utilisateur s'assure de garder son mot de passe secret. Toute divulgation du mot de passe, quelle que soit sa forme, est interdite.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

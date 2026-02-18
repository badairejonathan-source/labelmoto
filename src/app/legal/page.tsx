
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
              src="/images/logo-moto.png?v=5"
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
            <h1 className="text-4xl font-bold text-foreground">Mentions Légales</h1>
            
            <h2 className="text-2xl font-bold text-foreground mt-8">1. Éditeur du site</h2>
            <p>Le site Label Moto est édité par la société [Nom de la société], [Forme juridique] au capital de [Montant du capital] €, immatriculée au RCS de [Ville] sous le numéro [Numéro RCS].</p>
            <p>Siège social : [Adresse du siège social]</p>
            <p>Numéro de TVA intracommunautaire : [Numéro de TVA]</p>
            <p>Directeur de la publication : [Nom du directeur]</p>
            <p>Contact : <a href="mailto:contact@mototrust.fr" className="text-accent underline">contact@mototrust.fr</a></p>

            <h2 className="text-2xl font-bold text-foreground mt-8">2. Hébergement</h2>
            <p>Le site est hébergé par [Nom de l'hébergeur].</p>
            <p>Adresse : [Adresse de l'hébergeur]</p>
            <p>Téléphone : [Téléphone de l'hébergeur]</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">3. Propriété intellectuelle</h2>
            <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
            <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

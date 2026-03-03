
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft, Award } from 'lucide-react';
import Image from 'next/image';

export default function SelectionPage() {
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
        placeholderText="Recherche par nom, ville, departement"
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <Image
              src="/images/logo-moto.png?v=6"
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
            <div className="text-center mb-8">
                <Award className="mx-auto h-16 w-16 text-brand mb-4" />
                <h1 className="text-4xl font-bold text-foreground">Comment fonctionne la Sélection Label Moto ?</h1>
            </div>
            
            <p className="text-lg text-center max-w-3xl mx-auto">La Sélection Label Moto distingue les professionnels qui respectent des critères de qualité, de fiabilité et de transparence.</p>
            <p className="text-lg text-center font-semibold text-foreground bg-brand/10 dark:bg-brand/20 border border-brand/30 dark:border-brand/50 rounded-lg p-4 max-w-md mx-auto">Ce badge ne peut pas être acheté.</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 pt-8 border-t">Nos critères d’attribution</h2>
            <p>Un établissement peut obtenir la Sélection Label Moto s’il :</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Dispose d’une fiche complète et à jour.</li>
              <li>Présente des informations claires et vérifiées.</li>
              <li>Obtient des avis clients positifs.</li>
              <li>Démontre une expérience reconnue dans son activité.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 pt-8 border-t">Une sélection indépendante</h2>
            <p>La Sélection Label Moto est attribuée de manière indépendante. Elle vise à aider les motards à identifier les professionnels les plus fiables de leur région.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

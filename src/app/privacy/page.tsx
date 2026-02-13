'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <h1 className="text-4xl font-bold text-foreground">Politique de confidentialité</h1>
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            
            <p>La présente Politique de confidentialité décrit la manière dont vos informations personnelles sont collectées, utilisées et partagées lorsque vous visitez ou effectuez un achat sur Label Moto (le « Site »).</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">Informations personnelles que nous collectons</h2>
            <p>Lorsque vous visitez le Site, nous collectons automatiquement certaines informations sur votre appareil, notamment des informations sur votre navigateur web, votre adresse IP, votre fuseau horaire et certains des cookies qui sont installés sur votre appareil.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">Utilisation de vos informations personnelles</h2>
            <p>Nous utilisons les informations que nous collectons pour communiquer avec vous, optimiser et améliorer notre Site (par exemple, en générant des analyses sur la manière dont nos clients naviguent et interagissent avec le Site, et pour évaluer le succès de nos campagnes marketing et publicitaires).</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">Cookies</h2>
            <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. Les cookies sont de petits fichiers de données qui sont placés sur votre appareil ou votre ordinateur et incluent souvent un identifiant unique anonyme. Pour plus d'informations sur les cookies et sur la manière de les désactiver, visitez allaboutcookies.org.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

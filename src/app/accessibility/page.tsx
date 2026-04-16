
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft, Accessibility } from 'lucide-react';
import Image from 'next/image';

export default function AccessibilityPage() {
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
          src="/images/logo-moto.webp"
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
                    <Accessibility className="h-8 w-8 text-brand" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Accessibilité</h1>
            </div>
            
            <div className="space-y-10 text-foreground font-medium leading-relaxed">
                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4">Engagement de Label Moto</h2>
                    <p>Label Moto s’engage à rendre son service accessible, conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005.</p>
                    <p className="mt-2">À cette fin, nous mettons en œuvre des améliorations continues pour faciliter la navigation de tous nos utilisateurs, quels que soient leurs besoins spécifiques ou leurs technologies d'assistance.</p>
                </section>

                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4">État de conformité</h2>
                    <p>Le site <strong>Label Moto</strong> est en cours d'optimisation pour être partiellement conforme au référentiel général d’amélioration de l’accessibilité (RGAA).</p>
                    <ul className="mt-4 list-disc list-inside space-y-2 font-bold">
                        <li>Utilisation de composants ShadCN accessibles.</li>
                        <li>Structure de titres hiérarchisée.</li>
                        <li>Contrastes de couleurs optimisés.</li>
                        <li>Navigation clavier prise en charge sur les éléments clés.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4">Retour d’information et contact</h2>
                    <p>Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez nous contacter pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme :</p>
                    <ul className="mt-4 space-y-2 font-bold">
                        <li><strong>Par email :</strong> <a href="mailto:contact@labelmoto.fr" className="text-brand underline underline-offset-4">contact@labelmoto.fr</a></li>
                        <li><strong>Via notre formulaire :</strong> <Link href="/contact" className="text-brand underline underline-offset-4">Page contact</Link></li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black uppercase tracking-tight text-brand mb-4">Voies de recours</h2>
                    <p>Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.</p>
                </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

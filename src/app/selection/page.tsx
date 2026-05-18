'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import Link from 'next/link';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import Image from 'next/image';

export default function SelectionPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen relative bg-background">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        placeholderText="Recherche..."
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
        <Image src="/images/logo-moto.webp" alt="" width={600} height={192} className="opacity-[0.05] rotate-[-15deg]" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-4xl mx-auto pt-24">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-black uppercase text-[10px] tracking-widest transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <div className="space-y-12">
            <div className="text-center space-y-6">
                <div className="bg-brand/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-xl border-4 border-white">
                    <Award className="h-12 w-12 text-brand" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-none">La Méthode Label Moto</h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
                    Comment nous référençons et certifions les professionnels moto en France.
                </p>
                <div className="inline-flex items-center gap-2 bg-brand text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                    <ShieldCheck className="h-4 w-4" /> Plateforme Indépendante
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-brand/20 shadow-xl">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-brand mb-6">Critères de référencement</h2>
                    <ul className="space-y-4">
                        {[
                            "Validation des coordonnées géographiques précises",
                            "Vérification de l'activité réelle de l'établissement",
                            "Transparence des marques représentées",
                            "Intégrité des informations de contact",
                            "Accessibilité des services proposés"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-base font-bold text-foreground leading-tight">
                                <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-muted/30 p-8 rounded-[2.5rem] border-2 border-dashed border-muted flex flex-col justify-center text-center space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Une démarche neutre</h2>
                    <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                        Le référencement sur Label Moto n'est pas un espace publicitaire acheté. Notre annuaire national repose sur la pertinence pour l'utilisateur. Un établissement est présent car il répond à un besoin concret de localisation ou d'expertise technique.
                    </p>
                    <div className="flex items-center gap-2 justify-center text-brand font-black italic">
                        <Info className="h-4 w-4" />
                        <span>"L'intérêt du motard avant tout."</span>
                    </div>
                </div>
            </div>

            <section className="pt-12 space-y-6 text-center">
                <h3 className="text-2xl font-black uppercase tracking-tight">Vous êtes un professionnel ?</h3>
                <p className="text-muted-foreground font-medium">Contribuez à la qualité de l'annuaire en demandant la mise à jour ou la création de votre fiche.</p>
                <Link href="/pro/register" className="inline-block bg-foreground text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-brand transition-colors">
                    🔘 Gérer ma fiche établissement
                </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

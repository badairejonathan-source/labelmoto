
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/app/header';
import { Bike, Wrench, FileText, Home, CheckCircle, ArrowRight } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';
import articlesData from '@/app/data/articles.json';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useUser();
    const { hero } = placeholderData.landingPage;
    const a2Articles = articlesData.filter(article => ['4', '5', '6'].includes(article.id));
    const proRegisterLink = user ? "/pro/register" : "/login";

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
        } else {
            router.push('/map');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header 
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearch={handleSearch}
                placeholderText="Recherche par nom, ville, departement"
            />
            <main className="py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* Hero Section restructurée : Carte qui dépasse et CTA à cheval */}
                <div className="relative rounded-2xl border-2 border-brand bg-black mb-24 md:mb-32 overflow-visible">
                     <Image
                        src={hero.src}
                        alt="Motorcycle"
                        fill
                        className="object-cover z-0 opacity-40 rounded-2xl"
                        priority
                        data-ai-hint={hero.hint}
                    />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 text-white p-6 md:p-12 md:pb-20">
                        <div className="md:w-3/5 text-center md:text-left relative z-20">
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 md:mb-4" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                                Du A2 au motard expérimenté : trouver les professionnels de votre région en quelques clics
                            </h1>
                            <p className="text-sm md:text-lg max-w-3xl mx-auto md:mx-0 mb-4 md:mb-6 text-gray-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                               Fini les dizaines d'onglets ouverts. Label Moto regroupe tout l’univers deux-roues au même endroit pour vous laisser plus de temps sur la route.
                            </p>
                        </div>

                         <div className="w-full md:w-2/5 flex justify-center md:justify-end relative z-10">
                             <div className="relative transform translate-y-6 md:translate-y-24 lg:translate-y-28 group">
                                <Link href="/map" className="block transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative w-48 h-48 md:w-72 md:h-72">
                                        <Image 
                                            src={hero.mapPreview.src}
                                            alt="Aperçu de la carte"
                                            fill
                                            className="rounded-xl border-4 border-white shadow-2xl object-cover"
                                            data-ai-hint={hero.mapPreview.hint}
                                        />
                                    </div>
                                </Link>
                                
                                {/* Bouton CTA "à cheval" sur la carte */}
                                <div className="absolute -left-8 md:-left-20 top-1/2 -translate-y-1/2 z-50">
                                    <Link href="/map">
                                        <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-[10px] md:text-base px-4 md:px-8 py-3 md:py-6 rounded-full shadow-2xl border-2 md:border-4 border-white whitespace-nowrap transition-transform hover:scale-105">
                                            Explorer la carte
                                        </Button>
                                    </Link>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <section className="mt-20 md:mt-32">
                    <div className="bg-muted/50 rounded-xl p-6">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
                            Pourquoi Label Moto va changer votre recherche
                        </h2>
                        <ul className="space-y-4 max-w-4xl mx-auto">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base">Gain de temps</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Recherche simplifiée, centralisez vos besoins. Localisation, type de moto, expertise spécifique : <span className="font-bold">Label Moto fait le tri pour vous.</span>
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base">Informations fiables et à jour</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Toutes les données des concessions (occasion et neuve) sont vérifiées et <span className="font-bold">régulièrement actualisées</span> pour vous garantir des informations correctes.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base">Transparence totale</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Découvrez de <span className="font-bold">vrais avis</span> partagés par une communauté de motards, sans filtres ni publicité déguisée, pour faire le bon choix en toute confiance.
                                    </p>
                                </div>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base">Info technique, le bon choix.</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Accédez à nos guides et fiches techniques pour maîtriser votre sujet et <span className="font-bold">identifier le professionnel idéal</span> pour votre machine.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
                
                <section className="mt-16 md:mt-24">
                    <div className="bg-muted/50 rounded-2xl p-6 border-2 border-brand shadow-sm">
                        <div className="text-center mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                Objectif A2 : Roule bien accompagné.
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
                                De l’achat de ta première bécane au choix du bon garage, nos dossiers spéciaux t’aident à éviter les pièges et à tracer ta route sereinement.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {a2Articles.map((article) => (
                                <Link 
                                    key={article.id} 
                                    href={`/info/${article.id}`} 
                                    className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-border/50 h-full"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={article.imageUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            data-ai-hint={article.imageHint}
                                        />
                                        <div className="absolute top-2 left-2 bg-brand text-white text-[8px] uppercase font-bold px-1.5 py-0.5 rounded shadow-sm">
                                            A2 Focus
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2 font-medium">
                                            <FileText className="h-3 w-3 text-brand" />
                                            <span>{article.readingTime}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-brand transition-colors line-clamp-2 mb-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-3 mb-3 flex-grow">
                                            {article.description}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-brand text-xs font-bold mt-auto group-hover:gap-2.5 transition-all">
                                            <span>Lire le guide</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-16 md:mt-24">
                  <div className="bg-muted/50 rounded-xl p-6 text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      Maîtrise ton budget entretien.
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-4">
                      <span className="font-bold">Anticipe tes dépenses en quelques clics.</span> Accède au budget moyen et aux points de contrôle de ton modèle pour arriver au garage en toute confiance.
                    </p>
                    <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-sm px-6 py-3 rounded-full shadow-lg">
                      <Link href="/entretien">
                        Calculer mon budget entretien
                      </Link>
                    </Button>
                  </div>
                </section>

                <section className="mt-16 md:mt-24">
                    <div className="relative rounded-xl overflow-hidden bg-black">
                        <Image
                            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
                            alt="Rejoignez la communauté"
                            fill
                            className="object-cover z-0 opacity-30"
                            data-ai-hint="motorcycle ride"
                        />
                        <div className="relative z-10 p-6 md:p-10">
                            <div className="max-w-4xl mx-auto text-center text-white">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    🚦 Rejoignez la route digitale des motards
                                </h2>
                                <div className="space-y-3 text-sm text-gray-200" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                                    <p>
                                        Parce que nous savons que le temps passé à chercher une concession, c’est du temps en moins sur la route, notre mission est simple : rendre la vie des motards plus fluide, plus connectée et plus fiable.
                                    </p>
                                    <p>
                                        Grâce à notre annuaire des concessions moto, vous pouvez dès maintenant acheter une moto près de chez vous, réserver votre essai, planifier un entretien, ou simplement découvrir la meilleure concession moto selon votre région et vos besoins.
                                    </p>
                                    <p>
                                        Alors, prêt à prendre la route du futur ? Rejoignez notre communauté dès aujourd’hui, partagez vos expériences, et contribue à bâtir la plateforme de référence pour tous les passionnés de deux-roues.
                                    </p>
                                    <p className="font-semibold text-white">
                                        Parce qu’ici, chaque motard trouve sa route… et sa concession. <Image src="/images/Stamp-LM.png?v=3" alt="Cachet Label Moto" width={32} height={32} className="inline-block -mt-1.5 opacity-80" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-20 md:mt-32">
                  <div className="bg-white rounded-3xl overflow-hidden border border-border/50 shadow-sm relative group">
                    <div className="flex flex-col lg:flex-row min-h-[300px]">
                      <div className="hidden lg:flex w-16 bg-muted/30 border-r border-border/50 items-center justify-center py-8 shrink-0">
                        <span className="text-xl font-black text-brand/10 tracking-[0.3em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                          Espace Pro
                        </span>
                      </div>

                      <div className="flex-grow flex flex-col lg:flex-row items-center p-6 md:p-8 lg:px-12 lg:py-8 gap-6 lg:gap-8">
                        <div className="flex-1 text-center lg:text-left">
                          <h2 className="text-xl md:text-3xl font-extrabold text-foreground leading-tight mb-3">
                            Professionnels, rejoignez le réseau Label Moto.
                          </h2>
                          <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-2xl mx-auto lg:mx-0">
                            Connectez votre atelier or concession avec les motards de votre secteur. Une visibilité accrue, une gestion simple et une inscription 100% gratuite.
                          </p>
                          <div className="relative inline-block group/cta">
                            <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-xs md:text-base px-6 md:px-8 py-4 rounded-full shadow-lg transition-all hover:shadow-brand/25 hover:-translate-y-1">
                              <Link href={proRegisterLink}>
                                🔘 Créer la fiche de mon établissement
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div className="flex-1 relative w-full max-w-md lg:max-w-none mt-2 md:mt-0">
                           <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white -rotate-1 group-hover:rotate-0 transition-all duration-700 ease-out transform group-hover:scale-[1.02]">
                              <Image 
                                  src="/images/apercufiche.png" 
                                  alt="Interface Pro Preview" 
                                  fill
                                  className="object-cover"
                              />
                           </div>
                           <div className="absolute -bottom-2 right-2 bg-brand text-white px-3 py-1 rounded-lg shadow-xl font-bold text-[8px] md:text-xs rotate-3 flex items-center gap-1.5">
                              <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                              100% Gratuit
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                </div>
            </main>
        </div>
    );
}

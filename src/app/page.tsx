'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import Header from '@/components/app/header';
import { FileText, CheckCircle, ArrowRight } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const HeavySections = dynamic(() => Promise.resolve(({ children }: { children: React.ReactNode }) => <>{children}</>), {
    ssr: true
});

export default function LandingPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useUser();
    const { hero } = placeholderData.landingPage;
    
    const firestore = useFirestore();
    const articlesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'articles'), limit(3));
    }, [firestore]);
    const { data: featuredArticles, isLoading: isArticlesLoading } = useCollection(articlesQuery);

    const proRegisterLink = user ? "/pro/register" : "/login";

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
        } else {
            router.push('/map');
        }
    };

    const getArticleImage = (article: any) => {
        const id = (article.id || '').toLowerCase();
        const title = (article.display_title || article.title || "").toLowerCase();
        
        if (id.includes('zfe') || title.includes('zfe')) return "/images/motardZFEarticle2.webp";
        if (id.includes('assurance') || title.includes('assurance')) return "/images/motard-article-assurance20262.webp";
        if (id.includes('a2') || title.includes('a2')) return "/images/achat-occasion.webp";
        if (id.includes('taille') || title.includes('taille') || title.includes('hauteur')) return "/images/motard-articles-hauteurdeselle.webp";
        if (id.includes('occasion') || id.includes('pieges') || title.includes('pièges')) return "/images/evitelespieges.webp";
        if (id.includes('budget') || title.includes('budget')) return "/images/motard-budget-reel.webp";
        if (id.includes('entretien') || title.includes('entretien') || title.includes('révision')) return "/images/motard-entretien-page.webp";
        
        if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
        
        return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop";
    };

    return (
        <div className="min-h-screen bg-background">
            <Header 
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearch={handleSearch}
                placeholderText="Recherche par departement, ville, marque, nom..."
            />
            <main className="py-4 md:py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* HERO SECTION - RESTRUCTURED TO ALLOW OVERLAP WITHOUT CLIPPING */}
                <div className="relative mb-24 md:mb-48">
                    {/* Background Layer (Clipped) */}
                    <div className="absolute inset-0 rounded-[2rem] border-2 border-brand bg-black overflow-hidden shadow-2xl">
                         <Image 
                            src={hero.src} 
                            alt="Label Moto Hero" 
                            fill 
                            className="object-cover z-0 opacity-40" 
                            priority 
                            sizes="100vw"
                        />
                    </div>

                    {/* Content Layer (Can overflow) */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 text-white p-6 md:p-12 min-h-[250px] md:min-h-[400px]">
                        <div className="md:w-3/5 text-center md:text-left relative z-20">
                            <h1 className="text-xl md:text-5xl font-extrabold tracking-tight mb-2 md:mb-4 uppercase leading-[0.95]" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                                Du A2 au motard expérimenté : trouvez les professionnels les plus proches en quelques clics
                            </h1>
                            <p className="text-[10px] md:text-lg max-w-2xl mx-auto md:mx-0 mb-2 text-gray-200 font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                Fini les dizaines d'onglets ouverts. Label Moto regroupe tout l’univers deux-roues au même endroit pour vous laisser plus de temps sur la route.
                            </p>
                        </div>
                         <div className="w-full md:w-2/5 flex justify-center md:justify-end relative z-10">
                             <div className="relative transform translate-y-12 md:translate-y-24 group">
                                <Link href="/map" className="block transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative w-36 h-36 md:w-72 md:h-72">
                                        <Image src={hero.mapPreview.src} alt="Aperçu de la carte" fill className="rounded-2xl border-4 border-white shadow-2xl object-cover" sizes="(max-width: 768px) 144px, 288px" />
                                    </div>
                                </Link>
                                <div className="absolute -left-4 md:-left-20 top-1/2 -translate-y-1/2 z-50">
                                    <Link href="/map">
                                        <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-[8px] md:text-base px-4 md:px-8 py-3 md:py-6 rounded-full shadow-2xl border-2 md:border-4 border-white whitespace-nowrap transition-transform hover:scale-105 tracking-widest">
                                            Explorer la carte
                                        </Button>
                                    </Link>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <HeavySections>
                    <section className="mt-16 md:mt-32">
                        <div className="bg-muted/50 rounded-[2.5rem] p-6 md:p-8 border border-border/50 backdrop-blur-sm shadow-sm">
                            <h2 className="text-2xl md:text-5xl font-black text-foreground mb-8 text-center uppercase tracking-tighter">Pourquoi choisir LABEL MOTO</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                                <li className="flex items-start gap-4"><CheckCircle className="h-6 w-6 text-brand shrink-0 mt-1" /><div><h3 className="font-black uppercase tracking-tight text-lg mb-1">Gain de temps</h3><p className="text-sm text-muted-foreground leading-relaxed">Recherche simplifiée, centralisez vos besoins. Localisation, type de moto, expertise spécifique.</p></div></li>
                                <li className="flex items-start gap-4"><CheckCircle className="h-6 w-6 text-brand shrink-0 mt-1" /><div><h3 className="font-black uppercase tracking-tight text-lg mb-1">Données vérifiées</h3><p className="text-sm text-muted-foreground leading-relaxed">Toutes les données des concessions sont vérifiées et régulièrement actualisées.</p></div></li>
                                <li className="flex items-start gap-4"><CheckCircle className="h-6 w-6 text-brand shrink-0 mt-1" /><div><h3 className="font-black uppercase tracking-tight text-lg mb-1">Transparence totale</h3><p className="text-sm text-muted-foreground leading-relaxed">Découvrez de vrais avis partagés par une communauté de motards, sans filtres.</p></div></li>
                                 <li className="flex items-start gap-4"><CheckCircle className="h-6 w-6 text-brand shrink-0 mt-1" /><div><h3 className="font-black uppercase tracking-tight text-lg mb-1">Expertise technique</h3><p className="text-sm text-muted-foreground leading-relaxed">Accédez à nos guides et fiches techniques pour identifier le professionnel idéal.</p></div></li>
                            </ul>
                        </div>
                    </section>
                    
                    <section className="mt-16 md:mt-24">
                        <div className="bg-muted/50 rounded-[2.5rem] p-8 border-2 border-brand shadow-xl relative overflow-hidden">
                            <div className="text-center mb-10"><h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-tighter leading-none">Objectif A2 : Roulez bien accompagnés.</h2><p className="text-base text-muted-foreground max-w-3xl mx-auto font-medium">De l’achat de votre première bécane au choix du bon garage, nos dossiers spéciaux vous aident à éviter les pièges.</p></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isArticlesLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md border border-border/50 h-[350px] flex flex-col">
                                            <Skeleton className="aspect-video w-full" />
                                            <div className="p-6 space-y-4">
                                                <Skeleton className="h-3 w-20" />
                                                <Skeleton className="h-6 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    featuredArticles?.map((article, idx) => (
                                        <Link key={article.id} href={`/info/${article.id}`} className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col border border-border/50 h-full transform hover:-translate-y-1">
                                            <div className="relative aspect-video overflow-hidden bg-muted">
                                                <Image 
                                                    src={getArticleImage(article)} 
                                                    alt={article.display_title || article.title} 
                                                    fill 
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3 font-black uppercase tracking-widest"><FileText className="h-3.5 w-3.5 text-brand" /><span>Par {article.author || "L'équipe Label Moto"}</span></div>
                                                <h3 className="text-xl font-black text-foreground leading-tight group-hover:text-brand transition-colors line-clamp-2 mb-3 uppercase tracking-tight">{article.display_title || article.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow leading-relaxed font-medium">{article.description || article.intro_conclusion || ""}</p>
                                                <div className="flex items-center gap-2 text-brand text-xs font-black uppercase tracking-widest mt-auto group-hover:gap-4 transition-all"><span>Lire le guide</span><ArrowRight className="h-4 w-4" /></div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>

                            <div className="mt-12 flex flex-col items-center gap-6 pt-10 border-t border-brand/10">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Envie d'aller plus loin ?</p>
                                    <p className="text-xl md:text-3xl font-black uppercase tracking-tighter text-foreground mb-6">Explorez tous nos guides et conseils pratiques</p>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <Button asChild variant="ghost" size="icon" className="h-24 w-24 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:bg-brand/5 transition-all border-8 border-white hover:border-brand/10 group">
                                        <Link href="/info" className="flex items-center justify-center">
                                            <Image src="/images/icon-conseils.webp" alt="Tous les articles" width={56} height={56} className="h-14 w-14 object-contain transition-transform group-hover:rotate-12" />
                                            <span className="sr-only">Voir tous les articles</span>
                                        </Link>
                                    </Button>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand animate-pulse">Cliquer pour voir la liste</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-16 md:mt-24"><div className="bg-muted/50 rounded-[2.5rem] p-10 text-center border border-border/50 backdrop-blur-sm shadow-sm"><h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-tighter">Maîtrisez votre budget entretien.</h2><p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 font-medium"><span className="font-black text-foreground">Anticipez vos dépenses en quelques clics.</span> Accédez au budget moyen et aux points de contrôle de votre modèle.</p><Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase tracking-widest text-xs px-10 py-7 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"><Link href="/entretien">Calculer mon budget entretien</Link></Button></div></section>

                    <section className="mt-16 md:mt-24">
                        <div className="relative rounded-[2.5rem] overflow-hidden bg-black shadow-2xl min-h-[300px] flex items-center">
                            <Image src="/images/motardcotesudlandingpage1.webp" alt="Ne perdez plus votre temps" fill className="object-cover z-0 opacity-30" />
                            <div className="relative z-10 p-10 md:p-16 w-full">
                                <div className="max-w-4xl mx-auto text-center text-white">
                                    <h2 className="text-3xl md:text-5xl font-black mb-8 uppercase tracking-tighter leading-none" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🚦 Ne perdez plus votre temps dans les recherches.</h2>
                                    <div className="space-y-6 text-base md:text-lg text-gray-200 font-medium leading-relaxed" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                                        <p>Parce que chaque minute passée à chercher un garage est une minute de moins à pencher dans les virages, nous avons créé LABEL MOTO. Notre mission : rendre votre vie de motard plus fluide, plus connectée et surtout, plus fiable.</p>
                                        <p>Trouvez en un clic votre future bécane, réservez un essai en concession, ou dénichez le préparateur qui saura sublimer votre machine. Que ce soit pour un entretien de routine ou l’équipement de votre vie, accédez uniquement à des professionnels sélectionnés.</p>
                                        <p className="font-black text-white pt-4 text-xl uppercase tracking-widest italic">L'équipe Label Moto <Image src="/images/Stamp-LM.webp" alt="Signature" width={48} height={48} className="inline-block -mt-2.5 opacity-90 scale-125 ml-2" /></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-20 md:mt-32">
                      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl relative group">
                        <div className="flex flex-col lg:flex-row min-h-[350px]">
                          <div className="hidden lg:flex w-20 bg-muted/30 border-r border-border/50 items-center justify-center py-8 shrink-0"><span className="text-2xl font-black text-brand/10 tracking-[0.4em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Espace Pro</span></div>
                          <div className="flex-grow flex flex-col lg:flex-row items-center p-8 md:p-12 gap-8 lg:gap-16">
                            <div className="flex-1 text-center lg:text-left"><h2 className="text-3xl md:text-5xl font-black text-foreground leading-[0.9] mb-6 uppercase tracking-tighter">Professionnels, rejoignez le réseau Label Moto.</h2><p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 font-medium">Connectez votre atelier or concession avec les motards de votre secteur.</p><div className="flex flex-col gap-4 items-center lg:items-start"><Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs md:text-sm px-8 py-7 rounded-full shadow-2xl transition-all hover:shadow-brand/25 hover:-translate-y-1 tracking-widest w-full sm:w-auto"><Link href={proRegisterLink}>🔘 Créer la fiche de mon établissement</Link></Button><Button asChild variant="outline" size="lg" className="border-brand text-brand hover:bg-brand/5 font-black uppercase text-xs md:text-sm px-8 py-7 rounded-full shadow-xl transition-all hover:-translate-y-1 tracking-widest w-full sm:w-auto"><Link href="/map?mode=pro_edit">🔘 Modifier une fiche existante</Link></Button></div></div>
                            <div className="flex-1 relative w-full max-w-md lg:max-w-none"><div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white -rotate-2 group-hover:rotate-0 transition-all duration-1000 ease-out transform group-hover:scale-[1.05]"><Image src="/images/apercufiche.webp" alt="Interface Pro Preview" fill className="object-cover" /></div><div className="absolute -bottom-4 right-4 bg-brand text-white px-5 py-2 rounded-2xl shadow-2xl font-black text-[10px] md:text-xs rotate-6 flex items-center gap-2 border-2 border-white"><div className="w-2 h-2 bg-white rounded-full animate-pulse" />100% GRATUIT</div></div>
                          </div>
                        </div>
                      </div>
                    </section>
                </HeavySections>

                </div>
            </main>
        </div>
    );
}
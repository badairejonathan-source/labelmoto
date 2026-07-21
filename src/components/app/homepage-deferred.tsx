'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase/client';
import { collection, query, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function HomepageDeferred() {
    const { user } = useUser();
    const firestore = useFirestore();
    
    const articlesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'articles'), limit(20));
    }, [firestore]);
    const { data: featuredArticles, isLoading: isArticlesLoading } = useCollection(articlesQuery);

    const sortArticlesByDate = (a: any, b: any) => {
        const getTime = (doc: any) => {
            const val = doc.publishedAt || doc.date || doc.submittedAt || doc.updatedAt;
            if (!val) return 0;
            if (typeof val.toMillis === 'function') return val.toMillis();
            if (typeof val === 'object' && val.seconds !== undefined) return val.seconds * 1000;
            const d = new Date(val);
            return isNaN(d.getTime()) ? 0 : d.getTime();
        };
        return getTime(b) - getTime(a);
    };

    // === ENCART ACTU : liste manuelle des IDs (ordre = ordre d'affichage) ===
    const ACTU_IDS = [
        'meilleur-scooter-125-2026-comparatif-complet',
        'meilleures-motos-125cc-2026-guide-complet',
        'meilleurs-casques-moto-2026',
    ];
    // === ENCART A2 : liste manuelle des IDs ===
    const A2_IDS = [
        'achat-moto-occasion-guide-complet-pour-eviter-les-pieges',
        'combien-coute-vraiment-une-moto-par-mois',
        'meilleure-moto-a2-quelle-moto-choisir-pour-debuter',
    ];

    const newsArticles = React.useMemo(() => {
        if (!featuredArticles) return [];
        return ACTU_IDS
            .slice(0, 3)
            .map(id => featuredArticles.find(a => a.id === id))
            .filter(Boolean)
            .slice(0, 3);
    }, [featuredArticles]);

    const a2Articles = React.useMemo(() => {
        if (!featuredArticles) return [];
        return A2_IDS
            .map(id => featuredArticles.find(a => a.id === id))
            .filter(Boolean)
            .slice(0, 3);
    }, [featuredArticles]);

    const proRegisterLink = user ? "/pro/register" : `/login?callbackUrl=${encodeURIComponent('/pro/register')}`;

    const getArticleImage = (article: any) => {
        const id = (article.id || '').toLowerCase();
        const title = (article.title || '').toLowerCase();
        
        if (id.includes('scooter') || title.includes('scooter')) return "/images/article-scooter-125.webp";
        if (id.includes('125') || title.includes('125')) return "/images/article-moto-125cc.webp";
        if (id.includes('association') || title.includes('association')) return placeholderData.articles.association.src;
        if (id.includes('motogp') || id.includes('gp-france') || title.includes('motogp')) return "/images/article-lemans-motogp.webp";
        if (id.includes('zfe') || title.includes('zfe')) return "/images/motardZFEarticle2.webp";
        if (id.includes('assurance') || title.includes('assurance')) return "/images/motard-article-assurance20262.webp";
        if (id.includes('a2') || title.includes('a2')) return "/images/achat-occasion.webp";
        if (id.includes('taille') || title.includes('taille') || title.includes('hauteur')) return "/images/motard-articles-hauteurdeselle.webp";
        if (id.includes('occasion') || id.includes('pieges') || title.includes('pièges')) return "/images/evitelespieges.webp";
        if (id.includes('budget') || title.includes('budget')) return "/images/motard-budget-reel.webp";
        if (id.includes('entretien') || id.includes('entretien') || title.includes('révision')) return "/images/motard-entretien-page.webp";
        if (id.includes('relais')) return "/images/article-relais-motards.webp";
        if (id.includes('casques-entree') || (id.includes('meilleurs-casques') && id.includes('entree'))) return "/images/casques-entree-de-gamme-2026.webp";
        if (id.includes('meilleurs-casques') && id.includes('milieu')) return "/images/casques-milieu-de-gamme-2026.webp";
        if (id.includes('meilleurs-casques') && id.includes('haut')) return "/images/casques-haut-de-gamme-2026.webp";
        if (id.includes('meilleurs-casques')) return "/images/casque-meilleur-casque-2026.webp";
        
        if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
        return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop";
    };

    return (
            <div className="space-y-16 md:space-y-32">
            {/* Section Fiches Techniques Moto */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Fiches techniques moto</h2>
            <p className="text-muted-foreground text-sm font-medium mt-1">Entretien, révisions et vidanges — guides par modèle</p>
          </div>
          <Link href="/entretien" className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline shrink-0">
            Voir les 43 fiches →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { brand: 'Honda', model: 'XL750 Transalp', slug: 'honda-xl750-transalp-2023-plus', desc: 'Vidange, chaîne, freins — tout le programme' },
            { brand: 'Yamaha', model: 'MT-07', slug: 'yamaha-mt-07-2021-plus', desc: "Révisions à 10 000 km, coûts réels, points clés" },
            { brand: 'CFMOTO', model: '450MT', slug: 'cfmoto-450mt-2024-plus', desc: 'Entretien du bestseller chinois en France' },
          ].map(fiche => (
            <Link
              key={fiche.slug}
              href={"/" + "fiches/" + fiche.slug}
              className="group flex flex-col gap-2 p-5 bg-white rounded-2xl border-2 border-border/50 hover:border-brand shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-brand">{fiche.brand}</span>
              <span className="font-black text-base uppercase tracking-tight group-hover:text-brand transition-colors leading-tight">{fiche.model}</span>
              <span className="text-xs text-muted-foreground font-medium leading-snug">{fiche.desc}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand mt-1 flex items-center gap-1">
                Voir la fiche <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
            <section aria-labelledby="why-choose-title">
                <div className="bg-muted/50 rounded-[2.5rem] p-6 md:p-10 border border-border/50 backdrop-blur-sm shadow-sm min-h-[300px]">
                    <h2 id="why-choose-title" className="text-3xl md:text-5xl font-black text-foreground mb-8 text-center uppercase tracking-tighter">Pourquoi choisir LABEL MOTO</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto">
                        <li className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-brand shrink-0 mt-1" aria-hidden="true" />
                            <div>
                                <h3 className="font-black uppercase tracking-tight text-lg mb-1">Gain de temps</h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">Recherche simplifiée, centralisez vos besoins. Localisation, type de moto, expertise spécifique.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-brand shrink-0 mt-1" aria-hidden="true" />
                            <div>
                                <h3 className="font-black uppercase tracking-tight text-lg mb-1">Données vérifiées</h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">Toutes les données des concessions sont vérifiées et régulièrement actualisées.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-brand shrink-0 mt-1" aria-hidden="true" />
                            <div>
                                <h3 className="font-black uppercase tracking-tight text-lg mb-1">Transparence totale</h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">Découvrez de vrais avis partagés par une communauté de motards, sans filtres.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-brand shrink-0 mt-1" aria-hidden="true" />
                            <div>
                                <h3 className="font-black uppercase tracking-tight text-lg mb-1">Expertise technique</h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">Accédez à nos guides et fiches techniques pour identifier le professionnel idéal.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            {newsArticles.length > 0 && (
                <section aria-labelledby="actu-title" className="bg-muted/10 border-2 border-indigo-600/30 p-6 md:p-12 rounded-[2.5rem] shadow-inner">
                    <div className="flex items-center gap-3 mb-8 px-4">
                        <div className="bg-brand/10 p-2 rounded-lg">
                            <Zap className="h-6 w-6 text-brand" aria-hidden="true" />
                        </div>
                        <h2 id="actu-title" className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-none">ACTU</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {newsArticles.map((article) => {
                            const isAsso = article.id.toLowerCase().includes('association');
                            const isRelais = article.id.toLowerCase().includes('relais');
                            const badgeLabel = isAsso ? 'COMMUNAUTÉ' : (isRelais ? 'RELAIS MOTARDS' : 'À LA UNE');
                            return (
                                <Link
                                    key={article.id}
                                    href={`/info/${article.id}`}
                                    aria-label={`Lire l'article : ${article.display_title || article.title}`}
                                    className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col border border-border/50 h-full transform hover:-translate-y-1"
                                >
                                    <div className="relative aspect-video overflow-hidden bg-muted">
                                        <Image src={getArticleImage(article)}
                                            alt=""
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, 33vw" loading="lazy"/>
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="bg-white/95 backdrop-blur-sm text-brand px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border border-brand/20">Nouveau</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3 font-black uppercase tracking-widest">
                                            <FileText className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                                            <span>Par {article.author || "L'équipe Label Moto"}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-foreground leading-tight group-hover:text-brand transition-colors line-clamp-2 mb-3 uppercase tracking-tight">{article.display_title || article.title}</h3>
                                        <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-4 flex-grow leading-relaxed font-bold">{article.description || article.intro_conclusion || ""}</p>
                                        <div className="flex items-center gap-2 text-brand text-xs font-black uppercase tracking-widest mt-auto group-hover:gap-4 transition-all">
                                            <span>Lire l'article</span>
                                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
            
            <section aria-labelledby="a2-title">
                <div className="bg-muted/50 rounded-[2.5rem] p-8 md:p-12 border-2 border-brand shadow-xl relative overflow-hidden min-h-[600px]">
                    <div className="text-center mb-10">
                        <h2 id="a2-title" className="text-3xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-tighter leading-none">Objectif A2 : Roulez bien accompagnés.</h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-bold leading-relaxed">De l’achat de votre première bécane au choix du bon garage, nos dossiers spéciaux vous aident à éviter les pièges.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {isArticlesLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md border border-border/50 h-[380px] flex flex-col">
                                    <Skeleton className="aspect-video w-full" />
                                    <div className="p-6 space-y-4">
                                        <Skeleton className="h-3 w-24 rounded-full" />
                                        <Skeleton className="h-8 w-full rounded-md" />
                                        <Skeleton className="h-20 w-full rounded-md" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            a2Articles?.map((article) => (
                                <Link 
                                    key={article.id} 
                                    href={`/info/${article.id}`} 
                                    aria-label={`Lire le guide : ${article.display_title || article.title}`}
                                    className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col border border-border/50 h-full transform hover:-translate-y-1"
                                >
                                    <div className="relative aspect-video overflow-hidden bg-muted">
                                        <Image src={getArticleImage(article)} 
                                            alt="" 
                                            fill 
                                            className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                            sizes="(max-width: 768px) 100vw, 33vw" loading="lazy"/>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3 font-black uppercase tracking-widest">
                                            <FileText className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                                            <span>Par {article.author || "L'équipe Label Moto"}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-foreground leading-tight group-hover:text-brand transition-colors line-clamp-2 mb-3 uppercase tracking-tight">{article.display_title || article.title}</h3>
                                        <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-4 flex-grow leading-relaxed font-bold">{article.description || article.intro_conclusion || ""}</p>
                                        <div className="flex items-center gap-2 text-brand text-xs font-black uppercase tracking-widest mt-auto group-hover:gap-4 transition-all">
                                            <span>Lire le guide</span>
                                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    <div className="mt-12 flex flex-col items-center gap-6 pt-10 border-t border-brand/10">
                        <div className="text-center">
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Envie d'aller plus loin ?</p>
                            <p className="text-xl md:text-3xl font-black uppercase tracking-tighter text-foreground mb-6">Explorez tous nos guides et conseils pratiques</p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Button asChild variant="ghost" size="icon" aria-label="Voir tous les articles et guides" className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:bg-brand transition-all border-4 md:border-8 border-white hover:border-white group">
                                <Link href="/info" className="flex items-center justify-center">
                                    <Image src="/images/icon-conseils.webp" alt="" width={56} height={56} className="h-10 w-10 md:h-14 md:w-14 object-contain transition-transform group-hover:rotate-12 group-hover:brightness-0 group-hover:invert" loading="lazy"/>
                                    <span className="sr-only">Voir tous les articles</span>
                                </Link>
                            </Button>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand animate-pulse" aria-hidden="true">Cliquer pour voir la liste</span>
                        </div>
                    </div>
                </div>
            </section>

            <section aria-labelledby="maintenance-title">
                <div className="bg-muted/50 rounded-[2.5rem] p-10 md:p-16 text-center border border-border/50 backdrop-blur-sm shadow-sm min-h-[250px]">
                    <h2 id="maintenance-title" className="text-3xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-tighter">Maîtrisez votre budget entretien.</h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 font-bold leading-relaxed">
                        <span className="font-black text-foreground">Anticipez vos dépenses en quelques clics.</span> Accédez au budget moyen et aux points de contrôle de votre modèle.
                    </p>
                    <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase tracking-widest text-xs px-10 py-7 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
                        <Link href="/entretien">Calculer mon budget entretien</Link>
                    </Button>
                </div>
            </section>

            <section aria-labelledby="manifesto-title">
                <div className="relative rounded-[2.5rem] overflow-hidden bg-black shadow-2xl min-h-[300px] flex items-center">
                    <Image src="/images/motardcotesudlandingpage1.webp" alt="" fill className="object-cover z-0 opacity-30" sizes="(max-width: 1280px) 100vw, 1280px" loading="lazy" />
                    <div className="relative z-10 p-10 md:p-16 w-full">
                        <div className="max-w-4xl mx-auto text-center text-white">
                            <h2 id="manifesto-title" className="text-3xl md:text-5xl font-black mb-8 uppercase tracking-tighter leading-none" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🚦 Ne perdez plus votre temps dans les recherches.</h2>
                            <div className="space-y-6 text-base md:text-lg text-gray-200 font-bold leading-relaxed" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                                <p>Parce que chaque minute passée à chercher un garage est une minute de moins à pencher dans les virages, nous avons créé LABEL MOTO. Notre mission : rendre votre vie de motard plus fluide, plus connectée et surtout, plus fiable.</p>
                                <p>Trouvez en un clic votre future bécane, réservez un essai en concession, ou dénichez le préparateur qui saura sublimer votre machine. Que ce soit pour un entretien de routine ou l’équipement de votre vie, accédez uniquement à des professionnels sélectionnés.</p>
                                <p className="font-black text-white pt-4 text-xl uppercase tracking-widest italic">L'équipe Label Moto <Image src="/images/Stamp-LM.webp" alt="Signature" width={48} height={48} className="inline-block -mt-2.5 opacity-90 scale-125 ml-2" loading="lazy"/></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-12" aria-labelledby="pro-title">
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl relative group min-h-[350px]">
                <div className="flex flex-col lg:flex-row h-full">
                  <div className="hidden lg:flex w-20 bg-muted/30 border-r border-border/50 items-center justify-center py-8 shrink-0"><span className="text-2xl font-black text-brand/10 tracking-[0.4em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Espace Pro</span></div>
                  <div className="flex-grow flex flex-col lg:flex-row items-center p-8 md:p-12 gap-8 lg:gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 id="pro-title" className="text-3xl md:text-5xl font-black text-foreground leading-[0.9] mb-6 uppercase tracking-tighter">Pros & Associations, rejoignez le réseau Label Moto.</h2>
                        <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 font-bold">Créez votre fiche, gagnez en visibilité auprès des motards de votre région.</p>
                        <div className="flex flex-col gap-4 items-center lg:items-start">
                            <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs md:text-sm px-8 py-7 rounded-full shadow-2xl transition-all hover:shadow-brand/25 hover:-translate-y-1 tracking-widest w-full sm:w-auto">
                                <Link href={proRegisterLink}>🔘 Créer la fiche de mon établissement</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-brand text-brand hover:bg-brand/5 font-black uppercase text-xs md:text-sm px-8 py-7 rounded-full shadow-xl transition-all hover:-translate-y-1 tracking-widest w-full sm:w-auto">
                                <Link href="/pro/revendiquer">🔘 Modifier une fiche existante</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 relative w-full max-w-md lg:max-w-none">
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white -rotate-2 group-hover:rotate-0 transition-all duration-1000 ease-out transform group-hover:scale-[1.05]">
                            <Image src="/images/apercufiche.webp" alt="Aperçu de l'interface de gestion professionnelle" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" />
                        </div>
                        <div className="absolute -bottom-4 right-4 bg-brand text-white px-5 py-2 rounded-2xl shadow-2xl font-black text-[11px] md:text-xs rotate-6 flex items-center gap-2 border-2 border-white">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />100% GRATUIT
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <style jsx global>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}

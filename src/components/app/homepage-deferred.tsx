'use client';
import Header from '@/components/app/header';

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
    const [homeSearch, setHomeSearch] = React.useState('');
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
            {/* Barre recherche avec suggestions complètes */}
      <section className="py-2">
        <Header
          searchOnly={true}
          placeholderText="Recherche par ville, marque ou nom de pro..."
          onSearch={() => { if (homeSearch.trim()) window.location.href = '/map?search=' + encodeURIComponent(homeSearch.trim()); else window.location.href = '/map'; }}
          onSearchTermChange={(val: string) => setHomeSearch(val)}
          searchTerm={homeSearch}
        />
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

            <section aria-labelledby="guides-title">
                <div className="bg-muted/10 border border-border/50 p-6 md:p-10 rounded-[2.5rem] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-brand/10 p-2 rounded-lg">
                                <Zap className="h-6 w-6 text-brand" aria-hidden="true" />
                            </div>
                            <div>
                                <h2 id="guides-title" className="text-2xl font-black text-foreground uppercase tracking-tighter leading-none">Guides & Actu moto</h2>
                                <p className="text-sm text-muted-foreground font-medium mt-1">Conseils, comparatifs et dossiers par notre equipe</p>
                            </div>
                        </div>
                        <Link href="/info" className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline shrink-0">
                            Tous les guides →
                        </Link>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
                        {[
                            { img: "/images/achat-occasion.webp", theme: "Debuter en moto", desc: "Permis, moto A2, premiere bécane — tout pour bien démarrer", href: "/info/meilleure-moto-a2-quelle-moto-choisir-pour-debuter", tag: "Permis & A2" },
                            { img: "/images/motard-budget-reel.webp", theme: "Budget & Achat", desc: "Couts reels, achat occasion, financement — evitez les pieges", href: "/info/achat-moto-occasion-guide-complet-pour-eviter-les-pieges", tag: "Budget" },
                            { img: "/images/casque-meilleur-casque-2026.webp", theme: "Equipement", desc: "Casques, blousons, comparatifs — les meilleurs choix 2026", href: "/info/meilleurs-casques-moto-2026", tag: "Equipement" },
                        ].map(g => (
                            <Link key={g.theme} href={g.href} className="group flex-shrink-0 w-[240px] sm:flex-1 sm:w-auto flex flex-col bg-white rounded-2xl border border-border/50 hover:border-brand shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden snap-start">
                                <div className="relative h-[130px] overflow-hidden">
                                    <Image src={g.img} alt={g.theme} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="240px" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest text-white bg-brand/80 px-2 py-1 rounded-full">{g.tag}</span>
                                </div>
                                <div className="p-4 flex flex-col gap-2 flex-grow">
                                    <span className="font-black text-sm uppercase tracking-tight group-hover:text-brand transition-colors leading-tight">{g.theme}</span>
                                    <span className="text-xs text-muted-foreground font-medium leading-snug flex-grow">{g.desc}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand mt-1 flex items-center gap-1">
                                        Voir les guides <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            
            <section aria-labelledby="entretien-title">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl min-h-[320px]">
                    {/* Image de fond */}
                    <Image src="/images/motard-entretien-page.webp" alt="Entretien moto" fill className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 1280px" loading="lazy" />
                    {/* Overlay sombre */}
                    <div className="absolute inset-0 bg-black/65" />
                    {/* Contenu par-dessus */}
                    <div className="relative z-10 p-6 md:p-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 id="entretien-title" className="text-2xl font-black uppercase tracking-tight text-white">Entretien & Budget moto</h2>
                                <p className="text-white/70 text-sm font-medium mt-1">Anticipez vos révisions, maitrisez vos couts</p>
                            </div>
                            <Link href="/fiches" className="text-[10px] font-black uppercase tracking-widest text-brand hover:opacity-80 whitespace-nowrap">Voir les 43 fiches →</Link>
                        </div>
                        {/* 3 fiches */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {[
                                { brand: "Honda", model: "XL750 Transalp", slug: "honda-xl750-transalp-2023-plus", desc: "Vidange, chaine, freins — tout le programme" },
                                { brand: "Yamaha", model: "MT-07", slug: "yamaha-mt-07-2021-plus", desc: "Révisions à 10 000 km, couts réels, points clés" },
                                { brand: "CFMOTO", model: "450MT", slug: "cfmoto-450mt-2024-plus", desc: "Entretien du bestseller chinois en France" },
                            ].map(fiche => (
                                <Link key={fiche.slug} href={"/fiches/" + fiche.slug} className="group flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-brand hover:bg-white/20 transition-all duration-300 p-4 gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand">{fiche.brand}</span>
                                    <span className="font-black text-sm uppercase tracking-tight text-white group-hover:text-brand transition-colors leading-tight">{fiche.model}</span>
                                    <span className="text-xs text-white/60 font-medium leading-snug flex-grow">{fiche.desc}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand mt-1 flex items-center gap-1">
                                        Voir la fiche <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                        {/* CTA */}
                        <div className="text-center">
                            <p className="text-white/60 text-sm font-medium mb-4">Anticipez vos dépenses en quelques clics — budget moyen et points de controle par modele</p>
                            <Link href="/fiches" className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 text-white font-black uppercase text-xs px-8 py-4 rounded-full shadow-2xl tracking-widest transition-all hover:scale-105 active:scale-95">
                                Calculer mon budget entretien
                            </Link>
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

        </div>
    );
}

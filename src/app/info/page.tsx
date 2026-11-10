'use client';

import React, { useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LabelMotoLogo from '@/components/app/logo';
import UserMenu from '@/components/app/user-menu';
import EntretienRoadBackdrop from '@/components/app/entretien-road-backdrop';
import { LabelMotoRoadHeaderEntry } from '@/components/app/labelmoto-road-finishes';
import { Loader2, Map, FileText, ChevronRight, Home, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase/client';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import GuidesDesktopSidebar from '@/components/app/guides-desktop-sidebar';

const CATEGORIES = [
    { id: 'ALL', label: 'TOUT' },
    { id: 'A2', label: 'PERMIS A2' },
    { id: 'EVENT', label: 'ÉVÉNEMENTS' },
    { id: 'TIPS', label: 'CONSEILS' }
];

const getArticleCategories = (article: any) => {
    const id = (article.id || '').toLowerCase();
    const title = (article.display_title || article.title || "").toLowerCase();
    const cats: string[] = [];

    if (
        id.includes('a2') || 
        id.includes('occasion') || 
        id.includes('assurance') || 
        id.includes('taille') || 
        id.includes('budget') || 
        title.includes('a2') || 
        title.includes('taille') || 
        title.includes('gabarit') ||
        title.includes('débutant') ||
        id.includes('combien-coute')
    ) {
        cats.push('A2');
    }

    if (id.includes('motogp') || id.includes('gp-france') || id.includes('event') || id.includes('circuit')) {
        cats.push('EVENT');
    }

    if (
        id.includes('taille') || 
        id.includes('zfe') || 
        id.includes('hauteur') || 
        id.includes('entretien') || 
        id.includes('revision') ||
        id.includes('assurance') || 
        id.includes('occasion') || 
        id.includes('combien-coute') ||
        id.includes('relais')
    ) {
        cats.push('TIPS');
    }

    if (cats.length === 0) cats.push('TIPS');

    return cats;
};

const ArticleCard = ({ article, priority = false, eager = false, compact = false }: { article: any, priority?: boolean, eager?: boolean, compact?: boolean }) => {
    const imageUrl = React.useMemo(() => {
    const labelMotoListingArticleId = String(
      article?.id ||
      article?.slug ||
      ''
    ).toLowerCase();

    const labelMotoListingArticleTitle = String(
      article?.display_title ||
      article?.title ||
      ''
    ).toLowerCase();

    if (
      labelMotoListingArticleId ===
        'embrayage-automatique-moto-eclutch-dct-yamt-asa-amt' ||
      labelMotoListingArticleTitle.includes(
        'fin du levier'
      )
    ) {
      return '/images/embrayage-automatique-eclutch-dct-yamt-asa-amt.webp';
    }

    if (
      labelMotoListingArticleId ===
        'motos-chinoises-france-2026' ||
      labelMotoListingArticleTitle.includes(
        'motos chinoises'
      )
    ) {
      return '/images/article-moto-chinoise-2026.webp';
    }
        const id = (article.id || '').toLowerCase();
        const title = (article.title || '').toLowerCase();

        if (id.includes('125') || title.includes('125')) return "/images/article-moto-125cc.webp";
        if (id.includes('association') || title.includes('association')) return "/images/article-motars-association.webp";
        if (id.includes('motogp') || id.includes('gp-france') || title.includes('motogp')) return "/images/article-lemans-motogp.webp";
        if (id.includes('zfe') || title.includes('zfe')) return "/images/motardZFEarticle2.webp";
        if (id.includes('assurance') || title.includes('assurance')) return "/images/motard-article-assurance20262.webp";
        if (id === 'premiere-moto-accessoires-indispensables-conseils-a2') return "/images/premiere-moto-accessoires-hero.webp";
        if (id.includes('a2') || title.includes('a2')) return "/images/achat-occasion.webp";
        if (id.includes('taille') || title.includes('taille') || title.includes('hauteur')) return "/images/motard-articles-hauteurdeselle.webp";
        if (id.includes('occasion') || id.includes('pieges') || title.includes('pièges')) return "/images/evitelespieges.webp";
        if (id.includes('budget') || title.includes('budget')) return "/images/motard-budget-reel.webp";
        if (id.includes('entretien') || id.includes('entretien') || title.includes('révision')) return "/images/motard-entretien-page.webp";
        if (id.includes('relais')) return "/images/article-relais-motards.webp";
        if (id.includes('scooter')) return "/images/article-scooter-125.webp";
        if (id.includes('entree-de-gamme')) return "/images/casques-entree-de-gamme-2026.webp";
        if (id.includes('milieu-de-gamme')) return "/images/casques-milieu-de-gamme-2026.webp";
        if (id.includes('haut-de-gamme') && id.includes('casques')) return "/images/casques-haut-de-gamme-2026.webp";
        if (id.includes('meilleurs-casques')) return "/images/casque-meilleur-casque-2026.webp";

        if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;

        return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop";
    }, [article]);

    const title = article.display_title || article.title || "Sans titre";

    // LABELMOTO_CONSEILS_CARTES_COMPACTES_20261110: version uniquement destinee aux quatre rubriques de l'accueil Conseils.
    if (compact) {
        const excerpt = article.description || article.intro_conclusion || article.intro?.[0] || '';
        return (
            <article className="min-w-0 h-full">
                <Link href={`/info/${article.id}`} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06] transition-shadow hover:shadow-md">
                    <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted">
                        <Image
                            src={imageUrl.replace(/^https?:\/\/(?:www\.)?labelmoto\.fr(?=\/)/, '')}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 767px) 85vw, (max-width: 1199px) 45vw, 24vw"
                            loading={eager ? 'eager' : 'lazy'}
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-4">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-brand sm:text-base">{title}</h3>
                        {excerpt && <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{excerpt}</p>}
                        <span className="mt-auto pt-1 text-xs font-semibold text-brand">Lire l'article →</span>
                    </div>
                </Link>
            </article>
        );
    }

    return (
        <article>
          <Link href={`/info/${article.id}`} className="group block py-8 border-b last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="md:col-span-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-[1.08] tracking-[-0.03em] group-hover:text-brand transition-colors">{title}</h2>
                    <p className="mt-3 text-base text-muted-foreground line-clamp-3 leading-relaxed font-normal">{article.description || article.intro_conclusion || article.intro?.[0] || ""}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground font-semibold uppercase tracking-[0.08em]"><FileText className="h-3.5 w-3.5 text-brand" /><span>Par {article.author || "L'équipe Label Moto"}</span></div>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden order-first md:order-last border-2 border-white shadow-lg bg-muted">
                    <Image 
                        src={imageUrl.replace(/^https?:\/\/(?:www\.)?labelmoto\.fr(?=\/)/, '')}
                        alt={title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        sizes="(max-width: 768px) 100vw, 33vw" 
                        priority={priority}
                        loading={priority ? undefined : (eager ? "eager" : "lazy")}
                    />
                </div>
            </div>
          </Link>
        </article>
    );
};

function InfoPageComponent() {
    const [activeCategory, setActiveCategory] = useState('ALL');

    const firestore = useFirestore();
    const articlesRef = useMemoFirebase(() => firestore ? collection(firestore, 'articles') : null, [firestore]);
    const { data: allArticles, isLoading } = useCollection(articlesRef);

    const filteredArticles = useMemo(() => {
        if (!allArticles) return [];
        const EXCLUDED_ARTICLE_IDS = ['entretien-moto-intervalles-prix-conseils-par-modele', 'meilleurs-casques-moto-entree-de-gamme-2026', 'meilleurs-casques-moto-milieu-de-gamme-2026', 'meilleurs-casques-moto-haut-de-gamme-2026'];

        return [...allArticles]
            .filter(a => {
                if (EXCLUDED_ARTICLE_IDS.includes(a.id)) return false;
                if (activeCategory === 'ALL') return true;
                return getArticleCategories(a).includes(activeCategory);
            })
            .sort((a, b) => {
                const getTime = (doc: any) => {
                    const val = doc.publishedAt || doc.date || doc.submittedAt || doc.updatedAt;
                    if (!val) return 0;
                    if (typeof val.toMillis === 'function') return val.toMillis();
                    if (typeof val === 'object' && val.seconds !== undefined) return val.seconds * 1000;
                    const d = new Date(val);
                    return isNaN(d.getTime()) ? 0 : d.getTime();
                };
                return getTime(b) - getTime(a);
            });
    }, [allArticles, activeCategory]);

    // LABELMOTO_QUATRE_ENCARTS_CONSEILS_20261110: uniquement des articles réellement présents, sans placeholders fictifs.
    // L'ordre chronologique reprend la logique déjà utilisée dans filteredArticles.
    const landingGuides = useMemo(() => {
        const excluded = new Set([
            'entretien-moto-intervalles-prix-conseils-par-modele',
            'meilleurs-casques-moto-entree-de-gamme-2026',
            'meilleurs-casques-moto-milieu-de-gamme-2026',
            'meilleurs-casques-moto-haut-de-gamme-2026',
        ]);
        const timestamp = (doc: any): number => {
            const value = doc.publishedAt || doc.date || doc.submittedAt || doc.updatedAt;
            if (!value) return 0;
            if (typeof value.toMillis === 'function') return value.toMillis();
            if (typeof value === 'object' && value.seconds !== undefined) return value.seconds * 1000;
            const time = new Date(value).getTime();
            return Number.isFinite(time) ? time : 0;
        };
        const list = [...(allArticles ?? [])]
            .filter(article => article && typeof article.id === 'string' && !excluded.has(article.id))
            .sort((a, b) => timestamp(b) - timestamp(a));
        const searchable = (article: any): string => String([
            article.id, article.display_title, article.title,
        ].filter(Boolean).join(' ')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        // LABELMOTO_SELECTION_A2_BUDGET_CIBLEE_20261110 : choix editorial prioritaire, sans faux articles ni doublons.
        const matches = (article: any, pattern: RegExp): boolean => pattern.test(searchable(article));
        const firstMatch = (pattern: RegExp, alreadyPicked: Set<string>): any | undefined =>
            list.find(article => !alreadyPicked.has(article.id) && matches(article, pattern));
        const pickBySubjects = (subjects: RegExp[]): any[] => {
            const picked: any[] = [];
            const seen = new Set<string>();
            for (const subject of subjects) {
                const article = firstMatch(subject, seen);
                if (article) { picked.push(article); seen.add(article.id); }
            }
            return picked;
        };
        // Les trois sujets demandes : occasion, achat moto A2, guide des tailles.
        // Si un sujet ne correspond a aucun article publie, ne pas le remplacer par un hors-sujet.
        const a2 = pickBySubjects([
            /achat-moto-occasion-guide-complet-pour-eviter-les-pieges|achat.{0,35}moto.{0,25}occasion|moto.{0,25}occasion.{0,25}guide/,
            /(?:achat|acheter|choisir|choix|quelle).{0,55}moto.{0,35}a2|moto.{0,35}a2.{0,35}(?:achat|acheter|choisir|choix)|(?:achat|acheter).{0,35}a2/,
            /guide.{0,30}taill|taill.{0,35}guide|comment.{0,30}choisir.{0,20}taille/,
        ]);
        // Exclusion volontaire des guides casques : le mot "budget" seul ne qualifie pas
        // un article pour la rubrique couts/assurance. Les vrais comparatifs restent ailleurs.
        const budgetEligible = list.filter(article =>
            !/(casque|comparatif|scooter|meilleur.{0,25}moto|guide.{0,20}taille)/.test(searchable(article))
        );
        const budgetSubjects = [
            /assurance|assurer|assureur|garantie.{0,10}vol/,
            /combien.{0,20}coute.{0,25}moto|moto.{0,25}par.{0,10}mois|budget.{0,20}moto|cout.{0,15}moto/,
            /entretien.{0,25}(?:prix|cout|budget)|(?:prix|cout|budget).{0,25}entretien|depense|financ|economis/,
        ];
        const budget: any[] = [];
        const budgetIds = new Set<string>();
        for (const subject of budgetSubjects) {
            const match = budgetEligible.find(article => !budgetIds.has(article.id) && matches(article, subject));
            if (match) { budget.push(match); budgetIds.add(match.id); }
        }
        // Compléter jusqu'a trois articles uniquement avec d'autres sujets financiers pertinents.
        for (const article of budgetEligible) {
            if (budget.length >= 3) break;
            if (!budgetIds.has(article.id) && /assurance|assureur|garantie.{0,10}vol|combien.{0,20}coute|budget.{0,20}moto|cout.{0,15}moto|prix.{0,15}entretien|depense|financ|economis/.test(searchable(article))) {
                budget.push(article); budgetIds.add(article.id);
            }
        }
        return {
            latest: list.slice(0, 3),
            a2,
            budget,
            comparisons: list.filter(article => /comparatif|comparaison|meilleur|choisir|casque|scooter|125cc|125[- ]/.test(searchable(article))).slice(0, 3),
        };
    }, [allArticles]);

    return (
        <div data-labelmoto-mobile-road="info" className="relative isolate min-h-screen overflow-hidden bg-[#fbfcfc]">
            {/* Courbe de fond identique à /entretien */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-0
                    opacity-[0.66]
                "
            >
                <EntretienRoadBackdrop />
            </div>

            {/* Header harmonisé avec la homepage et /entretien */}
            <div className="lg:hidden">
        <header
                className="
                    relative
                    z-30
                    mx-auto
                    flex
                    w-full
                    max-w-6xl
                    items-center
                    justify-between
                    px-5
                    pb-3
                    pt-5
                    sm:px-6
                    md:pt-6
                    lg:px-8
                "
            >
                <div
                    className="
                        w-[150px]
                        shrink-0
                        sm:w-[165px]
                        md:w-[175px]
                    "
                >
                    <LabelMotoLogo noBubble />
                </div>

                <UserMenu />
            </header>
      </div>

      <header
        className="
          hidden
          h-[80px]
          border-b
          border-black/[0.06]
          bg-white/95
          backdrop-blur-xl
          lg:block
          relative
        "
      >
        <LabelMotoRoadHeaderEntry />
        <div
          className="
            flex
            h-full
            items-center
            px-8
          "
        >
          <div
            className="
              flex
              w-[410px]
              shrink-0
              items-center
            "
          >
            <LabelMotoLogo
              noBubble
              className="
                w-[150px]
                border-none
                bg-transparent
                px-0
                shadow-none
              "
            />
          </div>

          <nav
            className="
              flex
              h-full
              items-center
              gap-9
              text-[14px]
              font-bold
              text-foreground
            "
          >
            <Link
              href="/map"
              className="
                flex
                h-full
                items-center
                border-b-[3px]
                border-transparent
                transition-colors
                hover:text-brand
              "
            >
              Carte
            </Link>

            <Link
              href="/entretien"
              className="
                flex
                h-full
                items-center
                border-b-[3px]
                border-transparent
                transition-colors
                hover:text-brand
              "
            >
              Entretien / fiches techniques
            </Link>

            <Link
              href="/info"
              className="
                flex
                h-full
                items-center
                border-b-[3px]
                border-brand
                text-brand
              "
            >
              Guides &amp; conseils
            </Link>

          </nav>

          <div
            className="
              ml-auto
              flex
              items-center
            "
          >
            <UserMenu />
          </div>
        </div>
      </header>

            <main
                className="
                    relative
                    z-10
                    mx-auto
                    w-full
                    px-4
                    py-8
                    sm:px-6
                    lg:px-0
                    lg:py-0

                    before:pointer-events-none
                    before:absolute
                    before:inset-0
                    before:z-0
                    before:bg-transparent
                    before:content-['']

                    [&>*]:relative
                    [&>*]:z-10
                "
            >
                <div className="max-w-6xl mx-auto lg:hidden">
                    <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.08em] mb-8 pt-3 md:pt-6"><Link href="/" className="hover:text-brand transition-colors flex items-center gap-1"><Home className="h-3 w-3" /><span>Accueil</span></Link><ChevronRight className="h-3 w-3" /><span className="text-foreground">Conseils</span></nav>

                    <div className="text-center mb-8">
                        <h1 className="text-[32px] md:text-5xl font-bold text-foreground tracking-[-0.035em] leading-[1.02]">Conseils pratiques</h1>
                        <div className="mt-4 w-16 h-1 bg-brand mx-auto rounded-full" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? 'default' : 'outline'}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "rounded-full font-semibold text-[11px] tracking-[0.04em] h-10 px-6 transition-all shadow-md",
                                    activeCategory === cat.id 
                                        ? "bg-brand text-white border-brand scale-105" 
                                        : "bg-white text-muted-foreground hover:border-brand/50 hover:text-brand"
                                )}
                            >
                                {cat.label}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-8">
                            {isLoading ? (
                                <div className="space-y-12">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b">
                                            <div className="md:col-span-2 space-y-4 pt-2">
                                                <Skeleton className="h-10 w-3/4 rounded-lg" />
                                                <div className="space-y-2">
                                                  <Skeleton className="h-4 w-full" />
                                                  <Skeleton className="h-4 w-5/6" />
                                                </div>
                                                <Skeleton className="h-3 w-32 rounded-full mt-4" />
                                            </div>
                                            <Skeleton className="aspect-video w-full rounded-2xl order-first md:order-last" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {filteredArticles.map((article, idx) => (
                                        <ArticleCard key={article.id} article={article} priority={idx < 2} eager={idx < 13} />
                                    ))}
                                    {filteredArticles.length === 0 && (
                                        <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-3xl bg-muted/10">
                                            <p className="text-lg font-semibold tracking-[-0.02em]">Aucun article dans cette catégorie.</p>
                                            <Button variant="ghost" onClick={() => setActiveCategory('ALL')} className="mt-4 font-semibold text-xs text-brand">Voir tous les articles</Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <aside className="md:col-span-4 relative">
                            <div className="md:sticky md:top-28 space-y-6">
                                <Card className="overflow-hidden shadow-2xl border-none bg-card/50 backdrop-blur-md rounded-3xl ring-1 ring-white/20">
                                    <CardHeader className="p-6 bg-brand text-brand-foreground">
                                        <CardTitle className="flex items-center gap-3 text-xl font-semibold tracking-[-0.02em]"><Map className="h-6 w-6"/>Trouver un pro</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <Link href="/map" className="block group rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-muted">
                                            <Image src="/images/apercucartezoom.webp" alt="Aperçu de la carte" width={400} height={300} className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110" />
                                        </Link>
                                        <p className="text-muted-foreground text-sm mt-6 font-medium leading-relaxed">Trouvez les meilleures concessions et ateliers moto en France sur notre carte interactive.</p>
                                    </CardContent>
                                    <CardFooter className="px-6 pb-8">
                                        <Button asChild className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-semibold text-xs py-6 rounded-full shadow-lg transition-all hover:scale-[1.02] active:scale-95">
                                            <Link href="/map">Voir la carte interactive</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <div className="bg-muted/30 p-8 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/10 text-center">
                                    <Sparkles className="h-8 w-8 text-brand mx-auto mb-4 opacity-50" />
                                    <h3 className="text-sm font-semibold tracking-[-0.01em] text-foreground mb-2">Entretien & Fiches</h3>
                                    <p className="text-[11px] font-normal text-muted-foreground leading-relaxed mb-6">Accédez aux périodicités et budgets de révision par modèle.</p>
                                    <Button asChild variant="outline" className="w-full rounded-full border-brand text-brand hover:bg-brand/10 font-semibold text-[10px]">
                                        <Link href="/entretien">Consulter le catalogue</Link>
                                    </Button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                <div
                    className="
                        hidden
                        lg:ml-6
                        lg:mr-8
                        lg:grid
                        lg:grid-cols-[394px_minmax(0,1fr)]
                        lg:items-start
                        lg:gap-6
                        lg:pt-6
                    "
                >
                    <GuidesDesktopSidebar
                        articles={allArticles}
                        isLoading={isLoading}
                    />

                    <section
                        data-labelmoto-road-halo="info"
                        className="
                            min-h-[calc(100vh-128px)]
                            min-w-0
                            w-full
                            bg-transparent
                            pb-16
                        "
                    >
                        <nav
                            className="
                                flex
                                items-center
                                gap-2
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-muted-foreground
                            "
                        >
                            <Link
                                href="/"
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    transition-colors
                                    hover:text-brand
                                "
                            >
                                <Home className="h-3 w-3" />
                                <span>Accueil</span>
                            </Link>

                            <ChevronRight className="h-3 w-3" />

                            <span className="text-foreground">
                                Conseils
                            </span>
                        </nav>

                                                {/* LABELMOTO_QUATRE_ENCARTS_CONSEILS_20261110: accueil editorial en 4 rubriques. */}
                        <div className="relative w-full px-0 pt-3 pb-12">
                            <div className="relative z-10 space-y-5">{/* LABELMOTO_CONSEILS_ENCARTS_SOUS_ARIANE_20261110 */}
                                {([
                                    {id: 'latest', title: 'Les 3 derniers articles', description: 'Les nouvelles publications de Label Moto.', articles: landingGuides.latest},
                                    {id: 'a2', title: 'Permis A2', description: 'Première moto, permis et conseils pour bien débuter.', articles: landingGuides.a2},
                                    {id: 'budget', title: 'Maîtriser son budget', description: 'Assurance, dépenses et coût réel de la moto.', articles: landingGuides.budget},
                                    {id: 'comparisons', title: 'Comparatifs', description: 'Casques, motos, scooters et choix d’équipement.', articles: landingGuides.comparisons},
                                ] as const).map((section) => (
                                    <section key={section.id} aria-label={section.title} className="relative rounded-2xl bg-[#fbfcfc] p-4 shadow-sm ring-1 ring-black/[0.05] sm:p-5">
                                        <div className="border-b border-black/[0.07] pb-4">
                                            <h2 className="text-xl font-bold tracking-tight text-foreground">{section.title}</h2>
                                            <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                                        </div>
                                        {isLoading ? (
                                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                                                {Array.from({length: 3}, (_, index) => <Skeleton key={index} className="h-28 w-full rounded-xl" />)}
                                            </div>
                                        ) : section.articles.length ? (
                                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                                                {section.articles.map((article, index) => (
                                                    <ArticleCard key={article.id} article={article} compact eager={section.id === 'latest' && index === 0} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-5 text-sm text-muted-foreground">Aucun article de cette rubrique n'est encore disponible.</p>
                                        )}
                                    </section>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default function InfoPage() { 
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-brand mb-4" />
                <p className="font-semibold tracking-[0.04em] text-[10px] animate-pulse">Initialisation...</p>
            </div>
        }>
            <InfoPageComponent />
        </Suspense>
    ); 
}

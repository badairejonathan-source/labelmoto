'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircle2, Info, Loader2, 
  ChevronRight, Home, Gauge, Settings2, 
  ExternalLink, AlertTriangle, ArrowRight, LayoutGrid,
  Map,
  FileText,
  ShieldCheck,
  Bike,
  Zap,
  Wallet,
  HelpCircle,
  Clock,
  MapPin,
  Flag,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

import Header from '@/components/app/header';
import GuidesDesktopSidebar from '@/components/app/guides-desktop-sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase/client';
import { doc, collection, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const slugify = (text: string) => 
  text?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "";

const getRobustValue = (obj: any, preferredKeys: string[], defaultValue: string = "") => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  for (const key of preferredKeys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return String(obj[key]);
    }
  }
  const values = Object.values(obj).filter(v => typeof v === 'string' || typeof v === 'number');
  if (values.length > 0) return String(values[0]);
  return defaultValue;
};

const getFicheIdFromTitle = (title: string): string | null => {
  const t = typeof title === 'string' ? title.toLowerCase() : '';
  if (t.includes('mt-07')) return 'yamaha-mt-07-2021-plus';
  if (t.includes('z650')) return 'kawasaki-z650-2020-plus';
  if (t.includes('cb500 hornet') || t.includes('cb500f')) return 'honda-cb500f-2022-plus';
  if (t.includes('tracer 7')) return 'yamaha-tracer-7-2021-plus';
  if (t.includes('nx500')) return 'honda-nx500-2024-plus';
  if (t.includes('r7')) return 'yamaha-r7-2022-plus';
  if (t.includes('cbr500r')) return 'honda-cbr500r-2022-plus';
  if (t.includes('sv650')) return 'suzuki-sv650-2016-plus';

  if (t.includes('v-strom 650')) return 'suzuki-v-strom-650-2017-plus';
  if (t.includes('transalp') || t.includes('xl750')) return 'honda-xl750-transalp-2023-plus';
  if (t.includes('450 mt') || t.includes('450mt')) return 'cfmoto-450mt-2024-plus';
  if (t.includes('hornet 750') || t.includes('cb750')) return 'honda-cb750-hornet-2023-plus';
  if (t.includes('gsx-8s')) return 'suzuki-gsx-8s-2023-plus';
  if (t.includes('z900 a2')) return 'kawasaki-z900-a2-2020-plus';
  if (t.includes('g 310 r') || t.includes('g310r')) return 'bmw-g310r-2021-plus';

  if (t.includes('f900r')) return 'bmw-f900r-2020-plus';
  return null;
};

const InternalLinkCard = ({ title, description, link, icon: Icon }: any) => (
  <div className="mt-5 mb-7">
    <Link href={link} className="group/link block">
      <Card className="overflow-hidden rounded-2xl border border-border/70 border-l-4 border-l-brand bg-card shadow-sm transition-all hover:border-brand/40 hover:shadow-md">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-start gap-3 md:items-center">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 transition-colors group-hover/link:bg-brand/15 md:mt-0">
              <Icon className="h-4 w-4 text-brand" />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <h4 className="text-[15px] font-black leading-tight tracking-tight text-foreground">
                {title}
              </h4>

              <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
                {description}
              </p>

              <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-brand">
                Lire le guide
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  </div>
);

export default function ArticleClient({
  id,
  showHeader = true,
  children,
  initialArticle = null,
}: {
  id: string;
  showHeader?: boolean;
  children?: React.ReactNode;
  initialArticle?: any | null;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('TOUT');
  const [isFavoriteUpdating, setIsFavoriteUpdating] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const firestore = useFirestore();
  const articleRef = useMemoFirebase(() => firestore ? doc(firestore, 'articles', id) : null, [firestore, id]);
  const { data: liveArticle, isLoading } = useDoc(articleRef);
  const article = liveArticle ?? initialArticle;
  const isArticleLoading = isLoading && !initialArticle;

  const articleFavoriteId =
    id
      ? `articles__${id}`
      : null;

  const articleFavoriteRef = useMemoFirebase(
    () =>
      user &&
      firestore &&
      articleFavoriteId
        ? doc(
            firestore,
            'users',
            user.uid,
            'favorites',
            articleFavoriteId
          )
        : null,
    [firestore, user, articleFavoriteId]
  );

  const {
    data: articleFavorite,
    isLoading: isFavoriteLoading
  } = useDoc(articleFavoriteRef);

  const isArticleFavorite = !!articleFavorite;

  const handleArticleFavoriteClick = async () => {
    const currentPath = `/info/${id}`;

    if (!user) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(currentPath)}`
      );
      return;
    }

    if (
      !firestore ||
      !articleFavoriteRef ||
      !id ||
      isFavoriteUpdating
    ) {
      return;
    }

    setIsFavoriteUpdating(true);

    try {
      if (isArticleFavorite) {
        await deleteDoc(articleFavoriteRef);

        toast({
          title: 'Favori retir\u00e9',
          description:
            "Cet article a \u00e9t\u00e9 retir\u00e9 de vos favoris."
        });
      } else {
        await setDoc(
          articleFavoriteRef,
          {
            type: 'article',
            targetCollection: 'articles',
            targetId: id,
            addedAt: serverTimestamp()
          },
          { merge: true }
        );

        toast({
          title: 'Ajout\u00e9 aux favoris',
          description:
            'Vous retrouverez cet article dans votre espace compte.'
        });
      }
    } catch (error) {
      console.error(
        'Modification du favori article impossible',
        error
      );

      toast({
        variant: 'destructive',
        title: 'Favori impossible',
        description:
          "L'enregistrement n'a pas pu \u00eatre effectu\u00e9."
      });
    } finally {
      setIsFavoriteUpdating(false);
    }
  };

  const articlesListRef = useMemoFirebase(() => firestore ? collection(firestore, 'articles') : null, [firestore]);
  const { data: allArticles, isLoading: isArticlesListLoading } = useCollection(articlesListRef);

  const registerLink = user ? "/pro/register" : "/login";

  const otherArticles = useMemo(() => {
    if (!allArticles) return [];
    return allArticles
        .filter(a => a.id !== id && a.id !== 'entretien-moto-intervalles-prix-conseils-par-modele')
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
  }, [allArticles, id]);

  const imageUrl = useMemo(() => {
    if (!article) return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070";
    const articleId = id.toLowerCase();
    const title = (article.display_title || article.title || "").toLowerCase();

    if (articleId.includes('scooter') || title.includes('scooter')) return "/images/article-scooter-125.webp";
    if (articleId.includes('meilleurs-casques') && articleId.includes('entree')) return "/images/casques-entree-de-gamme-2026.webp";
    if (articleId.includes('meilleurs-casques') && articleId.includes('milieu')) return "/images/casques-milieu-de-gamme-2026.webp";
    if (articleId.includes('meilleurs-casques') && articleId.includes('haut')) return "/images/casques-haut-de-gamme-2026.webp";
    if (articleId.includes('meilleurs-casques')) return "/images/casque-meilleur-casque-2026.webp";
    if (articleId.includes('125') || title.includes('125')) return "/images/article-moto-125cc.webp";
    if (articleId.includes('association') || title.includes('association')) return "/images/article-motars-association.webp";
    if (articleId.includes('motogp') || id.includes('gp-france') || title.includes('motogp')) return "/images/article-lemans-motogp.webp";
    if (articleId.includes('zfe') || title.includes('zfe')) return "/images/motardZFEarticle2.webp";
    if (articleId.includes('taille') || title.includes('taille') || title.includes('hauteur')) return "/images/motard-articles-hauteurdeselle.webp";
    if (articleId.includes('assurance') || title.includes('assurance')) return "/images/motard-article-assurance20262.webp";
    if (articleId.includes('a2') || title.includes('a2')) return "/images/achat-occasion.webp";
    if (articleId.includes('occasion') || articleId.includes('pieges') || title.includes('pièges')) return "/images/evitelespieges.webp";
    if (articleId.includes('budget') || title.includes('budget')) return "/images/motard-budget-reel.webp";
    if (articleId.includes('entretien') || id.includes('entretien') || title.includes('révision')) return "/images/motard-entretien-page.webp";
    if (articleId.includes('relais')) return "/images/article-relais-motards.webp";
    
    if (article?.imageUrl && article.imageUrl.trim() !== '') {
      const value = article.imageUrl.trim();
      const labelMotoOrigin = 'https://labelmoto.fr';

      if (value.startsWith(`${labelMotoOrigin}/`)) {
        return value.slice(labelMotoOrigin.length);
      }

      return value;
    }
    return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070";
  }, [article, id]);

  const breadcrumbLd = useMemo(() => {
    if (!article) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": "https://labelmoto.fr"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Conseils",
          "item": "https://labelmoto.fr/info"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.display_title || article.title,
          "item": `https://labelmoto.fr/info/${id}`
        }
      ]
    };
  }, [article, id]);

  const activeSections = useMemo(() => {
    if (!article) return [];
    return article.sections || article.content || [];
  }, [article]);

  const isBudgetCarouselArticle =
    id === 'combien-coute-vraiment-une-moto-par-mois';

  const budgetCarouselRef = React.useRef<HTMLDivElement | null>(null);
  const previousBudgetSlideRef = React.useRef(0);
  const budgetCarouselScrollTimerRef = React.useRef<number | null>(null);

  useEffect(() => {
    previousBudgetSlideRef.current = 0;

    return () => {
      if (budgetCarouselScrollTimerRef.current !== null) {
        window.clearTimeout(budgetCarouselScrollTimerRef.current);
      }
    };
  }, [id]);

  const handleBudgetCarouselScroll = () => {
    if (!isBudgetCarouselArticle || window.innerWidth >= 768) {
      return;
    }

    const carousel = budgetCarouselRef.current;

    if (!carousel) {
      return;
    }

    if (budgetCarouselScrollTimerRef.current !== null) {
      window.clearTimeout(budgetCarouselScrollTimerRef.current);
    }

    budgetCarouselScrollTimerRef.current = window.setTimeout(() => {
      budgetCarouselScrollTimerRef.current = null;

      const slides = Array.from(carousel.children) as HTMLElement[];

      if (slides.length === 0) {
        return;
      }

      const carouselRect = carousel.getBoundingClientRect();
      const paddingLeft =
        Number.parseFloat(window.getComputedStyle(carousel).paddingLeft) || 0;
      const snapLeft = carouselRect.left + paddingLeft;

      let activeIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(
          slide.getBoundingClientRect().left - snapLeft
        );

        if (distance < smallestDistance) {
          smallestDistance = distance;
          activeIndex = index;
        }
      });

      if (previousBudgetSlideRef.current === activeIndex) {
        return;
      }

      previousBudgetSlideRef.current = activeIndex;

      window.requestAnimationFrame(() => {
        const currentCarousel = budgetCarouselRef.current;

        if (!currentCarousel) {
          return;
        }

        const header = document.querySelector('header');
        let stickyOffset = 0;

        if (header instanceof HTMLElement) {
          const headerPosition = window.getComputedStyle(header).position;

          if (
            headerPosition === 'fixed' ||
            headerPosition === 'sticky'
          ) {
            stickyOffset = header.getBoundingClientRect().height;
          }
        }

        const contentTop =
          window.scrollY +
          currentCarousel.getBoundingClientRect().top;

        window.scrollTo({
          top: Math.max(0, contentTop - stickyOffset - 12),
          behavior: 'smooth',
        });
      });
    }, 160);
  };

  const getCellValue = (row: any, header: string, colIndex: number) => {
    if (!row) return '';
    const normalize = (s: string) => String(s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
    const target = normalize(header);
    if (row[header] !== undefined) return row[header];
    const keys = Object.keys(row);
    const matchedKey = keys.find(k => normalize(k) === target);
    if (matchedKey) return row[matchedKey];
    const partialKey = keys.find(k => normalize(k).includes(target) || target.includes(normalize(k)));
    if (partialKey) return row[partialKey];
    if (Array.isArray(row)) return row[colIndex] || '';
    const values = Object.values(row);
    return values[colIndex] || '';
  };

  const renderTable = (tableData: any, key: string) => {
    if (!tableData) return null;
    const headers = tableData.headers || [];
    const rows = tableData.rows || [];
    return (
      <div key={key} className="my-6 md:my-8 overflow-hidden rounded-xl border-2 border-muted shadow-sm">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-muted/50">
              <TableRow>
                {headers.map((h: string, i: number) => (
                  <TableHead key={`th-${key}-${i}`} className="font-black text-foreground py-3 px-3 md:py-4 md:px-4 uppercase tracking-widest text-[8px] md:text-[10px] whitespace-nowrap">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any, ri: number) => (
                <TableRow key={`tr-${key}-${ri}`} className="hover:bg-muted/30">
                  {headers.map((header: string, hi: number) => (
                    <TableCell key={`td-${key}-${ri}-${hi}`} className="py-3 px-3 md:py-4 md:px-4 text-foreground font-black text-[10px] md:text-sm leading-tight whitespace-nowrap">
                      {String(getCellValue(row, header, hi))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderSchedule = (scheduleData: any, key: string) => {
    if (!scheduleData) return null;
    
    const title = scheduleData.title || "Programme & Horaires";
    const subtitle = scheduleData.subtitle || "";
    const broadcast = scheduleData.broadcast || "";
    const note = scheduleData.note || "";
    
    const CIRCUIT_BUGATTI_COORDS = { lat: 47.9546, lng: 0.2078 };

    let days = [];
    if (Array.isArray(scheduleData.items)) {
      days = scheduleData.items;
    } else if (Array.isArray(scheduleData.days)) {
      days = scheduleData.days;
    } else if (Array.isArray(scheduleData)) {
      days = scheduleData;
    } else if (typeof scheduleData === 'object') {
      const possibleDays = scheduleData.days || scheduleData.items || scheduleData;
      if (typeof possibleDays === 'object' && !Array.isArray(possibleDays)) {
          days = Object.entries(possibleDays).map(([label, sessions]) => ({
              label,
              sessions: Array.isArray(sessions) ? sessions : []
          }));
      }
    }

    if (days.length === 0) return null;

    const categories = ['TOUT', 'MOTOGP', 'MOTO2', 'MOTO3'];
    const filteredDays = days.map((day: any) => {
        const dayLabel = day.day || day.label || day.title || "";
        const rawSessions = day.sessions || (Array.isArray(day.items) ? day.items : (Array.isArray(day) ? day : []));
        
        const filteredSessions = rawSessions.filter((session: any) => {
            if (scheduleFilter === 'TOUT') return true;
            const sessionName = getRobustValue(session, ['name', 'label', 'event', 'session', 'titre', 'name']).toLowerCase();
            const target = scheduleFilter.toLowerCase().replace(/\s/g, '');
            const normalizedName = sessionName.replace(/\s/g, '');
            return normalizedName.includes(target);
        });

        return { dayLabel, filteredSessions };
    }).filter((day: { dayLabel: string; filteredSessions: any[] }) => day.filteredSessions.length > 0);

    return (
      <div key={key} className="my-10">
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
          <CardHeader className="bg-primary text-white p-8 pb-6">
            <div className="flex flex-col gap-2">
                <CardTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Clock className="h-6 w-6 md:h-8 w-8" /> {title}
                </CardTitle>
                {subtitle && <p className="text-xs md:text-sm font-bold opacity-80 uppercase tracking-widest">{subtitle}</p>}
            </div>
          </CardHeader>
          
          <div className="bg-muted/30 px-8 py-4 flex flex-wrap gap-2 border-b border-muted/50">
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={scheduleFilter === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setScheduleFilter(cat)}
                className={cn(
                  "rounded-full font-black uppercase text-[10px] h-8 px-5 transition-all",
                  scheduleFilter === cat ? "bg-brand text-white shadow-lg border-brand" : "bg-white text-muted-foreground hover:border-brand/50"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>

          {broadcast && (
            <div className="bg-brand/10 border-b border-brand/20 px-8 py-4 flex items-center gap-3">
                <Zap className="h-4 w-4 text-brand shrink-0" />
                <p className="text-xs font-black uppercase tracking-tight text-foreground">
                    <span className="text-brand">DIFFUSION TV :</span> {broadcast}
                </p>
            </div>
          )}

          <CardContent className="p-0">
            {filteredDays.map((day: any, dIdx: number) => (
              <div key={dIdx} className="border-b last:border-0 border-muted/50">
                {day.dayLabel && (
                  <div className="bg-muted/30 px-8 py-4">
                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-brand">{day.dayLabel}</p>
                  </div>
                )}
                <div className="divide-y divide-muted/30">
                  {day.filteredSessions.map((session: any, sIdx: number) => {
                    const time = getRobustValue(session, ['time', 'heure', 'h']);
                    const label = getRobustValue(session, ['label', 'event', 'session', 'titre', 'name']);
                    const type = session.type || "";
                    
                    return (
                      <div key={sIdx} className="px-8 py-6 flex items-center gap-6 group hover:bg-muted/10 transition-colors">
                        <div className="shrink-0 w-28 md:w-36">
                          <span className="text-base md:text-xl font-black text-foreground">{time}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm md:text-base font-bold text-foreground leading-tight uppercase tracking-tight group-hover:text-brand transition-colors">{label}</p>
                          {type && <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 block">{type}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {filteredDays.length === 0 && (
              <div className="py-20 text-center text-muted-foreground italic font-medium px-8">
                Aucune session trouvée pour la catégorie "{scheduleFilter}".
              </div>
            )}

            <div className="bg-muted/50 p-8 border-t border-muted">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="shrink-0 w-full md:w-48 aspect-square relative rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-muted group/map">
                        <Image src="/images/apercucartezoom.webp" alt="Carte" fill className="object-cover transition-transform group-hover/map:scale-110" loading="lazy"/>
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <MapPin className="h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Localisation de l'événement</h4>
                            <p className="text-lg font-black text-foreground uppercase tracking-tight leading-tight">Circuit Bugatti - Le Mans</p>
                            <p className="text-xs font-bold text-muted-foreground mt-1">Place Luigi Chinetti, 72000 Le Mans, France</p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <Button asChild size="sm" className="bg-brand hover:bg-brand/90 font-black uppercase text-[10px] rounded-full px-6">
                                <Link href={`/map?lat=${CIRCUIT_BUGATTI_COORDS.lat}&lng=${CIRCUIT_BUGATTI_COORDS.lng}&zoom=14&selectedId=circuit-bugatti-le-mans&search=Circuit Bugatti`}>
                                    <Map className="mr-2 h-3.5 w-3.5" /> Voir sur notre carte
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
          </CardContent>
          
          {note && (
            <CardFooter className="bg-muted/50 p-6 md:p-8 border-t border-muted/50">
                <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground italic leading-relaxed">{note}</p>
                </div>
          </CardFooter>
          )}
        </Card>
      </div>
    );
  };

  const renderCards = (cards: any[], keyPrefix: string) => {
    if (!cards || cards.length === 0) return null;
    return (
      <div key={keyPrefix} className="my-8">
        {cards.length > 1 && (
          <div className="mb-2 flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-brand md:hidden">
            <span>Glissez pour voir les autres</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </div>
        )}
        <div className="flex w-full max-w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:#f97316_#f4f4f5] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-500 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
        {cards.map((card, idx) => {
          const modelLabel = card.title || card.recommended_models?.[0] || card.models?.[0] || '';
          const ficheId = getFicheIdFromTitle(String(modelLabel));
          const listItems = card.models || card.recommended_models || card.items || card.points || card.guarantees || card.list;
          const strengths = card.strengths || card.advantages || card.pros || card.points_forts;
          const weaknesses = card.weaknesses || card.watch_out || card.cons || card.points_vigilance || card.limits;
          const usefulGuarantees = card.useful_guarantees || card.recommended_guarantees;
          const summary = card.summary || card.description || card.text || card.intro || card.content;
          const formula = card.formula || card.recommended_formula || card.recommended_option;
          return (
            <Card key={`${keyPrefix}-card-${idx}`} className="border-2 border-brand/20 overflow-hidden bg-card h-full flex flex-col shadow-md group/card hover:border-brand/50 transition-all rounded-3xl w-full max-w-full min-w-0 shrink-0 snap-start md:w-auto md:max-w-none">
              <CardHeader className="bg-brand/5 py-4 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground leading-tight">{card.title || "Information"}</CardTitle>
                  {(card.type || card.profile || card.subtitle) && <p className="text-[10px] font-black uppercase tracking-widest text-brand mt-1">{card.type || card.profile || card.subtitle}</p>}
                  {formula && (
                    <div className="mt-2 bg-brand text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="h-3 w-3" /> Formule conseillée : {formula}
                    </div>
                  )}
                </div>
                {ficheId && <ExternalLink className="h-4 w-4 text-brand/40 group-hover/card:text-brand" />}
              </CardHeader>
              {card.image && (
                <div className="relative w-full overflow-hidden bg-[#f8f7f5]" style={{aspectRatio:'4/3'}}>
                  <img src={card.image} alt={card.title || ''} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <CardContent className="p-6 space-y-6 flex-grow">
                {summary && <p className="text-sm font-bold text-foreground leading-relaxed italic border-l-4 border-brand/30 pl-4">{summary}</p>}
                {listItems && Array.isArray(listItems) && (
                  <ul className="space-y-2">
                    {listItems.map((item: any, i: number) => (
                      <li key={`${keyPrefix}-item-${idx}-${i}`} className="flex items-start gap-2 text-sm font-bold text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                        <span>{typeof item === 'string' ? item : (item.label || item.name || item.title || '')}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="space-y-4">
                  {usefulGuarantees && Array.isArray(usefulGuarantees) && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[9px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2"><Settings2 className="h-3.5 w-3.5" /> Garanties conseillées</div>
                      <ul className="list-none space-y-1">
                        {usefulGuarantees.map((s: string, i: number) => (
                          <li key={`${keyPrefix}-g-${idx}-${i}`} className="text-[10px] font-bold flex items-start gap-2 text-foreground">
                            <span className="text-blue-500">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {strengths && Array.isArray(strengths) && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Avantages</div>
                      <ul className="list-none space-y-1">{strengths && Array.isArray(strengths) && strengths.map((s: string, j: number) => (<li key={`${keyPrefix}-s-${idx}-${j}`} className="text-[10px] font-bold flex items-start gap-2 text-foreground"><span className="text-green-500">•</span> {s}</li>))}</ul>
                    </div>
                  )}
                  {weaknesses && Array.isArray(weaknesses) && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[9px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" /> Vigilance</div>
                      <ul className="list-none space-y-1">{weaknesses && Array.isArray(weaknesses) && weaknesses.map((s: string, j: number) => (<li key={`${keyPrefix}-w-${idx}-${j}`} className="text-[10px] font-bold flex items-start gap-2 text-foreground"><span className="text-orange-500">•</span> {s}</li>))}</ul>
                    </div>
                  )}
                </div>
              </CardContent>
              {ficheId && (
                <CardFooter className="bg-brand p-3 border-t-0">
                  <Link href={`/fiches/${ficheId}`} onClick={() => { if (typeof window !== 'undefined') window.sessionStorage.setItem(`labelmoto:fiche-return:${ficheId}`, `/info/${id}`); }} className="text-[10px] font-black uppercase tracking-widest text-white mx-auto hover:underline flex items-center gap-2">Voir la fiche technique <ChevronRight className="h-3 w-3" /></Link>
                </CardFooter>
              )}
            </Card>
          );
        })}
        </div>
      </div>
    );
  };

  const renderFaq = (faqData: any[], key: string) => {
    if (!faqData || !Array.isArray(faqData) || faqData.length === 0) return null;

    return (
      <div key={key} className="pt-8 mb-12">
        <div className="mb-5">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">
            Recherche rapide
          </div>
          <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-foreground">
            {'Questions fr\u00e9quentes'}
          </h3>
        </div>

        <div className="space-y-3">
          {faqData.map((item: any, index: number) => {
            const question = getRobustValue(item, ['question', 'q', 'titre', 'query']);
            const answer = getRobustValue(item, ['answer', 'a', 'reponse', 'content', 'response']);

            if (!question || !answer) return null;

            return (
              <details
                key={`${key}-faq-${index}`}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-sm font-black leading-snug text-foreground md:px-5 md:py-5">
                  <span className="min-w-0">
                    {question}
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xl font-black leading-none text-brand transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="border-t border-border/60 bg-muted/20 px-4 py-4 md:px-5 md:py-5">
                  <p className="text-sm font-normal leading-6 text-muted-foreground">
                    {answer}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCta = (cta: any, key: string, sectionId?: string) => {
    if (!cta) return null;

    const isStringCta = typeof cta === 'string';
    const ctaData = isStringCta ? { text: cta } : cta;

    const budgetArticleCtaTargets: Record<
      string,
      { target: string; title: string; text?: string }
    > = {
      'le-prix-d-achat-le-budget-de-depart': {
        target: 'meilleure-moto-a2-quelle-moto-choisir-pour-debuter',
        title: 'Quelle moto A2 choisir pour débuter ?',
      },
      'l-assurance-la-plus-grosse-surprise-pour-un-debutant': {
        target: 'assurance-moto-bien-choisir-sa-formule-selon-votre-profil',
        title: 'Bien choisir son assurance moto',
        text: 'Compare les formules et les garanties selon ton profil avant de choisir ta moto.',
      },
      'l-entretien-le-cout-invisible-qui-compte-vraiment': {
        target: 'achat-moto-occasion-guide-complet-pour-eviter-les-pieges',
        title: 'Acheter une moto d’occasion : éviter les pièges',
      },
    };

    const budgetOverride =
      id === 'combien-coute-vraiment-une-moto-par-mois' && sectionId
        ? budgetArticleCtaTargets[sectionId]
        : undefined;

    if (
      id === 'combien-coute-vraiment-une-moto-par-mois' &&
      isStringCta &&
      sectionId &&
      !budgetOverride
    ) {
      return (
        <div
          key={key}
          className="my-5 rounded-2xl border-l-4 border-brand bg-brand/5 px-4 py-4 text-sm font-medium leading-6 text-foreground"
        >
          {cta}
        </div>
      );
    }

    const label = ctaData.label || "Voir l'info";
    const targetSlug =
      budgetOverride?.target || ctaData.target_slug || ctaData.target;
    const title = budgetOverride?.title || ctaData.title || "";
    const text = budgetOverride?.text || ctaData.text || "";

    const isAssociationCta = targetSlug === 'carte-associations-moto' || label.toLowerCase().includes('association');
    const isRelaisCta = targetSlug === 'carte-relais-motards' || label.toLowerCase().includes('relais');
    const isRegistrationCta = label.toLowerCase().includes('ajouter mon association') || label.toLowerCase().includes('inscrire') || label.toLowerCase().includes('ajouter une adresse');

    const legacyArticleTargets: Record<string, string> = {
      'assurance-moto-2026-bien-choisir-sa-formule-selon-votre-profil':
        'assurance-moto-bien-choisir-sa-formule-selon-votre-profil',
      '/info/assurance-moto-2026-bien-choisir-sa-formule-selon-votre-profil':
        '/info/assurance-moto-bien-choisir-sa-formule-selon-votre-profil',
    };

    const normalizedTarget = targetSlug
      ? (legacyArticleTargets[targetSlug] || targetSlug)
      : '';

    let href = normalizedTarget
      ? (
          normalizedTarget.startsWith('http') ||
          normalizedTarget.startsWith('/')
            ? normalizedTarget
            : `/info/${normalizedTarget}`
        )
      : "/map";

    if (targetSlug === 'carte-associations-moto') {
        href = "/map?filter=association";
    } else if (targetSlug === 'carte-relais-motards') {
        href = "/map?filter=relais";
    }

    if (isRegistrationCta) {
      href = registerLink;
    }

    const isMapLink = href.includes('/map') || isAssociationCta || isRelaisCta;
    const isFicheLink = href.includes('/fiches/');
    const isMarqueLink = href.includes('/marque/');
    const CtaIcon = isMapLink ? Map : isFicheLink ? FileText : isMarqueLink ? MapPin : ArrowRight;
    const normalizedLabel = label
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

    const isGenericArticleLabel =
      normalizedLabel === 'decouvrir' ||
      normalizedLabel === 'en savoir plus';

    const shortLabel = isMapLink
      ? "Voir la carte"
      : isFicheLink
        ? "Voir la fiche"
        : isMarqueLink
          ? "Voir les concessions"
          : "Lire l'article";

    return (
      <div key={key} className="my-5">
        <Card className="overflow-hidden rounded-2xl border border-border/70 border-l-4 border-l-brand bg-card shadow-sm transition-all hover:border-brand/40 hover:shadow-md group/cta">
          <CardContent
            className={cn(
              "p-4 md:p-5 gap-3 md:flex md:flex-row md:items-center md:gap-4",
              !isMapLink && !isFicheLink && !isMarqueLink
                ? "grid grid-cols-[36px_minmax(0,1fr)] items-start"
                : "flex flex-col items-start"
            )}
          >
            {(isAssociationCta || isRelaisCta) && !isRegistrationCta ? (
              <div className="relative w-full max-w-[180px] md:w-28 aspect-video rounded-xl overflow-hidden border border-border/60 shadow-sm bg-muted shrink-0">
                  <Image src="/images/apercucartezoom.webp" alt="Carte Interactive" fill className="object-cover transition-transform duration-700 group-hover/cta:scale-110" loading="lazy"/>
              </div>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 group-hover/cta:bg-brand/15 transition-colors">
                <CtaIcon className="h-4 w-4 text-brand" />
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              {(title || label) && <h4 className="text-[15px] font-black leading-tight tracking-tight text-foreground">{title || label}</h4>}
              {(text || (!isMapLink && !isFicheLink && !isMarqueLink)) && (
                <p className="mt-1 text-xs font-normal text-muted-foreground leading-relaxed">
                  {text || "Consultez notre guide complet pour aller plus loin sur ce sujet."}
                </p>
              )}
            </div>
            <Link
              href={href}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-brand transition-colors hover:text-brand/80 md:self-center",
                !isMapLink && !isFicheLink && !isMarqueLink
                  ? "col-start-2"
                  : ""
              )}
            >
              {shortLabel}
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSection = (section: any, idx: number, key?: string) => {
    const sectionId = section.title ? slugify(section.title) : `section-${idx}`;
    let bodyText = section.content || section.text || section.description || section.intro || section.body;
    const fixText = (text: string) => typeof text === 'string' ? text.replace(/Mais en réalité/g, 'Car en réalité') : text;
    if (typeof bodyText === 'string') { bodyText = fixText(bodyText); } else if (Array.isArray(bodyText)) { bodyText = bodyText.map(p => fixText(p)); }
    const strengths = section.strengths || section.advantages || section.pros || section.points_forts;
    const weaknesses = section.weaknesses || section.limits || section.watch_out || section.cons || section.points_vigilance;
    const faq = section.faq || section.faqs;
    const cta = section.cta;
    const schedule = section.schedule_card || section.schedule;

    const isBudgetArticle = id === 'combien-coute-vraiment-une-moto-par-mois';
    const isAssuranceArticle = id === 'assurance-moto-bien-choisir-sa-formule-selon-votre-profil';
    const isGabaritArticle = id === 'quelle-moto-choisir-selon-sa-taille';

    const isBudgetNote = !isBudgetArticle && !cta && ((section.note && (section.note.includes("budget global") || section.note.includes("coût réel"))) || (sectionId.includes("budget")));
    const isAssuranceNote = !isAssuranceArticle && !cta && ((section.note && (section.note.includes("Assurance") || section.note.includes("formule"))) || (sectionId.includes("assurance")));
    const isGabaritNote = !isGabaritArticle && !cta && ((section.note && (section.note.includes("gabarit") || section.note.includes("tailles"))) || (sectionId.includes("taille") || sectionId.includes("hauteur") || sectionId.includes("gabarit")));

    return (
      <div
        key={key || sectionId}
        id={sectionId}
        className={cn(
          "mb-12 scroll-mt-28",
          isBudgetCarouselArticle &&
            !key &&
            "max-md:mb-0 max-md:w-[88vw] max-md:max-w-[88vw] max-md:flex-none max-md:snap-start max-md:rounded-[2rem] max-md:border max-md:border-border/70 max-md:bg-card max-md:p-5 max-md:shadow-sm"
        )}
      >
        {section.title && (
          <h2
            className={cn(
              "text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2",
              isBudgetCarouselArticle && !key && "max-md:mt-0 max-md:text-2xl"
            )}
          >
            {section.title}
          </h2>
        )}
        {section.image && (
          <div className="relative w-full overflow-hidden rounded-[2rem] mb-6 bg-[#f8f7f5] shadow-md" style={{ aspectRatio: '4/5' }}>
            <img src={section.image} alt={section.title || ''} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        {bodyText && (Array.isArray(bodyText) ? (bodyText.map((p: string, i: number) => <p key={`p-${sectionId}-${i}`} className="text-lg text-foreground font-normal leading-relaxed mb-6">{p}</p>)) : (<p className="text-lg text-foreground font-normal leading-relaxed mb-6">{bodyText}</p>))}
        
        {schedule && renderSchedule(schedule, `schedule-${sectionId}`)}
        
        {(strengths || weaknesses) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <Card className="border-2 border-green-100 bg-green-50/10 overflow-hidden shadow-sm rounded-3xl">
                    <CardHeader className="bg-green-50 py-4 border-b"><CardTitle className="text-lg font-black uppercase tracking-tight text-green-700 flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Avantages</CardTitle></CardHeader>
                    <CardContent className="p-6"><ul className="space-y-2">{strengths && Array.isArray(strengths) && strengths.map((s: string, j: number) => (<li key={`stre-${idx}-${j}`} className="text-sm font-bold flex items-start gap-2 text-foreground"><span className="text-green-500 shrink-0">•</span> {s}</li>))}</ul></CardContent>
                </Card>
                <Card className="border-2 border-red-100 bg-red-50/10 overflow-hidden shadow-sm rounded-3xl">
                    <CardHeader className="bg-red-50 py-4 border-b"><CardTitle className="text-lg font-black uppercase tracking-tight text-red-700 flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Limites</CardTitle></CardHeader>
                    <CardContent className="p-6"><ul className="space-y-2">{weaknesses && Array.isArray(weaknesses) && weaknesses.map((w: string, j: number) => (<li key={`weak-${idx}-${j}`} className="text-sm font-bold flex items-start gap-2 text-foreground"><span className="text-red-400 shrink-0">•</span> {w}</li>))}</ul></CardContent>
                </Card>
            </div>
        )}
        {section.table && renderTable(section.table, `table-${sectionId}`)}
        {section.cards && renderCards(section.cards, `cards-${sectionId}`)}
        {faq && renderFaq(faq, `faq-${sectionId}`)}
        {cta && renderCta(cta, `cta-${sectionId}`, sectionId)}
        {section.list && Array.isArray(section.list) && (<ul className="list-disc list-inside space-y-3 mb-8 pl-4">{section.list.map((item: string, li: number) => (<li key={`li-${sectionId}-${li}`} className="text-lg text-foreground font-medium">{item}</li>))}</ul>)}
        {section.ordered_list && Array.isArray(section.ordered_list) && (<ol className="list-decimal list-inside space-y-4 mb-8 pl-4">{section.ordered_list.map((item: string, oi: number) => (<li key={`ol-${sectionId}-${oi}`} className="text-lg text-foreground font-medium leading-relaxed pl-2">{item}</li>))}</ol>)}
        {section.subsections && Array.isArray(section.subsections) && (<div className={cn("space-y-10", section.subsections.length === 2 && "grid grid-cols-1 md:grid-cols-2 gap-8 space-y-0")}>{section.subsections.map((sub: any, si: number) => renderSection(sub, si, `sub-${sectionId}-${si}`))}</div>)}
        
        {(section.note || isBudgetNote || isAssuranceNote || isGabaritNote) && (
          <>
            {isBudgetNote ? (
              <InternalLinkCard 
                title="Combien coûte une moto par mois ?"
                description="Découvrez notre guide complet sur le budget réel : assurance, entretien, essence et imprévus."
                link="/info/combien-coute-vraiment-une-moto-par-mois"
                icon={Wallet}
              />
            ) : isAssuranceNote ? (
              <InternalLinkCard 
                title="Bien choisir son assurance"
                description="Le guide complet des formules 2026 : comparez les garanties et évitez les pièges."
                link="/info/assurance-moto-bien-choisir-sa-formule-selon-votre-profil"
                icon={ShieldCheck}
              />
            ) : isGabaritNote ? (
              <InternalLinkCard 
                title="Quelle moto pour ma taille ?"
                description="Le guide complet par gabarit pour trouver la hauteur de selle idéale."
                link="/info/quelle-moto-choisir-selon-sa-taille"
                icon={Bike}
              />
            ) : section.note ? (
              <div className="bg-brand/5 border-l-4 border-brand p-6 mt-4 mb-8 italic rounded-r-3xl shadow-sm text-foreground font-medium">
                {fixText(section.note)}
              </div>
            ) : null}
          </>
        )}
      </div>
    );
  };

  if (isArticleLoading || !article) return (
    <div className={showHeader ? "min-h-screen bg-background" : "min-h-screen bg-transparent"}>
        {showHeader && <Header searchTerm="" onSearchTermChange={() => {}} onSearch={() => {}} />}
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-6 pt-28">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-12 w-3/4" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-6">
                        <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
                        <div className="space-y-3"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-3/4" /></div>
                    </div>
                    <div className="lg:col-span-4 space-y-6"><Skeleton className="h-[250px] w-full rounded-[2.5rem]" /><Skeleton className="h-[180px] w-full rounded-[2rem]" /></div>
                </div>
            </div>
        </main>
    </div>
  );

  const rootSchedule = article.schedule_card || article.schedule;

  return (
    <div className={showHeader ? "min-h-screen relative bg-background" : "min-h-screen relative bg-transparent"}>
      {showHeader && (
        <div className="lg:sticky lg:top-0 lg:z-[2200]">
          <Header
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={() =>
              router.push(
                `/map?search=${encodeURIComponent(searchTerm)}`
              )
            }
            activeFilter={null}
            placeholderText="Recherche..."
          />
        </div>
      )}
      {showHeader && (
        <style>{`
          @media (min-width: 1024px) {
            .guides-desktop-article h1 {
              font-family: inherit !important;
              font-size: clamp(36px, 2.7vw, 46px) !important;
              font-weight: 700 !important;
              line-height: 1.03 !important;
              letter-spacing: -0.035em !important;
              text-transform: none !important;
            }

            .guides-desktop-article h2 {
              font-family: inherit !important;
              font-size: 30px !important;
              font-weight: 700 !important;
              line-height: 1.08 !important;
              letter-spacing: -0.03em !important;
              text-transform: none !important;
            }

            .guides-desktop-article h3 {
              font-family: inherit !important;
              font-size: 22px !important;
              font-weight: 600 !important;
              line-height: 1.15 !important;
              letter-spacing: -0.02em !important;
              text-transform: none !important;
            }

            .guides-desktop-article h4 {
              font-family: inherit !important;
              font-weight: 600 !important;
              line-height: 1.2 !important;
              letter-spacing: -0.015em !important;
              text-transform: none !important;
            }

            .guides-desktop-article p {
              font-family: inherit !important;
              font-size: 16px !important;
              font-weight: 400 !important;
              line-height: 1.62 !important;
            }

            .guides-desktop-article li {
              font-family: inherit !important;
              font-size: 16px !important;
              font-weight: 400 !important;
              line-height: 1.55 !important;
            }

            .guides-desktop-article strong {
              font-weight: 600 !important;
            }

            .guides-desktop-article a {
              font-weight: 600;
            }

            .guides-desktop-article th {
              font-weight: 600 !important;
            }

            .guides-desktop-article td {
              font-weight: 400 !important;
            }
          }
        `}</style>
      )}

      {breadcrumbLd && (
        <Script
          id="breadcrumb-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      
      <main
        className={cn(
          "container mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10",
          showHeader &&
            "lg:max-w-none lg:mx-0 lg:px-0 lg:py-0"
        )}
      >
        <div
          className={cn(
            "max-w-6xl mx-auto",
            showHeader &&
              "lg:max-w-none lg:mx-0 lg:ml-6 lg:mr-8 lg:pt-6 lg:grid lg:grid-cols-[394px_minmax(0,1fr)] lg:items-start lg:gap-6"
          )}
        >
          {showHeader && (
            <GuidesDesktopSidebar
              articles={allArticles}
              isLoading={isArticlesListLoading}
              currentId={id}
            />
          )}

          <div
            className={cn(
              "min-w-0",
              showHeader &&
                "lg:h-[calc(100vh-104px)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2 [scrollbar-width:thin]"
            )}
          >
          <div className={showHeader ? "guides-desktop-article" : undefined}>
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8 pt-6 md:pt-8">
            <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><Link href="/info" className="hover:text-brand shrink-0">Conseils</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{article.display_title || article.title}</span>
          </nav>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-6 text-foreground">
            {article.display_title || article.title}
          </h1>

          {showHeader && (
            <div className="-mt-2 mb-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  isFavoriteLoading ||
                  isFavoriteUpdating
                }
                onClick={handleArticleFavoriteClick}
                className={cn(
                  "rounded-full border-2 px-4 font-black uppercase tracking-widest text-[9px] transition-all",
                  isArticleFavorite
                    ? "border-brand bg-brand text-white hover:bg-brand/90 hover:text-white"
                    : "hover:border-brand hover:text-brand"
                )}
                aria-pressed={isArticleFavorite}
                aria-label={
                  isArticleFavorite
                    ? "Retirer cet article des favoris"
                    : "Ajouter cet article aux favoris"
                }
              >
                {isFavoriteUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Heart
                    className={cn(
                      "mr-2 h-4 w-4",
                      isArticleFavorite &&
                        "fill-current"
                    )}
                  />
                )}

                {isArticleFavorite
                  ? 'Dans mes favoris'
                  : 'Ajouter aux favoris'}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <article className="lg:col-span-8">
              <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl border-4 border-white bg-muted">
                  <Image 
                    src={imageUrl} 
                    alt={article.display_title || article.title} 
                    fill 
                    className="object-cover" 
                    priority 
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
              </div>

              {children && (<div className="mb-8">{children}</div>)}

              {article.intro && Array.isArray(article.intro) && (
                <div className="my-8 space-y-4">{article.intro.map((p: string, i: number) => (<p key={`intro-${i}`} className="text-lg leading-relaxed text-foreground font-medium">{p}</p>))}</div>
              )}

              {rootSchedule && renderSchedule(rootSchedule, "root-schedule")}
              
              {activeSections.length > 0 && activeSections.some((s: any) => s.title) && (
                <div className="my-8 p-8 bg-brand/5 rounded-[2rem] border-2 border-dashed border-brand/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none"><Image src="/images/logo-moto.webp" alt="" width={150} height={48} loading="lazy"/></div>
                  <div className="flex items-center gap-3 mb-6"><LayoutGrid className="h-5 w-5 text-brand" /><h2 className="text-[10px] font-black uppercase tracking-[0.5em] m-0 text-muted-foreground">Au sommaire :</h2></div>
                  <nav><ul className="space-y-4">{activeSections.map((section: any, idx: number) => { if (!section.title) return null; const sectionId = slugify(section.title); return (<li key={`toc-${idx}`} className="group/item"><a href={`#${sectionId}`} className="flex items-center gap-4 text-base font-black text-foreground hover:text-brand transition-all"><div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0 group-hover/item:bg-brand group-hover/item:text-white transition-colors shadow-sm"><CheckCircle2 className="h-3.5 w-3.5" /></div><span className="border-b-2 border-transparent group-hover/item:border-brand/30 pb-0.5">{section.title}</span></a></li>); })}</ul></nav>
                </div>
              )}

              {isBudgetCarouselArticle && (
                <div className="mb-3 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground md:hidden">
                  <span>{activeSections.length} parties</span>
                  <span className="text-brand">Glisse pour lire →</span>
                </div>
              )}

              <div
                ref={isBudgetCarouselArticle ? budgetCarouselRef : undefined}
                onScroll={
                  isBudgetCarouselArticle
                    ? handleBudgetCarouselScroll
                    : undefined
                }
                className={cn(
                  "space-y-3",
                  isBudgetCarouselArticle &&
                    "max-md:-mx-4 max-md:flex max-md:items-start max-md:gap-4 max-md:space-y-0 max-md:overflow-x-auto max-md:overscroll-x-contain max-md:snap-x max-md:snap-mandatory max-md:scroll-smooth max-md:px-4 max-md:pb-4"
                )}
              >
                {activeSections.map((section: any, idx: number) =>
                  renderSection(section, idx)
                )}
              </div>
              
              {(article.faq || article.faqs) && renderFaq(article.faq || article.faqs, "article-faq")}

              {article.conclusion && (
                  <div className="mt-16 pt-8 border-t border-brand/20">
                      <div className="flex items-center gap-3 mb-6"><Info className="h-6 w-6 text-brand" /><h3 className="text-2xl font-black uppercase m-0 text-foreground">Le mot de la fin</h3></div>
                      <div className="space-y-4">{Array.isArray(article.conclusion) ? (article.conclusion.map((line: string, i: number) => (<p key={`conc-${i}`} className="text-lg text-foreground font-medium leading-relaxed">{line}</p>))) : (<p className="text-lg text-foreground font-medium leading-relaxed">{article.conclusion}</p>)}</div>
                      <div className="flex justify-end items-center mt-12"><p className="text-lg font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p><Image src="/images/Stamp-LM.webp" alt="Signature" width={110} height={110} className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-10" loading="lazy"/></div>
                  </div>
              )}
            </article>

            <aside className="lg:col-span-4 relative">
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                  <CardHeader className="bg-brand text-white p-5"><CardTitle className="flex items-center gap-3 uppercase font-black tracking-widest text-sm"><Map className="h-5 w-5" /> Trouver un pro</CardTitle></CardHeader>
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden border-4 border-muted shadow-lg group cursor-pointer" onClick={() => router.push('/map')}>
                      <Image src="/images/apercucartezoom.webp" alt="Carte Interactive" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" sizes="(max-width: 1024px) 100vw, 400px" loading="lazy"/>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-8 w-8 text-white" /></div>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground leading-snug italic">"Dénichez l'atelier idéal ou la concession de vos rêves en quelques secondes."</p>
                    <Button asChild className="w-full bg-brand hover:bg-brand/90 text-white font-black uppercase tracking-widest text-[9px] py-2 h-auto rounded-full shadow-sm transition-colors">
                      <Link href="/map">Voir la carte</Link>
                    </Button>
                  </CardContent>
                </Card>

                <div className="bg-muted/30 rounded-[2.5rem] p-8 border border-border/50">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-brand" /> À LIRE AUSSI
                    </h3>
                    <div className="space-y-4">
                        {isArticlesListLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                            ))
                        ) : (
                            otherArticles.map((art: any) => (
                                <Link key={art.id} href={`/info/${art.id}`} className="group block pb-4 border-b border-border/50 last:border-0 last:pb-0">
                                    <h4 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-brand transition-colors line-clamp-2 leading-tight">
                                        {art.display_title || art.title}
                                    </h4>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-1 line-clamp-1 opacity-70">
                                        Par {art.author || "L'équipe Label Moto"}
                                    </p>
                                </Link>
                            ))
                        )}
                        {(!isArticlesListLoading && otherArticles.length === 0) && (
                            <p className="text-xs italic text-muted-foreground font-medium">D'autres guides arrivent bientôt !</p>
                        )}
                    </div>
                    <div className="mt-8">
                        <Button asChild variant="ghost" className="w-full h-auto py-4 rounded-full border-2 border-dashed border-muted-foreground/20 hover:border-brand/50 hover:bg-brand/5 text-[9px] font-black uppercase tracking-widest transition-all">
                            <Link href="/info">Voir tous les conseils <ArrowRight className="ml-2 h-3 w-3" /></Link>
                        </Button>
                    </div>
                </div>
              </div>
            </aside>
          </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}


'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, Map, CheckCircle2, Info, Loader2, FileText, 
  ChevronRight, Home, HelpCircle, Gauge, Scale, Settings2, 
  ExternalLink, AlertTriangle, ShieldCheck, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

import Header from '@/components/app/header';
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
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Fallback data
import localArticles from '@/app/data/articles.json';

const slugify = (text: string) => 
  text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

const getFicheIdFromTitle = (title: string): string | null => {
  const t = title.toLowerCase();
  if (t.includes('mt-07')) return 'yamaha-mt-07-2021-plus';
  if (t.includes('z650')) return 'kawasaki-z650-2020-plus';
  if (t.includes('cb500 hornet') || t.includes('cb500f')) return 'honda-cb500f-2022-plus';
  if (t.includes('tracer 7')) return 'yamaha-tracer-7-2021-plus';
  if (t.includes('nx500') || t.includes('cb500x')) return 'honda-nx500-2024-plus';
  if (t.includes('r7')) return 'yamaha-r7-2022-plus';
  if (t.includes('cbr500r')) return 'honda-cbr500r-2022-plus';
  if (t.includes('sv650')) return 'suzuki-sv650-2016-plus';
  if (t.includes('cmx500') || t.includes('rebel 500')) return 'honda-cmx500-rebel';
  return null;
};

export default function ArticleClient({ id }: { id: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const firestore = useFirestore();
  const articleRef = useMemoFirebase(() => doc(firestore, 'articles', id), [firestore, id]);
  const { data: firestoreArticle, isLoading: isDbLoading } = useDoc(articleRef);

  const article = useMemo(() => {
    if (firestoreArticle && Object.keys(firestoreArticle).length > 5) return firestoreArticle;
    return (localArticles as any[]).find(a => a.id === id || a.slug === id) || null;
  }, [firestoreArticle, id]);

  const imageUrl = useMemo(() => {
    const articleId = id.toLowerCase();
    if (articleId.includes('taille')) return "/images/motard-articles-hauteurdeselle.png";
    if (articleId.includes('assurance')) return "/images/motard-article-assurance2026.png";
    if (articleId.includes('a2')) return "/images/achat-occasion.png";
    if (articleId.includes('occasion') || articleId.includes('pieges')) return "/images/evitelespieges.png";
    
    if (article?.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
    return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";
  }, [article, id]);

  const activeSections = useMemo(() => {
    if (!article) return [];
    return article.sections || article.content || [];
  }, [article]);

  const allSummaryPoints = useMemo(() => {
    const points: { title: string; id: string }[] = [];
    if (!activeSections) return points;
    activeSections.forEach((s: any) => {
      if (s.title) {
        points.push({ title: s.title, id: slugify(s.title) });
      }
    });
    return points;
  }, [activeSections]);
  
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const renderTable = (tableData: any) => {
    if (!tableData) return null;
    const headers = tableData.headers || [];
    const rows = tableData.rows || [];

    const normalize = (s: string) => 
        String(s).toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "");

    return (
      <div className="my-6 md:my-8 overflow-hidden rounded-xl border-2 border-muted shadow-sm">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-muted/50">
              <TableRow>
                {headers.map((h: string, i: number) => (
                  <TableHead key={i} className="font-black text-foreground py-3 px-3 md:py-4 md:px-4 uppercase tracking-widest text-[8px] md:text-[10px] whitespace-nowrap">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any, ri: number) => (
                <TableRow key={ri} className="hover:bg-muted/30">
                  {headers.map((header: string, hi: number) => {
                    const normHeader = normalize(header);
                    let val = '';
                    if (row[header] !== undefined) val = row[header];
                    else {
                      const foundKey = Object.keys(row).find(k => normalize(k) === normHeader);
                      if (foundKey) val = row[foundKey];
                      else if (Array.isArray(row)) val = row[hi];
                    }
                    return (
                      <TableCell key={hi} className="py-3 px-3 md:py-4 md:px-4 text-foreground font-black text-[10px] md:text-sm leading-tight">
                        {String(val || '')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderCtaBlock = (cta: any) => {
    if (!cta) return null;
    
    let ctaData = cta;

    if (typeof cta === 'string') {
      const text = cta.toLowerCase();
      if (text.includes('assurance')) {
        ctaData = {
          header: "DOSSIER SPÉCIAL ASSURANCE",
          label: "BIEN CHOISIR SON ASSURANCE MOTO →",
          description: "Tiers, Tiers Plus ou Tous Risques ? Découvrez la formule idéale.",
          target_slug: "assurance-moto-2026-bien-choisir-sa-formule-selon-votre-profil"
        };
      } else if (text.includes('meilleures motos a2') || text.includes('achat moto a2')) {
        ctaData = {
          header: "OBJECTIF PERMIS A2",
          label: "QUELLE MOTO CHOISIR POUR DÉBUTER ? →",
          description: "Trouvez la machine idéale pour commencer sans vous tromper.",
          target_slug: "meilleure-moto-a2-quelle-moto-choisir-pour-debuter"
        };
      } else if (text.includes('occasion') || text.includes('pièges')) {
        ctaData = {
          header: "GUIDE ACHAT OCCASION",
          label: "ÉVITER LES PIÈGES EN OCCASION →",
          description: "Inspection, papiers, essai : tout ce qu'il faut savoir avant d'acheter.",
          target_slug: "achat-moto-occasion-guide-complet-pour-eviter-les-pieges"
        };
      } else if (text.includes('combien coûte vraiment une moto') || text.includes('budget')) {
        ctaData = {
          header: "DOSSIER SPÉCIAL BUDGET",
          label: "CALCULER MON BUDGET RÉEL →",
          description: "Assurance, entretien, équipement : ne laissez rien au hasard.",
          target_slug: "combien-coute-vraiment-une-moto-par-mois"
        };
      } else if (text.includes('taille') || text.includes('gabarit')) {
        ctaData = {
          header: "GUIDE MORPHOLOGIE",
          label: "QUELLE MOTO SELON VOTRE TAILLE ? →",
          description: "De 1m55 à 1m95, trouvez la moto adaptée à votre gabarit.",
          target_slug: "quelle-moto-choisir-selon-sa-taille"
        };
      } else {
        return (
          <div className="bg-brand/5 border-l-4 border-brand p-4 mb-8 italic rounded-r-lg shadow-sm text-foreground font-bold">
            {cta}
          </div>
        );
      }
    }

    const isInsurance = ctaData.target_slug?.includes('assurance') || ctaData.header?.includes('ASSURANCE');
    
    let thumbnailUrl = "";
    const slug = ctaData.target_slug;
    if (slug?.includes('assurance')) thumbnailUrl = "/images/motard-article-assurance2026.png";
    else if (slug?.includes('a2')) thumbnailUrl = "/images/achat-occasion.png";
    else if (slug?.includes('occasion') || slug?.includes('pieges')) thumbnailUrl = "/images/evitelespieges.png";
    else if (slug?.includes('taille')) thumbnailUrl = "/images/motard-articles-hauteurdeselle.png";
    else if (slug?.includes('budget')) thumbnailUrl = "https://images.unsplash.com/photo-1572452571879-3d67d5b2a39f?q=80&w=1080";
    else thumbnailUrl = "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070";

    return (
      <div className={cn(
        "mt-4 mb-8 border-2 border-dashed rounded-2xl transition-all hover:shadow-lg overflow-hidden",
        isInsurance ? "bg-blue-50/50 border-blue-200" : "bg-brand/5 border-brand/20"
      )}>
        <Link href={`/info/${ctaData.target_slug}`} className="group flex flex-col sm:flex-row items-stretch">
          <div className="relative w-full sm:w-32 md:w-44 aspect-video sm:aspect-square overflow-hidden bg-muted shrink-0 border-b sm:border-b-0 sm:border-r border-dashed border-muted">
            <Image src={thumbnailUrl} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
            {ctaData.header && (
              <p className={cn(
                "text-[9px] font-black uppercase tracking-widest mb-1.5",
                isInsurance ? "text-blue-600" : "text-brand"
              )}>
                {ctaData.header}
              </p>
            )}
            <h4 className={cn(
              "text-base md:text-xl font-black uppercase tracking-tight text-foreground transition-colors leading-tight",
              isInsurance ? "group-hover:text-blue-600" : "group-hover:text-brand"
            )}>
              {ctaData.label}
            </h4>
            {ctaData.description && (
              <p className="text-xs text-muted-foreground mt-2 font-medium leading-relaxed line-clamp-2">
                {ctaData.description}
              </p>
            )}
          </div>
          <div className="hidden md:flex items-center pr-6">
            <div className={cn(
              "text-white p-3.5 rounded-full shadow-xl group-hover:scale-110 transition-transform shrink-0",
              isInsurance ? "bg-blue-600" : "bg-brand"
            )}>
              {isInsurance ? <ShieldCheck className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const renderCards = (cards: any[]) => {
    if (!cards || cards.length === 0) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {cards.map((card, idx) => {
          const ficheId = getFicheIdFromTitle(card.title || card.recommended_models?.[0] || '');
          return (
            <Card key={idx} className="border-2 border-brand/20 overflow-hidden bg-card h-full flex flex-col shadow-md group/card hover:border-brand/50 transition-all">
              <CardHeader className="bg-brand/5 py-4 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground">{card.title}</CardTitle>
                  {(card.type || card.profile) && <p className="text-[10px] font-black uppercase tracking-widest text-brand mt-1">{card.type || card.profile}</p>}
                </div>
                {ficheId && <ExternalLink className="h-4 w-4 text-brand/40 group-hover/card:text-brand" />}
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-grow">
                {card.summary && <p className="text-sm font-bold text-foreground leading-relaxed italic border-l-4 border-brand/30 pl-4">{card.summary}</p>}
                {card.recommended_models && (
                  <div className="flex flex-wrap gap-2">
                    {card.recommended_models.map((m: string, i: number) => {
                      const mFicheId = getFicheIdFromTitle(m);
                      return mFicheId ? (
                        <Link key={i} href={`/fiches/${mFicheId}?from=${id}`} className="text-[10px] font-black uppercase bg-muted px-2 py-1 rounded hover:bg-brand/10 hover:text-brand transition-colors flex items-center gap-1">{m} <ExternalLink className="h-2.5 w-2.5" /></Link>
                      ) : (<span key={i} className="text-[10px] font-black uppercase bg-muted px-2 py-1 rounded">{m}</span>)
                    })}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {card.seat_feel && <div className="space-y-1"><p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Assise</p><p className="text-[10px] font-black uppercase">{card.seat_feel}</p></div>}
                  {card.weight_feel && <div className="space-y-1"><p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Poids</p><p className="text-[10px] font-black uppercase">{card.weight_feel}</p></div>}
                </div>
                {(card.strengths || card.advantages) && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Points forts</div>
                    <ul className="list-none space-y-1">{(card.strengths || card.advantages).map((s: string, i: number) => (<li key={i} className="text-[10px] font-bold flex items-start gap-2"><span className="text-green-500">•</span> {s}</li>))}</ul>
                  </div>
                )}
                {card.our_opinion && <div className="bg-muted/30 p-3 rounded-lg border border-border/50 mt-auto"><p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">L'avis Label Moto</p><p className="text-[10px] font-bold text-foreground italic">"{card.our_opinion}"</p></div>}
              </CardContent>
              {ficheId && (
                <CardFooter className="bg-brand/5 p-3 border-t">
                  <Link href={`/fiches/${ficheId}?from=${id}`} className="text-[10px] font-black uppercase tracking-widest text-brand mx-auto hover:underline flex items-center gap-2">Voir la fiche technique <ChevronRight className="h-3 w-3" /></Link>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  const renderSection = (section: any, idx: number) => {
    const sectionId = section.title ? slugify(section.title) : `section-${idx}`;
    const bodyText = section.content || section.text || section.description;
    return (
      <div key={idx} id={sectionId} className="mb-12 scroll-mt-28">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        {section.cta && renderCtaBlock(section.cta)}
        {bodyText && (Array.isArray(bodyText) ? (bodyText.map((p: string, i: number) => <p key={i} className="text-lg text-foreground font-bold leading-relaxed mb-6">{p}</p>)) : (<p className="text-lg text-foreground font-bold leading-relaxed mb-6">{bodyText}</p>))}
        {section.table && renderTable(section.table)}
        {section.cards && renderCards(section.cards)}
        {section.list && Array.isArray(section.list) && (<ul className="list-disc list-inside space-y-3 mb-8 pl-4">{section.list.map((item: string, li: number) => (<li key={li} className="text-lg text-foreground font-black">{item}</li>))}</ul>)}
        {section.ordered_list && Array.isArray(section.ordered_list) && (<ol className="list-decimal list-inside space-y-3 mb-8 pl-4">{section.ordered_list.map((item: string, li: number) => (<li key={li} className="text-lg text-foreground font-black">{item}</li>))}</ol>)}
        {section.subsections && Array.isArray(section.subsections) && (<div className="space-y-6">{section.subsections.map((sub: any, si: number) => renderSection(sub, si))}</div>)}
      </div>
    );
  };

  if (isDbLoading && !article) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-brand mb-4" /><p className="text-muted-foreground font-black animate-pulse uppercase tracking-widest text-[10px]">Chargement de l'article...</p></div>);
  if (!article) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4"><h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Article non trouvé</h1><p className="text-muted-foreground mb-8">Nous n'avons pas trouvé l'article demandé.</p><Button asChild className="rounded-full px-8 font-black uppercase tracking-widest text-xs"><Link href="/info">Retour aux articles</Link></Button></div>);

  return (
    <div className="min-h-screen relative">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={handleSearch} activeFilter={null} placeholderText="Recherche par departement , ville , marque, nom ... " />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8 overflow-hidden whitespace-nowrap"><Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link><ChevronRight className="h-3 w-3 shrink-0" /><Link href="/info" className="hover:text-brand shrink-0">Conseils</Link><ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{article.display_title || article.title}</span></nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <article>
                <div className="relative w-full aspect-video md:aspect-[2/1] rounded-3xl overflow-hidden mb-12 shadow-2xl border-4 border-white bg-muted group">
                    <Image src={imageUrl} alt={article.display_title || article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-2 drop-shadow-lg max-w-[95%]">{article.display_title || article.title}</h1>
                        <div className="flex items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-90"><span>Par {article.author || "L'équipe Label Moto"}</span></div>
                    </div>
                </div>
                {article.intro && Array.isArray(article.intro) && (<div className="mb-12 space-y-4">{article.intro.map((p: string, i: number) => (<p key={i} className="text-xl leading-relaxed text-foreground font-black">{p}</p>))}</div>)}
                {article.intro_points && (
                    <div className="my-8 p-6 bg-brand/5 rounded-2xl border-2 border-dashed border-brand/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-4">Ce que vous allez apprendre :</p>
                        <ul className="list-none space-y-3 pl-0">
                            {article.intro_points.map((pt: string, i: number) => {
                                const ptLower = pt.toLowerCase();
                                const bestSection = activeSections.find((s: any) => s.title && (ptLower.includes(s.title.toLowerCase().substring(0, 15)) || s.title.toLowerCase().includes(ptLower.substring(0, 15))));
                                const sectionId = bestSection ? slugify(bestSection.title) : null;
                                return (
                                    <li key={i} className="flex items-center gap-3 text-lg text-foreground font-black group/item">
                                        <CheckCircle2 className="h-5 w-5 text-brand shrink-0 group-hover/item:scale-110 transition-transform" />
                                        {sectionId ? (<a href={`#${sectionId}`} className="hover:text-brand transition-all hover:translate-x-1 decoration-brand/30 underline-offset-4 hover:underline">{pt}</a>) : (<span className="text-foreground">{pt}</span>)}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                <div className="space-y-12">{activeSections.map((section: any, idx: number) => renderSection(section, idx))}</div>
                {article.faq && (
                  <div className="mt-16 pt-8 border-t border-brand/20">
                    <div className="flex items-center gap-3 mb-6"><HelpCircle className="h-6 w-6 text-brand" /><h3 className="text-2xl font-black uppercase m-0 text-foreground">Questions fréquentes</h3></div>
                    <Accordion type="single" collapsible className="w-full">
                      {article.faq.map((item: any, idx: number) => (
                        <AccordionItem key={idx} value={`faq-${idx}`} className="border-b-brand/10">
                          <AccordionTrigger className="text-left font-bold text-foreground py-4 hover:text-brand transition-colors">{item.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pb-4 font-medium">{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
                {article.conclusion && (
                    <div className="mt-16 pt-8 border-t border-brand/20">
                        <div className="flex items-center gap-3 mb-6"><Info className="h-6 w-6 text-brand" /><h3 className="text-2xl font-black uppercase m-0 text-foreground">Le mot de la fin</h3></div>
                        <div className="space-y-4">{Array.isArray(article.conclusion) ? (article.conclusion.map((line: string, i: number) => (<p key={i} className="text-lg text-foreground font-black leading-relaxed">{line}</p>))) : (<p className="text-lg text-foreground font-black leading-relaxed">{article.conclusion}</p>)}</div>
                        <div className="flex justify-end items-center mt-12"><p className="text-lg font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p><Image src="/images/Stamp-LM.png?v=2" alt="Signature" width={120} height={120} className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-12" /></div>
                    </div>
                )}
              </article>
            </div>
            <aside className="lg:col-span-4 relative">
              <div className="md:sticky md:top-28 space-y-6">
                <Card className="overflow-hidden shadow-2xl border-none bg-card/50 backdrop-blur-md rounded-3xl ring-1 ring-white/20">
                  <CardHeader className="p-6 bg-brand text-brand-foreground">
                    <CardTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-widest"><Map className="h-6 w-6"/>Trouver un pro</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Link href="/map" className="block group rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                      <Image src="/images/apercucartezoom.png" alt="Aperçu de la carte" width={400} height={300} className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110" />
                    </Link>
                    <p className="text-muted-foreground text-sm mt-6 font-medium leading-relaxed">Accédez à notre carte interactive pour trouver les meilleures concessions et ateliers moto en France.</p>
                  </CardContent>
                  <CardFooter className="px-6 pb-8">
                    <Button asChild className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs tracking-widest py-6 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95">
                      <Link href="/map">Voir la carte interactive</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  const { data: article, isLoading } = useDoc(articleRef);

  const imageUrl = useMemo(() => {
    if (!article) return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";
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

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
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
                  <TableHead key={i} className="font-black text-foreground py-3 px-3 md:py-4 md:px-4 uppercase tracking-widest text-[8px] md:text-[10px] whitespace-nowrap">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any, ri: number) => (
                <TableRow key={ri} className="hover:bg-muted/30">
                  {headers.map((header: string, hi: number) => (
                    <TableCell key={hi} className="py-3 px-3 md:py-4 md:px-4 text-foreground font-black text-[10px] md:text-sm leading-tight">
                      {String(row[header] || row[hi] || '')}
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

  const renderCtaBlock = (cta: any, key: string) => {
    if (!cta) return null;
    
    const isInsurance = cta.target_slug?.includes('assurance') || cta.header?.includes('ASSURANCE') || cta.title?.toLowerCase().includes('assurance');
    
    let thumbnailUrl = "";
    const slug = cta.target_slug;
    if (slug?.includes('assurance')) thumbnailUrl = "/images/motard-article-assurance2026.png";
    else if (slug?.includes('a2')) thumbnailUrl = "/images/achat-occasion.png";
    else if (slug?.includes('occasion') || slug?.includes('pieges')) thumbnailUrl = "/images/evitelespieges.png";
    else if (slug?.includes('taille')) thumbnailUrl = "/images/motard-articles-hauteurdeselle.png";
    else if (slug?.includes('budget')) thumbnailUrl = "https://images.unsplash.com/photo-1572452571879-3d67d5b2a39f?q=80&w=1080";
    else if (slug?.includes('entretien')) thumbnailUrl = "/images/motard-entretien-page.png";
    else thumbnailUrl = "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070";

    return (
      <div key={key} className={cn(
        "mt-4 mb-8 border-2 border-dashed rounded-2xl transition-all hover:shadow-lg overflow-hidden",
        isInsurance ? "bg-blue-50/50 border-blue-200" : "bg-brand/5 border-brand/20"
      )}>
        <Link href={`/info/${cta.target_slug || cta.id || '#'}`} className="group flex flex-col sm:flex-row items-stretch">
          <div className="relative w-full sm:w-32 md:w-44 aspect-video sm:aspect-square overflow-hidden bg-muted shrink-0 border-b sm:border-b-0 sm:border-r border-dashed border-muted">
            <Image src={thumbnailUrl} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
            {(cta.header || cta.title) && (
              <p className={cn(
                "text-[9px] font-black uppercase tracking-widest mb-1.5",
                isInsurance ? "text-blue-600" : "text-brand"
              )}>
                {cta.header || cta.title}
              </p>
            )}
            <h4 className={cn(
              "text-base md:text-xl font-black uppercase tracking-tight text-foreground transition-colors leading-tight",
              isInsurance ? "group-hover:text-blue-600" : "group-hover:text-brand"
            )}>
              {cta.label || cta.display_title || "Découvrir le guide"}
            </h4>
            {cta.text && (
              <p className="text-xs text-muted-foreground mt-2 font-medium leading-relaxed line-clamp-2">
                {cta.text}
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

  const renderCards = (cards: any[], keyPrefix: string) => {
    if (!cards || cards.length === 0) return null;
    return (
      <div key={keyPrefix} className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {cards.map((card, idx) => {
          const modelLabel = card.title || card.recommended_models?.[0] || '';
          const ficheId = getFicheIdFromTitle(typeof modelLabel === 'string' ? modelLabel : '');
          return (
            <Card key={`${keyPrefix}-${idx}`} className="border-2 border-brand/20 overflow-hidden bg-card h-full flex flex-col shadow-md group/card hover:border-brand/50 transition-all">
              <CardHeader className="bg-brand/5 py-4 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground">{card.title}</CardTitle>
                  {(card.type || card.profile || card.subtitle) && <p className="text-[10px] font-black uppercase tracking-widest text-brand mt-1">{card.type || card.profile || card.subtitle}</p>}
                </div>
                {ficheId && <ExternalLink className="h-4 w-4 text-brand/40 group-hover/card:text-brand" />}
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-grow">
                {card.summary && <p className="text-sm font-bold text-foreground leading-relaxed italic border-l-4 border-brand/30 pl-4">{card.summary}</p>}
                {card.recommended_formula && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200">
                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 mb-1">Formule conseillée</p>
                    <p className="text-sm font-black text-blue-700">{card.recommended_formula}</p>
                  </div>
                )}
                {card.items && Array.isArray(card.items) && (
                  <ul className="space-y-2">
                    {card.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {card.linked_models && (
                  <div className="flex flex-wrap gap-2">
                    {card.linked_models.map((m: any, i: number) => {
                      const modelFicheId = m.slug || getFicheIdFromTitle(m.label);
                      return modelFicheId ? (
                        <Link key={i} href={`/fiches/${modelFicheId}?from=${id}`} className="text-[10px] font-black uppercase bg-muted px-2 py-1 rounded hover:bg-brand/10 hover:text-brand transition-colors flex items-center gap-1">{m.label} <ExternalLink className="h-2.5 w-2.5" /></Link>
                      ) : (<span key={i} className="text-[10px] font-black uppercase bg-muted px-2 py-1 rounded">{m.label}</span>)
                    })}
                  </div>
                )}
                {(card.strengths || card.advantages) && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> {card.advantages ? "Avantages" : "Points forts"}</div>
                    <ul className="list-none space-y-1">{(card.strengths || card.advantages).map((s: string, i: number) => (<li key={i} className="text-[10px] font-bold flex items-start gap-2"><span className="text-green-500">•</span> {s}</li>))}</ul>
                  </div>
                )}
                {card.watch_out && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" /> Vigilance</div>
                    <ul className="list-none space-y-1">{card.watch_out.map((s: string, i: number) => (<li key={i} className="text-[10px] font-bold flex items-start gap-2"><span className="text-orange-500">•</span> {s}</li>))}</ul>
                  </div>
                )}
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

  const renderSection = (section: any, idx: number, key?: string) => {
    const sectionId = section.title ? slugify(section.title) : `section-${idx}`;
    const bodyText = section.content || section.text || section.description;

    // Handle comparison cards (strengths/weaknesses) inside a subsection
    if (section.strengths || section.weaknesses) {
        return (
            <Card key={key || sectionId} className="border-2 border-muted overflow-hidden h-full">
                <CardHeader className="bg-muted/30 py-4 border-b"><CardTitle className="text-xl font-black uppercase">{section.title || "Comparatif"}</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                    {section.strengths && (<div className="space-y-2"><div className="text-[9px] font-black uppercase text-green-600">Avantages</div><ul className="list-none space-y-1">{section.strengths.map((s: string, j: number) => (<li key={j} className="text-sm font-bold flex items-start gap-2"><span className="text-green-500">•</span> {s}</li>))}</ul></div>)}
                    {section.weaknesses && (<div className="space-y-2"><div className="text-[9px] font-black uppercase text-red-600">Inconvénients</div><ul className="list-none space-y-1">{section.weaknesses.map((w: string, j: number) => (<li key={j} className="text-sm font-bold flex items-start gap-2"><span className="text-red-400">•</span> {w}</li>))}</ul></div>)}
                </CardContent>
            </Card>
        );
    }

    return (
      <div key={key || sectionId} id={sectionId} className="mb-12 scroll-mt-28">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        {section.cta && renderCtaBlock(section.cta, `cta-section-${idx}`)}
        {bodyText && (Array.isArray(bodyText) ? (bodyText.map((p: string, i: number) => <p key={i} className="text-lg text-foreground font-bold leading-relaxed mb-6">{p}</p>)) : (<p className="text-lg text-foreground font-bold leading-relaxed mb-6">{bodyText}</p>))}
        {section.table && renderTable(section.table, `table-${idx}`)}
        {section.cards && renderCards(section.cards, `cards-${idx}`)}
        {section.list && Array.isArray(section.list) && (<ul className="list-disc list-inside space-y-3 mb-8 pl-4">{section.list.map((item: string, li: number) => (<li key={li} className="text-lg text-foreground font-black">{item}</li>))}</ul>)}
        
        {section.subsections && Array.isArray(section.subsections) && (
          <div className={cn(
            "space-y-10",
            section.subsections.some((s: any) => s.strengths || s.weaknesses) && "grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0"
          )}>
            {section.subsections.map((sub: any, si: number) => renderSection(sub, si, `sub-${idx}-${si}`))}
          </div>
        )}
        {section.note && (
            <div className="bg-brand/5 border-l-4 border-brand p-4 mt-4 mb-8 italic rounded-r-lg shadow-sm text-foreground font-bold">
                {section.note}
            </div>
        )}
      </div>
    );
  };

  if (isLoading) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-brand mb-4" /><p className="text-muted-foreground font-black animate-pulse uppercase tracking-widest text-[10px]">Chargement de l'article...</p></div>);
  if (!article) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4"><h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Article non trouvé</h1><p className="text-muted-foreground mb-8">Nous n'avons pas trouvé l'article demandé.</p><Button asChild className="rounded-full px-8 font-black uppercase tracking-widest text-xs"><Link href="/info">Retour aux articles</Link></Button></div>);

  return (
    <div className="min-h-screen relative">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={handleSearch} activeFilter={null} placeholderText="Recherche par departement , ville , marque, nom ... " />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8 overflow-hidden whitespace-nowrap"><Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link><ChevronRight className="h-3 w-3 shrink-0" /><Link href="/info" className="hover:text-brand shrink-0">Conseils</Link><ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{article.display_title || article.title}</span></nav>
          
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
                            let targetId = null;
                            
                            for (const s of activeSections) {
                                if (s.title && (s.title.toLowerCase().includes(ptLower) || ptLower.includes(s.title.toLowerCase()))) {
                                    targetId = slugify(s.title); break;
                                }
                                if (s.subsections) {
                                    const sub = s.subsections.find((sb: any) => sb.title && (sb.title.toLowerCase().includes(ptLower) || ptLower.includes(sb.title.toLowerCase())));
                                    if (sub) { targetId = slugify(sub.title); break; }
                                }
                            }
                            
                            if (!targetId) {
                                const keywords = ["choisir", "erreurs", "profil", "roadster", "budget", "assurance", "occasion", "1m55", "1m70", "1m80", "1m85", "1m95", "rabaissement", "particulier", "concession"];
                                const found = keywords.find(k => ptLower.includes(k));
                                if (found) {
                                    for (const s of activeSections) {
                                        if (s.title?.toLowerCase().includes(found)) { targetId = slugify(s.title); break; }
                                    }
                                }
                            }

                            return (
                                <li key={i} className="flex items-center gap-3 text-lg text-foreground font-black group/item">
                                    <CheckCircle2 className="h-5 w-5 text-brand shrink-0 group-hover/item:scale-110 transition-transform" />
                                    {targetId ? (<a href={`#${targetId}`} className="hover:text-brand transition-all decoration-brand/30 underline-offset-4 hover:underline">{pt}</a>) : (<span>{pt}</span>)}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <div className="space-y-12">
              {activeSections.map((section: any, idx: number) => renderSection(section, idx))}
            </div>
            
            {article.cta_blocks && Array.isArray(article.cta_blocks) && (
              <div className="mt-16 pt-8 border-t border-brand/20">
                <h3 className="text-xl font-black uppercase tracking-tight text-brand mb-6">Guides recommandés</h3>
                <div className="space-y-4">
                  {article.cta_blocks.map((block: any, idx: number) => renderCtaBlock(block, `footer-cta-${idx}`))}
                </div>
              </div>
            )}

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
      </main>
    </div>
  );
}

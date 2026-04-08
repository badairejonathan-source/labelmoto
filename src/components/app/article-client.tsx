'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircle2, Info, Loader2, 
  ChevronRight, Home, HelpCircle, Gauge, Settings2, 
  ExternalLink, AlertTriangle, ArrowRight, LayoutGrid,
  Map
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
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const slugify = (text: string) => 
  text?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "";

const getFicheIdFromTitle = (title: string): string | null => {
  const t = typeof title === 'string' ? title.toLowerCase() : '';
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

export default function ArticleClient({ id, showHeader = true, children }: { id: string, showHeader?: boolean, children?: React.ReactNode }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const firestore = useFirestore();
  const articleRef = useMemoFirebase(() => doc(firestore, 'articles', id), [firestore, id]);
  const { data: article, isLoading } = useDoc(articleRef);

  const imageUrl = useMemo(() => {
    if (!article) return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070";
    const articleId = id.toLowerCase();
    const title = (article.display_title || article.title || "").toLowerCase();

    if (articleId.includes('zfe') || title.includes('zfe')) return "/images/motardZFEarticle2.png";
    if (articleId.includes('taille') || title.includes('taille') || title.includes('hauteur')) return "/images/motard-articles-hauteurdeselle.png";
    if (articleId.includes('assurance') || title.includes('assurance')) return "/images/motard-article-assurance2026.png";
    if (articleId.includes('a2') || title.includes('a2')) return "/images/achat-occasion.png";
    if (articleId.includes('occasion') || articleId.includes('pieges') || title.includes('pièges')) return "/images/evitelespieges.png";
    if (articleId.includes('budget') || title.includes('budget')) return "https://images.unsplash.com/photo-1572452571879-3d67d5b2a39f?q=80&w=1080";
    if (articleId.includes('entretien') || title.includes('entretien')) return "/images/motard-entretien-page.png";
    
    if (article?.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
    return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070";
  }, [article, id]);

  const activeSections = useMemo(() => {
    if (!article) return [];
    return article.sections || article.content || [];
  }, [article]);

  const renderTable = (tableData: any, key: string) => {
    if (!tableData) return null;
    const headers = tableData.headers || [];
    const rows = tableData.rows || [];

    const getCellValue = (row: any, header: string, colIndex: number) => {
      if (!row) return '';
      if (Array.isArray(row)) return row[colIndex] || '';

      const clean = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
      const cleanHeader = clean(header);
      
      const keys = Object.keys(row);
      const fuzzyMatch = keys.find(k => clean(k) === cleanHeader);
      if (fuzzyMatch) return row[fuzzyMatch];

      const inclusionMatch = keys.find(k => cleanHeader.includes(clean(k)) || clean(k).includes(cleanHeader));
      if (inclusionMatch) return row[inclusionMatch];

      if (row[colIndex] !== undefined) return row[colIndex];
      if (row[String(colIndex)] !== undefined) return row[String(colIndex)];
      
      const values = Object.values(row);
      if (values[colIndex] !== undefined) return values[colIndex];
      
      return '';
    };

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
                    <TableCell key={`td-${key}-${ri}-${hi}`} className="py-3 px-3 md:py-4 md:px-4 text-foreground font-black text-[10px] md:text-sm leading-tight">
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

  const renderCards = (cards: any[], keyPrefix: string) => {
    if (!cards || cards.length === 0) return null;
    return (
      <div key={keyPrefix} className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {cards.map((card, idx) => {
          const modelLabel = card.title || card.recommended_models?.[0] || card.models?.[0] || '';
          const ficheId = getFicheIdFromTitle(String(modelLabel));
          const listItems = card.models || card.recommended_models || card.items || card.points || card.guarantees || card.list;
          const strengths = card.strengths || card.advantages || card.pros || card.points_forts;
          const weaknesses = card.weaknesses || card.watch_out || card.cons || card.points_vigilance;
          const summary = card.summary || card.description || card.text || card.intro || card.content;

          return (
            <Card key={`${keyPrefix}-card-${idx}`} className="border-2 border-brand/20 overflow-hidden bg-card h-full flex flex-col shadow-md group/card hover:border-brand/50 transition-all">
              <CardHeader className="bg-brand/5 py-4 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground leading-tight">{card.title || "Information"}</CardTitle>
                  {(card.type || card.profile || card.subtitle) && <p className="text-[10px] font-black uppercase tracking-widest text-brand mt-1">{card.type || card.profile || card.subtitle}</p>}
                </div>
                {ficheId && <ExternalLink className="h-4 w-4 text-brand/40 group-hover/card:text-brand" />}
              </CardHeader>
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
                {strengths && Array.isArray(strengths) && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Points forts</div>
                    <ul className="list-none space-y-1">{strengths.map((s: string, i: number) => (<li key={`${keyPrefix}-s-${idx}-${i}`} className="text-[10px] font-bold flex items-start gap-2"><span className="text-green-500">•</span> {s}</li>))}</ul>
                  </div>
                )}
                {weaknesses && Array.isArray(weaknesses) && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" /> Vigilance</div>
                    <ul className="list-none space-y-1">{weaknesses.map((s: string, i: number) => (<li key={`${keyPrefix}-w-${idx}-${i}`} className="text-[10px] font-bold flex items-start gap-2"><span className="text-orange-500">•</span> {s}</li>))}</ul>
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
    const bodyText = section.content || section.text || section.description || section.intro || section.body;
    const strengths = section.strengths || section.advantages || section.pros || section.points_forts;
    const weaknesses = section.weaknesses || section.watch_out || section.cons || section.points_vigilance;

    if (strengths || weaknesses) {
        return (
            <Card key={key || sectionId} className="border-2 border-muted overflow-hidden h-full shadow-sm bg-card">
                <CardHeader className="bg-muted/30 py-4 border-b"><CardTitle className="text-xl font-black uppercase tracking-tight">{section.title || "Comparatif"}</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                    {strengths && Array.isArray(strengths) && (
                      <div className="space-y-2">
                        <div className="text-[9px] font-black uppercase text-green-600 tracking-widest">Avantages</div>
                        <ul className="list-none space-y-1">{strengths.map((s: string, j: number) => (<li key={`stre-${idx}-${j}`} className="text-sm font-bold flex items-start gap-2"><span className="text-green-500">•</span> {s}</li>))}</ul>
                      </div>
                    )}
                    {weaknesses && Array.isArray(weaknesses) && (
                      <div className="space-y-2">
                        <div className="text-[9px] font-black uppercase text-red-600 tracking-widest">Inconvénients</div>
                        <ul className="list-none space-y-1">{weaknesses.map((w: string, j: number) => (<li key={`weak-${idx}-${j}`} className="text-sm font-bold flex items-start gap-2"><span className="text-red-400">•</span> {w}</li>))}</ul>
                      </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
      <div key={key || sectionId} id={sectionId} className="mb-12 scroll-mt-28">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        {bodyText && (Array.isArray(bodyText) ? 
          (bodyText.map((p: string, i: number) => <p key={`p-${sectionId}-${i}`} className="text-lg text-foreground font-bold leading-relaxed mb-6">{p}</p>)) : 
          (<p className="text-lg text-foreground font-bold leading-relaxed mb-6">{bodyText}</p>)
        )}
        {section.table && renderTable(section.table, `table-${sectionId}`)}
        {section.cards && renderCards(section.cards, `cards-${sectionId}`)}
        {section.list && Array.isArray(section.list) && (
          <ul className="list-disc list-inside space-y-3 mb-8 pl-4">
            {section.list.map((item: string, li: number) => (<li key={`li-${sectionId}-${li}`} className="text-lg text-foreground font-black">{item}</li>))}
          </ul>
        )}
        {section.ordered_list && Array.isArray(section.ordered_list) && (
          <ol className="list-decimal list-inside space-y-4 mb-8 pl-4">
            {section.ordered_list.map((item: string, oi: number) => (<li key={`ol-${sectionId}-${oi}`} className="text-lg text-foreground font-bold leading-relaxed pl-2">{item}</li>))}
          </ol>
        )}
        {section.subsections && Array.isArray(section.subsections) && (
          <div className={cn("space-y-10", section.subsections.length >= 2 && section.subsections.every((s: any) => (s.strengths || s.advantages || s.weaknesses || s.watch_out)) && "md:grid md:grid-cols-2 md:gap-8 md:space-y-0")}>
            {section.subsections.map((sub: any, si: number) => renderSection(sub, si, `sub-${sectionId}-${si}`))}
          </div>
        )}
        {section.note && (
            <div className="bg-brand/5 border-l-4 border-brand p-4 mt-4 mb-8 italic rounded-r-lg shadow-sm text-foreground font-bold">
                {section.note}
                {(section.note.includes("Assurance") || section.note.includes("Vérifie AVANT") || section.note.includes("coûtent bien plus cher")) && (
                  <div className="mt-4 not-italic">
                    <Button asChild className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] rounded-full px-6 py-5 shadow-lg transition-all hover:scale-105 active:scale-95">
                      <Link href="/info/assurance-moto-bien-choisir-sa-formule-selon-votre-profil">🛡️ Voir le guide Assurance 2026</Link>
                    </Button>
                  </div>
                )}
            </div>
        )}
      </div>
    );
  };

  if (isLoading) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-brand mb-4" /><p className="text-muted-foreground font-black animate-pulse uppercase tracking-widest text-[10px]">Chargement Firestore...</p></div>);
  if (!article) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4"><h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Article non trouvé</h1><Button asChild className="rounded-full px-8 font-black uppercase tracking-widest text-xs"><Link href="/info">Retour aux articles</Link></Button></div>);

  return (
    <div className="min-h-screen relative bg-background">
      {showHeader && <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} activeFilter={null} placeholderText="Recherche..." />}
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><Link href="/info" className="hover:text-brand shrink-0">Conseils</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{article.display_title || article.title}</span>
          </nav>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contenu Principal */}
            <article className="lg:col-span-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-8 text-foreground">
                {article.display_title || article.title}
              </h1>

              <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border-4 border-white bg-muted">
                  <Image src={imageUrl} alt={article.display_title || article.title} fill className="object-cover" priority />
              </div>

              {article.intro && Array.isArray(article.intro) && (
                <div className="mb-12 space-y-6">
                  {article.intro.map((p: string, i: number) => (<p key={`intro-${i}`} className="text-xl leading-relaxed text-foreground font-black">{p}</p>))}
                </div>
              )}
              
              {activeSections.length > 0 && activeSections.some((s: any) => s.title) && (
                <div className="my-12 p-8 bg-brand/5 rounded-3xl border-2 border-dashed border-brand/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                    <Image src="/images/logo-moto.png?v=6" alt="" width={200} height={64} />
                  </div>
                  <div className="flex items-center gap-3 mb-8"><LayoutGrid className="h-5 w-5 text-brand" /><h2 className="text-[10px] font-black uppercase tracking-widest m-0 text-muted-foreground">Au sommaire de ce guide :</h2></div>
                  <nav>
                    <ul className="space-y-4">
                      {activeSections.map((section: any, idx: number) => { 
                        if (!section.title) return null; 
                        const sectionId = slugify(section.title); 
                        return (
                          <li key={`toc-${idx}`} className="group/item">
                            <a href={`#${sectionId}`} className="flex items-center gap-4 text-lg font-black text-foreground hover:text-brand transition-all">
                              <div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0 group-hover/item:bg-brand group-hover/item:text-white transition-colors"><CheckCircle2 className="h-3.5 w-3.5" /></div>
                              <span className="border-b-2 border-transparent group-hover/item:border-brand/30">{section.title}</span>
                            </a>
                          </li>
                        ); 
                      })}
                    </ul>
                  </nav>
                </div>
              )}

              <div className="space-y-4">{activeSections.map((section: any, idx: number) => renderSection(section, idx))}</div>
              {children}
              
              {article.conclusion && (
                  <div className="mt-16 pt-8 border-t border-brand/20">
                      <div className="flex items-center gap-3 mb-6"><Info className="h-6 w-6 text-brand" /><h3 className="text-2xl font-black uppercase m-0 text-foreground">Le mot de la fin</h3></div>
                      <div className="space-y-4">{Array.isArray(article.conclusion) ? (article.conclusion.map((line: string, i: number) => (<p key={`conc-${i}`} className="text-lg text-foreground font-black leading-relaxed">{line}</p>))) : (<p className="text-lg text-foreground font-black leading-relaxed">{article.conclusion}</p>)}</div>
                      <div className="flex justify-end items-center mt-12"><p className="text-lg font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p><Image src="/images/Stamp-LM.png?v=2" alt="Signature" width={120} height={120} className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-12" /></div>
                  </div>
              )}
            </article>

            {/* Barre Latérale */}
            <aside className="lg:col-span-4 relative">
              <div className="sticky top-28 space-y-8">
                <Card className="overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                  <CardHeader className="bg-brand text-white p-6">
                    <CardTitle className="flex items-center gap-3 uppercase font-black tracking-widest text-lg">
                      <Map className="h-6 w-6" /> Trouver un pro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center space-y-6">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-muted shadow-lg group">
                      <Image src="/images/apercucartezoom.png" alt="Carte Interactive" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                      Comparez les ateliers et concessions pour votre prochaine révision directement sur notre carte interactive.
                    </p>
                    <Button asChild className="w-full bg-brand hover:bg-brand/90 text-white font-black uppercase tracking-widest text-[10px] py-7 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95">
                      <Link href="/map">Voir la carte interactive</Link>
                    </Button>
                  </CardContent>
                </Card>

                <div className="bg-muted/30 p-6 rounded-3xl border-2 border-dashed border-muted-foreground/20 text-center">
                  <p className="text-xs font-bold text-muted-foreground italic">
                    Besoin d'un conseil personnalisé ? <br/>
                    <Link href="/contact" className="text-brand underline underline-offset-4 not-italic font-black uppercase">Contactez l'équipe</Link>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

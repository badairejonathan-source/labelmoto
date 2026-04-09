'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircle2, Info, Loader2, 
  ChevronRight, Home, Gauge, Settings2, 
  ExternalLink, AlertTriangle, ArrowRight, LayoutGrid,
  Map,
  FileText
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
      
      const clean = (s: string) => String(s || '')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '');

      const target = clean(header);
      
      if (row[header] !== undefined) return row[header];
      
      const keys = Object.keys(row);
      const matchedKey = keys.find(k => clean(k) === target);
      if (matchedKey) return row[matchedKey];

      const partialKey = keys.find(k => clean(k).includes(target) || target.includes(clean(k)));
      if (partialKey) return row[partialKey];

      if (Array.isArray(row)) return row[colIndex] || '';
      const values = Object.values(row);
      return values[colIndex] || '';
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
          const usefulGuarantees = card.useful_guarantees || card.recommended_guarantees;
          
          const summary = card.summary || card.description || card.text || card.intro || card.content;
          const formula = card.formula || card.recommended_formula || card.recommended_option;

          return (
            <Card key={`${keyPrefix}-card-${idx}`} className="border-2 border-brand/20 overflow-hidden bg-card h-full flex flex-col shadow-md group/card hover:border-brand/50 transition-all rounded-3xl">
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
                      <div className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Points forts</div>
                      <ul className="list-none space-y-1">{strengths.map((s: string, i: number) => (<li key={`${keyPrefix}-s-${idx}-${i}`} className="text-[10px] font-bold flex items-start gap-2 text-foreground"><span className="text-green-500">•</span> {s}</li>))}</ul>
                    </div>
                  )}

                  {weaknesses && Array.isArray(weaknesses) && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[9px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" /> Vigilance</div>
                      <ul className="list-none space-y-1">{weaknesses.map((s: string, i: number) => (<li key={`${keyPrefix}-w-${idx}-${i}`} className="text-[10px] font-bold flex items-start gap-2 text-foreground"><span className="text-orange-500">•</span> {s}</li>))}</ul>
                    </div>
                  )}
                </div>
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
    let bodyText = section.content || section.text || section.description || section.intro || section.body;
    
    // Remplacement demandé par l'utilisateur
    if (typeof bodyText === 'string') {
        bodyText = bodyText.replace(/Mais en réalité/g, 'Car en réalité');
    } else if (Array.isArray(bodyText)) {
        bodyText = bodyText.map(p => typeof p === 'string' ? p.replace(/Mais en réalité/g, 'Car en réalité') : p);
    }

    const strengths = section.strengths || section.advantages || section.pros || section.points_forts;
    const weaknesses = section.weaknesses || section.limits || section.watch_out || section.cons || section.points_vigilance;

    return (
      <div key={key || sectionId} id={sectionId} className="mb-12 scroll-mt-28">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        {bodyText && (Array.isArray(bodyText) ? 
          (bodyText.map((p: string, i: number) => <p key={`p-${sectionId}-${i}`} className="text-lg text-foreground font-bold leading-relaxed mb-6">{p}</p>)) : 
          (<p className="text-lg text-foreground font-bold leading-relaxed mb-6">{bodyText}</p>)
        )}

        {(strengths || weaknesses) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <Card className="border-2 border-green-100 bg-green-50/10 overflow-hidden shadow-sm rounded-3xl">
                    <CardHeader className="bg-green-50 py-4 border-b">
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-green-700 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> Avantages
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ul className="space-y-2">
                            {strengths && Array.isArray(strengths) && strengths.map((s: string, j: number) => (
                              <li key={`stre-${idx}-${j}`} className="text-sm font-bold flex items-start gap-2 text-foreground">
                                <span className="text-green-500 shrink-0">•</span> {s}
                              </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="border-2 border-red-100 bg-red-50/10 overflow-hidden shadow-sm rounded-3xl">
                    <CardHeader className="bg-red-50 py-4 border-b">
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-red-700 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" /> Limites
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ul className="space-y-2">
                            {weaknesses && Array.isArray(weaknesses) && weaknesses.map((w: string, j: number) => (
                              <li key={`weak-${idx}-${j}`} className="text-sm font-bold flex items-start gap-2 text-foreground">
                                <span className="text-red-400 shrink-0">•</span> {w}
                              </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
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
          <div className="space-y-10">
            {section.subsections.map((sub: any, si: number) => renderSection(sub, si, `sub-${sectionId}-${si}`))}
          </div>
        )}
        {section.note && (
            <div className="bg-brand/5 border-l-4 border-brand p-6 mt-4 mb-8 italic rounded-r-3xl shadow-sm text-foreground font-bold">
                {section.note}
                {(section.note.includes("Assurance") || section.note.includes("Vérifie AVANT") || section.note.includes("coûtent bien plus cher")) && (
                  <div className="mt-6 not-italic">
                    <Button asChild className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] rounded-full px-8 py-6 shadow-lg transition-all hover:scale-105 active:scale-95">
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
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-12">
            <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><Link href="/info" className="hover:text-brand shrink-0">Conseils</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{article.display_title || article.title}</span>
          </nav>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <article className="lg:col-span-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-10 text-foreground">
                {article.display_title || article.title}
              </h1>

              <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl border-4 border-white bg-muted">
                  <Image src={imageUrl} alt={article.display_title || article.title} fill className="object-cover" priority />
              </div>

              {/* Bloc Enfants (ex: Catalogue de marques) - Placé en haut sous l'image */}
              {children && (
                <div className="mb-12">
                  {children}
                </div>
              )}

              {article.intro && Array.isArray(article.intro) && (
                <div className="my-12 space-y-6">
                  {article.intro.map((p: string, i: number) => (<p key={`intro-${i}`} className="text-xl leading-relaxed text-foreground font-black">{p}</p>))}
                </div>
              )}
              
              {activeSections.length > 0 && activeSections.some((s: any) => s.title) && (
                <div className="my-12 p-10 bg-brand/5 rounded-[2.5rem] border-2 border-dashed border-brand/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                    <Image src="/images/logo-moto.png?v=6" alt="" width={200} height={64} />
                  </div>
                  <div className="flex items-center gap-3 mb-8"><LayoutGrid className="h-5 w-5 text-brand" /><h2 className="text-[10px] font-black uppercase tracking-[0.3em] m-0 text-muted-foreground">Au sommaire de ce guide :</h2></div>
                  <nav>
                    <ul className="space-y-5">
                      {activeSections.map((section: any, idx: number) => { 
                        if (!section.title) return null; 
                        const sectionId = slugify(section.title); 
                        return (
                          <li key={`toc-${idx}`} className="group/item">
                            <a href={`#${sectionId}`} className="flex items-center gap-4 text-lg font-black text-foreground hover:text-brand transition-all">
                              <div className="h-7 w-7 rounded-full bg-brand/10 flex items-center justify-center shrink-0 group-hover/item:bg-brand group-hover/item:text-white transition-colors shadow-sm"><CheckCircle2 className="h-4 w-4" /></div>
                              <span className="border-b-2 border-transparent group-hover/item:border-brand/30 pb-0.5">{section.title}</span>
                            </a>
                          </li>
                        ); 
                      })}
                    </ul>
                  </nav>
                </div>
              )}

              <div className="space-y-4">{activeSections.map((section: any, idx: number) => renderSection(section, idx))}</div>
              
              {article.conclusion && (
                  <div className="mt-20 pt-12 border-t border-brand/20">
                      <div className="flex items-center gap-3 mb-8"><Info className="h-8 w-8 text-brand" /><h3 className="text-3xl font-black uppercase m-0 text-foreground">Le mot de la fin</h3></div>
                      <div className="space-y-6">{Array.isArray(article.conclusion) ? (article.conclusion.map((line: string, i: number) => (<p key={`conc-${i}`} className="text-xl text-foreground font-black leading-relaxed">{line}</p>))) : (<p className="text-xl text-foreground font-black leading-relaxed">{article.conclusion}</p>)}</div>
                      <div className="flex justify-end items-center mt-16"><p className="text-xl font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p><Image src="/images/Stamp-LM.png?v=2" alt="Signature" width={140} height={140} className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-12" /></div>
                  </div>
              )}
            </article>

            <aside className="lg:col-span-4 relative">
              <div className="lg:sticky lg:top-28 space-y-10">
                <Card className="overflow-hidden border-none shadow-2xl bg-card rounded-[2.5rem]">
                  <CardHeader className="bg-brand text-white p-8"><CardTitle className="flex items-center gap-3 uppercase font-black tracking-widest text-lg"><Map className="h-7 w-7" /> Trouver un pro</CardTitle></CardHeader>
                  <CardContent className="p-8 text-center space-y-8">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-muted shadow-xl group cursor-pointer" onClick={() => router.push('/map')}>
                      <Image src="/images/apercucartezoom.png" alt="Carte Interactive" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-12 w-12 text-white" /></div>
                    </div>
                    <p className="text-base font-bold text-muted-foreground leading-relaxed italic">"Dénichez l'atelier idéal ou la concession de vos rêves en quelques secondes."</p>
                    <Button asChild className="w-full bg-brand hover:bg-brand/90 text-white font-black uppercase tracking-widest text-xs py-8 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
                      <Link href="/map">🔘 Voir la carte interactive</Link>
                    </Button>
                  </CardContent>
                </Card>

                <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-dashed border-muted-foreground/20 text-center shadow-inner">
                  <p className="text-sm font-bold text-muted-foreground mb-4">Besoin d'un conseil personnalisé ?</p>
                  <Link href="/contact" className="text-brand hover:text-brand/80 font-black uppercase tracking-widest text-[10px] underline underline-offset-8 decoration-2 decoration-brand/30">Contactez l'équipe</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

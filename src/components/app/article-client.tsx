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
  HelpCircle
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
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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
  if (t.includes('nx500') || t.includes('cb500x')) return 'honda-nx500-2024-plus';
  if (t.includes('r7')) return 'yamaha-r7-2022-plus';
  if (t.includes('cbr500r')) return 'honda-cbr500r-2022-plus';
  if (t.includes('sv650')) return 'suzuki-sv650-2016-plus';
  if (t.includes('cmx500') || t.includes('rebel 500')) return 'honda-cmx500-rebel';
  return null;
};

const InternalLinkCard = ({ title, description, link, icon: Icon }: any) => (
  <div className="mt-8 mb-12">
    <Card className="bg-brand/5 border-2 border-brand/20 shadow-xl rounded-[2.5rem] overflow-hidden hover:border-brand/40 transition-all group/link">
      <CardContent className="p-8 flex flex-col md:p-6 md:flex-row items-center gap-6">
        <div className="bg-brand/10 p-4 rounded-full group-hover/link:bg-brand/20 transition-colors">
          <Icon className="h-8 w-8 text-brand" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-xl font-black uppercase tracking-tighter text-foreground mb-1">{title}</h4>
          <p className="text-sm font-bold text-muted-foreground leading-snug">{description}</p>
        </div>
        <Button asChild className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] px-8 py-6 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0">
          <Link href={link} className="flex items-center gap-2">
            Voir le guide complet <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default function ArticleClient({ id, showHeader = true, children }: { id: string, showHeader?: boolean, children?: React.ReactNode }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const firestore = useFirestore();
  const articleRef = useMemoFirebase(() => doc(firestore, 'articles', id), [firestore, id]);
  const { data: article, isLoading } = useDoc(articleRef);

  // Listing des autres articles pour la sidebar
  const articlesListRef = useMemoFirebase(() => collection(firestore, 'articles'), [firestore]);
  const { data: allArticles, isLoading: isArticlesListLoading } = useCollection(articlesListRef);

  const otherArticles = useMemo(() => {
    if (!allArticles) return [];
    // On exclut l'article actuel et l'article d'index d'entretien s'il existe
    return allArticles
        .filter(a => a.id !== id && a.id !== 'entretien-moto-intervalles-prix-conseils-par-modele')
        .sort(() => 0.5 - Math.random()) // Un peu d'aléatoire pour le dynamisme
        .slice(0, 5);
  }, [allArticles, id]);

  const imageUrl = useMemo(() => {
    if (!article) return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070";
    const articleId = id.toLowerCase();
    const title = (article.display_title || article.title || "").toLowerCase();

    if (articleId.includes('zfe') || title.includes('zfe')) return "/images/motardZFEarticle2.webp";
    if (articleId.includes('taille') || title.includes('taille') || title.includes('hauteur')) return "/images/motard-articles-hauteurdeselle.webp";
    if (articleId.includes('assurance') || title.includes('assurance')) return "/images/motard-article-assurance20262.webp";
    if (articleId.includes('a2') || title.includes('a2')) return "/images/achat-occasion.webp";
    if (articleId.includes('occasion') || articleId.includes('pieges') || title.includes('pièges')) return "/images/evitelespieges.webp";
    if (articleId.includes('budget') || title.includes('budget')) return "/images/motard-budget-reel.webp";
    if (articleId.includes('entretien') || title.includes('entretien') || title.includes('révision')) return "/images/motard-entretien-page.webp";
    
    if (article?.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
    return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070";
  }, [article, id]);

  const activeSections = useMemo(() => {
    if (!article) return [];
    return article.sections || article.content || [];
  }, [article]);

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
                    <TableCell key={`td-${key}-${ri}-${hi}`} className="py-3 px-3 md:py-4 md:px-4 text-foreground font-black text-[10px] md:sm leading-tight">
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
          const weaknesses = card.weaknesses || card.watch_out || card.cons || card.points_vigilance || card.limits;
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
                      <div className="text-[9px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Avantages</div>
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
                <CardFooter className="bg-brand p-3 border-t-0">
                  <Link href={`/fiches/${ficheId}?from=${id}`} className="text-[10px] font-black uppercase tracking-widest text-white mx-auto hover:underline flex items-center gap-2">Voir la fiche technique <ChevronRight className="h-3 w-3" /></Link>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  const renderFaq = (faqData: any[], key: string) => {
    if (!faqData || !Array.isArray(faqData) || faqData.length === 0) return null;
    return (
      <div key={key} className="space-y-8 pt-8 mb-12">
        <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 pl-2">
          <HelpCircle className="h-8 w-8 text-brand" /> Questions Fréquentes
        </h3>
        <div className="space-y-4">
          {faqData.map((item: any, idx: number) => {
            const question = getRobustValue(item, ['question', 'q', 'titre', 'query']);
            const answer = getRobustValue(item, ['answer', 'a', 'reponse', 'content', 'response']);
            
            return (
              <Card key={idx} className="border-none shadow-xl rounded-[2rem] bg-card overflow-hidden">
                <CardHeader className="p-8 bg-muted/20 border-b">
                  <CardTitle className="text-lg font-black uppercase leading-tight">{question}</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-base font-bold text-muted-foreground leading-relaxed">{answer}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
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

    const isBudgetNote = section.note && (section.note.includes("budget global") || section.note.includes("coût réel"));
    const isAssuranceNote = section.note && (section.note.includes("Assurance") || section.note.includes("formule"));
    const isGabaritNote = section.note && (section.note.includes("gabarit") || section.note.includes("tailles"));

    return (
      <div key={key || sectionId} id={sectionId} className="mb-12 scroll-mt-28">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        {bodyText && (Array.isArray(bodyText) ? (bodyText.map((p: string, i: number) => <p key={`p-${sectionId}-${i}`} className="text-lg text-foreground font-bold leading-relaxed mb-6">{p}</p>)) : (<p className="text-lg text-foreground font-bold leading-relaxed mb-6">{bodyText}</p>))}
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
        {section.list && Array.isArray(section.list) && (<ul className="list-disc list-inside space-y-3 mb-8 pl-4">{section.list.map((item: string, li: number) => (<li key={`li-${sectionId}-${li}`} className="text-lg text-foreground font-black">{item}</li>))}</ul>)}
        {section.ordered_list && Array.isArray(section.ordered_list) && (<ol className="list-decimal list-inside space-y-4 mb-8 pl-4">{section.ordered_list.map((item: string, oi: number) => (<li key={`ol-${sectionId}-${oi}`} className="text-lg text-foreground font-bold leading-relaxed pl-2">{item}</li>))}</ol>)}
        {section.subsections && Array.isArray(section.subsections) && (<div className={cn("space-y-10", section.subsections.length === 2 && "grid grid-cols-1 md:grid-cols-2 gap-8 space-y-0")}>{section.subsections.map((sub: any, si: number) => renderSection(sub, si, `sub-${sectionId}-${si}`))}</div>)}
        
        {section.note && (
          <>
            {isBudgetNote ? (
              <InternalLinkCard 
                title="Calculer mon budget réel"
                description="Consultez notre guide complet sur le coût réel d'une moto par mois : assurance, essence, entretien."
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
            ) : (
              <div className="bg-brand/5 border-l-4 border-brand p-6 mt-4 mb-8 italic rounded-r-3xl shadow-sm text-foreground font-bold">
                {fixText(section.note)}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background">
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

  if (!article) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4"><h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Article non trouvé</h1><Button asChild className="rounded-full px-8 font-black uppercase tracking-widest text-xs"><Link href="/info">Retour aux articles</Link></Button></div>);

  return (
    <div className="min-h-screen relative bg-background">
      {showHeader && <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} activeFilter={null} placeholderText="Recherche..." />}
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8 pt-28 md:pt-32">
            <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><Link href="/info" className="hover:text-brand shrink-0">Conseils</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{article.display_title || article.title}</span>
          </nav>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-6 text-foreground">
            {article.display_title || article.title}
          </h1>

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
                <div className="my-8 space-y-4">{article.intro.map((p: string, i: number) => (<p key={`intro-${i}`} className="text-lg leading-relaxed text-foreground font-black">{p}</p>))}</div>
              )}
              
              {activeSections.length > 0 && activeSections.some((s: any) => s.title) && (
                <div className="my-8 p-8 bg-brand/5 rounded-[2rem] border-2 border-dashed border-brand/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none"><Image src="/images/logo-moto.webp" alt="" width={150} height={48} /></div>
                  <div className="flex items-center gap-3 mb-6"><LayoutGrid className="h-5 w-5 text-brand" /><h2 className="text-[10px] font-black uppercase tracking-[0.3em] m-0 text-muted-foreground">Au sommaire :</h2></div>
                  <nav><ul className="space-y-4">{activeSections.map((section: any, idx: number) => { if (!section.title) return null; const sectionId = slugify(section.title); return (<li key={`toc-${idx}`} className="group/item"><a href={`#${sectionId}`} className="flex items-center gap-4 text-base font-black text-foreground hover:text-brand transition-all"><div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0 group-hover/item:bg-brand group-hover/item:text-white transition-colors shadow-sm"><CheckCircle2 className="h-3.5 w-3.5" /></div><span className="border-b-2 border-transparent group-hover/item:border-brand/30 pb-0.5">{section.title}</span></a></li>); })}</ul></nav>
                </div>
              )}

              <div className="space-y-3">{activeSections.map((section: any, idx: number) => renderSection(section, idx))}</div>
              
              {(article.faq || article.faqs) && renderFaq(article.faq || article.faqs, "article-faq")}

              {article.conclusion && (
                  <div className="mt-16 pt-8 border-t border-brand/20">
                      <div className="flex items-center gap-3 mb-6"><Info className="h-6 w-6 text-brand" /><h3 className="text-2xl font-black uppercase m-0 text-foreground">Le mot de la fin</h3></div>
                      <div className="space-y-4">{Array.isArray(article.conclusion) ? (article.conclusion.map((line: string, i: number) => (<p key={`conc-${i}`} className="text-lg text-foreground font-black leading-relaxed">{line}</p>))) : (<p className="text-lg text-foreground font-black leading-relaxed">{article.conclusion}</p>)}</div>
                      <div className="flex justify-end items-center mt-12"><p className="text-lg font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p><Image src="/images/Stamp-LM.webp" alt="Signature" width={110} height={110} className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-10" /></div>
                  </div>
              )}
            </article>

            <aside className="lg:col-span-4 relative">
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                  <CardHeader className="bg-brand text-white p-5"><CardTitle className="flex items-center gap-3 uppercase font-black tracking-widest text-sm"><Map className="h-5 w-5" /> Trouver un pro</CardTitle></CardHeader>
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden border-4 border-muted shadow-lg group cursor-pointer" onClick={() => router.push('/map')}>
                      <Image src="/images/apercucartezoom.webp" alt="Carte Interactive" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" sizes="(max-width: 1024px) 100vw, 400px" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-8 w-8 text-white" /></div>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground leading-snug italic">"Dénichez l'atelier idéal ou la concession de vos rêves en quelques secondes."</p>
                    <Button asChild className="w-full bg-brand hover:bg-brand/90 text-white font-black uppercase tracking-widest text-[9px] py-4 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95">
                      <Link href="/map">🔘 Voir la carte interactive</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Listing rapide des autres articles */}
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
      </main>
    </div>
  );
}

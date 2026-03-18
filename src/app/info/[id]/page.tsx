'use client';

import React, { useState, use, useMemo } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Map, CheckCircle2, Info, Loader2, FileText, HelpCircle, AlertTriangle } from 'lucide-react';

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const firestore = useFirestore();
  const articleRef = useMemoFirebase(() => doc(firestore, 'articles', id), [firestore, id]);
  const { data: article, isLoading } = useDoc(articleRef);

  // Correction : Calcul de l'image au début pour respecter l'ordre des hooks
  const imageUrl = useMemo(() => {
    if (!article) return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";
    
    if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
    const articleId = (article.id || id).toLowerCase();
    const title = (article.display_title || article.title || "").toLowerCase();
    
    if (articleId.includes('pieges') || articleId.includes('occasion') || title.includes('pièges')) return "/images/evitelespieges.jpg";
    if (articleId.includes('budget') || title.includes('budget')) return "https://images.unsplash.com/photo-1572452571879-3d67d5b2a39f?q=80&w=1080";
    if (articleId.includes('a2') || title.includes('a2')) return "/images/achat-occasion.jpg";
    if (articleId.includes('zfe') || title.includes('zfe')) return "https://images.unsplash.com/photo-1519608487913-d9d9b970ef9b?q=80&w=2070&auto=format&fit=crop";
    
    return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";
  }, [article, id]);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

  const renderNote = (note: string) => {
    if (!note) return null;
    
    const budgetArticleTitle = "Combien coûte vraiment une moto par mois ? Le budget réel d’un motard débutant";
    const budgetId = "4";
    
    const triggers = [
        "notre guide sur le coût réel d’une moto par mois",
        "notre guide sur le coût moyen d’une moto par mois",
        "Vérifie AVANT l’achat pour éviter les mauvaises surprises",
        "consulte aussi Combien coûte vraiment une moto par mois",
        "consulte aussi notre guide"
    ];
    
    let content: React.ReactNode = note;
    let foundTrigger = triggers.find(t => note.includes(t));

    if (foundTrigger) {
      const parts = note.split(foundTrigger);
      content = (
        <>
          {parts[0]}
          <Link href={`/info/${budgetId}`} className="text-brand font-black underline hover:text-foreground transition-colors">
            {budgetArticleTitle}
          </Link>
          {parts[1]}
        </>
      );
    }

    return (
      <div className="bg-brand/5 border-l-4 border-brand p-4 mb-8 italic rounded-r-lg shadow-sm text-foreground font-bold">
        {content}
      </div>
    );
  };

  const renderTable = (tableData: any) => {
    if (!tableData) return null;
    
    const headers = tableData.headers || [];
    const rows = tableData.rows || [];

    const getWords = (s: string) => 
        String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[^a-z0-9]+/).filter(w => w.length > 1);

    return (
      <div className="my-8 overflow-x-auto rounded-xl border-2 border-muted shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {headers.map((h: string, i: number) => (
                <TableHead key={i} className="font-black text-foreground py-4 uppercase tracking-widest text-[10px]">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row: any, ri: number) => {
              const rowValues = headers.map((header: string, hi: number) => {
                if (Array.isArray(row)) return row[hi] !== undefined ? row[hi] : '';
                if (row[header] !== undefined) return row[header];

                const headerWords = getWords(header);
                const foundKey = Object.keys(row).find(k => {
                  const keyWords = getWords(k);
                  if (keyWords.length === 0 || headerWords.length === 0) return false;
                  return headerWords.every(hw => keyWords.some(kw => kw.includes(hw) || hw.includes(kw))) ||
                         keyWords.every(kw => headerWords.some(hw => hw.includes(kw) || hw.includes(kw)));
                });
                
                if (foundKey) return row[foundKey];
                if (row[hi] !== undefined) return row[hi];
                if (row[String(hi)] !== undefined) return row[String(hi)];

                return '';
              });

              return (
                <TableRow key={ri} className="hover:bg-muted/30">
                  {rowValues.map((cell: any, ci: number) => (
                    <TableCell key={ci} className={cn("py-4", ci === 0 ? 'font-bold text-foreground' : 'text-foreground font-black')}>
                      {String(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderComparisonGrid = (items: any[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {items.map((item, idx) => (
          <Card key={idx} className="border-2 border-muted overflow-hidden bg-card h-full flex flex-col shadow-sm">
            <CardHeader className="bg-muted/30 py-4 border-b">
              <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground text-center">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-grow">
              {item.strengths && Array.isArray(item.strengths) && item.strengths.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" /> Avantages
                  </div>
                  <ul className="list-none space-y-2">
                    {item.strengths.map((s: string, j: number) => (
                      <li key={j} className="text-sm font-black flex items-start gap-2 text-foreground">
                        <span className="text-green-500 font-black shrink-0">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.weaknesses && Array.isArray(item.weaknesses) && item.weaknesses.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" /> Inconvénients
                  </div>
                  <ul className="list-none space-y-2">
                    {item.weaknesses.map((w: string, j: number) => (
                      <li key={j} className="text-sm font-black flex items-start gap-2 text-foreground">
                        <span className="text-red-400 font-black shrink-0">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSection = (section: any, idx: number) => {
    const hasComparisonData = section.strengths || section.weaknesses;
    const hasComparisonSubsections = section.subsections?.some((sub: any) => sub.strengths || sub.weaknesses);

    return (
      <div key={idx} className="mb-12">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        
        {section.content && Array.isArray(section.content) && section.content.map((p: string, pi: number) => (
          <p key={pi} className="text-lg text-foreground font-bold leading-relaxed mb-6">{p}</p>
        ))}

        {section.list && Array.isArray(section.list) && (
          <ul className="list-disc list-inside space-y-3 mb-8 pl-4">
            {section.list.map((item: string, li: number) => (
              <li key={li} className="text-lg text-foreground font-black">{item}</li>
            ))}
          </ul>
        )}

        {section.table && renderTable(section.table)}
        
        {section.note && renderNote(section.note)}

        {hasComparisonSubsections ? (
            <div className="mt-8">
                {renderComparisonGrid(section.subsections)}
            </div>
        ) : hasComparisonData ? (
            <div className="mt-8">
                {renderComparisonGrid([section])}
            </div>
        ) : (
            section.subsections && Array.isArray(section.subsections) && (
              <div className="space-y-6">
                {section.subsections.map((sub: any, si: number) => renderSection(sub, si))}
              </div>
            )
        )}

        {section.conclusion && <p className="text-lg text-foreground font-black mt-6 italic border-l-4 border-muted pl-4">{section.conclusion}</p>}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-brand mb-4" />
        <p className="text-muted-foreground font-black animate-pulse uppercase tracking-widest text-[10px]">Chargement de l'article...</p>
      </div>
    );
  }

  if (!article) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4">
            <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Article non trouvé</h1>
            <p className="text-muted-foreground mb-8">Nous n'avons pas trouvé l'article demandé.</p>
            <Button asChild className="rounded-full px-8 font-black uppercase tracking-widest text-xs">
                <Link href="/info">Retour aux articles</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        onFilterChange={handleFilterChange}
        placeholderText="Trouver une concession, une ville, une marque..."
      />
      <div className="fixed inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-hidden">
        <Image
          src="/images/logo-moto.png?v=6"
          alt="Label Moto Watermark"
          width={800}
          height={256}
          className="opacity-[0.08] rotate-[-15deg] scale-150"
        />
      </div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/info" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand font-black uppercase text-xs tracking-widest transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour aux articles
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8">
              <article>
                <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden mb-8 shadow-2xl border-4 border-white bg-muted group">
                  <Image
                    src={imageUrl}
                    alt={article.display_title || article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                        {article.display_title || article.title}
                    </h1>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-90">
                      <span>Par {article.author || "L'équipe Label Moto"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                    <div className="mb-12">
                      {article.intro && Array.isArray(article.intro) && article.intro.map((p: string, i: number) => (
                        <p key={i} className="text-xl leading-relaxed text-foreground font-black mb-4">{p}</p>
                      ))}
                      
                      {article.intro_points && Array.isArray(article.intro_points) && (
                        <ul className="list-none space-y-3 my-6 pl-0">
                          {article.intro_points.map((pt: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 text-lg text-foreground font-black">
                              <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      )}

                      {article.intro_conclusion && (
                        <p className="text-lg leading-relaxed text-foreground font-black italic border-l-4 border-brand pl-6 my-8">
                          {article.intro_conclusion}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      {article.sections && Array.isArray(article.sections) && article.sections.map((section: any, idx: number) => renderSection(section, idx))}
                    </div>

                    {article.faq && article.faq.length > 0 && (
                      <div className="pt-12 space-y-6">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="h-6 w-6 text-brand" />
                          <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Questions fréquentes</h3>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                          {article.faq.map((item: any, idx: number) => (
                            <AccordionItem key={idx} value={`item-${idx}`} className="border-b-brand/10">
                              <AccordionTrigger className="text-left font-black text-foreground py-4 hover:text-brand transition-colors">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-foreground font-black leading-relaxed pb-4">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}

                    {article.conclusion && (
                      <div className="mt-16 pt-8 border-t border-brand/20">
                        <div className="flex items-center gap-3 mb-6">
                          <Info className="h-6 w-6 text-brand" />
                          <h3 className="text-2xl font-black uppercase m-0 text-foreground">Le mot de la fin</h3>
                        </div>
                        <div className="space-y-4">
                          {Array.isArray(article.conclusion) ? (
                            article.conclusion.map((line: string, i: number) => (
                              <p key={i} className="text-lg text-foreground font-black leading-relaxed">{line}</p>
                            ))
                          ) : (
                            <p className="text-lg text-foreground font-black leading-relaxed">{article.conclusion}</p>
                          )}
                        </div>
                        <div className="flex justify-end items-center mt-8">
                          <p className="text-lg font-black text-foreground relative z-10">L'équipe Label Moto</p>
                          <Image 
                            src="/images/Stamp-LM.png?v=2" 
                            alt="Signature" 
                            width={120} 
                            height={120}
                            className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-12"
                          />
                        </div>
                      </div>
                    )}
                </div>
              </article>
            </div>

            <aside className="md:col-span-4 relative">
                <div className="md:sticky md:top-28 space-y-6">
                    <Card className="overflow-hidden shadow-2xl border-none bg-card/50 backdrop-blur-md rounded-3xl ring-1 ring-white/20">
                        <CardHeader className="p-6 bg-brand text-brand-foreground">
                            <CardTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-widest">
                                <Map className="h-6 w-6"/>
                                Trouver un pro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Link href="/map" className="block group rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                              <Image 
                                  src="/images/apercucartezoom.png"
                                  alt="Aperçu de la carte"
                                  width={400}
                                  height={300}
                                  className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110"
                              />
                            </Link>
                            <p className="text-muted-foreground text-sm mt-6 font-medium leading-relaxed">
                                Accédez à notre carte interactive pour trouver les meilleures concessions et ateliers moto près de chez vous.
                            </p>
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

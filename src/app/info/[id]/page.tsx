
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

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/info?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

  const renderNote = (note: string) => {
    if (!note) return null;
    
    // Guide budget
    const budgetTrigger = "notre guide sur le coût réel d’une moto par mois";
    const budgetTrigger2 = "notre guide sur le coût moyen d’une moto par mois";
    
    if (note.includes(budgetTrigger)) {
      const parts = note.split(budgetTrigger);
      return (
        <>
          {parts[0]}
          <Link href="/info/4" className="text-brand font-black underline hover:text-foreground transition-colors">
            Combien coûte vraiment une moto par mois ? Le budget réel d’un motard débutant
          </Link>
          {parts[1]}
        </>
      );
    }

    if (note.includes(budgetTrigger2)) {
      const parts = note.split(budgetTrigger2);
      return (
        <>
          {parts[0]}
          <Link href="/info/4" className="text-brand font-black underline hover:text-foreground transition-colors">
            Combien coûte vraiment une moto par mois ? Le budget réel d’un motard débutant
          </Link>
          {parts[1]}
        </>
      );
    }

    // Note spécifique achat occasion
    if (note.includes("Vérifie AVANT l’achat pour éviter les mauvaises surprises")) {
        const parts = note.split("Vérifie AVANT l’achat pour éviter les mauvaises surprises");
        return (
            <>
                👉 Vérifie AVANT l’achat pour éviter les mauvaises surprises.{" "}
                <Link href="/info/4" className="text-brand font-black underline hover:text-foreground transition-colors">
                    Combien coûte vraiment une moto par mois ? Le budget réel d’un motard débutant
                </Link>.
            </>
        );
    }

    return note;
  };

  const renderTable = (tableData: any) => {
    if (!tableData) return null;
    
    const headers = tableData.headers || [];
    const rows = tableData.rows || [];

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
            {rows.map((row: any, ri: number) => (
              <TableRow key={ri} className="hover:bg-muted/30">
                {Object.values(row).map((cell: any, ci: number) => (
                  <TableCell key={ci} className={cn("py-4", ci === 0 ? 'font-bold' : 'text-muted-foreground')}>
                    {String(cell)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderComparisonTable = (items: any[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="my-8 overflow-hidden rounded-2xl border-2 border-muted shadow-lg bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-b-2">
                <TableHead className="w-40 font-black text-brand uppercase tracking-widest text-[10px] py-6 px-6">
                  Comparaison
                </TableHead>
                {items.map((item, i) => (
                  <TableHead key={i} className="font-black text-foreground py-6 px-6 uppercase tracking-tighter text-lg text-center border-l border-muted/30">
                    {item.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell className="bg-muted/20 font-black text-[10px] uppercase tracking-widest text-green-600 px-6 py-8 align-top">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Avantages</span>
                  </div>
                </TableCell>
                {items.map((item, i) => (
                  <TableCell key={i} className="align-top px-6 py-8 border-l border-muted/30">
                    <ul className="space-y-3">
                      {item.strengths?.map((s: string, j: number) => (
                        <li key={j} className="text-sm font-bold flex items-start gap-2 text-foreground/90 leading-tight">
                          <span className="text-green-500 font-black shrink-0">•</span> 
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="hover:bg-transparent bg-muted/5">
                <TableCell className="bg-muted/20 font-black text-[10px] uppercase tracking-widest text-red-600 px-6 py-8 align-top border-t border-muted/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Inconvénients</span>
                  </div>
                </TableCell>
                {items.map((item, i) => (
                  <TableCell key={i} className="align-top px-6 py-8 border-l border-t border-muted/30">
                    <ul className="space-y-3">
                      {item.weaknesses?.map((w: string, j: number) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2 leading-tight">
                          <span className="text-red-400 font-black shrink-0">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderComparison = (item: any) => {
    if (!item.strengths && !item.weaknesses) return null;

    return (
      <Card key={item.title} className="border-2 border-muted overflow-hidden my-4 bg-card/50">
        <CardHeader className="bg-muted/30 py-4">
          <CardTitle className="text-xl font-black uppercase tracking-tight">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {item.strengths && (
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" /> Avantages
              </div>
              <ul className="list-none space-y-2">
                {item.strengths.map((s: string, j: number) => (
                  <li key={j} className="text-sm font-bold flex items-start gap-2 text-foreground/90">
                    <span className="text-green-500 font-black">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item.weaknesses && (
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" /> Inconvénients
              </div>
              <ul className="list-none space-y-2">
                {item.weaknesses.map((w: string, j: number) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-red-400 font-black">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSection = (section: any, idx: number) => {
    // Si la section est un bloc de comparaison (cas spécifique "Concession ou particulier")
    if (section.strengths || section.weaknesses) {
      return renderComparison(section);
    }

    return (
      <div key={idx} className="mb-12">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        
        {section.content && Array.isArray(section.content) && section.content.map((p: string, pi: number) => (
          <p key={pi} className="text-lg text-foreground/80 leading-relaxed mb-6">{p}</p>
        ))}

        {section.list && Array.isArray(section.list) && (
          <ul className="list-disc list-inside space-y-3 mb-8 pl-4">
            {section.list.map((item: string, li: number) => (
              <li key={li} className="text-lg text-foreground/80">{item}</li>
            ))}
          </ul>
        )}

        {section.table && renderTable(section.table)}
        
        {section.note && (
          <div className="bg-brand/5 border-l-4 border-brand p-4 mb-8 italic text-foreground rounded-r-lg">
            {renderNote(section.note)}
          </div>
        )}

        {/* Support pour les tableaux de comparaison imbriqués dans une section */}
        {section.items && Array.isArray(section.items) && renderComparisonTable(section.items)}

        {section.subsections && Array.isArray(section.subsections) && (
          <div className="space-y-6">
            {section.subsections.map((sub: any, si: number) => (
              <div key={si} className="ml-0 md:ml-6 mt-8 p-6 bg-muted/20 rounded-2xl border border-border/50">
                {sub.title && <h3 className="text-xl font-black uppercase mb-4 text-foreground/90">{sub.title}</h3>}
                
                {sub.content && Array.isArray(sub.content) && sub.content.map((p: string, spi: number) => (
                  <p key={spi} className="text-base text-foreground/70 leading-relaxed mb-4">{p}</p>
                ))}

                {sub.list && Array.isArray(sub.list) && (
                  <ul className="list-disc list-inside space-y-2 mb-6 pl-4">
                    {sub.list.map((item: string, sli: number) => (
                      <li key={sli} className="text-base text-foreground/70">{item}</li>
                    ))}
                  </ul>
                )}

                {sub.table && renderTable(sub.table)}
                
                {(sub.strengths || sub.weaknesses) && renderComparison(sub)}

                {sub.note && (
                  <div className="bg-white/50 dark:bg-black/20 border-l-4 border-brand/40 p-3 mb-4 text-sm italic text-foreground">
                    {renderNote(sub.note)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

  const imageUrl = article.imageUrl || "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="bg-background min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        onFilterChange={handleFilterChange}
        placeholderText="Rechercher un article..."
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
                <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden mb-8 shadow-2xl border-4 border-white">
                  <Image
                    src={imageUrl}
                    alt={article.display_title || article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                        {article.display_title || article.title}
                    </h1>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-90">
                      <span>Par {article.author || "L'équipe Label Moto"}</span>
                      <span className="opacity-50">•</span>
                      <span>{article.readingTime || "10 min de lecture"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                    <div className="mb-12">
                      {article.intro && Array.isArray(article.intro) && article.intro.map((p: string, i: number) => (
                        <p key={i} className="text-xl leading-relaxed text-foreground/90 font-medium mb-4">{p}</p>
                      ))}
                      
                      {article.intro_points && Array.isArray(article.intro_points) && (
                        <ul className="list-none space-y-3 my-6 pl-0">
                          {article.intro_points.map((pt: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 text-lg text-foreground/80 font-bold">
                              <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      )}

                      {article.intro_conclusion && (
                        <p className="text-lg leading-relaxed text-muted-foreground italic border-l-4 border-brand pl-6 my-8">
                          {article.intro_conclusion}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      {article.sections && Array.isArray(article.sections) && article.sections.map((section: any, idx: number) => renderSection(section, idx))}
                    </div>

                    {/* FAQ Section */}
                    {article.faq && article.faq.length > 0 && (
                      <div className="pt-12 space-y-6">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="h-6 w-6 text-brand" />
                          <h3 className="text-2xl font-black uppercase tracking-tight">Questions fréquentes</h3>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                          {article.faq.map((item: any, idx: number) => (
                            <AccordionItem key={idx} value={`item-${idx}`} className="border-b-brand/10">
                              <AccordionTrigger className="text-left font-bold text-foreground py-4 hover:text-brand transition-colors">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
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
                          <h3 className="text-2xl font-black uppercase m-0">Le mot de la fin</h3>
                        </div>
                        <div className="space-y-4">
                          {Array.isArray(article.conclusion) ? (
                            article.conclusion.map((line: string, i: number) => (
                              <p key={i} className="text-lg text-foreground/80 leading-relaxed">{line}</p>
                            ))
                          ) : (
                            <p className="text-lg text-foreground/80 leading-relaxed">{article.conclusion}</p>
                          )}
                        </div>
                        <div className="flex justify-end items-center mt-8">
                          <p className="text-lg font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p>
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


'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Map, CheckCircle2, Info, Loader2, FileText, ChevronRight, Home, ShieldCheck } from 'lucide-react';

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
  if (t.includes('himalayan 450') || t.includes('duke 390')) return null;
  if (t.includes('mt-07')) return 'yamaha-mt-07-2021-plus';
  if (t.includes('z650')) return 'kawasaki-z650-2020-plus';
  if (t.includes('cb500 hornet') || t.includes('cb500f')) return 'honda-cb500f-2022-plus';
  if (t.includes('tracer 7')) return 'yamaha-tracer-7-2021-plus';
  if (t.includes('nx500') || t.includes('cb500x')) return 'honda-nx500-2024-plus';
  if (t.includes('r7')) return 'yamaha-r7-2022-plus';
  if (t.includes('cbr500r')) return 'honda-cbr500r-2022-plus';
  if (t.includes('sv650')) return 'suzuki-sv650-2016-plus';
  if (t.includes('trident 660')) return 'triumph-trident-660-2021-plus';
  if (t.includes('xsr700')) return 'yamaha-xsr700-2021-plus';
  if (t.includes('forza 350')) return 'honda-forza-350';
  if (t.includes('xmax 125')) return 'yamaha-xmax-125';
  if (t.includes('cb125r')) return 'honda-cb125r-2021-plus';
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
    if (!article) return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";
    if (id.includes('assurance') || article.id?.includes('assurance') || article.title?.toLowerCase().includes('assurance')) return "/images/motard-article-assurance2026.png";
    if (id.includes('a2') || article.id?.includes('a2') || article.title?.toLowerCase().includes('a2')) return "/images/achat-occasion.png";
    if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
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

  const handleFilterChange = (filter: 'shopping' | 'service' | null) => {
    router.push(`/map?filter=${filter}`);
  };

  const renderTable = (tableData: any) => {
    if (!tableData) return null;
    const headers = tableData.headers || [];
    const rows = tableData.rows || [];

    const normalize = (s: string) => 
        String(s).toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "_");

    return (
      <div className="my-8 overflow-x-auto rounded-xl border-2 border-muted shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {headers.map((h: string, i: number) => (
                <TableHead key={i} className="font-black text-foreground py-4 uppercase tracking-widest text-[10px] whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row: any, ri: number) => (
              <TableRow key={ri} className="hover:bg-muted/30">
                {headers.map((header: string, hi: number) => {
                  const normHeader = normalize(header);
                  let value = row[header] || row[normHeader];
                  if (value === undefined) {
                      const key = Object.keys(row).find(k => normalize(k) === normHeader);
                      value = key ? row[key] : '';
                  }
                  return (
                    <TableCell key={hi} className="py-4 text-foreground font-black">
                      {String(value)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderCards = (cards: any[]) => {
    if (!cards || cards.length === 0) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {cards.map((card, idx) => {
          return (
            <Card key={idx} className="border-2 border-brand/20 overflow-hidden bg-card h-full flex flex-col shadow-md group/card hover:border-brand/50 transition-all">
              <CardHeader className="bg-brand/5 py-4 border-b">
                <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground">
                  {card.title}
                </CardTitle>
                {card.subtitle && <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{card.subtitle}</p>}
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-grow">
                {card.recommended_formula && (
                  <div className="bg-brand/10 p-3 rounded-lg border border-brand/20">
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand mb-1">Formule recommandée</p>
                    <p className="text-lg font-black uppercase text-foreground">{card.recommended_formula}</p>
                  </div>
                )}
                
                {card.content && (
                  <div className="text-sm font-bold text-muted-foreground leading-relaxed space-y-2">
                    {Array.isArray(card.content) ? card.content.map((p: string, i: number) => <p key={i}>{p}</p>) : <p>{card.content}</p>}
                  </div>
                )}

                {card.advantages && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Avantages
                    </div>
                    <ul className="list-none space-y-1">
                      {card.advantages.map((adv: string, i: number) => (
                        <li key={i} className="text-xs font-black flex items-start gap-2"><span className="text-green-500">•</span> {adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {card.items && !card.advantages && (
                  <ul className="list-none space-y-2">
                    {card.items.map((item: string, j: number) => (
                      <li key={j} className="text-sm font-black flex items-start gap-2 text-foreground">
                        <span className="text-brand font-black shrink-0">•</span> {item}
                      </li>
                    ))}
                  </ul>
                )}

                {card.linked_models && (
                  <div className="pt-4 border-t border-dashed">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Modèles adaptés :</p>
                    <div className="flex flex-wrap gap-2">
                      {card.linked_models.map((m: any, i: number) => {
                        const ficheId = getFicheIdFromTitle(m.label);
                        return ficheId ? (
                          <Link key={i} href={`/fiches/${ficheId}?from=${id}`} className="text-[10px] font-black uppercase bg-muted px-2 py-1 rounded hover:bg-brand/10 hover:text-brand transition-colors">
                            {m.label}
                          </Link>
                        ) : (
                          <span key={i} className="text-[10px] font-black uppercase bg-muted px-2 py-1 rounded opacity-60">{m.label}</span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderSection = (section: any, idx: number) => {
    const sectionId = section.title ? slugify(section.title) : `section-${idx}`;
    const bodyText = section.text || section.content || section.body || section.description;

    return (
      <div key={idx} id={sectionId} className="mb-12 scroll-mt-28">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        
        {section.title && 
         (section.title.toLowerCase().includes('budget reel') || section.title.toLowerCase().includes('ton budget réel')) && (
          <div className="mt-6 p-5 bg-brand/5 border-2 border-dashed border-brand/30 rounded-2xl mb-8">
            <Link href="/info" className="group flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">Dossier Spécial</p>
                <h4 className="text-lg font-black uppercase tracking-tight text-foreground group-hover:text-brand transition-colors">
                  Calculer mon budget réel →
                </h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Assurance, entretien, équipement : ne laissez rien au hasard.</p>
              </div>
              <div className="bg-brand text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform shrink-0">
                <FileText className="h-5 w-5" />
              </div>
            </Link>
          </div>
        )}

        {section.title && 
         (section.title.toLowerCase().includes('assurance')) && 
         id !== 'assurance-moto-bien-choisir-sa-formule-selon-votre-profil' && (
          <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-500/30 rounded-2xl mb-8">
            <Link href="/info" className="group flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Dossier Spécial Assurance</p>
                <h4 className="text-lg font-black uppercase tracking-tight text-foreground group-hover:text-blue-600 transition-colors">
                  Bien choisir son assurance moto →
                </h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Tiers, Tiers Plus ou Tous Risques ? Découvrez la formule idéale.</p>
              </div>
              <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </Link>
          </div>
        )}

        {bodyText && (
          Array.isArray(bodyText) ? (
            bodyText.map((p: string, i: number) => <p key={i} className="text-lg text-foreground font-bold leading-relaxed mb-6">{p}</p>)
          ) : typeof bodyText === 'string' && (
            <p className="text-lg text-foreground font-bold leading-relaxed mb-6">{bodyText}</p>
          )
        )}

        {section.table && renderTable(section.table)}
        {section.cards && renderCards(section.cards)}

        {section.list && Array.isArray(section.list) && (
          <ul className="list-disc list-inside space-y-3 mb-8 pl-4">
            {section.list.map((item: string, li: number) => (
              <li key={li} className="text-lg text-foreground font-black">{item}</li>
            ))}
          </ul>
        )}

        {section.ordered_list && Array.isArray(section.ordered_list) && (
          <ol className="list-decimal list-inside space-y-3 mb-8 pl-4">
            {section.ordered_list.map((item: string, li: number) => (
              <li key={li} className="text-lg text-foreground font-black">{item}</li>
            ))}
          </ol>
        )}

        {section.subsections && Array.isArray(section.subsections) && (
          <div className="space-y-6">
            {section.subsections.map((sub: any, si: number) => renderSection(sub, si))}
          </div>
        )}
      </div>
    );
  };

  if (isDbLoading && !article) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-brand mb-4" /><p className="text-muted-foreground font-black animate-pulse uppercase tracking-widest text-[10px]">Chargement de l'article...</p></div>);
  
  if (!article) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4"><h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Article non trouvé</h1><p className="text-muted-foreground mb-8">Nous n'avons pas trouvé l'article demandé.</p><Button asChild className="rounded-full px-8 font-black uppercase tracking-widest text-xs"><Link href="/info">Retour aux articles</Link></Button></div>);

  return (
    <div className="min-h-screen relative">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={handleSearch} activeFilter={null} onFilterChange={handleFilterChange} placeholderText="Recherche par departement , ville , marque, nom ... " />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8 overflow-hidden whitespace-nowrap"><Link href="/" className="hover:text-brand transition-colors flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /><span>Accueil</span></Link><ChevronRight className="h-3 w-3 shrink-0" /><Link href="/info" className="hover:text-brand transition-colors shrink-0">Conseils</Link><ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{article.display_title || article.title}</span></nav>
          
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

                {article.intro && Array.isArray(article.intro) && (
                    <div className="mb-12 space-y-4">
                        {article.intro.map((p: string, i: number) => (
                            <p key={i} className="text-xl leading-relaxed text-foreground font-black">{p}</p>
                        ))}
                    </div>
                )}

                {allSummaryPoints.length > 0 && (
                    <div className="my-8 p-6 bg-muted/30 rounded-2xl border border-brand/10">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Au sommaire de ce guide :</p>
                        <ul className="list-none space-y-3 pl-0">
                            {allSummaryPoints.map((pt, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg text-foreground font-black group/item">
                                    <CheckCircle2 className="h-5 w-5 text-brand shrink-0 group-hover/item:scale-110 transition-transform" />
                                    <a href={`#${pt.id}`} className="hover:text-brand transition-all hover:translate-x-1 decoration-brand/30 underline-offset-4 hover:underline">
                                        {pt.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-12">
                    {activeSections && activeSections.map((section: any, idx: number) => renderSection(section, idx))}
                </div>

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
                        <div className="flex justify-end items-center mt-12">
                            <p className="text-lg font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p>
                            <Image src="/images/Stamp-LM.png?v=2" alt="Signature" width={120} height={120} className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-12" />
                        </div>
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

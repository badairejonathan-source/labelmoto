
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Map, Info, ChevronRight, Loader2, FileText, CheckCircle2, Plus, Minus, AlertTriangle, Home } from 'lucide-react';
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
  text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

const brandsData = [
  {
    name: "BMW",
    models: [
      { id: "bmw-g310r-2021-plus", label: "G 310 R", tags: ["A2"] },
      { id: "bmw-f750-gs-f850-gs-2018-plus", label: "F 750 GS / F 850 GS", tags: ["A2 / Full"] },
      { id: "bmw-f900r-2020-plus", label: "F 900 R", tags: ["A2 / Full"] },
      { id: "bmw-r1250-gs-r1300-gs-2019-plus", label: "R 1250 GS / R 1300 GS" },
    ]
  },
  {
    name: "Honda",
    models: [
      { id: "honda-cb500f-2022-plus", label: "CB 500 F", tags: ["A2"] },
      { id: "honda-cbr500r-2022-plus", label: "CBR 500 R", tags: ["A2"] },
      { id: "honda-nx500-2024-plus", label: "NX 500", tags: ["A2"] },
      { id: "honda-cb650r-2020-plus", label: "CB 650 R", tags: ["A2 / Full"] },
      { id: "honda-cb750-hornet-2023-plus", label: "CB 750 Hornet" },
      { id: "honda-xl750-transalp-2023-plus", label: "XL 750 Transalp" },
      { id: "honda-cb1000-hornet-2025-plus", label: "CB 1000 Hornet (2025+)" },
    ]
  },
  {
    name: "Kawasaki",
    models: [
      { id: "kawasaki-er6n-2012-plus", label: "ER-6n (2012+)" },
      { id: "kawasaki-z650-2020-plus", label: "Z 650", tags: ["A2 / Full"] },
      { id: "kawasaki-versys-650-2022-plus", label: "Versys 650", tags: ["A2 / Full"] },
      { id: "kawasaki-z900-2020-plus", label: "Z 900", tags: ["A2 / Full"] },
    ]
  },
  {
    name: "Suzuki",
    models: [
      { id: "suzuki-sv650-2016-plus", label: "SV 650", tags: ["A2 / Full"] },
      { id: "suzuki-v-strom-650-2017-plus", label: "V-Strom 650", tags: ["A2 / Full"] },
      { id: "suzuki-gsx-8s-2023-plus", label: "GSX-8S", tags: ["A2 / Full"] },
    ]
  },
  {
    name: "Triumph",
    models: [
      { id: "triumph-trident-660-2021-plus", label: "Trident 660", tags: ["A2 / Full"] },
    ]
  },
  {
    name: "Yamaha",
    models: [
      { id: "yamaha-mt-03-2020-plus", label: "MT-03", tags: ["A2"] },
      { id: "yamaha-mt-07-2021-plus", label: "MT-07", tags: ["A2 / Full"] },
      { id: "yamaha-tracer-7-2021-plus", label: "Tracer 7", tags: ["A2 / Full"] },
      { id: "yamaha-xsr700-2021-plus", label: "XSR 700", tags: ["A2 / Full"] },
      { id: "yamaha-r7-2022-plus", label: "YZF-R7", tags: ["A2 / Full"] },
    ]
  }
];

export default function EntretienPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
  
  const firestore = useFirestore();
  const articleId = 'entretien-moto-intervalles-prix-conseils-par-modele';
  
  const articleRef = useMemoFirebase(() => doc(firestore, 'articles', articleId), [firestore, articleId]);
  const { data: article, isLoading: isArticleLoading } = useDoc(articleRef);

  // --- HOOKS AT THE TOP ---

  const imageUrl = useMemo(() => {
    if (article?.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
    return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";
  }, [article]);

  const activeSections = useMemo(() => {
    if (!article?.sections) return [];
    return article.sections.filter((s: any) => s.title !== "Moto vs voiture : le vrai comparatif");
  }, [article]);
  
  const allSummaryPoints = useMemo(() => {
    const points: { title: string; id: string }[] = [];
    activeSections.forEach((s: any) => {
      if (s.title) {
        points.push({ title: s.title, id: slugify(s.title) });
      }
      if (s.subsections) {
        s.subsections.forEach((sub: any) => {
          if (sub.title) {
            points.push({ title: sub.title, id: slugify(sub.title) });
          }
        });
      }
    });
    return points;
  }, [activeSections]);

  const toggleBrand = (brandName: string) => {
    setExpandedBrands(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName) 
        : [...prev, brandName]
    );
  };

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
    const budgetId = "combien-coute-vraiment-une-moto-par-mois"; 
    
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
          <Link href={`/info/${budgetId}`} className="text-foreground font-black underline hover:text-brand transition-colors">
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

    const normalize = (s: string) => 
        String(s).toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "");

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
            {rows.map((row: any, ri: number) => {
              const rowValues = headers.map((header: string, hi: number) => {
                const normHeader = normalize(header);
                
                // 1. Handling Array Data
                if (Array.isArray(row)) {
                    return row[hi] !== undefined ? row[hi] : '';
                }
                
                // 2. Handling Object Data with smart matching
                if (row[header] !== undefined) return row[header];
                
                const foundExact = Object.keys(row).find(k => normalize(k) === normHeader);
                if (foundExact) return row[foundExact];

                const foundKey = Object.keys(row).find(k => {
                    const nk = normalize(k);
                    const nh = normHeader;
                    if (nk === nh) return true;
                    if (nk.length > 2 && nh.includes(nk)) return true;
                    if (nh.length > 2 && nk.includes(nh)) return true;
                    const sharedWords = ["usage", "budget", "prix", "entretien", "frequence", "revision"];
                    return sharedWords.some(word => nk.includes(word) && nh.includes(word));
                });
                
                if (foundKey) return row[foundKey];
                
                const keys = Object.keys(row);
                if (keys[hi] !== undefined) return row[keys[hi]];

                return '';
              });

              return (
                <TableRow key={ri} className="hover:bg-muted/30">
                  {rowValues.map((cell: any, ci: number) => (
                    <TableCell key={ci} className={cn("py-4 text-foreground font-black", ci === 0 && "font-black")}>
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
    if (section.title === "Moto vs voiture : le vrai comparatif") return null;

    const hasComparisonData = section.strengths || section.weaknesses;
    const hasComparisonSubsections = section.subsections?.some((sub: any) => sub.strengths || sub.weaknesses);
    const sectionId = section.title ? slugify(section.title) : `section-${idx}`;

    return (
      <div key={idx} id={sectionId} className="mb-12 scroll-mt-28">
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

        {/* Specific CTA for budget sections */}
        {section.title && 
         (section.title.toLowerCase().includes('budget reel') || section.title.toLowerCase().includes('ton budget réel')) && (
          <div className="mt-6 p-5 bg-brand/5 border-2 border-dashed border-brand/30 rounded-2xl">
            <Link href="/info/combien-coute-vraiment-une-moto-par-mois" className="group flex items-center justify-between gap-4">
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

        {section.conclusion && <p className="text-lg text-foreground font-black mt-6 italic border-l-4 border-muted pl-4">{section.conclusion}</p>}
      </div>
    );
  };

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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-brand transition-colors flex items-center gap-1">
              <Home className="h-3 w-3" />
              <span>Accueil</span>
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Entretien & Révisions</span>
          </nav>
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter text-foreground mb-4 uppercase">
              Catalogue des Fiches Techniques
            </h1>
            <p className="text-xl text-muted-foreground font-bold max-w-3xl">
              Sélectionnez une marque pour accéder aux guides d'entretien officiels et aux spécifications techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-4">
              {brandsData.map((brand) => {
                const isExpanded = expandedBrands.includes(brand.name);
                return (
                  <section key={brand.name} className="border border-border/50 rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm transition-all">
                    <button 
                      onClick={() => toggleBrand(brand.name)}
                      className={cn(
                        "w-full flex items-center justify-between p-6 transition-colors",
                        isExpanded ? "bg-brand/10" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all",
                          isExpanded ? "bg-brand text-brand-foreground rotate-0" : "bg-muted text-muted-foreground"
                        )}>
                          {brand.name.charAt(0)}
                        </div>
                        <h2 className={cn(
                          "text-2xl font-black uppercase tracking-tighter",
                          isExpanded ? "text-brand" : "text-foreground"
                        )}>
                          {brand.name}
                        </h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {brand.models.length} modèles
                        </span>
                        {isExpanded ? <Minus className="h-5 w-5 text-brand" /> : <Plus className="h-5 w-5 text-muted-foreground" />}
                      </div>
                    </button>

                    <div className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isExpanded ? "grid-rows-[1fr] opacity-100 p-6 pt-0" : "grid-rows-[0fr] opacity-0"
                    )}>
                      <div className="overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {brand.models.map((model) => (
                            <Link 
                              key={model.id} 
                              href={`/fiches/${model.id}`}
                              className="group flex items-center justify-between p-4 bg-background/50 hover:bg-brand/5 border border-border/50 hover:border-brand/30 rounded-xl transition-all shadow-sm"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-black text-sm text-foreground group-hover:text-brand transition-colors">{model.label}</span>
                                {model.tags && (
                                  <div className="flex gap-1">
                                    {model.tags.map(tag => (
                                      <span key={tag} className="text-[8px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}

              <div className="pt-24 border-t border-border/50">
                {isArticleLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">Chargement de l'article conseils...</p>
                  </div>
                ) : article ? (
                  <article className="prose prose-neutral dark:prose-invert max-w-none">
                    <div className="flex items-center gap-3 mb-8">
                      <FileText className="h-10 w-10 text-brand" />
                      <h2 className="text-4xl font-black uppercase tracking-tight m-0 text-foreground">
                        {article.display_title || article.title}
                      </h2>
                    </div>

                    <div className="relative w-full aspect-[4/3] md:aspect-[2/1] rounded-3xl overflow-hidden mb-12 shadow-xl border-4 border-white bg-muted">
                      <Image
                        src={imageUrl}
                        alt={article.display_title || article.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="mb-12">
                      {article.intro && Array.isArray(article.intro) && article.intro.map((p: string, i: number) => (
                        <p key={i} className="text-xl leading-relaxed text-foreground font-black mb-4">{p}</p>
                      ))}
                      
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

                      {article.intro_conclusion && (
                        <p className="text-lg leading-relaxed text-foreground font-black italic border-l-4 border-brand pl-6 my-8">
                          {article.intro_conclusion}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      {activeSections.map((section: any, idx: number) => renderSection(section, idx))}
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
                  </article>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                    <Info className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-bold">L'article conseils est introuvable ou n'est pas encore publié.</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:col-span-4 relative">
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
                            <p className="text-muted-foreground text-sm mt-6 font-bold leading-relaxed">
                                Comparez les ateliers et concessions pour votre prochaine révision directement sur notre carte interactive.
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

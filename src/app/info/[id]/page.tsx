
'use client';

import React, { useState, use, useMemo } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Map, CheckCircle2, Info, Loader2, FileText, HelpCircle, AlertTriangle, ChevronRight, Home, ExternalLink } from 'lucide-react';

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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const slugify = (text: string) => 
  text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

// Helper to find technical sheet ID from model title
const getFicheIdFromTitle = (title: string): string | null => {
  const t = title.toLowerCase();
  // Ne pas créer de lien pour ces modèles qui n'ont pas de fiche
  if (t.includes('himalayan 450') || t.includes('duke 390')) return null;
  
  if (t.includes('mt-07')) return 'yamaha-mt-07-2021-plus';
  if (t.includes('z650')) return 'kawasaki-z650-2020-plus';
  if (t.includes('cb500 hornet') || t.includes('cb500f')) return 'honda-cb500f-2022-plus';
  if (t.includes('tracer 7')) return 'yamaha-tracer-7-2021-plus';
  if (t.includes('nx500') || t.includes('cb500x')) return 'honda-nx500-2024-plus';
  if (t.includes('r7')) return 'yamaha-r7-2022-plus';
  if (t.includes('cbr500r')) return 'honda-cbr500r-2022-plus';
  if (t.includes('sv650')) return 'suzuki-sv650-2016-plus';
  return null;
};

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const firestore = useFirestore();
  const articleRef = useMemoFirebase(() => doc(firestore, 'articles', id), [firestore, id]);
  const { data: article, isLoading } = useDoc(articleRef);

  const imageUrl = useMemo(() => {
    if (!article) return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";
    if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
    const articleId = (article.id || id).toLowerCase();
    const title = (article.display_title || article.title || "").toLowerCase();
    
    if (articleId.includes('pieges') || articleId.includes('occasion') || title.includes('pièges')) return "/images/evitelespieges.jpg";
    if (articleId.includes('budget') || title.includes('budget')) return "https://images.unsplash.com/photo-1572452571879-3d67d5b2a39f?q=80&w=1080";
    if (articleId.includes('a2') || title.includes('a2')) return "/images/achat-occasion.jpg";
    if (articleId.includes('zfe') || title.includes('zfe')) return "/images/motardZFEarticle2.png";
    if (articleId.includes('entretien') || title.includes('entretien') || title.includes('révision')) return "/images/motard-entretien-page.png";
    if (articleId.includes('assurance') || title.includes('assurance')) return "https://images.unsplash.com/photo-1611004061856-ccc3cbe944b2?q=80&w=1080";
    
    return "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2070&auto=format&fit=crop";
  }, [article, id]);

  const activeSections = useMemo(() => {
    if (!article?.sections && !article?.content) return [];
    if (article?.content) return article.content;
    return article.sections.filter((s: any) => s.title !== "Moto vs voiture : le vrai comparatif");
  }, [article]);
  
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

  const renderComparisonGrid = (items: any[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {items.map((item, idx) => {
          const ficheId = getFicheIdFromTitle(item.title);
          const content = (
            <Card className="border-2 border-muted overflow-hidden bg-card h-full flex flex-col shadow-sm group/card hover:border-brand/50 transition-all">
              <CardHeader className="bg-muted/30 py-4 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black uppercase tracking-tight text-foreground">
                  {item.title}
                </CardTitle>
                {ficheId && <ExternalLink className="h-4 w-4 text-muted-foreground group-hover/card:text-brand transition-colors" />}
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-grow">
                {item.strengths && Array.isArray(item.strengths) && item.strengths.length > 0 && (<div className="space-y-3"><div className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> {id.includes('assurance') ? 'Conseils clés' : 'Avantages'}</div><ul className="list-none space-y-2">{item.strengths.map((s: string, j: number) => (<li key={j} className="text-sm font-black flex items-start gap-2 text-foreground"><span className="text-green-500 font-black shrink-0">•</span> {s}</li>))}</ul></div>)}
                {item.weaknesses && Array.isArray(item.weaknesses) && item.weaknesses.length > 0 && (<div className="space-y-3"><div className="text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center gap-2"><AlertTriangle className="h-3 w-3" /> {id.includes('assurance') ? 'Vigilance' : 'Inconvénients'}</div><ul className="list-none space-y-2">{item.weaknesses.map((w: string, j: number) => (<li key={j} className="text-sm font-black flex items-start gap-2 text-foreground"><span className="text-red-400 font-black shrink-0">•</span> {w}</li>))}</ul></div>)}
              </CardContent>
              {ficheId && (
                <CardFooter className="bg-brand/5 p-3 border-t">
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand mx-auto">Voir la fiche technique →</span>
                </CardFooter>
              )}
            </Card>
          );

          return ficheId ? (
            <Link key={idx} href={`/fiches/${ficheId}?from=${id}`} className="block h-full transition-transform hover:-translate-y-1">
              {content}
            </Link>
          ) : (
            <div key={idx} className="h-full">{content}</div>
          );
        })}
      </div>
    );
  };

  const renderSection = (section: any, idx: number) => {
    const hasComparisonData = section.strengths || section.weaknesses;
    const hasComparisonSubsections = section.subsections?.some((sub: any) => sub.strengths || sub.weaknesses);
    const sectionId = section.title ? slugify(section.title) : `section-${idx}`;
    return (
      <div key={idx} id={sectionId} className="mb-12 scroll-mt-28">
        {section.title && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.title}</h2>}
        {section.text && <p className="text-lg text-foreground font-bold leading-relaxed mb-6">{section.text}</p>}
        {section.type === 'paragraph' && section.text && <p className="text-lg text-foreground font-bold leading-relaxed mb-6">{section.text}</p>}
        {section.type === 'paragraph' && section.html && <p className="text-lg text-foreground font-bold leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: section.html }} />}
        {section.type === 'heading' && <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2">{section.text}</h2>}
        {section.type === 'list' && section.items && (<ul className="list-disc list-inside space-y-3 mb-8 pl-4">{section.items.map((item: string, li: number) => (<li key={li} className="text-lg text-foreground font-black">{item}</li>))}</ul>)}
        {section.type === 'comparison' && renderComparisonGrid(section.subsections || [])}
        {section.type === 'signature' && (
            <div className="flex justify-end items-center mt-12 pt-8 border-t border-brand/10">
                <p className="text-lg font-bold text-foreground/90 relative z-10">{section.text}</p>
                {section.imageUrl && <Image src={section.imageUrl} alt={section.alt || "Signature"} width={120} height={120} className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-12" />}
            </div>
        )}
        {hasComparisonSubsections ? (<div className="mt-8">{renderComparisonGrid(section.subsections)}</div>) : hasComparisonData ? (<div className="mt-8">{renderComparisonGrid([section])}</div>) : (section.subsections && Array.isArray(section.subsections) && (<div className="space-y-6">{section.subsections.map((sub: any, si: number) => renderSection(sub, si))}</div>))}
      </div>
    );
  };

  if (isLoading) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-brand mb-4" /><p className="text-muted-foreground font-black animate-pulse uppercase tracking-widest text-[10px]">Chargement de l'article...</p></div>);
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
                <div className="relative w-full aspect-video md:aspect-[2/1] rounded-3xl overflow-hidden mb-8 shadow-2xl border-4 border-white bg-muted group"><Image src={imageUrl} alt={article.display_title || article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" /><div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full"><h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-2 drop-shadow-lg max-w-[95%]">{article.display_title || article.title}</h1><div className="flex items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-90"><span>Par {article.author || "L'équipe Label Moto"}</span></div></div></div>
                <div className="space-y-6">
                    <div className="space-y-4">{activeSections && activeSections.map((section: any, idx: number) => renderSection(section, idx))}</div>
                </div>
              </article>
            </div>
            <aside className="lg:col-span-4 relative"><div className="md:sticky md:top-28 space-y-6"><Card className="overflow-hidden shadow-2xl border-none bg-card/50 backdrop-blur-md rounded-3xl ring-1 ring-white/20"><CardHeader className="p-6 bg-brand text-brand-foreground"><CardTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-widest"><Map className="h-6 w-6"/>Trouver un pro</CardTitle></CardHeader><CardContent className="p-6"><Link href="/map" className="block group rounded-2xl overflow-hidden border-4 border-white shadow-xl"><Image src="/images/apercucartezoom.png" alt="Aperçu de la carte" width={400} height={300} className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110" /></Link><p className="text-muted-foreground text-sm mt-6 font-medium leading-relaxed">Accédez à notre carte interactive pour trouver les meilleures concessions et ateliers moto en France.</p></CardContent><CardFooter className="px-6 pb-8"><Button asChild className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs tracking-widest py-6 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"><Link href="/map">Voir la carte interactive</Link></Button></CardFooter></Card></div></aside>
          </div>
        </div>
      </main>
    </div>
  );
}

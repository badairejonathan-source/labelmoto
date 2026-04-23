'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Gauge, 
  Droplets, 
  Wrench, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Home, 
  ChevronRight, 
  Bike, 
  Scale,
  ShieldCheck,
  Zap,
  Cpu,
  RefreshCw,
  LayoutGrid,
  FileText,
  ClipboardList
} from 'lucide-react';

import Header from '@/components/app/header';
import LabelMotoLogo from '@/components/app/logo';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Utilitaire pour extraire une valeur d'un objet de manière flexible
const getRobustValue = (obj: any, preferredKeys: string[], defaultValue: string = "") => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  // 1. Chercher dans les clés préférées
  for (const key of preferredKeys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return String(obj[key]);
    }
  }
  
  // 2. Fallback sur n'importe quelle clé si c'est un objet simple (souvent le cas pour les tableaux de données)
  const values = Object.values(obj).filter(v => typeof v === 'string' || typeof v === 'number');
  if (values.length > 0) return String(values[0]);

  return defaultValue;
};

export default function FicheClient({ modelId }: { modelId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const from = searchParams.get('from');
  const returnUrl = from === 'entretien' ? '/entretien' : (from ? `/info/${from}` : null);
  const returnLabel = from === 'entretien' ? "Retour au catalogue" : "Retour à l'article";

  const firestore = useFirestore();
  const ficheRef = useMemoFirebase(() => doc(firestore, 'motorcycle_sheets', modelId), [firestore, modelId]);
  const { data: fiche, isLoading } = useDoc(ficheRef);

  useEffect(() => { 
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
    setSelectedVariantIndex(0); 
  }, [modelId]);

  const displayData = useMemo(() => {
    if (!fiche) return null;
    
    const variants = fiche.variants || [];
    const ts = fiche.technical_sheet || {};
    const activeVariant = variants[selectedVariantIndex] || {};
    const cp = { ...(ts.cycle_parts || {}), ...(activeVariant.cycle_parts || {}) };
    const sg = fiche.service_guide || {};
    const rel = fiche.relations || {};

    return {
      modelName: fiche.display_title || fiche.model || modelId.replace(/-/g, ' ').toUpperCase(),
      brand: fiche.brand || (modelId.split('-')[0] || '').toUpperCase(),
      year: fiche.year_range || "N/A",
      category: fiche.category || "Moto",
      introduction: sg.intro || fiche.intro || "",
      imageUrl: fiche.imageUrl || "/images/motard-entretien-page.webp",
      hasVariants: variants.length > 1,
      variants: variants,
      engine: {
        bridage: activeVariant.license_bridging || ts.license_bridging || "Standard",
        type: activeVariant.engine_type || ts.engine_type || "N/A",
        displacement: (activeVariant.displacement_cc || ts.displacement_cc) ? `${activeVariant.displacement_cc || ts.displacement_cc} cm³` : "N/A",
        power: activeVariant.power || ts.power || "N/A",
        torque: activeVariant.torque || ts.torque || "N/A",
        alimentation: activeVariant.fuel_system || ts.fuel_system || "N/A"
      },
      transmission: {
        gearbox: activeVariant.gearbox || ts.gearbox || "6 rapports",
        finalDrive: activeVariant.final_drive || ts.final_drive || "Chaîne",
        clutch: activeVariant.clutch || ts.clutch || "Multidisque"
      },
      electronics: activeVariant.electronics || ts.electronics || ["ABS"],
      dimensions: {
        wetWeight: (activeVariant.weight_tpf_kg || ts.weight_tpf_kg) ? `${activeVariant.weight_tpf_kg || ts.weight_tpf_kg} kg` : "N/A",
        seatHeight: (activeVariant.seat_height_mm || ts.seat_height_mm) ? `${activeVariant.seat_height_mm || ts.seat_height_mm} mm` : "N/A",
      },
      serviceSchedule: sg.service_schedule || fiche.service_schedule || [],
      consumables: sg.consumables || fiche.consumables || [],
      faq: sg.faq || fiche.faq || [],
      knownIssues: sg.known_issues || fiche.known_issues || [],
      longevityTips: sg.longevity_tips || fiche.longevity_tips || [],
      relations: {
        articles: rel.related_articles || fiche.related_articles || [],
        models: rel.related_models || fiche.related_models || []
      },
      conclusion: sg.conclusion || fiche.conclusion || "",
    };
  }, [fiche, selectedVariantIndex, modelId]);

  if (isLoading) return (
    <div className="min-h-screen bg-background">
        <Header searchTerm="" onSearchTermChange={() => {}} onSearch={() => {}} />
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto space-y-8 pt-28">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
            </div>
        </main>
    </div>
  );

  if (!fiche || !displayData) return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4">
        <h1 className="text-4xl font-black mb-4 uppercase">Fiche non trouvée</h1>
        <Button asChild className="bg-brand rounded-full px-8"><Link href="/entretien">Retour au catalogue</Link></Button>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-background">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8 pt-20 md:pt-28">
            <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><Link href="/entretien" className="hover:text-brand shrink-0">Entretien</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate">{displayData.modelName}</span>
          </nav>
          
          <div className="mb-8">
            {returnUrl && (
              <Button asChild variant="outline" className="border-brand text-brand rounded-full hover:bg-brand/10 h-10 px-6 font-black uppercase tracking-widest text-[10px]">
                  <Link href={returnUrl} className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> {returnLabel}</Link>
              </Button>
            )}
          </div>

          <div className="space-y-12">
            {/* HERO SECTION */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-black min-h-[400px] flex flex-col justify-end">
                <div className="absolute inset-0 z-0">
                    <Image src={displayData.imageUrl} alt={displayData.modelName} fill className="object-cover opacity-60" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                
                <div className="relative z-10 p-6 md:p-12 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div className="text-white">
                            <span className="inline-block bg-brand text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3">{displayData.category} - Officiel</span>
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-2">{displayData.modelName}</h1>
                            <p className="text-lg sm:text-2xl font-black text-brand italic">Millésime {displayData.year}</p>
                        </div>
                        <div className="w-48 sm:w-64 drop-shadow-2xl brightness-0 invert opacity-80"><LabelMotoLogo noBubble /></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                        <div className="space-y-1"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Gauge className="h-3.5 w-3.5" /> Puissance</div><p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.engine.power}</p></div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Scale className="h-3.5 w-3.5" /> Poids</div><p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.dimensions.wetWeight}</p></div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Bike className="h-3.5 w-3.5" /> Selle</div><p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.dimensions.seatHeight}</p></div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><CheckCircle2 className="h-3.5 w-3.5" /> Permis</div><p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.engine.bridage}</p></div>
                    </div>
                </div>
            </div>

            {displayData.hasVariants && (
              <div className="flex flex-col items-center gap-4 bg-muted/30 p-6 rounded-[2rem] border shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Sélectionnez la version :</p>
                <Tabs value={String(selectedVariantIndex)} onValueChange={(v) => setSelectedVariantIndex(Number(v))} className="w-full max-w-md">
                  <TabsList className="grid w-full h-14 bg-background border-2 shadow-xl p-1 rounded-xl" style={{ gridTemplateColumns: `repeat(${displayData.variants.length}, 1fr)` }}>
                    {displayData.variants.map((v: any, idx: number) => (
                      <TabsTrigger key={idx} value={String(idx)} className="font-black uppercase text-[10px] data-[state=active]:bg-brand data-[state=active]:text-white rounded-lg transition-all">{v.label || `V${idx + 1}`}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-2xl border-none bg-card overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-brand/5 border-b py-4"><CardTitle className="flex items-center gap-2 text-brand uppercase font-black text-xs"><Zap className="h-4 w-4" /> Moteur</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-end border-b border-dashed pb-1"><span className="font-bold text-muted-foreground text-[9px] uppercase">Cylindrée</span><span className="font-black text-right text-xs">{displayData.engine.displacement}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-1"><span className="font-bold text-muted-foreground text-[9px] uppercase">Couple</span><span className="font-black text-right text-xs text-brand">{displayData.engine.torque}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-1"><span className="font-bold text-muted-foreground text-[9px] uppercase">Injection</span><span className="font-black text-right text-xs">{displayData.engine.alimentation}</span></li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-2xl border-none bg-card overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-blue-500/5 border-b py-4"><CardTitle className="flex items-center gap-2 text-blue-600 uppercase font-black text-xs"><RefreshCw className="h-4 w-4" /> Transmission</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-end border-b border-dashed pb-1"><span className="font-bold text-muted-foreground text-[9px] uppercase">Boîte</span><span className="font-black text-right text-xs">{displayData.transmission.gearbox}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-1"><span className="font-bold text-muted-foreground text-[9px] uppercase">Finale</span><span className="font-black text-right text-xs">{displayData.transmission.finalDrive}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-1"><span className="font-bold text-muted-foreground text-[9px] uppercase">Embrayage</span><span className="font-black text-right text-xs">{displayData.transmission.clutch}</span></li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-2xl border-none bg-card overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-purple-500/5 border-b py-4"><CardTitle className="flex items-center gap-2 text-purple-600 uppercase font-black text-xs"><Cpu className="h-4 w-4" /> Électronique</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-2">
                    {displayData.electronics.map((e: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] font-black text-foreground"><CheckCircle2 className="h-3 w-3 text-purple-500" /> {e}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* ENTRETIEN SECTION */}
            <div className="pt-16 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">Entretien & Prix</h2>
                    <div className="w-20 h-2 bg-brand mx-auto rounded-full" />
                    {displayData.introduction && <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">{displayData.introduction}</p>}
                </div>
                
                {displayData.serviceSchedule.length > 0 && (
                    <Card className="border-none shadow-2xl bg-card overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="bg-brand text-white p-8"><CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-widest"><Wrench className="h-8 w-8" /> Calendrier des révisions</CardTitle></CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-black uppercase text-[10px] py-6 px-8 tracking-widest">Kilométrage</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Type de Service</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] text-right pr-8 tracking-widest">Budget Estimé</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {displayData.serviceSchedule.map((s: any, i: number) => (
                                        <TableRow key={i} className="hover:bg-brand/5 border-b last:border-0 transition-colors">
                                            <TableCell className="font-black text-xl py-8 px-8">{getRobustValue(s, ['km', 'intervalle', 'kilometrage'])} <span className="text-[10px] text-muted-foreground ml-1 font-bold uppercase">km</span></TableCell>
                                            <TableCell className="font-bold text-lg">{getRobustValue(s, ['service_label', 'label', 'description', 'entretien'])}</TableCell>
                                            <TableCell className="font-black text-xl text-brand text-right pr-8">{getRobustValue(s, ['price_estimate', 'price', 'budget', 'prix'])}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* CONSOMMABLES AVEC DÉTECTION ROBUSTE DES CLÉS */}
                {displayData.consumables.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3 pl-2"><Droplets className="h-6 w-6 text-blue-500" /> Consommables & Fluides</h3>
                        <Card className="border-none shadow-2xl bg-card rounded-[2rem] overflow-hidden">
                            <CardContent className="p-0">
                                <Table>
                                    <TableBody>
                                        {displayData.consumables.map((c: any, i: number) => {
                                            // On cherche le nom de l'item (ex: Huile moteur)
                                            const label = getRobustValue(c, ['label', 'name', 'type', 'item', 'nom', 'titre']);
                                            // On cherche la valeur/quantité (ex: 10W40 - 2.8L)
                                            const value = getRobustValue(c, ['value', 'quantity', 'qty', 'spec', 'valeur', 'quantite', 'capacite']);
                                            
                                            return (
                                                <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                                                    <TableCell className="py-5 px-8 font-black uppercase text-[10px] text-muted-foreground w-1/2">{label}</TableCell>
                                                    <TableCell className="py-5 px-8 font-black text-foreground text-sm text-right">{value}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-2xl bg-orange-50/20 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-orange-50 py-6 border-b border-orange-100"><CardTitle className="text-orange-700 uppercase font-black text-lg flex items-center gap-3"><AlertTriangle className="h-6 w-6" /> Points de vigilance</CardTitle></CardHeader>
                        <CardContent className="p-8">
                            {displayData.knownIssues.length > 0 ? (
                                <ul className="space-y-5">{displayData.knownIssues.map((issue: string, idx: number) => (<li key={idx} className="flex items-start gap-3 text-sm font-bold text-orange-900/80"><div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0" />{issue}</li>))}</ul>
                            ) : (<p className="text-sm italic text-muted-foreground font-medium">Aucun point de vigilance répertorié.</p>)}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl bg-green-50/20 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-green-50 py-6 border-b border-green-100"><CardTitle className="text-green-700 uppercase font-black text-lg flex items-center gap-3"><ShieldCheck className="h-6 w-6" /> Conseils de longévité</CardTitle></CardHeader>
                        <CardContent className="p-8">
                            {displayData.longevityTips.length > 0 ? (
                                <ul className="space-y-5">{displayData.longevityTips.map((tip: string, idx: number) => (<li key={idx} className="flex items-start gap-3 text-sm font-bold text-green-900/80"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{tip}</li>))}</ul>
                            ) : (<p className="text-sm italic text-muted-foreground font-medium">Suivez les préconisations constructeurs.</p>)}
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ AVEC DÉTECTION ROBUSTE DES CLÉS */}
                {displayData.faq.length > 0 && (
                    <div className="space-y-8 pt-8">
                        <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 pl-2"><HelpCircle className="h-8 w-8 text-brand" /> Questions Fréquentes</h3>
                        <div className="space-y-4">
                            {displayData.faq.map((item: any, idx: number) => {
                                const question = getRobustValue(item, ['question', 'q', 'titre', 'query']);
                                const answer = getRobustValue(item, ['answer', 'a', 'reponse', 'content', 'response']);
                                
                                return (
                                    <Card key={idx} className="border-none shadow-xl rounded-[2rem] bg-card overflow-hidden">
                                        <CardHeader className="p-8 bg-muted/20 border-b"><CardTitle className="text-lg font-black uppercase leading-tight">{question}</CardTitle></CardHeader>
                                        <CardContent className="p-8"><p className="text-base font-bold text-muted-foreground leading-relaxed">{answer}</p></CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {displayData.conclusion && (
                    <div className="bg-muted/30 p-12 rounded-[2.5rem] border-2 border-dashed text-center relative overflow-hidden shadow-inner mt-16">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none"><LabelMotoLogo noBubble /></div>
                        <p className="text-xl font-bold italic text-muted-foreground leading-relaxed">"{displayData.conclusion}"</p>
                        <div className="mt-8 flex items-center justify-center gap-4"><div className="h-px w-16 bg-muted-foreground/20" /><p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Expertise Label Moto</p><div className="h-px w-16 bg-muted-foreground/20" /></div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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
  Settings2, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Home, 
  ChevronRight, 
  Bike, 
  Scale,
  Info,
  ShieldCheck,
  Zap,
  Cpu,
  RefreshCw,
  Trophy,
  ThumbsDown,
  LayoutGrid,
  FileText
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

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

  useEffect(() => { setSelectedVariantIndex(0); }, [modelId]);

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
      introduction: sg.intro || "",
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
        clutch: activeVariant.clutch || ts.clutch || "Multidisque en bain d'huile"
      },
      electronics: activeVariant.electronics || ts.electronics || ["ABS de série"],
      dimensions: {
        seatHeight: (activeVariant.seat_height_mm || ts.seat_height_mm) ? `${activeVariant.seat_height_mm || ts.seat_height_mm} mm` : "N/A",
        wetWeight: (activeVariant.weight_tpf_kg || ts.weight_tpf_kg) ? `${activeVariant.weight_tpf_kg || ts.weight_tpf_kg} kg` : "N/A",
        fuelCapacity: (activeVariant.tank_l || ts.tank_l) ? `${activeVariant.tank_l || ts.tank_l} L` : "N/A",
        wheelbase: (activeVariant.wheelbase_mm || ts.wheelbase_mm) ? `${activeVariant.wheelbase_mm || ts.wheelbase_mm} mm` : "N/A",
      },
      chassis: {
        frame: cp.frame || "N/A",
        frontSuspension: cp.front_suspension || "N/A",
        rearSuspension: cp.rear_suspension || "N/A",
        frontBrake: cp.front_brake || "N/A",
        rearBrake: cp.rear_brake || "N/A",
        frontTire: cp.front_tire || "N/A",
        rearTire: cp.rear_tire || "N/A"
      },
      verdict: {
        pros: sg.pros || fiche.pros || [],
        cons: sg.cons || fiche.cons || []
      },
      serviceSchedule: sg.service_schedule || [],
      consumables: sg.consumables || [],
      faq: sg.faq || [],
      knownIssues: sg.known_issues || [],
      longevityTips: sg.longevity_tips || [],
      relations: {
        articles: rel.related_articles || [],
        models: rel.related_models || []
      },
      conclusion: sg.conclusion || "",
    };
  }, [fiche, selectedVariantIndex, modelId]);

  if (isLoading) return (
    <div className="min-h-screen bg-background">
        <Header searchTerm="" onSearchTermChange={() => {}} onSearch={() => {}} />
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-64 rounded-3xl" />
                    <Skeleton className="h-64 rounded-3xl" />
                </div>
            </div>
        </main>
    </div>
  );

  if (!fiche || !displayData) return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4">
        <h1 className="text-4xl font-black mb-4 uppercase">Fiche non trouvée</h1>
        <Button asChild className="bg-brand hover:bg-brand/90 font-black uppercase rounded-full px-8">
            <Link href="/entretien">Retour au catalogue</Link>
        </Button>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-background">
      <Header 
        searchTerm={searchTerm} 
        onSearchTermChange={setSearchTerm} 
        onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} 
        activeFilter={null} 
        placeholderText="Recherche..." 
      />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8 pt-8">
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
            {/* --- HERO FICHE TECHNIQUE --- */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-black">
                <div className="absolute inset-0 z-0">
                    <Image src={displayData.imageUrl} alt={displayData.modelName} fill className="object-cover opacity-60" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                
                <div className="relative z-10 p-6 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div className="text-white">
                            <span className="inline-block bg-brand text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3">{displayData.category} - Officiel</span>
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-2">{displayData.modelName}</h1>
                            <p className="text-lg sm:text-2xl font-black text-brand italic">Millésime {displayData.year}</p>
                        </div>
                        <div className="w-48 sm:w-64 drop-shadow-2xl brightness-0 invert opacity-80"><LabelMotoLogo /></div>
                    </div>

                    {/* Bloc Caractéristiques Clés */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Gauge className="h-3.5 w-3.5" /> Puissance</div>
                            <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.engine.power}</p>
                        </div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6">
                            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Scale className="h-3.5 w-3.5" /> Poids (TPF)</div>
                            <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.dimensions.wetWeight}</p>
                        </div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6">
                            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Bike className="h-3.5 w-3.5" /> Hauteur Selle</div>
                            <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.dimensions.seatHeight}</p>
                        </div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6">
                            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><CheckCircle2 className="h-3.5 w-3.5" /> Permis</div>
                            <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.engine.bridage}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SÉLECTEUR DE VARIANTE --- */}
            {displayData.hasVariants && (
              <div className="flex flex-col items-center gap-4 bg-muted/30 p-6 rounded-[2rem] border shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Sélectionnez la version :</p>
                <Tabs value={String(selectedVariantIndex)} onValueChange={(v) => setSelectedVariantIndex(Number(v))} className="w-full max-w-md">
                  <TabsList className="grid w-full h-14 bg-background border-2 shadow-xl p-1 rounded-xl" style={{ gridTemplateColumns: `repeat(${displayData.variants.length}, 1fr)` }}>
                    {displayData.variants.map((v: any, idx: number) => (
                      <TabsTrigger key={idx} value={String(idx)} className="font-black uppercase text-[10px] data-[state=active]:bg-brand data-[state=active]:text-white rounded-lg transition-all">
                        {v.label || `V${idx + 1}`}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* --- VERDICT RAPIDE --- */}
            {(displayData.verdict.pros.length > 0 || displayData.verdict.cons.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-xl bg-green-50/20 rounded-[2rem] overflow-hidden">
                  <CardHeader className="bg-green-50 py-4 border-b border-green-100">
                    <CardTitle className="text-green-700 uppercase font-black text-sm flex items-center gap-2"><Trophy className="h-4 w-4" /> Points Forts</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {displayData.verdict.pros.map((p: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-bold text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-xl bg-red-50/20 rounded-[2rem] overflow-hidden">
                  <CardHeader className="bg-red-50 py-4 border-b border-red-100">
                    <CardTitle className="text-red-700 uppercase font-black text-sm flex items-center gap-2"><ThumbsDown className="h-4 w-4" /> Points Faibles</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {displayData.verdict.cons.map((p: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-bold text-foreground">
                          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* --- DÉTAILS TECHNIQUES GRILLE --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-2xl border-none bg-card overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-brand/5 border-b py-4"><CardTitle className="flex items-center gap-2 text-brand uppercase font-black text-xs"><Zap className="h-4 w-4" /> Moteur</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-end border-b border-dashed pb-1"><span className="font-bold text-muted-foreground text-[9px] uppercase">Type</span><span className="font-black text-right text-xs">{displayData.engine.type}</span></li>
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
                      <li key={i} className="flex items-center gap-2 text-[10px] font-black text-foreground">
                        <CheckCircle2 className="h-3 w-3 text-purple-500" /> {e}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* --- PARTIE CYCLE ACCORDION --- */}
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cycle" className="border-none">
                    <AccordionTrigger className="bg-muted/30 p-8 rounded-[2.5rem] font-black uppercase text-brand hover:no-underline shadow-sm transition-all hover:bg-brand/5">
                        <div className="flex items-center gap-4"><Settings2 className="h-6 w-6" /><span>Partie Cycle, Freins & Pneus</span></div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 px-4">
                        <div className="overflow-hidden rounded-[2rem] border-2 bg-card shadow-xl">
                            <Table>
                                <TableBody>
                                    <TableRow className="hover:bg-muted/50 border-b border-dashed"><TableCell className="font-black text-[9px] uppercase text-muted-foreground w-1/3 pl-8">Cadre</TableCell><TableCell className="font-bold py-4 pr-8">{displayData.chassis.frame}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50 border-b border-dashed"><TableCell className="font-black text-[9px] uppercase text-muted-foreground pl-8">Suspension AV</TableCell><TableCell className="font-bold py-4 pr-8">{displayData.chassis.frontSuspension}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50 border-b border-dashed"><TableCell className="font-black text-[9px] uppercase text-muted-foreground pl-8">Suspension AR</TableCell><TableCell className="font-bold py-4 pr-8">{displayData.chassis.rearSuspension}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50 border-b border-dashed"><TableCell className="font-black text-[9px] uppercase text-muted-foreground pl-8">Frein Avant</TableCell><TableCell className="font-bold py-4 pr-8">{displayData.chassis.frontBrake}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50 border-b border-dashed"><TableCell className="font-black text-[9px] uppercase text-muted-foreground pl-8">Frein Arrière</TableCell><TableCell className="font-bold py-4 pr-8">{displayData.chassis.rearBrake}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50 border-b border-dashed"><TableCell className="font-black text-[9px] uppercase text-muted-foreground pl-8">Pneu Avant</TableCell><TableCell className="font-black py-4 pr-8 text-brand">{displayData.chassis.frontTire}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50"><TableCell className="font-black text-[9px] uppercase text-muted-foreground pl-8">Pneu Arrière</TableCell><TableCell className="font-black py-4 pr-8 text-brand">{displayData.chassis.rearTire}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* --- GUIDE ENTRETIEN --- */}
            <div className="pt-16 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">Guide Entretien & Prix</h2>
                    <div className="w-20 h-2 bg-brand mx-auto rounded-full" />
                    {displayData.introduction && <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">{displayData.introduction}</p>}
                </div>
                
                {displayData.serviceSchedule.length > 0 && (
                    <Card className="border-none shadow-2xl bg-card overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="bg-brand text-white p-8"><CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-widest"><Wrench className="h-8 w-8" /> Calendrier des révisions</CardTitle></CardHeader>
                        <CardContent className="p-0">
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
                                            <TableCell className="font-black text-xl py-8 px-8">{s.km?.toLocaleString()} <span className="text-[10px] text-muted-foreground ml-1 font-bold uppercase">km</span></TableCell>
                                            <TableCell className="font-bold text-lg">{s.service_label}</TableCell>
                                            <TableCell className="font-black text-xl text-brand text-right pr-8">{s.price_estimate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* CONSOMMABLES */}
                {displayData.consumables.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3 pl-2"><Droplets className="h-6 w-6 text-blue-500" /> Consommables & Fluides</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayData.consumables.map((c: any, i: number) => (
                                <Card key={i} className="border-2 border-muted bg-card shadow-lg hover:border-blue-200 transition-all rounded-full group">
                                    <CardContent className="p-6 py-4 flex justify-between items-center">
                                        <span className="font-black uppercase text-[9px] text-muted-foreground group-hover:text-blue-500 transition-colors">{c.label}</span>
                                        <span className="font-black text-foreground">{c.value}</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* VIGILANCE ET CONSEILS */}
                {(displayData.knownIssues.length > 0 || displayData.longevityTips.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {displayData.knownIssues.length > 0 && (
                            <Card className="border-none shadow-2xl bg-orange-50/30 rounded-[2.5rem] overflow-hidden border-t-4 border-orange-400">
                                <CardHeader className="bg-orange-100/50 py-6 border-b border-orange-200/50">
                                    <CardTitle className="text-orange-700 uppercase font-black text-lg flex items-center gap-3"><AlertTriangle className="h-6 w-6" /> Points de vigilance</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <ul className="space-y-4">
                                        {displayData.knownIssues.map((issue: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm font-bold text-orange-900/80">
                                                <div className="text-orange-400 mt-0.5 shrink-0 font-black">•</div>
                                                {issue}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                        {displayData.longevityTips.length > 0 && (
                            <Card className="border-none shadow-2xl bg-green-50/30 rounded-[2.5rem] overflow-hidden border-t-4 border-green-400">
                                <CardHeader className="bg-green-100/50 py-6 border-b border-green-200/50">
                                    <CardTitle className="text-green-700 uppercase font-black text-lg flex items-center gap-3"><ShieldCheck className="h-6 w-6" /> Conseils de longévité</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <ul className="space-y-4">
                                        {displayData.longevityTips.map((tip: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm font-bold text-green-900/80">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* RECOMMANDATIONS ET RELATIONS */}
                {(displayData.relations.articles.length > 0 || displayData.relations.models.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    {displayData.relations.articles.length > 0 && (
                      <Card className="border-none shadow-xl bg-muted/20 rounded-[2rem]">
                        <CardHeader className="py-6 border-b"><CardTitle className="flex items-center gap-2 text-brand uppercase font-black text-sm"><FileText className="h-4 w-4" /> Articles liés</CardTitle></CardHeader>
                        <CardContent className="p-6">
                          <ul className="space-y-3">
                            {displayData.relations.articles.map((artId: string, idx: number) => (
                              <li key={idx}>
                                <Link href={`/info/${artId}`} className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-brand/5 border transition-all group">
                                  <span className="text-sm font-bold group-hover:text-brand truncate">{artId.replace(/-/g, ' ').toUpperCase()}</span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    {displayData.relations.models.length > 0 && (
                      <Card className="border-none shadow-xl bg-muted/20 rounded-[2rem]">
                        <CardHeader className="py-6 border-b"><CardTitle className="flex items-center gap-2 text-brand uppercase font-black text-sm"><LayoutGrid className="h-4 w-4" /> Modèles similaires</CardTitle></CardHeader>
                        <CardContent className="p-6">
                          <ul className="space-y-3">
                            {displayData.relations.models.map((modId: string, idx: number) => (
                              <li key={idx}>
                                <Link href={`/fiches/${modId}`} className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-brand/5 border transition-all group">
                                  <span className="text-sm font-bold group-hover:text-brand truncate">{modId.replace(/-/g, ' ').toUpperCase()}</span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* FAQ */}
                {displayData.faq.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3 pl-2"><HelpCircle className="h-6 w-6 text-brand" /> Questions Fréquentes</h3>
                        <div className="space-y-4">
                            {displayData.faq.map((item: any, idx: number) => (
                                <Card key={idx} className="border-none shadow-xl rounded-2xl bg-card overflow-hidden">
                                    <CardHeader className="p-6 bg-muted/20">
                                        <CardTitle className="text-sm font-black uppercase leading-tight">{item.q}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{item.a}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {displayData.conclusion && (
                    <div className="bg-muted/30 p-12 rounded-[2.5rem] border-2 border-dashed text-center relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                            <LabelMotoLogo />
                        </div>
                        <p className="text-xl font-bold italic text-muted-foreground leading-relaxed">"{displayData.conclusion}"</p>
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <div className="h-px w-16 bg-muted-foreground/20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Expertise Label Moto</p>
                            <div className="h-px w-16 bg-muted-foreground/20" />
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

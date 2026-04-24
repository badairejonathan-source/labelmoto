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
  ClipboardList,
  CircleDot
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
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

// Utilitaire d'extraction de données ultra-robuste pour éviter les "N/A"
const getRobustValue = (obj: any, preferredKeys: string[], defaultValue: string = "—") => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  // 1. Chercher dans les clés préférées
  for (const key of preferredKeys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return String(obj[key]);
    }
  }

  // 2. Chercher des correspondances floues (synonymes)
  const allKeys = Object.keys(obj);
  const commonSynonyms: Record<string, string[]> = {
    'operations': ['content', 'description', 'details', 'desc', 'label', 'op'],
    'price': ['prix', 'budget', 'coût', 'cout', 'valeur'],
    'km': ['intervalle', 'interval', 'distance', 'periodicité', 'periodicite'],
    'spec': ['value', 'details', 'reference', 'ref', 'type'],
  };

  for (const prefKey of preferredKeys) {
    const synonyms = commonSynonyms[prefKey] || [];
    for (const syn of synonyms) {
      if (obj[syn] !== undefined && obj[syn] !== null && obj[syn] !== "") {
        return String(obj[syn]);
      }
    }
  }

  // 3. Retourner la première valeur textuelle si rien n'est trouvé
  const firstString = Object.values(obj).find(v => typeof v === 'string' && v.length > 0);
  if (firstString) return String(firstString);

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
      year: fiche.year_range || "2020+",
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
        alimentation: activeVariant.fuel_system || ts.fuel_system || "Injection électronique"
      },
      transmission: {
        gearbox: activeVariant.gearbox || ts.gearbox || "6 rapports",
        finalDrive: activeVariant.final_drive || ts.final_drive || "Chaîne",
        clutch: activeVariant.clutch || ts.clutch || "Multidisque"
      },
      cycleParts: {
        frame: getRobustValue(cp, ['frame', 'cadre', 'chassis']),
        frontBrake: getRobustValue(cp, ['front_brake', 'frein_avant']),
        rearBrake: getRobustValue(cp, ['rear_brake', 'frein_arriere']),
        frontSuspension: getRobustValue(cp, ['front_suspension', 'suspension_avant', 'fourche']),
        rearSuspension: getRobustValue(cp, ['rear_suspension', 'suspension_arriere', 'amortisseur']),
        frontTire: getRobustValue(cp, ['front_tire', 'pneu_avant']),
        rearTire: getRobustValue(cp, ['rear_tire', 'pneu_arriere']),
      },
      dimensions: {
        wetWeight: (activeVariant.weight_tpf_kg || ts.weight_tpf_kg) ? `${activeVariant.weight_tpf_kg || ts.weight_tpf_kg} kg` : "N/A",
        seatHeight: (activeVariant.seat_height_mm || ts.seat_height_mm) ? `${activeVariant.seat_height_mm || ts.seat_height_mm} mm` : "N/A",
        tank: (activeVariant.tank_l || ts.tank_l) ? `${activeVariant.tank_l || ts.tank_l} L` : "N/A",
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-[400px] w-full rounded-[2rem]" />
                    <Skeleton className="h-[400px] w-full rounded-[2rem]" />
                </div>
            </div>
        </main>
    </div>
  );

  if (!fiche || !displayData) return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4">
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Fiche non trouvée</h1>
        <Button asChild className="bg-brand rounded-full px-8 font-black uppercase tracking-widest text-xs h-12 shadow-xl"><Link href="/entretien">Retour au catalogue</Link></Button>
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
              <Button asChild variant="outline" className="border-brand text-brand rounded-full hover:bg-brand/10 h-10 px-6 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <Link href={returnUrl} className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> {returnLabel}</Link>
              </Button>
            )}
          </div>

          <div className="space-y-12">
            {/* HERO SECTION - DESIGN EMBLÉMATIQUE LABEL MOTO */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-black min-h-[480px] flex flex-col justify-end">
                <div className="absolute inset-0 z-0">
                    <Image 
                      src={displayData.imageUrl} 
                      alt={displayData.modelName} 
                      fill 
                      className="object-cover opacity-60" 
                      priority 
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>
                
                <div className="relative z-10 p-6 md:p-12 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div className="text-white">
                            <span className="inline-block bg-brand text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3 shadow-lg">{displayData.category} - Officiel</span>
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-2 drop-shadow-2xl">{displayData.modelName}</h1>
                            <p className="text-lg sm:text-2xl font-black text-brand italic drop-shadow-md">Millésime {displayData.year}</p>
                        </div>
                        <div className="w-48 sm:w-64 drop-shadow-2xl brightness-0 invert opacity-80 hidden sm:block"><LabelMotoLogo noBubble /></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Gauge className="h-3.5 w-3.5" /> Puissance</div>
                          <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.engine.power}</p>
                        </div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6">
                          <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Scale className="h-3.5 w-3.5" /> Poids</div>
                          <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.dimensions.wetWeight}</p>
                        </div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6">
                          <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Bike className="h-3.5 w-3.5" /> Selle</div>
                          <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.dimensions.seatHeight}</p>
                        </div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6">
                          <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><ShieldCheck className="h-3.5 w-3.5" /> Permis</div>
                          <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.engine.bridage}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-12">
                    {displayData.introduction && (
                        <section className="bg-card p-8 rounded-[2rem] border-2 border-muted shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none"><Image src="/images/logo-moto.webp" alt="" width={120} height={40} /></div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-foreground flex items-center gap-3"><FileText className="h-6 w-6 text-brand" /> Présentation</h2>
                            <p className="text-lg leading-relaxed text-foreground font-medium italic border-l-4 border-brand/20 pl-6">{displayData.introduction}</p>
                        </section>
                    )}

                    {/* SELECTEUR DE VARIANTE */}
                    {displayData.hasVariants && (
                        <div className="bg-brand/5 p-8 rounded-[2rem] border-2 border-brand/20 shadow-inner">
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-6 text-center">Plusieurs versions disponibles :</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {displayData.variants.map((v: any, i: number) => (
                                    <Button 
                                      key={i} 
                                      onClick={() => setSelectedVariantIndex(i)} 
                                      variant={selectedVariantIndex === i ? 'default' : 'outline'} 
                                      className={cn(
                                        "rounded-full font-black uppercase text-[10px] h-12 px-8 shadow-sm transition-all", 
                                        selectedVariantIndex === i ? "bg-brand text-white scale-105" : "border-brand/30 text-brand hover:bg-brand/10"
                                      )}
                                    >
                                      {v.label || `Variante ${i+1}`}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES */}
                    <div id="tech" className="scroll-mt-28 space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-brand/20 pb-3 flex items-center gap-4 text-foreground"><Cpu className="h-8 w-8 text-brand" /> Spécifications Techniques</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-card transition-all hover:shadow-brand/5">
                                <CardHeader className="bg-muted/30 py-5 border-b"><CardTitle className="text-lg font-black uppercase flex items-center gap-3"><Zap className="h-6 w-6 text-brand" /> Moteur & Transmission</CardTitle></CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableBody>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground w-1/3 py-4 pl-6">Type</TableCell><TableCell className="font-bold text-sm py-4">{displayData.engine.type}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Cylindrée</TableCell><TableCell className="font-bold text-sm py-4">{displayData.engine.displacement}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Alimentation</TableCell><TableCell className="font-bold text-sm py-4">{displayData.engine.alimentation}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Boîte</TableCell><TableCell className="font-bold text-sm py-4">{displayData.transmission.gearbox}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Finale</TableCell><TableCell className="font-bold text-sm py-4">{displayData.transmission.finalDrive}</TableCell></TableRow>
                                            <TableRow className="border-0"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Embrayage</TableCell><TableCell className="font-bold text-sm py-4">{displayData.transmission.clutch}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-card transition-all hover:shadow-brand/5">
                                <CardHeader className="bg-muted/30 py-5 border-b"><CardTitle className="text-lg font-black uppercase flex items-center gap-3"><LayoutGrid className="h-6 w-6 text-brand" /> Partie-Cycle & Freinage</CardTitle></CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableBody>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground w-1/3 py-4 pl-6">Cadre</TableCell><TableCell className="font-bold text-sm py-4">{displayData.cycleParts.frame}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Fourche</TableCell><TableCell className="font-bold text-sm py-4">{displayData.cycleParts.frontSuspension}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Amortisseur</TableCell><TableCell className="font-bold text-sm py-4">{displayData.cycleParts.rearSuspension}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Frein AV</TableCell><TableCell className="font-bold text-sm py-4">{displayData.cycleParts.frontBrake}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Pneu AV</TableCell><TableCell className="font-bold text-sm py-4">{displayData.cycleParts.frontTire}</TableCell></TableRow>
                                            <TableRow className="border-0"><TableCell className="font-black text-[10px] uppercase text-muted-foreground py-4 pl-6">Pneu AR</TableCell><TableCell className="font-bold text-sm py-4">{displayData.cycleParts.rearTire}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* GUIDE D'ENTRETIEN OFFICIEL */}
                    <div id="service" className="scroll-mt-28 space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-brand/20 pb-3 flex items-center gap-4 text-foreground"><Wrench className="h-8 w-8 text-brand" /> Guide d'Entretien Officiel</h2>
                        
                        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
                            <CardHeader className="bg-brand text-white py-8 px-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4"><ClipboardList className="h-7 w-7" /> Plan de Maintenance</CardTitle>
                                    <div className="hidden sm:block text-[11px] font-black uppercase tracking-widest opacity-90 italic">Données Constructeur</div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="font-black uppercase text-[11px] tracking-widest py-6 pl-10">Intervalle</TableHead>
                                            <TableHead className="font-black uppercase text-[11px] tracking-widest py-6">Opérations principales</TableHead>
                                            <TableHead className="font-black uppercase text-[11px] tracking-widest py-6 text-right pr-10">Budget Moyen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {displayData.serviceSchedule.length > 0 ? displayData.serviceSchedule.map((s: any, i: number) => (
                                            <TableRow key={i} className="hover:bg-brand/5 border-muted/50 transition-colors">
                                                <TableCell className="font-black text-brand text-base py-8 pl-10">
                                                  {getRobustValue(s, ['km', 'intervalle', 'label', 'title'])}
                                                </TableCell>
                                                <TableCell className="font-medium text-sm py-8 leading-relaxed max-w-md">
                                                  {getRobustValue(s, ['operations', 'content', 'description', 'desc'])}
                                                </TableCell>
                                                <TableCell className="text-right pr-10 py-8">
                                                  <div className="inline-block bg-brand/10 text-brand px-5 py-2 rounded-full font-black text-sm shadow-sm border border-brand/5">
                                                    {getRobustValue(s, ['price', 'prix', 'budget', 'valeur'])}
                                                  </div>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground font-black uppercase tracking-widest text-xs italic opacity-50">Données en cours d'actualisation...</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-8">
                                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 pl-2 text-foreground"><Droplets className="h-6 w-6 text-brand" /> Consommables</h3>
                                <div className="space-y-4">
                                    {displayData.consumables.map((c: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-muted/20 rounded-[1.5rem] border-2 border-transparent hover:border-brand/30 hover:bg-white transition-all group shadow-sm">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">{getRobustValue(c, ['part', 'category', 'type'])}</span>
                                                <span className="text-base font-black text-foreground group-hover:text-brand transition-colors">{getRobustValue(c, ['label', 'reference', 'name'])}</span>
                                            </div>
                                            <div className="bg-white px-4 py-2 rounded-full text-[11px] font-black text-brand shadow-sm border border-brand/10 group-hover:scale-105 transition-transform">{getRobustValue(c, ['spec', 'value', 'details'])}</div>
                                        </div>
                                    ))}
                                    {displayData.consumables.length === 0 && <p className="italic text-muted-foreground text-sm pl-6 border-l-2 border-dashed border-muted">Liste détaillée des pièces à venir.</p>}
                                </div>
                             </div>

                             <div className="space-y-8">
                                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 pl-2 text-foreground"><AlertTriangle className="h-6 w-6 text-orange-500" /> Points de Vigilance</h3>
                                <div className="bg-orange-50/40 border-2 border-orange-100 p-8 rounded-[2.5rem] space-y-8 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><AlertTriangle className="h-20 w-20 text-orange-500" /></div>
                                    <div className="space-y-4 relative z-10">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">⚠️ Défauts connus :</p>
                                        <ul className="space-y-3">
                                            {displayData.knownIssues.map((issue: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4 text-sm font-bold text-foreground/80 leading-relaxed">
                                                    <CircleDot className="h-2 w-2 text-orange-400 mt-2 shrink-0" />
                                                    {issue}
                                                </li>
                                            ))}
                                            {displayData.knownIssues.length === 0 && <li className="italic text-muted-foreground text-sm font-medium">Aucun défaut majeur répertorié.</li>}
                                        </ul>
                                    </div>
                                    <div className="pt-6 border-t border-orange-200/50 space-y-4 relative z-10">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">✅ Conseils de longévité :</p>
                                        <ul className="space-y-3">
                                            {displayData.longevityTips.map((tip: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4 text-sm font-bold text-foreground/80 leading-relaxed">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* FAQ MODÈLE */}
                    {displayData.faq.length > 0 && (
                        <div id="faq" className="scroll-mt-28 space-y-8 pt-8">
                             <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-brand/20 pb-3 flex items-center gap-4 text-foreground"><HelpCircle className="h-8 w-8 text-brand" /> Questions Fréquentes</h2>
                             <div className="space-y-6">
                                {displayData.faq.map((item: any, i: number) => (
                                    <Card key={i} className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-card transition-all hover:scale-[1.01]">
                                        <CardHeader className="bg-muted/20 p-8 border-b">
                                            <CardTitle className="text-lg font-black uppercase leading-tight text-foreground">{getRobustValue(item, ['question', 'q', 'titre', 'query'])}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <p className="text-base font-bold text-muted-foreground leading-relaxed italic border-l-4 border-brand/30 pl-8">{getRobustValue(item, ['answer', 'reponse', 'content', 'response'])}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* CONCLUSION EXPERTE */}
                    {displayData.conclusion && (
                        <div className="mt-20 pt-10 border-t-4 border-dashed border-muted relative">
                            <div className="flex items-center gap-4 mb-8"><ShieldCheck className="h-10 w-10 text-brand" /><h3 className="text-3xl font-black uppercase m-0 text-foreground tracking-tighter">L'avis de l'expert</h3></div>
                            <p className="text-xl text-foreground font-black leading-relaxed italic pr-12">{displayData.conclusion}</p>
                            <div className="flex justify-end items-center mt-12">
                                <div className="text-right">
                                  <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">Rédigé par</p>
                                  <p className="text-xl font-black text-foreground italic">L'équipe Label Moto</p>
                                </div>
                                <Image src="/images/Stamp-LM.webp" alt="Signature" width={140} height={140} className="object-contain opacity-50 -rotate-[15deg] pointer-events-none -ml-8 -mb-4" />
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDEBAR NAVIGATION & CTA */}
                <aside className="lg:col-span-4 relative">
                    <div className="lg:sticky lg:top-28 space-y-8">
                        <Card className="border-4 border-white shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
                            <CardHeader className="bg-brand text-white p-7 border-b-4 border-white/20"><CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4"><LayoutGrid className="h-6 w-6" /> Navigation Rapide</CardTitle></CardHeader>
                            <CardContent className="p-8">
                                <nav className="space-y-5">
                                    <a href="#tech" className="flex items-center gap-5 text-sm font-black text-foreground hover:text-brand transition-all group/nav">
                                        <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center group-hover/nav:bg-brand group-hover/nav:text-white transition-all shadow-md"><Cpu className="h-5 w-5" /></div>
                                        Fiche Technique
                                    </a>
                                    <a href="#service" className="flex items-center gap-5 text-sm font-black text-foreground hover:text-brand transition-all group/nav">
                                        <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center group-hover/nav:bg-brand group-hover/nav:text-white transition-all shadow-md"><Wrench className="h-5 w-5" /></div>
                                        Plan d'Entretien
                                    </a>
                                    {displayData.faq.length > 0 && (
                                        <a href="#faq" className="flex items-center gap-5 text-sm font-black text-foreground hover:text-brand transition-all group/nav">
                                            <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center group-hover/nav:bg-brand group-hover/nav:text-white transition-all shadow-md"><HelpCircle className="h-5 w-5" /></div>
                                            FAQ Modèle
                                        </a>
                                    )}
                                </nav>
                            </CardContent>
                        </Card>

                        {displayData.relations.articles.length > 0 && (
                             <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-muted/30">
                                <CardHeader className="p-8 pb-4"><CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><FileText className="h-4 w-4" /> Articles Liés</CardTitle></CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    {displayData.relations.articles.map((artId: string, i: number) => (
                                        <Link key={i} href={`/info/${artId}`} className="block p-5 bg-white rounded-2xl border-2 border-transparent hover:border-brand hover:shadow-xl transition-all group shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-black uppercase group-hover:text-brand transition-colors truncate pr-6 tracking-tight">{artId.replace(/-/g, ' ')}</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </Link>
                                    ))}
                                </CardContent>
                             </Card>
                        )}

                        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-brand relative group cursor-pointer" onClick={() => router.push('/map')}>
                             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                             <CardContent className="relative z-10 p-12 text-center space-y-8">
                                <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center mx-auto border-4 border-white/30 animate-pulse-subtle shadow-2xl"><RefreshCw className="h-12 w-12 text-white" /></div>
                                <div>
                                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-3">Besoin d'un atelier ?</h4>
                                  <p className="text-white/80 text-xs font-bold leading-relaxed">Trouvez un professionnel qualifié pour votre révision à proximité.</p>
                                </div>
                                <Button className="w-full bg-white text-brand hover:bg-white/95 font-black uppercase tracking-[0.1em] text-[10px] py-7 rounded-full shadow-2xl transform group-hover:scale-105 transition-all">🔘 Voir la carte des ateliers</Button>
                             </CardContent>
                        </Card>
                    </div>
                </aside>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

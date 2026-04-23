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
  for (const key of preferredKeys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return String(obj[key]);
    }
  }
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
      cycleParts: {
        frame: getRobustValue(cp, ['cadre', 'frame', 'chassis']),
        frontBrake: getRobustValue(cp, ['front_brake', 'frein_avant']),
        rearBrake: getRobustValue(cp, ['rear_brake', 'frein_arriere']),
        frontSuspension: getRobustValue(cp, ['front_suspension', 'suspension_avant', 'fourche']),
        rearSuspension: getRobustValue(cp, ['rear_suspension', 'suspension_arriere', 'amortisseur']),
        frontTire: getRobustValue(cp, ['front_tire', 'pneu_avant']),
        rearTire: getRobustValue(cp, ['rear_tire', 'pneu_arriere']),
      },
      electronics: activeVariant.electronics || ts.electronics || ["ABS"],
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
            {/* HERO SECTION */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-black min-h-[450px] flex flex-col justify-end">
                <div className="absolute inset-0 z-0">
                    <Image 
                      src={displayData.imageUrl} 
                      alt={displayData.modelName} 
                      fill 
                      className="object-cover opacity-60" 
                      priority 
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
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
                        <div className="space-y-1"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Gauge className="h-3.5 w-3.5" /> Puissance</div><p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.engine.power}</p></div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Scale className="h-3.5 w-3.5" /> Poids</div><p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.dimensions.wetWeight}</p></div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><Bike className="h-3.5 w-3.5" /> Selle</div><p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.dimensions.seatHeight}</p></div>
                        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[9px]"><CheckCircle2 className="h-3.5 w-3.5" /> Permis</div><p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.engine.bridage}</p></div>
                    </div>
                </div>
            </div>

            {/* SOMMAIRE & INTRO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {displayData.introduction && (
                        <section className="bg-card p-8 rounded-[2rem] border-2 border-muted shadow-sm">
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-foreground flex items-center gap-3"><FileText className="h-6 w-6 text-brand" /> Présentation</h2>
                            <p className="text-lg leading-relaxed text-foreground font-medium italic">{displayData.introduction}</p>
                        </section>
                    )}

                    {/* SELECTEUR DE VARIANTE */}
                    {displayData.hasVariants && (
                        <div className="bg-brand/5 p-6 rounded-[2rem] border-2 border-brand/20 shadow-inner">
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-4 text-center">Plusieurs versions disponibles pour ce modèle :</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {displayData.variants.map((v: any, i: number) => (
                                    <Button key={i} onClick={() => setSelectedVariantIndex(i)} variant={selectedVariantIndex === i ? 'default' : 'outline'} className={cn("rounded-full font-black uppercase text-[9px] h-10 px-6", selectedVariantIndex === i ? "bg-brand" : "border-brand/30 text-brand")}>{v.label || `Variante ${i+1}`}</Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CARACTÉRISTIQUES TECHNIQUES */}
                    <div id="tech" className="scroll-mt-28 space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-brand/20 pb-2 flex items-center gap-4"><Cpu className="h-8 w-8 text-brand" /> Spécifications Techniques</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-card">
                                <CardHeader className="bg-muted/30 py-4"><CardTitle className="text-lg font-black uppercase flex items-center gap-2"><Zap className="h-5 w-5 text-brand" /> Moteur & Transmission</CardTitle></CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableBody>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground w-1/3">Type</TableCell><TableCell className="font-bold text-sm">{displayData.engine.type}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Cylindrée</TableCell><TableCell className="font-bold text-sm">{displayData.engine.displacement}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Alimentation</TableCell><TableCell className="font-bold text-sm">{displayData.engine.alimentation}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Boîte</TableCell><TableCell className="font-bold text-sm">{displayData.transmission.gearbox}</TableCell></TableRow>
                                            <TableRow className="border-0"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Finale</TableCell><TableCell className="font-bold text-sm">{displayData.transmission.finalDrive}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-card">
                                <CardHeader className="bg-muted/30 py-4"><CardTitle className="text-lg font-black uppercase flex items-center gap-2"><LayoutGrid className="h-5 w-5 text-brand" /> Partie-Cycle</CardTitle></CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableBody>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground w-1/3">Cadre</TableCell><TableCell className="font-bold text-sm">{displayData.cycleParts.frame}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Susp. Avant</TableCell><TableCell className="font-bold text-sm">{displayData.cycleParts.frontSuspension}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Frein Avant</TableCell><TableCell className="font-bold text-sm">{displayData.cycleParts.frontBrake}</TableCell></TableRow>
                                            <TableRow className="border-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Pneu Avant</TableCell><TableCell className="font-bold text-sm">{displayData.cycleParts.frontTire}</TableCell></TableRow>
                                            <TableRow className="border-0"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Pneu Arrière</TableCell><TableCell className="font-bold text-sm">{displayData.cycleParts.rearTire}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* GUIDE D'ENTRETIEN */}
                    <div id="service" className="scroll-mt-28 space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-brand/20 pb-2 flex items-center gap-4"><Wrench className="h-8 w-8 text-brand" /> Guide d'Entretien Officiel</h2>
                        
                        {/* TABLEAU DES RÉVISIONS */}
                        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
                            <CardHeader className="bg-brand text-white py-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><ClipboardList className="h-6 w-6" /> Plan de Maintenance</CardTitle>
                                    <div className="hidden sm:block text-[10px] font-black uppercase tracking-tighter opacity-80">Données Constructeur</div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="font-black uppercase text-[10px] py-4 pl-8">Intervalle</TableHead>
                                            <TableHead className="font-black uppercase text-[10px] py-4">Opérations de Contrôle</TableHead>
                                            <TableHead className="font-black uppercase text-[10px] py-4 text-right pr-8">Budget Estimé</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {displayData.serviceSchedule.length > 0 ? displayData.serviceSchedule.map((s: any, i: number) => (
                                            <TableRow key={i} className="hover:bg-muted/20 border-muted/50">
                                                <TableCell className="font-black text-brand py-6 pl-8">{getRobustValue(s, ['km', 'intervalle', 'label', 'title'])}</TableCell>
                                                <TableCell className="font-medium text-sm py-6 leading-relaxed max-w-md">{getRobustValue(s, ['operations', 'content', 'description'])}</TableCell>
                                                <TableCell className="text-right pr-8 py-6">
                                                    <div className="inline-block bg-brand/10 text-brand px-4 py-1.5 rounded-full font-black text-sm">{getRobustValue(s, ['price', 'prix', 'budget'], 'N/A')}</div>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground font-bold italic">Données de périodicité en cours d'actualisation...</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* CONSOMMABLES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-6">
                                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 pl-2"><Droplets className="h-5 w-5 text-brand" /> Consommables</h3>
                                <div className="space-y-3">
                                    {displayData.consumables.map((c: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border-2 border-transparent hover:border-brand/20 transition-all group">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{getRobustValue(c, ['part', 'category', 'type'])}</span>
                                                <span className="text-sm font-black text-foreground">{getRobustValue(c, ['label', 'reference', 'name'])}</span>
                                            </div>
                                            <div className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-brand shadow-sm border border-brand/10">{getRobustValue(c, ['spec', 'value', 'details'])}</div>
                                        </div>
                                    ))}
                                    {displayData.consumables.length === 0 && <p className="italic text-muted-foreground text-sm pl-4">Liste détaillée à venir.</p>}
                                </div>
                             </div>

                             <div className="space-y-6">
                                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 pl-2"><AlertTriangle className="h-5 w-5 text-orange-500" /> Points d'Attention</h3>
                                <div className="bg-orange-50/30 border-2 border-orange-100 p-6 rounded-[2rem] space-y-6 shadow-sm">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Problèmes connus :</p>
                                        <ul className="space-y-2">
                                            {displayData.knownIssues.map((issue: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm font-bold text-foreground/80">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                                    {issue}
                                                </li>
                                            ))}
                                            {displayData.knownIssues.length === 0 && <li className="italic text-muted-foreground text-sm">Aucun défaut majeur signalé.</li>}
                                        </ul>
                                    </div>
                                    <div className="pt-4 border-t border-orange-100 space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Conseils longévité :</p>
                                        <ul className="space-y-2">
                                            {displayData.longevityTips.map((tip: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm font-bold text-foreground/80">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                                                    {tip}
                                                </li>
                                            ))}
                                            {displayData.longevityTips.length === 0 && <li className="italic text-muted-foreground text-sm">Suivez le plan d'entretien régulier.</li>}
                                        </ul>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    {displayData.faq.length > 0 && (
                        <div id="faq" className="scroll-mt-28 space-y-8 pt-8">
                             <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-brand/20 pb-2 flex items-center gap-4"><HelpCircle className="h-8 w-8 text-brand" /> Questions Fréquentes</h2>
                             <div className="space-y-4">
                                {displayData.faq.map((item: any, i: number) => (
                                    <Card key={i} className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-card transition-all hover:shadow-2xl">
                                        <CardHeader className="bg-muted/20 p-6 sm:p-8">
                                            <CardTitle className="text-lg font-black uppercase leading-snug">{getRobustValue(item, ['question', 'q', 'titre'])}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 sm:p-8">
                                            <p className="text-base font-bold text-muted-foreground leading-relaxed italic border-l-4 border-brand/30 pl-6">{getRobustValue(item, ['answer', 'reponse', 'content'])}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* CONCLUSION */}
                    {displayData.conclusion && (
                        <div className="mt-16 pt-8 border-t-4 border-dashed border-muted">
                            <div className="flex items-center gap-3 mb-6"><ShieldCheck className="h-8 w-8 text-brand" /><h3 className="text-2xl font-black uppercase m-0 text-foreground">Le mot de l'expert</h3></div>
                            <p className="text-lg text-foreground font-black leading-relaxed italic">{displayData.conclusion}</p>
                            <div className="flex justify-end items-center mt-12">
                                <p className="text-lg font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p>
                                <Image src="/images/Stamp-LM.webp" alt="Signature" width={110} height={110} className="object-contain opacity-40 -rotate-[15deg] pointer-events-none -ml-10" />
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDEBAR */}
                <aside className="lg:col-span-4 relative">
                    <div className="lg:sticky lg:top-24 space-y-8">
                        {/* NAVIGATION RAPIDE */}
                        <Card className="border-2 border-brand/20 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
                            <CardHeader className="bg-brand text-white p-6"><CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3"><LayoutGrid className="h-5 w-5" /> Navigation Rapide</CardTitle></CardHeader>
                            <CardContent className="p-6">
                                <nav className="space-y-4">
                                    <a href="#tech" className="flex items-center gap-4 text-sm font-black text-foreground hover:text-brand transition-colors group/nav">
                                        <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center group-hover/nav:bg-brand group-hover/nav:text-white transition-all"><Cpu className="h-4 w-4" /></div>
                                        Fiche Technique
                                    </a>
                                    <a href="#service" className="flex items-center gap-4 text-sm font-black text-foreground hover:text-brand transition-colors group/nav">
                                        <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center group-hover/nav:bg-brand group-hover/nav:text-white transition-all"><Wrench className="h-4 w-4" /></div>
                                        Entretien & Budget
                                    </a>
                                    {displayData.faq.length > 0 && (
                                        <a href="#faq" className="flex items-center gap-4 text-sm font-black text-foreground hover:text-brand transition-colors group/nav">
                                            <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center group-hover/nav:bg-brand group-hover/nav:text-white transition-all"><HelpCircle className="h-4 w-4" /></div>
                                            FAQ Modèle
                                        </a>
                                    )}
                                </nav>
                            </CardContent>
                        </Card>

                        {/* ARTICLES LIÉS */}
                        {displayData.relations.articles.length > 0 && (
                             <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-muted/20">
                                <CardHeader className="p-6 pb-2"><CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Conseils Pratiques</CardTitle></CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {displayData.relations.articles.map((artId: string, i: number) => (
                                        <Link key={i} href={`/info/${artId}`} className="block p-4 bg-white rounded-2xl border-2 border-transparent hover:border-brand hover:shadow-lg transition-all group">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-black uppercase group-hover:text-brand transition-colors truncate pr-4">{artId.replace(/-/g, ' ')}</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand" />
                                            </div>
                                        </Link>
                                    ))}
                                </CardContent>
                             </Card>
                        )}

                        {/* CTA CARTE */}
                        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-brand relative group cursor-pointer" onClick={() => router.push('/map')}>
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                             <CardContent className="relative z-10 p-10 text-center space-y-6">
                                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto border-2 border-white/30 animate-bounce-subtle"><RefreshCw className="h-10 w-10 text-white" /></div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Trouver un pro pour l'entretien ?</h4>
                                <p className="text-white/80 text-xs font-bold leading-relaxed">Réservez votre révision dans l'atelier le plus proche.</p>
                                <Button className="w-full bg-white text-brand hover:bg-white/90 font-black uppercase tracking-widest text-[10px] py-6 rounded-full shadow-xl">🔘 Voir les ateliers à proximité</Button>
                             </CardContent>
                        </Card>
                    </div>
                </aside>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
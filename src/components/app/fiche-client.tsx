
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Gauge, Droplets, Wrench, Settings2, ChevronDown, Loader2, CheckCircle2, AlertTriangle, HelpCircle, LayoutGrid, Home, ChevronRight, Bike, Scale } from 'lucide-react';

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
    const variants = fiche.variants || (fiche.technical_sheet?.variants) || [];
    const ts = fiche.technical_sheet || {};
    const activeVariant = variants[selectedVariantIndex] || {};
    const cp = { ...(ts.cycle_parts || {}), ...(activeVariant.cycle_parts || {}) };
    const sg = fiche.service_guide || {};

    return {
      modelName: fiche.display_title || fiche.model || modelId.replace(/-/g, ' ').toUpperCase(),
      brand: fiche.brand || (modelId.split('-')[0] || '').toUpperCase(),
      year: fiche.year_range || "N/A",
      introduction: sg.intro || "",
      imageUrl: fiche.imageUrl || "/images/motard-entretien-page.png",
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
      dimensions: {
        seatHeight: (activeVariant.seat_height_mm || ts.seat_height_mm) ? `${activeVariant.seat_height_mm || ts.seat_height_mm} mm` : "N/A",
        wetWeight: (activeVariant.weight_tpf_kg || ts.weight_tpf_kg) ? `${activeVariant.weight_tpf_kg || ts.weight_tpf_kg} kg` : "N/A",
        fuelCapacity: (activeVariant.tank_l || ts.tank_l) ? `${activeVariant.tank_l || ts.tank_l} L` : "N/A",
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
      serviceSchedule: sg.service_schedule || [],
      consumables: sg.consumables || [],
      faq: sg.faq || [],
      knownIssues: sg.known_issues || [],
      longevityTips: sg.longevity_tips || [],
      conclusion: sg.conclusion || "",
    };
  }, [fiche, selectedVariantIndex, modelId]);

  if (isLoading) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-brand mb-4" /><p className="text-muted-foreground font-black animate-pulse">Chargement Firestore...</p></div>);
  if (!fiche || !displayData) return (<div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4"><h1 className="text-4xl font-black mb-4 uppercase">Fiche non trouvée</h1><Button asChild><Link href="/entretien">Retour</Link></Button></div>);

  return (
    <div className="min-h-screen relative bg-background">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} activeFilter={null} placeholderText="Recherche..." />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8">
            <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><Link href="/entretien" className="hover:text-brand shrink-0">Entretien</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate">{displayData.modelName}</span>
          </nav>
          
          <div className="mb-8 flex justify-between items-center">
            {returnUrl && (
              <Button asChild variant="outline" className="border-brand text-brand rounded-full hover:bg-brand/10 h-10 px-6 font-black uppercase tracking-widest text-[10px]">
                  <Link href={returnUrl} className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> {returnLabel}</Link>
              </Button>
            )}
          </div>

          <div className="space-y-8">
            {/* --- HEADER FICHE TECHNIQUE --- */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-black">
                <div className="absolute inset-0 z-0">
                    <Image src={displayData.imageUrl} alt={displayData.modelName} fill className="object-cover opacity-60" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                
                <div className="relative z-10 p-6 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div className="text-white">
                            <span className="inline-block bg-brand text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3">Fiche Technique Officielle</span>
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-2">{displayData.modelName}</h1>
                            <p className="text-lg sm:text-2xl font-black text-brand italic">Millésime {displayData.year}</p>
                        </div>
                        <div className="w-48 sm:w-64 Transition-all drop-shadow-2xl brightness-0 invert opacity-80"><LabelMotoLogo /></div>
                    </div>

                    {/* Bloc Caractéristiques Intégré */}
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

            {displayData.hasVariants && (
              <div className="flex flex-col items-center gap-4 bg-muted/30 p-4 rounded-2xl border">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sélectionnez la version :</p>
                <Tabs value={String(selectedVariantIndex)} onValueChange={(v) => setSelectedVariantIndex(Number(v))} className="w-full max-w-md">
                  <TabsList className="grid w-full h-12 bg-background border shadow-inner" style={{ gridTemplateColumns: `repeat(${displayData.variants.length}, 1fr)` }}>
                    {displayData.variants.map((v: any, idx: number) => (<TabsTrigger key={idx} value={String(idx)} className="font-black uppercase text-[10px] data-[state=active]:bg-brand data-[state=active]:text-white">{v.label || `V${idx + 1}`}</TabsTrigger>))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <Card className="shadow-xl border-none bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
                <CardHeader className="bg-brand/5 border-b py-6"><CardTitle className="flex items-center gap-3 text-brand uppercase font-black text-lg"><Gauge className="h-6 w-6" /> Détails Moteur</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-end border-b border-dashed pb-2"><span className="font-bold text-muted-foreground text-xs uppercase">Type:</span><span className="font-black text-right">{displayData.engine.type}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-2"><span className="font-bold text-muted-foreground text-xs uppercase">Cylindrée:</span><span className="font-black text-right">{displayData.engine.displacement}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-2"><span className="font-bold text-muted-foreground text-xs uppercase">Couple:</span><span className="font-black text-right text-brand">{displayData.engine.torque}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-2"><span className="font-bold text-muted-foreground text-xs uppercase">Alimentation:</span><span className="font-black text-right">{displayData.engine.alimentation}</span></li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="shadow-xl border-none bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
                <CardHeader className="bg-blue-500/5 border-b py-6"><CardTitle className="flex items-center gap-3 text-blue-600 uppercase font-black text-lg"><Settings2 className="h-6 w-6" /> Capacité & Gabarit</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-end border-b border-dashed pb-2"><span className="font-bold text-muted-foreground text-xs uppercase">Réservoir:</span><span className="font-black text-right">{displayData.dimensions.fuelCapacity}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-2"><span className="font-bold text-muted-foreground text-xs uppercase">Hauteur selle:</span><span className="font-black text-right">{displayData.dimensions.seatHeight}</span></li>
                    <li className="flex justify-between items-end border-b border-dashed pb-2"><span className="font-bold text-muted-foreground text-xs uppercase">Poids TPF:</span><span className="font-black text-right">{displayData.dimensions.wetWeight}</span></li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Accordion type="single" collapsible className="w-full mt-8">
                <AccordionItem value="cycle" className="border-none">
                    <AccordionTrigger className="bg-muted/30 p-8 rounded-3xl font-black uppercase text-brand hover:no-underline shadow-sm">
                        <div className="flex items-center gap-4"><Settings2 className="h-6 w-6" /><span>Partie Cycle & Freinage</span></div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 px-4">
                        <div className="overflow-hidden rounded-2xl border bg-card">
                            <Table>
                                <TableBody>
                                    <TableRow className="hover:bg-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground w-1/3">Cadre</TableCell><TableCell className="font-bold">{displayData.chassis.frame}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Suspension Avant</TableCell><TableCell className="font-bold">{displayData.chassis.frontSuspension}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Suspension Arrière</TableCell><TableCell className="font-bold">{displayData.chassis.rearSuspension}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Frein Avant</TableCell><TableCell className="font-bold">{displayData.chassis.frontBrake}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Frein Arrière</TableCell><TableCell className="font-bold">{displayData.chassis.rearBrake}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Pneu Avant</TableCell><TableCell className="font-bold">{displayData.chassis.frontTire}</TableCell></TableRow>
                                    <TableRow className="hover:bg-muted/50"><TableCell className="font-black text-[10px] uppercase text-muted-foreground">Pneu Arrière</TableCell><TableCell className="font-bold">{displayData.chassis.rearTire}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="pt-20 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Guide Entretien & Prix</h2>
                    <div className="w-20 h-2 bg-brand mx-auto rounded-full" />
                    {displayData.introduction && <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto">{displayData.introduction}</p>}
                </div>
                
                {displayData.serviceSchedule.length > 0 && (
                    <Card className="border-none shadow-2xl bg-card overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="bg-brand text-white p-8"><CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-widest"><Wrench className="h-8 w-8" /> Calendrier des révisions</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-black uppercase text-[10px] py-6 px-8">Kilométrage</TableHead>
                                        <TableHead className="font-black uppercase text-[10px]">Type de Service</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] text-right pr-8">Budget Estimé</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {displayData.serviceSchedule.map((s: any, i: number) => (
                                        <TableRow key={i} className="hover:bg-brand/5 border-b last:border-0">
                                            <TableCell className="font-black text-xl py-6 px-8">{s.km?.toLocaleString()} <span className="text-xs text-muted-foreground ml-1">km</span></TableCell>
                                            <TableCell className="font-bold text-lg">{s.service_label}</TableCell>
                                            <TableCell className="font-black text-xl text-brand text-right pr-8">{s.price_estimate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {displayData.consumables.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3"><Droplets className="h-6 w-6 text-blue-500" /> Consommables & Fluides</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayData.consumables.map((c: any, i: number) => (
                                <Card key={i} className="border-2 border-muted bg-card shadow-sm hover:border-blue-200 transition-colors">
                                    <CardContent className="p-5 flex justify-between items-center">
                                        <span className="font-black uppercase text-[10px] text-muted-foreground">{c.label}</span>
                                        <span className="font-black text-blue-600">{c.value}</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {displayData.conclusion && (
                    <div className="bg-muted/30 p-10 rounded-[2.5rem] border-2 border-dashed text-center">
                        <p className="text-lg font-bold italic text-muted-foreground leading-relaxed">"{displayData.conclusion}"</p>
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <div className="h-px w-12 bg-muted-foreground/30" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Expertise Label Moto</p>
                            <div className="h-px w-12 bg-muted-foreground/30" />
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

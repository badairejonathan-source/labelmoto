
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Gauge, Droplets, Wrench, Settings2, ChevronDown, Loader2, CheckCircle2, AlertTriangle, HelpCircle, LayoutGrid, Home, ChevronRight } from 'lucide-react';

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [isPartieCycleOpen, setIsPartieCycleOpen] = useState(false);
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
    <div className="min-h-screen relative">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} activeFilter={null} placeholderText="Recherche..." />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8">
            <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><Link href="/entretien" className="hover:text-brand shrink-0">Entretien</Link>
            <ChevronRight className="h-3 w-3 shrink-0" /><span className="text-foreground truncate">{displayData.modelName}</span>
          </nav>
          
          {returnUrl && (
            <Button asChild variant="outline" className="mb-8 border-brand text-brand rounded-full">
                <Link href={returnUrl} className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> {returnLabel}</Link>
            </Button>
          )}

          <div className="space-y-8">
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border-4 border-brand bg-white">
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30"><div className="w-44 sm:w-56 md:w-64 Transition-all"><LabelMotoLogo /></div></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full z-20">
                    <span className="text-[10px] uppercase tracking-widest text-brand/90 mb-1">Données techniques Firestore</span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">{displayData.modelName}</h1>
                    <p className="text-base sm:text-lg md:text-2xl font-bold text-brand/90">{displayData.year}</p>
                </div>
            </div>

            {displayData.hasVariants && (
              <div className="flex flex-col items-center gap-4 bg-muted/30 p-4 rounded-2xl border">
                <Tabs value={String(selectedVariantIndex)} onValueChange={(v) => setSelectedVariantIndex(Number(v))} className="w-full max-w-md">
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${displayData.variants.length}, 1fr)` }}>
                    {displayData.variants.map((v: any, idx: number) => (<TabsTrigger key={idx} value={String(idx)} className="font-bold uppercase text-[10px]">{v.label || `V${idx + 1}`}</TabsTrigger>))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-none bg-card/50 backdrop-blur-sm">
                <CardHeader><CardTitle className="flex items-center gap-3 text-brand uppercase font-black text-lg"><Gauge className="h-6 w-6" /> Moteur</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b pb-1"><span className="font-bold text-muted-foreground">Type:</span><span className="font-bold">{displayData.engine.type}</span></li>
                    <li className="flex justify-between border-b pb-1"><span className="font-bold text-muted-foreground">Cylindrée:</span><span className="font-bold">{displayData.engine.displacement}</span></li>
                    <li className="flex justify-between border-b pb-1"><span className="font-bold text-muted-foreground">Puissance:</span><span className="font-bold">{displayData.engine.power}</span></li>
                    <li className="flex justify-between border-b pb-1"><span className="font-bold text-muted-foreground">Couple:</span><span className="font-bold">{displayData.engine.torque}</span></li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-none bg-card/50 backdrop-blur-sm">
                <CardHeader><CardTitle className="flex items-center gap-3 text-brand uppercase font-black text-lg"><Settings2 className="h-6 w-6" /> Dimensions</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b pb-1"><span className="font-bold text-muted-foreground">Selle:</span><span className="font-bold">{displayData.dimensions.seatHeight}</span></li>
                    <li className="flex justify-between border-b pb-1"><span className="font-bold text-muted-foreground">Poids (TPF):</span><span className="font-bold">{displayData.dimensions.wetWeight}</span></li>
                    <li className="flex justify-between border-b pb-1"><span className="font-bold text-muted-foreground">Réservoir:</span><span className="font-bold">{displayData.dimensions.fuelCapacity}</span></li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cycle" className="border-none">
                    <AccordionTrigger className="bg-muted/30 p-6 rounded-2xl font-black uppercase text-brand hover:no-underline">Partie Cycle</AccordionTrigger>
                    <AccordionContent className="pt-4"><Table className="border rounded-xl">
                        <TableBody>{Object.entries(displayData.chassis).map(([k, v], i) => (<TableRow key={i}><TableCell className="font-bold">{k}</TableCell><TableCell>{String(v)}</TableCell></TableRow>))}</TableBody>
                    </Table></AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="pt-12 space-y-8">
                <h2 className="text-4xl font-black text-center uppercase tracking-tighter">Guide Entretien</h2>
                {displayData.introduction && <p className="text-xl text-center text-muted-foreground font-medium">{displayData.introduction}</p>}
                
                {displayData.serviceSchedule.length > 0 && (
                    <Card className="border-none shadow-xl bg-card">
                        <CardHeader className="bg-brand text-white rounded-t-xl"><CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Révisions</CardTitle></CardHeader>
                        <CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>KM</TableHead><TableHead>Service</TableHead><TableHead>Prix Est.</TableHead></TableRow></TableHeader><TableBody>{displayData.serviceSchedule.map((s: any, i: number) => (<TableRow key={i}><TableCell className="font-bold">{s.km} km</TableCell><TableCell>{s.service_label}</TableCell><TableCell className="font-bold text-brand">{s.price_estimate}</TableCell></TableRow>))}</TableBody></Table></CardContent>
                    </Card>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

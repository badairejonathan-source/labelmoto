'use client';

import React, { useState, use, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

// Import local data as fallback
import localFiches from '@/app/data/fiches-techniques.json';

export default function FicheTechniquePage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = use(params);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPartieCycleOpen, setIsPartieCycleOpen] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const firestore = useFirestore();
  const ficheRef = useMemoFirebase(() => doc(firestore, 'motorcycle_sheets', modelId), [firestore, modelId]);
  const { data: firestoreFiche, isLoading } = useDoc(ficheRef);

  // Intelligent merge: Use Firestore data if available, but fallback to local for missing images or structure
  const fiche = useMemo(() => {
    const local = (localFiches as any[]).find(f => f.id === modelId) || null;
    
    if (firestoreFiche && Object.keys(firestoreFiche).length > 1) {
      return {
        ...local,
        ...firestoreFiche,
        imageUrl: firestoreFiche.imageUrl || local?.imageUrl || "",
        service_guide: { ...local?.service_guide, ...firestoreFiche.service_guide },
        technical_sheet: { ...local?.technical_sheet, ...firestoreFiche.technical_sheet },
        variants: firestoreFiche.variants || local?.variants || []
      };
    }
    
    if (!isLoading) {
      return local;
    }
    
    return null;
  }, [firestoreFiche, modelId, isLoading]);

  useEffect(() => {
    setSelectedVariantIndex(0);
  }, [modelId]);

  const displayData = useMemo(() => {
    if (!fiche) return null;

    const variants = fiche.variants || (fiche.technical_sheet?.variants) || [];
    const ts = fiche.technical_sheet || {};
    const activeVariant = variants[selectedVariantIndex] || {};
    const baseCp = ts.cycle_parts || fiche.cycle_parts || {};
    const variantCp = activeVariant.cycle_parts || {};
    const cp = { ...baseCp, ...variantCp };
    const sg = fiche.service_guide || {};

    return {
      modelName: fiche.display_title || fiche.model || modelId.replace(/-/g, ' ').toUpperCase(),
      brand: fiche.brand || (modelId.split('-')[0] || '').toUpperCase(),
      year: fiche.year_range || "Donnée non renseignée",
      imageUrl: fiche.imageUrl || "https://images.unsplash.com/photo-1621699353928-09192b03a31c?q=80&w=2070&auto=format&fit=crop",
      introduction: sg.intro || fiche.introduction || "",
      hasVariants: variants.length > 1,
      variants: variants,
      engine: {
        bridage: activeVariant.license_bridging || ts.license_bridging || (modelId.includes('a2') ? "✔ Permis A2" : "✔ Version standard"),
        type: activeVariant.engine_type || ts.engine_type || "Donnée non renseignée",
        displacement: (activeVariant.displacement_cc || ts.displacement_cc) ? `${activeVariant.displacement_cc || ts.displacement_cc} cm³` : "Donnée non renseignée",
        power: activeVariant.power || ts.power || "Donnée non renseignée",
        torque: activeVariant.torque || ts.torque || "Donnée non renseignée",
        alimentation: activeVariant.fuel_system || ts.fuel_system || "Donnée non renseignée"
      },
      dimensions: {
        seatHeight: (activeVariant.seat_height_mm || ts.seat_height_mm) ? `${activeVariant.seat_height_mm || ts.seat_height_mm} mm` : "Donnée non renseignée",
        wetWeight: (activeVariant.weight_tpf_kg || ts.weight_tpf_kg) ? `${activeVariant.weight_tpf_kg || ts.weight_tpf_kg} kg` : "Donnée non renseignée",
        fuelCapacity: (activeVariant.tank_l || ts.tank_l) ? `${activeVariant.tank_l || ts.tank_l} L` : "Donnée non renseignée",
        wheelbase: (activeVariant.wheelbase_mm || ts.wheelbase_mm) ? `${activeVariant.wheelbase_mm || ts.wheelbase_mm} mm` : "Donnée non renseignée",
      },
      chassis: {
        frame: cp.frame || "Donnée non renseignée",
        frontSuspension: cp.front_suspension || "Donnée non renseignée",
        rearSuspension: cp.rear_suspension || "Donnée non renseignée",
        frontBrake: cp.front_brake || "Donnée non renseignée",
        rearBrake: cp.rear_brake || "Donnée non renseignée",
        frontTire: cp.front_tire || "Donnée non renseignée",
        rearTire: cp.rear_tire || "Donnée non renseignée"
      },
      serviceSchedule: sg.service_schedule || fiche.service_schedule || [],
      consumables: sg.consumables || fiche.consumables || [],
      faq: sg.faq || fiche.faq || [],
      knownIssues: sg.known_issues || fiche.known_issues || [],
      longevityTips: sg.longevity_tips || fiche.longevity_tips || [],
      conclusion: sg.conclusion || "",
      ctas: {
        compare: { 
          button: sg.compare_cta_button || "Comparer les ateliers près de moi",
          text: sg.compare_cta_text || "Les tarifs peuvent varier selon l’atelier et la région."
        },
        concession: {
          title: sg.concession_cta_title || `La ${fiche.display_title || 'moto'} vous correspond ?`,
          button: sg.concession_cta_button || "Voir en concession",
          text: sg.concession_cta_text || "Si vous envisagez d’en acheter une, comparez les offres disponibles."
        }
      }
    };
  }, [fiche, selectedVariantIndex, modelId]);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-brand mb-4" />
        <p className="text-muted-foreground font-bold animate-pulse">Chargement de la fiche technique...</p>
      </div>
    );
  }

  if (!fiche || !displayData) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center px-4">
            <h1 className="text-4xl font-black mb-4 uppercase">
                FICHE NON TROUVÉE
            </h1>
            <p className="text-muted-foreground mb-8">Nous n'avons pas trouvé de données pour le modèle "{modelId}".</p>
            <Button asChild>
                <Link href="/entretien">Retour à la liste</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        onFilterChange={handleFilterChange}
        placeholderText="Rechercher un pro, un article..."
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
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8 overflow-hidden whitespace-nowrap">
            <Link href="/" className="hover:text-brand transition-colors flex items-center gap-1 shrink-0">
              <Home className="h-3 w-3" />
              <span>Accueil</span>
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/entretien" className="hover:text-brand transition-colors shrink-0">Entretien</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{displayData.modelName}</span>
          </nav>

          <div className="space-y-8">
            {/* Hero Section - Branding Format */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-8 shadow-2xl border-4 border-white bg-white flex flex-col items-center justify-center p-12">
              <div className="w-full max-w-md transform -translate-y-4">
                <LabelMotoLogo />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-brand/90 mb-1">Fiche technique</span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none drop-shadow-xl">
                        {displayData.modelName}
                    </h1>
                    <p className="text-lg md:text-2xl font-bold text-brand/90 drop-shadow-md">{displayData.year}</p>
                </div>
              </div>
            </div>

            {/* Variant Switcher */}
            {displayData.hasVariants && (
              <div className="flex flex-col items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <LayoutGrid className="h-3 w-3" /> Sélectionner la version
                </div>
                <Tabs value={String(selectedVariantIndex)} onValueChange={(v) => setSelectedVariantIndex(Number(v))} className="w-full max-w-md">
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${displayData.variants.length}, 1fr)` }}>
                    {displayData.variants.map((v: any, idx: number) => (
                      <TabsTrigger key={idx} value={String(idx)} className="font-bold uppercase text-[10px] tracking-tight">
                        {v.label || v.title || `Version ${idx + 1}`}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-none bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-brand uppercase font-black text-lg tracking-widest">
                    <Gauge className="h-6 w-6" /> Moteur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {displayData.engine?.bridage && (
                      <li className="flex flex-col gap-1 pb-2 border-b border-border/50">
                        <span className="font-black text-[10px] uppercase text-muted-foreground tracking-wider">Permis / Bridage:</span>
                        <span className="text-brand font-black text-sm">{displayData.engine.bridage}</span>
                      </li>
                    )}
                    {[
                      { label: "Type", value: displayData.engine?.type },
                      { label: "Cylindrée", value: displayData.engine?.displacement },
                      { label: "Puissance", value: displayData.engine?.power },
                      { label: "Couple", value: displayData.engine?.torque },
                      { label: "Alimentation", value: displayData.engine?.alimentation }
                    ].map((item, i) => (
                      <li key={i} className="flex justify-between items-center text-sm border-b border-border/30 last:border-0 pb-1.5 last:pb-0">
                        <span className="font-bold text-muted-foreground">{item.label}:</span>
                        <span className="font-bold text-right ml-4">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-none bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-brand uppercase font-black text-lg tracking-widest">
                    <Settings2 className="h-6 w-6" /> Dimensions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      { label: "H. de selle", value: displayData.dimensions?.seatHeight },
                      { label: "Poids (TPF)", value: displayData.dimensions?.wetWeight },
                      { label: "Réservoir", value: displayData.dimensions?.fuelCapacity },
                      { label: "Empattement", value: displayData.dimensions?.wheelbase }
                    ].map((item, i) => (
                      <li key={i} className="flex justify-between items-center text-sm border-b border-border/30 last:border-0 pb-1.5 last:pb-0">
                        <span className="font-bold text-muted-foreground">{item.label}:</span>
                        <span className="font-bold text-right ml-4">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Chassis Collapsible */}
            <Collapsible 
              open={isPartieCycleOpen} 
              onOpenChange={setIsPartieCycleOpen}
              className="w-full"
            >
              <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm transition-all duration-300">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-6">
                    <CardTitle className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3 text-brand uppercase font-black text-lg tracking-widest">
                        <Droplets className="h-6 w-6" /> 
                        <span>Partie Cycle</span>
                      </div>
                      <ChevronDown className={cn(
                        "h-6 w-6 text-brand transition-transform duration-500",
                        isPartieCycleOpen && "rotate-180"
                      )} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="overflow-x-auto rounded-lg border">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead className="font-bold text-foreground">Élément</TableHead>
                            <TableHead className="font-bold text-foreground">Spécification</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { label: "Cadre", val: displayData.chassis?.frame },
                            { label: "Suspension AV", val: displayData.chassis?.frontSuspension },
                            { label: "Suspension AR", val: displayData.chassis?.rearSuspension },
                            { label: "Frein AV", val: displayData.chassis?.frontBrake },
                            { label: "Frein AR", val: displayData.chassis?.rearBrake },
                            { label: "Pneu AV", val: displayData.chassis?.frontTire },
                            { label: "Pneu AR", val: displayData.chassis?.rearTire }
                          ].map((row, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-bold py-4">{row.label}</TableCell>
                              <TableCell className="py-4">{row.val}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Maintenance Guide Section */}
            <div className="pt-12">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase tracking-tighter">
                Guide d'entretien
              </h2>
              <div className="w-24 h-1.5 bg-brand mx-auto mb-8 rounded-full" />
              
              {displayData.introduction && (
                <p className="text-xl text-center text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto font-medium">
                  {displayData.introduction}
                </p>
              )}

              <div className="space-y-12">
                {/* Service Schedule Table */}
                {displayData.serviceSchedule.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-6 w-6 text-brand" />
                      <h3 className="text-2xl font-bold uppercase tracking-tight">Intervalles et prix des révisions</h3>
                    </div>
                    <div className="overflow-x-auto rounded-xl border shadow-sm">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="font-bold text-foreground py-4">Kilométrage</TableHead>
                            <TableHead className="font-bold text-foreground py-4">Entretien à effectuer</TableHead>
                            <TableHead className="font-bold text-foreground py-4">Prix moyen (est.)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayData.serviceSchedule.map((item: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-bold py-4">{item.km?.toLocaleString() || '-'} km</TableCell>
                              <TableCell className="py-4">{item.service_label}</TableCell>
                              <TableCell className="py-4 font-bold text-brand">{item.price_estimate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-sm italic text-muted-foreground">👉 Une vidange annuelle reste recommandée même si le kilométrage n’est pas atteint.</p>
                  </div>
                )}

                {/* Compare CTA */}
                <div className="my-8 text-center space-y-4 bg-brand/5 p-8 rounded-3xl border border-brand/10">
                  <p className="text-sm text-muted-foreground max-w-2xl mx-auto italic">
                    {displayData.ctas.compare.text}
                  </p>
                  <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs tracking-widest px-8 py-6 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95">
                    <Link href={`/map?filter=service&search=${encodeURIComponent(displayData.brand)}`}>
                      🔘 {displayData.ctas.compare.button}
                    </Link>
                  </Button>
                </div>

                {/* Consumables Table */}
                {displayData.consumables.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-6 w-6 text-brand" />
                      <h3 className="text-2xl font-bold uppercase tracking-tight">Les consommables à surveiller</h3>
                    </div>
                    <div className="overflow-x-auto rounded-xl border shadow-sm">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="font-bold text-foreground py-4">Pièce</TableHead>
                            <TableHead className="font-bold text-foreground py-4">Durée de vie moyenne</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayData.consumables.map((item: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-bold py-4">{item.part}</TableCell>
                              <TableCell className="py-4">{item.average_lifetime}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Reliability & Tips Accordions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {displayData.longevityTips.length > 0 && (
                    <Card className="border-none shadow-md bg-green-50/50 dark:bg-green-900/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-green-600 uppercase font-black text-sm tracking-widest">
                          <CheckCircle2 className="h-5 w-5" /> Conseils de longévité
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-sm font-medium text-foreground/80">
                          {displayData.longevityTips.map((tip: string, idx: number) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-green-500">•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {displayData.knownIssues.length > 0 && (
                    <Card className="border-none shadow-md bg-orange-50/50 dark:bg-orange-900/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-orange-600 uppercase font-black text-sm tracking-widest">
                          <AlertTriangle className="h-5 w-5" /> Points de fiabilité
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-sm font-medium text-foreground/80">
                          {displayData.knownIssues.map((issue: string, idx: number) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-orange-500">•</span> {issue}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* FAQ Section */}
                {displayData.faq.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-6 w-6 text-brand" />
                      <h3 className="text-2xl font-bold uppercase tracking-tight">Questions fréquentes</h3>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {displayData.faq.map((item: any, idx: number) => (
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

                {/* Conclusion & Signature */}
                {displayData.conclusion && (
                  <div className="pt-8 border-t border-brand/10">
                    <p className="text-lg italic text-foreground/90 leading-relaxed mb-12">
                      "{displayData.conclusion}"
                    </p>
                    <div className="flex justify-end items-center">
                      <p className="text-lg font-bold text-foreground/90 relative z-10">L'équipe Label Moto</p>
                      <Image 
                        src="/images/Stamp-LM.png?v=2" 
                        alt="Signature Label Moto" 
                        width={120} 
                        height={120}
                        className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-12"
                      />
                    </div>
                  </div>
                )}

                {/* Concession CTA */}
                <div className="my-16 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500/20 rounded-3xl p-8 text-center shadow-xl">
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">🏍️ {displayData.ctas.concession.title}</h3>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg font-medium">
                        {displayData.ctas.concession.text}
                    </p>
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest px-10 py-7 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
                        <Link href={`/map?filter=shopping&search=${encodeURIComponent(displayData.brand)}`}>
                            🔘 {displayData.ctas.concession.button}
                        </Link>
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

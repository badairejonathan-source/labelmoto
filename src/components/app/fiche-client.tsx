'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { pickRelatedModels } from '@/lib/related-models-pool';
import MotorcycleSheetV2View from '@/components/app/motorcycle-sheet-v2-view';
import { getMotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
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
  LayoutGrid,
  FileText,
  ClipboardList,
  CircleDot,
  Wallet,
  Star,
  MessageSquare,
  User,
  Send
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
import { useFirestore, useDoc, useMemoFirebase, useUser, useCollection, addDocumentNonBlocking } from '@/firebase/client';
import { doc, collection, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const reviewSchema = z.object({
  rating: z.number().min(1, "Veuillez donner une note.").max(5),
  content: z.string().min(10, "Votre avis doit faire au moins 10 caractères."),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const getRobustValue = (obj: any, preferredKeys: string[], defaultValue: string = "—") => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  for (const key of preferredKeys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return String(obj[key]);
    }
  }
  const commonSynonyms: Record<string, string[]> = {
    'operations': ['service_label', 'operations', 'content', 'description', 'details', 'label', 'op'],
    'price': ['price_estimate', 'prix', 'budget', 'coût', 'cout', 'valeur'],
    'km': ['intervalle', 'interval', 'distance', 'periodicité', 'periodicite'],
    'spec': ['value', 'details', 'reference', 'ref', 'type'],
    'part': ['nom', 'label', 'item'],
    'lifetime': ['average_lifetime', 'duree', 'vie', 'km']
  };
  for (const prefKey of preferredKeys) {
    const synonyms = commonSynonyms[prefKey] || [];
    for (const syn of synonyms) {
      if (obj[syn] !== undefined && obj[syn] !== null && obj[syn] !== "") {
        return String(obj[syn]);
      }
    }
  }
  const firstString = Object.values(obj).find(v => (typeof v === 'string' || typeof v === 'number') && String(v).length > 0);
  if (firstString) return String(firstString);
  return defaultValue;
};

export default function FicheClient({ modelId }: { modelId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const from = searchParams.get('from');
  const returnUrl = from === 'entretien' ? '/entretien' : (from ? `/info/${from}` : '/entretien');
  const returnLabel = "RETOUR AU CATALOGUE";

  const firestore = useFirestore();
  const ficheRef = useMemoFirebase(() => (firestore && modelId) ? doc(firestore, 'motorcycle_sheets', modelId) : null, [firestore, modelId]);
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
    const sg = fiche.service_guide || {};
    const cp = { ...(ts.cycle_parts || {}), ...(activeVariant.cycle_parts || {}) };
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
      maintenanceCost: sg.maintenance_cost_summary || fiche.maintenance_cost_summary || null,
      faq: sg.faq || fiche.faq || [],
      knownIssues: (sg.known_issues || fiche.known_issues || []).map((x: any) => typeof x === "string" ? x : (x.issue + (x.description ? " — " + x.description : "") + (x.remedy ? " → " + x.remedy : ""))),

      longevityTips: sg.longevity_tips || fiche.longevity_tips || [],
      conclusion: sg.conclusion || fiche.conclusion || "",
    };
  }, [fiche, selectedVariantIndex, modelId]);

  const v2 = useMemo(
    () => getMotorcycleSheetV2(fiche),
    [fiche]
  );

  const breadcrumbLd = useMemo(() => {
    if (!displayData) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://labelmoto.fr" },
        { "@type": "ListItem", "position": 2, "name": "Catalogue", "item": "https://labelmoto.fr/entretien" },
        { "@type": "ListItem", "position": 3, "name": displayData.modelName, "item": `https://labelmoto.fr/fiches/${modelId}` }
      ]
    };
  }, [displayData, modelId]);

  const relatedModels = useMemo(() => {
    if (!displayData) return [];
    const displacementStr = displayData.engine.displacement || "";
    const parsed = parseInt(displacementStr.replace(/[^0-9]/g, ''), 10);
    const currentCC = isNaN(parsed) ? null : parsed;
    const declared = fiche?.relations?.related_models as string[] | undefined;
    return pickRelatedModels(modelId, currentCC, displayData.category, declared);
  }, [modelId, displayData, fiche]);

  const { user } = useUser();
  const { toast } = useToast();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const proProfileRef = useMemoFirebase(() => (user && firestore) ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proProfileRef);
  const stdProfileRef = useMemoFirebase(() => (user && firestore) ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdProfileRef);
  const activeProfile = proProfile || stdProfile;

  const reviewsRef = useMemoFirebase(() => {
    if (!firestore || !modelId) return null;
    return query(collection(firestore, 'motorcycle_sheets', modelId, 'comments'), orderBy('date', 'desc'));
  }, [firestore, modelId]);
  const { data: reviews, isLoading: reviewsLoading } = useCollection(reviewsRef);

  const reviewForm = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, content: '' },
  });

  const handleLeaveReviewClick = () => {
    const currentPath = `/fiches/${modelId}`;
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}#leave-review`);
      return;
    }
    if (!activeProfile) {
      router.push(`/account?callbackUrl=${encodeURIComponent(currentPath)}#leave-review`);
      return;
    }
    setIsReviewDialogOpen(true);
  };

  const onSubmitReview = async (values: ReviewFormValues) => {
    if (!user || !activeProfile || !firestore) return;
    setIsSubmittingReview(true);
    try {
      addDocumentNonBlocking(collection(firestore, 'pending_comments'), {
        targetType: 'motorcycle_sheet',
        dealershipId: modelId,
        dealershipName: displayData?.modelName || modelId,
        userId: user.uid,
        userName: activeProfile.pseudo || activeProfile.displayName || "Motard",
        rating: values.rating,
        content: values.content,
        date: serverTimestamp(),
      });
      toast({
        title: "Avis envoyé !",
        description: "Merci ! Votre avis a été transmis à l'équipe pour validation avant publication."
      });
      setIsReviewDialogOpen(false);
      reviewForm.reset();
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'envoyer l'avis." });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading || !displayData) return (
    <div className="min-h-screen bg-background">
        <Header searchTerm="" onSearchTermChange={() => {}} onSearch={() => {}} />
        <main className="container mx-auto px-4 py-8"><div className="max-w-5xl mx-auto space-y-8 pt-28"><Skeleton className="h-4 w-40" /><Skeleton className="h-12 w-full rounded-full" /><Skeleton className="aspect-video w-full rounded-[2.5rem]" /></div></main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} />
      {breadcrumbLd && <Script id="breadcrumb-fiche-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />}
      
      <main className="pt-5 md:pt-6 lg:pt-8 container mx-auto px-4 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-6">
            <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> ACCUEIL</Link>
            <ChevronRight className="h-2 w-2 shrink-0" /><Link href="/entretien" className="hover:text-brand shrink-0">ENTRETIEN</Link>
            <ChevronRight className="h-2 w-2 shrink-0" /><span className="text-foreground truncate font-black">{displayData.modelName}</span>
          </nav>
          
          <div className="mb-8">
            <Button asChild variant="outline" className="border-brand text-brand rounded-full hover:bg-brand/10 h-10 px-6 font-black uppercase text-[9px] transition-all shadow-sm">
                <Link href={returnUrl} className="flex items-center gap-2"><ArrowLeft className="h-3.5 w-3.5" /> {returnLabel}</Link>
            </Button>
          </div>

          <div className="space-y-10">
            {v2 ? (
              <MotorcycleSheetV2View
                modelId={modelId}
                displayData={displayData}
                v2={v2}
                selectedVariantIndex={selectedVariantIndex}
                onSelectVariant={setSelectedVariantIndex}
                relatedModels={relatedModels}
                reviews={reviews}
                reviewsLoading={reviewsLoading}
                onLeaveReview={handleLeaveReviewClick}
              />
            ) : (
              <>
            <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-black aspect-video flex flex-col justify-between">
                <div className="absolute inset-0 z-0"><Image src={displayData.imageUrl} alt={displayData.modelName} fill className="object-cover opacity-75" priority /></div>
                <div className="relative z-10 w-full">
                    <div className="flex flex-col gap-2 p-5 md:p-8">
                        <div className="text-white">
                            <span className="inline-block bg-brand text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] mb-4 shadow-lg">FICHE TECHNIQUE OFFICIELLE</span>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-2">{displayData.modelName}</h1>
                            <p className="text-xl md:text-2xl font-black text-brand italic">Millésime {displayData.year}</p>
                        </div>
                        <div className="w-32 md:w-48 drop-shadow-2xl brightness-0 invert opacity-40 hidden md:block"><LabelMotoLogo noBubble /></div>
                    </div>
                    
                </div>
            </div>

            {displayData.hasVariants && (
                <div className="bg-muted/30 p-4 md:p-6 rounded-2xl border-2 border-muted flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">SÉLECTIONNEZ LA VERSION :</span>
                    <div className="flex bg-white rounded-full p-1 shadow-sm border border-muted">
                        {displayData.variants.map((v: any, i: number) => (
                            <button key={i} onClick={() => setSelectedVariantIndex(i)} className={cn("rounded-full font-black uppercase text-[9px] h-9 px-8 transition-all", selectedVariantIndex === i ? "bg-brand text-white shadow-lg" : "text-muted-foreground hover:bg-muted/50")}>{v.label || `Variante ${i+1}`}</button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-card">
                    <CardHeader className="bg-brand/[0.03] py-5 border-b border-brand/10"><CardTitle className="text-sm font-black uppercase text-brand flex items-center gap-3"><Zap className="h-5 w-5" /> DÉTAILS MOTEUR</CardTitle></CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-5">
                            {[{ label: 'TYPE:', value: displayData.engine.type }, { label: 'CYLINDRÉE:', value: displayData.engine.displacement }, { label: 'COUPLE:', value: displayData.engine.torque, color: 'text-brand' }, { label: 'ALIMENTATION:', value: displayData.engine.alimentation }].map((row, i) => (
                                <div key={i} className="flex justify-between items-end gap-2"><span className="text-[9px] font-black text-muted-foreground uppercase shrink-0 pb-0.5">{row.label}</span><div className="flex-1 border-b-2 border-dotted border-muted/50 mb-1" /><span className={cn("text-sm font-black text-right max-w-[60%] leading-tight", row.color)}>{row.value}</span></div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-card">
                    <CardHeader className="bg-blue-500/[0.03] py-5 border-b border-blue-500/10"><CardTitle className="text-sm font-black uppercase text-blue-600 flex items-center gap-3"><LayoutGrid className="h-5 w-5" /> CAPACITÉ & GABARIT</CardTitle></CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-5">
                            {[{ label: 'RÉSERVOIR:', value: displayData.dimensions.tank }, { label: 'HAUTEUR SELLE:', value: displayData.dimensions.seatHeight }, { label: 'POIDS TPF:', value: displayData.dimensions.wetWeight }].map((row, i) => (
                                <div key={i} className="flex justify-between items-end gap-2"><span className="text-[9px] font-black text-muted-foreground uppercase shrink-0 pb-0.5">{row.label}</span><div className="flex-1 border-b-2 border-dotted border-muted/50 mb-1" /><span className="text-sm font-black text-right leading-tight">{row.value}</span></div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-muted/30 border border-muted/40 rounded-[1.5rem] overflow-hidden mt-3">
                        <div className="space-y-1 bg-card p-4 md:p-5"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[8px]"><Gauge className="h-3 w-3" /> PUISSANCE</div><p className="text-foreground text-lg md:text-xl font-black tracking-tighter leading-tight">{displayData.engine.power}</p></div>
                        <div className="space-y-1 bg-card border-l border-muted/30 p-4 md:p-5"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[8px]"><Scale className="h-3 w-3" /> POIDS (TPF)</div><p className="text-foreground text-lg md:text-xl font-black tracking-tighter leading-tight">{displayData.dimensions.wetWeight}</p></div>
                        <div className="space-y-1 bg-card border-l border-muted/30 p-4 md:p-5"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[8px]"><Bike className="h-3 w-3" /> HAUTEUR SELLE</div><p className="text-foreground text-lg md:text-xl font-black tracking-tighter leading-tight">{displayData.dimensions.seatHeight}</p></div>
                        <div className="space-y-1 bg-card border-l border-muted/30 p-4 md:p-5"><div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-[8px]"><ShieldCheck className="h-3 w-3" /> PERMIS</div><p className="text-foreground text-[10px] md:text-xs font-black leading-tight uppercase">✔ {displayData.engine.bridage}</p></div>
                    </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cycle" className="border-none shadow-md rounded-2xl bg-card overflow-hidden mb-4">
                    <AccordionTrigger className="px-8 py-5 hover:no-underline group"><div className="flex items-center gap-3 text-brand font-black uppercase text-xs"><Wrench className="h-5 w-5" /> PARTIE CYCLE & FREINAGE</div></AccordionTrigger>
                    <AccordionContent className="px-8 pb-8 pt-4"><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">{[{ label: 'CADRE:', value: displayData.cycleParts.frame }, { label: 'FOURCHE:', value: displayData.cycleParts.frontSuspension }, { label: 'AMORTISSEUR:', value: displayData.cycleParts.rearSuspension }, { label: 'FREIN AV:', value: displayData.cycleParts.frontBrake }, { label: 'PNEU AV:', value: displayData.cycleParts.frontTire }, { label: 'PNEU AR:', value: displayData.cycleParts.rearTire }].map((item, i) => (
                        <div key={i} className="flex justify-between items-end gap-2 py-1"><span className="text-[9px] font-black text-muted-foreground uppercase shrink-0">{item.label}</span><div className="flex-1 border-b border-dotted border-muted" /><span className="text-[11px] font-black text-right max-w-[60%]">{item.value}</span></div>
                    ))}</div></AccordionContent>
                </AccordionItem>
            </Accordion>

                <section id="service" className="scroll-mt-28 space-y-12 pt-16 border-t-2 border-dashed border-muted">
                <div className="text-center space-y-6"><h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground leading-none">GUIDE ENTRETIEN & PRIX</h2><div className="w-20 h-1.5 bg-brand mx-auto rounded-full" /><p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto" style={{display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{displayData.introduction}</p></div>
                <div className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
                    <div className="bg-brand text-white py-4 md:py-5 px-4 md:px-8 flex items-center gap-3">
                      <ClipboardList className="h-5 w-5 md:h-6 md:w-6" />
                      <span className="text-sm md:text-lg font-black uppercase tracking-widest">Calendrier des révisions</span>
                    </div>
                    <div className="p-4 md:p-8">
                      {displayData.serviceSchedule.length > 0 ? (
                        <div className="relative">
                          {displayData.serviceSchedule.map((s: any, i: number) => {
                            const km = getRobustValue(s, ['km', 'intervalle', 'label']);
                            const ops = getRobustValue(s, ['service_label', 'operations', 'content', 'description']);
                            const price = getRobustValue(s, ['price_estimate', 'price', 'prix', 'budget']);
                            const isLast = i === displayData.serviceSchedule.length - 1;
                            return (
                              <div key={i} className="flex gap-4 mb-1">
                                <div className="flex flex-col items-center" style={{width:'28px', flexShrink:0}}>
                                  <div className="flex items-center justify-center rounded-full bg-orange-50 border-2 border-brand text-brand font-black text-xs" style={{width:'24px', height:'24px', flexShrink:0}}>
                                    {i + 1}
                                  </div>
                                  {!isLast && <div className="w-px flex-1 bg-muted/40 my-1" style={{minHeight:'24px'}} />}
                                </div>
                                <div className="flex-1 pb-6">
                                  <div className="flex justify-between items-baseline mb-1 gap-2">
                                    <span className="text-sm font-black text-foreground whitespace-nowrap">{km} <span className="text-xs text-muted-foreground font-medium">km</span></span>
                                    {<span className="text-sm font-black text-brand whitespace-nowrap">{price || "NC"}</span>}
                                  </div>
                                  <div className="flex flex-col gap-1 mt-1">
                                    {ops ? ops.toString().split(/[,،،]+/).map((op: string, j: number) => op.trim() ? (
                                      <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="text-brand mt-0.5 shrink-0">✓</span>
                                        <span>{op.trim()}</span>
                                      </div>
                                    ) : null) : null}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center py-10 text-muted-foreground font-black uppercase text-xs italic">Données en cours d'actualisation...</p>
                      )}
                    </div>
                  </div>

                {displayData.maintenanceCost && (
                  <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-brand to-orange-600">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-5">
                        <Wallet className="h-6 w-6 text-white" />
                        <h3 className="text-sm md:text-lg font-black uppercase tracking-widest text-white">Budget entretien sur la duree</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <p className="text-white/70 text-[9px] font-black uppercase tracking-widest mb-1">Cout sur 60 000 km</p>
                          <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.maintenanceCost.total_60000km || "—"}</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <p className="text-white/70 text-[9px] font-black uppercase tracking-widest mb-1">Cout au km</p>
                          <p className="text-white text-xl md:text-2xl font-black tracking-tighter">{displayData.maintenanceCost.cost_per_km || "—"}</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <p className="text-white/70 text-[9px] font-black uppercase tracking-widest mb-1">Intervalle</p>
                          <p className="text-white text-[11px] md:text-xs font-black leading-tight pt-1">{displayData.maintenanceCost.interval_rule || "—"}</p>
                        </div>
                      </div>
                      {displayData.maintenanceCost.note && (
                        <p className="text-white/80 text-[10px] md:text-xs font-medium leading-relaxed italic border-t border-white/20 pt-4">
                          {displayData.maintenanceCost.note}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {displayData.consumables.length > 0 && (
                  <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-card">
                    <CardHeader className="bg-muted/50 py-6 px-10 border-b"><CardTitle className="text-sm font-black uppercase text-foreground flex items-center gap-4"><Droplets className="h-5 w-5 text-brand" /> DURÉE DE VIE DES CONSOMMABLES</CardTitle></CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-2">
                        {displayData.consumables.map((c: any, i: number) => (
                          <div key={i} className="flex flex-col py-3 border-b border-muted/30 last:border-0 gap-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{getRobustValue(c, ['part', 'nom'])}</span>
                            <span className="text-sm font-black text-foreground">{getRobustValue(c, ['average_lifetime', 'duree', 'lifetime'])}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                     <div className="bg-orange-50/40 border-2 border-orange-100 p-8 rounded-[2rem] space-y-6 shadow-sm"><div className="flex items-center gap-3 text-orange-600 font-black uppercase text-xs mb-2"><AlertTriangle className="h-5 w-5" /> DÉFAUTS CONNUS</div><ul className="space-y-4">{displayData.knownIssues.map((issue: string, i: number) => (<li key={i} className="flex items-start gap-4 text-sm font-bold text-foreground/80 leading-relaxed"><CircleDot className="h-2 w-2 text-orange-400 mt-2 shrink-0" />{issue}</li>))}{displayData.knownIssues.length === 0 && <li className="italic text-muted-foreground text-sm font-medium">Aucun défaut majeur répertorié.</li>}</ul></div>
                     <div className="bg-green-50/40 border-2 border-green-100 p-8 rounded-[2rem] space-y-6 shadow-sm"><div className="flex items-center gap-3 text-green-600 font-black uppercase text-xs mb-2"><CheckCircle2 className="h-5 w-5" /> CONSEILS DE LONGÉVITÉ</div><ul className="space-y-4">{displayData.longevityTips.map((tip: string, i: number) => (<li key={i} className="flex items-start gap-4 text-sm font-bold text-foreground/80 leading-relaxed"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{tip}</li>))}</ul></div>
                </div>
                {displayData.faq.length > 0 && (
                  <div className="space-y-8 pt-10"><h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 pl-2"><HelpCircle className="h-8 w-8 text-brand" /> QUESTIONS FRÉQUENTES</h3><div className="grid gap-4">{displayData.faq.map((item: any, idx: number) => (
                        <Card key={idx} className="border-none shadow-lg rounded-[2rem] overflow-hidden"><CardHeader className="bg-muted/20 p-6 md:p-8 border-b"><CardTitle className="text-lg font-black uppercase leading-tight">{getRobustValue(item, ['question', 'q'])}</CardTitle></CardHeader><CardContent className="p-6 md:p-8"><p className="text-base font-bold text-muted-foreground leading-relaxed italic">{getRobustValue(item, ['answer', 'a'])}</p></CardContent></Card>
                      ))}</div></div>
                )}
                <section className="pt-12 space-y-8"><h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 pl-2"><Bike className="h-8 w-8 text-brand" /> MODÈLES ÉQUIVALENTS</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{relatedModels.map((m) => (
                        <Link key={m.id} href={`/fiches/${m.id}?from=${modelId}`} className="group flex items-center justify-between p-6 bg-card rounded-2xl border-2 border-muted hover:border-brand hover:shadow-xl transition-all"><div className="flex flex-col"><span className="text-lg font-black uppercase tracking-tight text-foreground group-hover:text-brand transition-colors">{m.name}</span><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{m.cc} cm³</span></div><div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all shadow-sm"><ChevronRight className="h-5 w-5" /></div></Link>
                ))}</div></section>
                <div className="mt-20 pt-10 border-t-4 border-dashed border-muted relative flex flex-col md:flex-row items-center gap-8 bg-muted/10 p-10 rounded-[3rem]"><div className="shrink-0"><ShieldCheck className="h-16 w-16 text-brand" /></div><div className="flex-1"><h3 className="text-2xl font-black uppercase mb-4 text-foreground tracking-tighter">L'AVIS DE L'EXPERT</h3><p className="text-lg text-foreground/80 font-black leading-relaxed italic">"{displayData.conclusion}"</p><div className="flex justify-end items-center mt-8"><p className="text-lg font-black text-foreground italic relative z-10">L'équipe Label Moto</p><Image src="/images/Stamp-LM.webp" alt="Signature" width={100} height={100} className="opacity-40 -rotate-12 pointer-events-none -ml-8" loading="lazy"/></div></div></div>

                <section id="reviews" className="scroll-mt-28 space-y-8 pt-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-4 border-brand pb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <MessageSquare className="h-8 w-8 text-brand" /> Avis des motards
                      </h2>
                      <div className="bg-brand text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {reviews?.length || 0} avis
                      </div>
                    </div>
                    <Button
                      onClick={handleLeaveReviewClick}
                      className="bg-foreground text-white hover:bg-brand rounded-full font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                      Laisser un avis
                    </Button>
                  </div>

                  {reviewsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-brand" />
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="grid gap-6">
                      {reviews.map((review: any) => (
                        <Card key={review.id} className="border-2 rounded-[2rem] overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow">
                          <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                                  <User className="h-6 w-6" />
                                </div>
                                <div>
                                  <p className="font-black uppercase text-sm leading-none">{review.userName || 'Motard'}</p>
                                  <p className="text-[10px] text-muted-foreground font-bold mt-1">
                                    {review.date ? formatDistanceToNow(new Date(review.date.seconds ? review.date.seconds * 1000 : review.date), { addSuffix: true, locale: fr }) : 'Récemment'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={cn("h-4 w-4", i < (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20")} />
                                ))}
                              </div>
                            </div>
                            <p className="text-base font-bold text-foreground/80 italic leading-relaxed">
                              "{review.content}"
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/30 p-12 rounded-[2rem] border-2 border-dashed text-center">
                      <p className="font-black uppercase text-muted-foreground">Aucun avis pour le moment.</p>
                      <p className="text-xs font-bold text-muted-foreground mt-2">Soyez le premier à partager votre expérience sur ce modèle !</p>
                    </div>
                  )}
                </section>
            </section>
              </>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-brand text-white p-8 md:p-10">
            <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Votre avis nous intéresse</DialogTitle>
            <DialogDescription className="text-white/80 font-bold text-sm md:text-base leading-snug">
              Partagez votre expérience avec la <strong>{displayData.modelName}</strong> : points forts, points d'attention, conseils d'entretien...
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 md:p-10">
            <Form {...reviewForm}>
              <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-8">
                <FormField
                  control={reviewForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block text-center">Note globale</FormLabel>
                      <FormControl>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => field.onChange(star)}
                              className="focus:outline-none transition-transform active:scale-90"
                            >
                              <Star
                                className={cn(
                                  "h-10 w-10 md:h-12 md:w-12 transition-colors",
                                  star <= field.value ? "fill-yellow-400 text-yellow-400" : "text-muted/30"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={reviewForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Votre commentaire</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Fiabilité, points de vigilance, conseils d'entretien, expérience réelle..."
                          className="min-h-[150px] font-bold text-base p-4 rounded-2xl border-2 bg-muted/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsReviewDialogOpen(false)}
                    className="font-bold uppercase text-[10px] tracking-widest h-14 rounded-full flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-brand hover:bg-brand/90 text-white font-black uppercase text-[10px] tracking-widest h-14 rounded-full px-12 shadow-xl shadow-brand/20 flex-1"
                  >
                    {isSubmittingReview ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Envoyer mon avis</>}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

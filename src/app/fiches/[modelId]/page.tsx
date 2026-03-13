
'use client';

import React, { useState, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Gauge, Droplets, Wrench, Settings2, ChevronDown, Loader2 } from 'lucide-react';

import Header from '@/components/app/header';
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
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

type FicheContent = {
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'signature' | 'cta-compare' | 'cta-concession';
  text?: string;
  html?: string;
  items?: string[];
  headers?: string[];
  rows?: any[];
  imageUrl?: string;
  alt?: string;
};

export default function FicheTechniquePage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = use(params);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPartieCycleOpen, setIsPartieCycleOpen] = useState(false);
  
  const firestore = useFirestore();
  const ficheRef = useMemoFirebase(() => doc(firestore, 'motorcycle_sheets', modelId), [firestore, modelId]);
  const { data: fiche, isLoading } = useDoc(ficheRef);

  // Map Firestore data to the UI format (handles both rich and flat structures)
  const displayData = useMemo(() => {
    if (!fiche) return null;

    return {
      modelName: fiche.modelName || fiche.id?.replace(/-/g, ' ').toUpperCase(),
      brand: fiche.brand || (fiche.id?.split('-')[0] || '').toUpperCase(),
      year: fiche.year || "2021+",
      imageUrl: fiche.imageUrl || "https://images.unsplash.com/photo-1621699353928-09192b03a31c?q=80&w=2070&auto=format&fit=crop",
      introduction: fiche.introduction || "Fiche technique détaillée et guide d'entretien complet.",
      engine: {
        bridage: fiche.engine?.bridage || (fiche.id?.includes('a2') ? "✔ Permis A2" : "✔ Version standard"),
        type: fiche.engine_type || fiche.engine?.type || "Bicylindre en ligne CP2",
        displacement: fiche.displacement || fiche.engine?.displacement || "689 cm³",
        power: fiche.power || fiche.engine?.power || "Donnée non renseignée",
        torque: fiche.torque || fiche.engine?.torque || "Donnée non renseignée",
        alimentation: fiche.alimentation || fiche.engine?.alimentation || "Injection électronique"
      },
      dimensions: {
        seatHeight: fiche.seat_height_mm ? `${fiche.seat_height_mm} mm` : (fiche.dimensions?.seatHeight || "Donnée non renseignée"),
        wetWeight: fiche.weight_tpf_kg ? `${fiche.weight_tpf_kg} kg` : (fiche.dimensions?.wetWeight || "Donnée non renseignée"),
        fuelCapacity: fiche.tank_l ? `${fiche.tank_l} L` : (fiche.dimensions?.fuelCapacity || "Donnée non renseignée"),
        wheelbase: fiche.wheelbase_mm ? `${fiche.wheelbase_mm} mm` : (fiche.dimensions?.wheelbase || "Donnée non renseignée"),
      },
      chassis: fiche.chassis || {
        frame: "Cadre type Diamant en acier",
        frontSuspension: "Fourche télescopique",
        rearSuspension: "Mono-amortisseur réglable",
        frontBrake: "Double disque",
        rearBrake: "Simple disque",
        frontTire: "120/70 ZR 17",
        rearTire: "180/55 ZR 17"
      },
      content: fiche.content || []
    };
  }, [fiche]);

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
            <h1 className="text-4xl font-black mb-4">FICHE NON DISPONIBLE</h1>
            <p className="text-muted-foreground mb-8">Nous n'avons pas encore intégré les données pour le modèle "{modelId}".</p>
            <Button asChild>
                <Link href="/entretien">Retour à l'entretien</Link>
            </Button>
        </div>
    );
  }

  const renderContent = (content: FicheContent[]) => {
    if (!content || content.length === 0) return null;

    return content.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return <h3 key={index} className="text-2xl font-bold mt-12 mb-6 text-foreground border-b pb-2">{block.text}</h3>;
        
        case 'list':
          return (
            <ul key={index} className="list-disc list-inside space-y-3 my-6 pl-4 text-base leading-relaxed">
              {block.items?.map((item, i) => <li key={i} className="text-foreground/90" dangerouslySetInnerHTML={{ __html: item }} />)}
            </ul>
          );

        case 'paragraph':
          if (block.html) {
            return <p key={index} className="text-base text-foreground/90 leading-relaxed my-6" dangerouslySetInnerHTML={{ __html: block.html }} />;
          }
          return <p key={index} className="text-base text-foreground/90 leading-relaxed my-6">{block.text}</p>;
          
        case 'table':
          return (
            <div key={index} className="my-8">
              <div className="overflow-x-auto rounded-lg border shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {block.headers?.map((header: string, hIndex: number) => (
                        <TableHead key={hIndex} className="font-bold text-foreground py-4">{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {block.rows?.map((row: any, rIndex: number) => {
                      const cells = Array.isArray(row) ? row : row.data || [];
                      return (
                        <TableRow key={rIndex}>
                          {cells.map((cell: string, cIndex: number) => (
                            <TableCell key={cIndex} className={cn("py-4", cIndex === 0 ? 'font-bold' : '')}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          );

        case 'cta-compare':
          return (
            <div key={index} className="my-8 text-center space-y-4 bg-brand/5 p-8 rounded-3xl border border-brand/10">
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto italic">
                Les tarifs peuvent varier selon l’atelier et la région. Comparez les professionnels autour de vous avant de prendre rendez-vous.
              </p>
              <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs tracking-widest px-8 py-6 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95">
                <Link href={`/map?filter=service&search=${encodeURIComponent(displayData.brand)}`}>
                  {block.text || "🔘 Comparer les ateliers près de moi"}
                </Link>
              </Button>
            </div>
          );

        case 'cta-concession':
          return (
            <div key={index} className="my-16 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500/20 rounded-3xl p-8 text-center shadow-xl">
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">🏍️ La {displayData.modelName} vous correspond ?</h3>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg font-medium">
                    Si vous envisagez d’en acheter une ou de changer de modèle, il peut être utile de comparer les offres disponibles près de chez vous.
                </p>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest px-10 py-7 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
                    <Link href={`/map?filter=shopping&search=${encodeURIComponent(displayData.brand)}`}>
                        {block.text || "🔘 Voir en concession"}
                    </Link>
                </Button>
            </div>
          );
        
        case 'signature':
          return (
            <div key={index} className="flex justify-end items-center mt-12 mb-8">
              <p className="text-lg font-bold text-foreground/90 relative z-10">{block.text}</p>
              {block.imageUrl && (
                <Image 
                  src={block.imageUrl} 
                  alt={block.alt || "Signature"} 
                  width={120} 
                  height={120}
                  className="object-contain opacity-60 -rotate-[15deg] pointer-events-none -ml-12"
                />
              )}
            </div>
          );

        default:
          return null;
      }
    });
  };

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
          <Link href="/entretien" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-bold transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'entretien
          </Link>

          <div className="space-y-8">
            <div className="relative w-full aspect-[2.5/1] rounded-3xl overflow-hidden mb-8 shadow-2xl border-4 border-white">
              <Image
                src={displayData.imageUrl}
                alt={displayData.modelName}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                    {displayData.modelName}
                </h1>
                <p className="text-xl md:text-2xl font-bold text-brand">{displayData.year}</p>
              </div>
            </div>

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
                      <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 pb-2 border-b border-border/50">
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

            <div className="pt-12">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-4 uppercase tracking-tighter">
                Guide d'entretien
              </h2>
              <div className="w-24 h-1.5 bg-brand mx-auto mb-8 rounded-full" />
              
              {displayData.introduction && (
                <p className="text-xl text-center text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto font-medium">{displayData.introduction}</p>
              )}
              
              <div className="prose prose-brand max-w-none">
                  {renderContent(displayData.content || [])}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


'use client';

import React, { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Gauge, Droplets, Wrench, ShieldCheck, Settings2, ChevronDown } from 'lucide-react';

import Header from '@/components/app/header';
import fichesData from '@/app/data/fiches-techniques.json';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type FicheContent = {
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'signature' | 'cta-compare' | 'cta-concession';
  text?: string;
  html?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  imageUrl?: string;
  alt?: string;
};

type FicheData = (typeof fichesData)[0];

interface FicheTechnique extends Omit<FicheData, 'maintenance' | 'reliability'> {
  introduction?: string;
  content?: FicheContent[];
}

const parseDisplacement = (displacement: string): number => {
  if (!displacement) return 0;
  const match = displacement.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function FicheTechniquePage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = use(params);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPartieCycleOpen, setIsPartieCycleOpen] = useState(false);

  const fiche = fichesData.find((f) => f.modelId === modelId) as FicheTechnique | undefined;

  if (!fiche) {
    notFound();
  }

  const currentDisplacement = parseDisplacement(fiche.engine.displacement);
  const similarFiches = fichesData.filter(f => {
    if (f.modelId === fiche.modelId) return false;
    const displacement = parseDisplacement(f.engine.displacement);
    return Math.abs(currentDisplacement - displacement) <= 250;
  });

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

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
                    {block.rows?.map((row: string[], rIndex: number) => (
                      <TableRow key={rIndex}>
                        {row.map((cell: string, cIndex: number) => (
                          <TableCell key={cIndex} className={cn("py-4", cIndex === 0 ? 'font-bold' : '')}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          );

        case 'cta-compare':
          return (
            <div key={index} className="mt-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto italic">
                Les tarifs peuvent varier selon l’atelier et la région. Comparez les professionnels autour de vous avant de prendre rendez-vous.
              </p>
              <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs tracking-widest px-8 py-6 rounded-full shadow-xl transition-all hover:scale-105">
                <Link href={`/map?filter=service&search=${encodeURIComponent(fiche.brand)}`}>
                  {block.text || "🔘 Comparer les ateliers près de moi"}
                </Link>
              </Button>
            </div>
          );

        case 'cta-concession':
          return (
            <div key={index} className="my-16 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500/20 rounded-3xl p-8 text-center shadow-xl">
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">🏍️ La {fiche.modelName} vous correspond ?</h3>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg font-medium">
                    Si vous envisagez d’en acheter une ou de changer de modèle, il peut être utile de comparer les offres disponibles près de chez vous.
                </p>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest px-10 py-7 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
                    <Link href={`/map?filter=shopping&search=${encodeURIComponent(fiche.brand)}`}>
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
                src={fiche.imageUrl}
                alt={fiche.modelName}
                fill
                className="object-cover"
                data-ai-hint={fiche.imageHint}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                    {fiche.modelName}
                </h1>
                <p className="text-xl md:text-2xl font-bold text-brand">{fiche.year}</p>
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
                    {fiche.engine.bridage && (
                      <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 pb-2 border-b border-border/50">
                        <span className="font-black text-[10px] uppercase text-muted-foreground tracking-wider">Permis / Bridage:</span>
                        <span className="text-brand font-black text-sm">{fiche.engine.bridage}</span>
                      </li>
                    )}
                    {[
                      { label: "Type", value: fiche.engine.type },
                      { label: "Cylindrée", value: fiche.engine.displacement },
                      { label: "Puissance", value: fiche.engine.power },
                      { label: "Couple", value: fiche.engine.torque },
                      { label: "Alimentation", value: fiche.engine.alimentation }
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
                      { label: "H. de selle", value: fiche.dimensions.seatHeight },
                      { label: "Poids (TPF)", value: fiche.dimensions.wetWeight },
                      { label: "Réservoir", value: fiche.dimensions.fuelCapacity },
                      { label: "Empattement", value: fiche.dimensions.wheelbase }
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
                            { label: "Cadre", val: fiche.chassis.frame },
                            { label: "Suspension AV", val: fiche.chassis.frontSuspension },
                            { label: "Suspension AR", val: fiche.chassis.rearSuspension },
                            { label: "Frein AV", val: fiche.chassis.frontBrake },
                            { label: "Frein AR", val: fiche.chassis.rearBrake },
                            { label: "Pneu AV", val: fiche.chassis.frontTire },
                            { label: "Pneu AR", val: fiche.chassis.rearTire }
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
              
              {fiche.introduction && (
                <p className="text-xl text-center text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto font-medium">{fiche.introduction}</p>
              )}

              <div className="bg-brand/5 border-2 border-brand/20 rounded-3xl p-8 text-center mb-12 shadow-inner">
                <h4 className="text-2xl font-bold mb-4">Préparez votre prochaine révision sans surprise.</h4>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
                    Comparez les garages proches de chez vous pour votre {fiche.modelName} et obtenez le meilleur service au prix juste.
                </p>
                <Button asChild size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs tracking-widest px-10 py-7 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <Link href={`/map?filter=service&search=${encodeURIComponent(fiche.brand)}`}>
                    🔘 Voir les garages autour de moi
                  </Link>
                </Button>
              </div>
              
              <div className="prose prose-brand max-w-none">
                  {renderContent(fiche.content || [])}
              </div>
            </div>
          </div>
          
          {similarFiches.length > 0 && (
            <div className="pt-24 border-t border-border/50">
              <h2 className="text-4xl font-black text-center mb-12 uppercase tracking-tighter">
                Découvrez d'autres modèles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {similarFiches.slice(0, 3).map(f => (
                  <Link key={f.modelId} href={`/fiches/${f.modelId}`} className="group block">
                    <Card className="h-full overflow-hidden transition-all duration-500 border-none shadow-lg hover:shadow-2xl hover:-translate-y-2 bg-card/50">
                      <div className="relative aspect-video overflow-hidden">
                        <Image 
                          src={f.imageUrl}
                          alt={f.modelName}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          data-ai-hint={f.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <CardHeader className="p-6">
                        <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-brand transition-colors">{f.modelName}</CardTitle>
                        <CardDescription className="font-bold text-muted-foreground">{f.engine.displacement}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

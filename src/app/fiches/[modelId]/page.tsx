'use client';

import { useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Gauge, Droplets, Wrench, ShieldCheck, Settings2 } from 'lucide-react';

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

type FicheContent = {
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'signature';
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
  maintenance?: { interval: string; cost: string; details: string }[];
  reliability?: string[];
}

const parseDisplacement = (displacement: string): number => {
  if (!displacement) return 0;
  const match = displacement.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};


export default function FicheTechniquePage() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.modelId as string;
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!content || content.length === 0) {
      return null;
    }

    return content.flatMap((block, index) => {
      const elements: React.ReactNode[] = [];
      
      if (block.type === 'heading') {
        elements.push(<h3 key={index} className="text-2xl font-bold font-serif mt-8 mb-4">{block.text}</h3>);
      } else if (block.type === 'list' && block.items) {
        elements.push(
          <ul key={index} className="list-disc list-inside space-y-2 my-4 pl-4 text-base">
            {block.items.map((item, i) => <li key={i} className="text-foreground/90" dangerouslySetInnerHTML={{ __html: item }} />)}
          </ul>
        );
      } else if (block.type === 'paragraph' && block.html) {
          elements.push(<p key={index} className="text-base text-foreground/90 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: block.html }} />);
      } else if (block.type === 'table' && block.headers && block.rows) {
        elements.push(
          <div key={index} className="my-6 overflow-x-auto">
             <Table>
              <TableHeader>
                <TableRow>
                  {block.headers.map((header: string, hIndex: number) => (
                    <TableHead key={hIndex} className="font-semibold">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {block.rows.map((row: string[], rIndex: number) => (
                  <TableRow key={rIndex}>
                    {row.map((cell: string, cIndex: number) => (
                      <TableCell key={cIndex} className={cIndex === 0 ? 'font-medium' : ''}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
        
        if (block.headers.includes('Prix moyen') || block.headers.includes('Coût moyen estimé')) {
           elements.push(
            <div key={`extra-${index}`} className="my-4 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Les tarifs peuvent varier selon l’atelier et la région. Comparez les professionnels autour de vous avant de prendre rendez-vous.</p>
              <Button asChild>
                <Link href={`/map?filter=service&search=${encodeURIComponent(fiche.brand)}`}>
                  🔘 Comparer les ateliers près de moi
                </Link>
              </Button>
            </div>
          );
        }

      } else if (block.type === 'signature' && block.imageUrl) {
        elements.push(
          <div key={index} className="flex justify-end items-center mt-[-3rem] sm:mt-[-4rem] mr-0 sm:mr-4">
            <p className="text-lg font-semibold text-foreground/90 relative z-10">{block.text}</p>
            <Image 
              src={block.imageUrl} 
              alt={block.alt || "Signature"} 
              width={140} 
              height={140}
              className="object-contain opacity-70 -rotate-[15deg] pointer-events-none -ml-16"
            />
          </div>
        );
      } else {
        elements.push(<p key={index} className="text-base text-foreground/90 leading-relaxed my-4">{block.text}</p>);
      }

      return elements;
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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/entretien" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'entretien
          </Link>

          <div className="space-y-8">
             <div className="relative w-full aspect-[2.5/1] rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={fiche.imageUrl}
                alt={fiche.modelName}
                fill
                className="object-cover"
                data-ai-hint={fiche.imageHint}
                priority
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               <div className="absolute bottom-0 left-0 p-6 text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight tracking-tight">
                    {fiche.modelName}
                </h1>
                <p className="text-xl md:text-2xl text-white/90">{fiche.year}</p>
               </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3"><Gauge className="h-6 w-6 text-accent" /> Moteur</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Type:</strong> {fiche.engine.type}</li>
                    <li><strong>Cylindrée:</strong> {fiche.engine.displacement}</li>
                    <li><strong>Puissance:</strong> {fiche.engine.power}</li>
                    <li><strong>Couple:</strong> {fiche.engine.torque}</li>
                    <li><strong>Alimentation:</strong> {fiche.engine.alimentation}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3"><Settings2 className="h-6 w-6 text-accent" /> Dimensions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li><strong>H. de selle:</strong> {fiche.dimensions.seatHeight}</li>
                    <li><strong>Poids (TPF):</strong> {fiche.dimensions.wetWeight}</li>
                    <li><strong>Réservoir:</strong> {fiche.dimensions.fuelCapacity}</li>
                    <li><strong>Empattement:</strong> {fiche.dimensions.wheelbase}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Droplets className="h-6 w-6 text-accent" /> Partie Cycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Élément</TableHead>
                        <TableHead>Spécification</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow><TableCell>Cadre</TableCell><TableCell>{fiche.chassis.frame}</TableCell></TableRow>
                      <TableRow><TableCell>Suspension AV</TableCell><TableCell>{fiche.chassis.frontSuspension}</TableCell></TableRow>
                       <TableRow><TableCell>Suspension AR</TableCell><TableCell>{fiche.chassis.rearSuspension}</TableCell></TableRow>
                      <TableRow><TableCell>Frein AV</TableCell><TableCell>{fiche.chassis.frontBrake}</TableCell></TableRow>
                      <TableRow><TableCell>Frein AR</TableCell><TableCell>{fiche.chassis.rearBrake}</TableCell></TableRow>
                      <TableRow><TableCell>Pneu AV</TableCell><TableCell>{fiche.chassis.frontTire}</TableCell></TableRow>
                      <TableRow><TableCell>Pneu AR</TableCell><TableCell>{fiche.chassis.rearTire}</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {fiche.content ? (
              <div className="pt-8">
                  <h2 className="text-4xl font-bold font-serif text-center mb-2">
                    Guide d'entretien
                  </h2>
                  {fiche.introduction && (
                    <p className="text-lg text-center text-muted-foreground leading-relaxed mb-8">{fiche.introduction}</p>
                  )}
                  <div className="text-center mb-8">
                    <p className="text-muted-foreground mb-4">
                        Préparez votre prochaine révision sans surprise. <br/>
                        Comparez les garages proches de chez vous pour votre {fiche.modelName}.
                    </p>
                    <Button asChild size="lg">
                      <Link href={`/map?filter=service&search=${encodeURIComponent(fiche.brand)}`}>
                        🔘 Voir les garages autour de moi
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                      {renderContent(fiche.content)}
                  </div>
              </div>
            ) : (
              <>
              {fiche.maintenance && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Wrench className="h-6 w-6 text-accent" /> Plan d'entretien & Coûts</CardTitle>
                    <CardDescription>Les coûts sont des estimations et peuvent varier selon le garage.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Intervalle</TableHead>
                            <TableHead>Coût estimé</TableHead>
                            <TableHead>Opérations principales</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fiche.maintenance.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.interval}</TableCell>
                              <TableCell>{item.cost}</TableCell>
                              <TableCell>{item.details}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
              {fiche.reliability && (
                <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-accent" /> Fiabilité & Points à surveiller</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        {fiche.reliability.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
              )}
              </>
            )}
          </div>
          
          {similarFiches.length > 0 && (
            <div className="pt-16">
              <h2 className="text-3xl font-bold font-serif text-center mb-8">
                Découvrez d'autres modèles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarFiches.map(f => (
                  <Link key={f.modelId} href={`/fiches/${f.modelId}`} className="group">
                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative aspect-video">
                        <Image 
                          src={f.imageUrl}
                          alt={f.modelName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          data-ai-hint={f.imageHint}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-accent group-hover:underline">{f.modelName}</CardTitle>
                        <CardDescription>{f.engine.displacement}</CardDescription>
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

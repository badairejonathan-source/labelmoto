
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

type FicheContent = {
  type: 'paragraph' | 'heading' | 'list' | 'table';
  text?: string;
  html?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
};

type FicheData = (typeof fichesData)[0];

interface FicheTechnique extends Omit<FicheData, 'maintenance' | 'reliability'> {
  introduction?: string;
  content?: FicheContent[];
  maintenance?: { interval: string; cost: string; details: string }[];
  reliability?: string[];
}


export default function FicheTechniquePage() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.modelId as string;
  const [searchTerm, setSearchTerm] = useState('');

  const fiche = fichesData.find((f) => f.modelId === modelId) as FicheTechnique | undefined;

  if (!fiche) {
    notFound();
  }

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

    return content.map((block, index) => {
      if (block.type === 'heading') {
        return <h3 key={index} className="text-2xl font-bold font-serif mt-8 mb-4">{block.text}</h3>;
      }
      if (block.type === 'list' && block.items) {
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 pl-4 text-base">
            {block.items.map((item, i) => <li key={i} className="text-foreground/90" dangerouslySetInnerHTML={{ __html: item }} />)}
          </ul>
        );
      }
      if (block.type === 'paragraph' && block.html) {
          return <p key={index} className="text-base text-foreground/90 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: block.html }} />;
      }
      if (block.type === 'table' && block.headers && block.rows) {
        return (
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
      }
      
      return <p key={index} className="text-base text-foreground/90 leading-relaxed my-4">{block.text}</p>;
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
          <Link href="/info/7" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'article sur l'entretien
          </Link>

          <div className="space-y-8">
             <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-8 shadow-lg">
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
        </div>
      </main>
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Map } from 'lucide-react';
import Link from 'next/link';

import Header from '@/components/app/header';
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

const article = {
    "title": "Entretien moto : intervalles, prix et conseils par modèle",
    "content": [
      {
        "type": "paragraph",
        "html": "Trouvez rapidement les <strong>intervalles d’entretien</strong>, le <strong>prix des révisions</strong> et les <strong>points de fiabilité</strong> de votre moto. Choisissez votre <strong>marque</strong> puis votre <strong>modèle</strong> pour accéder à sa fiche complète."
      },
      {
        "type": "heading",
        "text": "Modèles les plus recherchés"
      },
      {
        "type": "list",
        "items": [
          "<a href=\"/fiches/yamaha-mt-07-2021-plus\" class=\"text-brand underline hover:text-brand/80 font-bold\">Yamaha MT-07 A2</a>",
          "<a href=\"/fiches/kawasaki-z900\" class=\"text-brand underline hover:text-brand/80 font-bold\">Kawasaki Z900 A2 / Full</a>",
          "<a href=\"/fiches/honda-cb500-hornet\" class=\"text-brand underline hover:text-brand/80 font-bold\">Honda CB500 Hornet A2</a>",
          "<a href=\"/fiches/kawasaki-z650\" class=\"text-brand underline hover:text-brand/80 font-bold\">Kawasaki Z650 / Z650RS A2</a>",
          "<a href=\"/fiches/suzuki-gsx-8s\" class=\"text-brand underline hover:text-brand/80 font-bold\">Suzuki GSX-8S A2</a>",
          "<a href=\"/fiches/suzuki-sv650\" class=\"text-brand underline hover:text-brand/80 font-bold\">Suzuki SV650 A2</a>"
        ]
      },
      { "type": "heading", "text": "Trouver la fiche de votre moto" },
      { "type": "paragraph", "html": "<span class=\"text-xl font-bold\">BMW</span>" },
      { "type": "list", "items": ["<a href=\"/fiches/bmw-r1250-gs\" class=\"text-brand underline hover:text-brand/80\">R1250 GS</a>"] },
      { "type": "paragraph", "html": "<span class=\"text-xl font-bold\">Yamaha</span>" },
      { "type": "list", "items": ["<a href=\"/fiches/yamaha-mt-07-2021-plus\" class=\"text-brand underline hover:text-brand/80\">MT-07 A2 (2021+)</a>", "<a href=\"/fiches/yamaha-mt-03\" class=\"text-brand underline hover:text-brand/80\">MT-03 A2</a>", "<a href=\"/fiches/yamaha-tracer-7\" class=\"text-brand underline hover:text-brand/80\">Tracer 7 A2</a>", "<a href=\"/fiches/yamaha-r7\" class=\"text-brand underline hover:text-brand/80\">R7 A2</a>", "<a href=\"/fiches/yamaha-xsr700\" class=\"text-brand underline hover:text-brand/80\">XSR700 A2</a>"] },
      { "type": "paragraph", "html": "<span class=\"text-xl font-bold\">Honda</span>" },
      { "type": "list", "items": ["<a href=\"/fiches/honda-cb500-hornet\" class=\"text-brand underline hover:text-brand/80\">CB500 Hornet A2</a>", "<a href=\"/fiches/honda-nx500\" class=\"text-brand underline hover:text-brand/80\">NX500 / CB500X A2</a>", "<a href=\"/fiches/honda-cbr500r\" class=\"text-brand underline hover:text-brand/80\">CBR500R A2</a>"] },
      { "type": "paragraph", "html": "<span class=\"text-xl font-bold\">Kawasaki</span>" },
      { "type": "list", "items": ["<a href=\"/fiches/kawasaki-z900\" class=\"text-brand underline hover:text-brand/80\">Z900 A2 / Full</a>", "<a href=\"/fiches/kawasaki-z900rs\" class=\"text-brand underline hover:text-brand/80\">Z900RS A2 / Full</a>", "<a href=\"/fiches/kawasaki-z650\" class=\"text-brand underline hover:text-brand/80\">Z650 / Z650RS A2</a>"] },
      { "type": "paragraph", "html": "<span class=\"text-xl font-bold\">Suzuki</span>" },
      { "type": "list", "items": ["<a href=\"/fiches/suzuki-gsx-8s\" class=\"text-brand underline hover:text-brand/80\">GSX-8S A2</a>", "<a href=\"/fiches/suzuki-sv650\" class=\"text-brand underline hover:text-brand/80\">SV650 A2</a>"] },
      { "type": "paragraph", "html": "<em>De nouveaux modèles seront ajoutés régulièrement.</em>" },
      { "type": "heading", "text": "Comment fonctionne l’entretien d’une moto ?" },
      { "type": "paragraph", "text": "Une moto demande un suivi plus fréquent qu’une voiture. Le moteur tourne plus vite, les pièces sont plus exposées et les organes de sécurité comme les freins, pneus et transmission travaillent davantage." },
      { "type": "heading", "text": "1. Les révisions périodiques" },
      { "type": "list", "items": ["<strong>1 000 km</strong> → révision de rodage", "<strong>10 000 km</strong> → entretien courant", "<strong>20 000 km</strong> → contrôle mécanique plus complet", "<strong>40 000 km</strong> → grosse révision"] },
      { "type": "paragraph", "text": "Même si vous roulez peu, une vidange annuelle reste souvent recommandée." },
      { "type": "heading", "text": "2. Les consommables" },
      { "type": "table", "headers": ["Pièce", "Durée moyenne"], "rows": [["Pneus", "8 000 à 15 000 km"], ["Kit chaîne", "20 000 à 30 000 km"], ["Plaquettes", "10 000 à 20 000 km"], ["Batterie", "3 à 5 ans"]] },
      { "type": "paragraph", "html": "👉 Pour aller plus loin, consulte aussi notre guide sur le <strong>coût réel d’une moto par mois</strong>." }
    ]
} as const;

export default function EntretienPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

  const renderContent = () => {
    return article.content.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return <h2 key={index} className="text-2xl font-bold mt-12 mb-6 text-foreground border-b pb-2">{block.text}</h2>;
        case 'list':
          return (
            <ul key={index} className="list-disc list-inside space-y-2 my-4 ml-4">
              {block.items?.map((item, i) => <li key={i} className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />)}
            </ul>
          );
        case 'paragraph':
          if (block.html) {
            return <p key={index} className="text-base leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: block.html }} />;
          }
          return <p key={index} className="text-base leading-relaxed my-4">{block.text}</p>;
        case 'table':
          return (
            <div key={index} className="my-6 overflow-x-auto rounded-lg border shadow-sm">
              <Table className="min-w-full text-sm">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    {block.headers?.map((header: string, hIndex: number) => (
                      <TableHead key={hIndex} className="font-bold text-foreground py-4">{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {block.rows?.map((row: (string | number)[], rIndex: number) => (
                    <TableRow key={rIndex}>
                      {row.map((cell: (string | number), cIndex: number) => (
                        <TableCell key={cIndex} className={cn("py-4", cIndex === 0 ? 'font-bold' : '')}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        placeholderText="Recherche par nom, ville, departement"
      />
      <div className="fixed inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-hidden">
        <Image
          src="/images/logo-moto.png?v=6"
          alt="Label Moto Watermark"
          width={800}
          height={256}
          className="opacity-[0.10] rotate-[-15deg] scale-150"
        />
      </div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-bold">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8">
              <article>
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter text-foreground mb-12 uppercase">
                  {article.title}
                </h1>
                <div className="space-y-4">
                  {renderContent()}
                </div>
              </article>
            </div>

            <aside className="md:col-span-4 relative">
                <div className="md:sticky md:top-28 space-y-6">
                    <Card className="overflow-hidden shadow-xl border-2 border-brand/20 bg-card/50 backdrop-blur-sm rounded-3xl">
                        <CardHeader className="p-6">
                            <CardTitle className="flex items-center gap-3 text-brand text-xl font-black uppercase tracking-widest">
                                <Map className="h-6 w-6"/>
                                Trouver un pro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <Link href="/map" className="block group rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                              <Image 
                                  src="/images/apercucartezoom.png"
                                  alt="Aperçu de la carte"
                                  width={400}
                                  height={300}
                                  className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                              />
                            </Link>
                            <p className="text-muted-foreground text-sm mt-6 font-medium leading-relaxed">
                                Accédez à notre carte interactive pour trouver les meilleures concessions et ateliers moto près de chez vous.
                            </p>
                        </CardContent>
                        <CardFooter className="px-6 pb-8">
                            <Button asChild className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs tracking-widest py-6 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
                                <Link href="/map">Voir la carte interactive</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

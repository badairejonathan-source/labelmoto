
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
import { Badge } from '@/components/ui/badge';

type ArticleContent = {
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'signature';
  text?: string;
  html?: string;
  items?: string[];
  headers?: string[];
  rows?: (string | number)[][];
  imageUrl?: string;
  alt?: string;
};

const article = {
    "id": "7",
    "title": "Entretien moto : intervalles et prix par modèle",
    "description": "Trouve rapidement les intervalles d’entretien et le coût des révisions pour ta moto.",
    "author": "L'équipe Label Moto",
    "date": "29 juillet 2024",
    "readingTime": "4 min de lecture",
    "imageUrl": "https://picsum.photos/seed/article-maintenance/1200/600",
    "imageHint": "motorcycle maintenance",
    "content": [
      {
        "type": "paragraph",
        "text": "Trouve rapidement les intervalles d’entretien et le coût des révisions pour ta moto. Sélectionne ta marque puis ton modèle pour accéder à sa fiche complète."
      },
      {
        "type": "heading",
        "text": "Choisir sa moto"
      },
      {
        "type": "paragraph",
        "html": "<strong>BMW</strong>"
      },
      {
        "type": "list",
        "items": [
          "<a href=\"/fiches/bmw-r1250-gs\" class=\"text-brand underline hover:text-brand/80\">R1250 GS</a>"
        ]
      },
      {
        "type": "paragraph",
        "html": "<strong>Yamaha</strong>"
      },
      {
        "type": "list",
        "items": [
          "<a href=\"/fiches/yamaha-mt-07\" class=\"text-brand underline hover:text-brand/80\">MT-07</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>",
          "<a href=\"/fiches/yamaha-mt-03\" class=\"text-brand underline hover:text-brand/80\">MT-03</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>",
          "<a href=\"/fiches/yamaha-tracer-7\" class=\"text-brand underline hover:text-brand/80\">Tracer 7</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>",
          "<a href=\"/fiches/yamaha-r7\" class=\"text-brand underline hover:text-brand/80\">R7</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>",
          "<a href=\"/fiches/yamaha-xsr700\" class=\"text-brand underline hover:text-brand/80\">XSR700</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>"
        ]
      },
      {
        "type": "paragraph",
        "html": "<strong>Honda</strong>"
      },
      {
        "type": "list",
        "items": [
          "<a href=\"/fiches/honda-cb500-hornet\" class=\"text-brand underline hover:text-brand/80\">CB500F / CB500 Hornet</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>",
          "<a href=\"/fiches/honda-nx500\" class=\"text-brand underline hover:text-brand/80\">NX500 / CB500X</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>", 
          "<a href=\"/fiches/honda-cbr500r\" class=\"text-brand underline hover:text-brand/80\">CBR500R</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>",
          "<a href=\"/fiches/honda-cb650r\" class=\"text-brand underline hover:text-brand/80\">CB650R</a> <span class='text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold ml-1'>Éligible A2</span>",
          "<a href=\"/fiches/honda-xl750-transalp\" class=\"text-brand underline hover:text-brand/80\">XL750 Transalp</a> <span class='text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold ml-1'>Éligible A2</span>",
          "<a href=\"/fiches/honda-cb125r\" class=\"text-brand underline hover:text-brand/80\">CB125R</a> <span class='text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold ml-1'>A1 / B / A2</span>"
        ]
      },
      {
        "type": "paragraph",
        "html": "<strong>Kawasaki</strong>"
      },
      {
        "type": "list",
        "items": [
          "<a href=\"/fiches/kawasaki-z650\" class=\"text-brand underline hover:text-brand/80\">Z650 / Z650RS</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>",
          "<a href=\"/fiches/kawasaki-ninja-650\" class=\"text-brand underline hover:text-brand/80\">Ninja 650</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>"
        ]
      },
      {
        "type": "paragraph",
        "html": "<strong>Suzuki</strong>"
      },
      {
        "type": "list",
        "items": [
          "<a href=\"/fiches/suzuki-sv650\" class=\"text-brand underline hover:text-brand/80\">SV650</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>",
          "<a href=\"/fiches/suzuki-v-strom-650\" class=\"text-brand underline hover:text-brand/80\">V-Strom 650</a> <span class='text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-bold ml-1'>A2</span>"
        ]
      },
      {
        "type": "paragraph",
        "text": "(De nouveaux modèles seront ajoutés régulièrement)"
      },
      {
        "type": "heading",
        "text": "Comment fonctionne l’entretien d’une moto ?"
      },
      {
        "type": "heading",
        "text": "Conclusion"
      },
      {
        "type": "paragraph",
        "text": "Un bon entretien protège surtout ton budget. Choisis ta moto ci-dessus pour accéder à sa fiche détaillée."
      },
      {
        "type": "signature",
        "text": "L'équipe Label Moto",
        "imageUrl": "/images/Stamp-LM.png?v=3",
        "alt": "Cachet Label Moto"
      }
    ]
} as const;

export default function EntretienPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/info?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

  const renderContent = () => {
    if (!article.content || article.content.length === 0) {
      return <p className="text-lg text-muted-foreground">Contenu de l'article à venir...</p>;
    }

    return article.content.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return <h2 key={index} className="text-3xl font-bold mt-12 mb-6 text-foreground text-center border-y border-foreground/20 py-2">{block.text}</h2>;
        
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
            <div key={index} className="my-6 overflow-x-auto">
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    {block.headers?.map((header: string, hIndex: number) => (
                      <TableHead key={hIndex} className="font-semibold">{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {block.rows?.map((row: (string | number)[], rIndex: number) => (
                    <TableRow key={rIndex}>
                      {row.map((cell: (string | number), cIndex: number) => (
                        <TableCell key={cIndex} className={cIndex === 0 ? 'font-medium' : ''}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        
        case 'signature':
          if (block.imageUrl) {
            return (
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
            )
          }
          return null;

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
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <article>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground mb-8 text-center">
                  {article.title}
                </h1>
                
                <div className="space-y-4">
                  {renderContent()}
                </div>
              </article>
            </div>
            <aside className="relative mt-12 lg:mt-0">
                <div className="lg:sticky lg:top-28 space-y-6">
                    <Card className="overflow-hidden shadow-lg border-2 border-primary/20 max-w-sm mx-auto lg:max-w-none">
                        <CardHeader className="p-3 lg:p-6">
                            <CardTitle className="flex items-center gap-2 text-primary text-base lg:text-xl">
                                <Map className="h-4 w-4 lg:h-5 w-5"/>
                                Trouver une concession
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 lg:p-6 lg:pt-0">
                            <Link href="/map" className="block group rounded-lg overflow-hidden border">
                              <Image 
                                  src="/images/apercucartezoom.png"
                                  alt="Aperçu de la carte"
                                  width={400}
                                  height={300}
                                  className="object-cover w-full h-40 lg:h-auto transition-transform duration-300 group-hover:scale-105"
                              />
                            </Link>
                            <p className="text-muted-foreground text-sm mt-4 hidden lg:block">
                                Accédez à notre carte interactive pour trouver les meilleures concessions et ateliers moto près de chez vous.
                            </p>
                        </CardContent>
                        <CardFooter className="p-3 pt-0 lg:p-6 lg:pt-0">
                            <Badge variant="brand" className="w-full justify-center py-2 mb-2 text-xs font-bold">Focus A2 disponible</Badge>
                            <Button asChild className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-xs lg:text-base py-3 lg:py-5 rounded-full shadow-lg">
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
    
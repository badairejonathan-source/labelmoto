
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
        "html": "Trouvez rapidement les <strong>intervalles d’entretien</strong>, le <strong>prix des révisions</strong> et les <strong>points de fiabilité</strong> de votre moto. Choisissez votre <strong>marque</strong> puis votre <strong>modèle</strong> pour accéder à sa fiche complète, récupérée en temps réel depuis notre base de données Firestore."
      },
      {
        "type": "heading",
        "text": "Modèles disponibles par marque"
      },
      { "type": "paragraph", "html": "<span class=\"text-xl font-black text-brand uppercase tracking-tighter\">Honda</span>" },
      { "type": "list", "items": [
          "<a href=\"/fiches/honda-cb125r-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">CB125R (2021+)</a>",
          "<a href=\"/fiches/honda-cb500f-2022-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">CB500F A2 (2022+)</a>",
          "<a href=\"/fiches/honda-cb500-hornet-2024-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">CB500 Hornet A2 (2024+)</a>",
          "<a href=\"/fiches/honda-cb750-hornet-2023-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">CB750 Hornet (2023+)</a>",
          "<a href=\"/fiches/honda-xl750-transalp-2023-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">XL750 Transalp (2023+)</a>",
          "<a href=\"/fiches/honda-nt1100-2022-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">NT1100 (2022+)</a>",
          "<a href=\"/fiches/honda-crf1100l-2020-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">CRF1100L Africa Twin (2020+)</a>"
      ] },
      { "type": "paragraph", "html": "<span class=\"text-xl font-black text-brand uppercase tracking-tighter\">Yamaha</span>" },
      { "type": "list", "items": [
          "<a href=\"/fiches/yamaha-mt-07-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">MT-07 A2 (2021+)</a>",
          "<a href=\"/fiches/yamaha-tracer-7-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">Tracer 7 A2 (2021+)</a>",
          "<a href=\"/fiches/yamaha-xsr700-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">XSR700 A2 (2021+)</a>",
          "<a href=\"/fiches/yamaha-r7-2022-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">YZF-R7 A2 (2022+)</a>",
          "<a href=\"/fiches/yamaha-tenere-700-2019-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">Ténéré 700 (2019+)</a>",
          "<a href=\"/fiches/yamaha-mt-09-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">MT-09 (2021+)</a>"
      ] },
      { "type": "paragraph", "html": "<span class=\"text-xl font-black text-brand uppercase tracking-tighter\">BMW</span>" },
      { "type": "list", "items": [
          "<a href=\"/fiches/bmw-r1250gs-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">R 1250 GS (2021+)</a>",
          "<a href=\"/fiches/bmw-f750-850-gs-2018-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">F 750 GS / F 850 GS (2018+)</a>",
          "<a href=\"/fiches/bmw-f900r-2020-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">F 900 R (2020+)</a>",
          "<a href=\"/fiches/bmw-s1000rr-2019-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">S 1000 RR (2019+)</a>",
          "<a href=\"/fiches/bmw-g310r-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">G 310 R A2 (2021+)</a>"
      ] },
      { "type": "paragraph", "html": "<span class=\"text-xl font-black text-brand uppercase tracking-tighter\">Suzuki</span>" },
      { "type": "list", "items": [
          "<a href=\"/fiches/suzuki-v-strom-650-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">V-Strom 650 (2021+)</a>",
          "<a href=\"/fiches/suzuki-sv650-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">SV650 A2 (2021+)</a>",
          "<a href=\"/fiches/suzuki-gsx-8s-2023-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">GSX-8S (2023+)</a>"
      ] },
      { "type": "paragraph", "html": "<span class=\"text-xl font-black text-brand uppercase tracking-tighter\">Kawasaki</span>" },
      { "type": "list", "items": [
          "<a href=\"/fiches/kawasaki-z650-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">Z650 A2 (2021+)</a>",
          "<a href=\"/fiches/kawasaki-z900-2021-plus\" class=\"text-foreground hover:text-brand font-bold transition-colors\">Z900 A2 (2021+)</a>"
      ] },
      { "type": "paragraph", "html": "<div class=\"p-4 bg-muted/50 rounded-xl border-l-4 border-brand mt-8\"><p class=\"text-sm italic\">De nouveaux modèles sont ajoutés régulièrement. Si votre modèle n'est pas encore listé, revenez bientôt !</p></div>" },
      { "type": "heading", "text": "Pourquoi suivre l'entretien ?" },
      { "type": "paragraph", "text": "Une moto demande un suivi plus rigoureux qu’une voiture. Le moteur tourne à des régimes plus élevés, les consommables s'usent plus vite et les organes de sécurité sont vitaux. Respecter les préconisations constructeur garantit la longévité de votre machine et sa valeur à la revente." },
      { "type": "heading", "text": "Intervalles types" },
      { "type": "table", "headers": ["Élément", "Fréquence conseillée"], "rows": [["Vidange moteur", "Tous les 10 000 km ou 1 an"], ["Kit chaîne", "Graissage tous les 500 km"], ["Pneus", "Selon usure (moyenne 10 000 km)"], ["Jeu aux soupapes", "Tous les 24 000 ou 40 000 km"]] },
      { "type": "paragraph", "html": "👉 Pour trouver un professionnel compétent pour votre révision, utilisez notre carte interactive." }
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
          return <h2 key={index} className="text-2xl font-black mt-12 mb-6 text-foreground border-b-2 border-brand/20 pb-2 uppercase tracking-tight">{block.text}</h2>;
        case 'list':
          return (
            <ul key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 my-6">
              {block.items?.map((item, i) => (
                <li key={i} className="flex items-center gap-2 group">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand group-hover:scale-150 transition-transform" />
                  <div className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          );
        case 'paragraph':
          if (block.html) {
            return <div key={index} className="text-base leading-relaxed my-4 text-foreground/80" dangerouslySetInnerHTML={{ __html: block.html }} />;
          }
          return <p key={index} className="text-base leading-relaxed my-4 text-foreground/80">{block.text}</p>;
        case 'table':
          return (
            <div key={index} className="my-6 overflow-x-auto rounded-xl border-2 border-muted shadow-sm">
              <Table className="min-w-full text-sm">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    {block.headers?.map((header: string, hIndex: number) => (
                      <TableHead key={hIndex} className="font-black text-foreground py-4 uppercase tracking-widest text-[10px]">{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {block.rows?.map((row: (string | number)[], rIndex: number) => (
                    <TableRow key={rIndex} className="hover:bg-muted/30">
                      {row.map((cell: (string | number), cIndex: number) => (
                        <TableCell key={cIndex} className={cn("py-4", cIndex === 0 ? 'font-bold text-foreground' : 'text-muted-foreground')}>{cell}</TableCell>
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
        placeholderText="Recherche par marque, modèle..."
      />
      <div className="fixed inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-hidden">
        <Image
          src="/images/logo-moto.png?v=6"
          alt="Label Moto Watermark"
          width={800}
          height={256}
          className="opacity-[0.05] rotate-[-15deg] scale-150"
        />
      </div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand font-black uppercase text-xs tracking-widest transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <article>
                <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter text-foreground mb-8 uppercase">
                  {article.title}
                </h1>
                <div className="space-y-4">
                  {renderContent()}
                </div>
              </article>
            </div>

            <aside className="lg:col-span-4 relative">
                <div className="md:sticky md:top-28 space-y-6">
                    <Card className="overflow-hidden shadow-2xl border-none bg-card/50 backdrop-blur-md rounded-3xl ring-1 ring-white/20">
                        <CardHeader className="p-6 bg-brand text-brand-foreground">
                            <CardTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-widest">
                                <Map className="h-6 w-6"/>
                                Trouver un pro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Link href="/map" className="block group rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                              <Image 
                                  src="/images/apercucartezoom.png"
                                  alt="Aperçu de la carte"
                                  width={400}
                                  height={300}
                                  className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110"
                              />
                            </Link>
                            <p className="text-muted-foreground text-sm mt-6 font-medium leading-relaxed">
                                Comparez les ateliers et concessions pour votre prochaine révision directement sur notre carte interactive.
                            </p>
                        </CardContent>
                        <CardFooter className="px-6 pb-8">
                            <Button asChild className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-black uppercase text-xs tracking-widest py-6 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95">
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

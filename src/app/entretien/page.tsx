'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Map, Wrench, Info, CheckCircle2, ChevronRight } from 'lucide-react';
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

const brandsData = [
  {
    name: "BMW",
    models: [
      { id: "bmw-f750-gs-f850-gs-2018-plus", label: "F 750 GS / F 850 GS", tags: ["A2 / Full"] },
      { id: "bmw-f900r-2020-plus", label: "F 900 R", tags: ["A2 / Full"] },
      { id: "bmw-r1250-gs-r1300-gs-2019-plus", label: "R 1250 GS / R 1300 GS" },
      { id: "bmw-g310r-2021-plus", label: "G 310 R", tags: ["A2"] },
    ]
  },
  {
    name: "Honda",
    models: [
      { id: "honda-cb1000-hornet-2025-plus", label: "CB1000 Hornet (2025+)" },
      { id: "honda-cb500f-2022-plus", label: "CB500F", tags: ["A2"] },
      { id: "honda-cb650r-2020-plus", label: "CB650R", tags: ["A2 / Full"] },
      { id: "honda-cb750-hornet-2023-plus", label: "CB750 Hornet (2023+)" },
      { id: "honda-cbr500r-2022-plus", label: "CBR500R", tags: ["A2"] },
      { id: "honda-nx500-2024-plus", label: "NX500", tags: ["A2"] },
      { id: "honda-xl750-transalp-2023-plus", label: "XL750 Transalp (2023+)" },
    ]
  },
  {
    name: "Kawasaki",
    models: [
      { id: "kawasaki-z900-2020-plus", label: "Z900", tags: ["A2 / Full"] },
      { id: "kawasaki-z650-2020-plus", label: "Z650", tags: ["A2"] },
      { id: "kawasaki-er6n-2012-plus", label: "ER-6n (2012+)" },
      { id: "kawasaki-versys-650-2022-plus", label: "Versys 650 (2022+)" },
    ]
  },
  {
    name: "Suzuki",
    models: [
      { id: "suzuki-gsx-8s-2023-plus", label: "GSX-8S", tags: ["A2 / Full"] },
      { id: "suzuki-sv650-2016-plus", label: "SV650", tags: ["A2 / Full"] },
      { id: "suzuki-v-strom-650-2017-plus", label: "V-Strom 650 (2017+)" },
    ]
  },
  {
    name: "Yamaha",
    models: [
      { id: "yamaha-mt-03-2020-plus", label: "MT-03", tags: ["A2"] },
      { id: "yamaha-mt-07-2021-plus", label: "MT-07", tags: ["A2 / Full"] },
      { id: "yamaha-tracer-7-2021-plus", label: "Tracer 7", tags: ["A2 / Full"] },
      { id: "yamaha-xsr700-2021-plus", label: "XSR700", tags: ["A2 / Full"] },
      { id: "yamaha-r7-2022-plus", label: "YZF-R7", tags: ["A2 / Full"] },
    ]
  }
];

const articleContent = {
  title: "Entretien moto : intervalles, prix et conseils par modèle",
  intro: "Trouvez rapidement les intervalles d’entretien, le prix des révisions et les points de fiabilité de votre moto. Un suivi rigoureux garantit la longévité de votre machine et sa valeur à la revente.",
  sections: [
    {
      title: "Pourquoi suivre l'entretien ?",
      text: "Une moto demande un suivi plus rigoureux qu’une voiture. Le moteur tourne à des régimes plus élevés, les consommables s'usent plus vite et les organes de sécurité sont vitaux. Respecter les préconisations constructeur est essentiel pour votre sécurité."
    },
    {
      title: "Intervalles types de maintenance",
      table: {
        headers: ["Élément", "Fréquence conseillée"],
        rows: [
          ["Vidange moteur", "Tous les 10 000 km ou 1 an"],
          ["Kit chaîne", "Graissage tous les 500 km"],
          ["Pneus", "Selon usure (moyenne 10 000 km)"],
          ["Jeu aux soupapes", "Tous les 24 000 ou 40 000 km"]
        ]
      }
    }
  ]
};

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
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand font-black uppercase text-xs tracking-widest transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter text-foreground mb-4 uppercase">
              Catalogue des Fiches Techniques
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-3xl">
              Accédez aux guides d'entretien complets et aux spécifications techniques officielles pour plus de 20 modèles phares.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Column: Sheets Grid */}
            <div className="lg:col-span-8 space-y-12">
              {brandsData.map((brand) => (
                <section key={brand.name}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-black text-brand uppercase tracking-tighter">{brand.name}</h2>
                    <div className="h-[2px] flex-1 bg-brand/10" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {brand.models.map((model) => (
                      <Link 
                        key={model.id} 
                        href={`/fiches/${model.id}`}
                        className="group flex items-center justify-between p-4 bg-card hover:bg-brand/5 border border-border/50 hover:border-brand/30 rounded-xl transition-all shadow-sm"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-foreground group-hover:text-brand transition-colors">{model.label}</span>
                          {model.tags && (
                            <div className="flex gap-1">
                              {model.tags.map(tag => (
                                <span key={tag} className="text-[9px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-brand group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </section>
              ))}

              {/* Informative Article Section */}
              <div className="pt-16 border-t border-border/50">
                <article className="prose prose-neutral dark:prose-invert max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="h-8 w-8 text-brand" />
                    <h2 className="text-3xl font-black uppercase tracking-tight m-0">{articleContent.title}</h2>
                  </div>
                  <p className="text-lg leading-relaxed text-muted-foreground mb-12 italic border-l-4 border-brand pl-6">
                    {articleContent.intro}
                  </p>

                  <div className="space-y-12">
                    {articleContent.sections.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xl font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-brand" />
                          {section.title}
                        </h3>
                        {section.text && <p className="text-base text-foreground/80 leading-relaxed mb-6">{section.text}</p>}
                        {section.table && (
                          <div className="my-6 overflow-x-auto rounded-xl border-2 border-muted shadow-sm">
                            <Table>
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  {section.table.headers.map((h, i) => (
                                    <TableHead key={i} className="font-black text-foreground py-4 uppercase tracking-widest text-[10px]">{h}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {section.table.rows.map((row, ri) => (
                                  <TableRow key={ri} className="hover:bg-muted/30">
                                    {row.map((cell, ci) => (
                                      <TableCell key={ci} className={cn("py-4", ci === 0 ? 'font-bold' : 'text-muted-foreground')}>{cell}</TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>

            {/* Sidebar: Map CTA */}
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

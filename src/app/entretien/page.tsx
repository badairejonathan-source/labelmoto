'use client';

import { useState } from 'react';
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
        "html": "<strong>Yamaha</strong>"
      },
      {
        "type": "list",
        "items": [
          "<a href=\"/fiches/yamaha-mt-07\" class=\"text-brand underline hover:text-brand/80\">MT-07</a>",
          "<a href=\"/fiches/yamaha-tracer-7\" class=\"text-brand underline hover:text-brand/80\">Tracer 7</a>",
          "R7",
          "XSR700"
        ]
      },
      {
        "type": "paragraph",
        "html": "<strong>Honda</strong>"
      },
      {
        "type": "list",
        "items": ["<a href=\"/fiches/honda-cb500-hornet\" class=\"text-brand underline hover:text-brand/80\">CB500 Hornet / CB500F</a>", "CBR500R", "NX500"]
      },
      {
        "type": "paragraph",
        "html": "<strong>Kawasaki</strong>"
      },
      {
        "type": "list",
        "items": ["<a href=\"/fiches/kawasaki-z650\" class=\"text-brand underline hover:text-brand/80\">Z650</a>", "Ninja 650"]
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
        "type": "paragraph",
        "text": "Une moto demande un suivi plus fréquent qu’une voiture. Le moteur tourne plus vite et les éléments de sécurité sont plus sollicités. L’entretien repose sur trois éléments principaux."
      },
      {
        "type": "paragraph",
        "html": "<strong>Les révisions périodiques</strong>"
      },
      {
        "type": "list",
        "items": [
          "1 000 km → révision de rodage",
          "10 000 km → entretien courant",
          "20 000 km → contrôle mécanique important",
          "40 000 km → grosse révision"
        ]
      },
      {
        "type": "paragraph",
        "text": "Même avec peu de kilomètres, une vidange annuelle reste recommandée."
      },
      {
        "type": "paragraph",
        "html": "<strong>Les consommables</strong>"
      },
      {
        "type": "table",
        "headers": ["Pièce", "Durée moyenne"],
        "rows": [
          ["Pneus", "8 000 à 15 000 km"],
          ["Kit chaîne", "20 000 à 30 000 km"],
          ["Plaquettes", "10 000 à 20 000 km"],
          ["Batterie", "3 à 5 ans"]
        ]
      },
       {
        "type": "paragraph",
        "text": "Un mauvais suivi multiplie souvent les réparations."
      },
      {
        "type": "paragraph",
        "html": "<strong>Les contrôles de sécurité</strong>"
      },
      {
        "type": "paragraph",
        "text": "Pression pneus, tension chaîne et niveaux permettent d’éviter la majorité des pannes."
      },
      {
        "type": "heading",
        "text": "Combien coûte l’entretien d’une moto ?"
      },
      {
        "type": "table",
        "headers": ["Usage", "Budget annuel"],
        "rows": [
          ["Occasionnel", "200 à 400 €"],
          ["Quotidien", "400 à 800 €"],
          ["Gros rouleur", "800 € et +"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Le coût dépend surtout du modèle, du style de conduite et du suivi."
      },
      {
        "type": "paragraph",
        "html": "A2 👉 Pour estimer ton budget global, consulte aussi <a href=\"/info/4\" class=\"text-brand underline hover:text-brand/80\">notre guide sur le coût réel d’une moto par mois</a>."
      },
      {
        "type": "heading",
        "text": "Pourquoi respecter l’entretien constructeur ?"
      },
      {
        "type": "list",
        "items": [
          "éviter les pannes coûteuses",
          "augmenter la durée de vie moteur",
          "faciliter la revente",
          "rouler en sécurité"
        ]
      },
      {
        "type": "paragraph",
        "text": "Une moto bien entretenue dépasse souvent 80 000 km sans problème majeur."
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
          return <h2 key={index} className="text-3xl font-bold font-serif mt-12 mb-6 text-foreground text-center border-y border-foreground/20 py-2">{block.text}</h2>;
        
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
        placeholderText="Rechercher une fiche d'entretien..."
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <article>
                <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight tracking-tight text-foreground mb-8">
                  {article.title}
                </h1>
                
                <div className="space-y-4">
                  {renderContent()}
                </div>
              </article>
            </div>
            <aside className="hidden lg:block relative">
                <div className="sticky top-28 space-y-6">
                    <Card className="overflow-hidden shadow-lg border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Map className="h-5 w-5"/>
                                Trouver une concession
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Link href="/map" className="block group rounded-lg overflow-hidden border">
                              <Image 
                                  src="/images/apercucartezoom.png"
                                  alt="Aperçu de la carte"
                                  width={400}
                                  height={300}
                                  className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                              />
                            </Link>
                            <p className="text-muted-foreground text-sm mt-4">
                                Accédez à notre carte interactive pour trouver les meilleures concessions et ateliers moto près de chez vous.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-base py-5 rounded-full shadow-lg">
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import Header from '@/components/app/header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    "title": "Entretien moto : intervalles, prix et conseils par modèle",
    "description": "Entretenir sa moto, ce n’est pas seulement éviter les pannes. C’est aussi préserver le plaisir de conduite, la sécurité et la valeur de revente.",
    "author": "L'équipe Label Moto",
    "date": "29 juillet 2024",
    "readingTime": "7 min de lecture",
    "imageUrl": "https://picsum.photos/seed/article-maintenance/1200/600",
    "imageHint": "motorcycle maintenance",
    "content": [
      {
        "type": "paragraph",
        "text": "Entretenir sa moto, ce n’est pas seulement éviter les pannes. C’est aussi préserver le plaisir de conduite, la sécurité et la valeur de revente. Pourtant, beaucoup de motards — surtout débutants — ne savent pas exactement :"
      },
      {
        "type": "list",
        "items": [
          "quand faire une révision",
          "ce que vérifie réellement un garage",
          "combien prévoir dans le budget annuel"
        ]
      },
      {
        "type": "paragraph",
        "text": "Résultat : soit ils dépensent trop… soit ils attendent trop longtemps."
      },
      {
        "type": "paragraph",
        "text": "Dans cette rubrique, tu trouveras une fiche d’entretien complète pour chaque modèle, avec les intervalles constructeur, les coûts moyens et les points de fiabilité à surveiller."
      },
      {
        "type": "heading",
        "text": "Comment fonctionne l’entretien d’une moto ?"
      },
      {
        "type": "paragraph",
        "text": "Contrairement à une voiture, une moto demande un suivi plus fréquent. Le moteur tourne plus vite, les pièces sont plus exposées et les éléments de sécurité (freins, pneus, transmission) travaillent davantage."
      },
      {
        "type": "paragraph",
        "text": "L’entretien repose sur trois éléments :"
      },
      {
        "type": "paragraph",
        "text": "1. Les révisions périodiques"
      },
      {
        "type": "paragraph",
        "text": "Elles sont prévues par le constructeur selon le kilométrage. En général :"
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
        "text": "Même si tu roules peu, une vidange annuelle reste recommandée."
      },
      {
        "type": "paragraph",
        "text": "2. Les consommables"
      },
      {
        "type": "paragraph",
        "text": "Certaines pièces s’usent naturellement :"
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
        "text": "Un mauvais entretien multiplie souvent la facture par deux."
      },
      {
        "type": "paragraph",
        "text": "3. Les contrôles de sécurité"
      },
      {
        "type": "paragraph",
        "text": "Pression pneus, tension chaîne, niveaux… Ce sont de petites vérifications régulières qui évitent les grosses réparations."
      },
      {
        "type": "heading",
        "text": "Combien coûte l’entretien d’une moto ?"
      },
      {
        "type": "paragraph",
        "text": "En moyenne, un motard dépense par an :"
      },
      {
        "type": "table",
        "headers": ["Type d’usage", "Budget annuel"],
        "rows": [
          ["Utilisation occasionnelle", "200 à 400 €"],
          ["Usage quotidien", "400 à 800 €"],
          ["Gros rouleur", "800 € et +"]
        ]
      },
      {
        "type": "paragraph",
        "text": "La différence vient surtout :"
      },
      {
        "type": "list",
        "items": [
          "du modèle",
          "du style de conduite",
          "du suivi régulier"
        ]
      },
      {
        "type": "paragraph",
        "html": "👉 Pour estimer ton budget global, consulte aussi <a href=\"/info/4\" class=\"text-accent underline hover:text-accent/80\">notre guide sur le coût réel d’une moto par mois</a>."
      },
      {
        "type": "heading",
        "text": "Trouver la fiche d’entretien de ta moto"
      },
      {
        "type": "paragraph",
        "text": "Nous avons regroupé les fiches par marque pour faciliter la recherche."
      },
      {
        "type": "paragraph",
        "html": "<strong>Yamaha</strong>"
      },
      {
        "type": "list",
        "items": [
          "<a href=\"/fiches/yamaha-mt-07\" class=\"text-accent underline hover:text-accent/80\">MT-07</a>",
          "Tracer 7",
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
        "items": ["<a href=\"/fiches/honda-cb500-hornet\" class=\"text-accent underline hover:text-accent/80\">CB500 Hornet / CB500F</a>", "CBR500R", "NX500"]
      },
      {
        "type": "paragraph",
        "html": "<strong>Kawasaki</strong>"
      },
      {
        "type": "list",
        "items": ["<a href=\"/fiches/kawasaki-z650\" class=\"text-accent underline hover:text-accent/80\">Z650</a>", "Ninja 650"]
      },
      {
        "type": "paragraph",
        "text": "(D’autres modèles seront ajoutés régulièrement)"
      },
      {
        "type": "paragraph",
        "text": "Chaque fiche détaille :"
      },
      {
        "type": "list",
        "items": [
          "intervalles d’entretien",
          "coût des révisions",
          "fiabilité connue",
          "conseils de longévité"
        ]
      },
      {
        "type": "heading",
        "text": "Pourquoi suivre l’entretien constructeur ?"
      },
      {
        "type": "paragraph",
        "text": "Respecter les intervalles permet :"
      },
      {
        "type": "list",
        "items": [
          "d’éviter les pannes coûteuses",
          "d’augmenter la durée de vie moteur",
          "de faciliter la revente",
          "de rouler en sécurité"
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
        "text": "Un bon entretien ne sert pas seulement à protéger ta moto… Il protège surtout ton budget."
      },
      {
        "type": "paragraph",
        "text": "Prendre 5 minutes pour vérifier sa machine régulièrement peut éviter plusieurs centaines d’euros de réparation."
      },
      {
        "type": "paragraph",
        "text": "Choisis ta moto ci-dessus pour accéder à sa fiche complète."
      },
      {
        "type": "signature",
        "text": "L'équipe Label Moto",
        "imageUrl": "/images/Stamp-LM.png?v=2",
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

  const { imageUrl, imageHint } = article;

  const firstParagraphIndex = article.content?.findIndex(b => b.type === 'paragraph') ?? -1;

  const renderContent = () => {
    if (!article.content || article.content.length === 0) {
      return <p className="text-lg text-muted-foreground">Contenu de l'article à venir...</p>;
    }

    return article.content.map((block, index) => {
      if (block.type === 'heading') {
        return <h2 key={index} className="text-3xl font-bold font-serif mt-12 mb-6 text-foreground text-center border-y border-foreground/20 py-2">{block.text}</h2>;
      }
      if (block.type === 'list' && block.items) {
        return (
          <ul key={index} className="list-disc list-inside space-y-3 pl-2">
            {block.items.map((item, i) => <li key={i} className="text-lg text-foreground/90 leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: item }} />)}
          </ul>
        );
      }
      if (block.type === 'paragraph' && block.html) {
          const isFirst = index === firstParagraphIndex;
          const dropCapClass = isFirst ? "first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left" : "";
          return <p key={index} className={`text-lg text-foreground/90 leading-relaxed text-justify ${dropCapClass}`} dangerouslySetInnerHTML={{ __html: block.html }} />;
      }
      if (block.type === 'table' && block.headers && block.rows) {
        return (
          <div key={index} className="my-8 overflow-x-auto">
            <Table className="min-w-full text-sm">
              <TableHeader>
                <TableRow>
                  {block.headers.map((header: string, hIndex: number) => (
                    <TableHead key={hIndex} className="font-semibold">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {block.rows.map((row: (string | number)[], rIndex: number) => (
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
      }
      if (block.type === 'signature' && block.imageUrl) {
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
      
      const isFirst = index === firstParagraphIndex;
      const dropCapClass = isFirst && block.type === 'paragraph' ? "first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left" : "";
      return <p key={index} className={`text-lg text-foreground/90 leading-relaxed text-justify ${dropCapClass}`}>{block.text}</p>;
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
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          <article>
            <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                data-ai-hint={imageHint}
                priority
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground leading-tight tracking-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mb-8 border-b pb-4">
              <span>Par {article.author}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{article.date}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{article.readingTime}</span>
            </div>
            
            <div className="space-y-6">
              {renderContent()}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

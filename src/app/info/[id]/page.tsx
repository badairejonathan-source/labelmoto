
'use client';

import React, { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Map } from 'lucide-react';

import Header from '@/components/app/header';
import articlesData from '@/data/articles.json';
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

type ArticleContent = {
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'signature';
  text?: string;
  html?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  imageUrl?: string;
  alt?: string;
};

type Article = {
  id: string;
  title: string;
  description: string;
  author: string;
  readingTime: string;
  imageUrl: string;
  imageHint: string;
  content?: ArticleContent[];
};

const articles: Article[] = articlesData as unknown as Article[];

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

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
        return <h2 key={index} className="text-3xl font-bold mt-12 mb-6 text-foreground text-center border-y border-foreground/20 py-2">{block.text}</h2>;
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
          return <p key={index} className={cn("text-lg text-foreground/90 leading-relaxed text-justify", dropCapClass)} dangerouslySetInnerHTML={{ __html: block.html }} />;
      }
      if (block.type === 'table' && block.headers && block.rows) {
        return (
          <div key={index} className="my-8 overflow-x-auto rounded-lg border">
            <Table className="min-w-full text-sm">
              <TableHeader className="bg-muted/50">
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
      return <p key={index} className={cn("text-lg text-foreground/90 leading-relaxed text-justify", dropCapClass)}>{block.text}</p>;
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
        placeholderText="Rechercher un article..."
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
          <Link href="/info" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour aux articles
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8">
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
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mb-8 border-b pb-4">
                  <span>Par {article.author}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{article.readingTime}</span>
                </div>
                
                <div className="space-y-6">
                  {renderContent()}
                </div>
              </article>
            </div>

            <aside className="md:col-span-4 relative">
                <div className="md:sticky md:top-28 space-y-6">
                    <Card className="overflow-hidden shadow-lg border-2 border-primary/20 max-w-sm mx-auto md:max-w-none">
                        <CardHeader className="p-4 lg:p-6">
                            <CardTitle className="flex items-center gap-2 text-primary text-base lg:text-xl">
                                <Map className="h-4 w-4 lg:h-5 w-5"/>
                                Trouver une concession
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
                            <Link href="/map" className="block group rounded-lg overflow-hidden border">
                              <Image 
                                  src="/images/apercucartezoom.png"
                                  alt="Aperçu de la carte"
                                  width={400}
                                  height={300}
                                  className="object-cover w-full h-40 lg:h-auto transition-transform duration-300 group-hover:scale-105"
                              />
                            </Link>
                            <p className="text-muted-foreground text-sm mt-4 hidden md:block">
                                Accédez à notre carte interactive pour trouver les meilleures concessions et ateliers moto près de chez vous.
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 lg:p-6 lg:pt-0">
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

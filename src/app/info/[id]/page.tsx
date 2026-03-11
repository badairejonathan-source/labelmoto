
'use client';

import React, { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import Header from '@/components/app/header';
import articlesData from '@/app/data/articles.json';
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
  rows?: string[][];
  imageUrl?: string;
  alt?: string;
};

type Article = {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
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
        <div className="max-w-4xl mx-auto">
          <Link href="/info" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour aux articles
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
      </main>
    </div>
  );
}

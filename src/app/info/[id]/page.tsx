'use client';

import { useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import Header from '@/components/app/header';
import articlesData from '@/app/data/articles.json';
import placeholderData from '@/app/lib/placeholder-images.json';

type ArticleContent = {
  type: 'paragraph' | 'heading' | 'list';
  text?: string;
  html?: string;
  items?: string[];
};

type Article = {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readingTime: string;
  imageSeed: string;
  content?: ArticleContent[];
};

const articles: Article[] = articlesData as Article[];

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
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

  const imageMeta = placeholderData.articles.find(img => img.seed === article.imageSeed);
  const imageUrl = imageMeta ? `https://picsum.photos/seed/${imageMeta.seed}/1200/600` : `https://picsum.photos/1200/600`;
  const imageHint = imageMeta ? imageMeta.hint : 'motorcycle article';

  const renderContent = () => {
    if (!article.content || article.content.length === 0) {
      return <p className="text-lg text-muted-foreground">Contenu de l'article à venir...</p>;
    }

    return article.content.map((block, index) => {
      if (block.type === 'heading') {
        return <h2 key={index} className="text-3xl font-bold mt-12 mb-4 text-foreground">{block.text}</h2>;
      }
      if (block.type === 'list' && block.items) {
        return (
          <ul key={index} className="list-disc list-inside space-y-3 pl-2">
            {block.items.map((item, i) => <li key={i} className="text-lg text-foreground/90 leading-relaxed">{item}</li>)}
          </ul>
        );
      }
      if (block.type === 'paragraph' && block.html) {
          return <p key={index} className="text-lg text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.html }} />;
      }
      return <p key={index} className="text-lg text-foreground/90 leading-relaxed">{block.text}</p>;
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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

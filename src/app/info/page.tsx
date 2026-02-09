'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

import Header from '@/components/app/header';
import articlesData from '@/app/data/articles.json';
import placeholderData from '@/app/lib/placeholder-images.json';
import { Loader2 } from 'lucide-react';

type Article = (typeof articlesData)[0];

const ArticleCard = ({ article }: { article: Article }) => {
    const imageMeta = placeholderData.articles.find(img => img.seed === article.imageSeed);
    const imageUrl = imageMeta ? `https://picsum.photos/seed/${imageMeta.seed}/${imageMeta.width}/${imageMeta.height}` : `https://picsum.photos/400/400`;
    const imageHint = imageMeta ? imageMeta.hint : 'motorcycle article';

    return (
        <article className="py-8 border-b last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                    <Link href={`/info/${article.id}`} className="group">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight group-hover:underline underline-offset-4 decoration-accent decoration-2">
                            {article.title}
                        </h2>
                    </Link>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {article.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground font-medium">
                        <span>Par {article.author}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{article.date}</span>
                         <span className="text-muted-foreground/50">•</span>
                        <span>{article.readingTime}</span>
                    </div>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden order-first md:order-last">
                    <Link href={`/info/${article.id}`}>
                        <Image 
                            src={imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            data-ai-hint={imageHint}
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
};

function InfoPageComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchParam = searchParams.get('search');
    
    const [searchTerm, setSearchTerm] = useState(searchParam || '');
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchParam || '');
    const [filteredArticles, setFilteredArticles] = useState(articlesData);

    const handleSearchTermChange = (newTerm: string) => {
        setSearchTerm(newTerm);
        if (newTerm.trim() === '') {
            setSubmittedSearchTerm('');
        }
    };

    const handleSearch = () => {
        setSubmittedSearchTerm(searchTerm);
    };

    const handleFilterChange = (filter: 'shopping' | 'service') => {
        router.push(`/map?filter=${filter}`);
    };
    
    useEffect(() => {
        setSubmittedSearchTerm(searchParam || '');
        setSearchTerm(searchParam || '');
    }, [searchParam]);

    useEffect(() => {
        let results = articlesData;
        if (submittedSearchTerm && submittedSearchTerm.trim() !== '') {
            const lowerCaseSearch = submittedSearchTerm.toLowerCase();
            results = articlesData.filter(article => 
                article.title.toLowerCase().includes(lowerCaseSearch) ||
                article.description.toLowerCase().includes(lowerCaseSearch) ||
                article.author.toLowerCase().includes(lowerCaseSearch)
            );
        }
        setFilteredArticles(results);
    }, [submittedSearchTerm]);

    return (
        <div className="bg-background min-h-screen">
            <Header
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                onSearch={handleSearch}
                activeFilter={null}
                onFilterChange={handleFilterChange}
                placeholderText="Rechercher un article..."
            />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {filteredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                    {filteredArticles.length === 0 && submittedSearchTerm && (
                        <div className="text-center text-muted-foreground py-20">
                            <p className="text-lg">Aucun article ne correspond à votre recherche "{submittedSearchTerm}".</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function InfoPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[100svh] w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <InfoPageComponent />
    </Suspense>
  );
}

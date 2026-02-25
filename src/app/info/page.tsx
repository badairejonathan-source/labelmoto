
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

import Header from '@/components/app/header';
import articlesData from '@/app/data/articles.json';
import { Loader2, Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Article = (typeof articlesData)[0];

const ArticleCard = ({ article }: { article: Article }) => {
    const { imageUrl, imageHint } = article;

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
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold font-serif text-foreground tracking-tight">
                        Conseils pratiques
                    </h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {filteredArticles.map((article) => (
                            <ArticleCard key={article.id} article={article as Article} />
                        ))}
                        {filteredArticles.length === 0 && submittedSearchTerm && (
                            <div className="text-center text-muted-foreground py-20">
                                <p className="text-lg">Aucun article ne correspond à votre recherche "{submittedSearchTerm}".</p>
                            </div>
                        )}
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
                                          src="/images/apercucarte.png"
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
                                    <Button asChild className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-base py-5 rounded-full shadow-lg">
                                        <Link href="/map">Voir la carte interactive</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </aside>
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

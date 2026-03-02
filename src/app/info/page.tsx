
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

import Header from '@/components/app/header';
import articlesData from '@/app/data/articles.json';
import { Loader2, Map, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Article = (typeof articlesData)[0];

const ArticleCard = ({ article }: { article: Article }) => {
    const { imageUrl, imageHint } = article;

    return (
        <article>
          <Link href={`/info/${article.id}`} className="group block py-8 border-b last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="md:col-span-2">
                    <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground leading-tight group-hover:text-brand transition-colors">
                        {article.title}
                    </h2>
                    <p className="mt-3 text-base text-muted-foreground line-clamp-3">
                        {article.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground font-medium">
                        <span>Par {article.author}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{article.date}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{article.readingTime}</span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden order-first md:order-last">
                    <Image 
                        src={imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        data-ai-hint={imageHint}
                    />
                </div>
            </div>
          </Link>
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
                placeholderText="Recherche par nom, ville, departement"
            />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        Retour à l'accueil
                    </Link>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold font-serif text-foreground tracking-tight">
                            Conseils pratiques
                        </h1>
                        <div className="mt-2 w-20 h-0.5 bg-brand mx-auto" />
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

                        <aside className="relative mt-12 lg:mt-0">
                            <div className="lg:sticky lg:top-28 space-y-6">
                                <Card className="overflow-hidden shadow-lg border-2 border-primary/20 max-w-md mx-auto lg:max-w-none">
                                    <CardHeader className="p-4 lg:p-6">
                                        <CardTitle className="flex items-center gap-2 text-primary text-lg lg:text-xl">
                                            <Map className="h-5 w-5"/>
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
                                              className="object-cover w-full h-48 lg:h-auto transition-transform duration-300 group-hover:scale-105"
                                          />
                                        </Link>
                                        <p className="text-muted-foreground text-sm mt-4 hidden lg:block">
                                            Accédez à notre carte interactive pour trouver les meilleures concessions et ateliers moto près de chez vous.
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 lg:p-6 lg:pt-0">
                                        <Button asChild className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-sm lg:text-base py-4 lg:py-5 rounded-full shadow-lg">
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

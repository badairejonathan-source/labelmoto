
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

import Header from '@/components/app/header';
import { Loader2, Map, ArrowLeft, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const ArticleCard = ({ article }: { article: any }) => {
    // Robust image resolution logic
    const imageUrl = React.useMemo(() => {
        if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
        const id = (article.id || '').toLowerCase();
        const title = (article.display_title || article.title || "").toLowerCase();
        
        if (id.includes('pieges') || id.includes('occasion') || title.includes('pièges')) return "/images/evitelespieges.jpg";
        if (id.includes('budget') || title.includes('budget')) return "https://images.unsplash.com/photo-1572452571879-3d67d5b2a39f?q=80&w=1080";
        if (id.includes('a2') || title.includes('a2')) return "/images/achat-occasion.jpg";
        
        return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop";
    }, [article]);

    const title = article.display_title || article.title || "Sans titre";

    return (
        <article>
          <Link href={`/info/${article.id}`} className="group block py-8 border-b last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="md:col-span-2">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight group-hover:text-brand transition-colors uppercase tracking-tighter">
                        {title}
                    </h2>
                    <p className="mt-3 text-base text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                        {article.description || article.intro_conclusion || article.intro?.[0] || ""}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground font-black uppercase tracking-widest">
                        <FileText className="h-3.5 w-3.5 text-brand" />
                        <span>Par {article.author || "L'équipe Label Moto"}</span>
                    </div>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden order-first md:order-last border-2 border-white shadow-lg bg-muted">
                    <Image 
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
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

    const firestore = useFirestore();
    const articlesRef = useMemoFirebase(() => collection(firestore, 'articles'), [firestore]);
    const { data: allArticles, isLoading } = useCollection(articlesRef);

    const handleSearchTermChange = (newTerm: string) => {
        setSearchTerm(newTerm);
    };

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleFilterChange = (filter: 'shopping' | 'service') => {
        router.push(`/map?filter=${filter}`);
    };
    
    useEffect(() => {
        setSearchTerm(searchParam || '');
    }, [searchParam]);

    const filteredArticles = React.useMemo(() => {
        if (!allArticles) return [];
        const EXCLUDED_ARTICLE_ID = 'entretien-moto-intervalles-prix-conseils-par-modele';
        return allArticles.filter(a => a.id !== EXCLUDED_ARTICLE_ID);
    }, [allArticles]);

    return (
        <div className="bg-background min-h-screen">
            <Header
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                onSearch={handleSearch}
                activeFilter={null}
                onFilterChange={handleFilterChange}
                placeholderText="Trouver une concession, une ville, une marque..."
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
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">
                            Conseils pratiques
                        </h1>
                        <div className="mt-4 w-20 h-1.5 bg-brand mx-auto rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-8">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                    <Loader2 className="h-10 w-10 animate-spin mb-4" />
                                    <p className="font-bold uppercase tracking-widest text-[10px]">Chargement des articles...</p>
                                </div>
                            ) : (
                                <>
                                    {filteredArticles.map((article) => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))}
                                    {filteredArticles.length === 0 && (
                                        <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-3xl bg-muted/10">
                                            <p className="text-lg font-black uppercase tracking-tighter">Aucun article trouvé.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <aside className="md:col-span-4 relative">
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
                                            Trouvez les meilleures concessions et ateliers moto en France sur notre carte interactive.
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

export default function InfoPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[100svh] w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    }>
      <InfoPageComponent />
    </Suspense>
  );
}

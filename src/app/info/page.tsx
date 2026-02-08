import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MotoTrustLogo from '@/components/app/logo';
import { Search, FilePenLine, Bell, User } from 'lucide-react';
import articles from '@/app/data/articles.json';
import placeholderData from '@/app/lib/placeholder-images.json';

const InfoHeader = () => {
    return (
        <header className="bg-card text-foreground py-4 px-4 sm:px-6 lg:px-8 w-full border-b sticky top-0 z-30">
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="w-24 md:w-32 shrink-0">
                    <Link href="/">
                        <MotoTrustLogo />
                    </Link>
                </div>

                <div className="flex-1 max-w-lg mx-auto">
                    <form action="/info" method="get" className="relative w-full">
                        <Input
                            name="search"
                            type="search"
                            placeholder="Rechercher un article..."
                            className="pr-12 h-10 text-sm rounded-full shadow-sm bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900"
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            variant="ghost"
                            className="absolute top-1/2 right-1.5 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
                
                <nav className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                        <Link href="#">
                            <FilePenLine className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild size="icon" className="h-10 w-10 bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="#">
                            <Bell className="h-5 w-5" />
                        </Link>
                    </Button>
                     <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                        <Link href="#">
                            <User className="h-5 w-5" />
                        </Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
};

const ArticleCard = ({ article }: { article: (typeof articles)[0] }) => {
    const imageMeta = placeholderData.articles.find(img => img.seed === article.imageSeed);
    const imageUrl = imageMeta ? `https://picsum.photos/seed/${imageMeta.seed}/${imageMeta.width}/${imageMeta.height}` : `https://picsum.photos/400/400`;
    const imageHint = imageMeta ? imageMeta.hint : 'motorcycle article';

    return (
        <article className="py-8 border-b last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                    <Link href="#" className="group">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight group-hover:underline underline-offset-4 decoration-accent decoration-2">
                            {article.title}
                        </h2>
                    </Link>
                    <p className="mt-4 text-muted-foreground text-lg">
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
                    <Image 
                        src={imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        data-ai-hint={imageHint}
                    />
                </div>
            </div>
        </article>
    );
};

export default function InfoPage() {
    return (
        <div className="bg-background min-h-screen">
            <InfoHeader />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </main>
        </div>
    );
}

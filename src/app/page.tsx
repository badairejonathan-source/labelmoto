'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from '@/components/app/logo';
import { Bike, Wrench, FileText, Search, Home, CheckCircle } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';
import articlesData from '@/app/data/articles.json';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

const LandingHeader = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter');
    
    const isInfoActive = pathname ? pathname.startsWith('/info') : false;
    const isShoppingActive = pathname === '/map' && filter === 'shopping';
    const isServiceActive = pathname === '/map' && filter === 'service';
    const isMapActive = pathname === '/map' && !isShoppingActive && !isServiceActive;

    return (
        <header className="bg-card text-foreground py-4 px-4 sm:px-6 lg:px-8 w-full border-b">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4">
                    {/* Top row: Logo and Icons */}
                    <div className="flex items-center justify-between">
                        <div className="w-32 md:w-40 shrink-0">
                            <Link href="/">
                                <LabelMotoLogo />
                            </Link>
                        </div>
                        <nav className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="icon" className={cn("h-10 w-10 relative", isShoppingActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                                <Link href="/map?filter=shopping">
                                    <Bike className="h-6 w-6" />
                                    {isShoppingActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand rounded-full"></span>}
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon" className={cn("h-10 w-10 relative", isServiceActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                                <Link href="/map?filter=service">
                                    <Wrench className="h-6 w-6" />
                                    {isServiceActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand rounded-full"></span>}
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon" className={cn("h-10 w-10 relative", isInfoActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                                <Link href="/info">
                                    <FileText className="h-6 w-6" />
                                    {isInfoActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand rounded-full"></span>}
                                </Link>
                            </Button>
                        </nav>
                    </div>

                    {/* Search Bar */}
                    <form action="/map" method="get" className="relative w-full max-w-lg mx-auto">
                        <Input
                            name="search"
                            type="search"
                            placeholder="Rechercher par nom, ville, code postal..."
                            className="pr-14 h-12 text-base rounded-full shadow-sm bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900"
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            className="absolute top-1/2 right-2 -translate-y-1/2 h-9 w-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full shadow"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </form>

                    {/* Text Navigation */}
                    <nav className="flex items-center justify-center gap-6 md:gap-8 text-muted-foreground font-medium text-lg">
                        <Link href="/map" className="flex items-center gap-2 text-foreground border-b-2 border-brand pb-1">
                            <Home className="h-5 w-5 text-brand" />
                            <span>Tout recherche</span>
                        </Link>
                        <Link href="/map?filter=shopping" className="hover:text-foreground">
                            Concession
                        </Link>
                        <Link href="/map?filter=service" className="hover:text-foreground">
                            Atelier
                        </Link>
                        <Link href="/info" className="hover:text-foreground">
                            Conseils pratiques
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default function LandingPage() {
    const { hero, gallery, ctaSection } = placeholderData.landingPage;
    const featuredArticle = articlesData.find(article => article.id === '5');

    return (
        <div className="min-h-screen bg-background">
            <LandingHeader />
            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden p-1 border-4 border-brand bg-black">
                     <Image
                        src={hero.src}
                        alt="Motorcycle"
                        fill
                        className="object-cover z-0 opacity-40 rounded-3xl"
                        priority
                        data-ai-hint={hero.hint}
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-8 md:p-16">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                            Trouver une concession, un atelier ou un reparateur ? Fini la galère.
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                           Accédez à une liste de concessions et ateliers près de chez vous. Gagnez du temps, roulez en confiance.
                        </p>
                        <Link href="/map">
                            <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg">
                                Trouver un pro
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Gallery Section */}
                <section className="mt-8 md:mt-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        
                        {/* Featured Article */}
                        {featuredArticle ? (
                            <Link href={`/info/${featuredArticle.id}`} className="relative aspect-[3/4] rounded-2xl overflow-hidden group col-span-1">
                                <Image
                                    src={featuredArticle.imageUrl}
                                    alt={featuredArticle.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    data-ai-hint={featuredArticle.imageHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-3 sm:p-4 text-white" style={{textShadow: '0 1px 3px rgba(0,0,0,0.7)'}}>
                                     <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold">
                                        <FileText className="h-3 w-3" />
                                        <span>Guide Pratique</span>
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base leading-tight mt-1 group-hover:underline">Le guide pour éviter les pièges</h3>
                                </div>
                            </Link>
                        ) : (
                           gallery.length > 0 && <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                                <Image
                                    src={`https://picsum.photos/seed/${gallery[0].seed}/${gallery[0].width}/${gallery[0].height}`}
                                    alt={`Motorcycle gallery image 1`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    data-ai-hint={gallery[0].hint}
                                />
                            </div>
                        )}

                        {/* Other gallery images */}
                        {gallery.slice(1).map((image, index) => (
                             <div key={index} className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                                <Image
                                    src={`https://picsum.photos/seed/${image.seed}/${image.width}/${image.height}`}
                                    alt={`Motorcycle gallery image ${index + 2}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    data-ai-hint={image.hint}
                                />
                            </div>
                        ))}
                    </div>
                </section>
                
                <section className="mt-8 md:mt-12">
                    <div className="bg-muted/50 rounded-2xl p-6 md:p-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                            Pourquoi Label Moto va changer votre recherche
                        </h2>
                        <ul className="space-y-6 max-w-4xl mx-auto">
                            <li className="flex items-start gap-4">
                                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Gain de temps</h3>
                                    <p className="text-muted-foreground">
                                        Finies les recherches interminables ! Notre moteur intelligent vous permet de trouver une concession selon votre localisation, votre type de moto, ou le service recherché.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Informations fiables et à jour</h3>
                                    <p className="text-muted-foreground">
                                        Toutes les données des concessions (occasion et neuve) sont vérifiées et régulièrement actualisées pour vous garantir des informations correctes.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Transparence totale</h3>
                                    <p className="text-muted-foreground">
                                        Découvrez de vrais avis partagés par d’autres motards, sans filtres ni publicité déguisée, pour faire le bon choix en toute confiance.
                                    </p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Services pratiques</h3>
                                    <p className="text-muted-foreground">
                                        Notre moteur de recherche vous connecte aussi aux services d'entretien, afin que vous trouviez le bon professionnel sans vous perdre.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
                
                <section className="mt-8 md:mt-12">
                    <div className="relative rounded-2xl overflow-hidden bg-black">
                        <Image
                            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop"
                            alt="Rejoignez la communauté"
                            fill
                            className="object-cover z-0 opacity-30"
                            data-ai-hint="motorcycle dark road"
                        />
                        <div className="relative z-10 p-8 md:p-12">
                            <div className="max-w-4xl mx-auto text-center text-white">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    🚦 Rejoignez la route digitale des motards
                                </h2>
                                <div className="space-y-4 text-gray-200" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                                    <p>
                                        Parce que nous savons que le temps passé à chercher une concession, c’est du temps en moins sur la route, notre mission est simple : rendre la vie des motards plus fluide, plus connectée et plus fiable.
                                    </p>
                                    <p>
                                        Grâce à notre annuaire des concessions moto, vous pouvez dès maintenant acheter une moto près de chez vous, réserver votre essai, planifier un entretien, ou simplement découvrir la meilleure concession moto selon votre région et vos besoins.
                                    </p>
                                    <p>
                                        Alors, prêt à prendre la route du futur ? Rejoignez notre communauté dès aujourd’hui, partagez vos expériences, et contribue à bâtir la plateforme de référence pour tous les passionnés de deux-roues.
                                    </p>
                                    <p className="font-semibold text-white">
                                        Parce qu’ici, chaque motard trouve sa route… et sa concession. 🏍️💨
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

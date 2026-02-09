import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MotoTrustLogo from '@/components/app/logo';
import { Bike, Wrench, FileText, Search, Home } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';

const LandingHeader = () => {
    return (
        <header className="bg-card text-foreground py-4 px-4 sm:px-6 lg:px-8 w-full border-b">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4">
                    {/* Top row: Logo and Icons */}
                    <div className="flex items-center justify-between">
                        <div className="w-24 md:w-32 shrink-0">
                            <Link href="/">
                                <MotoTrustLogo />
                            </Link>
                        </div>
                        <nav className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-10 w-10 relative text-primary">
                                <Link href="/map?filter=shopping">
                                    <Bike className="h-6 w-6" />
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                                </Link>
                            </Button>
                            <Button asChild size="icon" className="h-10 w-10 bg-accent hover:bg-accent/90 text-accent-foreground relative">
                                <Link href="/map?filter=service">
                                    <Wrench className="h-6 w-6" />
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                                <Link href="/info">
                                    <FileText className="h-6 w-6" />
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
                            <span>Tout rechercher</span>
                        </Link>
                        <Link href="/map?filter=shopping" className="hover:text-foreground">
                            concession
                        </Link>
                        <Link href="/map?filter=service" className="hover:text-foreground">
                            Atelier
                        </Link>
                        <Link href="/info" className="hover:text-foreground">
                            info
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default function LandingPage() {
    const { hero, gallery } = placeholderData.landingPage;

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
                            Trouver une concession ? Fini la galère.
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                           Accédez à des informations fiables et à jour sur les concessions et ateliers près de chez vous. Gagnez du temps, roulez en confiance.
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
                        {gallery.map((image, index) => (
                             <div key={index} className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                                <Image
                                    src={`https://picsum.photos/seed/${image.seed}/${image.width}/${image.height}`}
                                    alt={`Motorcycle gallery image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    data-ai-hint={image.hint}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

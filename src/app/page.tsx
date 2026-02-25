'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from '@/components/app/logo';
import { Bike, Wrench, FileText, Search, Home, CheckCircle, LogOut, Loader2, User as UserIcon, BookOpenCheck } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';
import articlesData from '@/app/data/articles.json';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


type GalleryImage = {
    src?: string;
    seed?: string;
    width?: number;
    height?: number;
    hint: string;
    text?: string;
};

const LandingHeader = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter');
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    
    const isInfoActive = pathname ? pathname.startsWith('/info') : false;
    const isShoppingActive = pathname === '/map' && filter === 'shopping';
    const isServiceActive = pathname === '/map' && filter === 'service';
    const isMapActive = pathname === '/map' && !isShoppingActive && !isServiceActive;

    const handleLogout = async () => {
      await signOut(auth);
    }
  
    const UserMenu = () => {
      if (isUserLoading) {
        return <Button variant="ghost" className="h-12 w-12 rounded-full"><Loader2 className="h-6 w-6 animate-spin" /></Button>
      }
      if (!user) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" className="hidden sm:flex rounded-full h-12 w-12 p-0">
                  <Link href="/login">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center p-1">
                      <Image key="force-reload-2" src="/images/icon-moncompte.png" alt="Mon compte" width={40} height={40} className="h-10 w-10 object-contain" />
                    </div>
                    <span className="sr-only">Mon compte</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mon compte</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return (
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="relative h-12 w-12 rounded-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Connecté en tant que</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Gérer mon compte</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
        <header className="bg-card text-foreground py-4 px-4 sm:px-6 lg:px-8 w-full border-b">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-2">
                    {/* Top row: Logo, Profile */}
                    <div className="flex items-center justify-between">
                        <div className="w-40 md:w-48 shrink-0">
                            <Link href="/">
                                <LabelMotoLogo />
                            </Link>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                                <Link href="/entretien">
                                                    <BookOpenCheck className="h-6 w-6" />
                                                    <span className="sr-only">Entretien & Révisions</span>
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Entretien & Révisions</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                                <Link href="/info">
                                                    <FileText className="h-6 w-6" />
                                                    <span className="sr-only">Conseils pratiques</span>
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Conseils pratiques</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="md:hidden">
                                <UserMenu />
                            </div>
                             <div className="hidden md:block">
                                <UserMenu />
                            </div>
                        </div>
                    </div>

                    {/* Centered navigation and Search Bar */}
                    <div className="flex flex-col items-center gap-6 mt-2">
                        <nav className="hidden md:flex items-center justify-center gap-12 md:gap-24">
                            <Link href="/map?filter=shopping" className="flex items-center gap-4 text-4xl text-muted-foreground font-medium hover:text-foreground">
                                <Bike className="h-12 w-12" />
                                <span>Concession</span>
                            </Link>
                            <Link href="/map?filter=service" className="flex items-center gap-4 text-4xl text-muted-foreground font-medium hover:text-foreground">
                                <Wrench className="h-12 w-12" />
                                <span>Atelier</span>
                            </Link>
                        </nav>
                        
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
                    </div>
                </div>
            </div>
        </header>
    );
};

export default function LandingPage() {
    const { hero, gallery, ctaSection } = placeholderData.landingPage;
    const featuredArticle = articlesData.find(article => article.id === '5');
    const { user } = useUser();
    const proRegisterLink = user ? "/pro/register" : "/login";

    const getImageUrl = (image: GalleryImage) => {
        return image.src || `https://picsum.photos/seed/${image.seed}/${image.width}/${image.height}`;
    }

    return (
        <div className="min-h-screen bg-background">
            <LandingHeader />
            <main className="py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="relative rounded-3xl p-1 border-4 border-brand bg-black md:mb-16">
                     <Image
                        src={hero.src}
                        alt="Motorcycle"
                        fill
                        className="object-cover z-0 opacity-40 rounded-3xl"
                        priority
                        data-ai-hint={hero.hint}
                    />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-white p-8 md:p-16">
                        <div className="md:w-3/5 text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                                Trouver une concession, un atelier ou un reparateur ? Fini la galère.
                            </h1>
                            <p className="text-lg md:text-xl max-w-3xl mx-auto md:mx-0 mb-8 text-gray-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                               Accédez à une liste de concessions et ateliers près de chez vous. Gagnez du temps, roulez en confiance.
                            </p>
                            <div className="flex items-center justify-center md:justify-end md:translate-x-40">
                                <Link href="/map">
                                    <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg">
                                        Trouver un pro
                                    </Button>
                                </Link>
                            </div>
                        </div>

                         <div className="w-full md:w-2/5 flex justify-center mt-8 md:mt-0">
                             <Link href="/map" className="block md:absolute md:-bottom-20 md:right-10 transform md:-rotate-6 hover:scale-105 transition-transform duration-300">
                                <Image 
                                    src={hero.mapPreview.src}
                                    alt="Aperçu de la carte"
                                    width={280}
                                    height={280}
                                    className="rounded-2xl border-4 border-white shadow-lg"
                                    data-ai-hint={hero.mapPreview.hint}
                                />
                            </Link>
                        </div>
                    </div>
                </div>

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
                                    src={getImageUrl(gallery[0] as GalleryImage)}
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
                             <div key={index} className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                                <Image
                                    src={getImageUrl(image as GalleryImage)}
                                    alt={`Motorcycle gallery image ${index + 2}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    data-ai-hint={(image as GalleryImage).hint}
                                />
                                {(image as GalleryImage).text && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-3 sm:p-4 text-white" style={{textShadow: '0 1px 3px rgba(0,0,0,0.7)'}}>
                                            <h3 className="font-bold text-sm sm:text-base leading-tight">{ (image as GalleryImage).text }</h3>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-8 md:mt-12">
                  <div className="bg-muted/50 rounded-2xl p-6 md:p-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      🔧 Vérifiez l’entretien de votre moto
                    </h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
                      Avant d’aller chez le garagiste, vérifiez le kilométrage de révision et le coût moyen pour votre modèle. En quelques secondes, vous savez quoi prévoir et combien ça va coûter.
                    </p>
                    <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg">
                      <Link href="/entretien">
                        Vérifier l’entretien de ma moto
                      </Link>
                    </Button>
                    <div className="flex flex-col items-center gap-3 mt-6">
                      <p className="text-xs text-muted-foreground">
                          Suggestions : 
                          <Link href="/entretien" className="hover:text-accent underline-offset-4 hover:underline mx-1.5">révision moto</Link>•
                          <Link href="/entretien" className="hover:text-accent underline-offset-4 hover:underline mx-1.5">prix révision</Link>•
                          <Link href="/entretien" className="hover:text-accent underline-offset-4 hover:underline mx-1.5">entretien MT-07</Link>
                      </p>
                       <nav className="flex md:hidden items-center justify-center gap-4 text-muted-foreground font-medium text-base mt-2">
                          <Link href="/map" className="flex items-center gap-2 text-foreground border-b-2 border-brand pb-1">
                              <Home className="h-5 w-5 text-brand" />
                              <span>Tout</span>
                          </Link>
                          <Link href="/map?filter=shopping" className="flex items-center gap-2 hover:text-foreground">
                              <Bike className="h-5 w-5" />
                              <span>Concession</span>
                          </Link>
                          <Link href="/map?filter=service" className="flex items-center gap-2 hover:text-foreground">
                              <Wrench className="h-5 w-5" />
                              <span>Atelier</span>
                          </Link>
                           <Link href="/entretien" className="flex items-center gap-2 hover:text-foreground">
                              <BookOpenCheck className="h-5 w-5" />
                              <span>Entretien</span>
                          </Link>
                          <Link href="/info" className="flex items-center gap-2 hover:text-foreground">
                              <FileText className="h-5 w-5" />
                              <span>Conseils</span>
                          </Link>
                      </nav>
                  </div>
                  </div>
                </section>

                <section className="mt-8 md:mt-12">
                    <div className="relative rounded-2xl overflow-hidden bg-black">
                        <Image
                            src={ctaSection.src}
                            alt="Rejoignez la communauté"
                            fill
                            className="object-cover z-0 opacity-30"
                            data-ai-hint={ctaSection.hint}
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
                                        Parce qu’ici, chaque motard trouve sa route… et sa concession. <Image src="/images/Stamp-LM.png?v=3" alt="Cachet Label Moto" width={40} height={40} className="inline-block -mt-2 opacity-80" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-8 md:mt-12">
                  <div className="bg-muted/50 rounded-2xl p-6 md:p-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Vous êtes concessionnaire ou atelier moto ?
                    </h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
                      Rejoignez Label Moto et gagnez en visibilité auprès des motards de votre région. Ajoutez gratuitement votre établissement et apparaissez dans notre moteur de recherche.
                    </p>
                    <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg">
                      <Link href={proRegisterLink}>
                        🔘 Créer la fiche de mon établissement
                      </Link>
                    </Button>
                  </div>
                </section>
                </div>
            </main>
        </div>
    );
}

    
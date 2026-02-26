'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LabelMotoLogo from '@/components/app/logo';
import { Bike, Wrench, FileText, Search, Home, CheckCircle, LogOut, Loader2, User as UserIcon, BookOpenCheck, ArrowRight } from 'lucide-react';
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
        return <Button variant="ghost" className="h-12 w-12 rounded-full"><Loader2 className="h-6 i-6 animate-spin" /></Button>
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
        <header className="bg-card text-foreground py-2 px-4 sm:px-6 lg:px-8 w-full border-b">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-1.5">
                    {/* Top row: Logo, Slogan, Profile */}
                    <div className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_2fr_1fr]">
                        <div className="w-40 md:w-48 shrink-0 lg:justify-self-start">
                            <Link href="/">
                                <LabelMotoLogo />
                            </Link>
                        </div>

                        {/* Integrated Slogan - Centered with more space - Forced 2 lines */}
                        <div className="hidden lg:flex items-center justify-center px-4">
                            <p className="text-4xl font-bold text-foreground text-center leading-[1.1]">
                                <span className="block">Trouver une concession, un atelier ou un réparateur ?</span>
                                <span className="text-accent italic block">Fini la galère.</span>
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 justify-end lg:justify-self-end">
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

                    {/* Search Bar and Navigation below */}
                    <div className="flex flex-col items-center gap-1">
                        {/* Search Bar */}
                        <form action="/map" method="get" className="relative w-full max-w-2xl mx-auto">
                            <Input
                                name="search"
                                type="search"
                                placeholder="Rechercher par nom, ville, code postal..."
                                className="pr-14 h-12 text-base rounded-full shadow-sm bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900"
                            />
                            <Button 
                                type="submit" 
                                size="icon" 
                                className="absolute top-1/2 right-1.5 -translate-y-1/2 h-9 w-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full shadow"
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </form>

                        <nav className="hidden md:flex items-center justify-center gap-8 md:gap-12">
                            <Link href="/map" className="flex items-center gap-3 text-xl text-muted-foreground font-medium px-6 py-1 rounded-2xl transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                                <Home className="h-6 w-6" />
                                <span>Tout</span>
                            </Link>
                            <Link href="/map?filter=shopping" className="flex items-center gap-3 text-xl text-muted-foreground font-medium px-6 py-1 rounded-2xl transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                                <Bike className="h-6 w-6" />
                                <span>Concession</span>
                            </Link>
                            <Link href="/map?filter=service" className="flex items-center gap-3 text-xl text-muted-foreground font-medium px-6 py-1 rounded-2xl transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                                <Wrench className="h-6 w-6" />
                                <span>Atelier</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default function LandingPage() {
    const { hero, ctaSection } = placeholderData.landingPage;
    const a2Articles = articlesData.filter(article => ['4', '5', '6'].includes(article.id));
    const { user } = useUser();
    const proRegisterLink = user ? "/pro/register" : "/login";

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
                                De l’A2 au vieux briscard : trouvez votre pro en un clin d'œil.
                            </h1>
                            <p className="text-lg md:text-xl max-w-3xl mx-auto md:mx-0 mb-8 text-gray-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                               Fini les dizaines d'onglets ouverts. Label Moto regroupe tout l’univers deux-roues au même endroit pour vous laisser plus de temps sur la route.
                            </p>
                            <div className="flex items-center justify-center md:justify-end md:translate-x-40">
                                <Link href="/map">
                                    <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg relative z-[20]">
                                        Explorer la carte
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
                                        Recherche simplifiée, centralisez vos besoins. Localisation, type de moto, expertise spécifique : <span className="font-bold">Label Moto fait le tri pour vous.</span>
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Informations fiables et à jour</h3>
                                    <p className="text-muted-foreground">
                                        Toutes les données des concessions (occasion et neuve) sont vérifiées et <span className="font-bold">régulièrement actualisées</span> pour vous garantir des informations correctes.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Transparence totale</h3>
                                    <p className="text-muted-foreground">
                                        Découvrez de <span className="font-bold">vrais avis</span> partagés par une communauté de motards, sans filtres ni publicité déguisée, pour faire le bon choix en toute confiance.
                                    </p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Info technique, le bon choix.</h3>
                                    <p className="text-muted-foreground">
                                        Accédez à nos guides et fiches techniques pour maîtriser votre sujet et <span className="font-bold">identifier le professionnel idéal</span> pour votre machine.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
                
                {/* Objectif A2 Section */}
                <section className="mt-8 md:mt-12">
                    <div className="bg-muted/50 rounded-3xl p-6 md:p-8 border-4 border-brand shadow-sm">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                Objectif A2 : Roule bien accompagné.
                            </h2>
                            <p className="text-muted-foreground max-w-3xl mx-auto">
                                De l’achat de ta première bécane au choix du bon garage, nos dossiers spéciaux t’aident à éviter les pièges et à tracer ta route sereinement.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {a2Articles.map((article) => (
                                <Link 
                                    key={article.id} 
                                    href={`/info/${article.id}`} 
                                    className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-border/50 h-full"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={article.imageUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            data-ai-hint={article.imageHint}
                                        />
                                        <div className="absolute top-3 left-3 bg-brand/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm backdrop-blur-sm">
                                            A2 Focus
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                                            <FileText className="h-3.5 w-3.5 text-brand" />
                                            <span>{article.readingTime}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-brand transition-colors line-clamp-2 mb-3">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                                            {article.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-brand text-sm font-bold mt-auto group-hover:gap-3 transition-all">
                                            <span>Lire le guide</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-8 md:mt-12">
                  <div className="bg-muted/50 rounded-2xl p-6 md:p-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Maîtrise ton budget entretien.
                    </h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
                      <span className="font-bold">Anticipe tes dépenses en quelques clics.</span> Accède au budget moyen et aux points de contrôle de ton modèle pour arriver au garage en toute confiance.
                    </p>
                    <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg">
                      <Link href="/entretien">
                        Calculer mon budget entretien
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
                          <Link href="/map" className="flex items-center gap-2 text-foreground pb-1">
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
                                <div className="space-y-4 text-gray-200" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
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

                <section className="mt-12 md:mt-20">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden border border-border/50 shadow-sm relative group">
                    <div className="flex flex-col lg:flex-row min-h-[450px]">
                      {/* Vertical Sidebar */}
                      <div className="hidden lg:flex w-20 bg-muted/30 border-r border-border/50 items-center justify-center py-12 shrink-0">
                        <span className="text-3xl font-black text-primary/10 tracking-[0.3em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                          Espace Pro
                        </span>
                      </div>

                      <div className="flex-grow flex flex-col lg:flex-row items-center p-8 md:p-12 lg:px-16 lg:py-12 gap-12">
                        <div className="flex-1 text-center lg:text-left">
                          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-6">
                            Professionnels, rejoignez le réseau Label Moto.
                          </h2>
                          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto lg:mx-0">
                            Connectez votre atelier ou concession avec les motards de votre secteur. Une visibilité accrue, une gestion simple et une inscription 100% gratuite.
                          </p>
                          <div className="relative inline-block">
                            <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-10 py-7 rounded-full shadow-lg transition-all hover:shadow-destructive/25 hover:-translate-y-1">
                              <Link href={proRegisterLink}>
                                🔘 Créer la fiche de mon établissement
                              </Link>
                            </Button>
                            
                            {/* Decorative Arrow pointing to the visual - Hand-drawn style as requested */}
                            <div className="hidden xl:block absolute -right-40 top-1/2 -translate-y-1/2 w-48 h-32 pointer-events-none">
                                <svg className="w-full h-full text-accent" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path 
                                        d="M10 80C40 80 100 70 140 20" 
                                        stroke="currentColor" 
                                        strokeWidth="6" 
                                        strokeLinecap="round" 
                                        className="drop-shadow-sm"
                                    />
                                    <path 
                                        d="M125 25L145 15L148 38" 
                                        stroke="currentColor" 
                                        strokeWidth="6" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                    />
                                </svg>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                           <div className="relative aspect-[4/3] lg:aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white -rotate-2 group-hover:rotate-0 transition-all duration-700 ease-out transform group-hover:scale-[1.02]">
                              <Image 
                                  src="/images/apercufiche.png" 
                                  alt="Interface Pro Preview" 
                                  fill
                                  className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
                           </div>
                           
                           {/* Floating badge for dynamic effect */}
                           <div className="absolute -bottom-4 -right-4 lg:-right-8 bg-brand text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm lg:text-base rotate-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              100% Gratuit
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                </div>
            </main>
        </div>
    );
}

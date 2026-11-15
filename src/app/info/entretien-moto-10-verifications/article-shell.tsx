'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Header from '@/components/app/header';
import EntretienRoadBackdrop from '@/components/app/entretien-road-backdrop';
import GuidesDesktopSidebar from '@/components/app/guides-desktop-sidebar';
import ArticleInteractif from './article-interactif';

// Présentation native du guide. Les autres articles /info restent inchangés.
const referenceArticles = [
 {id:'premiere-moto-accessoires-indispensables-conseils-a2', title:'Première moto : les bons accessoires, sans achats inutiles',display_title:'Première moto : les bons accessoires, sans achats inutiles'},
 {id:'embrayage-automatique-moto-eclutch-dct-yamt-asa-amt',title:'La fin du levier d’embrayage ? Comment la moto est en train de changer'},
 {id:'motos-chinoises-france-2026',title:'Motos chinoises en France en 2026 : modèles, forces et faiblesses'},
];

export default function ArticleLocal() {
 return (
 <div className="lm-entretien-article-release relative isolate min-h-screen overflow-x-clip bg-background">
   <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.66]"><EntretienRoadBackdrop /></div>
   <div className="lg:sticky lg:top-0 lg:z-[2200]"><Header searchTerm="" onSearchTermChange={() => {}} onSearch={() => {}} activeFilter={null} placeholderText="Recherche..." /></div>
   <main className="container mx-auto px-4 py-4 relative z-10 max-lg:bg-[#fbfcfc]/[0.97] sm:px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-0">
    <div className="max-w-6xl mx-auto lg:mx-0 lg:ml-6 lg:mr-8 lg:pt-6 lg:max-w-none lg:grid lg:grid-cols-[394px_minmax(0,1fr)] lg:items-start lg:gap-6">
      <GuidesDesktopSidebar articles={referenceArticles} isLoading={false} currentId="entretien-moto-10-verifications" />
      <div className="min-w-0 lg:relative lg:h-[calc(100vh-104px)] lg:overflow-y-auto lg:overscroll-contain lg:pr-12 xl:pr-14 2xl:pr-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
       <div className="guides-desktop-article relative z-10 lg:bg-background">
        <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-8 pt-6 md:pt-8">
         <Link href="/" className="hover:text-brand flex items-center gap-1 shrink-0"><Home className="h-3 w-3" /> Accueil</Link>
         <ChevronRight className="h-3 w-3 shrink-0"/><Link href="/info" className="hover:text-brand shrink-0">Conseils</Link>
         <ChevronRight className="h-3 w-3 shrink-0"/><span className="text-foreground truncate">Entretien moto : 10 vérifications</span>
        </nav>
        <div className="lm-real-site-article"><ArticleInteractif /></div>
       </div>
      </div>
    </div>
   </main>
 </div>
 );
}

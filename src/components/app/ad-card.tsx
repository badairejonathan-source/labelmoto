'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileText, ArrowRight, Store } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AdCardProps {
  article: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    imageHint?: string;
  };
  isPublicity?: boolean;
}

const AdCard: React.FC<AdCardProps> = ({ article, isPublicity = false }) => {
  if (!article) return null;

  // Robust image resolution logic to prevent empty string errors
  const imageUrl = React.useMemo(() => {
    if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
    
    const id = article.id?.toLowerCase() || '';
    const title = (article.title || '').toLowerCase();
    
    // Local image mapping based on content keywords
    if (id.includes('pieges') || id.includes('occasion') || title.includes('pièges')) return "/images/evitelespieges.jpg";
    if (id.includes('budget') || title.includes('budget')) return "https://images.unsplash.com/photo-1572452571879-3d67d5b2a39f?q=80&w=1080";
    if (id.includes('a2') || title.includes('a2')) return "/images/achat-occasion.jpg";
    
    // Default placeholder
    return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop";
  }, [article]);

  return (
    <Link href={isPublicity ? `/map?search=${encodeURIComponent(article.title.split(' : ')[0])}` : `/info/${article.id}`} className="group block w-full">
      <Card className={cn(
        "w-full ml-auto overflow-hidden transition-all duration-500 ease-in-out border-l-4 hover:shadow-lg shadow-sm min-h-[120px] md:min-h-[160px] flex items-stretch relative",
        isPublicity 
          ? "border-blue-500 border-blue-500/20 bg-gradient-to-r from-blue-500/[0.03] to-background" 
          : "border-brand border-brand/20 bg-gradient-to-r from-brand/[0.02] to-background"
      )}>
        {/* Background Decorative Element */}
        <div className="absolute -top-2 -right-2 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
            {isPublicity ? <Store className="w-24 h-24 text-blue-500" /> : <FileText className="w-24 h-24 text-brand" />}
        </div>

        {/* Section Image - 100% Height */}
        <div className="relative w-32 sm:w-48 md:w-64 flex-shrink-0 overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            data-ai-hint={article.imageHint || "motorcycle"}
            sizes="(max-width: 768px) 128px, 256px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
          <div className={cn(
            "absolute top-3 left-3 flex items-center gap-1.5 text-[9px] md:text-[11px] font-black text-white rounded-full px-2.5 py-1 uppercase tracking-widest shadow-lg z-20",
            isPublicity ? "bg-blue-600" : "bg-brand"
          )}>
            {isPublicity ? <Store className="h-3 w-3 md:h-3.5 md:w-3.5" /> : <FileText className="h-3 w-3 md:h-3.5 md:w-3.5" />}
            <span className="hidden sm:inline">{isPublicity ? "Publicité" : "Guide"}</span>
          </div>
        </div>

        {/* Section Contenu Principal */}
        <div className="flex flex-col justify-center flex-grow p-4 md:p-6 min-w-0 z-10">
          <div className="flex items-center gap-1.5 mb-1.5">
              <div className={cn("h-[1.5px] w-6", isPublicity ? "bg-blue-500/40" : "bg-brand/40")} />
              <span className={cn("text-[9px] uppercase tracking-widest font-black", isPublicity ? "text-blue-600/70" : "text-brand/70")}>
                {isPublicity ? "Offre Partenaire" : "Conseil Moto"}
              </span>
          </div>
          <h3 className="font-black text-base md:text-xl text-foreground leading-tight uppercase group-hover:text-brand transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-[11px] md:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed font-medium">
            {article.description}
          </p>
        </div>

        {/* Zone Action */}
        <div className="hidden md:flex flex-shrink-0 w-32 flex-col justify-center items-center p-4 bg-muted/[0.01] border-l border-border/5 z-10">
           <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand transition-colors">
                {isPublicity ? "En profiter" : "Découvrir"}
              </span>
              <div className={cn(
                "inline-flex items-center justify-center rounded-full text-white font-black text-[11px] uppercase tracking-widest px-6 h-10 shadow-md transition-all group-hover:scale-105 group-hover:-translate-y-0.5",
                isPublicity ? "bg-blue-600 shadow-blue-500/10 group-hover:shadow-blue-500/20" : "bg-brand shadow-brand/10 group-hover:shadow-brand/20"
              )}>
                 {isPublicity ? "Voir" : "Lire"}
                 <ArrowRight className="ml-2 h-4 w-4" />
              </div>
           </div>
        </div>
        
        <div className="md:hidden flex items-center pr-4 z-10">
           <div className={cn(
             "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
             isPublicity ? "bg-blue-500/10 group-hover:bg-blue-600 text-blue-600 group-hover:text-white" : "bg-brand/10 group-hover:bg-brand text-brand group-hover:text-white"
           )}>
              <ArrowRight className="w-5 h-5" />
           </div>
        </div>
      </Card>
    </Link>
  );
};

export default AdCard;
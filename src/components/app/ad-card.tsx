'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileText, ArrowRight } from 'lucide-react';
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

  const imageUrl = React.useMemo(() => {
    const id = article.id?.toLowerCase() || '';
    const title = (article.title || '').toLowerCase();

    if (id.includes('association') || title.includes('association')) return "/images/article-motars-association.png";
    if (id.includes('zfe') || title.includes('zfe')) return "/images/motardZFEarticle2.webp";
    if (id.includes('assurance') || title.includes('assurance')) return "/images/motard-article-assurance20262.webp";
    if (id.includes('a2') || title.includes('a2')) return "/images/achat-occasion.webp";
    if (id.includes('taille') || title.includes('taille') || title.includes('hauteur')) return "/images/motard-articles-hauteurdeselle.webp";
    if (id.includes('occasion') || id.includes('pieges') || title.includes('pièges')) return "/images/evitelespieges.webp";
    if (id.includes('budget') || title.includes('budget')) return "/images/motard-budget-reel.webp";
    if (id.includes('entretien') || title.includes('entretien') || title.includes('révision')) return "/images/motard-entretien-page.webp";
    
    if (article.imageUrl && article.imageUrl.trim() !== '') return article.imageUrl;
    return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop";
  }, [article]);

  const href = `/info/${article.id}`;

  return (
    <Link href={href} className="group block w-full">
      <Card className={cn(
        "w-full ml-auto overflow-hidden transition-all duration-500 ease-in-out border-l-4 hover:shadow-lg shadow-sm min-h-[140px] flex items-stretch relative rounded-2xl border-brand border-brand/20 bg-gradient-to-r from-brand/[0.02] to-background"
      )}>
        <div className="relative w-[200px] sm:w-56 md:w-72 flex-shrink-0 overflow-hidden bg-muted">
          <Image 
            src={imageUrl} 
            alt={article.title} 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-110" 
            data-ai-hint={article.imageHint || "motorcycle"} 
            sizes="(max-width: 768px) 200px, 300px" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
             <h3 className="font-black text-[10px] md:text-sm text-white leading-tight uppercase drop-shadow-md">
                {article.title}
             </h3>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[7px] md:text-[9px] font-black text-white rounded-full px-2 py-0.5 uppercase tracking-widest shadow-lg z-20 bg-brand">
            <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>Guide</span>
          </div>
        </div>

        <div className="flex flex-col justify-center flex-grow p-3 sm:p-4 md:p-5 min-w-0 z-10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="h-[1.5px] w-4 bg-brand/40" />
            <span className="text-[8px] uppercase tracking-widest font-black text-brand/70">Conseil Moto</span>
          </div>
          <p className="text-[9px] md:text-xs text-muted-foreground line-clamp-3 leading-relaxed font-medium">{article.description}</p>
        </div>

        <div className="flex flex-shrink-0 w-16 sm:w-24 flex-col justify-center items-center p-2 sm:p-3 bg-muted/[0.01] border-l border-border/50 z-10">
           <div className="flex flex-col items-center gap-2">
             <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full flex flex-col items-center justify-center text-white shadow-md transition-all group-hover:scale-110 group-hover:shadow-brand/20 bg-brand shadow-brand/10">
               <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
               <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-tighter leading-none mt-0.5">Lire</span>
             </div>
           </div>
        </div>
      </Card>
    </Link>
  );
};

export default AdCard;
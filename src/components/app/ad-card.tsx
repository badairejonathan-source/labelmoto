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
}

const AdCard: React.FC<AdCardProps> = ({ article }) => {
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
    <Link href={`/info/${article.id}`} className="group block w-full">
      <Card className="w-full ml-auto overflow-hidden transition-all duration-500 ease-in-out border border-brand/20 border-l-4 border-l-brand hover:shadow-lg bg-gradient-to-r from-brand/[0.02] to-background shadow-sm min-h-[100px] md:min-h-[130px] flex relative">
        {/* Background Decorative Element */}
        <div className="absolute -top-2 -right-2 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
            <FileText className="w-24 h-24 text-brand" />
        </div>

        <div className="flex w-full h-full items-stretch z-10">
          {/* Section Image */}
          <div className="relative w-24 sm:w-32 md:w-40 flex-shrink-0 overflow-hidden self-stretch shadow-inner bg-muted">
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              data-ai-hint={article.imageHint || "motorcycle"}
              sizes="(max-width: 768px) 96px, 160px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] md:text-[10px] font-black text-white bg-brand rounded-full px-2 py-0.5 uppercase tracking-widest shadow-lg">
              <FileText className="h-2.5 w-2.5 md:h-3 md:w-3" />
              <span className="hidden sm:inline">Guide</span>
            </div>
          </div>

          {/* Section Contenu Principal */}
          <div className="flex flex-col justify-center flex-grow p-3 md:p-5 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
                <div className="h-[1.5px] w-4 bg-brand/40" />
                <span className="text-[8px] uppercase tracking-widest font-black text-brand/70">Conseil Moto</span>
            </div>
            <h3 className="font-black text-sm md:text-lg text-foreground leading-tight uppercase group-hover:text-brand transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed font-medium">
              {article.description}
            </p>
          </div>

          {/* Zone Action */}
          <div className="hidden md:flex flex-shrink-0 w-32 flex-col justify-center items-center p-4 bg-brand/[0.01] border-l border-brand/5">
             <div className="flex flex-col items-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand transition-colors">Découvrir</span>
                <div className="inline-flex items-center justify-center rounded-full bg-brand text-brand-foreground font-black text-[10px] uppercase tracking-widest px-5 h-8 shadow-md shadow-brand/10 transition-all group-hover:scale-105 group-hover:shadow-brand/20 group-hover:-translate-y-0.5">
                   Lire
                   <ArrowRight className="ml-1.5 h-3 w-3" />
                </div>
             </div>
          </div>
          
          <div className="md:hidden flex items-center pr-4 bg-brand/[0.01]">
             <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-4 h-4" />
             </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AdCard;

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
    imageUrl: string;
    imageHint: string;
  };
}

const AdCard: React.FC<AdCardProps> = ({ article }) => {
  if (!article) return null;

  return (
    <Link href={`/info/${article.id}`} className="group block">
      <Card className="w-[18cm] ml-auto overflow-hidden transition-all duration-300 ease-in-out border-2 border-brand hover:shadow-lg bg-muted/50 shadow-sm min-h-[180px] flex">
        <div className="flex w-full h-full items-stretch">
          {/* Section Image - Environ 6cm */}
          <div className="relative w-48 md:w-[6cm] flex-shrink-0 overflow-hidden border-r bg-muted self-stretch">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint={article.imageHint}
              sizes="(max-width: 768px) 12rem, 6cm"
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-black text-white bg-brand rounded-full px-3 py-1 uppercase tracking-wider shadow-md">
              <FileText className="h-3.5 w-3.5" />
              <span>Guide Pratique</span>
            </div>
          </div>

          {/* Section Contenu Principal - Environ 8cm */}
          <div className="flex flex-col justify-center flex-grow p-6 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-black text-brand mb-2">
              <span>Conseil de la communauté</span>
            </div>
            <h3 className="font-bold text-xl md:text-2xl text-foreground leading-tight uppercase group-hover:text-brand transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed max-w-[90%]">
              {article.description}
            </p>
          </div>

          {/* Séparateur subtil vertical */}
          <div className="hidden md:block w-px bg-border/40 my-8 self-stretch" />

          {/* Zone Action - Environ 4cm */}
          <div className="hidden md:flex flex-shrink-0 w-[4cm] flex-col justify-center items-center p-6 gap-4">
             <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
             </div>
             <div className="inline-flex items-center justify-center rounded-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-[10px] uppercase tracking-widest px-4 h-10 shadow-sm transition-all group-hover:shadow-brand/20 group-hover:-translate-y-0.5 whitespace-nowrap">
               Lire la suite
               <ArrowRight className="ml-2 h-3.5 w-3.5" />
             </div>
          </div>
          
          {/* Version mobile de la zone action (si besoin de forcer un aspect condensé) */}
          <div className="md:hidden flex items-center pr-4">
             <ArrowRight className="w-6 h-6 text-brand" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AdCard;

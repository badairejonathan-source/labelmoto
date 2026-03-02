
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
    <Link href={`/info/${article.id}`} className="group block w-full">
      <Card className="w-full ml-auto overflow-hidden transition-all duration-300 ease-in-out border-2 border-brand hover:shadow-lg bg-muted/50 shadow-sm min-h-[160px] md:min-h-[200px] flex">
        <div className="flex w-full h-full items-stretch">
          {/* Section Image */}
          <div className="relative w-28 sm:w-36 md:w-48 flex-shrink-0 overflow-hidden border-r bg-muted self-stretch">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint={article.imageHint}
              sizes="(max-width: 768px) 112px, 192px"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] md:text-[10px] font-black text-white bg-brand rounded-full px-2 py-0.5 uppercase tracking-wider shadow-md">
              <FileText className="h-3 w-3 md:h-3.5 md:w-3.5" />
              <span className="hidden sm:inline">Guide Pratique</span>
            </div>
          </div>

          {/* Section Contenu Principal */}
          <div className="flex flex-col justify-center flex-grow p-4 md:p-6 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-black text-brand mb-1 md:mb-2">
              <span>Conseil de la communauté</span>
            </div>
            <h3 className="font-black text-base md:text-2xl text-foreground leading-tight uppercase group-hover:text-brand transition-colors">
              {article.title}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed max-w-[95%]">
              {article.description}
            </p>
          </div>

          {/* Zone Action (Desktop) */}
          <div className="hidden md:flex flex-shrink-0 w-32 flex-col justify-center items-center p-6 border-l bg-brand/5">
             <div className="inline-flex items-center justify-center rounded-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-[10px] uppercase tracking-widest px-4 h-10 shadow-sm transition-all group-hover:shadow-brand/20 group-hover:-translate-y-0.5 whitespace-nowrap">
               Lire
               <ArrowRight className="ml-2 h-3.5 w-3.5" />
             </div>
          </div>
          
          {/* Version mobile de la zone action */}
          <div className="md:hidden flex items-center pr-4 border-l bg-brand/5">
             <ArrowRight className="w-6 h-6 text-brand" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AdCard;

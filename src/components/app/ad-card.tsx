
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
      <Card className="w-full ml-auto overflow-hidden transition-all duration-500 ease-in-out border border-brand/20 border-l-4 border-l-brand hover:shadow-2xl hover:shadow-brand/10 bg-gradient-to-r from-brand/[0.03] to-background shadow-md min-h-[140px] md:min-h-[180px] flex relative">
        {/* Background Decorative Element */}
        <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
            <FileText className="w-32 h-32 text-brand" />
        </div>

        <div className="flex w-full h-full items-stretch z-10">
          {/* Section Image */}
          <div className="relative w-32 sm:w-40 md:w-56 flex-shrink-0 overflow-hidden self-stretch shadow-inner">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              data-ai-hint={article.imageHint}
              sizes="(max-width: 768px) 128px, 224px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[9px] md:text-[11px] font-black text-white bg-brand rounded-full px-3 py-1 uppercase tracking-widest shadow-xl ring-1 ring-white/20">
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Guide</span>
            </div>
          </div>

          {/* Section Contenu Principal */}
          <div className="flex flex-col justify-center flex-grow p-5 md:p-8 min-w-0">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-[2px] w-6 bg-brand/40" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand/70">Conseil Moto</span>
            </div>
            <h3 className="font-black text-base md:text-2xl text-foreground leading-tight uppercase group-hover:text-brand transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed font-medium">
              {article.description}
            </p>
          </div>

          {/* Zone Action (Desktop) */}
          <div className="hidden md:flex flex-shrink-0 w-44 flex-col justify-center items-center p-8 bg-brand/[0.02] border-l border-brand/5">
             <div className="flex flex-col items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-brand transition-colors">Découvrir</span>
                <div className="inline-flex items-center justify-center rounded-full bg-brand text-brand-foreground font-black text-sm uppercase tracking-widest px-8 h-12 shadow-lg shadow-brand/20 transition-all group-hover:scale-105 group-hover:shadow-brand/40 group-hover:-translate-y-1">
                   Lire
                   <ArrowRight className="ml-2 h-4 w-4" />
                </div>
             </div>
          </div>
          
          {/* Version mobile de la zone action */}
          <div className="md:hidden flex items-center pr-6 bg-brand/[0.02]">
             <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-6 h-6" />
             </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AdCard;

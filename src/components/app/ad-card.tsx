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
    <Link href={`/info/${article.id}`} className="group block h-full">
      <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out border-2 border-brand hover:shadow-lg bg-muted/50 shadow-sm min-h-[180px] flex">
        <div className="md:flex w-full h-full items-stretch">
          {/* Section Image */}
          <div className="relative w-40 md:w-64 flex-shrink-0 md:rounded-l-lg md:rounded-r-none rounded-t-lg overflow-hidden md:border-r bg-muted self-stretch">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint={article.imageHint}
              sizes="(max-width: 768px) 10rem, 16rem"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-black text-white bg-brand rounded-full px-2 py-0.5 uppercase tracking-wider shadow-md">
              <FileText className="h-3 w-3" />
              <span>Guide</span>
            </div>
          </div>

          {/* Section Contenu */}
          <div className="flex flex-col md:flex-row flex-1 p-4 md:p-6 md:justify-between gap-4 items-center md:items-stretch">
            {/* Info Principale */}
            <div className="flex flex-col justify-center flex-grow min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-brand mb-1">
                <span>Conseil Pratique</span>
              </div>
              <h3 className="font-bold text-xl md:text-2xl text-foreground leading-tight uppercase group-hover:text-brand transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {article.description}
              </p>
            </div>

            {/* Séparateur vertical */}
            <div className="hidden md:block w-px bg-border/70 mx-6 self-stretch" />

            {/* Zone Action */}
            <div className="flex-shrink-0 md:w-64 flex flex-col justify-center items-center md:items-end gap-4">
               <p className="text-xs text-center md:text-right text-muted-foreground font-medium max-w-[200px] hidden md:block leading-relaxed">
                 Découvrez nos guides complets pour rouler sereinement et maîtriser votre passion.
               </p>
               <div className="w-full md:w-auto inline-flex items-center justify-center rounded-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-xs uppercase tracking-widest px-8 h-12 shadow-sm transition-all group-hover:shadow-brand/20 group-hover:-translate-y-0.5">
                 Lire l'article
                 <ArrowRight className="ml-2 h-4 w-4" />
               </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AdCard;
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

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
    <Link href={`/info/${article.id}`} className={cn(
        "w-full h-24 flex items-center justify-between overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md border bg-secondary text-secondary-foreground",
    )}>
        <div className="flex flex-col justify-center flex-grow h-full p-4">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-brand">
              <FileText className="h-3 w-3"/>
              <span>Conseil Pratique</span>
            </div>
            <h4 className="font-bold text-sm leading-tight mt-1 line-clamp-1">{article.title}</h4>
            <p className="text-xs mt-1 opacity-90 line-clamp-2">{article.description}</p>
        </div>
        <div className="relative h-full w-24 flex-shrink-0">
            <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                data-ai-hint={article.imageHint}
                sizes="96px"
            />
        </div>
    </Link>
  );
};

export default AdCard;

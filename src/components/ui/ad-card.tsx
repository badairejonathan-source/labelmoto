'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

const AdCard: React.FC = () => {
  const article = {
    id: '5',
    imageUrl: '/images/evitelespieges.jpg',
    imageHint: 'motorcycle road trip',
    title: 'Le Guide Indispensable',
    subtitle: "Achat moto d’occasion : évitez les pièges.",
    cta: 'Lire le guide',
    bgColor: 'bg-secondary',
    textColor: 'text-secondary-foreground',
  };

  return (
    <Link href={`/info/${article.id}`} className={cn(
        "w-full h-24 flex items-center justify-between overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md border",
        article.bgColor,
        article.textColor,
    )}>
        <div className="flex flex-col justify-center flex-grow h-full p-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold opacity-80">
              <FileText className="h-3 w-3"/>
              <span>Article à la une</span>
            </div>
            <h4 className="font-bold text-sm leading-tight mt-1">{article.title}</h4>
            <p className="text-xs mt-1 opacity-90">{article.subtitle}</p>
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

    

    
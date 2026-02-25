
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const AdBanner: React.FC = () => {
  const article = {
    id: '5',
    imageUrl: '/images/evitelespieges.jpg',
    imageHint: 'motorcycle road trip',
    title: 'Achat moto d’occasion : le guide pour éviter les pièges',
  };

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <Link href={`/info/${article.id}`} className="block relative w-full h-32 group">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={article.imageHint}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold">
            <FileText className="h-3 w-3" />
            <span>Guide pratique</span>
          </div>
          <h4 className="font-bold text-sm leading-tight mt-1 group-hover:underline">{article.title}</h4>
        </div>
      </Link>
    </Card>
  );
};

export default AdBanner;

    
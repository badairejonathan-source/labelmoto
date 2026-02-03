'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const fakeAds = [
  {
    id: 1,
    imageSeed: 'ad-gear-6',
    imageHint: 'motorcycle gear',
    title: "L'aventure vous appelle",
    subtitle: 'Équipement premium. Jusqu\'à -25% !',
    cta: 'Découvrir',
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
  },
  {
    id: 2,
    imageSeed: 'ad-insurance-6',
    imageHint: 'motorcycle insurance',
    title: 'Roulez l\'esprit tranquille',
    subtitle: 'Votre assurance moto dès 12€/mois.',
    cta: 'Mon Devis Gratuit',
    bgColor: 'bg-primary',
    textColor: 'text-primary-foreground',
  },
  {
    id: 3,
    imageSeed: 'ad-roadtrip-6',
    imageHint: 'motorcycle roadtrip',
    title: 'Évadez-vous en Duo',
    subtitle: 'Nos plus beaux road-trips pour 2.',
    cta: 'Explorer',
    bgColor: 'bg-white',
    textColor: 'text-foreground',
  },
  {
    id: 4,
    imageSeed: 'ad-custom-6',
    imageHint: 'custom motorcycle',
    title: 'Votre Moto, Votre Style',
    subtitle: 'Pièces custom et accessoires uniques.',
    cta: 'Personnaliser',
    bgColor: 'bg-accent',
    textColor: 'text-accent-foreground',
  }
];

const AdCard: React.FC = () => {
  const [ad, setAd] = useState<(typeof fakeAds)[0] | null>(null);

  useEffect(() => {
    setAd(fakeAds[Math.floor(Math.random() * fakeAds.length)]);
  }, []);

  if (!ad) {
    return (
      <Card className="w-full h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-dashed animate-pulse" />
    );
  }

  const imageUrl = `https://picsum.photos/seed/${ad.imageSeed}/96/96`;

  return (
    <a href="#" target="_blank" rel="noopener noreferrer" className={cn(
        "w-full max-w-56 mx-auto h-24 flex items-center justify-between overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md",
        ad.bgColor,
        ad.textColor,
        ad.bgColor === 'bg-white' && 'border border-border'
    )}>
        <div className="flex flex-col justify-center flex-grow h-full p-4">
            <p className="text-xs uppercase tracking-wider font-semibold opacity-80">Publicité</p>
            <h4 className="font-bold text-sm leading-tight mt-1">{ad.title}</h4>
            <p className="text-xs mt-1 opacity-90">{ad.subtitle}</p>
        </div>
        <div className="relative h-full w-24 flex-shrink-0">
            <Image
                src={imageUrl}
                alt={ad.title}
                fill
                className="object-cover"
                data-ai-hint={ad.imageHint}
                sizes="96px"
            />
        </div>
    </a>
  );
};

export default AdCard;

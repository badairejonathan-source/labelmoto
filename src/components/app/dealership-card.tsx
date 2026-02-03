
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, CheckCircle, Phone, Globe, Clock } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import MotoTrustLogo from './logo';
import { cn } from '@/lib/utils';

interface DealershipCardProps {
  dealership: Dealership;
  onClick?: () => void;
  className?: string;
  isExpanded?: boolean;
}

const DealershipCard: React.FC<DealershipCardProps> = ({
  dealership,
  onClick,
  className,
  isExpanded = false,
}) => {
  const title = dealership.title || '';
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;

  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  return (
    <Card
      onClick={(e: React.MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('a')) {
          return;
        }
        onClick?.();
      }}
      className={cn(
        "w-full max-w-64 mx-auto overflow-hidden transition-all duration-300 ease-in-out flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50",
        className,
      )}
    >
      <div className="flex flex-row h-36">
        <div className="relative w-24 flex-shrink-0">
          {dealership.imgUrl ? (
            <Image
              src={dealership.imgUrl}
              alt={`Photo de ${title}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
             <div className="w-full h-full bg-gray-200 flex items-center justify-center p-1">
              <MotoTrustLogo className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="p-3 flex-grow relative flex flex-col min-w-0 justify-center gap-2">
            <div>
                <div className="flex justify-between items-start gap-2">
                   <div className="flex-grow min-w-0 flex-shrink">
                    <h3 className="font-bold text-sm text-primary dark:text-primary-foreground leading-tight truncate">
                      {title}
                    </h3>
                  </div>
                  {rating > 0 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 flex-shrink-0">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {dealership.address && (
                    <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground mt-1 flex items-start hover:text-accent hover:underline">
                        <MapPin className="h-3 w-3 mr-1.5 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{dealership.address}</span>
                    </a>
                )}
            </div>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-muted-foreground min-w-0">
                    <Phone className="h-3 w-3 mr-1.5 shrink-0" />
                    {dealership.phoneNumber ? (
                        <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex items-center min-w-0 hover:text-accent hover:underline">
                            <span className="truncate">{dealership.phoneNumber}</span>
                        </a>
                    ) : (
                        <span>Non disponible</span>
                    )}
                </div>
                <div className="flex items-center text-green-600 font-medium shrink-0 ml-2">
                   <CheckCircle className="h-3 w-3 mr-1" />
                   <span className="text-xs">Vérifié</span>
                </div>
            </div>
        </CardContent>
      </div>

      {isExpanded && (
        <div className="p-3 border-t border-border/50 bg-background/50 text-xs">
          <div className="space-y-2">
            {dealership.website && (
              <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent hover:underline">
                <Globe className="h-4 w-4 mr-2 shrink-0"/>
                <span className="truncate">{dealership.website.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>
              </a>
            )}
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 shrink-0 mt-0.5"/>
              <div>
                <span className="font-medium">Horaires :</span>
                <ul className="mt-1 space-y-0.5">
                  {weekDays.map(day => {
                    const hours = dealership[day]
                    if (!hours || hours.toLowerCase() === 'non renseigné') return null;
                    return (
                        <li key={day} className="flex justify-between">
                        <span className="capitalize w-20">{day}:</span>
                        <span className="text-right flex-1">{hours}</span>
                        </li>
                    )
                  }).filter(Boolean)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DealershipCard;

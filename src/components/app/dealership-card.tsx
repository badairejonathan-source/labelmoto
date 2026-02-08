'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Store } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import MotoTrustLogo from './logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

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
  const [isImageOpen, setIsImageOpen] = useState(false);

  const title = dealership.title || '';
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;

  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  const directionsUrl = dealership.latitude && dealership.longitude 
    ? `https://www.google.com/maps/dir/?api=1&destination=${dealership.latitude},${dealership.longitude}`
    : dealership.placeUrl;
  
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dealership.imgUrl) {
      setIsImageOpen(true);
    }
  };

  const imageDialog = dealership.imgUrl ? (
    <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
      <DialogContent className="p-0 border-0 max-w-4xl bg-transparent shadow-none">
        <DialogTitle className="sr-only">{`Photo de ${title}`}</DialogTitle>
        <Image
          src={dealership.imgUrl}
          alt={`Photo de ${title}`}
          width={1200}
          height={800}
          className="object-contain w-full h-auto max-h-[90vh] rounded-lg"
        />
      </DialogContent>
    </Dialog>
  ) : null;

  if (isExpanded) {
    return (
      <>
        {imageDialog}
        <Card className={cn("w-full overflow-hidden flex", className)}>
          <div className="flex-1 p-4 border-r">
            <div className="flex">
              <div
                onClick={handleImageClick}
                className={cn(
                  "relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden border",
                  dealership.imgUrl && "cursor-zoom-in"
                )}
              >
                {dealership.imgUrl ? (
                  <Image
                    src={dealership.imgUrl}
                    alt={`Photo de ${title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 6rem, 8rem"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center p-1">
                    <MotoTrustLogo className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {rating > 0 && (
                  <div className="absolute top-1 left-1 flex items-center gap-1 text-xs font-bold text-white bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 pointer-events-none">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="pl-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-foreground leading-tight cursor-pointer" onClick={onClick}>
                    {title}
                  </h3>
                </div>
                <div className="space-y-3 mt-2">
                  <TooltipProvider>
                    <div className="flex items-center gap-4">
                      {dealership.placeUrl && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-accent transition-colors">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border hover:border-accent">
                                    <Store className="w-5 h-5"/>
                                </div>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent><p>Fiche Google</p></TooltipContent>
                        </Tooltip>
                      )}
                      {dealership.phoneNumber && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-accent transition-colors">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border hover:border-accent">
                                    <Phone className="w-5 h-5"/>
                                </div>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent><p>Appeler</p></TooltipContent>
                        </Tooltip>
                      )}
                      {dealership.website && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-accent transition-colors">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border hover:border-accent">
                                    <Globe className="w-5 h-5"/>
                                </div>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent><p>Site Web</p></TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                   {dealership.address && (
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-left text-foreground hover:text-accent group">
                              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent transition-colors"/>
                              <span className="underline-offset-4 group-hover:underline">{dealership.address}</span>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent><p>Y aller</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 w-64 flex-shrink-0 bg-background/50">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Horaires</p>
              <ul className="space-y-1 text-sm">
                {weekDays.map(day => {
                  const hours = dealership[day as keyof Dealership];
                  const isClosed = !hours || typeof hours !== 'string' || hours.toLowerCase() === 'non renseigné' || hours.toLowerCase() === 'fermé';
                  return (
                      <li key={day} className={cn("flex justify-between", isClosed && "text-muted-foreground")}>
                        <span className="capitalize w-24">{day}</span>
                        <span className={cn("text-right flex-1 font-mono", isClosed && "font-sans")}>{isClosed ? 'Fermé' : hours}</span>
                      </li>
                  )
                })}
              </ul>
          </div>
        </Card>
      </>
    );
  }

  // Collapsed view
  return (
    <>
      {imageDialog}
      <Card
        onClick={onClick}
        className={cn(
          "w-full overflow-hidden transition-all duration-300 ease-in-out flex flex-row p-3 items-center cursor-pointer hover:bg-secondary/50",
          className
        )}
      >
        <div
          onClick={handleImageClick}
          className={cn(
            "relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border",
            dealership.imgUrl && "cursor-zoom-in"
          )}
        >
          {dealership.imgUrl ? (
            <Image
              src={dealership.imgUrl}
              alt={`Photo de ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 5rem, 6rem"
            />
          ) : (
             <div className="w-full h-full bg-gray-200 flex items-center justify-center p-1">
              <MotoTrustLogo className="w-8 h-8 text-gray-400" />
            </div>
          )}
          {rating > 0 && (
            <div className="absolute top-1 left-1 flex items-center gap-1 text-xs font-bold text-white bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 pointer-events-none">
              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="pl-4 flex-grow min-w-0">
          <h3 className="font-bold text-base text-foreground leading-tight truncate">
            {title}
          </h3>
          {dealership.address && <p className="text-sm text-muted-foreground truncate mt-1">{dealership.address}</p>}
        </div>
      </Card>
    </>
  );
};

export default DealershipCard;

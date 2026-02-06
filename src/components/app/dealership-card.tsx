'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
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
    // Render the new expanded layout from the user's image
    return (
      <>
        {imageDialog}
        <Card
          onClick={(e: React.MouseEvent) => {
            if (e.target instanceof HTMLElement && e.target.closest('a')) {
              return;
            }
            onClick?.();
          }}
          className={cn(
            "w-full overflow-hidden transition-all duration-300 ease-in-out flex flex-col cursor-pointer",
            className,
          )}
        >
          <div className="flex flex-col">
              {/* Header with image and name */}
              <div className="flex flex-row items-center p-4 border-b border-border/50 bg-card">
                  <div
                    onClick={handleImageClick}
                    className={cn(
                      "relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border",
                      dealership.imgUrl && "cursor-zoom-in"
                    )}
                  >
                    {dealership.imgUrl ? (
                    <Image
                      src={dealership.imgUrl}
                      alt={`Photo de ${title}`}
                      fill
                      className="object-cover"
                      sizes="64px"
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
                  <div className="pl-4 flex flex-col justify-center min-w-0">
                      <h3 className="font-bold text-base text-foreground leading-tight">
                        {title}
                      </h3>
                  </div>
              </div>
              
              <div className="p-4 space-y-4 bg-background/50">
                  {/* Action buttons */}
                  <div className="flex justify-around">
                      {dealership.placeUrl && (
                        <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors">
                            <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center border hover:border-accent">
                                <Store className="w-5 h-5"/>
                            </div>
                            <span>Fiche Google</span>
                        </a>
                      )}
                      {dealership.phoneNumber && (
                        <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors">
                            <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center border hover:border-accent">
                                <Phone className="w-5 h-5"/>
                            </div>
                            <span>Appeler</span>
                        </a>
                      )}
                      {dealership.website && (
                        <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors">
                            <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center border hover:border-accent">
                                <Globe className="w-5 h-5"/>
                            </div>
                            <span>Site Web</span>
                        </a>
                      )}
                  </div>

                  {/* Address */}
                   {dealership.address && (
                    <TooltipProvider delayDuration={100}>
                      <div className="text-center border-t border-border/50 pt-3 mt-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Adresse</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm text-center text-foreground hover:text-accent group">
                                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent transition-colors"/>
                                <span className="underline-offset-4 group-hover:underline">{dealership.address}</span>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Y aller</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  )}

                  {/* Opening Hours */}
                  <div className="border-t border-border/50 pt-3 mt-3">
                    <div className="text-center mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Horaires</p>
                    </div>
                    <div className="rounded-md border p-2 bg-card text-xs">
                      <ul className="space-y-1">
                        {weekDays.map(day => {
                          const hours = dealership[day as keyof Dealership];
                          const isClosed = !hours || typeof hours !== 'string' || hours.toLowerCase() === 'non renseigné' || hours.toLowerCase() === 'fermé';
                          return (
                              <li key={day} className={cn("flex justify-between", isClosed && "text-muted-foreground")}>
                                <span className="capitalize w-20">{day}:</span>
                                <span className={cn("text-right flex-1", !isClosed && "font-mono")}>{isClosed ? 'Fermé' : hours}</span>
                              </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
              </div>
          </div>
        </Card>
      </>
    );
  }

  // Render the collapsed view for the horizontal mobile list
  return (
    <>
      {imageDialog}
      <Card
        onClick={(e: React.MouseEvent) => {
          if (e.target instanceof HTMLElement && e.target.closest('a')) {
            return;
          }
          onClick?.();
        }}
        className={cn(
          "w-full mx-auto overflow-hidden transition-all duration-300 ease-in-out flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <div
            onClick={handleImageClick}
            className={cn(
              "relative w-full h-24 flex-shrink-0",
              dealership.imgUrl && "cursor-zoom-in"
            )}
          >
            {dealership.imgUrl ? (
              <Image
                src={dealership.imgUrl}
                alt={`Photo de ${title}`}
                fill
                className="object-cover"
                sizes="14rem"
              />
            ) : (
               <div className="w-full h-full bg-gray-200 flex items-center justify-center p-1">
                <MotoTrustLogo className="w-10 h-10 text-gray-400" />
              </div>
            )}
            {rating > 0 && (
              <div className="absolute top-1 left-1 flex items-center gap-1 text-xs font-bold text-white bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 pointer-events-none">
                <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <CardContent className="p-2 flex-grow relative flex flex-col min-w-0 justify-start gap-1">
              <h3 className="font-bold text-sm text-primary dark:text-primary-foreground leading-tight truncate">
                {title}
              </h3>
              {dealership.address && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-start">
                      <MapPin className="h-3 w-3 mr-1.5 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{dealership.address}</span>
                  </div>
              )}
          </CardContent>
        </div>
      </Card>
    </>
  );
};

export default DealershipCard;

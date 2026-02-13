'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Store } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface DealershipCardProps {
  dealership: Dealership;
  onClick?: () => void;
  className?: string;
}

const DealershipCard: React.FC<DealershipCardProps> = ({
  dealership,
  onClick,
  className,
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

  return (
    <>
      {imageDialog}
      <Card
        onClick={onClick}
        className={cn(
          "w-full overflow-hidden transition-shadow duration-300 ease-in-out cursor-pointer hover:shadow-md",
          className
        )}
      >
        <div className="md:flex">
          {/* Image */}
          <div
            onClick={handleImageClick}
            className={cn(
              "relative w-full h-48 md:w-48 md:h-auto flex-shrink-0 md:rounded-l-lg md:rounded-r-none rounded-t-lg overflow-hidden md:border-r",
              dealership.imgUrl && "cursor-zoom-in"
            )}
          >
            {dealership.imgUrl ? (
              <Image
                src={dealership.imgUrl}
                alt={`Photo de ${title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 12rem"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center p-1">
                <LabelMotoLogo className="w-10 h-10 text-gray-400" />
              </div>
            )}
            {rating > 0 && (
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1 text-xs font-bold text-white bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 pointer-events-none">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row flex-1 p-4 md:justify-between gap-4">
            {/* Main Info */}
            <div className="flex flex-col justify-between flex-grow min-w-0">
              <h3 className="font-bold text-lg text-foreground leading-tight">
                {title}
              </h3>
              
              <div className="flex items-start text-center gap-4 text-muted-foreground text-xs mt-3">
                  {dealership.placeUrl && (
                      <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:text-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Store className="w-5 h-5"/>
                          <span>Fiche Google</span>
                      </a>
                  )}
                  {dealership.phoneNumber && (
                      <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 hover:text-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Phone className="w-5 h-5"/>
                          <span>Appeler</span>
                      </a>
                  )}
                  {dealership.website && (
                      <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:text-accent transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Globe className="w-5 h-5"/>
                          <span>Site Web</span>
                      </a>
                  )}
              </div>

              {dealership.address && 
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-sm text-left text-muted-foreground hover:text-accent group mt-3" onClick={(e) => e.stopPropagation()}>
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5"/>
                    <span className="group-hover:underline">{dealership.address}</span>
                </a>
              }
            </div>

            {/* Separator */}
            <div className="w-full h-px md:w-px md:h-auto bg-border/70 my-4 md:my-0 md:mx-4" />

            {/* Hours */}
            <div className="flex-shrink-0 md:w-52">
              <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-sm">
                {weekDays.map(day => {
                  const hours = dealership[day as keyof Dealership];
                  const isClosed = !hours || typeof hours !== 'string' || hours.toLowerCase() === 'non renseigné' || hours.toLowerCase() === 'fermé';
                  return (
                      <React.Fragment key={day}>
                        <span className={cn("capitalize text-xs font-medium", isClosed && "text-muted-foreground/70")}>{day}</span>
                        <span className={cn("font-mono text-xs text-right whitespace-nowrap", isClosed && "font-sans text-muted-foreground/70")}>{isClosed ? 'Fermé' : hours}</span>
                      </React.Fragment>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DealershipCard;

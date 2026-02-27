
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Store, Mail } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface DealershipCardProps {
  dealership: Dealership;
  onClick?: () => void;
  className?: string;
}

const categoryDisplay: { [key: string]: string } = {
  'concession': 'Concession',
  'atelier': 'Atelier',
  'concession-atelier': 'Concession & Atelier',
  'accessoiriste': 'Accessoiriste',
  'autre': 'Autre',
};

const DealershipCard: React.FC<DealershipCardProps> = ({
  dealership,
  onClick,
  className,
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const title = dealership.title || '';
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  
  const rawCategory = dealership.category || '';
  const categoryLabel = categoryDisplay[rawCategory.toLowerCase()] || rawCategory;

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
          "w-full overflow-hidden transition-shadow duration-300 ease-in-out cursor-pointer hover:shadow-md border-border/50 shadow-sm",
          className
        )}
      >
        <div className="md:flex">
          {/* Image */}
          <div
            onClick={handleImageClick}
            className={cn(
              "relative w-full h-48 md:w-48 md:h-auto flex-shrink-0 md:rounded-l-lg md:rounded-r-none rounded-t-lg overflow-hidden md:border-r bg-muted/30",
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
              <div className="w-full h-full flex items-center justify-center p-4">
                <LabelMotoLogo className="w-full opacity-20 grayscale" />
              </div>
            )}
            {rating > 0 && (
              <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-black text-white bg-black/70 backdrop-blur-md rounded-full px-2 py-0.5 pointer-events-none shadow-sm">
                <Star className="h-3 w-3 fill-brand text-brand" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row flex-1 p-4 md:justify-between gap-4">
            {/* Main Info */}
            <div className="flex flex-col justify-between flex-grow min-w-0">
              <div>
                <h3 className="font-bold text-lg text-foreground leading-tight uppercase truncate">
                  {title}
                </h3>
                {categoryLabel && (
                  <div className="text-brand text-[10px] font-black mt-1 uppercase tracking-wider">
                    {categoryLabel}
                  </div>
                )}
              </div>
              
              <div className="flex items-start gap-4 text-muted-foreground text-[10px] uppercase font-bold mt-3">
                  {dealership.placeUrl && (
                      <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Store className="w-5 h-5 text-brand"/>
                          <span className="max-w-[60px] leading-[1.1]">Google Maps</span>
                      </a>
                  )}
                  {dealership.phoneNumber && (
                      <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Phone className="w-5 h-5 text-brand"/>
                          <span>Appeler</span>
                      </a>
                  )}
                  {dealership.email && (
                      <a href={`mailto:${dealership.email}`} className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Mail className="w-5 h-5 text-brand"/>
                          <span>Email</span>
                      </a>
                  )}
                  {dealership.website && (
                      <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Globe className="w-5 h-5 text-brand"/>
                          <span>Site Web</span>
                      </a>
                  )}
              </div>

              {dealership.address && 
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-xs text-left text-muted-foreground hover:text-brand group mt-3 font-medium" onClick={(e) => e.stopPropagation()}>
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-brand"/>
                    <span className="group-hover:underline line-clamp-1">{dealership.address}</span>
                </a>
              }
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px bg-border/70 mx-4 h-auto self-stretch" />

            {/* Hours */}
            <div className="flex-shrink-0 md:w-52">
              <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1 text-sm">
                {weekDays.map(day => {
                  const hours = dealership[day as keyof Dealership];
                  const isClosed = !hours || typeof hours !== 'string' || hours.toLowerCase() === 'non renseigné' || hours.toLowerCase() === 'fermé';
                  return (
                      <React.Fragment key={day}>
                        <span className={cn("capitalize text-[10px] font-bold text-muted-foreground/80", isClosed && "text-muted-foreground/40")}>{day}</span>
                        <span className={cn("font-mono text-[10px] text-right whitespace-nowrap font-bold", isClosed && "font-sans text-muted-foreground/40")}>{isClosed ? 'FERMÉ' : hours}</span>
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


'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Store, Mail } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          "w-full overflow-hidden transition-shadow duration-300 ease-in-out cursor-pointer hover:shadow-md border-border/50 shadow-sm bg-card md:min-h-[160px]",
          className
        )}
      >
        {/* Mobile: Horizontal Scroll (Swipe) | Desktop: Static Layout */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:overflow-visible md:snap-none md:flex-row h-32 md:h-auto md:min-h-[160px]">
          
          {/* Main Content Area: Takes full width on mobile */}
          <div className="flex-none w-full min-w-full snap-start md:min-w-0 md:flex md:w-auto md:flex-1 h-full flex bg-card">
            {/* Image section */}
            <div
              onClick={handleImageClick}
              className={cn(
                "relative w-32 md:w-48 flex-shrink-0 md:rounded-l-lg md:rounded-r-none overflow-hidden md:border-r bg-muted/30 h-full min-h-[128px] md:min-h-[160px]",
                dealership.imgUrl && "cursor-zoom-in"
              )}
            >
              {dealership.imgUrl ? (
                <Image
                  src={dealership.imgUrl}
                  alt={`Photo de ${title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 8rem, 12rem"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2 md:p-4">
                  <LabelMotoLogo className="w-full opacity-20 grayscale" />
                </div>
              )}
              {rating > 0 && (
                <div className="absolute top-1 left-1 md:top-2 md:left-2 flex items-center gap-1 text-[8px] md:text-[10px] font-black text-white bg-black/70 backdrop-blur-md rounded-full px-1.5 py-0.5 pointer-events-none shadow-sm">
                  <Star className="h-2 w-2 md:h-3 md:w-3 fill-brand text-brand" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Business Info Section */}
            <div className="flex flex-col justify-center flex-1 p-3 md:p-6 min-w-0 h-full relative">
              <h3 className="font-bold text-sm md:text-2xl text-foreground leading-tight uppercase truncate">
                {title}
              </h3>
              {categoryLabel && (
                <div className="text-brand text-[9px] md:text-sm font-black mt-0.5 uppercase tracking-wider">
                  {categoryLabel}
                </div>
              )}
              
              <div className="flex items-center gap-3 md:gap-5 text-muted-foreground text-[8px] md:text-[10px] uppercase font-bold mt-2 md:mt-4">
                  {dealership.placeUrl && (
                      <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Store className="w-4 h-4 md:w-6 md:h-6 text-brand"/>
                          <span className="hidden sm:inline">Maps</span>
                      </a>
                  )}
                  {dealership.phoneNumber && (
                      <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex flex-col items-center gap-0.5 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Phone className="w-4 h-4 md:w-6 md:h-6 text-brand"/>
                          <span>Appel</span>
                      </a>
                  )}
                  {dealership.email && (
                      <a href={`mailto:${dealership.email}`} className="flex flex-col items-center gap-0.5 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Mail className="w-4 h-4 md:w-6 md:h-6 text-brand"/>
                          <span>Email</span>
                      </a>
                  )}
                  {dealership.website && (
                      <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Globe className="w-4 h-4 md:w-6 md:h-6 text-brand"/>
                          <span className="hidden sm:inline">Web</span>
                      </a>
                  )}
              </div>

              {dealership.address && 
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 md:gap-2 text-[9px] md:text-sm text-left text-muted-foreground hover:text-brand group mt-2 md:mt-4 font-medium" onClick={(e) => e.stopPropagation()}>
                          <MapPin className="h-3 w-3 md:h-4 md:w-4 shrink-0 mt-0.5 text-brand"/>
                          <span className="group-hover:underline line-clamp-1">{dealership.address}</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Y aller</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
            </div>
          </div>

          {/* Hours Section: Hidden by default on mobile, revealed via swipe left */}
          <div className="flex-none w-[220px] snap-end p-3 bg-muted/30 flex flex-col justify-center md:snap-none md:w-64 md:bg-transparent md:p-6 h-full border-l-2 border-brand/20 md:border-l md:border-border/70">
            <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 md:gap-y-1.5 text-sm">
              {weekDays.map(day => {
                const hours = dealership[day as keyof Dealership];
                const isClosed = !hours || typeof hours !== 'string' || hours.toLowerCase() === 'non renseigné' || hours.toLowerCase() === 'fermé';
                return (
                    <React.Fragment key={day}>
                      <span className={cn("capitalize text-[9px] md:text-[11px] font-bold text-muted-foreground/80", isClosed && "text-muted-foreground/40")}>{day}</span>
                      <span className={cn("font-mono text-[9px] md:text-[11px] text-right whitespace-nowrap font-black", isClosed && "font-sans text-muted-foreground/40")}>{isClosed ? 'FERMÉ' : hours}</span>
                    </React.Fragment>
                )
              })}
            </div>
          </div>

        </div>
      </Card>
    </>
  );
};

export default DealershipCard;

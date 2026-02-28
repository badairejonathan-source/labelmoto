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
          "w-full overflow-hidden transition-shadow duration-300 ease-in-out cursor-pointer hover:shadow-md border-border/50 shadow-sm bg-card flex flex-col",
          className
        )}
      >
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:overflow-visible md:snap-none md:flex-row h-full items-stretch">
          
          <div className="flex-none w-full min-w-full snap-start md:min-w-0 md:flex md:w-auto md:flex-1 h-full flex bg-card items-stretch">
            <div
              onClick={handleImageClick}
              className={cn(
                "relative w-40 md:w-64 flex-shrink-0 md:rounded-l-lg md:rounded-r-none overflow-hidden md:border-r bg-muted/30 self-stretch h-full min-h-[180px]",
                dealership.imgUrl && "cursor-zoom-in"
              )}
            >
              {dealership.imgUrl ? (
                <Image
                  src={dealership.imgUrl}
                  alt={`Photo de ${title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 10rem, 16rem"
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

            <div className="flex flex-col justify-center flex-1 p-4 md:p-6 min-w-0">
              <h3 className="font-bold text-lg md:text-2xl text-foreground leading-tight uppercase truncate">
                {title}
              </h3>
              {categoryLabel && (
                <div className="text-brand text-xs md:text-sm font-black mt-0.5 uppercase tracking-wider">
                  {categoryLabel}
                </div>
              )}
              
              <div className="flex items-center gap-4 md:gap-6 text-muted-foreground text-[10px] uppercase font-bold mt-3 md:mt-5">
                  {dealership.placeUrl && (
                      <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Store className="w-5 h-5 md:w-6 md:h-6 text-brand"/>
                          <span className="hidden sm:inline">Maps</span>
                      </a>
                  )}
                  {dealership.phoneNumber && (
                      <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Phone className="w-5 h-5 md:w-6 md:h-6 text-brand"/>
                          <span>Appel</span>
                      </a>
                  )}
                  {dealership.email && (
                      <a href={`mailto:${dealership.email}`} className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Mail className="w-5 h-5 md:w-6 md:h-6 text-brand"/>
                          <span>Email</span>
                      </a>
                  )}
                  {dealership.website && (
                      <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Globe className="w-5 h-5 md:w-6 md:h-6 text-brand"/>
                          <span className="hidden sm:inline">Web</span>
                      </a>
                  )}
              </div>

              {dealership.address && 
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-xs md:text-sm text-left text-muted-foreground hover:text-brand group mt-3 md:mt-5 font-medium" onClick={(e) => e.stopPropagation()}>
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand"/>
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

          <div className="flex-none w-[220px] snap-end p-4 bg-muted/30 flex flex-col justify-center md:snap-none md:w-64 md:bg-transparent md:p-6 self-stretch border-l-2 border-brand/20 md:border-l md:border-border/70">
            <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 md:gap-y-1.5 text-xs">
              {weekDays.map(day => {
                const hours = dealership[day as keyof Dealership];
                const isClosed = !hours || typeof hours !== 'string' || hours.toLowerCase() === 'non renseigné' || hours.toLowerCase() === 'fermé';
                return (
                    <React.Fragment key={day}>
                      <span className={cn("capitalize font-bold text-muted-foreground/80", isClosed && "text-muted-foreground/40")}>{day}</span>
                      <span className={cn("font-mono text-right whitespace-nowrap font-black", isClosed && "font-sans text-muted-foreground/40")}>{isClosed ? 'FERMÉ' : hours}</span>
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
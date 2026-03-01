'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Store, Mail, ChevronRight } from 'lucide-react';
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

  // Séparation de l'adresse : Rue sur ligne 1, CP Ville sur ligne 2
  const addressParts = dealership.address ? dealership.address.split(', ') : [];
  const street = addressParts[0] || '';
  const cityZip = addressParts.slice(1).join(', ') || '';

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
        className={cn(
          "w-[18cm] overflow-hidden transition-shadow duration-300 ease-in-out border-border/50 shadow-sm bg-card ml-auto",
          className
        )}
      >
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar items-stretch min-h-[140px] md:min-h-[180px]">
          
          {/* SECTION 1: PHOTO + INFOS */}
          <div 
            className="flex-none w-[calc(100vw-45px)] md:w-[10cm] snap-start flex flex-row items-stretch bg-card"
          >
            {/* Photo */}
            <div
              onClick={handleImageClick}
              className={cn(
                "relative w-24 sm:w-32 md:w-40 flex-shrink-0 overflow-hidden border-r bg-muted/30 self-stretch h-full",
                dealership.imgUrl && "cursor-zoom-in"
              )}
            >
              {dealership.imgUrl ? (
                <Image
                  src={dealership.imgUrl}
                  alt={`Photo de ${title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 96px, 160px"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <LabelMotoLogo className="w-full opacity-20 grayscale" />
                </div>
              )}
            </div>

            {/* Informations */}
            <div 
              onClick={onClick}
              className="flex flex-col justify-center flex-1 p-3 md:p-4 min-w-0 cursor-pointer h-full"
            >
              <h3 className="font-bold text-sm md:text-lg text-foreground leading-tight uppercase truncate">
                {title}
              </h3>
              {categoryLabel && (
                <div className="text-brand text-[10px] md:text-xs font-black mt-0.5 uppercase tracking-wider">
                  {categoryLabel}
                </div>
              )}
              
              <div className="flex items-center gap-3 md:gap-4 text-muted-foreground text-[9px] md:text-[10px] uppercase font-bold mt-2 md:mt-3">
                  {dealership.phoneNumber && (
                      <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Phone className="w-4 h-4 md:w-5 md:h-5 text-brand"/>
                          <span>Appel</span>
                      </a>
                  )}
                  {dealership.email && (
                      <a href={`mailto:${dealership.email}`} className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Mail className="w-4 h-4 md:w-5 md:h-5 text-brand"/>
                          <span>Email</span>
                      </a>
                  )}
                  {dealership.website && (
                      <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Globe className="w-4 h-4 md:w-5 md:h-5 text-brand"/>
                          <span className="hidden sm:inline">Web</span>
                      </a>
                  )}
              </div>

              {rating > 0 && (
                <div className="flex items-center gap-1 mt-1.5 text-[10px] font-bold text-brand">
                  <Star className="h-3 w-3 fill-brand text-brand" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}

              {dealership.address && 
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-base md:text-lg text-left text-muted-foreground hover:text-brand group mt-3 font-medium" onClick={(e) => e.stopPropagation()}>
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand"/>
                          <div className="flex flex-col leading-tight">
                              <span className="group-hover:underline line-clamp-1">{street}</span>
                              <span className="group-hover:underline line-clamp-1 font-extrabold text-foreground">{cityZip}</span>
                          </div>
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

          {/* BARRE ORANGE VERTICALE (HORAIRES) */}
          <div className="flex-none w-10 flex flex-col items-center justify-center border-l-2 border-brand bg-brand/5">
            <ChevronRight className="h-4 w-4 text-brand mb-2 animate-pulse" />
            <span className="text-[10px] font-black text-brand tracking-[0.2em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              HORAIRES
            </span>
          </div>

          {/* SECTION 3: LES HORAIRES */}
          <div className="flex-none w-[calc(18cm-10cm-40px)] md:w-[calc(18cm-10cm-40px)] snap-end p-4 bg-muted/30 flex flex-col justify-center self-stretch border-l">
            <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1.5 text-[10px] md:text-xs">
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
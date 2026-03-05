'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Mail, ChevronLeft } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  const [showHours, setShowHours] = useState(false);

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

  const handleToggleHours = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHours(!showHours);
  };

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
          "relative w-full overflow-hidden transition-all duration-300 ease-in-out border-border/50 bg-card ml-auto shadow-lg",
          className
        )}
      >
        <div className="flex items-stretch min-h-[145px] md:min-h-[185px]">
          
          {/* SECTION 1: PHOTO + INFOS */}
          <div className="flex flex-1 flex-row items-stretch bg-card min-w-0">
            {/* Photo */}
            <div
              onClick={handleImageClick}
              className={cn(
                "relative w-28 sm:w-40 md:w-56 flex-shrink-0 overflow-hidden border-r bg-muted/30 self-stretch",
                dealership.imgUrl && "cursor-zoom-in"
              )}
            >
              {dealership.imgUrl ? (
                <Image
                  src={dealership.imgUrl}
                  alt={`Photo de ${title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 224px"
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
              className="flex flex-col justify-center flex-1 p-4 md:p-8 min-w-0 cursor-pointer"
            >
              <h3 className="font-black text-base md:text-2xl text-foreground leading-tight uppercase truncate">
                {title}
              </h3>
              {categoryLabel && (
                <div className="text-brand text-[10px] md:text-sm font-black mt-1 uppercase tracking-wider">
                  {categoryLabel}
                </div>
              )}
              
              <div className="flex items-center gap-4 md:gap-8 text-muted-foreground text-[10px] md:text-sm uppercase font-bold mt-3 md:mt-5">
                  {dealership.phoneNumber && (
                      <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1.5 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Phone className="w-5 h-5 md:w-7 md:h-7 text-brand"/>
                          <span>Appel</span>
                      </a>
                  )}
                  {dealership.email && (
                      <a href={`mailto:${dealership.email}`} className="flex flex-col items-center gap-1.5 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Mail className="w-5 h-5 md:w-7 md:h-7 text-brand"/>
                          <span>Email</span>
                      </a>
                  )}
                  {dealership.website && (
                      <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 hover:text-brand transition-colors text-center" onClick={(e) => e.stopPropagation()}>
                          <Globe className="w-5 h-5 md:w-7 md:h-7 text-brand"/>
                          <span>Web</span>
                      </a>
                  )}
              </div>

              {rating > 0 && (
                <div className="flex items-center gap-1.5 mt-2 md:mt-3 text-xs md:text-sm font-bold text-yellow-400">
                  <Star className="h-4 w-4 md:h-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}

              {dealership.address && 
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-left text-muted-foreground hover:text-brand group mt-3 md:mt-5 font-medium" onClick={(e) => e.stopPropagation()}>
                          <MapPin className="h-5 w-5 md:h-6 md:h-6 shrink-0 mt-1 text-brand"/>
                          <div className="flex flex-col leading-tight">
                              <span className="group-hover:underline line-clamp-1 text-sm md:text-lg">{street}</span>
                              <span className="group-hover:underline line-clamp-1 font-black text-foreground text-base md:text-xl">{cityZip}</span>
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

          {/* VOLET COULISSANT DES HORAIRES */}
          <div className={cn(
            "absolute inset-y-0 right-0 z-30 flex transition-transform duration-500 ease-in-out w-full",
            showHours ? "translate-x-0" : "translate-x-[calc(100%-40px)] md:translate-x-[calc(100%-48px)]"
          )}>
            {/* BARRE ORANGE VERTICALE (à gauche des horaires quand visibles) */}
            <div 
              onClick={handleToggleHours}
              className={cn(
                "flex-none w-10 md:w-12 flex flex-col items-center justify-center border-l-2 border-brand cursor-pointer transition-all duration-300",
                showHours ? "bg-white/30 backdrop-blur-md" : "bg-brand/5 hover:bg-brand/10"
              )}
            >
              <div className={cn(
                "flex flex-col items-center justify-center p-1 rounded-full transition-all duration-300",
                showHours && "bg-white/90 shadow-lg ring-1 ring-white/20"
              )}>
                <ChevronLeft className={cn("h-5 w-5 md:h-6 md:h-6 text-brand transition-transform duration-300", showHours && "rotate-180")} />
              </div>
              <div className={cn(
                "mt-4 py-3 px-1.5 rounded-xl flex items-center justify-center transition-all duration-300",
                showHours && "bg-white/90 shadow-lg ring-1 ring-white/20"
              )}>
                <span className="text-[11px] md:text-[12px] font-black text-brand tracking-[0.2em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  HORAIRES
                </span>
              </div>
            </div>

            {/* SECTION DES HORAIRES */}
            <div className={cn(
              "flex-1 bg-background/95 backdrop-blur-sm p-5 md:p-8 flex flex-col justify-center border-l shadow-2xl overflow-hidden"
            )}>
              <div className="grid grid-cols-[max-content_1fr] gap-x-6 md:gap-x-10 gap-y-2 md:gap-y-3 text-xs sm:text-sm md:text-base max-w-md mx-auto w-full">
                {weekDays.map(day => {
                  const hours = dealership[day as keyof Dealership];
                  const isClosed = !hours || typeof hours !== 'string' || hours.toLowerCase() === 'non renseigné' || hours.toLowerCase() === 'fermé';
                  return (
                      <React.Fragment key={day}>
                        <span className={cn("capitalize font-bold text-muted-foreground", isClosed && "text-muted-foreground/40")}>{day}</span>
                        <span className={cn("font-mono text-right whitespace-nowrap font-black text-brand", isClosed && "font-sans text-muted-foreground/40")}>{isClosed ? 'FERMÉ' : hours}</span>
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
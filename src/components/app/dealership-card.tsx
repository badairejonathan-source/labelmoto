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
          "relative w-full overflow-hidden transition-all duration-300 ease-in-out border-border/50 bg-card ml-auto shadow-sm hover:shadow-md",
          className
        )}
      >
        <div className="flex items-stretch min-h-[110px] md:min-h-[140px]">
          
          {/* SECTION 1: PHOTO + INFOS */}
          <div className="flex flex-1 flex-row items-stretch bg-card min-w-0">
            {/* Photo */}
            <div
              onClick={handleImageClick}
              className={cn(
                "relative w-24 sm:w-32 md:w-44 flex-shrink-0 overflow-hidden border-r bg-muted/30 self-stretch",
                dealership.imgUrl && "cursor-zoom-in"
              )}
            >
              {dealership.imgUrl ? (
                <Image
                  src={dealership.imgUrl}
                  alt={`Photo de ${title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 96px, 176px"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <LabelMotoLogo className="w-full opacity-20 grayscale" />
                </div>
              )}
            </div>

            {/* Informations */}
            <div 
              onClick={onClick}
              className="flex flex-col justify-center flex-1 p-3 md:p-5 min-w-0 cursor-pointer"
            >
              <h3 className="font-black text-sm md:text-xl text-foreground leading-[1.1] uppercase break-words mb-1">
                {title}
              </h3>
              
              <div className="flex items-center justify-start gap-3 mt-0.5">
                {categoryLabel && (
                  <div className="text-brand text-[9px] md:text-xs font-black uppercase tracking-wider">
                    {categoryLabel}
                  </div>
                )}
                {rating > 0 && (
                  <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-yellow-400">
                    <Star className="h-3 w-3 md:h-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 md:gap-6 text-muted-foreground text-[9px] md:text-xs uppercase font-bold mt-2 md:mt-3">
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
                          <span>Web</span>
                      </a>
                  )}
              </div>

              {dealership.address && 
                <div className="mt-2 md:mt-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-left text-muted-foreground hover:text-brand group font-medium" onClick={(e) => e.stopPropagation()}>
                            <MapPin className="h-4 w-4 md:h-5 md:h-5 shrink-0 text-brand"/>
                            <div className="flex flex-col leading-tight">
                                <span className="group-hover:underline line-clamp-1 text-xs md:text-sm font-bold text-foreground">{street} {cityZip}</span>
                            </div>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Y aller</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              }
            </div>
          </div>

          {/* VOLET COULISSANT DES HORAIRES */}
          <div className={cn(
            "absolute inset-y-0 right-0 z-30 flex transition-transform duration-500 ease-in-out w-full",
            showHours ? "translate-x-0" : "translate-x-[calc(100%-32px)] md:translate-x-[calc(100%-40px)]"
          )}>
            {/* BARRE ORANGE VERTICALE */}
            <div 
              onClick={handleToggleHours}
              className={cn(
                "flex-none w-8 md:w-10 flex flex-col items-center justify-center border-l-2 border-brand cursor-pointer transition-all duration-300",
                showHours ? "bg-white/30 backdrop-blur-md" : "bg-brand/5 hover:bg-brand/10"
              )}
            >
              <div className={cn(
                "flex flex-col items-center justify-center p-0.5 rounded-full transition-all duration-300",
                showHours && "bg-white/90 shadow-sm"
              )}>
                <ChevronLeft className={cn("h-4 w-4 md:h-5 md:h-5 text-brand transition-transform duration-300", showHours && "rotate-180")} />
              </div>
              <div className={cn(
                "mt-2 py-2 px-1 rounded-lg flex items-center justify-center transition-all duration-300",
                showHours && "bg-white/90 shadow-sm"
              )}>
                <span className="text-[9px] md:text-[10px] font-black text-brand tracking-widest uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  HORAIRES
                </span>
              </div>
            </div>

            {/* SECTION DES HORAIRES */}
            <div className={cn(
              "flex-1 bg-background/95 backdrop-blur-sm p-4 md:p-6 flex flex-col justify-center border-l shadow-xl overflow-hidden"
            )}>
              <div className="grid grid-cols-[max-content_1fr] gap-x-4 md:gap-x-8 gap-y-1 md:gap-y-2 text-[10px] sm:text-xs md:text-sm max-w-md mx-auto w-full">
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
'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, X, Store, Users, Utensils, ChevronRight } from 'lucide-react';
import type { Dealership, MapPoint } from '@/lib/types';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase/client';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface DealershipCardProps {
  point: MapPoint;
  isSelected?: boolean;
  onClick?: () => void;
  onOpenDetails?: (id: string) => void;
  className?: string;
}

const categoryDisplay: { [key: string]: string } = {
  'concession': 'Concession',
  'atelier': 'Atelier',
  'concession-atelier': 'Concession & Atelier',
  'accessoiriste': 'Accessoiriste',
  'association': 'Association motarde',
  'relais': 'Relais Motard',
};

const DealershipCard: React.FC<DealershipCardProps> = ({ point, isSelected = false, onClick, onOpenDetails, className }) => {
  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const firestore = useFirestore();

  const docRef = useMemoFirebase(() => {
    if (!isSelected || !firestore) return null;
    const col = point.appSection === 'association' ? 'associations' : (point.appSection === 'relais' ? 'relais' : 'concessions');
    return doc(firestore, col, point.id);
  }, [firestore, point.id, point.appSection, isSelected]);
  
  const { data: fullDetails, isLoading: isDetailLoading } = useDoc<Dealership>(docRef);

  const isAssociation = point.appSection === 'association';
  const isRelais = point.appSection === 'relais';

  const ratingValue = parseFloat(String(point.rating || fullDetails?.rating || 0).replace(',', '.'));
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  const categoryLabel = categoryDisplay[point.category] || point.category;

  const rawImgUrl = point.imgUrl || fullDetails?.imgUrl || fullDetails?.imageUrl || "";
  const isStreetView = rawImgUrl.includes("streetviewpixels") || rawImgUrl.includes("streetview");
  const actualImgUrl = rawImgUrl && isStreetView ? `/api/image-proxy?url=${encodeURIComponent(rawImgUrl)}` : "";
  const slugOrId = fullDetails?.slug || point.slug || point.id;

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenDetails) {
      onOpenDetails(point.id);
    }
  };

  return (
    <Card 
      id={`card-${point.id}`}
      className={cn(
        "relative overflow-hidden border-2 transition-all duration-300 group rounded-[2rem]", 
        isSelected ? "border-brand shadow-xl bg-white scale-[1.02] z-10" : "border-transparent bg-white/50 hover:bg-white hover:border-brand/20 shadow-sm",
        className
      )}
    >
      <div className="flex items-stretch min-h-[140px]">
        <div 
          className={cn(
            "relative w-32 sm:w-36 md:w-44 overflow-hidden bg-muted/30 flex items-center justify-center shrink-0 border-r", 
            actualImgUrl && !imgError ? "cursor-zoom-in group/img" : "cursor-default"
          )} 
          onClick={(e) => { if (actualImgUrl && !imgError) { e.stopPropagation(); setIsZoomDialogOpen(true); } }}
        >
          {actualImgUrl && !imgError ? (
            <Image 
              src={actualImgUrl} 
              alt={point.title} 
              fill 
              className="object-cover transition-transform group-hover:scale-105 duration-700" 
              onError={() => setImgError(true)} 
              referrerPolicy="no-referrer"
              unoptimized
              sizes="(max-width: 768px) 120px, 180px"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-20">
              {isAssociation ? <Users className="h-8 w-8" /> : (isRelais ? <Utensils className="h-8 w-8" /> : <Store className="h-8 w-8" />)}
            </div>
          )}
          
          {rating > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-black border border-white/20">
              {rating.toFixed(1)} <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center flex-1 p-4 cursor-pointer" onClick={onClick}>
          <div className="mb-2">
            <h3 className="font-black text-sm md:text-base uppercase leading-tight line-clamp-2">{point.title}</h3>
            <span className={cn("text-[8px] font-black uppercase tracking-widest", isAssociation ? "text-indigo-600" : (isRelais ? "text-amber-600" : "text-brand"))}>
              {categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-[9px] font-bold text-muted-foreground truncate uppercase">
              {fullDetails?.address || point.title.split('-').pop() || "Adresse"}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-auto">
            {isSelected && isDetailLoading ? (
              <div className="flex gap-2"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-9 w-9 rounded-full" /></div>
            ) : (
              <div className={cn("flex items-center gap-2 transition-all duration-500", isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")}>
                {fullDetails?.phoneNumber && (
                  <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 hover:bg-brand/10 hover:border-brand" onClick={(e) => e.stopPropagation()}>
                    <a href={`tel:${fullDetails.phoneNumber}`} onClick={() => trackEvent('clic_telephone', { pro: fullDetails.title, source: 'carte' })}><Phone className="h-4 w-4 text-brand" /></a>
                  </Button>
                )}
                {fullDetails?.website && (
                  <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 hover:bg-brand/10 hover:border-brand" onClick={(e) => e.stopPropagation()}>
                    <a href={fullDetails.website} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('clic_site_web', { pro: fullDetails.title, source: 'carte' })}><Globe className="h-4 w-4 text-brand" /></a>
                  </Button>
                )}
                <Button 
                  className="bg-brand hover:bg-brand/90 text-white rounded-full font-black uppercase text-[9px] h-10 px-6 shadow-lg shadow-brand/20 ml-auto"
                  onClick={handleDetailsClick}
                >
                  Détails <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            )}
            
            <Link href={`/concessions/${slugOrId}`} className="sr-only">Voir la fiche complète</Link>
          </div>
        </div>
      </div>
      
      <Dialog open={isZoomDialogOpen} onOpenChange={setIsZoomDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[85vh] p-0 overflow-hidden bg-black/95 border-none z-[3000]">
          <DialogHeader className="sr-only">
            <DialogTitle>Aperçu : {point.title}</DialogTitle>
            <DialogDescription>Photo plein écran de l'établissement professionnel {point.title}</DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center">
            <button onClick={() => setIsZoomDialogOpen(false)} className="absolute top-4 right-4 z-[3100] bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"><X className="h-6 w-6" /></button>
            <div className="relative w-full h-full">
              {actualImgUrl && !imgError && (
                <Image src={actualImgUrl} alt={point.title} fill className="object-contain" onError={() => setImgError(true)} referrerPolicy="no-referrer" unoptimized />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default memo(DealershipCard);

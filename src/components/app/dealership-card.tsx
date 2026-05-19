'use client';

import React, { useState, useMemo, useEffect, memo } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, X, ZoomIn, Clock, Store, Users, Utensils, Loader2, ChevronRight } from 'lucide-react';
import type { Dealership, MapPoint } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface DealershipCardProps {
  point: MapPoint;
  isSelected?: boolean;
  onClick?: () => void;
  onOpenDetails?: (id: string) => void;
  className?: string;
  cachedData?: Dealership;
  onDataLoaded?: (data: Dealership) => void;
}

const categoryDisplay: { [key: string]: string } = {
  'concession': 'Concession',
  'atelier': 'Atelier',
  'concession-atelier': 'Concession & Atelier',
  'accessoiriste': 'Accessoiriste',
  'association': 'Association motarde',
  'relais': 'Relais Motard',
};

const DealershipCard: React.FC<DealershipCardProps> = ({ point, isSelected = false, onClick, onOpenDetails, className, cachedData, onDataLoaded }) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const docRef = useMemoFirebase(() => {
    if (!isSelected || cachedData) return null;
    const col = point.appSection === 'association' ? 'associations' : (point.appSection === 'relais' ? 'relais' : 'concessions');
    return doc(firestore, col, point.id);
  }, [firestore, point.id, point.appSection, isSelected, cachedData]);
  
  const { data: fetchedData, isLoading: isDetailLoading } = useDoc<Dealership>(docRef);
  const fullDetails = cachedData || fetchedData;

  useEffect(() => {
    if (fetchedData && onDataLoaded && !cachedData) {
      onDataLoaded(fetchedData);
    }
  }, [fetchedData, onDataLoaded, cachedData]);

  const isAssociation = point.appSection === 'association';
  const isRelais = point.appSection === 'relais';

  const ratingValue = parseFloat(String(point.rating || fullDetails?.rating || 0).replace(',', '.'));
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  const categoryLabel = categoryDisplay[point.category] || point.category;

  const actualImgUrl = point.imgUrl || fullDetails?.imgUrl || fullDetails?.imageUrl || "";

  const slugOrId = fullDetails?.slug || point.slug || point.id;

  const handleOpenDetails = (e: React.MouseEvent) => {
    // Si CTRL ou META est pressé, on laisse le comportement par défaut (ouvrir dans un nouvel onglet)
    if (e.ctrlKey || e.metaKey) return;
    
    e.preventDefault();
    e.stopPropagation();
    if (onOpenDetails) {
      onOpenDetails(point.id);
    }
  };

  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;

  return (
    <Card className={cn("relative overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-all group", className)}>
      {!isAssociation && !isRelais && rating > 0 && (
        <div className="absolute top-2 left-2 z-20 flex items-center justify-center h-10 w-10 md:h-12 md:w-12 bg-brand rounded-full text-white shadow-lg border-2 border-white font-black">
          <div className="flex flex-col items-center leading-none">
            <span className="text-xs md:text-sm">{rating.toFixed(1)}</span>
            <Star className="h-2 w-2 fill-white" />
          </div>
        </div>
      )}

      <div className="flex items-stretch min-h-[130px] md:min-h-[150px]">
        <div className="flex flex-1 flex-row items-stretch">
          <div 
            className={cn(
              "relative w-36 sm:w-40 md:w-48 overflow-hidden border-r bg-muted/30 flex items-center justify-center", 
              actualImgUrl && !imgError ? "cursor-zoom-in group/img" : "cursor-default"
            )} 
            onClick={(e) => { if (actualImgUrl && !imgError) { e.stopPropagation(); setIsZoomDialogOpen(true); } }}
          >
            {actualImgUrl && !imgError ? (
              <>
                <Image 
                  src={actualImgUrl} 
                  alt={point.title} 
                  fill 
                  className="object-cover transition-transform group-hover:brightness-110 duration-700" 
                  onError={() => setImgError(true)} 
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 768px) 140px, 200px"
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-20">
                {isAssociation ? <Users className="h-10 w-10 text-muted-foreground" /> : (isRelais ? <Utensils className="h-10 w-10 text-muted-foreground" /> : <Store className="h-10 w-10 text-muted-foreground" />)}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center flex-1 p-3 md:p-4 cursor-pointer" onClick={onClick}>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-black text-sm md:text-lg uppercase leading-tight truncate">{point.title}</h3>
            </div>
            <span className={cn("text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-3", isAssociation ? "text-indigo-600" : (isRelais ? "text-amber-600" : "text-brand"))}>{categoryLabel}</span>
            
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar min-h-[48px]">
              {isSelected && isDetailLoading ? (
                  <div className="flex gap-2"><Skeleton className="h-12 w-12 rounded-full" /><Skeleton className="h-12 w-12 rounded-full" /></div>
              ) : (
                  <>
                      {fullDetails?.phoneNumber && (
                      <a href={`tel:${fullDetails.phoneNumber}`} onClick={(e) => e.stopPropagation()} className="shrink-0">
                          <div className={cn("h-12 w-12 rounded-full flex flex-col items-center justify-center shadow-lg transition-all", isAssociation ? "bg-indigo-50" : (isRelais ? "bg-amber-50" : "bg-brand/10"))}>
                          <Phone className="h-3.5 w-3.5 text-brand" /><span className="text-[5px] font-black uppercase mt-0.5">Appel</span>
                          </div>
                      </a>
                      )}

                      {fullDetails?.website && (
                      <a href={fullDetails.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0">
                          <div className={cn("h-12 w-12 rounded-full flex flex-col items-center justify-center shadow-lg transition-all", isAssociation ? "bg-indigo-50" : (isRelais ? "bg-amber-50" : "bg-brand/10"))}>
                          <Globe className="h-3.5 w-3.5 text-brand" /><span className="text-[5px] font-black uppercase mt-0.5">Web</span>
                          </div>
                      </a>
                      )}
                      
                      {isSelected && !isDetailLoading && (
                        <Link 
                          href={`/concessions/${slugOrId}`} 
                          onClick={handleOpenDetails}
                          className="shrink-0"
                        >
                          <div className={cn("h-12 w-12 rounded-full flex flex-col items-center justify-center shadow-lg transition-all bg-brand text-white border-2 border-white")}>
                              <ChevronRight className="h-4 w-4" /><span className="text-[5px] font-black uppercase">Détails</span>
                          </div>
                        </Link>
                      )}
                  </>
              )}
            </div>
            
            <div className="mt-2 border-t border-dashed pt-2">
              <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground flex items-center gap-1.5 truncate">
                <MapPin className="h-2.5 w-2.5 shrink-0" />
                {fullDetails?.address || "Adresse en attente"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Zoom Dialog pour la photo */}
      <Dialog open={isZoomDialogOpen} onOpenChange={setIsZoomDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[85vh] p-0 overflow-hidden bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <button onClick={() => setIsZoomDialogOpen(false)} className="absolute top-4 right-4 z-[1400] bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"><X className="h-6 w-6" /></button>
            <div className="relative w-full h-full">
              {actualImgUrl && !imgError && (
                <Image 
                  src={actualImgUrl} 
                  alt={point.title} 
                  fill 
                  className="object-contain" 
                  onError={() => setImgError(true)} 
                  referrerPolicy="no-referrer"
                  unoptimized 
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default memo(DealershipCard);
'use client';

import React, { useState, useMemo, useEffect, memo } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, X, ZoomIn, Clock, Store, Users, Utensils, Loader2 } from 'lucide-react';
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

interface DealershipCardProps {
  point: MapPoint;
  isSelected?: boolean;
  onClick?: () => void;
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

const DealershipCard: React.FC<DealershipCardProps> = ({ point, isSelected = false, onClick, className, cachedData, onDataLoaded }) => {
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

  // COUCHE 3 : FULL DATA - Chargé uniquement si sélectionné
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

  // COUCHE 2 : PREVIEW DATA - On utilise les données du point pour l'affichage de base
  const ratingValue = parseFloat(String(point.rating || fullDetails?.rating || 0).replace(',', '.'));
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  const categoryLabel = categoryDisplay[point.category] || point.category;

  const actualImgUrl = point.imgUrl || fullDetails?.imgUrl || fullDetails?.imageUrl || "";

  const localBusinessLd = useMemo(() => {
    if (!isSelected || !fullDetails) return null;
    return {
      "@context": "https://schema.org",
      "@type": isRelais ? "LodgingBusiness" : "AutoRepair",
      "name": fullDetails.title,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": fullDetails.address
      },
      "telephone": fullDetails.phoneNumber,
      "url": fullDetails.website || `https://labelmoto.fr/map?selectedId=${point.id}`,
      "image": actualImgUrl,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": point.latitude,
        "longitude": point.longitude
      }
    };
  }, [isSelected, fullDetails, point, isRelais, actualImgUrl]);

  const handleRatingSubmit = () => {
    if (!user || !firestore) return;
    if (newComment.trim().length < 5) return;
    setIsSubmitting(true);
    const activeUserProfile = user.displayName || user.email?.split('@')[0] || 'Anonyme';
    addDocumentNonBlocking(collection(firestore, 'pending_comments'), {
        userId: user.uid,
        userName: activeUserProfile,
        dealershipId: point.id,
        dealershipName: point.title,
        content: newComment,
        rating: newRating,
        date: serverTimestamp(),
        status: 'PENDING'
    });
    toast({ title: "Merci !", description: "Votre avis sera publié après validation." });
    setNewComment('');
    setIsSubmitting(false);
    setIsReviewDialogOpen(false);
  };

  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;

  return (
    <>
      {localBusinessLd && (
        <Script
          id={`ld-pro-${point.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
      )}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Avis sur {point.title}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn("h-8 w-8 cursor-pointer", s <= newRating ? "fill-yellow-400 text-yellow-400" : "text-muted")} onClick={() => setNewRating(s)} />
              ))}
            </div>
            <Textarea placeholder="Votre expérience..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <Button className="w-full bg-brand" onClick={handleRatingSubmit} disabled={isSubmitting}>Envoyer l'avis</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isZoomDialogOpen} onOpenChange={setIsZoomDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[85vh] p-0 overflow-hidden bg-black/95 border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo de {point.title}</DialogTitle>
          </DialogHeader>
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
                "relative w-40 sm:w-40 md:w-52 overflow-hidden border-r bg-muted/30 flex items-center justify-center", 
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
                    sizes="(max-width: 768px) 160px, 210px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 flex items-center justify-center transition-all">
                    <ZoomIn className="text-white opacity-0 group-hover/img:opacity-100 h-6 w-6" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 opacity-20">
                  {isAssociation ? <Users className="h-10 w-10 text-muted-foreground" /> : (isRelais ? <Utensils className="h-10 w-10 text-muted-foreground" /> : <Store className="h-10 w-10 text-muted-foreground" />)}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center flex-1 p-3 md:p-5 cursor-pointer" onClick={onClick}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-sm md:text-xl uppercase leading-tight truncate">{point.title}</h3>
              </div>
              <span className={cn("text-[9px] md:text-xs font-black uppercase tracking-widest mb-3", isAssociation ? "text-indigo-600" : (isRelais ? "text-amber-600" : "text-brand"))}>{categoryLabel}</span>
              
              <div className="flex flex-nowrap items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar min-h-[64px]">
                {isSelected && isDetailLoading ? (
                    <div className="flex gap-4"><Skeleton className="h-16 w-16 rounded-full" /><Skeleton className="h-16 w-16 rounded-full" /></div>
                ) : (
                    <>
                        {fullDetails?.phoneNumber && (
                        <a href={`tel:${fullDetails.phoneNumber}`} onClick={(e) => e.stopPropagation()} className="group/btn shrink-0">
                            <div className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all", isAssociation ? "bg-indigo-50" : (isRelais ? "bg-amber-50" : "bg-brand/10"))}>
                            <Phone className="h-4 w-4 text-brand mb-0.5" /><span className="text-[6px] font-black uppercase">Appel</span>
                            </div>
                        </a>
                        )}

                        {fullDetails?.website && (
                        <a href={fullDetails.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/btn shrink-0">
                            <div className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all", isAssociation ? "bg-indigo-50" : (isRelais ? "bg-amber-50" : "bg-brand/10"))}>
                            <Globe className="h-4 w-4 text-brand mb-0.5" /><span className="text-[6px] font-black uppercase">Web</span>
                            </div>
                        </a>
                        )}

                        {fullDetails && !isAssociation && !isRelais && (
                        <button className={cn("h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-2 shrink-0", showHours ? "bg-brand text-white" : "bg-brand/10 text-brand")} onClick={(e) => { e.stopPropagation(); setShowHours(!showHours); }}>
                            <Clock className="h-4 w-4" /><span className="text-[6px] font-black uppercase mt-1">Horaires</span>
                        </button>
                        )}
                        
                        {!isSelected && (
                            <div className="flex flex-col justify-center py-2 opacity-40">
                                <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Cliquez pour les détails</span>
                            </div>
                        )}
                    </>
                )}
              </div>
              
              <div className="mt-3 border-t border-dashed pt-2">
                <a href={navigationUrl} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-3 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[8px] md:text-[10px] font-black uppercase shadow-sm", isAssociation ? "bg-indigo-600" : (isRelais ? "bg-amber-600" : "bg-brand"))} onClick={(e) => e.stopPropagation()}>
                  <MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{fullDetails?.address || "Calculer l'itinéraire"}</span>
                </a>
              </div>
            </div>
          </div>
          
          {(showHours || showReviews) && (
            <div className="absolute inset-0 z-30 bg-background/95 backdrop-blur-sm border-r p-4 flex flex-col justify-center shadow-2xl animate-in fade-in duration-200">
              <button onClick={(e) => { e.stopPropagation(); setShowHours(false); setShowReviews(false); }} className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"><X className="h-5 w-5" /></button>
              {showHours && fullDetails && (
                <div className="space-y-1 w-full max-w-xs mx-auto">
                  {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(d => (
                    <div key={d} className="flex justify-between items-center text-[10px] font-bold border-b border-dashed border-muted last:border-0 pb-0.5">
                      <span className="capitalize text-muted-foreground">{d}</span>
                      <span className={cn("text-right", isRelais ? "text-amber-600" : "text-brand")}>{fullDetails[d] || 'Fermé'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default memo(DealershipCard);

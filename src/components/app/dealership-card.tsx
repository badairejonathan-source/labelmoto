'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Mail, ChevronLeft, MessageSquare, Award, Loader2, Send } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

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
  const searchParams = useSearchParams();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const title = dealership.title || '';
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  
  const rawCategory = dealership.category || '';
  const categoryLabel = categoryDisplay[rawCategory.toLowerCase()] || rawCategory;

  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  // Handle automatic opening of reviews tab if coming from login redirect
  useEffect(() => {
    const view = searchParams.get('view');
    const selectedId = searchParams.get('selectedId');
    if (selectedId === dealership.id && view === 'reviews') {
      setShowReviews(true);
    }
  }, [searchParams, dealership.id]);

  // Approved comments for this dealership
  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'concessions', dealership.id, 'comments');
  }, [firestore, dealership.id]);
  const { data: approvedComments, isLoading: isCommentsLoading } = useCollection(commentsQuery);

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
    if (showReviews) setShowReviews(false);
  };

  const handleToggleReviews = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReviews(!showReviews);
    if (showHours) setShowHours(false);
  };

  const handleRatingSubmit = () => {
    if (!user || !firestore) {
        toast({ title: "Connexion requise", description: "Veuillez vous connecter pour laisser un avis.", variant: "destructive" });
        return;
    }
    if (newComment.trim().length < 5) {
        toast({ title: "Commentaire trop court", description: "Dites-nous en un peu plus sur votre expérience.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    const commentData = {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonyme',
        dealershipId: dealership.id,
        dealershipName: title,
        content: newComment,
        rating: newRating,
        date: serverTimestamp(),
        status: 'PENDING'
    };

    addDocumentNonBlocking(collection(firestore, 'pending_comments'), commentData);
    
    toast({ title: "Merci !", description: "Votre avis a été envoyé et sera publié après validation." });
    setNewComment('');
    setIsSubmitting(false);
  };

  const addressParts = dealership.address ? dealership.address.split(', ') : [];
  const street = addressParts[0] || '';
  const cityZip = addressParts.slice(1).join(', ') || '';

  // Pour l'instant, aucun badge n'est attribué automatiquement
  const isSelectedLabel = false;

  // Build the callback URL for login redirection
  const loginCallbackUrl = `/map?selectedId=${dealership.id}&view=reviews`;

  return (
    <>
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="p-0 border-0 max-w-4xl bg-transparent shadow-none">
          <DialogTitle className="sr-only">{`Photo de ${title}`}</DialogTitle>
          {dealership.imgUrl && (
            <Image
              src={dealership.imgUrl}
              alt={`Photo de ${title}`}
              width={1200}
              height={800}
              className="object-contain w-full h-auto max-h-[90vh] rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      <Card
        className={cn(
          "relative w-full overflow-hidden transition-all duration-300 ease-in-out border-border/50 bg-card ml-auto shadow-sm hover:shadow-md",
          className
        )}
      >
        <div className="flex items-stretch min-h-[110px] md:min-h-[140px]">
          
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
              {isSelectedLabel && (
                <div className="absolute top-2 left-2 z-10">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="bg-brand text-white p-1 rounded-full shadow-lg border border-white">
                                    <Award className="h-4 w-4" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent><p>Sélection Label Moto</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
              )}
            </div>

            {/* Informations */}
            <div 
              onClick={onClick}
              className="flex flex-col justify-center flex-1 p-3 md:p-5 min-w-0 cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-black text-sm md:text-xl text-foreground leading-[1.1] uppercase break-words mb-1 flex-1">
                    {title}
                </h3>
                {isSelectedLabel && (
                    <Badge variant="outline" className="hidden md:flex border-brand text-brand font-black text-[8px] uppercase tracking-tighter shrink-0 bg-brand/5">
                        Sélection Label Moto
                    </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-start gap-3 mt-0.5">
                {categoryLabel && (
                  <div className="text-brand text-[9px] md:text-xs font-black uppercase tracking-wider">
                    {categoryLabel}
                  </div>
                )}
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-yellow-400">
                    <Star className="h-3 w-3 md:h-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    <span>{rating > 0 ? rating.toFixed(1) : "Nouveau"}</span>
                    {approvedComments && approvedComments.length > 0 && (
                        <span className="text-muted-foreground ml-0.5">({approvedComments.length})</span>
                    )}
                </div>
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
                  <button onClick={handleToggleReviews} className="flex flex-col items-center gap-1 hover:text-brand transition-colors text-center">
                      <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-brand"/>
                      <span>Avis</span>
                  </button>
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
                      <TooltipContent><p>Y aller</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              }
            </div>
          </div>

          {/* VOLET COULISSANT - HORAIRES OU AVIS */}
          <div className={cn(
            "absolute inset-y-0 right-0 z-30 flex transition-transform duration-500 ease-in-out w-full",
            (showHours || showReviews) ? "translate-x-0" : "translate-x-[calc(100%-32px)] md:translate-x-[calc(100%-40px)]"
          )}>
            {/* BARRES LATÉRALES */}
            <div className="flex flex-col h-full flex-none">
                {/* Bouton Horaires */}
                <div 
                    onClick={handleToggleHours}
                    className={cn(
                        "flex-1 w-8 md:w-10 flex flex-col items-center justify-center border-l-2 border-brand cursor-pointer transition-all",
                        showHours ? "bg-white/30 backdrop-blur-md" : "bg-brand/5 hover:bg-brand/10 border-b border-white/20"
                    )}
                >
                    <ChevronLeft className={cn("h-4 w-4 text-brand transition-transform", showHours && "rotate-180")} />
                    <span className="text-[8px] md:text-[9px] font-black text-brand tracking-tighter uppercase whitespace-nowrap mt-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        HORAIRES
                    </span>
                </div>
                {/* Bouton Avis */}
                <div 
                    onClick={handleToggleReviews}
                    className={cn(
                        "flex-1 w-8 md:w-10 flex flex-col items-center justify-center border-l-2 border-blue-500 cursor-pointer transition-all",
                        showReviews ? "bg-white/30 backdrop-blur-md" : "bg-blue-500/5 hover:bg-blue-500/10"
                    )}
                >
                    <ChevronLeft className={cn("h-4 w-4 text-blue-500 transition-transform", showReviews && "rotate-180")} />
                    <span className="text-[8px] md:text-[9px] font-black text-blue-500 tracking-tighter uppercase whitespace-nowrap mt-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        AVIS
                    </span>
                </div>
            </div>

            {/* CONTENU - HORAIRES */}
            {showHours && (
                <div className="flex-1 bg-background/95 backdrop-blur-sm p-3 md:p-4 flex flex-col justify-center border-l shadow-xl overflow-hidden">
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 md:gap-x-8 gap-y-0.5 text-[10px] sm:text-xs md:text-sm max-w-md mx-auto w-full">
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
            )}

            {/* CONTENU - AVIS */}
            {showReviews && (
                <div className="flex-1 bg-background/95 backdrop-blur-sm pt-1 px-4 pb-4 md:pt-2 md:px-6 md:pb-6 flex flex-col border-l shadow-xl overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar mt-2">
                        {isCommentsLoading ? (
                            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
                        ) : approvedComments && approvedComments.length > 0 ? (
                            approvedComments.map(comment => (
                                <div key={comment.id} className="bg-white dark:bg-gray-900 p-3 rounded-lg border shadow-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-[10px] md:text-xs text-foreground">{comment.userName}</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("h-2.5 w-2.5", i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-muted-foreground italic leading-relaxed">"{comment.content}"</p>
                                    <p className="text-[8px] text-muted-foreground/60 mt-2 text-right">
                                        {comment.date?.seconds ? formatDistanceToNow(new Date(comment.date.seconds * 1000), { addSuffix: true, locale: fr }) : "À l'instant"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground text-xs py-10 italic">Aucun avis pour le moment. Soyez le premier !</p>
                        )}
                    </div>

                    <div className="border-t pt-4 bg-muted/20 -mx-4 -mb-4 p-4">
                        {user ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Votre note :</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} onClick={() => setNewRating(star)} className="focus:outline-none">
                                                <Star className={cn("h-4 w-4", star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Textarea 
                                    placeholder="Partagez votre avis..." 
                                    className="text-xs min-h-[60px] bg-white dark:bg-gray-950" 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 font-bold uppercase text-[10px] tracking-widest" onClick={handleRatingSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Send className="h-3 w-3 mr-2" />}
                                    Publier mon avis
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center space-y-2">
                                <p className="text-[10px] text-muted-foreground">Connectez-vous pour laisser un avis.</p>
                                <Button size="sm" variant="outline" className="w-full text-[10px] font-bold uppercase" asChild>
                                    <Link href={`/login?callbackUrl=${encodeURIComponent(loginCallbackUrl)}`}>Se connecter</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

          </div>

        </div>
      </Card>
    </>
  );
};

export default DealershipCard;
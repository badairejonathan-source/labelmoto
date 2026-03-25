'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, Mail, ChevronLeft, MessageSquare, Award, Loader2, Send, PlusCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const ADMIN_UID = "A36FqeWBHjQBLKQMaMSiFVBzGV22";

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
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isAdmin = !!user && user.uid === ADMIN_UID;

  const stdRef = useMemoFirebase(() => user ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdRef);

  const proRef = useMemoFirebase(() => user ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proRef);

  const activeUserProfile = proProfile || stdProfile;
  const currentPseudo = activeUserProfile?.pseudo || activeUserProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Anonyme';

  const title = dealership.title || '';
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  
  const rawCategory = dealership.category || '';
  const categoryLabel = categoryDisplay[rawCategory.toLowerCase()] || rawCategory;

  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  const hasValidGPS = dealership.latitude !== undefined && 
                     dealership.longitude !== undefined && 
                     !isNaN(dealership.latitude) && 
                     !isNaN(dealership.longitude);

  useEffect(() => {
    const view = searchParams.get('view');
    const selectedId = searchParams.get('selectedId');
    if (selectedId === dealership.id && view === 'reviews') {
      setShowReviews(true);
    }
  }, [searchParams, dealership.id]);

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'concessions', dealership.id, 'comments');
  }, [firestore, dealership.id]);
  const { data: approvedComments, isLoading: isCommentsLoading } = useCollection(commentsQuery);

  const directionsUrl = hasValidGPS
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
    if (showHours) {
      setShowHours(false);
    } else {
      setShowHours(true);
      setShowReviews(false);
    }
  };

  const handleToggleReviews = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showReviews) {
      setShowReviews(false);
    } else {
      setShowReviews(true);
      setShowHours(false);
    }
  };

  const handleOpenReviewDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReviewDialogOpen(true);
  };

  const handleQuarantine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin || !firestore) return;

    if (!window.confirm(`Confirmez-vous la mise en quarantaine de "${title}" ?\nL'établissement ne sera plus visible par le public.`)) {
      return;
    }

    const docId = dealership.id;
    
    // Nettoyage et clonage robuste des données pour éviter les erreurs Firestore
    const cleanedData = JSON.parse(JSON.stringify(dealership));
    delete cleanedData.id;
    
    const dataToMove = {
      ...cleanedData,
      quarantinedAt: serverTimestamp(),
      isQuarantined: true,
      quarantineSource: 'manual_admin_action'
    };

    const quarantineRef = doc(firestore, 'a_verifier', docId);
    const publicRef = doc(firestore, 'concessions', docId);

    // On effectue d'abord la création sécurisée, puis la suppression
    setDoc(quarantineRef, dataToMove, { merge: true })
      .then(() => {
        deleteDocumentNonBlocking(publicRef);
        toast({ 
          title: "Action réussie", 
          description: `"${title}" a été déplacé en quarantaine.`,
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: quarantineRef.path,
          operation: 'write',
          requestResourceData: dataToMove,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
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
        userName: currentPseudo,
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
    setIsReviewDialogOpen(false);
  };

  const addressParts = dealership.address ? dealership.address.split(', ') : [];
  const street = addressParts[0] || '';
  const cityZip = addressParts.slice(1).join(', ') || '';

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

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Laisser un avis sur {title}</DialogTitle>
            <DialogDescription>
              Partagez votre expérience avec la communauté. Votre avis sera modéré avant publication.
            </DialogDescription>
          </DialogHeader>
          {user ? (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Votre note</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setNewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <Star className={cn("h-8 w-8", star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Votre commentaire</span>
                <Textarea 
                  placeholder="Points forts, points faibles, accueil, prix..." 
                  className="min-h-[120px] bg-muted/20" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <Button size="lg" className="w-full bg-brand hover:bg-brand/90 font-black uppercase text-xs tracking-widest" onClick={handleRatingSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Envoyer mon avis
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-brand" />
              </div>
              <div className="space-y-2">
                <p className="font-bold">Connexion requise</p>
                <p className="text-sm text-muted-foreground px-4">Vous devez être connecté pour partager votre avis avec les autres motards.</p>
              </div>
              <Button size="lg" className="w-full bg-brand hover:bg-brand/90 font-black uppercase text-xs tracking-widest" asChild>
                <Link href={`/login?callbackUrl=${encodeURIComponent(loginCallbackUrl)}`}>Se connecter / S'inscrire</Link>
              </Button>
            </div>
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
          
          <div className="flex flex-1 flex-row items-stretch bg-card min-w-0 pr-8 md:pr-10">
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

            <div 
              onClick={onClick}
              className="flex flex-col justify-center flex-1 p-3 md:p-5 min-w-0 cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-black text-sm md:text-xl text-foreground leading-[1.1] uppercase break-words mb-1 flex-1">
                    {title}
                </h3>
                {!hasValidGPS && (
                    <Badge variant="secondary" className="flex gap-1 items-center bg-gray-100 text-gray-500 font-bold text-[8px] uppercase tracking-tight border-none h-5">
                        <AlertCircle className="h-2.5 w-2.5" />
                        Position non renseignée
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
                  {isAdmin && (
                      <button 
                        onClick={handleQuarantine} 
                        className="flex flex-col items-center gap-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-center p-1 group/moder"
                        title="Mettre en quarantaine"
                      >
                          <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 group-hover/moder:scale-110 transition-transform" />
                          <span>Modérer</span>
                      </button>
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
                                <span className="group-hover:underline line-clamp-1 text-xs md:sm font-bold text-foreground">{street} {cityZip}</span>
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

          <div className={cn(
            "absolute inset-y-0 left-0 right-8 md:right-10 z-30 transition-transform duration-500 ease-in-out bg-background border-r border-border/50 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]",
            (showHours || showReviews) ? "translate-x-0" : "translate-x-[105%]"
          )}>
            {showHours && (
                <div className="h-full w-full bg-background/98 backdrop-blur-md p-3 md:p-4 flex flex-col justify-center overflow-hidden">
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

            {showReviews && (
                <div className="h-full w-full bg-background/98 backdrop-blur-md pt-1 px-4 pb-4 md:pt-2 md:px-6 md:pb-6 flex flex-col overflow-hidden">
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
                            <div className="text-center py-12">
                                <MessageSquare className="h-10 w-10 text-muted/20 mx-auto mb-3" />
                                <p className="text-muted-foreground text-xs italic">Aucun avis pour le moment. Soyez le premier !</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-2 bg-muted/20 -mx-4 -mb-4 p-3 md:p-4 flex justify-end">
                        <Button 
                          size="sm" 
                          className="w-[150px] bg-blue-600 hover:bg-blue-700 font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg h-8 md:h-9" 
                          onClick={handleOpenReviewDialog}
                        >
                            <PlusCircle className="h-3 w-3 md:h-4 md:h-4 mr-2" />
                            Donner mon avis
                        </Button>
                    </div>
                </div>
            )}
          </div>

          <div className="absolute inset-y-0 right-0 w-8 md:w-10 z-40 flex flex-col h-full bg-card border-l border-border/50 shadow-[-4px_0_10px_rgba(0,0,0,0.05)]">
              <button 
                  onClick={handleToggleHours}
                  className={cn(
                      "flex-1 flex flex-col items-center justify-center transition-all duration-300 border-b border-border/50 focus:outline-none",
                      showHours ? "bg-brand text-brand-foreground" : "bg-brand/5 hover:bg-brand/10 text-brand"
                  )}
              >
                  <ChevronLeft className={cn("h-4 w-4 transition-transform duration-500", showHours && "rotate-180")} />
                  <span className="text-[8px] md:text-[9px] font-black tracking-tighter uppercase whitespace-nowrap mt-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      HORAIRES
                  </span>
              </button>
              <button 
                  onClick={handleToggleReviews}
                  className={cn(
                      "flex-1 flex flex-col items-center justify-center transition-all duration-300 focus:outline-none",
                      showReviews ? "bg-blue-600 text-white" : "bg-blue-500/5 hover:bg-blue-500/10 text-blue-500"
                  )}
              >
                  <ChevronLeft className={cn("h-4 w-4 transition-transform duration-500", showReviews && "rotate-180")} />
                  <span className="text-[8px] md:text-[9px] font-black tracking-tighter uppercase whitespace-nowrap mt-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      AVIS
                  </span>
              </button>
          </div>

        </div>
      </Card>
    </>
  );
};

export default DealershipCard;

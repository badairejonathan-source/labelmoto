
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, MessageSquare, ShieldAlert, ChevronLeft, X, ZoomIn, Clock } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { deleteDocumentNonBlocking, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

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

const DealershipCard: React.FC<DealershipCardProps> = ({ dealership, onClick, className }) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => { setMounted(true); }, []);

  const isAdmin = mounted && !!user && user.uid === ADMIN_UID;

  const stdRef = useMemoFirebase(() => user ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdRef);
  const proRef = useMemoFirebase(() => user ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proRef);

  const activeUserProfile = proProfile || stdProfile;
  const currentPseudo = activeUserProfile?.pseudo || activeUserProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Anonyme';

  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  const categoryLabel = categoryDisplay[dealership.category?.toLowerCase() || ''] || dealership.category;

  const approvedComments = useCollection(useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'concessions', dealership.id, 'comments');
  }, [firestore, dealership.id])).data;

  const handleQuarantine = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin || !firestore) return;
    if (!window.confirm(`Mettre "${dealership.title}" en quarantaine ?`)) return;

    const { id, ...dataToMove } = dealership;
    const cleanData = JSON.parse(JSON.stringify(dataToMove));
    
    cleanData.quarantinedAt = new Date().toISOString();
    cleanData.quarantineSource = 'manual_admin_action';
    cleanData.status = 'QUARANTINED';

    setDocumentNonBlocking(doc(firestore, 'a_verifier', id), cleanData, { merge: true });
    deleteDocumentNonBlocking(doc(firestore, 'concessions', id));
    toast({ title: "Fiche mise en quarantaine" });
  };

  const handleRatingSubmit = () => {
    if (!user || !firestore) return;
    if (newComment.trim().length < 5) return;
    setIsSubmitting(true);
    addDocumentNonBlocking(collection(firestore, 'pending_comments'), {
        userId: user.uid,
        userName: currentPseudo,
        dealershipId: dealership.id,
        dealershipName: dealership.title,
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

  const navigationUrl = (dealership.latitude && dealership.longitude)
    ? `https://www.google.com/maps/dir/?api=1&destination=${dealership.latitude},${dealership.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dealership.title + ' ' + dealership.address)}`;

  return (
    <>
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Avis sur {dealership.title}</DialogTitle></DialogHeader>
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
            <DialogTitle>Zoom sur {dealership.title}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center">
            <button 
              onClick={() => setIsZoomDialogOpen(false)}
              className="absolute top-4 right-4 z-[1400] bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full">
              {dealership.imgUrl && (
                <Image 
                  src={dealership.imgUrl} 
                  alt={dealership.title}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                  sizes="95vw"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className={cn("relative overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-all group", className)}>
        {isAdmin && (
          <button 
            onClick={handleQuarantine} 
            className="absolute top-2 right-2 z-50 p-1.5 md:p-2 bg-destructive/10 text-destructive rounded-full hover:bg-destructive hover:text-white transition-colors shadow-sm"
            title="Mettre en quarantaine"
          >
            <ShieldAlert className="h-3.5 w-3.5 md:h-4 w-4" />
          </button>
        )}

        {/* Note dans un rond orange sur l'image */}
        <div className="absolute top-2 left-2 z-20 flex items-center justify-center h-10 w-10 md:h-12 md:w-12 bg-brand rounded-full text-white shadow-lg border-2 border-white font-black">
          <div className="flex flex-col items-center leading-none">
            <span className="text-xs md:text-sm">{rating > 0 ? rating.toFixed(1) : "—"}</span>
            <Star className="h-2 w-2 fill-white" />
          </div>
        </div>
        
        <div className="flex items-stretch min-h-[110px] md:min-h-[140px]">
          <div className="flex flex-1 flex-row items-stretch">
            <div 
              className="relative w-28 sm:w-40 md:w-52 overflow-hidden border-r bg-muted/30 cursor-zoom-in group/img"
              onClick={(e) => { e.stopPropagation(); setIsZoomDialogOpen(true); }}
            >
              {dealership.imgUrl ? (
                <>
                  <Image src={dealership.imgUrl} alt={dealership.title} fill className="object-cover transition-transform group-hover:brightness-110 duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 flex items-center justify-center transition-all">
                    <ZoomIn className="text-white opacity-0 group-hover/img:opacity-100 h-6 w-6" />
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center opacity-20 p-4"><LabelMotoLogo /></div>
              )}
            </div>
            <div className="flex flex-col justify-center flex-1 p-3 md:p-5 cursor-pointer" onClick={onClick}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-sm md:text-xl uppercase leading-tight truncate">{dealership.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-brand text-[9px] md:text-xs font-black uppercase tracking-widest">{categoryLabel}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-6">
                {dealership.phoneNumber && (
                  <a href={`tel:${dealership.phoneNumber}`} onClick={(e) => e.stopPropagation()} className="group/btn">
                    <div className="h-16 w-16 rounded-full bg-brand/10 flex flex-col items-center justify-center border-2 border-transparent group-hover/btn:bg-brand group-hover/btn:border-white transition-all shadow-lg">
                      <Phone className="h-4 w-4 md:h-5 md:w-5 text-brand group-hover/btn:text-white mb-0.5" />
                      <span className="text-[6px] md:text-[7px] font-black uppercase tracking-tighter text-brand group-hover/btn:text-white">Appel</span>
                    </div>
                  </a>
                )}
                {dealership.website && (
                  <a href={dealership.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="group/btn">
                    <div className="h-16 w-16 rounded-full bg-brand/10 flex flex-col items-center justify-center border-2 border-transparent group-hover/btn:bg-brand group-hover/btn:border-white transition-all shadow-lg">
                      <Globe className="h-4 w-4 md:h-5 md:w-5 text-brand group-hover/btn:text-white mb-0.5" />
                      <span className="text-[6px] md:text-[7px] font-black uppercase tracking-tighter text-brand group-hover/btn:text-white">Web</span>
                    </div>
                  </a>
                )}
                <button 
                  className={cn(
                    "h-16 w-16 rounded-full flex flex-col items-center justify-center transition-all shadow-lg border-2", 
                    showHours ? "bg-brand border-white text-white scale-110" : "bg-brand/10 border-transparent text-brand hover:bg-brand/20"
                  )} 
                  onClick={(e) => { e.stopPropagation(); setShowHours(!showHours); setShowReviews(false); }}
                >
                  <Clock className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-[6px] md:text-[7px] font-black uppercase tracking-tighter leading-none mt-1">Horaires</span>
                </button>
                <button 
                  className={cn(
                    "h-16 w-16 rounded-full flex flex-col items-center justify-center transition-all shadow-lg border-2", 
                    showReviews ? "bg-blue-600 border-white text-white scale-110" : "bg-blue-500/10 border-transparent text-blue-500 hover:bg-blue-50"
                  )} 
                  onClick={(e) => { e.stopPropagation(); setShowReviews(!showReviews); setShowHours(false); }}
                >
                  <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-[6px] md:text-[7px] font-black uppercase tracking-tighter leading-none mt-1">Avis</span>
                </button>
              </div>
              
              <div className="mt-4 border-t border-dashed pt-2">
                <a 
                  href={navigationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-3 bg-brand text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[8px] md:text-[10px] font-black uppercase shadow-sm hover:bg-brand/90 transition-all max-w-full"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <div className="flex flex-col items-start leading-tight text-left">
                    {(() => {
                      const parts = dealership.address.split(',');
                      if (parts.length > 1) {
                        return (
                          <>
                            <span className="truncate w-full">{parts[0].trim()}</span>
                            <span className="opacity-80 font-bold truncate w-full">{parts.slice(1).join(',').trim()}</span>
                          </>
                        );
                      }
                      return <span className="truncate">{dealership.address}</span>;
                    })()}
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {(showHours || showReviews) && (
            <div className="absolute inset-0 z-30 bg-background/95 backdrop-blur-sm border-r animate-in slide-in-from-right duration-300 p-4 flex flex-col justify-center overflow-hidden shadow-2xl">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHours(false); setShowReviews(false); }}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              {showHours && (
                <div className="space-y-1 w-full max-w-xs mx-auto">
                  {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(d => (
                    <div key={d} className="flex justify-between items-center text-[10px] font-bold border-b border-dashed border-muted last:border-0 pb-0.5">
                      <span className="capitalize text-muted-foreground">{d}</span>
                      <span className="text-brand text-right">{dealership[d] || 'Fermé'}</span>
                    </div>
                  ))}
                </div>
              )}
              {showReviews && (
                <div className="h-full flex flex-col max-w-xs mx-auto w-full pt-4">
                  <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 scrollbar-thin">
                    {approvedComments?.map(c => <div key={c.id} className="bg-muted/30 p-2 rounded text-[10px]"><div className="flex justify-between font-bold"><span>{c.userName}</span><span>{c.rating}/5</span></div><p className="italic">"{c.content}"</p></div>)}
                    {(!approvedComments || approvedComments.length === 0) && <p className="text-[10px] text-muted-foreground text-center py-4">Aucun avis publié pour le moment.</p>}
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 text-[9px] uppercase font-black" onClick={(e) => { e.stopPropagation(); setIsReviewDialogOpen(true); }}>Donner mon avis</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default DealershipCard;

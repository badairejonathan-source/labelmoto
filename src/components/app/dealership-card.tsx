'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Phone, Globe, MessageSquare, ShieldAlert, ChevronLeft, ArrowUpRight } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import LabelMotoLogo from './logo';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
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

  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  const categoryLabel = categoryDisplay[dealership.category?.toLowerCase() || ''] || dealership.category;

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'concessions', dealership.id, 'comments');
  }, [firestore, dealership.id]);
  const { data: approvedComments } = useCollection(commentsQuery);

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

  const navigationUrl = dealership.placeUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dealership.address)}`;

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

      <Card className={cn("relative overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-all", className)}>
        <div className="flex items-stretch min-h-[110px] md:min-h-[140px]">
          <div className="flex flex-1 flex-row items-stretch pr-8 md:pr-10">
            <div className="relative w-24 sm:w-32 md:w-44 overflow-hidden border-r bg-muted/30">
              {dealership.imgUrl ? <Image src={dealership.imgUrl} alt={dealership.title} fill className="object-cover" /> : <div className="flex h-full items-center justify-center opacity-20 p-2"><LabelMotoLogo /></div>}
            </div>
            <div className="flex flex-col justify-center flex-1 p-3 md:p-5 cursor-pointer" onClick={onClick}>
              <h3 className="font-black text-sm md:text-xl uppercase leading-tight mb-1">{dealership.title}</h3>
              <div className="flex items-center gap-3">
                <span className="text-brand text-[9px] md:text-xs font-black uppercase">{categoryLabel}</span>
                <div className="flex items-center gap-1 text-[10px] md:text-xs text-yellow-400 font-bold">
                  <Star className="h-3 w-3 fill-yellow-400" />
                  <span>{rating > 0 ? rating.toFixed(1) : "Nouveau"}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-[9px] uppercase font-bold mt-3">
                {dealership.phoneNumber && (
                  <a href={`tel:${dealership.phoneNumber}`} className="hover:text-brand flex flex-col items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Phone className="h-4 w-4 text-brand" /> Appel
                  </a>
                )}
                {dealership.website && (
                  <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand flex flex-col items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Globe className="h-4 w-4 text-brand" /> Web
                  </a>
                )}
                <button onClick={(e) => { e.stopPropagation(); setShowReviews(true); setShowHours(false); }} className="hover:text-brand flex flex-col items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-brand" /> Avis
                </button>
                {isAdmin && <button onClick={handleQuarantine} className="text-destructive flex flex-col items-center gap-1"><ShieldAlert className="h-4 w-4" />Modérer</button>}
              </div>
              
              <div className="mt-3 flex items-center gap-2 border-t border-dashed pt-2">
                <a 
                  href={navigationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 text-[10px] md:text-xs text-muted-foreground hover:text-brand flex items-center gap-1 group/addr transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MapPin className="h-3.5 w-3.5 text-brand group-hover/addr:scale-110 transition-transform" />
                  <span className="line-clamp-1 underline-offset-2 group-hover/addr:underline font-bold">{dealership.address}</span>
                </a>
                <a 
                  href={navigationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="shrink-0 bg-brand/10 hover:bg-brand text-brand hover:text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Y ALLER</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-8 md:w-10 z-40 flex flex-col bg-card border-l">
            <button className={cn("flex-1 flex flex-col items-center justify-center transition-all", showHours ? "bg-brand text-white" : "text-brand")} onClick={(e) => { e.stopPropagation(); setShowHours(!showHours); setShowReviews(false); }}>
              <ChevronLeft className={cn("h-4 w-4 transition-transform", showHours && "rotate-180")} />
              <span className="text-[8px] font-black uppercase whitespace-nowrap mt-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>HORAIRES</span>
            </button>
            <button className={cn("flex-1 flex flex-col items-center justify-center transition-all", showReviews ? "bg-blue-600 text-white" : "text-blue-500")} onClick={(e) => { e.stopPropagation(); setShowReviews(!showReviews); setShowHours(false); }}>
              <ChevronLeft className={cn("h-4 w-4 transition-transform", showReviews && "rotate-180")} />
              <span className="text-[8px] font-black uppercase whitespace-nowrap mt-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>AVIS</span>
            </button>
          </div>
          {(showHours || showReviews) && (
            <div className="absolute inset-y-0 left-0 right-8 md:right-10 z-30 bg-background border-r animate-in slide-in-from-right duration-300 p-4">
              {showHours && <div className="space-y-1 text-xs">{['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(d => <div key={d} className="flex justify-between font-bold"><span className="capitalize">{d}</span><span className="text-brand">{dealership[d] || 'Fermé'}</span></div>)}</div>}
              {showReviews && (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {approvedComments?.map(c => <div key={c.id} className="bg-muted/30 p-2 rounded text-[10px]"><div className="flex justify-between font-bold"><span>{c.userName}</span><span>{c.rating}/5</span></div><p className="italic">"{c.content}"</p></div>)}
                    {(!approvedComments || approvedComments.length === 0) && <p className="text-[10px] text-muted-foreground text-center py-4">Soyez le premier à donner votre avis !</p>}
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

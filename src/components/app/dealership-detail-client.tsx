'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/app/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, Home, ChevronRight, Star, MessageSquare, User, Loader2, Send, Instagram } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dealership } from '@/lib/types';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc, addDocumentNonBlocking } from '@/firebase/client';
import { DEPARTMENTS } from '@/app/lib/departments';
import { collection, query, orderBy, serverTimestamp, doc, updateDoc, increment, getDocs, where, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { trackEvent, trackBeacon } from '@/lib/analytics';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DealershipDetailClientProps {
  pro: Dealership;
  hasCityPage?: boolean;
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Veuillez donner une note.").max(5),
  content: z.string().min(10, "Votre avis doit faire au moins 10 caractères."),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function DealershipDetailClient({ pro, hasCityPage = false }: DealershipDetailClientProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [descExpanded, setDescExpanded] = useState(false);
  const [nearby, setNearby] = useState<Array<{id:string;title:string;slug?:string;category?:string;address?:string}>>([]);

  useEffect(() => {
    if (!firestore || !(pro as any).departement) return;
    const dept = (pro as any).departement;
    const proId = pro.id || pro.slug;
    getDocs(
      query(
        collection(firestore, 'concessions'),
        where('departement', '==', dept),
        limit(8)
      )
    ).then(snap => {
      const results = snap.docs
        .filter(d => d.id !== proId && d.data().slug !== proId)
        .slice(0, 5)
        .map(d => ({ id: d.id, title: d.data().title || d.id, slug: d.data().slug, category: d.data().category, address: d.data().address }));
      setNearby(results);
    }).catch(() => {});
  }, [firestore, pro]);
  const getProCollection = () => pro.appSection === 'association' ? 'associations' : (pro.appSection === 'relais' ? 'relais' : (pro.appSection === 'creator' ? 'creators' : 'concessions'));
  const ADMIN_EMAILS = ['badjoe950@hotmail.com', 'badaire.jonathan@gmail.com'];
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
  const trackStat = (field: string) => {
    if (isAdmin) return; // Ne pas tracker les clics admin
    if (!pro.id) return;
    const colName = getProCollection();
    fetch('/api/track-stat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection: colName, id: pro.id, field }),
      keepalive: true,
    }).catch(() => {});
  };
  const { toast } = useToast();
  const router = useRouter();
  
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const proProfileRef = useMemoFirebase(() => (user && firestore) ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proProfileRef);
  const stdProfileRef = useMemoFirebase(() => (user && firestore) ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdProfileRef);
  
  const activeProfile = proProfile || stdProfile;

  const reviewsRef = useMemoFirebase(() => {
    if (!firestore || !pro.id) return null;
    return query(collection(firestore, 'concessions', pro.id, 'comments'), orderBy('date', 'desc'));
  }, [firestore, pro.id]);

  const { data: reviews, isLoading: reviewsLoading } = useCollection(reviewsRef);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, content: '' },
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#leave-review') {
      if (user && activeProfile) {
        setIsReviewDialogOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [user, activeProfile]);

  const handleLeaveReviewClick = () => {
    const currentPath = `/concessions/${pro.slug || pro.id}`;
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}#leave-review`);
      return;
    }
    if (!activeProfile) {
      router.push(`/account?callbackUrl=${encodeURIComponent(currentPath)}#leave-review`);
      return;
    }
    setIsReviewDialogOpen(true);
  };

  const onSubmitReview = async (values: ReviewFormValues) => {
    if (!user || !activeProfile || !firestore) return;
    setIsSubmittingReview(true);
    
    try {
      addDocumentNonBlocking(collection(firestore, 'pending_comments'), {
        dealershipId: pro.id,
        dealershipName: pro.title,
        userId: user.uid,
        userName: activeProfile.pseudo || activeProfile.displayName || "Anonyme",
        rating: values.rating,
        content: values.content,
        date: serverTimestamp(),
      });
      
      toast({ 
        title: "Avis envoyé !", 
        description: "Merci ! Votre avis a été transmis à l'équipe pour validation avant publication." 
      });
      setIsReviewDialogOpen(false);
      form.reset();
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'envoyer l'avis." });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm="" onSearchTermChange={() => {}} onSearch={() => {}} />

      <main className="container mx-auto px-4 py-8 pt-24 md:pt-32 max-w-5xl">
        {/* Breadcrumb : Accueil → Ville → Fiche */}
        {(() => {
          // Extraire la ville depuis l'adresse (après le code postal)
          const addrParts = (pro.address || '').split(',').map((s: string) => s.trim());
          const cpIdx = addrParts.findIndex((p: string) => /\d{5}/.test(p));
          const cityRaw = cpIdx !== -1
            ? (addrParts[cpIdx].match(/\d{5}\s*(.*)/)?.[1] || addrParts[cpIdx + 1] || '')
            : addrParts[addrParts.length - 2] || '';
          const citySlug = cityRaw.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return (
            <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8 flex-wrap">
              <Link href="/" className="hover:text-brand flex items-center gap-1"><Home className="h-3 w-3" /> ACCUEIL</Link>
              {cityRaw && citySlug && (hasCityPage) && (
                <>
                  <ChevronRight className="h-2 w-2" />
                  <Link href={'/garages-moto/' + citySlug} className="hover:text-brand">{cityRaw}</Link>
                </>
              )}
              {cityRaw && citySlug && (!((hasCityPage)) && (pro as any).departement) && (() => {
                const deptData = DEPARTMENTS.find(d => d.code === (pro as any).departement);
                if (!deptData) return null;
                return (
                  <>
                    <ChevronRight className="h-2 w-2" />
                    <Link href={'/garages-moto/departement/' + deptData.slug} className="hover:text-brand">{deptData.name}</Link>
                  </>
                );
              })()}
              <ChevronRight className="h-2 w-2" />
              <span className="text-foreground truncate max-w-[200px]">{pro.title}</span>
            </nav>
          );
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-8">
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-muted">
                <Image 
                  src={pro.imageUrl || pro.imgUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"} 
                  alt={pro.title} 
                  fill 
                  className="object-cover" 
                  priority
                />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-none">{pro.title}</h1>
                <p className="text-xl font-bold text-brand italic">{pro.category || 'Professionnel moto'}</p>
                <div className="flex items-start gap-3 p-6 bg-muted/30 rounded-2xl border-2 border-dashed">
                  <MapPin className="h-6 w-6 text-brand shrink-0" />
                  <div>
                    <p className="font-black text-lg uppercase tracking-tight">{pro.address}</p>
                    <Button asChild variant="link" className="p-0 h-auto text-brand font-black uppercase text-[10px]"><a href={`https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`} target="_blank" rel="noopener noreferrer" onClick={() => { trackBeacon('clic_itineraire', { pro: pro.title, source: 'fiche', slug: pro.slug || pro.id || '' }); trackEvent('clic_itineraire', { pro: pro.title, source: 'fiche' }); }}>Calculer l'itinéraire</a></Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {pro.phoneNumber && (
                  <Button asChild className="h-16 rounded-2xl bg-white border-2 border-muted hover:border-brand shadow-lg text-foreground transition-all">
                    <a href={`tel:${pro.phoneNumber}`} className="flex items-center gap-2 sm:gap-4 px-2 sm:px-6" onClick={() => { trackBeacon('clic_telephone', { pro: pro.title, source: 'fiche', slug: pro.slug || pro.id || '' }); trackEvent('clic_telephone', { pro: pro.title, source: 'fiche' }); trackStat('stats_tel'); }}>
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-brand shrink-0" />
                      <div className="text-left min-w-0">
                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-50">Appeler</p>
                        <p className="font-black text-[10px] sm:text-sm truncate">{pro.phoneNumber}</p>
                      </div>
                    </a>
                  </Button>
                )}
                {pro.website && (
                  <Button asChild className="h-16 rounded-2xl bg-white border-2 border-muted hover:border-brand shadow-lg text-foreground transition-all">
                    <a href={pro.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-4 px-2 sm:px-6" onClick={() => { trackBeacon('clic_site_web', { pro: pro.title, source: 'fiche', slug: pro.slug || pro.id || '' }); trackEvent('clic_site_web', { pro: pro.title, source: 'fiche' }); trackStat('stats_web'); }}>
                      <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-brand shrink-0" />
                      
                <div className="text-left min-w-0">
                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-50">Site Web</p>
                        <p className="font-black text-[10px] sm:text-sm truncate">Visiter le site</p>
                      </div>
                    </a>
                  </Button>
                )}
              </div>
              {((pro as any).instagramUrl || (pro as any).facebookUrl) && (
                <div className="flex gap-3 flex-wrap pt-2">
                  {(pro as any).instagramUrl && (
                    <a href={(pro as any).instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                      onClick={() => { trackBeacon('clic_instagram', { pro: pro.title, source: 'fiche', slug: pro.slug || pro.id || '' }); trackEvent('clic_instagram', { pro: pro.title, source: 'fiche' }); trackStat('stats_instagram'); }}
                    >
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                  )}
                  {(pro as any).facebookUrl && (
                    <a href={(pro as any).facebookUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                      onClick={() => { trackBeacon('clic_facebook', { pro: pro.title, source: 'fiche', slug: pro.slug || pro.id || '' }); trackEvent('clic_facebook', { pro: pro.title, source: 'fiche' }); trackStat('stats_facebook'); }}
                    >
                      <Globe className="h-4 w-4" /> Facebook
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Description / Informations complémentaires */}
            {(pro.description || (pro as any).info) && (() => {
              const descText = (pro.description || (pro as any).info || '') as string;
              return (
                <div className="rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-5 py-3 bg-muted/40 border-b border-border/40">
                    <span className="text-brand text-base">📝</span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">À propos</h3>
                  </div>
                  <div className="px-5 py-4 bg-background">
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: descExpanded ? '2000px' : '96px' }}
                    >
                      <p className="text-base font-medium text-foreground leading-relaxed whitespace-pre-line">
                        {descText}
                      </p>
                    </div>
                    {descText.length > 200 && (
                      <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand hover:opacity-70 transition-opacity"
                      >
                        {descExpanded ? '▲ Réduire' : '▼ Voir tout'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
                        <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/50 p-6 border-b">
                <CardTitle className="text-sm font-black uppercase flex items-center gap-3">
                  <Clock className="h-5 w-5 text-brand" /> Horaires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-2">
                {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(day => (
                  <div key={day} className="flex justify-between items-center text-xs font-bold border-b border-dashed border-muted last:border-0 pb-1.5 pt-1.5">
                    <span className="capitalize text-muted-foreground">{day}</span>
                    <span className="text-foreground font-black">{(pro.horaires && pro.horaires[day]) || pro[day] || 'Fermé'}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section concessions proches */}
            {nearby.length > 0 && (
              <section className="pt-6">
                <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                  <span className="text-brand">📍</span> Professionnels moto proches
                </h2>
                <div className="grid gap-3">
                  {nearby.map(n => (
                    <a key={n.id} href={'/concessions/' + (n.slug || n.id)}
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border hover:border-brand/40 transition-colors group">
                      <div className="h-9 w-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 text-brand font-black text-sm group-hover:bg-brand group-hover:text-white transition-colors">
                        🏍️
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sm uppercase tracking-tight truncate group-hover:text-brand transition-colors">{n.title}</p>
                        {n.address && <p className="text-xs text-muted-foreground truncate">{n.address}</p>}
                      </div>
                      <span className="ml-auto text-brand opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs">→</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
            <section id="reviews" className="scroll-mt-28 space-y-8 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-4 border-brand pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-brand" /> Avis Clients
                  </h2>
                  <div className="bg-brand text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {reviews?.length || 0} avis
                  </div>
                </div>
                <Button 
                  onClick={handleLeaveReviewClick}
                  className="bg-foreground text-white hover:bg-brand rounded-full font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Laisser un avis
                </Button>
              </div>

              {reviewsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-brand" />
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="grid gap-6">
                  {reviews.map((review: any) => (
                    <Card key={review.id} className="border-2 rounded-[2rem] overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow">
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                              <User className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-black uppercase text-sm leading-none">{review.userName || 'Motard'}</p>
                              <p className="text-[10px] text-muted-foreground font-bold mt-1">
                                {review.date ? formatDistanceToNow(new Date(review.date.seconds ? review.date.seconds * 1000 : review.date), { addSuffix: true, locale: fr }) : 'Récemment'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("h-4 w-4", i < (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20")} />
                            ))}
                          </div>
                        </div>
                        <p className="text-base font-bold text-foreground/80 italic leading-relaxed">
                          "{review.content}"
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 p-12 rounded-[2rem] border-2 border-dashed text-center">
                  <p className="font-black uppercase text-muted-foreground">Aucun avis pour le moment.</p>
                  <p className="text-xs font-bold text-muted-foreground mt-2">Soyez le premier à partager votre expérience !</p>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-brand/5 p-8 rounded-[2rem] border-2 border-brand/20 text-center space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-brand">Besoin d'un autre pro ?</p>
              <Button asChild className="w-full bg-brand rounded-full font-black uppercase text-[10px] tracking-widest py-6">
                <Link href="/map">Retour à la carte interactive</Link>
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-brand text-white p-8 md:p-10">
            <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Votre avis nous intéresse</DialogTitle>
            <DialogDescription className="text-white/80 font-bold text-sm md:text-base leading-snug">
              Partagez votre expérience chez <strong>{pro.title}</strong> avec la communauté motarde.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-8 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block text-center">Note globale</FormLabel>
                      <FormControl>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => field.onChange(star)}
                              className="focus:outline-none transition-transform active:scale-90"
                            >
                              <Star 
                                className={cn(
                                  "h-10 w-10 md:h-12 md:w-12 transition-colors",
                                  star <= field.value ? "fill-yellow-400 text-yellow-400" : "text-muted/30"
                                )} 
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Votre commentaire</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Points forts, accueil, qualité du service..." 
                          className="min-h-[150px] font-bold text-base p-4 rounded-2xl border-2 bg-muted/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsReviewDialogOpen(false)}
                    className="font-bold uppercase text-[10px] tracking-widest h-14 rounded-full flex-1"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="bg-brand hover:bg-brand/90 text-white font-black uppercase text-[10px] tracking-widest h-14 rounded-full px-12 shadow-xl shadow-brand/20 flex-1"
                  >
                    {isSubmittingReview ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Envoyer mon avis</>}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

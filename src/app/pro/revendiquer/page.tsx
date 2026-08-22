'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/app/header';
import { Loader2, Search, MapPin, ArrowLeft, Send, CheckCircle, Store } from 'lucide-react';
import ImageUploadRequest from '@/components/app/image-upload-request';
import { loadPublicSeoPros } from '@/lib/public-seo-pros';

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const EDITABLE_FIELDS = ['title', 'address', 'phoneNumber', 'email', 'website', 'category', 'info', 'googleMapsUrl', 'instagramUrl', 'facebookUrl', ...JOURS];

function normalize(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function RevendiquerPage() {
  const { firestore, user, profile, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [allListings, setAllListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Protection d'accès : redirige vers login si pas connecté. Les non-pros voient un écran d'invitation (voir plus bas).
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?callbackUrl=/pro/revendiquer');
    }
  }, [user, isUserLoading, router]);

  const isPro = profile?.role === 'pro' || profile?.role === 'admin';

  const loadListings = useCallback(async () => {
    setIsLoading(true);

    try {
      const all = await loadPublicSeoPros();

      setAllListings(all);
    } catch (e) {
      console.warn(
        'Erreur chargement index public des fiches',
        e
      );

      setAllListings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && isPro) {
      loadListings();
    }
  }, [user, isPro, loadListings]);

  const results = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];
    const q = normalize(searchTerm);
    return allListings.filter(l => normalize(l.title).includes(q) || normalize(l.address).includes(q)).slice(0, 30);
  }, [searchTerm, allListings]);

  const selectListing = async (l: any) => {
    if (!firestore) return;

    setIsLoading(true);

    try {
      // Une seule lecture Firestore :
      // uniquement la fiche réellement choisie.
      const snapshot = await getDoc(
        doc(firestore, l.collection, l.id)
      );

      if (!snapshot.exists()) {
        toast({
          title: 'Fiche introuvable',
          description:
            'Cette fiche n’existe plus dans la base.',
          variant: 'destructive',
        });

        return;
      }

      const fullListing = {
        ...l,
        ...snapshot.data(),
        id: snapshot.id,
        collection: l.collection,
      };

      setSelected(fullListing);

      const initial: any = {};

      EDITABLE_FIELDS.forEach(field => {
        initial[field] = fullListing[field] || '';
      });

      setForm(initial);
    } catch (e: any) {
      toast({
        title: 'Erreur',
        description:
          e?.message ||
          'Impossible de charger cette fiche.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setField = (k: string, v: string) => setForm((prev: any) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!firestore || !user || !selected) return;
    setIsSubmitting(true);
    try {
      // Calculer uniquement les champs modifiés
      const changes: any = {};
      EDITABLE_FIELDS.forEach(f => {
        if ((form[f] || '') !== (selected[f] || '')) {
          changes[f] = { old: selected[f] || '', new: form[f] || '' };
        }
      });

      if (Object.keys(changes).length === 0) {
        toast({ title: 'Aucune modification', description: 'Tu n\'as rien changé.' });
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(firestore, 'modification_requests'), {
        targetCollection: selected.collection,
        targetId: selected.id,
        targetTitle: selected.title,
        requestedByUid: user.uid,
        requestedByEmail: profile?.email || user.email || '',
        requestedByName: profile?.companyName || profile?.pseudo || profile?.displayName || '',
        changes,
        newValues: form,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      toast({ title: 'Demande envoyée !', description: 'Elle sera examinée avant publication.' });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  if (isUserLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  // Connecté mais pas pro : invitation à créer un compte pro
  if (!isPro) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <Store className="h-16 w-16 text-brand mx-auto mb-4 opacity-30" />
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Réservé aux professionnels</h1>
          <p className="text-sm text-muted-foreground mb-8">Pour revendiquer et gérer une fiche d'établissement, tu dois disposer d'un compte professionnel. La création est gratuite et rapide.</p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button onClick={() => router.push('/pro/register')} className="rounded-xl font-black uppercase text-xs tracking-widest h-12">Créer un compte professionnel</Button>
            <Button onClick={() => router.push('/')} variant="outline" className="rounded-xl font-black uppercase text-xs tracking-widest h-11">Retour à l'accueil</Button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Demande envoyée !</h1>
          <p className="text-muted-foreground mb-2 font-bold">{selected?.title}</p>
          <p className="text-sm text-muted-foreground mb-8">Ta demande de modification sera examinée par notre équipe avant d'être publiée. Tu recevras un email une fois validée.</p>
          <Button onClick={() => router.push('/')} className="rounded-xl font-black uppercase text-xs tracking-widest h-11">Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        {!selected ? (
          <>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Revendiquer ma fiche</h1>
            <p className="text-sm text-muted-foreground mb-6">Recherche l'établissement que tu souhaites gérer, puis propose tes modifications. Elles seront validées avant publication.</p>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Nom de l'établissement ou ville..." className="pl-11 h-12 rounded-2xl border-2 font-bold" />
            </div>
            {isLoading && <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>}
            {!isLoading && searchTerm.trim().length >= 2 && results.length === 0 && (
              <div className="text-center py-10 text-muted-foreground"><p className="font-bold uppercase text-xs">Aucune fiche trouvée</p><p className="text-xs mt-2">Ta fiche n'existe pas encore ? <a href="/map?mode=pro_create" className="text-brand underline">Crée-la ici</a></p></div>
            )}
            <div className="space-y-2">
              {results.map(l => (
                <button key={`${l.collection}/${l.id}`} onClick={() => selectListing(l)} className="w-full text-left bg-white rounded-2xl border-2 p-4 flex items-center gap-3 hover:border-brand/40 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0"><Store className="h-5 w-5 text-muted-foreground" /></div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{l.title}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><MapPin className="h-3 w-3" /> {l.address || 'Adresse non renseignée'}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Choisir une autre fiche</button>
            <h1 className="text-xl font-black uppercase tracking-tight mb-1">{selected.title}</h1>
            <p className="text-xs text-muted-foreground mb-6 font-bold uppercase tracking-widest">Modifie les infos puis envoie ta demande</p>

            <div className="space-y-3 bg-white rounded-3xl border-2 p-6">
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Nom</Label><Input value={form.title} onChange={e => setField('title', e.target.value)} className="font-bold rounded-xl border-2" /></div>
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Adresse</Label><Input value={form.address} onChange={e => setField('address', e.target.value)} className="font-bold rounded-xl border-2" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Téléphone</Label><Input value={form.phoneNumber} onChange={e => setField('phoneNumber', e.target.value)} className="font-bold rounded-xl border-2" /></div>
                <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Catégorie</Label><Input value={form.category} onChange={e => setField('category', e.target.value)} className="font-bold rounded-xl border-2" /></div>
              </div>
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email</Label><Input value={form.email} onChange={e => setField('email', e.target.value)} className="font-bold rounded-xl border-2" /></div>
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Site web</Label><Input value={form.website} onChange={e => setField('website', e.target.value)} className="font-bold rounded-xl border-2" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Instagram</Label><Input value={form.instagramUrl} onChange={e => setField('instagramUrl', e.target.value)} className="font-bold rounded-xl border-2" /></div>
                <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Facebook</Label><Input value={form.facebookUrl} onChange={e => setField('facebookUrl', e.target.value)} className="font-bold rounded-xl border-2" /></div>
              </div>
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Description</Label><Textarea value={form.info} onChange={e => setField('info', e.target.value)} className="font-bold rounded-xl border-2 min-h-[70px]" /></div>

              <div className="border-t pt-3">
                <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1 mb-2 block">Horaires</Label>
                <div className="space-y-2">
                  {JOURS.map(j => (
                    <div key={j} className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">{j}</span>
                      <Input value={form[j]} onChange={e => setField(j, e.target.value)} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload photo */}
            <div className="border-t pt-4 space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1 block">
                📸 Photo de l'établissement (optionnel)
              </Label>
              <p className="text-[10px] text-muted-foreground ml-1">La photo sera validée par notre équipe avant publication.</p>
              <ImageUploadRequest
                concessionSlug={selected.id}
                concessionTitle={selected.title}
                onSuccess={(url) => console.log('Photo soumise:', url)}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full rounded-xl font-black uppercase text-xs tracking-widest h-12 mt-4">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Envoyer ma demande de modification</>}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest mt-2">Tes modifications seront validées avant publication</p>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import Header from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Loader2, Send } from 'lucide-react';
import { isAllowedProCollection } from '@/lib/pro-claim-utils';
import { submitOwnedModificationAction } from './actions';

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const FIELDS = ['title', 'address', 'phoneNumber', 'email', 'website', 'category', 'info', 'instagramUrl', 'facebookUrl', ...DAYS];

export default function EditOwnedListingPage() {
  const params = useParams<{ collection: string; id: string }>();
  const collectionName = decodeURIComponent(params.collection || '');
  const listingId = decodeURIComponent(params.id || '');
  const { firestore, user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [listing, setListing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(`/pro/mes-fiches/${collectionName}/${listingId}`)}`);
      return;
    }
    if (!user.emailVerified) {
      router.replace(`/verify-email?callbackUrl=${encodeURIComponent(`/pro/mes-fiches/${collectionName}/${listingId}`)}`);
    }
  }, [user, isUserLoading, router, collectionName, listingId]);

  useEffect(() => {
    if (!firestore || !user?.emailVerified || !isAllowedProCollection(collectionName) || !listingId) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const snapshot = await getDoc(doc(firestore, collectionName, listingId));
        if (!snapshot.exists()) throw new Error('Fiche introuvable.');
        const data = snapshot.data();
        if (data.ownerUid !== user.uid) throw new Error('Cette fiche n’est pas rattachée à votre compte.');

        const values: Record<string, string> = {};
        for (const field of FIELDS) {
          values[field] = DAYS.includes(field)
            ? String(data.horaires?.[field] ?? data[field] ?? '')
            : String(data[field] ?? '');
        }

        if (!cancelled) {
          setListing({ id: snapshot.id, ...data });
          setForm(values);
        }
      } catch (error: any) {
        if (!cancelled) {
          toast({ title: 'Accès impossible', description: error.message, variant: 'destructive' });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [firestore, user, collectionName, listingId, toast]);

  const setField = (field: string, value: string) => {
    setForm(previous => ({ ...previous, [field]: value }));
  };

  const submit = async () => {
    if (!user || !listing) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('idToken', await user.getIdToken(true));
      formData.set('targetCollection', collectionName);
      formData.set('targetId', listingId);
      for (const field of FIELDS) formData.set(field, form[field] || '');

      const result = await submitOwnedModificationAction(formData);
      if (result?.error) {
        toast({ title: 'Demande impossible', description: result.error, variant: 'destructive' });
        return;
      }

      setSubmitted(true);
      toast({ title: 'Modifications envoyées', description: 'Elles seront publiées uniquement après validation Label Moto.' });
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isUserLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Demande envoyée</h1>
          <p className="text-sm text-muted-foreground mb-8">Votre fiche publique reste inchangée jusqu’à la validation de Label Moto.</p>
          <Button onClick={() => router.push('/account')}>Retour à mes fiches</Button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <p className="font-black">Fiche inaccessible.</p>
          <Button asChild className="mt-4"><Link href="/account">Retour à mon compte</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground mb-5">
          <ArrowLeft className="h-4 w-4" /> Mes fiches
        </Link>

        <h1 className="text-2xl font-black uppercase tracking-tight mb-1">Modifier ma fiche</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Proposez vos changements. Label Moto les vérifie et garde la validation finale avant publication.
        </p>

        <div className="bg-white rounded-3xl border-2 p-6 space-y-4">
          <div><Label>Nom</Label><Input value={form.title || ''} onChange={e => setField('title', e.target.value)} /></div>
          <div><Label>Adresse</Label><Input value={form.address || ''} onChange={e => setField('address', e.target.value)} /></div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>Téléphone</Label><Input value={form.phoneNumber || ''} onChange={e => setField('phoneNumber', e.target.value)} /></div>
            <div><Label>Catégorie / spécialité</Label><Input value={form.category || ''} onChange={e => setField('category', e.target.value)} /></div>
          </div>
          <div><Label>E-mail public</Label><Input value={form.email || ''} onChange={e => setField('email', e.target.value)} /></div>
          <div><Label>Site web</Label><Input value={form.website || ''} onChange={e => setField('website', e.target.value)} /></div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>Instagram</Label><Input value={form.instagramUrl || ''} onChange={e => setField('instagramUrl', e.target.value)} /></div>
            <div><Label>Facebook</Label><Input value={form.facebookUrl || ''} onChange={e => setField('facebookUrl', e.target.value)} /></div>
          </div>
          <div><Label>Description</Label><Textarea value={form.info || ''} onChange={e => setField('info', e.target.value)} className="min-h-[100px]" /></div>

          <div className="border-t pt-4">
            <Label className="mb-2 block">Horaires</Label>
            <div className="space-y-2">
              {DAYS.map(day => (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{day}</span>
                  <Input value={form[day] || ''} onChange={e => setField(day, e.target.value)} placeholder="09:00-12:00, 14:00-18:00" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-muted/30 p-4 text-xs text-muted-foreground">
            La géolocalisation, le lien Google Maps et les coordonnées GPS sont gérés uniquement par Label Moto.
          </div>

          <Button onClick={submit} disabled={submitting} className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Envoyer mes modifications</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

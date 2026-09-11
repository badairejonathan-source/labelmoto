'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/app/header';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  MailCheck,
  MapPin,
  Search,
  Send,
  Store,
} from 'lucide-react';
import { loadPublicSeoPros } from '@/lib/public-seo-pros';
import {
  domainsMatch,
  getEmailDomain,
  getWebsiteDomain,
} from '@/lib/pro-claim-utils';
import { submitClaimAction } from './actions';

function normalize(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function RevendiquerPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [allListings, setAllListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [roleInBusiness, setRoleInBusiness] = useState('');
  const [siret, setSiret] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace('/login?callbackUrl=/pro/revendiquer');
      return;
    }

    if (!user.emailVerified) {
      router.replace('/verify-email?callbackUrl=/pro/revendiquer');
    }
  }, [user, isUserLoading, router]);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    try {
      setAllListings(await loadPublicSeoPros());
    } catch (error) {
      console.warn('Erreur chargement index public des fiches', error);
      setAllListings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.emailVerified) loadListings();
  }, [user, loadListings]);

  const results = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];
    const q = normalize(searchTerm);
    return allListings
      .filter(listing =>
        normalize(listing.title).includes(q) ||
        normalize(listing.address).includes(q)
      )
      .slice(0, 30);
  }, [searchTerm, allListings]);

  const selectListing = async (listing: any) => {
    if (!firestore) return;

    setIsLoading(true);
    try {
      const snapshot = await getDoc(doc(firestore, listing.collection, listing.id));
      if (!snapshot.exists()) {
        toast({
          title: 'Fiche introuvable',
          description: 'Cette fiche n’existe plus dans la base.',
          variant: 'destructive',
        });
        return;
      }

      setSelected({
        ...listing,
        ...snapshot.data(),
        id: snapshot.id,
        collection: listing.collection,
      });
      setRoleInBusiness('');
      setSiret('');
      setBusinessPhone('');
      setProofNote('');
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error?.message || 'Impossible de charger cette fiche.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const emailDomain = getEmailDomain(user?.email || '');
  const websiteDomain = getWebsiteDomain(selected?.website || '');
  const domainMatch = domainsMatch(emailDomain, websiteDomain);
  const isAlreadyMine = Boolean(selected?.ownerUid && selected.ownerUid === user?.uid);
  const isOwnedByAnother = Boolean(selected?.ownerUid && selected.ownerUid !== user?.uid);

  const handleSubmit = async () => {
    if (!user || !selected) return;

    if (!user.emailVerified) {
      router.push('/verify-email?callbackUrl=/pro/revendiquer');
      return;
    }

    if (!domainMatch && (!roleInBusiness.trim() || !businessPhone.trim())) {
      toast({
        title: 'Informations manquantes',
        description: 'Indiquez votre fonction et un téléphone professionnel.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('idToken', await user.getIdToken(true));
      formData.set('targetCollection', selected.collection);
      formData.set('targetId', selected.id);
      formData.set('roleInBusiness', roleInBusiness);
      formData.set('siret', siret);
      formData.set('businessPhone', businessPhone);
      formData.set('proofNote', proofNote);

      const result = await submitClaimAction(formData);
      if (result?.error) {
        toast({ title: 'Demande impossible', description: result.error, variant: 'destructive' });
        return;
      }

      setSubmitted(true);
      toast({
        title: 'Demande envoyée',
        description: 'Label Moto garde la validation finale avant de vous attribuer la fiche.',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error?.message || 'Impossible d’envoyer la demande.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || !user || !user.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Demande envoyée</h1>
          <p className="font-bold mb-2">{selected?.title}</p>
          <p className="text-sm text-muted-foreground mb-8">
            Votre adresse e-mail est vérifiée. La revendication reste en attente jusqu’à la validation finale de Label Moto.
          </p>
          <Button onClick={() => router.push('/account')} className="rounded-xl font-black uppercase text-xs tracking-widest h-11">
            Mon espace personnel
          </Button>
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
            <p className="text-sm text-muted-foreground mb-6">
              Recherchez votre établissement puis sélectionnez sa fiche. Aucune information publique ne sera modifiée à cette étape.
            </p>

            <div className="rounded-2xl border bg-white p-4 mb-6 flex items-start gap-3">
              <MailCheck className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest">E-mail du compte vérifié</p>
                <p className="text-sm font-bold mt-1">{user.email}</p>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Nom de l'établissement ou ville..."
                className="pl-11 h-12 rounded-2xl border-2 font-bold"
              />
            </div>

            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
              </div>
            )}

            {!isLoading && searchTerm.trim().length >= 2 && results.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <p className="font-bold uppercase text-xs">Aucune fiche trouvée</p>
                <p className="text-xs mt-2">
                  Votre établissement n’existe pas encore ?{' '}
                  <a href="/pro/register" className="text-brand underline">Créez votre fiche</a>
                </p>
              </div>
            )}

            <div className="space-y-2">
              {results.map(listing => (
                <button
                  key={`${listing.collection}/${listing.id}`}
                  onClick={() => selectListing(listing)}
                  className="w-full text-left bg-white rounded-2xl border-2 p-4 flex items-center gap-3 hover:border-brand/40 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Store className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{listing.title}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {listing.address || 'Adresse non renseignée'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Choisir une autre fiche
            </button>

            <div className="bg-white rounded-3xl border-2 p-6 space-y-5">
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight">{selected.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{selected.address || 'Adresse non renseignée'}</p>
              </div>

              {isAlreadyMine ? (
                <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                  <p className="font-black text-green-700">Cette fiche est déjà rattachée à votre compte.</p>
                  <Button onClick={() => router.push('/account')} className="mt-3 rounded-xl">Voir mes fiches</Button>
                </div>
              ) : isOwnedByAnother ? (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                  <p className="font-black text-red-700">Cette fiche est déjà revendiquée.</p>
                  <p className="text-xs text-red-700/80 mt-1">Contactez Label Moto si vous pensez qu’il s’agit d’une erreur.</p>
                </div>
              ) : (
                <>
                  {domainMatch ? (
                    <div className="rounded-2xl bg-green-50 border border-green-200 p-4 flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-green-800">Correspondance e-mail confirmée</p>
                        <p className="text-xs text-green-700 mt-1">
                          Le domaine <strong>{emailDomain}</strong> correspond au site de l’établissement ({websiteDomain}).
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4 flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-orange-800">Vérification supplémentaire nécessaire</p>
                          <p className="text-xs text-orange-700 mt-1">
                            Votre e-mail est bien vérifié, mais nous ne pouvons pas confirmer automatiquement son lien avec cet établissement
                            {websiteDomain ? ` car le domaine ${emailDomain} est différent de ${websiteDomain}.` : ' car aucun domaine de site fiable n’est disponible.'}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label>Votre fonction *</Label>
                          <Input value={roleInBusiness} onChange={event => setRoleInBusiness(event.target.value)} placeholder="Gérant, responsable..." />
                        </div>
                        <div>
                          <Label>Téléphone professionnel *</Label>
                          <Input value={businessPhone} onChange={event => setBusinessPhone(event.target.value)} placeholder="01 23 45 67 89" />
                        </div>
                      </div>

                      <div>
                        <Label>SIRET (recommandé)</Label>
                        <Input value={siret} onChange={event => setSiret(event.target.value)} placeholder="14 chiffres" inputMode="numeric" />
                      </div>

                      <div>
                        <Label>Informations complémentaires</Label>
                        <Textarea
                          value={proofNote}
                          onChange={event => setProofNote(event.target.value)}
                          placeholder="Expliquez brièvement votre lien avec l’établissement si nécessaire."
                          className="min-h-[90px]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl bg-muted/30 p-4 text-xs text-muted-foreground">
                    <strong className="text-foreground">Validation finale Label Moto :</strong> même si la correspondance e-mail est automatique, la fiche ne sera jamais attribuée sans validation administrateur.
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-black uppercase text-xs tracking-widest h-12"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><Send className="h-4 w-4 mr-2" /> Envoyer ma demande de revendication</>
                    )}
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

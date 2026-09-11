'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  MailCheck,
  Store,
  User,
  X,
} from 'lucide-react';
import { encodeGeohash } from '@/lib/geohash';


async function writeHistoryBestEffort(firestore: any, payload: Record<string, any>) {
  try {
    await addDoc(collection(firestore, 'listing_history'), payload);
  } catch (error) {
    console.warn('[LabelMoto] Action validée, historique non enregistré :', error);
  }
}

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const FINAL_FIELDS = [
  'title',
  'address',
  'phoneNumber',
  'email',
  'website',
  'category',
  'info',
  'instagramUrl',
  'facebookUrl',
  ...DAYS,
];

const FIELD_LABELS: Record<string, string> = {
  title: 'Nom',
  address: 'Adresse',
  phoneNumber: 'Téléphone',
  email: 'E-mail public',
  website: 'Site web',
  category: 'Catégorie',
  info: 'Description',
  googleMapsUrl: 'Google Maps',
  instagramUrl: 'Instagram',
  facebookUrl: 'Facebook',
  lundi: 'Lundi',
  mardi: 'Mardi',
  mercredi: 'Mercredi',
  jeudi: 'Jeudi',
  vendredi: 'Vendredi',
  samedi: 'Samedi',
  dimanche: 'Dimanche',
};

interface ModRequest {
  id: string;
  requestType?: 'claim' | 'owner_update';
  targetCollection: string;
  targetId: string;
  targetTitle: string;
  targetAddress?: string;
  targetWebsite?: string;
  targetPhone?: string;
  requestedByUid: string;
  requestedByEmail: string;
  requestedByName: string;
  changes?: Record<string, { old: string; new: string }>;
  currentValues?: Record<string, string>;
  newValues?: Record<string, string>;
  verification?: {
    emailVerified?: boolean;
    emailDomain?: string;
    websiteDomain?: string;
    domainMatch?: boolean;
    method?: string;
    roleInBusiness?: string;
    siret?: string;
    businessPhone?: string;
    proofNote?: string;
  };
  createdAt: any;
}

function timestampMs(value: any) {
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  return 0;
}

export default function ModificationRequests() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ModRequest[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!firestore) return;
    setIsLoading(true);
    try {
      const snap = await getDocs(
        query(collection(firestore, 'modification_requests'), where('status', '==', 'pending'))
      );
      const reqs = snap.docs
        .map(item => ({ id: item.id, ...item.data() } as ModRequest))
        .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));

      const nextDrafts: Record<string, Record<string, string>> = {};
      for (const req of reqs) {
        if (req.requestType === 'owner_update') {
          nextDrafts[req.id] = {
            ...(req.currentValues || {}),
            ...(req.newValues || {}),
            googleMapsUrl: req.currentValues?.googleMapsUrl || '',
          };
        }
      }

      setRequests(reqs);
      setDrafts(nextDrafts);
    } catch (error: any) {
      toast({ title: 'Erreur chargement', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const setDraftField = (requestId: string, field: string, value: string) => {
    setDrafts(previous => ({
      ...previous,
      [requestId]: {
        ...(previous[requestId] || {}),
        [field]: value,
      },
    }));
  };

  const approveClaim = async (req: ModRequest) => {
    if (!firestore || !req.requestedByUid) return;

    const listingRef = doc(firestore, req.targetCollection, req.targetId);
    const listingSnap = await getDoc(listingRef);
    if (!listingSnap.exists()) throw new Error('La fiche cible n’existe plus.');

    const listing = listingSnap.data();
    if (listing.ownerUid && listing.ownerUid !== req.requestedByUid) {
      throw new Error('Cette fiche est déjà attribuée à un autre compte.');
    }

    const batch = writeBatch(firestore);
    const now = serverTimestamp();

    batch.update(listingRef, {
      isClaimed: true,
      ownerUid: req.requestedByUid,
      claimStatus: 'approved',
      claimedAt: now,
      claimedByEmail: req.requestedByEmail || '',
    });

    batch.set(
      doc(firestore, 'users', req.requestedByUid),
      {
        role: 'pro',
        onboardingComplete: true,
        updatedAt: now,
      },
      { merge: true }
    );

    batch.set(
      doc(firestore, 'professionalProfiles', req.requestedByUid),
      {
        id: req.requestedByUid,
        email: req.requestedByEmail || '',
        companyName: req.targetTitle || '',
        updatedAt: now,
      },
      { merge: true }
    );

    batch.update(doc(firestore, 'modification_requests', req.id), {
      status: 'approved',
      reviewedBy: user?.uid || '',
      reviewedAt: now,
      updatedAt: now,
    });

    const historyEntry = {
      listingKey: `${req.targetCollection}/${req.targetId}`,
      targetCollection: req.targetCollection,
      targetId: req.targetId,
      targetTitle: req.targetTitle,
      eventType: 'claim_approved',
      summary: `Revendication validée pour ${req.requestedByEmail || req.requestedByUid}`,
      actorType: 'admin',
      actorUid: user?.uid || '',
      requestedByUid: req.requestedByUid,
      requestId: req.id,
      createdAt: now,
    };

    await batch.commit();
    await writeHistoryBestEffort(firestore, historyEntry);
  };

  const approveOwnerUpdate = async (req: ModRequest) => {
    if (!firestore) return;

    const listingRef = doc(firestore, req.targetCollection, req.targetId);
    const listingSnap = await getDoc(listingRef);
    if (!listingSnap.exists()) throw new Error('La fiche cible n’existe plus.');

    const current = listingSnap.data();
    if (current.ownerUid !== req.requestedByUid) {
      throw new Error('Le demandeur n’est plus propriétaire de cette fiche.');
    }

    const draft = drafts[req.id] || {};
    const updates: Record<string, any> = {};
    const finalChanges: Record<string, { old: string; new: string }> = {};

    for (const field of FINAL_FIELDS) {
      const oldValue = DAYS.includes(field)
        ? String(current.horaires?.[field] ?? current[field] ?? '')
        : String(current[field] ?? '');
      const newValue = String(draft[field] ?? oldValue);

      updates[field] = newValue;
      if (oldValue !== newValue) finalChanges[field] = { old: oldValue, new: newValue };
    }

    const currentMaps = String(current.googleMapsUrl || '');
    const finalMaps = String(draft.googleMapsUrl ?? currentMaps);
    updates.googleMapsUrl = finalMaps;
    if (currentMaps !== finalMaps) {
      finalChanges.googleMapsUrl = { old: currentMaps, new: finalMaps };
    }

    updates.horaires = DAYS.reduce<Record<string, string>>((acc, day) => {
      acc[day] = String(draft[day] ?? current.horaires?.[day] ?? current[day] ?? '');
      return acc;
    }, {});

    const locationChanged =
      String(current.address || '') !== String(updates.address || '') ||
      currentMaps !== finalMaps;

    let latitude = Number(current.latitude);
    let longitude = Number(current.longitude);

    if (locationChanged) {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: updates.address,
          googleMapsUrl: finalMaps,
        }),
      });
      const geo = await response.json();

      if (!response.ok || !geo.success || !Number.isFinite(Number(geo.lat)) || !Number.isFinite(Number(geo.lng))) {
        throw new Error('Géocodage impossible. Corrigez l’adresse ou ajoutez un lien Google Maps valide avant publication.');
      }

      latitude = Number(geo.lat);
      longitude = Number(geo.lng);
      updates.latitude = latitude;
      updates.longitude = longitude;
      updates.geohash = encodeGeohash(latitude, longitude, 9);
    }

    // Keep a plain-data snapshot for audit/history. Firestore sentinel values such as
    // serverTimestamp() must not be persisted inside the nested publishedData map.
    const publishedSnapshot = { ...updates };

    const batch = writeBatch(firestore);
    const now = serverTimestamp();
    updates.updatedAt = now;

    batch.update(listingRef, updates);

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      batch.set(
        doc(firestore, 'cache', `map-live-${req.targetCollection}-${req.targetId}`),
        {
          t: updates.title || current.title || req.targetTitle,
          addr: updates.address || current.address || '',
          c: updates.category || current.category || '',
          lat: latitude,
          lng: longitude,
          updatedAt: now,
        },
        { merge: true }
      );
    }

    batch.update(doc(firestore, 'modification_requests', req.id), {
      status: 'approved',
      adminDraft: draft,
      publishedData: publishedSnapshot,
      reviewedBy: user?.uid || '',
      reviewedAt: now,
      updatedAt: now,
    });

    const historyEntry = {
      listingKey: `${req.targetCollection}/${req.targetId}`,
      targetCollection: req.targetCollection,
      targetId: req.targetId,
      targetTitle: updates.title || req.targetTitle,
      eventType: 'owner_update_published',
      summary: `Modifications du professionnel vérifiées et publiées par Label Moto`,
      changes: finalChanges,
      actorType: 'admin',
      actorUid: user?.uid || '',
      requestedByUid: req.requestedByUid,
      requestId: req.id,
      createdAt: now,
    };

    await batch.commit();
    await writeHistoryBestEffort(firestore, historyEntry);
  };

  const approveLegacy = async (req: ModRequest) => {
    if (!firestore) return;
    const updates: Record<string, any> = { isClaimed: true };
    Object.entries(req.changes || {}).forEach(([field, change]) => {
      updates[field] = change.new;
    });
    if (req.requestedByUid) {
      updates.ownerUid = req.requestedByUid;
      updates.claimStatus = 'approved';
      updates.claimedAt = serverTimestamp();
    }

    const batch = writeBatch(firestore);
    const now = serverTimestamp();
    batch.update(doc(firestore, req.targetCollection, req.targetId), updates);
    batch.update(doc(firestore, 'modification_requests', req.id), {
      status: 'approved',
      reviewedBy: user?.uid || '',
      reviewedAt: now,
    });
    const historyEntry = {
      listingKey: `${req.targetCollection}/${req.targetId}`,
      targetCollection: req.targetCollection,
      targetId: req.targetId,
      targetTitle: req.targetTitle,
      eventType: 'legacy_request_approved',
      summary: 'Ancienne demande de revendication/modification validée',
      changes: req.changes || {},
      actorType: 'admin',
      actorUid: user?.uid || '',
      requestId: req.id,
      createdAt: now,
    };
    await batch.commit();
    await writeHistoryBestEffort(firestore, historyEntry);
  };

  const handleApprove = async (req: ModRequest) => {
    if (!firestore) return;
    setProcessing(req.id);
    try {
      if (req.requestType === 'claim') await approveClaim(req);
      else if (req.requestType === 'owner_update') await approveOwnerUpdate(req);
      else await approveLegacy(req);

      setRequests(previous => previous.filter(item => item.id !== req.id));
      toast({
        title: req.requestType === 'claim' ? 'Revendication validée' : 'Modifications publiées',
        description: req.targetTitle,
      });
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (req: ModRequest) => {
    if (!firestore) return;
    setProcessing(req.id);
    try {
      const batch = writeBatch(firestore);
      const now = serverTimestamp();
      batch.update(doc(firestore, 'modification_requests', req.id), {
        status: 'rejected',
        reviewedBy: user?.uid || '',
        reviewedAt: now,
        updatedAt: now,
      });
      const historyEntry = {
        listingKey: `${req.targetCollection}/${req.targetId}`,
        targetCollection: req.targetCollection,
        targetId: req.targetId,
        targetTitle: req.targetTitle,
        eventType: req.requestType === 'claim' ? 'claim_rejected' : 'owner_update_rejected',
        summary: req.requestType === 'claim' ? 'Demande de revendication refusée' : 'Demande de modification refusée',
        actorType: 'admin',
        actorUid: user?.uid || '',
        requestedByUid: req.requestedByUid || '',
        requestId: req.id,
        createdAt: now,
      };
      await batch.commit();
      await writeHistoryBestEffort(firestore, historyEntry);
      setRequests(previous => previous.filter(item => item.id !== req.id));
      toast({ title: 'Demande refusée' });
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-20 bg-background rounded-[2.5rem] border-2 border-dashed">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4 opacity-20" />
        <h2 className="text-xl font-black uppercase text-muted-foreground">Aucune demande en attente</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {requests.map(req => {
        const isClaim = req.requestType === 'claim';
        const isOwnerUpdate = req.requestType === 'owner_update';
        const verification = req.verification || {};
        const draft = drafts[req.id] || {};

        return (
          <div key={req.id} className="bg-background rounded-3xl border-2 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Store className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-sm truncate uppercase tracking-tight">{req.targetTitle}</p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <User className="h-3 w-3" /> {req.requestedByName || req.requestedByEmail}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-2 py-1 rounded-full shrink-0">
                {isClaim ? 'Revendication' : isOwnerUpdate ? 'Modification propriétaire' : 'Ancienne demande'}
              </span>
            </div>

            {isClaim ? (
              <div className="space-y-4">
                <div className={`rounded-2xl p-4 border ${verification.domainMatch ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex gap-3">
                    {verification.domainMatch ? <MailCheck className="h-5 w-5 text-green-600 shrink-0" /> : <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />}
                    <div className="text-xs">
                      <p className="font-black mb-1">{verification.domainMatch ? 'Domaine e-mail correspondant' : 'Vérification manuelle nécessaire'}</p>
                      <p>E-mail : <strong>{req.requestedByEmail}</strong></p>
                      <p>Domaine e-mail : {verification.emailDomain || '—'}</p>
                      <p>Domaine du site : {verification.websiteDomain || '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-muted/30 p-4 text-xs space-y-1">
                  <p><strong>Adresse de la fiche :</strong> {req.targetAddress || '—'}</p>
                  <p><strong>Site de la fiche :</strong> {req.targetWebsite || '—'}</p>
                  <p><strong>Téléphone de la fiche :</strong> {req.targetPhone || '—'}</p>
                </div>

                {!verification.domainMatch && (
                  <div className="grid md:grid-cols-2 gap-3 rounded-2xl bg-muted/30 p-4 text-sm">
                    <div><span className="text-[9px] font-black uppercase text-muted-foreground">Fonction</span><p className="font-bold">{verification.roleInBusiness || '—'}</p></div>
                    <div><span className="text-[9px] font-black uppercase text-muted-foreground">Téléphone pro</span><p className="font-bold">{verification.businessPhone || '—'}</p></div>
                    <div><span className="text-[9px] font-black uppercase text-muted-foreground">SIRET</span><p className="font-bold">{verification.siret || 'Non renseigné'}</p></div>
                    <div><span className="text-[9px] font-black uppercase text-muted-foreground">Complément</span><p className="font-bold">{verification.proofNote || '—'}</p></div>
                  </div>
                )}
              </div>
            ) : isOwnerUpdate ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-xs text-blue-800">
                  <strong>Version finale Label Moto :</strong> vous pouvez corriger ou compléter les données avant publication. Le lien Google Maps reste réservé à l’admin.
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {FINAL_FIELDS.map(field => (
                    <div key={field} className={field === 'info' || field === 'address' ? 'md:col-span-2' : ''}>
                      <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">
                        {FIELD_LABELS[field] || field}
                        {req.changes?.[field] ? ' · modifié par le pro' : ''}
                      </Label>
                      {field === 'info' || field === 'address' ? (
                        <Textarea
                          value={draft[field] || ''}
                          onChange={event => setDraftField(req.id, field, event.target.value)}
                          className="font-bold rounded-xl border-2"
                        />
                      ) : (
                        <Input
                          value={draft[field] || ''}
                          onChange={event => setDraftField(req.id, field, event.target.value)}
                          className="font-bold rounded-xl border-2"
                        />
                      )}
                      {req.changes?.[field] && (
                        <p className="text-[9px] mt-1 text-muted-foreground">
                          Avant : {req.changes[field].old || '(vide)'} → Pro : {req.changes[field].new || '(vide)'}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Google Maps · admin uniquement</Label>
                    <Input
                      value={draft.googleMapsUrl || ''}
                      onChange={event => setDraftField(req.id, 'googleMapsUrl', event.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="font-bold rounded-xl border-2"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
                {Object.entries(req.changes || {}).map(([field, change]) => (
                  <p key={field} className="text-xs"><strong>{FIELD_LABELS[field] || field} :</strong> {change.old || '(vide)'} → {change.new || '(vide)'}</p>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-5">
              <Button
                onClick={() => handleReject(req)}
                disabled={processing === req.id}
                variant="outline"
                className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest h-10"
              >
                {processing === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="h-4 w-4 mr-1" /> Refuser</>}
              </Button>
              <Button
                onClick={() => handleApprove(req)}
                disabled={processing === req.id}
                className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest h-10 bg-green-600 hover:bg-green-700"
              >
                {processing === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="h-4 w-4 mr-1" /> {isClaim ? 'Valider la revendication' : 'Valider & publier'}</>}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

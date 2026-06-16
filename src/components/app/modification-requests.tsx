'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, X, User, Store, ArrowRight, Clock } from 'lucide-react';

const FIELD_LABELS: Record<string, string> = {
  title: 'Nom', address: 'Adresse', phoneNumber: 'Téléphone', email: 'Email',
  website: 'Site web', category: 'Catégorie', info: 'Description',
  googleMapsUrl: 'Google Maps', instagramUrl: 'Instagram', facebookUrl: 'Facebook',
  lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi', jeudi: 'Jeudi',
  vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche',
};

interface ModRequest {
  id: string;
  targetCollection: string;
  targetId: string;
  targetTitle: string;
  requestedByEmail: string;
  requestedByName: string;
  changes: Record<string, { old: string; new: string }>;
  createdAt: any;
}

export default function ModificationRequests() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ModRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!firestore) return;
    setIsLoading(true);
    try {
      const snap = await getDocs(query(collection(firestore, 'modification_requests'), where('status', '==', 'pending')));
      const reqs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ModRequest));
      reqs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRequests(reqs);
    } catch (e: any) {
      toast({ title: 'Erreur chargement', description: e.message, variant: 'destructive' });
    }
    setIsLoading(false);
  }, [firestore, toast]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (req: ModRequest) => {
    if (!firestore) return;
    setProcessing(req.id);
    try {
      // Appliquer les nouvelles valeurs à la fiche publique
      const updates: any = { isClaimed: true };
      Object.entries(req.changes).forEach(([field, { new: newVal }]) => {
        updates[field] = newVal;
      });
      await updateDoc(doc(firestore, req.targetCollection, req.targetId), updates);

      // Marquer la demande comme approuvée
      await updateDoc(doc(firestore, 'modification_requests', req.id), {
        status: 'approved',
        reviewedBy: user?.uid || '',
        reviewedAt: serverTimestamp(),
      });

      setRequests(prev => prev.filter(r => r.id !== req.id));
      toast({ title: 'Demande validée', description: `${req.targetTitle} mise à jour` });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
    setProcessing(null);
  };

  const handleReject = async (req: ModRequest) => {
    if (!firestore) return;
    setProcessing(req.id);
    try {
      await updateDoc(doc(firestore, 'modification_requests', req.id), {
        status: 'rejected',
        reviewedBy: user?.uid || '',
        reviewedAt: serverTimestamp(),
      });
      setRequests(prev => prev.filter(r => r.id !== req.id));
      toast({ title: 'Demande rejetée' });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
    setProcessing(null);
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
    <div className="max-w-3xl mx-auto space-y-4">
      {requests.map(req => (
        <div key={req.id} className="bg-background rounded-3xl border-2 p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0"><Store className="h-5 w-5 text-muted-foreground" /></div>
              <div className="min-w-0">
                <p className="font-black text-sm truncate uppercase tracking-tight">{req.targetTitle}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><User className="h-3 w-3" /> {req.requestedByName || req.requestedByEmail}</p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-2 py-1 rounded-full shrink-0">En attente</span>
          </div>

          <div className="bg-muted/30 rounded-2xl p-4 mb-4 space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Modifications proposées ({Object.keys(req.changes).length})</p>
            {Object.entries(req.changes).map(([field, { old, new: newVal }]) => (
              <div key={field} className="text-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{FIELD_LABELS[field] || field}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="line-through text-muted-foreground/70 bg-red-50 px-2 py-0.5 rounded text-xs">{old || '(vide)'}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">{newVal || '(vide)'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleReject(req)} disabled={processing === req.id} variant="outline" className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest h-10">
              {processing === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="h-4 w-4 mr-1" /> Rejeter</>}
            </Button>
            <Button onClick={() => handleApprove(req)} disabled={processing === req.id} className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest h-10 bg-green-600 hover:bg-green-700">
              {processing === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="h-4 w-4 mr-1" /> Valider & publier</>}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

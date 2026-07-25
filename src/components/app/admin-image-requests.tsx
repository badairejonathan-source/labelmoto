'use client';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/client';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, deleteObject, copyObject } from 'firebase/storage';
import { CheckCircle, X, ImageIcon, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase/client';

interface ImageRequest {
  id: string;
  userId: string;
  userEmail: string;
  concessionSlug: string;
  concessionTitle: string;
  imageUrl: string;
  storagePath: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export default function AdminImageRequests() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ImageRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const load = async () => {
    if (!firestore) return;
    setLoading(true);
    const snap = await getDocs(
      query(collection(firestore, 'image_requests'), where('status', '==', filter), orderBy('createdAt', 'desc'))
    );
    setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as ImageRequest)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [firestore, filter]);

  const approve = async (req: ImageRequest) => {
    if (!firestore) return;
    setProcessing(req.id);
    try {
      // Mettre à jour le document image_request
      await updateDoc(doc(firestore, 'image_requests', req.id), {
        status: 'approved',
        approvedAt: serverTimestamp(),
      });

      // Mettre à jour la fiche dans toutes les collections
      const cols = ['concessions', 'associations', 'relais', 'creators'];
      for (const col of cols) {
        const snap = await getDocs(query(collection(firestore, col), where('slug', '==', req.concessionSlug)));
        if (!snap.empty) {
          await updateDoc(snap.docs[0].ref, { imageUrl: req.imageUrl });
          break;
        }
      }

      setRequests(prev => prev.filter(r => r.id !== req.id));
      toast({ title: '✅ Image approuvée', description: `${req.concessionTitle}` });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
    setProcessing(null);
  };

  const reject = async (req: ImageRequest) => {
    if (!firestore) return;
    setProcessing(req.id);
    try {
      // Supprimer du Storage
      const storage = getStorage();
      try {
        await deleteObject(ref(storage, req.storagePath));
      } catch {}

      // Mettre à jour le statut
      await updateDoc(doc(firestore, 'image_requests', req.id), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
      });

      setRequests(prev => prev.filter(r => r.id !== req.id));
      toast({ title: '🗑️ Image refusée', description: `${req.concessionTitle}` });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
    setProcessing(null);
  };

  const pending = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex gap-2 items-center">
        {(['pending', 'approved', 'rejected'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              filter === s ? 'bg-brand text-white border-brand' : 'bg-white text-muted-foreground border-border'
            }`}>
            {s === 'pending' ? '⏳ En attente' : s === 'approved' ? '✅ Approuvées' : '❌ Refusées'}
          </button>
        ))}
        <button onClick={load} className="ml-auto p-2 rounded-full hover:bg-muted text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border text-center text-muted-foreground">
          <ImageIcon className="h-10 w-10 mx-auto mb-4 opacity-20" />
          <p className="font-black uppercase text-sm">Aucune demande {filter === 'pending' ? 'en attente' : filter === 'approved' ? 'approuvée' : 'refusée'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {/* Image */}
              <div className="relative h-48 bg-muted">
                <img src={req.imageUrl} alt={req.concessionTitle} className="w-full h-full object-cover" />
                {filter === 'pending' && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                    En attente
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">{req.concessionTitle || 'Fiche inconnue'}</p>
                  <p className="text-xs text-muted-foreground">{req.userEmail}</p>
                </div>

                {req.concessionSlug && (
                  <a href={`/concessions/${req.concessionSlug}`} target="_blank"
                    className="flex items-center gap-1 text-[10px] text-brand font-black uppercase tracking-widest hover:underline">
                    <ExternalLink className="h-3 w-3" /> Voir la fiche
                  </a>
                )}

                {filter === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => approve(req)}
                      disabled={processing === req.id}
                      className="flex-1 rounded-xl h-9 font-black uppercase text-[10px] tracking-widest bg-green-600 hover:bg-green-700"
                    >
                      {processing === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><CheckCircle className="h-3 w-3 mr-1" /> Approuver</>}
                    </Button>
                    <Button
                      onClick={() => reject(req)}
                      disabled={processing === req.id}
                      variant="outline"
                      className="flex-1 rounded-xl h-9 font-black uppercase text-[10px] tracking-widest border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-3 w-3 mr-1" /> Refuser
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/client';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
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
  const [previewRequest, setPreviewRequest] = useState<ImageRequest | null>(null);

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

  useEffect(() => {
    if (!previewRequest) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        setPreviewRequest(null);
      }
    };

    document.body.style.overflow =
      'hidden';

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [previewRequest]);

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
              <button
                type="button"
                onClick={() =>
                  setPreviewRequest(req)
                }
                className="group relative flex w-full cursor-zoom-in items-center justify-center overflow-hidden bg-muted/40 p-2"
                style={{
                  height: '18rem',
                }}
                aria-label={`Agrandir l'image de ${req.concessionTitle || 'la fiche'}`}
              >
                <img
                  src={req.imageUrl}
                  alt={req.concessionTitle}
                  className="h-full w-full !object-contain"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/[0.04]" />

                <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  Agrandir
                </div>

                {filter === 'pending' && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                    En attente
                  </div>
                )}
              </button>

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

      {previewRequest && (
        <div
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm md:p-8"
          onClick={() =>
            setPreviewRequest(null)
          }
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu agrandi de l'image"
        >
          <button
            type="button"
            onClick={() =>
              setPreviewRequest(null)
            }
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-xl transition hover:bg-white hover:text-black md:right-7 md:top-7"
            aria-label="Fermer l'aperçu"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="flex max-h-full max-w-full flex-col items-center justify-center gap-3"
            onClick={event =>
              event.stopPropagation()
            }
          >
            <img
              src={previewRequest.imageUrl}
              alt={previewRequest.concessionTitle}
              className="!object-contain shadow-2xl"
              style={{
                display: 'block',
                width: 'auto',
                height: 'auto',
                maxWidth: 'min(92vw, 1100px)',
                maxHeight: '68vh',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />

            <div className="max-w-[90vw] text-center text-white">
              <p className="text-xs font-black uppercase tracking-widest md:text-sm">
                {previewRequest.concessionTitle || 'Fiche inconnue'}
              </p>

              <p className="mt-1 text-[10px] text-white/60">
                Échap ou clic en dehors de l’image pour fermer
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

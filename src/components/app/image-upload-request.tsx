'use client';
import { useState, useRef } from 'react';
import { useFirebase } from '@/firebase/client';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getStorageInstance } from '@/firebase/config-client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Upload, X, ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadRequestProps {
  concessionSlug?: string;
  concessionTitle?: string;
  onSuccess?: (imageUrl: string) => void;
}

// Compression image côté client via Canvas
async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob!), 'image/webp', quality);
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUploadRequest({ concessionSlug, concessionTitle, onSuccess }: ImageUploadRequestProps) {
  const { firestore, user } = useFirebase();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (f: File) => {
    if (!f.type.startsWith('image/')) { setError('Fichier non reconnu — choisissez une image.'); return; }
    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleUpload = async () => {
    if (!file || !user || !firestore) return;
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Compression automatique
      const compressed = await compressImage(file);
      const storage = getStorageInstance();
      if (!storage) throw new Error('Firebase Storage non disponible');
      const fileName = `cover_${Date.now()}.webp`;
      const storageRef = ref(storage, `pending_images/${user.uid}/${fileName}`);

      // Upload avec progression
      const task = uploadBytesResumable(storageRef, compressed, { contentType: 'image/webp' });
      await new Promise<void>((resolve, reject) => {
        task.on('state_changed',
          (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          () => resolve()
        );
      });

      const downloadUrl = await getDownloadURL(storageRef);

      // Créer la demande dans Firestore
      await addDoc(collection(firestore, 'image_requests'), {
        userId: user.uid,
        userEmail: user.email || '',
        concessionSlug: concessionSlug || '',
        concessionTitle: concessionTitle || '',
        imageUrl: downloadUrl,
        storagePath: `pending_images/${user.uid}/${fileName}`,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setDone(true);
      onSuccess?.(downloadUrl);
    } catch (e: any) {
      setError('Erreur lors de l\'upload. Réessayez.');
      console.error(e);
    }
    setUploading(false);
  };

  if (done) return (
    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
      <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
      <div>
        <p className="font-black text-sm text-green-700 uppercase tracking-tight">Photo envoyée ✓</p>
        <p className="text-xs text-green-600 mt-0.5">Elle sera visible après validation sous 48h.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all text-center
          ${preview ? 'border-brand/40 bg-brand/5' : 'border-muted-foreground/30 hover:border-brand/40 hover:bg-muted/20'}`}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Aperçu" className="max-h-48 mx-auto rounded-xl object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-30" />
            <p className="font-black text-sm uppercase tracking-widest">Choisir une photo</p>
            <p className="text-xs">JPG, PNG, WEBP — max 5 Mo — compression automatique</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

      {uploading && (
        <div className="space-y-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-brand transition-all rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground font-bold text-center">Upload en cours... {progress}%</p>
        </div>
      )}

      {preview && !uploading && (
        <Button onClick={handleUpload} className="w-full rounded-xl font-black uppercase text-xs tracking-widest h-11">
          <Upload className="h-4 w-4 mr-2" /> Envoyer pour validation
        </Button>
      )}
    </div>
  );
}

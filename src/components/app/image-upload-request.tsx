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
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1600;
const MAX_IMAGE_HEIGHT = 1200;
const TARGET_IMAGE_BYTES = 550 * 1024;

const SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function extensionForType(type: string) {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  return 'jpg';
}

function canvasToWebp(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      resolve,
      'image/webp',
      quality
    );
  });
}

async function optimizeImage(
  file: File
): Promise<{
  blob: Blob;
  contentType: string;
  extension: string;
}> {
  const objectUrl =
    URL.createObjectURL(file);

  try {
    const image =
      await new Promise<HTMLImageElement>(
        (resolve, reject) => {
          const img = new Image();

          img.onload = () => resolve(img);

          img.onerror = () =>
            reject(
              new Error('Image illisible')
            );

          img.src = objectUrl;
        }
      );

    const naturalWidth =
      Math.max(
        image.naturalWidth,
        1
      );

    const naturalHeight =
      Math.max(
        image.naturalHeight,
        1
      );

    const scale = Math.min(
      1,
      MAX_IMAGE_WIDTH / naturalWidth,
      MAX_IMAGE_HEIGHT / naturalHeight
    );

    const width = Math.max(
      1,
      Math.round(
        naturalWidth * scale
      )
    );

    const height = Math.max(
      1,
      Math.round(
        naturalHeight * scale
      )
    );

    const canvas =
      document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const ctx =
      canvas.getContext('2d');

    if (!ctx) {
      throw new Error(
        'Canvas indisponible'
      );
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality =
      'high';

    ctx.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    const qualities =
      file.type === 'image/png'
        ? [0.90, 0.86, 0.82, 0.78]
        : [0.86, 0.82, 0.78, 0.74];

    let bestWebp: Blob | null = null;

    for (const quality of qualities) {
      const candidate =
        await canvasToWebp(
          canvas,
          quality
        );

      if (!candidate) {
        continue;
      }

      if (
        !bestWebp ||
        candidate.size < bestWebp.size
      ) {
        bestWebp = candidate;
      }

      if (
        candidate.size <=
          TARGET_IMAGE_BYTES
      ) {
        break;
      }
    }

    if (
      bestWebp &&
      bestWebp.size < file.size
    ) {
      return {
        blob: bestWebp,
        contentType: 'image/webp',
        extension: 'webp',
      };
    }

    return {
      blob: file,
      contentType:
        file.type || 'image/jpeg',
      extension:
        extensionForType(
          file.type
        ),
    };
  }
  finally {
    URL.revokeObjectURL(
      objectUrl
    );
  }
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
    if (!SUPPORTED_IMAGE_TYPES.has(f.type)) {
      setError(
        'Format non pris en charge - utilisez JPG, PNG ou WEBP.'
      );
      return;
    }

    if (f.size > MAX_UPLOAD_BYTES) {
      setError(
        'Image trop lourde - 5 Mo maximum.'
      );
      return;
    }

    setError(null);
    setFile(f);

    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }

    const url =
      URL.createObjectURL(f);

    setPreview(url);
  };
  const handleUpload = async () => {
    if (!file || !user || !firestore) return;
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Optimisation automatique avant Firebase Storage.
      const optimized =
        await optimizeImage(file);

      const storage =
        getStorageInstance();

      if (!storage) {
        throw new Error(
          'Firebase Storage non disponible'
        );
      }

      const fileName =
        `cover_${Date.now()}.${optimized.extension}`;

      const storageRef =
        ref(
          storage,
          `pending_images/${user.uid}/${fileName}`
        );

      const task =
        uploadBytesResumable(
          storageRef,
          optimized.blob,
          {
            contentType:
              optimized.contentType,
          }
        );
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
            <img src={preview} alt="Aperçu" className="max-h-48 max-w-full mx-auto rounded-xl object-contain bg-muted/30" />
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
            <p className="text-xs">JPG, PNG, WEBP — max 5 Mo — optimisation automatique</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
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

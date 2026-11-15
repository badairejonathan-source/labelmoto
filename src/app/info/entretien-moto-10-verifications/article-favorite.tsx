'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2 } from 'lucide-react';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const id = 'entretien-moto-10-verifications';
const isPublishedRuntime = process.env.NODE_ENV === 'production';

// Même document de favori et même comportement que article-client.tsx.
export default function ArticleFavoriteButton() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  // Uniquement en mode développement : prévisualiser l'état du bouton,
  // sans toucher au document Firestore utilisé une fois l'article publié.
  const [previewFavorite, setPreviewFavorite] = useState(false);

  const favoriteRef = useMemoFirebase(
    () => isPublishedRuntime && user && firestore
      ? doc(firestore, 'users', user.uid, 'favorites', `articles__${id}`)
      : null,
    [user, firestore],
  );
  const { data: favorite, isLoading } = useDoc(favoriteRef);
  const isFavorite = isPublishedRuntime ? !!favorite : previewFavorite;

  async function toggleFavorite() {
    if (!isPublishedRuntime) {
      const next = !previewFavorite;
      setPreviewFavorite(next);
      toast({
        title: 'Aperçu local',
        description: next
          ? 'Favori simulé sur cette page : aucun enregistrement en ligne.'
          : 'Favori retiré de cet aperçu : aucun enregistrement en ligne.',
      });
      return;
    }
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/info/${id}`)}`);
      return;
    }
    if (!favoriteRef || isUpdating) return;

    setIsUpdating(true);
    try {
      if (isFavorite) {
        await deleteDoc(favoriteRef);
        toast({ title: 'Favori retiré', description: 'Cet article a été retiré de vos favoris.' });
      } else {
        await setDoc(
          favoriteRef,
          { type: 'article', targetCollection: 'articles', targetId: id, addedAt: serverTimestamp() },
          { merge: true },
        );
        toast({ title: 'Ajouté aux favoris', description: 'Vous retrouverez cet article dans votre espace compte.' });
      }
    } catch (error) {
      console.error('Modification du favori article impossible', error);
      toast({ variant: 'destructive', title: 'Favori impossible', description: "L'enregistrement n'a pas pu être effectué." });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isLoading || isUpdating}
      onClick={toggleFavorite}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Retirer cet article des favoris' : 'Ajouter cet article aux favoris'}
      className={cn(
        'lm-article-favorite rounded-full border-2 px-4 font-black uppercase tracking-widest text-[9px] transition-all',
        isFavorite ? 'border-brand bg-brand text-white hover:bg-brand/90 hover:text-white' : 'hover:border-brand hover:text-brand',
      )}
    >
      {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Heart className={cn('mr-2 h-4 w-4', isFavorite && 'fill-current')} />}
      {isFavorite ? 'Dans mes favoris' : 'Ajouter aux favoris'}
    </Button>
  );
}

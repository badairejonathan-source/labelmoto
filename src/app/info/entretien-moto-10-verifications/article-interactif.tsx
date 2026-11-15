'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { articleMarkup } from './article-markup';
import { initializeArticleInteractions } from './article-interactions';
import ArticleFavoriteButton from './article-favorite';

// On conserve tout le HTML de l'article approuvé. Un emplacement React est
// inséré juste sous le H1 pour afficher le même favori que les guides /info.
const articleWithFavorite = articleMarkup.replace(
  '</h1>',
  '</h1><div class="lm-favorite-slot" data-lm-favorite-slot></div>',
);

// Important : garder la même référence pour dangerouslySetInnerHTML.
// Sinon, le rerender déclenché par setFavoriteSlot peut réinjecter le HTML et
// vider l'emplacement du bouton créé ensuite par createPortal.
const stableArticleHtml = { __html: articleWithFavorite };

export default function ArticleInteractif() {
  const root = useRef<HTMLDivElement>(null);
  const [favoriteSlot, setFavoriteSlot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setFavoriteSlot(root.current?.querySelector<HTMLElement>('[data-lm-favorite-slot]') ?? null);
    // Les interactions sont intégrées au bundle Next.js. Le fichier public JS
    // était inaccessible sur Firebase App Hosting (404 en production).
    return root.current ? initializeArticleInteractions(root.current) : undefined;
  }, []);
  return (
    <>
      <div ref={root} className="lm-native-article" dangerouslySetInnerHTML={stableArticleHtml} />
      {favoriteSlot && createPortal(<ArticleFavoriteButton />, favoriteSlot)}
    </>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Crosshair, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationPromptProps {
  onLocate: () => void;
}

export default function LocationPrompt({ onLocate }: LocationPromptProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('label-moto-consent');
    // On affiche cette petite bulle seulement si l'utilisateur n'a pas accepté la localisation globalement
    if (consent !== 'accepted') {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] w-[90%] max-w-[280px] animate-in fade-in zoom-in duration-500">
      <div className="bg-white dark:bg-zinc-900 border-2 border-brand rounded-2xl shadow-2xl p-4 relative ring-4 ring-black/5">
        <button 
          onClick={() => setShow(false)} 
          className="absolute -top-2 -right-2 bg-brand text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-brand/10 p-2 rounded-full">
            <Sparkles className="h-5 w-5 text-brand animate-pulse" />
          </div>
          <p className="text-[11px] font-black uppercase leading-tight">
            Voulez-vous voir les pros <span className="text-brand">autour de vous ?</span>
          </p>
          <p className="text-[9px] text-muted-foreground font-bold">
            Cliquez sur le bouton cible pour centrer la carte sur votre position.
          </p>
          <Button 
            onClick={() => { onLocate(); setShow(false); }} 
            size="sm"
            className="w-full bg-brand hover:bg-brand/90 text-[10px] font-black uppercase tracking-widest rounded-xl h-9"
          >
            <Crosshair className="mr-2 h-3.5 w-3.5" />
            Me localiser maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}

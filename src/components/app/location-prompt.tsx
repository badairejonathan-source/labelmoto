
'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LocationPromptProps {
  onLocate: () => void;
}

export default function LocationPrompt({ onLocate }: LocationPromptProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('label-moto-consent');
    // On affiche cet indicateur seulement si l'utilisateur n'a pas accepté la localisation globalement
    if (consent !== 'accepted') {
      const timer = setTimeout(() => setShow(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="absolute top-2 right-14 md:top-3 md:right-16 z-[1001] animate-in fade-in slide-in-from-right-2 duration-700 pointer-events-none">
      <div className="bg-brand text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 relative border-2 border-white ring-4 ring-black/5">
        <Sparkles className="h-3 w-3 animate-pulse shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Localisez-vous</span>
        <ArrowRight className="h-4 w-4 animate-bounce-x shrink-0" />
        
        {/* Petit triangle pointant vers le bouton de localisation à droite */}
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-brand rotate-45 border-r-2 border-t-2 border-white" />
      </div>
      <style jsx global>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
}

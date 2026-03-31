'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LocationPromptProps {
  onLocate: () => void;
}

export default function LocationPrompt({ onLocate }: LocationPromptProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('label-moto-consent');
    if (consent !== 'accepted') {
      const timer = setTimeout(() => setShow(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="absolute top-2 right-14 md:top-3 md:right-16 z-[1001] animate-in fade-in slide-in-from-right-2 duration-700 pointer-events-none">
      <div className="flex items-center gap-2 relative">
        {/* Design de type étiquette d'aide élégante - Évite la confusion avec un bouton direct */}
        <div className="bg-background/95 backdrop-blur-sm border-2 border-brand text-brand px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 ring-4 ring-black/5 animate-bounce-subtle">
          <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Localisez-vous</span>
          <ArrowRight className="h-4 w-4 animate-pointing-right shrink-0" />
        </div>
        
        {/* Petit triangle pointant vers le bouton de localisation à droite */}
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-brand rotate-45 border-r-2 border-t-2 border-white" />
      </div>
      
      <style jsx global>{`
        @keyframes pointing-right {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          50% { transform: translateX(4px); opacity: 1; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-pointing-right {
          animation: pointing-right 1.2s infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

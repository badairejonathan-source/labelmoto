
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CookieConsent() {
  const { user } = useUser();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('label-moto-consent');
    // On montre le bandeau si le consentement n'a pas encore été donné
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('label-moto-consent', 'accepted');
    setShow(false);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => console.log("Position autorisée"),
        () => console.log("Position refusée")
      );
    }
  };

  const handleDecline = () => {
    localStorage.setItem('label-moto-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[2000] md:left-auto md:max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-background border-2 border-brand rounded-2xl shadow-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2">
          <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-brand/10 p-3 rounded-full shrink-0">
            <MapPin className="h-6 w-6 text-brand" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-tight italic">Position & Services</h3>
            <p className="text-[11px] font-bold text-muted-foreground leading-snug">
              Label Moto utilise votre position pour vous afficher les concessions et ateliers les plus proches. 
              En continuant, vous acceptez notre politique de cookies.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={handleAccept} className="bg-brand hover:bg-brand/90 font-black uppercase text-[10px] tracking-widest h-10 shadow-lg transition-transform hover:scale-[1.02]">
            <ShieldCheck className="mr-2 h-3.5 w-3.5" />
            Accepter & me localiser
          </Button>
          <Button variant="ghost" onClick={handleDecline} className="text-[9px] font-black uppercase tracking-widest h-8 text-muted-foreground hover:text-brand">
            Continuer sans localisation
          </Button>
        </div>
      </div>
    </div>
  );
}

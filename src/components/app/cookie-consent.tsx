'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const { user } = useUser();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('label-moto-consent');
    // On montre la demande si l'utilisateur est connecté et n'a pas encore accepté
    if (user && !consent) {
      setShow(true);
    }
  }, [user]);

  const handleAccept = () => {
    localStorage.setItem('label-moto-consent', 'accepted');
    setShow(false);
    
    // Demande immédiate de la position pour "pré-autoriser" dans le navigateur
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => console.log("Autorisation accordée"),
        () => console.log("Autorisation refusée")
      );
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-[2000] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="p-6 border-2 border-brand shadow-2xl bg-background/95 backdrop-blur-md">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-brand/10 p-2 rounded-full">
            <MapPin className="h-6 w-6 text-brand" />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShow(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="text-lg font-black uppercase tracking-tight mb-2 italic text-foreground">Position & Services</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-medium">
          Pour vous proposer les concessions et ateliers les plus proches de vous en temps réel, Label Moto a besoin d'accéder à votre position. 
          En acceptant, vous optimisez votre expérience de recherche.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={handleAccept} className="bg-brand hover:bg-brand/90 font-black uppercase text-xs tracking-widest py-6 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 text-white">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Accepter et me localiser
          </Button>
          <Button variant="ghost" onClick={() => setShow(false)} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand transition-colors">
            Continuer sans localisation
          </Button>
        </div>
      </Card>
    </div>
  );
}
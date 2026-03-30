
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { MapPin, ShieldCheck, Crosshair, X } from 'lucide-react';

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

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-md border-2 border-brand bg-background/95 backdrop-blur-md shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="bg-brand/10 p-4 rounded-full mb-4 animate-bounce">
            <MapPin className="h-10 w-10 text-brand" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight italic text-foreground">
            Position & Services
          </DialogTitle>
          <DialogDescription className="text-base font-bold text-muted-foreground mt-2">
            Optimisez votre recherche de concessions.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Pour vous proposer les concessions et ateliers les plus proches de vous en temps réel, Label Moto a besoin d'accéder à votre position.
          </p>
          
          <div className="bg-muted/30 p-4 rounded-2xl flex items-center gap-4 border border-dashed border-brand/30">
             <div className="bg-brand text-white p-2 rounded-full shadow-lg shrink-0">
                <Crosshair className="h-5 w-5" />
             </div>
             <p className="text-[11px] font-black uppercase text-left leading-tight text-foreground">
                Utilisez le bouton de localisation sur la carte pour centrer l'affichage sur votre position.
             </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button variant="ghost" onClick={() => setShow(false)} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand transition-colors">
            Continuer sans localisation
          </Button>
          <Button onClick={handleAccept} className="bg-brand hover:bg-brand/90 font-black uppercase text-xs tracking-widest py-6 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 text-white flex-1">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Accepter et me localiser
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

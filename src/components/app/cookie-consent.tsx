'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck, X } from 'lucide-react';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [loadAnalytics, setLoadAnalytics] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const triggerAnalytics = useCallback(() => {
    setLoadAnalytics(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const consent = localStorage.getItem('label-moto-consent');
    
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    } else if (consent === 'accepted') {
      const events = ['mousedown', 'touchstart', 'scroll', 'pointermove'];
      
      const onUserInteraction = () => {
        triggerAnalytics();
        events.forEach(event => window.removeEventListener(event, onUserInteraction));
      };

      events.forEach(event => window.addEventListener(event, onUserInteraction, { passive: true }));
      
      const backupTimer = setTimeout(triggerAnalytics, 5000);

      return () => {
        events.forEach(event => window.removeEventListener(event, onUserInteraction));
        clearTimeout(backupTimer);
      };
    }
  }, [triggerAnalytics]);

  const handleAccept = () => {
    localStorage.setItem('label-moto-consent', 'accepted');
    setShowBanner(false);
    triggerAnalytics();
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => console.log("Position autorisée"),
        () => console.log("Position refusée")
      );
    }
  };

  const handleDecline = () => {
    localStorage.setItem('label-moto-consent', 'declined');
    setShowBanner(false);
  };

  return (
    <>
      {loadAnalytics && gaId && (
        <GoogleAnalytics gaId={gaId} />
      )}

      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-[2000] md:left-auto md:max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-background border-2 border-brand rounded-2xl shadow-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2">
              <button onClick={() => setShowBanner(false)} className="text-muted-foreground hover:text-foreground p-1" aria-label="Fermer le bandeau de consentement">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-brand/10 p-3 rounded-full shrink-0">
                <MapPin className="h-6 w-6 text-brand" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-tight italic">Position & Services</h3>
                <p className="text-[12px] font-bold text-muted-foreground leading-snug">
                  Label Moto utilise votre position pour vous afficher les concessions et ateliers les plus proches. 
                  En continuant, vous acceptez notre politique de cookies.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={handleAccept} className="bg-brand hover:bg-brand/90 font-black uppercase text-[11px] tracking-widest h-10 shadow-lg transition-transform hover:scale-[1.02]">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Accepter & me localiser
              </Button>
              <Button variant="ghost" onClick={handleDecline} className="text-[10px] font-black uppercase tracking-widest h-8 text-muted-foreground hover:text-brand">
                Continuer sans localisation
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
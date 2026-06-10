'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Shield } from 'lucide-react';
import LabelMotoLogo from './logo';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (pathname === '/map') return null;

  const proRegisterLink = "/login?callbackUrl=/pro/register";

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1 space-y-4">
            <div className="w-48 sm:w-56 shrink-0">
                <LabelMotoLogo noBubble />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
              Label Moto est l'annuaire national indépendant des motards en France. Nous référençons concessions, ateliers et relais pour simplifier votre passion.
            </p>
            <div className="flex items-center gap-2 text-brand font-black text-[9px] uppercase tracking-widest">
              <Shield className="h-3 w-3" />
              <span>Plateforme de confiance</span>
            </div>
          </div>

          <div>
            <h3 className="font-black text-foreground mb-4 uppercase text-[10px] tracking-[0.2em]">À propos</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-brand transition-colors font-bold uppercase text-[9px] tracking-widest">Notre mission</Link></li>
              <li><Link href="/selection" className="text-muted-foreground hover:text-brand transition-colors font-bold uppercase text-[9px] tracking-widest">La Méthode</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-brand transition-colors font-bold uppercase text-[9px] tracking-widest">Contactez-nous</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-black text-foreground mb-4 uppercase text-[10px] tracking-[0.2em]">Ressources</h3>
            <ul className="space-y-3">
              <li><Link href="/info" className="text-muted-foreground hover:text-brand transition-colors font-bold uppercase text-[9px] tracking-widest">Guides & Conseils</Link></li>
              <li><Link href="/map" className="text-muted-foreground hover:text-brand transition-colors font-bold uppercase text-[9px] tracking-widest">Trouver un pro</Link></li>
              <li><Link href="/entretien" className="text-muted-foreground hover:text-brand transition-colors font-bold uppercase text-[9px] tracking-widest">Catalogues Entretien</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-black text-foreground mb-4 uppercase text-[10px] tracking-[0.2em]">Espace Pro</h3>
            <ul className="space-y-3">
              <li><Link href={proRegisterLink} className="text-muted-foreground hover:text-brand transition-colors font-bold uppercase text-[9px] tracking-widest">Inscrire mon établissement</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-brand transition-colors font-bold uppercase text-[9px] tracking-widest">Partenariats</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              {currentYear && (
                <p className="text-[11px] sm:text-xs text-muted-foreground font-bold whitespace-nowrap">
                  &copy; {currentYear} Label Moto. Plateforme nationale indépendante.
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="sr-only">Réseaux sociaux</span>
              <Link 
                href="https://www.instagram.com/labelmoto.fr/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez Label Moto sur Instagram" 
                className="text-muted-foreground hover:text-brand transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <button disabled aria-label="Facebook (bientôt disponible)" className="text-muted-foreground cursor-not-allowed opacity-30"><Facebook className="h-5 w-5" /></button>
              <button disabled aria-label="Youtube (bientôt disponible)" className="text-muted-foreground cursor-not-allowed opacity-30"><Youtube className="h-5 w-5" /></button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8 text-[11px] sm:text-xs font-bold border-t border-dashed border-border/50 pt-6">
            <Link href="/terms" className="text-muted-foreground hover:text-brand transition-colors">Conditions d'utilisation</Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-brand transition-colors">Confidentialité & Cookies</Link>
            <Link href="/legal" className="text-muted-foreground hover:text-brand transition-colors">Mentions Légales</Link>
            <Link href="/accessibility" className="text-muted-foreground hover:text-brand transition-colors">Accessibilité</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-brand transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

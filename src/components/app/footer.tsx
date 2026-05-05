'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import LabelMotoLogo from './logo';
import { useUser } from '@/firebase';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ADMIN_UID = "A36FqeWBHjQBLKQMaMSiFVBzGV22";

const Footer = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (pathname === '/map') return null;

  const proRegisterLink = (mounted && user) ? "/pro/register" : "/login";
  const isAdmin = mounted && user && user.uid === ADMIN_UID;

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-sm">
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">À propos de Label Moto</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-brand transition-colors font-medium">À propos</Link></li>
              <li><Link href="/selection" className="text-muted-foreground hover:text-brand transition-colors font-medium">Sélection Label Moto</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-brand transition-colors font-medium">Contactez-nous</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">Explorez</h3>
            <ul className="space-y-3">
              <li><Link href="/info" className="text-muted-foreground hover:text-brand transition-colors font-medium">Conseils & Articles</Link></li>
              <li><Link href="/map" className="text-muted-foreground hover:text-brand transition-colors font-medium">Trouver un pro</Link></li>
              <li><Link href="/entretien" className="text-muted-foreground hover:text-brand transition-colors font-medium">Entretien & Révisions</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">Espace Professionnel</h3>
            <ul className="space-y-3">
              <li><Link href={proRegisterLink} className="text-muted-foreground hover:text-brand transition-colors font-medium">Inscrire votre établissement</Link></li>
              {isAdmin && (
                <li><Link href="/admin" className="text-brand hover:opacity-80 font-bold uppercase tracking-widest text-xs">Espace Admin</Link></li>
              )}
              <li><Link href="/contact" className="text-muted-foreground hover:text-brand transition-colors font-medium">Faire de la publicité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-48 sm:w-56 shrink-0">
                <LabelMotoLogo noBubble />
              </div>
              {currentYear && (
                <p className="text-[11px] sm:text-xs text-muted-foreground font-bold whitespace-nowrap">
                  &copy; {currentYear} Label Moto. Tous droits réservés.
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="sr-only">Réseaux sociaux</span>
              <button disabled aria-label="Facebook (bientôt disponible)" className="text-muted-foreground cursor-not-allowed opacity-30"><Facebook className="h-5 w-5" /></button>
              <button disabled aria-label="Twitter (bientôt disponible)" className="text-muted-foreground cursor-not-allowed opacity-30"><Twitter className="h-5 w-5" /></button>
              <Link 
                href="https://www.instagram.com/labelmoto.fr/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Suivez-nous sur Instagram" 
                className="text-muted-foreground hover:text-brand transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
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
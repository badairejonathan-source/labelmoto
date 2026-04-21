'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import LabelMotoLogo from './logo'; // Assure-toi que le fichier s'appelle bien logo.tsx
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

  // On ne masque le footer QUE sur la page de la carte pour laisser la place à l'interface interactive
  if (pathname === '/map') return null;

  // Gestion de l'hydratation pour les liens dépendants de l'auth
  const proRegisterLink = (mounted && user) ? "/pro/register" : "/login";
  const isAdmin = mounted && user && user.uid === ADMIN_UID;

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-sm">
        
        {/* Grille de navigation principale */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-foreground mb-4">À propos de Label Moto</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">À propos</Link></li>
              <li><Link href="/selection" className="text-muted-foreground hover:text-accent transition-colors">Sélection Label Moto</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contactez-nous</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Explorez</h3>
            <ul className="space-y-3">
              <li><Link href="/info" className="text-muted-foreground hover:text-accent transition-colors">Conseils & Articles</Link></li>
              <li><Link href="/map" className="text-muted-foreground hover:text-accent transition-colors">Trouver un pro</Link></li>
              <li><Link href="/entretien" className="text-muted-foreground hover:text-accent transition-colors">Entretien & Révisions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Pour les pros</h3>
            <ul className="space-y-3">
              <li><Link href={proRegisterLink} className="text-muted-foreground hover:text-accent transition-colors">Inscrire votre concession</Link></li>
              {isAdmin && (
                <li><Link href="/admin" className="text-brand hover:opacity-80 font-bold">Espace Admin</Link></li>
              )}
              <li><Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Faire de la publicité</Link></li>
            </ul>
          </div>
        </div>

        {/* Section Logo, Copyright et Réseaux Sociaux */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-48 sm:w-56 shrink-0">
                <LabelMotoLogo />
              </div>
              {currentYear && (
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium whitespace-nowrap">
                  &copy; {currentYear} Label Moto. Tous droits réservés.
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <Facebook className="h-5 w-5 text-muted-foreground cursor-not-allowed opacity-50" />
              <Twitter className="h-5 w-5 text-muted-foreground cursor-not-allowed opacity-50" />
              <Link 
                href="https://www.instagram.com/labelmoto.fr/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Youtube className="h-5 w-5 text-muted-foreground cursor-not-allowed opacity-50" />
            </div>
          </div>

          {/* Liens légaux de bas de page */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8 text-[10px] sm:text-xs font-medium border-t border-dashed border-border/50 pt-6">
            <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">Conditions d'utilisation</Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">Confidentialité & Cookies</Link>
            <Link href="/legal" className="text-muted-foreground hover:text-accent transition-colors">Mentions Légales</Link>
            <Link href="/accessibility" className="text-muted-foreground hover:text-accent transition-colors">Accessibilité</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
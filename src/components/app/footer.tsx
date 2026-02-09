import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import MotoTrustLogo from './logo';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-foreground mb-4">À propos de MotoTrust</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-accent">À propos</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Presse</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Contactez-nous</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Explorez</h3>
            <ul className="space-y-3">
              <li><Link href="/info" className="text-muted-foreground hover:text-accent">Articles & Infos</Link></li>
              <li><Link href="/map" className="text-muted-foreground hover:text-accent">Trouver un pro</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Les marques</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Pour les pros</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Inscrire votre concession</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Espace Pro</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Faire de la publicité</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold text-foreground mb-4">Sites Partenaires</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Le Repaire des Motards</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Moto-Station</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Motoservices</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-28 shrink-0">
                        <Link href="/">
                            <MotoTrustLogo />
                        </Link>
                    </div>
                    <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} MotoTrust. Tous droits réservés.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-accent"><Facebook className="h-5 w-5" /></Link>
                    <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-accent"><Twitter className="h-5 w-5" /></Link>
                    <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-accent"><Instagram className="h-5 w-5" /></Link>
                    <Link href="#" aria-label="Youtube" className="text-muted-foreground hover:text-accent"><Youtube className="h-5 w-5" /></Link>
                </div>
            </div>
             <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-6 text-xs">
                <Link href="/terms" className="text-muted-foreground hover:text-accent">Conditions d'utilisation</Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-accent">Confidentialité et utilisation des cookies</Link>
                <Link href="/legal" className="text-muted-foreground hover:text-accent">Mentions Légales</Link>
                <Link href="#" className="text-muted-foreground hover:text-accent">Politique d'accessibilité</Link>
                <Link href="#" className="text-muted-foreground hover:text-accent">Contactez-nous</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

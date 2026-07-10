'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Wrench, BookOpen, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/map', label: 'Carte', icon: Map },
  { href: '/entretien', label: 'Entretien', icon: Wrench },
  { href: '/info', label: 'Conseils', icon: BookOpen },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[900] md:hidden bg-white border-t border-muted/20 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors active:scale-95',
                active ? 'text-brand' : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'rounded-full p-1.5 transition-colors',
                  active ? 'bg-brand/10' : ''
                )}
              >
                <Icon className={cn('h-5 w-5', active ? 'stroke-[2.5px]' : 'stroke-[1.8px]')} />
              </div>
              <span
                className={cn(
                  'text-[9px] font-black uppercase tracking-widest leading-none',
                  active ? 'text-brand' : 'text-muted-foreground/70'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

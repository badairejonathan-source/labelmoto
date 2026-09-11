'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LabelMotoLogo from '@/components/app/logo';
import UserMenu from '@/components/app/user-menu';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    href: '/map',
    label: 'Carte',
    active: (pathname: string) => pathname === '/map' || pathname.startsWith('/map/'),
  },
  {
    href: '/entretien',
    label: 'Entretien / fiches techniques',
    active: (pathname: string) =>
      pathname === '/entretien' ||
      pathname.startsWith('/entretien/') ||
      pathname.startsWith('/fiches/'),
  },
  {
    href: '/info',
    label: 'Guides & conseils',
    active: (pathname: string) => pathname === '/info' || pathname.startsWith('/info/'),
  },
];

export default function UnifiedSiteHeader() {
  const pathname = usePathname() || '/';

  return (
    <header
      className="relative z-[1600] w-full border-b border-black/[0.06] bg-white/95 backdrop-blur-xl"
    >
      <div className="hidden h-[80px] items-center px-8 lg:flex">
        <div className="flex w-[410px] shrink-0 items-center">
          <Link href="/" aria-label="Accueil LabelMoto" className="inline-flex">
            <LabelMotoLogo
              noBubble
              noLink
              className="w-[150px] border-none bg-transparent px-0 shadow-none"
            />
          </Link>
        </div>

        <nav
          aria-label="Navigation principale"
          className="flex h-full items-center gap-9 text-[14px] font-bold text-foreground"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.active(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-full items-center whitespace-nowrap border-b-[3px] transition-colors hover:text-brand',
                  isActive
                    ? 'border-brand text-brand'
                    : 'border-transparent text-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center">
          <UserMenu />
        </div>
      </div>

      <div className="flex min-h-[82px] items-center justify-between gap-3 px-5 lg:hidden">
        <Link href="/" aria-label="Accueil LabelMoto" className="inline-flex shrink-0">
          <LabelMotoLogo
            noBubble
            noLink
            className="w-[132px] border-none bg-transparent px-0 shadow-none"
          />
        </Link>

        <div className="ml-auto shrink-0">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

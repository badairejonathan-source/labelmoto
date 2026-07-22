'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, ShieldAlert, Settings, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase/client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function UserMenu() {
  const { user, profile, activateAuth } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const pseudo = profile?.displayName || profile?.pseudo || user?.email?.split('@')[0] || '';
  const initial = pseudo?.[0]?.toUpperCase() || '?';
  const isAdmin = profile?.role === 'admin';
  if (!mounted) return null;
  return (
    <DropdownMenu onOpenChange={(open) => open && activateAuth()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("relative h-[73px] w-[73px] md:h-[83px] md:w-[83px] rounded-full p-0 flex items-center justify-center shadow-xl border-2 border-white bg-white hover:bg-white transition-all hover:scale-105 active:scale-95", isAdmin && "ring-2 ring-brand ring-offset-2")}>
          {user ? (
            <Avatar className="h-[57px] w-[57px] md:h-[65px] md:w-[65px] border-2 border-brand">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback className="bg-brand text-white text-xs font-black">{initial}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-[57px] w-[57px] md:h-[65px] md:w-[65px] rounded-full flex items-center justify-center p-1">
              <Image src="/images/icon-moncompte.webp" alt="" width={80} height={80} className="h-full w-full object-contain" loading="lazy" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-brand rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
            <ChevronDown className="h-2.5 w-2.5 text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Guide</DropdownMenuLabel>
        <div className="grid grid-cols-2 gap-2 px-2 pb-2">
          <Link href="/entretien" className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-brand/10 transition-colors group">
            <div className="h-12 w-12 rounded-full bg-white shadow border-2 border-border flex items-center justify-center p-1.5">
              <img src="/images/icon-entretienrevision.webp" alt="Entretien" className="w-full h-full object-contain" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand">Entretien</span>
          </Link>
          <Link href="/info" className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-brand/10 transition-colors group">
            <div className="h-12 w-12 rounded-full bg-white shadow border-2 border-border flex items-center justify-center p-1.5">
              <img src="/images/icon-conseils.webp" alt="Conseils" className="w-full h-full object-contain" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand">Conseils</span>
          </Link>
        </div>
        <DropdownMenuSeparator />
        {user ? (
          <>
            <DropdownMenuLabel className="font-black">{pseudo || user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem onClick={() => router.push('/admin')} className="text-brand font-black cursor-pointer">
                <ShieldAlert className="mr-2 h-4 w-4" /><span>Espace Admin</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => router.push('/account')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /><span>Mon compte</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/pro/register')} className="cursor-pointer">
              <Building2 className="mr-2 h-4 w-4" /><span>Ma fiche pro</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => auth && signOut(auth)} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" /><span>Se déconnecter</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer font-bold">
              Se connecter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/login?callbackUrl=/pro/register')} className="cursor-pointer">
              Inscrire mon établissement
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

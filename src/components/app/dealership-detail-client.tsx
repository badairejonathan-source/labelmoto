'use client';

import React from 'react';
import Header from '@/components/app/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Phone, Globe, Clock, Home, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dealership } from '@/lib/types';

interface DealershipDetailClientProps {
  pro: Dealership;
}

export default function DealershipDetailClient({ pro }: DealershipDetailClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header searchTerm="" onSearchTermChange={() => {}} onSearch={() => {}} />

      <main className="container mx-auto px-4 py-8 pt-24 md:pt-32 max-w-5xl">
        <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8">
          <Link href="/" className="hover:text-brand flex items-center gap-1"><Home className="h-3 w-3" /> ACCUEIL</Link>
          <ChevronRight className="h-2 w-2" /><Link href="/map" className="hover:text-brand">CARTE</Link>
          <ChevronRight className="h-2 w-2" /><span className="text-foreground">{pro.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-muted">
              <Image 
                src={pro.imageUrl || pro.imgUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"} 
                alt={pro.title} 
                fill 
                className="object-cover" 
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-none">{pro.title}</h1>
              <p className="text-xl font-bold text-brand italic">{pro.category || 'Professionnel moto'}</p>
              <div className="flex items-start gap-3 p-6 bg-muted/30 rounded-2xl border-2 border-dashed">
                <MapPin className="h-6 w-6 text-brand shrink-0" />
                <div>
                  <p className="font-black text-lg uppercase tracking-tight">{pro.address}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-brand font-black uppercase text-[10px]"><a href={`https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`} target="_blank" rel="noopener noreferrer">Calculer l'itinéraire</a></Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pro.phoneNumber && (
                <Button asChild className="h-16 rounded-2xl bg-white border-2 border-muted hover:border-brand shadow-lg text-foreground transition-all">
                  <a href={`tel:${pro.phoneNumber}`} className="flex items-center gap-4 px-6">
                    <Phone className="h-6 w-6 text-brand" />
                    <div className="text-left"><p className="text-[9px] font-black uppercase tracking-widest opacity-50">Appeler</p><p className="font-black">{pro.phoneNumber}</p></div>
                  </a>
                </Button>
              )}
              {pro.website && (
                <Button asChild className="h-16 rounded-2xl bg-white border-2 border-muted hover:border-brand shadow-lg text-foreground transition-all">
                  <a href={pro.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-6">
                    <Globe className="h-6 w-6 text-brand" />
                    <div className="text-left"><p className="text-[9px] font-black uppercase tracking-widest opacity-50">Site Web</p><p className="font-black truncate max-w-[150px]">Visiter le site</p></div>
                  </a>
                </Button>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/50 p-6 border-b"><CardTitle className="text-sm font-black uppercase flex items-center gap-3"><Clock className="h-5 w-5 text-brand" /> Horaires d'ouverture</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-2">
                {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(day => (
                  <div key={day} className="flex justify-between items-center text-xs font-bold border-b border-dashed border-muted last:border-0 pb-1.5 pt-1.5">
                    <span className="capitalize text-muted-foreground">{day}</span>
                    <span className="text-foreground font-black">{pro[day] || 'Fermé'}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-brand/5 p-8 rounded-[2rem] border-2 border-brand/20 text-center space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-brand">Besoin d'un autre pro ?</p>
              <Button asChild className="w-full bg-brand rounded-full font-black uppercase text-[10px] tracking-widest py-6">
                <Link href="/map">🔘 Retour à la carte interactive</Link>
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

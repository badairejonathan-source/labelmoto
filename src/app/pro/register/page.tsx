'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Send, Info } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';
import { submitProAction } from './actions';

function RegisterProContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitProAction(formData);

    if (result?.error) {
      toast({ variant: "destructive", title: "Erreur", description: result.error });
      setIsPending(false);
    } else {
      toast({ title: "Demande envoyée !", description: "Votre fiche sera examinée manuellement sous 48h par notre équipe." });
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="w-48 md:w-64"><LabelMotoLogo noBubble /></div>
          <Button asChild variant="outline" size="sm"><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Link></Button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="text-center bg-white p-8 rounded-3xl shadow-sm border">
            <Image src="/images/Stamp-LM.webp" alt="Label Moto" width={80} height={80} className="mx-auto mb-4 opacity-80" />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Inscrire mon établissement</h1>
            <p className="text-base text-muted-foreground font-medium">Référencez votre activité gratuitement sur le réseau national Label Moto.</p>
          </section>

          <Card className="border-2 border-brand shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-brand text-white p-8">
              <CardTitle className="text-2xl font-black uppercase tracking-tighter">Soumettre votre fiche</CardTitle>
              <CardDescription className="text-white/80 font-bold">Données vérifiées par nos modérateurs avant mise en ligne.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot Field */}
                <input type="text" name="hp_field" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Nom commercial</label>
                    <Input name="name" required placeholder="Ex: Moto Passion 75" className="font-bold h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Type de structure</label>
                    <Select name="appSection" defaultValue="shopping">
                      <SelectTrigger className="font-bold h-12 rounded-xl">
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shopping">Concessionnaire (Vente)</SelectItem>
                        <SelectItem value="service">Atelier / Garage (Réparation)</SelectItem>
                        <SelectItem value="both">Mixte (Vente & Service)</SelectItem>
                        <SelectItem value="association">Association / Club</SelectItem>
                        <SelectItem value="relais">Relais Motard (Hôtel/Resto)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Spécialité / Catégorie</label>
                  <Input name="category" required placeholder="Ex: Spécialiste Ducati, Préparateur, Revendeur multimarque..." className="font-bold h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Adresse complète</label>
                  <Textarea name="address" required placeholder="Numéro, rue, code postal et ville" className="font-bold min-h-[80px] rounded-xl" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Téléphone public</label>
                    <Input name="phone" type="tel" required placeholder="01 23 45 67 89" className="font-bold h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">E-mail de contact (privé)</label>
                    <Input name="email" type="email" required placeholder="contact@etablissement.fr" className="font-bold h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Site Web (optionnel)</label>
                  <Input name="website" type="url" placeholder="https://www.votre-site.fr" className="font-bold h-12 rounded-xl" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Facebook</label>
                    <Input name="facebook" type="url" placeholder="Lien page FB" className="font-bold h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Instagram</label>
                    <Input name="instagram" type="url" placeholder="Lien profil Insta" className="font-bold h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Informations complémentaires</label>
                  <Textarea name="description" placeholder="Marques représentées, services spécifiques, horaires types..." className="font-bold min-h-[120px] rounded-xl" />
                </div>

                <div className="bg-muted/30 p-4 rounded-2xl flex items-start gap-3">
                    <Info className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-muted-foreground italic leading-relaxed">
                        L'inscription est gratuite et réservée aux professionnels et structures motardes en activité. Notre équipe se réserve le droit de refuser toute demande incomplète ou non conforme à notre charte de qualité.
                    </p>
                </div>

                <div className="pt-6 border-t border-dashed">
                  <Button type="submit" disabled={isPending} className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl rounded-full">
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    Envoyer ma demande de référencement
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function RegisterProPage() {
  return <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><RegisterProContent /></Suspense>;
}

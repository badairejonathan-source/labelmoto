'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Store, Send } from 'lucide-react';
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
      toast({ title: "Demande envoyée !", description: "Votre fiche sera examinée sous 48h par notre équipe." });
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="w-80 md:w-64"><LabelMotoLogo /></div>
          <Button asChild variant="outline"><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Link></Button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="text-center bg-card p-8 rounded-xl shadow-lg border">
            <Image src="/images/Stamp-LM.webp" alt="Label Moto" width={100} height={100} className="mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Inscrire mon établissement</h1>
            <p className="text-lg text-muted-foreground font-medium">Rejoignez gratuitement le réseau national Label Moto.</p>
          </section>

          <Card className="border-2 border-brand shadow-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-brand text-white p-8">
              <CardTitle className="text-2xl font-black uppercase tracking-tighter">Formulaire de référencement</CardTitle>
              <CardDescription className="text-white/80 font-bold">Toutes les soumissions sont vérifiées manuellement avant publication.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot Field */}
                <input type="text" name="hp_field" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Nom de l'établissement</label>
                    <Input name="name" required placeholder="Ex: Moto Passion 75" className="font-bold h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Catégorie</label>
                    <Select name="category" defaultValue="concession">
                      <SelectTrigger className="font-bold h-12">
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concession">Concession</SelectItem>
                        <SelectItem value="atelier">Atelier</SelectItem>
                        <SelectItem value="concession-atelier">Concession & Atelier</SelectItem>
                        <SelectItem value="association">Association Motarde</SelectItem>
                        <SelectItem value="accessoiriste">Accessoiriste</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Adresse complète</label>
                  <Textarea name="address" required placeholder="Numéro, rue, code postal et ville" className="font-bold min-h-[80px]" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Téléphone</label>
                    <Input name="phone" type="tel" required placeholder="01 23 45 67 89" className="font-bold h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Email de contact</label>
                    <Input name="email" type="email" required placeholder="contact@pro.fr" className="font-bold h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Site Internet (facultatif)</label>
                  <Input name="website" type="url" placeholder="https://www.monsite.fr" className="font-bold h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Description / Services</label>
                  <Textarea name="description" placeholder="Décrivez brièvement vos spécialités, marques représentées, etc." className="font-bold min-h-[120px]" />
                </div>

                <div className="pt-6 border-t border-dashed">
                  <Button type="submit" disabled={isPending} className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl">
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    Soumettre ma demande gratuitement
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

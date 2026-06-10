'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Send, Camera } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';
import { useUser } from '@/firebase/client';
import { submitCreatorAction } from './actions';

const DEPARTEMENTS = [
  '01 - Ain', '02 - Aisne', '03 - Allier', '04 - Alpes-de-Haute-Provence', '05 - Hautes-Alpes',
  '06 - Alpes-Maritimes', '07 - Ardèche', '08 - Ardennes', '09 - Ariège', '10 - Aube',
  '11 - Aude', '12 - Aveyron', '13 - Bouches-du-Rhône', '14 - Calvados', '15 - Cantal',
  '16 - Charente', '17 - Charente-Maritime', '18 - Cher', '19 - Corrèze', '2A - Corse-du-Sud',
  '2B - Haute-Corse', '21 - Côte-d\'Or', '22 - Côtes-d\'Armor', '23 - Creuse', '24 - Dordogne',
  '25 - Doubs', '26 - Drôme', '27 - Eure', '28 - Eure-et-Loir', '29 - Finistère',
  '30 - Gard', '31 - Haute-Garonne', '32 - Gers', '33 - Gironde', '34 - Hérault',
  '35 - Ille-et-Vilaine', '36 - Indre', '37 - Indre-et-Loire', '38 - Isère', '39 - Jura',
  '40 - Landes', '41 - Loir-et-Cher', '42 - Loire', '43 - Haute-Loire', '44 - Loire-Atlantique',
  '45 - Loiret', '46 - Lot', '47 - Lot-et-Garonne', '48 - Lozère', '49 - Maine-et-Loire',
  '50 - Manche', '51 - Marne', '52 - Haute-Marne', '53 - Mayenne', '54 - Meurthe-et-Moselle',
  '55 - Meuse', '56 - Morbihan', '57 - Moselle', '58 - Nièvre', '59 - Nord',
  '60 - Oise', '61 - Orne', '62 - Pas-de-Calais', '63 - Puy-de-Dôme', '64 - Pyrénées-Atlantiques',
  '65 - Hautes-Pyrénées', '66 - Pyrénées-Orientales', '67 - Bas-Rhin', '68 - Haut-Rhin', '69 - Rhône',
  '70 - Haute-Saône', '71 - Saône-et-Loire', '72 - Sarthe', '73 - Savoie', '74 - Haute-Savoie',
  '75 - Paris', '76 - Seine-Maritime', '77 - Seine-et-Marne', '78 - Yvelines', '79 - Deux-Sèvres',
  '80 - Somme', '81 - Tarn', '82 - Tarn-et-Garonne', '83 - Var', '84 - Vaucluse',
  '85 - Vendée', '86 - Vienne', '87 - Haute-Vienne', '88 - Vosges', '89 - Yonne',
  '90 - Territoire de Belfort', '91 - Essonne', '92 - Hauts-de-Seine', '93 - Seine-Saint-Denis',
  '94 - Val-de-Marne', '95 - Val-d\'Oise', '971 - Guadeloupe', '972 - Martinique',
  '973 - Guyane', '974 - La Réunion', '976 - Mayotte'
];

function RegisterCreatorContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    if (!user?.email) {
      toast({ title: "Erreur", description: "Vous devez être connecté.", variant: "destructive" });
      setIsPending(false);
      return;
    }
    formData.set('email', user.email);
    const result = await submitCreatorAction(formData);
    if (result?.error) {
      toast({ variant: "destructive", title: "Erreur", description: result.error });
      setIsPending(false);
    } else {
      toast({ title: "Demande envoyée !", description: "Votre profil sera examiné sous 48h." });
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
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="text-center bg-white p-8 rounded-3xl shadow-sm border">
            <Camera className="h-12 w-12 text-brand mx-auto mb-4 opacity-80" />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Créer mon profil créateur</h1>
            <p className="text-base text-muted-foreground font-medium">Photographe, vidéaste, créateur de contenu moto — rejoins Label Moto gratuitement.</p>
          </section>

          <Card className="border-2 border-brand shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-brand text-white p-8">
              <CardTitle className="text-2xl font-black uppercase tracking-tighter">Ton profil</CardTitle>
              <CardDescription className="text-white/80 font-bold">Vérifié par notre équipe avant mise en ligne.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" name="hp_field" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Nom / Pseudo</label>
                    <Input name="displayName" required placeholder="Ex: Thibaut D." className="font-bold h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Activité</label>
                    <Input name="activite" required placeholder="Ex: Photographe moto" className="font-bold h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Spécialité</label>
                  <Input name="specialite" required placeholder="Ex: Photo produit, lifestyle, reportage" className="font-bold h-12 rounded-xl" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Ville / Zone</label>
                    <Input name="ville" required placeholder="Ex: Lyon & Auvergne-Rhône-Alpes" className="font-bold h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Département</label>
                    <select name="departement" required className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm font-bold">
                      <option value="">Choisir un département</option>
                      {DEPARTEMENTS.map(d => <option key={d} value={d.split(' - ')[0]}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Instagram</label>
                  <Input name="instagram" placeholder="@tonpseudo" className="font-bold h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Photo de profil (URL)</label>
                  <Input name="photoUrl" type="url" placeholder="https://..." className="font-bold h-12 rounded-xl" />
                  <p className="text-[10px] text-muted-foreground px-1">Lien vers ta photo — ou envoie-la à <strong>contact@labelmoto.fr</strong> après inscription.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">E-mail de contact</label>
                  <div className="flex items-center h-12 px-4 rounded-xl border border-input bg-muted/50">
                    <span className="font-bold text-sm text-muted-foreground">{user?.email}</span>
                    <span className="text-[10px] text-brand font-black uppercase ml-auto">Compte Label Moto</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Description (optionnel)</label>
                  <Textarea name="description" placeholder="Décris ton activité en quelques mots..." className="font-bold min-h-[100px] rounded-xl" />
                </div>

                <div className="pt-6 border-t border-dashed">
                  <Button type="submit" disabled={isPending} className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl rounded-full">
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    Envoyer ma demande
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

export default function RegisterCreatorPage() {
  return <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><RegisterCreatorContent /></Suspense>;
}

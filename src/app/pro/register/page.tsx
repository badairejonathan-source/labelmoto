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
import { useUser } from '@/firebase/client';
import { submitProAction } from './actions';

function RegisterProContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const { user } = useUser();
  const [horaires, setHoraires] = useState<Record<string, {om:string,fm:string,oa:string,fa:string,ferme:boolean}>>({
    lundi:    {om:'',fm:'',oa:'',fa:'',ferme:false},
    mardi:    {om:'',fm:'',oa:'',fa:'',ferme:false},
    mercredi: {om:'',fm:'',oa:'',fa:'',ferme:false},
    jeudi:    {om:'',fm:'',oa:'',fa:'',ferme:false},
    vendredi: {om:'',fm:'',oa:'',fa:'',ferme:false},
    samedi:   {om:'',fm:'',oa:'',fa:'',ferme:false},
    dimanche: {om:'',fm:'',oa:'',fa:'',ferme:true},
  });
  const heures = ['','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'];
  const formatHoraire = (h: {om:string,fm:string,oa:string,fa:string,ferme:boolean}) => {
    if (h.ferme) return 'Fermé';
    const matin = h.om && h.fm ? h.om+'-'+h.fm : '';
    const aprem = h.oa && h.fa ? h.oa+'-'+h.fa : '';
    return [matin, aprem].filter(Boolean).join(', ');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    if (!user?.email) {
      toast({ title: "Erreur", description: "Vous devez être connecté pour soumettre une fiche.", variant: "destructive" });
      setIsPending(false);
      return;
    }
    formData.set('email', user.email);
    const horairesFinal: Record<string,string> = {};
    Object.entries(horaires).forEach(([j,h]) => { horairesFinal[j] = formatHoraire(h); });
    formData.set('horaires', JSON.stringify(horairesFinal));
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
                    <Select name="appSection" defaultValue="shopping" onValueChange={(val) => { if (val === 'creator') router.push('/creators/register'); }}>
                      <SelectTrigger className="font-bold h-12 rounded-xl">
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shopping">Concessionnaire (Vente)</SelectItem>
                        <SelectItem value="service">Atelier / Garage (Réparation)</SelectItem>
                        <SelectItem value="both">Mixte (Vente & Service)</SelectItem>
                        <SelectItem value="association">Association / Club</SelectItem>
                        <SelectItem value="relais">Relais Motard (Hôtel/Resto)</SelectItem>
                        <SelectItem value="creator">Photographe / Vidéaste</SelectItem>
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">E-mail de contact</label>
                    <div className="flex items-center h-12 px-4 rounded-xl border border-input bg-muted/50">
                      <span className="font-bold text-sm text-muted-foreground">{user?.email}</span>
                      <span className="text-[10px] text-brand font-black uppercase ml-auto">Compte Label Moto</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Site Web (optionnel)</label>
                  <Input name="website" type="url" placeholder="https://www.votre-site.fr" className="font-bold h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Photo de l'établissement (optionnel)</label>
                  <Input name="imageUrl" type="url" placeholder="https://exemple.com/photo.jpg" className="font-bold h-12 rounded-xl" />
                  <p className="text-[10px] text-muted-foreground px-1">Lien direct vers une photo de votre établissement (façade, devanture...)</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Lien Google Maps (optionnel)</label>
                  <Input name="googleMapsUrl" type="url" placeholder="https://maps.google.com/..." className="font-bold h-12 rounded-xl" />
                  <p className="text-[10px] text-muted-foreground px-1">Collez le lien de votre fiche Google Maps si vous en avez une — cela accélère la validation.</p>
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

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Horaires d'ouverture</label>
                  <div className="grid gap-3">
                    {(Object.keys(horaires) as Array<keyof typeof horaires>).map(jour => (
                      <div key={jour} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground capitalize">{jour}</span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={horaires[jour].ferme} onChange={e => setHoraires(h => ({...h, [jour]: {...h[jour], ferme: e.target.checked}}))} className="rounded" />
                            <span className="text-[10px] font-black uppercase text-muted-foreground">Fermé</span>
                          </label>
                        </div>
                        {!horaires[jour].ferme && (
                          <div className="grid grid-cols-4 gap-2">
                            <select value={horaires[jour].om} onChange={e => setHoraires(h => ({...h, [jour]: {...h[jour], om: e.target.value}}))} className="h-10 rounded-xl border border-input bg-background px-2 text-sm font-bold">
                              <option value="">Ouv.</option>
                              {heures.filter(Boolean).map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <select value={horaires[jour].fm} onChange={e => setHoraires(h => ({...h, [jour]: {...h[jour], fm: e.target.value}}))} className="h-10 rounded-xl border border-input bg-background px-2 text-sm font-bold">
                              <option value="">Ferm.</option>
                              {heures.filter(Boolean).map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <select value={horaires[jour].oa} onChange={e => setHoraires(h => ({...h, [jour]: {...h[jour], oa: e.target.value}}))} className="h-10 rounded-xl border border-input bg-background px-2 text-sm font-bold">
                              <option value="">Ouv.</option>
                              {heures.filter(Boolean).map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <select value={horaires[jour].fa} onChange={e => setHoraires(h => ({...h, [jour]: {...h[jour], fa: e.target.value}}))} className="h-10 rounded-xl border border-input bg-background px-2 text-sm font-bold">
                              <option value="">Ferm.</option>
                              {heures.filter(Boolean).map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1">Matin : ouverture → fermeture &nbsp;|&nbsp; Après-midi : ouverture → fermeture</p>
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

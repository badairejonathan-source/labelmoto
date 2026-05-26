'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LogOut, ArrowLeft, User, Bike, Palette, Save, X, ShieldCheck, MailWarning } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const badgeColors = [
  { id: 'brand', label: 'Orange Moto', class: 'bg-brand' },
  { id: 'blue', label: 'Bleu Vitesse', class: 'bg-blue-600' },
  { id: 'green', label: 'Vert Kawa', class: 'bg-green-600' },
  { id: 'red', label: 'Rouge Ducati', class: 'bg-red-600' },
  { id: 'purple', label: 'Violet Custom', class: 'bg-purple-600' },
  { id: 'black', label: 'Noir Outlaw', class: 'bg-black' },
];

const profileSchema = z.object({
  pseudo: z.string().min(2, 'Le pseudo doit faire au moins 2 caractères.'),
  motorcycleModel: z.string().optional(),
  badgeColor: z.string().default('brand'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const callbackUrl = searchParams.get('callbackUrl');

  // Chargement des EXTENSIONS MÉTIER si elles existent
  const proRef = useMemoFirebase(() => user ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proRef);

  const stdRef = useMemoFirebase(() => user ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdRef);

  const activeDetailProfile = proProfile || stdProfile;
  const isPro = profile?.role === 'pro' || !!proProfile;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { pseudo: '', motorcycleModel: '', badgeColor: 'brand', firstName: '', lastName: '', companyName: '' },
  });

  // Guard de vérification email
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push(`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`);
    } else if (user && !user.emailVerified) {
      router.push('/verify-email');
    }
  }, [user, isUserLoading, router, callbackUrl]);

  useEffect(() => {
    if (activeDetailProfile || profile) {
      form.reset({
        pseudo: activeDetailProfile?.pseudo || profile?.displayName || user?.displayName || '',
        motorcycleModel: activeDetailProfile?.motorcycleModel || '',
        badgeColor: activeDetailProfile?.badgeColor || 'brand',
        firstName: proProfile?.firstName || '',
        lastName: proProfile?.lastName || '',
        companyName: proProfile?.companyName || '',
      });
    }
  }, [activeDetailProfile, profile, user, proProfile]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  /**
   * Action de Onboarding : Met à jour le NOYAU users/{uid}
   * et crée le document d'EXTENSION correspondant.
   */
  const handleChooseType = async (type: 'user' | 'pro') => {
    if (!user) return;
    try {
      // 1. Mise à jour du noyau
      await updateDoc(doc(firestore, 'users', user.uid), {
        role: type,
        onboardingComplete: true,
        updatedAt: serverTimestamp()
      });
      
      // 2. Création de l'extension métier
      const coll = type === 'pro' ? 'professionalProfiles' : 'standardProfiles';
      await setDoc(doc(firestore, coll, user.uid), {
        id: user.uid,
        email: user.email,
        displayName: user.displayName || 'Motard',
        pseudo: user.displayName || 'Motard',
        badgeColor: 'brand',
        createdAt: serverTimestamp()
      });

      toast({ title: 'Type de compte défini !', description: 'Bienvenue sur Label Moto.' });
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de la création du profil." });
    }
  };

  const onUpdateProfile: SubmitHandler<ProfileFormValues> = async (values) => {
    if (!user) return;
    const collectionName = isPro ? 'professionalProfiles' : 'standardProfiles';
    
    try {
      // Met à jour l'extension
      await updateDoc(doc(firestore, collectionName, user.uid), {
        ...values,
        updatedAt: serverTimestamp()
      });
      // Met à jour le noyau (synchro displayName/pseudo)
      await updateDoc(doc(firestore, 'users', user.uid), {
        displayName: values.pseudo,
        updatedAt: serverTimestamp()
      });
      toast({ title: 'Profil mis à jour !' });
      setIsEditing(false);
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur lors de la mise à jour." });
    }
  };

  if (isUserLoading || !user) {
    return <div className="flex h-screen w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  const showChoice = profile && !profile.onboardingComplete;
  const selectedColor = badgeColors.find(c => c.id === (isEditing ? form.watch('badgeColor') : activeDetailProfile?.badgeColor)) || badgeColors[0];

  return (
    <div className="min-h-screen bg-muted/20">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} />
      
      <main className="container mx-auto px-4 py-8 pt-28">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand text-[10px] font-black uppercase tracking-widest transition-colors"><ArrowLeft className="h-4 w-4" /> Accueil</Link>
            {!user.emailVerified && <Badge variant="destructive" className="animate-pulse"><MailWarning className="h-3 w-3 mr-1" /> Email non vérifié</Badge>}
          </div>

          {showChoice ? (
            <Card className="border-4 border-brand rounded-[3rem] overflow-hidden shadow-2xl">
              <CardHeader className="bg-brand text-white p-10 text-center">
                <CardTitle className="text-4xl font-black uppercase tracking-tighter mb-2">Bienvenue par ici !</CardTitle>
                <CardDescription className="text-white/80 font-bold text-lg">Choisissez comment vous souhaitez utiliser Label Moto.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8 p-10">
                <Card className="flex flex-col border-2 hover:border-brand transition-all cursor-pointer rounded-[2.5rem] overflow-hidden group shadow-lg" onClick={() => handleChooseType('pro')}>
                  <CardHeader className="p-8 pb-4 text-center">
                    <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"><Palette className="text-brand h-10 w-10" /></div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Professionnel</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 flex-grow text-center"><p className="text-sm text-muted-foreground font-bold leading-relaxed">Référencez votre établissement et gagnez en visibilité.</p></CardContent>
                  <CardFooter className="p-8"><Button variant="outline" className="w-full font-black uppercase text-[10px] h-12 rounded-full border-2">C'est mon métier</Button></CardFooter>
                </Card>
                <Card className="flex flex-col border-2 hover:border-brand transition-all cursor-pointer rounded-[2.5rem] overflow-hidden group shadow-lg" onClick={() => handleChooseType('user')}>
                  <CardHeader className="p-8 pb-4 text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"><Bike className="text-blue-500 h-10 w-10" /></div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Motard</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 flex-grow text-center"><p className="text-sm text-muted-foreground font-bold leading-relaxed">Donnez votre avis et trouvez les meilleurs garages.</p></CardContent>
                  <CardFooter className="p-8"><Button variant="outline" className="w-full font-black uppercase text-[10px] h-12 rounded-full border-2">Je suis un pilote</Button></CardFooter>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
              <div className={cn("h-32 transition-colors duration-500", selectedColor.class)} />
              <CardHeader className="relative pt-0 px-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
                  <div className="flex items-end gap-6">
                    <Avatar className="h-32 w-32 border-[6px] border-white shadow-2xl">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback className="text-4xl font-black bg-muted text-brand">{profile?.displayName?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="pb-3">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-black uppercase tracking-tight leading-none">{profile?.displayName || "Motard"}</h2>
                        <Badge className={cn("font-black uppercase text-[9px] tracking-widest text-white border-none px-3 py-1", selectedColor.class)}>
                          {isPro ? 'PRO' : 'PILOTE'}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                        {user?.email} {user.emailVerified && <ShieldCheck className="h-3 w-3 text-green-500" />}
                      </p>
                    </div>
                  </div>
                  {!isEditing && (
                    <div className="flex gap-3 pb-3">
                      <Button variant="outline" size="sm" className="font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-full border-2" onClick={() => setIsEditing(true)}>Modifier profil</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 font-black uppercase text-[10px] tracking-widest h-10 px-4 rounded-full" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Déconnexion</Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-10 px-10">
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onUpdateProfile)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="pseudo" render={({ field }) => (
                            <FormItem>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><User className="h-3.5 w-3.5" /> Pseudo</label>
                              <FormControl><Input placeholder="Votre pseudo" className="font-bold h-12 rounded-xl" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="motorcycleModel" render={({ field }) => (
                            <FormItem>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Bike className="h-3.5 w-3.5" /> Ma Moto</label>
                              <FormControl><Input placeholder="Ex: Yamaha MT-07" className="font-bold h-12 rounded-xl" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="badgeColor" render={({ field }) => (
                            <FormItem>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Palette className="h-3.5 w-3.5" /> Couleur du badge</label>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="font-bold h-12 rounded-xl"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                                <SelectContent className="z-[3000]">
                                  {badgeColors.map(color => (
                                    <SelectItem key={color.id} value={color.id}><div className="flex items-center gap-2"><div className={cn("w-3 h-3 rounded-full", color.class)} /><span className="font-bold text-xs">{color.label}</span></div></SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                        )} />
                      </div>
                      <div className="flex justify-end gap-4 pt-8 border-t border-dashed">
                        <Button variant="ghost" type="button" onClick={() => setIsEditing(false)} className="font-bold px-8 h-12 rounded-full"><X className="h-4 w-4 mr-2" /> Annuler</Button>
                        <Button type="submit" className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] px-12 h-14 rounded-full shadow-xl"><Save className="h-4 w-4 mr-2" /> Enregistrer</Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-12 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">👤 Identité</p>
                        <p className="text-2xl font-black uppercase tracking-tight">{profile?.displayName || "Non renseigné"}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">🏍️ Monture</p>
                        <p className="text-2xl font-black uppercase tracking-tight">{activeDetailProfile?.motorcycleModel || "Non renseignée"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AccountPage() {
  return <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><AccountContent /></Suspense>;
}
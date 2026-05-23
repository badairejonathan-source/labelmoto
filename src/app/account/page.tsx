'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LogOut, ArrowLeft, User, Bike, Palette, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';

// Badge color options
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
  // Fields for pro profile
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [view, setView] = useState<'loading' | 'choice' | 'pro_form' | 'account'>('loading');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const callbackUrl = searchParams.get('callbackUrl');

  const proRef = useMemoFirebase(() => user ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile, isLoading: isProLoading } = useDoc(proRef);

  const stdRef = useMemoFirebase(() => user ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile, isLoading: isStdLoading } = useDoc(stdRef);

  const activeProfile = proProfile || stdProfile;
  const isPro = !!proProfile;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      pseudo: '',
      motorcycleModel: '',
      badgeColor: 'brand',
      firstName: '',
      lastName: '',
      companyName: '',
    },
  });

  useEffect(() => {
    if (isAuthLoading || isProLoading || isStdLoading) {
      setView('loading');
    } else if (!user) {
      router.push(`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`);
    } else if (proProfile || stdProfile) {
      setView('account');
      // Initialize form with existing data
      form.reset({
        pseudo: activeProfile?.pseudo || activeProfile?.displayName || user.displayName || user.email?.split('@')[0] || '',
        motorcycleModel: activeProfile?.motorcycleModel || '',
        badgeColor: activeProfile?.badgeColor || 'brand',
        firstName: proProfile?.firstName || '',
        lastName: proProfile?.lastName || '',
        companyName: proProfile?.companyName || '',
      });
    } else {
      setView('choice');
    }
  }, [user, isAuthLoading, isProLoading, isStdLoading, proProfile, stdProfile, router, form, activeProfile, callbackUrl]);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  const handleChooseStandard = () => {
    if (!user || !firestore) return;
    const initialStd = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Motard',
      pseudo: user.displayName || user.email?.split('@')[0] || 'Motard',
      badgeColor: 'brand',
      motorcycleModel: '',
    };
    setDocumentNonBlocking(doc(firestore, 'standardProfiles', user.uid), initialStd, {});
    toast({ title: 'Compte Standard créé !', description: 'Bienvenue sur Label Moto.' });
    
    if (callbackUrl) {
      router.push(callbackUrl);
    }
  };

  const onUpdateProfile: SubmitHandler<ProfileFormValues> = async (values) => {
    if (!user || !firestore) return;
    
    const collectionName = isPro ? 'professionalProfiles' : 'standardProfiles';
    const isNewProfile = !activeProfile;
    
    const profileData = {
      ...activeProfile,
      ...values,
      updatedAt: new Date().toISOString(),
    };

    setDocumentNonBlocking(doc(firestore, collectionName, user.uid), profileData, { merge: true });
    toast({ title: 'Profil mis à jour !', description: 'Vos modifications ont été enregistrées.' });
    setIsEditing(false);

    if (isNewProfile && callbackUrl) {
      router.push(callbackUrl);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (view === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  const selectedColor = badgeColors.find(c => c.id === (isEditing ? form.watch('badgeColor') : activeProfile?.badgeColor)) || badgeColors[0];

  return (
    <div className="min-h-screen bg-muted/20">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        placeholderText="Recherche par departement , ville , marque, nom ... "
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto pt-20">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-xs font-black uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          {view === 'choice' && (
            <Card className="border-2 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="bg-brand text-white p-8">
                <CardTitle className="text-3xl font-black uppercase tracking-tighter">Bienvenue parmi nous !</CardTitle>
                <CardDescription className="text-white/80 font-bold text-lg">Choisissez votre profil pour continuer sur Label Moto.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6 p-8">
                <Card className="flex flex-col border-2 hover:border-brand transition-all cursor-pointer rounded-[2rem] overflow-hidden group" onClick={() => setView('pro_form')}>
                  <CardHeader className="p-6 pb-2">
                    <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Palette className="text-brand h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight">Professionnel</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 flex-grow">
                    <p className="text-sm text-muted-foreground font-bold leading-snug">Inscrivez votre établissement, gérez vos fiches et gagnez en visibilité auprès de la communauté.</p>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button variant="outline" className="w-full font-black uppercase text-[10px] tracking-widest h-12 rounded-full border-2">Choisir Pro</Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col border-2 hover:border-brand transition-all cursor-pointer rounded-[2rem] overflow-hidden group" onClick={handleChooseStandard}>
                  <CardHeader className="p-6 pb-2">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Bike className="text-blue-500 h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight">Motard</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 flex-grow">
                    <p className="text-sm text-muted-foreground font-bold leading-snug">Donnez votre avis, gérez vos favoris et personnalisez votre profil de pilote.</p>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button variant="outline" className="w-full font-black uppercase text-[10px] tracking-widest h-12 rounded-full border-2">Choisir Motard</Button>
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>
          )}

          {view === 'pro_form' && (
            <Card className="border-2 border-brand rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="bg-brand text-white p-8">
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">Profil Professionnel</CardTitle>
                    <CardDescription className="text-white/80 font-bold">Ces informations sont nécessaires pour identifier votre entreprise.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onUpdateProfile)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prénom</FormLabel><FormControl><Input placeholder="Jean" className="font-bold h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lastName" render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom</FormLabel><FormControl><Input placeholder="Dupont" className="font-bold h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="companyName" render={({ field }) => (
                                <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entreprise</FormLabel><FormControl><Input placeholder="Moto Passion 75" className="font-bold h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="pseudo" render={({ field }) => (
                                <FormItem><FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pseudo (Nom d'affichage)</FormLabel><FormControl><Input placeholder="Jean_Moto" className="font-bold h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="flex justify-end gap-3 pt-6 border-t border-dashed">
                                <Button variant="ghost" onClick={() => setView('choice')} className="font-bold">Annuler</Button>
                                <Button type="submit" className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] px-10 h-14 rounded-full shadow-xl">Finaliser mon compte Pro</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
          )}

          {view === 'account' && (
            <Card className="border-2 shadow-2xl overflow-hidden rounded-[2.5rem]">
              <div className={cn("h-32 transition-colors duration-500", selectedColor.class)} />
              <CardHeader className="relative pt-0 px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
                  <div className="flex items-end gap-6">
                    <Avatar className="h-32 w-32 border-[6px] border-background shadow-2xl">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback className="text-4xl font-black bg-muted text-brand">{form.getValues('pseudo')?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="pb-3">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
                          {isEditing ? "Édition du profil" : (activeProfile?.pseudo || "Motard anonyme")}
                        </h2>
                        {!isEditing && (
                          <Badge className={cn("font-black uppercase text-[10px] tracking-widest text-white border-none px-3 py-1", selectedColor.class)}>
                            {isPro ? 'PRO' : 'PILOTE'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60">{user?.email}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <div className="flex gap-3 pb-3">
                      <Button variant="outline" size="sm" className="font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-full border-2" onClick={() => setIsEditing(true)}>
                        Modifier mon profil
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 font-black uppercase text-[10px] tracking-widest h-10 px-4 rounded-full" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-10 px-8">
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onUpdateProfile)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="pseudo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <User className="h-3.5 w-3.5" /> Pseudo
                              </FormLabel>
                              <FormControl><Input placeholder="Votre pseudo" className="font-bold h-12 rounded-xl" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="motorcycleModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Bike className="h-3.5 w-3.5" /> Ma Moto actuelle
                              </FormLabel>
                              <FormControl><Input placeholder="Ex: Yamaha MT-07" className="font-bold h-12 rounded-xl" {...field} /></FormControl>
                              <FormDescription className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground/60">Ce modèle apparaîtra à côté de vos avis.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="badgeColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Palette className="h-3.5 w-3.5" /> Couleur du badge
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="font-bold h-12 rounded-xl">
                                    <SelectValue placeholder="Choisir une couleur" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {badgeColors.map(color => (
                                    <SelectItem key={color.id} value={color.id}>
                                      <div className="flex items-center gap-2">
                                        <div className={cn("w-4 h-4 rounded-full", color.class)} />
                                        <span className="font-bold">{color.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {isPro && (
                        <div className="space-y-6 pt-8 border-t-2 border-dashed">
                           <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand">Infos Professionnelles</p>
                           <div className="grid grid-cols-2 gap-4">
                              <FormField control={form.control} name="firstName" render={({ field }) => (
                                  <FormItem><FormLabel className="text-[10px] font-black">Prénom</FormLabel><FormControl><Input className="font-bold h-12 rounded-xl" {...field} /></FormControl></FormItem>
                              )} />
                              <FormField control={form.control} name="lastName" render={({ field }) => (
                                  <FormItem><FormLabel className="text-[10px] font-black">Nom</FormLabel><FormControl><Input className="font-bold h-12 rounded-xl" {...field} /></FormControl></FormItem>
                              )} />
                           </div>
                           <FormField control={form.control} name="companyName" render={({ field }) => (
                               <FormItem><FormLabel className="text-[10px] font-black">Entreprise</FormLabel><FormControl><Input className="font-bold h-12 rounded-xl" {...field} /></FormControl></FormItem>
                           )} />
                        </div>
                      )}

                      <div className="flex justify-end gap-4 pt-8 border-t">
                        <Button variant="ghost" type="button" onClick={() => setIsEditing(false)} className="font-bold px-8 h-12 rounded-full">
                          <X className="h-4 w-4 mr-2" /> Annuler
                        </Button>
                        <Button type="submit" className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] px-12 h-14 rounded-full shadow-xl">
                          <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                          <User className="h-4 w-4 text-brand" /> Pseudo
                        </p>
                        <p className="text-2xl font-black uppercase tracking-tight">{activeProfile?.pseudo || activeProfile?.displayName || "Non renseigné"}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                          <Bike className="h-4 w-4 text-brand" /> Ma Moto
                        </p>
                        <p className="text-2xl font-black uppercase tracking-tight">{activeProfile?.motorcycleModel || "Non renseignée"}</p>
                      </div>
                    </div>

                    {isPro && (
                      <div className="space-y-4 pt-8 border-t-2 border-dashed">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand">Entreprise</p>
                        <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-dashed">
                          <p className="text-2xl font-black uppercase tracking-tight leading-none mb-2">{proProfile?.companyName || "Nom de l'entreprise"}</p>
                          <p className="text-sm font-black text-muted-foreground opacity-60 uppercase tracking-widest">{proProfile?.firstName} {proProfile?.lastName}</p>
                        </div>
                      </div>
                    )}
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
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}>
      <AccountContent />
    </Suspense>
  );
}

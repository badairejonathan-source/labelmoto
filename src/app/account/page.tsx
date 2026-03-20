
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AccountPage() {
  const router = useRouter();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [view, setView] = useState<'loading' | 'choice' | 'pro_form' | 'account'>('loading');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      router.push('/login');
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
  }, [user, isAuthLoading, isProLoading, isStdLoading, proProfile, stdProfile, router, form, activeProfile]);

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
  };

  const onUpdateProfile: SubmitHandler<ProfileFormValues> = async (values) => {
    if (!user || !firestore) return;
    
    const collectionName = isPro ? 'professionalProfiles' : 'standardProfiles';
    const profileData = {
      ...activeProfile,
      ...values,
      updatedAt: new Date().toISOString(),
    };

    setDocumentNonBlocking(doc(firestore, collectionName, user.uid), profileData, { merge: true });
    toast({ title: 'Profil mis à jour !', description: 'Vos modifications ont été enregistrées.' });
    setIsEditing(false);
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
        placeholderText="Recherche par nom, ville, departement"
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-xs font-black uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          {view === 'choice' && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Bienvenue parmi nous !</CardTitle>
                <CardDescription>Choisissez votre profil pour continuer sur Label Moto.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6 pt-4">
                <Card className="flex flex-col border-2 hover:border-brand transition-colors cursor-pointer" onClick={() => setView('pro_form')}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-2">
                        <Palette className="text-brand h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold">Professionnel</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground">Inscrivez votre établissement, gérez vos fiches et gagnez en visibilité.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full font-bold">Choisir Pro</Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col border-2 hover:border-brand transition-colors cursor-pointer" onClick={handleChooseStandard}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-2">
                        <Bike className="text-blue-500 h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold">Motard (Standard)</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground">Donnez votre avis, gérez vos favoris et personnalisez votre profil de pilote.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full font-bold">Choisir Motard</Button>
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>
          )}

          {view === 'pro_form' && (
            <Card className="border-2 border-brand">
                <CardHeader>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Profil Professionnel</CardTitle>
                    <CardDescription>Ces informations sont nécessaires pour identifier votre entreprise.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onUpdateProfile)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input placeholder="Jean" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lastName" render={({ field }) => (
                                    <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Dupont" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="companyName" render={({ field }) => (
                                <FormItem><FormLabel>Entreprise</FormLabel><FormControl><Input placeholder="Moto Passion 75" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="pseudo" render={({ field }) => (
                                <FormItem><FormLabel>Pseudo (Nom d'affichage)</FormLabel><FormControl><Input placeholder="Jean_Moto" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" onClick={() => setView('choice')}>Annuler</Button>
                                <Button type="submit" className="bg-brand hover:bg-brand/90 font-bold uppercase tracking-widest text-xs px-8">Finaliser mon compte Pro</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
          )}

          {view === 'account' && (
            <Card className="border-2 shadow-xl overflow-hidden">
              <div className={cn("h-24 transition-colors duration-500", selectedColor.class)} />
              <CardHeader className="relative pt-0 px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
                  <div className="flex items-end gap-4">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback className="text-3xl font-black bg-muted">{form.getValues('pseudo')?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                          {isEditing ? "Édition du profil" : (activeProfile?.pseudo || "Motard anonyme")}
                        </h2>
                        {!isEditing && (
                          <Badge className={cn("font-black uppercase text-[8px] tracking-widest text-white border-none", selectedColor.class)}>
                            {isPro ? 'PRO' : 'PILOTE'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-bold">{user?.email}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <div className="flex gap-2 pb-2">
                      <Button variant="outline" size="sm" className="font-black uppercase text-[10px] tracking-widest" onClick={() => setIsEditing(true)}>
                        Modifier mon profil
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 font-black uppercase text-[10px] tracking-widest" onClick={handleLogout}>
                        <LogOut className="h-3 w-3 mr-2" /> Déconnexion
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onUpdateProfile)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="pseudo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <User className="h-3.5 w-3.5" /> Pseudo
                              </FormLabel>
                              <FormControl><Input placeholder="Votre pseudo" className="font-bold" {...field} /></FormControl>
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
                              <FormControl><Input placeholder="Ex: Yamaha MT-07" className="font-bold" {...field} /></FormControl>
                              <FormDescription className="text-[9px]">Ce modèle apparaîtra à côté de vos avis.</FormDescription>
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
                                  <SelectTrigger className="font-bold">
                                    <SelectValue placeholder="Choisir une couleur" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {badgeColors.map(color => (
                                    <SelectItem key={color.id} value={color.id}>
                                      <div className="flex items-center gap-2">
                                        <div className={cn("w-3 h-3 rounded-full", color.class)} />
                                        {color.label}
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
                        <div className="space-y-4 pt-4 border-t border-dashed">
                           <p className="text-[10px] font-black uppercase tracking-widest text-brand">Infos Professionnelles</p>
                           <div className="grid grid-cols-2 gap-4">
                              <FormField control={form.control} name="firstName" render={({ field }) => (
                                  <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                              )} />
                              <FormField control={form.control} name="lastName" render={({ field }) => (
                                  <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                              )} />
                           </div>
                           <FormField control={form.control} name="companyName" render={({ field }) => (
                               <FormItem><FormLabel>Entreprise</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                           )} />
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button variant="ghost" type="button" onClick={() => setIsEditing(false)} className="font-bold">
                          <X className="h-4 w-4 mr-2" /> Annuler
                        </Button>
                        <Button type="submit" className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs px-8">
                          <Save className="h-4 w-4 mr-2" /> Enregistrer
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <User className="h-3.5 w-3.5" /> Pseudo
                        </p>
                        <p className="text-lg font-black uppercase tracking-tight">{activeProfile?.pseudo || activeProfile?.displayName || "Non renseigné"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Bike className="h-3.5 w-3.5" /> Ma Moto
                        </p>
                        <p className="text-lg font-black uppercase tracking-tight">{activeProfile?.motorcycleModel || "Non renseignée"}</p>
                      </div>
                    </div>

                    {isPro && (
                      <div className="space-y-4 pt-6 border-t border-dashed">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand">Entreprise</p>
                        <div className="bg-muted/30 p-4 rounded-xl">
                          <p className="text-lg font-black uppercase tracking-tight">{proProfile?.companyName || "Nom de l'entreprise"}</p>
                          <p className="text-sm font-bold text-muted-foreground mt-1">{proProfile?.firstName} {proProfile?.lastName}</p>
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

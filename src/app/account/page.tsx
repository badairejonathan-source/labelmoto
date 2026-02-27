
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
import { Loader2, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';


const proProfileSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis.'),
  lastName: z.string().min(1, 'Le nom de famille est requis.'),
  companyName: z.string().optional(),
});

type ProProfileFormValues = z.infer<typeof proProfileSchema>;


export default function AccountPage() {
  const router = useRouter();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [view, setView] = useState<'loading' | 'choice' | 'pro_form' | 'pro_account' | 'standard_account'>('loading');
  
  const professionalProfileRef = useMemoFirebase(() => user ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: professionalProfile, isLoading: isProLoading } = useDoc(professionalProfileRef);

  const standardProfileRef = useMemoFirebase(() => user ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: standardProfile, isLoading: isStandardLoading } = useDoc(standardProfileRef);

  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<ProProfileFormValues>({
    resolver: zodResolver(proProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isAuthLoading || isProLoading || isStandardLoading) {
      setView('loading');
    } else if (!user) {
      router.push('/login');
    } else if (professionalProfile) {
      setView('pro_account');
    } else if (standardProfile) {
      setView('standard_account');
    } else {
      setView('choice');
    }
  }, [user, isAuthLoading, isProLoading, isStandardLoading, professionalProfile, standardProfile, router]);


  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  const handleChooseStandard = () => {
    if (!user || !firestore) return;
    const standardProfileDoc = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName || user.email,
    };
    setDocumentNonBlocking(doc(firestore, 'standardProfiles', user.uid), standardProfileDoc, {});
    toast({ title: 'Compte Standard créé !', description: 'Bienvenue sur Label Moto.' });
  };

  const handleChoosePro = () => {
    setView('pro_form');
  };

  const onProFormSubmit: SubmitHandler<ProProfileFormValues> = async (values) => {
    if (!user || !firestore) return;
    const profileDoc = {
      id: user.uid,
      email: user.email,
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName || '',
      phone: user.phoneNumber || '',
    };
    setDocumentNonBlocking(doc(firestore, 'professionalProfiles', user.uid), profileDoc, {});
    toast({ title: 'Profil Professionnel créé !', description: 'Vous pouvez maintenant gérer vos fiches.' });
  };
  
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFilterChange = (filter: 'shopping' | 'service') => {
    router.push(`/map?filter=${filter}`);
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        );
      case 'choice':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Quel type de compte souhaitez-vous ?</CardTitle>
              <CardDescription>Ce choix nous aidera à personnaliser votre expérience.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Compte Professionnel</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">Inscrivez votre établissement, gérez vos fiches et gagnez en visibilité auprès de la communauté.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleChoosePro}>Devenir Professionnel</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Compte Standard</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">Accédez à toutes les fonctionnalités pour les motards : avis, favoris, et plus encore.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleChooseStandard}>Choisir ce compte</Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        );
      case 'pro_form':
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Complétez votre profil professionnel</CardTitle>
                    <CardDescription>Ces informations apparaîtront sur vos fiches.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onProFormSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prénom</FormLabel>
                                            <FormControl><Input placeholder="Jean" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom de famille</FormLabel>
                                            <FormControl><Input placeholder="Dupont" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom de l'entreprise (optionnel)</FormLabel>
                                        <FormControl><Input placeholder="Moto Passion 75" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setView('choice')}>Retour</Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Enregistrer le profil
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        );
      case 'pro_account':
      case 'standard_account':
        const profileData = view === 'pro_account' ? professionalProfile : standardProfile;
        const displayName = view === 'pro_account' 
            ? `${professionalProfile?.firstName} ${professionalProfile?.lastName}`
            : (profileData?.displayName || user?.displayName || 'Utilisateur');

        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Mon Compte</CardTitle>
                    <CardDescription>Gérez vos informations personnelles et vos préférences.</CardDescription>
                  </div>
                  <Badge variant={view === 'pro_account' ? "default" : "secondary"}>
                    {view === 'pro_account' ? 'Professionnel' : 'Standard'}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.photoURL || undefined} alt="User avatar" />
                  <AvatarFallback className="text-2xl">{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{displayName}</p>
                  <p className="text-muted-foreground">{user?.email}</p>
                   {view === 'pro_account' && professionalProfile?.companyName && (
                       <p className="text-sm text-muted-foreground">{professionalProfile.companyName}</p>
                   )}
                </div>
              </div>
              <div className="border-t pt-6">
                 <Button variant="outline" onClick={handleLogout}>
                   <LogOut className="mr-2 h-4 w-4" />
                   Déconnexion
                 </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  if (view === 'loading') {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
  }

  return (
    <div className="min-h-screen">
       <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        activeFilter={null}
        onFilterChange={handleFilterChange}
        placeholderText="Recherche par nom, ville, departement"
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

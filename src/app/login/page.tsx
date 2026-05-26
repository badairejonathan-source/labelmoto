'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirebase } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, KeyRound, ArrowLeft, User } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
});

const registerSchema = z.object({
  fullName: z.string().min(3, { message: 'Nom complet requis.' }),
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

function LoginContent() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth, firestore, user } = useFirebase();
  const { toast } = useToast();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      if (!userCredential.user.emailVerified) {
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      } else {
        toast({ title: 'Bon retour parmi nous !' });
        router.push(callbackUrl);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Connexion échouée',
        description: error.code === 'auth/invalid-credential' ? 'Email ou mot de passe incorrect.' : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      // Mise à jour du profil local Auth
      await updateProfile(userCredential.user, { displayName: values.fullName });

      // Création du document NOYAU dans Firestore
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: values.email,
        displayName: values.fullName,
        role: 'user',
        status: 'pending_verification',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        onboardingComplete: false
      });
      
      // Envoi du mail de vérification
      await sendEmailVerification(userCredential.user);
      
      toast({ title: 'Compte créé !', description: 'Vérifiez votre boîte de réception pour valider votre inscription.' });
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur d'inscription",
        description: error.code === 'auth/email-already-in-use' ? 'Cette adresse e-mail est déjà utilisée.' : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !z.string().email().safeParse(resetEmail).success) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'E-mail non valide.' });
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({ title: 'E-mail envoyé !', description: 'Consultez votre boîte mail pour réinitialiser votre mot de passe.' });
      setIsResetDialogOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'envoyer l'e-mail." });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
            <div className="w-64 md:w-72">
                <LabelMotoLogo />
            </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted rounded-full mb-8 shadow-inner">
            <TabsTrigger value="login" className="rounded-full font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="rounded-full font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-2 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/50 border-b p-8">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Heureux de vous revoir</CardTitle>
                <CardDescription className="font-bold">Accédez à vos avis et vos fiches personnalisées.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <FormField control={loginForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</FormLabel>
                          <FormControl><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="votre@email.com" className="pl-10 font-bold h-12 rounded-xl" {...field} /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mot de passe</FormLabel>
                            <button type="button" onClick={() => setIsResetDialogOpen(true)} className="text-[9px] font-black uppercase text-brand hover:underline">Mot de passe oublié ?</button>
                          </div>
                          <FormControl><div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="••••••••" className="pl-10 font-bold h-12 rounded-xl" {...field} /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <Button type="submit" className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 rounded-xl shadow-lg transition-transform active:scale-[0.98]" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Se connecter
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-2 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/50 border-b p-8">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Rejoindre la communauté</CardTitle>
                <CardDescription className="font-bold">Partagez votre passion et suivez vos pros préférés.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                    <FormField control={registerForm.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom Complet / Pseudo</FormLabel>
                          <FormControl><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Jean Moto" className="pl-10 font-bold h-12 rounded-xl" {...field} /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField control={registerForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</FormLabel>
                          <FormControl><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="votre@email.com" className="pl-10 font-bold h-12 rounded-xl" {...field} /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={registerForm.control} name="password" render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mot de passe</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" className="font-bold h-12 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={registerForm.control} name="confirmPassword" render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirmation</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" className="font-bold h-12 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button type="submit" className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 rounded-xl shadow-lg" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Créer mon compte
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand text-[10px] font-black uppercase tracking-widest transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Retour à l'accueil
            </Link>
        </div>
      </div>

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
          <DialogHeader><DialogTitle className="text-xl font-black uppercase">Récupération de compte</DialogTitle><DialogDescription className="font-bold">Indiquez votre email pour recevoir le lien de réinitialisation.</DialogDescription></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Votre E-mail</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="votre@email.com" className="pl-10 font-bold h-12 rounded-xl" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setIsResetDialogOpen(false)} className="font-bold rounded-full">Annuler</Button>
            <Button className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-12 rounded-full px-8" onClick={handleResetPassword} disabled={isResetting}>{isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Envoyer le lien</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><LoginContent /></Suspense>;
}
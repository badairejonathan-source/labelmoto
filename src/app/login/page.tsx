
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
} from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
  password: z
    .string()
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
  password: z
    .string()
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
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
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Connexion réussie !' });
      router.push(callbackUrl);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description:
          error.code === 'auth/invalid-credential'
            ? 'Email ou mot de passe incorrect.'
            : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      
      // Envoi de l'e-mail de vérification (seul mail automatisable côté client)
      await sendEmailVerification(userCredential.user);
      
      toast({
        title: 'Inscription réussie !',
        description: 'Bienvenue ! Un e-mail de vérification vous a été envoyé.',
      });
      router.push(callbackUrl);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur d'inscription",
        description:
          error.code === 'auth/email-already-in-use'
            ? 'Cette adresse e-mail est déjà utilisée.'
            : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !z.string().email().safeParse(resetEmail).success) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez entrer une adresse e-mail valide.' });
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({ 
        title: 'E-mail envoyé !', 
        description: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.' 
      });
      setIsResetDialogOpen(false);
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Erreur', 
        description: "Nous n'avons pas pu envoyer l'e-mail. Vérifiez l'adresse saisie." 
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <Link href="/" className="w-56">
                <LabelMotoLogo />
            </Link>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted rounded-full">
            <TabsTrigger value="login" className="rounded-full font-black uppercase text-[10px] tracking-widest">Se connecter</TabsTrigger>
            <TabsTrigger value="register" className="rounded-full font-black uppercase text-[10px] tracking-widest">S'inscrire</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Connexion</CardTitle>
                <CardDescription>
                  Accédez à votre espace pour gérer vos avis et vos fiches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="votre@email.com"
                                  className="pl-10 font-bold"
                                  {...field}
                                />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mot de passe</FormLabel>
                            <button 
                                type="button" 
                                onClick={() => setIsResetDialogOpen(true)}
                                className="text-[9px] font-black uppercase tracking-widest text-brand hover:underline"
                            >
                                Mot de passe oublié ?
                            </button>
                          </div>
                          <FormControl>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="••••••••" className="pl-10 font-bold" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs py-6 mt-2" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Se connecter
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Inscription</CardTitle>
                <CardDescription>
                  Créez un compte pour rejoindre la communauté Label Moto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="votre@email.com"
                              className="font-bold"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Min. 6 caractères" className="font-bold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="font-bold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs py-6 mt-2" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      S'inscrire
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                Retour à l'accueil
            </Link>
        </div>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre e-mail pour recevoir un lien de réinitialisation sécurisé.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Votre E-mail</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="email" 
                        placeholder="votre@email.com" 
                        className="pl-10 font-bold"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setIsResetDialogOpen(false)} className="font-bold">Annuler</Button>
            <Button 
                className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs px-8" 
                onClick={handleResetPassword}
                disabled={isResetting}
            >
                {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer le lien
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

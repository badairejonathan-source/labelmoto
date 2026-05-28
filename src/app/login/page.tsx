'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFirebase } from '@/firebase/client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
import { sendCustomPasswordResetEmailAction } from '@/app/auth/reset-password-actions';

function LoginContent() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const onLoginSubmit = async (values: any) => {
    if (!auth) return;
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
        description: 'Email ou mot de passe incorrect.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: any) => {
    if (!auth || !firestore) return;
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(userCredential.user, { displayName: values.fullName });

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
      
      toast({ title: 'Compte créé !', description: 'Bienvenue sur Label Moto.' });
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}&new=1`);
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Erreur d'inscription",
        description: error.code === 'auth/email-already-in-use' ? 'Cette adresse e-mail est déjà utilisée.' : 'Une erreur est survenue.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez saisir une adresse e-mail.' });
      return;
    }
    setIsResetting(true);
    try {
      // Appel de l'action isolée
      const result = await sendCustomPasswordResetEmailAction(resetEmail);
      if (result.success) {
        toast({ 
          title: 'Vérifiez votre boîte mail', 
          description: 'Si un compte existe, un lien de réinitialisation vient de vous être envoyé.' 
        });
        setIsResetDialogOpen(false);
      } else {
        toast({ 
          variant: 'destructive', 
          title: 'Envoi échoué', 
          description: String(result.error || "Erreur technique serveur") 
        });
      }
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Erreur', 
        description: "Impossible de traiter la demande. Erreur d'initialisation serveur." 
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-md">
        <div className="mb-10 flex justify-center">
            <div className="w-64 md:w-72">
                <LabelMotoLogo noBubble />
            </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted rounded-full mb-8 shadow-inner">
            <TabsTrigger value="login" className="rounded-full font-black uppercase text-[10px] tracking-widest">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="rounded-full font-black uppercase text-[10px] tracking-widest">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-2 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/50 border-b p-8">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Heureux de vous revoir</CardTitle>
                <CardDescription className="font-bold">Accédez à vos avis et vos fiches personnalisées.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={(e) => { e.preventDefault(); const d = new FormData(e.currentTarget); onLoginSubmit(Object.fromEntries(d) as any); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input name="email" type="email" placeholder="votre@email.com" className="pl-10 font-bold h-12 rounded-xl" required /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mot de passe</label>
                      <button type="button" onClick={() => setIsResetDialogOpen(true)} className="text-[9px] font-black uppercase text-brand hover:underline">Mot de passe oublié ?</button>
                    </div>
                    <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input name="password" type="password" placeholder="••••••••" className="pl-10 font-bold h-12 rounded-xl" required /></div>
                  </div>
                  <Button type="submit" className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 rounded-xl shadow-lg transition-transform active:scale-[0.98]" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Se connecter
                  </Button>
                </form>
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
                <form onSubmit={(e) => { e.preventDefault(); const d = new FormData(e.currentTarget); onRegisterSubmit(Object.fromEntries(d) as any); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom Complet / Pseudo</label>
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input name="fullName" placeholder="Jean Moto" className="pl-10 font-bold h-12 rounded-xl" required /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input name="email" type="email" placeholder="votre@email.com" className="pl-10 font-bold h-12 rounded-xl" required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mot de passe</label>
                      <Input name="password" type="password" placeholder="••••••••" className="font-bold h-12 rounded-xl" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirmation</label>
                      <Input name="confirmPassword" type="password" placeholder="••••••••" className="font-bold h-12 rounded-xl" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 rounded-xl shadow-lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Créer mon compte
                  </Button>
                </form>
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
          <DialogHeader><DialogTitle className="text-xl font-black uppercase">Récupération de compte</DialogTitle><DialogDescription className="font-bold">Indiquez votre email pour recevoir le lien de réinitialisation premium.</DialogDescription></DialogHeader>
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

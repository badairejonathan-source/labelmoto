'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFirebase, useUser } from '@/firebase';
import {
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  checkActionCode,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, AlertTriangle, KeyRound, ArrowRight, ShieldCheck, Home } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';
import Link from 'next/link';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

type ActionState = 'loading' | 'success' | 'error' | 'resetPasswordForm' | 'resetPasswordSuccess';

function AuthActionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const continueUrl = searchParams.get('continueUrl') || '/account';

  const [state, setState] = useState<ActionState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!mode || !oobCode) {
      setState('error');
      setErrorMessage("Le lien semble incomplet ou a déjà été utilisé.");
      return;
    }

    const handleAction = async () => {
      try {
        switch (mode) {
          case 'verifyEmail':
            await applyActionCode(auth, oobCode);
            setState('success');
            break;

          case 'resetPassword':
            const email = await verifyPasswordResetCode(auth, oobCode);
            setUserEmail(email);
            setState('resetPasswordForm');
            break;

          case 'recoverEmail':
            await checkActionCode(auth, oobCode);
            await applyActionCode(auth, oobCode);
            setState('success');
            break;

          default:
            setState('error');
            setErrorMessage("Action inconnue ou non supportée.");
        }
      } catch (error: any) {
        console.error("Auth action error:", error);
        setState('error');
        if (error.code === 'auth/expired-action-code') {
          setErrorMessage("Ce lien a expiré. Merci de renouveler votre demande.");
        } else if (error.code === 'auth/invalid-action-code') {
          setErrorMessage("Ce code n'est plus valide ou a déjà été utilisé.");
        } else {
          setErrorMessage("Une erreur technique est survenue.");
        }
      }
    };

    handleAction();
  }, [mode, oobCode, auth]);

  const onResetSubmit = async (values: ResetPasswordValues) => {
    if (!oobCode) return;
    setState('loading');
    try {
      await confirmPasswordReset(auth, oobCode, values.password);
      setState('resetPasswordSuccess');
      toast({ title: "Mot de passe modifié", description: "Votre nouveau mot de passe est actif." });
      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      setState('resetPasswordForm');
      toast({ variant: 'destructive', title: "Erreur", description: "Impossible de modifier le mot de passe." });
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 flex justify-center">
        <div className="w-64 md:w-72">
          <LabelMotoLogo noBubble />
        </div>
      </div>

      <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        {state === 'loading' && (
          <div className="p-16 text-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-brand mx-auto" />
            <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground animate-pulse">
              Traitement en cours...
            </p>
          </div>
        )}

        {state === 'success' && (
          <>
            <CardHeader className="bg-brand text-white p-10 text-center">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black uppercase tracking-tighter">C'est validé !</CardTitle>
              <CardDescription className="text-white/80 font-bold">
                {mode === 'verifyEmail' 
                  ? "Votre adresse e-mail a été confirmée. Bienvenue chez Label Moto." 
                  : "L'opération a été effectuée avec succès."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 text-center">
              <Button asChild className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 rounded-xl shadow-lg">
                <Link href={user ? '/account' : '/login'}>
                  {user ? "Accéder à mon compte" : "Se connecter maintenant"} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </>
        )}

        {state === 'resetPasswordForm' && (
          <>
            <CardHeader className="bg-brand text-white p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <KeyRound className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tighter leading-none">Nouveau mot de passe</CardTitle>
              </div>
              <CardDescription className="text-white/80 font-bold">
                Définissez votre nouveau mot de passe pour <span className="text-white underline">{userEmail}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onResetSubmit)} className="space-y-6">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="font-bold h-12 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirmez le mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="font-bold h-12 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 rounded-xl shadow-lg">
                    Enregistrer le mot de passe
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {state === 'resetPasswordSuccess' && (
          <>
            <CardHeader className="bg-green-600 text-white p-10 text-center">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black uppercase tracking-tighter">C'est tout bon !</CardTitle>
              <CardDescription className="text-white/80 font-bold">Votre mot de passe a bien été mis à jour.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 text-center">
              <p className="text-[10px] font-bold text-muted-foreground mb-6 uppercase tracking-widest">Redirection vers la connexion...</p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 font-black uppercase tracking-widest text-xs h-14 rounded-xl shadow-lg">
                <Link href="/login">Se connecter maintenant</Link>
              </Button>
            </CardContent>
          </>
        )}

        {state === 'error' && (
          <>
            <CardHeader className="bg-destructive text-white p-10 text-center">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black uppercase tracking-tighter">Lien non valide</CardTitle>
            </CardHeader>
            <CardContent className="p-10 text-center space-y-8">
              <p className="font-bold text-muted-foreground leading-relaxed">
                {errorMessage}
              </p>
              <div className="grid grid-cols-1 gap-3 pt-4">
                <Button asChild variant="outline" className="font-black uppercase tracking-widest text-[10px] h-12 rounded-xl border-2">
                  <Link href="/login">Retourner à la connexion</Link>
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>

      <div className="mt-12 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand text-[10px] font-black uppercase tracking-widest transition-colors">
          <Home className="h-3.5 w-3.5" /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-brand" />}>
        <AuthActionHandler />
      </Suspense>
    </div>
  );
}

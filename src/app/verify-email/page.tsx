'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFirebase, useUser } from '@/firebase/client';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, RefreshCw, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';
import Link from 'next/link';
import { errorEmitter } from '@/firebase/client';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/client';
import { sendCustomVerificationEmailAction } from '@/app/auth/actions';

function VerifyEmailContent() {
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Priorité : URL > User Auth > État local (pour forcer)
  const [emailInput, setEmailInput] = useState(searchParams.get('email') || '');
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const effectiveEmail = emailInput || user?.email;
  const isNewAccount = searchParams.get('new') === '1';

  useEffect(() => {
    if (user?.emailVerified) {
      router.push('/account');
    }
    if (!emailInput && user?.email) {
      setEmailInput(user.email);
    }
  }, [user, router, emailInput]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!effectiveEmail || countdown > 0) {
      toast({ variant: "destructive", title: "Email manquant", description: "Veuillez renseigner votre adresse e-mail." });
      return;
    }
    
    setIsResending(true);
    try {
      console.log(`[VERIFY-PAGE] Demande d'envoi pour : ${effectiveEmail}`);
      const result = await sendCustomVerificationEmailAction(effectiveEmail);
      
      if (result.success) {
        toast({ title: "E-mail envoyé !", description: "Vérifiez votre boîte mail (et vos spams)." });
        setCountdown(60);
      } else {
        toast({ variant: "destructive", title: "Erreur", description: result.error || "Impossible d'envoyer l'e-mail." });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur technique", description: "Une erreur est survenue lors de l'appel au serveur." });
    } finally {
      setIsResending(false);
    }
  };

  const checkVerification = async () => {
    if (!auth?.currentUser || !firestore) {
        toast({ variant: "destructive", title: "Session expirée", description: "Veuillez vous reconnecter." });
        return;
    }
    setIsChecking(true);
    try {
      await auth.currentUser.reload();
      
      if (auth.currentUser.emailVerified) {
        const userRef = doc(firestore, 'users', auth.currentUser.uid);
        const updateData = {
          status: 'active',
          emailVerifiedSync: true,
          emailVerifiedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await updateDoc(userRef, updateData).catch(async (err) => {
          if (err.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: userRef.path,
              operation: 'update',
              requestResourceData: updateData
            } satisfies SecurityRuleContext));
          }
        });
        
        toast({ title: "Compte vérifié !", description: "Bienvenue officiellement sur Label Moto." });
        router.push('/account');
      } else {
        toast({ title: "Pas encore vérifié", description: "Veuillez cliquer sur le lien reçu par e-mail puis cliquez ici." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur de synchro", description: "Impossible de vérifier l'état du compte." });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-10 flex justify-center"><div className="w-64"><LabelMotoLogo noBubble /></div></div>
        
        <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-brand text-white p-10">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                {isNewAccount ? <Sparkles className="h-10 w-10 text-white" /> : <Mail className="h-10 w-10 text-white" />}
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter">
              {isNewAccount ? "Compte créé !" : "Vérifiez vos e-mails"}
            </CardTitle>
            <CardDescription className="text-white/80 font-bold text-lg leading-tight">
                {effectiveEmail ? `Lien envoyé à : ${effectiveEmail}` : "Prêt à valider votre compte ?"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 space-y-8">
            {!effectiveEmail && !isUserLoading && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-widest">
                        <AlertTriangle className="h-4 w-4" /> Adresse manquante
                    </div>
                    <Input 
                        placeholder="Saisissez votre e-mail" 
                        value={emailInput} 
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="font-bold"
                    />
                </div>
            )}

            <div className="bg-muted/50 p-6 rounded-2xl border-2 border-dashed space-y-4">
                <p className="text-sm font-bold text-muted-foreground leading-relaxed text-center">
                    Une fois que vous aurez cliqué sur le bouton dans l'e-mail, cliquez ici pour finaliser.
                </p>
                <Button onClick={checkVerification} disabled={isChecking} className="w-full bg-foreground hover:bg-brand text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-full shadow-lg transition-transform active:scale-95">
                    {isChecking ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                    J'ai validé mon email
                </Button>
            </div>

            <div className="pt-4 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action requise :</p>
                <Button 
                    variant="outline" 
                    onClick={handleResend} 
                    disabled={isResending || countdown > 0 || (!effectiveEmail && !isUserLoading)}
                    className="w-full rounded-full border-brand text-brand hover:bg-brand/5 h-12 font-black uppercase text-[10px] tracking-widest shadow-sm"
                >
                    {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
                    {countdown > 0 ? `Attendre ${countdown}s` : "Renvoyer l'e-mail de validation"}
                </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10">
            <Link href="/login" className="text-muted-foreground hover:text-brand font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                <RefreshCw className="h-3 w-3" /> Retourner à la connexion
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><VerifyEmailContent /></Suspense>;
}
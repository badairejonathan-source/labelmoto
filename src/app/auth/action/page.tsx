
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, AlertTriangle, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function AuthActionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  // Le continueUrl peut être dans les params directs (si Custom Action URL) 
  // ou extrait manuellement si on est dans la redirection Firebase standard.
  const continueUrl = searchParams.get('continueUrl') || '/account';
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'reset-password'>('loading');
  const [message, setMessage] = useState('Vérification en cours...');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode || !mode) {
      setStatus('error');
      setMessage("Le lien est invalide ou a déjà été utilisé.");
      return;
    }

    const handleAction = async () => {
      try {
        switch (mode) {
          case 'verifyEmail':
            await applyActionCode(auth, oobCode);
            
            // Si l'utilisateur est connecté, on synchronise son document
            if (auth.currentUser) {
              await auth.currentUser.reload();
              await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
                status: 'active',
                emailVerifiedSync: true,
                emailVerifiedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              }).catch(() => {
                // Erreur silencieuse si le document n'existe pas encore (onboarding non fini)
              });
            }
            
            setStatus('success');
            setMessage("Votre adresse e-mail a été validée ! Vous pouvez maintenant profiter pleinement de Label Moto.");
            break;
          
          case 'resetPassword':
            const email = await verifyPasswordResetCode(auth, oobCode);
            setStatus('reset-password');
            setMessage(`Définissez votre nouveau mot de passe pour ${email}`);
            break;

          default:
            setStatus('error');
            setMessage("Action non reconnue.");
        }
      } catch (e: any) {
        console.error("Auth Action Error:", e);
        setStatus('error');
        if (e.code === 'auth/invalid-action-code') {
          setMessage("Ce lien a expiré. Merci de renouveler votre demande.");
        } else {
          setMessage("Une erreur est survenue lors de l'opération.");
        }
      }
    };

    handleAction();
  }, [mode, oobCode, auth, firestore]);

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Sécurité", description: "6 caractères minimum requis." });
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setStatus('success');
      setMessage("Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de modifier le mot de passe." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectTarget = status === 'reset-password' ? '/login' : continueUrl;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-10 flex justify-center"><div className="w-64"><LabelMotoLogo noBubble /></div></div>
        
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className={cn("text-white p-10 transition-colors duration-500", status === 'error' ? "bg-destructive" : "bg-brand")}>
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                {status === 'loading' && <Loader2 className="h-10 w-10 animate-spin" />}
                {status === 'success' && <CheckCircle2 className="h-10 w-10" />}
                {status === 'error' && <AlertTriangle className="h-10 w-10" />}
                {(status === 'reset-password') && <KeyRound className="h-10 w-10" />}
            </div>
            <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                {status === 'reset-password' ? "Nouveau mot de passe" : "Action de compte"}
            </CardTitle>
            <CardDescription className="text-white/80 font-bold leading-tight mt-2 text-base">
              {message}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 space-y-6">
            {status === 'reset-password' && (
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nouveau mot de passe</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-xl font-bold border-2 focus:border-brand" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleResetPassword} disabled={isSubmitting} className="w-full bg-brand h-14 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Valider le changement
                </Button>
              </div>
            )}

            {(status === 'success' || status === 'error') && (
              <Button asChild className="w-full bg-foreground hover:bg-brand text-white h-14 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Link href={redirectTarget}>
                  {status === 'error' ? "Retourner à l'accueil" : "Continuer vers Label Moto"} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}

            {status === 'success' && mode === 'verifyEmail' && (
               <div className="pt-4 flex items-center justify-center gap-2 text-green-600 font-black uppercase text-[9px] tracking-widest">
                  <ShieldCheck className="h-4 w-4" /> Compte certifié
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthActionPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><AuthActionContent /></Suspense>;
}

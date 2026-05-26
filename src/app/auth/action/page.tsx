
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
import { Loader2, CheckCircle2, AlertTriangle, KeyRound, ArrowRight } from 'lucide-react';
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
  const continueUrl = searchParams.get('continueUrl') || '/account';
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'reset-password'>('loading');
  const [message, setMessage] = useState('Traitement de votre demande...');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode || !mode) {
      setStatus('error');
      setMessage("Le lien semble invalide ou expiré.");
      return;
    }

    const handleAction = async () => {
      try {
        switch (mode) {
          case 'verifyEmail':
            await applyActionCode(auth, oobCode);
            
            // Synchronisation Firestore si l'utilisateur est déjà dans la session
            if (auth.currentUser) {
              await auth.currentUser.reload();
              await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
                status: 'active',
                emailVerifiedSync: true,
                emailVerifiedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            }
            
            setStatus('success');
            setMessage("Votre adresse e-mail a été validée avec succès ! Bienvenue dans la communauté Label Moto.");
            break;
          
          case 'resetPassword':
            const email = await verifyPasswordResetCode(auth, oobCode);
            setStatus('reset-password');
            setMessage(`Définissez votre nouveau mot de passe pour le compte ${email}`);
            break;

          default:
            setStatus('error');
            setMessage("Cette action n'est pas reconnue par notre système.");
        }
      } catch (e: any) {
        console.error("Auth Action Error:", e);
        setStatus('error');
        if (e.code === 'auth/invalid-action-code') {
          setMessage("Ce lien a déjà été utilisé ou a expiré.");
        } else {
          setMessage("Une erreur technique est survenue. Veuillez réessayer.");
        }
      }
    };

    handleAction();
  }, [mode, oobCode, auth, firestore]);

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Mot de passe trop court", description: "Le mot de passe doit faire 6 caractères minimum." });
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setStatus('success');
      setMessage("Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter en toute sécurité.");
      toast({ title: "Succès !", description: "Mot de passe mis à jour." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de réinitialiser le mot de passe." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectTarget = status === 'reset-password' ? '/login' : continueUrl;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-10 flex justify-center"><div className="w-64"><LabelMotoLogo noBubble /></div></div>
        
        <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-hidden">
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Définir un mot de passe robuste</label>
                  <Input 
                    type="password" 
                    placeholder="Minimum 6 caractères" 
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthActionPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><AuthActionContent /></Suspense>;
}

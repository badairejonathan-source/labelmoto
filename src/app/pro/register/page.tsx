'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import UnifiedSiteHeader from '@/components/app/unified-site-header';
import ProfessionalListingForm, {
  ProfessionalListingFormValues,
} from '@/components/app/professional-listing-form';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/client';
import { submitProAction } from './actions';

function RegisterProContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace('/login?callbackUrl=/pro/register');
      return;
    }

    if (!user.emailVerified) {
      router.replace('/verify-email?callbackUrl=/pro/register');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (values: ProfessionalListingFormValues) => {
    if (!user?.email) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour soumettre une fiche.',
        variant: 'destructive',
      });
      return;
    }

    if (!user.emailVerified) {
      toast({
        title: 'E-mail non vérifié',
        description: "Validez votre adresse e-mail avant d'envoyer une demande de fiche.",
        variant: 'destructive',
      });
      router.push('/verify-email?callbackUrl=/pro/register');
      return;
    }

    const formData = new FormData();
    formData.set('name', values.name);
    formData.set('category', values.category);
    formData.set('appSection', values.appSection);
    formData.set('address', values.address);
    formData.set('phone', values.phone);
    formData.set('email', user.email);
    formData.set('website', values.website);
    formData.set('description', values.description);
    formData.set('facebook', values.facebook);
    formData.set('instagram', values.instagram);
    formData.set('horaires', JSON.stringify(values.horaires));
    formData.set('imageUrl', values.imageUrl);
    formData.set('hp_field', '');
    formData.set('idToken', await user.getIdToken(true));

    const result = await submitProAction(formData);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: result.error,
      });
      return;
    }

    toast({
      title: 'Demande envoyée !',
      description: 'Votre fiche sera examinée manuellement sous 48h par notre équipe.',
    });
    router.push('/');
  };

  if (isUserLoading || !user || !user.emailVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <UnifiedSiteHeader />

      <main className="container mx-auto p-4 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="text-center bg-white p-8 rounded-3xl shadow-sm border">
            <Image
              src="/images/Stamp-LM.webp"
              alt="Label Moto"
              width={80}
              height={80}
              className="mx-auto mb-4 h-20 w-20 opacity-80"
            />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-2">
              Inscrire mon établissement
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              Référencez votre activité gratuitement sur le réseau national Label Moto.
            </p>
          </section>

          <ProfessionalListingForm
            accountEmail={user.email || ''}
            emailReadOnly
            onCreatorSelected={() => router.push('/creators/register')}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}

export default function RegisterProPage() {
  return (
    <Suspense
      fallback={(
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      )}
    >
      <RegisterProContent />
    </Suspense>
  );
}

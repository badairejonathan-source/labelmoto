'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import Header from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { isAllowedProCollection } from '@/lib/pro-claim-utils';
import ProfessionalListingForm, {
  type ProfessionalAppSection,
  type ProfessionalListingFormValues,
} from '@/components/app/professional-listing-form';
import { submitOwnedModificationAction } from './actions';

const DAYS = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
] as const;

type DayKey = (typeof DAYS)[number];

function getAllowedSections(
  collectionName: string
): ProfessionalAppSection[] {
  if (collectionName === 'associations') {
    return ['association'];
  }

  if (collectionName === 'relais') {
    return ['relais'];
  }

  if (collectionName === 'creators') {
    return ['creator'];
  }

  return [
    'shopping',
    'service',
    'both',
  ];
}

function getInitialSection(
  collectionName: string,
  listing: any
): ProfessionalAppSection {
  const allowed =
    getAllowedSections(collectionName);

  const current =
    String(
      listing?.appSection || ''
    ).trim() as ProfessionalAppSection;

  if (allowed.includes(current)) {
    return current;
  }

  return allowed[0];
}

function numberOrNull(
  value: unknown
): number | null {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

export default function EditOwnedListingPage() {
  const params =
    useParams<{
      collection: string;
      id: string;
    }>();

  const collectionName =
    decodeURIComponent(
      params.collection || ''
    );

  const listingId =
    decodeURIComponent(
      params.id || ''
    );

  const {
    firestore,
    user,
    isUserLoading,
  } = useFirebase();

  const { toast } = useToast();
  const router = useRouter();

  const [listing, setListing] =
    useState<any | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitted, setSubmitted] =
    useState(false);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace(
        `/login?callbackUrl=${encodeURIComponent(
          `/pro/mes-fiches/${collectionName}/${listingId}`
        )}`
      );

      return;
    }

    if (!user.emailVerified) {
      router.replace(
        `/verify-email?callbackUrl=${encodeURIComponent(
          `/pro/mes-fiches/${collectionName}/${listingId}`
        )}`
      );
    }
  }, [
    user,
    isUserLoading,
    router,
    collectionName,
    listingId,
  ]);

  useEffect(() => {
    if (
      !firestore ||
      !user?.emailVerified ||
      !isAllowedProCollection(
        collectionName
      ) ||
      !listingId
    ) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const snapshot =
          await getDoc(
            doc(
              firestore,
              collectionName,
              listingId
            )
          );

        if (!snapshot.exists()) {
          throw new Error(
            'Fiche introuvable.'
          );
        }

        const data = snapshot.data();

        if (
          data.ownerUid !== user.uid
        ) {
          throw new Error(
            'Cette fiche n’est pas rattachée à votre compte.'
          );
        }

        if (!cancelled) {
          setListing({
            id: snapshot.id,
            ...data,
          });
        }
      }
      catch (error: any) {
        if (!cancelled) {
          toast({
            title: 'Accès impossible',
            description:
              error.message,
            variant: 'destructive',
          });
        }
      }
      finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    firestore,
    user,
    collectionName,
    listingId,
    toast,
  ]);

  const submit = async (
    values: ProfessionalListingFormValues
  ) => {
    if (!user || !listing) return;

    try {
      const formData =
        new FormData();

      formData.set(
        'idToken',
        await user.getIdToken(true)
      );

      formData.set(
        'targetCollection',
        collectionName
      );

      formData.set(
        'targetId',
        listingId
      );

      formData.set(
        'title',
        values.name
      );

      formData.set(
        'appSection',
        values.appSection
      );

      formData.set(
        'address',
        values.address
      );

      formData.set(
        'phoneNumber',
        values.phone
      );

      formData.set(
        'email',
        values.email
      );

      formData.set(
        'website',
        values.website
      );

      formData.set(
        'category',
        values.category
      );

      formData.set(
        'info',
        values.description
      );

      formData.set(
        'instagramUrl',
        values.instagram
      );

      formData.set(
        'facebookUrl',
        values.facebook
      );

      formData.set(
        'imageUrl',
        values.imageUrl
      );

      for (const day of DAYS) {
        formData.set(
          day,
          values.horaires[day] || ''
        );
      }

      const result =
        await submitOwnedModificationAction(
          formData
        );

      if (result?.error) {
        toast({
          title:
            'Demande impossible',
          description:
            result.error,
          variant: 'destructive',
        });

        return;
      }

      setSubmitted(true);

      toast({
        title:
          'Modifications envoyées',
        description:
          'Elles seront publiées uniquement après validation Label Moto.',
      });
    }
    catch (error: any) {
      toast({
        title: 'Erreur',
        description:
          error.message,
        variant: 'destructive',
      });
    }
  };

  if (
    loading ||
    isUserLoading ||
    !user
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />

        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />

          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
            Demande envoyée
          </h1>

          <p className="text-sm text-muted-foreground mb-8">
            Votre fiche publique reste inchangée jusqu’à la validation de Label Moto.
          </p>

          <Button
            onClick={() =>
              router.push('/account')
            }
          >
            Retour à mes fiches
          </Button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />

        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <p className="font-black">
            Fiche inaccessible.
          </p>

          <Button
            asChild
            className="mt-4"
          >
            <Link href="/account">
              Retour à mon compte
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const horaires =
    DAYS.reduce(
      (acc, day) => {
        acc[day] =
          String(
            listing.horaires?.[day] ??
            listing[day] ??
            ''
          );

        return acc;
      },
      {} as Record<DayKey, string>
    );

  const initialValues:
    Partial<ProfessionalListingFormValues> = {
      name:
        String(
          listing.title || ''
        ),

      appSection:
        getInitialSection(
          collectionName,
          listing
        ),

      category:
        String(
          listing.category || ''
        ),

      address:
        String(
          listing.address || ''
        ),

      phone:
        String(
          listing.phoneNumber ||
          listing.phone ||
          ''
        ),

      email:
        String(
          listing.email ||
          user.email ||
          ''
        ),

      website:
        String(
          listing.website || ''
        ),

      facebook:
        String(
          listing.facebookUrl ||
          listing.facebook ||
          ''
        ),

      instagram:
        String(
          listing.instagramUrl ||
          listing.instagram ||
          ''
        ),

      description:
        String(
          listing.info ||
          listing.description ||
          ''
        ),

      horaires,

      imageUrl:
        String(
          listing.imageUrl ||
          listing.imgUrl ||
          ''
        ),

      googleMapsUrl:
        String(
          listing.googleMapsUrl ||
          ''
        ),

      latitude:
        numberOrNull(
          listing.latitude ??
          listing.lat
        ),

      longitude:
        numberOrNull(
          listing.longitude ??
          listing.lng
        ),
    };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />

      <main className="container mx-auto p-4 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-5">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Mes fiches
          </Link>

          <ProfessionalListingForm
            initialValues={
              initialValues
            }
            accountEmail={
              user.email || ''
            }
            listingId={
              listingId
            }
            title="Modifier ma fiche"
            description="Proposez vos changements. Label Moto les vérifie et garde la validation finale avant publication."
            submitLabel="Envoyer mes modifications"
            allowedSections={
              getAllowedSections(
                collectionName
              )
            }
            onSubmit={submit}
          />
        </div>
      </main>
    </div>
  );
}

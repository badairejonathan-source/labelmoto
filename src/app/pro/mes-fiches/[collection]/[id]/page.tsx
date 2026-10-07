'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import Header from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, ExternalLink, Handshake, Loader2, Trash2 } from 'lucide-react';
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

type RecommendationParty = {
  collection: string;
  id: string;
  title: string;
  slug?: string;
  category?: string;
  address?: string;
  imageUrl?: string;
  href: string;
};

type ManagedRecommendation = {
  relationId: string;
  createdAt?: string | null;
  sourceCollection: string;
  sourceId: string;
  targetCollection: string;
  targetId: string;
  source: RecommendationParty;
  target: RecommendationParty;
};

type OwnerRecommendations = {
  outgoing: ManagedRecommendation[];
  incoming: ManagedRecommendation[];
};


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

  const [recommendations, setRecommendations] =
    useState<OwnerRecommendations>({
      outgoing: [],
      incoming: [],
    });

  const [
    recommendationsLoading,
    setRecommendationsLoading,
  ] = useState(false);

  const [
    removingRecommendationId,
    setRemovingRecommendationId,
  ] = useState<string | null>(null);

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

  const loadRecommendations =
    useCallback(async () => {
      if (
        !user?.emailVerified ||
        !listing ||
        !isAllowedProCollection(
          collectionName
        ) ||
        !listingId
      ) {
        return;
      }

      setRecommendationsLoading(
        true
      );

      try {
        const idToken =
          await user.getIdToken(true);

        const response = await fetch(
          `/api/pro-recommendations?owner=1&sourceCollection=${encodeURIComponent(
            collectionName
          )}&sourceId=${encodeURIComponent(
            listingId
          )}`,
          {
            method: 'GET',
            headers: {
              'Authorization':
                `Bearer ${idToken}`,
            },
          }
        );

        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload?.error ||
            'Chargement des recommandations impossible.'
          );
        }

        setRecommendations({
          outgoing:
            Array.isArray(
              payload?.outgoing
            )
              ? payload.outgoing
              : [],
          incoming:
            Array.isArray(
              payload?.incoming
            )
              ? payload.incoming
              : [],
        });
      }
      catch (error: any) {
        toast({
          title:
            'Recommandations indisponibles',
          description:
            error?.message ||
            'Impossible de charger les recommandations.',
          variant: 'destructive',
        });
      }
      finally {
        setRecommendationsLoading(
          false
        );
      }
    }, [
      user,
      listing,
      collectionName,
      listingId,
      toast,
    ]);

  useEffect(() => {
    if (!listing) return;

    void loadRecommendations();
  }, [
    listing,
    loadRecommendations,
  ]);

  const removeRecommendation =
    async (
      recommendation:
        ManagedRecommendation
    ) => {
      if (
        !user ||
        removingRecommendationId
      ) {
        return;
      }

      setRemovingRecommendationId(
        recommendation.relationId
      );

      try {
        const idToken =
          await user.getIdToken(true);

        const response = await fetch(
          '/api/pro-recommendations',
          {
            method: 'DELETE',
            headers: {
              'Authorization':
                `Bearer ${idToken}`,
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              relationId:
                recommendation.relationId,
            }),
          }
        );

        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload?.error ||
            'Suppression impossible.'
          );
        }

        toast({
          title:
            'Recommandation supprimée',
          description:
            'La relation a été retirée immédiatement.',
        });

        await loadRecommendations();
      }
      catch (error: any) {
        toast({
          title:
            'Suppression impossible',
          description:
            error?.message ||
            "La recommandation n'a pas pu être supprimée.",
          variant: 'destructive',
        });
      }
      finally {
        setRemovingRecommendationId(
          null
        );
      }
    };

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

          <section className="rounded-[2rem] border-2 border-brand/15 bg-white p-5 shadow-lg sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Handshake className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Recommandations professionnelles
                </h2>
                <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
                  Gérez les professionnels recommandés par votre fiche et les professionnels qui recommandent votre établissement.
                </p>
              </div>
            </div>

            {recommendationsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-brand">
                      Mes recommandations
                    </h3>
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[9px] font-black text-brand">
                      {recommendations.outgoing.length}
                    </span>
                  </div>

                  {recommendations.outgoing.length > 0 ? (
                    <div className="space-y-2">
                      {recommendations.outgoing.map(item => (
                        <div
                          key={item.relationId}
                          className="rounded-2xl border p-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-black">
                                {item.target.title}
                              </p>
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {item.target.category || 'Professionnel moto'}
                              </p>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={Boolean(removingRecommendationId)}
                              onClick={() =>
                                void removeRecommendation(
                                  item
                                )
                              }
                              aria-label={`Retirer ${item.target.title} de mes recommandations`}
                              className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                            >
                              {removingRecommendationId === item.relationId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          <Link
                            href={item.target.href}
                            className="mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-brand"
                          >
                            Voir la fiche
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed p-4 text-center">
                      <p className="text-xs font-bold text-muted-foreground">
                        Aucun professionnel recommandé pour le moment.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-brand">
                      Qui recommande ma fiche
                    </h3>
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[9px] font-black text-brand">
                      {recommendations.incoming.length}
                    </span>
                  </div>

                  {recommendations.incoming.length > 0 ? (
                    <div className="space-y-2">
                      {recommendations.incoming.map(item => (
                        <div
                          key={item.relationId}
                          className="rounded-2xl border p-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-black">
                                {item.source.title}
                              </p>
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {item.source.category || 'Professionnel moto'}
                              </p>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={Boolean(removingRecommendationId)}
                              onClick={() =>
                                void removeRecommendation(
                                  item
                                )
                              }
                              aria-label={`Refuser la recommandation de ${item.source.title}`}
                              className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                            >
                              {removingRecommendationId === item.relationId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          <Link
                            href={item.source.href}
                            className="mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-brand"
                          >
                            Voir la fiche
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed p-4 text-center">
                      <p className="text-xs font-bold text-muted-foreground">
                        Aucun autre professionnel ne recommande cette fiche actuellement.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

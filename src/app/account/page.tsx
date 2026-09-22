'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useAuth, useFirestore, useMemoFirebase, useCollection } from '@/firebase/client';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useDoc } from '@/firebase/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LogOut, ArrowLeft, User, Bike, Palette, Save, X, ShieldCheck, MailWarning, Store, Pencil, ExternalLink, Heart, BookOpen, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getMotorcycleProductImage } from '@/data/motorcycle-product-images';
import { errorEmitter } from '@/firebase/client';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/client';

const badgeColors = [
  { id: 'brand', label: 'Orange Moto', class: 'bg-brand' },
  { id: 'blue', label: 'Bleu Vitesse', class: 'bg-blue-600' },
  { id: 'green', label: 'Vert Kawa', class: 'bg-green-600' },
  { id: 'red', label: 'Rouge Ducati', class: 'bg-red-600' },
  { id: 'purple', label: 'Violet Custom', class: 'bg-purple-600' },
  { id: 'black', label: 'Noir Outlaw', class: 'bg-black' },
];

const profileSchema = z.object({
  pseudo: z.string().min(2, 'Le pseudo doit faire au moins 2 caractères.'),
  motorcycleModel: z.string().optional(),
  badgeColor: z.string().default('brand'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function getMotorcycleMatchTokens(
  value: unknown
): string[] {
  const normalized = String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/([a-z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-z])/g, '$1 $2')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  if (!normalized) {
    return [];
  }

  const ignoredWords = new Set([
    'moto',
    'modele',
    'model',
    'ma',
    'mon',
    'une',
    'la',
    'le'
  ]);

  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .map(token =>
      /^\d+$/.test(token)
        ? String(Number(token))
        : token
    )
    .filter(
      token =>
        !ignoredWords.has(token) &&
        !/^(19|20)\d{2}$/.test(token)
    );
}

function findUniqueMotorcycleSheetMatch(
  value: unknown,
  sheets: any[]
): any | null {
  const inputTokens =
    getMotorcycleMatchTokens(value);

  if (inputTokens.length === 0) {
    return null;
  }

  if (
    inputTokens.length === 1 &&
    (
      /^\d+$/.test(inputTokens[0]) ||
      inputTokens[0].length < 4
    )
  ) {
    return null;
  }

  const matches = (sheets || []).filter(
    sheet => {
      if (
        sheet?.status &&
        sheet.status !== 'published'
      ) {
        return false;
      }

      const aliases =
        Array.isArray(sheet?.aliases)
          ? sheet.aliases.join(' ')
          : '';

      const candidateTokens =
        new Set(
          getMotorcycleMatchTokens(
            [
              sheet?.id,
              sheet?.slug,
              sheet?.brand,
              sheet?.model,
              sheet?.display_title,
              aliases
            ]
              .filter(Boolean)
              .join(' ')
          )
        );

      return inputTokens.every(
        token =>
          candidateTokens.has(token)
      );
    }
  );

  return matches.length === 1
    ? matches[0]
    : null;
}

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ownedListings, setOwnedListings] = useState<any[]>([]);
  const [isLoadingOwnedListings, setIsLoadingOwnedListings] = useState(false);
  const [favoriteProfessionals, setFavoriteProfessionals] = useState<any[]>([]);
  const [isLoadingFavoriteProfessionals, setIsLoadingFavoriteProfessionals] = useState(false);
  const [favoriteMotorcycles, setFavoriteMotorcycles] = useState<any[]>([]);
  const [isLoadingFavoriteMotorcycles, setIsLoadingFavoriteMotorcycles] = useState(false);
  const [favoriteArticles, setFavoriteArticles] = useState<any[]>([]);
  const [isLoadingFavoriteArticles, setIsLoadingFavoriteArticles] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState<
    'garage' | 'favorites' | 'pro' | null
  >(null);

  const callbackUrl = searchParams.get('callbackUrl');

  // Chargement des EXTENSIONS MÉTIER si elles existent
  const proRef = useMemoFirebase(() => (user && firestore) ? doc(firestore, 'professionalProfiles', user.uid) : null, [firestore, user]);
  const { data: proProfile } = useDoc(proRef);

  const stdRef = useMemoFirebase(() => (user && firestore) ? doc(firestore, 'standardProfiles', user.uid) : null, [firestore, user]);
  const { data: stdProfile } = useDoc(stdRef);

  const activeDetailProfile = proProfile || stdProfile;
  const isPro = profile?.role === 'pro' || !!proProfile;

  const publishedMotorcycleSheetsRef =
    useMemoFirebase(
      () =>
        firestore
          ? query(
              collection(
                firestore,
                'motorcycle_sheets'
              ),
              where(
                'status',
                '==',
                'published'
              )
            )
          : null,
      [firestore]
    );

  const {
    data: publishedMotorcycleSheets
  } = useCollection(
    publishedMotorcycleSheetsRef
  );

  const garageMotorcycleMatch =
    findUniqueMotorcycleSheetMatch(
      activeDetailProfile?.motorcycleModel,
      publishedMotorcycleSheets || []
    );

  const garageMotorcycleTitle =
    garageMotorcycleMatch
      ? (
          garageMotorcycleMatch.display_title ||
          garageMotorcycleMatch.model ||
          activeDetailProfile?.motorcycleModel
        )
      : activeDetailProfile?.motorcycleModel;

  const garageMotorcycleHref =
    garageMotorcycleMatch
      ? `/fiches/${
          garageMotorcycleMatch.slug ||
          garageMotorcycleMatch.id
        }`
      : null;

  const garageMotorcycleImage =
    garageMotorcycleMatch
      ? (
          getMotorcycleProductImage({
            modelId:
              garageMotorcycleMatch.id,
            brand:
              garageMotorcycleMatch.brand,
            model:
              garageMotorcycleMatch.model,
            displayTitle:
              garageMotorcycleMatch.display_title,
            slug:
              garageMotorcycleMatch.slug
          }) ||
          garageMotorcycleMatch.imageUrl ||
          garageMotorcycleMatch.image ||
          null
        )
      : null;

  const favoritesRef = useMemoFirebase(
    () =>
      user && firestore
        ? collection(
            firestore,
            'users',
            user.uid,
            'favorites'
          )
        : null,
    [firestore, user]
  );

  const {
    data: favorites
  } = useCollection(favoritesRef);

  const favoriteCounts = {
    motorcycles:
      favorites?.filter(
        (favorite: any) =>
          favorite.type === 'motorcycle'
      ).length || 0,

    professionals:
      favorites?.filter(
        (favorite: any) =>
          favorite.type === 'professional'
      ).length || 0,

    articles:
      favorites?.filter(
        (favorite: any) =>
          favorite.type === 'article'
      ).length || 0
  };

  useEffect(() => {
    if (!firestore) {
      setFavoriteProfessionals([]);
      setIsLoadingFavoriteProfessionals(false);
      return;
    }

    const professionalFavorites =
      (favorites || []).filter(
        (favorite: any) =>
          favorite.type === 'professional'
      );

    if (professionalFavorites.length === 0) {
      setFavoriteProfessionals([]);
      setIsLoadingFavoriteProfessionals(false);
      return;
    }

    let cancelled = false;

    const loadFavoriteProfessionals = async () => {
      setIsLoadingFavoriteProfessionals(true);

      try {
        const allowedCollections = [
          'concessions',
          'associations',
          'relais',
          'creators'
        ];

        const loaded = await Promise.all(
          professionalFavorites.map(
            async (favorite: any) => {
              const targetCollection =
                String(
                  favorite.targetCollection || ''
                );

              const targetId =
                String(
                  favorite.targetId || ''
                );

              if (
                !targetId ||
                !allowedCollections.includes(
                  targetCollection
                )
              ) {
                return null;
              }

              const targetRef = doc(
                firestore,
                targetCollection,
                targetId
              );

              const targetSnap =
                await getDoc(targetRef);

              if (!targetSnap.exists()) {
                return null;
              }

              return {
                id: targetSnap.id,
                collection: targetCollection,
                ...targetSnap.data()
              };
            }
          )
        );

        if (!cancelled) {
          setFavoriteProfessionals(
            loaded.filter(Boolean)
          );
        }
      } catch (error) {
        console.warn(
          'Chargement des professionnels favoris impossible',
          error
        );

        if (!cancelled) {
          setFavoriteProfessionals([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingFavoriteProfessionals(false);
        }
      }
    };

    loadFavoriteProfessionals();

    return () => {
      cancelled = true;
    };
  }, [firestore, favorites]);

  useEffect(() => {
    if (!firestore) {
      setFavoriteMotorcycles([]);
      setIsLoadingFavoriteMotorcycles(false);
      return;
    }

    const motorcycleFavorites =
      (favorites || []).filter(
        (favorite: any) =>
          favorite.type === 'motorcycle'
      );

    if (motorcycleFavorites.length === 0) {
      setFavoriteMotorcycles([]);
      setIsLoadingFavoriteMotorcycles(false);
      return;
    }

    let cancelled = false;

    const loadFavoriteMotorcycles = async () => {
      setIsLoadingFavoriteMotorcycles(true);

      try {
        const loaded = await Promise.all(
          motorcycleFavorites.map(
            async (favorite: any) => {
              const targetId =
                String(
                  favorite.targetId || ''
                );

              if (!targetId) {
                return null;
              }

              const directRef = doc(
                firestore,
                'motorcycle_sheets',
                targetId
              );

              const directSnap =
                await getDoc(directRef);

              if (directSnap.exists()) {
                const data = directSnap.data();

                if (
                  data?.status &&
                  data.status !== 'published'
                ) {
                  return null;
                }

                return {
                  id: directSnap.id,
                  routeId:
                    data?.slug ||
                    directSnap.id,
                  ...data
                };
              }

              const slugSnapshot =
                await getDocs(
                  query(
                    collection(
                      firestore,
                      'motorcycle_sheets'
                    ),
                    where(
                      'slug',
                      '==',
                      targetId
                    )
                  )
                );

              const publishedDoc =
                slugSnapshot.docs.find(
                  item => {
                    const data = item.data();

                    return (
                      !data?.status ||
                      data.status === 'published'
                    );
                  }
                );

              if (!publishedDoc) {
                return null;
              }

              const data = publishedDoc.data();

              return {
                id: publishedDoc.id,
                routeId:
                  data?.slug ||
                  targetId,
                ...data
              };
            }
          )
        );

        if (!cancelled) {
          setFavoriteMotorcycles(
            loaded.filter(Boolean)
          );
        }
      } catch (error) {
        console.warn(
          'Chargement des motos favorites impossible',
          error
        );

        if (!cancelled) {
          setFavoriteMotorcycles([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingFavoriteMotorcycles(false);
        }
      }
    };

    loadFavoriteMotorcycles();

    return () => {
      cancelled = true;
    };
  }, [firestore, favorites]);

  useEffect(() => {
    if (!firestore) {
      setFavoriteArticles([]);
      setIsLoadingFavoriteArticles(false);
      return;
    }

    const articleFavorites =
      (favorites || []).filter(
        (favorite: any) =>
          favorite.type === 'article'
      );

    if (articleFavorites.length === 0) {
      setFavoriteArticles([]);
      setIsLoadingFavoriteArticles(false);
      return;
    }

    let cancelled = false;

    const loadFavoriteArticles = async () => {
      setIsLoadingFavoriteArticles(true);

      try {
        const loaded = await Promise.all(
          articleFavorites.map(
            async (favorite: any) => {
              const targetId =
                String(
                  favorite.targetId || ''
                );

              if (!targetId) {
                return null;
              }

              const targetRef = doc(
                firestore,
                'articles',
                targetId
              );

              const targetSnap =
                await getDoc(targetRef);

              if (!targetSnap.exists()) {
                return null;
              }

              return {
                id: targetSnap.id,
                ...targetSnap.data()
              };
            }
          )
        );

        if (!cancelled) {
          setFavoriteArticles(
            loaded.filter(Boolean)
          );
        }
      } catch (error) {
        console.warn(
          'Chargement des articles favoris impossible',
          error
        );

        if (!cancelled) {
          setFavoriteArticles([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingFavoriteArticles(false);
        }
      }
    };

    loadFavoriteArticles();

    return () => {
      cancelled = true;
    };
  }, [firestore, favorites]);

  useEffect(() => {
    if (!firestore || !user || !isPro) {
      setOwnedListings([]);
      return;
    }

    let cancelled = false;
    const loadOwnedListings = async () => {
      setIsLoadingOwnedListings(true);
      try {
        const collections = ['concessions', 'associations', 'relais', 'creators'];
        const snapshots = await Promise.all(
          collections.map(async collectionName => {
            const snapshot = await getDocs(
              query(collection(firestore, collectionName), where('ownerUid', '==', user.uid))
            );
            return snapshot.docs.map(item => ({
              id: item.id,
              collection: collectionName,
              ...item.data(),
            }));
          })
        );

        if (!cancelled) setOwnedListings(snapshots.flat());
      } catch (error) {
        console.warn('Chargement des fiches du professionnel impossible', error);
        if (!cancelled) setOwnedListings([]);
      } finally {
        if (!cancelled) setIsLoadingOwnedListings(false);
      }
    };

    loadOwnedListings();
    return () => { cancelled = true; };
  }, [firestore, user, isPro]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { pseudo: '', motorcycleModel: '', badgeColor: 'brand', firstName: '', lastName: '', companyName: '' },
  });

  // Guard de vérification email
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push(`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`);
    } else if (user && !user.emailVerified) {
      router.push('/verify-email');
    }
  }, [user, isUserLoading, router, callbackUrl]);

  useEffect(() => {
    if (activeDetailProfile || profile) {
      form.reset({
        pseudo: activeDetailProfile?.pseudo || profile?.displayName || user?.displayName || '',
        motorcycleModel: activeDetailProfile?.motorcycleModel || '',
        badgeColor: activeDetailProfile?.badgeColor || 'brand',
        firstName: proProfile?.firstName || '',
        lastName: proProfile?.lastName || '',
        companyName: proProfile?.companyName || '',
      });
    }
  }, [activeDetailProfile, profile, user, proProfile]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const handleChooseType = async (type: 'user' | 'pro') => {
    if (!user || !firestore) return;

    const userRef = doc(firestore, 'users', user.uid);
    const userData = {
      role: type,
      onboardingComplete: true,
      updatedAt: serverTimestamp()
    };

    updateDoc(userRef, userData).catch(async (err) => {
      if (err.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: userData
        } satisfies SecurityRuleContext));
      }
    });

    const collName = type === 'pro' ? 'professionalProfiles' : 'standardProfiles';
    const profileRef = doc(firestore, collName, user.uid);
    const profileData = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName || 'Motard',
      pseudo: user.displayName || 'Motard',
      badgeColor: 'brand',
      createdAt: serverTimestamp()
    };

    setDoc(profileRef, profileData, { merge: true }).catch(async (err) => {
      if (err.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: profileRef.path,
          operation: 'write',
          requestResourceData: profileData
        } satisfies SecurityRuleContext));
      }
    });

    toast({ title: 'Type de compte défini !', description: 'Bienvenue sur Label Moto.' });
  };

  const onUpdateProfile: SubmitHandler<ProfileFormValues> = async (values) => {
    if (!user || !firestore) return;
    const collectionName = isPro ? 'professionalProfiles' : 'standardProfiles';

    const extRef = doc(firestore, collectionName, user.uid);
    const extData = {
      ...values,
      updatedAt: serverTimestamp()
    };

    updateDoc(extRef, extData).catch(async (err) => {
      if (err.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: extRef.path,
          operation: 'update',
          requestResourceData: extData
        } satisfies SecurityRuleContext));
      }
    });

    const userRef = doc(firestore, 'users', user.uid);
    const userData = {
      displayName: values.pseudo,
      updatedAt: serverTimestamp()
    };

    updateDoc(userRef, userData).catch(async (err) => {
      if (err.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: userData
        } satisfies SecurityRuleContext));
      }
    });

    toast({ title: 'Profil mis à jour !' });
    setIsEditing(false);
  };

  if (isUserLoading || !user) {
    return <div className="flex h-screen w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  const showChoice = profile && !profile.onboardingComplete;
  const selectedColor = badgeColors.find(c => c.id === (isEditing ? form.watch('badgeColor') : activeDetailProfile?.badgeColor)) || badgeColors[0];

  return (
    <div className="min-h-screen bg-muted/20">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} />

      <main className="container mx-auto px-4 py-8 pt-10 sm:pt-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand text-[10px] font-black uppercase tracking-widest transition-colors"><ArrowLeft className="h-4 w-4" /> Accueil</Link>
            {!user.emailVerified && <Badge variant="destructive" className="animate-pulse"><MailWarning className="h-3 w-3 mr-1" /> Email non vérifié</Badge>}
          </div>

          {!showChoice && (
            <nav
              className="mb-6 hidden sm:flex sm:flex-wrap sm:gap-2"
              aria-label="Navigation de l'espace compte"
            >
              <a
                href="#apercu"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 bg-white px-3 py-2.5 text-center text-[9px] font-black uppercase tracking-widest transition-colors hover:border-brand hover:text-brand sm:px-5 sm:text-[10px]"
              >
                Aperçu
              </a>

              <a
                href="#garage"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 bg-white px-3 py-2.5 text-center text-[9px] font-black uppercase tracking-widest transition-colors hover:border-brand hover:text-brand sm:px-5 sm:text-[10px]"
              >
                Mon garage
              </a>

              <a
                href="#favoris"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 bg-white px-3 py-2.5 text-center text-[9px] font-black uppercase tracking-widest transition-colors hover:border-brand hover:text-brand sm:px-5 sm:text-[10px]"
              >
                Mes favoris
              </a>

              {isPro && (
                <a
                  href="#fiches-pro"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 bg-white px-3 py-2.5 text-center text-[9px] font-black uppercase tracking-widest transition-colors hover:border-brand hover:text-brand sm:px-5 sm:text-[10px]"
                >
                  Mes fiches pro
                </a>
              )}
            </nav>
          )}

          {showChoice ? (
            <Card className="border-4 border-brand rounded-[3rem] overflow-hidden shadow-2xl">
              <CardHeader className="bg-brand text-white p-10 text-center">
                <CardTitle className="text-4xl font-black uppercase tracking-tighter mb-2">Bienvenue par ici !</CardTitle>
                <CardDescription className="text-white/80 font-bold text-lg">Choisissez comment vous souhaitez utiliser Label Moto.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8 p-10">
                <Card className="flex flex-col border-2 hover:border-brand transition-all cursor-pointer rounded-[2.5rem] overflow-hidden group shadow-lg" onClick={() => handleChooseType('pro')}>
                  <CardHeader className="p-8 pb-4 text-center">
                    <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"><Palette className="text-brand h-10 w-10" /></div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Professionnel</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 flex-grow text-center"><p className="text-sm text-muted-foreground font-bold leading-relaxed">Référencez votre établissement et gagnez en visibilité.</p></CardContent>
                  <CardFooter className="p-8"><Button variant="outline" className="w-full font-black uppercase text-[10px] h-12 rounded-full border-2">C'est mon métier</Button></CardFooter>
                </Card>
                <Card className="flex flex-col border-2 hover:border-brand transition-all cursor-pointer rounded-[2.5rem] overflow-hidden group shadow-lg" onClick={() => handleChooseType('user')}>
                  <CardHeader className="p-8 pb-4 text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"><Bike className="text-blue-500 h-10 w-10" /></div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Motard</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 flex-grow text-center"><p className="text-sm text-muted-foreground font-bold leading-relaxed">Donnez votre avis et trouvez les meilleurs garages.</p></CardContent>
                  <CardFooter className="p-8"><Button variant="outline" className="w-full font-black uppercase text-[10px] h-12 rounded-full border-2">Je suis un pilote</Button></CardFooter>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <Card id="apercu" className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
              <div className={cn("h-32 transition-colors duration-500", selectedColor.class)} />
              <CardHeader className="relative pt-0 px-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
                  <div className="flex items-end gap-6">
                    <Avatar className="h-32 w-32 border-[6px] border-white shadow-2xl">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback className="text-4xl font-black bg-muted text-brand">{profile?.displayName?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="pb-3">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-black uppercase tracking-tight leading-none">{profile?.displayName || "Motard"}</h2>
                        <Badge className={cn("font-black uppercase text-[9px] tracking-widest text-white border-none px-3 py-1", selectedColor.class)}>
                          {isPro ? 'PRO' : 'PILOTE'}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                        {user?.email} {user.emailVerified && <ShieldCheck className="h-3 w-3 text-green-500" />}
                      </p>
                    </div>
                  </div>
                  {!isEditing && (
                    <div className="flex gap-3 pb-3">
                      <Button variant="outline" size="sm" className="font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-full border-2" onClick={() => setIsEditing(true)}>Modifier profil</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 font-black uppercase text-[10px] tracking-widest h-10 px-4 rounded-full" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Déconnexion</Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className={isEditing ? "pt-10 px-10" : "p-0"}>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onUpdateProfile)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="pseudo" render={({ field }) => (
                            <FormItem>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><User className="h-3.5 w-3.5" /> Pseudo</label>
                              <FormControl><Input placeholder="Votre pseudo" className="font-bold h-12 rounded-xl" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="motorcycleModel" render={({ field }) => (
                            <FormItem>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Bike className="h-3.5 w-3.5" /> Ma Moto</label>
                              <FormControl><Input placeholder="Ex: Yamaha MT-07" className="font-bold h-12 rounded-xl" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="badgeColor" render={({ field }) => (
                            <FormItem>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Palette className="h-3.5 w-3.5" /> Couleur du badge</label>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="font-bold h-12 rounded-xl"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                                <SelectContent className="z-[3000]">
                                  {badgeColors.map(color => (
                                    <SelectItem key={color.id} value={color.id}><div className="flex items-center gap-2"><div className={cn("w-3 h-3 rounded-full", color.class)} /><span className="font-bold text-xs">{color.label}</span></div></SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                        )} />
                      </div>
                      <div className="flex justify-end gap-4 pt-8 border-t border-dashed">
                        <Button variant="ghost" type="button" onClick={() => setIsEditing(false)} className="font-bold px-8 h-12 rounded-full"><X className="h-4 w-4 mr-2" /> Annuler</Button>
                        <Button type="submit" className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-[10px] px-12 h-14 rounded-full shadow-xl"><Save className="h-4 w-4 mr-2" /> Enregistrer</Button>
                      </div>
                    </form>
                  </Form>
                ) : null}
              </CardContent>
            </Card>
          )}

          {!showChoice && (
            <section className="mt-5 sm:mt-8">
              <div className="mb-5 flex flex-col gap-1.5 px-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">
                    Mon espace motard
                  </p>
                  <h2 className="mt-1 text-2xl font-black uppercase tracking-tight md:text-3xl">
                    Tableau de bord
                  </h2>
                </div>

                <p className="max-w-xl text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                  Retrouvez votre garage, vos favoris et vos informations Label Moto au même endroit.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
                <Card
                  id="garage"
                  className="border-none bg-white shadow-xl rounded-[2rem] overflow-hidden"
                >
                  <CardHeader className="border-b bg-muted/20 relative pr-12">
                    <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                      <Bike className="h-5 w-5 text-brand" />
                      Mon garage
                    </CardTitle>

                    <CardDescription
                      className={cn(
                        mobileOpenSection !== 'garage' &&
                          "hidden sm:block"
                      )}
                    >
                      Votre moto principale aujourd'hui, puis toutes vos motos demain.
                    </CardDescription>

                    <button
                      type="button"
                      className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset sm:hidden"
                      aria-label={
                        mobileOpenSection === 'garage'
                          ? 'Fermer Mon garage'
                          : 'Ouvrir Mon garage'
                      }
                      aria-expanded={
                        mobileOpenSection === 'garage'
                      }
                      onClick={() =>
                        setMobileOpenSection(
                          current =>
                            current === 'garage'
                              ? null
                              : 'garage'
                        )
                      }
                    >
                      <span className="sr-only">
                        {
                          mobileOpenSection === 'garage'
                            ? 'Fermer Mon garage'
                            : 'Ouvrir Mon garage'
                        }
                      </span>
                    </button>
                    <ChevronDown
                      className={cn(
                        "pointer-events-none absolute right-5 top-5 z-20 h-5 w-5 text-muted-foreground transition-transform duration-200 sm:hidden",
                        mobileOpenSection === 'garage' &&
                          "rotate-180"
                      )}
                    /></CardHeader>

                  <CardContent className={cn("p-6", mobileOpenSection !== 'garage' && "hidden sm:block")}>
                    {activeDetailProfile?.motorcycleModel ? (
                      garageMotorcycleMatch &&
                      garageMotorcycleHref ? (
                        <Link
                          href={garageMotorcycleHref}
                          className="group flex items-center gap-4 rounded-2xl border-2 p-4 transition-all hover:border-brand/40 hover:bg-brand/[0.02] hover:shadow-md sm:p-5"
                        >
                          <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f8f7f5] sm:h-20 sm:w-24">
                            {garageMotorcycleImage ? (
                              <img
                                src={garageMotorcycleImage}
                                alt={garageMotorcycleTitle || 'Moto'}
                                className="h-full w-full object-contain p-1.5"
                                loading="lazy"
                              />
                            ) : (
                              <Bike className="h-7 w-7 text-brand" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                              Moto principale
                            </p>

                            <p className="mt-1 truncate text-base font-black uppercase tracking-tight sm:text-lg">
                              {garageMotorcycleTitle}
                            </p>

                            <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-brand">
                              Voir la fiche technique
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="hidden font-black uppercase text-[8px] tracking-widest sm:inline-flex"
                            >
                              Actuelle
                            </Badge>

                            <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-brand" />
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-4 rounded-2xl border-2 p-5">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10">
                            <Bike className="h-7 w-7 text-brand" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                              Moto principale
                            </p>
                            <p className="mt-1 truncate text-lg font-black uppercase tracking-tight">
                              {activeDetailProfile.motorcycleModel}
                            </p>
                          </div>

                          <Badge
                            variant="secondary"
                            className="hidden shrink-0 font-black uppercase text-[8px] tracking-widest sm:inline-flex"
                          >
                            Actuelle
                          </Badge>
                        </div>
                      )
                    ) : (
                      <div className="rounded-2xl border-2 border-dashed p-6 text-center">
                        <Bike className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                        <p className="font-black uppercase text-sm">
                          Votre garage est vide
                        </p>
                        <p className="mt-2 mb-4 text-xs text-muted-foreground">
                          Commencez par renseigner votre moto actuelle.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl font-black uppercase text-[9px] tracking-widest"
                          onClick={() => setIsEditing(true)}
                        >
                          Renseigner ma moto
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card
                  id="favoris"
                  className="border-none bg-white shadow-xl rounded-[2rem] overflow-hidden"
                >
                  <CardHeader className="border-b bg-muted/20 relative pr-12">
                    <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                      <Heart className="h-5 w-5 text-brand" />
                      Mes favoris
                    </CardTitle>

                    <CardDescription
                      className={cn(
                        mobileOpenSection !== 'favorites' &&
                          "hidden sm:block"
                      )}
                    >
                      Retrouvez bientôt tout ce que vous souhaitez garder sous la main.
                    </CardDescription>

                    <button
                      type="button"
                      className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset sm:hidden"
                      aria-label={
                        mobileOpenSection === 'favorites'
                          ? 'Fermer Mes favoris'
                          : 'Ouvrir Mes favoris'
                      }
                      aria-expanded={
                        mobileOpenSection === 'favorites'
                      }
                      onClick={() =>
                        setMobileOpenSection(
                          current =>
                            current === 'favorites'
                              ? null
                              : 'favorites'
                        )
                      }
                    >
                      <span className="sr-only">
                        {
                          mobileOpenSection === 'favorites'
                            ? 'Fermer Mes favoris'
                            : 'Ouvrir Mes favoris'
                        }
                      </span>
                    </button>
                    <ChevronDown
                      className={cn(
                        "pointer-events-none absolute right-5 top-5 z-20 h-5 w-5 text-muted-foreground transition-transform duration-200 sm:hidden",
                        mobileOpenSection === 'favorites' &&
                          "rotate-180"
                      )}
                    /></CardHeader>

                  <CardContent className={cn("p-6", mobileOpenSection !== 'favorites' && "hidden sm:block")}>
                    <div className="grid grid-cols-3 gap-3">
                      <a
                        href="#favoris-motos"
                        className="rounded-2xl border-2 p-4 text-center transition-all hover:border-brand hover:bg-brand/5"
                        aria-label="Voir mes motos favorites"
                      >
                        <Bike className="mx-auto h-5 w-5 text-brand" />
                        <p className="mt-3 text-2xl font-black">{favoriteCounts.motorcycles}</p>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Motos
                        </p>
                      </a>

                      <a
                        href="#favoris-pros"
                        className="rounded-2xl border-2 p-4 text-center transition-all hover:border-brand hover:bg-brand/5"
                        aria-label="Voir mes professionnels favoris"
                      >
                        <Store className="mx-auto h-5 w-5 text-brand" />
                        <p className="mt-3 text-2xl font-black">{favoriteCounts.professionals}</p>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Pros
                        </p>
                      </a>

                      <a
                        href="#favoris-articles"
                        className="rounded-2xl border-2 p-4 text-center transition-all hover:border-brand hover:bg-brand/5"
                        aria-label="Voir mes articles favoris"
                      >
                        <BookOpen className="mx-auto h-5 w-5 text-brand" />
                        <p className="mt-3 text-2xl font-black">{favoriteCounts.articles}</p>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Articles
                        </p>
                      </a>
                    </div>

                    <div
                      id="favoris-motos"
                      className="mt-5 border-t pt-5 scroll-mt-28"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          Motos favorites
                        </p>

                        <Badge
                          variant="secondary"
                          className="font-black text-[8px]"
                        >
                          {favoriteCounts.motorcycles}
                        </Badge>
                      </div>

                      {isLoadingFavoriteMotorcycles ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-brand" />
                        </div>
                      ) : favoriteMotorcycles.length > 0 ? (
                        <div className="space-y-3">
                          {favoriteMotorcycles.map(
                            (favorite: any) => {
                              const favoriteHref =
                                `/fiches/${favorite.routeId || favorite.slug || favorite.id}`;

                              const favoriteTitle =
                                favorite.display_title ||
                                favorite.model ||
                                favorite.id;

                              const favoriteMeta =
                                [
                                  favorite.brand,
                                  favorite.year_range
                                ]
                                  .filter(Boolean)
                                  .join(' - ');

                              return (
                                <div
                                  key={favorite.id}
                                  className="flex flex-col gap-3 rounded-2xl border-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-black uppercase">
                                      {favoriteTitle}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                      {favoriteMeta ||
                                        'Fiche technique moto'}
                                    </p>
                                  </div>

                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 rounded-xl font-black uppercase text-[9px] tracking-widest"
                                  >
                                    <Link href={favoriteHref}>
                                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                      Voir la fiche
                                    </Link>
                                  </Button>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border-2 border-dashed p-5 text-center">
                          <Bike className="mx-auto h-6 w-6 text-muted-foreground" />

                          <p className="mt-2 text-xs font-black uppercase">
                            Aucune moto favorite
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      id="favoris-pros"
                      className="mt-5 border-t pt-5 scroll-mt-28"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          Professionnels favoris
                        </p>

                        <Badge
                          variant="secondary"
                          className="font-black text-[8px]"
                        >
                          {favoriteCounts.professionals}
                        </Badge>
                      </div>

                      {isLoadingFavoriteProfessionals ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-brand" />
                        </div>
                      ) : favoriteProfessionals.length > 0 ? (
                        <div className="space-y-3">
                          {favoriteProfessionals.map(
                            (favorite: any) => {
                              const favoriteHref =
                                favorite.collection ===
                                'concessions'
                                  ? `/concessions/${favorite.slug || favorite.id}`
                                  : `/${favorite.collection}/${favorite.id}`;

                              return (
                                <div
                                  key={`${favorite.collection}/${favorite.id}`}
                                  className="flex flex-col gap-3 rounded-2xl border-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-black">
                                      {favorite.title ||
                                        favorite.displayName ||
                                        favorite.id}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                      {favorite.address ||
                                        favorite.city ||
                                        favorite.ville ||
                                        'Adresse non renseignée'}
                                    </p>
                                  </div>

                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 rounded-xl font-black uppercase text-[9px] tracking-widest"
                                  >
                                    <Link href={favoriteHref}>
                                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                      Voir la fiche
                                    </Link>
                                  </Button>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border-2 border-dashed p-5 text-center">
                          <Store className="mx-auto h-6 w-6 text-muted-foreground" />

                          <p className="mt-2 text-xs font-black uppercase">
                            Aucun professionnel favori
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      id="favoris-articles"
                      className="mt-5 border-t pt-5 scroll-mt-28"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          Articles favoris
                        </p>

                        <Badge
                          variant="secondary"
                          className="font-black text-[8px]"
                        >
                          {favoriteCounts.articles}
                        </Badge>
                      </div>

                      {isLoadingFavoriteArticles ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-brand" />
                        </div>
                      ) : favoriteArticles.length > 0 ? (
                        <div className="space-y-3">
                          {favoriteArticles.map(
                            (favorite: any) => {
                              const favoriteTitle =
                                favorite.display_title ||
                                favorite.title ||
                                favorite.id;

                              const favoriteMeta =
                                favorite.category ||
                                favorite.author ||
                                'Guide & conseil';

                              return (
                                <div
                                  key={favorite.id}
                                  className="flex flex-col gap-3 rounded-2xl border-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <p className="line-clamp-2 text-sm font-black">
                                      {favoriteTitle}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                      {favoriteMeta}
                                    </p>
                                  </div>

                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 rounded-xl font-black uppercase text-[9px] tracking-widest"
                                  >
                                    <Link href={`/info/${favorite.id}`}>
                                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                      Voir l'article
                                    </Link>
                                  </Button>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border-2 border-dashed p-5 text-center">
                          <BookOpen className="mx-auto h-6 w-6 text-muted-foreground" />

                          <p className="mt-2 text-xs font-black uppercase">
                            Aucun article favori
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-xs font-medium leading-relaxed text-muted-foreground">
                      Retrouvez ici vos motos, professionnels et articles favoris.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {!showChoice && isPro && (
            <Card id="fiches-pro" className="mt-8 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden mt-3 sm:mt-6">
              <CardHeader className="border-b bg-muted/20 relative pr-12">
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                  <Store className="h-5 w-5 text-brand" /> {ownedListings.length === 1
                        ? 'Ma fiche professionnelle'
                        : 'Mes fiches professionnelles'}
                </CardTitle>
                <CardDescription
                      className={cn(
                        mobileOpenSection !== 'pro' &&
                          "hidden sm:block"
                      )}
                    >Les modifications passent toujours par la validation finale de Label Moto avant publication.</CardDescription>

                    <button
                      type="button"
                      className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset sm:hidden"
                      aria-label={
                        mobileOpenSection === 'pro'
                          ? 'Fermer mes fiches professionnelles'
                          : 'Ouvrir mes fiches professionnelles'
                      }
                      aria-expanded={
                        mobileOpenSection === 'pro'
                      }
                      onClick={() =>
                        setMobileOpenSection(
                          current =>
                            current === 'pro'
                              ? null
                              : 'pro'
                        )
                      }
                    >
                      <span className="sr-only">
                        {
                          mobileOpenSection === 'pro'
                            ? 'Fermer mes fiches professionnelles'
                            : 'Ouvrir mes fiches professionnelles'
                        }
                      </span>
                    </button>
                    <ChevronDown
                      className={cn(
                        "pointer-events-none absolute right-5 top-5 z-20 h-5 w-5 text-muted-foreground transition-transform duration-200 sm:hidden",
                        mobileOpenSection === 'pro' &&
                          "rotate-180"
                      )}
                    /></CardHeader>
              <CardContent className={cn("p-6 space-y-3", mobileOpenSection !== 'pro' && "hidden sm:block")}>
                {isLoadingOwnedListings ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
                ) : ownedListings.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed p-6 text-center">
                    <p className="font-black uppercase text-sm">Aucune fiche rattachée</p>
                    <p className="text-xs text-muted-foreground mt-2 mb-4">Si votre établissement existe déjà sur Label Moto, vous pouvez le revendiquer.</p>
                    <Button asChild className="rounded-xl font-black uppercase text-[10px] tracking-widest">
                      <Link href="/pro/revendiquer">Revendiquer ma fiche</Link>
                    </Button>
                  </div>
                ) : (
                  ownedListings.map(listing => (
                    <div key={`${listing.collection}/${listing.id}`} className="rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-black truncate">{listing.title || listing.displayName || listing.id}</p>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[8px] uppercase">Vérifiée</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">{listing.address || listing.city || listing.ville || 'Adresse non renseignée'}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button asChild variant="outline" size="sm" className="rounded-xl font-black uppercase text-[9px] tracking-widest">
                          <Link href={`/pro/mes-fiches/${encodeURIComponent(listing.collection)}/${encodeURIComponent(listing.id)}`}>
                            <Pencil className="h-3.5 w-3.5 mr-1" /> Modifier ma fiche
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="rounded-xl">
                          <Link href={listing.collection === 'concessions' ? `/concessions/${listing.id}` : `/${listing.collection}/${listing.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AccountPage() {
  return <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><AccountContent /></Suspense>;
}

'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Camera,
  Loader2,
  Send,
} from 'lucide-react';
import UnifiedSiteHeader from '@/components/app/unified-site-header';
import { useUser } from '@/firebase/client';
import { submitCreatorAction } from './actions';

const DEPARTEMENTS = [
  '01 - Ain',
  '02 - Aisne',
  '03 - Allier',
  '04 - Alpes-de-Haute-Provence',
  '05 - Hautes-Alpes',
  '06 - Alpes-Maritimes',
  '07 - Ardèche',
  '08 - Ardennes',
  '09 - Ariège',
  '10 - Aube',
  '11 - Aude',
  '12 - Aveyron',
  '13 - Bouches-du-Rhône',
  '14 - Calvados',
  '15 - Cantal',
  '16 - Charente',
  '17 - Charente-Maritime',
  '18 - Cher',
  '19 - Corrèze',
  '2A - Corse-du-Sud',
  '2B - Haute-Corse',
  '21 - Côte-d’Or',
  '22 - Côtes-d’Armor',
  '23 - Creuse',
  '24 - Dordogne',
  '25 - Doubs',
  '26 - Drôme',
  '27 - Eure',
  '28 - Eure-et-Loir',
  '29 - Finistère',
  '30 - Gard',
  '31 - Haute-Garonne',
  '32 - Gers',
  '33 - Gironde',
  '34 - Hérault',
  '35 - Ille-et-Vilaine',
  '36 - Indre',
  '37 - Indre-et-Loire',
  '38 - Isère',
  '39 - Jura',
  '40 - Landes',
  '41 - Loir-et-Cher',
  '42 - Loire',
  '43 - Haute-Loire',
  '44 - Loire-Atlantique',
  '45 - Loiret',
  '46 - Lot',
  '47 - Lot-et-Garonne',
  '48 - Lozère',
  '49 - Maine-et-Loire',
  '50 - Manche',
  '51 - Marne',
  '52 - Haute-Marne',
  '53 - Mayenne',
  '54 - Meurthe-et-Moselle',
  '55 - Meuse',
  '56 - Morbihan',
  '57 - Moselle',
  '58 - Nièvre',
  '59 - Nord',
  '60 - Oise',
  '61 - Orne',
  '62 - Pas-de-Calais',
  '63 - Puy-de-Dôme',
  '64 - Pyrénées-Atlantiques',
  '65 - Hautes-Pyrénées',
  '66 - Pyrénées-Orientales',
  '67 - Bas-Rhin',
  '68 - Haut-Rhin',
  '69 - Rhône',
  '70 - Haute-Saône',
  '71 - Saône-et-Loire',
  '72 - Sarthe',
  '73 - Savoie',
  '74 - Haute-Savoie',
  '75 - Paris',
  '76 - Seine-Maritime',
  '77 - Seine-et-Marne',
  '78 - Yvelines',
  '79 - Deux-Sèvres',
  '80 - Somme',
  '81 - Tarn',
  '82 - Tarn-et-Garonne',
  '83 - Var',
  '84 - Vaucluse',
  '85 - Vendée',
  '86 - Vienne',
  '87 - Haute-Vienne',
  '88 - Vosges',
  '89 - Yonne',
  '90 - Territoire de Belfort',
  '91 - Essonne',
  '92 - Hauts-de-Seine',
  '93 - Seine-Saint-Denis',
  '94 - Val-de-Marne',
  '95 - Val-d’Oise',
  '971 - Guadeloupe',
  '972 - Martinique',
  '973 - Guyane',
  '974 - La Réunion',
  '976 - Mayotte',
];

function RegisterCreatorContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const [isPending, setIsPending] =
    useState(false);

  const [
    hasPublicLocation,
    setHasPublicLocation,
  ] = useState(false);

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState('');

  const [
    selectedCity,
    setSelectedCity,
  ] = useState('');

  const [
    isCitySuggestionsOpen,
    setIsCitySuggestionsOpen,
  ] = useState(false);

  const [
    communes,
    setCommunes,
  ] = useState<
    Array<{
      code: string;
      nom: string;
    }>
  >([]);

  const [
    isLoadingCommunes,
    setIsLoadingCommunes,
  ] = useState(false);

  const [
    communesError,
    setCommunesError,
  ] = useState('');

  useEffect(() => {
    setSelectedCity('');
    setIsCitySuggestionsOpen(false);
    setCommunes([]);
    setCommunesError('');

    if (!selectedDepartment) {
      setIsLoadingCommunes(false);
      return;
    }

    const controller =
      new AbortController();

    let cancelled = false;

    setIsLoadingCommunes(true);

    void (async () => {
      try {
        const response =
          await fetch(
            'https://geo.api.gouv.fr/departements/' +
              encodeURIComponent(
                selectedDepartment
              ) +
              '/communes?fields=nom,code&format=json',
            {
              signal:
                controller.signal,
            }
          );

        if (!response.ok) {
          throw new Error(
            'HTTP ' +
              response.status
          );
        }

        const json =
          await response.json();

        if (!Array.isArray(json)) {
          throw new Error(
            'Réponse invalide'
          );
        }

        const nextCommunes =
          json
            .filter(
              (
                item: any
              ) =>
                typeof item?.nom ===
                  'string' &&
                typeof item?.code ===
                  'string'
            )
            .map(
              (
                item: any
              ) => ({
                nom:
                  item.nom,
                code:
                  item.code,
              })
            )
            .sort(
              (
                a,
                b
              ) =>
                a.nom.localeCompare(
                  b.nom,
                  'fr'
                )
            );

        if (!cancelled) {
          setCommunes(
            nextCommunes
          );
        }
      }
      catch (error) {
        if (
          !cancelled &&
          !(
            error instanceof
              Error &&
            error.name ===
              'AbortError'
          )
        ) {
          setCommunesError(
            'Impossible de charger les villes pour le moment.'
          );
        }
      }
      finally {
        if (!cancelled) {
          setIsLoadingCommunes(
            false
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    selectedDepartment,
  ]);

  const normalizedCityQuery =
    selectedCity
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toLocaleLowerCase(
        'fr-FR'
      )
      .trim();

  const filteredCommunes =
    communes
      .filter(commune => {
        if (
          !normalizedCityQuery
        ) {
          return true;
        }

        const normalizedName =
          commune.nom
            .normalize('NFD')
            .replace(
              /[\u0300-\u036f]/g,
              ''
            )
            .toLocaleLowerCase(
              'fr-FR'
            );

        return normalizedName
          .includes(
            normalizedCityQuery
          );
      });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsPending(true);

    const formData =
      new FormData(e.currentTarget);

    if (!user?.email) {
      toast({
        title: 'Erreur',
        description:
          'Vous devez être connecté.',
        variant: 'destructive',
      });

      setIsPending(false);
      return;
    }

    if (!user.emailVerified) {
      toast({
        title: 'E-mail non vérifié',
        description: 'Validez votre adresse e-mail avant d’envoyer votre demande.',
        variant: 'destructive',
      });
      router.push('/verify-email?callbackUrl=/creators/register');
      setIsPending(false);
      return;
    }

    formData.set('email', user.email);
    formData.set('idToken', await user.getIdToken(true));

    const result =
      await submitCreatorAction(
        formData
      );

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: result.error,
      });

      setIsPending(false);
      return;
    }

    toast({
      title: 'Demande envoyée !',
      description:
        'Votre profil sera examiné sous 48h.',
    });

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <UnifiedSiteHeader />

      <main className="container mx-auto p-4 sm:p-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <section className="rounded-3xl border bg-white p-8 text-center shadow-sm">
            <Camera className="mx-auto mb-4 h-12 w-12 text-brand opacity-80" />

            <h1 className="mb-2 text-3xl font-black uppercase tracking-tighter text-foreground md:text-4xl">
              Créer mon profil créateur
            </h1>

            <p className="text-base font-medium text-muted-foreground">
              Photographe, vidéaste, créateur de contenu moto — rejoins Label Moto gratuitement.
            </p>
          </section>

          <Card className="overflow-hidden rounded-[2.5rem] border-2 border-brand shadow-xl">
            <CardHeader className="bg-brand p-8 text-white">
              <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                Ton profil
              </CardTitle>

              <CardDescription className="font-bold text-white/80">
                Vérifié par notre équipe avant mise en ligne.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input
                  type="text"
                  name="hp_field"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Nom / pseudo *
                    </label>

                    <Input
                      name="displayName"
                      required
                      placeholder="Ex : Thibaut D."
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Métier *
                    </label>

                    <Input
                      name="creatorType"
                      required
                      placeholder="Ex : Photographe moto"
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Spécialités *
                  </label>

                  <Input
                    name="specialties"
                    required
                    placeholder="Ex : Photo produit, événementiel, reportage"
                    className="h-12 rounded-xl font-bold"
                  />

                  <p className="px-1 text-[10px] text-muted-foreground">
                    Sépare tes spécialités par des virgules.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Ville de base *
                    </label>

                    <div className="relative">
                      <input
                        type="hidden"
                        name="city"
                        value={selectedCity}
                      />

                      <Input
                        id="creator-city-search"
                        required
                        value={selectedCity}
                        onChange={e => {
                          setSelectedCity(
                            e.target.value
                          );

                          setIsCitySuggestionsOpen(
                            true
                          );
                        }}
                        onFocus={() => {
                          if (
                            selectedDepartment &&
                            !isLoadingCommunes
                          ) {
                            setIsCitySuggestionsOpen(
                              true
                            );
                          }
                        }}
                        onBlur={() => {
                          window.setTimeout(
                            () => {
                              setIsCitySuggestionsOpen(
                                false
                              );
                            },
                            120
                          );
                        }}
                        onKeyDown={e => {
                          if (
                            e.key ===
                            'Escape'
                          ) {
                            setIsCitySuggestionsOpen(
                              false
                            );
                          }
                        }}
                        disabled={
                          !selectedDepartment ||
                          isLoadingCommunes
                        }
                        placeholder={
                          !selectedDepartment
                            ? 'Choisis d’abord un département'
                            : isLoadingCommunes
                              ? 'Chargement des villes...'
                              : 'Commence à taper une ville'
                        }
                        autoComplete="new-password"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={
                          isCitySuggestionsOpen
                        }
                        aria-controls="creator-city-suggestions"
                        className="h-12 rounded-xl font-bold"
                      />

                      {isCitySuggestionsOpen &&
                        selectedDepartment &&
                        !isLoadingCommunes && (
                          <div
                            id="creator-city-suggestions"
                            role="listbox"
                            className="absolute left-0 right-0 top-full z-[80] mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-white p-1 shadow-xl"
                          >
                            {filteredCommunes.length >
                            0 ? (
                              filteredCommunes.map(
                                commune => (
                                  <button
                                    key={
                                      commune.code
                                    }
                                    type="button"
                                    role="option"
                                    aria-selected={
                                      selectedCity ===
                                      commune.nom
                                    }
                                    onMouseDown={e =>
                                      e.preventDefault()
                                    }
                                    onClick={() => {
                                      setSelectedCity(
                                        commune.nom
                                      );

                                      setIsCitySuggestionsOpen(
                                        false
                                      );
                                    }}
                                    className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-bold text-foreground transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
                                  >
                                    {
                                      commune.nom
                                    }
                                  </button>
                                )
                              )
                            ) : (
                              <div className="px-3 py-3 text-sm font-semibold text-muted-foreground">
                                Aucune commune trouvée
                              </div>
                            )}
                          </div>
                        )}
                    </div>

                    {communesError && (
                      <p className="px-1 text-xs font-semibold text-destructive">
                        {communesError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Département *
                    </label>

                    <select
                      name="departement"
                      required
                      value={
                        selectedDepartment
                      }
                      onChange={e =>
                        setSelectedDepartment(
                          e.target.value
                        )
                      }
                      className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base font-bold"
                    >
                      <option value="">
                        Choisir un département
                      </option>

                      {DEPARTEMENTS.map(d => (
                        <option
                          key={d}
                          value={
                            d.split(' - ')[0]
                          }
                        >
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Zone d’intervention
                  </label>

                  <Input
                    name="serviceArea"
                    placeholder="Ex : Normandie, France entière"
                    className="h-12 rounded-xl font-bold"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Instagram
                    </label>

                    <Input
                      name="instagramUrl"
                      placeholder="@tonpseudo ou URL"
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Portfolio / site
                    </label>

                    <Input
                      name="website"
                      type="url"
                      placeholder="https://..."
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Facebook
                    </label>

                    <Input
                      name="facebookUrl"
                      type="url"
                      placeholder="https://facebook.com/..."
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Téléphone — facultatif
                    </label>

                    <Input
                      name="phoneNumber"
                      type="tel"
                      placeholder="06..."
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Photo de profil (URL)
                  </label>

                  <Input
                    name="photoUrl"
                    type="url"
                    placeholder="https://..."
                    className="h-12 rounded-xl font-bold"
                  />

                  <p className="px-1 text-[10px] text-muted-foreground">
                    Lien vers ta photo — ou envoie-la à{' '}
                    <strong>
                      contact@labelmoto.fr
                    </strong>{' '}
                    après inscription.
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border bg-muted/25 p-4">
                  <input
                    type="checkbox"
                    name="hasPublicLocation"
                    checked={hasPublicLocation}
                    onChange={e =>
                      setHasPublicLocation(
                        e.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 accent-orange-600"
                  />

                  <div>
                    <p className="text-sm font-black">
                      J’ai un studio / local public
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Active uniquement cette option si les visiteurs peuvent réellement se rendre à cette adresse.
                    </p>
                  </div>
                </label>

                {hasPublicLocation && (
                  <div className="space-y-2">
                    <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Adresse publique du studio / local *
                    </label>

                    <Input
                      name="publicAddress"
                      required
                      placeholder="Ex : 12 rue ..., 14000 Caen"
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    E-mail de contact
                  </label>

                  <div className="flex h-12 items-center rounded-xl border border-input bg-muted/50 px-4">
                    <span className="text-sm font-bold text-muted-foreground">
                      {user?.email}
                    </span>

                    <span className="ml-auto text-[10px] font-black uppercase text-brand">
                      Compte Label Moto
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Bio / présentation
                  </label>

                  <Textarea
                    name="info"
                    placeholder="Présente ton activité, ton univers et les prestations que tu proposes..."
                    className="min-h-[120px] rounded-xl font-bold"
                  />
                </div>

                <div className="border-t border-dashed pt-6">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-14 w-full rounded-full bg-brand text-xs font-black uppercase tracking-widest shadow-xl hover:bg-brand/90"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-5 w-5" />
                    )}

                    Envoyer ma demande
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function RegisterCreatorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      }
    >
      <RegisterCreatorContent />
    </Suspense>
  );
}
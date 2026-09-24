'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Bike,
  BookOpen,
  ExternalLink,
  Heart,
  Loader2,
  Store,
} from 'lucide-react';

import {
  useUser,
} from '@/firebase/client';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

type FavoriteType =
  | 'motorcycle'
  | 'professional'
  | 'article';

type FavoriteFilter =
  | 'all'
  | FavoriteType;

interface FavoriteStatsItem {
  type: FavoriteType;
  targetCollection: string;
  targetId: string;
  title: string;
  count: number;
  lastAddedAt: string | null;
  href: string;
}

interface FavoriteStatsResponse {
  ok: boolean;

  error?: string;

  totals?: {
    total: number;
    motorcycles: number;
    professionals: number;
    articles: number;
    uniqueContents: number;
  };

  items?: FavoriteStatsItem[];
}

function formatDate(
  value: string | null
): string {
  if (!value) {
    return '-';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(date);
}

function typeLabel(
  type: FavoriteType
): string {
  if (
    type === 'motorcycle'
  ) {
    return 'MOTO';
  }

  if (
    type === 'professional'
  ) {
    return 'PRO';
  }

  return 'ARTICLE';
}

export default function AdminFavoritesStats() {
  const {
    user,
  } =
    useUser();

  const [
    data,
    setData,
  ] =
    useState<
      FavoriteStatsResponse | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    filter,
    setFilter,
  ] =
    useState<FavoriteFilter>(
      'all'
    );

  const loadStats =
    async () => {
      if (!user) {
        setData({
          ok: false,
          error:
            'Session administrateur introuvable.',
        });

        setLoading(false);

        return;
      }

      setLoading(true);

      try {
        const idToken =
          await user.getIdToken();

        const response =
          await fetch(
            '/api/admin/favorites-stats',
            {
              headers: {
                Authorization:
                  'Bearer ' +
                  idToken,
              },
              cache:
                'no-store',
            }
          );

        /*
         * Forme volontairement classique :
         * pas de cast TypeScript sur une
         * nouvelle ligne.
         */
        const payload:
          FavoriteStatsResponse =
          await response.json();

        if (
          !response.ok ||
          !payload.ok
        ) {
          throw new Error(
            payload.error ||
            'Erreur API favoris.'
          );
        }

        setData(
          payload
        );
      }
      catch (error) {
        console.error(
          '[ADMIN FAVORITES]',
          error
        );

        setData({
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : 'Impossible de charger les favoris.',
        });
      }
      finally {
        setLoading(false);
      }
    };

  useEffect(
    () => {
      void loadStats();
    },
    [user]
  );

  const items =
    data?.items || [];

  const filteredItems =
    useMemo(
      () =>
        filter === 'all'
          ? items
          : items.filter(
              item =>
                item.type ===
                filter
            ),
      [
        items,
        filter,
      ]
    );

  if (loading) {
    return (
      <section className="rounded-[2rem] border bg-background p-8 shadow-sm">
        <div className="flex min-h-[160px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-brand" />
        </div>
      </section>
    );
  }

  if (
    !data?.ok ||
    !data.totals
  ) {
    return (
      <section className="rounded-[2rem] border bg-background p-8 shadow-sm">
        <p className="font-black uppercase">
          Favoris
        </p>

        <p className="mt-2 text-xs font-bold text-muted-foreground">
          {data?.error ||
            'Statistiques indisponibles.'}
        </p>
      </section>
    );
  }

  const totals =
    data.totals;

  const cards = [
    {
      label:
        'Favoris total',
      value:
        totals.total,
      icon:
        Heart,
    },
    {
      label:
        'Motos',
      value:
        totals.motorcycles,
      icon:
        Bike,
    },
    {
      label:
        'Professionnels',
      value:
        totals.professionals,
      icon:
        Store,
    },
    {
      label:
        'Articles',
      value:
        totals.articles,
      icon:
        BookOpen,
    },
  ];

  const filters:
    Array<{
      value: FavoriteFilter;
      label: string;
    }> = [
      {
        value: 'all',
        label: 'Tous',
      },
      {
        value: 'motorcycle',
        label: 'Motos',
      },
      {
        value: 'professional',
        label: 'Pros',
      },
      {
        value: 'article',
        label: 'Articles',
      },
    ];

  return (
    <section className="space-y-5 rounded-[2rem] border bg-background p-6 shadow-sm md:p-8">

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand">
            Engagement profils
          </p>

          <h3 className="mt-1 text-xl font-black uppercase tracking-tight">
            Favoris
          </h3>

          <p className="mt-1 text-[10px] font-bold text-muted-foreground">
            Contenus sauvegardes par les membres Label Moto.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            void loadStats()
          }
          className="rounded-full text-[9px] font-black uppercase tracking-widest"
        >
          Actualiser
        </Button>

      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        {cards.map(card => {
          const Icon =
            card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border bg-muted/20 p-5"
            >
              <div className="flex items-center justify-between">

                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {card.label}
                </p>

                <Icon className="h-4 w-4 text-brand" />

              </div>

              <p className="mt-3 text-3xl font-black tracking-tight">
                {card.value.toLocaleString(
                  'fr-FR'
                )}
              </p>
            </div>
          );
        })}

      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">

        <div className="flex flex-wrap gap-2">

          {filters.map(item => (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={
                filter ===
                item.value
                  ? 'default'
                  : 'outline'
              }
              onClick={() =>
                setFilter(
                  item.value
                )
              }
              className="rounded-full text-[9px] font-black uppercase tracking-widest"
            >
              {item.label}
            </Button>
          ))}

        </div>

        <p className="text-[9px] font-bold text-muted-foreground">
          {totals.uniqueContents} contenu(s) distinct(s)
        </p>

      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-xs font-black uppercase">
            Aucun favori enregistre
          </p>
        </div>
      ) : (
        <div className="max-h-[560px] overflow-y-auto rounded-2xl border">

          {filteredItems.map(item => (

            <div
              key={
                item.type +
                ':' +
                item.targetCollection +
                ':' +
                item.targetId
              }
              className="flex flex-col gap-4 border-b p-5 last:border-0 md:flex-row md:items-center md:justify-between"
            >

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <Badge
                    variant="outline"
                    className="text-[8px] font-black uppercase"
                  >
                    {typeLabel(
                      item.type
                    )}
                  </Badge>

                  <span className="text-[9px] font-bold text-muted-foreground">
                    Dernier ajout : {formatDate(item.lastAddedAt)}
                  </span>

                </div>

                <p className="mt-2 truncate text-sm font-black uppercase tracking-tight">
                  {item.title}
                </p>

              </div>

              <div className="flex shrink-0 items-center gap-3">

                <Badge
                  variant="brand"
                  className="min-w-[84px] justify-center px-4 text-[9px] font-black uppercase tracking-widest"
                >
                  {item.count} favori{item.count > 1 ? 's' : ''}
                </Badge>

                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={'Ouvrir ' + item.title}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>

              </div>

            </div>

          ))}

        </div>
      )}

    </section>
  );
}
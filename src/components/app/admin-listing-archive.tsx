'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  collection,
  doc,
  getDoc,
  getDocsFromServer,
  query,
  where,
} from 'firebase/firestore';

import {
  ExternalLink,
  Loader2,
  Pencil,
  Search,
} from 'lucide-react';

import {
  useFirebase,
} from '@/firebase/client';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

interface AdminListingArchiveProps {
  onModify: (
    collectionName: string,
    id: string
  ) => void;
}

type ListingOrigin =
  | 'admin'
  | 'form';

interface ListingRow {
  key: string;
  collectionName: string;
  id: string;
  title: string;
  address: string;
  origin: ListingOrigin;
  createdAt: number;
  activityAt: number;
}

interface HistoryEvent {
  targetCollection?: string;
  targetId?: string;
  eventType?: string;
  createdAt?: unknown;
}

const PRO_COLLECTIONS = [
  'concessions',
  'associations',
  'relais',
  'creators',
] as const;

function toMillis(
  value: unknown
): number {
  if (!value) {
    return 0;
  }

  const timestamp =
    value as {
      toMillis?: () => number;
      toDate?: () => Date;
      seconds?: number;
    };

  if (
    typeof timestamp.toMillis ===
    'function'
  ) {
    return timestamp.toMillis();
  }

  if (
    typeof timestamp.toDate ===
    'function'
  ) {
    return timestamp
      .toDate()
      .getTime();
  }

  if (
    typeof timestamp.seconds ===
    'number'
  ) {
    return (
      timestamp.seconds *
      1000
    );
  }

  if (
    value instanceof Date
  ) {
    return value.getTime();
  }

  const parsed =
    new Date(
      String(value)
    ).getTime();

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function formatDate(
  milliseconds: number
): string {
  if (!milliseconds) {
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
  ).format(
    new Date(milliseconds)
  );
}

function makeKey(
  collectionName: string,
  id: string
): string {
  return (
    collectionName +
    '/' +
    id
  );
}

function normalize(
  value: string
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase();
}

export default function AdminListingArchive({
  onModify,
}: AdminListingArchiveProps) {
  const {
    firestore,
  } =
    useFirebase();

  const [
    rows,
    setRows,
  ] =
    useState<ListingRow[]>([]);

  const [
    search,
    setSearch,
  ] =
    useState('');

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState('');

  const [
    historyAvailable,
    setHistoryAvailable,
  ] =
    useState(true);

  useEffect(() => {
    if (!firestore) {
      return;
    }

    let cancelled = false;

    const load =
      async () => {
        setLoading(true);
        setError('');
        setHistoryAvailable(true);

        try {
          /*
           * -----------------------------------------
           * 1. CREATIONS MANUELLES
           * -----------------------------------------
           *
           * Requetes indexees et ciblees :
           * createdViaAdmin == true
           *
           * Aucun chargement global des collections.
           */

          const manualSnapshots =
            await Promise.all(
              PRO_COLLECTIONS.map(
                collectionName =>
                  getDocsFromServer(
                    query(
                      collection(
                        firestore,
                        collectionName
                      ),
                      where(
                        'createdViaAdmin',
                        '==',
                        true
                      )
                    )
                  )
              )
            );

          if (cancelled) {
            return;
          }

          const byKey =
            new Map<
              string,
              ListingRow
            >();

          manualSnapshots.forEach(
            (
              snapshot,
              index
            ) => {
              const collectionName =
                PRO_COLLECTIONS[index];

              snapshot.docs.forEach(
                snapshotDoc => {
                  const data:
                    any =
                    snapshotDoc.data();

                  const createdAt =
                    toMillis(
                      data.publishedAt
                    ) ||
                    toMillis(
                      data.timestamp
                    );

                  const key =
                    makeKey(
                      collectionName,
                      snapshotDoc.id
                    );

                  byKey.set(
                    key,
                    {
                      key,
                      collectionName,
                      id:
                        snapshotDoc.id,
                      title:
                        String(
                          data.title ||
                          snapshotDoc.id
                        ),
                      address:
                        String(
                          data.address ||
                          ''
                        ),
                      origin:
                        'admin',
                      createdAt,
                      activityAt:
                        createdAt,
                    }
                  );
                }
              );
            }
          );

          /*
           * -----------------------------------------
           * 2. FICHES CREEES VIA DEMANDE
           * -----------------------------------------
           *
           * On ne prend que les demandes PUBLIEES.
           * Une demande rejetee n'est pas une fiche.
           */

          const submissionsSnapshot =
            await getDocsFromServer(
              query(
                collection(
                  firestore,
                  'listing_submissions'
                ),
                where(
                  'status',
                  '==',
                  'published'
                )
              )
            );

          const publishedTargets =
            submissionsSnapshot.docs
              .map(snapshotDoc => {
                const data:
                  any =
                  snapshotDoc.data();

                const collectionName =
                  typeof data.publishedCollection ===
                    'string'
                    ? data.publishedCollection
                    : '';

                const id =
                  typeof data.publishedDocId ===
                    'string'
                    ? data.publishedDocId
                    : '';

                if (
                  !PRO_COLLECTIONS.includes(
                    collectionName as
                      typeof PRO_COLLECTIONS[number]
                  ) ||
                  !id
                ) {
                  return null;
                }

                return {
                  collectionName,
                  id,
                  submission:
                    data,
                };
              })
              .filter(
                (
                  item
                ): item is {
                  collectionName:
                    typeof PRO_COLLECTIONS[number];
                  id: string;
                  submission: any;
                } =>
                  Boolean(item)
              );

          const currentPublished =
            await Promise.all(
              publishedTargets.map(
                async item => {
                  const snapshot =
                    await getDoc(
                      doc(
                        firestore,
                        item.collectionName,
                        item.id
                      )
                    );

                  if (
                    !snapshot.exists()
                  ) {
                    return null;
                  }

                  const data:
                    any =
                    snapshot.data();

                  const createdAt =
                    toMillis(
                      item.submission.publishedAt
                    ) ||
                    toMillis(
                      item.submission.reviewedAt
                    ) ||
                    toMillis(
                      item.submission.updatedAt
                    ) ||
                    toMillis(
                      item.submission.createdAt
                    );

                  return {
                    key:
                      makeKey(
                        item.collectionName,
                        item.id
                      ),
                    collectionName:
                      item.collectionName,
                    id:
                      item.id,
                    title:
                      String(
                        data.title ||
                        item.submission.businessName ||
                        item.id
                      ),
                    address:
                      String(
                        data.address ||
                        item.submission.addressRaw ||
                        ''
                      ),
                    origin:
                      'form' as const,
                    createdAt,
                    activityAt:
                      createdAt,
                  };
                }
              )
            );

          for (
            const row
            of currentPublished
          ) {
            if (!row) {
              continue;
            }

            const existing =
              byKey.get(
                row.key
              );

            /*
             * Si une fiche a d'abord ete creee
             * manuellement puis a fait l'objet
             * d'une demande, on conserve l'origine
             * ADMIN de la creation.
             */
            if (!existing) {
              byKey.set(
                row.key,
                row
              );
              continue;
            }

            byKey.set(
              row.key,
              {
                ...row,
                origin:
                  existing.origin,
                createdAt:
                  existing.createdAt ||
                  row.createdAt,
                activityAt:
                  Math.max(
                    existing.activityAt,
                    row.activityAt
                  ),
              }
            );
          }

          /*
           * -----------------------------------------
           * 3. DERNIERES MISES A JOUR
           * -----------------------------------------
           */

          try {
            const historySnapshot =
              await getDocsFromServer(
                query(
                  collection(
                    firestore,
                    'listing_history'
                  ),
                  where(
                    'eventType',
                    'in',
                    [
                      'admin_direct_update',
                      'submission_update_published',
                    ]
                  )
                )
              );

            for (
              const snapshotDoc
              of historySnapshot.docs
            ) {
              const event:
                HistoryEvent =
                snapshotDoc.data();

              if (
                !event.targetCollection ||
                !event.targetId
              ) {
                continue;
              }

              const key =
                makeKey(
                  event.targetCollection,
                  event.targetId
                );

              const row =
                byKey.get(
                  key
                );

              /*
               * Tres important :
               * une update ne cree jamais une
               * nouvelle entree.
               *
               * Donc modifier une ancienne fiche
               * importee ne la fait pas apparaitre.
               */
              if (!row) {
                continue;
              }

              const updatedAt =
                toMillis(
                  event.createdAt
                );

              if (
                updatedAt >
                row.activityAt
              ) {
                byKey.set(
                  key,
                  {
                    ...row,
                    activityAt:
                      updatedAt,
                  }
                );
              }
            }
          }
          catch (
            historyError
          ) {
            console.warn(
              '[LabelMoto] Historique de mise a jour indisponible',
              historyError
            );

            setHistoryAvailable(
              false
            );
          }

          if (!cancelled) {
            setRows(
              Array.from(
                byKey.values()
              ).sort(
                (
                  a,
                  b
                ) =>
                  b.activityAt -
                  a.activityAt
              )
            );
          }
        }
        catch (
          loadError
        ) {
          console.error(
            '[LabelMoto] Erreur listing admin',
            loadError
          );

          if (!cancelled) {
            setRows([]);

            setError(
              'Impossible de charger la liste des fiches.'
            );
          }
        }
        finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void load();

    return () => {
      cancelled = true;
    };
  }, [firestore]);

  const filteredRows =
    useMemo(
      () => {
        const term =
          normalize(
            search.trim()
          );

        if (!term) {
          return rows;
        }

        return rows.filter(
          row =>
            normalize(
              row.title
            ).includes(term) ||
            normalize(
              row.address
            ).includes(term) ||
            normalize(
              row.collectionName
            ).includes(term) ||
            normalize(
              row.origin
            ).includes(term)
        );
      },
      [
        rows,
        search,
      ]
    );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border-2 border-dashed p-12 text-center">
        <p className="font-black uppercase text-sm">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {!historyAvailable && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800">
          Historique des mises a jour temporairement indisponible.
          Les fiches creees restent visibles.
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={
            event =>
              setSearch(
                event.target.value
              )
          }
          placeholder="Rechercher une fiche par nom ou adresse..."
          className="h-12 rounded-2xl border-2 pl-11 font-bold"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {filteredRows.length} fiche(s)
        </p>

        <p className="text-[9px] font-bold text-muted-foreground">
          Creations admin + demandes publiees
        </p>
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-[2rem] border-2 border-dashed p-12 text-center">
          <p className="font-black uppercase text-sm">
            Aucune fiche trouvee
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border bg-background shadow-sm">

          {filteredRows.map(
            row => {
              const wasUpdated =
                row.activityAt >
                row.createdAt;

              const href =
                '/' +
                row.collectionName +
                '/' +
                row.id;

              return (
                <div
                  key={row.key}
                  className="group flex flex-col gap-4 border-b p-6 transition-colors last:border-0 hover:bg-muted/30 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 space-y-2">

                    <p className="font-black text-base uppercase tracking-tight">
                      {row.title}
                    </p>

                    {row.address && (
                      <p className="text-[10px] font-bold text-muted-foreground">
                        {row.address}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">

                      <Badge
                        variant="outline"
                        className="text-[8px] font-black uppercase"
                      >
                        {row.collectionName}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="text-[8px] font-black uppercase"
                      >
                        {row.origin === 'admin'
                          ? 'ADMIN'
                          : 'FORMULAIRE'}
                      </Badge>

                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-bold text-muted-foreground">

                      <span>
                        Creee : {formatDate(row.createdAt)}
                      </span>

                      {wasUpdated && (
                        <span className="font-black text-foreground">
                          Mise a jour : {formatDate(row.activityAt)}
                        </span>
                      )}

                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">

                    <Badge
                      variant="brand"
                      className="px-4 text-[9px] font-black uppercase tracking-widest"
                    >
                      PUBLISHED
                    </Badge>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full text-[9px] font-black uppercase tracking-widest"
                      onClick={() =>
                        onModify(
                          row.collectionName,
                          row.id
                        )
                      }
                    >
                      <Pencil className="mr-2 h-3 w-3" />
                      Modifier
                    </Button>

                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={'Ouvrir ' + row.title}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>

                  </div>
                </div>
              );
            }
          )}

        </div>
      )}
    </div>
  );
}

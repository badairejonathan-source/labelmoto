'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase/client';
import {
  collection,
  doc,
  getAggregateFromServer,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  sum,
  where,
} from 'firebase/firestore';
import {
  BarChart3,
  CalendarDays,
  Download,
  Eye,
  ExternalLink,
  Globe,
  Instagram,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PRO_COLLECTIONS = [
  'concessions',
  'associations',
  'relais',
  'creators',
] as const;

type ProCollection =
  (typeof PRO_COLLECTIONS)[number];

type StatsView =
  | 'current'
  | 'top'
  | 'monthly';

type TopPeriod =
  | 'history'
  | 'month';

interface GlobalStats {
  fiches: number;
  tel: number;
  web: number;
  instagram: number;
  facebook: number;
  itineraire: number;
  vues: number;
}

interface TopPro {
  id: string;
  collection: string;
  title: string;
  departement: string;
  vues: number;
  tel: number;
  web: number;
  instagram: number;
  facebook: number;
  itineraire: number;
}

interface MonthlyReport {
  id: string;
  month: string;
  visitors?: number;
  sessions?: number;
  pageviews?: number;
  stats_vues: number;
  stats_tel: number;
  stats_web: number;
  stats_instagram: number;
  stats_facebook: number;
  stats_itineraire: number;
}

function currentParisMonth(): string {
  const parts =
    new Intl.DateTimeFormat(
      'fr-FR',
      {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
      }
    ).formatToParts(new Date());

  const year =
    parts.find(
      part => part.type === 'year'
    )?.value;

  const month =
    parts.find(
      part => part.type === 'month'
    )?.value;

  if (!year || !month) {
    return new Date()
      .toISOString()
      .slice(0, 7);
  }

  return `${year}-${month}`;
}

function formatMonthLabel(
  monthKey: string
): string {
  const [year, month] =
    monthKey.split('-');

  if (!year || !month) {
    return monthKey;
  }

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      1
    );

  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      month: 'long',
      year: 'numeric',
    }
  ).format(date);
}

function proHref(
  collectionName: string,
  id: string
): string {
  switch (collectionName) {
    case 'associations':
      return `/associations/${id}`;

    case 'relais':
      return `/relais/${id}`;

    case 'creators':
      return `/creators/${id}`;

    default:
      return `/concessions/${id}`;
  }
}

export default function AdminStats() {
  const { firestore } =
    useFirebase();

  const [view, setView] =
    useState<StatsView>('current');

  const [globalStats, setGlobalStats] =
    useState<GlobalStats | null>(null);

  const [globalLoading, setGlobalLoading] =
    useState(false);

  const [topLoading, setTopLoading] =
    useState(false);

  const [topPros, setTopPros] =
    useState<TopPro[]>([]);

  const [topPeriod, setTopPeriod] =
    useState<TopPeriod>('history');

  const [monthKey, setMonthKey] =
    useState(currentParisMonth());

  const [departmentInput, setDepartmentInput] =
    useState('');

  const [department, setDepartment] =
    useState('');

  const [reports, setReports] =
    useState<MonthlyReport[]>([]);

  const [reportsLoading, setReportsLoading] =
    useState(false);
  const [reportMonth, setReportMonth] =
    useState(currentParisMonth());

  const [reportVisitors, setReportVisitors] =
    useState('');

  const [reportSessions, setReportSessions] =
    useState('');

  const [reportPageviews, setReportPageviews] =
    useState('');

  const [reportSaving, setReportSaving] =
    useState(false);

  const [exportingMonth, setExportingMonth] =
    useState<string | null>(null);

  const loadGlobalStats =
    async () => {
      if (!firestore) return;

      setGlobalLoading(true);

      try {
        const results =
          await Promise.all(
            PRO_COLLECTIONS.map(
              async collectionName => {
                const ref =
                  collection(
                    firestore,
                    collectionName
                  );

                const [
                  countSnapshot,
                  telSnapshot,
                  webSnapshot,
                  instagramSnapshot,
                  facebookSnapshot,
                  itineraireSnapshot,
                  vuesSnapshot,
                ] = await Promise.all([
                  getCountFromServer(ref),

                  getAggregateFromServer(
                    ref,
                    {
                      tel:
                        sum('stats_tel'),
                    }
                  ),

                  getAggregateFromServer(
                    ref,
                    {
                      web:
                        sum('stats_web'),
                    }
                  ),

                  getAggregateFromServer(
                    ref,
                    {
                      instagram:
                        sum(
                          'stats_instagram'
                        ),
                    }
                  ),

                  getAggregateFromServer(
                    ref,
                    {
                      facebook:
                        sum(
                          'stats_facebook'
                        ),
                    }
                  ),

                  getAggregateFromServer(
                    ref,
                    {
                      itineraire:
                        sum(
                          'stats_itineraire'
                        ),
                    }
                  ),

                  getAggregateFromServer(
                    ref,
                    {
                      vues:
                        sum('stats_vues'),
                    }
                  ),
                ]);

                return {
                  fiches:
                    countSnapshot
                      .data()
                      .count,

                  tel:
                    Number(
                      telSnapshot
                        .data()
                        .tel || 0
                    ),

                  web:
                    Number(
                      webSnapshot
                        .data()
                        .web || 0
                    ),

                  instagram:
                    Number(
                      instagramSnapshot
                        .data()
                        .instagram || 0
                    ),

                  facebook:
                    Number(
                      facebookSnapshot
                        .data()
                        .facebook || 0
                    ),

                  itineraire:
                    Number(
                      itineraireSnapshot
                        .data()
                        .itineraire || 0
                    ),

                  vues:
                    Number(
                      vuesSnapshot
                        .data()
                        .vues || 0
                    ),
                };
              }
            )
          );

        const totals =
          results.reduce<GlobalStats>(
            (acc, item) => ({
              fiches:
                acc.fiches +
                item.fiches,

              tel:
                acc.tel +
                item.tel,

              web:
                acc.web +
                item.web,

              instagram:
                acc.instagram +
                item.instagram,

              facebook:
                acc.facebook +
                item.facebook,

              itineraire:
                acc.itineraire +
                item.itineraire,

              vues:
                acc.vues +
                item.vues,
            }),
            {
              fiches: 0,
              tel: 0,
              web: 0,
              instagram: 0,
              facebook: 0,
              itineraire: 0,
              vues: 0,
            }
          );

        setGlobalStats(totals);
      } catch (error) {
        console.error(
          'Erreur statistiques globales:',
          error
        );

        setGlobalStats(null);
      } finally {
        setGlobalLoading(false);
      }
    };

  const loadHistoricalTop =
    async (): Promise<TopPro[]> => {
      if (!firestore) {
        return [];
      }

      const dept =
        department.trim();

      const snapshots =
        await Promise.all(
          PRO_COLLECTIONS.map(
            async collectionName => {
              const ref =
                collection(
                  firestore,
                  collectionName
                );

              const q =
                dept
                  ? query(
                      ref,
                      where(
                        'departement',
                        '==',
                        dept
                      )
                    )
                  : query(
                      ref,
                      where(
                        'stats_vues',
                        '>',
                        0
                      ),
                      orderBy(
                        'stats_vues',
                        'desc'
                      ),
                      limit(50)
                    );

              const snapshot =
                await getDocs(q);

              return snapshot.docs.map(
                document => {
                  const data =
                    document.data();

                  return {
                    id: document.id,
                    collection:
                      collectionName,
                    title:
                      String(
                        data.title ||
                        data.name ||
                        document.id
                      ),
                    departement:
                      String(
                        data.departement ||
                        ''
                      ),
                    vues:
                      Number(
                        data.stats_vues ||
                        0
                      ),
                    tel:
                      Number(
                        data.stats_tel ||
                        0
                      ),
                    web:
                      Number(
                        data.stats_web ||
                        0
                      ),
                    instagram:
                      Number(
                        data.stats_instagram ||
                        0
                      ),
                    facebook:
                      Number(
                        data.stats_facebook ||
                        0
                      ),

                    itineraire:
                      Number(
                        data.stats_itineraire ||
                        0
                      ),
                  } satisfies TopPro;
                }
              );
            }
          )
        );

      return snapshots
        .flat()
        .sort(
          (a, b) =>
            b.vues - a.vues
        )
        .slice(0, 50);
    };

  const loadMonthlyTop =
    async (): Promise<TopPro[]> => {
      if (!firestore) {
        return [];
      }

      const ref =
        collection(
          firestore,
          'pro_stats_monthly',
          monthKey,
          'pros'
        );

      const dept =
        department.trim();

      const q =
        dept
          ? query(
              ref,
              where(
                'departement',
                '==',
                dept
              )
            )
          : query(
              ref,
              where(
                'stats_vues',
                '>',
                0
              ),
              orderBy(
                'stats_vues',
                'desc'
              ),
              limit(50)
            );

      const snapshot =
        await getDocs(q);

      return snapshot.docs
        .map(document => {
          const data =
            document.data();

          return {
            id:
              String(
                data.proId ||
                document.id
              ),

            collection:
              String(
                data.collection ||
                'concessions'
              ),

            title:
              String(
                data.title ||
                data.proId ||
                document.id
              ),

            departement:
              String(
                data.departement ||
                ''
              ),

            vues:
              Number(
                data.stats_vues ||
                0
              ),

            tel:
              Number(
                data.stats_tel ||
                0
              ),

            web:
              Number(
                data.stats_web ||
                0
              ),

            instagram:
              Number(
                data.stats_instagram ||
                0
              ),

            facebook:
              Number(
                data.stats_facebook ||
                0
              ),

            itineraire:
              Number(
                data.stats_itineraire ||
                0
              ),
          } satisfies TopPro;
        })
        .sort(
          (a, b) =>
            b.vues - a.vues
        )
        .slice(0, 50);
    };

  const loadTop =
    async () => {
      if (!firestore) return;

      setTopLoading(true);

      try {
        const rows =
          topPeriod === 'month'
            ? await loadMonthlyTop()
            : await loadHistoricalTop();

        setTopPros(rows);
      } catch (error) {
        console.error(
          'Erreur Top 50:',
          error
        );

        setTopPros([]);
      } finally {
        setTopLoading(false);
      }
    };

  const loadMonthlyReports =
    async () => {
      if (!firestore) return;

      setReportsLoading(true);

      try {
        const snapshot =
          await getDocs(
            query(
              collection(
                firestore,
                'monthly_reports'
              ),
              orderBy(
                'month',
                'desc'
              ),
              limit(24)
            )
          );

        const rows =
          snapshot.docs.map(
            document => {
              const data =
                document.data();

              return {
                id: document.id,

                month:
                  String(
                    data.month ||
                    document.id
                  ),

                visitors:
                  data.visitors != null
                    ? Number(
                        data.visitors
                      )
                    : undefined,

                sessions:
                  data.sessions != null
                    ? Number(
                        data.sessions
                      )
                    : undefined,

                pageviews:
                  data.pageviews != null
                    ? Number(
                        data.pageviews
                      )
                    : undefined,

                stats_vues:
                  Number(
                    data.stats_vues ||
                    0
                  ),

                stats_tel:
                  Number(
                    data.stats_tel ||
                    0
                  ),

                stats_web:
                  Number(
                    data.stats_web ||
                    0
                  ),

                stats_instagram:
                  Number(
                    data.stats_instagram ||
                    0
                  ),

                stats_facebook:
                  Number(
                    data.stats_facebook ||
                    0
                  ),

                stats_itineraire:
                  Number(
                    data.stats_itineraire ||
                    0
                  ),
              } satisfies MonthlyReport;
            }
          );

        setReports(rows);
      } catch (error) {
        console.error(
          'Erreur rapports mensuels:',
          error
        );

        setReports([]);
      } finally {
        setReportsLoading(false);
      }
    };

    const saveMonthlyReport =
    async () => {
      if (!firestore) return;

      const visitors =
        Number(reportVisitors);

      const sessions =
        Number(reportSessions);

      const pageviews =
        Number(reportPageviews);

      if (
        !reportMonth ||
        !Number.isFinite(visitors) ||
        !Number.isFinite(sessions) ||
        !Number.isFinite(pageviews) ||
        visitors < 0 ||
        sessions < 0 ||
        pageviews < 0
      ) {
        window.alert(
          'Renseigne un mois et trois nombres valides.'
        );

        return;
      }

      setReportSaving(true);

      try {
        await setDoc(
          doc(
            firestore,
            'monthly_reports',
            reportMonth
          ),
          {
            month: reportMonth,
            visitors:
              Math.round(visitors),
            sessions:
              Math.round(sessions),
            pageviews:
              Math.round(pageviews),
            manualTrafficUpdatedAt:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        await loadMonthlyReports();

        window.alert(
          `Rapport ${formatMonthLabel(reportMonth)} enregistré.`
        );
      } catch (error) {
        console.error(
          'Erreur enregistrement rapport:',
          error
        );

        window.alert(
          'Impossible d’enregistrer le rapport.'
        );
      } finally {
        setReportSaving(false);
      }
    };

  const loadTop10ForMonth =
    async (
      targetMonth: string
    ): Promise<TopPro[]> => {
      if (!firestore) {
        return [];
      }

      try {
        const snapshot =
          await getDocs(
            query(
              collection(
                firestore,
                'pro_stats_monthly',
                targetMonth,
                'pros'
              ),
              where(
                'stats_vues',
                '>',
                0
              ),
              orderBy(
                'stats_vues',
                'desc'
              ),
              limit(10)
            )
          );

        return snapshot.docs.map(
          document => {
            const data =
              document.data();

            return {
              id:
                String(
                  data.proId ||
                  document.id
                ),

              collection:
                String(
                  data.collection ||
                  'concessions'
                ),

              title:
                String(
                  data.title ||
                  data.proId ||
                  document.id
                ),

              departement:
                String(
                  data.departement ||
                  ''
                ),

              vues:
                Number(
                  data.stats_vues ||
                  0
                ),

              tel:
                Number(
                  data.stats_tel ||
                  0
                ),

              web:
                Number(
                  data.stats_web ||
                  0
                ),

              instagram:
                Number(
                  data.stats_instagram ||
                  0
                ),

              facebook:
                Number(
                  data.stats_facebook ||
                  0
                ),

              itineraire:
                Number(
                  data.stats_itineraire ||
                  0
                ),
            } satisfies TopPro;
          }
        );
      } catch (error) {
        console.error(
          'Erreur Top 10 mensuel:',
          error
        );

        return [];
      }
    };

  const exportMonthlyReport =
    async (
      report: MonthlyReport
    ) => {
      setExportingMonth(
        report.month
      );

      try {
        const top10 =
          await loadTop10ForMonth(
            report.month
          );

        const width = 1080;
        const height = 1350;

        const canvas =
          document.createElement(
            'canvas'
          );

        canvas.width = width;
        canvas.height = height;

        const ctx =
          canvas.getContext('2d');

        if (!ctx) {
          throw new Error(
            'Canvas indisponible.'
          );
        }

        const orange =
          '#df5b00';

        const navy =
          '#0b2946';

        const black =
          '#111111';

        const gray =
          '#6b7280';

        const light =
          '#f5f6f7';

        ctx.fillStyle =
          '#ffffff';

        ctx.fillRect(
          0,
          0,
          width,
          height
        );

        ctx.fillStyle =
          orange;

        ctx.fillRect(
          0,
          0,
          width,
          18
        );

        ctx.fillStyle =
          black;

        ctx.font =
          '900 54px Arial';

        ctx.fillText(
          'LABEL MOTO',
          70,
          105
        );

        ctx.fillStyle =
          orange;

        ctx.fillRect(
          70,
          125,
          260,
          7
        );

        ctx.fillStyle =
          gray;

        ctx.font =
          '700 22px Arial';

        ctx.fillText(
          'RAPPORT MENSUEL',
          70,
          185
        );

        ctx.fillStyle =
          black;

        ctx.font =
          '900 42px Arial';

        ctx.fillText(
          formatMonthLabel(
            report.month
          ).toUpperCase(),
          70,
          240
        );

        const metrics = [
          [
            'VISITEURS',
            report.visitors,
          ],
          [
            'SESSIONS',
            report.sessions,
          ],
          [
            'PAGES VUES',
            report.pageviews,
          ],
          [
            'FICHES VUES',
            report.stats_vues,
          ],
          [
            'TÉLÉPHONE',
            report.stats_tel,
          ],
          [
            'SITE WEB',
            report.stats_web,
          ],
          [
            'ITINÉRAIRES',
            report.stats_itineraire,
          ],
          [
            'INSTAGRAM',
            report.stats_instagram,
          ],
          [
            'FACEBOOK',
            report.stats_facebook,
          ],
        ] as const;

        const cardWidth =
          172;

        const cardHeight =
          125;

        const cardGap =
          20;

        metrics.forEach(
          (
            [label, value],
            index
          ) => {
            const col =
              index % 5;

            const row =
              Math.floor(
                index / 5
              );

            const x =
              70 +
              col *
                (
                  cardWidth +
                  cardGap
                );

            const y =
              300 +
              row *
                (
                  cardHeight +
                  cardGap
                );

            ctx.fillStyle =
              light;

            ctx.fillRect(
              x,
              y,
              cardWidth,
              cardHeight
            );

            ctx.fillStyle =
              gray;

            ctx.font =
              '800 16px Arial';

            ctx.fillText(
              label,
              x + 18,
              y + 34
            );

            ctx.fillStyle =
              index === 0
                ? orange
                : black;

            ctx.font =
              '900 34px Arial';

            ctx.fillText(
              value == null
                ? '—'
                : Number(
                    value
                  ).toLocaleString(
                    'fr-FR'
                  ),
              x + 18,
              y + 85
            );
          }
        );

        const interactions =
          report.stats_tel +
          report.stats_web +
          report.stats_itineraire +
          report.stats_instagram +
          report.stats_facebook;

        ctx.fillStyle =
          navy;

        ctx.fillRect(
          70,
          590,
          940,
          105
        );

        ctx.fillStyle =
          '#ffffff';

        ctx.font =
          '800 18px Arial';

        ctx.fillText(
          'INTERACTIONS PROFESSIONNELLES',
          100,
          630
        );

        ctx.font =
          '900 38px Arial';

        ctx.fillText(
          interactions.toLocaleString(
            'fr-FR'
          ),
          100,
          675
        );

        ctx.fillStyle =
          black;

        ctx.font =
          '900 27px Arial';

        ctx.fillText(
          'TOP 10 DES FICHES LES PLUS VUES',
          70,
          770
        );

        ctx.fillStyle =
          gray;

        ctx.font =
          '600 16px Arial';

        ctx.fillText(
          'Classement du mois',
          70,
          802
        );

        if (
          top10.length === 0
        ) {
          ctx.fillStyle =
            gray;

          ctx.font =
            '700 20px Arial';

          ctx.fillText(
            'Aucune vue de fiche enregistrée pour ce mois.',
            70,
            865
          );
        }
        else {
          top10.forEach(
            (pro, index) => {
              const y =
                855 +
                index * 42;

              ctx.fillStyle =
                index < 3
                  ? orange
                  : gray;

              ctx.font =
                '900 18px Arial';

              ctx.fillText(
                String(
                  index + 1
                ),
                70,
                y
              );

              ctx.fillStyle =
                black;

              ctx.font =
                '800 17px Arial';

              const maxLength =
                58;

              const title =
                pro.title.length >
                maxLength
                  ? (
                      pro.title.slice(
                        0,
                        maxLength - 1
                      ) + '…'
                    )
                  : pro.title;

              ctx.fillText(
                title,
                115,
                y
              );

              ctx.fillStyle =
                gray;

              ctx.font =
                '800 17px Arial';

              ctx.textAlign =
                'right';

              ctx.fillText(
                `${pro.vues.toLocaleString('fr-FR')} vues`,
                990,
                y
              );

              ctx.textAlign =
                'left';
            }
          );
        }

        ctx.fillStyle =
          gray;

        ctx.font =
          '600 15px Arial';

        ctx.fillText(
          'labelmoto.fr • Rapport généré depuis l’administration LabelMoto',
          70,
          1310
        );

        const link =
          document.createElement(
            'a'
          );

        link.download =
          `labelmoto-rapport-${report.month}.png`;

        link.href =
          canvas.toDataURL(
            'image/png'
          );

        link.click();
      } catch (error) {
        console.error(
          'Erreur export rapport:',
          error
        );

        window.alert(
          'Impossible de générer l’image du rapport.'
        );
      } finally {
        setExportingMonth(
          null
        );
      }
    };
useEffect(() => {
    if (
      view === 'current'
    ) {
      void loadGlobalStats();
    }
  }, [
    firestore,
    view,
  ]);

  useEffect(() => {
    if (
      view === 'top'
    ) {
      void loadTop();
    }
  }, [
    firestore,
    view,
    topPeriod,
    monthKey,
    department,
  ]);

  useEffect(() => {
    if (
      view === 'monthly'
    ) {
      void loadMonthlyReports();
    }
  }, [
    firestore,
    view,
  ]);

  const interactions =
    globalStats
      ? globalStats.tel +
        globalStats.web +
        globalStats.instagram +
        globalStats.facebook +
        globalStats.itineraire
      : 0;

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
            Pilotage
          </p>

          <h2 className="text-3xl font-black uppercase tracking-tight">
            Statistiques
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl bg-muted/60 p-2">

          <Button
            type="button"
            variant={
              view === 'current'
                ? 'default'
                : 'ghost'
            }
            onClick={() =>
              setView('current')
            }
            className="rounded-xl font-black uppercase text-[9px] tracking-widest"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Vue actuelle
          </Button>

          <Button
            type="button"
            variant={
              view === 'top'
                ? 'default'
                : 'ghost'
            }
            onClick={() =>
              setView('top')
            }
            className="rounded-xl font-black uppercase text-[9px] tracking-widest"
          >
            <Eye className="mr-2 h-4 w-4" />
            Top 50 fiches
          </Button>

          <Button
            type="button"
            variant={
              view === 'monthly'
                ? 'default'
                : 'ghost'
            }
            onClick={() =>
              setView('monthly')
            }
            className="rounded-xl font-black uppercase text-[9px] tracking-widest"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Rapports mensuels
          </Button>

        </div>
      </div>

      {view === 'current' && (
        <div className="space-y-6">

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void loadGlobalStats()
              }
              disabled={globalLoading}
              className="rounded-full"
            >
              <RefreshCw
                className={
                  `mr-2 h-4 w-4 ${
                    globalLoading
                      ? 'animate-spin'
                      : ''
                  }`
                }
              />
              Actualiser
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              label="Interactions"
              value={
                globalStats
                  ? interactions
                  : null
              }
              note="Téléphone + web + itinéraire + Instagram + Facebook"
            />

            <StatCard
              label="Fiches pros"
              value={
                globalStats
                  ? globalStats.fiches
                  : null
              }
            />

            <StatCard
              label="Vues de fiche"
              value={
                globalStats
                  ? globalStats.vues
                  : null
              }
            />

            <StatCard
              label="Téléphone"
              value={
                globalStats
                  ? globalStats.tel
                  : null
              }
            />

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            <MetricCard
              icon={
                <Globe className="h-4 w-4" />
              }
              label="Site web"
              value={
                globalStats?.web
              }
            />

            <MetricCard
              icon={
                <MapPin className="h-4 w-4" />
              }
              label="Itinéraire"
              value={
                globalStats?.itineraire
              }
            />

            <MetricCard
              icon={
                <Instagram className="h-4 w-4" />
              }
              label="Instagram"
              value={
                globalStats?.instagram
              }
            />

            <MetricCard
              icon={
                <span className="text-[11px] font-black leading-none">
                  f
                </span>
              }
              label="Facebook"
              value={
                globalStats?.facebook
              }
            />

          </div>
        </div>
      )}

      {view === 'top' && (
        <div className="space-y-5">

          <div className="rounded-3xl bg-white p-5 shadow-sm border">
            <div className="grid gap-4 lg:grid-cols-[180px_180px_1fr_auto] lg:items-end">

              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Période
                </label>

                <select
                  value={topPeriod}
                  onChange={event =>
                    setTopPeriod(
                      event.target
                        .value as TopPeriod
                    )
                  }
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm font-bold"
                >
                  <option value="history">
                    Historique
                  </option>

                  <option value="month">
                    Par mois
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Mois
                </label>

                <input
                  type="month"
                  value={monthKey}
                  disabled={
                    topPeriod !== 'month'
                  }
                  onChange={event =>
                    setMonthKey(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm font-bold disabled:opacity-40"
                />
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Département
                </label>

                <div className="flex gap-2">
                  <input
                    value={departmentInput}
                    onChange={event =>
                      setDepartmentInput(
                        event.target.value
                      )
                    }
                    onKeyDown={event => {
                      if (
                        event.key === 'Enter'
                      ) {
                        setDepartment(
                          departmentInput
                            .trim()
                            .toUpperCase()
                        );
                      }
                    }}
                    placeholder="Tous — ex. 75, 69, 2A"
                    className="h-11 flex-1 rounded-xl border bg-white px-3 text-sm font-bold"
                  />

                  <Button
                    type="button"
                    onClick={() =>
                      setDepartment(
                        departmentInput
                          .trim()
                          .toUpperCase()
                      )
                    }
                    className="h-11 rounded-xl"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDepartmentInput('');
                  setDepartment('');
                }}
                className="h-11 rounded-xl"
              >
                France
              </Button>

            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span>
                Top 50
              </span>

              <span>•</span>

              <span>
                {department
                  ? `Département ${department}`
                  : 'France entière'}
              </span>

              <span>•</span>

              <span>
                {topPeriod === 'month'
                  ? formatMonthLabel(
                      monthKey
                    )
                  : 'Historique'}
              </span>
            </div>
          </div>

          {topLoading ? (
            <div className="py-20 text-center text-sm font-bold text-muted-foreground">
              Chargement du classement...
            </div>
          ) : topPros.length === 0 ? (
            <div className="rounded-3xl border border-dashed p-12 text-center">
              <Eye className="mx-auto mb-4 h-8 w-8 opacity-30" />

              <p className="font-black uppercase text-sm">
                Aucune vue enregistrée
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Les classements mensuels commenceront à se remplir après le déploiement du nouveau tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-2">

              {topPros.map(
                (pro, index) => (
                  <div
                    key={
                      `${pro.collection}:${pro.id}`
                    }
                    className="grid grid-cols-[40px_1fr_auto] gap-3 items-center rounded-2xl border bg-white p-4"
                  >
                    <div className="text-xl font-black text-muted-foreground">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-black uppercase text-sm">
                          {pro.title}
                        </p>

                        {pro.departement && (
                          <span className="rounded-full bg-muted px-2 py-1 text-[8px] font-black">
                            {pro.departement}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-bold text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {pro.vues} vues
                        </span>

                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {pro.tel}
                        </span>

                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {pro.web}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {pro.itineraire}
                        </span>

                        <span className="flex items-center gap-1">
                          <Instagram className="h-3 w-3" />
                          {pro.instagram}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={proHref(
                        pro.collection,
                        pro.id
                      )}
                      target="_blank"
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                )
              )}

            </div>
          )}
        </div>
      )}

      {view === 'monthly' && (
        <div className="space-y-5">

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              <h3 className="font-black uppercase">
                Rapport mensuel
              </h3>

              <p className="text-xs text-muted-foreground">
                Les statistiques LabelMoto sont calculées automatiquement. À la fin du mois, reporte simplement ici les trois chiffres GA4 : visiteurs, sessions et pages vues.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[180px_1fr_1fr_1fr_auto]">

              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Mois
                </label>

                <input
                  type="month"
                  value={reportMonth}
                  onChange={event =>
                    setReportMonth(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm font-bold"
                />
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Visiteurs
                </label>

                <input
                  type="number"
                  min="0"
                  value={reportVisitors}
                  onChange={event =>
                    setReportVisitors(
                      event.target.value
                    )
                  }
                  placeholder="Ex. 4520"
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm font-bold"
                />
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Sessions
                </label>

                <input
                  type="number"
                  min="0"
                  value={reportSessions}
                  onChange={event =>
                    setReportSessions(
                      event.target.value
                    )
                  }
                  placeholder="Ex. 5840"
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm font-bold"
                />
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Pages vues
                </label>

                <input
                  type="number"
                  min="0"
                  value={reportPageviews}
                  onChange={event =>
                    setReportPageviews(
                      event.target.value
                    )
                  }
                  placeholder="Ex. 12460"
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm font-bold"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={() =>
                    void saveMonthlyReport()
                  }
                  disabled={reportSaving}
                  className="h-11 w-full rounded-xl font-black uppercase text-[9px] tracking-widest"
                >
                  <Save className="mr-2 h-4 w-4" />

                  {reportSaving
                    ? 'Enregistrement...'
                    : 'Enregistrer'}
                </Button>
              </div>

            </div>

            <p className="mt-4 text-[9px] font-bold text-muted-foreground">
              Tu peux corriger ultérieurement les trois chiffres du mois sans modifier les statistiques LabelMoto déjà enregistrées.
            </p>
          </div>

          {reportsLoading ? (
            <div className="py-20 text-center text-sm font-bold text-muted-foreground">
              Chargement des rapports...
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-3xl border border-dashed p-12 text-center">
              <CalendarDays className="mx-auto mb-4 h-8 w-8 opacity-30" />

              <p className="font-black uppercase text-sm">
                Aucun rapport mensuel
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Aucun mois n’a encore été enregistré. Utilise le formulaire ci-dessus pour créer ton premier rapport.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {reports.map(report => {
                const interactions =
                  report.stats_tel +
                  report.stats_web +
                  report.stats_instagram +
                  report.stats_facebook +
                  report.stats_itineraire;

                return (
                  <div
                    key={report.id}
                    className="rounded-3xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Rapport mensuel
                        </p>

                        <h3 className="mt-1 text-2xl font-black capitalize">
                          {formatMonthLabel(
                            report.month
                          )}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="rounded-full bg-muted px-4 py-2 text-xs font-black">
                          {interactions} interactions
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            void exportMonthlyReport(
                              report
                            )
                          }
                          disabled={
                            exportingMonth ===
                            report.month
                          }
                          className="rounded-full font-black uppercase text-[9px] tracking-widest"
                        >
                          <Download className="mr-2 h-4 w-4" />

                          {exportingMonth ===
                          report.month
                            ? 'Création...'
                            : 'Exporter PNG'}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3">

                      <ReportMetric
                        label="Visiteurs"
                        value={report.visitors}
                      />

                      <ReportMetric
                        label="Sessions"
                        value={report.sessions}
                      />

                      <ReportMetric
                        label="Pages vues"
                        value={report.pageviews}
                      />

                      <ReportMetric
                        label="Fiches vues"
                        value={report.stats_vues}
                      />

                      <ReportMetric
                        label="Téléphone"
                        value={report.stats_tel}
                      />

                      <ReportMetric
                        label="Web"
                        value={report.stats_web}
                      />

                      <ReportMetric
                        label="Itinéraire"
                        value={report.stats_itineraire}
                      />

                      <ReportMetric
                        label="Instagram"
                        value={report.stats_instagram}
                      />

                      <ReportMetric
                        label="Facebook"
                        value={report.stats_facebook}
                      />

                    </div>

                    <div className="mt-5 border-t pt-4 text-[10px] font-bold text-muted-foreground">
                      Trafic global saisi depuis GA4 • Statistiques professionnelles calculées automatiquement par LabelMoto.
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      )}

    </div>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number | null;
  note?: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-4xl font-black">
        {value == null
          ? '—'
          : value.toLocaleString(
              'fr-FR'
            )}
      </p>

      {note && (
        <p className="mt-2 text-[9px] font-bold text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: number;
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>

      <p className="text-3xl font-black">
        {value == null
          ? '—'
          : value.toLocaleString(
              'fr-FR'
            )}
      </p>
    </div>
  );
}

function ReportMetric({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  return (
    <div className="rounded-2xl bg-muted/30 p-3">
      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-xl font-black">
        {value == null
          ? '—'
          : value.toLocaleString(
              'fr-FR'
            )}
      </p>
    </div>
  );
}
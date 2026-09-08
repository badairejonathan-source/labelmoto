'use client';

import {
  Fragment,
  useTransition,
} from 'react';

import Link from 'next/link';

import {
  useRouter,
} from 'next/navigation';

import {
  ExternalLink,
  Globe,
  MapPin,
  Phone,
} from 'lucide-react';

export type CommunityCollection =
  | 'associations'
  | 'relais';

export interface CommunityDirectoryItem {
  id: string;
  title: string;
  address: string;
  category: string;
  phoneNumber?: string;
  website?: string;
  rating: number | null;
  reviewCount: number | null;
  slug: string;
  collection: CommunityCollection;
}

export interface CommunityDepartmentSummary {
  code: string;
  name: string;
  count: number;
}

interface CommunityDirectoryBrowserProps {
  departments: CommunityDepartmentSummary[];
  selectedCode: string | null;
  selectedItems: CommunityDirectoryItem[];
  basePath: string;
  entityPlural: string;
}

function cleanUrl(
  raw?: string
): string | null {
  if (!raw) {
    return null;
  }

  const value =
    raw.trim();

  if (!value) {
    return null;
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }

  return 'https://' + value;
}

function trackStat(
  item: CommunityDirectoryItem,
  field:
    | 'stats_tel'
    | 'stats_web'
) {
  void fetch(
    '/api/track-stat',
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        collection:
          item.collection,

        id:
          item.id,

        field,

        title:
          item.title,
      }),
    }
  ).catch(
    error => {
      console.warn(
        '[COMMUNITY-DIRECTORY] track-stat indisponible',
        error
      );
    }
  );
}

function CommunityCard({
  item,
}: {
  item: CommunityDirectoryItem;
}) {
  const website =
    cleanUrl(
      item.website
    );

  return (
    <article
      className="
        flex
        min-w-0
        flex-col
        rounded-2xl
        border
        border-border/70
        bg-white
        p-4
        shadow-sm
        transition-all
        hover:-translate-y-0.5
        hover:border-brand/30
        hover:shadow-md
        md:p-5
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className="
            min-w-0
            flex-1
          "
        >
          <h3
            className="
              text-sm
              font-black
              uppercase
              tracking-tight
              text-foreground
            "
          >
            {item.title}
          </h3>

          {item.category && (
            <p
              className="
                mt-1
                text-[10px]
                font-black
                uppercase
                tracking-[0.12em]
                text-brand
              "
            >
              {item.category}
            </p>
          )}
        </div>

        {item.rating !== null && (
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
              rounded-full
              bg-brand/10
              px-2.5
              py-1
              text-[10px]
              font-black
              text-brand
            "
          >
            <span>
              {item.rating.toFixed(1)}
            </span>

            <span>
              ★
            </span>
          </div>
        )}
      </div>

      {item.address && (
        <div
          className="
            mt-4
            flex
            items-start
            gap-2
            text-xs
            font-medium
            leading-relaxed
            text-muted-foreground
          "
        >
          <MapPin
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
              text-brand
            "
          />

          <span>
            {item.address}
          </span>
        </div>
      )}

      <div
        className="
          mt-5
          flex
          flex-wrap
          gap-2
        "
      >
        {item.phoneNumber && (
          <a
            href={
              'tel:' +
              item.phoneNumber
            }
            onClick={() =>
              trackStat(
                item,
                'stats_tel'
              )
            }
            className="
              inline-flex
              h-9
              items-center
              gap-1.5
              rounded-full
              bg-brand/10
              px-3
              text-[9px]
              font-black
              uppercase
              tracking-widest
              text-brand
              transition-colors
              hover:bg-brand/20
            "
          >
            <Phone
              className="
                h-3.5
                w-3.5
              "
            />

            Appeler
          </a>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackStat(
                item,
                'stats_web'
              )
            }
            className="
              inline-flex
              h-9
              items-center
              gap-1.5
              rounded-full
              bg-brand/10
              px-3
              text-[9px]
              font-black
              uppercase
              tracking-widest
              text-brand
              transition-colors
              hover:bg-brand/20
            "
          >
            <Globe
              className="
                h-3.5
                w-3.5
              "
            />

            Site
          </a>
        )}

        <Link
          href={
            '/map?search=' +
            encodeURIComponent(
              item.title
            )
          }
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-full
            bg-brand
            px-4
            text-[9px]
            font-black
            uppercase
            tracking-widest
            text-white
            transition-colors
            hover:bg-brand/90
          "
        >
          <ExternalLink
            className="
              h-3.5
              w-3.5
            "
          />

          Voir sur la carte
        </Link>
      </div>
    </article>
  );
}

export default function CommunityDirectoryBrowser({
  departments,
  selectedCode,
  selectedItems,
  basePath,
  entityPlural,
}: CommunityDirectoryBrowserProps) {
  const router =
    useRouter();

  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  const toggleDepartment = (
    code: string
  ) => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    if (
      selectedCode ===
      code
    ) {
      params.delete(
        'departement'
      );
    }
    else {
      params.set(
        'departement',
        code
      );
    }

    const query =
      params.toString();

    const href =
      query
        ? basePath +
          '?' +
          query
        : basePath;

    startTransition(
      () => {
        router.push(
          href,
          {
            scroll: false,
          }
        );
      }
    );
  };

  return (
    <section
      className="
        rounded-[1.6rem]
        border
        border-border/70
        bg-white
        p-5
        shadow-[0_8px_30px_rgba(0,0,0,0.035)]
        md:p-7
      "
    >
      <div
        className="
          flex
          flex-col
          gap-2
          md:flex-row
          md:items-end
          md:justify-between
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
              text-brand
            "
          >
            Accès rapide
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-black
              uppercase
              tracking-tight
            "
          >
            Choisissez un département
          </h2>

          <p
            className="
              mt-2
              max-w-3xl
              text-sm
              font-medium
              leading-relaxed
              text-muted-foreground
            "
          >
            Sélectionnez un département
            pour afficher les {entityPlural}
            référencés.
          </p>
        </div>

        {isPending && (
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-widest
              text-brand
            "
          >
            Chargement…
          </p>
        )}
      </div>

      <div
        className="
          mt-6
          grid
          grid-cols-2
          gap-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
        "
      >
        {departments.map(
          department => {
            const isSelected =
              selectedCode ===
              department.code;

            return (
              <Fragment
                key={
                  department.code
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleDepartment(
                      department.code
                    )
                  }
                  aria-expanded={
                    isSelected
                  }
                  className={
                    `
                      min-w-0
                      rounded-xl
                      border
                      px-3
                      py-3
                      text-left
                      transition-all
                    ` +
                    (
                      isSelected
                        ? ' border-brand bg-brand/10 shadow-sm'
                        : ' border-border/70 bg-white/70 hover:border-brand/40 hover:bg-brand/5'
                    )
                  }
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-2
                    "
                  >
                    <span
                      className="
                        text-xs
                        font-black
                        text-brand
                      "
                    >
                      {department.code}
                    </span>

                    <span
                      className="
                        shrink-0
                        rounded-full
                        bg-brand/10
                        px-2
                        py-0.5
                        text-[9px]
                        font-black
                        text-brand
                      "
                    >
                      {department.count}
                    </span>
                  </div>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-tight
                      text-foreground
                    "
                  >
                    {department.name}
                  </p>
                </button>

                {isSelected && (
                  <div
                    className="
                      col-span-2
                      sm:col-span-3
                      md:col-span-4
                      lg:col-span-5
                    "
                  >
                    <div
                      className="
                        my-3
                        rounded-[1.4rem]
                        border
                        border-brand/20
                        bg-brand/5
                        p-4
                        md:p-5
                      "
                    >
                      <div
                        className="
                          flex
                          flex-col
                          gap-2
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <div>
                          <p
                            className="
                              text-[10px]
                              font-black
                              uppercase
                              tracking-[0.16em]
                              text-brand
                            "
                          >
                            {department.code}
                            {' · '}
                            {department.name}
                          </p>

                          <h3
                            className="
                              mt-1
                              text-xl
                              font-black
                              uppercase
                              tracking-tight
                            "
                          >
                            {
                              selectedItems.length
                            }{' '}
                            {entityPlural}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleDepartment(
                              department.code
                            )
                          }
                          className="
                            self-start
                            text-[9px]
                            font-black
                            uppercase
                            tracking-widest
                            text-brand
                            hover:underline
                          "
                        >
                          Fermer
                        </button>
                      </div>

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-1
                          gap-4
                          md:grid-cols-2
                          lg:grid-cols-3
                        "
                      >
                        {selectedItems.map(
                          item => (
                            <CommunityCard
                              key={
                                item.id
                              }
                              item={
                                item
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            );
          }
        )}
      </div>
    </section>
  );
}
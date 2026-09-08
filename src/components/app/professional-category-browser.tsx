'use client';

import {
  useTransition,
} from 'react';

import Link from 'next/link';

import {
  useRouter,
} from 'next/navigation';

import {
  ChevronRight,
  Globe,
  LoaderCircle,
  MapPin,
  Phone,
  Star,
} from 'lucide-react';

export interface ProfessionalCategoryPro {
  id: string;
  title: string;
  address: string;
  category: string;
  phoneNumber?: string;
  website?: string;
  rating: number | null;
  reviewCount: number | null;
  slug: string;
  collection:
    | 'concessions'
    | 'creators';
}

export interface ProfessionalDepartmentSummary {
  code: string;
  name: string;
  count: number;
}

interface ProfessionalCategoryBrowserProps {
  departments:
    ProfessionalDepartmentSummary[];
  selectedCode:
    string | null;
  selectedPros:
    ProfessionalCategoryPro[];
  basePath:
    string;
}

function cleanUrl(
  value?: string
): string | null {
  const raw =
    String(
      value || ''
    ).trim();

  if (!raw) {
    return null;
  }

  if (
    raw.startsWith(
      'http://'
    ) ||
    raw.startsWith(
      'https://'
    )
  ) {
    return raw;
  }

  return (
    'https://' +
    raw
  );
}

function ProCard({
  pro,
}: {
  pro:
    ProfessionalCategoryPro;
}) {
  const slugOrId =
    pro.slug ||
    pro.id;

  const href =
    pro.collection ===
    'creators'
      ? '/creators/' +
        slugOrId
      : '/concessions/' +
        slugOrId;

  const website =
    cleanUrl(
      pro.website
    );

  return (
    <article
      className="
        rounded-[1.25rem]
        border
        border-border/70
        bg-white
        p-4
        shadow-[0_5px_18px_rgba(0,0,0,0.035)]
      "
    >
      <div
        className="
          flex
          min-w-0
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className="
            min-w-0
          "
        >
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.18em]
              text-brand
            "
          >
            {pro.collection ===
            'creators'
              ? 'Créateur moto'
              : pro.category ||
                'Professionnel moto'}
          </p>

          <h3
            className="
              mt-1
              text-[15px]
              font-black
              uppercase
              leading-tight
              text-foreground
            "
          >
            {pro.title}
          </h3>
        </div>

        {pro.rating !== null && (
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
            <Star
              className="
                h-3
                w-3
                fill-current
              "
            />

            {pro.rating.toFixed(
              1
            )}
          </div>
        )}
      </div>

      {pro.address && (
        <div
          className="
            mt-3
            flex
            items-start
            gap-2
            text-[11px]
            font-semibold
            text-muted-foreground
          "
        >
          <MapPin
            className="
              mt-0.5
              h-3.5
              w-3.5
              shrink-0
            "
          />

          <span>
            {pro.address}
          </span>
        </div>
      )}

      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        <Link
          href={href}
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-full
            bg-brand
            px-4
            text-[10px]
            font-black
            uppercase
            tracking-[0.12em]
            text-white
            transition-colors
            hover:bg-brand/90
          "
        >
          Voir la fiche

          <ChevronRight
            className="
              h-3.5
              w-3.5
            "
          />
        </Link>

        {pro.phoneNumber && (
          <a
            href={
              'tel:' +
              pro.phoneNumber
            }
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-white
              transition
              hover:border-brand
              hover:text-brand
            "
            aria-label={
              'Téléphoner à ' +
              pro.title
            }
          >
            <Phone
              className="
                h-4
                w-4
              "
            />
          </a>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-white
              transition
              hover:border-brand
              hover:text-brand
            "
            aria-label={
              'Site web de ' +
              pro.title
            }
          >
            <Globe
              className="
                h-4
                w-4
              "
            />
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProfessionalCategoryBrowser({
  departments,
  selectedCode,
  selectedPros,
  basePath,
}: ProfessionalCategoryBrowserProps) {
  const router =
    useRouter();

  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  const selectDepartment =
    (
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

      const url =
        query
          ? basePath +
            '?' +
            query
          : basePath;

      startTransition(
        () => {
          router.push(
            url,
            {
              scroll:
                false,
            }
          );
        }
      );
    };

  return (
    <div
      className="
        rounded-[1.6rem]
        border
        border-border/70
        bg-white
        p-5
        md:p-6
      "
    >
      <div
        className="
          flex
          flex-col
          gap-1
        "
      >
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
            text-xl
            font-black
            uppercase
            tracking-tight
            md:text-2xl
          "
        >
          Trouver par département
        </h2>

        <p
          className="
            mt-1
            text-sm
            font-medium
            text-muted-foreground
          "
        >
          Sélectionnez un département pour afficher les fiches correspondantes.
        </p>
      </div>

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
        "
      >
        {departments.map(
          group => {
            const isSelected =
              selectedCode ===
              group.code;

            return (
              <div
                key={
                  group.code
                }
                className="contents"
              >
                <button
                  type="button"
                  disabled={
                    isPending
                  }
                  onClick={() =>
                    selectDepartment(
                      group.code
                    )
                  }
                  aria-expanded={
                    isSelected
                  }
                  className={[
                    'flex',
                    'min-h-[68px]',
                    'items-center',
                    'justify-between',
                    'gap-3',
                    'rounded-[1rem]',
                    'border',
                    'px-3',
                    'py-3',
                    'text-left',
                    'transition',
                    'disabled:cursor-wait',
                    'disabled:opacity-70',
                    isSelected
                      ? 'border-brand bg-brand/10 shadow-sm'
                      : 'border-border/70 bg-white/70 hover:border-brand/40 hover:bg-white',
                  ].join(' ')}
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          text-[13px]
                          font-black
                          text-foreground
                        "
                      >
                        {group.code}
                      </span>

                      {isPending &&
                        isSelected && (
                        <LoaderCircle
                          className="
                            h-3
                            w-3
                            animate-spin
                            text-brand
                          "
                        />
                      )}
                    </div>

                    <div
                      className="
                        mt-0.5
                        truncate
                        text-[10px]
                        font-bold
                        uppercase
                        text-muted-foreground
                      "
                    >
                      {group.name}
                    </div>
                  </div>

                  <div
                    className="
                      shrink-0
                      rounded-full
                      bg-brand/10
                      px-2
                      py-1
                      text-[9px]
                      font-black
                    "
                  >
                    {group.count}
                  </div>
                </button>

                {isSelected && (
                  <section
                    aria-live="polite"
                    className="
                      col-span-2
                      py-3
                      sm:col-span-3
                      md:col-span-4
                      md:py-4
                      lg:col-span-5
                    "
                  >
                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-brand
                          "
                        >
                          Département{' '}
                          {group.code}
                        </p>

                        <h3
                          className="
                            mt-0.5
                            text-lg
                            font-black
                            uppercase
                          "
                        >
                          {group.name}
                        </h3>
                      </div>

                      <div
                        className="
                          rounded-full
                          bg-brand
                          px-3
                          py-1.5
                          text-[10px]
                          font-black
                          text-white
                        "
                      >
                        {group.count}{' '}
                        pro
                        {group.count > 1
                          ? 's'
                          : ''}
                      </div>
                    </div>

                    {selectedPros.length > 0 ? (
                      <div
                        className="
                          grid
                          gap-3
                          lg:grid-cols-2
                        "
                      >
                        {selectedPros.map(
                          pro => (
                            <ProCard
                              key={
                                pro.collection +
                                '-' +
                                pro.id
                              }
                              pro={pro}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <div
                        className="
                          rounded-[1rem]
                          bg-white
                          p-5
                          text-sm
                          font-bold
                          text-muted-foreground
                        "
                      >
                        Aucune fiche dans ce département.
                      </div>
                    )}
                  </section>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

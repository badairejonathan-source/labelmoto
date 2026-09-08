import Link from 'next/link';

import {
  getDepartmentByCode,
} from '@/app/lib/departments';

import {
  loadSeoPros,
} from '@/lib/seo-pros';

import CommunityDirectoryBrowser, {
  type CommunityCollection,
  type CommunityDepartmentSummary,
  type CommunityDirectoryItem,
} from '@/components/app/community-directory-browser';

interface CommunityDirectoryPageProps {
  collection: CommunityCollection;
  basePath: string;
  eyebrow: string;
  h1: string;
  label: string;
  intro: string;
  entitySingular: string;
  entityPlural: string;
  mapFilter:
    | 'association'
    | 'relais';
  requestedDepartment?:
    | string
    | string[];
  otherHref: string;
  otherLabel: string;
}

interface CommunityInternal
  extends CommunityDirectoryItem {
  departement: string;
}

function departmentSortValue(
  code: string
): number {
  if (
    code === '2A'
  ) {
    return 20.1;
  }

  if (
    code === '2B'
  ) {
    return 20.2;
  }

  if (
    code === 'NC'
  ) {
    return 9999;
  }

  const numeric =
    Number(
      code
    );

  return Number.isFinite(
    numeric
  )
    ? numeric
    : 9998;
}

function departmentName(
  code: string
): string {
  if (
    code === '00'
  ) {
    return 'Pays frontaliers';
  }

  if (
    code === 'NC'
  ) {
    return 'Non renseigné';
  }

  return (
    getDepartmentByCode(
      code
    )?.name ||
    'Département ' +
      code
  );
}

function normalizeDepartment(
  raw:
    | string
    | string[]
    | undefined
): string | null {
  const value =
    Array.isArray(
      raw
    )
      ? raw[0]
      : raw;

  if (!value) {
    return null;
  }

  const clean =
    String(
      value
    )
      .trim()
      .toUpperCase();

  return (
    clean ||
    null
  );
}

async function getCommunityItems(
  collection:
    CommunityCollection
): Promise<
  CommunityInternal[]
> {
  const allPros =
    await loadSeoPros();

  return allPros
    .filter(
      pro =>
        pro.collection ===
        collection
    )
    .map<CommunityInternal>(
      pro => ({
        id:
          pro.id,

        title:
          pro.title,

        address:
          pro.address,

        category:
          pro.category,

        phoneNumber:
          pro.phoneNumber,

        website:
          pro.website,

        rating:
          pro.rating,

        reviewCount:
          pro.reviewCount,

        slug:
          pro.slug,

        collection,

        departement:
          String(
            pro.departement ||
            'NC'
          ).trim() ||
          'NC',
      })
    )
    .sort(
      (
        a,
        b
      ) => {
        if (
          a.rating !== null &&
          b.rating !== null
        ) {
          return (
            b.rating -
            a.rating
          );
        }

        if (
          a.rating !== null
        ) {
          return -1;
        }

        if (
          b.rating !== null
        ) {
          return 1;
        }

        return (
          a.title.localeCompare(
            b.title,
            'fr'
          )
        );
      }
    );
}

function buildDepartments(
  items:
    CommunityInternal[]
): CommunityDepartmentSummary[] {
  const counts =
    new Map<
      string,
      number
    >();

  for (
    const item
    of items
  ) {
    counts.set(
      item.departement,
      (
        counts.get(
          item.departement
        ) ||
        0
      ) +
      1
    );
  }

  return Array.from(
    counts.entries()
  )
    .map(
      ([
        code,
        count,
      ]) => ({
        code,

        name:
          departmentName(
            code
          ),

        count,
      })
    )
    .sort(
      (
        a,
        b
      ) =>
        departmentSortValue(
          a.code
        ) -
        departmentSortValue(
          b.code
        )
    );
}

export default async function CommunityDirectoryPage({
  collection,
  basePath,
  eyebrow,
  h1,
  label,
  intro,
  entitySingular,
  entityPlural,
  mapFilter,
  requestedDepartment,
  otherHref,
  otherLabel,
}: CommunityDirectoryPageProps) {
  const items =
    await getCommunityItems(
      collection
    );

  const departments =
    buildDepartments(
      items
    );

  const requestedCode =
    normalizeDepartment(
      requestedDepartment
    );

  const selectedCode =
    requestedCode &&
    departments.some(
      department =>
        department.code ===
        requestedCode
    )
      ? requestedCode
      : null;

  const selectedItems:
    CommunityDirectoryItem[] =
    selectedCode
      ? items
          .filter(
            item =>
              item.departement ===
              selectedCode
          )
          .map<CommunityDirectoryItem>(
            item => ({
              id:
                item.id,

              title:
                item.title,

              address:
                item.address,

              category:
                item.category,

              phoneNumber:
                item.phoneNumber,

              website:
                item.website,

              rating:
                item.rating,

              reviewCount:
                item.reviewCount,

              slug:
                item.slug,

              collection:
                item.collection,
            })
          )
      : [];

  return (
    <main
      className="
        min-h-screen
        bg-white
      "
    >
      <section
        className="
          border-b
          border-border/60
          bg-gradient-to-br
          from-brand/5
          to-brand/10
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-12
            md:px-8
            md:py-16
          "
        >
          <div
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.18em]
              text-muted-foreground
            "
          >
            <Link
              href="/"
              className="
                hover:text-brand
              "
            >
              Accueil
            </Link>

            {' / '}

            <span>
              {label}
            </span>
          </div>

          <p
            className="
              mt-7
              text-[11px]
              font-black
              uppercase
              tracking-[0.24em]
              text-brand
            "
          >
            {eyebrow}
          </p>

          <h1
            className="
              mt-3
              max-w-5xl
              text-4xl
              font-black
              uppercase
              leading-[0.95]
              tracking-tight
              md:text-6xl
            "
          >
            {h1}
          </h1>

          <p
            className="
              mt-4
              text-lg
              font-black
              text-brand
            "
          >
            {items.length}{' '}
            {items.length === 1
              ? entitySingular
              : entityPlural}{' '}
            référencé
            {items.length > 1
              ? 's'
              : ''}
          </p>
        </div>
      </section>

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-9
          md:px-8
          md:py-12
        "
      >
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
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
              text-brand
            "
          >
            À propos
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
            {label}
          </h2>

          <p
            className="
              mt-4
              max-w-4xl
              text-sm
              font-medium
              leading-relaxed
              text-muted-foreground
              md:text-base
            "
          >
            {intro}
          </p>
        </section>

        <section
          className="
            mt-6
          "
        >
          {items.length > 0 ? (
            <CommunityDirectoryBrowser
              departments={
                departments
              }
              selectedCode={
                selectedCode
              }
              selectedItems={
                selectedItems
              }
              basePath={
                basePath
              }
              entityPlural={
                entityPlural
              }
            />
          ) : (
            <div
              className="
                rounded-[1.5rem]
                border
                border-border/70
                bg-muted/20
                p-8
                text-center
              "
            >
              <p
                className="
                  text-sm
                  font-bold
                  text-muted-foreground
                "
              >
                Aucun référencement
                disponible pour le moment.
              </p>
            </div>
          )}
        </section>

        <section
          className="
            mt-6
            rounded-[1.6rem]
            border
            border-brand/20
            bg-gradient-to-br
            from-brand/5
            to-brand/10
            p-6
            text-foreground
            md:p-8
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
            Carte LabelMoto
          </p>

          <div
            className="
              mt-2
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  font-black
                  uppercase
                  tracking-tight
                "
              >
                Voir sur la carte
              </h2>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  font-medium
                  leading-relaxed
                  text-muted-foreground
                "
              >
                Affichez tous les{' '}
                {entityPlural}
                {' '}sur la carte
                interactive LabelMoto.
              </p>
            </div>

            <Link
              href={
                '/map?filter=' +
                mapFilter
              }
              className="
                inline-flex
                h-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-brand
                px-5
                text-[10px]
                font-black
                uppercase
                tracking-[0.14em]
                text-white
                shadow-sm
                transition-colors
                hover:bg-brand/90
              "
            >
              Ouvrir la carte
            </Link>
          </div>
        </section>

        <section
          className="
            mt-10
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
            Explorer LabelMoto
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
            Continuer l’exploration
          </h2>

          <div
            className="
              mt-5
              flex
              flex-wrap
              gap-2
            "
          >
            <Link
              href="/metiers"
              className="
                rounded-full
                border
                border-border/70
                bg-muted/20
                px-4
                py-2
                text-[10px]
                font-black
                uppercase
                tracking-widest
                text-muted-foreground
                transition-colors
                hover:border-brand
                hover:bg-brand/5
                hover:text-brand
              "
            >
              Métiers moto
            </Link>

            <Link
              href={otherHref}
              className="
                rounded-full
                border
                border-border/70
                bg-muted/20
                px-4
                py-2
                text-[10px]
                font-black
                uppercase
                tracking-widest
                text-muted-foreground
                transition-colors
                hover:border-brand
                hover:bg-brand/5
                hover:text-brand
              "
            >
              {otherLabel}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
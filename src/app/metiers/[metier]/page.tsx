import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  notFound,
} from 'next/navigation';

import {
  getAllProfessionalCategorySlugs,
  getProfessionalCategoryBySlug,
  professionalMatchesCategory,
  PROFESSIONAL_CATEGORIES,
  type ProfessionalCategorySlug,
} from '@/app/lib/professional-categories';

import {
  getDepartmentByCode,
} from '@/app/lib/departments';

import {
  loadMetierSeoPros,
} from '@/lib/seo-pros';

import ProfessionalCategoryBrowser, {
  type ProfessionalCategoryPro,
  type ProfessionalDepartmentSummary,
} from '@/components/app/professional-category-browser';

interface PageProps {
  params:
    Promise<{
      metier: string;
    }>;

  searchParams:
    Promise<{
      departement?:
        string |
        string[];
    }>;
}

interface CategoryProInternal
  extends ProfessionalCategoryPro {
  departement: string;
}

export async function generateStaticParams() {
  return getAllProfessionalCategorySlugs().map(
    metier => ({
      metier,
    })
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {
    metier,
  } =
    await params;

  const category =
    getProfessionalCategoryBySlug(
      metier
    );

  if (!category) {
    return {
      title:
        'Page introuvable | LabelMoto',
    };
  }

  const canonical =
    'https://labelmoto.fr/metiers/' +
    category.slug;

  return {
    title: {
      absolute:
        category.metaTitle,
    },

    description:
      category.metaDescription,

    alternates: {
      canonical,
    },

    openGraph: {
      title:
        category.metaTitle,

      description:
        category.metaDescription,

      url:
        canonical,

      siteName:
        'LabelMoto',

      locale:
        'fr_FR',

      type:
        'website',
    },
  };
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

  const number =
    Number(
      code
    );

  return Number.isFinite(
    number
  )
    ? number
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
    string |
    string[] |
    undefined
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

async function getCategoryPros(
  slug:
    ProfessionalCategorySlug
): Promise<
  CategoryProInternal[]
> {
  const allPros =
    await loadMetierSeoPros();

  return allPros
    .filter(
      pro => {
        if (
          pro.collection ===
            'associations' ||
          pro.collection ===
            'relais'
        ) {
          return false;
        }

        return (
          professionalMatchesCategory(
            {
              title:
                pro.title,

              category:
                pro.category,

              appSection:
                pro.appSection,

              collection:
                pro.collection,
            },
            slug
          )
        );
      }
    )
    .map<CategoryProInternal>(
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

        collection:
          pro.collection ===
          'creators'
            ? 'creators'
            : 'concessions',

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

function buildDepartmentSummaries(
  pros:
    CategoryProInternal[]
): ProfessionalDepartmentSummary[] {
  const counts =
    new Map<
      string,
      number
    >();

  for (
    const pro
    of pros
  ) {
    counts.set(
      pro.departement,
      (
        counts.get(
          pro.departement
        ) ||
        0
      ) + 1
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

export default async function ProfessionalCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const {
    metier,
  } =
    await params;

  const query =
    await searchParams;

  const category =
    getProfessionalCategoryBySlug(
      metier
    );

  if (!category) {
    notFound();
  }

  const pros =
    await getCategoryPros(
      category.slug
    );

  const departments =
    buildDepartmentSummaries(
      pros
    );

  const requestedCode =
    normalizeDepartment(
      query.departement
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

  const selectedPros:
    ProfessionalCategoryPro[] =
    selectedCode
      ? pros
          .filter(
            pro =>
              pro.departement ===
              selectedCode
          )
          .map<ProfessionalCategoryPro>(
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

              collection:
                pro.collection,
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

            <Link
              href="/metiers"
              className="
                hover:text-brand
              "
            >
              Métiers
            </Link>

            {' / '}

            <span>
              {category.shortLabel}
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
            Annuaire national
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
            {category.h1}
          </h1>

          <div
            className="
              mt-4
              text-lg
              font-black
              text-brand
            "
          >
            {pros.length}{' '}
            professionnel
            {pros.length > 1
              ? 's'
              : ''}{' '}
            référencé
            {pros.length > 1
              ? 's'
              : ''}
          </div>
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
            {category.label}
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
            {category.intro}
          </p>
        </section>

        <section
          className="
            mt-6
          "
        >
          {pros.length > 0 ? (
            <ProfessionalCategoryBrowser
              departments={
                departments
              }
              selectedCode={
                selectedCode
              }
              selectedPros={
                selectedPros
              }
              basePath={
                '/metiers/' +
                category.slug
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
                Aucun professionnel
                référencé pour le moment.
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
                Affichez ces professionnels
                sur la carte LabelMoto et
                recherchez ceux qui se
                trouvent autour de vous.
              </p>
            </div>

            <Link
              href={
                '/map?search=' +
                encodeURIComponent(
                  category.mapSearch
                )
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
                transition
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
            Autres métiers moto
          </h2>

          <div
            className="
              mt-5
              flex
              flex-wrap
              gap-2
            "
          >
            {PROFESSIONAL_CATEGORIES
              .filter(
                item =>
                  item.slug !==
                  category.slug
              )
              .map(
                item => (
                  <Link
                    key={
                      item.slug
                    }
                    href={
                      '/metiers/' +
                      item.slug
                    }
                    className="
                      rounded-full
                      border
                      border-border/70
                      bg-muted/20
                      px-4
                      py-2.5
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.1em]
                      transition
                      hover:border-brand
                      hover:bg-white
                      hover:text-brand
                    "
                  >
                    {item.shortLabel}
                  </Link>
                )
              )}
          </div>
        </section>
      </div>
    </main>
  );
}

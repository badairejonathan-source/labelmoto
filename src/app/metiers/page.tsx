import type {
  Metadata,
} from 'next';

import Link from 'next/link';

import {
  Camera,
  GraduationCap,
  MapPin,
  Package,
  Paintbrush,
  Scissors,
  Settings,
  ShoppingBag,
  Store,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import {
  PROFESSIONAL_CATEGORIES,
  type ProfessionalCategorySlug,
} from '@/app/lib/professional-categories';

export const metadata:
  Metadata = {
  title: {
    absolute:
      'Professionnels et métiers de la moto en France | LabelMoto',
  },

  description:
    'Explorez les métiers de la moto en France : concessions, ateliers, équipementiers, transporteurs, préparateurs, selliers, photographes, formations et plus encore.',

  alternates: {
    canonical:
      'https://labelmoto.fr/metiers',
  },
};

const ICONS:
  Record<
    ProfessionalCategorySlug,
    LucideIcon
  > = {
  'concessionnaires-revendeurs':
    Store,

  'ateliers-mecaniciens':
    Wrench,

  'equipement-accessoires':
    ShoppingBag,

  'location-moto':
    MapPin,

  'transport-moto':
    Package,

  'preparateurs-moto':
    Settings,

  'peintres-carrossiers':
    Paintbrush,

  'selliers-moto':
    Scissors,

  'photographes-videastes':
    Camera,

  'formation-moto-ecoles':
    GraduationCap,
};

export default function MetiersPage() {
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
            py-14
            md:px-8
            md:py-20
          "
        >
          <p
            className="
              text-[11px]
              font-black
              uppercase
              tracking-[0.24em]
              text-brand
            "
          >
            Annuaire LabelMoto
          </p>

          <h1
            className="
              mt-3
              max-w-4xl
              text-4xl
              font-black
              uppercase
              leading-[0.95]
              tracking-tight
              md:text-6xl
            "
          >
            Les métiers de la moto en France
          </h1>

          <p
            className="
              mt-5
              max-w-3xl
              text-base
              font-medium
              leading-relaxed
              text-muted-foreground
              md:text-lg
            "
          >
            Concessions, ateliers,
            artisans, équipementiers,
            transporteurs, créateurs
            et professionnels spécialisés :
            retrouvez l’écosystème moto
            français dans un même annuaire.
          </p>
        </div>
      </section>

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {PROFESSIONAL_CATEGORIES.map(
            category => {
              const Icon =
                ICONS[
                  category.slug
                ];

              return (
                <Link
                  key={
                    category.slug
                  }
                  href={
                    '/metiers/' +
                    category.slug
                  }
                  className="
                    group
                    rounded-[1.5rem]
                    border
                    border-border/70
                    bg-muted/20
                    p-5
                    transition
                    hover:-translate-y-0.5
                    hover:border-brand/40
                    hover:bg-white
                    hover:shadow-lg
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-brand/10
                      text-brand
                    "
                  >
                    <Icon
                      className="
                        h-5
                        w-5
                      "
                    />
                  </div>

                  <h2
                    className="
                      mt-5
                      text-lg
                      font-black
                      uppercase
                      tracking-tight
                    "
                  >
                    {category.label}
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      font-medium
                      leading-relaxed
                      text-muted-foreground
                    "
                  >
                    {category.intro}
                  </p>

                  <p
                    className="
                      mt-5
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.16em]
                      text-brand
                    "
                  >
                    Voir les professionnels →
                  </p>
                </Link>
              );
            }
          )}
        </div>
      </section>
    </main>
  );
}

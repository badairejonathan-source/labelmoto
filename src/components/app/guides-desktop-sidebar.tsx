'use client';

import React, {
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  FileText,
  Search,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  {
    id: 'ALL',
    label: 'Tout',
  },
  {
    id: 'A2',
    label: 'Permis A2',
  },
  {
    id: 'EVENT',
    label: 'Événements',
  },
  {
    id: 'TIPS',
    label: 'Conseils',
  },
];

const EXCLUDED_ARTICLE_IDS = [
  'entretien-moto-intervalles-prix-conseils-par-modele',
  'meilleurs-casques-moto-entree-de-gamme-2026',
  'meilleurs-casques-moto-milieu-de-gamme-2026',
  'meilleurs-casques-moto-haut-de-gamme-2026',
];

function normalizeArticleSearch(
  value: unknown
) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getArticleCategories(
  article: any
) {
  const id =
    String(article?.id || '')
      .toLowerCase();

  const title =
    String(
      article?.display_title ||
      article?.title ||
      ''
    ).toLowerCase();

  const categories: string[] = [];

  if (
    id.includes('a2') ||
    id.includes('occasion') ||
    id.includes('assurance') ||
    id.includes('taille') ||
    id.includes('budget') ||
    title.includes('a2') ||
    title.includes('taille') ||
    title.includes('gabarit') ||
    title.includes('débutant') ||
    id.includes('combien-coute')
  ) {
    categories.push('A2');
  }

  if (
    id.includes('motogp') ||
    id.includes('gp-france') ||
    id.includes('event') ||
    id.includes('circuit')
  ) {
    categories.push('EVENT');
  }

  if (
    id.includes('taille') ||
    id.includes('zfe') ||
    id.includes('hauteur') ||
    id.includes('entretien') ||
    id.includes('revision') ||
    id.includes('assurance') ||
    id.includes('occasion') ||
    id.includes('combien-coute') ||
    id.includes('relais')
  ) {
    categories.push('TIPS');
  }

  if (categories.length === 0) {
    categories.push('TIPS');
  }

  return categories;
}

function getArticleTime(
  article: any
) {
  const value =
    article?.publishedAt ||
    article?.date ||
    article?.submittedAt ||
    article?.updatedAt;

  if (!value) {
    return 0;
  }

  if (
    typeof value?.toMillis ===
    'function'
  ) {
    return value.toMillis();
  }

  if (
    typeof value === 'object' &&
    value.seconds !== undefined
  ) {
    return Number(
      value.seconds
    ) * 1000;
  }

  const date =
    new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? 0
    : date.getTime();
}

export default function GuidesDesktopSidebar({
  articles,
  isLoading = false,
  currentId,
}: {
  articles?: any[] | null;
  isLoading?: boolean;
  currentId?: string | null;
}) {
  const [
    query,
    setQuery,
  ] = useState('');

  const [
    activeCategory,
    setActiveCategory,
  ] = useState('ALL');

  const visibleArticles =
    useMemo(() => {
      const normalizedQuery =
        normalizeArticleSearch(
          query
        );

      return [
        ...(articles || []),
      ]
        .filter(article => {
          if (
            EXCLUDED_ARTICLE_IDS.includes(
              String(article?.id || '')
            )
          ) {
            return false;
          }

          if (
            activeCategory !==
              'ALL' &&
            !getArticleCategories(
              article
            ).includes(
              activeCategory
            )
          ) {
            return false;
          }

          if (!normalizedQuery) {
            return true;
          }

          const haystack =
            normalizeArticleSearch(
              [
                article?.display_title,
                article?.title,
                article?.description,
                article?.author,
              ]
                .filter(Boolean)
                .join(' ')
            );

          return haystack.includes(
            normalizedQuery
          );
        })
        .sort(
          (a, b) =>
            getArticleTime(b) -
            getArticleTime(a)
        );
    }, [
      articles,
      activeCategory,
      query,
    ]);

  const totalArticles =
    (articles || []).filter(
      article =>
        !EXCLUDED_ARTICLE_IDS.includes(
          String(article?.id || '')
        )
    ).length;

  return (
    <aside
      className="
        sticky
        top-[104px]
        hidden
        h-[calc(100vh-128px)]
        w-[394px]
        self-start
        flex-col
        overflow-hidden
        bg-transparent
        pr-5
        lg:flex
      "
    >
      <div
        className="
          shrink-0
          pb-5
        "
      >
        <p
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.16em]
            text-brand
          "
        >
          Guides &amp; conseils
        </p>

        <div
          className="
            mt-1
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <h2
            className="
              text-[28px]
              font-bold
              tracking-[-0.035em]
              text-foreground
            "
          >
            Articles
          </h2>

          <span
            className="
              pb-1
              text-[12px]
              font-normal
              text-muted-foreground
            "
          >
            {totalArticles} guides
          </span>
        </div>

        <label
          className="
            mt-5
            flex
            min-h-[52px]
            items-center
            gap-3
            rounded-[16px]
            border
            border-black/[0.07]
            bg-white
            px-4
            shadow-[0_4px_16px_rgba(0,0,0,0.035)]
            focus-within:border-brand/40
          "
        >
          <Search
            className="
              h-4
              w-4
              shrink-0
              text-brand
            "
          />

          <input
            value={query}
            onChange={event =>
              setQuery(
                event.target.value
              )
            }
            type="search"
            placeholder="Rechercher un article"
            className="
              min-w-0
              flex-1
              bg-transparent
              text-[13px]
              font-medium
              text-foreground
              outline-none
              placeholder:font-normal
              placeholder:text-muted-foreground
            "
          />
        </label>

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >
          {CATEGORIES.map(category => {
            const isActive =
              activeCategory ===
              category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category.id
                  )
                }
                className={cn(
                  `
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.06em]
                    transition-colors
                  `,
                  isActive
                    ? `
                        border-brand
                        bg-brand
                        text-white
                      `
                    : `
                        border-black/[0.08]
                        bg-white
                        text-muted-foreground
                        hover:border-brand/40
                        hover:text-brand
                      `
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          pb-10
          pr-2
          [scrollbar-width:thin]
        "
      >
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  rounded-2xl
                  border
                  border-black/[0.05]
                  bg-white
                  p-4
                "
              >
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : visibleArticles.length > 0 ? (
          <div className="space-y-2">
            {visibleArticles.map(
              article => {
                const articleId =
                  String(
                    article.id || ''
                  );

                const selected =
                  articleId ===
                  currentId;

                return (
                  <Link
                    key={articleId}
                    href={`/info/${articleId}`}
                    aria-current={
                      selected
                        ? 'page'
                        : undefined
                    }
                    className={cn(
                      `
                        group
                        block
                        min-h-[64px]
                        rounded-[16px]
                        border
                        px-4
                        py-4
                        transition-all
                      `,
                      selected
                        ? `
                            border-brand/30
                            bg-brand/[0.07]
                            shadow-sm
                          `
                        : `
                            border-black/[0.05]
                            bg-white
                            hover:border-brand/20
                            hover:bg-brand/[0.025]
                          `
                    )}
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <div
                        className={cn(
                          `
                            mt-0.5
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                          `,
                          selected
                            ? `
                                bg-brand
                                text-white
                              `
                            : `
                                bg-brand/10
                                text-brand
                              `
                        )}
                      >
                        <FileText
                          className="
                            h-3.5
                            w-3.5
                          "
                        />
                      </div>

                      <div className="min-w-0">
                        <h3
                          className={cn(
                            `
                              line-clamp-3
                              text-[14px]
                              font-semibold
                              leading-[1.3]
                              tracking-[-0.01em]
                              transition-colors
                            `,
                            selected
                              ? 'text-brand'
                              : `
                                  text-foreground
                                  group-hover:text-brand
                                `
                          )}
                        >
                          {article.display_title ||
                            article.title ||
                            'Sans titre'}
                        </h3>

                        <p
                          className="
                            mt-2
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.08em]
                            text-muted-foreground
                          "
                        >
                          {article.author ||
                            "L'équipe Label Moto"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-brand/25
              bg-brand/[0.03]
              px-4
              py-8
              text-center
            "
          >
            <p
              className="
                text-[12px]
                font-black
                text-foreground
              "
            >
              Aucun article trouvé
            </p>

            <p
              className="
                mt-1
                text-[11px]
                leading-relaxed
                text-muted-foreground
              "
            >
              Modifiez la recherche ou la catégorie.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
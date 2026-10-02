'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bike, ChevronDown } from 'lucide-react';

import { getMotorcycleProductImage } from '@/data/motorcycle-product-images';

type ArticleModel = {
  name: string;
  brand?: string;
  modelId?: string;
  system: string;
  badge?: string;
  href?: string;
  image?: string;
};

type Technology = {
  id: string;
  label: string;
  heading?: string;
  paragraphs?: string[];
  models?: ArticleModel[];
};

type ComparisonCard = {
  name: string;
  kicker?: string;
  rows: Array<{ label: string; value: string }>;
};

type AccordionSection = {
  id: string;
  number?: string;
  title: string;
  subtitle?: string;
  kind?: 'text' | 'brand' | 'comparison';
  paragraphs?: string[];
  technologies?: Technology[];
  default_technology?: string;
  comparison_cards?: ComparisonCard[];
};

function Paragraphs({ items = [] }: { items?: string[] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-4">
      {items.map((paragraph, index) => (
        <p
          key={`${index}-${paragraph.slice(0, 24)}`}
          className="text-[15px] sm:text-base leading-7 text-foreground/85"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function ModelCard({ model }: { model: ArticleModel }) {
  const image =
    model.image ||
    getMotorcycleProductImage({
      modelId: model.modelId || model.name,
      brand: model.brand,
      model: model.name,
      displayTitle: model.name,
      slug: model.modelId,
    });

  const body = (
    <div className="w-[260px] shrink-0 snap-start overflow-hidden rounded-[1.6rem] border border-border/60 bg-background shadow-sm sm:w-[280px]">
      <div className="relative aspect-[4/3] bg-muted/30">
        {image ? (
          <Image
            src={image}
            alt={model.name}
            fill
            className="object-contain p-4 sm:p-5"
            sizes="(max-width: 640px) 76vw, 280px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Bike className="h-16 w-16 text-muted-foreground/25" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-black text-base leading-tight text-foreground">
              {model.name}
            </h4>
            <p className="mt-1 text-xs font-bold text-brand">
              {model.system}
            </p>
          </div>

          {model.badge ? (
            <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand">
              {model.badge}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (!model.href) return body;

  return (
    <Link href={model.href} className="block w-[260px] shrink-0 sm:w-[280px]">
      {body}
    </Link>
  );
}

function ModelCarousel({ models = [] }: { models?: ArticleModel[] }) {
  if (!models.length) return null;

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h4 className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
          Modèles proposés
        </h4>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
          Faire défiler →
        </span>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 overscroll-x-contain">
        {models.map((model) => (
          <ModelCard
            key={`${model.name}-${model.system}`}
            model={model}
          />
        ))}
      </div>
    </div>
  );
}

function TechnologyPanel({
  technologies = [],
  defaultTechnology,
}: {
  technologies?: Technology[];
  defaultTechnology?: string;
}) {
  const initial =
    defaultTechnology ||
    technologies[0]?.id ||
    '';

  const [active, setActive] = useState(initial);

  if (!technologies.length) return null;

  return (
    <div>
      {technologies.length > 1 ? (
        <div className="mb-6 flex w-full gap-2 overflow-x-auto rounded-2xl bg-muted/40 p-1.5">
          {technologies.map((technology) => {
            const selected = technology.id === active;

            return (
              <button
                key={technology.id}
                type="button"
                onClick={() => setActive(technology.id)}
                className={[
                  'shrink-0 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition',
                  selected
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-transparent text-muted-foreground hover:text-foreground',
                ].join(' ')}
                aria-pressed={selected}
              >
                {technology.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {technologies.map((technology) => {
        const selected = technology.id === active;

        return (
          <div
            key={technology.id}
            className={selected ? 'block' : 'hidden'}
            aria-hidden={!selected}
          >
            {technology.heading ? (
              <h3 className="mb-4 text-xl font-black tracking-tight text-foreground">
                {technology.heading}
              </h3>
            ) : null}

            <Paragraphs items={technology.paragraphs} />
            <ModelCarousel models={technology.models} />
          </div>
        );
      })}
    </div>
  );
}

function ComparisonGrid({
  cards = [],
}: {
  cards?: ComparisonCard[];
}) {
  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.name}
          className="rounded-[1.5rem] border border-border/60 bg-background p-5 shadow-sm"
        >
          <h3 className="text-lg font-black text-foreground">
            {card.name}
          </h3>

          {card.kicker ? (
            <p className="mt-1 text-xs font-bold text-brand">
              {card.kicker}
            </p>
          ) : null}

          <dl className="mt-5 space-y-3">
            {card.rows.map((row) => (
              <div
                key={`${card.name}-${row.label}`}
                className="flex items-start justify-between gap-4 border-t border-border/50 pt-3 first:border-t-0 first:pt-0"
              >
                <dt className="text-xs font-bold text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="max-w-[58%] text-right text-xs font-black text-foreground">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function AccordionBody({
  section,
}: {
  section: AccordionSection;
}) {
  if (section.kind === 'brand') {
    return (
      <TechnologyPanel
        technologies={section.technologies}
        defaultTechnology={section.default_technology}
      />
    );
  }

  if (section.kind === 'comparison') {
    return (
      <ComparisonGrid
        cards={section.comparison_cards}
      />
    );
  }

  return <Paragraphs items={section.paragraphs} />;
}

export default function ArticleAccordionV1({
  article,
}: {
  article: any;
}) {
  const sections: AccordionSection[] =
    Array.isArray(article?.accordion_sections)
      ? article.accordion_sections
      : [];

  const [openSections, setOpenSections] =
    useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenSections((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  return (
    <div
      data-labelmoto-article-layout="accordion-v1"
      className="mt-2"
    >
      {Array.isArray(article?.intro) && article.intro.length ? (
        <div className="mb-8 space-y-4">
          {article.intro.map((paragraph: string, index: number) => (
            <p
              key={`intro-${index}`}
              className="text-base sm:text-lg leading-7 text-foreground/90"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      <div className="space-y-3 lg:hidden">
        {sections.map((section) => {
          const open = openSections.has(section.id);

          return (
            <section
              key={section.id}
              className="overflow-hidden rounded-[1.7rem] border border-border/60 bg-card shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                aria-expanded={open}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-black text-brand">
                  {section.number || section.id}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-black leading-tight text-foreground sm:text-lg">
                    {section.title}
                  </h2>

                  {section.subtitle ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                      {section.subtitle}
                    </p>
                  ) : null}
                </div>

                <ChevronDown
                  className={[
                    'h-5 w-5 shrink-0 text-brand transition-transform duration-300',
                    open ? 'rotate-180' : '',
                  ].join(' ')}
                />
              </button>

              <div
                className={[
                  'grid transition-[grid-template-rows] duration-300 ease-out',
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                ].join(' ')}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border/50 px-4 pb-6 pt-5 sm:px-5">
                    <AccordionBody section={section} />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>


      {/* Desktop editorial layout: guide beside the first two sections, then full width. */}
      <div className="hidden lg:block">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-10">
          <div className="min-w-0">
            {sections.slice(0, 2).map((section, index) => (
              <section
                key={section.id}
                id={`article-section-${section.id}`}
                className={[
                  'scroll-mt-28 py-8',
                  index === 0 ? 'pt-0' : 'border-t border-border/70',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-black text-brand">
                    {section.number || section.id}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="m-0 text-[24px] font-black leading-[1.05] tracking-[-0.035em] text-foreground xl:text-[26px]">
                      {section.title}
                    </h2>

                    <div className="mt-5">
                      <AccordionBody section={section} />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <aside className="relative">
            <div className="sticky top-4 space-y-5">
              <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
                <p className="mb-5 text-[10px] font-black uppercase tracking-[0.18em] text-brand">
                  Dans ce guide
                </p>

                <nav aria-label="Sommaire de l’article">
                  <ol className="space-y-[15px]">
                    {sections.map((section) => (
                      <li key={`guide-${section.id}`}>
                        <a
                          href={`#article-section-${section.id}`}
                          className="group flex items-start gap-3 text-[11px] leading-[1.35] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <span className="shrink-0 font-black text-brand">
                            {section.number}
                          </span>
                          <span>{section.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-brand">
                  À retenir
                </p>
                <p className="text-[12px] leading-[1.5] text-muted-foreground">
                  Toutes ces technologies n’automatisent pas la même chose. Certaines suppriment seulement l’usage de l’embrayage, d’autres peuvent aussi choisir les rapports.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="min-w-0">
          {sections.slice(2).map((section) => (
            <section
              key={section.id}
              id={`article-section-${section.id}`}
              className="scroll-mt-28 border-t border-border/70 py-8"
            >
              <div className="flex items-start gap-3">
                <div className="mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-black text-brand">
                  {section.number || section.id}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="m-0 text-[24px] font-black leading-[1.05] tracking-[-0.035em] text-foreground xl:text-[26px]">
                    {section.title}
                  </h2>

                  <div className="mt-5">
                    <AccordionBody section={section} />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {article?.conclusion ? (
          <section className="border-t border-border/70 pt-8">
            <h2 className="text-xl font-black text-foreground">
              Conclusion
            </h2>

            <div className="mt-4">
              <Paragraphs
                items={
                  Array.isArray(article.conclusion)
                    ? article.conclusion
                    : [String(article.conclusion)]
                }
              />
            </div>
          </section>
        ) : null}
      </div>

      {article?.conclusion ? (
        <div className="mt-8 rounded-[1.7rem] border border-brand/20 bg-brand/5 p-5 sm:p-6 lg:hidden">
          <h2 className="text-lg font-black text-foreground">
            Conclusion
          </h2>

          <div className="mt-4">
            <Paragraphs
              items={
                Array.isArray(article.conclusion)
                  ? article.conclusion
                  : [String(article.conclusion)]
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
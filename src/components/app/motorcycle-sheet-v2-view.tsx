/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  Bike,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  Loader2,
  MessageSquare,
  Star,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type {
  MotorcycleKnownIssueV2,
  MotorcycleSheetV2,
} from '@/lib/motorcycle-sheet-v2';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ORANGE = '#e95b0c';

interface MotorcycleSheetV2ViewProps {
  modelId: string;
  displayData: any;
  v2: MotorcycleSheetV2;

  selectedVariantIndex: number;
  onSelectVariant: (index: number) => void;

  relatedModels: any[];

  reviews: any[] | null | undefined;
  reviewsLoading: boolean;

  onLeaveReview: () => void;
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <div
          className="mb-2 text-[10px] font-black uppercase tracking-[0.22em]"
          style={{ color: ORANGE }}
        >
          {eyebrow}
        </div>
      ) : null}

      <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 md:text-3xl">
        {title}
      </h2>

      {text ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
          {text}
        </p>
      ) : null}
    </div>
  );
}

function confidenceLabel(type?: string) {
  switch (type) {
    case 'official_fr':
      return 'Constructeur France';
    case 'official_eu':
      return 'Manuel Europe';
    case 'official_other_market':
      return 'Constructeur autre marché';
    case 'technical_documentation':
      return 'Documentation technique';
    case 'multiple_sources':
      return 'Sources recoupées';
    case 'observed':
      return 'Prix / donnée observée';
    case 'estimate':
      return 'Estimation LabelMoto';
    case 'to_confirm':
      return 'À confirmer';
    default:
      return null;
  }
}

function issueLabel(issue: MotorcycleKnownIssueV2) {
  switch (issue.type) {
    case 'recall':
      return 'Rappel officiel';
    case 'documented_issue':
      return 'Problème documenté';
    case 'owner_feedback':
      return 'Retours propriétaires';
    case 'manufacturer_monitoring':
      return 'Surveillance constructeur';
    case 'usage_limitation':
      return 'Point à connaître';
    default:
      return 'Point à surveiller';
  }
}

export default function MotorcycleSheetV2View({
  modelId,
  displayData,
  v2,
  selectedVariantIndex,
  onSelectVariant,
  relatedModels,
  reviews,
  reviewsLoading,
  onLeaveReview,
}: MotorcycleSheetV2ViewProps) {
  const quickFacts =
    v2.quick_facts && v2.quick_facts.length > 0
      ? v2.quick_facts
      : [
          { label: 'PUISSANCE', value: displayData.engine.power },
          { label: 'POIDS', value: displayData.dimensions.wetWeight },
          { label: 'SELLE', value: displayData.dimensions.seatHeight },
          { label: 'PERMIS', value: displayData.engine.bridage },
        ];

  const schedule =
    v2.service_schedule_v2 && v2.service_schedule_v2.length > 0
      ? v2.service_schedule_v2
      : (displayData.serviceSchedule || []).map((item: any) => ({
          km: Number(item.km || 0),
          title: item.service_label || 'Révision',
          price_estimate: item.price_estimate,
          price_type: 'estimate',
          operations: [
            {
              label:
                item.service_label ||
                item.operations ||
                'Opérations selon plan constructeur',
            },
          ],
        }));

  const maintenanceDetails = v2.maintenance_details || [];

  /*
   * En V2, les consommables ne doivent pas répéter
   * les informations déjà présentes dans maintenance_details.
   *
   * On affiche donc uniquement consumables_v2 lorsqu'il a été
   * volontairement renseigné avec des données supplémentaires.
   */
  const consumables = v2.consumables_v2 || [];

  const issues: MotorcycleKnownIssueV2[] =
    v2.known_issues_v2 && v2.known_issues_v2.length > 0
      ? v2.known_issues_v2
      : (displayData.knownIssues || []).map((text: string) => ({
          title: 'Point à surveiller',
          description: text,
          type: 'usage_limitation' as const,
          confidence: 'to_confirm' as const,
        }));

  const faq = displayData.faq || [];

  const equivalents =
    v2.equivalents_v2 && v2.equivalents_v2.length > 0
      ? v2.equivalents_v2
      : relatedModels.map((m: any) => ({
          id: m.id,
          name: m.name,
          reason: m.cc ? `${m.cc} cm³` : undefined,
        }));

  const budgetCards =
    v2.budget?.cards && v2.budget.cards.length > 0
      ? v2.budget.cards
      : displayData.maintenanceCost
        ? [
            {
              label: 'Coût sur 60 000 km',
              value: displayData.maintenanceCost.total_60000km || '—',
            },
            {
              label: 'Coût au km',
              value: displayData.maintenanceCost.cost_per_km || '—',
            },
            {
              label: 'Intervalle',
              value: displayData.maintenanceCost.interval_rule || '—',
            },
          ]
        : [];

  return (
    <>
      {/* HERO */}
      <section className="overflow-hidden rounded-[28px] bg-zinc-950 shadow-xl">
        <div className="relative h-[280px] md:h-[370px]">
          <Image
            src={displayData.imageUrl}
            alt={displayData.modelName || displayData.model || 'Moto'}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/5" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
            <div
              className="mb-3 inline-flex rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white"
              style={{ backgroundColor: ORANGE }}
            >
              Fiche entretien enrichie
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">
              {displayData.modelName}
            </h1>

            <p
              className="mt-2 text-base font-black italic md:text-xl"
              style={{ color: '#ff7a22' }}
            >
              Millésime {displayData.year}
            </p>

            {v2.hero_subtitle ? (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
                {v2.hero_subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* CHIFFRES CLES */}
      <section
        className={cn(
          '-mt-1 grid overflow-hidden rounded-b-[24px] border border-zinc-200 bg-white shadow-sm',
          quickFacts.length >= 6
            ? 'sm:grid-cols-3 lg:grid-cols-6'
            : 'sm:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {quickFacts.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="border-b border-r border-zinc-100 px-4 py-4 last:border-r-0 sm:border-b-0"
          >
            <div className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400">
              {item.label}
            </div>

            <div className="mt-1 text-base font-black text-zinc-900 md:text-lg">
              {item.value}
            </div>
          </div>
        ))}
      </section>

      {/* VARIANTES */}
      {displayData.hasVariants ? (
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
              Sélectionnez la version
            </span>

            <div className="flex flex-wrap justify-center gap-1 rounded-full bg-zinc-100 p-1">
              {displayData.variants.map((variant: any, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectVariant(index)}
                  className={cn(
                    'rounded-full px-6 py-2 text-[9px] font-black uppercase transition',
                    selectedVariantIndex === index
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-zinc-600 hover:bg-white'
                  )}
                >
                  {variant.label || `Variante ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ENTRETIEN EN BREF */}
      {v2.quick_maintenance && v2.quick_maintenance.length > 0 ? (
        <section className="mt-8 rounded-[26px] border border-orange-100 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <div
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: ORANGE }}
              >
                À retenir en 10 secondes
              </div>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-tight">
                Entretien en bref
              </h2>
            </div>

            <div className="hidden rounded-full bg-green-50 px-3 py-1 text-[9px] font-black uppercase text-green-700 md:block">
              Données vérifiées
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {v2.quick_maintenance.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4"
              >
                <div className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400">
                  {item.label}
                </div>

                <div className="mt-1 text-sm font-black text-zinc-900">
                  {item.value}
                </div>

                {confidenceLabel(item.confidence) ? (
                  <div className="mt-2 text-[9px] font-bold text-zinc-400">
                    {confidenceLabel(item.confidence)}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* NAVIGATION */}
      <nav className="sticky top-2 z-30 mt-6 overflow-x-auto rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-lg backdrop-blur">
        <div className="flex min-w-max gap-1">
          {[
            ['#technique', 'Technique'],
            ['#revisions', 'Révisions'],
            ['#budget', 'Budget'],
            ['#detail', 'Entretien détaillé'],
            ['#fiabilite', 'Fiabilité'],
            ['#faq', 'FAQ'],
            ['#sources', 'Sources'],
            ['#reviews', 'Avis'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-600 transition hover:bg-orange-50 hover:text-orange-700"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* TECHNIQUE */}
      <section id="technique" className="scroll-mt-24 py-12">
        <SectionTitle
          eyebrow="Fiche technique"
          title="Les chiffres utiles"
          text="Les données correspondant au marché français sont prioritaires lorsqu’elles diffèrent d’un autre marché."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-black uppercase">
              Moteur & performances
            </h3>

            <div className="space-y-3 text-sm">
              {[
                ['Type', displayData.engine.type],
                ['Cylindrée', displayData.engine.displacement],
                ['Puissance', displayData.engine.power],
                ['Couple', displayData.engine.torque],
                ['Alimentation', displayData.engine.alimentation],
                ['Permis', displayData.engine.bridage],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-zinc-400">{label}</span>
                  <span className="text-right font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-black uppercase">
              Châssis & dimensions
            </h3>

            <div className="space-y-3 text-sm">
              {[
                ['Poids', displayData.dimensions.wetWeight],
                ['Hauteur de selle', displayData.dimensions.seatHeight],
                ['Réservoir', displayData.dimensions.tank],
                ['Pneu avant', displayData.cycleParts.frontTire],
                ['Pneu arrière', displayData.cycleParts.rearTire],
                ['Frein avant', displayData.cycleParts.frontBrake],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-zinc-400">{label}</span>
                  <span className="max-w-[65%] text-right font-bold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GUIDE */}
      <div className="pb-5 text-center">
        <div
          className="text-[10px] font-black uppercase tracking-[0.24em]"
          style={{ color: ORANGE }}
        >
          Propriétaire ou futur acheteur
        </div>

        <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">
          Guide entretien & prix
        </h2>

        {displayData.introduction ? (
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-zinc-500">
            {displayData.introduction}
          </p>
        ) : null}
      </div>

      {/* REVISIONS */}
      <section
        id="revisions"
        className="scroll-mt-24 overflow-hidden rounded-[28px] bg-white shadow-xl"
      >
        <div
          className="flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-white"
          style={{ backgroundColor: ORANGE }}
        >
          <ClipboardList className="h-5 w-5" />
          Calendrier des révisions
        </div>

        <div className="divide-y divide-zinc-100">
          {schedule.map((service: any, index: number) => (
            <div
              key={`${service.km}-${index}`}
              className="grid gap-4 px-5 py-6 md:grid-cols-[130px_1fr_160px] md:px-7"
            >
              <div>
                <div
                  className="text-sm font-black"
                  style={{ color: ORANGE }}
                >
                  {service.km
                    ? `${Number(service.km).toLocaleString('fr-FR')} KM`
                    : 'ÉCHÉANCE'}
                </div>

                <div className="mt-1 text-[9px] font-black uppercase tracking-wide text-zinc-400">
                  {service.title}
                </div>
              </div>

              <ul className="grid gap-1.5 text-sm text-zinc-600 md:grid-cols-2">
                {(service.operations || []).map((operation: any, opIndex: number) => (
                  <li
                    key={`${operation.label}-${opIndex}`}
                    className="flex gap-2"
                  >
                    <span style={{ color: ORANGE }}>•</span>
                    <span>{operation.label}</span>
                  </li>
                ))}
              </ul>

              <div className="md:text-right">
                <div className="text-[9px] font-black uppercase tracking-wide text-zinc-400">
                  Budget indicatif
                </div>

                <div
                  className="mt-1 text-sm font-black"
                  style={{ color: ORANGE }}
                >
                  {service.price_estimate || 'NC'}
                </div>

                {service.price_type ? (
                  <div className="mt-1 text-[8px] font-bold uppercase text-zinc-400">
                    {service.price_type === 'official'
                      ? 'Tarif officiel'
                      : service.price_type === 'observed'
                        ? 'Tarif observé'
                        : service.price_type === 'mixed'
                          ? 'Observé / estimé'
                          : 'Estimation'}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUDGET */}
      {budgetCards.length > 0 ? (
        <section
          id="budget"
          className="scroll-mt-24 mt-8 rounded-[28px] p-6 text-white shadow-xl md:p-8"
          style={{
            background:
              'linear-gradient(135deg, #e95b0c 0%, #f97316 55%, #fb923c 100%)',
          }}
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/75">
            {v2.budget?.title || 'Budget entretien sur la durée'}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {budgetCards.map((card: any, index: number) => (
              <div
                key={`${card.label}-${index}`}
                className="rounded-2xl border border-white/30 bg-white/10 p-5"
              >
                <div className="text-[9px] font-black uppercase text-white/70">
                  {card.label}
                </div>

                <div className="mt-2 text-xl font-black md:text-2xl">
                  {card.value}
                </div>

                {card.note ? (
                  <p className="mt-1 text-xs text-white/80">
                    {card.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {v2.budget?.note ? (
            <p className="mt-5 border-t border-white/20 pt-4 text-xs leading-5 text-white/80">
              {v2.budget.note}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* DETAIL */}
      {maintenanceDetails.length > 0 ? (
        <section id="detail" className="scroll-mt-24 py-12">
          <SectionTitle
            eyebrow="Documentation propriétaire"
            title="Entretien détaillé par organe"
            text="Ouvrez uniquement la rubrique qui vous intéresse."
          />

          <div className="space-y-3">
            {maintenanceDetails.map((section) => (
              <details
                key={section.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5">
                  <div>
                    <div className="font-black">{section.title}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      {section.summary}
                    </div>
                  </div>

                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-lg font-bold transition group-open:rotate-45"
                    style={{ color: ORANGE }}
                  >
                    +
                  </div>
                </summary>

                <div className="border-t border-zinc-100 px-5 py-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    {section.rows.map((row, index) => (
                      <div
                        key={`${row.label}-${index}`}
                        className="rounded-xl bg-zinc-50 px-4 py-3"
                      >
                        <div className="text-[9px] font-black uppercase tracking-wide text-zinc-400">
                          {row.label}
                        </div>

                        <div className="mt-1 text-sm font-bold">
                          {row.value}
                        </div>

                        {confidenceLabel(row.confidence) ? (
                          <div className="mt-2 text-[9px] font-bold text-zinc-400">
                            {confidenceLabel(row.confidence)}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  {section.note ? (
                    <p className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-xs leading-5 text-orange-950">
                      {section.note}
                    </p>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {/* CONSOMMABLES */}
      {consumables.length > 0 ? (
        <section className="pb-12">
          <SectionTitle
            eyebrow="Références utiles"
            title="Consommables & pièces courantes"
          />

          <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.2fr_1.4fr_1.2fr_1fr] gap-4 border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-[9px] font-black uppercase tracking-wide text-zinc-400 md:grid">
              <div>Élément</div>
              <div>Spécification / référence</div>
              <div>Échéance</div>
              <div>Prix / source</div>
            </div>

            <div className="divide-y divide-zinc-100">
              {consumables.map((item: any, index: number) => (
                <div
                  key={`${item.part}-${index}`}
                  className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1.2fr_1.4fr_1.2fr_1fr] md:gap-4"
                >
                  <div className="font-black">{item.part}</div>

                  <div className="text-zinc-600">
                    {item.reference_oem ||
                      item.specification ||
                      '—'}
                  </div>

                  <div className="text-zinc-600">
                    {item.replacement_interval ||
                      item.average_lifetime ||
                      'Selon état'}
                  </div>

                  <div>
                    <div className="font-bold text-zinc-800">
                      {item.observed_price || '—'}
                    </div>

                    {confidenceLabel(item.source_type) ? (
                      <div className="mt-1 text-[9px] font-bold text-zinc-400">
                        {confidenceLabel(item.source_type)}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FIABILITE */}
      <section id="fiabilite" className="scroll-mt-24">
        <SectionTitle
          eyebrow="Ne pas confondre rumeur et défaut"
          title="Fiabilité & points à surveiller"
        />

        {issues.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {issues.map((issue, index) => (
              <div
                key={`${issue.title}-${index}`}
                className="rounded-[22px] border border-orange-200 bg-orange-50 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase text-orange-900">
                    {issueLabel(issue)}
                  </span>

                  {confidenceLabel(issue.confidence) ? (
                    <span className="rounded-full bg-white px-2 py-1 text-[8px] font-black uppercase text-zinc-500">
                      {confidenceLabel(issue.confidence)}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 font-black text-zinc-950">
                  {issue.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  {issue.description}
                </p>

                {issue.source_note ? (
                  <p className="mt-3 text-[10px] leading-5 text-zinc-500">
                    {issue.source_note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-green-200 bg-green-50 p-5 text-sm font-bold text-green-900">
            Aucun point particulier documenté dans les données actuellement disponibles.
          </div>
        )}

        {displayData.longevityTips?.length > 0 ? (
          <div className="mt-5 rounded-[24px] border border-green-200 bg-green-50 p-6">
            <div className="text-xs font-black uppercase text-green-800">
              Conseils de longévité
            </div>

            <ul className="mt-4 grid gap-3 text-sm leading-6 text-green-950 md:grid-cols-2">
              {displayData.longevityTips.map((tip: string, index: number) => (
                <li key={index} className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* GARANTIE */}
      {v2.warranty ? (
        <section className="mt-8 rounded-[24px] border border-orange-200 bg-white p-6 shadow-sm md:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div className="max-w-2xl">
              <div
                className="text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: ORANGE }}
              >
                Garantie constructeur {v2.warranty.market || ''}
              </div>

              <h3 className="mt-1 text-xl font-black text-zinc-950 md:text-2xl">
                Conditions de la garantie commerciale
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Les conditions ci-dessous correspondent au marché et au
                millésime vérifiés pour cette fiche.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 sm:min-w-[190px]">
              <div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-700">
                Durée constructeur
              </div>

              <div className="mt-1 text-3xl font-black text-zinc-950">
                {v2.warranty.duration}
              </div>

              {v2.warranty.coverage ? (
                <div className="mt-1 text-xs font-bold text-zinc-600">
                  {v2.warranty.coverage}
                </div>
              ) : null}
            </div>

          </div>


          <div className="mt-6 grid gap-3 md:grid-cols-3">

            {v2.warranty.maintenance_requirement ? (
              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">
                  Entretien
                </div>

                <p className="mt-2 text-xs leading-5 text-zinc-700">
                  {v2.warranty.maintenance_requirement}
                </p>
              </div>
            ) : null}


            {v2.warranty.claim_requirement ? (
              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">
                  Prise en charge
                </div>

                <p className="mt-2 text-xs leading-5 text-zinc-700">
                  {v2.warranty.claim_requirement}
                </p>
              </div>
            ) : null}


            {v2.warranty.invoice_advice ? (
              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">
                  Justificatifs
                </div>

                <p className="mt-2 text-xs leading-5 text-zinc-700">
                  {v2.warranty.invoice_advice}
                </p>
              </div>
            ) : null}

          </div>


          {v2.warranty.original_parts_note ? (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">

              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-800">
                Conseil LabelMoto
              </div>

              <p className="mt-2 text-xs leading-5 text-zinc-700">
                {v2.warranty.original_parts_note}
              </p>

            </div>
          ) : null}


          <div className="mt-5 flex flex-col gap-2 border-t border-zinc-100 pt-4 text-[10px] leading-5 text-zinc-400 md:flex-row md:items-center md:justify-between">

            {v2.warranty.legal_warranty_note ? (
              <span>
                {v2.warranty.legal_warranty_note}
              </span>
            ) : (
              <span />
            )}

            {v2.warranty.source_label ? (
              <span className="font-bold text-zinc-500">
                Source : {v2.warranty.source_label}
              </span>
            ) : null}

          </div>

        </section>
      ) : null}



      {/* FAQ */}
      {faq.length > 0 ? (
        <section id="faq" className="scroll-mt-24 py-12">
          <SectionTitle
            eyebrow="Recherche rapide"
            title="Questions fréquentes"
          />

          <div className="space-y-3">
            {faq.map((item: any, index: number) => (
              <details
                key={index}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-sm font-black">
                  {item.question || item.q}

                  <span
                    className="text-xl transition group-open:rotate-45"
                    style={{ color: ORANGE }}
                  >
                    +
                  </span>
                </summary>

                <p className="border-t border-zinc-100 px-5 py-5 text-sm leading-6 text-zinc-600">
                  {item.answer || item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {/* EQUIVALENTS */}
      {equivalents.length > 0 ? (
        <section>
          <SectionTitle
            eyebrow="Comparer avant d’acheter"
            title="Modèles équivalents"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {equivalents.map((model: any, index: number) => {
              const content = (
                <>
                  <div className="text-sm font-black">{model.name}</div>

                  {model.reason ? (
                    <div className="mt-1 text-xs leading-5 text-zinc-400">
                      {model.reason}
                    </div>
                  ) : null}

                  <div
                    className="mt-4 flex items-center gap-1 text-[10px] font-black uppercase"
                    style={{ color: ORANGE }}
                  >
                    À comparer
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </>
              );

              if (model.id) {
                return (
                  <Link
                    key={model.id}
                    href={`/fiches/${model.id}?from=${modelId}`}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  key={`${model.name}-${index}`}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* VERDICT */}
      {v2.verdict || displayData.conclusion ? (
        <section
          className="mt-12 overflow-hidden rounded-[28px] border border-orange-200 p-6 shadow-xl md:p-8"
          style={{
            background:
              'linear-gradient(135deg, #fff7ed 0%, #ffedd5 22%, #fdba74 58%, #f97316 100%)',
          }}
        >
          <div className="grid gap-6 md:grid-cols-[120px_1fr] md:items-center">
            {v2.verdict?.score ? (
              <div>
                <div className="text-5xl font-black text-zinc-950">
                  {String(v2.verdict.score).replace('.', ',')}
                </div>

                <div className="text-xs font-black uppercase tracking-wider text-zinc-600">
                  / 10
                </div>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/50">
                <Bike className="h-8 w-8 text-orange-900" />
              </div>
            )}

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-950">
                Verdict LabelMoto
              </div>

              <h3 className="mt-1 text-2xl font-black text-zinc-950 md:text-3xl">
                {v2.verdict?.title || 'Notre avis'}
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-800">
                {v2.verdict?.text || displayData.conclusion}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {(v2.verdict?.strengths || []).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-zinc-900/10 bg-white/60 px-3 py-1.5 text-[10px] font-black uppercase text-zinc-900"
                  >
                    + {item}
                  </span>
                ))}

                {(v2.verdict?.weaknesses || []).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-orange-900/20 bg-orange-950/10 px-3 py-1.5 text-[10px] font-black uppercase text-orange-950"
                  >
                    À surveiller : {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* QUALITE DES DONNEES */}
      {v2.data_quality ? (
        <section
          id="sources"
          className="scroll-mt-24 mt-8 rounded-[28px] border border-green-200 bg-white p-6 shadow-sm md:p-8"
        >
          <SectionTitle
            eyebrow="Signature LabelMoto"
            title="Qualité des données"
            text="Les données constructeur, les informations recoupées et les estimations sont volontairement distinguées."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                'Marché de référence',
                v2.data_quality.market,
              ],
              [
                'Millésime principal',
                v2.data_quality.model_year,
              ],
              [
                'Constructeur France',
                v2.data_quality.manufacturer_fr_verified
                  ? 'Vérifié'
                  : 'Non vérifié',
              ],
              [
                'Manuel européen',
                v2.data_quality.european_manual_verified
                  ? 'Vérifié'
                  : 'Non vérifié',
              ],
              [
                'Documentation technique',
                v2.data_quality.technical_documentation_verified
                  ? 'Vérifiée'
                  : 'À compléter',
              ],
              [
                'Dernière vérification',
                v2.data_quality.last_verified,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="text-[9px] font-black uppercase tracking-wide text-zinc-400">
                  {label}
                </div>

                <div className="mt-1 text-sm font-black text-zinc-900">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {v2.data_quality.sources &&
          v2.data_quality.sources.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-zinc-200 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                Sources principales
              </div>

              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {v2.data_quality.sources.map((source, index) => (
                  <div
                    key={`${source.label}-${index}`}
                    className="rounded-xl bg-zinc-50 px-4 py-3"
                  >
                    <div className="text-sm font-bold">
                      {source.label}
                    </div>

                    <div className="mt-1 text-[9px] font-bold text-zinc-400">
                      {confidenceLabel(source.type)}
                      {source.market ? ` · ${source.market}` : ''}
                      {source.model_year
                        ? ` · ${source.model_year}`
                        : ''}
                    </div>

                    {source.note ? (
                      <div className="mt-2 text-[10px] leading-5 text-zinc-500">
                        {source.note}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* AVIS */}
      <section
        id="reviews"
        className="scroll-mt-28 space-y-8 py-12"
      >
        <div className="flex flex-col justify-between gap-4 border-b-4 border-orange-500 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <h2 className="flex items-center gap-3 text-3xl font-black uppercase tracking-tighter">
              <MessageSquare className="h-8 w-8 text-orange-600" />
              Avis des motards
            </h2>

            <div className="rounded-full bg-orange-600 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow">
              {reviews?.length || 0} avis
            </div>
          </div>

          <Button
            onClick={onLeaveReview}
            className="h-12 rounded-full bg-zinc-950 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-orange-600"
          >
            Laisser un avis
          </Button>
        </div>

        {reviewsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid gap-6">
            {reviews.map((review: any) => (
              <Card
                key={review.id}
                className="overflow-hidden rounded-[2rem] border-2 bg-white shadow-md"
              >
                <CardContent className="p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                        <User className="h-6 w-6" />
                      </div>

                      <div>
                        <p className="text-sm font-black uppercase leading-none">
                          {review.userName || 'Motard'}
                        </p>

                        <p className="mt-1 text-[10px] font-bold text-zinc-400">
                          {review.date
                            ? formatDistanceToNow(
                                new Date(
                                  review.date.seconds
                                    ? review.date.seconds * 1000
                                    : review.date
                                ),
                                {
                                  addSuffix: true,
                                  locale: fr,
                                }
                              )
                            : 'Récemment'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={cn(
                            'h-4 w-4',
                            index < (review.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-zinc-200'
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-base font-bold italic leading-relaxed text-zinc-700">
                    "{review.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-zinc-200 bg-white p-12 text-center">
            <p className="font-black uppercase text-zinc-500">
              Aucun avis pour le moment.
            </p>

            <p className="mt-2 text-xs font-bold text-zinc-400">
              Soyez le premier à partager votre expérience et vos conseils sur ce modèle.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

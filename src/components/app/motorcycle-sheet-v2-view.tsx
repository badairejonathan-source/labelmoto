/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as ReactTabs from 'react';
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

const CFMOTO_800MT_CONSUMABLE_PRICES: Record<string, string> = {
  huile: '≈ 60–70 €',
  air: '≈ 50 €',
  bougie: '≈ 43 € les 2',
  soupapes: 'Inclus révision 30 000 km',
  refroidissement: '≈ 18–29 €',
  freinage: 'Liquide ≈ 10 € · plaquettes AV ≈ 73–88 €',
  pneus: '≈ 290–330 € montés',
  chaine: '≈ 130–170 € hors pose',
};

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

  // ==========================================================
  // PROTOTYPE TABS — CFMOTO 800MT UNIQUEMENT
  // ==========================================================

  const is800mtTabbedPrototype =
    modelId === 'cfmoto-800mt-sport-explore-2023-plus';

  const prototypeTabs = [
    { id: 'revisions', label: 'Révisions' },
    { id: 'consommables', label: 'Consommables' },
    { id: 'garantie', label: 'Garantie' },
    { id: 'faq', label: 'FAQ' },
    { id: 'sources', label: 'Sources' },
    { id: 'reviews', label: 'Avis' },
  ];

  const [activePrototypeTab, setActivePrototypeTab] =
    ReactTabs.useState('revisions');

  ReactTabs.useEffect(() => {
    if (!is800mtTabbedPrototype) return;

    const validTabs = prototypeTabs.map((tab) => tab.id);

    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');

      if (validTabs.includes(hash)) {
        setActivePrototypeTab(hash);
      }
    };

    syncFromHash();

    window.addEventListener('hashchange', syncFromHash);

    return () => {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [is800mtTabbedPrototype]);

  ReactTabs.useEffect(() => {
    if (!is800mtTabbedPrototype) return;

    const sections =
      document.querySelectorAll<HTMLElement>(
        '[data-v2-tab-section]'
      );

    sections.forEach((section) => {
      const tab = section.dataset.v2TabSection;

      section.hidden =
        tab !== activePrototypeTab;
    });

    return () => {
      sections.forEach((section) => {
        section.hidden = false;
      });
    };
  }, [
    activePrototypeTab,
    is800mtTabbedPrototype,
  ]);

  const openPrototypeTab = (tabId: string) => {
    setActivePrototypeTab(tabId);

    window.history.replaceState(
      null,
      '',
      `#${tabId}`
    );
  };

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
            className="object-cover brightness-[1.38] saturate-[1.08] contrast-[1.02]"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">

            <h1 className="max-w-3xl text-[32px] font-black leading-[0.98] tracking-[-0.04em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] md:text-5xl">
              {displayData.modelName}
            </h1>

            <p
              className="mt-3 text-sm font-black italic md:text-lg"
              style={{ color: '#ff7a22' }}
            >
              Millésime {displayData.year}
            </p>
          </div>
        </div>
      </section>

      {/* CHIFFRES CLES */}
      {is800mtTabbedPrototype ? (
        <section
          id="v2-quickfacts-carousel"
          className="-mt-1 overflow-hidden rounded-b-[24px] border border-zinc-200 bg-white shadow-sm"
        >
          <div
            id="v2-quickfacts-heading"
            className="px-4 pb-1 pt-4"
          >
            <div
              className="text-[9px] font-black uppercase tracking-[0.2em]"
              style={{ color: ORANGE }}
            >
              En un coup d'œil
            </div>

            <div className="mt-1 text-xl font-black uppercase tracking-[-0.03em] text-zinc-950">
              Les chiffres clés
            </div>
          </div>

          <div className="overflow-hidden px-3 pt-3 md:px-0 md:pt-0">
            <div
              className="
                flex snap-x snap-mandatory gap-3
                overflow-x-auto pb-2 pr-10
                [scrollbar-width:thin] [scrollbar-color:#f97316_#f4f4f5]
                [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-500
                md:grid md:grid-cols-6
                md:gap-0 md:overflow-visible
                md:px-0 md:pr-0
              "
            >
              {quickFacts.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="
                    min-w-[128px] snap-start
                    rounded-2xl border border-zinc-100
                    bg-zinc-50 px-4 py-4
                    md:min-w-0 md:rounded-none
                    md:border-0 md:border-r
                    md:border-zinc-100
                    md:bg-white md:px-4 md:py-4
                    md:last:border-r-0
                  "
                >
                  <div
                    className="
                      whitespace-nowrap
                      text-[8px] font-black
                      uppercase tracking-[0.14em]
                      text-zinc-400
                    "
                  >
                    {item.label}
                  </div>

                  <div
                    className="
                      mt-1 whitespace-nowrap
                      text-base font-black
                      leading-tight text-zinc-950
                      md:text-lg
                    "
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>

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

        </>
      )}
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


      {/* TECHNIQUE ACCORDEON 800MT */}
      {is800mtTabbedPrototype ? (
        <details
          id="technique-complete-800mt"
          className="group mt-4 overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <div
                className="text-[9px] font-black uppercase tracking-[0.18em]"
                style={{ color: ORANGE }}
              >
                Caractéristiques
              </div>

              <div className="mt-1 text-sm font-black text-zinc-950 md:text-base">
                Fiche technique complète
              </div>

              <div className="mt-1 text-[10px] leading-4 text-zinc-400">
                Moteur, performances, dimensions et partie-cycle
              </div>
            </div>

            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xl font-black transition-transform group-open:rotate-45"
              style={{ color: ORANGE }}
            >
              +
            </div>
          </summary>

          <div className="border-t border-zinc-100 bg-zinc-50/40 px-4 pb-5 pt-5 md:px-5">

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
      
          </div>
        </details>
      ) : null}
      {/* ENTRETIEN EN BREF */}
      {v2.quick_maintenance && v2.quick_maintenance.length > 0 ? (
        <section hidden={is800mtTabbedPrototype} className="mt-8 rounded-[26px] border border-orange-100 bg-white p-5 shadow-sm md:p-7">
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
      {is800mtTabbedPrototype ? (
        <nav
          id="v2-tabs-navigation"
          className="sticky top-2 z-30 mt-6 rounded-2xl border border-zinc-200 bg-white/95 p-1.5 shadow-lg backdrop-blur"
        >
          <div className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#f97316_#f4f4f5] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-500">
            {prototypeTabs.map((tab) => {
              const active =
                activePrototypeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    openPrototypeTab(tab.id)
                  }
                  className={cn(
                    'shrink-0 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wide transition',
                    active
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-zinc-500 hover:bg-orange-50 hover:text-orange-700'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
</nav>
      ) : (
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
      )}
      {!is800mtTabbedPrototype ? (
        <>
      {/* TECHNIQUE */}
      <section id="technique" data-v2-tab-section="technique" className="scroll-mt-24 py-12">
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


        </>
      ) : null}
      {/* GUIDE */}
      {/* En mode onglets, le guide est intégré directement aux lignes de révision */}

      {/* REVISIONS */}
      <section
        id="revisions"
        data-v2-tab-section="revisions"
        className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6"
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div
              className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600"
              style={{ color: ORANGE }}
            >
              Calendrier d'entretien
            </div>

            <h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">
              Révisions
            </h2>
          </div>

          <div className="text-right text-[10px] font-bold uppercase leading-4 text-zinc-400">
            Touchez une ligne
            <br />
            pour le détail
          </div>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-sm">
          {schedule.map((service: any, index: number) => (
            <details
              key={`${service.km}-${index}`}
              className="group border-b border-zinc-100 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 transition hover:bg-zinc-50 md:px-5">
                <div className="min-w-0 flex-1">
                  <div
                    className="text-base font-black leading-none md:text-lg"
                    style={{ color: ORANGE }}
                  >
                    {service.km
                      ? `${Number(service.km).toLocaleString('fr-FR')} KM`
                      : 'ÉCHÉANCE'}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">
                    Prix estimé
                  </div>

                  <div className="mt-0.5 text-base font-black text-zinc-950 md:text-lg">
                    {service.price_estimate || 'NC'}
                  </div>
                </div>

                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg font-black transition-transform group-open:rotate-90"
                  style={{ color: ORANGE }}
                >
                  ›
                </div>
              </summary>

              <div className="border-t border-zinc-100 bg-zinc-50/70 px-4 pb-5 pt-4 md:px-5">
                <div className="mb-3">
                  <div className="text-[9px] font-black uppercase tracking-wide text-zinc-400">
                    Opérations prévues
                  </div>

                  <div className="mt-1 text-sm font-black text-zinc-900">
                    {service.title}
                  </div>
                </div>

                <ul className="grid gap-2 text-xs leading-5 text-zinc-600 sm:grid-cols-2">
                  {(service.operations || []).map(
                    (operation: any, opIndex: number) => (
                      <li
                        key={`${operation.label}-${opIndex}`}
                        className="flex gap-2"
                      >
                        <span
                          className="font-black"
                          style={{ color: ORANGE }}
                        >
                          •
                        </span>

                        <span>
                          {operation.label}
                        </span>
                      </li>
                    )
                  )}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 pt-3">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-zinc-400">
                    Estimation LabelMoto
                  </span>

                  <span className="text-[10px] font-black text-zinc-600">
                    TTC · pièces + main-d'œuvre
                  </span>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
      {/* BUDGET */}
      {!is800mtTabbedPrototype && budgetCards.length > 0 ? (
        <section
          id="budget" data-v2-tab-section="revisions"
          className="scroll-mt-24 mt-8 rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm md:p-7"
        >
          <div className="flex flex-col gap-2 border-b border-zinc-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: ORANGE }}
              >
                Budget atelier
              </div>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-tight">
                {v2.budget?.title || 'Repères de prix'}
              </h2>
            </div>

            <div className="text-[9px] font-bold uppercase tracking-wide text-zinc-400">
              Estimations TTC · France
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {budgetCards.map((card: any, index: number) => (
              <div
                key={`${card.label}-${index}`}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
              >
                <div className="text-[9px] font-black uppercase tracking-wide text-zinc-500">
                  {card.label}
                </div>

                <div
                  className="mt-3 text-2xl font-black md:text-3xl"
                  style={{ color: ORANGE }}
                >
                  {card.value}
                </div>

                {card.note ? (
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {card.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {v2.budget?.note ? (
            <div className="mt-5 flex gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
              <div
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-black"
                style={{ color: ORANGE }}
              >
                i
              </div>

              <p className="text-[11px] leading-5 text-zinc-600">
                {v2.budget.note}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
      {/* DETAIL */}
      {maintenanceDetails.length > 0 ? (
        <section id="detail" data-v2-tab-section="consommables" className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-5">
            <div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">
              Documentation propriétaire
            </div>

            <h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">
              Pièces & consommables
            </h2>
          </div>

          <div className="space-y-3">
            {maintenanceDetails.map((section) => (
              <details
                key={section.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5">
                  <div className="min-w-0 flex-1">
                    <div className="font-black">{section.title}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      {section.summary}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">

                    {is800mtTabbedPrototype &&
                    CFMOTO_800MT_CONSUMABLE_PRICES[section.id] ? (
                      <div className="max-w-[150px] rounded-xl bg-orange-50 px-2.5 py-2 text-right">
                        <div className="text-[7px] font-black uppercase tracking-[0.12em] text-orange-500">
                          Prix indicatif
                        </div>

                        <div className="mt-0.5 text-[10px] font-black leading-3 text-orange-700">
                          {CFMOTO_800MT_CONSUMABLE_PRICES[section.id]}
                        </div>
                      </div>
                    ) : null}

                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg font-bold transition group-open:rotate-45"
                      style={{ color: ORANGE }}
                    >
                      +
                    </div>

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
        <section data-v2-tab-section="consommables" className="mt-4 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
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

      {!is800mtTabbedPrototype ? (
        <>
      {/* FIABILITE */}
      <section id="fiabilite" data-v2-tab-section="fiabilite" className="scroll-mt-24">
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


        </>
      ) : null}
      {/* GARANTIE */}
      {v2.warranty ? (
        <section data-v2-tab-section="garantie" className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
          <div className="border-b border-zinc-100 pb-5">
            <div
              className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600"
              style={{ color: ORANGE }}
            >
              Garantie constructeur {v2.warranty.market || ''}
            </div>

            <h3 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">
              Conditions de garantie
            </h3>

            <p className="mt-2 max-w-2xl text-[13px] font-medium leading-5 text-zinc-500">
              Les conditions ci-dessous correspondent au marché et au
              millésime vérifiés pour cette fiche.
            </p>
          </div>

          <div className="mt-5 min-w-0 rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-700">
              Durée constructeur
            </div>

            <div className="mt-2 break-words text-2xl font-black leading-[1.08] text-zinc-950 md:text-3xl">
              {v2.warranty.duration}
            </div>

            {v2.warranty.coverage ? (
              <p className="mt-3 max-w-4xl text-xs leading-5 text-zinc-600">
                {v2.warranty.coverage}
              </p>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
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

          <div className="mt-5 grid gap-3 border-t border-zinc-100 pt-4 text-[10px] leading-5 text-zinc-400 md:grid-cols-[minmax(0,1fr)_auto]">
            {v2.warranty.legal_warranty_note ? (
              <span className="min-w-0">
                {v2.warranty.legal_warranty_note}
              </span>
            ) : (
              <span />
            )}

            {v2.warranty.source_label ? (
              <span className="font-bold text-zinc-500 md:max-w-[180px] md:text-right">
                Source : {v2.warranty.source_label}
              </span>
            ) : null}
          </div>
        </section>
      ) : null}
      {/* FAQ */}
      {faq.length > 0 ? (
        <section id="faq" data-v2-tab-section="faq" className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-5">
            <div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">
              Recherche rapide
            </div>

            <h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">
              Questions fréquentes
            </h2>
          </div>

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

      {!is800mtTabbedPrototype ? (
        <>
      {/* EQUIVALENTS */}
      {equivalents.length > 0 ? (
        <section data-v2-tab-section="technique">
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
                    {model.id ? 'Voir la fiche' : 'À comparer'}
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </>
              );

              if (model.id) {
                return (
                  <Link
                    key={model.id}
                    href={`/fiches/${model.id}`} onClick={() => { if (typeof window !== 'undefined') window.sessionStorage.setItem(`labelmoto:fiche-return:${model.id}`, `/fiches/${modelId}`); }}
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


        </>
      ) : null}
      {!is800mtTabbedPrototype ? (
        <>
      {/* VERDICT */}
      {v2.verdict || displayData.conclusion ? (
        <section hidden={is800mtTabbedPrototype} data-v2-tab-section="fiabilite"
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


        </>
      ) : null}
      {/* QUALITE DES DONNEES */}
      {is800mtTabbedPrototype ? (
        <section
          id="sources"
          data-v2-tab-section="sources"
          className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-4">
            <div
              className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600"
              style={{ color: ORANGE }}
            >
              Transparence LabelMoto
            </div>

            <h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">
              Sources & vérification
            </h2>

            <p className="mt-2 max-w-2xl text-[13px] font-medium leading-5 text-zinc-500">
              Nous indiquons le marché, le millésime et le niveau de
              vérification utilisés pour construire cette fiche.
            </p>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-zinc-100 bg-zinc-50/40">

            <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 sm:grid-cols-3">

              <div className="p-4">
                <div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">
                  Marché
                </div>

                <div className="mt-1 text-sm font-black text-zinc-900">
                  {v2.data_quality?.market || '—'}
                </div>
              </div>

              <div className="p-4">
                <div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">
                  Millésime
                </div>

                <div className="mt-1 text-sm font-black text-zinc-900">
                  {v2.data_quality?.model_year || '—'}
                </div>
              </div>

              <div className="p-4">
                <div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">
                  Vérifié le
                </div>

                <div className="mt-1 text-sm font-black text-zinc-900">
                  {v2.data_quality?.last_verified || '—'}
                </div>
              </div>

            </div>


            <div className="flex flex-wrap gap-2 border-t border-zinc-100 px-4 py-3">

              {v2.data_quality?.manufacturer_fr_verified ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-emerald-700">
                  Constructeur France vérifié
                </span>
              ) : null}

              {v2.data_quality?.european_manual_verified ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-emerald-700">
                  Manuel Europe vérifié
                </span>
              ) : null}

              {v2.data_quality?.technical_documentation_verified ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-emerald-700">
                  Documentation technique vérifiée
                </span>
              ) : null}

            </div>


            {v2.data_quality?.sources &&
            v2.data_quality.sources.length > 0 ? (

              <details className="group border-t border-zinc-100">

                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">

                  <div>
                    <div className="text-sm font-black text-zinc-900">
                      Sources principales
                    </div>

                    <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-400">
                      {v2.data_quality.sources.length} références documentaires
                    </div>
                  </div>

                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg font-black transition-transform group-open:rotate-45"
                    style={{ color: ORANGE }}
                  >
                    +
                  </div>

                </summary>


                <div className="border-t border-zinc-100 bg-zinc-50/60 p-3">

                  <div className="space-y-2">

                    {v2.data_quality.sources.map(
                      (source: any, index: number) => (

                        <div
                          key={`${source.label}-${index}`}
                          className="rounded-xl border border-zinc-200 bg-white p-3"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <div className="text-xs font-black leading-5 text-zinc-900">
                                {source.label}
                              </div>

                              <div className="mt-1 text-[9px] font-bold uppercase tracking-wide text-zinc-400">
                                {[source.market, source.model_year]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </div>

                            </div>


                            {source.url ? (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 rounded-lg bg-orange-50 px-2.5 py-1.5 text-[8px] font-black uppercase text-orange-700"
                              >
                                Ouvrir
                              </a>
                            ) : null}

                          </div>


                          {source.note ? (
                            <p className="mt-2 text-[10px] leading-4 text-zinc-500">
                              {source.note}
                            </p>
                          ) : null}

                        </div>

                      )
                    )}

                  </div>

                </div>

              </details>

            ) : null}

          </div>
        </section>
      ) : (
        <>      {/* QUALITE DES DONNEES */}
      {v2.data_quality ? (
        <section
          id="sources" data-v2-tab-section="sources"
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

        </>
      )}
      {/* AVIS */}
      <section
        id="reviews" data-v2-tab-section="reviews"
        className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6 space-y-6"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
              <div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">
                Communauté LabelMoto
              </div>

              <div className="mt-1 flex items-center gap-3">
                <h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 shrink-0 text-orange-600" />
                  Avis des motards
                </h2>

                <div className="rounded-full bg-orange-600 px-3 py-1 text-[9px] font-black uppercase leading-none text-white">
                  {reviews?.length || 0} avis
                </div>
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

      {/* VERDICT EDITORIAL 800MT - PROTOTYPE */}
      {is800mtTabbedPrototype ? (
        <section
          id="verdict-labelmoto-editorial"
          className="mt-10 overflow-hidden rounded-[26px] border border-zinc-200 bg-white shadow-sm"
        >
          <div className="p-5 md:p-8">

            <div
              className="text-[10px] font-black uppercase tracking-[0.22em]"
              style={{ color: ORANGE }}
            >
              Verdict LabelMoto
            </div>


            <h2 className="mt-2 max-w-3xl text-2xl font-black leading-[1.08] tracking-tight text-zinc-950 md:text-4xl">
              Une vraie voyageuse,
              mais le millésime compte
            </h2>


            <p className="mt-4 max-w-4xl text-sm leading-6 text-zinc-600 md:text-[15px] md:leading-7">
              La 800MT joue surtout la carte du confort, de la polyvalence
              et de l'équipement. La Sport conserve une approche plus
              simple et routière, tandis que l'Explore pousse davantage
              la logique voyage. Pour choisir entre les deux, le niveau
              d'équipement et l'usage prévu comptent finalement plus que
              la différence de performances.
            </p>


            <div className="mt-6 space-y-3">

              {/* AVANT ACHAT */}
              
                <details
          id="v2-verdict-budget"
          className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 md:px-5">
            <span className="text-[12px] font-black uppercase tracking-[0.04em] text-zinc-950">
              Budget
            </span>

            <span
              className="text-xl font-black transition group-open:rotate-45"
              style={{ color: ORANGE }}
            >
              +
            </span>
          </summary>


          <div className="border-t border-zinc-200 p-4 md:p-5">

            {/* ==================================================
                CHIFFRES PRINCIPAUX
                MOBILE : 1 CARTE PAR LIGNE
                DESKTOP : 3 COLONNES
            ================================================== */}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              {/* BUDGET ENTRETIEN */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:p-5">

                <div className="text-[10px] font-black uppercase leading-4 tracking-[0.08em] text-zinc-400">
                  Budget entretien
                  <br className="hidden md:block" />
                  jusqu'à 30 000 km
                </div>

                <div className="mt-2 text-[27px] font-black leading-none tracking-[-0.04em] text-zinc-950">
                  ≈ 1 300–1 950 €
                </div>

                <div className="mt-2 text-[12px] font-medium leading-5 text-zinc-500">
                  Révisions + pneus + freinage éventuel
                </div>

              </div>


              {/* ACHAT NEUF */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 md:p-5">

                <div className="text-[10px] font-black uppercase tracking-[0.08em] text-orange-700">
                  Achat neuf
                </div>

                <div className="mt-2 text-[27px] font-black leading-none tracking-[-0.04em] text-zinc-950">
                  {String(
                    displayData.variants?.[selectedVariantIndex]?.label || ''
                  )
                    .toLowerCase()
                    .includes('explore')
                    ? '10 999 €'
                    : '8 999 €'}
                </div>

                <div className="mt-2 text-[12px] font-medium leading-5 text-zinc-500">
                  {String(
                    displayData.variants?.[selectedVariantIndex]?.label || ''
                  )
                    .toLowerCase()
                    .includes('explore')
                    ? 'Catalogue France · offre observée 9 999 €'
                    : 'Tarif France'}
                </div>

              </div>


              {/* OCCASION */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:p-5">

                <div className="text-[10px] font-black uppercase tracking-[0.08em] text-zinc-400">
                  Occasion moyenne
                </div>

                <div className="mt-2 text-[27px] font-black leading-none tracking-[-0.04em] text-zinc-950">
                  {String(
                    displayData.variants?.[selectedVariantIndex]?.label || ''
                  )
                    .toLowerCase()
                    .includes('explore')
                    ? '≈ 8 800 €'
                    : '≈ 8 300 €'}
                </div>

                <div className="mt-2 text-[12px] font-medium leading-5 text-zinc-500">
                  Moyenne indicative des annonces
                </div>

              </div>

            </div>


            {/* ==================================================
                BUDGET PRUDENT
            ================================================== */}

            <div className="mt-4 rounded-2xl bg-zinc-50 p-4 md:p-5">

              <div className="text-[16px] font-black leading-5 text-zinc-950">
                Budget prudent jusqu'à 30 000 km
              </div>

              <div className="mt-4 space-y-3">

                {/* REVISIONS */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4">

                  <div className="text-[10px] font-black uppercase tracking-[0.08em] text-zinc-400">
                    Révisions programmées
                  </div>

                  <div className="mt-1 text-[20px] font-black tracking-[-0.03em] text-zinc-950">
                    910–1 480 €
                  </div>

                  <div className="mt-1 text-[12px] leading-5 text-zinc-500">
                    1 000 + 15 000 + 30 000 km
                  </div>

                </div>


                {/* PNEUS */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4">

                  <div className="text-[10px] font-black uppercase tracking-[0.08em] text-zinc-400">
                    1 train de pneus monté
                  </div>

                  <div className="mt-1 text-[20px] font-black tracking-[-0.03em] text-zinc-950">
                    ≈ 290–330 €
                  </div>

                  <div className="mt-1 text-[12px] leading-5 text-zinc-500">
                    Avant + arrière, montage compris
                  </div>

                </div>


                {/* FREINAGE */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4">

                  <div className="text-[10px] font-black uppercase tracking-[0.08em] text-zinc-400">
                    Plaquettes avant
                  </div>

                  <div className="mt-1 text-[20px] font-black tracking-[-0.03em] text-zinc-950">
                    ≈ 100–130 €
                  </div>

                  <div className="mt-1 text-[12px] leading-5 text-zinc-500">
                    Si leur remplacement devient nécessaire
                  </div>

                </div>

              </div>


              {/* TOTAL */}
              <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">

                <div className="text-[10px] font-black uppercase tracking-[0.1em] text-orange-700">
                  Budget réaliste estimé
                </div>

                <div className="mt-1 text-[27px] font-black leading-none tracking-[-0.04em] text-orange-600">
                  1 300 à 1 950 €
                </div>

                <div className="mt-2 text-[12px] font-medium text-zinc-600">
                  jusqu'à 30 000 km
                </div>

              </div>


              {/* NOTE */}
              <p className="mt-4 text-[11px] leading-[1.6] text-zinc-400">
                Hors kit chaîne si son remplacement devient nécessaire.
                Prix pièces observés en France au 25/08/2026.
                Les tarifs atelier varient selon la région et le professionnel.
                Le prix occasion reste une moyenne indicative et non une cote officielle.
              </p>

            </div>


            {/* ==================================================
                ARTICLE LABELMOTO
            ================================================== */}

            <Link
              href="/info/combien-coute-vraiment-une-moto-par-mois"
              className="mt-4 flex w-full items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4 transition hover:border-orange-300 hover:bg-orange-100"
            >

              <div className="min-w-0">

                <div className="text-[9px] font-black uppercase tracking-[0.14em] text-orange-700">
                  Guide budget LabelMoto
                </div>

                <div className="mt-1 text-[13px] font-black leading-5 text-zinc-950">
                  Combien coûte vraiment une moto par mois ?
                  Le budget réel d’un motard débutant
                </div>

              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-orange-600" />

            </Link>

          </div>
        </details>

<details className="group overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/60">

                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">

                  <div>
                    <div
                      className="text-[9px] font-black uppercase tracking-[0.18em]"
                      style={{ color: ORANGE }}
                    >
                      Achat neuf ou occasion
                    </div>

                    <div className="mt-1 text-sm font-black text-zinc-950 md:text-base">
                      Avant d'acheter : 3 vérifications utiles
                    </div>
                  </div>

                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xl font-black shadow-sm transition-transform group-open:rotate-45"
                    style={{ color: ORANGE }}
                  >
                    +
                  </div>

                </summary>


                <div className="border-t border-zinc-200 bg-white px-5 py-5">

                  <div className="space-y-5">

                    <div className="flex gap-3">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: ORANGE }}
                      >
                        1
                      </div>

                      <div>
                        <div className="text-sm font-black text-zinc-900">
                          Identifier précisément la version et le millésime
                        </div>

                        <p className="mt-1 text-xs leading-5 text-zinc-600 md:text-sm md:leading-6">
                          Les 800MT Sport et Explore partagent la même base,
                          mais les équipements et certaines caractéristiques
                          ont évolué selon les années et les marchés.
                          Vérifiez donc la version exacte et le millésime
                          plutôt que de vous fier uniquement au titre de
                          l'annonce.
                        </p>
                      </div>
                    </div>


                    <div className="flex gap-3">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: ORANGE }}
                      >
                        2
                      </div>

                      <div>
                        <div className="text-sm font-black text-zinc-900">
                          Regarder l'historique avant le kilométrage
                        </div>

                        <p className="mt-1 text-xs leading-5 text-zinc-600 md:text-sm md:leading-6">
                          Sur une occasion, un carnet cohérent et des factures
                          permettant de suivre les révisions sont plus
                          instructifs qu'un faible kilométrage isolé.
                          La première révision intervient à 1 000 km puis
                          l'entretien principal suit un rythme de 15 000 km
                          ou l'échéance prévue par le carnet correspondant à
                          la moto.
                        </p>
                      </div>
                    </div>


                    <div className="flex gap-3">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: ORANGE }}
                      >
                        3
                      </div>

                      <div>
                        <div className="text-sm font-black text-zinc-900">
                          Vérifier l'équipement réellement présent
                        </div>

                        <p className="mt-1 text-xs leading-5 text-zinc-600 md:text-sm md:leading-6">
                          Une annonce peut mélanger les équipements de
                          plusieurs versions ou années. Contrôlez donc
                          directement sur la moto les équipements qui
                          comptent pour vous, particulièrement lorsqu'ils
                          expliquent une différence de prix entre deux
                          exemplaires.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </details>


              {/* POUR QUEL MOTARD */}
              <details className="group overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/60">

                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">

                  <div>
                    <div
                      className="text-[9px] font-black uppercase tracking-[0.18em]"
                      style={{ color: ORANGE }}
                    >
                      Usage
                    </div>

                    <div className="mt-1 text-sm font-black text-zinc-950 md:text-base">
                      Pour quel motard ?
                    </div>
                  </div>

                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xl font-black shadow-sm transition-transform group-open:rotate-45"
                    style={{ color: ORANGE }}
                  >
                    +
                  </div>

                </summary>


                <div className="border-t border-zinc-200 bg-white px-5 py-5">

                  <p className="text-xs leading-5 text-zinc-600 md:text-sm md:leading-6">
                    La 800MT s'adresse surtout au motard qui cherche un trail
                    routier confortable pour le quotidien, le duo et le
                    voyage, avec un niveau d'équipement important sans devoir
                    immédiatement multiplier les accessoires.
                  </p>

                  <p className="mt-3 text-xs leading-5 text-zinc-600 md:text-sm md:leading-6">
                    Elle sera moins évidente pour celui qui place la légèreté
                    ou un usage tout-terrain très engagé au premier plan.
                    Son gabarit fait partie des éléments à essayer réellement
                    avant l'achat.
                  </p>

                </div>
              </details>


              {/* CONSEIL LABELMOTO */}
              <details className="group overflow-hidden rounded-2xl border border-orange-200 bg-orange-50">

                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">

                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-700">
                      Notre recommandation
                    </div>

                    <div className="mt-1 text-sm font-black text-zinc-950 md:text-base">
                      Le conseil LabelMoto
                    </div>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xl font-black text-orange-600 shadow-sm transition-transform group-open:rotate-45">
                    +
                  </div>

                </summary>


                <div className="border-t border-orange-200 bg-white px-5 py-5">

                  <p className="text-sm font-bold leading-6 text-zinc-900 md:text-[15px] md:leading-7">
                    Entre deux 800MT d'occasion, nous privilégierions un
                    exemplaire dont la version, le millésime et l'historique
                    d'entretien sont clairement documentés plutôt qu'une moto
                    simplement moins kilométrée mais dont le suivi reste
                    difficile à retracer.
                  </p>

                </div>
              </details>

            </div>

          </div>
        </section>
      ) : null}

      {/* EQUIVALENTS FOOTER 800MT */}
      {is800mtTabbedPrototype ? (
        <>
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
                    {model.id ? 'Voir la fiche' : 'À comparer'}
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </>
              );

              if (model.id) {
                return (
                  <Link
                    key={model.id}
                    href={`/fiches/${model.id}`} onClick={() => { if (typeof window !== 'undefined') window.sessionStorage.setItem(`labelmoto:fiche-return:${model.id}`, `/fiches/${modelId}`); }}
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


        </>
      ) : null}

    </>
  );
}

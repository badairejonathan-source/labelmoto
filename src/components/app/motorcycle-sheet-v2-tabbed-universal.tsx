/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2, MessageSquare, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { MotorcycleKnownIssueV2, MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RELATED_MODELS_POOL } from '@/lib/related-models-pool';

const ORANGE = '#e95b0c';

interface Props {
  modelId: string;
  displayData: any;
  v2: MotorcycleSheetV2;
  selectedVariantIndex: number;
  onSelectVariant: (index: number) => void;
  relatedModels: any[];
  onModelSelect?: (modelId: string) => void;
  reviews: any[] | null | undefined;
  reviewsLoading: boolean;
  onLeaveReview: () => void;
}

function confidenceLabel(type?: string) {
  switch (type) {
    case 'official_fr': return 'Constructeur France';
    case 'official_eu': return 'Manuel Europe';
    case 'official_other_market': return 'Constructeur autre marché';
    case 'technical_documentation': return 'Documentation technique';
    case 'multiple_sources': return 'Sources recoupées';
    case 'observed': return 'Prix / donnée observée';
    case 'estimate': return 'Estimation LabelMoto';
    case 'to_confirm': return 'À confirmer';
    default: return null;
  }
}

function issueLabel(issue: MotorcycleKnownIssueV2) {
  switch (issue.type) {
    case 'recall': return 'Rappel officiel';
    case 'documented_issue': return 'Problème documenté';
    case 'owner_feedback': return 'Retours propriétaires';
    case 'manufacturer_monitoring': return 'Surveillance constructeur';
    case 'usage_limitation': return 'Point à connaître';
    default: return 'Point à surveiller';
  }
}

function observedPriceForSection(section: any, consumables: any[]) {
  const id = String(section.id || '').toLowerCase();
  const title = String(section.title || '').toLowerCase();
  const candidates = consumables.filter((item) => {
    const part = String(item.part || '').toLowerCase();
    if (!part) return false;
    if (id === 'huile') return part.includes('huile');
    if (id === 'air') return part.includes('air');
    if (id === 'bougie') return part.includes('bougie');
    if (id === 'refroidissement') return part.includes('refroid');
    if (id === 'freinage') return part.includes('frein');
    if (id === 'pneus') return part.includes('pneu');
    if (id === 'chaine') return part.includes('chaîne') || part.includes('chaine');
    return title && part && (title.includes(part) || part.includes(title));
  });
  const priced = candidates.find((item) => item.observed_price && item.observed_price !== 'Prix à confirmer');
  return priced?.observed_price || null;
}

export default function MotorcycleSheetV2TabbedUniversal({
  modelId,
  displayData,
  v2,
  selectedVariantIndex,
  onSelectVariant,
  relatedModels,
  onModelSelect,
  reviews,
  reviewsLoading,
  onLeaveReview,
}: Props) {
  const quickFacts = v2.quick_facts?.length
    ? v2.quick_facts
    : [
        { label: 'PUISSANCE', value: displayData.engine.power },
        { label: 'POIDS', value: displayData.dimensions.wetWeight },
        { label: 'SELLE', value: displayData.dimensions.seatHeight },
        { label: 'PERMIS', value: displayData.engine.bridage },
      ];

  const schedule = v2.service_schedule_v2?.length
    ? v2.service_schedule_v2
    : (displayData.serviceSchedule || []).map((item: any) => ({
        km: Number(item.km || 0),
        title: item.service_label || 'Révision',
        price_estimate: item.price_estimate,
        price_type: 'estimate',
        operations: [{ label: item.service_label || item.operations || 'Opérations selon plan constructeur' }],
      }));

  const maintenanceDetails = v2.maintenance_details || [];
  const consumables = v2.consumables_v2 || [];
  const issues: MotorcycleKnownIssueV2[] = v2.known_issues_v2?.length
    ? v2.known_issues_v2
    : (displayData.knownIssues || []).map((text: string) => ({
        title: 'Point à surveiller',
        description: text,
        type: 'usage_limitation' as const,
        confidence: 'to_confirm' as const,
      }));
  const faq = displayData.faq || [];
  const equivalents = (() => {
    const normalizeEquivalentName = (value: unknown) =>
      String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');

    const rawEquivalents =
      v2.equivalents_v2?.length
        ? v2.equivalents_v2
        : relatedModels.map((model: any) => ({
            id: model.id,
            name: model.name,
            reason: model.cc ? `${model.cc} cm³` : undefined,
          }));

    return rawEquivalents.map((model: any) => {
      if (model?.id) return model;

      const targetName = normalizeEquivalentName(model?.name);
      if (!targetName) return model;

      const matched = RELATED_MODELS_POOL.find(
        (candidate) => normalizeEquivalentName(candidate.name) === targetName
      );

      return matched ? { ...model, id: matched.id } : model;
    });
  })();
  const budgetCards = v2.budget?.cards || [];
  const budgetSummary = v2.budget?.summary;

  const tabs = [
    schedule.length ? { id: 'revisions', label: 'Révisions' } : null,
    maintenanceDetails.length || consumables.length ? { id: 'consommables', label: 'Consommables' } : null,
    v2.warranty ? { id: 'garantie', label: 'Garantie' } : null,
    faq.length ? { id: 'faq', label: 'FAQ' } : null,
    v2.data_quality ? { id: 'sources', label: 'Sources' } : null,
    { id: 'reviews', label: 'Avis' },
  ].filter(Boolean) as { id: string; label: string }[];

  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id || 'reviews');
  React.useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) setActiveTab(tabs[0]?.id || 'reviews');
  }, [activeTab, tabs]);

  const openTab = (id: string) => {
    setActiveTab(id);
    if (typeof window !== 'undefined') window.history.replaceState(null, '', `#${id}`);
  };

  const tabContentRef = React.useRef<HTMLDivElement | null>(null);
  const previousActiveTabRef = React.useRef(activeTab);

  const tabRailRef =
    React.useRef<HTMLDivElement | null>(
      null
    );

  React.useEffect(() => {
    const rail = tabRailRef.current;

    if (!rail) {
      return;
    }

    const activeButton =
      rail.querySelector<HTMLElement>(
        `[data-labelmoto-v2-tab-id="${activeTab}"]`
      );

    if (!activeButton) {
      return;
    }

    const railRect =
      rail.getBoundingClientRect();

    const buttonRect =
      activeButton.getBoundingClientRect();

    const targetLeft =
      rail.scrollLeft +
      (buttonRect.left - railRect.left) -
      (rail.clientWidth - buttonRect.width) / 2;

    rail.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [activeTab]);


  React.useEffect(() => {
    if (previousActiveTabRef.current === activeTab) {
      return;
    }

    previousActiveTabRef.current = activeTab;

    const frame = window.requestAnimationFrame(() => {
      const content = tabContentRef.current;
      const nav = document.getElementById('v2-tabs-navigation');

      if (!content || !nav) {
        return;
      }

      const navHeight = nav.getBoundingClientRect().height;
      const contentTop =
        window.scrollY + content.getBoundingClientRect().top;

      window.scrollTo({
        top: Math.max(0, contentTop - navHeight - 12),
        behavior: 'smooth',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTab]);

  // data-labelmoto-tab-scroll-reset
  const tabSwipeStartRef =
    React.useRef<{ x: number; y: number } | null>(null);

  const handleTabSwipeStart = (event: any) => {
    const touch = event.touches?.[0];
    if (!touch) return;

    tabSwipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTabSwipeEnd = (event: any) => {
    const start = tabSwipeStartRef.current;
    const touch = event.changedTouches?.[0];
    tabSwipeStartRef.current = null;

    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (
      Math.abs(deltaX) < 70 ||
      Math.abs(deltaX) <= Math.abs(deltaY) * 1.35
    ) {
      return;
    }

    const currentIndex =
      tabs.findIndex((tab) => tab.id === activeTab);

    if (currentIndex < 0) return;

    const nextIndex =
      deltaX < 0
        ? Math.min(currentIndex + 1, tabs.length - 1)
        : Math.max(currentIndex - 1, 0);

    if (nextIndex !== currentIndex) {
      openTab(tabs[nextIndex].id);
    }
  };


  return (
    <>
      <section id="v2-quickfacts-carousel" className="-mt-1 overflow-hidden rounded-b-[24px] border border-zinc-200 bg-white shadow-sm">
        <div className="px-4 pb-1 pt-4">
          <div className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: ORANGE }}>En un coup d'œil</div>
          <div className="mt-1 text-xl font-black uppercase tracking-[-0.03em] text-zinc-950">Les chiffres clés</div>
        </div>
        <div className="overflow-hidden px-3 pt-3 md:px-0 md:pt-0">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-10 [scrollbar-width:thin] [scrollbar-color:#f97316_#f4f4f5] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-500 md:grid md:grid-cols-6 md:gap-0 md:overflow-visible md:px-0 md:pr-0">
            {quickFacts.map((item, index) => (
              <div key={`${item.label}-${index}`} className="min-w-[128px] snap-start rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4 md:min-w-0 md:rounded-none md:border-0 md:border-r md:border-zinc-100 md:bg-white md:px-4 md:py-4 md:last:border-r-0">
                <div className="whitespace-nowrap text-[8px] font-black uppercase tracking-[0.14em] text-zinc-400">{item.label}</div>
                <div className="mt-1 whitespace-nowrap text-base font-black leading-tight text-zinc-950 md:text-lg">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {displayData.brand ? (
        <Link
          href={`/map?search=${encodeURIComponent(String(displayData.brand))}&filter=concessionnaires-revendeurs`}
          className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-2.5 transition hover:border-orange-300 hover:bg-orange-50 md:w-fit md:min-w-[320px]"
        >
          <div className="min-w-0">
            <div className="text-[11px] font-bold leading-4 text-zinc-900">
              Trouver un concessionnaire {displayData.brand}
            </div>
            <div className="mt-0.5 text-[9px] font-medium text-zinc-500">
              Voir sur la carte LabelMoto
            </div>
          </div>

          <ChevronRight className="h-4 w-4 shrink-0 text-orange-600" />
        </Link>
      ) : null}

      {displayData.hasVariants ? (
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">Sélectionnez la version</span>
            <div className="flex flex-wrap justify-center gap-1 rounded-full bg-zinc-100 p-1">
              {displayData.variants.map((variant: any, index: number) => (
                <button key={index} type="button" onClick={() => onSelectVariant(index)} className={cn('rounded-full px-6 py-2 text-[9px] font-black uppercase transition', selectedVariantIndex === index ? 'bg-orange-600 text-white shadow' : 'text-zinc-600 hover:bg-white')}>
                  {variant.label || `Variante ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <details id="technique-complete-v2" className="group mt-4 overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <div className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: ORANGE }}>Caractéristiques</div>
            <div className="mt-1 text-sm font-black text-zinc-950 md:text-base">Fiche technique complète</div>
            <div className="mt-1 text-[10px] leading-4 text-zinc-400">Moteur, performances, dimensions et partie-cycle</div>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xl font-black transition-transform group-open:rotate-45" style={{ color: ORANGE }}>+</div>
        </summary>
        <div className="border-t border-zinc-100 bg-zinc-50/40 px-4 pb-5 pt-5 md:px-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-black uppercase">Moteur & performances</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Type', displayData.engine.type], ['Cylindrée', displayData.engine.displacement], ['Puissance', displayData.engine.power], ['Couple', displayData.engine.torque], ['Alimentation', displayData.engine.alimentation], ['Permis', displayData.engine.bridage],
                ].filter(([, value]) => value && value !== 'N/A').map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0"><span className="text-zinc-400">{label}</span><span className="text-right font-bold">{value}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-black uppercase">Châssis & dimensions</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Poids', displayData.dimensions.wetWeight], ['Hauteur de selle', displayData.dimensions.seatHeight], ['Réservoir', displayData.dimensions.tank], ['Pneu avant', displayData.cycleParts.frontTire], ['Pneu arrière', displayData.cycleParts.rearTire], ['Frein avant', displayData.cycleParts.frontBrake],
                ].filter(([, value]) => value && value !== 'N/A').map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0"><span className="text-zinc-400">{label}</span><span className="max-w-[65%] text-right font-bold">{value}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </details>

      <nav id="v2-tabs-navigation" className="sticky top-2 z-30 mt-6 rounded-2xl border border-zinc-200 bg-white/95 p-1.5 shadow-lg backdrop-blur">
        <div className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#f97316_#f4f4f5] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-500 !flex snap-x snap-mandatory gap-2 !overflow-x-auto overscroll-x-contain pr-8 md:!grid md:grid-flow-col md:auto-cols-fr md:!overflow-visible md:pb-0 md:pr-0" ref={tabRailRef}>
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => openTab(tab.id)} className={[cn('shrink-0 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wide transition', activeTab === tab.id ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:bg-orange-50 hover:text-orange-700'), "!min-w-[118px] !shrink-0 snap-start whitespace-nowrap md:!min-w-0"].filter(Boolean).join(' ')} data-labelmoto-v2-tab-id={tab.id}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div
        data-labelmoto-v2-tab-swipe="true"
        ref={tabContentRef}
        onTouchStart={handleTabSwipeStart}
        onTouchEnd={handleTabSwipeEnd}
      >
      {activeTab === 'revisions' ? (
        <section className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">Calendrier d'entretien</div><h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">Révisions</h2></div>
            <div className="text-right text-[10px] font-bold uppercase leading-4 text-zinc-400">Touchez une ligne<br />pour le détail</div>
          </div>
          <div className="overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-sm">
            {schedule.map((service: any, index: number) => (
              <details key={`${service.km}-${index}`} className="group border-b border-zinc-100 last:border-b-0">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 transition hover:bg-zinc-50 md:px-5">
                  <div className="min-w-0 flex-1"><div className="text-base font-black leading-none md:text-lg" style={{ color: ORANGE }}>{service.km ? `${Number(service.km).toLocaleString('fr-FR')} KM` : 'ÉCHÉANCE'}</div></div>
                  <div className="shrink-0 text-right"><div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">Prix estimé</div><div className="mt-0.5 max-w-[170px] text-base font-black leading-tight text-zinc-950 md:text-lg">{service.price_estimate || 'NC'}</div></div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg font-black transition-transform group-open:rotate-90" style={{ color: ORANGE }}>›</div>
                </summary>
                <div className="border-t border-zinc-100 bg-zinc-50/70 px-4 pb-5 pt-4 md:px-5">
                  <div className="mb-3"><div className="text-[9px] font-black uppercase tracking-wide text-zinc-400">Opérations prévues</div><div className="mt-1 text-sm font-black text-zinc-900">{service.title}</div></div>
                  <ul className="grid gap-2 text-xs leading-5 text-zinc-600 sm:grid-cols-2">{(service.operations || []).map((operation: any, opIndex: number) => <li key={`${operation.label}-${opIndex}`} className="flex gap-2"><span className="font-black" style={{ color: ORANGE }}>•</span><span>{operation.label}</span></li>)}</ul>
                  {service.note ? <p className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-xs leading-5 text-orange-950">{service.note}</p> : null}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 pt-3"><span className="text-[9px] font-bold uppercase tracking-wide text-zinc-400">{service.price_type === 'official' ? 'Tarif officiel' : service.price_type === 'observed' ? 'Prix observé' : 'Estimation LabelMoto'}</span><span className="text-[10px] font-black text-zinc-600">TTC · pièces + main-d'œuvre</span></div>
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'consommables' ? (
        <>
          {maintenanceDetails.length ? (
            <section className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5"><div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">Documentation propriétaire</div><h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">Pièces & consommables</h2></div>
              <div className="space-y-3">
                {maintenanceDetails.map((section: any) => {
                  const price = observedPriceForSection(section, consumables);
                  return (
                    <details key={section.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5">
                        <div className="min-w-0 flex-1"><div className="font-black">{section.title}</div><div className="mt-1 text-xs text-zinc-400">{section.summary}</div></div>
                        <div className="flex shrink-0 items-center gap-2">
                          {price ? <div className="max-w-[150px] rounded-xl bg-orange-50 px-2.5 py-2 text-right"><div className="text-[7px] font-black uppercase tracking-[0.12em] text-orange-500">Prix indicatif</div><div className="mt-0.5 text-[10px] font-black leading-3 text-orange-700">{price}</div></div> : null}
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg font-bold transition group-open:rotate-45" style={{ color: ORANGE }}>+</div>
                        </div>
                      </summary>
                      <div className="border-t border-zinc-100 px-5 py-5"><div className="grid gap-3 md:grid-cols-2">{section.rows.map((row: any, index: number) => <div key={`${row.label}-${index}`} className="rounded-xl bg-zinc-50 px-4 py-3"><div className="text-[9px] font-black uppercase tracking-wide text-zinc-400">{row.label}</div><div className="mt-1 text-sm font-bold">{row.value}</div>{confidenceLabel(row.confidence) ? <div className="mt-2 text-[9px] font-bold text-zinc-400">{confidenceLabel(row.confidence)}</div> : null}</div>)}</div>{section.note ? <p className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-xs leading-5 text-orange-950">{section.note}</p> : null}</div>
                    </details>
                  );
                })}
              </div>
            </section>
          ) : null}
          {consumables.length ? (
            <section className="mt-4 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5"><div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">Références utiles</div><h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">Références & prix observés</h2></div>
              <div
                data-labelmoto-consumables-table="true"
                className="overflow-hidden rounded-[22px] border border-zinc-200"
              >
                <div className="overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin] [scrollbar-color:#f97316_#f4f4f5] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-500">
                  <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead className="bg-zinc-50">
                      <tr className="border-b border-zinc-200">
                        <th className="min-w-[170px] px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400">
                          Pièce
                        </th>
                        <th className="min-w-[250px] px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400">
                          Référence / spécification
                        </th>
                        <th className="min-w-[190px] px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400">
                          Périodicité
                        </th>
                        <th className="min-w-[150px] px-4 py-3 text-right text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400">
                          Prix observé
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-100">
                      {consumables.map((item: any, index: number) => (
                        <tr
                          key={`${item.part}-${index}`}
                          className="align-top transition-colors hover:bg-orange-50/30"
                        >
                          <td className="px-4 py-4 font-black text-zinc-950">
                            {item.part}
                          </td>

                          <td className="px-4 py-4 text-zinc-600">
                            <div className="font-bold text-zinc-800">
                              {item.reference_oem || item.specification || '—'}
                            </div>

                            {item.reference_oem && item.specification ? (
                              <div className="mt-1 text-xs leading-5 text-zinc-500">
                                {item.specification}
                              </div>
                            ) : null}

                            {item.note ? (
                              <div className="mt-1.5 max-w-[360px] text-[10px] leading-4 text-zinc-400">
                                {item.note}
                              </div>
                            ) : null}
                          </td>

                          <td className="px-4 py-4 text-zinc-600">
                            {item.replacement_interval || '—'}
                          </td>

                          <td className="px-4 py-4 text-right font-black text-zinc-900">
                            {item.observed_price || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {activeTab === 'garantie' && v2.warranty ? (
        <section className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
          <div className="border-b border-zinc-100 pb-5"><div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">Garantie constructeur {v2.warranty.market || ''}</div><h3 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">Conditions de garantie</h3><p className="mt-2 max-w-2xl text-[13px] font-medium leading-5 text-zinc-500">Les conditions ci-dessous correspondent au marché et au millésime vérifiés pour cette fiche.</p></div>
          <div className="mt-5 min-w-0 rounded-2xl border border-orange-200 bg-orange-50 p-5"><div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-700">Durée constructeur</div><div className="mt-2 break-words text-2xl font-black leading-[1.08] text-zinc-950 md:text-3xl">{v2.warranty.duration}</div>{v2.warranty.coverage ? <p className="mt-3 max-w-4xl text-xs leading-5 text-zinc-600">{v2.warranty.coverage}</p> : null}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">{v2.warranty.maintenance_requirement ? <div className="rounded-2xl bg-zinc-50 p-4"><div className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">Entretien</div><p className="mt-2 text-xs leading-5 text-zinc-700">{v2.warranty.maintenance_requirement}</p></div> : null}{v2.warranty.claim_requirement ? <div className="rounded-2xl bg-zinc-50 p-4"><div className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">Prise en charge</div><p className="mt-2 text-xs leading-5 text-zinc-700">{v2.warranty.claim_requirement}</p></div> : null}</div>
          {v2.warranty.source_label ? <div className="mt-5 border-t border-zinc-100 pt-4 text-right text-[10px] font-bold text-zinc-500">Source : {v2.warranty.source_label}</div> : null}
        </section>
      ) : null}

      {activeTab === 'faq' ? (
        <section className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5"><div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">Recherche rapide</div><h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">Questions fréquentes</h2></div>
          <div className="space-y-3">{faq.map((item: any, index: number) => <details key={index} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-sm font-black">{item.question || item.q}<span className="text-xl transition group-open:rotate-45" style={{ color: ORANGE }}>+</span></summary><p className="border-t border-zinc-100 px-5 py-5 text-sm leading-6 text-zinc-600">{item.answer || item.a}</p></details>)}</div>
        </section>
      ) : null}

      {activeTab === 'sources' && v2.data_quality ? (
        <section className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4"><div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">Transparence LabelMoto</div><h2 className="mt-1 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950">Sources & vérification</h2><p className="mt-2 max-w-2xl text-[13px] font-medium leading-5 text-zinc-500">Nous indiquons le marché, le millésime et le niveau de vérification utilisés pour construire cette fiche.</p></div>
          <div className="overflow-hidden rounded-[18px] border border-zinc-100 bg-zinc-50/40"><div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 sm:grid-cols-3">{[['Marché', v2.data_quality.market], ['Millésime', v2.data_quality.model_year], ['Vérifié le', v2.data_quality.last_verified]].map(([label, value]) => <div key={label} className="p-4"><div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">{label}</div><div className="mt-1 text-sm font-black text-zinc-900">{value || '—'}</div></div>)}</div><div className="flex flex-wrap gap-2 border-t border-zinc-100 px-4 py-3">{v2.data_quality.manufacturer_fr_verified ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-emerald-700">Constructeur France vérifié</span> : null}{v2.data_quality.european_manual_verified ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-emerald-700">Manuel Europe vérifié</span> : null}{v2.data_quality.technical_documentation_verified ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-emerald-700">Documentation technique vérifiée</span> : null}</div>
            {v2.data_quality.sources?.length ? <details className="group border-t border-zinc-100"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4"><div><div className="text-sm font-black text-zinc-900">Sources principales</div><div className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-400">{v2.data_quality.sources.length} références documentaires</div></div><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg font-black transition-transform group-open:rotate-45" style={{ color: ORANGE }}>+</div></summary><div className="border-t border-zinc-100 bg-zinc-50/60 p-3"><div className="space-y-2">{v2.data_quality.sources.map((source: any, index: number) => <div key={`${source.label}-${index}`} className="rounded-xl border border-zinc-200 bg-white p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-black leading-5 text-zinc-900">{source.label}</div><div className="mt-1 text-[9px] font-bold uppercase tracking-wide text-zinc-400">{[source.market, source.model_year].filter(Boolean).join(' · ')}</div></div>{source.url ? <a href={source.url} target="_blank" rel="noreferrer" className="shrink-0 rounded-lg bg-orange-50 px-2.5 py-1.5 text-[8px] font-black uppercase text-orange-700">Ouvrir</a> : null}</div>{source.note ? <p className="mt-2 text-[10px] leading-4 text-zinc-500">{source.note}</p> : null}</div>)}</div></div></details> : null}
          </div>
        </section>
      ) : null}

      {activeTab === 'reviews' ? (
        <section className="mt-8 scroll-mt-24 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:p-6 space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="text-[10px] font-black uppercase leading-none tracking-[0.18em] text-orange-600">Communauté LabelMoto</div><div className="mt-1 flex items-center gap-3"><h2 className="mt-1 flex items-center gap-2 text-[22px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-zinc-950"><MessageSquare className="h-5 w-5 shrink-0 text-orange-600" />Avis des motards</h2><div className="rounded-full bg-orange-600 px-3 py-1 text-[9px] font-black uppercase leading-none text-white">{reviews?.length || 0} avis</div></div></div><Button onClick={onLeaveReview} className="h-12 rounded-full bg-zinc-950 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-orange-600">Laisser un avis</Button></div>
          {reviewsLoading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div> : reviews?.length ? <div className="grid gap-6">{reviews.map((review: any) => <Card key={review.id} className="overflow-hidden rounded-[2rem] border-2 bg-white shadow-md"><CardContent className="p-8"><div className="mb-4 flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600"><User className="h-6 w-6" /></div><div><p className="text-sm font-black uppercase leading-none">{review.userName || 'Motard'}</p><p className="mt-1 text-[10px] font-bold text-zinc-400">{review.date ? formatDistanceToNow(new Date(review.date.seconds ? review.date.seconds * 1000 : review.date), { addSuffix: true, locale: fr }) : 'Récemment'}</p></div></div><div className="flex gap-0.5">{[...Array(5)].map((_, index) => <Star key={index} className={cn('h-4 w-4', index < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-200')} />)}</div></div><p className="text-base font-bold italic leading-relaxed text-zinc-700">"{review.content}"</p></CardContent></Card>)}</div> : <div className="rounded-[2rem] border-2 border-dashed border-zinc-200 bg-white p-12 text-center"><p className="font-black uppercase text-zinc-500">Aucun avis pour le moment.</p><p className="mt-2 text-xs font-bold text-zinc-400">Soyez le premier à partager votre expérience et vos conseils sur ce modèle.</p></div>}
        </section>
      ) : null}
      </div>

      {v2.verdict || displayData.conclusion ? (
        <section id="verdict-labelmoto-editorial" className="mt-10 overflow-hidden rounded-[26px] border border-zinc-200 bg-white shadow-sm">
          <div className="p-5 md:p-8">
            <div className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: ORANGE }}>Verdict LabelMoto</div>
            <h2 className="mt-1 text-[24px] font-black leading-[1.03] tracking-[-0.035em] text-zinc-950 md:text-[30px]">{v2.verdict?.title || 'Notre avis'}</h2>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-zinc-600 md:text-[15px] md:leading-7">{v2.verdict?.text || displayData.conclusion}</p>
            <div className="mt-5 flex flex-wrap gap-2">{(v2.verdict?.strengths || []).map((item) => <span key={item} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[9px] font-black uppercase text-emerald-800">+ {item}</span>)}{(v2.verdict?.weaknesses || []).map((item) => <span key={item} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[9px] font-black uppercase text-orange-800">À surveiller : {item}</span>)}</div>
            <div className="mt-6 space-y-3">
{(budgetSummary || budgetCards.length > 0) ? (
                <details className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white">
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

                  <div className="border-t border-zinc-100 bg-zinc-50/50 p-4">
                    {budgetSummary ? (
                      <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-4 md:p-5">
                        <div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-600">
                          Budget entretien sur {Number(budgetSummary.horizon_km).toLocaleString('fr-FR')} km
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-orange-100 bg-white p-4">
                            <div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">
                              Coût estimé
                            </div>

                            <div className="mt-2 text-lg font-black text-zinc-950 md:text-xl">
                              {budgetSummary.total_cost}
                            </div>
                          </div>

                          <div className="rounded-xl border border-orange-100 bg-white p-4">
                            <div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">
                              Coût au km
                            </div>

                            <div className="mt-2 text-lg font-black text-zinc-950 md:text-xl">
                              {budgetSummary.cost_per_km}
                            </div>
                          </div>

                          <div className="rounded-xl border border-orange-100 bg-white p-4">
                            <div className="text-[8px] font-black uppercase tracking-wide text-zinc-400">
                              Intervalle constructeur
                            </div>

                            <div className="mt-2 text-sm font-black leading-5 text-zinc-950">
                              {budgetSummary.interval_rule}
                            </div>
                          </div>
                        </div>

                        {budgetSummary.note ? (
                          <p className="mt-3 text-[10px] leading-5 text-zinc-500">
                            {budgetSummary.note}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {budgetCards.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {budgetCards.map((card: any, index: number) => (
                          <div
                            key={card.label + '-' + index}
                            className="rounded-xl border border-zinc-200 bg-white p-4"
                          >
                            <div className="text-[9px] font-black uppercase tracking-wide text-zinc-400">
                              {card.label}
                            </div>

                            <div className="mt-2 text-lg font-black text-zinc-950">
                              {card.value}
                            </div>

                            {card.note ? (
                              <p className="mt-2 text-[10px] leading-4 text-zinc-500">
                                {card.note}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {v2.budget?.note ? (
                      <p className="mt-3 text-[10px] leading-5 text-zinc-500">
                        {v2.budget.note}
                      </p>
                    ) : null}
                  </div>
                </details>
              ) : null}
              {issues.length ? <details className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 md:px-5"><div><div className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: ORANGE }}>Avant d'acheter</div><div className="mt-1 text-sm font-black text-zinc-950 md:text-base">Points à vérifier</div></div><span className="text-xl font-black transition group-open:rotate-45" style={{ color: ORANGE }}>+</span></summary><div className="border-t border-zinc-100 bg-white px-5 py-5"><div className="space-y-4">{issues.map((issue, index) => <div key={`${issue.title}-${index}`}><div className="flex items-center gap-2"><span className="text-sm font-black text-zinc-900">{issue.title}</span><span className="rounded-full bg-zinc-100 px-2 py-1 text-[8px] font-black uppercase text-zinc-500">{issueLabel(issue)}</span></div><p className="mt-1 text-xs leading-5 text-zinc-600 md:text-sm md:leading-6">{issue.description}</p></div>)}</div></div></details> : null}
              {displayData.longevityTips?.length ? <details className="group overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/60"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4"><div><div className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: ORANGE }}>Usage</div><div className="mt-1 text-sm font-black text-zinc-950 md:text-base">Conseils de longévité</div></div><span className="text-xl font-black transition group-open:rotate-45" style={{ color: ORANGE }}>+</span></summary><div className="border-t border-zinc-200 bg-white px-5 py-5"><ul className="space-y-3 text-xs leading-5 text-zinc-600 md:text-sm md:leading-6">{displayData.longevityTips.map((tip: string, index: number) => <li key={index} className="flex gap-2"><span className="font-black" style={{ color: ORANGE }}>•</span><span>{tip}</span></li>)}</ul></div></details> : null}
              {displayData.conclusion && displayData.conclusion !== v2.verdict?.text ? <details className="group overflow-hidden rounded-2xl border border-orange-200 bg-orange-50"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4"><div><div className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-700">Notre recommandation</div><div className="mt-1 text-sm font-black text-zinc-950 md:text-base">Le conseil LabelMoto</div></div><span className="text-xl font-black text-orange-600 transition group-open:rotate-45">+</span></summary><div className="border-t border-orange-200 bg-white px-5 py-5"><p className="text-sm font-bold leading-6 text-zinc-900 md:text-[15px] md:leading-7">{displayData.conclusion}</p></div></details> : null}
            </div>
          </div>
        </section>
      ) : null}

      {equivalents.length ? (
        <section className="mt-10">
          <div className="mb-6"><div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: ORANGE }}>Comparer avant d'acheter</div><h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 md:text-3xl">Modèles équivalents</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{equivalents.map((model: any, index: number) => { const content = <><div className="text-sm font-black">{model.name}</div>{model.reason ? <div className="mt-1 text-xs leading-5 text-zinc-400">{model.reason}</div> : null}<div className="mt-4 flex items-center gap-1 text-[10px] font-black uppercase" style={{ color: ORANGE }}>{model.id ? 'Voir la fiche' : 'À comparer'}<ChevronRight className="h-3 w-3" /></div></>; return model.id ? <Link key={model.id} href={onModelSelect ? '#' : `/fiches/${model.id}`} onClick={(event) => {
  if (onModelSelect) {
    event.preventDefault();
    onModelSelect(model.id);
    return;
  }

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(
      `labelmoto:fiche-return:${model.id}`,
      `/fiches/${modelId}`
    );
  }
}} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md">{content}</Link> : <div key={`${model.name}-${index}`} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">{content}</div>; })}</div>
        </section>
      ) : null}
    </>
  );
}

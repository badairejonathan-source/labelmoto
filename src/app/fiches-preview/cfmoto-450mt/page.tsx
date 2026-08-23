'use client';

import MotorcycleSheetV2View from '@/components/app/motorcycle-sheet-v2-view';

import {
  cfmoto450mtDisplayData,
  cfmoto450mtV2,
} from '@/lib/motorcycle-sheets-v2/cfmoto-450mt';

export default function CFMOTO450MTPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f4] text-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">

        <div className="mb-5">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600">
            Prototype générique MotorcycleSheet V2
          </div>

          <p className="mt-1 text-xs text-zinc-400">
            Données locales de test · aucune écriture Firestore
          </p>
        </div>

        <MotorcycleSheetV2View
          modelId="cfmoto-450mt-2024-plus"
          displayData={cfmoto450mtDisplayData}
          v2={cfmoto450mtV2}
          selectedVariantIndex={0}
          onSelectVariant={() => {}}
          relatedModels={[]}
          reviews={[]}
          reviewsLoading={false}
          onLeaveReview={() => {}}
        />

      </div>
    </main>
  );
}

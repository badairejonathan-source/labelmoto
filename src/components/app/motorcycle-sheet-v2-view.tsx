/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import MotorcycleSheetV2TabbedUniversal from '@/components/app/motorcycle-sheet-v2-tabbed-universal';
import PCXPreviewRenderer from '@/components/app/pcx-125-preview-renderer';
import ForzaPreviewRenderer from '@/components/app/forza-125-preview-renderer';
import { pcx125DisplayData } from '@/lib/motorcycle-sheets-v2/honda-pcx-125-2026-preview';
import { forza125DisplayData } from '@/lib/motorcycle-sheets-v2/honda-forza-125-2026-preview';
import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';

interface MotorcycleSheetV2ViewProps {
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

export default function MotorcycleSheetV2View({
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
}: MotorcycleSheetV2ViewProps) {
  const ScooterRenderer = modelId === 'honda-pcx-125-2026'
    ? PCXPreviewRenderer
    : modelId === 'honda-forza-125-2026'
      ? ForzaPreviewRenderer
      : null;

  if (ScooterRenderer) {
    return (
      <ScooterRenderer
        modelId={modelId}
        displayData={modelId === 'honda-pcx-125-2026' ? pcx125DisplayData : forza125DisplayData}
        v2={v2}
        selectedVariantIndex={selectedVariantIndex}
        onSelectVariant={onSelectVariant}
        relatedModels={relatedModels}
        onModelSelect={onModelSelect}
        reviews={reviews}
        reviewsLoading={reviewsLoading}
        onLeaveReview={onLeaveReview}
      />
    );
  }
  return (
    <>
<MotorcycleSheetV2TabbedUniversal
      modelId={modelId}
      displayData={displayData}
      v2={v2}
      selectedVariantIndex={selectedVariantIndex}
      onSelectVariant={onSelectVariant}
      relatedModels={relatedModels}
      onModelSelect={onModelSelect}
      reviews={reviews}
      reviewsLoading={reviewsLoading}
      onLeaveReview={onLeaveReview}
    />
    </>
  );
}

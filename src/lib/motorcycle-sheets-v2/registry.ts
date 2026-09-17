import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
import { cfmoto675srrV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-675sr-r';
import { cfmoto450srV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-450sr';

/**
 * Registre des fiches V2 locales LabelMoto.
 *
 * Firestore reste le socle de la fiche.
 * Lorsqu'une V2 locale valide existe pour un modelId,
 * ses champs V2 prennent la priorite sur service_guide.
 */
const motorcycleSheetV2Registry: Record<string, MotorcycleSheetV2> = {
  'cfmoto-675sr-r-2025-plus': cfmoto675srrV2,
  'cfmoto-450sr-2023-plus': cfmoto450srV2,
};

export function getLocalMotorcycleSheetV2(
  modelId: string
): MotorcycleSheetV2 | null {
  return motorcycleSheetV2Registry[modelId] ?? null;
}

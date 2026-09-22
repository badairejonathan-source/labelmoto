import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
import { voge525dsxV2 } from '@/lib/motorcycle-sheets-v2/voge-525dsx';
import { vogeDs625xV2 } from '@/lib/motorcycle-sheets-v2/voge-ds625x';
import { vogeDS800XRallyV2 } from '@/lib/motorcycle-sheets-v2/voge-ds800x-rally';
import { voge900dsxV2 } from '@/lib/motorcycle-sheets-v2/voge-900dsx';
import { vogeR125V2 } from '@/lib/motorcycle-sheets-v2/voge-r125';
import { vogeR625V2 } from '@/lib/motorcycle-sheets-v2/voge-r625';
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
  'voge-ds525x-2024-plus': voge525dsxV2,
  'voge-ds625x-2025-plus': vogeDs625xV2,
  'voge-ds800x-rally-2025-plus': vogeDS800XRallyV2,
  'voge-ds900x-2025-plus': voge900dsxV2,
  'voge-r125-2025-plus': vogeR125V2,
  'voge-r625-2025-plus': vogeR625V2,
  'cfmoto-675sr-r-2025-plus': cfmoto675srrV2,
  'cfmoto-450sr-2023-plus': cfmoto450srV2,
};

export function getLocalMotorcycleSheetV2(
  modelId: string
): MotorcycleSheetV2 | null {
  return motorcycleSheetV2Registry[modelId] ?? null;
}

import type { MotorcycleSheetV2 } from '@/lib/motorcycle-sheet-v2';
import { voge525dsxV2 } from '@/lib/motorcycle-sheets-v2/voge-525dsx';
import { vogeDs625xV2 } from '@/lib/motorcycle-sheets-v2/voge-ds625x';
import { vogeDS800XRallyV2 } from '@/lib/motorcycle-sheets-v2/voge-ds800x-rally';
import { voge900dsxV2 } from '@/lib/motorcycle-sheets-v2/voge-900dsx';
import { vogeR125V2 } from '@/lib/motorcycle-sheets-v2/voge-r125';
import { vogeR625V2 } from '@/lib/motorcycle-sheets-v2/voge-r625';
import { cfmoto800mtSportExploreV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-800mt-sport-explore';
import { cfmoto800mtxV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-800mt-x';
import { cfmoto800nkV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-800nk';
import { cfmoto700clXV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-700cl-x';
import { cfmoto450nkV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-450nk';
import { cfmoto450mtV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-450mt';
import { cfmoto300nkV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-300nk';
import { cfmoto125nkV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-125nk';
import { cfmoto675srrV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-675sr-r';
import { cfmoto450srV2 } from '@/lib/motorcycle-sheets-v2/cfmoto-450sr';

import { koveNk125rV2 } from '@/lib/motorcycle-sheets-v2/kove-nk-125r';
import { kove350rrV2 } from '@/lib/motorcycle-sheets-v2/kove-350rr';
import { kove450rrV2 } from '@/lib/motorcycle-sheets-v2/kove-450rr';
import { kove450RallyV2 } from '@/lib/motorcycle-sheets-v2/kove-450-rally';
import { kove510xV2 } from '@/lib/motorcycle-sheets-v2/kove-510x';
import { kove625xProV2 } from '@/lib/motorcycle-sheets-v2/kove-625x-pro';
import { kove800xV2 } from '@/lib/motorcycle-sheets-v2/kove-800x-pro';

/**
 * Registre des fiches V2 locales LabelMoto.
 *
 * Firestore reste le socle de la fiche.
 * Lorsqu'une V2 locale valide existe pour un modelId,
 * ses champs V2 prennent la priorite sur service_guide.
 */
const motorcycleSheetV2Registry: Record<string, MotorcycleSheetV2> = {
  'kove-nk-125r-2026-plus': koveNk125rV2,
  'kove-350rr-2026-plus': kove350rrV2,
  'kove-450rr-2026-plus': kove450rrV2,
  'kove-450-rally-2024-plus': kove450RallyV2,
  'kove-510x-2025-plus': kove510xV2,
  'kove-625x-pro-2026-plus': kove625xProV2,
  'kove-800x-pro-2024-plus': kove800xV2,
  'cfmoto-675sr-r-2025-plus': cfmoto675srrV2,
  'cfmoto-450sr-2023-plus': cfmoto450srV2,
  'cfmoto-125nk-2026-plus': cfmoto125nkV2,
  'cfmoto-300nk-2020-plus': cfmoto300nkV2,
  'cfmoto-450mt-2024-plus': cfmoto450mtV2,
  'cfmoto-450nk-2023-plus': cfmoto450nkV2,
  'cfmoto-700clx-2021-plus': cfmoto700clXV2,
  'cfmoto-800nk-2024-plus': cfmoto800nkV2,
  'cfmoto-800mt-sport-explore-2023-plus': cfmoto800mtSportExploreV2,
  'cfmoto-800mt-x-2025-plus': cfmoto800mtxV2,
  'cfmoto-800mt-touring-2025-plus': cfmoto800mtSportExploreV2,
  'voge-ds525x-2024-plus': voge525dsxV2,
  'voge-ds625x-2025-plus': vogeDs625xV2,
  'voge-ds800x-rally-2025-plus': vogeDS800XRallyV2,
  'voge-ds900x-2025-plus': voge900dsxV2,
  'voge-r125-2025-plus': vogeR125V2,
  'voge-r625-2025-plus': vogeR625V2,
};

export function getLocalMotorcycleSheetV2(
  modelId: string
): MotorcycleSheetV2 | null {
  return motorcycleSheetV2Registry[modelId] ?? null;
}

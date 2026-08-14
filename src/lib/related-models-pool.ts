/**
 * related-models-pool.ts — LabelMoto
 * Pool centralisé pour la section "MODÈLES ÉQUIVALENTS" des fiches.
 *
 * La sélection se fait sur trois critères, par ordre de priorité :
 *   1. Les related_models déclarés dans la fiche Firestore (si présents)
 *   2. Même famille de catégorie ET cylindrée proche
 *   3. Cylindrée proche uniquement (repli)
 *
 * À placer dans : src/lib/related-models-pool.ts
 */

export type RelatedModel = {
  id: string;
  name: string;
  cc: number;
  category: string;
};

/** Familles de catégories — les motos d'une même famille sont interchangeables. */
const CATEGORY_FAMILIES: Record<string, string> = {
  roadster: 'roadster',
  'neo-retro': 'roadster',
  scrambler: 'roadster',
  custom: 'custom',
  sportive: 'sportive',
  'routiere-sportive': 'routiere',
  routiere: 'routiere',
  trail: 'trail',
  'maxi-trail': 'trail',
  'trail-moyen': 'trail',
};

export function familyOf(category?: string): string {
  if (!category) return 'roadster';
  const key = category.toLowerCase().trim();
  return CATEGORY_FAMILIES[key] || key;
}

export const RELATED_MODELS_POOL: RelatedModel[] = [
  // ---------- 125 cm³ (A1) ----------
  { id: 'yamaha-mt125-2020-plus',            name: 'Yamaha MT-125',            cc: 125, category: 'roadster' },
  { id: 'yamaha-yzf-r125-2019-plus',         name: 'Yamaha YZF-R125',          cc: 125, category: 'sportive' },
  { id: 'ktm-125-duke-2024-plus',            name: 'KTM 125 Duke',             cc: 125, category: 'roadster' },
  { id: 'ktm-rc125-2022-plus',               name: 'KTM RC 125',               cc: 125, category: 'sportive' },
  { id: 'aprilia-rs125-2023-plus',           name: 'Aprilia RS 125',           cc: 125, category: 'sportive' },
  { id: 'honda-cb125r-2021-plus',            name: 'Honda CB125R',             cc: 125, category: 'roadster' },
  { id: 'benelli-leoncino125-2022-plus',     name: 'Benelli Leoncino 125',     cc: 125, category: 'roadster' },
  { id: 'benelli-tnt125-2021-plus',          name: 'Benelli TNT 125',          cc: 125, category: 'roadster' },
  { id: 'cfmoto-125nk-2026-plus',            name: 'CFMOTO 125NK',             cc: 125, category: 'roadster' },
  { id: 'husqvarna-svartpilen-125-2025-plus',name: 'Husqvarna Svartpilen 125', cc: 125, category: 'roadster' },
  { id: 'husqvarna-vitpilen-125-2025-plus',  name: 'Husqvarna Vitpilen 125',   cc: 125, category: 'roadster' },
  { id: 'zontes-125-urban-2026-plus',        name: 'ZONTES 125 Urban',         cc: 125, category: 'roadster' },
  { id: 'zontes-125-roadster-r-2026-plus',   name: 'ZONTES 125 Roadster R',    cc: 125, category: 'roadster' },
  { id: 'zontes-125-scrambler-x-2026-plus',  name: 'ZONTES 125 Scrambler X',   cc: 125, category: 'roadster' },
  { id: 'zontes-125-hyper-trail-2026-plus',  name: 'ZONTES 125 Hyper Trail',   cc: 125, category: 'trail' },
  { id: 'zontes-125-c2-2026-plus',           name: 'ZONTES 125 C2',            cc: 125, category: 'custom' },
  { id: 'qjmotor-srk-125-s-2026-plus',       name: 'QJ Motor SRK 125 S',       cc: 125, category: 'roadster' },
  { id: 'qjmotor-srk-125-s2-2026-plus',      name: 'QJ Motor SRK 125 S2',      cc: 125, category: 'roadster' },
  { id: 'qjmotor-srk-125-r-2026-plus',       name: 'QJ Motor SRK 125 R',       cc: 125, category: 'sportive' },
  { id: 'qjmotor-srt-125-dx-2026-plus',      name: 'QJ Motor SRT 125 DX',      cc: 125, category: 'trail' },
  { id: 'qjmotor-srv-125-2026-plus',         name: 'QJ Motor SRV 125',         cc: 125, category: 'custom' },
  { id: 'orcal-astor-3-2026-plus',           name: 'Orcal Astor 3',            cc: 125, category: 'roadster' },
  { id: 'orcal-tabor-125-2026-plus',         name: 'Orcal Tabor 125',          cc: 125, category: 'trail' },
  { id: 'orcal-altimo-125-2026-plus',        name: 'Orcal Altimo 125',         cc: 125, category: 'roadster' },
  { id: 'mash-seventy-125-2026-plus',        name: 'Mash Seventy 125',         cc: 125, category: 'roadster' },
  { id: 'mash-black-seven-125-2026-plus',    name: 'Mash Black Seven 125',     cc: 125, category: 'roadster' },
  { id: 'mash-british-seven-125-2026-plus',  name: 'Mash British Seven 125',   cc: 125, category: 'roadster' },
  { id: 'mash-x-ride-125-2026-plus',         name: 'Mash X-Ride 125',          cc: 125, category: 'trail' },
  { id: 'kove-nk-125r-2026-plus',            name: 'KOVE NK 125R',             cc: 125, category: 'roadster' },

  // ---------- 250-400 cm³ ----------
  { id: 'yamaha-mt-03-2020-plus',            name: 'Yamaha MT-03',             cc: 321, category: 'roadster' },
  { id: 'cfmoto-300nk-2020-plus',            name: 'CFMOTO 300NK',             cc: 292, category: 'roadster' },
  { id: 'voge-300ac-2021-plus',              name: 'VOGE 300 AC',              cc: 292, category: 'roadster' },
  { id: 'benelli-imperiale400-2019-plus',    name: 'Benelli Imperiale 400',    cc: 374, category: 'roadster' },
  { id: 'kawasaki-z125-2019-plus',           name: 'Kawasaki Z125',            cc: 125, category: 'roadster' },

  // ---------- 450-550 cm³ (A2) ----------
  { id: 'cfmoto-450nk-2023-plus',            name: 'CFMOTO 450NK',             cc: 449, category: 'roadster' },
  { id: 'cfmoto-450sr-2023-plus',            name: 'CFMOTO 450SR',             cc: 450, category: 'sportive' },
  { id: 'cfmoto-450mt-2024-plus',            name: 'CFMOTO 450MT',             cc: 449, category: 'trail' },
  { id: 'honda-cb500f-2022-plus',            name: 'Honda CB500 Hornet',       cc: 471, category: 'roadster' },
  { id: 'honda-cbr500r-2022-plus',           name: 'Honda CBR500R',            cc: 471, category: 'sportive' },
  { id: 'honda-nx500-cb500x-2022-plus',      name: 'Honda NX500',              cc: 471, category: 'trail' },
  { id: 'kawasaki-ninja-500-se-2024-plus',   name: 'Kawasaki Ninja 500 SE',    cc: 451, category: 'sportive' },
  { id: 'voge-500r-525r-2022-plus',          name: 'VOGE 500R / 525R',         cc: 494, category: 'roadster' },
  { id: 'voge-ds525x-2024-plus',             name: 'VOGE DS525X',              cc: 494, category: 'trail' },
  { id: 'benelli-trk502-502x-2019-plus',     name: 'Benelli TRK 502',          cc: 500, category: 'trail' },
  { id: 'benelli-leoncino500-2019-plus',     name: 'Benelli Leoncino 500',     cc: 500, category: 'roadster' },
  { id: 'benelli-502c-2021-plus',            name: 'Benelli 502C',             cc: 500, category: 'custom' },
  { id: 'benelli-tornado550-2025-plus',      name: 'Benelli Tornado 550',      cc: 554, category: 'sportive' },
  { id: 'qjmotor-srk600rs-2025-plus',        name: 'QJ Motor SRK 600 RS',      cc: 554, category: 'sportive' },
  { id: 'kove-510x-2025-plus',               name: 'KOVE 510X',                cc: 498, category: 'trail' },
  { id: 'kove-450-rally-2024-plus',          name: 'KOVE 450 Rally',           cc: 449, category: 'trail' },

  // ---------- 600-700 cm³ ----------
  { id: 'yamaha-mt-07-2021-plus',            name: 'Yamaha MT-07',             cc: 689, category: 'roadster' },
  { id: 'yamaha-xsr700-2021-plus',           name: 'Yamaha XSR700',            cc: 689, category: 'roadster' },
  { id: 'yamaha-r7-2022-plus',               name: 'Yamaha R7',                cc: 689, category: 'sportive' },
  { id: 'yamaha-tracer-7-2021-plus',         name: 'Yamaha Tracer 7',          cc: 689, category: 'routiere' },
  { id: 'yamaha-tenere700-2019-plus',        name: 'Yamaha Ténéré 700',        cc: 689, category: 'trail' },
  { id: 'kawasaki-z650-2020-plus',           name: 'Kawasaki Z650',            cc: 649, category: 'roadster' },
  { id: 'kawasaki-versys-650-2022-plus',     name: 'Kawasaki Versys 650',      cc: 649, category: 'trail' },
  { id: 'suzuki-sv650-2016-plus',            name: 'Suzuki SV650',             cc: 645, category: 'roadster' },
  { id: 'suzuki-vstrom-650-2017-plus',       name: 'Suzuki V-Strom 650',       cc: 645, category: 'trail' },
  { id: 'triumph-trident-660-2021-plus',     name: 'Triumph Trident 660',      cc: 660, category: 'roadster' },
  { id: 'cfmoto-650mt-650nk-2020-plus',      name: 'CFMOTO 650MT / 650NK',     cc: 649, category: 'trail' },
  { id: 'cfmoto-675sr-r-2025-plus',          name: 'CFMOTO 675 SR-R',          cc: 674, category: 'sportive' },
  { id: 'cfmoto-700clx-2021-plus',           name: 'CFMOTO 700 CL-X',          cc: 693, category: 'roadster' },
  { id: 'cfmoto-700mt-2023-plus',            name: 'CFMOTO 700 MT',            cc: 693, category: 'trail' },
  { id: 'voge-ds625x-2025-plus',             name: 'VOGE DS625X',              cc: 625, category: 'trail' },
  { id: 'benelli-trk702-702x-2023-plus',     name: 'Benelli TRK 702',          cc: 698, category: 'trail' },
  { id: 'qjmotor-srt700sx-touring-2024-plus',name: 'QJ Motor SRT 700 SX',      cc: 698, category: 'trail' },

  // ---------- 750-900 cm³ ----------
  { id: 'honda-cb750-hornet-2023-plus',      name: 'Honda CB750 Hornet',       cc: 755, category: 'roadster' },
  { id: 'honda-xl750-transalp-2023-plus',    name: 'Honda XL750 Transalp',     cc: 755, category: 'trail' },
  { id: 'suzuki-gsx-8s-2023-plus',           name: 'Suzuki GSX-8S',            cc: 776, category: 'roadster' },
  { id: 'suzuki-gsx-8r-2024-plus',           name: 'Suzuki GSX-8R',            cc: 776, category: 'sportive' },
  { id: 'suzuki-gsxs750-2017-plus',          name: 'Suzuki GSX-S750',          cc: 749, category: 'roadster' },
  { id: 'yamaha-mt09-2021-plus',             name: 'Yamaha MT-09',             cc: 890, category: 'roadster' },
  { id: 'benelli-752s-2022-plus',            name: 'Benelli 752S',             cc: 754, category: 'roadster' },
  { id: 'benelli-leoncino800-2022-plus',     name: 'Benelli Leoncino 800',     cc: 754, category: 'roadster' },
  { id: 'cfmoto-800nk-2024-plus',            name: 'CFMOTO 800 NK',            cc: 799, category: 'roadster' },
  { id: 'cfmoto-800mt-sport-explore-2023-plus', name: 'CFMOTO 800 MT',         cc: 799, category: 'trail' },
  { id: 'cfmoto-800mt-touring-2025-plus',    name: 'CFMOTO 800MT Touring',     cc: 799, category: 'trail' },
  { id: 'qjmotor-srk800-2025-plus',          name: 'QJ Motor SRK 800',         cc: 799, category: 'roadster' },
  { id: 'qjmotor-srk800rr-2024-plus',        name: 'QJ Motor SRK 800 RR',      cc: 778, category: 'sportive' },
  { id: 'qjmotor-srt900sx-touring-2025-plus',name: 'QJ Motor SRT 900 SX',      cc: 904, category: 'trail' },
  { id: 'voge-ds800x-rally-2025-plus',       name: 'VOGE DS800X Rally',        cc: 798, category: 'trail' },
  { id: 'voge-ds900x-2025-plus',             name: 'VOGE DS900X',              cc: 895, category: 'trail' },
  { id: 'kove-800x-pro-2024-plus',           name: 'KOVE 800X Pro',            cc: 799, category: 'trail' },
  { id: 'bmw-f900r-2020-plus',               name: 'BMW F 900 R',              cc: 895, category: 'roadster' },
  { id: 'bmw-f750-gs-f850-gs-2018-plus',     name: 'BMW F 750 / 850 GS',       cc: 853, category: 'trail' },

  // ---------- 900+ cm³ ----------
  { id: 'kawasaki-z900-2020-plus',           name: 'Kawasaki Z900',            cc: 948, category: 'roadster' },
  { id: 'kawasaki-z900rs-2018-plus',         name: 'Kawasaki Z900RS',          cc: 948, category: 'roadster' },
  { id: 'kawasaki-ninja1000sx-2020-plus',    name: 'Kawasaki Ninja 1000SX',    cc: 1043, category: 'routiere' },
  { id: 'honda-cb1000-hornet-2025-plus',     name: 'Honda CB1000 Hornet',      cc: 1000, category: 'roadster' },
  { id: 'honda-africa-twin-1100-2020-plus',  name: 'Honda Africa Twin 1100',   cc: 1084, category: 'trail' },
  { id: 'bmw-s1000r-2021-plus',              name: 'BMW S 1000 R',             cc: 999, category: 'roadster' },
  { id: 'bmw-r1250-gs-r1300-gs-2019-plus',   name: 'BMW R 1250 / 1300 GS',     cc: 1254, category: 'trail' },
];

/**
 * Sélectionne jusqu'à 4 modèles équivalents.
 *
 * @param currentId   id de la fiche affichée (exclu des résultats)
 * @param currentCC   cylindrée de la moto courante
 * @param category    catégorie de la moto courante
 * @param declared    relations.related_models de la fiche (prioritaires)
 */
export function pickRelatedModels(
  currentId: string,
  currentCC: number | null,
  category?: string,
  declared?: string[]
): RelatedModel[] {
  const results: RelatedModel[] = [];
  const seen = new Set<string>([currentId]);

  // 1. Priorité aux related_models déclarés dans la fiche
  if (declared?.length) {
    for (const id of declared) {
      if (seen.has(id)) continue;
      const found = RELATED_MODELS_POOL.find(m => m.id === id);
      if (found) {
        results.push(found);
        seen.add(id);
      }
      if (results.length >= 4) return results;
    }
  }

  const family = familyOf(category);

  // 2. Même famille de catégorie + cylindrée proche
  if (currentCC && !isNaN(currentCC)) {
    // Tolérance proportionnelle : ±40 % pour les petites cylindrées,
    // resserrée en valeur absolue pour les grosses.
    const margin = Math.max(60, Math.min(currentCC * 0.4, 300));
    const min = currentCC - margin;
    const max = currentCC + margin;

    const sameFamily = RELATED_MODELS_POOL
      .filter(m => !seen.has(m.id) && familyOf(m.category) === family && m.cc >= min && m.cc <= max)
      .sort((a, b) => Math.abs(a.cc - currentCC) - Math.abs(b.cc - currentCC));

    for (const m of sameFamily) {
      results.push(m);
      seen.add(m.id);
      if (results.length >= 4) return results;
    }

    // 3. Repli : cylindrée proche, toutes catégories
    const nearCC = RELATED_MODELS_POOL
      .filter(m => !seen.has(m.id) && m.cc >= min && m.cc <= max)
      .sort((a, b) => Math.abs(a.cc - currentCC) - Math.abs(b.cc - currentCC));

    for (const m of nearCC) {
      results.push(m);
      seen.add(m.id);
      if (results.length >= 4) return results;
    }
  }

  // 4. Dernier repli : même famille, n'importe quelle cylindrée
  const anyFamily = RELATED_MODELS_POOL.filter(
    m => !seen.has(m.id) && familyOf(m.category) === family
  );
  for (const m of anyFamily) {
    results.push(m);
    seen.add(m.id);
    if (results.length >= 4) break;
  }

  return results;
}

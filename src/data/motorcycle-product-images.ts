/**
 * Images produit des fiches moto LabelMoto.
 *
 * Ces images sont des visuels originaux sans marque/texte, stockés localement
 * dans public/images/motorcycles. Le mapping se fait à partir de l'id Firestore
 * et, en repli, des champs brand/model/display_title/slug afin de rester robuste
 * si une fiche a un slug historique légèrement différent.
 */

export type MotorcycleImageContext = {
  modelId: string;
  brand?: unknown;
  model?: unknown;
  displayTitle?: unknown;
  slug?: unknown;
  variantLabel?: unknown;
};

type MotorcycleProductImageEntry = {
  imageUrl: string;
  exactIds?: string[];
  aliases: string[];
};

function normalize(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

const entries: MotorcycleProductImageEntry[] = [
  // ZONTES 125
  {
    imageUrl: '/images/motorcycles/125-Scrambler-X.webp',
    exactIds: ['zontes-125-scrambler-x-2026-plus'],
    aliases: ['zontes 125 scrambler x'],
  },
  {
    imageUrl: '/images/motorcycles/Zontes-125-Hyper-Trail.webp',
    exactIds: ['zontes-125-hyper-trail-2026-plus'],
    aliases: ['zontes 125 hyper trail'],
  },
  {
    imageUrl: '/images/motorcycles/Zontes-125-Roadster.webp',
    exactIds: ['zontes-125-roadster-r-2026-plus'],
    aliases: ['zontes 125 roadster r', 'zontes 125 roadster'],
  },
  {
    imageUrl: '/images/motorcycles/Zontes-125-Urban(1).webp',
    exactIds: ['zontes-125-urban-2026-plus'],
    aliases: ['zontes 125 urban'],
  },
  {
    imageUrl: '/images/motorcycles/Zontes-125C2.webp',
    exactIds: ['zontes-125-c2-2026-plus'],
    aliases: ['zontes 125 c2', 'zontes 125c2'],
  },

  // ZONTES 350 / 703
  {
    imageUrl: '/images/motorcycles/ZONTES-350GK.webp',
    exactIds: [
      'zontes-350gk-2022-plus',
      'zontes-gk350-2022-plus',
      'zontes-350-gk-2022-plus',
      'zontes-gk-350-2022-plus',
    ],
    aliases: ['zontes 350 gk', 'zontes gk 350', 'zontes 350gk', 'zontes gk350'],
  },
  {
    imageUrl: '/images/motorcycles/Zontes-703-F-Adventure.webp',
    exactIds: [
      'zontes-703-f-adventure-2026-plus',
      'zontes-703-f-2026-plus',
      'zontes-703f-2026-plus',
      'zontes-703-f-adventure-2025-plus',
      'zontes-703-f-2025-plus',
      'zontes-703f-2025-plus',
    ],
    aliases: ['zontes 703 f adventure', 'zontes 703f adventure', 'zontes 703 f', 'zontes 703f'],
  },
  {
    imageUrl: '/images/motorcycles/Zontes-703-RR.webp',
    exactIds: [
      'zontes-703-rr-2026-plus',
      'zontes-703rr-2026-plus',
      'zontes-703-rr-2025-plus',
      'zontes-703rr-2025-plus',
    ],
    aliases: ['zontes 703 rr', 'zontes 703rr'],
  },
  {
    imageUrl: '/images/motorcycles/Zontes-703-T.webp',
    exactIds: [
      'zontes-703-t-2026-plus',
      'zontes-703t-2026-plus',
      'zontes-703-t-2025-plus',
      'zontes-703t-2025-plus',
    ],
    aliases: ['zontes 703 t', 'zontes 703t'],
  },

  // QJ MOTOR
  {
    imageUrl: '/images/motorcycles/QJmotor-SRK-125-R.webp',
    exactIds: ['qjmotor-srk-125-r-2026-plus'],
    aliases: ['qj motor srk 125 r', 'qjmotor srk 125 r'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-SRV-125.webp',
    exactIds: ['qjmotor-srv-125-2026-plus'],
    aliases: ['qj motor srv 125', 'qjmotor srv 125'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-srk125S2.webp',
    exactIds: ['qjmotor-srk-125-s2-2026-plus'],
    aliases: ['qj motor srk 125 s2', 'qjmotor srk 125 s2'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-srk125s.webp',
    exactIds: ['qjmotor-srk-125-s-2026-plus'],
    aliases: ['qj motor srk 125 s', 'qjmotor srk 125 s'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-srt125dx.webp',
    exactIds: ['qjmotor-srt-125-dx-2026-plus'],
    aliases: ['qj motor srt 125 dx', 'qjmotor srt 125 dx'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-srk600rs.webp',
    exactIds: ['qjmotor-srk600rs-2025-plus'],
    aliases: ['qj motor srk 600 rs', 'qjmotor srk600rs'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-SRT-700-SX-Touring.webp',
    exactIds: ['qjmotor-srt700sx-touring-2024-plus'],
    aliases: ['qj motor srt 700 sx touring', 'qj motor srt 700 sx', 'qjmotor srt700sx'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-srk800.webp',
    exactIds: ['qjmotor-srk800-2025-plus'],
    aliases: ['qj motor srk 800', 'qjmotor srk800'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-srk800rr.webp',
    exactIds: ['qjmotor-srk800rr-2024-plus'],
    aliases: ['qj motor srk 800 rr', 'qjmotor srk800rr'],
  },
  {
    imageUrl: '/images/motorcycles/QJmotor-srt900sxtouring.webp',
    exactIds: ['qjmotor-srt900sx-touring-2025-plus'],
    aliases: ['qj motor srt 900 sx touring', 'qj motor srt 900 sx', 'qjmotor srt900sx'],
  },

  // YAMAHA
  {
    imageUrl: "/images/motorcycles/Yamaha-MT03-original-v2.jpg",
    exactIds: ['yamaha-mt-03-2020-plus'],
    aliases: ['yamaha mt 03', 'yamaha mt03'],
  },
  {
    imageUrl: '/images/motorcycles/Yamaha-MT125A.webp',
    exactIds: ['yamaha-mt125-2020-plus'],
    aliases: ['yamaha mt 125', 'yamaha mt125'],
  },
  {
    imageUrl: '/images/motorcycles/Yamaha-YZF-R125A.webp',
    exactIds: ['yamaha-yzf-r125-2019-plus'],
    aliases: ['yamaha yzf r125', 'yamaha r125'],
  },
  {
    imageUrl: '/images/motorcycles/Yamaha-YZF700R7.webp',
    exactIds: ['yamaha-r7-2022-plus'],
    aliases: ['yamaha yzf 700 r7', 'yamaha r7'],
  },

  // CFMOTO
  {
    imageUrl: "/images/motorcycles/cfmoto-125NK.webp",
    exactIds: ['cfmoto-125nk-2026-plus', 'cfmoto-nk125r-2026-plus'],
    aliases: ['cfmoto 125 nk', 'cfmoto 125nk', 'cfmoto nk125r'],
  },
  {
    imageUrl: '/images/motorcycles/cfmoto-300NK.webp',
    exactIds: ['cfmoto-300nk-2020-plus'],
    aliases: ['cfmoto 300 nk', 'cfmoto 300nk'],
  },
  {
    imageUrl: '/images/motorcycles/cfmoto-450MT.webp',
    exactIds: ['cfmoto-450mt-2024-plus'],
    aliases: ['cfmoto 450 mt', 'cfmoto 450mt'],
  },
  {
    imageUrl: '/images/motorcycles/cfmoto-450NK.webp',
    exactIds: ['cfmoto-450nk-2023-plus'],
    aliases: ['cfmoto 450 nk', 'cfmoto 450nk'],
  },
  {
    imageUrl: "/images/motorcycles/cfmoto-450SR.webp",
    exactIds: ['cfmoto-450sr-2023-plus'],
    aliases: ['cfmoto 450 sr', 'cfmoto 450sr'],
  },
  {
    imageUrl: '/images/motorcycles/cfmoto-675NK.webp',
    exactIds: ['cfmoto-675nk-2025-plus', 'cfmoto-675-nk-2025-plus'],
    aliases: ['cfmoto 675 nk', 'cfmoto 675nk'],
  },
  {
    imageUrl: '/images/motorcycles/cfmoto-675sr-r.webp',
    exactIds: ['cfmoto-675sr-r-2025-plus'],
    aliases: ['cfmoto 675 sr r', 'cfmoto 675srr'],
  },
  {
    imageUrl: "/images/motorcycles/cfmoto-700MT.webp",
    exactIds: ['cfmoto-700mt-2023-plus'],
    aliases: ['cfmoto 700 mt', 'cfmoto 700mt'],
  },
  {
    imageUrl: '/images/motorcycles/cfmoto-800NK.webp',
    exactIds: ['cfmoto-800nk-2024-plus'],
    aliases: ['cfmoto 800 nk', 'cfmoto 800nk'],
  },

  // KOVE
  {
    imageUrl: "/images/motorcycles/KOVE-NK-125-R.webp",
    exactIds: ['kove-nk-125r-2026-plus'],
    aliases: ['kove nk 125r', 'kove nk125r', 'kove nk 125 r'],
  },
  {
    imageUrl: "/images/motorcycles/kove-510x.webp",
    exactIds: ['kove-510x-2025-plus'],
    aliases: ['kove 510x', 'kove 510 x'],
  },
  {
    imageUrl: "/images/motorcycles/kove-450rally.webp",
    exactIds: ['kove-450-rally-2024-plus'],
    aliases: ['kove 450 rally', 'kove 450rally'],
  },

  // VOGE
  {
    imageUrl: '/images/motorcycles/voge-300AC.webp',
    exactIds: ['voge-300ac-2021-plus'],
    aliases: ['voge 300 ac', 'voge 300ac'],
  },
  {
    imageUrl: '/images/motorcycles/voge-300R.webp',
    exactIds: ['voge-300r-2021-plus', 'voge-300r-2020-plus'],
    aliases: ['voge 300 r', 'voge 300r'],
  },
  {
    imageUrl: '/images/motorcycles/voge-DS525X-Klein-blue-R.webp',
    exactIds: ['voge-ds525x-2024-plus'],
    aliases: ['voge ds525x', 'voge ds 525x', 'voge 525 dsx'],
  },
  {
    imageUrl: '/images/motorcycles/voge-DS625X-2.webp',
    exactIds: ['voge-ds625x-2025-plus'],
    aliases: ['voge ds625x', 'voge ds 625x'],
  },
  {
    imageUrl: '/images/motorcycles/voge-800X.webp',
    exactIds: ['voge-ds800x-rally-2025-plus', 'voge-800x-2025-plus'],
    aliases: ['voge ds800x rally', 'voge ds 800x rally', 'voge 800x'],
  },
  {
    imageUrl: '/images/motorcycles/voge-DS900X(4).webp',
    exactIds: ['voge-ds900x-2025-plus'],
    aliases: ['voge ds900x', 'voge ds 900x'],
  },
  // LABELMOTO PACK 51 - 20260911
  // Visuels audites et optimises : 51 images / 49 nouvelles entrees.
  {
    imageUrl: '/images/motorcycles/Aprilia-RS-125.webp',
    exactIds: ['aprilia-rs125-2023-plus'],
    aliases: ['aprilia rs 125', 'aprilia rs125'],
  },
  {
    imageUrl: '/images/motorcycles/BMW-F750-GS-F850-GS.webp',
    exactIds: ['bmw-f750-gs-f850-gs-2018-plus'],
    aliases: ['bmw f 750 850 gs', 'bmw f750 gs f850 gs', 'bmw f 750 gs', 'bmw f 850 gs'],
  },
  {
    imageUrl: '/images/motorcycles/BMW-F900R.webp',
    exactIds: ['bmw-f900r-2020-plus'],
    aliases: ['bmw f 900 r', 'bmw f900r'],
  },
  {
    imageUrl: '/images/motorcycles/BMW-G310R.webp',
    exactIds: ['bmw-g310r-2021-plus', 'bmw-g310r-2017-plus'],
    aliases: ['bmw g 310 r', 'bmw g310r'],
  },
  {
    imageUrl: '/images/motorcycles/BMW-R1250-GS.webp',
    exactIds: ['bmw-r1250-gs-r1300-gs-2019-plus'],
    aliases: ['bmw r 1250 1300 gs', 'bmw r1250 gs', 'bmw r1300 gs'],
  },
  {
    imageUrl: '/images/motorcycles/BMW-S1000R.webp',
    exactIds: ['bmw-s1000r-2021-plus'],
    aliases: ['bmw s 1000 r', 'bmw s1000r'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-502C.webp',
    exactIds: ['benelli-502c-2021-plus'],
    aliases: ['benelli 502c', 'benelli 502 c'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-752S.webp',
    exactIds: ['benelli-752s-2022-plus'],
    aliases: ['benelli 752s', 'benelli 752 s'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-Imperiale-400.webp',
    exactIds: ['benelli-imperiale400-2019-plus'],
    aliases: ['benelli imperiale 400', 'benelli imperiale400'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-TNT-125.webp',
    exactIds: ['benelli-tnt125-2021-plus'],
    aliases: ['benelli tnt 125', 'benelli tnt125'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-Africa-Twin-1100.webp',
    exactIds: ['honda-africa-twin-1100-2020-plus'],
    aliases: ['honda africa twin 1100', 'honda crf1100', 'honda crf1100l'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-CB1000-Hornet.webp',
    exactIds: ['honda-cb1000-hornet-2025-plus'],
    aliases: ['honda cb1000 hornet', 'honda cb 1000 hornet'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-CB125F.webp',
    aliases: ['honda cb125f', 'honda cb 125 f'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-CB125R.webp',
    exactIds: ['honda-cb125r-2021-plus'],
    aliases: ['honda cb125r', 'honda cb 125 r'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-CB500-Hornet.webp',
    exactIds: ['honda-cb500f-2022-plus'],
    aliases: ['honda cb500 hornet', 'honda cb500f', 'honda cb 500 hornet'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-CB650R.webp',
    aliases: ['honda cb650r', 'honda cb 650 r'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-CB750-Hornet.webp',
    exactIds: ['honda-cb750-hornet-2023-plus'],
    aliases: ['honda cb750 hornet', 'honda cb 750 hornet'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-MSX-125-Grom.webp',
    aliases: ['honda msx 125 grom', 'honda msx125', 'honda grom'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-NX500.webp',
    exactIds: ['honda-nx500-2024-plus'],
    aliases: ['honda nx500', 'honda nx 500', 'honda cb500x'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-XL750-Transalp.webp',
    exactIds: ['honda-xl750-transalp-2023-plus'],
    aliases: ['honda xl750 transalp', 'honda transalp 750'],
  },
  {
    imageUrl: '/images/motorcycles/Honda-CBR500R.webp',
    exactIds: ['honda-cbr500r-2022-plus'],
    aliases: ['honda cbr500r', 'honda cbr 500 r'],
  },
  {
    imageUrl: '/images/motorcycles/Husqvarna-Svartpilen-125.webp',
    exactIds: ['husqvarna-svartpilen-125-2025-plus'],
    aliases: ['husqvarna svartpilen 125'],
  },
  {
    imageUrl: '/images/motorcycles/Husqvarna-Vitpilen-125.webp',
    exactIds: ['husqvarna-vitpilen-125-2025-plus'],
    aliases: ['husqvarna vitpilen 125'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-ER6N.webp',
    aliases: ['kawasaki er6n', 'kawasaki er 6n', 'kawasaki er-6n'],
  },
  {
    imageUrl: "/images/motorcycles/Yamaha-Tracer-7-original-v2.jpg",
    exactIds: ['yamaha-tracer-7-2021-plus'],
    aliases: ['yamaha tracer 7', 'yamaha tracer7'],
  },
  {
    imageUrl: "/images/motorcycles/Yamaha-MT07-original-v2.jpg",
    exactIds: ['yamaha-mt-07-2021-plus'],
    aliases: ['yamaha mt 07', 'yamaha mt07'],
  },
  {
    imageUrl: "/images/motorcycles/Yamaha-MT09-original-v2.jpg",
    exactIds: ['yamaha-mt09-2021-plus'],
    aliases: ['yamaha mt 09', 'yamaha mt09'],
  },
  {
    imageUrl: "/images/motorcycles/Yamaha-XSR700-original-v2.jpg",
    aliases: ['yamaha xsr700', 'yamaha xsr 700'],
  },
  {
    imageUrl: "/images/motorcycles/Yamaha-Tenere-700-original-v2.jpg",
    exactIds: ['yamaha-tenere700-2019-plus'],
    aliases: ['yamaha tenere 700', 'yamaha tenere700', 'yamaha xtz700'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-Leoncino-125.webp',
    exactIds: ['benelli-leoncino125-2022-plus'],
    aliases: ['benelli leoncino 125', 'benelli leoncino125'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-Leoncino-800.webp',
    exactIds: ['benelli-leoncino800-2022-plus'],
    aliases: ['benelli leoncino 800', 'benelli leoncino800'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-TRK-502X.webp',
    exactIds: ['benelli-trk502-502x-2019-plus'],
    aliases: ['benelli trk 502', 'benelli trk 502x', 'benelli trk502', 'benelli trk502x'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-TRK-702X.webp',
    exactIds: ['benelli-trk702-702x-2023-plus'],
    aliases: ['benelli trk 702', 'benelli trk 702x', 'benelli trk702', 'benelli trk702x'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-Tornado-550.webp',
    exactIds: ['benelli-tornado550-2025-plus'],
    aliases: ['benelli tornado 550', 'benelli tornado550'],
  },
  {
    imageUrl: '/images/motorcycles/Benelli-Leoncino-500.webp',
    exactIds: ['benelli-leoncino500-2019-plus'],
    aliases: ['benelli leoncino 500', 'benelli leoncino500'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-KLE500.webp',
    aliases: ['kawasaki kle500', 'kawasaki kle 500'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-Ninja-1000SX.webp',
    exactIds: ['kawasaki-ninja1000sx-2020-plus'],
    aliases: ['kawasaki ninja 1000sx', 'kawasaki ninja1000sx'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-Ninja-500-SE.webp',
    exactIds: ['kawasaki-ninja-500-se-2024-plus'],
    aliases: ['kawasaki ninja 500 se', 'kawasaki ninja500 se'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-Versys-650.webp',
    exactIds: ['kawasaki-versys-650-2022-plus'],
    aliases: ['kawasaki versys 650', 'kawasaki versys650'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-Z125.webp',
    exactIds: ['kawasaki-z125-2019-plus'],
    aliases: ['kawasaki z125', 'kawasaki z 125'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-Z650.webp',
    exactIds: ['kawasaki-z650-2020-plus'],
    aliases: ['kawasaki z650', 'kawasaki z 650'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-Z900.webp',
    exactIds: ['kawasaki-z900-2020-plus'],
    aliases: ['kawasaki z900', 'kawasaki z 900'],
  },
  {
    imageUrl: '/images/motorcycles/Kawasaki-Z900RS.webp',
    exactIds: ['kawasaki-z900rs-2018-plus'],
    aliases: ['kawasaki z900rs', 'kawasaki z900 rs'],
  },
  {
    imageUrl: '/images/motorcycles/Suzuki-GSX-8R.webp',
    exactIds: ['suzuki-gsx-8r-2024-plus'],
    aliases: ['suzuki gsx 8r', 'suzuki gsx8r'],
  },
  {
    imageUrl: '/images/motorcycles/Suzuki-GSX-8S.webp',
    exactIds: ['suzuki-gsx-8s-2023-plus'],
    aliases: ['suzuki gsx 8s', 'suzuki gsx8s'],
  },
  {
    imageUrl: '/images/motorcycles/Suzuki-GSX-S750.webp',
    exactIds: ['suzuki-gsxs750-2017-plus'],
    aliases: ['suzuki gsx s750', 'suzuki gsxs750'],
  },
  {
    imageUrl: '/images/motorcycles/Suzuki-SV650.webp',
    exactIds: ['suzuki-sv650-2016-plus'],
    aliases: ['suzuki sv650', 'suzuki sv 650'],
  },
  {
    imageUrl: '/images/motorcycles/Suzuki-V-Strom-650.webp',
    exactIds: ['suzuki-vstrom-650-2017-plus'],
    aliases: ['suzuki v strom 650', 'suzuki vstrom 650'],
  },
  {
    imageUrl: '/images/motorcycles/Triumph-Trident-660.webp',
    exactIds: ['triumph-trident-660-2021-plus'],
    aliases: ['triumph trident 660'],
  },
  {
    imageUrl: "/images/motorcycles/kove-800x-pro-v2.webp",
    exactIds: ["kove-800x-pro-2024-plus"],
    aliases: ["kove 800x pro", "kove 800 x pro"],
  },
  {
    imageUrl: "/images/motorcycles/Voge-500R.webp",
    exactIds: ["voge-500r-525r-2022-plus"],
    aliases: ["voge 500r", "voge 500 r", "voge 525r", "voge 525 r"],
  },
  {
    imageUrl: "/images/motorcycles/cfmoto-700CLX.webp",
    exactIds: ["cfmoto-700clx-2021-plus"],
    aliases: ["cfmoto 700 cl x", "cfmoto 700 clx", "cfmoto 700clx"],
  },
];

export const MOTORCYCLE_PRODUCT_IMAGE_ENTRIES = entries;

/**
 * Retourne le visuel produit correspondant à une fiche, ou null si aucune
 * image dédiée n'existe dans le pack LabelMoto.
 */
export function getMotorcycleProductImage(
  context: MotorcycleImageContext
): string | null {
  const modelId = String(context.modelId || '');
  const normalizedId = normalize(modelId);
  const variant = normalize(context.variantLabel);

  // LABELMOTO PACK 51 - 20260911 / BMW R1250 GS + R1300 GS
  const bmwCombinedGs =
    normalizedId === normalize('bmw-r1250-gs-r1300-gs-2019-plus');

  if (bmwCombinedGs) {
    const bmwVariantHaystack = normalize([
      context.variantLabel,
      context.model,
      context.displayTitle,
    ].join(' '));

    if (
      variant.includes('1300') ||
      (bmwVariantHaystack.includes('r1300') && !bmwVariantHaystack.includes('r1250'))
    ) {
      return '/images/motorcycles/BMW-R1300-GS.webp';
    }

    return '/images/motorcycles/BMW-R1250-GS.webp';
  }

  // Cas particulier : la fiche 800 MT regroupe Explore + Sport.
  const cfmoto800mtHaystack = normalize([
    modelId,
    context.brand,
    context.model,
    context.displayTitle,
    context.slug,
  ].join(' '));

  if (cfmoto800mtHaystack.includes('cfmoto800mt')) {
    if (variant.includes('sport')) {
      return '/images/motorcycles/cfmoto-800MT-sport.webp';
    }

    // Explore est le premier variant actuel et le repli de la fiche combinée.
    return '/images/motorcycles/cfmoto-800MT-explore.webp';
  }

  const exact = entries.find(entry =>
    entry.exactIds?.some(id => normalize(id) === normalizedId)
  );

  if (exact) {
    return exact.imageUrl;
  }

  const haystack = normalize([
    modelId,
    context.brand,
    context.model,
    context.displayTitle,
    context.slug,
  ].join(' '));

  // Les alias les plus spécifiques sont évalués avant les plus courts.
  const candidates = entries
    .flatMap(entry => entry.aliases.map(alias => ({
      entry,
      alias: normalize(alias),
    })))
    .sort((a, b) => b.alias.length - a.alias.length);

  const match = candidates.find(candidate =>
    candidate.alias.length >= 6 && haystack.includes(candidate.alias)
  );

  return match?.entry.imageUrl ?? null;
}

export function isMotorcycleProductImage(value: unknown): boolean {
  return String(value ?? '').startsWith('/images/motorcycles/');
}

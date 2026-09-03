'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useEffect,
  useState,
} from 'react';

import {
  ArrowRight,
  Bike,
  BookOpen,
  Camera,
  ChevronDown,
  Clock3,
  Crosshair,
  Heart,
  Map,
  MapPin,
  Menu,
  Paintbrush,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react';

import LabelMotoLogo from '@/components/app/logo';

type Side =
  | 'left'
  | 'right'
  | 'center';

type QuickChoice = {
  label: string;
  value: string;
  filter?: string;
  icon: ComponentType<{
    className?: string;
  }>;
};

type ProChoice = {
  label: string;
  href: string;
  icon: ComponentType<{
    className?: string;
  }>;
};

const QUICK_CHOICES: QuickChoice[] = [
  {
    label: 'Concessions',
    value: 'Concession moto',
    filter: 'shopping',
    icon: Store,
  },
  {
    label: 'Garages',
    value: 'Garage moto',
    filter: 'service',
    icon: Wrench,
  },
  {
    label: 'Associations',
    value: 'Association moto',
    filter: 'association',
    icon: Users,
  },
  {
    label: 'Relais motards',
    value: 'Relais motards',
    filter: 'relais',
    icon: MapPin,
  },
];

const PRO_CHOICES: ProChoice[] = [
  {
    label: 'Garages & ateliers',
    href: '/map?filter=service',
    icon: Wrench,
  },
  {
    label: 'Concessions',
    href: '/map?filter=shopping',
    icon: Store,
  },
  {
    label: 'Transporteurs moto',
    href: '/map?search=transporteur%20moto',
    icon: Truck,
  },
  {
    label: 'Préparateurs',
    href: '/map?search=préparateur%20moto',
    icon: Settings,
  },
  {
    label: 'Peintres',
    href: '/map?search=peintre%20moto',
    icon: Paintbrush,
  },
  {
    label: 'Photographes',
    href: '/map?search=photographe%20moto',
    icon: Camera,
  },
  {
    label: 'Équipementiers',
    href: '/map?search=équipement%20moto',
    icon: ShoppingBag,
  },
  {
    label: 'Associations',
    href: '/map?filter=association',
    icon: Users,
  },
];

const TECH_SHEETS = [
  {
    brand: 'CFMOTO',
    model: '450MT',
    href: '/fiches/cfmoto-450mt-2024-plus',
    image: '/images/entretien-cfmoto-450mt.webp',
  },
  {
    brand: 'Honda',
    model: 'XL750 Transalp',
    href: '/fiches/honda-xl750-transalp-2023-plus',
    image: '/images/honda-xl750-transalp-2023-plus.webp',
  },
  {
    brand: 'Yamaha',
    model: 'MT-07',
    href: '/fiches/yamaha-mt-07-2021-plus',
    image: '/images/yamaha-mt07-2021-plus.webp',
  },
  {
    brand: 'VOGE',
    model: 'DS900X',
    href: '/fiches/voge-ds900x-2025-plus',
    image: null,
  },
  {
    brand: 'QJ Motor',
    model: 'SRK 800 RR',
    href: '/fiches/qjmotor-srk800rr-2024-plus',
    image: '/images/qjmotor-srk800rr-2024-plus.webp',
  },
  {
    brand: 'CFMOTO',
    model: '800MT',
    href: '/fiches/cfmoto-800mt-sport-explore-2023-plus',
    image: '/images/entretien-cfmoto-800mt.webp',
  },
  {
    brand: 'KOVE',
    model: '800X Pro',
    href: '/fiches/kove-800x-pro-2024-plus',
    image: null,
  },
];

function normalizeSearch(
  value: string
) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .trim();
}

function inferFilter(
  value: string
) {
  const normalized =
    normalizeSearch(value);

  if (
    normalized.includes('garage') ||
    normalized.includes('atelier') ||
    normalized.includes('mecan')
  ) {
    return 'service';
  }

  if (
    normalized.includes('concession')
  ) {
    return 'shopping';
  }

  if (
    normalized.includes('association')
  ) {
    return 'association';
  }

  if (
    normalized.includes('relais')
  ) {
    return 'relais';
  }

  return '';
}

/*
 * ============================================================
 * GRAND ITINERAIRE DECORATIF
 * ============================================================
 *
 * Aucun texte dans le SVG.
 * Aucune image.
 *
 * Il peut donc s'étirer avec la page sans jamais déformer
 * du contenu.
 *
 * Les courbes sont volontairement très larges et simples.
 */

function RouteBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 430 2800"
      preserveAspectRatio="none"
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        h-full
        w-full
      "
    >
      {/* quelques lignes de fond extrêmement légères */}

      <g
        fill="none"
        stroke="#edf1f3"
        strokeWidth="1"
        strokeOpacity="0.8"
      >
        <path
          d="
            M36 330
            C120 290 190 320 278 280
            C335 255 372 270 414 240
          "
        />

        <path
          d="
            M24 805
            C110 760 178 800 258 760
            C320 730 365 750 421 710
          "
        />

        <path
          d="
            M17 1320
            C107 1275 195 1315 272 1274
            C327 1244 370 1260 423 1218
          "
        />

        <path
          d="
            M19 1845
            C109 1808 190 1840 270 1804
            C327 1778 368 1795 420 1759
          "
        />

        <path
          d="
            M20 2335
            C110 2295 196 2330 277 2290
            C330 2264 375 2280 420 2244
          "
        />
      </g>

      {/* ligne blanche sous la route */}

      <path
        d="
          M354 8

          C365 102 290 111 313 195

          C343 294 415 338 389 446

          C369 528 285 549 210 566

          C125 584 68 637 75 733

          C81 812 153 851 254 872

          C363 895 402 954 379 1043

          C357 1134 271 1162 174 1173

          C83 1184 57 1253 77 1339

          C97 1423 186 1452 284 1466

          C378 1480 407 1543 380 1628

          C352 1716 270 1740 166 1764

          C73 1786 60 1861 85 1938

          C111 2019 208 2034 305 2061

          C394 2086 409 2160 375 2234

          C335 2316 241 2323 147 2357

          C70 2384 59 2453 88 2521

          C117 2594 207 2605 285 2635

          C349 2660 362 2714 341 2792
        "
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* route orange */}

      <path
        d="
          M354 8

          C365 102 290 111 313 195

          C343 294 415 338 389 446

          C369 528 285 549 210 566

          C125 584 68 637 75 733

          C81 812 153 851 254 872

          C363 895 402 954 379 1043

          C357 1134 271 1162 174 1173

          C83 1184 57 1253 77 1339

          C97 1423 186 1452 284 1466

          C378 1480 407 1543 380 1628

          C352 1716 270 1740 166 1764

          C73 1786 60 1861 85 1938

          C111 2019 208 2034 305 2061

          C394 2086 409 2160 375 2234

          C335 2316 241 2323 147 2357

          C70 2384 59 2453 88 2521

          C117 2594 207 2605 285 2635

          C349 2660 362 2714 341 2792
        "
        fill="none"
        stroke="#e75b00"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function MobileRegionLabels() {
  useEffect(() => {
    const layer =
      document.querySelector<HTMLElement>(
        '[data-region-label-layer]'
      );

    if (!layer) return;

    const main =
      layer.closest<HTMLElement>('main');

    if (!main) return;

    let animationFrame:
      number | null = null;

    const normalizeText = (
      value: string | null | undefined
    ) =>
      (value ?? '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase('fr');

    const findByText = (
      search: string
    ): HTMLElement | null => {
      const wanted =
        normalizeText(search);

      const elements =
        Array.from(
          main.querySelectorAll<HTMLElement>(
            'h1, h2, h3, h4, p, strong, span, a, button'
          )
        );

      return (
        elements.find(element =>
          normalizeText(
            element.textContent
          ).includes(wanted)
        ) ?? null
      );
    };

    const findCardByText = (
      search: string
    ): HTMLElement | null => {
      const start =
        findByText(search);

      if (!start) return null;

      let current:
        HTMLElement | null = start;

      while (
        current &&
        current !== main
      ) {
        const className =
          typeof current.className ===
          'string'
            ? current.className
            : '';

        const rect =
          current.getBoundingClientRect();

        const looksLikeCard =
          className.includes('rounded') &&
          (
            className.includes('bg-white') ||
            className.includes('bg-muted')
          ) &&
          rect.width > 180 &&
          rect.height > 55;

        if (looksLikeCard) {
          return current;
        }

        current =
          current.parentElement;
      }

      return start;
    };

    const getLabel = (
      key: string
    ) =>
      layer.querySelector<HTMLElement>(
        `[data-region-label="${key}"]`
      );

    const containerRect =
      () =>
        layer.getBoundingClientRect();

    const positionAt = (
      key: string,
      top: number
    ) => {
      const label =
        getLabel(key);

      if (!label) return;

      const maxTop =
        Math.max(
          0,
          layer.offsetHeight -
            label.offsetHeight -
            4
        );

      const safeTop =
        Math.max(
          0,
          Math.min(
            top,
            maxTop
          )
        );

      label.style.top =
        `${safeTop}px`;
    };

    const positionBetween = (
      key: string,
      first: HTMLElement | null,
      second: HTMLElement | null,
      fallback: number
    ) => {
      const label =
        getLabel(key);

      if (!label) return;

      if (!first || !second) {
        positionAt(
          key,
          fallback
        );
        return;
      }

      const rootRect =
        containerRect();

      const firstRect =
        first.getBoundingClientRect();

      const secondRect =
        second.getBoundingClientRect();

      const gapStart =
        firstRect.bottom -
        rootRect.top;

      const gapEnd =
        secondRect.top -
        rootRect.top;

      const middle =
        (
          gapStart +
          gapEnd
        ) / 2;

      positionAt(
        key,
        middle -
          label.offsetHeight / 2
      );
    };

    const intersects = (
      first: DOMRect,
      second: DOMRect,
      padding = 6
    ) =>
      !(
        first.right <
          second.left - padding ||
        first.left >
          second.right + padding ||
        first.bottom <
          second.top - padding ||
        first.top >
          second.bottom + padding
      );

    const getObstacles = () =>
      Array.from(
        main.querySelectorAll<HTMLElement>(
          '[class*="rounded"]'
        )
      ).filter(element => {
        const className =
          typeof element.className ===
          'string'
            ? element.className
            : '';

        const rect =
          element.getBoundingClientRect();

        return (
          (
            className.includes(
              'bg-white'
            ) ||
            className.includes(
              'bg-muted'
            )
          ) &&
          rect.width > 200 &&
          rect.height > 65
        );
      });

    const makeLabelClear = (
      label: HTMLElement,
      obstacles: HTMLElement[]
    ) => {
      const originalTop =
        Number.parseFloat(
          label.style.top || '0'
        );

      const rootRect =
        containerRect();

      const offsets = [
        0,
        -10,
        10,
        -20,
        20,
        -30,
        30,
        -40,
        40,
        -55,
        55,
        -70,
        70,
        -90,
        90,
        -120,
        120,
      ];

      for (
        const offset
        of offsets
      ) {
        const candidateTop =
          Math.max(
            0,
            originalTop + offset
          );

        label.style.top =
          `${candidateTop}px`;

        const labelRect =
          label.getBoundingClientRect();

        const collision =
          obstacles.some(
            obstacle =>
              intersects(
                labelRect,
                obstacle.getBoundingClientRect()
              )
          );

        if (!collision) {
          return;
        }
      }

      label.style.top =
        `${originalTop}px`;
    };

    const layoutRegions = () => {
      const header =
        main.querySelector<HTMLElement>(
          'header'
        );

      const heroTitle =
        findByText(
          'Trouvez un pro moto'
        );

      const searchCard =
        findCardByText(
          'Rechercher'
        );

      const discoveryTitle =
        findByText(
          'Découvrez une nouvelle façon'
        );

      const universe =
        findCardByText(
          'univers moto au même endroit'
        );

      const entretien =
        findCardByText(
          'Entretien moto'
        );

      const trouverPro =
        findCardByText(
          'Trouver le bon pro'
        );

      const technicalSheets =
        findCardByText(
          'fiches techniques moto par modèle'
        );

      const guides =
        findCardByText(
          'Guides & conseils'
        );

      const espacePro =
        findCardByText(
          'Espace pro'
        );

      const reassuranceText =
        findByText(
          'Réseau de confiance'
        );

      const reassurance =
        reassuranceText
          ?.closest<HTMLElement>(
            'section'
          ) ?? null;

      // ==========================================
      // HAUTS-DE-FRANCE
      // Entre le header et le titre principal
      // ==========================================

      positionBetween(
        'hauts',
        header,
        heroTitle,
        108
      );

      // ==========================================
      // ILE-DE-FRANCE
      // Entre la recherche et le titre découverte
      // ==========================================

      positionBetween(
        'ile',
        searchCard,
        discoveryTitle,
        550
      );

      // ==========================================
      // AUTRES LIBELLES
      // Placés entre les vrais encarts
      // ==========================================

      positionBetween(
        'centre',
        universe,
        entretien,
        950
      );

      positionBetween(
        'nouvelle',
        entretien,
        trouverPro,
        1240
      );

      positionBetween(
        'auvergne',
        trouverPro,
        technicalSheets,
        1550
      );

      positionBetween(
        'occitanie',
        technicalSheets,
        guides,
        1940
      );

      // BOUCHES-DU-RHONE :
      // exactement entre Guides et Espace Pro
      positionBetween(
        'bouches',
        guides,
        espacePro,
        2310
      );

      // PACA après Espace Pro
      positionBetween(
        'provence',
        espacePro,
        reassurance,
        2580
      );

      // ==========================================
      // ANTI-COLLISION
      // ==========================================

      const obstacles =
        getObstacles();

      const labels =
        Array.from(
          layer.querySelectorAll<HTMLElement>(
            '[data-region-label]'
          )
        );

      labels.forEach(label => {
        makeLabelClear(
          label,
          obstacles
        );
      });
    };

    const requestLayout = () => {
      if (
        animationFrame !== null
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }

      animationFrame =
        window.requestAnimationFrame(
          layoutRegions
        );
    };

    requestLayout();

    window.addEventListener(
      'resize',
      requestLayout
    );

    const resizeObserver =
      new ResizeObserver(
        requestLayout
      );

    resizeObserver.observe(main);

    return () => {
      window.removeEventListener(
        'resize',
        requestLayout
      );

      resizeObserver.disconnect();

      if (
        animationFrame !== null
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }
    };
  }, []);

  const labelClass = `
    absolute
    z-[2]
    whitespace-nowrap
    text-[9px]
    font-bold
    uppercase
    tracking-[0.14em]
    text-black/[0.07]
  `;

  return (
    <div
      data-region-label-layer
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[2]
        hidden
        overflow-hidden
        max-md:block
      "
    >
      <span
        data-region-label="hauts"
        className={`
          ${labelClass}
          right-[34px]
        `}
      >
        HAUTS-DE-FRANCE
      </span>

      <span
        data-region-label="ile"
        className={`
          ${labelClass}
          left-1/2
          -translate-x-1/2
        `}
      >
        ÎLE-DE-FRANCE
      </span>

      <span
        data-region-label="centre"
        className={`
          ${labelClass}
          right-[16px]
        `}
      >
        CENTRE-VAL DE LOIRE
      </span>

      <span
        data-region-label="nouvelle"
        className={`
          ${labelClass}
          left-[14px]
        `}
      >
        NOUVELLE-AQUITAINE
      </span>

      <span
        data-region-label="auvergne"
        className={`
          ${labelClass}
          right-[12px]
        `}
      >
        AUVERGNE-RHÔNE-ALPES
      </span>

      <span
        data-region-label="occitanie"
        className={`
          ${labelClass}
          left-[18px]
        `}
      >
        OCCITANIE
      </span>

      <span
        data-region-label="bouches"
        className={`
          ${labelClass}
          left-1/2
          -translate-x-1/2
        `}
      >
        BOUCHES-DU-RHÔNE
      </span>

      <span
        data-region-label="provence"
        className={`
          ${labelClass}
          right-[10px]
        `}
      >
        PROVENCE-ALPES-CÔTE D’AZUR
      </span>
    </div>
  );
}
function RoadPin({
  side,
}: {
  side: 'left' | 'right';
}) {
  return (
    <span
      aria-hidden="true"
      className={`
        absolute
        -top-5
        z-20
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-white
        shadow-[0_5px_18px_rgba(0,0,0,0.16)]
        ${
          side === 'left'
            ? '-left-4'
            : '-right-4'
        }
      `}
    >
      <MapPin
        className="
          h-7
          w-7
          fill-brand
          text-brand
        "
      />
    </span>
  );
}

function Stage({
  side,
  pinSide,
  children,
  wide = false,
  height = 'normal',
  desktopHidden = false,
}: {
  side: Side;
  pinSide: 'left' | 'right';
  children: ReactNode;
  wide?: boolean;
  height?:
    | 'compact'
    | 'normal'
    | 'large';
  desktopHidden?: boolean;
}) {
  const align =
    side === 'left'
      ? 'mr-auto ml-5'
      : side === 'right'
        ? 'ml-auto mr-5'
        : 'mx-auto';

  const width =
    wide
      ? 'w-[calc(100%-26px)]'
      : 'w-[76%] max-w-[310px]';

  const size =
    height === 'large'
      ? 'min-h-[390px]'
      : height === 'compact'
        ? 'min-h-[290px]'
        : 'min-h-[340px]';

  return (
    <section
      className={`
        relative
        z-10
        flex
        ${size}
        ${desktopHidden ? 'lg:hidden' : ''}
        w-full
        items-center
        px-1
      `}
    >
      <div
        className={`
          ${align}
          ${width}
          relative
        `}
      >
        <RoadPin
          side={pinSide}
        />

        {children}
      </div>
    </section>
  );
}

function Card({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="
        group
        overflow-hidden
        rounded-[1.65rem]
        border
        border-black/[0.035]
        bg-white/[0.97]
        shadow-[0_18px_48px_rgba(0,0,0,0.085)]
        backdrop-blur-sm
      "
    >
      <summary
        className="
          flex
          min-h-[58px]
          cursor-pointer
          list-none
          items-center
          justify-between
          gap-3
          px-5
          py-4
        "
      >
        <span
          className="
            text-[15px]
            font-black
            leading-tight
            tracking-[-0.025em]
          "
        >
          {title}
        </span>

        <ChevronDown
          className="
            h-4
            w-4
            shrink-0
            text-brand
            transition-transform
            duration-300
            group-open:rotate-180
          "
        />
      </summary>

      <div
        className="
          border-t
          border-border/55
          px-5
          pb-5
          pt-4
        "
      >
        {children}
      </div>
    </details>
  );
}

function HeroSearch() {
  const router =
    useRouter();

  const [
    what,
    setWhat,
  ] = useState('');

  const [
    where,
    setWhere,
  ] = useState('');

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState('');

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    locating,
    setLocating,
  ] = useState(false);

  async function geocode(
    value: string
  ) {
    const response =
      await fetch(
        `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(value)}&limit=1&autocomplete=0`
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    const feature =
      data?.features?.[0];

    if (
      !feature?.geometry
        ?.coordinates
    ) {
      return null;
    }

    const [
      lng,
      lat,
    ] =
      feature.geometry.coordinates;

    return {
      lat,
      lng,
    };
  }

  async function submitSearch(
    event?: FormEvent
  ) {
    event?.preventDefault();

    setSearching(true);

    try {
      const params =
        new URLSearchParams();

      const filter =
        selectedFilter ||
        inferFilter(what);

      if (filter) {
        params.set(
          'filter',
          filter
        );
      }

      // ===============================================
      // CHAMP "QUE RECHERCHEZ-VOUS ?"
      //
      // La catégorie passe dans ?filter=.
      // On conserve cependant une éventuelle marque.
      // ===============================================

      let whatForSearch =
        what.trim();

      if (filter && whatForSearch) {
        whatForSearch =
          whatForSearch
            .replace(
              /\b(concessions?|concessionnaires?|garages?|ateliers?|associations?|relais|services?)\b/gi,
              ' '
            )
            .replace(
              /\s+/g,
              ' '
            )
            .trim();

        const normalizedResidual =
          normalizeSearch(
            whatForSearch
          );

        if (
          normalizedResidual === 'moto' ||
          normalizedResidual === 'motos' ||
          normalizedResidual === 'motard' ||
          normalizedResidual === 'motards'
        ) {
          whatForSearch = '';
        }
      }

      // ===============================================
      // CHAMP "OU ?"
      // ===============================================

      const rawWhere =
        where.trim();

      const normalizedWhere =
        normalizeSearch(
          rawWhere
        );

      // ===============================================
      // ARRONDISSEMENTS
      //
      // Paris 13
      // Paris 13e
      // Paris 13eme
      // 13e arrondissement Paris
      //
      // Lyon 3
      // Marseille 8
      // ===============================================

      const cityFirstArrondissement =
        normalizedWhere.match(
          /^(paris|lyon|marseille)\s+(\d{1,2})\s*(?:er|e|eme)?(?:\s+arrondissement)?$/
        );

      const numberFirstArrondissement =
        normalizedWhere.match(
          /^(\d{1,2})\s*(?:er|e|eme)?(?:\s+arrondissement)?\s+(?:de\s+)?(paris|lyon|marseille)$/
        );

      let arrondissementCity:
        string | null = null;

      let arrondissementNumber:
        number | null = null;

      if (cityFirstArrondissement) {
        arrondissementCity =
          cityFirstArrondissement[1];

        arrondissementNumber =
          Number(
            cityFirstArrondissement[2]
          );
      }
      else if (numberFirstArrondissement) {
        arrondissementCity =
          numberFirstArrondissement[2];

        arrondissementNumber =
          Number(
            numberFirstArrondissement[1]
          );
      }

      const arrondissementConfig:
        Record<
          string,
          {
            max: number;
            prefix: string;
          }
        > = {
          paris: {
            max: 20,
            prefix: '75',
          },
          lyon: {
            max: 9,
            prefix: '69',
          },
          marseille: {
            max: 16,
            prefix: '13',
          },
        };

      let arrondissementPostalCode:
        string | null = null;

      if (
        arrondissementCity &&
        arrondissementNumber
      ) {
        const config =
          arrondissementConfig[
            arrondissementCity
          ];

        if (
          config &&
          arrondissementNumber >= 1 &&
          arrondissementNumber <= config.max
        ) {
          arrondissementPostalCode =
            `${
              config.prefix
            }${
              String(
                arrondissementNumber
              ).padStart(3, '0')
            }`;
        }
      }

      const isArrondissement =
        Boolean(
          arrondissementPostalCode
        );

      // ===============================================
      // FRANCE = RECHERCHE NATIONALE
      // ===============================================

      const isNationalSearch =
        normalizedWhere === 'france' ||
        normalizedWhere === 'toute la france' ||
        normalizedWhere === 'partout en france';

      const whereForSearch =
        isNationalSearch
          ? ''
          : rawWhere;

      // ===============================================
      // REQUETE CUMULEE
      //
      // Honda + Paris 13
      // => search=Honda Paris 13
      //
      // Garage + Paris 13
      // => filter=service&search=Paris 13
      // ===============================================

      const combinedSearch = [
        whatForSearch,
        whereForSearch,
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      if (combinedSearch) {
        params.set(
          'search',
          combinedSearch
        );
      }

      // ===============================================
      // DEPARTEMENT SEUL
      //
      // 13 = Bouches-du-Rhône
      // 95 = Val-d'Oise
      // 971 = Guadeloupe
      //
      // Mais Paris 13 n'est PAS un département.
      // ===============================================

      const departmentPattern =
        /^(0[1-9]|[1-8]\d|9[0-5]|2A|2B|97[1-46])$/i;

      const isDepartment =
        !isArrondissement &&
        departmentPattern.test(
          whereForSearch
        );

      // ===============================================
      // GEOCODAGE
      //
      // Pour un arrondissement on envoie le CP exact :
      //
      // Paris 13     -> 75013
      // Lyon 3       -> 69003
      // Marseille 8  -> 13008
      // ===============================================

      if (
        whereForSearch &&
        !isDepartment
      ) {
        const geocodeQuery =
          arrondissementPostalCode ||
          whereForSearch;

        const position =
          await geocode(
            geocodeQuery
          );

        if (position) {
          params.set(
            'lat',
            String(position.lat)
          );

          params.set(
            'lng',
            String(position.lng)
          );

          params.set(
            'zoom',
            isArrondissement
              ? '13'
              : '12'
          );
        }
      }

      router.push(
        `/map${
          params.toString()
            ? `?${params.toString()}`
            : ''
        }`
      );
    }
    finally {
      setSearching(false);
    }
  }
  function usePosition() {
    if (!navigator.geolocation) {
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocating(false);

        const params =
          new URLSearchParams({
            lat:
              String(
                position.coords.latitude
              ),
            lng:
              String(
                position.coords.longitude
              ),
            zoom:
              '13',
          });

        const filter =
          selectedFilter ||
          inferFilter(what);

        if (filter) {
          params.set(
            'filter',
            filter
          );
        }
        else if (what.trim()) {
          params.set(
            'search',
            what.trim()
          );
        }

        router.push(
          `/map?${params.toString()}`
        );
      },
      () => {
        setLocating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      }
    );
  }

  return (
    <div>
      <form
        onSubmit={submitSearch}
        className="
          rounded-[1.65rem]
          border
          border-black/[0.035]
          bg-white/[0.97]
          p-3
          shadow-[0_18px_48px_rgba(0,0,0,0.09)]
        "
      >
        <label
          className="
            flex
            min-h-[55px]
            items-center
            gap-3
            rounded-[1rem]
            border
            border-border/75
            bg-white
            px-4
          "
        >
          <Search
            className="
              h-[18px]
              w-[18px]
              shrink-0
              text-brand
            "
          />

          <input
            value={what}
            onChange={event => {
              setWhat(
                event.target.value
              );

              setSelectedFilter('');
            }}
            placeholder="Que recherchez-vous ?"
            className="
              min-w-0
              flex-1
              bg-transparent
              text-[14px]
              font-medium
              outline-none
              placeholder:font-normal
              placeholder:text-muted-foreground
              md:text-[13px]
              md:font-bold
            "
          />
        </label>

        <label
          className="
            mt-2
            flex
            min-h-[55px]
            items-center
            gap-3
            rounded-[1rem]
            border
            border-border/75
            bg-white
            px-4
          "
        >
          <MapPin
            className="
              h-[18px]
              w-[18px]
              shrink-0
              text-brand
            "
          />

          <input
            value={where}
            onChange={event =>
              setWhere(
                event.target.value
              )
            }
            placeholder="Où ? Ville ou code postal"
            className="
              min-w-0
              flex-1
              bg-transparent
              text-[14px]
              font-medium
              outline-none
              placeholder:font-normal
              placeholder:text-muted-foreground
              md:text-[13px]
              md:font-bold
            "
          />

          <button
            type="button"
            onClick={usePosition}
            aria-label="Utiliser ma position"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-brand
            "
          >
            <Crosshair
              className={`
                h-4
                w-4
                ${
                  locating
                    ? 'animate-pulse'
                    : ''
                }
              `}
            />
          </button>
        </label>

        <button
          type="submit"
          disabled={searching}
          className="
            mt-2
            min-h-[50px]
            w-full
            rounded-[0.95rem]
            bg-brand
            text-[15px]
            font-semibold
            text-white
            shadow-lg
            md:text-[13px]
            md:font-black
          "
        >
          {searching
            ? 'Recherche...'
            : 'Rechercher'}
        </button>
      </form>

      <div
        className="
          mt-[118px]
          px-1
          md:mt-9
          lg:hidden
        "
      >
        <p
          className="
            max-w-[365px]
            text-[23px]
            font-bold
            leading-[1.18]
            tracking-[-0.025em]
            text-[#71360f]
            md:text-[22px]
            md:font-black
            md:leading-[1.22]
          "
        >
          Découvrez une nouvelle façon
          <br />
          de rechercher avec LABEL MOTO
        </p>
      </div>

      <div
        className="
          mt-10
          grid
          grid-cols-4
          gap-2
          md:mt-5
          lg:hidden
        "
      >
        {QUICK_CHOICES.map(
          choice => {
            const Icon =
              choice.icon;

            return (
              <button
                key={choice.label}
                type="button"
                onClick={() => {
                  setWhat(
                    choice.value
                  );

                  setSelectedFilter(
                    choice.filter || ''
                  );
                }}
                className="
                  flex
                  min-h-[60px]
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-[1rem]
                  border
                  border-black/[0.025]
                  bg-white/[0.97]
                  shadow-[0_7px_20px_rgba(0,0,0,0.07)]
                "
              >
                <Icon
                  className="
                    h-4
                    w-4
                    text-brand
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-semibold
                    leading-tight
                    md:text-[8px]
                    md:font-black
                  "
                >
                  {choice.label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

function TechnicalSheets() {
  return (
    <Card
      title="Découvrez les fiches techniques moto par modèle"
    >
      <div
        className="
          flex
          snap-x
          snap-mandatory
          gap-2
          overflow-x-auto
          pb-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {TECH_SHEETS.map(
          sheet => (
            <Link
              key={sheet.href}
              href={sheet.href}
              className="
                w-[145px]
                shrink-0
                snap-start
                overflow-hidden
                rounded-[1rem]
                border
                border-border/60
                bg-white
              "
            >
              <div
                className="
                  relative
                  flex
                  h-[100px]
                  items-center
                  justify-center
                  overflow-hidden
                  bg-gradient-to-b
                  from-muted/45
                  to-white
                "
              >
                {sheet.image ? (
                  <img
                    src={sheet.image}
                    alt={`${sheet.brand} ${sheet.model}`}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-contain
                      p-1
                    "
                  />
                ) : (
                  <Bike
                    className="
                      h-12
                      w-12
                      text-foreground/70
                    "
                  />
                )}
              </div>

              <div
                className="
                  p-3
                "
              >
                <span
                  className="
                    block
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-brand
                  "
                >
                  {sheet.brand}
                </span>

                <div
                  className="
                    mt-1
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  <strong
                    className="
                      min-w-0
                      text-[10px]
                      font-semibold
                      leading-tight
                    "
                  >
                    {sheet.model}
                  </strong>

                  <ArrowRight
                    className="
                      h-3
                      w-3
                      shrink-0
                      text-brand
                    "
                  />
                </div>
              </div>
            </Link>
          )
        )}
      </div>

      <Link
        href="/entretien#fiches-par-modele"
        className="
          mt-3
          flex
          items-center
          justify-end
          gap-1
          text-[8px]
          font-bold
          uppercase
          text-brand
        "
      >
        Voir toutes les fiches

        <ArrowRight
          className="
            h-3
            w-3
          "
        />
      </Link>
    </Card>
  );
}

function SmallEditorialCard({
  pinSide,
  icon: Icon,
  title,
  text,
  cta,
  href,
}: {
  pinSide: 'left' | 'right';
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  text: string;
  cta: string;
  href: string;
}) {
  return (
    <div
      className="
        relative
        rounded-[1.45rem]
        border
        border-black/[0.035]
        bg-white/[0.97]
        p-4
        shadow-[0_16px_42px_rgba(0,0,0,0.08)]
      "
    >
      <RoadPin
        side={pinSide}
      />

      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-brand/10
          "
        >
          <Icon
            className="
              h-5
              w-5
              text-brand
            "
          />
        </div>

        <div
          className="
            min-w-0
          "
        >
          <h3
            className="
              text-[13px]
              font-black
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-2
              text-[9px]
              font-semibold
              leading-relaxed
              text-muted-foreground
            "
          >
            {text}
          </p>

          <Link
            href={href}
            className="
              mt-3
              inline-flex
              items-center
              gap-1
              text-[8px]
              font-black
              uppercase
              text-brand
            "
          >
            {cta}

            <ArrowRight
              className="
                h-3
                w-3
              "
            />
          </Link>
        </div>
      </div>
    </div>
  );
}


function BottomBarScrollController() {
  useEffect(() => {
    const mobileMedia =
      window.matchMedia(
        '(max-width: 767px)'
      );

    const searchZone =
      document.querySelector<HTMLElement>(
        '[data-home-search-zone="true"]'
      );

    if (!searchZone) {
      return;
    }

    let bottomBar:
      | HTMLElement
      | null = null;

    let animationFrame:
      | number
      | null = null;

    let mutationObserver:
      | MutationObserver
      | null = null;

    function normalizeText(
      value: string | null
    ) {
      return (
        value || ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();
    }

    function findBottomBar() {
      const links =
        Array.from(
          document.querySelectorAll<
            HTMLAnchorElement
          >('a')
        );

      const accueilLink =
        links.find(link => {
          const text =
            normalizeText(
              link.textContent
            );

          return (
            text === 'ACCUEIL' ||
            text.endsWith(' ACCUEIL')
          );
        });

      if (!accueilLink) {
        return null;
      }

      let element:
        | HTMLElement
        | null =
          accueilLink;

      while (
        element &&
        element !== document.body
      ) {
        const text =
          normalizeText(
            element.textContent
          );

        const containsMenu =
          text.includes('ACCUEIL') &&
          text.includes('CARTE') &&
          text.includes('ENTRETIEN') &&
          text.includes('CONSEILS');

        if (containsMenu) {
          const styles =
            window.getComputedStyle(
              element
            );

          const rect =
            element.getBoundingClientRect();

          const fixedAtBottom =
            (
              styles.position ===
                'fixed' ||
              styles.position ===
                'sticky'
            ) &&
            rect.bottom >=
              window.innerHeight - 24;

          if (fixedAtBottom) {
            return element;
          }
        }

        element =
          element.parentElement;
      }

      return null;
    }

    function prepareBar(
      bar: HTMLElement
    ) {
      bar.style.transition =
        [
          'opacity 240ms ease',
          'transform 280ms ease',
        ].join(', ');

      bar.style.willChange =
        'opacity, transform';
    }

    function hideBar() {
      if (!bottomBar) {
        return;
      }

      bottomBar.style.opacity =
        '0';

      bottomBar.style.transform =
        'translateY(110%)';

      bottomBar.style.pointerEvents =
        'none';

      bottomBar.setAttribute(
        'aria-hidden',
        'true'
      );
    }

    function showBar() {
      if (!bottomBar) {
        return;
      }

      bottomBar.style.opacity =
        '1';

      bottomBar.style.transform =
        'translateY(0)';

      bottomBar.style.pointerEvents =
        'auto';

      bottomBar.removeAttribute(
        'aria-hidden'
      );
    }

    function restoreBar() {
      if (!bottomBar) {
        return;
      }

      bottomBar.style.opacity =
        '';

      bottomBar.style.transform =
        '';

      bottomBar.style.pointerEvents =
        '';

      bottomBar.style.transition =
        '';

      bottomBar.style.willChange =
        '';

      bottomBar.removeAttribute(
        'aria-hidden'
      );
    }

    function updateVisibility() {
      if (!bottomBar) {
        bottomBar =
          findBottomBar();

        if (bottomBar) {
          prepareBar(
            bottomBar
          );
        }
      }

      if (!bottomBar) {
        return;
      }

      if (!mobileMedia.matches) {
        restoreBar();
        return;
      }

      const searchRect =
        searchZone.getBoundingClientRect();

      /*
       * La barre apparaît seulement lorsque
       * l'intégralité de la zone Recherche
       * est passée au-dessus de l'écran.
       */
      const searchHasLeftScreen =
        searchRect.bottom <= 0;

      if (searchHasLeftScreen) {
        showBar();
      }
      else {
        hideBar();
      }
    }

    function requestUpdate() {
      if (
        animationFrame !== null
      ) {
        return;
      }

      animationFrame =
        window.requestAnimationFrame(
          () => {
            animationFrame =
              null;

            updateVisibility();
          }
        );
    }

    /*
     * Recherche immédiatement la barre.
     */
    bottomBar =
      findBottomBar();

    if (bottomBar) {
      prepareBar(
        bottomBar
      );

      updateVisibility();
    }
    else {
      /*
       * Si la navigation est montée
       * légèrement après la homepage,
       * on attend son apparition.
       */
      mutationObserver =
        new MutationObserver(
          () => {
            if (bottomBar) {
              return;
            }

            bottomBar =
              findBottomBar();

            if (bottomBar) {
              prepareBar(
                bottomBar
              );

              updateVisibility();

              mutationObserver
                ?.disconnect();
            }
          }
        );

      mutationObserver.observe(
        document.body,
        {
          childList: true,
          subtree: true,
        }
      );
    }

    window.addEventListener(
      'scroll',
      requestUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      'resize',
      requestUpdate
    );

    mobileMedia.addEventListener(
      'change',
      requestUpdate
    );

    /*
     * Contrôle initial après hydratation.
     */
    requestUpdate();

    return () => {
      window.removeEventListener(
        'scroll',
        requestUpdate
      );

      window.removeEventListener(
        'resize',
        requestUpdate
      );

      mobileMedia.removeEventListener(
        'change',
        requestUpdate
      );

      mutationObserver
        ?.disconnect();

      if (
        animationFrame !== null
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }

      restoreBar();
    };
  }, []);

  return null;
}

function DesktopMaintenanceSheetsSection() {
  const scrollSheets = (
    direction: 'left' | 'right'
  ) => {
    const container =
      document.getElementById(
        'desktop-tech-sheets-scroll'
      );

    container?.scrollBy({
      left:
        direction === 'right'
          ? 520
          : -520,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-white
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-20
          xl:px-12
          xl:py-24
          2xl:px-16
        "
      >
        <div
          className="
            mb-9
            flex
            items-end
            justify-between
            gap-8
          "
        >
          <div>
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-brand
              "
            >
              Entretien & modèles
            </span>

            <h2
              className="
                mt-2
                text-[36px]
                font-bold
                leading-[1.05]
                tracking-[-0.035em]
                xl:text-[42px]
              "
            >
              Entretenir et mieux connaître
              votre moto
            </h2>
          </div>

          <Link
            href="/entretien#fiches-par-modele"
            className="
              flex
              items-center
              gap-1.5
              text-[12px]
              font-semibold
              text-brand
              hover:underline
            "
          >
            Voir toutes les fiches

            <ArrowRight
              className="
                h-4
                w-4
              "
            />
          </Link>
        </div>

        <div
          className="
            grid
            grid-cols-[minmax(330px,0.78fr)_minmax(0,1.6fr)]
            gap-7
            xl:grid-cols-[minmax(380px,0.8fr)_minmax(0,1.65fr)]
          "
        >
          {/* ===============================================
              ENTRETIEN
          ================================================ */}

          <Link
            href="/entretien"
            className="
              group
              relative
              min-h-[440px]
              overflow-hidden
              rounded-[1.8rem]
              bg-black
            "
          >
            <img
              src="/images/motard-entretien-page.webp"
              alt="Entretien moto"
              loading="lazy"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.025]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/80
                via-black/20
                to-black/[0.02]
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                p-7
                text-white
                xl:p-8
              "
            >
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-white/75
                "
              >
                Votre moto au quotidien
              </span>

              <h3
                className="
                  mt-2
                  text-[31px]
                  font-bold
                  tracking-[-0.035em]
                "
              >
                Entretien moto
              </h3>

              <p
                className="
                  mt-3
                  max-w-[360px]
                  text-[13px]
                  leading-[1.5]
                  text-white/80
                "
              >
                Révisions, maintenance et coûts
                d’entretien par modèle.
              </p>

              <span
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-5
                  py-3
                  text-[12px]
                  font-semibold
                  text-black
                "
              >
                Voir l’entretien

                <ArrowRight
                  className="
                    h-4
                    w-4
                  "
                />
              </span>
            </div>
          </Link>

          {/* ===============================================
              FICHES MOTO
          ================================================ */}

          <div
            className="
              min-w-0
              rounded-[1.8rem]
              bg-[#f4f5f6]
              p-6
              xl:p-7
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-6
              "
            >
              <div>
                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-brand
                  "
                >
                  Par modèle
                </span>

                <h3
                  className="
                    mt-2
                    text-[27px]
                    font-bold
                    tracking-[-0.03em]
                  "
                >
                  Fiches techniques moto
                </h3>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    scrollSheets('left')
                  }
                  aria-label="Fiches précédentes"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/[0.07]
                    bg-white
                    text-lg
                    transition-colors
                    hover:border-brand/30
                  "
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollSheets('right')
                  }
                  aria-label="Fiches suivantes"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/[0.07]
                    bg-white
                    text-lg
                    transition-colors
                    hover:border-brand/30
                  "
                >
                  →
                </button>
              </div>
            </div>

            <div
              id="desktop-tech-sheets-scroll"
              className="
                mt-7
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                pb-2
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {TECH_SHEETS.map(sheet => (
                <Link
                  key={sheet.href}
                  href={sheet.href}
                  className="
                    group
                    w-[225px]
                    shrink-0
                    snap-start
                  "
                >
                  <div
                    className="
                      flex
                      h-[255px]
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-[1.35rem]
                      bg-white
                    "
                  >
                    {sheet.image ? (
                      <img
                        src={sheet.image}
                        alt={`${sheet.brand} ${sheet.model}`}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-contain
                          p-3
                          transition-transform
                          duration-300
                          group-hover:scale-[1.025]
                        "
                      />
                    ) : (
                      <Bike
                        className="
                          h-16
                          w-16
                          text-foreground/25
                        "
                      />
                    )}
                  </div>

                  <div
                    className="
                      pt-4
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-brand
                      "
                    >
                      {sheet.brand}
                    </span>

                    <div
                      className="
                        mt-1
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <strong
                        className="
                          text-[17px]
                          font-bold
                          leading-tight
                          tracking-[-0.02em]
                        "
                      >
                        {sheet.model}
                      </strong>

                      <ArrowRight
                        className="
                          mt-1
                          h-4
                          w-4
                          shrink-0
                          text-brand
                          transition-transform
                          group-hover:translate-x-1
                        "
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopGuidesSection() {
  const articles = [
    {
      image: '/images/achat-occasion.webp',
      category: 'Permis & A2',
      title: 'Quelle moto choisir pour débuter en A2 ?',
      href: '/info/meilleure-moto-a2-quelle-moto-choisir-pour-debuter',
    },
    {
      image: '/images/evitelespieges.webp',
      category: 'Achat',
      title: 'Acheter une moto d’occasion sans tomber dans les pièges',
      href: '/info/achat-moto-occasion-guide-complet-pour-eviter-les-pieges',
    },
    {
      image: '/images/casque-meilleur-casque-2026.webp',
      category: 'Équipement',
      title: 'Les meilleurs casques moto en 2026',
      href: '/info/meilleurs-casques-moto-2026',
    },
    {
      image: '/images/article-scooter-125.webp',
      category: 'Scooter 125',
      title: 'Quel scooter 125 choisir en 2026 ?',
      href: '/info/meilleur-scooter-125-2026-comparatif-complet',
    },
    {
      image: '/images/article-moto-125cc.webp',
      category: 'Moto 125',
      title: 'Les meilleures motos 125 cc en 2026',
      href: '/info/meilleures-motos-125cc-2026-guide-complet',
    },
  ];

  const scrollGuides = (
    direction: 'left' | 'right'
  ) => {
    const container =
      document.getElementById(
        'desktop-guides-scroll'
      );

    container?.scrollBy({
      left:
        direction === 'right'
          ? 650
          : -650,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-[#fbfcfd]
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-20
          xl:px-12
          xl:py-24
          2xl:px-16
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-8
          "
        >
          <div>
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-brand
              "
            >
              Le magazine LabelMoto
            </span>

            <h2
              className="
                mt-2
                text-[38px]
                font-bold
                tracking-[-0.04em]
                xl:text-[44px]
              "
            >
              Guides & conseils
            </h2>

            <p
              className="
                mt-3
                max-w-[640px]
                text-[15px]
                text-muted-foreground
              "
            >
              Conseils, comparatifs et dossiers
              pour mieux choisir et profiter de votre moto.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <Link
              href="/info"
              className="
                mr-3
                text-[12px]
                font-semibold
                text-brand
                hover:underline
              "
            >
              Voir tous les guides
            </Link>

            <button
              type="button"
              onClick={() =>
                scrollGuides('left')
              }
              aria-label="Articles précédents"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.07]
                bg-white
                text-lg
              "
            >
              ←
            </button>

            <button
              type="button"
              onClick={() =>
                scrollGuides('right')
              }
              aria-label="Articles suivants"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.07]
                bg-white
                text-lg
              "
            >
              →
            </button>
          </div>
        </div>

        <div
          id="desktop-guides-scroll"
          className="
            mt-9
            flex
            snap-x
            snap-mandatory
            gap-5
            overflow-x-auto
            pb-3
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {articles.map(article => (
            <Link
              key={article.href}
              href={article.href}
              className="
                group
                w-[300px]
                shrink-0
                snap-start
                xl:w-[315px]
              "
            >
              <div
                className="
                  h-[205px]
                  overflow-hidden
                  rounded-[1.35rem]
                  bg-[#f1f2f3]
                "
              >
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-[1.025]
                  "
                />
              </div>

              <div
                className="
                  pt-4
                "
              >
                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-brand
                  "
                >
                  {article.category}
                </span>

                <h3
                  className="
                    mt-2
                    text-[17px]
                    font-bold
                    leading-[1.25]
                    tracking-[-0.02em]
                  "
                >
                  {article.title}
                </h3>

                <span
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-1.5
                    text-[12px]
                    font-semibold
                    text-foreground
                  "
                >
                  Lire l’article

                  <ArrowRight
                    className="
                      h-4
                      w-4
                      text-brand
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesktopProSection() {
  return (
    <section
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-white
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-24
          xl:px-12
          xl:py-28
          2xl:px-16
        "
      >
        <div
          className="
            grid
            grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)]
            items-center
            gap-14
            xl:gap-20
          "
        >
          {/* =================================================
              GAUCHE : TEXTE
          ================================================== */}

          <div
            className="
              max-w-[580px]
            "
          >
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.17em]
                text-brand
              "
            >
              LabelMoto pour les pros
            </span>

            <h2
              className="
                mt-4
                max-w-[570px]
                text-[43px]
                font-bold
                leading-[1.04]
                tracking-[-0.04em]
                text-foreground
                xl:text-[50px]
              "
            >
              Développez votre visibilité
              auprès des motards
            </h2>

            <p
              className="
                mt-6
                max-w-[540px]
                text-[16px]
                font-normal
                leading-[1.6]
                text-muted-foreground
                xl:text-[17px]
              "
            >
              Créez ou prenez le contrôle de votre fiche
              professionnelle et mettez votre activité en avant
              auprès des motards partout en France.
            </p>

            {/* PETITES PREUVES */}

            <div
              className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-x-8
                gap-y-3
                text-[12px]
                font-semibold
                text-foreground/75
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-brand
                  "
                />

                Visibilité nationale
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-brand
                  "
                />

                Recherche locale
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-brand
                  "
                />

                Tous les métiers moto
              </span>
            </div>

            {/* CTA */}

            <div
              className="
                mt-9
                flex
                items-center
                gap-7
              "
            >
              <Link
                href="/login?callbackUrl=/pro/register"
                className="
                  inline-flex
                  min-h-[54px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[0.9rem]
                  bg-brand
                  px-7
                  text-[14px]
                  font-semibold
                  text-white
                  shadow-[0_10px_28px_rgba(0,0,0,0.08)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:opacity-90
                "
              >
                Créer ma fiche pro

                <ArrowRight
                  className="
                    h-4
                    w-4
                  "
                />
              </Link>

              <Link
                href="/pro/revendiquer"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  border-b
                  border-foreground/35
                  pb-1
                  text-[14px]
                  font-semibold
                  text-foreground
                  transition-colors
                  hover:border-brand
                  hover:text-brand
                "
              >
                Modifier ma fiche

                <ArrowRight
                  className="
                    h-4
                    w-4
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </div>
          </div>

          {/* =================================================
              DROITE : APERCU INTERFACE PRO
          ================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[1.7rem]
              bg-[#f2f3f4]
              shadow-[0_18px_55px_rgba(0,0,0,0.08)]
            "
          >
            <div
              className="
                relative
                aspect-[1.38/1]
                w-full
                overflow-hidden
              "
            >
              <img
                src="/images/apercufiche.webp"
                alt="Aperçu de l'interface professionnelle LabelMoto"
                loading="lazy"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-500
                  hover:scale-[1.015]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function DesktopUniverseSection() {
  const manufacturers = [
    'Honda',
    'Yamaha',
    'BMW',
    'Kawasaki',
    'CFMOTO',
    'VOGE',
    'QJ Motor',
    'KOVE',
  ];

  const equipmentBrands = [
    'Maxxess',
    'Cardy',
    'Speedway',
  ];

  return (
    <section
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-[#fbfcfd]
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-20
          xl:px-12
          xl:py-24
          2xl:px-16
        "
      >
        {/* =================================================
            PARTIE HAUTE
        ================================================== */}

        <div
          className="
            grid
            grid-cols-[minmax(0,0.9fr)_minmax(500px,1.1fr)]
            items-stretch
            gap-12
            xl:gap-16
          "
        >
          {/* =================================================
              GAUCHE : UNIVERS
          ================================================== */}

          <div
            className="
              flex
              flex-col
              justify-center
              py-4
            "
          >
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.17em]
                text-brand
              "
            >
              Le réseau LabelMoto
            </span>

            <h2
              className="
                mt-4
                max-w-[600px]
                text-[44px]
                font-bold
                leading-[1.02]
                tracking-[-0.04em]
                text-foreground
                xl:text-[50px]
              "
            >
              Tout l’univers moto
              <br />
              au même endroit
            </h2>

            <p
              className="
                mt-5
                max-w-[570px]
                text-[16px]
                font-normal
                leading-[1.5]
                text-muted-foreground
                xl:text-[17px]
              "
            >
              Concessions, garages, artisans et spécialistes
              partout en France.
            </p>

            {/* ===============================================
                PREUVES
            ================================================ */}

            <div
              className="
                mt-9
                grid
                max-w-[620px]
                grid-cols-3
                gap-3
              "
            >
              <div
                className="
                  rounded-[1.15rem]
                  bg-white
                  p-4
                  shadow-[0_7px_24px_rgba(0,0,0,0.045)]
                "
              >
                <Users
                  className="
                    h-5
                    w-5
                    text-brand
                  "
                />

                <strong
                  className="
                    mt-4
                    block
                    text-[20px]
                    font-bold
                    leading-none
                  "
                >
                  5 900+
                </strong>

                <span
                  className="
                    mt-2
                    block
                    text-[11px]
                    leading-snug
                    text-muted-foreground
                  "
                >
                  professionnels référencés
                </span>
              </div>

              <div
                className="
                  rounded-[1.15rem]
                  bg-white
                  p-4
                  shadow-[0_7px_24px_rgba(0,0,0,0.045)]
                "
              >
                <Map
                  className="
                    h-5
                    w-5
                    text-brand
                  "
                />

                <strong
                  className="
                    mt-4
                    block
                    text-[20px]
                    font-bold
                    leading-none
                  "
                >
                  France
                </strong>

                <span
                  className="
                    mt-2
                    block
                    text-[11px]
                    leading-snug
                    text-muted-foreground
                  "
                >
                  couverture nationale
                </span>
              </div>

              <div
                className="
                  rounded-[1.15rem]
                  bg-white
                  p-4
                  shadow-[0_7px_24px_rgba(0,0,0,0.045)]
                "
              >
                <Wrench
                  className="
                    h-5
                    w-5
                    text-brand
                  "
                />

                <strong
                  className="
                    mt-4
                    block
                    text-[20px]
                    font-bold
                    leading-none
                  "
                >
                  Tous
                </strong>

                <span
                  className="
                    mt-2
                    block
                    text-[11px]
                    leading-snug
                    text-muted-foreground
                  "
                >
                  les métiers du deux-roues
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              DROITE : TROUVER LE BON PRO
          ================================================== */}

          <div
            className="
              rounded-[2rem]
              bg-[#f2f3f4]
              p-7
              xl:p-8
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-6
              "
            >
              <div>
                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-brand
                  "
                >
                  Recherche rapide
                </span>

                <h3
                  className="
                    mt-2
                    text-[34px]
                    font-bold
                    leading-[1.05]
                    tracking-[-0.035em]
                    xl:text-[38px]
                  "
                >
                  Trouver le bon pro
                </h3>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                "
              >
                <MapPin
                  className="
                    h-5
                    w-5
                    text-brand
                  "
                />
              </div>
            </div>

            <div
              className="
                mt-7
                grid
                grid-cols-2
                gap-3
              "
            >
              {PRO_CHOICES.map(choice => {
                const Icon = choice.icon;

                return (
                  <Link
                    key={choice.label}
                    href={choice.href}
                    className="
                      group
                      flex
                      min-h-[62px]
                      items-center
                      gap-3
                      rounded-[1rem]
                      bg-white
                      px-4
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:shadow-[0_7px_20px_rgba(0,0,0,0.06)]
                    "
                  >
                    <Icon
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-brand
                      "
                    />

                    <span
                      className="
                        min-w-0
                        flex-1
                        text-[12px]
                        font-semibold
                        leading-tight
                      "
                    >
                      {choice.label}
                    </span>

                    <ArrowRight
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                        text-brand
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </Link>
                );
              })}
            </div>

            <Link
              href="/map"
              className="
                mt-6
                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-[1rem]
                bg-brand
                px-5
                text-[13px]
                font-semibold
                text-white
                transition-opacity
                hover:opacity-90
              "
            >
              Explorer tous les professionnels

              <ArrowRight
                className="
                  h-4
                  w-4
                "
              />
            </Link>
          </div>
        </div>

        {/* =================================================
            MARQUES - PLEINE LARGEUR
        ================================================== */}

        <div
          className="
            mt-16
            border-t
            border-black/[0.06]
            pt-10
          "
        >
          <div
            className="
              flex
              items-end
              justify-between
              gap-8
            "
          >
            <div>
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-brand
                "
              >
                Le réseau
              </span>

              <h3
                className="
                  mt-2
                  text-[28px]
                  font-bold
                  tracking-[-0.03em]
                  xl:text-[32px]
                "
              >
                Quelques marques présentes
              </h3>
            </div>

            <Link
              href="/map"
              className="
                flex
                items-center
                gap-1.5
                text-[12px]
                font-semibold
                text-brand
                hover:underline
              "
            >
              Voir toutes

              <ArrowRight
                className="
                  h-3.5
                  w-3.5
                "
              />
            </Link>
          </div>

          {/* ===============================================
              CONSTRUCTEURS
          ================================================ */}

          <div
            className="
              mt-8
            "
          >
            <h4
              className="
                text-[13px]
                font-bold
                text-foreground
              "
            >
              Constructeurs
            </h4>

            <div
              className="
                mt-4
                grid
                grid-cols-4
                gap-3
              "
            >
              {manufacturers.map(brand => (
                <Link
                  key={brand}
                  href={`/map?search=${encodeURIComponent(brand)}`}
                  className="
                    flex
                    h-[66px]
                    items-center
                    justify-center
                    rounded-[1rem]
                    border
                    border-black/[0.055]
                    bg-white
                    px-4
                    text-center
                    shadow-[0_4px_16px_rgba(0,0,0,0.025)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-brand/30
                    hover:shadow-[0_8px_22px_rgba(0,0,0,0.055)]
                  "
                >
                  <span
                    className="
                      text-[14px]
                      font-bold
                      tracking-[-0.015em]
                    "
                  >
                    {brand}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ===============================================
              EQUIPEMENTIERS / ENSEIGNES
          ================================================ */}

          <div
            className="
              mt-8
            "
          >
            <h4
              className="
                text-[13px]
                font-bold
                text-foreground
              "
            >
              Équipementiers & enseignes
            </h4>

            <div
              className="
                mt-4
                grid
                max-w-[820px]
                grid-cols-3
                gap-3
              "
            >
              {equipmentBrands.map(brand => (
                <Link
                  key={brand}
                  href={`/map?search=${encodeURIComponent(brand)}`}
                  className="
                    flex
                    h-[66px]
                    items-center
                    justify-center
                    rounded-[1rem]
                    border
                    border-black/[0.055]
                    bg-white
                    px-4
                    text-center
                    shadow-[0_4px_16px_rgba(0,0,0,0.025)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-brand/30
                    hover:shadow-[0_8px_22px_rgba(0,0,0,0.055)]
                  "
                >
                  <span
                    className="
                      text-[14px]
                      font-bold
                      tracking-[-0.015em]
                    "
                  >
                    {brand}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function DesktopDiscoverySection() {
  const descriptions: Record<string, string> = {
    Concessions:
      'Retrouvez les concessions moto et les marques près de chez vous.',
    Garages:
      'Trouvez rapidement un atelier ou un mécanicien pour votre moto.',
    Associations:
      'Découvrez les clubs et associations de motards autour de vous.',
    'Relais motards':
      'Repérez les étapes et adresses pensées pour accueillir les motards.',
  };

  return (
    <section
      data-desktop-discovery="true"
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-white
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-16
          xl:px-12
          xl:py-20
          2xl:px-16
        "
      >
        <h2
          className="
            max-w-[920px]
            text-[50px]
            font-bold
            leading-[1]
            tracking-[-0.04em]
            text-foreground
            xl:text-[58px]
          "
        >
          Découvrez une nouvelle façon
          <br />
          de rechercher avec LABEL MOTO
        </h2>

        <div
          className="
            mt-10
            grid
            grid-cols-4
            gap-4
            xl:gap-5
          "
        >
          {QUICK_CHOICES.map(choice => {
            const Icon = choice.icon;

            const href = choice.filter
              ? `/map?filter=${encodeURIComponent(choice.filter)}`
              : `/map?search=${encodeURIComponent(choice.value)}`;

            return (
              <Link
                key={choice.label}
                href={href}
                className="
                  group
                  relative
                  min-h-[205px]
                  overflow-hidden
                  rounded-[1.4rem]
                  bg-[#f3f3f3]
                  p-6
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)]
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                  "
                >
                  <Icon
                    className="
                      h-5
                      w-5
                      text-brand
                    "
                  />
                </div>

                <h3
                  className="
                    mt-7
                    text-[20px]
                    font-bold
                    tracking-[-0.02em]
                    text-foreground
                  "
                >
                  {choice.label}
                </h3>

                <p
                  className="
                    mt-2
                    max-w-[260px]
                    text-[13px]
                    font-normal
                    leading-[1.45]
                    text-muted-foreground
                  "
                >
                  {descriptions[choice.label]}
                </p>

                <span
                  className="
                    absolute
                    bottom-5
                    right-5
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-brand
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  <ArrowRight
                    className="
                      h-4
                      w-4
                    "
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function DesktopFranceVisual() {
  return (
    <div
      className="
        relative
        h-[430px]
        w-full
        overflow-hidden
        rounded-[2rem]
        bg-[#f1f3f4]
        xl:h-[470px]
      "
    >
      <div
        className="
          absolute
          left-8
          top-7
          z-10
        "
      >
        <span
          className="
            text-[11px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-muted-foreground
          "
        >
          Le réseau LabelMoto
        </span>

        <p
          className="
            mt-1
            text-[15px]
            font-semibold
            text-foreground
          "
        >
          Des professionnels partout en France
        </p>
      </div>

      <svg
        viewBox="0 0 620 560"
        role="img"
        aria-label="Illustration de la France et du réseau LabelMoto"
        className="
          absolute
          inset-0
          h-full
          w-full
        "
      >
        {/* Ombre douce */}
        <path
          d="
            M306 73
            L394 92
            L463 154
            L454 236
            L496 315
            L463 403
            L375 470
            L292 500
            L211 462
            L151 399
            L126 313
            L148 224
            L195 145
            L258 96
            Z
          "
          fill="rgba(0,0,0,0.05)"
          transform="translate(8 10)"
        />

        {/* France stylisee */}
        <path
          d="
            M306 63
            L394 82
            L463 144
            L454 226
            L496 305
            L463 393
            L375 460
            L292 490
            L211 452
            L151 389
            L126 303
            L148 214
            L195 135
            L258 86
            Z
          "
          fill="white"
          stroke="rgba(17,24,39,0.10)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Corse */}
        <path
          d="
            M457 449
            C469 457 474 474 469 493
            C466 505 459 514 453 520
            C449 505 447 491 449 476
            C450 463 453 455 457 449
            Z
          "
          fill="white"
          stroke="rgba(17,24,39,0.10)"
          strokeWidth="2"
        />

        {/* Route LabelMoto */}
        <path
          d="
            M323 103
            C278 145 350 176 310 215
            C270 252 341 284 304 321
            C268 357 325 385 289 438
          "
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          className="text-brand"
        />

        {/* Route secondaire */}
        <path
          d="
            M310 215
            C357 232 397 257 428 294
          "
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-brand/45"
        />

        {/* Marqueurs */}
        {[
          [323, 103],
          [310, 215],
          [428, 294],
          [304, 321],
          [289, 438],
        ].map(([cx, cy]) => (
          <g
            key={`${cx}-${cy}`}
          >
            <circle
              cx={cx}
              cy={cy}
              r="13"
              fill="white"
              stroke="rgba(17,24,39,0.08)"
              strokeWidth="2"
            />

            <circle
              cx={cx}
              cy={cy}
              r="7"
              fill="currentColor"
              className="text-brand"
            />
          </g>
        ))}
      </svg>

      {/* Régions discrètes */}
      <span
        className="
          absolute
          right-[18%]
          top-[27%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Hauts-de-France
      </span>

      <span
        className="
          absolute
          right-[24%]
          top-[39%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Île-de-France
      </span>

      <span
        className="
          absolute
          left-[17%]
          top-[61%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Nouvelle-Aquitaine
      </span>

      <span
        className="
          absolute
          right-[12%]
          top-[66%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Auvergne-Rhône-Alpes
      </span>

      <span
        className="
          absolute
          bottom-[13%]
          left-[34%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Occitanie
      </span>

      <div
        className="
          absolute
          bottom-7
          right-7
          flex
          items-center
          gap-3
          rounded-full
          bg-white
          px-5
          py-3
          shadow-[0_12px_35px_rgba(0,0,0,0.09)]
        "
      >
        <MapPin
          className="
            h-4
            w-4
            text-brand
          "
        />

        <span
          className="
            text-[12px]
            font-semibold
          "
        >
          Toute la France couverte
        </span>
      </div>
    </div>
  );
}
export default function HomepageRoad() {
  return (
    <>
      <BottomBarScrollController />

      <main
      className="
        relative
        isolate
        overflow-hidden
        bg-[#fbfcfd]
        pb-0
      "
    >
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[430px]
          overflow-hidden
          bg-[#fbfcfd]
          lg:overflow-visible
        "
      >
        <RouteBackdrop />
        <MobileRegionLabels />

        {/* ==================================================
            HERO
        =================================================== */}

        <section
          className="
            relative
            z-10
            min-h-[620px]
            lg:hidden
            px-5
            pb-10
            pt-5
          "
        >
          <div
            className="
              absolute
              right-[45px]
              top-[62px]
              z-10
            "
          >
            <RoadPin
              side="right"
            />
          </div>

          <header
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div
              className="
                w-[150px]
              "
            >
              <LabelMotoLogo
                noBubble
              />
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Link
                href="/account"
                className="
                  flex
                  min-h-[39px]
                  items-center
                  gap-1.5
                  rounded-full
                  bg-white
                  px-3
                  text-[11px]
                  font-semibold
                  shadow-md
                  md:text-[8px]
                  md:font-black
                "
              >
                <UserRound
                  className="
                    h-3.5
                    w-3.5
                  "
                />

                Connexion
              </Link>

              <Link
                href="/account"
                aria-label="Menu"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-[0.95rem]
                  bg-white
                  shadow-md
                "
              >
                <Menu
                  className="
                    h-4
                    w-4
                  "
                />
              </Link>
            </div>
          </header>

          <div
            className="
              mx-auto
              mt-14
              w-full
              max-w-[370px]
            "
          >
            <h1
              className="
                max-w-[350px]
                text-[33px]
                font-bold
                leading-[1.04]
                tracking-[-0.035em]
                md:text-[34px]
                md:font-black
                md:leading-[0.97]
                md:tracking-[-0.045em]
              "
            >
              Trouvez un pro moto
              près de vous
            </h1>

            <p
              className="
                mt-4
                max-w-[330px]
                text-[14px]
                font-normal
                leading-[1.45]
                text-muted-foreground
                md:text-[12px]
                md:font-semibold
                md:leading-relaxed
              "
            >
              Le réseau de référence
              pour entretenir, équiper
              et vivre votre passion moto.
            </p>

            <div
              data-home-search-zone="true"
              className="
                mt-7
              "
            >
              <HeroSearch />
            </div>
          </div>
        </section>


        {/* ==================================================
            HERO DESKTOP
        =================================================== */}

        <section
          data-desktop-home-hero="true"
          className="
            relative
            left-1/2
            z-20
            hidden
            w-screen
            min-h-[100svh]
            -translate-x-1/2
            bg-[#fbfcfd]
            lg:block
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1500px]
              px-8
              xl:px-12
              2xl:px-16
            "
          >
            {/* HEADER DESKTOP */}
            <header
              className="
                flex
                h-[76px]
                items-center
                justify-between
                border-b
                border-black/[0.045]
              "
            >
              <div
                className="
                  w-[175px]
                  shrink-0
                "
              >
                <LabelMotoLogo
                  noBubble
                />
              </div>

              <nav
                aria-label="Navigation principale"
                className="
                  ml-10
                  hidden
                  items-center
                  gap-8
                  xl:flex
                "
              >
                <Link
                  href="/map"
                  className="
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:text-brand
                  "
                >
                  Carte
                </Link>

                <Link
                  href="/entretien"
                  className="
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:text-brand
                  "
                >
                  Entretien
                </Link>

                <Link
                  href="/info"
                  className="
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:text-brand
                  "
                >
                  Guides & conseils
                </Link>

                <Link
                  href="/entretien#fiches-par-modele"
                  className="
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:text-brand
                  "
                >
                  Fiches moto
                </Link>
              </nav>

              <div
                className="
                  ml-auto
                  flex
                  items-center
                  gap-3
                "
              >
                <Link
                  href="/account"
                  className="
                    flex
                    h-11
                    items-center
                    gap-2
                    rounded-full
                    px-5
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:bg-black/[0.04]
                  "
                >
                  <UserRound
                    className="
                      h-4
                      w-4
                    "
                  />

                  Connexion
                </Link>

                <Link
                  href="/account"
                  aria-label="Menu"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-[0_5px_20px_rgba(0,0,0,0.08)]
                    transition-transform
                    hover:scale-[1.03]
                  "
                >
                  <Menu
                    className="
                      h-5
                      w-5
                    "
                  />
                </Link>
              </div>
            </header>

            {/* HERO 2 COLONNES */}
            <div
              className="
                grid
                min-h-[calc(100svh-76px)]
                grid-cols-[minmax(0,0.92fr)_minmax(480px,1.08fr)]
                items-center
                gap-10
                py-6
                xl:gap-14
                xl:py-7
              "
            >
              {/* GAUCHE */}
              <div
                className="
                  max-w-[510px]
                "
              >
                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-brand/10
                    px-3.5
                    py-1.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-brand
                  "
                >
                  Le réseau moto près de vous
                </span>

                <h1
                  className="
                    mt-5
                    max-w-[510px]
                    text-[44px]
                    font-bold
                    leading-[1]
                    tracking-[-0.04em]
                    text-foreground
                    xl:text-[50px]
                  "
                >
                  Trouvez un pro moto
                  <br />
                  près de vous
                </h1>

                <p
                  className="
                    mt-4
                    max-w-[480px]
                    text-[15px]
                    font-normal
                    leading-[1.5]
                    text-muted-foreground
                    xl:text-[16px]
                  "
                >
                  Le réseau de référence pour entretenir,
                  équiper et vivre votre passion moto.
                </p>

                <div
                  data-home-search-zone="true"
                  className="
                    mt-6
                    w-full
                    max-w-[480px]
                  "
                >
                  <HeroSearch />
                </div>
              </div>

              {/* DROITE */}
              <DesktopFranceVisual />
            </div>
          </div>
        </section>
        {/* ==================================================
            DECOUVERTE DESKTOP
        =================================================== */}

        <DesktopDiscoverySection />

        {/* ==================================================
            UNIVERS DESKTOP
        =================================================== */}

        <DesktopUniverseSection />

        {/* ==================================================
            ENTRETIEN + FICHES DESKTOP
        =================================================== */}

        <DesktopMaintenanceSheetsSection />

        {/* ==================================================
            GUIDES DESKTOP
        =================================================== */}

        <DesktopGuidesSection />

        {/* ==================================================
            ESPACE PRO DESKTOP
        =================================================== */}

        <DesktopProSection />

        {/* ==================================================
            VERSION MOBILE / TABLETTE DES BLOCS SUIVANTS
        =================================================== */}

        <div className="lg:hidden">
        {/* ==================================================
            UNIVERS
        =================================================== */}

        <Stage
          side="left"
          pinSide="left"
          height="normal"
          desktopHidden
        >
          <Card
            title="Tout l’univers moto au même endroit"
          >
            <div
              className="
                space-y-3
                text-[11px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Users
                  className="
                    h-4
                    w-4
                    text-brand
                  "
                />

                <span>
                  <strong>
                    5 900+
                  </strong>{' '}
                  professionnels référencés
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Map
                  className="
                    h-4
                    w-4
                    text-brand
                  "
                />

                <span>
                  Toute la France couverte
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Settings
                  className="
                    h-4
                    w-4
                    text-brand
                  "
                />

                <span>
                  De nombreux métiers
                  du deux-roues
                </span>
              </div>
            </div>

            <div
              className="
                mt-5
                grid
                grid-cols-3
                border-t
                pt-4
              "
            >
              {[
                {
                  icon: Clock3,
                  text: 'Gain de temps',
                },
                {
                  icon: ShieldCheck,
                  text: 'Données vérifiées',
                },
                {
                  icon: MapPin,
                  text: 'Recherche locale',
                },
              ].map(item => {
                const Icon =
                  item.icon;

                return (
                  <div
                    key={item.text}
                    className="
                      text-center
                    "
                  >
                    <Icon
                      className="
                        mx-auto
                        h-4
                        w-4
                        text-brand
                      "
                    />

                    <span
                      className="
                        mt-1
                        block
                        text-[7px]
                        font-black
                        leading-tight
                      "
                    >
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </Stage>

        {/* ==================================================
            ENTRETIEN
        =================================================== */}

        <Stage
          side="right"
          pinSide="right"
          height="compact"
        >
          <Card
            title="Entretien moto"
          >
            <p
              className="
                text-[10px]
                font-semibold
                text-muted-foreground
              "
            >
              Révisions, maintenance
              et coûts par modèle.
            </p>

            <div
              className="
                mt-4
                space-y-2
              "
            >
              <Link
                href="/entretien"
                className="
                  flex
                  min-h-[42px]
                  items-center
                  justify-between
                  rounded-xl
                  bg-muted/55
                  px-3
                  text-[9px]
                  font-black
                "
              >
                Yamaha MT-07

                <ArrowRight
                  className="
                    h-3
                    w-3
                    text-brand
                  "
                />
              </Link>

              <Link
                href="/entretien"
                className="
                  flex
                  min-h-[42px]
                  items-center
                  justify-between
                  rounded-xl
                  bg-muted/55
                  px-3
                  text-[9px]
                  font-black
                "
              >
                Honda XL750 Transalp

                <ArrowRight
                  className="
                    h-3
                    w-3
                    text-brand
                  "
                />
              </Link>
            </div>

            <Link
              href="/entretien"
              className="
                mt-4
                inline-flex
                items-center
                gap-1
                text-[8px]
                font-black
                uppercase
                text-brand
              "
            >
              Voir l’entretien

              <ArrowRight
                className="
                  h-3
                  w-3
                "
              />
            </Link>
          </Card>
        </Stage>

        {/* ==================================================
            TROUVER PRO
        =================================================== */}

        <Stage
          side="left"
          pinSide="left"
          height="normal"
          desktopHidden
        >
          <Card
            title="Trouver le bon pro"
          >
            <div
              className="
                space-y-1
              "
            >
              {PRO_CHOICES.map(
                choice => {
                  const Icon =
                    choice.icon;

                  return (
                    <Link
                      key={choice.label}
                      href={choice.href}
                      className="
                        flex
                        min-h-[34px]
                        items-center
                        gap-2
                        rounded-lg
                        px-1
                        text-[8px]
                        font-black
                        hover:bg-brand/5
                      "
                    >
                      <Icon
                        className="
                          h-3.5
                          w-3.5
                          shrink-0
                          text-brand
                        "
                      />

                      <span
                        className="
                          flex-1
                        "
                      >
                        {choice.label}
                      </span>

                      <ArrowRight
                        className="
                          h-3
                          w-3
                          text-brand
                        "
                      />
                    </Link>
                  );
                }
              )}
            </div>
          </Card>
        </Stage>

        {/* ==================================================
            GRAND BLOC FICHES
        =================================================== */}

        <Stage
          side="center"
          pinSide="left"
          wide
          height="large"
        >
          <TechnicalSheets />
        </Stage>

        {/* ==================================================
            EDITORIAL
        =================================================== */}

        <section
          className="
            relative
            z-10
            flex
            min-h-[320px]
            items-center
            px-4
          "
        >
          <div
            className="
              grid
              w-full
              grid-cols-2
              gap-3
            "
          >
            <SmallEditorialCard
              pinSide="left"
              icon={BookOpen}
              title="Guides & conseils"
              text="Nos guides pour entretenir, choisir et profiter de votre moto."
              cta="Voir les guides"
              href="/info"
            />

          </div>
        </section>

        {/* ==================================================
            ESPACE PRO
        =================================================== */}

        <Stage
          side="center"
          pinSide="left"
          wide
          height="compact"
        >
          <div
            className="
              rounded-[1.6rem]
              border
              border-black/[0.035]
              bg-white/[0.97]
              p-5
              shadow-[0_18px_48px_rgba(0,0,0,0.085)]
            "
          >
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-brand/10
                "
              >
                <Users
                  className="
                    h-6
                    w-6
                    text-brand
                  "
                />
              </div>

              <div
                className="
                  min-w-0
                "
              >
                <h2
                  className="
                    text-[15px]
                    font-black
                  "
                >
                  Espace pro,
                  rejoignez le réseau
                </h2>

                <p
                  className="
                    mt-2
                    text-[9px]
                    font-semibold
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  Développez votre visibilité
                  et connectez-vous à des
                  milliers de motards partout
                  en France.
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                grid
                grid-cols-2
                gap-2
              "
            >
              <Link
                href="/login?callbackUrl=/pro/register"
                className="
                  flex
                  min-h-[44px]
                  items-center
                  justify-center
                  rounded-xl
                  bg-brand
                  px-2
                  text-center
                  text-[9px]
                  font-black
                  text-white
                "
              >
                Créer ma fiche pro
              </Link>

              <Link
                href="/pro/revendiquer"
                className="
                  flex
                  min-h-[44px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-brand
                  px-2
                  text-center
                  text-[9px]
                  font-black
                  text-brand
                "
              >
                Modifier ma fiche
              </Link>
            </div>
          </div>
        </Stage>

        </div>

        {/* ==================================================
            BANDE DE REASSURANCE
        =================================================== */}

        <section
          className="
            relative
            z-10
            border-t
            border-border/60
            bg-white/95
            px-4
            pt-5
            pb-0
            md:py-7
          "
        >
          <div
            className="
              grid
              grid-cols-4
              gap-2
            "
          >
            {[
              {
                icon: ShieldCheck,
                title: 'Réseau de confiance',
                text: 'Des pros vérifiés',
              },
              {
                icon: MapPin,
                title: 'Partout en France',
                text: 'Recherche locale',
              },
              {
                icon: Clock3,
                title: 'Gain de temps',
                text: 'Trouvez vite',
              },
              {
                icon: Heart,
                title: 'Passion moto',
                text: 'Par les motards',
              },
            ].map(item => {
              const Icon =
                item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    text-center
                  "
                >
                  <Icon
                    className="
                      mx-auto
                      h-5
                      w-5
                      text-brand
                    "
                  />

                  <strong
                    className="
                      mt-2
                      block
                      text-[6.5px]
                      leading-tight
                    "
                  >
                    {item.title}
                  </strong>

                  <span
                    className="
                      mt-1
                      block
                      text-[6px]
                      leading-tight
                      text-muted-foreground
                    "
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      </main>
    </>
  );
}
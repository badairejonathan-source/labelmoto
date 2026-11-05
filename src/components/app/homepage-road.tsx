'use client';

import BrandLogo from '@/components/app/brand-logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
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
import UserMenu from '@/components/app/user-menu';
import { LabelMotoRoadHeaderEntry, labelMotoHeaderExit, labelMotoFooterEntry, LABELMOTO_ROAD_GAP, useLabelMotoRoadSize } from '@/components/app/labelmoto-road-finishes';
import {
  resolveMapProfessionSearch,
} from '@/app/lib/map-search-intent';

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
    filter: 'concessionnaires-revendeurs',
    icon: Store,
  },
  {
    label: 'Garages',
    value: 'Garage moto',
    filter: 'ateliers-mecaniciens',
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

const HOME_BRAND_SLUGS:
  Record<string, string> = {
  "aprilia": "aprilia",
  "benelli": "benelli",
  "beta": "beta",
  "bmw": "bmw",
  "bmwmotorrad": "bmw",
  "cardy": "cardy",
  "cfmoto": "cf-moto",
  "dafy": "dafy",
  "dafymoto": "dafy",
  "docbiker": "docbiker",
  "ducati": "ducati",
  "fantic": "fantic",
  "harleydavidson": "harley-davidson",
  "honda": "honda",
  "husqvarna": "husqvarna",
  "husqvarnamotorcycles": "husqvarna",
  "indian": "indian",
  "indianmotorcycle": "indian",
  "kawasaki": "kawasaki",
  "kove": "kove",
  "ktm": "ktm",
  "kymco": "kymco",
  "mash": "mash",
  "motoaxxe": "moto-axxe",
  "motoguzzi": "moto-guzzi",
  "peugeotmotocycles": "peugeot-motocycles",
  "piaggio": "piaggio",
  "qjmotor": "qj-motor",
  "rieju": "rieju",
  "royalenfield": "royal-enfield",
  "sherco": "sherco",
  "speedway": "speedway",
  "suzuki": "suzuki",
  "teamaxe": "teamaxe",
  "triumph": "triumph",
  "vespa": "vespa",
  "voge": "voge",
  "yamaha": "yamaha",
  "zontes": "zontes",
  };


const HOME_FEATURED_MANUFACTURERS = [
  'Honda',
  'Yamaha',
  'BMW',
  'Kawasaki',
  'CFMOTO',
  'VOGE',
  'QJ Motor',
  'Kove',
];

const HOME_MANUFACTURERS = [
  ...HOME_FEATURED_MANUFACTURERS,
  'Suzuki',
  'Harley-Davidson',
  'Triumph',
  'Kymco',
  'Ducati',
  'Royal Enfield',
  'Piaggio',
  'KTM',
  'Aprilia',
  'Vespa',
  'Peugeot Motocycles',
  'Moto Guzzi',
  'Indian Motorcycle',
  'Zontes',
  'Mash',
  'Husqvarna Motorcycles',
  'Benelli',
  'Rieju',
  'Sherco',
  'Fantic',
  'Beta',
];

const HOME_FEATURED_EQUIPMENT_BRANDS = [
  'Maxxess',
  'Cardy',
  'Speedway',
];

const HOME_EQUIPMENT_BRANDS = [
  ...HOME_FEATURED_EQUIPMENT_BRANDS,
  'Dafy Moto',
  "Doc'Biker",
  'TEAMAXE',
  'Moto Axxe',
];

function homeBrandHref(
  brand: string
): string {
  const key =
    brand
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toLowerCase()
      .replace(
        /&/g,
        'et'
      )
      .replace(
        /[^a-z0-9]/g,
        ''
      );

  const slug =
    HOME_BRAND_SLUGS[key];

  return slug
    ? `/marque/${slug}`
    : `/map?search=${encodeURIComponent(brand)}`;
}

const PRO_CHOICES: ProChoice[] = [
  {
    label: 'Garages & ateliers',
    href: '/metiers/ateliers-mecaniciens',
    icon: Wrench,
  },
  {
    label: 'Concessions',
    href: '/metiers/concessionnaires-revendeurs',
    icon: Store,
  },
  {
    label: 'Transporteurs moto',
    href: '/metiers/transport-moto',
    icon: Truck,
  },
  {
    label: 'Préparateurs',
    href: '/metiers/preparateurs-moto',
    icon: Settings,
  },
  {
    label: 'Peintre - carrossier',
    href: '/metiers/peintres-carrossiers',
    icon: Paintbrush,
  },
  {
    label: 'Photographes',
    href: '/metiers/photographes-videastes',
    icon: Camera,
  },
  {
    label: 'Équipementiers',
    href: '/metiers/equipement-accessoires',
    icon: ShoppingBag,
  },
  {
    label: 'Associations',
    href: '/associations',
    icon: Users,
  },
];

const TECH_SHEETS = [
  {
    brand: 'CFMOTO',
    model: '450MT',
    href: "/fiches/cfmoto-450mt-2024-plus",
    image: "/images/motorcycles/cfmoto-450MT.webp",
  },
  {
    brand: 'Honda',
    model: 'XL750 Transalp',
    href: "/fiches/honda-xl750-transalp-2023-plus",
    image: "/images/motorcycles/Honda-XL750-Transalp.webp",
  },
  {
    brand: 'Yamaha',
    model: 'MT-07',
    href: "/fiches/yamaha-mt-07-2021-plus",
    image: "/images/motorcycles/Yamaha-MT07.webp",
  },
  {
    brand: 'VOGE',
    model: 'DS900X',
    href: "/fiches/voge-ds900x-2025-plus",
    image: "/images/motorcycles/voge-DS900X(4).webp",
  },
  {
    brand: 'QJ Motor',
    model: 'SRK 800 RR',
    href: "/fiches/qjmotor-srk800rr-2024-plus",
    image: "/images/motorcycles/QJmotor-srk800rr.webp",
  },
  {
    brand: 'CFMOTO',
    model: '800MT',
    href: "/fiches/cfmoto-800mt-sport-explore-2023-plus",
    image: "/images/motorcycles/cfmoto-800MT-explore.webp",
  },
  {
    brand: 'KOVE',
    model: '800X Pro',
    href: "/fiches/kove-800x-pro-2024-plus",
    image: "/images/motorcycles/kove-800x-pro-v2.webp",
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

// Fil graphique LABEL MOTO : courbe de Bezier douce issue de points de passage.
function refinedRoad(points: ReadonlyArray<readonly [number, number]>): string {
  const round = (n: number) => String(Math.round(n * 10) / 10);
  let d = 'M ' + round(points[0][0]) + ' ' + round(points[0][1]);
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i - 1] ?? points[i];
    const b = points[i];
    const c = points[i + 1];
    const z = points[i + 2] ?? c;
    d += ' C ' + [
      b[0] + (c[0] - a[0]) / 6,
      b[1] + (c[1] - a[1]) / 6,
      c[0] - (z[0] - b[0]) / 6,
      c[1] - (z[1] - b[1]) / 6,
      c[0], c[1],
    ].map(round).join(' ');
  }
  return d;
}

// La ligne cyan suit la normale locale du chemin et garde un ecart constant.
function companionRoad(points: ReadonlyArray<readonly [number, number]>, gap: number): Array<[number, number]> {
  return points.map(([x, y], index) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const length = Math.hypot(dx, dy) || 1;
    return [x - gap * dy / length, y + gap * dx / length];
  });
}

const HOME_POINTS: Array<[number, number]> = [
  [65, 110], [184, 140], [335, 175], [397, 282],
  [396, 424], [345, 491], [136, 522], [45, 562],
  [24, 670], [98, 751], [303, 798], [387, 885],
  [401, 1010], [344, 1100], [126, 1138], [38, 1222],
  [30, 1327], [119, 1414], [335, 1465], [402, 1547],
  [394, 1660], [284, 1772], [78, 1858], [30, 1940],
  [103, 2028], [331, 2099], [395, 2217], [373, 2340],
  [277, 2429], [365, 2615], [400, 2730], [400, 2800],
];
// Entree commune aux trois pages, dimensions en pixels CSS mobiles.
const LABELMOTO_MOBILE_ENTRY: Array<[number, number]> = [
  [44, 80], [145, 80], [275, 86], [365, 140], [405, 255], [408, 500],
];

// Calage du depart sans etirer le header quand le contenu s'allonge.
// La suite reste progressive jusqu'au bas du SVG.
function alignedMobileRoad(
  original: ReadonlyArray<readonly [number, number]>,
  originalJoinY: number,
  viewBoxHeight: number,
  renderedHeight: number,
  tailStart: number,
): Array<[number, number]> {
  if (!Number.isFinite(renderedHeight) || renderedHeight <= 650) return original.map(([x,y]) => [x,y]);
  const svgScale = viewBoxHeight / renderedHeight;
  const joinY = 500 * svgScale;
  // Respecter l'ordre vertical meme pour une page anormalement courte.
  if (joinY >= viewBoxHeight * 0.85) return original.map(([x,y]) => [x,y]);
  const endY = original[original.length - 1][1];
  const first = LABELMOTO_MOBILE_ENTRY.map(([x,y]) => [x, y * svgScale] as [number,number]);
  const rest = original.slice(tailStart).map(([x,y]) => {
    const ratio = Math.max(0, Math.min(1, (y-originalJoinY)/(endY-originalJoinY)));
    return [x, joinY + ratio*(viewBoxHeight - joinY)] as [number,number];
  });
  return [...first,...rest];
}

const HOME_ROAD = refinedRoad(HOME_POINTS);
const HOME_ROAD_CYAN = refinedRoad(companionRoad(HOME_POINTS, 7));

function RouteBackdrop() {
  const mobileRef = useRef<SVGSVGElement>(null);
  const mobileSize = useLabelMotoRoadSize(mobileRef);
  const points = alignedMobileRoad(HOME_POINTS, 491, 2800, mobileSize?.height ?? 0, 6);
  const orange = mobileSize ? refinedRoad(points) : HOME_ROAD;
  const cyan = mobileSize ? refinedRoad(companionRoad(points, 7)) : HOME_ROAD_CYAN;
  return (
    <svg
      ref={mobileRef}
      aria-hidden="true"
      viewBox="0 0 430 2800"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full lg:hidden"
    >
      <g fill="none" stroke="#edf1f3" strokeWidth="1" strokeOpacity="0.8">
        <path d="M36 330 C120 290 190 320 278 280 C335 255 372 270 414 240" />
        <path d="M24 805 C110 760 178 800 258 760 C320 730 365 750 421 710" />
        <path d="M17 1320 C107 1275 195 1315 272 1274 C327 1244 370 1260 423 1218" />
        <path d="M19 1845 C109 1808 190 1840 270 1804 C327 1778 368 1795 420 1759" />
        <path d="M20 2335 C110 2295 196 2330 277 2290 C330 2264 375 2280 420 2244" />
      </g>
      <path
        d={cyan}
        fill="none"
        stroke="#17b9eb"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={orange}
        fill="none"
        stroke="#e75b00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Desktop: each section shares a vertical tangent at its boundaries.
// The matching X coordinates prevent cuts, even when section heights vary.
const DESKTOP_ROAD_SEGMENTS: Record<'hero' | 'discovery' | 'universe' | 'maintenance' | 'guides' | 'pro', Array<[number, number]>> = {
  hero: [
    [110, 112], [110, 185], [380, 230], [700, 335],
    [1110, 520], [1410, 730], [1250, 900], [1220, 955], [1220, 1000],
  ],
  discovery: [
    [1220, 0], [1220, 90], [1450, 260], [1460, 475],
    [1290, 625], [870, 765], [380, 850], [235, 940], [235, 1000],
  ],
  universe: [
    [235, 0], [235, 90], [145, 260], [240, 345],
    [540, 395], [1015, 500], [1340, 775], [1370, 940], [1370, 1000],
  ],
  maintenance: [
    [1370, 0], [1370, 100], [1480, 255], [1320, 395],
    [980, 535], [530, 680], [250, 830], [210, 942], [210, 1000],
  ],
  guides: [
    [210, 0], [210, 105], [160, 240], [490, 385],
    [990, 520], [1440, 655], [1380, 775], [1080, 930], [1080, 1000],
  ],
  pro: [
    [1080, 0], [1080, 85], [1380, 240], [1450, 450],
    [1250, 605], [920, 755], [580, 920], [520, 970], [520, 1000],
  ],
};

/* LABELMOTO V3.19.16b - deux lignes suivant la meme courbe a 7px.
 * L'offset est calcule dans le repere physique CSS, pas dans le viewBox etire.
 * La petite adaptation initiale conserve l'ancrage cyan exact du header.
 */
function parallelHomeRoad(d: string, gapPx: number, width: number, height: number, fromHeader: boolean): string {
  const sections=d.trim().split(' C ');
  if(sections.length < 2 || !sections[0].startsWith('M ')) throw Error('Chemin cubic inattendu');
  const coords=(part: string, size: number): number[] => {
    const n=part.trim().split(/\s+/).map(Number);
    if(n.length !== size || n.some(v=>!Number.isFinite(v))) throw Error('Coordonnees Bezier invalides');
    return n;
  };
  const scaleX=(width || 1600)/1600;
  const scaleY=(height || 1000)/1000;
  let p0=coords(sections[0].slice(2),2);
  const out: string[]=[];
  const fmt=(n: number): string => String(Math.round(n*100)/100);
  for(let i=1;i<sections.length;i++) {
    const q=coords(sections[i],6);
    const p1=[q[0],q[1]],p2=[q[2],q[3]],p3=[q[4],q[5]];
    const length=(Math.hypot((p1[0]-p0[0])*scaleX,(p1[1]-p0[1])*scaleY)
      + Math.hypot((p2[0]-p1[0])*scaleX,(p2[1]-p1[1])*scaleY)
      + Math.hypot((p3[0]-p2[0])*scaleX,(p3[1]-p2[1])*scaleY));
    const steps=Math.max(24,Math.min(320,Math.ceil(length/3)));
    for(let j=(i===1?0:1);j<=steps;j++) {
      const t=j/steps,u=1-t;
      const px=u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0];
      const py=u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1];
      const vx=(3*u*u*(p1[0]-p0[0])+6*u*t*(p2[0]-p1[0])+3*t*t*(p3[0]-p2[0]))*scaleX;
      const vy=(3*u*u*(p1[1]-p0[1])+6*u*t*(p2[1]-p1[1])+3*t*t*(p3[1]-p2[1]))*scaleY;
      const magnitude=Math.hypot(vx,vy)||1;
      let nx=-vy/magnitude, ny=vx/magnitude;
      if(fromHeader && i===1) {
        // Au point A, le cyan du header finit 7px a gauche, au meme Y.
        const mix=Math.min(1,(j/steps)*5);
        const blendX=-(1-mix)+nx*mix, blendY=ny*mix;
        const z=Math.hypot(blendX,blendY)||1;
        nx=blendX/z;ny=blendY/z;
      }
      const ox=px+gapPx*nx/scaleX,oy=py+gapPx*ny/scaleY;
      out.push((out.length?'L ':'M ')+fmt(ox)+' '+fmt(oy));
    }
    p0=p3;
  }
  return out.join(' ');
}

/* LABELMOTO V3.19.21 - JONCTIONS COURTES ET SOUPLES */
// Une zone rectiligne courte (32 unites max) a chaque limite de section.
// Tangente verticale commune ; la grande ondulation reste dans chaque section.
function smoothHomeSectionJoints(d: string, segment: keyof typeof DESKTOP_ROAD_SEGMENTS): string {
  const parts = d.trim().split(' C ');
  if (parts.length < 3 || !parts[0].startsWith('M ')) throw Error('Bezier HOME non reconnu');
  const parse = (s: string, expected: number): number[] => {
    const a = s.trim().split(/\s+/).map(Number);
    if (a.length !== expected || a.some(n => !Number.isFinite(n))) throw Error('Bezier HOME invalide');
    return a;
  };
  const start = parse(parts[0].slice(2), 2);
  const curves = parts.slice(1).map(s => parse(s, 6));
  const first = curves[0];
  // Pres des limites, les longs segments verticaux etaient crees par un
  // alignement simultane des poignees de DEUX Bezier consecutives.
  // On limite la zone droite et on laisse repartir la courbe sans plateau.
  if (segment !== 'hero') {
    const dy = first[5] - start[1];
    if (dy > 42 && Math.abs(first[4] - start[0]) < 1 && curves.length > 1) {
      const shortened = Math.min(32, dy * .38);
      first[5] = start[1] + shortened;
      const lead = Math.min(14, shortened * .36);
      first[2] = start[0];
      first[3] = first[5] - lead;
      curves[1][0] = start[0];
      curves[1][1] = first[5] + lead;
    }
    const run = Math.max(8, Math.min(21, (first[5] - start[1]) * .38));
    if (first[5] > start[1] + 8) {
      first[0] = start[0];
      first[1] = start[1] + run;
    }
  }
  const last = curves[curves.length - 1];
  const previous = curves.length > 1 ? curves[curves.length - 2] : null;
  const endX = last[4], endY = last[5];
  if (previous) {
    const dy = endY - previous[5];
    if (dy > 42 && Math.abs(previous[4] - endX) < 1) {
      const shortened = Math.min(32, dy * .38);
      previous[5] = endY - shortened;
      const lead = Math.min(14, shortened * .36);
      previous[2] = endX;
      previous[3] = previous[5] - lead;
      last[0] = endX;
      last[1] = previous[5] + lead;
    }
    const remaining = endY - previous[5];
    if (remaining > 8) {
      last[2] = endX;
      last[3] = endY - Math.max(8, Math.min(21, remaining * .38));
    }
  }
  const fmt=(n: number): string => String(Math.round(n*100)/100);
  return 'M '+start.map(fmt).join(' ')+' '+curves.map(c=>'C '+c.map(fmt).join(' ')).join(' ');
}

/* LABELMOTO V3.19.15 - RACCORDEMENT ACCUEIL */
function DesktopSectionRoad({ segment }: { segment: keyof typeof DESKTOP_ROAD_SEGMENTS }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const size = useLabelMotoRoadSize(svgRef);
  const points = DESKTOP_ROAD_SEGMENTS[segment];
  // Le dessin central de chaque section reste celui d'origine.
  const orangePoints = points;
  // Taille indisponible au premier rendu : repli sur le viewBox existant.
  const svgWidth = size?.width || 1600;
  const svgHeight = size?.height || 1000;
  const round = (n: number): number => Math.round(n * 10) / 10;
  const sx = (n: number) => round(n * 1600 / svgWidth);
  const sy = (n: number) => round(n * 1000 / svgHeight);

  const pathFor = (items: ReadonlyArray<readonly [number, number]>, offset: number) => {
    if (segment === 'hero') {
      // Depart A : meme point et meme tangente que le header Entretien (80 px de haut).
      // Rejoint ensuite la courbe existante a son 4e point ; les points suivants sont inchanges.
      const entry = labelMotoHeaderExit(svgWidth, 80, offset);
      const startX = sx(entry.x);
      const startY = sy(entry.y);
      if (items.length < 6) throw Error('Segment hero incomplet');
      const anchor=items[3];
      // Tangente exacte de la courbe suivante d'origine, sans la recalculer.
      const cp2x=round(anchor[0]-(items[4][0]-items[2][0])/6);
      const cp2y=round(anchor[1]-(items[4][1]-items[2][1])/6);
      const following=refinedRoad(items).split(' C ').slice(4);
      const remainder=' C ' + following.join(' C ');
      return [
        'M',startX,startY,'C',round(startX+sx(entry.tangentX)),round(startY+sy(entry.tangentY)),
        cp2x,cp2y,round(anchor[0]),round(anchor[1])
      ].join(' ') + remainder;
    }
/* LABELMOTO V3.19.17 - ONDULATION PRO DU CROQUIS */
    if (segment === 'pro') {
      // V3.19.17 : ondulation verticale large, des le haut de la section.
      // Les tangentes des segments sont raccordees, sans petits virages serres.
      // Le cyan reste calcule a 7px sur la normale de CE meme chemin.
      const entry = labelMotoFooterEntry(svgWidth, 0);
      const b = sx(entry.x);
      return [
        'M', round(items[0][0]), round(items[0][1]),
/* LABELMOTO V3.19.18b - RACCORDEMENT PRO DOUX */
        'C', 1080, 145, 985, 155, 860, 205,
        'C', 735, 254, 765, 320, 795, 380,
        'C', 825, 440, 730, 485, 713, 560,
        'C', 696, 635, 712, 709, 830, 768,
        'C', 948, 827, round(b - 175), 825, round(b - 130), 880,
        'C', round(b - 85), 935, b, 960, b, 1000,
      ].join(' ');
    }
    return refinedRoad(items);
  };
  const orange = smoothHomeSectionJoints(pathFor(orangePoints,0), segment);
  const cyan = parallelHomeRoad(orange, 7, svgWidth, svgHeight, segment === 'hero');
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      data-labelmoto-home-road-segment={segment}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    >
      <path d={cyan} fill="none" stroke="#17b9eb" strokeWidth="1.35"
        strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={orange} fill="none" stroke="#e75b00" strokeWidth="1.35"
        strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* LABELMOTO V3.19.16b - pont decoratif dans la bande entre pro et footer. */
/* LABELMOTO V3.19.19 - RACCORDEMENT DOM EXACT */
function HomeFooterBridge() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const size = useLabelMotoRoadSize(svgRef);
  // Mesures physiques : le main peut etre en 100vw (barre de scroll incluse),
  // alors que le footer global est dimensionne sur la largeur du document.
  const [joints, setJoints] = useState<{ start: number; end: number } | null>(null);
  useEffect(() => {
    const bridge = svgRef.current;
    const main = document.querySelector<SVGSVGElement>('svg[data-labelmoto-home-road-segment="pro"]');
    const footer = document.querySelector<HTMLElement>('footer');
    const footerRoad = footer?.querySelector<SVGSVGElement>('svg[viewBox]');
    if (!bridge || !main || !footerRoad) return;
    const measure = () => {
      const bridgeBox = bridge.getBoundingClientRect();
      const mainBox = main.getBoundingClientRect();
      const footerBox = footerRoad.getBoundingClientRect();
      if (bridgeBox.width < 1 || footerBox.width < 1 || mainBox.width < 1) return;
      const start = mainBox.left + labelMotoFooterEntry(mainBox.width, 0).x - bridgeBox.left;
      const end = footerBox.left + labelMotoFooterEntry(footerBox.width, 0).x - bridgeBox.left;
      setJoints(old => old && Math.abs(old.start - start) < .05 && Math.abs(old.end - end) < .05
        ? old : { start, end });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bridge);
    observer.observe(main);
    observer.observe(footerRoad);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  const width = size?.width || 1600;
  const start = (joints?.start ?? labelMotoFooterEntry(width, 0).x) * 1600 / width;
  const end = (joints?.end ?? labelMotoFooterEntry(width, 0).x) * 1600 / width;
  const gap = 7 * 1600 / width;
  const fmt = (n: number) => String(Math.round(n * 100) / 100);
  // Bezier : tangentes verticales au depart du MAIN et a l'entree du FOOTER.
  const road = (dx: number) =>
    'M ' + fmt(start + dx) + ' 0 C ' +
    [fmt(start + dx), '32', fmt(end + dx), '68', fmt(end + dx), '100'].join(' ');
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-full w-screen -translate-x-1/2 lg:block">
      <svg ref={svgRef} aria-hidden="true" viewBox="0 0 1600 100" preserveAspectRatio="none" className="h-full w-full">
        <path d={road(-gap)} stroke="#17b9eb" fill="none" strokeWidth="1.35" vectorEffect="non-scaling-stroke" />
        <path d={road(0)} stroke="#e75b00" fill="none" strokeWidth="1.35" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
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

      const brands =
        findCardByText(
          'Rechercher par marque'
        );

      const trouverPro =
        findCardByText(
          'Rechercher par métier'
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
        brands,
        950
      );

      positionBetween(
        'nouvelle',
        brands,
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

      const professionSearch =
        resolveMapProfessionSearch(
          what,
          selectedFilter
        );

      const filter =
        professionSearch.filter;

      if (filter) {
        params.set(
          'filter',
          filter
        );
      }

      // ===============================================
      // CHAMP "QUE RECHERCHEZ-VOUS ?"
      //
      // Le métier est converti en filtre canonique.
      // Le reliquat (marque / nom utile) reste dans ?search=.
      // ===============================================

      const whatForSearch =
        professionSearch.query;

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
      // => filter=ateliers-mecaniciens&search=Paris 13
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

      if (what.trim()) {
        params.set(
          'what',
          what.trim()
        );
      }

      const displaySearch = [
        what.trim(),
        whereForSearch,
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      if (
        displaySearch &&
        displaySearch !==
          combinedSearch
      ) {
        params.set(
          'display',
          displaySearch
        );
      }

      // LABELMOTO HOME -> MAP
      //
      // Ne pas geocoder ici.
      // La page /map est l'unique moteur de recherche
      // geographique afin qu'une recherche provenant
      // de l'accueil suive exactement le meme parcours
      // qu'une recherche saisie directement sur la carte.

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

        const professionSearch =
          resolveMapProfessionSearch(
            what,
            selectedFilter
          );

        const filter =
          professionSearch.filter;

        if (filter) {
          params.set(
            'filter',
            filter
          );
        }

        if (professionSearch.query) {
          params.set(
            'search',
            professionSearch.query
          );
        }

        const displaySearch =
          what.trim();

        if (
          displaySearch &&
          displaySearch !==
            professionSearch.query
        ) {
          params.set(
            'display',
            displaySearch
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
                  const href = choice.filter
                    ? `/map?filter=${encodeURIComponent(choice.filter)}`
                    : `/map?search=${encodeURIComponent(choice.value)}`;

                  window.location.assign(href);
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

function MobileBrandsSection() {
  const [showAllBrands, setShowAllBrands] =
    useState(false);

  const manufacturers = showAllBrands
    ? HOME_MANUFACTURERS
    : HOME_FEATURED_MANUFACTURERS;

  const equipmentBrands = showAllBrands
    ? HOME_EQUIPMENT_BRANDS
    : HOME_FEATURED_EQUIPMENT_BRANDS;

  const listClassName = showAllBrands
    ? 'mt-3 grid grid-cols-2 gap-2'
    : 'mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

  const cardClassName = showAllBrands
    ? 'flex min-h-[56px] w-full items-center justify-between gap-2 rounded-[1rem] border border-border/60 bg-white px-3'
    : 'flex min-h-[56px] w-[145px] shrink-0 snap-start items-center justify-between gap-2 rounded-[1rem] border border-border/60 bg-white px-3';

  return (
    <Card
      title="Rechercher par marque"
    >
      <div>
        <span
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.08em]
            text-muted-foreground
          "
        >
          Constructeurs
        </span>

        <div className={listClassName}>
          {manufacturers.map(
            brand => (
              <Link
                key={brand}
                href={homeBrandHref(brand)}
                className={cardClassName}
              >
                <strong
                  className="
                    inline-flex
                    min-w-0
                    items-center
                    gap-2
                    text-[10px]
                    font-black
                  "
                >
                  <BrandLogo
                    brand={brand}
                    className={
                      brand === 'Kawasaki'
                        ? 'h-5 w-8 shrink-0 object-contain'
                        : 'h-5 w-5 shrink-0 object-contain'
                    }
                  />
                  <span className="min-w-0 truncate">
                    {brand}
                  </span>
                </strong>

                <ArrowRight
                  className="
                    h-3
                    w-3
                    shrink-0
                    text-brand
                  "
                />
              </Link>
            )
          )}
        </div>
      </div>

      <div
        className="
          mt-4
        "
      >
        <span
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.08em]
            text-muted-foreground
          "
        >
          Équipementiers & enseignes
        </span>

        <div className={listClassName}>
          {equipmentBrands.map(
            brand => (
              <Link
                key={brand}
                href={homeBrandHref(brand)}
                className={cardClassName}
              >
                <strong
                  className="
                    inline-flex
                    min-w-0
                    items-center
                    gap-2
                    text-[10px]
                    font-black
                  "
                >
                  <BrandLogo
                    brand={brand}
                    className={
                      brand === 'Kawasaki'
                        ? 'h-5 w-8 shrink-0 object-contain'
                        : 'h-5 w-5 shrink-0 object-contain'
                    }
                  />
                  <span className="min-w-0 truncate">
                    {brand}
                  </span>
                </strong>

                <ArrowRight
                  className="
                    h-3
                    w-3
                    shrink-0
                    text-brand
                  "
                />
              </Link>
            )
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setShowAllBrands(current => !current)
        }
        aria-expanded={showAllBrands}
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
        {showAllBrands ? 'Réduire' : 'Voir toutes'}

        <ArrowRight
          className={`
            h-3
            w-3
            transition-transform
            ${showAllBrands ? '-rotate-90' : 'rotate-90'}
          `}
        />
      </button>
    </Card>
  );
}

function MobileGuidesSection() {
  const articles = [
    {
      image:
        '/images/achat-occasion.webp',
      category:
        'Permis & A2',
      title:
        'Quelle moto choisir pour débuter en A2 ?',
      href:
        '/info/meilleure-moto-a2-quelle-moto-choisir-pour-debuter',
    },
    {
      image:
        '/images/evitelespieges.webp',
      category:
        'Achat',
      title:
        'Acheter une moto d’occasion sans tomber dans les pièges',
      href:
        '/info/achat-moto-occasion-guide-complet-pour-eviter-les-pieges',
    },
    {
      image:
        '/images/casque-meilleur-casque-2026.webp',
      category:
        'Équipement',
      title:
        'Les meilleurs casques moto en 2026',
      href:
        '/info/meilleurs-casques-moto-2026',
    },
    {
      image:
        '/images/article-scooter-125.webp',
      category:
        'Scooter 125',
      title:
        'Quel scooter 125 choisir en 2026 ?',
      href:
        '/info/meilleur-scooter-125-2026-comparatif-complet',
    },
    {
      image:
        '/images/article-moto-125cc.webp',
      category:
        'Moto 125',
      title:
        'Les meilleures motos 125 cc en 2026',
      href:
        '/info/meilleures-motos-125cc-2026-guide-complet',
    },
  ];

  return (
    <Card
      title="Guides & conseils"
    >
      <p
        className="
          mb-4
          text-[9px]
          font-semibold
          leading-relaxed
          text-muted-foreground
        "
      >
        Conseils, comparatifs et dossiers
        pour mieux choisir votre moto.
      </p>

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
        {articles.map(
          article => (
            <Link
              key={article.href}
              href={article.href}
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
                  h-[88px]
                  overflow-hidden
                  bg-muted/40
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
                  "
                />
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
                  {article.category}
                </span>

                <div
                  className="
                    mt-1.5
                    flex
                    items-start
                    justify-between
                    gap-2
                  "
                >
                  <strong
                    className="
                      min-h-[34px]
                      min-w-0
                      overflow-hidden
                      text-[9px]
                      font-semibold
                      leading-[1.25]
                    "
                  >
                    {article.title}
                  </strong>

                  <ArrowRight
                    className="
                      mt-0.5
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
        href="/info"
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
        Voir tous les guides

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

      if (!searchZone) {
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
          ? 650
          : -650,
      behavior: 'smooth',
    });
  };

  return (
    <section
      data-labelmoto-home-halo="true"
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
      <DesktopSectionRoad segment="maintenance" />
      <div
        className="
          relative
          z-10
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
              Entretien & modèles
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
              Entretenir et mieux connaître
              votre moto
            </h2>

            <p
              className="
                mt-3
                max-w-[640px]
                text-[15px]
                text-muted-foreground
              "
            >
              Fiches techniques, révisions et repères
              pour mieux connaître et entretenir votre moto.
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
              href="/entretien#fiches-par-modele"
              className="
                mr-3
                text-[12px]
                font-semibold
                text-brand
                hover:underline
              "
            >
              Voir toutes les fiches
            </Link>

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
              "
            >
              →
            </button>
          </div>
        </div>

        <div
          id="desktop-tech-sheets-scroll"
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
          {TECH_SHEETS.map(sheet => (
            <Link
              key={sheet.href}
              href={sheet.href}
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
                  flex
                  h-[205px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[1.35rem]
                  bg-[#f1f2f3]
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
      data-labelmoto-home-halo="true"
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
      <DesktopSectionRoad segment="guides" />
      <div
        className="
          relative
          z-10
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
      data-labelmoto-home-halo="true"
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
      <DesktopSectionRoad segment="pro" />
      <div
        data-labelmoto-home-pro-halo="true"
        className="
          relative
          z-10
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
              GAUCHE : MESSAGE PRO
          ================================================== */}

          <div
            className="
              max-w-[590px]
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
                max-w-[590px]
                text-[43px]
                font-bold
                leading-[1.04]
                tracking-[-0.04em]
                text-foreground
                xl:text-[50px]
              "
            >
              Donnez plus de visibilité à votre activité
            </h2>

            <p
              className="
                mt-6
                max-w-[550px]
                text-[16px]
                font-normal
                leading-[1.6]
                text-muted-foreground
                xl:text-[17px]
              "
            >
              Créez ou revendiquez votre fiche LabelMoto pour
              présenter votre activité, apparaître dans les
              recherches locales et permettre aux motards de vous
              contacter directement.
            </p>

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

                Présence sur la carte
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

                Fiche professionnelle
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

                Contacts directs
              </span>
            </div>

            <div
              className="
                mt-9
                flex
                items-center
                gap-7
              "
            >
              <Link
                href="/pro/register"
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
                Créer ma fiche

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
                Revendiquer ma fiche

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

            <div
              className="
                mt-5
                max-w-[550px]
              "
            >
              <p
                className="
                  text-[11px]
                  font-medium
                  leading-[1.55]
                  text-foreground/65
                "
              >
                Après création ou revendication, gérez
                vous-même votre fiche depuis votre espace
                professionnel.
                <span
                  className="
                    ml-0.5
                    font-bold
                    text-brand
                  "
                >
                  *
                </span>
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-medium
                  leading-[1.5]
                  text-muted-foreground
                "
              >
                <span
                  className="
                    font-bold
                    text-brand
                  "
                >
                  *
                </span>
                {' '}
                Les créations et modifications restent soumises
                à validation finale par LabelMoto avant publication.
              </p>
            </div>
          </div>

          {/* =================================================
              DROITE : VISUEL EDITORIAL PRO
          ================================================== */}

          <div
            className="
              relative
              mt-7
              min-h-[470px]
              xl:min-h-[500px]
            "
          >
            <div
              className="
                absolute
                inset-0
                overflow-hidden
                rounded-[2rem]
                border
                border-transparent
                bg-transparent
                px-9
                pt-7
                pb-9
                shadow-none
                xl:px-11
                xl:pt-8
                xl:pb-10
              "
            >
              {/* INTRO */}

              <div
                className="
                  relative
                  z-10
                  max-w-[500px]
                "
              >
                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-brand
                  "
                >
                  Votre présence sur LabelMoto
                </span>

                <h3
                  className="
                    mt-3
                    max-w-[500px]
                    text-[25px]
                    font-bold
                    leading-[1.15]
                    tracking-[-0.035em]
                    text-foreground
                    xl:text-[29px]
                  "
                >
                  Une fiche claire.
                  <br />
                  Des motards qui vous trouvent.
                </h3>
              </div>

              {/* PARCOURS */}

              <div
                className="
                  relative
                  z-10
                  mt-7
                  border-t
                  border-black/[0.07]
                "
              >
                {/* 01 */}

                <div
                  className="
                    grid
                    grid-cols-[64px_minmax(0,1fr)_32px]
                    items-center
                    gap-4
                    border-b
                    border-black/[0.06]
                    py-6
                  "
                >
                  <span
                    className="
                      text-[30px]
                      font-bold
                      tracking-[-0.05em]
                      text-brand
                    "
                  >
                    01
                  </span>

                  <div>
                    <p
                      className="
                        text-[15px]
                        font-bold
                        tracking-[-0.015em]
                        text-foreground
                      "
                    >
                      Créez ou revendiquez votre fiche
                    </p>

                    <p
                      className="
                        mt-1
                        text-[12px]
                        font-medium
                        leading-[1.55]
                        text-muted-foreground
                      "
                    >
                      Présentez votre activité, vos services
                      et vos coordonnées.
                    </p>
                  </div>

                  <Store
                    className="
                      h-5
                      w-5
                      text-brand
                    "
                  />
                </div>

                {/* 02 */}

                <div
                  className="
                    grid
                    grid-cols-[64px_minmax(0,1fr)_32px]
                    items-center
                    gap-4
                    border-b
                    border-black/[0.06]
                    py-6
                  "
                >
                  <span
                    className="
                      text-[30px]
                      font-bold
                      tracking-[-0.05em]
                      text-brand
                    "
                  >
                    02
                  </span>

                  <div>
                    <p
                      className="
                        text-[15px]
                        font-bold
                        tracking-[-0.015em]
                        text-foreground
                      "
                    >
                      Soyez trouvé dans les recherches
                    </p>

                    <p
                      className="
                        mt-1
                        text-[12px]
                        font-medium
                        leading-[1.55]
                        text-muted-foreground
                      "
                    >
                      Carte, annuaire, métier, marque ou
                      localisation : votre activité reste visible.
                    </p>
                  </div>

                  <Search
                    className="
                      h-5
                      w-5
                      text-brand
                    "
                  />
                </div>

                {/* 03 */}

                <div
                  className="
                    grid
                    grid-cols-[64px_minmax(0,1fr)_32px]
                    items-center
                    gap-4
                    py-6
                  "
                >
                  <span
                    className="
                      text-[30px]
                      font-bold
                      tracking-[-0.05em]
                      text-brand
                    "
                  >
                    03
                  </span>

                  <div>
                    <p
                      className="
                        text-[15px]
                        font-bold
                        tracking-[-0.015em]
                        text-foreground
                      "
                    >
                      Facilitez le contact
                    </p>

                    <p
                      className="
                        mt-1
                        text-[12px]
                        font-medium
                        leading-[1.55]
                        text-muted-foreground
                      "
                    >
                      Téléphone, site web et itinéraire
                      sont accessibles directement depuis votre fiche.
                    </p>
                  </div>

                  <ArrowRight
                    className="
                      h-5
                      w-5
                      text-brand
                    "
                  />
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopUniverseSection() {
  const [showAllBrands, setShowAllBrands] =
    useState(false);

  const manufacturers = showAllBrands
    ? HOME_MANUFACTURERS
    : HOME_FEATURED_MANUFACTURERS;

  const equipmentBrands = showAllBrands
    ? HOME_EQUIPMENT_BRANDS
    : HOME_FEATURED_EQUIPMENT_BRANDS;

  return (
    <section
      data-labelmoto-home-halo="true"
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
      <DesktopSectionRoad segment="universe" />
      <div
        className="
          relative
          z-10
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
                  Rechercher par métier
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
              href="/metiers"
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
                Rechercher par marque
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAllBrands(current => !current)
              }
              aria-expanded={showAllBrands}
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
              {showAllBrands ? 'Réduire' : 'Voir toutes'}

              <ArrowRight
                className={`
                  h-3.5
                  w-3.5
                  transition-transform
                  ${showAllBrands ? '-rotate-90' : 'rotate-90'}
                `}
              />
            </button>
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
                  href={homeBrandHref(brand)}
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
                      inline-flex
                      min-w-0
                      items-center
                      justify-center
                      gap-2
                      text-[14px]
                      font-bold
                      tracking-[-0.015em]
                    "
                  >
                    <BrandLogo
                      brand={brand}
                      className={
                        brand === 'Kawasaki'
                          ? 'h-6 w-10 shrink-0 object-contain'
                          : 'h-6 w-6 shrink-0 object-contain'
                      }
                    />
                    <span className="min-w-0 truncate">
                      {brand}
                    </span>
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
                  href={homeBrandHref(brand)}
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
                      inline-flex
                      min-w-0
                      items-center
                      justify-center
                      gap-2
                      text-[14px]
                      font-bold
                      tracking-[-0.015em]
                    "
                  >
                    <BrandLogo
                      brand={brand}
                      className={
                        brand === 'Kawasaki'
                          ? 'h-6 w-10 shrink-0 object-contain'
                          : 'h-6 w-6 shrink-0 object-contain'
                      }
                    />
                    <span className="min-w-0 truncate">
                      {brand}
                    </span>
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
      data-labelmoto-home-halo="true"
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
      <DesktopSectionRoad segment="discovery" />
      <div
        className="
          relative
          z-10
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
      data-labelmoto-mobile-road="home"
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

            <UserMenu />
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
          data-labelmoto-home-halo="true"
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
          <DesktopSectionRoad segment="hero" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] hidden h-[80px] lg:block">
            <LabelMotoRoadHeaderEntry />
          </div>
          <div
            className="
              relative
              z-10
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
                  Entretien / fiches techniques
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

              </nav>

              <UserMenu />
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
            MARQUES / EQUIPEMENT
        =================================================== */}

        <Stage
          side="right"
          pinSide="right"
          height="compact"
        >
          <MobileBrandsSection />
        </Stage>

        <div
          className="h-8"
          aria-hidden="true"
        />

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
            title="Rechercher par métier"
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
              w-full
            "
          >
            <MobileGuidesSection />
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
                href="/pro/register"
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
                Créer ma fiche
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
                Revendiquer ma fiche
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
            hidden
            lg:block
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
          <HomeFooterBridge />
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
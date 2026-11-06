'use client';

import { useRef } from 'react';
import { LABELMOTO_ROAD_CYAN, LABELMOTO_ROAD_ORANGE, LABELMOTO_ROAD_GAP, labelMotoMainRoad, useLabelMotoRoadSize } from './labelmoto-road-finishes';

/*
 * Route décorative de la homepage,
 * réutilisée uniquement sur /entretien.
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

const ENTRETIEN_MOBILE_POINTS: Array<[number, number]> = [
  [44, 108], [145, 108], [275, 114], [365, 169], [405, 305], [408, 632],
  [394, 794], [325, 879], [62, 1025], [22, 1156],
  [70, 1298], [330, 1477], [401, 1590], [403, 1762],
  [315, 1905], [75, 2028], [20, 2180], [43, 2315],
  [283, 2485], [395, 2645], [389, 2845], [282, 3050],
  [39, 3260], [29, 3450], [189, 3636], [395, 3820],
  [404, 4042], [260, 4240], [34, 4470], [23, 4640],
  [212, 4880], [401, 5080], [390, 5350], [175, 5520],
  [20, 5780], [51, 6050], [348, 6260], [406, 6495],
  [270, 6740], [24, 6960], [18, 7180], [333, 7390],
  [402, 7630], [363, 7880], [45, 8130], [22, 8365],
  [291, 8580], [408, 8830], [380, 9030], [32, 9350],
  [20, 9580], [345, 9810], [404, 10060], [314, 10300],
  [22, 10560], [28, 10760], [345, 11010], [402, 11250],
  [246, 11610], [400, 11760], [400, 12000],
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
  // LABELMOTO_HEADER_COPIE_EXACTE_ACCUEIL_20261105 : meme amorce et meme tangente que sur l'Accueil.
  const first = [...LABELMOTO_MOBILE_ENTRY, [136, 522] as [number, number]]
    .map(([x,y]) => [x, y * svgScale] as [number,number]);
  const rest = original.slice(tailStart + 1).map(([x,y]) => {
    const ratio = Math.max(0, Math.min(1, (y-originalJoinY)/(endY-originalJoinY)));
    return [x, joinY + ratio*(viewBoxHeight - joinY)] as [number,number];
  });
  return [...first,...rest];
}

const ENTRETIEN_MOBILE = refinedRoad(ENTRETIEN_MOBILE_POINTS);
const ENTRETIEN_MOBILE_CYAN = refinedRoad(companionRoad(ENTRETIEN_MOBILE_POINTS, 7));

// Ruban SVG a largeur variable : bords calcules sur la normale du meme chemin.
// Pas de stroke-dasharray ni de segments d'epaisseurs distinctes.
function roadEntryTaper(points: ReadonlyArray<readonly [number, number]>): string {
  const center: Array<[number, number]> = [];
  const segmentCount = 5;
  const steps = 32;
  for (let i = 0; i < segmentCount; i++) {
    const a = points[i - 1] ?? points[i];
    const b = points[i];
    const c = points[i + 1];
    const d = points[i + 2] ?? c;
    const p1x = b[0] + (c[0] - a[0]) / 6;
    const p1y = b[1] + (c[1] - a[1]) / 6;
    const p2x = c[0] - (d[0] - b[0]) / 6;
    const p2y = c[1] - (d[1] - b[1]) / 6;
    for (let j = i ? 1 : 0; j <= steps; j++) {
      const t = j / steps;
      const s = 1 - t;
      center.push([
        s*s*s*b[0] + 3*s*s*t*p1x + 3*s*t*t*p2x + t*t*t*c[0],
        s*s*s*b[1] + 3*s*s*t*p1y + 3*s*t*t*p2y + t*t*t*c[1]
      ]);
    }
  }
  const distance = [0];
  for (let i = 1; i < center.length; i++) {
    distance.push(distance[i - 1] + Math.hypot(
      center[i][0] - center[i - 1][0], center[i][1] - center[i - 1][1]
    ));
  }
  const total = distance[distance.length - 1] || 1;
  const left: Array<[number, number]> = [];
  const right: Array<[number, number]> = [];
  center.forEach(([x, y], i) => {
    const prev = center[Math.max(0, i - 1)];
    const following = center[Math.min(center.length - 1, i + 1)];
    const dx = following[0] - prev[0];
    const dy = following[1] - prev[1];
    const length = Math.hypot(dx, dy) || 1;
    const t = Math.min(1, distance[i] / total);
    // Courbe cubique avec derivee nulle au depart et a l'arrivee.
    const eased = t * t * (3 - 2 * t);
    const halfWidth = (2.8 + (1.5 - 2.8) * eased) / 2;
    const nx = -dy * halfWidth / length;
    const ny = dx * halfWidth / length;
    left.push([x + nx, y + ny]);
    right.push([x - nx, y - ny]);
  });
  const round = (n: number) => String(Math.round(n * 1000) / 1000);
  const poly = (arr: Array<[number, number]>) => arr.map(([x, y]) => round(x) + ' ' + round(y)).join(' L ');
  return 'M ' + poly(left) + ' L ' + poly(right.reverse()) + ' Z';
}
const ENTRETIEN_MOBILE_TAPER_ORANGE = roadEntryTaper(ENTRETIEN_MOBILE_POINTS);
const ENTRETIEN_MOBILE_TAPER_CYAN = roadEntryTaper(companionRoad(ENTRETIEN_MOBILE_POINTS, 7));

// LABELMOTO_ENTRETIEN_HEADER_PHYSICAL_500_V1: header physique identique au depart de l'Accueil.
// Le dernier point sert uniquement a conserver la tangente Bezier.
const ENTRETIEN_HEADER_POINTS: Array<[number, number]> = [...LABELMOTO_MOBILE_ENTRY, [136, 522]];
const ENTRETIEN_HEADER_ORANGE = refinedRoad(ENTRETIEN_HEADER_POINTS);
const ENTRETIEN_HEADER_CYAN = refinedRoad(companionRoad(ENTRETIEN_HEADER_POINTS, 7));
const ENTRETIEN_HEADER_TAPER_ORANGE = roadEntryTaper(ENTRETIEN_HEADER_POINTS);
const ENTRETIEN_HEADER_TAPER_CYAN = roadEntryTaper(companionRoad(ENTRETIEN_HEADER_POINTS, 7));

export default function EntretienRoadBackdrop({ variant = 'info' }: { variant?: 'info' | 'entretien' }) {
  const mobileRef = useRef<SVGSVGElement>(null);
  const mobileSize = useLabelMotoRoadSize(mobileRef);
  const adjusted = mobileSize
    ? alignedMobileRoad(ENTRETIEN_MOBILE_POINTS, 632, 12000, mobileSize.height, 6)
    : ENTRETIEN_MOBILE_POINTS;
  const mobileOrange = mobileSize ? refinedRoad(adjusted) : ENTRETIEN_MOBILE;
  const mobileCyan = mobileSize ? refinedRoad(companionRoad(adjusted, 7)) : ENTRETIEN_MOBILE_CYAN;
  const taperOrange = mobileSize ? roadEntryTaper(adjusted) : ENTRETIEN_MOBILE_TAPER_ORANGE;
  const taperCyan = mobileSize ? roadEntryTaper(companionRoad(adjusted, 7)) : ENTRETIEN_MOBILE_TAPER_CYAN;
  const desktopRef = useRef<SVGSVGElement>(null);
  const desktopSize = useLabelMotoRoadSize(desktopRef);
  return (
    <>
    <div
        className="
          absolute
          inset-0
          lg:hidden
        "
      >
        <svg
      ref={mobileRef}
      style={variant === 'entretien' ? { clipPath: 'inset(500px 0 0 0)' } : undefined}
      aria-hidden="true"
      viewBox="0 0 430 12000"
      preserveAspectRatio="none"
      className="
        pointer-events-none
        absolute
        inset-x-0
        top-0
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

      {/* Trait bicolore dessine en Bezier, sous le contenu. */}
      <path
        d={mobileCyan}
        fill="none"
        stroke="#17b9eb"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={mobileOrange}
        fill="none"
        stroke="#e75b00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Rubans effiles en continu : 2.8 px vers 1.5 px. */}
      <path d={taperCyan} fill="#17b9eb" />
      <path d={taperOrange} fill="#e75b00" />
</svg>
        {variant === 'entretien' && (
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 430 500"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[500px] w-full"
          >
            <path d={ENTRETIEN_HEADER_CYAN} fill="none" stroke="#17b9eb"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              vectorEffect="non-scaling-stroke" />
            <path d={ENTRETIEN_HEADER_ORANGE} fill="none" stroke="#e75b00"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              vectorEffect="non-scaling-stroke" />
            <path d={ENTRETIEN_HEADER_TAPER_CYAN} fill="#17b9eb" />
            <path d={ENTRETIEN_HEADER_TAPER_ORANGE} fill="#e75b00" />
          </svg>
        )}
      </div>

      {/* LABELMOTO V3.18 : meme coordonnee A/B que le header et le footer. */}
      <svg
        ref={desktopRef}
        aria-hidden="true"
        focusable="false"
        data-labelmoto-road-desktop="true"
        viewBox={desktopSize ? `0 0 ${desktopSize.width} ${desktopSize.height}` : '0 0 1 1'}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      >
        {desktopSize && (
          <g fill="none" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
            <path
              d={labelMotoMainRoad(desktopSize.width, desktopSize.height, LABELMOTO_ROAD_GAP)}
              data-labelmoto-road-color="cyan"
              stroke={LABELMOTO_ROAD_CYAN}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={labelMotoMainRoad(desktopSize.width, desktopSize.height)}
              data-labelmoto-road-color="orange"
              stroke={LABELMOTO_ROAD_ORANGE}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </svg>
    </>
  );
}

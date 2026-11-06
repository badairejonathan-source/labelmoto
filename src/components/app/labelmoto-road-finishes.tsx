'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { usePathname } from 'next/navigation';

/**
 * LABEL MOTO V3.18 : three independent SVGs, one shared pixel coordinate system.
 * The header ends at A (y = 80), the page begins at A and ends at B,
 * and the footer begins at B. No viewport-to-SVG guessing or scrollHeight.
 */
type RoadSize = { width: number; height: number };

export function useLabelMotoRoadSize(ref: RefObject<SVGSVGElement | null>): RoadSize | null {
  const [size, setSize] = useState<RoadSize | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width <= 0 || height <= 0) return;
      setSize((current) => current && Math.abs(current.width - width) < 0.5 && Math.abs(current.height - height) < 0.5
        ? current
        : { width, height });
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(element);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [ref]);

  return size;
}

const round = (n: number) => Math.round(n * 10) / 10;
const endX = (width: number) => width * 0.93;

/**
 * LABEL MOTO V3.19.14 - point B commun au MAIN et au FOOTER desktop.
 * Le main termine en (B.x, height), le footer demarre en (B.x, 0).
 * Meme calcul, aucune modification des courbes ou de leur couleur.
 * Les dimensions/positions DOM doivent encore etre verifiees par page.
 */
export function labelMotoFooterEntry(width: number, offset = 0) {
  return { x: endX(width) + offset, y: 0 };
}


export const LABELMOTO_ROAD_ORANGE = '#e75b00';
export const LABELMOTO_ROAD_CYAN = '#17b9eb';
export const LABELMOTO_ROAD_GAP = -7;

/**
 * LABEL MOTO V3.19.1 - Entree du header desktop plus ample.
 * Point A exporte dans le repere SVG, en pixels reels du header.
 * La future courbe du main doit reprendre ce point et sa tangente.
 * On ne modifie PAS le main et le footer dans ce correctif.
 */
export function labelMotoHeaderExit(width: number, height: number, offset = 0) {
  return {
    x: round(width * 0.30 + offset),
    y: round(height),
    tangentX: 24,
    tangentY: 10,
  } as const;
}

// Le cyan suit le meme dessin, a 7 px sous l'orange dans le header.
// L'ecart revient progressivement vers les sorties existantes au bord bas.
export function labelMotoHeaderRoad(width: number, height: number, offset = 0): string {
  const exit = labelMotoHeaderExit(width, height, offset);
  const separation = offset === LABELMOTO_ROAD_GAP ? 7 : 0;
  const x = (fraction: number) => round(width * fraction + offset);
  const y = (fraction: number) => round(height * fraction);
  return [
    `M ${x(0.024)} ${round(y(0.78) + separation)}`,
    `C ${x(0.070)} ${round(y(0.83) + separation)} ${x(0.115)} ${round(y(0.88) + separation)} ${x(0.163)} ${round(y(0.80) + separation)}`,
    `C ${x(0.208)} ${round(y(0.70) + separation)} ${round(2 * x(0.260) - (exit.x - 32))} ${round(2 * round(y(0.77) + separation * 0.5) - round(exit.y - 16 + separation * 0.2))} ${x(0.260)} ${round(y(0.77) + separation * 0.5)}`,
    `C ${round(exit.x - 32)} ${round(exit.y - 16 + separation * 0.2)} ${round(exit.x - exit.tangentX)} ${round(exit.y - exit.tangentY)} ${exit.x} ${exit.y}`,
  ].join(' ');
}

/**
 * LABEL MOTO V3.19.3 : raccord A exact avec le header V3.19.2.
 * Meme point CSS et meme tangente de sortie (+24, +10).
 * Le main reste un seul chemin sans doublon de depart ; B/footer inchange.
 */
export function labelMotoMainRoad(width: number, height: number, offset = 0): string {
  const entry = labelMotoHeaderExit(width, 80, offset);
  const b = labelMotoFooterEntry(width, offset).x;
  const usable = Math.max(1, height - entry.y);
  const x = (fraction: number) => round(width * fraction + offset);
  const y = (fraction: number) => round(entry.y + usable * fraction);
  const cyan = offset === LABELMOTO_ROAD_GAP;
  const upperGap = cyan ? 7 : 0;
  const lowerGap = cyan ? -7 : 0;
  return [
    `M ${entry.x} ${entry.y}`,
    `C ${round(entry.x + entry.tangentX)} ${round(entry.y + entry.tangentY)} ${x(0.42)} ${round(y(0.16) + upperGap)} ${x(0.59)} ${round(y(0.13) + upperGap)}`,
    `C ${x(0.76)} ${round(y(0.10) + upperGap)} ${x(1.02)} ${y(0.035)} ${x(0.97)} ${y(0.40)}`,
    `C ${x(0.948)} ${y(0.56)} ${x(0.70)} ${round(y(0.54) + lowerGap)} ${x(0.75)} ${round(y(0.68) + lowerGap)}`,
    `C ${x(0.80)} ${round(y(0.82) + lowerGap)} ${round(b)} ${y(0.87)} ${round(b)} ${round(height)}`,
  ].join(' ');
}

export function labelMotoFooterRoad(width: number, height: number, offset = 0): string {
  const b = labelMotoFooterEntry(width, offset).x;
  const x = (fraction: number) => round(width * fraction + offset);
  const y = (fraction: number) => round(height * fraction);
  return [
    `M ${round(b)} 0`,
    `C ${round(b)} ${y(0.11)} ${x(0.955)} ${y(0.20)} ${x(0.955)} ${y(0.27)}`,
    `C ${x(0.955)} ${y(0.35)} ${x(0.77)} ${y(0.32)} ${x(0.73)} ${y(0.41)}`,
    `C ${x(0.68)} ${y(0.51)} ${x(0.69)} ${y(0.60)} ${x(0.71)} ${y(0.69)}`,
    `C ${x(0.73)} ${y(0.78)} ${x(0.81)} ${y(0.89)} ${x(0.85)} ${round(height)}`,
  ].join(' ');
}

/* LABELMOTO V3.19.18b - FOOTER ACCUEIL UNIQUEMENT */
// Le footer d'Entretien et d'Info conserve son dessin actuel.
// Chaque trait de l'accueil suit la meme trajectoire, avec un ecart normal de 7px.
export function labelMotoHomepageFooterRoad(width: number, height: number, offset = 0): string {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const b = labelMotoFooterEntry(w, 0).x;
  type Point = [number, number];
  type Cubic = [Point, Point, Point, Point];
  const curves: Cubic[] = [
    [[b, 0], [b, h * .09], [w * 1.01, h * .17], [w * .985, h * .27]],
    [[w * .985, h * .27], [w * .96, h * .37], [w * .86, h * .42], [w * .78, h * .52]],
    [[w * .78, h * .52], [w * .70, h * .62], [w * .67, h * .75], [w * .77, h * .80]],
    [[w * .77, h * .80], [w * .87, h * .85], [w * .89, h * .95], [w * .93, h]],
  ];
  const fmt = (n: number) => String(Math.round(n * 100) / 100);
  if (offset === 0) {
    return 'M ' + fmt(b) + ' 0 ' + curves.map(c =>
      'C ' + c.slice(1).map(p => fmt(p[0]) + ' ' + fmt(p[1])).join(' ')
    ).join(' ');
  }
  const gap = Math.abs(offset);
  const out: string[] = [];
  for (let i = 0; i < curves.length; i++) {
    const [p0, p1, p2, p3] = curves[i];
    const length = Math.hypot(p1[0]-p0[0],p1[1]-p0[1]) +
      Math.hypot(p2[0]-p1[0],p2[1]-p1[1]) + Math.hypot(p3[0]-p2[0],p3[1]-p2[1]);
    const steps = Math.min(260, Math.max(24, Math.ceil(length / 5)));
    for (let j = i === 0 ? 0 : 1; j <= steps; j++) {
      const t = j / steps, u = 1 - t;
      const x = u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0];
      const y = u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1];
      const dx = 3*u*u*(p1[0]-p0[0]) + 6*u*t*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0]);
      const dy = 3*u*u*(p1[1]-p0[1]) + 6*u*t*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1]);
      const mag = Math.hypot(dx, dy) || 1;
      out.push((out.length ? 'L ' : 'M ') + fmt(x-gap*dy/mag) + ' ' + fmt(y+gap*dx/mag));
    }
  }
  return out.join(' ');
}

function RoadPair({ orange, cyan, opacity = 1, strokeWidth = 1.35 }: { orange: string; cyan: string; opacity?: number; strokeWidth?: number }) {
  return (
    <g fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
      <path d={cyan} stroke={LABELMOTO_ROAD_CYAN} vectorEffect="non-scaling-stroke" />
      <path d={orange} stroke={LABELMOTO_ROAD_ORANGE} vectorEffect="non-scaling-stroke" />
    </g>
  );
}

export function LabelMotoRoadHeaderEntry() {
  const pathname = usePathname();
  const svgRef = useRef<SVGSVGElement>(null);
  const size = useLabelMotoRoadSize(svgRef);
  const orangeExit = size ? labelMotoHeaderExit(size.width, size.height) : null;
  const cyanExit = size ? labelMotoHeaderExit(size.width, size.height, LABELMOTO_ROAD_GAP) : null;
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      data-labelmoto-road="header"
      data-labelmoto-exit-orange={orangeExit ? `${orangeExit.x},${orangeExit.y}` : undefined}
      data-labelmoto-exit-cyan={cyanExit ? `${cyanExit.x},${cyanExit.y}` : undefined}
      viewBox={size ? `0 0 ${size.width} ${size.height}` : '0 0 1 1'}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
    >
      {size && (
        <RoadPair
          cyan={labelMotoHeaderRoad(size.width, size.height, LABELMOTO_ROAD_GAP)}
          orange={labelMotoHeaderRoad(size.width, size.height)}
          opacity={pathname === '/entretien' ? 1 : 0.66}
          strokeWidth={1.35}
        />
      )}
    </svg>
  );
}

export function LabelMotoRoadFooterFinish({ pathname }: { pathname: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const size = useLabelMotoRoadSize(svgRef);
  if (pathname !== '/entretien' && pathname !== '/info' && pathname !== '/') return null;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      viewBox={size ? `0 0 ${size.width} ${size.height}` : '0 0 1 1'}
      preserveAspectRatio="none"
      className={'pointer-events-none absolute inset-0 z-0 h-full w-full'}
    >
      {size && (
        <RoadPair
          cyan={pathname === '/' ? labelMotoHomepageFooterRoad(size.width, size.height, LABELMOTO_ROAD_GAP) : labelMotoFooterRoad(size.width, size.height, LABELMOTO_ROAD_GAP)}
          orange={pathname === '/' ? labelMotoHomepageFooterRoad(size.width, size.height) : labelMotoFooterRoad(size.width, size.height)}
          opacity={pathname === '/entretien' || pathname === '/' ? 1 : 0.66}
        />
      )}
    </svg>
  );
}

/**
 * Geometrie canonique Label Moto : reprise du code de la page Accueil.
 * Source unique pour Accueil, Guides, Entretien et fiches.
 * Ne pas modifier les points pour ajuster une page particuliere.
 */
import { labelMotoHeaderExit, labelMotoFooterEntry } from './labelmoto-road-finishes';

// Fil graphique LABEL MOTO : courbe de Bezier douce issue de points de passage.
export function refinedRoad(points: ReadonlyArray<readonly [number, number]>): string {
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
export function companionRoad(points: ReadonlyArray<readonly [number, number]>, gap: number): Array<[number, number]> {
  return points.map(([x, y], index) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const length = Math.hypot(dx, dy) || 1;
    return [x - gap * dy / length, y + gap * dx / length];
  });
}

export const HOME_POINTS: Array<[number, number]> = [
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

export const HOME_ROAD = refinedRoad(HOME_POINTS);
export const HOME_ROAD_CYAN = refinedRoad(companionRoad(HOME_POINTS, 7));

// Source unique de la geometrie mobile, strictement issue de l'Accueil.
export function homeMobileRoadPoints(renderedHeight: number, viewBoxHeight = 2800): Array<[number, number]> {
  if (!renderedHeight || renderedHeight <= 650) {
    return HOME_POINTS.map(([x, y]) => [x, y * viewBoxHeight / 2800]);
  }
  return alignedMobileRoad(HOME_POINTS, 491, viewBoxHeight, renderedHeight, 6);
}


export const DESKTOP_ROAD_SEGMENTS: Record<'hero' | 'discovery' | 'universe' | 'maintenance' | 'guides' | 'pro', Array<[number, number]>> = {
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

export type HomeDesktopSegment = keyof typeof DESKTOP_ROAD_SEGMENTS;

export function homeDesktopSegmentPaths(segment: HomeDesktopSegment, svgWidth: number, svgHeight: number) {
  const points = DESKTOP_ROAD_SEGMENTS[segment];
  // Le dessin central de chaque section reste celui d'origine.
  const orangePoints = points;
  // Taille indisponible au premier rendu : repli sur le viewBox existant.
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
  return { orange, cyan };
}

'use client';
import { useEffect, useRef, useState } from 'react';

/** LABELMOTO_MAP_ROAD_PAIR_20261110
 * La géométrie orange ci-dessous est recopiée SANS modification du tiroir existant.
 * Le cyan suit la normale au tracé en pixels d'écran : écart constant, même dans les virages.
 * La transformation mobile d'origine (430x733, preserveAspectRatio none) est conservée.
 */
const ORANGE_PATH = [
  'M354 8',
  'C365 102 290 111 313 195',
  'C343 294 415 338 389 446',
  'C369 528 285 549 210 566',
  'C125 584 68 637 75 733',
].join(' ');

export default function MapSidebarRoads({ mobile = false }: { mobile?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const orangeRef = useRef<SVGPathElement>(null);
  const [cyanPath, setCyanPath] = useState('');
  useEffect(() => {
    const svg = svgRef.current;
    const orange = orangeRef.current;
    if (!svg || !orange) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const { width, height } = svg.getBoundingClientRect();
      if (width < 10 || height < 10) return;
      const sx = width / 430;
      const sy = height / 733;
      const length = orange.getTotalLength();
      if (!(length > 0)) return;
      const count = Math.max(100, Math.ceil(length / 2));
      const coords: string[] = [];
      const gap = 7;
      for (let i = 0; i <= count; i++) {
        const distance = (i / count) * length;
        const p = orange.getPointAtLength(distance);
        const before = orange.getPointAtLength(Math.max(0, distance - 0.7));
        const after = orange.getPointAtLength(Math.min(length, distance + 0.7));
        const dx = (after.x - before.x) * sx;
        const dy = (after.y - before.y) * sy;
        const magnitude = Math.hypot(dx, dy) || 1;
        // Décalage normal au chemin dans le repère écran, puis retour au viewBox.
        const x = p.x - (dy / magnitude) * gap / sx;
        const y = p.y + (dx / magnitude) * gap / sy;
        coords.push((i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2));
      }
      const next = coords.join(' ');
      setCyanPath(current => current === next ? current : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(svg);
    return () => { if (frame) cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox="0 0 430 733"
      preserveAspectRatio="none"
      className={mobile
        ? 'pointer-events-none absolute inset-y-0 left-[8%] z-0 h-full w-[104%]'
        : 'pointer-events-none absolute left-0 top-0 z-0 h-[733px] w-full'}
    >
      <path ref={orangeRef} d={ORANGE_PATH} fill="none" stroke="#e75b00"
        strokeWidth={mobile ? 2.2 : 1.35} strokeLinecap="round"
        strokeOpacity={mobile ? 0.21 : 0.38} vectorEffect="non-scaling-stroke" />
      {cyanPath && <path d={cyanPath} fill="none" stroke="#17b9eb"
        strokeWidth={mobile ? 2.2 : 1.35} strokeLinecap="round" strokeLinejoin="round"
        strokeOpacity={mobile ? 0.21 : 0.38} vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

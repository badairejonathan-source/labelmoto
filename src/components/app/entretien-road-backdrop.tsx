'use client';

import { useEffect, useId, useMemo, useRef, useState, type RefObject } from 'react';
import { LABELMOTO_ROAD_CYAN, LABELMOTO_ROAD_ORANGE, useLabelMotoRoadSize } from './labelmoto-road-finishes';
import { canonicalRoadForPage } from './labelmoto-canonical-road-window';

/*
 * Route décorative de la homepage,
 * réutilisée uniquement sur /entretien.
 */

type RoadOcclusion = { x: number; y: number; width: number; height: number };

/* Cache directement les parties de la route situees sous les SURFACES de lecture.
 * Aucun z-index ni halo blanc ne peut invalider ce masque SVG.
 * Les positions suivent le defilement des colonnes et les changements de contenu. */
function useRoadOcclusions(ref: RefObject<SVGSVGElement | null>): RoadOcclusion[] {
  const [areas, setAreas] = useState<RoadOcclusion[]>([]);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let frame = 0;
    let previous = '';
    const measure = () => {
      frame = 0;
      const box = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      if (!box.width || !box.height || !vb.width || !vb.height) return;
      const sx = vb.width / box.width;
      const sy = vb.height / box.height;
      const selectors = [
        '[data-labelmoto-table-surface="true"]',
        '.entretien-desktop-article table',
        '.guides-desktop-article table',
        '[data-labelmoto-mobile-road] table',
        '.entretien-desktop-article blockquote',
        '.guides-desktop-article blockquote',
        '.entretien-desktop-article [class*="bg-brand/5"]',
        '.guides-desktop-article [class*="bg-brand/5"]',
        '[data-labelmoto-conclusion-surface="true"]',
        '.entretien-desktop-article .border-dashed',
        '.guides-desktop-article .border-dashed',
        '.guides-desktop-article div.mt-12.flex.items-center.justify-end',
        'img[alt="Signature"]',
      ];
      const out: RoadOcclusion[] = [];
      const visited = new Set<Element>();
      for (const node of document.querySelectorAll(selectors.join(','))) {
        if (visited.has(node)) continue;
        visited.add(node);
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height || rect.right < box.left || rect.left > box.right || rect.bottom < box.top || rect.top > box.bottom) continue;
        const x1 = Math.max(0, (rect.left - box.left) * sx);
        const y1 = Math.max(0, (rect.top - box.top) * sy);
        const x2 = Math.min(vb.width, (rect.right - box.left) * sx);
        const y2 = Math.min(vb.height, (rect.bottom - box.top) * sy);
        if (x2 > x1 && y2 > y1) out.push({x: x1, y: y1, width: x2 - x1, height: y2 - y1});
      }
      // LABELMOTO_GLYPH_SURFACES_20261109
      // Cache la route sous les lignes de texte (pas sous un fond de page entier).
      // Chaque rectangle est mesure dans le repere du SVG, y compris apres scroll.
      const addRect = (rect: DOMRect | DOMRectReadOnly, pad: number) => {
        if (!rect.width || !rect.height || rect.right < box.left || rect.left > box.right || rect.bottom < box.top || rect.top > box.bottom) return;
        const x1 = Math.max(0, (rect.left - pad - box.left) * sx);
        const y1 = Math.max(0, (rect.top - pad - box.top) * sy);
        const x2 = Math.min(vb.width, (rect.right + pad - box.left) * sx);
        const y2 = Math.min(vb.height, (rect.bottom + pad - box.top) * sy);
        if (x2 > x1 && y2 > y1) out.push({x:x1,y:y1,width:x2-x1,height:y2-y1});
      };
      const scopes = document.querySelectorAll('.entretien-desktop-article, .guides-desktop-article, [data-labelmoto-mobile-road]');
      let textRects = 0;
      for (const scope of scopes) {
        for (const el of scope.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,nav a,nav span')) {
          if (el.closest('[data-labelmoto-table-surface="true"],table,[data-labelmoto-conclusion-surface="true"]')) continue;
          // Pas de grands rectangles autour des paragraphes : ligne par ligne.
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let n: Node | null;
          while ((n = walker.nextNode()) && textRects < 700) {
            if (!n.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(n);
            for (const rect of Array.from(range.getClientRects())) {
              addRect(rect, 3);
              textRects++;
              if (textRects >= 700) break;
            }
          }
        }
        // Masquer toute la surface de l'image, notamment les silhouettes moto.
        for (const img of scope.querySelectorAll('img')) addRect(img.getBoundingClientRect(), 5);
      }
      const signature = JSON.stringify(out.map(v => [v.x, v.y, v.width, v.height].map(n => Math.round(n * 10) / 10)));
      if (signature !== previous) { previous = signature; setAreas(out); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    schedule();
    window.addEventListener('resize', schedule);
    document.addEventListener('scroll', schedule, true);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    const mutation = new MutationObserver(schedule);
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('scroll', schedule, true);
      observer.disconnect();
      mutation.disconnect();
    };
  }, [ref]);
  return areas;
}


// LABELMOTO_RACCORDS_ECRAN_20261109
// Convertit les points des SVG header/footer en coordonnees du SVG principal.
// On ne bouge QUE les extremites du chemin, sur une zone locale de 110 px.
// LABELMOTO_RACCORD_SANS_SEUIL_20261110
// Ancrages calculés depuis les vrais chemins SVG, séparément pour orange et bleu.
type RoadAnchor={x:number;y:number;tx:number;ty:number};
type RoadAnchors={orange?:RoadAnchor;cyan?:RoadAnchor};
function readRoadEndpoint(source:SVGSVGElement,dest:SVGSVGElement,color:'orange'|'cyan'):RoadAnchor|undefined {
  const stroke=color==='orange'?'#e75b00':'#17b9eb';
  const p=Array.from(source.querySelectorAll('path')).find(v=>v.getAttribute('stroke')?.toLowerCase()===stroke);
  const matrix=p?.getScreenCTM(),toDest=dest.getScreenCTM();
  if(!p||!matrix||!toDest)return undefined;
  try {
    const len=p.getTotalLength();if(len<8)return undefined;
    const at=(v:number)=>p.getPointAtLength(v).matrixTransform(matrix).matrixTransform(toDest.inverse());
    const a=at(len-8),b=at(len),m=Math.hypot(b.x-a.x,b.y-a.y)||1;
    return {x:b.x,y:b.y,tx:(b.x-a.x)/m,ty:(b.y-a.y)/m};
  }catch{return undefined}
}
function localRoadJoin(d:string,entry?:RoadAnchor,reference=d):string {
  if(!entry)return d;
  const items=Array.from(d.matchAll(/[ML]\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g));
  if(items.length<12)return d;
  const points=items.map(m=>({x:Number(m[1]),y:Number(m[2])}));
  const ref=Array.from(reference.matchAll(/[ML]\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)).map(m=>({x:Number(m[1]),y:Number(m[2])}));
  if(ref.length!==points.length)return d;
  // Le segment initial de la courbe générique n'a pas le même point de départ.
  // On le coupe localement et crée une transition C1 vers le dessin non déformé.
  let cut=ref.findIndex((p,i)=>i>5&&p.y>=entry.y+165);
  if(cut<6)cut=Math.min(points.length-2,Math.max(6,Math.floor(points.length*.06)));
  const target=points[cut],after=points[cut+1]||target;
  const norm=Math.hypot(after.x-target.x,after.y-target.y)||1;
  const tx=(after.x-target.x)/norm,ty=(after.y-target.y)/norm;
  const span=Math.hypot(target.x-entry.x,target.y-entry.y);
  const handle=Math.min(110,Math.max(30,span*.28));
  const c1={x:entry.x+handle*entry.tx,y:entry.y+handle*entry.ty};
  const c2={x:target.x-handle*tx,y:target.y-handle*ty};
  const round=(x:number)=>String(Math.round(x*100)/100);
  const pos=(p:{x:number;y:number})=>round(p.x)+' '+round(p.y);
  return 'M '+pos(entry)+' C '+pos(c1)+' '+pos(c2)+' '+pos(target)+' '+points.slice(cut+1).map(p=>'L '+pos(p)).join(' ');
}
export default function EntretienRoadBackdrop({ variant = 'info' }: { variant?: 'info' | 'entretien' }) {
  const mobileRef = useRef<SVGSVGElement>(null);
  const mobileSize = useLabelMotoRoadSize(mobileRef);
  // Vue en pixels CSS : aucune redistribution de la hauteur du chemin.
  const mobileRoad = useMemo(() => canonicalRoadForPage('mobile', mobileSize?.height ?? 2800, mobileSize?.width ?? 430), [mobileSize?.height, mobileSize?.width]);
  const desktopRef = useRef<SVGSVGElement>(null);
  const desktopSize = useLabelMotoRoadSize(desktopRef);
  const desktopRoad = useMemo(() => canonicalRoadForPage('desktop', desktopSize?.height ?? 6000, desktopSize?.width ?? 1600), [desktopSize?.height, desktopSize?.width]);
  const [anchors,setAnchors]=useState<RoadAnchors>({});
  useEffect(()=>{
    const svg=desktopRef.current;
    if (!svg || !desktopSize) return;
    let frame=0;
    const measure=()=>{
      frame=0;
      const header=document.querySelector('svg[data-labelmoto-road="header"]') as SVGSVGElement | null;
      const footer=Array.from(document.querySelectorAll('footer svg')).find(node=>
        Array.from(node.querySelectorAll('path')).some(p=>p.getAttribute('stroke')?.toLowerCase()==='#e75b00')) as SVGSVGElement | undefined;
      if(!header || !footer) return;
      const next:RoadAnchors={
        orange:readRoadEndpoint(header,svg,'orange'),
        cyan:readRoadEndpoint(header,svg,'cyan'),
      };
      const q=(p?:RoadAnchor)=>p?`${Math.round(p.x*10)/10},${Math.round(p.y*10)/10}`:'?';
      setAnchors(current=>q(current.orange)===q(next.orange)&&q(current.cyan)===q(next.cyan)?current:next);
    };
    const schedule=()=>{if(!frame) frame=requestAnimationFrame(measure);};
    schedule();
    window.addEventListener('resize',schedule);
    const observer=new ResizeObserver(schedule);
    observer.observe(svg);
    const header=document.querySelector('svg[data-labelmoto-road="header"]');
    if(header) observer.observe(header);
    const footer=document.querySelector('footer');
    if(footer) observer.observe(footer);
    return()=>{if(frame) cancelAnimationFrame(frame);window.removeEventListener('resize',schedule);observer.disconnect();};
  },[desktopSize]);
  const alignedDesktopRoad=useMemo(()=>({
    orange:localRoadJoin(desktopRoad.orange,anchors.orange,desktopRoad.orange),
    cyan:localRoadJoin(desktopRoad.cyan,anchors.cyan,desktopRoad.orange),
  }),[desktopRoad,anchors]);
  const mobileOcclusions = useRoadOcclusions(mobileRef);
  const desktopOcclusions = useRoadOcclusions(desktopRef);
  const stableId = useId().replace(/:/g, '');
  const mobileMaskId = `lm-mask-mobile-${stableId}`;
  const desktopMaskId = `lm-mask-desktop-${stableId}`;
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
      aria-hidden="true"
      viewBox={`0 0 430 ${mobileSize?.height ?? 2800}`}
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

      <defs><mask id={mobileMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="430" height={mobileSize?.height ?? 2800}>
        <rect width="430" height={mobileSize?.height ?? 2800} fill="white" />
        {mobileOcclusions.map((area, i) => <rect key={i} {...area} fill="black" />)}
      </mask></defs>
      <g mask={`url(#${mobileMaskId})`}>
      {/* Trait bicolore dessine en Bezier, sous le contenu. */}
      <path
        d={mobileRoad.cyan}
        fill="none"
        stroke="#17b9eb"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={mobileRoad.orange}
        fill="none"
        stroke="#e75b00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      </g>
</svg>

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
          <defs><mask id={desktopMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={desktopSize.width} height={desktopSize.height}>
            <rect width={desktopSize.width} height={desktopSize.height} fill="white" />
            {desktopOcclusions.map((area, i) => <rect key={i} {...area} fill="black" />)}
          </mask></defs>
        )}
        {desktopSize && (
          <g mask={`url(#${desktopMaskId})`} fill="none" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
            <path
              d={alignedDesktopRoad.cyan}
              data-labelmoto-road-color="cyan"
              stroke={LABELMOTO_ROAD_CYAN}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={alignedDesktopRoad.orange}
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

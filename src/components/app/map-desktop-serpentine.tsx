'use client';
import { useEffect, useRef, useState } from 'react';
import { labelMotoHeaderExit } from '@/components/app/labelmoto-road-finishes';

/** LABELMOTO_MAP_SKETCH_SERPENTINE_20261110
 * Reproduction vectorielle du croquis: sortie du header partagé, boucle haute
 * à droite des filtres, grand retour à gauche, serpentine basse vers la pub.
 * Tracé spécifique CARTE DESKTOP, non copié sur Entretien et Guides.
 * Repère écran non étiré: la page plus basse recadre (clip), sans scaleY.
 */
type Point = { x: number; y: number };
type Cubic = [Point, Point, Point, Point];
const fmt=(n:number)=>Number(n.toFixed(2));
function evaluate([a,b,c,d]:Cubic,t:number):Point {
 const u=1-t;
 return {x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,
         y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};
}
function derivative([a,b,c,d]:Cubic,t:number):Point {
 const u=1-t;
 return {x:3*u*u*(b.x-a.x)+6*u*t*(c.x-b.x)+3*t*t*(d.x-c.x),
         y:3*u*u*(b.y-a.y)+6*u*t*(c.y-b.y)+3*t*t*(d.y-c.y)};
}
function serpentine(width:number,height:number) {
 const w=Math.max(1024,width);
 const start=labelMotoHeaderExit(width,80,0);
 const a={x:start.x,y:80};
 // Les positions principales suivent le croquis; les Y restent en vrais pixels.
 const p1={x:Math.min(w*.36,620),y:290};
 const p2={x:Math.max(92,Math.min(120,w*.075)),y:610};
 const p3={x:Math.min(w*.32,550),y:622};
 const p4={x:Math.min(w*.53,930),y:674};
 const curves:Cubic[]=[
  [a,{x:a.x+24,y:90},{x:Math.min(w*.39,680),y:182},p1],
  [p1,{x:Math.min(w*.38,655),y:430},{x:Math.max(95,w*.06),y:493},p2],
  [p2,{x:p2.x+55,y:735},{x:p3.x-130,y:555},p3],
  [p3,{x:p3.x+100,y:614},{x:p4.x-110,y:720},p4],
 ];
 // LABELMOTO_MAP_FULL_HEIGHT_CONTINUATION_20261110
 // La serpentine validée (ses 4 courbes initiales) reste strictement inchangée.
 // On prolonge seulement la sortie p4 jusqu'en dessous du bas de la fenêtre.
 // Le premier contrôle conserve la tangente sortante du 4e segment : C1.
 // Le deuxième dessine un retour doux, sans segment rectiligne ajouté.
 const bottom=Math.max(height+48,p4.y+110);
 const endX=Math.min(w*.68,w-65);
 curves.push([
  p4,
  {x:p4.x+110,y:p4.y-46},
  {x:Math.min(w-60,endX+140),y:Math.max(p4.y+155,bottom-185)},
  {x:endX,y:bottom}
 ]);
 const orange='M '+fmt(a.x)+' '+fmt(a.y)+' '+curves.map(c=>
  'C '+c.slice(1).map(p=>fmt(p.x)+' '+fmt(p.y)).join(' ')).join(' ');
 const points:Point[]=[];
 for(let i=0;i<curves.length;i++) {
  const c=curves[i];
  for(let j=(i===0?0:1);j<=125;j++) {
   const t=j/125,p=evaluate(c,t),d=derivative(c,t),m=Math.hypot(d.x,d.y)||1;
   // LABELMOTO_JOIN_NORMAL_7PX_20261110: même normale à 7 px que le header canonique.
   // Pas de transition x-7/y=80 qui créait une pointe au raccord.
   points.push({x:p.x-7*d.y/m,y:p.y+7*d.x/m});
  }
 }
 const cyan=points.map((p,i)=>(i?'L ':'M ')+fmt(p.x)+' '+fmt(p.y)).join(' ');
 return {orange,cyan};
}
export default function MapDesktopSerpentine() {
 const ref=useRef<SVGSVGElement>(null);
 const [size,setSize]=useState({width:0,height:0});
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const update=()=>{
   const r=el.getBoundingClientRect();
   const width=r.width,height=r.height;
   setSize(old=>Math.abs(old.width-width)<.5&&Math.abs(old.height-height)<.5?old:{width,height});
  };
  update();const ro=new ResizeObserver(update);ro.observe(el);return()=>ro.disconnect();
 },[]);
 const d=size.width>0&&size.height>0?serpentine(size.width,size.height):null;
 return <svg ref={ref} aria-hidden="true" focusable="false"
   data-labelmoto-map-serpentine="desktop"
   viewBox={size.width&&size.height?`0 0 ${size.width} ${size.height}`:'0 0 1 1'}
   preserveAspectRatio="xMinYMin meet"
   className="pointer-events-none absolute left-0 top-0 z-[900] hidden h-[100dvh] w-full overflow-hidden lg:block"
 >
  {d&&<g fill="none" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
    <path d={d.orange} stroke="#e75b00" vectorEffect="non-scaling-stroke" />
    <path d={d.cyan} stroke="#17b9eb" vectorEffect="non-scaling-stroke" />
  </g>}
 </svg>;
}

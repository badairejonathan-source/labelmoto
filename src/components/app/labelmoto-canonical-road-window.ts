/**
 * Copie de la trajectoire Accueil. Unités verticales physiques, jamais redistribuées.
 * La hauteur de page détermine la coupe, pas les points de Bézier.
 */
import { HOME_POINTS, homeDesktopSegmentPaths, refinedRoad } from './labelmoto-home-road-reference';

type Point = { x: number; y: number };
type Cubic = { p0: Point; p1: Point; p2: Point; p3: Point };
const fmt = (x: number) => String(Math.round(x * 100) / 100);
const lerp = (a: Point,b:Point,t:number):Point => ({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
const cubic = (c:Cubic,t:number):Point => {
  const u=1-t;
  return {x:u*u*u*c.p0.x+3*u*u*t*c.p1.x+3*u*t*t*c.p2.x+t*t*t*c.p3.x,
    y:u*u*u*c.p0.y+3*u*u*t*c.p1.y+3*u*t*t*c.p2.y+t*t*t*c.p3.y};
};
function parseCubicPath(d:string,dy=0): Cubic[] {
  const parts=d.trim().split(/\s+C\s+/);
  if(!parts[0].startsWith('M ')) throw Error('Tracé accueil invalide');
  const start=parts[0].slice(2).trim().split(/\s+/).map(Number);
  if(start.length!==2) throw Error('Départ accueil invalide');
  let prev={x:start[0],y:start[1]+dy};
  return parts.slice(1).map((part)=>{
    const n=part.trim().split(/\s+/).map(Number);
    if(n.length!==6 || n.some(v=>!Number.isFinite(v))) throw Error('Courbe Bézier accueil invalide');
    const c:Cubic={p0:prev,p1:{x:n[0],y:n[1]+dy},p2:{x:n[2],y:n[3]+dy},p3:{x:n[4],y:n[5]+dy}};
    prev=c.p3; return c;
  });
}
const desktopParts = ['hero','discovery','universe','maintenance','guides','pro'] as const;
// Points et Bézier ORIGINAUX de l'accueil : repère fixe de 1600 × 1000 par section.
const desktopCurves:Cubic[] = desktopParts.flatMap((segment,i)=>parseCubicPath(homeDesktopSegmentPaths(segment,1600,1000).orange,i*1000));
// L'amorce physique mobile correspond à l'accueil sous le logo.
const mobileEntry: Array<[number,number]> = [[44,80],[145,80],[275,86],[365,140],[405,255],[408,500]];
const mobilePoints: Array<[number,number]> = [...mobileEntry,...HOME_POINTS.slice(6)];
const mobileCurves = parseCubicPath(refinedRoad(mobilePoints));

function sample(curves:Cubic[],step=6):Point[] {
  const out: Point[]=[];
  for(const c of curves){
    const length=Math.hypot(c.p1.x-c.p0.x,c.p1.y-c.p0.y)+Math.hypot(c.p2.x-c.p1.x,c.p2.y-c.p1.y)+Math.hypot(c.p3.x-c.p2.x,c.p3.y-c.p2.y);
    const count=Math.max(12,Math.ceil(length/step));
    for(let j=(out.length?1:0);j<=count;j++) out.push(cubic(c,j/count));
  }
  return out;
}
const desktopReference=sample(desktopCurves);
const mobileReference=sample(mobileCurves);
function crop(points:Point[],maxY:number):Point[] {
  const out:Point[]=[];
  for(const p of points){
    if(p.y>maxY){
      if(out.length){
        const prev=out[out.length-1];
        const t=(maxY-prev.y)/(p.y-prev.y);
        out.push(lerp(prev,p,Math.max(0,Math.min(1,t))));
      }
      break;
    }
    out.push(p);
  }
  return out;
}
// Interruption au point de coupe. Si la page est plus longue que l'Accueil,
// on prolonge la tangente terminale, sans répéter des zigzags canoniques.
function continueToY(points:Point[],targetY:number):Point[] {
  const out=[...points];
  const last=out[out.length-1];
  if(!last || last.y>=targetY) return out;
  const before=out[Math.max(0,out.length-12)] || last;
  const dy=Math.max(1,last.y-before.y);
  const slope=(last.x-before.x)/dy;
  const steps=Math.max(1,Math.ceil((targetY-last.y)/8));
  for(let i=1;i<=steps;i++){
    const y=last.y+(targetY-last.y)*i/steps;
    out.push({x:last.x+slope*Math.min(110,y-last.y),y});
  }
  return out;
}
function centerLine(kind:'mobile'|'desktop',height:number):Point[] {
  const w=kind==='mobile'?430:1600;
  const ref=kind==='mobile'?mobileReference:desktopReference;
  const endpointX=w*.93;
  // Petit raccord local au footer. On réserve plus si le point canonique est éloigné.
  let reserve=Math.min(height*.48,kind==='mobile'?160:240);
  for(let i=0;i<4;i++){
    const cutY=Math.max(95,height-reserve);
    const near=crop(ref,cutY);
    const p=near[near.length-1]||ref[0];
    const necessary=Math.abs(endpointX-p.x)*.75;
    reserve=Math.min(height*.58,Math.max(kind==='mobile'?110:170,necessary));
  }
  const joinY=Math.max(95,height-reserve);
  const kept=continueToY(crop(ref,joinY),joinY);
  const tail=kept[kept.length-1];
  if(!tail || tail.y>=height-5) return kept;
  const prev=kept[Math.max(0,kept.length-5)]||tail;
  const tangentX=tail.x-prev.x, tangentY=Math.max(1,tail.y-prev.y);
  const normalized=Math.hypot(tangentX,tangentY)||1;
  const remaining=height-tail.y;
  const c:Cubic={p0:tail,
    p1:{x:tail.x+tangentX/normalized*Math.min(remaining*.38,125), y:tail.y+tangentY/normalized*Math.min(remaining*.38,125)},
    p2:{x:endpointX, y:height-Math.min(95,remaining*.3)},
    p3:{x:endpointX,y:height}};
  const count=Math.max(18,Math.ceil((remaining+Math.abs(endpointX-tail.x))/7));
  for(let i=1;i<=count;i++) kept.push(cubic(c,i/count));
  return kept;
}
function paths(points:Point[],widthScale:number,gap=7):{orange:string;cyan:string} {
  const round=(p:Point)=>fmt(p.x)+' '+fmt(p.y);
  // Écart normal calculé en unités PHYSIQUES, bleu et orange issus d'UNE ligne.
  const cyan=points.map((p,i)=>{
    const a=points[Math.max(0,i-2)],b=points[Math.min(points.length-1,i+2)];
    const vx=(b.x-a.x)*widthScale,vy=b.y-a.y;
    const len=Math.hypot(vx,vy)||1;
    return {x:p.x-gap*(vy/len)/widthScale,y:p.y+gap*vx/len};
  });
  const join=(arr:Point[])=>arr.map((p,i)=>(i?'L ':'M ')+round(p)).join(' ');
  return {orange:join(points),cyan:join(cyan)};
}
export function canonicalRoadForPage(kind:'mobile'|'desktop',height:number,actualWidth:number){
  const referenceWidth=kind==='mobile'?430:1600;
  if(!Number.isFinite(height)||height<120) return {orange:'',cyan:''};
  const points=centerLine(kind,height);
  if(kind==='mobile') {
    // Mobile inchangé : viewBox 430 et CSS adaptent déjà les X automatiquement.
    return paths(points,Math.max(1,actualWidth)/referenceWidth);
  }
  // LABELMOTO_ALIGN_DESKTOP_1600_VERS_CSS_20261109
  // Les points desktop sont définis dans le repère de l'accueil à 1600 px.
  // Le viewBox du composant desktop utilise la largeur réelle de l'écran :
  // convertir chaque X dans ce repère, SANS modifier les Y ni la forme verticale.
  // Appliquer le décalage cyan APRÈS conversion, en pixels CSS réels.
  const factor=Math.max(1,actualWidth)/referenceWidth;
  const actualPoints=points.map(p=>({x:p.x*factor,y:p.y}));
  return paths(actualPoints,1);
}

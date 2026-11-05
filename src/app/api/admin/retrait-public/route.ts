import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { revalidatePath } from 'next/cache';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { previewPublicRemoval, withdrawPublic, validateTarget } from '@/lib/pro-public-withdrawal';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const noStore={'Cache-Control':'no-store'};
const err=(message:string,status:number)=>NextResponse.json({ok:false,error:message},{status,headers:noStore});
// La création de cette route ne l'active pas. Aucun appel depuis l'interface par défaut.
export async function POST(req:NextRequest){
  // Le coupe-circuit est contrôlé AVANT tout accès Firebase, même l'authentification.
  let input:Record<string,unknown>;
  try {input=await req.json()} catch{return err('JSON invalide',400)}
  if(!input || typeof input!=='object' || Array.isArray(input)) return err('Requête invalide',400);
  if(input.action!=='preview' && input.action!=='apply') return err('Action invalide',400);
  if(input.action==='apply' &&
    (process.env.LABELMOTO_PUBLIC_REMOVAL!=='ENABLED' || process.env.LABELMOTO_INDEX_WRITES_V23!=='ENABLED'))
    return err('Retrait public encore désactivé',403);
  let target;
  try {target=validateTarget(input.collection,input.id)}catch{return err('Cible invalide',400)}
  const auth=req.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')) return err('Authentification requise',401);
  let caller;
  try {caller=await getAdminAuth().verifyIdToken(auth.slice(7).trim(),true)}
  catch{return err('Session invalide ou révoquée',401)}
  const db=getAdminFirestore();
  const user=await db.collection('users').doc(caller.uid).get();
  if(!user.exists || user.get('role')!=='admin') return err('Droits administrateur requis',403);
  if(input.action==='apply' && input.confirm!==`RETIRER_PUBLIC:${target.collection}/${target.id}`)
    return err('Confirmation exacte manquante',400);
  // Motif explicite pour le journal privé, sans commentaire libre ni PII.
  if(input.action==='apply' && input.reason!=='owner_request' && input.reason!=='other')
    return err('Motif de retrait requis',400);
  try{
    const bucket=admin.storage().bucket('studio-4801889514-40ebd.firebasestorage.app');
    if(input.action==='preview'){
      const plan=await previewPublicRemoval(db,bucket,target);
      return NextResponse.json({ok:true,...plan},{headers:noStore});
    }
    const result=await withdrawPublic(db,bucket,target,caller.uid,input.reason as 'owner_request'|'other');
    // Invalidation de pages dynamiques : ce n'est pas une preuve de purge CDN.
    let revalidationIncomplete=false;
    for(const path of [`/${target.collection}/${target.id}`,
      result.report.slug?`/${target.collection}/${result.report.slug}`:null,
      '/map','/sitemap.xml']){
      if(path) try { revalidatePath(path); } catch { revalidationIncomplete=true; }
    }
    return NextResponse.json({...result,revalidationIncomplete},{status:207,headers:noStore});
  }catch(e){
    console.error('[RETRAIT PUBLIC] Opération arrêtée, vérification manuelle requise',e);
    return err('Opération non certifiée. Vérifier le verrou, la sauvegarde et les index avant toute nouvelle tentative.',409);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { isServerAdmin } from '@/lib/server-admin-permissions';
import { validateTarget, withdrawPublic } from '@/lib/pro-public-withdrawal';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
const failure=(error:string,status:number)=>NextResponse.json({ok:false,error},{status,headers});
const SAFE_ID=/^[A-Za-z0-9_.-]{1,200}$/;

export async function POST(request:NextRequest){
  // Aucune tentative d'écriture tant que les garde-fous existants sont coupés.
  // Le nettoyage global des références doit être certifié séparément avant
  // d'activer cette nouvelle voie de suppression après fusion.
  if(process.env.LABELMOTO_FUSION_ERASURE!=='ENABLED')
    return failure('Suppression après fusion non activée : nettoyage global à certifier.',409);
  if(process.env.LABELMOTO_PUBLIC_REMOVAL!=='ENABLED' || process.env.LABELMOTO_INDEX_WRITES_V23!=='ENABLED')
    return failure('Retrait sécurisé désactivé : intervention administrateur nécessaire.',409);
  let input:Record<string,unknown>;
  try { input=await request.json(); } catch {return failure('Requête invalide',400);}
  if(!input || !SAFE_ID.test(String(input.submissionId||'')) || !SAFE_ID.test(String(input.historyId||'')))
    return failure('Identifiants invalides',400);
  const authorization=request.headers.get('authorization')||'';
  if(!authorization.startsWith('Bearer '))return failure('Authentification requise',401);
  let caller;
  try {caller=await getAdminAuth().verifyIdToken(authorization.slice(7).trim(),true);}
  catch {return failure('Session expirée',401);}
  const db=getAdminFirestore();
  if(!(await isServerAdmin(db,caller)))return failure('Administrateur requis',403);
  const uid=caller.uid;
  const submissionRef=db.collection('listing_submissions').doc(String(input.submissionId));
  const historyRef=db.collection('listing_history').doc(String(input.historyId));
  const [submission,history]=await Promise.all([submissionRef.get(),historyRef.get()]);
  if(!submission.exists || !history.exists)return failure('Soumission ou historique introuvable',404);
  const s=submission.data()||{}, h=history.data()||{};
  if(s.status!=='published' || !s.publishedCollection || !s.publishedDocId ||
     h.eventType!=='merge_new_published' || h.submissionId!==submission.id ||
     h.oldRemovalRequested!==true || h.oldRemovalStatus!=='pending' ||
     h.targetCollection!==s.publishedCollection || h.targetId!==s.publishedDocId ||
     h.actorUid!==uid)
    return failure('Opération non autorisée ou déjà traitée',409);
  let old;
  try {old=validateTarget(h.sourceCollection,h.sourceId);}catch{return failure('Ancienne fiche invalide',400);}
  if(old.collection===s.publishedCollection && old.id===s.publishedDocId)
    return failure('Une fiche ne peut pas se supprimer elle-même',409);
  const target=await db.collection(String(s.publishedCollection)).doc(String(s.publishedDocId)).get();
  if(!target.exists)return failure('La nouvelle fiche n’existe plus',409);
  try {
    const bucket=admin.storage().bucket('studio-4801889514-40ebd.firebasestorage.app');
    const outcome=await withdrawPublic(db,bucket,old,uid,'other');
    if(!outcome.publicFirestoreAndIndexesRemoved || !outcome.publicLiveCacheRemoved)
      throw new Error('Retrait incomplet');
    // Mode A : retrait public uniquement. Ne pas effacer les archives de secours
    // ni les données internes : elles nécessitent un traitement distinct.
    const backupRef=db.collection('admin_public_withdrawal_backups').doc(`${old.collection}__${old.id}`);
    const backup=await backupRef.get();
    if(!backup.exists || backup.get('status')!=='public_source_removed')
      throw new Error('Sauvegarde de retrait non certifiée');
    await historyRef.update({oldRemovalStatus:'sources_removed_to_verify',
      oldRemovalScope:'public_only',oldRemovalAt:Date.now()});
    return NextResponse.json({ok:true,status:'sources_removed_to_verify'},{headers});
  } catch(error){
    console.error('[LABELMOTO FUSION] Suppression incomplète',error);
    // Préserver l'état « pending » si l'opération n'est pas certifiée.
    return failure('Retrait incomplet : consulter le journal de suppression avant de reprendre.',409);
  }
}

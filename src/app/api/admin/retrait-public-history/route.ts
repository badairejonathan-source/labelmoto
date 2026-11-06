import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { WITHDRAWAL_HISTORY_COLLECTION, toWithdrawalHistoryView } from '@/lib/pro-public-withdrawal-history';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store, max-age=0'};
const error=(message:string,status:number)=>NextResponse.json({ok:false,error:message},{status,headers});

/** Chargement SUR DEMANDE uniquement. Maximum vingt entrées, jamais de scan intégral. */
export async function GET(req:NextRequest){
 const token=req.headers.get('authorization')||'';
 if(!token.startsWith('Bearer ')) return error('Authentification requise',401);
 let uid:string;
 try{uid=(await getAdminAuth().verifyIdToken(token.slice(7).trim(),true)).uid;}
 catch{return error('Session invalide',401);}
 try{
  const db=getAdminFirestore();
  const user=await db.collection('users').doc(uid).get();
  if(!user.exists||user.get('role')!=='admin') return error('Droits administrateur requis',403);
  const snap=await db.collection(WITHDRAWAL_HISTORY_COLLECTION)
   .orderBy('createdAt','desc').limit(20).get();
  const entries=snap.docs.map(d=>toWithdrawalHistoryView(d.id,d.data())).filter((e):e is NonNullable<typeof e>=>e!==null);
  return NextResponse.json({ok:true,entries,limit:20,complete:false},{headers});
 }catch{
  return error('Historique indisponible, aucune modification effectuée',503);
 }
}

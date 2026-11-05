/**
 * Retrait ciblé des photos publiées par le système image_requests.
 * Jamais de list() Storage, ni requête Firestore sans borne, ni suppression par userId.
 * L'image legacy n'est éligible que si elle est encore l'imageUrl EXACTE de la fiche.
 * Ce module ne prétend pas couvrir des médias non référencés dans la fiche.
 */
import { createHash } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import type { BucketLike, Target } from '@/lib/pro-public-withdrawal';
import { PRO_COLLECTIONS } from '@/lib/pro-index-prune';

const SAFE = /^[a-zA-Z0-9_.-]{1,200}$/;
const MAX_REQUESTS = 20;
const MAX_REMOVALS = 5;
const MAX_BYTES = 5 * 1024 * 1024;
export type MediaItem = {
  requestId: string;
  requestUpdatedMs: number | null;
  path: string;
  url: string;
  generation: string;
  size: number;
  status: string;
};
export type MediaPlan = {
  summary: {
    urlsFiche: number; urlsSousControleLabelMoto: number;
    demandesImagesLiees: number; demandesActivesAExaminer: number;
    verificationIncomplete: boolean; retraitBloque: boolean;
    mediasSupprimables: number;
  };
  items: MediaItem[];
};
const asRecord = (data:unknown): Record<string,unknown> => data && typeof data==='object' && !Array.isArray(data)
  ? data as Record<string,unknown> : {};
const digest = (bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
function hosted(url:string) {
  try {
    const u=new URL(url);
    return ['http:','https:'].includes(u.protocol) &&
      (['firebasestorage.googleapis.com','storage.googleapis.com','labelmoto.fr','www.labelmoto.fr'].includes(u.hostname.toLowerCase())
      || u.hostname.toLowerCase().endsWith('.firebasestorage.app'));
  }catch {return false;}
}
/** Seules les URL tokenisées de CE bucket et de CE chemin sont admissibles. */
export function exactFirebasePath(url:string,bucketName:string):string|null {
  try {
    const u=new URL(url);
    if(u.protocol!=='https:' || u.hostname!=='firebasestorage.googleapis.com'
      || u.searchParams.get('alt')!=='media' || !u.searchParams.get('token')) return null;
    const prefix=`/v0/b/${bucketName}/o/`;
    if(!u.pathname.startsWith(prefix)) return null;
    const encoded=u.pathname.slice(prefix.length);
    if(!encoded || encoded.includes('/')) return null;
    const decoded=decodeURIComponent(encoded);
    return decoded.startsWith('pending_images/') ? decoded : null;
  }catch {return null;}
}
function safePath(path:string,userId:unknown):boolean {
  if(typeof userId!=='string' || !SAFE.test(userId) || typeof path!=='string') return false;
  const pieces=path.split('/');
  return pieces.length===3 && pieces[0]==='pending_images' && pieces[1]===userId
    && SAFE.test(pieces[2]);
}
function getSlug(data:Record<string,unknown>,target:Target) {
  return typeof data.slug==='string' && SAFE.test(data.slug) ? data.slug : target.id;
}
function imageUrls(data:Record<string,unknown>) {
  const values=new Set<string>();
  const collect=(obj:unknown, depth:number, prefix:string)=>{
    if(depth>3 || !obj || typeof obj!=='object')return;
    if(Array.isArray(obj)){for(const v of obj.slice(0,30))collect(v,depth+1,prefix);return;}
    for(const [key,value] of Object.entries(obj as Record<string,unknown>)){
      const next=prefix?prefix+'.'+key:key;
      if(typeof value==='string' && /(^|\.|_)(image|img|photo|logo|picture|avatar|banner|cover)/i.test(next)
         && /^https?:\/\//i.test(value)) values.add(value);
      else if(value && typeof value==='object')collect(value,depth+1,next);
    }
  };
  collect(data,0,'');
  return Array.from(values).sort();
}
/**
 * Lecture bornée : 21 demandes par slug, 21 par identifiant, au plus 2 références
 * au chemin et au plus 2 fiches par collection pour chaque URL.
 */
export async function inspectPublicMedia(db:Firestore,bucket:BucketLike,target:Target,data:Record<string,unknown>):Promise<MediaPlan> {
  const urls=imageUrls(data), hostedUrls=urls.filter(hosted);
  const slug=getSlug(data,target);
  const [bySlug,byId]=await Promise.all([
    db.collection('image_requests').where('concessionSlug','==',slug).limit(MAX_REQUESTS+1).get(),
    db.collection('image_requests').where('targetId','==',target.id).limit(MAX_REQUESTS+1).get(),
  ]);
  const incomplete=bySlug.size>MAX_REQUESTS || byId.size>MAX_REQUESTS;
  const byKey=new Map<string,typeof bySlug.docs[number]>();
  for(const snap of [...bySlug.docs,...byId.docs])byKey.set(snap.id,snap);
  const records=[...byKey.values()];
  let unresolved=incomplete || records.length>MAX_REQUESTS;
  const items:MediaItem[]=[];
  const accounted=new Set<string>();
  // Refus de regarder plus de 20 demandes même si les deux requêtes recouvrent
  // plusieurs ensembles ; l'aperçu n'est alors pas réputé exhaustif.
  if(!unresolved){
    for(const request of records){
      const req=asRecord(request.data());
      // Une collision de slug avec une autre fiche est toujours ambiguë.
      const byExplicit=req.targetCollection===target.collection && req.targetId===target.id;
      const bySlugOnly=req.targetCollection==null && req.targetId==null && req.concessionSlug===slug;
      const legacy=bySlugOnly && req.imageUrl===data.imageUrl;
      const path=typeof req.approvedStoragePath==='string' ? req.approvedStoragePath :
        typeof req.storagePath==='string' ? req.storagePath : '';
      const url=typeof req.imageUrl==='string'?req.imageUrl:'';
      if(!byExplicit && !bySlugOnly){unresolved=true;continue;}
      if(!safePath(path,req.userId) || exactFirebasePath(url,bucket.name)!==path){unresolved=true;continue;}
      if(req.status==='rejected' && req.storageDeletionConfirmed===true){
        // Pas de suppression : l'absence du fichier est vérifiée physiquement.
        const [exists]=await bucket.file(path).exists();
        if(exists){unresolved=true;continue;}
        accounted.add(url);
        continue;
      }
      if(req.status!=='approved'){unresolved=true;continue;}
      // Les anciennes approbations n'ont pas d'ID fiche : seule l'image courante
      // permet une mise en correspondance non équivoque.
      if(legacy && data.imageUrl!==url){unresolved=true;continue;}
      // Référence partagée dans image_requests -> STOP, même si mêmes slugs.
      const samePath=await db.collection('image_requests').where('storagePath','==',path).limit(2).get();
      if(samePath.size!==1 || samePath.docs[0].id!==request.id){unresolved=true;continue;}
      // Champs publiquement affichables connus du projet ; aucune requête sans borne.
      // Cela ne couvre pas des références arbitraires hors de ces champs :
      // elles exigent une vérification distincte avant une certification globale.
      let crossLinked=false;
      for(const collectionName of PRO_COLLECTIONS){
        for(const field of ['imageUrl','photoUrl','photo','logoUrl','coverUrl']){
          const refs=await db.collection(collectionName).where(field,'==',url).limit(2).get();
          if(refs.docs.some(d=>collectionName!==target.collection || d.id!==target.id)){
            crossLinked=true;break;
          }
        }
        if(crossLinked)break;
      }
      if(crossLinked){unresolved=true;continue;}
      const file=bucket.file(path);
      const [exists]=await file.exists();
      if(!exists){unresolved=true;continue;}
      const [metadata]=await file.getMetadata();
      const size=Number(metadata.size);
      if(!metadata.generation || !Number.isFinite(size) || size<0 || size>MAX_BYTES){unresolved=true;continue;}
      // Il ne suffit pas de citer un slug : l'identité du bucket, du chemin, de
      // l'URL et de l'ID de demande doivent tous correspondre.
      accounted.add(url);
      items.push({requestId:request.id,requestUpdatedMs:request.updateTime?.toMillis()??null,
        path,url,generation:String(metadata.generation),size,status:String(req.status)});
    }
  }
  if(hostedUrls.some(u=>!accounted.has(u)) || items.length>MAX_REMOVALS)unresolved=true;
  return {
    summary:{urlsFiche:urls.length,urlsSousControleLabelMoto:hostedUrls.length,
      demandesImagesLiees:records.length,demandesActivesAExaminer:unresolved?records.length:0,
      verificationIncomplete:incomplete||records.length>MAX_REQUESTS,retraitBloque:unresolved,
      mediasSupprimables:items.length},
    items:unresolved?[]:items,
  };
}
/** Vérification d'absence de références restantes dans les deux index déjà lus. */
export function sharedInIndexes(indexArrays:unknown[],items:MediaItem[]):boolean {
  for(const raw of indexArrays){
    if(!Array.isArray(raw))return true;
    for(const entry of raw){
      const serialized=JSON.stringify(entry);
      if(items.some(item=>serialized.includes(item.url)))return true;
    }
  }
  return false;
}
/**
 * Sauvegarde binaire privée : PAS de token download dans les métadonnées copie.
 * En cas d'échec après une première écriture, le verrou doit imposer review_required.
 */
export async function retirePublicMedia(db:Firestore,bucket:BucketLike,target:Target,items:MediaItem[],assertHeld:()=>Promise<void>){
  const results: {requestId:string;path:string;backupPath:string;sha256:string}[]=[];
  for(const item of items){
    await assertHeld();
    const original=bucket.file(item.path);
    const [meta]=await original.getMetadata();
    if(String(meta.generation)!==item.generation || Number(meta.size)!==item.size)
      throw new Error('PUBLIC_REMOVAL_MEDIA_CHANGED');
    const [bytes]=await original.download();
    if(bytes.length!==item.size)throw new Error('PUBLIC_REMOVAL_MEDIA_SIZE_CHANGED');
    const hash=digest(bytes);
    // Une sauvegarde privée par source exacte, sans copie de metadata de token.
    const backupPath=`admin_withdrawal_media_backups/${target.collection}__${target.id}/${createHash('sha256').update(item.path).digest('hex')}.bin`;
    const backup=bucket.file(backupPath);
    if((await backup.exists())[0])throw new Error('PUBLIC_REMOVAL_MEDIA_BACKUP_ALREADY_EXISTS');
    await backup.save(bytes,{resumable:false,contentType:'application/octet-stream',
      metadata:{cacheControl:'private, no-store'}});
    const [stored]=await backup.download();
    if(digest(stored)!==hash)throw new Error('PUBLIC_REMOVAL_MEDIA_BACKUP_MISMATCH');
    await assertHeld();
    // Précondition de génération appliquée en Cloud. L'émulateur peut l'ignorer ;
    // cette limite ne doit pas être interprétée comme une certification Cloud.
    await original.delete({ifGenerationMatch:Number(item.generation)});
    if((await original.exists())[0])throw new Error('PUBLIC_REMOVAL_MEDIA_STILL_EXISTS');
    const requestRef=db.collection('image_requests').doc(item.requestId);
    await requestRef.update({status:'removed_with_professional',storageDeletionConfirmed:true,
      storageDeletedAt:Date.now(),imageUrl:null,storagePath:null,approvedStoragePath:null,
      withdrawnTarget:`${target.collection}/${target.id}`});
    results.push({requestId:item.requestId,path:item.path,backupPath,sha256:hash});
  }
  return results;
}

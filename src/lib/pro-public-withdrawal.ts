/**
 * Label Moto - retrait PUBLIC d'une fiche, distinct de l'effacement RGPD des
 * données administratives. Aucune exécution pendant l'import du module.
 * Requiert le verrou commun V23 et le kill-switch de la route.
 * Les sous-collections et les URLs Storage d'images ne sont PAS effacées ici.
 */
import { createHash } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import type * as admin from 'firebase-admin';
import { withSharedIndexLock } from '@/lib/pro-index-coordination-v23';
import { pruneIndex, PRO_COLLECTIONS, type ProfessionalCollection } from '@/lib/pro-index-prune';
import { buildWithdrawalHistory, WITHDRAWAL_HISTORY_COLLECTION, type WithdrawalReason } from '@/lib/pro-public-withdrawal-history';
import { inspectPublicMedia, retirePublicMedia, sharedInIndexes } from '@/lib/pro-public-media-retirement';

const FILES = [
  {name:'public/points.json', kind:'points' as const},
  {name:'public/seo-pros.json', kind:'seo' as const},
] as const;
const VALID_ID = /^[a-zA-Z0-9_.-]{1,200}$/;
export type Target = {collection: ProfessionalCollection; id: string};
export type BucketLike = ReturnType<ReturnType<typeof admin.storage>['bucket']>;
export function validateTarget(collection:unknown,id:unknown):Target {
  if (typeof collection !== 'string' || !PRO_COLLECTIONS.includes(collection as ProfessionalCollection)
    || typeof id !== 'string' || !VALID_ID.test(id)) throw new Error('PUBLIC_REMOVAL_INVALID_TARGET');
  return {collection:collection as ProfessionalCollection,id};
}
export function mediaCandidates(source:unknown):string[] {
  if (!source || typeof source !== 'object') return [];
  const values = new Set<string>();
  const visit=(obj:unknown,depth:number,path:string)=>{
    if (depth>3 || !obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) { for (const element of obj.slice(0,30)) visit(element,depth+1,path); return; }
    for(const [key,value] of Object.entries(obj as Record<string,unknown>)){
      const next=path?`${path}.${key}`:key;
      if (typeof value === 'string' && /(^|\.|_)(image|img|photo|logo|picture|avatar|banner|cover)/i.test(next)
        && /^https?:\/\//i.test(value)) values.add(value);
      else if (value && typeof value === 'object') visit(value,depth+1,next);
    }
  };
  visit(source,0,'');
  return Array.from(values).sort();
}
function sha(bytes:Buffer|string){return createHash('sha256').update(bytes).digest('hex')}
function safeName(target:Target){return `${target.collection}__${target.id}`}
function slug(data:Record<string,unknown>){return typeof data.slug==='string'&&VALID_ID.test(data.slug)?data.slug:null}
/**
 * Pré-audit sans parcours Storage. Une URL Firebase avec token peut rester
 * accessible après retrait, même si la fiche / les règles ne la montrent plus.
 * Ne jamais renvoyer une URL tokenisée au navigateur via l'aperçu.
 */
async function readIndexes(bucket:BucketLike,target:Target){
  const results=[];
  for(const spec of FILES){
    const file=bucket.file(spec.name);
    const [a]=await file.getMetadata();
    const [bytes]=await file.download();
    const [b]=await file.getMetadata();
    if (!a.generation || String(a.generation)!==String(b.generation)) throw new Error('PUBLIC_REMOVAL_INDEX_RACE');
    const original:unknown=JSON.parse(bytes.toString('utf8'));
    const patch=pruneIndex(spec.kind,original,target.collection,target.id);
    // Copies ciblées uniquement : on n'enregistre pas plusieurs Mo d'index dans Firestore.
    const matches=(original as Record<string,unknown>[]).filter(x=>x.id===target.id);
    results.push({spec,file,originalHash:sha(bytes),generation:Number(a.generation),patch,matches});
  }
  return results;
}
export async function previewPublicRemoval(db:Firestore,bucket:BucketLike,target:Target){
  const [doc,cacheDoc]=await Promise.all([
    db.collection(target.collection).doc(target.id).get(),
    db.collection('cache').doc(`map-live-${target.collection}-${target.id}`).get(),
  ]);
  const cacheCollision=cacheDoc.exists && (
    cacheDoc.get('sourceCollection')!==target.collection || cacheDoc.get('id')!==target.id
  );
  const data=(doc.data()||{}) as Record<string,unknown>;
  const mediaPlan=await inspectPublicMedia(db,bucket,target,data);
  const mediaAudit=mediaPlan.summary;
  const files=await readIndexes(bucket,target);
  const indexMediaConflict=sharedInIndexes(files.map(f=>f.patch.entries),mediaPlan.items);
  return {
    target,
    mediaAudit,
    fichePresente:doc.exists,
    cacheLivePresente:cacheDoc.exists,
    cacheLiveConflit:cacheCollision,
    indexes:files.map(f=>({path:f.spec.name,entreesRetirables:f.patch.removed})),
    urlsImagesPossibles:mediaCandidates(data).length,
    slug:slug(data),
    nonVerifies:[mediaAudit.mediasSupprimables>0 ? `${mediaAudit.mediasSupprimables} photo(s) Firebase seront sauvegardées puis effacées` : 'Images et liens publics non présents dans la fiche : vérification distincte','Pages SEO et cache CDN déjà diffusés','Sitemap et recherche externe','Commentaires : règles Firestore à déployer avant suppression réelle'],
    actionAutorisee:!cacheCollision && !indexMediaConflict && !mediaAudit.retraitBloque && process.env.LABELMOTO_PUBLIC_REMOVAL==='ENABLED'
      && process.env.LABELMOTO_INDEX_WRITES_V23==='ENABLED',
  };
}
export async function withdrawPublic(
  db:Firestore,bucket:BucketLike,target:Target,adminUid:string,reason:WithdrawalReason,
){
  if (!adminUid || typeof adminUid!=='string') throw new Error('PUBLIC_REMOVAL_ADMIN_REQUIRED');
  // Exige l'activation explicite de l'écriture ET du même verrou que les routes V23.2.
  if(process.env.LABELMOTO_PUBLIC_REMOVAL!=='ENABLED' || process.env.LABELMOTO_INDEX_WRITES_V23!=='ENABLED')
    throw new Error('PUBLIC_REMOVAL_DISABLED');
  return withSharedIndexLock(db,'delete',async guard=>{
    const ref=db.collection(target.collection).doc(target.id);
    const backup=db.collection('admin_public_withdrawal_backups').doc(safeName(target));
    const history=db.collection(WITHDRAWAL_HISTORY_COLLECTION).doc(safeName(target));
    // Un seul document cache directement identifié, aucun balayage Firestore.
    const liveCache=db.collection('cache').doc(`map-live-${target.collection}-${target.id}`);
    const existing=await backup.get();
    if(existing.exists) throw new Error('PUBLIC_REMOVAL_EXISTING_BACKUP_REVIEW_REQUIRED');
    const [doc,cacheBefore]=await Promise.all([ref.get(),liveCache.get()]);
    const data=(doc.data()||{}) as Record<string,unknown>;
    // Barrière de sécurité serveur indépendante du pré-audit affiché :
    // le formulaire ne peut jamais forcer le retrait en laissant un média connu.
    const mediaPlan=await inspectPublicMedia(db,bucket,target,data);
    if(mediaPlan.summary.retraitBloque) throw new Error('PUBLIC_REMOVAL_MEDIA_REVIEW_REQUIRED');
    // Ne jamais toucher une entrée cache dont l'identité réelle est différente.
    if(cacheBefore.exists && (cacheBefore.get('sourceCollection')!==target.collection
      || cacheBefore.get('id')!==target.id)) throw new Error('PUBLIC_REMOVAL_LIVE_CACHE_COLLISION');
    const media=mediaCandidates(data);
    const files=await readIndexes(bucket,target);
    if(sharedInIndexes(files.map(f=>f.patch.entries),mediaPlan.items))
      throw new Error('PUBLIC_REMOVAL_MEDIA_SHARED_IN_INDEX');
    const report={target,hadMainDoc:doc.exists,slug:slug(data),
      hadLiveCache:cacheBefore.exists,
      changedIndexes:files.map(f=>({path:f.spec.name,entries:f.patch.removed})),
      unresolvedPublicMediaCount:0, plannedMediaRemovals:mediaPlan.items.length};
    // La sauvegarde est créée AVANT tout effacement, avec des champs non publics.
    // La transaction garantit qu'une fiche modifiée entre la lecture et l'écriture
    // ne sera jamais supprimée par un ancien plan.
    await guard.assertHeld();
    // IMPORTANT : la transaction suivante écrit déjà l'historique, la sauvegarde
    // ET retire le cache live. Le verrou doit marquer l'écriture AVANT celle-ci.
    // Sans cela, une erreur après commit pourrait relâcher un verrou incertain.
    await guard.markWriteStarted();
    await db.runTransaction(async tx=>{
      const [live,oldBackup,oldHistory,cacheNow,...imageRequests]=await Promise.all([
        tx.get(ref),tx.get(backup),tx.get(history),tx.get(liveCache),
        ...mediaPlan.items.map(item=>tx.get(db.collection('image_requests').doc(item.requestId))),
      ]);
      if(oldBackup.exists || oldHistory.exists) throw new Error('PUBLIC_REMOVAL_BACKUP_OR_HISTORY_EXISTS');
      if(live.exists!==doc.exists || (live.exists && live.updateTime?.toMillis()!==doc.updateTime?.toMillis()))
        throw new Error('PUBLIC_REMOVAL_SOURCE_CHANGED');
      if(cacheNow.exists!==cacheBefore.exists || (cacheNow.exists && (
          cacheNow.get('sourceCollection')!==target.collection || cacheNow.get('id')!==target.id ||
          cacheNow.updateTime?.toMillis()!==cacheBefore.updateTime?.toMillis()
        ))) throw new Error('PUBLIC_REMOVAL_LIVE_CACHE_CHANGED');
      for(let i=0;i<mediaPlan.items.length;i++){
        const original=mediaPlan.items[i];
        const fresh=imageRequests[i];
        if(!fresh.exists || (original.requestUpdatedMs!==null &&
          fresh.updateTime?.toMillis()!==original.requestUpdatedMs) ||
          fresh.get('imageUrl')!==original.url || fresh.get('status')!=='approved')
          throw new Error('PUBLIC_REMOVAL_IMAGE_REQUEST_CHANGED');
      }
      // Verrouiller également les demandes d'image au même commit : un traitement
      // concurrent ne doit pas réapprouver ou réassigner l'URL durant le retrait.
      for(const item of mediaPlan.items){
        tx.update(db.collection('image_requests').doc(item.requestId),{
          status:'withdrawal_locked',withdrawalTarget:`${target.collection}/${target.id}`,
          withdrawalLockedAt:Date.now(),
        });
      }
      // Journal minimal créé dans la même transaction que la sauvegarde privée.
      tx.create(history,buildWithdrawalHistory(target,data,adminUid,reason));
      tx.create(backup,{
        target,adminUid,createdAt:Date.now(),status:'pending',
        originalMainDoc:doc.exists?data:null,
        originalLiveCache:cacheBefore.exists?(cacheBefore.data()||{}):null,
        indexEvidence:files.map(f=>({name:f.spec.name,generation:f.generation,hash:f.originalHash,
          entries: f.matches})),
        candidateMedia:media,
        plannedMediaRequests:mediaPlan.items.map(({requestId,path,generation,size})=>({requestId,path,generation,size})),
        report,
      });
      if(cacheNow.exists) tx.delete(liveCache);
    });
    // Chaque image autorisée est sauvegardée puis supprimée physiquement.
    // Une panne laisse le verrou en revue manuelle ; ne jamais relancer à l'aveugle.
    const retiredMedia=await retirePublicMedia(db,bucket,target,mediaPlan.items,()=>guard.assertHeld());
    if(retiredMedia.length){
      await guard.assertHeld();
      await backup.update({retiredMedia:retiredMedia.map(({requestId,path,backupPath,sha256})=>
        ({requestId,path,backupPath,sha256}))});
    }
    // Après ce point, toute panne exige une revue du verrou et de la sauvegarde.
    if(doc.exists){
      await guard.assertHeld();
      await ref.delete({lastUpdateTime:doc.updateTime!});
    }
    for (const f of files){
      if(f.patch.removed===0) continue;
      await guard.assertHeld();
      await f.file.save(JSON.stringify(f.patch.entries),{
        contentType:'application/json',resumable:false,
        metadata:{cacheControl:'no-store, max-age=0'},
        preconditionOpts:{ifGenerationMatch:f.generation},
      });
    }
    // Vérification de la fiche et des deux objets, y compris celui inchangé.
    if((await ref.get()).exists) throw new Error('PUBLIC_REMOVAL_MAIN_STILL_PUBLIC');
    if((await liveCache.get()).exists) throw new Error('PUBLIC_REMOVAL_LIVE_CACHE_STILL_PUBLIC');
    for(const item of mediaPlan.items){
      if((await bucket.file(item.path).exists())[0]) throw new Error('PUBLIC_REMOVAL_MEDIA_STILL_PUBLIC');
      const request=await db.collection('image_requests').doc(item.requestId).get();
      if(request.get('status')!=='removed_with_professional' || request.get('imageUrl')!=null)
        throw new Error('PUBLIC_REMOVAL_MEDIA_REQUEST_STILL_ACTIVE');
    }
    for(const f of files){
      const [bytes]=await f.file.download();
      if(sha(bytes)!==sha(JSON.stringify(f.patch.entries))) throw new Error('PUBLIC_REMOVAL_INDEX_VERIFY_FAILED');
    }
    await guard.assertHeld();
    // Les deux statuts sont publiés ensemble après vérification des sources.
    const finishedAt=Date.now();
    const batch=db.batch();
    batch.update(backup,{status:'public_source_removed',verifiedAt:finishedAt});
    batch.update(history,{status:'sources_removed_to_verify',verifiedAt:finishedAt});
    await batch.commit();
    guard.markVerified();
    return {
      ok:true,publicFirestoreAndIndexesRemoved:true,publicLiveCacheRemoved:true,report,
      fullyInvisibleOnInternet:false,
      retiredMediaCount:retiredMedia.length,
      remaining:['Médias non référencés dans la fiche ou image_requests non certifiés','Cache CDN et sitemap à valider','Moteurs de recherche : désindexation asynchrone'],
    };
  });
}

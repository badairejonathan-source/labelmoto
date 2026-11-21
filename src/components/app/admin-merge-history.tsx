'use client';

import {useEffect,useMemo,useState} from 'react';
import {collection,getDocsFromServer,limit,query,where} from 'firebase/firestore';
import {useFirebase} from '@/firebase/client';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

type MergeHistory={id:string;eventType:string;targetCollection:string;targetId:string;
  targetTitle:string;sourceTitle:string;sourceId:string;sourceCollection:string;
  oldRemovalRequested:boolean;oldRemovalStatus:string;modifiedFields:string[];
  actorUid:string;createdAt:any};

const date=(value:any)=>{
  const timestamp=typeof value?.toDate==='function'?value.toDate():null;
  return timestamp instanceof Date?timestamp.toLocaleString('fr-FR'):'Date inconnue';
};

export default function AdminMergeHistory(){
  const {firestore}=useFirebase();
  const [items,setItems]=useState<MergeHistory[]>([]);
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [reload,setReload]=useState(0);
  useEffect(()=>{
    if(!firestore)return;
    let cancelled=false;
    setLoading(true);
    getDocsFromServer(query(collection(firestore,'listing_history'),
      where('eventType','in',['merge_new_published','merge_existing_updated']),limit(100)))
      .then(snapshot=>{
        if(cancelled)return;
        const values=snapshot.docs.map(entry=>({id:entry.id,...entry.data()} as MergeHistory));
        values.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
        setItems(values);setError('');
      })
      .catch(()=>{if(!cancelled)setError('Impossible de charger les fusions.');})
      .finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[firestore,reload]);
  const filtered=useMemo(()=>items.filter(item=>
    [item.sourceTitle,item.targetTitle,item.targetId,item.sourceId,item.eventType]
      .some(value=>String(value||'').toLowerCase().includes(search.trim().toLowerCase()))),[items,search]);
  return <section className="rounded-2xl border bg-white p-5 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="font-bold">Historique des fusions</h3>
        <p className="text-xs text-muted-foreground">100 dernières opérations chargées au maximum. Journal privé, sans copie des coordonnées.</p></div>
      <Button variant="outline" size="sm" onClick={()=>setReload(n=>n+1)} disabled={loading}>Actualiser</Button>
    </div>
    <Input aria-label="Rechercher une fusion" placeholder="Chercher un nom ou un identifiant..." value={search} onChange={event=>setSearch(event.target.value)} />
    {loading&&<p className="text-sm">Chargement...</p>}
    {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
    {!loading&&!error&&filtered.length===0&&<p className="text-sm text-muted-foreground">Aucune fusion trouvée.</p>}
    {filtered.map(item=><article key={item.id} className="rounded-xl border p-3 text-sm space-y-1">
      <div className="font-bold">{item.sourceTitle||'Soumission'} → {item.targetTitle||item.targetId}</div>
      <div className="text-xs text-muted-foreground">{date(item.createdAt)} · {item.actorUid||'Administrateur'}</div>
      <div className="text-xs">Cible : {item.targetCollection}/{item.targetId}</div>
      {item.sourceCollection&&item.sourceId&&<div className="text-xs">Ancienne : {item.sourceCollection}/{item.sourceId}</div>}
      <div className="text-xs font-semibold">{item.eventType==='merge_existing_updated'?'Transfert vers fiche existante':
        item.oldRemovalRequested ? item.oldRemovalStatus==='sources_removed_to_verify'?'Ancienne fiche retirée — vérifications externes restantes':'Suppression demandée — en attente de vérification':'Nouvelle fiche publiée — ancienne conservée'}</div>
      {item.modifiedFields?.length>0&&<div className="text-xs">Champs transférés : {item.modifiedFields.join(', ')}</div>}
    </article>)}
  </section>;
}

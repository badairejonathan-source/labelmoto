'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, getDocs, query, limit, doc, updateDoc, deleteDoc, getFirestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Edit, Trash2, MapPin, MapPinOff, X, Save, RefreshCw } from 'lucide-react';

const COLLECTIONS = ['concessions', 'associations', 'relais', 'creators'] as const;

interface ListingItem {
  id: string;
  collection: string;
  title: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  category: string;
  googleMapsUrl: string;
  placeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  latitude: number | null;
  longitude: number | null;
  lundi: string; mardi: string; mercredi: string; jeudi: string; vendredi: string; samedi: string; dimanche: string;
}

function normalize(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function ListingsManager() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [allListings, setAllListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<ListingItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ListingItem | null>(null);

  const loadListings = useCallback(async () => {
    if (!firestore) return;
    setIsLoading(true);
    const all: ListingItem[] = [];
    for (const colName of COLLECTIONS) {
      try {
        const snap = await getDocs(query(collection(firestore, colName), limit(8000)));
        snap.docs.forEach(d => {
          const data = d.data();
          all.push({
            id: d.id,
            collection: colName,
            title: data.title || d.id,
            address: data.address || '',
            phoneNumber: data.phoneNumber || '',
            email: data.email || '',
            website: data.website || '',
            category: data.category || '',
            googleMapsUrl: data.googleMapsUrl || '',
            placeUrl: data.placeUrl || '',
            instagramUrl: data.instagramUrl || '',
            facebookUrl: data.facebookUrl || '',
            latitude: typeof data.latitude === 'number' ? data.latitude : null,
            longitude: typeof data.longitude === 'number' ? data.longitude : null,
            lundi: data.lundi || '', mardi: data.mardi || '', mercredi: data.mercredi || '',
            jeudi: data.jeudi || '', vendredi: data.vendredi || '', samedi: data.samedi || '', dimanche: data.dimanche || '',
          });
        });
      } catch (e) { console.warn('Erreur chargement', colName, e); }
    }
    all.sort((a, b) => a.title.localeCompare(b.title));
    setAllListings(all);
    setLoaded(true);
    setIsLoading(false);
  }, [firestore]);

  useEffect(() => { loadListings(); }, [loadListings]);

  const results = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];
    const q = normalize(searchTerm);
    return allListings.filter(l => normalize(l.title).includes(q) || normalize(l.address).includes(q)).slice(0, 50);
  }, [searchTerm, allListings]);

  const handleSave = async () => {
    if (!firestore || !editing) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(firestore, editing.collection, editing.id), {
        title: editing.title,
        address: editing.address,
        phoneNumber: editing.phoneNumber,
        email: editing.email,
        website: editing.website,
        category: editing.category,
        googleMapsUrl: editing.googleMapsUrl,
        instagramUrl: editing.instagramUrl,
        facebookUrl: editing.facebookUrl,
        lundi: editing.lundi, mardi: editing.mardi, mercredi: editing.mercredi,
        jeudi: editing.jeudi, vendredi: editing.vendredi, samedi: editing.samedi, dimanche: editing.dimanche,
        ...(editing.latitude !== null ? { latitude: editing.latitude } : {}),
        ...(editing.longitude !== null ? { longitude: editing.longitude } : {}),
      });
      setAllListings(prev => prev.map(l => l.id === editing.id && l.collection === editing.collection ? editing : l));
      toast({ title: 'Fiche mise à jour' });
      setEditing(null);
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const handleGeocode = async () => {
    if (!editing) return;
    setIsGeocoding(true);
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: editing.address, placeUrl: editing.placeUrl, googleMapsUrl: editing.googleMapsUrl }),
      });
      const data = await res.json();
      if (data.success && Number.isFinite(data.lat) && Number.isFinite(data.lng)) {
        setEditing({ ...editing, latitude: data.lat, longitude: data.lng });
        toast({ title: 'Coordonnées trouvées', description: `${data.lat.toFixed(5)}, ${data.lng.toFixed(5)} [${data.source}]` });
      } else {
        toast({ title: 'Aucune coordonnée trouvée', variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Erreur géocodage', description: e.message, variant: 'destructive' });
    }
    setIsGeocoding(false);
  };

  const handleDelete = async () => {
    if (!firestore || !confirmDelete) return;
    try {
      await deleteDoc(doc(firestore, confirmDelete.collection, confirmDelete.id));
      setAllListings(prev => prev.filter(l => !(l.id === confirmDelete.id && l.collection === confirmDelete.collection)));
      toast({ title: 'Fiche supprimée' });
      setConfirmDelete(null);
      if (editing && editing.id === confirmDelete.id) setEditing(null);
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher une fiche par nom ou adresse..."
          className="pl-11 h-12 rounded-2xl border-2 font-bold"
        />
        {loaded && <p className="text-[10px] text-muted-foreground mt-2 ml-2 font-bold uppercase tracking-widest">{allListings.length} fiches au total</p>}
      </div>

      {searchTerm.trim().length >= 2 && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground"><p className="font-bold uppercase text-xs">Aucune fiche trouvée</p></div>
      )}

      <div className="space-y-2">
        {results.map(l => (
          <div key={`${l.collection}/${l.id}`} className="bg-background rounded-2xl border-2 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${l.latitude === null ? 'bg-orange-100 text-orange-500' : 'bg-muted text-muted-foreground'}`}>
                {l.latitude === null ? <MapPinOff className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{l.title}</p>
                <p className="text-xs text-muted-foreground truncate">{l.category || l.collection}{l.latitude === null ? ' · sans coordonnées' : ''}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing(l)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Edit className="h-4 w-4" /></button>
              <button onClick={() => setConfirmDelete(l)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black uppercase text-sm tracking-widest">Modifier la fiche</h3>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Nom</Label><Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="font-bold rounded-xl border-2" /></div>
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Adresse</Label><Input value={editing.address} onChange={e => setEditing({ ...editing, address: e.target.value })} className="font-bold rounded-xl border-2" /></div>
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-xl">
                <div className="flex-1 text-xs font-bold">
                  {editing.latitude !== null ? <span className="text-green-600">📍 {editing.latitude.toFixed(5)}, {editing.longitude?.toFixed(5)}</span> : <span className="text-orange-500">Sans coordonnées</span>}
                </div>
                <Button type="button" onClick={handleGeocode} disabled={isGeocoding} variant="outline" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-8">
                  {isGeocoding ? <Loader2 className="h-3 w-3 animate-spin" /> : <><RefreshCw className="h-3 w-3 mr-1" /> Géocoder</>}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Téléphone</Label><Input value={editing.phoneNumber} onChange={e => setEditing({ ...editing, phoneNumber: e.target.value })} className="font-bold rounded-xl border-2" /></div>
                <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Catégorie</Label><Input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="font-bold rounded-xl border-2" /></div>
              </div>
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email</Label><Input value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} className="font-bold rounded-xl border-2" /></div>
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Site web</Label><Input value={editing.website} onChange={e => setEditing({ ...editing, website: e.target.value })} className="font-bold rounded-xl border-2" /></div>
              <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">URL Google Maps</Label><Input value={editing.googleMapsUrl} onChange={e => setEditing({ ...editing, googleMapsUrl: e.target.value })} className="font-bold rounded-xl border-2" /></div>
              <div className="border-t pt-3">
                <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1 mb-2 block">Horaires</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Lundi</span><Input value={editing.lundi} onChange={e => setEditing({ ...editing, lundi: e.target.value })} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Mardi</span><Input value={editing.mardi} onChange={e => setEditing({ ...editing, mardi: e.target.value })} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Mercredi</span><Input value={editing.mercredi} onChange={e => setEditing({ ...editing, mercredi: e.target.value })} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Jeudi</span><Input value={editing.jeudi} onChange={e => setEditing({ ...editing, jeudi: e.target.value })} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Vendredi</span><Input value={editing.vendredi} onChange={e => setEditing({ ...editing, vendredi: e.target.value })} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Samedi</span><Input value={editing.samedi} onChange={e => setEditing({ ...editing, samedi: e.target.value })} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Dimanche</span><Input value={editing.dimanche} onChange={e => setEditing({ ...editing, dimanche: e.target.value })} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Instagram</Label><Input value={editing.instagramUrl} onChange={e => setEditing({ ...editing, instagramUrl: e.target.value })} className="font-bold rounded-xl border-2" /></div>
                <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Facebook</Label><Input value={editing.facebookUrl} onChange={e => setEditing({ ...editing, facebookUrl: e.target.value })} className="font-bold rounded-xl border-2" /></div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1 rounded-xl font-black uppercase text-xs tracking-widest h-11">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Enregistrer</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <Trash2 className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-black uppercase text-sm tracking-widest mb-2">Supprimer cette fiche ?</h3>
            <p className="text-sm text-muted-foreground mb-5 font-bold">{confirmDelete.title}</p>
            <div className="flex gap-2">
              <Button onClick={() => setConfirmDelete(null)} variant="outline" className="flex-1 rounded-xl font-black uppercase text-xs tracking-widest h-11">Annuler</Button>
              <Button onClick={handleDelete} className="flex-1 rounded-xl font-black uppercase text-xs tracking-widest h-11 bg-red-500 hover:bg-red-600">Supprimer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

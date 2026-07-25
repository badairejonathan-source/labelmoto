'use client';
import React, { useState } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, RefreshCw, Plus, CheckCircle } from 'lucide-react';
import { encodeGeohash } from '@/lib/geohash';

const COLLECTIONS = [
  { value: 'concessions', label: 'Concession' },
  { value: 'associations', label: 'Association' },
  { value: 'relais', label: 'Relais' },
  { value: 'creators', label: 'Créateur' },
];

const APP_SECTIONS = [
  { value: 'shopping', label: 'Shopping' },
  { value: 'service', label: 'Service / Atelier' },
  { value: 'association', label: 'Association' },
  { value: 'relais', label: 'Relais' },
  { value: 'creator', label: 'Créateur' },
];

function slugify(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function extractPostalCode(address: string): string {
  const m = (address || '').match(/\b(\d{5})\b/);
  return m ? m[1] : '';
}

export default function AddListing() {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: '', address: '', category: '', phoneNumber: '', email: '',
    website: '', googleMapsUrl: '', instagramUrl: '', facebookUrl: '', info: '',
    lundi: '', mardi: '', mercredi: '', jeudi: '', vendredi: '', samedi: '', dimanche: '',
    collectionName: 'concessions', appSection: 'service',
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleFetchFromMaps = async () => {
    if (!form.googleMapsUrl) {
      toast({ title: 'Renseigne un lien Google Maps d\'abord', variant: 'destructive' });
      return;
    }
    setIsFetching(true);
    try {
      const res = await fetch('/api/places-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.googleMapsUrl }),
      });
      const data = await res.json();
      if (data.error) {
        toast({ title: 'Erreur', description: data.error, variant: 'destructive' });
        return;
      }
      setForm(prev => ({
        ...prev,
        title: data.title || prev.title,
        address: data.address || prev.address,
        phoneNumber: data.phoneNumber || prev.phoneNumber,
        website: data.website || prev.website,
        category: data.category || prev.category,
        lundi: data.lundi || prev.lundi,
        mardi: data.mardi || prev.mardi,
        mercredi: data.mercredi || prev.mercredi,
        jeudi: data.jeudi || prev.jeudi,
        vendredi: data.vendredi || prev.vendredi,
        samedi: data.samedi || prev.samedi,
        dimanche: data.dimanche || prev.dimanche,
      }));
      if (data.latitude && data.longitude) {
        setCoords({ lat: data.latitude, lng: data.longitude });
      }
      toast({ title: '✅ Fiche récupérée depuis Google Maps', description: data.title });
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setIsFetching(false);
    }
  };

  const handleGeocode = async () => {
    if (!form.address && !form.googleMapsUrl) {
      toast({ title: 'Renseigne une adresse ou un lien Google', variant: 'destructive' });
      return;
    }
    setIsGeocoding(true);
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: form.address, googleMapsUrl: form.googleMapsUrl }),
      });
      const data = await res.json();
      if (data.success && Number.isFinite(data.lat) && Number.isFinite(data.lng)) {
        setCoords({ lat: data.lat, lng: data.lng });
        toast({ title: 'Coordonnées trouvées', description: `${data.lat.toFixed(5)}, ${data.lng.toFixed(5)} [${data.source}]` });
      } else {
        toast({ title: 'Aucune coordonnée trouvée', variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Erreur géocodage', description: e.message, variant: 'destructive' });
    }
    setIsGeocoding(false);
  };

  const handleCreate = async () => {
    if (!firestore) return;
    if (!form.title.trim()) { toast({ title: 'Le nom est obligatoire', variant: 'destructive' }); return; }
    if (!coords) { toast({ title: 'Géocode d\'abord la fiche', variant: 'destructive' }); return; }

    setIsCreating(true);
    try {
      const cp = extractPostalCode(form.address);
      const baseSlug = slugify(form.title) + (cp ? `-${cp}` : '');

      // Vérifier l'unicité du slug
      const existing = await getDoc(doc(firestore, form.collectionName, baseSlug));
      const slug = existing.exists() ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

      const fiche: any = {
        title: form.title.trim(),
        address: form.address.trim(),
        category: form.category.trim(),
        appSection: form.appSection,
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        googleMapsUrl: form.googleMapsUrl.trim(),
        instagramUrl: form.instagramUrl.trim(),
        facebookUrl: form.facebookUrl.trim(),
        info: form.info.trim(),
        lundi: form.lundi.trim(), mardi: form.mardi.trim(), mercredi: form.mercredi.trim(),
        jeudi: form.jeudi.trim(), vendredi: form.vendredi.trim(), samedi: form.samedi.trim(), dimanche: form.dimanche.trim(),
        latitude: coords.lat,
        longitude: coords.lng,
        geohash: encodeGeohash(coords.lat, coords.lng, 9),
        imgUrl: '',
        rating: '0',
        reviewCount: 0,
        isClaimed: false,
        slug,
        timestamp: new Date().toISOString(),
        publishedAt: new Date(),
        createdViaAdmin: true,
      };

      await setDoc(doc(firestore, form.collectionName, slug), fiche);
      setCreatedSlug(slug);
      toast({ title: 'Fiche créée !', description: `${form.collectionName}/${slug}` });
    } catch (e: any) {
      toast({ title: 'Erreur création', description: e.message, variant: 'destructive' });
    }
    setIsCreating(false);
  };

  const resetForm = () => {
    setForm({ title: '', address: '', category: '', phoneNumber: '', email: '', website: '', googleMapsUrl: '', instagramUrl: '', facebookUrl: '', info: '', lundi: '', mardi: '', mercredi: '', jeudi: '', vendredi: '', samedi: '', dimanche: '', collectionName: 'concessions', appSection: 'service' });
    setCoords(null);
    setCreatedSlug(null);
  };

  if (createdSlug) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h3 className="font-black uppercase text-lg tracking-widest mb-2">Fiche créée !</h3>
        <p className="text-sm text-muted-foreground mb-1 font-bold">{form.title}</p>
        <p className="text-xs text-muted-foreground mb-6">{form.collectionName}/{createdSlug}</p>
        <Button onClick={resetForm} className="rounded-xl font-black uppercase text-xs tracking-widest h-11"><Plus className="h-4 w-4 mr-2" /> Ajouter une autre fiche</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="space-y-3">
        <div>
          <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Lien Google Maps (recommandé)</Label>
          <Input value={form.googleMapsUrl} onChange={e => set('googleMapsUrl', e.target.value)} placeholder="https://maps.app.goo.gl/..." className="font-bold rounded-xl border-2" />
          <Button type="button" onClick={handleFetchFromMaps} disabled={isFetching || !form.googleMapsUrl} className="mt-2 w-full bg-brand hover:bg-brand/90 text-white font-black uppercase text-xs rounded-xl h-10 tracking-widest">
            {isFetching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Récupération...</> : <><RefreshCw className="mr-2 h-4 w-4" /> Récupérer depuis Google Maps</>}
          </Button>
        </div>
        <div>
          <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Nom *</Label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} className="font-bold rounded-xl border-2" />
        </div>
        <div>
          <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Adresse</Label>
          <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="38 Rue X, 93160 Noisy-le-Grand" className="font-bold rounded-xl border-2" />
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
          <div className="flex-1 text-xs font-bold">
            {coords ? <span className="text-green-600 flex items-center gap-1"><MapPin className="h-3 w-3" /> {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span> : <span className="text-orange-500">Pas encore géocodé</span>}
          </div>
          <Button type="button" onClick={handleGeocode} disabled={isGeocoding} variant="outline" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-9">
            {isGeocoding ? <Loader2 className="h-3 w-3 animate-spin" /> : <><RefreshCw className="h-3 w-3 mr-1" /> Géocoder</>}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Collection</Label>
            <Select value={form.collectionName} onValueChange={v => set('collectionName', v)}>
              <SelectTrigger className="font-bold rounded-xl border-2"><SelectValue /></SelectTrigger>
              <SelectContent>{COLLECTIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Section app</Label>
            <Select value={form.appSection} onValueChange={v => set('appSection', v)}>
              <SelectTrigger className="font-bold rounded-xl border-2"><SelectValue /></SelectTrigger>
              <SelectContent>{APP_SECTIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Catégorie</Label><Input value={form.category} onChange={e => set('category', e.target.value)} placeholder="assurance moto, atelier..." className="font-bold rounded-xl border-2" /></div>

        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Téléphone</Label><Input value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} className="font-bold rounded-xl border-2" /></div>
          <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Site web</Label><Input value={form.website} onChange={e => set('website', e.target.value)} className="font-bold rounded-xl border-2" /></div>
        </div>
        <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email</Label><Input value={form.email} onChange={e => set('email', e.target.value)} className="font-bold rounded-xl border-2" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Instagram</Label><Input value={form.instagramUrl} onChange={e => set('instagramUrl', e.target.value)} className="font-bold rounded-xl border-2" /></div>
          <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Facebook</Label><Input value={form.facebookUrl} onChange={e => set('facebookUrl', e.target.value)} className="font-bold rounded-xl border-2" /></div>
        </div>
        <div className="border-t pt-3 mt-1">
          <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1 mb-2 block">Horaires (ex: 09:00-12:30, 14:00-18:00 ou Fermé)</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Lundi</span><Input value={form.lundi} onChange={e => set('lundi', e.target.value)} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
            <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Mardi</span><Input value={form.mardi} onChange={e => set('mardi', e.target.value)} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
            <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Mercredi</span><Input value={form.mercredi} onChange={e => set('mercredi', e.target.value)} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
            <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Jeudi</span><Input value={form.jeudi} onChange={e => set('jeudi', e.target.value)} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
            <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Vendredi</span><Input value={form.vendredi} onChange={e => set('vendredi', e.target.value)} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
            <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Samedi</span><Input value={form.samedi} onChange={e => set('samedi', e.target.value)} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
            <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 shrink-0">Dimanche</span><Input value={form.dimanche} onChange={e => set('dimanche', e.target.value)} placeholder="09:00-12:00, 14:00-18:00" className="font-bold rounded-xl border-2 h-9 text-sm" /></div>
          </div>
        </div>
        <div><Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Description</Label><Textarea value={form.info} onChange={e => set('info', e.target.value)} className="font-bold rounded-xl border-2 min-h-[70px]" /></div>

        <Button onClick={handleCreate} disabled={isCreating || !coords} className="w-full rounded-xl font-black uppercase text-xs tracking-widest h-12 mt-2">
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Créer la fiche</>}
        </Button>
        {!coords && <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">Géocode la fiche avant de la créer</p>}
      </div>
    </div>
  );
}

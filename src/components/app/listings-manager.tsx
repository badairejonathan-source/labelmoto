'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Edit, Trash2, MapPin, MapPinOff, X, Save, RefreshCw, History } from 'lucide-react';
import ImageUploadRequest from '@/components/app/image-upload-request';
import { loadPublicSeoPros } from '@/lib/public-seo-pros';
import ProfessionalListingForm, { ProfessionalAppSection, ProfessionalListingFormValues } from '@/components/app/professional-listing-form';


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
  brands: string[];
  info: string;
  appSection: ProfessionalAppSection;
  imageUrl: string;
}

async function fetchCacheInfo(firestore: any, setCacheUpdatedAt: any, setCacheCount: any) {
  try {
    const db = getFirestore();
    const snap = await getDoc(doc(db, 'cache', 'map_points'));
    if (snap.exists()) {
      const data = snap.data();
      setCacheCount(data.count || 0);
      if (data.updatedAt?.toDate) setCacheUpdatedAt(data.updatedAt.toDate());
    }
  } catch {}
}

function normalize(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


function inferAppSection(collectionName: string, raw?: unknown): ProfessionalAppSection {
  if (raw === 'shopping' || raw === 'service' || raw === 'both' || raw === 'association' || raw === 'relais' || raw === 'creator') {
    return raw;
  }
  if (collectionName === 'associations') return 'association';
  if (collectionName === 'relais') return 'relais';
  if (collectionName === 'creators') return 'creator';
  return 'shopping';
}

function allowedSectionsForCollection(collectionName: string): ProfessionalAppSection[] {
  if (collectionName === 'associations') return ['association'];
  if (collectionName === 'relais') return ['relais'];
  if (collectionName === 'creators') return ['creator'];
  return ['shopping', 'service', 'both'];
}

interface ListingsManagerProps {
  initialEditTarget?: { collection: string; id: string } | null;
  onInitialEditHandled?: () => void;
  editorOnly?: boolean;
  onEditorClose?: () => void;
}

export default function ListingsManager({ initialEditTarget = null, onInitialEditHandled, editorOnly = false, onEditorClose }: ListingsManagerProps) {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [allListings, setAllListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<ListingItem | null>(null);
  const [editingOriginal, setEditingOriginal] = useState<ListingItem | null>(null);
  const [listingHistory, setListingHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyUnavailable, setHistoryUnavailable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ListingItem | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [cacheUpdatedAt, setCacheUpdatedAt] = useState<Date | null>(null);
  const [cacheCount, setCacheCount] = useState<number>(0);
  const [isRebuilding, setIsRebuilding] = useState(false);

  useEffect(() => {
    if (firestore) fetchCacheInfo(firestore, setCacheUpdatedAt, setCacheCount);
  }, [firestore]);

  const handleRebuildCache = async () => {
    setIsRebuilding(true);
    try {
      if (!user) {
        toast({
          title: 'Session introuvable',
          description:
            'Reconnecte-toi avant de mettre à jour la carte.',
          variant: 'destructive',
        });
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch(
        '/api/rebuild-map-cache',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        toast({
          title: 'Accès refusé',
          description:
            data.error ||
            'Droits administrateur requis.',
          variant: 'destructive',
        });
        return;
      }
      if (data.ok) {
        toast({ title: 'Carte mise à jour', description: data.count + ' points régénérés' });
        if (firestore) fetchCacheInfo(firestore, setCacheUpdatedAt, setCacheCount);
      } else {
        toast({ title: 'Erreur', description: data.error, variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    } finally {
      setIsRebuilding(false);
    }
  };
  const [importError, setImportError] = useState('');

  const loadListings = useCallback(async () => {
    setIsLoading(true);

    try {
      const publicPros = await loadPublicSeoPros();

      const merged = new Map<string, ListingItem>();

      for (const pro of publicPros) {
        const item: ListingItem = {
          id: pro.id,
          collection: pro.collection,
          title: pro.title,
          address: pro.address,
          phoneNumber: pro.phoneNumber || '',
          email: '',
          website: pro.website || '',
          category: pro.category,
          googleMapsUrl: '',
          placeUrl: '',
          instagramUrl: '',
          facebookUrl: '',
          latitude: pro.latitude,
          longitude: pro.longitude,
          lundi: '',
          mardi: '',
          mercredi: '',
          jeudi: '',
          vendredi: '',
          samedi: '',
          dimanche: '',
          brands: pro.brands,
          info: '',
          appSection: inferAppSection(pro.collection),
          imageUrl: '',
        };

        merged.set(`${item.collection}/${item.id}`, item);
      }

      /*
       * L'index public seo-pros.json peut avoir jusqu'a une heure de cache.
       * Pour l'admin, on fusionne donc aussi l'index live ecrit a chaque
       * publication. Une fiche nouvellement creee devient ainsi searchable
       * immediatement, sans attendre la regeneration du cache public.
       */
      if (firestore) {
        try {
          const liveSnap = await getDocs(
            query(
              collection(firestore, 'cache'),
              where('kind', '==', 'map_point_live')
            )
          );

          liveSnap.forEach(liveDoc => {
            const data = liveDoc.data();
            const sourceCollection = String(data.sourceCollection || '');
            const id = String(data.id || '');

            if (
              !id ||
              !['concessions', 'associations', 'relais', 'creators'].includes(sourceCollection)
            ) {
              return;
            }

            const key = `${sourceCollection}/${id}`;
            const previous = merged.get(key);

            merged.set(key, {
              id,
              collection: sourceCollection,
              title: String(data.t || previous?.title || id),
              address: String(data.addr || previous?.address || ''),
              phoneNumber: previous?.phoneNumber || '',
              email: previous?.email || '',
              website: previous?.website || '',
              category: String(data.c || previous?.category || ''),
              googleMapsUrl: previous?.googleMapsUrl || '',
              placeUrl: previous?.placeUrl || '',
              instagramUrl: previous?.instagramUrl || '',
              facebookUrl: previous?.facebookUrl || '',
              latitude: Number.isFinite(Number(data.lat)) ? Number(data.lat) : (previous?.latitude ?? null),
              longitude: Number.isFinite(Number(data.lng)) ? Number(data.lng) : (previous?.longitude ?? null),
              lundi: previous?.lundi || '',
              mardi: previous?.mardi || '',
              mercredi: previous?.mercredi || '',
              jeudi: previous?.jeudi || '',
              vendredi: previous?.vendredi || '',
              samedi: previous?.samedi || '',
              dimanche: previous?.dimanche || '',
              brands: Array.isArray(data.b) ? data.b : (previous?.brands || []),
              info: previous?.info || '',
              appSection: inferAppSection(sourceCollection, previous?.appSection),
              imageUrl: previous?.imageUrl || '',
            });
          });
        } catch (liveError) {
          console.warn('Index live admin indisponible :', liveError);
        }
      }

      setAllListings(
        Array.from(merged.values()).sort((a, b) =>
          a.title.localeCompare(b.title, 'fr')
        )
      );
      setLoaded(true);
    } catch (e) {
      console.warn(
        'Erreur chargement index public des fiches',
        e
      );

      setAllListings([]);
      setLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [firestore]);

  useEffect(() => {
    if (editorOnly && initialEditTarget) return;
    loadListings();
  }, [loadListings, editorOnly, initialEditTarget]);

  const results = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];
    const q = normalize(searchTerm);
    return allListings.filter(l => normalize(l.title).includes(q) || normalize(l.address).includes(q)).slice(0, 50);
  }, [searchTerm, allListings]);

  const handleEdit = useCallback(async (listing: ListingItem) => {
    if (!firestore) return;

    setIsLoading(true);

    try {
      // Une seule lecture Firestore :
      // uniquement la fiche que l'admin veut modifier.
      const snapshot = await getDoc(
        doc(
          firestore,
          listing.collection,
          listing.id
        )
      );

      if (!snapshot.exists()) {
        toast({
          title: 'Fiche introuvable',
          variant: 'destructive',
        });

        return;
      }

      const data = snapshot.data();

      const loadedListing: ListingItem = {
        id: snapshot.id,
        collection: listing.collection,
        title: data.title || snapshot.id,
        address: data.address || '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        website: data.website || '',
        category: data.category || '',
        googleMapsUrl: data.googleMapsUrl || '',
        placeUrl: data.placeUrl || '',
        instagramUrl: data.instagramUrl || '',
        facebookUrl: data.facebookUrl || '',
        latitude:
          typeof data.latitude === 'number'
            ? data.latitude
            : null,
        longitude:
          typeof data.longitude === 'number'
            ? data.longitude
            : null,
        lundi: data.horaires?.lundi || data.lundi || '',
        mardi: data.horaires?.mardi || data.mardi || '',
        mercredi: data.horaires?.mercredi || data.mercredi || '',
        jeudi: data.horaires?.jeudi || data.jeudi || '',
        vendredi: data.horaires?.vendredi || data.vendredi || '',
        samedi: data.horaires?.samedi || data.samedi || '',
        dimanche: data.horaires?.dimanche || data.dimanche || '',
        brands: Array.isArray(data.brands)
          ? data.brands
          : [],
        info: data.info || '',
        appSection: inferAppSection(listing.collection, data.appSection),
        imageUrl: data.imageUrl || data.imgUrl || data.photoUrl || '',
      };

      setEditing(loadedListing);
      setEditingOriginal({ ...loadedListing, brands: [...loadedListing.brands] });

      setIsLoadingHistory(true);
      setHistoryUnavailable(false);
      try {
        const historySnap = await getDocs(
          query(
            collection(firestore, 'listing_history'),
            where('listingKey', '==', `${listing.collection}/${listing.id}`)
          )
        );
        const history = historySnap.docs
          .map(item => ({ id: item.id, ...item.data() }))
          .sort((a: any, b: any) => {
            const aMs = typeof a.createdAt?.toMillis === 'function' ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0) * 1000;
            const bMs = typeof b.createdAt?.toMillis === 'function' ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0) * 1000;
            return bMs - aMs;
          });
        setListingHistory(history);
      } catch (historyError) {
        // L'historique est secondaire : une règle Firestore non déployée ne doit
        // jamais empêcher l'admin d'ouvrir ou de modifier la fiche.
        console.warn('[LabelMoto] Historique indisponible :', historyError);
        setListingHistory([]);
        setHistoryUnavailable(true);
      } finally {
        setIsLoadingHistory(false);
      }

      setIsImporting(false);
      setImportUrl('');
      setImportError('');
    } catch (e: any) {
      toast({
        title: 'Erreur',
        description:
          e?.message ||
          'Impossible de charger cette fiche.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);

  useEffect(() => {
    if (!firestore || !initialEditTarget) return;
    if (!editorOnly && !loaded) return;

    const existing = allListings.find(
      item =>
        item.collection === initialEditTarget.collection &&
        item.id === initialEditTarget.id
    );

    const target: ListingItem = existing || {
      id: initialEditTarget.id,
      collection: initialEditTarget.collection,
      title: initialEditTarget.id,
      address: '',
      phoneNumber: '',
      email: '',
      website: '',
      category: '',
      googleMapsUrl: '',
      placeUrl: '',
      instagramUrl: '',
      facebookUrl: '',
      latitude: null,
      longitude: null,
      lundi: '',
      mardi: '',
      mercredi: '',
      jeudi: '',
      vendredi: '',
      samedi: '',
      dimanche: '',
      brands: [],
      info: '',
      appSection: inferAppSection(initialEditTarget.collection),
      imageUrl: '',
    };

    void handleEdit(target).finally(() => {
      onInitialEditHandled?.();
    });
  }, [loaded, firestore, initialEditTarget, allListings, handleEdit, onInitialEditHandled, editorOnly]);

  const handleImportFromGoogleMaps = async () => {
    if (!importUrl.trim() || !editing) return;
    setImportLoading(true);
    setImportError('');
    try {
      const res = await fetch('/api/places-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setImportError(data.error || 'Erreur'); return; }
      // Mettre à jour le formulaire avec les données importées
      setEditing(prev => prev ? {
        ...prev,
        title: data.title || prev.title,
        address: data.address || prev.address,
        phoneNumber: data.phoneNumber || prev.phoneNumber,
        website: data.website || prev.website,
        latitude: data.latitude ?? prev.latitude,
        longitude: data.longitude ?? prev.longitude,
        lundi: data.lundi || prev.lundi,
        mardi: data.mardi || prev.mardi,
        mercredi: data.mercredi || prev.mercredi,
        jeudi: data.jeudi || prev.jeudi,
        vendredi: data.vendredi || prev.vendredi,
        samedi: data.samedi || prev.samedi,
        dimanche: data.dimanche || prev.dimanche,
      } : prev);
      setIsImporting(false);
      setImportUrl('');
      toast({ title: '✅ Données importées depuis Google Maps', description: data.title });
    } catch (e: any) {
      setImportError('Erreur de connexion');
    }
    setImportLoading(false);
  };
  const handleSave = async (formValues: ProfessionalListingFormValues) => {
    if (!firestore || !editing) return;
    setIsSaving(true);

    const nextListing: ListingItem = {
      ...editing,
      title: formValues.name,
      appSection: formValues.appSection,
      category: formValues.category,
      address: formValues.address,
      phoneNumber: formValues.phone,
      email: formValues.email,
      website: formValues.website,
      facebookUrl: formValues.facebook,
      instagramUrl: formValues.instagram,
      info: formValues.description,
      googleMapsUrl: formValues.googleMapsUrl,
      latitude: formValues.latitude,
      longitude: formValues.longitude,
      imageUrl: formValues.imageUrl || editing.imageUrl,
      lundi: formValues.horaires.lundi,
      mardi: formValues.horaires.mardi,
      mercredi: formValues.horaires.mercredi,
      jeudi: formValues.horaires.jeudi,
      vendredi: formValues.horaires.vendredi,
      samedi: formValues.horaires.samedi,
      dimanche: formValues.horaires.dimanche,
    };

    try {
      const updates = {
        title: nextListing.title,
        appSection: nextListing.appSection,
        address: nextListing.address,
        phoneNumber: nextListing.phoneNumber,
        email: nextListing.email,
        website: nextListing.website,
        category: nextListing.category,
        googleMapsUrl: nextListing.googleMapsUrl,
        instagramUrl: nextListing.instagramUrl,
        facebookUrl: nextListing.facebookUrl,
        imageUrl: nextListing.imageUrl,
        lundi: nextListing.lundi,
        mardi: nextListing.mardi,
        mercredi: nextListing.mercredi,
        jeudi: nextListing.jeudi,
        vendredi: nextListing.vendredi,
        samedi: nextListing.samedi,
        dimanche: nextListing.dimanche,
        horaires: {
          lundi: nextListing.lundi,
          mardi: nextListing.mardi,
          mercredi: nextListing.mercredi,
          jeudi: nextListing.jeudi,
          vendredi: nextListing.vendredi,
          samedi: nextListing.samedi,
          dimanche: nextListing.dimanche,
        },
        brands: nextListing.brands,
        info: nextListing.info,
        isMultibrand: nextListing.brands.length >= 2,
        ...(nextListing.latitude !== null ? { latitude: nextListing.latitude } : {}),
        ...(nextListing.longitude !== null ? { longitude: nextListing.longitude } : {}),
        updatedAt: serverTimestamp(),
      };

      const changes: Record<string, { old: any; new: any }> = {};
      if (editingOriginal) {
        for (const key of [
          'title', 'appSection', 'address', 'phoneNumber', 'email', 'website', 'category',
          'googleMapsUrl', 'instagramUrl', 'facebookUrl', 'imageUrl',
          'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche', 'info',
        ] as const) {
          if (editingOriginal[key] !== nextListing[key]) {
            changes[key] = { old: editingOriginal[key], new: nextListing[key] };
          }
        }
      }

      // L'écriture de la fiche reste prioritaire. Le cache et l'historique
      // ne doivent jamais bloquer une correction administrateur.
      await updateDoc(doc(firestore, nextListing.collection, nextListing.id), updates);

      try {
        await setDoc(
          doc(firestore, 'cache', `map-live-${nextListing.collection}-${nextListing.id}`),
          {
            kind: 'map_point_live',
            sourceCollection: nextListing.collection,
            id: nextListing.id,
            t: nextListing.title,
            s: nextListing.id,
            a: nextListing.collection === 'associations'
              ? 'association'
              : nextListing.collection === 'relais'
                ? 'relais'
                : nextListing.collection === 'creators'
                  ? 'creator'
                  : nextListing.appSection,
            c: nextListing.category || '',
            lat: nextListing.latitude,
            lng: nextListing.longitude,
            addr: nextListing.address || '',
            b: nextListing.brands || [],
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (cacheError) {
        console.warn('[LabelMoto] Fiche mise à jour, cache live non synchronisé :', cacheError);
      }

      try {
        await addDoc(collection(firestore, 'listing_history'), {
          listingKey: `${nextListing.collection}/${nextListing.id}`,
          targetCollection: nextListing.collection,
          targetId: nextListing.id,
          targetTitle: nextListing.title,
          eventType: 'admin_direct_update',
          summary: 'Fiche modifiée directement par Label Moto',
          changes,
          actorType: 'admin',
          actorUid: user?.uid || '',
          createdAt: serverTimestamp(),
        });
      } catch (historyError) {
        console.warn('[LabelMoto] Fiche mise à jour, historique non enregistré :', historyError);
      }

      setAllListings(previous => previous.map(item =>
        item.id === nextListing.id && item.collection === nextListing.collection
          ? nextListing
          : item,
      ));

      toast({ title: 'Fiche mise à jour' });
      setEditing(null);
      setEditingOriginal(null);
      setListingHistory([]);
      setHistoryUnavailable(false);
      onEditorClose?.();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error?.message || 'Impossible d’enregistrer la fiche.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
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
    <div className={editorOnly ? "" : "max-w-3xl mx-auto"}>
      {!editorOnly && (<>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher une fiche par nom ou adresse..."
          className="pl-11 h-12 rounded-2xl border-2 font-bold"
        />
        {loaded && <p className="text-[10px] text-muted-foreground mt-2 ml-2 font-bold uppercase tracking-widest">{allListings.length} fiches au total</p>}
        {/* Cache carte */}
        <div className="mt-4 p-4 bg-muted/30 rounded-2xl border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dernière mise à jour de la carte</p>
            <p className="font-black text-sm mt-0.5">
              {cacheUpdatedAt ? cacheUpdatedAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Jamais'}
              {cacheCount > 0 && <span className="ml-2 text-muted-foreground font-medium text-xs">({cacheCount} points)</span>}
            </p>
            {cacheUpdatedAt && allListings.length > cacheCount && (
              <p className="text-[10px] text-orange-600 font-black mt-1">
                ⚠️ {allListings.length - cacheCount} fiche(s) non synchronisée(s)
              </p>
            )}
          </div>
          <Button onClick={handleRebuildCache} disabled={isRebuilding} className="bg-brand hover:bg-brand/90 text-white font-black uppercase text-[10px] tracking-widest rounded-xl h-10 px-4 shrink-0">
            {isRebuilding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mise à jour...</> : <><RefreshCw className="mr-2 h-4 w-4" /> Mettre à jour la carte</>}
          </Button>
        </div>
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
              <button onClick={() => handleEdit(l)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Edit className="h-4 w-4" /></button>
              <button onClick={() => setConfirmDelete(l)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      </>)}

      {editing && (
        <div className={editorOnly ? 'max-w-3xl mx-auto pb-10' : 'mt-8'}>
          <ProfessionalListingForm
            key={`${editing.collection}/${editing.id}`}
            adminMode
            listingId={editing.id}
            title="Modifier la fiche"
            description="Même formulaire que pour la création d'une fiche. Les données sont préremplies avec la version actuellement publiée."
            submitLabel="Enregistrer la fiche"
            allowedSections={allowedSectionsForCollection(editing.collection)}
            initialValues={{
              name: editing.title,
              appSection: editing.appSection,
              category: editing.category,
              address: editing.address,
              phone: editing.phoneNumber,
              email: editing.email,
              website: editing.website,
              facebook: editing.facebookUrl,
              instagram: editing.instagramUrl,
              description: editing.info,
              horaires: {
                lundi: editing.lundi,
                mardi: editing.mardi,
                mercredi: editing.mercredi,
                jeudi: editing.jeudi,
                vendredi: editing.vendredi,
                samedi: editing.samedi,
                dimanche: editing.dimanche,
              },
              imageUrl: editing.imageUrl,
              googleMapsUrl: editing.googleMapsUrl,
              latitude: editing.latitude,
              longitude: editing.longitude,
            }}
            onSubmit={handleSave}
            onCancel={() => {
              setEditing(null);
              setListingHistory([]);
              setEditingOriginal(null);
              setHistoryUnavailable(false);
              onEditorClose?.();
            }}
          />

          <div className="mt-6 rounded-3xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-brand" />
              <p className="font-black uppercase text-sm">Historique de la fiche</p>
            </div>
            {isLoadingHistory ? (
              <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-brand" /></div>
            ) : historyUnavailable ? (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <strong>Historique temporairement indisponible.</strong> Cela n'empêche pas la modification ou l'enregistrement de la fiche.
              </div>
            ) : listingHistory.length === 0 ? (
              <p className="text-xs text-muted-foreground">Aucun événement enregistré pour cette fiche.</p>
            ) : (
              <div className="space-y-2">
                {listingHistory.map(event => {
                  const date = typeof event.createdAt?.toDate === 'function' ? event.createdAt.toDate() : null;
                  return (
                    <div key={event.id} className="rounded-xl bg-muted/30 border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-black">{event.summary || event.eventType}</p>
                        <span className="text-[9px] text-muted-foreground shrink-0">
                          {date ? date.toLocaleDateString('fr-FR') : '—'}
                        </span>
                      </div>
                      {event.changes && Object.keys(event.changes).length > 0 && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(event.changes).map(([field, value]: [string, any]) => (
                            <p key={field} className="text-[9px] text-muted-foreground break-words">
                              <strong className="text-foreground">{field}</strong> : {String(value?.old ?? '(vide)')} → {String(value?.new ?? '(vide)')}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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

'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
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
import ProDeletionReviewV20 from '@/components/app/pro-deletion-review-v20';
import { parseProDeletionReviewV20 } from '@/lib/pro-deletion-review-v20';
import type { ProDeletionReviewV20 as ProDeletionReviewReportV20 } from '@/lib/pro-deletion-review-v20';


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

type PublicRemovalPreview = {
  target: { collection: string; id: string };
  fichePresente: boolean;
  cacheLivePresente: boolean;
  cacheLiveConflit: boolean;
  indexes: {path:string; entreesRetirables:number}[];
  urlsImagesPossibles: number;
  nonVerifies: string[];
  actionAutorisee: boolean;
  mediaAudit?: {urlsFiche:number;urlsSousControleLabelMoto:number;demandesImagesLiees:number;
    demandesActivesAExaminer:number;verificationIncomplete:boolean;retraitBloque:boolean};
};
type PublicRemovalResult = {
  ok: boolean;
  publicFirestoreAndIndexesRemoved: boolean;
  publicLiveCacheRemoved: boolean;
  fullyInvisibleOnInternet: boolean;
  remaining: string[];
};

type WithdrawalHistoryEntry = {
  id: string; collection: string; docId: string; title: string; city: string;
  oldPath: string; reason: 'owner_request'|'other';
  status: 'pending_review'|'sources_removed_to_verify';
  createdAt: number; verifiedAt: number|null;
};

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
  const [deleteReport, setDeleteReport] = useState<ProDeletionReviewReportV20 | null>(null);
  const [deleteReportError, setDeleteReportError] = useState('');
  const [deleteImpactLoading, setDeleteImpactLoading] = useState(false);
  const [publicRemovalPreview, setPublicRemovalPreview] = useState<PublicRemovalPreview | null>(null);
  const [publicRemovalPreviewLoading, setPublicRemovalPreviewLoading] = useState(false);
  const [publicRemovalPreviewError, setPublicRemovalPreviewError] = useState('');
  const [publicRemovalApplying, setPublicRemovalApplying] = useState(false);
  const [publicRemovalApplyError, setPublicRemovalApplyError] = useState('');
  const [publicRemovalResult, setPublicRemovalResult] = useState<PublicRemovalResult | null>(null);
  // Ignore les réponses tardives après fermeture ou changement de fiche.
  const deletePreviewSequence = React.useRef(0);
  const publicRemovalSequence = React.useRef(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [cacheUpdatedAt, setCacheUpdatedAt] = useState<Date | null>(null);
  const [cacheCount, setCacheCount] = useState<number>(0);
  const [withdrawalHistoryVisible,setWithdrawalHistoryVisible]=useState(false);
  const [withdrawalHistoryConsent,setWithdrawalHistoryConsent]=useState(false);
  const [withdrawalHistoryLoading,setWithdrawalHistoryLoading]=useState(false);
  const [withdrawalHistoryLoaded,setWithdrawalHistoryLoaded]=useState(false);
  const [withdrawalHistoryError,setWithdrawalHistoryError]=useState('');
  const [withdrawalHistoryRecords,setWithdrawalHistoryRecords]=useState<WithdrawalHistoryEntry[]>([]);
  const [withdrawalDiagnoses,setWithdrawalDiagnoses] = useState<Record<string, {
    state:'sources_removed_to_verify'|'manual_review'|'no_record';
    history:{exists:boolean;status:string|null};
    backup:{exists:boolean;status:string|null};
    sharedIndexLock:{exists:boolean;status:string|null;scope:string};
    automaticRetryAllowed:boolean;
  }>>({});
  const [withdrawalDiagnosisBusy,setWithdrawalDiagnosisBusy] = useState<string|null>(null);
  const [withdrawalDiagnosisErrors,setWithdrawalDiagnosisErrors] = useState<Record<string,string>>({});
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
  // Historique chargé uniquement sur demande pour limiter les lectures facturables.
  // Diagnostic explicite : 1 verification de role + 3 lectures documentaires ciblees.
  // Aucun scan, aucun effacement et aucune tentative de reprise.
  const inspectWithdrawal = async (entry: WithdrawalHistoryEntry) => {
    if(!withdrawalHistoryConsent || !user || withdrawalDiagnosisBusy) return;
    const key=entry.id;
    setWithdrawalDiagnosisBusy(key);
    setWithdrawalDiagnosisErrors(old=>({...old,[key]:''}));
    try {
      const token=await user.getIdToken();
      const params=new URLSearchParams({collection:entry.collection,id:entry.docId});
      const response=await fetch(`/api/admin/retrait-public-diagnostic?${params}`,{
        method:'GET',cache:'no-store',headers:{Authorization:`Bearer ${token}`},
      });
      const value:unknown=await response.json();
      if(!response.ok || !value || typeof value!=='object' || !('ok' in value) || value.ok!==true || !('target' in value) || !('state' in value))
        throw new Error('Diagnostic indisponible : aucune nouvelle suppression autorisee');
      const data=value as unknown as {target:{collection:string;id:string};state:string;
        history:{exists:boolean;status:string|null}; backup:{exists:boolean;status:string|null};
        sharedIndexLock:{exists:boolean;status:string|null;scope:string}; automaticRetryAllowed:boolean};
      if(data.target.collection!==entry.collection || data.target.id!==entry.docId ||
        !['sources_removed_to_verify','manual_review','no_record'].includes(data.state) ||
        data.automaticRetryAllowed!==false || !data.history || !data.backup || !data.sharedIndexLock)
        throw new Error('Reponse diagnostic invalide');
      setWithdrawalDiagnoses(old=>({...old,[key]:data as typeof old[string]}));
    }catch(e:unknown){
      setWithdrawalDiagnosisErrors(old=>({...old,[key]:e instanceof Error?e.message:'Diagnostic indisponible'}));
    }finally {setWithdrawalDiagnosisBusy(null);}
  };

  const loadWithdrawalHistory = async () => {
    if (!withdrawalHistoryConsent || !user || withdrawalHistoryLoading) return;
    setWithdrawalHistoryLoading(true);
    setWithdrawalHistoryError('');
    try {
      const token=await user.getIdToken();
      const response=await fetch('/api/admin/retrait-public-history',{
        method:'GET',cache:'no-store',headers:{Authorization:`Bearer ${token}`},
      });
      const data:unknown=await response.json();
      if(!response.ok || !data || typeof data!=='object' || !('entries' in data)
        || !Array.isArray(data.entries)) throw new Error('Historique indisponible ou accès refusé');
      const entries=data.entries as WithdrawalHistoryEntry[];
      if(entries.length>20 || entries.some(x=> !x || typeof x.id!=='string' || typeof x.title!=='string'
        || typeof x.createdAt!=='number' || !['pending_review','sources_removed_to_verify'].includes(x.status)))
        throw new Error('Réponse d’historique invalide');
      setWithdrawalHistoryRecords(entries);
      setWithdrawalHistoryLoaded(true);
    } catch (e:unknown) {
      setWithdrawalHistoryError(e instanceof Error?e.message:'Erreur de chargement');
    } finally {setWithdrawalHistoryLoading(false);}
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

  const openDeletionReview = (listing: ListingItem) => {
    deletePreviewSequence.current += 1;
    publicRemovalSequence.current += 1;
    setDeleteReport(null);
    setDeleteReportError('');
    setDeleteImpactLoading(false);
    setPublicRemovalPreview(null);
    setPublicRemovalPreviewLoading(false);
    setPublicRemovalPreviewError('');
    setPublicRemovalApplying(false);
    setPublicRemovalApplyError('');
    setPublicRemovalResult(null);
    setConfirmDelete(listing);
  };

  const closeDeletionReview = () => {
    deletePreviewSequence.current += 1;
    publicRemovalSequence.current += 1;
    setConfirmDelete(null);
    setDeleteReport(null);
    setDeleteReportError('');
    setDeleteImpactLoading(false);
    setPublicRemovalPreview(null);
    setPublicRemovalPreviewLoading(false);
    setPublicRemovalPreviewError('');
    setPublicRemovalApplying(false);
    setPublicRemovalApplyError('');
    setPublicRemovalResult(null);
  };

  const handlePreviewPublicRemoval = async () => {
    const target=confirmDelete;
    if(!target || publicRemovalPreviewLoading || publicRemovalApplying) return;
    const requestId=++publicRemovalSequence.current;
    setPublicRemovalPreview(null);
    setPublicRemovalPreviewError('');
    setPublicRemovalPreviewLoading(true);
    try {
      if(!user) throw new Error('Session absente.');
      const token=await user.getIdToken();
      if(requestId!==publicRemovalSequence.current) return;
      const response=await fetch('/api/admin/retrait-public',{
        method:'POST',cache:'no-store',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify({action:'preview',collection:target.collection,id:target.id}),
      });
      const body:unknown=await response.json();
      if(requestId!==publicRemovalSequence.current) return;
      if(!response.ok || !body || typeof body!=='object' || !('ok' in body) || body.ok!==true)
        throw new Error(body && typeof body==='object' && 'error' in body && typeof body.error==='string'
          ? body.error : 'Contrôle ciblé indisponible');
      const plan=body as unknown as PublicRemovalPreview;
      if(!plan.target || plan.target.collection!==target.collection || plan.target.id!==target.id
        || typeof plan.fichePresente!=='boolean' || typeof plan.cacheLiveConflit!=='boolean'
        || !Array.isArray(plan.indexes) || plan.indexes.length!==2 || !Array.isArray(plan.nonVerifies)
        || typeof plan.cacheLivePresente!=='boolean' || typeof plan.actionAutorisee!=='boolean'
        || !plan.mediaAudit || typeof plan.mediaAudit.retraitBloque!=='boolean'
        || typeof plan.mediaAudit.urlsSousControleLabelMoto!=='number'
        || typeof plan.mediaAudit.demandesActivesAExaminer!=='number')
        throw new Error('Réponse du contrôle public invalide');
      setPublicRemovalPreview(plan);
    }catch(e:unknown){
      if(requestId===publicRemovalSequence.current)
        setPublicRemovalPreviewError(e instanceof Error?e.message:'Contrôle indisponible');
    }finally{
      if(requestId===publicRemovalSequence.current) setPublicRemovalPreviewLoading(false);
    }
  };

  const handleApplyPublicRemoval = async (reason: 'owner_request'|'other') => {
    const target=confirmDelete;
    if(!target || !publicRemovalPreview?.actionAutorisee || publicRemovalApplying || publicRemovalResult) return;
    const requestId=++publicRemovalSequence.current;
    setPublicRemovalApplying(true);
    setPublicRemovalApplyError('');
    try {
      if(!user) throw new Error('Session absente.');
      const token=await user.getIdToken();
      if(requestId!==publicRemovalSequence.current) return;
      const response=await fetch('/api/admin/retrait-public',{
        method:'POST',cache:'no-store',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify({action:'apply',collection:target.collection,id:target.id,
          confirm:`RETIRER_PUBLIC:${target.collection}/${target.id}`,reason}),
      });
      const body:unknown=await response.json();
      if(requestId!==publicRemovalSequence.current) return;
      if(!response.ok || !body || typeof body!=='object' || !('ok' in body) || body.ok!==true)
        throw new Error(body && typeof body==='object' && 'error' in body && typeof body.error==='string'
          ? body.error : 'Retrait interrompu : examen manuel nécessaire');
      const result=body as PublicRemovalResult;
      if(!result.publicFirestoreAndIndexesRemoved || !result.publicLiveCacheRemoved
        || result.fullyInvisibleOnInternet!==false || !Array.isArray(result.remaining))
        throw new Error('Réponse de vérification incomplète : examen manuel nécessaire');
      setPublicRemovalResult(result);
      setAllListings(previous=>previous.filter(item=>
        !(item.collection===target.collection && item.id===target.id)));
      toast({title:'Sources publiques retirées',description:'Médias, caches externes et Google restent à vérifier.'});
    }catch(e:unknown){
      if(requestId===publicRemovalSequence.current)
        setPublicRemovalApplyError(e instanceof Error?e.message:'État incertain : revue nécessaire');
    }finally{
      if(requestId===publicRemovalSequence.current) setPublicRemovalApplying(false);
    }
  };

  const handlePreviewProDeletion = async () => {
    if (!confirmDelete) return;
    const requestId = ++deletePreviewSequence.current;
    setDeleteImpactLoading(true);
    setDeleteReport(null);
    setDeleteReportError('');
    try {
      if (!user) throw new Error('Session absente. Reconnecte-toi.');
      const token = await user.getIdToken();
      if (requestId !== deletePreviewSequence.current) return;
      const response = await fetch('/api/admin/suppression-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'preview', collection: confirmDelete.collection, id: confirmDelete.id }),
      });
      const result: unknown = await response.json();
      if (requestId !== deletePreviewSequence.current) return;
      if (!response.ok) {
        const msg = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
          ? result.error : 'Pré-audit impossible';
        throw new Error(msg);
      }
      const report = parseProDeletionReviewV20(result, confirmDelete.collection, confirmDelete.id);
      setDeleteReport(report);
      toast({ title: 'Pré-audit partiel affiché', description: 'Lecture seule. Aucune suppression autorisée.' });
    } catch (error: unknown) {
      if (requestId !== deletePreviewSequence.current) return;
      setDeleteReportError(error instanceof Error ? error.message : 'Pré-audit indisponible');
    } finally {
      if (requestId === deletePreviewSequence.current) setDeleteImpactLoading(false);
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

      {/* Historique privé des retraits, intégré à cette même page d'administration. */}
      {!editorOnly && (
        <section className="mb-6 rounded-2xl border bg-background p-4" aria-label="Historique des suppressions">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <History className="h-5 w-5 text-brand shrink-0" />
              <div>
                <p className="text-sm font-black">Historique des suppressions</p>
                <p className="text-xs text-muted-foreground">Archives privées des retraits publics, sur cette page.</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={()=>{
              setWithdrawalHistoryVisible(!withdrawalHistoryVisible);
              if(withdrawalHistoryVisible) setWithdrawalHistoryConsent(false);
            }}>{withdrawalHistoryVisible?'Masquer':'Afficher'}</Button>
          </div>
          {withdrawalHistoryVisible && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Consultation limitée aux 20 derniers retraits. Une lecture Firestore peut être facturée ;
                rien n'est chargé automatiquement.
              </p>
              <label className="flex items-start gap-2 text-xs">
                <input type="checkbox" className="mt-0.5" checked={withdrawalHistoryConsent}
                  onChange={e=>setWithdrawalHistoryConsent(e.target.checked)} />
                J'autorise la lecture ciblée de l'historique (20 entrées maximum).
              </label>
              <Button type="button" variant="outline" size="sm"
                disabled={!withdrawalHistoryConsent || withdrawalHistoryLoading}
                onClick={loadWithdrawalHistory}>
                {withdrawalHistoryLoading?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:<RefreshCw className="mr-2 h-4 w-4" />}
                {withdrawalHistoryLoaded?'Actualiser l’historique':'Charger l’historique'}
              </Button>
              {withdrawalHistoryError && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  {withdrawalHistoryError}
                </p>
              )}
              {withdrawalHistoryLoaded && withdrawalHistoryRecords.length===0 && (
                <p className="text-xs text-muted-foreground">Aucun retrait enregistré dans ce nouveau journal.
                  Les anciennes suppressions n'y sont pas ajoutées automatiquement.</p>
              )}
              {withdrawalHistoryLoaded && withdrawalHistoryRecords.length>0 && (
                <div className="space-y-2">
                  {withdrawalHistoryRecords.map(item=>(
                    <div key={item.id} className="rounded-xl border p-3 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold break-words">{item.title}</p>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {item.createdAt?new Date(item.createdAt).toLocaleDateString('fr-FR'):'Date inconnue'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.city?`${item.city} · `:''}{item.collection} · {item.docId}</p>
                      <p className="text-xs break-all">Ancienne URL : {item.oldPath||'Non renseignée'}</p>
                      <p className="text-xs">Motif : {item.reason==='owner_request'?'Demande du professionnel':'Autre motif'}</p>
                      <p className="text-xs font-semibold">
                        {item.status==='sources_removed_to_verify'
                          ? 'Fiche et index retirés — URLs, médias et Google à vérifier'
                          : 'Opération en attente ou incomplète — examen requis'}
                      </p>
                      <div className="mt-2 space-y-2">
                        <Button type="button" variant="outline" size="sm"
                          disabled={!withdrawalHistoryConsent || !!withdrawalDiagnosisBusy}
                          onClick={()=>inspectWithdrawal(item)}>
                          {withdrawalDiagnosisBusy===item.id?'Diagnostic en cours…':'Diagnostiquer ce retrait (lectures ciblées)'}
                        </Button>
                        {withdrawalDiagnosisErrors[item.id] && <p role="alert" className="text-xs text-red-700">{withdrawalDiagnosisErrors[item.id]}</p>}
                        {withdrawalDiagnoses[item.id] && <div className="rounded-lg border p-2 text-xs space-y-1" role="status">
                          <p className="font-semibold">{withdrawalDiagnoses[item.id].state==='sources_removed_to_verify'
                            ? 'Sources principales déclarées retirées — contrôle externe restant'
                            : withdrawalDiagnoses[item.id].state==='manual_review'
                              ? 'Opération incomplète ou incohérente — intervention manuelle obligatoire'
                              : 'Aucune trace trouvée — ne pas conclure à une suppression réussie'}</p>
                          <p>Historique : {withdrawalDiagnoses[item.id].history.status||'absent'}</p>
                          <p>Sauvegarde : {withdrawalDiagnoses[item.id].backup.status||'absente'}</p>
                          <p>Verrou d’index partagé : {withdrawalDiagnoses[item.id].sharedIndexLock.status||'absent'} (peut concerner un autre professionnel)</p>
                          <p>Diagnostic partiel. Aucun contrôle Google/CDN ni scan des médias. Aucune reprise automatique.</p>
                        </div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

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
              <button type="button" aria-label={`Revoir la suppression de ${l.title}`} onClick={() => openDeletionReview(l)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
        <ProDeletionReviewV20
          key={`${confirmDelete.collection}/${confirmDelete.id}`}
          title={confirmDelete.title}
          collection={confirmDelete.collection}
          id={confirmDelete.id}
          report={deleteReport}
          loading={deleteImpactLoading}
          error={deleteReportError}
          onPreview={handlePreviewProDeletion}
          publicPreview={publicRemovalPreview}
          publicPreviewLoading={publicRemovalPreviewLoading}
          publicPreviewError={publicRemovalPreviewError}
          publicApplying={publicRemovalApplying}
          publicApplyError={publicRemovalApplyError}
          publicResult={publicRemovalResult}
          onPublicPreview={handlePreviewPublicRemoval}
          onPublicApply={handleApplyPublicRemoval}
          onClose={closeDeletionReview}
        />
      )}
    </div>
  );
}

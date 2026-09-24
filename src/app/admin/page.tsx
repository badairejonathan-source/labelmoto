'use client';

import { useState, useEffect } from 'react';
import { useFirebase, useMemoFirebase, useCollection } from '@/firebase/client';
import { 
  collection, query, getDocs, getDocsFromServer, doc, orderBy, where,
  limit 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, CheckCircle, ArrowLeft, 
  Store, Search, ChevronRight, X, ExternalLink, Pencil,
  Trash2, Zap, Globe, Phone, MapPin, Instagram, Eye, Info, Save, History,
  Database, AlertTriangle, FileSearch, ClipboardCheck, Terminal, Copy
} from 'lucide-react';
import {
  LayoutDashboard as AdminDashboardIcon,
  ClipboardList as AdminRequestsIcon,
  Store as AdminProfessionalsIcon,
  BarChart3 as AdminStatsIcon,
  Target as AdminProspectIcon,
  Settings as AdminToolsIcon,
} from 'lucide-react';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/client';
import { addDoc, updateDoc, getDoc, getCountFromServer, getAggregateFromServer, sum, writeBatch } from 'firebase/firestore';
import { cn, generateDealershipSlug } from '@/lib/utils';
import { extractValidCoordinates, encodeGeohash } from '@/lib/geohash';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { errorEmitter } from '@/firebase/client';
import { FirestorePermissionError } from '@/firebase/client';
import { loadPublicSeoPros } from '@/lib/public-seo-pros';

function AdminModuleLoader() {
  return (
    <div className="flex min-h-[220px] items-center justify-center text-xs font-black uppercase tracking-widest text-muted-foreground">
      Chargement du module...
    </div>
  );
}

const AdminProspection = dynamic(
  () => import('@/components/app/admin-prospection'),
  { ssr: false, loading: AdminModuleLoader }
);

const AdminStats = dynamic(
  () => import('@/components/app/admin-stats'),
  { ssr: false, loading: AdminModuleLoader }
);

const AdminUsers = dynamic(
  () => import('@/components/app/admin-users'),
  { ssr: false, loading: AdminModuleLoader }
);

const AdminImageRequests = dynamic(
  () => import('@/components/app/admin-image-requests'),
  { ssr: false, loading: AdminModuleLoader }
);

const ListingsManager = dynamic(
  () => import('@/components/app/listings-manager'),
  { ssr: false, loading: AdminModuleLoader }
);

const AddListing = dynamic(
  () => import('@/components/app/add-listing'),
  { ssr: false, loading: AdminModuleLoader }
);

const AdminListingArchive = dynamic(
  () => import('@/components/app/admin-listing-archive'),
  { ssr: false, loading: AdminModuleLoader }
);
const ModificationRequests = dynamic(
  () => import('@/components/app/modification-requests'),
  { ssr: false, loading: AdminModuleLoader }
);

interface Submission {
  id: string;
  businessName: string;
  categoryRequested: string;
  appSectionRequested: 'shopping' | 'service' | 'both' | 'association' | 'relais';
  addressRaw: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  imageUrl?: string;
  googleMapsUrl?: string;
  horaires?: Record<string, string>;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'published';
  createdAt?: any;
  slugCandidate?: string;
  notesAdmin?: string;
  publishedCollection?: string;
  publishedDocId?: string;
  publishedAt?: any;
  publishTargetId?: string;
  [key: string]: any;
}

interface MigrationStats {
  totalAuthEstimate: number;
  usersCount: number;
  stdCount: number;
  proCount: number;
  toMigrate: any[];
}

function buildAdminDraftSnapshot(submission: Submission) {
  // Keep audit snapshots flat: the original submittedData stays immutable on the
  // submission document, while adminDraft contains only the working version.
  const {
    id: _id,
    submittedData: _submittedData,
    adminDraft: _previousAdminDraft,
    publishedData: _publishedData,
    ...draft
  } = submission;

  return draft;
}

const ADMIN_REALTIME_LIMIT = 100;
const ADMIN_PRO_COLLECTIONS = [
  'concessions',
  'associations',
  'relais',
  'creators',
] as const;

function normalizeDuplicateText(value: unknown): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeDuplicatePhone(value: unknown): string {
  const digits = String(value || '').replace(/\D+/g, '');
  if (digits.startsWith('33') && digits.length === 11) return `0${digits.slice(2)}`;
  return digits;
}

function duplicateTokens(value: unknown): string[] {
  return normalizeDuplicateText(value)
    .split(' ')
    .filter(token => token.length >= 2 && token !== 'france');
}

const ADDRESS_NOISE_TOKENS = new Set([
  'rue', 'avenue', 'av', 'boulevard', 'bd', 'route', 'chemin', 'impasse',
  'place', 'allee', 'quai', 'cours', 'passage', 'lotissement', 'lot',
  'de', 'du', 'des', 'la', 'le', 'les', 'sur', 'sous', 'aux', 'au', 'en',
]);

function addressDuplicateTokens(value: unknown): string[] {
  return duplicateTokens(value).filter(
    token => !ADDRESS_NOISE_TOKENS.has(token) && !/^\d+$/.test(token)
  );
}

function levenshteinDistance(left: string, right: string): number {
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = new Array<number>(right.length + 1);

  for (let i = 1; i <= left.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const substitutionCost = left[i - 1] === right[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + substitutionCost
      );
    }
    for (let j = 0; j <= right.length; j += 1) previous[j] = current[j];
  }

  return previous[right.length];
}

function fuzzyTokenArraySimilarity(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;

  const used = new Set<number>();
  let matches = 0;

  for (const token of a) {
    let bestIndex = -1;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < b.length; index += 1) {
      if (used.has(index)) continue;
      const candidate = b[index];

      if (candidate === token) {
        bestIndex = index;
        bestDistance = 0;
        break;
      }

      const longest = Math.max(token.length, candidate.length);
      if (longest < 4) continue;

      const distance = levenshteinDistance(token, candidate);
      const allowedDistance = longest >= 8 ? 2 : 1;
      if (distance <= allowedDistance && distance < bestDistance) {
        bestIndex = index;
        bestDistance = distance;
      }
    }

    if (bestIndex >= 0) {
      used.add(bestIndex);
      matches += 1;
    }
  }

  return matches / Math.max(a.length, b.length);
}

function fuzzyTokenSimilarity(left: unknown, right: unknown): number {
  return fuzzyTokenArraySimilarity(duplicateTokens(left), duplicateTokens(right));
}

function fuzzyAddressSimilarity(left: unknown, right: unknown): number {
  return fuzzyTokenArraySimilarity(addressDuplicateTokens(left), addressDuplicateTokens(right));
}

function extractPostalCode(value: unknown): string {
  return String(value || '').match(/\b\d{5}\b/)?.[0] || '';
}

function extractStreetNumber(value: unknown): string {
  const normalized = normalizeDuplicateText(value);
  const postal = extractPostalCode(value);
  return normalized
    .split(' ')
    .find(token => /^\d{1,4}$/.test(token) && token !== postal) || '';
}

function scoreDuplicateCandidate(submission: Submission, candidate: any) {
  let score = 0;
  const reasons: string[] = [];

  const submissionOwner = String(submission.requestedByUid || '').trim();
  const candidateOwner = String(candidate.ownerUid || '').trim();
  const sameOwner = !!submissionOwner && !!candidateOwner && submissionOwner === candidateOwner;
  if (sameOwner) {
    score += 10;
    reasons.push('Même compte pro');
  }

  const submissionPhone = normalizeDuplicatePhone(submission.phone);
  const candidatePhone = normalizeDuplicatePhone(candidate.phoneNumber || candidate.phone);
  const samePhone = submissionPhone.length >= 8 && candidatePhone.length >= 8 && submissionPhone === candidatePhone;
  if (samePhone) {
    score += 100;
    reasons.push('Même téléphone');
  }

  const submissionEmail = String(submission.email || '').trim().toLowerCase();
  const candidateEmail = String(candidate.email || '').trim().toLowerCase();
  const sameEmail = !!submissionEmail && !!candidateEmail && submissionEmail === candidateEmail;
  if (sameEmail) {
    score += 15;
    reasons.push('Même e-mail');
  }

  const submissionAddressRaw = submission.addressRaw || '';
  const candidateAddressRaw = candidate.address || candidate.addressRaw || candidate.addr || '';
  const submissionAddress = normalizeDuplicateText(submissionAddressRaw);
  const candidateAddress = normalizeDuplicateText(candidateAddressRaw);
  const addressSimilarity = fuzzyAddressSimilarity(submissionAddress, candidateAddress);

  const submissionPostal = extractPostalCode(submissionAddressRaw);
  const candidatePostal = extractPostalCode(candidateAddressRaw);
  const samePostal = !!submissionPostal && !!candidatePostal && submissionPostal === candidatePostal;

  const submissionStreetNumber = extractStreetNumber(submissionAddressRaw);
  const candidateStreetNumber = extractStreetNumber(candidateAddressRaw);
  const sameStreetNumber = !!submissionStreetNumber && !!candidateStreetNumber && submissionStreetNumber === candidateStreetNumber;

  const exactAddress = !!submissionAddress && !!candidateAddress && submissionAddress === candidateAddress;
  const stronglyMatchingAddress = exactAddress || (
    samePostal &&
    sameStreetNumber &&
    addressSimilarity >= 0.68
  ) || (
    samePostal &&
    addressSimilarity >= 0.84
  );
  const closeAddress = !stronglyMatchingAddress && addressSimilarity >= 0.72 && (samePostal || sameStreetNumber);

  if (stronglyMatchingAddress) {
    score += exactAddress ? 105 : 90;
    reasons.push('Même adresse');
  } else if (closeAddress) {
    score += 55;
    reasons.push('Adresse proche');
  }

  if (samePostal) score += 5;

  const submissionName = normalizeDuplicateText(submission.businessName || submission.displayName);
  const candidateName = normalizeDuplicateText(candidate.title || candidate.businessName || candidate.displayName);
  const nameSimilarity = fuzzyTokenSimilarity(submissionName, candidateName);
  const sameName = !!submissionName && !!candidateName && submissionName === candidateName;
  const closeName = !sameName && nameSimilarity >= 0.74;

  if (sameName) {
    score += 70;
    reasons.push('Même nom');
  } else if (closeName) {
    score += 45;
    reasons.push('Nom proche');
  }

  // E-mail et compte propriétaire sont utiles pour enrichir le diagnostic,
  // mais ne suffisent jamais seuls à qualifier deux établissements de doublons.
  const strongDuplicateSignal = samePhone || stronglyMatchingAddress;
  const localNameSignal = (sameName || closeName) && (samePostal || closeAddress || addressSimilarity >= 0.58);
  const multiBusinessSignal = closeAddress && (sameName || closeName || samePhone);
  const eligible = strongDuplicateSignal || localNameSignal || multiBusinessSignal;

  const confidence = strongDuplicateSignal || (sameName && stronglyMatchingAddress)
    ? 'very_likely'
    : 'likely';

  return {
    score,
    reasons,
    eligible,
    confidence,
  };
}

export default function AdminPage() {
  const { firestore, user, profile, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Submission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  const [isAuditing, setIsAuditing] = useState(false);
  const [migrationStats, setMigrationStats] = useState<MigrationStats | null>(null);

  const isAdmin = profile?.role === 'admin';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [listingEditTarget, setListingEditTarget] = useState<{ collection: string; id: string } | null>(null);

  useEffect(() => {
    if (!isAdmin || typeof window === 'undefined') {
      return;
    }

    const params =
      new URLSearchParams(window.location.search);

    const editCollection =
      (params.get('editCollection') || '').trim();

    const editId =
      (params.get('editId') || '').trim();

    if (!editCollection || !editId) {
      return;
    }

    const allowedCollections =
      new Set([
        'concessions',
        'associations',
        'relais',
        'creators',
      ]);

    if (!allowedCollections.has(editCollection)) {
      return;
    }

    setListingEditTarget(current => {
      if (
        current?.collection === editCollection &&
        current?.id === editId
      ) {
        return current;
      }

      return {
        collection: editCollection,
        id: editId,
      };
    });
  }, [isAdmin]);

  const [dashboardCounts, setDashboardCounts] = useState<{
    submissions: number;
    comments: number;
    modifs: number;
    fiches: number;
    tel: number;
    web: number;
    instagram: number;
    itineraire: number;
    vues: number;
    interactions: number;
    mapGap: number;
  } | null>(null);

  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin || (activeTab !== 'submissions' && activeTab !== 'history')) return null;

    const submissionsRef = collection(firestore, 'listing_submissions');
    const statuses = activeTab === 'submissions'
      ? ['pending', 'in_review', 'approved']
      : ['published', 'rejected'];

    return query(
      submissionsRef,
      where('status', 'in', statuses),
      limit(ADMIN_REALTIME_LIMIT)
    );
  }, [firestore, isAdmin, activeTab]);

  const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<Submission>(submissionsQuery);
  const [serverSubmissions, setServerSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (!firestore || !isAdmin || (activeTab !== 'submissions' && activeTab !== 'history')) {
      setServerSubmissions([]);
      return;
    }

    let cancelled = false;
    const statuses = activeTab === 'submissions'
      ? ['pending', 'in_review', 'approved']
      : ['published', 'rejected'];

    // Lecture explicite depuis le serveur en plus du listener temps reel.
    // Cela evite qu'une demande creee via Firebase Admin SDK reste invisible
    // a cause d'un cache local Firestore ancien dans le navigateur admin.
    getDocsFromServer(
      query(
        collection(firestore, 'listing_submissions'),
        where('status', 'in', statuses),
        limit(ADMIN_REALTIME_LIMIT)
      )
    )
      .then((snapshot) => {
        if (cancelled) return;
        setServerSubmissions(
          snapshot.docs.map((snapshotDoc) => ({
            ...(snapshotDoc.data() as Submission),
            id: snapshotDoc.id,
          }))
        );
      })
      .catch((error) => {
        if (!cancelled) {
          console.warn('[ADMIN] Lecture serveur des demandes impossible:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [firestore, isAdmin, activeTab]);

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin || activeTab !== 'comments') return null;
    return query(collection(firestore, 'pending_comments'), orderBy('date', 'desc'), limit(ADMIN_REALTIME_LIMIT));
  }, [firestore, isAdmin, activeTab]);

  const { data: pendingComments } = useCollection(commentsQuery);

  const handleApproveComment = async (c: any) => {
    if (!firestore) return;
    const targetCollectionRef =
      c.targetType === 'motorcycle_sheet'
        ? collection(
            firestore,
            'motorcycle_sheets',
            c.dealershipId,
            'comments'
          )
        : collection(
            firestore,
            'concessions',
            c.dealershipId,
            'comments'
          );

    try {
      addDocumentNonBlocking(targetCollectionRef, {
        userId: c.userId,
        userName: c.userName,
        rating: c.rating,
        content: c.content,
        date: c.date,
      });
      deleteDocumentNonBlocking(doc(firestore, 'pending_comments', c.id));
      addDocumentNonBlocking(collection(firestore, 'listing_history'), {
        listingKey: `${c.targetType === 'motorcycle_sheet' ? 'motorcycle_sheets' : 'concessions'}/${c.dealershipId}`,
        targetCollection: c.targetType === 'motorcycle_sheet' ? 'motorcycle_sheets' : 'concessions',
        targetId: c.dealershipId,
        eventType: 'review_published',
        summary: `Avis publié : ${c.rating}/5 par ${c.userName}`,
        reviewId: c.id,
        rating: c.rating,
        actorType: 'admin',
        actorUid: user?.uid || '',
        createdAt: new Date(),
      });
      toast({ title: 'Avis publié', description: `L'avis de ${c.userName} est maintenant visible.` });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de publier l'avis." });
    }
  };

  const handleRejectComment = (c: any) => {
    if (!firestore) return;
    addDocumentNonBlocking(collection(firestore, 'listing_history'), {
      listingKey: `${c.targetType === 'motorcycle_sheet' ? 'motorcycle_sheets' : 'concessions'}/${c.dealershipId}`,
      targetCollection: c.targetType === 'motorcycle_sheet' ? 'motorcycle_sheets' : 'concessions',
      targetId: c.dealershipId,
      eventType: 'review_rejected',
      summary: `Avis refusé : ${c.rating}/5 par ${c.userName}`,
      reviewId: c.id,
      rating: c.rating,
      actorType: 'admin',
      actorUid: user?.uid || '',
      createdAt: new Date(),
    });
    deleteDocumentNonBlocking(doc(firestore, 'pending_comments', c.id));
    toast({ title: 'Avis rejeté', description: `L'avis de ${c.userName} a été supprimé.` });
  };

  const modifsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin || activeTab !== 'modifs') return null;
    return query(collection(firestore, 'modification_requests'), where('status', '==', 'pending'), limit(ADMIN_REALTIME_LIMIT));
  }, [firestore, isAdmin, activeTab]);
  const { data: pendingModifs } = useCollection(modifsQuery);
  useEffect(() => {
    if (!firestore || !isAdmin || activeTab !== 'dashboard') return;

    let cancelled = false;

    const loadDashboardCounts = async () => {
      setDashboardCounts(null);

      try {
        const [
          submissionsCount,
          commentsCount,
          modifsCount,
          proAggregates,
          mapCacheSnapshot,
        ] = await Promise.all([
          getCountFromServer(
            query(
              collection(firestore, 'listing_submissions'),
              where('status', 'in', ['pending', 'in_review', 'approved'])
            )
          ),

          getCountFromServer(
            collection(firestore, 'pending_comments')
          ),

          getCountFromServer(
            query(
              collection(firestore, 'modification_requests'),
              where('status', '==', 'pending')
            )
          ),

          Promise.all(
            ADMIN_PRO_COLLECTIONS.map(async collectionName => {
              const collectionRef =
                collection(firestore, collectionName);

              const [
                countSnapshot,
                telSnapshot,
                webSnapshot,
                instagramSnapshot,
                itineraireSnapshot,
                vuesSnapshot,
              ] = await Promise.all([
                getCountFromServer(collectionRef),

                getAggregateFromServer(
                  collectionRef,
                  {
                    tel: sum('stats_tel'),
                  }
                ),

                getAggregateFromServer(
                  collectionRef,
                  {
                    web: sum('stats_web'),
                  }
                ),

                getAggregateFromServer(
                  collectionRef,
                  {
                    instagram: sum('stats_instagram'),
                  }
                ),

                getAggregateFromServer(
                  collectionRef,
                  {
                    itineraire: sum('stats_itineraire'),
                  }
                ),

                getAggregateFromServer(
                  collectionRef,
                  {
                    vues: sum('stats_vues'),
                  }
                ),
              ]);

              return {
                fiches: countSnapshot.data().count,

                stats: {
                  tel: telSnapshot.data().tel,
                  web: webSnapshot.data().web,
                  instagram:
                    instagramSnapshot.data().instagram,
                  itineraire:
                    itineraireSnapshot.data().itineraire,
                  vues: vuesSnapshot.data().vues,
                },
              };
            })
          ),

          getDoc(
            doc(firestore, 'cache', 'map_points')
          ),
        ]);

        if (cancelled) return;

        const proTotals = {
          fiches: 0,
          tel: 0,
          web: 0,
          instagram: 0,
          itineraire: 0,
          vues: 0,
        };

        for (const aggregate of proAggregates) {
          const data = aggregate.stats;

          proTotals.fiches += Number(aggregate.fiches || 0);
          proTotals.tel += Number(data.tel || 0);
          proTotals.web += Number(data.web || 0);
          proTotals.instagram += Number(data.instagram || 0);
          proTotals.itineraire += Number(data.itineraire || 0);
          proTotals.vues += Number(data.vues || 0);
        }

        const interactions =
          proTotals.tel +
          proTotals.web +
          proTotals.instagram +
          proTotals.itineraire;

        const mapPointsCount =
          mapCacheSnapshot.exists()
            ? Number(mapCacheSnapshot.data()?.count || 0)
            : 0;

        const mapGap =
          Math.max(
            0,
            proTotals.fiches - mapPointsCount
          );

        setDashboardCounts({
          submissions: submissionsCount.data().count,
          comments: commentsCount.data().count,
          modifs: modifsCount.data().count,
          fiches: proTotals.fiches,
          tel: proTotals.tel,
          web: proTotals.web,
          instagram: proTotals.instagram,
          itineraire: proTotals.itineraire,
          vues: proTotals.vues,
          interactions,
          mapGap,
        });
      } catch (error) {
        console.error(
          'Erreur compteurs dashboard admin:',
          error
        );

        if (!cancelled) {
          setDashboardCounts(null);
        }
      }
    };

    void loadDashboardCounts();

    return () => {
      cancelled = true;
    };
  }, [firestore, isAdmin, activeTab]);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login?callbackUrl=/admin');
      } else if (profile && profile.role !== 'admin') {
        toast({ variant: "destructive", title: "Accès refusé", description: "Vous n'avez pas les droits administrateur." });
        router.push('/');
      }
    }
  }, [user, profile, isUserLoading, router, toast]);

  const runAudit = async () => {
    if (!firestore) return;
    setIsAuditing(true);
    
    try {
      const [usersSnap, stdSnap, proSnap] = await Promise.all([
        getDocs(collection(firestore, 'users')),
        getDocs(collection(firestore, 'standardProfiles')),
        getDocs(collection(firestore, 'professionalProfiles'))
      ]);

      const usersIds = new Set(usersSnap.docs.map(d => d.id));
      const toMigrate: any[] = [];

      stdSnap.forEach(docSnap => {
        if (!usersIds.has(docSnap.id)) {
          toMigrate.push({ uid: docSnap.id, source: 'standard', name: docSnap.data().pseudo || 'Motard' });
          usersIds.add(docSnap.id);
        }
      });

      proSnap.forEach(docSnap => {
        if (!usersIds.has(docSnap.id)) {
          toMigrate.push({ uid: docSnap.id, source: 'professional', name: docSnap.data().companyName || 'Pro' });
          usersIds.add(docSnap.id);
        }
      });

      setMigrationStats({
        totalAuthEstimate: usersSnap.size + toMigrate.length,
        usersCount: usersSnap.size,
        stdCount: stdSnap.size,
        proCount: proSnap.size,
        toMigrate,
      });

    } catch (e: any) {
        if (e.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: 'users_audit',
            operation: 'list'
          }));
        }
    } finally {
      setIsAuditing(false);
    }
  };

  const findDuplicates = async (submission: Submission) => {
    if (!firestore) return;

    setDuplicates([]);

    const collections = ['concessions', 'associations', 'relais', 'creators'];
    const matchMap = new Map<string, any>();

    const mergeCandidate = (candidate: any, forcedReasons: string[] = []) => {
      const colName = String(candidate.col || candidate.collection || candidate.sourceCollection || '');
      const id = String(candidate.id || '');
      if (!colName || !id) return;

      const scored = scoreDuplicateCandidate(submission, candidate);
      if (!scored.eligible) return;

      const reasons = Array.from(new Set([...(candidate.matchReasons || []), ...forcedReasons, ...scored.reasons]));
      const score = Math.max(Number(candidate.matchScore || 0), scored.score);
      const key = `${colName}/${id}`;
      const previous = matchMap.get(key);

      matchMap.set(key, {
        ...(previous || {}),
        ...candidate,
        id,
        col: colName,
        matchScore: Math.max(Number(previous?.matchScore || 0), score),
        matchConfidence:
          previous?.matchConfidence === 'very_likely' || scored.confidence === 'very_likely'
            ? 'very_likely'
            : 'likely',
        matchReasons: Array.from(new Set([...(previous?.matchReasons || []), ...reasons])),
      });
    };

    const directCriteria: Array<{ field: string; value: string; reason: string }> = [];

    if (submission.phone?.trim()) {
      directCriteria.push({ field: 'phoneNumber', value: submission.phone.trim(), reason: 'Même téléphone' });
    }

    if (submission.email?.trim()) {
      directCriteria.push({ field: 'email', value: submission.email.trim().toLowerCase(), reason: 'Même e-mail' });
    }

    if (submission.addressRaw?.trim()) {
      directCriteria.push({ field: 'address', value: submission.addressRaw.trim(), reason: 'Même adresse' });
    }

    if (submission.requestedByUid?.trim()) {
      directCriteria.push({ field: 'ownerUid', value: submission.requestedByUid.trim(), reason: 'Même compte pro' });
    }

    // 1) Critères forts sur les documents Firestore réels.
    for (const colName of collections) {
      for (const criterion of directCriteria) {
        try {
          const snap = await getDocs(
            query(
              collection(firestore, colName),
              where(criterion.field, '==', criterion.value),
              limit(10)
            )
          );

          snap.forEach((candidateDoc: any) => {
            mergeCandidate(
              { id: candidateDoc.id, ...candidateDoc.data(), col: colName },
              [criterion.reason]
            );
          });
        } catch (err: any) {
          if (err.code === 'permission-denied') {
            console.warn(`Détection doublon non autorisée sur ${colName}.${criterion.field}`);
          } else {
            console.warn(`Détection doublon incomplète sur ${colName}.${criterion.field} :`, err);
          }
        }
      }
    }

    // 2) Index public : permet de détecter les variantes de casse, ponctuation
    // et noms différents lorsque l'adresse correspond réellement.
    try {
      const publicPros = await loadPublicSeoPros();
      publicPros.forEach(pro => {
        mergeCandidate({
          ...pro,
          col: pro.collection,
        });
      });
    } catch (err) {
      console.warn('Index public indisponible pour la détection de doublons :', err);
    }

    // 3) Index live : couvre immédiatement les fiches publiées récemment,
    // avant la prochaine régénération de seo-pros.json.
    try {
      const liveSnap = await getDocs(
        query(
          collection(firestore, 'cache'),
          where('kind', '==', 'map_point_live')
        )
      );

      liveSnap.forEach((liveDoc: any) => {
        const data = liveDoc.data();
        mergeCandidate({
          id: String(data.id || ''),
          col: String(data.sourceCollection || ''),
          title: String(data.t || ''),
          address: String(data.addr || ''),
          category: String(data.c || ''),
        });
      });
    } catch (err) {
      console.warn('Index live indisponible pour la détection de doublons :', err);
    }

    const sorted = Array.from(matchMap.values())
      .sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0))
      .slice(0, 12);

    setDuplicates(sorted);
  };

  const handleOpenDetail = (sub: Submission) => {
    setSelectedId(sub.id);
    setEditDraft({ ...sub });
    setIsDetailOpen(true);
    findDuplicates(sub);
  };

  const handleUpdateStatus = (newStatus: Submission['status']) => {
    if (!firestore || !selectedId) return;
    updateDocumentNonBlocking(doc(firestore, 'listing_submissions', selectedId), { 
        status: newStatus, 
        updatedAt: new Date(),
        reviewedBy: user?.uid,
        reviewedAt: new Date()
    });
    setEditDraft(prev => prev ? { ...prev, status: newStatus } : null);
    toast({ title: `Statut mis à jour : ${newStatus}` });
  };

  const handleSaveDraft = () => {
    if (!firestore || !editDraft) return;

    const adminDraft = buildAdminDraftSnapshot(editDraft);
    updateDocumentNonBlocking(doc(firestore, 'listing_submissions', editDraft.id), {
        ...adminDraft,
        adminDraft,
        updatedAt: new Date()
    });
    toast({ title: "Modifications enregistrées" });
  };

  const handlePublish = async () => {
    if (!firestore || !editDraft) return;

    setIsPublishing(true);

    try {
      const data = editDraft;

      const geocodeAddress =
        data.type === 'creator'
          ? (
              data.hasPublicLocation
                ? (
                    data.publicAddress ||
                    data.address ||
                    data.city ||
                    data.ville ||
                    ''
                  )
                : (
                    data.city ||
                    data.ville ||
                    data.address ||
                    ''
                  )
            )
          : (
              data.addressRaw ||
              ''
            );

      /*
       * =====================================================
       * 1. COORDONNEES OBLIGATOIRES
       * =====================================================
       */

      let coords =
        extractValidCoordinates(
          data
        );

      if (!coords) {
        try {
          const geoRes =
            await fetch(
              '/api/geocode',
              {
                method:
                  'POST',

                headers: {
                  'Content-Type':
                    'application/json',
                },

                body:
                  JSON.stringify({
                    address:
                      geocodeAddress,

                    placeUrl:
                      data.placeUrl,

                    googleMapsUrl:
                      data.googleMapsUrl,
                  }),
              }
            );

          const geoData =
            await geoRes.json();

          if (
            geoRes.ok &&
            geoData.success &&
            Number.isFinite(
              Number(
                geoData.lat
              )
            ) &&
            Number.isFinite(
              Number(
                geoData.lng
              )
            )
          ) {
            coords = {
              lat:
                Number(
                  geoData.lat
                ),

              lng:
                Number(
                  geoData.lng
                ),
            };
          }
        }
        catch (error) {
          console.warn(
            'Géocodage échoué:',
            error
          );
        }
      }

      if (
        !coords ||
        !Number.isFinite(
          Number(
            coords.lat
          )
        ) ||
        !Number.isFinite(
          Number(
            coords.lng
          )
        )
      ) {
        throw new Error(
          "Publication impossible : aucune coordonnée GPS valide n'a pu être déterminée. Vérifie l'adresse ou ajoute une URL Google Maps valide."
        );
      }

      const resolvedCoords = {
        lat:
          Number(
            coords.lat
          ),

        lng:
          Number(
            coords.lng
          ),
      };

      /*
       * =====================================================
       * 2. CIBLE DE PUBLICATION
       * =====================================================
       */

      const generatedSlug =
        generateDealershipSlug({
          title:
            data.businessName,

          address:
            data.addressRaw,
        });

      const targetDocId =
        data.publishTargetId ||
        generatedSlug;

      const isUpdate =
        Boolean(
          data.publishTargetId
        );

      let targetCol =
        data.publishTargetCollection ||
        (data.appSectionRequested ===
        'association'
          ? 'associations'
          : data.appSectionRequested ===
            'relais'
            ? 'relais'
            : 'concessions');

      let publishedDocId =
        targetDocId;

      let publishedData:
        any;

      /*
       * =====================================================
       * 3. DONNEES PUBLIQUES
       * =====================================================
       */

      if (
        data.type ===
        'creator'
      ) {
        targetCol =
          'creators';

        const creatorSlug =
          (
            data.slugCandidate ||
            data.displayName ||
            'creator'
          )
            .toLowerCase()
            .replace(
              /\s+/g,
              '-'
            );

        const creatorDocId =
          data.publishTargetId ||
          creatorSlug;

        publishedDocId =
          creatorDocId;

        const creatorType =
          data.creatorType ||
          data.activite ||
          data.category ||
          'Créateur moto';

        const creatorCity =
          data.city ||
          data.ville ||
          '';

        const creatorSpecialties =
          Array.isArray(
            data.specialties
          )
            ? data.specialties
                .map(
                  (value: any) =>
                    String(
                      value
                    ).trim()
                )
                .filter(Boolean)
            : String(
                data.specialite ||
                  ''
              )
                .split(',')
                .map(
                  (value: string) =>
                    value.trim()
                )
                .filter(Boolean);

        const creatorInstagram =
          data.instagramUrl ||
          data.instagram ||
          '';

        const creatorInfo =
          data.info ||
          data.description ||
          '';

        const creatorPhoto =
          data.photoUrl ||
          data.imgUrl ||
          '';

        const creatorPublicAddress =
          data.hasPublicLocation
            ? (
                data.publicAddress ||
                data.address ||
                ''
              )
            : '';

        const creatorAddress =
          creatorPublicAddress ||
          creatorCity;

        publishedData = {
          title:
            data.title ||
            data.displayName ||
            data.businessName,

          displayName:
            data.displayName ||
            data.title ||
            data.businessName,

          creatorType,

          activite:
            creatorType,

          category:
            creatorType,

          specialties:
            creatorSpecialties,

          specialite:
            creatorSpecialties
              .join(', '),

          city:
            creatorCity,

          ville:
            creatorCity,

          publicLocationLabel:
            data.publicLocationLabel ||
            creatorCity,

          departement:
            data.departement ||
            '',

          serviceArea:
            data.serviceArea ||
            '',

          hasPublicLocation:
            Boolean(
              data.hasPublicLocation
            ),

          publicAddress:
            creatorPublicAddress,

          address:
            creatorAddress,

          instagram:
            creatorInstagram,

          instagramUrl:
            creatorInstagram,

          website:
            data.website ||
            '',

          facebookUrl:
            data.facebookUrl ||
            data.facebook ||
            '',

          phoneNumber:
            data.phoneNumber ||
            data.phone ||
            '',

          email:
            data.email ||
            '',

          info:
            creatorInfo,

          description:
            creatorInfo,

          photoUrl:
            creatorPhoto,

          imgUrl:
            creatorPhoto,

          latitude:
            resolvedCoords.lat,

          longitude:
            resolvedCoords.lng,

          geohash:
            encodeGeohash(
              resolvedCoords.lat,
              resolvedCoords.lng,
              9
            ),

          appSection:
            'creator',

          slug:
            creatorSlug,

          isClaimed:
            Boolean(data.requestedByUid),

          ownerUid:
            data.requestedByUid || null,

          claimStatus:
            data.requestedByUid ? 'approved' : 'unclaimed',

          claimedAt:
            data.requestedByUid ? new Date() : null,

          claimedByEmail:
            data.requestedByEmail || data.email || '',

          publishedAt:
            new Date(),

          submissionId:
            data.id,
        };
      }
      else {
        publishedData = {
          title:
            data.businessName,

          category:
            data.categoryRequested,

          appSection:
            data.appSectionRequested ===
            'both'
              ? 'shopping'
              : data.appSectionRequested,

          address:
            data.addressRaw,

          departement:
            (() => {
              const explicitDepartment =
                String(
                  data.departement ||
                  ''
                )
                  .trim()
                  .toUpperCase();

              if (explicitDepartment) {
                return explicitDepartment;
              }

              const postalCodeMatch =
                String(
                  data.addressRaw ||
                  ''
                ).match(/\b(\d{5})\b/);

              if (!postalCodeMatch) {
                return '';
              }

              const postalCode =
                postalCodeMatch[1];

              if (
                postalCode.startsWith('200') ||
                postalCode.startsWith('201')
              ) {
                return '2A';
              }

              const postalNumber =
                Number.parseInt(
                  postalCode,
                  10
                );

              if (
                postalNumber >= 20200 &&
                postalNumber <= 20620
              ) {
                return '2B';
              }

              if (postalCode.startsWith('971')) return '971';
              if (postalCode.startsWith('972')) return '972';
              if (postalCode.startsWith('973')) return '973';
              if (postalCode.startsWith('974')) return '974';
              if (postalCode.startsWith('976')) return '976';

              return postalCode.slice(0, 2);
            })(),

          phoneNumber:
            data.phone,

          email:
            data.email,

          website:
            data.website ||
            '',

          facebookUrl:
            data.facebook ||
            '',

          instagramUrl:
            data.instagram ||
            '',

          imgUrl:
            data.imageUrl ||
            '',

          googleMapsUrl:
            data.googleMapsUrl ||
            '',

          horaires:
            data.horaires ||
            {},

          info:
            data.description ||
            '',

          latitude:
            resolvedCoords.lat,

          longitude:
            resolvedCoords.lng,

          geohash:
            encodeGeohash(
              resolvedCoords.lat,
              resolvedCoords.lng,
              9
            ),

          slug:
            generatedSlug,

          isClaimed:
            Boolean(data.requestedByUid),

          ownerUid:
            data.requestedByUid || null,

          claimStatus:
            data.requestedByUid ? 'approved' : 'unclaimed',

          claimedAt:
            data.requestedByUid ? new Date() : null,

          claimedByEmail:
            data.requestedByEmail || data.email || '',

          publishedAt:
            new Date(),

          submissionId:
            data.id,
        };

        if (!isUpdate) {
          publishedData.rating =
            "0";

          publishedData.ratingNumber =
            0;

          publishedData.reviewCount =
            0;

          publishedData.currentStatus =
            'OPERATIONAL';
        }
      }

      // Une soumission rattachée à une fiche existante ne doit jamais
      // écraser sa propriété. La revendication d'une fiche existante passe
      // exclusivement par le workflow /pro/revendiquer.
      if (isUpdate) {
        delete publishedData.isClaimed;
        delete publishedData.ownerUid;
        delete publishedData.claimStatus;
        delete publishedData.claimedAt;
        delete publishedData.claimedByEmail;
      }

      /*
       * =====================================================
       * 4. INDEX CARTE LIVE
       * =====================================================
       */

      const mapPointLive = {
        kind:
          'map_point_live',

        sourceCollection:
          targetCol,

        id:
          publishedDocId,

        lat:
          resolvedCoords.lat,

        lng:
          resolvedCoords.lng,

        t:
          String(
            publishedData.title ||
            publishedDocId
          ),

        s:
          String(
            publishedData.slug ||
            publishedDocId
          ),

        a:
          String(
            publishedData.appSection ||
            'shopping'
          ),

        c:
          String(
            publishedData.category ||
            'concession'
          ),

        r:
          publishedData.rating ??
          null,

        i:
          publishedData.imgUrl ||
          publishedData.photoUrl ||
          null,

        addr:
          String(
            publishedData.address ||
            data.addressRaw ||
            ''
          ),

        b:
          Array.isArray(
            publishedData.brands
          )
            ? publishedData.brands
            : [],

        updatedAt:
          new Date(),
      };

      /*
       * =====================================================
       * 5. ECRITURE ATOMIQUE
       * =====================================================
       *
       * Fiche + index carte + soumission.
       * Aucun état partiel possible.
       */

      const batch =
        writeBatch(
          firestore
        );

      batch.set(
        doc(
          firestore,
          targetCol,
          publishedDocId
        ),
        publishedData,
        {
          merge:
            true,
        }
      );

      batch.set(
        doc(
          firestore,
          'cache',
          `map-live-${targetCol}-${publishedDocId}`
        ),
        mapPointLive,
        {
          merge:
            true,
        }
      );

      // Une nouvelle fiche créée par un utilisateur vérifié devient sa fiche
      // uniquement après cette validation admin.
      if (!isUpdate && data.requestedByUid) {
        batch.set(
          doc(firestore, 'users', data.requestedByUid),
          {
            role: 'pro',
            onboardingComplete: true,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        batch.set(
          doc(firestore, 'professionalProfiles', data.requestedByUid),
          {
            id: data.requestedByUid,
            email: data.requestedByEmail || data.email || '',
            companyName: publishedData.title || '',
            updatedAt: new Date(),
          },
          { merge: true }
        );
      }

      batch.update(
        doc(
          firestore,
          'listing_submissions',
          data.id
        ),
        {
          status:
            'published',

          publishedAt:
            new Date(),

          publishedCollection:
            targetCol,

          publishedDocId:
            publishedDocId,

          publishedData:
            publishedData,

          adminDraft:
            buildAdminDraftSnapshot(data),

          reviewedBy:
            user?.uid,

          reviewedAt:
            new Date(),

          updatedAt:
            new Date(),
        }
      );

      const historyEntry = {
        listingKey: `${targetCol}/${publishedDocId}`,
        targetCollection: targetCol,
        targetId: publishedDocId,
        targetTitle: publishedData.title || data.businessName || data.displayName || publishedDocId,
        eventType: isUpdate ? 'submission_update_published' : 'listing_created',
        summary: isUpdate
          ? 'Soumission corrigée puis publiée par Label Moto'
          : 'Fiche créée et publiée par Label Moto',
        submissionId: data.id,
        requestedByUid: data.requestedByUid || '',
        actorType: 'admin',
        actorUid: user?.uid || '',
        createdAt: new Date(),
      };

      // Publication is the critical transaction. Audit logging must never make
      // the publication fail if listing_history is temporarily unavailable.
      await batch.commit();

      try {
        await addDoc(collection(firestore, 'listing_history'), historyEntry);
      } catch (historyError) {
        console.warn('[LabelMoto] Fiche publiée, historique non enregistré :', historyError);
      }

      toast({
        title:
          isUpdate
            ? "Fiche mise à jour !"
            : "Nouvelle fiche publiée !",

        description:
          `Cible : ${targetCol}/${publishedDocId}`
      });

      setIsDetailOpen(
        false
      );
    }
    catch (e: any) {
      toast({
        variant:
          "destructive",

        title:
          "Erreur de publication",

        description:
          e?.message ||
          "La publication a échoué."
      });
    }
    finally {
      setIsPublishing(
        false
      );
    }
  };

  const handleLinkToDuplicate = (dup: any) => {
    if (!editDraft) return;

    const alreadyLinked =
      editDraft.publishTargetId === dup.id &&
      (!editDraft.publishTargetCollection || editDraft.publishTargetCollection === dup.col);

    if (alreadyLinked) {
      setEditDraft({
        ...editDraft,
        publishTargetId: undefined,
        publishTargetCollection: undefined,
      });
      toast({ title: 'Lien retiré', description: 'La demande créera de nouveau une fiche distincte.' });
      return;
    }

    setEditDraft({
      ...editDraft,
      publishTargetId: dup.id,
      publishTargetCollection: dup.col,
    });

    toast({
      title: 'Fiche existante sélectionnée',
      description: `La validation mettra à jour ${dup.title || dup.id} au lieu de créer un doublon.`,
    });
  };

  const handleDelete = () => {
    if (!selectedId || !firestore) return;
    if (!window.confirm("Supprimer cette soumission définitivement ?")) return;
    
    deleteDocumentNonBlocking(doc(firestore, 'listing_submissions', selectedId));
    setIsDetailOpen(false);
    setSelectedId(null);
    setEditDraft(null);
    toast({ title: "Soumission supprimée" });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date inconnue';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié dans le presse-papier" });
  };

  if (isUserLoading || !user || profile?.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
            <p className="font-black uppercase tracking-widest text-[10px] animate-pulse">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (listingEditTarget) {
    return (
      <div className="min-h-screen bg-muted/20">
        <header className="bg-background border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <div className="w-40 md:w-60"><LabelMotoLogo noBubble /></div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setListingEditTarget(null)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux archives
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-8">
          <div className="max-w-3xl mx-auto">
            <ListingsManager
              editorOnly
              initialEditTarget={listingEditTarget}
              onEditorClose={() => setListingEditTarget(null)}
            />
          </div>
        </main>
      </div>
    );
  }

  const submissionCreatedAtMs = (submission: Submission) => {
    const createdAt = submission.createdAt as any;
    if (!createdAt) return 0;
    if (typeof createdAt.toMillis === 'function') return createdAt.toMillis();
    if (typeof createdAt.toDate === 'function') return createdAt.toDate().getTime();
    if (typeof createdAt.seconds === 'number') return createdAt.seconds * 1000;
    const parsed = new Date(createdAt).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const submissionsById = new Map<string, Submission>();
  for (const submission of serverSubmissions) {
    submissionsById.set(submission.id, submission);
  }
  for (const submission of submissions || []) {
    submissionsById.set(submission.id, submission);
  }
  const visibleSubmissions = Array.from(submissionsById.values());

  const pendingSubs = visibleSubmissions
    .filter(s => s.status === 'pending' || s.status === 'in_review' || s.status === 'approved')
    .sort((a, b) => submissionCreatedAtMs(b) - submissionCreatedAtMs(a));

  const processedSubs = visibleSubmissions
    .filter(s => s.status === 'published' || s.status === 'rejected')
    .sort((a, b) => submissionCreatedAtMs(b) - submissionCreatedAtMs(a));

  const dashboardSubmissionsCount = dashboardCounts?.submissions ?? 0;
  const dashboardCommentsCount = dashboardCounts?.comments ?? 0;
  const dashboardModifsCount = dashboardCounts?.modifs ?? 0;

  const pendingCommentsCount =
    activeTab === 'comments'
      ? (pendingComments || []).length
      : dashboardCommentsCount;

  const pendingModifsCount =
    activeTab === 'modifs'
      ? (pendingModifs || []).length
      : dashboardModifsCount;

  const totalToProcess =
    dashboardSubmissionsCount +
    dashboardCommentsCount +
    dashboardModifsCount;

  const dashboardInteractionsCount =
    dashboardCounts?.interactions ?? 0;

  const dashboardFichesCount =
    dashboardCounts?.fiches ?? 0;

  const dashboardMapGapCount =
    dashboardCounts?.mapGap ?? 0;

  const dashboardTelCount =
    dashboardCounts?.tel ?? 0;

  const dashboardWebCount =
    dashboardCounts?.web ?? 0;

  const dashboardInstagramCount =
    dashboardCounts?.instagram ?? 0;

  const dashboardItineraireCount =
    dashboardCounts?.itineraire ?? 0;
  const dashboardVuesCount =
    dashboardCounts?.vues ?? 0;
  const isRequestsSection = [
    'submissions',
    'history',
    'modifs',
    'comments',
  ].includes(activeTab);

  const isProfessionalsSection = [
    'listings',
    'add',
  ].includes(activeTab);

  const isToolsSection = [
    'images',
    'users',
  ].includes(activeTab);

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="w-40 md:w-60"><LabelMotoLogo noBubble /></div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au site</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            <div className="space-y-3 mb-8">

  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 p-2 bg-muted/60 rounded-2xl shadow-inner">

    <Button
      type="button"
      variant="ghost"
      onClick={() => setActiveTab('dashboard')}
      className={cn(
        "h-16 rounded-xl flex flex-col items-center justify-center gap-1 font-black uppercase text-[9px] tracking-widest",
        activeTab === 'dashboard' &&
          "bg-white shadow-sm text-foreground"
      )}
    >
      <AdminDashboardIcon className="h-5 w-5" />
      Dashboard
    </Button>

    <Button
      type="button"
      variant="ghost"
      onClick={() => setActiveTab('submissions')}
      className={cn(
        "h-16 rounded-xl flex flex-col items-center justify-center gap-1 font-black uppercase text-[9px] tracking-widest",
        isRequestsSection &&
          "bg-white shadow-sm text-foreground"
      )}
    >
      <AdminRequestsIcon className="h-5 w-5" />
      Demandes
    </Button>

    <Button
      type="button"
      variant="ghost"
      onClick={() => setActiveTab('listings')}
      className={cn(
        "h-16 rounded-xl flex flex-col items-center justify-center gap-1 font-black uppercase text-[9px] tracking-widest",
        isProfessionalsSection &&
          "bg-white shadow-sm text-foreground"
      )}
    >
      <AdminProfessionalsIcon className="h-5 w-5" />
      Professionnels
    </Button>

    <Button
      type="button"
      variant="ghost"
      onClick={() => setActiveTab('stats')}
      className={cn(
        "h-16 rounded-xl flex flex-col items-center justify-center gap-1 font-black uppercase text-[9px] tracking-widest",
        activeTab === 'stats' &&
          "bg-white shadow-sm text-foreground"
      )}
    >
      <AdminStatsIcon className="h-5 w-5" />
      Statistiques
    </Button>

    <Button
      type="button"
      variant="ghost"
      onClick={() => setActiveTab('prospection')}
      className={cn(
        "h-16 rounded-xl flex flex-col items-center justify-center gap-1 font-black uppercase text-[9px] tracking-widest",
        activeTab === 'prospection' &&
          "bg-white shadow-sm text-foreground"
      )}
    >
      <AdminProspectIcon className="h-5 w-5" />
      Prospection
    </Button>

    <Button
      type="button"
      variant="ghost"
      onClick={() => setActiveTab('images')}
      className={cn(
        "h-16 rounded-xl flex flex-col items-center justify-center gap-1 font-black uppercase text-[9px] tracking-widest",
        isToolsSection &&
          "bg-white shadow-sm text-foreground"
      )}
    >
      <AdminToolsIcon className="h-5 w-5" />
      Outils
    </Button>

  </div>

  {isRequestsSection && (
    <div className="flex flex-wrap items-center gap-2 px-1">
      <Button
        type="button"
        size="sm"
        variant={activeTab === 'submissions' ? 'default' : 'outline'}
        onClick={() => setActiveTab('submissions')}
        className="rounded-full font-black uppercase text-[9px] tracking-widest"
      >
        Demandes
      </Button>

      <Button
        type="button"
        size="sm"
        variant={activeTab === 'history' ? 'default' : 'outline'}
        onClick={() => setActiveTab('history')}
        className="rounded-full font-black uppercase text-[9px] tracking-widest"
      >
        Archives
      </Button>

      <Button
        type="button"
        size="sm"
        variant={activeTab === 'modifs' ? 'default' : 'outline'}
        onClick={() => setActiveTab('modifs')}
        className="rounded-full font-black uppercase text-[9px] tracking-widest"
      >
        Revendications & modifs
      </Button>

      <Button
        type="button"
        size="sm"
        variant={activeTab === 'comments' ? 'default' : 'outline'}
        onClick={() => setActiveTab('comments')}
        className="rounded-full font-black uppercase text-[9px] tracking-widest"
      >
        Avis
      </Button>
    </div>
  )}

  {isProfessionalsSection && (
    <div className="flex flex-wrap items-center gap-2 px-1">
      <Button
        type="button"
        size="sm"
        variant={activeTab === 'listings' ? 'default' : 'outline'}
        onClick={() => setActiveTab('listings')}
        className="rounded-full font-black uppercase text-[9px] tracking-widest"
      >
        Fiches
      </Button>

      <Button
        type="button"
        size="sm"
        variant={activeTab === 'add' ? 'default' : 'outline'}
        onClick={() => setActiveTab('add')}
        className="rounded-full font-black uppercase text-[9px] tracking-widest"
      >
        Ajouter
      </Button>
    </div>
  )}

  {isToolsSection && (
    <div className="flex flex-wrap items-center gap-2 px-1">
      <Button
        type="button"
        size="sm"
        variant={activeTab === 'images' ? 'default' : 'outline'}
        onClick={() => setActiveTab('images')}
        className="rounded-full font-black uppercase text-[9px] tracking-widest"
      >
        Images
      </Button>

      <Button
        type="button"
        size="sm"
        variant={activeTab === 'users' ? 'default' : 'outline'}
        onClick={() => setActiveTab('users')}
        className="rounded-full font-black uppercase text-[9px] tracking-widest"
      >
        Comptes
      </Button>
    </div>
  )}

</div>
          </div>
          <TabsContent value="dashboard" className="mt-0">
            <div className="space-y-8">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Vue d'ensemble
                </p>

                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                  Tableau de bord
                </h1>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                <Card className="bg-brand text-white border-none shadow-lg rounded-3xl">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-white/70 font-black uppercase text-[9px] tracking-widest">
                      À traiter
                    </CardDescription>

                    <CardTitle className="text-4xl font-black">
                      {dashboardCounts ? totalToProcess : '—'}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card className="bg-white border-none shadow-lg rounded-3xl">
                  <CardHeader className="pb-3">
                    <CardDescription className="font-black uppercase text-[9px] tracking-widest text-muted-foreground">
                      Interactions
                    </CardDescription>

                    <CardTitle className="text-4xl font-black">
                      {dashboardCounts ? dashboardInteractionsCount : '—'}
                    </CardTitle>

                    <p className="text-[9px] font-bold text-muted-foreground">
                      Cumul historique
                    </p>
                  </CardHeader>
                </Card>

                <Card className="bg-white border-none shadow-lg rounded-3xl">
                  <CardHeader className="pb-3">
                    <CardDescription className="font-black uppercase text-[9px] tracking-widest text-muted-foreground">
                      Fiches pros
                    </CardDescription>

                    <CardTitle className="text-4xl font-black">
                      {dashboardCounts ? dashboardFichesCount : '—'}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card className="bg-white border-2 border-dashed border-orange-200 shadow-lg rounded-3xl">
                  <CardHeader className="pb-3">
                    <CardDescription className="font-black uppercase text-[9px] tracking-widest text-orange-600">
                      Écart carte
                    </CardDescription>

                    <CardTitle className="text-4xl font-black flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      {dashboardCounts ? dashboardMapGapCount : '—'}
                    </CardTitle>

                    <p className="text-[9px] font-bold text-muted-foreground">
                      Fiches absentes du cache ou IDs dupliqués
                    </p>
                  </CardHeader>
                </Card>

              </div>

              <Card className="rounded-3xl border-none shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">
                    Interactions professionnelles
                  </CardTitle>

                  <CardDescription>
                    Clics cumulés générés vers les professionnels.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid grid-cols-2 lg:grid-cols-5 gap-3">

                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="h-4 w-4 text-brand" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Téléphone
                      </span>
                    </div>

                    <p className="text-3xl font-black">
                      {dashboardCounts ? dashboardTelCount : '—'}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Site web
                      </span>
                    </div>

                    <p className="text-3xl font-black">
                      {dashboardCounts ? dashboardWebCount : '—'}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Itinéraire
                      </span>
                    </div>

                    <p className="text-3xl font-black">
                      {dashboardCounts ? dashboardItineraireCount : '—'}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Instagram
                      </span>
                    </div>

                    <p className="text-3xl font-black">
                      {dashboardCounts ? dashboardInstagramCount : '—'}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="h-4 w-4 text-violet-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Vues de fiche
                      </span>
                    </div>

                    <p className="text-3xl font-black">
                      {dashboardCounts ? dashboardVuesCount : '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">
                    Priorités
                  </CardTitle>

                  <CardDescription>
                    Accès direct aux éléments qui demandent une action.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('submissions')}
                    className="h-16 rounded-2xl justify-between px-5 font-black uppercase text-xs"
                  >
                    Demandes

                    <span className="text-brand">
                      {dashboardCounts ? dashboardSubmissionsCount : '—'}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('modifs')}
                    className="h-16 rounded-2xl justify-between px-5 font-black uppercase text-xs"
                  >
                    Revendications & modifs

                    <span className="text-orange-500">
                      {dashboardCounts ? dashboardModifsCount : '—'}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('comments')}
                    className="h-16 rounded-2xl justify-between px-5 font-black uppercase text-xs"
                  >
                    Avis

                    <span>
                      {dashboardCounts ? dashboardCommentsCount : '—'}
                    </span>
                  </Button>

                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('stats')}
                  className="rounded-full font-black uppercase text-[10px] tracking-widest"
                >
                  Ouvrir les statistiques
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

            </div>
          </TabsContent>
          <TabsContent value="submissions">
            {isLoadingSubmissions ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
            ) : pendingSubs.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-[2.5rem] border-2 border-dashed">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4 opacity-20" />
                <h2 className="text-xl font-black uppercase text-muted-foreground">Tout est à jour !</h2>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingSubs.map(sub => (
                  <Card key={sub.id} className={cn("flex flex-col border-2 transition-all hover:border-brand cursor-pointer shadow-sm hover:shadow-xl rounded-3xl", sub.status === 'in_review' && "border-blue-400 bg-blue-50/5")} onClick={() => handleOpenDetail(sub)}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg font-black uppercase tracking-tight line-clamp-1">{sub.businessName}</CardTitle>
                        <Badge variant={sub.status === 'in_review' ? 'default' : 'outline'} className="text-[8px] uppercase tracking-widest shrink-0">{sub.status}</Badge>
                      </div>
                      <CardDescription className="text-[10px] font-bold">Soumis {formatDate(sub.createdAt)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <div className="flex items-start gap-2 text-xs"><MapPin className="h-3 w-3 text-brand mt-0.5" /> <p className="font-bold text-muted-foreground line-clamp-2">{sub.addressRaw}</p></div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full w-fit">
                        <Store className="h-3 w-3" /> {sub.appSectionRequested}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 p-3 border-t">
                      <Button variant="ghost" size="sm" className="w-full font-black uppercase text-[9px] tracking-widest">Examiner la fiche <ChevronRight className="ml-2 h-3 w-3" /></Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="listings">
            <ListingsManager />
          </TabsContent>
          <TabsContent value="add">
            <AddListing />
          </TabsContent>
          <TabsContent value="modifs">
            <ModificationRequests />
          </TabsContent>
          <TabsContent value="migration">
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border-2 border-dashed border-muted-foreground/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                      <Database className="h-8 w-8 text-orange-500" /> Réconciliation CLI
                    </h2>
                    <p className="text-muted-foreground font-bold max-w-xl">
                      Utilisez le script CLI pour effectuer la migration réelle. L'audit ci-dessous est un Dry Run visuel.
                    </p>
                  </div>
                  <Button 
                    onClick={runAudit} 
                    disabled={isAuditing}
                    className="bg-foreground hover:bg-brand text-white font-black uppercase tracking-widest text-xs h-16 px-10 rounded-full shadow-2xl transition-all hover:scale-105 shrink-0"
                  >
                    {isAuditing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileSearch className="mr-2 h-5 w-5" />}
                    Actualiser l'audit
                  </Button>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <Card className="bg-white rounded-3xl shadow-lg overflow-hidden h-fit border-none">
                    <CardHeader className="bg-indigo-600 text-white">
                      <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="h-4 w-4" /> Commandes CLI
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">1. Tester la migration (Dry)</p>
                        <div className="bg-black text-green-400 p-3 rounded-xl font-mono text-[10px] flex justify-between items-center group">
                          <code>npm run reconcile:dry</code>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-green-400 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard("npm run reconcile:dry")}><Copy className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <div className="space-y-3 pt-2">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">2. Appliquer réellement</p>
                        <div className="bg-black text-orange-400 p-3 rounded-xl font-mono text-[10px] flex justify-between items-center group">
                          <code>npm run reconcile:apply</code>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-orange-400 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard("npm run reconcile:apply")}><Copy className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-xl border border-dashed mt-4">
                        <div className="flex gap-2 text-orange-600 items-start">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <p className="text-[9px] font-bold leading-relaxed italic">
                            Les modifications via CLI ignorent les Security Rules et sont immédiates. Vérifiez l'audit avant d'appliquer.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {migrationStats && (
                    <Card className="bg-white rounded-3xl shadow-lg overflow-hidden h-fit border-none animate-in fade-in slide-in-from-left-4 duration-500">
                      <CardHeader className="bg-muted/50 border-b">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">État de l'audit</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-[10px] font-black uppercase text-muted-foreground">Noyaux (users/)</span>
                          <span className="text-xl font-black">{migrationStats.usersCount}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                          <span className="text-[10px] font-black uppercase text-orange-700">À RÉCONCILIER</span>
                          <span className="text-2xl font-black text-orange-600">{migrationStats.toMigrate.length}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Card className="lg:col-span-2 bg-white rounded-3xl shadow-lg border-none overflow-hidden">
                  <CardHeader className="bg-muted/50 border-b">
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Liste des comptes orphelins (Dry Run)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[550px]">
                      {migrationStats && migrationStats.toMigrate.length > 0 ? (
                        <div className="divide-y">
                          {migrationStats.toMigrate.map((item, i) => (
                            <div key={i} className="p-6 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                              <div className="space-y-1">
                                <p className="font-black text-sm uppercase">{item.name}</p>
                                <div className="flex items-center gap-3">
                                  <code className="text-[8px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.uid}</code>
                                  <Badge variant="outline" className="text-[7px] uppercase font-black">{item.source}</Badge>
                                </div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-700 text-[8px] border-none uppercase font-black">Prêt</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-32 opacity-30">
                          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                          <p className="font-black uppercase text-xs">Aucun orphelin détecté.</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

                    <TabsContent value="history">
            <AdminListingArchive
              onModify={(collectionName, id) =>
                setListingEditTarget({
                  collection: collectionName,
                  id,
                })
              }
            />
          </TabsContent>
          
          <TabsContent value="comments">
             <Card className="shadow-lg rounded-3xl bg-white border-none overflow-hidden">
               <CardContent className="p-0">
                 <ScrollArea className="h-[600px]">
                   {(pendingComments || []).length === 0 ? (
                     <div className="text-center py-20">
                        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <p className="font-black uppercase text-muted-foreground tracking-widest text-xs">Aucun avis en attente de modération.</p>
                     </div>
                   ) : (
                     (pendingComments || []).map((c: any) => (
                       <div key={c.id} className="p-6 border-b last:border-0 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <p className="font-black text-base uppercase tracking-tight">{c.userName}</p>
                              <Badge variant="outline" className="text-[8px] font-black uppercase">{c.targetType === 'motorcycle_sheet' ? 'Fiche moto' : 'Concession'}</Badge>
                              <Badge variant="outline" className="text-[8px] font-black uppercase">★ {c.rating}</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold">{c.dealershipName}</p>
                            <p className="text-xs text-foreground/80 mt-2 line-clamp-2">{c.content}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                             <Button variant="outline" size="sm" className="rounded-full text-[10px] font-black uppercase" onClick={() => handleRejectComment(c)}>Rejeter</Button>
                             <Button size="sm" className="rounded-full text-[10px] font-black uppercase bg-brand hover:bg-brand/90" onClick={() => handleApproveComment(c)}>Valider</Button>
                          </div>
                       </div>
                     ))
                   )}
                 </ScrollArea>
               </CardContent>
             </Card>
          </TabsContent>
          <TabsContent value="prospection">
            <AdminProspection />
          </TabsContent>
          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>
          <TabsContent value="images">
            <AdminImageRequests />
          </TabsContent>
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] p-0 border-none shadow-2xl flex flex-col z-[3000]">
          {editDraft && (
            <>
              <DialogHeader className="bg-brand text-white p-8 shrink-0">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-white/20 text-white uppercase text-[8px] tracking-widest border-none">{editDraft.status}</Badge>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tighter">{editDraft.businessName}</DialogTitle>
                    </div>
                    <DialogDescription className="text-white/80 font-bold text-xs uppercase tracking-widest">Demande reçue {formatDate(editDraft.createdAt)}</DialogDescription>
                  </div>
                  <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-12 w-12 p-0" onClick={() => setIsDetailOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
              </DialogHeader>

              <div className="flex-grow">
                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b pb-2">
                                <Info className="h-4 w-4 text-brand" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Identité Publique (MAPPING)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Nom (mappe vers title)</Label>
                                    <Input value={editDraft.businessName} onChange={e => setEditDraft({...editDraft, businessName: e.target.value})} className="font-bold rounded-xl h-12 border-2" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Section App (Cible Collection)</Label>
                                    <Select value={editDraft.appSectionRequested} onValueChange={(v) => setEditDraft({...editDraft, appSectionRequested: v as any})}>
                                        <SelectTrigger className="font-bold h-12 rounded-xl border-2"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl border-2 z-[3200]">
                                            <SelectItem value="shopping">Concessionnaire</SelectItem>
                                            <SelectItem value="service">Atelier / Garage</SelectItem>
                                            <SelectItem value="both">Vente & Service</SelectItem>
                                            <SelectItem value="association">Association</SelectItem>
                                            <SelectItem value="relais">Relais Motard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Catégorie / Spécialité</Label>
                                <Input value={editDraft.categoryRequested} onChange={e => setEditDraft({...editDraft, categoryRequested: e.target.value})} className="font-bold rounded-xl h-12 border-2" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Adresse (mappe vers address)</Label>
                                <Textarea value={editDraft.addressRaw} onChange={e => setEditDraft({...editDraft, addressRaw: e.target.value})} className="font-bold rounded-xl min-h-[80px] border-2" />
                                {editDraft.needsGeocoding && <p className="text-[8px] text-orange-500 font-black uppercase tracking-widest ml-1 animate-pulse">⚠️ Géocodage requis ou à vérifier.</p>}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b pb-2">
                                <Globe className="h-4 w-4 text-brand" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Contacts & Réseaux</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Téléphone</Label>
                                    <Input value={editDraft.phone} onChange={e => setEditDraft({...editDraft, phone: e.target.value})} className="font-bold border-2 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Site Web</Label>
                                    <Input value={editDraft.website} onChange={e => setEditDraft({...editDraft, website: e.target.value})} className="font-bold border-2 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">E-mail</Label>
                                    <Input value={editDraft.email} onChange={e => setEditDraft({...editDraft, email: e.target.value})} className="font-bold border-2 rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Instagram</Label>
                                    <Input value={editDraft.instagram || ''} onChange={e => setEditDraft({...editDraft, instagram: e.target.value})} placeholder="https://instagram.com/..." className="font-bold border-2 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Facebook</Label>
                                    <Input value={editDraft.facebook || ''} onChange={e => setEditDraft({...editDraft, facebook: e.target.value})} placeholder="https://facebook.com/..." className="font-bold border-2 rounded-xl" />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b pb-2">
                                <Globe className="h-4 w-4 text-brand" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Médias & Liens</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Photo URL</Label>
                                    <Input value={editDraft.imageUrl || ''} onChange={e => setEditDraft({...editDraft, imageUrl: e.target.value})} placeholder="https://..." className="font-bold border-2 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Google Maps URL</Label>
                                    <Input value={editDraft.googleMapsUrl || ''} onChange={e => setEditDraft({...editDraft, googleMapsUrl: e.target.value})} placeholder="https://maps.google.com/..." className="font-bold border-2 rounded-xl" />
                                    {editDraft.googleMapsUrl && <a href={editDraft.googleMapsUrl} target="_blank" rel="noreferrer" className="text-[9px] text-brand font-black underline ml-1">Ouvrir dans Google Maps →</a>}
                                </div>
                            </div>
                            {editDraft.horaires && Object.keys(editDraft.horaires).length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Horaires déclarés</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(editDraft.horaires).map(([jour, h]) => (
                                            <div key={jour} className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                                                <span className="text-[9px] font-black uppercase w-20 text-muted-foreground capitalize">{jour}</span>
                                                <span className="text-[10px] font-bold">{h || 'Fermé'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b pb-2">
                                <History className="h-4 w-4 text-brand" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Notes Internes & Audit</h3>
                            </div>
                            <Textarea 
                                placeholder="Ajouter une note de modération..." 
                                value={editDraft.notesAdmin} 
                                onChange={e => setEditDraft({...editDraft, notesAdmin: e.target.value})} 
                                className="font-bold rounded-xl min-h-[100px] bg-muted/20 border-2" 
                            />
                            {editDraft.publishedAt && (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">PUBLIÉ LE {formatDate(editDraft.publishedAt)}</p>
                                    <p className="text-[8px] font-bold text-green-600 mt-1">DOC ID: {editDraft.publishedDocId} | COLL: {editDraft.publishedCollection}</p>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <Card className="bg-muted/30 border-2 border-dashed rounded-3xl overflow-hidden shadow-sm">
                            <CardHeader className="bg-white/50 border-b py-4 px-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-foreground"><Search className="h-4 w-4 text-brand" /> Détection Doublons</h3>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {duplicates.length > 0 ? (
                                    duplicates.map(d => {
                                        const isLinked = editDraft.publishTargetId === d.id && (!editDraft.publishTargetCollection || editDraft.publishTargetCollection === d.col);
                                        const isVeryLikely = d.matchConfidence === 'very_likely';
                                        const confidence = isVeryLikely ? 'Très probable' : 'Probable';

                                        return (
                                          <div key={`${d.col}/${d.id}`} className="bg-white p-3 rounded-xl border-2 flex flex-col gap-2 shadow-sm">
                                              <div className="flex justify-between items-start gap-2">
                                                  <div className="min-w-0">
                                                      <p className="font-black text-[10px] uppercase truncate text-foreground">{d.title || d.id}</p>
                                                      {!!d.address && <p className="text-[8px] text-muted-foreground line-clamp-2 font-bold mt-1">{d.address}</p>}
                                                      {!!d.phoneNumber && <p className="text-[8px] text-muted-foreground truncate font-bold mt-1">{d.phoneNumber}</p>}
                                                  </div>
                                                  <div className="flex flex-col items-end gap-1 shrink-0">
                                                    <Badge className="bg-orange-100 text-orange-700 text-[7px] uppercase border-none font-black">{d.col}</Badge>
                                                    <span className={cn('text-[7px] font-black uppercase', isVeryLikely ? 'text-red-600' : 'text-amber-600')}>{confidence}</span>
                                                  </div>
                                              </div>
                                              {Array.isArray(d.matchReasons) && d.matchReasons.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                  {d.matchReasons.map((reason: string) => (
                                                    <span key={reason} className="rounded-full bg-orange-50 px-2 py-1 text-[7px] font-black uppercase text-orange-700 border border-orange-100">
                                                      {reason}
                                                    </span>
                                                  ))}
                                                </div>
                                              )}
                                              <Button
                                                variant="secondary"
                                                size="sm"
                                                className={cn("h-8 text-[8px] font-black uppercase rounded-lg border", isLinked ? "bg-brand text-white border-brand" : "bg-muted text-muted-foreground")}
                                                onClick={() => handleLinkToDuplicate(d)}
                                              >
                                                {isLinked ? "Fiche liée — retirer le lien" : "Utiliser cette fiche existante"}
                                              </Button>
                                          </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 italic">Aucun doublon trouvé</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Actions de Modération</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className={cn("rounded-xl text-[9px] font-black uppercase h-12 border-2", editDraft.status === 'in_review' && "bg-blue-50 border-blue-400 text-blue-600")} onClick={() => handleUpdateStatus('in_review')} disabled={editDraft.status === 'in_review'}>🔘 {editDraft.status === 'in_review' ? 'En cours' : 'Examiner'}</Button>
                                <Button variant="outline" className="rounded-xl text-[9px] font-black uppercase h-12 text-destructive hover:bg-destructive/10 border-2" onClick={() => handleUpdateStatus('rejected')} disabled={editDraft.status === 'rejected'}>❌ {editDraft.status === 'rejected' ? 'Rejeté' : 'Rejeter'}</Button>
                            </div>
                            <Button variant="secondary" className="w-full rounded-xl text-[9px] font-black uppercase h-12 border-2" onClick={handleSaveDraft}>
                                <Save className="mr-2 h-4 w-4" /> Enregistrer sans publier
                            </Button>
                            <div className="pt-4">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-black uppercase tracking-widest h-16 shadow-xl transition-all hover:scale-105 active:scale-95" onClick={handlePublish} disabled={isPublishing || editDraft.status === 'published'}>
                                    {isPublishing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 fill-white" />}
                                    {editDraft.publishTargetId ? "Mettre à jour la fiche liée" : "Valider & Publier la fiche"}
                                </Button>
                                {editDraft.status === 'published' && (
                                    <p className="text-center text-green-600 text-[10px] font-black uppercase tracking-[0.3em] mt-4 flex items-center justify-center gap-2">
                                        <CheckCircle className="h-3 w-3" /> Fiche publiée
                                    </p>
                                )}
                            </div>
                        </section>

                        <div className="pt-10">
                            <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors h-12 rounded-xl" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4" /> Supprimer la soumission
                            </Button>
                        </div>
                    </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

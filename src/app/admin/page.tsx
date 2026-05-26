
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirebase, useMemoFirebase, useCollection } from '@/firebase';
import { 
  collection, query, getDocs, doc, orderBy, where, 
  serverTimestamp, writeBatch, getDoc, limit 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, CheckCircle, ArrowLeft, ShieldAlert, 
  Store, Search, ChevronRight, X, ExternalLink, 
  Trash2, Zap, Globe, Phone, MapPin, Info, Save, History,
  Filter, Link as LinkIcon, Database, AlertTriangle, Play, FileSearch
} from 'lucide-react';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn, generateDealershipSlug } from '@/lib/utils';
import { encodeGeohash, extractValidCoordinates } from '@/lib/geohash';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
  orphans: any[];
  toMigrate: any[];
  conflicts: any[];
}

export default function AdminPage() {
  const { firestore, user, profile, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  // State Management
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Submission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  // Migration State
  const [isAuditing, setIsAuditing] = useState(false);
  const [isApplyingMigration, setIsApplyingMigration] = useState(false);
  const [migrationStats, setMigrationStats] = useState<MigrationStats | null>(null);

  const isAdmin = profile?.role === 'admin';

  // Collection Listeners
  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'listing_submissions'), orderBy('createdAt', 'desc'));
  }, [firestore, isAdmin]);

  const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<Submission>(submissionsQuery);

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'pending_comments'), orderBy('date', 'desc'));
  }, [firestore, isAdmin]);

  const { data: pendingComments } = useCollection(commentsQuery);

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

  // Logic: Audit des données Firestore pour migration rétroactive
  const runAudit = async () => {
    if (!firestore) return;
    setIsAuditing(true);
    
    const fetchCollection = async (path: string) => {
      const colRef = collection(firestore, path);
      try {
        return await getDocs(colRef);
      } catch (err: any) {
        if (err.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path,
            operation: 'list'
          }));
        }
        throw err;
      }
    };

    try {
      const [usersSnap, stdSnap, proSnap] = await Promise.all([
        fetchCollection('users'),
        fetchCollection('standardProfiles'),
        fetchCollection('professionalProfiles')
      ]);

      const usersMap = new Map();
      usersSnap.forEach(d => usersMap.set(d.id, d.data()));

      const orphans: any[] = [];
      const toMigrate: any[] = [];
      const conflicts: any[] = [];

      stdSnap.forEach(docSnap => {
        const data = docSnap.data();
        if (!usersMap.has(docSnap.id)) {
          toMigrate.push({ 
            uid: docSnap.id, 
            email: data.email, 
            type: 'user', 
            source: 'standardProfiles', 
            data,
            displayName: data.pseudo || data.displayName || 'Motard'
          });
        }
      });

      proSnap.forEach(docSnap => {
        const data = docSnap.data();
        if (!usersMap.has(docSnap.id)) {
          toMigrate.push({ 
            uid: docSnap.id, 
            email: data.email, 
            type: 'pro', 
            source: 'professionalProfiles', 
            data,
            displayName: data.companyName || data.pseudo || data.displayName || 'Pro'
          });
        }
      });

      setMigrationStats({
        totalAuthEstimate: usersSnap.size + toMigrate.length,
        usersCount: usersSnap.size,
        stdCount: stdSnap.size,
        proCount: proSnap.size,
        orphans,
        toMigrate,
        conflicts
      });

      toast({ title: "Audit terminé", description: `${toMigrate.length} comptes à réconcilier détectés.` });
    } catch (e: any) {
      if (e.code !== 'permission-denied') {
        toast({ variant: "destructive", title: "Erreur audit", description: e.message });
      }
    } finally {
      setIsAuditing(false);
    }
  };

  const applyMigration = async () => {
    if (!firestore || !migrationStats || migrationStats.toMigrate.length === 0) return;
    
    if (!window.confirm(`Êtes-vous sûr de vouloir créer ${migrationStats.toMigrate.length} documents noyaux ? Cette action est irréversible.`)) {
      return;
    }

    setIsApplyingMigration(true);
    const batch = writeBatch(firestore);
    let count = 0;

    try {
      for (const item of migrationStats.toMigrate) {
        const userRef = doc(firestore, 'users', item.uid);
        
        batch.set(userRef, {
          uid: item.uid,
          email: item.email || '',
          displayName: item.displayName,
          role: item.type,
          status: 'active',
          emailVerifiedSync: false,
          onboardingComplete: true,
          legacyMigrated: true,
          createdAt: item.data?.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
          sourceProvider: 'legacy_migration_audit'
        }, { merge: true });

        count++;
        if (count >= 450) break; 
      }

      await batch.commit().catch(err => {
        if (err.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: 'users',
            operation: 'write'
          }));
        }
        throw err;
      });
      
      toast({ title: "Migration réussie", description: `${count} comptes réconciliés.` });
      runAudit();
    } catch (e: any) {
      if (e.code !== 'permission-denied') {
        toast({ variant: "destructive", title: "Erreur migration", description: e.message });
      }
    } finally {
      setIsApplyingMigration(false);
    }
  };

  const findDuplicates = async (submission: Submission) => {
    if (!firestore) return;
    const collections = ['concessions', 'associations', 'relais'];
    let matches: any[] = [];
    
    for (const colName of collections) {
      if (submission.phone) {
        const q = query(collection(firestore, colName), where('phoneNumber', '==', submission.phone));
        const snap = await getDocs(q).catch(err => {
          if (err.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: colName,
              operation: 'list'
            }));
          }
          throw err;
        });
        snap.forEach(d => matches.push({ id: d.id, ...d.data(), col: colName }));
      }
    }
    setDuplicates(matches);
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
        updatedAt: serverTimestamp(),
        reviewedBy: user?.uid,
        reviewedAt: serverTimestamp()
    });
    setEditDraft(prev => prev ? { ...prev, status: newStatus } : null);
    toast({ title: `Statut mis à jour : ${newStatus}` });
  };

  const handleSaveDraft = () => {
    if (!firestore || !editDraft) return;
    updateDocumentNonBlocking(doc(firestore, 'listing_submissions', editDraft.id), {
        ...editDraft,
        updatedAt: serverTimestamp()
    });
    toast({ title: "Modifications enregistrées" });
  };

  const handlePublish = async () => {
    if (!firestore || !editDraft) return;
    setIsPublishing(true);
    
    try {
      const data = editDraft;
      const coords = extractValidCoordinates(data);
      
      const targetDocId = data.publishTargetId || data.id;
      const isUpdate = !!data.publishTargetId;

      const publicData: any = {
        title: data.businessName,
        category: data.categoryRequested,
        appSection: data.appSectionRequested === 'both' ? 'shopping' : data.appSectionRequested,
        address: data.addressRaw, 
        addresss: data.addressRaw,
        phoneNumber: data.phone,
        email: data.email,
        website: data.website || '',
        facebookUrl: data.facebook || '',
        instagramUrl: data.instagram || '',
        info: data.description || '',
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        geohash: coords ? encodeGeohash(coords.lat, coords.lng, 9) : null,
        slug: generateDealershipSlug({ title: data.businessName, address: data.addressRaw }),
        isClaimed: true,
        timestamp: serverTimestamp(),
        publishedAt: serverTimestamp(),
        submissionId: data.id 
      };

      if (!isUpdate) {
        publicData.rating = "0";
        publicData.ratingNumber = 0;
        publicData.reviewCount = 0;
        publicData.currentStatus = 'OPERATIONAL';
      }

      const targetCol = data.appSectionRequested === 'association' ? 'associations' : 
                       (data.appSectionRequested === 'relais' ? 'relais' : 'concessions');
      
      await setDocumentNonBlocking(doc(firestore, targetCol, targetDocId), publicData, { merge: true });
      
      await updateDocumentNonBlocking(doc(firestore, 'listing_submissions', data.id), { 
        status: 'published', 
        publishedAt: serverTimestamp(),
        publishedCollection: targetCol,
        publishedDocId: targetDocId,
        reviewedBy: user?.uid,
        reviewedAt: serverTimestamp()
      });
      
      toast({ 
        title: isUpdate ? "Fiche mise à jour !" : "Nouvelle fiche publiée !", 
        description: `Cible : ${targetCol}/${targetDocId}` 
      });
      setIsDetailOpen(false);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur de publication", description: e.message });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLinkToDuplicate = (dup: any) => {
    if (!editDraft) return;
    setEditDraft({ ...editDraft, publishTargetId: dup.id });
    toast({ title: "Lien établi", description: `La publication mettra à jour la fiche ${dup.id}` });
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

  if (isUserLoading || !user || profile?.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  const pendingSubs = (submissions || []).filter(s => s.status === 'pending' || s.status === 'in_review' || s.status === 'approved');
  const processedSubs = (submissions || []).filter(s => s.status === 'published' || s.status === 'rejected');
  const pendingCommentsCount = (pendingComments || []).length;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="w-40 md:w-60"><LabelMotoLogo noBubble /></div>
          <Button asChild variant="outline" size="sm"><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au site</Link></Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-brand text-white border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70 font-black uppercase text-[10px] tracking-widest">Pros en attente</CardDescription>
              <CardTitle className="text-4xl font-black">{pendingSubs.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Avis modération</CardDescription>
              <CardTitle className="text-4xl font-black">{pendingCommentsCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-lg bg-indigo-600 text-white border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70 font-black uppercase text-[10px] tracking-widest">Traités total</CardDescription>
              <CardTitle className="text-4xl font-black">{processedSubs.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-lg border-2 border-dashed border-orange-200">
            <CardHeader className="pb-2">
              <CardDescription className="font-black uppercase text-[10px] tracking-widest text-orange-600">Santé Données</CardDescription>
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <Database className="h-5 w-5" /> 100%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto h-12 p-1 bg-muted rounded-full mb-8">
            <TabsTrigger value="submissions" className="rounded-full font-black uppercase text-[10px]">Demandes</TabsTrigger>
            <TabsTrigger value="history" className="rounded-full font-black uppercase text-[10px]">Archives</TabsTrigger>
            <TabsTrigger value="comments" className="rounded-full font-black uppercase text-[10px]">Avis</TabsTrigger>
            <TabsTrigger value="migration" className="rounded-full font-black uppercase text-[10px] gap-2"><Database className="h-3 w-3" /> Migration</TabsTrigger>
          </TabsList>

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

          <TabsContent value="migration">
            <div className="space-y-8">
              <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border-2 border-dashed border-muted-foreground/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                      <Database className="h-8 w-8 text-orange-500" /> Réconciliation Rétroactive
                    </h2>
                    <p className="text-muted-foreground font-bold max-w-xl">
                      Cet outil analyse les comptes créés avant le nouveau workflow. Il permet de recréer les documents identitaires manquants sans altérer les profils existants.
                    </p>
                  </div>
                  <Button 
                    onClick={runAudit} 
                    disabled={isAuditing}
                    className="bg-foreground hover:bg-brand text-white font-black uppercase tracking-widest text-xs h-16 px-10 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 shrink-0"
                  >
                    {isAuditing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileSearch className="mr-2 h-5 w-5" />}
                    Lancer l'audit des données
                  </Button>
                </div>
              </section>

              {migrationStats && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="lg:col-span-1 bg-white rounded-3xl shadow-lg overflow-hidden h-fit border-none">
                    <CardHeader className="bg-muted/50 border-b">
                      <CardTitle className="text-sm font-black uppercase tracking-widest">Rapport d'Audit</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Comptes Noyaux (Actuels)</span>
                        <span className="text-xl font-black">{migrationStats.usersCount}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Profils Pilotes (standard)</span>
                        <span className="text-xl font-black">{migrationStats.stdCount}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Profils Pros (professional)</span>
                        <span className="text-xl font-black">{migrationStats.proCount}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-[10px] font-black uppercase text-orange-700">À RÉCONCILIER (Invisibles)</span>
                        </div>
                        <span className="text-2xl font-black text-orange-600">{migrationStats.toMigrate.length}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 p-6">
                      <Button 
                        onClick={applyMigration} 
                        disabled={migrationStats.toMigrate.length === 0 || isApplyingMigration}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs h-14 rounded-xl shadow-xl"
                      >
                        {isApplyingMigration ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4 fill-white" />}
                        Appliquer la Réconciliation (Apply)
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="lg:col-span-2 bg-white rounded-3xl shadow-lg border-none overflow-hidden">
                    <CardHeader className="bg-muted/50 border-b">
                      <CardTitle className="text-sm font-black uppercase tracking-widest">Détail des comptes orphelins détectés (Mode Dry Run)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[450px]">
                        {migrationStats.toMigrate.length > 0 ? (
                          <div className="divide-y">
                            {migrationStats.toMigrate.map((item, i) => (
                              <div key={i} className="p-6 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                                <div className="space-y-1">
                                  <p className="font-black text-sm uppercase">{item.displayName}</p>
                                  <div className="flex items-center gap-3">
                                    <code className="text-[8px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.uid}</code>
                                    <Badge variant="outline" className="text-[7px] uppercase">{item.source}</Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <p className="text-[9px] font-bold text-muted-foreground">{item.email}</p>
                                  <Badge className="bg-blue-100 text-blue-700 text-[8px] border-none">PRÊT POUR MIGRATION</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full py-20 opacity-30">
                            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                            <p className="font-black uppercase text-xs">Aucun orphelin détecté. Données saines.</p>
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="bg-indigo-50 p-8 rounded-[2rem] border-2 border-dashed border-indigo-200">
                <div className="flex items-start gap-4">
                  <Info className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-900">Rappel de la Logique de Migration</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-indigo-700/80">
                      <li className="flex gap-2">🔘 <p><strong>Migration Paresseuse</strong> : Un utilisateur sans document noyau est automatiquement réconcilié lors de sa prochaine connexion via le <code>FirebaseProvider</code>.</p></li>
                      <li className="flex gap-2">🔘 <p><strong>Intégrité des Données</strong> : Les profils métiers ne sont jamais supprimés ni modifiés. Seul le document <code>users/</code> (Identité) est créé ou enrichi.</p></li>
                      <li className="flex gap-2">🔘 <p><strong>Vérification Email</strong> : L'état vérifié sera resynchronisé au premier Login. En attendant, ils sont marqués <code>emailVerifiedSync: false</code>.</p></li>
                      <li className="flex gap-2">🔘 <p><strong>Audit Bulk (Script)</strong> : Cette interface permet de traiter en masse les comptes "silencieux" qui ne se sont pas connectés depuis la mise à jour.</p></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
             <Card className="rounded-3xl shadow-lg overflow-hidden bg-background">
               <CardContent className="p-0">
                 <ScrollArea className="h-[600px]">
                   {processedSubs.map(sub => (
                     <div key={sub.id} className="p-6 border-b last:border-0 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                        <div className="space-y-1">
                          <p className="font-black text-base uppercase tracking-tight">{sub.businessName}</p>
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] text-muted-foreground font-bold">{sub.addressRaw}</p>
                            <Badge variant="outline" className="text-[8px]">{sub.publishedCollection || 'Soumission'}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <Badge variant={sub.status === 'published' ? 'brand' : 'destructive'} className="text-[9px] uppercase tracking-widest font-black px-4">{sub.status}</Badge>
                           <Button variant="ghost" size="icon" onClick={() => handleOpenDetail(sub)} className="rounded-full hover:bg-white"><ExternalLink className="h-4 w-4" /></Button>
                        </div>
                     </div>
                   ))}
                 </ScrollArea>
               </CardContent>
             </Card>
          </TabsContent>
          
          <TabsContent value="comments">
             <div className="text-center py-20 bg-background rounded-[2.5rem] border-2 border-dashed">
                <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="font-black uppercase text-muted-foreground">Module de modération des avis en cours de liaison.</p>
             </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden rounded-[2.5rem] p-0 border-none shadow-2xl flex flex-col z-[3000]">
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
                  <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full" onClick={() => setIsDetailOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-grow">
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
                                    <Input value={editDraft.businessName} onChange={e => setEditDraft({...editDraft, businessName: e.target.value})} className="font-bold rounded-xl h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Section App (Cible Collection)</Label>
                                    <Select value={editDraft.appSectionRequested} onValueChange={(v: any) => setEditDraft({...editDraft, appSectionRequested: v})}>
                                        <SelectTrigger className="font-bold h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
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
                                <Input value={editDraft.categoryRequested} onChange={e => setEditDraft({...editDraft, categoryRequested: e.target.value})} className="font-bold rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground ml-1">Adresse (mappe vers address et addresss)</Label>
                                <Textarea value={editDraft.addressRaw} onChange={e => setEditDraft({...editDraft, addressRaw: e.target.value})} className="font-bold rounded-xl min-h-[80px]" />
                                {editDraft.needsGeocoding && <p className="text-[8px] text-orange-500 font-bold ml-1">⚠️ Géocodage requis ou à vérifier.</p>}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b pb-2">
                                <Globe className="h-4 w-4 text-brand" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Contacts & Réseaux</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Téléphone (phoneNumber)</Label>
                                    <Input value={editDraft.phone} onChange={e => setEditDraft({...editDraft, phone: e.target.value})} className="font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">Site Web</Label>
                                    <Input value={editDraft.website} onChange={e => setEditDraft({...editDraft, website: e.target.value})} className="font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] uppercase font-black ml-1">E-mail</Label>
                                    <Input value={editDraft.email} onChange={e => setEditDraft({...editDraft, email: e.target.value})} className="font-bold" />
                                </div>
                            </div>
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
                                className="font-bold rounded-xl min-h-[100px] bg-muted/20" 
                            />
                            {editDraft.publishedAt && (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">PUBLIÉ LE {formatDate(editDraft.publishedAt)}</p>
                                    <p className="text-[8px] font-bold text-green-600 mt-1">DOC ID: {editDraft.publishedDocId} | COLL: {editDraft.publishedCollection}</p>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <Card className="bg-muted/30 border-2 border-dashed rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white/50 border-b py-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Search className="h-4 w-4" /> Détection Doublons</h3>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {duplicates.length > 0 ? (
                                    duplicates.map(d => (
                                        <div key={d.id} className="bg-white p-3 rounded-xl border flex flex-col gap-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-black text-[10px] uppercase truncate">{d.title}</p>
                                                    <p className="text-[8px] text-muted-foreground truncate">{d.phoneNumber}</p>
                                                </div>
                                                <Badge className="bg-orange-100 text-orange-700 text-[7px] uppercase border-none shrink-0">{d.col}</Badge>
                                            </div>
                                            <Button 
                                              variant="secondary" 
                                              size="sm" 
                                              className={cn("h-7 text-[8px] font-black uppercase rounded-lg", editDraft.publishTargetId === d.id && "bg-brand text-white")}
                                              onClick={() => handleLinkToDuplicate(d)}
                                            >
                                              <LinkIcon className="mr-1 h-3 w-3" /> 
                                              {editDraft.publishTargetId === d.id ? "Lien établi (MISE À JOUR)" : "Lier pour mise à jour"}
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[10px] italic text-muted-foreground text-center py-4">Aucun doublon trouvé.</p>
                                )}
                            </CardContent>
                        </Card>

                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Actions de Modération</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className={cn("rounded-xl text-[9px] font-black uppercase h-12", editDraft.status === 'in_review' && "bg-blue-50 border-blue-400")} onClick={() => handleUpdateStatus('in_review')} disabled={editDraft.status === 'in_review'}>🔘 {editDraft.status === 'in_review' ? 'En cours' : 'Examiner'}</Button>
                                <Button variant="outline" className="rounded-xl text-[9px] font-black uppercase h-12 text-destructive hover:bg-destructive/10" onClick={() => handleUpdateStatus('rejected')} disabled={editDraft.status === 'rejected'}>❌ {editDraft.status === 'rejected' ? 'Rejeté' : 'Rejeter'}</Button>
                            </div>
                            <Button variant="secondary" className="w-full rounded-xl text-[9px] font-black uppercase h-12" onClick={handleSaveDraft}>
                                <Save className="mr-2 h-4 w-4" /> Enregistrer sans publier
                            </Button>
                            <div className="pt-4">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-black uppercase tracking-widest h-16 shadow-xl" onClick={handlePublish} disabled={isPublishing || editDraft.status === 'published'}>
                                    {isPublishing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 fill-white" />}
                                    {editDraft.publishTargetId ? "Mettre à jour la fiche liée" : "Valider & Publier la fiche"}
                                </Button>
                                {editDraft.status === 'published' && (
                                    <p className="text-center text-green-600 text-[10px] font-black uppercase tracking-widest mt-4">✅ Fiche publiée</p>
                                )}
                            </div>
                        </section>

                        <div className="pt-10">
                            <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive text-[10px] font-bold flex items-center justify-center gap-2" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4" /> Supprimer définitivement
                            </Button>
                        </div>
                    </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

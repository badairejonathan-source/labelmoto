'use client';

import { useState, useEffect } from 'react';
import { useFirebase, useMemoFirebase, useCollection } from '@/firebase/client';
import { 
  collection, query, getDocs, doc, orderBy, where, 
  limit 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, CheckCircle, ArrowLeft, 
  Store, Search, ChevronRight, X, ExternalLink, 
  Trash2, Zap, Globe, Phone, MapPin, Info, Save, History,
  Database, AlertTriangle, FileSearch, ClipboardCheck, Terminal, Copy
} from 'lucide-react';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/client';
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
  toMigrate: any[];
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
        if (snap) snap.forEach(d => matches.push({ id: d.id, ...d.data(), col: colName }));
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
        updatedAt: new Date(),
        reviewedBy: user?.uid,
        reviewedAt: new Date()
    });
    setEditDraft(prev => prev ? { ...prev, status: newStatus } : null);
    toast({ title: `Statut mis à jour : ${newStatus}` });
  };

  const handleSaveDraft = () => {
    if (!firestore || !editDraft) return;
    updateDocumentNonBlocking(doc(firestore, 'listing_submissions', editDraft.id), {
        ...editDraft,
        updatedAt: new Date()
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
        publishedAt: new Date(),
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
        publishedAt: new Date(),
        publishedCollection: targetCol,
        publishedDocId: targetDocId,
        reviewedBy: user?.uid,
        reviewedAt: new Date()
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

  const pendingSubs = (submissions || []).filter(s => s.status === 'pending' || s.status === 'in_review' || s.status === 'approved');
  const processedSubs = (submissions || []).filter(s => s.status === 'published' || s.status === 'rejected');
  const pendingCommentsCount = (pendingComments || []).length;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-brand text-white border-none shadow-lg rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70 font-black uppercase text-[10px] tracking-widest">Pros en attente</CardDescription>
              <CardTitle className="text-4xl font-black">{pendingSubs.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-lg rounded-3xl bg-white border-none">
            <CardHeader className="pb-2">
              <CardDescription className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Avis modération</CardDescription>
              <CardTitle className="text-4xl font-black text-foreground">{pendingCommentsCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-lg bg-indigo-600 text-white border-none rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70 font-black uppercase text-[10px] tracking-widest">Traités total</CardDescription>
              <CardTitle className="text-4xl font-black">{processedSubs.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-lg bg-white border-2 border-dashed border-orange-200 rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription className="font-black uppercase text-[10px] tracking-widest text-orange-600">Santé Données</CardDescription>
              <CardTitle className="text-2xl font-black flex items-center gap-2 text-foreground">
                <Database className="h-5 w-5 text-orange-400" /> 100%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto h-12 p-1 bg-muted rounded-full mb-8 shadow-inner">
            <TabsTrigger value="submissions" className="rounded-full font-black uppercase text-[10px] tracking-widest">Demandes</TabsTrigger>
            <TabsTrigger value="history" className="rounded-full font-black uppercase text-[10px] tracking-widest">Archives</TabsTrigger>
            <TabsTrigger value="comments" className="rounded-full font-black uppercase text-[10px] tracking-widest">Avis</TabsTrigger>
            <TabsTrigger value="migration" className="rounded-full font-black uppercase text-[10px] tracking-widest gap-2"><Database className="h-3 w-3" /> Migration</TabsTrigger>
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
             <Card className="rounded-3xl shadow-lg overflow-hidden bg-background border-none">
               <CardContent className="p-0">
                 <ScrollArea className="h-[600px]">
                   {processedSubs.map(sub => (
                     <div key={sub.id} className="p-6 border-b last:border-0 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                        <div className="space-y-1">
                          <p className="font-black text-base uppercase tracking-tight">{sub.businessName}</p>
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] text-muted-foreground font-bold">{sub.addressRaw}</p>
                            <Badge variant="outline" className="text-[8px] font-black uppercase">{sub.publishedCollection || 'Soumission'}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <Badge variant={sub.status === 'published' ? 'brand' : 'destructive'} className="text-[9px] uppercase tracking-widest font-black px-4">{sub.status}</Badge>
                           <Button variant="ghost" size="icon" onClick={() => handleOpenDetail(sub)} className="rounded-full hover:bg-white transition-all hover:scale-110"><ExternalLink className="h-4 w-4" /></Button>
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
                <p className="font-black uppercase text-muted-foreground tracking-widest text-xs">Module de modération des avis en cours de liaison.</p>
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
                  <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-12 w-12 p-0" onClick={() => setIsDetailOpen(false)}><X className="h-6 w-6" /></Button>
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
                                    duplicates.map(d => (
                                        <div key={d.id} className="bg-white p-3 rounded-xl border-2 flex flex-col gap-2 shadow-sm">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-black text-[10px] uppercase truncate text-foreground">{d.title}</p>
                                                    <p className="text-[8px] text-muted-foreground truncate font-bold">{d.phoneNumber}</p>
                                                </div>
                                                <Badge className="bg-orange-100 text-orange-700 text-[7px] uppercase border-none shrink-0 font-black">{d.col}</Badge>
                                            </div>
                                            <Button 
                                              variant="secondary" 
                                              size="sm" 
                                              className={cn("h-7 text-[8px] font-black uppercase rounded-lg border", editDraft.publishTargetId === d.id ? "bg-brand text-white border-brand" : "bg-muted text-muted-foreground")}
                                              onClick={() => handleLinkToDuplicate(d)}
                                            >
                                              {editDraft.publishTargetId === d.id ? "Lien établi ✔" : "Lier pour mise à jour"}
                                            </Button>
                                        </div>
                                    ))
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
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

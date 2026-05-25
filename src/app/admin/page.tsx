'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useFirebase } from '@/firebase';
import { collection, query, limit, getDocs, writeBatch, doc, onSnapshot, orderBy, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, CheckCircle, ArrowLeft, ShieldAlert, MessageSquare, 
  Database, Zap, Terminal, BarChart3, Store, Search, AlertTriangle, 
  ChevronRight, X, ExternalLink, Globe, Phone, MapPin, Trash2
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
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ADMIN_UID = "A36FqeWBHjQBLKQMaMSiFVBzGV22";

interface Submission {
  id: string;
  title: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  category: string;
  description?: string;
  submittedAt?: any;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'published';
  appSection: 'shopping' | 'service' | 'association' | 'relais' | 'both';
  [key: string]: any;
}

export default function AdminPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pendingComments, setPendingComments] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  // Logs & Maintenance
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [migrationProgress, setMigrationProgress] = useState(0);

  useEffect(() => {
    if (!isUserLoading && (!user || user.uid !== ADMIN_UID)) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!firestore || !user || user.uid !== ADMIN_UID) return;

    const unsubSubmissions = onSnapshot(
      query(collection(firestore, 'pending_concessions'), orderBy('submittedAt', 'desc')), 
      (snap) => {
        setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission)));
        setIsLoadingData(false);
      }
    );

    const unsubComments = onSnapshot(
      query(collection(firestore, 'pending_comments'), orderBy('date', 'desc')), 
      (snap) => {
        setPendingComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    return () => {
      unsubSubmissions();
      unsubComments();
    };
  }, [firestore, user]);

  const findDuplicates = async (submission: Submission) => {
    if (!firestore) return;
    const collections = ['concessions', 'associations', 'relais'];
    let matches: any[] = [];
    
    for (const colName of collections) {
      // Recherche simple par numéro de téléphone (très fiable)
      if (submission.phoneNumber) {
        const q = query(collection(firestore, colName), where('phoneNumber', '==', submission.phoneNumber));
        const snap = await getDocs(q);
        snap.forEach(d => matches.push({ id: d.id, ...d.data(), col: colName }));
      }
    }
    setDuplicates(matches);
  };

  const handleOpenDetail = (sub: Submission) => {
    setSelectedSubmission({ ...sub });
    setIsDetailOpen(true);
    findDuplicates(sub);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (!firestore) return;
    updateDocumentNonBlocking(doc(firestore, 'pending_concessions', id), { status: newStatus, updatedAt: new Date().toISOString() });
    toast({ title: `Statut mis à jour : ${newStatus}` });
  };

  const handlePublish = async () => {
    if (!firestore || !selectedSubmission) return;
    setIsPublishing(true);
    
    try {
      const { id, submittedAt, status, hp_field, source, ...data } = selectedSubmission;
      
      // 1. Normalisation finale
      const coords = extractValidCoordinates(data);
      const finalData = {
        ...data,
        slug: generateDealershipSlug(data),
        geohash: coords ? encodeGeohash(coords.lat, coords.lng, 9) : null,
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        publishedAt: new Date().toISOString(),
        publishedBy: user?.uid,
        status: 'active'
      };

      // 2. Détermination de la collection cible
      const targetCol = data.appSection === 'association' ? 'associations' : (data.appSection === 'relais' ? 'relais' : 'concessions');
      
      // 3. Écriture publique
      await setDocumentNonBlocking(doc(firestore, targetCol, id), finalData, { merge: true });
      
      // 4. Update soumission
      await updateDocumentNonBlocking(doc(firestore, 'pending_concessions', id), { status: 'published', publishedAt: new Date().toISOString() });
      
      toast({ title: "Fiche publiée avec succès !", description: `Visible dans ${targetCol}` });
      setIsDetailOpen(false);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur de publication", description: e.message });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteSub = (id: string) => {
    if (!window.confirm("Supprimer cette demande définitivement ?")) return;
    deleteDocumentNonBlocking(doc(firestore, 'pending_concessions', id));
    setIsDetailOpen(false);
    toast({ title: "Demande supprimée" });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date inconnue';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  if (isUserLoading || !user || user.uid !== ADMIN_UID) {
    return <div className="flex h-screen w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  const pendingSubs = submissions.filter(s => s.status === 'pending' || s.status === 'in_review');
  const processedSubs = submissions.filter(s => s.status === 'published' || s.status === 'rejected');

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="w-40 md:w-60"><LabelMotoLogo /></div>
          <div className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Accueil</Link></Button></div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-brand text-white">
            <CardHeader className="pb-2"><CardDescription className="text-white/70 font-bold uppercase text-[10px]">En attente</CardDescription><CardTitle className="text-3xl font-black">{pendingSubs.length}</CardTitle></CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardDescription className="font-bold uppercase text-[10px]">Avis à modérer</CardDescription><CardTitle className="text-3xl font-black">{pendingComments.length}</CardTitle></CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto h-12 p-1 bg-muted rounded-full mb-8">
            <TabsTrigger value="submissions" className="rounded-full font-bold text-xs">Soumissions {pendingSubs.length > 0 && <Badge className="ml-2 bg-brand">{pendingSubs.length}</Badge>}</TabsTrigger>
            <TabsTrigger value="history" className="rounded-full font-bold text-xs">Historique</TabsTrigger>
            <TabsTrigger value="maintenance" className="rounded-full font-bold text-xs">Outils</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            {isLoadingData ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
            ) : pendingSubs.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed"><CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" /><h2 className="text-xl font-bold">Aucune demande en attente.</h2></div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingSubs.map(sub => (
                  <Card key={sub.id} className={cn("flex flex-col border-2 transition-all hover:border-brand cursor-pointer", sub.status === 'in_review' && "border-blue-400 bg-blue-50/10")} onClick={() => handleOpenDetail(sub)}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-black uppercase tracking-tight">{sub.title}</CardTitle>
                        <Badge variant={sub.status === 'in_review' ? 'default' : 'outline'} className="text-[8px]">{sub.status}</Badge>
                      </div>
                      <CardDescription className="text-[10px] font-bold">Soumis {formatDate(sub.submittedAt)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <div className="flex items-start gap-2 text-xs"><MapPin className="h-3 w-3 text-muted-foreground mt-0.5" /> <p className="font-medium">{sub.address}</p></div>
                      <div className="flex items-center gap-2 text-xs font-black text-brand uppercase tracking-widest"><Store className="h-3 w-3" /> {sub.category}</div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 p-3 border-t">
                      <Button variant="ghost" size="sm" className="w-full font-black uppercase text-[9px] tracking-widest">Examiner la demande <ChevronRight className="ml-2 h-3 w-3" /></Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
             <Card>
               <CardContent className="p-0">
                 <ScrollArea className="h-[600px]">
                   {processedSubs.map(sub => (
                     <div key={sub.id} className="p-4 border-b last:border-0 flex items-center justify-between group hover:bg-muted/30">
                        <div className="space-y-1">
                          <p className="font-black text-sm uppercase">{sub.title}</p>
                          <p className="text-[10px] text-muted-foreground font-bold">{sub.address}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <Badge variant={sub.status === 'published' ? 'brand' : 'destructive'} className="text-[9px] uppercase">{sub.status}</Badge>
                           <Button variant="ghost" size="icon" onClick={() => handleOpenDetail(sub)}><ExternalLink className="h-4 w-4" /></Button>
                        </div>
                     </div>
                   ))}
                 </ScrollArea>
               </CardContent>
             </Card>
          </TabsContent>
          
          <TabsContent value="maintenance">
             {/* Maintenance content here (from original page) */}
             <div className="text-center py-20">Utilisez cet onglet pour les migrations de masse.</div>
          </TabsContent>
        </Tabs>
      </main>

      {/* DETAIL DIALOG - THE REVIEW STATION */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-0 border-none shadow-2xl">
          {selectedSubmission && (
            <>
              <DialogHeader className="bg-brand text-white p-8">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-3xl font-black uppercase tracking-tighter">Révision : {selectedSubmission.title}</DialogTitle>
                  <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setIsDetailOpen(false)}><X className="h-6 w-6" /></Button>
                </div>
                <DialogDescription className="text-white/80 font-bold">Vérifiez les données et corrigez-les avant de publier sur la carte.</DialogDescription>
              </DialogHeader>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* FORMULAIRE D'ÉDITION */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground border-b pb-2">Données de la soumission</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-black">Nom de l'établissement</Label>
                      <Input value={selectedSubmission.title} onChange={e => setSelectedSubmission({...selectedSubmission, title: e.target.value})} className="font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-black">Catégorie</Label>
                        <Input value={selectedSubmission.category} onChange={e => setSelectedSubmission({...selectedSubmission, category: e.target.value})} className="font-bold" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-black">Section App</Label>
                        <Select value={selectedSubmission.appSection} onValueChange={v => setSelectedSubmission({...selectedSubmission, appSection: v as any})}>
                          <SelectTrigger className="font-bold"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shopping">Concession</SelectItem>
                            <SelectItem value="service">Atelier</SelectItem>
                            <SelectItem value="both">Mixte</SelectItem>
                            <SelectItem value="association">Association</SelectItem>
                            <SelectItem value="relais">Relais Motard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-black">Adresse</Label>
                      <Textarea value={selectedSubmission.address} onChange={e => setSelectedSubmission({...selectedSubmission, address: e.target.value})} className="font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-black">Téléphone</Label>
                        <Input value={selectedSubmission.phoneNumber} onChange={e => setSelectedSubmission({...selectedSubmission, phoneNumber: e.target.value})} className="font-bold" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-black">Email</Label>
                        <Input value={selectedSubmission.email} onChange={e => setSelectedSubmission({...selectedSubmission, email: e.target.value})} className="font-bold" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-black">Site Web</Label>
                      <Input value={selectedSubmission.website} onChange={e => setSelectedSubmission({...selectedSubmission, website: e.target.value})} className="font-bold" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-black">Notes Admin (Internes)</Label>
                      <Textarea value={selectedSubmission.adminNotes || ''} onChange={e => setSelectedSubmission({...selectedSubmission, adminNotes: e.target.value})} placeholder="Ajouter un commentaire interne..." className="bg-muted/50 border-dashed" />
                    </div>
                  </div>
                </div>

                {/* DÉTECTION DE DOUBLONS & ACTIONS */}
                <div className="space-y-8">
                  <div className="bg-muted/30 p-6 rounded-3xl border-2 border-dashed">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-4 flex items-center gap-2"><Search className="h-4 w-4" /> Détection de doublons</h3>
                    {duplicates.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-[10px] text-destructive font-black uppercase animate-pulse">Attention : Doublon potentiel détecté</p>
                        {duplicates.map(d => (
                          <div key={d.id} className="p-3 bg-white border rounded-xl flex justify-between items-center">
                            <div><p className="font-black text-xs uppercase">{d.title}</p><p className="text-[9px] text-muted-foreground">{d.address}</p></div>
                            <Badge variant="outline">{d.col}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic font-medium">Aucun établissement identique trouvé en base.</p>
                    )}
                  </div>

                  <div className="space-y-3">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground border-b pb-2">Actions de modération</h3>
                     <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-14 font-black uppercase text-[10px]" onClick={() => handleUpdateStatus(selectedSubmission.id, 'in_review')} disabled={selectedSubmission.status === 'in_review'}>🔘 En cours</Button>
                        <Button variant="outline" className="h-14 font-black uppercase text-[10px] text-destructive hover:bg-destructive/10" onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}>❌ Rejeter</Button>
                     </div>
                     <Button className="w-full h-16 bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs shadow-xl" onClick={handlePublish} disabled={isPublishing}>
                        {isPublishing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                        Valider & Publier la fiche
                     </Button>
                     {selectedSubmission.status === 'published' && (
                       <p className="text-center text-green-600 text-[10px] font-black uppercase tracking-widest">✅ Cette fiche est déjà en ligne</p>
                     )}
                     <div className="pt-6">
                        <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive" onClick={() => handleDeleteSub(selectedSubmission.id)}><Trash2 className="mr-2 h-4 w-4" /> Supprimer la soumission</Button>
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

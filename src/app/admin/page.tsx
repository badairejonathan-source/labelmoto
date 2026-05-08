'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirebase } from '@/firebase';
import { collection, query, limit, startAfter, getDocs, writeBatch, doc, onSnapshot, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, ArrowLeft, AlertTriangle, ShieldAlert, RefreshCw, MessageSquare, Star, User, ShieldCheck, Trash2, Database, Zap, Terminal } from 'lucide-react';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';
import { encodeGeohash, extractValidCoordinates } from '@/lib/geohash';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const ADMIN_UID = "A36FqeWBHjQBLKQMaMSiFVBzGV22";

interface Submission {
  id: string;
  title: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  category: 'concession' | 'atelier' | 'accessoiriste' | 'concession-atelier' | 'association' | 'autre';
  brands?: string[];
  description?: string;
  submittedAt?: any;
  quarantinedAt?: any;
  quarantineSource?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

interface UserComment {
  id: string;
  userName: string;
  dealershipName: string;
  content: string;
  rating: number;
  date: any;
  dealershipId: string;
}

interface MigrationStats {
  scanned: number;
  updated: number;
  ignored: number;
  errors: number;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quarantineSubmissions, setQuarantineSubmissions] = useState<Submission[]>([]);
  const [pendingComments, setPendingComments] = useState<UserComment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const { firestore, user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user || user.uid !== ADMIN_UID) {
        router.push('/login');
      }
    }
  }, [user, isUserLoading, router]);

  // ÉCOUTEURS TEMPS RÉEL POUR LA MODÉRATION
  useEffect(() => {
    if (!firestore || !user || user.uid !== ADMIN_UID) return;

    const unsubSubmissions = onSnapshot(query(collection(firestore, 'pending_concessions'), orderBy('submittedAt', 'desc')), (snap) => {
      setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission)));
      setIsLoadingData(false);
    });

    const unsubComments = onSnapshot(query(collection(firestore, 'pending_comments'), orderBy('date', 'desc')), (snap) => {
      setPendingComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserComment)));
    });

    const unsubQuarantine = onSnapshot(query(collection(firestore, 'a_verifier'), orderBy('submittedAt', 'desc')), (snap) => {
      setQuarantineSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission)));
    });

    return () => {
      unsubSubmissions();
      unsubComments();
      unsubQuarantine();
    };
  }, [firestore, user]);

  const addLog = (msg: string) => {
    setMigrationLogs(prev => [...prev.slice(-49), `> ${new Date().toLocaleTimeString()} : ${msg}`]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [migrationLogs]);

  const runGeohashMigration = async () => {
    if (!firestore || isMigrating) return;
    if (!window.confirm("La migration va analyser tous les documents et ne mettra à jour que ceux dont le Geohash est absent ou incorrect. Continuer ?")) return;

    setIsMigrating(true);
    setMigrationProgress(0);
    setMigrationLogs([]);
    setStats({ scanned: 0, updated: 0, ignored: 0, errors: 0 });
    addLog("Démarrage de la migration idempotente...");
    
    try {
      const collectionsToMigrate = ['concessions', 'associations', 'relais'];
      let currentStats = { scanned: 0, updated: 0, ignored: 0, errors: 0 };

      for (const colName of collectionsToMigrate) {
        addLog(`Analyse de la collection : ${colName.toUpperCase()}`);
        let lastDoc = null;
        let hasMore = true;

        while (hasMore) {
          const q = lastDoc 
            ? query(collection(firestore, colName), startAfter(lastDoc), limit(50))
            : query(collection(firestore, colName), limit(50));

          const snapshot = await getDocs(q);
          if (snapshot.empty) {
            hasMore = false;
            continue;
          }

          const batch = writeBatch(firestore);
          let updatesInBatch = 0;

          for (const docSnapshot of snapshot.docs) {
            currentStats.scanned++;
            const data = docSnapshot.data();
            const coords = extractValidCoordinates(data);

            if (coords) {
              const calculatedHash = encodeGeohash(coords.lat, coords.lng, 9);
              
              if (data.geohash !== calculatedHash || data.latitude !== coords.lat || data.longitude !== coords.lng) {
                batch.update(docSnapshot.ref, { 
                  geohash: calculatedHash, 
                  latitude: coords.lat, 
                  longitude: coords.lng 
                });
                updatesInBatch++;
                currentStats.updated++;
              } else {
                currentStats.ignored++;
              }
            } else {
              currentStats.errors++;
              addLog(`Coordonnées invalides pour ${data.title || docSnapshot.id}`);
            }
          }

          if (updatesInBatch > 0) {
            await batch.commit();
            addLog(`Lot de ${updatesInBatch} modifications enregistré.`);
          }

          lastDoc = snapshot.docs[snapshot.docs.length - 1];
          setStats({ ...currentStats });
          setMigrationProgress(prev => Math.min(prev + 5, 95));
        }
      }

      setMigrationProgress(100);
      setStats({ ...currentStats });
      addLog(`MIGRATION TERMINÉE.`);
      toast({ title: "Migration réussie !" });
    } catch (e: any) {
      addLog(`ERREUR CRITIQUE : ${e.message}`);
      toast({ title: "Erreur de migration", variant: "destructive" });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleApproveSubmission = (submission: Submission, fromCollection: 'pending_concessions' | 'a_verifier') => {
    if (!firestore) return;
    setProcessingId(submission.id);
    
    // 1. Nettoyage des métadonnées de soumission
    const { id, quarantinedAt, quarantineSource, status, submittedAt, requestType, ...cleanData } = submission as any;

    // 2. AUTOMATISATION : Calcul et validation des coordonnées + geohash
    const coords = extractValidCoordinates(cleanData);
    let geohash = cleanData.geohash || "";
    let finalLat = cleanData.latitude;
    let finalLng = cleanData.longitude;

    if (coords) {
      geohash = encodeGeohash(coords.lat, coords.lng, 9);
      finalLat = coords.lat;
      finalLng = coords.lng;
    }

    const targetCollection = cleanData.appSection === 'association' ? 'associations' : (cleanData.appSection === 'relais' ? 'relais' : 'concessions');

    const finalDocument = {
      ...cleanData,
      latitude: finalLat,
      longitude: finalLng,
      geohash,
      appSection: cleanData.appSection || (cleanData.category?.includes('concession') ? 'both' : 'service'),
      updatedAt: new Date().toISOString()
    };

    setDocumentNonBlocking(doc(firestore, targetCollection, submission.id), finalDocument, { merge: true });
    deleteDocumentNonBlocking(doc(firestore, fromCollection, submission.id));

    toast({ title: 'Action réussie !', description: `${submission.title} est maintenant public et indexé.` });
    setProcessingId(null);
  };

  const handleReject = (id: string, fromCollection: string) => {
    if (!firestore) return;
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet élément ?")) return;
    
    setProcessingId(id);
    deleteDocumentNonBlocking(doc(firestore, fromCollection, id));
    toast({ title: 'Supprimé définitivement', variant: 'destructive' });
    setProcessingId(null);
  };

  const handleApproveComment = (comment: UserComment) => {
    if (!firestore) return;
    setProcessingId(comment.id);
    setDocumentNonBlocking(doc(firestore, 'concessions', comment.dealershipId, 'comments', comment.id), comment, {});
    deleteDocumentNonBlocking(doc(firestore, 'pending_comments', comment.id));
    toast({ title: 'Commentaire approuvé !' });
    setProcessingId(null);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date inconnue';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    try {
        return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (e) {
        return 'Date invalide';
    }
  };

  if (isUserLoading || !user || user.uid !== ADMIN_UID) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="w-40 md:w-60">
            <LabelMotoLogo />
          </div>
          <div className="flex gap-2">
             <Button asChild variant="outline" size="sm">
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Accueil</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 max-w-3xl mx-auto h-12 p-1 bg-muted rounded-full">
            <TabsTrigger value="pending" className="rounded-full font-bold text-xs">
                Pros {submissions.length > 0 && <Badge className="ml-2 bg-brand">{submissions.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-full font-bold text-xs">
                Avis {pendingComments.length > 0 && <Badge className="ml-2 bg-blue-500">{pendingComments.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="quarantine" className="rounded-full font-bold text-destructive text-xs">
                ⚠️ Quarantaine {quarantineSubmissions.length > 0 && <Badge variant="destructive" className="ml-2">{quarantineSubmissions.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="rounded-full font-bold text-indigo-600 text-xs">
                <Database className="mr-2 h-4 w-4" /> Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {isLoadingData ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-xl font-bold">Tout est à jour !</h2>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {submissions.map(sub => (
                  <Card key={sub.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{sub.title}</CardTitle>
                      <CardDescription>Soumis {formatDate(sub.submittedAt)}</CardDescription>
                      <Badge variant="outline" className="w-fit mt-1">{sub.requestType || 'CRÉATION'}</Badge>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2 text-sm">
                      <p><strong>Adresse:</strong> {sub.address}</p>
                      {sub.phoneNumber && <p><strong>Tél:</strong> {sub.phoneNumber}</p>}
                      {sub.description && <p className="italic text-muted-foreground bg-muted/50 p-2 rounded mt-2">{sub.description}</p>}
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end bg-muted/20 p-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => handleReject(sub.id, 'pending_concessions')} disabled={processingId === sub.id} className="text-destructive">Refuser</Button>
                      <Button size="sm" onClick={() => handleApproveSubmission(sub, 'pending_concessions')} disabled={processingId === sub.id} className="bg-brand">Approuver & Indexer</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments">
            {pendingComments.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed">
                <MessageSquare className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h2 className="text-xl font-bold">Aucun commentaire en attente</h2>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingComments.map(comment => (
                  <Card key={comment.id} className="flex flex-col border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-bold">{comment.userName}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3", i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                          ))}
                        </div>
                      </div>
                      <CardDescription>Sur <strong>{comment.dealershipName}</strong></CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm italic bg-muted/50 p-3 rounded-md">"{comment.content}"</p>
                      <p className="text-[10px] text-muted-foreground mt-2">{formatDate(comment.date)}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end bg-muted/20 p-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => handleReject(comment.id, 'pending_comments')} disabled={processingId === comment.id} className="text-destructive">Supprimer</Button>
                      <Button size="sm" onClick={() => handleApproveComment(comment)} disabled={processingId === comment.id} className="bg-blue-600 hover:bg-blue-700">Publier</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quarantine">
            {quarantineSubmissions.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed">
                <ShieldAlert className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-xl font-bold">Quarantaine vide</h2>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quarantineSubmissions.map(sub => (
                  <Card key={sub.id} className="flex flex-col border-l-4 border-l-destructive">
                    <CardHeader>
                      <CardTitle className="text-lg">{sub.title}</CardTitle>
                      <CardDescription>{sub.quarantineSource === 'manual_admin_action' ? 'Modéré manuellement' : 'Auto-détecté'} - {formatDate(sub.quarantinedAt || sub.submittedAt)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2 text-sm italic text-muted-foreground">
                      <div className="bg-muted/30 p-3 rounded-lg text-xs not-italic text-foreground">
                        <p><strong>Adresse:</strong> {sub.address}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end bg-muted/20 p-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => handleReject(sub.id, 'a_verifier')} disabled={processingId === sub.id} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Supprimer</Button>
                      <Button size="sm" onClick={() => handleApproveSubmission(sub, 'a_verifier')} disabled={processingId === sub.id} className="bg-brand"><ShieldCheck className="mr-2 h-4 w-4" /> Réintégrer & Indexer</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="maintenance">
             <div className="max-w-3xl mx-auto space-y-6">
                <Card className="border-2 border-indigo-200 overflow-hidden">
                    <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                        <CardTitle className="text-indigo-900 flex items-center gap-2"><Database className="h-6 w-6" /> Maintenance Géo-Spatiale</CardTitle>
                        <p className="text-xs font-black text-indigo-700 uppercase tracking-widest mt-1 italic">Mise à jour idempotente des Geohashes</p>
                    </CardHeader>
                    <CardContent className="py-8 space-y-8">
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
                            <p className="text-sm font-black text-amber-900 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> FONCTIONNEMENT :</p>
                            <p className="text-xs text-amber-800 mt-2 leading-relaxed">
                                L'outil parcourt tous les établissements et ne met à jour <strong>que ceux qui ont changé</strong> ou qui n'ont pas encore de Geohash. 
                                <br/><br/>
                                <strong>Cette opération est sécurisée et peut être relancée sans risque en cas d'interruption.</strong>
                            </p>
                        </div>
                        
                        {(isMigrating || migrationLogs.length > 0 || stats) && (
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-1">
                                    <span>{isMigrating ? "Analyse en cours..." : "Rapport de maintenance"}</span>
                                    <span>{migrationProgress}%</span>
                                </div>
                                <Progress value={migrationProgress} className="h-3 bg-indigo-100" />
                                
                                {stats && (
                                    <div className="grid grid-cols-4 gap-2">
                                        <Card className="bg-white p-3 text-center border-none shadow-sm">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Scannés</p>
                                            <p className="text-lg font-black text-foreground">{stats.scanned}</p>
                                        </Card>
                                        <Card className="bg-green-50 p-3 text-center border-none shadow-sm">
                                            <p className="text-[10px] font-black text-green-700 uppercase mb-1">Mis à jour</p>
                                            <p className="text-lg font-black text-green-600">{stats.updated}</p>
                                        </Card>
                                        <Card className="bg-indigo-50 p-3 text-center border-none shadow-sm">
                                            <p className="text-[10px] font-black text-indigo-700 uppercase mb-1">OK (Skip)</p>
                                            <p className="text-lg font-black text-indigo-600">{stats.ignored}</p>
                                        </Card>
                                        <Card className="bg-red-50 p-3 text-center border-none shadow-sm">
                                            <p className="text-[10px] font-black text-red-700 uppercase mb-1">Erreurs</p>
                                            <p className="text-lg font-black text-red-600">{stats.errors}</p>
                                        </Card>
                                    </div>
                                )}

                                <Card className="bg-black border-none shadow-inner rounded-xl">
                                    <CardHeader className="py-3 px-4 border-b border-white/10">
                                        <CardTitle className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                            <Terminal className="h-3 w-3" /> Console de logs
                                        </CardTitle>
                                    </CardHeader>
                                    <ScrollArea className="h-48 p-4">
                                        <div className="space-y-1 font-mono text-[10px] md:text-xs">
                                            {migrationLogs.map((log, i) => (
                                                <p key={i} className={cn(
                                                    "leading-tight",
                                                    log.includes('TERMINÉE') ? "text-green-400 font-bold" : 
                                                    log.includes('ERREUR') ? "text-red-400 font-bold" : "text-indigo-200/70"
                                                )}>
                                                    {log}
                                                </p>
                                            ))}
                                            <div ref={logEndRef} />
                                        </div>
                                    </ScrollArea>
                                </Card>
                            </div>
                        )}

                        <Button 
                            className={cn(
                                "w-full h-16 font-black uppercase tracking-widest text-xs shadow-xl transition-all",
                                isMigrating ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
                            )}
                            onClick={runGeohashMigration}
                            disabled={isMigrating}
                        >
                            {isMigrating ? (
                              <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Traitement en cours...</>
                            ) : (
                              <><Zap className="mr-3 h-6 w-6" /> Lancer la maintenance Geohash</>
                            )}
                        </Button>
                    </CardContent>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

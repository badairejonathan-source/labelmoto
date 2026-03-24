
'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, ArrowLeft, AlertTriangle, ShieldAlert, RefreshCw, MessageSquare, Star, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import { Dealership } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useRouter } from 'next/navigation';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';

const ADMIN_UID = "A36FqeWBHjQBLKQMaMSiFVBzGV22";

interface Submission {
  id: string;
  title: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  placeUrl?: string;
  category: 'concession' | 'atelier' | 'accessoiriste' | 'concession-atelier' | 'autre';
  brands?: string[];
  description?: string;
  submittedAt?: any;
  quarantinedAt?: any;
  quarantineSource?: string;
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

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quarantineSubmissions, setQuarantineSubmissions] = useState<Submission[]>([]);
  const [pendingComments, setPendingComments] = useState<UserComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
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

  useEffect(() => {
    if (!firestore || !user || user.uid !== ADMIN_UID) return;

    // Submissions Pro standards
    const submissionsRef = collection(firestore, 'pending_concessions');
    const unsubSubmissions = onSnapshot(submissionsRef, 
      (snapshot) => {
        setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
        setIsLoading(false);
      },
      async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: submissionsRef.path, operation: 'list' }));
      }
    );

    // Submissions en Quarantaine
    const quarantineRef = collection(firestore, 'a_verifier');
    const unsubQuarantine = onSnapshot(quarantineRef, 
      (snapshot) => {
        setQuarantineSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
      },
      async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: quarantineRef.path, operation: 'list' }));
      }
    );

    // Commentaires en attente
    const commentsRef = collection(firestore, 'pending_comments');
    const unsubComments = onSnapshot(commentsRef, 
      (snapshot) => {
        setPendingComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserComment)));
      },
      async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: commentsRef.path, operation: 'list' }));
      }
    );

    return () => {
      unsubSubmissions();
      unsubQuarantine();
      unsubComments();
    };
  }, [firestore, user]);

  const handleApproveSubmission = (submission: Submission, fromCollection: 'pending_concessions' | 'a_verifier') => {
    if (!firestore) return;
    setProcessingId(submission.id);
    
    // On nettoie l'objet pour l'insertion
    const { id, quarantinedAt, quarantineSource, ...data } = submission as any;

    const newConcession = {
      ...data,
      appSection: submission.category?.includes('concession') ? 'both' : 'service',
      rating: data.rating || '0',
      imgUrl: data.imgUrl || '',
    };

    setDocumentNonBlocking(doc(firestore, 'concessions', submission.id), newConcession, {});
    deleteDocumentNonBlocking(doc(firestore, fromCollection, submission.id));

    toast({ title: 'Approuvé !', description: `${submission.title} est maintenant public.` });
    setProcessingId(null);
  };

  const handleReject = (id: string, fromCollection: string) => {
    if (!firestore) return;
    setProcessingId(id);
    deleteDocumentNonBlocking(doc(firestore, fromCollection, id));
    toast({ title: 'Supprimé', variant: 'destructive' });
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
            <Link href="/"><LabelMotoLogo /></Link>
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
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-2xl mx-auto h-12 p-1 bg-muted rounded-full">
            <TabsTrigger value="pending" className="rounded-full font-bold">
                Demandes Pros {submissions.length > 0 && <Badge className="ml-2 bg-brand">{submissions.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-full font-bold">
                Commentaires {pendingComments.length > 0 && <Badge className="ml-2 bg-blue-50">{pendingComments.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="quarantine" className="rounded-full font-bold text-destructive">
                Quarantaine {quarantineSubmissions.length > 0 && <Badge variant="destructive" className="ml-2">{quarantineSubmissions.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {submissions.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-xl font-bold">Aucune demande pro</h2>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {submissions.map(sub => (
                  <Card key={sub.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{sub.title}</CardTitle>
                      <CardDescription>Soumis {formatDate(sub.submittedAt)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2 text-sm">
                      <p><strong>Adresse:</strong> {sub.address}</p>
                      <p><strong>Tél:</strong> {sub.phoneNumber}</p>
                      {sub.brands && <div className="flex flex-wrap gap-1 mt-2">{sub.brands.map(b => <Badge key={b} variant="outline">{b}</Badge>)}</div>}
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end bg-muted/20 p-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => handleReject(sub.id, 'pending_concessions')} disabled={processingId === sub.id} className="text-destructive">
                        Refuser
                      </Button>
                      <Button size="sm" onClick={() => handleApproveSubmission(sub, 'pending_concessions')} disabled={processingId === sub.id} className="bg-brand">
                        Approuver
                      </Button>
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
                <h2 className="text-xl font-bold">Aucun commentaire à modérer</h2>
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
                      <Button variant="outline" size="sm" onClick={() => handleReject(comment.id, 'pending_comments')} disabled={processingId === comment.id} className="text-destructive">
                        Supprimer
                      </Button>
                      <Button size="sm" onClick={() => handleApproveComment(comment)} disabled={processingId === comment.id} className="bg-blue-600 hover:bg-blue-700">
                        Publier
                      </Button>
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
                      <CardTitle className="text-lg flex justify-between items-center">
                        {sub.title}
                        {sub.quarantineSource === 'manual_admin_action' ? <ShieldAlert className="h-5 w-5 text-destructive" /> : <AlertTriangle className="h-5 w-5 text-orange-500" />}
                      </CardTitle>
                      <CardDescription>
                        {sub.quarantineSource === 'manual_admin_action' ? 'Mis en quarantaine par Admin' : 'Détecté auto (contient "auto")'} - {formatDate(sub.quarantinedAt || sub.submittedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2 text-sm italic text-muted-foreground">
                      {sub.description ? `"${sub.description}"` : 'Pas de description fournie.'}
                      <div className="pt-2 text-[10px] not-italic uppercase font-black tracking-widest text-foreground">
                        Adresse: {sub.address}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end bg-muted/20 p-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => handleReject(sub.id, 'a_verifier')} disabled={processingId === sub.id} className="text-destructive">
                        Supprimer
                      </Button>
                      <Button size="sm" onClick={() => handleApproveSubmission(sub, 'a_verifier')} disabled={processingId === sub.id} className="bg-brand">
                        <ShieldCheck className="mr-2 h-4 w-4" /> Approuver
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

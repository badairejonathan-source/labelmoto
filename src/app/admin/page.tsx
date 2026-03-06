
'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, ArrowLeft, AlertTriangle, ShieldAlert, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import { Dealership } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// This should match the form schema in register page
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
  lundi?: string;
  mardi?: string;
  mercredi?: string;
  jeudi?: string;
  vendredi?: string;
  samedi?: string;
  dimanche?: string;
  submittedAt?: {
    seconds: number;
    nanoseconds: number;
  };
  isQuarantined?: boolean;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quarantineSubmissions, setQuarantineSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { firestore } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;

    // Listen to standard submissions
    const submissionsRef = collection(firestore, 'pending_concessions');
    const unsubSubmissions = onSnapshot(submissionsRef, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
      setSubmissions(subs);
      setIsLoading(false);
    });

    // Listen to quarantined submissions
    const quarantineRef = collection(firestore, 'a_verifier');
    const unsubQuarantine = onSnapshot(quarantineRef, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
      setQuarantineSubmissions(subs);
    });

    return () => {
      unsubSubmissions();
      unsubQuarantine();
    };
  }, [firestore]);

  const getAppSection = (category: Submission['category']): Dealership['appSection'] => {
    switch (category) {
      case 'concession':
      case 'accessoiriste':
        return 'shopping';
      case 'atelier':
        return 'service';
      case 'concession-atelier':
        return 'both';
      default:
        return 'both';
    }
  };

  const handleRetroactiveCleanup = async () => {
    if (!firestore || isCleaningUp) return;
    
    setIsCleaningUp(true);
    let count = 0;

    try {
      const concessionsRef = collection(firestore, 'concessions');
      const snapshot = await getDocs(concessionsRef);
      
      for (const dDoc of snapshot.docs) {
        const data = dDoc.data();
        const textToScan = `${data.title || ''} ${data.description || ''} ${data.address || ''}`.toLowerCase();
        
        const hasAuto = textToScan.includes('automobile') || textToScan.includes('automobiles');
        const hasMoto = textToScan.includes('moto') || textToScan.includes('motos');

        if (hasAuto && !hasMoto) {
          // Move to quarantine
          const submissionData = {
            ...data,
            id: dDoc.id,
            isQuarantined: true,
            quarantinedAt: serverTimestamp(),
            quarantineReason: 'Détection rétroactive automobile sans mention moto'
          };
          
          await setDoc(doc(firestore, 'a_verifier', dDoc.id), submissionData);
          await deleteDoc(doc(firestore, 'concessions', dDoc.id));
          count++;
        }
      }

      toast({
        title: 'Nettoyage terminé',
        description: `${count} fiches ont été déplacées en quarantaine.`,
      });
    } catch (error) {
      console.error("Erreur lors du nettoyage rétroactif:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur de nettoyage',
        description: 'Une erreur est survenue lors du scan des fiches.',
      });
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleApprove = async (submission: Submission, fromCollection: 'pending_concessions' | 'a_verifier') => {
    setProcessingId(submission.id);
    try {
      const newConcession: Omit<Dealership, 'id' | 'latitude' | 'longitude' | 'position' | 'rating' | 'imgUrl' > = {
        title: submission.title,
        address: submission.address,
        website: submission.website || '',
        phoneNumber: submission.phoneNumber || '',
        email: submission.email || '',
        brands: submission.brands || [],
        lundi: submission.lundi || 'Non renseigné',
        mardi: submission.mardi || 'Non renseigné',
        mercredi: submission.mercredi || 'Non renseigné',
        jeudi: submission.jeudi || 'Non renseigné',
        vendredi: submission.vendredi || 'Non renseigné',
        samedi: submission.samedi || 'Non renseigné',
        dimanche: submission.dimanche || 'Non renseigné',
        category: submission.category,
        appSection: getAppSection(submission.category),
        imgUrl: '',
        placeUrl: submission.placeUrl || '',
        rating: '',
      };

      await setDoc(doc(firestore, 'concessions', submission.id), newConcession);
      await deleteDoc(doc(firestore, fromCollection, submission.id));

      toast({
        title: 'Approuvé !',
        description: `${submission.title} a été ajouté à la liste publique.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'approbation : ", error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible d'approuver la fiche.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (submissionId: string, fromCollection: 'pending_concessions' | 'a_verifier') => {
    setProcessingId(submissionId);
    try {
      await deleteDoc(doc(firestore, fromCollection, submissionId));
      toast({
        title: 'Rejeté',
        description: 'La soumission a été supprimée.',
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Erreur lors du rejet : ', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de rejeter la fiche.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date inconnue';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date();
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }

  const renderSubmissionCard = (sub: Submission, collectionName: 'pending_concessions' | 'a_verifier') => (
    <Card key={sub.id} className="flex flex-col border-l-4 border-l-brand/20">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{sub.title}</CardTitle>
            {collectionName === 'a_verifier' && (
                <Badge variant="destructive" className="flex gap-1 shrink-0">
                    <AlertTriangle className="h-3 w-3" />
                    Quarantaine
                </Badge>
            )}
        </div>
        <CardDescription>
          Soumis {formatDate(sub.submittedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <p><strong>Adresse:</strong> {sub.address}</p>
        <p><strong>Catégorie:</strong> {sub.category}</p>
        {sub.brands && sub.brands.length > 0 && (
          <div className="flex wrap gap-1 items-baseline">
            <strong className="mr-1">Marques:</strong>
            <div className="flex flex-wrap gap-1">
                {sub.brands.map(brand => <Badge key={brand} variant="outline" className="font-normal">{brand}</Badge>)}
            </div>
          </div>
        )}
        {sub.phoneNumber && <p><strong>Tél:</strong> {sub.phoneNumber}</p>}
        {sub.email && <p><strong>Email:</strong> {sub.email}</p>}
        {sub.website && <p><strong>Web:</strong> <a href={sub.website} target="_blank" rel="noreferrer" className="text-brand underline">{sub.website}</a></p>}
        {sub.placeUrl && <p><strong>Google:</strong> <a href={sub.placeUrl} target="_blank" rel="noreferrer" className="text-brand underline">{sub.placeUrl}</a></p>}
        {sub.description && (
            <div className="mt-2 p-3 bg-muted/50 rounded-md italic text-muted-foreground border-l-4 border-brand">
                "{sub.description}"
            </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-end bg-muted/20 p-4 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleReject(sub.id, collectionName)}
          disabled={processingId === sub.id}
          className="text-destructive hover:bg-destructive/10"
        >
          {processingId === sub.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          Refuser
        </Button>
        <Button 
          size="sm" 
          onClick={() => handleApprove(sub, collectionName)}
          disabled={processingId === sub.id}
          className="bg-brand hover:bg-brand/90"
        >
           {processingId === sub.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Approuver
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="w-40 md:w-60">
            <Link href="/">
              <LabelMotoLogo />
            </Link>
          </div>
          <h1 className="hidden md:block text-xl lg:text-2xl font-bold text-foreground">
            Validation des Fiches
          </h1>
          <div className="flex gap-2">
             <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetroactiveCleanup} 
                disabled={isCleaningUp}
                className="hidden sm:flex border-brand text-brand hover:bg-brand/10"
             >
                {isCleaningUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Nettoyage Rétroactif
             </Button>
             <Button asChild variant="outline" size="sm">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Accueil
                </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="bg-brand/10 border border-brand/20 p-4 rounded-xl flex items-center gap-4 sm:hidden">
             <div className="flex-1">
                <p className="text-sm font-bold text-brand">Outil de Maintenance</p>
                <p className="text-xs text-muted-foreground">Scannez les fiches existantes pour la quarantaine.</p>
             </div>
             <Button size="sm" variant="outline" onClick={handleRetroactiveCleanup} disabled={isCleaningUp} className="border-brand text-brand">
                {isCleaningUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
             </Button>
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto h-12 p-1 bg-muted rounded-full">
              <TabsTrigger value="pending" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm flex gap-2 font-bold">
                  Nouvelles
                  {submissions.length > 0 && <Badge variant="secondary" className="px-1.5 h-5 bg-brand text-white">{submissions.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="quarantine" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm flex gap-2 font-bold">
                  À vérifier
                  {quarantineSubmissions.length > 0 && <Badge variant="destructive" className="px-1.5 h-5">{quarantineSubmissions.length}</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-brand" />
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed">
                  <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold">Tout est à jour !</h2>
                  <p className="mt-2 text-muted-foreground">Il n'y a aucune nouvelle fiche standard à valider.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {submissions.map((sub) => renderSubmissionCard(sub, 'pending_concessions'))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="quarantine" className="mt-0">
              {quarantineSubmissions.length === 0 ? (
                <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed">
                  <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert className="h-10 w-10 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold">Quarantaine vide</h2>
                  <p className="mt-2 text-muted-foreground">Aucune fiche suspecte n'a été détectée ou signalée.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {quarantineSubmissions.map((sub) => renderSubmissionCard(sub, 'a_verifier'))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
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

  const formatDate = (timestamp: Submission['submittedAt']) => {
    if (!timestamp) return 'Date inconnue';
    const date = new Date(timestamp.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }

  const renderSubmissionCard = (sub: Submission, collectionName: 'pending_concessions' | 'a_verifier') => (
    <Card key={sub.id} className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle>{sub.title}</CardTitle>
            {collectionName === 'a_verifier' && (
                <Badge variant="destructive" className="flex gap-1">
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
            {sub.brands.map(brand => <Badge key={brand} variant="outline" className="font-normal">{brand}</Badge>)}
          </div>
        )}
        {sub.phoneNumber && <p><strong>Tél:</strong> {sub.phoneNumber}</p>}
        {sub.email && <p><strong>Email:</strong> {sub.email}</p>}
        {sub.website && <p><strong>Web:</strong> <a href={sub.website} target="_blank" rel="noreferrer" className="text-accent underline">{sub.website}</a></p>}
        {sub.placeUrl && <p><strong>Google:</strong> <a href={sub.placeUrl} target="_blank" rel="noreferrer" className="text-accent underline">{sub.placeUrl}</a></p>}
        {sub.description && (
            <div className="mt-2 p-2 bg-muted/50 rounded-md italic text-muted-foreground border-l-2 border-brand">
                "{sub.description}"
            </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleReject(sub.id, collectionName)}
          disabled={processingId === sub.id}
        >
          {processingId === sub.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          Refuser
        </Button>
        <Button 
          size="sm" 
          onClick={() => handleApprove(sub, collectionName)}
          disabled={processingId === sub.id}
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
          <div className="w-60">
            <Link href="/">
              <LabelMotoLogo />
            </Link>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Validation des Fiches
          </h1>
          <div className="w-40 flex justify-end">
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
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
            <TabsTrigger value="pending" className="flex gap-2">
                Nouvelles
                {submissions.length > 0 && <Badge variant="secondary" className="px-1.5 h-5">{submissions.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="quarantine" className="flex gap-2">
                À vérifier
                {quarantineSubmissions.length > 0 && <Badge variant="destructive" className="px-1.5 h-5">{quarantineSubmissions.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-xl font-semibold">Tout est à jour !</h2>
                <p className="mt-2 text-muted-foreground">Il n'y a aucune nouvelle fiche standard à valider.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {submissions.map((sub) => renderSubmissionCard(sub, 'pending_concessions'))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quarantine">
            {quarantineSubmissions.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-xl font-semibold">Quarantaine vide</h2>
                <p className="mt-2 text-muted-foreground">Aucune fiche suspecte n'a été détectée.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quarantineSubmissions.map((sub) => renderSubmissionCard(sub, 'a_verifier'))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import LabelMotoLogo from '@/components/app/logo';
import { Dealership } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// This should match the form schema in register page
interface Submission {
  id: string;
  title: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  placeUrl?: string;
  category: 'concession' | 'atelier' | 'accessoiriste' | 'autre';
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
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { firestore } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;
    const submissionsRef = collection(firestore, 'pending_concessions');
    const unsubscribe = onSnapshot(submissionsRef, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
      setSubmissions(subs);
      setIsLoading(false);
    }, (error) => {
      console.error("Erreur de lecture des soumissions en attente : ", error);
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement',
        description: "Impossible de récupérer les fiches à valider. Vérifiez les règles de sécurité.",
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, toast]);

  const getAppSection = (category: Submission['category']): Dealership['appSection'] => {
    switch (category) {
      case 'concession':
      case 'accessoiriste':
        return 'shopping';
      case 'atelier':
        return 'service';
      default:
        return 'both';
    }
  };

  const handleApprove = async (submission: Submission) => {
    setProcessingId(submission.id);
    try {
      // NOTE: For now, we add it without coordinates. It won't appear on the map, only on the list.
      // A geocoding step would be needed here to get latitude/longitude from the address.
      const newConcession: Omit<Dealership, 'id' | 'latitude' | 'longitude' | 'position' | 'rating' | 'imgUrl' > = {
        title: submission.title,
        address: submission.address,
        website: submission.website || '',
        phoneNumber: submission.phoneNumber || '',
        email: submission.email || '',
        lundi: submission.lundi || 'Non renseigné',
        mardi: submission.mardi || 'Non renseigné',
        mercredi: submission.mercredi || 'Non renseigné',
        jeudi: submission.jeudi || 'Non renseigné',
        vendredi: submission.vendredi || 'Non renseigné',
        samedi: submission.samedi || 'Non renseigné',
        dimanche: submission.dimanche || 'Non renseigné',
        category: submission.category,
        appSection: getAppSection(submission.category),
        // Default empty values for fields not in the form
        imgUrl: '',
        placeUrl: submission.placeUrl || '',
        rating: '',
      };

      await setDoc(doc(firestore, 'concessions', submission.id), newConcession);
      await deleteDoc(doc(firestore, 'pending_concessions', submission.id));

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

  const handleReject = async (submissionId: string) => {
    setProcessingId(submissionId);
    try {
      await deleteDoc(doc(firestore, 'pending_concessions', submissionId));
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

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="w-40">
            <Link href="/">
              <LabelMotoLogo />
            </Link>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Validation des Fiches
          </h1>
          <div className="w-40" />
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-xl font-semibold">Tout est à jour !</h2>
            <p className="mt-2 text-muted-foreground">Il n'y a aucune nouvelle fiche à valider pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((sub) => (
              <Card key={sub.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{sub.title}</CardTitle>
                  <CardDescription>
                    Soumis {formatDate(sub.submittedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  <p><strong>Adresse:</strong> {sub.address}</p>
                  <p><strong>Catégorie:</strong> {sub.category}</p>
                  {sub.phoneNumber && <p><strong>Tél:</strong> {sub.phoneNumber}</p>}
                  {sub.email && <p><strong>Email:</strong> {sub.email}</p>}
                  {sub.website && <p><strong>Web:</strong> <a href={sub.website} target="_blank" rel="noreferrer" className="text-accent underline">{sub.website}</a></p>}
                  {sub.placeUrl && <p><strong>Google:</strong> <a href={sub.placeUrl} target="_blank" rel="noreferrer" className="text-accent underline">{sub.placeUrl}</a></p>}
                  {sub.description && <p className="text-muted-foreground pt-2">"{sub.description}"</p>}
                </CardContent>
                <CardFooter className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleReject(sub.id)}
                    disabled={processingId === sub.id}
                  >
                    {processingId === sub.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                    Refuser
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleApprove(sub)}
                    disabled={processingId === sub.id}
                  >
                     {processingId === sub.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Approuver
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

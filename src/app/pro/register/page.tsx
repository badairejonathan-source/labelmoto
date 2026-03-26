'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { collection, serverTimestamp, doc, query, limit, getDocs } from "firebase/firestore";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, CheckCircle, Store, AlertCircle, Search, Send, MapPin } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import brandLogos from '@/data/brand-logos';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { levenshteinDistance } from '@/lib/utils';

const brands = Object.keys(brandLogos);

const detailedDayHoursSchema = z.object({
  morningOpen: z.string(),
  morningClose: z.string(),
  afternoonOpen: z.string(),
  afternoonClose: z.string(),
});

const submissionSchema = z.object({
  name: z.string().min(3, { message: "Le nom de l'établissement est requis." }),
  category: z.enum(['concession', 'atelier', 'accessoiriste', 'concession-atelier', 'autre'], { required_error: 'La catégorie est requise.' }),
  address: z.string().min(10, { message: "Une adresse complète est requise (numéro, rue, code postal, ville)." }),
  phone: z.string().min(10, { message: "Un numéro de téléphone valide est requis." }),
  email: z.string().min(1, { message: "L'adresse e-mail est obligatoire." }).email({ message: "Veuillez entrer une adresse e-mail valide." }),
  website: z.string().url({ message: "Veuillez entrer une URL valide (ex: https://...)" }).optional().or(z.literal('')),
  placeUrl: z.string().url({ message: "Veuillez entrer une URL Google Maps valide." }).optional().or(z.literal('')),
  imgUrl: z.any().optional(),
  primaryBrand: z.string().optional(),
  secondaryBrands: z.array(z.string()).optional(),
  description: z.string().max(500, "La description ne doit pas dépasser 500 caractères.").optional(),
  horaires: z.object({
    lundi: detailedDayHoursSchema,
    mardi: detailedDayHoursSchema,
    mercredi: detailedDayHoursSchema,
    jeudi: detailedDayHoursSchema,
    vendredi: detailedDayHoursSchema,
    samedi: detailedDayHoursSchema,
    dimanche: detailedDayHoursSchema,
  }),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

function RegisterProContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealershipId = searchParams.get('dealershipId');
  const initialMode = searchParams.get('mode') === 'edit' || !!dealershipId ? 'edit' : 'create';
  
  const [activeTab, setActiveTab] = useState(initialMode);
  const [proSearchTerm, setProSearchTerm] = useState('');
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [modMessage, setModMessage] = useState('');
  const [isSubmittingMod, setIsSubmittingMod] = useState(false);

  const { toast } = useToast();
  const { firestore } = useFirebase();

  const dealersRef = useMemoFirebase(() => collection(firestore, 'concessions'), [firestore]);
  const { data: allDealers } = useCollection(dealersRef);

  const dealershipRef = useMemoFirebase(() => dealershipId ? doc(firestore, 'concessions', dealershipId) : null, [firestore, dealershipId]);
  const { data: dealershipFromUrl } = useDoc(dealershipRef);

  useEffect(() => {
    if (dealershipFromUrl) {
        setSelectedDealer(dealershipFromUrl);
        setActiveTab('edit');
    }
  }, [dealershipFromUrl]);

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      name: '', address: '', phone: '', email: '', website: '', placeUrl: '', imgUrl: null, primaryBrand: '', secondaryBrands: [], description: '',
      horaires: {
        lundi: { morningOpen: 'Fermé', morningClose: 'Fermé', afternoonOpen: 'Fermé', afternoonClose: 'Fermé' },
        mardi: { morningOpen: '09:00', morningClose: '12:00', afternoonOpen: '14:00', afternoonClose: '19:00' },
        mercredi: { morningOpen: '09:00', morningClose: '12:00', afternoonOpen: '14:00', afternoonClose: '19:00' },
        jeudi: { morningOpen: '09:00', morningClose: '12:00', afternoonOpen: '14:00', afternoonClose: '19:00' },
        vendredi: { morningOpen: '09:00', morningClose: '12:00', afternoonOpen: '14:00', afternoonClose: '19:00' },
        samedi: { morningOpen: '09:00', morningClose: '17:00', afternoonOpen: 'Fermé', afternoonClose: 'Fermé' },
        dimanche: { morningOpen: 'Fermé', morningClose: 'Fermé', afternoonOpen: 'Fermé', afternoonClose: 'Fermé' },
      },
    },
    mode: 'onChange',
  });

  const suggestions = useMemo(() => {
    if (!proSearchTerm.trim() || !allDealers) return [];
    
    const lower = proSearchTerm.toLowerCase().trim();
    const normalizedTerm = lower.replace(/[\s-]/g, '');
    const termWords = lower.split(/\s+/).filter(w => w.length > 1);

    return allDealers
        .map(d => {
            const label = (d.title || '').toLowerCase();
            const address = (d.address || '').toLowerCase();
            const normalizedLabel = label.replace(/[\s-]/g, '');
            const normalizedAddress = address.replace(/[\s-]/g, '');
            let score = 0;

            // 1. Match Code Postal (Priorité Absolue)
            const isNumeric = /^\d+$/.test(lower);
            if (isNumeric && lower.length >= 2) {
                const zipMatch = address.match(/\b\d{5}\b/);
                if (zipMatch && zipMatch[0].startsWith(lower)) {
                    score = 1300;
                }
            }

            // 2. Match Exact Nom
            if (normalizedLabel === normalizedTerm) score = Math.max(score, 1200);
            
            // 3. Match Adresse / Ville Direct (ESSENTIEL)
            if (address.includes(lower) || normalizedAddress.includes(normalizedTerm)) {
                score = Math.max(score, 1100);
            }

            // 4. Typo Tolerance (Distance de Levenshtein)
            if (normalizedTerm.length > 3) {
                const dist = levenshteinDistance(normalizedTerm, normalizedLabel);
                if (dist === 1) score = Math.max(score, 1050);
                else if (dist === 2 && normalizedTerm.length > 6) score = Math.max(score, 950);
            }

            // 5. Prefix Match
            if (normalizedLabel.startsWith(normalizedTerm)) score = Math.max(score, 1000);
            
            // 6. Keyword Overlap
            const titleWords = label.split(/\s+/).filter(w => w.length > 1);
            const matches = termWords.filter(tw => titleWords.some(twTitle => twTitle.includes(tw) || levenshteinDistance(tw, twTitle) <= 1));
            if (matches.length > 0) {
                score = Math.max(score, 500 + (matches.length * 100));
            }

            return { ...d, score };
        })
        .filter(d => d.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 15);
  }, [proSearchTerm, allDealers]);

  const handleModSubmit = async () => {
    if (!selectedDealer || !modMessage.trim() || !firestore) return;
    setIsSubmittingMod(true);
    
    addDocumentNonBlocking(collection(firestore, 'pending_concessions'), {
        title: selectedDealer.title,
        originalDealershipId: selectedDealer.id,
        description: modMessage,
        requestType: 'MODIFICATION',
        submittedAt: serverTimestamp(),
        status: 'PENDING'
    });

    toast({ title: 'Demande envoyée !', description: 'Notre équipe va examiner vos modifications.' });
    setModMessage('');
    setSelectedDealer(null);
    setProSearchTerm('');
    setIsSubmittingMod(false);
    router.push('/');
  };

  const onSubmit = async (data: SubmissionFormValues) => {
    if (!firestore) return;
    
    addDocumentNonBlocking(collection(firestore, 'pending_concessions'), {
      title: data.name,
      category: data.category,
      address: data.address,
      phoneNumber: data.phone,
      email: data.email,
      website: data.website || '',
      placeUrl: data.placeUrl || '',
      description: data.description || '',
      submittedAt: serverTimestamp(),
      requestType: 'CREATION'
    });

    toast({ title: 'Demande envoyée !', description: 'Votre fiche sera examinée sous 48h.' });
    form.reset();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-muted/20">
        <header className="bg-background border-b p-4 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                 <div className="w-60"><Link href="/"><LabelMotoLogo /></Link></div>
                 <Button asChild variant="outline"><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Link></Button>
            </div>
        </header>

      <main className="container mx-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="text-center bg-card p-8 rounded-xl shadow-lg border">
            <Image src="/images/Stamp-LM.png?v=3" alt="Label Moto" width={100} height={100} className="mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Espace Professionnel</h1>
            <p className="text-lg text-muted-foreground">Rejoignez le réseau des meilleurs ateliers et concessions de France.</p>
          </section>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted rounded-xl mb-8">
                <TabsTrigger value="create" className="rounded-lg font-black uppercase tracking-widest text-[10px]">
                    🔘 Créer une nouvelle fiche
                </TabsTrigger>
                <TabsTrigger value="edit" className="rounded-lg font-black uppercase tracking-widest text-[10px]">
                    🔘 Modifier ma fiche existante
                </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
                <Card className="border-2 border-brand shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">Modifier mon établissement</CardTitle>
                        <CardDescription>Recherchez votre établissement pour nous envoyer vos mises à jour.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!selectedDealer ? (
                            <div className="relative">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Trouver votre établissement</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        placeholder="Tapez le nom, la ville ou le code postal..." 
                                        className="pl-10 h-12 text-lg font-bold"
                                        value={proSearchTerm}
                                        onChange={(e) => setProSearchTerm(e.target.value)}
                                    />
                                </div>
                                {suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 rounded-xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {suggestions.map(s => (
                                            <button 
                                                key={s.id} 
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors group"
                                                onClick={() => { setSelectedDealer(s); setProSearchTerm(''); }}
                                            >
                                                <div className="shrink-0 w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                                    <Store className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-black uppercase truncate">{s.title}</span>
                                                    <span className="text-[9px] text-muted-foreground truncate uppercase font-bold">{s.address}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <Alert className="bg-brand/5 border-brand">
                                    <Store className="h-5 w-5 text-brand" />
                                    <AlertTitle className="font-black uppercase tracking-tighter">Établissement sélectionné</AlertTitle>
                                    <AlertDescription className="font-bold">
                                        {selectedDealer.title} <br/>
                                        <span className="text-xs opacity-70 font-medium">{selectedDealer.address}</span>
                                    </AlertDescription>
                                    <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-[10px] font-black" onClick={() => setSelectedDealer(null)}>Changer</Button>
                                </Alert>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Décrivez vos changements</Label>
                                    <Textarea 
                                        rows={6} 
                                        placeholder="Indiquez ici les nouvelles informations (horaires, marques, téléphone...) ou tout changement à apporter sur votre fiche."
                                        className="font-bold bg-muted/20"
                                        value={modMessage}
                                        onChange={(e) => setModMessage(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full bg-brand h-12 font-black uppercase tracking-widest text-xs" onClick={handleModSubmit} disabled={isSubmittingMod || !modMessage.trim()}>
                                    {isSubmittingMod ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Envoyer ma demande de modification
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="create">
                <Card className="border-2 border-brand shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">Demande de création de fiche</CardTitle>
                        <CardDescription>Remplissez le formulaire ci-dessous pour soumettre votre établissement.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                                    <h4 className="font-black uppercase tracking-tight text-sm flex items-center gap-2"><Store className="h-4 w-4 text-brand"/> Informations principales</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem><FormLabel>Nom de l'établissement</FormLabel><FormControl><Input placeholder="Moto Passion 75" className="font-bold" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="category" render={({ field }) => (
                                            <FormItem><FormLabel>Catégorie principale</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="font-bold"><SelectValue placeholder="Catégorie" /></SelectTrigger></FormControl><SelectContent><SelectItem value="concession">Concession</SelectItem><SelectItem value="atelier">Atelier</SelectItem><SelectItem value="concession-atelier">Concession + Atelier</SelectItem><SelectItem value="accessoiriste">Accessoiriste</SelectItem><SelectItem value="autre">Autre</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="address" render={({ field }) => (
                                        <FormItem><FormLabel>Adresse complète</FormLabel><FormControl><Textarea placeholder="123 Rue de la Moto, 75001 Paris" className="font-bold" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>

                                <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                                    <h4 className="font-black uppercase tracking-tight text-sm flex items-center gap-2">📱 Coordonnées</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input placeholder="01 23 45 67 89" className="font-bold" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Email (obligatoire)</FormLabel><FormControl><Input placeholder="contact@etablissement.com" className="font-bold" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" size="lg" className="bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs px-10 h-12" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...</> : 'Soumettre ma fiche'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default function RegisterProPage() {
  return <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}><RegisterProContent /></Suspense>;
}
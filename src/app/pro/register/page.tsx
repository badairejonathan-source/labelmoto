
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, CheckCircle, Rocket } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';

const submissionSchema = z.object({
  name: z.string().min(3, { message: "Le nom de l'établissement est requis." }),
  category: z.enum(['concession', 'atelier', 'accessoiriste', 'autre'], { required_error: 'La catégorie est requise.' }),
  address: z.string().min(10, { message: "Une adresse complète est requise (numéro, rue, code postal, ville)." }),
  phone: z.string().min(10, { message: "Un numéro de téléphone valide est requis." }),
  email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }).optional().or(z.literal('')),
  website: z.string().url({ message: "Veuillez entrer une URL valide (ex: https://...)" }).optional().or(z.literal('')),
  placeUrl: z.string().url({ message: "Veuillez entrer une URL Google Maps valide." }).optional().or(z.literal('')),
  description: z.string().max(500, "La description ne doit pas dépasser 500 caractères.").optional(),
  lundi: z.string().optional(),
  mardi: z.string().optional(),
  mercredi: z.string().optional(),
  jeudi: z.string().optional(),
  vendredi: z.string().optional(),
  samedi: z.string().optional(),
  dimanche: z.string().optional(),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

export default function RegisterProPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      placeUrl: '',
      description: '',
      lundi: '',
      mardi: '',
      mercredi: '',
      jeudi: '',
      vendredi: '',
      samedi: '',
      dimanche: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: SubmissionFormValues) => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: 'Erreur de connexion',
            description: "Impossible de se connecter à la base de données.",
        });
        return;
    }
    try {
      await addDoc(collection(firestore, "pending_concessions"), {
        title: data.name,
        category: data.category,
        address: data.address,
        phoneNumber: data.phone,
        email: data.email || '',
        website: data.website || '',
        placeUrl: data.placeUrl || '',
        description: data.description || '',
        lundi: data.lundi || 'Fermé',
        mardi: data.mardi || 'Fermé',
        mercredi: data.mercredi || 'Fermé',
        jeudi: data.jeudi || 'Fermé',
        vendredi: data.vendredi || 'Fermé',
        samedi: data.samedi || 'Fermé',
        dimanche: data.dimanche || 'Fermé',
        submittedAt: serverTimestamp(),
      });
      toast({
        title: 'Demande envoyée !',
        description: 'Votre fiche sera examinée par notre équipe. Vous serez contacté par e-mail.',
      });
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout du document: ", error);
      toast({
        variant: "destructive",
        title: 'Une erreur est survenue',
        description: "Votre demande n'a pas pu être envoyée. Veuillez réessayer.",
      });
    }
  };

  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;

  return (
    <div className="min-h-screen bg-muted/20">
        <header className="bg-background border-b p-4 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                 <div className="w-48">
                    <Link href="/">
                        <LabelMotoLogo />
                    </Link>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à l'accueil
                    </Link>
                </Button>
            </div>
        </header>

      <main className="container mx-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-12">
        
          <section className="text-center bg-card p-8 rounded-xl shadow-lg border">
            <Rocket className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Développez votre visibilité auprès des motards</h1>
            <p className="text-xl text-muted-foreground mb-2">Vous êtes concessionnaire ou atelier moto ? Apparaissez sur Label Moto.</p>
            <Button asChild size="lg" className="mt-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg">
              <Link href="#formulaire">Créer ma fiche gratuitement</Link>
            </Button>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">🟢 POURQUOI REJOINDRE LABEL MOTO ?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Visibilité locale ciblée :</span> Atteignez les motards passionnés de votre région.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Clients déjà intéressés :</span> Attirez des clients qui recherchent activement vos services ou produits.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Plateforme spécialisée moto :</span> Profitez d'un environnement 100% dédié à l'univers de la moto.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Valorisez votre expertise :</span> Mettez en avant vos savoir-faire et vos marques partenaires.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">🟡 COMMENT ÇA FONCTIONNE ?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-center gap-3"><span className="text-2xl">1️⃣</span> Vous remplissez le formulaire de demande ci-dessous.</li>
                  <li className="flex items-center gap-3"><span className="text-2xl">2️⃣</span> Notre équipe valide les informations pour garantir la qualité.</li>
                  <li className="flex items-center gap-3"><span className="text-2xl">3️⃣</span> Votre fiche est créée et publiée sur notre plateforme.</li>
                  <li className="flex items-center gap-3"><span className="text-2xl">4️⃣</span> Les motards peuvent vous trouver et vous contacter !</li>
                </ul>
              </CardContent>
            </Card>
          </section>
          
          <section>
             <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">🟣 VOTRE FICHE COMPREND</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-lg">
                 <li className="flex items-start gap-3 list-none">- Coordonnées</li>
                 <li className="flex items-start gap-3 list-none">- Horaires</li>
                 <li className="flex items-start gap-3 list-none">- Marques</li>
                 <li className="flex items-start gap-3 list-none">- Services</li>
                 <li className="flex items-start gap-3 list-none">- Photos</li>
                 <li className="flex items-start gap-3 list-none">- Lien site</li>
              </CardContent>
            </Card>
          </section>

          <section id="formulaire">
            <Card className="border-red-500 border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="text-red-600 text-3xl">🔴 DEMANDEZ LA CRÉATION DE VOTRE FICHE</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour soumettre votre établissement. Nous l'examinerons avant de le publier.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-semibold text-lg">Informations principales</h4>
                       <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom de l'établissement</FormLabel>
                                <FormControl><Input placeholder="Ex: Moto Passion 75" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Catégorie principale</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionnez une catégorie" /></SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="concession">Concession (Vente)</SelectItem>
                                    <SelectItem value="atelier">Atelier (Réparation)</SelectItem>
                                    <SelectItem value="accessoiriste">Accessoiriste</SelectItem>
                                    <SelectItem value="autre">Autre</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       </div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adresse complète</FormLabel>
                                <FormControl><Textarea placeholder="123 Rue de la Moto, 75001 Paris" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-semibold text-lg">Coordonnées & Liens</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                           <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl><Input placeholder="01 23 45 67 89" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (optionnel)</FormLabel>
                                    <FormControl><Input placeholder="contact@etablissement.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Site web (optionnel)</FormLabel>
                                    <FormControl><Input placeholder="https://www.votresite.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="placeUrl"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lien fiche Google (optionnel)</FormLabel>
                                    <FormControl><Input placeholder="https://maps.app.goo.gl/..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </div>

                     <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-semibold text-lg">Description</h4>
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Présentez votre établissement en quelques mots.</FormLabel>
                                <FormControl><Textarea rows={4} placeholder="Spécialiste de la marque X, nous proposons des services d'entretien et de réparation..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-semibold text-lg">Horaires d'ouverture</h4>
                       <p className="text-sm text-muted-foreground">Indiquez les horaires pour chaque jour. Ex: 09:00-12:00, 14:00-19:00. Laissez vide si fermé.</p>
                       <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {weekDays.map((day) => (
                           <FormField
                            key={day}
                            control={form.control}
                            name={day}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="capitalize">{day}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        ))}
                       </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : 'Soumettre ma fiche'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

    
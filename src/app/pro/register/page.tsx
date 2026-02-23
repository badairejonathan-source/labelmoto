
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import brandLogos from '@/data/brand-logos';

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
  email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }).optional().or(z.literal('')),
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

const timeOptions: string[] = ['Fermé'];
for (let h = 7; h <= 20; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour = String(h).padStart(2, '0');
    const minute = String(m).padStart(2, '0');
    timeOptions.push(`${hour}:${minute}`);
  }
}
timeOptions.push('21:00');


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
      imgUrl: null,
      primaryBrand: '',
      secondaryBrands: [],
      description: '',
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

  const { watch, setValue } = form;
  const watchedHoraires = watch('horaires');
  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;

  useEffect(() => {
    weekDays.forEach(day => {
      const schedule = watchedHoraires[day];
      if (schedule?.morningOpen === 'Fermé' && schedule?.morningClose !== 'Fermé') {
        setValue(`horaires.${day}.morningClose`, 'Fermé');
      }
      if (schedule?.afternoonOpen === 'Fermé' && schedule?.afternoonClose !== 'Fermé') {
        setValue(`horaires.${day}.afternoonClose`, 'Fermé');
      }
    });
  }, [watchedHoraires, setValue, weekDays]);

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
      const formattedHoraires: { [key: string]: string } = {};
      weekDays.forEach(day => {
        const schedule = data.horaires[day];
        const morningOpen = schedule.morningOpen !== 'Fermé';
        const afternoonOpen = schedule.afternoonOpen !== 'Fermé';

        let dayString = '';
        if (morningOpen) {
          dayString += `${schedule.morningOpen} - ${schedule.morningClose}`;
        }

        if (afternoonOpen) {
          if (morningOpen) {
            dayString += `, ${schedule.afternoonOpen} - ${schedule.afternoonClose}`;
          } else {
            dayString += `${schedule.afternoonOpen} - ${schedule.afternoonClose}`;
          }
        }
        
        if (!morningOpen && !afternoonOpen) {
            dayString = 'Fermé';
        }
        
        formattedHoraires[day] = dayString;
      });

      const { imgUrl, primaryBrand, secondaryBrands, ...submissionData } = data;

      const combinedBrands = [];
      if (primaryBrand) {
          combinedBrands.push(primaryBrand);
      }
      if (secondaryBrands && secondaryBrands.length > 0) {
          secondaryBrands.forEach(brand => {
              if (!combinedBrands.includes(brand)) {
                  combinedBrands.push(brand);
              }
          });
      }


      await addDoc(collection(firestore, "pending_concessions"), {
        title: submissionData.name,
        category: submissionData.category,
        address: submissionData.address,
        phoneNumber: submissionData.phone,
        email: submissionData.email || '',
        website: submissionData.website || '',
        placeUrl: submissionData.placeUrl || '',
        brands: combinedBrands,
        description: submissionData.description || '',
        ...formattedHoraires,
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Attirez plus de motards dans votre région</h1>
            <p className="text-xl text-muted-foreground mb-2">Soyez visible au moment où ils cherchent à acheter, entretenir ou réparer leur moto.</p>
            <div className="mt-6">
              <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg">
                <Link href="#formulaire">Créer ma fiche gratuitement</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">✔ Gratuit • ✔ Sans engagement • ✔ Validation sous 48h</p>
            </div>
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
                                    <SelectItem value="concession-atelier">Concession + Atelier</SelectItem>
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
                             <FormField
                                control={form.control}
                                name="imgUrl"
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                  <FormItem>
                                    <FormLabel>Télécharger votre photo de présentation</FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...fieldProps}
                                        type="file" 
                                        accept="image/*"
                                        onChange={(event) => {
                                          onChange(event.target.files && event.target.files[0]);
                                        }}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Le texte du bouton (ex: "Choisir un fichier") dépend de votre navigateur et de sa langue.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-semibold text-lg">Marques distribuées</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="primaryBrand"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marque principale (optionnel)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez une marque" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={`primary-${brand}`} value={brand}>{brand}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                          control={form.control}
                          name="secondaryBrands"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Marques secondaires (optionnel)</FormLabel>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <FormControl>
                                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        {field.value && field.value.length > 0
                                          ? field.value.join(', ')
                                          : "Sélectionnez les autres marques"}
                                      </Button>
                                    </FormControl>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                                    {brands
                                      .filter(brand => brand !== form.watch('primaryBrand'))
                                      .map((brand) => (
                                      <DropdownMenuCheckboxItem
                                        key={brand}
                                        checked={field.value?.includes(brand)}
                                        onCheckedChange={(checked) => {
                                          const currentBrands = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentBrands, brand]);
                                          } else {
                                            field.onChange(currentBrands.filter((value) => value !== brand));
                                          }
                                        }}
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        {brand}
                                      </DropdownMenuCheckboxItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
                        <p className="text-sm text-muted-foreground">Sélectionnez les horaires pour chaque jour, avec une coupure pour le midi si nécessaire.</p>
                        <div className="space-y-4">
                            {weekDays.map((day) => (
                            <div key={day} className="grid grid-cols-[1fr] sm:grid-cols-[90px_1fr] items-center gap-x-4 gap-y-2">
                                <FormLabel className="capitalize font-semibold">{day}</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2">
                                        <FormField
                                        control={form.control}
                                        name={`horaires.${day}.morningOpen`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>{timeOptions.map(option => <SelectItem key={`m-open-${day}-${option}`} value={option}>{option}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <FormField
                                        control={form.control}
                                        name={`horaires.${day}.morningClose`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                            <Select onValueChange={field.onChange} value={field.value} disabled={form.watch(`horaires.${day}.morningOpen`) === 'Fermé'}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>{timeOptions.map(option => <SelectItem key={`m-close-${day}-${option}`} value={option}>{option}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FormField
                                        control={form.control}
                                        name={`horaires.${day}.afternoonOpen`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>{timeOptions.map(option => <SelectItem key={`a-open-${day}-${option}`} value={option}>{option}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <FormField
                                        control={form.control}
                                        name={`horaires.${day}.afternoonClose`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                            <Select onValueChange={field.onChange} value={field.value} disabled={form.watch(`horaires.${day}.afternoonOpen`) === 'Fermé'}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>{timeOptions.map(option => <SelectItem key={`a-close-${day}-${option}`} value={option}>{option}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                </div>
                            </div>
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

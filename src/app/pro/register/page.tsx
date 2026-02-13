
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import LabelMotoLogo from '@/components/app/logo';

const establishmentSchema = z.object({
  title: z.string().min(3, "Le nom de l'établissement est requis."),
  address: z.string().min(10, "L'adresse est requise."),
  phoneNumber: z.string().optional(),
  website: z.string().url("Veuillez entrer une URL valide.").optional().or(z.literal('')),
  category: z.enum(['concession', 'atelier', 'accessoiriste', 'autre'], {
    required_error: "Veuillez sélectionner une catégorie."
  }),
  description: z.string().max(300, "La description ne peut pas dépasser 300 caractères.").optional(),
  lundi: z.string().optional(),
  mardi: z.string().optional(),
  mercredi: z.string().optional(),
  jeudi: z.string().optional(),
  vendredi: z.string().optional(),
  samedi: z.string().optional(),
  dimanche: z.string().optional(),
});

type EstablishmentFormValues = z.infer<typeof establishmentSchema>;

const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function RegisterProPage() {
  const router = useRouter();
  const form = useForm<EstablishmentFormValues>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: {
      title: '',
      address: '',
      phoneNumber: '',
      website: '',
      description: '',
      lundi: 'Fermé',
      mardi: '09:00-12:00, 14:00-19:00',
      mercredi: '09:00-12:00, 14:00-19:00',
      jeudi: '09:00-12:00, 14:00-19:00',
      vendredi: '09:00-12:00, 14:00-19:00',
      samedi: '09:00-17:00',
      dimanche: 'Fermé',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: EstablishmentFormValues) => {
    // In a real application, you would send this data to your backend API
    // to save it in Firebase Firestore.
    console.log('Données de l\'établissement:', JSON.stringify(data, null, 2));
    toast({
      title: 'Fiche envoyée pour validation !',
      description: 'Votre établissement sera visible après examen par notre équipe.',
    });
    // Optionally, redirect the user after successful submission
    setTimeout(() => router.push('/'), 3000);
  };

  return (
    <div className="min-h-screen bg-muted/20">
        <header className="bg-background border-b p-4">
            <div className="container mx-auto flex items-center justify-between">
                 <div className="w-40">
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
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Inscrivez votre établissement</CardTitle>
            <CardDescription>
              Rejoignez la communauté Label Moto et gagnez en visibilité. Remplissez le formulaire ci-dessous pour créer votre fiche.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Informations principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nom de l'établissement</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Moto Passion 75" {...field} />
                                </FormControl>
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
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez une catégorie" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="concession">Concession (Vente neuf/occasion)</SelectItem>
                                        <SelectItem value="atelier">Atelier (Réparation / Entretien)</SelectItem>
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
                            <FormControl>
                                <Input placeholder="123 Rue de la Moto, 75001 Paris" {...field} />
                            </FormControl>
                            <FormDescription>
                                Assurez-vous d'inclure le numéro, la rue, le code postal et la ville.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Numéro de téléphone</FormLabel>
                                <FormControl>
                                    <Input placeholder="01 23 45 67 89" {...field} />
                                </FormControl>
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
                                <FormControl>
                                    <Input placeholder="https://www.votresite.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description courte</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Décrivez votre activité en quelques mots..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Horaires d'ouverture</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {weekDays.map(day => (
                            <FormField
                                key={day}
                                control={form.control}
                                name={day as keyof EstablishmentFormValues}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="capitalize">{day}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: 09:00-18:00 ou Fermé" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg">
                    Soumettre ma fiche
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

'use client';

import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Trash2, PlusCircle } from 'lucide-react';

import initialData from '@/app/data/my-data.json';

// Define the schema for a single item
const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom est requis.'),
  category: z.string(),
  shortDescription: z.string().min(1, 'La description courte est requise.'),
  longDescription: z.string(),
});

// Define the schema for the whole form data
const formSchema = z.object({
  items: z.array(itemSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function DataPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: initialData,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // In a real application, you would send this data to your backend API to save it.
    // For this prototype, we'll just log it to the console and show a toast.
    console.log('Données sauvegardées:', JSON.stringify(data, null, 2));
    toast({
      title: 'Données sauvegardées !',
      description: 'Les modifications ont été enregistrées dans la console.',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Éditer les Données</h1>
            <Button type="submit">Sauvegarder les changements</Button>
          </div>
          
          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative">
                <CardHeader>
                  <CardTitle>Item #{index + 1}</CardTitle>
                   <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'item" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.shortDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description Courte</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description courte..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ 
                  id: `${Date.now()}`, 
                  name: '', 
                  category: '', 
                  shortDescription: '', 
                  longDescription: '' 
              })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un nouvel item
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

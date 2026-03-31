'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Mail, MessageSquare, Send, ArrowLeft, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères."),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitted, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (!firestore) return;
    setIsSubmitting(true);
    
    try {
      addDocumentNonBlocking(collection(firestore, 'contact_messages'), {
        ...data,
        submittedAt: serverTimestamp(),
      });
      toast({ title: "Message envoyé !", description: "Merci pour votre message, nous reviendrons vers vous rapidement." });
      form.reset();
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de l'envoi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        placeholderText="Recherche par departement , ville , marque, nom ... "
      />
      <main className="container mx-auto px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-[0.03]">
          <Image src="/images/logo-moto.png?v=6" alt="" width={800} height={256} className="rotate-[-15deg] scale-150" />
        </div>

        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand mb-8 text-xs font-black uppercase tracking-widest transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          <Card className="border-2 shadow-2xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-brand text-white p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                <MessageSquare className="w-48 h-48" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black uppercase tracking-tighter relative z-10">Contactez-nous</CardTitle>
              <CardDescription className="text-white/80 font-bold text-lg max-w-md relative z-10 leading-snug">
                Une question sur un pro ? Une suggestion ? L'équipe Label Moto est à votre écoute.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Votre Nom</FormLabel>
                        <FormControl><Input placeholder="Jean Moto" className="font-bold h-12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Votre Email</FormLabel>
                        <FormControl><Input placeholder="jean@email.com" className="font-bold h-12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sujet</FormLabel>
                      <FormControl><Input placeholder="Demande d'information / Suggestion" className="font-bold h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Message</FormLabel>
                      <FormControl><Textarea rows={6} placeholder="Comment pouvons-nous vous aider ?" className="font-bold resize-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isSubmitted}>
                    {isSubmitted ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    Envoyer le message
                  </Button>
                </form>
              </Form>

              <div className="mt-12 pt-8 border-t border-dashed flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-brand/10 p-3 rounded-full text-brand">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email direct</p>
                    <p className="font-black text-foreground">contact@labelmoto.fr</p>
                  </div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl flex items-start gap-3 max-w-xs">
                  <Info className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-muted-foreground leading-tight italic">
                    Nous sommes une plateforme à but non lucratif gérée par des passionnés. Nous vous répondrons dès que possible !
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

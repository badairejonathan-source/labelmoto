'use server';

import { z } from 'zod';
import { getFirestoreInstance } from '@/firebase/index';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const submissionSchema = z.object({
  name: z.string().min(3, "Nom trop court"),
  category: z.enum(['concession', 'atelier', 'accessoiriste', 'concession-atelier', 'association', 'autre']),
  address: z.string().min(10, "Adresse incomplète"),
  phone: z.string().min(10, "Téléphone invalide"),
  email: z.string().email("Email invalide"),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  // Honeypot pour le spam
  hp_field: z.string().max(0, "Spam detected").optional(),
});

export async function submitProAction(formData: FormData) {
  const firestore = getFirestoreInstance();
  
  const rawData = {
    name: formData.get('name'),
    category: formData.get('category'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    website: formData.get('website'),
    description: formData.get('description'),
    hp_field: formData.get('hp_field'),
  };

  const validated = submissionSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    await addDoc(collection(firestore, 'pending_concessions'), {
      title: validated.data.name,
      category: validated.data.category,
      address: validated.data.address,
      phoneNumber: validated.data.phone,
      email: validated.data.email,
      website: validated.data.website || '',
      description: validated.data.description || '',
      status: 'pending',
      source: 'public_form',
      submittedAt: serverTimestamp(),
      requestType: 'CREATION',
      appSection: validated.data.category === 'association' ? 'association' : (validated.data.category.includes('concession') ? 'both' : 'service')
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Erreur lors de l'enregistrement" };
  }
}

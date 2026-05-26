
'use server';

import { z } from 'zod';
import { getFirestoreInstance } from '@/firebase/index';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { slugify } from '@/lib/utils';
import { extractValidCoordinates } from '@/lib/geohash';

const submissionSchema = z.object({
  businessName: z.string().min(3, "Le nom de l'établissement est trop court"),
  categoryRequested: z.string().min(2, "Catégorie requise"),
  appSectionRequested: z.enum(['shopping', 'service', 'both', 'association', 'relais']),
  addressRaw: z.string().min(10, "L'adresse semble incomplète"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse e-mail invalide"),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().max(3000).optional(),
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  hp_field: z.string().max(0, "Spam détecté").optional(),
});

export async function submitProAction(formData: FormData) {
  const firestore = getFirestoreInstance();
  
  const rawData = {
    businessName: formData.get('name'),
    categoryRequested: formData.get('category'),
    appSectionRequested: formData.get('appSection'),
    addressRaw: formData.get('address'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    website: formData.get('website'),
    description: formData.get('description'),
    facebook: formData.get('facebook'),
    instagram: formData.get('instagram'),
    hp_field: formData.get('hp_field'),
  };

  const validated = submissionSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  if (validated.data.hp_field && validated.data.hp_field.length > 0) {
    return { error: "Erreur de validation (bot protection)" };
  }

  try {
    const coords = extractValidCoordinates({ address: validated.data.addressRaw });

    const docRef = await addDoc(collection(firestore, 'listing_submissions'), {
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: 'public_form',
      businessName: validated.data.businessName,
      categoryRequested: validated.data.categoryRequested,
      appSectionRequested: validated.data.appSectionRequested,
      addressRaw: validated.data.addressRaw,
      phone: validated.data.phone,
      email: validated.data.email,
      website: validated.data.website || '',
      facebook: validated.data.facebook || '',
      instagram: validated.data.instagram || '',
      description: validated.data.description || '',
      slugCandidate: slugify(validated.data.businessName),
      needsGeocoding: !coords,
      latitude: coords?.lat || null,
      longitude: coords?.lng || null,
      notesAdmin: '',
      isClaimedRequested: true
    });

    return { success: true, submissionId: docRef.id };
  } catch (e) {
    console.error("Submission Error:", e);
    return { error: "Une erreur technique est survenue lors de l'envoi." };
  }
}

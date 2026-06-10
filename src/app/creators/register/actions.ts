'use server';

import { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { slugify } from '@/lib/utils';

const creatorSchema = z.object({
  displayName: z.string().min(2, "Le nom est trop court"),
  activite: z.string().min(2, "L'activité est requise"),
  specialite: z.string().min(2, "La spécialité est requise"),
  ville: z.string().min(2, "La ville / zone est requise"),
  departement: z.string().min(1, "Le département est requis"),
  instagram: z.string().optional().or(z.literal('')),
  email: z.string().email("Adresse e-mail invalide"),
  description: z.string().max(500).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  hp_field: z.string().max(0, "Spam détecté").optional(),
});

export async function submitCreatorAction(formData: FormData) {
  console.log("[SUBMIT-CREATOR] 🚀 Nouvelle demande créateur");

  const rawData = {
    displayName: formData.get('displayName'),
    activite: formData.get('activite'),
    specialite: formData.get('specialite'),
    ville: formData.get('ville'),
    departement: formData.get('departement'),
    instagram: formData.get('instagram'),
    email: formData.get('email'),
    description: formData.get('description'),
    photoUrl: formData.get('photoUrl'),
    hp_field: formData.get('hp_field'),
  };

  console.log('[SUBMIT-CREATOR] rawData:', JSON.stringify(rawData));

  const validated = creatorSchema.safeParse(rawData);
  if (!validated.success) {
    console.log('[SUBMIT-CREATOR] ❌ Zod errors:', JSON.stringify(validated.error.errors));
    return { error: validated.error.errors[0].message };
  }

  try {
    const db = getAdminFirestore();
    const slug = slugify(validated.data.displayName + '-' + validated.data.ville);

    await db.collection('listing_submissions').add({
      status: 'pending',
      type: 'creator',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'public_form',
      displayName: validated.data.displayName,
      activite: validated.data.activite,
      specialite: validated.data.specialite,
      ville: validated.data.ville,
      departement: validated.data.departement,
      instagram: validated.data.instagram || '',
      email: validated.data.email,
      description: validated.data.description || '',
      photoUrl: validated.data.photoUrl || '',
      slugCandidate: slug,
      notesAdmin: '',
      isClaimedRequested: true,
    });

    console.log('[SUBMIT-CREATOR] ✅ Soumission enregistrée');

    // Email de confirmation
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Label Moto <noreply@labelmoto.fr>',
          to: [validated.data.email],
          subject: 'Label Moto - Demande de profil créateur reçue',
          html: `<div style="font-family:sans-serif;max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:32px 40px;text-align:center;">
              <img src="https://labelmoto.fr/images/logo-moto.webp" alt="Label Moto" width="200" height="53" style="width:200px;"/>
            </div>
            <div style="padding:40px;">
              <h1 style="font-size:22px;font-weight:800;color:#18181b;text-transform:uppercase;">Demande reçue !</h1>
              <p style="color:#52525b;font-size:15px;line-height:1.7;">Bonjour <strong>${validated.data.displayName}</strong>,</p>
              <p style="color:#52525b;font-size:15px;line-height:1.7;">Nous avons bien reçu votre demande de profil créateur sur <strong>Label Moto</strong>. Notre équipe va examiner votre dossier sous <strong>48h</strong>.</p>
              <p style="color:#a1a1aa;font-size:13px;text-align:center;">Vous serez contacté à cette adresse une fois votre profil validé.</p>
            </div>
          </div>`
        }),
      });
    } catch (emailErr: any) {
      console.error('[SUBMIT-CREATOR] ⚠️ Email non envoyé:', emailErr.message);
    }

    return { success: true };
  } catch (e: any) {
    console.error("[SUBMIT-CREATOR] ❌ Erreur:", e.message);
    return { error: e.message || "Une erreur technique est survenue." };
  }
}

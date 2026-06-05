'use server';

import { z } from 'zod';
import { getAdminFirestore } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';
import { slugify } from '@/lib/utils';
import { extractValidCoordinates } from '@/lib/geohash';
// Email via fetch natif - pas de package resend

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
  console.log("[SUBMIT-PRO] 🚀 Réception d'une nouvelle demande de référencement.");
  
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

  console.log('[SUBMIT-PRO] rawData reçu:', JSON.stringify(rawData));
  console.log('[SUBMIT-PRO] rawData reçu:', JSON.stringify(rawData));
  const validated = submissionSchema.safeParse(rawData);

  if (!validated.success) {
    console.log('[SUBMIT-PRO] ❌ Zod errors:', JSON.stringify(validated.error.errors));
    return { error: validated.error.errors[0].message };
  }

  if (validated.data.hp_field && validated.data.hp_field.length > 0) {
    return { error: "Erreur de validation (bot protection)" };
  }

  try {
    // Utilisation stricte du SDK Admin pour la base de données côté serveur
    const db = getAdminFirestore();
    const coords = extractValidCoordinates({ address: validated.data.addressRaw });

    const docRef = await db.collection('listing_submissions').add({
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
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

    console.log(`[SUBMIT-PRO] ✅ Soumission enregistrée avec l'ID: ${docRef.id}`);

    // Envoi email de confirmation via Resend
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
          subject: 'Label Moto - Demande de referencement recue',
        html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;margin:0;padding:0;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:32px 40px;text-align:center;">
      <img src="https://labelmoto.fr/images/logo-moto.webp" alt="Label Moto" width="200" height="53" style="width:200px;height:53px;"/>
    </div>
    <div style="padding:40px;">
      <h1 style="font-size:22px;font-weight:800;color:#18181b;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.03em;">Demande reçue !</h1>
      <div style="width:40px;height:3px;background:#f97316;margin:0 0 20px;border-radius:2px;"></div>
      <p style="color:#52525b;font-size:15px;line-height:1.7;margin:0 0 16px;">Bonjour,</p>
      <p style="color:#52525b;font-size:15px;line-height:1.7;margin:0 0 24px;">Nous avons bien reçu votre demande de référencement pour <strong>${validated.data.businessName}</strong>. Notre équipe va examiner votre dossier sous <strong>48h</strong>.</p>
      <div style="background:#fff7ed;border-left:3px solid #f97316;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 28px;">
        <p style="color:#18181b;font-size:14px;font-weight:700;margin:0 0 4px;">Récapitulatif de votre demande</p>
        <p style="color:#71717a;font-size:13px;margin:0;">Établissement : ${validated.data.businessName}</p>
        <p style="color:#71717a;font-size:13px;margin:4px 0 0;">Adresse : ${validated.data.addressRaw}</p>
      </div>
      <p style="color:#a1a1aa;font-size:13px;margin:0;text-align:center;">Vous serez contacté à cette adresse email une fois votre fiche validée.</p>
    </div>
    <div style="padding:20px 40px;background:#f9f9fb;border-top:2px solid #f97316;">
      <p style="color:#71717a;font-size:12px;margin:0;">Label Moto - La référence pour la communauté moto</p>
    </div>
  </div>
</body></html>`
        }),
      });
      console.log('[SUBMIT-PRO] ✅ Email de confirmation envoyé');
    } catch (emailErr: any) {
      console.error('[SUBMIT-PRO] ⚠️ Email non envoyé:', emailErr.message);
    }

    return { success: true, submissionId: docRef.id };
  } catch (e: any) {
    console.error("[SUBMIT-PRO] ❌ ERREUR COMPLETE:", e.message, e.code, e.stack);
    return { error: e.message || "Une erreur technique est survenue lors de l'enregistrement." };
  }
}

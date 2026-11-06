'use server';

import { z } from 'zod';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';
import { slugify } from '@/lib/utils';
import { extractValidCoordinates } from '@/lib/geohash';
// Email via fetch natif - pas de package resend

const submissionSchema = z.object({
  businessName: z.string().min(3, "Le nom de l'établissement est trop court"),
  categoryRequested: z.string().min(2, "Catégorie requise"),
  appSectionRequested: z.enum(['shopping', 'service', 'both', 'association', 'relais']),
  addressRaw: z.string().trim().min(5, "L'adresse semble incomplète"),
  locationMode: z.enum(['physical', 'city']),
  streetNumber: z.string().trim().max(20),
  street: z.string().trim().max(180),
  postalCode: z.string().trim().regex(/^\d{5}$/, 'Code postal français à 5 chiffres requis'),
  city: z.string().trim().min(2, 'Ville requise').max(120),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse e-mail invalide"),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().max(3000).optional(),
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  hp_field: z.string().max(0, "Spam détecté").optional(),
  horaires: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export async function submitProAction(formData: FormData) {
  // FormData.get() retourne null lorsqu'un champ optionnel
  // n'existe pas dans le formulaire (ex. photo non ajoutée).
  // Zod attend ici des chaînes : on normalise donc systématiquement.
  const getFormString = (
    key: string
  ): string => {
    const value =
      formData.get(
        key
      );

    return typeof value === 'string'
      ? value
      : '';
  };
  console.log("[SUBMIT-PRO] 🚀 Réception d'une nouvelle demande de référencement.");
  
  const idToken =
    getFormString('idToken');

  if (!idToken) {
    return {
      error:
        "Votre session n'a pas pu être vérifiée. Reconnectez-vous puis réessayez.",
    };
  }

  let decodedToken;

  try {
    decodedToken =
      await getAdminAuth().verifyIdToken(
        idToken
      );
  } catch (error) {
    console.error(
      '[SUBMIT-PRO] Token Firebase invalide:',
      error
    );

    return {
      error:
        "Votre session a expiré. Reconnectez-vous puis réessayez.",
    };
  }

  if (
    decodedToken.email_verified !== true
  ) {
    return {
      error:
        "Vous devez valider votre adresse e-mail avant d'envoyer une demande de fiche.",
    };
  }

  const verifiedEmail =
    typeof decodedToken.email === 'string'
      ? decodedToken.email.trim().toLowerCase()
      : '';

  if (!verifiedEmail) {
    return {
      error:
        "Aucune adresse e-mail valide n'est associée à ce compte.",
    };
  }
  const rawData = {
    businessName:
      getFormString('name'),

    categoryRequested:
      getFormString('category'),

    appSectionRequested:
      getFormString('appSection'),

    addressRaw:
      getFormString('address'),
    locationMode: getFormString('locationMode'),
    streetNumber: getFormString('streetNumber'),
    street: getFormString('street'),
    postalCode: getFormString('postalCode'),
    city: getFormString('city'),

    phone:
      getFormString('phone'),

    email:
      verifiedEmail,

    website:
      getFormString('website'),

    description:
      getFormString('description'),

    facebook:
      getFormString('facebook'),

    instagram:
      getFormString('instagram'),

    hp_field:
      getFormString('hp_field'),

    horaires:
      getFormString('horaires'),

    imageUrl:
      getFormString('imageUrl'),
  };

  console.log('[SUBMIT-PRO] rawData reçu:', JSON.stringify(rawData));
  const validated = submissionSchema.safeParse(rawData);

  if (!validated.success) {
    console.log('[SUBMIT-PRO] ❌ Zod errors:', JSON.stringify(validated.error.errors));
    return { error: validated.error.errors[0].message };
  }

  if (validated.data.locationMode === 'physical' && validated.data.street.length < 3) {
    return { error: 'La rue ou le lieu-dit est requis pour une adresse physique.' };
  }
  const postalCode = validated.data.postalCode;
  const majorCityName = postalCode === '75000' || /^750(0[1-9]|1[0-9]|20)$/.test(postalCode)
      ? 'Paris'
      : postalCode === '69000' || /^6900[1-9]$/.test(postalCode)
        ? 'Lyon'
        : postalCode === '13000' || /^130(0[1-9]|1[0-6])$/.test(postalCode)
          ? 'Marseille'
          : null;
  if (majorCityName) {
    if (validated.data.city !== majorCityName) {
      return { error: 'La ville selectionnee ne correspond pas au code postal.' };
    }
  } else {
    // Reference officielle : aucune demande enregistree avec une paire CP/ville invalide.
    try {
      const postalCode = validated.data.postalCode;
      const params = new URLSearchParams({ codePostal: postalCode, fields: 'nom,code,codesPostaux', format: 'json' });
      const response = await fetch('https://geo.api.gouv.fr/communes?' + params.toString(), {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return { error: 'Verification de la commune indisponible. Reessayez.' };
      const communes: unknown = await response.json();
      const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').replace(/[^a-z0-9]/g, '');
      const matching = Array.isArray(communes) && communes.some((item: any) =>
        typeof item?.nom === 'string' && Array.isArray(item.codesPostaux) &&
        item.codesPostaux.includes(postalCode) &&
        normalize(item.nom) === normalize(validated.data.city)
      );
      if (!matching) return { error: 'La ville selectionnee ne correspond pas au code postal.' };
    } catch {
      return { error: 'Verification des communes indisponible. Reessayez.' };
    }
  }
  const canonicalAddress = [
    ...(validated.data.locationMode === 'physical'
      ? [[validated.data.streetNumber, validated.data.street].filter(Boolean).join(' ')]
      : []),
    [validated.data.postalCode, validated.data.city].join(' '),
  ].filter(Boolean).join(', ');

  if (validated.data.hp_field && validated.data.hp_field.length > 0) {
    return { error: "Erreur de validation (bot protection)" };
  }

  try {
    // Utilisation stricte du SDK Admin pour la base de données côté serveur
    const db = getAdminFirestore();
    const coords = extractValidCoordinates({ address: canonicalAddress });

    const docRef = await db.collection('listing_submissions').add({
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'public_form',
      businessName: validated.data.businessName,
      categoryRequested: validated.data.categoryRequested,
      appSectionRequested: validated.data.appSectionRequested,
      addressRaw: canonicalAddress,
      locationMode: validated.data.locationMode,
      streetNumber: validated.data.locationMode === 'physical' ? validated.data.streetNumber : '',
      street: validated.data.locationMode === 'physical' ? validated.data.street : '',
      postalCode: validated.data.postalCode,
      city: validated.data.city,
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
      horaires: validated.data.horaires ? JSON.parse(validated.data.horaires) : {},
      imageUrl: validated.data.imageUrl || '',
      googleMapsUrl: '',
      requestedByUid: decodedToken.uid,
      requestedByEmail: verifiedEmail,
      sourceEmailVerified: true,
      submittedData: {
        businessName: validated.data.businessName,
        categoryRequested: validated.data.categoryRequested,
        appSectionRequested: validated.data.appSectionRequested,
        addressRaw: canonicalAddress,
        locationMode: validated.data.locationMode,
        streetNumber: validated.data.locationMode === 'physical' ? validated.data.streetNumber : '',
        street: validated.data.locationMode === 'physical' ? validated.data.street : '',
        postalCode: validated.data.postalCode,
        city: validated.data.city,
        phone: validated.data.phone,
        email: verifiedEmail,
        website: validated.data.website || '',
        facebook: validated.data.facebook || '',
        instagram: validated.data.instagram || '',
        description: validated.data.description || '',
        horaires: validated.data.horaires ? JSON.parse(validated.data.horaires) : {},
        imageUrl: validated.data.imageUrl || '',
      },
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
        <p style="color:#71717a;font-size:13px;margin:4px 0 0;">Adresse : ${canonicalAddress}</p>
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

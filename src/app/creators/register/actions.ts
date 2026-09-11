'use server';

import { z } from 'zod';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { slugify } from '@/lib/utils';
import { resolveFrenchCommune } from '@/lib/france-commune';

const optionalUrl =
  z
    .string()
    .trim()
    .url('URL invalide')
    .optional()
    .or(z.literal(''));

const creatorSchema = z.object({
  displayName:
    z
      .string()
      .trim()
      .min(
        2,
        'Le nom est trop court'
      ),

  creatorType:
    z
      .string()
      .trim()
      .min(
        2,
        'Le métier est requis'
      ),

  specialties:
    z
      .string()
      .trim()
      .min(
        2,
        'Au moins une spécialité est requise'
      ),

  city:
    z
      .string()
      .trim()
      .min(
        2,
        'La ville de base est requise'
      ),

  departement:
    z
      .string()
      .trim()
      .min(
        1,
        'Le département est requis'
      ),

  serviceArea:
    z
      .string()
      .trim()
      .max(160)
      .optional()
      .or(z.literal('')),

  instagramUrl:
    z
      .string()
      .trim()
      .max(250)
      .optional()
      .or(z.literal('')),

  website:
    optionalUrl,

  facebookUrl:
    optionalUrl,

  phoneNumber:
    z
      .string()
      .trim()
      .max(40)
      .optional()
      .or(z.literal('')),

  photoUrl:
    optionalUrl,

  email:
    z
      .string()
      .trim()
      .email(
        'Adresse e-mail invalide'
      ),

  info:
    z
      .string()
      .trim()
      .max(1000)
      .optional()
      .or(z.literal('')),

  hasPublicLocation:
    z.boolean(),

  publicAddress:
    z
      .string()
      .trim()
      .max(300)
      .optional()
      .or(z.literal('')),

  hp_field:
    z
      .string()
      .max(
        0,
        'Spam détecté'
      )
      .optional(),
});

function normalizeInstagramUrl(
  value: string
): string {
  const raw =
    value.trim();

  if (!raw) {
    return '';
  }

  if (
    /^https?:\/\//i.test(raw)
  ) {
    return raw;
  }

  const handle =
    raw.replace(
      /^@/,
      ''
    );

  if (
    /^[a-zA-Z0-9._]+$/.test(
      handle
    )
  ) {
    return (
      'https://www.instagram.com/' +
      handle +
      '/'
    );
  }

  return raw;
}

export async function submitCreatorAction(
  formData: FormData
) {
  console.log(
    '[SUBMIT-CREATOR] Nouvelle demande créateur'
  );

  const idToken = String(formData.get('idToken') || '');
  if (!idToken) return { error: 'Session introuvable. Reconnectez-vous puis réessayez.' };

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return { error: 'Votre session a expiré. Reconnectez-vous puis réessayez.' };
  }

  if (decodedToken.email_verified !== true) {
    return { error: 'Validez votre adresse e-mail avant d’envoyer votre demande.' };
  }

  const verifiedEmail = typeof decodedToken.email === 'string'
    ? decodedToken.email.trim().toLowerCase()
    : '';

  if (!verifiedEmail) return { error: 'Aucune adresse e-mail valide n’est associée à ce compte.' };

  const rawData = {
    displayName:
      String(
        formData.get(
          'displayName'
        ) || ''
      ),

    creatorType:
      String(
        formData.get(
          'creatorType'
        ) || ''
      ),

    specialties:
      String(
        formData.get(
          'specialties'
        ) || ''
      ),

    city:
      String(
        formData.get(
          'city'
        ) || ''
      ),

    departement:
      String(
        formData.get(
          'departement'
        ) || ''
      ),

    serviceArea:
      String(
        formData.get(
          'serviceArea'
        ) || ''
      ),

    instagramUrl:
      String(
        formData.get(
          'instagramUrl'
        ) || ''
      ),

    website:
      String(
        formData.get(
          'website'
        ) || ''
      ),

    facebookUrl:
      String(
        formData.get(
          'facebookUrl'
        ) || ''
      ),

    phoneNumber:
      String(
        formData.get(
          'phoneNumber'
        ) || ''
      ),

    photoUrl:
      String(
        formData.get(
          'photoUrl'
        ) || ''
      ),

    email:
      verifiedEmail,

    info:
      String(
        formData.get(
          'info'
        ) || ''
      ),

    hasPublicLocation:
      formData.get(
        'hasPublicLocation'
      ) === 'on',

    publicAddress:
      String(
        formData.get(
          'publicAddress'
        ) || ''
      ),

    hp_field:
      String(
        formData.get(
          'hp_field'
        ) || ''
      ),
  };

  const validated =
    creatorSchema.safeParse(
      rawData
    );

  if (!validated.success) {
    console.log(
      '[SUBMIT-CREATOR] Zod errors:',
      JSON.stringify(
        validated.error.errors
      )
    );

    return {
      error:
        validated.error.errors[0]
          .message,
    };
  }

  if (
    validated.data
      .hasPublicLocation &&
    !validated.data
      .publicAddress
      ?.trim()
  ) {
    return {
      error:
        'L’adresse du studio ou local public est requise.',
    };
  }

  try {
    /*
     * Validation serveur obligatoire :
     * la commune doit exister et appartenir
     * au département sélectionné.
     */
    const commune =
      await resolveFrenchCommune(
        validated.data.city,
        validated.data.departement
      );

    if (!commune.ok) {
      if (
        commune.reason ===
        'department_mismatch'
      ) {
        return {
          error:
            'La ville indiquée ne correspond pas au département sélectionné.',
        };
      }

      if (
        commune.reason ===
        'not_found'
      ) {
        return {
          error:
            'La ville indiquée est introuvable dans le référentiel officiel français.',
        };
      }

      return {
        error:
          'Impossible de vérifier la ville pour le moment. Réessaie dans quelques instants.',
      };
    }

    const db =
      getAdminFirestore();

    const specialties =
      Array.from(
        new Set(
          validated.data
            .specialties
            .split(',')
            .map(
              item =>
                item.trim()
            )
            .filter(Boolean)
        )
      );

    const instagramUrl =
      normalizeInstagramUrl(
        validated.data
          .instagramUrl || ''
      );

    const resolvedCity =
      commune.name;

    const slug =
      slugify(
        validated.data
          .displayName +
        '-' +
        resolvedCity
      );

    const publicAddress =
      validated.data
        .hasPublicLocation
        ? (
            validated.data
              .publicAddress || ''
          ).trim()
        : '';

    const publicMapAddress =
      publicAddress ||
      resolvedCity;

    await db
      .collection(
        'listing_submissions'
      )
      .add({
        status:
          'pending',

        type:
          'creator',

        createdAt:
          new Date(),

        updatedAt:
          new Date(),

        source:
          'public_form',

        collectionName:
          'creators',

        appSection:
          'creator',

        title:
          validated.data
            .displayName,

        displayName:
          validated.data
            .displayName,

        creatorType:
          validated.data
            .creatorType,

        category:
          validated.data
            .creatorType,

        activite:
          validated.data
            .creatorType,

        specialties,

        specialite:
          specialties.join(', '),

        city:
          resolvedCity,

        ville:
          resolvedCity,

        publicLocationLabel:
          resolvedCity,

        departement:
          validated.data
            .departement,

        serviceArea:
          validated.data
            .serviceArea || '',

        hasPublicLocation:
          validated.data
            .hasPublicLocation,

        publicAddress,

        address:
          publicMapAddress,

        cityLatitude:
          commune.lat,

        cityLongitude:
          commune.lng,

        ...(
          !validated.data
            .hasPublicLocation
            ? {
                latitude:
                  commune.lat,
                longitude:
                  commune.lng,
              }
            : {}
        ),

        instagram:
          validated.data
            .instagramUrl || '',

        instagramUrl,

        website:
          validated.data
            .website || '',

        facebookUrl:
          validated.data
            .facebookUrl || '',

        phoneNumber:
          validated.data
            .phoneNumber || '',

        email:
          validated.data.email,

        info:
          validated.data
            .info || '',

        description:
          validated.data
            .info || '',

        photoUrl:
          validated.data
            .photoUrl || '',

        imgUrl:
          validated.data
            .photoUrl || '',

        slugCandidate:
          slug,

        notesAdmin:
          '',

        requestedByUid:
          decodedToken.uid,

        requestedByEmail:
          verifiedEmail,

        sourceEmailVerified:
          true,

        submittedData: {
          displayName: validated.data.displayName,
          creatorType: validated.data.creatorType,
          specialties,
          city: resolvedCity,
          departement: validated.data.departement,
          serviceArea: validated.data.serviceArea || '',
          instagramUrl,
          website: validated.data.website || '',
          facebookUrl: validated.data.facebookUrl || '',
          phoneNumber: validated.data.phoneNumber || '',
          email: verifiedEmail,
          info: validated.data.info || '',
          photoUrl: validated.data.photoUrl || '',
        },

        isClaimedRequested:
          true,
      });

    console.log(
      '[SUBMIT-CREATOR] Soumission enregistrée'
    );

    try {
      await fetch(
        'https://api.resend.com/emails',
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            from:
              'Label Moto <noreply@labelmoto.fr>',

            to: [
              validated.data.email,
            ],

            subject:
              'Label Moto - Demande de profil créateur reçue',

            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:32px 40px;text-align:center;">
                  <img src="https://labelmoto.fr/images/logo-moto.webp" alt="Label Moto" width="200" height="53" style="width:200px;"/>
                </div>

                <div style="padding:40px;">
                  <h1 style="font-size:22px;font-weight:800;color:#18181b;text-transform:uppercase;">
                    Demande reçue !
                  </h1>

                  <p style="color:#52525b;font-size:15px;line-height:1.7;">
                    Bonjour <strong>${validated.data.displayName}</strong>,
                  </p>

                  <p style="color:#52525b;font-size:15px;line-height:1.7;">
                    Nous avons bien reçu votre demande de profil créateur sur <strong>Label Moto</strong>. Notre équipe va examiner votre dossier sous <strong>48h</strong>.
                  </p>

                  <p style="color:#a1a1aa;font-size:13px;text-align:center;">
                    Vous serez contacté à cette adresse une fois votre profil validé.
                  </p>
                </div>
              </div>
            `,
          }),
        }
      );
    }
    catch (emailErr: any) {
      console.error(
        '[SUBMIT-CREATOR] Email non envoyé:',
        emailErr.message
      );
    }

    return {
      success: true,
    };
  }
  catch (e: any) {
    console.error(
      '[SUBMIT-CREATOR] Erreur:',
      e.message
    );

    return {
      error:
        e.message ||
        'Une erreur technique est survenue.',
    };
  }
}
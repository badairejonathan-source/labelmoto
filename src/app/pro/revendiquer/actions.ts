'use server';

import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import {
  domainsMatch,
  getEmailDomain,
  getWebsiteDomain,
  isAllowedProCollection,
} from '@/lib/pro-claim-utils';

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function submitClaimAction(formData: FormData) {
  const idToken = formString(formData, 'idToken');
  const targetCollection = formString(formData, 'targetCollection');
  const targetId = formString(formData, 'targetId');
  const roleInBusiness = formString(formData, 'roleInBusiness');
  const siret = formString(formData, 'siret').replace(/\D/g, '');
  const businessPhone = formString(formData, 'businessPhone');
  const proofNote = formString(formData, 'proofNote');

  if (!idToken) return { error: 'Session introuvable. Reconnectez-vous puis réessayez.' };
  if (!targetId || !isAllowedProCollection(targetCollection)) {
    return { error: 'Fiche invalide.' };
  }

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return { error: 'Votre session a expiré. Reconnectez-vous puis réessayez.' };
  }

  if (decodedToken.email_verified !== true) {
    return { error: 'Validez votre adresse e-mail avant de revendiquer une fiche.' };
  }

  const email = typeof decodedToken.email === 'string'
    ? decodedToken.email.trim().toLowerCase()
    : '';

  if (!email) return { error: 'Aucune adresse e-mail valide n’est associée à ce compte.' };

  const db = getAdminFirestore();
  const listingRef = db.collection(targetCollection).doc(targetId);
  const listingSnap = await listingRef.get();

  if (!listingSnap.exists) return { error: 'Cette fiche n’existe plus.' };

  const listing = listingSnap.data() || {};

  if (listing.ownerUid && listing.ownerUid !== decodedToken.uid) {
    return { error: 'Cette fiche est déjà rattachée à un autre compte professionnel.' };
  }

  if (listing.ownerUid === decodedToken.uid) {
    return { error: 'Cette fiche est déjà rattachée à votre compte.' };
  }

  const existing = await db
    .collection('modification_requests')
    .where('targetId', '==', targetId)
    .get();

  const hasPendingClaim = existing.docs.some(item => {
    const data = item.data();
    return data.requestType === 'claim' &&
      data.targetCollection === targetCollection &&
      data.status === 'pending';
  });

  if (hasPendingClaim) {
    return { error: 'Une demande de revendication est déjà en cours pour cette fiche.' };
  }

  const emailDomain = getEmailDomain(email);
  const websiteDomain = getWebsiteDomain(String(listing.website || ''));
  const domainMatch = domainsMatch(emailDomain, websiteDomain);

  if (!domainMatch) {
    if (!roleInBusiness) {
      return { error: 'Indiquez votre fonction dans l’établissement.' };
    }
    if (!businessPhone) {
      return { error: 'Indiquez un numéro de téléphone professionnel.' };
    }
    if (siret && siret.length !== 14) {
      return { error: 'Le SIRET doit contenir 14 chiffres.' };
    }
  }

  const request = {
    requestType: 'claim',
    targetCollection,
    targetId,
    targetTitle: String(listing.title || targetId),
    targetAddress: String(listing.address || ''),
    targetWebsite: String(listing.website || ''),
    targetPhone: String(listing.phoneNumber || ''),
    requestedByUid: decodedToken.uid,
    requestedByEmail: email,
    requestedByName: String(decodedToken.name || ''),
    verification: {
      emailVerified: true,
      emailDomain,
      websiteDomain,
      domainMatch,
      method: domainMatch ? 'email_domain' : 'manual',
      roleInBusiness: domainMatch ? '' : roleInBusiness,
      siret: domainMatch ? '' : siret,
      businessPhone: domainMatch ? '' : businessPhone,
      proofNote: domainMatch ? '' : proofNote,
    },
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await db.collection('modification_requests').add(request);

  return {
    success: true,
    requestId: docRef.id,
    domainMatch,
  };
}

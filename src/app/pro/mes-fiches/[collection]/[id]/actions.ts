'use server';

import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { isAllowedProCollection } from '@/lib/pro-claim-utils';

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;
const EDITABLE_FIELDS = [
  'title',
  'appSection',
  'address',
  'phoneNumber',
  'email',
  'website',
  'category',
  'info',
  'imageUrl',
  'instagramUrl',
  'facebookUrl',
  ...DAYS,
] as const;

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function submitOwnedModificationAction(formData: FormData) {
  const idToken = formString(formData, 'idToken');
  const targetCollection = formString(formData, 'targetCollection');
  const targetId = formString(formData, 'targetId');

  if (!idToken) return { error: 'Session introuvable. Reconnectez-vous puis réessayez.' };
  if (!targetId || !isAllowedProCollection(targetCollection)) return { error: 'Fiche invalide.' };

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return { error: 'Votre session a expiré. Reconnectez-vous puis réessayez.' };
  }

  if (decodedToken.email_verified !== true) {
    return { error: 'Validez votre adresse e-mail avant de modifier votre fiche.' };
  }

  const db = getAdminFirestore();
  const listingRef = db.collection(targetCollection).doc(targetId);
  const listingSnap = await listingRef.get();

  if (!listingSnap.exists) return { error: 'Cette fiche n’existe plus.' };

  const listing = listingSnap.data() || {};
  if (listing.ownerUid !== decodedToken.uid) {
    return { error: 'Vous n’êtes pas autorisé à modifier cette fiche.' };
  }

  const pending = await db
    .collection('modification_requests')
    .where('targetId', '==', targetId)
    .get();

  const hasPendingOwnerUpdate = pending.docs.some(item => {
    const data = item.data();
    return data.requestType === 'owner_update' &&
      data.targetCollection === targetCollection &&
      data.status === 'pending';
  });

  if (hasPendingOwnerUpdate) {
    return { error: 'Une demande de modification est déjà en attente pour cette fiche.' };
  }

  const currentValues: Record<string, string> = {};
  const newValues: Record<string, string> = {};
  const changes: Record<string, { old: string; new: string }> = {};

  for (const field of EDITABLE_FIELDS) {
    const oldValue = DAYS.includes(field as (typeof DAYS)[number])
      ? String(listing.horaires?.[field] ?? listing[field] ?? '')
      : field === 'imageUrl'
        ? String(listing.imageUrl ?? listing.imgUrl ?? '')
        : String(listing[field] ?? '');
    const newValue = formString(formData, field);

    currentValues[field] = oldValue;
    newValues[field] = newValue;

    if (oldValue !== newValue) {
      changes[field] = { old: oldValue, new: newValue };
    }
  }

  if (Object.keys(changes).length === 0) {
    return { error: 'Aucune modification détectée.' };
  }

  const email = typeof decodedToken.email === 'string'
    ? decodedToken.email.trim().toLowerCase()
    : '';

  const docRef = await db.collection('modification_requests').add({
    requestType: 'owner_update',
    targetCollection,
    targetId,
    targetTitle: String(listing.title || targetId),
    requestedByUid: decodedToken.uid,
    requestedByEmail: email,
    requestedByName: String(decodedToken.name || ''),
    changes,
    currentValues: {
      ...currentValues,
      googleMapsUrl: String(listing.googleMapsUrl || ''),
    },
    newValues,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { success: true, requestId: docRef.id };
}

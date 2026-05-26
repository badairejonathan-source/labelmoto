'use server';

/**
 * @fileOverview Server Actions pour l'administration de Label Moto.
 * Ces actions utilisent le SDK Admin pour contourner les Security Rules client.
 */

import { getAdminFirestore } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

// Liste des Master Admins autorisés (Synchro avec les rules)
const ADMIN_UIDS = [
  "A36FqeWBHjQBLKQMaMSiFVBzGV22",
  "A366V1X8Hqf1pA63nU3N8B7l8fD3",
  "f7xVfH8R8mS5v8H7N3nU3N8B7l8f"
];

const ADMIN_EMAILS = [
  "badjoe950@hotmail.com"
];

interface ReconciliationResult {
  success: boolean;
  message: string;
  count?: number;
  error?: string;
}

/**
 * Exécute la réconciliation des comptes hérités côté serveur.
 * @param callerUid L'ID de l'administrateur qui lance l'action.
 */
export async function reconcileLegacyUsersAction(callerUid: string): Promise<ReconciliationResult> {
  const db = getAdminFirestore();
  
  console.log(`[BACKEND] Début réconciliation lancée par: ${callerUid}`);

  try {
    // 1. Vérification stricte des droits admin
    const callerDoc = await db.collection('users').doc(callerUid).get();
    const callerData = callerDoc.data();
    const isMaster = ADMIN_UIDS.includes(callerUid) || (callerData?.email && ADMIN_EMAILS.includes(callerData.email));
    
    if (!isMaster && callerData?.role !== 'admin') {
      console.error(`[BACKEND] Accès refusé pour: ${callerUid}`);
      return { success: false, message: "Accès refusé. Droits insuffisants." };
    }

    // 2. Audit interne (on ne fait pas confiance au client pour la liste)
    const [usersSnap, stdSnap, proSnap] = await Promise.all([
      db.collection('users').get(),
      db.collection('standardProfiles').get(),
      db.collection('professionalProfiles').get()
    ]);

    const existingUserIds = new Set(usersSnap.docs.map(d => d.id));
    const batch = db.batch();
    let writeCount = 0;

    const processProfile = (docSnap: FirebaseFirestore.QueryDocumentSnapshot, type: 'user' | 'pro') => {
      if (!existingUserIds.has(docSnap.id)) {
        const data = docSnap.data();
        const userRef = db.collection('users').doc(docSnap.id);
        
        batch.set(userRef, {
          uid: docSnap.id,
          email: data.email || '',
          displayName: data.companyName || data.pseudo || data.displayName || (type === 'pro' ? 'Pro' : 'Motard'),
          role: type,
          status: 'active',
          emailVerifiedSync: false,
          onboardingComplete: true,
          legacyMigrated: true,
          createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          sourceProvider: 'backend_legacy_reconciliation'
        }, { merge: true });
        
        writeCount++;
        existingUserIds.add(docSnap.id); // Éviter les doublons si même UID dans les deux collections
      }
    };

    stdSnap.docs.forEach(d => processProfile(d, 'user'));
    proSnap.docs.forEach(d => processProfile(d, 'pro'));

    if (writeCount === 0) {
      return { success: true, message: "Aucun compte orphelin détecté. Base de données saine.", count: 0 };
    }

    // 3. Application du batch (limite de 500 dans Firestore Admin)
    // Pour cet MVP on traite les 500 premiers.
    console.log(`[BACKEND] Tentative de commit de ${writeCount} écritures...`);
    await batch.commit();
    console.log(`[BACKEND] Réconciliation réussie !`);

    revalidatePath('/admin');
    return { 
      success: true, 
      message: `Réconciliation terminée avec succès.`, 
      count: writeCount 
    };

  } catch (err: any) {
    console.error("[BACKEND] Erreur critique lors de la réconciliation:", err);
    return { success: false, message: "Erreur technique serveur.", error: err.message };
  }
}

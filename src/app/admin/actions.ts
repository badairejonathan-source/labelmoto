'use server';

/**
 * @fileOverview Server Actions pour la réconciliation robuste des comptes.
 * Utilise le SDK Admin pour garantir le succès des écritures sans dépendre des Security Rules client.
 */

import { getAdminFirestore } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';
import { revalidatePath } from 'next/cache';

// Liste des Master Admins autorisés (Synchronisée avec les règles de sécurité)
const ADMIN_UIDS = [
  "A36FqeWBHjQBLKQMaMSiFVBzGV22",
  "A366V1X8Hqf1pA63nU3N8B7l8fD3",
  "f7xVfH8R8mS5v8H7N3nU3N8B7l8f"
];

const ADMIN_EMAILS = [
  "badjoe950@hotmail.com"
];

export interface ReconciliationReport {
  success: boolean;
  message: string;
  timestamp: string;
  stats: {
    totalAnalyzed: number;
    created: number;
    ignored: number;
    errors: number;
  };
  details: { uid: string; status: 'created' | 'ignored' | 'error'; name: string; error?: string }[];
}

/**
 * Exécute la réconciliation complète des comptes hérités côté serveur.
 */
export async function reconcileLegacyUsersAction(callerUid: string): Promise<ReconciliationReport> {
  const db = getAdminFirestore();
  const report: ReconciliationReport = {
    success: false,
    message: "Initialisation...",
    timestamp: new Date().toISOString(),
    stats: { totalAnalyzed: 0, created: 0, ignored: 0, errors: 0 },
    details: []
  };

  console.log(`[BACKEND] 🚀 Début réconciliation lancée par: ${callerUid}`);

  try {
    // 1. Vérification stricte des droits admin
    const callerDoc = await db.collection('users').doc(callerUid).get();
    const callerData = callerDoc.data();
    const isMaster = ADMIN_UIDS.includes(callerUid) || (callerData?.email && ADMIN_EMAILS.includes(callerData.email));
    
    if (!isMaster && callerData?.role !== 'admin') {
      console.error(`[BACKEND] ❌ Accès refusé pour: ${callerUid}`);
      return { ...report, message: "Accès refusé. Droits administrateur requis.", success: false };
    }

    // 2. Audit interne (recalcul complet côté serveur)
    const [usersSnap, stdSnap, proSnap] = await Promise.all([
      db.collection('users').get(),
      db.collection('standardProfiles').get(),
      db.collection('professionalProfiles').get()
    ]);

    const existingUserIds = new Set(usersSnap.docs.map(d => d.id));
    let batch = db.batch();
    let pendingWrites = 0;

    const allProfiles = [
      ...stdSnap.docs.map(d => ({ snap: d, type: 'user' as const })),
      ...proSnap.docs.map(d => ({ snap: d, type: 'pro' as const }))
    ];

    report.stats.totalAnalyzed = allProfiles.length;

    for (const item of allProfiles) {
      const uid = item.snap.id;
      const data = item.snap.data();
      
      // On ignore les comptes déjà présents dans users/
      if (existingUserIds.has(uid)) {
        report.stats.ignored++;
        continue;
      }

      const displayName = data.companyName || data.pseudo || data.displayName || (item.type === 'pro' ? 'Professionnel' : 'Motard');

      try {
        // Préparation du document noyau users/{uid}
        const userRef = db.collection('users').doc(uid);
        
        // Sécurisation de la date de création (conversion si c'est un Timestamp Firestore Client)
        let creationDate = admin.firestore.FieldValue.serverTimestamp();
        if (data.createdAt) {
           if (typeof data.createdAt.toDate === 'function') {
             creationDate = data.createdAt.toDate();
           } else if (data.createdAt instanceof Date) {
             creationDate = data.createdAt;
           } else if (data.createdAt.seconds) {
             creationDate = new Date(data.createdAt.seconds * 1000);
           }
        }

        batch.set(userRef, {
          uid: uid,
          email: data.email || '',
          displayName: displayName,
          role: item.type,
          status: 'active',
          emailVerifiedSync: false,
          onboardingComplete: true,
          legacyMigrated: true,
          createdAt: creationDate,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          sourceProvider: 'backend_reconciliation_v3'
        }, { merge: true });

        pendingWrites++;
        report.stats.created++;
        report.details.push({ uid, status: 'created', name: displayName });
        existingUserIds.add(uid);

        // Limite Batch Firestore (500)
        if (pendingWrites >= 450) {
            await batch.commit();
            batch = db.batch();
            pendingWrites = 0;
        }
      } catch (err: any) {
        console.error(`[BACKEND] ❌ Erreur sur l'UID ${uid}:`, err.message);
        report.stats.errors++;
        report.details.push({ uid, status: 'error', name: displayName, error: err.message });
      }
    }

    // 3. Commit final si des écritures restent
    if (pendingWrites > 0) {
      await batch.commit();
    }

    console.log(`[BACKEND] ✅ Réconciliation terminée. Créés: ${report.stats.created}, Erreurs: ${report.stats.errors}`);

    revalidatePath('/admin');
    return { 
      ...report, 
      success: true, 
      message: `Réconciliation terminée. ${report.stats.created} créés, ${report.stats.errors} erreurs.`
    };

  } catch (err: any) {
    console.error("[BACKEND] ❌ Erreur critique lors de la réconciliation:", err);
    return { 
      ...report, 
      success: false, 
      message: "Erreur technique serveur : " + (err.message || "inconnue"), 
    };
  }
}

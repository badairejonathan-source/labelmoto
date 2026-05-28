'use server';

/**
 * @fileOverview Server Actions pour l'authentification et l'administration.
 * ISOLATION : Utilise exclusivement Firebase Admin pour éviter les fuites client.
 */

import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';
import * as admin from 'firebase-admin';
import { revalidatePath } from 'next/cache';

/**
 * Génère un lien de réinitialisation via Admin SDK et l'envoie via Resend.
 * Flux 100% Serveur.
 */
export async function sendCustomPasswordResetEmailAction(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  console.log(`[AUTH-ACTION] 🚀 Début du flux Reset Password pour: ${cleanEmail}`);

  try {
    const auth = getAdminAuth();
    
    // 1. Vérification de l'existence de l'utilisateur (Sécurité Admin)
    try {
      await auth.getUserByEmail(cleanEmail);
    } catch (e: any) {
      console.warn(`[AUTH-ACTION] ⚠️ Utilisateur non trouvé : ${cleanEmail}`);
      // On retourne un succès factice pour éviter le phishing d'emails (standard de sécurité)
      return { success: true };
    }

    // 2. Configuration du lien de retour (URL de production)
    const settings = {
      url: 'https://labelmoto.fr/login',
      handleCodeInApp: false, // Strictement FALSE pour redirection navigateur
    };
    
    console.log(`[AUTH-ACTION] 🔗 Génération du lien Firebase Admin...`);
    const link = await auth.generatePasswordResetLink(cleanEmail, settings);
    
    console.log(`[AUTH-ACTION] 📧 Appel du service Resend...`);
    const result = await emailService.sendPasswordReset(cleanEmail, link);
    
    if (!result.success) {
      throw new Error(result.error || "Échec de l'envoi e-mail");
    }

    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ ERREUR RESET PASSWORD:", error.message);
    return { 
      success: false, 
      error: error.message || "Une erreur technique serveur est survenue." 
    };
  }
}

// --- LOGIQUE DE RÉCONCILIATION ---

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

export async function reconcileLegacyUsersAction(callerUid: string): Promise<ReconciliationReport> {
  const startedAt = new Date();
  const report: ReconciliationReport = {
    success: false,
    message: "Initialisation...",
    timestamp: startedAt.toISOString(),
    stats: { totalAnalyzed: 0, created: 0, ignored: 0, errors: 0 },
    details: []
  };

  try {
    const db = getAdminFirestore();
    const callerDoc = await db.collection('users').doc(callerUid).get();
    const callerData = callerDoc.data();
    const isMaster = ADMIN_UIDS.includes(callerUid) || (callerData?.email && ADMIN_EMAILS.includes(callerData.email));
    
    if (!isMaster && callerData?.role !== 'admin') {
      return { ...report, message: "Accès refusé. Droits administrateur requis.", success: false };
    }

    const [usersSnap, stdSnap, proSnap] = await Promise.all([
      db.collection('users').get(),
      db.collection('standardProfiles').get(),
      db.collection('professionalProfiles').get()
    ]);

    const existingUserIds = new Set(usersSnap.docs.map(d => d.id));
    const allProfiles = [
      ...stdSnap.docs.map(d => ({ snap: d, type: 'user' as const })),
      ...proSnap.docs.map(d => ({ snap: d, type: 'pro' as const }))
    ];

    report.stats.totalAnalyzed = allProfiles.length;

    for (const item of allProfiles) {
      const uid = item.snap.id;
      const data = item.snap.data();
      
      if (existingUserIds.has(uid)) {
        report.stats.ignored++;
        continue;
      }

      const displayName = data.companyName || data.pseudo || data.displayName || (item.type === 'pro' ? 'Professionnel' : 'Motard');

      try {
        const userRef = db.collection('users').doc(uid);
        
        let creationDate: any = admin.firestore.FieldValue.serverTimestamp();
        if (data.createdAt) {
           if (typeof data.createdAt.toDate === 'function') {
             creationDate = data.createdAt.toDate();
           } else if (data.createdAt instanceof Date) {
             creationDate = data.createdAt;
           } else if (data.createdAt.seconds) {
             creationDate = new Date(data.createdAt.seconds * 1000);
           }
        }

        await userRef.set({
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
          sourceProvider: 'backend_reconciliation_v4_robust'
        }, { merge: true });

        report.stats.created++;
        report.details.push({ uid, status: 'created', name: displayName });
      } catch (err: any) {
        report.stats.errors++;
        report.details.push({ uid, status: 'error', name: displayName, error: err.message });
      }
    }

    const finishedAt = new Date();
    await db.collection('migration_runs').add({
        startedAt: admin.firestore.Timestamp.fromDate(startedAt),
        finishedAt: admin.firestore.Timestamp.fromDate(finishedAt),
        startedBy: callerUid,
        status: report.stats.errors > 0 ? 'completed_with_errors' : 'success',
        analyzedCount: report.stats.totalAnalyzed,
        createdCount: report.stats.created,
        skippedCount: report.stats.ignored,
        errorCount: report.stats.errors,
        details: report.details.slice(0, 100)
    });

    try { revalidatePath('/admin'); } catch (e) {}

    return { ...report, success: true, message: `Réconciliation terminée.` };
  } catch (err: any) {
    return { ...report, success: false, message: "Erreur technique : " + err.message };
  }
}

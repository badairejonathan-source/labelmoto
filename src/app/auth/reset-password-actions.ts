
'use server';

/**
 * @fileOverview PHASE A - Diagnostic de localisation du crash.
 * On court-circuite generatePasswordResetLink pour isoler Resend et getAdminAuth.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';

export async function sendCustomPasswordResetEmailAction(email: string) {
  console.log("[RESET_DIAG] [STEP_1] Entrée dans l'action");
  const cleanEmail = email.trim().toLowerCase();

  try {
    console.log("[RESET_DIAG] [STEP_2] Tentative getAdminAuth()");
    const auth = getAdminAuth();
    console.log("[RESET_DIAG] [STEP_3] Admin Auth initialisé avec succès");

    // PHASE A : On vérifie l'existence mais on ne génère pas de lien Firebase
    try {
      console.log("[RESET_DIAG] [STEP_4] Tentative getUserByEmail()");
      await auth.getUserByEmail(cleanEmail);
      console.log("[RESET_DIAG] [STEP_5] Utilisateur trouvé dans Auth");
    } catch (e: any) {
      console.log("[RESET_DIAG] [STEP_5_SKIP] Utilisateur non trouvé ou erreur Auth:", e.message);
      // On continue pour tester Resend même si l'user n'existe pas (test binaire)
    }

    // PHASE A : LIEN STATIQUE DE TEST
    const debugLink = "https://labelmoto.fr/login?debug-reset=1";
    console.log("[RESET_DIAG] [STEP_6] PHASE A - Utilisation d'un lien statique (bypass generatePasswordResetLink)");

    console.log("[RESET_DIAG] [STEP_7] Appel emailService.sendPasswordReset()");
    const result = await emailService.sendPasswordReset(cleanEmail, debugLink);
    
    if (result.success) {
      console.log("[RESET_DIAG] [STEP_8] Email envoyé avec succès : STEP_A_OK");
      return { success: true, message: "STEP_A_OK" };
    } else {
      console.error("[RESET_DIAG] [STEP_ERROR_RESEND] Erreur retournée par Resend:", result.error);
      throw new Error(result.error || "Erreur Resend inconnue");
    }

  } catch (error: any) {
    console.error("[RESET_DIAG] [FATAL_CRASH] Crash détecté !");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return { 
      success: false, 
      error: `DIAG_PHASE_A_FAILED: ${error.message}`,
      stack: error.stack // On renvoie le stack à l'UI pour lecture directe
    };
  }
}

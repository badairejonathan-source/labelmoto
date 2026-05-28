'use server';

/**
 * @fileOverview Server Actions pour l'authentification.
 * ISOLATION : Utilise exclusivement Firebase Admin. Aucun import de 'firebase/auth' (client).
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';
import { getActionCodeSettings } from '@/lib/auth-config';

/**
 * Génère et envoie un email de reset mot de passe HTML personnalisé via Resend.
 */
export async function sendCustomPasswordResetEmailAction(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  console.log(`[AUTH-ACTION] 🚀 Début envoi reset pour: ${cleanEmail}`);

  try {
    const auth = getAdminAuth();
    
    // Vérifier si l'utilisateur existe
    try {
      await auth.getUserByEmail(cleanEmail);
    } catch (e) {
      // Pour la sécurité, on ne dit pas si l'email existe, mais on log l'erreur
      console.warn(`[AUTH-ACTION] ⚠️ Utilisateur non trouvé pour reset: ${cleanEmail}`);
      return { success: true }; // On retourne true pour éviter le fishing d'emails
    }

    // Config web stricte
    const settings = getActionCodeSettings('/login');
    
    console.log(`[AUTH-ACTION] 🔗 Génération du lien de récupération...`);
    const link = await auth.generatePasswordResetLink(cleanEmail, settings as any);
    
    console.log(`[AUTH-ACTION] 📧 Envoi via Resend...`);
    const result = await emailService.sendPasswordReset(cleanEmail, link);
    
    if (!result.success) {
      throw new Error(result.error || "Échec de l'envoi");
    }

    console.log(`[AUTH-ACTION] ✅ Succès reset pour: ${cleanEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ ERREUR RESET:", error.message);
    return { 
      success: false, 
      error: "Une erreur technique est survenue. Merci de réessayer plus tard." 
    };
  }
}

'use server';

/**
 * @fileOverview Server Actions pour l'authentification premium (Resend).
 * ISOLATION : Utilise exclusivement Firebase Admin.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';

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
      console.warn(`[AUTH-ACTION] ⚠️ Utilisateur non trouvé pour reset: ${cleanEmail}`);
      return { success: true }; // Protection contre le phishing d'emails
    }

    // Config web stricte (isolée pour éviter les fuites d'imports client)
    const settings = {
      url: 'https://labelmoto.fr/login',
      handleCodeInApp: false,
    };
    
    console.log(`[AUTH-ACTION] 🔗 Génération du lien via Admin SDK...`);
    const link = await auth.generatePasswordResetLink(cleanEmail, settings);
    
    console.log(`[AUTH-ACTION] 📧 Envoi via Resend API...`);
    const result = await emailService.sendPasswordReset(cleanEmail, link);
    
    if (!result.success) {
      throw new Error(result.error || "Échec technique de l'envoi");
    }

    console.log(`[AUTH-ACTION] ✅ Succès reset pour: ${cleanEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ ERREUR CRITIQUE RESET:", error.message);
    return { 
      success: false, 
      error: error.message || "Une erreur technique est survenue." 
    };
  }
}

'use server';

/**
 * @fileOverview Server Actions pour la gestion premium de l'auth.
 * Utilise Firebase Admin pour générer les liens et Resend pour l'envoi.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';
import { getActionCodeSettings } from '@/lib/auth-config';

/**
 * Génère et envoie un email de validation HTML personnalisé.
 */
export async function sendCustomVerificationEmailAction(email: string) {
  console.log(`[AUTH-ACTION] 🚀 sendCustomVerificationEmailAction démarrée pour: ${email}`);
  try {
    const auth = getAdminAuth();
    const settings = getActionCodeSettings('/account');
    
    console.log(`[AUTH-ACTION] 🛠️ Génération du lien de vérification Firebase...`);
    const link = await auth.generateEmailVerificationLink(email, settings);
    console.log(`[AUTH-ACTION] 🔗 Lien généré avec succès.`);
    
    const result = await emailService.sendVerification(email, link);
    
    if (!result.success) {
      console.error(`[AUTH-ACTION] ❌ Échec de l'envoi de l'email:`, result.error);
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ Erreur Admin SDK:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Génère et envoie un email de reset mot de passe HTML personnalisé.
 */
export async function sendCustomPasswordResetEmailAction(email: string) {
  console.log(`[AUTH-ACTION] 🚀 sendCustomPasswordResetEmailAction démarrée pour: ${email}`);
  try {
    const auth = getAdminAuth();
    const settings = getActionCodeSettings('/login');
    
    console.log(`[AUTH-ACTION] 🛠️ Génération du lien de reset Firebase...`);
    const link = await auth.generatePasswordResetLink(email, settings);
    console.log(`[AUTH-ACTION] 🔗 Lien généré avec succès.`);
    
    const result = await emailService.sendPasswordReset(email, link);
    
    if (!result.success) {
      console.error(`[AUTH-ACTION] ❌ Échec de l'envoi de l'email:`, result.error);
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ Erreur Admin SDK:", error.message);
    return { success: false, error: error.message };
  }
}

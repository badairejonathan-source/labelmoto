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
  console.log(`[AUTH-ACTION] 🚀 sendCustomVerificationEmailAction pour: ${email}`);
  try {
    console.log(`[AUTH-ACTION] 1. Initialisation Admin Auth...`);
    const auth = getAdminAuth();
    
    console.log(`[AUTH-ACTION] 2. Récupération des réglages d'action...`);
    const settings = getActionCodeSettings('/account');
    
    console.log(`[AUTH-ACTION] 3. Génération du lien Firebase (Admin SDK)...`);
    const link = await auth.generateEmailVerificationLink(email, settings as any);
    console.log(`[AUTH-ACTION] 🔗 Lien généré avec succès.`);
    
    console.log(`[AUTH-ACTION] 4. Appel au service d'envoi d'email...`);
    const result = await emailService.sendVerification(email, link);
    
    if (!result.success) {
      console.error(`[AUTH-ACTION] ❌ Échec de l'envoi de l'email:`, result.error);
      return { success: false, error: result.error };
    }

    console.log(`[AUTH-ACTION] ✅ Flux terminé avec succès.`);
    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ Erreur critique serveur:", error.message);
    // On remonte l'erreur propre à l'UI
    return { success: false, error: error.message || "Erreur technique lors de la génération du lien." };
  }
}

/**
 * Génère et envoie un email de reset mot de passe HTML personnalisé.
 */
export async function sendCustomPasswordResetEmailAction(email: string) {
  console.log(`[AUTH-ACTION] 🚀 sendCustomPasswordResetEmailAction pour: ${email}`);
  try {
    console.log(`[AUTH-ACTION] 1. Initialisation Admin Auth...`);
    const auth = getAdminAuth();
    
    console.log(`[AUTH-ACTION] 2. Récupération des réglages d'action...`);
    const settings = getActionCodeSettings('/login');
    
    console.log(`[AUTH-ACTION] 3. Génération du lien Firebase (Admin SDK)...`);
    const link = await auth.generatePasswordResetLink(email, settings as any);
    console.log(`[AUTH-ACTION] 🔗 Lien généré avec succès.`);
    
    console.log(`[AUTH-ACTION] 4. Appel au service d'envoi d'email...`);
    const result = await emailService.sendPasswordReset(email, link);
    
    if (!result.success) {
      console.error(`[AUTH-ACTION] ❌ Échec de l'envoi de l'email:`, result.error);
      return { success: false, error: result.error };
    }

    console.log(`[AUTH-ACTION] ✅ Flux terminé avec succès.`);
    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ Erreur critique serveur:", error.message);
    return { success: false, error: error.message || "Erreur technique lors de la génération du lien." };
  }
}

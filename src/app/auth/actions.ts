'use server';

/**
 * @fileOverview Server Actions pour la gestion premium de l'auth.
 * SÉCURITÉ : Utilise exclusivement Firebase Admin pour éviter l'erreur .INTERNAL du SDK Client.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';
import { getActionCodeSettings } from '@/lib/auth-config';

/**
 * Génère et envoie un email de validation HTML personnalisé.
 */
export async function sendCustomVerificationEmailAction(email: string) {
  console.log(`[AUTH-ACTION] 🚀 Étape 1 : Entrée dans l'action pour ${email}`);
  try {
    const auth = getAdminAuth();
    console.log(`[AUTH-ACTION] 🛡️ Étape 2 : Firebase Admin Auth récupéré`);

    const settings = getActionCodeSettings('/account');
    console.log(`[AUTH-ACTION] ⚙️ Étape 3 : Réglages récupérés pour ${settings.url}`);

    // generateEmailVerificationLink est une méthode de Firebase Admin Auth
    const link = await auth.generateEmailVerificationLink(email, settings as any);
    console.log(`[AUTH-ACTION] 🔗 Étape 4 : Lien généré avec succès`);

    const result = await emailService.sendVerification(email, link);
    console.log(`[AUTH-ACTION] 📧 Étape 5 : Résultat de l'envoi Resend :`, result.success ? 'SUCCÈS' : 'ÉCHEC');
    
    if (!result.success) {
      return { success: false, error: result.error || "L'envoi de l'email a échoué côté fournisseur." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ ERREUR CRITIQUE SERVEUR :", error.message);
    console.error("[AUTH-ACTION] STACK :", error.stack);
    
    // Si l'erreur contient 'INTERNAL', c'est qu'un import client a fuité malgré tout
    const isInternalError = error.message?.includes('INTERNAL') || error.stack?.includes('firebase-auth.js');
    
    return { 
      success: false, 
      error: isInternalError 
        ? "Erreur d'architecture : le serveur a tenté d'utiliser le SDK Client." 
        : (error.message || "Erreur technique lors de la génération du lien.")
    };
  }
}

/**
 * Génère et envoie un email de reset mot de passe HTML personnalisé.
 */
export async function sendCustomPasswordResetEmailAction(email: string) {
  console.log(`[AUTH-ACTION] 🚀 Étape 1 : Entrée dans l'action Reset pour ${email}`);
  try {
    const auth = getAdminAuth();
    const settings = getActionCodeSettings('/login');
    
    console.log(`[AUTH-ACTION] 🔗 Étape 2 : Génération du lien de reset...`);
    const link = await auth.generatePasswordResetLink(email, settings as any);
    
    const result = await emailService.sendPasswordReset(email, link);
    console.log(`[AUTH-ACTION] 📧 Étape 3 : Résultat Resend :`, result.success ? 'SUCCÈS' : 'ÉCHEC');
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[AUTH-ACTION] ❌ ERREUR RESET SERVEUR :", error.message);
    return { success: false, error: error.message || "Erreur lors de la génération du lien de récupération." };
  }
}

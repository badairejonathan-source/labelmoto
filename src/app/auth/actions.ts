'use server';

/**
 * @fileOverview Server Actions pour l'authentification premium (Resend).
 * ISOLATION : Utilise exclusivement Firebase Admin pour éviter les fuites client.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';

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
    } catch (e) {
      console.warn(`[AUTH-ACTION] ⚠️ Utilisateur non trouvé : ${cleanEmail}`);
      // On retourne un succès pour éviter le phishing d'emails
      return { success: true };
    }

    // 2. Configuration du lien de retour (Obligatoire pour le web)
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
    console.error("[AUTH-ACTION] ❌ ERREUR FATALE RESET:", error.message);
    return { 
      success: false, 
      error: error.message || "Une erreur technique est survenue sur le serveur." 
    };
  }
}

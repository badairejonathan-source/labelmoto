'use server';

/**
 * @fileOverview Server Actions DÉDIÉES au flux de réinitialisation de mot de passe.
 * ISOLATION TOTALE : N'importe AUCUN fichier client ou SDK Firebase Client.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';

/**
 * Flux de reset via Resend.
 * Utilise exclusivement Firebase Admin pour éviter les fuites client.
 */
export async function sendCustomPasswordResetEmailAction(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  console.log(`[RESET-PASSWORD] 🚀 Début du flux pour: ${cleanEmail}`);

  try {
    const auth = getAdminAuth();
    
    // 1. Vérification de l'existence
    try {
      await auth.getUserByEmail(cleanEmail);
    } catch (e: any) {
      console.warn(`[RESET-PASSWORD] ⚠️ Utilisateur non trouvé : ${cleanEmail}`);
      return { success: true }; // Sécurité anti-phishing
    }

    // 2. Configuration du lien (Web Browser)
    const settings = {
      url: 'https://labelmoto.fr/login',
      handleCodeInApp: false, 
    };
    
    console.log(`[RESET-PASSWORD] 🔗 Génération du lien via SDK Admin...`);
    const link = await auth.generatePasswordResetLink(cleanEmail, settings);
    
    console.log(`[RESET-PASSWORD] 📧 Appel Resend...`);
    const result = await emailService.sendPasswordReset(cleanEmail, link);
    
    if (!result.success) {
      throw new Error(result.error || "Échec de l'envoi");
    }

    return { success: true };
  } catch (error: any) {
    console.error("[RESET-PASSWORD] ❌ ERREUR:", error.message);
    return { 
      success: false, 
      error: error.message || "Une erreur technique serveur est survenue." 
    };
  }
}

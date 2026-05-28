'use server';

/**
 * @fileOverview Server Action ISOLÉE pour le reset de mot de passe.
 * SÉCURITÉ : N'importe AUCUN fichier de src/firebase/* (SDK Client).
 * Seul point d'entrée pour Resend + Admin SDK.
 */

import { getAdminAuth } from '@/lib/firebase-admin';
import { emailService } from '@/services/email-service';

export async function sendCustomPasswordResetEmailAction(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  console.log(`[RESET-PASSWORD] 🚀 Action isolée pour: ${cleanEmail}`);

  try {
    const auth = getAdminAuth();
    
    // Vérification silencieuse (anti-phishing)
    try {
      await auth.getUserByEmail(cleanEmail);
    } catch (e) {
      console.warn(`[RESET-PASSWORD] Utilisateur inconnu: ${cleanEmail}`);
      return { success: true }; 
    }

    const settings = {
      // URL brute de production pour éviter tout import de config client
      url: 'https://labelmoto.fr/login',
      handleCodeInApp: false, 
    };
    
    const link = await auth.generatePasswordResetLink(cleanEmail, settings);
    const result = await emailService.sendPasswordReset(cleanEmail, link);
    
    if (!result.success) {
      throw new Error(result.error || "Échec de l'envoi Resend");
    }

    return { success: true };
  } catch (error: any) {
    console.error("[RESET-PASSWORD] ❌ Erreur critique serveur:", error.message);
    return { 
      success: false, 
      error: error.message || "Une erreur technique serveur est survenue." 
    };
  }
}
